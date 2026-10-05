import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import { careWindowKey, flipMonth, getMonthKey, tapHaptic } from "../core";
import { SkeletonSection } from "./Skeleton";
import { formatDate, getLocale, useTranslation } from "../lib/i18n";

export const PRUNING_STORAGE_KEY = "pp_pruningDone";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// English keeps its familiar three-letter months; other languages get Intl's.
function monthShort(month) {
  if (getLocale() === "en") return MONTH_SHORT[month - 1];
  return formatDate(new Date(2000, month - 1, 1), { month: "short" }) || MONTH_SHORT[month - 1];
}

// Curated northern-hemisphere pruning windows (month numbers) with a short why.
// Localised for the southern hemisphere via flipMonth at render time. `tip` is a
// translation key, resolved at render.
const PRUNE_WINDOWS = {
  apple: { months: [1, 2], tip: "pruningText.tipDormantShape" },
  // Compound names do not contain their base word as far as whole-word matching
  // is concerned, so the true relatives have to be listed in their own right.
  // Without these, Crabapple, Peppermint and Spearmint showed no pruning window.
  crabapple: { months: [1, 2], tip: "pruningText.tipDormantShape" },
  pear: { months: [1, 2], tip: "pruningText.tipPear" },
  fig: { months: [2], tip: "pruningText.tipFig" },
  grape: { months: [2, 3], tip: "pruningText.tipGrape" },
  blueberry: { months: [2, 3], tip: "pruningText.tipBlueberry" },
  rose: { months: [3], tip: "pruningText.tipRose" },
  lemon: { months: [3, 4], tip: "pruningText.tipLemon" },
  orange: { months: [3, 4], tip: "pruningText.tipOrange" },
  rosemary: { months: [4, 5], tip: "pruningText.tipRosemary" },
  thyme: { months: [4, 5], tip: "pruningText.tipThyme" },
  sage: { months: [4, 5], tip: "pruningText.tipSage" },
  peach: { months: [6, 7], tip: "pruningText.tipPeach" },
  plum: { months: [6, 7], tip: "pruningText.tipPlum" },
  cherry: { months: [6, 7], tip: "pruningText.tipCherry" },
  tomato: { months: [6, 7, 8], tip: "pruningText.tipTomato" },
  basil: { months: [6, 7, 8, 9], tip: "pruningText.tipBasil" },
  mint: { months: [6, 7, 8], tip: "pruningText.tipMint" },
  peppermint: { months: [6, 7, 8], tip: "pruningText.tipMint" },
  spearmint: { months: [6, 7, 8], tip: "pruningText.tipMint" },
  raspberry: { months: [8, 9], tip: "pruningText.tipRaspberry" },
  blackberry: { months: [8, 9], tip: "pruningText.tipBlackberry" },
  lavender: { months: [8], tip: "pruningText.tipLavender" },
};

function pruneFor(name) {
  const key = careWindowKey(name, Object.keys(PRUNE_WINDOWS));
  return key ? PRUNE_WINDOWS[key] : null;
}

export const PruningScheduleSection = memo(function PruningScheduleSection({ theme, savedPlants }) {
  const { t } = useTranslation();
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
        ✂️ {t("pruningText.title")}
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
                  <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", lineHeight: 16, marginTop: 2 }}>{t(m.tip)}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 6 }}>
          {matched.length
            ? t("pruningText.nothingThisMonth", { month: monthShort(currentMonth) }) +
              (upcoming ? ` ${t("pruningText.nextUp", { plant: upcoming.name, month: monthShort(upcoming.month) })}` : "")
            : t("pruningText.empty")}
        </Text>
      )}
    </View>
  );
});
