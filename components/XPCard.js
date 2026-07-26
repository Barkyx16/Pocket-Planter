import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { useTranslation } from "../lib/i18n";

export const XPCard = memo(function XPCard({ theme, gardenXP }) {
  const { t } = useTranslation();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <Text style={styles.cardEyebrow}>{t("xP.gardenProgression")}</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Level {gardenXP.level} • {gardenXP.title} 🌱</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>{gardenXP.xp} {t("xP.totalXpEarnedFromGardening")}</Text>
      <View style={styles.xpBarBackground}><View style={[styles.xpBarFill, { width: `${(gardenXP.progress || 0) * 100}%` }]} /></View>
      <Text style={styles.xpProgressText}>{gardenXP.currentLevelXP} / {gardenXP.nextLevelXP} {t("xP.xpToNextLevel")}</Text>
      <View style={styles.xpStatsRow}>
        <View style={styles.xpMiniCard}><Text style={styles.xpMiniValue}>{gardenXP.level}</Text><Text style={styles.xpMiniLabel}>Level</Text></View>
        <View style={styles.xpMiniCard}><Text style={styles.xpMiniValue}>{gardenXP.xp}</Text><Text style={styles.xpMiniLabel}>XP</Text></View>
      </View>
    </View>
  );
})
