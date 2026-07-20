import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SCREEN_WIDTH, journalBuddyImage } from "../core";
import { styles } from "../styles";
import { AllNotesCard } from "../components/AllNotesCard";
import { TabHero } from "../components/TabHero";
import { CollapsibleCard } from "../components/CollapsibleCard";
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

export function JournalTab({ careLog, deleteJournalEntry, harvestGoal, harvestLog, journalEntries, journalY, openPlantFromList, pickJournalPhoto, plantNotes, savedPlants, scheduleFertilizerReminder, setCareLog, setHarvestGoal, setHarvestLog, setWateringAmounts, showUndoToast, theme, uploadingPhoto, wateringAmounts, zone }) {
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
        height: SCREEN_WIDTH * 1.35,
        borderRadius: 24,
        marginBottom: 18,
      }}
    />
<CollapsibleCard theme={theme} storageKey="journal" title="📸 Garden Journal" defaultOpen={true}>
  <JournalCard theme={theme} journalEntries={journalEntries} onAddGeneralPhoto={() => pickJournalPhoto("Garden")} onDeleteEntry={deleteJournalEntry} uploadingPhoto={uploadingPhoto} />
  </CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="thriving" title="🌍 Thriving Near You">
  <ThrivingNearYouCard theme={theme} zone={zone} onOpenPlant={openPlantFromList} />
  </CollapsibleCard>
<HarvestRevealCard theme={theme} journalEntries={journalEntries} harvestLog={harvestLog} onOpenPlant={openPlantFromList} />
<AllNotesCard theme={theme} plantNotes={plantNotes} onOpenPlant={openPlantFromList} />
<CollapsibleCard theme={theme} storageKey="harvestwater" title="🚜 Harvest">
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
    style={{ flexGrow: 1, flexBasis: "30%", backgroundColor: showHarvestGoal ? "rgba(255,216,107,0.14)" : "rgba(255,216,107,0.10)", borderRadius: 12, paddingVertical: 11, alignItems: "center", borderWidth: 1, borderColor: showHarvestGoal ? "#ffd86b" : "rgba(255,216,107,0.24)" }}
  >
    <Text style={{ color: "#ffd86b", fontSize: 13, fontWeight: "900" }}>🎯 Goal</Text>
  </Pressable>
  <Pressable
    onPress={() => setShowRecipes((v) => !v)}
    accessibilityRole="button"
    style={{ flexGrow: 1, flexBasis: "30%", backgroundColor: showRecipes ? "rgba(255,216,107,0.14)" : "rgba(255,216,107,0.10)", borderRadius: 12, paddingVertical: 11, alignItems: "center", borderWidth: 1, borderColor: showRecipes ? "#ffd86b" : "rgba(255,216,107,0.24)" }}
  >
    <Text style={{ color: "#ffd86b", fontSize: 13, fontWeight: "900" }}>🍽️ Recipes</Text>
  </Pressable>
  <Pressable
    onPress={() => setShowStorage((v) => !v)}
    accessibilityRole="button"
    style={{ flexGrow: 1, flexBasis: "30%", backgroundColor: showStorage ? "rgba(255,216,107,0.14)" : "rgba(255,216,107,0.10)", borderRadius: 12, paddingVertical: 11, alignItems: "center", borderWidth: 1, borderColor: showStorage ? "#ffd86b" : "rgba(255,216,107,0.24)" }}
  >
    <Text style={{ color: "#ffd86b", fontSize: 13, fontWeight: "900" }}>🧊 Storage</Text>
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

<CollapsibleCard theme={theme} storageKey="harvesttools" title="📓 Journal Tools" defaultOpen={false}>
  <SegmentedCard theme={theme} accent="#6bc7ff" tabs={[
    { id: "timelapse", label: "🎞️ Timelapse", node: <GrowthTimelapseCard theme={theme} journalEntries={journalEntries} /> },
    { id: "soil", label: "🧫 Soil Test", node: <SoilTestLogCard theme={theme} /> },
  ]} />
</CollapsibleCard>
  </View>
  );
}
