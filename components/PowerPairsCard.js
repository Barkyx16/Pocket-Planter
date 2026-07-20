import { memo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { getPowerPairs, normalizeType, resolvePlantImageSource } from "../core";

// A short, plausible explanation for why two plants help each other in a shared bed.
const pairReason = (aObj, bObj) => {
  const nameA = (aObj?.name || "").toLowerCase();
  const nameB = (bObj?.name || "").toLowerCase();
  const isLegume = (n) => /\b(bean|pea|lentil|clover|peanut)\b/.test(n);
  const isAromatic = (n) => /basil|mint|marigold|onion|garlic|chive|oregano|thyme|rosemary|sage|dill|cilantro|lavender|nasturtium|parsley/.test(n);
  const isTall = (n) => /corn|sunflower|tomato|pole|okra/.test(n);
  const isGround = (n) => /lettuce|spinach|squash|cucumber|melon|zucchini|radish|carrot|beet|strawberr/.test(n);

  if (isLegume(nameA) || isLegume(nameB)) {
    const legume = isLegume(nameA) ? aObj?.name : bObj?.name;
    const other = isLegume(nameA) ? bObj?.name : aObj?.name;
    return `${legume} pulls nitrogen from the air into the soil, feeding ${other} naturally so it grows leafier and stronger.`;
  }
  if (isAromatic(nameA) || isAromatic(nameB)) {
    const herb = isAromatic(nameA) ? aObj?.name : bObj?.name;
    const other = isAromatic(nameA) ? bObj?.name : aObj?.name;
    return `${herb}'s strong scent masks ${other} and confuses or repels the pests that would normally target it.`;
  }
  if ((isTall(nameA) && isGround(nameB)) || (isTall(nameB) && isGround(nameA))) {
    const tall = isTall(nameA) ? aObj?.name : bObj?.name;
    const low = isTall(nameA) ? bObj?.name : aObj?.name;
    return `${tall} offers light shade and a windbreak while ${low} shades the soil below — they stack neatly in the same space instead of competing.`;
  }
  const ta = aObj ? normalizeType(aObj.type, aObj.name) : "";
  const tb = bObj ? normalizeType(bObj.type, bObj.name) : "";
  if (ta && tb && ta !== tb) {
    return `Different families with different appetites — they draw on different nutrients and root depths, so they share the bed without fighting for the same resources.`;
  }
  return "They grow happily side by side, making better use of the bed without competing for light, water, or root space.";
};

export const PowerPairsCard = memo(function PowerPairsCard({ theme, gardenAreas, onOpenPlant }) {
  const pairs = getPowerPairs(gardenAreas);
  const [expanded, setExpanded] = useState(null);
  if (!pairs.length) return null;

  return (
    <View>
      <Text style={styles.cardEyebrow}>🟢 POWER PAIRS</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 4 }]}>
        These plants share a bed and genuinely help each other. Tap a pair to see why it works.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {pairs.map(({ a, b, areaName }, i) => {
          const key = `pair-${a}-${b}-${i}`;
          const itemA = produceData.find((p) => p.name === a);
          const itemB = produceData.find((p) => p.name === b);
          const imgA = itemA ? resolvePlantImageSource(itemA) : null;
          const imgB = itemB ? resolvePlantImageSource(itemB) : null;
          const isOpen = expanded === key;
          return (
            <Pressable
              key={key}
              onPress={() => setExpanded(isOpen ? null : key)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              accessibilityLabel={`${a} and ${b}, great pairing. Tap for why it works.`}
              style={{ backgroundColor: "rgba(92,255,137,0.07)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Pressable onPress={() => itemA && onOpenPlant(itemA)} style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 2 }}>
                    {imgA ? <Image source={imgA} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </Pressable>
                  <Pressable onPress={() => itemB && onOpenPlant(itemB)} style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", marginLeft: -10, borderWidth: 2, borderColor: theme.card }}>
                    {imgB ? <Image source={imgB} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{a} + {b}</Text>
                  <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                    🟢 Great pairing in {areaName}
                  </Text>
                </View>
                <Text style={{ color: "#5cff89", fontSize: 15, fontWeight: "900" }}>{isOpen ? "▾" : "▸"}</Text>
              </View>

              {isOpen ? (
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 7, marginTop: 12, borderTopWidth: 1, borderTopColor: "rgba(92,255,137,0.18)", paddingTop: 10 }}>
                  <Text style={{ fontSize: 13 }}>✅</Text>
                  <Text style={{ color: "#a9e8bd", fontSize: 12.5, fontWeight: "700", lineHeight: 17, flex: 1 }}>
                    {pairReason(itemA, itemB)}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
})
