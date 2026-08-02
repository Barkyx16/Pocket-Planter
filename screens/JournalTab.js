import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SCREEN_WIDTH, journalBuddyImage } from "../core";
import { styles } from "../styles";
import { AllNotesCard } from "../components/AllNotesCard";
import { TabHero } from "../components/TabHero";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { GardenTimelineCard } from "../components/GardenTimelineCard";
import { GrowthTimelapseCard } from "../components/GrowthTimelapseCard";
import { HarvestGoalCard } from "../components/HarvestGoalCard";
import { HarvestLogCard } from "../components/HarvestLogCard";
import { HarvestRecipesCard } from "../components/HarvestRecipesCard";
import { HarvestStorageGuideCard } from "../components/HarvestStorageGuideCard";
import { HarvestRevealCard } from "../components/HarvestRevealCard";
import { JournalCard } from "../components/JournalCard";
import { SegmentedCard } from "../components/SegmentedCard";
import { SoilTestLogCard } from "../components/SoilTestLogCard";
import { ThrivingNearYouCard } from "../components/ThrivingNearYouCard";
import { IconText } from "../components/IconText";
import { t } from "../lib/i18n";

export function JournalTab({ achievementBadges, badgeEarnedDates, careLog, deleteJournalEntry, harvestGoal, harvestLog, journalEntries, journalY, openPlantFromList, pickJournalPhoto, plantNotes, plantSaveDates, savedPlants, scheduleFertilizerReminder, setCareLog, setHarvestGoal, setHarvestLog, setWateringAmounts, showUndoToast, sowLog, theme, uploadingPhoto, wateringAmounts, wateringHistory, zone }) {
  const [showHarvestGoal, setShowHarvestGoal] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [showStorage, setShowStorage] = useState(false);
  return (
<View onLayout={(event) => { journalY.current = event.nativeEvent.layout.y; }}>
    <TabHero
      tabKey="journal"
      source={journalBuddyImage}
      style={{
        width: "100%",
        height: SCREEN_WIDTH * 0.6,
        borderRadius: 24,
        marginBottom: 18,
      }}
    />
<CollapsibleCard theme={theme} storageKey="journal" title={t("journal.gardenJournal")} defaultOpen={true}>
  <JournalCard theme={theme} journalEntries={journalEntries} onAddGeneralPhoto={() => pickJournalPhoto("Garden")} onDeleteEntry={deleteJournalEntry} uploadingPhoto={uploadingPhoto} />
  </CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="gardentimeline" title={t("journal.gardenTimeline")} defaultOpen={false}>
  <GardenTimelineCard
    theme={theme}
    journalEntries={journalEntries}
    harvestLog={harvestLog}
    wateringHistory={wateringHistory}
    careLog={careLog}
    sowLog={sowLog}
    plantSaveDates={plantSaveDates}
    badgeEarnedDates={badgeEarnedDates}
    achievementBadges={achievementBadges}
    onOpenPlant={openPlantFromList}
  />
  </CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="thriving" title={t("journal.thrivingNearYou")}>
  <ThrivingNearYouCard theme={theme} zone={zone} onOpenPlant={openPlantFromList} />
  </CollapsibleCard>
<HarvestRevealCard theme={theme} journalEntries={journalEntries} harvestLog={harvestLog} onOpenPlant={openPlantFromList} />
<AllNotesCard theme={theme} plantNotes={plantNotes} onOpenPlant={openPlantFromList} />
<CollapsibleCard theme={theme} storageKey="harvestwater" title={t("journal.harvest")}>
<HarvestLogCard
  theme={theme}
  harvestLog={harvestLog}
  setHarvestLog={setHarvestLog}
  onUndoToast={showUndoToast}
/>
<View style={{ marginTop: 18, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
  <Pressable
    onPress={() => setShowHarvestGoal((v) => !v)}
    accessibilityRole="button"
    style={{ flexGrow: 1, flexBasis: "30%", backgroundColor: showHarvestGoal ? "rgba(255, 216, 107, 0.16)" : "rgba(255, 216, 107, 0.1)", borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: showHarvestGoal ? "#ffd86b" : "rgba(255, 216, 107, 0.24)" }}
  >
    <IconText label={t("journal.goal")} style={{
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900"
}} />
  </Pressable>
  <Pressable
    onPress={() => setShowRecipes((v) => !v)}
    accessibilityRole="button"
    style={{ flexGrow: 1, flexBasis: "30%", backgroundColor: showRecipes ? "rgba(255, 216, 107, 0.16)" : "rgba(255, 216, 107, 0.1)", borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: showRecipes ? "#ffd86b" : "rgba(255, 216, 107, 0.24)" }}
  >
    <IconText label={t("journal.recipes")} style={{
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900"
}} />
  </Pressable>
  <Pressable
    onPress={() => setShowStorage((v) => !v)}
    accessibilityRole="button"
    style={{ flexGrow: 1, flexBasis: "30%", backgroundColor: showStorage ? "rgba(255, 216, 107, 0.16)" : "rgba(255, 216, 107, 0.1)", borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: showStorage ? "#ffd86b" : "rgba(255, 216, 107, 0.24)" }}
  >
    <IconText label={t("journal.storage")} style={{
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900"
}} />
  </Pressable>
</View>
{showHarvestGoal ? (
  <View style={{ marginTop: 16 }}>
    <HarvestGoalCard
      theme={theme}
      harvestLog={harvestLog}
      harvestGoal={harvestGoal}
      setHarvestGoal={setHarvestGoal}
    />
  </View>
) : null}
{showRecipes ? (
  <View style={{ marginTop: 16 }}>
    <HarvestRecipesCard theme={theme} savedPlants={savedPlants} harvestLog={harvestLog} />
  </View>
) : null}
{showStorage ? (
  <View style={{ marginTop: 16 }}>
    <HarvestStorageGuideCard theme={theme} savedPlants={savedPlants} harvestLog={harvestLog} />
  </View>
) : null}
</CollapsibleCard>

<CollapsibleCard theme={theme} storageKey="harvesttools" title={t("journal.journalTools")} defaultOpen={false}>
  <SegmentedCard theme={theme} accent="#6bc7ff" tabs={[
    { id: "timelapse", label: t("journal.timelapse"), node: <GrowthTimelapseCard theme={theme} journalEntries={journalEntries} /> },
    { id: "soil", label: t("journal.soilTest"), node: <SoilTestLogCard theme={theme} /> },
  ]} />
</CollapsibleCard>
  </View>
  );
}
