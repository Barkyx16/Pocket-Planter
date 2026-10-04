import { memo } from "react";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { styles } from "../styles";
import { BackgroundDecoration } from "./BackgroundDecoration";
import { PREMIUM_FEATURES } from "../core";
import { useTranslation } from "../lib/i18n";

export const OnboardingCard = memo(function OnboardingCard({ onFinish, isDark = true }) {
  const { t } = useTranslation();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      icon: "🌱",
      eyebrow: t("onboardingSlides.s0Eyebrow"),
      title: t("onboardingSlides.s0Title"),
      text: t("onboardingSlides.s0Text"),
      features: [
        { icon: "📍", title: t("onboardingSlides.s0f1Title"), text: t("onboardingSlides.s0f1Text") },
        { icon: "🌿", title: t("onboardingSlides.s0f2Title"), text: t("onboardingSlides.s0f2Text") },
        { icon: "💚", title: t("onboardingSlides.s0f3Title"), text: t("onboardingSlides.s0f3Text") },
      ],
    },
    {
      icon: "🗺️",
      eyebrow: t("onboardingSlides.s1Eyebrow"),
      title: t("onboardingSlides.s1Title"),
      text: t("onboardingSlides.s1Text"),
      features: [
        { icon: "📅", title: t("onboardingSlides.s1f1Title"), text: t("onboardingSlides.s1f1Text") },
        { icon: "🌤️", title: t("onboardingSlides.s1f2Title"), text: t("onboardingSlides.s1f2Text") },
        { icon: "🔥", title: t("onboardingSlides.s1f3Title"), text: t("onboardingSlides.s1f3Text") },
      ],
    },
    {
      icon: "📸",
      eyebrow: t("onboardingSlides.s2Eyebrow"),
      title: t("onboardingSlides.s2Title"),
      text: t("onboardingSlides.s2Text"),
      features: [
        { icon: "💧", title: t("onboardingSlides.s2f1Title"), text: t("onboardingSlides.s2f1Text") },
        { icon: "📸", title: t("onboardingSlides.s2f2Title"), text: t("onboardingSlides.s2f2Text") },
        { icon: "🗺️", title: t("onboardingSlides.s2f3Title"), text: t("onboardingSlides.s2f3Text") },
      ],
    },
    {
      icon: "🏆",
      eyebrow: t("onboardingSlides.s3Eyebrow"),
      title: t("onboardingSlides.s3Title"),
      text: t("onboardingSlides.s3Text"),
      features: [
        { icon: "🔥", title: t("onboardingSlides.s3f1Title"), text: t("onboardingSlides.s3f1Text") },
        { icon: "🏆", title: t("onboardingSlides.s3f2Title"), text: t("onboardingSlides.s3f2Text") },
        { icon: "✨", title: t("onboardingSlides.s3f3Title"), text: t("onboardingSlides.s3f3Text") },
      ],
    },
    {
      // Premium finale — showcases everything Premium unlocks. Rendered from the
      // shared PREMIUM_FEATURES manifest so it always matches the Premium tab.
      icon: "👑",
      eyebrow: t("premiumCard.eyebrow"),
      title: t("premiumCard.headline"),
      text: t("premiumCard.blurb"),
      features: PREMIUM_FEATURES.map((f) => ({ icon: f.icon, title: t(f.titleKey), text: t(f.bodyKey) })),
    },
  ];

  const current = slides[slide];
  const isLast = slide === slides.length - 1;

  return (
    // Wrapped like every other screen in the app: a SafeAreaView over the shared
    // leafy wallpaper. Onboarding used to return a bare View, so it sat under the
    // status bar / notch and never matched the rest of the app.
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <BackgroundDecoration isDark={isDark} />
      <View style={styles.onboardingOverlay}>
      <View style={[styles.onboardingCard, { padding: 16, maxHeight: "88%" }]}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* HERO — matches the Premium screen */}
          <View style={styles.premiumHeroSection}>
            <View style={styles.premiumHeroGlowOrbOne} />
            <View style={styles.premiumHeroGlowOrbTwo} />

            <View style={styles.premiumCrownWrap}>
              <Text style={styles.premiumCrownEmoji}>{current.icon}</Text>
            </View>

            <Text style={styles.premiumHeroEyebrow}>{current.eyebrow}</Text>
            <Text style={styles.premiumHeroHeadline}>{current.title}</Text>
            <Text style={styles.premiumHeroSubtext}>{current.text}</Text>
          </View>

          {/* FEATURE TILES — matches the Premium feature grid */}
          <View style={[styles.premiumFeaturesCard, { backgroundColor: "rgba(255, 255, 255, 0.04)", borderColor: "rgba(92, 255, 137, 0.16)" }]}>
            <View style={styles.premiumFeaturesGrid}>
              {current.features.map((f) => (
                <View key={f.title} style={styles.premiumFeatureTile}>
                  <View style={styles.premiumFeatureTileIconWrap}>
                    <Text style={styles.premiumFeatureTileIcon}>{f.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.premiumFeatureTileTitle}>{f.title}</Text>
                    <Text style={styles.premiumFeatureTileText}>{f.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.onboardingDots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.onboardingDot,
                index === slide && styles.onboardingDotActive,
              ]}
            />
          ))}
        </View>

        <Pressable
          style={styles.onboardingButton}
          onPress={() => {
            if (isLast) {
              onFinish();
              return;
            }
            setSlide((currentSlide) => currentSlide + 1);
          }}
        >
          <Text style={styles.onboardingButtonText}>
            {isLast ? t("onboarding.setMyZone") : t("onboarding.next")}
          </Text>
        </Pressable>

        {!isLast ? (
          <Pressable onPress={onFinish} style={styles.onboardingSkipButton}>
            <Text style={styles.onboardingSkipText}>{t("onboarding.skipForNow")}</Text>
          </Pressable>
        ) : null}
      </View>
      </View>
    </SafeAreaView>
  );
})
