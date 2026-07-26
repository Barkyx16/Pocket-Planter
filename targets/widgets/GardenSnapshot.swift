import Foundation

// Mirrors the JSON written by buildWidgetSnapshot() in core.js. All fields are
// optional so a partial/older payload still decodes.

struct WaterDue: Codable { let count: Int; let names: [String] }
struct HarvestReady: Codable { let count: Int; let names: [String] }
struct FrostInfo: Codable { let daysOut: Int; let minTempF: Int; let date: String }
struct HeatInfo: Codable { let maxTempF: Int }
struct PlantPick: Codable { let name: String; let image: String? }

struct GardenSnapshot: Codable {
  var updatedAt: Double?
  var zone: String?
  var waterDue: WaterDue?
  var harvestReady: HarvestReady?
  var frost: FrostInfo?
  var heat: HeatInfo?
  var streak: Int?
  var plantPick: PlantPick?

  static let appGroup = "group.green.pocketplanter.widgets"
  static let key = "gardenSnapshot"

  static let empty = GardenSnapshot(
    updatedAt: nil, zone: nil, waterDue: nil, harvestReady: nil,
    frost: nil, heat: nil, streak: 0, plantPick: nil
  )

  /// Read the latest snapshot the app wrote to the shared App Group.
  static func load() -> GardenSnapshot {
    guard
      let defaults = UserDefaults(suiteName: appGroup),
      let json = defaults.string(forKey: key),
      let data = json.data(using: .utf8),
      let snapshot = try? JSONDecoder().decode(GardenSnapshot.self, from: data)
    else { return .empty }
    return snapshot
  }
}
