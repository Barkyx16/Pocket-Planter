import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getDateKey, isFlowerBedPlant } from "../core";
import { styles } from "../styles";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { SegmentedCard } from "../components/SegmentedCard";
import { GardenAreaManager } from "../components/GardenAreaManager";
import { PremiumLockedCard } from "../components/PremiumLockedCard";
import { GuildTemplatesCard } from "../components/GuildTemplatesCard";
import { GlowPlantCard } from "../components/GlowPlantCard";
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
  onSavePlant, onSaveMany, onAddSetupToGarden,
  premiumUnlocked, onViewPremium, toggleSavedPlant, toggleComparePlant, comparePlants = [],
  toggleFollowPlant, followedPlants = [], markPlantWatered, addPlantToGarden,
  snoozePlantWatering, snoozedPlants = {}, gardenPlantNames, wateringHistory,
}) {
  // Browse every flower & houseplant, same as the Plants tab lists every edible.
  // Free users get a taste and then hit the upgrade wall.
  const FREE_FLOWER_LIMIT = 6;
  const [flowerVisible, setFlowerVisible] = useState(20);
  const flowerCatalog = produceData
    .filter((item) => isFlowerBedPlant(item.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  const flowerShown = premiumUnlocked
    ? flowerCatalog.slice(0, flowerVisible)
    : flowerCatalog.slice(0, FREE_FLOWER_LIMIT);
  const open = openPlantFromList;
  const flowerAreas = (gardenAreas || []).filter((a) => a.kind === "flower");
  // The Flowers & Home garden holds both flowers and houseplants.
  const flowerSaved = produceData.filter(
    (item) => savedPlants.includes(item.name) && isFlowerBedPlant(item.name)
  );

  return (
    <View>
      {/* Every flower & houseplant in the catalog — the Flowers-tab twin of the
          Plants tab list, free-capped the same way. Open by default; the rest of
          the tab's sections stay collapsed so this is what you land on. */}
      <CollapsibleCard theme={theme} storageKey="flower_catalog" title="🌸 All Flowers & Houseplants" defaultOpen={true}>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginBottom: 12 }}>
          {flowerCatalog.length} flowers and houseplants to browse, save, and plant.
        </Text>
        {flowerShown.map((item) => (
          <GlowPlantCard
            key={`flower-${item.name}`}
            plant={item}
            weather={weather}
            zone={zone}
            theme={theme}
            isSaved={savedPlants.includes(item.name)}
            isCompared={comparePlants.includes(item.name)}
            isFollowed={followedPlants.includes(item.name)}
            isInGarden={gardenPlantNames?.has(item.name)}
            isSnoozed={snoozedPlants[item.name] === getDateKey(new Date(Date.now() + 86400000))}
            wateredDate={wateredPlants[item.name]}
            wateredPlants={wateredPlants}
            wateringHistory={wateringHistory}
            onOpen={() => open(item)}
            onSave={() => toggleSavedPlant && toggleSavedPlant(item.name)}
            onCompare={() => toggleComparePlant && toggleComparePlant(item.name)}
            onFollow={() => toggleFollowPlant && toggleFollowPlant(item.name)}
            onAddToGarden={addPlantToGarden ? () => addPlantToGarden(item.name) : undefined}
            onWater={() => markPlantWatered && markPlantWatered(item.name)}
            onSnooze={snoozePlantWatering ? () => snoozePlantWatering(item.name) : undefined}
          />
        ))}
        {!premiumUnlocked && flowerCatalog.length > FREE_FLOWER_LIMIT ? (
          <Pressable
            onPress={onViewPremium}
            accessibilityRole="button"
            accessibilityLabel="Unlock all flowers and houseplants with Premium"
            style={{ marginTop: 14, backgroundColor: "rgba(255, 216, 107, 0.16)", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, alignItems: "center", borderWidth: 1, borderColor: "#ffd86b" }}
          >
            <Text style={{ color: "#ffd86b", fontWeight: "900", fontSize: 14 }}>
              🔒 Unlock all {flowerCatalog.length} flowers & houseplants with Premium
            </Text>
          </Pressable>
        ) : premiumUnlocked && flowerCatalog.length > flowerVisible ? (
          <Pressable
            onPress={() => setFlowerVisible((c) => c + 20)}
            style={{ marginTop: 14, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
          >
            <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>
              Show more — {flowerCatalog.length - flowerVisible} more
            </Text>
          </Pressable>
        ) : null}
      </CollapsibleCard>

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

      {/* Flower & houseplant combos only — the edible combos live on the Garden tab. */}
      <CollapsibleCard theme={theme} storageKey="flower_combos" title="💐 Flower & Houseplant Combos">
      {premiumUnlocked ? (
        <GuildTemplatesCard
          theme={theme}
          mode="flower"
          savedPlants={savedPlants}
          onSavePlant={onSavePlant}
          onSaveMany={onSaveMany}
          onAddSetup={onAddSetupToGarden}
          onOpenPlant={open}
        />
      ) : (
        <PremiumLockedCard
          theme={theme}
          title="Flower combos locked"
          body="Unlock Premium for proven flower and houseplant combos you can plant as a ready-made bed."
          onUnlock={onViewPremium}
        />
      )}
      </CollapsibleCard>

      <CollapsibleCard theme={theme} storageKey="flowers_blooms" title="🌸 Blooms & Flowers">
      {premiumUnlocked ? (
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
      ) : (
        <PremiumLockedCard
          theme={theme}
          title="Blooms & bouquets locked"
          body="Unlock Premium for pollinator planning, cut-flower guides, and vase tracking."
          onUnlock={onViewPremium}
        />
      )}
      </CollapsibleCard>

      <CollapsibleCard theme={theme} storageKey="flowers_tools" title="🪴 Home & Care Tools">
      {premiumUnlocked ? (
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
      ) : (
        <PremiumLockedCard
          theme={theme}
          title="Home & care tools locked"
          body="Unlock Premium for houseplant care schedules, rooms, pet-safe checks, and propagation tracking."
          onUnlock={onViewPremium}
        />
      )}
      </CollapsibleCard>
    </View>
  );
}
