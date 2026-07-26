import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { getPlantFamily } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const CropRotationCard = memo(function CropRotationCard({ theme, gardenAreas, areaHistory }) {
  const { t } = useTranslation();
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
      <IconText label={t("cropRotation.cropRotation")} style={styles.cardEyebrow} />
      <Text style={[styles.cardTitle, { color: theme.text }]}>{t("cropRotation.rotateToProtectYourSoil")}</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {warnings.length} bed{warnings.length === 1 ? "" : "s"} {warnings.length === 1 ? "has" : "have"} {t("cropRotation.theSamePlantFamilyAs")}
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {warnings.map((w, i) => (
          <View
            key={`rotation-${w.areaName}-${w.family}-${i}`}
            style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 216, 107, 0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255, 216, 107, 0.2)" }}
          >
            <Text style={{ fontSize: 20 }}>🔄</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{w.areaName}</Text>
              <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                {w.family} {t("cropRotation.grewHereIn")} {w.lastYear} {t("cropRotation.tryADifferentFamilyThis")}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        {t("cropRotation.goodRotationsFollowLegumesWith")}
      </Text>
    </View>
  );
})
