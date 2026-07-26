import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import { getTodayKey, tapHaptic } from "../core";
import { formatDate } from "../lib/i18n";
import { SkeletonSection } from "./Skeleton";

export const TOOL_MAINT_STORAGE_KEY = "pp_toolMaint";

// Recommended upkeep intervals (days). Keeps blades sharp and clean so plants
// get clean cuts and tools last for years.
const MAINT_ITEMS = [
  { id: "clean", label: "Clean & disinfect blades", icon: "🧽", days: 30 },
  { id: "sharpen_pruners", label: "Sharpen pruners", icon: "✂️", days: 60 },
  { id: "oil", label: "Oil handles & hinges", icon: "🛢️", days: 90 },
  { id: "sharpen_shovel", label: "Sharpen shovel / hoe edge", icon: "🪏", days: 180 },
  { id: "mower", label: "Sharpen mower blade", icon: "🌀", days: 180 },
  { id: "hose", label: "Drain & store hose", icon: "💧", days: 365 },
];

function daysSince(dateKey) {
  if (!dateKey) return null;
  const then = new Date(dateKey + "T12:00:00").getTime();
  return Math.floor((Date.now() - then) / 86400000);
}

export const ToolMaintenanceSection = memo(function ToolMaintenanceSection({ theme, embedded }) {
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
    return { ...item, since, due, left };
  });
  const dueCount = rows.filter((r) => r.due).length;

  return (
    <View style={embedded ? undefined : { marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        🔧 TOOL MAINTENANCE
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        {dueCount ? `${dueCount} task${dueCount === 1 ? "" : "s"} due — keep your tools sharp and clean.` : "All tools cared for. Nice. 🛠️"}
      </Text>

      <View style={{ gap: 6, marginTop: 12 }}>
        {rows.map((r) => (
          <View key={r.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: r.due ? "rgba(255,159,67,0.08)" : "rgba(255,255,255,0.04)", borderRadius: 12, paddingVertical: 9, paddingHorizontal: 10, borderWidth: 1, borderColor: r.due ? "rgba(255,159,67,0.28)" : "rgba(255,255,255,0.06)" }}>
            <Text style={{ fontSize: 16 }}>{r.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: "800" }}>{r.label}</Text>
              <Text style={{ color: r.due ? "#ff9f43" : theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 1 }}>
                {r.since == null
                  ? `Every ${r.days} days · not logged yet`
                  : r.due
                  ? `Due now · last done ${formatDate(new Date(log[r.id] + "T12:00:00"), { month: "short", day: "numeric" })}`
                  : `Next in ${r.left} day${r.left === 1 ? "" : "s"}`}
              </Text>
            </View>
            <Pressable
              onPress={() => markDone(r.id)}
              accessibilityRole="button"
              accessibilityLabel={`Mark ${r.label} done`}
              style={{ backgroundColor: r.due ? "#ffd86b" : "rgba(255,255,255,0.08)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 }}
            >
              <Text style={{ color: r.due ? "#07120b" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>Done</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
});
