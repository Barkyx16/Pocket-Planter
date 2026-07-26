import { memo } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { styles } from "../styles";
import { calculateGardenHealth, formatTemp, getConsistencyBonus, getFertilizerDays, getTodayKey, tapHaptic } from "../core";
import { AnimatedBar } from "./AnimatedBar";
import { IconText } from "./IconText";
import { formatDate, useTranslation } from "../lib/i18n";

export const GardenStatsDashboard = memo(function GardenStatsDashboard({
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
  unitSystem,
}) {
  const { t } = useTranslation();
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

  // Only count plants that are still saved — otherwise stale entries for unsaved
  // plants can push the count above the total (e.g. "16/11").
  const wateredTodayCount = (savedPlants || []).filter((name) => wateredPlants?.[name] === today).length;
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
    return daysSince >= getFertilizerDays(plantName);
  }).length;

  // Distinct specific plants photographed (the generic "Garden" bucket doesn't count as a plant).
  const plantsDocumented = new Set(journalEntries.map(e => e.plantName).filter((n) => n && n !== "Garden")).size;
  const totalPhotos = journalEntries.length;
  const thisMonthPhotos = journalEntries.filter(e => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const gardenHealth = calculateGardenHealth(gardenMap);
  const xpToNext = gardenXP.nextLevelXP - gardenXP.currentLevelXP;
  const levelProgress = gardenXP.progress || 0;

  // Only surface the To-Do list when something actually needs doing.
  const hasTodos = plantsNeedingWater > 0 || harvestsReady > 0 || fertDue > 0
    || (gardenHealth.score < 70 && gardenPlotCount > 1) || savedPlants.length === 0;

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
        Zone {zone || "—"} • {formatDate(new Date(), {
  month: "long",
  year: "numeric"
})}
      </Text>

      {/* XP PROGRESS BAR */}
      <View style={styles.dashXPRow}>
        <View style={styles.dashXPLeft}>
          <Text style={styles.dashXPLevel}>Lvl {gardenXP.level}</Text>
          <Text style={[styles.dashXPTitle, { color: theme.secondaryText }]}>{gardenXP.title}</Text>
        </View>
        <View style={styles.dashXPBarWrap}>
          <AnimatedBar progress={levelProgress} color="#5cff89" trackStyle={styles.dashXPTrack} fillStyle={styles.dashXPFill} />
          <Text style={styles.dashXPMeta}>{gardenXP.currentLevelXP} / {gardenXP.nextLevelXP} {t("gardenStatsDashboard.xp")} {xpToNext} {t("gardenStatsDashboard.toNextLevel")}</Text>
          {getConsistencyBonus(streakData?.count || 0) > 0 ? (
            <Text style={{ color: "#ff9f43", fontSize: 10, fontWeight: "900", marginTop: 2 }}>
              🔥 +{getConsistencyBonus(streakData?.count || 0)} {t("gardenStatsDashboard.consistencyBonus")}
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
              {weather?.maxTempF ? `${formatTemp(weather.maxTempF, unitSystem)} / ${formatTemp(weather.minTempF, unitSystem)}` : "—"}
            </Text>
          </View>
        ) : null}
        <View style={[styles.dashTopCard, { borderColor: streakData?.count >= 7 ? "#ff9f4355" : "rgba(255, 255, 255, 0.08)" }]}>
          <Text style={styles.dashTopCardIcon}>{getStreakEmoji(streakData?.count || 0)}</Text>
          <Text style={[styles.dashTopCardLabel, { color: streakData?.count >= 7 ? "#ff9f43" : theme.text }]}>{streakData?.count || 0} Days</Text>
          <Text style={[styles.dashTopCardSub, { color: theme.secondaryText }]}>Streak</Text>
        </View>
        <View style={[styles.dashTopCard, { borderColor: getHealthColor(gardenHealth.score) + "55" }]}>
          <Text style={styles.dashTopCardIcon}>🌿</Text>
          <Text style={[styles.dashTopCardLabel, { color: getHealthColor(gardenHealth.score) }]}>{gardenHealth.score}%</Text>
          <Text style={[styles.dashTopCardSub, { color: theme.secondaryText }]}>Health</Text>
        </View>
      </View>

      {/* MAIN STATS GRID */}
      <View style={styles.dashMainGrid}>

        {/* PLANTS */}
        <View style={[styles.dashMainCard, { borderColor: "rgba(92, 255, 137, 0.2)" }]}>
          <IconText label={t("gardenStatsDashboard.plants")} style={styles.dashMainCardEyebrow} />
          <Text style={styles.dashMainCardValue}>{savedPlants.length}</Text>
          <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>Saved</Text>
          <View style={styles.dashMainCardDivider} />
          <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>
            {gardenPlotCount} {t("gardenStatsDashboard.inGardenMap")}
          </Text>
        </View>

        {/* WATERING */}
        <View style={[styles.dashMainCard, {
          borderColor: wateredTodayCount === savedPlants.length && savedPlants.length > 0 ? "rgba(92, 255, 137, 0.3)" : "rgba(107, 199, 255, 0.2)"
        }]}>
          <IconText label={t("gardenStatsDashboard.watering")} style={styles.dashMainCardEyebrow} />
          <Text style={[styles.dashMainCardValue, { color: wateredTodayCount > 0 ? "#6bc7ff" : "#ffffff" }]}>
            {wateredTodayCount}/{savedPlants.length}
          </Text>
          <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.wateredToday")}</Text>
          <View style={styles.dashMainCardDivider} />
          <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>
            {totalWatered} {t("gardenStatsDashboard.totalWaterings")}
          </Text>
        </View>

        {/* JOURNAL */}
        <View style={[styles.dashMainCard, { borderColor: "rgba(255, 216, 107, 0.2)" }]}>
          <IconText label={t("gardenStatsDashboard.journal")} style={styles.dashMainCardEyebrow} />
          <Text style={styles.dashMainCardValue}>{journalEntries.length}</Text>
          <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.totalPhotos")}</Text>
          <View style={styles.dashMainCardDivider} />
          <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>
            {thisMonthPhotos} {t("gardenStatsDashboard.thisMonth")}
          </Text>
        </View>

        {/* HARVEST */}
        <View style={[styles.dashMainCard, {
          borderColor: harvestsReady > 0 ? "rgba(255, 216, 107, 0.4)" : "rgba(255, 159, 67, 0.2)"
        }]}>
          <IconText label={t("gardenStatsDashboard.harvest")} style={styles.dashMainCardEyebrow} />
          <Text style={[styles.dashMainCardValue, { color: harvestsReady > 0 ? "#ffd86b" : "#ffffff" }]}>
            {harvestsReady > 0 ? `${harvestsReady} Ready!` : harvestsTracking}
          </Text>
          <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>
            {harvestsReady > 0 ? t("gardenStatsDashboard.toHarvest") : "Tracking"}
          </Text>
          <View style={styles.dashMainCardDivider} />
          <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>
            {harvestsTracking} {t("gardenStatsDashboard.plantsTracked")}
          </Text>
        </View>

      </View>

      {/* TODAY'S ACTION ITEMS — only what still needs doing */}
      {hasTodos ? (
      <View style={styles.dashActionSection}>
        <Text style={styles.dashActionTitle}>To-Do</Text>

        {plantsNeedingWater > 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(107, 199, 255, 0.1)", borderColor: "rgba(107, 199, 255, 0.24)", flexDirection: "column", alignItems: "stretch", gap: 12 }]}>
            <Pressable onPress={() => onNavigate && onNavigate("plants")} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Text style={styles.dashActionIcon}>💧</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.dashActionLabel}>{plantsNeedingWater} plant{plantsNeedingWater === 1 ? "" : "s"} {t("gardenStatsDashboard.needWatering")}</Text>
                <Text style={[styles.dashActionSub, { color: "#6bc7ff" }]}>{t("gardenStatsDashboard.tapToOpenThePlants")}</Text>
              </View>
              <View style={[styles.dashActionBadge, { backgroundColor: "rgba(107, 199, 255, 0.2)" }]}>
                <Text style={[styles.dashActionBadgeText, { color: "#6bc7ff" }]}>{plantsNeedingWater}</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => onWaterAll && onWaterAll()}
              accessibilityRole="button"
              accessibilityLabel={t("gardenStatsDashboard.waterAllPlantsThatNeed")}
              style={{ backgroundColor: "#6bc7ff", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
            >
              <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>{t("gardenStatsDashboard.waterAll")} {plantsNeedingWater} now</Text>
            </Pressable>
          </View>
        ) : null}

        {harvestsReady > 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(255, 216, 107, 0.1)", borderColor: "rgba(255, 216, 107, 0.3)" }]}>
            <Text style={styles.dashActionIcon}>🎉</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>{harvestsReady} plant{harvestsReady === 1 ? "" : "s"} {t("gardenStatsDashboard.readyToHarvest")}</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.checkYourPlantCardsTo")}</Text>
            </View>
            <View style={[styles.dashActionBadge, { backgroundColor: "rgba(255, 216, 107, 0.2)" }]}>
              <Text style={[styles.dashActionBadgeText, { color: "#ffd86b" }]}>{harvestsReady}</Text>
            </View>
          </View>
        ) : null}

        {fertDue > 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(142, 255, 171, 0.08)", borderColor: "rgba(142, 255, 171, 0.2)" }]}>
            <Text style={styles.dashActionIcon}>🌿</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>{fertDue} plant{fertDue === 1 ? "" : "s"} {t("gardenStatsDashboard.dueForFertilizer")}</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.itsBeen14DaysSince")}</Text>
            </View>
            <View style={[styles.dashActionBadge, { backgroundColor: "rgba(142, 255, 171, 0.16)" }]}>
              <Text style={[styles.dashActionBadgeText, { color: "#8effab" }]}>{fertDue}</Text>
            </View>
          </View>
        ) : null}

        {gardenHealth.score < 70 && gardenPlotCount > 1 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(255, 123, 123, 0.08)", borderColor: "rgba(255, 123, 123, 0.2)" }]}>
            <Text style={styles.dashActionIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>{t("gardenStatsDashboard.gardenHasCompanionConflicts")}</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.checkTheGardenTabTo")}</Text>
            </View>
            <View style={[styles.dashActionBadge, { backgroundColor: "rgba(255, 123, 123, 0.16)" }]}>
              <Text style={[styles.dashActionBadgeText, { color: "#ff7b7b" }]}>{gardenHealth.score}%</Text>
            </View>
          </View>
        ) : null}

        {savedPlants.length === 0 ? (
          <View style={[styles.dashActionRow, { backgroundColor: "rgba(255, 255, 255, 0.06)", borderColor: "rgba(255, 255, 255, 0.1)" }]}>
            <Text style={styles.dashActionIcon}>🌱</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>{t("gardenStatsDashboard.saveYourFirstPlantTo")}</Text>
              <Text style={[styles.dashActionSub, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.browseThePlantsTabAnd")}</Text>
            </View>
          </View>
        ) : null}
      </View>
      ) : null}

      {/* BOTTOM QUICK STATS */}
      <View style={styles.dashBottomRow}>
        <View style={styles.dashBottomStat}>
          <Text style={styles.dashBottomStatValue}>{totalPhotos}</Text>
          <Text style={[styles.dashBottomStatLabel, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.photosLogged")}</Text>
        </View>
        <View style={styles.dashBottomDivider} />
        <View style={styles.dashBottomStat}>
          <Text style={styles.dashBottomStatValue}>{plantsDocumented}</Text>
          <Text style={[styles.dashBottomStatLabel, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.plantsDocumented")}</Text>
        </View>
        <View style={styles.dashBottomDivider} />
     <View style={styles.dashBottomStat}>
          <Text style={styles.dashBottomStatValue}>{thisMonthPhotos}</Text>
          <Text style={[styles.dashBottomStatLabel, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.thisMonth2")}</Text>
        </View>
      </View>

      {hasWeeklyMomentum ? (
        <View style={[styles.dashActionRow, { marginTop: 12, backgroundColor: "rgba(92, 255, 137, 0.08)", borderColor: "rgba(92, 255, 137, 0.2)", flexDirection: "column", alignItems: "stretch", gap: 12 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={styles.dashActionIcon}>📈</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>{t("gardenStatsDashboard.thisWeeksMomentum")}</Text>
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
                  t("gardenStatsDashboard.myPocketPlanterGardenThis"),
                  "",
                  `🪴 ${savedPlants.length} plants growing`,
                  wateringsThisWeek > 0 ? `💧 ${wateringsThisWeek} watering${wateringsThisWeek === 1 ? "" : "s"} this week` : null,
                  photosThisWeek > 0 ? `📸 ${photosThisWeek} garden photo${photosThisWeek === 1 ? "" : "s"} logged` : null,
                  (streakData?.count || 0) > 0 ? `🔥 ${streakData.count}-day streak going strong` : null,
                  `⭐ Level ${gardenXP.level} — ${gardenXP.title}`,
                  "",
                  t("gardenStatsDashboard.growingSmarterWithPocketPlanter"),
                ].filter(Boolean);
                await Share.share({ message: lines.join("\n") });
              } catch (error) {
                console.log("Share skipped:", error);
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={t("gardenStatsDashboard.shareMyGardenWeek")}
            style={{ backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
          >
            <IconText label={t("gardenStatsDashboard.shareMyGardenWeek2")} style={{
  color: "#07120b",
  fontWeight: "900",
  fontSize: 14
}} />
          </Pressable>
        </View>
      ) : null}

    </View>
  );
})
