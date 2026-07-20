import { memo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { findGardenConflicts, normalizeType, resolvePlantImageSource } from "../core";

export const FixMyGardenCard = memo(function FixMyGardenCard({ theme, gardenAreas, onOpenPlant }) {
  const conflicts = findGardenConflicts(gardenAreas);
  const [expanded, setExpanded] = useState(null);
  if (!conflicts.length) return null;

  // A short, plausible explanation for why a given pair shouldn't share a bed.
  const conflictReason = (aObj, bObj) => {
    if (!aObj || !bObj) return "They compete for the same nutrients, water, and root space.";
    const ta = normalizeType(aObj.type, aObj.name);
    const tb = normalizeType(bObj.type, bObj.name);
    if (ta === tb) return `Both are ${ta.toLowerCase()} — grouping them concentrates the same pests and soil-borne diseases.`;
    return "They compete for the same nutrients and root space, and can stunt each other's growth.";
  };

return (
    <View>
      <Text style={[styles.cardEyebrow, { color: "#ff9f9f" }]}>🔴 CONFLICTS TO FIX</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 4 }]}>
        {conflicts.length} pair{conflicts.length === 1 ? "" : "s"} of plants in your beds don't grow well together. Tap a pair to see why — and how to fix it.
      </Text>

      <View style={{ gap: 10, marginTop: 16 }}>
        {conflicts.map((c, i) => {
          const key = `conflict-${c.areaId}-${i}`;
          const plantAObj = produceData.find((p) => p.name === c.plantA);
          const plantBObj = produceData.find((p) => p.name === c.plantB);
          const imgA = plantAObj ? resolvePlantImageSource(plantAObj) : null;
          const imgB = plantBObj ? resolvePlantImageSource(plantBObj) : null;
          const isOpen = expanded === key;
          return (
            <Pressable
              key={key}
              onPress={() => setExpanded(isOpen ? null : key)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              accessibilityLabel={`${c.plantA} and ${c.plantB} conflict. Tap for why and how to fix it.`}
              style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "rgba(255,123,123,0.22)" }}
            >
              {/* the conflicting pair */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Pressable onPress={() => plantAObj && onOpenPlant(plantAObj)} style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {imgA ? <Image source={imgA} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </View>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", flexShrink: 1 }}>{c.plantA}</Text>
                </Pressable>

                <Text style={{ color: "#ff7b7b", fontSize: 18, fontWeight: "900" }}>✕</Text>

                <Pressable onPress={() => plantBObj && onOpenPlant(plantBObj)} style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", flexShrink: 1, textAlign: "right" }}>{c.plantB}</Text>
                  <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {imgB ? <Image source={imgB} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </View>
                </Pressable>

                <Text style={{ color: "#ff9f9f", fontSize: 15, fontWeight: "900", marginLeft: 4 }}>{isOpen ? "▾" : "▸"}</Text>
              </View>

              {isOpen ? (
                <>
                  {/* why they conflict */}
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 7, marginTop: 12 }}>
                    <Text style={{ fontSize: 13 }}>⚠️</Text>
                    <Text style={{ color: "#ffb3b3", fontSize: 12.5, fontWeight: "700", lineHeight: 17, flex: 1 }}>
                      {conflictReason(plantAObj, plantBObj)}
                    </Text>
                  </View>

                  {/* location + advice */}
                  <View style={{ marginTop: 10, backgroundColor: "rgba(0,0,0,0.18)", borderRadius: 12, padding: 10 }}>
                    <Text style={{ color: "#ffb3b3", fontSize: 12, fontWeight: "900" }}>
                      📍 Both in: {c.areaName}
                    </Text>
                    <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800", lineHeight: 19, marginTop: 4 }}>
                      {c.suggestion
                        ? `✅ Fix: move ${c.suggestion.move} to ${c.suggestion.toAreaName} — it has room and no conflicts there.`
                        : `✅ Fix: move ${c.plantA} or ${c.plantB} to a different bed to give them space.`}
                    </Text>
                  </View>
                </>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Based on companion planting guidelines. Rearrange in your Garden planner.
      </Text>
    </View>
  );
})
