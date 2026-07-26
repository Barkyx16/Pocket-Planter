import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const PremiumLockedSection = memo(function PremiumLockedSection({ title, description, icon, onUnlock }) {
  const { t } = useTranslation();
  return (
    <View style={styles.premiumLockedSection}>
      <View style={styles.premiumLockedSectionGlow} />
      <View style={styles.premiumLockedSectionTop}>
        <View style={styles.premiumLockedSectionIconWrap}>
          <Text style={styles.premiumLockedSectionIcon}>{icon}</Text>
        </View>
        <View style={styles.premiumLockedLockBadge}>
          <IconText label={t("premiumLockedSection.premium")} style={styles.premiumLockedLockText} />
        </View>
      </View>
      <Text style={styles.premiumLockedSectionTitle}>{title}</Text>
      <Text style={styles.premiumLockedSectionDesc}>{description}</Text>
      <Pressable onPress={onUnlock} style={styles.premiumLockedSectionButton}>
        <Text style={styles.premiumLockedSectionButtonText}>{t("premiumLockedSection.unlockPremium")}</Text>
      </Pressable>
    </View>
  );
})
