import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import { flipMonth, getMonthKey, tapHaptic } from "../core";
import { SkeletonSection } from "./Skeleton";

export const PRUNING_STORAGE_KEY = "pp_pruningDone";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Curated northern-hemisphere pruning windows (month numbers) with a short why.
// Localised for the southern hemisphere via flipMonth at render time.
const PRUNE_WINDOWS = {
  apple: { months: [1, 2], tip: "Prune when fully dormant to shape the tree and open the canopy." },
  pear: { months: [1, 2], tip: "Dormant-prune to remove crossing branches and encourage fruiting spurs." },
  fig: { months: [2], tip: "Prune late winter before new growth to control size." },
  grape: { months: [2, 3], tip: "Prune hard while dormant — grapes fruit on new wood." },
  blueberry: { months: [2, 3], tip: "Remove old, twiggy wood in late winter for bigger berries." },
  rose: { months: [3], tip: "Cut back to strong outward-facing buds as growth begins." },
  lemon: { months: [3, 4], tip: "Tidy citrus after the main harvest; remove deadwood." },
  orange: { months: [3, 4], tip: "Light-prune citrus in spring; thin crowded branches." },
  rosemary: { months: [4, 5], tip: "Trim lightly in spring — never cut into old bare wood." },
  thyme: { months: [4, 5], tip: "Shear back by a third in spring to keep it bushy." },
  sage: { months: [4, 5], tip: "Prune in spring to remove woody, leggy stems." },
  peach: { months: [6, 7], tip: "Prune stone fruit in summer to reduce disease risk." },
  plum: { months: [6, 7], tip: "Summer-prune stone fruit to avoid silver leaf infection." },
  cherry: { months: [6, 7], tip: "Prune after fruiting in dry weather to limit disease." },
  tomato: { months: [6, 7, 8], tip: "Pinch out side-shoots weekly on cordon (indeterminate) types." },
  basil: { months: [6, 7, 8, 9], tip: "Pinch the growing tips often to keep it bushy and delay flowering." },
  mint: { months: [6, 7, 8], tip: "Cut back regularly to force fresh, tender leaves." },
  raspberry: { months: [8, 9], tip: "Cut out canes that just fruited; tie in this year's new canes." },
  blackberry: { months: [8, 9], tip: "Remove fruited canes after harvest to make room for new growth." },
  lavender: { months: [8], tip: "Trim after flowering, staying above the woody base." },
};

const lc = (s) => String(s || "").toLowerCase();
function pruneFor(name) {
  const key = Object.keys(PRUNE_WINDOWS).find((k) => lc(name).includes(k));
  return key ? PRUNE_WINDOWS[key] : null;
}

export const PruningScheduleSection = memo(function PruningScheduleSection({ theme, savedPlants }) {
  const [done, setDone] = useState({}); // { monthKey: { plantName: true } }
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(PRUNING_STORAGE_KEY)
      .then((val) => {
        if (alive && val) { try { setDone(JSON.parse(val) || {}); } catch (e) { /* ignore */ } }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setDone(next); AsyncStorage.setItem(PRUNING_STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };

  const monthKey = getMonthKey();
  const currentMonth = new Date().getMonth() + 1;
  const checked = done[monthKey] || {};
  const toggle = (plant) => {
    tapHaptic("light");
    const month = { ...checked, [plant]: !checked[plant] };
    persist({ ...done, [monthKey]: month });
  };

  if (!loaded) {
    return (
      <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 18 }}>
        <SkeletonSection lines={2} />
      </View>
    );
  }

  // Match saved plants to pruning windows (localised).
  const matched = [];
  (savedPlants || []).forEach((name) => {
    const w = pruneFor(name);
    if (w) matched.push({ name, months: w.months.map(flipMonth), tip: w.tip });
  });

  const thisMonth = matched.filter((m) => m.months.includes(currentMonth));
  // Soonest upcoming pruning across the rest of the year (for a helpful hint).
  const upcoming = matched
    .map((m) => {
      const next = [...m.months].map((mo) => ((mo - currentMonth + 12) % 12)).filter((d) => d > 0).sort((a, b) => a - b)[0];
      return next != null ? { name: m.name, inMonths: next, month: ((currentMonth - 1 + next) % 12) + 1 } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.inMonths - b.inMonths)[0];

  return (
    <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 18 }}>
      <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        ✂️ PRUNING THIS MONTH
      </Text>

      {thisMonth.length ? (
        <View style={{ gap: 8, marginTop: 8 }}>
          {thisMonth.map((m) => {
            const isDone = !!checked[m.name];
            return (
              <Pressable
                key={m.name}
                onPress={() => toggle(m.name)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isDone }}
                style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: isDone ? "rgba(142,239,171,0.1)" : "rgba(255,255,255,0.05)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: isDone ? "rgba(142,239,171,0.3)" : "rgba(255,255,255,0.1)" }}
              >
                <View style={{ width: 24, height: 24, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 1, backgroundColor: isDone ? "#8effab" : "transparent", borderWidth: 2, borderColor: isDone ? "#8effab" : "rgba(255,255,255,0.3)" }}>
                  {isDone ? <Text style={{ color: "#0e2414", fontSize: 14, fontWeight: "900" }}>✓</Text> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: isDone ? theme.secondaryText : theme.text, fontSize: 14, fontWeight: "900", textDecorationLine: isDone ? "line-through" : "none" }}>{m.name}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", lineHeight: 16, marginTop: 2 }}>{m.tip}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 6 }}>
          {matched.length
            ? `Nothing to prune in ${MONTH_SHORT[currentMonth - 1]}.${upcoming ? ` Next: ${upcoming.name} in ${MONTH_SHORT[upcoming.month - 1]}.` : ""}`
            : "Save some fruit trees, berries, or herbs and their pruning windows will show up here."}
        </Text>
      )}
    </View>
  );
});
