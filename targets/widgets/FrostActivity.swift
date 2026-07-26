import ActivityKit
import WidgetKit
import SwiftUI

// Live Activity for a frost countdown. IMPORTANT: this ActivityAttributes type
// must be compiled into BOTH the widget extension (to render, here) AND the main
// app / local Expo module (to start & end the activity). With @bacons/apple-
// targets, share this file with both targets, or duplicate the identical struct
// in the module — the type name + fields must match exactly.

struct FrostActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var frostDate: String // ISO-8601, e.g. "2026-11-15"
    var minTempF: Int
  }
  var zone: String?
}

@available(iOS 16.1, *)
struct FrostLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: FrostActivityAttributes.self) { context in
      // Lock-screen / banner presentation.
      HStack(spacing: 12) {
        Text("❄️").font(.system(size: 30))
        VStack(alignment: .leading, spacing: 2) {
          Text("Frost coming").font(.system(size: 15, weight: .heavy))
          Text("Low \(context.state.minTempF)° — cover tender plants")
            .font(.system(size: 12, weight: .medium)).foregroundStyle(.secondary)
        }
        Spacer()
        if let d = isoDate(context.state.frostDate) {
          Text(d, style: .relative).font(.system(size: 13, weight: .bold)).monospacedDigit()
        }
      }
      .padding(14)
      .activityBackgroundTint(Color.black.opacity(0.25))
      .widgetURL(URL(string: "pocketplanter://weather"))
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) { Text("❄️").font(.title2) }
        DynamicIslandExpandedRegion(.trailing) {
          if let d = isoDate(context.state.frostDate) {
            Text(d, style: .relative).font(.system(size: 14, weight: .bold)).monospacedDigit()
          }
        }
        DynamicIslandExpandedRegion(.bottom) {
          Text("Frost — low \(context.state.minTempF)°. Cover tender plants & shelter pots.")
            .font(.system(size: 12, weight: .semibold))
        }
      } compactLeading: {
        Text("❄️")
      } compactTrailing: {
        Text("\(context.state.minTempF)°").font(.system(size: 13, weight: .bold))
      } minimal: {
        Text("❄️")
      }
    }
  }
}

private func isoDate(_ s: String) -> Date? {
  let f = ISO8601DateFormatter()
  f.formatOptions = [.withFullDate]
  return f.date(from: s) ?? DateFormatter.yyyyMMdd.date(from: s)
}

private extension DateFormatter {
  static let yyyyMMdd: DateFormatter = {
    let d = DateFormatter(); d.dateFormat = "yyyy-MM-dd"; d.timeZone = .current; return d
  }()
}
