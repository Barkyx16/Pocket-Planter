import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import { getTodayKey, tapHaptic } from "../core";
import { SkeletonSection } from "./Skeleton";

export const VASE_STORAGE_KEY = "pp_vases";
const LIFE_OPTS = [5, 7, 10, 14];

function daysSince(dateKey) {
  return Math.floor((Date.now() - new Date(dateKey + "T12:00:00").getTime()) / 86400000);
}

export const VaseTrackerSection = memo(function VaseTrackerSection({ theme }) {
  const [vases, setVases] = useState([]); // { id, name, date, days }
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [days, setDays] = useState(7);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(VASE_STORAGE_KEY)
      .then((val) => { if (alive && val) { try { setVases(JSON.parse(val) || []); } catch (e) { /* ignore */ } } if (alive) setLoaded(true); })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setVases(next); AsyncStorage.setItem(VASE_STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };
  const add = () => {
    const n = name.trim() || "Bouquet";
    tapHaptic("light");
    persist([{ id: Date.now().toString(), name: n, date: getTodayKey(), days }, ...vases]);
    setName(""); setDays(7);
  };
  const remove = (id) => { tapHaptic("light"); persist(vases.filter((v) => v.id !== id)); };

  if (!loaded) return <View style={{ marginTop: 2 }}><SkeletonSection lines={1} /></View>;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Started a fresh vase? Track how many days it has left.
      </Text>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <TextInput value={name} onChangeText={setName} onSubmitEditing={add} placeholder="Vase / bouquet name" placeholderTextColor="#8fbf9d" style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, fontWeight: "700" }} />
        <Pressable onPress={add} accessibilityRole="button" accessibilityLabel="Add vase" style={{ backgroundColor: "#ffb6c1", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
        {LIFE_OPTS.map((d) => {
          const active = days === d;
          return (
            <Pressable key={d} onPress={() => setDays(d)} style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 10, backgroundColor: active ? "#ffb6c1" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#ffb6c1" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{d}d</Text>
            </Pressable>
          );
        })}
      </View>

      {vases.length ? (
        <View style={{ gap: 6, marginTop: 12 }}>
          {vases.map((v) => {
            const elapsed = daysSince(v.date);
            const left = v.days - elapsed;
            const pct = Math.max(0, Math.min(100, (left / v.days) * 100));
            const color = left <= 0 ? "#ff7b7b" : left <= 2 ? "#ffd86b" : "#ffb6c1";
            return (
              <View key={v.id} style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: 15 }}>🏺</Text>
                  <Text style={{ flex: 1, color: theme.text, fontSize: 13, fontWeight: "800" }} numberOfLines={1}>{v.name}</Text>
                  <Text style={{ color, fontSize: 12, fontWeight: "900" }}>{left <= 0 ? "past its best" : `${left} day${left === 1 ? "" : "s"} left`}</Text>
                  <Pressable onPress={() => remove(v.id)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Remove vase"><Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "900" }}>✕</Text></Pressable>
                </View>
                <View style={{ height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 8 }}>
                  <View style={{ height: 5, borderRadius: 3, width: `${pct}%`, backgroundColor: color }} />
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
});
