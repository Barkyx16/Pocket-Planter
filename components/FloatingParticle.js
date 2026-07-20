import { memo } from "react";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { styles } from "../styles";

export const FloatingParticle = memo(function FloatingParticle({ symbol, index, mode }) {
  const fall = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const duration = mode === "rain" ? 1800 + index * 120 : mode === "snow" ? 4200 + index * 180 : 3000 + index * 220;
    const fallLoop = Animated.loop(Animated.sequence([Animated.timing(fall, { toValue: 1, duration, useNativeDriver: true }), Animated.timing(fall, { toValue: 0, duration: 0, useNativeDriver: true })]));
    const driftLoop = Animated.loop(Animated.sequence([Animated.timing(drift, { toValue: 1, duration: 1800 + index * 140, useNativeDriver: true }), Animated.timing(drift, { toValue: 0, duration: 1800 + index * 140, useNativeDriver: true })]));
    const glowLoop = Animated.loop(Animated.sequence([Animated.timing(glow, { toValue: 1, duration: 1400 + index * 120, useNativeDriver: true }), Animated.timing(glow, { toValue: 0, duration: 1400 + index * 120, useNativeDriver: true })]));
    fallLoop.start(); driftLoop.start(); glowLoop.start();
    return () => { fallLoop.stop(); driftLoop.stop(); glowLoop.stop(); };
  }, [fall, drift, glow, index, mode]);
  const translateY = fall.interpolate({ inputRange: [0,1], outputRange: [-80,760] });
  const translateX = drift.interpolate({ inputRange: [0,1], outputRange: mode === "rain" ? [-8,8] : mode === "snow" ? [-28,28] : [-16,16] });
  const opacity = glow.interpolate({ inputRange: [0,1], outputRange: mode === "firefly" ? [0.15,0.95] : mode === "snow" ? [0.18,0.55] : [0.15,0.45] });
  return (
    <Animated.Text style={[styles.weatherParticleAnimated, { left: `${6 + index * 9}%`, opacity, transform: [{ translateY }, { translateX }, { rotate: mode === "rain" ? "12deg" : "0deg" }] }]}>
      {symbol}
    </Animated.Text>
  );
})
