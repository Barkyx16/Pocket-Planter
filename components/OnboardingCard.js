import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export function OnboardingCard({ onFinish }) {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      emoji: "🌱",
      title: "Welcome to Pocket Planter",
      text: "Grow smarter with planting picks, weather alerts, reminders, and garden tools built around your area.",
      features: [
        "📍 Find your garden zone",
        "🌿 Discover what to plant",
        "💚 Save your favorites",
      ],
    },
    {
      emoji: "🗺️",
      title: "Find Your Garden Zone",
      text: "Enter your ZIP code so Pocket Planter can match plants to your local growing zone.",
      features: [
        "📅 Monthly planting picks",
        "🌤️ Weather-aware tips",
        "🔥 Frost and heat warnings",
      ],
    },
    {
      emoji: "📸",
      title: "Track Your Garden",
      text: "Save plants, log photos, track watering, and build your garden planner map.",
      features: [
        "💧 Watering checks",
        "📸 Journal timeline",
        "🗺️ Garden planner",
      ],
    },
    {
      emoji: "🏆",
      title: "Earn XP and Grow",
      text: "Complete garden actions, build streaks, unlock achievements, and level up your gardener profile.",
      features: [
        "🔥 Daily streaks",
        "🏆 Achievements",
        "✨ Profile rewards",
      ],
    },
  ];

  const current = slides[slide];
  const isLast = slide === slides.length - 1;

  return (
    <View style={styles.onboardingOverlay}>
      <View style={styles.onboardingCard}>
        <Text style={styles.onboardingEmoji}>{current.emoji}</Text>

        <Text style={styles.onboardingTitle}>{current.title}</Text>

        <Text style={styles.onboardingText}>{current.text}</Text>

        <View style={styles.onboardingFeatureList}>
          {current.features.map((feature) => (
            <Text key={feature} style={styles.onboardingFeature}>
              {feature}
            </Text>
          ))}
        </View>

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
            {isLast ? "Set My Zone 🌿" : "Next →"}
          </Text>
        </Pressable>

        {!isLast ? (
          <Pressable onPress={onFinish} style={styles.onboardingSkipButton}>
            <Text style={styles.onboardingSkipText}>Skip for now</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
