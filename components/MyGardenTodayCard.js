import { memo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { EXTREME_HEAT_THRESHOLD_F, FROST_THRESHOLD_F, WARM_DAY_THRESHOLD_F, formatTemp, getClimateBucket, getDateKey, getSeasonForDate, getSeedStartInfo, getTodayKey, getTomorrowKey, isFertilizerDue, isHarvestReady, isWaterDue, resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const MyGardenTodayCard = memo(function MyGardenTodayCard({ theme, weather, monthlySuggestions, savedPlants, wateredPlants, onOpenPlant, onAddPhoto, uploadingPhoto, harvestTrackers, fertilizerTrackers, journalEntries, zone, gardenMap, onNavigate, unitSystem, snoozedPlants, compatiblePlants, wateringHistory }) {
  const { t, tn } = useTranslation();
  const today = getTodayKey();
  const currentHour = new Date().getHours();

  // Snoozing a plant should quiet it here too. This card used to ignore snoozes
  // entirely, so a plant you'd deliberately put off kept showing up as "needs water".
  const tomorrowKey = getTomorrowKey();
  const wateredToday = savedPlants.filter(p => wateredPlants?.[p] === today);
  // Due by each plant's own schedule, the rule the health badge uses. This was
  // every plant not watered since midnight, so rosemary on a ten-day rhythm, the
  // succulents and the fruit trees all "needed water" every single day, and the
  // daily plan could not be finished without watering things that did not need it.
  const unwateredPlants = savedPlants.filter((p) =>
    snoozedPlants?.[p] !== tomorrowKey &&
    isWaterDue(p, produceData.find((item) => item.name === p), wateredPlants, wateringHistory, weather)
  );
  const needsWaterCount = unwateredPlants.length;
  const allWatered = needsWaterCount === 0 && savedPlants.length > 0;
  // "All plants watered!" only when that is literally so; otherwise nothing is due.
  const everyPlantWatered = wateredToday.length === savedPlants.length;

  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, tracker]) => isHarvestReady(tracker)).map(([name]) => name);

  const fertDuePlants = savedPlants.filter(p => {
    const tracker = fertilizerTrackers?.[p];
    if (!tracker) return false;
    return isFertilizerDue(p, tracker);
  });

  // Seeds it's time to start indoors for this zone (from the old game-plan card).
  const seedsToStart = (compatiblePlants || [])
    .filter((item) => getSeedStartInfo(item, zone)?.status === "start-now");

  // Local day, not the UTC prefix: an evening photo used to leave the daily plan
  // stuck one task short.
  const todayPhotos = journalEntries.filter((e) => e.createdAt && getDateKey(new Date(e.createdAt)) === today).length;

  const getTimeOfDayGreeting = () => {
    if (currentHour < 12) return { greeting: t("myGardenToday.greetMorning"), tip: t("myGardenToday.tipMorning") };
    if (currentHour < 17) return { greeting: t("myGardenToday.greetAfternoon"), tip: t("myGardenToday.tipAfternoon") };
    return { greeting: t("myGardenToday.greetEvening"), tip: t("myGardenToday.tipEvening") };
  };

  const getWeatherSummary = () => {
    if (!weather) return { icon: "🌤️", title: t("myGardenToday.wxLoadingTitle"), text: t("myGardenToday.wxLoadingText"), color: "#d7ebdc", urgent: false };
    const low = formatTemp(weather.minTempF, unitSystem, true);
    const high = formatTemp(weather.maxTempF, unitSystem, true);
    const pct = Math.round(weather.precipChance);
    if (weather.minTempF <= FROST_THRESHOLD_F) return { icon: "❄️", title: t("myGardenToday.wxFrostTitle"), text: t("myGardenToday.wxFrostText", { temp: low }), color: "#6bc7ff", urgent: true };
    if (weather.maxTempF >= EXTREME_HEAT_THRESHOLD_F) return { icon: "🔥", title: t("myGardenToday.wxExtremeTitle"), text: t("myGardenToday.wxExtremeText", { temp: high }), color: "#ff7b7b", urgent: true };
    if (weather.maxTempF >= WARM_DAY_THRESHOLD_F) return { icon: "☀️", title: t("myGardenToday.wxHotTitle"), text: t("myGardenToday.wxHotText", { temp: high }), color: "#ffd86b", urgent: false };
    if (weather.precipChance >= 70) return { icon: "🌧️", title: t("myGardenToday.wxRainTitle"), text: t("myGardenToday.wxRainText", { pct }), color: "#6bc7ff", urgent: false };
    if (weather.precipChance >= 40) return { icon: "🌦️", title: t("myGardenToday.wxShowersTitle"), text: t("myGardenToday.wxShowersText", { pct }), color: "#8effab", urgent: false };
    return { icon: "✅", title: t("myGardenToday.wxGreatTitle"), text: t("myGardenToday.wxGreatText", { temp: formatTemp(weather.maxTempF, unitSystem), pct }), color: "#5cff89", urgent: false };
  };

  const getSeasonalTip = () => {
    const climate = getClimateBucket(zone);
    // Keyed off the real season span so the advice turns over on the equinox,
    // and reads correctly below the equator.
    const seasonKey = getSeasonForDate().key;
    if (seasonKey === "spring") return t(climate === "hot" ? "myGardenToday.tipSpringHot" : "myGardenToday.tipSpring");
    if (seasonKey === "summer") return t(climate === "hot" ? "myGardenToday.tipSummerHot" : "myGardenToday.tipSummer");
    if (seasonKey === "fall") return t(climate === "cold" ? "myGardenToday.tipFallCold" : "myGardenToday.tipFall");
    return t("myGardenToday.tipWinter");
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
          <Pressable accessibilityRole="button"
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
                {allWatered ? (everyPlantWatered ? t("myGardenToday.allPlantsWatered") : t("myGardenToday.nothingNeedsWaterToday")) : tn("myGardenToday.plantsNeedWater", needsWaterCount)}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {allWatered
                  ? t("myGardenToday.wateredOfToday", { watered: wateredToday.length, total: savedPlants.length })
                  : weather?.precipChance >= 65
                  ? t("myGardenToday.rainMayHelpCheckSoil")
                  : t("myGardenToday.wateredDoneTap", { watered: wateredToday.length, total: savedPlants.length })}
              </Text>
              {!allWatered && unwateredPlants.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myGardenPlantPillRow}>
                  {unwateredPlants.slice(0, 4).map(p => {
                    const plant = produceData.find(item => item.name === p);
                    return (
                      <Pressable accessibilityRole="button" key={p} onPress={() => plant && onOpenPlant(plant)} style={styles.myGardenPlantPill}>
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
          <Pressable accessibilityRole="button"
            onPress={() => onNavigate("garden")}
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(255, 216, 107, 0.1)", borderColor: "rgba(255, 216, 107, 0.3)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(255, 216, 107, 0.2)" }]}>
              <Text style={styles.myGardenTaskIcon}>🎉</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#ffd86b" }]}>
                {tn("counts.readyToHarvest", harvestsReady.length)}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {t("myGardenToday.harvestNowForPeakFlavor")}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myGardenPlantPillRow}>
                {harvestsReady.map(p => {
                  const plant = produceData.find(item => item.name === p);
                  return (
                    <Pressable accessibilityRole="button" key={p} onPress={() => plant && onOpenPlant(plant)} style={[styles.myGardenPlantPill, { backgroundColor: "rgba(255, 216, 107, 0.16)", borderColor: "rgba(255, 216, 107, 0.3)" }]}>
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
          <Pressable accessibilityRole="button"
            onPress={() => onNavigate("garden")}
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(142, 255, 171, 0.08)", borderColor: "rgba(142, 255, 171, 0.2)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(142, 255, 171, 0.16)" }]}>
              <Text style={styles.myGardenTaskIcon}>🌿</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#8effab" }]}>
                {tn("counts.dueFertilizer", fertDuePlants.length)}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {t("myGardenToday.itsBeen14DaysSince")}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.myGardenPlantPillRow}>
                {fertDuePlants.slice(0, 3).map(p => {
                  const plant = produceData.find(item => item.name === p);
                  return (
                    <Pressable accessibilityRole="button" key={p} onPress={() => plant && onOpenPlant(plant)} style={[styles.myGardenPlantPill, { backgroundColor: "rgba(142, 255, 171, 0.16)", borderColor: "rgba(142, 255, 171, 0.3)" }]}>
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
          <Pressable accessibilityRole="button"
            onPress={() => onOpenPlant && onOpenPlant(seedsToStart[0])}
            style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(142, 255, 171, 0.08)", borderColor: "rgba(142, 255, 171, 0.2)" }]}
          >
            <View style={[styles.myGardenTaskIconWrap, { backgroundColor: "rgba(142, 255, 171, 0.16)" }]}>
              <Text style={styles.myGardenTaskIcon}>🌱</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.myGardenTaskTitle, { color: "#8effab" }]}>
                {tn("myGardenToday.startSeedsIndoors", seedsToStart.length)}
              </Text>
              <Text style={[styles.myGardenTaskText, { color: theme.secondaryText }]}>
                {t("myGardenToday.seedsRightWindow", { plants: seedsToStart.slice(0, 3).map((e) => e.name).join(", ") })}
              </Text>
            </View>
            <Text style={styles.myGardenTaskArrow}>›</Text>
          </Pressable>
        ) : null}

        {/* JOURNAL PHOTO TASK */}
        <Pressable accessibilityRole="button" disabled={uploadingPhoto} onPress={onAddPhoto} style={[styles.myGardenTaskRowV2, {
          backgroundColor: todayPhotos > 0 ? "rgba(92, 255, 137, 0.08)" : "rgba(255, 255, 255, 0.06)",
          borderColor: todayPhotos > 0 ? "rgba(92, 255, 137, 0.2)" : "rgba(255, 255, 255, 0.1)",
        }]}>
          <View style={[styles.myGardenTaskIconWrap, { backgroundColor: todayPhotos > 0 ? "rgba(92, 255, 137, 0.16)" : "rgba(255, 255, 255, 0.08)" }]}>
            <Text style={styles.myGardenTaskIcon}>{todayPhotos > 0 ? "✅" : "📸"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.myGardenTaskTitle, { color: todayPhotos > 0 ? "#5cff89" : theme.text }]}>
              {uploadingPhoto ? t("myGardenToday.uploadingPhoto") : todayPhotos > 0 ? tn("myGardenToday.photosLoggedToday", todayPhotos) : t("myGardenToday.addAGardenPhoto")}
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
          <Pressable accessibilityRole="button"
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
          <Pressable accessibilityRole="button" onPress={() => onOpenPlant(monthlySuggestions[0])} style={[styles.myGardenTaskRowV2, { backgroundColor: "rgba(92, 255, 137, 0.08)", borderColor: "rgba(92, 255, 137, 0.2)" }]}>
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
