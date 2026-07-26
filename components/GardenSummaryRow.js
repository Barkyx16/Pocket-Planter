import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { useTranslation } from "../lib/i18n";

export const GardenSummaryRow = memo(function GardenSummaryRow({ theme, remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn, onPressReminders, gardenHealth, onPressGarden }) {
  const { t } = useTranslation();
  const enabledCount = [remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn].filter(Boolean).length;
  return (
    <View style={styles.gardenSummaryRow}>
      <Pressable onPress={onPressReminders} style={[styles.gardenSummaryCard, { backgroundColor: theme.card, borderColor: enabledCount === 4 ? "#5cff89" : "#ffd86b" }]}>
        <Text style={styles.gardenSummaryIcon}>{enabledCount === 4 ? "✅" : "🔔"}</Text>
        <Text style={[styles.gardenSummaryTitle, { color: theme.text }]}>Reminders</Text>
        <Text style={styles.gardenSummaryMeta}>{enabledCount}/4 on</Text>
      </Pressable>
      <Pressable onPress={onPressGarden} style={[styles.gardenSummaryCard, { backgroundColor: theme.card, borderColor: gardenHealth.score >= 80 ? "#5cff89" : "#ffd86b" }]}>
        <Text style={styles.gardenSummaryIcon}>🌱</Text>
        <Text style={[styles.gardenSummaryTitle, { color: theme.text }]}>Garden</Text>
        <Text style={styles.gardenSummaryMeta}>{gardenHealth.score}{t("gardenSummaryRow.health")}</Text>
      </Pressable>
    </View>
  );
})
