import { Image, Text, View } from "react-native";
import { styles } from "../styles";
import { SCREEN_WIDTH, premiumBuddyImage } from "../core";
import { SettingsCard } from "../components/SettingsCard";

export function PremiumTab({ premiumUnlocked, premiumY, prismLogo, setPremiumUnlocked, setSubscriptionPlan, subscriptionPlan, theme, unlockPremium }) {
  return (
<View onLayout={(event) => { premiumY.current = event.nativeEvent.layout.y; }}>
    <Image
      source={premiumBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
    <SettingsCard theme={theme} premiumUnlocked={premiumUnlocked} setPremiumUnlocked={setPremiumUnlocked} subscriptionPlan={subscriptionPlan} setSubscriptionPlan={setSubscriptionPlan} onUnlockPremium={unlockPremium} />
    <View style={styles.attributionContainer}>
      <Image source={prismLogo} style={styles.attributionLogo} resizeMode="contain" />
      <Text style={[styles.attributionText, { color: theme.secondaryText }]}>Plant hardiness zone data courtesy of PRISM Climate Group and USDA.</Text>
    </View>
  </View>
  );
}
