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
import { styles } from "./styles";
import {
  getPlantFamily,
  COLD_THRESHOLD_F,
  COMPANION_PLANTING_DATA,
  FERTILIZER_DAYS,
  FROST_TASKS,
  FROST_THRESHOLD_F,
  GARDEN_SLOTS,
  HARVEST_SOON_DAYS,
  HARVEST_UNIT_VALUE,
  MONTH_LABELS,
  MONTH_NAMES,
  PAIR_REASONS,
  PERENNIALS,
  PEST_WATCH_DATA,
  PLANT_TYPES,
  PROFILE_THEMES,
  RAIN_SKIP_THRESHOLD,
  RARITY_STYLES,
  RESCUE_THRESHOLD_DAYS,
  SCREEN_WIDTH,
  SEASONAL_TASKS,
  STORAGE_KEYS,
  WATERING_STREAK_GAP_DAYS,
  WATER_UNITS,
  WHATS_NEW_ITEMS,
  WHATS_NEW_VERSION,
  analyzePlantHealth,
  applyGardenTemplate,
  buildCsv,
  calculateGardenHealth,
  countInSeason,
  csvEscape,
  dayOfYear,
  estimateHarvestValue,
  findGardenConflicts,
  formatRelativeDate,
  formatReminderTime,
  frostOverrideRef,
  gardenBuddyImage,
  getAchievementBadges,
  getActivePests,
  getAreaTag,
  getBaseWaterInterval,
  getClimateBucket,
  getCompanionInfo,
  getCompatibilityScore,
  getCompatiblePlants,
  getConsistencyBonus,
  getDailyQuests,
  getDaylightHours,
  getDaylightInfo,
  getDaysSince,
  getEstimatedLastFrost,
  getFertilizerDays,
  getFirstFrostDate,
  getFirstPlantingMonth,
  getFrameColor,
  getFrostMaturityInfo,
  getFrostSeasonMonths,
  getGardenXP,
  getHarvestCountdown,
  getHarvestDays,
  getLastFrostDate,
  getLastWateredText,
  getMonthEmoji,
  getNextWaterInfo,
  getPairReason,
  getPlantDifficulty,
  getPlantHealthStatus,
  getPlantQuickFacts,
  getPlantSeasonLabel,
  getPlantSpecificTip,
  getPlantSunNeed,
  getPlantingGuide,
  getPlantingSteps,
  getPlantingWindowText,
  getPowerPairs,
  getProfileBanners,
  getRainSkipToday,
  getRarity,
  getSearchSuggestions,
  getSeasonForMonth,
  getSeasonalIntelligenceLabel,
  getSeedStartInfo,
  getSeedStartWeeks,
  getShouldGrowText,
  getSmartWeatherRecommendation,
  getStreakDaysLeft,
  getSuccessionInfo,
  getSuccessionInterval,
  getSuggestionsForMonth,
  getSunMismatch,
  getTodayKey,
  getUpcomingFrost,
  getWaterTriage,
  getWateringCount,
  getWateringRhythm,
  getWateringStreak,
  getWateringTip,
  getWeatherIconFromDay,
  getWhereToPlantText,
  getZipRecord,
  harvestDays,
  homeBuddyImage,
  isPerennial,
  journalBuddyImage,
  loadingScreenImage,
  matchesType,
  maybeAskForReview,
  migrateGardenToAreas,
  normalizeType,
  normalizeZip,
  parseFrostOverride,
  parseHarvestQuantity,
  plantImages,
  plantsBuddyImage,
  premiumBuddyImage,
  profileBuddyImage,
  resolvePlantImageSource,
  setFrostOverrideRef,
  successHaptic,
  tapHaptic,
  toGallons,
  weatherBuddyImage,
  welcomeBuddyImage,
  zoneMatch,
  zoneNumber
} from "./core";
import { AccountCloudCard } from "./components/AccountCloudCard";
import { AchievementCard } from "./components/AchievementCard";
import { AllNotesCard } from "./components/AllNotesCard";
import { AnimatedBar } from "./components/AnimatedBar";
import { AreaPlannerMap } from "./components/AreaPlannerMap";
import { BackgroundDecoration } from "./components/BackgroundDecoration";
import { CollapsibleCard } from "./components/CollapsibleCard";
import { ConfettiBurst } from "./components/ConfettiBurst";
import { CropRotationCard } from "./components/CropRotationCard";
import { DailyBonusCard } from "./components/DailyBonusCard";
import { DailyQuestsCard } from "./components/DailyQuestsCard";
import { DataExportCard } from "./components/DataExportCard";
import { DaylightCard } from "./components/DaylightCard";
import { EmptyGardenStarterCard } from "./components/EmptyGardenStarterCard";
import { FertilizerIntelligenceCard } from "./components/FertilizerIntelligenceCard";
import { FixMyGardenCard } from "./components/FixMyGardenCard";
import { FloatingParticle } from "./components/FloatingParticle";
import { ForecastCard } from "./components/ForecastCard";
import { FrostBanner } from "./components/FrostBanner";
import { FrostChecklistCard } from "./components/FrostChecklistCard";
import { FrostOverrideCard } from "./components/FrostOverrideCard";
import { FrostWindowCard } from "./components/FrostWindowCard";
import { GardenAreaManager } from "./components/GardenAreaManager";
import { GardenHealthCard } from "./components/GardenHealthCard";
import { GardenHealthHomeCard } from "./components/GardenHealthHomeCard";
import { GardenIntelligenceCard } from "./components/GardenIntelligenceCard";
import { GardenPlannerMap } from "./components/GardenPlannerMap";
import { GardenROICard } from "./components/GardenROICard";
import { GardenShoppingListCard } from "./components/GardenShoppingListCard";
import { GardenStatsDashboard } from "./components/GardenStatsDashboard";
import { GardenStoryCard } from "./components/GardenStoryCard";
import { GardenSummaryRow } from "./components/GardenSummaryRow";
import { GardenerProfileCard } from "./components/GardenerProfileCard";
import { GlowPlantCard } from "./components/GlowPlantCard";
import { HarvestGoalCard } from "./components/HarvestGoalCard";
import { HarvestLogCard } from "./components/HarvestLogCard";
import { HarvestReadyCard } from "./components/HarvestReadyCard";
import { HarvestRevealCard } from "./components/HarvestRevealCard";
import { JournalCard } from "./components/JournalCard";
import { LiveWeatherCard } from "./components/LiveWeatherCard";
import { LoadingScreen } from "./components/LoadingScreen";
import { MiniStat } from "./components/MiniStat";
import { MonthlyChecklistCard } from "./components/MonthlyChecklistCard";
import { MostLovedPlantsCard } from "./components/MostLovedPlantsCard";
import { MyGardenTodayCard } from "./components/MyGardenTodayCard";
import { OnThisDayCard } from "./components/OnThisDayCard";
import { OnboardingCard } from "./components/OnboardingCard";
import { PersonalPlantingCalendar } from "./components/PersonalPlantingCalendar";
import { PestWatchCard } from "./components/PestWatchCard";
import { PlantAnniversaryCard } from "./components/PlantAnniversaryCard";
import { PlantGrowthTimeline } from "./components/PlantGrowthTimeline";
import { PlantHealthAnalyzerCard } from "./components/PlantHealthAnalyzerCard";
import { PlantTodayHero } from "./components/PlantTodayHero";
import { PlantingGuideCard } from "./components/PlantingGuideCard";
import { PowerPairsCard } from "./components/PowerPairsCard";
import { PremiumIntroCard } from "./components/PremiumIntroCard";
import { PremiumLockedCard } from "./components/PremiumLockedCard";
import { PremiumLockedSection } from "./components/PremiumLockedSection";
import { ProfileBannersCard } from "./components/ProfileBannersCard";
import { ReminderControlCard } from "./components/ReminderControlCard";
import { RescueModeCard } from "./components/RescueModeCard";
import { SavedPlantRow } from "./components/SavedPlantRow";
import { SavedPlantsCard } from "./components/SavedPlantsCard";
import { SeasonComparisonCard } from "./components/SeasonComparisonCard";
import { SeasonTransitionCard } from "./components/SeasonTransitionCard";
import { SeedStartingCard } from "./components/SeedStartingCard";
import { SettingsCard } from "./components/SettingsCard";
import { SmartReminderHomeCard } from "./components/SmartReminderHomeCard";
import { SoilCareLogCard } from "./components/SoilCareLogCard";
import { StatsRow } from "./components/StatsRow";
import { StreakProgressCard } from "./components/StreakProgressCard";
import { SuccessionSowingCard } from "./components/SuccessionSowingCard";
import { SunlightMismatchCard } from "./components/SunlightMismatchCard";
import { SwipeablePlantGallery } from "./components/SwipeablePlantGallery";
import { ThrivingNearYouCard } from "./components/ThrivingNearYouCard";
import { TodaysGamePlanCard } from "./components/TodaysGamePlanCard";
import { WaterTriageCard } from "./components/WaterTriageCard";
import { WaterUsageCard } from "./components/WaterUsageCard";
import { WateringForecastCard } from "./components/WateringForecastCard";
import { WateringHeatmapCard } from "./components/WateringHeatmapCard";
import { WateringRhythmCard } from "./components/WateringRhythmCard";
import { WateringStreakNudge } from "./components/WateringStreakNudge";
import { WeatherParticles } from "./components/WeatherParticles";
import { WeatherTaskCard } from "./components/WeatherTaskCard";
import { WeatherTeaserCard } from "./components/WeatherTeaserCard";
import { WeatherWarningBanner } from "./components/WeatherWarningBanner";
import { WeeklyAndTasksCard } from "./components/WeeklyAndTasksCard";
import { WeeklyGardenRecapCard } from "./components/WeeklyGardenRecapCard";
import { WeeklyWateringGrid } from "./components/WeeklyWateringGrid";
import { XPCard } from "./components/XPCard";
import { YearInReviewCard } from "./components/YearInReviewCard";
import { GardenTab } from "./screens/GardenTab";
import { HomeTab } from "./screens/HomeTab";
import { JournalTab } from "./screens/JournalTab";
import { PlantsTab } from "./screens/PlantsTab";
import { PremiumTab } from "./screens/PremiumTab";
import { ProfileTab } from "./screens/ProfileTab";
import { WeatherTab } from "./screens/WeatherTab";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
const vacationRef = useRef(vacation);
useEffect(() => { vacationRef.current = vacation; }, [vacation]);
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
const [plantsVisibleCount, setPlantsVisibleCount] = useState(20);
useEffect(() => { setPlantsVisibleCount(20); }, [selectedType, plantSearch]);
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
                days: getHarvestDays(selectedPlant),
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
  <HomeTab
  claimDailyBonus={claimDailyBonus}
  combinedGardenMap={combinedGardenMap}
  compatiblePlants={compatiblePlants}
  completedQuestIds={completedQuestIds}
  dailyBonusClaimed={dailyBonusClaimed}
  dailyBonusDate={dailyBonusDate}
  dailyQuests={dailyQuests}
  dismissPremiumIntro={dismissPremiumIntro}
  fertilizerTrackers={fertilizerTrackers}
  frostChecklist={frostChecklist}
  frostDatesHidden={frostDatesHidden}
  frostOverrides={frostOverrides}
  gardenXP={gardenXP}
  harvestLog={harvestLog}
  harvestTrackers={harvestTrackers}
  homeBannerDismissedDate={homeBannerDismissedDate}
  journalEntries={journalEntries}
  jumpToTab={jumpToTab}
  markPlantWatered={markPlantWatered}
  monthlyChecklist={monthlyChecklist}
  monthlySuggestions={monthlySuggestions}
  openPlantFromList={openPlantFromList}
  pickJournalPhoto={pickJournalPhoto}
  pinnedPlants={pinnedPlants}
  plantFolders={plantFolders}
  plantSaveDates={plantSaveDates}
  premiumUnlocked={premiumUnlocked}
  record={record}
  savedPlants={savedPlants}
  scrollRef={scrollRef}
  setCompletedQuestIds={setCompletedQuestIds}
  setFrostChecklist={setFrostChecklist}
  setFrostDatesHidden={setFrostDatesHidden}
  setFrostOverrides={setFrostOverrides}
  setHomeBannerDismissedDate={setHomeBannerDismissedDate}
  setMonthlyChecklist={setMonthlyChecklist}
  setQuestXP={setQuestXP}
  setShowWhatsNew={setShowWhatsNew}
  setSowLog={setSowLog}
  setXpPopups={setXpPopups}
  setZip={setZip}
  showPremiumIntro={showPremiumIntro}
  showWhatsNew={showWhatsNew}
  snoozedPlants={snoozedPlants}
  sowLog={sowLog}
  streakData={streakData}
  streakFreeze={streakFreeze}
  theme={theme}
  togglePinnedPlant={togglePinnedPlant}
  uploadingPhoto={uploadingPhoto}
  useStreakFreeze={useStreakFreeze}
  waterAllPlants={waterAllPlants}
  waterPlant={waterPlant}
  wateredPlants={wateredPlants}
  wateringAmounts={wateringAmounts}
  wateringHistory={wateringHistory}
  wateringSectionY={wateringSectionY}
  weather={weather}
  zipCoords={zipCoords}
  zone={zone}
/>
          ) : null}
          {record && activeTab === "garden" ? (
  <GardenTab
  addGardenArea={addGardenArea}
  assignPlantToAreaSlot={assignPlantToAreaSlot}
  clearAreaSlot={clearAreaSlot}
  deleteGardenArea={deleteGardenArea}
  fertilizerTrackers={fertilizerTrackers}
  gardenAreas={gardenAreas}
  gardenY={gardenY}
  harvestTrackers={harvestTrackers}
  openPlantFromList={openPlantFromList}
  pickAreaPhoto={pickAreaPhoto}
  renameGardenArea={renameGardenArea}
  savedPlants={savedPlants}
  setAreaStyle={setAreaStyle}
  theme={theme}
  waterArea={waterArea}
  wateredPlants={wateredPlants}
  weather={weather}
  zip={zip}
  zone={zone}
/>
) : null}
{record && activeTab === "plants" ? (
  <PlantsTab
  comparePlants={comparePlants}
  filteredPlants={filteredPlants}
  followedPlants={followedPlants}
  markPlantWatered={markPlantWatered}
  monthScrollDone={monthScrollDone}
  monthScrollRef={monthScrollRef}
  monthlyPicksY={monthlyPicksY}
  monthlySuggestions={monthlySuggestions}
  openPlantFromList={openPlantFromList}
  openPlantFromMonthly={openPlantFromMonthly}
  plantSearch={plantSearch}
  plantsListY={plantsListY}
  plantsVisibleCount={plantsVisibleCount}
  recentPlants={recentPlants}
  savedPlants={savedPlants}
  scrollRef={scrollRef}
  selectedMonth={selectedMonth}
  selectedType={selectedType}
  setComparePlants={setComparePlants}
  setPlantSearch={setPlantSearch}
  setPlantsVisibleCount={setPlantsVisibleCount}
  setSelectedMonth={setSelectedMonth}
  setSelectedType={setSelectedType}
  snoozePlantWatering={snoozePlantWatering}
  snoozedPlants={snoozedPlants}
  theme={theme}
  toggleComparePlant={toggleComparePlant}
  toggleFollowPlant={toggleFollowPlant}
  toggleSavedPlant={toggleSavedPlant}
  wateredPlants={wateredPlants}
  wateringHistory={wateringHistory}
  weather={weather}
  zone={zone}
/>
) : null}
{activeTab === "weather" ? (
  <WeatherTab
  frostAlertsOn={frostAlertsOn}
  gardenMap={gardenMap}
  harvestTrackers={harvestTrackers}
  jumpToTab={jumpToTab}
  openPlantFromList={openPlantFromList}
  premiumUnlocked={premiumUnlocked}
  savedPlants={savedPlants}
  smartRecommendation={smartRecommendation}
  theme={theme}
  wateredPlants={wateredPlants}
  wateringHistory={wateringHistory}
  weather={weather}
  zone={zone}
/>
) : null}

{activeTab === "journal" ? (
  <JournalTab
  careLog={careLog}
  deleteJournalEntry={deleteJournalEntry}
  harvestLog={harvestLog}
  journalEntries={journalEntries}
  journalY={journalY}
  openPlantFromList={openPlantFromList}
  pickJournalPhoto={pickJournalPhoto}
  plantNotes={plantNotes}
  savedPlants={savedPlants}
  scheduleFertilizerReminder={scheduleFertilizerReminder}
  setCareLog={setCareLog}
  setHarvestLog={setHarvestLog}
  setWateringAmounts={setWateringAmounts}
  showUndoToast={showUndoToast}
  theme={theme}
  uploadingPhoto={uploadingPhoto}
  wateringAmounts={wateringAmounts}
/>
) : null}
{record && activeTab === "profile" ? (
  <ProfileTab
  achievementBadges={achievementBadges}
  activeBannerId={activeBannerId}
  avatarGlow={avatarGlow}
  cancelReminder={cancelReminder}
  careLog={careLog}
  dailyWateringOn={dailyWateringOn}
  ensureNotificationPermission={ensureNotificationPermission}
  frostAlertsOn={frostAlertsOn}
  gardenAreas={gardenAreas}
  gardenMap={gardenMap}
  gardenXP={gardenXP}
  harvestGoal={harvestGoal}
  harvestLog={harvestLog}
  harvestTrackers={harvestTrackers}
  journalEntries={journalEntries}
  jumpToTab={jumpToTab}
  monthlyPlantingOn={monthlyPlantingOn}
  newEmail={newEmail}
  plantOfDayOn={plantOfDayOn}
  premiumUnlocked={premiumUnlocked}
  premiumY={premiumY}
  profileBanners={profileBanners}
  profileName={profileName}
  profilePhoto={profilePhoto}
  reminderY={reminderY}
  remindersOn={remindersOn}
  savedPlants={savedPlants}
  scheduleDailyReminder={scheduleDailyReminder}
  seenGardenGod={seenGardenGod}
  selectedProfileTheme={selectedProfileTheme}
  setActiveBannerId={setActiveBannerId}
  setAppearanceMode={setAppearanceMode}
  setDailyWateringOn={setDailyWateringOn}
  setFrostAlertsOn={setFrostAlertsOn}
  setHarvestGoal={setHarvestGoal}
  setMonthlyPlantingOn={setMonthlyPlantingOn}
  setNewEmail={setNewEmail}
  setProfileName={setProfileName}
  setProfilePhoto={setProfilePhoto}
  setRemindersOn={setRemindersOn}
  setSeenGardenGod={setSeenGardenGod}
  setSelectedProfileTheme={setSelectedProfileTheme}
  setSuppliesSpent={setSuppliesSpent}
  setWateringReminderTime={setWateringReminderTime}
  streakData={streakData}
  subscriptionPlan={subscriptionPlan}
  suppliesSpent={suppliesSpent}
  theme={theme}
  togglePlantOfDay={togglePlantOfDay}
  user={user}
  wateredPlants={wateredPlants}
  wateringHistory={wateringHistory}
  wateringReminderTime={wateringReminderTime}
  weather={weather}
  zone={zone}
/>
) : null}
{activeTab === "premium" ? (
  <PremiumTab
  premiumUnlocked={premiumUnlocked}
  premiumY={premiumY}
  prismLogo={prismLogo}
  setPremiumUnlocked={setPremiumUnlocked}
  setSubscriptionPlan={setSubscriptionPlan}
  subscriptionPlan={subscriptionPlan}
  theme={theme}
  unlockPremium={unlockPremium}
/>
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
