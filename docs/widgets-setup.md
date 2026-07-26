# Home-screen Widgets, Live Activities & Watch — setup

The **JS side is done and shipping-safe** (`buildWidgetSnapshot` in `core.js`,
`syncWidgets` in `lib/widgets.js`, and the sync effect in `App.js`). The app
already computes a fresh snapshot on every relevant state change and hands it to
`syncWidgets`, which **no-ops until the native target below exists** (it talks to
an optional `NativeModules.PocketPlanterWidgets`, `undefined` until built).

Remaining work is native and needs a prebuild + Xcode/EAS build — it can't be
verified in the JS repo alone.

## The snapshot contract

`syncWidgets(snapshot)` calls, when the native module is present:

```
PocketPlanterWidgets.setSnapshot(appGroup, key, jsonString)  // persist
PocketPlanterWidgets.reloadAllTimelines()                    // refresh widgets (iOS)
```

- App Group: `group.green.pocketplanter.widgets`  (`WIDGET_APP_GROUP`)
- Key: `gardenSnapshot`  (`WIDGET_KEY`)

Snapshot shape (all optional, small):

```jsonc
{
  "updatedAt": 1785000000000,
  "zone": "6b",
  "waterDue":     { "count": 3, "names": ["Tomato","Basil","Kale"] },
  "harvestReady": { "count": 1, "names": ["Tomato"] },
  "frost":        { "daysOut": 1, "minTempF": 33, "date": "2026-07-28" },
  "heat":         { "maxTempF": 97 },
  "streak": 12,
  "plantPick": { "name": "Kale", "image": "kale" }
}
```

## Which data feeds which surface

| Surface | Content |
|---|---|
| Small widget | `💧 {waterDue.count} to water` or, if frost, `❄️ Frost tonight {frost.minTempF}°` |
| Medium widget | water-due list + harvest-ready + streak |
| Lock-screen / inline | `💧 3` · `🎉 1` · `🔥 12` |
| **Live Activity / Dynamic Island** | frost countdown on frost nights (`frost.daysOut`/`date`), or watering-day progress |
| Watch complication | `waterDue.count` with a water glyph |
| Siri Shortcut | "log a harvest", "did I water today?" (App Intents → deep link) |

## Native steps

### 1. App Group (Apple Developer portal + entitlements)
Create App Group `group.green.pocketplanter.widgets`; enable it on both the main
app and the widget extension. Add to `app.json`:

```jsonc
"ios": {
  "entitlements": { "com.apple.security.application-groups": ["group.green.pocketplanter.widgets"] }
}
```

### 2. Add the widget extension (`@bacons/apple-targets`)  ✅ scaffold created
```
npx expo install @bacons/apple-targets
```
Add the plugin to `app.json` `plugins` (only after installing, or `expo` config
resolution errors):
```jsonc
"plugins": [ ["@bacons/apple-targets", { "appleTeamId": "YOUR_TEAM_ID" }] ]
```
The target files already exist in **`targets/widgets/`**:
- `expo-target.config.js` — type `widget`, App Group entitlement, frameworks
- `GardenSnapshot.swift` — `Codable` mirror of the JS payload + `.load()` from the App Group
- `PocketPlanterWidget.swift` — `TimelineProvider`, the frost>heat>water>harvest>streak headline, small + medium layouts
- `PocketPlanterWidgetBundle.swift` — `@main` bundle

`npx expo prebuild -p ios` turns this folder into the Xcode extension target.
(These Swift files need an Xcode build to compile-verify — they were written from
the contract, not built.)

### 3. The writer module `PocketPlanterWidgets` (main app → a LOCAL Expo module)
The JS calls `NativeModules.PocketPlanterWidgets.setSnapshot(group, key, json)` +
`reloadAllTimelines()`. In a managed app, add this as a **local Expo module**:
```
npx create-expo-module@latest --local pocket-planter-widgets
```
Then implement the module's iOS file so those two functions do:
```swift
import WidgetKit
// setSnapshot(group, key, json):
UserDefaults(suiteName: group)?.set(json, forKey: key)
// reloadAllTimelines():
if #available(iOS 14.0, *) { WidgetCenter.shared.reloadAllTimelines() }
```
Give the main app the same App Group entitlement (step 1). `lib/widgets.js`
already resolves this module via `NativeModules` and no-ops until it exists.

### 4. Widget reads the snapshot (already implemented)
`GardenSnapshot.load()` reads `UserDefaults(suiteName:)?.string(forKey:
"gardenSnapshot")` and JSON-decodes it; `PocketPlanterWidget.swift` renders with
priority **frost > heat > water due > harvest > streak**. Nothing to write here —
just build.

### 5. Frost Live Activity — Dynamic Island / lock-screen countdown  ✅ scaffold created
The JS controller is **done** (`updateFrostActivity` in `lib/widgets.js`, called
from `syncWidgets`): it starts an activity when `frost.daysOut <= 1`, dedupes an
unchanged frost, restarts on a new one, and ends when the risk passes. It calls:

```
PocketPlanterWidgets.startFrostActivity(dateISO, minTempF, zone)
PocketPlanterWidgets.endFrostActivity()
```

The extension UI is written in **`targets/widgets/FrostActivity.swift`**
(`FrostActivityAttributes` + `FrostLiveActivity` with lock-screen + Dynamic
Island presentations), registered in `PocketPlanterWidgetBundle`.

To finish, in the **local Expo module** (main app), implement the two calls:
```swift
import ActivityKit
// startFrostActivity(date, minTempF, zone):
if #available(iOS 16.1, *) {
  let attrs = FrostActivityAttributes(zone: zone)
  let state = FrostActivityAttributes.ContentState(frostDate: date, minTempF: minTempF)
  // end any existing frost activity first, then:
  _ = try? Activity.request(attributes: attrs, contentState: state, pushType: nil)
}
// endFrostActivity(): for act in Activity<FrostActivityAttributes>.activities { await act.end(nil, dismissalPolicy: .immediate) }
```

Requirements:
- Add **`NSSupportsLiveActivities`** = `true` to the **main app** `Info.plist`
  (via `app.json` `ios.infoPlist`).
- `FrostActivityAttributes` must be compiled into **both** the app/module target
  and the widget extension — share the file across targets (its name + fields
  must match exactly).

## Deep links (tap targets)  ✅ done

The URL scheme `pocketplanter` (app.json) and `handleDeepLink` in `App.js` already
route widget/shortcut taps — no native work needed beyond the `.widgetURL(...)` /
`Link(...)` already set in the Swift:

| URL | Opens |
|---|---|
| `pocketplanter://water` | Plants tab |
| `pocketplanter://weather` / `://frost` | Weather tab |
| `pocketplanter://harvest` | Garden tab |
| `pocketplanter://journal` | Journal tab |
| `pocketplanter://plant/<Name>` | that plant's detail (URL-encoded) |
| `pocketplanter://open` (or anything else) | Home |

Small widget → headline route; medium widget → per-chip `Link`s (water/harvest/plant);
frost Live Activity → Weather. Siri Shortcuts can reuse the same URLs via App Intents.

## Android
Mirror with a Glance `AppWidget`: the native module writes the JSON to shared
prefs; the widget reads and renders the same fields. Same `setSnapshot` contract.

## Verify
- `NativeModules.PocketPlanterWidgets` is defined after prebuild → `widgetsAvailable()` returns true.
- Water a plant / cross a frost forecast → widget updates within a timeline refresh.
