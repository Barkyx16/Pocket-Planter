import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { useTranslation } from "../lib/i18n";

export const StreakProgressCard = memo(function StreakProgressCard({ theme, streakData }) {
  const { t } = useTranslation();
  const streak = streakData?.count || 0;
  const progress = Math.min(streak / 7, 1);
  return (
    <View style={[styles.streakProgressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.streakProgressEmoji}>🔥</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.streakProgressTitle, { color: theme.text }]}>{streak}{t("streakProgress.dayGardenStreak")}</Text>
        <Text style={[styles.streakProgressText, { color: theme.secondaryText }]}>{t("streakProgress.keepOpeningPocketPlanterTo")}</Text>
        <View style={styles.streakProgressBar}><View style={[styles.streakProgressFill, { width: `${progress * 100}%` }]} /></View>
      </View>
    </View>
  );
})
