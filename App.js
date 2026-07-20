import React, { useEffect, useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "./lib/supabase";
import { isBiometricAvailable, getBiometricLabel, isBiometricEnabled, enableBiometricLogin, disableBiometricLogin, authenticateAndGetCredentials } from "./lib/biometricAuth";
import { hydrateTabHeroes } from "./components/TabHero";
import {
  Alert,
  Animated,
  Appearance,
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
import * as ImageManipulator from "expo-image-manipulator";
import * as SplashScreen from "expo-splash-screen";
import * as StoreReview from "expo-store-review";
import Purchases from 'react-native-purchases';
import prismLogo from "./assets/prism-logo.png";
import zipZoneData from "./data/zipZoneData";
import produceData from "./data/produceData";
import { styles } from "./styles";
import { getDateKey,
  getPlantFamily,
  hasPremiumEntitlement,
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
  formatTemp,
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
  setHapticsEnabled,
  successHaptic,
  tapHaptic,
  toGallons,
  weatherBuddyImage,
  welcomeBuddyImage,
  zoneMatch,
  zoneNumber
} from "./core";
import { BackgroundDecoration } from "./components/BackgroundDecoration";
import { ConfettiBurst } from "./components/ConfettiBurst";
import { getBadgeImage } from "./data/badgeImageMap";
import { getBannerImage } from "./data/bannerImageMap";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { OnboardingCard } from "./components/OnboardingCard";
import { PestDetailScreen } from "./components/PestDetailScreen";
import { PlantGrowthTimeline } from "./components/PlantGrowthTimeline";
import { PremiumLockedCard } from "./components/PremiumLockedCard";
import { PremiumLockedSection } from "./components/PremiumLockedSection";
import { WeatherParticles } from "./components/WeatherParticles";
import { GardenTab } from "./screens/GardenTab";
import { HomeTab } from "./screens/HomeTab";
import { JournalTab } from "./screens/JournalTab";
import { PlantsTab } from "./screens/PlantsTab";
import { PremiumTab } from "./screens/PremiumTab";
import { ProfileTab } from "./screens/ProfileTab";
import { SettingsTab } from "./screens/SettingsTab";
import { WeatherTab } from "./screens/WeatherTab";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

// Silence noisy/sensitive console output in production (auth data and full API
// responses were being logged). console.error is kept for crash diagnostics.
if (!__DEV__) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
}

// Hold the native splash until fonts are ready so there's no flash before the UI.
SplashScreen.preventAutoHideAsync().catch(() => {});

// ── Global Inter typography ──────────────────────────────────────────────────
// Custom fonts don't honor fontWeight, so map each weight to the matching Inter
// family. This also softens the hierarchy (900->ExtraBold, 800->Bold, 700->SemiBold)
// so the UI reads polished instead of all-black-weight. Patched once onto Text /
// TextInput so it covers StyleSheet AND inline styles everywhere. If anything fails
// it returns the original element, so the app simply falls back to the system font.
const INTER_BY_WEIGHT = {
  "300": "Inter_400Regular",
  "400": "Inter_400Regular",
  "500": "Inter_500Medium",
  "600": "Inter_600SemiBold",
  "700": "Inter_600SemiBold",
  "800": "Inter_700Bold",
  "900": "Inter_800ExtraBold",
  normal: "Inter_400Regular",
  bold: "Inter_700Bold",
};
function withInterFont(style) {
  const flat = StyleSheet.flatten(style) || {};
  const weight = flat.fontWeight != null ? String(flat.fontWeight) : "400";
  const family = INTER_BY_WEIGHT[weight] || "Inter_500Medium";
  return [{ fontFamily: family }, style, { fontWeight: undefined }];
}
if (Text.render && !Text.__interPatched) {
  const origTextRender = Text.render;
  Text.render = function (...args) {
    const el = origTextRender.apply(this, args);
    try { return React.cloneElement(el, { style: withInterFont(el.props.style) }); }
    catch (e) { return el; }
  };
  Text.__interPatched = true;
}
if (TextInput.render && !TextInput.__interPatched) {
  const origInputRender = TextInput.render;
  TextInput.render = function (...args) {
    const el = origInputRender.apply(this, args);
    try { return React.cloneElement(el, { style: withInterFont(el.props.style) }); }
    catch (e) { return el; }
  };
  TextInput.__interPatched = true;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // Foreground display — new SDK keys (shouldShowAlert was deprecated).
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Android 8+ requires a notification channel or reminders arrive silently/low-priority.
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "Garden Reminders",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#8effab",
  }).catch(() => {});
}

function AppInner() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  // Proceed once fonts load OR if they error — never trap the user on the splash.
  const fontsReady = fontsLoaded || !!fontError;
  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync().catch(() => {});
  }, [fontsReady]);

  // Handle password-reset / email-confirm deep links. With the implicit flow the tokens
  // arrive in the URL fragment; set the session, then open the reset-password modal.
  useEffect(() => {
    async function handleDeepLink(url) {
      if (!url) return;
      try {
        const fragment = url.split("#")[1] || "";
        const params = Object.fromEntries(new URLSearchParams(fragment));
        if (params.access_token) {
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
        }
        if (params.type === "recovery" || url.includes("reset-password")) {
          setShowResetPassword(true);
        }
      } catch (e) {
        console.log("Deep link handling error:", e?.message);
      }
    }
    Linking.getInitialURL().then((url) => { if (url) handleDeepLink(url); });
    const sub = Linking.addEventListener("url", (e) => handleDeepLink(e.url));
    return () => sub.remove();
  }, []);
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
  const [appearanceMode, setAppearanceMode] = useState("dark"); // "dark" | "light" | "system"
  const [systemScheme, setSystemScheme] = useState(Appearance.getColorScheme() || "dark");
  const [unitSystem, setUnitSystem] = useState("imperial"); // "imperial" | "metric"
  const [hapticsOn, setHapticsOn] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedPest, setSelectedPest] = useState(null);
  const [returnSection, setReturnSection] = useState(null);
  const [remindersOn, setRemindersOn] = useState(false);
  const [frostAlertsOn, setFrostAlertsOn] = useState(false);
  const [monthlyPlantingOn, setMonthlyPlantingOn] = useState(false);
  const [dailyWateringOn, setDailyWateringOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({ count: 1, lastOpened: getTodayKey() });
  const [streakRecoveryOffer, setStreakRecoveryOffer] = useState(null); // { prevCount } after a 1-day miss
  const [profileName, setProfileName] = useState("My Gardener Profile!");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [selectedProfileTheme, setSelectedProfileTheme] = useState("forest");
  const [shownAchievements, setShownAchievements] = useState([]);
  const [cloudProfileLoaded, setCloudProfileLoaded] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [celebrationBadge, setCelebrationBadge] = useState(null);
  const [shownBanners, setShownBanners] = useState([]);
  const [celebrationBanner, setCelebrationBanner] = useState(null);
  // The day each badge/banner was first seen unlocked, so the cards can show "Earned <date>".
  const [badgeEarnedDates, setBadgeEarnedDates] = useState({});
  const [bannerEarnedDates, setBannerEarnedDates] = useState({});
  const [previousLevel, setPreviousLevel] = useState(1);
  const [xpPopups, setXpPopups] = useState([]);
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [authMode, setAuthMode] = useState("login");
const [biometricAvailable, setBiometricAvailable] = useState(false);
const [biometricEnabled, setBiometricEnabled] = useState(false);
const [biometricLabel, setBiometricLabel] = useState("Face ID");
const [newEmail, setNewEmail] = useState("");
const [careLog, setCareLog] = useState([]);
const [harvestLog, setHarvestLog] = useState([]);
const [uploadingPhoto, setUploadingPhoto] = useState(false);
const [plantSearch, setPlantSearch] = useState("");
const [plantDifficultyFilter, setPlantDifficultyFilter] = useState("All"); // All | Easy | Medium | Hard
const [plantNowOnly, setPlantNowOnly] = useState(false); // when true, only "Plant now" plants for the zone
const [plantSortMode, setPlantSortMode] = useState("smart"); // smart | az | harvest | difficulty
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
const [plantPickDismissedDate, setPlantPickDismissedDate] = useState(null);
const [showScrollTop, setShowScrollTop] = useState(false);
const [showStreakCelebration, setShowStreakCelebration] = useState(null);
const [milestoneCelebration, setMilestoneCelebration] = useState(null); // { emoji, title, text }
const [firedMilestones, setFiredMilestones] = useState([]); // ids already celebrated
const [showWhatsNew, setShowWhatsNew] = useState(false);
const [showAnniversary, setShowAnniversary] = useState(null);
const [showFirstSave, setShowFirstSave] = useState(false);
const [showCareLogModal, setShowCareLogModal] = useState(false);
const [undoToast, setUndoToast] = useState(null); // { message, onUndo }
const [syncFailed, setSyncFailed] = useState(false); // cloud save failed → show banner
const [showResetPassword, setShowResetPassword] = useState(false);
const [resetPasswordValue, setResetPasswordValue] = useState("");
const undoTimerRef = useRef(null);
const saveTimerRef = useRef(null);
// Tracks which AsyncStorage-backed lists have hydrated, so their persist effects
// don't write the initial empty value on mount and clobber saved data before load.
const persistHydrated = useRef({});
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
      Alert.alert(error.message);
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
      Alert.alert(error.message);
      return;
    }

    maybeOfferBiometric(email, password);
  }
};

// After a successful password login, offer to turn on Face ID / Touch ID for next time.
const maybeOfferBiometric = (loginEmail, loginPassword) => {
  if (!biometricAvailable || biometricEnabled) return;
  Alert.alert(
    `Enable ${biometricLabel}?`,
    `Sign in faster next time with ${biometricLabel} instead of typing your password.`,
    [
      { text: "Not now", style: "cancel" },
      {
        text: `Enable ${biometricLabel}`,
        onPress: async () => {
          const ok = await enableBiometricLogin(loginEmail, loginPassword);
          if (ok) setBiometricEnabled(true);
        },
      },
    ]
  );
};

// Sign in using the stored credentials, unlocked by the device biometric check.
const handleBiometricLogin = async () => {
  const creds = await authenticateAndGetCredentials(`Sign in with ${biometricLabel}`);
  if (!creds) return;
  const { error } = await supabase.auth.signInWithPassword({
    email: creds.email,
    password: creds.password,
  });
  if (error) {
    // Stored password no longer works (e.g. it was changed) — clear it so the user falls back to typing.
    await disableBiometricLogin();
    setBiometricEnabled(false);
    Alert.alert(`${biometricLabel} sign-in failed`, "Please sign in with your email and password.");
  }
};

// Follow the OS light/dark setting live when appearance is set to "system".
useEffect(() => {
  const sub = Appearance.addChangeListener(({ colorScheme }) => {
    setSystemScheme(colorScheme || "dark");
  });
  return () => sub.remove();
}, []);

// Detect biometric hardware + whether the user already opted in.
useEffect(() => {
  let alive = true;
  (async () => {
    const available = await isBiometricAvailable();
    if (!alive) return;
    setBiometricAvailable(available);
    if (available) {
      setBiometricLabel(await getBiometricLabel());
      setBiometricEnabled(await isBiometricEnabled());
    }
  })();
  return () => { alive = false; };
}, []);

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
  setShownBanners([]);
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
      shown_banners: shownBanners,
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
    setSyncFailed(true);
  } else {
    console.log("Full cloud save ✅");
    setSyncFailed(false);
  }

  // Optional preference columns — synced separately so that if the profiles
  // table doesn't have these columns yet, it silently no-ops instead of
  // breaking the main sync above. Add the columns in Supabase to enable.
  // We attempt once per session; if the columns are missing we stop retrying
  // (and stop logging) until the app restarts.
  if (!optionalPrefsUnavailable.current) {
    try {
      const { error: prefErr } = await supabase
        .from("profiles")
        .update({
          unit_system: unitSystem,
          badge_earned_dates: badgeEarnedDates,
          banner_earned_dates: bannerEarnedDates,
        })
        .eq("id", user.id);
      if (prefErr) {
        optionalPrefsUnavailable.current = true;
        console.log("Optional prefs sync disabled — add unit_system / badge_earned_dates / banner_earned_dates columns to enable:", prefErr.message);
      }
    } catch (e) {
      optionalPrefsUnavailable.current = true;
    }
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

if (data?.unit_system === "metric" || data?.unit_system === "imperial")
  setUnitSystem(data.unit_system);

if (data?.badge_earned_dates && typeof data.badge_earned_dates === "object")
  setBadgeEarnedDates(data.badge_earned_dates);

if (data?.banner_earned_dates && typeof data.banner_earned_dates === "object")
  setBannerEarnedDates(data.banner_earned_dates);

if (typeof data?.show_premium_intro === "boolean")
  setShowPremiumIntro(data.show_premium_intro);

if (typeof data?.show_onboarding === "boolean")
  setShowOnboarding(data.show_onboarding);

  if (Array.isArray(data?.shown_achievements))
  setShownAchievements(data.shown_achievements);

  if (Array.isArray(data?.shown_banners))
  setShownBanners(data.shown_banners);

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
  const pestReturnY = useRef(0);
  const currentScrollY = useRef(0);
  const optionalPrefsUnavailable = useRef(false);
  const previousXP = useRef(0);
  const lastFrostAlertDate = useRef(null);
  const lastHeatAlertDate = useRef(null);
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
  const DIFF_ORDER = { Easy: 0, Medium: 1, Hard: 2 };
  const terms = plantSearch.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const byName = (a, b) => a.name.localeCompare(b.name);

  const list = produceData.filter((item) => {
    if (!matchesType(item, selectedType)) return false;
    if (plantDifficultyFilter !== "All" && getPlantDifficulty(item).label !== plantDifficultyFilter) return false;
    if (plantNowOnly && getPlantSeasonLabel(item, zone) !== "Plant now") return false;
    if (terms.length) {
      // Multi-term search: every word must appear somewhere in the plant's fields.
      const haystack = [
        item.name,
        normalizeType(item.type, item.name),
        getPlantSeasonLabel(item, zone),
        getPlantDifficulty(item).label,
        isPerennial(item) ? "perennial" : "annual",
      ]
        .join(" ")
        .toLowerCase();
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });

  if (plantSortMode === "az") return list.sort(byName);
  if (plantSortMode === "harvest") return list.sort((a, b) => (getHarvestDays(a) - getHarvestDays(b)) || byName(a, b));
  if (plantSortMode === "difficulty") return list.sort((a, b) => (DIFF_ORDER[getPlantDifficulty(a).label] - DIFF_ORDER[getPlantDifficulty(b).label]) || byName(a, b));
  // "smart" (default): in-season plants first, then alphabetical.
  return list.sort((a, b) => {
    const aNow = getPlantSeasonLabel(a, zone) === "Plant now";
    const bNow = getPlantSeasonLabel(b, zone) === "Plant now";
    if (aNow && !bNow) return -1;
    if (!aNow && bNow) return 1;
    return byName(a, b);
  });
}, [
  selectedType,
  zone,
  plantSearch,
  plantDifficultyFilter,
  plantNowOnly,
  plantSortMode,
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
      harvestLog,
      fertilizerTrackers,
      comparePlants,
    }),
  [
    savedPlants,
    journalEntries,
    combinedGardenMap,
    wateredPlants,
    careLog,
    harvestTrackers,
    streakData,
    harvestLog,
    fertilizerTrackers,
    comparePlants,
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
// Light theme is not readable yet, so it's temporarily disabled — the app always
// renders dark. The appearanceMode/systemScheme plumbing below is kept intact so
// re-enabling is a one-line change once a proper light theme exists.
const resolvedScheme = appearanceMode === "system" ? systemScheme : appearanceMode; // eslint-disable-line no-unused-vars
const isDark = true;
const activeThemeAccent =
  PROFILE_THEMES.find(
    (t) => t.id === selectedProfileTheme
  )?.accent || "#5cff89";

// Memoized so `theme` keeps a stable identity between renders (it's passed to nearly
// every component); only rebuilds when the mode or accent actually changes. This is
// what makes any downstream React.memo on cards actually able to skip re-renders.
const theme = useMemo(
  () =>
    isDark
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
        },
  [isDark, activeThemeAccent]
);

  // ── Helper functions ───────────────────────────────────────────────────────
  function openPlantByName(name) {
    const resolved = resolveCompanionPlant(name);
    const target = String(resolved ? resolved.name : name).toLowerCase().replace(/_/g, " ").trim();
    const found = produceData.find((item) => String(item?.name || "").toLowerCase().replace(/_/g, " ").trim() === target);
    if (found) {
      plantReturnY.current = currentScrollY.current;
      setReturnSection("exact");
      setSelectedPlant(found);
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
  function openPest(pest) {
    if (!pest) return;
    tapHaptic("light");
    pestReturnY.current = currentScrollY.current;
    setSelectedPest(pest);
  }
  function handleBackFromPest() {
    setSelectedPest(null);
    setTimeout(() => { scrollRef.current?.scrollTo({ y: pestReturnY.current, animated: false }); }, 80);
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

  // Debounce: many state changes (typing notes, watering, etc.) fire this rapidly.
  // Coalesce them into one Supabase upsert ~1.2s after activity stops.
  if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  saveTimerRef.current = setTimeout(() => { saveProfileToSupabase(); }, 1200);
  return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
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
        "pp_plantPickDismissedDate",
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
        if (map["pp_plantPickDismissedDate"]) setPlantPickDismissedDate(map["pp_plantPickDismissedDate"]);
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
  if (!persistHydrated.current.recentPlants) { persistHydrated.current.recentPlants = true; return; }
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
  if (!persistHydrated.current.pinnedPlants) { persistHydrated.current.pinnedPlants = true; return; }
  AsyncStorage.setItem("pp_pinnedPlants", JSON.stringify(pinnedPlants));
}, [pinnedPlants]);

useEffect(() => {
  // Don't persist until the saved list has hydrated, otherwise the initial empty []
  // clobbers stored milestones on every launch and they re-fire forever.
  if (!milestonesHydrated.current) return;
  AsyncStorage.setItem("pp_firedMilestones", JSON.stringify(firedMilestones));
}, [firedMilestones]);

useEffect(() => {
  if (!persistHydrated.current.plantSaveDates) { persistHydrated.current.plantSaveDates = true; return; }
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
  if (!persistHydrated.current.harvestGoal) { persistHydrated.current.harvestGoal = true; return; }
  AsyncStorage.setItem("pp_harvestGoal", JSON.stringify(harvestGoal));
}, [harvestGoal]);

useEffect(() => {
  AsyncStorage.setItem("pp_unitSystem", unitSystem);
}, [unitSystem]);

useEffect(() => {
  AsyncStorage.getItem("pp_unitSystem").then((val) => {
    if (val === "metric" || val === "imperial") setUnitSystem(val);
  }).catch(() => {});
}, []);

// Keep the core haptics switch in sync, and persist the preference.
useEffect(() => {
  setHapticsEnabled(hapticsOn);
  AsyncStorage.setItem("pp_hapticsOn", hapticsOn ? "1" : "0");
}, [hapticsOn]);

useEffect(() => {
  AsyncStorage.getItem("pp_hapticsOn").then((val) => {
    if (val === "0") setHapticsOn(false);
  }).catch(() => {});
}, []);

// Remember the Plants-tab filters between sessions.
useEffect(() => {
  if (!persistHydrated.current.plantFilters) { persistHydrated.current.plantFilters = true; return; }
  AsyncStorage.setItem("pp_plantFilters", JSON.stringify({ selectedType, plantDifficultyFilter, plantNowOnly, plantSortMode })).catch(() => {});
}, [selectedType, plantDifficultyFilter, plantNowOnly, plantSortMode]);

useEffect(() => {
  AsyncStorage.getItem("pp_plantFilters").then((val) => {
    if (!val) return;
    try {
      const f = JSON.parse(val) || {};
      if (typeof f.selectedType === "string") setSelectedType(f.selectedType);
      if (typeof f.plantDifficultyFilter === "string") setPlantDifficultyFilter(f.plantDifficultyFilter);
      if (typeof f.plantNowOnly === "boolean") setPlantNowOnly(f.plantNowOnly);
      if (typeof f.plantSortMode === "string") setPlantSortMode(f.plantSortMode);
    } catch (e) { /* ignore bad data */ }
  }).catch(() => {});
}, []);

useEffect(() => {
  AsyncStorage.setItem("pp_suppliesSpent", String(suppliesSpent));
}, [suppliesSpent]);

useEffect(() => {
  if (!persistHydrated.current.wateringAmounts) { persistHydrated.current.wateringAmounts = true; return; }
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
  if (!persistHydrated.current.snoozedPlants) { persistHydrated.current.snoozedPlants = true; return; }
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
      const tomorrowKey = getDateKey(new Date(Date.now() + 86400000));
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
  if (!persistHydrated.current.streakFreeze) { persistHydrated.current.streakFreeze = true; return; }
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

  hydrateTabHeroes();

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

    // Already denied and iOS won't let us re-prompt — point to system settings.
    if (settings.canAskAgain === false) {
      return new Promise((resolve) => {
        Alert.alert(
          "Notifications are off",
          "Turn on notifications for Pocket Planter in your phone's Settings to get watering, frost, and harvest reminders.",
          [
            { text: "Not now", style: "cancel", onPress: () => resolve(false) },
            { text: "Open Settings", onPress: () => { Linking.openSettings().catch(() => {}); resolve(false); } },
          ]
        );
      });
    }

    // First-time priming — explain the value before the one-shot OS prompt, so
    // we don't burn it on a hesitant user (which would then require a Settings trip).
    const wantsIt = await new Promise((resolve) => {
      Alert.alert(
        "Stay on top of your garden 🌱",
        "Pocket Planter can remind you when to water, warn you before frost or heat, and tell you when plants are ready to harvest. Turn on notifications?",
        [
          { text: "Not now", style: "cancel", onPress: () => resolve(false) },
          { text: "Turn On", onPress: () => resolve(true) },
        ]
      );
    });
    if (!wantsIt) return false;

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
      // Missed roughly one day with a streak worth saving — reset now, but offer
      // to restore it with a freeze (handled by the effect below).
      if (diff > 1.5 && diff <= 2.5 && (current.count || 0) >= 2) {
        const prev = current.count || 0;
        setTimeout(() => setStreakRecoveryOffer({ prevCount: prev }), 0);
      }
      return { count: 1, lastOpened: today };
    });
  }

  // Offer to restore a just-reset streak with a freeze (if one's available).
  useEffect(() => {
    if (!streakRecoveryOffer) return;
    const { prevCount } = streakRecoveryOffer;
    if (!streakFreeze.available) { setStreakRecoveryOffer(null); return; }
    Alert.alert(
      "❄️ Save your streak?",
      `You missed a day, so your streak reset. Use your weekly Streak Freeze to restore your ${prevCount}-day streak?`,
      [
        { text: "No thanks", style: "cancel", onPress: () => setStreakRecoveryOffer(null) },
        {
          text: "Use freeze ❄️",
          onPress: () => {
            const today = getTodayKey();
            setStreakFreeze((f) => ({ ...f, available: false, lastUsed: today }));
            setStreakData({ count: prevCount, lastOpened: today });
            successHaptic();
            const popup = { id: Date.now().toString(), amount: `❄️ ${prevCount}-day streak restored!` };
            setXpPopups((popups) => [...popups, popup]);
            setTimeout(() => setXpPopups((popups) => popups.filter((p) => p.id !== popup.id)), 2500);
            setStreakRecoveryOffer(null);
          },
        },
      ]
    );
  }, [streakRecoveryOffer]); // eslint-disable-line react-hooks/exhaustive-deps

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

    // Compress + resize before upload to cut Supabase storage/bandwidth ~5-10x.
    // Falls back to the original if the native image module isn't in the build yet.
    let uploadUri = asset.uri;
    try {
      const manip = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      if (manip?.uri) uploadUri = manip.uri;
    } catch (e) {
      console.log("Image compression skipped:", e?.message);
    }
    const compressed = uploadUri !== asset.uri;

    const response = await fetch(uploadUri);
const arrayBuffer = await response.arrayBuffer();

const fileExt = compressed
  ? "jpg"
  : (asset.uri.split(".").pop()?.toLowerCase() || "jpg");

const contentType = compressed
  ? "image/jpeg"
  : (asset.mimeType || "image/jpeg");

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
async function exportFullBackup() {
  const backup = {
    _app: "PocketPlanter", _version: 1, _exportedAt: new Date().toISOString(),
    savedPlants, journalEntries, gardenAreas, gardenMap, wateredPlants, wateringHistory,
    harvestLog, careLog, plantNotes, harvestTrackers, fertilizerTrackers, sowLog,
    frostOverrides, streakData, followedPlants, plantFolders, suppliesSpent,
    bonusXP, questXP, completedQuestIds, wateringAmounts,
  };
  try {
    tapHaptic("light");
    await Share.share({ title: "Pocket Planter Backup", message: JSON.stringify(backup) });
  } catch (e) {
    console.log("Backup export skipped:", e?.message);
  }
}

function restoreFromBackup(text) {
  let data;
  try { data = JSON.parse(text); } catch (e) {
    Alert.alert("Invalid backup", "That doesn't look right. Paste the full text from a Pocket Planter backup.");
    return;
  }
  if (!data || data._app !== "PocketPlanter") {
    Alert.alert("Invalid backup", "This isn't a Pocket Planter backup. Paste the full exported text.");
    return;
  }
  Alert.alert(
    "Restore this backup?",
    "This replaces your current garden data with the backup. This can't be undone.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Restore",
        style: "destructive",
        onPress: () => {
          if (Array.isArray(data.savedPlants)) setSavedPlants(data.savedPlants);
          if (Array.isArray(data.journalEntries)) setJournalEntries(data.journalEntries);
          if (Array.isArray(data.gardenAreas)) setGardenAreas(data.gardenAreas);
          if (data.gardenMap && typeof data.gardenMap === "object") setGardenMap(data.gardenMap);
          if (data.wateredPlants && typeof data.wateredPlants === "object") setWateredPlants(data.wateredPlants);
          if (data.wateringHistory && typeof data.wateringHistory === "object") setWateringHistory(data.wateringHistory);
          if (Array.isArray(data.harvestLog)) setHarvestLog(data.harvestLog);
          if (Array.isArray(data.careLog)) setCareLog(data.careLog);
          if (data.plantNotes && typeof data.plantNotes === "object") setPlantNotes(data.plantNotes);
          if (data.harvestTrackers && typeof data.harvestTrackers === "object") setHarvestTrackers(data.harvestTrackers);
          if (data.fertilizerTrackers && typeof data.fertilizerTrackers === "object") setFertilizerTrackers(data.fertilizerTrackers);
          if (data.sowLog && typeof data.sowLog === "object") setSowLog(data.sowLog);
          if (data.frostOverrides && typeof data.frostOverrides === "object") setFrostOverrides(data.frostOverrides);
          if (data.streakData && typeof data.streakData === "object") setStreakData(data.streakData);
          if (Array.isArray(data.followedPlants)) setFollowedPlants(data.followedPlants);
          if (data.plantFolders && typeof data.plantFolders === "object") setPlantFolders(data.plantFolders);
          if (typeof data.suppliesSpent === "number") setSuppliesSpent(data.suppliesSpent);
          if (typeof data.bonusXP === "number") setBonusXP(data.bonusXP);
          if (typeof data.questXP === "number") setQuestXP(data.questXP);
          if (data.completedQuestIds && typeof data.completedQuestIds === "object") setCompletedQuestIds(data.completedQuestIds);
          if (Array.isArray(data.wateringAmounts)) setWateringAmounts(data.wateringAmounts);
          successHaptic();
          Alert.alert("Restored ✅", "Your garden data has been restored from the backup.");
        },
      },
    ]
  );
}

function deleteJournalEntriesOlderThan(days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const toRemove = journalEntries.filter((e) => new Date(e.createdAt).getTime() < cutoff);
  if (!toRemove.length) {
    Alert.alert("Nothing to clear", "You have no photos older than that.");
    return;
  }
  const label = days >= 365 ? "1 year" : "6 months";
  Alert.alert(
    "Delete old photos?",
    `This permanently removes ${toRemove.length} photo${toRemove.length === 1 ? "" : "s"} older than ${label}. This can't be undone. Export a backup first if you want to keep them.`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: `Delete ${toRemove.length}`,
        style: "destructive",
        onPress: () => {
          setJournalEntries((current) => current.filter((e) => new Date(e.createdAt).getTime() >= cutoff));
          successHaptic();
          Alert.alert("Photos cleared", `${toRemove.length} old photo${toRemove.length === 1 ? "" : "s"} removed.`);
        },
      },
    ]
  );
}

function deleteJournalEntry(entryId) {
  const removed = journalEntries.find((entry) => entry.id === entryId);
  if (!removed) return;
  tapHaptic("light");
  setJournalEntries((current) => current.filter((entry) => entry.id !== entryId));
  let undone = false;
  showUndoToast("Photo deleted", () => {
    undone = true;
    setJournalEntries((current) => [removed, ...current].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ));
    setUndoToast(null);
  });
  // Once the undo window passes (and it wasn't undone), remove the file from Supabase
  // Storage too — otherwise deleted photos orphan there forever and grow storage cost.
  if (removed.storagePath) {
    setTimeout(async () => {
      if (undone) return;
      try {
        await supabase.storage.from("journal-photos").remove([removed.storagePath]);
      } catch (e) {
        console.log("Storage cleanup skipped:", e?.message);
      }
    }, 5200);
  }
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
    const tomorrowKey = getDateKey(new Date(Date.now() + 86400000));
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
// Schedule a one-off notification for a plant's next watering, based on its
// learned rhythm (or typical needs), tightened in heat. Silent: only fires when
// reminders are on and permission is already granted — never prompts.
async function schedulePlantWaterReminder(plantName) {
  try {
    if (!remindersOn) return;
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return;
    const item = produceData.find((p) => p.name === plantName);
    if (!item) return;
    const rhythm = getWateringRhythm(plantName, item, wateringHistory);
    let interval = rhythm ? Math.max(1, Math.round(rhythm.avgGap)) : getBaseWaterInterval(item);
    if (weather?.maxTempF >= 95) interval = Math.max(1, interval - 1);
    const fireDate = new Date();
    fireDate.setDate(fireDate.getDate() + interval);
    fireDate.setHours(wateringReminderTime?.hour ?? 8, wateringReminderTime?.minute ?? 0, 0, 0);
    const id = `water-${plantName}`;
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: `💧 Time to water ${plantName}`,
        body: rhythm
          ? `Based on your rhythm, ${plantName} is about due for a drink.`
          : `${plantName} is likely ready for water — check if the top inch of soil feels dry.`,
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireDate },
    });
  } catch (e) {
    console.log("plant water reminder skipped:", e?.message);
  }
}

async function cancelPlantWaterReminder(plantName) {
  try { await Notifications.cancelScheduledNotificationAsync(`water-${plantName}`); } catch (e) { /* ignore */ }
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
      cancelPlantWaterReminder(plantName);
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
    schedulePlantWaterReminder(plantName);
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
    unwatered.forEach((name) => schedulePlantWaterReminder(name));
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
    schedulePlantWaterReminder(plantName);
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
  setHarvestLog((current) => {
    const next = [entry, ...current];
    // First-ever harvest is a great moment to ask for a review.
    if (current.length === 0) setTimeout(() => { maybeAskForReview(); }, 1200);
    return next;
  });
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
  const key = getDateKey(tomorrow);
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
      Vibration.vibrate([0, 60, 40, 60]);
      setTimeout(() => {
        Alert.alert(
          "⚠️ Companion conflict",
          `${plantName} doesn't pair well with ${conflictList} in the same bed — they can compete or attract the same pests. It's still planted; just something to keep in mind. Open Companion Check for a one-tap fix.`,
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

// One-tap "plant this in my garden" from a plant's detail screen. Drops the plant
// into the first bed with a free slot, or points the user to set one up.
function quickAddPlantToGarden(plantName) {
  const capacityOf = (area) => typeof area.size === "number" ? area.size : Object.values(area.plots || {}).filter(Boolean).length;
  const freeSlot = (area) => {
    const used = new Set(Object.entries(area.plots || {}).filter(([, n]) => n).map(([sid]) => sid));
    const cap = capacityOf(area);
    for (let i = 0; i < cap; i++) { if (!used.has(String(i))) return String(i); }
    return null;
  };
  // jumpToTab already closes the plant detail and scrolls the Garden tab to the
  // top (where the Garden Map card lives) — don't also call handleBackFromPlant,
  // which would fight it by restoring the Plants-tab scroll position.
  const openGarden = () => { jumpToTab("garden"); };

  const existing = (gardenAreas || []).find((a) => Object.values(a.plots || {}).includes(plantName));
  if (existing) {
    Alert.alert("Already planted", `${plantName} is already in ${existing.name}. Rearrange it anytime in the Garden tab.`, [{ text: "OK" }, { text: "Open Garden", onPress: openGarden }]);
    return;
  }
  const target = (gardenAreas || []).find((a) => freeSlot(a) !== null);
  if (!target) {
    Alert.alert("No open beds yet", "Add a garden bed first, then you can drop plants into it. Set one up in the Garden tab.", [{ text: "Not now", style: "cancel" }, { text: "Open Garden", onPress: openGarden }]);
    return;
  }
  const slot = freeSlot(target);
  const neighbors = Array.from(new Set(Object.values(target.plots || {}).filter(Boolean)));
  const willConflict = neighbors.some((n) => getCompatibilityScore(plantName, n)?.label === "Avoid");
  assignPlantToAreaSlot(target.id, slot, plantName); // fires its own companion-conflict alert if needed
  successHaptic();
  // Only show the success alert when there's no conflict — otherwise the assign's
  // conflict warning already covers it (and confirms it was placed).
  if (!willConflict) {
    setTimeout(() => {
      Alert.alert("Added to your garden 🌱", `${plantName} was placed in ${target.name}. Rearrange it anytime in the Garden tab.`, [{ text: "Done" }, { text: "Open Garden", onPress: openGarden }]);
    }, 350);
  }
}

// One-tap layout optimizer: greedily relocate conflicting plants into beds where
// they'll thrive, recomputing as it goes so the reported result is always accurate.
function autoOptimizeGarden() {
  const isAvoid = (a, b) => getCompatibilityScore(a, b)?.label === "Avoid";
  // Work on a deep copy so real state only changes if the user confirms.
  const areas = (gardenAreas || []).map((a) => ({ ...a, plots: { ...a.plots } }));

  const capacityOf = (area) =>
    typeof area.size === "number" ? area.size : Object.values(area.plots).filter(Boolean).length;
  const freeSlot = (area) => {
    const filled = Object.entries(area.plots).filter(([, n]) => n);
    const cap = capacityOf(area);
    if (filled.length >= cap) return null;
    const used = new Set(filled.map(([sid]) => sid));
    for (let i = 0; i < cap; i += 1) if (!used.has(String(i))) return String(i);
    return null;
  };
  const firstConflict = (area) => {
    const entries = Object.entries(area.plots).filter(([, n]) => n);
    for (let i = 0; i < entries.length; i += 1)
      for (let j = i + 1; j < entries.length; j += 1)
        if (isAvoid(entries[i][1], entries[j][1])) return [entries[i], entries[j]];
    return null;
  };
  const wouldConflict = (area, plant) =>
    Object.values(area.plots).some((n) => n && n !== plant && isAvoid(plant, n));
  const countConflicts = (list) =>
    list.reduce((sum, area) => {
      const entries = Object.entries(area.plots).filter(([, n]) => n);
      const seen = new Set();
      for (let i = 0; i < entries.length; i += 1)
        for (let j = i + 1; j < entries.length; j += 1)
          if (isAvoid(entries[i][1], entries[j][1])) seen.add([entries[i][1], entries[j][1]].sort().join("|"));
      return sum + seen.size;
    }, 0);

  const before = countConflicts(areas);
  if (before === 0) {
    Alert.alert("Garden looks great! 🌿", "No companion conflicts to fix — your layout is already harmonious.");
    return;
  }

  // Greedy relocation loop.
  let moved = 0, guard = 0, progress = true;
  while (progress && guard < 300) {
    guard += 1;
    progress = false;
    for (const area of areas) {
      const pair = firstConflict(area);
      if (!pair) continue;
      for (const [slot, plant] of [pair[0], pair[1]]) {
        const target = areas.find((d) => d !== area && freeSlot(d) !== null && !wouldConflict(d, plant));
        if (target) {
          delete area.plots[slot];
          target.plots[freeSlot(target)] = plant;
          moved += 1;
          progress = true;
          break;
        }
      }
      if (progress) break; // rescan from the top after any change
    }
  }

  const after = countConflicts(areas);
  const resolved = before - after;

  if (moved === 0) {
    Alert.alert(
      "No room to auto-fix 🌱",
      `Found ${before} companion conflict${before === 1 ? "" : "s"}, but there's no free spot in another bed to relocate a plant. Add a bed (or clear a slot) so there's somewhere to move one, then try again.`
    );
    return;
  }

  Alert.alert(
    "Auto-optimize layout?",
    `This will move ${moved} plant${moved === 1 ? "" : "s"} and resolve ${resolved} of ${before} conflict${before === 1 ? "" : "s"}${after > 0 ? ` (${after} would need more space)` : ""}. Apply it?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "✨ Optimize",
        onPress: () => {
          setGardenAreas(areas);
          successHaptic();
          Vibration.vibrate(60);
          Alert.alert(
            "Garden optimized! 🌿",
            after > 0
              ? `Moved ${moved} plant${moved === 1 ? "" : "s"} to better beds. ${after} conflict${after === 1 ? "" : "s"} remain — you'll need more bed space to fix ${after === 1 ? "it" : "them"}.`
              : `Moved ${moved} plant${moved === 1 ? "" : "s"} — every companion conflict is now resolved!`
          );
        },
      },
    ]
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
      const cacheKey = `pp_weatherCache_${zip}`;
      let coords = zipCoords;
      // Instant paint from the last cached forecast + reuse saved coords, so the
      // rate-limited geocoder is only ever called once per ZIP. A fresh forecast
      // is still fetched below and re-cached.
      try {
        const cachedRaw = await AsyncStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached?.weather) setWeather(cached.weather);
          if (!coords && cached?.coords) coords = cached.coords;
        }
      } catch (e) {}
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
const freshWeather = {
  maxTempF: forecast[0]?.maxTempF ?? null,
  minTempF: forecast[0]?.minTempF ?? null,
  precipChance: forecast[0]?.precipChance ?? 0,
  forecast,
};
setWeather(freshWeather);
AsyncStorage.setItem(cacheKey, JSON.stringify({ coords, weather: freshWeather, ts: Date.now() })).catch(() => {});
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
          body: `Low of ${formatTemp(frost.minTempF, unitSystem, true)} coming — cover tender plants and move containers to shelter before dark.`,
          sound: true,
        },
        trigger: null,
      });
    })();
  }, [weather, frostAlertsOn, unitSystem]);

  // Smart action: extreme-heat alert (uses the same weather-alert toggle as frost).
  useEffect(() => {
    if (!frostAlertsOn) return;
    const days = weather?.forecast || [];
    // First upcoming day (today or the next two) that hits extreme heat.
    const idx = days.findIndex((d, i) => i <= 2 && typeof d.maxTempF === "number" && d.maxTempF >= 95);
    if (idx === -1) return;
    const day = days[idx];
    if (lastHeatAlertDate.current === day.date) return;
    lastHeatAlertDate.current = day.date;
    const whenText = idx === 0 ? "today" : idx === 1 ? "tomorrow" : `in ${idx} days`;
    (async () => {
      const granted = await ensureNotificationPermission();
      if (!granted) return;
      await Notifications.scheduleNotificationAsync({
        identifier: "heat-detected",
        content: {
          title: `🔥 Extreme heat ${whenText} — ${formatTemp(day.maxTempF, unitSystem, true)}`,
          body: "Water deeply before 9 AM, shade young transplants, and hold off on planting until it cools.",
          sound: true,
        },
        trigger: null,
      });
    })();
  }, [weather, frostAlertsOn, unitSystem]);
  // ── RevenueCat (stubbed for Expo Go) ───────────────────────────────────────
  useEffect(() => {
    async function configureRevenueCat() {
      try {
        if (__DEV__) { console.log("RevenueCat skipped in Expo Go/dev mode."); return; }
        Purchases.configure({ apiKey: Platform.OS === "ios" ? "appl_VbBnWNAWlOPeunWblgSNQbUXFjR" : "YOUR_REAL_REVENUECAT_ANDROID_KEY" });
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          const hasPro = hasPremiumEntitlement(customerInfo);
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
    // The Premium tab is hidden for premium members, so move them to Settings
    // where they can now manage or cancel their plan.
    if (activeTab === "premium") setActiveTab("settings");
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
      if (current.includes(name)) { cancelPlantWaterReminder(name); return current.filter((item) => item !== name); }
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
  // Give loaded data a moment to settle before level-up can celebrate. During that
  // window we just sync previousLevel to the real level, so a reload (level 1 -> real
  // level) never triggers a false "Level Up". Only genuine level gains after settle pop.
  const levelUpReadyRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => { levelUpReadyRef.current = true; }, 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!levelUpReadyRef.current) {
      if (gardenXP.level !== previousLevel) setPreviousLevel(gardenXP.level);
      return;
    }
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

  // After load, give app state a few seconds to fully settle before any achievement
  // popups are allowed. During that window we silently mark everything already unlocked
  // as "seen" (no popup), so reloads never re-pop old achievements regardless of the
  // order data finishes loading. Only achievements earned AFTER the settle window are
  // genuinely new this session and get a one-time popup.
  const achievementsReadyRef = useRef(false);

  useEffect(() => {
    if (!cloudProfileLoaded) return;
    achievementsReadyRef.current = false;
    const timer = setTimeout(() => {
      achievementsReadyRef.current = true;
    }, 3000);
    return () => clearTimeout(timer);
  }, [cloudProfileLoaded]);

  useEffect(() => {
    if (!cloudProfileLoaded) return;

    // Still settling: absorb everything currently unlocked as already-seen, no popup.
    if (!achievementsReadyRef.current) {
      const unlockedIds = achievementBadges.filter((b) => b.unlocked).map((b) => b.id);
      setShownAchievements((current) => {
        const merged = Array.from(new Set([...current, ...unlockedIds]));
        // Return the same reference when nothing changed, to avoid a re-render loop.
        return merged.length === current.length ? current : merged;
      });
      return;
    }

    // Settled: pop once for the first genuinely-new achievement, then record it.
    const newlyUnlocked = achievementBadges.find(
      (badge) => badge.unlocked && !shownAchievements.includes(badge.id)
    );
    if (!newlyUnlocked) return;

    successHaptic();
    setCelebrationBadge(newlyUnlocked);
    setShownAchievements((current) => [...current, newlyUnlocked.id]);
  }, [
    achievementBadges,
    shownAchievements,
    cloudProfileLoaded,
  ]);

  // Same settle-then-pop pattern for collectible banners.
  useEffect(() => {
    if (!cloudProfileLoaded) return;

    // Still settling: absorb everything currently unlocked as already-seen, no popup.
    if (!achievementsReadyRef.current) {
      const unlockedIds = profileBanners.filter((b) => b.unlocked).map((b) => b.id);
      setShownBanners((current) => {
        const merged = Array.from(new Set([...current, ...unlockedIds]));
        return merged.length === current.length ? current : merged;
      });
      return;
    }

    // Settled: pop once for the first genuinely-new banner, then record it.
    const newlyUnlocked = profileBanners.find(
      (banner) => banner.unlocked && !shownBanners.includes(banner.id)
    );
    if (!newlyUnlocked) return;

    successHaptic();
    setCelebrationBanner(newlyUnlocked);
    setShownBanners((current) => [...current, newlyUnlocked.id]);
  }, [
    profileBanners,
    shownBanners,
    cloudProfileLoaded,
  ]);

  // Stamp the earned date the first time we observe a badge/banner unlocked.
  useEffect(() => {
    setBadgeEarnedDates((prev) => {
      const today = new Date().toISOString();
      let changed = false;
      const next = { ...prev };
      achievementBadges.forEach((b) => { if (b.unlocked && !next[b.id]) { next[b.id] = today; changed = true; } });
      return changed ? next : prev;
    });
  }, [achievementBadges]);

  useEffect(() => {
    setBannerEarnedDates((prev) => {
      const today = new Date().toISOString();
      let changed = false;
      const next = { ...prev };
      profileBanners.forEach((b) => { if (b.unlocked && !next[b.id]) { next[b.id] = today; changed = true; } });
      return changed ? next : prev;
    });
  }, [profileBanners]);

  useEffect(() => {
    if (!persistHydrated.current.badgeEarnedDates) { persistHydrated.current.badgeEarnedDates = true; return; }
    AsyncStorage.setItem("pp_badgeEarnedDates", JSON.stringify(badgeEarnedDates)).catch(() => {});
  }, [badgeEarnedDates]);

  useEffect(() => {
    if (!persistHydrated.current.bannerEarnedDates) { persistHydrated.current.bannerEarnedDates = true; return; }
    AsyncStorage.setItem("pp_bannerEarnedDates", JSON.stringify(bannerEarnedDates)).catch(() => {});
  }, [bannerEarnedDates]);

  useEffect(() => {
    AsyncStorage.getItem("pp_badgeEarnedDates").then((val) => {
      if (val) { try { setBadgeEarnedDates(JSON.parse(val) || {}); } catch (e) { /* ignore */ } }
    }).catch(() => {});
    AsyncStorage.getItem("pp_bannerEarnedDates").then((val) => {
      if (val) { try { setBannerEarnedDates(JSON.parse(val) || {}); } catch (e) { /* ignore */ } }
    }).catch(() => {});
  }, []);

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
  if (loading || !fontsReady) return <LoadingScreen />;

  if (showOnboarding) {
    return (
      <OnboardingCard onFinish={async () => { setShowOnboarding(false); await AsyncStorage.setItem(STORAGE_KEYS.seenOnboarding, "true"); }} />
    );
  }
  if (selectedPest) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" />
        <BackgroundDecoration isDark={isDark} />
        <PestDetailScreen
          theme={theme}
          pest={selectedPest}
          onBack={handleBackFromPest}
          onOpenPlant={(name) => { setSelectedPest(null); openPlantByName(name); }}
        />
      </SafeAreaView>
    );
  }
  if (selectedPlant) {
    const plantImage = resolvePlantImageSource(selectedPlant);
    const companionInfo = getCompanionInfo(selectedPlant.name) || {};
    const inCatalog = (item) => resolveCompanionPlant(item) !== null;
    const excellentCompanions = (Array.isArray(companionInfo.excellent) ? companionInfo.excellent : []).filter(inCatalog);
    const neutralCompanions = (Array.isArray(companionInfo.neutral) ? companionInfo.neutral : []).filter(inCatalog);
    const avoidCompanions = (Array.isArray(companionInfo.avoid) ? companionInfo.avoid : []).filter(inCatalog);
    const seasonLabel = getPlantSeasonLabel(selectedPlant, zone);
    const quickFacts = getPlantQuickFacts(selectedPlant);
    const plantingWindow = getPlantingWindowText(selectedPlant);
    const plantingSteps = getPlantingSteps(selectedPlant);
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
        style={{ marginTop: 10, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 11, alignItems: "center" }}
      >
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 13.5 }}>🎉 Log a Harvest</Text>
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
        <Pressable onPress={() => quickAddPlantToGarden(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>🗺️</Text>
          <Text style={styles.controlTileTitle}>Add to garden</Text>
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
      { icon: "🏆", label: "Difficulty", value: quickFacts.difficulty },
      { icon: "📅", label: "Planting window", value: plantingWindow },
      // Premium users already get a rich Watering Forecast in Daily controls above,
      // so only show the generic watering tip to free users (no duplicate).
      ...(!premiumUnlocked ? [{ icon: "💧", label: "Watering", value: getWateringTip(weather) }] : []),
      { icon: "📍", label: "Best spot", value: getWhereToPlantText(selectedPlant) },
      { icon: "🌤️", label: "Weather advice", value: getPlantSpecificTip(selectedPlant, zone, weather) },
    ].map((fact) => (
      <View key={fact.label} style={styles.detailMiniCard}>
        <Text style={styles.detailMiniIcon}>{fact.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.detailMiniLabel}>{fact.label}</Text>
          <Text style={styles.detailMiniValue}>{fact.value}</Text>
        </View>
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
    <>
      <Text style={[styles.cardText, { marginTop: 2 }]}>
        {plantingSteps.length} steps to get {selectedPlant.name} in the ground. Check your seed packet for variety-specific timing.
      </Text>
      <View style={{ marginTop: 12 }}>
        {plantingSteps.map((step, index) => (
          <View
            key={`${selectedPlant.name}-step-${index}`}
            style={styles.stepRow}
          >
            <View style={{ alignItems: "center" }}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              {index < plantingSteps.length - 1 ? (
                <View style={{ width: 2, flex: 1, backgroundColor: "rgba(92,255,137,0.25)", marginTop: 2, minHeight: 14 }} />
              ) : null}
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </>
  )}
</View>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>🌿 Companion Intelligence</Text>
  {!premiumUnlocked ? (
   <PremiumLockedCard
      theme={theme}
      title="Companion planting locked"
      body="Unlock premium to see excellent pairs, plants to avoid, pest prevention tips, and companion search."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={[styles.cardText, { marginTop: 2 }]}>
        Who to plant near {selectedPlant.name} — and who to keep apart. Tap any plant to open it.
      </Text>

      {/* EXCELLENT PAIRS */}
      {excellentCompanions.length > 0 ? (
        <>
          <View style={styles.companionSectionHeader}>
            <Text style={styles.companionSectionEmoji}>🟢</Text>
            <Text style={styles.companionSectionTitle}>Plant Together</Text>
            <View style={{ backgroundColor: "rgba(92,255,137,0.20)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: "#5cff89", fontSize: 11, fontWeight: "900" }}>{excellentCompanions.length}</Text>
            </View>
          </View>
          <View style={styles.companionExcellentGrid}>
            {excellentCompanions.map((item) => (
              <Pressable key={`excellent-${item}`} onPress={() => openPlantByName(item)} style={styles.companionChip}>
                <View style={styles.companionChipIconWrap}>
                  {getCompanionImage(item) ? (
                    <Image source={getCompanionImage(item)} style={{ width: 26, height: 26 }} resizeMode="contain" />
                  ) : (
                    <Text style={{ fontSize: 18 }}>🌱</Text>
                  )}
                </View>
                <Text style={styles.companionChipName} numberOfLines={1}>{getCompanionDisplayName(item)}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {/* NEUTRAL */}
      {neutralCompanions.length > 0 ? (
        <>
          <View style={styles.companionSectionHeader}>
            <Text style={styles.companionSectionEmoji}>🟡</Text>
            <Text style={styles.companionSectionTitle}>OK Nearby</Text>
            <View style={{ backgroundColor: "rgba(255,216,107,0.18)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: "#ffd86b", fontSize: 11, fontWeight: "900" }}>{neutralCompanions.length}</Text>
            </View>
          </View>
          <View style={styles.companionExcellentGrid}>
            {neutralCompanions.map((item) => (
              <Pressable key={`neutral-${item}`} onPress={() => openPlantByName(item)} style={[styles.companionChip, { backgroundColor: "rgba(255,216,107,0.08)", borderColor: "rgba(255,216,107,0.22)" }]}>
                <View style={[styles.companionChipIconWrap, { backgroundColor: "rgba(255,216,107,0.14)" }]}>
                  {getCompanionImage(item) ? (
                    <Image source={getCompanionImage(item)} style={{ width: 26, height: 26 }} resizeMode="contain" />
                  ) : (
                    <Text style={{ fontSize: 18 }}>🌱</Text>
                  )}
                </View>
                <Text style={styles.companionChipName} numberOfLines={1}>{getCompanionDisplayName(item)}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {/* AVOID */}
      {avoidCompanions.length > 0 ? (
        <>
          <View style={styles.companionSectionHeader}>
            <Text style={styles.companionSectionEmoji}>🔴</Text>
            <Text style={styles.companionSectionTitle}>Keep Apart</Text>
            <View style={{ backgroundColor: "rgba(255,123,123,0.18)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: "#ff7b7b", fontSize: 11, fontWeight: "900" }}>{avoidCompanions.length}</Text>
            </View>
          </View>
          <View style={styles.companionExcellentGrid}>
            {avoidCompanions.map((item) => (
              <Pressable key={`avoid-${item}`} onPress={() => openPlantByName(item)} style={[styles.companionChip, { backgroundColor: "rgba(255,123,123,0.08)", borderColor: "rgba(255,123,123,0.22)" }]}>
                <View style={[styles.companionChipIconWrap, { backgroundColor: "rgba(255,123,123,0.14)" }]}>
                  {getCompanionImage(item) ? (
                    <Image source={getCompanionImage(item)} style={{ width: 26, height: 26 }} resizeMode="contain" />
                  ) : (
                    <Text style={{ fontSize: 18 }}>⚠️</Text>
                  )}
                </View>
                <Text style={styles.companionChipName} numberOfLines={1}>{getCompanionDisplayName(item)}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {excellentCompanions.length === 0 && neutralCompanions.length === 0 && avoidCompanions.length === 0 ? (
        <Text style={[styles.cardText, { marginTop: 10, fontStyle: "italic" }]}>
          No companion data for {selectedPlant.name} yet — it's an easygoing neighbor for most plants.
        </Text>
      ) : null}
    </>
  )}
</View>

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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HERO — matches the app's hero style */}
          <View style={styles.premiumHeroSection}>
            <View style={styles.premiumHeroGlowOrbOne} />
            <View style={styles.premiumHeroGlowOrbTwo} />
            <View style={styles.premiumCrownWrap}>
              <Text style={styles.premiumCrownEmoji}>🌱</Text>
            </View>
            <Text style={styles.premiumHeroEyebrow}>POCKET PLANTER</Text>
            <Text style={styles.premiumHeroHeadline}>
              {authMode === "signup" ? "Create your\ngarden account" : "Welcome back,\ngardener"}
            </Text>
            <Text style={styles.premiumHeroSubtext}>
              {authMode === "signup" ? "Start growing smarter — free to begin." : "Log in to pick up where you left off."}
            </Text>
          </View>

          {/* FORM CARD */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor="#8fbf9d"
              style={[styles.input, { marginTop: 0, backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
            />

            <View style={{ position: "relative", justifyContent: "center", marginTop: 12 }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Password"
                placeholderTextColor="#8fbf9d"
                style={[styles.input, { marginTop: 0, backgroundColor: theme.input, color: theme.text, borderColor: theme.border, paddingRight: 50 }]}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                hitSlop={10}
                style={{ position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" }}
              >
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#8fbf9d" />
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [styles.authButton, pressed && { opacity: 0.8 }]}
              onPress={handleAuth}
            >
              <Text style={styles.authButtonText}>
                {authMode === "signup" ? "Sign Up" : "Log In"}
              </Text>
            </Pressable>

            {authMode === "login" && biometricAvailable && biometricEnabled ? (
              <Pressable
                onPress={handleBiometricLogin}
                accessibilityRole="button"
                accessibilityLabel={`Sign in with ${biometricLabel}`}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12, borderRadius: 18, paddingVertical: 15, backgroundColor: "rgba(92,255,137,0.10)", borderWidth: 1, borderColor: "rgba(92,255,137,0.4)" }}
              >
                <Ionicons name={biometricLabel === "Touch ID" ? "finger-print" : "scan-outline"} size={20} color="#8effab" />
                <Text style={{ color: "#8effab", fontSize: 15, fontWeight: "900" }}>Sign in with {biometricLabel}</Text>
              </Pressable>
            ) : null}

            <Pressable
              style={styles.authSwitchButton}
              onPress={() => setAuthMode(authMode === "signup" ? "login" : "signup")}
            >
              <Text style={styles.authSwitchText}>
                {authMode === "signup" ? "Already have an account? Log in" : "Need an account? Sign up"}
              </Text>
            </Pressable>

            {authMode === "login" ? (
              <Pressable style={styles.authSwitchButton} onPress={handleForgotPassword}>
                <Text style={styles.authSwitchText}>Forgot password?</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
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

    {syncFailed ? (
      <View style={{ position: "absolute", top: 8, left: 16, right: 16, zIndex: 950, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,159,67,0.96)", borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 18 }}>
        <Text style={{ fontSize: 14 }}>☁️</Text>
        <Text style={{ color: "#3d2600", fontSize: 12, fontWeight: "900", flex: 1 }}>Changes aren't syncing to the cloud right now — they'll retry automatically.</Text>
      </View>
    ) : null}

    <GlobalSearchModal
      visible={showSearch}
      onClose={() => setShowSearch(false)}
      theme={theme}
      savedPlants={savedPlants}
      journalEntries={journalEntries}
      onOpenPlant={(item) => openPlantFromList(item)}
      onOpenPest={(pest) => openPest(pest)}
      onGoToJournal={() => jumpToTab("journal")}
    />

    {showResetPassword ? (
      <Modal visible transparent animationType="fade" onRequestClose={() => setShowResetPassword(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <View style={{ width: "100%", maxWidth: 420, backgroundColor: "#0d1f14", borderRadius: 26, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)", padding: 22 }}>
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>🔒 RESET PASSWORD</Text>
            <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "900", marginTop: 6 }}>Set a new password</Text>
            <Text style={{ color: "#a9c7b3", fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>Enter a new password for your account.</Text>
            <TextInput
              value={resetPasswordValue}
              onChangeText={setResetPasswordValue}
              secureTextEntry
              placeholder="New password"
              placeholderTextColor="#8fbf9d"
              style={{ marginTop: 16, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)", color: "#ffffff", fontSize: 15, fontWeight: "700", paddingHorizontal: 16, paddingVertical: 14 }}
            />
            <Pressable
              onPress={async () => {
                if ((resetPasswordValue || "").length < 6) { Alert.alert("Too short", "Password must be at least 6 characters."); return; }
                try {
                  const { error } = await supabase.auth.updateUser({ password: resetPasswordValue });
                  if (error) { Alert.alert("Couldn't update password", error.message); return; }
                  Alert.alert("Password updated ✅", "Your password has been changed. You're all set.");
                  setShowResetPassword(false);
                  setResetPasswordValue("");
                } catch (e) {
                  Alert.alert("Something went wrong", "Please try again.");
                }
              }}
              style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 15, alignItems: "center" }}
            >
              <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 15 }}>Update password</Text>
            </Pressable>
            <Pressable onPress={() => { setShowResetPassword(false); setResetPasswordValue(""); }} style={{ marginTop: 10, paddingVertical: 12, alignItems: "center" }}>
              <Text style={{ color: "#8fbf9d", fontWeight: "800", fontSize: 14 }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    ) : null}

    {undoToast ? (
      <View style={{ position: "absolute", bottom: 96, left: 16, right: 16, zIndex: 900, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(16,41,23,0.98)", borderRadius: 18, paddingVertical: 14, paddingHorizontal: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.30)", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 20 }}>
        <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800", flex: 1 }}>{undoToast.message}</Text>
        <Pressable onPress={undoToast.onUndo} hitSlop={10} style={{ marginLeft: 12, backgroundColor: "#5cff89", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 9 }}>
          <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>Undo</Text>
        </Pressable>
      </View>
    ) : null}

  {celebrationBadge ? (
      <Pressable onPress={() => setCelebrationBadge(null)} style={styles.levelUpOverlay}>
        <ConfettiBurst />
        <View style={styles.levelUpCard}>
          {getBadgeImage(celebrationBadge.id) ? (
            <Image source={getBadgeImage(celebrationBadge.id)} style={{ width: 128, height: 128, marginBottom: 6 }} resizeMode="contain" />
          ) : (
            <Text style={styles.levelUpEmoji}>{celebrationBadge.icon || "🏆"}</Text>
          )}
          <Text style={[styles.levelUpText, { fontSize: 12, fontWeight: "900", letterSpacing: 1, color: "#5cff89", marginBottom: 6 }]}>ACHIEVEMENT UNLOCKED</Text>
          <Text style={styles.levelUpTitle}>{celebrationBadge.title}</Text>
          <Text style={styles.levelUpText}>{celebrationBadge.text}</Text>
          <Text style={[styles.levelUpText, { fontSize: 13, marginTop: 8, opacity: 0.7 }]}>Tap anywhere to close</Text>
        </View>
      </Pressable>
    ) : null}

  {celebrationBanner ? (
      <Pressable onPress={() => setCelebrationBanner(null)} style={styles.levelUpOverlay}>
        <ConfettiBurst />
        <View style={[styles.levelUpCard, celebrationBanner.gradient ? { borderColor: celebrationBanner.gradient[0] } : null]}>
          {getBannerImage(celebrationBanner.id) ? (
            <Image source={getBannerImage(celebrationBanner.id)} style={{ width: "100%", height: 96, marginBottom: 8, borderRadius: 12 }} resizeMode="cover" />
          ) : (
            <Text style={styles.levelUpEmoji}>{celebrationBanner.emoji || "🎏"}</Text>
          )}
          <Text style={[styles.levelUpText, { fontSize: 12, fontWeight: "900", letterSpacing: 1, color: celebrationBanner.gradient ? celebrationBanner.gradient[0] : "#5cff89", marginBottom: 6 }]}>NEW BANNER UNLOCKED</Text>
          <Text style={styles.levelUpTitle}>{celebrationBanner.title}</Text>
          <Text style={styles.levelUpText}>{celebrationBanner.subtitle}</Text>
          <Text style={[styles.levelUpText, { fontSize: 13, marginTop: 8, opacity: 0.7 }]}>Tap to close · equip it in your profile</Text>
        </View>
      </Pressable>
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
  plantPickDismissedDate={plantPickDismissedDate}
  setPlantPickDismissedDate={setPlantPickDismissedDate}
  journalEntries={journalEntries}
  jumpToTab={jumpToTab}
  markPlantWatered={markPlantWatered}
  monthlyChecklist={monthlyChecklist}
  monthlySuggestions={monthlySuggestions}
  onOpenSearch={() => setShowSearch(true)}
  openPlantFromList={openPlantFromList}
  openPest={openPest}
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
  unitSystem={unitSystem}
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
  onAutoOptimize={autoOptimizeGarden}
  onSavePlant={toggleSavedPlant}
  addGardenArea={addGardenArea}
  assignPlantToAreaSlot={assignPlantToAreaSlot}
  careLog={careLog}
  clearAreaSlot={clearAreaSlot}
  deleteGardenArea={deleteGardenArea}
  fertilizerTrackers={fertilizerTrackers}
  gardenAreas={gardenAreas}
  gardenY={gardenY}
  harvestTrackers={harvestTrackers}
  openPlantFromList={openPlantFromList}
  scheduleFertilizerReminder={scheduleFertilizerReminder}
  setCareLog={setCareLog}
  showUndoToast={showUndoToast}
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
  plantDifficultyFilter={plantDifficultyFilter}
  setPlantDifficultyFilter={setPlantDifficultyFilter}
  plantNowOnly={plantNowOnly}
  setPlantNowOnly={setPlantNowOnly}
  plantSortMode={plantSortMode}
  setPlantSortMode={setPlantSortMode}
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
  setWateringAmounts={setWateringAmounts}
  showUndoToast={showUndoToast}
  smartRecommendation={smartRecommendation}
  theme={theme}
  unitSystem={unitSystem}
  wateredPlants={wateredPlants}
  wateringAmounts={wateringAmounts}
  wateringHistory={wateringHistory}
  weather={weather}
  zone={zone}
/>
) : null}

{activeTab === "journal" ? (
  <JournalTab
  careLog={careLog}
  deleteJournalEntry={deleteJournalEntry}
  harvestGoal={harvestGoal}
  harvestLog={harvestLog}
  journalEntries={journalEntries}
  journalY={journalY}
  openPlantFromList={openPlantFromList}
  pickJournalPhoto={pickJournalPhoto}
  plantNotes={plantNotes}
  savedPlants={savedPlants}
  scheduleFertilizerReminder={scheduleFertilizerReminder}
  setCareLog={setCareLog}
  setHarvestGoal={setHarvestGoal}
  setHarvestLog={setHarvestLog}
  setWateringAmounts={setWateringAmounts}
  showUndoToast={showUndoToast}
  theme={theme}
  uploadingPhoto={uploadingPhoto}
  wateringAmounts={wateringAmounts}
  zone={zone}
/>
) : null}
{record && activeTab === "profile" ? (
  <ProfileTab
  achievementBadges={achievementBadges}
  badgeEarnedDates={badgeEarnedDates}
  bannerEarnedDates={bannerEarnedDates}
  activeBannerId={activeBannerId}
  avatarGlow={avatarGlow}
  cancelReminder={cancelReminder}
  careLog={careLog}
  completedQuestIds={completedQuestIds}
  dailyQuests={dailyQuests}
  setCompletedQuestIds={setCompletedQuestIds}
  setQuestXP={setQuestXP}
  setXpPopups={setXpPopups}
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
{record && activeTab === "settings" ? (
  <SettingsTab
  appearanceMode={appearanceMode}
  setAppearanceMode={setAppearanceMode}
  hapticsOn={hapticsOn}
  setHapticsOn={setHapticsOn}
  exportFullBackup={exportFullBackup}
  restoreFromBackup={restoreFromBackup}
  cancelReminder={cancelReminder}
  careLog={careLog}
  dailyWateringOn={dailyWateringOn}
  deleteJournalEntriesOlderThan={deleteJournalEntriesOlderThan}
  ensureNotificationPermission={ensureNotificationPermission}
  frostAlertsOn={frostAlertsOn}
  gardenAreas={gardenAreas}
  gardenMap={gardenMap}
  gardenXP={gardenXP}
  harvestLog={harvestLog}
  journalEntries={journalEntries}
  monthlyPlantingOn={monthlyPlantingOn}
  newEmail={newEmail}
  plantOfDayOn={plantOfDayOn}
  premiumUnlocked={premiumUnlocked}
  reminderY={reminderY}
  remindersOn={remindersOn}
  savedPlants={savedPlants}
  scheduleDailyReminder={scheduleDailyReminder}
  setDailyWateringOn={setDailyWateringOn}
  setFrostAlertsOn={setFrostAlertsOn}
  setMonthlyPlantingOn={setMonthlyPlantingOn}
  setNewEmail={setNewEmail}
  setPremiumUnlocked={setPremiumUnlocked}
  setRemindersOn={setRemindersOn}
  setSubscriptionPlan={setSubscriptionPlan}
  setUnitSystem={setUnitSystem}
  setWateringReminderTime={setWateringReminderTime}
  streakData={streakData}
  subscriptionPlan={subscriptionPlan}
  theme={theme}
  togglePlantOfDay={togglePlantOfDay}
  unitSystem={unitSystem}
  unlockPremium={unlockPremium}
  user={user}
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
{record && (activeTab === "home" || activeTab === "plants") && savedPlants.some((p) => wateredPlants[p] !== getTodayKey()) ? (
  <Pressable
    onPress={() => Alert.alert("Quick Log 🌱", "Log a garden action without leaving this screen.", [
      { text: "💧 Water all due plants", onPress: () => waterAllPlants() },
      { text: "📸 Add garden photo", onPress: () => pickJournalPhoto("Garden") },
      { text: "Cancel", style: "cancel" },
    ])}
    accessibilityRole="button"
    accessibilityLabel="Quick log a garden action"
    style={{ position: "absolute", right: 18, bottom: 156, width: 52, height: 52, borderRadius: 26, backgroundColor: "#6bc7ff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 16, zIndex: 51 }}
  >
    <Text style={{ fontSize: 24 }}>⚡</Text>
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
    { id: "profile", label: "Quests", icon: "flash", premium: false },
    { id: "settings", label: "Settings", icon: "settings", premium: false },
    { id: "premium", label: "Premium", icon: "star", premium: false },
  ].filter((tab) => !(tab.id === "premium" && premiumUnlocked)).map((tab) => {
      const active = activeTab === tab.id;
      const locked = tab.premium && !premiumUnlocked;
      return (
        <Pressable key={tab.id} onPress={() => { if (locked) { jumpToTab("premium"); return; } jumpToTab(tab.id); }} style={({ pressed }) => [styles.bottomTabButton, active && styles.bottomTabButtonActive, active && styles.bottomTabGlow, pressed && styles.bottomTabPressed]}>
          <View style={[styles.bottomTabInner, active && styles.bottomTabInnerActive]}>
            <Ionicons name={tab.icon} size={18} color={active ? "#07120b" : "#d7ebdc"} />
            <Text numberOfLines={1} style={[styles.bottomTabText, active && styles.bottomTabTextActive]}>{tab.label}</Text>
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

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
