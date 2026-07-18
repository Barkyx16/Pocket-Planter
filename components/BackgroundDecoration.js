import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles";

export function BackgroundDecoration({ isDark }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={
          isDark
            ? ["#08180d", "#040f07", "#020703"]
            : ["#dff5dc", "#eef8ee", "#f4fbf2"]
        }
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* faint moonlight through the canopy */}
      <View style={styles.bgSunGlow} />
      {/* deep foliage shadows */}
      <View style={styles.bgGardenOrbOne} />
      <View style={styles.bgGardenOrbTwo} />
      <View style={styles.bgGardenOrbThree} />
    </View>
  );
}
