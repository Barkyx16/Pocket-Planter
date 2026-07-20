import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { getPlantingGuide } from "../core";

export const PlantingGuideCard = memo(function PlantingGuideCard({ theme, plant }) {
  if (!plant) return null;
  const guide = getPlantingGuide(plant);
  const rows = [
    { icon: "📏", label: "Plant depth", value: guide.depth },
    { icon: "↔️", label: "Spacing", value: guide.spacing },
    { icon: "☀️", label: "Sunlight", value: guide.sun },
    { icon: "🌱", label: "Germination", value: guide.germ },
  ];
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "rgba(142,255,171,0.28)" }]}>
      <Text style={styles.cardEyebrow}>📐 PLANTING GUIDE</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        General guidance for {plant.name}. Check your seed packet for variety-specific details.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map((r) => (
          <View key={r.label} style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(142,255,171,0.12)" }}>
            <Text style={{ fontSize: 20 }}>{r.icon}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800", flex: 1 }}>{r.label}</Text>
            <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>{r.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
})
