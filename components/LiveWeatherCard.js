import { Text, View } from "react-native";
import { styles } from "../styles";
import { getClimateBucket, getEstimatedLastFrost, getTodayKey } from "../core";

export function LiveWeatherCard({ theme, weather, recommendation, zone, savedPlants, wateredPlants, harvestTrackers }) {
  const today = getTodayKey();
  const climate = getClimateBucket(zone);
  const currentHour = new Date().getHours();
  const currentMonth = new Date().getMonth() + 1;

  const unwateredCount = savedPlants?.filter(p => wateredPlants?.[p] !== today).length || 0;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).length;

  const getConditionDetails = () => {
    if (!weather) return { icon: "🌤️", label: "Loading", color: "#8effab", urgency: null };
    if (weather.minTempF <= 35) return { icon: "❄️", label: "Frost Risk", color: "#6bc7ff", urgency: "high" };
    if (weather.maxTempF >= 98) return { icon: "🔥", label: "Extreme Heat", color: "#ff4444", urgency: "high" };
    if (weather.maxTempF >= 90) return { icon: "☀️", label: "Hot Day", color: "#ff7b7b", urgency: "medium" };
    if (weather.precipChance >= 70) return { icon: "🌧️", label: "Heavy Rain", color: "#6bc7ff", urgency: "medium" };
    if (weather.precipChance >= 40) return { icon: "🌦️", label: "Possible Rain", color: "#8effab", urgency: null };
    if (weather.maxTempF >= 65 && weather.maxTempF <= 85) return { icon: "✅", label: "Perfect Day", color: "#5cff89", urgency: null };
    return { icon: "🌤️", label: "Mild Conditions", color: "#8effab", urgency: null };
  };

  const getSmartActions = () => {
    const actions = [];
    if (!weather) return actions;

    if (weather.minTempF <= 35) {
      actions.push({ icon: "🏠", text: "Move containers indoors or near shelter tonight", priority: "high" });
      actions.push({ icon: "🧣", text: "Cover frost-sensitive plants before dark", priority: "high" });
    }
    if (weather.maxTempF >= 98) {
      actions.push({ icon: "⏰", text: "Water before 9 AM — afternoon heat will scorch wet leaves", priority: "high" });
      actions.push({ icon: "🌿", text: "Add shade cloth over young transplants", priority: "high" });
      actions.push({ icon: "🚫", text: "Skip transplanting today — heat stress risk too high", priority: "medium" });
    } else if (weather.maxTempF >= 90) {
      actions.push({ icon: "💧", text: "Water deeply early morning to protect roots", priority: "medium" });
      actions.push({ icon: "🪵", text: "Add mulch around plants to retain soil moisture", priority: "medium" });
    }
    if (weather.precipChance >= 70) {
      actions.push({ icon: "🌧️", text: "Skip watering — rain will handle it today", priority: "medium" });
      actions.push({ icon: "🪣", text: "Check container drainage before rain arrives", priority: "low" });
    } else if (weather.precipChance >= 40) {
      actions.push({ icon: "🌱", text: "Check soil moisture before watering — rain may help", priority: "low" });
    }
    if (unwateredCount > 0 && weather.precipChance < 40) {
      actions.push({ icon: "💧", text: `${unwateredCount} saved plant${unwateredCount === 1 ? "" : "s"} still need watering today`, priority: weather.maxTempF >= 90 ? "high" : "medium" });
    }
    if (harvestsReady > 0) {
      actions.push({ icon: "🎉", text: `${harvestsReady} plant${harvestsReady === 1 ? "" : "s"} ready to harvest — pick today for peak flavor`, priority: "high" });
    }
    if (weather.maxTempF >= 65 && weather.maxTempF <= 82 && weather.precipChance < 30) {
      actions.push({ icon: "🌱", text: "Ideal conditions for transplanting or direct sowing today", priority: "low" });
    }
    if (currentHour >= 6 && currentHour <= 9 && weather.maxTempF >= 70) {
      actions.push({ icon: "🌅", text: "Perfect morning window for garden care right now", priority: "low" });
    }
    return actions.slice(0, 4);
  };

  const getZoneInsight = () => {
    if (climate === "hot") {
      if (currentMonth >= 5 && currentMonth <= 9) return `Zone ${zone} summer: deep water every 2-3 days. Harvest peppers, okra, and beans daily during peak season.`;
      return `Zone ${zone} cool season: great time for leafy greens, carrots, and brassicas. Plant now before temperatures rise.`;
    }
    if (climate === "cold") {
      if (currentMonth >= 6 && currentMonth <= 8) return `Zone ${zone} summer: your prime growing window. Stay consistent with watering and harvest regularly.`;
      if (currentMonth >= 9) return `Zone ${zone} fall: harvest root crops and store them. Plant garlic now for a spring harvest.`;
      return `Zone ${zone} spring: soil is warming up. Start seeds indoors and wait for consistent temps above 50°F before transplanting.`;
    }
    return `Zone ${zone}: ${currentMonth >= 3 && currentMonth <= 5 ? "spring planting season — ideal time to get tomatoes, peppers, and herbs in the ground." : currentMonth >= 9 ? "fall growing season — great for cool crops and root vegetables." : "peak growing season — water consistently and harvest often."}`;
  };

  const condition = getConditionDetails();
  const smartActions = getSmartActions();
  const zoneInsight = getZoneInsight();

  const getTempColor = (temp) => {
    if (temp >= 98) return "#ff4444";
    if (temp >= 90) return "#ff7b7b";
    if (temp >= 80) return "#ffd86b";
    if (temp >= 65) return "#5cff89";
    if (temp >= 50) return "#8effab";
    return "#6bc7ff";
  };

  return (
    <View>

      {/* HEADER */}
      <View style={styles.liveWeatherHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.liveWeatherTitle, { color: condition.color }]}>
            {condition.icon} {condition.label}
          </Text>
          <Text style={[styles.liveWeatherBody, { color: theme.secondaryText }]}>
            {recommendation.body}
          </Text>
        </View>
        {condition.urgency === "high" ? (
          <View style={[styles.liveWeatherUrgentBadge, { backgroundColor: `${condition.color}25`, borderColor: condition.color }]}>
            <Text style={[styles.liveWeatherUrgentText, { color: condition.color }]}>⚠️ Alert</Text>
          </View>
        ) : null}
      </View>

      {/* MAIN WEATHER STATS */}
      <View style={styles.liveWeatherGrid}>
        <View style={[styles.liveWeatherBox, { borderColor: weather ? `${getTempColor(weather.maxTempF)}30` : "rgba(255,255,255,0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>☀️</Text>
          <Text style={styles.liveWeatherLabel}>High</Text>
          <Text style={[styles.liveWeatherValue, { color: weather ? getTempColor(weather.maxTempF) : "#ffffff" }]}>
            {weather ? `${Math.round(weather.maxTempF)}°` : "—"}
          </Text>
        </View>
        <View style={[styles.liveWeatherBox, { borderColor: weather ? `${getTempColor(weather.minTempF)}30` : "rgba(255,255,255,0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>🌙</Text>
          <Text style={styles.liveWeatherLabel}>Low</Text>
          <Text style={[styles.liveWeatherValue, { color: weather ? getTempColor(weather.minTempF) : "#ffffff" }]}>
            {weather ? `${Math.round(weather.minTempF)}°` : "—"}
          </Text>
        </View>
        <View style={[styles.liveWeatherBox, { borderColor: weather?.precipChance >= 70 ? "rgba(107,199,255,0.30)" : "rgba(255,255,255,0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>🌧️</Text>
          <Text style={styles.liveWeatherLabel}>Rain</Text>
          <Text style={[styles.liveWeatherValue, { color: weather?.precipChance >= 70 ? "#6bc7ff" : weather?.precipChance >= 40 ? "#8effab" : "#ffffff" }]}>
            {weather ? `${Math.round(weather.precipChance)}%` : "—"}
          </Text>
        </View>
        <View style={styles.liveWeatherBox}>
          <Text style={styles.liveWeatherIcon}>💧</Text>
          <Text style={styles.liveWeatherLabel}>Unwatered</Text>
          <Text style={[styles.liveWeatherValue, { color: unwateredCount > 0 ? "#6bc7ff" : "#5cff89" }]}>
            {unwateredCount}
          </Text>
        </View>
      </View>

      {/* SMART ACTION LIST */}
      {smartActions.length > 0 ? (
        <View style={styles.liveWeatherActionsWrap}>
          <Text style={styles.liveWeatherActionsTitle}>⚡ Smart Actions for Today</Text>
          <View style={styles.liveWeatherActionsList}>
            {smartActions.map((action, index) => (
              <View key={index} style={[styles.liveWeatherActionRow, {
                backgroundColor: action.priority === "high"
                  ? "rgba(255,123,123,0.10)"
                  : action.priority === "medium"
                  ? "rgba(255,216,107,0.08)"
                  : "rgba(255,255,255,0.05)",
                borderColor: action.priority === "high"
                  ? "rgba(255,123,123,0.25)"
                  : action.priority === "medium"
                  ? "rgba(255,216,107,0.20)"
                  : "rgba(255,255,255,0.08)",
              }]}>
                <Text style={styles.liveWeatherActionIcon}>{action.icon}</Text>
                <Text style={[styles.liveWeatherActionText, { color: action.priority === "high" ? "#ffb3b3" : theme.secondaryText }]}>
                  {action.text}
                </Text>
                {action.priority === "high" ? (
                  <View style={styles.liveWeatherActionPriority}>
                    <Text style={styles.liveWeatherActionPriorityText}>!</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* ZONE INSIGHT */}
      <View style={styles.liveWeatherZoneInsight}>
        <Text style={styles.liveWeatherZoneInsightTitle}>📍 Zone Insight</Text>
        <Text style={[styles.liveWeatherZoneInsightText, { color: theme.secondaryText }]}>{zoneInsight}</Text>
      </View>

      {/* FOOTER */}
      <View style={styles.liveWeatherFooter}>
        <Text style={styles.liveWeatherFooterText}>
          Zone {zone || "—"} • Est. last frost: {getEstimatedLastFrost(zone)} • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </Text>
      </View>

    </View>
  );
}
