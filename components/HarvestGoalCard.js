import { memo } from "react";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { tapHaptic } from "../core";
import { useTranslation } from "../lib/i18n";

export const HarvestGoalCard = memo(function HarvestGoalCard({ theme, harvestLog, harvestGoal, setHarvestGoal }) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");

  // Count harvests logged since the goal was created
  const progress = harvestGoal
    ? (harvestLog || []).filter((h) => new Date(h.createdAt) >= new Date(harvestGoal.createdAt)).length
    : 0;
  const target = harvestGoal?.target || 0;
  const pct = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
  const done = target > 0 && progress >= target;

  const setGoal = () => {
    const n = parseInt(input, 10);
    if (!n || n < 1) {
      Alert.alert("Enter a number", "Set how many harvests you want to log this season (e.g. 20).");
      return;
    }
    tapHaptic("light");
    setHarvestGoal({ target: n, createdAt: new Date().toISOString() });
    setInput("");
  };

  const clearGoal = () => {
    Alert.alert("Clear goal?", "This removes your current harvest goal. Your harvest log stays.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => { setHarvestGoal(null); setInput(""); } },
    ]);
  };
if (!harvestGoal) {
    return (
      <View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t("harvestGoal.eg20")}
            placeholderTextColor="#8fbf9d"
            keyboardType="number-pad"
            style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255, 216, 107, 0.2)", color: "#ffffff", fontSize: 16, fontWeight: "800", paddingHorizontal: 16, paddingVertical: 14 }}
          />
          <Pressable onPress={setGoal} style={{ backgroundColor: "#ffd86b", borderRadius: 12, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#3d2c00", fontSize: 14, fontWeight: "900" }}>Set</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>
        {done ? t("harvestGoal.goalReached") : t("harvestGoal.yourSeasonGoal")}
      </Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {done
          ? `You hit your goal of ${target} harvests. Amazing season — set a new one to keep going.`
          : `${progress} of ${target} harvests logged. ${target - progress} to go!`}
      </Text>

      <View style={{ alignItems: "center", marginTop: 18 }}>
        <Text style={{ color: done ? "#5cff89" : "#ffd86b", fontSize: 40, fontWeight: "900" }}>{progress}<Text style={{ color: theme.secondaryText, fontSize: 20 }}> / {target}</Text></Text>
      </View>

      <View style={{ height: 12, borderRadius: 999, backgroundColor: "rgba(255, 255, 255, 0.1)", marginTop: 14, overflow: "hidden" }}>
        <View style={{ height: 12, borderRadius: 999, backgroundColor: done ? "#5cff89" : "#ffd86b", width: `${pct}%` }} />
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", textAlign: "center", marginTop: 8 }}>{pct}{t("harvestGoal.complete")}</Text>

      <Pressable onPress={clearGoal} style={{ marginTop: 16, alignItems: "center" }}>
        <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "800" }}>{done ? t("harvestGoal.setANewGoal") : t("harvestGoal.changeGoal")}</Text>
      </Pressable>
    </View>
  );
})
