import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { SCREEN_WIDTH, findGardenConflicts, gardenBuddyImage, getPowerPairs } from "../core";
import { AreaPlannerMap } from "../components/AreaPlannerMap";
import { TabHero } from "../components/TabHero";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { FertilizerIntelligenceCard } from "../components/FertilizerIntelligenceCard";
import { FixMyGardenCard } from "../components/FixMyGardenCard";
import { GardenAreaManager } from "../components/GardenAreaManager";
import { GardenShoppingListCard } from "../components/GardenShoppingListCard";
import { GardenToolkitCard } from "../components/GardenToolkitCard";
import { BedPlannerCard } from "../components/BedPlannerCard";
import { GardenPlanExportCard } from "../components/GardenPlanExportCard";
import { GuildTemplatesCard } from "../components/GuildTemplatesCard";
import { PollinatorPlannerCard } from "../components/PollinatorPlannerCard";
import { PowerPairsCard } from "../components/PowerPairsCard";
import { QuickAddCard } from "../components/QuickAddCard";
import { SeedInventoryCard } from "../components/SeedInventoryCard";
import { SegmentedCard } from "../components/SegmentedCard";
import { ShadeAdvisorCard } from "../components/ShadeAdvisorCard";
import { SoilCareLogCard } from "../components/SoilCareLogCard";
import { ToggleSection } from "../components/ToggleSection";
import { SunlightTrackerCard } from "../components/SunlightTrackerCard";
import { WishlistCard } from "../components/WishlistCard";
import { SunlightMismatchCard } from "../components/SunlightMismatchCard";

export function GardenTab({ addGardenArea, assignPlantToAreaSlot, careLog, clearAreaSlot, deleteGardenArea, fertilizerTrackers, gardenAreas, gardenY, harvestTrackers, onAutoOptimize, onSavePlant, openPlantFromList, pickAreaPhoto, renameGardenArea, savedPlants, scheduleFertilizerReminder, setAreaStyle, setCareLog, showUndoToast, theme, waterArea, wateredPlants, weather, zip, zone }) {
  const plantedNames = Array.from(new Set((gardenAreas || []).flatMap((a) => Object.values(a.plots || {}).filter(Boolean))));
  const [toolkitDone, setToolkitDone] = useState(false);
  return (
<>
   <TabHero
  tabKey="garden"
  source={gardenBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
/>
<View onLayout={(event) => { gardenY.current = event.nativeEvent.layout.y; }} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
<Text style={[styles.cardTitle, { color: theme.text }]}>Garden Map & Companion Help</Text>
      <GardenAreaManager
        theme={theme}
        gardenAreas={gardenAreas}
        onAddArea={addGardenArea}
        onRenameArea={renameGardenArea}
        onDeleteArea={deleteGardenArea}
        onSetAreaStyle={setAreaStyle}
      />
      {savedPlants.length ? (
       <AreaPlannerMap
          onDeleteArea={deleteGardenArea}
          theme={theme}
          gardenAreas={gardenAreas}
          onPickPhoto={pickAreaPhoto}
          savedPlants={produceData.filter((item) => savedPlants.includes(item.name))}
          wateredPlants={wateredPlants}
          onAssignSlot={assignPlantToAreaSlot}
          onClearSlot={clearAreaSlot}
          onWaterArea={waterArea}
          zone={zone}
          weather={weather}
          harvestTrackers={harvestTrackers}
          onOpenPlant={openPlantFromList}
        />
      ) : (
        <View style={styles.emptyStateCard}>
          <Text style={styles.emptyStateIcon}>🗺️</Text>
          <Text style={styles.emptyStateTitle}>Build Your First Garden</Text>
          <Text style={styles.emptyStateText}>Save a few plants first, then place them into your garden layout and track companion planting compatibility.</Text>
        </View>
      )}
      <ToggleSection label="⚡ Quick Add Plants" closeLabel="✕ Close Quick Add" marginTop={16}>
        <QuickAddCard theme={theme} savedPlants={savedPlants} onSavePlant={onSavePlant} onOpenPlant={openPlantFromList} />
      </ToggleSection>
      <ToggleSection label="🧪 Garden Care Tracker" closeLabel="✕ Close Garden Care Tracker" marginTop={10}>
        <SoilCareLogCard
          theme={theme}
          savedPlants={savedPlants}
          careLog={careLog}
          setCareLog={setCareLog}
          onFertilizerLogged={scheduleFertilizerReminder}
          onUndoToast={showUndoToast}
        />
      </ToggleSection>
      <ToggleSection label="🧩 Plant Combos" closeLabel="✕ Close Plant Combos" marginTop={10}>
        <GuildTemplatesCard theme={theme} savedPlants={savedPlants} onSavePlant={onSavePlant} onOpenPlant={openPlantFromList} />
      </ToggleSection>
    </View>
    {(getPowerPairs(gardenAreas).length || findGardenConflicts(gardenAreas).length) ? (
    <CollapsibleCard theme={theme} storageKey="companioncheck" title="🌿 Companion Check">
      {(() => {
        const hasPairs = getPowerPairs(gardenAreas).length > 0;
        const hasConflicts = findGardenConflicts(gardenAreas).length > 0;
        const pairsNode = (
          <PowerPairsCard theme={theme} gardenAreas={gardenAreas} onOpenPlant={openPlantFromList} />
        );
        const conflictsNode = (
          <>
            <FixMyGardenCard theme={theme} gardenAreas={gardenAreas} onOpenPlant={openPlantFromList} />
            {onAutoOptimize ? (
              <Pressable
                onPress={onAutoOptimize}
                style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 14, paddingVertical: 13, alignItems: "center" }}
              >
                <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>✨ Auto-optimize my layout</Text>
              </Pressable>
            ) : null}
          </>
        );
        if (hasPairs && hasConflicts) {
          return (
            <SegmentedCard theme={theme} accent="#8effab" tabs={[
              { id: "pairs", label: "🟢 Good Pairs", node: pairsNode },
              { id: "conflicts", label: "🔴 Conflicts", node: conflictsNode },
            ]} />
          );
        }
        return hasConflicts ? conflictsNode : pairsNode;
      })()}
    </CollapsibleCard>
    ) : null}
    <CollapsibleCard theme={theme} storageKey="fertilizer" title="🌿 Fertilizer Intelligence">
    <FertilizerIntelligenceCard
      theme={theme}
      weather={weather}
      zone={zone}
      savedPlants={savedPlants}
      fertilizerTrackers={fertilizerTrackers}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
<SunlightMismatchCard
      theme={theme}
      gardenAreas={gardenAreas}
      onOpenPlant={openPlantFromList}
    />

    <CollapsibleCard theme={theme} storageKey="shoppingtools" title="🛒 Shopping & Tools" defaultOpen={false}>
      {plantedNames.length ? (
        <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: theme.border, paddingBottom: 18 }}>
          <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 8 }}>🛒 SHOPPING LIST</Text>
          <GardenShoppingListCard
            theme={theme}
            gardenAreas={gardenAreas}
            zip={zip}
          />
        </View>
      ) : null}
      {!toolkitDone ? (
        <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: theme.border, paddingBottom: 18 }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 8 }}>🧰 GARDEN TOOLKIT</Text>
          <GardenToolkitCard theme={theme} onCompletionChange={setToolkitDone} />
        </View>
      ) : null}
      <ToggleSection label="🛠️ Garden Tools" closeLabel="✕ Close Garden Tools" marginTop={0}>
        <SegmentedCard theme={theme} accent="#8effab" tabs={[
          { id: "inventory", label: "🌱 Inventory", node: <SeedInventoryCard theme={theme} /> },
          { id: "bed", label: "📐 Bed Calc", node: <BedPlannerCard theme={theme} savedPlants={savedPlants} /> },
          { id: "pollinator", label: "🐝 Pollinators", node: <PollinatorPlannerCard theme={theme} savedPlants={savedPlants} /> },
          { id: "sunlight", label: "☀️ Sunlight", node: <SunlightTrackerCard theme={theme} gardenAreas={gardenAreas} /> },
          { id: "shade", label: "🌥️ Shade", node: <ShadeAdvisorCard theme={theme} gardenAreas={gardenAreas} /> },
          { id: "wishlist", label: "⭐ Wishlist", node: <WishlistCard theme={theme} savedPlants={savedPlants} onOpenPlant={openPlantFromList} /> },
          { id: "export", label: "📤 Export", node: <GardenPlanExportCard theme={theme} gardenAreas={gardenAreas} savedPlants={savedPlants} zone={zone} /> },
        ]} />
      </ToggleSection>
    </CollapsibleCard>
  </>
  );
}
