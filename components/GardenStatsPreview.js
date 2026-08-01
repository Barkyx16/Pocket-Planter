import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { styles } from "../styles";
import { calculateGardenHealth, formatTemp, tapHaptic } from "../core";
import { AnimatedBar } from "./AnimatedBar";
import { IconText } from "./IconText";
import { formatDate, useTranslation } from "../lib/i18n";

// Free-tier teaser for the Garden Dashboard.
//
// Instead of a bare padlock, free users get a *working slice* of their own
// dashboard — real XP, streak, garden health and today's weather — sitting
// above a blurred, populated preview of the deeper stats + to-do center that
// Premium unlocks. Seeing their real numbers already being tracked is the hook;
// the blurred richness below is the tease.
export const GardenStatsPreview = memo(function GardenStatsPreview({
  theme,
  savedPlants = [],
  gardenXP,
  streakData,
  weather,
  zone,
  gardenMap,
  unitSystem,
  onUnlock,
}) {
  const { t } = useTranslation();

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

  const gardenHealth = calculateGardenHealth(gardenMap);
  const streakCount = streakData?.count || 0;
  const level = gardenXP?.level ?? 1;
  const levelTitle = gardenXP?.title ?? "Seedling";
  const levelProgress = gardenXP?.progress || 0;
  const currentLevelXP = gardenXP?.currentLevelXP ?? 0;
  const nextLevelXP = gardenXP?.nextLevelXP ?? 100;

  const weatherStatus = !weather ? null
    : weather.minTempF <= 35 ? { icon: "❄️", label: "Frost Risk", color: "#6bc7ff" }
    : weather.maxTempF >= 98 ? { icon: "🔥", label: "Heat Alert", color: "#ff7b7b" }
    : weather.precipChance >= 70 ? { icon: "🌧️", label: "Rain Today", color: "#6bc7ff" }
    : { icon: "☀️", label: "Good Day", color: "#5cff89" };

  return (
    <View>
      {/* ── REAL, LIVE SLICE ───────────────────────────────────────────── */}
      <Text style={[styles.gardenStatsSubtitle, { color: theme.secondaryText }]}>
        Zone {zone || "—"} • {formatDate(new Date(), { month: "long", year: "numeric" })}
      </Text>

      {/* XP PROGRESS — real */}
      <View style={styles.dashXPRow}>
        <View style={styles.dashXPLeft}>
          <Text style={styles.dashXPLevel}>Lvl {level}</Text>
          <Text style={[styles.dashXPTitle, { color: theme.secondaryText }]}>{levelTitle}</Text>
        </View>
        <View style={styles.dashXPBarWrap}>
          <AnimatedBar progress={levelProgress} color="#5cff89" trackStyle={styles.dashXPTrack} fillStyle={styles.dashXPFill} />
          <Text style={styles.dashXPMeta}>{currentLevelXP} / {nextLevelXP} {t("gardenStatsDashboard.xp")}</Text>
        </View>
        <Text style={styles.dashXPEmoji}>{getStreakEmoji(streakCount)}</Text>
      </View>

      {/* WEATHER + STREAK + HEALTH — real */}
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
        <View style={[styles.dashTopCard, { borderColor: streakCount >= 7 ? "#ff9f4355" : "rgba(255, 255, 255, 0.08)" }]}>
          <Text style={styles.dashTopCardIcon}>{getStreakEmoji(streakCount)}</Text>
          <Text style={[styles.dashTopCardLabel, { color: streakCount >= 7 ? "#ff9f43" : theme.text }]}>{streakCount} Days</Text>
          <Text style={[styles.dashTopCardSub, { color: theme.secondaryText }]}>Streak</Text>
        </View>
        <View style={[styles.dashTopCard, { borderColor: getHealthColor(gardenHealth.score) + "55" }]}>
          <Text style={styles.dashTopCardIcon}>🌿</Text>
          <Text style={[styles.dashTopCardLabel, { color: getHealthColor(gardenHealth.score) }]}>{gardenHealth.score}%</Text>
          <Text style={[styles.dashTopCardSub, { color: theme.secondaryText }]}>Health</Text>
        </View>
      </View>

      {/* ── BLURRED PREVIEW + UNLOCK ───────────────────────────────────── */}
      <View style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginTop: 4 }}>
        {/* Populated sample dashboard sitting under the blur so the locked area
            reads as rich and full, not empty. */}
        <View pointerEvents="none">
          <View style={styles.dashMainGrid}>
            <View style={[styles.dashMainCard, { borderColor: "rgba(92, 255, 137, 0.2)" }]}>
              <IconText label={t("gardenStatsDashboard.plants")} style={styles.dashMainCardEyebrow} />
              <Text style={styles.dashMainCardValue}>{Math.max(savedPlants.length, 8)}</Text>
              <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>Saved</Text>
              <View style={styles.dashMainCardDivider} />
              <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>5 {t("gardenStatsDashboard.inGardenMap")}</Text>
            </View>
            <View style={[styles.dashMainCard, { borderColor: "rgba(107, 199, 255, 0.2)" }]}>
              <IconText label={t("gardenStatsDashboard.watering")} style={styles.dashMainCardEyebrow} />
              <Text style={[styles.dashMainCardValue, { color: "#6bc7ff" }]}>5/8</Text>
              <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.wateredToday")}</Text>
              <View style={styles.dashMainCardDivider} />
              <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>142 {t("gardenStatsDashboard.totalWaterings")}</Text>
            </View>
            <View style={[styles.dashMainCard, { borderColor: "rgba(255, 216, 107, 0.2)" }]}>
              <IconText label={t("gardenStatsDashboard.journal")} style={styles.dashMainCardEyebrow} />
              <Text style={styles.dashMainCardValue}>24</Text>
              <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.totalPhotos")}</Text>
              <View style={styles.dashMainCardDivider} />
              <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>6 {t("gardenStatsDashboard.thisMonth")}</Text>
            </View>
            <View style={[styles.dashMainCard, { borderColor: "rgba(255, 216, 107, 0.4)" }]}>
              <IconText label={t("gardenStatsDashboard.harvest")} style={styles.dashMainCardEyebrow} />
              <Text style={[styles.dashMainCardValue, { color: "#ffd86b" }]}>2 Ready!</Text>
              <Text style={[styles.dashMainCardLabel, { color: theme.secondaryText }]}>{t("gardenStatsDashboard.toHarvest")}</Text>
              <View style={styles.dashMainCardDivider} />
              <Text style={[styles.dashMainCardSub, { color: theme.secondaryText }]}>3 {t("gardenStatsDashboard.plantsTracked")}</Text>
            </View>
          </View>

          <View style={[styles.dashActionRow, { backgroundColor: "rgba(107, 199, 255, 0.1)", borderColor: "rgba(107, 199, 255, 0.24)" }]}>
            <Text style={styles.dashActionIcon}>💧</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dashActionLabel}>3 plants need watering</Text>
              <Text style={[styles.dashActionSub, { color: "#6bc7ff" }]}>Water all with one tap</Text>
            </View>
            <View style={[styles.dashActionBadge, { backgroundColor: "rgba(107, 199, 255, 0.2)" }]}>
              <Text style={[styles.dashActionBadgeText, { color: "#6bc7ff" }]}>3</Text>
            </View>
          </View>
        </View>

        {/* Blur + unlock overlay */}
        <BlurView intensity={22} tint="dark" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
        <Pressable
          onPress={() => { tapHaptic(); onUnlock && onUnlock(); }}
          accessibilityRole="button"
          accessibilityLabel="Unlock the full garden dashboard with Premium"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "rgba(7, 18, 11, 0.35)" }}
        >
          <View style={styles.weatherLockCircle}><Text style={styles.weatherLockIcon}>🔒</Text></View>
          <Text style={[styles.weatherPremiumTitle, { textAlign: "center", marginTop: 10 }]}>See your full dashboard</Text>
          <Text style={[styles.weatherPremiumText, { textAlign: "center", maxWidth: 300 }]}>
            Unlock Premium for watering, harvests, journal stats and today's to-do list — all in one place.
          </Text>
          <View style={[styles.weatherUnlockButton, { paddingHorizontal: 28 }]}>
            <IconText label={t("premiumLocked.unlockPremium")} style={styles.weatherUnlockText} />
          </View>
        </Pressable>
      </View>
    </View>
  );
})
