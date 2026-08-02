import { memo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { formatTemp, getClimateBucket, getDateKey, getFertilizerDays, getSeedStartInfo, getTodayKey, resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const MyGardenTodayCard = memo(function MyGardenTodayCard({ theme, weather, monthlySuggestions, savedPlants, wateredPlants, onOpenPlant, onAddPhoto, uploadingPhoto, harvestTrackers, fertilizerTrackers, journalEntries, zone, gardenMap, onNavigate, unitSystem, snoozedPlants, compatiblePlants }) {
  const { t } = useTranslation();
  const today = getTodayKey();
  const currentHour = new Date().getHours();
  const currentMonth = new Date().getMonth() + 1;

  // Snoozing a plant should quiet it here too. This card used to ignore snoozes
  // entirely, so a plant you'd deliberately put off kept showing up as "needs water".
  const tomorrowKey = getDateKey(new Date(Date.now() + 86400000));
  const wateredToday = savedPlants.filter(p => wateredPlants?.[p] === today);
  const unwateredPlants = savedPlants.filter(
    p => wateredPlants?.[p] !== today && snoozedPlants?.[p] !== tomorrowKey
  );
  const needsWaterCount = unwateredPlants.length;
  const allWatered = needsWaterCount === 0 && savedPlants.length > 0;

  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).map(([name]) => name);

  const fertDuePlants = savedPlants.filter(p => {
    const t = fertilizerTrackers?.[p];
    if (!t) return false;
    return Math.floor((new Date() - new Date(t.lastFertilized)) / (1000 * 60 * 60 * 24)) >= getFertilizerDays(p);
  });

  // Seeds it's time to start indoors for this zone (from the old game-plan card).
  const seedsToStart = (compatiblePlants || [])
    .filter((item) => getSeedStartInfo(item, zone)?.status === "start-now");

  const todayPhotos = journalEntries.filter(e => e.createdAt?.startsWith(today)).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;

  const getTimeOfDayGreeting = () => {
    if (currentHour < 12) return { greeting: "Hey There! 🌅", tip: "Morning is the best time to water — cooler temps reduce evaporation." };
    if (currentHour < 17) return { greeting: "Good afternoon! ☀️", tip: "Midday heat is high. Check on any plants in direct sun and make sure soil stays moist." };
    return { greeting: "Good evening! 🌙", tip: "Evening is a great time to check tonight's forecast and cover any frost-sensitive plants." };
  };

  const getWeatherSummary = () => {
    if (!weather) return { icon: "🌤️", title: "Weather loading", text: "Your forecast will appear shortly.", color: "#d7ebdc", urgent: false };
    if (weather.minTempF <= 35) return { icon: "❄️", title: "Frost risk tonight", text: `Low of ${formatTemp(weather.minTempF, unitSystem, true)} — cover tender plants and move containers to shelter before dark.`, color: "#6bc7ff", urgent: true };
    if (weather.maxTempF >= 98) return { icon: "🔥", title: "Extreme heat today", text: `High of ${formatTemp(weather.maxTempF, unitSystem, true)} — water before 9 AM, add shade cloth, and skip transplanting.`, color: "#ff7b7b", urgent: true };
    if (weather.maxTempF >= 90) return { icon: "☀️", title: "Hot day ahead", text: `High of ${formatTemp(weather.maxTempF, unitSystem, true)} — water deeply early and mulch around roots to hold moisture.`, color: "#ffd86b", urgent: false };
    if (weather.precipChance >= 70) return { icon: "🌧️", title: "Rain likely today", text: `${Math.round(weather.precipChance)}% chance of rain — skip watering and check drainage on containers.`, color: "#6bc7ff", urgent: false };
    if (weather.precipChance >= 40) return { icon: "🌦️", title: "Possible showers", text: `${Math.round(weather.precipChance)}% rain chance — check soil before watering, may not be needed.`, color: "#8effab", urgent: false };
    return { icon: "✅", title: "Great garden day", text: `${formatTemp(weather.maxTempF, unitSystem)} high, ${Math.round(weather.precipChance)}% rain — ideal conditions for planting, watering, and garden care.`, color: "#5cff89", urgent: false };
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

  // This card is the day's task list, so it should stay up until EVERY daily
  // task is done — not just the watering/harvest/fertilizer "issues". It used to
  // hide the moment those were cleared, which meant doing one thing (e.g.
  // watering) made the whole card vanish while the photo task was still open.
  // Now it only disappears once all counted tasks are complete.
  if (savedPlants.length === 0) return null;
  if (completedCount >= totalTasks) return null;

return (
    <View style={[styles.myGardenTodayCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <IconText label={t("myGardenToday.todaysGardenPlan")} style={styles.myGardenTodayEyebrow} />

      {/* HEADER */}
      <Text style={[styles.myGardenTodayTitle, { color: theme.text }]}>{greeting}</Text>
      <Text style={[styles.myGardenTodaySubtext, { color: theme.secondaryText }]}>
        {tip}
      </Text>

      {/* PROGRESS BAR */}
      {savedPlants.length > 0 ? (
        <View style={styles.myGardenProgressWrap}>
          <View style={styles.myGardenProgressHeader}>
            <Text style={styles.myGardenProgressLabel}>{t("myGardenToday.dailyGardenTasks")}</Text>
            <Text style={styles.myGardenProgressCount}>{completedCount}/{totalTasks} done</Text>
          </View>
          <View style={styles.myGardenProgressTrack}>
            <View style={[styles.myGardenProgressFill, {
              width: `${progressPercent}%`,
              backgroundColor: progressPercent === 100 ? "#5cff89" : progressPercent >= 50 ? "#ffd86b" : "#6bc7ff",
            }]} />
          </View>
          {progressPercent === 100 ? (
            <IconText label={t("myGardenToday.allTasksCompleteYourGarden")} style={styles.myGardenProgressComplete} />
          ) : null}
        </View>
      ) : null}

      {/* WEATHER CARD */}
      <View style={[styles.myGardenWeatherCard, {
        backgroundColor: weatherSummary.urgent ? `${weatherSummary.color}18` : "rgba(255, 255, 255, 0.06)",
        borderColor: weatherSummary.urgent ? `${weatherSummary.color}55` : "rgba(255, 255, 255, 0.1)",
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
            <Text style={styles.myGardenWeatherHigh}>{formatTemp(weather.maxTempF, unitSystem)}</Text>
            <Text style={styles.myGardenWeatherLow}>{formatTemp(weather.minTempF, unitSystem)}</Text>
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
              backgroundColor: allWatered ? "rgba(92, 255, 137, 0.1)" : "rgba(107, 199, 255, 0.08)",
              borderColor: allWatered ? "rgba(92, 255, 137, 0.3)" : "rgba(107, 199, 255, 0.3)",
            }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: allWatered ? "rgba(92, 255, 137, 0.2)" : "rgba(107, 199, 255, 0.16)" }]}>
              <Text style={styles.myGardenTaskIcon}>{allWatered ? "✅" : "💧"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: allWatered ? "#5cff89" : "#6bc7ff" }]}>
                {allWatered ? t("myGardenToday.allPlantsWatered") : `${needsWaterCount} plant${needsWaterCount === 1 ? "" : "s"} need water`}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {allWatered
                  ? `${wateredToday.length} of ${savedPlants.length} plants watered today`
                  : weather?.precipChance >= 65
                  ? t("myGardenToday.rainMayHelpCheckSoil")
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
                  {t("myGardenToday.tapToGoToPlants")}
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
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(255, 216, 107, 0.1)", borderColor: "rgba(255, 216, 107, 0.3)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(255, 216, 107, 0.2)" }]}>
              <Text style={styles.myGardenTaskIcon}>🎉</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#ffd86b" }]}>
                {harvestsReady.length} plant{harvestsReady.length === 1 ? "" : "s"} {t("myGardenToday.readyToHarvest")}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {t("myGardenToday.harvestNowForPeakFlavor")}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myGardenPlantPillRow}>
                {harvestsReady.map(p => {
                  const plant = produceData.find(item => item.name === p);
                  return (
                    <Pressable key={p} onPress={() => plant && onOpenPlant(plant)} style={[styles.myGardenPlantPill, { backgroundColor: "rgba(255, 216, 107, 0.16)", borderColor: "rgba(255, 216, 107, 0.3)" }]}>
                      <Text style={[styles.myGardenPlantPillText, { color: "#ffd86b" }]}>{p} →</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", marginTop: 8 }}>
                {t("myGardenToday.tapToGoToGarden")}
              </Text>
            </View>
          </Pressable>
        ) : null}

        {/* FERTILIZER TASK */}
        {fertDuePlants.length > 0 ? (
          <Pressable
            onPress={() => onNavigate("garden")}
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(142, 255, 171, 0.08)", borderColor: "rgba(142, 255, 171, 0.2)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(142, 255, 171, 0.16)" }]}>
              <Text style={styles.myGardenTaskIcon}>🌿</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#8effab" }]}>
                {fertDuePlants.length} plant{fertDuePlants.length === 1 ? "" : "s"} {t("myGardenToday.dueForFertilizer")}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {t("myGardenToday.itsBeen14DaysSince")}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myGardenPlantPillRow}>
                {fertDuePlants.slice(0, 3).map(p => {
                  const plant = produceData.find(item => item.name === p);
                  return (
                    <Pressable key={p} onPress={() => plant && onOpenPlant(plant)} style={[styles.myGardenPlantPill, { backgroundColor: "rgba(142, 255, 171, 0.16)", borderColor: "rgba(142, 255, 171, 0.3)" }]}>
                      <Text style={[styles.myGardenPlantPillText, { color: "#8effab" }]}>{p} →</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", marginTop: 8 }}>
                {t("myGardenToday.tapToGoToGarden")}
              </Text>
            </View>
          </Pressable>
        ) : null}

        {/* SEEDS TO START INDOORS — seasonal, not a counted daily task */}
        {seedsToStart.length > 0 ? (
          <Pressable
            onPress={() => onOpenPlant && onOpenPlant(seedsToStart[0])}
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(142, 255, 171, 0.08)", borderColor: "rgba(142, 255, 171, 0.2)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(142, 255, 171, 0.16)" }]}>
              <Text style={styles.myGardenTaskIcon}>🌱</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#8effab" }]}>
                Start {seedsToStart.length} seed{seedsToStart.length === 1 ? "" : "s"} indoors
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {seedsToStart.slice(0, 3).map((e) => e.name).join(", ")} — it's the right window for your zone.
              </Text>
            </View>
            <Text style={styles.myGardenTaskArrow}>›</Text>
          </Pressable>
        ) : null}

        {/* JOURNAL PHOTO TASK */}
        <Pressable disabled={uploadingPhoto} onPress={onAddPhoto} style={[styles.myGardenTaskRowV2, {
          backgroundColor: todayPhotos > 0 ? "rgba(92, 255, 137, 0.08)" : "rgba(255, 255, 255, 0.06)",
          borderColor: todayPhotos > 0 ? "rgba(92, 255, 137, 0.2)" : "rgba(255, 255, 255, 0.1)",
        }]}>
          <View style={[styles.myGardenTaskIconWrap, { backgroundColor: todayPhotos > 0 ? "rgba(92, 255, 137, 0.16)" : "rgba(255, 255, 255, 0.08)" }]}>
            <Text style={styles.myGardenTaskIcon}>{todayPhotos > 0 ? "✅" : "📸"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.myGardenTaskTitle, { color: todayPhotos > 0 ? "#5cff89" : theme.text }]}>
              {uploadingPhoto ? t("myGardenToday.uploadingPhoto") : todayPhotos > 0 ? `${todayPhotos} photo${todayPhotos === 1 ? "" : "s"} logged today!` : t("myGardenToday.addAGardenPhoto")}
            </Text>
            <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
              {todayPhotos > 0 ? t("myGardenToday.yourGardenStoryIsGrowing") : t("myGardenToday.documentYourGardensProgressWith")}
            </Text>
            {todayPhotos === 0 ? (
              <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900", marginTop: 8 }}>
                {t("myGardenToday.tapToAddAPhoto")}
              </Text>
            ) : null}
          </View>
          <Text style={styles.myGardenTaskArrow}>›</Text>
        </Pressable>

        {/* SEASONAL TIP */}
        <View style={[styles.myGardenSeasonalTip, { borderColor: "rgba(255, 216, 107, 0.2)" }]}>
          <IconText label={t("myGardenToday.seasonalTip")} style={styles.myGardenSeasonalTipTitle} />
          <Text style={[styles.myGardenSeasonalTipText, { color: theme.secondaryText }]}>{seasonalTip}</Text>
        </View>

        {/* EMPTY STATE */}
        {savedPlants.length === 0 ? (
          <Pressable
            onPress={() => onNavigate("plants")}
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(255, 255, 255, 0.04)", borderColor: "rgba(255, 255, 255, 0.08)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(92, 255, 137, 0.1)" }]}>
              <Text style={styles.myGardenTaskIcon}>🌱</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: theme.text }]}>{t("myGardenToday.noPlantsSavedYet")}</Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {t("myGardenToday.browseThePlantsTabAnd")}
              </Text>
              <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900", marginTop: 8 }}>
                {t("myGardenToday.tapToGoToPlants")}
              </Text>
            </View>
          </Pressable>
        ) : null}

        {/* MONTHLY SUGGESTION */}
        {monthlySuggestions.length > 0 && savedPlants.length > 0 ? (
          <Pressable onPress={() => onOpenPlant(monthlySuggestions[0])} style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(92, 255, 137, 0.08)", borderColor: "rgba(92, 255, 137, 0.2)" }]}>
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(92, 255, 137, 0.16)" }]}>
              {(() => {
                const img = resolvePlantImageSource(monthlySuggestions[0]);
                return img
                  ? <Image source={img} style={{ width: 28, height: 28 }} resizeMode="contain" />
                  : <Text style={styles.myGardenTaskIcon}>🌿</Text>;
              })()}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#5cff89" }]}>
                {t("myGardenToday.plantThisMonth")} {monthlySuggestions[0].name}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {t("myGardenToday.aStrongPickForYour")}
              </Text>
            </View>
            <Text style={styles.myGardenTaskArrow}>›</Text>
          </Pressable>
        ) : null}

      </View>
    </View>
  );
})
