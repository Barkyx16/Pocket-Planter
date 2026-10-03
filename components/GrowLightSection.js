import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import { getDaysSince, getTodayKey, tapHaptic } from "../core";
import { SkeletonSection } from "./Skeleton";
import { touchSlop } from "../lib/a11y";
import { formatTime, t, useLanguage } from "../lib/i18n";

export const GROW_LIGHT_STORAGE_KEY = "pp_growLights";

const HOUR_OPTS = [12, 14, 16];
const ON_HOUR = 6; // suggested lights-on time

// Day 1 is the day the light went on. Counting from the current clock time
// instead of midday held the number back until noon each day.
const daysUnder = (startKey) => Math.max(1, (getDaysSince(startKey) ?? 0) + 1);
const offLabel = (hours) => {
  const off = (ON_HOUR + hours) % 24;
  // In the app language's clock: "6 AM–10 PM", or "06–22 Uhr" in German.
  const at = (h) => formatTime(new Date(2026, 0, 1, h, 0), { hour: "numeric" }) || `${h}:00`;
  return `${at(ON_HOUR)}–${at(off)}`;
};

export const GrowLightSection = memo(function GrowLightSection({ theme }) {
  useLanguage(); // memo() skips a language switch without this (see lib/i18n)
  const [trays, setTrays] = useState([]); // { id, name, hours, start }
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [hours, setHours] = useState(16);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(GROW_LIGHT_STORAGE_KEY)
      .then((val) => {
        if (alive && val) { try { setTrays(JSON.parse(val) || []); } catch (e) { /* ignore */ } }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setTrays(next); AsyncStorage.setItem(GROW_LIGHT_STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };

  const add = () => {
    const n = name.trim();
    if (!n) return;
    tapHaptic("light");
    persist([{ id: Date.now().toString(), name: n, hours, start: getTodayKey() }, ...trays]);
    setName(""); setHours(16);
  };
  const remove = (id) => { tapHaptic("light"); persist(trays.filter((tr) => tr.id !== id)); };

  if (!loaded) {
    return (
      <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
        <SkeletonSection lines={2} />
      </View>
    );
  }

  return (
    <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        {t("tools.growTitle")}
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        {t("tools.growIntro")}
      </Text>

      {/* Add tray */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <TextInput
          value={name}
          onChangeText={setName}
          onSubmitEditing={add}
          placeholder={t("tools.growPlaceholder")}
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, fontWeight: "700" }}
        />
        <Pressable onPress={add} accessibilityRole="button" accessibilityLabel={t("tools.growAddA11y")} style={{ backgroundColor: "#ffd86b", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
        {HOUR_OPTS.map((h) => {
          const active = hours === h;
          return (
            <Pressable key={h} onPress={() => setHours(h)} style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 10, backgroundColor: active ? "#ffd86b" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#ffd86b" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{t("tools.growHoursChip", { h })}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Trays */}
      {trays.length ? (
        <View style={{ gap: 6, marginTop: 12 }}>
          {trays.map((tr) => (
            <View key={tr.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, paddingVertical: 9, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}>
              <Text style={{ fontSize: 16 }}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ color: theme.text, fontSize: 13, fontWeight: "800" }}>{tr.name}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 1 }}>
                  {t("tools.growTrayLine", { day: daysUnder(tr.start), h: tr.hours, window: offLabel(tr.hours) })}
                </Text>
              </View>
              <Pressable onPress={() => remove(tr.id)} hitSlop={touchSlop(14)} accessibilityRole="button" accessibilityLabel={t("tools.growRemoveA11y")}>
                <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
});
