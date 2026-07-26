import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { LANGUAGES, t } from "../lib/i18n";
import { MONTH_NAMES, formatReminderTime, formatTemp, getFrostSeasonMonths, getUpcomingFrost } from "../core";
import { AccountCloudCard } from "../components/AccountCloudCard";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { CustomTasksCard } from "../components/CustomTasksCard";
import { DataExportCard } from "../components/DataExportCard";
import { BackupRestoreCard } from "../components/BackupRestoreCard";
import { PhotoStorageCard } from "../components/PhotoStorageCard";
import { ReminderControlCard } from "../components/ReminderControlCard";
import { SettingsCard } from "../components/SettingsCard";
import { ShareGardenCard } from "../components/ShareGardenCard";
import { YearInReviewCard } from "../components/YearInReviewCard";
import { IconText } from "../components/IconText";

export function SettingsTab({ language, setLanguage, lastSyncedAt, appearanceMode, setAppearanceMode, hapticsOn, setHapticsOn, exportFullBackup, restoreFromBackup, cancelReminder, careLog, dailyWateringOn, deleteJournalEntriesOlderThan, ensureNotificationPermission, frostAlertsOn, gardenAreas, gardenMap, gardenXP, harvestLog, journalEntries, monthlyPlantingOn, newEmail, plantOfDayOn, premiumUnlocked, reminderY, remindersOn, savedPlants, scheduleDailyReminder, setDailyWateringOn, setFrostAlertsOn, setMonthlyPlantingOn, setNewEmail, setPremiumUnlocked, setRemindersOn, setSubscriptionPlan, setUnitSystem, setWateringReminderTime, streakData, subscriptionPlan, theme, togglePlantOfDay, unitSystem, unlockPremium, user, wateringHistory, wateringReminderTime, weather, zone }) {
  return (
    <View>
      <View style={{ marginTop: 8, marginBottom: 16, paddingHorizontal: 4 }}>
        <IconText label={t("settings.settings")} style={{
  color: theme.text,
  fontSize: 30,
  fontWeight: "900"
}} />
        <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "700", marginTop: 4 }}>
          {t("settings.yourAccountRemindersAndData")}
        </Text>
      </View>

      <CollapsibleCard theme={theme} storageKey="account" title={t("settings.cloudSave")}>
        <AccountCloudCard
          theme={theme}
          user={user}
          lastSyncedAt={lastSyncedAt}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          subscriptionPlan={subscriptionPlan}
          premiumUnlocked={premiumUnlocked}
          savedPlants={savedPlants}
          journalEntries={journalEntries}
          gardenMap={gardenMap}
        />
      </CollapsibleCard>

      <View onLayout={(event) => { if (reminderY) reminderY.current = event.nativeEvent.layout.y; }}>
        <CollapsibleCard theme={theme} storageKey="reminders" title={t("settings.smartReminders")}>
          <ReminderControlCard
            theme={theme}
            remindersOn={remindersOn}
            frostAlertsOn={frostAlertsOn}
            monthlyPlantingOn={monthlyPlantingOn}
            dailyWateringOn={dailyWateringOn}
            wateringReminderTime={wateringReminderTime}
            onChangeWateringTime={(t) => setWateringReminderTime(t)}
            plantOfDayOn={plantOfDayOn}
            onTogglePlantOfDay={togglePlantOfDay}
            onToggleReminders={(value) => {
              setRemindersOn(value);
              Alert.alert(
                value ? "Watering Reminders On" : "Watering Reminders Off",
                value
                  ? "You can now add watering reminders from individual plant pages."
                  : "Plant-page watering reminders are now disabled."
              );
            }}
            onToggleFrost={async (value) => {
              setFrostAlertsOn(value);
              if (value) {
                const granted = await ensureNotificationPermission();
                if (!granted) {
                  Alert.alert("Notifications Disabled", "Enable notifications in your phone settings to receive frost alerts.");
                  setFrostAlertsOn(false);
                  return;
                }
                const months = getFrostSeasonMonths(zone);
                for (const month of months) {
                  const id = `frost-daily-${month}`;
                  await cancelReminder(id);
                  await Notifications.scheduleNotificationAsync({
                    identifier: id,
                    content: {
                      title: "❄️ Frost Check",
                      body: "Cold season is here — open Pocket Planter to see if frost is coming and protect your tender plants.",
                      sound: true,
                    },
                    trigger: {
                      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                      repeats: true,
                      month,
                      day: 1,
                      hour: 18,
                      minute: 0,
                    },
                  });
                }
                const frost = getUpcomingFrost(weather);
                Alert.alert(
                  "Frost Alerts On ❄️",
                  frost
                    ? `Frost is already in your forecast — low of ${formatTemp(frost.minTempF, unitSystem, true)} coming. You'll also get a check-in reminder during cold months.`
                    : "You'll get a frost check-in reminder during your zone's cold months, plus an instant alert whenever frost appears in your forecast."
                );
              } else {
                const allMonths = [1, 2, 3, 4, 5, 9, 10, 11, 12];
                for (const month of allMonths) {
                  await cancelReminder(`frost-daily-${month}`);
                }
                await cancelReminder("frost-detected");
                Alert.alert("Frost Alerts Off", "You will no longer receive frost alerts.");
              }
            }}
            onToggleMonthlyPlanting={async (value) => {
              setMonthlyPlantingOn(value);
              if (value) {
                const granted = await ensureNotificationPermission();
                if (granted) {
                  for (let month = 1; month <= 12; month++) {
                    const id = `monthly-planting-${month}`;
                    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
                    await Notifications.scheduleNotificationAsync({
                      identifier: id,
                      content: {
                        title: `🌱 ${MONTH_NAMES[month - 1]} Planting Guide`,
                        body: `Open Pocket Planter to see what to plant this month in your zone.`,
                        sound: true,
                      },
                      trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                        repeats: true,
                        month,
                        day: 1,
                        hour: 9,
                        minute: 0,
                      },
                    });
                  }
                  Alert.alert("Monthly Planting Guides On 🌱", "You'll receive a planting guide on the 1st of every month.");
                }
              } else {
                for (let month = 1; month <= 12; month++) {
                  await cancelReminder(`monthly-planting-${month}`);
                }
                Alert.alert("Monthly Planting Reminders Off", "You will no longer receive monthly planting guide reminders.");
              }
            }}
            onToggleDailyWatering={async (value) => {
              setDailyWateringOn(value);
              if (value) {
                const rainLikely = weather?.precipChance >= 65;
                const ok = await scheduleDailyReminder({
                  id: "daily-watering",
                  hour: wateringReminderTime.hour,
                  minute: wateringReminderTime.minute,
                  title: rainLikely ? t("settings.rainMayWaterToday") : t("settings.dailyWateringCheck"),
                  body: rainLikely
                    ? t("settings.rainIsLikelyTodayCheck")
                    : t("settings.timeToCheckYourGarden"),
                });
                if (ok) {
                  Alert.alert("Daily Watering Check On 💧", `Pocket Planter will remind you every morning at ${formatReminderTime(wateringReminderTime)} to check your garden.`);
                }
              } else {
                await cancelReminder("daily-watering");
                Alert.alert("Daily Watering Reminder Off", "You will no longer receive daily watering reminders.");
              }
            }}
          />
          <View style={{ marginTop: 22, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 18 }}>
            <IconText label={t("settings.myGardenReminders")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
            <CustomTasksCard theme={theme} />
          </View>
        </CollapsibleCard>
      </View>

      <CollapsibleCard theme={theme} storageKey="appearance" title={t("settings.haptics")} defaultOpen={false}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{t("settings.hapticsLabel")}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{t("settings.hapticsBody")}</Text>
          </View>
          <Switch
            value={hapticsOn}
            onValueChange={setHapticsOn}
            trackColor={{ false: "rgba(255, 255, 255, 0.16)", true: "#5cff89" }}
            thumbColor="#ffffff"
          />
        </View>
      </CollapsibleCard>

      <CollapsibleCard theme={theme} storageKey="units" title={t("settings.units")} defaultOpen={false}>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2, marginBottom: 12 }}>
          {t("settings.unitsBody")}
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[
            { id: "imperial", label: t("settings.unitsImperial") },
            { id: "metric", label: t("settings.unitsMetric") },
          ].map((opt) => {
            const active = unitSystem === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setUnitSystem(opt.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={{ flex: 1, alignItems: "center", paddingVertical: 14, borderRadius: 12, backgroundColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.12)" }}
              >
                <Text style={{ color: active ? "#07120b" : theme.text, fontSize: 14, fontWeight: "900" }}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </CollapsibleCard>

      {((harvestLog || []).length + (journalEntries || []).length + Object.keys(wateringHistory || {}).length > 0 || savedPlants.length > 0) ? (
        <CollapsibleCard theme={theme} storageKey="yearinreview" title={t("settings.yearInReview")}>
          <YearInReviewCard
            theme={theme}
            savedPlants={savedPlants}
            harvestLog={harvestLog}
            journalEntries={journalEntries}
            wateringHistory={wateringHistory}
            streakData={streakData}
            gardenXP={gardenXP}
          />
          <View style={{ marginTop: 22, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 18 }}>
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 8 }}>{t("settings.shareGarden")}</Text>
            <ShareGardenCard
              theme={theme}
              gardenXP={gardenXP}
              savedPlants={savedPlants}
              harvestLog={harvestLog}
              journalEntries={journalEntries}
              streakData={streakData}
              gardenAreas={gardenAreas}
            />
          </View>
        </CollapsibleCard>
      ) : null}

      <CollapsibleCard theme={theme} storageKey="dataexport" title={t("settings.exportBackup")} defaultOpen={false}>
        <BackupRestoreCard
          theme={theme}
          onExport={exportFullBackup}
          onRestore={restoreFromBackup}
        />
        <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 18 }}>
          <IconText label={t("settings.exportAsCsv")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
          <DataExportCard
            theme={theme}
            harvestLog={harvestLog}
            careLog={careLog}
            journalEntries={journalEntries}
          />
        </View>
        <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 18 }}>
          <IconText label={t("settings.photoStorage")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
          <PhotoStorageCard
            theme={theme}
            journalEntries={journalEntries}
            onDeleteOlderThan={deleteJournalEntriesOlderThan}
          />
        </View>
      </CollapsibleCard>

      {premiumUnlocked ? (
        <CollapsibleCard theme={theme} storageKey="premiumplan" title={t("settings.premiumBilling")} defaultOpen={false}>
          <SettingsCard
            theme={theme}
            premiumUnlocked={premiumUnlocked}
            setPremiumUnlocked={setPremiumUnlocked}
            subscriptionPlan={subscriptionPlan}
            setSubscriptionPlan={setSubscriptionPlan}
            onUnlockPremium={unlockPremium}
          />
        </CollapsibleCard>
      ) : null}

      <CollapsibleCard theme={theme} storageKey="language" title={t("language.title")} defaultOpen={false}>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2, marginBottom: 12 }}>
          {t("language.body")}
        </Text>
        <View style={{ gap: 8 }}>
          {LANGUAGES.map((item) => {
            const active = item.code === language;
            return (
              <Pressable
                key={item.code}
                onPress={() => setLanguage(item.code)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 12,
                  backgroundColor: active ? "rgba(92, 255, 137, 0.16)" : "rgba(255, 255, 255, 0.06)",
                  borderWidth: 1,
                  borderColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.12)",
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 12 }}>{item.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{item.nativeName}</Text>
                  {item.nativeName !== item.name ? (
                    <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{item.name}</Text>
                  ) : null}
                </View>
                {active ? <Ionicons name="checkmark-circle" size={20} color="#5cff89" /> : null}
              </Pressable>
            );
          })}
        </View>
      </CollapsibleCard>
    </View>
  );
}
