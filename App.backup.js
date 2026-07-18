import React, { useEffect, useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "./lib/supabase";
import {
  Alert,
  Animated,
  Dimensions,
  Vibration,
  Image,
  Keyboard,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
 RefreshControl,
  Share,
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
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as StoreReview from "expo-store-review";
import Purchases from 'react-native-purchases';
import prismLogo from "./assets/prism-logo.png";
import zipZoneData from "./data/zipZoneData";
import produceData from "./data/produceData";
const loadingScreenImage = require("./assets/loading-screen.png");
const welcomeBuddyImage = require("./assets/welcome-buddy.png");
const gardenBuddyImage = require("./assets/garden-buddy.png");
const journalBuddyImage = require("./assets/journal-buddy.png");
const plantsBuddyImage = require("./assets/plants-buddy.png");
const profileBuddyImage = require("./assets/profile-buddy.png");
const premiumBuddyImage = require("./assets/premium-buddy.png");
const homeBuddyImage = require("./assets/home-buddy.png");
const weatherBuddyImage = require("./assets/weather-buddy.png");
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
  oregano: require("./assets/plants/oregano.png"),
  sage: require("./assets/plants/sage.png"),
  dill: require("./assets/plants/dill.png"),
  chives: require("./assets/plants/chives.png"),
  tarragon: require("./assets/plants/tarragon.png"),
  lavender: require("./assets/plants/lavender.png"),
  lemongrass: require("./assets/plants/lemongrass.png"),
  marjoram: require("./assets/plants/marjoram.png"),
  baylaurel: require("./assets/plants/baylaurel.png"),
  chamomile: require("./assets/plants/chamomile.png"),
  catnip: require("./assets/plants/catnip.png"),
  stevia: require("./assets/plants/stevia.png"),
  sorrel: require("./assets/plants/sorrel.png"),
  summersavory: require("./assets/plants/summersavory.png"),
  lovage: require("./assets/plants/lovage.png"),
  turmeric: require("./assets/plants/turmeric.png"),
  ginger: require("./assets/plants/ginger.png"),
  anise: require("./assets/plants/anise.png"),
  borage: require("./assets/plants/borage.png"),
  chervil: require("./assets/plants/chervil.png"),
  brusselssprouts: require("./assets/plants/brusselssprouts.png"),
  collardgreens: require("./assets/plants/collardgreens.png"),
  mustardgreens: require("./assets/plants/mustardgreens.png"),
  arugula: require("./assets/plants/arugula.png"),
  kohlrabi: require("./assets/plants/kohlrabi.png"),
  endive: require("./assets/plants/endive.png"),
  radicchio: require("./assets/plants/radicchio.png"),
  watercress: require("./assets/plants/watercress.png"),
  romaine: require("./assets/plants/romaine.png"),
  napacabbage: require("./assets/plants/napacabbage.png"),
  turnip: require("./assets/plants/turnip.png"),
  rutabaga: require("./assets/plants/rutabaga.png"),
  parsnip: require("./assets/plants/parsnip.png"),
  horseradish: require("./assets/plants/horseradish.png"),
  escarole: require("./assets/plants/escarole.png"),
  shallot: require("./assets/plants/shallot.png"),
  scallion: require("./assets/plants/scallion.png"),
  rhubarb: require("./assets/plants/rhubarb.png"),
  asparagus: require("./assets/plants/asparagus.png"),
  artichoke: require("./assets/plants/artichoke.png"),
  jerusalemartichoke: require("./assets/plants/jerusalemartichoke.png"),
  jicama: require("./assets/plants/jicama.png"),
  celeriac: require("./assets/plants/celeriac.png"),
  salsify: require("./assets/plants/salsify.png"),
  daikon: require("./assets/plants/daikon.png"),
  edamame: require("./assets/plants/edamame.png"),
  limabean: require("./assets/plants/limabean.png"),
  favabean: require("./assets/plants/favabean.png"),
  chickpea: require("./assets/plants/chickpea.png"),
  lentil: require("./assets/plants/lentil.png"),
  blackbean: require("./assets/plants/blackbean.png"),
  pintobean: require("./assets/plants/pintobean.png"),
  snappea: require("./assets/plants/snappea.png"),
  jalapeno: require("./assets/plants/jalapeno.png"),
  habanero: require("./assets/plants/habanero.png"),
  serrano: require("./assets/plants/serrano.png"),
  poblano: require("./assets/plants/poblano.png"),
  bellpepper: require("./assets/plants/bellpepper.png"),
  cayenne: require("./assets/plants/cayenne.png"),
  ghostpepper: require("./assets/plants/ghostpepper.png"),
  bananapepper: require("./assets/plants/bananapepper.png"),
  butternutsquash: require("./assets/plants/butternutsquash.png"),
  acornsquash: require("./assets/plants/acornsquash.png"),
  spaghettisquash: require("./assets/plants/spaghettisquash.png"),
  yellowsquash: require("./assets/plants/yellowsquash.png"),
  pattypansquash: require("./assets/plants/pattypansquash.png"),
  delicatasquash: require("./assets/plants/delicatasquash.png"),
  kabochasquash: require("./assets/plants/kabochasquash.png"),
  gourd: require("./assets/plants/gourd.png"),
  luffa: require("./assets/plants/luffa.png"),
  tomatillo: require("./assets/plants/tomatillo.png"),
  nectarine: require("./assets/plants/nectarine.png"),
  persimmon: require("./assets/plants/persimmon.png"),
  guava: require("./assets/plants/guava.png"),
  papaya: require("./assets/plants/papaya.png"),
  quince: require("./assets/plants/quince.png"),
  date: require("./assets/plants/date.png"),
  olive: require("./assets/plants/olive.png"),
  jackfruit: require("./assets/plants/jackfruit.png"),
  lychee: require("./assets/plants/lychee.png"),
  loquat: require("./assets/plants/loquat.png"),
  mulberrytree: require("./assets/plants/mulberrytree.png"),
  pluot: require("./assets/plants/pluot.png"),
  kumquattree: require("./assets/plants/kumquattree.png"),
  feijoa: require("./assets/plants/feijoa.png"),
  tangerine: require("./assets/plants/tangerine.png"),
  clementine: require("./assets/plants/clementine.png"),
  kumquat: require("./assets/plants/kumquat.png"),
  bloodorange: require("./assets/plants/bloodorange.png"),
  yuzu: require("./assets/plants/yuzu.png"),
  bergamot: require("./assets/plants/bergamot.png"),
  calamansi: require("./assets/plants/calamansi.png"),
  pineapple: require("./assets/plants/pineapple.png"),
  kiwi: require("./assets/plants/kiwi.png"),
  passionfruit: require("./assets/plants/passionfruit.png"),
  dragonfruit: require("./assets/plants/dragonfruit.png"),
  starfruit: require("./assets/plants/starfruit.png"),
  coconut: require("./assets/plants/coconut.png"),
  capegooseberry: require("./assets/plants/capegooseberry.png"),
  rambutan: require("./assets/plants/rambutan.png"),
  longan: require("./assets/plants/longan.png"),
  tamarind: require("./assets/plants/tamarind.png"),
  cantaloupe: require("./assets/plants/cantaloupe.png"),
  casabamelon: require("./assets/plants/casabamelon.png"),
  crenshawmelon: require("./assets/plants/crenshawmelon.png"),
  bittermelon: require("./assets/plants/bittermelon.png"),
  wintermelon: require("./assets/plants/wintermelon.png"),
  galiamelon: require("./assets/plants/galiamelon.png"),
  huckleberry: require("./assets/plants/huckleberry.png"),
  lingonberry: require("./assets/plants/lingonberry.png"),
  salmonberry: require("./assets/plants/salmonberry.png"),
  aronia: require("./assets/plants/aronia.png"),
  gojiberry: require("./assets/plants/gojiberry.png"),
  barberry: require("./assets/plants/barberry.png"),
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
  wateringHistory: "pp_wateringHistory",
  harvestTrackers: "pp_harvestTrackers",
  wateringReminders: "pp_wateringReminders",
  fertilizerTrackers: "pp_fertilizerTrackers",
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
  Tomato: {
    excellent: ["Basil", "Onion", "Lettuce", "Carrot", "Marigold"],
    neutral: ["Pepper", "Spinach"],
    avoid: ["Potato", "Corn", "Cabbage", "Fennel", "Beet"],
    pests: "Basil repels tomato hornworms and aphids. Marigolds deter nematodes and whiteflies near tomato roots.",
  },
  Potato: {
    excellent: ["Bean", "Pea", "Horseradish"],
    neutral: ["Corn", "Cabbage"],
    avoid: ["Tomato", "Pumpkin", "Cucumber", "Sunflower", "Raspberry"],
    pests: "Horseradish planted at corners may help repel Colorado potato beetles.",
  },
  Carrot: {
    excellent: ["Tomato", "Onion", "Lettuce", "Rosemary", "Sage"],
    neutral: ["Pepper", "Radish"],
    avoid: ["Dill", "Parsnip", "Beet"],
    pests: "Onions and rosemary may help deter carrot flies when planted nearby.",
  },
  Pepper: {
    excellent: ["Tomato", "Basil", "Onion", "Carrot"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Fennel", "Kohlrabi", "Apricot"],
    pests: "Basil may reduce aphids and spider mites near pepper plants.",
  },
  Onion: {
    excellent: ["Carrot", "Tomato", "Lettuce", "Strawberry", "Beet"],
    neutral: ["Pepper", "Spinach"],
    avoid: ["Bean", "Pea", "Sage", "Asparagus"],
    pests: "Onions naturally deter aphids, carrot flies, and rabbits when planted as a border.",
  },
  Lettuce: {
    excellent: ["Carrot", "Onion", "Strawberry", "Radish", "Cucumber"],
    neutral: ["Spinach", "Beet"],
    avoid: ["Parsley", "Celery", "Broccoli"],
    pests: "Lettuce benefits from shade provided by taller companions in hot climates.",
  },
  Corn: {
    excellent: ["Bean", "Pumpkin", "Squash", "Cucumber"],
    neutral: ["Pea", "Sunflower"],
    avoid: ["Tomato", "Celery", "Beet"],
    pests: "The Three Sisters method — corn, beans, and squash — is one of the most effective companion combinations.",
  },
  Basil: {
    excellent: ["Tomato", "Pepper", "Oregano"],
    neutral: ["Lettuce", "Carrot"],
    avoid: ["Sage", "Thyme", "Fennel", "Cucumber"],
    pests: "Basil repels aphids, whiteflies, and tomato hornworms. Avoid planting near sage as they inhibit each other.",
  },
  Cucumber: {
    excellent: ["Bean", "Pea", "Radish", "Sunflower", "Lettuce"],
    neutral: ["Corn", "Onion"],
    avoid: ["Potato", "Sage", "Basil", "Rosemary"],
    pests: "Radishes planted nearby may deter cucumber beetles effectively.",
  },
  Spinach: {
    excellent: ["Strawberry", "Pea", "Bean", "Celery"],
    neutral: ["Onion", "Lettuce"],
    avoid: ["Potato", "Fennel"],
    pests: "Spinach grows well under taller plants and benefits from light shade in warmer months.",
  },
  Pea: {
    excellent: ["Carrot", "Radish", "Spinach", "Lettuce", "Corn"],
    neutral: ["Bean", "Cucumber"],
    avoid: ["Onion", "Garlic", "Leek", "Potato"],
    pests: "Peas fix nitrogen in the soil which benefits nearby plants after harvest.",
  },
  Bean: {
    excellent: ["Corn", "Pea", "Carrot", "Cucumber", "Strawberry"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Onion", "Garlic", "Fennel", "Beet"],
    pests: "Beans fix nitrogen naturally and improve soil for surrounding plants.",
  },
  Strawberry: {
    excellent: ["Onion", "Lettuce", "Spinach", "Bean", "Borage"],
    neutral: ["Carrot", "Radish"],
    avoid: ["Cabbage", "Broccoli", "Cauliflower", "Fennel"],
    pests: "Borage attracts pollinators and may improve strawberry flavor and yield.",
  },
  Cabbage: {
    excellent: ["Onion", "Celery", "Potato", "Dill"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Strawberry", "Tomato", "Pepper", "Grape"],
    pests: "Dill and celery attract beneficial wasps that prey on cabbage caterpillars.",
  },
  Broccoli: {
    excellent: ["Onion", "Celery", "Potato", "Rosemary"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Tomato", "Strawberry", "Pepper"],
    pests: "Rosemary deters cabbage moths and bean beetles near broccoli plants.",
  },
  Cauliflower: {
    excellent: ["Onion", "Celery", "Bean"],
    neutral: ["Spinach", "Carrot"],
    avoid: ["Tomato", "Strawberry", "Pepper"],
    pests: "Celery may repel white cabbage moths when planted near cauliflower.",
  },
  Garlic: {
    excellent: ["Tomato", "Pepper", "Carrot", "Strawberry", "Rose"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Pea", "Bean", "Asparagus", "Parsley"],
    pests: "Garlic is a natural pest deterrent and may repel aphids, spider mites, and Japanese beetles.",
  },
  Radish: {
    excellent: ["Carrot", "Lettuce", "Cucumber", "Pea", "Spinach"],
    neutral: ["Bean", "Corn"],
    avoid: ["Hyssop", "Grape"],
    pests: "Radishes act as trap crops for flea beetles, drawing them away from other vegetables.",
  },
  Kale: {
    excellent: ["Onion", "Celery", "Potato", "Beet"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Tomato", "Strawberry", "Bean"],
    pests: "Onions and celery planted near kale help deter aphids and cabbage worms.",
  },
  Beet: {
    excellent: ["Onion", "Lettuce", "Cabbage", "Kale"],
    neutral: ["Carrot", "Radish"],
    avoid: ["Bean", "Corn", "Tomato"],
    pests: "Beets and onions are classic companions — they improve each other's growth and flavor.",
  },
  Pumpkin: {
    excellent: ["Corn", "Bean", "Nasturtium"],
    neutral: ["Radish", "Sunflower"],
    avoid: ["Potato", "Beet", "Onion"],
    pests: "Nasturtiums act as trap crops for aphids and attract beneficial predatory insects.",
  },
  Watermelon: {
    excellent: ["Corn", "Sunflower", "Nasturtium"],
    neutral: ["Radish", "Lettuce"],
    avoid: ["Potato", "Cucumber", "Zucchini"],
    pests: "Nasturtiums planted nearby attract aphids away from watermelon vines.",
  },
  Zucchini: {
    excellent: ["Corn", "Bean", "Nasturtium", "Oregano"],
    neutral: ["Radish", "Spinach"],
    avoid: ["Potato", "Watermelon", "Pumpkin"],
    pests: "Oregano planted nearby may deter squash bugs and aphids from zucchini.",
  },
  Eggplant: {
    excellent: ["Basil", "Pepper", "Spinach", "Tarragon"],
    neutral: ["Lettuce", "Onion"],
    avoid: ["Fennel", "Corn"],
    pests: "Basil and tarragon planted near eggplant may repel aphids and flea beetles.",
  },
  Celery: {
    excellent: ["Tomato", "Cabbage", "Onion", "Bean"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Corn", "Potato", "Aster"],
    pests: "Celery attracts beneficial wasps and repels white cabbage moths near brassicas.",
  },
  Rosemary: {
    excellent: ["Carrot", "Bean", "Cabbage", "Sage"],
    neutral: ["Tomato", "Pepper"],
    avoid: ["Basil", "Cucumber", "Pumpkin"],
    pests: "Rosemary deters bean beetles, cabbage moths, and carrot flies naturally.",
  },
  Thyme: {
    excellent: ["Cabbage", "Tomato", "Eggplant", "Strawberry"],
    neutral: ["Pepper", "Carrot"],
    avoid: ["Basil", "Cucumber"],
    pests: "Thyme repels cabbage worms and whiteflies and attracts beneficial pollinators.",
  },
  Mint: {
    excellent: ["Cabbage", "Tomato", "Pea", "Carrot"],
    neutral: ["Lettuce", "Spinach"],
    avoid: ["Parsley", "Chamomile"],
    pests: "Mint deters aphids, ants, and flea beetles but spreads aggressively — grow in containers.",
  },
  Cilantro: {
    excellent: ["Spinach", "Lettuce", "Tomato", "Bean"],
    neutral: ["Carrot", "Pepper"],
    avoid: ["Fennel", "Dill"],
    pests: "Cilantro attracts beneficial insects including lacewings and parasitic wasps.",
  },
  Parsley: {
    excellent: ["Tomato", "Asparagus", "Corn", "Pepper"],
    neutral: ["Carrot", "Onion"],
    avoid: ["Lettuce", "Mint"],
    pests: "Parsley attracts predatory wasps and hoverflies that feed on garden pests.",
  },
  Fennel: {
    excellent: ["Dill"],
    neutral: [],
    avoid: ["Tomato", "Pepper", "Basil", "Carrot", "Bean", "Cucumber", "Pumpkin"],
    pests: "Fennel is allelopathic — it inhibits the growth of most nearby vegetables. Grow it in isolation.",
  },
  Leek: {
    excellent: ["Carrot", "Onion", "Celery"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Bean", "Pea", "Broccoli"],
    pests: "Leeks and carrots are classic companions — they deter each other's primary pests.",
  },
  Okra: {
    excellent: ["Pepper", "Eggplant", "Melon", "Sunflower"],
    neutral: ["Cucumber", "Corn"],
    avoid: ["Squash", "Tomato"],
    pests: "Okra and peppers share similar growing conditions and complement each other well.",
  },
  Blueberry: {
    excellent: ["Strawberry", "Thyme", "Basil"],
    neutral: ["Pepper", "Tomato"],
    avoid: ["Fennel", "Garlic", "Pepper"],
    pests: "Thyme planted near blueberries attracts pollinators and may improve berry yield.",
  },
  Raspberry: {
    excellent: ["Marigold", "Garlic", "Tansy"],
    neutral: ["Strawberry", "Bean"],
    avoid: ["Potato", "Tomato", "Blackberry"],
    pests: "Garlic planted nearby deters Japanese beetles and aphids from raspberry canes.",
  },
  Apple: {
    excellent: ["Chive", "Nasturtium", "Marigold"],
    neutral: ["Garlic", "Onion"],
    avoid: ["Potato", "Grass", "Walnut"],
    pests: "Chives planted under apple trees may reduce apple scab and repel aphids.",
  },
  Peach: {
    excellent: ["Garlic", "Tansy", "Basil"],
    neutral: ["Onion", "Marigold"],
    avoid: ["Raspberry", "Tomato", "Potato"],
    pests: "Tansy deters borers and flying insects that commonly damage peach trees.",
  },
  Lemon: {
    excellent: ["Basil", "Lavender", "Marigold"],
    neutral: ["Thyme", "Rosemary"],
    avoid: ["Fennel", "Mint"],
    pests: "Lavender and basil near citrus trees attract beneficial insects and repel aphids.",
  },
  Orange: {
    excellent: ["Basil", "Lavender", "Marigold"],
    neutral: ["Thyme", "Rosemary"],
    avoid: ["Fennel", "Mint"],
    pests: "Marigolds planted around citrus deter nematodes and whiteflies in the root zone.",
  },
};

function getCompanionInfo(plantName) {
  const match = Object.keys(COMPANION_PLANTING_DATA).find((name) =>
    String(plantName || "").toLowerCase().includes(name.toLowerCase())
  );
  return COMPANION_PLANTING_DATA[match] || {
    excellent: ["Basil", "Marigold", "Nasturtium"],
    neutral: ["Lettuce", "Spinach"],
    avoid: ["Fennel"],
    pests: "Companion planting can improve pollination, reduce pests, and increase garden health.",
  };
}

// Pair-specific explanations. Keyed by the two plant names sorted alphabetically,
// lowercased, joined with "|". Falls back to a generic line when a pair isn't listed.
const PAIR_REASONS = {
  "basil|tomato": "Basil repels aphids and hornworms, and many gardeners say it improves tomato flavor.",
  "basil|pepper": "Basil masks the scent peppers give off, helping hide them from aphids and thrips.",
  "basil|oregano": "Both are aromatic herbs with the same water and sun needs — easy neighbors.",
  "carrot|onion": "Onions deter carrot flies, and carrots return the favor against onion flies.",
  "carrot|lettuce": "Lettuce shades the soil and keeps carrot roots cool and moist.",
  "carrot|tomato": "Tomatoes give carrots afternoon shade; carrots loosen the soil around the roots.",
  "onion|lettuce": "Onions keep aphids and rabbits away from tender lettuce leaves.",
  "onion|strawberry": "Onions deter slugs and rabbits that would otherwise go after ripe berries.",
  "onion|beet": "Classic pairing — they improve each other's growth and flavor.",
  "onion|tomato": "Onions repel aphids and spider mites that target tomato foliage.",
  "bean|corn": "Beans climb the corn stalks and fix nitrogen back into the soil — half of the Three Sisters.",
  "corn|squash": "Squash leaves shade the ground, block weeds, and hold soil moisture for the corn.",
  "corn|pumpkin": "Pumpkin vines cover the soil and deter raccoons from getting at the corn.",
  "corn|cucumber": "Corn gives cucumber vines something to climb and provides light shade.",
  "cucumber|radish": "Radishes deter cucumber beetles when planted alongside.",
  "cucumber|lettuce": "Cucumbers grow tall and shade lettuce, keeping it from bolting in the heat.",
  "lettuce|radish": "Radishes break up the soil and are harvested before lettuce needs the room.",
  "lettuce|strawberry": "Both are shallow-rooted, low growers that cover soil without competing.",
  "marigold|tomato": "Marigolds deter nematodes and whiteflies in the tomato root zone.",
  "marigold|pepper": "Marigolds pull aphids away from peppers and attract beneficial insects.",
  "nasturtium|pea": "Nasturtiums attract beneficial insects and pull aphids off the pea vines.",
  "nasturtium|cucumber": "Nasturtiums act as a trap crop for cucumber beetles and squash bugs.",
  "beet|lettuce": "Beets grow down, lettuce grows out — they use different layers of the bed.",
  "pepper|tomato": "Same soil, sun, and water needs, so they're easy to care for side by side.",
  "spinach|strawberry": "Spinach covers the soil between berry plants and keeps weeds down.",
  // Conflicts — worth explaining, not just flagging
  "basil|sage": "Basil and sage inhibit each other's growth — give them separate beds.",
  "basil|cucumber": "Cucumbers can stunt basil, and both compete hard for water.",
  "bean|onion": "Onions release compounds that stunt bean growth.",
  "onion|pea": "Onions suppress pea growth — keep them well apart.",
  "corn|tomato": "They attract the same worm pests and compete heavily for nitrogen.",
  "fennel|tomato": "Fennel inhibits nearly everything around it. Give it its own corner.",
  "broccoli|lettuce": "Broccoli is a heavy feeder that will outcompete lettuce for nutrients.",
"apple|chive": "Chives under apple trees deter aphids and may reduce apple scab.",
  "apple|marigold": "Marigolds near apples repel aphids and draw in beneficial insects.",
  "apple|nasturtium": "Nasturtiums lure aphids and codling moths away from apple trees.",
  "asparagus|parsley": "Parsley attracts predators that protect asparagus from beetles.",
  "basil|blueberry": "Basil's aroma repels thrips and flies that bother blueberries.",
  "basil|eggplant": "Basil masks eggplant's scent from flea beetles and aphids.",
  "basil|lemon": "Basil repels aphids and mites that trouble potted lemon trees.",
  "basil|orange": "Basil's scent deters aphids and mites around citrus.",
  "basil|peach": "Basil repels aphids and helps protect peach foliage from pests.",
  "bean|carrot": "Beans fix nitrogen for the carrots while their roots work different depths.",
  "bean|cauliflower": "Beans enrich the soil with nitrogen that heavy-feeding cauliflower needs.",
  "bean|celery": "Beans feed nitrogen to the soil while celery shades their roots.",
  "bean|cilantro": "Cilantro's flowers attract predators of the aphids that target beans.",
  "bean|cucumber": "Beans fix nitrogen in the soil that hungry cucumbers draw from.",
  "bean|pea": "Both fix their own nitrogen, so they share a bed without competing for it.",
  "bean|potato": "Beans add nitrogen and help deter the Colorado potato beetle.",
  "bean|pumpkin": "A three-sisters pairing — beans feed the soil pumpkins sprawl across.",
  "bean|rosemary": "Rosemary's scent repels the bean beetle from the row.",
  "bean|spinach": "Beans give spinach nitrogen; spinach shades the soil to hold moisture.",
  "bean|strawberry": "Beans enrich the bed while strawberries cover and cool the soil.",
  "bean|zucchini": "Beans fix nitrogen that feeds zucchini's heavy appetite.",
  "beet|cabbage": "Beets and cabbage feed at different depths, so they don't compete.",
  "beet|kale": "Beets loosen the soil below while kale shades it above.",
  "beet|onion": "Onions deter pests while beets and onions root at different depths.",
  "blueberry|strawberry": "Both love acidic soil and cover the ground without competing.",
  "blueberry|thyme": "Thyme covers soil around blueberries and draws in pollinators.",
  "borage|strawberry": "Borage attracts pollinators and is said to boost strawberry flavor.",
  "broccoli|celery": "Celery's scent helps deter the cabbage moths that target broccoli.",
  "broccoli|onion": "Onions mask broccoli's scent from cabbage worms and aphids.",
  "broccoli|potato": "Both are cool-season crops that share similar timing and care.",
  "broccoli|rosemary": "Rosemary repels the cabbage moths and beetles that attack broccoli.",
  "cabbage|celery": "Celery deters the cabbage white moth from the bed.",
  "cabbage|dill": "Dill attracts wasps that prey on cabbage worms.",
  "cabbage|mint": "Mint's strong scent repels cabbage moths and flea beetles.",
  "cabbage|onion": "Onions mask cabbage's scent from moths and aphids.",
  "cabbage|potato": "Both are cool-season crops with compatible care needs.",
  "cabbage|rosemary": "Rosemary repels cabbage moths and beetles nearby.",
  "cabbage|thyme": "Thyme deters cabbage worms and draws beneficial insects.",
  "carrot|garlic": "Garlic's scent drives off the carrot fly.",
  "carrot|leek": "Leeks repel carrot flies while carrots repel leek moths.",
  "carrot|mint": "Mint masks the carrot scent that attracts carrot flies.",
  "carrot|pea": "Peas enrich the soil with nitrogen while carrots break it up below.",
  "carrot|pepper": "Carrots loosen soil around pepper roots and use different space.",
  "carrot|radish": "Radishes mark the row and loosen soil for slow carrots.",
  "carrot|rosemary": "Rosemary's scent confuses and repels the carrot fly.",
  "carrot|sage": "Sage repels the carrot fly with its strong aroma.",
  "cauliflower|celery": "Celery helps deter the cabbage moths that target cauliflower.",
  "cauliflower|onion": "Onions mask cauliflower's scent from pests.",
  "celery|kale": "Celery's aroma deters the cabbage worms that feed on kale.",
  "celery|leek": "Leeks and celery deter each other's pests and root differently.",
  "celery|onion": "Onions deter aphids while celery uses different bed space.",
  "celery|spinach": "Spinach shades the soil to keep celery's roots cool and moist.",
  "celery|tomato": "Celery grows low beneath tomatoes, using space they don't.",
  "cilantro|lettuce": "Cilantro's flowers attract predators of lettuce aphids.",
  "cilantro|spinach": "Both are cool-season greens that share the same care.",
  "cilantro|tomato": "Cilantro draws in beneficial insects that protect tomatoes.",
  "corn|parsley": "Parsley attracts wasps that prey on corn earworms.",
  "corn|pea": "Peas climb the stalks and leave nitrogen behind for the corn.",
  "corn|watermelon": "Corn gives sprawling watermelon vines light afternoon shade.",
  "corn|zucchini": "A three-sisters pairing — zucchini shades roots while corn stands tall.",
  "cucumber|pea": "Peas fix nitrogen that feeds hungry cucumber vines.",
  "cucumber|sunflower": "Sunflowers give cucumbers a natural trellis and light shade.",
  "dill|fennel": "Both umbel herbs draw the same pollinators and predatory wasps.",
  "eggplant|okra": "Okra shelters eggplant from wind and shares warm-season care.",
  "eggplant|pepper": "Same soil, sun, and water needs make them easy neighbors.",
  "eggplant|spinach": "Spinach shades the soil beneath taller eggplant.",
  "eggplant|tarragon": "Tarragon's scent helps repel pests from eggplant.",
  "eggplant|thyme": "Thyme deters the flea beetles that chew eggplant leaves.",
  "garlic|peach": "Garlic deters borers and aphids around peach trees.",
  "garlic|pepper": "Garlic repels aphids and spider mites from peppers.",
  "garlic|raspberry": "Garlic deters the Japanese beetles and aphids that hit raspberries.",
  "garlic|rose": "Garlic repels aphids and helps fend off black spot on roses.",
  "garlic|strawberry": "Garlic's scent protects strawberries from aphids and mites.",
  "garlic|tomato": "Garlic repels red spider mites and aphids from tomatoes.",
  "horseradish|potato": "Horseradish at the corners deters Colorado potato beetles.",
  "kale|onion": "Onions mask kale's scent from cabbage worms and aphids.",
  "kale|potato": "Both are cool-season crops that tolerate each other well.",
  "lavender|lemon": "Lavender draws pollinators and repels aphids around citrus.",
  "lavender|orange": "Lavender attracts pollinators and deters pests near orange trees.",
  "leek|onion": "Both alliums deter the same pests and share care needs.",
  "lemon|marigold": "Marigolds deter nematodes and whiteflies in the citrus root zone.",
  "lettuce|onion": "Onions deter aphids while lettuce fills the space between.",
  "lettuce|pea": "Peas give nitrogen and light shade to tender lettuce.",
  "lettuce|tomato": "Lettuce covers the soil beneath tomatoes and keeps it cool.",
  "marigold|orange": "Marigolds deter nematodes and whiteflies around citrus roots.",
  "marigold|raspberry": "Marigolds repel nematodes and beetles from raspberry canes.",
  "melon|okra": "Okra gives sprawling melon light shade and wind shelter.",
  "mint|pea": "Mint repels the aphids that would otherwise cluster on pea vines.",
  "mint|tomato": "Mint's scent deters aphids and whiteflies around tomatoes.",
  "nasturtium|pumpkin": "Nasturtiums act as a trap crop for squash bugs and beetles.",
  "nasturtium|watermelon": "Nasturtiums lure aphids and beetles away from melon vines.",
  "nasturtium|zucchini": "Nasturtiums draw squash bugs away from zucchini as a trap crop.",
  "okra|pepper": "Both love heat and shelter each other from wind.",
  "okra|sunflower": "Okra and sunflowers stand tall together and draw in pollinators.",
  "onion|pepper": "Onions deter aphids and share peppers' steady watering rhythm.",
  "oregano|zucchini": "Oregano repels squash bugs and aphids from zucchini.",
  "parsley|pepper": "Parsley attracts the predatory insects that protect peppers.",
  "parsley|tomato": "Parsley draws in hoverflies and wasps that guard tomatoes.",
  "peach|tansy": "Tansy repels borers and flying insects from peach trees.",
  "pea|potato": "Peas fix nitrogen that feeds the developing potato tubers.",
  "pea|radish": "Radishes loosen soil and mark rows for climbing peas.",
  "pea|spinach": "Peas give nitrogen and light shade to leafy spinach.",
  "radish|spinach": "Radishes break up the soil while spinach shades it above.",
  "raspberry|tansy": "Tansy repels beetles and ants from raspberry canes.",
  "rosemary|sage": "Both Mediterranean herbs share dry soil and repel pests.",
  "strawberry|thyme": "Thyme covers soil around strawberries and deters worms.",
  "sunflower|watermelon": "Sunflowers give melon vines a trellis and light shade.",
  "thyme|tomato": "Thyme's scent deters worms and draws pollinators to tomatoes.",
};

function getPairReason(a, b) {
  const key = [String(a || ""), String(b || "")]
    .map((s) => s.trim().toLowerCase())
    .sort()
    .join("|");
  if (PAIR_REASONS[key]) return PAIR_REASONS[key];
  const score = getCompatibilityScore(a, b);
  if (score.label === "Excellent Pair") return `${a} and ${b} grow well together and support each other in the same bed.`;
  if (score.label === "Avoid") return `${a} and ${b} compete for nutrients or attract the same pests — try separate beds.`;
  return `${a} and ${b} coexist fine — no known conflict.`;
}
// Find every "Avoid" pair sitting together in the same bed, and for each,
// propose the best single move that removes the conflict without creating a new one.
function findGardenConflicts(gardenAreas) {
  const areas = (gardenAreas || []).filter((a) => a.plots && Object.keys(a.plots).length);

  // Helper: does adding `plantName` to `area` create any "Avoid" pair?
  const wouldConflict = (area, plantName, ignoreSlot) => {
    const neighbors = Object.entries(area.plots || {})
      .filter(([sid, name]) => sid !== ignoreSlot && name && name !== plantName)
      .map(([, name]) => name);
    return Array.from(new Set(neighbors)).some(
      (n) => getCompatibilityScore(plantName, n).label === "Avoid"
    );
  };

  // Helper: an area has a free slot if its plot count is below its capacity.
  // Capacity: use area.size if present, else fall back to current filled count + 1
  // (i.e. we only treat an area as "has room" if it declares a size with space left).
  const freeSlotId = (area) => {
    const filled = Object.entries(area.plots || {}).filter(([, n]) => n);
    const capacity = typeof area.size === "number" ? area.size : filled.length; // no declared size => treat as full
    if (filled.length >= capacity) return null;
    // Find the first slot index (0..capacity-1) not already used.
    const used = new Set(filled.map(([sid]) => sid));
    for (let i = 0; i < capacity; i++) {
      const key = String(i);
      if (!used.has(key)) return key;
    }
    return null;
  };

  const conflicts = [];
  const seenPairs = new Set();

  areas.forEach((area) => {
    const entries = Object.entries(area.plots || {}).filter(([, n]) => n);
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const [slotA, plantA] = entries[i];
        const [slotB, plantB] = entries[j];
        if (getCompatibilityScore(plantA, plantB).label !== "Avoid") continue;

        // De-dupe symmetric pairs within the same area.
        const pairKey = `${area.id}|${[plantA, plantB].sort().join("|")}`;
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        // Try to relocate one of the two plants to another bed with room and no new conflict.
        let suggestion = null;
        for (const mover of [
          { slot: slotA, plant: plantA, stays: plantB },
          { slot: slotB, plant: plantB, stays: plantA },
        ]) {
          const target = areas.find(
            (dest) =>
              dest.id !== area.id &&
              freeSlotId(dest) !== null &&
              !wouldConflict(dest, mover.plant, null)
          );
          if (target) {
            suggestion = {
              move: mover.plant,
              fromAreaId: area.id,
              fromAreaName: area.name,
              fromSlot: mover.slot,
              toAreaId: target.id,
              toAreaName: target.name,
              toSlot: freeSlotId(target),
              stays: mover.stays,
            };
            break;
          }
        }

        conflicts.push({
          areaId: area.id,
          areaName: area.name,
          plantA,
          plantB,
          suggestion, // may be null if no clean destination exists
        });
      }
    }
  });

  return conflicts;
}

function getCompatibilityScore(plantName, comparePlant) {
  const info = getCompanionInfo(plantName);
  if (info.excellent.some((item) => item.toLowerCase() === comparePlant.toLowerCase())) return { label: "Excellent Pair", color: "#5cff89", icon: "🟢" };
  if (info.avoid.some((item) => item.toLowerCase() === comparePlant.toLowerCase())) return { label: "Avoid", color: "#ff7b7b", icon: "🔴" };
  return { label: "Neutral", color: "#ffd86b", icon: "🟡" };
}
function calculateGardenHealth(gardenMap) {
  const plants = Object.values(gardenMap || {}).filter(Boolean);
  if (!plants.length) return { score: 0, label: "No plants yet" };
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

function getPlantSunNeed(item) {
  const type = normalizeType(item?.type, item?.name);
  const name = String(item?.name || "").toLowerCase();

  // Leafy greens and some herbs tolerate — and in summer heat prefer — some shade.
  if (["lettuce", "spinach", "kale", "arugula", "chard", "cilantro", "parsley", "mint"].some((w) => name.includes(w))) {
    return { need: "partial", label: "Partial shade OK", toleratesShade: true };
  }
  if (type === "Herbs") {
    return { need: "partial", label: "Full sun to partial", toleratesShade: true };
  }
  // Fruiting crops and trees want full sun to produce.
  return { need: "full", label: "Full sun", toleratesShade: false };
}

// Compares what a plant wants against what an area provides.
// Returns a warning object only when there's a real mismatch worth flagging.
function getSunMismatch(item, areaSun) {
  const sun = areaSun || "full";
  const { need, toleratesShade } = getPlantSunNeed(item);
  const name = item?.name || "This plant";

  if (sun === "shade" && need === "full") {
    return { level: "high", text: `${name} needs full sun to fruit — a shade bed will give weak, leggy growth and little harvest.` };
  }
  if (sun === "partial" && need === "full") {
    return { level: "medium", text: `${name} prefers full sun. In partial shade expect slower growth and a lighter harvest.` };
  }
  if (sun === "full" && need === "partial" && !toleratesShade) {
    return { level: "low", text: `${name} can take full sun, but watch for stress on the hottest afternoons.` };
  }
  // Leafy greens in full sun during summer heat bolt fast — worth a gentle flag.
  if (sun === "full" && toleratesShade) {
    return { level: "low", text: `${name} does fine in full sun, but in peak summer heat it may bolt — some afternoon shade helps.` };
  }
  return null; // good match, no warning
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

const RAIN_SKIP_THRESHOLD = 65;
function getRainSkipToday(weather) {
  // Rain-skip disabled — the daily watering reminder always fires at the set time.
  return null;
}

const FROST_THRESHOLD_F = 35;
function getUpcomingFrost(weather) {
  const forecast = Array.isArray(weather?.forecast) ? weather.forecast : [];
  for (let i = 0; i < forecast.length; i += 1) {
    const day = forecast[i];
    if (typeof day?.minTempF === "number" && day.minTempF <= FROST_THRESHOLD_F) {
      return { date: day.date, minTempF: day.minTempF, daysOut: i };
    }
  }
  return null;
}
function getFrostSeasonMonths(zone) {
  const bucket = getClimateBucket(zone);
  if (bucket === "cold") return [1, 2, 3, 4, 5, 9, 10, 11, 12];
  if (bucket === "moderate") return [1, 2, 3, 11, 12];
  return [12, 1, 2];
}
function getEstimatedLastFrost(zone) {
  const bucket = getClimateBucket(zone);
  if (bucket === "cold") return "late May";
  if (bucket === "moderate") return "mid March";
  return "late January";
}
// User-set frost overrides, mirrored here so the pure date helpers can read them
// without threading props through every call site. Shape: { lastFrost: "MM-DD", firstFrost: "MM-DD" }.
const frostOverrideRef = { current: {} };
function setFrostOverrideRef(obj) {
  frostOverrideRef.current = obj && typeof obj === "object" ? obj : {};
}
function parseFrostOverride(mmdd) {
  if (!mmdd || typeof mmdd !== "string") return null;
  const m = mmdd.match(/^(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;
  const month = parseInt(m[1], 10) - 1;
  const day = parseInt(m[2], 10);
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  return new Date(new Date().getFullYear(), month, day);
}
function getLastFrostDate(zone) {
  const override = parseFrostOverride(frostOverrideRef.current?.lastFrost);
  if (override) return override;
  const bucket = getClimateBucket(zone);
  const year = new Date().getFullYear();
  if (bucket === "cold") return new Date(year, 4, 25);      // ~late May
  if (bucket === "moderate") return new Date(year, 2, 15);  // ~mid March
  return new Date(year, 0, 25);                             // ~late January (hot)
}
function getFirstFrostDate(zone) {
  const override = parseFrostOverride(frostOverrideRef.current?.firstFrost);
  if (override) return override;
  // Estimated FALL first-frost date by climate bucket.
  const bucket = getClimateBucket(zone);
  const year = new Date().getFullYear();
  if (bucket === "cold") return new Date(year, 8, 25);      // ~late September
  if (bucket === "moderate") return new Date(year, 10, 15); // ~mid November
  return new Date(year, 11, 5);                             // ~early December (hot)
}
function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
function getDaylightHours(lat, date = new Date()) {
  // Sunrise equation — returns daylight length in hours for a given latitude.
  const n = dayOfYear(date);
  const latRad = (lat * Math.PI) / 180;
  // Solar declination (radians)
  const decl = 0.4093 * Math.sin((2 * Math.PI / 365) * (n - 81));
  const cosH = -Math.tan(latRad) * Math.tan(decl);
  // Polar day / polar night guards
  if (cosH <= -1) return 24;
  if (cosH >= 1) return 0;
  const H = Math.acos(cosH); // half-day angle (radians)
  return (2 * H * 24) / (2 * Math.PI);
}
function getDaylightInfo(coords) {
  const lat = parseFloat(coords?.lat);
  if (Number.isNaN(lat)) return null;
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const hoursToday = getDaylightHours(lat, today);
  const hoursYesterday = getDaylightHours(lat, yesterday);
  const deltaMin = Math.round((hoursToday - hoursYesterday) * 60);
  const h = Math.floor(hoursToday);
  const m = Math.round((hoursToday - h) * 60);
  return {
    label: `${h}h ${String(m).padStart(2, "0")}m`,
    gaining: deltaMin >= 0,
    deltaMin: Math.abs(deltaMin),
    hours: hoursToday,
    // Long days (>14h) push cool-season greens to bolt; short days (<10h) stall growth.
    shortDay: hoursToday < 10,
    longDay: hoursToday > 14,
  };
}
function getFrostMaturityInfo(item, zone) {
  if (!zone) return null;
  const days = parseInt(String(getHarvestCountdown(item)).match(/\d+/)?.[0], 10) || 75;
  const firstFrost = getFirstFrostDate(zone);
  const now = new Date(); now.setHours(12, 0, 0, 0);
  const daysUntilFrost = Math.round((firstFrost - now) / (1000 * 60 * 60 * 24));
  if (daysUntilFrost <= 0) return null; // already in/after frost season
  const short = days - daysUntilFrost;
  return { days, daysUntilFrost, short, atRisk: short > 0 };
}
function getSeedStartWeeks(item) {
  const name = String(item?.name || "").toLowerCase();
  const type = normalizeType(item.type, item.name);
  if (["tomato", "pepper", "eggplant"].some((w) => name.includes(w))) return 8;
  if (["celery"].some((w) => name.includes(w))) return 10;
  if (["broccoli", "cabbage", "cauliflower", "kale"].some((w) => name.includes(w))) return 6;
  if (["basil", "parsley", "thyme", "rosemary", "cilantro"].some((w) => name.includes(w))) return 6;
  if (type === "Tree Fruits" || type === "Tropical Fruits") return null; // buy transplants
  return null; // most veg/berries direct-sow
}
function getSeedStartInfo(item, zone) {
  const weeks = getSeedStartWeeks(item);
  if (!weeks || !zone) return null;
  const lastFrost = getLastFrostDate(zone);
  const startBy = new Date(lastFrost);
  startBy.setDate(startBy.getDate() - weeks * 7);
  const now = new Date(); now.setHours(12, 0, 0, 0);
  const startClone = new Date(startBy); startClone.setHours(12, 0, 0, 0);
  const daysUntilStart = Math.round((startClone - now) / (1000 * 60 * 60 * 24));
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  let status;
  if (daysUntilStart > 21) status = "upcoming";
  else if (daysUntilStart >= -14) status = "start-now";
  else status = "passed";
  return {
    weeks, startBy, lastFrost, daysUntilStart, status,
    startByLabel: fmt(startBy), transplantLabel: fmt(lastFrost),
  };
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
  const difficulty = getPlantDifficulty(item);
  const type = normalizeType(item.type, item.name);
  const name = String(item.name || "").toLowerCase();
  const climate = getClimateBucket(zone);

  if (seasonLabel === "Outside your zone") {
    if (type === "Tropical Fruits") return `${item.name} thrives in warm tropical climates and struggles in zones below 9. In cooler zones consider growing in a large container that can be moved indoors during cold months.`;
    if (type === "Tree Fruits") return `${item.name} grows best outside your current zone. Check with a local nursery about cold-hardy varieties that may work in your area.`;
    return `${item.name} is typically grown outside your current zone. You may still have success with containers, raised beds, or a greenhouse setup depending on your microclimate.`;
  }

  if (weather?.minTempF <= 35) {
    return `${item.name} is a good fit for your zone but frost is in the forecast. Hold off on transplanting outdoors until overnight lows stay consistently above 40°F. Starting seeds indoors now is a great option.`;
  }

  if (weather?.maxTempF >= 98) {
    if (name.includes("lettuce") || name.includes("spinach") || name.includes("pea") || name.includes("radish")) {
      return `${item.name} prefers cooler temperatures and will struggle in the current heat. Wait for temperatures to drop below 80°F or plant in a shaded spot with morning sun only.`;
    }
    if (name.includes("tomato") || name.includes("pepper") || name.includes("eggplant") || name.includes("watermelon")) {
      return `${item.name} loves heat and is a strong performer in your zone. Plant early morning, water deeply, and mulch heavily to protect roots during peak afternoon heat.`;
    }
    return `${item.name} can handle warm conditions but the current heat is high. Water deeply in the morning, add mulch, and avoid transplanting during the hottest part of the day.`;
  }

  // Zone and season specific
  if (climate === "hot") {
    if (name.includes("tomato")) return "Tomatoes thrive in hot zones but need consistent deep watering and mulching to survive summer heat. Choose heat-tolerant varieties like Solar Fire or Heatmaster for best results in warm climates.";
    if (name.includes("pepper")) return "Peppers are one of the best vegetables for hot zones — they love the heat and produce abundantly in warm climates. Water consistently and expect a long productive season.";
    if (name.includes("basil")) return "Basil thrives in hot sunny conditions making it perfect for your zone. Plant after last frost in full sun and pinch flowers regularly to keep leaves flavorful all season.";
    if (name.includes("watermelon")) return "Watermelon is an excellent choice for hot zones — the heat accelerates growth and sweetness. Give plants plenty of space, deep water weekly, and expect a rewarding harvest.";
    if (name.includes("okra")) return "Okra is one of the best vegetables for hot climates and practically thrives on neglect in warm zones. Plant in full sun and harvest every 2 days during peak season.";
    if (name.includes("eggplant")) return "Eggplant loves heat and performs exceptionally well in warm zones. Keep soil consistently moist and expect a long productive growing season.";
    if (name.includes("sweet potato") || name.includes("sweetpotato")) return "Sweet potatoes are perfectly suited for hot zones — they love the heat and produce abundantly in long warm seasons. Plant slips after last frost and give vines room to spread.";
  }

  if (climate === "cold") {
    if (name.includes("kale")) return "Kale is one of the best cold zone vegetables — it actually improves in flavor after frost. Plant in late summer for a fall and early winter harvest that gets sweeter with every cold snap.";
    if (name.includes("spinach")) return "Spinach thrives in cold zones and is one of the first crops you can plant in spring. It tolerates light frost and produces tender leaves in cool weather.";
    if (name.includes("pea")) return "Peas are perfect for cold zones — they prefer cool weather and can be planted as soon as soil can be worked in spring. Expect a productive harvest before summer heat arrives.";
    if (name.includes("potato")) return "Potatoes are well suited for cold zones with long cool growing seasons. Plant certified seed potatoes in early spring and expect a generous harvest by late summer.";
    if (name.includes("carrot")) return "Carrots thrive in cool climates and develop excellent sweetness after light frost exposure. Plant in deep, loose, rock-free soil for straight, full-sized roots.";
    if (name.includes("broccoli")) return "Broccoli is ideal for cold zones — it prefers cool temperatures and produces best in spring or fall. Start indoors early and transplant when weather cools for a premium harvest.";
  }

  // Difficulty based responses
  if (difficulty.label === "Easy") {
    return `${item.name} is beginner friendly and a great choice for your zone. It's forgiving, grows quickly, and rewards consistent watering and good soil with a reliable harvest. A great starting point for any gardener.`;
  }
  if (difficulty.label === "Hard") {
    return `${item.name} requires more attention but is absolutely worth growing in Zone ${zone || "your area"}. Focus on proper soil preparation, consistent watering, and monitoring for pests. The effort pays off with an impressive and rewarding harvest.`;
  }
  return `${item.name} is a solid choice for Zone ${zone || "your area"} when planted during the proper season. Prepare your soil with compost, water consistently, and give plants enough space for airflow and healthy growth throughout the season.`;
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

  const name = String(item?.name || "").toLowerCase();

  // VEGETABLES
  if (name.includes("tomato")) return [
    "Choose a sunny spot with at least 8 hours of direct sunlight daily.",
    "Dig a deep hole and bury the stem up to the lowest set of leaves — tomatoes root along buried stems.",
    "Space plants 24–36 inches apart to allow airflow and prevent disease.",
    "Water deeply at the base right after planting — avoid wetting the leaves.",
    "Add a 2–3 inch layer of mulch around the base to retain moisture and reduce weeds.",
    "Install a cage or stake at planting time before roots establish.",
    "Feed with a balanced fertilizer every 2 weeks once flowers appear.",
  ];
  if (name.includes("pepper")) return [
    "Start seeds indoors 8–10 weeks before last frost or buy transplants.",
    "Choose a warm, sunny location with well-draining soil.",
    "Plant 18–24 inches apart after all frost risk has passed.",
    "Water consistently — peppers drop flowers if soil dries out too much.",
    "Mulch around plants to keep roots cool and retain moisture.",
    "Feed with a low-nitrogen fertilizer once flowering begins.",
    "Harvest regularly to encourage more fruit production throughout the season.",
  ];
  if (name.includes("cucumber")) return [
    "Wait until soil temperature reaches at least 60°F before planting.",
    "Sow seeds 1 inch deep directly in the garden or start indoors 3 weeks early.",
    "Plant in hills of 2–3 seeds or space transplants 12 inches apart.",
    "Install a trellis at planting time — vertical growing saves space and improves airflow.",
    "Water deeply and consistently — cucumbers are 95% water and need steady moisture.",
    "Mulch heavily to keep soil cool and moist during hot weather.",
    "Harvest when cucumbers reach full size but before they yellow — pick often to keep plants producing.",
  ];
  if (name.includes("zucchini") || name.includes("squash")) return [
    "Direct sow seeds 1 inch deep after last frost when soil is warm.",
    "Plant in groups of 2–3 seeds and thin to the strongest plant.",
    "Space plants 3–4 feet apart — zucchini gets large quickly.",
    "Water at the base deeply 2–3 times per week.",
    "Hand pollinate early flowers if bees are scarce by transferring pollen with a small brush.",
    "Harvest zucchini when 6–8 inches long for best flavor and texture.",
    "Check plants daily during peak season — zucchini grows extremely fast.",
  ];
  if (name.includes("carrot")) return [
    "Loosen soil at least 12 inches deep and remove all rocks and debris.",
    "Sow seeds directly — carrots do not transplant well.",
    "Sprinkle seeds thinly in rows 12 inches apart and cover with just 1/4 inch of soil.",
    "Keep the soil surface consistently moist until germination — this takes 10–14 days.",
    "Thin seedlings to 3 inches apart once they reach 2 inches tall.",
    "Avoid heavy nitrogen fertilizer — it causes forked roots.",
    "Harvest when tops reach full color — gently loosen soil with a fork before pulling.",
  ];
  if (name.includes("lettuce")) return [
    "Choose a spot with morning sun and afternoon shade in warm climates.",
    "Sow seeds 1/8 inch deep directly in loose, fertile soil.",
    "Keep rows 12 inches apart and thin seedlings to 6 inches once established.",
    "Water lightly and frequently — lettuce has shallow roots that dry out quickly.",
    "Harvest outer leaves as needed or cut the whole head at soil level.",
    "Replant every 2–3 weeks for a continuous harvest throughout the season.",
    "Bolt prevention: harvest before temperatures consistently exceed 80°F.",
  ];
  if (name.includes("spinach")) return [
    "Plant in early spring or fall — spinach struggles in summer heat.",
    "Sow seeds 1/2 inch deep in rows 12 inches apart.",
    "Thin seedlings to 6 inches apart when they reach 2 inches tall.",
    "Keep soil consistently moist — spinach wilts quickly without water.",
    "Fertilize with nitrogen-rich fertilizer for lush leafy growth.",
    "Harvest outer leaves when they reach 3–4 inches or cut the whole plant.",
    "Plant a new batch every 2 weeks for continuous harvest before summer.",
  ];
  if (name.includes("kale")) return [
    "Start seeds indoors 6 weeks before last frost or direct sow in late summer for fall harvest.",
    "Plant in full sun to partial shade in rich, well-draining soil.",
    "Space transplants 18–24 inches apart for large healthy plants.",
    "Water deeply once or twice per week — kale is drought tolerant but prefers consistent moisture.",
    "Fertilize monthly with a balanced fertilizer.",
    "Harvest outer leaves first, leaving the center to keep growing.",
    "Flavor improves after a light frost — fall kale is often sweeter than spring kale.",
  ];
  if (name.includes("broccoli")) return [
    "Start seeds indoors 6–8 weeks before last frost.",
    "Transplant outdoors 2–3 weeks before last frost — broccoli tolerates light frost.",
    "Space plants 18 inches apart in rows 24 inches wide.",
    "Keep soil consistently moist — uneven watering causes hollow stems.",
    "Feed with nitrogen-rich fertilizer every 3 weeks.",
    "Harvest the main head before flowers open — cut at an angle to allow side shoots to form.",
    "Continue harvesting side shoots for weeks after the main head is cut.",
  ];
  if (name.includes("cabbage")) return [
    "Start seeds indoors 6–8 weeks before last frost.",
    "Harden off transplants for one week before moving outside.",
    "Space plants 12–24 inches apart depending on desired head size.",
    "Water regularly — cabbage is 90% water and needs consistent moisture.",
    "Mulch around plants to retain moisture and suppress weeds.",
    "Watch for cabbage worms and treat with Bt spray if needed.",
    "Harvest when heads feel solid and firm when squeezed.",
  ];
  if (name.includes("potato")) return [
    "Cut seed potatoes into chunks with at least 2 eyes each and let them cure for 24 hours.",
    "Dig trenches 4 inches deep and 12 inches apart.",
    "Place seed potato chunks cut side down, 12 inches apart in the trench.",
    "Cover with 4 inches of soil and water well.",
    "Hill soil around stems as plants grow — keeping tubers covered prevents greening.",
    "Stop watering when foliage begins to yellow and die back.",
    "Harvest 2–3 weeks after foliage dies — dig carefully to avoid damaging tubers.",
  ];
  if (name.includes("onion")) return [
    "Plant sets or transplants in early spring as soon as soil can be worked.",
    "Choose a sunny spot with loose, well-draining soil.",
    "Plant sets 1 inch deep and 4–6 inches apart in rows 12 inches apart.",
    "Keep soil consistently moist during bulb formation.",
    "Stop watering when tops begin to fall over naturally.",
    "Push over any remaining tops to redirect energy to the bulb.",
    "Harvest when tops are fully brown and dry — cure in a warm dry place for 2–4 weeks before storing.",
  ];
  if (name.includes("garlic")) return [
    "Plant individual cloves in fall, 4–6 weeks before ground freezes.",
    "Choose the largest cloves from the bulb for the best yield.",
    "Plant cloves pointed end up, 2 inches deep and 6 inches apart.",
    "Mulch heavily with straw after planting to protect from winter cold.",
    "Remove mulch in spring when green shoots emerge.",
    "Snap off scapes (curly shoots) in early summer to redirect energy to the bulb.",
    "Harvest when lower leaves turn brown but upper leaves are still green — usually June or July.",
  ];
  if (name.includes("corn")) return [
    "Wait until soil reaches 60°F before planting — corn needs warm soil to germinate.",
    "Plant in blocks of at least 4 rows rather than single rows for good pollination.",
    "Sow seeds 1 inch deep, 9–12 inches apart in rows 30–36 inches apart.",
    "Water deeply once per week — corn needs 1 inch of water weekly.",
    "Side dress with nitrogen fertilizer when plants reach knee height.",
    "Silk turns brown and dries out when ears are ready — check by peeling back husk.",
    "Harvest immediately when ready — sugar converts to starch quickly after picking.",
  ];
  if (name.includes("bean") || name.includes("greenbean")) return [
    "Direct sow after last frost when soil reaches 60°F.",
    "Plant seeds 1–2 inches deep, 3 inches apart in rows 18 inches apart.",
    "For pole beans install support before planting — plants grow 6–8 feet tall.",
    "Water consistently — beans drop flowers in drought conditions.",
    "Avoid overhead watering to prevent fungal disease on leaves.",
    "Begin harvesting when pods are firm and snap cleanly — don't let pods mature on plant.",
    "Pick every 2–3 days to keep plants producing throughout the season.",
  ];
  if (name.includes("pea")) return [
    "Plant in early spring as soon as soil can be worked — peas prefer cool weather.",
    "Sow seeds 1 inch deep, 2 inches apart in rows 18 inches apart.",
    "Install a trellis or netting before planting for climbing varieties.",
    "Water at the base — avoid wetting foliage to prevent powdery mildew.",
    "Do not fertilize with nitrogen — peas fix their own nitrogen from the air.",
    "Harvest when pods are plump and bright green — taste one to check sweetness.",
    "Pick regularly to keep plants producing — leaving pods on the vine stops new growth.",
  ];
  if (name.includes("radish")) return [
    "Sow seeds directly in spring or fall — radishes bolt quickly in summer heat.",
    "Plant 1/2 inch deep, 1 inch apart in rows 6 inches apart.",
    "Thin to 2 inches apart once seedlings emerge.",
    "Water consistently — irregular watering causes cracked or woody roots.",
    "Radishes are ready in just 25–30 days — check size by gently exposing the top of the root.",
    "Harvest promptly when mature — leaving them in ground makes them woody and hot.",
    "Succession plant every 2 weeks for continuous harvest throughout cool season.",
  ];
  if (name.includes("beet")) return [
    "Sow seeds directly in early spring or late summer for fall harvest.",
    "Plant 1/2 inch deep, 3 inches apart in rows 12 inches apart.",
    "Soak seeds in water for 24 hours before planting to improve germination.",
    "Thin seedlings to 4 inches apart — each beet seed is actually a cluster of seeds.",
    "Keep soil consistently moist for smooth, uniform root development.",
    "Harvest when roots reach 1.5–3 inches in diameter for best flavor.",
    "Don't forget the greens — beet tops are edible and highly nutritious.",
  ];
  if (name.includes("eggplant")) return [
    "Start seeds indoors 8–10 weeks before last frost — eggplant needs a long warm season.",
    "Transplant outdoors only when night temperatures stay above 55°F consistently.",
    "Space plants 18–24 inches apart in full sun.",
    "Water deeply and consistently — eggplant is sensitive to drought stress.",
    "Mulch heavily to keep soil warm and retain moisture.",
    "Feed with a balanced fertilizer every 3 weeks once flowering begins.",
    "Harvest when skin is glossy and bright — dull skin means the fruit is overripe.",
  ];
  if (name.includes("celery")) return [
    "Start seeds indoors 10–12 weeks before last frost — celery has a very long growing season.",
    "Transplant when seedlings are 3–4 inches tall and frost risk has passed.",
    "Space plants 12 inches apart in rich, moisture-retentive soil.",
    "Water heavily and consistently — celery needs more water than almost any vegetable.",
    "Side dress with compost or fertilizer every 3 weeks.",
    "Blanch stalks by wrapping with newspaper 2 weeks before harvest for milder flavor.",
    "Harvest by cutting the whole plant at soil level when stalks reach full size.",
  ];
  if (name.includes("pumpkin")) return [
    "Sow seeds directly after last frost when soil is warm.",
    "Plant 3–5 seeds per hill, 1 inch deep, in hills spaced 6 feet apart.",
    "Thin to 2–3 plants per hill once seedlings emerge.",
    "Water deeply at the base — avoid wetting leaves to prevent mildew.",
    "Feed with a high-potassium fertilizer once flowers form.",
    "Pinch off excess small pumpkins to direct energy into 1–2 large fruits.",
    "Harvest when skin is hard, color is fully developed, and stem begins to dry.",
  ];
  if (name.includes("watermelon")) return [
    "Start seeds indoors 2–3 weeks before last frost or direct sow when soil reaches 70°F.",
    "Plant in hills 6 feet apart — watermelons need a lot of space to spread.",
    "Water deeply but infrequently — deep roots prefer long dry periods between waterings.",
    "Feed with nitrogen fertilizer until vines run, then switch to phosphorus.",
    "Place a board or straw under developing melons to prevent rot.",
    "Tap the melon — a hollow thump means it's ripe.",
    "Check the tendril closest to the fruit — when it dries and browns the melon is ready.",
  ];
  if (name.includes("okra")) return [
    "Soak seeds overnight in water to improve germination.",
    "Direct sow after last frost when soil reaches 65°F.",
    "Plant 1 inch deep, 12 inches apart in rows 3 feet apart.",
    "Water deeply once per week — okra is drought tolerant once established.",
    "Fertilize with a balanced fertilizer at planting and again at first flowering.",
    "Harvest pods when 3–4 inches long — larger pods become tough and fibrous.",
    "Harvest every 2 days during peak season — okra grows extremely fast in heat.",
  ];

  // HERBS
  if (name.includes("basil")) return [
    "Start seeds indoors 6 weeks before last frost or direct sow after frost.",
    "Plant in a warm, sunny location with at least 6 hours of direct sun.",
    "Space plants 12–18 inches apart in well-draining fertile soil.",
    "Water at the base consistently — basil hates wet leaves.",
    "Pinch off flower buds as soon as they appear to keep leaves flavorful.",
    "Harvest by pinching stems just above a leaf node to encourage bushy growth.",
    "Bring containers indoors before first frost to extend the season.",
  ];
  if (name.includes("mint")) return [
    "Plant in a container — mint spreads aggressively and will take over a garden bed.",
    "Choose a spot with partial shade to full sun.",
    "Plant in moist, rich soil and water regularly.",
    "Divide and repot container mint every spring to keep it healthy.",
    "Pinch off flowers to keep leaves at peak flavor.",
    "Harvest stems regularly — the more you pick the bushier it grows.",
    "Bring containers indoors before frost for year-round fresh mint.",
  ];
  if (name.includes("rosemary")) return [
    "Plant in full sun with excellent drainage — rosemary hates wet feet.",
    "Space plants 2–3 feet apart in sandy or loamy soil.",
    "Water deeply but infrequently — rosemary is drought tolerant once established.",
    "Avoid over-fertilizing — lean soil actually improves flavor.",
    "Prune after flowering to keep plants compact and bushy.",
    "Harvest by snipping young stem tips — never cut back more than one third at a time.",
    "In cold zones grow in containers and bring indoors for winter.",
  ];
  if (name.includes("thyme")) return [
    "Plant in full sun with very well-draining soil — thyme tolerates drought well.",
    "Space plants 12 inches apart.",
    "Water sparingly once established — overwatering is the most common mistake.",
    "Prune lightly after flowering to prevent woodiness.",
    "Harvest stems before flowers open for the strongest flavor.",
    "Divide plants every 2–3 years to keep them vigorous.",
    "Thyme is cold hardy in most zones and can overwinter outdoors.",
  ];
  if (name.includes("cilantro")) return [
    "Direct sow seeds in cool weather — cilantro bolts quickly in heat.",
    "Plant 1/4 inch deep in rows 12 inches apart.",
    "Succession sow every 3 weeks for continuous harvest.",
    "Water regularly but do not overwater — well-draining soil is essential.",
    "Harvest outer leaves when plants reach 6 inches tall.",
    "Let some plants bolt and go to seed — coriander seeds are also edible.",
    "Plant in fall in warm climates for the best cool-season harvest.",
  ];
  if (name.includes("parsley")) return [
    "Soak seeds in water for 24 hours before planting to speed germination.",
    "Sow 1/4 inch deep in rich, moist soil in full sun to partial shade.",
    "Thin seedlings to 8 inches apart — parsley needs room to develop.",
    "Water consistently — parsley prefers evenly moist soil.",
    "Fertilize monthly with a balanced fertilizer.",
    "Harvest outer stems first, cutting at the base of the stem.",
    "Parsley is biennial — it will overwinter and flower in its second year.",
  ];
  if (name.includes("fennel")) return [
    "Direct sow in a dedicated spot away from other vegetables.",
    "Plant in full sun in well-draining soil.",
    "Sow seeds 1/4 inch deep, 12 inches apart.",
    "Water regularly until established — fennel is drought tolerant once mature.",
    "Avoid planting near tomatoes, peppers, or most vegetables — fennel inhibits their growth.",
    "Harvest leaves anytime and bulb when it reaches tennis ball size.",
    "Let some plants go to seed for harvesting fennel seeds in late summer.",
  ];

  // BERRIES
  if (name.includes("strawberry")) return [
    "Plant in early spring in full sun with well-draining, slightly acidic soil.",
    "Set crowns at soil level — planting too deep causes rot, too shallow causes drying.",
    "Space plants 12–18 inches apart in rows 24 inches apart.",
    "Mulch with straw to keep berries clean and soil moist.",
    "Remove flowers in the first year to establish strong roots before fruiting.",
    "Feed with a high-potassium fertilizer in spring and after harvest.",
    "Replace plants every 3 years as productivity declines with age.",
  ];
  if (name.includes("blueberry")) return [
    "Choose a spot with full sun and very acidic soil (pH 4.5–5.5).",
    "Amend soil with sulfur or peat moss to lower pH if needed.",
    "Plant at least 2 different varieties for cross-pollination and higher yield.",
    "Space bushes 4–5 feet apart.",
    "Mulch deeply with wood chips or pine bark to maintain soil acidity.",
    "Water consistently — blueberries have shallow roots that dry out quickly.",
    "Do not expect a full harvest for 3 years — patience pays off with long-lived productive bushes.",
  ];
  if (name.includes("raspberry")) return [
    "Plant bare root canes in early spring in full sun.",
    "Space canes 2 feet apart in rows 8 feet apart.",
    "Install a trellis or post-and-wire support system before planting.",
    "Cut all canes back to 6 inches at planting to encourage strong new growth.",
    "Water deeply once per week — raspberries need consistent moisture.",
    "Mulch heavily to suppress weeds and retain moisture.",
    "Prune out old fruited canes after harvest to make room for new growth.",
  ];

  // TREE FRUITS
  if (name.includes("apple")) return [
    "Choose a sunny location with good air circulation to prevent disease.",
    "Plant bare root trees in early spring before buds break.",
    "Dig a hole twice as wide as the root ball and just as deep.",
    "Make sure the graft union stays 2 inches above soil level.",
    "Plant at least 2 compatible varieties for cross-pollination.",
    "Stake young trees for the first 2 years for stability.",
    "Prune annually in late winter to maintain an open canopy and good airflow.",
  ];
  if (name.includes("peach")) return [
    "Plant in full sun with well-draining soil in spring.",
    "Dig a hole wide enough to spread roots without bending.",
    "Keep the bud union 2 inches above soil level.",
    "Water deeply every week during the first growing season.",
    "Thin fruit to 6 inches apart when they reach marble size for larger peaches.",
    "Prune to an open vase shape annually in late winter.",
    "Apply dormant oil spray in late winter to control overwintering pests.",
  ];
  if (name.includes("lemon") || name.includes("lime") || name.includes("orange") || name.includes("grapefruit") || name.includes("mandarin")) return [
    "Plant in the warmest, sunniest spot in your garden or in a large container.",
    "Use well-draining citrus mix soil and ensure excellent drainage.",
    "Plant with the bud union above soil line.",
    "Water deeply but allow soil to dry slightly between waterings.",
    "Feed with citrus-specific fertilizer every 6–8 weeks during the growing season.",
    "Protect from frost — cover or bring containers indoors when temps drop below 32°F.",
    "Prune only to remove dead wood and crossing branches — citrus needs minimal pruning.",
  ];
  if (name.includes("avocado")) return [
    "Plant in full sun in a warm frost-free location.",
    "Use fast-draining soil — avocados are extremely sensitive to root rot.",
    "Dig a hole as deep as the root ball and 3 times as wide.",
    "Do not amend the soil in the planting hole — native soil encourages roots to spread.",
    "Water deeply but allow soil to dry out between waterings.",
    "Fertilize with a nitrogen-rich fertilizer 4 times per year.",
    "Mulch around the base but keep mulch away from the trunk to prevent rot.",
  ];
  if (name.includes("fig")) return [
    "Plant in full sun against a south-facing wall in cooler climates for extra warmth.",
    "Dig a hole twice the width of the root ball.",
    "Figs tolerate poor soil but need excellent drainage.",
    "Water regularly during the first season — established figs are drought tolerant.",
    "Prune in late winter to remove dead wood and maintain shape.",
    "In cold zones wrap trunk with burlap in winter or grow in containers.",
    "Harvest when fruit softens and hangs downward — figs do not ripen off the tree.",
  ];
  if (name.includes("pomegranate")) return [
    "Plant in full sun in well-draining soil — pomegranates tolerate drought and heat.",
    "Space plants 15–20 feet apart or prune as a shrub.",
    "Water regularly for the first 2 years while roots establish.",
    "Once established water deeply but infrequently.",
    "Fertilize in spring with a balanced fertilizer.",
    "Prune suckers from the base regularly to maintain tree form.",
    "Harvest when skin turns deep red and makes a metallic sound when tapped.",
  ];

  // DEFAULT
  const type = normalizeType(item.type, item.name);
  if (type === "Herbs") return [
    "Choose a sunny container, raised bed, or garden spot with excellent drainage.",
    "Use loose potting mix or compost-rich soil.",
    "Plant at the same depth as the nursery pot or slightly shallower.",
    "Water at the base and keep soil evenly moist while establishing.",
    "Pinch growing tips regularly to encourage bushy compact growth.",
    "Harvest frequently once established — regular picking improves plant health.",
  ];
  if (type === "Tree Fruits") return [
    "Choose a full-sun location with enough long-term space for a mature tree.",
    "Dig a wide shallow hole and avoid planting the trunk too deep.",
    "Keep the graft union above soil level.",
    "Water deeply after planting and mulch around the base.",
    "Stake young trees for the first 2 years.",
    "Prune annually in late winter to maintain shape and airflow.",
  ];
  if (type === "Berries") return [
    "Pick a sunny spot with rich, well-draining, slightly acidic soil.",
    "Plant with correct spacing so leaves can dry after rain.",
    "Mulch around the base to hold moisture and suppress weeds.",
    "Water consistently — berries need steady moisture during fruiting.",
    "Feed with a high-potassium fertilizer in spring.",
    "Watch for birds and pests once fruit begins forming.",
  ];
  return [
    "Prepare loose soil with compost or organic matter before planting.",
    "Plant during the recommended window for your zone.",
    "Water gently after planting and keep soil evenly moist.",
    "Mulch around plants to retain moisture and reduce weeds.",
    "Fertilize regularly once plants are established.",
    "Monitor for pests and disease and treat early if needed.",
  ];
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

function tapHaptic(style = "light") {
  const map = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  };
  Haptics.impactAsync(map[style] || map.light).catch(() => {});
}

function successHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getAreaTag(area) {
  return {
    emoji: area?.emoji || "🌿",
    color: area?.color || "#5cff89",
  };
}

function formatReminderTime({ hour, minute }) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  const mm = minute === 0 ? "00" : String(minute).padStart(2, "0");
return `${h12}:${mm} ${ampm}`;
}

function formatRelativeDate(ts) {
  if (!ts) return "";
  const then = new Date(ts).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

const HARVEST_UNIT_VALUE = {
  Tomato: 3, Pepper: 2, Cucumber: 1.5, Zucchini: 1.5, Squash: 1.5, Lettuce: 2,
  Spinach: 3, Kale: 3, Broccoli: 2.5, Cabbage: 2.5, Cauliflower: 3, Carrot: 1.5,
  Potato: 1, Onion: 1, Garlic: 1.5, Corn: 0.75, Bean: 2, Pea: 3, Radish: 1,
  Beet: 2, Eggplant: 2.5, Pumpkin: 5, Watermelon: 5, Strawberry: 4, Blueberry: 5,
  Raspberry: 6, Basil: 2.5, Mint: 2, Parsley: 2, Cilantro: 2, Okra: 3,
};
function parseHarvestQuantity(amount) {
  const match = String(amount || "").match(/(\d+(\.\d+)?)/);
  const n = match ? parseFloat(match[1]) : 0;
  return n > 0 ? n : 1;
}
function estimateHarvestValue(harvestLog) {
  let total = 0;
  const byPlant = {};
  (harvestLog || []).forEach((h) => {
    const key = Object.keys(HARVEST_UNIT_VALUE).find((k) =>
      String(h.plantName || "").toLowerCase().includes(k.toLowerCase())
    );
    const unitVal = key ? HARVEST_UNIT_VALUE[key] : 2;
    const value = unitVal * parseHarvestQuantity(h.amount);
    total += value;
    byPlant[h.plantName] = (byPlant[h.plantName] || 0) + value;
  });
  const top = Object.entries(byPlant).sort((a, b) => b[1] - a[1])[0];
  return { total: Math.round(total), byPlant, topPlant: top ? { name: top[0], value: Math.round(top[1]) } : null };
}

function migrateGardenToAreas(existingAreas, legacyGardenMap) {
  // If areas already exist, use them as-is.
  if (Array.isArray(existingAreas) && existingAreas.length > 0) {
    return existingAreas.map((area) => ({
      ...area,
      size: typeof area.size === "number" ? area.size : Object.keys(area.plots || {}).length || 12,
    }));
  }
  // Otherwise wrap any legacy flat gardenMap into one default area
  // so existing users don't lose their layout.
 const legacyPlots = legacyGardenMap && typeof legacyGardenMap === "object" ? legacyGardenMap : {};
  if (Object.keys(legacyPlots).length === 0) {
    return [];
  }
  return [
    {
      id: "area-default",
      name: "My Garden",
      plots: { ...legacyPlots },
      size: 12,
    },
  ];
}

async function maybeAskForReview() {
  try {
    const alreadyAsked = await AsyncStorage.getItem("pp_reviewRequested");
    if (alreadyAsked) return;
    const available = await StoreReview.isAvailableAsync();
    if (!available) return;
    await AsyncStorage.setItem("pp_reviewRequested", "true");
    await StoreReview.requestReview();
  } catch (error) {
    console.log("Review request skipped:", error);
  }
}
function getDaysSince(dateString) {
  if (!dateString) return null;
  const slice = String(dateString).slice(0, 10);
  const then = new Date(`${slice}T12:00:00`);
  if (Number.isNaN(then.getTime())) return null;
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const diff = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  return Number.isNaN(diff) ? null : diff;
}
function getLastWateredText(plantName, wateredPlants, wateringHistory) {
  const history = wateringHistory?.[plantName];
  const lastDate = Array.isArray(history) && history.length
    ? history[history.length - 1]
    : wateredPlants?.[plantName];
  const days = getDaysSince(lastDate);
  if (days === null) return "Never watered";
  if (days <= 0) return "Watered today";
  if (days === 1) return "Watered yesterday";
  if (days < 14) return `Watered ${days} days ago`;
  const weeks = Math.floor(days / 7);
  return `Watered ${weeks} week${weeks === 1 ? "" : "s"} ago`;
}
function getWateringCount(plantName, wateringHistory) {
  const history = wateringHistory?.[plantName];
  return Array.isArray(history) ? history.length : 0;
}
function getBaseWaterInterval(item) {
  const type = normalizeType(item?.type, item?.name);
  const name = String(item?.name || "").toLowerCase();
  if (["lettuce", "spinach", "celery", "cucumber"].some((w) => name.includes(w))) return 2;
  if (type === "Herbs") return 2;
  if (type === "Tree Fruits" || type === "Tropical Fruits") return 5;
  if (type === "Berries") return 3;
  return 3; // vegetables default
}
function getWateringRhythm(plantName, item, wateringHistory) {
  const raw = wateringHistory?.[plantName];
  if (!Array.isArray(raw)) return null;
  // Unique day-keys, sorted oldest → newest.
  const dates = Array.from(new Set(raw.map((d) => String(d).slice(0, 10)))).sort();
  if (dates.length < 3) return null; // need a few data points for a meaningful average
  let totalGap = 0;
  for (let i = 1; i < dates.length; i += 1) {
    const a = new Date(`${dates[i - 1]}T12:00:00`);
    const b = new Date(`${dates[i]}T12:00:00`);
    totalGap += Math.round((b - a) / (1000 * 60 * 60 * 24));
  }
  const avgGap = totalGap / (dates.length - 1);
  const target = getBaseWaterInterval(item);
  const diff = avgGap - target; // + = watering less often than ideal, - = more often
  let status;
  if (Math.abs(diff) <= 0.75) status = "on-track";
  else if (diff > 0.75) status = "under"; // gaps too long
  else status = "over"; // gaps too short
  return { avgGap: Math.round(avgGap * 10) / 10, target, diff, status, count: dates.length };
}
function getNextWaterInfo(plantName, item, wateringHistory, wateredPlants, weather) {
  const history = wateringHistory?.[plantName];
  const lastDate = Array.isArray(history) && history.length
    ? history[history.length - 1]
    : wateredPlants?.[plantName];
  if (!lastDate) return null;

  let interval = getBaseWaterInterval(item);
  if (weather?.maxTempF >= 95) interval = Math.max(1, interval - 1);

  const base = new Date(`${String(lastDate).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(base.getTime())) return null;
  const next = new Date(base);
  next.setDate(next.getDate() + interval);

  const rainSoon = weather?.precipChance >= 65;
  const now = new Date(); now.setHours(12, 0, 0, 0);
  let daysUntil = Math.round((next - now) / (1000 * 60 * 60 * 24));
  if (rainSoon && daysUntil <= 0) daysUntil = 1;

  let label, urgency;
  if (daysUntil <= 0) { label = "Water due today"; urgency = "due"; }
  else if (daysUntil === 1) { label = "Water tomorrow"; urgency = "soon"; }
  else { label = `Water in ${daysUntil} days`; urgency = "ok"; }
  if (rainSoon) { label = "Rain expected — check soil first"; urgency = "soon"; }

  return { daysUntil, label, urgency, interval, rainSoon };
}
function getSearchSuggestions(query, limit = 3) {
  const q = String(query || "").toLowerCase().trim();
  if (!q || q.length < 2) return [];
  const scored = produceData
    .map((item) => {
      const name = String(item.name || "").toLowerCase();
      let score = 0;
      if (name.startsWith(q)) score = 100;
      else if (name.includes(q)) score = 80;
      else {
        let matched = 0;
        for (const char of q) { if (name.includes(char)) matched += 1; }
        score = (matched / q.length) * 40;
      }
      return { item, score };
    })
    .filter((entry) => entry.score >= 30)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.item);
}
const WATERING_STREAK_GAP_DAYS = 4;
const WHATS_NEW_VERSION = "update-1";
const WHATS_NEW_ITEMS = [
  "🔥 Streak celebrations when you hit milestones",
  "💧 Smarter watering reminders and weekly stats",
  "📅 New 'Today' filter in your care log",
  "✨ Smoother animations and polish throughout",
];
function getWateringStreak(plantName, wateringHistory) {
  const history = wateringHistory?.[plantName];
  if (!Array.isArray(history) || !history.length) return 0;
  const dates = Array.from(new Set(history.map((d) => String(d).slice(0, 10))))
    .sort();
  const newest = dates[dates.length - 1];
  if (getDaysSince(newest) > WATERING_STREAK_GAP_DAYS) return 0;
  let streak = 1;
  for (let i = dates.length - 1; i > 0; i -= 1) {
    const current = new Date(`${dates[i]}T12:00:00`);
    const previous = new Date(`${dates[i - 1]}T12:00:00`);
    const gap = Math.round((current - previous) / (1000 * 60 * 60 * 24));
    if (gap <= WATERING_STREAK_GAP_DAYS) streak += 1;
    else break;
  }
  return streak;
}
function getStreakDaysLeft(plantName, wateringHistory) {
  const streak = getWateringStreak(plantName, wateringHistory);
  if (streak < 2) return null;
  const history = wateringHistory?.[plantName];
  if (!Array.isArray(history) || !history.length) return null;
  const newest = Array.from(new Set(history.map((d) => String(d).slice(0, 10)))).sort().pop();
  const sinceWater = getDaysSince(newest);
  if (sinceWater === null || sinceWater <= 0) return null;
  const daysLeft = WATERING_STREAK_GAP_DAYS - sinceWater;
  if (daysLeft <= 0 || daysLeft > 2) return null;
  return daysLeft;
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
  careLog,
  harvestTrackers,
  fertilizerTrackers,
  harvestLog,
}) {
  const today = getTodayKey();
  const wateredTodayCount = Object.values(wateredPlants || {}).filter((value) => value === today).length;
  const totalWateredCount = Object.values(wateredPlants || {}).filter(Boolean).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const streakCount = streakData?.count || 0;
  const careLogCount = (careLog || []).length;
  const harvestCount = Array.isArray(harvestLog) ? harvestLog.length : 0;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).length;

const allUnlocked =
  savedPlants.length >= 50 &&
  (gardenXP?.level || 0) >= 100 &&
  journalEntries.length >= 50 &&
  Object.values(gardenMap || {}).filter(Boolean).length >= 12 &&
  (careLog || []).length >= 25 &&
  Object.keys(harvestTrackers || {}).length >= 5;

  return [
    // ── PLANT SAVING ─────────────────────────────────────────────
    {
      id: "first_plant_saved",
      category: "🌱 Plant Saving",
      icon: "🌱",
      title: "First Plant Saved",
      unlocked: savedPlants.length >= 1,
      progress: Math.min(savedPlants.length, 1),
      goal: 1,
      text: `Save your first plant. ${Math.min(savedPlants.length, 1)}/1 saved.`,
    },
    {
      id: "save_5_plants",
      category: "🌱 Plant Saving",
      icon: "🪴",
      title: "Green Thumb",
      unlocked: savedPlants.length >= 5,
      progress: Math.min(savedPlants.length, 5),
      goal: 5,
      text: `Save 5 plants. ${savedPlants.length}/5 saved.`,
    },
    {
      id: "save_10_plants",
      category: "🌱 Plant Saving",
      icon: "🌿",
      title: "Garden Collector",
      unlocked: savedPlants.length >= 10,
      progress: Math.min(savedPlants.length, 10),
      goal: 10,
      text: `Save 10 plants. ${savedPlants.length}/10 saved.`,
    },
    {
      id: "save_15_plants",
      category: "🌱 Plant Saving",
      icon: "🏅",
      title: "Zone Master",
      unlocked: savedPlants.length >= 15,
      progress: Math.min(savedPlants.length, 15),
      goal: 15,
      text: `Save 15 plants. ${savedPlants.length}/15 saved.`,
    },
    {
      id: "save_25_plants",
      category: "🌱 Plant Saving",
      icon: "🌳",
      title: "Plant Library Master",
      unlocked: savedPlants.length >= 25,
      progress: Math.min(savedPlants.length, 25),
      goal: 25,
      text: `Save 25 plants. ${savedPlants.length}/25 saved.`,
    },
    {
      id: "save_50_plants",
      category: "🌱 Plant Saving",
      icon: "🏆",
      title: "Plant Encyclopedia",
      unlocked: savedPlants.length >= 50,
      progress: Math.min(savedPlants.length, 50),
      goal: 50,
      text: `Save 50 plants. ${savedPlants.length}/50 saved.`,
    },

    // ── WATERING ─────────────────────────────────────────────────
    {
      id: "water_one_today",
      category: "💧 Watering",
      icon: "💧",
      title: "Daily Water Check",
      unlocked: wateredTodayCount >= 1,
      progress: Math.min(wateredTodayCount, 1),
      goal: 1,
      text: `Water 1 plant today. ${wateredTodayCount}/1 watered.`,
    },
    {
      id: "water_three_today",
      category: "💧 Watering",
      icon: "🚿",
      title: "Water Watcher",
      unlocked: wateredTodayCount >= 3,
      progress: Math.min(wateredTodayCount, 3),
      goal: 3,
      text: `Water 3 plants today. ${wateredTodayCount}/3 watered.`,
    },
    {
      id: "water_25_total",
      category: "💧 Watering",
      icon: "🌦️",
      title: "Consistent Gardener",
      unlocked: totalWateredCount >= 25,
      progress: Math.min(totalWateredCount, 25),
      goal: 25,
      text: `Water plants 25 times total. ${totalWateredCount}/25 completed.`,
    },
    {
      id: "water_50_total",
      category: "💧 Watering",
      icon: "🌊",
      title: "Watering Legend",
      unlocked: totalWateredCount >= 50,
      progress: Math.min(totalWateredCount, 50),
      goal: 50,
      text: `Water plants 50 times. ${totalWateredCount}/50 completed.`,
    },
    {
      id: "water_100_total",
      category: "💧 Watering",
      icon: "🏄",
      title: "Water Master",
      unlocked: totalWateredCount >= 100,
      progress: Math.min(totalWateredCount, 100),
      goal: 100,
      text: `Water plants 100 times. ${totalWateredCount}/100 completed.`,
    },

    // ── STREAKS ──────────────────────────────────────────────────
    {
      id: "streak_3",
      category: "🔥 Streaks",
      icon: "✨",
      title: "Getting Started",
      unlocked: streakCount >= 3,
      progress: Math.min(streakCount, 3),
      goal: 3,
      text: `Use Pocket Planter 3 days in a row. ${streakCount}/3 days.`,
    },
    {
      id: "streak_7",
      category: "🔥 Streaks",
      icon: "🔥",
      title: "7-Day Streak",
      unlocked: streakCount >= 7,
      progress: Math.min(streakCount, 7),
      goal: 7,
      text: `Use Pocket Planter 7 days in a row. ${streakCount}/7 days.`,
    },
    {
      id: "streak_14",
      category: "🔥 Streaks",
      icon: "🔥",
      title: "Dedicated Grower",
      unlocked: streakCount >= 14,
      progress: Math.min(streakCount, 14),
      goal: 14,
      text: `Use Pocket Planter 14 days in a row. ${streakCount}/14 days.`,
    },
    {
      id: "streak_30",
      category: "🔥 Streaks",
      icon: "⚡",
      title: "Garden Obsessed",
      unlocked: streakCount >= 30,
      progress: Math.min(streakCount, 30),
      goal: 30,
      text: `Use Pocket Planter 30 days in a row. ${streakCount}/30 days.`,
    },
    {
      id: "streak_60",
      category: "🔥 Streaks",
      icon: "🏆",
      title: "Garden Master",
      unlocked: streakCount >= 60,
      progress: Math.min(streakCount, 60),
      goal: 60,
      text: `Use Pocket Planter 60 days in a row. ${streakCount}/60 days.`,
    },

    // ── JOURNAL ──────────────────────────────────────────────────
    {
      id: "first_journal_photo",
      category: "📸 Journal",
      icon: "📸",
      title: "First Garden Photo",
      unlocked: journalEntries.length >= 1,
      progress: Math.min(journalEntries.length, 1),
      goal: 1,
      text: `Add your first journal photo. ${journalEntries.length}/1 added.`,
    },
    {
      id: "photo_5",
      category: "📸 Journal",
      icon: "📷",
      title: "Snapshot Garden",
      unlocked: journalEntries.length >= 5,
      progress: Math.min(journalEntries.length, 5),
      goal: 5,
      text: `Add 5 garden photos. ${journalEntries.length}/5 added.`,
    },
    {
      id: "photo_logger",
      category: "📸 Journal",
      icon: "🖼️",
      title: "Photo Logger",
      unlocked: journalEntries.length >= 10,
      progress: Math.min(journalEntries.length, 10),
      goal: 10,
      text: `Add 10 garden photos. ${journalEntries.length}/10 added.`,
    },
    {
      id: "garden_album",
      category: "📸 Journal",
      icon: "🎨",
      title: "Garden Historian",
      unlocked: journalEntries.length >= 25,
      progress: Math.min(journalEntries.length, 25),
      goal: 25,
      text: `Add 25 garden photos. ${journalEntries.length}/25 added.`,
    },
    {
      id: "photo_50",
      category: "📸 Journal",
      icon: "🏅",
      title: "Garden Documentarian",
      unlocked: journalEntries.length >= 50,
      progress: Math.min(journalEntries.length, 50),
      goal: 50,
      text: `Add 50 garden photos. ${journalEntries.length}/50 added.`,
    },

    // ── GARDEN MAP ───────────────────────────────────────────────
    {
      id: "first_plot",
      category: "🗺️ Garden Map",
      icon: "🗺️",
      title: "First Plot Filled",
      unlocked: gardenPlotCount >= 1,
      progress: Math.min(gardenPlotCount, 1),
      goal: 1,
      text: `Fill your first garden plot. ${gardenPlotCount}/1 filled.`,
    },
    {
      id: "plot_builder",
      category: "🗺️ Garden Map",
      icon: "🏡",
      title: "Plot Builder",
      unlocked: gardenPlotCount >= 6,
      progress: Math.min(gardenPlotCount, 6),
      goal: 6,
      text: `Fill 6 garden plots. ${gardenPlotCount}/6 filled.`,
    },
    {
      id: "full_garden",
      category: "🗺️ Garden Map",
      icon: "🌍",
      title: "Full Garden",
      unlocked: gardenPlotCount >= 12,
      progress: Math.min(gardenPlotCount, 12),
      goal: 12,
      text: `Fill all 12 garden plots. ${gardenPlotCount}/12 filled.`,
    },

    // ── CARE LOG ─────────────────────────────────────────────────
    {
      id: "first_care_log",
      category: "🧪 Care Log",
      icon: "🧪",
      title: "First Care Entry",
      unlocked: careLogCount >= 1,
      progress: Math.min(careLogCount, 1),
      goal: 1,
      text: `Log your first care action. ${careLogCount}/1 logged.`,
    },
    {
      id: "care_log_5",
      category: "🧪 Care Log",
      icon: "🌿",
      title: "Soil Scientist",
      unlocked: careLogCount >= 5,
      progress: Math.min(careLogCount, 5),
      goal: 5,
      text: `Log 5 care actions. ${careLogCount}/5 logged.`,
    },
    {
      id: "care_log_10",
      category: "🧪 Care Log",
      icon: "🧬",
      title: "Care Expert",
      unlocked: careLogCount >= 10,
      progress: Math.min(careLogCount, 10),
      goal: 10,
      text: `Log 10 care actions. ${careLogCount}/10 logged.`,
    },
    {
      id: "care_log_25",
      category: "🧪 Care Log",
      icon: "🏆",
      title: "Garden Scientist",
      unlocked: careLogCount >= 25,
      progress: Math.min(careLogCount, 25),
      goal: 25,
      text: `Log 25 care actions. ${careLogCount}/25 logged.`,
    },

    // ── HARVEST ──────────────────────────────────────────────────
    {
      id: "first_harvest",
      category: "🚜 Harvest",
      icon: "🚜",
      title: "First Harvest Tracked",
      unlocked: harvestCount >= 1,
      progress: Math.min(harvestCount, 1),
      goal: 1,
      text: `Track your first harvest. ${harvestCount}/1 tracked.`,
    },
    {
      id: "harvest_3",
      category: "🚜 Harvest",
      icon: "🍅",
      title: "Harvest King",
      unlocked: harvestCount >= 3,
      progress: Math.min(harvestCount, 3),
      goal: 3,
      text: `Track 3 harvests. ${harvestCount}/3 tracked.`,
    },
    {
      id: "harvest_5",
      category: "🚜 Harvest",
      icon: "🌽",
      title: "Harvest Legend",
      unlocked: harvestCount >= 5,
      progress: Math.min(harvestCount, 5),
      goal: 5,
      text: `Track 5 harvests. ${harvestCount}/5 tracked.`,
    },
    {
      id: "harvest_ready",
      category: "🚜 Harvest",
      icon: "🎉",
      title: "Harvest Day!",
      unlocked: harvestsReady >= 1,
      progress: Math.min(harvestsReady, 1),
      goal: 1,
      text: `Have a plant ready to harvest. ${harvestsReady}/1 ready.`,
    },

    // ── LEVEL MILESTONES ─────────────────────────────────────────
    { id: "level_5", category: "⭐ Levels", icon: "🌱", title: "Backyard Grower", unlocked: (gardenXP?.level || 0) >= 5, progress: Math.min(gardenXP?.level || 0, 5), goal: 5, text: `Reach Level 5. Level ${gardenXP?.level || 0}/5.` },
{ id: "level_10", category: "⭐ Levels", icon: "🪴", title: "Green Thumb", unlocked: (gardenXP?.level || 0) >= 10, progress: Math.min(gardenXP?.level || 0, 10), goal: 10, text: `Reach Level 10. Level ${gardenXP?.level || 0}/10.` },
{ id: "level_15", category: "⭐ Levels", icon: "🌿", title: "Harvest Keeper", unlocked: (gardenXP?.level || 0) >= 15, progress: Math.min(gardenXP?.level || 0, 15), goal: 15, text: `Reach Level 15. Level ${gardenXP?.level || 0}/15.` },
{ id: "level_20", category: "⭐ Levels", icon: "🌾", title: "Garden Sage", unlocked: (gardenXP?.level || 0) >= 20, progress: Math.min(gardenXP?.level || 0, 20), goal: 20, text: `Reach Level 20. Level ${gardenXP?.level || 0}/20.` },
{ id: "level_25", category: "⭐ Levels", icon: "🧪", title: "Plant Whisperer", unlocked: (gardenXP?.level || 0) >= 25, progress: Math.min(gardenXP?.level || 0, 25), goal: 25, text: `Reach Level 25. Level ${gardenXP?.level || 0}/25.` },
{ id: "level_30", category: "⭐ Levels", icon: "🔬", title: "Soil Scientist", unlocked: (gardenXP?.level || 0) >= 30, progress: Math.min(gardenXP?.level || 0, 30), goal: 30, text: `Reach Level 30. Level ${gardenXP?.level || 0}/30.` },
{ id: "level_35", category: "⭐ Levels", icon: "🗺️", title: "Garden Architect", unlocked: (gardenXP?.level || 0) >= 35, progress: Math.min(gardenXP?.level || 0, 35), goal: 35, text: `Reach Level 35. Level ${gardenXP?.level || 0}/35.` },
{ id: "level_40", category: "⭐ Levels", icon: "🏅", title: "Zone Master", unlocked: (gardenXP?.level || 0) >= 40, progress: Math.min(gardenXP?.level || 0, 40), goal: 40, text: `Reach Level 40. Level ${gardenXP?.level || 0}/40.` },
{ id: "level_45", category: "⭐ Levels", icon: "🚜", title: "Harvest Legend", unlocked: (gardenXP?.level || 0) >= 45, progress: Math.min(gardenXP?.level || 0, 45), goal: 45, text: `Reach Level 45. Level ${gardenXP?.level || 0}/45.` },
{ id: "level_50", category: "⭐ Levels", icon: "🏆", title: "Master Botanist", unlocked: (gardenXP?.level || 0) >= 50, progress: Math.min(gardenXP?.level || 0, 50), goal: 50, text: `Reach Level 50. Level ${gardenXP?.level || 0}/50.` },
{ id: "level_55", category: "⭐ Levels", icon: "🔮", title: "Garden Oracle", unlocked: (gardenXP?.level || 0) >= 55, progress: Math.min(gardenXP?.level || 0, 55), goal: 55, text: `Reach Level 55. Level ${gardenXP?.level || 0}/55.` },
{ id: "level_60", category: "⭐ Levels", icon: "👑", title: "Legendary Grower", unlocked: (gardenXP?.level || 0) >= 60, progress: Math.min(gardenXP?.level || 0, 60), goal: 60, text: `Reach Level 60. Level ${gardenXP?.level || 0}/60.` },
{ id: "level_65", category: "⭐ Levels", icon: "⚡", title: "Elite Cultivator", unlocked: (gardenXP?.level || 0) >= 65, progress: Math.min(gardenXP?.level || 0, 65), goal: 65, text: `Reach Level 65. Level ${gardenXP?.level || 0}/65.` },
{ id: "level_70", category: "⭐ Levels", icon: "🌍", title: "Grand Gardener", unlocked: (gardenXP?.level || 0) >= 70, progress: Math.min(gardenXP?.level || 0, 70), goal: 70, text: `Reach Level 70. Level ${gardenXP?.level || 0}/70.` },
{ id: "level_75", category: "⭐ Levels", icon: "📖", title: "Garden Mythkeeper", unlocked: (gardenXP?.level || 0) >= 75, progress: Math.min(gardenXP?.level || 0, 75), goal: 75, text: `Reach Level 75. Level ${gardenXP?.level || 0}/75.` },
{ id: "level_80", category: "⭐ Levels", icon: "🌀", title: "Ancient Cultivator", unlocked: (gardenXP?.level || 0) >= 80, progress: Math.min(gardenXP?.level || 0, 80), goal: 80, text: `Reach Level 80. Level ${gardenXP?.level || 0}/80.` },
{ id: "level_85", category: "⭐ Levels", icon: "💫", title: "Garden Immortal", unlocked: (gardenXP?.level || 0) >= 85, progress: Math.min(gardenXP?.level || 0, 85), goal: 85, text: `Reach Level 85. Level ${gardenXP?.level || 0}/85.` },
{ id: "level_90", category: "⭐ Levels", icon: "✨", title: "Celestial Grower", unlocked: (gardenXP?.level || 0) >= 90, progress: Math.min(gardenXP?.level || 0, 90), goal: 90, text: `Reach Level 90. Level ${gardenXP?.level || 0}/90.` },
{ id: "level_95", category: "⭐ Levels", icon: "🌙", title: "Garden Transcendent", unlocked: (gardenXP?.level || 0) >= 95, progress: Math.min(gardenXP?.level || 0, 95), goal: 95, text: `Reach Level 95. Level ${gardenXP?.level || 0}/95.` },
{ id: "level_100", category: "⭐ Levels", icon: "🌟", title: "Garden Gnome", unlocked: (gardenXP?.level || 0) >= 100, progress: Math.min(gardenXP?.level || 0, 100), goal: 100, text: `Reach Level 100. Level ${gardenXP?.level || 0}/100.` },
{
  id: "garden_gnome_ultimate",
  category: "🌟 Legend",
  icon: allUnlocked ? "🌟" : "❓",
  title: allUnlocked ? "The Garden Gnome" : "???",
  unlocked: allUnlocked,
  progress: allUnlocked ? 1 : 0,
  goal: 1,
  text: allUnlocked
    ? "You've mastered every corner of Pocket Planter. You are a true Garden Gnome. 🌟"
    : "Complete every achievement and reach Level 100 to reveal this secret.",
  hidden: !allUnlocked,
},
  ];
}
const PROFILE_THEMES = [
  { id: "forest", name: "Forest", emoji: "🌲", color: "#5cff89", bg: "rgba(92,255,137,0.18)", border: "#5cff89", accent: "#5cff89" },
  { id: "sunset", name: "Sunset Garden", emoji: "🌅", color: "#ffd86b", bg: "rgba(255,216,107,0.18)", border: "#ffd86b", accent: "#ffd86b" },
  { id: "midnight", name: "Midnight Greenhouse", emoji: "🌙", color: "#6bc7ff", bg: "rgba(107,199,255,0.18)", border: "#6bc7ff", accent: "#6bc7ff" },
  { id: "tropical", name: "Tropical Jungle", emoji: "🌴", color: "#8effab", bg: "rgba(142,255,171,0.18)", border: "#8effab", accent: "#8effab" },
];
function getProfileBanners({ gardenXP, savedPlants, journalEntries, gardenMap, wateredPlants, streakData, harvestTrackers, careLog, comparePlants, premiumUnlocked }) {
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const totalWatered = Object.values(wateredPlants || {}).filter(Boolean).length;
  const streakCount = streakData?.count || 0;
  const harvestCount = Object.keys(harvestTrackers || {}).length;
  const careLogCount = (careLog || []).length;
  const comparePlantCount = (comparePlants || []).length;

  return [
    // ORIGINAL 7
    { id: "seedling_banner", emoji: "🌱", title: "Seedling Starter", subtitle: "Unlocked at Level 1", unlocked: gardenXP.level >= 1, gradient: ["#5cff89","#1f7a3a"] },
    { id: "green_thumb_banner", emoji: "🪴", title: "Green Thumb", subtitle: "Reach Level 5", unlocked: gardenXP.level >= 5, gradient: ["#8effab","#2fbf5f"] },
    { id: "harvest_banner", emoji: "🌾", title: "Harvest Keeper", subtitle: "Reach Level 8", unlocked: gardenXP.level >= 8, gradient: ["#ffd86b","#bf7a12"] },
    { id: "master_banner", emoji: "🏆", title: "Master Botanist", subtitle: "Reach Level 20", unlocked: gardenXP.level >= 20, gradient: ["#d8c8ff","#7b3ff2"] },
    { id: "collector_banner", emoji: "🧺", title: "Plant Collector", subtitle: "Save 10 plants", unlocked: savedPlants.length >= 10, gradient: ["#6bc7ff","#315fd6"] },
    { id: "journal_banner", emoji: "📸", title: "Garden Historian", subtitle: "Add 10 journal photos", unlocked: journalEntries.length >= 10, gradient: ["#ffb3d9","#bf3f7f"] },
    { id: "planner_banner", emoji: "🗺️", title: "Garden Architect", subtitle: "Fill all 12 garden plots", unlocked: gardenPlotCount >= 12, gradient: ["#f6d28a","#8a5a12"] },

    // NEW 14
    { id: "streak_banner", emoji: "🔥", title: "Streak Keeper", subtitle: "7 day streak", unlocked: streakCount >= 7, gradient: ["#ff9f43","#cc5500"] },
    { id: "obsessed_banner", emoji: "⚡", title: "Garden Obsessed", subtitle: "30 day streak", unlocked: streakCount >= 30, gradient: ["#ffd86b","#ff6b00"] },
    { id: "water_wizard_banner", emoji: "💧", title: "Water Wizard", subtitle: "Water 50 plants total", unlocked: totalWatered >= 50, gradient: ["#6bc7ff","#0066cc"] },
    { id: "master_waterer_banner", emoji: "🌊", title: "Master Waterer", subtitle: "Water 100 plants total", unlocked: totalWatered >= 100, gradient: ["#00c6ff","#0072ff"] },
    { id: "soil_scientist_banner", emoji: "🧪", title: "Soil Scientist", subtitle: "Log 10 care actions", unlocked: careLogCount >= 10, gradient: ["#8effab","#00b894"] },
    { id: "care_expert_banner", emoji: "🌿", title: "Care Expert", subtitle: "Log 25 care actions", unlocked: careLogCount >= 25, gradient: ["#00b894","#006644"] },
    { id: "snapshot_banner", emoji: "📸", title: "Snapshot Garden", subtitle: "Add 5 journal photos", unlocked: journalEntries.length >= 5, gradient: ["#fd79a8","#e84393"] },
    { id: "garden_historian_banner", emoji: "🎨", title: "Garden Historian", subtitle: "Add 25 journal photos", unlocked: journalEntries.length >= 25, gradient: ["#a29bfe","#6c5ce7"] },
    { id: "zone_master_banner", emoji: "🏅", title: "Zone Master", subtitle: "Save 15 plants", unlocked: savedPlants.length >= 15, gradient: ["#ffeaa7","#fdcb6e"] },
    { id: "legendary_grower_banner", emoji: "👑", title: "Legendary Grower", subtitle: "Reach Level 15", unlocked: gardenXP.level >= 15, gradient: ["#ffd700","#ff8c00"] },
    { id: "full_garden_banner", emoji: "🌍", title: "Full Garden", subtitle: "Fill all 12 plots", unlocked: gardenPlotCount >= 12, gradient: ["#55efc4","#00b894"] },
    { id: "harvest_king_banner", emoji: "🍅", title: "Harvest King", subtitle: "Track 5 harvests", unlocked: harvestCount >= 5, gradient: ["#ff7675","#d63031"] },
    { id: "companion_pro_banner", emoji: "🌸", title: "Companion Pro", subtitle: "Unlock companion planting", unlocked: premiumUnlocked, gradient: ["#fd79a8","#e17055"] },
    { id: "quest_crusher_banner", emoji: "🎯", title: "Quest Crusher", subtitle: "Complete 10 daily quests", unlocked: gardenXP.xp >= 500, gradient: ["#74b9ff","#0984e3"] },
  ];
}
function getDailyQuests({ savedPlants, journalEntries, gardenMap, wateredPlants, careLog, harvestTrackers, streakData }) {
  const today = getTodayKey();
  const dayOfWeek = new Date().getDay();
  const wateredTodayCount = Object.values(wateredPlants || {}).filter((value) => value === today).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const todayPhotos = journalEntries.filter(e => e.createdAt?.startsWith(today)).length;
  const todayCareLog = (careLog || []).filter(e => e.date === today).length;
  const streakCount = streakData?.count || 0;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).length;

  const allQuests = [
    // EASY — 15 XP
    { id: "water_one", icon: "💧", title: "Water 1 plant", description: "Mark any saved plant as watered today.", difficulty: "Easy", progress: Math.min(wateredTodayCount, 1), goal: 1, completed: wateredTodayCount >= 1, reward: 15 },
    { id: "save_one", icon: "🌱", title: "Save a plant", description: "Browse the Plants tab and save a new plant.", difficulty: "Easy", progress: Math.min(savedPlants.length, 1), goal: 1, completed: savedPlants.length >= 1, reward: 15 },
    { id: "open_app", icon: "📱", title: "Daily check-in", description: "Open Pocket Planter and check your garden.", difficulty: "Easy", progress: 1, goal: 1, completed: true, reward: 15 },
    { id: "check_weather", icon: "🌤️", title: "Check today's weather", description: "Visit the Weather tab to see today's forecast.", difficulty: "Easy", progress: 1, goal: 1, completed: true, reward: 15 },
    { id: "streak_keep", icon: "🔥", title: "Keep your streak", description: "Open the app today to maintain your streak.", difficulty: "Easy", progress: streakCount >= 1 ? 1 : 0, goal: 1, completed: streakCount >= 1, reward: 15 },

    // MEDIUM — 25 XP
    { id: "water_three", icon: "🚿", title: "Water 3 plants", description: "Mark 3 saved plants as watered today.", difficulty: "Medium", progress: Math.min(wateredTodayCount, 3), goal: 3, completed: wateredTodayCount >= 3, reward: 25 },
    { id: "journal_one", icon: "📸", title: "Add a journal photo", description: "Document your garden with a photo today.", difficulty: "Medium", progress: Math.min(todayPhotos, 1), goal: 1, completed: todayPhotos >= 1, reward: 25 },
    { id: "plan_one", icon: "🗺️", title: "Place a plant in garden map", description: "Add or rearrange a plant in your garden planner.", difficulty: "Medium", progress: Math.min(gardenPlotCount, 1), goal: 1, completed: gardenPlotCount >= 1, reward: 25 },
    { id: "care_log_one", icon: "🧪", title: "Log a care action", description: "Record a care action in your Soil & Care Log.", difficulty: "Medium", progress: Math.min(todayCareLog, 1), goal: 1, completed: todayCareLog >= 1, reward: 25 },
    { id: "save_three", icon: "🪴", title: "Save 3 plants", description: "Have at least 3 plants saved in your collection.", difficulty: "Medium", progress: Math.min(savedPlants.length, 3), goal: 3, completed: savedPlants.length >= 3, reward: 25 },
    { id: "water_five", icon: "💦", title: "Water 5 plants", description: "Mark 5 saved plants as watered today.", difficulty: "Medium", progress: Math.min(wateredTodayCount, 5), goal: 5, completed: wateredTodayCount >= 5, reward: 25 },
    { id: "fill_plots", icon: "🏡", title: "Fill 3 garden plots", description: "Have at least 3 plants placed in your garden map.", difficulty: "Medium", progress: Math.min(gardenPlotCount, 3), goal: 3, completed: gardenPlotCount >= 3, reward: 25 },

    // HARD — 50 XP
    { id: "water_all", icon: "🌊", title: "Water all your plants", description: "Mark every saved plant as watered today.", difficulty: "Hard", progress: Math.min(wateredTodayCount, Math.max(savedPlants.length, 1)), goal: Math.max(savedPlants.length, 1), completed: savedPlants.length > 0 && wateredTodayCount >= savedPlants.length, reward: 50 },
    { id: "journal_three", icon: "🖼️", title: "Add 3 journal photos", description: "Log 3 garden photos today.", difficulty: "Hard", progress: Math.min(todayPhotos, 3), goal: 3, completed: todayPhotos >= 3, reward: 50 },
    { id: "save_five", icon: "🌿", title: "Save 5 plants", description: "Have at least 5 plants saved in your collection.", difficulty: "Hard", progress: Math.min(savedPlants.length, 5), goal: 5, completed: savedPlants.length >= 5, reward: 50 },
    { id: "care_log_three", icon: "🔬", title: "Log 3 care actions", description: "Record 3 care actions in your Soil & Care Log today.", difficulty: "Hard", progress: Math.min(todayCareLog, 3), goal: 3, completed: todayCareLog >= 3, reward: 50 },
    { id: "harvest_check", icon: "🎉", title: "Check your harvests", description: "Have a plant ready to harvest.", difficulty: "Hard", progress: Math.min(harvestsReady, 1), goal: 1, completed: harvestsReady >= 1, reward: 50 },
    { id: "full_garden_plot", icon: "🌍", title: "Fill 6 garden plots", description: "Have at least 6 plants placed in your garden map.", difficulty: "Hard", progress: Math.min(gardenPlotCount, 6), goal: 6, completed: gardenPlotCount >= 6, reward: 50 },

    // BONUS SURPRISE — 50 XP
    { id: "streak_7", icon: "⚡", title: "7-Day Streak!", description: "Use Pocket Planter 7 days in a row.", difficulty: "Bonus", progress: Math.min(streakCount, 7), goal: 7, completed: streakCount >= 7, reward: 50 },
    { id: "photo_and_water", icon: "🌟", title: "Photo + Water combo", description: "Add a journal photo AND water a plant today.", difficulty: "Bonus", progress: Math.min(todayPhotos >= 1 && wateredTodayCount >= 1 ? 1 : 0, 1), goal: 1, completed: todayPhotos >= 1 && wateredTodayCount >= 1, reward: 50 },
    { id: "care_and_water", icon: "💪", title: "Full care day", description: "Log a care action AND water 3 plants today.", difficulty: "Bonus", progress: todayCareLog >= 1 && wateredTodayCount >= 3 ? 1 : 0, goal: 1, completed: todayCareLog >= 1 && wateredTodayCount >= 3, reward: 50 },
  ];

  // Pick 5 quests — always show 1 easy, 2 medium, 1 hard, 1 bonus
  const easy = allQuests.filter(q => q.difficulty === "Easy");
  const medium = allQuests.filter(q => q.difficulty === "Medium");
  const hard = allQuests.filter(q => q.difficulty === "Hard");
  const bonus = allQuests.filter(q => q.difficulty === "Bonus");

  const pick = (arr, index) => arr[index % arr.length];

  return [
    pick(easy, dayOfWeek),
    pick(medium, dayOfWeek),
    pick(medium, dayOfWeek + 1),
    pick(hard, dayOfWeek),
    pick(bonus, dayOfWeek),
  ];
}
function getConsistencyBonus(streakCount) {
  const c = streakCount || 0;
  // Rewards sustained streaks with escalating one-time bonus XP tiers.
  if (c >= 60) return 600;
  if (c >= 30) return 300;
  if (c >= 14) return 120;
  if (c >= 7) return 50;
  if (c >= 3) return 15;
  return 0;
}
function getFrameColor(level) {
  if (level >= 100) return "#ffffff";
  if (level >= 75) return "#ffd86b";
  if (level >= 50) return "#d8c8ff";
  if (level >= 25) return "#6bc7ff";
  if (level >= 10) return "#ff9f43";
  return "#5cff89";
}

// Compact seasonal pest reference. months = 1-12 when the pest is typically active.
// targets = plant types or specific names the pest commonly hits.
const PEST_WATCH_DATA = [
  {
    name: "Aphids",
    emoji: "🐛",
    months: [3, 4, 5, 6, 9, 10],
    targets: ["Vegetables", "Herbs", "lettuce", "kale", "pepper", "tomato", "cabbage", "broccoli"],
    sign: "Clusters of tiny green/black bugs on new growth and leaf undersides; sticky residue.",
    fix: "Blast off with water, then treat with insecticidal soap. Ladybugs help long-term.",
  },
  {
    name: "Tomato Hornworms",
    emoji: "🐍",
    months: [6, 7, 8],
    targets: ["tomato", "pepper", "eggplant"],
    sign: "Large green caterpillars and stripped upper leaves; dark droppings on foliage.",
    fix: "Hand-pick at dusk (they glow under UV light). Bt spray for heavy infestations.",
  },
  {
    name: "Squash Bugs",
    emoji: "🐞",
    months: [6, 7, 8],
    targets: ["squash", "zucchini", "pumpkin", "cucumber", "melon"],
    sign: "Bronze egg clusters on leaf undersides; wilting despite moist soil.",
    fix: "Crush eggs early, remove adults by hand, and keep beds clear of debris.",
  },
  {
    name: "Cabbage Worms",
    emoji: "🦋",
    months: [4, 5, 6, 9, 10],
    targets: ["cabbage", "broccoli", "kale", "cauliflower", "brussels"],
    sign: "White butterflies hovering; ragged holes and green worms on brassicas.",
    fix: "Row covers early in the season; Bt spray; hand-pick the caterpillars.",
  },
  {
    name: "Slugs & Snails",
    emoji: "🐌",
    months: [3, 4, 5, 9, 10, 11],
    targets: ["lettuce", "spinach", "strawberry", "Herbs", "basil"],
    sign: "Slime trails and irregular holes in tender leaves, worst after rain.",
    fix: "Hand-pick at night, use beer traps, or ring beds with copper tape.",
  },
  {
    name: "Spider Mites",
    emoji: "🕸️",
    months: [6, 7, 8, 9],
    targets: ["tomato", "pepper", "eggplant", "cucumber", "beans", "melon"],
    sign: "Fine webbing and stippled, yellow-speckled leaves in hot, dry spells.",
    fix: "Raise humidity, hose down undersides, and treat with insecticidal soap or neem.",
  },
  {
    name: "Whiteflies",
    emoji: "🦟",
    months: [6, 7, 8, 9],
    targets: ["tomato", "pepper", "cucumber", "cabbage", "Herbs"],
    sign: "Clouds of tiny white insects fly up when leaves are disturbed; sticky residue.",
    fix: "Yellow sticky traps, insecticidal soap, and encourage lacewings.",
  },
  {
    name: "Flea Beetles",
    emoji: "🪲",
    months: [4, 5, 6],
    targets: ["eggplant", "radish", "arugula", "cabbage", "tomato"],
    sign: "Tiny 'shotgun' holes peppering young leaves; small jumping beetles.",
    fix: "Row covers on seedlings; kaolin clay; keep plants vigorous to outgrow damage.",
  },
];

// Given saved plants and the current month, return the pests worth watching now.
function getActivePests(savedPlantObjs, month) {
  const results = [];
  PEST_WATCH_DATA.forEach((pest) => {
    if (!pest.months.includes(month)) return;
    // Which of the user's plants does this pest target?
    const affected = (savedPlantObjs || []).filter((p) => {
      const nm = String(p?.name || "").toLowerCase();
      const type = normalizeType(p?.type, p?.name);
      return pest.targets.some((t) => {
        const tl = t.toLowerCase();
        // target can be a plant-type (capitalized in data) or a name fragment
        return type === t || nm.includes(tl);
      });
    });
    if (affected.length) {
      results.push({ ...pest, affected: affected.map((p) => p.name) });
    }
  });
  return results;
}

function getSeasonForMonth(month) {
  if (month >= 3 && month <= 5) return { key: "spring", label: "Spring", months: [3, 4, 5] };
  if (month >= 6 && month <= 8) return { key: "summer", label: "Summer", months: [6, 7, 8] };
  if (month >= 9 && month <= 11) return { key: "fall", label: "Fall", months: [9, 10, 11] };
  return { key: "winter", label: "Winter", months: [12, 1, 2] };
}
function countInSeason(items, dateField, year, seasonMonths) {
  return (items || []).filter((it) => {
    const d = new Date(it?.[dateField]);
    if (Number.isNaN(d.getTime())) return false;
    return d.getFullYear() === year && seasonMonths.includes(d.getMonth() + 1);
  }).length;
}
function getGardenXP({ savedPlants, journalEntries, gardenMap, wateredPlants, streakData, bonusXP, questXP }) {
  const today = getTodayKey();
  const wateredTodayCount = Object.values(wateredPlants || {}).filter((value) => value === today).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const consistencyBonus = getConsistencyBonus(streakData?.count || 0);
  const xp = savedPlants.length * 25 + journalEntries.length * 40 + gardenPlotCount * 35 + wateredTodayCount * 15 + (streakData?.count || 0) * 20 + consistencyBonus + (bonusXP || 0) + (questXP || 0);
  const level = Math.floor(Math.sqrt(xp / 250)) + 1;
const xpForCurrentLevel = level === 1 ? 0 : 250 * (level - 1) * (level - 1);
const xpForNextLevel = 250 * level * level;
const currentLevelXP = xp - xpForCurrentLevel;
const nextLevelXP = xpForNextLevel - xpForCurrentLevel;
  let title = "Seedling";
if (level >= 5) title = "Backyard Grower";
if (level >= 10) title = "Green Thumb";
if (level >= 15) title = "Harvest Keeper";
if (level >= 20) title = "Garden Sage";
if (level >= 25) title = "Plant Whisperer";
if (level >= 30) title = "Soil Scientist";
if (level >= 35) title = "Garden Architect";
if (level >= 40) title = "Zone Master";
if (level >= 45) title = "Harvest Legend";
if (level >= 50) title = "Master Botanist";
if (level >= 55) title = "Garden Oracle";
if (level >= 60) title = "Legendary Grower";
if (level >= 65) title = "Elite Cultivator";
if (level >= 70) title = "Grand Gardener";
if (level >= 75) title = "Garden Mythkeeper";
if (level >= 80) title = "Ancient Cultivator";
if (level >= 85) title = "Garden Immortal";
if (level >= 90) title = "Celestial Grower";
if (level >= 95) title = "Garden Transcendent";
if (level >= 100) title = "🌟 Garden Gnome";
  return { xp, level, title, currentLevelXP, nextLevelXP, progress: currentLevelXP / nextLevelXP };
}

async function analyzePlantHealth(imageUri) {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const result = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
  "Content-Type": "application/json",
  "x-api-key": "YOUR_ANTHROPIC_API_KEY",
  "anthropic-version": "2023-06-01",
},
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
            { type: "text", text: `You are a plant health expert. Analyze this plant photo and respond ONLY in valid JSON with no markdown or extra text:\n{"healthy":true,"healthScore":8,"plantName":"Tomato","diagnosis":"Plant looks healthy with vibrant green leaves","issues":[],"fixes":[],"urgency":"low"}` }
          ]
        }]
      }),
    });

    const data = await result.json();
console.log("API RESPONSE:", JSON.stringify(data));
const text = data.content?.[0]?.text || "";
console.log("RAW TEXT:", text);
const clean = text.replace(/```json|```/g, "").trim();
return JSON.parse(clean);
  } catch (err) {
    console.error("Plant analysis error:", err);
    return null;
  }
}

function LoadingScreen() {
  const { width, height } = Dimensions.get("window");
  const imageAspectRatio = 1290 / 1671; // your image's exact width/height ratio
  const imageHeight = width / imageAspectRatio;
  const scale = height / imageHeight;

  return (
    <View style={[styles.loadingWrapper, { backgroundColor: "#2d4a1e" }]}>
      <Image
        source={loadingScreenImage}
        style={{
          width: scale >= 1 ? width * scale : width,
          height: scale >= 1 ? height : imageHeight,
        }}
        resizeMode="contain"
      />
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
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={
          isDark
            ? ["#08180d", "#040f07", "#020703"]
            : ["#dff5dc", "#eef8ee", "#f4fbf2"]
        }
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* faint moonlight through the canopy */}
      <View style={styles.bgSunGlow} />
      {/* deep foliage shadows */}
      <View style={styles.bgGardenOrbOne} />
      <View style={styles.bgGardenOrbTwo} />
      <View style={styles.bgGardenOrbThree} />
    </View>
  );
}

function PremiumLockedSection({ title, description, icon, onUnlock }) {
  return (
    <View style={styles.premiumLockedSection}>
      <View style={styles.premiumLockedSectionGlow} />
      <View style={styles.premiumLockedSectionTop}>
        <View style={styles.premiumLockedSectionIconWrap}>
          <Text style={styles.premiumLockedSectionIcon}>{icon}</Text>
        </View>
        <View style={styles.premiumLockedLockBadge}>
          <Text style={styles.premiumLockedLockText}>🔒 Premium</Text>
        </View>
      </View>
      <Text style={styles.premiumLockedSectionTitle}>{title}</Text>
      <Text style={styles.premiumLockedSectionDesc}>{description}</Text>
      <Pressable onPress={onUnlock} style={styles.premiumLockedSectionButton}>
        <Text style={styles.premiumLockedSectionButtonText}>Unlock Premium 🌱</Text>
      </Pressable>
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
  const [user, setUser] = useState(null);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);
  const [dailyBonusDate, setDailyBonusDate] = useState(null);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const monthScrollRef = useRef(null);
  const monthScrollDone = useRef(false);
  const [selectedType, setSelectedType] = useState("All");
  const [savedPlants, setSavedPlants] = useState([]);
  const [comparePlants, setComparePlants] = useState([]);
  const [plantNotes, setPlantNotes] = useState({});
  const [plantFolders, setPlantFolders] = useState({ "🌿 Herbs": [], "🍓 Fruit Garden": [], "🥕 Spring Garden": [] });
  const [followedPlants, setFollowedPlants] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [wateringReminders, setWateringReminders] = useState({});
  const [fertilizerTrackers, setFertilizerTrackers] = useState({});
  const [wateredPlants, setWateredPlants] = useState({});
  const [wateringHistory, setWateringHistory] = useState({});
  const [harvestTrackers, setHarvestTrackers] = useState({});
  const [gardenMap, setGardenMap] = useState({});
  const [gardenAreas, setGardenAreas] = useState([]);
  const [areaHistory, setAreaHistory] = useState({}); // { areaId: [{ family, plant, season, year, dateKey }] }
const [sowLog, setSowLog] = useState({}); // { plantName: dateKey } — last succession sow
const [frostOverrides, setFrostOverrides] = useState({}); // { lastFrost: "MM-DD", firstFrost: "MM-DD" }
const [vacation, setVacation] = useState(null); // { start: "YYYY-MM-DD", end: "YYYY-MM-DD" } | null
  const [weather, setWeather] = useState(null);
  const [zipCoords, setZipCoords] = useState(null);
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
  const [cloudProfileLoaded, setCloudProfileLoaded] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [xpPopups, setXpPopups] = useState([]);
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [authMode, setAuthMode] = useState("login");
const [newEmail, setNewEmail] = useState("");
const [careLog, setCareLog] = useState([]);
const [harvestLog, setHarvestLog] = useState([]);
const [uploadingPhoto, setUploadingPhoto] = useState(false);
const [plantSearch, setPlantSearch] = useState("");
const [recentPlants, setRecentPlants] = useState([]);
const [pinnedPlants, setPinnedPlants] = useState([]);
const [plantSaveDates, setPlantSaveDates] = useState({}); // { plantName: dateKey first saved }
const [frostChecklist, setFrostChecklist] = useState({}); // { taskId: true }
const [frostDatesHidden, setFrostDatesHidden] = useState(false); // no-frost users hide the frost dates card
const [monthlyChecklist, setMonthlyChecklist] = useState({}); // { "2026-07": { 0: true, 2: true } }

const checklistsHydrated = useRef(false);

useEffect(() => {
  (async () => {
    try {
      const [m, f, fh] = await Promise.all([
        AsyncStorage.getItem("pp_monthlyChecklist"),
        AsyncStorage.getItem("pp_frostChecklist"),
        AsyncStorage.getItem("pp_frostDatesHidden"),
      ]);
      if (m) { try { setMonthlyChecklist(JSON.parse(m)); } catch (e) {} }
      if (f) { try { setFrostChecklist(JSON.parse(f)); } catch (e) {} }
      if (fh === "true") setFrostDatesHidden(true);
    } finally {
      checklistsHydrated.current = true;
    }
  })();
}, []);

useEffect(() => {
  if (!checklistsHydrated.current) return;
  AsyncStorage.setItem("pp_monthlyChecklist", JSON.stringify(monthlyChecklist));
}, [monthlyChecklist]);

useEffect(() => {
  if (!checklistsHydrated.current) return;
  AsyncStorage.setItem("pp_frostChecklist", JSON.stringify(frostChecklist));
}, [frostChecklist]);

useEffect(() => {
  if (!checklistsHydrated.current) return;
  AsyncStorage.setItem("pp_frostDatesHidden", frostDatesHidden ? "true" : "false");
}, [frostDatesHidden]);
const [harvestGoal, setHarvestGoal] = useState(null); // { target, label, createdAt }
const [suppliesSpent, setSuppliesSpent] = useState(0); // total $ spent on seeds/supplies (manual)
const [wateringAmounts, setWateringAmounts] = useState([]); // [{ id, plantName, amount, unit, date, createdAt }]
const [snoozedPlants, setSnoozedPlants] = useState({}); // { plantName: dateKey snoozed-until }
const [wateringReminderTime, setWateringReminderTime] = useState({ hour: 9, minute: 0 });
const [plantOfDayOn, setPlantOfDayOn] = useState(false);
const [streakFreeze, setStreakFreeze] = useState({ available: true, lastUsed: null, weekKey: null });
const [refreshing, setRefreshing] = useState(false);
const [weatherRefreshToken, setWeatherRefreshToken] = useState(0);
const [homeBannerDismissedDate, setHomeBannerDismissedDate] = useState(null);
const [showScrollTop, setShowScrollTop] = useState(false);
const [showStreakCelebration, setShowStreakCelebration] = useState(null);
const [milestoneCelebration, setMilestoneCelebration] = useState(null); // { emoji, title, text }
const [firedMilestones, setFiredMilestones] = useState([]); // ids already celebrated
const [showWhatsNew, setShowWhatsNew] = useState(false);
const [showAnniversary, setShowAnniversary] = useState(null);
const [showFirstSave, setShowFirstSave] = useState(false);
const [showCareLogModal, setShowCareLogModal] = useState(false);
const [undoToast, setUndoToast] = useState(null); // { message, onUndo }
const undoTimerRef = useRef(null);
const [bonusXP, setBonusXP] = useState(0);
const [questXP, setQuestXP] = useState(0);
const [completedQuestIds, setCompletedQuestIds] = useState({});
const [activeBannerId, setActiveBannerId] = useState(null);
const [seenGardenGod, setSeenGardenGod] = useState(false);
  const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "pocketplanter://auth",
    },
  });

  console.log("SIGNUP:", data, error);
};
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("LOGIN:", data, error);
};
const handleAuth = async () => {
  if (authMode === "signup") {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "pocketplanter://auth",
      },
    });

    console.log("SIGNUP:", data, error);

    if (error) {
      alert(error.message);
      return;
    }

    Alert.alert(
      "Check Your Email 📧",
      "Your account was created! We've sent a confirmation email — please open it and confirm your email address before logging in."
    );
  } else {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    console.log("LOGIN:", data, error);

    if (error) {
      alert(error.message);
      return;
    }
  }
};

const clearLocalAccountData = async () => {
  setPremiumUnlocked(false);
  setSubscriptionPlan("Free");
  setSavedPlants([]);
  setComparePlants([]);
  setPlantNotes({});
  setFollowedPlants([]);
  setJournalEntries([]);
  setWateringReminders({});
  setFertilizerTrackers({});
  setWateredPlants({});
  setWateringHistory({});
  setHarvestTrackers({});
  setGardenMap({});
  setCareLog([]);
  setStreakData({ count: 1, lastOpened: getTodayKey() });
  setBonusXP(0);
  setQuestXP(0);
  setCompletedQuestIds({});
  setActiveBannerId(null);
  setShownAchievements([]);
  setProfileName("My Gardener Profile!");
  setProfilePhoto(null);
  setSelectedProfileTheme("forest");
  setDailyBonusClaimed(false);
  setDailyBonusDate(null);
  setCloudProfileLoaded(false);
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove([
      ...keys,
      "pp_careLog",
      "pp_activeBannerId",
      "pp_bonusXP",
      "pp_questXP",
      "pp_completedQuestIds",
    ]);
  } catch (err) {
    console.log("CLEAR STORAGE ERROR:", err);
  }
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  setUser(null);
};

const handleForgotPassword = async () => {
  const cleanEmail = email.trim();
  if (!cleanEmail) {
    Alert.alert("Enter Your Email", "Type your email address in the field above first, then tap Forgot Password.");
    return;
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: "pocketplanter://reset-password",
    });
    if (error) {
      Alert.alert("Reset Failed", error.message);
      return;
    }
    Alert.alert("Check Your Email 📧", "If an account exists for that email, a password reset link is on its way.");
  } catch (err) {
    console.log("FORGOT PASSWORD CRASH:", err);
    Alert.alert("Something went wrong", "Please try again.");
  }
};
const logZoneActivity = async (userArg, zoneArg, plantName, action) => {
  if (!userArg || !zoneArg || !plantName) return;
  try {
    await supabase.from("zone_activity").insert({
      user_id: userArg.id,
      zone: String(zoneArg),
      plant_name: plantName,
      action,
    });
  } catch (e) {
    console.log("zone activity skipped:", e);
  }
};
const saveProfileToSupabase = async () => {
  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email,
      zip_code: zip,
      
      profile_name: profileName,
      profile_photo: profilePhoto,
      profile_theme: selectedProfileTheme,

      subscription_plan: subscriptionPlan,
      premium_unlocked: premiumUnlocked,
      daily_bonus_date: dailyBonusDate,

      reminders_on: remindersOn,
      frost_alerts_on: frostAlertsOn,
      monthly_planting_on: monthlyPlantingOn,
      daily_watering_on: dailyWateringOn,
      plant_of_day_on: plantOfDayOn,

      saved_plants: savedPlants,
      journal_entries: journalEntries,
      garden_map: gardenMap,
      garden_areas: gardenAreas,
      area_history: areaHistory,
      sow_log: sowLog,
      frost_overrides: frostOverrides,
      watered_plants: wateredPlants,
      watering_history: wateringHistory,
      streak_data: streakData,
      plant_notes: plantNotes,
      harvest_trackers: harvestTrackers,
      watering_reminders: wateringReminders,
      fertilizer_trackers: fertilizerTrackers,
      shown_achievements: shownAchievements,
      selected_month: selectedMonth,
      selected_type: selectedType,
      followed_plants: followedPlants,
      compare_plants: comparePlants,
      plant_folders: plantFolders,
      appearance_mode: appearanceMode,
      show_premium_intro: showPremiumIntro,
      show_onboarding: showOnboarding,
      care_log: careLog,
      harvest_log: harvestLog,
      bonus_xp: bonusXP,
      quest_xp: questXP,
      completed_quest_ids: completedQuestIds,
      active_banner_id: activeBannerId,
      seen_garden_god: seenGardenGod,
      supplies_spent: suppliesSpent,
      watering_amounts: wateringAmounts,
      daily_bonus_claimed: dailyBonusClaimed,

      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.log("PROFILE SAVE ERROR:", error);
  } else {
    console.log("Full cloud save ✅");
  }
};
const loadProfileFromSupabase = async () => {
  if (!user) return;

  const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

if (error && error.code !== "PGRST116") {
  console.log("PROFILE LOAD ERROR:", error);
  // Do NOT mark the profile as loaded. If we did, the save effect would fire
  // with empty default state and overwrite this user's real cloud row.
  // Leaving it false means we simply don't sync this session — local data survives.
  return;
}

if (!data) {
  console.log("No profile yet — new user, will create on first save");
  setCloudProfileLoaded(true);
  return;
}

if (data?.zip_code)
  setZip(data.zip_code);
if (data?.profile_name)
  setProfileName(data.profile_name);
if (data?.profile_photo)
  setProfilePhoto(data.profile_photo);if (data?.profile_theme)
  setSelectedProfileTheme(data.profile_theme);
if (data?.subscription_plan)
  setSubscriptionPlan(data.subscription_plan);

  setPremiumUnlocked(data?.premium_unlocked === true);
   
  if (data?.daily_bonus_date) {
  setDailyBonusDate(data.daily_bonus_date);

  if (data.daily_bonus_date === getTodayKey()) {
    setDailyBonusClaimed(true);
  } else {
    setDailyBonusClaimed(false);
  }
}

if (typeof data?.reminders_on === "boolean")
  setRemindersOn(data.reminders_on);

if (typeof data?.frost_alerts_on === "boolean")
  setFrostAlertsOn(data.frost_alerts_on);

if (typeof data?.monthly_planting_on === "boolean")
  setMonthlyPlantingOn(data.monthly_planting_on);

if (typeof data?.daily_watering_on === "boolean")
  setDailyWateringOn(data.daily_watering_on);

if (typeof data?.plant_of_day_on === "boolean")
  setPlantOfDayOn(data.plant_of_day_on);

  if (Array.isArray(data?.saved_plants))
    setSavedPlants(data.saved_plants);

  if (Array.isArray(data?.journal_entries))
    setJournalEntries(data.journal_entries);

  if (data?.garden_map)
    setGardenMap(data.garden_map);

 if (Array.isArray(data?.garden_areas)) {
   setGardenAreas(migrateGardenToAreas(data?.garden_areas, data?.garden_map));
 }

 if (data?.area_history && typeof data.area_history === "object")
    setAreaHistory(data.area_history);

  if (data?.sow_log && typeof data.sow_log === "object")
    setSowLog(data.sow_log);

  if (data?.frost_overrides && typeof data.frost_overrides === "object") {
    setFrostOverrides(data.frost_overrides);
    setFrostOverrideRef(data.frost_overrides);
  }

  if (data?.watered_plants)
    setWateredPlants(data.watered_plants);

  if (data?.watering_history)
    setWateringHistory(data.watering_history);

  if (data?.streak_data)
    setStreakData(data.streak_data);

  if (data?.plant_notes)
    setPlantNotes(data.plant_notes);

  if (data?.harvest_trackers)
    setHarvestTrackers(data.harvest_trackers);

  if (data?.watering_reminders)
    setWateringReminders(data.watering_reminders);

  if (data?.fertilizer_trackers)
  setFertilizerTrackers(data.fertilizer_trackers);

  if (typeof data?.selected_month === "number")
  setSelectedMonth(data.selected_month);

if (data?.selected_type)
  setSelectedType(data.selected_type);

if (Array.isArray(data?.followed_plants))
  setFollowedPlants(data.followed_plants);

if (Array.isArray(data?.compare_plants))
  setComparePlants(data.compare_plants);

if (data?.plant_folders)
  setPlantFolders(data.plant_folders);

if (data?.appearance_mode)
  setAppearanceMode(data.appearance_mode);

if (typeof data?.show_premium_intro === "boolean")
  setShowPremiumIntro(data.show_premium_intro);

if (typeof data?.show_onboarding === "boolean")
  setShowOnboarding(data.show_onboarding);

  if (Array.isArray(data?.shown_achievements))
  setShownAchievements(data.shown_achievements);

 if (Array.isArray(data?.care_log))
  setCareLog(data.care_log);

if (Array.isArray(data?.harvest_log))
  setHarvestLog(data.harvest_log);

if (typeof data?.bonus_xp === "number")
  setBonusXP(data.bonus_xp);

if (typeof data?.quest_xp === "number")
  setQuestXP(data.quest_xp);
if (data?.completed_quest_ids)
  setCompletedQuestIds(data.completed_quest_ids);

if (data?.active_banner_id)
  setActiveBannerId(data.active_banner_id);

if (typeof data?.seen_garden_god === "boolean")
  setSeenGardenGod(data.seen_garden_god);

if (typeof data?.supplies_spent === "number")
  setSuppliesSpent(data.supplies_spent);

if (Array.isArray(data?.watering_amounts))
  setWateringAmounts(data.watering_amounts);

setDailyBonusClaimed(data?.daily_bonus_date === getTodayKey());
 
     setCloudProfileLoaded(true);

  console.log("Full cloud profile loaded ✅");

  // Daily safety snapshot. Runs only after a confirmed-good load, so it can
  // never capture empty default state. Fire-and-forget — never block the app.
  try {
    const todayKey = getTodayKey();
    const lastSnap = await AsyncStorage.getItem("pp_lastSnapshotDate");
    if (lastSnap !== todayKey) {
      await supabase.from("profile_snapshots").insert({
        user_id: user.id,
        snapshot: data,
      });
      await AsyncStorage.setItem("pp_lastSnapshotDate", todayKey);
      console.log("Profile snapshot saved 📸");
    }
  } catch (snapErr) {
    console.log("Snapshot skipped:", snapErr);
  }
};
  // FIX #4: Move record/zone here — before any useEffect that references them.
  // Previously they were declared ~200 lines later, causing temporal dead zone
  // issues in the dependency arrays of the effects below.
  const record = useMemo(() => getZipRecord(zip), [zip]);
  const zone = record?.zone || null;

  const combinedGardenMap = useMemo(() => {
    const merged = {};
    (gardenAreas || []).forEach((area) => {
      Object.entries(area.plots || {}).forEach(([slotId, plant]) => {
        if (plant) merged[`${area.id}-${slotId}`] = plant;
      });
    });
    return merged;
  }, [gardenAreas]);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const scrollRef = useRef(null);
  const monthlyPicksY = useRef(0);
  const plantsListY = useRef(0);
  const wateringSectionY = useRef(0);
  const homeY = useRef(0);
  const gardenY = useRef(0);
  const journalY = useRef(0);
  const premiumY = useRef(0);
  const reminderY = useRef(0);
  const plantReturnY = useRef(0);
  const currentScrollY = useRef(0);
  const previousXP = useRef(0);
  const lastFrostAlertDate = useRef(null);
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
      matchesType(item, selectedType) &&
      (() => {
        const q = plantSearch.toLowerCase().trim();
        if (!q) return true;
        const haystack = [
          item.name,
          normalizeType(item.type, item.name),
          getPlantSeasonLabel(item, zone),
          getPlantDifficulty(item).label,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })()
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
  plantSearch,
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
  () => calculateGardenHealth(combinedGardenMap),
  [combinedGardenMap]
);

const gardenXP = useMemo(
  () =>
    getGardenXP({
      savedPlants,
      journalEntries,
      gardenMap: combinedGardenMap,
      wateredPlants,
      streakData,
      bonusXP,
      questXP,
    }),
  [
    savedPlants,
    journalEntries,
    combinedGardenMap,
    wateredPlants,
    streakData,
    bonusXP,
    questXP,
  ]
);
const achievementBadges = useMemo(
  () =>
    getAchievementBadges({
      savedPlants,
      followedPlants,
      journalEntries,
      gardenMap: combinedGardenMap,
      wateredPlants,
      streakData,
      gardenXP,
      careLog,
      harvestTrackers,
      fertilizerTrackers,
      harvestLog,
    }),
  [
    savedPlants,
    followedPlants,
    journalEntries,
    combinedGardenMap,
    wateredPlants,
    streakData,
    gardenXP,
   careLog,
    harvestTrackers,
    fertilizerTrackers,
    harvestLog,
  ]
);
const dailyQuests = useMemo(
  () =>
    getDailyQuests({
      savedPlants,
      journalEntries,
      gardenMap: combinedGardenMap,
      wateredPlants,
      careLog,
      harvestTrackers,
      streakData,
    }),
  [
    savedPlants,
    journalEntries,
    combinedGardenMap,
    wateredPlants,
    careLog,
    harvestTrackers,
    streakData,
  ]
);
const profileBanners = useMemo(
  () =>
    getProfileBanners({
      gardenXP,
      savedPlants,
      journalEntries,
      gardenMap: combinedGardenMap,
      wateredPlants,
      streakData,
      harvestTrackers,
      careLog,
      comparePlants,
      premiumUnlocked,
    }),
  [
    gardenXP,
    savedPlants,
    journalEntries,
    combinedGardenMap,
    wateredPlants,
    streakData,
    harvestTrackers,
    careLog,
    comparePlants,
    premiumUnlocked,
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
    const resolved = resolveCompanionPlant(name);
    const target = String(resolved ? resolved.name : name).toLowerCase().replace(/_/g, " ").trim();
    const found = produceData.find((item) => String(item?.name || "").toLowerCase().replace(/_/g, " ").trim() === target);
    if (found) {
      setSelectedPlant(found);
      setTimeout(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, 50);
    } else {
      Alert.alert("Plant not found", `Could not find "${name}" in produceData.`);
    }
  }
function recordRecentPlant(item) {
    if (!item?.name) return;
    setRecentPlants((current) => {
      const next = [item.name, ...current.filter((n) => n !== item.name)];
      return next.slice(0, 6);
    });
  }
  function togglePinnedPlant(name) {
    if (!name) return;
    tapHaptic("light");
    setPinnedPlants((current) =>
      current.includes(name)
        ? current.filter((n) => n !== name)
        : [...current, name]
    );
  }
  function openPlantFromMonthly(item) {
    plantReturnY.current = currentScrollY.current;
    setReturnSection("exact");
    recordRecentPlant(item);
    setSelectedPlant(item);
  }
  function openPlantFromList(item) {
    plantReturnY.current = currentScrollY.current;
    setReturnSection("exact");
    recordRecentPlant(item);
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
  Animated.loop(
    Animated.sequence([
      Animated.timing(avatarGlow, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      }),
      Animated.timing(avatarGlow, {
        toValue: 0,
        duration: 1800,
        useNativeDriver: false,
      }),
    ])
  ).start();
}, [avatarGlow]);

useEffect(() => {
  if (user) {
    loadProfileFromSupabase();
  }
}, [user]);

useEffect(() => {
  if (!user?.created_at) return;
  (async () => {
    try {
      const created = new Date(user.created_at);
      const now = new Date();
      const daysGardening = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      const milestones = [7, 30, 90, 180, 365];
      const hit = milestones.find((m) => m === daysGardening);
      if (!hit) return;
      const seenKey = `pp_anniversarySeen_${hit}`;
      const alreadySeen = await AsyncStorage.getItem(seenKey);
      if (alreadySeen) return;
      await AsyncStorage.setItem(seenKey, "true");
      Vibration.vibrate([0, 100, 80, 100]);
      successHaptic();
      setShowAnniversary(hit);
    } catch (error) {
      console.log("Anniversary check skipped:", error);
    }
  })();
}, [user]);

useEffect(() => {
  if (!user) return;
  if (!cloudProfileLoaded) return;

  saveProfileToSupabase();
}, [
  user,
  profileName,
  profilePhoto,
  selectedProfileTheme,
  subscriptionPlan,
  premiumUnlocked,
  savedPlants,
  journalEntries,
  gardenMap,
  gardenAreas,
  wateredPlants,
  wateringHistory,
  streakData,
  plantNotes,
  harvestTrackers,
  wateringReminders,
  fertilizerTrackers,
  shownAchievements,
  dailyBonusDate,
  remindersOn,
  frostAlertsOn,
  monthlyPlantingOn,
  dailyWateringOn,
  cloudProfileLoaded,
  selectedMonth,
selectedType,
followedPlants,
comparePlants,
plantFolders,
appearanceMode,
showPremiumIntro,
showOnboarding,
careLog,
harvestLog,
activeBannerId,
bonusXP,
questXP,
completedQuestIds,
seenGardenGod,
suppliesSpent,
wateringAmounts,
areaHistory,
sowLog,
frostOverrides,
]);
// ── Storage load ───────────────────────────────────────────────────────────
useEffect(() => {
  async function loadStoredData() {
    try {
      const values = await AsyncStorage.multiGet([
        STORAGE_KEYS.zip,
        STORAGE_KEYS.plantNotes,
        STORAGE_KEYS.savedPlants,
        STORAGE_KEYS.followedPlants,
        STORAGE_KEYS.journalEntries,
        STORAGE_KEYS.selectedMonth,
        STORAGE_KEYS.selectedType,
        STORAGE_KEYS.remindersOn,
        STORAGE_KEYS.frostAlertsOn,
        STORAGE_KEYS.appearanceMode,
        STORAGE_KEYS.subscriptionPlan,
        STORAGE_KEYS.premiumUnlocked,
        STORAGE_KEYS.gardenMap,
        STORAGE_KEYS.wateredPlants,
        STORAGE_KEYS.wateringHistory,
        STORAGE_KEYS.wateringReminders,
        STORAGE_KEYS.fertilizerTrackers,
        STORAGE_KEYS.harvestTrackers,
        STORAGE_KEYS.streakData,
        STORAGE_KEYS.seenPremiumIntro,
        STORAGE_KEYS.seenOnboarding,
        STORAGE_KEYS.profileName,
        STORAGE_KEYS.profilePhoto,
        "pp_homeBannerDismissedDate",
        "pp_whatsNewSeen",
        "pp_gardenAreas",
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

if (map[STORAGE_KEYS.dailyBonusDate]) {
  setDailyBonusDate(map[STORAGE_KEYS.dailyBonusDate]);
}
if (
  map[STORAGE_KEYS.dailyBonusDate] ===
  today
) {
  setDailyBonusClaimed(true);
} else {
  setDailyBonusClaimed(false);
}
        if (map[STORAGE_KEYS.appearanceMode]) setAppearanceMode(map[STORAGE_KEYS.appearanceMode]);
        if (map[STORAGE_KEYS.subscriptionPlan]) setSubscriptionPlan(map[STORAGE_KEYS.subscriptionPlan]);
        // Premium is intentionally NOT loaded from local cache — it is per-account
        // and comes only from the Supabase row in loadProfileFromSupabase.
       if (map[STORAGE_KEYS.gardenMap]) setGardenMap(JSON.parse(map[STORAGE_KEYS.gardenMap]));
        {
          const rawAreas = map["pp_gardenAreas"];
          const parsedAreas = rawAreas ? JSON.parse(rawAreas) : [];
          const legacyMap = map[STORAGE_KEYS.gardenMap] ? JSON.parse(map[STORAGE_KEYS.gardenMap]) : {};
          setGardenAreas(migrateGardenToAreas(parsedAreas, legacyMap));
        }
       if (map[STORAGE_KEYS.wateredPlants]) setWateredPlants(JSON.parse(map[STORAGE_KEYS.wateredPlants]));
        if (map[STORAGE_KEYS.wateringHistory]) setWateringHistory(JSON.parse(map[STORAGE_KEYS.wateringHistory]));
        if (map[STORAGE_KEYS.wateringReminders])
  setWateringReminders(JSON.parse(map[STORAGE_KEYS.wateringReminders]));

if (map[STORAGE_KEYS.fertilizerTrackers])
  setFertilizerTrackers(JSON.parse(map[STORAGE_KEYS.fertilizerTrackers]));

if (map[STORAGE_KEYS.harvestTrackers])
  setHarvestTrackers(JSON.parse(map[STORAGE_KEYS.harvestTrackers]));
        if (map[STORAGE_KEYS.streakData]) setStreakData(JSON.parse(map[STORAGE_KEYS.streakData]));
        if (map[STORAGE_KEYS.seenPremiumIntro]) setShowPremiumIntro(!JSON.parse(map[STORAGE_KEYS.seenPremiumIntro]));
        if (map[STORAGE_KEYS.profileName]) setProfileName(map[STORAGE_KEYS.profileName]);
        if (map[STORAGE_KEYS.profilePhoto]) setProfilePhoto(map[STORAGE_KEYS.profilePhoto]);
        if (map[STORAGE_KEYS.profileTheme]) setSelectedProfileTheme(map[STORAGE_KEYS.profileTheme]);
        if (map["pp_homeBannerDismissedDate"]) setHomeBannerDismissedDate(map["pp_homeBannerDismissedDate"]);
        if (map["pp_whatsNewSeen"] !== WHATS_NEW_VERSION) setShowWhatsNew(true);
        updateDailyStreak();
        checkHarvestNotifications();
      } catch (error) {
        console.log("Storage load error", error);
      } finally {
        // loading is now controlled by auth session check
      }
    }
    loadStoredData();
  }, []);

  // ── Persist to storage ─────────────────────────────────────────────────────
 useEffect(() => {
  AsyncStorage.setItem(STORAGE_KEYS.zip, zip);
}, [zip]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.savedPlants,
    JSON.stringify(savedPlants)
  );
}, [savedPlants]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.plantNotes,
    JSON.stringify(plantNotes)
  );
}, [plantNotes]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.followedPlants,
    JSON.stringify(followedPlants)
  );
}, [followedPlants]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.journalEntries,
    JSON.stringify(journalEntries)
  );
}, [journalEntries]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.selectedMonth,
    String(selectedMonth)
  );
}, [selectedMonth]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.selectedType,
    selectedType
  );
}, [selectedType]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.remindersOn,
    JSON.stringify(remindersOn)
  );
}, [remindersOn]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.frostAlertsOn,
    JSON.stringify(frostAlertsOn)
  );
}, [frostAlertsOn]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.appearanceMode,
    appearanceMode
  );
}, [appearanceMode]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.subscriptionPlan,
    subscriptionPlan
  );
}, [subscriptionPlan]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.premiumUnlocked,
    JSON.stringify(premiumUnlocked)
  );
}, [premiumUnlocked]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.gardenMap,
    JSON.stringify(gardenMap)
  );
}, [gardenMap]);

useEffect(() => {
  AsyncStorage.setItem("pp_gardenAreas", JSON.stringify(gardenAreas));
}, [gardenAreas]);
useEffect(() => {
  AsyncStorage.setItem("pp_areaHistory", JSON.stringify(areaHistory));
}, [areaHistory]);
useEffect(() => {
  AsyncStorage.setItem("pp_sowLog", JSON.stringify(sowLog));
}, [sowLog]);
useEffect(() => {
  AsyncStorage.setItem("pp_frostOverrides", JSON.stringify(frostOverrides));
  setFrostOverrideRef(frostOverrides); // keep the pure date helpers in sync
}, [frostOverrides]);
useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.wateredPlants,
    JSON.stringify(wateredPlants)
  );
}, [wateredPlants]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.wateringHistory,
    JSON.stringify(wateringHistory)
  );
}, [wateringHistory]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.wateringReminders,
    JSON.stringify(wateringReminders)
  );
}, [wateringReminders]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.fertilizerTrackers,
    JSON.stringify(fertilizerTrackers)
  );
}, [fertilizerTrackers]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.harvestTrackers,
    JSON.stringify(harvestTrackers)
  );
}, [harvestTrackers]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.streakData,
    JSON.stringify(streakData)
  );
}, [streakData]);

useEffect(() => {
  AsyncStorage.setItem(
    STORAGE_KEYS.profileTheme,
    selectedProfileTheme
  );
}, [selectedProfileTheme]);

useEffect(() => {
  AsyncStorage.setItem("pp_careLog", JSON.stringify(careLog));
}, [careLog]);

useEffect(() => {
  AsyncStorage.setItem("pp_recentPlants", JSON.stringify(recentPlants));
}, [recentPlants]);

useEffect(() => {
  AsyncStorage.getItem("pp_recentPlants").then((val) => {
    if (val) {
      try { setRecentPlants(JSON.parse(val)); } catch (e) {}
    }
  });
}, []);

useEffect(() => {
  AsyncStorage.setItem("pp_pinnedPlants", JSON.stringify(pinnedPlants));
}, [pinnedPlants]);

useEffect(() => {
  AsyncStorage.setItem("pp_firedMilestones", JSON.stringify(firedMilestones));
}, [firedMilestones]);

useEffect(() => {
  AsyncStorage.setItem("pp_plantSaveDates", JSON.stringify(plantSaveDates));
}, [plantSaveDates]);

useEffect(() => {
  AsyncStorage.getItem("pp_plantSaveDates").then((val) => {
    if (val) {
      try { setPlantSaveDates(JSON.parse(val)); } catch (e) {}
    }
  });
}, []);

useEffect(() => {
  AsyncStorage.setItem("pp_harvestGoal", JSON.stringify(harvestGoal));
}, [harvestGoal]);

useEffect(() => {
  AsyncStorage.setItem("pp_suppliesSpent", String(suppliesSpent));
}, [suppliesSpent]);

useEffect(() => {
  AsyncStorage.setItem("pp_wateringAmounts", JSON.stringify(wateringAmounts));
}, [wateringAmounts]);

useEffect(() => {
  AsyncStorage.getItem("pp_harvestGoal").then((val) => {
    if (val) {
      try { setHarvestGoal(JSON.parse(val)); } catch (e) {}
    }
  });
}, []);

useEffect(() => {
  AsyncStorage.getItem("pp_suppliesSpent").then((val) => {
    if (val != null) {
      const n = parseFloat(val);
      if (!Number.isNaN(n)) setSuppliesSpent(n);
    }
  });
}, []);

useEffect(() => {
  AsyncStorage.getItem("pp_wateringAmounts").then((val) => {
    if (val) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) setWateringAmounts(parsed);
      } catch (e) {}
    }
  });
}, []);
useEffect(() => {
  AsyncStorage.getItem("pp_areaHistory").then((val) => {
    if (val) {
      try {
        const parsed = JSON.parse(val);
        if (parsed && typeof parsed === "object") setAreaHistory(parsed);
      } catch (e) {}
    }
  });
}, []);
useEffect(() => {
  AsyncStorage.getItem("pp_sowLog").then((val) => {
    if (val) {
      try {
        const parsed = JSON.parse(val);
        if (parsed && typeof parsed === "object") setSowLog(parsed);
      } catch (e) {}
    }
  });
}, []);
useEffect(() => {
  AsyncStorage.getItem("pp_frostOverrides").then((val) => {
    if (val) {
      try {
        const parsed = JSON.parse(val);
        if (parsed && typeof parsed === "object") {
          setFrostOverrides(parsed);
          setFrostOverrideRef(parsed); // apply before first render pass
        }
      } catch (e) {}
    }
  });
}, []);
useEffect(() => {
  AsyncStorage.getItem("pp_vacation").then((val) => {
    if (val) {
      try {
        const parsed = JSON.parse(val);
        if (parsed && parsed.start && parsed.end) setVacation(parsed);
      } catch (e) {}
    }
  });
}, []);
useEffect(() => {
  if (vacation) AsyncStorage.setItem("pp_vacation", JSON.stringify(vacation));
  else AsyncStorage.removeItem("pp_vacation");
}, [vacation]);
const milestonesHydrated = useRef(false);
useEffect(() => {
  AsyncStorage.getItem("pp_firedMilestones").then((val) => {
    if (val) {
      try { setFiredMilestones(JSON.parse(val)); } catch (e) {}
    }
    milestonesHydrated.current = true;
  });
}, []);

useEffect(() => {
  // Don't evaluate milestones until firedMilestones has loaded from storage —
  // otherwise every reload sees an empty list and re-fires old milestones.
  if (!milestonesHydrated.current) return;
  const totalWaterings = Object.values(wateringHistory || {}).reduce(
    (sum, dates) => sum + (Array.isArray(dates) ? dates.length : 0),
    0
  );
  const checks = [
    { id: "first_harvest", hit: (harvestLog || []).length >= 1, emoji: "🎉", title: "FIRST HARVEST!", text: "You harvested your very first crop. This is what it's all about! 🥗" },
    { id: "plants_10", hit: (savedPlants || []).length >= 10, emoji: "🌿", title: "10 PLANTS!", text: "Your garden collection just hit 10 plants. You're building something special. 🌱" },
    { id: "plants_25", hit: (savedPlants || []).length >= 25, emoji: "🏡", title: "25 PLANTS!", text: "Twenty-five plants! That's a serious garden. 🌻" },
    { id: "water_50", hit: totalWaterings >= 50, emoji: "💧", title: "50 WATERINGS!", text: "Fifty waterings logged. Your plants are lucky to have you. 💚" },
    { id: "water_100", hit: totalWaterings >= 100, emoji: "🌊", title: "100 WATERINGS!", text: "One hundred waterings! Your dedication is next level. 🔥" },
    { id: "harvest_10", hit: (harvestLog || []).length >= 10, emoji: "🧺", title: "10 HARVESTS!", text: "Ten harvests in the books. Your garden is truly producing. 🍅" },
  ];

  // Fire only the first newly-crossed milestone (avoid stacking overlays)
  const newlyHit = checks.find((c) => c.hit && !firedMilestones.includes(c.id));
  if (newlyHit && !milestoneCelebration && !showStreakCelebration) {
    successHaptic();
    Vibration.vibrate([0, 80, 60, 120]);
    setMilestoneCelebration({ emoji: newlyHit.emoji, title: newlyHit.title, text: newlyHit.text });
    setFiredMilestones((current) => [...current, newlyHit.id]);
    setTimeout(() => setMilestoneCelebration(null), 4000);
  }
}, [savedPlants, harvestLog, wateringHistory, firedMilestones]);

useEffect(() => {
  if (!harvestGoal || !harvestGoal.target) return;
  // Count harvests logged since this specific goal was created.
  const progress = (harvestLog || []).filter(
    (h) => new Date(h.createdAt) >= new Date(harvestGoal.createdAt)
  ).length;
  if (progress < harvestGoal.target) return;

  // One celebration per distinct goal (keyed to its createdAt).
  const goalId = `harvestgoal-${harvestGoal.createdAt}`;
  if (firedMilestones.includes(goalId)) return;
  if (milestoneCelebration || showStreakCelebration) return;

  successHaptic();
  Vibration.vibrate([0, 80, 60, 120]);
  setMilestoneCelebration({
    emoji: "🎯",
    title: "GOAL REACHED!",
    text: `You hit your season goal of ${harvestGoal.target} harvest${harvestGoal.target === 1 ? "" : "s"}. What a season! 🌻`,
  });
  setFiredMilestones((current) => [...current, goalId]);
  setTimeout(() => setMilestoneCelebration(null), 4000);
}, [harvestLog, harvestGoal, firedMilestones, milestoneCelebration, showStreakCelebration]);

useEffect(() => {
  AsyncStorage.getItem("pp_pinnedPlants").then((val) => {
    if (val) {
      try { setPinnedPlants(JSON.parse(val)); } catch (e) {}
    }
  });
}, []);

useEffect(() => {
  AsyncStorage.setItem("pp_snoozedPlants", JSON.stringify(snoozedPlants));
}, [snoozedPlants]);

useEffect(() => {
  AsyncStorage.setItem("pp_wateringReminderTime", JSON.stringify(wateringReminderTime));
}, [wateringReminderTime]);

useEffect(() => {
  AsyncStorage.getItem("pp_wateringReminderTime").then((val) => {
    if (val) {
      try {
        const parsed = JSON.parse(val);
        if (typeof parsed?.hour === "number") setWateringReminderTime(parsed);
      } catch (e) {}
    }
  });
}, []);

useEffect(() => {
  AsyncStorage.setItem("pp_plantOfDayOn", JSON.stringify(plantOfDayOn));
}, [plantOfDayOn]);

useEffect(() => {
  AsyncStorage.getItem("pp_plantOfDayOn").then((val) => {
    if (val) {
      try { setPlantOfDayOn(JSON.parse(val)); } catch (e) {}
    }
  });
}, []);

useEffect(() => {
  if (!dailyWateringOn) return;
  // Time preference changed while reminders are active — reschedule cleanly.
  (async () => {
    const rainSkip = getRainSkipToday(weather);
    if (rainSkip) {
      await cancelReminder("daily-watering");
      return;
    }
await scheduleDailyReminder({
      id: "daily-watering",
      hour: wateringReminderTime.hour,
      minute: wateringReminderTime.minute,
      title: "💧 Daily Watering Check",
      body: "Time to check your garden and water any plants that need moisture today.",
    });
  })();
}, [wateringReminderTime, dailyWateringOn]);

useEffect(() => {
  AsyncStorage.getItem("pp_snoozedPlants").then((val) => {
    if (!val) return;
    try {
      const parsed = JSON.parse(val);
      const tomorrowKey = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const todayKey = getTodayKey();
      // Keep only snoozes for today or tomorrow; drop anything already expired.
      const fresh = {};
      Object.entries(parsed || {}).forEach(([name, key]) => {
        if (key === tomorrowKey || key === todayKey) fresh[name] = key;
      });
      setSnoozedPlants(fresh);
      // If the summary was set for a day that's now passed, this clears it;
      // if snoozes are still pending for tomorrow, it stays scheduled.
      scheduleSnoozeSummary(fresh);
    } catch (e) {}
  });
}, []);

useEffect(() => {
  AsyncStorage.setItem("pp_streakFreeze", JSON.stringify(streakFreeze));
}, [streakFreeze]);

useEffect(() => {
  AsyncStorage.getItem("pp_streakFreeze").then((val) => {
    let loaded = { available: true, lastUsed: null, weekKey: null };
    if (val) {
      try { loaded = JSON.parse(val); } catch (e) {}
    }
    // Refresh the freeze at the start of each ISO week
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const currentWeek = `${now.getFullYear()}-W${Math.ceil((((now - oneJan) / 86400000) + oneJan.getDay() + 1) / 7)}`;
    if (loaded.weekKey !== currentWeek) {
      setStreakFreeze({ available: true, lastUsed: loaded.lastUsed, weekKey: currentWeek });
    } else {
      setStreakFreeze(loaded);
    }
  });
}, []);

useEffect(() => {
  AsyncStorage.setItem("pp_harvestLog", JSON.stringify(harvestLog));
}, [harvestLog]);

useEffect(() => {
  AsyncStorage.setItem("pp_activeBannerId", activeBannerId || "");
}, [activeBannerId]);

useEffect(() => {
  AsyncStorage.setItem("pp_bonusXP", String(bonusXP));
}, [bonusXP]);

useEffect(() => {
  AsyncStorage.setItem("pp_questXP", String(questXP));
}, [questXP]);

useEffect(() => {
  AsyncStorage.setItem("pp_completedQuestIds", JSON.stringify(completedQuestIds));
}, [completedQuestIds]);

useEffect(() => {
  const { data: listener } =
    supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          clearLocalAccountData();
        }
        console.log("AUTH EVENT:", event);
      }
    );

  supabase.auth.getSession().then(({ data }) => {
    if (data?.session?.user) {
      setUser(data.session.user);
    }
    setTimeout(() => { setLoading(false); }, 2000);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  // ── Streak + notifications ─────────────────────────────────────────────────
  async function ensureNotificationPermission() {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) return true;
    const request = await Notifications.requestPermissionsAsync();
    return request.granted;
  }
function isOnVacation(vac) {
  if (!vac || !vac.start || !vac.end) return false;
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const start = new Date(`${vac.start}T00:00:00`);
  const end = new Date(`${vac.end}T23:59:59`);
  return today >= start && today <= end;
}
async function scheduleDailyReminder({ id, hour, minute, title, body }) {
    if (hour == null || Number.isNaN(hour) || minute == null || Number.isNaN(minute)) return false;
    const granted = await ensureNotificationPermission();
    if (!granted) return false;
    // Vacation mode: don't schedule new reminders while away.
    if (isOnVacation(vacationRef.current)) {
      await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
      return false;
    }
await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: { title, body, sound: true },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async function cancelReminder(id) {
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
  }

 async function updateDailyStreak() {
    const today = getTodayKey();
    setStreakData((current) => {
      if (!current?.lastOpened) return { count: 1, lastOpened: today };
      if (current.lastOpened === today) return current;
      const previousDate = new Date(current.lastOpened);
      const currentDate = new Date(today);
      const diff = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5) {
        const newCount = (current.count || 0) + 1;
        const milestones = [7, 14, 30, 60, 100];
        if (milestones.includes(newCount)) {
          Vibration.vibrate([0, 80, 60, 120]);
          successHaptic();
          setShowStreakCelebration(newCount);
          setTimeout(() => setShowStreakCelebration(null), 3000);
          if (newCount >= 7) {
            setTimeout(() => { maybeAskForReview(); }, 3500);
          }
        }
       return { count: newCount, lastOpened: today };
      }
      // Gap too large — streak would reset. Check for an active freeze.
      if (diff <= 2.5 && streakFreeze.lastUsed) {
        const freezeDate = new Date(streakFreeze.lastUsed);
        const daysSinceFreeze = (currentDate - freezeDate) / (1000 * 60 * 60 * 24);
        // Freeze was used within the missed window — protect the streak.
        if (daysSinceFreeze <= 2) {
          const popup = { id: Date.now().toString(), amount: "❄️ Streak freeze saved you!" };
          setXpPopups((popups) => [...popups, popup]);
          setTimeout(() => setXpPopups((popups) => popups.filter((p) => p.id !== popup.id)), 2500);
          return { count: current.count || 1, lastOpened: today };
        }
      }
      return { count: 1, lastOpened: today };
    });
  }

  async function pickJournalPhoto(plantName) {
  if (!user) {
    Alert.alert(
      "Login required",
      "Please log in before adding journal photos."
    );
    return;
  }

  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      "Photos Permission Needed",
      "Allow photo access to add garden journal pictures."
    );
    return;
  }

  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

  if (result.canceled) return;

 const asset = result.assets?.[0];

  if (!asset?.uri) return;

  setUploadingPhoto(true);
  try {
    const currentMonthEarly = new Date().getMonth() + 1;
    const mood =
      currentMonthEarly >= 3 && currentMonthEarly <= 5 ? "🌱 Hopeful" :
      currentMonthEarly >= 6 && currentMonthEarly <= 8 ? "😍 Thriving" :
      currentMonthEarly >= 9 && currentMonthEarly <= 11 ? "🍅 Harvest Day" :
      "❄️ Winter Growing";
    const growthStage =
      currentMonthEarly >= 3 && currentMonthEarly <= 4 ? "Seedling" :
      currentMonthEarly >= 5 && currentMonthEarly <= 6 ? "Leaf Growth" :
      currentMonthEarly >= 7 && currentMonthEarly <= 8 ? "Flowering" :
      currentMonthEarly >= 9 && currentMonthEarly <= 10 ? "Fruit Forming" :
      "Harvest Ready";

    const response = await fetch(asset.uri);
const arrayBuffer = await response.arrayBuffer();

const fileExt =
  asset.uri.split(".").pop()?.toLowerCase() ||
  "jpg";

const contentType =
  asset.mimeType || "image/jpeg";

const filePath = `${user.id}/${Date.now()}.${fileExt}`;

const { error: uploadError } =
  await supabase.storage
    .from("journal-photos")
    .upload(filePath, arrayBuffer, {
      contentType,
      upsert: false,
    });

    if (uploadError) {
      console.log(
        "JOURNAL PHOTO UPLOAD ERROR:",
        uploadError
      );
      // Fall back to local URI so entry still saves
      const imageUrl = asset.uri;
      const entry = {
        id: Date.now().toString(),
        plantName,
        imageUri: imageUrl,
        storagePath: null,
        createdAt: new Date().toISOString(),
        mood,
        growthStage,
        daysSincePlanting: 1,
      };
      setJournalEntries((current) => [entry, ...current]);
      return;
    }
    const { data: publicUrlData } =
      supabase.storage
        .from("journal-photos")
        .getPublicUrl(filePath);

    const imageUrl =
      publicUrlData?.publicUrl || asset.uri;

const entry = {
  id: Date.now().toString(),
  plantName,
  imageUri: imageUrl,
  storagePath: filePath,
  createdAt: new Date().toISOString(),
  mood,
  growthStage,
  daysSincePlanting: 1,
};

setJournalEntries((current) => [
  entry,
  ...current,
]);

console.log(
  "Journal photo uploaded ✅"
);
} catch (error) {
  console.log(
    "Journal upload crash:",
    error
  );
  Alert.alert(
    "Upload failed",
    "Could not upload this journal photo."
  );
} finally {
  setUploadingPhoto(false);
}
}
function showUndoToast(message, onUndo) {
  if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  setUndoToast({
    message,
    onUndo: () => {
      onUndo();
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      setUndoToast(null);
    },
  });
  undoTimerRef.current = setTimeout(() => setUndoToast(null), 5000);
}
function deleteJournalEntry(entryId) {
  const removed = journalEntries.find((entry) => entry.id === entryId);
  if (!removed) return;
  tapHaptic("light");
  setJournalEntries((current) => current.filter((entry) => entry.id !== entryId));
  showUndoToast("Photo deleted", () => {
    setJournalEntries((current) => [removed, ...current].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ));
    setUndoToast(null);
  });
}

function buildWeeklyRecapBody() {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const photosThisWeek = (journalEntries || []).filter((e) => {
      const t = new Date(e.createdAt).getTime();
      return !Number.isNaN(t) && t >= weekAgo;
    }).length;

    const wateringsThisWeek = Object.values(wateringHistory || {}).reduce((sum, dates) => {
      if (!Array.isArray(dates)) return sum;
      return sum + dates.filter((d) => {
        const t = new Date(`${String(d).slice(0, 10)}T12:00:00`).getTime();
        return !Number.isNaN(t) && t >= weekAgo;
      }).length;
    }, 0);

    const streak = streakData?.count || 0;

    const parts = [
      wateringsThisWeek > 0 ? `💧 ${wateringsThisWeek} watering${wateringsThisWeek === 1 ? "" : "s"}` : null,
      photosThisWeek > 0 ? `📸 ${photosThisWeek} photo${photosThisWeek === 1 ? "" : "s"}` : null,
      streak > 0 ? `🔥 ${streak}-day streak` : null,
    ].filter(Boolean);

    // If they did nothing this week, nudge gently instead of showing zeros.
    if (!parts.length) {
      return "A fresh week in the garden starts today 🌱 Open Pocket Planter to check on your plants.";
    }
    return `This week: ${parts.join("  •  ")}. Tap to see your full garden recap 🌿`;
  }

  async function scheduleWeeklyRecap() {
    const granted = await ensureNotificationPermission();
    if (!granted) return false;
    await Notifications.cancelScheduledNotificationAsync("weekly-recap").catch(() => {});
    await Notifications.scheduleNotificationAsync({
      identifier: "weekly-recap",
      content: {
        title: "🌻 Your Garden Week",
        body: buildWeeklyRecapBody(),
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        repeats: true,
        weekday: 1, // Sunday (1=Sun ... 7=Sat in Expo's calendar trigger)
        hour: 18,
        minute: 0,
      },
    });
    return true;
  }

  async function cancelWeeklyRecap() {
    await Notifications.cancelScheduledNotificationAsync("weekly-recap").catch(() => {});
  }

async function togglePlantOfDay(value) {
    setPlantOfDayOn(value);
    if (value) {
      const granted = await ensureNotificationPermission();
      if (!granted) {
        Alert.alert("Notifications Disabled", "Enable notifications in your phone settings to get daily plant picks.");
        setPlantOfDayOn(false);
        return;
      }
      const ok = await scheduleDailyReminder({
        id: "plant-of-day",
        hour: 8,
        minute: 30,
        title: "🌱 Today's Plant Pick",
        body: "A fresh plant recommendation is waiting — open Pocket Planter to see what to grow today.",
      });
      if (ok) {
        Alert.alert("Plant of the Day On 🌱", "You'll get a daily plant pick every morning at 8:30 AM.");
      }
    } else {
      await cancelReminder("plant-of-day");
      Alert.alert("Plant of the Day Off", "You'll no longer get daily plant pick notifications.");
    }
  }

async function scheduleSnoozeSummary(snoozeMap) {
    // One combined morning notification for everything snoozed to tomorrow.
    const tomorrowKey = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const dueTomorrow = Object.entries(snoozeMap || {})
      .filter(([, key]) => key === tomorrowKey)
      .map(([name]) => name);

    await Notifications.cancelScheduledNotificationAsync("snooze-summary").catch(() => {});
    if (!dueTomorrow.length) return;

    const granted = await ensureNotificationPermission();
    if (!granted) return;

    const count = dueTomorrow.length;
    const preview = dueTomorrow.slice(0, 3).join(", ");
    const body = count <= 3
      ? `${preview} ${count === 1 ? "is" : "are"} ready for water 🌱`
      : `${preview}, and ${count - 3} more are ready for water 🌱`;

    const fireDate = new Date();
    fireDate.setDate(fireDate.getDate() + 1);
    fireDate.setHours(9, 0, 0, 0);

    await Notifications.scheduleNotificationAsync({
      identifier: "snooze-summary",
      content: {
        title: count === 1 ? "🌱 A plant is off snooze" : `🌱 ${count} plants are off snooze`,
        body,
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireDate },
    });
  }


async function scheduleFertilizerReminder(plantName, days) {
    const granted = await ensureNotificationPermission();
    if (!granted) {
      Alert.alert("Notifications Disabled", "Enable notifications in your phone settings to get fertilizer reminders.");
      return;
    }
    const fireDate = new Date();
    fireDate.setDate(fireDate.getDate() + days);
    fireDate.setHours(9, 0, 0, 0);
    const id = `fertilize-${plantName}-${Date.now()}`;
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: `🌾 Time to fertilize ${plantName}`,
        body: `It's been ${days} days since you last fed ${plantName}. Check if it's ready for another feeding.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireDate,
      },
    });
    Alert.alert("Reminder Set 🌾", `You'll get a reminder to fertilize ${plantName} in ${days} days.`);
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

  async function schedulePlantReminder(plantName) {
  if (!remindersOn) {
    Alert.alert(
      "Enable Reminders First",
      "Go to the Garden tab and turn on Watering Reminders before adding plant reminders.",
      [{ text: "OK" }]
    );
    return;
  }

  Alert.alert(
    `Set Reminder for ${plantName}`,
    "What time would you like your daily check-in reminder?",
    [
      {
        text: "7:00 AM",
        onPress: () => scheduleReminder(plantName, 7, 0),
      },
      {
        text: "8:00 AM",
        onPress: () => scheduleReminder(plantName, 8, 0),
      },
      {
        text: "9:00 AM",
        onPress: () => scheduleReminder(plantName, 9, 0),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]
  );
}

async function scheduleReminder(plantName, hour, minute) {
  try {
    const rainLikely = weather?.precipChance >= 65;
    const ok = await scheduleDailyReminder({
      id: `plant-${plantName}`,
      hour,
      minute,
      title: rainLikely
        ? `🌧️ Check on your ${plantName}`
        : `🌱 Good morning! Check on your ${plantName}`,
      body: rainLikely
        ? `Rain is expected today. Check soil moisture before watering your ${plantName}.`
        : `Time for your daily ${plantName} check-in. Water if the top inch of soil feels dry.`,
    });

    if (!ok) {
      Alert.alert(
        "Notifications Disabled",
        "Enable notifications in your phone settings to receive plant reminders."
      );
      return;
    }

    setWateringReminders((current) => ({
      ...current,
      [plantName]: { enabled: true, hour, minute },
    }));

    Alert.alert(
      "Reminder Set! 🌱",
      `You'll get a daily ${plantName} check-in at ${hour}:${minute === 0 ? "00" : minute} AM every morning.`
    );
  } catch (error) {
    console.log("Reminder error:", error);
    Alert.alert("Error", "Could not set reminder. Please try again.");
  }
}
async function claimDailyBonus() {
  const nowIso = new Date().toISOString();

  if (dailyBonusDate && (Date.now() - new Date(dailyBonusDate).getTime()) < 24 * 60 * 60 * 1000) {
    Alert.alert(
      "Already Claimed 🌱",
      "You already claimed your garden bonus. Come back in a bit!"
    );
    setDailyBonusClaimed(true);
    return;
  }

  const isStreakBonus = streakData?.count > 0 && streakData.count % 7 === 0;
  const xpAmount = isStreakBonus ? 100 : 25;

  await AsyncStorage.setItem(STORAGE_KEYS.dailyBonusDate, nowIso);
  setBonusXP(prev => prev + xpAmount);
  setDailyBonusDate(nowIso);
  setDailyBonusClaimed(true);
  setShowDailyBonus(true);
  successHaptic();

  const popup = { id: Date.now().toString(), amount: xpAmount };
  setXpPopups(current => [...current, popup]);
  setTimeout(() => {
    setXpPopups(current => current.filter(item => item.id !== popup.id));
  }, 1600);

  if (isStreakBonus) {
    Alert.alert(
      "🔥 7-Day Streak Bonus!",
      `Incredible! You've been gardening for ${streakData.count} days in a row. You earned 100 XP!`
    );
  }

  setTimeout(() => {
    setShowDailyBonus(false);
  }, 1800);
}

function markPlantWatered(plantName) {
    const today = getTodayKey();
    const alreadyWateredToday = wateredPlants[plantName] === today;

    if (alreadyWateredToday) {
      // ── Undo today's watering ──
      tapHaptic("light");
      setWateredPlants((current) => {
        const next = { ...current };
        delete next[plantName];
        return next;
      });
      setWateringHistory((current) => {
        const existing = Array.isArray(current[plantName]) ? current[plantName] : [];
        const trimmed = existing.filter((d) => String(d).slice(0, 10) !== today);
        return { ...current, [plantName]: trimmed };
      });
      return;
    }

    // ── Mark watered ──
    successHaptic();
    setWateredPlants((current) => ({ ...current, [plantName]: today }));
    setWateringHistory((current) => {
      const existing = Array.isArray(current[plantName]) ? current[plantName] : [];
      if (existing[existing.length - 1] === today) return current;
      const next = { ...current, [plantName]: [...existing, today] };
      const newStreak = getWateringStreak(plantName, next);
      const milestones = [7, 14, 30, 60, 100];
      if (milestones.includes(newStreak)) {
        Vibration.vibrate([0, 80, 60, 120]);
        successHaptic();
        const popup = { id: Date.now().toString(), amount: `🔥 ${newStreak}-day streak!` };
        setXpPopups((popups) => [...popups, popup]);
        setTimeout(() => {
          setXpPopups((popups) => popups.filter((item) => item.id !== popup.id));
        }, 2000);
        setTimeout(() => {
          Alert.alert(`🔥 ${newStreak}-Day Watering Streak!`, `Incredible consistency with ${plantName}. Keep it growing!`);
        }, 300);
      } else {
        Alert.alert("Watered", `${plantName} was marked watered for today.`);
      }
      return next;
    });
  }

  function waterAllPlants() {
    const today = getTodayKey();
    const unwatered = savedPlants.filter((name) => wateredPlants[name] !== today);
    if (!unwatered.length) {
      Alert.alert("All watered", "Every saved plant is already watered today. 🌱");
      return;
    }
    successHaptic();
    Vibration.vibrate(80);
    setWateredPlants((current) => {
      const next = { ...current };
      unwatered.forEach((name) => { next[name] = today; });
      return next;
    });
    setWateringHistory((current) => {
      const next = { ...current };
      unwatered.forEach((name) => {
        const existing = Array.isArray(next[name]) ? next[name] : [];
        if (existing[existing.length - 1] !== today) {
          next[name] = [...existing, today];
        }
      });
      return next;
    });
    const popup = { id: Date.now().toString(), amount: `💧 Watered ${unwatered.length} plants!` };
    setXpPopups((popups) => [...popups, popup]);
    setTimeout(() => {
      setXpPopups((popups) => popups.filter((item) => item.id !== popup.id));
    }, 2000);
  }

  function waterPlant(plantName) {
    if (!plantName) return;
    const today = getTodayKey();
    if (wateredPlants[plantName] === today) return;
    successHaptic();
    Vibration.vibrate(60);
    setWateredPlants((current) => ({ ...current, [plantName]: today }));
    setWateringHistory((current) => {
      const existing = Array.isArray(current[plantName]) ? current[plantName] : [];
      if (existing[existing.length - 1] === today) return current;
      return { ...current, [plantName]: [...existing, today] };
    });
    const popup = { id: Date.now().toString(), amount: `💧 Watered ${plantName}!` };
    setXpPopups((popups) => [...popups, popup]);
    setTimeout(() => {
      setXpPopups((popups) => popups.filter((item) => item.id !== popup.id));
    }, 2000);
  }

function logHarvest(plantName, amount, unit, note) {
  const entry = {
    id: Date.now().toString(),
    plantName,
    date: getTodayKey(),
    amount: amount || "",
    unit: unit || "",
    note: note || "",
    createdAt: new Date().toISOString(),
  };
  setHarvestLog((current) => [entry, ...current]);
  logZoneActivity(user, zone, plantName, "harvested");
  successHaptic();
  Vibration.vibrate([0, 80, 60, 120]);
  Alert.alert("Harvest logged! 🎉", `${plantName} harvest saved to your garden record.`);
}

function toggleFertilizerTracker(plantName) {
  setFertilizerTrackers((current) => {
    const next = { ...current };
    if (next[plantName]) {
      delete next[plantName];
    } else {
      next[plantName] = {
        enabled: true,
        lastFertilized: new Date().toISOString(),
      };
    }
    return next;
  });
}

function assignPlantToGardenSlot(slotId, plantName) {
  setGardenMap((current) => ({ ...current, [slotId]: plantName }));
}

function clearGardenSlot(slotId) {
  setGardenMap((current) => {
    const copy = { ...current };
    delete copy[slotId];
    return copy;
  });
}
function useStreakFreeze() {
  if (!streakFreeze.available) {
    Alert.alert("No freeze available", "You've already used your streak freeze this week. It refreshes at the start of next week. ❄️");
    return;
  }
  const today = getTodayKey();
  successHaptic();
  setStreakFreeze((current) => ({ ...current, available: false, lastUsed: today }));
  Alert.alert("Streak frozen! ❄️", "Your streak is protected for today. Even if you miss watering, it won't reset. Come back tomorrow!");
}
function snoozePlantWatering(plantName) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const key = tomorrow.toISOString().slice(0, 10);
  tapHaptic("light");
  setSnoozedPlants((current) => {
    const next = { ...current, [plantName]: key };
    scheduleSnoozeSummary(next);
    return next;
  });
  showUndoToast(`${plantName} snoozed until tomorrow`, () => {
    setSnoozedPlants((current) => {
      const next = { ...current };
      delete next[plantName];
      scheduleSnoozeSummary(next);
      return next;
    });
    setUndoToast(null);
  });
}
function waterArea(areaId) {
  const area = (gardenAreas || []).find((a) => a.id === areaId);
  if (!area) return;
  const today = getTodayKey();
  const names = Array.from(new Set(Object.values(area.plots || {}).filter(Boolean)));
  const unwatered = names.filter((name) => wateredPlants[name] !== today);
  if (!unwatered.length) {
    Alert.alert("All watered", `Every plant in ${area.name} is already watered today. 🌱`);
    return;
  }
  successHaptic();
  Vibration.vibrate(80);
  setWateredPlants((current) => {
    const next = { ...current };
    unwatered.forEach((name) => { next[name] = today; });
    return next;
  });
  setWateringHistory((current) => {
    const next = { ...current };
    unwatered.forEach((name) => {
      const existing = Array.isArray(next[name]) ? next[name] : [];
      if (existing[existing.length - 1] !== today) next[name] = [...existing, today];
    });
    return next;
  });
  const popup = { id: Date.now().toString(), amount: `💧 Watered ${area.name}!` };
  setXpPopups((popups) => [...popups, popup]);
  setTimeout(() => {
    setXpPopups((popups) => popups.filter((item) => item.id !== popup.id));
  }, 2000);
}
const SUCCESSION_INTERVALS = [
  { match: ["radish"], days: 10 },
  { match: ["arugula", "mesclun"], days: 10 },
  { match: ["lettuce"], days: 14 },
  { match: ["spinach"], days: 14 },
  { match: ["cilantro", "coriander"], days: 14 },
  { match: ["bean"], days: 14 },
  { match: ["pea"], days: 14 },
  { match: ["turnip"], days: 14 },
  { match: ["beet"], days: 21 },
  { match: ["carrot"], days: 21 },
  { match: ["green onion", "scallion"], days: 21 },
  { match: ["basil"], days: 21 },
  { match: ["kale"], days: 21 },
];
function getSuccessionInterval(plantName) {
  const n = String(plantName || "").toLowerCase();
  const hit = SUCCESSION_INTERVALS.find((row) => row.match.some((w) => n.includes(w)));
  return hit ? hit.days : null;
}
function getWaterTriage(savedPlants, wateringHistory, wateringAmounts) {
  const rows = (savedPlants || [])
    .map((name) => {
      const item = produceData.find((p) => p.name === name);
      if (!item) return null;
      const info = getNextWaterInfo(name, item, wateringHistory);
      if (!info) return null;
      // Normalize "days until next water": negative/zero = due or overdue.
      const d = typeof info.daysUntil === "number" ? info.daysUntil : null;
      if (d === null) return null;
      let bucket;
      if (d < 0) bucket = "overdue";
      else if (d === 0) bucket = "today";
      else if (d === 1) bucket = "tomorrow";
      else return null; // not urgent — leave it off the queue
      return { name, item, info, daysUntil: d, bucket };
    })
    .filter(Boolean);
  const order = { overdue: 0, today: 1, tomorrow: 2 };
  return rows.sort((a, b) => {
    if (order[a.bucket] !== order[b.bucket]) return order[a.bucket] - order[b.bucket];
    return a.daysUntil - b.daysUntil; // most overdue first within a bucket
  });
}
function getWaterTriage(savedPlants, wateringHistory, wateringAmounts) {
  const rows = (savedPlants || [])
    .map((name) => {
      const item = produceData.find((p) => p.name === name);
      if (!item) return null;
      const info = getNextWaterInfo(name, item, wateringHistory);
      if (!info) return null;
      const d = typeof info.daysUntil === "number" ? info.daysUntil : null;
      if (d === null) return null;
      let bucket;
      if (d < 0) bucket = "overdue";
      else if (d === 0) bucket = "today";
      else if (d === 1) bucket = "tomorrow";
      else return null;
      return { name, item, info, daysUntil: d, bucket };
    })
    .filter(Boolean);
  const order = { overdue: 0, today: 1, tomorrow: 2 };
  return rows.sort((a, b) => {
    if (order[a.bucket] !== order[b.bucket]) return order[a.bucket] - order[b.bucket];
    return a.daysUntil - b.daysUntil;
  });
}
function getSuccessionInfo(name, item, zone, sowLog) {
  const interval = getSuccessionInterval(name);
  if (!interval) return null;
  // Only nudge while the crop is actually in its planting window.
  if (getPlantSeasonLabel(item, zone) !== "Plant now") return null;
  const last = sowLog?.[name];
  if (!last) return { interval, status: "start", daysSince: null, daysUntil: null };
  const lastDate = new Date(`${String(last).slice(0, 10)}T12:00:00`);
  const now = new Date(); now.setHours(12, 0, 0, 0);
  const daysSince = Math.round((now - lastDate) / (1000 * 60 * 60 * 24));
  if (daysSince >= interval) return { interval, status: "due", daysSince, daysUntil: 0 };
  return { interval, status: "waiting", daysSince, daysUntil: interval - daysSince };
}

const COMPANION_NAME_ALIASES = {
  "bean": "Green Bean",
  "beans": "Green Bean",
  "squash": "Zucchini",
  "melon": "Watermelon",
  "grape": "Grapes",
};
function resolveCompanionPlant(name) {
  const raw = String(name || "").toLowerCase();
  const aliased = COMPANION_NAME_ALIASES[raw] || name;
  return produceData.find(
    (p) => String(p.name).toLowerCase() === String(aliased).toLowerCase()
  ) || null;
}

function getCompanionDisplayName(name) {
  const plant = resolveCompanionPlant(name);
  return plant ? plant.name : name;
}

function getCompanionImage(name) {
  const plant = resolveCompanionPlant(name);
  return plant ? resolvePlantImageSource(plant) : null;
}

function getPlantFamily(plantName) {
  const n = String(plantName || "").toLowerCase();
  if (["tomato", "pepper", "eggplant", "potato"].some((w) => n.includes(w))) return "Nightshade";
  if (["cabbage", "broccoli", "cauliflower", "kale", "bok"].some((w) => n.includes(w))) return "Brassica";
  if (["bean", "pea"].some((w) => n.includes(w))) return "Legume";
  if (["onion", "garlic", "leek"].some((w) => n.includes(w))) return "Allium";
  if (["cucumber", "squash", "zucchini", "pumpkin", "melon", "watermelon"].some((w) => n.includes(w))) return "Cucurbit";
  if (["carrot", "beet", "radish", "turnip", "parsnip"].some((w) => n.includes(w))) return "Root";
  return null; // herbs, fruit, etc. — not rotation-sensitive
}
function assignPlantToAreaSlot(areaId, slotId, plantName) {
  setGardenAreas((current) =>
    current.map((area) =>
      area.id === areaId
        ? { ...area, plots: { ...area.plots, [slotId]: plantName } }
        : area
    )
  );
  // Record this planting into rotation history (families only).
  try {
    const family = getPlantFamily(plantName);
    if (family) {
      const now = new Date();
      const monthNum = now.getMonth() + 1;
      const season =
        monthNum >= 3 && monthNum <= 5 ? "Spring"
        : monthNum >= 6 && monthNum <= 8 ? "Summer"
        : monthNum >= 9 && monthNum <= 11 ? "Fall"
        : "Winter";
      const todayKey = `${now.getFullYear()}-${String(monthNum).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const entry = { family, plant: plantName, season, year: now.getFullYear(), dateKey: todayKey };
      setAreaHistory((current) => {
        const existing = Array.isArray(current[areaId]) ? current[areaId] : [];
        const already = existing.some((e) => e.family === family && e.season === season && e.year === entry.year);
        if (already) return current;
        return { ...current, [areaId]: [...existing, entry] };
      });
    }
  } catch (e) {
    console.log("area history record skipped:", e?.message);
  }
  // Warn if this plant conflicts with others already in the same area
  const area = (gardenAreas || []).find((a) => a.id === areaId);
  if (area) {
    const neighbors = Object.entries(area.plots || {})
      .filter(([sid, name]) => sid !== slotId && name && name !== plantName)
      .map(([, name]) => name);
    const conflicts = Array.from(new Set(neighbors)).filter((neighbor) => {
      const result = getCompatibilityScore(plantName, neighbor);
      return result && result.label === "Avoid"; // guard against undefined
    });
    if (conflicts.length > 0) {
      const conflictList = conflicts.slice(0, 3).join(", ");
      setTimeout(() => {
        Alert.alert(
          "⚠️ Companion conflict",
          `${plantName} doesn't pair well with ${conflictList} in the same bed — they can compete or attract the same pests. It's still planted; just something to keep in mind.`,
          [{ text: "Got it" }]
        );
      }, 300);
    }
  }
}

function clearAreaSlot(areaId, slotId) {
  setGardenAreas((current) =>
    current.map((area) => {
      if (area.id !== areaId) return area;
      const nextPlots = { ...area.plots };
      delete nextPlots[slotId];
      return { ...area, plots: nextPlots };
    })
  );
}

const AREA_TAG_PRESETS = [
  { emoji: "🌿", color: "#5cff89" },
  { emoji: "🌻", color: "#ffd86b" },
  { emoji: "🪴", color: "#8effab" },
  { emoji: "🍅", color: "#ff7b7b" },
  { emoji: "🌸", color: "#ffb6c1" },
  { emoji: "🏡", color: "#6bc7ff" },
  { emoji: "🌵", color: "#a3d5ff" },
  { emoji: "🍓", color: "#ff9f43" },
];

function addGardenArea(name, size) {
  const clean = String(name || "").trim();
  if (!clean) return;
  const safeSize = Math.max(1, Math.min(12, Number(size) || 12));
  setGardenAreas((current) => {
    // Rotate through presets so each new area looks distinct.
    const preset = AREA_TAG_PRESETS[current.length % AREA_TAG_PRESETS.length];
    // Hanging planters (size 1) get a plain blue tag with no emoji.
    const emoji = safeSize === 1 ? " " : preset.emoji;
    const color = safeSize === 1 ? "#6bc7ff" : preset.color;
    return [
      ...current,
      { id: `area-${Date.now()}`, name: clean, plots: {}, emoji, color, size: safeSize },
    ];
  });
  successHaptic();
}

async function pickAreaPhoto(areaId) {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) { Alert.alert("Photos Permission Needed", "Allow photo access to add a garden photo."); return; }
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, allowsEditing: true, aspect: [1, 1] });
  if (!result.canceled && result.assets?.[0]?.uri) {
    setAreaStyle(areaId, { photo: result.assets[0].uri });
  }
}

function setAreaStyle(areaId, patch) {
  setGardenAreas((current) =>
    current.map((area) =>
      area.id === areaId ? { ...area, ...patch } : area
    )
  );
  tapHaptic("light");
}

function renameGardenArea(areaId, name) {
  const clean = String(name || "").trim();
  if (!clean) return;
  setGardenAreas((current) =>
    current.map((area) =>
      area.id === areaId ? { ...area, name: clean } : area
    )
  );
}

function deleteGardenArea(areaId) {
  Alert.alert(
    "Delete this area?",
    "This removes the area and everything planted in it. This cannot be undone.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setGardenAreas((current) => current.filter((area) => area.id !== areaId)),
      },
    ]
  );
}

async function onPullRefresh() {
  setRefreshing(true);
  try {
    setZipCoords(null);
    setWeatherRefreshToken((value) => value + 1);
    if (user && cloudProfileLoaded) {
      await loadProfileFromSupabase();
    }
  } catch (error) {
    console.log("Refresh error:", error);
  } finally {
    setTimeout(() => setRefreshing(false), 900);
  }
}

async function detectLocationAndZone() {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Location Denied", "Allow location access to auto-detect your growing zone.");
      return;
    }
    const position = await Location.getCurrentPositionAsync({});
    const reverse = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    const postalCode = reverse?.[0]?.postalCode;
    if (!postalCode) {
      Alert.alert("ZIP Not Found", "Pocket Planter couldn't detect your ZIP code.");
      return;
    }
    setZip(postalCode);
  } catch (error) {
    console.log(error);
    Alert.alert("Location Error", "Unable to detect your location right now.");
  }
}

  // ── Weather ────────────────────────────────────────────────────────────────
  useEffect(() => {
  async function loadWeather() {
    if (!record || zip.length !== 5) {
      setWeather(null);
      return;
    }
    try {
      let coords = zipCoords;
if (!coords) {
  const zipResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=US&format=json&limit=1`,
    { headers: { "Accept": "application/json", "User-Agent": "PocketPlanter/1.0" } }
  );
  const zipText = await zipResponse.text();
  let zipData;
  try {
    zipData = JSON.parse(zipText);
  } catch (e) {
    setWeather(null);
    return;
  }
  const zipPlace = zipData?.[0];
  if (!zipPlace?.lat || !zipPlace?.lon) {
    setWeather(null);
    return;
  }
  coords = { lat: zipPlace.lat, lon: zipPlace.lon };
  setZipCoords(coords);
}
const weatherResponse = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`
);
const weatherData = await weatherResponse.json();
const forecast = (weatherData?.daily?.time || []).map((date, index) => ({
  date,
  maxTempF: weatherData?.daily?.temperature_2m_max?.[index] ?? null,
  minTempF: weatherData?.daily?.temperature_2m_min?.[index] ?? null,
  precipChance: weatherData?.daily?.precipitation_probability_max?.[index] ?? 0,
}));
setWeather({
  maxTempF: forecast[0]?.maxTempF ?? null,
  minTempF: forecast[0]?.minTempF ?? null,
  precipChance: forecast[0]?.precipChance ?? 0,
  forecast,
});
    } catch (error) {
      console.log("Weather load error", error);
      setWeather(null);
    }
  }
loadWeather();
}, [zip, record, weatherRefreshToken]);

useEffect(() => {
    if (!dailyWateringOn) return;
    if (!weather) return;
    (async () => {
      const rainSkip = getRainSkipToday(weather);
      if (rainSkip) {
        await cancelReminder("daily-watering");
      } else {
        await scheduleDailyReminder({
          id: "daily-watering",
          hour: wateringReminderTime.hour,
          minute: wateringReminderTime.minute,
          title: "💧 Daily Watering Check",
          body: "Time to check your garden and water any plants that need moisture today.",
        });
      }
    })();
  }, [dailyWateringOn, weather?.precipChance]);

  useEffect(() => {
    if (!frostAlertsOn) return;
    const frost = getUpcomingFrost(weather);
    if (!frost) return;
    if (lastFrostAlertDate.current === frost.date) return;
    lastFrostAlertDate.current = frost.date;
    const whenText =
      frost.daysOut === 0 ? "tonight"
      : frost.daysOut === 1 ? "tomorrow night"
      : `in ${frost.daysOut} days`;
    (async () => {
      const granted = await ensureNotificationPermission();
      if (!granted) return;
      await Notifications.scheduleNotificationAsync({
        identifier: "frost-detected",
        content: {
          title: `❄️ Frost expected ${whenText}`,
          body: `Low of ${Math.round(frost.minTempF)}°F coming — cover tender plants and move containers to shelter before dark.`,
          sound: true,
        },
        trigger: null,
      });
    })();
  }, [weather, frostAlertsOn]);
  // ── RevenueCat (stubbed for Expo Go) ───────────────────────────────────────
  useEffect(() => {
    async function configureRevenueCat() {
      try {
        if (__DEV__) { console.log("RevenueCat skipped in Expo Go/dev mode."); return; }
        Purchases.configure({ apiKey: Platform.OS === "ios" ? "appl_VbBnWNAWlOPeunWblgSNQbUXFjR" : "YOUR_REAL_REVENUECAT_ANDROID_KEY" });
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          const hasPro = !!customerInfo.entitlements.active["Pocket Planter Pro"];
          setPremiumUnlocked(hasPro);
        } catch (reconcileError) {
          console.log("Entitlement reconcile skipped:", reconcileError);
        }
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
      tapHaptic("light");
      if (current.includes(name)) return current.filter((item) => item !== name);
      if (!premiumUnlocked && current.length >= 5) {
        Alert.alert("Premium saves locked", "Free users can save up to 5 plants. Upgrade to Premium to save unlimited plants.", [{ text: "Maybe later", style: "cancel" }, { text: "View Premium", onPress: () => jumpToTab("premium") }]);
        return current;
      }
      if (current.length === 0) {
        (async () => {
          try {
            const seen = await AsyncStorage.getItem("pp_firstSaveSeen");
            if (!seen) {
              await AsyncStorage.setItem("pp_firstSaveSeen", "true");
              successHaptic();
              Vibration.vibrate([0, 80, 60, 120]);
              setShowFirstSave(true);
              setTimeout(() => setShowFirstSave(false), 3200);
            }
          } catch (error) {
            console.log("First save celebration skipped:", error);
          }
        })();
      }
      const next = [...current, name].sort();
      logZoneActivity(user, zone, name, "saved");
      setPlantSaveDates((current) => (current[name] ? current : { ...current, [name]: getTodayKey() }));
      if (next.length === 5) {
        setTimeout(() => { maybeAskForReview(); }, 800);
      }
      return next;
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
      successHaptic();
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

  const hasInitializedAchievements = useRef(false);

useEffect(() => {
  if (!cloudProfileLoaded) return;

  if (!hasInitializedAchievements.current) {
    hasInitializedAchievements.current = true;
    const allCurrentlyUnlocked = achievementBadges
      .filter(badge => badge.unlocked)
      .map(badge => badge.id);
    setShownAchievements(current => {
      const merged = Array.from(new Set([...current, ...allCurrentlyUnlocked]));
      return merged;
    });
    return;
  }

  const newlyUnlocked = achievementBadges.find(
    (badge) => badge.unlocked && !shownAchievements.includes(badge.id)
  );

  if (!newlyUnlocked) return;

  successHaptic();
  Alert.alert(
    "Achievement Unlocked! 🎉",
    `You completed: ${newlyUnlocked.title}`
  );

  setShownAchievements((current) => [...current, newlyUnlocked.id]);
}, [
  achievementBadges,
  shownAchievements,
  cloudProfileLoaded,
]);

const glowOpacity =
  glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.95],
  });

function jumpToTab(tab) {
  setActiveTab(tab);
  setSelectedPlant(null);

  setTimeout(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  }, 50);
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
    const inCatalog = (item) => resolveCompanionPlant(item) !== null;
    const excellentCompanions = (Array.isArray(companionInfo.excellent) ? companionInfo.excellent : []).filter(inCatalog);
    const neutralCompanions = (Array.isArray(companionInfo.neutral) ? companionInfo.neutral : []).filter(inCatalog);
    const avoidCompanions = (Array.isArray(companionInfo.avoid) ? companionInfo.avoid : []).filter(inCatalog);
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
  <Text style={styles.cardEyebrow}>Daily controls</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="💧"
      title="Garden Actions"
      description="Mark watering, set reminders, and log progress photos for every plant in your garden."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <View style={styles.harvestTrackerCard}>
        <Text style={styles.harvestTrackerEmoji}>🚜</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.harvestTrackerTitle}>Harvest Tracker</Text>
          <Text style={styles.harvestTrackerText}>
            {harvestTracker
              ? harvestDaysLeft === 0
                ? "Ready to harvest!"
                : `Ready in ${harvestDaysLeft} days`
              : getHarvestCountdown(selectedPlant)}
          </Text>
        </View>
        <Pressable
          style={styles.harvestTrackerButton}
          onPress={() => {
            setHarvestTrackers((current) => ({
              ...current,
              [selectedPlant.name]: {
                startedAt: new Date().toISOString(),
                days: Number(getHarvestCountdown(selectedPlant).match(/\d+/)?.[0]) || 75,
              },
            }));
            Alert.alert("Harvest Tracker Started", `${selectedPlant.name} is now being tracked.`);
          }}
        >
          <Text style={styles.harvestTrackerButtonText}>
            {harvestTracker ? "Restart" : "Start"}
          </Text>
        </Pressable>
      </View>
      <Pressable
        onPress={() => {
          Alert.prompt(
            "Log Harvest 🎉",
            `How much ${selectedPlant.name} did you harvest? (e.g. "6 tomatoes" or "2 lbs")`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Log It",
                onPress: (text) => logHarvest(selectedPlant.name, text || "", "", ""),
              },
            ],
            "plain-text"
          );
        }}
        style={{ marginTop: 12, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}
      >
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>🎉 Log a Harvest</Text>
      </Pressable>
      <View style={styles.harvestTrackerCard}>
        <Text style={styles.harvestTrackerEmoji}>🌾</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.harvestTrackerTitle}>Fertilizer Tracker</Text>
          <Text style={styles.harvestTrackerText}>
            {fertilizerTrackers[selectedPlant.name]
              ? `Last fed ${new Date(fertilizerTrackers[selectedPlant.name].lastFertilized).toLocaleDateString()}`
              : "Track fertilizer applications"}
          </Text>
        </View>
        <Pressable
          style={styles.harvestTrackerButton}
          onPress={() => toggleFertilizerTracker(selectedPlant.name)}
        >
          <Text style={styles.harvestTrackerButtonText}>
            {fertilizerTrackers[selectedPlant.name] ? "Tracking" : "Start"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.detailControlGrid}>
        <Pressable
          onPress={() => markPlantWatered(selectedPlant.name)}
          style={[styles.controlTile, wateringCompletedToday && styles.controlTileActive]}
        >
          <Text style={styles.controlTileIcon}>💧</Text>
          <Text style={[styles.controlTileTitle, wateringCompletedToday && styles.controlTileTitleActive]}>
            {wateringCompletedToday ? "Watered" : "Mark watered"}
          </Text>
          <Text style={styles.controlTileSubtext}>
            {getLastWateredText(selectedPlant.name, wateredPlants, wateringHistory)}
          </Text>
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

{(() => {
        const nextWater = getNextWaterInfo(selectedPlant.name, selectedPlant, wateringHistory, wateredPlants, weather);
        const heat = weather?.maxTempF >= 95;
        const rain = weather?.precipChance >= 65;

        // Not yet watered — invite the user to start the tracking loop.
        if (!nextWater) {
          return (
            <View style={{ marginTop: 14, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(107,199,255,0.10)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.22)" }}>
              <Text style={{ fontSize: 26 }}>🔮</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>WATERING FORECAST</Text>
                <Text style={{ color: "#d7ebdc", fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 3 }}>
                  Water {selectedPlant.name} once and Pocket Planter will predict its next watering day based on the weather.
                </Text>
              </View>
            </View>
          );
        }

        const accent =
          nextWater.urgency === "due" ? "#6bc7ff"
          : nextWater.urgency === "soon" ? "#ffd86b"
          : "#8effab";

        // Weather-driven context line beneath the forecast.
        const context =
          rain ? "🌧️ Rain is expected soon — check the soil before watering, it may not need it."
          : heat ? "🔥 High heat is speeding up drying, so this plant is watered a day sooner than usual."
          : `On a normal schedule this plant wants water about every ${nextWater.interval} days.`;

        return (
          <View style={{ marginTop: 14, backgroundColor: `${accent}12`, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: `${accent}33` }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={{ fontSize: 26 }}>🔮</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: accent, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>WATERING FORECAST</Text>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900", marginTop: 2 }}>{nextWater.label}</Text>
              </View>
            </View>
            <Text style={{ color: "#d7ebdc", fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 10 }}>
              {context}
            </Text>
          </View>
        );
      })()}

    </>
  )}
</View>

<PlantGrowthTimeline
  theme={theme}
  plant={selectedPlant}
  journalEntries={journalEntries}
  premiumUnlocked={premiumUnlocked}
  onAddPhoto={() => pickJournalPhoto(selectedPlant.name)}
  onUnlock={() => jumpToTab("premium")}
/>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>Smart Care!</Text>
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
  <Text style={styles.cardEyebrow}>Step by step</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="🌱"
      title="How to Plant"
      description="Get step-by-step planting guides tailored to every plant in your zone."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    getPlantingSteps(selectedPlant).map((step, index) => (
      <View
        key={`${selectedPlant.name}-step-${index}`}
        style={styles.stepRow}
      >
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{index + 1}</Text>
        </View>
        <Text style={styles.stepText}>{step}</Text>
      </View>
    ))
  )}
</View>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>Personal garden notes</Text>
  <TextInput
    multiline
    placeholder={`Write notes about ${selectedPlant.name}...`}
    placeholderTextColor="#8fbf9d"
    value={plantNotes[selectedPlant.name] || ""}
    onChangeText={(text) => setPlantNotes((current) => ({ ...current, [selectedPlant.name]: text }))}
    style={styles.plantNotesInput}
  />
</View>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>🌿 Companion Intelligence</Text>
  <Text style={[styles.cardText, { marginBottom: 4 }]}>
  </Text>
  {!premiumUnlocked ? (
   <PremiumLockedCard
      theme={theme}
      title="Companion planting locked"
      body="Unlock premium to see excellent pairs, plants to avoid, pest prevention tips, and companion search."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      {/* EXCELLENT PAIRS */}
      <View style={styles.companionSectionHeader}>
        <Text style={styles.companionSectionEmoji}>🟢</Text>
        <Text style={styles.companionSectionTitle}>Plant These Together</Text>
      </View>
      <Text style={[styles.cardText, { marginBottom: 12, marginTop: 0 }]}>
        These plants thrive when grown near {selectedPlant.name}.
      </Text>
      <View style={styles.companionExcellentGrid}>
        {excellentCompanions.map((item) => (
          <Pressable
            key={`excellent-${item}`}
            onPress={() => openPlantByName(item)}
            style={styles.companionExcellentCard}
          >
            <View style={styles.companionExcellentIconWrap}>
              {getCompanionImage(item) ? (
                <Image source={getCompanionImage(item)} style={{ width: 34, height: 34 }} resizeMode="contain" />
              ) : (
                <Text style={styles.companionExcellentIcon}>🌱</Text>
              )}
            </View>
            <Text style={styles.companionExcellentName}>{getCompanionDisplayName(item)}</Text>
            <View style={styles.companionExcellentBadge}>
              <Text style={styles.companionExcellentBadgeText}>✓ Great Pair</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* NEUTRAL */}
      <View style={styles.companionSectionHeader}>
        <Text style={styles.companionSectionEmoji}>🟡</Text>
        <Text style={styles.companionSectionTitle}>Neutral Neighbors</Text>
      </View>
      <Text style={[styles.cardText, { marginBottom: 12, marginTop: 0 }]}>
        These plants can grow nearby without major benefits or issues.
      </Text>
      <View style={styles.companionExcellentGrid}>
        {neutralCompanions.map((item) => (
          <Pressable
            key={`neutral-${item}`}
            onPress={() => openPlantByName(item)}
            style={styles.companionExcellentCard}
          >
            <View style={styles.companionExcellentIconWrap}>
              {getCompanionImage(item) ? (
                <Image source={getCompanionImage(item)} style={{ width: 34, height: 34 }} resizeMode="contain" />
              ) : (
                <Text style={styles.companionExcellentIcon}>🌱</Text>
              )}
            </View>
            <Text style={styles.companionExcellentName}>{getCompanionDisplayName(item)}</Text>
            <View style={[styles.companionExcellentBadge, { backgroundColor: "rgba(255,216,107,0.18)" }]}>
              <Text style={[styles.companionExcellentBadgeText, { color: "#ffd86b" }]}>🟡 OK Nearby</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* AVOID */}
      <View style={styles.companionSectionHeader}>
        <Text style={styles.companionSectionEmoji}>🔴</Text>
        <Text style={styles.companionSectionTitle}>Keep These Away</Text>
      </View>
      <Text style={[styles.cardText, { marginBottom: 12, marginTop: 0 }]}>
        Avoid planting these too close to {selectedPlant.name}.
      </Text>
      <View style={styles.companionAvoidGrid}>
        {avoidCompanions.map((item) => (
          <Pressable
            key={`avoid-${item}`}
            onPress={() => openPlantByName(item)}
            style={styles.companionAvoidCard}
          >
            {getCompanionImage(item) ? (
              <View style={{ width: 34, height: 34 }}>
                <Image source={getCompanionImage(item)} style={{ width: 34, height: 34 }} resizeMode="contain" />
                <View style={{ position: "absolute", top: -6, right: -6, backgroundColor: "#ff7b7b", borderRadius: 999, width: 18, height: 18, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "#1a0e0e" }}>
                  <Text style={{ fontSize: 10, fontWeight: "900", color: "#fff" }}>!</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.companionAvoidIcon}>⚠️</Text>
            )}
            <Text style={styles.companionAvoidName}>{getCompanionDisplayName(item)}</Text>
            <Text style={styles.companionAvoidSub}>Keep apart</Text>
          </Pressable>
        ))}
      </View>

      {/* WARNING BOX */}
      {avoidCompanions.length > 0 ? (
        <View style={styles.companionWarningBox}>
          <Text style={styles.companionWarningIcon}>⚠️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.companionWarningTitle}>Spacing Warning</Text>
            <Text style={styles.companionWarningText}>
              {selectedPlant.name} may compete with {avoidCompanions[0]} or share pest and disease risks. Give them plenty of space in your garden layout.
            </Text>
          </View>
        </View>
      ) : null}

      {/* PEST TIP */}
      <View style={styles.companionPestBox}>
        <Text style={styles.companionPestTitle}>🐛 Pest Prevention</Text>
        <Text style={styles.companionPestText}>{pestTip}</Text>
      </View>
    </>
  )}
</View>

<PlantingGuideCard theme={theme} plant={selectedPlant} />

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>Shop & Supply</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="🛒"
      title="Where to Buy"
      description="Find seeds, fertilizer, and supplies for this plant — with links to Amazon, Park Seed, Home Depot, and local garden centers."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={styles.cardText}>
        Find seeds, fertilizer, and supplies for {selectedPlant.name} near ZIP code {zip || "your area"}.
      </Text>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(selectedPlant.name + " seeds")}`)}
      >
        <Text style={styles.shopLinkIcon}>📦</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Buy {selectedPlant.name} Seeds on Amazon</Text>
          <Text style={styles.shopLinkSub}>Ships to your door</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(selectedPlant.name + " fertilizer")}`)}
      >
        <Text style={styles.shopLinkIcon}>🧪</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Buy {selectedPlant.name} Fertilizer on Amazon</Text>
          <Text style={styles.shopLinkSub}>Specific nutrients for this plant</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.parkseed.com/search?q=${encodeURIComponent(selectedPlant.name)}`)}
      >
        <Text style={styles.shopLinkIcon}>🪴</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Shop {selectedPlant.name} at Park Seed</Text>
          <Text style={styles.shopLinkSub}>Trusted seed catalog since 1868</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.google.com/maps/search/garden+center+near+${zip || "me"}`)}
      >
        <Text style={styles.shopLinkIcon}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Find Garden Centers Near {zip || "You"}</Text>
          <Text style={styles.shopLinkSub}>Local stores near your ZIP code</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.homedepot.com/s/${encodeURIComponent(selectedPlant.name + " plant")}`)}
      >
        <Text style={styles.shopLinkIcon}>🏠</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Shop at Home Depot Garden Center</Text>
          <Text style={styles.shopLinkSub}>Check local availability</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
    </>
  )}
</View>

<View style={styles.card}>
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
  if (!user) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" />
        <BackgroundDecoration isDark={isDark} />
        <View style={styles.authScreen}>
          <Text style={styles.authTitle}>🌱 Pocket Planter</Text>
          <Text style={styles.authSubtitle}>
            {authMode === "signup" ? "Create your garden account" : "Log in to your garden account"}
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#8fbf9d"
            style={[styles.input, styles.authInput, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#8fbf9d"
            style={[styles.input, styles.authInput, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
          />

          <Pressable
  style={({ pressed }) => [
    styles.authButton,
    pressed && { opacity: 0.8 },
  ]}
  onPress={handleAuth}
>
  <Text style={styles.authButtonText}>
    {authMode === "signup" ? "Sign Up" : "Log In"}
  </Text>
</Pressable>

<Pressable
  style={styles.authSwitchButton}
  onPress={() =>
    setAuthMode(
      authMode === "signup" ? "login" : "signup"
    )
  }
>
  <Text style={styles.authSwitchText}>
    {authMode === "signup"
      ? "Already have an account? Log in"
      : "Need an account? Sign up"}
  </Text>
</Pressable>

{authMode === "login" ? (
  <Pressable
    style={styles.authSwitchButton}
    onPress={handleForgotPassword}
  >
    <Text style={styles.authSwitchText}>
      Forgot password?
    </Text>
  </Pressable>
) : null}
        </View>
      </SafeAreaView>
    );
  }

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

    {undoToast ? (
      <View style={{ position: "absolute", bottom: 96, left: 16, right: 16, zIndex: 900, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(16,41,23,0.98)", borderRadius: 18, paddingVertical: 14, paddingHorizontal: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.30)", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 20 }}>
        <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800", flex: 1 }}>{undoToast.message}</Text>
        <Pressable onPress={undoToast.onUndo} hitSlop={10} style={{ marginLeft: 12, backgroundColor: "#5cff89", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 9 }}>
          <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>Undo</Text>
        </Pressable>
      </View>
    ) : null}

  {showStreakCelebration ? (
      <View style={styles.levelUpOverlay}>
        <ConfettiBurst />
        <View style={styles.levelUpCard}>
          <Text style={styles.levelUpEmoji}>🔥</Text>
          <Text style={styles.levelUpTitle}>{showStreakCelebration}-DAY STREAK!</Text>
          <Text style={styles.levelUpText}>You've opened Pocket Planter {showStreakCelebration} days in a row. Incredible consistency! 🌱</Text>
        </View>
      </View>
    ) : null}
    {milestoneCelebration ? (
      <Pressable onPress={() => setMilestoneCelebration(null)} style={styles.levelUpOverlay}>
        <ConfettiBurst />
        <View style={styles.levelUpCard}>
          <Text style={styles.levelUpEmoji}>{milestoneCelebration.emoji}</Text>
          <Text style={styles.levelUpTitle}>{milestoneCelebration.title}</Text>
          <Text style={styles.levelUpText}>{milestoneCelebration.text}</Text>
          <Text style={[styles.levelUpText, { fontSize: 13, marginTop: 8, opacity: 0.7 }]}>Tap anywhere to close</Text>
        </View>
      </Pressable>
    ) : null}
    {showAnniversary ? (
      <Pressable onPress={() => setShowAnniversary(null)} style={styles.levelUpOverlay}>
        <ConfettiBurst />
        <View style={styles.levelUpCard}>
          <Text style={styles.levelUpEmoji}>🎉</Text>
          <Text style={styles.levelUpTitle}>
            {showAnniversary >= 365 ? "1 YEAR!" : `${showAnniversary} DAYS!`}
          </Text>
          <Text style={styles.levelUpText}>
            {showAnniversary >= 365
              ? "You've been growing with Pocket Planter for a whole year. What a journey! 🌳"
              : `You've been gardening with Pocket Planter for ${showAnniversary} days. Your garden has come so far! 🌱`}
          </Text>
          <Text style={[styles.levelUpText, { fontSize: 13, marginTop: 8, opacity: 0.7 }]}>Tap anywhere to close</Text>
        </View>
      </Pressable>
    ) : null}
    {showFirstSave ? (
      <Pressable onPress={() => setShowFirstSave(false)} style={styles.levelUpOverlay}>
        <ConfettiBurst />
        <View style={styles.levelUpCard}>
          <Text style={styles.levelUpEmoji}>🌱</Text>
          <Text style={styles.levelUpTitle}>FIRST PLANT!</Text>
          <Text style={styles.levelUpText}>You just saved your very first plant. Welcome to your garden journey! 🌿</Text>
          <Text style={[styles.levelUpText, { fontSize: 13, marginTop: 8, opacity: 0.7 }]}>Tap anywhere to close</Text>
        </View>
      </Pressable>
    ) : null}
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onScroll={(event) => {
        const y = event.nativeEvent.contentOffset.y;
        currentScrollY.current = y;
        if (y > 600 && !showScrollTop) setShowScrollTop(true);
        else if (y <= 600 && showScrollTop) setShowScrollTop(false);
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onPullRefresh}
          tintColor="#5cff89"
          colors={["#5cff89"]}
        />
      }
     contentContainerStyle={styles.container}
    >
          <>
          {activeTab === "home" ? (
  <>
    {!record ? (
      <>
        <Animated.View onLayout={(event) => { homeY.current = event.nativeEvent.layout.y; }} style={[styles.welcomeBuddyCard, { transform: [{ translateY: heroFloat }] }]}>
  <View style={styles.welcomeGlowOrbOne} />
  <View style={styles.welcomeGlowOrbTwo} />
  <Image
    source={welcomeBuddyImage}
    style={{ width: "100%", height: SCREEN_WIDTH * 1.35, borderRadius: 30 }}
    resizeMode="cover"
  />
</Animated.View>
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
          {zip.length === 5 && !record ? (<Text style={styles.errorText}>Couldn't find that ZIP in your zone file.</Text>) : null}
        </View>
      </>
    ) : null}
  </>
) : null}
{record && activeTab === "home" ? (
  <>
{(() => {
      if (homeBannerDismissedDate === getTodayKey()) return null;
      const dismissBanner = () => {
        const today = getTodayKey();
        setHomeBannerDismissedDate(today);
        AsyncStorage.setItem("pp_homeBannerDismissedDate", today).catch(() => {});
      };
      const frost = getUpcomingFrost(weather);
      const extremeHeat = weather?.maxTempF >= 98;
      if (frost) {
        const whenText =
          frost.daysOut === 0 ? "tonight"
          : frost.daysOut === 1 ? "tomorrow night"
          : `in ${frost.daysOut} days`;
        const countdownText =
          frost.daysOut === 0 ? "❄️ Tonight"
          : frost.daysOut === 1 ? "❄️ 1 night away"
          : `❄️ ${frost.daysOut} nights away`;
        return (
          <View style={[styles.frostBanner, { borderColor: "#6bc7ff" }]}>
            <Text style={styles.frostBannerIcon}>❄️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.frostBannerTitle}>Frost expected {whenText}</Text>
              <View style={{ alignSelf: "flex-start", marginTop: 6, marginBottom: 6, backgroundColor: "rgba(107,199,255,0.18)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(107,199,255,0.35)" }}>
                <Text style={{ color: "#6bc7ff", fontSize: 13, fontWeight: "900" }}>{countdownText}</Text>
              </View>
              <Text style={styles.frostBannerText}>
                Low of {Math.round(frost.minTempF)}°F coming — cover tender plants, move containers to shelter, and hold off on transplanting.
              </Text>
            </View>
           <Pressable onPress={dismissBanner} hitSlop={10} style={{ padding: 4 }}>
              <Text style={{ color: "#6bc7ff", fontSize: 18, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        );
      }
      if (extremeHeat) {
        return (
          <View style={[styles.frostBanner, { borderColor: "#ff7b7b", backgroundColor: "rgba(255,123,123,0.10)" }]}>
            <Text style={styles.frostBannerIcon}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.frostBannerTitle, { color: "#ff7b7b" }]}>Extreme heat today</Text>
              <Text style={styles.frostBannerText}>
                High of {Math.round(weather.maxTempF)}°F — water before 9 AM, shade young plants, add mulch, and skip transplanting today.
              </Text>
            </View>
            <Pressable onPress={dismissBanner} hitSlop={10} style={{ padding: 4 }}>
              <Text style={{ color: "#ff7b7b", fontSize: 18, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        );
      }
      const rainSkip = getRainSkipToday(weather);
      if (rainSkip) {
        return (
          <View style={[styles.frostBanner, { borderColor: "#6bc7ff", backgroundColor: "rgba(107,199,255,0.10)" }]}>
            <Text style={styles.frostBannerIcon}>🌧️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.frostBannerTitle, { color: "#6bc7ff" }]}>Watering skipped today</Text>
              <Text style={styles.frostBannerText}>
                {rainSkip.chance}% chance of rain — Pocket Planter is skipping today's watering reminder so you don't overwater. Check soil before watering anyway.
              </Text>
            </View>
            <Pressable onPress={dismissBanner} hitSlop={10} style={{ padding: 4 }}>
              <Text style={{ color: "#6bc7ff", fontSize: 18, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        );
      }
      return null;
   })()}
    {showWhatsNew ? (
      <View style={{ backgroundColor: theme.card, borderRadius: 24, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: "#5cff89" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>✨ WHAT'S NEW</Text>
          <Pressable
            onPress={() => { setShowWhatsNew(false); AsyncStorage.setItem("pp_whatsNewSeen", WHATS_NEW_VERSION).catch(() => {}); }}
            hitSlop={10}
            style={{ padding: 4 }}
          >
            <Text style={{ color: "#8fbf9d", fontSize: 18, fontWeight: "900" }}>✕</Text>
          </Pressable>
        </View>
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900", marginTop: 6 }}>Fresh updates 🌱</Text>
        <View style={{ marginTop: 12, gap: 8 }}>
          {WHATS_NEW_ITEMS.map((item) => (
            <Text key={item} style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "700", lineHeight: 20 }}>{item}</Text>
          ))}
        </View>
        <Pressable
          onPress={() => { setShowWhatsNew(false); AsyncStorage.setItem("pp_whatsNewSeen", WHATS_NEW_VERSION).catch(() => {}); }}
          style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 13, alignItems: "center" }}
        >
          <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>Got it 🌿</Text>
        </Pressable>
      </View>
    ) : null}
    <Image
      source={homeBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />

    {/* ZONE BADGE + CHANGE BUTTON */}
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: theme.card, borderRadius: 22, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)" }}>
      <View>
        <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.5 }}>Your Growing Zone</Text>
        <Text style={{ color: "#ffffff", fontSize: 28, fontWeight: "900", marginTop: 2 }}>Zone {record.zone}</Text>
        <Text style={{ color: "#d7ebdc", fontSize: 13, fontWeight: "700", marginTop: 2 }}>{record.zonetitle}</Text>
      </View>
      <Pressable
        onPress={() => {
          Alert.alert(
            "Change your zone?",
            "This clears your current ZIP code so you can enter a new one. Your saved plants and garden stay intact.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Change Zone", style: "destructive", onPress: () => setZip("") },
            ]
          );
        }}
        style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}
      >
        <Text style={{ color: "#d7ebdc", fontSize: 13, fontWeight: "900" }}>✏️ Change Zone</Text>
      </Pressable>
    </View>

            {savedPlants.length > 0 ? (
                <TodaysGamePlanCard
                  theme={theme}
                  savedPlants={savedPlants}
                  wateredPlants={wateredPlants}
                  wateringHistory={wateringHistory}
                  harvestTrackers={harvestTrackers}
                  weather={weather}
                  zone={zone}
                  compatiblePlants={compatiblePlants}
                  snoozedPlants={snoozedPlants}
                  onOpenPlant={openPlantFromList}
                  onScrollToWatering={() => scrollRef.current?.scrollTo({ y: Math.max(0, wateringSectionY.current - 20), animated: true })}
                />
              ) : null}

              <PlantAnniversaryCard
                theme={theme}
                plantSaveDates={plantSaveDates}
                savedPlants={savedPlants}
                onOpenPlant={openPlantFromList}
              />

<OnThisDayCard
                theme={theme}
                journalEntries={journalEntries}
                harvestLog={harvestLog}
                onOpenPlant={openPlantFromList}
              />

              <FrostChecklistCard
                theme={theme}
                weather={weather}
                frostChecklist={frostChecklist}
                setFrostChecklist={setFrostChecklist}
              />

              <EmptyGardenStarterCard
                theme={theme}
                savedPlants={savedPlants}
                compatiblePlants={compatiblePlants}
                zone={zone}
                onOpenPlant={openPlantFromList}
                onBrowse={() => jumpToTab("plants")}
              />

              {showPremiumIntro ? (<PremiumIntroCard onClose={dismissPremiumIntro} onUnlock={() => { dismissPremiumIntro(); jumpToTab("premium"); }} />) : null}

<View onLayout={(event) => { wateringSectionY.current = event.nativeEvent.layout.y; }}>
<WateringStreakNudge
  theme={theme}
  savedPlants={savedPlants}
  wateringHistory={wateringHistory}
  snoozedPlants={snoozedPlants}
  onOpenPlant={openPlantFromList}
  onWater={markPlantWatered}
/>
</View>

<RescueModeCard
  theme={theme}
  savedPlants={savedPlants}
  wateredPlants={wateredPlants}
  wateringHistory={wateringHistory}
  onOpenPlant={openPlantFromList}
  onWater={markPlantWatered}
/>

<HarvestReadyCard
  theme={theme}
  harvestTrackers={harvestTrackers}
  onOpenPlant={openPlantFromList}
/>

<CollapsibleCard theme={theme} storageKey="dashboard" title="🌱 Garden Dashboard">
<GardenStatsDashboard
  theme={theme}
  savedPlants={savedPlants}
  journalEntries={journalEntries}
  gardenMap={combinedGardenMap}
  gardenXP={gardenXP}
  streakData={streakData}
  wateredPlants={wateredPlants}
  wateringHistory={wateringHistory}
  weather={weather}
  zone={zone}
harvestTrackers={harvestTrackers}
  fertilizerTrackers={fertilizerTrackers}
  onNavigate={jumpToTab}
  onWaterAll={waterAllPlants}
/>
</CollapsibleCard>

<MyGardenTodayCard
  theme={theme}
  weather={weather}
  monthlySuggestions={monthlySuggestions}
  savedPlants={savedPlants}
  wateredPlants={wateredPlants}
  onOpenPlant={openPlantFromList}
  onAddPhoto={() => pickJournalPhoto("Garden")}
  uploadingPhoto={uploadingPhoto}
  harvestTrackers={harvestTrackers}
  fertilizerTrackers={fertilizerTrackers}
  journalEntries={journalEntries}
zone={zone}
  gardenMap={combinedGardenMap}
  onNavigate={jumpToTab}
/>
{(monthlySuggestions.length || compatiblePlants.length) ? (
<CollapsibleCard theme={theme} storageKey="plantpick" title="🌟 Plant Pick">
<PlantTodayHero
  theme={theme}
  monthlySuggestions={monthlySuggestions}
  compatiblePlants={compatiblePlants}
  savedPlants={savedPlants}
  zone={zone}
  weather={weather}
  onOpen={openPlantFromList}
/>
</CollapsibleCard>
) : null}

<SeedStartingCard
  theme={theme}
  plants={compatiblePlants}
  zone={zone}
  onOpenPlant={openPlantFromList}
/>

<WaterTriageCard
  theme={theme}
  savedPlants={savedPlants}
  wateringHistory={wateringHistory}
  wateringAmounts={wateringAmounts}
  onWater={(name) => waterPlant(name)}
  onOpenPlant={openPlantFromList}
/>

{(zone && savedPlants.length) ? (
<CollapsibleCard theme={theme} storageKey="succession" title="🔁 Succession Sowing">
<SuccessionSowingCard
  theme={theme}
  savedPlants={savedPlants}
  zone={zone}
  sowLog={sowLog}
  onSow={(name) => setSowLog((c) => ({ ...c, [name]: getTodayKey() }))}
/>
</CollapsibleCard>
) : null}

<FrostWindowCard
  theme={theme}
  plants={compatiblePlants}
  zone={zone}
  onOpenPlant={openPlantFromList}
/>

{frostDatesHidden ? (
  <Pressable
    onPress={() => setFrostDatesHidden(false)}
    style={{ backgroundColor: "rgba(107,199,255,0.08)", borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18, marginBottom: 18, borderWidth: 1, borderColor: "rgba(107,199,255,0.2)", alignItems: "center", justifyContent: "center" }}
  >
    <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800" }}>❄️ Show frost dates card</Text>
  </Pressable>
) : (
  <CollapsibleCard theme={theme} storageKey="frostdates" title="❄️ Frost Dates">
  <FrostOverrideCard
    theme={theme}
    zone={zone}
    frostOverrides={frostOverrides}
    onSave={setFrostOverrides}
    onHide={() => setFrostDatesHidden(true)}
  />
  </CollapsibleCard>
)}

{zipCoords ? (
<CollapsibleCard theme={theme} storageKey="daylight" title="☀️ Daylight Today">
<DaylightCard theme={theme} zipCoords={zipCoords} />
</CollapsibleCard>
) : null}

{zone ? (
<CollapsibleCard theme={theme} storageKey="monthlychecklist" title="🗓️ This Month">
<MonthlyChecklistCard theme={theme} zone={zone} monthlyChecklist={monthlyChecklist} setMonthlyChecklist={setMonthlyChecklist} />
</CollapsibleCard>
) : null}
<SeasonTransitionCard
  theme={theme}
  zone={zone}
  onOpenPlant={openPlantFromList}
  onBrowse={() => jumpToTab("plants")}
/>

<DailyBonusCard
  theme={theme}
  dailyBonusClaimed={dailyBonusClaimed}
  dailyBonusDate={dailyBonusDate}
  onClaim={claimDailyBonus}
  streakData={streakData}
/>

{compatiblePlants.length ? (
<CollapsibleCard theme={theme} storageKey="pestwatch" title="🐛 Pest Watch">
<PestWatchCard
  theme={theme}
  savedPlantObjs={compatiblePlants}
  onOpenPlant={openPlantFromList}
/>
</CollapsibleCard>
) : null}

{premiumUnlocked ? (
  <CollapsibleCard theme={theme} storageKey="dailyquests" title="⚡ Daily Quests">
  <DailyQuestsCard
    theme={theme}
    dailyQuests={dailyQuests}
    completedQuestIds={completedQuestIds}
    onQuestComplete={(quest) => {
      const today = getTodayKey();
      const todayCompleted = completedQuestIds[today] || [];
      if (todayCompleted.includes(quest.id)) return;
      setCompletedQuestIds(current => ({
        ...current,
        [today]: [...(current[today] || []), quest.id],
      }));
      setQuestXP(prev => prev + quest.reward);
      const popup = { id: Date.now().toString(), amount: quest.reward };
      setXpPopups(current => [...current, popup]);
      setTimeout(() => {
        setXpPopups(current => current.filter(item => item.id !== popup.id));
      }, 1600);
Vibration.vibrate(60);
      successHaptic();
    }}
  />
  </CollapsibleCard>
) : (
  <PremiumLockedCard theme={theme} title="Daily quests locked" body="Unlock gardening streaks, XP progression, achievements, and daily challenges." onUnlock={() => jumpToTab("premium")} />
)}
{savedPlants.length ? (
<CollapsibleCard theme={theme} storageKey="weeklywatering" title="💧 This Week's Watering">
<WeeklyWateringGrid theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} />
</CollapsibleCard>
) : null}
{savedPlants.length >= 2 ? (
<CollapsibleCard theme={theme} storageKey="mostloved" title="💧 Most Loved">
<MostLovedPlantsCard theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} onOpenPlant={openPlantFromList} />
</CollapsibleCard>
) : null}
{savedPlants.length ? (
<CollapsibleCard theme={theme} storageKey="wateringrhythm" title="📊 Watering Rhythm">
<WateringRhythmCard theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} onOpenPlant={openPlantFromList} />
</CollapsibleCard>
) : null}
{savedPlants.length ? (
<CollapsibleCard theme={theme} storageKey="savedplants" title="🌿 Saved Plants">
<SavedPlantsCard theme={theme} savedPlants={savedPlants} plantFolders={plantFolders} premiumUnlocked={premiumUnlocked} wateredPlants={wateredPlants} wateringHistory={wateringHistory} weather={weather} harvestTrackers={harvestTrackers} pinnedPlants={pinnedPlants} onTogglePin={togglePinnedPlant} onOpenPlant={openPlantFromList} onUpgrade={() => jumpToTab("premium")} />
</CollapsibleCard>
) : null}

{(streakData?.count || 0) >= 3 ? (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: streakFreeze.available ? "rgba(163,213,255,0.10)" : "rgba(255,255,255,0.04)", borderRadius: 18, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: streakFreeze.available ? "rgba(163,213,255,0.28)" : "rgba(255,255,255,0.08)" }}>
    <Text style={{ fontSize: 28 }}>❄️</Text>
    <View style={{ flex: 1 }}>
      <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>Streak Freeze</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
        {streakFreeze.available ? "Protect your streak on a busy day. Refreshes weekly." : "Used this week — refreshes next week."}
      </Text>
    </View>
    <Pressable
      onPress={useStreakFreeze}
      disabled={!streakFreeze.available}
      accessibilityRole="button"
      accessibilityLabel="Use streak freeze"
      style={{ backgroundColor: streakFreeze.available ? "#a3d5ff" : "rgba(255,255,255,0.08)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11 }}
    >
      <Text style={{ color: streakFreeze.available ? "#07120b" : "#8fbf9d", fontSize: 13, fontWeight: "900" }}>
        {streakFreeze.available ? "Use" : "Used"}
      </Text>
    </Pressable>
  </View>
) : null}
            </>
          ) : null}
          {record && activeTab === "garden" ? (
  <>
   <Image
 source={gardenBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
  resizeMode="cover"
/>
<View onLayout={(event) => { gardenY.current = event.nativeEvent.layout.y; }} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
<Text style={[styles.cardTitle, { color: theme.text }]}>Garden Map & Companion Help</Text>
      <GardenAreaManager
        theme={theme}
        gardenAreas={gardenAreas}
        onAddArea={addGardenArea}
        onRenameArea={renameGardenArea}
        onDeleteArea={deleteGardenArea}
        onSetAreaStyle={setAreaStyle}
      />
      {savedPlants.length ? (
       <AreaPlannerMap
          onDeleteArea={deleteGardenArea}
          theme={theme}
          gardenAreas={gardenAreas}
          onPickPhoto={pickAreaPhoto}
          savedPlants={produceData.filter((item) => savedPlants.includes(item.name))}
          wateredPlants={wateredPlants}
          onAssignSlot={assignPlantToAreaSlot}
          onClearSlot={clearAreaSlot}
          onWaterArea={waterArea}
          zone={zone}
          weather={weather}
          harvestTrackers={harvestTrackers}
          onOpenPlant={openPlantFromList}
        />
      ) : (
        <View style={styles.emptyStateCard}>
          <Text style={styles.emptyStateIcon}>🗺️</Text>
          <Text style={styles.emptyStateTitle}>Build Your First Garden</Text>
          <Text style={styles.emptyStateText}>Save a few plants first, then place them into your garden layout and track companion planting compatibility.</Text>
        </View>
      )}
    </View>
    <CollapsibleCard theme={theme} storageKey="fertilizer" title="🌿 Fertilizer Intelligence">
    <FertilizerIntelligenceCard
      theme={theme}
      weather={weather}
      zone={zone}
      savedPlants={savedPlants}
      fertilizerTrackers={fertilizerTrackers}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
    <CollapsibleCard theme={theme} storageKey="shopping" title="🛒 Shopping List">
    <GardenShoppingListCard
      theme={theme}
      gardenAreas={gardenAreas}
      zip={zip}
    />
    </CollapsibleCard>

<SunlightMismatchCard
      theme={theme}
      gardenAreas={gardenAreas}
      onOpenPlant={openPlantFromList}
    />

<PowerPairsCard
      theme={theme}
      gardenAreas={gardenAreas}
      onOpenPlant={openPlantFromList}
    />

{findGardenConflicts(gardenAreas).length ? (
    <CollapsibleCard theme={theme} storageKey="fixgarden" title="🔧 Fix My Garden">
    <FixMyGardenCard
      theme={theme}
      gardenAreas={gardenAreas}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
    ) : null}
  </>
) : null}
{record && activeTab === "plants" ? (
  <>
    <Image
      source={plantsBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
<View onLayout={(event) => { monthlyPicksY.current = event.nativeEvent.layout.y; }}>
      <CollapsibleCard theme={theme} storageKey="monthlypicks" title="📅 This Month's Picks!">
      <View style={styles.primaryFeatureAccentBar} />
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.smallJumpButton} onPress={() => { scrollRef.current?.scrollTo({ y: plantsListY.current, animated: true }); }}>
          <Text style={styles.smallJumpButtonText}>All plants</Text>
        </Pressable>
      </View>
    <ScrollView ref={monthScrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {MONTH_NAMES.map((month, index) => {
          const monthNumber = index + 1;
          const active = selectedMonth === monthNumber;
          return (
            <Pressable
              key={month}
              onPress={() => { tapHaptic("light"); setSelectedMonth(monthNumber); }}
              onLayout={(e) => {
                if (active && !monthScrollDone.current && monthScrollRef.current) {
                  monthScrollDone.current = true;
                  const x = e.nativeEvent.layout.x;
                  monthScrollRef.current.scrollTo({ x: Math.max(0, x - 24), animated: false });
                }
              }}
              style={[styles.calendarMonthCard, active && styles.calendarMonthCardActive]}
            >
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
        <View style={styles.emptyStateCard}>
          <Text style={styles.emptyStateIcon}>📅</Text>
          <Text style={styles.emptyStateTitle}>Nothing ideal for {MONTH_NAMES[selectedMonth - 1]}</Text>
          <Text style={styles.emptyStateText}>
            {zone
              ? `${MONTH_NAMES[selectedMonth - 1]} isn't a prime planting window for Zone ${zone}. Try another month above, or browse all plants to plan ahead.`
              : "Set your zip code on the Weather tab to unlock plant recommendations matched to your growing zone."}
          </Text>
</View>
      )}
      </CollapsibleCard>
    </View>
{savedPlants.length ? (
    <CollapsibleCard theme={theme} storageKey="plantingcalendar" title="📅 Your Planting Calendar">
    <PersonalPlantingCalendar
      theme={theme}
      savedPlants={savedPlants}
      zone={zone}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
    ) : null}

    <View onLayout={(event) => { plantsListY.current = event.nativeEvent.layout.y; }} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Plants</Text>
        </View>
        <Pressable
          style={styles.smallJumpButton}
          onPress={() => {
            setSelectedType("All");
            setComparePlants([]);
            setPlantSearch("");
          }}
        >
          <Text style={styles.smallJumpButtonText}>Reset</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabsNew}
      >
        {PLANT_TYPES.map((type) => {
          const active = selectedType === type;
          return (
            <Pressable
              key={type}
              onPress={() => setSelectedType(type)}
              style={[styles.filterTabNew, active && styles.filterTabNewActive]}
            >
              <Text style={[styles.filterTabNewText, active && styles.filterTabNewTextActive]}>
                {type}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {recentPlants.length > 0 ? (
        <View style={{ marginTop: 14 }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>🕐 RECENTLY VIEWED</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {recentPlants.map((name) => {
              const item = produceData.find((p) => p.name === name);
              if (!item) return null;
              const img = resolvePlantImageSource(item);
              return (
                <Pressable
                  key={`recent-${name}`}
                  onPress={() => openPlantFromList(item)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999, paddingLeft: 6, paddingRight: 14, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(142,255,171,0.16)" }}
                >
                  <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 24, height: 24 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>🌱</Text>}
                  </View>
                  <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "800" }}>{name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      <View style={styles.plantSearchBar}>
        <Text style={styles.plantSearchIcon}>🔍</Text>
        <TextInput
          value={plantSearch}
          onChangeText={setPlantSearch}
          placeholder="Search plants..."
          placeholderTextColor="#8fbf9d"
          style={styles.plantSearchInput}
        />
        {plantSearch ? (
          <Pressable onPress={() => setPlantSearch("")}>
            <Text style={styles.plantSearchClear}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      {comparePlants.length === 2 ? (
        <View style={styles.compareCard}>
          <Text style={styles.compareTitle}>⚔️ Plant Comparison</Text>
          {(() => {
            const left = produceData.find((plant) => plant.name === comparePlants[0]);
            const right = produceData.find((plant) => plant.name === comparePlants[1]);
            if (!left || !right) return null;
            return (
              <>
                <View style={styles.compareRow}>
                  <Text style={styles.comparePlantName}>{left.name}</Text>
                  <Text style={styles.compareVs}>VS</Text>
                  <Text style={styles.comparePlantName}>{right.name}</Text>
                </View>
                {[
                  ["Difficulty", getPlantDifficulty(left).label, getPlantDifficulty(right).label],
                  ["Harvest", getHarvestCountdown(left), getHarvestCountdown(right)],
                  ["Zones", `${left.minZone}-${left.maxZone}`, `${right.minZone}-${right.maxZone}`],
                  ["Type", normalizeType(left.type, left.name), normalizeType(right.type, right.name)],
                ].map(([label, lv, rv]) => (
                  <View key={label} style={styles.compareStatRow}>
                    <Text style={styles.compareLabel}>{label}</Text>
                    <Text style={styles.compareValue}>{lv}</Text>
                    <Text style={styles.compareValue}>{rv}</Text>
                  </View>
                ))}
                <Pressable onPress={() => setComparePlants([])} style={styles.compareClearButton}>
                  <Text style={styles.compareClearText}>Clear Comparison</Text>
                </Pressable>
              </>
            );
          })()}
        </View>
      ) : comparePlants.length === 1 ? (
        <View style={styles.compareHintCard}>
          <Text style={styles.compareHintText}>
            {"⚔️ Select one more plant to compare with "}
            {comparePlants[0]}
            {"."}
          </Text>
        </View>
      ) : null}

      <View style={styles.plantList}>
       {filteredPlants.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No plants found</Text>
            <Text style={styles.emptyStateText}>
              {plantSearch
                ? `Nothing matches "${plantSearch}". Try a different name or clear your search.`
                : selectedType !== "All"
                ? `No ${selectedType.toLowerCase()} match right now. Try viewing all plants instead.`
                : "No plants match the current filter."}
            </Text>
            {plantSearch && getSearchSuggestions(plantSearch).length > 0 ? (
              <View style={{ marginTop: 16, width: "100%" }}>
                <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900", marginBottom: 10, textAlign: "center" }}>Did you mean?</Text>
                <View style={{ gap: 8 }}>
                  {getSearchSuggestions(plantSearch).map((item) => {
                    const img = resolvePlantImageSource(item);
                    return (
                      <Pressable
                        key={`suggest-${item.name}`}
                        onPress={() => { setPlantSearch(""); setSelectedType("All"); openPlantFromList(item); }}
                        style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}
                      >
                        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                        </View>
                        <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "900", flex: 1 }}>{item.name}</Text>
                        <Text style={{ color: "#8effab", fontSize: 22, fontWeight: "900" }}>›</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
            {(plantSearch || selectedType !== "All") ? (
              <Pressable
                onPress={() => { setPlantSearch(""); setSelectedType("All"); }}
                style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingHorizontal: 18, paddingVertical: 11 }}
              >
                <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 13 }}>Show all plants</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
        {filteredPlants.map((item) => (
          <GlowPlantCard key={item.name} plant={item} weather={weather} zone={zone} theme={theme} isSaved={savedPlants.includes(item.name)} isCompared={comparePlants.includes(item.name)} isFollowed={followedPlants.includes(item.name)} isSnoozed={snoozedPlants[item.name] === new Date(Date.now() + 86400000).toISOString().slice(0, 10)} wateredDate={wateredPlants[item.name]} wateredPlants={wateredPlants} wateringHistory={wateringHistory} onOpen={() => openPlantFromList(item)} onSave={() => toggleSavedPlant(item.name)} onCompare={() => toggleComparePlant(item.name)} onFollow={() => toggleFollowPlant(item.name)} onWater={() => markPlantWatered(item.name)} onSnooze={() => snoozePlantWatering(item.name)} />
        ))}
      </View>
    </View>
  </>
) : null}

{activeTab === "weather" ? (
  <View>
    <Image
      source={weatherBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
    <FrostBanner theme={theme} weather={weather} frostAlertsOn={frostAlertsOn} />
    {premiumUnlocked ? (
      <CollapsibleCard theme={theme} storageKey="liveweather" title="🌤️ Live Garden Weather">
      <LiveWeatherCard
        theme={theme}
        weather={weather}
        recommendation={smartRecommendation}
        zone={zone}
        savedPlants={savedPlants}
        wateredPlants={wateredPlants}
        harvestTrackers={harvestTrackers}
      />
      </CollapsibleCard>
    ) : (
      <WeatherTeaserCard
        theme={theme}
        weather={weather}
        zone={zone}
        onUnlock={() => jumpToTab("premium")}
      />
    )}
    <CollapsibleCard theme={theme} storageKey="gardenintel" title="🧠 Garden Intelligence">
    <GardenIntelligenceCard
      theme={theme}
      weather={weather}
      zone={zone}
      savedPlants={savedPlants}
      wateredPlants={wateredPlants}
      gardenMap={gardenMap}
      harvestTrackers={harvestTrackers}
    />
    </CollapsibleCard>
   <CollapsibleCard theme={theme} storageKey="wateringforecast" title="💧 7-Day Watering Forecast">
    <WateringForecastCard
      theme={theme}
      savedPlants={savedPlants}
      wateringHistory={wateringHistory}
      wateredPlants={wateredPlants}
      weather={weather}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
    <CollapsibleCard theme={theme} storageKey="forecast" title="🌤️ Garden Weather This Week">
    <ForecastCard
      theme={theme}
      weather={weather}
      zone={zone}
      savedPlants={savedPlants}
      wateredPlants={wateredPlants}
    />
    </CollapsibleCard>
    <CollapsibleCard theme={theme} storageKey="thriving" title="🌍 Thriving Near You">
    <ThrivingNearYouCard
      theme={theme}
      zone={zone}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
  </View>
) : null}

{activeTab === "journal" ? (
  <View onLayout={(event) => { journalY.current = event.nativeEvent.layout.y; }}>
    <Image
      source={journalBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
<CollapsibleCard theme={theme} storageKey="journal" title="📸 Garden Journal">
  <JournalCard theme={theme} journalEntries={journalEntries} onAddGeneralPhoto={() => pickJournalPhoto("Garden")} onDeleteEntry={deleteJournalEntry} uploadingPhoto={uploadingPhoto} />
  </CollapsibleCard>
<HarvestRevealCard theme={theme} journalEntries={journalEntries} harvestLog={harvestLog} onOpenPlant={openPlantFromList} />
<AllNotesCard theme={theme} plantNotes={plantNotes} onOpenPlant={openPlantFromList} />
<CollapsibleCard theme={theme} storageKey="soilcare" title="🧪 Garden Care Tracker">
<SoilCareLogCard
  theme={theme}
  savedPlants={savedPlants}
  careLog={careLog}
  setCareLog={setCareLog}
  onFertilizerLogged={scheduleFertilizerReminder}
  onUndoToast={showUndoToast}
/>
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="harvestlog" title="🚜 Harvest Log">
<HarvestLogCard
  theme={theme}
  harvestLog={harvestLog}
  setHarvestLog={setHarvestLog}
  onUndoToast={showUndoToast}
/>
</CollapsibleCard>

<CollapsibleCard theme={theme} storageKey="waterusage" title="🚿 Water Usage">
<WaterUsageCard
  theme={theme}
  savedPlants={savedPlants}
  wateringAmounts={wateringAmounts}
  setWateringAmounts={setWateringAmounts}
  onUndoToast={showUndoToast}
/>
</CollapsibleCard>

<CollapsibleCard theme={theme} storageKey="dataexport" title="💾 Export & Backup">
<DataExportCard
  theme={theme}
  harvestLog={harvestLog}
  careLog={careLog}
  journalEntries={journalEntries}
/>
</CollapsibleCard>
  </View>
) : null}
{record && activeTab === "profile" ? (
  <View onLayout={(event) => { premiumY.current = event.nativeEvent.layout.y; }}>
    <Image
      source={profileBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
<CollapsibleCard theme={theme} storageKey="account" title="☁️ Cloud Save Connected">
  <AccountCloudCard
  theme={theme}
  user={user}
  newEmail={newEmail}
  setNewEmail={setNewEmail}
  subscriptionPlan={subscriptionPlan}
  premiumUnlocked={premiumUnlocked}
  savedPlants={savedPlants}
  journalEntries={journalEntries}
  gardenMap={gardenMap}
/>
  </CollapsibleCard>

<View
  onLayout={(event) => {
    reminderY.current =
      event.nativeEvent.layout.y;
  }}
>
      <CollapsibleCard theme={theme} storageKey="reminders" title="Smart Reminders!">
      <ReminderControlCard
  theme={theme}
  remindersOn={remindersOn}
  frostAlertsOn={frostAlertsOn}
  monthlyPlantingOn={monthlyPlantingOn}
  dailyWateringOn={dailyWateringOn}
  wateringReminderTime={wateringReminderTime}
  onChangeWateringTime={(t) => setWateringReminderTime(t)}
  plantOfDayOn={plantOfDayOn}
  onTogglePlantOfDay={togglePlantOfDay}
  onToggleReminders={(value) => {
    setRemindersOn(value);
    Alert.alert(
      value ? "Watering Reminders On" : "Watering Reminders Off",
      value
        ? "You can now add watering reminders from individual plant pages."
        : "Plant-page watering reminders are now disabled."
    );
  }}
  onToggleFrost={async (value) => {
    setFrostAlertsOn(value);
    if (value) {
      const granted = await ensureNotificationPermission();
      if (!granted) {
        Alert.alert("Notifications Disabled", "Enable notifications in your phone settings to receive frost alerts.");
        setFrostAlertsOn(false);
        return;
      }
      const months = getFrostSeasonMonths(zone);
      for (const month of months) {
        const id = `frost-daily-${month}`;
        await cancelReminder(id);
        await Notifications.scheduleNotificationAsync({
          identifier: id,
          content: {
            title: "❄️ Frost Check",
            body: "Cold season is here — open Pocket Planter to see if frost is coming and protect your tender plants.",
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            repeats: true,
            month,
            day: 1,
            hour: 18,
            minute: 0,
          },
        });
      }
      const frost = getUpcomingFrost(weather);
      Alert.alert(
        "Frost Alerts On ❄️",
        frost
          ? `Frost is already in your forecast — low of ${Math.round(frost.minTempF)}°F coming. You'll also get a check-in reminder during cold months.`
          : "You'll get a frost check-in reminder during your zone's cold months, plus an instant alert whenever frost appears in your forecast."
      );
    } else {
      const allMonths = [1, 2, 3, 4, 5, 9, 10, 11, 12];
      for (const month of allMonths) {
        await cancelReminder(`frost-daily-${month}`);
      }
      await cancelReminder("frost-detected");
      Alert.alert("Frost Alerts Off", "You will no longer receive frost alerts.");
    }
  }}
  onToggleMonthlyPlanting={async (value) => {
    setMonthlyPlantingOn(value);
    if (value) {
      const granted = await ensureNotificationPermission();
      if (granted) {
        for (let month = 1; month <= 12; month++) {
          const id = `monthly-planting-${month}`;
          await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
          await Notifications.scheduleNotificationAsync({
            identifier: id,
            content: {
              title: `🌱 ${MONTH_NAMES[month - 1]} Planting Guide`,
              body: `Open Pocket Planter to see what to plant this month in your zone.`,
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
              repeats: true,
              month,
              day: 1,
              hour: 9,
              minute: 0,
            },
          });
        }
        Alert.alert("Monthly Planting Guides On 🌱", "You'll receive a planting guide on the 1st of every month.");
      }
    } else {
      for (let month = 1; month <= 12; month++) {
        await cancelReminder(`monthly-planting-${month}`);
      }
      Alert.alert("Monthly Planting Reminders Off", "You will no longer receive monthly planting guide reminders.");
    }
  }}
 onToggleDailyWatering={async (value) => {
    setDailyWateringOn(value);
    if (value) {
      const rainLikely = weather?.precipChance >= 65;
      const ok = await scheduleDailyReminder({
        id: "daily-watering",
        hour: wateringReminderTime.hour,
        minute: wateringReminderTime.minute,
        title: rainLikely ? "🌧️ Rain May Water Today" : "💧 Daily Watering Check",
        body: rainLikely
          ? "Rain is likely today. Check the soil before watering your garden."
          : "Time to check your garden and water any plants that need moisture today.",
      });
      if (ok) {
        Alert.alert("Daily Watering Check On 💧", `Pocket Planter will remind you every morning at ${formatReminderTime(wateringReminderTime)} to check your garden.`);
      }
    } else {
      await cancelReminder("daily-watering");
      Alert.alert("Daily Watering Reminder Off", "You will no longer receive daily watering reminders.");
    }
  }}
/>
      </CollapsibleCard>
</View>
{!premiumUnlocked ? (
  <PremiumLockedSection
    icon="🧑‍🌾"
    title="Gardener Profile"
    description="Unlock your full gardener profile, XP progression, level-up rewards, achievement badges, and collectible banners."
    onUnlock={() => jumpToTab("premium")}
  />
) : (
      <>
<CollapsibleCard theme={theme} storageKey="gardenerprofile" title="🧑‍🌾 Gardener Profile">
<GardenerProfileCard theme={theme} setAppearanceMode={setAppearanceMode} avatarGlow={avatarGlow} gardenXP={gardenXP} savedPlants={savedPlants} journalEntries={journalEntries} gardenMap={gardenMap} streakData={streakData} profileBanners={profileBanners} selectedProfileTheme={selectedProfileTheme} setSelectedProfileTheme={setSelectedProfileTheme} profileName={profileName} setProfileName={setProfileName} profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} />
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="banners" title="✨ Collectible Banners">
       <ProfileBannersCard
  theme={theme}
  profileBanners={profileBanners}
  gardenXP={gardenXP}
  savedPlants={savedPlants}
  journalEntries={journalEntries}
  gardenMap={gardenMap}
  wateredPlants={wateredPlants}
  streakData={streakData}
  harvestTrackers={harvestTrackers}
  careLog={careLog}
  premiumUnlocked={premiumUnlocked}
  activeBannerId={activeBannerId}
  setActiveBannerId={setActiveBannerId}
/>
       </CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="gardenstory" title="📖 Garden Story">
<GardenStoryCard
  theme={theme}
  savedPlants={savedPlants}
  harvestLog={harvestLog}
  journalEntries={journalEntries}
  wateringHistory={wateringHistory}
  streakData={streakData}
  gardenXP={gardenXP}
  gardenAreas={gardenAreas}
/>
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="seasonsofar" title="📊 Season So Far">
<SeasonComparisonCard
  theme={theme}
  harvestLog={harvestLog}
  journalEntries={journalEntries}
  wateringHistory={wateringHistory}
/>
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="harvestgoal" title="🎯 Harvest Goal">
<HarvestGoalCard
  theme={theme}
  harvestLog={harvestLog}
  harvestGoal={harvestGoal}
  setHarvestGoal={setHarvestGoal}
/>
</CollapsibleCard>
{((harvestLog || []).length + (journalEntries || []).length + Object.keys(wateringHistory || {}).length > 0 || savedPlants.length > 0) ? (
<CollapsibleCard theme={theme} storageKey="yearinreview" title="🌻 Year in Review">
<YearInReviewCard
  theme={theme}
  savedPlants={savedPlants}
  harvestLog={harvestLog}
  journalEntries={journalEntries}
  wateringHistory={wateringHistory}
  streakData={streakData}
  gardenXP={gardenXP}
/>
</CollapsibleCard>
) : null}

<CollapsibleCard theme={theme} storageKey="gardenroi" title="💰 Garden ROI">
<GardenROICard
  theme={theme}
  harvestLog={harvestLog}
  suppliesSpent={suppliesSpent}
  setSuppliesSpent={setSuppliesSpent}
/>
</CollapsibleCard>

{Object.values(wateringHistory || {}).some((dates) => (dates || []).length) ? (
<CollapsibleCard theme={theme} storageKey="wateringheatmap" title="🔥 Watering Heatmap">
<WateringHeatmapCard
  theme={theme}
  wateringHistory={wateringHistory}
/>
</CollapsibleCard>
) : null}
<CollapsibleCard theme={theme} storageKey="achievements" title="🏆 Achievements">
        <AchievementCard
  theme={theme}
  badges={achievementBadges}
  streakData={streakData}
  seenGardenGod={seenGardenGod}
  setSeenGardenGod={setSeenGardenGod}
/>
        </CollapsibleCard>
      </>
    )}
  </View>
) : null}
{activeTab === "premium" ? (
  <View onLayout={(event) => { premiumY.current = event.nativeEvent.layout.y; }}>
    <Image
      source={premiumBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
    <SettingsCard theme={theme} premiumUnlocked={premiumUnlocked} setPremiumUnlocked={setPremiumUnlocked} subscriptionPlan={subscriptionPlan} setSubscriptionPlan={setSubscriptionPlan} onUnlockPremium={unlockPremium} />
    <View style={styles.attributionContainer}>
      <Image source={prismLogo} style={styles.attributionLogo} resizeMode="contain" />
      <Text style={[styles.attributionText, { color: theme.secondaryText }]}>Plant hardiness zone data courtesy of PRISM Climate Group and USDA.</Text>
    </View>
  </View>
) : null}
</>
</ScrollView>
{record && showScrollTop ? (
  <Pressable
    onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
    style={styles.scrollTopButton}
    accessibilityRole="button"
    accessibilityLabel="Scroll to top"
  >
    <Ionicons name="chevron-up" size={24} color="#07120b" />
  </Pressable>
) : null}
{record ? (
  <View style={styles.bottomTabs}>
  {[
    { id: "home", label: "Home", icon: "home", premium: false },
    { id: "plants", label: "Plants", icon: "leaf", premium: false },
    { id: "garden", label: "Garden", icon: "grid", premium: true },
    { id: "weather", label: "Weather", icon: "cloud", premium: false },
    { id: "journal", label: "Journal", icon: "book", premium: true },
    { id: "profile", label: "Profile", icon: "person-circle", premium: false },
    { id: "premium", label: "Premium", icon: "star", premium: false },
  ].map((tab) => {
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
const FROST_TASKS = [
  { id: "cover", icon: "🛡️", text: "Cover tender plants with sheets, row cover, or cloches" },
  { id: "containers", icon: "🪴", text: "Move potted plants into a garage or against the house" },
  { id: "water", icon: "💧", text: "Water soil before the freeze — moist soil holds heat" },
  { id: "mulch", icon: "🍂", text: "Add mulch around roots for insulation" },
  { id: "harvest", icon: "🧺", text: "Harvest anything ripe that frost could damage" },
];
const COLD_THRESHOLD_F = 40;
function FrostChecklistCard({ theme, weather, frostChecklist, setFrostChecklist }) {
  // Find the coldest low across today + next 2 forecast days
  const forecast = Array.isArray(weather?.forecast) ? weather.forecast : [];
  const window = forecast.slice(0, 3);
  const lows = window
    .map((d) => (typeof d?.minTempF === "number" ? d.minTempF : null))
    .filter((v) => v !== null);
  // Fall back to weather.minTempF if forecast lows are missing
  if (lows.length === 0 && typeof weather?.minTempF === "number") lows.push(weather.minTempF);

  const coldestF = lows.length ? Math.min(...lows) : null;
  if (coldestF == null || coldestF >= COLD_THRESHOLD_F) return null;

  const coldestC = Math.round(((coldestF - 32) * 5) / 9);
  const isTonight = typeof window[0]?.minTempF === "number" && window[0].minTempF < COLD_THRESHOLD_F;

  const toggle = (id) => {
    tapHaptic("light");
    setFrostChecklist((current) => ({ ...current, [id]: !current[id] }));
  };
  const doneCount = FROST_TASKS.filter((t) => frostChecklist[t.id]).length;
  const allDone = doneCount === FROST_TASKS.length;

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(163,213,255,0.10)", borderColor: "#a3d5ff" }}>
     <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>❄️</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#a3d5ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>COLD WEATHER PREP</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {allDone ? "You're cold-ready! 🌿" : `Protect your garden — cold ${isTonight ? "tonight" : "coming"}`}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        Low of {Math.round(coldestF)}°F ({coldestC}°C) expected. Check these off as you go — {doneCount}/{FROST_TASKS.length} done.
      </Text>

      {/* progress bar */}
      <View style={{ height: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.1)", marginTop: 12, overflow: "hidden" }}>
        <View style={{ height: 8, borderRadius: 999, backgroundColor: allDone ? "#5cff89" : "#a3d5ff", width: `${(doneCount / FROST_TASKS.length) * 100}%` }} />
      </View>

      <View style={{ gap: 8, marginTop: 14 }}>
        {FROST_TASKS.map((task) => {
          const checked = !!frostChecklist[task.id];
          return (
            <Pressable
              key={task.id}
              onPress={() => toggle(task.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: checked ? "rgba(92,255,137,0.10)" : "rgba(255,255,255,0.05)", borderRadius: 14, padding: 13, borderWidth: 1, borderColor: checked ? "rgba(92,255,137,0.28)" : "rgba(163,213,255,0.18)" }}
            >
              <View style={{ width: 24, height: 24, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: checked ? "#5cff89" : "transparent", borderWidth: 2, borderColor: checked ? "#5cff89" : "rgba(255,255,255,0.25)" }}>
                {checked ? <Text style={{ fontSize: 13, fontWeight: "900", color: "#07120b" }}>✓</Text> : null}
              </View>
              <Text style={{ fontSize: 18 }}>{task.icon}</Text>
              <Text style={{ color: checked ? theme.secondaryText : theme.text, fontSize: 13, fontWeight: "800", flex: 1, textDecorationLine: checked ? "line-through" : "none" }}>
                {task.text}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
function PlantAnniversaryCard({ theme, plantSaveDates, savedPlants, onOpenPlant }) {
  const now = new Date();
  const milestones = (savedPlants || [])
    .map((name) => {
      const saved = plantSaveDates?.[name];
      if (!saved) return null;
      const savedDate = new Date(`${saved}T12:00:00`);
      if (Number.isNaN(savedDate.getTime())) return null;
      const days = Math.floor((now - savedDate) / (1000 * 60 * 60 * 24));
      if (days < 30) return null;
      // Determine the most recent monthly/yearly milestone reached
      let label = null;
      const years = Math.floor(days / 365);
      const months = Math.floor(days / 30);
      if (years >= 1 && days % 365 < 3) label = years === 1 ? "1 year" : `${years} years`;
      else if (months >= 1 && days % 30 < 3) label = months === 1 ? "1 month" : `${months} months`;
      if (!label) return null;
      return { name, label, days };
    })
    .filter(Boolean)
    .sort((a, b) => b.days - a.days);

  if (!milestones.length) return null;

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(255,182,193,0.10)", borderColor: "#ffb6c1" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>🎂</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#ffb6c1", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>PLANT ANNIVERSARY</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {milestones.length === 1 ? "A plant milestone!" : `${milestones.length} plant milestones!`}
          </Text>
        </View>
      </View>
      <View style={{ gap: 10, marginTop: 14 }}>
        {milestones.slice(0, 4).map((m) => {
          const plant = produceData.find((p) => p.name === m.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          return (
            <Pressable
              key={`anniv-${m.name}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(255,182,193,0.22)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{m.name}</Text>
                <Text style={{ color: "#ffb6c1", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  🎉 {m.label} together!
                </Text>
              </View>
              <Text style={{ color: "#ffb6c1", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function OnThisDayCard({ theme, journalEntries, harvestLog, onOpenPlant }) {
  const now = new Date();
  now.setHours(12, 0, 0, 0);

  // Match anything that happened ~1 month or ~1 year ago (within a 2-day window).
  const WINDOW_DAYS = 2;
  const isThrowback = (dateStr) => {
    const then = new Date(dateStr);
    if (Number.isNaN(then.getTime())) return null;
    then.setHours(12, 0, 0, 0);
    const daysAgo = Math.round((now - then) / (1000 * 60 * 60 * 24));
    if (daysAgo < 25) return null; // too recent to be a throwback
    // 1 year
    if (Math.abs(daysAgo - 365) <= WINDOW_DAYS) return { label: "1 year ago", years: 1 };
    // whole months (30-day approximation)
    const months = Math.round(daysAgo / 30);
    if (months >= 1 && Math.abs(daysAgo - months * 30) <= WINDOW_DAYS) {
      return { label: months === 1 ? "1 month ago" : `${months} months ago`, months };
    }
    return null;
  };

  const photoMemories = (journalEntries || [])
    .map((e) => {
      const match = isThrowback(e.createdAt);
      return match && e.imageUri ? { type: "photo", entry: e, match } : null;
    })
    .filter(Boolean);

  const harvestMemories = (harvestLog || [])
    .map((h) => {
      const match = isThrowback(h.createdAt);
      return match ? { type: "harvest", entry: h, match } : null;
    })
    .filter(Boolean);

  const memories = [...photoMemories, ...harvestMemories].sort(
    (a, b) => new Date(b.entry.createdAt) - new Date(a.entry.createdAt)
  );

  if (!memories.length) return null;

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(216,200,255,0.10)", borderColor: "#d8c8ff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>📅</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>ON THIS DAY</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {memories.length === 1 ? "A memory from your garden" : "Memories from your garden"}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        Look how far you've come. Here's what your garden was up to around this time.
      </Text>

      <View style={{ gap: 12, marginTop: 14 }}>
        {memories.slice(0, 4).map((m, i) => {
          if (m.type === "photo") {
            const plant = produceData.find((p) => p.name === m.entry.plantName);
            return (
              <Pressable
                key={`otd-photo-${m.entry.id}`}
                onPress={() => plant && onOpenPlant(plant)}
                style={{ borderRadius: 18, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(216,200,255,0.22)" }}
              >
                <Image source={{ uri: m.entry.imageUri }} style={{ width: "100%", height: 160 }} resizeMode="cover" />
                <View style={{ position: "absolute", top: 10, left: 10, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
                  <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "900" }}>🕐 {m.match.label}</Text>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{m.entry.plantName || "Garden"}</Text>
                  {m.entry.growthStage ? (
                    <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "800", marginTop: 2 }}>{m.entry.growthStage}</Text>
                  ) : null}
                </View>
              </Pressable>
            );
          }
          const plant = produceData.find((p) => p.name === m.entry.plantName);
          const img = plant ? resolvePlantImageSource(plant) : null;
          return (
            <Pressable
              key={`otd-harvest-${m.entry.id}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(216,200,255,0.22)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🎉</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>Harvested {m.entry.plantName}</Text>
                <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  🕐 {m.match.label}{m.entry.amount ? ` · ${m.entry.amount} ${m.entry.unit || ""}`.trimEnd() : ""}
                </Text>
              </View>
              <Text style={{ color: "#d8c8ff", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TodaysGamePlanCard({ theme, savedPlants, wateredPlants, wateringHistory, harvestTrackers, weather, zone, compatiblePlants, snoozedPlants, onOpenPlant, onScrollToWatering }) {
  const today = getTodayKey();
  const tomorrowKey = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const tasks = [];

  // 1. Plants needing water today (snoozed plants are skipped until tomorrow)
  const needWater = (savedPlants || []).filter(
    (name) => wateredPlants?.[name] !== today && snoozedPlants?.[name] !== tomorrowKey
  );
  if (needWater.length > 0) {
    tasks.push({
      icon: "💧",
      accent: "#6bc7ff",
      title: `Water ${needWater.length} plant${needWater.length === 1 ? "" : "s"}`,
      detail: needWater.slice(0, 3).join(", ") + (needWater.length > 3 ? `, +${needWater.length - 3} more` : ""),
      onPress: onScrollToWatering,
    });
  }

  // 2. Harvest-ready (within tracker window)
  const harvestReady = Object.entries(harvestTrackers || {})
    .map(([name, tracker]) => {
      const daysPassed = Math.floor((new Date() - new Date(tracker.startedAt)) / (1000 * 60 * 60 * 24));
      return { name, daysLeft: Math.max(0, (tracker.days || 0) - daysPassed) };
    })
    .filter((e) => e.daysLeft === 0);
  if (harvestReady.length > 0) {
    const first = produceData.find((p) => p.name === harvestReady[0].name);
    tasks.push({
      icon: "🎉",
      accent: "#ffd86b",
      title: `Harvest ${harvestReady.length} plant${harvestReady.length === 1 ? "" : "s"}`,
      detail: harvestReady.map((e) => e.name).slice(0, 3).join(", "),
      onPress: () => first && onOpenPlant(first),
    });
  }

  // 3. Frost tonight/soon
  const frost = weather?.upcomingFrost || (typeof getUpcomingFrost === "function" ? getUpcomingFrost(weather) : null);
  if (frost && frost.daysOut <= 1) {
    tasks.push({
      icon: "❄️",
      accent: "#a3d5ff",
      title: frost.daysOut === 0 ? "Frost tonight — protect plants" : "Frost tomorrow — prep now",
      detail: `Low of ${Math.round(frost.minTempF)}°F. Cover tender plants and move containers.`,
      onPress: null,
    });
  }

  // 4. Seeds to start indoors now
  const seedsToStart = (compatiblePlants || [])
    .map((item) => ({ item, info: getSeedStartInfo(item, zone) }))
    .filter((e) => e.info && e.info.status === "start-now");
  if (seedsToStart.length > 0) {
    tasks.push({
      icon: "🌱",
      accent: "#8effab",
      title: `Start ${seedsToStart.length} seed${seedsToStart.length === 1 ? "" : "s"} indoors`,
      detail: seedsToStart.map((e) => e.item.name).slice(0, 3).join(", "),
      onPress: () => onOpenPlant(seedsToStart[0].item),
    });
  }

  const allDone = tasks.length === 0;

  return (
    <View style={{ borderRadius: 26, padding: 20, marginBottom: 18, borderWidth: 1.5, backgroundColor: allDone ? "rgba(92,255,137,0.10)" : "rgba(255,255,255,0.05)", borderColor: allDone ? "#5cff89" : "rgba(255,255,255,0.12)" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: allDone ? 0 : 6 }}>
        <Text style={{ fontSize: 24 }}>{allDone ? "✅" : "📋"}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: allDone ? "#5cff89" : "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>TODAY'S GAME PLAN</Text>
          <Text style={{ color: theme.text, fontSize: 19, fontWeight: "900", marginTop: 2 }}>
            {allDone ? "You're all caught up! 🌿" : `${tasks.length} thing${tasks.length === 1 ? "" : "s"} to do today`}
          </Text>
        </View>
      </View>

      {allDone ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 20, marginTop: 8 }}>
          Nothing urgent in the garden right now. Check back tomorrow, or browse new plants to grow.
        </Text>
      ) : (
        <View style={{ gap: 10, marginTop: 12 }}>
          {tasks.map((task, i) => (
            <Pressable
              key={`task-${i}`}
              onPress={task.onPress || undefined}
              disabled={!task.onPress}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${task.accent}30` }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${task.accent}1a`, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 20 }}>{task.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{task.title}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }} numberOfLines={1}>{task.detail}</Text>
              </View>
              {task.onPress ? <Text style={{ color: task.accent, fontSize: 20, fontWeight: "900" }}>›</Text> : null}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function PestWatchCard({ theme, savedPlantObjs, onOpenPlant }) {
  const month = new Date().getMonth() + 1;
  const pests = getActivePests(savedPlantObjs, month);
  const [expanded, setExpanded] = useState(null);

  if (!pests.length) return null;

  const monthName = new Date().toLocaleDateString("en-US", { month: "long" });

return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>🐛</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            Active in {monthName}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {pests.length} pest{pests.length === 1 ? "" : "s"} tend to show up this time of year for plants like yours. A quick check now saves a lot of damage later.
      </Text>

      <View style={{ gap: 10, marginTop: 14 }}>
        {pests.map((pest) => {
          const open = expanded === pest.name;
          return (
            <View key={pest.name} style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,123,123,0.20)", overflow: "hidden" }}>
              <Pressable
                onPress={() => { tapHaptic("light"); setExpanded(open ? null : pest.name); }}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 13 }}
              >
                <Text style={{ fontSize: 24 }}>{pest.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{pest.name}</Text>
                  <Text style={{ color: "#ffb3b3", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                    Threatens: {pest.affected.slice(0, 3).join(", ")}{pest.affected.length > 3 ? ` +${pest.affected.length - 3}` : ""}
                  </Text>
                </View>
                <Text style={{ color: "#ff9f9f", fontSize: 18, fontWeight: "900" }}>{open ? "−" : "+"}</Text>
              </Pressable>
              {open ? (
                <View style={{ paddingHorizontal: 13, paddingBottom: 14, gap: 10 }}>
                  <View>
                    <Text style={{ color: "#ffd86b", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 3 }}>👀 WHAT TO LOOK FOR</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19 }}>{pest.sign}</Text>
                  </View>
                  <View>
                    <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 3 }}>✅ WHAT TO DO</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19 }}>{pest.fix}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Based on typical seasonal activity — not a live infestation report.
      </Text>
    </View>
  );
}

function SeasonTransitionCard({ theme, zone, onOpenPlant, onBrowse }) {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const currentMonth = now.getMonth() + 1;
  const currentSeason = getSeasonForMonth(currentMonth);

  // Find the first day of the next season and how far out it is.
  const SEASON_STARTS = { spring: 3, summer: 6, fall: 9, winter: 12 };
  const nextSeasonName =
    currentSeason.key === "spring" ? "summer"
    : currentSeason.key === "summer" ? "fall"
    : currentSeason.key === "fall" ? "winter"
    : "spring";
  const nextStartMonth = SEASON_STARTS[nextSeasonName];

  // Build a date for the next season's start (roll to next year if needed).
  let nextStart = new Date(now.getFullYear(), nextStartMonth - 1, 1, 12, 0, 0, 0);
  if (nextStart <= now) nextStart = new Date(now.getFullYear() + 1, nextStartMonth - 1, 1, 12, 0, 0, 0);
  const daysUntilNext = Math.round((nextStart - now) / (1000 * 60 * 60 * 24));

  // Only show when we're inside the ~3-week run-up to the season change.
  if (daysUntilNext > 21 || daysUntilNext < 0) return null;
  if (!zone) return null;

  const seasonLabel = { spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter" }[nextSeasonName];
  const seasonEmoji = { spring: "🌱", summer: "☀️", fall: "🍂", winter: "❄️" }[nextSeasonName];

  // What to plant as the next season opens — pull zone-matched picks for that month.
  const picks = getSuggestionsForMonth(zone, nextStartMonth).slice(0, 4);

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(255,159,67,0.10)", borderColor: "#ff9f43" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>{seasonEmoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>SEASON CHANGE AHEAD</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {seasonLabel} starts in {daysUntilNext} day{daysUntilNext === 1 ? "" : "s"}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {currentSeason.label} is winding down. Get a head start on {seasonLabel.toLowerCase()} — here's what does well in Zone {zone} as it opens.
      </Text>

      {picks.length ? (
        <View style={{ gap: 10, marginTop: 14 }}>
          {picks.map((item) => {
            const img = resolvePlantImageSource(item);
            const diff = getPlantDifficulty(item);
            return (
              <Pressable
                key={`season-${item.name}`}
                onPress={() => onOpenPlant(item)}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(255,159,67,0.22)" }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{item.name}</Text>
                  <Text style={{ color: "#ffd8a3", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                    {diff.icon} {diff.text} · {normalizeType(item.type, item.name)}
                  </Text>
                </View>
                <Text style={{ color: "#ff9f43", fontSize: 20, fontWeight: "900" }}>›</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 20, marginTop: 14 }}>
          No standout {seasonLabel.toLowerCase()} picks matched to Zone {zone} yet — browse all plants to plan ahead.
        </Text>
      )}

      {onBrowse ? (
        <Pressable onPress={onBrowse} style={{ marginTop: 14, backgroundColor: "#ff9f43", borderRadius: 16, paddingVertical: 13, alignItems: "center" }}>
          <Text style={{ color: "#3d2600", fontWeight: "900", fontSize: 14 }}>Plan my {seasonLabel.toLowerCase()} garden 🌿</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function FrostOverrideCard({ theme, zone, frostOverrides, onSave, onHide }) {
  const [lastFrost, setLastFrost] = useState(frostOverrides?.lastFrost || "");
  const [firstFrost, setFirstFrost] = useState(frostOverrides?.firstFrost || "");

  // Show the current zone estimates as placeholder guidance.
  const estLast = getLastFrostDate(zone);
  const estFirst = getFirstFrostDate(zone);
  const fmt = (d) => (d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—");
  const valid = (v) => v === "" || /^\d{1,2}-\d{1,2}$/.test(v);

  const bothValid = valid(lastFrost) && valid(firstFrost);

  function handleSave() {
    if (!bothValid) return;
    const next = {};
    if (lastFrost.trim()) next.lastFrost = lastFrost.trim();
    if (firstFrost.trim()) next.firstFrost = firstFrost.trim();
    onSave(next);
  }
  function handleClear() {
    setLastFrost("");
    setFirstFrost("");
    onSave({});
  }

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    color: theme.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  };

return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Set Your Local Frost Dates</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Your zone estimates last frost around {fmt(estLast)} and first frost around {fmt(estFirst)}. If you know your real local dates, enter them as MM-DD to sharpen seed-starting and frost-window advice.
      </Text>

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 16, marginBottom: 6 }}>LAST SPRING FROST (MM-DD)</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TextInput
          value={lastFrost}
          onChangeText={setLastFrost}
          placeholder="e.g. 03-15"
          placeholderTextColor={theme.secondaryText}
          style={[inputStyle, !valid(lastFrost) && { borderColor: "#ff7a7a" }]}
          autoCapitalize="none"
        />
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 14, marginBottom: 6 }}>FIRST FALL FROST (MM-DD)</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TextInput
          value={firstFrost}
          onChangeText={setFirstFrost}
          placeholder="e.g. 11-15"
          placeholderTextColor={theme.secondaryText}
          style={[inputStyle, !valid(firstFrost) && { borderColor: "#ff7a7a" }]}
          autoCapitalize="none"
        />
      </View>

      {!bothValid && (
        <Text style={{ color: "#ff7a7a", fontSize: 12, fontWeight: "700", marginTop: 8 }}>
          Use MM-DD format, like 03-15.
        </Text>
      )}

      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
        <Pressable
          onPress={handleSave}
          disabled={!bothValid}
          style={{ flex: 1, backgroundColor: bothValid ? "rgba(107,199,255,0.2)" : "rgba(255,255,255,0.06)", borderRadius: 999, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: bothValid ? "rgba(107,199,255,0.44)" : "rgba(255,255,255,0.12)" }}
        >
          <Text style={{ color: bothValid ? "#6bc7ff" : theme.secondaryText, fontSize: 14, fontWeight: "900" }}>Save frost dates</Text>
        </Pressable>
        <Pressable
          onPress={handleClear}
          style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}
        >
          <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>Reset</Text>
        </Pressable>
      </View>

      <Pressable onPress={onHide} style={{ marginTop: 12, alignItems: "center", paddingVertical: 10 }}>
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800" }}>🌵 No frost in my area — hide this card</Text>
      </Pressable>
    </View>
  );
}
const SEASONAL_TASKS = {
  hot: {
    0:  ["Plant cool-season crops: lettuce, spinach, peas", "Prune dormant fruit trees", "Start tomatoes & peppers indoors"],
    1:  ["Transplant tomatoes & peppers outdoors", "Plant carrots, beets, radishes", "Begin regular watering as it warms"],
    2:  ["Last chance for spring greens before heat", "Mulch beds to hold moisture", "Plant beans & squash"],
    3:  ["Harvest cool crops before they bolt", "Set up shade cloth for tender plants", "Deep-water in the mornings"],
    4:  ["Plant heat-lovers: okra, melons, sweet potato", "Water early to beat evaporation", "Watch for pests in the heat"],
    5:  ["Provide afternoon shade", "Harvest often to keep plants producing", "Refresh mulch"],
    6:  ["Water deeply & consistently", "Start seeds for fall tomatoes", "Keep harvesting summer crops"],
    7:  ["Plant fall tomatoes & peppers", "Start fall brassicas indoors", "Prune leggy summer growth"],
    8:  ["Transplant fall crops", "Plant cool greens again", "Ease back on watering as it cools"],
    9:  ["Plant garlic & onions", "Sow cool-season greens", "Cut back on watering"],
    10: ["Harvest fall crops", "Plant cover crops in empty beds", "Mulch for the mild winter"],
    11: ["Plant bare-root trees", "Protect tender plants on cold nights", "Plan next year's garden"],
  },
  moderate: {
    0:  ["Plan the garden & order seeds", "Start onions & leeks indoors", "Prune dormant fruit trees"],
    1:  ["Start tomatoes, peppers, eggplant indoors", "Prep beds as soil thaws", "Chit seed potatoes"],
    2:  ["Sow peas, spinach, radish outdoors", "Start brassicas indoors", "Add compost to beds"],
    3:  ["Transplant hardy seedlings", "Direct-sow carrots, beets, lettuce", "Watch for late frosts"],
    4:  ["Transplant tomatoes & peppers after last frost", "Plant beans, squash, cucumbers", "Harden off seedlings first"],
    5:  ["Succession-sow lettuce & beans", "Mulch to retain moisture", "Stake tomatoes"],
    6:  ["Water deeply in dry spells", "Harvest often", "Start fall brassicas indoors"],
    7:  ["Sow fall crops: kale, spinach, turnips", "Keep harvesting", "Watch for pests"],
    8:  ["Plant garlic later this month", "Harvest & preserve", "Sow cover crops"],
    9:  ["Plant garlic", "Clear spent plants", "Mulch beds for winter"],
    10: ["Protect remaining crops", "Clean & store tools", "Plan crop rotation"],
    11: ["Rest & plan", "Order seeds early", "Check stored produce"],
  },
  cold: {
    0:  ["Plan garden & order seeds", "Start onions & leeks indoors", "Inspect stored produce"],
    1:  ["Start tomatoes, peppers, eggplant indoors", "Test soil", "Prune dormant trees"],
    2:  ["Start brassicas & lettuce indoors", "Prep beds when workable", "Chit potatoes"],
    3:  ["Sow peas & spinach if soil workable", "Start warm crops indoors", "Harden off cold-hardy starts"],
    4:  ["Transplant hardy crops", "Direct-sow radish, carrot, beet", "Watch for hard frosts"],
    5:  ["Transplant tomatoes after last frost", "Plant beans, squash, corn", "Mulch beds"],
    6:  ["Succession-sow quick crops", "Water consistently", "Stake & support plants"],
    7:  ["Harvest heavily", "Sow fall greens", "Start fall brassicas"],
    8:  ["Plant garlic", "Harvest & preserve", "Sow cover crops"],
    9:  ["Harvest before first frost", "Clear & compost spent plants", "Mulch heavily"],
    10: ["Protect or harvest last crops", "Clean & store tools", "Insulate perennials"],
    11: ["Rest & plan next season", "Order seeds", "Maintain equipment"],
  },
};
function MonthlyChecklistCard({ theme, zone, monthlyChecklist, setMonthlyChecklist }) {
  const bucket = getClimateBucket(zone);
  const monthIndex = new Date().getMonth();
  const monthName = new Date().toLocaleDateString("en-US", { month: "long" });
  const tasks = (SEASONAL_TASKS[bucket] && SEASONAL_TASKS[bucket][monthIndex]) || [];

  // Key by year+month so each month starts fresh and old checks don't bleed over.
  const monthKey = `${new Date().getFullYear()}-${String(monthIndex + 1).padStart(2, "0")}`;
  const checked = (monthlyChecklist && monthlyChecklist[monthKey]) || {};
  const toggle = (i) => {
    setMonthlyChecklist((current) => {
      const month = { ...((current && current[monthKey]) || {}) };
      month[i] = !month[i];
      return { ...(current || {}), [monthKey]: month };
    });
  };

  if (!zone || !tasks.length) return null;

  const doneCount = tasks.filter((_, i) => checked[i]).length;

return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{monthName} Garden Checklist</Text>
      <View style={{ gap: 8, marginTop: 16 }}>
        {tasks.map((task, i) => {
          const isDone = !!checked[i];
          return (
            <Pressable
              key={`task-${i}`}
              onPress={() => toggle(i)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: isDone ? "rgba(142,239,171,0.10)" : "rgba(255,255,255,0.05)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: isDone ? "rgba(142,239,171,0.35)" : "rgba(255,255,255,0.10)" }}
            >
              <View style={{ width: 24, height: 24, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: isDone ? "#8effab" : "transparent", borderWidth: 2, borderColor: isDone ? "#8effab" : "rgba(255,255,255,0.3)" }}>
                {isDone && <Text style={{ color: "#0e2414", fontSize: 14, fontWeight: "900" }}>✓</Text>}
              </View>
              <Text style={{ flex: 1, color: isDone ? theme.secondaryText : theme.text, fontSize: 14, fontWeight: "700", textDecorationLine: isDone ? "line-through" : "none" }}>
                {task}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
function DaylightCard({ theme, zipCoords }) {
  const info = getDaylightInfo(zipCoords);
  if (!info) return null;

  const accent = info.longDay ? "#ffd86b" : info.shortDay ? "#6bc7ff" : "#8effab";
  const note = info.longDay
    ? "Long days now — cool crops like lettuce, spinach, and cilantro may bolt. Harvest young and give afternoon shade."
    : info.shortDay
    ? "Short days slow most growth. Focus on cold-hardy greens and root crops, and don't expect fast results."
    : "Good daylight for steady growth across most vegetables.";

return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>{info.gaining ? "🌅" : "🌇"}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900", marginTop: 2 }}>{info.label}</Text>
        </View>
        <View style={{ backgroundColor: `${accent}1a`, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: `${accent}33` }}>
          <Text style={{ color: accent, fontSize: 13, fontWeight: "900" }}>
            {info.gaining ? "▲" : "▼"} {info.deltaMin} min/day
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 20, marginTop: 12 }}>
        {info.gaining ? "Days are getting longer" : "Days are getting shorter"} by about {info.deltaMin} minute{info.deltaMin === 1 ? "" : "s"} a day. {note}
      </Text>
    </View>
  );
}
function FrostWindowCard({ theme, plants, zone, onOpenPlant }) {
  if (!zone) return null;
  const atRisk = (plants || [])
    .filter((item) => getPlantSeasonLabel(item, zone) === "Plant now")
    .map((item) => ({ item, info: getFrostMaturityInfo(item, zone) }))
    .filter((e) => e.info && e.info.atRisk)
    .sort((a, b) => b.info.short - a.info.short)
    .slice(0, 5);

  if (!atRisk.length) return null;

  const firstFrost = getFirstFrostDate(zone);
  const frostLabel = firstFrost.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(107,199,255,0.10)", borderCrolor: "#6bc7ff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>⏳</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>FROST WINDOW</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            May not finish before frost
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        First frost is estimated around {frostLabel}. These crops need longer than that to mature if planted now — start them indoors, pick a faster variety, or wait for spring.
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {atRisk.map(({ item, info }) => {
          const img = resolvePlantImageSource(item);
          return (
            <Pressable
              key={`frostwin-${item.name}`}
              onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(107,199,255,0.22)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{item.name}</Text>
                <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  Needs ~{info.days}d · only ~{info.daysUntilFrost}d left · short ~{info.short}d
                </Text>
              </View>
              <Text style={{ color: "#6bc7ff", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Estimated from your zone — a fast-maturing variety may still finish in time.
      </Text>
    </View>
  );
}
function getWaterTriage(savedPlants, wateringHistory, wateringAmounts) {
  const rows = (savedPlants || [])
    .map((name) => {
      const item = produceData.find((p) => p.name === name);
      if (!item) return null;
      const info = getNextWaterInfo(name, item, wateringHistory);
      if (!info) return null;
      const d = typeof info.daysUntil === "number" ? info.daysUntil : null;
      if (d === null) return null;
      let bucket;
      if (d < 0) bucket = "overdue";
      else if (d === 0) bucket = "today";
      else if (d === 1) bucket = "tomorrow";
      else return null;
      return { name, item, info, daysUntil: d, bucket };
    })
    .filter(Boolean);
  const order = { overdue: 0, today: 1, tomorrow: 2 };
  return rows.sort((a, b) => {
    if (order[a.bucket] !== order[b.bucket]) return order[a.bucket] - order[b.bucket];
    return a.daysUntil - b.daysUntil;
  });
}
function WaterTriageCard({ theme, savedPlants, wateringHistory, wateringAmounts, onWater, onOpenPlant }) {
  const rows = getWaterTriage(savedPlants, wateringHistory, wateringAmounts);
  if (!rows.length) return null;

  const BUCKET = {
    overdue: { color: "#ff7a7a", icon: "🔴", label: "Overdue" },
    today: { color: "#ffd86b", icon: "🟡", label: "Due today" },
    tomorrow: { color: "#6bc7ff", icon: "🔵", label: "Tomorrow" },
  };
  const overdueCount = rows.filter((r) => r.bucket === "overdue").length;
  const todayCount = rows.filter((r) => r.bucket === "today").length;

  const summary =
    overdueCount > 0
      ? `${overdueCount} overdue${todayCount ? `, ${todayCount} due today` : ""} — start at the top.`
      : todayCount > 0
      ? `${todayCount} due today, plus tomorrow's coming up.`
      : "Nothing overdue — just tomorrow's on deck.";

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: overdueCount ? "#ff7a7a" : "rgba(107,199,255,0.28)" }]}>
      <Text style={styles.cardEyebrow}>🚿 WATERING QUEUE</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Water These, In Order</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>{summary}</Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map(({ name, item, bucket, daysUntil }) => {
          const b = BUCKET[bucket];
          const img = resolvePlantImageSource(item);
          const detail =
            bucket === "overdue"
              ? `${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? "" : "s"} overdue`
              : bucket === "today"
              ? "Due today"
              : "Due tomorrow";
          return (
            <View
              key={`triage-${name}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: `${b.color}30` }}
            >
              <Pressable onPress={() => onOpenPlant(item)} style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{name}</Text>
                    <Text style={{ color: b.color, fontSize: 11, fontWeight: "900" }}>{b.icon} {b.label}</Text>
                  </View>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{detail}</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => onWater(name)}
                style={{ backgroundColor: `${b.color}22`, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1, borderColor: `${b.color}44` }}
              >
                <Text style={{ color: b.color, fontSize: 13, fontWeight: "900" }}>💧 Water</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
function getSuccessionInterval(plantName) {
  const SUCCESSION_INTERVALS = [
    { match: ["radish"], days: 10 },
    { match: ["arugula", "mesclun"], days: 10 },
    { match: ["lettuce"], days: 14 },
    { match: ["spinach"], days: 14 },
    { match: ["cilantro", "coriander"], days: 14 },
    { match: ["bean"], days: 14 },
    { match: ["pea"], days: 14 },
    { match: ["turnip"], days: 14 },
    { match: ["beet"], days: 21 },
    { match: ["carrot"], days: 21 },
    { match: ["green onion", "scallion"], days: 21 },
    { match: ["basil"], days: 21 },
    { match: ["kale"], days: 21 },
  ];
  const n = String(plantName || "").toLowerCase();
  const hit = SUCCESSION_INTERVALS.find((row) => row.match.some((w) => n.includes(w)));
  return hit ? hit.days : null;
}
function getSuccessionInfo(name, item, zone, sowLog) {
  const interval = getSuccessionInterval(name);
  if (!interval) return null;
  if (getPlantSeasonLabel(item, zone) !== "Plant now") return null;
  const last = sowLog?.[name];
  if (!last) return { interval, status: "start", daysSince: null, daysUntil: null };
  const lastDate = new Date(`${String(last).slice(0, 10)}T12:00:00`);
  const now = new Date(); now.setHours(12, 0, 0, 0);
  const daysSince = Math.round((now - lastDate) / (1000 * 60 * 60 * 24));
  if (daysSince >= interval) return { interval, status: "due", daysSince, daysUntil: 0 };
  return { interval, status: "waiting", daysSince, daysUntil: interval - daysSince };
}
function SuccessionSowingCard({ theme, savedPlants, zone, sowLog, onSow }) {
  if (!zone) return null;

  const rank = { due: 0, start: 1, waiting: 2 };
  const rows = (savedPlants || [])
    .map((name) => {
      const item = produceData.find((p) => p.name === name);
      if (!item) return null;
      const info = getSuccessionInfo(name, item, zone, sowLog);
      return info ? { name, item, info } : null;
    })
    .filter(Boolean)
    .sort((a, b) => rank[a.info.status] - rank[b.info.status])
    .slice(0, 6);

  if (!rows.length) return null;

  const STATUS = {
    due: { color: "#5cff89", icon: "🌱", label: "Sow again now" },
    start: { color: "#6bc7ff", icon: "✨", label: "Start a first sowing" },
    waiting: { color: "#9aa5a0", icon: "⏳", label: "On schedule" },
  };

return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map(({ name, item, info }) => {
          const s = STATUS[info.status];
          const img = resolvePlantImageSource(item);
          const detail =
            info.status === "due"
              ? `Last sown ${info.daysSince}d ago · every ~${info.interval}d`
              : info.status === "waiting"
              ? `Next round in ~${info.daysUntil}d · every ~${info.interval}d`
              : `Recommended every ~${info.interval}d in season`;
          return (
            <View
              key={`succ-${name}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: `${s.color}30` }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{name}</Text>
                  <Text style={{ color: s.color, fontSize: 11, fontWeight: "900" }}>{s.icon} {s.label}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{detail}</Text>
              </View>
              <Pressable
                onPress={() => onSow(name)}
                style={{ backgroundColor: info.status === "waiting" ? "rgba(255,255,255,0.08)" : `${s.color}22`, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: `${s.color}44` }}
              >
                <Text style={{ color: info.status === "waiting" ? theme.secondaryText : s.color, fontSize: 12, fontWeight: "900" }}>Sow today</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
      </Text>
    </View>
  );
}
function SeedStartingCard({ theme, plants, zone, onOpenPlant }) {
  const scored = (plants || [])
    .map((item) => ({ item, info: getSeedStartInfo(item, zone) }))
    .filter((e) => e.info && (e.info.status === "start-now" || e.info.status === "upcoming"))
    .sort((a, b) => a.info.daysUntilStart - b.info.daysUntilStart);

  const startNow = scored.filter((e) => e.info.status === "start-now");
  const upcoming = scored.filter((e) => e.info.status === "upcoming").slice(0, 4);
  if (!startNow.length && !upcoming.length) return null;
  const accent = startNow.length ? "#8effab" : "#6bc7ff";

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: `${accent}12`, borderColor: accent }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>🌱</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: accent, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>SEED STARTING</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {startNow.length ? `Start ${startNow.length} plant${startNow.length === 1 ? "" : "s"} indoors now` : "Coming up to start indoors"}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        Starting seeds indoors ahead of your last frost gives transplants a head start when it warms up.
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {startNow.map(({ item, info }) => {
          const img = resolvePlantImageSource(item);
          return (
            <Pressable key={`start-${item.name}`} onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(142,255,171,0.22)" }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{item.name}</Text>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  Start indoors by {info.startByLabel} · {info.weeks} wks before frost
                </Text>
                <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 2 }}>
                  Transplant around {info.transplantLabel}
                </Text>
              </View>
              <Text style={{ color: accent, fontSize: 22, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
        {upcoming.map(({ item, info }) => (
          <View key={`soon-${item.name}`} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{item.name}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800" }}>in {info.daysUntilStart}d</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
function WateringStreakNudge({ theme, savedPlants, wateringHistory, snoozedPlants, onOpenPlant, onWater }) {
  const tomorrowKey = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const atRisk = (savedPlants || [])
    .filter((name) => snoozedPlants?.[name] !== tomorrowKey)
    .map((name) => {
      const daysLeft = getStreakDaysLeft(name, wateringHistory);
      if (!daysLeft) return null;
      return { name, daysLeft, streak: getWateringStreak(name, wateringHistory) };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysLeft - b.daysLeft || b.streak - a.streak);

  if (!atRisk.length) return null;

  const urgentToday = atRisk.filter((p) => p.daysLeft === 1);
  const accent = urgentToday.length ? "#ff9f43" : "#ffd86b";
  const headline = urgentToday.length
    ? `Water ${urgentToday.length === 1 ? urgentToday[0].name : `${urgentToday.length} plants`} today to keep your streak`
    : `${atRisk.length} watering streak${atRisk.length === 1 ? "" : "s"} winding down`;

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: `${accent}12`, borderColor: accent }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>🔥</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: accent, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>DON'T BREAK YOUR STREAK</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>{headline}</Text>
        </View>
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        These plants have a watering streak going. Water them before the window closes to keep it alive.
      </Text>

      <View style={{ gap: 10, marginTop: 14 }}>
        {atRisk.map((p) => {
          const plant = produceData.find((item) => item.name === p.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          const critical = p.daysLeft === 1;
          return (
            <View
              key={p.name}
              style={{
                flexDirection: "row", alignItems: "center", gap: 12,
                backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12,
                borderWidth: 1, borderColor: critical ? "rgba(255,159,67,0.35)" : "rgba(255,255,255,0.08)",
              }}
            >
              <Pressable onPress={() => plant && onOpenPlant(plant)} style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{p.name}</Text>
                  <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900", marginTop: 2 }}>🔥 {p.streak}-day streak</Text>
                  <Text style={{ color: critical ? accent : theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 2 }}>
                    {critical ? "⏳ Last day to keep it!" : `⏳ ${p.daysLeft} days left`}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => onWater(p.name)}
                accessibilityRole="button"
                accessibilityLabel={`Water ${p.name} to keep its streak`}
                style={{ backgroundColor: "#6bc7ff", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11 }}
              >
                <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>💧 Water</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function PlantGrowthTimeline({ theme, plant, journalEntries, premiumUnlocked, onAddPhoto, onUnlock }) {
  const STAGE_COLORS = {
    "Seedling": "#8effab",
    "Leaf Growth": "#5cff89",
    "Flowering": "#ffd86b",
    "Fruit Forming": "#ff9f43",
    "Harvest Ready": "#ff6b6b",
  };
  const stageColor = (s) => STAGE_COLORS[s] || "#5cff89";

  const entries = (journalEntries || [])
    .filter((e) => e.plantName === plant.name && e.imageUri)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const dayNumber = (entry) => {
    if (!entries.length) return 1;
    const base = new Date(entries[0].createdAt);
    const then = new Date(entry.createdAt);
    const diff = Math.floor((then - base) / (1000 * 60 * 60 * 24));
    return Number.isNaN(diff) ? 1 : diff + 1;
  };

  const first = entries[0];
  const latest = entries[entries.length - 1];
  const hasBeforeAfter = entries.length >= 2;

  return (
    <View style={styles.card}>
      <Text style={styles.cardEyebrow}>📸 Growth timeline</Text>
      <Text style={styles.cardTitle}>{plant.name}'s Progress</Text>

      {!premiumUnlocked ? (
        <PremiumLockedSection
          icon="📸"
          title="Growth Timeline"
          description="Watch your plant grow from seedling to harvest with a photo-by-photo before-and-after timeline."
          onUnlock={onUnlock}
        />
      ) : entries.length === 0 ? (
        <>
          <Text style={styles.cardText}>
          </Text>
          <Pressable
            onPress={onAddPhoto}
            style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}
          >
            <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>📸 Add first photo</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.cardText}>
            {entries.length} photo{entries.length === 1 ? "" : "s"} tracking {plant.name}'s growth.
          </Text>

          {/* BEFORE & AFTER */}
          {hasBeforeAfter ? (
            <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
              {[{ label: "First", e: first }, { label: "Latest", e: latest }].map(({ label, e }) => (
                <View key={label} style={{ flex: 1 }}>
                  <View style={{ borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: `${stageColor(e.growthStage)}55` }}>
                    <Image source={{ uri: e.imageUri }} style={{ width: "100%", height: 150 }} resizeMode="cover" />
                    <View style={{ position: "absolute", top: 8, left: 8, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: "900" }}>{label}</Text>
                    </View>
                  </View>
                  <Text style={{ color: stageColor(e.growthStage), fontSize: 12, fontWeight: "900", marginTop: 6 }}>
                    {e.growthStage || "Seedling"}
                  </Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 2 }}>
                    Day {dayNumber(e)} · {new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* FULL VERTICAL PROGRESSION */}
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginTop: 20, marginBottom: 10, textTransform: "uppercase" }}>
            Full progression
          </Text>
          <View style={{ gap: 14 }}>
            {entries.map((e, i) => (
              <View key={e.id} style={{ flexDirection: "row", gap: 12 }}>
                {/* timeline rail */}
                <View style={{ alignItems: "center", width: 16 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: stageColor(e.growthStage) }} />
                  {i < entries.length - 1 ? (
                    <View style={{ flex: 1, width: 2, backgroundColor: "rgba(92,255,137,0.20)", marginTop: 2 }} />
                  ) : null}
                </View>
                {/* photo + meta */}
                <View style={{ flex: 1, borderRadius: 18, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                  <Image source={{ uri: e.imageUri }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
                  <View style={{ padding: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ backgroundColor: `${stageColor(e.growthStage)}22`, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: `${stageColor(e.growthStage)}55` }}>
                        <Text style={{ color: stageColor(e.growthStage), fontSize: 11, fontWeight: "900" }}>{e.growthStage || "Seedling"}</Text>
                      </View>
                      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800" }}>
                        Day {dayNumber(e)} · {new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </Text>
                    </View>
                    {e.mood ? (
                      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 8 }}>{e.mood}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            onPress={onAddPhoto}
            style={{ marginTop: 16, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 16, paddingVertical: 13, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
          >
            <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 13 }}>📸 Add another photo to the timeline</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

function GardenStatsDashboard({
  theme,
  savedPlants,
  journalEntries,
  gardenMap,
  gardenXP,
  streakData,
  wateredPlants,
  wateringHistory,
  weather,
  zone,
  harvestTrackers,
  fertilizerTrackers,
  onNavigate,
  onWaterAll,
}) {
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const today = getTodayKey();

  const weekAgoTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const photosThisWeek = (journalEntries || []).filter((e) => {
    const t = new Date(e.createdAt).getTime();
    return !Number.isNaN(t) && t >= weekAgoTime;
  }).length;
  const wateringsThisWeek = Object.values(wateringHistory || {}).reduce((sum, dates) => {
    if (!Array.isArray(dates)) return sum;
    return sum + dates.filter((d) => {
      const t = new Date(`${String(d).slice(0, 10)}T12:00:00`).getTime();
      return !Number.isNaN(t) && t >= weekAgoTime;
    }).length;
  }, 0);
  const hasWeeklyMomentum = photosThisWeek > 0 || wateringsThisWeek > 0;

  const wateredTodayCount = Object.values(wateredPlants || {}).filter(v => v === today).length;
  const totalWatered = Object.values(wateredPlants || {}).filter(Boolean).length;
  const plantsNeedingWater = savedPlants.length - wateredTodayCount;

  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, tracker]) => {
    const daysLeft = Math.max(0, tracker.days - Math.floor((new Date() - new Date(tracker.startedAt)) / (1000 * 60 * 60 * 24)));
    return daysLeft === 0;
  }).length;

  const harvestsTracking = Object.keys(harvestTrackers || {}).length;

  const fertDue = savedPlants.filter(plantName => {
    const tracker = fertilizerTrackers?.[plantName];
    if (!tracker) return false;
    const daysSince = Math.floor((new Date() - new Date(tracker.lastFertilized)) / (1000 * 60 * 60 * 24));
    return daysSince >= 14;
  }).length;

  const plantsDocumented = new Set(journalEntries.map(e => e.plantName).filter(Boolean)).size;
  const thisMonthPhotos = journalEntries.filter(e => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const gardenHealth = calculateGardenHealth(gardenMap);
  const xpToNext = gardenXP.nextLevelXP - gardenXP.currentLevelXP;
  const levelProgress = gardenXP.progress || 0;

  const getStreakEmoji = (count) => {
    if (count >= 30) return "🏆";
    if (count >= 14) return "🔥";
    if (count >= 7) return "⚡";
    return "🌱";
  };

 const getHealthColor = (score) => {
    if (score === 0) return "#8fbf9d";
    if (score >= 80) return "#5cff89";
    if (score >= 60) return "#ffd86b";
    return "#ff7b7b";
  };

  const weatherStatus = !weather ? null
    : weather.minTempF <= 35 ? { icon: "❄️", label: "Frost Risk", color: "#6bc7ff" }
    : weather.maxTempF >= 98 ? { icon: "🔥", label: "Heat Alert", color: "#ff7b7b" }
    : weather.precipChance >= 70 ? { icon: "🌧️", label: "Rain Today", color: "#6bc7ff" }
    : { icon: "☀️", label: "Good Day", color: "#5cff89" };

return (
    <View>

      {/* HEADER */}
      <Text style={[styles.gardenStatsSubtitle, { color: theme.secondaryText }]}>
        Zone {zone || "—"} • {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </Text>

      {/* XP PROGRESS BAR */}
      <View style={styles.dashXPRow}>
        <View style={styles.dashXPLeft}>
          <Text style={styles.dashXPLevel}>Lvl {gardenXP.level}</Text>
          <Text style={[styles.dashXPTitle, { color: theme.secondaryText }]}>{gardenXP.title}</Text>
        </View>
        <View style={styles.dashXPBarWrap}>
          <AnimatedBar progress={levelProgress} color="#5cff89" trackStyle={styles.dashXPTrack} fillStyle={styles.dashXPFill} />
          <Text style={styles.dashXPMeta}>{gardenXP.currentLevelXP} / {gardenXP.nextLevelXP} XP • {xpToNext} to next level</Text>
          {getConsistencyBonus(streakData?.count || 0) > 0 ? (
            <Text style={{ color: "#ff9f43", fontSize: 10, fontWeight: "900", marginTop: 2 }}>
              🔥 +{getConsistencyBonus(streakData?.count || 0)} consistency bonus
            </Text>
          ) : null}
        </View>
        <Text style={styles.dashXPEmoji}>{getStreakEmoji(streakData?.count || 0)}</Text>
      </View>

      {/* WEATHER + STREAK ROW */}
      <View style={styles.dashTopRow}>
        {weatherStatus ? (
          <View style={[styles.dashTopCard, { borderColor: weatherStatus.color + "55" }]}>
            <Text style={styles.dashTopCardIcon}>{weatherStatus.icon}</Text>
            <Text style={[styles.dashTopCardLabel, { color: weatherStatus.color }]}>{weatherStatus.label}</Text>
            <Text style={[styles.dashTopCardSub, { color: theme.secondaryText }]}>
              {weather?.maxTempF ? `${Math.round(weather.maxTempF)}° / ${Math.round(weather.minTempF)}°` : "—"}
            </Text>
          </View>
        ) : null}
        <View style={[styles.dashTopCard, { borderColor: streakData?.count >= 7 ? "#ff9f4355" : "rgba(255,255,255,0.08)" }]}>
          <Text style={styles.dashTopCardIcon}>{getStreakEmoji(streakData?.count || 0)}</Text>
          <Text style={[styles.dashTopCardLabel, { color: streakData?.count >= 7 ? "#ff9f43" : theme.text }]}>{streakData?.count || 0} Days</Text>
          <Text style={[styles.dashTopCardSub, { color: theme.secondaryText }]}>Streak</Text>
        </View>
        <View style={[styles.dashTopCard, { borderColor: getHealthColor(gardenHealth.score) + "55" }]}>
          <Text style={styles.dashTopCardIcon}>🌿</Text>
          <Text style={[styles.dashTopCardLabel, { color: getHealthColor(gardenHealth.score) }]}>{gardenHealth.score}%</Text>
          <Text style={[styles.dashTopCardSub, { color: theme.secondaryText }]}>Health</Text>
        </View>
        <View style={styles.dashTopCard}>
          <Text style={styles.dashTopCardIcon}>🏆</Text>
          <Text style={[styles.dashTopCardLabel, { color: theme.text }]}>Lvl {gardenXP.level}</Text>
          <Text style={[styles.dashTopCardSub, { color: theme.secondaryText }]}>Rank</Text>
        </View>
      </View>

      {/* MAIN STATS GRID */}
      <View style={styles.dashMainGrid}>

        {/* PLANTS */}
        <View style={[styles.dashMainCard, { borderColor: "rgba(92,255,137,0.22)" }]}>
          <Text style={styles.dashMainCardEyebrow}>🌱 PLANTS</Text>
          <Text style={styles.dashMainCardValue}>{savedPlants.length}</Text>
          <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>Saved</Text>
          <View style={styles.dashMainCardDivider} />
          <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>
            {gardenPlotCount} in garden map
          </Text>
        </View>

        {/* WATERING */}
        <View style={[styles.dashMainCard, {
          borderColor: wateredTodayCount === savedPlants.length && savedPlants.length > 0 ? "rgba(92,255,137,0.35)" : "rgba(107,199,255,0.22)"
        }]}>
          <Text style={styles.dashMainCardEyebrow}>💧 WATERING</Text>
          <Text style={[styles.dashMainCardValue, { color: wateredTodayCount > 0 ? "#6bc7ff" : "#ffffff" }]}>
            {wateredTodayCount}/{savedPlants.length}
          </Text>
          <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>Watered Today</Text>
          <View style={styles.dashMainCardDivider} />
          <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>
            {totalWatered} total waterings
          </Text>
        </View>

        {/* JOURNAL */}
        <View style={[styles.dashMainCard, { borderColor: "rgba(255,216,107,0.22)" }]}>
          <Text style={styles.dashMainCardEyebrow}>📸 JOURNAL</Text>
          <Text style={styles.dashMainCardValue}>{journalEntries.length}</Text>
          <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>Total Photos</Text>
          <View style={styles.dashMainCardDivider} />
          <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>
            {thisMonthPhotos} this month
          </Text>
        </View>

        {/* HARVEST */}
        <View style={[styles.dashMainCard, {
          borderColor: harvestsReady > 0 ? "rgba(255,216,107,0.45)" : "rgba(255,159,67,0.22)"
        }]}>
          <Text style={styles.dashMainCardEyebrow}>🚜 HARVEST</Text>
          <Text style={[styles.dashMainCardValue, { color: harvestsReady > 0 ? "#ffd86b" : "#ffffff" }]}>
            {harvestsReady > 0 ? `${harvestsReady} Ready!` : harvestsTracking}
          </Text>
          <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>
            {harvestsReady > 0 ? "To harvest" : "Tracking"}
          </Text>
          <View style={styles.dashMainCardDivider} />
          <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>
            {harvestsTracking} plants tracked
          </Text>
        </View>

      </View>

      {/* TODAY'S ACTION ITEMS */}
      <View style={styles.dashActionSection}>
        <Text style={styles.dashActionTitle}>To-Do</Text>

        {plantsNeedingWater > 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(107,199,255,0.10)", borderColor: "rgba(107,199,255,0.25)", flexDirection: "column", alignItems: "stretch", gap: 12 }]}>
            <Pressable onPress={() => onNavigate && onNavigate("plants")} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={styles.dashActionIcon}>💧</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.dashActionLabel}>{plantsNeedingWater} plant{plantsNeedingWater === 1 ? "" : "s"} need watering</Text>
                <Text style={[styles.dashActionSub, { color: "#6bc7ff" }]}>Tap to open the Plants tab and water →</Text>
              </View>
              <View style={[styles.dashActionBadge, { backgroundColor: "rgba(107,199,255,0.20)" }]}>
                <Text style={[styles.dashActionBadgeText, { color: "#6bc7ff" }]}>{plantsNeedingWater}</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => onWaterAll && onWaterAll()}
              accessibilityRole="button"
              accessibilityLabel="Water all plants that need water today"
              style={{ backgroundColor: "#6bc7ff", borderRadius: 14, paddingVertical: 13, alignItems: "center" }}
            >
              <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>💧 Water all {plantsNeedingWater} now</Text>
            </Pressable>
          </View>
        ) : savedPlants.length > 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(92,255,137,0.10)", borderColor: "rgba(92,255,137,0.25)" }]}>
            <Text style={styles.dashActionIcon}>✅</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>All plants watered today!</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>Great work keeping your garden hydrated</Text>
            </View>
          </View>
        ) : null}

        {harvestsReady > 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(255,216,107,0.10)", borderColor: "rgba(255,216,107,0.28)" }]}>
            <Text style={styles.dashActionIcon}>🎉</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>{harvestsReady} plant{harvestsReady === 1 ? "" : "s"} ready to harvest!</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>Check your plant cards to harvest today</Text>
            </View>
            <View style={[styles.dashActionBadge, { backgroundColor: "rgba(255,216,107,0.20)" }]}>
              <Text style={[styles.dashActionBadgeText, { color: "#ffd86b" }]}>{harvestsReady}</Text>
            </View>
          </View>
        ) : null}

        {fertDue > 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(142,255,171,0.08)", borderColor: "rgba(142,255,171,0.20)" }]}>
            <Text style={styles.dashActionIcon}>🌿</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>{fertDue} plant{fertDue === 1 ? "" : "s"} due for fertilizer</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>It's been 14+ days since last feeding</Text>
            </View>
            <View style={[styles.dashActionBadge, { backgroundColor: "rgba(142,255,171,0.15)" }]}>
              <Text style={[styles.dashActionBadgeText, { color: "#8effab" }]}>{fertDue}</Text>
            </View>
          </View>
        ) : null}

        {gardenHealth.score < 70 && gardenPlotCount > 1 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(255,123,123,0.08)", borderColor: "rgba(255,123,123,0.22)" }]}>
            <Text style={styles.dashActionIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>Garden has companion conflicts</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>Check the Garden tab to fix plant pairings</Text>
            </View>
            <View style={[styles.dashActionBadge, { backgroundColor: "rgba(255,123,123,0.15)" }]}>
              <Text style={[styles.dashActionBadgeText, { color: "#ff7b7b" }]}>{gardenHealth.score}%</Text>
            </View>
          </View>
        ) : null}

        {plantsNeedingWater === 0 && harvestsReady === 0 && fertDue === 0 && gardenHealth.score >= 70 && savedPlants.length > 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(92,255,137,0.08)", borderColor: "rgba(92,255,137,0.18)" }]}>
            <Text style={styles.dashActionIcon}>🌟</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>Your garden is thriving!</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>Everything is on track — keep up the great work</Text>
            </View>
          </View>
        ) : null}

        {savedPlants.length === 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.10)" }]}>
            <Text style={styles.dashActionIcon}>🌱</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>Save your first plant to get started</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>Browse the Plants tab and tap Save on any plant</Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* BOTTOM QUICK STATS */}
      <View style={styles.dashBottomRow}>
        <View style={styles.dashBottomStat}>
          <Text style={styles.dashBottomStatValue}>{plantsDocumented}</Text>
          <Text style={[styles.dashBottomStatLabel, { color: theme.secondaryText }]}>Plants Documented</Text>
        </View>
        <View style={styles.dashBottomDivider} />
        <View style={styles.dashBottomStat}>
          <Text style={styles.dashBottomStatValue}>{gardenXP.xp}</Text>
          <Text style={[styles.dashBottomStatLabel, { color: theme.secondaryText }]}>Total XP</Text>
        </View>
        <View style={styles.dashBottomDivider} />
     <View style={styles.dashBottomStat}>
          <Text style={styles.dashBottomStatValue}>{gardenPlotCount}/12</Text>
          <Text style={[styles.dashBottomStatLabel, { color: theme.secondaryText }]}>Plots Filled</Text>
        </View>
      </View>

      {hasWeeklyMomentum ? (
        <View style={[styles.dashActionRow, { marginTop: 12, backgroundColor: "rgba(92,255,137,0.08)", borderColor: "rgba(92,255,137,0.20)", flexDirection: "column", alignItems: "stretch", gap: 12 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={styles.dashActionIcon}>📈</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>This week's momentum</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>
                {[
                  wateringsThisWeek > 0 ? `💧 ${wateringsThisWeek} watering${wateringsThisWeek === 1 ? "" : "s"}` : null,
                  photosThisWeek > 0 ? `📸 ${photosThisWeek} photo${photosThisWeek === 1 ? "" : "s"}` : null,
                  (streakData?.count || 0) > 0 ? `🔥 ${streakData.count}-day streak` : null,
                ].filter(Boolean).join("  •  ")}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={async () => {
              try {
                tapHaptic("light");
                const lines = [
                  "🌱 My Pocket Planter garden this week:",
                  "",
                  `🪴 ${savedPlants.length} plants growing`,
                  wateringsThisWeek > 0 ? `💧 ${wateringsThisWeek} watering${wateringsThisWeek === 1 ? "" : "s"} this week` : null,
                  photosThisWeek > 0 ? `📸 ${photosThisWeek} garden photo${photosThisWeek === 1 ? "" : "s"} logged` : null,
                  (streakData?.count || 0) > 0 ? `🔥 ${streakData.count}-day streak going strong` : null,
                  `⭐ Level ${gardenXP.level} — ${gardenXP.title}`,
                  "",
                  "Growing smarter with Pocket Planter 🌿",
                ].filter(Boolean);
                await Share.share({ message: lines.join("\n") });
              } catch (error) {
                console.log("Share skipped:", error);
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Share my garden week"
            style={{ backgroundColor: "#5cff89", borderRadius: 14, paddingVertical: 13, alignItems: "center" }}
          >
            <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>📸 Share my garden week</Text>
          </Pressable>
        </View>
      ) : null}

    </View>
  );
}
function AnimatedBar({ progress, color = "#5cff89", trackStyle, fillStyle }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: Math.max(0, Math.min(progress || 0, 1)),
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress, widthAnim]);
  const width = widthAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  return (
    <View style={trackStyle}>
      <Animated.View style={[fillStyle, { width, backgroundColor: color }]} />
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

function FertilizerIntelligenceCard({ theme, weather, zone, savedPlants, fertilizerTrackers, onOpenPlant }) {
  const currentMonth = new Date().getMonth() + 1;
  const today = getTodayKey();

  const getSeasonalFertilizerTip = () => {
  const climate = getClimateBucket(zone);

  if (climate === "hot") {
    if (currentMonth >= 2 && currentMonth <= 4) {
      return {
        season: "🌱 Early Spring (Hot Zone)",
        type: "Balanced (10-10-10)",
        product: "Use slow-release granular fertilizer for steady feeding",
        reason: "Warm zones start growing early. A balanced feed now kickstarts roots before summer heat arrives.",
        frequency: "Every 2 weeks",
        bestTime: "Early morning before 9am",
        tip: "In hot zones spring is short — get nutrients in early before temperatures spike above 95°F.",
      };
    }
    if (currentMonth >= 5 && currentMonth <= 9) {
      return {
        season: "🔥 Summer (Hot Zone)",
        type: "Low Nitrogen, High Potassium",
        product: "Look for 3-5-7 or 0-0-50 potassium fertilizer",
        reason: "Summer heat in warm zones stresses plants.",
        frequency: "Once every 3-4 weeks",
        bestTime: "Early morning only — never midday",
        tip: "Skip fertilizing on days above 98°F. Heat plus fertilizer salts can burn roots rapidly in warm climates.",
      };
    }
    if (currentMonth >= 10 && currentMonth <= 12) {
      return {
        season: "🍂 Fall/Winter (Hot Zone)",
        type: "Phosphorus-Rich (5-10-5)",
        product: "Bone meal or superphosphate works great",
        reason: "Fall and winter are prime growing season in hot zones. Phosphorus now supports strong root and fruit development.",
        frequency: "Every 2-3 weeks",
        bestTime: "Morning or afternoon",
        tip: "Hot zone gardeners get a second growing season in fall — treat it like spring and fertilize accordingly.",
      };
    }
    return {
      season: "🌿 Winter (Hot Zone)",
      type: "Light Balanced Feed",
      product: "Diluted liquid fertilizer at half strength",
      reason: "Mild winters in warm zones mean plants keep growing slowly. Light feeding keeps them healthy without overloading.",
      frequency: "Once a month",
      bestTime: "Midday when temps are warmest",
      tip: "Even in winter, hot zone plants benefit from occasional feeding — just reduce the dose significantly.",
    };
  }

  if (climate === "cold") {
    if (currentMonth >= 5 && currentMonth <= 6) {
      return {
        season: "🌱 Late Spring (Cold Zone)",
        type: "High Nitrogen (N)",
        product: "Look for 20-20-20 or blood meal for nitrogen boost",
        reason: "Cold zones have a short growing window. High nitrogen now accelerates leafy growth before summer.",
        frequency: "Every 2 weeks",
        bestTime: "Morning after last frost risk passes",
        tip: "Wait until soil temps reach at least 50°F before fertilizing — cold soil can't absorb nutrients properly.",
      };
    }
    if (currentMonth >= 7 && currentMonth <= 8) {
      return {
        season: "☀️ Summer (Cold Zone)",
        type: "Balanced (10-10-10)",
        product: "Granular slow-release balanced fertilizer",
        reason: "Peak growing season in cold zones is short. A balanced feed keeps plants productive through the warm months.",
        frequency: "Every 2-3 weeks",
        bestTime: "Early morning",
        tip: "Mid-summer is your most important feeding window in cold zones — don't skip it.",
      };
    }
    if (currentMonth >= 9 && currentMonth <= 10) {
      return {
        season: "🍂 Early Fall (Cold Zone)",
        type: "High Potassium (K)",
        product: "Look for 0-0-60 or wood ash for natural potassium",
        reason: "Potassium helps cold zone plants harden off and store energy before the long winter ahead.",
        frequency: "Once in early fall only",
        bestTime: "Morning",
        tip: "Stop all fertilizing by mid-October in cold zones — new growth triggered late in the season will be frost damaged.",
      };
    }
    return {
      season: "❄️ Winter/Early Spring (Cold Zone)",
      type: "No feeding needed",
      product: "Add compost to beds instead",
      reason: "Plants in cold zones are fully dormant. Fertilizing now is wasteful and can damage roots under frozen soil.",
      frequency: "Skip until late spring",
      bestTime: "Wait for soil to thaw",
      tip: "Use winter to improve your soil with compost. By the time plants wake up in spring the nutrients will be ready.",
    };
  }

  // moderate zone (default)
  if (currentMonth >= 3 && currentMonth <= 5) {
    return {
      season: "🌱 Spring (Moderate Zone)",
      type: "High Nitrogen (N)",
      product: "Look for 10-10-10 or 20-20-20 balanced fertilizer",
      reason: "Spring is peak leafy growth season. Nitrogen fuels green foliage and strong stem development.",
      frequency: "Every 2 weeks",
      bestTime: "Early morning before 10am",
      tip: "Water your plants the day before fertilizing so roots absorb nutrients without burning.",
    };
  }
  if (currentMonth >= 6 && currentMonth <= 8) {
    return {
      season: "☀️ Summer (Moderate Zone)",
      type: "High Phosphorus (P)",
      product: "Look for 5-10-5 or bloom booster fertilizer",
      reason: "Summer triggers flowering and fruiting. Phosphorus supports strong blooms and fruit set.",
      frequency: "Every 3 weeks",
      bestTime: "Early morning before heat peaks",
      tip: "Avoid fertilizing during heat waves above 95°F — wait for a cooler day to prevent root burn.",
    };
  }
  if (currentMonth >= 9 && currentMonth <= 11) {
    return {
      season: "🍂 Fall (Moderate Zone)",
      type: "High Potassium (K)",
      product: "Look for 0-0-60 or 3-5-7 root fertilizer",
      reason: "Fall feeding strengthens roots and helps plants store energy for winter dormancy.",
      frequency: "Once a month",
      bestTime: "Morning or early afternoon",
      tip: "Cut back on nitrogen in fall — too much green growth now will be damaged by first frost.",
    };
  }
  return {
    season: "❄️ Winter (Moderate Zone)",
    type: "Minimal feeding",
    product: "Compost or worm castings only",
    reason: "Most plants are dormant in winter. Heavy fertilizing now can burn roots and stress plants.",
    frequency: "Once every 6-8 weeks for indoor plants only",
    bestTime: "Midday when temps are warmest",
    tip: "Focus on soil health this season — add compost to garden beds to prep for spring planting.",
  };
};

const getWeatherWarning = () => {
  if (!weather) return null;
  if (weather.maxTempF >= 95) return { icon: "🔥", text: "Too hot to fertilize today. Wait for temps below 90°F to avoid root burn." };
  if (weather.precipChance >= 70) return { icon: "🌧️", text: "Rain expected today. Hold off — heavy rain will wash away fertilizer before roots absorb it." };
  if (weather.minTempF <= 35) return { icon: "❄️", text: "Frost risk tonight. Don't fertilize — cold temps slow nutrient absorption significantly." };
  return { icon: "✅", text: "Great conditions to fertilize today. Mild temps and low rain chance means nutrients will absorb well." };
};

const getPlantsDueForFertilizer = () => {
  return savedPlants.filter((plantName) => {
    const tracker = fertilizerTrackers?.[plantName];
    if (!tracker) return true;
    const daysSince = Math.floor(
      (new Date() - new Date(tracker.lastFertilized)) / (1000 * 60 * 60 * 24)
    );
    return daysSince >= 14;
  }).slice(0, 3);
};

  const tip = getSeasonalFertilizerTip();
  const weatherWarning = getWeatherWarning();
  const plantsDue = getPlantsDueForFertilizer();

return (
    <View>
      <Text style={[styles.fertilizerTitle, { color: theme.text }]}>
        {tip.season} Feeding Guide
      </Text>
      <Text style={[styles.fertilizerSubtext, { color: theme.secondaryText }]}>
        {tip.reason}
      </Text>

      <View style={styles.fertilizerGrid}>
        <View style={styles.fertilizerTile}>
          <Text style={styles.fertilizerTileIcon}>🧪</Text>
          <Text style={styles.fertilizerTileLabel}>Fertilizer Type</Text>
          <Text style={styles.fertilizerTileValue}>{tip.type}</Text>
        </View>
        <View style={styles.fertilizerTile}>
          <Text style={styles.fertilizerTileIcon}>⏰</Text>
          <Text style={styles.fertilizerTileLabel}>Best Time</Text>
          <Text style={styles.fertilizerTileValue}>{tip.bestTime}</Text>
        </View>
        <View style={styles.fertilizerTile}>
          <Text style={styles.fertilizerTileIcon}>📅</Text>
          <Text style={styles.fertilizerTileLabel}>Frequency</Text>
          <Text style={styles.fertilizerTileValue}>{tip.frequency}</Text>
        </View>
        <View style={styles.fertilizerTile}>
          <Text style={styles.fertilizerTileIcon}>🛒</Text>
          <Text style={styles.fertilizerTileLabel}>What to Buy</Text>
          <Text style={styles.fertilizerTileValue}>{tip.product}</Text>
        </View>
      </View>

      {weatherWarning ? (
        <View style={[styles.fertilizerWeatherBox, {
          backgroundColor: weatherWarning.icon === "✅" ? "rgba(92,255,137,0.10)" : "rgba(255,216,107,0.10)",
          borderColor: weatherWarning.icon === "✅" ? "rgba(92,255,137,0.30)" : "rgba(255,216,107,0.30)",
        }]}>
          <Text style={styles.fertilizerWeatherIcon}>{weatherWarning.icon}</Text>
          <Text style={[styles.fertilizerWeatherText, { color: theme.secondaryText }]}>{weatherWarning.text}</Text>
        </View>
      ) : null}

      <View style={styles.fertilizerTipBox}>
        <Text style={styles.fertilizerTipTitle}>💡 Pro Tip</Text>
        <Text style={[styles.fertilizerTipText, { color: theme.secondaryText }]}>{tip.tip}</Text>
      </View>

      {plantsDue.length > 0 ? (
        <View style={styles.fertilizerDueBox}>
          <Text style={styles.fertilizerDueTitle}>🪴 Plants due for feeding</Text>
          <View style={styles.fertilizerDueRow}>
            {plantsDue.map((plantName) => {
  const plant = produceData.find((item) => item.name === plantName);
  return (
    <Pressable
      key={plantName}
      onPress={() => plant && onOpenPlant(plant)}
      style={styles.fertilizerDuePill}
    >
      <Text style={styles.fertilizerDuePillText}>{plantName} →</Text>
    </Pressable>
  );
})}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function ThrivingNearYouCard({ theme, zone, onOpenPlant }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!zone) { setLoading(false); return; }
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("top_plants_for_zone", { p_zone: String(zone) });
        if (!cancelled) {
          if (error) { console.log("thriving load error:", error); setRows([]); }
          else setRows(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [zone]);

 return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Popular in Zone {zone || "—"}</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        What gardeners in your growing zone are saving and harvesting most. Updated as your community grows.
      </Text>

      {loading ? (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "800" }}>Loading your zone…</Text>
        </View>
      ) : rows.length === 0 ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(142,255,171,0.08)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(142,255,171,0.20)" }}>
          <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "800", lineHeight: 21 }}>
            Not enough gardeners in Zone {zone || "your area"} yet. As more people grow here, you'll see the most popular plants light up. 🌱
          </Text>
        </View>
      ) : (
        <View style={{ gap: 10, marginTop: 16 }}>
          {rows.map((r, i) => {
            const plant = produceData.find((p) => p.name === r.plant_name);
            const img = plant ? resolvePlantImageSource(plant) : null;
            return (
              <Pressable
                key={r.plant_name}
                onPress={() => plant && onOpenPlant(plant)}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(142,255,171,0.16)" }}
              >
                <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900", width: 26 }}>#{i + 1}</Text>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{r.plant_name}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                    🌱 {r.saves} saved{r.harvests > 0 ? ` · 🎉 ${r.harvests} harvested` : ""} · {r.gardeners} gardener{r.gardeners === 1 ? "" : "s"}
                  </Text>
                </View>
                {plant ? <Text style={{ color: "#8effab", fontSize: 20, fontWeight: "900" }}>›</Text> : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
function ForecastCard({ theme, weather, zone, savedPlants, wateredPlants }) {
  const forecast = weather?.forecast || [];
  const today = getTodayKey();
  const climate = getClimateBucket(zone);

  if (!forecast.length) return null;

  const weeklyHigh = Math.max(...forecast.map(d => d.maxTempF));
  const weeklyLow = Math.min(...forecast.map(d => d.minTempF));
  const rainyDays = forecast.filter(d => d.precipChance >= 50).length;
  const avgRain = Math.round(forecast.reduce((sum, d) => sum + d.precipChance, 0) / forecast.length);

  const formatDayLabel = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    const todayDate = new Date();
    todayDate.setHours(12, 0, 0, 0);
    const diff = Math.round((date - todayDate) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Tmrw";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getGardenAdvice = (day) => {
    if (day.minTempF <= 35) return { text: "Cover plants", color: "#6bc7ff" };
    if (day.maxTempF >= 98) return { text: "Skip planting", color: "#ff7b7b" };
    if (day.maxTempF >= 90) return { text: "Water early", color: "#ffd86b" };
    if (day.precipChance >= 70) return { text: "Skip watering", color: "#6bc7ff" };
    if (day.precipChance >= 40) return { text: "Check soil", color: "#8effab" };
    if (day.maxTempF >= 65 && day.maxTempF <= 85 && day.precipChance < 30) return { text: "Great day! 🌟", color: "#5cff89" };
    return { text: "Normal care", color: "#d7ebdc" };
  };

  const getTempColor = (temp) => {
    if (temp >= 98) return "#ff4444";
    if (temp >= 90) return "#ff7b7b";
    if (temp >= 80) return "#ffd86b";
    if (temp >= 65) return "#5cff89";
    if (temp >= 50) return "#8effab";
    if (temp >= 35) return "#6bc7ff";
    return "#b3d9ff";
  };

  const getRainColor = (chance) => {
    if (chance >= 70) return "#6bc7ff";
    if (chance >= 40) return "#8effab";
    return "#d7ebdc";
  };

  const getWeekSummary = () => {
    const frostDays = forecast.filter(d => d.minTempF <= 35).length;
    const heatDays = forecast.filter(d => d.maxTempF >= 95).length;
    if (frostDays > 0) return { icon: "❄️", text: `${frostDays} frost risk night${frostDays === 1 ? "" : "s"} this week — keep covers ready.`, color: "#6bc7ff" };
    if (heatDays >= 3) return { icon: "🔥", text: `${heatDays} days above 95°F — water deeply every morning and mulch heavily.`, color: "#ff7b7b" };
    if (rainyDays >= 4) return { icon: "🌧️", text: `${rainyDays} rainy days ahead — hold off on fertilizing and check container drainage.`, color: "#6bc7ff" };
    if (weeklyHigh <= 75 && weeklyLow >= 45) return { icon: "✅", text: "Perfect growing week ahead — mild temps and low rain chance all week.", color: "#5cff89" };
    if (climate === "hot") return { icon: "☀️", text: `Hot zone week — high of ${Math.round(weeklyHigh)}°F. Water before 9 AM daily and harvest often.`, color: "#ffd86b" };
    return { icon: "🌱", text: `Good garden week — high of ${Math.round(weeklyHigh)}°F with ${rainyDays} rainy day${rainyDays === 1 ? "" : "s"}. Stay consistent with watering.`, color: "#8effab" };
  };

  const weekSummary = getWeekSummary();

  const bestDay = forecast.reduce((best, day) => {
    const score =
      (day.maxTempF >= 65 && day.maxTempF <= 85 ? 3 : 0) +
      (day.precipChance < 30 ? 2 : day.precipChance < 50 ? 1 : 0) +
      (day.minTempF >= 45 ? 1 : 0);
    return score > (best.score || 0) ? { ...day, score } : best;
  }, { score: -1 });

  return (
    <View>

      {/* HEADER */}
      <Text style={[styles.forecastTitle, { color: theme.text }]}>Garden Weather This Week</Text>
      <Text style={[styles.forecastSubtitle, { color: theme.secondaryText }]}>
        Zone {zone || "—"} • Tap each day for garden advice
      </Text>

      {/* WEEKLY SUMMARY STATS */}
      <View style={styles.forecastWeeklyStats}>
        <View style={styles.forecastWeeklyStat}>
          <Text style={[styles.forecastWeeklyStatValue, { color: getTempColor(weeklyHigh) }]}>
            {Math.round(weeklyHigh)}°
          </Text>
          <Text style={[styles.forecastWeeklyStatLabel, { color: theme.secondaryText }]}>Week High</Text>
        </View>
        <View style={styles.forecastWeeklyDivider} />
        <View style={styles.forecastWeeklyStat}>
          <Text style={[styles.forecastWeeklyStatValue, { color: getTempColor(weeklyLow) }]}>
            {Math.round(weeklyLow)}°
          </Text>
          <Text style={[styles.forecastWeeklyStatLabel, { color: theme.secondaryText }]}>Week Low</Text>
        </View>
        <View style={styles.forecastWeeklyDivider} />
        <View style={styles.forecastWeeklyStat}>
          <Text style={[styles.forecastWeeklyStatValue, { color: getRainColor(avgRain) }]}>
            {rainyDays}
          </Text>
          <Text style={[styles.forecastWeeklyStatLabel, { color: theme.secondaryText }]}>Rainy Days</Text>
        </View>
        <View style={styles.forecastWeeklyDivider} />
        <View style={styles.forecastWeeklyStat}>
          <Text style={[styles.forecastWeeklyStatValue, { color: "#5cff89" }]}>
            {formatDayLabel(bestDay.date)}
          </Text>
          <Text style={[styles.forecastWeeklyStatLabel, { color: theme.secondaryText }]}>Best Day</Text>
        </View>
      </View>

      {/* WEEK SUMMARY BANNER */}
      <View style={[styles.forecastSummaryBanner, {
        backgroundColor: `${weekSummary.color}15`,
        borderColor: `${weekSummary.color}40`,
      }]}>
        <Text style={styles.forecastSummaryIcon}>{weekSummary.icon}</Text>
        <Text style={[styles.forecastSummaryText, { color: weekSummary.color }]}>
          {weekSummary.text}
        </Text>
      </View>

      {/* DAILY FORECAST SCROLL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastScroll}
      >
        {forecast.map((day) => {
          const advice = getGardenAdvice(day);
          const isToday = day.date === today;
          const isBestDay = day.date === bestDay.date;
          const tempColor = getTempColor(day.maxTempF);
          const rainColor = getRainColor(day.precipChance);

          return (
            <View
              key={day.date}
              style={[
                styles.forecastDayCardV2,
                {
                  backgroundColor: isToday
                    ? "rgba(92,255,137,0.14)"
                    : isBestDay
                    ? "rgba(92,255,137,0.08)"
                    : "rgba(255,255,255,0.06)",
                  borderColor: isToday
                    ? "#5cff89"
                    : isBestDay
                    ? "rgba(92,255,137,0.35)"
                    : "rgba(255,255,255,0.08)",
                  borderWidth: isToday ? 2 : 1,
                },
              ]}
            >
              {/* DAY LABEL */}
              <Text style={[styles.forecastDayLabelV2, { color: isToday ? "#5cff89" : theme.secondaryText }]}>
                {formatDayLabel(day.date)}
              </Text>

              {/* BEST DAY BADGE */}
              {isBestDay && !isToday ? (
                <View style={styles.forecastBestBadge}>
                  <Text style={styles.forecastBestBadgeText}>Best</Text>
                </View>
              ) : null}

              {/* WEATHER ICON */}
              <Text style={styles.forecastIconV2}>
                {getWeatherIconFromDay(day)}
              </Text>

              {/* HIGH TEMP */}
              <Text style={[styles.forecastTempHigh, { color: tempColor }]}>
                {Math.round(day.maxTempF)}°
              </Text>

              {/* LOW TEMP */}
              <Text style={[styles.forecastTempLow, { color: theme.secondaryText }]}>
                {Math.round(day.minTempF)}°
              </Text>

              {/* RAIN CHANCE */}
              <View style={styles.forecastRainRow}>
                <Text style={styles.forecastRainIcon}>💧</Text>
                <Text style={[styles.forecastRainV2, { color: rainColor }]}>
                  {Math.round(day.precipChance)}%
                </Text>
              </View>

              {/* GARDEN ADVICE */}
              <View style={[styles.forecastAdvicePill, { backgroundColor: `${advice.color}20` }]}>
                <Text style={[styles.forecastAdviceText, { color: advice.color }]} numberOfLines={1}>
                  {advice.text}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* GARDEN ACTION FOOTER */}
      <View style={styles.forecastFooter}>
        <Text style={[styles.forecastFooterText, { color: theme.secondaryText }]}>
          🌱 Best planting day this week: <Text style={{ color: "#5cff89", fontWeight: "900" }}>{formatDayLabel(bestDay.date)}</Text>
          {bestDay.maxTempF ? ` • ${Math.round(bestDay.maxTempF)}° • ${Math.round(bestDay.precipChance)}% rain` : ""}
        </Text>
      </View>

    </View>
  );
}
function DailyBonusCard({
  theme,
  dailyBonusClaimed,
  dailyBonusDate,
  onClaim,
  streakData,
}) {
const claimedRecently =
    dailyBonusDate &&
    (Date.now() - new Date(dailyBonusDate).getTime()) < 24 * 60 * 60 * 1000;

  if (claimedRecently) return null;

  const claimedToday = claimedRecently;

  return (
    <View
      style={[
        styles.dailyBonusCard,
        {
          backgroundColor: theme.card,
          borderColor: claimedToday
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
        </Text>

        <Text
          style={[
            styles.dailyBonusText,
            { color: theme.secondaryText },
          ]}
        >
          {claimedToday
  ? "Today's bonus has already been claimed. Come back tomorrow!"
  : streakData?.count > 0 && streakData.count % 7 === 0
  ? "🔥 7-Day Streak! Claim your 100 XP bonus today!"
  : "Open Pocket Planter daily and claim +25 XP."}
        </Text>
      </View>

      <Pressable
        disabled={claimedToday}
        onPress={onClaim}
        style={[
          styles.dailyBonusButton,
          claimedToday &&
            styles.dailyBonusButtonClaimed,
        ]}
      >
        <Text style={styles.dailyBonusButtonText}>
          {claimedToday
  ? "✅ Claimed Today"
  : streakData?.count > 0 && streakData.count % 7 === 0
  ? "🔥 +100 XP"
  : "+25 XP"}
        </Text>
      </Pressable>
    </View>
  );
}
function GardenIntelligenceCard({ theme, weather, zone, savedPlants, wateredPlants, gardenMap, harvestTrackers }) {
  const forecast = weather?.forecast || [];
  const today = getTodayKey();
  const currentMonth = new Date().getMonth() + 1;
  const climate = getClimateBucket(zone);

  if (!forecast.length) return null;

  const formatDay = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    const todayDate = new Date();
    todayDate.setHours(12, 0, 0, 0);
    const diff = Math.round((date - todayDate) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const bestPlantingDay = forecast.find(
    (day) => day.maxTempF >= 65 && day.maxTempF <= 90 && day.minTempF >= 42 && day.precipChance < 55
  ) || forecast[0];

  const bestWateringDay = forecast.find(
    (day) => day.maxTempF >= 75 && day.maxTempF < 95 && day.precipChance < 40
  ) || forecast.reduce((a, b) => a.maxTempF > b.maxTempF ? a : b);

  const heavyRainDay = forecast.find((day) => day.precipChance >= 70);
  const frostRiskDay = forecast.find((day) => day.minTempF <= 35);
  const heatRiskDay = forecast.find((day) => day.maxTempF >= 95);

  const bestHarvestDay = forecast.find(
    (day) => day.precipChance < 30 && day.maxTempF < 95 && day.maxTempF > 50
  ) || forecast[0];

  const bestFertilizerDay = forecast.find(
    (day) => day.precipChance < 50 && day.maxTempF < 90 && day.minTempF > 40
  ) || forecast[0];

  // Smart watering skip — if rain covers it
  const wateringSkippable = weather?.precipChance >= 65;

  // Plants needing water today
  const unwateredCount = savedPlants.filter(p => wateredPlants?.[p] !== today).length;

  // Harvests ready
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).length;

  // Garden plots filled
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;

  // Weekly outlook summary
  const weeklyHigh = Math.max(...forecast.map(d => d.maxTempF));
  const weeklyLow = Math.min(...forecast.map(d => d.minTempF));
  const rainyDays = forecast.filter(d => d.precipChance >= 50).length;

  const getSeasonalInsight = () => {
    if (frostRiskDay) return { icon: "❄️", text: `Frost risk on ${formatDay(frostRiskDay.date)} — cover tender plants the night before.`, color: "#6bc7ff" };
    if (heatRiskDay) return { icon: "🔥", text: `Heat stress risk on ${formatDay(heatRiskDay.date)} — water early and add mulch to protect roots.`, color: "#ff7b7b" };
    if (rainyDays >= 4) return { icon: "🌧️", text: `${rainyDays} rainy days this week — check drainage and hold off on fertilizing until soil dries.`, color: "#6bc7ff" };
    if (climate === "hot" && currentMonth >= 5 && currentMonth <= 9) return { icon: "☀️", text: "Hot zone summer — water deeply every 2-3 days and harvest regularly to keep plants producing.", color: "#ffd86b" };
    if (climate === "cold" && currentMonth >= 9) return { icon: "🍂", text: "Cold zone fall — harvest everything before first frost and plant garlic for spring.", color: "#ff9f43" };
    return { icon: "🌱", text: `Good growing week ahead — ${weeklyHigh > 85 ? "stay on top of watering" : "ideal conditions for planting and garden care"}.`, color: "#5cff89" };
  };

  const seasonalInsight = getSeasonalInsight();

  const intelligenceItems = [
    {
      label: "Best planting day",
      value: formatDay(bestPlantingDay.date),
      sub: `${Math.round(bestPlantingDay.maxTempF)}° • ${Math.round(bestPlantingDay.precipChance)}% rain`,
      icon: "🌱",
      color: "#5cff89",
    },
    {
      label: wateringSkippable ? "Skip watering — rain coming" : "Best watering day",
      value: wateringSkippable ? "Rain covers it" : formatDay(bestWateringDay.date),
      sub: wateringSkippable ? `${Math.round(weather.precipChance)}% chance today` : `${Math.round(bestWateringDay.maxTempF)}° • ${Math.round(bestWateringDay.precipChance)}% rain`,
      icon: "💧",
      color: wateringSkippable ? "#6bc7ff" : "#8effab",
    },
    {
      label: "Best harvest day",
      value: formatDay(bestHarvestDay.date),
      sub: `${Math.round(bestHarvestDay.maxTempF)}° • dry conditions`,
      icon: "🚜",
      color: "#ffd86b",
    },
    {
      label: "Best fertilizer day",
      value: formatDay(bestFertilizerDay.date),
      sub: `${Math.round(bestFertilizerDay.maxTempF)}° • ${Math.round(bestFertilizerDay.precipChance)}% rain`,
      icon: "🌿",
      color: "#8effab",
    },
    {
      label: "Heavy rain expected",
      value: heavyRainDay ? formatDay(heavyRainDay.date) : "None this week",
      sub: heavyRainDay ? `${Math.round(heavyRainDay.precipChance)}% chance` : "Good drainage week",
      icon: "🌧️",
      color: heavyRainDay ? "#6bc7ff" : "#d7ebdc",
    },
    {
      label: "Frost risk",
      value: frostRiskDay ? formatDay(frostRiskDay.date) : "None this week",
      sub: frostRiskDay ? `Low of ${Math.round(frostRiskDay.minTempF)}°F` : "Overnight temps safe",
      icon: "❄️",
      color: frostRiskDay ? "#6bc7ff" : "#d7ebdc",
    },
    {
      label: "Heat stress risk",
      value: heatRiskDay ? formatDay(heatRiskDay.date) : "None this week",
      sub: heatRiskDay ? `High of ${Math.round(heatRiskDay.maxTempF)}°F` : "Temps within range",
      icon: "🔥",
      color: heatRiskDay ? "#ff7b7b" : "#d7ebdc",
    },
  ];

  return (
    <View>

      {/* HEADER */}
      <Text style={[styles.gardenIntelligenceTitle, { color: theme.text }]}>Smart Week Ahead</Text>
      <Text style={[styles.gardenIntelligenceSub, { color: theme.secondaryText }]}>
        Zone {zone || "—"} • {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
      </Text>

      {/* WEEKLY SNAPSHOT */}
      <View style={styles.gardenIntelWeeklyRow}>
        <View style={styles.gardenIntelWeeklyStat}>
          <Text style={styles.gardenIntelWeeklyIcon}>🌡️</Text>
          <Text style={styles.gardenIntelWeeklyValue}>{Math.round(weeklyHigh)}°</Text>
          <Text style={[styles.gardenIntelWeeklyLabel, { color: theme.secondaryText }]}>Week High</Text>
        </View>
        <View style={styles.gardenIntelWeeklyStat}>
          <Text style={styles.gardenIntelWeeklyIcon}>🌙</Text>
          <Text style={styles.gardenIntelWeeklyValue}>{Math.round(weeklyLow)}°</Text>
          <Text style={[styles.gardenIntelWeeklyLabel, { color: theme.secondaryText }]}>Week Low</Text>
        </View>
        <View style={styles.gardenIntelWeeklyStat}>
          <Text style={styles.gardenIntelWeeklyIcon}>🌧️</Text>
          <Text style={styles.gardenIntelWeeklyValue}>{rainyDays}</Text>
          <Text style={[styles.gardenIntelWeeklyLabel, { color: theme.secondaryText }]}>Rainy Days</Text>
        </View>
        <View style={styles.gardenIntelWeeklyStat}>
          <Text style={styles.gardenIntelWeeklyIcon}>💧</Text>
          <Text style={[styles.gardenIntelWeeklyValue, { color: unwateredCount > 0 ? "#6bc7ff" : "#5cff89" }]}>{unwateredCount}</Text>
          <Text style={[styles.gardenIntelWeeklyLabel, { color: theme.secondaryText }]}>Need Water</Text>
        </View>
      </View>

      {/* SEASONAL INSIGHT BANNER */}
      <View style={[styles.gardenIntelInsightBanner, {
        backgroundColor: `${seasonalInsight.color}15`,
        borderColor: `${seasonalInsight.color}40`,
      }]}>
        <Text style={styles.gardenIntelInsightIcon}>{seasonalInsight.icon}</Text>
        <Text style={[styles.gardenIntelInsightText, { color: seasonalInsight.color }]}>
          {seasonalInsight.text}
        </Text>
      </View>

      {/* HARVEST ALERT */}
      {harvestsReady > 0 ? (
        <View style={[styles.gardenIntelInsightBanner, { backgroundColor: "rgba(255,216,107,0.12)", borderColor: "rgba(255,216,107,0.35)" }]}>
          <Text style={styles.gardenIntelInsightIcon}>🎉</Text>
          <Text style={[styles.gardenIntelInsightText, { color: "#ffd86b" }]}>
            {harvestsReady} plant{harvestsReady === 1 ? "" : "s"} ready to harvest — check your garden today!
          </Text>
        </View>
      ) : null}

      {/* INTELLIGENCE GRID */}
      <View style={styles.gardenIntelligenceGrid}>
        {intelligenceItems.map((item) => (
          <View key={item.label} style={[styles.gardenIntelligenceTileV2, {
            borderColor: item.color !== "#d7ebdc" ? `${item.color}30` : "rgba(255,255,255,0.08)",
            backgroundColor: item.color !== "#d7ebdc" ? `${item.color}0D` : "rgba(255,255,255,0.05)",
          }]}>
            <View style={styles.gardenIntelTileHeader}>
              <Text style={styles.gardenIntelTileIcon}>{item.icon}</Text>
              <Text style={[styles.gardenIntelTileValue, { color: item.color !== "#d7ebdc" ? item.color : "#ffffff" }]}>
                {item.value}
              </Text>
            </View>
            <Text style={styles.gardenIntelligenceLabel}>{item.label}</Text>
            <Text style={[styles.gardenIntelTileSub, { color: theme.secondaryText }]}>{item.sub}</Text>
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
function MyGardenTodayCard({ theme, weather, monthlySuggestions, savedPlants, wateredPlants, onOpenPlant, onAddPhoto, uploadingPhoto, harvestTrackers, fertilizerTrackers, journalEntries, zone, gardenMap, onNavigate }) {
  const today = getTodayKey();
  const currentHour = new Date().getHours();
  const currentMonth = new Date().getMonth() + 1;

  const wateredToday = savedPlants.filter(p => wateredPlants?.[p] === today);
  const unwateredPlants = savedPlants.filter(p => wateredPlants?.[p] !== today);
  const needsWaterCount = unwateredPlants.length;
  const allWatered = needsWaterCount === 0 && savedPlants.length > 0;

  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).map(([name]) => name);

  const fertDuePlants = savedPlants.filter(p => {
    const t = fertilizerTrackers?.[p];
    if (!t) return false;
    return Math.floor((new Date() - new Date(t.lastFertilized)) / (1000 * 60 * 60 * 24)) >= 14;
  });

  const todayPhotos = journalEntries.filter(e => e.createdAt?.startsWith(today)).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;

  const getTimeOfDayGreeting = () => {
    if (currentHour < 12) return { greeting: "Hey There! 🌅", tip: "Morning is the best time to water — cooler temps reduce evaporation." };
    if (currentHour < 17) return { greeting: "Good afternoon! ☀️", tip: "Midday heat is high. Check on any plants in direct sun and make sure soil stays moist." };
    return { greeting: "Good evening! 🌙", tip: "Evening is a great time to check tonight's forecast and cover any frost-sensitive plants." };
  };

  const getWeatherSummary = () => {
    if (!weather) return { icon: "🌤️", title: "Weather loading", text: "Your forecast will appear shortly.", color: "#d7ebdc", urgent: false };
    if (weather.minTempF <= 35) return { icon: "❄️", title: "Frost risk tonight", text: `Low of ${Math.round(weather.minTempF)}°F — cover tender plants and move containers to shelter before dark.`, color: "#6bc7ff", urgent: true };
    if (weather.maxTempF >= 98) return { icon: "🔥", title: "Extreme heat today", text: `High of ${Math.round(weather.maxTempF)}°F — water before 9 AM, add shade cloth, and skip transplanting.`, color: "#ff7b7b", urgent: true };
    if (weather.maxTempF >= 90) return { icon: "☀️", title: "Hot day ahead", text: `High of ${Math.round(weather.maxTempF)}°F — water deeply early and mulch around roots to hold moisture.`, color: "#ffd86b", urgent: false };
    if (weather.precipChance >= 70) return { icon: "🌧️", title: "Rain likely today", text: `${Math.round(weather.precipChance)}% chance of rain — skip watering and check drainage on containers.`, color: "#6bc7ff", urgent: false };
    if (weather.precipChance >= 40) return { icon: "🌦️", title: "Possible showers", text: `${Math.round(weather.precipChance)}% rain chance — check soil before watering, may not be needed.`, color: "#8effab", urgent: false };
    return { icon: "✅", title: "Great garden day", text: `${Math.round(weather.maxTempF)}° high, ${Math.round(weather.precipChance)}% rain — ideal conditions for planting, watering, and garden care.`, color: "#5cff89", urgent: false };
  };

  const getSeasonalTip = () => {
    const climate = getClimateBucket(zone);
    if (currentMonth >= 3 && currentMonth <= 5) {
      if (climate === "hot") return "🌱 Hot zone spring: get plants in the ground now before summer heat peaks. Prioritize tomatoes, peppers, and basil.";
      return "🌱 Spring is prime planting season. Focus on getting seeds started and transplants in the ground while temps are mild.";
    }
    if (currentMonth >= 6 && currentMonth <= 8) {
      if (climate === "hot") return "🔥 Summer in hot zones: deep watering every 2-3 days keeps roots cool. Harvest zucchini and beans daily.";
      return "☀️ Summer peak: water consistently, harvest regularly, and watch for heat stress on leafy greens.";
    }
    if (currentMonth >= 9 && currentMonth <= 11) {
      if (climate === "cold") return "🍂 Fall in cold zones: harvest everything before first frost and plant garlic for next spring.";
      return "🍂 Fall growing season: great time for cool crops like kale, spinach, lettuce, and root vegetables.";
    }
    return "❄️ Winter prep: add compost to beds, protect perennials, and start planning your spring garden layout.";
  };

  const { greeting, tip } = getTimeOfDayGreeting();
  const weatherSummary = getWeatherSummary();
  const seasonalTip = getSeasonalTip();

  const completedCount = [
    allWatered && savedPlants.length > 0,
    harvestsReady.length === 0,
    fertDuePlants.length === 0,
    todayPhotos > 0,
  ].filter(Boolean).length;

const totalTasks = 4;
  const progressPercent = savedPlants.length === 0 ? 0 : (completedCount / totalTasks) * 100;

  const hasRealIssue =
    (!allWatered && savedPlants.length > 0) ||
    harvestsReady.length > 0 ||
    fertDuePlants.length > 0;
if (!hasRealIssue) return null;

return (
    <View style={[styles.myGardenTodayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.myGardenTodayEyebrow}>📋 TODAY'S GARDEN PLAN</Text>

      {/* HEADER */}
      <Text style={[styles.myGardenTodayTitle, { color: theme.text }]}>{greeting}</Text>
      <Text style={[styles.myGardenTodaySubtext, { color: theme.secondaryText }]}>
        {tip}
      </Text>

      {/* PROGRESS BAR */}
      {savedPlants.length > 0 ? (
        <View style={styles.myGardenProgressWrap}>
          <View style={styles.myGardenProgressHeader}>
            <Text style={styles.myGardenProgressLabel}>Daily garden tasks</Text>
            <Text style={styles.myGardenProgressCount}>{completedCount}/{totalTasks} done</Text>
          </View>
          <View style={styles.myGardenProgressTrack}>
            <View style={[styles.myGardenProgressFill, {
              width: `${progressPercent}%`,
              backgroundColor: progressPercent === 100 ? "#5cff89" : progressPercent >= 50 ? "#ffd86b" : "#6bc7ff",
            }]} />
          </View>
          {progressPercent === 100 ? (
            <Text style={styles.myGardenProgressComplete}>🌟 All tasks complete — your garden is thriving!</Text>
          ) : null}
        </View>
      ) : null}

      {/* WEATHER CARD */}
      <View style={[styles.myGardenWeatherCard, {
        backgroundColor: weatherSummary.urgent ? `${weatherSummary.color}18` : "rgba(255,255,255,0.06)",
        borderColor: weatherSummary.urgent ? `${weatherSummary.color}55` : "rgba(255,255,255,0.10)",
      }]}>
        <Text style={styles.myGardenWeatherIcon}>{weatherSummary.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.myGardenWeatherTitle, { color: weatherSummary.urgent ? weatherSummary.color : theme.text }]}>
            {weatherSummary.title}
          </Text>
          <Text style={[styles.myGardenWeatherText, { color: theme.secondaryText }]}>{weatherSummary.text}</Text>
        </View>
        {weather ? (
          <View style={styles.myGardenWeatherTemps}>
            <Text style={styles.myGardenWeatherHigh}>{Math.round(weather.maxTempF)}°</Text>
            <Text style={styles.myGardenWeatherLow}>{Math.round(weather.minTempF)}°</Text>
          </View>
        ) : null}
      </View>

      {/* TASK LIST */}
      <View style={styles.myGardenTaskList}>

        {/* WATERING TASK */}
        {savedPlants.length > 0 ? (
          <Pressable
            onPress={() => !allWatered ? onNavigate("plants") : null}
            style={[styles.myGardenTaskRowV2, {
              backgroundColor: allWatered ? "rgba(92,255,137,0.10)" : "rgba(107,199,255,0.08)",
              borderColor: allWatered ? "rgba(92,255,137,0.28)" : "rgba(107,199,255,0.28)",
            }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: allWatered ? "rgba(92,255,137,0.20)" : "rgba(107,199,255,0.18)" }]}>
              <Text style={styles.myGardenTaskIcon}>{allWatered ? "✅" : "💧"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: allWatered ? "#5cff89" : "#6bc7ff" }]}>
                {allWatered ? "All plants watered!" : `${needsWaterCount} plant${needsWaterCount === 1 ? "" : "s"} need water`}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {allWatered
                  ? `${wateredToday.length} of ${savedPlants.length} plants watered today`
                  : weather?.precipChance >= 65
                  ? "Rain may help — check soil before watering"
                  : `${wateredToday.length}/${savedPlants.length} done — tap to go to Plants tab`}
              </Text>
              {!allWatered && unwateredPlants.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myGardenPlantPillRow}>
                  {unwateredPlants.slice(0, 4).map(p => {
                    const plant = produceData.find(item => item.name === p);
                    return (
                      <Pressable key={p} onPress={() => plant && onOpenPlant(plant)} style={styles.myGardenPlantPill}>
                        <Text style={styles.myGardenPlantPillText}>{p} →</Text>
                      </Pressable>
                    );
                  })}
                  {unwateredPlants.length > 4 ? (
                    <View style={styles.myGardenPlantPill}>
                      <Text style={styles.myGardenPlantPillText}>+{unwateredPlants.length - 4} more</Text>
                    </View>
                  ) : null}
                </ScrollView>
              ) : null}
              {!allWatered ? (
                <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", marginTop: 8 }}>
                  Tap to go to Plants tab →
                </Text>
              ) : null}
            </View>
            {allWatered ? <Text style={styles.myGardenTaskCheck}>✓</Text> : null}
          </Pressable>
        ) : null}

        {/* HARVEST TASK */}
        {harvestsReady.length > 0 ? (
          <Pressable
            onPress={() => onNavigate("garden")}
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(255,216,107,0.10)", borderColor: "rgba(255,216,107,0.30)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(255,216,107,0.20)" }]}>
              <Text style={styles.myGardenTaskIcon}>🎉</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#ffd86b" }]}>
                {harvestsReady.length} plant{harvestsReady.length === 1 ? "" : "s"} ready to harvest!
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                Harvest now for peak flavor and to keep plants producing
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myGardenPlantPillRow}>
                {harvestsReady.map(p => {
                  const plant = produceData.find(item => item.name === p);
                  return (
                    <Pressable key={p} onPress={() => plant && onOpenPlant(plant)} style={[styles.myGardenPlantPill, { backgroundColor: "rgba(255,216,107,0.18)", borderColor: "rgba(255,216,107,0.35)" }]}>
                      <Text style={[styles.myGardenPlantPillText, { color: "#ffd86b" }]}>{p} →</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", marginTop: 8 }}>
                Tap to go to Garden tab →
              </Text>
            </View>
          </Pressable>
        ) : null}

        {/* FERTILIZER TASK */}
        {fertDuePlants.length > 0 ? (
          <Pressable
            onPress={() => onNavigate("garden")}
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(142,255,171,0.08)", borderColor: "rgba(142,255,171,0.22)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(142,255,171,0.16)" }]}>
              <Text style={styles.myGardenTaskIcon}>🌿</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#8effab" }]}>
                {fertDuePlants.length} plant{fertDuePlants.length === 1 ? "" : "s"} due for fertilizer
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                It's been 14+ days since last feeding — time to fertilize
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myGardenPlantPillRow}>
                {fertDuePlants.slice(0, 3).map(p => {
                  const plant = produceData.find(item => item.name === p);
                  return (
                    <Pressable key={p} onPress={() => plant && onOpenPlant(plant)} style={[styles.myGardenPlantPill, { backgroundColor: "rgba(142,255,171,0.14)", borderColor: "rgba(142,255,171,0.28)" }]}>
                      <Text style={[styles.myGardenPlantPillText, { color: "#8effab" }]}>{p} →</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", marginTop: 8 }}>
                Tap to go to Garden tab →
              </Text>
            </View>
          </Pressable>
        ) : null}

        {/* JOURNAL PHOTO TASK */}
        <Pressable disabled={uploadingPhoto} onPress={onAddPhoto} style={[styles.myGardenTaskRowV2, {
          backgroundColor: todayPhotos > 0 ? "rgba(92,255,137,0.08)" : "rgba(255,255,255,0.05)",
          borderColor: todayPhotos > 0 ? "rgba(92,255,137,0.22)" : "rgba(255,255,255,0.10)",
        }]}>
          <View style={[styles.myGardenTaskIconWrap, { backgroundColor: todayPhotos > 0 ? "rgba(92,255,137,0.18)" : "rgba(255,255,255,0.08)" }]}>
            <Text style={styles.myGardenTaskIcon}>{todayPhotos > 0 ? "✅" : "📸"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.myGardenTaskTitle, { color: todayPhotos > 0 ? "#5cff89" : theme.text }]}>
              {uploadingPhoto ? "Uploading photo…" : todayPhotos > 0 ? `${todayPhotos} photo${todayPhotos === 1 ? "" : "s"} logged today!` : "Add a garden photo"}
            </Text>
            <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
              {todayPhotos > 0 ? "Your garden story is growing — great work!" : "Document your garden's progress with a photo"}
            </Text>
            {todayPhotos === 0 ? (
              <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900", marginTop: 8 }}>
                Tap to add a photo →
              </Text>
            ) : null}
          </View>
          <Text style={styles.myGardenTaskArrow}>›</Text>
        </Pressable>

        {/* SEASONAL TIP */}
        <View style={[styles.myGardenSeasonalTip, { borderColor: "rgba(255,216,107,0.22)" }]}>
          <Text style={styles.myGardenSeasonalTipTitle}>💡 Seasonal Tip</Text>
          <Text style={[styles.myGardenSeasonalTipText, { color: theme.secondaryText }]}>{seasonalTip}</Text>
        </View>

        {/* EMPTY STATE */}
        {savedPlants.length === 0 ? (
          <Pressable
            onPress={() => onNavigate("plants")}
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(92,255,137,0.10)" }]}>
              <Text style={styles.myGardenTaskIcon}>🌱</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: theme.text }]}>No plants saved yet</Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                Browse the Plants tab and save your first plant to start tracking your garden
              </Text>
              <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900", marginTop: 8 }}>
                Tap to go to Plants tab →
              </Text>
            </View>
          </Pressable>
        ) : null}

        {/* MONTHLY SUGGESTION */}
        {monthlySuggestions.length > 0 && savedPlants.length > 0 ? (
          <Pressable onPress={() => onOpenPlant(monthlySuggestions[0])} style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(92,255,137,0.08)", borderColor: "rgba(92,255,137,0.20)" }]}>
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(92,255,137,0.16)" }]}>
              {(() => {
                const img = resolvePlantImageSource(monthlySuggestions[0]);
                return img
                  ? <Image source={img} style={{ width: 28, height: 28 }} resizeMode="contain" />
                  : <Text style={styles.myGardenTaskIcon}>🌿</Text>;
              })()}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#5cff89" }]}>
                Plant this month: {monthlySuggestions[0].name}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                A strong pick for your zone right now — tap to see the care guide
              </Text>
            </View>
            <Text style={styles.myGardenTaskArrow}>›</Text>
          </Pressable>
        ) : null}

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
function PlantTodayHero({ theme, monthlySuggestions, compatiblePlants, savedPlants = [], zone, weather, onOpen }) {
  const weekOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24 * 7));

  const basePool = monthlySuggestions.length > 0 ? monthlySuggestions : compatiblePlants;
  const unsavedPool = basePool.filter((p) => !savedPlants.includes(p.name));
  const plantPool = unsavedPool.length > 0 ? unsavedPool : basePool;

  if (!plantPool.length) return null;

  const plant = plantPool[weekOfYear % plantPool.length];

  if (!plant) return null;

  const imageSource = resolvePlantImageSource(plant);
  const difficulty = getPlantDifficulty(plant);
  const harvest = getHarvestCountdown(plant);
  const type = normalizeType(plant.type, plant.name);

  const getWhyNow = () => {
    const seasonLabel = getPlantSeasonLabel(plant, zone);
    if (weather?.minTempF <= 35) return "Start it indoors now — frost is in the forecast, so it'll be ready to transplant once nights warm up.";
    if (weather?.maxTempF >= 95 && difficulty.label !== "Hard") return `It can handle the current heat — plant early morning and water deeply to get it established.`;
    if (seasonLabel === "Plant now") return `This is a prime planting window for ${type.toLowerCase()} in Zone ${zone || "your area"} right now.`;
    if (difficulty.label === "Easy") return `An easy, forgiving grower — a great low-effort pick to add to your garden this week.`;
    return `A strong seasonal match for Zone ${zone || "your area"} worth planning into your garden this week.`;
  };

  const getDayLabel = () => {
    return "This Week";
  };

return (
    <Pressable onPress={() => onOpen(plant)} style={styles.plantTodayHero}>
      <View style={styles.plantTodayGlow} />
    <View style={{ flex: 1 }}>
        <Text style={[styles.plantTodayTitle, { color: theme.text }]}>{plant.name}</Text>
        <Text style={[styles.plantTodayText, { color: theme.secondaryText }]}>
          {getWhyNow()}
        </Text>
        <View style={styles.plantTodayTagRow}>
          <View style={styles.plantTodayTag}>
            <Text style={styles.plantTodayTagText}>{difficulty.icon} {difficulty.label}</Text>
          </View>
          <View style={styles.plantTodayTag}>
            <Text style={styles.plantTodayTagText}>🚜 {harvest}</Text>
          </View>
          <View style={styles.plantTodayTag}>
            <Text style={styles.plantTodayTagText}>🌿 {type}</Text>
          </View>
        </View>
        <Text style={styles.plantTodayButtonText}>View care guide →</Text>
      </View>
      {imageSource ? (
        <View style={styles.plantTodayImageWrap}>
          <Image source={imageSource} style={styles.plantTodayImage} resizeMode="contain" />
        </View>
      ) : (
        <Text style={styles.plantTodayFallback}>🌿</Text>
      )}
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
function FrostBanner({ theme, weather, frostAlertsOn }) {
  const frost = getUpcomingFrost(weather);
  if (!frost) return null;
  const whenText =
    frost.daysOut === 0 ? "tonight"
    : frost.daysOut === 1 ? "tomorrow night"
    : `in ${frost.daysOut} days`;
  return (
    <View style={[styles.frostBanner, { borderColor: "#6bc7ff" }]}>
      <Text style={styles.frostBannerIcon}>❄️</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.frostBannerTitle}>Frost expected {whenText}</Text>
        <Text style={styles.frostBannerText}>
          Low of {Math.round(frost.minTempF)}°F coming — cover tender plants, move containers to shelter, and hold off on transplanting.
        </Text>
        {!frostAlertsOn ? (
          <Text style={styles.frostBannerHint}>
            Turn on Frost Alerts in the Garden tab to get a heads-up each cold evening.
          </Text>
        ) : null}
      </View>
    </View>
  );
}
function LiveWeatherCard({ theme, weather, recommendation, zone, savedPlants, wateredPlants, harvestTrackers }) {
  const today = getTodayKey();
  const climate = getClimateBucket(zone);
  const currentHour = new Date().getHours();
  const currentMonth = new Date().getMonth() + 1;

  const unwateredCount = savedPlants?.filter(p => wateredPlants?.[p] !== today).length || 0;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).length;

  const getConditionDetails = () => {
    if (!weather) return { icon: "🌤️", label: "Loading", color: "#8effab", urgency: null };
    if (weather.minTempF <= 35) return { icon: "❄️", label: "Frost Risk", color: "#6bc7ff", urgency: "high" };
    if (weather.maxTempF >= 98) return { icon: "🔥", label: "Extreme Heat", color: "#ff4444", urgency: "high" };
    if (weather.maxTempF >= 90) return { icon: "☀️", label: "Hot Day", color: "#ff7b7b", urgency: "medium" };
    if (weather.precipChance >= 70) return { icon: "🌧️", label: "Heavy Rain", color: "#6bc7ff", urgency: "medium" };
    if (weather.precipChance >= 40) return { icon: "🌦️", label: "Possible Rain", color: "#8effab", urgency: null };
    if (weather.maxTempF >= 65 && weather.maxTempF <= 85) return { icon: "✅", label: "Perfect Day", color: "#5cff89", urgency: null };
    return { icon: "🌤️", label: "Mild Conditions", color: "#8effab", urgency: null };
  };

  const getSmartActions = () => {
    const actions = [];
    if (!weather) return actions;

    if (weather.minTempF <= 35) {
      actions.push({ icon: "🏠", text: "Move containers indoors or near shelter tonight", priority: "high" });
      actions.push({ icon: "🧣", text: "Cover frost-sensitive plants before dark", priority: "high" });
    }
    if (weather.maxTempF >= 98) {
      actions.push({ icon: "⏰", text: "Water before 9 AM — afternoon heat will scorch wet leaves", priority: "high" });
      actions.push({ icon: "🌿", text: "Add shade cloth over young transplants", priority: "high" });
      actions.push({ icon: "🚫", text: "Skip transplanting today — heat stress risk too high", priority: "medium" });
    } else if (weather.maxTempF >= 90) {
      actions.push({ icon: "💧", text: "Water deeply early morning to protect roots", priority: "medium" });
      actions.push({ icon: "🪵", text: "Add mulch around plants to retain soil moisture", priority: "medium" });
    }
    if (weather.precipChance >= 70) {
      actions.push({ icon: "🌧️", text: "Skip watering — rain will handle it today", priority: "medium" });
      actions.push({ icon: "🪣", text: "Check container drainage before rain arrives", priority: "low" });
    } else if (weather.precipChance >= 40) {
      actions.push({ icon: "🌱", text: "Check soil moisture before watering — rain may help", priority: "low" });
    }
    if (unwateredCount > 0 && weather.precipChance < 40) {
      actions.push({ icon: "💧", text: `${unwateredCount} saved plant${unwateredCount === 1 ? "" : "s"} still need watering today`, priority: weather.maxTempF >= 90 ? "high" : "medium" });
    }
    if (harvestsReady > 0) {
      actions.push({ icon: "🎉", text: `${harvestsReady} plant${harvestsReady === 1 ? "" : "s"} ready to harvest — pick today for peak flavor`, priority: "high" });
    }
    if (weather.maxTempF >= 65 && weather.maxTempF <= 82 && weather.precipChance < 30) {
      actions.push({ icon: "🌱", text: "Ideal conditions for transplanting or direct sowing today", priority: "low" });
    }
    if (currentHour >= 6 && currentHour <= 9 && weather.maxTempF >= 70) {
      actions.push({ icon: "🌅", text: "Perfect morning window for garden care right now", priority: "low" });
    }
    return actions.slice(0, 4);
  };

  const getZoneInsight = () => {
    if (climate === "hot") {
      if (currentMonth >= 5 && currentMonth <= 9) return `Zone ${zone} summer: deep water every 2-3 days. Harvest peppers, okra, and beans daily during peak season.`;
      return `Zone ${zone} cool season: great time for leafy greens, carrots, and brassicas. Plant now before temperatures rise.`;
    }
    if (climate === "cold") {
      if (currentMonth >= 6 && currentMonth <= 8) return `Zone ${zone} summer: your prime growing window. Stay consistent with watering and harvest regularly.`;
      if (currentMonth >= 9) return `Zone ${zone} fall: harvest root crops and store them. Plant garlic now for a spring harvest.`;
      return `Zone ${zone} spring: soil is warming up. Start seeds indoors and wait for consistent temps above 50°F before transplanting.`;
    }
    return `Zone ${zone}: ${currentMonth >= 3 && currentMonth <= 5 ? "spring planting season — ideal time to get tomatoes, peppers, and herbs in the ground." : currentMonth >= 9 ? "fall growing season — great for cool crops and root vegetables." : "peak growing season — water consistently and harvest often."}`;
  };

  const condition = getConditionDetails();
  const smartActions = getSmartActions();
  const zoneInsight = getZoneInsight();

  const getTempColor = (temp) => {
    if (temp >= 98) return "#ff4444";
    if (temp >= 90) return "#ff7b7b";
    if (temp >= 80) return "#ffd86b";
    if (temp >= 65) return "#5cff89";
    if (temp >= 50) return "#8effab";
    return "#6bc7ff";
  };

  return (
    <View>

      {/* HEADER */}
      <View style={styles.liveWeatherHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.liveWeatherTitle, { color: condition.color }]}>
            {condition.icon} {condition.label}
          </Text>
          <Text style={[styles.liveWeatherBody, { color: theme.secondaryText }]}>
            {recommendation.body}
          </Text>
        </View>
        {condition.urgency === "high" ? (
          <View style={[styles.liveWeatherUrgentBadge, { backgroundColor: `${condition.color}25`, borderColor: condition.color }]}>
            <Text style={[styles.liveWeatherUrgentText, { color: condition.color }]}>⚠️ Alert</Text>
          </View>
        ) : null}
      </View>

      {/* MAIN WEATHER STATS */}
      <View style={styles.liveWeatherGrid}>
        <View style={[styles.liveWeatherBox, { borderColor: weather ? `${getTempColor(weather.maxTempF)}30` : "rgba(255,255,255,0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>☀️</Text>
          <Text style={styles.liveWeatherLabel}>High</Text>
          <Text style={[styles.liveWeatherValue, { color: weather ? getTempColor(weather.maxTempF) : "#ffffff" }]}>
            {weather ? `${Math.round(weather.maxTempF)}°` : "—"}
          </Text>
        </View>
        <View style={[styles.liveWeatherBox, { borderColor: weather ? `${getTempColor(weather.minTempF)}30` : "rgba(255,255,255,0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>🌙</Text>
          <Text style={styles.liveWeatherLabel}>Low</Text>
          <Text style={[styles.liveWeatherValue, { color: weather ? getTempColor(weather.minTempF) : "#ffffff" }]}>
            {weather ? `${Math.round(weather.minTempF)}°` : "—"}
          </Text>
        </View>
        <View style={[styles.liveWeatherBox, { borderColor: weather?.precipChance >= 70 ? "rgba(107,199,255,0.30)" : "rgba(255,255,255,0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>🌧️</Text>
          <Text style={styles.liveWeatherLabel}>Rain</Text>
          <Text style={[styles.liveWeatherValue, { color: weather?.precipChance >= 70 ? "#6bc7ff" : weather?.precipChance >= 40 ? "#8effab" : "#ffffff" }]}>
            {weather ? `${Math.round(weather.precipChance)}%` : "—"}
          </Text>
        </View>
        <View style={styles.liveWeatherBox}>
          <Text style={styles.liveWeatherIcon}>💧</Text>
          <Text style={styles.liveWeatherLabel}>Unwatered</Text>
          <Text style={[styles.liveWeatherValue, { color: unwateredCount > 0 ? "#6bc7ff" : "#5cff89" }]}>
            {unwateredCount}
          </Text>
        </View>
      </View>

      {/* SMART ACTION LIST */}
      {smartActions.length > 0 ? (
        <View style={styles.liveWeatherActionsWrap}>
          <Text style={styles.liveWeatherActionsTitle}>⚡ Smart Actions for Today</Text>
          <View style={styles.liveWeatherActionsList}>
            {smartActions.map((action, index) => (
              <View key={index} style={[styles.liveWeatherActionRow, {
                backgroundColor: action.priority === "high"
                  ? "rgba(255,123,123,0.10)"
                  : action.priority === "medium"
                  ? "rgba(255,216,107,0.08)"
                  : "rgba(255,255,255,0.05)",
                borderColor: action.priority === "high"
                  ? "rgba(255,123,123,0.25)"
                  : action.priority === "medium"
                  ? "rgba(255,216,107,0.20)"
                  : "rgba(255,255,255,0.08)",
              }]}>
                <Text style={styles.liveWeatherActionIcon}>{action.icon}</Text>
                <Text style={[styles.liveWeatherActionText, { color: action.priority === "high" ? "#ffb3b3" : theme.secondaryText }]}>
                  {action.text}
                </Text>
                {action.priority === "high" ? (
                  <View style={styles.liveWeatherActionPriority}>
                    <Text style={styles.liveWeatherActionPriorityText}>!</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* ZONE INSIGHT */}
      <View style={styles.liveWeatherZoneInsight}>
        <Text style={styles.liveWeatherZoneInsightTitle}>📍 Zone Insight</Text>
        <Text style={[styles.liveWeatherZoneInsightText, { color: theme.secondaryText }]}>{zoneInsight}</Text>
      </View>

      {/* FOOTER */}
      <View style={styles.liveWeatherFooter}>
        <Text style={styles.liveWeatherFooterText}>
          Zone {zone || "—"} • Est. last frost: {getEstimatedLastFrost(zone)} • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </Text>
      </View>

    </View>
  );
}

function WeatherTeaserCard({ theme, weather, zone, onUnlock }) {
  const climate = getClimateBucket(zone);
  const currentMonth = new Date().getMonth() + 1;

  const getConditionPreview = () => {
    if (!weather) return { icon: "🌤️", label: "Loading forecast...", color: "#8effab" };
    if (weather.minTempF <= 35) return { icon: "❄️", label: "Frost risk tonight — premium alert available", color: "#6bc7ff" };
    if (weather.maxTempF >= 98) return { icon: "🔥", label: "Extreme heat today — premium action plan available", color: "#ff7b7b" };
    if (weather.maxTempF >= 90) return { icon: "☀️", label: "Hot day — premium watering guide available", color: "#ffd86b" };
    if (weather.precipChance >= 70) return { icon: "🌧️", label: "Heavy rain today — premium garden plan available", color: "#6bc7ff" };
    return { icon: "✅", label: "Good growing conditions today", color: "#5cff89" };
  };

  const condition = getConditionPreview();

  const lockedFeatures = [
    { icon: "❄️", text: "Frost alerts with cover reminders" },
    { icon: "🔥", text: "Heat stress warnings and action plans" },
    { icon: "💧", text: "Smart daily watering guidance" },
    { icon: "🧠", text: "7-day garden intelligence forecast" },
    { icon: "📍", text: "Zone-specific seasonal insights" },
    { icon: "⚡", text: "Daily smart action checklist" },
  ];

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>

      {/* HEADER */}
      <Text style={styles.cardEyebrow}>🌤️ LIVE GARDEN WEATHER</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Garden Weather</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Zone {zone || "—"} • Smart weather intelligence for your garden
      </Text>

      {/* TEASER WEATHER CARD */}
      <View style={[styles.weatherTeaserCardV2, { borderColor: `${condition.color}40` }]}>
        <View style={styles.weatherTeaserTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.weatherTeaserConditionV2, { color: condition.color }]}>
              {condition.icon} {condition.label}
            </Text>
            <Text style={[styles.weatherTeaserTempV2, { color: theme.text }]}>
              {weather?.maxTempF ? `${Math.round(weather.maxTempF)}°F` : "--°F"}
              <Text style={[styles.weatherTeaserTempLow, { color: theme.secondaryText }]}>
                {weather?.minTempF ? ` / ${Math.round(weather.minTempF)}°F` : ""}
              </Text>
            </Text>
            <Text style={[styles.weatherTeaserRainPreview, { color: theme.secondaryText }]}>
              {weather?.precipChance !== undefined ? `💧 ${Math.round(weather.precipChance)}% rain chance` : ""}
            </Text>
          </View>
          <View style={styles.weatherTeaserLockCircle}>
            <Text style={styles.weatherTeaserLockIcon}>🔒</Text>
          </View>
        </View>

        {/* BLURRED PREVIEW OF ACTIONS */}
        <View style={styles.weatherTeaserBlurWrap}>
          <View style={styles.weatherTeaserBlurRow}>
            <Text style={styles.weatherTeaserBlurIcon}>⚡</Text>
            <View style={styles.weatherTeaserBlurBar} />
          </View>
          <View style={styles.weatherTeaserBlurRow}>
            <Text style={styles.weatherTeaserBlurIcon}>💧</Text>
            <View style={[styles.weatherTeaserBlurBar, { width: "60%" }]} />
          </View>
          <View style={styles.weatherTeaserBlurRow}>
            <Text style={styles.weatherTeaserBlurIcon}>📍</Text>
            <View style={[styles.weatherTeaserBlurBar, { width: "75%" }]} />
          </View>
        </View>
        <Text style={[styles.weatherTeaserBlurLabel, { color: theme.secondaryText }]}>
          Unlock premium to see your personalized action plan
        </Text>
      </View>

      {/* LOCKED FEATURES */}
      <View style={styles.weatherTeaserFeaturesWrap}>
        <View style={styles.weatherTeaserFeaturesList}>
          {lockedFeatures.map((f, i) => (
            <View key={i} style={styles.weatherTeaserFeatureRow}>
              <Text style={styles.weatherTeaserFeatureIcon}>{f.icon}</Text>
              <Text style={[styles.weatherTeaserFeatureText, { color: theme.secondaryText }]}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* UNLOCK BUTTON */}
      <Pressable onPress={onUnlock} style={styles.weatherTeaserUnlockBtn}>
        <Text style={styles.weatherTeaserUnlockBtnText}>👑 Unlock Premium Weather Intelligence</Text>
      </Pressable>

     <Text style={[styles.weatherTeaserFooter, { color: theme.secondaryText }]}>
        $2.99/month • Cancel anytime
      </Text>
    </View>
  );
}
function GardenerProfileCard({ theme, setAppearanceMode, avatarGlow, gardenXP, savedPlants, journalEntries, gardenMap, streakData, profileBanners, profileName, setProfileName, profilePhoto, setProfilePhoto, selectedProfileTheme, setSelectedProfileTheme }) {
  const unlockedBanners = profileBanners.filter((banner) => banner.unlocked);
  const activeBanner = unlockedBanners[unlockedBanners.length - 1] || profileBanners[0];
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
 const [updatingPhoto, setUpdatingPhoto] = useState(false);
  async function pickProfilePhoto() {
    if (updatingPhoto) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Photos Permission Needed", "Allow photo access to choose a profile picture."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1, allowsEditing: true, aspect: [1, 1] });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    setUpdatingPhoto(true);
    setProfilePhoto(asset.uri);
    setTimeout(() => setUpdatingPhoto(false), 600);
  }
return (
    <View>
      <View style={styles.profileBanner}>
        <Text style={styles.profileBannerEmoji}>{activeBanner?.emoji || "🌱"}</Text>
        <Text style={styles.profileBannerTitle}>{activeBanner?.title || "Seedling Starter"}</Text>
      </View>
      <Animated.View style={[styles.profileAvatarGlow, { shadowColor: "#5cff89", shadowRadius: avatarGlow.interpolate({ inputRange: [0,1], outputRange: [12,28] }), shadowOpacity: avatarGlow.interpolate({ inputRange: [0,1], outputRange: [0.5,1] }), transform: [{ scale: avatarGlow.interpolate({ inputRange: [0,1], outputRange: [1,1.05] }) }] }]}>
        <Pressable disabled={updatingPhoto} style={[styles.profileAvatarCircle, { borderColor: "#5cff89", opacity: updatingPhoto ? 0.6 : 1 }]} onPress={pickProfilePhoto}>
          {updatingPhoto ? (
  <Text style={[styles.profileAvatarEmoji, { fontSize: 13, fontWeight: "900" }]}>Updating…</Text>
) : profilePhoto ? (
  <Image
    source={{ uri: profilePhoto }}
    style={styles.profilePhoto}
    defaultSource={require("./assets/welcome-buddy.png")}
    onError={() => setProfilePhoto(null)}
  />
) : (
  <Text style={styles.profileAvatarEmoji}>🧑‍🌾</Text>
)}
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

function CollapsibleCard({ theme, storageKey, title, eyebrow, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(`pp_collapse_${storageKey}`).then((val) => {
      if (alive && val !== null) setOpen(val === "1");
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, [storageKey]);

  function toggle() {
    const next = !open;
    setOpen(next);
    AsyncStorage.setItem(`pp_collapse_${storageKey}`, next ? "1" : "0").catch(() => {});
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Pressable onPress={toggle} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          {eyebrow ? <Text style={styles.cardEyebrow}>{eyebrow}</Text> : null}
          <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
        </View>
        <Text style={{ color: "#5cff89", fontSize: 22, fontWeight: "900", marginLeft: 12 }}>{open ? "▾" : "▸"}</Text>
      </Pressable>
      {open ? <View style={{ marginTop: 14 }}>{children}</View> : null}
    </View>
  );
}

function AccountCloudCard({
  theme,
  user,
  newEmail,
  setNewEmail,
  subscriptionPlan,
  premiumUnlocked,
  savedPlants,
  journalEntries,
  gardenMap,
}) {
  const gardenPlotCount =
    Object.values(gardenMap || {}).filter(Boolean).length;

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "Unknown";

  const lastSync = "Just now";

  const changeEmail = async () => {
  const cleanEmail = newEmail.trim();

  if (!cleanEmail) {
    alert("Enter a new email first.");
    return;
  }

  try {
    const { error } = await supabase.auth.updateUser({
      email: cleanEmail,
    });

    if (error) {
      console.log("EMAIL CHANGE ERROR:", error.message);
      alert("Could not change email: " + error.message);
      return;
    }

    alert("Check your new email inbox for a confirmation link!");
    setNewEmail("");
  } catch (err) {
    console.log("EMAIL CHANGE CRASH:", err);
    alert("Something went wrong. Try again.");
  }
};

const resetPassword = async () => {
  if (!user?.email) {
    alert("No email found for this account.");
    return;
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      user.email,
      {
        redirectTo: "pocketplanter://reset-password",
      }
    );

    if (error) {
      console.log("RESET ERROR:", error.message);
      alert("Could not send reset email: " + error.message);
      return;
    }

    alert("Password reset email sent! Check your inbox.");
  } catch (err) {
    console.log("RESET CRASH:", err);
    alert("Something went wrong. Try again.");
  }
};

const handleLogout = () => {
  Alert.alert(
    "Log Out",
    "Are you sure you want to log out?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
        },
      },
    ]
  );
};

return (
    <View>

      <Text
        style={[
          styles.cardText,
          { color: theme.secondaryText },
        ]}
      >
      </Text>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          Email
        </Text>

        <Text style={styles.accountInfoValue}>
          {user?.email || "Not signed in"}
        </Text>
      </View>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          Current Plan
        </Text>

        <Text style={styles.accountInfoValue}>
          {subscriptionPlan || "Free"}
        </Text>
      </View>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          Premium Status
        </Text>

        <Text style={styles.accountInfoValue}>
          {premiumUnlocked
            ? "Active ✅"
            : "Free 🌱"}
        </Text>
      </View>

      <View style={styles.accountStatsGrid}>
        <View style={styles.accountStatTile}>
          <Text style={styles.accountStatValue}>
            {savedPlants.length}
          </Text>

          <Text style={styles.accountStatLabel}>
            Saved Plants
          </Text>
        </View>

        <View style={styles.accountStatTile}>
          <Text style={styles.accountStatValue}>
            {journalEntries.length}
          </Text>

          <Text style={styles.accountStatLabel}>
            Journal Photos
          </Text>
        </View>

        <View style={styles.accountStatTile}>
          <Text style={styles.accountStatValue}>
            {gardenPlotCount}
          </Text>

          <Text style={styles.accountStatLabel}>
            Garden Plots
          </Text>
        </View>

        <View style={styles.accountStatTile}>
          <Text
            style={[
              styles.accountStatValue,
              { fontSize: 14 },
            ]}
          >
            {memberSince}
          </Text>

          <Text style={styles.accountStatLabel}>
            Member Since
          </Text>
        </View>
      </View>

      <View style={styles.accountSyncBox}>
        <Text style={styles.accountInfoLabel}>
          Last Cloud Sync
        </Text>

        <Text style={styles.accountInfoValue}>
          {lastSync}
        </Text>
      </View>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          Change Email
        </Text>

        <TextInput
          value={newEmail}
          onChangeText={setNewEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="New email address"
          placeholderTextColor="#8fbf9d"
          style={styles.accountInput}
        />

        <Pressable
          onPress={changeEmail}
          style={styles.accountActionButton}
        >
          <Text style={styles.accountActionButtonText}>
            Send Email Change Confirmation
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={resetPassword}
        style={styles.accountSecondaryButton}
      >
        <Text style={styles.accountSecondaryButtonText}>
          Send Password Reset Email
        </Text>
      </Pressable>

      <Pressable
        onPress={handleLogout}
        style={styles.accountLogoutButton}
      >
        <Text style={styles.accountLogoutButtonText}>
          🚪 Log Out
        </Text>
      </Pressable>

      <Pressable
        onPress={async () => {
          Alert.alert(
            "Delete Account",
            "This will permanently delete your account and all garden data. This cannot be undone.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete My Account",
                style: "destructive",
                onPress: async () => {
                  try {
                    const { data: sessionData } = await supabase.auth.getSession();
                    const token = sessionData?.session?.access_token;
                    if (!token) {
                      Alert.alert("Error", "Could not verify your session. Please log out and back in, then try again.");
                      return;
                    }
                    const { error } = await supabase.functions.invoke("delete-account", {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (error) {
                      Alert.alert("Deletion Failed", "Something went wrong. Please email support@pocketplanter.green for help.");
                      return;
                    }
                    await supabase.auth.signOut();
                    Alert.alert("Account Deleted", "Your account and all data have been permanently removed.");
                  } catch (err) {
                    Alert.alert("Contact Support", "Please email support@pocketplanter.green to complete account deletion.");
                  }
                },
              },
            ]
          );
        }}
        style={[styles.accountLogoutButton, { borderColor: "rgba(255,50,50,0.5)", marginTop: 10 }]}
      >
        <Text style={[styles.accountLogoutButtonText, { color: "#ff4444" }]}>
          🗑 Delete Account
        </Text>
      </Pressable>
    </View>
  );
}
function ProfileBannersCard({ theme, profileBanners, gardenXP, savedPlants, journalEntries, gardenMap, wateredPlants, streakData, harvestTrackers, careLog, premiumUnlocked, activeBannerId, setActiveBannerId }) {
  const [newlyUnlocked, setNewlyUnlocked] = useState(null);
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  const getBannerProgress = (banner) => {
  if (banner.unlocked) return 1;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const totalWatered = Object.values(wateredPlants || {}).filter(Boolean).length;
  const streakCount = streakData?.count || 0;
  switch (banner.id) {
    case "seedling_banner": return Math.min(gardenXP.level / 1, 1);
    case "green_thumb_banner": return Math.min(gardenXP.level / 5, 1);
    case "harvest_banner": return Math.min(gardenXP.level / 8, 1);
    case "master_banner": return Math.min(gardenXP.level / 20, 1);
    case "collector_banner": return Math.min(savedPlants.length / 10, 1);
    case "journal_banner": return Math.min(journalEntries.length / 10, 1);
    case "planner_banner": return Math.min(gardenPlotCount / 12, 1);
    case "streak_banner": return Math.min(streakCount / 7, 1);
    case "obsessed_banner": return Math.min(streakCount / 30, 1);
    case "water_wizard_banner": return Math.min(totalWatered / 50, 1);
    case "master_waterer_banner": return Math.min(totalWatered / 100, 1);
    case "soil_scientist_banner": return Math.min((careLog || []).length / 10, 1);
    case "care_expert_banner": return Math.min((careLog || []).length / 25, 1);
    case "snapshot_banner": return Math.min(journalEntries.length / 5, 1);
    case "garden_historian_banner": return Math.min(journalEntries.length / 25, 1);
    case "zone_master_banner": return Math.min(savedPlants.length / 15, 1);
    case "legendary_grower_banner": return Math.min(gardenXP.level / 15, 1);
    case "full_garden_banner": return Math.min(gardenPlotCount / 12, 1);
    case "harvest_king_banner": return Math.min(Object.keys(harvestTrackers || {}).length / 5, 1);
    case "companion_pro_banner": return premiumUnlocked ? 1 : 0;
    case "quest_crusher_banner": return Math.min(gardenXP.xp / 500, 1);
    default: return 0;
  }
};
  const getBannerProgressLabel = (banner) => {
  if (banner.unlocked) return "Unlocked ✓";
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const totalWatered = Object.values(wateredPlants || {}).filter(Boolean).length;
  const streakCount = streakData?.count || 0;
  switch (banner.id) {
    case "seedling_banner": return `Level ${gardenXP.level}/1`;
    case "green_thumb_banner": return `Level ${gardenXP.level}/5`;
    case "harvest_banner": return `Level ${gardenXP.level}/8`;
    case "master_banner": return `Level ${gardenXP.level}/20`;
    case "collector_banner": return `${savedPlants.length}/10 plants saved`;
    case "journal_banner": return `${journalEntries.length}/10 photos`;
    case "planner_banner": return `${gardenPlotCount}/12 plots filled`;
    case "streak_banner": return `${streakCount}/7 day streak`;
    case "obsessed_banner": return `${streakCount}/30 day streak`;
    case "water_wizard_banner": return `${totalWatered}/50 plants watered`;
    case "master_waterer_banner": return `${totalWatered}/100 plants watered`;
    case "soil_scientist_banner": return `${(careLog || []).length}/10 care actions`;
    case "care_expert_banner": return `${(careLog || []).length}/25 care actions`;
    case "snapshot_banner": return `${journalEntries.length}/5 photos`;
    case "garden_historian_banner": return `${journalEntries.length}/25 photos`;
    case "zone_master_banner": return `${savedPlants.length}/15 plants saved`;
    case "legendary_grower_banner": return `Level ${gardenXP.level}/15`;
    case "full_garden_banner": return `${gardenPlotCount}/12 plots filled`;
    case "harvest_king_banner": return `${Object.keys(harvestTrackers || {}).length}/5 harvests tracked`;
    case "companion_pro_banner": return premiumUnlocked ? "Unlocked ✓" : "Unlock Premium first";
    case "quest_crusher_banner": return `${gardenXP.xp}/500 XP earned`;
    default: return banner.subtitle;
  }
};

  const handleBannerTap = (banner) => {
    if (!banner.unlocked) return;
    if (activeBannerId === banner.id) {
      setActiveBannerId(null);
    } else {
      setActiveBannerId(banner.id);
      Vibration.vibrate(60);
      successHaptic();
    }
  };

  const activeBanner = profileBanners.find(b => b.id === activeBannerId) || profileBanners.find(b => b.unlocked);
  const unlockedCount = profileBanners.filter(b => b.unlocked).length;

return (
    <View>

      {/* PROGRESS SUMMARY */}
      <View style={styles.bannerProgressSummary}>
        <View style={styles.bannerProgressSummaryLeft}>
          <Text style={styles.bannerProgressSummaryValue}>{unlockedCount}/{profileBanners.length}</Text>
          <Text style={[styles.bannerProgressSummaryLabel, { color: theme.secondaryText }]}>Banners Unlocked</Text>
        </View>
        <View style={styles.bannerProgressSummaryTrack}>
          <View style={[styles.bannerProgressSummaryFill, { width: `${(unlockedCount / profileBanners.length) * 100}%` }]} />
        </View>
      </View>

      {/* ACTIVE BANNER PREVIEW */}
      {activeBanner ? (
        <View style={[styles.bannerActivePreview, { backgroundColor: activeBanner.gradient[0] + "22", borderColor: activeBanner.gradient[0] + "55" }]}>
          <Animated.View style={{ opacity: glowOpacity }}>
            <Text style={styles.bannerActiveEmoji}>{activeBanner.emoji}</Text>
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerActiveLabel}>Active Banner</Text>
            <Text style={[styles.bannerActiveName, { color: activeBanner.gradient[0] }]}>{activeBanner.title}</Text>
            <Text style={[styles.bannerActiveSubtitle, { color: theme.secondaryText }]}>{activeBanner.subtitle}</Text>
          </View>
          {activeBannerId ? (
            <View style={[styles.bannerActiveCheckBadge, { backgroundColor: activeBanner.gradient[0] }]}>
              <Text style={styles.bannerActiveCheckText}>✓ Active</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* HORIZONTAL SCROLL CARDS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bannerScrollContent}
      >
        {profileBanners.map((banner) => {
          const progress = getBannerProgress(banner);
          const progressLabel = getBannerProgressLabel(banner);
          const isActive = activeBannerId === banner.id;
          const isLocked = !banner.unlocked;

          return (
            <Pressable
              key={banner.id}
              onPress={() => handleBannerTap(banner)}
              style={[
                styles.bannerScrollCard,
                {
                  borderColor: isActive
                    ? banner.gradient[0]
                    : banner.unlocked
                    ? banner.gradient[0] + "55"
                    : "rgba(255,255,255,0.08)",
                  borderWidth: isActive ? 2.5 : 1,
                  opacity: isLocked ? 0.75 : 1,
                },
              ]}
            >
              {/* GRADIENT HEADER */}
              <View style={[styles.bannerScrollCardHeader, { backgroundColor: banner.gradient[0] + (isLocked ? "30" : "22") }]}>
                {isLocked ? (
                  <View style={styles.bannerScrollLockWrap}>
                    <Text style={styles.bannerScrollLockIcon}>🔒</Text>
                  </View>
                ) : (
                  <Animated.View style={{ opacity: isActive ? glowOpacity : 1 }}>
                    <Text style={styles.bannerScrollEmoji}>{banner.emoji}</Text>
                  </Animated.View>
                )}
                {isActive ? (
                  <View style={[styles.bannerScrollActiveBadge, { backgroundColor: banner.gradient[0] }]}>
                    <Text style={styles.bannerScrollActiveBadgeText}>✓ Active</Text>
                  </View>
                ) : null}
                {banner.unlocked && !isActive ? (
                  <View style={styles.bannerScrollUnlockedBadge}>
                    <Text style={styles.bannerScrollUnlockedBadgeText}>Unlocked</Text>
                  </View>
                ) : null}
              </View>

              {/* CARD CONTENT */}
              <View style={styles.bannerScrollCardBody}>
                <Text style={[styles.bannerScrollCardTitle, { color: banner.unlocked ? "#ffffff" : "#8fbf9d" }]}>
                  {banner.title}
                </Text>
                <Text style={[styles.bannerScrollCardSubtitle, { color: theme.secondaryText }]}>
                  {banner.subtitle}
                </Text>

                {/* PROGRESS BAR */}
                <View style={styles.bannerScrollProgressTrack}>
                  <View style={[styles.bannerScrollProgressFill, {
                    width: `${progress * 100}%`,
                    backgroundColor: banner.unlocked ? banner.gradient[0] : "rgba(255,255,255,0.25)",
                  }]} />
                </View>
                <Text style={[styles.bannerScrollProgressLabel, { color: banner.unlocked ? banner.gradient[0] : theme.secondaryText }]}>
                  {progressLabel}
                </Text>

                {/* TAP TO EQUIP */}
                {banner.unlocked && !isActive ? (
                  <Text style={[styles.bannerScrollEquipHint, { color: banner.gradient[0] }]}>
                    Tap to set active →
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* NEXT TO UNLOCK */}
      {(() => {
        const nextBanner = profileBanners.find(b => !b.unlocked);
        if (!nextBanner) return (
          <View style={styles.bannerAllUnlockedBox}>
            <Text style={styles.bannerAllUnlockedText}>🏆 All banners unlocked — you're a Garden Master!</Text>
          </View>
        );
        const progress = getBannerProgress(nextBanner);
        const progressLabel = getBannerProgressLabel(nextBanner);
        return (
          <View style={[styles.bannerNextUnlockBox, { borderColor: nextBanner.gradient[0] + "40" }]}>
            <Text style={styles.bannerNextUnlockEyebrow}>🎯 NEXT TO UNLOCK</Text>
            <View style={styles.bannerNextUnlockRow}>
              <Text style={styles.bannerNextUnlockEmoji}>{nextBanner.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerNextUnlockTitle}>{nextBanner.title}</Text>
                <Text style={[styles.bannerNextUnlockSub, { color: theme.secondaryText }]}>{nextBanner.subtitle}</Text>
                <View style={styles.bannerNextUnlockTrack}>
                  <View style={[styles.bannerNextUnlockFill, {
                    width: `${progress * 100}%`,
                    backgroundColor: nextBanner.gradient[0],
                  }]} />
                </View>
                <Text style={[styles.bannerNextUnlockProgress, { color: nextBanner.gradient[0] }]}>{progressLabel}</Text>
              </View>
            </View>
          </View>
        );
      })()}
    </View>
  );
}
function DailyQuestsCard({ theme, dailyQuests, completedQuestIds, onQuestComplete }) {
  const completedCount = dailyQuests.filter((quest) => quest.completed).length;
  const totalXP = dailyQuests.reduce((sum, q) => sum + (q.completed ? q.reward : 0), 0);

  if (dailyQuests.length > 0 && completedCount === dailyQuests.length) return null;

  const getResetText = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msLeft = midnight - now;
    const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
    const minsLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    if (hoursLeft >= 1) return `Resets in ${hoursLeft}h`;
    return `Resets in ${minsLeft}m`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "#5cff89";
      case "Medium": return "#ffd86b";
      case "Hard": return "#ff7b7b";
      case "Bonus": return "#d8c8ff";
      default: return "#5cff89";
    }
  };

return (
    <View>
     <Text style={[styles.cardText, { color: theme.secondaryText }]}>
      </Text>
      <View style={{ alignSelf: "flex-start", marginTop: 8, backgroundColor: "rgba(255,216,107,0.12)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(255,216,107,0.25)" }}>
        <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900" }}>⏳ {getResetText()}</Text>
      </View>

      {/* PROGRESS SUMMARY */}
      <View style={styles.questProgressSummary}>
        <View style={styles.questProgressLeft}>
          <Text style={styles.questProgressValue}>{completedCount}/{dailyQuests.length}</Text>
          <Text style={[styles.questProgressLabel, { color: theme.secondaryText }]}>Completed</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.questProgressTrack}>
            <View style={[styles.questProgressFill, { width: `${(completedCount / dailyQuests.length) * 100}%` }]} />
          </View>
          <Text style={styles.questProgressXP}>+{totalXP} XP earned today</Text>
        </View>
        {completedCount === dailyQuests.length ? (
          <Text style={styles.questAllDoneEmoji}>🌟</Text>
        ) : null}
      </View>

      {/* QUEST LIST */}
      <View style={styles.questList}>
        {dailyQuests.map((quest) => {
          const diffColor = getDifficultyColor(quest.difficulty);
          const alreadyClaimed = completedQuestIds[getTodayKey()]?.includes(quest.id);

          return (
            <Pressable
              key={quest.id}
              onPress={() => {
                if (quest.completed && !alreadyClaimed) {
                  onQuestComplete(quest);
                }
              }}
              style={[styles.questRowV2, {
                backgroundColor: quest.completed
                  ? diffColor + "14"
                  : "rgba(255,255,255,0.05)",
                borderColor: quest.completed
                  ? diffColor + "40"
                  : "rgba(255,255,255,0.08)",
              }]}
            >
              {/* ICON */}
              <View style={[styles.questIconWrap, { backgroundColor: diffColor + "20" }]}>
                <Text style={styles.questIcon}>{quest.icon}</Text>
              </View>

              {/* CONTENT */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[styles.questTitle, { color: quest.completed ? "#ffffff" : "#8fbf9d" }]}>
                    {quest.title}
                  </Text>
                  <View style={[styles.questDifficultyBadge, { backgroundColor: diffColor + "22" }]}>
                    <Text style={[styles.questDifficultyText, { color: diffColor }]}>{quest.difficulty}</Text>
                  </View>
                </View>
                <Text style={[styles.questDescription, { color: theme.secondaryText }]}>{quest.description}</Text>

                {/* PROGRESS BAR */}
                <View style={styles.questProgressBarTrack}>
                  <View style={[styles.questProgressBarFill, {
                    width: `${Math.min((quest.progress / quest.goal) * 100, 100)}%`,
                    backgroundColor: diffColor,
                  }]} />
                </View>
                <Text style={[styles.questProgressFraction, { color: diffColor }]}>
                  {quest.progress}/{quest.goal} • +{quest.reward} XP
                </Text>
              </View>

              {/* STATUS */}
              {quest.completed ? (
                alreadyClaimed ? (
                  <View style={[styles.questClaimedBadge, { backgroundColor: diffColor + "22" }]}>
                    <Text style={[styles.questClaimedText, { color: diffColor }]}>✓ Claimed</Text>
                  </View>
                ) : (
                  <View style={[styles.questClaimButton, { backgroundColor: diffColor }]}>
                    <Text style={styles.questClaimButtonText}>Claim!</Text>
                  </View>
                )
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {/* ALL DONE */}
      {completedCount === dailyQuests.length ? (
        <View style={styles.questAllDoneBox}>
          <Text style={styles.questAllDoneTitle}>🌟 All quests complete!</Text>
          <Text style={[styles.questAllDoneText, { color: theme.secondaryText }]}>
            Amazing work! Come back tomorrow for new quests.
          </Text>
        </View>
      ) : null}
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

function SeasonComparisonCard({ theme, harvestLog, journalEntries, wateringHistory }) {
  const now = new Date();
  const season = getSeasonForMonth(now.getMonth() + 1);
  const thisYear = now.getFullYear();
  const lastYear = thisYear - 1;

  const waterEvents = [];
  Object.values(wateringHistory || {}).forEach((dates) => {
    if (Array.isArray(dates)) dates.forEach((d) => waterEvents.push({ createdAt: `${String(d).slice(0, 10)}T12:00:00` }));
  });

  const build = (year) => ({
    harvests: countInSeason(harvestLog, "createdAt", year, season.months),
    photos: countInSeason(journalEntries, "createdAt", year, season.months),
    waterings: countInSeason(waterEvents, "createdAt", year, season.months),
  });

  const current = build(thisYear);
  const prior = build(lastYear);
  const hasPrior = prior.harvests + prior.photos + prior.waterings > 0;

  const hasThisSeason = current.harvests + current.photos + current.waterings > 0;

  const rows = [
    { icon: "🎉", label: "Harvests", value: current.harvests },
    { icon: "📸", label: "Photos", value: current.photos },
    { icon: "💧", label: "Waterings", value: current.waterings },
  ];

return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Your {season.label} {thisYear}</Text>
      {!hasThisSeason ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(107,199,255,0.08)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(107,199,255,0.20)" }}>
          <Text style={{ color: "#6bc7ff", fontSize: 14, fontWeight: "800", lineHeight: 21 }}>
            Nothing logged this {season.label.toLowerCase()} yet. Water a plant, add a photo, or log a harvest and it'll show up here. 🌱
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          {rows.map((r) => (
            <View key={r.label} style={{ flex: 1, borderRadius: 18, paddingVertical: 18, alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(107,199,255,0.16)" }}>
              <Text style={{ fontSize: 24 }}>{r.icon}</Text>
              <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{r.value}</Text>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 3 }}>{r.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
function WateringHeatmapCard({ theme, wateringHistory }) {
  const WEEKS = 15; // ~15 weeks of history

  // Flatten all watering dates into a count per day-key
  const counts = {};
  Object.values(wateringHistory || {}).forEach((dates) => {
    if (!Array.isArray(dates)) return;
    dates.forEach((d) => {
      const key = String(d).slice(0, 10);
      counts[key] = (counts[key] || 0) + 1;
    });
  });

  const totalWaterings = Object.values(counts).reduce((a, b) => a + b, 0);
  if (totalWaterings === 0) return null;

  // Build a grid: columns = weeks, rows = days of week (Sun..Sat)
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  // Find the most recent Saturday (end of current week column)
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const columns = [];
  let maxCount = 1;
  for (let w = WEEKS - 1; w >= 0; w -= 1) {
    const col = [];
    for (let dow = 0; dow < 7; dow += 1) {
      const cell = new Date(end);
      cell.setDate(end.getDate() - w * 7 - (6 - dow));
      const key = cell.toISOString().slice(0, 10);
      const count = cell > today ? -1 : (counts[key] || 0); // -1 = future, hide
      if (count > maxCount) maxCount = count;
      col.push({ key, count, isToday: key === today.toISOString().slice(0, 10) });
    }
    columns.push(col);
  }

  const cellColor = (count) => {
    if (count < 0) return "transparent";
    if (count === 0) return "rgba(255,255,255,0.06)";
    const ratio = count / maxCount;
    if (ratio > 0.66) return "#2fbf6b";
    if (ratio > 0.33) return "#5cff89";
    return "rgba(92,255,137,0.4)";
  };

  const activeDays = Object.keys(counts).length;

return (
    <View>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {totalWaterings} watering{totalWaterings === 1 ? "" : "s"} across {activeDays} day{activeDays === 1 ? "" : "s"}. Each square is a day — greener means more.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {columns.map((col, ci) => (
            <View key={`col-${ci}`} style={{ gap: 4 }}>
              {col.map((cell) => (
                <View
                  key={cell.key}
                  style={{
                    width: 15, height: 15, borderRadius: 4,
                    backgroundColor: cellColor(cell.count),
                    borderWidth: cell.isToday ? 1.5 : 0,
                    borderColor: "#ffffff",
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, justifyContent: "flex-end" }}>
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700" }}>Less</Text>
        {["rgba(255,255,255,0.06)", "rgba(92,255,137,0.4)", "#5cff89", "#2fbf6b"].map((c) => (
          <View key={c} style={{ width: 13, height: 13, borderRadius: 4, backgroundColor: c }} />
        ))}
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700" }}>More</Text>
      </View>
    </View>
  );
}
function HarvestGoalCard({ theme, harvestLog, harvestGoal, setHarvestGoal }) {
  const [input, setInput] = useState("");

  // Count harvests logged since the goal was created
  const progress = harvestGoal
    ? (harvestLog || []).filter((h) => new Date(h.createdAt) >= new Date(harvestGoal.createdAt)).length
    : 0;
  const target = harvestGoal?.target || 0;
  const pct = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
  const done = target > 0 && progress >= target;

  const setGoal = () => {
    const n = parseInt(input, 10);
    if (!n || n < 1) {
      Alert.alert("Enter a number", "Set how many harvests you want to log this season (e.g. 20).");
      return;
    }
    tapHaptic("light");
    setHarvestGoal({ target: n, createdAt: new Date().toISOString() });
    setInput("");
  };

  const clearGoal = () => {
    Alert.alert("Clear goal?", "This removes your current harvest goal. Your harvest log stays.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => { setHarvestGoal(null); setInput(""); } },
    ]);
  };
if (!harvestGoal) {
    return (
      <View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="e.g. 20"
            placeholderTextColor="#8fbf9d"
            keyboardType="number-pad"
            style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,216,107,0.2)", color: "#ffffff", fontSize: 16, fontWeight: "800", paddingHorizontal: 16, paddingVertical: 13 }}
          />
          <Pressable onPress={setGoal} style={{ backgroundColor: "#ffd86b", borderRadius: 14, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#3d2c00", fontSize: 15, fontWeight: "900" }}>Set</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>
        {done ? "Goal Reached! 🎉" : "Your Season Goal"}
      </Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {done
          ? `You hit your goal of ${target} harvests. Amazing season — set a new one to keep going.`
          : `${progress} of ${target} harvests logged. ${target - progress} to go!`}
      </Text>

      <View style={{ alignItems: "center", marginTop: 18 }}>
        <Text style={{ color: done ? "#5cff89" : "#ffd86b", fontSize: 40, fontWeight: "900" }}>{progress}<Text style={{ color: theme.secondaryText, fontSize: 22 }}> / {target}</Text></Text>
      </View>

      <View style={{ height: 12, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.1)", marginTop: 14, overflow: "hidden" }}>
        <View style={{ height: 12, borderRadius: 999, backgroundColor: done ? "#5cff89" : "#ffd86b", width: `${pct}%` }} />
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", textAlign: "center", marginTop: 8 }}>{pct}% complete</Text>

      <Pressable onPress={clearGoal} style={{ marginTop: 16, alignItems: "center" }}>
        <Text style={{ color: "#8fbf9d", fontSize: 13, fontWeight: "800" }}>{done ? "Set a new goal" : "Change goal"}</Text>
      </Pressable>
    </View>
  );
}

function GardenROICard({ theme, harvestLog, suppliesSpent, setSuppliesSpent }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const grown = estimateHarvestValue(harvestLog);
  const grownTotal = grown.total || 0;
  const spent = Number(suppliesSpent) || 0;
  const net = grownTotal - spent;
  const roi = spent > 0 ? grownTotal / spent : null;
  const hasData = grownTotal > 0 || spent > 0;

  const saveSpent = () => {
    const n = parseFloat(draft);
    if (Number.isNaN(n) || n < 0) {
      Alert.alert("Enter an amount", "Type what you've spent on seeds and supplies (e.g. 45).");
      return;
    }
    tapHaptic("light");
    setSuppliesSpent(Math.round(n * 100) / 100);
    setEditing(false);
    setDraft("");
  };

  const netColor = net >= 0 ? "#5cff89" : "#ff7b7b";

return (
    <View>

      {/* HEADLINE NET */}
      {hasData ? (
        <View style={{ alignItems: "center", marginTop: 18, marginBottom: 6 }}>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>
            {net >= 0 ? "NET SAVINGS" : "NET SO FAR"}
          </Text>
          <Text style={{ color: netColor, fontSize: 42, fontWeight: "900", marginTop: 4 }}>
            {net >= 0 ? "" : "-"}${Math.abs(net)}
          </Text>
          {roi ? (
            <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800", marginTop: 4 }}>
              For every $1 spent, you grew ~${roi.toFixed(2)} of produce
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* GROWN vs SPENT ROW */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
        <View style={{ flex: 1, borderRadius: 18, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(92,255,137,0.10)", borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}>
          <Text style={{ fontSize: 22 }}>🌱</Text>
          <Text style={{ color: "#8effab", fontSize: 24, fontWeight: "900", marginTop: 6 }}>${grownTotal}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>Grown</Text>
        </View>
        <View style={{ flex: 1, borderRadius: 18, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(255,159,67,0.10)", borderWidth: 1, borderColor: "rgba(255,159,67,0.24)" }}>
          <Text style={{ fontSize: 22 }}>🧾</Text>
          <Text style={{ color: "#ff9f43", fontSize: 24, fontWeight: "900", marginTop: 6 }}>${spent}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>Spent</Text>
        </View>
      </View>

      {/* TOP EARNER */}
      {grown.topPlant ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 14, textAlign: "center" }}>
          🏆 Your top earner: <Text style={{ color: "#8effab", fontWeight: "900" }}>{grown.topPlant.name}</Text> (~${grown.topPlant.value})
        </Text>
      ) : null}

      {/* SET / EDIT SPENT */}
      {editing ? (
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="e.g. 45"
            placeholderTextColor="#8fbf9d"
            keyboardType="decimal-pad"
            autoFocus
            style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)", color: "#ffffff", fontSize: 16, fontWeight: "800", paddingHorizontal: 16, paddingVertical: 13 }}
          />
          <Pressable onPress={saveSpent} style={{ backgroundColor: "#5cff89", borderRadius: 14, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>Save</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => { setDraft(spent > 0 ? String(spent) : ""); setEditing(true); }}
          style={{ marginTop: 16, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, paddingVertical: 13, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}
        >
          <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>
            {spent > 0 ? "✏️ Update supplies spent" : "＋ Add what you've spent"}
          </Text>
        </Pressable>
      )}

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
      </Text>
    </View>
  );
}

function YearInReviewCard({ theme, savedPlants, harvestLog, journalEntries, wateringHistory, streakData, gardenXP }) {
  const now = new Date();
  const yearAgo = new Date(now); yearAgo.setFullYear(now.getFullYear() - 1);
  const inLastYear = (dateStr) => {
    const d = new Date(dateStr);
    return !Number.isNaN(d.getTime()) && d >= yearAgo && d <= now;
  };

  const harvestsYr = (harvestLog || []).filter((h) => inLastYear(h.createdAt)).length;
  const photosYr = (journalEntries || []).filter((e) => inLastYear(e.createdAt)).length;
  const wateringsYr = Object.values(wateringHistory || {}).reduce((sum, dates) => {
    if (!Array.isArray(dates)) return sum;
    return sum + dates.filter((d) => inLastYear(`${String(d).slice(0, 10)}T12:00:00`)).length;
  }, 0);

  const harvestValue = estimateHarvestValue(
    (harvestLog || []).filter((h) => inLastYear(h.createdAt))
  );

  const hasActivity = harvestsYr + photosYr + wateringsYr > 0 || savedPlants.length > 0;
  if (!hasActivity) return null;

  const stats = [
    { icon: "🌱", value: savedPlants.length, label: "Plants Grown" },
    { icon: "💧", value: wateringsYr, label: "Waterings" },
    { icon: "📸", value: photosYr, label: "Photos" },
    { icon: "🎉", value: harvestsYr, label: "Harvests" },
    { icon: "🔥", value: streakData?.count || 0, label: "Day Streak" },
    { icon: "⭐", value: `Lvl ${gardenXP.level}`, label: gardenXP.title },
  ];

  const shareReview = async () => {
    try {
      tapHaptic("light");
      const lines = [
        `🌿 My Pocket Planter year in review:`,
        "",
        `🌱 ${savedPlants.length} plants grown`,
        wateringsYr > 0 ? `💧 ${wateringsYr} waterings` : null,
        photosYr > 0 ? `📸 ${photosYr} garden photos` : null,
        harvestsYr > 0 ? `🎉 ${harvestsYr} harvests` : null,
        harvestValue.total > 0 ? `💰 ~$${harvestValue.total} of produce grown` : null,
        (streakData?.count || 0) > 0 ? `🔥 ${streakData.count}-day streak` : null,
        `⭐ Level ${gardenXP.level} — ${gardenXP.title}`,
        "",
        "What a year in the garden 🌻",
      ].filter(Boolean);
      await Share.share({ message: lines.join("\n") });
    } catch (e) {
      console.log("Year review share skipped:", e);
    }
  };

return (
    <View>

      {harvestValue.total > 0 ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(255,216,107,0.10)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(255,216,107,0.28)", flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 32 }}>💰</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>GROWN THIS YEAR</Text>
            <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 2 }}>~${harvestValue.total}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>Estimated value of your harvests</Text>
          </View>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
        {stats.map((s) => (
          <View key={s.label} style={{ width: "47%", borderRadius: 20, padding: 16, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,216,107,0.16)", alignItems: "center" }}>
            <Text style={{ fontSize: 26 }}>{s.icon}</Text>
            <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{s.value}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 3, textAlign: "center" }}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={shareReview} style={{ marginTop: 16, backgroundColor: "#ffd86b", borderRadius: 18, paddingVertical: 15, alignItems: "center" }}>
        <Text style={{ color: "#3d2c00", fontWeight: "900", fontSize: 15 }}>📤 Share My Year in Review</Text>
      </Pressable>
    </View>
  );
}
function GardenStoryCard({ theme, savedPlants, harvestLog, journalEntries, wateringHistory, streakData, gardenXP, gardenAreas }) {
  const totalWaterings = Object.values(wateringHistory || {}).reduce(
    (sum, dates) => sum + (Array.isArray(dates) ? dates.length : 0),
    0
  );
  const totalHarvests = (harvestLog || []).length;
  const areaCount = (gardenAreas || []).length;
  const mvpPlant = (() => {
    if (!harvestLog || !harvestLog.length) return null;
    const counts = {};
    harvestLog.forEach((h) => { counts[h.plantName] = (counts[h.plantName] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : null;
  })();
  const harvestValue = estimateHarvestValue(harvestLog);

  const stats = [
    { icon: "🌱", value: savedPlants.length, label: "Plants Grown" },
    { icon: "🎉", value: totalHarvests, label: "Harvests" },
    { icon: "💧", value: totalWaterings, label: "Waterings" },
    { icon: "📸", value: journalEntries.length, label: "Photos" },
    { icon: "🔥", value: streakData?.count || 0, label: "Day Streak" },
    { icon: "⭐", value: `Lvl ${gardenXP.level}`, label: gardenXP.title },
  ];

  const shareStory = async () => {
    try {
      tapHaptic("light");
      const lines = [
        "🌱 My Pocket Planter Garden Story:",
        "",
        `🪴 ${savedPlants.length} plants grown`,
        totalHarvests > 0 ? `🎉 ${totalHarvests} harvests logged` : null,
        harvestValue.total > 0 ? `💰 ~$${harvestValue.total} of produce grown` : null,
        `💧 ${totalWaterings} waterings`,
        journalEntries.length > 0 ? `📸 ${journalEntries.length} garden photos` : null,
        (streakData?.count || 0) > 0 ? `🔥 ${streakData.count}-day streak` : null,
        mvpPlant ? `🏆 MVP plant: ${mvpPlant}` : null,
        `⭐ Level ${gardenXP.level} — ${gardenXP.title}`,
        "",
        "Growing smarter with Pocket Planter 🌿",
      ].filter(Boolean);
      await Share.share({ message: lines.join("\n") });
    } catch (error) {
      console.log("Share story skipped:", error);
    }
  };

return (
    <View>

      {mvpPlant ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(255,216,107,0.10)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(255,216,107,0.28)", flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 32 }}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>YOUR MVP PLANT</Text>
            <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", marginTop: 2 }}>{mvpPlant}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>Your most-harvested plant</Text>
          </View>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
        {stats.map((s) => (
          <View key={s.label} style={{ width: "47%", borderRadius: 20, padding: 16, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(142,255,171,0.16)", alignItems: "center" }}>
            <Text style={{ fontSize: 26 }}>{s.icon}</Text>
            <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{s.value}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 3, textAlign: "center" }}>{s.label}</Text>
          </View>
        ))}
      </View>

      {areaCount > 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 14, textAlign: "center" }}>
          🗂️ Growing across {areaCount} garden area{areaCount === 1 ? "" : "s"}
        </Text>
      ) : null}

      <Pressable onPress={shareStory} style={{ marginTop: 16, backgroundColor: "#5cff89", borderRadius: 18, paddingVertical: 15, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 15 }}>📤 Share My Garden Story</Text>
      </Pressable>
    </View>
  );
}

function AchievementCard({ theme, badges, streakData, seenGardenGod, setSeenGardenGod }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newlyUnlockedId, setNewlyUnlockedId] = useState(null);
  const [showGardenGodCelebration, setShowGardenGodCelebration] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  const categories = ["All", ...Array.from(new Set(badges.map(b => b.category)))];
  const filteredBadges = selectedCategory === "All" ? badges : badges.filter(b => b.category === selectedCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const categoryStats = Array.from(new Set(badges.map(b => b.category))).map(cat => ({
    category: cat,
    unlocked: badges.filter(b => b.category === cat && b.unlocked).length,
    total: badges.filter(b => b.category === cat).length,
  }));

return (
    <View>

{/* GARDEN GNOME CELEBRATION */}
{showGardenGodCelebration ? (
  <Pressable
    onPress={() => setShowGardenGodCelebration(false)}
    style={styles.gardenGodOverlay}
  >
    <ConfettiBurst />
    <View style={styles.gardenGodCard}>
      <Text style={styles.gardenGodEmoji}>🌟</Text>
      <Text style={styles.gardenGodEyebrow}>SECRET ACHIEVEMENT UNLOCKED</Text>
      <Text style={styles.gardenGodTitle}>The Garden Gnome</Text>
      <Text style={styles.gardenGodText}>
        You've mastered every corner of Pocket Planter. Every plant saved, every photo logged, every quest completed, every level climbed.
      </Text>
      <Text style={styles.gardenGodText2}>
        You are a true Garden Gnome. 🌟
      </Text>
      <View style={styles.gardenGodBadge}>
        <Text style={styles.gardenGodBadgeText}>🏆 One of the greatest gardeners alive!!!</Text>
      </View>
      <Text style={styles.gardenGodDismiss}>Tap anywhere to close</Text>
    </View>
  </Pressable>
) : null}

{/* OVERALL PROGRESS */}
      <View style={styles.achievementOverallProgress}>
        <View style={styles.achievementOverallLeft}>
          <Text style={styles.achievementOverallValue}>{unlockedCount}/{totalCount}</Text>
          <Text style={[styles.achievementOverallLabel, { color: theme.secondaryText }]}>Achieved</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.achievementOverallTrack}>
            <View style={[styles.achievementOverallFill, { width: `${completionPercent}%` }]} />
          </View>
          <Text style={styles.achievementOverallPercent}>{completionPercent}% complete</Text>
        </View>
        <Text style={styles.achievementStreakBadge}>🔥 {streakData?.count || 0} day streak</Text>
      </View>

      {/* CATEGORY STATS ROW */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementCategoryStatsScroll}>
        {categoryStats.map((cat, i) => (
          <Pressable
            key={i}
            onPress={() => setSelectedCategory(selectedCategory === cat.category ? "All" : cat.category)}
            style={[styles.achievementCategoryStatTile, {
              borderColor: selectedCategory === cat.category ? "#5cff89" : "rgba(255,255,255,0.08)",
              backgroundColor: selectedCategory === cat.category ? "rgba(92,255,137,0.12)" : "rgba(255,255,255,0.05)",
            }]}
          >
            <Text style={styles.achievementCategoryStatIcon}>{cat.category.split(" ")[0]}</Text>
            <Text style={[styles.achievementCategoryStatValue, { color: cat.unlocked === cat.total ? "#5cff89" : "#ffffff" }]}>
              {cat.unlocked}/{cat.total}
            </Text>
            <Text style={[styles.achievementCategoryStatLabel, { color: theme.secondaryText }]}>
              {cat.category.split(" ").slice(1).join(" ")}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* FILTER TABS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementFilterScroll}>
        {categories.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.achievementFilterPill, selectedCategory === cat && styles.achievementFilterPillActive]}
          >
            <Text style={[styles.achievementFilterPillText, selectedCategory === cat && styles.achievementFilterPillTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ACHIEVEMENT GRID */}
      <View style={styles.achievementCompactGrid}>
        {filteredBadges.map((badge) => (
          <Pressable
            key={badge.id}
            onPress={() => {
  if (badge.unlocked) {
    if (badge.id === "garden_gnome_ultimate") {
      if (!seenGardenGod) {
        setShowGardenGodCelebration(true);
        setSeenGardenGod(true);
        Vibration.vibrate([0, 100, 80, 100, 80, 200]);
      } else {
        setNewlyUnlockedId(badge.id === newlyUnlockedId ? null : badge.id);
        Vibration.vibrate(40);
      }
    } else {
      setNewlyUnlockedId(badge.id === newlyUnlockedId ? null : badge.id);
      Vibration.vibrate(40);
    }
  }
}}
            style={[
              styles.achievementCompactCard,
              badge.unlocked && styles.achievementCompactCardUnlocked,
              badge.id === newlyUnlockedId && { borderColor: "#ffd86b", borderWidth: 2 },
            ]}
          >
            {/* GLOW FOR UNLOCKED */}
            {badge.unlocked ? (
              <Animated.View style={[styles.achievementGlowOrb, { opacity: glowOpacity, backgroundColor: "#5cff89" }]} />
            ) : null}

            {/* ICON */}
            <View style={[styles.achievementIconWrap, {
              backgroundColor: badge.unlocked ? "rgba(92,255,137,0.18)" : "rgba(255,255,255,0.06)",
            }]}>
              <Text style={styles.achievementCompactIcon}>{badge.icon}</Text>
              {!badge.unlocked ? (
                <View style={styles.achievementLockOverlay}>
                  <Text style={styles.achievementLockIcon}>🔒</Text>
                </View>
              ) : null}
            </View>

            {/* TITLE */}
            <Text style={[styles.achievementCompactTitle, { color: badge.unlocked ? "#ffffff" : "#8fbf9d" }]} numberOfLines={2}>
              {badge.title}
            </Text>

            {/* TEXT */}
            <Text style={styles.achievementCompactText} numberOfLines={2}>
              {badge.text}
            </Text>

            {/* PROGRESS BAR */}
            {badge.goal ? (
              <View style={styles.achievementProgressTrack}>
                <View style={[styles.achievementProgressFill, {
                  width: `${Math.min(((badge.progress || 0) / badge.goal) * 100, 100)}%`,
                  backgroundColor: badge.unlocked ? "#5cff89" : "rgba(255,255,255,0.25)",
                }]} />
              </View>
            ) : null}

            {/* PROGRESS FRACTION */}
            {badge.goal ? (
              <Text style={[styles.achievementProgressFraction, { color: badge.unlocked ? "#5cff89" : theme.secondaryText }]}>
                {badge.progress}/{badge.goal}
              </Text>
            ) : null}

            {/* UNLOCKED CHECK */}
            {badge.unlocked ? (
              <View style={styles.achievementCompactCheck}>
                <Text style={styles.achievementCompactCheckText}>✓</Text>
              </View>
            ) : null}

            {/* SELECTED GLOW RING */}
            {badge.id === newlyUnlockedId ? (
              <View style={styles.achievementSelectedRing} />
            ) : null}
          </Pressable>
        ))}
      </View>

      {/* COMPLETION MESSAGE */}
      {unlockedCount === totalCount ? (
        <View style={styles.achievementAllDoneBox}>
          <Text style={styles.achievementAllDoneEmoji}>🌟</Text>
          <Text style={styles.achievementAllDoneTitle}>All Achievements Unlocked!</Text>
          <Text style={[styles.achievementAllDoneText, { color: theme.secondaryText }]}>
            You're a true Garden Master. Incredible work! 🏆
          </Text>
        </View>
      ) : (
        <View style={styles.achievementFooter}>
          <Text style={[styles.achievementFooterText, { color: theme.secondaryText }]}>
            {totalCount - unlockedCount} achievement{totalCount - unlockedCount === 1 ? "" : "s"} remaining — keep growing! 🌱
          </Text>
        </View>
      )}
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
  if (!plants.length) return (
    <View style={styles.emptyStateCard}>
      <Text style={styles.emptyStateIcon}>🌱</Text>
      <Text style={styles.emptyStateTitle}>No plants for your zone yet</Text>
      <Text style={styles.emptyStateText}>
        {zone
          ? `We couldn't find plants matched to Zone ${zone} right now. Try browsing all plants on the Plants tab.`
          : "Set your ZIP code on the Home tab to see plants matched to your growing zone."}
      </Text>
    </View>
  );
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
  successHaptic();
  Alert.alert("Template Applied 🌱", "Your garden layout has been filled with saved plants.");
}

function CropRotationCard({ theme, gardenAreas, areaHistory }) {
  const now = new Date();
  const thisYear = now.getFullYear();

  // For each area, compare what's planted now against last year's families.
  const warnings = [];
  (gardenAreas || []).forEach((area) => {
    const history = Array.isArray(areaHistory?.[area.id]) ? areaHistory[area.id] : [];
    if (!history.length) return;
    // Families currently planted in this bed.
    const currentFamilies = new Set(
      Object.values(area.plots || {})
        .filter(Boolean)
        .map((name) => getPlantFamily(name))
        .filter(Boolean)
    );
    currentFamilies.forEach((family) => {
      // Did the SAME family grow here in a PRIOR year?
      const priorYear = history.find((e) => e.family === family && e.year < thisYear);
      if (priorYear) {
        warnings.push({ areaName: area.name, family, lastYear: priorYear.year });
      }
    });
  });

  if (!warnings.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#ffd86b" }]}>
      <Text style={styles.cardEyebrow}>🔄 CROP ROTATION</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Rotate to Protect Your Soil</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {warnings.length} bed{warnings.length === 1 ? "" : "s"} {warnings.length === 1 ? "has" : "have"} the same plant family as a past year. Rotating families each season helps avoid soilborne disease and pest buildup.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {warnings.map((w, i) => (
          <View
            key={`rotation-${w.areaName}-${w.family}-${i}`}
            style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,216,107,0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255,216,107,0.22)" }}
          >
            <Text style={{ fontSize: 22 }}>🔄</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{w.areaName}</Text>
              <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                {w.family} grew here in {w.lastYear} — try a different family this season
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Good rotations: follow legumes with leafy greens, brassicas with roots, nightshades with legumes.
      </Text>
    </View>
  );
}
function getPowerPairs(gardenAreas) {
  const pairs = [];
  const seen = new Set();
  (gardenAreas || []).forEach((area) => {
    const plants = Array.from(
      new Set(Object.values(area.plots || {}).filter(Boolean))
    );
    for (let i = 0; i < plants.length; i += 1) {
      for (let j = i + 1; j < plants.length; j += 1) {
        const a = plants[i];
        const b = plants[j];
        const result = getCompatibilityScore(a, b);
        if (result && result.label === "Excellent Pair") {
          const key = [a, b].sort().join("|");
          if (!seen.has(key)) {
            seen.add(key);
            pairs.push({ a, b, areaName: area.name });
          }
        }
      }
    }
  });
  return pairs.slice(0, 6);
}
function PowerPairsCard({ theme, gardenAreas, onOpenPlant }) {
  const pairs = getPowerPairs(gardenAreas);
  if (!pairs.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "rgba(92,255,137,0.30)" }]}>
      <Text style={styles.cardEyebrow}>🟢 POWER PAIRS</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Great Companions You're Growing</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        These plants share a bed and genuinely help each other — better growth, pest deterrence, or smarter use of space. Nice work.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {pairs.map(({ a, b, areaName }, i) => {
          const itemA = produceData.find((p) => p.name === a);
          const itemB = produceData.find((p) => p.name === b);
          const imgA = itemA ? resolvePlantImageSource(itemA) : null;
          const imgB = itemB ? resolvePlantImageSource(itemB) : null;
          return (
            <View
              key={`pair-${a}-${b}-${i}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(92,255,137,0.07)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => itemA && onOpenPlant(itemA)} style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 2 }}>
                  {imgA ? <Image source={imgA} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                </Pressable>
                <Pressable onPress={() => itemB && onOpenPlant(itemB)} style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", marginLeft: -10, borderWidth: 2, borderColor: theme.card }}>
                  {imgB ? <Image source={imgB} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                </Pressable>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{a} + {b}</Text>
                <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                  🟢 Great pairing in {areaName}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
function FixMyGardenCard({ theme, gardenAreas, onOpenPlant }) {
  const conflicts = findGardenConflicts(gardenAreas);
  if (!conflicts.length) return null;

return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Companion Conflicts to Resolve</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {conflicts.length} pair{conflicts.length === 1 ? "" : "s"} of plants in your beds don't grow well together — they can compete for nutrients or attract the same pests. Moving one to another bed usually fixes it.
      </Text>

      <View style={{ gap: 10, marginTop: 16 }}>
        {conflicts.map((c, i) => {
          const plantAObj = produceData.find((p) => p.name === c.plantA);
          const plantBObj = produceData.find((p) => p.name === c.plantB);
          const imgA = plantAObj ? resolvePlantImageSource(plantAObj) : null;
          const imgB = plantBObj ? resolvePlantImageSource(plantBObj) : null;
          return (
            <View
              key={`conflict-${c.areaId}-${i}`}
              style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(255,123,123,0.22)" }}
            >
              {/* the conflicting pair */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Pressable onPress={() => plantAObj && onOpenPlant(plantAObj)} style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {imgA ? <Image source={imgA} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </View>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", flexShrink: 1 }}>{c.plantA}</Text>
                </Pressable>

                <Text style={{ color: "#ff7b7b", fontSize: 18, fontWeight: "900" }}>✕</Text>

                <Pressable onPress={() => plantBObj && onOpenPlant(plantBObj)} style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", flexShrink: 1, textAlign: "right" }}>{c.plantB}</Text>
                  <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {imgB ? <Image source={imgB} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </View>
                </Pressable>
              </View>

              {/* location + advice */}
              <View style={{ marginTop: 10, backgroundColor: "rgba(0,0,0,0.18)", borderRadius: 12, padding: 10 }}>
                <Text style={{ color: "#ffb3b3", fontSize: 12, fontWeight: "900" }}>
                  📍 Both in: {c.areaName}
                </Text>
                <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 4 }}>
                  {c.suggestion
                    ? `Tip: move ${c.suggestion.move} to ${c.suggestion.toAreaName} — it has room and no conflicts there.`
                    : `Tip: move ${c.plantA} or ${c.plantB} to a different bed to give them space.`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Based on companion planting guidelines. Rearrange in your Garden planner.
      </Text>
    </View>
  );
}

function SunlightMismatchCard({ theme, gardenAreas, onOpenPlant }) {
  // Only consider areas the user has actually tagged with a sun level.
  const tagged = (gardenAreas || []).filter((a) => a.sunExposure);
  if (!tagged.length) return null;

  const mismatches = [];
  const seen = new Set(); // de-dupe by plant+area so repeated plots don't stack
  tagged.forEach((area) => {
    const names = Array.from(new Set(Object.values(area.plots || {}).filter(Boolean)));
    names.forEach((name) => {
      const plant = produceData.find((p) => p.name === name);
      if (!plant) return;
      const warn = getSunMismatch(plant, area.sunExposure);
      if (!warn) return;
      const key = `${area.id}-${name}`;
      if (seen.has(key)) return;
      seen.add(key);
      mismatches.push({ plant, areaName: area.name, areaSun: area.sunExposure, ...warn });
    });
  });

  if (!mismatches.length) return null;

  // Sort worst-first: high > medium > low.
  const rank = { high: 0, medium: 1, low: 2 };
  mismatches.sort((a, b) => rank[a.level] - rank[b.level]);

  const sunLabel = { full: "☀️ Full sun", partial: "⛅ Partial", shade: "🌥️ Shade" };
  const levelColor = { high: "#ff7b7b", medium: "#ffd86b", low: "#8effab" };
  const hasHigh = mismatches.some((m) => m.level === "high");
  const accent = hasHigh ? "#ff7b7b" : "#ffd86b";

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: accent }]}>
      <Text style={styles.cardEyebrow}>☀️ SUNLIGHT CHECK</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Sun Placement Warnings</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {mismatches.length} plant{mismatches.length === 1 ? "" : "s"} may be in the wrong light for the bed {mismatches.length === 1 ? "it's" : "they're"} planted in.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {mismatches.map((m) => {
          const img = resolvePlantImageSource(m.plant);
          return (
            <Pressable
              key={`sun-${m.areaName}-${m.plant.name}`}
              onPress={() => onOpenPlant && onOpenPlant(m.plant)}
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: `${levelColor[m.level]}30` }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{m.plant.name}</Text>
                  <View style={{ backgroundColor: `${levelColor[m.level]}22`, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: levelColor[m.level], fontSize: 10, fontWeight: "900" }}>
                      {m.level === "high" ? "NEEDS FIXING" : m.level === "medium" ? "WATCH" : "MINOR"}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 3 }}>
                  {m.areaName} · {sunLabel[m.areaSun]}
                </Text>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 5 }}>
                  {m.text}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function GardenShoppingListCard({ theme, gardenAreas, zip }) {
  const plantNames = Array.from(new Set(
    (gardenAreas || []).flatMap((a) => Object.values(a.plots || {}).filter(Boolean))
  ));
  if (!plantNames.length) return null;

  const shareList = async () => {
    try {
      tapHaptic("light");
      const lines = [
        "🛒 My Pocket Planter shopping list:",
        "",
        ...plantNames.map((n) => `• ${n} seeds`),
        "• Compost / potting mix",
        "• Balanced fertilizer",
        "• Mulch",
        "",
        "Planned in Pocket Planter 🌱",
      ];
      await Share.share({ message: lines.join("\n") });
    } catch (e) { console.log("Share list skipped:", e); }
  };

  return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {plantNames.map((name) => (
          <View key={name} style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
            <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "900", marginBottom: 8 }}>{name}</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(name + " seeds")}`)}
                style={{ flex: 1, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>🌱 Seeds</Text>
              </Pressable>
              <Pressable onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(name + " fertilizer")}`)}
                style={{ flex: 1, backgroundColor: "rgba(255,216,107,0.10)", borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,216,107,0.22)" }}>
                <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900" }}>🌾 Fertilizer</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 14, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800", lineHeight: 20 }}>
          🧺 Don't forget the basics: compost or potting mix, a balanced fertilizer, and mulch.
        </Text>
      </View>
      <Pressable onPress={shareList} style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>📤 Share / Copy List</Text>
      </Pressable>
    </View>
  );
}
function GardenAreaManager({ theme, gardenAreas, onAddArea, onRenameArea, onDeleteArea, onSetAreaStyle }) {
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaSize, setNewAreaSize] = useState(6);
  const [showCreator, setShowCreator] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [stylingId, setStylingId] = useState(null);

  const EMOJI_CHOICES = ["🌿", "🌻", "🪴", "🍅", "🌸", "🏡", "🌵", "🍓", "🥬", "🌽", "🌶️", "🫐"];
  const COLOR_CHOICES = ["#5cff89", "#ffd86b", "#8effab", "#ff7b7b", "#ffb6c1", "#6bc7ff", "#a3d5ff", "#ff9f43"];

  const PRESETS = ["Front Yard", "Backyard", "Balcony", "Indoors", "Raised Bed", "Herb Garden"];
  const usedNames = gardenAreas.map((a) => a.name.toLowerCase());

 return (
    <View>
      <Pressable
        onPress={() => setShowCreator((v) => !v)}
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)", marginTop: 4, marginBottom: showCreator ? 14 : 0 }}
      >
        <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>{showCreator ? "Hide Garden Maps" : "🗂️ View Garden Maps"}</Text>
        <Text style={{ color: "#5cff89", fontSize: 18, fontWeight: "900" }}>{showCreator ? "▾" : "▸"}</Text>
      </Pressable>

      {showCreator ? (
      <>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {PRESETS.filter((p) => !usedNames.includes(p.toLowerCase())).map((preset) => (
          <Pressable
            key={preset}
            onPress={() => onAddArea(preset)}
            style={{ backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
          >
            <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800" }}>+ {preset}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => onAddArea("Hanging Planter", 1)}
        style={{ alignSelf: "flex-start", marginTop: 12, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
      >
        <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800" }}>+ Hanging Planter (1 plant)</Text>
      </Pressable>

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 18, marginBottom: 8 }}>HOW MANY PLANTS? ({newAreaSize})</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => {
          const selected = newAreaSize === n;
          return (
            <Pressable
              key={n}
              onPress={() => setNewAreaSize(n)}
              style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: selected ? "#5cff89" : "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: selected ? "#5cff89" : "rgba(255,255,255,0.12)" }}
            >
              <Text style={{ color: selected ? "#07120b" : theme.secondaryText, fontSize: 15, fontWeight: "900" }}>{n}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
        <TextInput
          value={newAreaName}
          onChangeText={setNewAreaName}
          placeholder="Or type a custom area name..."
          placeholderTextColor="#8fbf9d"
          style={[styles.input, { flex: 1, marginTop: 0, backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
        />
        <Pressable
          onPress={() => { onAddArea(newAreaName, newAreaSize); setNewAreaName(""); setNewAreaSize(6); Keyboard.dismiss(); }}
          style={{ backgroundColor: "#5cff89", borderRadius: 18, paddingHorizontal: 18, justifyContent: "center" }}
        >
          <Text style={{ color: "#07120b", fontWeight: "900" }}>Add</Text>
        </Pressable>
      </View>
      </>
      ) : null}

      {false ? (
        <View style={{ marginTop: 16, gap: 10 }}>
          {gardenAreas.map((area) => {
            const plotCount = Object.values(area.plots || {}).filter(Boolean).length;
            const isRenaming = renamingId === area.id;
            return (
              <View key={area.id} style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 12 }}>
               {isRenaming ? (
                  <TextInput
                    value={renameDraft}
                    onChangeText={setRenameDraft}
                    placeholder="New name"
                    placeholderTextColor="#8fbf9d"
                    autoFocus
                    style={{ flex: 1, color: "#ffffff", fontSize: 15, fontWeight: "800", paddingVertical: 4 }}
                  />
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                    <View style={{ width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: `${getAreaTag(area).color}22`, borderWidth: 1, borderColor: `${getAreaTag(area).color}55` }}>
                      <Text style={{ fontSize: 20 }}>{getAreaTag(area).emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "900" }}>{area.name}</Text>
                      <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>{plotCount} plant{plotCount === 1 ? "" : "s"}</Text>
                    </View>
                  </View>
                )}

                {isRenaming ? (
                  <Pressable onPress={() => { onRenameArea(area.id, renameDraft); setRenamingId(null); }} style={{ backgroundColor: "#5cff89", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
                    <Text style={{ color: "#07120b", fontSize: 12, fontWeight: "900" }}>Save</Text>
                  </Pressable>
                ) : (
                  <>
                    <Pressable onPress={() => { setStylingId(stylingId === area.id ? null : area.id); setRenamingId(null); }} style={{ padding: 6 }}>
                      <Text style={{ color: "#ffd86b", fontSize: 13, fontWeight: "900" }}>Tag</Text>
                    </Pressable>
                    <Pressable onPress={() => { setRenamingId(area.id); setRenameDraft(area.name); setStylingId(null); }} style={{ padding: 6 }}>
                      <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900" }}>Rename</Text>
                    </Pressable>
                  </>
                )}
                <Pressable onPress={() => onDeleteArea(area.id)} style={{ padding: 6 }}>
                  <Text style={{ color: "#ff7b7b", fontSize: 16, fontWeight: "900" }}>✕</Text>
                </Pressable>
                </View>

                {stylingId === area.id ? (
                  <View style={{ paddingHorizontal: 12, paddingBottom: 14, paddingTop: 2, gap: 12 }}>
                    <View>
                      <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>EMOJI</Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {EMOJI_CHOICES.map((em) => {
                          const active = getAreaTag(area).emoji === em;
                          return (
                            <Pressable
                              key={`${area.id}-em-${em}`}
                              onPress={() => onSetAreaStyle && onSetAreaStyle(area.id, { emoji: em })}
                              style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: active ? "rgba(92,255,137,0.18)" : "rgba(255,255,255,0.05)", borderWidth: active ? 2 : 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.08)" }}
                            >
                              <Text style={{ fontSize: 20 }}>{em}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                    <View>
                      <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>COLOR</Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                        {COLOR_CHOICES.map((col) => {
                          const active = getAreaTag(area).color === col;
                          return (
                            <Pressable
                              key={`${area.id}-col-${col}`}
                              onPress={() => onSetAreaStyle && onSetAreaStyle(area.id, { color: col })}
                              style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: col, borderWidth: active ? 3 : 0, borderColor: "#ffffff" }}
                            />
                          );
                        })}
                      </View>
                    </View>

<View>
                      <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>SUNLIGHT</Text>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        {[
                          { id: "full", label: "☀️ Full sun" },
                          { id: "partial", label: "⛅ Partial" },
                          { id: "shade", label: "🌥️ Shade" },
                        ].map((opt) => {
                          const active = (area.sunExposure || "full") === opt.id;
                          return (
                            <Pressable
                              key={`${area.id}-sun-${opt.id}`}
                              onPress={() => onSetAreaStyle && onSetAreaStyle(area.id, { sunExposure: opt.id })}
                              style={{ flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center", backgroundColor: active ? "rgba(92,255,137,0.18)" : "rgba(255,255,255,0.05)", borderWidth: active ? 2 : 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.08)" }}
                            >
                              <Text style={{ color: active ? "#8effab" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{opt.label}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    <Pressable onPress={() => setStylingId(null)} style={{ alignSelf: "flex-start", marginTop: 2, backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}>
                      <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900" }}>Done</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

function AreaPlannerMap({ theme, gardenAreas, savedPlants, wateredPlants, onAssignSlot, onClearSlot, onWaterArea, zone, weather, harvestTrackers, onOpenPlant, onPickPhoto, onDeleteArea }) {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [perfectGardenPlant, setPerfectGardenPlant] = useState(null);
  const seenPerfectRef = useRef(new Set());

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem("pp_perfectGardenSeen").then((val) => {
      if (alive && val) {
        try { seenPerfectRef.current = new Set(JSON.parse(val)); } catch (e) {}
      }
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  function maybeShowPerfectGarden(areaId, plantName) {
    if (seenPerfectRef.current.has(areaId)) return;
    const info = getCompanionInfo(plantName) || {};
    const companions = (info.excellent || []).filter((comp) =>
      comp.toLowerCase() !== plantName.toLowerCase() &&
      produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase())
    );
    if (!companions.length) return;
    seenPerfectRef.current.add(areaId);
    AsyncStorage.setItem("pp_perfectGardenSeen", JSON.stringify(Array.from(seenPerfectRef.current))).catch(() => {});
    setPerfectGardenPlant(plantName);
  }

  function addPerfectCompanions(plantName) {
    const area = gardenAreas.find((a) => a.id === selectedAreaId);
    if (!area) { setPerfectGardenPlant(null); return; }
    const info = getCompanionInfo(plantName) || {};
    const existing = Object.values(area.plots || {}).map((p) => getPlantName(p).toLowerCase()).filter(Boolean);
    const companions = (info.excellent || []).filter((comp) =>
      comp.toLowerCase() !== plantName.toLowerCase() &&
      !existing.includes(comp.toLowerCase()) &&
      produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase())
    );
    const areaSize = Math.max(1, Math.min(12, Number(area.size) || 12));
    const emptySlots = [];
    for (let i = 1; i <= areaSize; i++) {
      const slotId = `slot-${i}`;
      if (!getPlantName(area.plots?.[slotId])) emptySlots.push(slotId);
    }
    if (!emptySlots.length) {
      Alert.alert("Garden's full", "There are no empty plots in this bed to add companions to.");
      setPerfectGardenPlant(null);
      return;
    }
    const toAdd = companions.slice(0, emptySlots.length);
    toAdd.forEach((comp, idx) => onAssignSlot(area.id, emptySlots[idx], comp));
    setPerfectGardenPlant(null);
    if (toAdd.length) {
      setTimeout(() => {
        Alert.alert("Companions added! 🌱", `Added ${toAdd.join(", ")} to ${area.name}.`);
      }, 350);
    }
  }

  function getPlantName(plant) { return typeof plant === "string" ? plant : plant?.name || ""; }

  function suggestCompanionsForPlant(areaId, plantName) {
    const area = gardenAreas.find((a) => a.id === areaId);
const bedPlants = Object.values(area?.plots || {}).map((p) => getPlantName(p)).filter(Boolean);
    // Only greet the FIRST plant in a bed — stay quiet for every plant after.
    if (bedPlants.length > 1) return;
    const info = getCompanionInfo(plantName) || {};
    const suggestions = (info.excellent || []).filter((comp) =>
      comp.toLowerCase() !== plantName.toLowerCase() &&
      !bedPlants.some((p) => p.toLowerCase() === comp.toLowerCase()) &&
      produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase())
    );
    if (!suggestions.length) return;
    const list = suggestions.slice(0, 4).join(", ");
    setTimeout(() => {
      Alert.alert(`${plantName} planted! 🌱`, `Pairs well with ${list}. Add ${suggestions.length === 1 ? "it" : "them"} to this bed for a happier garden.`);
    }, 350);
  }

  function choosePlantForSlot(areaId, slotId) {
    const valid = savedPlants.filter(Boolean).map((p) => getPlantName(p)).filter(Boolean);
    if (!valid.length) {
      Alert.alert("Save plants first", "Open a plant card and tap Save, then place it in your garden.");
      return;
    }
    Alert.alert("Choose a plant", "Pick one for this plot.", [
      ...valid.slice(0, 8).map((n) => ({ text: n, onPress: () => { onAssignSlot(areaId, slotId, n); maybeShowPerfectGarden(areaId, n); suggestCompanionsForPlant(areaId, n); } })),
      { text: "Clear plot", style: "destructive", onPress: () => onClearSlot(areaId, slotId) },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  if (!gardenAreas.length) {
    return (
      <View style={styles.gardenMapEmptyState}>
        <Text style={styles.gardenMapEmptyIcon}>🗂️</Text>
        <Text style={styles.gardenMapEmptyTitle}>Create an area first</Text>
        <Text style={styles.gardenMapEmptyText}>Add a garden area above (like Backyard or Balcony), then place your saved plants into it.</Text>
      </View>
    );
  }

 const activeArea = gardenAreas.find((a) => a.id === selectedAreaId) || null;

  if (!activeArea) {
    return (
      <View style={{ gap: 12 }}>
        {gardenAreas.map((area) => {
          const areaPlantCount = Object.values(area.plots || {}).map((p) => getPlantName(p)).filter(Boolean).length;
          const areaPlantList = Object.values(area.plots || {}).map((p) => getPlantName(p)).filter(Boolean);
          let totalPairs = 0, conflictPairs = 0;
          for (let i = 0; i < areaPlantList.length; i++) {
            for (let j = i + 1; j < areaPlantList.length; j++) {
              totalPairs += 1;
              if (getCompatibilityScore(areaPlantList[i], areaPlantList[j]).label === "Avoid") conflictPairs += 1;
            }
          }
          const areaPct = totalPairs > 0 ? Math.round(((totalPairs - conflictPairs) / totalPairs) * 100) : 100;
          const areaHasConflict = conflictPairs > 0;
          return (
            <Pressable
              key={area.id}
              onPress={() => setSelectedAreaId(area.id)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
            >
              {area.photo ? (
                <Image source={{ uri: area.photo }} style={{ width: 48, height: 48, borderRadius: 13, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }} />
              ) : (
                <View style={{ width: 48, height: 48, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: `${getAreaTag(area).color}22`, borderWidth: 1, borderColor: `${getAreaTag(area).color}55` }}>
                  <Text style={{ fontSize: 22 }}>{(getAreaTag(area).emoji || "").trim() || "📷"}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900" }}>{area.name}</Text>
               <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>{areaPlantCount} planted</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: areaHasConflict ? "rgba(255,123,123,0.12)" : "rgba(92,255,137,0.12)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: areaHasConflict ? "rgba(255,123,123,0.28)" : "rgba(92,255,137,0.28)" }}>
                <Text style={{ fontSize: 12 }}>{areaHasConflict ? "⚠️" : "✓"}</Text>
                <Text style={{ color: areaHasConflict ? "#ff9b9b" : "#5cff89", fontSize: 13, fontWeight: "900" }}>{areaPct}%</Text>
              </View>
              <Text style={{ color: "#5cff89", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

 return (
    <View style={{ gap: 20 }}>
      <Modal visible={!!perfectGardenPlant} transparent animationType="fade" onRequestClose={() => setPerfectGardenPlant(null)}>
        <Pressable onPress={() => setPerfectGardenPlant(null)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.82)", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Pressable onPress={() => {}} style={{ width: "100%", maxWidth: 420, backgroundColor: "#0d1f14", borderRadius: 28, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)", padding: 22 }}>
            {(() => {
              if (!perfectGardenPlant) return null;
              const info = getCompanionInfo(perfectGardenPlant) || {};
              const companions = (info.excellent || []).filter((comp) =>
                comp.toLowerCase() !== perfectGardenPlant.toLowerCase() &&
                produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase())
              ).slice(0, 5);
              const tiles = [perfectGardenPlant, ...companions];
              return (
                <>
                  <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 4 }}>🌱 PERFECT GARDEN</Text>
                  <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", marginBottom: 6 }}>A dream bed with {perfectGardenPlant}</Text>
                  <Text style={{ color: "#8fbf9d", fontSize: 13, fontWeight: "700", lineHeight: 19, marginBottom: 16 }}>Here's how {perfectGardenPlant} thrives — surrounded by its best companions. Tap anywhere to close and build your own.</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                    {tiles.map((name, i) => {
                      const pd = produceData.find((p) => p.name.toLowerCase() === name.toLowerCase());
                      const img = pd ? resolvePlantImageSource(pd) : null;
                      const isCenter = i === 0;
                      return (
                        <View key={`${name}-${i}`} style={{ width: "30%", aspectRatio: 1, borderRadius: 16, alignItems: "center", justifyContent: "center", padding: 6, backgroundColor: isCenter ? "rgba(92,255,137,0.16)" : "rgba(255,255,255,0.06)", borderWidth: isCenter ? 2 : 1, borderColor: isCenter ? "#5cff89" : "rgba(255,255,255,0.12)" }}>
                          {img ? <Image source={img} style={{ width: 40, height: 40 }} resizeMode="contain" /> : <Text style={{ fontSize: 26 }}>🌱</Text>}
                          <Text numberOfLines={1} style={{ color: isCenter ? "#8effab" : "#ffffff", fontSize: 11, fontWeight: "800", marginTop: 4 }}>{name}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <Pressable
                    onPress={() => addPerfectCompanions(perfectGardenPlant)}
                    style={{ backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center", marginBottom: 10 }}
                  >
                    <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>Add these to my garden</Text>
                  </Pressable>
                  <Pressable onPress={() => setPerfectGardenPlant(null)} style={{ paddingVertical: 10, alignItems: "center" }}>
                    <Text style={{ color: "#8fbf9d", fontSize: 14, fontWeight: "800" }}>Maybe later</Text>
                  </Pressable>
                </>
              );
            })()}
          </Pressable>
        </Pressable>
      </Modal>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable
          onPress={() => setSelectedAreaId(null)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingVertical: 6 }}
        >
          <Text style={{ color: "#5cff89", fontSize: 15, fontWeight: "900" }}>‹ All gardens</Text>
        </Pressable>
      </View>
      {gardenAreas.filter((area) => area.id === selectedAreaId).map((area) => {
        const areaSize = Math.max(1, Math.min(12, Number(area.size) || 12));
        const PLOTS_PER_AREA = Array.from({ length: areaSize }, (_, i) => `slot-${i + 1}`);
        const areaPlants = Object.values(area.plots || {}).map((p) => getPlantName(p)).filter(Boolean);
        return (
         <View key={area.id}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                <Pressable onPress={() => onPickPhoto && onPickPhoto(area.id)}>
                  {area.photo ? (
                    <Image source={{ uri: area.photo }} style={{ width: 40, height: 40, borderRadius: 11, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }} />
                  ) : (
                    <View style={{ width: 40, height: 40, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: `${getAreaTag(area).color}22`, borderWidth: 1, borderColor: `${getAreaTag(area).color}55` }}>
                      <Text style={{ fontSize: 18 }}>{(getAreaTag(area).emoji || "").trim() || "📷"}</Text>
                    </View>
                  )}
                </Pressable>
                <Text style={{ color: "#ffffff", fontSize: 17, fontWeight: "900", flex: 1 }}>
                  {area.name} <Text style={{ color: "#8fbf9d", fontSize: 13, fontWeight: "700" }}>· {areaPlants.length} planted</Text>
                </Text>
                </View>
              {areaPlants.length > 0 && onWaterArea ? (
                <Pressable
                  onPress={() => onWaterArea(area.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Water all plants in ${area.name}`}
                  style={{ backgroundColor: "rgba(107,199,255,0.14)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(107,199,255,0.28)" }}
                >
                  <Text style={{ color: "#6bc7ff", fontSize: 13, fontWeight: "900" }}>💧 Water bed</Text>
                </Pressable>
              ) : null}
            </View>
            {areaPlants.length > 0 ? (() => {
              const today = getTodayKey();
              const needWater = areaPlants.filter((n) => wateredPlants?.[n] !== today).length;
              let conflicts = 0;
              for (let i = 0; i < areaPlants.length; i++) {
                for (let j = i + 1; j < areaPlants.length; j++) {
                  const a = areaPlants[i], b = areaPlants[j];
                  if (
                    getCompatibilityScore(a, b).label === "Avoid" ||
                    getCompatibilityScore(b, a).label === "Avoid"
                  ) conflicts += 1;
                }
              }
              const stats = [
                { icon: "🌱", value: areaPlants.length, label: "plants", color: "#8effab" },
                { icon: "💧", value: needWater, label: "need water", color: needWater > 0 ? "#6bc7ff" : "#8fbf9d" },
                { icon: conflicts > 0 ? "⚠️" : "✓", value: conflicts, label: "conflicts", color: conflicts > 0 ? "#ff7b7b" : "#5cff89" },
              ];
              return (
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                  {stats.map((s) => (
                    <View key={s.label} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                      <Text style={{ fontSize: 13 }}>{s.icon}</Text>
                      <Text style={{ color: s.color, fontSize: 14, fontWeight: "900" }}>{s.value}</Text>
                      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700" }}>{s.label}</Text>
                    </View>
                  ))}
                </View>
              );
            })() : null}
            <View style={styles.gardenGrid}>
              {PLOTS_PER_AREA.map((slotId) => {
                const plantName = getPlantName(area.plots?.[slotId]);
                const plant = produceData.find((item) => item?.name === plantName);
                const imageSource = plant ? resolvePlantImageSource(plant) : null;
                const hasConflict = plantName && areaPlants.some((c) => c !== plantName && getCompatibilityScore(plantName, c).label === "Avoid");
                const hasExcellent = plantName && areaPlants.some((c) => c !== plantName && getCompatibilityScore(plantName, c).label === "Excellent Pair");
                const needsWater = plantName && wateredPlants?.[plantName] !== getTodayKey();
                return (
                  <Pressable
                    key={`${area.id}-${slotId}`}
                    onPress={() => choosePlantForSlot(area.id, slotId)}
                    style={[styles.gardenSlotV2, {
                      backgroundColor: plantName
                        ? hasConflict ? "rgba(255,123,123,0.10)" : hasExcellent ? "rgba(92,255,137,0.12)" : "rgba(255,255,255,0.07)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: hasConflict ? "#ff7b7b" : hasExcellent ? "#5cff89" : needsWater && plantName ? "#6bc7ff" : "rgba(255,255,255,0.10)",
                      borderWidth: 1,
                    }]}
                  >
                    {imageSource ? (
                      <View style={styles.gardenSlotImageWrapV2}>
                        <Image source={imageSource} style={styles.gardenSlotImageV2} resizeMode="contain" />
                      </View>
                    ) : (
                      <View style={styles.gardenSlotEmptyIcon}>
                        <Text style={styles.gardenSlotEmptyText}>＋</Text>
                      </View>
                    )}
                    <Text numberOfLines={2} style={[styles.gardenSlotLabelV2, { color: plantName ? "#ffffff" : "#5cff89" }]}>
                      {plantName || "Empty"}
                    </Text>
                    {hasConflict ? <Text style={styles.gardenSlotWarningV2}>⚠</Text> : hasExcellent ? <Text style={styles.gardenSlotGoodV2}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </View>
            {(() => {
              const unique = Array.from(new Set(areaPlants));
              if (unique.length < 2) return null;
              const pairs = [];
              for (let i = 0; i < unique.length; i++) {
                for (let j = i + 1; j < unique.length; j++) {
                  const a = unique[i];
                  const b = unique[j];
                  const score = getCompatibilityScore(a, b);
                  if (score.label === "Neutral") continue;
                  pairs.push({ a, b, score });
                }
              }
              if (!pairs.length) return null;
              // Conflicts first — those are the ones worth acting on.
              pairs.sort((x, y) => (x.score.label === "Avoid" ? -1 : 1) - (y.score.label === "Avoid" ? -1 : 1));
              const top = pairs.slice(0, 5);
              return (
                <View style={{ marginTop: 12, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                  <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 4 }}>🤝 IN THIS BED</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>
                    How the plants in {area.name} get along.
                  </Text>
                  <View style={{ gap: 8 }}>
                    {top.map(({ a, b, score }) => {
                      const isGood = score.label === "Excellent Pair";
                      const plantA = produceData.find((pd) => pd.name.toLowerCase() === a.toLowerCase());
                      const plantB = produceData.find((pd) => pd.name.toLowerCase() === b.toLowerCase());
                      const imgA = plantA ? resolvePlantImageSource(plantA) : null;
                      const imgB = plantB ? resolvePlantImageSource(plantB) : null;
                      return (
                        <View
                          key={`${area.id}-pair-${a}-${b}`}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            backgroundColor: isGood ? "rgba(92,255,137,0.08)" : "rgba(255,123,123,0.08)",
                            borderRadius: 14,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            borderWidth: 1,
                            borderColor: isGood ? "rgba(92,255,137,0.20)" : "rgba(255,123,123,0.22)",
                          }}
                        >
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                            {imgA ? <Image source={imgA} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                            <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "900" }}>+</Text>
                            {imgB ? <Image source={imgB} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: isGood ? "#8effab" : "#ff9b9b", fontSize: 13, fontWeight: "800" }}>
                              {a} + {b}
                            </Text>
                            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "600", lineHeight: 15, marginTop: 2 }}>
                              {getPairReason(a, b)}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 15, fontWeight: "900", color: isGood ? "#5cff89" : "#ff7b7b" }}>
                            {isGood ? "✓" : "⚠"}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })()}
            {(() => {
              if (!areaPlants.length) return null;
              const suggestions = [];
              areaPlants.forEach((planted) => {
                const info = getCompanionInfo(planted);
                (info.excellent || []).forEach((comp) => {
                  if (
                    !areaPlants.some((p) => p.toLowerCase() === comp.toLowerCase()) &&
                    produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase()) &&
                    !suggestions.some((s) => s.name.toLowerCase() === comp.toLowerCase())
                  ) {
                    suggestions.push({ name: comp, pairsWith: planted });
                  }
                });
              });
              const top = suggestions.slice(0, 4);
              if (!top.length) return null;
              return (
                <View style={{ width: "100%", marginTop: 12, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}>
                  <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 4 }}>🌱 GREAT COMPANIONS TO ADD</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>
                    These pair well with what you've already planted in {area.name}.
                  </Text>
                 <View style={{ gap: 8 }}>
                    {top.map((s) => {
                      const suggestedPlant = produceData.find((pd) => pd.name.toLowerCase() === s.name.toLowerCase());
                      const suggestedImage = suggestedPlant ? resolvePlantImageSource(suggestedPlant) : null;
                      const partnerPlant = produceData.find((pd) => pd.name.toLowerCase() === s.pairsWith.toLowerCase());
                      const partnerImage = partnerPlant ? resolvePlantImageSource(partnerPlant) : null;
                      return (
                        <Pressable
                          key={`${area.id}-comp-${s.name}`}
                          onPress={() => suggestedPlant && onOpenPlant && onOpenPlant(suggestedPlant)}
                          disabled={!suggestedPlant}
                          accessibilityRole="button"
                          accessibilityLabel={`View care guide for ${s.name}`}
                          style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}
                        >
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                            {partnerImage ? (
                              <Image source={partnerImage} style={{ width: 26, height: 26 }} resizeMode="contain" />
                            ) : <Text style={{ fontSize: 18 }}>🌱</Text>}
                            <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "900" }}>+</Text>
                            {suggestedImage ? (
                              <Image source={suggestedImage} style={{ width: 26, height: 26 }} resizeMode="contain" />
                            ) : <Text style={{ fontSize: 18 }}>🌱</Text>}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800" }}>
                              {s.pairsWith} + {s.name}
                            </Text>
                            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "600", lineHeight: 15, marginTop: 2 }}>
                              {getPairReason(s.pairsWith, s.name)}
                            </Text>
                          </View>
                          {suggestedPlant ? (
                            <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900" }}>›</Text>
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </View>
</View>
              );
            })()}
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Delete garden?",
                  `This will remove "${area.name || "this garden"}" and everything planted in it. This can't be undone.`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => { setSelectedAreaId(null); onDeleteArea && onDeleteArea(area.id); } },
                  ]
                );
              }}
              style={{ marginTop: 20, alignSelf: "stretch", backgroundColor: "rgba(255,123,123,0.10)", borderRadius: 14, paddingVertical: 12, borderTopWidth: 1, borderColor: "rgba(255,123,123,0.25)", alignItems: "center" }}
            >
              <Text style={{ color: "#ff9b9b", fontSize: 14, fontWeight: "900" }}>🗑 Delete garden</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

function GardenPlannerMap({ theme, gardenMap, savedPlants, wateredPlants, onAssign, onClear, zone, weather, harvestTrackers, fertilizerTrackers }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  function getPlantName(plant) { return typeof plant === "string" ? plant : plant?.name || ""; }

  function getSlotInsights(plantName, allPlants) {
    if (!plantName) return null;
    const conflicts = allPlants.filter(p => p !== plantName && getCompatibilityScore(plantName, p).label === "Avoid");
    const pairs = allPlants.filter(p => p !== plantName && getCompatibilityScore(plantName, p).label === "Excellent Pair");
    const wateredToday = wateredPlants?.[plantName] === getTodayKey();
    const plant = produceData.find(item => item?.name === plantName);
    const seasonLabel = plant && zone ? getPlantSeasonLabel(plant, zone) : null;
    const harvestTracker = harvestTrackers?.[plantName];
    const harvestDaysLeft = harvestTracker ? Math.max(0, harvestTracker.days - Math.floor((new Date() - new Date(harvestTracker.startedAt)) / (1000 * 60 * 60 * 24))) : null;
    const fertTracker = fertilizerTrackers?.[plantName];
    const daysSinceFert = fertTracker ? Math.floor((new Date() - new Date(fertTracker.lastFertilized)) / (1000 * 60 * 60 * 24)) : null;
    const weatherAlert =
      weather?.minTempF <= 35 ? { icon: "❄️", text: "Frost risk tonight — cover this plant." } :
      weather?.maxTempF >= 98 ? { icon: "🔥", text: "Heat stress risk — water early today." } :
      weather?.precipChance >= 70 ? { icon: "🌧️", text: "Rain likely — skip watering today." } : null;

    return { conflicts, pairs, wateredToday, seasonLabel, harvestDaysLeft, daysSinceFert, weatherAlert };
  }

  function choosePlantForSlot(slotId) {
    const validPlants = savedPlants.filter(Boolean).map(p => getPlantName(p)).filter(Boolean);
    if (!validPlants.length) {
      Alert.alert("Save plants first", "Open a plant card and tap Save, then you can place it in your garden map.");
      return;
    }
    Alert.alert(
      "Choose a plant",
      "Pick one for this plot.",
      [
        ...validPlants.slice(0, 8).map(n => ({ text: n, onPress: () => { onAssign(slotId, n); setSelectedSlot(slotId); } })),
        { text: "Clear plot", style: "destructive", onPress: () => { onClear(slotId); setSelectedSlot(null); } },
        { text: "Cancel", style: "cancel" },
      ]
    );
  }

  const allPlants = Object.values(gardenMap || {}).map(p => getPlantName(p)).filter(Boolean);
  const filledCount = allPlants.length;
  const conflictCount = allPlants.filter(p => allPlants.some(c => c !== p && getCompatibilityScore(p, c).label === "Avoid")).length;
  const excellentCount = allPlants.filter(p => allPlants.some(c => c !== p && getCompatibilityScore(p, c).label === "Excellent Pair")).length;

  const selectedPlantName = selectedSlot ? getPlantName(gardenMap[selectedSlot]) : null;
  const selectedInsights = selectedPlantName ? getSlotInsights(selectedPlantName, allPlants) : null;

  return (
    <View>
      {/* MAP LEGEND */}
      <View style={styles.gardenLegendRow}>
        <View style={styles.gardenLegendItem}>
          <View style={[styles.gardenLegendDot, { backgroundColor: "#5cff89" }]} />
          <Text style={styles.gardenLegendText}>Great pair ✓</Text>
        </View>
        <View style={styles.gardenLegendItem}>
          <View style={[styles.gardenLegendDot, { backgroundColor: "#ff7b7b" }]} />
          <Text style={styles.gardenLegendText}>Conflict ⚠</Text>
        </View>
        <View style={styles.gardenLegendItem}>
          <View style={[styles.gardenLegendDot, { backgroundColor: "#6bc7ff" }]} />
          <Text style={styles.gardenLegendText}>Needs water 💧</Text>
        </View>
        <View style={styles.gardenLegendItem}>
          <View style={[styles.gardenLegendDot, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <Text style={styles.gardenLegendText}>Empty ＋</Text>
        </View>
      </View>

      {/* QUICK STATS BAR */}
      {filledCount > 0 ? (
        <View style={styles.gardenMapStatsBar}>
          <View style={styles.gardenMapStatPill}>
            <Text style={styles.gardenMapStatValue}>{filledCount}/12</Text>
            <Text style={styles.gardenMapStatLabel}>Plots filled</Text>
          </View>
          <View style={[styles.gardenMapStatPill, { borderColor: excellentCount > 0 ? "rgba(92,255,137,0.35)" : "rgba(255,255,255,0.08)" }]}>
            <Text style={[styles.gardenMapStatValue, { color: excellentCount > 0 ? "#5cff89" : "#d7ebdc" }]}>{excellentCount}</Text>
            <Text style={styles.gardenMapStatLabel}>Great pairs</Text>
          </View>
          <View style={[styles.gardenMapStatPill, { borderColor: conflictCount > 0 ? "rgba(255,123,123,0.35)" : "rgba(255,255,255,0.08)" }]}>
            <Text style={[styles.gardenMapStatValue, { color: conflictCount > 0 ? "#ff7b7b" : "#d7ebdc" }]}>{conflictCount}</Text>
            <Text style={styles.gardenMapStatLabel}>Conflicts</Text>
          </View>
        </View>
      ) : null}

      {/* GRID */}
      <View style={styles.gardenGrid}>
        {GARDEN_SLOTS.map((slot) => {
          const rawPlantName = gardenMap[slot.id];
          const plantName = getPlantName(rawPlantName);
          const plant = produceData.find(item => item?.name === plantName);
          const imageSource = plant ? resolvePlantImageSource(plant) : null;
          const hasConflict = plantName && allPlants.some(c => c !== plantName && getCompatibilityScore(plantName, c).label === "Avoid");
          const hasExcellent = plantName && allPlants.some(c => c !== plantName && getCompatibilityScore(plantName, c).label === "Excellent Pair");
          const needsWater = plantName && wateredPlants?.[plantName] !== getTodayKey();
          const isSelected = selectedSlot === slot.id;
          const harvestTracker = plantName ? harvestTrackers?.[plantName] : null;
          const harvestDaysLeft = harvestTracker ? Math.max(0, harvestTracker.days - Math.floor((new Date() - new Date(harvestTracker.startedAt)) / (1000 * 60 * 60 * 24))) : null;
          const isHarvestReady = harvestDaysLeft === 0;
          const seasonLabel = plant && zone ? getPlantSeasonLabel(plant, zone) : null;
          const isInSeason = seasonLabel === "Plant now";

          return (
            <Pressable
              key={slot.id}
              onPress={() => {
                if (plantName) {
                  setSelectedSlot(isSelected ? null : slot.id);
                } else {
                  choosePlantForSlot(slot.id);
                }
              }}
              onLongPress={() => choosePlantForSlot(slot.id)}
              style={[
                styles.gardenSlotV2,
                {
                  backgroundColor: plantName
                    ? hasConflict ? "rgba(255,123,123,0.10)" : hasExcellent ? "rgba(92,255,137,0.12)" : "rgba(255,255,255,0.07)"
                    : "rgba(255,255,255,0.04)",
                  borderColor: isSelected ? "#ffd86b"
                    : hasConflict ? "#ff7b7b"
                    : hasExcellent ? "#5cff89"
                    : needsWater && plantName ? "#6bc7ff"
                    : "rgba(255,255,255,0.10)",
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              {/* PLANT IMAGE OR PLUS */}
              {imageSource ? (
                <View style={styles.gardenSlotImageWrapV2}>
                  <Image source={imageSource} style={styles.gardenSlotImageV2} resizeMode="contain" />
                </View>
              ) : (
                <View style={styles.gardenSlotEmptyIcon}>
                  <Text style={styles.gardenSlotEmptyText}>＋</Text>
                </View>
              )}

              {/* PLANT NAME */}
              <Text numberOfLines={2} style={[styles.gardenSlotLabelV2, { color: plantName ? "#ffffff" : "#5cff89" }]}>
                {plantName || `Plot ${slot.id.split("-")[1]}`}
              </Text>

              {/* STATUS BADGES */}
              {plantName ? (
                <View style={styles.gardenSlotBadgeRow}>
                  {needsWater ? (
                    <View style={[styles.gardenSlotBadge, { backgroundColor: "rgba(107,199,255,0.18)" }]}>
                      <Text style={[styles.gardenSlotBadgeText, { color: "#6bc7ff" }]}>💧</Text>
                    </View>
                  ) : (
                    <View style={[styles.gardenSlotBadge, { backgroundColor: "rgba(92,255,137,0.18)" }]}>
                      <Text style={[styles.gardenSlotBadgeText, { color: "#5cff89" }]}>✓</Text>
                    </View>
                  )}
                  {isHarvestReady ? (
                    <View style={[styles.gardenSlotBadge, { backgroundColor: "rgba(255,216,107,0.25)" }]}>
                      <Text style={[styles.gardenSlotBadgeText, { color: "#ffd86b" }]}>🎉</Text>
                    </View>
                  ) : null}
                  {isInSeason ? (
                    <View style={[styles.gardenSlotBadge, { backgroundColor: "rgba(92,255,137,0.15)" }]}>
                      <Text style={[styles.gardenSlotBadgeText, { color: "#8effab" }]}>🌱</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {/* CONFLICT / EXCELLENT INDICATOR */}
              {hasConflict ? (
                <Text style={styles.gardenSlotWarningV2}>⚠</Text>
              ) : hasExcellent ? (
                <Text style={styles.gardenSlotGoodV2}>✓</Text>
              ) : null}

              {/* SELECTED INDICATOR */}
              {isSelected ? (
                <View style={styles.gardenSlotSelectedRing} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {/* SELECTED PLOT DETAIL PANEL */}
      {selectedSlot && selectedPlantName && selectedInsights ? (
        <View style={styles.gardenSlotDetailPanel}>
          <View style={styles.gardenSlotDetailHeader}>
            <Text style={styles.gardenSlotDetailTitle}>{selectedPlantName}</Text>
            <Pressable onPress={() => choosePlantForSlot(selectedSlot)} style={styles.gardenSlotChangeButton}>
              <Text style={styles.gardenSlotChangeText}>Change →</Text>
            </Pressable>
          </View>

          {/* SEASON STATUS */}
          {selectedInsights.seasonLabel ? (
            <View style={[styles.gardenSlotInfoRow, {
              backgroundColor: selectedInsights.seasonLabel === "Plant now" ? "rgba(92,255,137,0.12)" : "rgba(255,255,255,0.06)"
            }]}>
              <Text style={styles.gardenSlotInfoIcon}>📅</Text>
              <Text style={styles.gardenSlotInfoText}>Season: {selectedInsights.seasonLabel}</Text>
            </View>
          ) : null}

          {/* WATERING STATUS */}
          <View style={[styles.gardenSlotInfoRow, {
            backgroundColor: selectedInsights.wateredToday ? "rgba(92,255,137,0.10)" : "rgba(107,199,255,0.10)"
          }]}>
            <Text style={styles.gardenSlotInfoIcon}>{selectedInsights.wateredToday ? "✅" : "💧"}</Text>
            <Text style={styles.gardenSlotInfoText}>
              {selectedInsights.wateredToday ? "Watered today" : "Needs water today"}
            </Text>
          </View>

          {/* HARVEST STATUS */}
          {selectedInsights.harvestDaysLeft !== null ? (
            <View style={[styles.gardenSlotInfoRow, {
              backgroundColor: selectedInsights.harvestDaysLeft === 0 ? "rgba(255,216,107,0.15)" : "rgba(255,255,255,0.06)"
            }]}>
              <Text style={styles.gardenSlotInfoIcon}>🚜</Text>
              <Text style={styles.gardenSlotInfoText}>
                {selectedInsights.harvestDaysLeft === 0 ? "🎉 Ready to harvest!" : `Harvest in ~${selectedInsights.harvestDaysLeft} days`}
              </Text>
            </View>
          ) : null}

          {/* FERTILIZER STATUS */}
          {selectedInsights.daysSinceFert !== null ? (
            <View style={[styles.gardenSlotInfoRow, {
              backgroundColor: selectedInsights.daysSinceFert >= 14 ? "rgba(255,216,107,0.12)" : "rgba(255,255,255,0.06)"
            }]}>
              <Text style={styles.gardenSlotInfoIcon}>🌿</Text>
              <Text style={styles.gardenSlotInfoText}>
                {selectedInsights.daysSinceFert >= 14 ? `Due for fertilizer (${selectedInsights.daysSinceFert}d ago)` : `Fertilized ${selectedInsights.daysSinceFert} days ago`}
              </Text>
            </View>
          ) : null}

          {/* WEATHER ALERT */}
          {selectedInsights.weatherAlert ? (
            <View style={[styles.gardenSlotInfoRow, { backgroundColor: "rgba(255,216,107,0.12)" }]}>
              <Text style={styles.gardenSlotInfoIcon}>{selectedInsights.weatherAlert.icon}</Text>
              <Text style={styles.gardenSlotInfoText}>{selectedInsights.weatherAlert.text}</Text>
            </View>
          ) : null}

          {/* COMPANION PAIRS */}
          {selectedInsights.pairs.length > 0 ? (
            <View style={styles.gardenSlotCompanionRow}>
              <Text style={styles.gardenSlotCompanionLabel}>🟢 Great pairs nearby:</Text>
              <View style={styles.gardenSlotPillRow}>
                {selectedInsights.pairs.map(p => (
                  <View key={p} style={[styles.gardenSlotPill, { backgroundColor: "rgba(92,255,137,0.14)", borderColor: "rgba(92,255,137,0.28)" }]}>
                    <Text style={[styles.gardenSlotPillText, { color: "#5cff89" }]}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* CONFLICTS */}
          {selectedInsights.conflicts.length > 0 ? (
            <View style={styles.gardenSlotCompanionRow}>
              <Text style={styles.gardenSlotCompanionLabel}>🔴 Conflicts in your garden:</Text>
              <View style={styles.gardenSlotPillRow}>
                {selectedInsights.conflicts.map(p => (
                  <View key={p} style={[styles.gardenSlotPill, { backgroundColor: "rgba(255,123,123,0.12)", borderColor: "rgba(255,123,123,0.28)" }]}>
                    <Text style={[styles.gardenSlotPillText, { color: "#ff7b7b" }]}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <Pressable onPress={() => { onClear(selectedSlot); setSelectedSlot(null); }} style={styles.gardenSlotClearButton}>
            <Text style={styles.gardenSlotClearText}>🗑 Remove from plot</Text>
          </Pressable>
        </View>
      ) : null}

      {/* EMPTY STATE */}
      {filledCount === 0 ? (
        <View style={styles.gardenMapEmptyState}>
          <Text style={styles.gardenMapEmptyIcon}>🌱</Text>
          <Text style={styles.gardenMapEmptyTitle}>Tap any plot to place a plant</Text>
          <Text style={styles.gardenMapEmptyText}>Pocket Planter will show companion pairing, watering status, harvest countdowns, and weather alerts for each plot.</Text>
        </View>
      ) : null}
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
function ReminderControlCard({ theme, remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn, wateringReminderTime, onChangeWateringTime, plantOfDayOn, onTogglePlantOfDay, onToggleReminders, onToggleFrost, onToggleMonthlyPlanting, onToggleDailyWatering }) {
  const TIME_OPTIONS = [
    { hour: 6, minute: 0 },
    { hour: 7, minute: 0 },
    { hour: 8, minute: 0 },
    { hour: 9, minute: 0 },
    { hour: 12, minute: 0 },
    { hour: 17, minute: 0 },
    { hour: 19, minute: 0 },
  ];
  const pickTime = () => {
    if (!onChangeWateringTime) return;
    Alert.alert(
      "Watering Reminder Time",
      "When should Pocket Planter remind you each day?",
      [
        ...TIME_OPTIONS.map((t) => ({
          text: formatReminderTime(t),
          onPress: () => onChangeWateringTime(t),
        })),
        { text: "Cancel", style: "cancel" },
      ]
    );
  };
  return (
    <View>
      {[{ label: "Watering Reminders!", text: "Add daily reminders from plant pages.", value: remindersOn, onToggle: onToggleReminders }, { label: "Frost Alerts!", text: "Evening reminder to check overnight lows.", value: frostAlertsOn, onToggle: onToggleFrost }, { label: "Monthly Planting Guides!", text: "Reminder on the 1st of every month.", value: monthlyPlantingOn, onToggle: onToggleMonthlyPlanting }, { label: "Daily Watering Check!", text: "Morning reminder to check your garden.", value: dailyWateringOn, onToggle: onToggleDailyWatering }, { label: "Plant of the Day!", text: "Daily plant pick every morning.", value: plantOfDayOn, onToggle: onTogglePlantOfDay }].map((row) => (
        <View key={row.label} style={styles.settingRow}>
          <View style={{ flex: 1, minWidth: 0 }}><Text style={[styles.settingTitle, { color: theme.text }]}>{row.label}</Text><Text style={[styles.settingText, { color: theme.secondaryText }]}>{row.text}</Text></View>
          <Switch value={row.value} onValueChange={row.onToggle} trackColor={{ false: "#314c39", true: "#5cff89" }} thumbColor="#ffffff" />
        </View>
      ))}
      {dailyWateringOn && wateringReminderTime ? (
        <Pressable
          onPress={pickTime}
          accessibilityRole="button"
          accessibilityLabel="Change daily watering reminder time"
          style={{ marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(107,199,255,0.10)", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.24)" }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>⏰ Reminder time</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 3 }}>When your daily watering check arrives</Text>
          </View>
          <View style={{ backgroundColor: "rgba(107,199,255,0.18)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 }}>
            <Text style={{ color: "#6bc7ff", fontSize: 14, fontWeight: "900" }}>{formatReminderTime(wateringReminderTime)}</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}
function PersonalPlantingCalendar({ theme, savedPlants, zone, onOpenPlant }) {
  const saved = produceData.filter((item) => savedPlants.includes(item.name));
  if (!saved.length) return null;

  const currentMonth = new Date().getMonth() + 1;

  // For each month, which saved plants can be planted
  const byMonth = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const plants = saved.filter((item) =>
      Array.isArray(item.plantMonths) && item.plantMonths.includes(monthNum)
    );
    return { monthNum, plants };
  });

  const thisMonthPlants = byMonth[currentMonth - 1]?.plants || [];

return (
    <View>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
      </Text>

      {/* MONTH GRID */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {byMonth.map(({ monthNum, plants }) => {
          const isNow = monthNum === currentMonth;
          const has = plants.length > 0;
          return (
            <View
              key={monthNum}
              style={{
                width: "30%",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: "center",
                backgroundColor: isNow ? "rgba(92,255,137,0.16)" : has ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                borderWidth: 1,
                borderColor: isNow ? "#5cff89" : has ? "rgba(142,255,171,0.16)" : "rgba(255,255,255,0.06)",
              }}
            >
              <Text style={{ fontSize: 18 }}>{getMonthEmoji(monthNum)}</Text>
              <Text style={{ color: isNow ? "#5cff89" : theme.text, fontSize: 12, fontWeight: "900", marginTop: 4 }}>
                {MONTH_NAMES[monthNum - 1].slice(0, 3)}
              </Text>
              <Text style={{ color: has ? "#8effab" : theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 2 }}>
                {has ? `${plants.length} plant${plants.length === 1 ? "" : "s"}` : "—"}
              </Text>
            </View>
          );
        })}
      </View>

      {/* THIS MONTH DETAIL */}
      <View style={{ marginTop: 16, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}>
        <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>
          {getMonthEmoji(currentMonth)} PLANT IN {MONTH_NAMES[currentMonth - 1].toUpperCase()}
        </Text>
        {thisMonthPlants.length ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {thisMonthPlants.map((item) => (
              <Pressable
                key={`cal-${item.name}`}
                onPress={() => onOpenPlant(item)}
                style={{ backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
              >
                <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800" }}>{item.name} ›</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 20 }}>
            None of your saved plants have a planting window this month. Check the highlighted months above for what's coming up.
          </Text>
        )}
      </View>
    </View>
  );
}
function GlowPlantCard({ plant, weather, zone, theme, isSaved, isCompared, isFollowed, isSnoozed, wateredDate, wateredPlants, wateringHistory, onOpen, onSave, onCompare, onFollow, onWater, onSnooze }) {
  const imageSource = resolvePlantImageSource(plant);
  const rarity = RARITY_STYLES[getRarity(plant)];
  const wateredToday = wateredDate === getTodayKey();
  const difficulty = getPlantDifficulty(plant);

  return (
    <Pressable onPress={onOpen} style={[styles.glowPlantCard, { backgroundColor: theme.card, borderColor: "rgba(92,255,137,0.18)" }]}>

      {/* TOP ROW */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <View style={{ width: 80, height: 80, borderRadius: 18, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          {imageSource
            ? <Image source={imageSource} style={{ width: 70, height: 70 }} resizeMode="contain" />
            : <Text style={{ fontSize: 36 }}>🌱</Text>
          }
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text numberOfLines={1} style={{ color: theme.text, fontSize: 20, fontWeight: "900", flex: 1 }}>{plant.name}</Text>
            <View style={{ backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 6 }}>
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>{rarity.emoji}</Text>
            </View>
          </View>
          <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 4 }}>
            {normalizeType(plant.type, plant.name)} • Zones {plant.minZone}–{plant.maxZone}
          </Text>
          <View style={{ flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <View style={{ backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}>
              <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900" }}>{difficulty.icon} {difficulty.label}</Text>
            </View>
            <View style={{ backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: "#d7ebdc", fontSize: 11, fontWeight: "800" }}>🚜 {getHarvestCountdown(plant)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSaved ? `Remove ${plant.name} from saved plants` : `Save ${plant.name}`}
          onPress={(e) => { e.stopPropagation?.(); onSave(); }}
          style={[{ flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
            isSaved ? { backgroundColor: "#5cff89", borderColor: "#5cff89" } : { backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.10)" }
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: isSaved ? "#07120b" : "#ffffff" }}>
            {isSaved ? "✓ Saved" : "Save"}
          </Text>
        </Pressable>

        <Pressable
          onPress={(e) => { e.stopPropagation?.(); onCompare(); }}
          style={[{ flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
            isCompared ? { backgroundColor: "#ffd86b", borderColor: "#ffd86b" } : { backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.10)" }
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: isCompared ? "#07120b" : "#ffffff" }}>
            {isCompared ? "⚔️ On" : "Compare"}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={wateredToday ? `Undo watering for ${plant.name}` : `Mark ${plant.name} as watered today`}
          onPress={(e) => { e.stopPropagation?.(); onWater(); }}
          style={[{ flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
            wateredToday ? { backgroundColor: "#6bc7ff", borderColor: "#6bc7ff" } : { backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.10)" }
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: wateredToday ? "#07120b" : "#ffffff" }}>
            {wateredToday ? "💧 Done" : "Water"}
          </Text>
        </Pressable>
      </View>

      {/* SNOOZE (saved, unwatered plants only) */}
      {isSaved && !wateredToday && onSnooze ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSnoozed ? `${plant.name} snoozed until tomorrow` : `Snooze watering for ${plant.name} until tomorrow`}
          onPress={(e) => { e.stopPropagation?.(); if (!isSnoozed) onSnooze(); }}
          disabled={isSnoozed}
          style={{ marginTop: 8, borderRadius: 14, paddingVertical: 10, alignItems: "center", borderWidth: 1, backgroundColor: isSnoozed ? "rgba(255,216,107,0.10)" : "rgba(255,255,255,0.04)", borderColor: isSnoozed ? "rgba(255,216,107,0.28)" : "rgba(255,255,255,0.08)" }}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: isSnoozed ? "#ffd86b" : "#8fbf9d" }}>
            {isSnoozed ? "😴 Snoozed until tomorrow" : "😴 Snooze until tomorrow"}
          </Text>
        </Pressable>
      ) : null}

     {/* LAST WATERED + STREAK */}
      <View style={{ marginTop: 10, alignItems: "center" }}>
        <Text style={{ color: "#8fbf9d", fontSize: 11, fontWeight: "700" }}>
          💧 {getLastWateredText(plant.name, wateredPlants, wateringHistory)}
        </Text>
        {(() => {
          const nw = getNextWaterInfo(plant.name, plant, wateringHistory, wateredPlants, weather);
          if (!nw || nw.urgency === "ok") return null;
          return (
            <Text style={{ color: nw.urgency === "due" ? "#6bc7ff" : "#8effab", fontSize: 11, fontWeight: "900", marginTop: 2 }}>
              🔮 {nw.label}
            </Text>
          );
        })()}
        {getWateringStreak(plant.name, wateringHistory) >= 2 ? (
          <Text style={{ color: "#ff9f43", fontSize: 11, fontWeight: "900", marginTop: 2 }}>
            🔥 {getWateringStreak(plant.name, wateringHistory)} watering streak
          </Text>
        ) : null}
        {getStreakDaysLeft(plant.name, wateringHistory) ? (
          <Text style={{ color: "#ffd86b", fontSize: 11, fontWeight: "900", marginTop: 2 }}>
            ⏳ {getStreakDaysLeft(plant.name, wateringHistory)} day{getStreakDaysLeft(plant.name, wateringHistory) === 1 ? "" : "s"} left to keep your streak
          </Text>
        ) : null}
      </View>

      {/* VIEW DETAILS */}
      <View style={{ marginTop: 6, alignItems: "center" }}>
        <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900" }}>Tap for full care guide →</Text>
      </View>

    </Pressable>
  );
}
function getPlantHealthStatus({ plantName, wateredPlants, weather }) {
  const wateredToday = wateredPlants?.[plantName] === getTodayKey();
  if (weather?.minTempF <= 35) return { label: "Frost Risk", icon: "❄️", color: "#6bc7ff" };
  if (weather?.maxTempF >= 95 && !wateredToday) return { label: "Heat Stressed", icon: "🔥", color: "#ff7a7a" };
  if (!wateredToday) return { label: "Needs Water", icon: "💧", color: "#ffd86b" };
  return { label: "Healthy", icon: "🌿", color: "#5cff89" };
}
const HARVEST_SOON_DAYS = 7;
function HarvestReadyCard({ theme, harvestTrackers, onOpenPlant }) {
  const entries = Object.entries(harvestTrackers || {})
    .map(([name, tracker]) => {
      const daysPassed = Math.floor((new Date() - new Date(tracker.startedAt)) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, (tracker.days || 0) - daysPassed);
      return { name, daysLeft };
    })
    .filter((e) => e.daysLeft <= HARVEST_SOON_DAYS)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (!entries.length) return null;

  const ready = entries.filter((e) => e.daysLeft === 0);
  const accent = ready.length ? "#ffd86b" : "#8effab";
  const headline = ready.length
    ? `${ready.length} plant${ready.length === 1 ? "" : "s"} ready to harvest!`
    : "Harvest coming up";

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: `${accent}12`, borderColor: accent }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>{ready.length ? "🎉" : "🌾"}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: accent, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>HARVEST TRACKER</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>{headline}</Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {ready.length
          ? "Pick these soon for peak flavor — and to keep your plants producing."
          : "These plants are entering their harvest window. Keep an eye on them."}
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {entries.map((e) => {
          const plant = produceData.find((item) => item.name === e.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          const isReady = e.daysLeft === 0;
          return (
            <Pressable
              key={`harvest-${e.name}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: isReady ? "rgba(255,216,107,0.30)" : "rgba(142,255,171,0.20)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{e.name}</Text>
                <Text style={{ color: isReady ? "#ffd86b" : "#8effab", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  {isReady ? "🎉 Ready to harvest now!" : `⏳ ~${e.daysLeft} day${e.daysLeft === 1 ? "" : "s"} to harvest`}
                </Text>
              </View>
              <Text style={{ color: accent, fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
const RESCUE_THRESHOLD_DAYS = 7;
function RescueModeCard({ theme, savedPlants, wateredPlants, wateringHistory, onOpenPlant, onWater }) {
  const neglected = (savedPlants || [])
    .map((name) => {
      const history = wateringHistory?.[name];
      const lastDate = Array.isArray(history) && history.length
        ? history[history.length - 1]
        : wateredPlants?.[name];
      const days = getDaysSince(lastDate);
      return { name, days, everWatered: !!lastDate };
    })
    .filter((e) => e.everWatered && e.days !== null && e.days >= RESCUE_THRESHOLD_DAYS)
    .sort((a, b) => b.days - a.days);

  if (!neglected.length) return null;

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(255,159,67,0.10)", borderColor: "#ff9f43" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>🚨</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>RESCUE MODE</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {neglected.length} plant{neglected.length === 1 ? "" : "s"} need{neglected.length === 1 ? "s" : ""} attention
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        These haven't been watered in a while. A deep watering and a soil check can bring most plants back.
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {neglected.map((p) => {
          const plant = produceData.find((item) => item.name === p.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          return (
            <View
              key={`rescue-${p.name}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(255,159,67,0.25)" }}
            >
              <Pressable onPress={() => plant && onOpenPlant(plant)} style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{p.name}</Text>
                  <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                    ⏳ {p.days} days since watering
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => onWater(p.name)}
                accessibilityRole="button"
                accessibilityLabel={`Water ${p.name} now`}
                style={{ backgroundColor: "#6bc7ff", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11 }}
              >
                <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>💧 Rescue</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
function EmptyGardenStarterCard({ theme, savedPlants, compatiblePlants, zone, onOpenPlant, onBrowse }) {
  if ((savedPlants || []).length > 0) return null;

  const starters = (compatiblePlants || [])
    .filter((item) => getPlantDifficulty(item).label === "Easy")
    .filter((item) => {
      const label = getPlantSeasonLabel(item, zone);
      return label === "Plant now" || label === "Zone fit";
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 3);

  const picks = starters.length
    ? starters
    : (compatiblePlants || []).filter((item) => getPlantDifficulty(item).label === "Easy").slice(0, 3);

  if (!picks.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <Text style={styles.cardEyebrow}>🌱 GET STARTED</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Your Garden's Looking Bare</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Here are a few beginner-friendly plants that do well in Zone {zone || "your area"}. Save one to start your garden.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {picks.map((item) => {
          const img = resolvePlantImageSource(item);
          const diff = getPlantDifficulty(item);
          return (
            <Pressable
              key={`starter-${item.name}`}
              onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{item.name}</Text>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                  {diff.icon} {diff.text} · {getPlantSeasonLabel(item, zone)}
                </Text>
              </View>
              <Text style={{ color: "#5cff89", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={onBrowse} style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>Browse all plants 🌿</Text>
      </Pressable>
    </View>
  );
}
function WeeklyWateringGrid({ theme, savedPlants, wateringHistory }) {
  if (!savedPlants || savedPlants.length === 0) return null;

  // Build the last 7 days (oldest → today)
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      isToday: i === 0,
    });
  }

  const wateredOn = (plantName, dayKey) => {
    const history = wateringHistory?.[plantName];
    if (!Array.isArray(history)) return false;
    return history.some((d) => String(d).slice(0, 10) === dayKey);
  };

  // Per-day totals across all saved plants
  const dayTotals = days.map((day) =>
    savedPlants.reduce((sum, name) => sum + (wateredOn(name, day.key) ? 1 : 0), 0)
  );
  const weekTotal = dayTotals.reduce((a, b) => a + b, 0);
  const activeDays = dayTotals.filter((n) => n > 0).length;

  // Show up to 6 plants as rows to keep it compact
  const rows = savedPlants.slice(0, 6);

return (
    <View>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {weekTotal > 0
          ? `${weekTotal} watering${weekTotal === 1 ? "" : "s"} across ${activeDays} day${activeDays === 1 ? "" : "s"} this week.`
          : "No waterings logged this week yet — tap a plant to get started."}
      </Text>

      {/* Day header */}
      <View style={{ flexDirection: "row", marginTop: 16, marginBottom: 6 }}>
        <View style={{ width: 90 }} />
        {days.map((day) => (
          <View key={`hdr-${day.key}`} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: day.isToday ? "#6bc7ff" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>
              {day.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Plant rows */}
      <View style={{ gap: 6 }}>
        {rows.map((name) => (
          <View key={`row-${name}`} style={{ flexDirection: "row", alignItems: "center" }}>
            <Text numberOfLines={1} style={{ width: 90, color: theme.text, fontSize: 12, fontWeight: "800", paddingRight: 6 }}>
              {name}
            </Text>
            {days.map((day) => {
              const on = wateredOn(name, day.key);
              return (
                <View key={`${name}-${day.key}`} style={{ flex: 1, alignItems: "center" }}>
                  <View style={{
                    width: 22, height: 22, borderRadius: 7,
                    backgroundColor: on ? "#6bc7ff" : "rgba(255,255,255,0.06)",
                    borderWidth: 1,
                    borderColor: on ? "#6bc7ff" : day.isToday ? "rgba(107,199,255,0.35)" : "rgba(255,255,255,0.08)",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    {on ? <Text style={{ fontSize: 11 }}>💧</Text> : null}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {savedPlants.length > 6 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 10, textAlign: "center" }}>
          Showing 6 of {savedPlants.length} saved plants
        </Text>
      ) : null}
    </View>
  );
}
function WateringRhythmCard({ theme, savedPlants, wateringHistory, onOpenPlant }) {
  const rows = (savedPlants || [])
    .map((name) => {
      const item = produceData.find((p) => p.name === name);
      if (!item) return null;
      const rhythm = getWateringRhythm(name, item, wateringHistory);
      return rhythm ? { name, item, rhythm } : null;
    })
    .filter(Boolean)
    // Show the biggest mismatches first so the useful stuff is on top.
    .sort((a, b) => Math.abs(b.rhythm.diff) - Math.abs(a.rhythm.diff));

  if (!rows.length) return null;

  const STATUS = {
    "on-track": { color: "#5cff89", icon: "✅", label: "On track" },
    under: { color: "#ffd86b", icon: "🌵", label: "Watering less than ideal" },
    over: { color: "#6bc7ff", icon: "💧", label: "Watering more than ideal" },
  };

return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map(({ name, item, rhythm }) => {
          const s = STATUS[rhythm.status];
          const img = resolvePlantImageSource(item);
          const detail =
            rhythm.status === "on-track"
              ? `Every ~${rhythm.avgGap}d · right on its ${rhythm.target}-day target`
              : rhythm.status === "under"
              ? `Every ~${rhythm.avgGap}d · target is ~${rhythm.target}d — try watering a bit sooner`
              : `Every ~${rhythm.avgGap}d · target is ~${rhythm.target}d — you can space it out more`;
          return (
            <Pressable
              key={`rhythm-${name}`}
              onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: `${s.color}30` }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{name}</Text>
                  <Text style={{ color: s.color, fontSize: 11, fontWeight: "900" }}>{s.icon} {s.label}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{detail}</Text>
              </View>
              <Text style={{ color: s.color, fontSize: 18, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Needs at least 3 logged waterings per plant to show a pattern.
      </Text>
    </View>
  );
}
function MostLovedPlantsCard({ theme, savedPlants, wateringHistory, onOpenPlant }) {
  const ranked = (savedPlants || [])
    .map((name) => ({ name, count: getWateringCount(name, wateringHistory) }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (ranked.length < 2) return null;

  const medal = (i) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`);

return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {ranked.map((entry, i) => {
          const plant = produceData.find((p) => p.name === entry.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          return (
            <Pressable
              key={entry.name}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(107,199,255,0.16)" }}
            >
              <Text style={{ fontSize: 18, fontWeight: "900", width: 32, textAlign: "center" }}>{medal(i)}</Text>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{entry.name}</Text>
                <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                  💧 Watered {entry.count} time{entry.count === 1 ? "" : "s"}
                </Text>
              </View>
              {plant ? <Text style={{ color: "#6bc7ff", fontSize: 20, fontWeight: "900" }}>›</Text> : null}
            </Pressable>
          );
        })}
     </View>
    </View>
  );
}
const SavedPlantRow = React.memo(function SavedPlantRow({ item, onOpenPlant, onTogglePin, pinnedPlants, wateredPlants, wateringHistory, weather }) {
  const imageSource = resolvePlantImageSource(item);
  const health = getPlantHealthStatus({ plantName: item.name, wateredPlants, weather });
  const streak = getWateringStreak(item.name, wateringHistory);
  const isPinned = pinnedPlants.includes(item.name);
  return (
    <Pressable onPress={() => onOpenPlant(item)} style={styles.compactSavedPlantPill}>
      {onTogglePin ? (
        <Pressable onPress={() => onTogglePin(item.name)} hitSlop={8} accessibilityRole="button" accessibilityLabel={isPinned ? `Unpin ${item.name}` : `Pin ${item.name}`} style={{ position: "absolute", top: 4, right: 4, zIndex: 5, padding: 4 }}>
          <Text style={{ fontSize: 14, opacity: isPinned ? 1 : 0.3 }}>📌</Text>
        </Pressable>
      ) : null}
      {imageSource ? (
        <Image source={imageSource} style={styles.compactSavedPlantImage} resizeMode="contain" />
      ) : (
        <Text style={styles.compactSavedPlantEmoji}>🌱</Text>
      )}
      <Text numberOfLines={1} style={styles.compactSavedPlantName}>{item.name}</Text>
      <Text numberOfLines={1} style={[styles.compactSavedPlantHealth, { color: health.color }]}>{health.icon} {health.label}</Text>
      <Text numberOfLines={1} style={styles.compactSavedPlantWatered}>{getLastWateredText(item.name, wateredPlants, wateringHistory)}</Text>
      {streak >= 2 ? (
        <Text numberOfLines={1} style={styles.compactSavedPlantStreak}>🔥 {streak}</Text>
      ) : null}
    </Pressable>
  );
});
function SavedPlantsCard({
  theme,
  savedPlants,
  plantFolders,
  premiumUnlocked,
  onOpenPlant,
  onUpgrade,
  harvestTrackers,
  wateredPlants,
  wateringHistory,
  weather,
  pinnedPlants = [],
  onTogglePin,
}) {
const [sortMode, setSortMode] = useState("recent");
  const today = getTodayKey();
  const savedItems = useMemo(() => {
    const baseItems = produceData.filter((item) => savedPlants.includes(item.name));
    return [...baseItems].sort((a, b) => {
      const aPin = pinnedPlants.includes(a.name) ? 0 : 1;
      const bPin = pinnedPlants.includes(b.name) ? 0 : 1;
      if (aPin !== bPin) return aPin - bPin; // pinned always first
      if (sortMode === "alpha") return a.name.localeCompare(b.name);
      if (sortMode === "water") {
        const aNeeds = wateredPlants?.[a.name] !== today ? 0 : 1;
        const bNeeds = wateredPlants?.[b.name] !== today ? 0 : 1;
        if (aNeeds !== bNeeds) return aNeeds - bNeeds;
        return a.name.localeCompare(b.name);
      }
      return savedPlants.indexOf(b.name) - savedPlants.indexOf(a.name);
    });
  }, [savedPlants, pinnedPlants, sortMode, wateredPlants, today]);

  if (!savedItems.length) {
    return null;
  }

  const SORT_OPTIONS = [
    { id: "recent", label: "Recent" },
    { id: "water", label: "Needs water" },
    { id: "alpha", label: "A–Z" },
  ];

  return (
    <View>
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }} />
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

      {savedItems.length > 2 ? (
        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          {SORT_OPTIONS.map((opt) => {
            const active = sortMode === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setSortMode(opt.id)}
                style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: active ? "#5cff89" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.08)" }}
              >
                <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

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
              {onTogglePin ? (
                <Pressable
                  onPress={() => onTogglePin(item.name)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={pinnedPlants.includes(item.name) ? `Unpin ${item.name}` : `Pin ${item.name}`}
                  style={{ position: "absolute", top: 4, right: 4, zIndex: 5, padding: 4 }}
                >
                  <Text style={{ fontSize: 14, opacity: pinnedPlants.includes(item.name) ? 1 : 0.3 }}>📌</Text>
                </Pressable>
              ) : null}

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

<Text
                numberOfLines={1}
                style={styles.compactSavedPlantWatered}
              >
                {getLastWateredText(item.name, wateredPlants, wateringHistory)}
              </Text>

              {getWateringStreak(item.name, wateringHistory) >= 2 ? (
                <Text
                  numberOfLines={1}
                  style={styles.compactSavedPlantStreak}
                >
                  🔥 {getWateringStreak(item.name, wateringHistory)}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
function JournalCard({ theme, journalEntries, onAddGeneralPhoto, onDeleteEntry, uploadingPhoto }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlant, setFilterPlant] = useState("All");
  const [filterStage, setFilterStage] = useState("All");
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [editingCaption, setEditingCaption] = useState(null);
  const [captionDraft, setCaptionDraft] = useState("");
  const [localCaptions, setLocalCaptions] = useState({});
  const [showCaptionSuggestions, setShowCaptionSuggestions] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");

  const uniquePlants = ["All", ...Array.from(new Set(journalEntries.map(e => e.plantName || "Garden Update").filter(Boolean)))];
  const uniqueStages = ["All", "Seedling", "Leaf Growth", "Flowering", "Fruit Forming", "Harvest Ready"];

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = !searchQuery || (entry.plantName || "").toLowerCase().includes(searchQuery.toLowerCase()) || (entry.caption || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlant = filterPlant === "All" || (entry.plantName || "Garden Update") === filterPlant;
    const matchesStage = filterStage === "All" || entry.growthStage === filterStage;
    return matchesSearch && matchesPlant && matchesStage;
  });

  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = { label, entries: [] };
    groups[key].entries.push(entry);
    return groups;
  }, {});

  const totalPhotos = journalEntries.length;
  const plantsDocumented = new Set(journalEntries.map(e => e.plantName).filter(Boolean)).size;
  const harvestEntries = journalEntries.filter(e => String(e.growthStage || "").includes("Harvest")).length;
  const thisMonthEntries = journalEntries.filter(e => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const thisWeekEntries = journalEntries.filter(e => {
    const d = new Date(e.createdAt);
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  // Growth chart data — entries per month
  const growthChartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const count = journalEntries.filter(e => {
      const ed = new Date(e.createdAt);
      return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    }).length;
    return { month: d.toLocaleDateString("en-US", { month: "short" }), count };
  });
  const maxCount = Math.max(...growthChartData.map(d => d.count), 1);

  // Stage breakdown
  const stageBreakdown = ["Seedling", "Leaf Growth", "Flowering", "Fruit Forming", "Harvest Ready"].map(stage => ({
    stage,
    count: journalEntries.filter(e => e.growthStage === stage).length,
    color: { "Seedling": "#8effab", "Leaf Growth": "#5cff89", "Flowering": "#ffd86b", "Fruit Forming": "#ff9f43", "Harvest Ready": "#ff6b6b" }[stage],
  }));

  const journalAchievements = [
    { icon: "🌱", title: "First Sprout", unlocked: journalEntries.length >= 1 },
    { icon: "📸", title: "Photo Keeper", unlocked: journalEntries.length >= 3 },
    { icon: "📖", title: "Garden Story", unlocked: journalEntries.length >= 5 },
    { icon: "🍅", title: "Harvest Hero", unlocked: harvestEntries > 0 },
    { icon: "🌿", title: "Botanist", unlocked: plantsDocumented >= 5 },
    { icon: "📅", title: "Monthly Grower", unlocked: thisMonthEntries >= 3 },
  ];

  const getGrowthProgress = (stage) => {
    const stages = ["Seedling", "Leaf Growth", "Flowering", "Fruit Forming", "Harvest Ready"];
    const index = stages.indexOf(stage);
    return index === -1 ? 0 : (index + 1) / stages.length;
  };

  const getStageColor = (stage) => {
    const colors = { "Seedling": "#8effab", "Leaf Growth": "#5cff89", "Flowering": "#ffd86b", "Fruit Forming": "#ff9f43", "Harvest Ready": "#ff6b6b" };
    return colors[stage] || "#5cff89";
  };

  const getSmartCaptions = (entry) => {
    const plant = entry.plantName || "plant";
    const stage = entry.growthStage || "Seedling";
    const mood = entry.mood || "";
    const suggestions = {
      "Seedling": [
        `${plant} is just getting started 🌱 Day ${entry.daysSincePlanting || 1} and already showing signs of life!`,
        `Tiny but mighty 💚 Watching ${plant} push through the soil is pure magic.`,
        `Day ${entry.daysSincePlanting || 1} — ${plant} seedling looking healthy and ready to grow!`,
      ],
      "Leaf Growth": [
        `${plant} is really taking off now 🌿 The leaf growth this week has been incredible.`,
        `Green and thriving! ${plant} is in full leaf growth mode 💪`,
        `Look at those leaves! ${plant} is loving the conditions right now.`,
      ],
      "Flowering": [
        `${plant} is flowering! 🌸 This is the moment I've been waiting for.`,
        `Bloom time! ${plant} is showing off its beautiful flowers today.`,
        `Flowers on the ${plant} — pollinators are going to love this 🐝`,
      ],
      "Fruit Forming": [
        `Fruit is forming on the ${plant}! 🍅 Almost there — can't wait for harvest!`,
        `${plant} is putting all its energy into this fruit. Looking plump and perfect!`,
        `Day ${entry.daysSincePlanting || 1} — the ${plant} fruit is coming along beautifully.`,
      ],
      "Harvest Ready": [
        `Harvest day! 🎉 ${plant} has been an incredible grower this season.`,
        `It's time! ${plant} is ready to harvest and it looks absolutely perfect.`,
        `From seed to harvest — ${plant} has been an amazing journey 🌱➡️🍽️`,
      ],
    };
    return suggestions[stage] || suggestions["Seedling"];
  };

  const sharePhoto = async (imageUri) => {
    try {
      const { Share } = require("react-native");
      await Share.share({
        message: "Check out my garden progress on Pocket Planter! 🌱",
        url: imageUri,
      });
    } catch (error) {
      Alert.alert("Share failed", "Could not share this photo right now.");
    }
  };

  const saveCaption = (entryId) => {
    setLocalCaptions(current => ({ ...current, [entryId]: captionDraft }));
    setEditingCaption(null);
    setCaptionDraft("");
  };

return (
    <View>

      {/* ── DASHBOARD STATS ── */}
      <View style={styles.journalDashGrid}>
        <View style={[styles.journalDashTile, { borderColor: "rgba(92,255,137,0.25)" }]}>
          <Text style={styles.journalDashTileIcon}>📸</Text>
          <Text style={styles.journalDashTileValue}>{totalPhotos}</Text>
          <Text style={[styles.journalDashTileLabel, { color: theme.secondaryText }]}>Total Photos</Text>
        </View>
        <View style={[styles.journalDashTile, { borderColor: "rgba(255,216,107,0.25)" }]}>
          <Text style={styles.journalDashTileIcon}>🌿</Text>
          <Text style={styles.journalDashTileValue}>{plantsDocumented}</Text>
          <Text style={[styles.journalDashTileLabel, { color: theme.secondaryText }]}>Plants Documented</Text>
        </View>
        <View style={[styles.journalDashTile, { borderColor: "rgba(107,199,255,0.25)" }]}>
          <Text style={styles.journalDashTileIcon}>📅</Text>
          <Text style={styles.journalDashTileValue}>{thisMonthEntries}</Text>
          <Text style={[styles.journalDashTileLabel, { color: theme.secondaryText }]}>This Month</Text>
        </View>
        <View style={[styles.journalDashTile, { borderColor: "rgba(255,107,107,0.25)" }]}>
          <Text style={styles.journalDashTileIcon}>🚜</Text>
          <Text style={styles.journalDashTileValue}>{harvestEntries}</Text>
          <Text style={[styles.journalDashTileLabel, { color: theme.secondaryText }]}>Harvests</Text>
        </View>
      </View>

      {/* ── GROWTH CHART ── */}
      {totalPhotos > 0 ? (
        <View style={styles.journalGrowthChartCard}>
          <Text style={styles.journalGrowthChartTitle}>📈 Photo Activity — Last 6 Months</Text>
          <View style={styles.journalGrowthChartBars}>
            {growthChartData.map((item, i) => (
              <View key={i} style={styles.journalGrowthChartBar}>
                <Text style={[styles.journalGrowthChartCount, { color: item.count > 0 ? "#5cff89" : "#314c39" }]}>
                  {item.count > 0 ? item.count : ""}
                </Text>
                <View style={styles.journalGrowthChartBarTrack}>
                  <View style={[styles.journalGrowthChartBarFill, {
                    height: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: i === 5 ? "#5cff89" : "rgba(92,255,137,0.35)",
                  }]} />
                </View>
                <Text style={styles.journalGrowthChartMonth}>{item.month}</Text>
              </View>
            ))}
          </View>
          {thisWeekEntries > 0 ? (
            <View style={styles.journalGrowthChartBadge}>
              <Text style={styles.journalGrowthChartBadgeText}>🔥 {thisWeekEntries} photo{thisWeekEntries === 1 ? "" : "s"} this week — you're on a roll!</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* ── STAGE BREAKDOWN ── */}
      {totalPhotos > 0 ? (
        <View style={styles.journalStageBreakdown}>
          <Text style={styles.journalStageBreakdownTitle}>🌱 Growth Stage Breakdown</Text>
          <View style={styles.journalStageBreakdownTrack}>
            {stageBreakdown.filter(s => s.count > 0).map((s, i) => (
              <View key={i} style={[styles.journalStageBreakdownSegment, {
                flex: s.count,
                backgroundColor: s.color,
                borderRadius: i === 0 ? 8 : i === stageBreakdown.filter(x => x.count > 0).length - 1 ? 8 : 0,
              }]} />
            ))}
          </View>
          <View style={styles.journalStageLegend}>
            {stageBreakdown.filter(s => s.count > 0).map((s, i) => (
              <View key={i} style={styles.journalStageLegendItem}>
                <View style={[styles.journalStageLegendDot, { backgroundColor: s.color }]} />
                <Text style={[styles.journalStageLegendText, { color: theme.secondaryText }]}>
                  {s.stage.split(" ")[0]} ({s.count})
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* ── ACHIEVEMENTS ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.journalAchievementScroll}>
        {journalAchievements.map((a) => (
          <View key={a.title} style={[styles.journalAchievementBadgeV2, {
            opacity: a.unlocked ? 1 : 0.3,
            borderColor: a.unlocked ? "rgba(92,255,137,0.35)" : "rgba(255,255,255,0.08)",
            backgroundColor: a.unlocked ? "rgba(92,255,137,0.10)" : "rgba(255,255,255,0.04)",
          }]}>
            <Text style={styles.journalAchievementIconV2}>{a.icon}</Text>
            <Text numberOfLines={1} style={styles.journalAchievementTextV2}>{a.title}</Text>
            {a.unlocked ? <Text style={styles.journalAchievementCheck}>✓</Text> : null}
          </View>
        ))}
      </ScrollView>

      {/* ── TAB SWITCHER ── */}
      {totalPhotos > 0 ? (
        <View style={styles.journalTabSwitcher}>
          {[{ id: "timeline", label: "📅 Timeline" }, { id: "plants", label: "🌿 By Plant" }].map(tab => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.journalTabButton, activeTab === tab.id && styles.journalTabButtonActive]}
            >
              <Text style={[styles.journalTabButtonText, activeTab === tab.id && styles.journalTabButtonTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* ── EMPTY STATE ── */}
      {journalEntries.length === 0 ? (
        <View style={styles.journalEmptyState}>
          <Text style={styles.journalEmptyStateEmoji}>📸</Text>
          <Text style={styles.journalEmptyStateTitle}>Start Your Garden Story!</Text>
          <Text style={[styles.journalEmptyStateText, { color: theme.secondaryText }]}>
            Add your first photo to start documenting your garden's journey. Every great garden has a story worth telling.
          </Text>
          <Pressable style={styles.journalHeroButton} onPress={onAddGeneralPhoto}>
            <Text style={styles.journalHeroButtonText}>+ Add First Photo</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Pressable disabled={uploadingPhoto} style={styles.journalAddPhotoButton} onPress={onAddGeneralPhoto}>
            <Text style={styles.journalAddPhotoButtonIcon}>📷</Text>
            <Text style={styles.journalAddPhotoButtonText}>{uploadingPhoto ? "Uploading…" : "Add Photo"}</Text>
          </Pressable>

          {/* ── SEARCH ── */}
          <View style={styles.journalSearchBar}>
            <Text style={styles.journalSearchIcon}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by plant or caption..."
              placeholderTextColor="#8fbf9d"
              style={styles.journalSearchInput}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery("")}>
                <Text style={styles.journalSearchClear}>✕</Text>
              </Pressable>
            ) : null}
          </View>

          {/* ── PLANT FILTER ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.journalFilterScroll}>
            {uniquePlants.map(plant => (
              <Pressable key={plant} onPress={() => setFilterPlant(plant)}
                style={[styles.journalFilterPill, filterPlant === plant && styles.journalFilterPillActive]}>
                <Text style={[styles.journalFilterPillText, filterPlant === plant && styles.journalFilterPillTextActive]}>
                  {plant === "All" ? "🌿 All Plants" : plant}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ── STAGE FILTER ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.journalFilterScroll, { marginTop: 0 }]}>
            {uniqueStages.map(stage => (
              <Pressable key={stage} onPress={() => setFilterStage(stage)}
                style={[styles.journalFilterPill, filterStage === stage && styles.journalFilterPillActive]}>
                <Text style={[styles.journalFilterPillText, filterStage === stage && styles.journalFilterPillTextActive]}>
                  {stage === "All" ? "📅 All Stages" : stage}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ── RESULTS COUNT ── */}
          {(searchQuery || filterPlant !== "All" || filterStage !== "All") ? (
            <View style={styles.journalResultsRow}>
              <Text style={styles.journalResultsText}>{filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"} found</Text>
              <Pressable onPress={() => { setSearchQuery(""); setFilterPlant("All"); setFilterStage("All"); }}>
                <Text style={styles.journalResultsClear}>Clear filters</Text>
              </Pressable>
            </View>
          ) : null}

          {/* ── BY PLANT VIEW ── */}
          {activeTab === "plants" ? (
            <View style={{ marginTop: 16, gap: 14 }}>
              {filteredEntries.length === 0 ? (
                <View style={styles.journalNoResults}>
                  <Text style={styles.journalNoResultsEmoji}>🔍</Text>
                  <Text style={styles.journalNoResultsTitle}>No entries found</Text>
                  <Text style={[styles.journalNoResultsText, { color: theme.secondaryText }]}>Try adjusting your search or filters to see your plants.</Text>
                  <Pressable onPress={() => { setSearchQuery(""); setFilterPlant("All"); setFilterStage("All"); }} style={styles.journalNoResultsBtn}>
                    <Text style={styles.journalNoResultsBtnText}>Clear filters</Text>
                  </Pressable>
                </View>
              ) : null}
              {Array.from(new Set(filteredEntries.map(e => e.plantName || "Garden Update"))).map(plantName => {
                const plantEntries = filteredEntries.filter(e => (e.plantName || "Garden Update") === plantName);
                return (
                  <View key={plantName} style={[styles.journalPlantGroup, { borderColor: "rgba(92,255,137,0.18)" }]}>
                    <View style={styles.journalPlantGroupHeader}>
                      <Text style={styles.journalPlantGroupName}>{plantName}</Text>
                      <View style={styles.journalPlantGroupBadge}>
                        <Text style={styles.journalPlantGroupBadgeText}>{plantEntries.length} photo{plantEntries.length === 1 ? "" : "s"}</Text>
                      </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 8 }}>
                      {plantEntries.map(entry => (
                        <Pressable key={entry.id} onPress={() => { setActiveTab("timeline"); setExpandedEntry(entry.id); }}
                          style={styles.journalPlantThumb}>
                          {entry.imageUri ? (
                            <Image source={{ uri: entry.imageUri }} style={styles.journalPlantThumbImage} resizeMode="cover" />
                          ) : (
                            <View style={[styles.journalPlantThumbImage, { backgroundColor: "rgba(92,255,137,0.10)", alignItems: "center", justifyContent: "center" }]}>
                              <Text style={{ fontSize: 24 }}>🌱</Text>
                            </View>
                          )}
                          <View style={[styles.journalPlantThumbStage, { backgroundColor: getStageColor(entry.growthStage) + "33" }]}>
                            <Text style={[styles.journalPlantThumbStageText, { color: getStageColor(entry.growthStage) }]}>
                              {entry.growthStage?.split(" ")[0] || "Seedling"}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                );
              })}
            </View>
          ) : (
            // ── TIMELINE VIEW ──
            <>
              {Object.values(groupedEntries).map(({ label, entries }) => (
                <View key={label} style={styles.journalMonthGroup}>
                  <View style={styles.journalMonthHeader}>
                    <View style={styles.journalMonthLine} />
                    <View style={styles.journalMonthBadge}>
                      <Text style={styles.journalMonthText}>{label}</Text>
                    </View>
                    <View style={styles.journalMonthLine} />
                  </View>

                  {entries.map((entry) => {
                    const caption = localCaptions[entry.id] || entry.caption;
                    const growthProgress = getGrowthProgress(entry.growthStage);
                    const stageColor = getStageColor(entry.growthStage);
                    const isExpanded = expandedEntry === entry.id;
                    const isEditingThis = editingCaption === entry.id;
                    const showingSuggestions = showCaptionSuggestions === entry.id;
                    const suggestions = getSmartCaptions(entry);

                    return (
                      <View key={entry.id} style={styles.journalEntryWrapV2}>
                        <View style={styles.journalTimelineDotV2} />
                        <View style={styles.journalTimelineLineV2} />

                        <Pressable
                          onPress={() => setExpandedEntry(isExpanded ? null : entry.id)}
                          style={[styles.journalEntryCardV2, {
                            backgroundColor: theme.input,
                            borderColor: isExpanded ? stageColor + "60" : theme.border,
                            borderWidth: isExpanded ? 1.5 : 1,
                          }]}
                        >
                          {/* PHOTO */}
                          {entry.imageUri ? (
                            <Image source={{ uri: entry.imageUri }}
                              style={[styles.journalEntryImageV2, isExpanded && styles.journalEntryImageExpanded]}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={styles.journalEntryPlaceholderV2}>
                              <Text style={styles.journalEntryPlaceholderEmoji}>🌱</Text>
                            </View>
                          )}

                          {/* ACTION BUTTONS OVERLAY */}
                          <View style={styles.journalEntryActionRow}>
                            <Pressable onPress={() => onDeleteEntry(entry.id)} style={styles.journalEntryActionBtn}>
                              <Text style={styles.journalEntryActionBtnText}>✕</Text>
                            </Pressable>
                            {entry.imageUri ? (
                              <Pressable onPress={() => sharePhoto(entry.imageUri)} style={[styles.journalEntryActionBtn, { backgroundColor: "rgba(92,255,137,0.85)" }]}>
                                <Text style={[styles.journalEntryActionBtnText, { color: "#07120b" }]}>⬆</Text>
                              </Pressable>
                            ) : null}
                          </View>

                          {/* MOOD + WEATHER OVERLAY */}
                          <View style={styles.journalEntryOverlayRow}>
                            <View style={styles.journalMoodOverlay}>
                              <Text style={styles.journalMoodOverlayText}>{entry.mood || "🌱 Growing"}</Text>
                            </View>
                            {entry.weather ? (
                              <View style={[styles.journalMoodOverlay, { right: 10, left: "auto" }]}>
                                <Text style={styles.journalMoodOverlayText}>{entry.weather}</Text>
                              </View>
                            ) : null}
                          </View>

                          {/* CONTENT */}
                          <View style={styles.journalEntryContentV2}>

                            {/* HEADER */}
                            <View style={styles.journalEntryHeaderV2}>
                              <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={[styles.journalEntryTitleV2, { color: theme.text }]}>
                                  {entry.plantName || "Garden Update"}
                                </Text>
                                <Text style={[styles.journalEntryDateV2, { color: theme.secondaryText }]}>
                                  {new Date(entry.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                  {" · Day "}{entry.daysSincePlanting || 1}
                                </Text>
                              </View>
                              <View style={[styles.journalStageChip, { backgroundColor: stageColor + "22", borderColor: stageColor + "55" }]}>
                                <Text style={[styles.journalStageChipText, { color: stageColor }]}>
                                  {entry.growthStage || "Seedling"}
                                </Text>
                              </View>
                            </View>

                            {/* GROWTH PROGRESS BAR */}
                            <View style={styles.journalGrowthRow}>
                              <Text style={[styles.journalGrowthLabel, { color: stageColor }]}>Growth Progress</Text>
                              <Text style={[styles.journalDayBadge, { color: theme.secondaryText }]}>{Math.round(growthProgress * 100)}%</Text>
                            </View>
                            <View style={styles.journalProgressTrack}>
                              <View style={[styles.journalProgressFill, { width: `${growthProgress * 100}%`, backgroundColor: stageColor }]} />
                            </View>
                            <View style={styles.journalProgressLabels}>
                              {["🌱", "🌿", "🌸", "🍅", "🎉"].map((emoji, i) => (
                                <Text key={i} style={[styles.journalProgressEmoji, { opacity: growthProgress >= (i + 1) / 5 ? 1 : 0.25 }]}>{emoji}</Text>
                              ))}
                            </View>

                            {/* CAPTION AREA */}
                            {isExpanded ? (
                              <>
                                {isEditingThis ? (
                                  <View style={styles.journalCaptionEditWrap}>
                                    <TextInput
                                      value={captionDraft}
                                      onChangeText={setCaptionDraft}
                                      placeholder="Write a caption..."
                                      placeholderTextColor="#8fbf9d"
                                      multiline
                                      style={styles.journalCaptionInput}
                                      autoFocus
                                    />
                                    {/* AI CAPTION SUGGESTIONS */}
                                    <Pressable
                                      onPress={() => setShowCaptionSuggestions(showingSuggestions ? null : entry.id)}
                                      style={styles.journalSuggestButton}
                                    >
                                      <Text style={styles.journalSuggestButtonText}>✨ Smart caption ideas</Text>
                                    </Pressable>
                                    {showingSuggestions ? (
                                      <View style={styles.journalSuggestionsBox}>
                                        <Text style={styles.journalSuggestionsTitle}>💡 Suggestions for {entry.growthStage || "Seedling"}</Text>
                                        {suggestions.map((s, i) => (
                                          <Pressable key={i} onPress={() => { setCaptionDraft(s); setShowCaptionSuggestions(null); }}
                                            style={styles.journalSuggestionPill}>
                                            <Text style={styles.journalSuggestionText}>{s}</Text>
                                          </Pressable>
                                        ))}
                                      </View>
                                    ) : null}
                                    <View style={styles.journalCaptionButtonRow}>
                                      <Pressable onPress={() => saveCaption(entry.id)} style={styles.journalCaptionSaveBtn}>
                                        <Text style={styles.journalCaptionSaveBtnText}>Save Caption</Text>
                                      </Pressable>
                                      <Pressable onPress={() => setEditingCaption(null)} style={styles.journalCaptionCancelBtn}>
                                        <Text style={styles.journalCaptionCancelBtnText}>Cancel</Text>
                                      </Pressable>
                                    </View>
                                  </View>
                                ) : (
                                  <Pressable onPress={() => { setEditingCaption(entry.id); setCaptionDraft(caption || ""); }}
                                    style={styles.journalCaptionWrap}>
                                    <Text style={[styles.journalCaptionText, { color: caption ? theme.text : theme.secondaryText }]}>
                                      {caption || "Tap to add a caption... ✏️"}
                                    </Text>
                                    {!caption ? (
                                      <Pressable onPress={() => { setEditingCaption(entry.id); setShowCaptionSuggestions(entry.id); setCaptionDraft(""); }}
                                        style={styles.journalSuggestButton}>
                                        <Text style={styles.journalSuggestButtonText}>✨ Get smart caption ideas</Text>
                                      </Pressable>
                                    ) : null}
                                  </Pressable>
                                )}

                                {/* EXPANDED DETAILS */}
                                <View style={styles.journalExpandedDetails}>
                                  <View style={styles.journalDetailChip}>
                                    <Text style={styles.journalDetailChipText}>📅 {new Date(entry.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</Text>
                                  </View>
                                  <View style={styles.journalDetailChip}>
                                    <Text style={styles.journalDetailChipText}>⏳ Day {entry.daysSincePlanting || 1} since planting</Text>
                                  </View>
                                  {entry.mood ? (
                                    <View style={styles.journalDetailChip}>
                                      <Text style={styles.journalDetailChipText}>{entry.mood}</Text>
                                    </View>
                                  ) : null}
                                  <View style={[styles.journalDetailChip, { backgroundColor: stageColor + "18", borderColor: stageColor + "40" }]}>
                                    <Text style={[styles.journalDetailChipText, { color: stageColor }]}>🌿 Stage: {entry.growthStage || "Seedling"}</Text>
                                  </View>
                                </View>
                              </>
                            ) : (
                              <Text style={[styles.journalCaptionPreview, { color: theme.secondaryText }]} numberOfLines={2}>
                                {caption || "Tap to expand, add caption, or get smart suggestions ✨"}
                              </Text>
                            )}

                            <Text style={[styles.journalExpandHint, { color: stageColor }]}>
                              {isExpanded ? "▲ Collapse" : "▼ Tap to expand"}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              ))}

              {filteredEntries.length === 0 && journalEntries.length > 0 ? (
                <View style={styles.journalNoResults}>
                  <Text style={styles.journalNoResultsEmoji}>🔍</Text>
                  <Text style={styles.journalNoResultsTitle}>No entries found</Text>
                  <Text style={[styles.journalNoResultsText, { color: theme.secondaryText }]}>Try adjusting your search or filters.</Text>
                  <Pressable onPress={() => { setSearchQuery(""); setFilterPlant("All"); setFilterStage("All"); }} style={styles.journalNoResultsBtn}>
                    <Text style={styles.journalNoResultsBtnText}>Clear filters</Text>
                  </Pressable>
                </View>
              ) : null}
            </>
          )}
        </>
      )}
    </View>
  );
}
function SettingsCard({ theme, premiumUnlocked, setPremiumUnlocked, subscriptionPlan, setSubscriptionPlan, onUnlockPremium }) {
 const [selectedPlan, setSelectedPlan] = useState(subscriptionPlan || "Yearly");
  const [restoring, setRestoring] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

async function restorePurchases() {
    if (restoring) return;
    setRestoring(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active["Pocket Planter Pro"]) {
        onUnlockPremium(selectedPlan);
        Alert.alert("Purchases Restored 👑", "Your premium subscription has been restored.");
      } else {
        Alert.alert("No Purchases Found", "We couldn't find an active subscription to restore for this account.");
      }
    } catch (err) {
      Alert.alert("Restore Failed", "Something went wrong restoring your purchases. Please try again.");
    } finally {
      setRestoring(false);
    }
  }

async function choosePlan(plan) {
    if (purchasing) return;
    setSelectedPlan(plan);
    setPurchasing(true);
    try {
      const offerings = await Purchases.getOfferings();
      const packages = offerings?.current?.availablePackages;
      if (!packages?.length) {
        Alert.alert("Store Unavailable", "In-app purchases are not available right now. Please try again later.");
        return;
      }
      const targetPackage = packages.find(pkg =>
        plan === "Monthly"
          ? pkg.product.identifier === "com.pocketplanter.monthly"
          : pkg.product.identifier === "com.pocketplanter.yearly"
      ) || packages[0];
      const { customerInfo } = await Purchases.purchasePackage(targetPackage);
      if (customerInfo.entitlements.active["Pocket Planter Pro"]) {
        onUnlockPremium(plan);
      }
    } catch (err) {
      if (!err.userCancelled) {
        Alert.alert("Purchase Failed", "Something went wrong. Please try again.");
      }
    } finally {
      setPurchasing(false);
    }
  }

  const features = [
    { icon: "❄️", title: "Frost & Heat Alerts", text: "Get warned before dangerous temps hit your garden." },
    { icon: "💧", title: "Smart Watering Guidance", text: "Weather-aware daily watering recommendations." },
    { icon: "🌿", title: "Companion Intelligence", text: "See which plants thrive together and which to avoid." },
    { icon: "🗺️", title: "Garden Planner Map", text: "Plan all 12 plots with compatibility scoring." },
    { icon: "📸", title: "Journal & Photo Timeline", text: "Document your garden's growth with photos." },
    { icon: "🏆", title: "XP, Levels & Achievements", text: "Earn rewards for daily garden care." },
    { icon: "🌱", title: "Unlimited Saved Plants", text: "Save as many plants as your garden needs." },
    { icon: "⚡", title: "Daily Quests", text: "Complete challenges and build your streak." },
  ];

  return (
    <View style={{ marginBottom: 18 }}>

      {/* HERO SECTION */}
      <View style={styles.premiumHeroSection}>
        <View style={styles.premiumHeroGlowOrbOne} />
        <View style={styles.premiumHeroGlowOrbTwo} />

        <View style={styles.premiumCrownWrap}>
          <Text style={styles.premiumCrownEmoji}>👑</Text>
        </View>

        <Text style={styles.premiumHeroEyebrow}>POCKET PLANTER PREMIUM</Text>
        <Text style={styles.premiumHeroHeadline}>Grow smarter.{"\n"}Garden better.</Text>
        <Text style={styles.premiumHeroSubtext}>
          Everything you need to plan, track, and grow a thriving garden — all in one place.
        </Text>

        <View style={styles.premiumHeroStatRow}>
          <View style={styles.premiumHeroStat}>
            <Text style={styles.premiumHeroStatValue}>200+</Text>
            <Text style={styles.premiumHeroStatLabel}>Plants</Text>
          </View>
          <View style={styles.premiumHeroStatDivider} />
          <View style={styles.premiumHeroStat}>
            <Text style={styles.premiumHeroStatValue}>12</Text>
            <Text style={styles.premiumHeroStatLabel}>Garden Plots</Text>
          </View>
          <View style={styles.premiumHeroStatDivider} />
          <View style={styles.premiumHeroStat}>
            <Text style={styles.premiumHeroStatValue}>Cancel</Text>
            <Text style={styles.premiumHeroStatLabel}>Anytime</Text>
          </View>
        </View>
      </View>

      {/* FEATURES GRID */}
      <View style={[styles.premiumFeaturesCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={styles.premiumFeaturesEyebrow}>EVERYTHING INCLUDED</Text>

        <View style={styles.premiumFeaturesGrid}>
          {features.map((f) => (
            <View key={f.title} style={styles.premiumFeatureTile}>
              <View style={styles.premiumFeatureTileIconWrap}>
                <Text style={styles.premiumFeatureTileIcon}>{f.icon}</Text>
              </View>
              <Text style={styles.premiumFeatureTileTitle}>{f.title}</Text>
              <Text style={styles.premiumFeatureTileText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* PLAN SELECTOR */}
      <View style={[styles.premiumPlanCard, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
        <Text style={styles.premiumPlanEyebrow}>CHOOSE YOUR PLAN</Text>
        <Text style={[styles.premiumPlanSubtext, { color: theme.secondaryText }]}>
          Choose monthly or yearly. Cancel anytime.
        </Text>

        <View style={styles.premiumPlanToggleRow}>
          {[
            {
              plan: "Monthly",
              badge: "POPULAR",
              badgeBg: "#5cff89",
              badgeColor: "#07120b",
              price: "$2.99",
              per: "/ month",
              savings: null,
            },
            {
              plan: "Yearly",
              badge: "BEST VALUE",
              badgeBg: "#ffd86b",
              badgeColor: "#3d2c00",
              price: "$24.99",
              per: "/ year",
              savings: "Save 30%",
            },
          ].map(({ plan, badge, badgeBg, badgeColor, price, per, savings }) => {
            const isSelected = selectedPlan === plan;
            return (
              <Pressable
                key={plan}
                onPress={() => choosePlan(plan)}
                style={[
                  styles.premiumPlanOption,
                  {
                    backgroundColor: isSelected
                      ? "rgba(92,255,137,0.14)"
                      : "rgba(255,255,255,0.05)",
                    borderColor: isSelected ? "#5cff89" : "rgba(255,255,255,0.10)",
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                {/* BADGE */}
                <View style={[styles.premiumPlanBadge, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.premiumPlanBadgeText, { color: badgeColor }]}>{badge}</Text>
                </View>

                {/* SELECTED CHECKMARK */}
                {isSelected ? (
                  <View style={styles.premiumPlanCheck}>
                    <Text style={styles.premiumPlanCheckText}>✓</Text>
                  </View>
                ) : null}

                <Text style={[styles.premiumPlanOptionName, { color: isSelected ? "#5cff89" : "#ffffff" }]}>
                  {plan}
                </Text>

                <Text style={[styles.premiumPlanOptionPrice, { color: "#ffffff" }]}>
                  {price}
                </Text>

                <Text style={[styles.premiumPlanOptionPer, { color: isSelected ? "#8effab" : "#d7ebdc" }]}>
                  {per}
                </Text>

                {savings ? (
                  <View style={styles.premiumPlanSavingsPill}>
                    <Text style={styles.premiumPlanSavingsText}>{savings}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

      {/* CTA BUTTON */}
        <Pressable
          disabled={purchasing}
          accessibilityRole="button"
          accessibilityLabel="Subscribe to Pocket Planter Premium"
          accessibilityState={{ disabled: purchasing }}
          style={[styles.premiumPlanCTA, purchasing && { opacity: 0.6 }]}
          onPress={() => choosePlan(selectedPlan)}
        >
          <Text style={styles.premiumPlanCTAText}>
           {purchasing ? "Opening…" : "Unlock Premium 🌱"}
          </Text>
        </Pressable>

        <Text style={styles.premiumPlanFooter}>
          Cancel anytime • Restores on new device
        </Text>

        {/* LEGAL LINKS */}
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 10, marginBottom: 4 }}>
          <Pressable onPress={() => Linking.openURL("https://pocketplanter.green/privacy")}>
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "700", textDecorationLine: "underline" }}>
              Privacy Policy
            </Text>
          </Pressable>
          <Text style={{ color: "#8effab", fontSize: 12 }}>•</Text>
          <Pressable onPress={() => Linking.openURL("https://pocketplanter.green/terms")}>
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "700", textDecorationLine: "underline" }}>
              Terms of Use
            </Text>
          </Pressable>
        </View>

       <Pressable disabled={restoring} accessibilityRole="button" accessibilityLabel="Restore previous purchases" onPress={restorePurchases} style={{ marginTop: 14, borderRadius: 16, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(92,255,137,0.22)", opacity: restoring ? 0.6 : 1 }}>
          <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>
            {restoring ? "Restoring…" : "↩️ Restore Purchases"}
          </Text>
        </Pressable>
      </View>

      {/* TRUST BADGES */}
      <View style={[styles.premiumTrustRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {[
          { icon: "🔒", label: "Secure" },
          { icon: "↩️", label: "Cancel anytime" },
          { icon: "📱", label: "iOS" },
          { icon: "☁️", label: "Cloud sync" },
        ].map((t) => (
          <View key={t.label} style={styles.premiumTrustTile}>
            <Text style={styles.premiumTrustIcon}>{t.icon}</Text>
            <Text style={styles.premiumTrustLabel}>{t.label}</Text>
          </View>
        ))}
      </View>

      {/* DEV UNLOCK */}
     {__DEV__ ? (
  <View style={styles.premiumDevSection}>
    <View style={styles.premiumDevSectionHeader}>
      <Text style={styles.premiumDevSectionLabel}>🛠 DEVELOPER TOOLS</Text>
      <Text style={styles.premiumDevSectionSub}>Remove before App Store submission</Text>
    </View>

  <Pressable
      style={styles.premiumDevButton}
      onPress={async () => {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        console.log("=== SCHEDULED NOTIFICATIONS (" + scheduled.length + ") ===");
        scheduled.forEach((n) => {
          console.log(n.identifier, "|", JSON.stringify(n.trigger));
        });
        Alert.alert(
          "Scheduled Reminders",
          scheduled.length
            ? scheduled.map((n) => `• ${n.identifier}`).join("\n")
            : "Nothing scheduled. (In Expo Go, scheduling may be limited — confirm in a dev build.)"
        );
      }}
    >
      <Text style={styles.premiumDevButtonIcon}>🔔</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.premiumDevButtonText}>Dump Scheduled Reminders</Text>
        <Text style={styles.premiumDevButtonSub}>
          Logs every scheduled notification + trigger to console
        </Text>
      </View>
    </Pressable>

    <Pressable
      style={styles.premiumDevButton}
      onPress={async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        Alert.alert(
          "All Reminders Cleared",
          "Every scheduled notification was canceled. Re-toggle your reminders on the Garden tab to reschedule them cleanly."
        );
      }}
    >
      <Text style={styles.premiumDevButtonIcon}>🗑</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.premiumDevButtonText}>Clear All Scheduled</Text>
        <Text style={styles.premiumDevButtonSub}>
          One-time flush to remove orphaned legacy reminders
        </Text>
      </View>
    </Pressable>
    <Pressable
      style={[
        styles.premiumDevButton,
        premiumUnlocked && styles.premiumDevButtonActive,
      ]}
     onPress={() => {
        if (!__DEV__) return;
        setPremiumUnlocked(!premiumUnlocked);
        Alert.alert(
          premiumUnlocked ? "Premium Disabled" : "Premium Unlocked 👑",
          premiumUnlocked
            ? "App is now in free mode. All locks are active."
            : "Full app unlocked for testing. All premium features are now accessible."
        );
      }}
    >
      <Text style={styles.premiumDevButtonIcon}>
        {premiumUnlocked ? "🔓" : "🔒"}
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.premiumDevButtonText}>
          {premiumUnlocked ? "Premium ON — Tap to disable" : "Unlock Full App (Dev)"}
        </Text>
        <Text style={styles.premiumDevButtonSub}>
          Toggles all premium locks on and off
        </Text>
      </View>
      <View style={[
        styles.premiumDevTogglePill,
        { backgroundColor: premiumUnlocked ? "#5cff89" : "rgba(255,255,255,0.10)" }
      ]}>
        <Text style={[
          styles.premiumDevToggleText,
          { color: premiumUnlocked ? "#07120b" : "#d7ebdc" }
        ]}>
          {premiumUnlocked ? "ON" : "OFF"}
        </Text>
      </View>
    </Pressable>
  </View>
) : null}

    </View>
  );
}

function WateringForecastCard({ theme, savedPlants, wateringHistory, wateredPlants, weather, onOpenPlant }) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Build 7 forward day-buckets. Each saved plant with watering history is
  // projected via getNextWaterInfo and dropped into the day it comes due.
  const savedItems = (savedPlants || [])
    .map((name) => produceData.find((p) => p.name === name))
    .filter(Boolean);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return { offset: i, date: d, plants: [] };
  });

  let untrackedCount = 0;
  savedItems.forEach((item) => {
    const info = getNextWaterInfo(item.name, item, wateringHistory, wateredPlants, weather);
    if (!info) { untrackedCount += 1; return; }
    // Overdue or due today collapse into column 0; cap projection at day 6.
    const bucket = Math.min(6, Math.max(0, info.daysUntil));
    days[bucket].plants.push({ name: item.name, rainSoon: info.rainSoon });
  });

  const maxCount = Math.max(1, ...days.map((d) => d.plants.length));
  const weekdayFmt = (date, offset) =>
    offset === 0 ? "Today" : offset === 1 ? "Tmrw" : date.toLocaleDateString(undefined, { weekday: "short" });

  const active = selectedDay != null ? days[selectedDay] : null;

return (
    <View>

      {savedItems.length === 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 8 }}>
          Save a few plants to see your watering week take shape.
        </Text>
      ) : (
        <>
          <View style={{ flexDirection: "row", gap: 6, marginTop: 14 }}>
            {days.map((d) => {
              const count = d.plants.length;
              const intensity = count === 0 ? 0.06 : 0.12 + 0.5 * (count / maxCount);
              const isSel = selectedDay === d.offset;
              return (
                <Pressable
                  key={d.offset}
                  onPress={() => setSelectedDay(isSel ? null : d.offset)}
                  accessibilityRole="button"
                  accessibilityLabel={`${weekdayFmt(d.date, d.offset)}: ${count} plant${count === 1 ? "" : "s"} due`}
                  style={{ flex: 1, alignItems: "center", borderRadius: 14, paddingVertical: 10, backgroundColor: `rgba(107,199,255,${intensity})`, borderWidth: isSel ? 2 : 1, borderColor: isSel ? "#6bc7ff" : "rgba(255,255,255,0.08)" }}
                >
                  <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800" }}>{weekdayFmt(d.date, d.offset)}</Text>
                  <Text style={{ color: count === 0 ? theme.secondaryText : "#ffffff", fontSize: 18, fontWeight: "900", marginTop: 4 }}>{count}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 8, fontWeight: "700" }}>{count === 1 ? "plant" : "plants"}</Text>
                </Pressable>
              );
            })}
          </View>

          {active ? (
            <View style={{ marginTop: 14, backgroundColor: "rgba(107,199,255,0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.2)" }}>
              <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: active.plants.length ? 10 : 0 }}>
                {weekdayFmt(active.date, active.offset).toUpperCase()} · {active.plants.length} DUE
              </Text>
              {active.plants.length === 0 ? (
                <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700" }}>Nothing due — a free day. 🌤️</Text>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {active.plants.map((p) => (
                    <Pressable
                      key={p.name}
                      onPress={() => {
                        const item = produceData.find((pd) => pd.name === p.name);
                        if (item && onOpenPlant) onOpenPlant(item);
                      }}
                      style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "800" }}>{p.rainSoon ? "🌧️ " : ""}{p.name} ›</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 12, textAlign: "center" }}>
              Tap a day to see which plants are due.
            </Text>
          )}

          {untrackedCount > 0 ? (
            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic" }}>
              {untrackedCount} plant{untrackedCount === 1 ? "" : "s"} not shown — water once to start forecasting.
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}

function csvEscape(value) {
  const s = String(value == null ? "" : value);
  // Wrap in quotes and escape internal quotes if it contains a comma, quote, or newline.
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
function buildCsv(headers, rows) {
  const head = headers.map(csvEscape).join(",");
  const body = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  return `${head}\n${body}`;
}
function DataExportCard({ theme, harvestLog, careLog, journalEntries }) {
  const shareCsv = async (label, csv, count) => {
    if (!count) {
      Alert.alert("Nothing to export", `You don't have any ${label} entries yet.`);
      return;
    }
    try {
      tapHaptic("light");
      await Share.share({
        title: `Pocket Planter — ${label}`,
        message: csv,
      });
    } catch (e) {
      console.log("Export share skipped:", e);
    }
  };

  const exportHarvests = () => {
    const rows = (harvestLog || []).map((h) => [
      h.date || "", h.plantName || "", h.amount || "", h.unit || "", h.note || "", h.createdAt || "",
    ]);
    const csv = buildCsv(["Date", "Plant", "Amount", "Unit", "Note", "Logged At"], rows);
    shareCsv("harvest log", csv, rows.length);
  };

  const exportCareLog = () => {
    const rows = (careLog || []).map((c) => [
      c.date || "", c.plant || "", c.actionLabel || "", c.note || "", c.createdAt || "",
    ]);
    const csv = buildCsv(["Date", "Plant", "Action", "Note", "Logged At"], rows);
    shareCsv("care log", csv, rows.length);
  };

  const exportJournal = () => {
    const rows = (journalEntries || []).map((e) => [
      e.plantName || "", e.growthStage || "", e.mood || "", e.imageUri || "", e.createdAt || "",
    ]);
    const csv = buildCsv(["Plant", "Growth Stage", "Mood", "Photo URL", "Created At"], rows);
    shareCsv("journal", csv, rows.length);
  };

  const buttons = [
    { icon: "🚜", label: "Harvest Log", count: (harvestLog || []).length, onPress: exportHarvests, color: "#ffd86b" },
    { icon: "🧪", label: "Care Log", count: (careLog || []).length, onPress: exportCareLog, color: "#6bc7ff" },
    { icon: "📸", label: "Journal", count: (journalEntries || []).length, onPress: exportJournal, color: "#8effab" },
  ];

return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {buttons.map((b) => (
          <Pressable
            key={b.label}
            onPress={b.onPress}
            accessibilityRole="button"
            accessibilityLabel={`Export ${b.label} as CSV`}
            style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${b.color}30` }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${b.color}1a`, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22 }}>{b.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{b.label}</Text>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                {b.count} {b.count === 1 ? "entry" : "entries"}
              </Text>
            </View>
            <Text style={{ color: b.color, fontSize: 15, fontWeight: "900" }}>Export ›</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const WATER_UNITS = [
  { id: "cups", label: "cups", toGal: 0.0625 },
  { id: "gal", label: "gallons", toGal: 1 },
  { id: "L", label: "liters", toGal: 0.264172 },
];
function toGallons(amount, unit) {
  const u = WATER_UNITS.find((x) => x.id === unit) || WATER_UNITS[1];
  const n = parseFloat(amount);
  return Number.isNaN(n) ? 0 : n * u.toGal;
}
function WaterUsageCard({ theme, savedPlants, wateringAmounts, setWateringAmounts, onUndoToast }) {
  const [plant, setPlant] = useState("Garden");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("gal");
  const [showPanel, setShowPanel] = useState(false);

  const plantOptions = ["Garden", ...(savedPlants || [])];
  const log = wateringAmounts || [];

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const totalGal = log.reduce((sum, e) => sum + toGallons(e.amount, e.unit), 0);
  const weekGal = log
    .filter((e) => new Date(e.createdAt).getTime() >= weekAgo)
    .reduce((sum, e) => sum + toGallons(e.amount, e.unit), 0);

  // Thirstiest plant by total gallons.
  const byPlant = {};
  log.forEach((e) => {
    byPlant[e.plantName] = (byPlant[e.plantName] || 0) + toGallons(e.amount, e.unit);
  });
  const thirstiest = Object.entries(byPlant).sort((a, b) => b[1] - a[1])[0];

  const addEntry = () => {
    const n = parseFloat(amount);
    if (Number.isNaN(n) || n <= 0) {
      Alert.alert("Enter an amount", "Type how much you watered (e.g. 2).");
      return;
    }
    tapHaptic("light");
    const entry = {
      id: Date.now().toString(),
      plantName: plant,
      amount: n,
      unit,
      date: getTodayKey(),
      createdAt: new Date().toISOString(),
    };
    setWateringAmounts((current) => [entry, ...current]);
    setAmount("");
    setShowPanel(false);
  };

  const deleteEntry = (id) => {
    const removed = log.find((e) => e.id === id);
    if (!removed) return;
    tapHaptic("light");
    setWateringAmounts((current) => current.filter((e) => e.id !== id));
    if (onUndoToast) {
      onUndoToast("Watering entry deleted", () => {
        setWateringAmounts((current) => [removed, ...current].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ));
      });
    }
  };

  const fmtGal = (g) => (g >= 10 ? Math.round(g) : Math.round(g * 10) / 10);

return (
    <View>

      {/* STATS */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
        <View style={{ flex: 1, borderRadius: 18, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(107,199,255,0.10)", borderWidth: 1, borderColor: "rgba(107,199,255,0.24)" }}>
          <Text style={{ fontSize: 22 }}>📅</Text>
          <Text style={{ color: "#6bc7ff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{fmtGal(weekGal)}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>gal this week</Text>
        </View>
        <View style={{ flex: 1, borderRadius: 18, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
          <Text style={{ fontSize: 22 }}>💧</Text>
          <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{fmtGal(totalGal)}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>gal all-time</Text>
        </View>
      </View>

      {thirstiest && thirstiest[1] > 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 14, textAlign: "center" }}>
          💧 Thirstiest: <Text style={{ color: "#6bc7ff", fontWeight: "900" }}>{thirstiest[0]}</Text> (~{fmtGal(thirstiest[1])} gal)
        </Text>
      ) : null}

      {/* ADD BUTTON / PANEL */}
      {showPanel ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.20)" }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>WHICH PLANT?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {plantOptions.map((p) => {
              const active = plant === p;
              return (
                <Pressable key={p} onPress={() => setPlant(p)}
                  style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: active ? "#6bc7ff" : "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: active ? "#6bc7ff" : "rgba(255,255,255,0.10)" }}>
                  <Text style={{ color: active ? "#07120b" : "#ffffff", fontSize: 13, fontWeight: "800" }}>
                    {p === "Garden" ? "🌍 Whole Garden" : p}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginTop: 14, marginBottom: 8 }}>HOW MUCH?</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g. 2"
              placeholderTextColor="#8fbf9d"
              keyboardType="decimal-pad"
              style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.22)", color: "#ffffff", fontSize: 16, fontWeight: "800", paddingHorizontal: 16, paddingVertical: 12 }}
            />
            <View style={{ flexDirection: "row", gap: 6 }}>
              {WATER_UNITS.map((u) => {
                const active = unit === u.id;
                return (
                  <Pressable key={u.id} onPress={() => setUnit(u.id)}
                    style={{ borderRadius: 12, paddingHorizontal: 12, justifyContent: "center", backgroundColor: active ? "#6bc7ff" : "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: active ? "#6bc7ff" : "rgba(255,255,255,0.10)" }}>
                    <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{u.id}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable onPress={addEntry} style={{ marginTop: 12, backgroundColor: "#6bc7ff", borderRadius: 14, paddingVertical: 13, alignItems: "center" }}>
            <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>💧 Log Watering</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => setShowPanel(true)}
          style={{ marginTop: 16, backgroundColor: "#6bc7ff", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>＋ Log a Watering Amount</Text>
        </Pressable>
      )}

      {/* RECENT ENTRIES */}
      {log.length > 0 ? (
        <View style={{ gap: 8, marginTop: 16 }}>
          {log.slice(0, 6).map((e) => (
            <View key={e.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>
                  {e.plantName === "Garden" ? "🌍 Whole Garden" : e.plantName}
                </Text>
                <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                  {e.amount} {e.unit} · {new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Text>
              </View>
              <Pressable onPress={() => deleteEntry(e.id)} style={{ padding: 6 }}>
                <Text style={{ color: "#ff7b7b", fontSize: 15, fontWeight: "900" }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function HarvestLogCard({ theme, harvestLog, setHarvestLog, onUndoToast }) {
  const total = harvestLog.length;
  const plantsHarvested = new Set(harvestLog.map((h) => h.plantName)).size;
  const thisMonth = harvestLog.filter((h) => {
    const d = new Date(h.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const deleteEntry = (id) => {
    const removed = harvestLog.find((h) => h.id === id);
    if (!removed) return;
    tapHaptic("light");
    setHarvestLog((c) => c.filter((h) => h.id !== id));
    if (onUndoToast) {
      onUndoToast("Harvest deleted", () => {
        setHarvestLog((c) => [removed, ...c].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      });
    }
  };

return (
    <View>

      <View style={styles.careLogStatsRow}>
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{total}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Total Harvests</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{plantsHarvested}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Plants</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{thisMonth}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>This Month</Text>
        </View>
      </View>

      {total === 0 ? (
        <View style={styles.careLogEmpty}>
          <Text style={styles.careLogEmptyIcon}>🚜</Text>
          <Text style={styles.careLogEmptyTitle}>No harvests logged yet</Text>
          <Text style={[styles.careLogEmptyText, { color: theme.secondaryText }]}>
            Open a plant and tap "Log a Harvest" when you pick something. It'll show up here.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 10, marginTop: 4 }}>
          {harvestLog.map((entry) => (
          <View key={entry.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>{entry.plantName}</Text>
              <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>{entry.amount} {entry.unit} · {formatRelativeDate(entry.createdAt)}</Text>
            </View>
            <Pressable onPress={() => deleteEntry(entry.id)} style={{ padding: 6 }}>
              <Text style={{ color: "#ff7b7b", fontSize: 15, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        ))}
        </View>
      )}
    </View>
  );
}

function getPlantingGuide(item) {
  const type = normalizeType(item?.type, item?.name);
  const name = String(item?.name || "").toLowerCase();

  // Category-based defaults
  const GUIDES = {
    "Vegetables": { depth: '1/4"–1/2"', spacing: '6"–12"', sun: "Full sun", germ: "7–14 days" },
    "Herbs": { depth: '1/4"', spacing: '8"–12"', sun: "Full to partial sun", germ: "7–21 days" },
    "Berries": { depth: '1"–2"', spacing: '18"–36"', sun: "Full sun", germ: "N/A (transplant)" },
    "Tree Fruits": { depth: "Root ball depth", spacing: "10–20 ft", sun: "Full sun", germ: "N/A (transplant)" },
    "Tropical Fruits": { depth: "Root ball depth", spacing: "6–15 ft", sun: "Full sun", germ: "N/A (transplant)" },
  };

  // Name-based overrides for common specifics
  let guide = { ...(GUIDES[type] || GUIDES["Vegetables"]) };
  if (["carrot", "radish", "beet", "turnip"].some((w) => name.includes(w))) {
    guide = { depth: '1/4"–1/2"', spacing: '2"–4"', sun: "Full sun", germ: "5–10 days" };
  } else if (["tomato", "pepper", "eggplant"].some((w) => name.includes(w))) {
    guide = { depth: '1/4"', spacing: '18"–24"', sun: "Full sun (6–8 hrs)", germ: "6–14 days" };
  } else if (["lettuce", "spinach", "kale", "arugula"].some((w) => name.includes(w))) {
    guide = { depth: '1/4"', spacing: '6"–12"', sun: "Full to partial sun", germ: "5–10 days" };
  } else if (["squash", "zucchini", "cucumber", "pumpkin", "melon"].some((w) => name.includes(w))) {
    guide = { depth: '1"', spacing: '24"–36"', sun: "Full sun", germ: "7–10 days" };
  } else if (["bean", "pea"].some((w) => name.includes(w))) {
    guide = { depth: '1"–1.5"', spacing: '3"–6"', sun: "Full sun", germ: "7–14 days" };
  } else if (["corn"].some((w) => name.includes(w))) {
    guide = { depth: '1"–2"', spacing: '8"–12"', sun: "Full sun", germ: "7–10 days" };
  } else if (["onion", "garlic"].some((w) => name.includes(w))) {
    guide = { depth: '1"–2"', spacing: '4"–6"', sun: "Full sun", germ: "7–14 days" };
  }
  return guide;
}

function PlantingGuideCard({ theme, plant }) {
  if (!plant) return null;
  const guide = getPlantingGuide(plant);
  const rows = [
    { icon: "📏", label: "Plant depth", value: guide.depth },
    { icon: "↔️", label: "Spacing", value: guide.spacing },
    { icon: "☀️", label: "Sunlight", value: guide.sun },
    { icon: "🌱", label: "Germination", value: guide.germ },
  ];
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "rgba(142,255,171,0.28)" }]}>
      <Text style={styles.cardEyebrow}>📐 PLANTING GUIDE</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        General guidance for {plant.name}. Check your seed packet for variety-specific details.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map((r) => (
          <View key={r.label} style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(142,255,171,0.12)" }}>
            <Text style={{ fontSize: 20 }}>{r.icon}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800", flex: 1 }}>{r.label}</Text>
            <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>{r.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
function HarvestRevealCard({ theme, journalEntries, harvestLog, onOpenPlant }) {
  // Plants that have been harvested AND have 2+ journal photos
  const harvestedNames = Array.from(new Set((harvestLog || []).map((h) => h.plantName)));

  const reveals = harvestedNames
    .map((name) => {
    const photos = (journalEntries || [])
        .filter((e) => e.plantName === name && e.imageUri)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      if (photos.length < 2) return null;
      const first = photos[0];
      const last = photos[photos.length - 1];
      const daysBetween = Math.max(
        1,
        Math.round((new Date(last.createdAt) - new Date(first.createdAt)) / (1000 * 60 * 60 * 24))
      );
      return { name, first, last, daysBetween, photoCount: photos.length };
    })
    .filter(Boolean);

  if (!reveals.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#ffd86b" }]}>
      <Text style={styles.cardEyebrow}>🌱➡️🍅 THE GLOW-UP</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>How Far They've Come</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Your harvested plants, from first photo to latest. Look at that growth.
      </Text>
      <View style={{ gap: 16, marginTop: 16 }}>
        {reveals.map((r) => {
          const plant = produceData.find((p) => p.name === r.name);
          return (
            <Pressable
              key={`reveal-${r.name}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 14, borderWidth: 1, borderColor: "rgba(255,216,107,0.18)" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900" }}>{r.name}</Text>
                <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "800" }}>{r.daysBetween} days apart</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Image source={{ uri: r.first.imageUri }} style={{ width: "100%", height: 130, borderRadius: 14, backgroundColor: "#0e2414" }} resizeMode="cover" />
                  <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", textAlign: "center", marginTop: 6 }}>🌱 First photo</Text>
                </View>
                <Text style={{ color: "#ffd86b", fontSize: 22, fontWeight: "900" }}>→</Text>
                <View style={{ flex: 1 }}>
                  <Image source={{ uri: r.last.imageUri }} style={{ width: "100%", height: 130, borderRadius: 14, backgroundColor: "#0e2414" }} resizeMode="cover" />
                  <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", textAlign: "center", marginTop: 6 }}>🍅 Latest</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
function AllNotesCard({ theme, plantNotes, onOpenPlant }) {
  const [query, setQuery] = useState("");

  const notes = Object.entries(plantNotes || {})
    .filter(([, text]) => String(text || "").trim().length > 0)
    .map(([name, text]) => ({ name, text: text.trim() }));

  if (!notes.length) return null;

  const q = query.toLowerCase().trim();
  const filtered = q
    ? notes.filter((n) => n.name.toLowerCase().includes(q) || n.text.toLowerCase().includes(q))
    : notes;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "rgba(142,255,171,0.28)" }]}>
      <Text style={styles.cardEyebrow}>📝 MY GARDEN NOTES</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>All Your Plant Notes</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Everything you've written across your plants, in one searchable place.
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(142,255,171,0.18)", paddingHorizontal: 14, marginTop: 16, gap: 10 }}>
        <Text style={{ fontSize: 16 }}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search your notes..."
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, color: "#ffffff", fontSize: 14, fontWeight: "700", paddingVertical: 12 }}
        />
        {query ? (
          <Pressable onPress={() => setQuery("")}>
            <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900" }}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {filtered.length === 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 16, textAlign: "center", lineHeight: 20 }}>
          No notes match "{query}". Try a different word.
        </Text>
      ) : (
        <View style={{ gap: 10, marginTop: 16 }}>
          {filtered.map((n) => {
            const plant = produceData.find((p) => p.name === n.name);
            const img = plant ? resolvePlantImageSource(plant) : null;
            return (
              <Pressable
                key={`note-${n.name}`}
                onPress={() => plant && onOpenPlant(plant)}
                style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(142,255,171,0.14)" }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>🌱</Text>}
                  </View>
                  <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "900", flex: 1 }}>{n.name}</Text>
                  {plant ? <Text style={{ color: "#8effab", fontSize: 18, fontWeight: "900" }}>›</Text> : null}
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19 }} numberOfLines={4}>
                  {n.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
function SoilCareLogCard({ theme, savedPlants, careLog, setCareLog, onFertilizerLogged, onUndoToast }) {
  const [selectedPlant, setSelectedPlant] = useState("Garden");
  const [customNote, setCustomNote] = useState("");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [filterPlant, setFilterPlant] = useState("All");
  const [todayOnly, setTodayOnly] = useState(false);

  const CARE_ACTIONS = [
    { id: "compost", label: "Added Compost", icon: "🌿", color: "#8effab" },
    { id: "repot", label: "Repotted", icon: "🪴", color: "#ffd86b" },
    { id: "pests", label: "Treated Pests", icon: "🐛", color: "#ff7b7b" },
    { id: "ph", label: "pH Tested", icon: "🧪", color: "#6bc7ff" },
    { id: "fertilize", label: "Fertilized", icon: "🌾", color: "#ff9f43" },
    { id: "pruned", label: "Pruned", icon: "✂️", color: "#d8c8ff" },
    { id: "mulch", label: "Mulched", icon: "🍂", color: "#bf7a12" },
    { id: "transplant", label: "Transplanted", icon: "🚚", color: "#5cff89" },
    { id: "watered", label: "Deep Watered", icon: "💧", color: "#6bc7ff" },
    { id: "staked", label: "Staked/Trellised", icon: "🪵", color: "#d7ebdc" },
    { id: "harvest", label: "Harvested", icon: "🎉", color: "#ffd86b" },
    { id: "custom", label: "Custom Note", icon: "📝", color: "#8effab" },
  ];

  const plantOptions = ["Garden", ...savedPlants];

  const addCareEntry = () => {
    if (!selectedAction) {
      Alert.alert("Select an action", "Please tap a care action before logging.");
      return;
    }
    const action = CARE_ACTIONS.find(a => a.id === selectedAction);
    const entry = {
      id: Date.now().toString(),
      date: getTodayKey(),
      plant: selectedPlant,
      actionId: selectedAction,
      actionLabel: action.label,
      actionIcon: action.icon,
      actionColor: action.color,
      note: customNote.trim(),
      createdAt: new Date().toISOString(),
    };
    setCareLog(current => [entry, ...current]);
    setSelectedAction(null);
    setCustomNote("");
    setShowAddPanel(false);

    if (selectedAction === "fertilize" && selectedPlant !== "Garden" && onFertilizerLogged) {
      Alert.alert(
        "Fertilized! 🌾",
        `Want a reminder to fertilize ${selectedPlant} again?`,
        [
          { text: "No thanks", style: "cancel" },
          { text: "In 7 days", onPress: () => onFertilizerLogged(selectedPlant, 7) },
          { text: "In 14 days", onPress: () => onFertilizerLogged(selectedPlant, 14) },
          { text: "In 30 days", onPress: () => onFertilizerLogged(selectedPlant, 30) },
        ]
      );
    } else {
      Alert.alert("Care logged! 🌱", `${action.icon} ${action.label} logged for ${selectedPlant}.`);
    }
  };

  const deleteCareEntry = (id) => {
    const removed = careLog.find((e) => e.id === id);
    if (!removed) return;
    tapHaptic("light");
    setCareLog((current) => current.filter((e) => e.id !== id));
    if (onUndoToast) {
      onUndoToast("Care entry deleted", () => {
        setCareLog((current) => [removed, ...current].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      });
    }
  };

  // Calendar helpers
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
  const monthLabel = new Date(calendarYear, calendarMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const getEntriesForDate = (dateStr) => {
    return careLog.filter(e => e.date === dateStr && (filterPlant === "All" || e.plant === filterPlant));
  };

  const getDateKey = (day) => {
    const d = new Date(calendarYear, calendarMonth, day);
    return d.toISOString().slice(0, 10);
  };

  const hasEntries = (day) => getEntriesForDate(getDateKey(day)).length > 0;
  const getEntryColor = (day) => {
    const entries = getEntriesForDate(getDateKey(day));
    if (!entries.length) return null;
    return entries[0].actionColor;
  };

  const selectedDateEntries = getEntriesForDate(selectedDate);

  const filteredLog = careLog.filter(e =>
    (filterPlant === "All" || e.plant === filterPlant) &&
    (!todayOnly || e.date === getTodayKey())
  );

  // Stats
  const totalEntries = careLog.length;
  const thisMonthEntries = careLog.filter(e => {
    const d = new Date(e.createdAt);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;
  const mostCommonAction = (() => {
    const counts = {};
    careLog.forEach(e => { counts[e.actionId] = (counts[e.actionId] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return null;
    return CARE_ACTIONS.find(a => a.id === top[0]);
  })();
  const plantsLogged = new Set(careLog.map(e => e.plant).filter(p => p !== "Garden")).size;

return (
    <View>

      {/* HEADER */}
      <Text style={[styles.cardTitle, { color: theme.text }]}>Garden Care Tracker</Text>

      {/* STATS ROW */}
      <View style={styles.careLogStatsRow}>
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{totalEntries}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Total Logs</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{thisMonthEntries}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>This Month</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{plantsLogged}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Plants Tracked</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{mostCommonAction?.icon || "—"}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Top Action</Text>
        </View>
      </View>

      {/* MONTHLY SUMMARY */}
      {thisMonthEntries > 0 ? (
        <View style={{ marginBottom: 14, backgroundColor: "rgba(107,199,255,0.08)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(107,199,255,0.20)" }}>
          <Text style={{ color: "#6bc7ff", fontSize: 13, fontWeight: "900", lineHeight: 19 }}>
            📊 {thisMonthEntries} care action{thisMonthEntries === 1 ? "" : "s"} logged this month
            {mostCommonAction ? ` • most often ${mostCommonAction.icon} ${mostCommonAction.label}` : ""}
          </Text>
        </View>
      ) : null}

      {/* ADD ENTRY BUTTON */}
      <Pressable
        onPress={() => setShowAddPanel(!showAddPanel)}
        style={[styles.careLogAddButton, { backgroundColor: showAddPanel ? "rgba(107,199,255,0.18)" : "#6bc7ff" }]}
      >
        <Text style={[styles.careLogAddButtonText, { color: showAddPanel ? "#6bc7ff" : "#07120b" }]}>
          {showAddPanel ? "✕ Cancel" : "＋ Log Care Action"}
        </Text>
      </Pressable>

      {/* ADD PANEL */}
      {showAddPanel ? (
        <View style={styles.careLogAddPanel}>

          {/* PLANT SELECTOR */}
          <Text style={styles.careLogPanelLabel}>Which plant?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {plantOptions.map(plant => (
              <Pressable
                key={plant}
                onPress={() => setSelectedPlant(plant)}
                style={[styles.careLogPlantPill, {
                  backgroundColor: selectedPlant === plant ? "#6bc7ff" : "rgba(255,255,255,0.07)",
                  borderColor: selectedPlant === plant ? "#6bc7ff" : "rgba(255,255,255,0.10)",
                }]}
              >
                <Text style={[styles.careLogPlantPillText, { color: selectedPlant === plant ? "#07120b" : "#ffffff" }]}>
                  {plant === "Garden" ? "🌍 Whole Garden" : plant}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ACTION GRID */}
          <Text style={[styles.careLogPanelLabel, { marginTop: 14 }]}>What did you do?</Text>
          <View style={styles.careLogActionGrid}>
            {CARE_ACTIONS.map(action => (
              <Pressable
                key={action.id}
                onPress={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
                style={[styles.careLogActionTile, {
                  backgroundColor: selectedAction === action.id ? action.color + "25" : "rgba(255,255,255,0.06)",
                  borderColor: selectedAction === action.id ? action.color : "rgba(255,255,255,0.08)",
                  borderWidth: selectedAction === action.id ? 2 : 1,
                }]}
              >
                <Text style={styles.careLogActionIcon}>{action.icon}</Text>
                <Text style={[styles.careLogActionLabel, { color: selectedAction === action.id ? action.color : "#d7ebdc" }]}>
                  {action.label}
                </Text>
                {selectedAction === action.id ? (
                  <View style={[styles.careLogActionCheck, { backgroundColor: action.color }]}>
                    <Text style={styles.careLogActionCheckText}>✓</Text>
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>

          {/* CUSTOM NOTE */}
          <Text style={[styles.careLogPanelLabel, { marginTop: 14 }]}>Add a note (optional)</Text>
          <TextInput
            value={customNote}
            onChangeText={setCustomNote}
            placeholder="e.g. Used organic neem oil, pH was 6.5, added 2 cups compost..."
            placeholderTextColor="#8fbf9d"
            multiline
            style={styles.careLogNoteInput}
          />

          {/* LOG BUTTON */}
          <Pressable onPress={addCareEntry} style={styles.careLogSubmitButton}>
            <Text style={styles.careLogSubmitButtonText}>✅ Log Care Entry</Text>
          </Pressable>
        </View>
      ) : null}

      {/* VIEW MODE TOGGLE */}
      {careLog.length > 0 ? (
        <>
          <View style={styles.careLogViewToggle}>
            {[{ id: "calendar", label: "📅 Calendar" }, { id: "timeline", label: "📋 Timeline" }].map(v => (
              <Pressable
                key={v.id}
                onPress={() => setViewMode(v.id)}
                style={[styles.careLogViewBtn, viewMode === v.id && styles.careLogViewBtnActive]}
              >
                <Text style={[styles.careLogViewBtnText, viewMode === v.id && styles.careLogViewBtnTextActive]}>
                  {v.label}
                </Text>
              </Pressable>
            ))}
          </View>

         {/* PLANT FILTER */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10 }}>
            <Pressable
              onPress={() => setTodayOnly(v => !v)}
              style={[styles.journalFilterPill, todayOnly && styles.journalFilterPillActive]}
            >
              <Text style={[styles.journalFilterPillText, todayOnly && styles.journalFilterPillTextActive]}>
                📅 Today
              </Text>
            </Pressable>
            {["All", "Garden", ...savedPlants].map(plant => (
              <Pressable
                key={plant}
                onPress={() => setFilterPlant(plant)}
                style={[styles.journalFilterPill, filterPlant === plant && styles.journalFilterPillActive]}
              >
                <Text style={[styles.journalFilterPillText, filterPlant === plant && styles.journalFilterPillTextActive]}>
                  {plant === "All" ? "🌿 All" : plant === "Garden" ? "🌍 Garden" : plant}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* CALENDAR VIEW */}
          {viewMode === "calendar" ? (
            <View style={styles.careLogCalendar}>
              {/* MONTH NAV */}
              <View style={styles.careLogCalendarNav}>
                <Pressable
                  onPress={() => {
                    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
                    else setCalendarMonth(m => m - 1);
                  }}
                  style={styles.careLogCalendarNavBtn}
                >
                  <Text style={styles.careLogCalendarNavText}>‹</Text>
                </Pressable>
                <Text style={styles.careLogCalendarMonthLabel}>{monthLabel}</Text>
                <Pressable
                  onPress={() => {
                    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
                    else setCalendarMonth(m => m + 1);
                  }}
                  style={styles.careLogCalendarNavBtn}
                >
                  <Text style={styles.careLogCalendarNavText}>›</Text>
                </Pressable>
              </View>

              {/* DAY LABELS */}
              <View style={styles.careLogCalendarDayLabels}>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                  <Text key={d} style={styles.careLogCalendarDayLabel}>{d}</Text>
                ))}
              </View>

              {/* GRID */}
              <View style={styles.careLogCalendarGrid}>
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.careLogCalendarCell} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dateKey = getDateKey(day);
                  const isToday = dateKey === getTodayKey();
                  const isSelected = dateKey === selectedDate;
                  const hasLog = hasEntries(day);
                  const dotColor = getEntryColor(day);
                  return (
                    <Pressable
                      key={day}
                      onPress={() => setSelectedDate(dateKey)}
                      style={[styles.careLogCalendarCell, {
                        backgroundColor: isSelected
                          ? "#6bc7ff"
                          : isToday
                          ? "rgba(107,199,255,0.15)"
                          : hasLog
                          ? "rgba(92,255,137,0.10)"
                          : "transparent",
                        borderColor: isSelected ? "#6bc7ff" : isToday ? "rgba(107,199,255,0.40)" : "transparent",
                        borderWidth: isSelected || isToday ? 1.5 : 0,
                      }]}
                    >
                      <Text style={[styles.careLogCalendarDayNum, {
                        color: isSelected ? "#07120b" : isToday ? "#6bc7ff" : "#ffffff",
                        fontWeight: isToday || isSelected ? "900" : "700",
                      }]}>
                        {day}
                      </Text>
                      {hasLog ? (
                        <View style={[styles.careLogCalendarDot, { backgroundColor: isSelected ? "#07120b" : dotColor || "#5cff89" }]} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>

              {/* SELECTED DATE ENTRIES */}
              <View style={styles.careLogSelectedDatePanel}>
                <Text style={styles.careLogSelectedDateLabel}>
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </Text>
                {selectedDateEntries.length === 0 ? (
                  <Text style={[styles.careLogEmptyDate, { color: theme.secondaryText }]}>
                    No care logged for this day. Tap ＋ to add an entry.
                  </Text>
                ) : (
                  <View style={{ gap: 8, marginTop: 10 }}>
                    {selectedDateEntries.map(entry => (
                      <View key={entry.id} style={[styles.careLogEntryRow, { borderColor: entry.actionColor + "40", backgroundColor: entry.actionColor + "0D" }]}>
                        <Text style={styles.careLogEntryIcon}>{entry.actionIcon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.careLogEntryLabel}>{entry.actionLabel}</Text>
                          {entry.plant !== "Garden" ? (
                            <Text style={[styles.careLogEntryPlant, { color: entry.actionColor }]}>🌱 {entry.plant}</Text>
                          ) : (
                            <Text style={[styles.careLogEntryPlant, { color: theme.secondaryText }]}>🌍 Whole Garden</Text>
                          )}
                          {entry.note ? (
                            <Text style={[styles.careLogEntryNote, { color: theme.secondaryText }]}>{entry.note}</Text>
                          ) : null}
                        </View>
                        <Pressable onPress={() => deleteCareEntry(entry.id)} style={styles.careLogDeleteBtn}>
                          <Text style={styles.careLogDeleteBtnText}>✕</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ) : (
            // TIMELINE VIEW
            <View style={{ gap: 10, marginTop: 4 }}>
              {filteredLog.length === 0 ? (
                <Text style={[styles.careLogEmptyDate, { color: theme.secondaryText, textAlign: "center", paddingVertical: 20 }]}>
                  No care entries yet. Tap ＋ to log your first action!
                </Text>
              ) : (
                filteredLog.map(entry => (
                  <View key={entry.id} style={[styles.careLogEntryRow, { borderColor: entry.actionColor + "40", backgroundColor: entry.actionColor + "0D" }]}>
                    <Text style={styles.careLogEntryIcon}>{entry.actionIcon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLogEntryLabel}>{entry.actionLabel}</Text>
                      <Text style={[styles.careLogEntryPlant, { color: entry.actionColor }]}>
                        {entry.plant === "Garden" ? "🌍 Whole Garden" : `🌱 ${entry.plant}`}
                      </Text>
                      {entry.note ? (
                        <Text style={[styles.careLogEntryNote, { color: theme.secondaryText }]}>{entry.note}</Text>
                      ) : null}
                      <Text style={[styles.careLogEntryDate, { color: theme.secondaryText }]}>
                        {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </Text>
                    </View>
                    <Pressable onPress={() => deleteCareEntry(entry.id)} style={styles.careLogDeleteBtn}>
                      <Text style={styles.careLogDeleteBtnText}>✕</Text>
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          )}
        </>
      ) : (
        <View style={styles.careLogEmpty}>
          <Text style={styles.careLogEmptyIcon}>🧪</Text>
          <Text style={styles.careLogEmptyTitle}>No care logged yet</Text>
          <Text style={[styles.careLogEmptyText, { color: theme.secondaryText }]}>
            Tap ＋ above to log your first care action. Track compost, repotting, pest treatment, pH tests, and more.
          </Text>
        </View>
      )}
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
            {isLast ? "Set My Zone 🌿" : "Next →"}
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
    <Text style={styles.premiumPriceText}>🛡️ $2.99/month or $24.99/year • Cancel anytime</Text>
    </View>
  );
}

function PlantHealthAnalyzerCard({ theme }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  async function pickAndAnalyze() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photos Permission Needed", "Allow photo access to analyze plant health.");
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });
    if (picked.canceled) return;
    const uri = picked.assets?.[0]?.uri;
    if (!uri) return;

    setImageUri(uri);
    setAnalyzing(true);
    setResult(null);
    const analysis = await analyzePlantHealth(uri);
    setAnalyzing(false);
    setResult(analysis);
  }

  const getScoreColor = (score) => {
    if (score >= 8) return "#5cff89";
    if (score >= 5) return "#ffd86b";
    return "#ff7b7b";
  };

  const getUrgencyColor = (urgency) => {
    if (urgency === "high") return "#ff7b7b";
    if (urgency === "medium") return "#ffd86b";
    return "#5cff89";
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#6bc7ff" }]}>
      <Text style={styles.cardEyebrow}>🤖 AI PLANT DOCTOR</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Plant Health Analyzer</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Take a photo of any plant and get an instant AI health diagnosis with fixes.
      </Text>

      <Pressable onPress={pickAndAnalyze} disabled={analyzing}
        style={[styles.primaryButton, { marginTop: 16, opacity: analyzing ? 0.7 : 1 }]}>
        <Text style={styles.primaryButtonText}>
          {analyzing ? "🔍 Analyzing..." : "📸 Analyze a Plant"}
        </Text>
      </Pressable>

      {imageUri && (
        <Image source={{ uri: imageUri }}
          style={{ width: "100%", height: 200, borderRadius: 18, marginTop: 16 }}
          resizeMode="cover" />
      )}

      {analyzing && (
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={{ color: "#6bc7ff", fontSize: 15, fontWeight: "900" }}>
            🌿 Diagnosing your plant...
          </Text>
        </View>
      )}

      {result && !analyzing && (
        <View style={{ marginTop: 16, gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14,
            backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 20, padding: 16,
            borderWidth: 1, borderColor: `${getScoreColor(result.healthScore)}40` }}>
            <Text style={{ fontSize: 42, fontWeight: "900",
              color: getScoreColor(result.healthScore) }}>{result.healthScore}/10</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "900" }}>
                {result.plantName}
              </Text>
              <Text style={{ color: result.healthy ? "#5cff89" : "#ff7b7b",
                fontSize: 14, fontWeight: "900", marginTop: 3 }}>
                {result.healthy ? "✅ Healthy" : "⚠️ Needs Attention"}
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: "rgba(107,199,255,0.10)", borderRadius: 18,
            padding: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.25)" }}>
            <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900",
              marginBottom: 6 }}>🔬 DIAGNOSIS</Text>
            <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "700",
              lineHeight: 21 }}>{result.diagnosis}</Text>
          </View>

          {result.issues?.length > 0 && (
            <View style={{ backgroundColor: "rgba(255,123,123,0.08)", borderRadius: 18,
              padding: 14, borderWidth: 1, borderColor: "rgba(255,123,123,0.22)" }}>
              <Text style={{ color: "#ff7b7b", fontSize: 12, fontWeight: "900",
                marginBottom: 8 }}>⚠️ ISSUES DETECTED</Text>
              {result.issues.map((issue, i) => (
                <Text key={i} style={{ color: "#ffd5d5", fontSize: 13, fontWeight: "700",
                  marginBottom: 4, lineHeight: 19 }}>• {issue}</Text>
              ))}
            </View>
          )}

          {result.fixes?.length > 0 && (
            <View style={{ backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 18,
              padding: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}>
              <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900",
                marginBottom: 8 }}>💚 HOW TO FIX IT</Text>
              {result.fixes.map((fix, i) => (
                <Text key={i} style={{ color: "#d7ebdc", fontSize: 13, fontWeight: "700",
                  marginBottom: 4, lineHeight: 19 }}>✓ {fix}</Text>
              ))}
            </View>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10,
            backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12,
            borderWidth: 1, borderColor: `${getUrgencyColor(result.urgency)}30` }}>
            <Text style={{ color: getUrgencyColor(result.urgency), fontSize: 13,
              fontWeight: "900" }}>
              ⚡ Urgency: {result.urgency?.toUpperCase()}
            </Text>
          </View>

          <Pressable onPress={() => { setResult(null); setImageUri(null); }}
            style={{ borderRadius: 16, paddingVertical: 12, alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)" }}>
            <Text style={{ color: "#d7ebdc", fontWeight: "900" }}>Analyze Another Plant</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  authScreen: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  authTitle: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 8,
  },
  authSubtitle: {
    color: "#d7ebdc",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 18,
  },
  authInput: {
    marginTop: 12,
  },
  authButton: {
    backgroundColor: "#5cff89",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
  },
  authButtonText: {
    color: "#07120b",
    fontWeight: "900",
    fontSize: 15,
  },
  authSwitchButton: {
    marginTop: 16,
    alignItems: "center",
  },
  authSwitchText: {
    color: "#8effab",
    fontWeight: "800",
  },
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 150 },
  bgBlobOne: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "#5cff89", opacity: 0.14, top: -80, right: -80 },
  bgBlobTwo: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "#8effab", opacity: 0.1, top: 260, left: -90 },
  bgBlobThree: { position: "absolute", width: 280, height: 280, borderRadius: 140, backgroundColor: "#2fbf5f", opacity: 0.12, bottom: 80, right: -120 },
  bgBlobDark: { backgroundColor: "#5cff89", opacity: 0.12 },
  loadingWrapper: { flex: 1, backgroundColor: "#2d4a1e", alignItems: "center", justifyContent: "center", overflow: "hidden" },
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
 liveWeatherGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 22 },
  liveWeatherBox: { width: "47%", borderRadius: 20, paddingVertical: 18, alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
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
  glowPlantCard: { borderRadius: 24, padding: 16, flexDirection: "column", overflow: "hidden", borderWidth: 1 },
  cardGlowOrb: { position: "absolute", width: 180, height: 180, borderRadius: 90, opacity: 0.12, top: -70, right: -70 },
glowPlantImageWrap: { width: 90, alignItems: "center", justifyContent: "center", paddingTop: 0 },
glowPlantImage: { width: 80, height: 80, resizeMode: "contain" },
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
  controlTileSubtext: { marginTop: 4, color: "#8fbf9d", fontSize: 10, fontWeight: "700", textAlign: "center" },
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
  bottomTabs: { position: "absolute", left: 8, right: 8, bottom: 20, flexDirection: "row", backgroundColor: "rgba(10,18,14,0.88)", borderRadius: 34, padding: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", shadowColor: "#000", shadowOpacity: 0.28, shadowRadius: 24, shadowOffset: { width: 0, height: 14 }, elevation: 22 },
  bottomTabButton: { flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 24 },
  bottomTabButtonActive: { backgroundColor: "#5cff89", borderRadius: 22, shadowColor: "#5cff89", shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 12 },
  bottomTabText: {
  marginTop: 4,
  fontSize: 9,
  fontWeight: "900",
  textAlign: "center",
  flexShrink: 1,
  minWidth: 0,
  color: "#d7ebdc",
},
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
  frostBanner: { flexDirection: "row", alignItems: "flex-start", gap: 14, borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(107,199,255,0.10)" },
  frostBannerIcon: { fontSize: 34 },
  frostBannerTitle: { color: "#6bc7ff", fontSize: 18, fontWeight: "900" },
  frostBannerText: { color: "#d7ebdc", fontSize: 13, lineHeight: 20, fontWeight: "700", marginTop: 4 },
  frostBannerHint: { color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 8, fontStyle: "italic" },
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
  bottomTabInner: {
  alignItems: "center",
  justifyContent: "center",
  minWidth: 0,
},
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
glowPlantImageDarkWrap: { width: 80, height: 80, borderRadius: 18, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" },
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

compactSavedPlantWatered: {
  marginTop: 3,
  fontSize: 9,
  fontWeight: "700",
  color: "#8fbf9d",
},

compactSavedPlantStreak: {
  marginTop: 2,
  fontSize: 9,
  fontWeight: "900",
  color: "#ff9f43",
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
accountInfoBox: {
  marginTop: 14,
  padding: 14,
  borderRadius: 18,
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.18)",
},

accountInfoLabel: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: 0.5,
},

accountInfoValue: {
  marginTop: 6,
  color: "#ffffff",
  fontSize: 15,
  fontWeight: "800",
},
accountInput: {
  marginTop: 12,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.22)",
  backgroundColor: "rgba(255,255,255,0.07)",
  color: "#ffffff",
  paddingHorizontal: 14,
  paddingVertical: 13,
  fontSize: 14,
  fontWeight: "700",
},

accountActionButton: {
  marginTop: 12,
  backgroundColor: "#5cff89",
  borderRadius: 16,
  paddingVertical: 13,
  alignItems: "center",
},

accountActionButtonText: {
  color: "#07120b",
  fontWeight: "900",
  fontSize: 13,
},

accountSecondaryButton: {
  marginTop: 16,
  borderRadius: 16,
  paddingVertical: 14,
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.22)",
},

accountSecondaryButtonText: {
  color: "#8effab",
  fontWeight: "900",
  fontSize: 13,
},
accountStatsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 16,
},

accountStatTile: {
  width: "48%",
  borderRadius: 18,
  padding: 14,
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.18)",
},

accountStatValue: {
  color: "#ffffff",
  fontSize: 22,
  fontWeight: "900",
},

accountStatLabel: {
  marginTop: 6,
  color: "#8effab",
  fontSize: 11,
  fontWeight: "900",
  textTransform: "uppercase",
},

accountSyncBox: {
  marginTop: 14,
  padding: 14,
  borderRadius: 18,
  backgroundColor: "rgba(92,255,137,0.10)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.22)",
},
journalImage: {
  width: "100%",
  height: 220,
  borderRadius: 24,
  marginBottom: 18,
  backgroundColor: "rgba(255,255,255,0.08)",
},
fertilizerCard: {
  borderRadius: 30,
  padding: 20,
  marginBottom: 18,
  borderWidth: 1,
  shadowColor: "#8effab",
  shadowOpacity: 0.15,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 4,
},
fertilizerEyebrow: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.6,
},
fertilizerTitle: {
  marginTop: 6,
  fontSize: 24,
  fontWeight: "900",
},
fertilizerSubtext: {
  marginTop: 8,
  fontSize: 14,
  lineHeight: 21,
  fontWeight: "700",
},
fertilizerGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 18,
},
fertilizerTile: {
  width: "47%",
  borderRadius: 20,
  padding: 14,
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 1,
  borderColor: "rgba(142,255,171,0.16)",
},
fertilizerTileIcon: {
  fontSize: 22,
},
fertilizerTileLabel: {
  color: "#8effab",
  fontSize: 11,
  fontWeight: "900",
  marginTop: 8,
  textTransform: "uppercase",
},
fertilizerTileValue: {
  color: "#ffffff",
  fontSize: 13,
  fontWeight: "800",
  marginTop: 4,
  lineHeight: 18,
},
fertilizerWeatherBox: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  marginTop: 18,
  borderRadius: 20,
  padding: 14,
  borderWidth: 1,
},
fertilizerWeatherIcon: {
  fontSize: 24,
},
fertilizerWeatherText: {
  flex: 1,
  fontSize: 13,
  lineHeight: 20,
  fontWeight: "700",
},
fertilizerTipBox: {
  marginTop: 16,
  borderRadius: 20,
  padding: 14,
  backgroundColor: "rgba(92,255,137,0.08)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.20)",
},
fertilizerTipTitle: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
  marginBottom: 6,
},
fertilizerTipText: {
  fontSize: 13,
  lineHeight: 20,
  fontWeight: "700",
},
fertilizerDueBox: {
  marginTop: 16,
},
fertilizerDueTitle: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
  marginBottom: 10,
},
fertilizerDueRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
},
fertilizerDuePill: {
  backgroundColor: "rgba(92,255,137,0.12)",
  borderRadius: 999,
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.25)",
},
fertilizerDuePillText: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
},
shopLinkButton: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  backgroundColor: "rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: 14,
  marginTop: 12,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.18)",
},
shopLinkIcon: {
  fontSize: 26,
},
shopLinkTitle: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
},
shopLinkSub: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "700",
  marginTop: 3,
},
shopLinkArrow: {
  color: "#5cff89",
  fontSize: 26,
  fontWeight: "900",
},
companionSectionHeader: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginTop: 24,
  marginBottom: 8,
},
companionSectionEmoji: {
  fontSize: 20,
},
companionExcellentGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  marginBottom: 8,
},
companionExcellentCard: {
  width: "47%",
  borderRadius: 22,
  padding: 16,
  backgroundColor: "rgba(92,255,137,0.10)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.28)",
  alignItems: "center",
},
companionExcellentIconWrap: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: "rgba(92,255,137,0.16)",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
},
companionExcellentIcon: {
  fontSize: 26,
},
companionExcellentName: {
  color: "#ffffff",
  fontSize: 15,
  fontWeight: "900",
  textAlign: "center",
},
companionExcellentBadge: {
  marginTop: 8,
  backgroundColor: "rgba(92,255,137,0.20)",
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 5,
},
companionExcellentBadgeText: {
  color: "#5cff89",
  fontSize: 11,
  fontWeight: "900",
},
companionNeutralRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 8,
},
companionNeutralPill: {
  backgroundColor: "rgba(255,216,107,0.10)",
  borderRadius: 999,
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: "rgba(255,216,107,0.25)",
},
companionNeutralText: {
  color: "#ffd86b",
  fontSize: 13,
  fontWeight: "800",
},
companionAvoidGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  marginBottom: 8,
},
companionAvoidCard: {
  width: "47%",
  borderRadius: 22,
  padding: 16,
  backgroundColor: "rgba(255,123,123,0.10)",
  borderWidth: 1,
  borderColor: "rgba(255,123,123,0.28)",
  alignItems: "center",
},
companionAvoidIcon: {
  fontSize: 26,
  marginBottom: 8,
},
companionAvoidName: {
  color: "#ffffff",
  fontSize: 15,
  fontWeight: "900",
  textAlign: "center",
},
companionAvoidSub: {
  marginTop: 6,
  color: "#ffb3b3",
  fontSize: 11,
  fontWeight: "800",
},
companionWarningBox: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 12,
  marginTop: 18,
  borderRadius: 20,
  padding: 16,
  backgroundColor: "rgba(255,123,123,0.10)",
  borderWidth: 1,
  borderColor: "rgba(255,123,123,0.25)",
},
companionWarningIcon: {
  fontSize: 24,
},
companionWarningTitle: {
  color: "#ffffff",
  fontSize: 15,
  fontWeight: "900",
  marginBottom: 6,
},
companionWarningText: {
  color: "#ffdada",
  fontSize: 13,
  lineHeight: 20,
  fontWeight: "700",
},
companionPestBox: {
  marginTop: 18,
  borderRadius: 20,
  padding: 16,
  backgroundColor: "rgba(92,255,137,0.08)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.20)",
},
companionPestTitle: {
  color: "#ffffff",
  fontSize: 15,
  fontWeight: "900",
  marginBottom: 8,
},
companionPestText: {
  color: "#d7ebdc",
  fontSize: 13,
  lineHeight: 21,
  fontWeight: "700",
},
gardenLegendRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 14,
  marginTop: 4,
},
gardenLegendItem: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},
gardenLegendDot: {
  width: 10,
  height: 10,
  borderRadius: 5,
},
gardenLegendText: {
  color: "#d7ebdc",
  fontSize: 11,
  fontWeight: "700",
},
gardenMapStatsBar: {
  flexDirection: "row",
  gap: 10,
  marginBottom: 16,
},
gardenMapStatPill: {
  flex: 1,
  borderRadius: 16,
  padding: 12,
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
gardenMapStatValue: {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: "900",
},
gardenMapStatLabel: {
  color: "#d7ebdc",
  fontSize: 11,
  fontWeight: "700",
  marginTop: 3,
},
gardenSlotV2: {
  width: "30%",
  minHeight: 120,
  borderRadius: 22,
  alignItems: "center",
  justifyContent: "center",
  padding: 10,
  position: "relative",
},
gardenSlotImageWrapV2: {
  width: 50,
  height: 50,
  borderRadius: 14,
  backgroundColor: "#0e2414",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  marginBottom: 6,
},
gardenSlotImageV2: {
  width: 42,
  height: 42,
  resizeMode: "contain",
},
gardenSlotEmptyIcon: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "rgba(92,255,137,0.10)",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 6,
},
gardenSlotEmptyText: {
  color: "#5cff89",
  fontSize: 20,
  fontWeight: "900",
},
gardenSlotLabelV2: {
  fontSize: 11,
  fontWeight: "800",
  textAlign: "center",
  marginBottom: 4,
},
gardenSlotBadgeRow: {
  flexDirection: "row",
  gap: 4,
  flexWrap: "wrap",
  justifyContent: "center",
},
gardenSlotBadge: {
  borderRadius: 999,
  paddingHorizontal: 6,
  paddingVertical: 3,
},
gardenSlotBadgeText: {
  fontSize: 10,
  fontWeight: "900",
},
gardenSlotWarningV2: {
  position: "absolute",
  top: 6,
  right: 8,
  fontSize: 13,
  color: "#ff7b7b",
},
gardenSlotGoodV2: {
  position: "absolute",
  top: 6,
  right: 8,
  fontSize: 13,
  color: "#5cff89",
  fontWeight: "900",
},
gardenSlotSelectedRing: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 22,
  borderWidth: 2,
  borderColor: "#ffd86b",
},
gardenSlotDetailPanel: {
  marginTop: 16,
  borderRadius: 24,
  padding: 18,
  backgroundColor: "rgba(255,216,107,0.08)",
  borderWidth: 1,
  borderColor: "rgba(255,216,107,0.28)",
  gap: 10,
},
gardenSlotDetailHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 4,
},
gardenSlotDetailTitle: {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: "900",
},
gardenSlotChangeButton: {
  backgroundColor: "rgba(255,255,255,0.10)",
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 7,
},
gardenSlotChangeText: {
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
},
gardenSlotInfoRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  borderRadius: 16,
  padding: 12,
},
gardenSlotInfoIcon: {
  fontSize: 18,
},
gardenSlotInfoText: {
  color: "#ffffff",
  fontSize: 13,
  fontWeight: "700",
  flex: 1,
},
gardenSlotCompanionRow: {
  marginTop: 4,
},
gardenSlotCompanionLabel: {
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "900",
  marginBottom: 8,
},
gardenSlotPillRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
},
gardenSlotPill: {
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderWidth: 1,
},
gardenSlotPillText: {
  fontSize: 12,
  fontWeight: "800",
},
gardenSlotClearButton: {
  marginTop: 6,
  borderRadius: 16,
  paddingVertical: 12,
  alignItems: "center",
  backgroundColor: "rgba(255,123,123,0.12)",
  borderWidth: 1,
  borderColor: "rgba(255,123,123,0.25)",
},
gardenSlotClearText: {
  color: "#ff7b7b",
  fontSize: 13,
  fontWeight: "900",
},
gardenMapEmptyState: {
  alignItems: "center",
  paddingVertical: 28,
  paddingHorizontal: 20,
  marginTop: 8,
},
gardenMapEmptyIcon: {
  fontSize: 44,
  marginBottom: 12,
},
gardenMapEmptyTitle: {
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "900",
  textAlign: "center",
  marginBottom: 8,
},
gardenMapEmptyText: {
  color: "#d7ebdc",
  fontSize: 14,
  lineHeight: 21,
  fontWeight: "700",
  textAlign: "center",
},
journalStatsBar: {
  flexDirection: "row",
  gap: 10,
  marginTop: 16,
  marginBottom: 4,
},
journalStatTile: {
  flex: 1,
  borderRadius: 18,
  padding: 12,
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.16)",
},
journalStatValue: {
  color: "#ffffff",
  fontSize: 22,
  fontWeight: "900",
},
journalStatLabel: {
  color: "#8effab",
  fontSize: 10,
  fontWeight: "800",
  marginTop: 3,
  textTransform: "uppercase",
},
journalAchievementScroll: {
  gap: 10,
  paddingTop: 14,
  paddingBottom: 4,
},
journalAchievementBadgeV2: {
  alignItems: "center",
  backgroundColor: "rgba(92,255,137,0.08)",
  borderRadius: 18,
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderWidth: 1,
  minWidth: 80,
  position: "relative",
},
journalAchievementIconV2: {
  fontSize: 22,
  marginBottom: 4,
},
journalAchievementTextV2: {
  color: "#d7ebdc",
  fontSize: 11,
  fontWeight: "800",
  textAlign: "center",
},
journalAchievementCheck: {
  position: "absolute",
  top: 4,
  right: 6,
  color: "#5cff89",
  fontSize: 10,
  fontWeight: "900",
},
journalSearchBar: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.07)",
  borderRadius: 18,
  borderWidth: 1,
  borderColor: "rgba(142,255,171,0.18)",
  paddingHorizontal: 14,
  paddingVertical: 4,
  marginTop: 16,
  gap: 10,
},
journalSearchIcon: {
  fontSize: 16,
},
journalSearchInput: {
  flex: 1,
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "700",
  paddingVertical: 12,
},
journalSearchClear: {
  color: "#8effab",
  fontSize: 16,
  fontWeight: "900",
  paddingHorizontal: 4,
},
journalFilterScroll: {
  gap: 8,
  paddingTop: 12,
  paddingBottom: 4,
},
journalFilterPill: {
  backgroundColor: "rgba(255,255,255,0.07)",
  borderRadius: 999,
  paddingHorizontal: 14,
  paddingVertical: 9,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
journalFilterPillActive: {
  backgroundColor: "#5cff89",
  borderColor: "#5cff89",
},
journalFilterPillText: {
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "800",
},
journalFilterPillTextActive: {
  color: "#07120b",
},
journalResultsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 12,
  paddingHorizontal: 4,
},
journalResultsText: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "800",
},
journalResultsClear: {
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
},
journalMonthGroup: {
  marginTop: 20,
},
journalMonthHeader: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
},
journalMonthLine: {
  flex: 1,
  height: 1,
  backgroundColor: "rgba(92,255,137,0.18)",
},
journalMonthBadge: {
  backgroundColor: "rgba(92,255,137,0.14)",
  borderRadius: 999,
  paddingHorizontal: 14,
  paddingVertical: 7,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.28)",
},
journalMonthText: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
},
journalEntryWrapV2: {
  position: "relative",
  paddingLeft: 28,
  marginBottom: 20,
},
journalTimelineDotV2: {
  position: "absolute",
  left: 4,
  top: 20,
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: "#5cff89",
  borderWidth: 3,
  borderColor: "#07120b",
  zIndex: 2,
},
journalTimelineLineV2: {
  position: "absolute",
  left: 11,
  top: 36,
  bottom: -20,
  width: 2,
  backgroundColor: "rgba(92,255,137,0.18)",
},
journalEntryCardV2: {
  borderRadius: 24,
  overflow: "hidden",
  borderWidth: 1,
},
journalEntryImageV2: {
  width: "100%",
  height: 200,
},
journalEntryImageExpanded: {
  height: 280,
},
journalEntryPlaceholderV2: {
  height: 120,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(92,255,137,0.08)",
},
journalEntryPlaceholderEmoji: {
  fontSize: 44,
},
journalDeleteBtnV2: {
  position: "absolute",
  top: 10,
  right: 10,
  backgroundColor: "rgba(0,0,0,0.55)",
  borderRadius: 999,
  width: 30,
  height: 30,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
},
journalDeleteBtnText: {
  color: "#ffffff",
  fontSize: 13,
  fontWeight: "900",
},
journalMoodOverlay: {
  position: "absolute",
  top: 10,
  left: 10,
  backgroundColor: "rgba(0,0,0,0.55)",
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 5,
  zIndex: 10,
},
journalMoodOverlayText: {
  color: "#ffffff",
  fontSize: 11,
  fontWeight: "900",
},
journalEntryContentV2: {
  padding: 16,
},
journalEntryHeaderV2: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},
journalEntryTitleV2: {
  fontSize: 17,
  fontWeight: "900",
  flex: 1,
},
journalEntryDateV2: {
  fontSize: 12,
  fontWeight: "700",
},
journalGrowthRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
},
journalGrowthLabel: {
  fontSize: 13,
  fontWeight: "900",
},
journalDayBadge: {
  fontSize: 12,
  fontWeight: "700",
},
journalProgressTrack: {
  height: 8,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.10)",
  overflow: "hidden",
  marginBottom: 6,
},
journalProgressFill: {
  height: "100%",
  borderRadius: 999,
},
journalProgressLabels: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 12,
},
journalProgressEmoji: {
  fontSize: 14,
},
journalCaptionWrap: {
  marginTop: 4,
  marginBottom: 8,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 14,
  padding: 12,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
journalCaptionText: {
  fontSize: 13,
  lineHeight: 20,
  fontWeight: "700",
},
journalCaptionEditHint: {
  color: "#8effab",
  fontSize: 11,
  fontWeight: "900",
  marginTop: 6,
},
journalCaptionEditWrap: {
  marginTop: 4,
  marginBottom: 8,
},
journalCaptionInput: {
  backgroundColor: "rgba(255,255,255,0.07)",
  borderRadius: 14,
  padding: 12,
  color: "#ffffff",
  fontSize: 13,
  fontWeight: "700",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.25)",
  minHeight: 80,
  textAlignVertical: "top",
},
journalCaptionButtonRow: {
  flexDirection: "row",
  gap: 10,
  marginTop: 10,
},
journalCaptionSaveBtn: {
  flex: 1,
  backgroundColor: "#5cff89",
  borderRadius: 14,
  paddingVertical: 12,
  alignItems: "center",
},
journalCaptionSaveBtnText: {
  color: "#07120b",
  fontWeight: "900",
  fontSize: 14,
},
journalCaptionCancelBtn: {
  flex: 1,
  backgroundColor: "rgba(255,255,255,0.07)",
  borderRadius: 14,
  paddingVertical: 12,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.10)",
},
journalCaptionCancelBtnText: {
  color: "#d7ebdc",
  fontWeight: "800",
  fontSize: 14,
},
journalCaptionPreview: {
  fontSize: 13,
  lineHeight: 19,
  fontWeight: "700",
  marginTop: 4,
  marginBottom: 4,
},
journalExpandedDetails: {
  gap: 8,
  marginTop: 10,
  marginBottom: 4,
},
journalDetailChip: {
  backgroundColor: "rgba(255,255,255,0.06)",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
journalDetailChipText: {
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "700",
},
journalExpandHint: {
  color: "#8effab",
  fontSize: 11,
  fontWeight: "800",
  marginTop: 8,
  textAlign: "center",
},
journalNoResults: {
  alignItems: "center",
  paddingVertical: 32,
},
journalNoResultsEmoji: {
  fontSize: 40,
  marginBottom: 12,
},
journalNoResultsTitle: {
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "900",
  marginBottom: 6,
},
journalNoResultsText: {
  fontSize: 14,
  fontWeight: "700",
  marginBottom: 16,
},
journalNoResultsBtn: {
  backgroundColor: "#5cff89",
  borderRadius: 16,
  paddingHorizontal: 20,
  paddingVertical: 12,
},
journalNoResultsBtnText: {
  color: "#07120b",
  fontWeight: "900",
  fontSize: 14,
},
gardenStatsSubtitle: {
  color: "#8effab",
  fontSize: 13,
  fontWeight: "700",
  marginTop: 4,
  marginBottom: 16,
},
dashXPRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 20,
  padding: 14,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.14)",
},
dashXPLeft: {
  alignItems: "center",
  minWidth: 48,
},
dashXPLevel: {
  color: "#5cff89",
  fontSize: 16,
  fontWeight: "900",
},
dashXPTitle: {
  fontSize: 10,
  fontWeight: "800",
  textAlign: "center",
  marginTop: 2,
},
dashXPBarWrap: {
  flex: 1,
},
dashXPTrack: {
  height: 10,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.10)",
  overflow: "hidden",
  marginBottom: 6,
},
dashXPFill: {
  height: "100%",
  borderRadius: 999,
  backgroundColor: "#5cff89",
},
dashXPMeta: {
  color: "#8effab",
  fontSize: 10,
  fontWeight: "800",
},
dashXPEmoji: {
  fontSize: 26,
},
dashTopRow: {
  flexDirection: "row",
  gap: 8,
  marginBottom: 14,
},
dashTopCard: {
  flex: 1,
  borderRadius: 18,
  padding: 12,
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
dashTopCardIcon: {
  fontSize: 20,
  marginBottom: 4,
},
dashTopCardLabel: {
  fontSize: 13,
  fontWeight: "900",
  textAlign: "center",
},
dashTopCardSub: {
  fontSize: 10,
  fontWeight: "700",
  marginTop: 2,
  textAlign: "center",
},
dashMainGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 16,
},
dashMainCard: {
  width: "47%",
  borderRadius: 22,
  padding: 16,
  backgroundColor: "rgba(255,255,255,0.07)",
  borderWidth: 1,
},
dashMainCardEyebrow: {
  color: "#8effab",
  fontSize: 10,
  fontWeight: "900",
  letterSpacing: 0.5,
  marginBottom: 8,
},
dashMainCardValue: {
  color: "#ffffff",
  fontSize: 26,
  fontWeight: "900",
  lineHeight: 30,
},
dashMainCardLabel: {
  fontSize: 12,
  fontWeight: "700",
  marginTop: 4,
},
dashMainCardDivider: {
  height: 1,
  backgroundColor: "rgba(255,255,255,0.08)",
  marginVertical: 10,
},
dashMainCardSub: {
  fontSize: 11,
  fontWeight: "700",
},
dashActionSection: {
  gap: 10,
  marginBottom: 16,
},
dashActionTitle: {
  color: "#ffffff",
  fontSize: 15,
  fontWeight: "900",
  marginBottom: 4,
},
dashActionRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  borderRadius: 18,
  padding: 14,
  borderWidth: 1,
},
dashActionIcon: {
  fontSize: 22,
},
dashActionLabel: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
},
dashActionSub: {
  fontSize: 12,
  fontWeight: "700",
  marginTop: 3,
  lineHeight: 17,
},
dashActionBadge: {
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 6,
  minWidth: 36,
  alignItems: "center",
},
dashActionBadgeText: {
  fontSize: 13,
  fontWeight: "900",
},
dashBottomRow: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 18,
  padding: 14,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
dashBottomStat: {
  flex: 1,
  alignItems: "center",
},
dashBottomStatValue: {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: "900",
},
dashBottomStatLabel: {
  fontSize: 11,
  fontWeight: "700",
  marginTop: 3,
  textAlign: "center",
},
dashBottomDivider: {
  width: 1,
  height: 36,
  backgroundColor: "rgba(255,255,255,0.10)",
},
myGardenProgressWrap: {
  marginTop: 16,
  marginBottom: 4,
},
myGardenProgressHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
},
myGardenProgressLabel: {
  color: "#d7ebdc",
  fontSize: 13,
  fontWeight: "800",
},
myGardenProgressCount: {
  color: "#8effab",
  fontSize: 13,
  fontWeight: "900",
},
myGardenProgressTrack: {
  height: 10,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.08)",
  overflow: "hidden",
  marginBottom: 8,
},
myGardenProgressFill: {
  height: "100%",
  borderRadius: 999,
},
myGardenProgressComplete: {
  color: "#5cff89",
  fontSize: 13,
  fontWeight: "900",
  textAlign: "center",
  marginTop: 4,
},
myGardenWeatherCard: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  borderRadius: 20,
  padding: 14,
  marginTop: 16,
  marginBottom: 4,
  borderWidth: 1,
},
myGardenWeatherIcon: {
  fontSize: 28,
},
myGardenWeatherTitle: {
  fontSize: 15,
  fontWeight: "900",
  marginBottom: 3,
},
myGardenWeatherText: {
  fontSize: 12,
  lineHeight: 18,
  fontWeight: "700",
},
myGardenWeatherTemps: {
  alignItems: "center",
},
myGardenWeatherHigh: {
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "900",
},
myGardenWeatherLow: {
  color: "#8effab",
  fontSize: 13,
  fontWeight: "700",
},
myGardenTaskRowV2: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 12,
  borderRadius: 20,
  padding: 14,
  borderWidth: 1,
},
myGardenTaskIconWrap: {
  width: 44,
  height: 44,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
},
myGardenTaskCheck: {
  color: "#5cff89",
  fontSize: 18,
  fontWeight: "900",
},
myGardenPlantPillRow: {
  gap: 8,
  paddingTop: 10,
  paddingBottom: 2,
},
myGardenPlantPill: {
  backgroundColor: "rgba(107,199,255,0.14)",
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderWidth: 1,
  borderColor: "rgba(107,199,255,0.28)",
},
myGardenPlantPillText: {
  color: "#6bc7ff",
  fontSize: 12,
  fontWeight: "900",
},
myGardenSeasonalTip: {
  borderRadius: 20,
  padding: 14,
  backgroundColor: "rgba(255,216,107,0.08)",
  borderWidth: 1,
},
myGardenSeasonalTipTitle: {
  color: "#ffd86b",
  fontSize: 13,
  fontWeight: "900",
  marginBottom: 6,
},
myGardenSeasonalTipText: {
  fontSize: 13,
  lineHeight: 20,
  fontWeight: "700",
},
plantTodayGlow: {
  position: "absolute",
  width: 180,
  height: 180,
  borderRadius: 90,
  backgroundColor: "rgba(92,255,137,0.12)",
  top: -60,
  right: -40,
},
plantTodayTagRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 6,
  marginTop: 10,
  marginBottom: 6,
},
plantTodayTag: {
  backgroundColor: "rgba(92,255,137,0.12)",
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.22)",
},
plantTodayTagText: {
  color: "#8effab",
  fontSize: 11,
  fontWeight: "800",
},
gardenIntelligenceSub: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "700",
  marginTop: 4,
  marginBottom: 14,
},
gardenIntelWeeklyRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 14,
},
gardenIntelWeeklyStat: {
  width: "47%",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.06)",
  borderRadius: 16,
  paddingVertical: 12,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
gardenIntelWeeklyIcon: {
  fontSize: 18,
  marginBottom: 4,
},
gardenIntelWeeklyValue: {
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "900",
},
gardenIntelWeeklyLabel: {
  fontSize: 10,
  fontWeight: "800",
  marginTop: 3,
  textAlign: "center",
},
gardenIntelInsightBanner: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 10,
  borderRadius: 18,
  padding: 14,
  marginBottom: 14,
  borderWidth: 1,
},
gardenIntelInsightIcon: {
  fontSize: 20,
},
gardenIntelInsightText: {
  flex: 1,
  fontSize: 13,
  fontWeight: "700",
  lineHeight: 20,
},
gardenIntelligenceTileV2: {
  width: "100%",
  borderRadius: 20,
  padding: 14,
  borderWidth: 1,
},
gardenIntelTileHeader: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginBottom: 6,
},
gardenIntelTileIcon: {
  fontSize: 20,
},
gardenIntelTileValue: {
  fontSize: 16,
  fontWeight: "900",
  flex: 1,
},
gardenIntelTileSub: {
  fontSize: 11,
  fontWeight: "700",
  marginTop: 4,
},
forecastSubtitle: {
  fontSize: 12,
  fontWeight: "700",
  marginTop: 4,
  marginBottom: 14,
},
forecastWeeklyStats: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 18,
  padding: 14,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
forecastWeeklyStat: {
  flex: 1,
  alignItems: "center",
},
forecastWeeklyStatValue: {
  fontSize: 18,
  fontWeight: "900",
},
forecastWeeklyStatLabel: {
  fontSize: 10,
  fontWeight: "700",
  marginTop: 3,
  textAlign: "center",
},
forecastWeeklyDivider: {
  width: 1,
  height: 32,
  backgroundColor: "rgba(255,255,255,0.10)",
},
forecastSummaryBanner: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 10,
  borderRadius: 18,
  padding: 14,
  marginBottom: 14,
  borderWidth: 1,
},
forecastSummaryIcon: {
  fontSize: 20,
},
forecastSummaryText: {
  flex: 1,
  fontSize: 13,
  fontWeight: "700",
  lineHeight: 20,
},
forecastDayCardV2: {
  width: 115,
  borderRadius: 22,
  paddingVertical: 14,
  paddingHorizontal: 10,
  alignItems: "center",
  gap: 4,
},
forecastDayLabelV2: {
  fontSize: 13,
  fontWeight: "900",
},
forecastBestBadge: {
  backgroundColor: "rgba(92,255,137,0.20)",
  borderRadius: 999,
  paddingHorizontal: 8,
  paddingVertical: 3,
},
forecastBestBadgeText: {
  color: "#5cff89",
  fontSize: 9,
  fontWeight: "900",
},
forecastIconV2: {
  fontSize: 28,
  marginVertical: 4,
},
forecastTempHigh: {
  fontSize: 22,
  fontWeight: "900",
},
forecastTempLow: {
  fontSize: 13,
  fontWeight: "700",
},
forecastRainRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 3,
},
forecastRainIcon: {
  fontSize: 11,
},
forecastRainV2: {
  fontSize: 12,
  fontWeight: "800",
},
forecastAdvicePill: {
  borderRadius: 999,
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginTop: 4,
  maxWidth: 120,
},
forecastAdviceText: {
  fontSize: 9,
  fontWeight: "900",
  textAlign: "center",
},
forecastFooter: {
  marginTop: 14,
  paddingTop: 14,
  borderTopWidth: 1,
  borderTopColor: "rgba(255,255,255,0.08)",
},
forecastFooterText: {
  fontSize: 12,
  fontWeight: "700",
  textAlign: "center",
  lineHeight: 18,
},
liveWeatherHeader: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 16,
},
liveWeatherUrgentBadge: {
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderWidth: 1,
  alignSelf: "flex-start",
},
liveWeatherUrgentText: {
  fontSize: 12,
  fontWeight: "900",
},
liveWeatherActionsWrap: {
  marginTop: 16,
  gap: 8,
},
liveWeatherActionsTitle: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
  marginBottom: 4,
},
liveWeatherActionsList: {
  gap: 8,
},
liveWeatherActionRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  borderRadius: 16,
  padding: 12,
  borderWidth: 1,
},
liveWeatherActionIcon: {
  fontSize: 18,
},
liveWeatherActionText: {
  flex: 1,
  fontSize: 13,
  fontWeight: "700",
  lineHeight: 18,
},
liveWeatherActionPriority: {
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: "rgba(255,123,123,0.30)",
  alignItems: "center",
  justifyContent: "center",
},
liveWeatherActionPriorityText: {
  color: "#ff7b7b",
  fontSize: 12,
  fontWeight: "900",
},
liveWeatherZoneInsight: {
  marginTop: 16,
  borderRadius: 18,
  padding: 14,
  backgroundColor: "rgba(92,255,137,0.08)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.18)",
},
liveWeatherZoneInsightTitle: {
  color: "#5cff89",
  fontSize: 13,
  fontWeight: "900",
  marginBottom: 6,
},
liveWeatherZoneInsightText: {
  fontSize: 13,
  lineHeight: 20,
  fontWeight: "700",
},
weatherTeaserCardV2: {
  marginTop: 16,
  borderRadius: 22,
  padding: 16,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderWidth: 1,
  marginBottom: 16,
},
weatherTeaserTopRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  marginBottom: 14,
},
weatherTeaserConditionV2: {
  fontSize: 14,
  fontWeight: "900",
  marginBottom: 4,
},
weatherTeaserTempV2: {
  fontSize: 32,
  fontWeight: "900",
},
weatherTeaserTempLow: {
  fontSize: 18,
  fontWeight: "700",
},
weatherTeaserRainPreview: {
  fontSize: 13,
  fontWeight: "700",
  marginTop: 4,
},
weatherTeaserLockCircle: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: "rgba(255,255,255,0.08)",
  alignItems: "center",
  justifyContent: "center",
},
weatherTeaserLockIcon: {
  fontSize: 24,
},
weatherTeaserBlurWrap: {
  gap: 8,
  marginBottom: 10,
},
weatherTeaserBlurRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},
weatherTeaserBlurIcon: {
  fontSize: 16,
  opacity: 0.5,
},
weatherTeaserBlurBar: {
  height: 10,
  width: "80%",
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.08)",
},
weatherTeaserBlurLabel: {
  fontSize: 12,
  fontWeight: "700",
  textAlign: "center",
  marginTop: 4,
},
weatherTeaserFeaturesWrap: {
  marginBottom: 16,
},
weatherTeaserFeaturesTitle: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
  marginBottom: 10,
},
weatherTeaserFeaturesList: {
  gap: 8,
},
weatherTeaserFeatureRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},
weatherTeaserFeatureIcon: {
  fontSize: 16,
},
weatherTeaserFeatureText: {
  fontSize: 13,
  fontWeight: "700",
},
weatherTeaserUnlockBtn: {
  backgroundColor: "#5cff89",
  borderRadius: 20,
  paddingVertical: 16,
  alignItems: "center",
  marginBottom: 12,
},
weatherTeaserUnlockBtnText: {
  color: "#07120b",
  fontSize: 15,
  fontWeight: "900",
},
weatherTeaserFooter: {
  fontSize: 12,
  fontWeight: "700",
  textAlign: "center",
},
accountLogoutButton: {
  marginTop: 16,
  borderRadius: 16,
  paddingVertical: 14,
  alignItems: "center",
  backgroundColor: "rgba(255,123,123,0.12)",
  borderWidth: 1,
  borderColor: "rgba(255,123,123,0.30)",
},
accountLogoutButtonText: {
  color: "#ff7b7b",
  fontWeight: "900",
  fontSize: 15,
},
// ── Premium Screen ─────────────────────────────────────────────────────────
premiumHeroSection: {
  borderRadius: 34,
  padding: 28,
  marginBottom: 18,
  backgroundColor: "rgba(16,41,23,0.97)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.28)",
  overflow: "hidden",
  alignItems: "center",
  shadowColor: "#5cff89",
  shadowOpacity: 0.22,
  shadowRadius: 28,
  shadowOffset: { width: 0, height: 10 },
  elevation: 10,
},
premiumHeroGlowOrbOne: {
  position: "absolute",
  width: 280,
  height: 280,
  borderRadius: 140,
  backgroundColor: "rgba(92,255,137,0.14)",
  top: -100,
  right: -80,
},
premiumHeroGlowOrbTwo: {
  position: "absolute",
  width: 200,
  height: 200,
  borderRadius: 100,
  backgroundColor: "rgba(255,216,107,0.08)",
  bottom: -60,
  left: -60,
},
premiumCrownWrap: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: "rgba(255,216,107,0.18)",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 18,
  borderWidth: 1,
  borderColor: "rgba(255,216,107,0.35)",
  shadowColor: "#ffd86b",
  shadowOpacity: 0.4,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 0 },
},
premiumCrownEmoji: {
  fontSize: 38,
},
premiumHeroEyebrow: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 1.2,
  marginBottom: 10,
},
premiumHeroHeadline: {
  color: "#ffffff",
  fontSize: 36,
  fontWeight: "900",
  textAlign: "center",
  lineHeight: 42,
  letterSpacing: -0.5,
  marginBottom: 12,
},
premiumHeroSubtext: {
  color: "#d7ebdc",
  fontSize: 15,
  lineHeight: 23,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 22,
  paddingHorizontal: 10,
},
premiumHeroStatRow: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.07)",
  borderRadius: 22,
  padding: 16,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.18)",
  width: "100%",
},
premiumHeroStat: {
  flex: 1,
  alignItems: "center",
},
premiumHeroStatValue: {
  color: "#5cff89",
  fontSize: 22,
  fontWeight: "900",
},
premiumHeroStatLabel: {
  color: "#d7ebdc",
  fontSize: 11,
  fontWeight: "800",
  marginTop: 3,
},
premiumHeroStatDivider: {
  width: 1,
  height: 36,
  backgroundColor: "rgba(255,255,255,0.12)",
},
premiumFeaturesCard: {
  borderRadius: 30,
  padding: 20,
  marginBottom: 18,
  borderWidth: 1,
},
premiumFeaturesEyebrow: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 6,
},
premiumFeaturesTitle: {
  fontSize: 24,
  fontWeight: "900",
  marginBottom: 18,
},
premiumFeaturesGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
},
premiumFeatureTile: {
  width: "47%",
  backgroundColor: "rgba(92,255,137,0.07)",
  borderRadius: 22,
  padding: 16,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.16)",
},
premiumFeatureTileIconWrap: {
  width: 44,
  height: 44,
  borderRadius: 14,
  backgroundColor: "rgba(92,255,137,0.14)",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
},
premiumFeatureTileIcon: {
  fontSize: 22,
},
premiumFeatureTileTitle: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
  marginBottom: 4,
},
premiumFeatureTileText: {
  color: "#d7ebdc",
  fontSize: 12,
  lineHeight: 17,
  fontWeight: "700",
},
premiumPlanCard: {
  borderRadius: 30,
  padding: 22,
  marginBottom: 18,
  borderWidth: 2,
  shadowColor: "#5cff89",
  shadowOpacity: 0.22,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 10 },
  elevation: 8,
},
premiumPlanEyebrow: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 6,
},
premiumPlanTitle: {
  fontSize: 26,
  fontWeight: "900",
  marginBottom: 6,
},
premiumPlanSubtext: {
  fontSize: 14,
  fontWeight: "700",
  lineHeight: 21,
  marginBottom: 20,
},
premiumPlanToggleRow: {
  flexDirection: "row",
  gap: 12,
  marginBottom: 20,
},
premiumPlanOption: {
  flex: 1,
  borderRadius: 24,
  padding: 18,
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
},
premiumPlanBadge: {
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 4,
  marginBottom: 14,
},
premiumPlanBadgeText: {
  fontSize: 9,
  fontWeight: "900",
  letterSpacing: 0.5,
},
premiumPlanCheck: {
  position: "absolute",
  top: 10,
  right: 10,
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: "#5cff89",
  alignItems: "center",
  justifyContent: "center",
},
premiumPlanCheckText: {
  color: "#07120b",
  fontSize: 12,
  fontWeight: "900",
},
premiumPlanOptionName: {
  fontSize: 14,
  fontWeight: "900",
  marginBottom: 8,
},
premiumPlanOptionPrice: {
  fontSize: 22,
  fontWeight: "900",
  letterSpacing: -0.5,
},
premiumPlanOptionPer: {
  fontSize: 13,
  fontWeight: "700",
  marginTop: 2,
  marginBottom: 8,
},
premiumPlanSavingsPill: {
  backgroundColor: "rgba(255,216,107,0.20)",
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderWidth: 1,
  borderColor: "rgba(255,216,107,0.35)",
},
premiumPlanSavingsText: {
  color: "#ffd86b",
  fontSize: 11,
  fontWeight: "900",
},
premiumPlanCTA: {
  backgroundColor: "#5cff89",
  borderRadius: 22,
  paddingVertical: 18,
  alignItems: "center",
  marginBottom: 12,
  shadowColor: "#5cff89",
  shadowOpacity: 0.45,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 10,
},
premiumPlanCTAText: {
  color: "#07120b",
  fontSize: 17,
  fontWeight: "900",
},
premiumPlanFooter: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 16,
},
premiumComingSoonBox: {
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 16,
  padding: 14,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
premiumComingSoonText: {
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "700",
  textAlign: "center",
  lineHeight: 18,
},
premiumTrustRow: {
  flexDirection: "row",
  borderRadius: 24,
  padding: 16,
  marginBottom: 18,
  borderWidth: 1,
},
premiumTrustTile: {
  flex: 1,
  alignItems: "center",
  gap: 6,
},
premiumTrustIcon: {
  fontSize: 22,
},
premiumTrustLabel: {
  color: "#d7ebdc",
  fontSize: 10,
  fontWeight: "800",
  textAlign: "center",
},
premiumDevButton: {
  flexDirection: "row",
  alignItems: "center",
  gap: 14,
  borderRadius: 22,
  padding: 18,
  marginBottom: 18,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.10)",
},
premiumDevButtonActive: {
  backgroundColor: "rgba(92,255,137,0.10)",
  borderColor: "rgba(92,255,137,0.30)",
},
premiumDevButtonIcon: {
  fontSize: 28,
},
premiumDevButtonText: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
},
premiumDevButtonSub: {
  color: "#d7ebdc",
  fontSize: 11,
  fontWeight: "700",
  marginTop: 3,
},
premiumDevButtonCheck: {
  color: "#5cff89",
  fontSize: 20,
  fontWeight: "900",
},
premiumLockedSection: {
  marginTop: 18,
  borderRadius: 24,
  padding: 20,
  backgroundColor: "rgba(92,255,137,0.06)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.20)",
  overflow: "hidden",
},
premiumLockedSectionGlow: {
  position: "absolute",
  width: 180,
  height: 180,
  borderRadius: 90,
  backgroundColor: "rgba(92,255,137,0.08)",
  top: -60,
  right: -40,
},
premiumLockedSectionTop: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 14,
},
premiumLockedSectionIconWrap: {
  width: 52,
  height: 52,
  borderRadius: 16,
  backgroundColor: "rgba(92,255,137,0.14)",
  alignItems: "center",
  justifyContent: "center",
},
premiumLockedSectionIcon: {
  fontSize: 26,
},
premiumLockedLockBadge: {
  backgroundColor: "rgba(255,255,255,0.08)",
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.12)",
},
premiumLockedLockText: {
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "900",
},
premiumLockedSectionTitle: {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: "900",
  marginBottom: 8,
},
premiumLockedSectionDesc: {
  color: "#d7ebdc",
  fontSize: 14,
  lineHeight: 21,
  fontWeight: "700",
  marginBottom: 16,
},
premiumLockedSectionButton: {
  backgroundColor: "#5cff89",
  borderRadius: 18,
  paddingVertical: 14,
  alignItems: "center",
  shadowColor: "#5cff89",
  shadowOpacity: 0.35,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 8,
},
premiumLockedSectionButtonText: {
  color: "#07120b",
  fontSize: 15,
  fontWeight: "900",
},
premiumDevSection: {
  marginBottom: 18,
},
premiumDevSectionHeader: {
  alignItems: "center",
  marginBottom: 12,
  gap: 4,
},
premiumDevSectionLabel: {
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 1,
},
premiumDevSectionSub: {
  color: "#d7ebdc",
  fontSize: 11,
  fontWeight: "700",
},
premiumDevTogglePill: {
  borderRadius: 999,
  paddingHorizontal: 14,
  paddingVertical: 7,
},
premiumDevToggleText: {
  fontSize: 13,
  fontWeight: "900",
},
journalDashGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 16,
  marginBottom: 16,
},
journalDashTile: {
  width: "47%",
  borderRadius: 20,
  padding: 14,
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  alignItems: "center",
},
journalDashTileIcon: {
  fontSize: 24,
  marginBottom: 6,
},
journalDashTileValue: {
  color: "#ffffff",
  fontSize: 26,
  fontWeight: "900",
},
journalDashTileLabel: {
  fontSize: 11,
  fontWeight: "700",
  marginTop: 3,
  textAlign: "center",
},
journalGrowthChartCard: {
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 22,
  padding: 16,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.15)",
},
journalGrowthChartTitle: {
  color: "#8effab",
  fontSize: 13,
  fontWeight: "900",
  marginBottom: 14,
},
journalGrowthChartBars: {
  flexDirection: "row",
  alignItems: "flex-end",
  gap: 8,
  height: 80,
},
journalGrowthChartBar: {
  flex: 1,
  alignItems: "center",
  height: "100%",
  justifyContent: "flex-end",
},
journalGrowthChartCount: {
  fontSize: 10,
  fontWeight: "900",
  marginBottom: 4,
},
journalGrowthChartBarTrack: {
  width: "100%",
  height: 60,
  backgroundColor: "rgba(255,255,255,0.06)",
  borderRadius: 6,
  overflow: "hidden",
  justifyContent: "flex-end",
},
journalGrowthChartBarFill: {
  width: "100%",
  borderRadius: 6,
  minHeight: 4,
},
journalGrowthChartMonth: {
  color: "#8effab",
  fontSize: 9,
  fontWeight: "800",
  marginTop: 6,
},
journalGrowthChartBadge: {
  marginTop: 12,
  backgroundColor: "rgba(255,159,67,0.12)",
  borderRadius: 12,
  padding: 10,
  borderWidth: 1,
  borderColor: "rgba(255,159,67,0.25)",
},
journalGrowthChartBadgeText: {
  color: "#ff9f43",
  fontSize: 12,
  fontWeight: "800",
  textAlign: "center",
},
journalStageBreakdown: {
  marginBottom: 14,
},
journalStageBreakdownTitle: {
  color: "#d7ebdc",
  fontSize: 13,
  fontWeight: "900",
  marginBottom: 10,
},
journalStageBreakdownTrack: {
  flexDirection: "row",
  height: 12,
  borderRadius: 8,
  overflow: "hidden",
  gap: 2,
  marginBottom: 10,
},
journalStageBreakdownSegment: {
  height: "100%",
},
journalStageLegend: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
},
journalStageLegendItem: {
  flexDirection: "row",
  alignItems: "center",
  gap: 5,
},
journalStageLegendDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
},
journalStageLegendText: {
  fontSize: 11,
  fontWeight: "700",
},
journalTabSwitcher: {
  flexDirection: "row",
  gap: 10,
  marginTop: 4,
  marginBottom: 14,
},
journalTabButton: {
  flex: 1,
  borderRadius: 16,
  paddingVertical: 12,
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
journalTabButtonActive: {
  backgroundColor: "#5cff89",
  borderColor: "#5cff89",
},
journalTabButtonText: {
  color: "#d7ebdc",
  fontSize: 13,
  fontWeight: "800",
},
journalTabButtonTextActive: {
  color: "#07120b",
},
journalEmptyState: {
  alignItems: "center",
  paddingVertical: 32,
  paddingHorizontal: 10,
},
journalEmptyStateEmoji: {
  fontSize: 52,
  marginBottom: 14,
},
journalEmptyStateTitle: {
  color: "#ffffff",
  fontSize: 22,
  fontWeight: "900",
  marginBottom: 10,
  textAlign: "center",
},
journalEmptyStateText: {
  fontSize: 14,
  lineHeight: 22,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 20,
},
journalAddPhotoButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  backgroundColor: "#5cff89",
  borderRadius: 18,
  paddingVertical: 14,
  marginBottom: 14,
},
journalAddPhotoButtonIcon: {
  fontSize: 18,
},
journalAddPhotoButtonText: {
  color: "#07120b",
  fontSize: 15,
  fontWeight: "900",
},
journalEntryActionRow: {
  position: "absolute",
  top: 10,
  right: 10,
  flexDirection: "row",
  gap: 8,
  zIndex: 10,
},
journalEntryActionBtn: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: "rgba(0,0,0,0.55)",
  alignItems: "center",
  justifyContent: "center",
},
journalEntryActionBtnText: {
  color: "#ffffff",
  fontSize: 13,
  fontWeight: "900",
},
journalEntryOverlayRow: {
  position: "absolute",
  top: 10,
  left: 10,
  right: 50,
  flexDirection: "row",
  justifyContent: "space-between",
  zIndex: 10,
},
journalStageChip: {
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderWidth: 1,
  alignSelf: "flex-start",
},
journalStageChipText: {
  fontSize: 11,
  fontWeight: "900",
},
journalSuggestButton: {
  marginTop: 10,
  backgroundColor: "rgba(255,216,107,0.12)",
  borderRadius: 14,
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderWidth: 1,
  borderColor: "rgba(255,216,107,0.28)",
  alignSelf: "flex-start",
},
journalSuggestButtonText: {
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
},
journalSuggestionsBox: {
  marginTop: 10,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 16,
  padding: 12,
  borderWidth: 1,
  borderColor: "rgba(255,216,107,0.20)",
  gap: 8,
},
journalSuggestionsTitle: {
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
  marginBottom: 4,
},
journalSuggestionPill: {
  backgroundColor: "rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding: 10,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.10)",
},
journalSuggestionText: {
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "700",
  lineHeight: 18,
},
journalPlantGroup: {
  borderRadius: 22,
  padding: 14,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderWidth: 1,
},
journalPlantGroupHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 4,
},
journalPlantGroupName: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "900",
},
journalPlantGroupBadge: {
  backgroundColor: "rgba(92,255,137,0.14)",
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 4,
},
journalPlantGroupBadgeText: {
  color: "#5cff89",
  fontSize: 11,
  fontWeight: "900",
},
journalPlantThumb: {
  width: 100,
  height: 100,
  borderRadius: 16,
  overflow: "hidden",
  position: "relative",
},
journalPlantThumbImage: {
  width: 100,
  height: 100,
  borderRadius: 16,
},
journalPlantThumbStage: {
  position: "absolute",
  bottom: 6,
  left: 4,
  right: 4,
  borderRadius: 8,
  paddingVertical: 3,
  alignItems: "center",
},
journalPlantThumbStageText: {
  fontSize: 9,
  fontWeight: "900",
},
careLogStatsRow: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 20,
  padding: 14,
  marginTop: 16,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "rgba(107,199,255,0.15)",
},
careLogStatTile: {
  flex: 1,
  alignItems: "center",
},
careLogStatValue: {
  color: "#ffffff",
  fontSize: 22,
  fontWeight: "900",
},
careLogStatLabel: {
  fontSize: 10,
  fontWeight: "700",
  marginTop: 3,
  textAlign: "center",
},
careLogStatDivider: {
  width: 1,
  height: 36,
  backgroundColor: "rgba(255,255,255,0.10)",
},
careLogAddButton: {
  borderRadius: 18,
  paddingVertical: 14,
  alignItems: "center",
  marginBottom: 14,
},
careLogAddButtonText: {
  fontSize: 15,
  fontWeight: "900",
},
careLogAddPanel: {
  backgroundColor: "rgba(255,255,255,0.04)",
  borderRadius: 22,
  padding: 16,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "rgba(107,199,255,0.20)",
},
careLogPanelLabel: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: 10,
},
careLogPlantPill: {
  borderRadius: 999,
  paddingHorizontal: 14,
  paddingVertical: 9,
  borderWidth: 1,
},
careLogPlantPillText: {
  fontSize: 13,
  fontWeight: "800",
},
careLogActionGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
},
careLogActionTile: {
  width: "47%",
  borderRadius: 18,
  padding: 14,
  alignItems: "center",
  position: "relative",
},
careLogActionIcon: {
  fontSize: 26,
  marginBottom: 6,
},
careLogActionLabel: {
  fontSize: 12,
  fontWeight: "800",
  textAlign: "center",
},
careLogActionCheck: {
  position: "absolute",
  top: 8,
  right: 8,
  width: 18,
  height: 18,
  borderRadius: 9,
  alignItems: "center",
  justifyContent: "center",
},
careLogActionCheckText: {
  color: "#07120b",
  fontSize: 10,
  fontWeight: "900",
},
careLogNoteInput: {
  backgroundColor: "rgba(255,255,255,0.07)",
  borderRadius: 16,
  padding: 14,
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "700",
  borderWidth: 1,
  borderColor: "rgba(107,199,255,0.20)",
  minHeight: 80,
  textAlignVertical: "top",
},
careLogSubmitButton: {
  marginTop: 14,
  backgroundColor: "#6bc7ff",
  borderRadius: 18,
  paddingVertical: 14,
  alignItems: "center",
},
careLogSubmitButtonText: {
  color: "#07120b",
  fontSize: 15,
  fontWeight: "900",
},
careLogViewToggle: {
  flexDirection: "row",
  gap: 10,
  marginBottom: 12,
},
careLogViewBtn: {
  flex: 1,
  borderRadius: 16,
  paddingVertical: 11,
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
careLogViewBtnActive: {
  backgroundColor: "#6bc7ff",
  borderColor: "#6bc7ff",
},
careLogViewBtnText: {
  color: "#d7ebdc",
  fontSize: 13,
  fontWeight: "800",
},
careLogViewBtnTextActive: {
  color: "#07120b",
},
careLogCalendar: {
  marginTop: 4,
},
careLogCalendarNav: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 14,
},
careLogCalendarNavBtn: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "rgba(255,255,255,0.08)",
  alignItems: "center",
  justifyContent: "center",
},
careLogCalendarNavText: {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: "900",
},
careLogCalendarMonthLabel: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "900",
},
careLogCalendarDayLabels: {
  flexDirection: "row",
  marginBottom: 6,
},
careLogCalendarDayLabel: {
  flex: 1,
  textAlign: "center",
  color: "#8effab",
  fontSize: 11,
  fontWeight: "900",
},
careLogCalendarGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
},
careLogCalendarCell: {
  width: "14.28%",
  aspectRatio: 1,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
  marginBottom: 4,
},
careLogCalendarDayNum: {
  fontSize: 13,
  color: "#ffffff",
},
careLogCalendarDot: {
  width: 5,
  height: 5,
  borderRadius: 3,
  marginTop: 2,
},
careLogSelectedDatePanel: {
  marginTop: 14,
  backgroundColor: "rgba(255,255,255,0.04)",
  borderRadius: 18,
  padding: 14,
  borderWidth: 1,
  borderColor: "rgba(107,199,255,0.18)",
},
careLogSelectedDateLabel: {
  color: "#6bc7ff",
  fontSize: 14,
  fontWeight: "900",
},
careLogEmptyDate: {
  fontSize: 13,
  fontWeight: "700",
  marginTop: 8,
  lineHeight: 20,
},
careLogEntryRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 12,
  borderRadius: 18,
  padding: 14,
  borderWidth: 1,
},
careLogEntryIcon: {
  fontSize: 24,
},
careLogEntryLabel: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "900",
},
careLogEntryPlant: {
  fontSize: 12,
  fontWeight: "800",
  marginTop: 3,
},
careLogEntryNote: {
  fontSize: 12,
  fontWeight: "700",
  marginTop: 4,
  lineHeight: 18,
},
careLogEntryDate: {
  fontSize: 11,
  fontWeight: "700",
  marginTop: 4,
},
careLogDeleteBtn: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: "rgba(255,123,123,0.15)",
  alignItems: "center",
  justifyContent: "center",
},
careLogDeleteBtnText: {
  color: "#ff7b7b",
  fontSize: 12,
  fontWeight: "900",
},
careLogEmpty: {
  alignItems: "center",
  paddingVertical: 28,
},
careLogEmptyIcon: {
  fontSize: 44,
  marginBottom: 12,
},
careLogEmptyTitle: {
  color: "#ffffff",
  fontSize: 18,
  fontWeight: "900",
  marginBottom: 8,
},
careLogEmptyText: {
  fontSize: 13,
  lineHeight: 20,
  fontWeight: "700",
  textAlign: "center",
},
bannerProgressSummary: {
  flexDirection: "row",
  alignItems: "center",
  gap: 14,
  marginTop: 16,
  marginBottom: 16,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 18,
  padding: 14,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.15)",
},
bannerProgressSummaryLeft: {
  alignItems: "center",
  minWidth: 52,
},
bannerProgressSummaryValue: {
  color: "#5cff89",
  fontSize: 22,
  fontWeight: "900",
},
bannerProgressSummaryLabel: {
  fontSize: 10,
  fontWeight: "700",
  marginTop: 2,
  textAlign: "center",
},
bannerProgressSummaryTrack: {
  flex: 1,
  height: 10,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.08)",
  overflow: "hidden",
},
bannerProgressSummaryFill: {
  height: "100%",
  borderRadius: 999,
  backgroundColor: "#5cff89",
},
bannerActivePreview: {
  flexDirection: "row",
  alignItems: "center",
  gap: 14,
  borderRadius: 22,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
},
bannerActiveEmoji: {
  fontSize: 42,
},
bannerActiveLabel: {
  color: "#8effab",
  fontSize: 11,
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: 0.5,
},
bannerActiveName: {
  fontSize: 18,
  fontWeight: "900",
  marginTop: 2,
},
bannerActiveSubtitle: {
  fontSize: 12,
  fontWeight: "700",
  marginTop: 2,
},
bannerActiveCheckBadge: {
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 6,
},
bannerActiveCheckText: {
  color: "#07120b",
  fontSize: 12,
  fontWeight: "900",
},
bannerScrollContent: {
  gap: 12,
  paddingVertical: 8,
  paddingHorizontal: 2,
},
bannerScrollCard: {
  width: 180,
  borderRadius: 24,
  overflow: "hidden",
  backgroundColor: "rgba(255,255,255,0.06)",
},
bannerScrollCardHeader: {
  height: 110,
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
},
bannerScrollEmoji: {
  fontSize: 48,
},
bannerScrollLockWrap: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: "rgba(255,255,255,0.08)",
  alignItems: "center",
  justifyContent: "center",
},
bannerScrollLockIcon: {
  fontSize: 24,
},
bannerScrollActiveBadge: {
  position: "absolute",
  top: 10,
  right: 10,
  borderRadius: 999,
  paddingHorizontal: 8,
  paddingVertical: 4,
},
bannerScrollActiveBadgeText: {
  color: "#07120b",
  fontSize: 10,
  fontWeight: "900",
},
bannerScrollUnlockedBadge: {
  position: "absolute",
  top: 10,
  right: 10,
  borderRadius: 999,
  paddingHorizontal: 8,
  paddingVertical: 4,
  backgroundColor: "rgba(92,255,137,0.20)",
},
bannerScrollUnlockedBadgeText: {
  color: "#5cff89",
  fontSize: 10,
  fontWeight: "900",
},
bannerScrollCardBody: {
  padding: 14,
},
bannerScrollCardTitle: {
  fontSize: 15,
  fontWeight: "900",
  marginBottom: 4,
},
bannerScrollCardSubtitle: {
  fontSize: 11,
  fontWeight: "700",
  lineHeight: 16,
  marginBottom: 10,
},
bannerScrollProgressTrack: {
  height: 6,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.10)",
  overflow: "hidden",
  marginBottom: 6,
},
bannerScrollProgressFill: {
  height: "100%",
  borderRadius: 999,
},
bannerScrollProgressLabel: {
  fontSize: 11,
  fontWeight: "800",
},
bannerScrollEquipHint: {
  marginTop: 8,
  fontSize: 11,
  fontWeight: "900",
},
bannerNextUnlockBox: {
  marginTop: 14,
  borderRadius: 20,
  padding: 16,
  backgroundColor: "rgba(255,255,255,0.04)",
  borderWidth: 1,
},
bannerNextUnlockEyebrow: {
  color: "#8effab",
  fontSize: 11,
  fontWeight: "900",
  letterSpacing: 0.5,
  marginBottom: 10,
},
bannerNextUnlockRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
},
bannerNextUnlockEmoji: {
  fontSize: 34,
},
bannerNextUnlockTitle: {
  color: "#ffffff",
  fontSize: 15,
  fontWeight: "900",
  marginBottom: 3,
},
bannerNextUnlockSub: {
  fontSize: 12,
  fontWeight: "700",
  marginBottom: 8,
},
bannerNextUnlockTrack: {
  height: 8,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.10)",
  overflow: "hidden",
  marginBottom: 6,
},
bannerNextUnlockFill: {
  height: "100%",
  borderRadius: 999,
},
bannerNextUnlockProgress: {
  fontSize: 12,
  fontWeight: "900",
},
bannerAllUnlockedBox: {
  marginTop: 14,
  borderRadius: 18,
  padding: 14,
  backgroundColor: "rgba(255,216,107,0.10)",
  borderWidth: 1,
  borderColor: "rgba(255,216,107,0.28)",
  alignItems: "center",
},
bannerAllUnlockedText: {
  color: "#ffd86b",
  fontSize: 13,
  fontWeight: "900",
  textAlign: "center",
},
achievementOverallProgress: {
  flexDirection: "row",
  alignItems: "center",
  gap: 14,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 20,
  padding: 14,
  marginTop: 16,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.15)",
},
achievementOverallLeft: {
  alignItems: "center",
  minWidth: 52,
},
achievementOverallValue: {
  color: "#5cff89",
  fontSize: 20,
  fontWeight: "900",
},
achievementOverallLabel: {
  fontSize: 10,
  fontWeight: "700",
  marginTop: 2,
},
achievementOverallTrack: {
  height: 10,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.08)",
  overflow: "hidden",
  marginBottom: 6,
},
achievementOverallFill: {
  height: "100%",
  borderRadius: 999,
  backgroundColor: "#5cff89",
},
achievementOverallPercent: {
  color: "#8effab",
  fontSize: 11,
  fontWeight: "800",
},
achievementStreakBadge: {
  color: "#ff9f43",
  fontSize: 12,
  fontWeight: "900",
},
achievementCategoryStatsScroll: {
  gap: 8,
  paddingBottom: 14,
},
achievementCategoryStatTile: {
  alignItems: "center",
  borderRadius: 16,
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderWidth: 1,
  minWidth: 70,
},
achievementCategoryStatIcon: {
  fontSize: 18,
  marginBottom: 4,
},
achievementCategoryStatValue: {
  fontSize: 14,
  fontWeight: "900",
},
achievementCategoryStatLabel: {
  fontSize: 9,
  fontWeight: "700",
  marginTop: 2,
  textAlign: "center",
},
achievementFilterScroll: {
  gap: 8,
  paddingBottom: 14,
},
achievementFilterPill: {
  borderRadius: 999,
  paddingHorizontal: 14,
  paddingVertical: 8,
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
achievementFilterPillActive: {
  backgroundColor: "#5cff89",
  borderColor: "#5cff89",
},
achievementFilterPillText: {
  color: "#d7ebdc",
  fontSize: 12,
  fontWeight: "800",
},
achievementFilterPillTextActive: {
  color: "#07120b",
},
achievementGlowOrb: {
  position: "absolute",
  width: 60,
  height: 60,
  borderRadius: 30,
  top: -10,
  right: -10,
  opacity: 0.12,
},
achievementIconWrap: {
  width: 52,
  height: 52,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
  position: "relative",
},
achievementLockOverlay: {
  position: "absolute",
  bottom: -4,
  right: -4,
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: "rgba(0,0,0,0.7)",
  alignItems: "center",
  justifyContent: "center",
},
achievementLockIcon: {
  fontSize: 10,
},
achievementProgressFraction: {
  fontSize: 10,
  fontWeight: "800",
  marginTop: 3,
  textAlign: "center",
},
achievementSelectedRing: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 20,
  borderWidth: 2,
  borderColor: "#ffd86b",
},
achievementAllDoneBox: {
  marginTop: 16,
  borderRadius: 20,
  padding: 20,
  backgroundColor: "rgba(255,216,107,0.10)",
  borderWidth: 1,
  borderColor: "rgba(255,216,107,0.28)",
  alignItems: "center",
},
achievementAllDoneEmoji: {
  fontSize: 40,
  marginBottom: 10,
},
achievementAllDoneTitle: {
  color: "#ffd86b",
  fontSize: 18,
  fontWeight: "900",
  marginBottom: 6,
},
achievementAllDoneText: {
  fontSize: 13,
  fontWeight: "700",
  textAlign: "center",
},
achievementFooter: {
  marginTop: 14,
  alignItems: "center",
},
achievementFooterText: {
  fontSize: 13,
  fontWeight: "700",
  textAlign: "center",
},
questProgressSummary: {
  flexDirection: "row",
  alignItems: "center",
  gap: 14,
  backgroundColor: "rgba(255,255,255,0.05)",
  borderRadius: 20,
  padding: 14,
  marginTop: 16,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.15)",
},
questProgressLeft: {
  alignItems: "center",
  minWidth: 48,
},
questProgressValue: {
  color: "#5cff89",
  fontSize: 20,
  fontWeight: "900",
},
questProgressLabel: {
  fontSize: 10,
  fontWeight: "700",
  marginTop: 2,
},
questProgressTrack: {
  height: 10,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.08)",
  overflow: "hidden",
  marginBottom: 6,
},
questProgressFill: {
  height: "100%",
  borderRadius: 999,
  backgroundColor: "#5cff89",
},
questProgressXP: {
  color: "#8effab",
  fontSize: 11,
  fontWeight: "800",
},
questAllDoneEmoji: {
  fontSize: 28,
},
questRowV2: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  borderRadius: 20,
  padding: 14,
  borderWidth: 1,
  marginBottom: 10,
},
questIconWrap: {
  width: 46,
  height: 46,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
},
questDescription: {
  fontSize: 11,
  fontWeight: "700",
  marginTop: 3,
  lineHeight: 16,
},
questDifficultyBadge: {
  borderRadius: 999,
  paddingHorizontal: 8,
  paddingVertical: 3,
},
questDifficultyText: {
  fontSize: 10,
  fontWeight: "900",
},
questProgressBarTrack: {
  height: 6,
  borderRadius: 999,
  backgroundColor: "rgba(255,255,255,0.10)",
  overflow: "hidden",
  marginTop: 8,
  marginBottom: 4,
},
questProgressBarFill: {
  height: "100%",
  borderRadius: 999,
},
questProgressFraction: {
  fontSize: 11,
  fontWeight: "800",
},
questClaimedBadge: {
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 6,
},
questClaimedText: {
  fontSize: 11,
  fontWeight: "900",
},
questClaimButton: {
  borderRadius: 14,
  paddingHorizontal: 12,
  paddingVertical: 8,
},
questClaimButtonText: {
  color: "#07120b",
  fontSize: 12,
  fontWeight: "900",
},
questAllDoneBox: {
  marginTop: 4,
  borderRadius: 18,
  padding: 16,
  backgroundColor: "rgba(92,255,137,0.08)",
  borderWidth: 1,
  borderColor: "rgba(92,255,137,0.22)",
  alignItems: "center",
},
questAllDoneTitle: {
  color: "#5cff89",
  fontSize: 16,
  fontWeight: "900",
  marginBottom: 6,
},
questAllDoneText: {
  fontSize: 13,
  fontWeight: "700",
  textAlign: "center",
},
gardenGodOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.85)",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  borderRadius: 30,
  padding: 20,
},
gardenGodCard: {
  backgroundColor: "rgba(16,41,23,0.98)",
  borderRadius: 34,
  padding: 28,
  alignItems: "center",
  borderWidth: 2,
  borderColor: "#ffd86b",
  shadowColor: "#ffd86b",
  shadowOpacity: 0.6,
  shadowRadius: 30,
  shadowOffset: { width: 0, height: 0 },
},
gardenGodEmoji: {
  fontSize: 72,
  marginBottom: 16,
},
gardenGodEyebrow: {
  color: "#ffd86b",
  fontSize: 11,
  fontWeight: "900",
  letterSpacing: 1.2,
  marginBottom: 10,
  textAlign: "center",
},
gardenGodTitle: {
  color: "#ffffff",
  fontSize: 34,
  fontWeight: "900",
  textAlign: "center",
  marginBottom: 16,
  letterSpacing: -0.5,
},
gardenGodText: {
  color: "#d7ebdc",
  fontSize: 15,
  lineHeight: 23,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 10,
},
gardenGodText2: {
  color: "#5cff89",
  fontSize: 18,
  fontWeight: "900",
  textAlign: "center",
  marginBottom: 20,
},
gardenGodBadge: {
  backgroundColor: "rgba(255,216,107,0.18)",
  borderRadius: 999,
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: "rgba(255,216,107,0.40)",
  marginBottom: 20,
},
gardenGodBadgeText: {
  color: "#ffd86b",
  fontSize: 13,
  fontWeight: "900",
  textAlign: "center",
},
gardenGodDismiss: {
  color: "#8effab",
  fontSize: 12,
  fontWeight: "700",
},
bgSunGlow: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    top: -260,
    left: -64,
    backgroundColor: "#5cff89",
    opacity: 0.06,
  },
  bgGardenOrbOne: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    top: 220,
    left: -130,
    backgroundColor: "#1f7a3a",
    opacity: 0.1,
  },
  bgGardenOrbTwo: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    top: 540,
    right: -120,
    backgroundColor: "#2fbf5f",
    opacity: 0.07,
  },
  bgGardenOrbThree: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    bottom: 40,
    left: -150,
    backgroundColor: "#0d3b1c",
    opacity: 0.14,
  },
scrollTopButton: {
    position: "absolute",
    right: 18,
    bottom: 96,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#5cff89",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
    zIndex: 50,
  },
  plantSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(142,255,171,0.18)",
    paddingHorizontal: 14,
    marginTop: 14,
    gap: 10,
  },
  plantSearchIcon: { fontSize: 16 },
  plantSearchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 12,
  },
  plantSearchClear: {
    color: "#8effab",
    fontSize: 16,
    fontWeight: "900",
    paddingHorizontal: 4,
  },
});