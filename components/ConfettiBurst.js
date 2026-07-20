import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";

export const ConfettiBurst = memo(function ConfettiBurst() {
  const pieces = [
    "🎉",
    "🌱",
    "✨",
    "💚",
    "🏆",
    "🌿",
    "🎊",
    "⭐",
  ];

  return (
    <View
      pointerEvents="none"
      style={styles.confettiLayer}
    >
      {pieces.map((piece, index) => (
        <Text
          key={`${piece}-${index}`}
          style={[
            styles.confettiPiece,
            {
              left: `${8 + index * 11}%`,
              top: index % 2 === 0 ? 80 : 135,
            },
          ]}
        >
          {piece}
        </Text>
      ))}
    </View>
  );
})
