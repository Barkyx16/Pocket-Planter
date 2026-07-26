import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import { getTodayKey, tapHaptic } from "../core";
import { SkeletonSection } from "./Skeleton";

export const GROW_LIGHT_STORAGE_KEY = "pp_growLights";

const HOUR_OPTS = [12, 14, 16];
const ON_HOUR = 6; // suggested lights-on time

function daysUnder(startKey) {
  const then = new Date(startKey + "T12:00:00").getTime();
  return Math.max(1, Math.floor((Date.now() - then) / 86400000) + 1);
}
const offLabel = (hours) => {
  const off = (ON_HOUR + hours) % 24;
  const ampm = (h) => `${((h + 11) % 12) + 1}${h < 12 ? "am" : "pm"}`;
  return `${ampm(ON_HOUR)}–${ampm(off)}`;
};

export const GrowLightSection = memo(function GrowLightSection({ theme }) {
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
        💡 GROW-LIGHT SCHEDULE
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Seedlings want 14–16 h of light a day, 2–3″ above the leaves. Track each tray's schedule here.
      </Text>

      {/* Add tray */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <TextInput
          value={name}
          onChangeText={setName}
          onSubmitEditing={add}
          placeholder="Tray / shelf name"
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, fontWeight: "700" }}
        />
        <Pressable onPress={add} accessibilityRole="button" accessibilityLabel="Add grow-light tray" style={{ backgroundColor: "#ffd86b", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
        {HOUR_OPTS.map((h) => {
          const active = hours === h;
          return (
            <Pressable key={h} onPress={() => setHours(h)} style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 10, backgroundColor: active ? "#ffd86b" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#ffd86b" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{h}h/day</Text>
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
                  Day {daysUnder(tr.start)} · {tr.hours}h/day · {offLabel(tr.hours)}
                </Text>
              </View>
              <Pressable onPress={() => remove(tr.id)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Remove tray">
                <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
});
