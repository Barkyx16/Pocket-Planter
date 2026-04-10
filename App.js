import React, { useEffect, useMemo, useState } from "react";
import prismLogo from "./assets/prism-logo.png";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
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

import zipZoneData from "./data/zipZoneData";
import produceData from "./data/produceData";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const STORAGE_KEYS = {
  savedPlants: "pocket-planter-saved-plants",
  followedPlants: "pocket-planter-followed-plants",
  zip: "pocket-planter-last-zip",
  selectedMonth: "pocket-planter-selected-month",
  remindersOn: "pocket-planter-reminders-on",
  selectedType: "pocket-planter-selected-type",
};

const PLANT_TYPES = [
  "All",
  "Vegetables",
  "Tree Fruits",
  "Tropical Fruits",
  "Berries",
  "Herbs",
];

function normalizeZip(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 5);
}

function zoneNumber(zone) {
  if (!zone) return null;
  const match = String(zone).trim().toLowerCase().match(/^(\d+)([ab])?$/);
  if (!match) return null;
  return Number(match[1]) + (match[2] === "b" ? 0.5 : 0);
}

function zoneMatch(user, min, max) {
  const u = zoneNumber(user);
  const a = zoneNumber(min);
  const b = zoneNumber(max);
  if (u === null || a === null || b === null) return false;
  return u >= a && u <= b;
}

function getClimateBucket(zone) {
  const value = zoneNumber(zone);
  if (value === null) return "warm";
  if (value <= 6.5) return "cool";
  if (value >= 9) return "hot";
  return "warm";
}

function getZipRecord(zip) {
  return zipZoneData.find((item) => item.zipcode === normalizeZip(zip)) || null;
}

function getCompatiblePlants(zone) {
  return produceData
    .filter((item) => zoneMatch(zone, item.minZone, item.maxZone))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function isBerry(type, name = "") {
  const value = String(type || "").toLowerCase().trim();
  const plantName = String(name || "").toLowerCase().trim();

  return (
    value.includes("berr") ||
    plantName.includes("strawberry") ||
    plantName.includes("blueberry") ||
    plantName.includes("blackberry") ||
    plantName.includes("raspberry") ||
    plantName.includes("gooseberry") ||
    plantName.includes("currant") ||
    plantName.includes("cranberry") ||
    plantName.includes("boysenberry") ||
    plantName.includes("marionberry") ||
    plantName.includes("mulberry") ||
    plantName.includes("elderberry") ||
    plantName.includes("serviceberry") ||
    plantName.includes("lingonberry") ||
    plantName.includes("huckleberry")
  );
}

function isHerb(type) {
  return String(type || "").toLowerCase().includes("herb");
}

function isTropicalFruit(type, name = "") {
  const value = String(type || "").toLowerCase().trim();
  const plantName = String(name || "").toLowerCase().trim();

  return (
    value.includes("tropical") ||
    plantName.includes("banana") ||
    plantName.includes("pineapple") ||
    plantName.includes("kiwi") ||
    plantName.includes("passionfruit") ||
    plantName.includes("avocado") ||
    plantName.includes("mango") ||
    plantName.includes("papaya") ||
    plantName.includes("guava") ||
    plantName.includes("loquat") ||
    plantName.includes("fig") ||
    plantName.includes("coconut")
  );
}

function isTreeFruit(type, name = "") {
  const value = String(type || "").toLowerCase().trim();
  const plantName = String(name || "").toLowerCase().trim();

  return (
    value.includes("fruit tree") ||
    value.includes("citrus") ||
    plantName.includes("apple") ||
    plantName.includes("pear") ||
    plantName.includes("peach") ||
    plantName.includes("plum") ||
    plantName.includes("cherry") ||
    plantName.includes("apricot") ||
    plantName.includes("pomegranate") ||
    plantName.includes("lemon") ||
    plantName.includes("orange") ||
    plantName.includes("lime") ||
    plantName.includes("grapefruit") ||
    plantName.includes("mandarin") ||
    plantName.includes("tangerine") ||
    plantName.includes("meyer lemon") ||
    plantName.includes("persimmon") ||
    plantName.includes("nectarine") ||
    plantName.includes("quince") ||
    plantName.includes("olive")
  );
}

function isNonTreeFruit(type, name = "") {
  const value = String(type || "").toLowerCase().trim();
  const plantName = String(name || "").toLowerCase().trim();

  return (
    value === "fruit" ||
    plantName.includes("grape") ||
    plantName.includes("watermelon") ||
    plantName.includes("cantaloupe") ||
    plantName.includes("honeydew")
  );
}

function normalizeType(type, name = "") {
  if (isHerb(type)) return "Herbs";
  if (isBerry(type, name)) return "Berries";
  if (isTropicalFruit(type, name)) return "Tropical Fruits";
  if (isTreeFruit(type, name) || isNonTreeFruit(type, name)) return "Tree Fruits";
  return "Vegetables";
}

function matchesType(item, selectedType) {
  if (selectedType === "All") return true;
  return normalizeType(item.type, item.name) === selectedType;
}

function getPlantMonthsForZone(item, zone) {
  const bucket = getClimateBucket(zone);

  if (item.planting && Array.isArray(item.planting[bucket])) {
    return item.planting[bucket];
  }

  if (Array.isArray(item.months)) {
    return item.months;
  }

  return [];
}

function getSuggestionsForMonth(zone, monthNumber) {
  return getCompatiblePlants(zone)
    .filter((item) => getPlantMonthsForZone(item, zone).includes(monthNumber))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getMonthlySuggestions(zone) {
  const month = new Date().getMonth() + 1;
  return getSuggestionsForMonth(zone, month);
}

function getPlantSeasonLabel(item, zone, monthOverride = null) {
  const month = monthOverride || new Date().getMonth() + 1;
  const months = getPlantMonthsForZone(item, zone);

  if (!months.length) return "Season varies";

  if (months.includes(month)) return "Plant now";

  const futureMonth = months.find((value) => value > month);
  if (futureMonth) return `Coming in ${MONTH_NAMES[futureMonth - 1]}`;

  return `Back in ${MONTH_NAMES[months[0] - 1]}`;
}

function getFirstPlantingMonth(item, zone) {
  const months = getPlantMonthsForZone(item, zone);
  if (!months.length) return null;
  return [...months].sort((a, b) => a - b)[0];
}

function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

function getPlantsStartingThisMonth(items, zone) {
  const currentMonth = getCurrentMonth();
  return items.filter((item) => getFirstPlantingMonth(item, zone) === currentMonth);
}

function getWeatherTip({ zone, weather }) {
  if (!weather) {
    return "Use your location to unlock live weather-aware planting tips.";
  }

  const { minTempF, maxTempF, precipChance } = weather;
  const hotZone = getClimateBucket(zone) === "hot";

  if (minTempF <= 36) {
    return "Frost risk is close. Hold off on tender crops like tomatoes, basil, and peppers.";
  }

  if (maxTempF >= 95 && hotZone) {
    return "Very hot weather ahead. Water early, mulch well, and delay delicate transplants if possible.";
  }

  if (precipChance >= 70) {
    return "Rain chances are high soon. Good time for direct sowing, but avoid overwatering.";
  }

  if (maxTempF >= 85) {
    return "Warm stretch ahead. Heat-loving crops should do well if soil moisture stays steady.";
  }

  return "Conditions look fairly friendly for planting. Keep an eye on soil moisture and temperature swings.";
}

function getWateringTip(weather) {
  if (!weather) {
    return "Turn on location for watering suggestions based on current conditions.";
  }

  const { maxTempF, minTempF, precipChance } = weather;

  if (precipChance >= 70) {
    return "Rain is likely soon, so go lighter on watering and avoid soggy soil.";
  }

  if (maxTempF >= 95) {
    return "Very hot weather: water early in the morning, mulch well, and watch containers closely.";
  }

  if (maxTempF >= 85) {
    return "Warm stretch ahead: check soil daily and give thirsty plants a deeper soak.";
  }

  if (minTempF <= 38) {
    return "Cool nights are hanging around, so avoid keeping soil overly wet.";
  }

  return "Conditions look balanced. Water when the top inch of soil starts to dry out.";
}

function getEstimatedLastFrost(zone) {
  const value = zoneNumber(zone);
  if (value === null) return "Estimate unavailable";

  if (value <= 3.5) return "late May to early June";
  if (value <= 5.5) return "early to mid May";
  if (value <= 6.5) return "late April to early May";
  if (value <= 7.5) return "mid to late April";
  if (value <= 8.5) return "late March to mid April";
  if (value <= 9.5) return "late February to late March";
  if (value <= 10.5) return "late January to late February";
  return "very light or rare in many years";
}

function getPlantingWindowText(item, zone) {
  const months = getPlantMonthsForZone(item, zone);
  if (!months.length) return "Planting window varies by climate.";

  if (months.length === 1) {
    return MONTH_NAMES[months[0] - 1];
  }

  return months.map((month) => MONTH_NAMES[month - 1]).join(", ");
}

function getPlantSpecificTip(item, zone, weather) {
  const label = getPlantSeasonLabel(item, zone);
  const minTemp = weather?.minTempF ?? null;
  const maxTemp = weather?.maxTempF ?? null;
  const isTender =
    /tomato|pepper|basil|cucumber|eggplant|melon/i.test(item.name);

  if (label === "Plant now" && isTender && minTemp !== null && minTemp <= 40) {
    return "This plant is in season, but cool nights are still a risk. Consider waiting a bit or protecting young starts.";
  }

  if (label === "Plant now" && maxTemp !== null && maxTemp >= 92) {
    return "It is in season, but hot weather can stress new transplants. Plant early in the day and water well.";
  }

  if (label === "Plant now") {
    return "This is a good time to plant in your area.";
  }

  return `${label}. Save or follow it so you are reminded when its planting window opens.`;
}

function resolvePlantImageSource(item) {
  if (typeof item.image === "string" && item.image.trim().length > 0) {
    return { uri: item.image };
  }
  return null;
}

function getDefaultPlantingSteps(item) {
  const type = normalizeType(item.type, item.name);

  if (type === "Herbs") {
    return [
      "Pick a sunny spot or container with drainage.",
      "Use loose potting soil or well-drained garden soil.",
      "Plant seeds shallow and keep the soil lightly moist.",
      "Thin seedlings as they grow so plants have room.",
      "Harvest often to keep the plant producing.",
    ];
  }

  if (type === "Berries") {
    return [
      "Choose a sunny location with good airflow.",
      "Work compost into the soil before planting.",
      "Plant at the recommended spacing for the variety.",
      "Water deeply after planting and mulch around the base.",
      "Prune and support plants as needed through the season.",
    ];
  }

  if (type === "Tree Fruits" || item.type === "Fruit Tree") {
    return [
      "Choose a sunny location with plenty of space and drainage.",
      "Dig a hole wider than the root ball, but not too deep.",
      "Set the tree at soil level and backfill gently.",
      "Water deeply after planting and add mulch around the base.",
      "Prune lightly if needed and protect young trees from stress.",
    ];
  }

  return [
    "Wait until the planting window in your zone is open.",
    "Choose a sunny spot with loose, healthy soil.",
    "Plant seeds or starts at the proper depth and spacing.",
    "Water gently after planting and keep the soil evenly moist.",
    "Thin, support, or mulch as the plant grows.",
  ];
}

function getPlantingSteps(item) {
  if (Array.isArray(item.plantingSteps) && item.plantingSteps.length) {
    return item.plantingSteps;
  }
  return getDefaultPlantingSteps(item);
}

async function openExternalLink(url) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("Link unavailable", "This link could not be opened.");
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert("Link error", "Something went wrong while opening this link.");
  }
}

async function askNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const updated = await Notifications.requestPermissionsAsync();
  return updated.granted;
}

async function setSmarterPlantReminders(zip, zone, items) {
  const allowed = await askNotificationPermission();

  if (!allowed) {
    Alert.alert("Notifications are off", "Please allow notifications first.");
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!items.length || !zone) return;

  for (const item of items) {
    const startMonth = getFirstPlantingMonth(item, zone);

    if (!startMonth) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Pocket Planter: ${item.name}`,
        body: `Time to start ${item.name} in ZIP ${zip} (zone ${zone}).`,
        data: { plantName: item.name, zip, zone, type: "season-start" },
      },
      trigger:
        Platform.OS === "ios" || Platform.OS === "android"
          ? {
              type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
              month: startMonth,
              day: 1,
              hour: 9,
              minute: 0,
              repeats: true,
            }
          : null,
    });
  }
}

function IconPill({ icon, text }) {
  return (
    <View style={styles.sectionPill}>
      <Text style={styles.sectionPillIcon}>{icon}</Text>
      <Text style={styles.sectionPillText}>{text}</Text>
    </View>
  );
}

function MonthChip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.monthChip, active && styles.monthChipActive]}>
      <Text style={[styles.monthChipText, active && styles.monthChipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function FilterChip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function OnboardingStep({ icon, title, text }) {
  return (
    <View style={styles.onboardingStep}>
      <View style={styles.onboardingIconBubble}>
        <Text style={styles.onboardingIcon}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.onboardingTitle}>{title}</Text>
        <Text style={styles.onboardingText}>{text}</Text>
      </View>
    </View>
  );
}

function SeedLinkButton({ label, url }) {
  return (
    <Pressable onPress={() => openExternalLink(url)} style={styles.seedLinkButton}>
      <Text style={styles.seedLinkButtonText}>{label}</Text>
    </Pressable>
  );
}

function FollowedPlantRow({ item, zone, onOpen }) {
  return (
    <Pressable onPress={() => onOpen(item)} style={styles.followedRow}>
      <View style={styles.followedLeft}>
        <View style={styles.followedIconBubble}>
          <Text style={styles.followedIcon}>{item.icon || "🌱"}</Text>
        </View>
        <View>
          <Text style={styles.followedName}>{item.name}</Text>
          <Text style={styles.followedMeta}>
            {normalizeType(item.type, item.name)} • {getPlantSeasonLabel(item, zone)}
          </Text>
        </View>
      </View>
      <Text style={styles.followedTapText}>Open</Text>
    </Pressable>
  );
}

function DataAttributionFooter() {
  return (
    <View style={styles.attributionContainer}>
      <Image
        source={prismLogo}
        style={styles.attributionLogo}
        resizeMode="contain"
      />
      <Text style={styles.attributionText}>
        Plant hardiness zone data courtesy of PRISM Climate Group (Oregon State University) and USDA.
      </Text>
    </View>
  );
}

function PlantDetailModal({
  visible,
  item,
  zone,
  weather,
  isSaved,
  isFollowed,
  onToggleSave,
  onToggleFollow,
  onClose,
}) {
  if (!item) return null;

  const imageSource = resolvePlantImageSource(item);
  const plantingSteps = getPlantingSteps(item);
  const seedLinks = Array.isArray(item.seedLinks) ? item.seedLinks : [];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>Plant details</Text>
            <Pressable onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.detailHero}>
              {imageSource ? (
                <Image source={imageSource} style={styles.detailImage} />
              ) : (
                <View style={styles.detailIconBubble}>
                  <Text style={styles.detailIcon}>{item.icon || "🌱"}</Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.detailPlantName}>{item.name}</Text>
                <Text style={styles.detailPlantMeta}>
                  {normalizeType(item.type, item.name)} • Zones {item.minZone}–{item.maxZone}
                </Text>
                <View style={styles.detailStatusPill}>
                  <Text style={styles.detailStatusText}>
                    {getPlantSeasonLabel(item, zone)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailButtonRow}>
              <Pressable
                onPress={() => onToggleSave(item.name)}
                style={[styles.saveBadge, isSaved && styles.saveBadgeActive]}
              >
                <Text style={[styles.saveBadgeText, isSaved && styles.saveBadgeTextActive]}>
                  {isSaved ? "Saved" : "Save"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onToggleFollow(item.name)}
                style={[styles.followBadge, isFollowed && styles.followBadgeActive]}
              >
                <Text style={[styles.followBadgeText, isFollowed && styles.followBadgeTextActive]}>
                  {isFollowed ? "Following" : "Follow"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Notes</Text>
              <Text style={styles.detailBody}>
                {item.notes || "A strong match for your growing zone and season."}
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>How to plant</Text>
              <View style={{ gap: 10 }}>
                {plantingSteps.map((step, index) => (
                  <View key={`${item.name}-step-${index}`} style={styles.stepRow}>
                    <View style={styles.stepNumberBubble}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Where to buy seeds</Text>

              {seedLinks.length ? (
                <View style={{ gap: 10 }}>
                  {seedLinks.map((link, index) => (
                    <SeedLinkButton
                      key={`${item.name}-seed-${index}`}
                      label={link.label}
                      url={link.url}
                    />
                  ))}
                </View>
              ) : (
                <Text style={styles.detailBody}>
                  Seed links have not been added for this plant yet.
                </Text>
              )}
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Planting window</Text>
              <Text style={styles.detailBody}>
                {getPlantingWindowText(item, zone)}
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Weather-aware advice</Text>
              <Text style={styles.detailBody}>
                {getPlantSpecificTip(item, zone, weather)}
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>Estimated last frost</Text>
              <Text style={styles.detailBody}>
                Around {getEstimatedLastFrost(zone)} for zone {zone}.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function PlantCard({
  item,
  zone,
  isSaved,
  isFollowed,
  onToggleSave,
  onToggleFollow,
  onOpen,
  monthOverride = null,
}) {
  const imageSource = resolvePlantImageSource(item);

  return (
    <Pressable onPress={() => onOpen(item)} style={styles.plantCard}>
      <View style={styles.plantHeaderRow}>
        <View style={styles.plantTitleRow}>
          {imageSource ? (
            <Image source={imageSource} style={styles.plantThumbnail} />
          ) : (
            <View style={styles.plantIconBubble}>
              <Text style={styles.plantIcon}>{item.icon || "🌱"}</Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={styles.plantName}>{item.name}</Text>
            <Text style={styles.plantZones}>
              {normalizeType(item.type, item.name)} • Zones {item.minZone}–{item.maxZone}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.plantBody}>
        {item.notes || "A strong match for your growing zone."}
      </Text>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={() => onToggleSave(item.name)}
          style={[styles.saveBadge, isSaved && styles.saveBadgeActive]}
        >
          <Text
            style={[styles.saveBadgeText, isSaved && styles.saveBadgeTextActive]}
          >
            {isSaved ? "Saved" : "Save"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onToggleFollow(item.name)}
          style={[styles.followBadge, isFollowed && styles.followBadgeActive]}
        >
          <Text
            style={[
              styles.followBadgeText,
              isFollowed && styles.followBadgeTextActive,
            ]}
          >
            {isFollowed ? "Following" : "Follow"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.cardFooterRow}>
        <View style={styles.seasonPill}>
          <Text style={styles.seasonPillText}>
            {getPlantSeasonLabel(item, zone, monthOverride)}
          </Text>
        </View>

        <Text style={styles.tapHint}>Tap for details</Text>
      </View>
    </Pressable>
  );
}

function TabButton({ icon, label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabButton, active && styles.tabButtonActive]}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function App() {
  const [zip, setZip] = useState("");
  const [search, setSearch] = useState("");
  const [remindersOn, setRemindersOn] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [locationLabel, setLocationLabel] = useState("");
  const [savedPlants, setSavedPlants] = useState([]);
  const [followedPlants, setFollowedPlants] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedType, setSelectedType] = useState("All");
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    async function loadSavedState() {
      try {
        const [
          savedNames,
          followedNames,
          lastZip,
          storedMonth,
          storedRemindersOn,
          storedType,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.savedPlants),
          AsyncStorage.getItem(STORAGE_KEYS.followedPlants),
          AsyncStorage.getItem(STORAGE_KEYS.zip),
          AsyncStorage.getItem(STORAGE_KEYS.selectedMonth),
          AsyncStorage.getItem(STORAGE_KEYS.remindersOn),
          AsyncStorage.getItem(STORAGE_KEYS.selectedType),
        ]);

        if (savedNames) setSavedPlants(JSON.parse(savedNames));
        if (followedNames) setFollowedPlants(JSON.parse(followedNames));
        if (lastZip) setZip(lastZip);
        if (storedMonth) setSelectedMonth(Number(storedMonth));
        if (storedRemindersOn) setRemindersOn(JSON.parse(storedRemindersOn));
        if (storedType) setSelectedType(storedType);
      } catch {}
    }

    loadSavedState();
  }, []);

  useEffect(() => {
    if (zip.length === 5) {
      AsyncStorage.setItem(STORAGE_KEYS.zip, zip).catch(() => {});
    }
  }, [zip]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.savedPlants,
      JSON.stringify(savedPlants)
    ).catch(() => {});
  }, [savedPlants]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.followedPlants,
      JSON.stringify(followedPlants)
    ).catch(() => {});
  }, [followedPlants]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.selectedMonth,
      String(selectedMonth)
    ).catch(() => {});
  }, [selectedMonth]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.remindersOn,
      JSON.stringify(remindersOn)
    ).catch(() => {});
  }, [remindersOn]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.selectedType,
      selectedType
    ).catch(() => {});
  }, [selectedType]);

  const record = useMemo(() => getZipRecord(zip), [zip]);
  const zone = record?.zone || null;

  const compatiblePlants = useMemo(() => {
    if (!zone) return [];
    return getCompatiblePlants(zone);
  }, [zone]);

  const monthlyPlants = useMemo(() => {
    if (!zone) return [];
    return getMonthlySuggestions(zone);
  }, [zone]);

  const calendarPlants = useMemo(() => {
    if (!zone) return [];
    return getSuggestionsForMonth(zone, selectedMonth);
  }, [zone, selectedMonth]);

  const filteredPlants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return compatiblePlants
      .filter((item) => matchesType(item, selectedType))
      .filter((item) => {
        if (!query) return true;
        return item.name.toLowerCase().includes(query);
      });
  }, [compatiblePlants, search, selectedType]);

  const savedPlantRecords = useMemo(() => {
    return produceData.filter((item) => savedPlants.includes(item.name));
  }, [savedPlants]);

  const followedPlantRecords = useMemo(() => {
    return produceData.filter((item) => followedPlants.includes(item.name));
  }, [followedPlants]);

  const followedThisMonth = useMemo(() => {
    return monthlyPlants.filter((item) => followedPlants.includes(item.name));
  }, [monthlyPlants, followedPlants]);

  const followedStartingNow = useMemo(() => {
    if (!zone) return [];
    return getPlantsStartingThisMonth(followedPlantRecords, zone);
  }, [followedPlantRecords, zone]);

  const typeCounts = useMemo(() => {
    return {
      vegetables: compatiblePlants.filter((item) => matchesType(item, "Vegetables")).length,
      treeFruits: compatiblePlants.filter((item) => matchesType(item, "Tree Fruits")).length,
      tropicalFruits: compatiblePlants.filter((item) => matchesType(item, "Tropical Fruits")).length,
      herbs: compatiblePlants.filter((item) => matchesType(item, "Herbs")).length,
      berries: compatiblePlants.filter((item) => matchesType(item, "Berries")).length,
    };
  }, [compatiblePlants]);

  useEffect(() => {
    if (!remindersOn || !record) return;

    setSmarterPlantReminders(
      record.zipcode,
      record.zone,
      followedPlantRecords
    ).catch(() => {
      Alert.alert("Error", "Could not schedule the plant reminders.");
    });
  }, [remindersOn, record, followedPlantRecords]);

  useEffect(() => {
    async function loadWeather() {
      if (!coords) return;

      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}` +
          `&longitude=${coords.longitude}` +
          `&daily=temperature_2m_min,temperature_2m_max,precipitation_probability_max` +
          `&forecast_days=3&temperature_unit=fahrenheit&timezone=auto`;

        const response = await fetch(url);
        const data = await response.json();

        const minTempF = data?.daily?.temperature_2m_min?.[0] ?? null;
        const maxTempF = data?.daily?.temperature_2m_max?.[0] ?? null;
        const precipChance = data?.daily?.precipitation_probability_max?.[0] ?? null;

        if (minTempF !== null && maxTempF !== null && precipChance !== null) {
          setWeather({ minTempF, maxTempF, precipChance });
        }
      } catch {
        setWeather(null);
      }
    }

    loadWeather();
  }, [coords]);

  async function useMyLocation() {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Location access denied",
          "Please allow location access to auto-fill your ZIP code."
        );
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });

      if (!geocode.length) {
        Alert.alert(
          "Location not found",
          "Could not read your ZIP code from your location."
        );
        return;
      }

      const place = geocode[0];

      if (place.postalCode) {
        setZip(normalizeZip(place.postalCode));
        setCoords({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });

        const city = [place.city, place.region].filter(Boolean).join(", ");
        setLocationLabel(city || "Current location");
      } else {
        Alert.alert(
          "ZIP not found",
          "Your location was found, but no ZIP code came back."
        );
      }
    } catch {
      Alert.alert(
        "Location error",
        "Something went wrong while getting your location."
      );
    }
  }

  function toggleSavePlant(name) {
    setSavedPlants((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name].sort()
    );
  }

  function toggleFollowPlant(name) {
    setFollowedPlants((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name].sort()
    );
  }

  const showingHome = activeTab === "Home";
  const showingPlants = activeTab === "Plants";
  const showingCalendar = activeTab === "Calendar";
  const showingSaved = activeTab === "Saved";
  const showOnboarding = !zip;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Nationwide gardening guide</Text>
            </View>
            <Text style={styles.heroTitle}>Pocket Planter</Text>
            <Text style={styles.heroSubtitle}>
              Know your zone, browse planting months, follow favorites, and get smarter seasonal tips.
            </Text>
          </View>

          {showOnboarding ? (
            <View style={styles.card}>
              <IconPill icon="👋" text="Welcome" />
              <Text style={styles.sectionTitle}>Let’s set up your garden plan</Text>
              <Text style={styles.sectionSubtitle}>
                Pocket Planter is ready to help you find what grows best in your area.
              </Text>

              <OnboardingStep
                icon="📍"
                title="Enter your ZIP code"
                text="We’ll match you to your USDA growing zone."
              />
              <OnboardingStep
                icon="🗓️"
                title="Browse your planting calendar"
                text="See what fits each month for your climate."
              />
              <OnboardingStep
                icon="🔔"
                title="Follow plants for reminders"
                text="Get notified when their planting window begins."
              />
            </View>
          ) : null}

          <View style={styles.card}>
            <IconPill icon="📍" text="ZIP code" />
            <TextInput
              placeholder="Enter your ZIP code"
              keyboardType="number-pad"
              maxLength={5}
              style={styles.input}
              placeholderTextColor="#98a397"
              value={zip}
              onChangeText={(value) => setZip(normalizeZip(value))}
            />

            <Pressable style={styles.locationButton} onPress={useMyLocation}>
              <Text style={styles.locationButtonText}>📍 Use my location</Text>
            </Pressable>

            {locationLabel ? (
              <Text style={styles.locationText}>Using location: {locationLabel}</Text>
            ) : null}

            {!record && zip.length === 5 ? (
              <Text style={styles.error}>We couldn’t find that ZIP code.</Text>
            ) : null}
          </View>

          {record ? (
            <View style={styles.zoneCard}>
              <View style={styles.zoneRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.zoneLabel}>🌎 Your growing zone</Text>
                  <Text style={styles.zoneTitle}>Zone {record.zone}</Text>
                  <Text style={styles.zoneText}>{record.zonetitle}</Text>
                </View>
                <View style={styles.zoneBadge}>
                  <Text style={styles.zoneBadgeText}>
                    {record.zone.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {showingHome && record ? (
            <>
              <View style={styles.statsRow}>
                <StatCard label="Plants matched" value={compatiblePlants.length} />
                <StatCard label="Saved" value={savedPlants.length} />
                <StatCard label="Following" value={followedPlants.length} />
              </View>

              <View style={styles.card}>
                <IconPill icon="🌦️" text="Weather-aware tip" />
                <Text style={styles.sectionTitle}>Live planting tip</Text>
                <Text style={styles.sectionSubtitle}>
                  {getWeatherTip({ zone, weather })}
                </Text>

                {weather ? (
                  <View style={styles.weatherRow}>
                    <View style={styles.weatherStat}>
                      <Text style={styles.weatherStatLabel}>Low</Text>
                      <Text style={styles.weatherStatValue}>{Math.round(weather.minTempF)}°</Text>
                    </View>
                    <View style={styles.weatherStat}>
                      <Text style={styles.weatherStatLabel}>High</Text>
                      <Text style={styles.weatherStatValue}>{Math.round(weather.maxTempF)}°</Text>
                    </View>
                    <View style={styles.weatherStat}>
                      <Text style={styles.weatherStatLabel}>Rain</Text>
                      <Text style={styles.weatherStatValue}>{Math.round(weather.precipChance)}%</Text>
                    </View>
                  </View>
                ) : null}
              </View>

              <View style={styles.card}>
                <IconPill icon="💧" text="Watering guide" />
                <Text style={styles.sectionTitle}>Watering advice</Text>
                <Text style={styles.sectionSubtitle}>
                  {getWateringTip(weather)}
                </Text>
              </View>

              <View style={styles.card}>
                <IconPill icon="❄️" text="Frost estimate" />
                <Text style={styles.sectionTitle}>Estimated last frost date</Text>
                <Text style={styles.sectionSubtitle}>
                  For zone {zone}, the last frost is usually around {getEstimatedLastFrost(zone)}.
                </Text>
              </View>

              <View style={styles.card}>
                <IconPill icon="🌱" text="Monthly picks" />
                <Text style={styles.sectionTitle}>
                  Plant this month ({MONTH_NAMES[new Date().getMonth()]})
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Your best built-in planting suggestions based on this ZIP code.
                </Text>

                {monthlyPlants.length ? (
                  <View style={styles.chipWrap}>
                    {monthlyPlants.map((item) => (
                      <View key={item.name} style={styles.chip}>
                        <Text style={styles.chipText}>
                          {item.icon || "🌱"} {item.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.muted}>
                    No built-in suggestions for this month yet.
                  </Text>
                )}
              </View>

              <View style={styles.card}>
                <IconPill icon="🔔" text="Favorite reminders" />
                <View style={styles.reminderRow}>
                  <View style={{ flex: 1, paddingRight: 14 }}>
                    <Text style={styles.sectionTitle}>Smart plant reminders</Text>
                    <Text style={styles.sectionSubtitle}>
                      Follow plants and get notified when their planting window starts.
                    </Text>
                    <Text style={styles.calendarSubtext}>
                      Followed plants in season now: {followedThisMonth.length}
                    </Text>
                    <Text style={styles.calendarSubtext}>
                      Starting this month: {followedStartingNow.length}
                    </Text>
                  </View>
                  <Switch
                    value={remindersOn}
                    onValueChange={setRemindersOn}
                    trackColor={{ false: "#d5d9d4", true: "#88c18a" }}
                    thumbColor="#ffffff"
                  />
                </View>
              </View>

              <View style={styles.card}>
                <IconPill icon="⭐" text="Following" />
                <Text style={styles.sectionTitle}>Your followed plants</Text>
                <Text style={styles.sectionSubtitle}>
                  Quick access to the plants you want to keep an eye on.
                </Text>

                {followedPlantRecords.length ? (
                  <View style={{ gap: 10 }}>
                    {followedPlantRecords.map((item) => (
                      <FollowedPlantRow
                        key={item.name}
                        item={item}
                        zone={zone}
                        onOpen={setSelectedPlant}
                      />
                    ))}
                  </View>
                ) : (
                  <Text style={styles.muted}>
                    You are not following any plants yet. Open the Plants tab and tap Follow to build your list.
                  </Text>
                )}
              </View>

              <DataAttributionFooter />
            </>
          ) : null}

          {showingPlants && record ? (
            <View style={styles.card}>
              <IconPill icon="🔍" text="Plant search" />
              <Text style={styles.sectionTitle}>Search plants for this zone</Text>
              <Text style={styles.sectionSubtitle}>
                Browse vegetables, tree fruits, tropical fruits, berries, and herbs that match your climate.
              </Text>

              <TextInput
                placeholder="Search a plant"
                style={styles.input}
                placeholderTextColor="#98a397"
                value={search}
                onChangeText={setSearch}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {PLANT_TYPES.map((type) => (
                  <FilterChip
                    key={type}
                    label={type}
                    active={selectedType === type}
                    onPress={() => setSelectedType(type)}
                  />
                ))}
              </ScrollView>

              <View style={styles.typeSummaryRow}>
                <Text style={styles.typeSummaryText}>Vegetables: {typeCounts.vegetables}</Text>
                <Text style={styles.typeSummaryDot}>•</Text>
                <Text style={styles.typeSummaryText}>Tree Fruits: {typeCounts.treeFruits}</Text>
                <Text style={styles.typeSummaryDot}>•</Text>
                <Text style={styles.typeSummaryText}>Tropical Fruits: {typeCounts.tropicalFruits}</Text>
                <Text style={styles.typeSummaryDot}>•</Text>
                <Text style={styles.typeSummaryText}>Berries: {typeCounts.berries}</Text>
                <Text style={styles.typeSummaryDot}>•</Text>
                <Text style={styles.typeSummaryText}>Herbs: {typeCounts.herbs}</Text>
              </View>

              <FlatList
                data={filteredPlants}
                keyExtractor={(item) => item.name}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <PlantCard
                    item={item}
                    zone={zone}
                    isSaved={savedPlants.includes(item.name)}
                    isFollowed={followedPlants.includes(item.name)}
                    onToggleSave={toggleSavePlant}
                    onToggleFollow={toggleFollowPlant}
                    onOpen={setSelectedPlant}
                  />
                )}
                ListEmptyComponent={
                  <Text style={styles.muted}>
                    No plants match this search and filter yet.
                  </Text>
                }
                ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
              />
            </View>
          ) : null}

          {showingCalendar && record ? (
            <View style={styles.card}>
              <IconPill icon="🗓️" text="Planting calendar" />
              <Text style={styles.sectionTitle}>Browse by month</Text>
              <Text style={styles.sectionSubtitle}>
                Scroll through the year to see what fits your zone month by month.
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthRow}
              >
                {MONTH_NAMES.map((month, index) => {
                  const monthNumber = index + 1;
                  return (
                    <MonthChip
                      key={month}
                      label={month.slice(0, 3)}
                      active={selectedMonth === monthNumber}
                      onPress={() => setSelectedMonth(monthNumber)}
                    />
                  );
                })}
              </ScrollView>

              <Text style={styles.calendarHeaderText}>
                {MONTH_NAMES[selectedMonth - 1]} plan for zone {zone}
              </Text>

              {calendarPlants.length ? (
                <FlatList
                  data={calendarPlants}
                  keyExtractor={(item) => `${selectedMonth}-${item.name}`}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <PlantCard
                      item={item}
                      zone={zone}
                      monthOverride={selectedMonth}
                      isSaved={savedPlants.includes(item.name)}
                      isFollowed={followedPlants.includes(item.name)}
                      onToggleSave={toggleSavePlant}
                      onToggleFollow={toggleFollowPlant}
                      onOpen={setSelectedPlant}
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                />
              ) : (
                <Text style={styles.muted}>
                  No built-in planting suggestions for this month in your zone yet.
                </Text>
              )}
            </View>
          ) : null}

          {showingSaved ? (
            <View style={styles.card}>
              <IconPill icon="❤️" text="Saved" />
              <Text style={styles.sectionTitle}>Saved plants</Text>
              <Text style={styles.sectionSubtitle}>
                Keep your favorite plants in one place.
              </Text>

              {savedPlantRecords.length ? (
                <FlatList
                  data={savedPlantRecords}
                  keyExtractor={(item) => item.name}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <PlantCard
                      item={item}
                      zone={zone}
                      isSaved={savedPlants.includes(item.name)}
                      isFollowed={followedPlants.includes(item.name)}
                      onToggleSave={toggleSavePlant}
                      onToggleFollow={toggleFollowPlant}
                      onOpen={setSelectedPlant}
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                />
              ) : (
                <Text style={styles.muted}>
                  Nothing saved yet. Open the Plants tab and tap Save on anything you want to keep.
                </Text>
              )}
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.tabBar}>
          <TabButton
            icon="🏠"
            label="Home"
            active={activeTab === "Home"}
            onPress={() => setActiveTab("Home")}
          />
          <TabButton
            icon="🗓️"
            label="Calendar"
            active={activeTab === "Calendar"}
            onPress={() => setActiveTab("Calendar")}
          />
          <TabButton
            icon="🌿"
            label="Plants"
            active={activeTab === "Plants"}
            onPress={() => setActiveTab("Plants")}
          />
          <TabButton
            icon="❤️"
            label="Saved"
            active={activeTab === "Saved"}
            onPress={() => setActiveTab("Saved")}
          />
        </View>

        <PlantDetailModal
          visible={!!selectedPlant}
          item={selectedPlant}
          zone={zone}
          weather={weather}
          isSaved={selectedPlant ? savedPlants.includes(selectedPlant.name) : false}
          isFollowed={selectedPlant ? followedPlants.includes(selectedPlant.name) : false}
          onToggleSave={toggleSavePlant}
          onToggleFollow={toggleFollowPlant}
          onClose={() => setSelectedPlant(null)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#edf2ec",
  },
  container: {
    padding: 18,
    paddingBottom: 120,
  },
  hero: {
    backgroundColor: "#2f5d39",
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: "#eaf5e7",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: "#e1ecdf",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  sectionPill: {
    alignSelf: "flex-start",
    backgroundColor: "#edf5ea",
    borderWidth: 1,
    borderColor: "#dbe8d6",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionPillIcon: {
    fontSize: 12,
  },
  sectionPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#50714f",
    letterSpacing: 0.35,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d7e2d4",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 17,
    backgroundColor: "#f9fbf8",
    color: "#182118",
  },
  locationButton: {
    marginTop: 12,
    backgroundColor: "#355e3b",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  locationButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  locationText: {
    marginTop: 10,
    fontSize: 14,
    color: "#5d6a5d",
  },
  error: {
    color: "#b3261e",
    fontSize: 15,
    marginTop: 10,
  },
  zoneCard: {
    backgroundColor: "#d7e5bf",
    borderRadius: 30,
    padding: 22,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  zoneRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  zoneLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#536b4e",
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  zoneTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#152015",
    marginBottom: 6,
  },
  zoneText: {
    fontSize: 17,
    color: "#314031",
  },
  zoneBadge: {
    backgroundColor: "#2f5d39",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 78,
    alignItems: "center",
  },
  zoneBadgeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#172017",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#697768",
    marginBottom: 14,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#edf6e8",
    borderWidth: 1,
    borderColor: "#d6e6cd",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  chipText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#315f38",
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  weatherStat: {
    flex: 1,
    backgroundColor: "#f6faf3",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  weatherStatLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6d786d",
    marginBottom: 4,
  },
  weatherStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#233023",
  },
  monthRow: {
    gap: 8,
    paddingBottom: 14,
  },
  monthChip: {
    backgroundColor: "#f3f7f1",
    borderWidth: 1,
    borderColor: "#dbe6d8",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
  },
  monthChipActive: {
    backgroundColor: "#355e3b",
    borderColor: "#355e3b",
  },
  monthChipText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4d6a4d",
  },
  monthChipTextActive: {
    color: "#ffffff",
  },
  filterRow: {
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    backgroundColor: "#f3f7f1",
    borderWidth: 1,
    borderColor: "#dbe6d8",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#355e3b",
    borderColor: "#355e3b",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4d6a4d",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  typeSummaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 14,
  },
  typeSummaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b776b",
  },
  typeSummaryDot: {
    marginHorizontal: 8,
    color: "#a0aba0",
  },
  calendarHeaderText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#243024",
    marginBottom: 14,
  },
  plantCard: {
    backgroundColor: "#f8faf7",
    borderWidth: 1,
    borderColor: "#e3ece0",
    borderRadius: 22,
    padding: 16,
  },
  plantHeaderRow: {
    marginBottom: 8,
  },
  plantTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  plantIconBubble: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#edf5ea",
    alignItems: "center",
    justifyContent: "center",
  },
  plantIcon: {
    fontSize: 30,
  },
  plantThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#edf5ea",
  },
  plantName: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#182118",
  },
  plantZones: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5b695b",
    marginTop: 4,
  },
  plantBody: {
    fontSize: 15,
    lineHeight: 21,
    color: "#6c786c",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tapHint: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7b867b",
  },
  saveBadge: {
    backgroundColor: "#edf4ea",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  saveBadgeActive: {
    backgroundColor: "#355e3b",
  },
  saveBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#3f6442",
  },
  saveBadgeTextActive: {
    color: "#ffffff",
  },
  followBadge: {
    backgroundColor: "#eef4fb",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  followBadgeActive: {
    backgroundColor: "#2f5d39",
  },
  followBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#40607a",
  },
  followBadgeTextActive: {
    color: "#ffffff",
  },
  seasonPill: {
    alignSelf: "flex-start",
    backgroundColor: "#eef5eb",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  seasonPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#567056",
  },
  calendarSubtext: {
    fontSize: 14,
    color: "#6d786d",
    marginTop: 2,
  },
  muted: {
    fontSize: 15,
    color: "#6c786c",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#213021",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6c786c",
    textAlign: "center",
  },
  onboardingStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 10,
  },
  onboardingIconBubble: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#edf5ea",
    alignItems: "center",
    justifyContent: "center",
  },
  onboardingIcon: {
    fontSize: 20,
  },
  onboardingTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1d261d",
    marginBottom: 2,
  },
  onboardingText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#697768",
  },
  followedRow: {
    backgroundColor: "#f8faf7",
    borderWidth: 1,
    borderColor: "#e3ece0",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  followedLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  followedIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#edf5ea",
    alignItems: "center",
    justifyContent: "center",
  },
  followedIcon: {
    fontSize: 24,
  },
  followedName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f291f",
  },
  followedMeta: {
    fontSize: 13,
    fontWeight: "700",
    color: "#697768",
    marginTop: 2,
  },
  followedTapText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#355e3b",
  },
  attributionContainer: {
    marginTop: 8,
    marginBottom: 26,
    alignItems: "center",
    paddingHorizontal: 24,
    opacity: 0.92,
  },
  attributionLogo: {
    width: 150,
    height: 48,
    marginBottom: 8,
  },
  attributionText: {
    fontSize: 12,
    textAlign: "center",
    color: "#6b7a6f",
    lineHeight: 18,
  },
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: "#edf6e8",
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#718071",
  },
  tabLabelActive: {
    color: "#315f38",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(8, 17, 8, 0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    maxHeight: "88%",
  },
  modalHandle: {
    width: 54,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#d6ddd2",
    alignSelf: "center",
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#172017",
  },
  modalCloseButton: {
    backgroundColor: "#edf5ea",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#355e3b",
  },
  detailHero: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
    alignItems: "center",
  },
  detailImage: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: "#edf5ea",
  },
  detailIconBubble: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: "#edf5ea",
    alignItems: "center",
    justifyContent: "center",
  },
  detailIcon: {
    fontSize: 40,
  },
  detailPlantName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#182118",
    marginBottom: 4,
  },
  detailPlantMeta: {
    fontSize: 14,
    fontWeight: "700",
    color: "#667466",
    marginBottom: 8,
  },
  detailStatusPill: {
    alignSelf: "flex-start",
    backgroundColor: "#eef5eb",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  detailStatusText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#567056",
  },
  detailButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: "#f8faf7",
    borderWidth: 1,
    borderColor: "#e3ece0",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1c251c",
    marginBottom: 6,
  },
  detailBody: {
    fontSize: 15,
    lineHeight: 22,
    color: "#697768",
  },
  seedLinkButton: {
    backgroundColor: "#edf5ea",
    borderWidth: 1,
    borderColor: "#d7e5d3",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  seedLinkButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2f5d39",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  stepNumberBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#e8f2e4",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#355e3b",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#697768",
  },
});