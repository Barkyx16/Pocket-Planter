import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { getClimateBucket } from "../core";

export function WeatherTeaserCard({ theme, weather, zone, onUnlock }) {
  const climate = getClimateBucket(zone);
  const currentMonth = new Date().getMonth() + 1;

  const getConditionPreview = () => {
    if (!weather) return { icon: "🌤️", label: "Loading forecast...", color: "#8effab" };
    if (weather.minTempF <= 35) return { icon: "❄️", label: "Frost risk tonight — premium alert available", color: "#6bc7ff" };
    if (weather.maxTempF >= 98) return { icon: "🔥", label: "Extreme heat today — premium action plan available", color: "#ff7b7b" };
    if (weather.maxTempF >= 90) return { icon: "☀️", label: "Hot day — premium watering guide available", color: "#ffd86b" };
    if (weather.precipChance >= 70) return { icon: "🌧️", label: "Heavy rain today — premium garden plan available", color: "#6bc7ff" };
    return { icon: "✅", label: "Good growing conditions today", color: "#5cff89" };
  };

  const condition = getConditionPreview();

  const lockedFeatures = [
    { icon: "❄️", text: "Frost alerts with cover reminders" },
    { icon: "🔥", text: "Heat stress warnings and action plans" },
    { icon: "💧", text: "Smart daily watering guidance" },
    { icon: "🧠", text: "7-day garden intelligence forecast" },
    { icon: "📍", text: "Zone-specific seasonal insights" },
    { icon: "⚡", text: "Daily smart action checklist" },
  ];

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>

      {/* HEADER */}
      <Text style={styles.cardEyebrow}>🌤️ LIVE GARDEN WEATHER</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Garden Weather</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Zone {zone || "—"} • Smart weather intelligence for your garden
      </Text>

      {/* TEASER WEATHER CARD */}
      <View style={[styles.weatherTeaserCardV2, { borderColor: `${condition.color}40` }]}>
        <View style={styles.weatherTeaserTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.weatherTeaserConditionV2, { color: condition.color }]}>
              {condition.icon} {condition.label}
            </Text>
            <Text style={[styles.weatherTeaserTempV2, { color: theme.text }]}>
              {weather?.maxTempF ? `${Math.round(weather.maxTempF)}°F` : "--°F"}
              <Text style={[styles.weatherTeaserTempLow, { color: theme.secondaryText }]}>
                {weather?.minTempF ? ` / ${Math.round(weather.minTempF)}°F` : ""}
              </Text>
            </Text>
            <Text style={[styles.weatherTeaserRainPreview, { color: theme.secondaryText }]}>
              {weather?.precipChance !== undefined ? `💧 ${Math.round(weather.precipChance)}% rain chance` : ""}
            </Text>
          </View>
          <View style={styles.weatherTeaserLockCircle}>
            <Text style={styles.weatherTeaserLockIcon}>🔒</Text>
          </View>
        </View>

        {/* BLURRED PREVIEW OF ACTIONS */}
        <View style={styles.weatherTeaserBlurWrap}>
          <View style={styles.weatherTeaserBlurRow}>
            <Text style={styles.weatherTeaserBlurIcon}>⚡</Text>
            <View style={styles.weatherTeaserBlurBar} />
          </View>
          <View style={styles.weatherTeaserBlurRow}>
            <Text style={styles.weatherTeaserBlurIcon}>💧</Text>
            <View style={[styles.weatherTeaserBlurBar, { width: "60%" }]} />
          </View>
          <View style={styles.weatherTeaserBlurRow}>
            <Text style={styles.weatherTeaserBlurIcon}>📍</Text>
            <View style={[styles.weatherTeaserBlurBar, { width: "75%" }]} />
          </View>
        </View>
        <Text style={[styles.weatherTeaserBlurLabel, { color: theme.secondaryText }]}>
          Unlock premium to see your personalized action plan
        </Text>
      </View>

      {/* LOCKED FEATURES */}
      <View style={styles.weatherTeaserFeaturesWrap}>
        <View style={styles.weatherTeaserFeaturesList}>
          {lockedFeatures.map((f, i) => (
            <View key={i} style={styles.weatherTeaserFeatureRow}>
              <Text style={styles.weatherTeaserFeatureIcon}>{f.icon}</Text>
              <Text style={[styles.weatherTeaserFeatureText, { color: theme.secondaryText }]}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* UNLOCK BUTTON */}
      <Pressable onPress={onUnlock} style={styles.weatherTeaserUnlockBtn}>
        <Text style={styles.weatherTeaserUnlockBtnText}>👑 Unlock Premium Weather Intelligence</Text>
      </Pressable>

     <Text style={[styles.weatherTeaserFooter, { color: theme.secondaryText }]}>
        $2.99/month • Cancel anytime
      </Text>
    </View>
  );
}
