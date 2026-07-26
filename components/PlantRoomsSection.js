import { memo, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { normalizeType, tapHaptic } from "../core";
import { SkeletonSection } from "./Skeleton";

export const PLANT_ROOMS_STORAGE_KEY = "pp_plantRooms";
const SUGGESTIONS = ["Living Room", "Bedroom", "Bathroom", "Kitchen", "Office"];

export const PlantRoomsSection = memo(function PlantRoomsSection({ theme, savedPlants }) {
  const [data, setData] = useState({ rooms: [], assign: {} }); // assign: { plantName: room }
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(PLANT_ROOMS_STORAGE_KEY)
      .then((val) => {
        if (alive && val) { try { const p = JSON.parse(val); if (p && p.assign) setData({ rooms: p.rooms || [], assign: p.assign || {} }); } catch (e) { /* ignore */ } }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setData(next); AsyncStorage.setItem(PLANT_ROOMS_STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };

  const houseplants = useMemo(
    () => (savedPlants || []).map((n) => produceData.find((p) => p.name === n)).filter((p) => p && normalizeType(p.type, p.name) === "Houseplants"),
    [savedPlants]
  );

  const addRoom = (name) => {
    const n = (name || "").trim();
    if (!n || data.rooms.some((r) => r.toLowerCase() === n.toLowerCase())) { setDraft(""); return; }
    tapHaptic("light");
    persist({ ...data, rooms: [...data.rooms, n] });
    setDraft("");
  };
  const assign = (plant, room) => { tapHaptic("light"); persist({ ...data, assign: { ...data.assign, [plant]: room } }); };

  if (!loaded) return <View style={{ marginTop: 2 }}><SkeletonSection lines={2} /></View>;

  const rooms = data.rooms.length ? data.rooms : [];
  const countFor = (room) => houseplants.filter((h) => data.assign[h.name] === room).length;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Keep track of which houseplant lives in which room.
      </Text>

      {/* Add room */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={() => addRoom(draft)} placeholder="Add a room" placeholderTextColor="#8fbf9d" style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, fontWeight: "700" }} />
        <Pressable onPress={() => addRoom(draft)} accessibilityRole="button" accessibilityLabel="Add room" style={{ backgroundColor: "#8effab", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>
      {!rooms.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {SUGGESTIONS.map((s) => (
            <Pressable key={s} onPress={() => addRoom(s)} style={{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
              <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800" }}>+ {s}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {rooms.map((r) => (
            <View key={r} style={{ flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "rgba(142,255,171,0.12)", borderWidth: 1, borderColor: "rgba(142,255,171,0.28)" }}>
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>🏠 {r} · {countFor(r)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Assign houseplants */}
      {houseplants.length && rooms.length ? (
        <View style={{ gap: 8, marginTop: 14 }}>
          {houseplants.map((h) => (
            <View key={h.name} style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}>
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800", marginBottom: 6 }}>🪴 {h.name}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {[{ label: "None", value: null }, ...rooms.map((r) => ({ label: r, value: r }))].map((opt) => {
                  const active = (data.assign[h.name] || null) === opt.value;
                  return (
                    <Pressable key={opt.label} onPress={() => assign(h.name, opt.value)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: active ? "#8effab" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#8effab" : "rgba(255,255,255,0.12)" }}>
                      <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>{opt.label}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ))}
        </View>
      ) : houseplants.length ? (
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", fontStyle: "italic", marginTop: 12 }}>Add a room above to start assigning your houseplants.</Text>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", fontStyle: "italic", marginTop: 12 }}>Save some houseplants to organize them by room.</Text>
      )}
    </View>
  );
});
