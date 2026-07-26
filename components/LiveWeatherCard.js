import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { formatTemp, getTodayKey, tapHaptic } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const LiveWeatherCard = memo(function LiveWeatherCard({ theme, weather, recommendation, savedPlants, wateredPlants, harvestTrackers, unitSystem }) {
  const { t } = useTranslation();
  const today = getTodayKey();
  const currentHour = new Date().getHours();

  // Completed smart actions, stored per day so they reset every 24 hours.
  const [doneIds, setDoneIds] = useState({});
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(`pp_smartActionsDone_${today}`).then((val) => {
      if (!alive) return;
      try { setDoneIds(val ? (JSON.parse(val) || {}) : {}); } catch (e) { setDoneIds({}); }
    }).catch(() => {});
    return () => { alive = false; };
  }, [today]);
  const markActionDone = (id) => {
    tapHaptic("light");
    LayoutAnimation.configureNext(LayoutAnimation.create(220, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity));
    setDoneIds((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      AsyncStorage.setItem(`pp_smartActionsDone_${today}`, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const unwateredCount = savedPlants?.filter(p => wateredPlants?.[p] !== today).length || 0;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).length;

  const getConditionDetails = () => {
    if (!weather) return { icon: "🌤️", label: "Loading", color: "#8effab", urgency: null };
    if (weather.minTempF <= 35) return { icon: "❄️", label: "Frost Risk", color: "#6bc7ff", urgency: "high" };
    if (weather.maxTempF >= 98) return { icon: "🔥", label: "Extreme Heat", color: "#ff7b7b", urgency: "high" };
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
      actions.push({ id: "frost-indoors", icon: "🏠", text: "Move containers indoors or near shelter tonight", priority: "high" });
      actions.push({ id: "frost-cover", icon: "🧣", text: "Cover frost-sensitive plants before dark", priority: "high" });
    }
    if (weather.maxTempF >= 98) {
      actions.push({ id: "heat-shade", icon: "🌿", text: "Add shade cloth over young transplants", priority: "high" });
      actions.push({ id: "heat-skip-transplant", icon: "🚫", text: "Skip transplanting today — heat stress risk too high", priority: "medium" });
    } else if (weather.maxTempF >= 90) {
      actions.push({ id: "warm-mulch", icon: "🪵", text: "Add mulch around plants to retain soil moisture", priority: "medium" });
    }
    if (weather.precipChance >= 70) {
      actions.push({ id: "rain-skip-water", icon: "🌧️", text: "Skip watering — rain will handle it today", priority: "medium" });
      actions.push({ id: "rain-drainage", icon: "🪣", text: "Check container drainage before rain arrives", priority: "low" });
    } else if (weather.precipChance >= 40) {
      actions.push({ id: "rain-check-soil", icon: "🌱", text: "Check soil moisture before watering — rain may help", priority: "low" });
    }
    if (unwateredCount > 0 && weather.precipChance < 40) {
      actions.push({ id: "water-remaining", icon: "💧", text: `${unwateredCount} saved plant${unwateredCount === 1 ? "" : "s"} still need watering today`, priority: weather.maxTempF >= 90 ? "high" : "medium" });
    }
    if (harvestsReady > 0) {
      actions.push({ id: "harvest-ready", icon: "🎉", text: `${harvestsReady} plant${harvestsReady === 1 ? "" : "s"} ready to harvest — pick today for peak flavor`, priority: "high" });
    }
    if (weather.maxTempF >= 65 && weather.maxTempF <= 82 && weather.precipChance < 30) {
      actions.push({ id: "ideal-sow", icon: "🌱", text: "Ideal conditions for transplanting or direct sowing today", priority: "low" });
    }
    if (currentHour >= 6 && currentHour <= 9 && weather.maxTempF >= 70) {
      actions.push({ id: "morning-window", icon: "🌅", text: "Perfect morning window for garden care right now", priority: "low" });
    }
    return actions.slice(0, 4);
  };

  const condition = getConditionDetails();
  const smartActions = getSmartActions();
  const doneCount = smartActions.filter((a) => doneIds[a.id]).length;
  const activeActions = smartActions.filter((a) => !doneIds[a.id]);

  const getTempColor = (temp) => {
    if (temp >= 98) return "#ff7b7b";
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
            <IconText label={t("liveWeather.alert")} style={[styles.liveWeatherUrgentText, {
  color: condition.color
}]} />
          </View>
        ) : null}
      </View>

      {/* MAIN WEATHER STATS */}
      <View style={styles.liveWeatherGrid}>
        <View style={[styles.liveWeatherBox, { borderColor: weather ? `${getTempColor(weather.maxTempF)}30` : "rgba(255, 255, 255, 0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>☀️</Text>
          <Text style={styles.liveWeatherLabel}>High</Text>
          <Text style={[styles.liveWeatherValue, { color: weather ? getTempColor(weather.maxTempF) : "#ffffff" }]}>
            {weather ? formatTemp(weather.maxTempF, unitSystem) : "—"}
          </Text>
        </View>
        <View style={[styles.liveWeatherBox, { borderColor: weather ? `${getTempColor(weather.minTempF)}30` : "rgba(255, 255, 255, 0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>🌙</Text>
          <Text style={styles.liveWeatherLabel}>Low</Text>
          <Text style={[styles.liveWeatherValue, { color: weather ? getTempColor(weather.minTempF) : "#ffffff" }]}>
            {weather ? formatTemp(weather.minTempF, unitSystem) : "—"}
          </Text>
        </View>
        <View style={[styles.liveWeatherBox, { borderColor: weather?.precipChance >= 70 ? "rgba(107, 199, 255, 0.3)" : "rgba(255, 255, 255, 0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>🌧️</Text>
          <Text style={styles.liveWeatherLabel}>Rain</Text>
          <Text style={[styles.liveWeatherValue, { color: weather?.precipChance >= 70 ? "#6bc7ff" : weather?.precipChance >= 40 ? "#8effab" : "#ffffff" }]}>
            {weather ? `${Math.round(weather.precipChance)}%` : "—"}
          </Text>
        </View>
      </View>

      {/* SMART ACTION LIST — tap to check off; resets every 24h */}
      {smartActions.length > 0 ? (
        <View style={styles.liveWeatherActionsWrap}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <IconText label={t("liveWeather.smartActionsForToday")} style={styles.liveWeatherActionsTitle} />
            <Text style={{ color: doneCount === smartActions.length ? "#5cff89" : "#8effab", fontSize: 12, fontWeight: "900" }}>
              {doneCount}/{smartActions.length}
            </Text>
          </View>
          {activeActions.length ? (
            <>
              <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 2, marginBottom: 8 }}>
                {t("liveWeather.tapOneToCheckIt")}
              </Text>
              <View style={styles.liveWeatherActionsList}>
                {activeActions.map((action) => {
                  const baseBg = action.priority === "high"
                    ? "rgba(255, 123, 123, 0.1)"
                    : action.priority === "medium"
                    ? "rgba(255, 216, 107, 0.08)"
                    : "rgba(255, 255, 255, 0.06)";
                  const baseBorder = action.priority === "high"
                    ? "rgba(255, 123, 123, 0.24)"
                    : action.priority === "medium"
                    ? "rgba(255, 216, 107, 0.2)"
                    : "rgba(255, 255, 255, 0.08)";
                  return (
                    <Pressable
                      key={action.id}
                      onPress={() => markActionDone(action.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Mark complete: ${action.text}`}
                      style={[styles.liveWeatherActionRow, { backgroundColor: baseBg, borderColor: baseBorder }]}
                    >
                      <Text style={styles.liveWeatherActionIcon}>{action.icon}</Text>
                      <Text style={[styles.liveWeatherActionText, { color: action.priority === "high" ? "#ff9f9f" : theme.secondaryText }]}>
                        {action.text}
                      </Text>
                      {action.priority === "high" ? (
                        <View style={styles.liveWeatherActionPriority}>
                          <Text style={styles.liveWeatherActionPriorityText}>!</Text>
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 14, marginTop: 2 }}>
              <IconText label={t("liveWeather.allDoneForToday")} style={{
  color: "#5cff89",
  fontSize: 14,
  fontWeight: "900"
}} />
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4 }}>{t("liveWeather.freshActionsRefreshTomorrow")}</Text>
            </View>
          )}
        </View>
      ) : null}

    </View>
  );
})
