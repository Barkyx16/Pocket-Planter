import { Text, View } from "react-native";
import { styles } from "../styles";

export function WeatherWarningBanner({
  theme,
  weather,
  zone,
}) {
  const warning =
    weather?.maxTempF >= 98
      ? {
          icon: "🔥",
          title: "Heat warning today",
          text: "Water early, add shade for young plants, and avoid transplanting during peak heat.",
        }
      : weather?.minTempF <= 35
      ? {
          icon: "❄️",
          title: "Frost risk tonight",
          text: "Cover tender plants and move containers near shelter before evening.",
        }
      : weather?.precipChance >= 70
      ? {
          icon: "🌧️",
          title: "Rain likely soon",
          text: "Skip extra watering unless the soil is already dry.",
        }
      : null;

  if (!warning) {
    return null;
  }

  return (
    <View
      style={[
        styles.weatherWarningBanner,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={styles.weatherWarningIcon}>
        {warning.icon}
      </Text>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.weatherWarningTitle,
            { color: theme.text },
          ]}
        >
          {warning.title}
        </Text>

        <Text
          style={[
            styles.weatherWarningText,
            {
              color:
                theme.secondaryText,
            },
          ]}
        >
          {warning.text}
        </Text>
      </View>
    </View>
  );
}
