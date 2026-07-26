import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const PremiumIntroCard = memo(function PremiumIntroCard({ onClose, onUnlock }) {
  const { t } = useTranslation();
  return (
    <View style={styles.premiumGlassCard}>
      <View style={styles.premiumGlowOrb} />
      <View style={styles.premiumGlowOrbTwo} />
      <View style={styles.premiumTopRow}>
        <View style={styles.premiumBadge}><IconText label={t("premiumIntro.pocketPlanterPremium")} style={styles.premiumBadgeText} /></View>
        <View style={styles.premiumRibbon}><Text style={styles.premiumRibbonIcon}>👑</Text><Text style={styles.premiumRibbonText}>PREMIUM</Text></View>
      </View>
      <Text style={styles.premiumHeadline}>{t("premiumIntro.turnYourBackyardIntoA")} <Text style={styles.premiumHeadlineGreen}>{t("premiumIntro.thrivingGarden")}</Text></Text>
      <Text style={styles.premiumSubheadline}>{t("premiumIntro.unlockCompanionPlantingIntelligenceSmart")}</Text>
      <View style={styles.premiumFeatureGridNew}>
        <IconText label={t("premiumIntro.pairScores")} style={styles.premiumFeatureNew} />
        <IconText label={t("premiumIntro.avoidWarnings")} style={styles.premiumFeatureNew} />
        <IconText label={t("premiumIntro.pestTips")} style={styles.premiumFeatureNew} />
        <IconText label={t("premiumIntro.gardenScore")} style={styles.premiumFeatureNew} />
      </View>
      <View style={styles.premiumActionRowNew}>
        <Pressable style={styles.premiumCtaButton} onPress={onUnlock}><Text style={styles.premiumCtaText}>{t("premiumIntro.startGrowingSmarter")}</Text></Pressable>
        <Pressable style={styles.premiumLaterButton} onPress={onClose}><Text style={styles.premiumLaterText}>{t("premiumIntro.maybeLater")}</Text></Pressable>
      </View>
    <IconText label={t("premiumIntro.n299monthOr2499yearCancelAnytime")} style={styles.premiumPriceText} />
    </View>
  );
})
