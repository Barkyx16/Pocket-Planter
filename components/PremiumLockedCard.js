import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const PremiumLockedCard = memo(function PremiumLockedCard({ theme, title, body, onUnlock }) {
  const { t } = useTranslation();
  return (
    <Pressable onPress={onUnlock} style={[styles.weatherPremiumBlock, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <View style={styles.weatherLockCircle}><Text style={styles.weatherLockIcon}>🔒</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.weatherPremiumTitle}>{title || t("premiumLocked.weatherIntelligence")}</Text>
        <Text style={styles.weatherPremiumText}>{body || t("premiumLocked.unlockPremiumToSeeSmart")}</Text>
      </View>
      <View style={styles.weatherUnlockButton}><IconText label={t("premiumLocked.unlockPremium")} style={styles.weatherUnlockText} /></View>
    </Pressable>
  );
})
