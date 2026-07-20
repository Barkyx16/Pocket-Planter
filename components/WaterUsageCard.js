import { memo } from "react";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { WATER_UNITS, getTodayKey, tapHaptic, toGallons } from "../core";

export const WaterUsageCard = memo(function WaterUsageCard({ theme, savedPlants, wateringAmounts, setWateringAmounts, onUndoToast }) {
  const [plant, setPlant] = useState("Garden");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("gal");
  const [showPanel, setShowPanel] = useState(false);

  const plantOptions = ["Garden", ...(savedPlants || [])];
  const log = wateringAmounts || [];

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const totalGal = log.reduce((sum, e) => sum + toGallons(e.amount, e.unit), 0);
  const weekGal = log
    .filter((e) => new Date(e.createdAt).getTime() >= weekAgo)
    .reduce((sum, e) => sum + toGallons(e.amount, e.unit), 0);

  // Thirstiest plant by total gallons.
  const byPlant = {};
  log.forEach((e) => {
    byPlant[e.plantName] = (byPlant[e.plantName] || 0) + toGallons(e.amount, e.unit);
  });
  const thirstiest = Object.entries(byPlant).sort((a, b) => b[1] - a[1])[0];

  const addEntry = () => {
    const n = parseFloat(amount);
    if (Number.isNaN(n) || n <= 0) {
      Alert.alert("Enter an amount", "Type how much you watered (e.g. 2).");
      return;
    }
    tapHaptic("light");
    const entry = {
      id: Date.now().toString(),
      plantName: plant,
      amount: n,
      unit,
      date: getTodayKey(),
      createdAt: new Date().toISOString(),
    };
    setWateringAmounts((current) => [entry, ...current]);
    setAmount("");
    setShowPanel(false);
  };

  const deleteEntry = (id) => {
    const removed = log.find((e) => e.id === id);
    if (!removed) return;
    tapHaptic("light");
    setWateringAmounts((current) => current.filter((e) => e.id !== id));
    if (onUndoToast) {
      onUndoToast("Watering entry deleted", () => {
        setWateringAmounts((current) => [removed, ...current].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ));
      });
    }
  };

  const fmtGal = (g) => (g >= 10 ? Math.round(g) : Math.round(g * 10) / 10);

return (
    <View>

      {/* STATS */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
        <View style={{ flex: 1, borderRadius: 18, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(107,199,255,0.10)", borderWidth: 1, borderColor: "rgba(107,199,255,0.24)" }}>
          <Text style={{ fontSize: 22 }}>📅</Text>
          <Text style={{ color: "#6bc7ff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{fmtGal(weekGal)}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>gal this week</Text>
        </View>
        <View style={{ flex: 1, borderRadius: 18, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
          <Text style={{ fontSize: 22 }}>💧</Text>
          <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{fmtGal(totalGal)}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>gal all-time</Text>
        </View>
      </View>

      {thirstiest && thirstiest[1] > 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 14, textAlign: "center" }}>
          💧 Thirstiest: <Text style={{ color: "#6bc7ff", fontWeight: "900" }}>{thirstiest[0]}</Text> (~{fmtGal(thirstiest[1])} gal)
        </Text>
      ) : null}

      {/* ADD BUTTON / PANEL */}
      {showPanel ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.20)" }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>WHICH PLANT?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {plantOptions.map((p) => {
              const active = plant === p;
              return (
                <Pressable key={p} onPress={() => setPlant(p)}
                  style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: active ? "#6bc7ff" : "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: active ? "#6bc7ff" : "rgba(255,255,255,0.10)" }}>
                  <Text style={{ color: active ? "#07120b" : "#ffffff", fontSize: 13, fontWeight: "800" }}>
                    {p === "Garden" ? "🌍 Whole Garden" : p}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginTop: 14, marginBottom: 8 }}>HOW MUCH?</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g. 2"
              placeholderTextColor="#8fbf9d"
              keyboardType="decimal-pad"
              style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.22)", color: "#ffffff", fontSize: 16, fontWeight: "800", paddingHorizontal: 16, paddingVertical: 12 }}
            />
            <View style={{ flexDirection: "row", gap: 6 }}>
              {WATER_UNITS.map((u) => {
                const active = unit === u.id;
                return (
                  <Pressable key={u.id} onPress={() => setUnit(u.id)}
                    style={{ borderRadius: 12, paddingHorizontal: 12, justifyContent: "center", backgroundColor: active ? "#6bc7ff" : "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: active ? "#6bc7ff" : "rgba(255,255,255,0.10)" }}>
                    <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{u.id}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable onPress={addEntry} style={{ marginTop: 12, backgroundColor: "#6bc7ff", borderRadius: 14, paddingVertical: 13, alignItems: "center" }}>
            <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>💧 Log Watering</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => setShowPanel(true)}
          style={{ marginTop: 16, backgroundColor: "#6bc7ff", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>＋ Log a Watering Amount</Text>
        </Pressable>
      )}

      {/* RECENT ENTRIES */}
      {log.length > 0 ? (
        <View style={{ gap: 8, marginTop: 16 }}>
          {log.slice(0, 6).map((e) => (
            <View key={e.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>
                  {e.plantName === "Garden" ? "🌍 Whole Garden" : e.plantName}
                </Text>
                <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                  {e.amount} {e.unit} · {new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Text>
              </View>
              <Pressable onPress={() => deleteEntry(e.id)} style={{ padding: 6 }}>
                <Text style={{ color: "#ff7b7b", fontSize: 15, fontWeight: "900" }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
})
