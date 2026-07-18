import { Image, View } from "react-native";
import { SCREEN_WIDTH, journalBuddyImage } from "../core";
import { AllNotesCard } from "../components/AllNotesCard";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { DataExportCard } from "../components/DataExportCard";
import { HarvestLogCard } from "../components/HarvestLogCard";
import { HarvestRevealCard } from "../components/HarvestRevealCard";
import { JournalCard } from "../components/JournalCard";
import { SoilCareLogCard } from "../components/SoilCareLogCard";
import { WaterUsageCard } from "../components/WaterUsageCard";

export function JournalTab({ careLog, deleteJournalEntry, harvestLog, journalEntries, journalY, openPlantFromList, pickJournalPhoto, plantNotes, savedPlants, scheduleFertilizerReminder, setCareLog, setHarvestLog, setWateringAmounts, showUndoToast, theme, uploadingPhoto, wateringAmounts }) {
  return (
<View onLayout={(event) => { journalY.current = event.nativeEvent.layout.y; }}>
    <Image
      source={journalBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
<CollapsibleCard theme={theme} storageKey="journal" title="📸 Garden Journal">
  <JournalCard theme={theme} journalEntries={journalEntries} onAddGeneralPhoto={() => pickJournalPhoto("Garden")} onDeleteEntry={deleteJournalEntry} uploadingPhoto={uploadingPhoto} />
  </CollapsibleCard>
<HarvestRevealCard theme={theme} journalEntries={journalEntries} harvestLog={harvestLog} onOpenPlant={openPlantFromList} />
<AllNotesCard theme={theme} plantNotes={plantNotes} onOpenPlant={openPlantFromList} />
<CollapsibleCard theme={theme} storageKey="soilcare" title="🧪 Garden Care Tracker">
<SoilCareLogCard
  theme={theme}
  savedPlants={savedPlants}
  careLog={careLog}
  setCareLog={setCareLog}
  onFertilizerLogged={scheduleFertilizerReminder}
  onUndoToast={showUndoToast}
/>
</CollapsibleCard>
<CollapsibleCard theme={theme} storageKey="harvestlog" title="🚜 Harvest Log">
<HarvestLogCard
  theme={theme}
  harvestLog={harvestLog}
  setHarvestLog={setHarvestLog}
  onUndoToast={showUndoToast}
/>
</CollapsibleCard>

<CollapsibleCard theme={theme} storageKey="waterusage" title="🚿 Water Usage">
<WaterUsageCard
  theme={theme}
  savedPlants={savedPlants}
  wateringAmounts={wateringAmounts}
  setWateringAmounts={setWateringAmounts}
  onUndoToast={showUndoToast}
/>
</CollapsibleCard>

<CollapsibleCard theme={theme} storageKey="dataexport" title="💾 Export & Backup">
<DataExportCard
  theme={theme}
  harvestLog={harvestLog}
  careLog={careLog}
  journalEntries={journalEntries}
/>
</CollapsibleCard>
  </View>
  );
}
