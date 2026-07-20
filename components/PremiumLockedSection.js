import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export const PremiumLockedSection = memo(function PremiumLockedSection({ title, description, icon, onUnlock }) {
  return (
    <View style={styles.premiumLockedSection}>
      <View style={styles.premiumLockedSectionGlow} />
      <View style={styles.premiumLockedSectionTop}>
        <View style={styles.premiumLockedSectionIconWrap}>
          <Text style={styles.premiumLockedSectionIcon}>{icon}</Text>
        </View>
        <View style={styles.premiumLockedLockBadge}>
          <Text style={styles.premiumLockedLockText}>🔒 Premium</Text>
        </View>
      </View>
      <Text style={styles.premiumLockedSectionTitle}>{title}</Text>
      <Text style={styles.premiumLockedSectionDesc}>{description}</Text>
      <Pressable onPress={onUnlock} style={styles.premiumLockedSectionButton}>
        <Text style={styles.premiumLockedSectionButtonText}>Unlock Premium 🌱</Text>
      </Pressable>
    </View>
  );
})
