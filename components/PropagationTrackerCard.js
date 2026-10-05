import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import { getDaysSince, getTodayKey, tapHaptic } from "../core";
import { formatDate, useTranslation } from "../lib/i18n";
import { SkeletonSection } from "./Skeleton";
import { touchSlop } from "../lib/a11y";

export const PROPAGATION_STORAGE_KEY = "pp_propagation";

// `id` is what gets stored; `label` / `tip` are translation keys.
const METHODS = [
  { id: "water", emoji: "💧", label: "propagationText.methodWater", tip: "propagationText.tipWater" },
  { id: "cutting", emoji: "✂️", label: "propagationText.methodCutting", tip: "propagationText.tipCutting" },
  { id: "division", emoji: "🍴", label: "propagationText.methodDivision", tip: "propagationText.tipDivision" },
  { id: "leaf", emoji: "🍃", label: "propagationText.methodLeaf", tip: "propagationText.tipLeaf" },
];
const methodOf = (id) => METHODS.find((m) => m.id === id) || METHODS[0];

// Midday-to-midday via core — measuring from the current clock time meant a
// cutting taken yesterday still showed "0d" all morning.
const daysSince = (dateKey) => Math.max(0, getDaysSince(dateKey) ?? 0);

export const PropagationTrackerCard = memo(function PropagationTrackerCard({ theme }) {
  const { t } = useTranslation();
  const methodLabel = (m) => `${m.emoji} ${t(m.label)}`;
  const [items, setItems] = useState([]); // { id, name, method, date, rooted }
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [method, setMethod] = useState("cutting");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(PROPAGATION_STORAGE_KEY)
      .then((val) => {
        if (alive && val) { try { setItems(JSON.parse(val) || []); } catch (e) { /* ignore */ } }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setItems(next); AsyncStorage.setItem(PROPAGATION_STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };

  const add = () => {
    const n = name.trim();
    if (!n) return;
    tapHaptic("light");
    persist([{ id: Date.now().toString(), name: n, method, date: getTodayKey(), rooted: false }, ...items]);
    setName("");
  };
  const toggleRooted = (id) => { tapHaptic("light"); persist(items.map((i) => (i.id === id ? { ...i, rooted: !i.rooted } : i))); };
  const remove = (id) => { tapHaptic("light"); persist(items.filter((i) => i.id !== id)); };

  if (!loaded) {
    return <View style={{ marginTop: 2 }}><SkeletonSection lines={2} /></View>;
  }

  const rooting = items.filter((i) => !i.rooted).length;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("propagationText.intro")}
      </Text>

      {/* Add */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
        <TextInput
          value={name}
          onChangeText={setName}
          onSubmitEditing={add}
          placeholder={t("propagationText.namePlaceholder")}
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "700" }}
        />
        <Pressable onPress={add} accessibilityRole="button" accessibilityLabel={t("propagationText.addA11y")} style={{ backgroundColor: "#8effab", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {METHODS.map((m) => {
          const active = method === m.id;
          return (
            <Pressable key={m.id} onPress={() => setMethod(m.id)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: active ? "#8effab" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#8effab" : "rgba(255,255,255,0.12)" }}>
              <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{methodLabel(m)}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", fontStyle: "italic", marginTop: 8 }}>{t(methodOf(method).tip)}</Text>

      {/* List */}
      {items.length ? (
        <View style={{ gap: 6, marginTop: 14 }}>
          {items.map((i) => {
            const d = daysSince(i.date);
            return (
              <View key={i.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: i.rooted ? "rgba(92,255,137,0.08)" : "rgba(255,255,255,0.04)", borderRadius: 12, paddingVertical: 9, paddingHorizontal: 10, borderWidth: 1, borderColor: i.rooted ? "rgba(92,255,137,0.28)" : "rgba(255,255,255,0.08)" }}>
                <Pressable onPress={() => toggleRooted(i.id)} accessibilityRole="checkbox" accessibilityState={{ checked: i.rooted }} hitSlop={touchSlop(26)} style={{ width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: i.rooted ? "#5cff89" : "transparent", borderWidth: 2, borderColor: i.rooted ? "#5cff89" : "rgba(255,255,255,0.3)" }}>
                  {i.rooted ? <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>🌱</Text> : null}
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ color: theme.text, fontSize: 13, fontWeight: "800" }}>{i.name}</Text>
                  <Text style={{ color: i.rooted ? "#8effab" : theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 1 }}>
                    {methodLabel(methodOf(i.method))} · {i.rooted ? t("propagationText.rooted") : t("propagationText.day", { count: d })} · {formatDate(new Date(i.date + "T12:00:00"), { month: "short", day: "numeric" })}
                  </Text>
                </View>
                <Pressable onPress={() => remove(i.id)} hitSlop={touchSlop(13)} accessibilityRole="button" accessibilityLabel={t("common.delete")}>
                  <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "900" }}>✕</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : null}
      {rooting ? (
        <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 10, fontStyle: "italic" }}>
          {t("propagationText.stillRooting", { count: rooting })}
        </Text>
      ) : null}
    </View>
  );
});
