import { memo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Modal, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { areaCapacity, canPlantInArea, getAreaTag, getCompanionInfo, getCompatibilityScore, getPairReason, getTodayKey, resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { PlantPickerModal } from "./PlantPickerModal";
import { useTranslation } from "../lib/i18n";

export const AreaPlannerMap = memo(function AreaPlannerMap({ theme, gardenAreas, savedPlants, wateredPlants, onAssignSlot, onClearSlot, onWaterArea, zone, weather, harvestTrackers, onOpenPlant, onPickPhoto, onDeleteArea, focusAreaId, focusNonce }) {
  const { t } = useTranslation();
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [pickerSlot, setPickerSlot] = useState(null); // { areaId, slotId } while the plant picker is open

  // When a conflict elsewhere asks us to focus a bed, open that bed's detail view.
  // Keyed on focusNonce so tapping the same conflict again re-opens it.
  useEffect(() => {
    if (focusAreaId && (gardenAreas || []).some((a) => a.id === focusAreaId)) {
      setSelectedAreaId(focusAreaId);
    }
  }, [focusNonce]); // eslint-disable-line react-hooks/exhaustive-deps
  const [perfectGardenPlant, setPerfectGardenPlant] = useState(null);
  const seenPerfectRef = useRef(new Set());

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem("pp_perfectGardenSeen").then((val) => {
      if (alive && val) {
        try { seenPerfectRef.current = new Set(JSON.parse(val)); } catch (e) {}
      }
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  function maybeShowPerfectGarden(areaId, plantName) {
    if (seenPerfectRef.current.has(areaId)) return;
    const area = gardenAreas.find((a) => a.id === areaId);
    const info = getCompanionInfo(plantName) || {};
    const companions = (info.excellent || []).filter((comp) =>
      comp.toLowerCase() !== plantName.toLowerCase() &&
      produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase()) &&
      // In a flower bed, only suggest other flowers — never veggies/herbs.
      canPlantInArea(comp, area)
    );
    if (!companions.length) return;
    seenPerfectRef.current.add(areaId);
    AsyncStorage.setItem("pp_perfectGardenSeen", JSON.stringify(Array.from(seenPerfectRef.current))).catch(() => {});
    setPerfectGardenPlant(plantName);
  }

  function addPerfectCompanions(plantName) {
    const area = gardenAreas.find((a) => a.id === selectedAreaId);
    if (!area) { setPerfectGardenPlant(null); return; }
    const info = getCompanionInfo(plantName) || {};
    const existing = Object.values(area.plots || {}).map((p) => getPlantName(p).toLowerCase()).filter(Boolean);
    const companions = (info.excellent || []).filter((comp) =>
      comp.toLowerCase() !== plantName.toLowerCase() &&
      !existing.includes(comp.toLowerCase()) &&
      produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase())
    );
    const areaSize = areaCapacity(area);
    const emptySlots = [];
    for (let i = 1; i <= areaSize; i++) {
      const slotId = `slot-${i}`;
      if (!getPlantName(area.plots?.[slotId])) emptySlots.push(slotId);
    }
    if (!emptySlots.length) {
      Alert.alert("Garden's full", "There are no empty plots in this bed to add companions to.");
      setPerfectGardenPlant(null);
      return;
    }
    const toAdd = companions.filter((comp) => canPlantInArea(comp, area)).slice(0, emptySlots.length);
    toAdd.forEach((comp, idx) => onAssignSlot(area.id, emptySlots[idx], comp));
    setPerfectGardenPlant(null);
  }

  function getPlantName(plant) { return typeof plant === "string" ? plant : plant?.name || ""; }

  // Tapping a combo ("Rose + Marigold") asks which of the two plants to open.
  function openPairPicker(nameA, nameB) {
    const findPlant = (n) => produceData.find((pd) => pd.name.toLowerCase() === String(n || "").toLowerCase());
    const a = findPlant(nameA);
    const b = findPlant(nameB);
    const buttons = [];
    if (a) buttons.push({ text: nameA, onPress: () => onOpenPlant && onOpenPlant(a) });
    if (b) buttons.push({ text: nameB, onPress: () => onOpenPlant && onOpenPlant(b) });
    if (!buttons.length) return;
    // Only one of the two is a real plant card — just open it, no need to ask.
    if (buttons.length === 1) { buttons[0].onPress(); return; }
    buttons.push({ text: "Cancel", style: "cancel" });
    Alert.alert("View plant", "Which plant do you want to open?", buttons);
  }

  function suggestCompanionsForPlant(areaId, plantName) {
    const area = gardenAreas.find((a) => a.id === areaId);
const bedPlants = Object.values(area?.plots || {}).map((p) => getPlantName(p)).filter(Boolean);
    // Only greet the FIRST plant in a bed — stay quiet for every plant after.
    if (bedPlants.length > 1) return;
    const info = getCompanionInfo(plantName) || {};
    const suggestions = (info.excellent || []).filter((comp) =>
      comp.toLowerCase() !== plantName.toLowerCase() &&
      !bedPlants.some((p) => p.toLowerCase() === comp.toLowerCase()) &&
      produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase())
    );
    if (!suggestions.length) return;
    const list = suggestions.slice(0, 4).join(", ");
  }

  function choosePlantForSlot(areaId, slotId) {
    const area = gardenAreas.find((a) => a.id === areaId);
    const valid = savedPlants
      .filter(Boolean)
      .map((p) => getPlantName(p))
      .filter(Boolean)
      .filter((n) => canPlantInArea(n, area));
    if (!valid.length) {
      const flowerBed = area?.kind === "flower";
      Alert.alert(
        flowerBed ? "No flowers saved yet" : "Nothing to plant here",
        flowerBed
          ? "This is a flower bed — save some flowers, then place them here."
          : "Save a plant that suits this bed, then place it here. (Flowers can't go in a regular garden — plant those on the Flowers tab.)"
      );
      return;
    }
    // Open the searchable/filterable picker (scrolls, no cap, category filters).
    setPickerSlot({ areaId, slotId });
  }

  function validPlantsForArea(area) {
    return savedPlants
      .filter(Boolean)
      .map((p) => getPlantName(p))
      .filter(Boolean)
      .filter((n) => canPlantInArea(n, area));
  }

  if (!gardenAreas.length) {
    return (
      <View style={styles.gardenMapEmptyState}>
        <Text style={styles.gardenMapEmptyIcon}>🗂️</Text>
        <Text style={styles.gardenMapEmptyTitle}>{t("areaPlannerMap.createAnAreaFirst")}</Text>
        <Text style={styles.gardenMapEmptyText}>{t("areaPlannerMap.addAGardenAreaAbove")}</Text>
      </View>
    );
  }

 const activeArea = gardenAreas.find((a) => a.id === selectedAreaId) || null;

  if (!activeArea) {
    return (
      <View style={{ gap: 12 }}>
        {gardenAreas.map((area) => {
          const areaPlantCount = Object.values(area.plots || {}).map((p) => getPlantName(p)).filter(Boolean).length;
          const areaPlantList = Object.values(area.plots || {}).map((p) => getPlantName(p)).filter(Boolean);
          let totalPairs = 0, conflictPairs = 0;
          for (let i = 0; i < areaPlantList.length; i++) {
            for (let j = i + 1; j < areaPlantList.length; j++) {
              totalPairs += 1;
              if (getCompatibilityScore(areaPlantList[i], areaPlantList[j]).label === "Avoid") conflictPairs += 1;
            }
          }
          const areaPct = totalPairs > 0 ? Math.round(((totalPairs - conflictPairs) / totalPairs) * 100) : 100;
          const areaHasConflict = conflictPairs > 0;
          return (
            <Pressable
              key={area.id}
              onPress={() => setSelectedAreaId(area.id)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}
            >
              {area.photo ? (
                <Image source={{ uri: area.photo }} style={{ width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)" }} />
              ) : (
                <View style={{ width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: `${getAreaTag(area).color}22`, borderWidth: 1, borderColor: `${getAreaTag(area).color}55` }}>
                  <Text style={{ fontSize: 20 }}>{(getAreaTag(area).emoji || "").trim() || "📷"}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900" }}>{area.name}</Text>
               <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>{areaPlantCount} planted</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: areaHasConflict ? "rgba(255, 123, 123, 0.12)" : "rgba(92, 255, 137, 0.12)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: areaHasConflict ? "rgba(255, 123, 123, 0.3)" : "rgba(92, 255, 137, 0.3)" }}>
                <Text style={{ fontSize: 12 }}>{areaHasConflict ? "⚠️" : "✓"}</Text>
                <Text style={{ color: areaHasConflict ? "#ff9f9f" : "#5cff89", fontSize: 12, fontWeight: "900" }}>{areaPct}%</Text>
              </View>
              <Text style={{ color: "#5cff89", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

 return (
    <View style={{ gap: 20 }}>
      {(() => {
        const pArea = pickerSlot ? gardenAreas.find((a) => a.id === pickerSlot.areaId) : null;
        return (
          <PlantPickerModal
            theme={theme}
            visible={!!pickerSlot}
            bedName={pArea?.name}
            plants={pArea ? validPlantsForArea(pArea) : []}
            currentPlant={pArea ? getPlantName(pArea.plots?.[pickerSlot.slotId]) : null}
            onPick={(name) => { const s = pickerSlot; setPickerSlot(null); if (s) { onAssignSlot(s.areaId, s.slotId, name); maybeShowPerfectGarden(s.areaId, name); suggestCompanionsForPlant(s.areaId, name); } }}
            onClear={() => { const s = pickerSlot; setPickerSlot(null); if (s) onClearSlot(s.areaId, s.slotId); }}
            onClose={() => setPickerSlot(null)}
          />
        );
      })()}
      <Modal visible={!!perfectGardenPlant} transparent animationType="fade" onRequestClose={() => setPerfectGardenPlant(null)}>
        <Pressable onPress={() => setPerfectGardenPlant(null)} style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.85)", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Pressable onPress={() => {}} style={{ width: "100%", maxWidth: 420, backgroundColor: "#0e2414", borderRadius: 24, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.3)", padding: 22 }}>
            {(() => {
              if (!perfectGardenPlant) return null;
              const modalArea = gardenAreas.find((a) => a.id === selectedAreaId);
              const info = getCompanionInfo(perfectGardenPlant) || {};
              const companions = (info.excellent || []).filter((comp) =>
                comp.toLowerCase() !== perfectGardenPlant.toLowerCase() &&
                produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase()) &&
                // Flower beds only ever show other flowers as companions.
                canPlantInArea(comp, modalArea)
              ).slice(0, 5);
              const tiles = [perfectGardenPlant, ...companions];
              return (
                <>
                  <IconText label={t("areaPlannerMap.perfectGarden")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.5,
  marginBottom: 4
}} />
                  <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", marginBottom: 6 }}>{t("areaPlannerMap.aDreamBedWith")} {perfectGardenPlant}</Text>
                  <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", lineHeight: 19, marginBottom: 16 }}>{t("areaPlannerMap.heresHow")} {perfectGardenPlant} {t("areaPlannerMap.thrivesSurroundedByItsBest")}</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                    {tiles.map((name, i) => {
                      const pd = produceData.find((p) => p.name.toLowerCase() === name.toLowerCase());
                      const img = pd ? resolvePlantImageSource(pd) : null;
                      const isCenter = i === 0;
                      return (
                        <View key={`${name}-${i}`} style={{ width: "30%", aspectRatio: 1, borderRadius: 16, alignItems: "center", justifyContent: "center", padding: 6, backgroundColor: isCenter ? "rgba(92, 255, 137, 0.16)" : "rgba(255, 255, 255, 0.06)", borderWidth: isCenter ? 2 : 1, borderColor: isCenter ? "#5cff89" : "rgba(255, 255, 255, 0.12)" }}>
                          {img ? <Image source={img} style={{ width: 40, height: 40 }} resizeMode="contain" /> : <Text style={{ fontSize: 24 }}>🌱</Text>}
                          <Text numberOfLines={1} style={{ color: isCenter ? "#8effab" : "#ffffff", fontSize: 10, fontWeight: "800", marginTop: 4 }}>{name}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <Pressable
                    onPress={() => addPerfectCompanions(perfectGardenPlant)}
                    style={{ backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center", marginBottom: 10 }}
                  >
                    <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>{t("areaPlannerMap.addTheseToMyGarden")}</Text>
                  </Pressable>
                  <Pressable onPress={() => setPerfectGardenPlant(null)} style={{ paddingVertical: 10, alignItems: "center" }}>
                    <Text style={{ color: "#8fbf9d", fontSize: 14, fontWeight: "800" }}>{t("areaPlannerMap.maybeLater")}</Text>
                  </Pressable>
                </>
              );
            })()}
          </Pressable>
        </Pressable>
      </Modal>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable
          onPress={() => setSelectedAreaId(null)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingVertical: 6 }}
        >
          <Text style={{ color: "#5cff89", fontSize: 14, fontWeight: "900" }}>{t("areaPlannerMap.allGardens")}</Text>
        </Pressable>
      </View>
      {gardenAreas.filter((area) => area.id === selectedAreaId).map((area) => {
        const areaSize = areaCapacity(area);
        const PLOTS_PER_AREA = Array.from({ length: areaSize }, (_, i) => `slot-${i + 1}`);
        const areaPlants = Object.values(area.plots || {}).map((p) => getPlantName(p)).filter(Boolean);
        return (
         <View key={area.id}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                <Pressable onPress={() => onPickPhoto && onPickPhoto(area.id)}>
                  {area.photo ? (
                    <Image source={{ uri: area.photo }} style={{ width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.2)" }} />
                  ) : (
                    <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: `${getAreaTag(area).color}22`, borderWidth: 1, borderColor: `${getAreaTag(area).color}55` }}>
                      <Text style={{ fontSize: 18 }}>{(getAreaTag(area).emoji || "").trim() || "📷"}</Text>
                    </View>
                  )}
                </Pressable>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900", flex: 1 }}>
                  {area.name} <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700" }}>· {areaPlants.length} planted</Text>
                </Text>
                </View>
              {areaPlants.length > 0 && onWaterArea ? (
                <Pressable
                  onPress={() => onWaterArea(area.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Water all plants in ${area.name}`}
                  style={{ backgroundColor: "rgba(107, 199, 255, 0.16)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.3)" }}
                >
                  <IconText label={t("areaPlannerMap.waterBed")} style={{
  color: "#6bc7ff",
  fontSize: 12,
  fontWeight: "900"
}} />
                </Pressable>
              ) : null}
            </View>
            {areaPlants.length > 0 ? (() => {
              const today = getTodayKey();
              const needWater = areaPlants.filter((n) => wateredPlants?.[n] !== today).length;
              let conflicts = 0;
              for (let i = 0; i < areaPlants.length; i++) {
                for (let j = i + 1; j < areaPlants.length; j++) {
                  const a = areaPlants[i], b = areaPlants[j];
                  if (
                    getCompatibilityScore(a, b).label === "Avoid" ||
                    getCompatibilityScore(b, a).label === "Avoid"
                  ) conflicts += 1;
                }
              }
              const stats = [
                { icon: "🌱", value: areaPlants.length, label: "plants", color: "#8effab" },
                { icon: "💧", value: needWater, label: t("areaPlannerMap.needWater"), color: needWater > 0 ? "#6bc7ff" : "#8fbf9d" },
                { icon: conflicts > 0 ? "⚠️" : "✓", value: conflicts, label: "conflicts", color: conflicts > 0 ? "#ff7b7b" : "#5cff89" },
              ];
              return (
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                  {stats.map((s) => (
                    <View key={s.label} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
                      <Text style={{ fontSize: 12 }}>{s.icon}</Text>
                      <Text style={{ color: s.color, fontSize: 14, fontWeight: "900" }}>{s.value}</Text>
                      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700" }}>{s.label}</Text>
                    </View>
                  ))}
                </View>
              );
            })() : null}
            <View style={styles.gardenGrid}>
              {PLOTS_PER_AREA.map((slotId) => {
                const plantName = getPlantName(area.plots?.[slotId]);
                const plant = produceData.find((item) => item?.name === plantName);
                const imageSource = plant ? resolvePlantImageSource(plant) : null;
                const hasConflict = plantName && areaPlants.some((c) => c !== plantName && getCompatibilityScore(plantName, c).label === "Avoid");
                const hasExcellent = plantName && areaPlants.some((c) => c !== plantName && getCompatibilityScore(plantName, c).label === t("areaPlannerMap.excellentPair"));
                const needsWater = plantName && wateredPlants?.[plantName] !== getTodayKey();
                return (
                  <Pressable
                    key={`${area.id}-${slotId}`}
                    onPress={() => choosePlantForSlot(area.id, slotId)}
                    style={[styles.gardenSlotV2, {
                      backgroundColor: plantName
                        ? hasConflict ? "rgba(255, 123, 123, 0.1)" : hasExcellent ? "rgba(92, 255, 137, 0.12)" : "rgba(255, 255, 255, 0.08)"
                        : "rgba(255, 255, 255, 0.04)",
                      borderColor: hasConflict ? "#ff7b7b" : hasExcellent ? "#5cff89" : needsWater && plantName ? "#6bc7ff" : "rgba(255, 255, 255, 0.1)",
                      borderWidth: 1,
                    }]}
                  >
                    {imageSource ? (
                      <View style={styles.gardenSlotImageWrapV2}>
                        <Image source={imageSource} style={styles.gardenSlotImageV2} resizeMode="contain" />
                      </View>
                    ) : (
                      <View style={styles.gardenSlotEmptyIcon}>
                        <Text style={styles.gardenSlotEmptyText}>＋</Text>
                      </View>
                    )}
                    <Text numberOfLines={2} style={[styles.gardenSlotLabelV2, { color: plantName ? "#ffffff" : "#5cff89" }]}>
                      {plantName || "Empty"}
                    </Text>
                    {hasConflict ? <Text style={styles.gardenSlotWarningV2}>⚠</Text> : hasExcellent ? <Text style={styles.gardenSlotGoodV2}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </View>
            {(() => {
              const unique = Array.from(new Set(areaPlants));
              if (unique.length < 2) return null;
              const pairs = [];
              for (let i = 0; i < unique.length; i++) {
                for (let j = i + 1; j < unique.length; j++) {
                  const a = unique[i];
                  const b = unique[j];
                  const score = getCompatibilityScore(a, b);
                  if (score.label === "Neutral") continue;
                  pairs.push({ a, b, score });
                }
              }
              if (!pairs.length) return null;
              // Conflicts first — those are the ones worth acting on.
              pairs.sort((x, y) => (x.score.label === "Avoid" ? -1 : 1) - (y.score.label === "Avoid" ? -1 : 1));
              const top = pairs.slice(0, 5);
              return (
                <View style={{ marginTop: 12, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
                  <IconText label={t("areaPlannerMap.inThisBed")} style={{
  color: "#8fbf9d",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.5,
  marginBottom: 4
}} />
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>
                    {t("areaPlannerMap.howThePlantsIn")} {area.name} {t("areaPlannerMap.getAlong")}
                  </Text>
                  <View style={{ gap: 8 }}>
                    {top.map(({ a, b, score }) => {
                      const isGood = score.label === t("areaPlannerMap.excellentPair");
                      const plantA = produceData.find((pd) => pd.name.toLowerCase() === a.toLowerCase());
                      const plantB = produceData.find((pd) => pd.name.toLowerCase() === b.toLowerCase());
                      const imgA = plantA ? resolvePlantImageSource(plantA) : null;
                      const imgB = plantB ? resolvePlantImageSource(plantB) : null;
                      return (
                        <Pressable
                          key={`${area.id}-pair-${a}-${b}`}
                          onPress={() => openPairPicker(a, b)}
                          accessibilityRole="button"
                          accessibilityLabel={`View ${a} or ${b}`}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            backgroundColor: isGood ? "rgba(92, 255, 137, 0.08)" : "rgba(255, 123, 123, 0.08)",
                            borderRadius: 12,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            borderWidth: 1,
                            borderColor: isGood ? "rgba(92, 255, 137, 0.2)" : "rgba(255, 123, 123, 0.2)",
                          }}
                        >
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            {imgA ? <Image source={imgA} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                            <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "900" }}>+</Text>
                            {imgB ? <Image source={imgB} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: isGood ? "#8effab" : "#ff9f9f", fontSize: 12, fontWeight: "800" }}>
                              {a} + {b}
                            </Text>
                            <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "600", lineHeight: 15, marginTop: 2 }}>
                              {getPairReason(a, b)}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 14, fontWeight: "900", color: isGood ? "#5cff89" : "#ff7b7b" }}>
                            {isGood ? "✓" : "⚠"}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })()}
            {(() => {
              if (!areaPlants.length) return null;
              const suggestions = [];
              areaPlants.forEach((planted) => {
                const info = getCompanionInfo(planted);
                (info.excellent || []).forEach((comp) => {
                  if (
                    !areaPlants.some((p) => p.toLowerCase() === comp.toLowerCase()) &&
                    produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase()) &&
                    !suggestions.some((s) => s.name.toLowerCase() === comp.toLowerCase()) &&
                    // A flower bed only recommends other flowers to add.
                    canPlantInArea(comp, area)
                  ) {
                    suggestions.push({ name: comp, pairsWith: planted });
                  }
                });
              });
              const top = suggestions.slice(0, 4);
              if (!top.length) return null;
              return (
                <View style={{ width: "100%", marginTop: 12, backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}>
                  <IconText label={t("areaPlannerMap.greatCompanionsToAdd")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.5,
  marginBottom: 4
}} />
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>
                    {t("areaPlannerMap.thesePairWellWithWhat")} {area.name}.
                  </Text>
                 <View style={{ gap: 8 }}>
                    {top.map((s) => {
                      const suggestedPlant = produceData.find((pd) => pd.name.toLowerCase() === s.name.toLowerCase());
                      const suggestedImage = suggestedPlant ? resolvePlantImageSource(suggestedPlant) : null;
                      const partnerPlant = produceData.find((pd) => pd.name.toLowerCase() === s.pairsWith.toLowerCase());
                      const partnerImage = partnerPlant ? resolvePlantImageSource(partnerPlant) : null;
                      return (
                        <Pressable
                          key={`${area.id}-comp-${s.name}`}
                          onPress={() => openPairPicker(s.pairsWith, s.name)}
                          accessibilityRole="button"
                          accessibilityLabel={`View ${s.pairsWith} or ${s.name}`}
                          style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}
                        >
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            {partnerImage ? (
                              <Image source={partnerImage} style={{ width: 26, height: 26 }} resizeMode="contain" />
                            ) : <Text style={{ fontSize: 18 }}>🌱</Text>}
                            <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "900" }}>+</Text>
                            {suggestedImage ? (
                              <Image source={suggestedImage} style={{ width: 26, height: 26 }} resizeMode="contain" />
                            ) : <Text style={{ fontSize: 18 }}>🌱</Text>}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800" }}>
                              {s.pairsWith} + {s.name}
                            </Text>
                            <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "600", lineHeight: 15, marginTop: 2 }}>
                              {getPairReason(s.pairsWith, s.name)}
                            </Text>
                          </View>
                          {suggestedPlant ? (
                            <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900" }}>›</Text>
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </View>
</View>
              );
            })()}
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Delete garden?",
                  `This will remove "${area.name || "this garden"}" and everything planted in it. This can't be undone.`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => { setSelectedAreaId(null); onDeleteArea && onDeleteArea(area.id); } },
                  ]
                );
              }}
              style={{ marginTop: 20, alignSelf: "stretch", backgroundColor: "rgba(255, 123, 123, 0.1)", borderRadius: 12, paddingVertical: 12, borderTopWidth: 1, borderColor: "rgba(255, 123, 123, 0.24)", alignItems: "center" }}
            >
              <IconText label={t("areaPlannerMap.deleteGarden")} style={{
  color: "#ff9f9f",
  fontSize: 14,
  fontWeight: "900"
}} />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
})
