import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import { getDaysSince, getTodayKey, tapHaptic } from "../core";
import { formatDate, useTranslation } from "../lib/i18n";
import { SkeletonSection } from "./Skeleton";

export const TOOL_MAINT_STORAGE_KEY = "pp_toolMaint";

// Recommended upkeep intervals (days). Keeps blades sharp and clean so plants
// get clean cuts and tools last for years.
const MAINT_ITEMS = [
  { id: "clean", labelKey: "toolCareText.itemClean", icon: "🧽", days: 30 },
  { id: "sharpen_pruners", labelKey: "toolCareText.itemSharpenPruners", icon: "✂️", days: 60 },
  { id: "oil", labelKey: "toolCareText.itemOil", icon: "🛢️", days: 90 },
  { id: "sharpen_shovel", labelKey: "toolCareText.itemSharpenShovel", icon: "🪏", days: 180 },
  { id: "mower", labelKey: "toolCareText.itemMower", icon: "🌀", days: 180 },
  { id: "hose", labelKey: "toolCareText.itemHose", icon: "💧", days: 365 },
];

// core's getDaysSince compares midday to midday; measuring from the current
// clock time instead made every count a day low until noon.
const daysSince = (dateKey) => getDaysSince(dateKey);

export const ToolMaintenanceSection = memo(function ToolMaintenanceSection({ theme, embedded }) {
  const { t, tn } = useTranslation();
  const [log, setLog] = useState({}); // { itemId: lastDoneDateKey }
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(TOOL_MAINT_STORAGE_KEY)
      .then((val) => {
        if (alive && val) { try { setLog(JSON.parse(val) || {}); } catch (e) { /* ignore */ } }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setLog(next); AsyncStorage.setItem(TOOL_MAINT_STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };
  const markDone = (id) => { tapHaptic("light"); persist({ ...log, [id]: getTodayKey() }); };

  if (!loaded) {
    return (
      <View style={embedded ? undefined : { marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
        <SkeletonSection lines={3} />
      </View>
    );
  }

  const rows = MAINT_ITEMS.map((item) => {
    const since = daysSince(log[item.id]);
    const due = since == null || since >= item.days;
    const left = since == null ? null : item.days - since;
    return { ...item, label: t(item.labelKey), since, due, left };
  });
  const dueCount = rows.filter((r) => r.due).length;

  return (
    <View style={embedded ? undefined : { marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        🔧 {t("toolCareText.title")}
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        {dueCount ? tn("toolCareText.tasksDue", dueCount) : t("toolCareText.allDone")}
      </Text>

      <View style={{ gap: 6, marginTop: 12 }}>
        {rows.map((r) => (
          <View key={r.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: r.due ? "rgba(255,159,67,0.08)" : "rgba(255,255,255,0.04)", borderRadius: 12, paddingVertical: 9, paddingHorizontal: 10, borderWidth: 1, borderColor: r.due ? "rgba(255,159,67,0.28)" : "rgba(255,255,255,0.06)" }}>
            <Text style={{ fontSize: 16 }}>{r.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: "800" }}>{r.label}</Text>
              <Text style={{ color: r.due ? "#ff9f43" : theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 1 }}>
                {r.since == null
                  ? tn("toolCareText.everyNotLogged", r.days)
                  : r.due
                  ? t("toolCareText.dueNow", { date: formatDate(new Date(log[r.id] + "T12:00:00"), { month: "short", day: "numeric" }) })
                  : tn("toolCareText.nextIn", r.left)}
              </Text>
            </View>
            <Pressable
              onPress={() => markDone(r.id)}
              accessibilityRole="button"
              accessibilityLabel={t("toolCareText.markDoneA11y", { task: r.label })}
              style={{ backgroundColor: r.due ? "#ffd86b" : "rgba(255,255,255,0.08)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 }}
            >
              <Text style={{ color: r.due ? "#07120b" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>{t("toolCareText.done")}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
});
