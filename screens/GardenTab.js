import { Image, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { SCREEN_WIDTH, findGardenConflicts, gardenBuddyImage } from "../core";
import { AreaPlannerMap } from "../components/AreaPlannerMap";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { FertilizerIntelligenceCard } from "../components/FertilizerIntelligenceCard";
import { FixMyGardenCard } from "../components/FixMyGardenCard";
import { GardenAreaManager } from "../components/GardenAreaManager";
import { GardenShoppingListCard } from "../components/GardenShoppingListCard";
import { PowerPairsCard } from "../components/PowerPairsCard";
import { SunlightMismatchCard } from "../components/SunlightMismatchCard";

export function GardenTab({ addGardenArea, assignPlantToAreaSlot, clearAreaSlot, deleteGardenArea, fertilizerTrackers, gardenAreas, gardenY, harvestTrackers, openPlantFromList, pickAreaPhoto, renameGardenArea, savedPlants, setAreaStyle, theme, waterArea, wateredPlants, weather, zip, zone }) {
  return (
<>
   <Image
 source={gardenBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
  resizeMode="cover"
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
    </View>
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
    <CollapsibleCard theme={theme} storageKey="shopping" title="🛒 Shopping List">
    <GardenShoppingListCard
      theme={theme}
      gardenAreas={gardenAreas}
      zip={zip}
    />
    </CollapsibleCard>

<SunlightMismatchCard
      theme={theme}
      gardenAreas={gardenAreas}
      onOpenPlant={openPlantFromList}
    />

<PowerPairsCard
      theme={theme}
      gardenAreas={gardenAreas}
      onOpenPlant={openPlantFromList}
    />

{findGardenConflicts(gardenAreas).length ? (
    <CollapsibleCard theme={theme} storageKey="fixgarden" title="🔧 Fix My Garden">
    <FixMyGardenCard
      theme={theme}
      gardenAreas={gardenAreas}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
    ) : null}
  </>
  );
}
