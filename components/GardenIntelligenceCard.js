import { memo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../styles";
import { formatTemp, getClimateBucket, getSuggestionsForMonth, getTodayKey } from "../core";
import { formatDate, useTranslation } from "../lib/i18n";

export const GardenIntelligenceCard = memo(function GardenIntelligenceCard({ theme, weather, zone, savedPlants, wateredPlants, gardenMap, harvestTrackers, onOpenPlant, unitSystem }) {
  const { t } = useTranslation();
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
    return formatDate(date, {
  weekday: "short"
});
  };

  const bestPlantingDay = forecast.find((d) => d.maxTempF >= 65 && d.maxTempF <= 90 && d.minTempF >= 42 && d.precipChance < 55) || forecast[0];
  const bestWateringDay = forecast.find((d) => d.maxTempF >= 75 && d.maxTempF < 95 && d.precipChance < 40) || forecast.reduce((a, b) => (a.maxTempF > b.maxTempF ? a : b));
  const bestHarvestDay = forecast.find((d) => d.precipChance < 30 && d.maxTempF < 95 && d.maxTempF > 50) || forecast[0];
  const bestFertilizerDay = forecast.find((d) => d.precipChance < 50 && d.maxTempF < 90 && d.minTempF > 40) || forecast[0];
  const heavyRainDay = forecast.find((d) => d.precipChance >= 70);
  const frostRiskDay = forecast.find((d) => d.minTempF <= 35);
  const heatRiskDay = forecast.find((d) => d.maxTempF >= 95);
  const wateringSkippable = weather?.precipChance >= 65;

  const unwateredCount = savedPlants.filter((p) => wateredPlants?.[p] !== today).length;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0).length;
  const weeklyHigh = Math.max(...forecast.map((d) => d.maxTempF));
  const weeklyLow = Math.min(...forecast.map((d) => d.minTempF));
  const rainyDays = forecast.filter((d) => d.precipChance >= 50).length;

  // Zone-specific: what to actually sow this month in this growing zone.
  const plantNow = getSuggestionsForMonth(zone, currentMonth).slice(0, 8);

  const getSeasonalInsight = () => {
    if (frostRiskDay) return { icon: "❄️", text: `Frost on ${formatDay(frostRiskDay.date)} — cover tender plants the night before.`, color: "#6bc7ff" };
    if (heatRiskDay) return { icon: "🔥", text: `Heat stress on ${formatDay(heatRiskDay.date)} — water early and mulch to protect roots.`, color: "#ff7b7b" };
    if (rainyDays >= 4) return { icon: "🌧️", text: `${rainyDays} rainy days — check drainage and hold off fertilizing until soil dries.`, color: "#6bc7ff" };
    if (climate === "hot" && currentMonth >= 5 && currentMonth <= 9) return { icon: "☀️", text: "Hot-zone summer — water deeply every 2–3 days and harvest often.", color: "#ffd86b" };
    if (climate === "cold" && currentMonth >= 9) return { icon: "🍂", text: "Cold-zone fall — harvest before first frost and plant garlic for spring.", color: "#ff9f43" };
    return { icon: "🌱", text: `Good growing week — ${weeklyHigh > 85 ? "stay on top of watering" : "great for planting and garden care"}.`, color: "#5cff89" };
  };
  const seasonalInsight = getSeasonalInsight();

  // Always-useful action days + risk tiles only when there's an actual risk.
  const tiles = [
    { label: "Best to plant", value: formatDay(bestPlantingDay.date), sub: `${formatTemp(bestPlantingDay.maxTempF, unitSystem)} · ${Math.round(bestPlantingDay.precipChance)}% rain`, icon: "🌱", color: "#5cff89" },
    { label: wateringSkippable ? "Watering" : "Best to water", value: wateringSkippable ? "Rain covers it" : formatDay(bestWateringDay.date), sub: wateringSkippable ? `${Math.round(weather.precipChance)}% rain today` : `${formatTemp(bestWateringDay.maxTempF, unitSystem)} · dry`, icon: "💧", color: "#6bc7ff" },
    { label: "Best to harvest", value: formatDay(bestHarvestDay.date), sub: `${formatTemp(bestHarvestDay.maxTempF, unitSystem)} · dry`, icon: "🚜", color: "#ffd86b" },
    { label: "Best to fertilize", value: formatDay(bestFertilizerDay.date), sub: `${formatTemp(bestFertilizerDay.maxTempF, unitSystem)} · ${Math.round(bestFertilizerDay.precipChance)}% rain`, icon: "🌿", color: "#8effab" },
    ...(frostRiskDay ? [{ label: "Frost risk", value: formatDay(frostRiskDay.date), sub: `Low ${formatTemp(frostRiskDay.minTempF, unitSystem, true)}`, icon: "❄️", color: "#a3d5ff" }] : []),
    ...(heatRiskDay ? [{ label: "Heat risk", value: formatDay(heatRiskDay.date), sub: `High ${formatTemp(heatRiskDay.maxTempF, unitSystem, true)}`, icon: "🔥", color: "#ff7b7b" }] : []),
    ...(heavyRainDay ? [{ label: "Heavy rain", value: formatDay(heavyRainDay.date), sub: `${Math.round(heavyRainDay.precipChance)}% chance`, icon: "🌧️", color: "#6bc7ff" }] : []),
  ];

  return (
    <View>
      <Text style={[styles.gardenIntelligenceSub, { color: theme.secondaryText, marginTop: 0 }]}>
        Zone {zone || "—"} · {formatDate(new Date(), {
  month: "long",
  day: "numeric"
})}
      </Text>

      {/* WEEKLY SNAPSHOT */}
      <View style={styles.gardenIntelWeeklyRow}>
        {[
          { icon: "🌡️", value: formatTemp(weeklyHigh, unitSystem), label: t("gardenIntelligence.weekHigh"), color: undefined },
          { icon: "🌙", value: formatTemp(weeklyLow, unitSystem), label: t("gardenIntelligence.weekLow"), color: undefined },
          { icon: "🌧️", value: rainyDays, label: t("gardenIntelligence.rainyDays"), color: undefined },
          { icon: "💧", value: unwateredCount, label: t("gardenIntelligence.needWater"), color: unwateredCount > 0 ? "#6bc7ff" : "#5cff89" },
        ].map((s) => (
          <View key={s.label} style={styles.gardenIntelWeeklyStat}>
            <Text style={styles.gardenIntelWeeklyIcon}>{s.icon}</Text>
            <Text style={[styles.gardenIntelWeeklyValue, s.color ? { color: s.color } : null]}>{s.value}</Text>
            <Text style={[styles.gardenIntelWeeklyLabel, { color: theme.secondaryText }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* SEASONAL INSIGHT */}
      <View style={[styles.gardenIntelInsightBanner, { backgroundColor: `${seasonalInsight.color}15`, borderColor: `${seasonalInsight.color}40` }]}>
        <Text style={styles.gardenIntelInsightIcon}>{seasonalInsight.icon}</Text>
        <Text style={[styles.gardenIntelInsightText, { color: seasonalInsight.color }]}>{seasonalInsight.text}</Text>
      </View>

      {harvestsReady > 0 ? (
        <View style={[styles.gardenIntelInsightBanner, { backgroundColor: "rgba(255, 216, 107, 0.12)", borderColor: "rgba(255, 216, 107, 0.3)" }]}>
          <Text style={styles.gardenIntelInsightIcon}>🎉</Text>
          <Text style={[styles.gardenIntelInsightText, { color: "#ffd86b" }]}>
            {harvestsReady} plant{harvestsReady === 1 ? "" : "s"} {t("gardenIntelligence.readyToHarvestToday")}
          </Text>
        </View>
      ) : null}

      {/* ZONE-SPECIFIC: plant now */}
      {plantNow.length ? (
        <View style={{ marginTop: 12, backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}>
          <Text style={{ color: "#8effab", fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 10 }}>
            {t("gardenIntelligence.plantNowInZone")} {zone || "—"}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {plantNow.map((item) => (
              <Pressable
                key={item.name}
                onPress={() => onOpenPlant && onOpenPlant(item)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.name} care guide`}
                style={{ backgroundColor: "rgba(92, 255, 137, 0.12)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
              >
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800" }}>{item.name} ›</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* COMPACT 2-COLUMN ACTION GRID */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
        {tiles.map((t) => (
          <View key={t.label} style={{ width: "47%", borderRadius: 16, padding: 12, backgroundColor: `${t.color}12`, borderWidth: 1, borderColor: `${t.color}30` }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontSize: 14 }}>{t.icon}</Text>
              <Text numberOfLines={1} style={{ color: t.color, fontSize: 14, fontWeight: "800", flexShrink: 1 }}>{t.value}</Text>
            </View>
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: "700", marginTop: 6 }}>{t.label}</Text>
            <Text numberOfLines={1} style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "600", marginTop: 2 }}>{t.sub}</Text>
          </View>
        ))}
      </View>
    </View>
  );
})
