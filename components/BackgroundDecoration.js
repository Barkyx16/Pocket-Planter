import { memo, useRef, useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles";

// A single soft aurora glow that slowly drifts, scales, and pulses. Uses the native
// driver (transform + opacity only) so it animates off the JS thread — smooth + cheap.
function AuroraBlob({ color, size, top, left, duration, delay = 0, drift = 40 }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration, delay, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0, duration, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [a, duration, delay]);
  const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [0, -drift] });
  const translateX = a.interpolate({ inputRange: [0, 1], outputRange: [0, drift * 0.7] });
  const scale = a.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] });
  const opacity = a.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.13] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    />
  );
}

export const BackgroundDecoration = memo(function BackgroundDecoration({ isDark }) {
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

      {/* Subtle living aurora (dark mode only — reads as ambient glow, not decoration). */}
      {isDark ? (
        <>
          <AuroraBlob color="#5cff89" size={380} top={-90} left={-110} duration={9000} drift={44} />
          <AuroraBlob color="#2fbf5f" size={340} top={220} left={200} duration={12000} delay={1500} drift={38} />
          <AuroraBlob color="#8effab" size={300} top={520} left={-70} duration={14000} delay={3000} drift={50} />
          <AuroraBlob color="#12d6a0" size={260} top={720} left={210} duration={11000} delay={800} drift={34} />
        </>
      ) : null}

      {/* faint moonlight through the canopy */}
      <View style={styles.bgSunGlow} />
      {/* deep foliage shadows */}
      <View style={styles.bgGardenOrbOne} />
      <View style={styles.bgGardenOrbTwo} />
      <View style={styles.bgGardenOrbThree} />
    </View>
  );
})
