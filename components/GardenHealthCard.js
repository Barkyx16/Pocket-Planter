import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { getCompatibilityScore } from "../core";
import { useTranslation } from "../lib/i18n";

export const GardenHealthCard = memo(function GardenHealthCard({ theme, gardenHealth, gardenMap }) {
  const { t } = useTranslation();
  const plants = Object.values(gardenMap || {}).filter(Boolean);
  const conflicts = [];
  const tips = [];
  plants.forEach((plant) => {
    plants.forEach((compare) => {
      if (plant === compare) return;
      const score = getCompatibilityScore(plant, compare);
      if (score.label === "Avoid") { const w = `⚠ Move ${plant} away from ${compare}. They should not grow too close together.`; if (!conflicts.includes(w)) conflicts.push(w); }
      if (score.label === "Excellent Pair") { const t = `🌱 ${plant} grows well near ${compare}.`; if (!tips.includes(t)) tips.push(t); }
    });
  });
  return (
    <View style={[styles.gardenHealthCard, { borderColor: gardenHealth.score >= 80 ? "#5cff89" : gardenHealth.score >= 60 ? "#ffd86b" : "#ff7b7b" }]}>
      <Text style={styles.gardenHealthLabel}>{t("gardenHealth.gardenCompatibilityScore")}</Text>
      <Text style={styles.gardenHealthScore}>{gardenHealth.score}%</Text>
      <Text style={styles.gardenHealthStatus}>{gardenHealth.label}</Text>
      <View style={styles.healthMetricRow}>
        {[t("gardenHealth.companionBalance"),t("gardenHealth.waterBalance"),t("gardenHealth.sunMatch"),t("gardenHealth.zoneFit")].map((m) => (<Text key={m} style={styles.healthMetric}>{m}</Text>))}
      </View>
      {conflicts.length ? (<View style={styles.conflictWarningBox}>{conflicts.slice(0, 3).map((w) => (<Text key={w} style={styles.conflictWarningText}>{w}</Text>))}</View>) : (<Text style={styles.noConflictText}>{t("gardenHealth.noMajorCompanionConflictsFound")}</Text>)}
      {tips.length ? (<View style={[styles.conflictWarningBox, { marginTop: 10, borderColor: "#5cff89" }]}>{tips.slice(0, 3).map((t) => (<Text key={t} style={[styles.conflictWarningText, { color: "#5cff89" }]}>{t}</Text>))}</View>) : null}
    </View>
  );
})
