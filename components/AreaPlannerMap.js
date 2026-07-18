import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Modal, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { getAreaTag, getCompanionInfo, getCompatibilityScore, getPairReason, getTodayKey, resolvePlantImageSource } from "../core";

export function AreaPlannerMap({ theme, gardenAreas, savedPlants, wateredPlants, onAssignSlot, onClearSlot, onWaterArea, zone, weather, harvestTrackers, onOpenPlant, onPickPhoto, onDeleteArea }) {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
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
    const info = getCompanionInfo(plantName) || {};
    const companions = (info.excellent || []).filter((comp) =>
      comp.toLowerCase() !== plantName.toLowerCase() &&
      produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase())
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
    const areaSize = Math.max(1, Math.min(12, Number(area.size) || 12));
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
    const toAdd = companions.slice(0, emptySlots.length);
    toAdd.forEach((comp, idx) => onAssignSlot(area.id, emptySlots[idx], comp));
    setPerfectGardenPlant(null);
  }

  function getPlantName(plant) { return typeof plant === "string" ? plant : plant?.name || ""; }

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
    const valid = savedPlants.filter(Boolean).map((p) => getPlantName(p)).filter(Boolean);
    if (!valid.length) {
      Alert.alert("Save plants first", "Open a plant card and tap Save, then place it in your garden.");
      return;
    }
    Alert.alert("Choose a plant", "Pick one for this plot.", [
      ...valid.slice(0, 8).map((n) => ({ text: n, onPress: () => { onAssignSlot(areaId, slotId, n); maybeShowPerfectGarden(areaId, n); suggestCompanionsForPlant(areaId, n); } })),
      { text: "Clear plot", style: "destructive", onPress: () => onClearSlot(areaId, slotId) },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  if (!gardenAreas.length) {
    return (
      <View style={styles.gardenMapEmptyState}>
        <Text style={styles.gardenMapEmptyIcon}>🗂️</Text>
        <Text style={styles.gardenMapEmptyTitle}>Create an area first</Text>
        <Text style={styles.gardenMapEmptyText}>Add a garden area above (like Backyard or Balcony), then place your saved plants into it.</Text>
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
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
            >
              {area.photo ? (
                <Image source={{ uri: area.photo }} style={{ width: 48, height: 48, borderRadius: 13, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }} />
              ) : (
                <View style={{ width: 48, height: 48, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: `${getAreaTag(area).color}22`, borderWidth: 1, borderColor: `${getAreaTag(area).color}55` }}>
                  <Text style={{ fontSize: 22 }}>{(getAreaTag(area).emoji || "").trim() || "📷"}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900" }}>{area.name}</Text>
               <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>{areaPlantCount} planted</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: areaHasConflict ? "rgba(255,123,123,0.12)" : "rgba(92,255,137,0.12)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: areaHasConflict ? "rgba(255,123,123,0.28)" : "rgba(92,255,137,0.28)" }}>
                <Text style={{ fontSize: 12 }}>{areaHasConflict ? "⚠️" : "✓"}</Text>
                <Text style={{ color: areaHasConflict ? "#ff9b9b" : "#5cff89", fontSize: 13, fontWeight: "900" }}>{areaPct}%</Text>
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
      <Modal visible={!!perfectGardenPlant} transparent animationType="fade" onRequestClose={() => setPerfectGardenPlant(null)}>
        <Pressable onPress={() => setPerfectGardenPlant(null)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.82)", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Pressable onPress={() => {}} style={{ width: "100%", maxWidth: 420, backgroundColor: "#0d1f14", borderRadius: 28, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)", padding: 22 }}>
            {(() => {
              if (!perfectGardenPlant) return null;
              const info = getCompanionInfo(perfectGardenPlant) || {};
              const companions = (info.excellent || []).filter((comp) =>
                comp.toLowerCase() !== perfectGardenPlant.toLowerCase() &&
                produceData.some((pd) => pd.name.toLowerCase() === comp.toLowerCase())
              ).slice(0, 5);
              const tiles = [perfectGardenPlant, ...companions];
              return (
                <>
                  <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 4 }}>🌱 PERFECT GARDEN</Text>
                  <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", marginBottom: 6 }}>A dream bed with {perfectGardenPlant}</Text>
                  <Text style={{ color: "#8fbf9d", fontSize: 13, fontWeight: "700", lineHeight: 19, marginBottom: 16 }}>Here's how {perfectGardenPlant} thrives — surrounded by its best companions. Tap anywhere to close and build your own.</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                    {tiles.map((name, i) => {
                      const pd = produceData.find((p) => p.name.toLowerCase() === name.toLowerCase());
                      const img = pd ? resolvePlantImageSource(pd) : null;
                      const isCenter = i === 0;
                      return (
                        <View key={`${name}-${i}`} style={{ width: "30%", aspectRatio: 1, borderRadius: 16, alignItems: "center", justifyContent: "center", padding: 6, backgroundColor: isCenter ? "rgba(92,255,137,0.16)" : "rgba(255,255,255,0.06)", borderWidth: isCenter ? 2 : 1, borderColor: isCenter ? "#5cff89" : "rgba(255,255,255,0.12)" }}>
                          {img ? <Image source={img} style={{ width: 40, height: 40 }} resizeMode="contain" /> : <Text style={{ fontSize: 26 }}>🌱</Text>}
                          <Text numberOfLines={1} style={{ color: isCenter ? "#8effab" : "#ffffff", fontSize: 11, fontWeight: "800", marginTop: 4 }}>{name}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <Pressable
                    onPress={() => addPerfectCompanions(perfectGardenPlant)}
                    style={{ backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center", marginBottom: 10 }}
                  >
                    <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>Add these to my garden</Text>
                  </Pressable>
                  <Pressable onPress={() => setPerfectGardenPlant(null)} style={{ paddingVertical: 10, alignItems: "center" }}>
                    <Text style={{ color: "#8fbf9d", fontSize: 14, fontWeight: "800" }}>Maybe later</Text>
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
          <Text style={{ color: "#5cff89", fontSize: 15, fontWeight: "900" }}>‹ All gardens</Text>
        </Pressable>
      </View>
      {gardenAreas.filter((area) => area.id === selectedAreaId).map((area) => {
        const areaSize = Math.max(1, Math.min(12, Number(area.size) || 12));
        const PLOTS_PER_AREA = Array.from({ length: areaSize }, (_, i) => `slot-${i + 1}`);
        const areaPlants = Object.values(area.plots || {}).map((p) => getPlantName(p)).filter(Boolean);
        return (
         <View key={area.id}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                <Pressable onPress={() => onPickPhoto && onPickPhoto(area.id)}>
                  {area.photo ? (
                    <Image source={{ uri: area.photo }} style={{ width: 40, height: 40, borderRadius: 11, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }} />
                  ) : (
                    <View style={{ width: 40, height: 40, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: `${getAreaTag(area).color}22`, borderWidth: 1, borderColor: `${getAreaTag(area).color}55` }}>
                      <Text style={{ fontSize: 18 }}>{(getAreaTag(area).emoji || "").trim() || "📷"}</Text>
                    </View>
                  )}
                </Pressable>
                <Text style={{ color: "#ffffff", fontSize: 17, fontWeight: "900", flex: 1 }}>
                  {area.name} <Text style={{ color: "#8fbf9d", fontSize: 13, fontWeight: "700" }}>· {areaPlants.length} planted</Text>
                </Text>
                </View>
              {areaPlants.length > 0 && onWaterArea ? (
                <Pressable
                  onPress={() => onWaterArea(area.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Water all plants in ${area.name}`}
                  style={{ backgroundColor: "rgba(107,199,255,0.14)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(107,199,255,0.28)" }}
                >
                  <Text style={{ color: "#6bc7ff", fontSize: 13, fontWeight: "900" }}>💧 Water bed</Text>
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
                { icon: "💧", value: needWater, label: "need water", color: needWater > 0 ? "#6bc7ff" : "#8fbf9d" },
                { icon: conflicts > 0 ? "⚠️" : "✓", value: conflicts, label: "conflicts", color: conflicts > 0 ? "#ff7b7b" : "#5cff89" },
              ];
              return (
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                  {stats.map((s) => (
                    <View key={s.label} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                      <Text style={{ fontSize: 13 }}>{s.icon}</Text>
                      <Text style={{ color: s.color, fontSize: 14, fontWeight: "900" }}>{s.value}</Text>
                      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700" }}>{s.label}</Text>
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
                const hasExcellent = plantName && areaPlants.some((c) => c !== plantName && getCompatibilityScore(plantName, c).label === "Excellent Pair");
                const needsWater = plantName && wateredPlants?.[plantName] !== getTodayKey();
                return (
                  <Pressable
                    key={`${area.id}-${slotId}`}
                    onPress={() => choosePlantForSlot(area.id, slotId)}
                    style={[styles.gardenSlotV2, {
                      backgroundColor: plantName
                        ? hasConflict ? "rgba(255,123,123,0.10)" : hasExcellent ? "rgba(92,255,137,0.12)" : "rgba(255,255,255,0.07)"
                        : "rgba(255,255,255,0.04)",
                      borderColor: hasConflict ? "#ff7b7b" : hasExcellent ? "#5cff89" : needsWater && plantName ? "#6bc7ff" : "rgba(255,255,255,0.10)",
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
                <View style={{ marginTop: 12, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                  <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 4 }}>🤝 IN THIS BED</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>
                    How the plants in {area.name} get along.
                  </Text>
                  <View style={{ gap: 8 }}>
                    {top.map(({ a, b, score }) => {
                      const isGood = score.label === "Excellent Pair";
                      const plantA = produceData.find((pd) => pd.name.toLowerCase() === a.toLowerCase());
                      const plantB = produceData.find((pd) => pd.name.toLowerCase() === b.toLowerCase());
                      const imgA = plantA ? resolvePlantImageSource(plantA) : null;
                      const imgB = plantB ? resolvePlantImageSource(plantB) : null;
                      return (
                        <View
                          key={`${area.id}-pair-${a}-${b}`}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            backgroundColor: isGood ? "rgba(92,255,137,0.08)" : "rgba(255,123,123,0.08)",
                            borderRadius: 14,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            borderWidth: 1,
                            borderColor: isGood ? "rgba(92,255,137,0.20)" : "rgba(255,123,123,0.22)",
                          }}
                        >
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                            {imgA ? <Image source={imgA} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                            <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "900" }}>+</Text>
                            {imgB ? <Image source={imgB} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: isGood ? "#8effab" : "#ff9b9b", fontSize: 13, fontWeight: "800" }}>
                              {a} + {b}
                            </Text>
                            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "600", lineHeight: 15, marginTop: 2 }}>
                              {getPairReason(a, b)}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 15, fontWeight: "900", color: isGood ? "#5cff89" : "#ff7b7b" }}>
                            {isGood ? "✓" : "⚠"}
                          </Text>
                        </View>
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
                    !suggestions.some((s) => s.name.toLowerCase() === comp.toLowerCase())
                  ) {
                    suggestions.push({ name: comp, pairsWith: planted });
                  }
                });
              });
              const top = suggestions.slice(0, 4);
              if (!top.length) return null;
              return (
                <View style={{ width: "100%", marginTop: 12, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}>
                  <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 4 }}>🌱 GREAT COMPANIONS TO ADD</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>
                    These pair well with what you've already planted in {area.name}.
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
                          onPress={() => suggestedPlant && onOpenPlant && onOpenPlant(suggestedPlant)}
                          disabled={!suggestedPlant}
                          accessibilityRole="button"
                          accessibilityLabel={`View care guide for ${s.name}`}
                          style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}
                        >
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                            {partnerImage ? (
                              <Image source={partnerImage} style={{ width: 26, height: 26 }} resizeMode="contain" />
                            ) : <Text style={{ fontSize: 18 }}>🌱</Text>}
                            <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "900" }}>+</Text>
                            {suggestedImage ? (
                              <Image source={suggestedImage} style={{ width: 26, height: 26 }} resizeMode="contain" />
                            ) : <Text style={{ fontSize: 18 }}>🌱</Text>}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800" }}>
                              {s.pairsWith} + {s.name}
                            </Text>
                            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "600", lineHeight: 15, marginTop: 2 }}>
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
              style={{ marginTop: 20, alignSelf: "stretch", backgroundColor: "rgba(255,123,123,0.10)", borderRadius: 14, paddingVertical: 12, borderTopWidth: 1, borderColor: "rgba(255,123,123,0.25)", alignItems: "center" }}
            >
              <Text style={{ color: "#ff9b9b", fontSize: 14, fontWeight: "900" }}>🗑 Delete garden</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
