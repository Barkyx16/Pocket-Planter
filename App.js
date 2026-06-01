import React, { useEffect, useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Alert,
  Animated,
  Dimensions,
  Vibration,
  Image,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
// FIX #4: react-native-purchases is a native module — incompatible with Expo Go.
// Stubbed out so the app runs without crashing. Wire up real RevenueCat when
// you move to a custom dev build.
const Purchases = {
  configure: () => {},
  getOfferings: async () => ({ current: { availablePackages: [] } }),
};
import prismLogo from "./assets/prism-logo.png";
import zipZoneData from "./data/zipZoneData";
import produceData from "./data/produceData";
const loadingScreenImage = require("./assets/loading-screen.png");
const welcomeBuddyImage = require("./assets/welcome-buddy.png");
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const plantImages = {
  apple: require("./assets/plants/apple.png"),
  apricot: require("./assets/plants/apricot.png"),
  avocado: require("./assets/plants/avocado.png"),
  banana: require("./assets/plants/banana.png"),
  basil: require("./assets/plants/basil.png"),
  beet: require("./assets/plants/beet.png"),
  blackberry: require("./assets/plants/blackberry.png"),
  blueberry: require("./assets/plants/blueberry.png"),
  boysenberry: require("./assets/plants/boysenberry.png"),
  broccoli: require("./assets/plants/broccoli.png"),
  cabbage: require("./assets/plants/cabbage.png"),
  carrot: require("./assets/plants/carrot.png"),
  cauliflower: require("./assets/plants/cauliflower.png"),
  cherry: require("./assets/plants/cherry.png"),
  corn: require("./assets/plants/corn.png"),
  cranberry: require("./assets/plants/cranberry.png"),
  cucumber: require("./assets/plants/cucumber.png"),
  currant: require("./assets/plants/currant.png"),
  eggplant: require("./assets/plants/eggplant.png"),
  elderberry: require("./assets/plants/elderberry.png"),
  fennel: require("./assets/plants/fennel.png"),
  fig: require("./assets/plants/fig.png"),
  garlic: require("./assets/plants/garlic.png"),
  gooseberry: require("./assets/plants/gooseberry.png"),
  grapefruit: require("./assets/plants/grapefruit.png"),
  grapes: require("./assets/plants/grapes.png"),
  greenbean: require("./assets/plants/greenbean.png"),
  honeydew: require("./assets/plants/honeydew.png"),
  kale: require("./assets/plants/kale.png"),
  lemon_tree_variant: require("./assets/plants/lemon_tree_variant.png"),
  lemons: require("./assets/plants/lemons.png"),
  lettuce: require("./assets/plants/lettuce.png"),
  lime: require("./assets/plants/lime.png"),
  mandarin: require("./assets/plants/mandarin.png"),
  marigold: require("./assets/plants/marigold.png"),
  marionberry: require("./assets/plants/marionberry.png"),
  mulberry: require("./assets/plants/mulberry.png"),
  okra: require("./assets/plants/okra.png"),
  onion: require("./assets/plants/onion.png"),
  orange: require("./assets/plants/orange.png"),
  orange_tree_variant: require("./assets/plants/orange_tree_variant.png"),
  parsley: require("./assets/plants/parsley.png"),
  pea: require("./assets/plants/pea.png"),
  peach: require("./assets/plants/peach.png"),
  pear: require("./assets/plants/pear.png"),
  pepper: require("./assets/plants/pepper.png"),
  plum: require("./assets/plants/plum.png"),
  pomegranate: require("./assets/plants/pomegranate.png"),
  potato: require("./assets/plants/potato.png"),
  pumpkin: require("./assets/plants/pumpkin.png"),
  radish: require("./assets/plants/radish.png"),
  raspberry: require("./assets/plants/raspberry.png"),
  rosemary: require("./assets/plants/rosemary.png"),
  serviceberry: require("./assets/plants/serviceberry.png"),
  spinach: require("./assets/plants/spinach.png"),
  strawberry: require("./assets/plants/strawberry.png"),
  sweetpotato: require("./assets/plants/sweetpotato.png"),
  swiss_chard: require("./assets/plants/swiss_chard.png"),
  thyme: require("./assets/plants/thyme.png"),
  tomato: require("./assets/plants/tomato.png"),
  watermelon: require("./assets/plants/watermelon.png"),
  zucchini: require("./assets/plants/zucchini.png"),
  cilantro: require("./assets/plants/cilantro.png"),
  mint: require("./assets/plants/mint.png"),
  celery: require("./assets/plants/celery.png"),
  leek: require("./assets/plants/leek.png"),
  bok_choy: require("./assets/plants/bok_choy.png"),
  mango: require("./assets/plants/mango.png"),
};
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const PLANT_TYPES = ["All","Vegetables","Tree Fruits","Tropical Fruits","Berries","Herbs"];
const MONTH_LABELS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const STORAGE_KEYS = {
  zip: "pp_zip",
  savedPlants: "pp_savedPlants",
  dailyBonusDate: "pp_dailyBonusDate",
  dailyBonusXP: "pp_dailyBonusXP",
  plantNotes: "pp_plantNotes",
  followedPlants: "pp_followedPlants",
  journalEntries: "pp_journalEntries",
  selectedMonth: "pp_selectedMonth",
  selectedType: "pp_selectedType",
  remindersOn: "pp_remindersOn",
  frostAlertsOn: "pp_frostAlertsOn",
  appearanceMode: "pp_appearanceMode",
  subscriptionPlan: "pp_subscriptionPlan",
  premiumUnlocked: "pp_premiumUnlocked",
  gardenMap: "pp_gardenMap",
  wateredPlants: "pp_wateredPlants",
  harvestTrackers: "pp_harvestTrackers",
  wateringReminders: "pp_wateringReminders",
  streakData: "pp_streakData",
  seenPremiumIntro: "pp_seenPremiumIntro",
  seenOnboarding: "pp_seenOnboarding",
  profileName: "pp_profileName",
  profilePhoto: "pp_profilePhoto",
  profileTheme: "pp_profileTheme",  // ADD THIS LINE
};
const GARDEN_SLOTS = Array.from({ length: 12 }, (_, index) => ({
  id: `slot-${index + 1}`,
  label: `Plot ${index + 1}`,
}));
const RARITY_STYLES = {
  Common: { label: "Common", emoji: "🌱", color: "#2f7d46", bg: "#eaf8ee", border: "#bfe8ca" },
  Rare: { label: "Rare", emoji: "💎", color: "#315fd6", bg: "#edf3ff", border: "#bfd0ff" },
  Epic: { label: "Epic", emoji: "✨", color: "#7b3ff2", bg: "#f3edff", border: "#d8c8ff" },
  Legendary: { label: "Legendary", emoji: "🏆", color: "#bf7a12", bg: "#fff5dc", border: "#f6d28a" },
};
function normalizeZip(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 5);
}
function zoneNumber(zone) {
  const parsed = parseFloat(String(zone || "").replace(/[^\d.]/g, ""));
  return Number.isNaN(parsed) ? null : parsed;
}
function getClimateBucket(zone) {
  const value = zoneNumber(zone);
  if (value === null) return "moderate";
  if (value <= 5) return "cold";
  if (value <= 8) return "moderate";
  return "hot";
}
function normalizeType(type, name = "") {
  const value = String(type || "").trim();
  if (value === "Vegetable") return "Vegetables";
  if (value === "Fruit Tree") return "Tree Fruits";
  if (value === "Berry") return "Berries";
  if (value === "Herb") return "Herbs";
  if (value === "Fruit") return "Tropical Fruits";
  if (PLANT_TYPES.includes(value)) return value;
  const lower = String(name).toLowerCase();
  if (["apple","pear","peach","plum","cherry","fig","orange","lemon","lime","mandarin","grapefruit","pomegranate"].some((w) => lower.includes(w))) return "Tree Fruits";
  if (["banana","avocado","honeydew","watermelon"].some((w) => lower.includes(w))) return "Tropical Fruits";
  if (["berry","strawberry","blueberry","currant","grape"].some((w) => lower.includes(w))) return "Berries";
  if (["basil","mint","cilantro","parsley","oregano","thyme","rosemary"].some((w) => lower.includes(w))) return "Herbs";
  return "Vegetables";
}
function matchesType(item, selectedType) {
  if (selectedType === "All") return true;
  return normalizeType(item.type, item.name) === selectedType;
}
function zoneMatch(zone, minZone, maxZone) {
  const current = zoneNumber(zone);
  const min = zoneNumber(minZone);
  const max = zoneNumber(maxZone);
  if (current === null || min === null || max === null) return false;
  return current >= min && current <= max;
}
function getZipRecord(zip) {
  return zipZoneData.find((item) => normalizeZip(item.zipcode) === normalizeZip(zip));
}
function getCompatiblePlants(zone) {
  return produceData.filter((item) => zoneMatch(zone, item.minZone, item.maxZone));
}
const COMPANION_PLANTING_DATA = {
  Tomato: { excellent: ["Basil","Onion","Lettuce","Carrot"], neutral: ["Pepper","Spinach"], avoid: ["Potato","Corn","Cabbage"], pests: "Basil may help repel tomato hornworms and improve nearby tomato growth." },
  Potato: { excellent: ["Bean","Pea"], neutral: ["Corn"], avoid: ["Tomato","Pumpkin","Cucumber"], pests: "Potatoes planted near tomatoes may spread similar fungal diseases." },
  Carrot: { excellent: ["Tomato","Onion","Lettuce"], neutral: ["Pepper"], avoid: ["Potato"], pests: "Onions planted nearby may help deter carrot flies naturally." },
  Pepper: { excellent: ["Tomato","Basil","Onion"], neutral: ["Spinach"], avoid: ["Fennel"], pests: "Basil may help reduce aphids and improve pepper vigor." },
  Onion: { excellent: ["Carrot","Tomato","Lettuce"], neutral: ["Beet"], avoid: ["Bean","Pea"], pests: "Onions may help deter insects and improve nearby root crops." },
  Lettuce: { excellent: ["Carrot","Onion","Strawberry"], neutral: ["Spinach"], avoid: ["Parsley"], pests: "Lettuce benefits from shade-producing companion plants in hot climates." },
  Corn: { excellent: ["Bean","Pumpkin"], neutral: ["Pea"], avoid: ["Tomato"], pests: "Beans naturally support corn growth by enriching nearby soil." },
};
function getCompanionInfo(plantName) {
  const match = Object.keys(COMPANION_PLANTING_DATA).find((name) =>
    String(plantName || "").toLowerCase().includes(name.toLowerCase())
  );
  return COMPANION_PLANTING_DATA[match] || {
    excellent: ["Basil","Marigold"],
    neutral: ["Lettuce"],
    avoid: ["Plants with very different watering needs"],
    pests: "Companion planting can improve pollination, reduce pests, and increase garden health.",
  };
}
function getCompatibilityScore(plantName, comparePlant) {
  const info = getCompanionInfo(plantName);
  if (info.excellent.some((item) => item.toLowerCase() === comparePlant.toLowerCase())) return { label: "Excellent Pair", color: "#5cff89", icon: "🟢" };
  if (info.avoid.some((item) => item.toLowerCase() === comparePlant.toLowerCase())) return { label: "Avoid", color: "#ff7b7b", icon: "🔴" };
  return { label: "Neutral", color: "#ffd86b", icon: "🟡" };
}
function calculateGardenHealth(gardenMap) {
  const plants = Object.values(gardenMap || {}).filter(Boolean);
  if (!plants.length) return { score: 100, label: "Empty garden" };
  let score = 100;
  plants.forEach((plant) => {
    plants.forEach((compare) => {
      if (plant === compare) return;
      const compatibility = getCompatibilityScore(plant, compare);
      if (compatibility.label === "Avoid") score -= 8;
      if (compatibility.label === "Excellent Pair") score += 3;
    });
  });
  score = Math.max(35, Math.min(100, score));
  let label = "Healthy";
  if (score < 60) label = "Needs improvement";
  else if (score < 80) label = "Moderate";
  return { score, label };
}
function getSuggestionsForMonth(zone, month) {
  const zonePlants = produceData.filter((item) => {
    if (!item?.name) return false;
    const months = Array.isArray(item.plantMonths) ? item.plantMonths : [];
    return zoneMatch(zone, item.minZone, item.maxZone) && months.includes(month);
  });
  return zonePlants.sort((a, b) => a.name.localeCompare(b.name));
}
function getFirstPlantingMonth(item) {
  if (!Array.isArray(item.plantMonths) || !item.plantMonths.length) return null;
  return [...item.plantMonths].sort((a, b) => a - b)[0] || null;
}
function getPlantingWindowText(item) {
  if (!Array.isArray(item.plantMonths) || !item.plantMonths.length) {
    return "Best months vary by zone. Use the Planting Calendar above for seasonal timing.";
  }
  return item.plantMonths.map((month) => MONTH_LABELS[month - 1]?.slice(0, 3)).filter(Boolean).join(" • ");
}
function getPlantSeasonLabel(item, zone, monthOverride = null) {
  if (!zoneMatch(zone, item.minZone, item.maxZone)) return "Outside your zone";
  const currentMonth = monthOverride || new Date().getMonth() + 1;
  if (!Array.isArray(item.plantMonths) || !item.plantMonths.length) return "Zone fit";
  if (item.plantMonths.includes(currentMonth)) return "Plant now";
  const firstMonth = getFirstPlantingMonth(item);
  if (firstMonth && firstMonth > currentMonth) return `Starts in ${MONTH_NAMES[firstMonth - 1]}`;
  return "Out of season";
}
function getHarvestCountdown(item) {
  const harvestDays = {
    Basil: 60,
    Beet: 55,
    Bok_Choy: 45,
    Broccoli: 80,
    Cabbage: 90,
    Carrot: 70,
    Cauliflower: 85,
    Corn: 90,
    Cucumber: 60,
    Eggplant: 80,
    Fennel: 90,
    Garlic: 240,
    Green_Bean: 55,
    Kale: 60,
    Leek: 120,
    Lettuce: 45,
    Parsley: 75,
    Pea: 65,
    Pepper: 80,
    Potato: 100,
    Pumpkin: 110,
    Radish: 30,
    Rosemary: 90,
    Spinach: 45,
    Strawberry: 90,
    Tomato: 75,
  };

  const key = String(item?.name || "").replace(/\s+/g, "_");
  const days = harvestDays[key] || harvestDays[item?.name] || 75;

  return `~${days} day harvest`;
}
function getPlantDifficulty(item) {
  const type = normalizeType(item.type, item.name);
  const name = String(item.name || "").toLowerCase();
  if (type === "Herbs" || ["lettuce","radish","spinach","kale","green bean"].some((w) => name.includes(w))) return { label: "Easy", icon: "🟢", text: "Beginner friendly" };
  if (type === "Tree Fruits" || type === "Tropical Fruits" || ["garlic","pumpkin","watermelon","pomegranate","avocado"].some((w) => name.includes(w))) return { label: "Hard", icon: "🔴", text: "Needs more care" };
  return { label: "Medium", icon: "🟡", text: "Moderate care" };
}
function getPlantQuickFacts(item) {
  const type = normalizeType(item.type, item.name);
  const difficulty = getPlantDifficulty(item);
  return {
    sun: type === "Herbs" ? "Full sun to partial shade" : "Full sun",
    soil: type === "Tree Fruits" || type === "Tropical Fruits" ? "Deep, well-draining soil" : "Loose, compost-rich soil",
    spacing: type === "Tree Fruits" ? "10–20 ft apart" : type === "Berries" ? "2–4 ft apart" : type === "Herbs" ? "8–18 in apart" : "12–24 in apart",
    harvest: getHarvestCountdown(item),
    difficulty: `${difficulty.icon} ${difficulty.label}`,
  };
}
function getSeasonalIntelligenceLabel(item, zone, weather) {
  const currentMonth = new Date().getMonth() + 1;
  const months = Array.isArray(item.plantMonths) ? item.plantMonths : [];
  if (!zoneMatch(zone, item.minZone, item.maxZone)) return { icon: "📍", label: "Outside your zone", text: "This plant may need containers, shade, or protection in your area." };
  if (!months.length) return { icon: "🌿", label: "Zone fit", text: "Season timing varies, but this plant matches your growing zone." };
  if (months.includes(currentMonth)) {
    if (weather?.maxTempF >= 98) return { icon: "🔥", label: "Plant early morning", text: "It is in season, but heat is high. Plant early and water deeply." };
    return { icon: "✅", label: "Perfect planting week", text: "This is a strong time to plant it in your zone." };
  }
  const nextMonth = months.find((month) => month > currentMonth);
  if (nextMonth) return { icon: "🌱", label: "Start indoors soon", text: `Outdoor planting begins around ${MONTH_NAMES[nextMonth - 1]}.` };
  return { icon: "⏳", label: "Too late to plant", text: "Its main planting window has passed. Save it for next season." };
}
function getEstimatedLastFrost(zone) {
  const bucket = getClimateBucket(zone);
  if (bucket === "cold") return "late May";
  if (bucket === "moderate") return "mid March";
  return "late January";
}
function getSmartWeatherRecommendation(zone, weather, plants = []) {
  if (!weather) return { title: "Weather scan loading", body: "Once your forecast loads, Pocket Planter will suggest what to water, protect, or plant next.", level: "Common" };
  const plantNowCount = plants.filter((item) => getPlantSeasonLabel(item, zone) === "Plant now").length;
  if (weather.minTempF <= 35) return { title: "Frost protection night", body: "Cover tender plants, move containers near shelter, and wait on transplanting until lows warm back up.", level: "Epic" };
  if (weather.maxTempF >= 98) return { title: "Heat stress warning", body: "Water deeply before the afternoon, shade young starts, and skip transplanting today.", level: "Rare" };
  if (weather.precipChance >= 70) return { title: "Rain-friendly garden day", body: "Let rain handle watering. Check drainage and avoid soaking containers twice.", level: "Rare" };
  return { title: "Prime Garden Window!", body: `${plantNowCount || "Several"} zone-matched plants look reasonable right now. Focus on soil moisture and steady starts.`, level: "Common" };
}
function getWateringTip(weather) {
  if (!weather) return "Water deeply and consistently while monitoring soil moisture.";
  if (weather.maxTempF >= 95) return "Hot weather is coming. Deep morning watering will help reduce stress and evaporation.";
  if (weather.precipChance >= 65) return "Rain is likely this week. Check the soil before watering again.";
  return "Keep the soil lightly moist and avoid shallow watering.";
}
function getShouldGrowText(item, zone, weather) {
  const seasonLabel = getPlantSeasonLabel(item, zone);
  if (seasonLabel === "Outside your zone") return `${item.name} usually performs best outside your current growing zone. Containers or greenhouse growing may still work depending on your setup.`;
  if (weather?.minTempF <= 35) return `${item.name} can struggle in colder overnight temperatures right now. Consider waiting before planting outdoors.`;
  return `${item.name} is a strong fit for zone ${zone || "your area"} when planted during the proper season with healthy soil and regular watering.`;
}
function getWhereToPlantText(item) {
  const type = normalizeType(item.type, item.name);
  if (type === "Herbs") return "Herbs usually grow best in containers, raised beds, or sunny windows with strong drainage.";
  if (type === "Tree Fruits") return "Tree fruits need full sun, room to spread, and long-term outdoor space.";
  if (type === "Tropical Fruits") return "Tropical fruits prefer warmer climates, high sun exposure, and protection from frost.";
  if (type === "Berries") return "Berries usually like sun, good airflow, mulch, and consistent moisture.";
  return "Plant in a sunny outdoor location with loose soil and consistent airflow.";
}
function getPlantSpecificTip(item, zone, weather) {
  const seasonLabel = getPlantSeasonLabel(item, zone);
  if (seasonLabel === "Plant now" && weather?.maxTempF >= 95) return "This plant is in season, but the heat is high. Plant early in the morning, mulch well, and keep watering consistent.";
  if (seasonLabel === "Plant now" && weather?.minTempF <= 38) return "This plant is in season, but nights are still chilly. Protect young starts until temperatures stay warmer.";
  if (seasonLabel === "Plant now") return "This is a good time to grow it in your area. Focus on soil moisture, spacing, and steady care during the first few weeks.";
  return "Save or follow this plant so you can come back when its planting window gets closer.";
}
function getPlantingSteps(item) {
  if (Array.isArray(item.plantingSteps) && item.plantingSteps.length) return item.plantingSteps;
  const type = normalizeType(item.type, item.name);
  if (type === "Herbs") return ["Choose a sunny container, raised bed, or garden spot with good drainage.","Use loose potting mix or compost-rich soil.","Plant shallow and keep the surface evenly moist while seeds sprout.","Trim often once established so the plant grows fuller."];
  if (type === "Tree Fruits") return ["Choose a full-sun spot with enough long-term space.","Dig a wide hole and avoid planting the trunk too deep.","Water deeply after planting and mulch around the base.","Protect young trees from heat, frost, and strong wind."];
  if (type === "Berries") return ["Pick a sunny spot with rich soil and good airflow.","Plant with proper spacing so leaves can dry after watering.","Mulch around the base to hold moisture.","Watch for birds and pests once fruit begins forming."];
  return ["Prepare loose soil with compost or organic matter.","Plant during the recommended window for your zone.","Water gently after planting and keep soil evenly moist.","Thin, mulch, or support plants as they grow."];
}
function getRarity(item) {
  const type = normalizeType(item.type, item.name);
  const spread = Math.abs(zoneNumber(item.maxZone) - zoneNumber(item.minZone));
  if (item.name.includes("Pomegranate") || item.name.includes("Avocado") || item.name.includes("Fig") || item.name.includes("Orange") || item.name.includes("Lemon")) return "Legendary";
  if (type === "Tree Fruits" || type === "Tropical Fruits") return "Epic";
  if (type === "Berries" || spread <= 4) return "Rare";
  return "Common";
}
function resolvePlantImageSource(item) {
  if (!item || !item.image) return null;
  return plantImages[item.image] || null;
}
function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}
// FIX #2: Removed misplaced async function pickProfilePhoto() that was
// incorrectly nested inside getAchievementBadges. It had no access to
// setProfilePhoto there and would crash at runtime.
function getAchievementBadges({
  savedPlants,
  followedPlants,
  journalEntries,
  gardenMap,
  wateredPlants,
  streakData,
  gardenXP,
}) {
  const today = getTodayKey();

  const wateredTodayCount = Object.values(
    wateredPlants || {}
  ).filter((value) => value === today).length;

  const totalWateredCount = Object.values(
    wateredPlants || {}
  ).filter(Boolean).length;

  const gardenPlotCount = Object.values(
    gardenMap || {}
  ).filter(Boolean).length;

  const streakCount = streakData?.count || 0;

return [
  {
    id: "first_plant_saved",
    icon: "🌱",
    title:
      savedPlants.length >= 1
        ? "First Plant Saved Unlocked"
        : "First Plant Saved",
    unlocked: savedPlants.length >= 1,
    progress: Math.min(savedPlants.length, 1),
    goal: 1,
    text: `Save your first plant. ${Math.min(savedPlants.length, 1)}/1 saved.`,
  },
  {
    id: "save_5_plants",
    icon: "🪴",
    title:
      savedPlants.length >= 5
        ? "Green Thumb Unlocked"
        : "Green Thumb",
    unlocked: savedPlants.length >= 5,
    progress: Math.min(savedPlants.length, 5),
    goal: 5,
    text: `Save 5 plants. ${savedPlants.length}/5 saved.`,
  },
  {
    id: "save_10_plants",
    icon: "🌿",
    title:
      savedPlants.length >= 10
        ? "Garden Collector Unlocked"
        : "Garden Collector",
    unlocked: savedPlants.length >= 10,
    progress: Math.min(savedPlants.length, 10),
    goal: 10,
    text: `Save 10 plants. ${savedPlants.length}/10 saved.`,
  },
{
      id: "save_25_plants",
      icon: "🌳",
      title:
        savedPlants.length >= 25
          ? "Plant Library Master Unlocked"
          : "Plant Library Master",
      unlocked: savedPlants.length >= 25,
      text: `Save 25 plants. ${savedPlants.length}/25 saved.`,
    },
    {
      id: "first_journal_photo",
      icon: "📸",
      title:
        journalEntries.length >= 1
          ? "First Garden Photo Unlocked"
          : "First Garden Photo",
      unlocked: journalEntries.length >= 1,
      text:
        journalEntries.length >= 1
          ? "Unlocked! You added your first garden photo."
          : "Add your first journal photo.",
    },
    {
      id: "photo_logger",
      icon: "📷",
      title:
        journalEntries.length >= 5
          ? "Photo Logger Unlocked"
          : "Photo Logger",
      unlocked: journalEntries.length >= 5,
      text: `Add 5 garden photos. ${journalEntries.length}/5 added.`,
    },
    {
      id: "garden_album",
      icon: "🖼️",
      title:
        journalEntries.length >= 25
          ? "Garden Album Unlocked"
          : "Garden Album",
      unlocked: journalEntries.length >= 25,
      text: `Add 25 garden photos. ${journalEntries.length}/25 added.`,
    },
    {
      id: "first_plot",
      icon: "🗺️",
      title:
        gardenPlotCount >= 1
          ? "First Plot Filled Unlocked"
          : "First Plot Filled",
      unlocked: gardenPlotCount >= 1,
      text: `Fill your first garden plot. ${gardenPlotCount}/1 filled.`,
    },
    {
      id: "plot_builder",
      icon: "🏡",
      title:
        gardenPlotCount >= 6
          ? "Plot Builder Unlocked"
          : "Plot Builder",
      unlocked: gardenPlotCount >= 6,
      text: `Fill 6 garden plots. ${gardenPlotCount}/6 filled.`,
    },
    {
      id: "full_garden",
      icon: "🌳",
      title:
        gardenPlotCount >= 12
          ? "Full Garden Unlocked"
          : "Full Garden",
      unlocked: gardenPlotCount >= 12,
      text: `Fill all 12 garden plots. ${gardenPlotCount}/12 filled.`,
    },
    {
      id: "water_one_today",
      icon: "💧",
      title:
        wateredTodayCount >= 1
          ? "Daily Water Check Unlocked"
          : "Daily Water Check",
      unlocked: wateredTodayCount >= 1,
      text: `Water 1 plant today. ${wateredTodayCount}/1 watered.`,
    },
    {
      id: "water_three_today",
      icon: "🚿",
      title:
        wateredTodayCount >= 3
          ? "Water Watcher Unlocked"
          : "Water Watcher",
      unlocked: wateredTodayCount >= 3,
      text: `Water 3 plants today. ${wateredTodayCount}/3 watered.`,
    },
    {
      id: "water_50_total",
      icon: "🌊",
      title:
        totalWateredCount >= 50
          ? "Watering Legend Unlocked"
          : "Watering Legend",
      unlocked: totalWateredCount >= 50,
      text: `Water plants 50 times. ${totalWateredCount}/50 completed.`,
    },
    {
      id: "streak_7",
      icon: "🔥",
      title:
        streakCount >= 7
          ? "7-Day Streak Unlocked"
          : "7-Day Streak",
      unlocked: streakCount >= 7,
      text: `Use Pocket Planter 7 days in a row. ${streakCount}/7 days.`,
    },
    {
      id: "streak_14",
      icon: "🔥",
      title:
        streakCount >= 14
          ? "Dedicated Grower Unlocked"
          : "Dedicated Grower",
      unlocked: streakCount >= 14,
      text: `Use Pocket Planter 14 days in a row. ${streakCount}/14 days.`,
    },
    {
      id: "streak_30",
      icon: "🏆",
      title:
        streakCount >= 30
          ? "Garden Master Unlocked"
          : "Garden Master",
      unlocked: streakCount >= 30,
      text: `Use Pocket Planter 30 days in a row. ${streakCount}/30 days.`,
    },
    {
  id: "level_5",
  icon: "🏆",
  title:
    (gardenXP?.level || 0) >= 5
      ? "Level 5 Unlocked"
      : "Reach Level 5",
  unlocked:
    (gardenXP?.level || 0) >= 5,
  text: `Level ${
    gardenXP?.level || 0
  }/5`,
},
{
  id: "level_10",
  icon: "👑",
  title:
    (gardenXP?.level || 0) >= 10
      ? "Level 10 Unlocked"
      : "Reach Level 10",
  unlocked:
    (gardenXP?.level || 0) >= 10,
  text: `Level ${
    gardenXP?.level || 0
  }/10`,
},
];
}
const PROFILE_THEMES = [
  { id: "forest", name: "Forest", emoji: "🌲", color: "#5cff89", bg: "rgba(92,255,137,0.18)", border: "#5cff89", accent: "#5cff89" },
  { id: "sunset", name: "Sunset Garden", emoji: "🌅", color: "#ffd86b", bg: "rgba(255,216,107,0.18)", border: "#ffd86b", accent: "#ffd86b" },
  { id: "midnight", name: "Midnight Greenhouse", emoji: "🌙", color: "#6bc7ff", bg: "rgba(107,199,255,0.18)", border: "#6bc7ff", accent: "#6bc7ff" },
  { id: "tropical", name: "Tropical Jungle", emoji: "🌴", color: "#8effab", bg: "rgba(142,255,171,0.18)", border: "#8effab", accent: "#8effab" },
];
function getProfileBanners({ gardenXP, savedPlants, journalEntries, gardenMap }) {
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  return [
    { id: "seedling_banner", emoji: "🌱", title: "Seedling Starter", subtitle: "Unlocked at Level 1", unlocked: gardenXP.level >= 1, gradient: ["#5cff89","#1f7a3a"] },
    { id: "green_thumb_banner", emoji: "🪴", title: "Green Thumb", subtitle: "Reach Level 5", unlocked: gardenXP.level >= 5, gradient: ["#8effab","#2fbf5f"] },
    { id: "harvest_banner", emoji: "🌾", title: "Harvest Keeper", subtitle: "Reach Level 8", unlocked: gardenXP.level >= 8, gradient: ["#ffd86b","#bf7a12"] },
    { id: "master_banner", emoji: "🏆", title: "Master Botanist", subtitle: "Reach Level 20", unlocked: gardenXP.level >= 20, gradient: ["#d8c8ff","#7b3ff2"] },
    { id: "collector_banner", emoji: "🧺", title: "Plant Collector", subtitle: "Save 10 plants", unlocked: savedPlants.length >= 10, gradient: ["#6bc7ff","#315fd6"] },
    { id: "journal_banner", emoji: "📸", title: "Garden Historian", subtitle: "Add 10 journal photos", unlocked: journalEntries.length >= 10, gradient: ["#ffb3d9","#bf3f7f"] },
    { id: "planner_banner", emoji: "🗺️", title: "Garden Architect", subtitle: "Fill all 12 garden plots", unlocked: gardenPlotCount >= 12, gradient: ["#f6d28a","#8a5a12"] },
  ];
}
function getDailyQuests({ savedPlants, journalEntries, gardenMap, wateredPlants }) {
  const today = getTodayKey();
  const wateredTodayCount = Object.values(wateredPlants || {}).filter((value) => value === today).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  return [
    { id: "water_one", icon: "💧", title: "Water 1 plant", progress: Math.min(wateredTodayCount,1), goal: 1, completed: wateredTodayCount >= 1, reward: 25 },
    { id: "water_three", icon: "🚿", title: "Water 3 plants", progress: Math.min(wateredTodayCount,3), goal: 3, completed: wateredTodayCount >= 3, reward: 50 },
    { id: "save_one", icon: "🌱", title: "Save a plant", progress: Math.min(savedPlants.length,1), goal: 1, completed: savedPlants.length >= 1, reward: 25 },
    { id: "journal_one", icon: "📸", title: "Add a journal photo", progress: Math.min(journalEntries.length,1), goal: 1, completed: journalEntries.length >= 1, reward: 40 },
    { id: "plan_one", icon: "🗺️", title: "Place a plant in garden map", progress: Math.min(gardenPlotCount,1), goal: 1, completed: gardenPlotCount >= 1, reward: 35 },
  ];
}
function getFrameColor(level) {
  if (level >= 20) return "#ffd86b";
  if (level >= 12) return "#d8c8ff";
  if (level >= 6) return "#6bc7ff";
  return "#5cff89";
}
function getGardenXP({ savedPlants, journalEntries, gardenMap, wateredPlants, streakData }) {
  const today = getTodayKey();
  const wateredTodayCount = Object.values(wateredPlants || {}).filter((value) => value === today).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const xp = savedPlants.length * 25 + journalEntries.length * 40 + gardenPlotCount * 35 + wateredTodayCount * 15 + (streakData?.count || 0) * 20;
  const level = Math.floor(xp / 250) + 1;
  const currentLevelXP = xp % 250;
  const nextLevelXP = 250;
  let title = "Seedling";
  if (level >= 3) title = "Backyard Grower";
  if (level >= 5) title = "Green Thumb";
  if (level >= 8) title = "Harvest Keeper";
  if (level >= 12) title = "Garden Sage";
  if (level >= 20) title = "Master Botanist";
  return { xp, level, title, currentLevelXP, nextLevelXP, progress: currentLevelXP / nextLevelXP };
}
function LoadingScreen() {
  return (
    <View style={styles.loadingWrapper}>
      <Image source={loadingScreenImage} style={styles.fullScreenLoadingImage} resizeMode="cover" />
    </View>
  );
}
function FloatingParticle({ symbol, index, mode }) {
  const fall = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const duration = mode === "rain" ? 1800 + index * 120 : mode === "snow" ? 4200 + index * 180 : 3000 + index * 220;
    const fallLoop = Animated.loop(Animated.sequence([Animated.timing(fall, { toValue: 1, duration, useNativeDriver: true }), Animated.timing(fall, { toValue: 0, duration: 0, useNativeDriver: true })]));
    const driftLoop = Animated.loop(Animated.sequence([Animated.timing(drift, { toValue: 1, duration: 1800 + index * 140, useNativeDriver: true }), Animated.timing(drift, { toValue: 0, duration: 1800 + index * 140, useNativeDriver: true })]));
    const glowLoop = Animated.loop(Animated.sequence([Animated.timing(glow, { toValue: 1, duration: 1400 + index * 120, useNativeDriver: true }), Animated.timing(glow, { toValue: 0, duration: 1400 + index * 120, useNativeDriver: true })]));
    fallLoop.start(); driftLoop.start(); glowLoop.start();
    return () => { fallLoop.stop(); driftLoop.stop(); glowLoop.stop(); };
  }, [fall, drift, glow, index, mode]);
  const translateY = fall.interpolate({ inputRange: [0,1], outputRange: [-80,760] });
  const translateX = drift.interpolate({ inputRange: [0,1], outputRange: mode === "rain" ? [-8,8] : mode === "snow" ? [-28,28] : [-16,16] });
  const opacity = glow.interpolate({ inputRange: [0,1], outputRange: mode === "firefly" ? [0.15,0.95] : mode === "snow" ? [0.18,0.55] : [0.15,0.45] });
  return (
    <Animated.Text style={[styles.weatherParticleAnimated, { left: `${6 + index * 9}%`, opacity, transform: [{ translateY }, { translateX }, { rotate: mode === "rain" ? "12deg" : "0deg" }] }]}>
      {symbol}
    </Animated.Text>
  );
}
function WeatherParticles({ weather }) {
  let mode = "firefly";
  let symbols = ["✨","🟢","✨","🟢","✨","🟢","✨","🟢"];
  if (weather?.precipChance >= 65) { mode = "rain"; symbols = ["💧","💧","💧","💧","💧","💧","💧","💧","💧","💧"]; }
  else if (weather?.minTempF <= 35) { mode = "snow"; symbols = ["❄️","❄️","❄️","❄️","❄️","❄️","❄️","❄️"]; }
  else if (weather?.maxTempF >= 95) { mode = "firefly"; symbols = ["✨","🌿","✨","🌿","✨","🌿","✨","🌿"]; }
  return (
    <View pointerEvents="none" style={styles.weatherParticleLayer}>
      {symbols.map((symbol, index) => <FloatingParticle key={`floating-particle-${symbol}-${index}`} symbol={symbol} index={index} mode={mode} />)}
    </View>
  );
}
function BackgroundDecoration({ isDark }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[styles.bgBlobOne, isDark && styles.bgBlobDark]} />
      <View style={[styles.bgBlobTwo, isDark && styles.bgBlobDark]} />
      <View style={[styles.bgBlobThree, isDark && styles.bgBlobDark]} />
    </View>
  );
}
function PremiumLockedCard({ theme, title, body, onUnlock }) {
  return (
    <Pressable onPress={onUnlock} style={[styles.weatherPremiumBlock, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <View style={styles.weatherLockCircle}><Text style={styles.weatherLockIcon}>🔒</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.weatherPremiumTitle}>{title || "Weather Intelligence"}</Text>
        <Text style={styles.weatherPremiumText}>{body || "Unlock premium to see smart weather alerts, frost risk, heat warnings, and watering guidance."}</Text>
      </View>
      <View style={styles.weatherUnlockButton}><Text style={styles.weatherUnlockText}>👑 Unlock Premium ›</Text></View>
    </Pressable>
  );
}
function getMonthEmoji(monthNumber) {
  const emojis = { 1:"❄️",2:"🌧️",3:"🌱",4:"🌷",5:"☀️",6:"🍅",7:"🌽",8:"🍉",9:"🍎",10:"🎃",11:"🍂",12:"🎄" };
  return emojis[monthNumber] || "🌱";
}
function getWeatherIconFromDay(day) {
  if (!day) return "🌤️";
  if (day.precipChance >= 65) return "🌧️";
  if (day.minTempF <= 35) return "❄️";
  if (day.maxTempF >= 95) return "🔥";
  return "☀️";
}
export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [zip, setZip] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedType, setSelectedType] = useState("All");
  const [savedPlants, setSavedPlants] = useState([]);
  const [comparePlants, setComparePlants] = useState([]);
  const [plantNotes, setPlantNotes] = useState({});
  const [plantFolders, setPlantFolders] = useState({ "🌿 Herbs": [], "🍓 Fruit Garden": [], "🥕 Spring Garden": [] });
  const [followedPlants, setFollowedPlants] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [wateringReminders, setWateringReminders] = useState({});
  const [wateredPlants, setWateredPlants] = useState({});
  const [harvestTrackers, setHarvestTrackers] = useState({});
  const [gardenMap, setGardenMap] = useState({});
  const [weather, setWeather] = useState(null);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState("Free");
  const [showPremiumIntro, setShowPremiumIntro] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [appearanceMode, setAppearanceMode] = useState("dark");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [returnSection, setReturnSection] = useState(null);
  const [remindersOn, setRemindersOn] = useState(false);
  const [frostAlertsOn, setFrostAlertsOn] = useState(false);
  const [monthlyPlantingOn, setMonthlyPlantingOn] = useState(false);
  const [dailyWateringOn, setDailyWateringOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({ count: 1, lastOpened: getTodayKey() });
  const [profileName, setProfileName] = useState("My Gardener Profile!");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [selectedProfileTheme, setSelectedProfileTheme] = useState("forest");
  const [shownAchievements, setShownAchievements] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [xpPopups, setXpPopups] = useState([]);

  // FIX #4: Move record/zone here — before any useEffect that references them.
  // Previously they were declared ~200 lines later, causing temporal dead zone
  // issues in the dependency arrays of the effects below.
  const record = useMemo(() => getZipRecord(zip), [zip]);
  const zone = record?.zone || null;

  // ── Refs ───────────────────────────────────────────────────────────────────
  const scrollRef = useRef(null);
  const monthlyPicksY = useRef(0);
  const plantsListY = useRef(0);
  const homeY = useRef(0);
  const gardenY = useRef(0);
  const journalY = useRef(0);
  const premiumY = useRef(0);
  const reminderY = useRef(0);
  const plantReturnY = useRef(0);
  const currentScrollY = useRef(0);
  const previousXP = useRef(0);
  const avatarGlow = useRef(new Animated.Value(0)).current;
  const profileGlow = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const heroFloat = useRef(new Animated.Value(0)).current;

  // ── Derived / memos ────────────────────────────────────────────────────────
  const compatiblePlants = useMemo(() => {
    if (!zone) return [];
    return getCompatiblePlants(zone);
  }, [zone]);

  const monthlySuggestions = useMemo(() => {
    if (!zone) return [];
    return getSuggestionsForMonth(zone, selectedMonth);
  }, [zone, selectedMonth]);

  const filteredPlants = useMemo(() => {
  return [...produceData]
    .filter((item) =>
      matchesType(item, selectedType)
    )
    .sort((a, b) => {
      const aPlantNow =
        getPlantSeasonLabel(a, zone) ===
        "Plant now";

      const bPlantNow =
        getPlantSeasonLabel(b, zone) ===
        "Plant now";

      if (aPlantNow && !bPlantNow)
        return -1;

      if (!aPlantNow && bPlantNow)
  return 1;

return a.name.localeCompare(b.name);
    });
}, [
  selectedType,
  zone,
]);

const searchableGalleryPlants = useMemo(() => {
  const plantToday =
    monthlySuggestions?.[0] ||
    compatiblePlants?.[0];
return compatiblePlants
  .filter(
    (item) =>
      item.name !== plantToday?.name
  )
  .sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}, [
  compatiblePlants,
  monthlySuggestions,
]);

const smartRecommendation = useMemo(
  () =>
    getSmartWeatherRecommendation(
      zone,
      weather,
      compatiblePlants
    ),
  [zone, weather, compatiblePlants]
);

const rarityStyle = selectedPlant
  ? RARITY_STYLES[getRarity(selectedPlant)]
  : null;

const gardenHealth = useMemo(
  () => calculateGardenHealth(gardenMap),
  [gardenMap]
);

const gardenXP = useMemo(
  () =>
    getGardenXP({
      savedPlants,
      journalEntries,
      gardenMap,
      wateredPlants,
      streakData,
    }),
  [
    savedPlants,
    journalEntries,
    gardenMap,
    wateredPlants,
    streakData,
  ]
);

const achievementBadges = useMemo(
  () =>
    getAchievementBadges({
      savedPlants,
      followedPlants,
      journalEntries,
      gardenMap,
      wateredPlants,
      streakData,
      gardenXP,
    }),
  [
    savedPlants,
    followedPlants,
    journalEntries,
    gardenMap,
    wateredPlants,
    streakData,
    gardenXP,
  ]
);

const dailyQuests = useMemo(
  () =>
    getDailyQuests({
      savedPlants,
      journalEntries,
      gardenMap,
      wateredPlants,
    }),
  [
    savedPlants,
    journalEntries,
    gardenMap,
    wateredPlants,
  ]
);

const profileBanners = useMemo(
  () =>
    getProfileBanners({
      gardenXP,
      savedPlants,
      journalEntries,
      gardenMap,
    }),
  [
    gardenXP,
    savedPlants,
    journalEntries,
    gardenMap,
  ]
);

// ── Folder organizer ───────────────────────────────────────────────────────
useEffect(() => {
  const folders = { "🌿 Herbs": [], "🍓 Fruit Garden": [], "🥕 Spring Garden": [] };
  savedPlants.forEach((plantName) => {
    const plant = produceData.find((item) => item.name === plantName);
    if (!plant) return;
    const type = normalizeType(plant.type, plant.name);
    if (type === "Herbs") folders["🌿 Herbs"].push(plantName);
    else if (type.includes("Fruit")) folders["🍓 Fruit Garden"].push(plantName);
    else folders["🥕 Spring Garden"].push(plantName);
  });
  setPlantFolders(folders);
}, [savedPlants]);

const zoneRevealAnim = useRef(new Animated.Value(0)).current;
const isDark = appearanceMode === "dark";
const activeThemeAccent =
  PROFILE_THEMES.find(
    (t) => t.id === selectedProfileTheme
  )?.accent || "#5cff89";

const theme = isDark
  ? {
      isDark,
      background: "#07120b",
      card: "rgba(16, 41, 23, 0.92)",
      text: "#ffffff",
      secondaryText: "#d7ebdc",
      border: "rgba(142, 255, 171, 0.18)",
      glow: activeThemeAccent,
      input: "rgba(255,255,255,0.10)",
      accent: activeThemeAccent,
    }
  : {
      isDark,
      background: "#f4fbf2",
      card: "#ffffff",
      text: "#102917",
      secondaryText: "#496b55",
      border: "rgba(47, 125, 70, 0.18)",
      glow: activeThemeAccent,
      input: "#eef7ee",
      accent: activeThemeAccent,
    };

  // ── Helper functions ───────────────────────────────────────────────────────
  function openPlantByName(name) {
    const target = String(name).toLowerCase().replace(/_/g, " ").trim();
    const found = produceData.find((item) => String(item?.name || "").toLowerCase().replace(/_/g, " ").trim() === target);
    if (found) {
      setSelectedPlant(found);
      setTimeout(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, 50);
    } else {
      Alert.alert("Plant not found", `Could not find "${name}" in produceData.`);
    }
  }
  function openPlantFromMonthly(item) {
    plantReturnY.current = currentScrollY.current;
    setReturnSection("exact");
    setSelectedPlant(item);
  }
  function openPlantFromList(item) {
    plantReturnY.current = currentScrollY.current;
    setReturnSection("exact");
    setSelectedPlant(item);
  }
  function handleBackFromPlant() {
    setSelectedPlant(null);
    setTimeout(() => { scrollRef.current?.scrollTo({ y: plantReturnY.current, animated: false }); }, 80);
  }

  // ── Animations ─────────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.loop(Animated.sequence([Animated.timing(glowAnimation, { toValue: 1, duration: 2200, useNativeDriver: true }), Animated.timing(glowAnimation, { toValue: 0, duration: 2200, useNativeDriver: true })])).start();
    Animated.loop(Animated.sequence([Animated.timing(heroFloat, { toValue: -8, duration: 2500, useNativeDriver: true }), Animated.timing(heroFloat, { toValue: 0, duration: 2500, useNativeDriver: true })])).start();
    Animated.timing(fadeAnimation, { toValue: 1, duration: 900, useNativeDriver: true }).start();
  }, [fadeAnimation, glowAnimation, heroFloat]);

  useEffect(() => {
    if (record) {
      Animated.timing(zoneRevealAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    } else {
      zoneRevealAnim.setValue(0);
    }
  }, [record]);

  useEffect(() => {
    Animated.loop(Animated.sequence([Animated.timing(avatarGlow, { toValue: 1, duration: 1800, useNativeDriver: false }), Animated.timing(avatarGlow, { toValue: 0, duration: 1800, useNativeDriver: false })])).start();
  }, [avatarGlow]);

  // ── Storage load ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadStoredData() {
      try {
        const values = await AsyncStorage.multiGet([
          STORAGE_KEYS.zip, STORAGE_KEYS.plantNotes, STORAGE_KEYS.savedPlants,
          STORAGE_KEYS.followedPlants, STORAGE_KEYS.journalEntries, STORAGE_KEYS.selectedMonth,
          STORAGE_KEYS.selectedType, STORAGE_KEYS.remindersOn, STORAGE_KEYS.frostAlertsOn,
          STORAGE_KEYS.appearanceMode, STORAGE_KEYS.subscriptionPlan, STORAGE_KEYS.premiumUnlocked,
          STORAGE_KEYS.gardenMap, STORAGE_KEYS.wateredPlants, STORAGE_KEYS.wateringReminders,
          STORAGE_KEYS.harvestTrackers, STORAGE_KEYS.streakData, STORAGE_KEYS.seenPremiumIntro,
          STORAGE_KEYS.seenOnboarding, STORAGE_KEYS.profileName, STORAGE_KEYS.profilePhoto,
        ]);
        const map = Object.fromEntries(values);

if (map[STORAGE_KEYS.seenOnboarding])
  setShowOnboarding(false);

if (map[STORAGE_KEYS.zip])
  setZip(map[STORAGE_KEYS.zip]);

// FIX #2: Removed duplicate setSavedPlants call that was loading the same
// key twice and overwriting any value set by the first call.
if (map[STORAGE_KEYS.savedPlants])
  setSavedPlants(
    JSON.parse(
      map[STORAGE_KEYS.savedPlants]
    )
  );

if (map[STORAGE_KEYS.plantNotes])
  setPlantNotes(
    JSON.parse(
      map[STORAGE_KEYS.plantNotes]
    )
  );

// FIX #2: Removed duplicate setFollowedPlants call for the same reason.
if (map[STORAGE_KEYS.followedPlants])
  setFollowedPlants(
    JSON.parse(
      map[STORAGE_KEYS.followedPlants]
    )
  );

if (map[STORAGE_KEYS.journalEntries])
  setJournalEntries(
    JSON.parse(
      map[STORAGE_KEYS.journalEntries]
    )
  );

if (map[STORAGE_KEYS.selectedMonth])
  setSelectedMonth(
    Number(
      map[STORAGE_KEYS.selectedMonth]
    )
  );

if (map[STORAGE_KEYS.selectedType])
  setSelectedType(
    map[STORAGE_KEYS.selectedType]
  );

if (map[STORAGE_KEYS.remindersOn])
  setRemindersOn(
    JSON.parse(
      map[STORAGE_KEYS.remindersOn]
    )
  );

if (map[STORAGE_KEYS.frostAlertsOn])
  setFrostAlertsOn(
    JSON.parse(
      map[STORAGE_KEYS.frostAlertsOn]
    )
  );

const today = getTodayKey();

if (
  map[STORAGE_KEYS.dailyBonusDate] ===
  today
) {
  setDailyBonusClaimed(true);
}
        if (map[STORAGE_KEYS.appearanceMode]) setAppearanceMode(map[STORAGE_KEYS.appearanceMode]);
        if (map[STORAGE_KEYS.subscriptionPlan]) setSubscriptionPlan(map[STORAGE_KEYS.subscriptionPlan]);
        if (map[STORAGE_KEYS.premiumUnlocked]) setPremiumUnlocked(JSON.parse(map[STORAGE_KEYS.premiumUnlocked]));
        if (map[STORAGE_KEYS.gardenMap]) setGardenMap(JSON.parse(map[STORAGE_KEYS.gardenMap]));
        if (map[STORAGE_KEYS.wateredPlants]) setWateredPlants(JSON.parse(map[STORAGE_KEYS.wateredPlants]));
        if (map[STORAGE_KEYS.wateringReminders]) setWateringReminders(JSON.parse(map[STORAGE_KEYS.wateringReminders]));
        if (map[STORAGE_KEYS.harvestTrackers]) setHarvestTrackers(JSON.parse(map[STORAGE_KEYS.harvestTrackers]));
        if (map[STORAGE_KEYS.streakData]) setStreakData(JSON.parse(map[STORAGE_KEYS.streakData]));
        if (map[STORAGE_KEYS.seenPremiumIntro]) setShowPremiumIntro(!JSON.parse(map[STORAGE_KEYS.seenPremiumIntro]));
        if (map[STORAGE_KEYS.profileName]) setProfileName(map[STORAGE_KEYS.profileName]);
        if (map[STORAGE_KEYS.profilePhoto]) setProfilePhoto(map[STORAGE_KEYS.profilePhoto]);
        if (map[STORAGE_KEYS.profileTheme]) setSelectedProfileTheme(map[STORAGE_KEYS.profileTheme]);
        updateDailyStreak();
        checkHarvestNotifications();
      } catch (error) {
        console.log("Storage load error", error);
      } finally {
        setTimeout(() => { setLoading(false); }, 1800);
      }
    }
    loadStoredData();
  }, []);

  // ── Persist to storage ─────────────────────────────────────────────────────
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.zip, zip); }, [zip]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.savedPlants, JSON.stringify(savedPlants)); }, [savedPlants]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.plantNotes, JSON.stringify(plantNotes)); }, [plantNotes]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.followedPlants, JSON.stringify(followedPlants)); }, [followedPlants]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.journalEntries, JSON.stringify(journalEntries)); }, [journalEntries]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.selectedMonth, String(selectedMonth)); }, [selectedMonth]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.selectedType, selectedType); }, [selectedType]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.remindersOn, JSON.stringify(remindersOn)); }, [remindersOn]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.frostAlertsOn, JSON.stringify(frostAlertsOn)); }, [frostAlertsOn]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.appearanceMode, appearanceMode); }, [appearanceMode]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.subscriptionPlan, subscriptionPlan); }, [subscriptionPlan]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.premiumUnlocked, JSON.stringify(premiumUnlocked)); }, [premiumUnlocked]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.gardenMap, JSON.stringify(gardenMap)); }, [gardenMap]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.wateredPlants, JSON.stringify(wateredPlants)); }, [wateredPlants]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.wateringReminders, JSON.stringify(wateringReminders)); }, [wateringReminders]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.harvestTrackers, JSON.stringify(harvestTrackers)); }, [harvestTrackers]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.streakData, JSON.stringify(streakData)); }, [streakData]);
useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.profileTheme, selectedProfileTheme); }, [selectedProfileTheme]);

  // ── Streak + notifications ─────────────────────────────────────────────────
  async function updateDailyStreak() {
    const today = getTodayKey();
    setStreakData((current) => {
      if (!current?.lastOpened) return { count: 1, lastOpened: today };
      if (current.lastOpened === today) return current;
      const previousDate = new Date(current.lastOpened);
      const currentDate = new Date(today);
      const diff = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5) return { count: (current.count || 0) + 1, lastOpened: today };
      return { count: 1, lastOpened: today };
    });
  }

  async function pickJournalPhoto(plantName) {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Photos Permission Needed", "Allow photo access to add garden journal pictures."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1, allowsEditing: true });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    const moods = ["🌱 Hopeful","😍 Thriving","🍅 Harvest Day","😅 Struggling","🌧️ Rain Saved Me","☀️ Perfect Weather"];
    const growthStages = ["Seedling","Leaf Growth","Flowering","Fruit Forming","Harvest Ready"];
    const entry = {
      id: Date.now().toString(), plantName, imageUri: asset.uri, createdAt: new Date().toISOString(),
      mood: moods[Math.floor(Math.random() * moods.length)],
      growthStage: growthStages[Math.floor(Math.random() * growthStages.length)],
      daysSincePlanting: Math.floor(Math.random() * 45) + 1,
    };
    setJournalEntries((current) => [entry, ...current]);
  }

  function deleteJournalEntry(entryId) {
    Alert.alert("Delete photo?", "This will remove this journal photo from your garden journal.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setJournalEntries((current) => current.filter((entry) => entry.id !== entryId)) },
    ]);
  }

  // FIX #2: Removed the duplicate definition of scheduleMonthlyPlantingNotifications
  // that appeared immediately after this one. Kept the more complete version.
  async function scheduleMonthlyPlantingNotifications() {
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Notifications Needed", "Allow notifications so Pocket Planter can remind you what to plant each month.");
      return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (let month = 1; month <= 12; month += 1) {
      await Notifications.scheduleNotificationAsync({
        content: { title: `🌱 ${MONTH_NAMES[month - 1]} Planting Guide`, body: `Open Pocket Planter to see what to plant this month in your zone.` },
        trigger: { month, day: 1, hour: 9, minute: 0, repeats: true },
      });
    }
    Alert.alert("Monthly Reminders On", "Pocket Planter will remind you on the 1st of every month.");
  }

  async function checkHarvestNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;
    Object.entries(harvestTrackers || {}).forEach(async ([plantName, tracker]) => {
      const daysPassed = Math.floor((new Date() - new Date(tracker.startedAt)) / (1000 * 60 * 60 * 24));
      const daysLeft = tracker.days - daysPassed;
      if (daysLeft === 0) {
        await Notifications.scheduleNotificationAsync({ content: { title: "🎉 Harvest Ready", body: `${plantName} should be ready to harvest today.` }, trigger: null });
      }
    });
  }

  async function scheduleDailyWateringNotification() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") { Alert.alert("Notifications Disabled", "Enable notifications to receive daily watering reminders."); return; }
    const rainLikely = weather?.precipChance >= 65;
    await Notifications.scheduleNotificationAsync({
      content: { title: rainLikely ? "🌧️ Rain May Water Today" : "💧 Watering Check", body: rainLikely ? "Rain is likely today. Check the soil before watering your garden." : "Check your garden and water any plants that need moisture today." },
      trigger: { hour: 8, minute: 0, repeats: true },
    });
    Alert.alert(rainLikely ? "Weather-Aware Watering On 🌧️" : "Watering Reminder On 💧", rainLikely ? "Pocket Planter will remind you to check soil before watering when rain is likely." : "Pocket Planter will remind you every morning at 8:00 AM.");
  }

  async function schedulePlantReminder(plantName) {
    if (!remindersOn) { Alert.alert("Enable Reminders", "Turn on notifications first before creating watering reminders."); return; }
    const rainLikely = weather?.precipChance >= 65;
    await Notifications.scheduleNotificationAsync({
      content: { title: rainLikely ? `🌧️ Check ${plantName}` : `💧 Water ${plantName}`, body: rainLikely ? `Rain is expected today. Check soil moisture before watering ${plantName}.` : `Your ${plantName} may need watering today.` },
      trigger: { hour: 8, minute: 0, repeats: true },
    });
    setWateringReminders((current) => ({ ...current, [plantName]: true }));
    Alert.alert("Reminder Added", `${plantName} watering reminders are now active.`);
  }

async function claimDailyBonus() {
  const today = getTodayKey();

  if (dailyBonusClaimed) {
    Alert.alert(
      "Already Claimed 🌱",
      "You already claimed today's garden bonus."
    );
    return;
  }

  await AsyncStorage.setItem(
    STORAGE_KEYS.dailyBonusDate,
    today
  );

  setDailyBonusClaimed(true);
  setShowDailyBonus(true);

  Vibration.vibrate(180);

  setTimeout(() => {
    setShowDailyBonus(false);
  }, 1800);
}

  function markPlantWatered(plantName) {
    setWateredPlants((current) => ({ ...current, [plantName]: getTodayKey() }));
    Alert.alert("Watered", `${plantName} was marked watered for today.`);
  }
  function assignPlantToGardenSlot(slotId, plantName) { setGardenMap((current) => ({ ...current, [slotId]: plantName })); }
  function clearGardenSlot(slotId) { setGardenMap((current) => { const copy = { ...current }; delete copy[slotId]; return copy; }); }

  async function detectLocationAndZone() {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) { Alert.alert("Location Denied", "Allow location access to auto-detect your growing zone."); return; }
      const position = await Location.getCurrentPositionAsync({});
      const reverse = await Location.reverseGeocodeAsync({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      const postalCode = reverse?.[0]?.postalCode;
      if (!postalCode) { Alert.alert("ZIP Not Found", "Pocket Planter couldn't detect your ZIP code."); return; }
      setZip(postalCode);
    } catch (error) {
      console.log(error);
      Alert.alert("Location Error", "Unable to detect your location right now.");
    }
  }

  // ── Weather ────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadWeather() {
      if (!record || zip.length !== 5) { setWeather(null); return; }
      try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${zip}&count=1&countryCode=US&language=en&format=json`);
        const geoData = await geoResponse.json();
        const place = geoData?.results?.[0];
        if (!place?.latitude || !place?.longitude) { setWeather(null); return; }
        const weatherResponse = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`
);

const weatherData = await weatherResponse.json();

const forecast = (weatherData?.daily?.time || []).map(
  (date, index) => ({
    date,
    maxTempF:
      weatherData?.daily?.temperature_2m_max?.[
        index
      ] ?? null,
    minTempF:
      weatherData?.daily?.temperature_2m_min?.[
        index
      ] ?? null,
    precipChance:
      weatherData?.daily
        ?.precipitation_probability_max?.[
        index
      ] ?? 0,
  })
);

setWeather({
  maxTempF:
    forecast[0]?.maxTempF ?? null,
  minTempF:
    forecast[0]?.minTempF ?? null,
  precipChance:
    forecast[0]?.precipChance ?? 0,
  forecast,
});
      } catch (error) {
        console.log("Weather load error", error);
        setWeather(null);
      }
    }
    loadWeather();
  }, [zip, record]);

  // ── RevenueCat (stubbed for Expo Go) ───────────────────────────────────────
  useEffect(() => {
    async function configureRevenueCat() {
      try {
        if (__DEV__) { console.log("RevenueCat skipped in Expo Go/dev mode."); return; }
        Purchases.configure({ apiKey: Platform.OS === "ios" ? "YOUR_REAL_REVENUECAT_IOS_KEY" : "YOUR_REAL_REVENUECAT_ANDROID_KEY" });
      } catch (error) {
        console.log("RevenueCat config skipped:", error);
      }
    }
    configureRevenueCat();
  }, []);

  // ── Premium ────────────────────────────────────────────────────────────────
  async function unlockPremium(plan) {
    setPremiumUnlocked(true);
    setSubscriptionPlan(plan);
    setShowPremiumIntro(false);
    await AsyncStorage.setItem(STORAGE_KEYS.seenPremiumIntro, JSON.stringify(true));
    Alert.alert("Premium Unlocked 👑", `Pocket Planter ${plan} activated successfully.`);
  }
  function dismissPremiumIntro() {
    setShowPremiumIntro(false);
    AsyncStorage.setItem(STORAGE_KEYS.seenPremiumIntro, JSON.stringify(true));
  }

  // ── Plant actions ──────────────────────────────────────────────────────────
  function toggleSavedPlant(name) {
    setSavedPlants((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name);
      if (!premiumUnlocked && current.length >= 5) {
        Alert.alert("Premium saves locked", "Free users can save up to 5 plants. Upgrade to Premium to save unlimited plants.", [{ text: "Maybe later", style: "cancel" }, { text: "View Premium", onPress: () => jumpToTab("premium") }]);
        return current;
      }
      return [...current, name].sort();
    });
  }
  function toggleComparePlant(plantName) {
    setComparePlants((current) => {
      if (current.includes(plantName)) return current.filter((item) => item !== plantName);
      if (current.length >= 2) return [current[1], plantName];
      return [...current, plantName];
    });
  }
  function toggleFollowPlant(name) {
    setFollowedPlants((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name].sort());
  }

  // ── Level-up / XP / Achievement effects ───────────────────────────────────
  useEffect(() => {
    if (gardenXP.level > previousLevel) {
      Vibration.vibrate(250);

setShowLevelUp(true);
      setPreviousLevel(gardenXP.level);
      setTimeout(() => { setShowLevelUp(false); }, 2800);
    }
  }, [gardenXP.level, previousLevel]);

  useEffect(() => {
    if (previousXP.current === 0) { previousXP.current = gardenXP.xp; return; }
    if (gardenXP.xp > previousXP.current) {
      const amount = gardenXP.xp - previousXP.current;
      const popup = { id: Date.now().toString(), amount };
      setXpPopups((current) => [...current, popup]);
      setTimeout(() => { setXpPopups((current) => current.filter((item) => item.id !== popup.id)); }, 1600);
    }
    previousXP.current = gardenXP.xp;
  }, [gardenXP.xp]);

  useEffect(() => {
    const newlyUnlocked = achievementBadges.find((badge) => badge.unlocked && !shownAchievements.includes(badge.id));
    if (!newlyUnlocked) return;
    Alert.alert("Great job! 🎉", `You completed: ${newlyUnlocked.title.replace(" Unlocked", "")}`);
    setShownAchievements((current) => [...current, newlyUnlocked.id]);
  }, [achievementBadges, shownAchievements]);

  const glowOpacity = glowAnimation.interpolate({ inputRange: [0,1], outputRange: [0.35,0.95] });

  function jumpToTab(tab) {
    setActiveTab(tab);
    setSelectedPlant(null);
    setTimeout(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, 50);
  }
  function jumpToSmartReminders() {
    setActiveTab("garden");
    setSelectedPlant(null);
    setTimeout(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, 100);
  }

  // ── Early returns ──────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen />;

  if (showOnboarding) {
    return (
      <OnboardingCard onFinish={async () => { setShowOnboarding(false); await AsyncStorage.setItem(STORAGE_KEYS.seenOnboarding, "true"); }} />
    );
  }
  if (selectedPlant) {
    const plantImage = resolvePlantImageSource(selectedPlant);
    const companionInfo = getCompanionInfo(selectedPlant.name) || {};
    const excellentCompanions = Array.isArray(companionInfo.excellent) ? companionInfo.excellent : [];
    const neutralCompanions = Array.isArray(companionInfo.neutral) ? companionInfo.neutral : [];
    const avoidCompanions = Array.isArray(companionInfo.avoid) ? companionInfo.avoid : [];
    const pestTip = companionInfo.pests || "Companion planting can improve pollination, reduce pests, and increase garden health.";
    const seasonLabel = getPlantSeasonLabel(selectedPlant, zone);
    const quickFacts = getPlantQuickFacts(selectedPlant);
    const plantingWindow = getPlantingWindowText(selectedPlant);
    const isSaved = savedPlants.includes(selectedPlant.name);
    const isFollowed = followedPlants.includes(selectedPlant.name);
    const wateringCompletedToday = wateredPlants[selectedPlant.name] === getTodayKey();
    const harvestTracker = harvestTrackers[selectedPlant.name];
    const harvestDaysLeft = harvestTracker ? Math.max(0, harvestTracker.days - Math.floor((new Date() - new Date(harvestTracker.startedAt)) / (1000 * 60 * 60 * 24))) : null;
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" />
        <BackgroundDecoration isDark={isDark} />
        <WeatherParticles weather={weather} />
        {xpPopups.map((popup) => (<View key={popup.id} style={styles.xpPopup}><Text style={styles.xpPopupText}>+{popup.amount} XP</Text></View>))}
        {showLevelUp ? (
  <View style={styles.levelUpOverlay}>
    <ConfettiBurst />

    <View style={styles.levelUpCard}>
      <Text style={styles.levelUpEmoji}>🎉</Text>

      <Text style={styles.levelUpTitle}>
        LEVEL UP!
      </Text>

      <Text style={styles.levelUpText}>
        🎉 Level {gardenXP.level} Reached!
      </Text>
    </View>
  </View>
) : null}

<ScrollView
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ paddingBottom: 140 }}
>
  <View style={styles.detailHeader}>
    <Pressable
      onPress={handleBackFromPlant}
      style={styles.backButton}
    >
      <Ionicons
        name="chevron-back"
        size={22}
        color="#ffffff"
      />

      <Text style={styles.backButtonText}>
        Back
      </Text>
    </Pressable>
  </View>

  <Animated.View
    style={[
      styles.detailHero,
      { opacity: fadeAnimation },
    ]}
  >
    <Animated.View
      style={[
        styles.detailGlow,
        { opacity: glowOpacity },
      ]}
    />

    {plantImage ? (
      <View style={styles.detailPlantImageWrap}>
        <Image
          source={plantImage}
          style={styles.detailPlantImage}
          resizeMode="contain"
        />
      </View>
    ) : (
      <Text style={styles.detailPlantEmoji}>
        🌱
      </Text>
    )}

    <View style={styles.detailBadgeRow}>
      <View style={styles.detailBadge}>
        <Text style={styles.detailBadgeText}>
          {rarityStyle?.emoji} {rarityStyle?.label}
        </Text>
      </View>

      <View style={styles.detailBadge}>
        <Text style={styles.detailBadgeText}>
          {seasonLabel}
        </Text>
      </View>
    </View>
            <Text style={styles.detailTitle}>{selectedPlant.name}</Text>
            <Text style={styles.detailSubtitle}>{normalizeType(selectedPlant.type, selectedPlant.name)} • Zones {selectedPlant.minZone}–{selectedPlant.maxZone}</Text>
          </Animated.View>
          <View style={styles.detailQuickActions}>
            <Pressable onPress={() => toggleSavedPlant(selectedPlant.name)} style={[styles.quickActionButton, isSaved && styles.quickActionButtonActive]}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={21} color={isSaved ? "#07120b" : "#ffffff"} />
              <Text style={[styles.quickActionText, isSaved && styles.quickActionTextActive]}>{isSaved ? "Saved" : "Save"}</Text>
            </Pressable>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>Smart care</Text>
            <Text style={styles.cardTitle}>Should you grow it?</Text>
            <Text style={styles.cardText}>{getShouldGrowText(selectedPlant, zone, weather)}</Text>
            <View style={styles.detailMiniGrid}>
              {[
                { icon: "☀️", label: "Sun", value: quickFacts.sun },
                { icon: "🌱", label: "Soil", value: quickFacts.soil },
                { icon: "📏", label: "Spacing", value: quickFacts.spacing },
                { icon: "🏆", label: "Difficulty", value: quickFacts.difficulty },
                { icon: "📅", label: "Planting window", value: plantingWindow },
                { icon: "💧", label: "Watering", value: getWateringTip(weather) },
                { icon: "📍", label: "Best spot", value: getWhereToPlantText(selectedPlant) },
                { icon: "🌤️", label: "Weather advice", value: getPlantSpecificTip(selectedPlant, zone, weather) },
              ].map((fact) => (
                <View key={fact.label} style={styles.detailMiniCard}>
                  <Text style={styles.detailMiniIcon}>{fact.icon}</Text>
                  <Text style={styles.detailMiniLabel}>{fact.label}</Text>
                  <Text style={styles.detailMiniValue}>{fact.value}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>Daily controls</Text>
            <Text style={styles.cardTitle}>Garden actions</Text>
            <Text style={styles.cardText}>Mark watering, add reminders, and upload progress photos for this plant.</Text>
            <View style={styles.harvestTrackerCard}>
              <Text style={styles.harvestTrackerEmoji}>🚜</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.harvestTrackerTitle}>Harvest Tracker</Text>
                <Text style={styles.harvestTrackerText}>{harvestTracker ? (harvestDaysLeft === 0 ? "Ready to harvest!" : `Ready in ${harvestDaysLeft} days`) : getHarvestCountdown(selectedPlant)}</Text>
              </View>
              <Pressable style={styles.harvestTrackerButton} onPress={() => { setHarvestTrackers((current) => ({ ...current, [selectedPlant.name]: { startedAt: new Date().toISOString(), days: Number(getHarvestCountdown(selectedPlant).match(/\d+/)?.[0]) || 75 } })); Alert.alert("Harvest Tracker Started", `${selectedPlant.name} is now being tracked.`); }}>
                <Text style={styles.harvestTrackerButtonText}>{harvestTracker ? "Restart" : "Start"}</Text>
              </Pressable>
            </View>
            <View style={styles.detailControlGrid}>
              <Pressable onPress={() => markPlantWatered(selectedPlant.name)} style={[styles.controlTile, wateringCompletedToday && styles.controlTileActive]}>
                <Text style={styles.controlTileIcon}>💧</Text>
                <Text style={[styles.controlTileTitle, wateringCompletedToday && styles.controlTileTitleActive]}>{wateringCompletedToday ? "Watered" : "Mark watered"}</Text>
              </Pressable>
              <Pressable onPress={() => schedulePlantReminder(selectedPlant.name)} style={styles.controlTile}>
                <Text style={styles.controlTileIcon}>🔔</Text>
                <Text style={styles.controlTileTitle}>Reminder</Text>
              </Pressable>
              <Pressable onPress={() => pickJournalPhoto(selectedPlant.name)} style={styles.controlTile}>
                <Text style={styles.controlTileIcon}>📸</Text>
                <Text style={styles.controlTileTitle}>Add photo</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>Step by step</Text>
            <Text style={styles.cardTitle}>How to plant</Text>
            {getPlantingSteps(selectedPlant).map((step, index) => (
              <View key={`${selectedPlant.name}-step-${index}`} style={styles.stepRow}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>Personal garden notes</Text>
            <Text style={styles.cardTitle}>Notes</Text>
            <Text style={styles.cardText}>Keep track of observations, growth progress, harvest ideas, or anything you want to remember about this plant.</Text>
            <TextInput multiline placeholder={`Write notes about ${selectedPlant.name}...`} placeholderTextColor="#8fbf9d" value={plantNotes[selectedPlant.name] || ""} onChangeText={(text) => setPlantNotes((current) => ({ ...current, [selectedPlant.name]: text }))} style={styles.plantNotesInput} />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>Premium companion intelligence</Text>
            <Text style={styles.cardTitle}>Companion planting</Text>
            <Text style={styles.cardText}>See what grows well near {selectedPlant.name}, what to avoid, and how companion plants may help with pests.</Text>
            {!premiumUnlocked ? (
              <PremiumLockedCard theme={theme} title="Companion planting locked" body="Unlock premium to see excellent pairs, plants to avoid, pest prevention tips, and companion search." onUnlock={() => unlockPremium("Pocket Planter Premium")} />
            ) : (
              <>
                <Text style={styles.companionSectionTitle}>Works great beside</Text>
                <View style={styles.companionVisualGrid}>
                  {companionInfo.excellent.map((item) => (<Pressable key={`excellent-${item}`} onPress={() => openPlantByName(item)} style={styles.companionGoodCard}><Text style={styles.companionVisualIcon}>🟢</Text><Text style={styles.companionVisualTitle}>{item}</Text><Text style={styles.companionVisualSub}>Excellent pair</Text></Pressable>))}
                </View>
                <Text style={styles.companionSectionTitle}>Neutral nearby</Text>
                <View style={styles.companionWrap}>
                  {companionInfo.neutral.map((item) => { const score = getCompatibilityScore(selectedPlant.name, item); return (<Pressable key={`neutral-${item}`} onPress={() => openPlantByName(item)} style={styles.neutralCompanionPill}><Text style={styles.neutralCompanionText}>{score.icon} {item} • {score.label}</Text></Pressable>); })}
                </View>
                <Text style={styles.companionSectionTitle}>What NOT to plant nearby</Text>
                <View style={styles.companionBubbleWrap}>
                  {companionInfo.avoid.map((item) => (<Pressable key={`avoid-${item}`} onPress={() => openPlantByName(item)} style={styles.badCompanionBubble}><Text style={styles.companionBubbleEmoji}>🔴</Text><Text style={styles.companionBubbleText}>{item}</Text><Text style={styles.companionBubbleSub}>Avoid Nearby</Text></Pressable>))}
                </View>
                <View style={styles.doNotPlantWarning}>
                  <Text style={styles.doNotPlantWarningTitle}>⚠ Avoid planting too close</Text>
                  <Text style={styles.doNotPlantWarningText}>{selectedPlant.name} may compete with {companionInfo.avoid[0]} or share pest and disease risks. Give them extra space when planning your garden.</Text>
                </View>
                <View style={styles.pestTipBox}>
                  <Text style={styles.pestTipTitle}>Pest prevention intelligence</Text>
                  <Text style={styles.pestTipText}>{companionInfo.pests}</Text>
                </View>
              </>
            )}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>Gallery preview</Text>
            <Text style={styles.cardTitle}>Plant Artwork!</Text>
            <Text style={styles.cardText}>Your plant artwork is used across cards, galleries, planner slots, and the opening screen.</Text>
            <View style={styles.singleGalleryPreview}>
  {plantImage ? (
    <View style={styles.singleGalleryImageWrap}>
      <Image source={plantImage} style={styles.singleGalleryImage} resizeMode="contain" />
    </View>
  ) : (<Text style={styles.galleryFallback}>🌱</Text>)}
</View>
            <Pressable onPress={handleBackFromPlant} style={styles.bottomBackButton}>
              <Ionicons name="chevron-back" size={22} color="#07120b" />
              <Text style={styles.bottomBackButtonText}>Back to plants</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
  style={[
    styles.safe,
    {
      backgroundColor: theme.background,
    },
  ]}
>
  <StatusBar barStyle="light-content" />

  <View style={{ flex: 1 }}>
    <BackgroundDecoration isDark={isDark} />

    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onScroll={(event) => {
        currentScrollY.current =
          event.nativeEvent.contentOffset.y;
      }}
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
          <>
          {activeTab === "home" ? (
            <>
              {!record ? (
                <Animated.View onLayout={(event) => { homeY.current = event.nativeEvent.layout.y; }} style={[styles.welcomeBuddyCard, { transform: [{ translateY: heroFloat }] }]}>
                  <View style={styles.welcomeGlowOrbOne} />
                  <View style={styles.welcomeGlowOrbTwo} />
                  <Image source={welcomeBuddyImage} style={styles.welcomeBuddyImage} resizeMode="cover" />
                </Animated.View>
              ) : null}
              {record ? (
                <Animated.View style={[styles.smartAssistantPill, { opacity: zoneRevealAnim, transform: [{ translateY: zoneRevealAnim.interpolate({ inputRange: [0,1], outputRange: [18,0] }) }] }]}>
                  <Text style={styles.smartAssistantPillText}>🌱 Smart garden assistant</Text>
                </Animated.View>
              ) : null}
              <View style={[styles.card, styles.zoneCardGlow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.zoneHeaderRow}>
                  <View style={styles.zoneIconGlow}><Text style={styles.zoneIconText}>📍</Text></View>
                  <Text style={[styles.cardTitle, { color: theme.text, flex: 1 }]}>Find your Garden Zone!</Text>
                </View>
                <Text style={[styles.cardText, { color: theme.secondaryText }]}>Enter your ZIP code so Pocket Planter can match plants to your local growing zone.</Text>
                <TextInput value={zip} onChangeText={(value) => setZip(normalizeZip(value))} keyboardType="number-pad" maxLength={5} placeholder="Enter ZIP code" placeholderTextColor="#8fbf9d" style={[styles.input, styles.zoneInput, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]} />
                <View style={styles.actionRow}>
                  <Pressable style={[styles.primaryButton, styles.glowPrimaryButton]} onPress={() => Keyboard.dismiss()}><Text style={styles.primaryButtonText}>Apply ZIP</Text></Pressable>
                  <Pressable style={[styles.secondaryButton, styles.glowSecondaryButton, { borderColor: theme.border }]} onPress={detectLocationAndZone}><Text style={[styles.secondaryButtonText, { color: theme.text }]}>Use location</Text></Pressable>
                </View>
                {record ? (
                  <View style={styles.zoneBanner}>
                    <Text style={styles.zoneMini}>Your growing zone</Text>
                    <Text style={styles.zoneBig}>Zone {record.zone}</Text>
                    <Text style={styles.zoneDetails}>{record.zonetitle}</Text>
                    <Pressable style={styles.zoneJumpButton} onPress={() => { scrollRef.current?.scrollTo({ y: monthlyPicksY.current, animated: true }); }}>
                      <Text style={styles.zoneJumpButtonText}>View {monthlySuggestions.length} plants for {MONTH_NAMES[selectedMonth - 1]} ↓</Text>
                    </Pressable>
                  </View>
                ) : zip.length === 5 ? (<Text style={styles.errorText}>Couldn't find that ZIP in your zone file.</Text>) : null}
              </View>
            </>
          ) : null}
          {record && activeTab === "home" ? (
            <>
              <View onLayout={(event) => { monthlyPicksY.current = event.nativeEvent.layout.y; }} style={[styles.card, styles.primaryFeatureCard, { backgroundColor: theme.card }]}>
  <View style={styles.primaryFeatureAccentBar} />
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>This Month's Picks!</Text>
                    <Text style={[styles.cardText, { color: theme.secondaryText }]}>Plants that match your zone and are best for {MONTH_NAMES[selectedMonth - 1]}.</Text>
                  </View>
                  <Pressable style={styles.smallJumpButton} onPress={() => { scrollRef.current?.scrollTo({ y: plantsListY.current, animated: true }); }}>
                    <Text style={styles.smallJumpButtonText}>All plants</Text>
                  </Pressable>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                  {MONTH_NAMES.map((month, index) => {
                    const monthNumber = index + 1;
                    const active = selectedMonth === monthNumber;
                    return (
                      <Pressable key={month} onPress={() => setSelectedMonth(monthNumber)} style={[styles.calendarMonthCard, active && styles.calendarMonthCardActive]}>
                        <Text style={styles.calendarMonthEmoji}>{getMonthEmoji(monthNumber)}</Text>
                        <Text style={[styles.calendarMonthText, { color: active ? "#ffd86b" : "#d7ebdc" }]}>{month.slice(0, 3)}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                {monthlySuggestions.length ? (
                  <View style={styles.cleanPlantList}>
                    {monthlySuggestions.map((item) => {
                      const imageSource = resolvePlantImageSource(item);
                      return (
                        <Pressable key={`monthly-${item.name}`} style={styles.cleanPlantRow} onPress={() => openPlantFromMonthly(item)}>
                          <View style={styles.cleanPlantImageWrap}>
                            {imageSource ? (<Image source={imageSource} style={styles.cleanPlantImage} />) : (<Text style={styles.cleanPlantEmoji}>🌱</Text>)}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.cleanPlantName}>{item.name}</Text>
                            <Text style={styles.cleanPlantMeta}>{normalizeType(item.type, item.name)} • {getPlantSeasonLabel(item, zone, selectedMonth)}</Text>
                          </View>
                          <Text style={styles.cleanPlantArrow}>›</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <Text style={[styles.cardText, { color: theme.secondaryText }]}>No plants found for Zone {zone || "—"} in {MONTH_NAMES[selectedMonth - 1]}.</Text>
                )}
              </View>
              {showPremiumIntro ? (<PremiumIntroCard onClose={dismissPremiumIntro} onUnlock={() => unlockPremium("Pocket Planter Premium")} />) : null}
              <Animated.View
  style={[
    styles.hero,
    {
      opacity: fadeAnimation,
      transform: [
        { translateY: heroFloat },
      ],
    },
  ]}
>
  <Text style={styles.heroTitle}>
    Welcome Back 🌱
  </Text>

  <Text style={styles.heroSubtitle}>
    Your garden is growing. Check today's
    recommendations, weather, and progress
    below.
  </Text>
</Animated.View>

<StreakProgressCard
  theme={theme}
  streakData={streakData}
/>

<GardenStatsDashboard
  theme={theme}
  savedPlants={savedPlants}
  journalEntries={journalEntries}
  gardenMap={gardenMap}
  gardenXP={gardenXP}
  streakData={streakData}
/>

<PlantTodayHero
  theme={theme}
  monthlySuggestions={monthlySuggestions}
  compatiblePlants={compatiblePlants}
  zone={zone}
  onOpen={openPlantFromList}
/>

<ForecastCard
  theme={theme}
  weather={weather}
/>

<DailyBonusCard
  theme={theme}
  dailyBonusClaimed={dailyBonusClaimed}
  onClaim={claimDailyBonus}
/>

<GardenIntelligenceCard
  theme={theme}
  weather={weather}
/>

<MyGardenTodayCard
  theme={theme}
  weather={weather}
  monthlySuggestions={monthlySuggestions}
  savedPlants={savedPlants}
  wateredPlants={wateredPlants}
  onOpenPlant={openPlantFromList}
  onAddPhoto={() => pickJournalPhoto("Garden")}
/>
<WeatherWarningBanner
  theme={theme}
  weather={weather}
  zone={zone}
/>

<ForecastCard
  theme={theme}
  weather={weather}
/>

<GardenSummaryRow
  theme={theme}
  remindersOn={remindersOn}
  frostAlertsOn={frostAlertsOn}
  monthlyPlantingOn={monthlyPlantingOn}
  dailyWateringOn={dailyWateringOn}
  onPressReminders={jumpToSmartReminders}
  gardenHealth={gardenHealth}
  onPressGarden={() => jumpToTab("garden")}
/>

{(savedPlants.length > 0 ||
  journalEntries.length > 0 ||
  streakData.count > 1) ? (
  <StatsRow
    theme={theme}
    compatiblePlants={monthlySuggestions}
    savedPlants={savedPlants}
    journalEntries={journalEntries}
    streakData={streakData}
  />
) : null}
              {premiumUnlocked ? (
                <LiveWeatherCard theme={theme} weather={weather} recommendation={smartRecommendation} zone={zone} />
              ) : (
                <WeatherTeaserCard theme={theme} weather={weather} zone={zone} onUnlock={() => unlockPremium("Pocket Planter Premium")} />
              )}
              {premiumUnlocked ? (
                <DailyQuestsCard theme={theme} dailyQuests={dailyQuests} />
              ) : (
                <PremiumLockedCard theme={theme} title="Daily quests locked" body="Unlock gardening streaks, XP progression, achievements, and daily challenges." onUnlock={() => unlockPremium("Pocket Planter Premium")} />
              )}
              <SavedPlantsCard theme={theme} savedPlants={savedPlants} plantFolders={plantFolders} premiumUnlocked={premiumUnlocked} wateredPlants={wateredPlants} weather={weather} harvestTrackers={harvestTrackers} onOpenPlant={openPlantFromList} onUpgrade={() => jumpToTab("premium")} />
              <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Explore Plants!</Text>
                <Text style={[styles.cardText, { color: theme.secondaryText }]}>Swipe through curated plant cards for your zone and discover vegetables, herbs, fruits, and flowers that thrive right now.</Text>
               
<SwipeablePlantGallery
  plants={searchableGalleryPlants}
  theme={theme}
  zone={zone}
  onOpen={openPlantFromList}
/>
<Pressable
  style={styles.seeAllPlantsButton}
  onPress={() => jumpToTab("plants")}
>
  <Text style={styles.seeAllPlantsButtonText}>
    See Full Plant Library →
  </Text>
</Pressable>
              </View>
            </>
          ) : null}
          {record && activeTab === "garden" ? (
            <>
              <View
                onLayout={(event) => {
                  reminderY.current =
                    event.nativeEvent.layout.y;
                }}
              >
                <ReminderControlCard
                  theme={theme}
                  remindersOn={remindersOn}
                  frostAlertsOn={frostAlertsOn}
                  monthlyPlantingOn={
                    monthlyPlantingOn
                  }
                  dailyWateringOn={
                    dailyWateringOn
                  }
                  onToggleReminders={(
                    value
                  ) => {
                    setRemindersOn(value);

                    Alert.alert(
                      value
                        ? "Watering Reminders On"
                        : "Watering Reminders Off",
                      value
                        ? "You can now add watering reminders from individual plant pages."
                        : "Plant-page watering reminders are now disabled."
                    );
                  }}
                  onToggleFrost={(value) => {
                    setFrostAlertsOn(value);

                    Alert.alert(
                      value
                        ? "Frost Alerts On"
                        : "Frost Alerts Off",
                      value
                        ? "Pocket Planter will remind you to check overnight lows."
                        : "You will no longer receive frost alert reminders."
                    );
                  }}
                  onToggleMonthlyPlanting={(
                    value
                  ) => {
                    setMonthlyPlantingOn(
                      value
                    );

                    if (value) {
                      scheduleMonthlyPlantingNotifications();

                      Alert.alert(
                        "Monthly Planting Guides On 🌱",
                        "You'll receive a planting guide on the 1st of every month."
                      );
                    } else {
                      Alert.alert(
                        "Monthly Planting Reminders Off",
                        "You will no longer receive monthly planting guide reminders."
                      );
                    }
                  }}
                  onToggleDailyWatering={(value) => { setDailyWateringOn(value); if (value) { scheduleDailyWateringNotification(); Alert.alert("Daily Watering Check On 💧", "Pocket Planter will remind you each morning to check your garden."); } else { Alert.alert("Daily Watering Reminder Off", "You will no longer receive daily watering reminders."); } }}
                />
              </View>
              <View onLayout={(event) => { gardenY.current = event.nativeEvent.layout.y; }} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Garden Planner Map!</Text>
                <Text style={[styles.cardText, { color: theme.secondaryText }]}>Tap a plot to assign a saved plant. Pocket Planter will warn you when nearby plants should not grow together.</Text>
                <GardenHealthCard theme={theme} gardenHealth={gardenHealth} gardenMap={gardenMap} />
                <View style={styles.gardenTemplateWrap}>
                  {[{ id: "backyard", title: "Small Backyard", icon: "🏡" }, { id: "balcony", title: "Balcony Pots", icon: "🪴" }, { id: "raised", title: "Raised Bed", icon: "🥬" }, { id: "herbs", title: "Herb Garden", icon: "🌿" }].map((template) => (
                    <Pressable key={template.id} style={styles.gardenTemplateButton} onPress={() => applyGardenTemplate({ template: template.id, savedPlants: produceData.filter((item) => savedPlants.includes(item.name)), onAssign: assignPlantToGardenSlot })}>
                      <Text style={styles.gardenTemplateIcon}>{template.icon}</Text>
                      <Text style={styles.gardenTemplateText}>{template.title}</Text>
                    </Pressable>
                  ))}
                </View>
                {savedPlants.length ? (
                  <GardenPlannerMap theme={theme} gardenMap={gardenMap} savedPlants={produceData.filter((item) => savedPlants.includes(item.name))} wateredPlants={wateredPlants} onAssign={assignPlantToGardenSlot} onClear={clearGardenSlot} />
                ) : (
                  <View style={styles.emptyStateCard}>
                    <Text style={styles.emptyStateIcon}>🗺️</Text>
                    <Text style={styles.emptyStateTitle}>Build Your First Garden</Text>
                    <Text style={styles.emptyStateText}>Save a few plants first, then place them into your garden layout and track companion planting compatibility.</Text>
                  </View>
                )}
              </View>
            </>
          ) : null}
          {record && activeTab === "plants" ? (
            <>
              <View onLayout={(event) => { plantsListY.current = event.nativeEvent.layout.y; }} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Plants</Text>
                    <Text style={[styles.cardText, { color: theme.secondaryText }]}>Showing what's best to plant right now first, with the rest neatly organized below.</Text>
                  </View>
                  <Pressable
  style={styles.smallJumpButton}
  onPress={() => {
    setSelectedType("All");
    setComparePlants([]);
  }}
>
  <Text style={styles.smallJumpButtonText}>
    Reset
  </Text>
</Pressable>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterTabsNew}
                >
                  {PLANT_TYPES.map((type) => {
                    const active =
                      selectedType === type;

                    return (
                      <Pressable
                        key={type}
                        onPress={() =>
                          setSelectedType(type)
                        }
                        style={[
                          styles.filterTabNew,
                          active &&
                            styles.filterTabNewActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterTabNewText,
                            active &&
                              styles.filterTabNewTextActive,
                          ]}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                {comparePlants.length === 2 ? (
                  <View style={styles.compareCard}>
                    <Text style={styles.compareTitle}>⚔️ Plant Comparison</Text>
                    {(() => {
                      const left = produceData.find((plant) => plant.name === comparePlants[0]);
                      const right = produceData.find((plant) => plant.name === comparePlants[1]);
                      if (!left || !right) return null;
                      return (
                        <>
                          <View style={styles.compareRow}><Text style={styles.comparePlantName}>{left.name}</Text><Text style={styles.compareVs}>VS</Text><Text style={styles.comparePlantName}>{right.name}</Text></View>
                          {[["Difficulty", getPlantDifficulty(left).label, getPlantDifficulty(right).label], ["Harvest", getHarvestCountdown(left), getHarvestCountdown(right)], ["Zones", `${left.minZone}-${left.maxZone}`, `${right.minZone}-${right.maxZone}`], ["Type", normalizeType(left.type, left.name), normalizeType(right.type, right.name)]].map(([label, lv, rv]) => (
                            <View key={label} style={styles.compareStatRow}><Text style={styles.compareLabel}>{label}</Text><Text style={styles.compareValue}>{lv}</Text><Text style={styles.compareValue}>{rv}</Text></View>
                          ))}
                          <Pressable onPress={() => setComparePlants([])} style={styles.compareClearButton}><Text style={styles.compareClearText}>Clear Comparison</Text></Pressable>
                        </>
                      );
                    })()}
                  </View>
                ) : comparePlants.length === 1 ? (
                  <View style={styles.compareHintCard}><Text style={styles.compareHintText}>⚔️ Select one more plant to compare with {comparePlants[0]}.</Text></View>
                ) : null}
                <View style={styles.plantList}>
                  {filteredPlants.map((item) => (
                    <GlowPlantCard key={item.name} plant={item} weather={weather} zone={zone} theme={theme} isSaved={savedPlants.includes(item.name)} isCompared={comparePlants.includes(item.name)} isFollowed={followedPlants.includes(item.name)} wateredDate={wateredPlants[item.name]} onOpen={() => openPlantFromList(item)} onSave={() => toggleSavedPlant(item.name)} onCompare={() => toggleComparePlant(item.name)} onFollow={() => toggleFollowPlant(item.name)} onWater={() => markPlantWatered(item.name)} />
                  ))}
                </View>
              </View>
            </>
          ) : null}
          {activeTab === "journal" ? (
            <View onLayout={(event) => { journalY.current = event.nativeEvent.layout.y; }}>
              <JournalCard theme={theme} journalEntries={journalEntries} onAddGeneralPhoto={() => pickJournalPhoto("Garden")} onDeleteEntry={deleteJournalEntry} />
            </View>
          ) : null}
          {record && activeTab === "profile" ? (
            <View onLayout={(event) => { premiumY.current = event.nativeEvent.layout.y; }}>
              <GardenerProfileCard theme={theme} setAppearanceMode={setAppearanceMode} avatarGlow={avatarGlow} gardenXP={gardenXP} savedPlants={savedPlants} journalEntries={journalEntries} gardenMap={gardenMap} streakData={streakData} profileBanners={profileBanners} selectedProfileTheme={selectedProfileTheme} setSelectedProfileTheme={setSelectedProfileTheme} profileName={profileName} setProfileName={setProfileName} profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} />
              <ProfileBannersCard theme={theme} profileBanners={profileBanners} />
              <XPCard theme={theme} gardenXP={gardenXP} />
              <AchievementCard theme={theme} badges={achievementBadges} streakData={streakData} />
            </View>
          ) : null}
          {activeTab === "premium" ? (
            <View onLayout={(event) => { premiumY.current = event.nativeEvent.layout.y; }}>
              <SettingsCard theme={theme} premiumUnlocked={premiumUnlocked} setPremiumUnlocked={setPremiumUnlocked} subscriptionPlan={subscriptionPlan} setSubscriptionPlan={setSubscriptionPlan} onUnlockPremium={unlockPremium} />
              <View style={styles.attributionContainer}>
                <Image source={prismLogo} style={styles.attributionLogo} resizeMode="contain" />
                <Text style={[styles.attributionText, { color: theme.secondaryText }]}>Plant hardiness zone data courtesy of PRISM Climate Group and USDA.</Text>
              </View>
            </View>
          ) : null}
          </>
        </ScrollView>
        {record ? (
          <View style={styles.bottomTabs}>
            {[{ id: "home", label: "Home", icon: "home", premium: false }, { id: "plants", label: "Plants", icon: "leaf", premium: false }, { id: "garden", label: "Garden", icon: "grid", premium: true }, { id: "journal", label: "Journal", icon: "book", premium: true }, { id: "profile", label: "Profile", icon: "person-circle", premium: true }, { id: "premium", label: "Premium", icon: "star", premium: false }].map((tab) => {
              const active = activeTab === tab.id;
              const locked = tab.premium && !premiumUnlocked;
              return (
                <Pressable key={tab.id} onPress={() => { if (locked) { jumpToTab("premium"); return; } jumpToTab(tab.id); }} style={({ pressed }) => [styles.bottomTabButton, active && styles.bottomTabButtonActive, active && styles.bottomTabGlow, pressed && styles.bottomTabPressed]}>
                  <View style={[styles.bottomTabInner, active && styles.bottomTabInnerActive]}>
                    <Ionicons name={tab.icon} size={22} color={active ? "#07120b" : "#d7ebdc"} />
                    <Text style={[styles.bottomTabText, active && styles.bottomTabTextActive]}>{tab.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
function GardenStatsDashboard({
  theme,
  savedPlants,
  journalEntries,
  gardenMap,
  gardenXP,
  streakData,
}) {
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;

  const stats = [
    { icon: "🌱", label: "Plants Saved", value: savedPlants.length },
    { icon: "📸", label: "Journal Entries", value: journalEntries.length },
    { icon: "🏆", label: "Level", value: gardenXP.level },
    { icon: "🔥", label: "Streak", value: `${streakData?.count || 0} Days` },
    { icon: "🗺️", label: "Plots Filled", value: gardenPlotCount },
  ];

  return (
    <View
      style={[
        styles.gardenStatsDashboard,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={styles.gardenStatsEyebrow}>GARDEN DASHBOARD</Text>

      <Text style={[styles.gardenStatsTitle, { color: theme.text }]}>
        Your Garden Stats
      </Text>

      <View style={styles.gardenStatsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.gardenStatsTile}>
            <Text style={styles.gardenStatsIcon}>{stat.icon}</Text>
            <Text style={styles.gardenStatsValue}>{stat.value}</Text>
            <Text style={styles.gardenStatsLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
function ConfettiBurst() {
  const pieces = [
    "🎉",
    "🌱",
    "✨",
    "💚",
    "🏆",
    "🌿",
    "🎊",
    "⭐",
  ];

  return (
    <View
      pointerEvents="none"
      style={styles.confettiLayer}
    >
      {pieces.map((piece, index) => (
        <Text
          key={`${piece}-${index}`}
          style={[
            styles.confettiPiece,
            {
              left: `${8 + index * 11}%`,
              top: index % 2 === 0 ? 80 : 135,
            },
          ]}
        >
          {piece}
        </Text>
      ))}
    </View>
  );
}
function ForecastCard({ theme, weather }) {
  const forecast = weather?.forecast || [];

  if (!forecast.length) return null;

  return (
    <View
      style={[
        styles.forecastCard,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={styles.forecastEyebrow}>
        7-DAY FORECAST
      </Text>

      <Text style={[styles.forecastTitle, { color: theme.text }]}>
        Garden Weather This Week
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastScroll}
      >
        {forecast.map((day) => {
          const date = new Date(`${day.date}T12:00:00`);
          const dayLabel = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          return (
            <View key={day.date} style={styles.forecastDayCard}>
              <Text style={styles.forecastDayLabel}>
                {dayLabel}
              </Text>

              <Text style={styles.forecastIcon}>
                {getWeatherIconFromDay(day)}
              </Text>

              <Text style={styles.forecastTemp}>
                {Math.round(day.maxTempF)}°
              </Text>

              <Text style={styles.forecastRain}>
                {Math.round(day.precipChance)}% rain
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function DailyBonusCard({
  theme,
  dailyBonusClaimed,
  onClaim,
}) {
  return (
    <View
      style={[
        styles.dailyBonusCard,
        {
          backgroundColor: theme.card,
          borderColor: dailyBonusClaimed
            ? "rgba(92,255,137,0.18)"
            : "#5cff89",
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.dailyBonusEyebrow}>
          🎁 DAILY REWARD
        </Text>

        <Text
          style={[
            styles.dailyBonusTitle,
            { color: theme.text },
          ]}
        >
          Daily Garden Bonus
        </Text>

        <Text
          style={[
            styles.dailyBonusText,
            { color: theme.secondaryText },
          ]}
        >
          {dailyBonusClaimed
            ? "Today's +25 XP bonus has been claimed."
            : "Open Pocket Planter daily and claim +25 XP."}
        </Text>
      </View>

      <Pressable
        disabled={dailyBonusClaimed}
        onPress={onClaim}
        style={[
          styles.dailyBonusButton,
          dailyBonusClaimed &&
            styles.dailyBonusButtonClaimed,
        ]}
      >
        <Text style={styles.dailyBonusButtonText}>
          {dailyBonusClaimed ? "Claimed" : "+25 XP"}
        </Text>
      </Pressable>
    </View>
  );
}

function GardenIntelligenceCard({ theme, weather }) {
  const forecast = weather?.forecast || [];

  if (!forecast.length) return null;

  const formatDay = (dateString) =>
    new Date(`${dateString}T12:00:00`).toLocaleDateString(
      "en-US",
      { weekday: "long" }
    );

  const bestPlantingDay =
    forecast.find(
      (day) =>
        day.maxTempF >= 65 &&
        day.maxTempF <= 90 &&
        day.minTempF >= 42 &&
        day.precipChance < 55
    ) || forecast[0];

  const bestWateringDay =
    forecast.find(
      (day) =>
        day.maxTempF >= 88 &&
        day.precipChance < 50
    ) || forecast[0];

  const heavyRainDay = forecast.find(
    (day) => day.precipChance >= 70
  );

  const frostRiskDay = forecast.find(
    (day) => day.minTempF <= 35
  );

  const heatRiskDay = forecast.find(
    (day) => day.maxTempF >= 95
  );

  const intelligenceItems = [
    {
      label: "Best planting day",
      value: formatDay(bestPlantingDay.date),
      icon: "🌱",
    },
    {
      label: "Best watering day",
      value: formatDay(bestWateringDay.date),
      icon: "💧",
    },
    {
      label: "Heavy rain expected",
      value: heavyRainDay
        ? formatDay(heavyRainDay.date)
        : "None",
      icon: "🌧️",
    },
    {
      label: "Frost risk",
      value: frostRiskDay
        ? formatDay(frostRiskDay.date)
        : "None",
      icon: "❄️",
    },
    {
      label: "Heat stress risk",
      value: heatRiskDay
        ? formatDay(heatRiskDay.date)
        : "None",
      icon: "🔥",
    },
  ];

  return (
    <View
      style={[
        styles.gardenIntelligenceCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={styles.gardenIntelligenceEyebrow}>
        🧠 GARDEN INTELLIGENCE
      </Text>

      <Text
        style={[
          styles.gardenIntelligenceTitle,
          { color: theme.text },
        ]}
      >
        Smart Week Ahead
      </Text>

      <View style={styles.gardenIntelligenceGrid}>
        {intelligenceItems.map((item) => (
          <View
            key={item.label}
            style={styles.gardenIntelligenceTile}
          >
            <Text style={styles.gardenIntelligenceLabel}>
              {item.icon} {item.label}
            </Text>

            <Text style={styles.gardenIntelligenceValue}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
// ── Sub-components ───────────────────────────────────────────────────────────
function StatsRow({ theme, compatiblePlants, savedPlants, journalEntries, streakData }) {
  return (
    <View style={styles.statsRow}>
      <MiniStat theme={theme} label="Plants" value={compatiblePlants.length} icon="🌱" />
      <MiniStat theme={theme} label="Saved" value={savedPlants.length} icon="💚" />
      <MiniStat theme={theme} label="Journal" value={journalEntries.length} icon="📓" />
      <MiniStat theme={theme} label="Streak" value={`${streakData.count}d`} icon="🔥" />
    </View>
  );
}
function MiniStat({ theme, label, value, icon }) {
  return (
    <View style={[styles.miniStat, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.miniStatIcon}>{icon}</Text>
      <Text style={[styles.miniStatValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.miniStatLabel, { color: theme.secondaryText }]}>{label}</Text>
    </View>
  );
}
function WeatherTaskCard({ theme, weather }) {
  const tasks = [];
  if (weather?.maxTempF >= 95) { tasks.push("🔥 Water early before peak heat."); tasks.push("🪴 Move containers into partial shade."); }
  if (weather?.precipChance >= 65) { tasks.push("🌧️ Check soil before watering."); tasks.push("🧺 Make sure pots can drain."); }
  if (weather?.minTempF <= 35) { tasks.push("❄️ Cover sensitive plants tonight."); tasks.push("🏠 Move small pots near shelter."); }
  if (!tasks.length) { tasks.push("☀️ Great day for normal garden care."); tasks.push("🌱 Check saved plants and add progress photos."); }
  return (
    <View style={[styles.weatherTaskCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.weatherTaskEyebrow}>SMART TASKS</Text>
      <Text style={[styles.weatherTaskTitle, { color: theme.text }]}>Weather-Based Tasks</Text>
      {tasks.map((task) => (<Text key={task} style={styles.weatherTaskItem}>{task}</Text>))}
    </View>
  );
}
function WeeklyAndTasksCard({ theme, savedPlants, journalEntries, wateredPlants, gardenXP, streakData, weather }) {
  const wateredCount = Object.values(wateredPlants || {}).filter(Boolean).length;
  const hasAnyData = savedPlants.length > 0 || journalEntries.length > 0 || wateredCount > 0;

  const tasks = [];
  if (weather?.maxTempF >= 95) tasks.push("🔥 Water early before peak heat.");
  if (weather?.precipChance >= 65) tasks.push("🌧️ Check soil before watering.");
  if (weather?.minTempF <= 35) tasks.push("❄️ Cover sensitive plants tonight.");
  if (!tasks.length) tasks.push("☀️ Great day for normal garden care.");

  return (
    <View style={[styles.weeklyRecapCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {hasAnyData ? (
        <>
          <Text style={styles.weeklyRecapEyebrow}>WEEKLY RECAP</Text>
          <Text style={[styles.weeklyRecapTitle, { color: theme.text }]}>Your Garden Progress 🌱</Text>
          <View style={styles.weeklyRecapGrid}>
            {wateredCount > 0 && <Text style={styles.weeklyRecapItem}>💧 Watered: {wateredCount}</Text>}
            {journalEntries.length > 0 && <Text style={styles.weeklyRecapItem}>📸 Photos: {journalEntries.length}</Text>}
            {savedPlants.length > 0 && <Text style={styles.weeklyRecapItem}>🪴 Saved: {savedPlants.length}</Text>}
            {gardenXP.xp > 0 && <Text style={styles.weeklyRecapItem}>⭐ XP: {gardenXP.xp}</Text>}
          </View>
          <Text style={styles.weeklyRecapFooter}>🔥 Current streak: {streakData?.count || 0} days</Text>
        </>
      ) : (
        <>
          <Text style={styles.weeklyRecapEyebrow}>GET STARTED</Text>
          <Text style={[styles.weeklyRecapTitle, { color: theme.text }]}>Start your garden story</Text>
          <Text style={[styles.weeklyFirstUseText, { color: theme.secondaryText }]}>Save your first plant, log a photo, or mark something as watered — your recap will appear here.</Text>
          <View style={styles.weeklyFirstUseRow}>
            <Text style={styles.weeklyFirstUsePill}>💧 Water a plant</Text>
            <Text style={styles.weeklyFirstUsePill}>📸 Add a photo</Text>
            <Text style={styles.weeklyFirstUsePill}>🌱 Save a plant</Text>
          </View>
        </>
      )}
      <View style={styles.weeklyTaskDivider} />
      <Text style={styles.weatherTaskEyebrow}>SMART TASKS</Text>
      {tasks.map((task) => (<Text key={task} style={styles.weatherTaskItem}>{task}</Text>))}
    </View>
  );
}

function GardenSummaryRow({ theme, remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn, onPressReminders, gardenHealth, onPressGarden }) {
  const enabledCount = [remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn].filter(Boolean).length;
  return (
    <View style={styles.gardenSummaryRow}>
      <Pressable onPress={onPressReminders} style={[styles.gardenSummaryCard, { backgroundColor: theme.card, borderColor: enabledCount === 4 ? "#5cff89" : "#ffd86b" }]}>
        <Text style={styles.gardenSummaryIcon}>{enabledCount === 4 ? "✅" : "🔔"}</Text>
        <Text style={[styles.gardenSummaryTitle, { color: theme.text }]}>Reminders</Text>
        <Text style={styles.gardenSummaryMeta}>{enabledCount}/4 on</Text>
      </Pressable>
      <Pressable onPress={onPressGarden} style={[styles.gardenSummaryCard, { backgroundColor: theme.card, borderColor: gardenHealth.score >= 80 ? "#5cff89" : "#ffd86b" }]}>
        <Text style={styles.gardenSummaryIcon}>🌱</Text>
        <Text style={[styles.gardenSummaryTitle, { color: theme.text }]}>Garden</Text>
        <Text style={styles.gardenSummaryMeta}>{gardenHealth.score}% health</Text>
      </Pressable>
    </View>
  );
}
function WeeklyGardenRecapCard({
  theme,
  savedPlants,
  journalEntries,
  wateredPlants,
  gardenXP,
  streakData,
}) {
  const wateredCount = Object.values(
    wateredPlants || {}
  ).filter(Boolean).length;

  const hasAnyData =
    savedPlants.length > 0 ||
    journalEntries.length > 0 ||
    wateredCount > 0;

  if (!hasAnyData) {
    return null;
  }

  return (
    <View
      style={[
        styles.weeklyRecapCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={styles.weeklyRecapEyebrow}>
        WEEKLY RECAP
      </Text>

      <Text
        style={[
          styles.weeklyRecapTitle,
          { color: theme.text },
        ]}
      >
        Your Garden Progress 🌱
      </Text>

      <View style={styles.weeklyRecapGrid}>
        {wateredCount > 0 && (
          <Text style={styles.weeklyRecapItem}>
            💧 Watered: {wateredCount}
          </Text>
        )}

        {journalEntries.length > 0 && (
          <Text style={styles.weeklyRecapItem}>
            📸 Photos: {journalEntries.length}
          </Text>
        )}

        {savedPlants.length > 0 && (
          <Text style={styles.weeklyRecapItem}>
            🪴 Saved: {savedPlants.length}
          </Text>
        )}

        {gardenXP.xp > 0 && (
          <Text style={styles.weeklyRecapItem}>
            ⭐ XP: {gardenXP.xp}
          </Text>
        )}
      </View>

      <Text style={styles.weeklyRecapFooter}>
        🔥 Current streak:{" "}
        {streakData?.count || 0} days
      </Text>
    </View>
  );
}
function MyGardenTodayCard({ theme, weather, monthlySuggestions, savedPlants, wateredPlants, onOpenPlant, onAddPhoto }) {
  const savedWateredToday = savedPlants.filter((plantName) => wateredPlants?.[plantName] === getTodayKey()).length;
  const needsWaterCount = Math.max(savedPlants.length - savedWateredToday, 0);
  const tasks = [
    { icon: "💧", title: "Water check", text: needsWaterCount > 0 ? `${needsWaterCount} saved plant${needsWaterCount === 1 ? "" : "s"} may need water.` : "All saved plants look watered today." },
    { icon: weather?.minTempF <= 35 ? "❄️" : "🌤️", title: "Weather check", text: weather?.minTempF <= 35 ? "Frost risk tonight. Cover sensitive plants." : weather?.maxTempF >= 95 ? "Hot day. Water early and add shade." : weather?.precipChance >= 65 ? "Rain likely. Check soil before watering." : "Weather looks steady for garden care." },
    { icon: "📸", title: "Garden photo", text: "Add one progress photo to your journal.", action: onAddPhoto },
  ];
  return (
    <View style={[styles.myGardenTodayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.myGardenTodayEyebrow}>TODAY'S CHECKLIST</Text>
      <Text style={[styles.myGardenTodayTitle, { color: theme.text }]}>My Garden Today</Text>
      <Text style={[styles.myGardenTodaySubtext, { color: theme.secondaryText }]}>A quick daily plan based on your saved plants, weather, and planting window.</Text>
      <View style={styles.myGardenTaskList}>
        {tasks.map((task) => (
          <Pressable key={task.title} disabled={!task.action} onPress={task.action} style={styles.myGardenTaskRow}>
            <Text style={styles.myGardenTaskIcon}>{task.icon}</Text>
            <View style={{ flex: 1 }}><Text style={styles.myGardenTaskTitle}>{task.title}</Text><Text style={styles.myGardenTaskText}>{task.text}</Text></View>
            {task.action ? (<Text style={styles.myGardenTaskArrow}>›</Text>) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
function StreakProgressCard({ theme, streakData }) {
  const streak = streakData?.count || 0;
  const progress = Math.min(streak / 7, 1);
  return (
    <View style={[styles.streakProgressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.streakProgressEmoji}>🔥</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.streakProgressTitle, { color: theme.text }]}>{streak}-day garden streak</Text>
        <Text style={[styles.streakProgressText, { color: theme.secondaryText }]}>Keep opening Pocket Planter to reach your next 7-day reward.</Text>
        <View style={styles.streakProgressBar}><View style={[styles.streakProgressFill, { width: `${progress * 100}%` }]} /></View>
      </View>
    </View>
  );
}
function PlantTodayHero({ theme, monthlySuggestions, compatiblePlants, zone, onOpen }) {
  const plant = monthlySuggestions?.[0] || compatiblePlants?.[0];
  if (!plant) return null;
  const imageSource = resolvePlantImageSource(plant);
  return (
    <Pressable onPress={() => onOpen(plant)} style={[styles.plantTodayHero, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.plantTodayEyebrow}>🌱 Plant today</Text>
        <Text style={[styles.plantTodayTitle, { color: theme.text }]}>{plant.name}</Text>
        <Text style={[styles.plantTodayText, { color: theme.secondaryText }]}>A strong seasonal pick for Zone {zone || "—"} right now.</Text>
        <Text style={styles.plantTodayButtonText}>View care guide →</Text>
      </View>
      {imageSource ? (
  <View style={styles.plantTodayImageWrap}>
    <Image source={imageSource} style={styles.plantTodayImage} resizeMode="contain" />
  </View>
) : (<Text style={styles.plantTodayFallback}>🌿</Text>)}
    </Pressable>
  );
}
function WeatherWarningBanner({
  theme,
  weather,
  zone,
}) {
  const warning =
    weather?.maxTempF >= 98
      ? {
          icon: "🔥",
          title: "Heat warning today",
          text: "Water early, add shade for young plants, and avoid transplanting during peak heat.",
        }
      : weather?.minTempF <= 35
      ? {
          icon: "❄️",
          title: "Frost risk tonight",
          text: "Cover tender plants and move containers near shelter before evening.",
        }
      : weather?.precipChance >= 70
      ? {
          icon: "🌧️",
          title: "Rain likely soon",
          text: "Skip extra watering unless the soil is already dry.",
        }
      : null;

  if (!warning) {
    return null;
  }

  return (
    <View
      style={[
        styles.weatherWarningBanner,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={styles.weatherWarningIcon}>
        {warning.icon}
      </Text>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.weatherWarningTitle,
            { color: theme.text },
          ]}
        >
          {warning.title}
        </Text>

        <Text
          style={[
            styles.weatherWarningText,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          {warning.text}
        </Text>
      </View>
    </View>
  );
}
function LiveWeatherCard({ theme, weather, recommendation, zone }) {
  return (
    <View style={[styles.liveWeatherCard, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <Text style={styles.liveWeatherEyebrow}>🌤 Live garden weather</Text>
      <Text style={styles.liveWeatherTitle}>{recommendation.title}</Text>
      <Text style={styles.liveWeatherBody}>{recommendation.body}</Text>
      <View style={styles.liveWeatherGrid}>
        <View style={styles.liveWeatherBox}><Text style={styles.liveWeatherIcon}>🌙</Text><Text style={styles.liveWeatherLabel}>Low</Text><Text style={styles.liveWeatherValue}>{weather ? `${Math.round(weather.minTempF)}°` : "—"}</Text></View>
        <View style={styles.liveWeatherBox}><Text style={styles.liveWeatherIcon}>☀️</Text><Text style={styles.liveWeatherLabel}>High</Text><Text style={styles.liveWeatherValue}>{weather ? `${Math.round(weather.maxTempF)}°` : "—"}</Text></View>
        <View style={styles.liveWeatherBox}><Text style={styles.liveWeatherIcon}>🌧️</Text><Text style={styles.liveWeatherLabel}>Rain</Text><Text style={styles.liveWeatherValue}>{weather ? `${Math.round(weather.precipChance)}%` : "—"}</Text></View>
      </View>
      <View style={styles.liveWeatherFooter}><Text style={styles.liveWeatherFooterText}>Zone {zone || "—"} • Frost estimate: {getEstimatedLastFrost(zone)}</Text></View>
    </View>
  );
}
function GardenerProfileCard({ theme, setAppearanceMode, avatarGlow, gardenXP, savedPlants, journalEntries, gardenMap, streakData, profileBanners, profileName, setProfileName, profilePhoto, setProfilePhoto, selectedProfileTheme, setSelectedProfileTheme }) {
  const unlockedBanners = profileBanners.filter((banner) => banner.unlocked);
  const activeBanner = unlockedBanners[unlockedBanners.length - 1] || profileBanners[0];
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  async function pickProfilePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Photos Permission Needed", "Allow photo access to choose a profile picture."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1, allowsEditing: true, aspect: [1, 1] });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    setProfilePhoto(asset.uri);
  }
  return (
    <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.accent, shadowOpacity: 0.6, shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 10 }]}>
      <View style={styles.profileBanner}>
        <Text style={styles.profileBannerEmoji}>{activeBanner?.emoji || "🌱"}</Text>
        <Text style={styles.profileBannerTitle}>{activeBanner?.title || "Seedling Starter"}</Text>
      </View>
      <Animated.View style={[styles.profileAvatarGlow, { shadowColor: "#5cff89", shadowRadius: avatarGlow.interpolate({ inputRange: [0,1], outputRange: [12,28] }), shadowOpacity: avatarGlow.interpolate({ inputRange: [0,1], outputRange: [0.5,1] }), transform: [{ scale: avatarGlow.interpolate({ inputRange: [0,1], outputRange: [1,1.05] }) }] }]}>
        <Pressable style={[styles.profileAvatarCircle, { borderColor: "#5cff89" }]} onPress={pickProfilePhoto}>
          {profilePhoto ? (<Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />) : (<Text style={styles.profileAvatarEmoji}>🧑‍🌾</Text>)}
        </Pressable>
      </Animated.View>
      <TextInput value={profileName} onChangeText={setProfileName} placeholder="Enter profile name" placeholderTextColor="#8fbf9d" style={styles.profileNameInput} />
      <View style={{ marginTop: 14 }}>
        <Text style={{ color: theme.text, fontWeight: "700" }}>XP Progress</Text>
        <View style={{ height: 10, backgroundColor: "#2a2a2a", borderRadius: 20, marginTop: 6, overflow: "hidden" }}>
          <View style={{ height: 10, width: `${gardenXP.progress * 100}%`, backgroundColor: "#5cff89" }} />
        </View>
        <Text style={{ color: theme.text, marginTop: 6, fontSize: 12 }}>{gardenXP.currentLevelXP} / {gardenXP.nextLevelXP} XP</Text>
      </View>
      {/* FIX #1: Styled theme chip selector — replaces plain text buttons */}
      <View style={{ marginTop: 18 }}>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>
          Profile Theme
        </Text>
        <View style={styles.themeChipRow}>
          {PROFILE_THEMES.map((t) => {
            const isSelected = selectedProfileTheme === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => {
  setSelectedProfileTheme(t.id);
}}
                style={[
                  styles.themeChip,
                  { backgroundColor: t.bg, borderColor: isSelected ? t.border : "rgba(255,255,255,0.10)" },
                  isSelected && styles.themeChipSelected,
                ]}
              >
                <Text style={styles.themeChipEmoji}>{t.emoji}</Text>
                <Text style={[styles.themeChipLabel, { color: isSelected ? t.color : "#d7ebdc" }]}>{t.name}</Text>
                {isSelected && <View style={[styles.themeChipDot, { backgroundColor: t.color }]} />}
              </Pressable>
            );
          })}
        </View>
      </View>
      <Text style={styles.profileRank}>Level {gardenXP.level} • {gardenXP.title}</Text>
      <Text style={styles.profileXP}>{gardenXP.xp} total XP</Text>
      <View style={styles.profileStatsGrid}>
        <View style={styles.profileStatBox}><Text style={styles.profileStatValue}>{savedPlants.length}</Text><Text style={styles.profileStatLabel}>Saved</Text></View>
        <View style={styles.profileStatBox}><Text style={styles.profileStatValue}>{journalEntries.length}</Text><Text style={styles.profileStatLabel}>Photos</Text></View>
        <View style={styles.profileStatBox}><Text style={styles.profileStatValue}>{gardenPlotCount}</Text><Text style={styles.profileStatLabel}>Plots</Text></View>
        <View style={styles.profileStatBox}><Text style={styles.profileStatValue}>{streakData?.count || 0}</Text><Text style={styles.profileStatLabel}>Streak</Text></View>
      </View>
    </View>
  );
}
function ProfileBannersCard({ theme, profileBanners }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <Text style={styles.cardEyebrow}>Unlockable banners</Text>
      <View style={styles.premiumHeroCard}>
        <View style={styles.premiumHeroGlow} />
        <Text style={styles.premiumHeroCrown}>👑</Text>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Gardener Profile Collection!</Text>
        <Text style={[styles.premiumHeroText, { color: theme.secondaryText }]}>Unlock special profile banners, premium themes, and rare gardener rewards by completing milestones.</Text>
        <View style={styles.premiumTrialPill}><Text style={styles.premiumTrialText}>COLLECTIBLE REWARDS</Text></View>
      </View>
      <View style={styles.bannerGrid}>
        {profileBanners.map((banner) => (
          <View key={banner.id} style={[styles.bannerCard, { opacity: banner.unlocked ? 1 : 0.45 }]}>
            <View style={[styles.bannerPreview, { backgroundColor: banner.gradient[0] }]}><Text style={styles.bannerEmoji}>{banner.emoji}</Text></View>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            <Text style={styles.bannerSubtitle}>{banner.unlocked ? "Unlocked ✓" : banner.subtitle}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
function DailyQuestsCard({ theme, dailyQuests }) {
  const completedCount = dailyQuests.filter((quest) => quest.completed).length;
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <Text style={styles.cardEyebrow}>Daily Quests</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Garden Goals!</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>Complete small garden tasks to build your streak and earn XP.</Text>
      <View style={styles.questSummaryPill}><Text style={styles.questSummaryText}>{completedCount}/{dailyQuests.length} completed today</Text></View>
      <View style={styles.questList}>
        {dailyQuests.map((quest) => (
          <View key={quest.id} style={[styles.questRow, quest.completed && styles.questRowCompleted]}>
            <Text style={styles.questIcon}>{quest.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.questTitle}>{quest.completed ? `${quest.title} ✓` : quest.title}</Text>
              <Text style={styles.questProgress}>{quest.progress}/{quest.goal} • +{quest.reward} XP</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
function XPCard({ theme, gardenXP }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <Text style={styles.cardEyebrow}>Garden progression</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Level {gardenXP.level} • {gardenXP.title} 🌱</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>{gardenXP.xp} total XP earned from gardening activity.</Text>
      <View style={styles.xpBarBackground}><View style={[styles.xpBarFill, { width: `${(gardenXP.progress || 0) * 100}%` }]} /></View>
      <Text style={styles.xpProgressText}>{gardenXP.currentLevelXP} / {gardenXP.nextLevelXP} XP to next level</Text>
      <View style={styles.xpStatsRow}>
        <View style={styles.xpMiniCard}><Text style={styles.xpMiniValue}>{gardenXP.level}</Text><Text style={styles.xpMiniLabel}>Level</Text></View>
        <View style={styles.xpMiniCard}><Text style={styles.xpMiniValue}>{gardenXP.xp}</Text><Text style={styles.xpMiniLabel}>XP</Text></View>
      </View>
    </View>
  );
}
function AchievementCard({ theme, badges, streakData }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <View style={styles.achievementHeaderRow}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Achievements</Text>
        <Text style={styles.achievementStreakText}>{streakData.count} day streak 🏆</Text>
      </View>
      <View style={styles.achievementCompactGrid}>
        {badges.map((badge) => (
          <View key={badge.id} style={[styles.achievementCompactCard, badge.unlocked && styles.achievementCompactCardUnlocked]}>
            <Text style={styles.achievementCompactIcon}>{badge.icon}</Text>
            <Text style={styles.achievementCompactTitle} numberOfLines={2}>{badge.title.replace(" Unlocked", "")}</Text>
            <Text style={styles.achievementCompactText} numberOfLines={2}>
  {badge.text}
</Text>

{badge.goal ? (
  <View style={styles.achievementProgressTrack}>
    <View
      style={[
        styles.achievementProgressFill,
        {
          width: `${Math.min(
            ((badge.progress || 0) / badge.goal) * 100,
            100
          )}%`,
        },
      ]}
    />
  </View>
) : null}
            {badge.unlocked && (
              <View style={styles.achievementCompactCheck}>
                <Text style={styles.achievementCompactCheckText}>✓</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
function GardenHealthCard({ theme, gardenHealth, gardenMap }) {
  const plants = Object.values(gardenMap || {}).filter(Boolean);
  const conflicts = [];
  const tips = [];
  plants.forEach((plant) => {
    plants.forEach((compare) => {
      if (plant === compare) return;
      const score = getCompatibilityScore(plant, compare);
      if (score.label === "Avoid") { const w = `⚠ Move ${plant} away from ${compare}. They should not grow too close together.`; if (!conflicts.includes(w)) conflicts.push(w); }
      if (score.label === "Excellent Pair") { const t = `🌱 ${plant} grows well near ${compare}.`; if (!tips.includes(t)) tips.push(t); }
    });
  });
  return (
    <View style={[styles.gardenHealthCard, { borderColor: gardenHealth.score >= 80 ? "#5cff89" : gardenHealth.score >= 60 ? "#ffd86b" : "#ff7b7b" }]}>
      <Text style={styles.gardenHealthLabel}>Garden Compatibility Score</Text>
      <Text style={styles.gardenHealthScore}>{gardenHealth.score}%</Text>
      <Text style={styles.gardenHealthStatus}>{gardenHealth.label}</Text>
      <View style={styles.healthMetricRow}>
        {["🌱 Companion balance","💧 Water balance","☀️ Sun match","📍 Zone fit"].map((m) => (<Text key={m} style={styles.healthMetric}>{m}</Text>))}
      </View>
      {conflicts.length ? (<View style={styles.conflictWarningBox}>{conflicts.slice(0, 3).map((w) => (<Text key={w} style={styles.conflictWarningText}>{w}</Text>))}</View>) : (<Text style={styles.noConflictText}>No major companion conflicts found.</Text>)}
      {tips.length ? (<View style={[styles.conflictWarningBox, { marginTop: 10, borderColor: "#5cff89" }]}>{tips.slice(0, 3).map((t) => (<Text key={t} style={[styles.conflictWarningText, { color: "#5cff89" }]}>{t}</Text>))}</View>) : null}
    </View>
  );
}
function SwipeablePlantGallery({ plants, theme, zone, onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
  setActiveIndex(0);
}, [plants.length]);
  if (!plants.length) return (<Text style={[styles.cardText, { color: theme.secondaryText }]}>No plants match your zone yet.</Text>);
  const plant = plants[activeIndex] || plants[0];
  const imageSource = resolvePlantImageSource(plant);
  const rarity = RARITY_STYLES[getRarity(plant)];
  return (
    <View style={styles.gallerySingleWrap}>
      <Pressable onPress={() => onOpen(plant)} style={[styles.galleryCard, { width: "100%", backgroundColor: "rgba(16,41,23,0.94)", borderColor: "#5cff89" }]}>
        <View style={styles.galleryGlow} />
       {imageSource ? (
  <View style={styles.galleryImageDarkWrap}>
    <Image source={imageSource} style={styles.galleryImage} resizeMode="contain" />
  </View>
) : (<Text style={styles.galleryFallbackSmall}>🌱</Text>)}
        <View style={styles.galleryTextBox}>
          <Text style={[styles.galleryName, { color: "#ffffff" }]}>{plant.name}</Text>
          <Text style={[styles.galleryMeta, { color: theme.secondaryText }]}>{normalizeType(plant.type, plant.name)} • {getPlantSeasonLabel(plant, zone)}</Text>
          <View style={[styles.rarityBadge, { backgroundColor: "rgba(92,255,137,0.12)" }]}><Text style={[styles.rarityBadgeText, { color: "#8effab" }]}>{rarity.emoji} {rarity.label}</Text></View>
        </View>
      </Pressable>
      <View style={styles.galleryButtonRow}>
        <Pressable onPress={() => setActiveIndex((c) => c === 0 ? plants.length - 1 : c - 1)} style={styles.galleryNavButton}><Text style={styles.galleryNavButtonText}>‹ Previous</Text></Pressable>
        <Text style={styles.galleryCounterText}>{activeIndex + 1} / {plants.length}</Text>
        <Pressable onPress={() => setActiveIndex((c) => c === plants.length - 1 ? 0 : c + 1)} style={styles.galleryNavButton}><Text style={styles.galleryNavButtonText}>Next ›</Text></Pressable>
      </View>
    </View>
  );
}
function applyGardenTemplate({ template, savedPlants, onAssign }) {
  const plantNames = savedPlants.filter(Boolean).map((plant) => typeof plant === "string" ? plant : plant?.name).filter(Boolean);
  if (!plantNames.length) { Alert.alert("Save plants first", "Save a few plants before applying a garden template."); return; }
  const templateSlots = { backyard: ["slot-1","slot-2","slot-3","slot-4","slot-5","slot-6"], balcony: ["slot-1","slot-2","slot-3","slot-4"], raised: ["slot-1","slot-2","slot-4","slot-5","slot-7","slot-8"], herbs: ["slot-1","slot-2","slot-3","slot-4","slot-5","slot-6"] };
  const slots = templateSlots[template] || templateSlots.backyard;
  slots.forEach((slotId, index) => { onAssign(slotId, plantNames[index % plantNames.length]); });
  Alert.alert("Template Applied 🌱", "Your garden layout has been filled with saved plants.");
}
function GardenPlannerMap({ theme, gardenMap, savedPlants, wateredPlants, onAssign, onClear }) {
  function getPlantName(plant) { return typeof plant === "string" ? plant : plant?.name || ""; }
  function choosePlantForSlot(slotId) {
    const validPlants = savedPlants.filter(Boolean).map((p) => getPlantName(p)).filter(Boolean);
    if (!validPlants.length) { Alert.alert("Save plants first", "Open a plant card and tap Save, then you can place it in your garden map."); return; }
    Alert.alert("Choose a plant", "Pick one for this plot.", [...validPlants.slice(0, 8).map((n) => ({ text: n, onPress: () => onAssign(slotId, n) })), { text: "Clear plot", style: "destructive", onPress: () => onClear(slotId) }, { text: "Cancel", style: "cancel" }]);
  }
  const allPlants = Object.values(gardenMap || {}).map((p) => getPlantName(p)).filter(Boolean);
  return (
    <View style={styles.gardenGrid}>
      {GARDEN_SLOTS.map((slot) => {
        const rawPlantName = gardenMap[slot.id];
        const plantName = getPlantName(rawPlantName);
        const plant = produceData.find((item) => item?.name === plantName);
        const imageSource = plant && plant.name ? resolvePlantImageSource(plant) : null;
        const hasConflict = plantName && allPlants.some((compare) => compare !== plantName && getCompatibilityScore(plantName, compare).label === "Avoid");
        const hasExcellent = plantName && allPlants.some((compare) => compare !== plantName && getCompatibilityScore(plantName, compare).label === "Excellent Pair");
        const slotHealthStyle = hasConflict ? styles.gardenSlotConflict : hasExcellent ? styles.gardenSlotExcellent : null;
        const needsWater = plantName && !wateredPlants?.[plantName];
        return (
          <Pressable key={slot.id} onPress={() => choosePlantForSlot(slot.id)} style={[styles.gardenSlot, slotHealthStyle, { backgroundColor: plantName ? "rgba(92,255,137,0.12)" : theme.input, borderColor: hasConflict ? "#ff7b7b" : hasExcellent ? "#5cff89" : theme.border }]}>
            {imageSource ? (
  <View style={styles.gardenSlotImageWrap}>
    <Image source={imageSource} style={styles.gardenSlotImage} resizeMode="contain" />
  </View>
) : (<Text style={styles.gardenSlotIcon}>{plantName ? "🌿" : "＋"}</Text>)}
            <Text numberOfLines={1} style={[styles.gardenSlotLabel, { color: theme.text }]}>{plantName || slot.label}</Text>
            {needsWater ? (<View style={styles.gardenWaterBadge}><Text style={styles.gardenWaterBadgeText}>💧 Needs Water</Text></View>) : null}
            {hasConflict ? (<Text style={styles.gardenSlotWarning}>⚠</Text>) : hasExcellent ? (<Text style={styles.gardenSlotGood}>✓</Text>) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
function GardenHealthHomeCard({ theme, gardenHealth, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>🌱 Garden Health</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 6 }]}>{gardenHealth.score}% • {gardenHealth.label}</Text>
      <View style={{ marginTop: 10, alignSelf: "flex-start", backgroundColor: "#5cff89", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 }}>
        <Text style={{ color: "#07120b", fontWeight: "800" }}>Open Garden →</Text>
      </View>
    </Pressable>
  );
}
function SmartReminderHomeCard({ theme, remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn, onPress }) {
  const enabledCount = [remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn].filter(Boolean).length;
  return (
    <Pressable onPress={onPress} style={[styles.smartReminderHomeCard, { backgroundColor: theme.card, borderColor: enabledCount === 4 ? "#5cff89" : "#ffd86b" }]}>
      <Text style={styles.smartReminderHomeIcon}>{enabledCount === 4 ? "✅" : "🔔"}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.smartReminderHomeTitle, { color: theme.text }]}>Smart Reminders</Text>
        <Text style={[styles.smartReminderHomeText, { color: theme.secondaryText }]}>{enabledCount}/4 reminders enabled</Text>
        <Text style={styles.smartReminderHomeBadgeText}>{enabledCount === 4 ? "All garden reminders are active" : "Tap to finish setting up reminders"}</Text>
      </View>
      <Text style={styles.smartReminderHomeArrow}>›</Text>
    </Pressable>
  );
}
function ReminderControlCard({ theme, remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn, onToggleReminders, onToggleFrost, onToggleMonthlyPlanting, onToggleDailyWatering }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Smart Reminders!</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>Turn on watering reminders, monthly planting guides, and frost alerts.</Text>
      {[{ label: "Watering Reminders!", text: "Add daily reminders from plant pages.", value: remindersOn, onToggle: onToggleReminders }, { label: "Frost Alerts!", text: "Evening reminder to check overnight lows.", value: frostAlertsOn, onToggle: onToggleFrost }, { label: "Monthly Planting Guides!", text: "Reminder on the 1st of every month.", value: monthlyPlantingOn, onToggle: onToggleMonthlyPlanting }, { label: "Daily Watering Check!", text: "Morning reminder to check your garden.", value: dailyWateringOn, onToggle: onToggleDailyWatering }].map((row) => (
        <View key={row.label} style={styles.settingRow}>
          <View style={{ flex: 1, minWidth: 0 }}><Text style={[styles.settingTitle, { color: theme.text }]}>{row.label}</Text><Text style={[styles.settingText, { color: theme.secondaryText }]}>{row.text}</Text></View>
          <Switch value={row.value} onValueChange={row.onToggle} trackColor={{ false: "#314c39", true: "#5cff89" }} thumbColor="#ffffff" />
        </View>
      ))}
    </View>
  );
}
function GlowPlantCard({ plant, weather, zone, theme, isSaved, isCompared, isFollowed, wateredDate, onOpen, onSave, onCompare, onFollow, onWater }) {
  const imageSource = resolvePlantImageSource(plant);
  const rarity = RARITY_STYLES[getRarity(plant)];
  const wateredToday = wateredDate === getTodayKey();
  return (
    <Pressable onPress={onOpen} style={[styles.glowPlantCard, { backgroundColor: theme.card, borderColor: "rgba(92,255,137,0.18)" }]}>
      <View style={[styles.cardGlowOrb, { backgroundColor: "#5cff89" }]} />
     <View style={styles.glowPlantImageWrap}>
  {imageSource ? (
    <View style={styles.glowPlantImageDarkWrap}>
      <Image source={imageSource} style={styles.glowPlantImage} resizeMode="contain" />
    </View>
  ) : (<Text style={styles.galleryFallback}>🌱</Text>)}
</View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.cardHeaderRow}>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72} style={[styles.glowPlantName, { color: theme.text }]}>{plant.name}</Text>
          <View style={[styles.rarityBadge, { backgroundColor: "rgba(92,255,137,0.12)" }]}><Text style={[styles.rarityBadgeText, { color: "#8effab" }]}>{rarity.emoji}</Text></View>
        </View>
        <Text style={[styles.glowPlantMeta, { color: theme.secondaryText }]}>{normalizeType(plant.type, plant.name)} • Zones {plant.minZone}–{plant.maxZone}</Text>
        {(() => { const seasonal = getSeasonalIntelligenceLabel(plant, zone, weather); return (<View style={styles.seasonalIntelBox}><Text style={styles.seasonalIntelLabel}>{seasonal.icon} {seasonal.label}</Text><Text style={styles.seasonalIntelText}>{seasonal.text}</Text></View>); })()}
        <View style={styles.notesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Best Planting Months</Text>
          <Text style={[styles.notesBody, { color: theme.text }]}>{Array.isArray(plant.plantMonths) && plant.plantMonths.length ? plant.plantMonths.map((month) => MONTH_LABELS[month - 1]).join(", ") : "Year-round planting information coming soon."}</Text>
          <Text style={[styles.sectionTitle, { marginTop: 24, color: theme.text }]}>Plant Notes</Text>
          <Text style={[styles.notesBody, { color: theme.text }]}>{plant.notes || "A powerful addition to your garden with the right care and seasonal timing."}</Text>
        </View>
        <View style={styles.smallActionRow}>
          <Pressable onPress={(e) => { e.stopPropagation?.(); onSave(); }} style={[styles.tinyButton, isSaved && styles.tinyButtonActive]}><Text style={[styles.tinyButtonText, isSaved && styles.tinyButtonTextActive]}>{isSaved ? "Saved" : "Save"}</Text></Pressable>
          <Pressable onPress={(e) => { e.stopPropagation?.(); onCompare(); }} style={[styles.tinyButton, isCompared && styles.tinyButtonActive]}><Text style={[styles.tinyButtonText, isCompared && styles.tinyButtonTextActive]}>{isCompared ? "Comparing" : "Compare"}</Text></Pressable>
          <Pressable onPress={(e) => { e.stopPropagation?.(); onWater(); }} style={[styles.tinyButton, wateredToday && styles.tinyButtonWater]}><Text style={[styles.tinyButtonText, wateredToday && styles.tinyButtonTextActive]}>{wateredToday ? "Watered" : "Water"}</Text></Pressable>
        </View>
      </View>
    </Pressable>
  );
}
function WeatherTeaserCard({ theme, weather, zone, onUnlock }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Garden Weather</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>Current conditions for Zone {zone}</Text>
      <View style={styles.weatherTeaserCard}>
        <Text style={styles.weatherTeaserTemp}>{weather?.maxTempF || "--"}°F</Text>
        <Text style={styles.weatherTeaserCondition}>🌤️ Current garden conditions available</Text>
        <Text style={styles.weatherTeaserText}>Premium unlocks frost alerts, heat stress warnings, watering guidance, and advanced weather intelligence.</Text>
        <Pressable onPress={onUnlock} style={styles.weatherTeaserButton}><Text style={styles.weatherTeaserButtonText}>Unlock Premium</Text></Pressable>
      </View>
    </View>
  );
}
function getPlantHealthStatus({ plantName, wateredPlants, weather }) {
  const wateredToday = wateredPlants?.[plantName] === getTodayKey();
  if (weather?.minTempF <= 35) return { label: "Frost Risk", icon: "❄️", color: "#6bc7ff" };
  if (weather?.maxTempF >= 95 && !wateredToday) return { label: "Heat Stressed", icon: "🔥", color: "#ff7a7a" };
  if (!wateredToday) return { label: "Needs Water", icon: "💧", color: "#ffd86b" };
  return { label: "Healthy", icon: "🌿", color: "#5cff89" };
}
function SavedPlantsCard({
  theme,
  savedPlants,
  plantFolders,
  premiumUnlocked,
  onOpenPlant,
  onUpgrade,
  harvestTrackers,
  wateredPlants,
  weather,
}) {
  const savedItems = produceData.filter((item) =>
    savedPlants.includes(item.name)
  );

  if (!savedItems.length) {
    return null;
  }

  return (
    <View
      style={[
        styles.compactSavedPlantsCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.compactSavedPlantsTitle,
              { color: theme.text },
            ]}
          >
            Saved Plants ({savedPlants.length})
          </Text>

          <Text
            style={[
              styles.compactSavedPlantsSubtext,
              { color: theme.secondaryText },
            ]}
          >
            Quick access to your garden favorites.
          </Text>
        </View>

        {!premiumUnlocked && savedPlants.length >= 5 ? (
          <Pressable
            onPress={onUpgrade}
            style={styles.compactUpgradeButton}
          >
            <Text style={styles.compactUpgradeButtonText}>
              Upgrade
            </Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.compactSavedPlantsScroll}
      >
        {savedItems.map((item) => {
          const imageSource = resolvePlantImageSource(item);
          const health = getPlantHealthStatus({
            plantName: item.name,
            wateredPlants,
            weather,
          });

          return (
            <Pressable
              key={`compact-saved-${item.name}`}
              onPress={() => onOpenPlant(item)}
              style={styles.compactSavedPlantPill}
            >
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={styles.compactSavedPlantImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.compactSavedPlantEmoji}>
                  🌱
                </Text>
              )}

              <Text
                numberOfLines={1}
                style={styles.compactSavedPlantName}
              >
                {item.name}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.compactSavedPlantHealth,
                  { color: health.color },
                ]}
              >
                {health.icon} {health.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
function JournalCard({ theme, journalEntries, onAddGeneralPhoto, onDeleteEntry }) {
  const journalAchievements = [
    { icon: "🌱", title: "First Sprout", unlocked: journalEntries.length >= 1 },
    { icon: "📸", title: "Photo Keeper", unlocked: journalEntries.length >= 3 },
    { icon: "📖", title: "Garden Story", unlocked: journalEntries.length >= 5 },
    { icon: "🍅", title: "Harvest Hero", unlocked: journalEntries.some((entry) => String(entry.growthStage || "").includes("Harvest")) },
  ];
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Garden Journal!</Text>
          <Text style={[styles.cardText, { color: theme.secondaryText }]}>Upload plant progress photos and keep a visual garden timeline.</Text>
        </View>
        <Pressable style={styles.journalAddButton} onPress={onAddGeneralPhoto}><Text style={styles.journalAddButtonText}>＋</Text></Pressable>
      </View>
      <View style={styles.journalHeroCard}>
        <View style={styles.journalHeroImageWrap}><Text style={styles.journalHeroCamera}>📸</Text><Text style={styles.journalHeroSparkle}>✨</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.journalHeroTitle}>Start Your Garden Timeline!</Text>
          <Text style={styles.journalHeroText}>Add photos as your plants grow and watch your garden story come to life.</Text>
        </View>
        <Pressable style={styles.journalHeroButton} onPress={onAddGeneralPhoto}><Text style={styles.journalHeroButtonText}>+ Add first photo</Text></Pressable>
      </View>
      <View style={styles.journalAchievementRow}>
        {journalAchievements.map((a) => (
          <View key={a.title} style={[styles.journalAchievementBadge, { opacity: a.unlocked ? 1 : 0.35 }]}>
            <Text style={styles.journalAchievementIcon}>{a.icon}</Text>
            <Text numberOfLines={1} style={styles.journalAchievementText}>{a.title}</Text>
          </View>
        ))}
      </View>
      {journalEntries.length ? (
        <View style={styles.journalTimeline}>
          {journalEntries.map((entry) => (
            <View key={entry.id} style={styles.timelineEntryWrap}>
              <View style={styles.timelineLine} />
              <View style={styles.timelineDot} />
              <View style={[styles.journalTimelineCard, { backgroundColor: theme.input, borderColor: theme.border }]}>
                {entry.imageUri ? (<Image source={{ uri: entry.imageUri }} style={styles.journalTimelineImage} />) : (<View style={styles.journalTimelinePlaceholder}><Text style={styles.journalTimelinePlaceholderEmoji}>🌱</Text></View>)}
                <Pressable onPress={() => onDeleteEntry(entry.id)} style={styles.timelineDeleteButton}><Text style={styles.timelineDeleteButtonText}>Delete</Text></Pressable>
                <View style={styles.journalTimelineContent}>
                  <View style={styles.journalTimelineHeader}>
                    <Text numberOfLines={1} style={[styles.journalTimelineTitle, { color: theme.text }]}>{entry.plantName || "Garden Update"}</Text>
                    <Text style={[styles.journalTimelineDate, { color: theme.secondaryText }]}>{new Date(entry.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <Text style={[styles.journalTimelineBody, { color: theme.secondaryText }]}>{entry.caption || "Your garden is growing beautifully."}</Text>
                  <View style={styles.journalMoodRow}><Text style={styles.journalMoodBadge}>{entry.mood || "🌱 Growing"}</Text></View>
                  <View style={styles.growthTrackingRow}>
                    <Text style={styles.growthTrackingBadge}>⏳ Day {entry.daysSincePlanting || 1}</Text>
                    <Text style={styles.growthTrackingBadge}>🌿 {entry.growthStage || "Seedling"}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.cardText, { color: theme.secondaryText }]}>No journal photos yet. Open a plant page and tap "Add photo."</Text>
      )}
    </View>
  );
}
// FIX #5: SettingsCard changes:
// 1. "Purchases Coming Soon" Pressable → non-interactive View so App Store
//    reviewers don't see a tappable button that does nothing.
// 2. The direct unlock button (setPremiumUnlocked(true) without payment) is
//    now wrapped in __DEV__ so it only appears during development — it won't
//    show up in a production App Store build.
function SettingsCard({ theme, premiumUnlocked, setPremiumUnlocked, subscriptionPlan, setSubscriptionPlan, onUnlockPremium }) {
  async function choosePlan(plan) {
    setSubscriptionPlan(plan);
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings?.current?.availablePackages?.length) {
        Alert.alert("RevenueCat ready", "Connect your App Store products in RevenueCat to enable real checkout.");
      } else {
        Alert.alert("Plan selected", `${plan} selected. Finish RevenueCat setup when you are ready.`);
      }
    } catch {
      Alert.alert("Plan selected", `${plan} selected. RevenueCat can be connected later.`);
    }
  }
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Settings & Premium!</Text>
      <View style={styles.premiumFeatureList}>
        {["✓ Smart Frost, Heat, and Weather Alerts!","✓ Advanced Watering Guidance!","✓ Companion planting intelligence","✓ Plants to Avoid Nearby!","✓ Garden Compatibility Scoring!","✓ Unlimited Saved Plants!","✓ Interactive Garden Planner Map!","✓ Garden Journal & Photo Timeline!","✓ Daily Gardening Quests!","✓ XP Progression & Level-ups!","✓ Achievement Badges & Streak Tracking!","✓ Personalized Seasonal Recommendations!","✓ Future Premium Gardening Tools & Updates!"].map((f) => (<Text key={f} style={styles.premiumFeatureBullet}>{f}</Text>))}
      </View>
      <View style={styles.planRow}>
        {[{ plan: "Monthly", badge: "MOST POPULAR", badgeBg: "#5cff89", badgeColor: "#07120b", price: "$2.99", sub: "per month" }, { plan: "Yearly", badge: "BEST VALUE", badgeBg: "#ffd86b", badgeColor: "#3d2c00", price: "$19.99", sub: "Best Value!" }].map(({ plan, badge, badgeBg, badgeColor, price, sub }) => (
          <Pressable key={plan} style={[styles.planCard, subscriptionPlan === plan && styles.planCardActive, { backgroundColor: theme.card, borderColor: subscriptionPlan === plan ? theme.glow : theme.border }]} onPress={() => choosePlan(plan)}>
            <View style={[styles.planBadge, { backgroundColor: badgeBg }]}><Text style={[styles.planBadgeText, { color: badgeColor }]}>{badge}</Text></View>
            <Text style={[styles.planTitle, { color: theme.text }]}>{plan}</Text>
            <Text style={[styles.planPrice, { color: theme.glow }]}>{price}</Text>
            <Text style={[styles.planSubtext, { color: theme.secondaryText }]}>{sub}</Text>
          </Pressable>
        ))}
      </View>
      {/* FIX #5: Changed from Pressable to View — a tappable button that does
          nothing looks unfinished to App Store reviewers. */}
      <View style={styles.comingSoonButton}>
        <Text style={styles.comingSoonButtonText}>In-App Purchases Coming Soon</Text>
      </View>
      {/* FIX #5: Direct unlock hidden behind __DEV__ so it never appears in a
          production App Store build. Remove this block entirely before your
          first real submission. */}
      {__DEV__ ? (
        <Pressable style={[styles.unlockButton, premiumUnlocked && styles.unlockButtonActive]} onPress={() => setPremiumUnlocked(true)}>
          <View style={styles.unlockButtonGlow} />
          <Text style={styles.unlockButtonIcon}>👑</Text>
          <Text style={styles.unlockButtonText}>{premiumUnlocked ? "Premium Enabled (Dev)" : "Enable Premium Preview (Dev Only)"}</Text>
          <Text style={styles.unlockButtonSubtext}>Development only — remove before App Store submission</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
function OnboardingCard({ onFinish }) {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      emoji: "🌱",
      title: "Welcome to Pocket Planter",
      text: "Grow smarter with planting picks, weather alerts, reminders, and garden tools built around your area.",
      features: [
        "📍 Find your garden zone",
        "🌿 Discover what to plant",
        "💚 Save your favorites",
      ],
    },
    {
      emoji: "🗺️",
      title: "Find Your Garden Zone",
      text: "Enter your ZIP code so Pocket Planter can match plants to your local growing zone.",
      features: [
        "📅 Monthly planting picks",
        "🌤️ Weather-aware tips",
        "🔥 Frost and heat warnings",
      ],
    },
    {
      emoji: "📸",
      title: "Track Your Garden",
      text: "Save plants, log photos, track watering, and build your garden planner map.",
      features: [
        "💧 Watering checks",
        "📸 Journal timeline",
        "🗺️ Garden planner",
      ],
    },
    {
      emoji: "🏆",
      title: "Earn XP and Grow",
      text: "Complete garden actions, build streaks, unlock achievements, and level up your gardener profile.",
      features: [
        "🔥 Daily streaks",
        "🏆 Achievements",
        "✨ Profile rewards",
      ],
    },
  ];

  const current = slides[slide];
  const isLast = slide === slides.length - 1;

  return (
    <View style={styles.onboardingOverlay}>
      <View style={styles.onboardingCard}>
        <Text style={styles.onboardingEmoji}>{current.emoji}</Text>

        <Text style={styles.onboardingTitle}>{current.title}</Text>

        <Text style={styles.onboardingText}>{current.text}</Text>

        <View style={styles.onboardingFeatureList}>
          {current.features.map((feature) => (
            <Text key={feature} style={styles.onboardingFeature}>
              {feature}
            </Text>
          ))}
        </View>

        <View style={styles.onboardingDots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.onboardingDot,
                index === slide && styles.onboardingDotActive,
              ]}
            />
          ))}
        </View>

        <Pressable
          style={styles.onboardingButton}
          onPress={() => {
            if (isLast) {
              onFinish();
              return;
            }

            setSlide((currentSlide) => currentSlide + 1);
          }}
        >
          <Text style={styles.onboardingButtonText}>
            {isLast ? "Start Growing 🌿" : "Next →"}
          </Text>
        </Pressable>

        {!isLast ? (
          <Pressable onPress={onFinish} style={styles.onboardingSkipButton}>
            <Text style={styles.onboardingSkipText}>Skip for now</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
function PremiumIntroCard({ onClose, onUnlock }) {
  return (
    <View style={styles.premiumGlassCard}>
      <View style={styles.premiumGlowOrb} />
      <View style={styles.premiumGlowOrbTwo} />
      <View style={styles.premiumTopRow}>
        <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>👑 Pocket Planter Premium</Text></View>
        <View style={styles.premiumRibbon}><Text style={styles.premiumRibbonIcon}>👑</Text><Text style={styles.premiumRibbonText}>PREMIUM</Text></View>
      </View>
      <Text style={styles.premiumHeadline}>Turn your backyard into a <Text style={styles.premiumHeadlineGreen}>thriving garden.</Text></Text>
      <Text style={styles.premiumSubheadline}>Unlock companion planting intelligence, smart weather alerts, garden compatibility scoring, reminders, journal photos, and a beautiful garden map.</Text>
      <View style={styles.premiumFeatureGridNew}>
        <Text style={styles.premiumFeatureNew}>🟢 Pair scores</Text>
        <Text style={styles.premiumFeatureNew}>⚠ Avoid warnings</Text>
        <Text style={styles.premiumFeatureNew}>🐛 Pest tips</Text>
        <Text style={styles.premiumFeatureNew}>🗺️ Garden score</Text>
      </View>
      <View style={styles.premiumActionRowNew}>
        <Pressable style={styles.premiumCtaButton} onPress={onUnlock}><Text style={styles.premiumCtaText}>Start Growing Smarter 🌱</Text></Pressable>
        <Pressable style={styles.premiumLaterButton} onPress={onClose}><Text style={styles.premiumLaterText}>Maybe later</Text></Pressable>
      </View>
      <Text style={styles.premiumPriceText}>🛡️ 7-day free trial • Only $2.99/month • Cancel anytime</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 150 },
  bgBlobOne: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "#5cff89", opacity: 0.14, top: -80, right: -80 },
  bgBlobTwo: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "#8effab", opacity: 0.1, top: 260, left: -90 },
  bgBlobThree: { position: "absolute", width: 280, height: 280, borderRadius: 140, backgroundColor: "#2fbf5f", opacity: 0.12, bottom: 80, right: -120 },
  bgBlobDark: { backgroundColor: "#5cff89", opacity: 0.12 },
  loadingWrapper: { flex: 1, backgroundColor: "#07120b", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  fullScreenLoadingImage: { width: "100%", height: "100%" },
  hero: { backgroundColor: "rgba(16,41,23,0.96)", borderRadius: 38, padding: 26, marginBottom: 18, overflow: "hidden", borderWidth: 1, borderColor: "rgba(92,255,137,0.28)", shadowColor: "#5cff89", shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 8 } },
  heroBadge: { alignSelf: "flex-start", backgroundColor: "rgba(92,255,137,0.14)", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, marginBottom: 16, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" },
  heroBadgeText: { color: "#ffffff", fontWeight: "900", fontSize: 12 },
  heroTitle: { color: "#ffffff", fontSize: 44, fontWeight: "900", letterSpacing: -1.3 },
  heroSubtitle: { marginTop: 12, color: "#d8efd9", fontSize: 16, lineHeight: 25, fontWeight: "700" },
  heroFeatureRow: { flexDirection: "row", gap: 10, marginTop: 22 },
  heroFeaturePill: { flex: 1, borderRadius: 18, paddingVertical: 13, alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.09)" },
  heroFeatureIcon: { fontSize: 22 },
  heroFeatureText: { marginTop: 5, color: "#ffffff", fontSize: 11, fontWeight: "900" },
  heroRecommendedCard: { marginTop: 22, borderRadius: 26, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(92,255,137,0.12)", borderWidth: 1, borderColor: "rgba(92,255,137,0.28)" },
  heroRecommendedEyebrow: { color: "#8effab", fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.7 },
  heroRecommendedTitle: { color: "#ffffff", marginTop: 5, fontSize: 24, fontWeight: "900" },
  heroRecommendedText: { color: "#dcefe0", marginTop: 5, fontSize: 13, fontWeight: "700" },
  heroRecommendedButton: { backgroundColor: "#5cff89", borderRadius: 18, paddingHorizontal: 18, paddingVertical: 13 },
  heroRecommendedButtonText: { color: "#07120b", fontWeight: "900" },
  card: { borderRadius: 30, padding: 20, marginBottom: 18, borderWidth: 1, shadowColor: "#5cff89", shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  cardHeaderRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  cardEyebrow: { fontSize: 12, fontWeight: "900", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5, color: "#8effab" },
  cardTitle: { fontSize: 24, fontWeight: "900", letterSpacing: -0.4, color: "#ffffff" },
  cardText: { marginTop: 8, fontSize: 15, lineHeight: 23, color: "#d7ebdc" },
  input: { marginTop: 16, borderRadius: 18, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 15, fontSize: 15, fontWeight: "700" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  primaryButton: { flex: 1, backgroundColor: "#5cff89", borderRadius: 18, paddingVertical: 15, alignItems: "center", shadowColor: "#5cff89", shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
  primaryButtonText: { color: "#07120b", fontWeight: "900" },
  secondaryButton: { flex: 1, borderRadius: 18, paddingVertical: 15, alignItems: "center", borderWidth: 1, backgroundColor: "rgba(255,255,255,0.06)" },
  secondaryButtonText: { fontWeight: "900" },
  zoneBanner: { marginTop: 18, backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 24, padding: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" },
  zoneMini: { color: "#8effab", fontWeight: "900", fontSize: 12 },
  zoneBig: { color: "#ffffff", fontSize: 34, fontWeight: "900", marginTop: 4 },
  zoneDetails: { marginTop: 8, color: "#d5ead8", lineHeight: 21 },
  zoneJumpButton: { marginTop: 16, backgroundColor: "#5cff89", borderRadius: 18, paddingVertical: 14, alignItems: "center" },
  zoneJumpButtonText: { color: "#07120b", fontWeight: "900" },
  smallJumpButton: { backgroundColor: "#5cff89", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, alignSelf: "flex-start" },
  smallJumpButtonText: { color: "#07120b", fontWeight: "900", fontSize: 12 },
  errorText: { color: "#ff7b7b", marginTop: 14, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  miniStat: { flex: 1, borderRadius: 22, paddingVertical: 15, paddingHorizontal: 8, alignItems: "center", borderWidth: 1 },
  miniStatIcon: { fontSize: 20, marginBottom: 5 },
  miniStatValue: { fontSize: 22, fontWeight: "900" },
  miniStatLabel: { marginTop: 3, fontSize: 11, fontWeight: "800", textAlign: "center" },
  cleanPlantList: { marginTop: 18, gap: 12 },
  cleanPlantRow: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 22, padding: 14, borderWidth: 1, borderColor: "rgba(142,255,171,0.16)" },
  cleanPlantImageWrap: { width: 54, height: 54, borderRadius: 18, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center" },
  cleanPlantImage: { width: 44, height: 44, resizeMode: "contain" },
  cleanPlantEmoji: { fontSize: 28 },
  cleanPlantName: { color: "#ffffff", fontSize: 17, fontWeight: "900" },
  cleanPlantMeta: { color: "#d7ebdc", fontSize: 12, fontWeight: "700", marginTop: 4 },
  cleanPlantArrow: { color: "#8effab", fontSize: 34, fontWeight: "900" },
  rarityBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7, alignSelf: "flex-start" },
  rarityBadgeText: { fontSize: 12, fontWeight: "900" },
  gardenHealthCard: { backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 26, padding: 18, marginTop: 18, marginBottom: 4, borderWidth: 1 },
  gardenHealthLabel: { color: "#d7ebdc", fontSize: 13, fontWeight: "900" },
  gardenHealthScore: { color: "#ffffff", fontSize: 42, fontWeight: "900", marginTop: 6 },
  gardenHealthStatus: { color: "#8effab", fontSize: 14, fontWeight: "900", marginTop: 2 },
  healthMetricRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  healthMetric: { color: "#d7ebdc", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7, fontSize: 12, fontWeight: "800", overflow: "hidden" },
  conflictWarningBox: { marginTop: 14, backgroundColor: "rgba(255,123,123,0.12)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(255,123,123,0.22)" },
  conflictWarningText: { color: "#ffd5d5", fontSize: 13, fontWeight: "700", lineHeight: 20, marginBottom: 6 },
  noConflictText: { color: "#bfe8ca", marginTop: 12, fontWeight: "800" },
  galleryCard: { width: 300, marginRight: 14, borderRadius: 28, overflow: "hidden", borderWidth: 1, minHeight: 340 },
  galleryGlow: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "#5cff89", opacity: 0.18, top: -70, right: -70 },
  galleryImage: { width: "100%", height: 190, resizeMode: "contain" },
  galleryTextBox: { paddingHorizontal: 18, paddingBottom: 22, paddingTop: 6 },
  galleryName: { fontSize: 26, fontWeight: "900" },
  galleryMeta: { marginTop: 7, fontSize: 13, fontWeight: "700" },
  galleryFallback: { fontSize: 52 },
  galleryFallbackSmall: { fontSize: 70, textAlign: "center", marginTop: 48 },
  liveWeatherCard: { borderRadius: 30, padding: 22, marginBottom: 18, borderWidth: 1, backgroundColor: "rgba(16,41,23,0.96)", shadowColor: "#5cff89", shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  liveWeatherEyebrow: { color: "#8effab", fontSize: 12, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.6 },
  liveWeatherTitle: { marginTop: 8, color: "#ffffff", fontSize: 28, fontWeight: "900", lineHeight: 34 },
  liveWeatherBody: { marginTop: 10, color: "#d7ebdc", fontSize: 15, lineHeight: 23, fontWeight: "700" },
  liveWeatherGrid: { flexDirection: "row", gap: 12, marginTop: 22 },
  liveWeatherBox: { flex: 1, borderRadius: 20, paddingVertical: 18, alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  liveWeatherIcon: { fontSize: 24 },
  liveWeatherLabel: { marginTop: 8, color: "#d7ebdc", fontSize: 12, fontWeight: "800" },
  liveWeatherValue: { marginTop: 5, color: "#ffffff", fontSize: 26, fontWeight: "900" },
  liveWeatherFooter: { marginTop: 18, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)", paddingTop: 14 },
  liveWeatherFooterText: { color: "#bfe8ca", fontSize: 13, fontWeight: "700" },
  achievementHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  achievementStreakText: { color: "#8effab", fontWeight: "900", fontSize: 13 },
  achievementGridNew: { gap: 14 },
  achievementBlock: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 24, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  achievementBlockUnlocked: { borderColor: "rgba(92,255,137,0.32)", backgroundColor: "rgba(92,255,137,0.10)" },
  achievementIconCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: "rgba(92,255,137,0.14)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  achievementBigIcon: { fontSize: 28 },
  achievementBlockTitle: { color: "#ffffff", fontSize: 18, fontWeight: "900" },
  achievementBlockText: { color: "#d7ebdc", marginTop: 6, lineHeight: 21, fontSize: 13, fontWeight: "700" },
  achievementArrow: { position: "absolute", right: 18, top: 18 },
  achievementArrowText: { color: "#8effab", fontSize: 26, fontWeight: "900" },
  weatherPremiumBlock: { marginBottom: 18, borderRadius: 28, padding: 20, borderWidth: 1, flexDirection: "column", alignItems: "stretch", gap: 16 },
  weatherLockCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: "rgba(92,255,137,0.14)", alignItems: "center", justifyContent: "center" },
  weatherLockIcon: { fontSize: 28 },
  weatherPremiumTitle: { color: "#ffffff", fontSize: 18, fontWeight: "900" },
  weatherPremiumText: { marginTop: 6, color: "#d7ebdc", lineHeight: 21, fontSize: 13, fontWeight: "700" },
  weatherUnlockButton: { backgroundColor: "#5cff89", marginTop: 14, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, alignItems: "center" },
  weatherUnlockText: { color: "#07120b", fontWeight: "900", fontSize: 12 },
  gardenGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 18 },
  gardenSlot: { width: "30%", minHeight: 110, borderRadius: 22, alignItems: "center", justifyContent: "center", padding: 10, borderWidth: 1, position: "relative" },
  gardenSlotImage: { width: 44, height: 44, resizeMode: "contain" },
  gardenSlotIcon: { fontSize: 26, marginBottom: 6 },
  gardenSlotLabel: { fontSize: 12, fontWeight: "800", textAlign: "center" },
  gardenSlotWarning: { position: "absolute", top: 8, right: 8, fontSize: 15 },
  gardenSlotGood: { position: "absolute", top: 8, right: 8, fontSize: 15, color: "#5cff89", fontWeight: "900" },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 18 },
  settingTitle: { fontSize: 15, fontWeight: "900" },
  settingText: { marginTop: 4, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  filterScroll: { gap: 10, paddingTop: 16, paddingBottom: 6 },
  plantList: { marginTop: 18, gap: 14 },
  glowPlantCard: { borderRadius: 24, padding: 14, flexDirection: "row", gap: 12, overflow: "hidden", borderWidth: 1 },
  cardGlowOrb: { position: "absolute", width: 180, height: 180, borderRadius: 90, opacity: 0.12, top: -70, right: -70 },
  glowPlantImageWrap: { width: 130, alignItems: "center", justifyContent: "flex-start", paddingTop: 8 },
  glowPlantImage: { width: 110, height: 110, resizeMode: "contain" },
  glowPlantName: { fontSize: 21, fontWeight: "900", flexShrink: 1, paddingRight: 6 },
  glowPlantMeta: { marginTop: 6, fontSize: 13, fontWeight: "700" },
  notesSection: { marginTop: 16 },
  sectionTitle: { fontSize: 12, fontWeight: "900", marginBottom: 8 },
  notesBody: { fontSize: 12, lineHeight: 17, fontWeight: "600" },
  smallActionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 },
  tinyButton: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  tinyButtonActive: { backgroundColor: "#5cff89" },
  tinyButtonWater: { backgroundColor: "#6bc7ff" },
  tinyButtonText: { color: "#ffffff", fontWeight: "900", fontSize: 12 },
  tinyButtonTextActive: { color: "#07120b" },
  searchBarNew: { marginTop: 18, flexDirection: "row", alignItems: "center", borderRadius: 22, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", paddingHorizontal: 16, paddingVertical: 4 },
  searchBarNewFocused: { borderColor: "#5cff89", shadowColor: "#5cff89", shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 5 } },
  searchIconNew: { fontSize: 18, marginRight: 10 },
  searchInputNew: { flex: 1, color: "#ffffff", fontSize: 15, fontWeight: "700", paddingVertical: 14 },
  filterTabsNew: { gap: 10, paddingTop: 18, paddingBottom: 6 },
  filterTabNew: { backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 999, paddingHorizontal: 16, paddingVertical: 11, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  filterTabNewActive: { backgroundColor: "#5cff89", borderColor: "#5cff89" },
  filterTabNewText: { color: "#d7ebdc", fontWeight: "900", fontSize: 13 },
  filterTabNewTextActive: { color: "#07120b" },
  detailHeader: { paddingHorizontal: 18, paddingTop: 10, marginBottom: 10 },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  backButtonText: { color: "#ffffff", fontWeight: "900", marginLeft: 4 },
  detailHero: { marginHorizontal: 18, borderRadius: 36, overflow: "hidden", alignItems: "center", paddingHorizontal: 20, paddingVertical: 32, backgroundColor: "rgba(16,41,23,0.96)", borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" },
  detailGlow: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "#5cff89", opacity: 0.18, top: -80, right: -70 },
  detailPlantImage: { width: 200, height: 200, resizeMode: "contain" },
  detailPlantEmoji: { fontSize: 120 },
  detailBadgeRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  detailBadge: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  detailBadgeText: { color: "#ffffff", fontSize: 12, fontWeight: "900" },
  detailTitle: { marginTop: 20, color: "#ffffff", fontSize: 42, fontWeight: "900", textAlign: "center" },
  detailSubtitle: { marginTop: 8, color: "#d7ebdc", fontSize: 15, fontWeight: "700", textAlign: "center" },
  detailQuickActions: { flexDirection: "row", gap: 12, marginHorizontal: 18, marginTop: 18, marginBottom: 18 },
  quickActionButton: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 22, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  quickActionButtonActive: { backgroundColor: "#5cff89", borderColor: "#5cff89" },
  quickActionText: { marginTop: 7, color: "#ffffff", fontWeight: "900", fontSize: 12 },
  quickActionTextActive: { color: "#07120b" },
  detailMiniGrid: { marginTop: 18, gap: 12 },
  detailMiniCard: { backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 22, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  detailMiniIcon: { fontSize: 22 },
  detailMiniLabel: { marginTop: 10, color: "#8effab", fontWeight: "900", fontSize: 12, textTransform: "uppercase" },
  detailMiniValue: { marginTop: 6, color: "#ffffff", fontSize: 14, lineHeight: 22, fontWeight: "700" },
  detailControlGrid: { flexDirection: "row", gap: 12, marginTop: 18 },
  controlTile: { flex: 1, borderRadius: 22, paddingVertical: 18, alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  controlTileActive: { backgroundColor: "#5cff89", borderColor: "#5cff89" },
  controlTileIcon: { fontSize: 26 },
  controlTileTitle: { marginTop: 8, color: "#ffffff", fontWeight: "900", fontSize: 12, textAlign: "center" },
  controlTileTitleActive: { color: "#07120b" },
  stepRow: { flexDirection: "row", gap: 14, marginTop: 16, alignItems: "flex-start" },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#5cff89", alignItems: "center", justifyContent: "center" },
  stepNumberText: { color: "#07120b", fontWeight: "900" },
  stepText: { flex: 1, color: "#ffffff", lineHeight: 22, fontWeight: "700", fontSize: 14 },
  companionSectionTitle: { color: "#ffffff", fontSize: 16, fontWeight: "900", marginTop: 22, marginBottom: 12 },
  companionVisualGrid: { gap: 12 },
  companionGoodCard: { backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" },
  companionVisualIcon: { fontSize: 24 },
  companionVisualTitle: { color: "#ffffff", fontSize: 18, fontWeight: "900", marginTop: 10 },
  companionVisualSub: { color: "#bfe8ca", marginTop: 5, fontWeight: "700" },
  companionWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  neutralCompanionPill: { backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  neutralCompanionText: { color: "#ffffff", fontWeight: "800", fontSize: 12 },
  companionBubbleWrap: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  badCompanionBubble: { width: "47%", backgroundColor: "rgba(255,123,123,0.12)", borderRadius: 22, padding: 16, borderWidth: 1, borderColor: "rgba(255,123,123,0.20)" },
  companionBubbleEmoji: { fontSize: 24 },
  companionBubbleText: { color: "#ffffff", fontWeight: "900", marginTop: 10, fontSize: 15 },
  companionBubbleSub: { color: "#ffd7d7", marginTop: 5, fontWeight: "700", fontSize: 12 },
  doNotPlantWarning: { marginTop: 20, backgroundColor: "rgba(255,123,123,0.12)", borderRadius: 24, padding: 18, borderWidth: 1, borderColor: "rgba(255,123,123,0.24)" },
  doNotPlantWarningTitle: { color: "#ffffff", fontWeight: "900", fontSize: 16 },
  doNotPlantWarningText: { marginTop: 8, color: "#ffdada", lineHeight: 22, fontWeight: "700" },
  pestTipBox: { marginTop: 20, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 24, padding: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" },
  pestTipTitle: { color: "#ffffff", fontSize: 16, fontWeight: "900" },
  pestTipText: { marginTop: 8, color: "#d7ebdc", lineHeight: 22, fontWeight: "700" },
 singleGalleryPreview: { marginTop: 18, borderRadius: 28, backgroundColor: "#0e2414", padding: 20, alignItems: "center", justifyContent: "center", minHeight: 260 },
  singleGalleryImage: { width: 220, height: 220, resizeMode: "contain" },
  journalAddButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#5cff89", alignItems: "center", justifyContent: "center", marginLeft: 14 },
  journalAddButtonText: { color: "#07120b", fontSize: 28, fontWeight: "900" },
  attributionContainer: { alignItems: "center", paddingVertical: 40 },
  attributionLogo: { width: 120, height: 40, opacity: 0.9 },
  attributionText: { marginTop: 14, textAlign: "center", lineHeight: 22, fontSize: 13, paddingHorizontal: 18, fontWeight: "700" },
  welcomeBuddyCard: { marginBottom: 12, overflow: "hidden", borderRadius: 30, position: "relative" },
  welcomeBuddyImage: { width: "100%", height: 480 },
  savedCountBubble: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#5cff89", alignItems: "center", justifyContent: "center" },
  savedCountText: { color: "#07120b", fontSize: 18, fontWeight: "900" },
  savedPlantsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 18 },
  savedPlantCard: { width: "47%", borderRadius: 22, padding: 14, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(142,255,171,0.16)", alignItems: "center" },
  savedPlantImage: { width: 72, height: 72, resizeMode: "contain" },
  savedPlantEmoji: { fontSize: 48 },
  savedPlantName: { marginTop: 10, color: "#ffffff", fontSize: 14, fontWeight: "900", textAlign: "center" },
  savedPlantMeta: { marginTop: 4, color: "#8effab", fontSize: 11, fontWeight: "800" },
  xpBarBackground: { marginTop: 18, height: 14, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.10)", overflow: "hidden" },
  xpBarFill: { height: "100%", borderRadius: 999, backgroundColor: "#5cff89" },
  xpProgressText: { marginTop: 10, color: "#8effab", fontSize: 12, fontWeight: "900" },
  xpStatsRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  xpMiniCard: { flex: 1, borderRadius: 20, padding: 16, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(142,255,171,0.16)", alignItems: "center" },
  xpMiniValue: { color: "#ffffff", fontSize: 24, fontWeight: "900" },
  xpMiniLabel: { marginTop: 4, color: "#d7ebdc", fontSize: 12, fontWeight: "800" },
  levelUpOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.45)", zIndex: 999 },
  levelUpCard: { width: "82%", borderRadius: 34, paddingVertical: 40, paddingHorizontal: 24, alignItems: "center", backgroundColor: "rgba(16,41,23,0.98)", borderWidth: 2, borderColor: "#5cff89", shadowColor: "#5cff89", shadowOpacity: 0.4, shadowRadius: 30, shadowOffset: { width: 0, height: 12 } },
  levelUpEmoji: { fontSize: 64 },
  levelUpTitle: { marginTop: 18, color: "#5cff89", fontSize: 38, fontWeight: "900", letterSpacing: 1 },
  levelUpText: { marginTop: 12, color: "#ffffff", fontSize: 18, fontWeight: "800", textAlign: "center", lineHeight: 28 },
  xpPopup: { position: "absolute", top: 110, alignSelf: "center", backgroundColor: "#5cff89", borderRadius: 999, paddingHorizontal: 22, paddingVertical: 12, zIndex: 1000, shadowColor: "#5cff89", shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  xpPopupText: { color: "#07120b", fontSize: 18, fontWeight: "900" },
  questSummaryPill: { alignSelf: "flex-start", marginTop: 16, backgroundColor: "rgba(92,255,137,0.14)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" },
  questSummaryText: { color: "#8effab", fontSize: 12, fontWeight: "900" },
  questList: { marginTop: 18, gap: 12 },
  questRow: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 22, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  questRowCompleted: { backgroundColor: "rgba(92,255,137,0.13)", borderColor: "rgba(92,255,137,0.30)" },
  questIcon: { fontSize: 28 },
  questTitle: { color: "#ffffff", fontSize: 15, fontWeight: "900" },
  questProgress: { marginTop: 4, color: "#d7ebdc", fontSize: 12, fontWeight: "800" },
  weatherParticleLayer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  weatherParticleAnimated: { position: "absolute", top: -80, fontSize: 24, textShadowColor: "#5cff89", textShadowRadius: 14 },
  bannerGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 20 },
  bannerCard: { width: "47%", borderRadius: 24, padding: 14, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  bannerPreview: { height: 82, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  bannerEmoji: { fontSize: 42 },
  bannerTitle: { marginTop: 12, color: "#ffffff", fontSize: 14, fontWeight: "900" },
  bannerSubtitle: { marginTop: 6, color: "#d7ebdc", fontSize: 11, fontWeight: "800", lineHeight: 16 },
  profileCard: { borderRadius: 34, padding: 20, marginBottom: 8, borderWidth: 1, overflow: "hidden" },
  profileBanner: { height: 130, borderRadius: 28, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  profileBannerEmoji: { fontSize: 46 },
  profileBannerTitle: { marginTop: 8, color: "#ffffff", fontSize: 18, fontWeight: "900" },
  profileAvatarCircle: { width: 94, height: 94, borderRadius: 47, backgroundColor: "#07120b", borderWidth: 4, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 12, shadowColor: "#5cff89", shadowOpacity: 0.9, shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 14 },
  profileAvatarEmoji: { fontSize: 42 },
  profileRank: { marginTop: 6, color: "#8effab", fontSize: 15, fontWeight: "900", textAlign: "center" },
  profileXP: { marginTop: 6, color: "#d7ebdc", fontSize: 13, fontWeight: "800", textAlign: "center" },
  profileStatsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 20 },
  profileStatBox: { width: "47%", borderRadius: 22, paddingVertical: 18, alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(142,255,171,0.16)" },
  profileStatValue: { color: "#ffffff", fontSize: 26, fontWeight: "900" },
  profileStatLabel: { marginTop: 4, color: "#d7ebdc", fontSize: 12, fontWeight: "800" },
  profileNameInput: { marginTop: 14, color: "#ffffff", fontSize: 24, fontWeight: "900", textAlign: "center", paddingVertical: 8 },
  profilePhoto: { width: "100%", height: "100%", borderRadius: 43 },
  profileAvatarGlow: { alignSelf: "center", borderRadius: 55, shadowColor: "#5cff89" },
  bottomTabs: { position: "absolute", left: 18, right: 18, bottom: 20, flexDirection: "row", backgroundColor: "rgba(10,18,14,0.88)", borderRadius: 34, padding: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", shadowColor: "#000", shadowOpacity: 0.28, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, elevation: 22 },
  bottomTabButton: { flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 24 },
  bottomTabButtonActive: { backgroundColor: "#5cff89", borderRadius: 22, shadowColor: "#5cff89", shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 12 },
  bottomTabText: { marginTop: 2, fontSize: 8, fontWeight: "800", textAlign: "center", color: "#d7ebdc" },
  bottomTabTextActive: { color: "#07120b" },
  planRow: { flexDirection: "row", marginVertical: 18, gap: 12 },
  planCard: { flex: 1, borderWidth: 1.5, borderRadius: 28, paddingVertical: 28, paddingHorizontal: 18, marginHorizontal: 6, alignItems: "center", justifyContent: "center", overflow: "hidden", shadowColor: "#5cff89", shadowOpacity: 0.28, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  planCardActive: { shadowColor: "#5cff89", shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  planTitle: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
  planPrice: { fontSize: 22, fontWeight: "900" },
  planSubtext: { marginTop: 6, fontSize: 12, fontWeight: "800", textAlign: "center" },
  planBadge: { position: "absolute", top: 10, right: 10, backgroundColor: "#5cff89", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, zIndex: 5 },
  planBadgeText: { color: "#07120b", fontSize: 9, fontWeight: "900", letterSpacing: 0.4 },
  plantTodayHero: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 30, padding: 20, marginBottom: 18, borderWidth: 1, overflow: "hidden" },
  plantTodayEyebrow: { color: "#8effab", fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  plantTodayTitle: { marginTop: 6, fontSize: 28, fontWeight: "900" },
  plantTodayText: { marginTop: 8, fontSize: 14, lineHeight: 21, fontWeight: "700" },
  plantTodayButtonText: { marginTop: 12, color: "#5cff89", fontWeight: "900" },
 plantTodayImage: { width: 90, height: 90, resizeMode: "contain" },
  plantTodayFallback: { fontSize: 58 },
  weatherWarningBanner: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1 },
  weatherWarningIcon: { fontSize: 34 },
  weatherWarningTitle: { fontSize: 17, fontWeight: "900" },
  weatherWarningText: { marginTop: 5, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  streakProgressCard: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1 },
  streakProgressEmoji: { fontSize: 38 },
  streakProgressTitle: { fontSize: 18, fontWeight: "900" },
  streakProgressText: { marginTop: 4, fontSize: 13, lineHeight: 19, fontWeight: "700" },
  streakProgressBar: { marginTop: 12, height: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  streakProgressFill: { height: "100%", borderRadius: 999, backgroundColor: "#ff9f43" },
  seasonalIntelBox: { marginTop: 14, marginBottom: 14, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.2)" },
  seasonalIntelLabel: { color: "#5cff89", fontSize: 14, fontWeight: "900" },
  seasonalIntelText: { marginTop: 6, color: "#d7ebdc", fontSize: 12, lineHeight: 18, fontWeight: "700" },
  gardenSlotConflict: { shadowColor: "#ff7b7b", shadowOpacity: 0.45, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
  gardenSlotExcellent: { shadowColor: "#5cff89", shadowOpacity: 0.45, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
  gardenWaterBadge: { marginTop: 8, backgroundColor: "rgba(107,199,255,0.18)", borderWidth: 1, borderColor: "rgba(107,199,255,0.4)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  gardenWaterBadgeText: { color: "#6bc7ff", fontSize: 11, fontWeight: "900" },
  bottomTabPressed: { transform: [{ scale: 0.94 }], opacity: 0.82 },
  bottomTabGlow: { shadowColor: "#5cff89", shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 12 },
  bottomTabInner: { alignItems: "center", justifyContent: "center", paddingVertical: 6, paddingHorizontal: 6, borderRadius: 18, width: "100%" },
  bottomTabInnerActive: { backgroundColor: "#5cff89", transform: [{ scale: 1.08 }], shadowColor: "#5cff89", shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 12 },
  calendarMonthCard: { alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  calendarMonthCardActive: { backgroundColor: "rgba(92,255,137,0.18)", borderColor: "rgba(92,255,137,0.35)" },
  calendarMonthEmoji: { fontSize: 22, textAlign: "center" },
  calendarMonthText: { color: "#d7ebdc", fontSize: 13, fontWeight: "900", textAlign: "center" },
  journalTimeline: { marginTop: 18, gap: 18 },
  timelineEntryWrap: { position: "relative", paddingLeft: 26 },
  timelineLine: { position: "absolute", left: 10, top: 0, bottom: -24, width: 2, backgroundColor: "rgba(92,255,137,0.18)" },
  timelineDot: { position: "absolute", left: 2, top: 16, width: 18, height: 18, borderRadius: 999, backgroundColor: "#5cff89", borderWidth: 3, borderColor: "#07120b" },
  journalTimelineCard: { borderRadius: 24, overflow: "hidden", borderWidth: 1 },
  journalTimelineImage: { width: "100%", height: 180 },
  journalTimelinePlaceholder: { height: 180, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(92,255,137,0.08)" },
  journalTimelinePlaceholderEmoji: { fontSize: 48 },
  journalTimelineContent: { padding: 16 },
  journalTimelineHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  journalTimelineTitle: { fontSize: 16, fontWeight: "900", flex: 1 },
  journalTimelineDate: { fontSize: 11, fontWeight: "700" },
  journalTimelineBody: { marginTop: 10, fontSize: 13, lineHeight: 20 },
  journalMoodRow: { marginTop: 14, flexDirection: "row" },
  journalMoodBadge: { backgroundColor: "rgba(92,255,137,0.14)", color: "#5cff89", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, overflow: "hidden", fontWeight: "900", fontSize: 11 },
  growthTrackingRow: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  growthTrackingBadge: { backgroundColor: "rgba(255,216,107,0.14)", color: "#ffd86b", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, overflow: "hidden", fontSize: 11, fontWeight: "900" },
  journalAchievementRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 16, marginBottom: 8, gap: 10 },
  journalAchievementBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  journalAchievementIcon: { fontSize: 16, marginRight: 6 },
  journalAchievementText: { color: "#d7ebdc", fontSize: 11, fontWeight: "900" },
  timelineDeleteButton: { position: "absolute", top: 12, right: 12, backgroundColor: "rgba(255,123,123,0.95)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, zIndex: 10 },
  timelineDeleteButtonText: { color: "#ffffff", fontSize: 12, fontWeight: "900" },
  journalHeroCard: { marginTop: 18, borderRadius: 28, padding: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.35)", backgroundColor: "rgba(92,255,137,0.08)", overflow: "hidden" },
  journalHeroImageWrap: { width: 92, height: 92, borderRadius: 30, backgroundColor: "rgba(92,255,137,0.16)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  journalHeroCamera: { fontSize: 48 },
  journalHeroSparkle: { position: "absolute", top: 8, right: 10, fontSize: 22 },
  journalHeroTitle: { color: "#ffffff", fontSize: 28, fontWeight: "900", lineHeight: 32 },
  journalHeroText: { color: "#d7ebdc", fontSize: 15, lineHeight: 23, fontWeight: "700", marginTop: 8 },
  journalHeroButton: { marginTop: 18, backgroundColor: "#5cff89", borderRadius: 999, paddingVertical: 15, alignItems: "center" },
  journalHeroButtonText: { color: "#07120b", fontSize: 16, fontWeight: "900" },
  premiumFeatureList: { marginTop: 18, marginBottom: 22, gap: 10 },
  premiumFeatureBullet: { color: "#d7ebdc", fontSize: 15, fontWeight: "800", lineHeight: 22 },
  premiumHeroCard: { marginTop: 18, marginBottom: 22, borderRadius: 32, padding: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(92,255,137,0.28)", backgroundColor: "rgba(92,255,137,0.08)" },
  premiumHeroGlow: { position: "absolute", width: 220, height: 220, borderRadius: 999, backgroundColor: "rgba(92,255,137,0.12)", top: -60, right: -40 },
  premiumHeroCrown: { fontSize: 52, marginBottom: 14 },
  premiumHeroText: { marginTop: 10, fontSize: 15, lineHeight: 24, fontWeight: "700" },
  premiumTrialPill: { marginTop: 18, alignSelf: "flex-start", backgroundColor: "#5cff89", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  premiumTrialText: { color: "#07120b", fontSize: 11, fontWeight: "900", letterSpacing: 0.8 },
  unlockButton: { marginTop: 18, borderRadius: 28, padding: 22, alignItems: "center", backgroundColor: "rgba(92,255,137,0.12)", borderWidth: 1, borderColor: "rgba(92,255,137,0.28)", overflow: "hidden" },
  unlockButtonActive: { backgroundColor: "rgba(92,255,137,0.22)", borderColor: "#5cff89" },
  unlockButtonGlow: { position: "absolute", width: 220, height: 220, borderRadius: 999, backgroundColor: "rgba(92,255,137,0.18)", top: -80, right: -50 },
  unlockButtonIcon: { fontSize: 34, marginBottom: 10 },
  unlockButtonText: { color: "#ffffff", fontWeight: "900", fontSize: 14 },
  unlockButtonSubtext: { marginTop: 8, color: "#d7ebdc", fontSize: 13, fontWeight: "700", textAlign: "center", lineHeight: 20 },
  zoneCardGlow: { shadowColor: "#5cff89", shadowOpacity: 0.28, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  zoneHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  zoneIconGlow: { width: 58, height: 58, borderRadius: 20, backgroundColor: "rgba(92,255,137,0.14)", alignItems: "center", justifyContent: "center", marginRight: 14, shadowColor: "#5cff89", shadowOpacity: 0.35, shadowRadius: 18 },
  zoneIconText: { fontSize: 28 },
  zoneInput: { borderWidth: 1.5, borderRadius: 24, paddingVertical: 20, fontSize: 18, fontWeight: "800" },
  glowPrimaryButton: { shadowColor: "#5cff89", shadowOpacity: 0.42, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
  glowSecondaryButton: { backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1.2 },
  welcomeGlowOrbOne: { position: "absolute", width: 220, height: 220, borderRadius: 999, backgroundColor: "rgba(92,255,137,0.18)", top: -60, left: -40, zIndex: 1 },
  welcomeGlowOrbTwo: { position: "absolute", width: 180, height: 180, borderRadius: 999, backgroundColor: "rgba(255,216,107,0.12)", bottom: -50, right: -30, zIndex: 1 },
  bottomBackButton: { marginTop: 20, marginBottom: 10, backgroundColor: "#5cff89", borderRadius: 999, paddingVertical: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", shadowColor: "#5cff89", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 },
  bottomBackButtonText: { color: "#07120b", fontSize: 16, fontWeight: "900", marginLeft: 6 },
  savedPlantsUpgradeCard: { marginTop: 14, padding: 14, borderRadius: 14, backgroundColor: "#163321", borderWidth: 1, borderColor: "#5cff89" },
  savedPlantsUpgradeTitle: { color: "#5cff89", fontSize: 16, fontWeight: "900", marginBottom: 4 },
  savedPlantsUpgradeText: { color: "#d7ffe4", fontSize: 13, lineHeight: 18 },
  weatherTeaserCard: { marginTop: 12, padding: 18, borderRadius: 18, backgroundColor: "#163321", borderWidth: 1, borderColor: "#5cff89", alignItems: "center" },
  weatherTeaserTemp: { fontSize: 34, fontWeight: "900", color: "#ffffff" },
  weatherTeaserCondition: { fontSize: 16, fontWeight: "700", color: "#d7ffe4", marginTop: 6 },
  weatherTeaserText: { fontSize: 14, lineHeight: 20, color: "#d7ffe4", textAlign: "center", marginTop: 10 },
  weatherTeaserButton: { marginTop: 14, backgroundColor: "#5cff89", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
  weatherTeaserButtonText: { color: "#163321", fontWeight: "900", fontSize: 14 },
  comingSoonButton: { marginTop: 16, marginBottom: 12, backgroundColor: "rgba(92,255,137,0.10)", paddingVertical: 14, borderRadius: 16, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.25)" },
  comingSoonButtonText: { color: "#8effab", fontSize: 14, fontWeight: "800", letterSpacing: 0.3 },
  gallerySingleWrap: { marginTop: 14 },
  galleryButtonRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 },
  galleryNavButton: { backgroundColor: "#5cff89", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  galleryNavButtonText: { color: "#07120b", fontWeight: "900", fontSize: 12 },
  galleryCounterText: { color: "#d7ebdc", fontWeight: "900", fontSize: 12 },
  smartReminderHomeCard: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1 },
  smartReminderHomeIcon: { fontSize: 34 },
  smartReminderHomeTitle: { fontSize: 18, fontWeight: "900" },
  smartReminderHomeText: { marginTop: 5, fontSize: 13, lineHeight: 20, fontWeight: "700" },
  smartReminderHomeArrow: { color: "#5cff89", fontSize: 34, fontWeight: "900" },
  smartReminderHomeBadgeText: { fontSize: 12, fontWeight: "700", color: "#5cff89", marginTop: 4 },
  savedFolderWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  savedFolderCard: { backgroundColor: "rgba(92,255,137,0.10)", borderWidth: 1, borderColor: "rgba(92,255,137,0.25)", borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 },
  savedFolderTitle: { color: "#ffffff", fontSize: 14, fontWeight: "800" },
  savedFolderText: { color: "#b7d9c0", fontSize: 12, marginTop: 2 },
  onboardingOverlay: { flex: 1, backgroundColor: "#07120b", justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  onboardingCard: { width: "100%", backgroundColor: "rgba(16,41,23,0.96)", borderRadius: 30, padding: 28, borderWidth: 1, borderColor: "rgba(92,255,137,0.25)" },
  onboardingEmoji: { fontSize: 60, textAlign: "center", marginBottom: 12 },
  onboardingTitle: { color: "#ffffff", fontSize: 28, fontWeight: "800", textAlign: "center", marginBottom: 12 },
  onboardingText: { color: "#d7ebdc", fontSize: 15, lineHeight: 22, textAlign: "center", marginBottom: 20 },
  onboardingFeatureList: { marginBottom: 24 },
  onboardingFeature: { color: "#ffffff", fontSize: 15, marginBottom: 10 },
  onboardingButton: { backgroundColor: "#5cff89", borderRadius: 18, paddingVertical: 16, alignItems: "center" },
  onboardingButtonText: { color: "#07120b", fontSize: 16, fontWeight: "800" },
  emptyStateCard: { alignItems: "center", paddingVertical: 28, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "rgba(92,255,137,0.06)", borderWidth: 1, borderColor: "rgba(92,255,137,0.12)" },
  emptyStateIcon: { fontSize: 42, marginBottom: 10 },
  emptyStateTitle: { color: "#ffffff", fontSize: 18, fontWeight: "800", marginBottom: 6, textAlign: "center" },
  emptyStateText: { color: "#d7ebdc", fontSize: 14, lineHeight: 20, textAlign: "center" },
  harvestTrackerCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 22, padding: 16, marginTop: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" },
  harvestTrackerEmoji: { fontSize: 34 },
  harvestTrackerTitle: { color: "#ffffff", fontSize: 16, fontWeight: "900" },
  harvestTrackerText: { color: "#d7ebdc", fontSize: 13, fontWeight: "700", marginTop: 4 },
  harvestTrackerButton: { backgroundColor: "#5cff89", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 11 },
  harvestTrackerButtonText: { color: "#07120b", fontSize: 12, fontWeight: "900" },
  savedPlantHealthBadge: { marginTop: 8, marginBottom: 8, borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, alignSelf: "center", backgroundColor: "rgba(255,255,255,0.06)" },
  savedPlantHealthText: { fontSize: 11, fontWeight: "900", textAlign: "center" },
  myGardenTodayCard: { borderRadius: 30, padding: 20, marginBottom: 18, borderWidth: 1, shadowColor: "#5cff89", shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  myGardenTodayEyebrow: { color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8 },
  myGardenTodayTitle: { marginTop: 6, fontSize: 26, fontWeight: "900" },
  myGardenTodaySubtext: { marginTop: 8, fontSize: 14, lineHeight: 21, fontWeight: "700" },
  myGardenTaskList: { marginTop: 16, gap: 10 },
  myGardenTaskRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 20, padding: 14, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(142,255,171,0.14)" },
  myGardenTaskIcon: { fontSize: 24 },
  myGardenTaskTitle: { color: "#ffffff", fontSize: 14, fontWeight: "900" },
  myGardenTaskText: { color: "#d7ebdc", marginTop: 3, fontSize: 12, lineHeight: 18, fontWeight: "700" },
  myGardenTaskArrow: { color: "#8effab", fontSize: 28, fontWeight: "900" },
  plantNotesInput: { marginTop: 14, minHeight: 120, borderRadius: 18, padding: 14, textAlignVertical: "top", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(142,255,171,0.18)", color: "#ffffff", fontSize: 14, lineHeight: 22 },
  harvestProgressTrack: { height: 8, borderRadius: 999, overflow: "hidden", marginTop: 8, backgroundColor: "rgba(255,255,255,0.08)" },
  harvestProgressFill: { height: "100%", borderRadius: 999, backgroundColor: "#5cff89" },
  harvestProgressText: { marginTop: 4, fontSize: 11, fontWeight: "800", color: "#8effab", textAlign: "center" },
  gardenTemplateWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 18, gap: 10 },
  gardenTemplateButton: { width: "48%", borderRadius: 18, paddingVertical: 14, paddingHorizontal: 12, alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(142,255,171,0.15)" },
  gardenTemplateIcon: { fontSize: 28, marginBottom: 6 },
  gardenTemplateText: { color: "#ffffff", fontSize: 13, fontWeight: "800", textAlign: "center" },
  compareCard: { marginTop: 16, marginBottom: 16, borderRadius: 24, padding: 18, backgroundColor: "rgba(92,255,137,0.10)", borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" },
  compareTitle: { color: "#ffffff", fontSize: 20, fontWeight: "900", marginBottom: 14 },
  compareRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  comparePlantName: { flex: 1, color: "#ffffff", fontSize: 16, fontWeight: "900", textAlign: "center" },
  compareVs: { color: "#8effab", fontWeight: "900" },
  compareStatRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" },
  compareLabel: { flex: 1, color: "#8effab", fontSize: 12, fontWeight: "900" },
  compareValue: { flex: 1, color: "#ffffff", fontSize: 12, fontWeight: "800", textAlign: "center" },
  compareClearButton: { marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 12, alignItems: "center" },
  compareClearText: { color: "#07120b", fontWeight: "900" },
  compareHintCard: { marginTop: 16, marginBottom: 16, borderRadius: 20, padding: 14, backgroundColor: "rgba(255,216,107,0.12)", borderWidth: 1, borderColor: "rgba(255,216,107,0.25)" },
  compareHintText: { color: "#ffd86b", fontSize: 13, fontWeight: "800" },
  weeklyRecapCard: { marginBottom: 18, borderRadius: 24, padding: 18, borderWidth: 1 },
  weeklyRecapEyebrow: { color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 1.2, marginBottom: 6 },
  weeklyRecapTitle: { fontSize: 22, fontWeight: "900", marginBottom: 14 },
  weeklyRecapGrid: { gap: 10 },
  weeklyRecapItem: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  weeklyRecapFooter: { marginTop: 14, color: "#ffd86b", fontSize: 14, fontWeight: "900" },
  weatherTaskCard: { marginBottom: 18, borderRadius: 24, padding: 18, borderWidth: 1 },
  weatherTaskEyebrow: { color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 1.2, marginBottom: 6 },
  weatherTaskTitle: { fontSize: 20, fontWeight: "900", marginBottom: 12 },
  weatherTaskItem: { color: "#ffffff", fontSize: 14, fontWeight: "700", marginBottom: 8, lineHeight: 22 },
  smartAssistantPill: { alignSelf: "flex-start", backgroundColor: "rgba(92,255,137,0.14)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginBottom: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)" },
  smartAssistantPillText: { color: "#8effab", fontWeight: "900", fontSize: 13 },
  premiumGlassCard: { borderRadius: 34, padding: 26, marginBottom: 18, backgroundColor: "rgba(16,41,23,0.96)", borderWidth: 1, borderColor: "rgba(92,255,137,0.28)", overflow: "hidden" },
  premiumGlowOrb: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(92,255,137,0.14)", top: -100, right: -80 },
  premiumGlowOrbTwo: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,216,107,0.08)", bottom: -60, left: -60 },
  premiumTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  premiumBadge: { backgroundColor: "rgba(92,255,137,0.14)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)" },
  premiumBadgeText: { color: "#8effab", fontWeight: "900", fontSize: 12 },
  premiumRibbon: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#ffd86b", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  premiumRibbonIcon: { fontSize: 14 },
  premiumRibbonText: { color: "#3d2c00", fontWeight: "900", fontSize: 11 },
  premiumHeadline: { color: "#ffffff", fontSize: 30, fontWeight: "900", lineHeight: 36, marginBottom: 12 },
  premiumHeadlineGreen: { color: "#5cff89" },
  premiumSubheadline: { color: "#d7ebdc", fontSize: 15, lineHeight: 23, fontWeight: "700", marginBottom: 18 },
  premiumFeatureGridNew: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 22 },
  premiumFeatureNew: { backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, color: "#ffffff", fontWeight: "800", fontSize: 13 },
  premiumActionRowNew: { gap: 12, marginBottom: 16 },
  premiumCtaButton: { backgroundColor: "#5cff89", borderRadius: 22, paddingVertical: 17, alignItems: "center" },
  premiumCtaText: { color: "#07120b", fontWeight: "900", fontSize: 16 },
  premiumLaterButton: { borderRadius: 22, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  premiumLaterText: { color: "#d7ebdc", fontWeight: "800" },
  premiumPriceText: { textAlign: "center", fontSize: 13, fontWeight: "700", color: "#8effab" },
themeChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
themeChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 2 },
themeChipSelected: { shadowColor: "#5cff89", shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
themeChipEmoji: { fontSize: 16 },
themeChipLabel: { fontSize: 12, fontWeight: "800" },
themeChipDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 2 },
savedPlantImage: { width: 64, height: 64, resizeMode: "contain" },
plantTodayImageWrap: { width: 105, height: 105, borderRadius: 20, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" },
galleryImageDarkWrap: { width: "100%", backgroundColor: "#0e2414", borderRadius: 20, alignItems: "center", justifyContent: "center", overflow: "hidden" },
gardenSlotImageWrap: { width: 54, height: 54, borderRadius: 14, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" },
glowPlantImageDarkWrap: { width: 120, height: 120, borderRadius: 18, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" },
detailPlantImageWrap: { width: 220, height: 220, borderRadius: 28, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" },
singleGalleryImageWrap: { width: 240, height: 240, borderRadius: 28, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" },
primaryFeatureCard: {
  borderWidth: 2,
  borderColor: "rgba(92,255,137,0.45)",
  shadowColor: "#5cff89",
  shadowOpacity: 0.28,
  shadowRadius: 28,
  shadowOffset: { width: 0, height: 10 },
  elevation: 10,
  overflow: "hidden",
},
primaryFeatureAccentBar: {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: 5,
  backgroundColor: "#5cff89",
  borderTopLeftRadius: 30,
  borderBottomLeftRadius: 30,
},
weeklyFirstUseText: { fontSize: 14, lineHeight: 21, fontWeight: "700", marginTop: 8, marginBottom: 14 },
weeklyFirstUseRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
weeklyFirstUsePill: { backgroundColor: "rgba(92,255,137,0.12)", color: "#8effab", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, fontSize: 12, fontWeight: "800", overflow: "hidden", borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" },
achievementCompactGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
achievementCompactCard: { width: "47%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 20, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", alignItems: "center", position: "relative" },
achievementCompactCardUnlocked: { borderColor: "rgba(92,255,137,0.35)", backgroundColor: "rgba(92,255,137,0.10)" },
achievementCompactIcon: { fontSize: 28, marginBottom: 8 },
achievementCompactTitle: { color: "#ffffff", fontSize: 12, fontWeight: "900", textAlign: "center", marginBottom: 4 },
achievementCompactText: { color: "#d7ebdc", fontSize: 11, fontWeight: "700", textAlign: "center", lineHeight: 16 },
achievementCompactCheck: { position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: "#5cff89", alignItems: "center", justifyContent: "center" },
achievementCompactCheckText: { color: "#07120b", fontSize: 10, fontWeight: "900" },
weeklyTaskDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginVertical: 14 },
gardenSummaryRow: { flexDirection: "row", gap: 12, marginBottom: 18 },
gardenSummaryCard: { flex: 1, borderRadius: 24, padding: 16, alignItems: "center", borderWidth: 1 },
gardenSummaryIcon: { fontSize: 28, marginBottom: 6 },
gardenSummaryTitle: { fontSize: 15, fontWeight: "900" },
gardenSummaryMeta: { marginTop: 4, fontSize: 12, fontWeight: "800", color: "#8effab" },
gardenStatsDashboard: {
  borderRadius: 30,
  padding: 20,
  marginBottom: 18,
  borderWidth: 1,
  shadowColor: "#5cff89",
  shadowOpacity: 0.12,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 5,
},
gardenStatsEyebrow: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.6,
},
gardenStatsTitle: {
  marginTop: 6,
  fontSize: 24,
  fontWeight: "900",
},
gardenStatsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 18,
},
gardenStatsTile: {
  width: "47%",
  borderRadius: 22,
  padding: 16,
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 1,
  borderColor: "rgba(142,255,171,0.16)",
},
gardenStatsIcon: {
  fontSize: 24,
},
gardenStatsValue: {
  marginTop: 8,
  color: "#ffffff",
  fontSize: 24,
  fontWeight: "900",
},
gardenStatsLabel: {
  marginTop: 4,
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "800",
},
confettiLayer: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
},

confettiPiece: {
  position: "absolute",
  fontSize: 30,
},
forecastCard: {
  borderRadius: 30,
  padding: 20,
  marginBottom: 18,
  borderWidth: 1,
},

forecastEyebrow: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.6,
},

forecastTitle: {
  marginTop: 6,
  fontSize: 22,
  fontWeight: "900",
},

forecastScroll: {
  gap: 12,
  paddingTop: 18,
  paddingBottom: 4,
},

forecastDayCard: {
  width: 94,
  borderRadius: 22,
  paddingVertical: 16,
  paddingHorizontal: 12,
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 1,
  borderColor: "rgba(142,255,171,0.16)",
},

forecastDayLabel: {
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "900",
},

forecastIcon: {
  marginTop: 8,
  fontSize: 26,
},

forecastTemp: {
  marginTop: 8,
  color: "#ffffff",
  fontSize: 24,
  fontWeight: "900",
},

forecastRain: {
  marginTop: 4,
  color: "#8effab",
  fontSize: 11,
  fontWeight: "800",
},
onboardingDots: {
  flexDirection: "row",
  justifyContent: "center",
  gap: 8,
  marginTop: 20,
},

onboardingDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "rgba(255,255,255,0.24)",
},

onboardingDotActive: {
  width: 24,
  backgroundColor: "#5cff89",
},

onboardingSkipButton: {
  marginTop: 14,
  alignItems: "center",
},

onboardingSkipText: {
  color: "#d7ebdc",
  fontWeight: "800",
},
seeAllPlantsButton: {
  marginTop: 16,
  alignSelf: "center",
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 20,
  backgroundColor: "rgba(92,255,137,0.12)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.25)",
},

seeAllPlantsButtonText: {
  color: "#8effab",
  fontSize: 14,
  fontWeight: "800",
},
compactSavedPlantsCard: {
  borderWidth: 1,
  borderRadius: 24,
  padding: 18,
  marginBottom: 18,
},

compactSavedPlantsTitle: {
  fontSize: 22,
  fontWeight: "900",
},

compactSavedPlantsSubtext: {
  marginTop: 4,
  fontSize: 13,
},

compactSavedPlantsScroll: {
  paddingTop: 14,
  gap: 12,
},

compactSavedPlantPill: {
  width: 110,
  borderRadius: 18,
  padding: 12,
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.14)",
},

compactSavedPlantImage: {
  width: 52,
  height: 52,
},

compactSavedPlantEmoji: {
  fontSize: 36,
},

compactSavedPlantName: {
  marginTop: 8,
  color: "#ffffff",
  fontWeight: "800",
  fontSize: 13,
},

compactSavedPlantHealth: {
  marginTop: 4,
  fontSize: 11,
  fontWeight: "700",
},

compactUpgradeButton: {
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 14,
  backgroundColor: "rgba(255,215,0,0.14)",
},

compactUpgradeButtonText: {
  color: "#ffd86b",
  fontWeight: "800",
},
gardenIntelligenceCard: {
  borderWidth: 1,
  borderRadius: 30,
  padding: 20,
  marginBottom: 18,
},

gardenIntelligenceEyebrow: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.6,
},

gardenIntelligenceTitle: {
  marginTop: 6,
  fontSize: 23,
  fontWeight: "900",
},

gardenIntelligenceGrid: {
  marginTop: 16,
  gap: 12,
},

gardenIntelligenceTile: {
  borderRadius: 20,
  padding: 16,
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.14)",
},

gardenIntelligenceLabel: {
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "800",
},

gardenIntelligenceValue: {
  marginTop: 6,
  color: "#ffffff",
  fontSize: 19,
  fontWeight: "900",
},
achievementProgressTrack: {
  marginTop: 10,
  height: 7,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.10)",
  overflow: "hidden",
},

achievementProgressFill: {
  height: "100%",
  borderRadius: 999,
  backgroundColor: "#5cff89",
},
dailyBonusCard: {
  borderWidth: 1,
  borderRadius: 24,
  padding: 18,
  marginBottom: 18,
  flexDirection: "row",
  alignItems: "center",
  gap: 16,
},

dailyBonusEyebrow: {
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.6,
},

dailyBonusTitle: {
  marginTop: 4,
  fontSize: 22,
  fontWeight: "900",
},

dailyBonusText: {
  marginTop: 6,
  fontSize: 13,
  lineHeight: 18,
},

dailyBonusButton: {
  backgroundColor: "#5cff89",
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 16,
},

dailyBonusButtonClaimed: {
  backgroundColor: "#314c39",
},

dailyBonusButtonText: {
  color: "#07120b",
  fontWeight: "900",
  fontSize: 13,
},
});