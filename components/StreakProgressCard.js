import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";

export const StreakProgressCard = memo(function StreakProgressCard({ theme, streakData }) {
  const streak = streakData?.count || 0;
  const progress = Math.min(streak / 7, 1);
  return (
    <View style={[styles.streakProgressCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.streakProgressEmoji}>🔥</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.streakProgressTitle, { color: theme.text }]}>{streak}-day garden streak</Text>
        <Text style={[styles.streakProgressText, { color: theme.secondaryText }]}>Keep opening Pocket Planter to reach your next 7-day reward.</Text>
        <View style={styles.streakProgressBar}><View style={[styles.streakProgressFill, { width: `${progress * 100}%` }]} /></View>
      </View>
    </View>
  );
})
