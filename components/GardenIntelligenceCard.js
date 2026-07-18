import { Text, View } from "react-native";
import { styles } from "../styles";
import { getClimateBucket, getTodayKey } from "../core";

export function GardenIntelligenceCard({ theme, weather, zone, savedPlants, wateredPlants, gardenMap, harvestTrackers }) {
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
