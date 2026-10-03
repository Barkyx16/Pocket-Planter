// A searchable index of the app's tools and trackers. Much of the app lives a
// few levels deep (Collapsible ▸ Toggle ▸ Segmented ▸ section), so this lets the
// global search answer "where is X?" and jump to the right tab.
//
// `tab` feeds jumpToTab; `where` is the human breadcrumb shown as the subtitle.
import { t } from "../lib/i18n";

// `name` and `where` here are English; localizeFeature() gives the display text.
export const FEATURE_INDEX = [
  // Watering & weather
  { id: "wateringTimer", name: "Watering Timer", emoji: "⏱️", tab: "garden", where: "Garden ▸ Tools ▸ Calc ▸ Timer", keywords: "water timer countdown soaker hose minutes" },
  { id: "wateringVolume", name: "Watering Volume Calculator", emoji: "💧", tab: "garden", where: "Garden ▸ Tools ▸ Calc ▸ Water", keywords: "water volume gallons litres how much bed pot" },
  { id: "rainBarrel", name: "Rain Barrel Tracker", emoji: "🛢️", tab: "weather", where: "Weather ▸ Rainfall", keywords: "rain barrel water storage collected level" },
  { id: "rainfallLog", name: "Rainfall Log", emoji: "🌧️", tab: "weather", where: "Weather ▸ Rainfall", keywords: "rain rainfall log weekly" },
  // Soil & feeding
  { id: "soilTemp", name: "Soil Temperature Tracker", emoji: "🌡️", tab: "journal", where: "Journal ▸ Soil Test", keywords: "soil temperature thermometer sow germinate" },
  { id: "soilPh", name: "Soil pH Test Log", emoji: "🧪", tab: "journal", where: "Journal ▸ Soil Test", keywords: "soil ph acidity test lime sulfur" },
  { id: "compost", name: "Compost Tracker", emoji: "♻️", tab: "garden", where: "Garden ▸ Garden Care Tracker", keywords: "compost greens browns turn ratio ready" },
  { id: "fertilizerCalc", name: "Fertilizer Mixing Calculator", emoji: "🌾", tab: "garden", where: "Garden ▸ Tools ▸ Calc ▸ Feed", keywords: "fertilizer mix npk tbsp dilution strength" },
  { id: "pottingMix", name: "Potting-Mix Calculator", emoji: "🪴", tab: "garden", where: "Garden ▸ Tools ▸ Calc ▸ Mix", keywords: "potting mix soil blend coir perlite recipe" },
  { id: "pruning", name: "Pruning Schedule", emoji: "✂️", tab: "garden", where: "Garden ▸ Garden Care Tracker", keywords: "prune pruning trim cut schedule" },
  // Seeds & starting
  { id: "seedInventory", name: "Seed Inventory", emoji: "🌱", tab: "garden", where: "Garden ▸ Tools ▸ Inventory", keywords: "seed inventory supplies stock reorder" },
  { id: "germination", name: "Germination Test", emoji: "🧫", tab: "garden", where: "Garden ▸ Tools ▸ Inventory", keywords: "germination viability sprout test paper towel" },
  { id: "growLight", name: "Grow-Light Scheduler", emoji: "💡", tab: "garden", where: "Garden ▸ Tools ▸ Inventory", keywords: "grow light lamp seedling hours indoor" },
  { id: "barcode", name: "Barcode Seed Scanner", emoji: "📷", tab: "garden", where: "Garden ▸ Tools ▸ Inventory", keywords: "scan barcode packet camera add seed" },
  // Planning & layout
  { id: "pairChecker", name: "Companion Pair Checker", emoji: "🤝", tab: "garden", where: "Garden ▸ Tools ▸ Pairs", keywords: "companion planting pair friend foe neighbour check" },
  { id: "moon", name: "Moon Planting Calendar", emoji: "🌙", tab: "garden", where: "Garden ▸ Tools ▸ Moon", keywords: "moon lunar phase planting biodynamic" },
  { id: "bloom", name: "Bloom Succession Planner", emoji: "🌸", tab: "garden", where: "Garden ▸ Tools ▸ Pollinators", keywords: "bloom flower pollinator succession gap nectar" },
  { id: "bedPlanner", name: "Bed Planner", emoji: "🗺️", tab: "garden", where: "Garden ▸ Tools ▸ Bed", keywords: "bed planner spacing square foot layout" },
  { id: "toolMaint", name: "Tool Maintenance Log", emoji: "🔧", tab: "garden", where: "Garden ▸ Tools ▸ Care", keywords: "tool maintenance sharpen clean oil blade" },
  // Chores & reminders
  { id: "customReminders", name: "Custom Reminders", emoji: "🔔", tab: "settings", where: "Settings ▸ Custom Tasks", keywords: "reminder task recurring custom notification" },
  { id: "choreRotation", name: "Chore Rotation", emoji: "🔁", tab: "settings", where: "Settings ▸ Custom Tasks", keywords: "chore rotation household family assign share" },
  // Export & data
  { id: "calendarExport", name: "Calendar Export", emoji: "📅", tab: "settings", where: "Settings ▸ Data & Backup", keywords: "calendar export ics reminder device" },
  { id: "plantLabels", name: "Plant Labels & QR Tags", emoji: "🏷️", tab: "garden", where: "Garden ▸ Tools ▸ Export", keywords: "label qr stake print tag plant" },
  { id: "backup", name: "Backup & Restore", emoji: "📦", tab: "settings", where: "Settings ▸ Data & Backup", keywords: "backup restore export data csv save" },
  { id: "planExport", name: "Garden Plan Export", emoji: "📤", tab: "garden", where: "Garden ▸ Tools ▸ Export", keywords: "garden plan export share layout" },
];

// The entry with its name and breadcrumb in the app language.
export function localizeFeature(f) {
  return { ...f, name: t(`features.${f.id}N`), where: t(`features.${f.id}W`) };
}

// Matches the translated name as well as the English name and keywords, so a
// search in the gardener's language finds the tool. Results are localized.
export function searchFeatures(query, limit = 8) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  return FEATURE_INDEX.map((f) => ({ f, local: localizeFeature(f) }))
    .filter(({ f, local }) => local.name.toLowerCase().includes(q) || f.name.toLowerCase().includes(q) || (f.keywords || "").includes(q))
    .slice(0, limit)
    .map(({ local }) => local);
}

export default FEATURE_INDEX;
