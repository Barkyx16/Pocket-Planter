import { Alert, Image, View } from "react-native";
import * as Notifications from "expo-notifications";
import { MONTH_NAMES, SCREEN_WIDTH, formatReminderTime, getFrostSeasonMonths, getUpcomingFrost, profileBuddyImage } from "../core";
import { AccountCloudCard } from "../components/AccountCloudCard";
import { AchievementCard } from "../components/AchievementCard";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { GardenROICard } from "../components/GardenROICard";
import { GardenStoryCard } from "../components/GardenStoryCard";
import { GardenerProfileCard } from "../components/GardenerProfileCard";
import { HarvestGoalCard } from "../components/HarvestGoalCard";
import { PremiumLockedSection } from "../components/PremiumLockedSection";
import { ProfileBannersCard } from "../components/ProfileBannersCard";
import { ReminderControlCard } from "../components/ReminderControlCard";
import { SeasonComparisonCard } from "../components/SeasonComparisonCard";
import { WateringHeatmapCard } from "../components/WateringHeatmapCard";
import { YearInReviewCard } from "../components/YearInReviewCard";

export function ProfileTab({ achievementBadges, activeBannerId, avatarGlow, cancelReminder, careLog, dailyWateringOn, ensureNotificationPermission, frostAlertsOn, gardenAreas, gardenMap, gardenXP, harvestGoal, harvestLog, harvestTrackers, journalEntries, jumpToTab, monthlyPlantingOn, newEmail, plantOfDayOn, premiumUnlocked, premiumY, profileBanners, profileName, profilePhoto, reminderY, remindersOn, savedPlants, scheduleDailyReminder, seenGardenGod, selectedProfileTheme, setActiveBannerId, setAppearanceMode, setDailyWateringOn, setFrostAlertsOn, setHarvestGoal, setMonthlyPlantingOn, setNewEmail, setProfileName, setProfilePhoto, setRemindersOn, setSeenGardenGod, setSelectedProfileTheme, setSuppliesSpent, setWateringReminderTime, streakData, subscriptionPlan, suppliesSpent, theme, togglePlantOfDay, user, wateredPlants, wateringHistory, wateringReminderTime, weather, zone }) {
  return (
<View onLayout={(event) => { premiumY.current = event.nativeEvent.layout.y; }}>
    <Image
      source={profileBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
<CollapsibleCard theme={theme} storageKey="account" title="☁️ Cloud Save Connected">
  <AccountCloudCard
  theme={theme}
  user={user}
  newEmail={newEmail}
  setNewEmail={setNewEmail}
  subscriptionPlan={subscriptionPlan}
  premiumUnlocked={premiumUnlocked}
  savedPlants={savedPlants}
  journalEntries={journalEntries}
  gardenMap={gardenMap}
/>
  </CollapsibleCard>

<View
  onLayout={(event) => {
    reminderY.current =
      event.nativeEvent.layout.y;
  }}
>
      <CollapsibleCard theme={theme} storageKey="reminders" title="Smart Reminders!">
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
          ? `Frost is already in your forecast — low of ${Math.round(frost.minTempF)}°F coming. You'll also get a check-in reminder during cold months.`
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
        title: rainLikely ? "🌧️ Rain May Water Today" : "💧 Daily Watering Check",
        body: rainLikely
          ? "Rain is likely today. Check the soil before watering your garden."
          : "Time to check your garden and water any plants that need moisture today.",
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
      </CollapsibleCard>
</View>
{!premiumUnlocked ? (
  <PremiumLockedSection
    icon="🧑‍🌾"
    title="Gardener Profile"
    description="Unlock your full gardener profile, XP progression, level-up rewards, achievement badges, and collectible banners."
    onUnlock={() => jumpToTab("premium")}
  />
) : (
      <>
<CollapsibleCard theme={theme} storageKey="gardenerprofile" title="🧑‍🌾 Gardener Profile">
<GardenerProfileCard theme={theme} setAppearanceMode={setAppearanceMode} avatarGlow={avatarGlow} gardenXP={gardenXP} savedPlants={savedPlants} journalEntries={journalEntries} gardenMap={gardenMap} streakData={streakData} profileBanners={profileBanners} selectedProfileTheme={selectedProfileTheme} setSelectedProfileTheme={setSelectedProfileTheme} profileName={profileName} setProfileName={setProfileName} profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} />
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="banners" title="✨ Collectible Banners">
       <ProfileBannersCard
  theme={theme}
  profileBanners={profileBanners}
  gardenXP={gardenXP}
  savedPlants={savedPlants}
  journalEntries={journalEntries}
  gardenMap={gardenMap}
  wateredPlants={wateredPlants}
  streakData={streakData}
  harvestTrackers={harvestTrackers}
  careLog={careLog}
  premiumUnlocked={premiumUnlocked}
  activeBannerId={activeBannerId}
  setActiveBannerId={setActiveBannerId}
/>
       </CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="gardenstory" title="📖 Garden Story">
<GardenStoryCard
  theme={theme}
  savedPlants={savedPlants}
  harvestLog={harvestLog}
  journalEntries={journalEntries}
  wateringHistory={wateringHistory}
  streakData={streakData}
  gardenXP={gardenXP}
  gardenAreas={gardenAreas}
/>
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="seasonsofar" title="📊 Season So Far">
<SeasonComparisonCard
  theme={theme}
  harvestLog={harvestLog}
  journalEntries={journalEntries}
  wateringHistory={wateringHistory}
/>
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="harvestgoal" title="🎯 Harvest Goal">
<HarvestGoalCard
  theme={theme}
  harvestLog={harvestLog}
  harvestGoal={harvestGoal}
  setHarvestGoal={setHarvestGoal}
/>
</CollapsibleCard>
{((harvestLog || []).length + (journalEntries || []).length + Object.keys(wateringHistory || {}).length > 0 || savedPlants.length > 0) ? (
<CollapsibleCard theme={theme} storageKey="yearinreview" title="🌻 Year in Review">
<YearInReviewCard
  theme={theme}
  savedPlants={savedPlants}
  harvestLog={harvestLog}
  journalEntries={journalEntries}
  wateringHistory={wateringHistory}
  streakData={streakData}
  gardenXP={gardenXP}
/>
</CollapsibleCard>
) : null}

<CollapsibleCard theme={theme} storageKey="gardenroi" title="💰 Garden ROI">
<GardenROICard
  theme={theme}
  harvestLog={harvestLog}
  suppliesSpent={suppliesSpent}
  setSuppliesSpent={setSuppliesSpent}
/>
</CollapsibleCard>

{Object.values(wateringHistory || {}).some((dates) => (dates || []).length) ? (
<CollapsibleCard theme={theme} storageKey="wateringheatmap" title="🔥 Watering Heatmap">
<WateringHeatmapCard
  theme={theme}
  wateringHistory={wateringHistory}
/>
</CollapsibleCard>
) : null}
<CollapsibleCard theme={theme} storageKey="achievements" title="🏆 Achievements">
        <AchievementCard
  theme={theme}
  badges={achievementBadges}
  streakData={streakData}
  seenGardenGod={seenGardenGod}
  setSeenGardenGod={setSeenGardenGod}
/>
        </CollapsibleCard>
      </>
    )}
  </View>
  );
}
