import { memo } from "react";
import { ScrollView, Text, View } from "react-native";
import { styles } from "../styles";
import { formatTemp, getClimateBucket, getTodayKey, getWeatherIconFromDay } from "../core";

export const ForecastCard = memo(function ForecastCard({ theme, weather, zone, savedPlants, wateredPlants, unitSystem }) {
  const forecast = weather?.forecast || [];
  const today = getTodayKey();
  const climate = getClimateBucket(zone);

  if (!forecast.length) return null;

  const weeklyHigh = Math.max(...forecast.map(d => d.maxTempF));
  const weeklyLow = Math.min(...forecast.map(d => d.minTempF));
  const rainyDays = forecast.filter(d => d.precipChance >= 50).length;
  const avgRain = Math.round(forecast.reduce((sum, d) => sum + d.precipChance, 0) / forecast.length);

  const formatDayLabel = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    const todayDate = new Date();
    todayDate.setHours(12, 0, 0, 0);
    const diff = Math.round((date - todayDate) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Tmrw";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Advice thresholds shift by climate — 92°F is a scorcher in Zone 4 but a normal
  // summer day in Zone 10, so what counts as "hot" depends on where you garden.
  const getGardenAdvice = (day) => {
    const heatSkip = climate === "hot" ? 104 : climate === "cold" ? 94 : 98;
    const heatWater = climate === "hot" ? 95 : climate === "cold" ? 85 : 90;
    const greatMax = climate === "cold" ? 80 : 85;
    if (day.minTempF <= 35) return { text: "Cover plants", color: "#6bc7ff" };
    if (day.maxTempF >= heatSkip) return { text: "Skip planting", color: "#ff7b7b" };
    if (day.maxTempF >= heatWater) return { text: "Water early", color: "#ffd86b" };
    if (day.precipChance >= 70) return { text: "Skip watering", color: "#6bc7ff" };
    if (day.precipChance >= 40) return { text: "Check soil", color: "#8effab" };
    if (day.maxTempF >= 62 && day.maxTempF <= greatMax && day.precipChance < 30) return { text: "Great day! 🌟", color: "#5cff89" };
    return { text: "Normal care", color: "#d7ebdc" };
  };

  const getTempColor = (temp) => {
    if (temp >= 98) return "#ff4444";
    if (temp >= 90) return "#ff7b7b";
    if (temp >= 80) return "#ffd86b";
    if (temp >= 65) return "#5cff89";
    if (temp >= 50) return "#8effab";
    if (temp >= 35) return "#6bc7ff";
    return "#b3d9ff";
  };

  const getRainColor = (chance) => {
    if (chance >= 70) return "#6bc7ff";
    if (chance >= 40) return "#8effab";
    return "#d7ebdc";
  };

  const getWeekSummary = () => {
    const frostDays = forecast.filter(d => d.minTempF <= 35).length;
    const heatDays = forecast.filter(d => d.maxTempF >= 95).length;
    if (frostDays > 0) return { icon: "❄️", text: `${frostDays} frost risk night${frostDays === 1 ? "" : "s"} this week — keep covers ready.`, color: "#6bc7ff" };
    if (heatDays >= 3) return { icon: "🔥", text: `${heatDays} days above 95°F — water deeply every morning and mulch heavily.`, color: "#ff7b7b" };
    if (rainyDays >= 4) return { icon: "🌧️", text: `${rainyDays} rainy days ahead — hold off on fertilizing and check container drainage.`, color: "#6bc7ff" };
    if (weeklyHigh <= 75 && weeklyLow >= 45) return { icon: "✅", text: "Perfect growing week ahead — mild temps and low rain chance all week.", color: "#5cff89" };
    if (climate === "hot") return { icon: "☀️", text: `Hot zone week — high of ${formatTemp(weeklyHigh, unitSystem, true)}. Water before 9 AM daily and harvest often.`, color: "#ffd86b" };
    return { icon: "🌱", text: `Good garden week — high of ${formatTemp(weeklyHigh, unitSystem, true)} with ${rainyDays} rainy day${rainyDays === 1 ? "" : "s"}. Stay consistent with watering.`, color: "#8effab" };
  };

  const weekSummary = getWeekSummary();

  const bestDay = forecast.reduce((best, day) => {
    const score =
      (day.maxTempF >= 65 && day.maxTempF <= 85 ? 3 : 0) +
      (day.precipChance < 30 ? 2 : day.precipChance < 50 ? 1 : 0) +
      (day.minTempF >= 45 ? 1 : 0);
    return score > (best.score || 0) ? { ...day, score } : best;
  }, { score: -1 });

  return (
    <View>

      {/* HEADER — title comes from the collapsible card; keep a useful one-liner here */}
      <Text style={[styles.forecastSubtitle, { color: theme.secondaryText }]}>
        Zone {zone || "—"} • 🌱 Best planting day: <Text style={{ color: "#5cff89", fontWeight: "900" }}>{formatDayLabel(bestDay.date)}</Text>
      </Text>

      {/* WEEKLY SUMMARY STATS */}
      <View style={styles.forecastWeeklyStats}>
        <View style={styles.forecastWeeklyStat}>
          <Text style={[styles.forecastWeeklyStatValue, { color: getTempColor(weeklyHigh) }]}>
            {formatTemp(weeklyHigh, unitSystem)}
          </Text>
          <Text style={[styles.forecastWeeklyStatLabel, { color: theme.secondaryText }]}>Week High</Text>
        </View>
        <View style={styles.forecastWeeklyDivider} />
        <View style={styles.forecastWeeklyStat}>
          <Text style={[styles.forecastWeeklyStatValue, { color: getTempColor(weeklyLow) }]}>
            {formatTemp(weeklyLow, unitSystem)}
          </Text>
          <Text style={[styles.forecastWeeklyStatLabel, { color: theme.secondaryText }]}>Week Low</Text>
        </View>
        <View style={styles.forecastWeeklyDivider} />
        <View style={styles.forecastWeeklyStat}>
          <Text style={[styles.forecastWeeklyStatValue, { color: getRainColor(avgRain) }]}>
            {rainyDays}
          </Text>
          <Text style={[styles.forecastWeeklyStatLabel, { color: theme.secondaryText }]}>Rainy Days</Text>
        </View>
        <View style={styles.forecastWeeklyDivider} />
        <View style={styles.forecastWeeklyStat}>
          <Text style={[styles.forecastWeeklyStatValue, { color: "#5cff89" }]}>
            {formatDayLabel(bestDay.date)}
          </Text>
          <Text style={[styles.forecastWeeklyStatLabel, { color: theme.secondaryText }]}>Best Day</Text>
        </View>
      </View>

      {/* WEEK SUMMARY BANNER */}
      <View style={[styles.forecastSummaryBanner, {
        backgroundColor: `${weekSummary.color}15`,
        borderColor: `${weekSummary.color}40`,
      }]}>
        <Text style={styles.forecastSummaryIcon}>{weekSummary.icon}</Text>
        <Text style={[styles.forecastSummaryText, { color: weekSummary.color }]}>
          {weekSummary.text}
        </Text>
      </View>

      {/* DAILY FORECAST SCROLL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastScroll}
      >
        {forecast.map((day) => {
          const advice = getGardenAdvice(day);
          const isToday = day.date === today;
          const isBestDay = day.date === bestDay.date;
          const tempColor = getTempColor(day.maxTempF);
          const rainColor = getRainColor(day.precipChance);

          return (
            <View
              key={day.date}
              style={[
                styles.forecastDayCardV2,
                {
                  backgroundColor: isToday
                    ? "rgba(92,255,137,0.14)"
                    : isBestDay
                    ? "rgba(92,255,137,0.08)"
                    : "rgba(255,255,255,0.06)",
                  borderColor: isToday
                    ? "#5cff89"
                    : isBestDay
                    ? "rgba(92,255,137,0.35)"
                    : "rgba(255,255,255,0.08)",
                  borderWidth: isToday ? 2 : 1,
                },
              ]}
            >
              {/* DAY LABEL */}
              <Text style={[styles.forecastDayLabelV2, { color: isToday ? "#5cff89" : theme.secondaryText }]}>
                {formatDayLabel(day.date)}
              </Text>

              {/* BEST DAY BADGE */}
              {isBestDay && !isToday ? (
                <View style={styles.forecastBestBadge}>
                  <Text style={styles.forecastBestBadgeText}>Best</Text>
                </View>
              ) : null}

              {/* WEATHER ICON */}
              <Text style={styles.forecastIconV2}>
                {getWeatherIconFromDay(day)}
              </Text>

              {/* HIGH TEMP */}
              <Text style={[styles.forecastTempHigh, { color: tempColor }]}>
                {formatTemp(day.maxTempF, unitSystem)}
              </Text>

              {/* LOW TEMP */}
              <Text style={[styles.forecastTempLow, { color: theme.secondaryText }]}>
                {formatTemp(day.minTempF, unitSystem)}
              </Text>

              {/* RAIN CHANCE */}
              <View style={styles.forecastRainRow}>
                <Text style={styles.forecastRainIcon}>💧</Text>
                <Text style={[styles.forecastRainV2, { color: rainColor }]}>
                  {Math.round(day.precipChance)}%
                </Text>
              </View>

              {/* GARDEN ADVICE */}
              <View style={[styles.forecastAdvicePill, { backgroundColor: `${advice.color}20` }]}>
                <Text style={[styles.forecastAdviceText, { color: advice.color }]} numberOfLines={1}>
                  {advice.text}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

    </View>
  );
})
