import { useRef } from "react";
import { Animated, Pressable } from "react-native";

// A Pressable that gives a subtle spring "press" on touch. Consistent tactile
// feedback across cards and buttons, on top of the existing haptics. The visual
// `style` is applied to the inner Animated.View (bg / border / padding), while
// the Pressable itself stays a transparent hit target.
export function PressableScale({ children, style, onPress, scaleTo = 0.97, disabled, ...rest }) {
  const scale = useRef(new Animated.Value(1)).current;
  const spring = (to) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 0 }).start();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => !disabled && spring(scaleTo)}
      onPressOut={() => spring(1)}
      {...rest}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export default PressableScale;
