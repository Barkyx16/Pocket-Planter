import { memo, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { findGardenConflicts, normalizeType, resolvePlantImageSource, typeLabel } from "../core";
import { IconText } from "./IconText";
import { tn, useTranslation } from "../lib/i18n";

export const FixMyGardenCard = memo(function FixMyGardenCard({ theme, gardenAreas, onOpenPlant, onFocusConflict }) {
  const { t } = useTranslation();
  // O(n^2) over every bed, plus a relocation search per conflict — only redo it
  // when the beds actually change.
  const conflicts = useMemo(() => findGardenConflicts(gardenAreas), [gardenAreas]);
  const [expanded, setExpanded] = useState(null);
  if (!conflicts.length) return null;

  // A short, plausible explanation for why a given pair shouldn't share a bed.
  const conflictReason = (aObj, bObj) => {
    if (!aObj || !bObj) return t("ui2.reasonGeneric");
    const ta = normalizeType(aObj.type, aObj.name);
    const tb = normalizeType(bObj.type, bObj.name);
    if (ta === tb) return t("ui2.reasonSameType", { type: typeLabel(ta) });
    return t("ui2.reasonOther");
  };

return (
    <View>
      <IconText label={t("fixMyGarden.conflictsToFix")} style={[styles.cardEyebrow, {
  color: "#ff9f9f"
}]} />
      <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 4 }]}>
        {tn("counts.pairsClash", conflicts.length)}
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
              onPress={() => onFocusConflict ? onFocusConflict(c) : setExpanded(isOpen ? null : key)}
              accessibilityRole="button"
              accessibilityState={{ expanded: onFocusConflict ? undefined : isOpen }}
              accessibilityLabel={onFocusConflict
                ? t("ui2.conflictInA11y", { a: c.plantA, b: c.plantB, bed: c.areaName })
                : t("ui2.conflictA11y", { a: c.plantA, b: c.plantB })}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255, 123, 123, 0.2)" }}
            >
              {/* the conflicting pair */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Pressable onPress={() => plantAObj && onOpenPlant(plantAObj)} style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {imgA ? <Image source={imgA} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </View>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", flexShrink: 1 }}>{c.plantA}</Text>
                </Pressable>

                <Text style={{ color: "#ff7b7b", fontSize: 18, fontWeight: "900" }}>✕</Text>

                <Pressable onPress={() => plantBObj && onOpenPlant(plantBObj)} style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", flexShrink: 1, textAlign: "right" }}>{c.plantB}</Text>
                  <View style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {imgB ? <Image source={imgB} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                  </View>
                </Pressable>

                {onFocusConflict ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2, marginLeft: 4, backgroundColor: "rgba(92, 255, 137, 0.12)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900" }}>Fix</Text>
                    <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900" }}>›</Text>
                  </View>
                ) : (
                  <Text style={{ color: "#ff9f9f", fontSize: 14, fontWeight: "900", marginLeft: 4 }}>{isOpen ? "▾" : "▸"}</Text>
                )}
              </View>

              {isOpen && !onFocusConflict ? (
                <>
                  {/* why they conflict */}
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 12 }}>
                    <Text style={{ fontSize: 12 }}>⚠️</Text>
                    <Text style={{ color: "#ff9f9f", fontSize: 12, fontWeight: "700", lineHeight: 17, flex: 1 }}>
                      {conflictReason(plantAObj, plantBObj)}
                    </Text>
                  </View>

                  {/* location + advice */}
                  <View style={{ marginTop: 10, backgroundColor: "rgba(0, 0, 0, 0.16)", borderRadius: 12, padding: 10 }}>
                    <Text style={{ color: "#ff9f9f", fontSize: 12, fontWeight: "900" }}>
                      {t("fixMyGarden.bothIn")} {c.areaName}
                    </Text>
                    <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800", lineHeight: 19, marginTop: 4 }}>
                      {c.suggestion
                        ? t("ui2.fixLine", { fix: t("garden.conflictFixMove", { plant: c.suggestion.move, bed: c.suggestion.toAreaName }) })
                        : t("ui2.fixLine", { fix: t("garden.conflictFixEither", { plantA: c.plantA, plantB: c.plantB }) })}
                    </Text>
                  </View>
                </>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        {t("fixMyGarden.basedOnCompanionPlantingGuidelines")}
      </Text>
    </View>
  );
})
