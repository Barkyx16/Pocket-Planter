import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { getPlantFamily } from "../core";

export const CropRotationCard = memo(function CropRotationCard({ theme, gardenAreas, areaHistory }) {
  const now = new Date();
  const thisYear = now.getFullYear();

  // For each area, compare what's planted now against last year's families.
  const warnings = [];
  (gardenAreas || []).forEach((area) => {
    const history = Array.isArray(areaHistory?.[area.id]) ? areaHistory[area.id] : [];
    if (!history.length) return;
    // Families currently planted in this bed.
    const currentFamilies = new Set(
      Object.values(area.plots || {})
        .filter(Boolean)
        .map((name) => getPlantFamily(name))
        .filter(Boolean)
    );
    currentFamilies.forEach((family) => {
      // Did the SAME family grow here in a PRIOR year?
      const priorYear = history.find((e) => e.family === family && e.year < thisYear);
      if (priorYear) {
        warnings.push({ areaName: area.name, family, lastYear: priorYear.year });
      }
    });
  });

  if (!warnings.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#ffd86b" }]}>
      <Text style={styles.cardEyebrow}>🔄 CROP ROTATION</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Rotate to Protect Your Soil</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {warnings.length} bed{warnings.length === 1 ? "" : "s"} {warnings.length === 1 ? "has" : "have"} the same plant family as a past year. Rotating families each season helps avoid soilborne disease and pest buildup.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {warnings.map((w, i) => (
          <View
            key={`rotation-${w.areaName}-${w.family}-${i}`}
            style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,216,107,0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255,216,107,0.22)" }}
          >
            <Text style={{ fontSize: 22 }}>🔄</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{w.areaName}</Text>
              <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                {w.family} grew here in {w.lastYear} — try a different family this season
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Good rotations: follow legumes with leafy greens, brassicas with roots, nightshades with legumes.
      </Text>
    </View>
  );
})
