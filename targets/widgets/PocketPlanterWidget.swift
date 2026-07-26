import WidgetKit
import SwiftUI

// MARK: - Timeline

struct PPEntry: TimelineEntry {
  let date: Date
  let snapshot: GardenSnapshot
}

struct PPProvider: TimelineProvider {
  func placeholder(in context: Context) -> PPEntry {
    PPEntry(date: Date(), snapshot: .empty)
  }
  func getSnapshot(in context: Context, completion: @escaping (PPEntry) -> Void) {
    completion(PPEntry(date: Date(), snapshot: GardenSnapshot.load()))
  }
  func getTimeline(in context: Context, completion: @escaping (Timeline<PPEntry>) -> Void) {
    // The app reloads timelines whenever garden state changes; this is just a
    // safety refresh so a widget never goes stale if the app isn't opened.
    let entry = PPEntry(date: Date(), snapshot: GardenSnapshot.load())
    let next = Calendar.current.date(byAdding: .hour, value: 3, to: Date()) ?? Date().addingTimeInterval(10800)
    completion(Timeline(entries: [entry], policy: .after(next)))
  }
}

// MARK: - "What matters most right now" (frost > heat > water > harvest > streak)

struct Headline {
  let emoji: String
  let title: String
  let subtitle: String
  let tint: Color
  let route: String // pocketplanter://<route>
}

func widgetURL(_ route: String) -> URL? { URL(string: "pocketplanter://\(route)") }

func makeHeadline(_ s: GardenSnapshot) -> Headline {
  if let f = s.frost, f.daysOut <= 1 {
    return Headline(emoji: "❄️",
                    title: f.daysOut == 0 ? "Frost tonight" : "Frost tomorrow",
                    subtitle: "Low \(f.minTempF)° — cover tender plants",
                    tint: Color(red: 0.42, green: 0.78, blue: 1.0), route: "weather")
  }
  if let h = s.heat {
    return Headline(emoji: "🔥",
                    title: "Extreme heat",
                    subtitle: "High \(h.maxTempF)° — water early, add shade",
                    tint: Color(red: 1.0, green: 0.62, blue: 0.26), route: "weather")
  }
  if let w = s.waterDue, w.count > 0 {
    return Headline(emoji: "💧",
                    title: "\(w.count) to water",
                    subtitle: w.names.prefix(3).joined(separator: ", "),
                    tint: Color(red: 0.42, green: 0.78, blue: 1.0), route: "water")
  }
  if let hv = s.harvestReady, hv.count > 0 {
    return Headline(emoji: "🎉",
                    title: "\(hv.count) to harvest",
                    subtitle: hv.names.prefix(3).joined(separator: ", "),
                    tint: Color(red: 1.0, green: 0.85, blue: 0.42), route: "harvest")
  }
  return Headline(emoji: "🌱",
                  title: "All caught up",
                  subtitle: "Nothing urgent today",
                  tint: Color(red: 0.36, green: 1.0, blue: 0.54), route: "open")
}

// MARK: - Views

struct StatChip: View {
  let emoji: String
  let value: String
  let label: String
  var body: some View {
    HStack(spacing: 4) {
      Text(emoji).font(.system(size: 12))
      Text(value).font(.system(size: 13, weight: .heavy))
      Text(label).font(.system(size: 11, weight: .semibold)).foregroundStyle(.secondary)
    }
  }
}

struct PPWidgetView: View {
  @Environment(\.widgetFamily) var family
  let entry: PPEntry

  var body: some View {
    let s = entry.snapshot
    let h = makeHeadline(s)

    switch family {
    case .systemSmall:
      VStack(alignment: .leading, spacing: 6) {
        Text(h.emoji).font(.system(size: 30))
        Spacer(minLength: 0)
        Text(h.title).font(.system(size: 16, weight: .heavy)).foregroundStyle(h.tint)
        Text(h.subtitle).font(.system(size: 11, weight: .medium)).foregroundStyle(.secondary).lineLimit(2)
        if let streak = s.streak, streak > 1 {
          Text("🔥 \(streak)-day streak").font(.system(size: 10, weight: .bold)).foregroundStyle(.orange)
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
      .widgetURL(widgetURL(h.route)) // whole small widget taps into the relevant tab

    default: // .systemMedium
      VStack(alignment: .leading, spacing: 8) {
        HStack(spacing: 8) {
          Text(h.emoji).font(.system(size: 26))
          VStack(alignment: .leading, spacing: 1) {
            Text(h.title).font(.system(size: 17, weight: .heavy)).foregroundStyle(h.tint)
            Text(h.subtitle).font(.system(size: 12, weight: .medium)).foregroundStyle(.secondary).lineLimit(1)
          }
          Spacer()
        }
        Divider()
        HStack(spacing: 14) {
          Link(destination: widgetURL("water")!) { StatChip(emoji: "💧", value: "\(s.waterDue?.count ?? 0)", label: "to water") }
          Link(destination: widgetURL("harvest")!) { StatChip(emoji: "🎉", value: "\(s.harvestReady?.count ?? 0)", label: "to harvest") }
          StatChip(emoji: "🔥", value: "\(s.streak ?? 0)", label: "streak")
        }
        if let pick = s.plantPick {
          Link(destination: widgetURL("plant/\(pick.name.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? pick.name)")!) {
            Text("🌟 Plant pick: \(pick.name)").font(.system(size: 11, weight: .semibold)).foregroundStyle(.secondary)
          }
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      .widgetURL(widgetURL(h.route)) // taps outside a Link fall back to the headline route
    }
  }
}

// MARK: - Widget

struct PocketPlanterWidget: Widget {
  let kind = "PocketPlanterWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: PPProvider()) { entry in
      if #available(iOS 17.0, *) {
        PPWidgetView(entry: entry).containerBackground(.fill.tertiary, for: .widget)
      } else {
        PPWidgetView(entry: entry).padding()
      }
    }
    .configurationDisplayName("Pocket Planter")
    .description("Today's garden at a glance — watering, frost, and harvests.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
