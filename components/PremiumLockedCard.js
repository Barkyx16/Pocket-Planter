import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export const PremiumLockedCard = memo(function PremiumLockedCard({ theme, title, body, onUnlock }) {
  return (
    <Pressable onPress={onUnlock} style={[styles.weatherPremiumBlock, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <View style={styles.weatherLockCircle}><Text style={styles.weatherLockIcon}>🔒</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.weatherPremiumTitle}>{title || "Weather Intelligence"}</Text>
        <Text style={styles.weatherPremiumText}>{body || "Unlock premium to see smart weather alerts, frost risk, heat warnings, and watering guidance."}</Text>
      </View>
      <View style={styles.weatherUnlockButton}><Text style={styles.weatherUnlockText}>👑 Unlock Premium ›</Text></View>
    </Pressable>
  );
})
