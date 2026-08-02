import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles";
import { SCREEN_WIDTH, WHATS_NEW_ITEMS, WHATS_NEW_VERSION, formatTemp, getRainSkipToday, getTodayKey, getUpcomingFrost, homeBuddyImage, isMonthlyChecklistComplete, zoneIsFrostFree } from "../core";
import { t } from "../lib/i18n";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { TabHero } from "../components/TabHero";
import { DailyBonusCard } from "../components/DailyBonusCard";
import { DaylightCard } from "../components/DaylightCard";
import { EmptyGardenStarterCard } from "../components/EmptyGardenStarterCard";
import { GettingStartedCard } from "../components/GettingStartedCard";
import { FrostChecklistCard } from "../components/FrostChecklistCard";
import { FrostOverrideCard } from "../components/FrostOverrideCard";
import { FrostWindowCard } from "../components/FrostWindowCard";
import { GardenStatsDashboard } from "../components/GardenStatsDashboard";
import { GardenStatsPreview } from "../components/GardenStatsPreview";
import { HarvestReadyCard } from "../components/HarvestReadyCard";
import { MonthlyChecklistCard } from "../components/MonthlyChecklistCard";
import { MyGardenTodayCard } from "../components/MyGardenTodayCard";
import { OnThisDayCard } from "../components/OnThisDayCard";
import { PlantAnniversaryCard } from "../components/PlantAnniversaryCard";
import { PlantTodayHero } from "../components/PlantTodayHero";
import { PremiumIntroCard } from "../components/PremiumIntroCard";
import { PremiumLockedCard } from "../components/PremiumLockedCard";
import { RescueModeCard } from "../components/RescueModeCard";
import { SavedPlantsCard } from "../components/SavedPlantsCard";
import { SeasonTransitionCard } from "../components/SeasonTransitionCard";
import { PlantingCalendarCard } from "../components/PlantingCalendarCard";
import { SeedStartingCard } from "../components/SeedStartingCard";
import { SuccessionSowingCard } from "../components/SuccessionSowingCard";
import { ToggleSection } from "../components/ToggleSection";
import { WaterTriageCard } from "../components/WaterTriageCard";
import { WateringStreakNudge } from "../components/WateringStreakNudge";
import { IconText } from "../components/IconText";

export function HomeTab({ activationSteps, claimDailyBonus, combinedGardenMap, compatiblePlants, completedQuestIds, dailyBonusClaimed, dailyBonusDate, dailyQuests, dismissGettingStarted, dismissPremiumIntro, fertilizerTrackers, frostChecklist, frostDatesHidden, frostOverrides, gardenXP, gettingStartedDismissed, harvestLog, harvestTrackers, homeBannerDismissedDate, journalEntries, jumpToTab, markPlantWatered, monthlyChecklist, monthlySuggestions, onOpenSearch, openPlantFromList, openPest, pickJournalPhoto, pinnedPlants, plantFolders, plantPickDismissedDate, plantSaveDates, premiumUnlocked, record, savedPlants, savedPlantObjs, scrollRef, setPlantPickDismissedDate, setCompletedQuestIds, setFrostChecklist, setFrostDatesHidden, setFrostOverrides, setHomeBannerDismissedDate, setMonthlyChecklist, setQuestXP, setShowWhatsNew, setSowLog, setXpPopups, setZip, showPremiumIntro, showWhatsNew, snoozedPlants, sowLog, streakData, streakFreeze, theme, togglePinnedPlant, unitSystem, uploadingPhoto, useStreakFreeze, waterAllPlants, waterPlant, wateredPlants, wateringAmounts, wateringHistory, wateringSectionY, weather, zipCoords, zone }) {
  // Daylight card is a once-a-day glance: once the user has seen today's daylight
  // length it hides until tomorrow. The show/hide decision is frozen at mount so
  // marking it viewed this session doesn't make it vanish mid-read.
  const [daylightViewedDate, setDaylightViewedDate] = useState(null);
  const daylightViewedAtMount = useRef(null);
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem("pp_daylightViewedDate").then((v) => {
      if (!alive) return;
      if (daylightViewedAtMount.current === null) daylightViewedAtMount.current = v === getTodayKey();
      setDaylightViewedDate(v);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const markDaylightViewed = () => {
    const today = getTodayKey();
    if (daylightViewedDate === today) return;
    setDaylightViewedDate(today);
    AsyncStorage.setItem("pp_daylightViewedDate", today).catch(() => {});
  };
  const showDaylight = !!zipCoords && daylightViewedAtMount.current !== true;

  // "On this day" throwbacks appear less and less over time — track how many times
  // it's been shown and the last day it appeared so the card can back off. Wait for
  // the stored value to load before deciding, so the cooldown is respected.
  const [onThisDaySeen, setOnThisDaySeen] = useState(null);
  const [onThisDayLoaded, setOnThisDayLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem("pp_onThisDaySeen").then((v) => {
      if (!alive) return;
      if (v) { try { setOnThisDaySeen(JSON.parse(v)); } catch (e) { /* ignore */ } }
      setOnThisDayLoaded(true);
    }).catch(() => { if (alive) setOnThisDayLoaded(true); });
    return () => { alive = false; };
  }, []);
  const markOnThisDaySeen = (todayKey) => {
    setOnThisDaySeen((prev) => {
      if (prev?.lastShownDate === todayKey) return prev;
      const next = { count: (prev?.count || 0) + 1, lastShownDate: todayKey };
      AsyncStorage.setItem("pp_onThisDaySeen", JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

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
          : frost.daysOut === 1 ? t("home.tomorrowNight")
          : `in ${frost.daysOut} days`;
        const countdownText =
          frost.daysOut === 0 ? t("home.tonight")
          : frost.daysOut === 1 ? t("home.n1NightAway")
          : `❄️ ${frost.daysOut} nights away`;
        return (
          <View style={[styles.frostBanner, { borderColor: "#6bc7ff" }]}>
            <Text style={styles.frostBannerIcon}>❄️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.frostBannerTitle}>{t("home.frostExpected")} {whenText}</Text>
              <View style={{ alignSelf: "flex-start", marginTop: 6, marginBottom: 6, backgroundColor: "rgba(107, 199, 255, 0.16)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.3)" }}>
                <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900" }}>{countdownText}</Text>
              </View>
              <Text style={styles.frostBannerText}>
                {t("home.lowOf")} {formatTemp(frost.minTempF, unitSystem, true)} {t("home.comingCoverTenderPlantsMove")}
              </Text>
            </View>
           <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.dismiss")} onPress={dismissBanner} hitSlop={10} style={{ padding: 4 }}>
              <Text style={{ color: "#6bc7ff", fontSize: 18, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        );
      }
      if (extremeHeat) {
        return (
          <View style={[styles.frostBanner, { borderColor: "#ff7b7b", backgroundColor: "rgba(255, 123, 123, 0.1)" }]}>
            <Text style={styles.frostBannerIcon}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.frostBannerTitle, { color: "#ff7b7b" }]}>{t("home.extremeHeatToday")}</Text>
              <Text style={styles.frostBannerText}>
                {t("home.highOf")} {formatTemp(weather.maxTempF, unitSystem, true)} {t("home.waterBefore9AmShade")}
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.dismiss")} onPress={dismissBanner} hitSlop={10} style={{ padding: 4 }}>
              <Text style={{ color: "#ff7b7b", fontSize: 18, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        );
      }
      const rainSkip = getRainSkipToday(weather);
      if (rainSkip) {
        return (
          <View style={[styles.frostBanner, { borderColor: "#6bc7ff", backgroundColor: "rgba(107, 199, 255, 0.1)" }]}>
            <Text style={styles.frostBannerIcon}>🌧️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.frostBannerTitle, { color: "#6bc7ff" }]}>{t("home.wateringSkippedToday")}</Text>
              <Text style={styles.frostBannerText}>
                {rainSkip.chance}{t("home.chanceOfRainPocketPlanter")}
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.dismiss")} onPress={dismissBanner} hitSlop={10} style={{ padding: 4 }}>
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
          <IconText label={t("home.whatsNew")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.5
}} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("a11y.dismiss")}
            onPress={() => { setShowWhatsNew(false); AsyncStorage.setItem("pp_whatsNewSeen", WHATS_NEW_VERSION).catch(() => {}); }}
            hitSlop={10}
            style={{ padding: 4 }}
          >
            <Text style={{ color: "#8fbf9d", fontSize: 18, fontWeight: "900" }}>✕</Text>
          </Pressable>
        </View>
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900", marginTop: 6 }}>{t("home.freshUpdates")}</Text>
        <View style={{ marginTop: 12, gap: 8 }}>
          {WHATS_NEW_ITEMS.map((item) => (
            <Text key={item} style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "700", lineHeight: 20 }}>{item}</Text>
          ))}
        </View>
        <Pressable
          onPress={() => { setShowWhatsNew(false); AsyncStorage.setItem("pp_whatsNewSeen", WHATS_NEW_VERSION).catch(() => {}); }}
          style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}
        >
          <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>{t("home.gotIt")}</Text>
        </Pressable>
      </View>
    ) : null}
    <TabHero
      tabKey="home"
      source={homeBuddyImage}
      style={{
        width: "100%",
        height: SCREEN_WIDTH * 0.6,
        borderRadius: 24,
        marginBottom: 18,
      }}
    />

    {/* GLOBAL SEARCH */}
    <Pressable
      onPress={onOpenSearch}
      accessibilityRole="button"
      accessibilityLabel={t("home.searchPlantsPestsAndJournal")}
      style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)", marginBottom: 18 }}
    >
      <Text style={{ fontSize: 16 }}>🔍</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "700" }}>{t("home.searchPlantsPestsJournal")}</Text>
    </Pressable>

            {/* Growing zone card moved to the bottom of the page */}

              <PlantAnniversaryCard
                theme={theme}
                plantSaveDates={plantSaveDates}
                savedPlants={savedPlants}
                onOpenPlant={openPlantFromList}
              />

{onThisDayLoaded ? (
              <OnThisDayCard
                theme={theme}
                journalEntries={journalEntries}
                harvestLog={harvestLog}
                onOpenPlant={openPlantFromList}
                seen={onThisDaySeen}
                onShown={markOnThisDaySeen}
              />
              ) : null}

              <FrostChecklistCard
                theme={theme}
                weather={weather}
                frostChecklist={frostChecklist}
                setFrostChecklist={setFrostChecklist}
              />

              {!gettingStartedDismissed && Array.isArray(activationSteps) ? (
                <GettingStartedCard
                  theme={theme}
                  steps={activationSteps}
                  onGoToStep={(step) => jumpToTab(step.route)}
                  onDismiss={dismissGettingStarted}
                />
              ) : null}

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

<CollapsibleCard theme={theme} storageKey="dashboard" title={t("home.gardenDashboard")} defaultOpen={true}>
{premiumUnlocked ? (
<GardenStatsDashboard
  theme={theme}
  unitSystem={unitSystem}
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
) : (
<GardenStatsPreview
  theme={theme}
  unitSystem={unitSystem}
  savedPlants={savedPlants}
  gardenXP={gardenXP}
  streakData={streakData}
  weather={weather}
  zone={zone}
  gardenMap={combinedGardenMap}
  onUnlock={() => jumpToTab("premium")}
/>
)}
</CollapsibleCard>

<MyGardenTodayCard
  theme={theme}
  unitSystem={unitSystem}
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
  snoozedPlants={snoozedPlants}
  compatiblePlants={compatiblePlants}
zone={zone}
  gardenMap={combinedGardenMap}
  onNavigate={jumpToTab}
/>
{((monthlySuggestions.length || compatiblePlants.length) && plantPickDismissedDate !== getTodayKey()) ? (
<CollapsibleCard theme={theme} storageKey="plantpick" title={t("home.plantPick")}>
{premiumUnlocked ? (
<PlantTodayHero
  theme={theme}
  monthlySuggestions={monthlySuggestions}
  compatiblePlants={compatiblePlants}
  savedPlants={savedPlants}
  zone={zone}
  weather={weather}
  onOpen={(plant) => {
    const today = getTodayKey();
    setPlantPickDismissedDate(today);
    AsyncStorage.setItem("pp_plantPickDismissedDate", today).catch(() => {});
    openPlantFromList(plant);
  }}
/>
) : (
<PremiumLockedCard
  theme={theme}
  title="Plant pick locked"
  body="Unlock Premium to get a daily plant pick matched to your zone and the weather."
  onUnlock={() => jumpToTab("premium")}
/>
)}
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

{/* Frost window warning stays on its own; frost tools hide entirely in frost-free zones (USDA 10+). */}
{zoneIsFrostFree(zone) ? null : (
  <FrostWindowCard
    theme={theme}
    plants={compatiblePlants}
    zone={zone}
    onOpenPlant={openPlantFromList}
  />
)}

{showDaylight ? (
<CollapsibleCard theme={theme} storageKey="daylight" title={t("home.daylightToday")} defaultOpen={true}>
<DaylightCard theme={theme} zipCoords={zipCoords} onViewed={markDaylightViewed} />
</CollapsibleCard>
) : null}

{zone && !isMonthlyChecklistComplete(zone, monthlyChecklist) ? (
<CollapsibleCard theme={theme} storageKey="monthlychecklist" title={t("home.thisMonth")}>
{premiumUnlocked ? (
<MonthlyChecklistCard theme={theme} zone={zone} monthlyChecklist={monthlyChecklist} setMonthlyChecklist={setMonthlyChecklist} />
) : (
<PremiumLockedCard
  theme={theme}
  title="This month's tasks locked"
  body="Unlock Premium to see the seasonal to-do list tailored to your zone each month."
  onUnlock={() => jumpToTab("premium")}
/>
)}
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


{((zone && savedPlants.length) || !zoneIsFrostFree(zone)) ? (
<CollapsibleCard theme={theme} storageKey="plantingsowingfrost" title={t("home.plantingSowingFrost")} defaultOpen={false}>
  {!premiumUnlocked ? (
    <PremiumLockedCard
      theme={theme}
      title="Planting, sowing & frost locked"
      body="Unlock Premium for your planting & harvest calendar, succession sowing, and local frost dates."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (zone && savedPlants.length) ? (
    <>
      <IconText label={t("home.plantingHarvestCalendar")} style={{
  color: "#5cff89",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
      <PlantingCalendarCard theme={theme} savedPlants={savedPlants} zone={zone} onOpenPlant={openPlantFromList} />
      <ToggleSection label={t("home.successionSowing")} closeLabel={t("home.closeSuccessionSowing")}>
        <SuccessionSowingCard theme={theme} savedPlants={savedPlants} zone={zone} sowLog={sowLog} onSow={(name) => setSowLog((c) => ({ ...c, [name]: getTodayKey() }))} />
      </ToggleSection>
    </>
  ) : null}
  {premiumUnlocked && !zoneIsFrostFree(zone) ? (
    frostDatesHidden ? (
      // When hidden, the unhide control lives right here — where the frost
      // section was — instead of jumping to the top of the page.
      <Pressable
        onPress={() => setFrostDatesHidden(false)}
        accessibilityRole="button"
        style={{ backgroundColor: "rgba(107, 199, 255, 0.08)", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.2)", alignItems: "center", justifyContent: "center" }}
      >
        <IconText label={t("home.showFrostDatesCard")} style={{
  color: theme.secondaryText,
  fontSize: 12,
  fontWeight: "800"
}} />
      </Pressable>
    ) : (
      <ToggleSection label={t("home.frostDates")} closeLabel={t("home.closeFrostDates")} accent="blue">
        <FrostOverrideCard theme={theme} zone={zone} frostOverrides={frostOverrides} onSave={setFrostOverrides} onHide={() => setFrostDatesHidden(true)} />
      </ToggleSection>
    )
  ) : null}
</CollapsibleCard>
) : null}

{savedPlants.length ? (
<CollapsibleCard theme={theme} storageKey="savedplants" title={t("home.savedPlants")}>
<SavedPlantsCard theme={theme} savedPlants={savedPlants} plantFolders={plantFolders} premiumUnlocked={premiumUnlocked} wateredPlants={wateredPlants} wateringHistory={wateringHistory} weather={weather} harvestTrackers={harvestTrackers} pinnedPlants={pinnedPlants} onTogglePin={togglePinnedPlant} onOpenPlant={openPlantFromList} onUpgrade={() => jumpToTab("premium")} />
</CollapsibleCard>
) : null}

{(streakData?.count || 0) >= 3 ? (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: streakFreeze.available ? "rgba(163, 213, 255, 0.1)" : "rgba(255, 255, 255, 0.04)", borderRadius: 16, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: streakFreeze.available ? "rgba(163, 213, 255, 0.3)" : "rgba(255, 255, 255, 0.08)" }}>
    <Text style={{ fontSize: 28 }}>❄️</Text>
    <View style={{ flex: 1 }}>
      <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{t("home.streakFreeze")}</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
        {streakFreeze.available ? t("home.protectYourStreakOnA") : t("home.usedThisWeekRefreshesNext")}
      </Text>
    </View>
    <Pressable
      onPress={useStreakFreeze}
      disabled={!streakFreeze.available}
      accessibilityRole="button"
      accessibilityLabel={t("home.useStreakFreeze")}
      style={{ backgroundColor: streakFreeze.available ? "#a3d5ff" : "rgba(255, 255, 255, 0.08)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }}
    >
      <Text style={{ color: streakFreeze.available ? "#07120b" : "#8fbf9d", fontSize: 12, fontWeight: "900" }}>
        {streakFreeze.available ? "Use" : "Used"}
      </Text>
    </Pressable>
  </View>
) : null}

    {/* GROWING ZONE — moved to the bottom of the home page */}
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: theme.card, borderRadius: 24, padding: 16, marginTop: 4, marginBottom: 8, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.3)" }}>
      <View>
        <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.5 }}>{t("zone.yourZone")}</Text>
        <Text style={{ color: "#ffffff", fontSize: 28, fontWeight: "900", marginTop: 2 }}>{t("zone.zoneN", { zone: record.zone })}</Text>
        <Text style={{ color: "#d7ebdc", fontSize: 12, fontWeight: "700", marginTop: 2 }}>{record.zonetitle}</Text>
      </View>
      <Pressable
        onPress={() => {
          Alert.alert(
            t("zone.changeTitle"),
            t("zone.changeBody"),
            [
              { text: t("common.cancel"), style: "cancel" },
              { text: t("zone.changeConfirm"), style: "destructive", onPress: () => setZip("") },
            ]
          );
        }}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.12)" }}
      >
        <Text style={{ color: "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{t("zone.change")}</Text>
      </Pressable>
    </View>
            </>
  );
}
