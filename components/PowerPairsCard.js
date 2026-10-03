import { memo, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { getPowerPairs, normalizeType, resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

// A short, plausible explanation for why two plants help each other in a shared bed.
const pairReason = (t, aObj, bObj) => {
  const nameA = (aObj?.name || "").toLowerCase();
  const nameB = (bObj?.name || "").toLowerCase();
  const isLegume = (n) => /\b(bean|pea|lentil|clover|peanut)\b/.test(n);
  const isAromatic = (n) => /basil|mint|marigold|onion|garlic|chive|oregano|thyme|rosemary|sage|dill|cilantro|lavender|nasturtium|parsley/.test(n);
  const isTall = (n) => /corn|sunflower|tomato|pole|okra/.test(n);
  const isGround = (n) => /lettuce|spinach|squash|cucumber|melon|zucchini|radish|carrot|beet|strawberr/.test(n);

  if (isLegume(nameA) || isLegume(nameB)) {
    const legume = isLegume(nameA) ? aObj?.name : bObj?.name;
    const other = isLegume(nameA) ? bObj?.name : aObj?.name;
    return t("ui5.pairLegume", { legume, other });
  }
  if (isAromatic(nameA) || isAromatic(nameB)) {
    const herb = isAromatic(nameA) ? aObj?.name : bObj?.name;
    const other = isAromatic(nameA) ? bObj?.name : aObj?.name;
    return t("ui5.pairAroma", { herb, other });
  }
  if ((isTall(nameA) && isGround(nameB)) || (isTall(nameB) && isGround(nameA))) {
    const tall = isTall(nameA) ? aObj?.name : bObj?.name;
    const low = isTall(nameA) ? bObj?.name : aObj?.name;
    return t("ui5.pairTall", { tall, low });
  }
  const ta = aObj ? normalizeType(aObj.type, aObj.name) : "";
  const tb = bObj ? normalizeType(bObj.type, bObj.name) : "";
  if (ta && tb && ta !== tb) {
    return t("ui5.pairFamilies");
  }
  return t("ui5.pairDefault");
};

export const PowerPairsCard = memo(function PowerPairsCard({ theme, gardenAreas, onOpenPlant }) {
  const { t } = useTranslation();
  // Compares every plant in a bed against every other, so it is far too heavy
  // to redo on renders the beds had nothing to do with.
  const pairs = useMemo(() => getPowerPairs(gardenAreas), [gardenAreas]);
  const [expanded, setExpanded] = useState(null);
  if (!pairs.length) return null;

  return (
    <View>
      <IconText label={t("powerPairs.powerPairs")} style={styles.cardEyebrow} />
      <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 4 }]}>
        {t("powerPairs.thesePlantsShareABed")}
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
              accessibilityLabel={t("extra.powerPair", { a, b })}
              style={{ backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Pressable accessibilityRole="button" onPress={() => itemA && onOpenPlant(itemA)} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 2 }}>
                    {imgA ? <Image source={imgA} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </Pressable>
                  <Pressable accessibilityRole="button" onPress={() => itemB && onOpenPlant(itemB)} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", marginLeft: -10, borderWidth: 2, borderColor: theme.card }}>
                    {imgB ? <Image source={imgB} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{a} + {b}</Text>
                  <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                    {t("powerPairs.greatPairingIn")} {areaName}
                  </Text>
                </View>
                <Text style={{ color: "#5cff89", fontSize: 14, fontWeight: "900" }}>{isOpen ? "▾" : "▸"}</Text>
              </View>

              {isOpen ? (
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 12, borderTopWidth: 1, borderTopColor: "rgba(92, 255, 137, 0.16)", paddingTop: 10 }}>
                  <Text style={{ fontSize: 12 }}>✅</Text>
                  <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "700", lineHeight: 17, flex: 1 }}>
                    {pairReason(t, itemA, itemB)}
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
