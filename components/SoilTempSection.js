import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import { getTodayKey, tapHaptic } from "../core";
import { formatDate } from "../lib/i18n";
import { SkeletonSection } from "./Skeleton";

export const SOIL_TEMP_STORAGE_KEY = "pp_soilTempLog";

// Minimum soil temperature (°F) at which each crop germinates reliably. This is
// what actually governs sowing — air frost dates only tell half the story.
const SOW_GATES = [
  { temp: 40, crops: ["Peas", "Spinach", "Lettuce", "Radish"] },
  { temp: 45, crops: ["Onion", "Beet", "Carrot", "Chard", "Broccoli"] },
  { temp: 50, crops: ["Cabbage", "Kale", "Parsnip"] },
  { temp: 60, crops: ["Bean", "Corn", "Cucumber"] },
  { temp: 65, crops: ["Tomato", "Pepper", "Squash"] },
  { temp: 70, crops: ["Melon", "Okra", "Eggplant"] },
];

const toC = (f) => Math.round(((f - 32) * 5) / 9);
const cToF = (c) => (c * 9) / 5 + 32;

export const SoilTempSection = memo(function SoilTempSection({ theme }) {
  const [data, setData] = useState({ unit: "F", readings: [] }); // readings: {id,date,tempF}
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(SOIL_TEMP_STORAGE_KEY)
      .then((val) => {
        if (alive && val) {
          try {
            const p = JSON.parse(val);
            if (p && Array.isArray(p.readings)) setData({ unit: p.unit === "C" ? "C" : "F", readings: p.readings });
          } catch (e) { /* ignore */ }
        }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => {
    setData(next);
    AsyncStorage.setItem(SOIL_TEMP_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const metric = data.unit === "C";
  const disp = (f) => (metric ? toC(f) : Math.round(f));
  const unitLabel = metric ? "°C" : "°F";

  const add = () => {
    const n = parseFloat(draft);
    if (Number.isNaN(n)) return;
    tapHaptic("light");
    const tempF = metric ? cToF(n) : n;
    persist({ ...data, readings: [{ id: Date.now().toString(), date: getTodayKey(), tempF }, ...data.readings] });
    setDraft("");
  };
  const remove = (id) => { tapHaptic("light"); persist({ ...data, readings: data.readings.filter((r) => r.id !== id) }); };
  const setUnit = (u) => { tapHaptic("light"); persist({ ...data, unit: u }); };

  if (!loaded) {
    return (
      <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
        <SkeletonSection lines={2} />
      </View>
    );
  }

  const latest = data.readings[0];
  const tempF = latest ? latest.tempF : null;
  const ready = tempF != null ? SOW_GATES.filter((g) => tempF >= g.temp).flatMap((g) => g.crops) : [];
  const nextGate = tempF != null ? SOW_GATES.find((g) => tempF < g.temp) : null;
  const tempColor = tempF == null ? theme.secondaryText : tempF >= 60 ? "#8effab" : tempF >= 45 ? "#ffd86b" : "#6bc7ff";

  return (
    <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.8 }}>🌡️ SOIL TEMPERATURE</Text>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {["F", "C"].map((u) => (
            <Pressable key={u} onPress={() => setUnit(u)} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: data.unit === u ? "#6bc7ff" : "rgba(255,255,255,0.06)" }}>
              <Text style={{ color: data.unit === u ? "#07120b" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>°{u}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Push a thermometer 2–3″ into the bed mid-morning and log it — it tells you what's actually safe to sow.
      </Text>

      {latest ? (
        <View style={{ marginTop: 12, backgroundColor: `${tempColor}14`, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: `${tempColor}33` }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: tempColor, fontSize: 24, fontWeight: "900" }}>{disp(tempF)}{unitLabel}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>latest soil temp</Text>
          </View>
          {ready.length ? (
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 6 }}>
              ✅ Warm enough to sow: <Text style={{ color: tempColor, fontWeight: "900" }}>{ready.slice(0, 8).join(", ")}</Text>
            </Text>
          ) : (
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 6 }}>Still cold — wait for it to warm before direct sowing.</Text>
          )}
          {nextGate ? (
            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 4 }}>
              At {disp(nextGate.temp)}{unitLabel}: {nextGate.crops.slice(0, 3).join(", ")} unlock.
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <TextInput
          value={draft}
          onChangeText={(txt) => setDraft(txt.replace(/[^0-9.]/g, ""))}
          onSubmitEditing={add}
          keyboardType="decimal-pad"
          placeholder={`Soil temp (${unitLabel})`}
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "700" }}
        />
        <Pressable onPress={add} accessibilityRole="button" accessibilityLabel="Add soil temperature reading" style={{ backgroundColor: "#6bc7ff", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>

      {data.readings.length > 1 ? (
        <View style={{ gap: 6, marginTop: 12 }}>
          {data.readings.slice(1, 6).map((r) => (
            <View key={r.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10 }}>
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: "900", width: 54 }}>{disp(r.tempF)}{unitLabel}</Text>
              <Text style={{ flex: 1, color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>
                {formatDate(new Date(r.date + "T12:00:00"), { month: "short", day: "numeric" })}
              </Text>
              <Pressable onPress={() => remove(r.id)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Remove reading">
                <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
});
