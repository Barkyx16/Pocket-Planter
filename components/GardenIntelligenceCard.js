import { memo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../styles";
import { FROST_THRESHOLD_F, HEAT_THRESHOLD_F, flipMonth, formatTemp, getClimateBucket, getSeasonForDate, getSuggestionsForMonth, isHarvestReady, isWaterDue } from "../core";
import produceData from "../data/produceData";
import { formatDate, tn, useTranslation } from "../lib/i18n";

export const GardenIntelligenceCard = memo(function GardenIntelligenceCard({ theme, weather, zone, savedPlants, wateredPlants, wateringHistory, gardenMap, harvestTrackers, onOpenPlant, unitSystem }) {
  const { t } = useTranslation();
  const forecast = weather?.forecast || [];
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
  const frostRiskDay = forecast.find((d) => d.minTempF <= FROST_THRESHOLD_F);
  const heatRiskDay = forecast.find((d) => d.maxTempF >= HEAT_THRESHOLD_F);
  const wateringSkippable = weather?.precipChance >= 65;

  // Due by each plant's schedule, the rule every other "need water" count uses.
  const unwateredCount = savedPlants.filter((p) => isWaterDue(p, produceData.find((item) => item.name === p), wateredPlants, wateringHistory, weather)).length;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, tracker]) => isHarvestReady(tracker)).length;
  const weeklyHigh = Math.max(...forecast.map((d) => d.maxTempF));
  const weeklyLow = Math.min(...forecast.map((d) => d.minTempF));
  const rainyDays = forecast.filter((d) => d.precipChance >= 50).length;

  // Zone-specific: what to actually sow this month in this growing zone.
  const plantNow = getSuggestionsForMonth(zone, currentMonth).slice(0, 8);

  const getSeasonalInsight = () => {
    if (frostRiskDay) return { icon: "❄️", text: t("ui2.frostOn", { day: formatDay(frostRiskDay.date) }), color: "#6bc7ff" };
    if (heatRiskDay) return { icon: "🔥", text: t("ui2.heatOn", { day: formatDay(heatRiskDay.date) }), color: "#ff7b7b" };
    if (rainyDays >= 4) return { icon: "🌧️", text: tn("ui2.rainyDays", rainyDays), color: "#6bc7ff" };
    // Reference month: the 5–9 window is northern summer. getSuggestionsForMonth
    // above needs the local month, so only this seasonal test is translated.
    const refMonth = flipMonth(currentMonth);
    if (climate === "hot" && refMonth >= 5 && refMonth <= 9) return { icon: "☀️", text: t("ui2.hotSummer"), color: "#ffd86b" };
    if (climate === "cold" && getSeasonForDate().key === "fall") return { icon: "🍂", text: t("ui2.coldFall"), color: "#ff9f43" };
    return { icon: "🌱", text: t(weeklyHigh > 85 ? "ui2.goodWeekWater" : "ui2.goodWeekPlant"), color: "#5cff89" };
  };
  const seasonalInsight = getSeasonalInsight();

  // Always-useful action days + risk tiles only when there's an actual risk.
  const tiles = [
    { label: t("ui2.bestPlant"), value: formatDay(bestPlantingDay.date), sub: t("ui2.subTempRain", { temp: formatTemp(bestPlantingDay.maxTempF, unitSystem), pct: Math.round(bestPlantingDay.precipChance) }), icon: "🌱", color: "#5cff89" },
    { label: wateringSkippable ? t("ui2.watering") : t("ui2.bestWater"), value: wateringSkippable ? t("ui2.rainCovers") : formatDay(bestWateringDay.date), sub: wateringSkippable ? t("ui2.subRainToday", { pct: Math.round(weather.precipChance) }) : t("ui2.subDry", { temp: formatTemp(bestWateringDay.maxTempF, unitSystem) }), icon: "💧", color: "#6bc7ff" },
    { label: t("ui2.bestHarvest"), value: formatDay(bestHarvestDay.date), sub: t("ui2.subDry", { temp: formatTemp(bestHarvestDay.maxTempF, unitSystem) }), icon: "🚜", color: "#ffd86b" },
    { label: t("ui2.bestFertilize"), value: formatDay(bestFertilizerDay.date), sub: t("ui2.subTempRain", { temp: formatTemp(bestFertilizerDay.maxTempF, unitSystem), pct: Math.round(bestFertilizerDay.precipChance) }), icon: "🌿", color: "#8effab" },
    ...(frostRiskDay ? [{ label: t("ui2.frostRisk"), value: formatDay(frostRiskDay.date), sub: t("ui2.subLow", { temp: formatTemp(frostRiskDay.minTempF, unitSystem, true) }), icon: "❄️", color: "#a3d5ff" }] : []),
    ...(heatRiskDay ? [{ label: t("ui2.heatRisk"), value: formatDay(heatRiskDay.date), sub: t("ui2.subHigh", { temp: formatTemp(heatRiskDay.maxTempF, unitSystem, true) }), icon: "🔥", color: "#ff7b7b" }] : []),
    ...(heavyRainDay ? [{ label: t("ui2.heavyRain"), value: formatDay(heavyRainDay.date), sub: t("ui2.subChance", { pct: Math.round(heavyRainDay.precipChance) }), icon: "🌧️", color: "#6bc7ff" }] : []),
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
            {tn("counts.readyToday", harvestsReady)}
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
                accessibilityLabel={t("extra.openCareGuide", { name: item.name })}
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
