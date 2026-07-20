import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import { getTodayKey, tapHaptic } from "../core";

const STORAGE_KEY = "pp_soilTests";

const phAdvice = (ph) => {
  if (ph == null || Number.isNaN(ph)) return null;
  if (ph < 6.0) return { color: "#ff9f43", text: "Acidic — add garden lime or wood ash to raise pH toward 6.5." };
  if (ph > 7.5) return { color: "#6bc7ff", text: "Alkaline — add elemental sulfur, peat, or compost to lower pH." };
  return { color: "#5cff89", text: "Ideal range (6.0–7.5) for most vegetables. Nice soil!" };
};

export const SoilTestLogCard = memo(function SoilTestLogCard({ theme }) {
  const [tests, setTests] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [ph, setPh] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) { try { setTests(JSON.parse(val) || []); } catch (e) { /* ignore */ } }
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => {
    setTests(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const addTest = () => {
    const phNum = parseFloat(ph);
    if (Number.isNaN(phNum)) return;
    tapHaptic("light");
    persist([{ id: Date.now().toString(), date: getTodayKey(), ph: phNum, note: note.trim() }, ...tests]);
    setPh(""); setNote("");
  };

  const removeTest = (id) => { tapHaptic("light"); persist(tests.filter((t) => t.id !== id)); };

  if (!loaded) return null;

  const latest = tests[0];
  const advice = latest ? phAdvice(latest.ph) : null;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Log soil pH readings over time and get amendment tips. Test kits are cheap and pH drives how well plants absorb nutrients.
      </Text>

      {/* LATEST + ADVICE */}
      {latest ? (
        <View style={{ marginTop: 14, backgroundColor: `${advice?.color || "#5cff89"}14`, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: `${advice?.color || "#5cff89"}33` }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ color: advice?.color, fontSize: 26, fontWeight: "900" }}>pH {latest.ph}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 11.5, fontWeight: "700" }}>Latest reading</Text>
          </View>
          {advice ? <Text style={{ color: theme.secondaryText, fontSize: 12.5, fontWeight: "700", lineHeight: 18, marginTop: 6 }}>{advice.text}</Text> : null}
        </View>
      ) : null}

      {/* ADD */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <TextInput
          value={ph}
          onChangeText={setPh}
          keyboardType="decimal-pad"
          placeholder="pH (e.g. 6.5)"
          placeholderTextColor="#8fbf9d"
          style={{ width: 110, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "700" }}
        />
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Bed / note (optional)"
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "700" }}
        />
        <Pressable onPress={addTest} style={{ backgroundColor: "#5cff89", borderRadius: 12, paddingHorizontal: 15, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>

      {/* HISTORY */}
      {tests.length > 1 ? (
        <View style={{ gap: 6, marginTop: 12 }}>
          {tests.slice(1, 6).map((t) => (
            <View key={t.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 10, paddingVertical: 7, paddingHorizontal: 10 }}>
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: "900", width: 54 }}>pH {t.ph}</Text>
              <Text style={{ flex: 1, color: theme.secondaryText, fontSize: 12, fontWeight: "700" }} numberOfLines={1}>
                {new Date(t.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}{t.note ? ` · ${t.note}` : ""}
              </Text>
              <Pressable onPress={() => removeTest(t.id)} hitSlop={8}><Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>✕</Text></Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
})
