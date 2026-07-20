import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export const PremiumIntroCard = memo(function PremiumIntroCard({ onClose, onUnlock }) {
  return (
    <View style={styles.premiumGlassCard}>
      <View style={styles.premiumGlowOrb} />
      <View style={styles.premiumGlowOrbTwo} />
      <View style={styles.premiumTopRow}>
        <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>👑 Pocket Planter Premium</Text></View>
        <View style={styles.premiumRibbon}><Text style={styles.premiumRibbonIcon}>👑</Text><Text style={styles.premiumRibbonText}>PREMIUM</Text></View>
      </View>
      <Text style={styles.premiumHeadline}>Turn your backyard into a <Text style={styles.premiumHeadlineGreen}>thriving garden.</Text></Text>
      <Text style={styles.premiumSubheadline}>Unlock companion planting intelligence, smart weather alerts, garden compatibility scoring, reminders, journal photos, and a beautiful garden map.</Text>
      <View style={styles.premiumFeatureGridNew}>
        <Text style={styles.premiumFeatureNew}>🟢 Pair scores</Text>
        <Text style={styles.premiumFeatureNew}>⚠ Avoid warnings</Text>
        <Text style={styles.premiumFeatureNew}>🐛 Pest tips</Text>
        <Text style={styles.premiumFeatureNew}>🗺️ Garden score</Text>
      </View>
      <View style={styles.premiumActionRowNew}>
        <Pressable style={styles.premiumCtaButton} onPress={onUnlock}><Text style={styles.premiumCtaText}>Start Growing Smarter 🌱</Text></Pressable>
        <Pressable style={styles.premiumLaterButton} onPress={onClose}><Text style={styles.premiumLaterText}>Maybe later</Text></Pressable>
      </View>
    <Text style={styles.premiumPriceText}>🛡️ $2.99/month or $24.99/year • Cancel anytime</Text>
    </View>
  );
})
