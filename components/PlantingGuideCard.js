import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { getPlantingGuide } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const PlantingGuideCard = memo(function PlantingGuideCard({ theme, plant }) {
  const { t } = useTranslation();
  if (!plant) return null;
  const guide = getPlantingGuide(plant);
  const rows = [
    { icon: "📏", label: "Plant depth", value: guide.depth },
    { icon: "↔️", label: "Spacing", value: guide.spacing },
    { icon: "☀️", label: "Sunlight", value: guide.sun },
    { icon: "🌱", label: "Germination", value: guide.germ },
  ];
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "rgba(142, 255, 171, 0.3)" }]}>
      <IconText label={t("plantingGuide.plantingGuide")} style={styles.cardEyebrow} />
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {t("plantingGuide.generalGuidanceFor")} {plant.name}{t("plantingGuide.checkYourSeedPacketFor")}
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map((r) => (
          <View key={r.label} style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "rgba(142, 255, 171, 0.12)" }}>
            <Text style={{ fontSize: 20 }}>{r.icon}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", flex: 1 }}>{r.label}</Text>
            <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>{r.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
})
