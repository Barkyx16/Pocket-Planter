import React from "react";
import { Image, Text, View } from "react-native";

export default function PremiumScreen({
  styles,
  theme,
  prismLogo,
  isDark,
  appearanceMode,
  setAppearanceMode,
  premiumUnlocked,
  setPremiumUnlocked,
  subscriptionPlan,
  setSubscriptionPlan,
  SettingsCard,
}) {
  return (
    <>
      <SettingsCard
        theme={theme}
        isDark={isDark}
        appearanceMode={appearanceMode}
        setAppearanceMode={setAppearanceMode}
        premiumUnlocked={premiumUnlocked}
        setPremiumUnlocked={setPremiumUnlocked}
        subscriptionPlan={subscriptionPlan}
        setSubscriptionPlan={setSubscriptionPlan}
      />

      <View style={styles.attributionContainer}>
        <Image
          source={prismLogo}
          style={styles.attributionLogo}
          resizeMode="contain"
        />

        <Text
          style={[
            styles.attributionText,
            {
              color: theme.secondaryText,
            },
          ]}
        >
          Plant hardiness zone data courtesy of PRISM Climate Group and USDA.
        </Text>
      </View>
    </>
  );
}