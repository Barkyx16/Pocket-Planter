import { Text, View } from "react-native";

// Iconography rule for the app:
//   • Emoji  → CONTENT (plants, produce, nature, playful accents)
//   • @expo/vector-icons → UI CHROME (nav, chevrons, settings, close)
//
// Bare emoji baselines jump around between glyphs; this keeps them centered in a
// fixed box so rows line up. Pass `bg` (a role color) for a tinted rounded chip.
export function Emoji({ glyph, size = 18, bg, box, style }) {
  if (!bg) {
    return (
      <Text allowFontScaling={false} style={[{ fontSize: size, lineHeight: size * 1.15, textAlign: "center" }, style]}>
        {glyph}
      </Text>
    );
  }
  const dim = box || size + 20;
  return (
    <View style={[{ width: dim, height: dim, borderRadius: dim * 0.3, backgroundColor: `${bg}1f`, alignItems: "center", justifyContent: "center" }, style]}>
      <Text allowFontScaling={false} style={{ fontSize: size, lineHeight: size * 1.15 }}>{glyph}</Text>
    </View>
  );
}

export default Emoji;
