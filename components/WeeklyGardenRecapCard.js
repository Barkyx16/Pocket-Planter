import { Text, View } from "react-native";
import { styles } from "../styles";

export function WeeklyGardenRecapCard({
  theme,
  savedPlants,
  journalEntries,
  wateredPlants,
  gardenXP,
  streakData,
}) {
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
        WEEKLY RECAP
      </Text>

      <Text
        style={[
          styles.weeklyRecapTitle,
          { color: theme.text },
        ]}
      >
        Your Garden Progress 🌱
      </Text>

      <View style={styles.weeklyRecapGrid}>
        {wateredCount > 0 && (
          <Text style={styles.weeklyRecapItem}>
            💧 Watered: {wateredCount}
          </Text>
        )}

        {journalEntries.length > 0 && (
          <Text style={styles.weeklyRecapItem}>
            📸 Photos: {journalEntries.length}
          </Text>
        )}

        {savedPlants.length > 0 && (
          <Text style={styles.weeklyRecapItem}>
            🪴 Saved: {savedPlants.length}
          </Text>
        )}

        {gardenXP.xp > 0 && (
          <Text style={styles.weeklyRecapItem}>
            ⭐ XP: {gardenXP.xp}
          </Text>
        )}
      </View>

      <Text style={styles.weeklyRecapFooter}>
        🔥 Current streak:{" "}
        {streakData?.count || 0} days
      </Text>
    </View>
  );
}
