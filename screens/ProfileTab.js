import { Pressable, Text, Vibration, View } from "react-native";
import { useState } from "react";
import { SCREEN_WIDTH, getTodayKey, profileBuddyImage, successHaptic } from "../core";
import { AchievementCard } from "../components/AchievementCard";
import { TabHero } from "../components/TabHero";
import { BudgetTrackerCard } from "../components/BudgetTrackerCard";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { DailyQuestsCard } from "../components/DailyQuestsCard";
import { GardenROICard } from "../components/GardenROICard";
import { GardenStoryCard } from "../components/GardenStoryCard";
import { GardenerProfileCard } from "../components/GardenerProfileCard";
import { PremiumLockedSection } from "../components/PremiumLockedSection";
import { ProfileBannersCard } from "../components/ProfileBannersCard";
import { SeasonalChallengesCard } from "../components/SeasonalChallengesCard";
import { IconText } from "../components/IconText";
import { t } from "../lib/i18n";

export function ProfileTab({ achievementBadges, badgeEarnedDates, bannerEarnedDates, activeBannerId, avatarGlow, cancelReminder, careLog, completedQuestIds, dailyQuests, dailyWateringOn, ensureNotificationPermission, frostAlertsOn, gardenAreas, gardenMap, gardenXP, harvestGoal, harvestLog, harvestTrackers, journalEntries, jumpToTab, monthlyPlantingOn, newEmail, plantOfDayOn, premiumUnlocked, premiumY, profileBanners, profileName, profilePhoto, reminderY, remindersOn, savedPlants, scheduleDailyReminder, seenGardenGod, selectedProfileTheme, setActiveBannerId, setAppearanceMode, setCompletedQuestIds, setDailyWateringOn, setFrostAlertsOn, setHarvestGoal, setMonthlyPlantingOn, setNewEmail, setProfileName, setProfilePhoto, setQuestXP, setRemindersOn, setSeenGardenGod, setSelectedProfileTheme, setSuppliesSpent, setWateringReminderTime, setXpPopups, streakData, subscriptionPlan, suppliesSpent, theme, togglePlantOfDay, user, wateredPlants, wateringHistory, wateringReminderTime, weather, zone }) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showBanners, setShowBanners] = useState(false);
  const achievementsEarned = (achievementBadges || []).filter((b) => b.unlocked).length;
  const achievementsTotal = (achievementBadges || []).length;
  const bannersEarned = (profileBanners || []).filter((b) => b.unlocked).length;
  const bannersTotal = (profileBanners || []).length;
  return (
<View onLayout={(event) => { premiumY.current = event.nativeEvent.layout.y; }}>
    <TabHero
      tabKey="profile"
      source={profileBuddyImage}
      style={{
        width: "100%",
        height: SCREEN_WIDTH * 0.6,
        borderRadius: 24,
        marginBottom: 18,
      }}
    />
{!premiumUnlocked ? (
  <PremiumLockedSection
    icon="🧑‍🌾"
    title={t("profile.gardenerProfile")}
    description={t("profile.unlockYourFullGardenerProfile")}
    onUnlock={() => jumpToTab("premium")}
  />
) : (
      <>
<CollapsibleCard theme={theme} storageKey="gardenerprofile" title="🧑‍🌾" defaultOpen={true}>
<GardenerProfileCard theme={theme} setAppearanceMode={setAppearanceMode} avatarGlow={avatarGlow} gardenXP={gardenXP} savedPlants={savedPlants} journalEntries={journalEntries} gardenMap={gardenMap} streakData={streakData} profileBanners={profileBanners} activeBannerId={activeBannerId} selectedProfileTheme={selectedProfileTheme} setSelectedProfileTheme={setSelectedProfileTheme} profileName={profileName} setProfileName={setProfileName} profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} harvestLog={harvestLog} wateringHistory={wateringHistory} />
{/* ACHIEVEMENTS — tap the button to reveal */}
<Pressable
  onPress={() => setShowAchievements((v) => !v)}
  style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.3)" }}
>
  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
    <Text style={{ fontSize: 16 }}>🏆</Text>
    <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{t("profile.achievementsEarned")}</Text>
    <View style={{ backgroundColor: "rgba(92, 255, 137, 0.2)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2 }}>
      <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>{achievementsEarned}/{achievementsTotal}</Text>
    </View>
  </View>
  <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900" }}>{showAchievements ? "▾" : "▸"}</Text>
</Pressable>
{showAchievements ? (
  <View style={{ marginTop: 12 }}>
    <AchievementCard
      theme={theme}
      badges={achievementBadges}
      earnedDates={badgeEarnedDates}
      streakData={streakData}
      seenGardenGod={seenGardenGod}
      setSeenGardenGod={setSeenGardenGod}
    />
  </View>
) : null}

{/* COLLECTIBLE BANNERS — tap the button to reveal */}
<Pressable
  onPress={() => setShowBanners((v) => !v)}
  style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, backgroundColor: "rgba(107, 199, 255, 0.1)", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.3)" }}
>
  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
    <Text style={{ fontSize: 16 }}>✨</Text>
    <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{t("profile.bannersEarned")}</Text>
    <View style={{ backgroundColor: "rgba(107, 199, 255, 0.2)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2 }}>
      <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900" }}>{bannersEarned}/{bannersTotal}</Text>
    </View>
  </View>
  <Text style={{ color: "#6bc7ff", fontSize: 16, fontWeight: "900" }}>{showBanners ? "▾" : "▸"}</Text>
</Pressable>
{showBanners ? (
  <View style={{ marginTop: 12 }}>
    <ProfileBannersCard
      theme={theme}
      profileBanners={profileBanners}
      earnedDates={bannerEarnedDates}
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
  </View>
) : null}
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="dailyquests" title={t("profile.dailyQuests")}>
<DailyQuestsCard
  theme={theme}
  dailyQuests={dailyQuests}
  completedQuestIds={completedQuestIds}
  onQuestComplete={(quest) => {
    const today = getTodayKey();
    const todayCompleted = completedQuestIds[today] || [];
    if (todayCompleted.includes(quest.id)) return;
    setCompletedQuestIds(current => ({
      ...current,
      [today]: [...(current[today] || []), quest.id],
    }));
    setQuestXP(prev => prev + quest.reward);
    const popup = { id: Date.now().toString(), amount: quest.reward };
    setXpPopups(current => [...current, popup]);
    setTimeout(() => {
      setXpPopups(current => current.filter(item => item.id !== popup.id));
    }, 1600);
    Vibration.vibrate(60);
    successHaptic();
  }}
/>
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="seasonalchallenges" title={t("profile.seasonalChallenges")}>
<SeasonalChallengesCard
  theme={theme}
  wateringHistory={wateringHistory}
  journalEntries={journalEntries}
  harvestLog={harvestLog}
  careLog={careLog}
  streakData={streakData}
  onReward={(amount) => {
    setQuestXP(prev => prev + amount);
    const popup = { id: Date.now().toString(), amount };
    setXpPopups(current => [...current, popup]);
    setTimeout(() => { setXpPopups(current => current.filter(item => item.id !== popup.id)); }, 1600);
  }}
/>
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="gardenstory" title={t("profile.gardenStory")}>
  <IconText label={t("profile.yourStory")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
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
<CollapsibleCard theme={theme} storageKey="harvestroi" title={t("profile.gardenRoiBudget")}>
  <IconText label={t("profile.gardenRoi")} style={{
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
  <GardenROICard
    theme={theme}
    harvestLog={harvestLog}
    suppliesSpent={suppliesSpent}
    setSuppliesSpent={setSuppliesSpent}
  />
  <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 18 }}>
    <IconText label={t("profile.gardenBudget")} style={{
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
    <BudgetTrackerCard theme={theme} />
  </View>
</CollapsibleCard>
      </>
    )}
  </View>
  );
}
