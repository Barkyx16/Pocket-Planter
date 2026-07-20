import { memo } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import { styles } from "../styles";
import { formatReminderTime } from "../core";

export const ReminderControlCard = memo(function ReminderControlCard({ theme, remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn, wateringReminderTime, onChangeWateringTime, plantOfDayOn, onTogglePlantOfDay, onToggleReminders, onToggleFrost, onToggleMonthlyPlanting, onToggleDailyWatering }) {
  const TIME_OPTIONS = [
    { hour: 6, minute: 0 },
    { hour: 7, minute: 0 },
    { hour: 8, minute: 0 },
    { hour: 9, minute: 0 },
    { hour: 12, minute: 0 },
    { hour: 17, minute: 0 },
    { hour: 19, minute: 0 },
  ];
  const pickTime = () => {
    if (!onChangeWateringTime) return;
    Alert.alert(
      "Watering Reminder Time",
      "When should Pocket Planter remind you each day?",
      [
        ...TIME_OPTIONS.map((t) => ({
          text: formatReminderTime(t),
          onPress: () => onChangeWateringTime(t),
        })),
        { text: "Cancel", style: "cancel" },
      ]
    );
  };
  return (
    <View>
      {[{ label: "Watering Reminders!", text: "Add daily reminders from plant pages.", value: remindersOn, onToggle: onToggleReminders }, { label: "Frost Alerts!", text: "Evening reminder to check overnight lows.", value: frostAlertsOn, onToggle: onToggleFrost }, { label: "Monthly Planting Guides!", text: "Reminder on the 1st of every month.", value: monthlyPlantingOn, onToggle: onToggleMonthlyPlanting }, { label: "Daily Watering Check!", text: "Morning reminder to check your garden.", value: dailyWateringOn, onToggle: onToggleDailyWatering }, { label: "Plant of the Day!", text: "Daily plant pick every morning.", value: plantOfDayOn, onToggle: onTogglePlantOfDay }].map((row) => (
        <View key={row.label} style={styles.settingRow}>
          <View style={{ flex: 1, minWidth: 0 }}><Text style={[styles.settingTitle, { color: theme.text }]}>{row.label}</Text><Text style={[styles.settingText, { color: theme.secondaryText }]}>{row.text}</Text></View>
          <Switch value={row.value} onValueChange={row.onToggle} trackColor={{ false: "#314c39", true: "#5cff89" }} thumbColor="#ffffff" />
        </View>
      ))}
      {dailyWateringOn && wateringReminderTime ? (
        <Pressable
          onPress={pickTime}
          accessibilityRole="button"
          accessibilityLabel="Change daily watering reminder time"
          style={{ marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(107,199,255,0.10)", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.24)" }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>⏰ Reminder time</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 3 }}>When your daily watering check arrives</Text>
          </View>
          <View style={{ backgroundColor: "rgba(107,199,255,0.18)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 }}>
            <Text style={{ color: "#6bc7ff", fontSize: 14, fontWeight: "900" }}>{formatReminderTime(wateringReminderTime)}</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
})
