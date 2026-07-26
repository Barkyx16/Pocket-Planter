import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const GardenHealthHomeCard = memo(function GardenHealthHomeCard({ theme, gardenHealth, onPress }) {
  const { t } = useTranslation();
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <IconText label={t("gardenHealthHome.gardenHealth")} style={[styles.cardTitle, {
  color: theme.text
}]} />
      <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 6 }]}>{gardenHealth.score}% • {gardenHealth.label}</Text>
      <View style={{ marginTop: 10, alignSelf: "flex-start", backgroundColor: "#5cff89", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 }}>
        <Text style={{ color: "#07120b", fontWeight: "800" }}>{t("gardenHealthHome.openGarden")}</Text>
      </View>
    </Pressable>
  );
})
