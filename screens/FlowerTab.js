import { Text, View } from "react-native";
import produceData from "../data/produceData";
import { isFlowerBedPlant } from "../core";
import { styles } from "../styles";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { SegmentedCard } from "../components/SegmentedCard";
import { GardenAreaManager } from "../components/GardenAreaManager";
import { AreaPlannerMap } from "../components/AreaPlannerMap";
import { PollinatorPlannerCard } from "../components/PollinatorPlannerCard";
import { CutFlowerGuideCard } from "../components/CutFlowerGuideCard";
import { VaseTrackerSection } from "../components/VaseTrackerSection";
import { HouseplantCareCard } from "../components/HouseplantCareCard";
import { HouseplantCareLogSection } from "../components/HouseplantCareLogSection";
import { PlantRoomsSection } from "../components/PlantRoomsSection";
import { PetSafeSection } from "../components/PetSafeSection";
import { PropagationTrackerCard } from "../components/PropagationTrackerCard";

export function FlowerTab({
  theme, savedPlants, openPlantFromList,
  gardenAreas, addGardenArea, assignPlantToAreaSlot, clearAreaSlot, deleteGardenArea,
  waterArea, pickAreaPhoto, harvestTrackers, wateredPlants, weather, zone,
}) {
  const open = openPlantFromList;
  const flowerAreas = (gardenAreas || []).filter((a) => a.kind === "flower");
  // The Flowers & Home garden holds both flowers and houseplants.
  const flowerSaved = produceData.filter(
    (item) => savedPlants.includes(item.name) && isFlowerBedPlant(item.name)
  );

  return (
    <View>
      {/* The flower planner — works like the Garden tab's map, but flowers only. */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>🌸 Flower Garden</Text>
        <GardenAreaManager theme={theme} gardenAreas={flowerAreas} onAddArea={addGardenArea} mode="flower" />
        {flowerSaved.length ? (
          <AreaPlannerMap
            theme={theme}
            gardenAreas={flowerAreas}
            savedPlants={flowerSaved}
            wateredPlants={wateredPlants}
            onAssignSlot={assignPlantToAreaSlot}
            onClearSlot={clearAreaSlot}
            onWaterArea={waterArea}
            zone={zone}
            weather={weather}
            harvestTrackers={harvestTrackers}
            onOpenPlant={open}
            onPickPhoto={pickAreaPhoto}
            onDeleteArea={deleteGardenArea}
          />
        ) : (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateIcon}>🌸</Text>
            <Text style={styles.emptyStateTitle}>Plan your flower & houseplant beds</Text>
            <Text style={styles.emptyStateText}>Save some flowers or houseplants from the Plants tab, then add a bed above to arrange them.</Text>
          </View>
        )}
      </View>

      <CollapsibleCard theme={theme} storageKey="flowers_blooms" title="🌸 Blooms & Flowers" defaultOpen={true}>
        <SegmentedCard
          theme={theme}
          accent="#ffb6c1"
          tabs={[
            { id: "pollinators", label: "🐝 Pollinators", node: <PollinatorPlannerCard theme={theme} savedPlants={savedPlants} onOpenPlant={open} /> },
            { id: "bouquets", label: "💐 Bouquets", node: (
              <View style={{ gap: 18 }}>
                <CutFlowerGuideCard theme={theme} savedPlants={savedPlants} onOpenPlant={open} />
                <VaseTrackerSection theme={theme} />
              </View>
            ) },
          ]}
        />
      </CollapsibleCard>

      <CollapsibleCard theme={theme} storageKey="flowers_tools" title="🪴 Home & Care Tools">
        <SegmentedCard
          theme={theme}
          accent="#ffb6c1"
          tabs={[
            { id: "houseplants", label: "🪴 Houseplants", node: <HouseplantCareCard theme={theme} savedPlants={savedPlants} onOpenPlant={open} /> },
            { id: "carelog", label: "💧 Care Log", node: <HouseplantCareLogSection theme={theme} savedPlants={savedPlants} onOpenPlant={open} /> },
            { id: "rooms", label: "🏠 Rooms", node: <PlantRoomsSection theme={theme} savedPlants={savedPlants} /> },
            { id: "petsafe", label: "🐾 Pet-Safe", node: <PetSafeSection theme={theme} savedPlants={savedPlants} onOpenPlant={open} /> },
            { id: "propagate", label: "🌱 Propagate", node: <PropagationTrackerCard theme={theme} /> },
          ]}
        />
      </CollapsibleCard>
    </View>
  );
}
