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
      eyebrow: "WELCOME TO POCKET PLANTER",
      title: "Grow smarter,\ngarden better.",
      text: "Everything you need to plan, track, and grow a thriving garden — matched to your area.",
      features: [
        { icon: "📍", title: "Your garden zone", text: "Plants matched to your local climate." },
        { icon: "🌿", title: "What to plant", text: "Monthly picks tailored to your area." },
        { icon: "💚", title: "Save favorites", text: "Build your own plant collection." },
      ],
    },
    {
      icon: "🗺️",
      eyebrow: "STEP 1 · YOUR ZONE",
      title: "Find your\ngrowing zone",
      text: "Enter your ZIP and Pocket Planter tailors everything to your local conditions.",
      features: [
        { icon: "📅", title: "Monthly picks", text: "Know exactly what to sow each month." },
        { icon: "🌤️", title: "Weather-aware tips", text: "Guidance that reacts to your forecast." },
        { icon: "🔥", title: "Frost & heat alerts", text: "Warnings before dangerous temps hit." },
      ],
    },
    {
      icon: "📸",
      eyebrow: "STEP 2 · TRACK",
      title: "Track your\ngarden",
      text: "Save plants, log photos, track watering, and plan out every bed.",
      features: [
        { icon: "💧", title: "Watering checks", text: "Never forget to water again." },
        { icon: "📸", title: "Journal timeline", text: "Watch your garden grow over time." },
        { icon: "🗺️", title: "Garden planner", text: "Plan beds with companion scoring." },
      ],
    },
    {
      icon: "🏆",
      eyebrow: "STEP 3 · LEVEL UP",
      title: "Earn XP\nand grow",
      text: "Complete garden actions, build streaks, and unlock achievements.",
      features: [
        { icon: "🔥", title: "Daily streaks", text: "Keep your momentum going." },
        { icon: "🏆", title: "Achievements", text: "Unlock badges as you grow." },
        { icon: "✨", title: "Profile rewards", text: "Level up your gardener profile." },
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
      <View style={[styles.onboardingCard, { padding: 16, maxHeight: "92%" }]}>
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
