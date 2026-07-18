import { Linking, Pressable, Share, Text, View } from "react-native";
import { tapHaptic } from "../core";

export function GardenShoppingListCard({ theme, gardenAreas, zip }) {
  const plantNames = Array.from(new Set(
    (gardenAreas || []).flatMap((a) => Object.values(a.plots || {}).filter(Boolean))
  ));
  if (!plantNames.length) return null;

  const shareList = async () => {
    try {
      tapHaptic("light");
      const lines = [
        "🛒 My Pocket Planter shopping list:",
        "",
        ...plantNames.map((n) => `• ${n} seeds`),
        "• Compost / potting mix",
        "• Balanced fertilizer",
        "• Mulch",
        "",
        "Planned in Pocket Planter 🌱",
      ];
      await Share.share({ message: lines.join("\n") });
    } catch (e) { console.log("Share list skipped:", e); }
  };

  return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {plantNames.map((name) => (
          <View key={name} style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
            <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "900", marginBottom: 8 }}>{name}</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(name + " seeds")}`)}
                style={{ flex: 1, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>🌱 Seeds</Text>
              </Pressable>
              <Pressable onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(name + " fertilizer")}`)}
                style={{ flex: 1, backgroundColor: "rgba(255,216,107,0.10)", borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,216,107,0.22)" }}>
                <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900" }}>🌾 Fertilizer</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 14, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800", lineHeight: 20 }}>
          🧺 Don't forget the basics: compost or potting mix, a balanced fertilizer, and mulch.
        </Text>
      </View>
      <Pressable onPress={shareList} style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>📤 Share / Copy List</Text>
      </Pressable>
    </View>
  );
}
