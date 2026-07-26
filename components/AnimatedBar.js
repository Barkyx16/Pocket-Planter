import { memo } from "react";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { duration as motionDuration } from "../lib/motion";

export const AnimatedBar = memo(function AnimatedBar({ progress, color = "#5cff89", trackStyle, fillStyle }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: Math.max(0, Math.min(progress || 0, 1)),
      duration: motionDuration("slow"),
      useNativeDriver: false,
    }).start();
  }, [progress, widthAnim]);
  const width = widthAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  return (
    <View style={trackStyle}>
      <Animated.View style={[fillStyle, { width, backgroundColor: color }]} />
    </View>
  );
})
