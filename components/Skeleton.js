import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { radius } from "../theme";

// A pulsing placeholder for async loads. Several cards used to `return null`
// while AsyncStorage resolved, which flashed empty then popped in. A skeleton
// tells the user the content is coming and keeps layout height stable.
export function Skeleton({ width = "100%", height = 14, radius: r = radius.sm, style }) {
  const o = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(o, { toValue: 0.85, duration: 700, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [o]);
  return (
    <Animated.View
      style={[{ width, height, borderRadius: r, backgroundColor: "rgba(255,255,255,0.08)", opacity: o }, style]}
    />
  );
}

// A ready-made "a section is loading" block: a short label bar plus a few rows.
export function SkeletonSection({ lines = 3, style }) {
  return (
    <View style={[{ gap: 10, paddingTop: 8 }, style]}>
      <Skeleton width="50%" height={12} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={46} radius={12} />
      ))}
    </View>
  );
}

export default Skeleton;
