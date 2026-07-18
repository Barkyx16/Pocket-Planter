import { Text, View } from "react-native";
import { styles } from "../styles";

export function XPCard({ theme, gardenXP }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <Text style={styles.cardEyebrow}>Garden progression</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Level {gardenXP.level} • {gardenXP.title} 🌱</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>{gardenXP.xp} total XP earned from gardening activity.</Text>
      <View style={styles.xpBarBackground}><View style={[styles.xpBarFill, { width: `${(gardenXP.progress || 0) * 100}%` }]} /></View>
      <Text style={styles.xpProgressText}>{gardenXP.currentLevelXP} / {gardenXP.nextLevelXP} XP to next level</Text>
      <View style={styles.xpStatsRow}>
        <View style={styles.xpMiniCard}><Text style={styles.xpMiniValue}>{gardenXP.level}</Text><Text style={styles.xpMiniLabel}>Level</Text></View>
        <View style={styles.xpMiniCard}><Text style={styles.xpMiniValue}>{gardenXP.xp}</Text><Text style={styles.xpMiniLabel}>XP</Text></View>
      </View>
    </View>
  );
}
