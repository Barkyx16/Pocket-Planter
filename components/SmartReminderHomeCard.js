import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export const SmartReminderHomeCard = memo(function SmartReminderHomeCard({ theme, remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn, onPress }) {
  const enabledCount = [remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn].filter(Boolean).length;
  return (
    <Pressable onPress={onPress} style={[styles.smartReminderHomeCard, { backgroundColor: theme.card, borderColor: enabledCount === 4 ? "#5cff89" : "#ffd86b" }]}>
      <Text style={styles.smartReminderHomeIcon}>{enabledCount === 4 ? "✅" : "🔔"}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.smartReminderHomeTitle, { color: theme.text }]}>Smart Reminders</Text>
        <Text style={[styles.smartReminderHomeText, { color: theme.secondaryText }]}>{enabledCount}/4 reminders enabled</Text>
        <Text style={styles.smartReminderHomeBadgeText}>{enabledCount === 4 ? "All garden reminders are active" : "Tap to finish setting up reminders"}</Text>
      </View>
      <Text style={styles.smartReminderHomeArrow}>›</Text>
    </Pressable>
  );
})
