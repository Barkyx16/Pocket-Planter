import { Alert, Image, Pressable, Text, Vibration, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles";
import { SCREEN_WIDTH, WHATS_NEW_ITEMS, WHATS_NEW_VERSION, getRainSkipToday, getTodayKey, getUpcomingFrost, homeBuddyImage, successHaptic } from "../core";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { DailyBonusCard } from "../components/DailyBonusCard";
import { DailyQuestsCard } from "../components/DailyQuestsCard";
import { DaylightCard } from "../components/DaylightCard";
import { EmptyGardenStarterCard } from "../components/EmptyGardenStarterCard";
import { FrostChecklistCard } from "../components/FrostChecklistCard";
import { FrostOverrideCard } from "../components/FrostOverrideCard";
import { FrostWindowCard } from "../components/FrostWindowCard";
import { GardenStatsDashboard } from "../components/GardenStatsDashboard";
import { HarvestReadyCard } from "../components/HarvestReadyCard";
import { MonthlyChecklistCard } from "../components/MonthlyChecklistCard";
import { MostLovedPlantsCard } from "../components/MostLovedPlantsCard";
import { MyGardenTodayCard } from "../components/MyGardenTodayCard";
import { OnThisDayCard } from "../components/OnThisDayCard";
import { PestWatchCard } from "../components/PestWatchCard";
import { PlantAnniversaryCard } from "../components/PlantAnniversaryCard";
import { PlantTodayHero } from "../components/PlantTodayHero";
import { PremiumIntroCard } from "../components/PremiumIntroCard";
import { PremiumLockedCard } from "../components/PremiumLockedCard";
import { RescueModeCard } from "../components/RescueModeCard";
import { SavedPlantsCard } from "../components/SavedPlantsCard";
import { SeasonTransitionCard } from "../components/SeasonTransitionCard";
import { SeedStartingCard } from "../components/SeedStartingCard";
import { SuccessionSowingCard } from "../components/SuccessionSowingCard";
import { TodaysGamePlanCard } from "../components/TodaysGamePlanCard";
import { WaterTriageCard } from "../components/WaterTriageCard";
import { WateringRhythmCard } from "../components/WateringRhythmCard";
import { WateringStreakNudge } from "../components/WateringStreakNudge";
import { WeeklyWateringGrid } from "../components/WeeklyWateringGrid";

export function HomeTab({ claimDailyBonus, combinedGardenMap, compatiblePlants, completedQuestIds, dailyBonusClaimed, dailyBonusDate, dailyQuests, dismissPremiumIntro, fertilizerTrackers, frostChecklist, frostDatesHidden, frostOverrides, gardenXP, harvestLog, harvestTrackers, homeBannerDismissedDate, journalEntries, jumpToTab, markPlantWatered, monthlyChecklist, monthlySuggestions, openPlantFromList, pickJournalPhoto, pinnedPlants, plantFolders, plantSaveDates, premiumUnlocked, record, savedPlants, scrollRef, setCompletedQuestIds, setFrostChecklist, setFrostDatesHidden, setFrostOverrides, setHomeBannerDismissedDate, setMonthlyChecklist, setQuestXP, setShowWhatsNew, setSowLog, setXpPopups, setZip, showPremiumIntro, showWhatsNew, snoozedPlants, sowLog, streakData, streakFreeze, theme, togglePinnedPlant, uploadingPhoto, useStreakFreeze, waterAllPlants, waterPlant, wateredPlants, wateringAmounts, wateringHistory, wateringSectionY, weather, zipCoords, zone }) {
  return (
<>
{(() => {
      if (homeBannerDismissedDate === getTodayKey()) return null;
      const dismissBanner = () => {
        const today = getTodayKey();
        setHomeBannerDismissedDate(today);
        AsyncStorage.setItem("pp_homeBannerDismissedDate", today).catch(() => {});
      };
      const frost = getUpcomingFrost(weather);
      const extremeHeat = weather?.maxTempF >= 98;
      if (frost) {
        const whenText =
          frost.daysOut === 0 ? "tonight"
          : frost.daysOut === 1 ? "tomorrow night"
          : `in ${frost.daysOut} days`;
        const countdownText =
          frost.daysOut === 0 ? "❄️ Tonight"
          : frost.daysOut === 1 ? "❄️ 1 night away"
          : `❄️ ${frost.daysOut} nights away`;
        return (
          <View style={[styles.frostBanner, { borderColor: "#6bc7ff" }]}>
            <Text style={styles.frostBannerIcon}>❄️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.frostBannerTitle}>Frost expected {whenText}</Text>
              <View style={{ alignSelf: "flex-start", marginTop: 6, marginBottom: 6, backgroundColor: "rgba(107,199,255,0.18)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(107,199,255,0.35)" }}>
                <Text style={{ color: "#6bc7ff", fontSize: 13, fontWeight: "900" }}>{countdownText}</Text>
              </View>
              <Text style={styles.frostBannerText}>
                Low of {Math.round(frost.minTempF)}°F coming — cover tender plants, move containers to shelter, and hold off on transplanting.
              </Text>
            </View>
           <Pressable onPress={dismissBanner} hitSlop={10} style={{ padding: 4 }}>
              <Text style={{ color: "#6bc7ff", fontSize: 18, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        );
      }
      if (extremeHeat) {
        return (
          <View style={[styles.frostBanner, { borderColor: "#ff7b7b", backgroundColor: "rgba(255,123,123,0.10)" }]}>
            <Text style={styles.frostBannerIcon}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.frostBannerTitle, { color: "#ff7b7b" }]}>Extreme heat today</Text>
              <Text style={styles.frostBannerText}>
                High of {Math.round(weather.maxTempF)}°F — water before 9 AM, shade young plants, add mulch, and skip transplanting today.
              </Text>
            </View>
            <Pressable onPress={dismissBanner} hitSlop={10} style={{ padding: 4 }}>
              <Text style={{ color: "#ff7b7b", fontSize: 18, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        );
      }
      const rainSkip = getRainSkipToday(weather);
      if (rainSkip) {
        return (
          <View style={[styles.frostBanner, { borderColor: "#6bc7ff", backgroundColor: "rgba(107,199,255,0.10)" }]}>
            <Text style={styles.frostBannerIcon}>🌧️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.frostBannerTitle, { color: "#6bc7ff" }]}>Watering skipped today</Text>
              <Text style={styles.frostBannerText}>
                {rainSkip.chance}% chance of rain — Pocket Planter is skipping today's watering reminder so you don't overwater. Check soil before watering anyway.
              </Text>
            </View>
            <Pressable onPress={dismissBanner} hitSlop={10} style={{ padding: 4 }}>
              <Text style={{ color: "#6bc7ff", fontSize: 18, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        );
      }
      return null;
   })()}
    {showWhatsNew ? (
      <View style={{ backgroundColor: theme.card, borderRadius: 24, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: "#5cff89" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>✨ WHAT'S NEW</Text>
          <Pressable
            onPress={() => { setShowWhatsNew(false); AsyncStorage.setItem("pp_whatsNewSeen", WHATS_NEW_VERSION).catch(() => {}); }}
            hitSlop={10}
            style={{ padding: 4 }}
          >
            <Text style={{ color: "#8fbf9d", fontSize: 18, fontWeight: "900" }}>✕</Text>
          </Pressable>
        </View>
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900", marginTop: 6 }}>Fresh updates 🌱</Text>
        <View style={{ marginTop: 12, gap: 8 }}>
          {WHATS_NEW_ITEMS.map((item) => (
            <Text key={item} style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "700", lineHeight: 20 }}>{item}</Text>
          ))}
        </View>
        <Pressable
          onPress={() => { setShowWhatsNew(false); AsyncStorage.setItem("pp_whatsNewSeen", WHATS_NEW_VERSION).catch(() => {}); }}
          style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 13, alignItems: "center" }}
        >
          <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>Got it 🌿</Text>
        </Pressable>
      </View>
    ) : null}
    <Image
      source={homeBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />

    {/* ZONE BADGE + CHANGE BUTTON */}
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: theme.card, borderRadius: 22, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)" }}>
      <View>
        <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.5 }}>Your Growing Zone</Text>
        <Text style={{ color: "#ffffff", fontSize: 28, fontWeight: "900", marginTop: 2 }}>Zone {record.zone}</Text>
        <Text style={{ color: "#d7ebdc", fontSize: 13, fontWeight: "700", marginTop: 2 }}>{record.zonetitle}</Text>
      </View>
      <Pressable
        onPress={() => {
          Alert.alert(
            "Change your zone?",
            "This clears your current ZIP code so you can enter a new one. Your saved plants and garden stay intact.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Change Zone", style: "destructive", onPress: () => setZip("") },
            ]
          );
        }}
        style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}
      >
        <Text style={{ color: "#d7ebdc", fontSize: 13, fontWeight: "900" }}>✏️ Change Zone</Text>
      </Pressable>
    </View>

            {savedPlants.length > 0 ? (
                <TodaysGamePlanCard
                  theme={theme}
                  savedPlants={savedPlants}
                  wateredPlants={wateredPlants}
                  wateringHistory={wateringHistory}
                  harvestTrackers={harvestTrackers}
                  weather={weather}
                  zone={zone}
                  compatiblePlants={compatiblePlants}
                  snoozedPlants={snoozedPlants}
                  onOpenPlant={openPlantFromList}
                  onScrollToWatering={() => scrollRef.current?.scrollTo({ y: Math.max(0, wateringSectionY.current - 20), animated: true })}
                />
              ) : null}

              <PlantAnniversaryCard
                theme={theme}
                plantSaveDates={plantSaveDates}
                savedPlants={savedPlants}
                onOpenPlant={openPlantFromList}
              />

<OnThisDayCard
                theme={theme}
                journalEntries={journalEntries}
                harvestLog={harvestLog}
                onOpenPlant={openPlantFromList}
              />

              <FrostChecklistCard
                theme={theme}
                weather={weather}
                frostChecklist={frostChecklist}
                setFrostChecklist={setFrostChecklist}
              />

              <EmptyGardenStarterCard
                theme={theme}
                savedPlants={savedPlants}
                compatiblePlants={compatiblePlants}
                zone={zone}
                onOpenPlant={openPlantFromList}
                onBrowse={() => jumpToTab("plants")}
              />

              {showPremiumIntro ? (<PremiumIntroCard onClose={dismissPremiumIntro} onUnlock={() => { dismissPremiumIntro(); jumpToTab("premium"); }} />) : null}

<View onLayout={(event) => { wateringSectionY.current = event.nativeEvent.layout.y; }}>
<WateringStreakNudge
  theme={theme}
  savedPlants={savedPlants}
  wateringHistory={wateringHistory}
  snoozedPlants={snoozedPlants}
  onOpenPlant={openPlantFromList}
  onWater={markPlantWatered}
/>
</View>

<RescueModeCard
  theme={theme}
  savedPlants={savedPlants}
  wateredPlants={wateredPlants}
  wateringHistory={wateringHistory}
  onOpenPlant={openPlantFromList}
  onWater={markPlantWatered}
/>

<HarvestReadyCard
  theme={theme}
  harvestTrackers={harvestTrackers}
  onOpenPlant={openPlantFromList}
/>

<CollapsibleCard theme={theme} storageKey="dashboard" title="🌱 Garden Dashboard">
<GardenStatsDashboard
  theme={theme}
  savedPlants={savedPlants}
  journalEntries={journalEntries}
  gardenMap={combinedGardenMap}
  gardenXP={gardenXP}
  streakData={streakData}
  wateredPlants={wateredPlants}
  wateringHistory={wateringHistory}
  weather={weather}
  zone={zone}
harvestTrackers={harvestTrackers}
  fertilizerTrackers={fertilizerTrackers}
  onNavigate={jumpToTab}
  onWaterAll={waterAllPlants}
/>
</CollapsibleCard>

<MyGardenTodayCard
  theme={theme}
  weather={weather}
  monthlySuggestions={monthlySuggestions}
  savedPlants={savedPlants}
  wateredPlants={wateredPlants}
  onOpenPlant={openPlantFromList}
  onAddPhoto={() => pickJournalPhoto("Garden")}
  uploadingPhoto={uploadingPhoto}
  harvestTrackers={harvestTrackers}
  fertilizerTrackers={fertilizerTrackers}
  journalEntries={journalEntries}
zone={zone}
  gardenMap={combinedGardenMap}
  onNavigate={jumpToTab}
/>
{(monthlySuggestions.length || compatiblePlants.length) ? (
<CollapsibleCard theme={theme} storageKey="plantpick" title="🌟 Plant Pick">
<PlantTodayHero
  theme={theme}
  monthlySuggestions={monthlySuggestions}
  compatiblePlants={compatiblePlants}
  savedPlants={savedPlants}
  zone={zone}
  weather={weather}
  onOpen={openPlantFromList}
/>
</CollapsibleCard>
) : null}

<SeedStartingCard
  theme={theme}
  plants={compatiblePlants}
  zone={zone}
  onOpenPlant={openPlantFromList}
/>

<WaterTriageCard
  theme={theme}
  savedPlants={savedPlants}
  wateringHistory={wateringHistory}
  wateringAmounts={wateringAmounts}
  onWater={(name) => waterPlant(name)}
  onOpenPlant={openPlantFromList}
/>

{(zone && savedPlants.length) ? (
<CollapsibleCard theme={theme} storageKey="succession" title="🔁 Succession Sowing">
<SuccessionSowingCard
  theme={theme}
  savedPlants={savedPlants}
  zone={zone}
  sowLog={sowLog}
  onSow={(name) => setSowLog((c) => ({ ...c, [name]: getTodayKey() }))}
/>
</CollapsibleCard>
) : null}

<FrostWindowCard
  theme={theme}
  plants={compatiblePlants}
  zone={zone}
  onOpenPlant={openPlantFromList}
/>

{frostDatesHidden ? (
  <Pressable
    onPress={() => setFrostDatesHidden(false)}
    style={{ backgroundColor: "rgba(107,199,255,0.08)", borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18, marginBottom: 18, borderWidth: 1, borderColor: "rgba(107,199,255,0.2)", alignItems: "center", justifyContent: "center" }}
  >
    <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800" }}>❄️ Show frost dates card</Text>
  </Pressable>
) : (
  <CollapsibleCard theme={theme} storageKey="frostdates" title="❄️ Frost Dates">
  <FrostOverrideCard
    theme={theme}
    zone={zone}
    frostOverrides={frostOverrides}
    onSave={setFrostOverrides}
    onHide={() => setFrostDatesHidden(true)}
  />
  </CollapsibleCard>
)}

{zipCoords ? (
<CollapsibleCard theme={theme} storageKey="daylight" title="☀️ Daylight Today">
<DaylightCard theme={theme} zipCoords={zipCoords} />
</CollapsibleCard>
) : null}

{zone ? (
<CollapsibleCard theme={theme} storageKey="monthlychecklist" title="🗓️ This Month">
<MonthlyChecklistCard theme={theme} zone={zone} monthlyChecklist={monthlyChecklist} setMonthlyChecklist={setMonthlyChecklist} />
</CollapsibleCard>
) : null}
<SeasonTransitionCard
  theme={theme}
  zone={zone}
  onOpenPlant={openPlantFromList}
  onBrowse={() => jumpToTab("plants")}
/>

<DailyBonusCard
  theme={theme}
  dailyBonusClaimed={dailyBonusClaimed}
  dailyBonusDate={dailyBonusDate}
  onClaim={claimDailyBonus}
  streakData={streakData}
/>

{compatiblePlants.length ? (
<CollapsibleCard theme={theme} storageKey="pestwatch" title="🐛 Pest Watch">
<PestWatchCard
  theme={theme}
  savedPlantObjs={compatiblePlants}
  onOpenPlant={openPlantFromList}
/>
</CollapsibleCard>
) : null}

{premiumUnlocked ? (
  <CollapsibleCard theme={theme} storageKey="dailyquests" title="⚡ Daily Quests">
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
) : (
  <PremiumLockedCard theme={theme} title="Daily quests locked" body="Unlock gardening streaks, XP progression, achievements, and daily challenges." onUnlock={() => jumpToTab("premium")} />
)}
{savedPlants.length ? (
<CollapsibleCard theme={theme} storageKey="weeklywatering" title="💧 This Week's Watering">
<WeeklyWateringGrid theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} />
</CollapsibleCard>
) : null}
{savedPlants.length >= 2 ? (
<CollapsibleCard theme={theme} storageKey="mostloved" title="💧 Most Loved">
<MostLovedPlantsCard theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} onOpenPlant={openPlantFromList} />
</CollapsibleCard>
) : null}
{savedPlants.length ? (
<CollapsibleCard theme={theme} storageKey="wateringrhythm" title="📊 Watering Rhythm">
<WateringRhythmCard theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} onOpenPlant={openPlantFromList} />
</CollapsibleCard>
) : null}
{savedPlants.length ? (
<CollapsibleCard theme={theme} storageKey="savedplants" title="🌿 Saved Plants">
<SavedPlantsCard theme={theme} savedPlants={savedPlants} plantFolders={plantFolders} premiumUnlocked={premiumUnlocked} wateredPlants={wateredPlants} wateringHistory={wateringHistory} weather={weather} harvestTrackers={harvestTrackers} pinnedPlants={pinnedPlants} onTogglePin={togglePinnedPlant} onOpenPlant={openPlantFromList} onUpgrade={() => jumpToTab("premium")} />
</CollapsibleCard>
) : null}

{(streakData?.count || 0) >= 3 ? (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: streakFreeze.available ? "rgba(163,213,255,0.10)" : "rgba(255,255,255,0.04)", borderRadius: 18, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: streakFreeze.available ? "rgba(163,213,255,0.28)" : "rgba(255,255,255,0.08)" }}>
    <Text style={{ fontSize: 28 }}>❄️</Text>
    <View style={{ flex: 1 }}>
      <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>Streak Freeze</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
        {streakFreeze.available ? "Protect your streak on a busy day. Refreshes weekly." : "Used this week — refreshes next week."}
      </Text>
    </View>
    <Pressable
      onPress={useStreakFreeze}
      disabled={!streakFreeze.available}
      accessibilityRole="button"
      accessibilityLabel="Use streak freeze"
      style={{ backgroundColor: streakFreeze.available ? "#a3d5ff" : "rgba(255,255,255,0.08)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11 }}
    >
      <Text style={{ color: streakFreeze.available ? "#07120b" : "#8fbf9d", fontSize: 13, fontWeight: "900" }}>
        {streakFreeze.available ? "Use" : "Used"}
      </Text>
    </Pressable>
  </View>
) : null}
            </>
  );
}
