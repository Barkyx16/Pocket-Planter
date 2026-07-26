import { memo } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import { styles } from "../styles";
import { formatReminderTime } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const ReminderControlCard = memo(function ReminderControlCard({ theme, remindersOn, frostAlertsOn, monthlyPlantingOn, dailyWateringOn, wateringReminderTime, onChangeWateringTime, plantOfDayOn, onTogglePlantOfDay, onToggleReminders, onToggleFrost, onToggleMonthlyPlanting, onToggleDailyWatering }) {
  const { t } = useTranslation();
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
      {[{ label: t("reminderControl.wateringReminders"), text: t("reminderControl.addDailyRemindersFromPlant"), value: remindersOn, onToggle: onToggleReminders }, { label: t("reminderControl.frostAlerts"), text: t("reminderControl.eveningReminderToCheckOvernight"), value: frostAlertsOn, onToggle: onToggleFrost }, { label: t("reminderControl.monthlyPlantingGuides"), text: t("reminderControl.reminderOnThe1stOf"), value: monthlyPlantingOn, onToggle: onToggleMonthlyPlanting }, { label: t("reminderControl.dailyWateringCheck"), text: t("reminderControl.morningReminderToCheckYour"), value: dailyWateringOn, onToggle: onToggleDailyWatering }, { label: t("reminderControl.plantOfTheDay"), text: t("reminderControl.dailyPlantPickEveryMorning"), value: plantOfDayOn, onToggle: onTogglePlantOfDay }].map((row) => (
        <View key={row.label} style={styles.settingRow}>
          <View style={{ flex: 1, minWidth: 0 }}><Text style={[styles.settingTitle, { color: theme.text }]}>{row.label}</Text><Text style={[styles.settingText, { color: theme.secondaryText }]}>{row.text}</Text></View>
          <Switch value={row.value} onValueChange={row.onToggle} trackColor={{ false: "#314c39", true: "#5cff89" }} thumbColor="#ffffff" />
        </View>
      ))}
      {dailyWateringOn && wateringReminderTime ? (
        <Pressable
          onPress={pickTime}
          accessibilityRole="button"
          accessibilityLabel={t("reminderControl.changeDailyWateringReminderTime")}
          style={{ marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(107, 199, 255, 0.1)", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.24)" }}
        >
          <View style={{ flex: 1 }}>
            <IconText label={t("reminderControl.reminderTime")} style={{
  color: theme.text,
  fontSize: 14,
  fontWeight: "900"
}} />
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4 }}>{t("reminderControl.whenYourDailyWateringCheck")}</Text>
          </View>
          <View style={{ backgroundColor: "rgba(107, 199, 255, 0.16)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
            <Text style={{ color: "#6bc7ff", fontSize: 14, fontWeight: "900" }}>{formatReminderTime(wateringReminderTime)}</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
})
