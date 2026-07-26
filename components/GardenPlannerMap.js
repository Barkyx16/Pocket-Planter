import { memo } from "react";
import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { GARDEN_SLOTS, getCompatibilityScore, getFertilizerDays, getPlantSeasonLabel, getTodayKey, resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const GardenPlannerMap = memo(function GardenPlannerMap({ theme, gardenMap, savedPlants, wateredPlants, onAssign, onClear, zone, weather, harvestTrackers, fertilizerTrackers }) {
  const { t } = useTranslation();
  const [selectedSlot, setSelectedSlot] = useState(null);

  function getPlantName(plant) { return typeof plant === "string" ? plant : plant?.name || ""; }

  function getSlotInsights(plantName, allPlants) {
    if (!plantName) return null;
    const conflicts = allPlants.filter(p => p !== plantName && getCompatibilityScore(plantName, p).label === "Avoid");
    const pairs = allPlants.filter(p => p !== plantName && getCompatibilityScore(plantName, p).label === "Excellent Pair");
    const wateredToday = wateredPlants?.[plantName] === getTodayKey();
    const plant = produceData.find(item => item?.name === plantName);
    const seasonLabel = plant && zone ? getPlantSeasonLabel(plant, zone) : null;
    const harvestTracker = harvestTrackers?.[plantName];
    const harvestDaysLeft = harvestTracker ? Math.max(0, harvestTracker.days - Math.floor((new Date() - new Date(harvestTracker.startedAt)) / (1000 * 60 * 60 * 24))) : null;
    const fertTracker = fertilizerTrackers?.[plantName];
    const daysSinceFert = fertTracker ? Math.floor((new Date() - new Date(fertTracker.lastFertilized)) / (1000 * 60 * 60 * 24)) : null;
const fertDueDays = getFertilizerDays(plantName);
    const weatherAlert =
      weather?.minTempF <= 35 ? { icon: "❄️", text: "Frost risk tonight — cover this plant." } :
      weather?.maxTempF >= 98 ? { icon: "🔥", text: "Heat stress risk — water early today." } :
      weather?.precipChance >= 70 ? { icon: "🌧️", text: "Rain likely — skip watering today." } : null;

   return { conflicts, pairs, wateredToday, seasonLabel, harvestDaysLeft, daysSinceFert, fertDueDays, weatherAlert };
  }

  function choosePlantForSlot(slotId) {
    const validPlants = savedPlants.filter(Boolean).map(p => getPlantName(p)).filter(Boolean);
    if (!validPlants.length) {
      Alert.alert("Save plants first", "Open a plant card and tap Save, then you can place it in your garden map.");
      return;
    }
    Alert.alert(
      "Choose a plant",
      "Pick one for this plot.",
      [
        ...validPlants.slice(0, 8).map(n => ({ text: n, onPress: () => { onAssign(slotId, n); setSelectedSlot(slotId); } })),
        { text: "Clear plot", style: "destructive", onPress: () => { onClear(slotId); setSelectedSlot(null); } },
        { text: "Cancel", style: "cancel" },
      ]
    );
  }

  const allPlants = Object.values(gardenMap || {}).map(p => getPlantName(p)).filter(Boolean);
  const filledCount = allPlants.length;
  const conflictCount = allPlants.filter(p => allPlants.some(c => c !== p && getCompatibilityScore(p, c).label === "Avoid")).length;
  const excellentCount = allPlants.filter(p => allPlants.some(c => c !== p && getCompatibilityScore(p, c).label === "Excellent Pair")).length;

  const selectedPlantName = selectedSlot ? getPlantName(gardenMap[selectedSlot]) : null;
  const selectedInsights = selectedPlantName ? getSlotInsights(selectedPlantName, allPlants) : null;

  return (
    <View>
      {/* MAP LEGEND */}
      <View style={styles.gardenLegendRow}>
        <View style={styles.gardenLegendItem}>
          <View style={[styles.gardenLegendDot, { backgroundColor: "#5cff89" }]} />
          <Text style={styles.gardenLegendText}>{t("gardenPlannerMap.greatPair")}</Text>
        </View>
        <View style={styles.gardenLegendItem}>
          <View style={[styles.gardenLegendDot, { backgroundColor: "#ff7b7b" }]} />
          <Text style={styles.gardenLegendText}>{t("gardenPlannerMap.conflict")}</Text>
        </View>
        <View style={styles.gardenLegendItem}>
          <View style={[styles.gardenLegendDot, { backgroundColor: "#6bc7ff" }]} />
          <Text style={styles.gardenLegendText}>{t("gardenPlannerMap.needsWater")}</Text>
        </View>
        <View style={styles.gardenLegendItem}>
          <View style={[styles.gardenLegendDot, { backgroundColor: "rgba(255, 255, 255, 0.16)" }]} />
          <Text style={styles.gardenLegendText}>{t("gardenPlannerMap.empty")}</Text>
        </View>
      </View>

      {/* QUICK STATS BAR */}
      {filledCount > 0 ? (
        <View style={styles.gardenMapStatsBar}>
          <View style={styles.gardenMapStatPill}>
            <Text style={styles.gardenMapStatValue}>{filledCount}/12</Text>
            <Text style={styles.gardenMapStatLabel}>{t("gardenPlannerMap.plotsFilled")}</Text>
          </View>
          <View style={[styles.gardenMapStatPill, { borderColor: excellentCount > 0 ? "rgba(92, 255, 137, 0.3)" : "rgba(255, 255, 255, 0.08)" }]}>
            <Text style={[styles.gardenMapStatValue, { color: excellentCount > 0 ? "#5cff89" : "#d7ebdc" }]}>{excellentCount}</Text>
            <Text style={styles.gardenMapStatLabel}>{t("gardenPlannerMap.greatPairs")}</Text>
          </View>
          <View style={[styles.gardenMapStatPill, { borderColor: conflictCount > 0 ? "rgba(255, 123, 123, 0.3)" : "rgba(255, 255, 255, 0.08)" }]}>
            <Text style={[styles.gardenMapStatValue, { color: conflictCount > 0 ? "#ff7b7b" : "#d7ebdc" }]}>{conflictCount}</Text>
            <Text style={styles.gardenMapStatLabel}>Conflicts</Text>
          </View>
        </View>
      ) : null}

      {/* GRID */}
      <View style={styles.gardenGrid}>
        {GARDEN_SLOTS.map((slot) => {
          const rawPlantName = gardenMap[slot.id];
          const plantName = getPlantName(rawPlantName);
          const plant = produceData.find(item => item?.name === plantName);
          const imageSource = plant ? resolvePlantImageSource(plant) : null;
          const hasConflict = plantName && allPlants.some(c => c !== plantName && getCompatibilityScore(plantName, c).label === "Avoid");
          const hasExcellent = plantName && allPlants.some(c => c !== plantName && getCompatibilityScore(plantName, c).label === t("gardenPlannerMap.excellentPair"));
          const needsWater = plantName && wateredPlants?.[plantName] !== getTodayKey();
          const isSelected = selectedSlot === slot.id;
          const harvestTracker = plantName ? harvestTrackers?.[plantName] : null;
          const harvestDaysLeft = harvestTracker ? Math.max(0, harvestTracker.days - Math.floor((new Date() - new Date(harvestTracker.startedAt)) / (1000 * 60 * 60 * 24))) : null;
          const isHarvestReady = harvestDaysLeft === 0;
          const seasonLabel = plant && zone ? getPlantSeasonLabel(plant, zone) : null;
          const isInSeason = seasonLabel === t("gardenPlannerMap.plantNow");

          return (
            <Pressable
              key={slot.id}
              onPress={() => {
                if (plantName) {
                  setSelectedSlot(isSelected ? null : slot.id);
                } else {
                  choosePlantForSlot(slot.id);
                }
              }}
              onLongPress={() => choosePlantForSlot(slot.id)}
              style={[
                styles.gardenSlotV2,
                {
                  backgroundColor: plantName
                    ? hasConflict ? "rgba(255, 123, 123, 0.1)" : hasExcellent ? "rgba(92, 255, 137, 0.12)" : "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.04)",
                  borderColor: isSelected ? "#ffd86b"
                    : hasConflict ? "#ff7b7b"
                    : hasExcellent ? "#5cff89"
                    : needsWater && plantName ? "#6bc7ff"
                    : "rgba(255, 255, 255, 0.1)",
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              {/* PLANT IMAGE OR PLUS */}
              {imageSource ? (
                <View style={styles.gardenSlotImageWrapV2}>
                  <Image source={imageSource} style={styles.gardenSlotImageV2} resizeMode="contain" />
                </View>
              ) : (
                <View style={styles.gardenSlotEmptyIcon}>
                  <Text style={styles.gardenSlotEmptyText}>＋</Text>
                </View>
              )}

              {/* PLANT NAME */}
              <Text numberOfLines={2} style={[styles.gardenSlotLabelV2, { color: plantName ? "#ffffff" : "#5cff89" }]}>
                {plantName || `Plot ${slot.id.split("-")[1]}`}
              </Text>

              {/* STATUS BADGES */}
              {plantName ? (
                <View style={styles.gardenSlotBadgeRow}>
                  {needsWater ? (
                    <View style={[styles.gardenSlotBadge, { backgroundColor: "rgba(107, 199, 255, 0.16)" }]}>
                      <Text style={[styles.gardenSlotBadgeText, { color: "#6bc7ff" }]}>💧</Text>
                    </View>
                  ) : (
                    <View style={[styles.gardenSlotBadge, { backgroundColor: "rgba(92, 255, 137, 0.16)" }]}>
                      <Text style={[styles.gardenSlotBadgeText, { color: "#5cff89" }]}>✓</Text>
                    </View>
                  )}
                  {isHarvestReady ? (
                    <View style={[styles.gardenSlotBadge, { backgroundColor: "rgba(255, 216, 107, 0.24)" }]}>
                      <Text style={[styles.gardenSlotBadgeText, { color: "#ffd86b" }]}>🎉</Text>
                    </View>
                  ) : null}
                  {isInSeason ? (
                    <View style={[styles.gardenSlotBadge, { backgroundColor: "rgba(92, 255, 137, 0.16)" }]}>
                      <Text style={[styles.gardenSlotBadgeText, { color: "#8effab" }]}>🌱</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {/* CONFLICT / EXCELLENT INDICATOR */}
              {hasConflict ? (
                <Text style={styles.gardenSlotWarningV2}>⚠</Text>
              ) : hasExcellent ? (
                <Text style={styles.gardenSlotGoodV2}>✓</Text>
              ) : null}

              {/* SELECTED INDICATOR */}
              {isSelected ? (
                <View style={styles.gardenSlotSelectedRing} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {/* SELECTED PLOT DETAIL PANEL */}
      {selectedSlot && selectedPlantName && selectedInsights ? (
        <View style={styles.gardenSlotDetailPanel}>
          <View style={styles.gardenSlotDetailHeader}>
            <Text style={styles.gardenSlotDetailTitle}>{selectedPlantName}</Text>
            <Pressable onPress={() => choosePlantForSlot(selectedSlot)} style={styles.gardenSlotChangeButton}>
              <Text style={styles.gardenSlotChangeText}>{t("gardenPlannerMap.change")}</Text>
            </Pressable>
          </View>

          {/* SEASON STATUS */}
          {selectedInsights.seasonLabel ? (
            <View style={[styles.gardenSlotInfoRow, {
              backgroundColor: selectedInsights.seasonLabel === t("gardenPlannerMap.plantNow") ? "rgba(92, 255, 137, 0.12)" : "rgba(255, 255, 255, 0.06)"
            }]}>
              <Text style={styles.gardenSlotInfoIcon}>📅</Text>
              <Text style={styles.gardenSlotInfoText}>{t("gardenPlannerMap.season")} {selectedInsights.seasonLabel}</Text>
            </View>
          ) : null}

          {/* WATERING STATUS */}
          <View style={[styles.gardenSlotInfoRow, {
            backgroundColor: selectedInsights.wateredToday ? "rgba(92, 255, 137, 0.1)" : "rgba(107, 199, 255, 0.1)"
          }]}>
            <Text style={styles.gardenSlotInfoIcon}>{selectedInsights.wateredToday ? "✅" : "💧"}</Text>
            <Text style={styles.gardenSlotInfoText}>
              {selectedInsights.wateredToday ? t("gardenPlannerMap.wateredToday") : t("gardenPlannerMap.needsWaterToday")}
            </Text>
          </View>

          {/* HARVEST STATUS */}
          {selectedInsights.harvestDaysLeft !== null ? (
            <View style={[styles.gardenSlotInfoRow, {
              backgroundColor: selectedInsights.harvestDaysLeft === 0 ? "rgba(255, 216, 107, 0.16)" : "rgba(255, 255, 255, 0.06)"
            }]}>
              <Text style={styles.gardenSlotInfoIcon}>🚜</Text>
              <Text style={styles.gardenSlotInfoText}>
                {selectedInsights.harvestDaysLeft === 0 ? t("gardenPlannerMap.readyToHarvest") : `Harvest in ~${selectedInsights.harvestDaysLeft} days`}
              </Text>
            </View>
          ) : null}

          {/* FERTILIZER STATUS */}
          {selectedInsights.daysSinceFert !== null ? (
            <View style={[styles.gardenSlotInfoRow, {
            backgroundColor: selectedInsights.daysSinceFert >= selectedInsights.fertDueDays ? "rgba(255, 216, 107, 0.12)" : "rgba(255, 255, 255, 0.06)"
            }]}>
              <Text style={styles.gardenSlotInfoIcon}>🌿</Text>
              <Text style={styles.gardenSlotInfoText}>
                {selectedInsights.daysSinceFert >= selectedInsights.fertDueDays ? `Due for fertilizer (${selectedInsights.daysSinceFert}d ago)` : `Fertilized ${selectedInsights.daysSinceFert} days ago`}
              </Text>
            </View>
          ) : null}

          {/* WEATHER ALERT */}
          {selectedInsights.weatherAlert ? (
            <View style={[styles.gardenSlotInfoRow, { backgroundColor: "rgba(255, 216, 107, 0.12)" }]}>
              <Text style={styles.gardenSlotInfoIcon}>{selectedInsights.weatherAlert.icon}</Text>
              <Text style={styles.gardenSlotInfoText}>{selectedInsights.weatherAlert.text}</Text>
            </View>
          ) : null}

          {/* COMPANION PAIRS */}
          {selectedInsights.pairs.length > 0 ? (
            <View style={styles.gardenSlotCompanionRow}>
              <IconText label={t("gardenPlannerMap.greatPairsNearby")} style={styles.gardenSlotCompanionLabel} />
              <View style={styles.gardenSlotPillRow}>
                {selectedInsights.pairs.map(p => (
                  <View key={p} style={[styles.gardenSlotPill, { backgroundColor: "rgba(92, 255, 137, 0.16)", borderColor: "rgba(92, 255, 137, 0.3)" }]}>
                    <Text style={[styles.gardenSlotPillText, { color: "#5cff89" }]}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* CONFLICTS */}
          {selectedInsights.conflicts.length > 0 ? (
            <View style={styles.gardenSlotCompanionRow}>
              <IconText label={t("gardenPlannerMap.conflictsInYourGarden")} style={styles.gardenSlotCompanionLabel} />
              <View style={styles.gardenSlotPillRow}>
                {selectedInsights.conflicts.map(p => (
                  <View key={p} style={[styles.gardenSlotPill, { backgroundColor: "rgba(255, 123, 123, 0.12)", borderColor: "rgba(255, 123, 123, 0.3)" }]}>
                    <Text style={[styles.gardenSlotPillText, { color: "#ff7b7b" }]}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <Pressable onPress={() => { onClear(selectedSlot); setSelectedSlot(null); }} style={styles.gardenSlotClearButton}>
            <IconText label={t("gardenPlannerMap.removeFromPlot")} style={styles.gardenSlotClearText} />
          </Pressable>
        </View>
      ) : null}

      {/* EMPTY STATE */}
      {filledCount === 0 ? (
        <View style={styles.gardenMapEmptyState}>
          <Text style={styles.gardenMapEmptyIcon}>🌱</Text>
          <Text style={styles.gardenMapEmptyTitle}>{t("gardenPlannerMap.tapAnyPlotToPlace")}</Text>
          <Text style={styles.gardenMapEmptyText}>{t("gardenPlannerMap.pocketPlanterWillShowCompanion")}</Text>
        </View>
      ) : null}
    </View>
  );
})
