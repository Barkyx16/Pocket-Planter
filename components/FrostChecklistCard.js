import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { COLD_THRESHOLD_F, FROST_TASKS, tapHaptic } from "../core";
import { useTranslation } from "../lib/i18n";

export const FrostChecklistCard = memo(function FrostChecklistCard({ theme, weather, frostChecklist, setFrostChecklist }) {
  const { t } = useTranslation();
  // Find the coldest low across today + next 2 forecast days
  const forecast = Array.isArray(weather?.forecast) ? weather.forecast : [];
  const window = forecast.slice(0, 3);
  const lows = window
    .map((d) => (typeof d?.minTempF === "number" ? d.minTempF : null))
    .filter((v) => v !== null);
  // Fall back to weather.minTempF if forecast lows are missing
  if (lows.length === 0 && typeof weather?.minTempF === "number") lows.push(weather.minTempF);

  const coldestF = lows.length ? Math.min(...lows) : null;
  if (coldestF == null || coldestF >= COLD_THRESHOLD_F) return null;

  const coldestC = Math.round(((coldestF - 32) * 5) / 9);
  const isTonight = typeof window[0]?.minTempF === "number" && window[0].minTempF < COLD_THRESHOLD_F;

  const toggle = (id) => {
    tapHaptic("light");
    setFrostChecklist((current) => ({ ...current, [id]: !current[id] }));
  };
  const doneCount = FROST_TASKS.filter((t) => frostChecklist[t.id]).length;
  const allDone = doneCount === FROST_TASKS.length;

  return (
    <View style={{ borderRadius: 24, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(163, 213, 255, 0.1)", borderColor: "#a3d5ff" }}>
     <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>❄️</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#a3d5ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>{t("frostChecklist.coldWeatherPrep")}</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {allDone ? t("frostChecklist.youreColdready") : `Protect your garden — cold ${isTonight ? "tonight" : "coming"}`}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {t("frostChecklist.lowOf")} {Math.round(coldestF)}{t("frostChecklist.f")}{coldestC}{t("frostChecklist.cExpectedCheckTheseOff")} {doneCount}/{FROST_TASKS.length} done.
      </Text>

      {/* progress bar */}
      <View style={{ height: 8, borderRadius: 999, backgroundColor: "rgba(255, 255, 255, 0.1)", marginTop: 12, overflow: "hidden" }}>
        <View style={{ height: 8, borderRadius: 999, backgroundColor: allDone ? "#5cff89" : "#a3d5ff", width: `${(doneCount / FROST_TASKS.length) * 100}%` }} />
      </View>

      <View style={{ gap: 8, marginTop: 14 }}>
        {FROST_TASKS.map((task) => {
          const checked = !!frostChecklist[task.id];
          return (
            <Pressable
              key={task.id}
              onPress={() => toggle(task.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: checked ? "rgba(92, 255, 137, 0.1)" : "rgba(255, 255, 255, 0.06)", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: checked ? "rgba(92, 255, 137, 0.3)" : "rgba(163, 213, 255, 0.16)" }}
            >
              <View style={{ width: 24, height: 24, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: checked ? "#5cff89" : "transparent", borderWidth: 2, borderColor: checked ? "#5cff89" : "rgba(255, 255, 255, 0.24)" }}>
                {checked ? <Text style={{ fontSize: 12, fontWeight: "900", color: "#07120b" }}>✓</Text> : null}
              </View>
              <Text style={{ fontSize: 18 }}>{task.icon}</Text>
              <Text style={{ color: checked ? theme.secondaryText : theme.text, fontSize: 12, fontWeight: "800", flex: 1, textDecorationLine: checked ? "line-through" : "none" }}>
                {task.text}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
})
