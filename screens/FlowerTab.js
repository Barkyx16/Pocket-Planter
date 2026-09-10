import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getTomorrowKey, isFlowerBedPlant } from "../core";
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
import { useTranslation } from "../lib/i18n";

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
  const { t } = useTranslation();
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
      <CollapsibleCard theme={theme} storageKey="flower_catalog" title={t("flowerTab.allFlowersTitle")} defaultOpen={true}>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginBottom: 12 }}>
          {t("flowerTab.catalogCount", { count: flowerCatalog.length })}
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
            isSnoozed={snoozedPlants[item.name] === getTomorrowKey()}
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
            accessibilityLabel={t("flowerTab.unlockAllA11y")}
            style={{ marginTop: 14, backgroundColor: "rgba(255, 216, 107, 0.16)", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, alignItems: "center", borderWidth: 1, borderColor: "#ffd86b" }}
          >
            <Text style={{ color: "#ffd86b", fontWeight: "900", fontSize: 14 }}>
              {t("flowerTab.unlockAllCta", { count: flowerCatalog.length })}
            </Text>
          </Pressable>
        ) : premiumUnlocked && flowerCatalog.length > flowerVisible ? (
          <Pressable
            onPress={() => setFlowerVisible((c) => c + 20)}
            style={{ marginTop: 14, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
          >
            <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>
              {t("flowerTab.showMore", { count: flowerCatalog.length - flowerVisible })}
            </Text>
          </Pressable>
        ) : null}
      </CollapsibleCard>

      {/* The flower planner — works like the Garden tab's map, but flowers only. */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{t("flowerTab.flowerGarden")}</Text>
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
            <Text style={styles.emptyStateTitle}>{t("flowerTab.planYourBeds")}</Text>
            <Text style={styles.emptyStateText}>{t("flowerTab.planYourBedsBody")}</Text>
          </View>
        )}
      </View>

      {/* Flower & houseplant combos only — the edible combos live on the Garden tab. */}
      <CollapsibleCard theme={theme} storageKey="flower_combos" title={t("flowerTab.combosTitle")}>
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
          title={t("flowerTab.combosLocked")}
          body={t("flowerTab.combosLockedBody")}
          onUnlock={onViewPremium}
        />
      )}
      </CollapsibleCard>

      <CollapsibleCard theme={theme} storageKey="flowers_blooms" title={t("flowerTab.bloomsTitle")}>
      {premiumUnlocked ? (
        <SegmentedCard
          theme={theme}
          accent="#ffb6c1"
          tabs={[
            { id: "pollinators", label: t("flowerTab.pollinators"), node: <PollinatorPlannerCard theme={theme} savedPlants={savedPlants} onOpenPlant={open} /> },
            { id: "bouquets", label: t("flowerTab.bouquets"), node: (
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
          title={t("flowerTab.bloomsLocked")}
          body={t("flowerTab.bloomsLockedBody")}
          onUnlock={onViewPremium}
        />
      )}
      </CollapsibleCard>

      <CollapsibleCard theme={theme} storageKey="flowers_tools" title={t("flowerTab.homeToolsTitle")}>
      {premiumUnlocked ? (
        <SegmentedCard
          theme={theme}
          accent="#ffb6c1"
          tabs={[
            { id: "houseplants", label: t("flowerTab.houseplants"), node: <HouseplantCareCard theme={theme} savedPlants={savedPlants} onOpenPlant={open} /> },
            { id: "carelog", label: t("flowerTab.careLog"), node: <HouseplantCareLogSection theme={theme} savedPlants={savedPlants} onOpenPlant={open} /> },
            { id: "rooms", label: t("flowerTab.rooms"), node: <PlantRoomsSection theme={theme} savedPlants={savedPlants} /> },
            { id: "petsafe", label: t("flowerTab.petSafe"), node: <PetSafeSection theme={theme} savedPlants={savedPlants} onOpenPlant={open} /> },
            { id: "propagate", label: t("flowerTab.propagate"), node: <PropagationTrackerCard theme={theme} /> },
          ]}
        />
      ) : (
        <PremiumLockedCard
          theme={theme}
          title={t("flowerTab.homeToolsLocked")}
          body={t("flowerTab.homeToolsLockedBody")}
          onUnlock={onViewPremium}
        />
      )}
      </CollapsibleCard>
    </View>
  );
}
