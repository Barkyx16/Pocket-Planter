// A searchable index of the app's tools and trackers. Much of the app lives a
// few levels deep (Collapsible ▸ Toggle ▸ Segmented ▸ section), so this lets the
// global search answer "where is X?" and jump to the right tab.
//
// `tab` feeds jumpToTab; `where` is the human breadcrumb shown as the subtitle.
export const FEATURE_INDEX = [
  // Watering & weather
  { name: "Watering Timer", emoji: "⏱️", tab: "garden", where: "Garden ▸ Tools ▸ Calc ▸ Timer", keywords: "water timer countdown soaker hose minutes" },
  { name: "Watering Volume Calculator", emoji: "💧", tab: "garden", where: "Garden ▸ Tools ▸ Calc ▸ Water", keywords: "water volume gallons litres how much bed pot" },
  { name: "Rain Barrel Tracker", emoji: "🛢️", tab: "weather", where: "Weather ▸ Rainfall", keywords: "rain barrel water storage collected level" },
  { name: "Rainfall Log", emoji: "🌧️", tab: "weather", where: "Weather ▸ Rainfall", keywords: "rain rainfall log weekly" },
  // Soil & feeding
  { name: "Soil Temperature Tracker", emoji: "🌡️", tab: "journal", where: "Journal ▸ Soil Test", keywords: "soil temperature thermometer sow germinate" },
  { name: "Soil pH Test Log", emoji: "🧪", tab: "journal", where: "Journal ▸ Soil Test", keywords: "soil ph acidity test lime sulfur" },
  { name: "Compost Tracker", emoji: "♻️", tab: "garden", where: "Garden ▸ Garden Care Tracker", keywords: "compost greens browns turn ratio ready" },
  { name: "Fertilizer Mixing Calculator", emoji: "🌾", tab: "garden", where: "Garden ▸ Tools ▸ Calc ▸ Feed", keywords: "fertilizer mix npk tbsp dilution strength" },
  { name: "Potting-Mix Calculator", emoji: "🪴", tab: "garden", where: "Garden ▸ Tools ▸ Calc ▸ Mix", keywords: "potting mix soil blend coir perlite recipe" },
  { name: "Pruning Schedule", emoji: "✂️", tab: "garden", where: "Garden ▸ Garden Care Tracker", keywords: "prune pruning trim cut schedule" },
  // Seeds & starting
  { name: "Seed Inventory", emoji: "🌱", tab: "garden", where: "Garden ▸ Tools ▸ Inventory", keywords: "seed inventory supplies stock reorder" },
  { name: "Germination Test", emoji: "🧫", tab: "garden", where: "Garden ▸ Tools ▸ Inventory", keywords: "germination viability sprout test paper towel" },
  { name: "Grow-Light Scheduler", emoji: "💡", tab: "garden", where: "Garden ▸ Tools ▸ Inventory", keywords: "grow light lamp seedling hours indoor" },
  { name: "Barcode Seed Scanner", emoji: "📷", tab: "garden", where: "Garden ▸ Tools ▸ Inventory", keywords: "scan barcode packet camera add seed" },
  // Planning & layout
  { name: "Companion Pair Checker", emoji: "🤝", tab: "garden", where: "Garden ▸ Tools ▸ Pairs", keywords: "companion planting pair friend foe neighbour check" },
  { name: "Moon Planting Calendar", emoji: "🌙", tab: "garden", where: "Garden ▸ Tools ▸ Moon", keywords: "moon lunar phase planting biodynamic" },
  { name: "Bloom Succession Planner", emoji: "🌸", tab: "garden", where: "Garden ▸ Tools ▸ Pollinators", keywords: "bloom flower pollinator succession gap nectar" },
  { name: "Garden Sites / Locations", emoji: "🏡", tab: "garden", where: "Garden ▸ Garden Map", keywords: "site location allotment home multiple plot" },
  { name: "Bed Planner", emoji: "🗺️", tab: "garden", where: "Garden ▸ Tools ▸ Bed", keywords: "bed planner spacing square foot layout" },
  { name: "Tool Maintenance Log", emoji: "🔧", tab: "garden", where: "Garden ▸ Tools ▸ Care", keywords: "tool maintenance sharpen clean oil blade" },
  // Chores & reminders
  { name: "Custom Reminders", emoji: "🔔", tab: "settings", where: "Settings ▸ Custom Tasks", keywords: "reminder task recurring custom notification" },
  { name: "Chore Rotation", emoji: "🔁", tab: "settings", where: "Settings ▸ Custom Tasks", keywords: "chore rotation household family assign share" },
  // Export & data
  { name: "Calendar Export", emoji: "📅", tab: "settings", where: "Settings ▸ Data & Backup", keywords: "calendar export ics reminder device" },
  { name: "Plant Labels & QR Tags", emoji: "🏷️", tab: "garden", where: "Garden ▸ Tools ▸ Export", keywords: "label qr stake print tag plant" },
  { name: "Backup & Restore", emoji: "📦", tab: "settings", where: "Settings ▸ Data & Backup", keywords: "backup restore export data csv save" },
  { name: "Garden Plan Export", emoji: "📤", tab: "garden", where: "Garden ▸ Tools ▸ Export", keywords: "garden plan export share layout" },
];

export function searchFeatures(query, limit = 8) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  return FEATURE_INDEX.filter(
    (f) => f.name.toLowerCase().includes(q) || (f.keywords || "").includes(q)
  ).slice(0, limit);
}

export default FEATURE_INDEX;
