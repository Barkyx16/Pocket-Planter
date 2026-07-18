import { Text, View } from "react-native";
import { styles } from "../styles";
import { getUpcomingFrost } from "../core";

export function FrostBanner({ theme, weather, frostAlertsOn }) {
  const frost = getUpcomingFrost(weather);
  if (!frost) return null;
  const whenText =
    frost.daysOut === 0 ? "tonight"
    : frost.daysOut === 1 ? "tomorrow night"
    : `in ${frost.daysOut} days`;
  return (
    <View style={[styles.frostBanner, { borderColor: "#6bc7ff" }]}>
      <Text style={styles.frostBannerIcon}>❄️</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.frostBannerTitle}>Frost expected {whenText}</Text>
        <Text style={styles.frostBannerText}>
          Low of {Math.round(frost.minTempF)}°F coming — cover tender plants, move containers to shelter, and hold off on transplanting.
        </Text>
        {!frostAlertsOn ? (
          <Text style={styles.frostBannerHint}>
            Turn on Frost Alerts in the Garden tab to get a heads-up each cold evening.
          </Text>
        ) : null}
      </View>
    </View>
  );
}
