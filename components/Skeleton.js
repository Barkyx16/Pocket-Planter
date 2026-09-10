import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { radius } from "../theme";
import { useReducedMotion } from "../lib/motion";

// A pulsing placeholder for async loads. Several cards used to `return null`
// while AsyncStorage resolved, which flashed empty then popped in. A skeleton
// tells the user the content is coming and keeps layout height stable.
//
// The pulse is a loop that runs for as long as the load takes, and it used to
// run whatever the OS reduced-motion setting said — the one animation in the app
// that never asked. Thirteen cards use this, so with the setting on there was
// something quietly throbbing on nearly every screen while it loaded, which is
// the exact thing people turn that setting on to stop. It now holds a steady
// mid-opacity instead: still visibly a placeholder, still keeping the height,
// just not moving.
export function Skeleton({ width = "100%", height = 14, radius: r = radius.sm, style }) {
  const reduced = useReducedMotion();
  const o = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    if (reduced) {
      // Settle somewhere between the two ends of the pulse rather than at its
      // dimmest, so a still skeleton still reads as one.
      o.setValue(0.6);
      return undefined;
    }
    // Not routed through motion's duration(): with reduced motion on that
    // returns 0, and an Animated.loop of zero-length steps spins rather than
    // stops. The early return above is the correct answer for a loop.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(o, { toValue: 0.85, duration: 700, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [o, reduced]);
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
