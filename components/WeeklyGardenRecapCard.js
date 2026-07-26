import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { useTranslation } from "../lib/i18n";

export const WeeklyGardenRecapCard = memo(function WeeklyGardenRecapCard({
  theme,
  savedPlants,
  journalEntries,
  wateredPlants,
  gardenXP,
  streakData,
}) {
  const { t } = useTranslation();
  const wateredCount = Object.values(
    wateredPlants || {}
  ).filter(Boolean).length;

  const hasAnyData =
    savedPlants.length > 0 ||
    journalEntries.length > 0 ||
    wateredCount > 0;

  if (!hasAnyData) {
    return null;
  }

  return (
    <View
      style={[
        styles.weeklyRecapCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={styles.weeklyRecapEyebrow}>
        {t("weeklyGardenRecap.weeklyRecap")}
      </Text>

      <Text
        style={[
          styles.weeklyRecapTitle,
          { color: theme.text },
        ]}
      >
        {t("weeklyGardenRecap.yourGardenProgress")}
      </Text>

      <View style={styles.weeklyRecapGrid}>
        {wateredCount > 0 && (
          <Text style={styles.weeklyRecapItem}>
            {t("weeklyGardenRecap.watered")} {wateredCount}
          </Text>
        )}

        {journalEntries.length > 0 && (
          <Text style={styles.weeklyRecapItem}>
            {t("weeklyGardenRecap.photos")} {journalEntries.length}
          </Text>
        )}

        {savedPlants.length > 0 && (
          <Text style={styles.weeklyRecapItem}>
            {t("weeklyGardenRecap.saved")} {savedPlants.length}
          </Text>
        )}

        {gardenXP.xp > 0 && (
          <Text style={styles.weeklyRecapItem}>
            {t("weeklyGardenRecap.xp")} {gardenXP.xp}
          </Text>
        )}
      </View>

      <Text style={styles.weeklyRecapFooter}>
        {t("weeklyGardenRecap.currentStreak")}{" "}
        {streakData?.count || 0} days
      </Text>
    </View>
  );
})
