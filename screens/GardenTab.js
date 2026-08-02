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
import { GardenCalculatorsSection } from "../components/GardenCalculatorsSection";
import { PairCheckSection } from "../components/PairCheckSection";
import { ToolMaintenanceSection } from "../components/ToolMaintenanceSection";
import { MoonPhaseSection } from "../components/MoonPhaseSection";
import { BedPlannerCard } from "../components/BedPlannerCard";
import { GardenPlanExportCard } from "../components/GardenPlanExportCard";
import { GuildTemplatesCard } from "../components/GuildTemplatesCard";
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
import { IconText } from "../components/IconText";
import { t } from "../lib/i18n";

export function GardenTab({ addGardenArea, assignPlantToAreaSlot, careLog, clearAreaSlot, deleteGardenArea, fertilizerTrackers, gardenAreas, gardenFocusAreaId, gardenY, harvestTrackers, onAddSetupToGarden, onAutoOptimize, onFocusConflict, onSavePlant, onSaveMany, openPlantFromList, pickAreaPhoto, renameGardenArea, savedPlants, scheduleFertilizerReminder, setAreaStyle, setCareLog, showUndoToast, theme, unitSystem, waterArea, wateredPlants, weather, zip, zone }) {
  // The Garden tab is edibles-only — flower beds live on the Flowers tab.
  const edibleAreas = (gardenAreas || []).filter((a) => a.kind !== "flower");
  const plantedNames = Array.from(new Set(edibleAreas.flatMap((a) => Object.values(a.plots || {}).filter(Boolean))));
  const [toolkitDone, setToolkitDone] = useState(false);
  return (
<>
   <TabHero
  tabKey="garden"
  source={gardenBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 0.6,
    borderRadius: 24,
    marginBottom: 18,
  }}
/>
<View onLayout={(event) => { gardenY.current = event.nativeEvent.layout.y; }} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
<Text style={[styles.cardTitle, { color: theme.text }]}>{t("garden.gardenMapCompanionHelp")}</Text>
      <GardenAreaManager
        theme={theme}
        gardenAreas={edibleAreas}
        onAddArea={addGardenArea}
        mode="garden"
      />
      {savedPlants.length ? (
       <AreaPlannerMap
          onDeleteArea={deleteGardenArea}
          theme={theme}
          gardenAreas={edibleAreas}
          focusAreaId={gardenFocusAreaId?.areaId}
          focusNonce={gardenFocusAreaId?.n}
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
          <Text style={styles.emptyStateTitle}>{t("garden.buildYourFirstGarden")}</Text>
          <Text style={styles.emptyStateText}>{t("garden.saveAFewPlantsFirst")}</Text>
        </View>
      )}
      <ToggleSection label={t("garden.quickAddPlants")} closeLabel={t("garden.closeQuickAdd")} marginTop={16}>
        <QuickAddCard theme={theme} savedPlants={savedPlants} onSavePlant={onSavePlant} onOpenPlant={openPlantFromList} />
      </ToggleSection>
      <ToggleSection label={t("garden.plantCombos")} closeLabel={t("garden.closePlantCombos")} marginTop={10}>
        <GuildTemplatesCard theme={theme} mode="garden" savedPlants={savedPlants} onSavePlant={onSavePlant} onSaveMany={onSaveMany} onAddSetup={onAddSetupToGarden} onOpenPlant={openPlantFromList} />
      </ToggleSection>
      {(getPowerPairs(edibleAreas).length || findGardenConflicts(edibleAreas).length) ? (
      <ToggleSection label={t("garden.companionCheck")} marginTop={10}>
      {(() => {
        const hasPairs = getPowerPairs(edibleAreas).length > 0;
        const hasConflicts = findGardenConflicts(edibleAreas).length > 0;
        const pairsNode = (
          <PowerPairsCard theme={theme} gardenAreas={edibleAreas} onOpenPlant={openPlantFromList} />
        );
        const conflictsNode = (
          <>
            <FixMyGardenCard theme={theme} gardenAreas={edibleAreas} onOpenPlant={openPlantFromList} onFocusConflict={onFocusConflict} />
            {onAutoOptimize ? (
              <Pressable
                onPress={onAutoOptimize}
                style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
              >
                <IconText label={t("garden.autooptimizeMyLayout")} style={{
  color: "#07120b",
  fontSize: 14,
  fontWeight: "900"
}} />
              </Pressable>
            ) : null}
          </>
        );
        if (hasPairs && hasConflicts) {
          return (
            <SegmentedCard theme={theme} accent="#8effab" tabs={[
              { id: "pairs", label: t("garden.goodPairs"), node: pairsNode },
              { id: "conflicts", label: t("garden.conflicts"), node: conflictsNode },
            ]} />
          );
        }
        return hasConflicts ? conflictsNode : pairsNode;
      })()}
      </ToggleSection>
      ) : null}
    </View>
    {/* Garden Care Tracker, Fertilizer Intelligence, and Shopping & Tools merged
        into one tabbed card (like the Live Weather card): a SegmentedCard pill
        switcher shows one section at a time. */}
    <CollapsibleCard theme={theme} storageKey="gardencaretools" title={t("garden.careFertilizerTools")} defaultOpen={true}>
      <SegmentedCard theme={theme} accent="#8effab" tabs={[
        { id: "care", label: t("garden.tabCare"), node: (
          <SoilCareLogCard
            theme={theme}
            savedPlants={savedPlants}
            careLog={careLog}
            setCareLog={setCareLog}
            onFertilizerLogged={scheduleFertilizerReminder}
            onUndoToast={showUndoToast}
          />
        ) },
        { id: "fertilizer", label: t("garden.tabFertilizer"), node: (
          <FertilizerIntelligenceCard
            theme={theme}
            weather={weather}
            zone={zone}
            savedPlants={savedPlants}
            fertilizerTrackers={fertilizerTrackers}
            onOpenPlant={openPlantFromList}
          />
        ) },
        { id: "shoptools", label: t("garden.tabShopTools"), node: (
          <>
      {plantedNames.length ? (
        <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: theme.border, paddingBottom: 18 }}>
          <IconText label={t("garden.shoppingList")} style={{
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
          <GardenShoppingListCard
            theme={theme}
            gardenAreas={edibleAreas}
            zip={zip}
          />
        </View>
      ) : null}
      {!toolkitDone ? (
        <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: theme.border, paddingBottom: 18 }}>
          <IconText label={t("garden.gardenToolkit")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
          <GardenToolkitCard theme={theme} onCompletionChange={setToolkitDone} />
        </View>
      ) : null}
      <ToggleSection label={t("garden.gardenTools")} closeLabel={t("garden.closeGardenTools")} marginTop={0}>
        <SegmentedCard theme={theme} accent="#8effab" tabs={[
          { id: "inventory", label: t("garden.inventory"), node: <SeedInventoryCard theme={theme} /> },
          { id: "bed", label: t("garden.bedCalc"), node: <BedPlannerCard theme={theme} savedPlants={savedPlants} /> },
          { id: "calc", label: "🧮 Calc", node: <GardenCalculatorsSection theme={theme} unitSystem={unitSystem} /> },
          { id: "pairs", label: "🤝 Pairs", node: <PairCheckSection theme={theme} savedPlants={savedPlants} /> },
          { id: "toolcare", label: "🔧 Care", node: <ToolMaintenanceSection theme={theme} embedded /> },
          { id: "moon", label: "🌙 Moon", node: <MoonPhaseSection theme={theme} embedded /> },
          { id: "sunlight", label: t("garden.sunlight"), node: <SunlightTrackerCard theme={theme} gardenAreas={edibleAreas} /> },
          { id: "shade", label: t("garden.shade"), node: <ShadeAdvisorCard theme={theme} gardenAreas={edibleAreas} /> },
          { id: "wishlist", label: t("garden.wishlist"), node: <WishlistCard theme={theme} savedPlants={savedPlants} onOpenPlant={openPlantFromList} /> },
          { id: "export", label: t("garden.export"), node: <GardenPlanExportCard theme={theme} gardenAreas={edibleAreas} savedPlants={savedPlants} zone={zone} /> },
        ]} />
      </ToggleSection>
          </>
        ) },
      ]} />
    </CollapsibleCard>
    <SunlightMismatchCard
      theme={theme}
      gardenAreas={edibleAreas}
      onOpenPlant={openPlantFromList}
    />
  </>
  );
}
