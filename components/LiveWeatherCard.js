import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { EXTREME_HEAT_THRESHOLD_F, FROST_THRESHOLD_F, WARM_DAY_THRESHOLD_F, formatTemp, getTodayKey, isHarvestReady, isWaterDue, tapHaptic } from "../core";
import produceData from "../data/produceData";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const LiveWeatherCard = memo(function LiveWeatherCard({ theme, weather, recommendation, savedPlants, wateredPlants, wateringHistory, harvestTrackers, unitSystem }) {
  const { t, tn } = useTranslation();
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

  // Due by each plant's schedule, the rule every other "need water" count uses.
  const unwateredCount = (savedPlants || []).filter((p) => isWaterDue(p, produceData.find((item) => item.name === p), wateredPlants, wateringHistory, weather)).length;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, tracker]) => isHarvestReady(tracker)).length;

  const getConditionDetails = () => {
    if (!weather) return { icon: "🌤️", label: t("ui7.wLoading"), color: "#8effab", urgency: null };
    if (weather.minTempF <= FROST_THRESHOLD_F) return { icon: "❄️", label: t("ui7.wFrost"), color: "#6bc7ff", urgency: "high" };
    if (weather.maxTempF >= EXTREME_HEAT_THRESHOLD_F) return { icon: "🔥", label: t("ui7.wExtreme"), color: "#ff7b7b", urgency: "high" };
    if (weather.maxTempF >= WARM_DAY_THRESHOLD_F) return { icon: "☀️", label: t("ui7.wHot"), color: "#ff7b7b", urgency: "medium" };
    if (weather.precipChance >= 70) return { icon: "🌧️", label: t("ui7.wHeavyRain"), color: "#6bc7ff", urgency: "medium" };
    if (weather.precipChance >= 40) return { icon: "🌦️", label: t("ui7.wPossibleRain"), color: "#8effab", urgency: null };
    if (weather.maxTempF >= 65 && weather.maxTempF <= 85) return { icon: "✅", label: t("ui7.wPerfect"), color: "#5cff89", urgency: null };
    return { icon: "🌤️", label: t("ui7.wMild"), color: "#8effab", urgency: null };
  };

  const getSmartActions = () => {
    const actions = [];
    if (!weather) return actions;

    if (weather.minTempF <= FROST_THRESHOLD_F) {
      actions.push({ id: "frost-indoors", icon: "🏠", text: t("ui3.frostIndoors"), priority: "high" });
      actions.push({ id: "frost-cover", icon: "🧣", text: t("ui3.frostCover"), priority: "high" });
    }
    if (weather.maxTempF >= EXTREME_HEAT_THRESHOLD_F) {
      actions.push({ id: "heat-shade", icon: "🌿", text: t("ui3.heatShade"), priority: "high" });
      actions.push({ id: "heat-skip-transplant", icon: "🚫", text: t("ui3.heatSkip"), priority: "medium" });
    } else if (weather.maxTempF >= WARM_DAY_THRESHOLD_F) {
      actions.push({ id: "warm-mulch", icon: "🪵", text: t("ui3.warmMulch"), priority: "medium" });
    }
    if (weather.precipChance >= 70) {
      actions.push({ id: "rain-skip-water", icon: "🌧️", text: t("ui3.rainSkip"), priority: "medium" });
      actions.push({ id: "rain-drainage", icon: "🪣", text: t("ui3.rainDrainage"), priority: "low" });
    } else if (weather.precipChance >= 40) {
      actions.push({ id: "rain-check-soil", icon: "🌱", text: t("ui3.rainCheckSoil"), priority: "low" });
    }
    if (unwateredCount > 0 && weather.precipChance < 40) {
      actions.push({ id: "water-remaining", icon: "💧", text: tn("liveWeather.stillNeedWater", unwateredCount), priority: weather.maxTempF >= WARM_DAY_THRESHOLD_F ? "high" : "medium" });
    }
    if (harvestsReady > 0) {
      actions.push({ id: "harvest-ready", icon: "🎉", text: tn("counts.liveHarvest", harvestsReady), priority: "high" });
    }
    if (weather.maxTempF >= 65 && weather.maxTempF <= 82 && weather.precipChance < 30) {
      actions.push({ id: "ideal-sow", icon: "🌱", text: t("ui3.idealSow"), priority: "low" });
    }
    if (currentHour >= 6 && currentHour <= 9 && weather.maxTempF >= 70) {
      actions.push({ id: "morning-window", icon: "🌅", text: t("ui3.morningWindow"), priority: "low" });
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
          <Text style={styles.liveWeatherLabel}>{t("stats.high")}</Text>
          <Text style={[styles.liveWeatherValue, { color: weather ? getTempColor(weather.maxTempF) : "#ffffff" }]}>
            {weather ? formatTemp(weather.maxTempF, unitSystem) : "—"}
          </Text>
        </View>
        <View style={[styles.liveWeatherBox, { borderColor: weather ? `${getTempColor(weather.minTempF)}30` : "rgba(255, 255, 255, 0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>🌙</Text>
          <Text style={styles.liveWeatherLabel}>{t("stats.low")}</Text>
          <Text style={[styles.liveWeatherValue, { color: weather ? getTempColor(weather.minTempF) : "#ffffff" }]}>
            {weather ? formatTemp(weather.minTempF, unitSystem) : "—"}
          </Text>
        </View>
        <View style={[styles.liveWeatherBox, { borderColor: weather?.precipChance >= 70 ? "rgba(107, 199, 255, 0.3)" : "rgba(255, 255, 255, 0.08)" }]}>
          <Text style={styles.liveWeatherIcon}>🌧️</Text>
          <Text style={styles.liveWeatherLabel}>{t("stats.rain")}</Text>
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
                      accessibilityLabel={t("extra.markComplete", { action: action.text })}
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
