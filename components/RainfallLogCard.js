import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import { formatLength, getDateKey, getTodayKey, tapHaptic } from "../core";
import { useTranslation } from "../lib/i18n";
import { RainBarrelSection } from "./RainBarrelSection";

const STORAGE_KEY = "pp_rainfallLog";

export const RainfallLogCard = memo(function RainfallLogCard({ theme, weather, unitSystem }) {
  const { t } = useTranslation();
  const [log, setLog] = useState({}); // { dateKey: inches }
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) { try { setLog(JSON.parse(val) || {}); } catch (e) { /* ignore */ } }
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setLog(next); AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };
  const today = getTodayKey();
  const addRain = (inches) => {
    tapHaptic("light");
    persist({ ...log, [today]: Math.round(((log[today] || 0) + inches) * 100) / 100 });
  };
  const clearToday = () => { const next = { ...log }; delete next[today]; persist(next); };

  // Last 7 days total.
  let weekTotal = 0;
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    weekTotal += log[key] || 0;
  }
  weekTotal = Math.round(weekTotal * 100) / 100;

  if (!loaded) return null;

  const advice = weekTotal >= 1
    ? { color: "#5cff89", text: "Your garden's had plenty of rain this week — most established plants can skip watering. Check the soil first." }
    : weekTotal >= 0.4
    ? { color: "#8effab", text: "A decent soaking this week. Water only the thirstiest plants and containers." }
    : { color: "#ffd86b", text: "Dry week so far — keep up with your normal watering, especially seedlings and pots." };

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("rainfallLog.trackRainfallSoYouDont")}
      </Text>

      <View style={{ alignItems: "center", marginTop: 14, backgroundColor: `${advice.color}14`, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${advice.color}33` }}>
        <Text style={{ color: advice.color, fontSize: 32, fontWeight: "900" }}>{formatLength(weekTotal, unitSystem)}</Text>
        <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800" }}>{t("rainfallLog.rainThisWeek")}</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 6, textAlign: "center" }}>{advice.text}</Text>
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 14, marginBottom: 6 }}>
        {t("rainfallLog.logTodaysRain")}{log[today] ? ` · ${formatLength(log[today], unitSystem)} so far` : ""}
      </Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[0.1, 0.25, 0.5, 1].map((v) => (
          <Pressable key={v} onPress={() => addRain(v)} style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, backgroundColor: "rgba(107, 199, 255, 0.12)", borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.24)" }}>
            <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900" }}>{unitSystem === "metric" ? `+${Math.round(v * 25.4)}mm` : `+${v}″`}</Text>
          </Pressable>
        ))}
        {log[today] ? (
          <Pressable onPress={clearToday} style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: 12, borderRadius: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.12)" }}>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "900" }}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      {weather?.precipChance >= 50 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 10, fontStyle: "italic" }}>
          🌧️ {Math.round(weather.precipChance)}{t("rainfallLog.rainChanceTodayRememberTo")}
        </Text>
      ) : null}

      {/* Rain barrel / water-storage tracker */}
      <RainBarrelSection theme={theme} unitSystem={unitSystem} />
    </View>
  );
})
