// @bacons/apple-targets config for the Pocket Planter WidgetKit extension.
// `npx expo prebuild -p ios` reads this and generates the Xcode target from the
// Swift files in this folder. Requires the plugin in app.json:
//   "plugins": [ ["@bacons/apple-targets", { "appleTeamId": "YOUR_TEAM_ID" }] ]
//
/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: "widget",
  name: "PocketPlanterWidgets",
  // Shared App Group so the extension can read the snapshot the app writes.
  entitlements: {
    "com.apple.security.application-groups": ["group.green.pocketplanter.widgets"],
  },
  frameworks: ["SwiftUI", "WidgetKit"],
  deploymentTarget: "16.0",
};
