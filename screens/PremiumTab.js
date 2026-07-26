import { Image, Text, View } from "react-native";
import { styles } from "../styles";
import { SettingsCard } from "../components/SettingsCard";
import { t } from "../lib/i18n";

export function PremiumTab({ premiumUnlocked, premiumY, prismLogo, setPremiumUnlocked, setSubscriptionPlan, subscriptionPlan, theme, unlockPremium }) {
  return (
<View onLayout={(event) => { premiumY.current = event.nativeEvent.layout.y; }}>
    <SettingsCard theme={theme} premiumUnlocked={premiumUnlocked} setPremiumUnlocked={setPremiumUnlocked} subscriptionPlan={subscriptionPlan} setSubscriptionPlan={setSubscriptionPlan} onUnlockPremium={unlockPremium} />
    <View style={styles.attributionContainer}>
      <Image source={prismLogo} style={styles.attributionLogo} resizeMode="contain" />
      <Text style={[styles.attributionText, { color: theme.secondaryText }]}>{t("premium.plantHardinessZoneDataCourtesy")}</Text>
    </View>
  </View>
  );
}
