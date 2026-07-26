import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { splitLeadingIcon } from "../lib/icons";

/**
 * Renders a label whose source string starts with an emoji as a proper
 * icon + text row: `<IconText label="💧 Water bed" style={…} />`.
 *
 * Why a component rather than editing each string: the emoji lives inside the
 * label (often a translated one), so the icon choice has to be derived at render
 * time. This keeps the ~270 emoji-led labels working from a single mapping and
 * means a call site converts in one line.
 *
 * Falls back to a plain <Text> — emoji intact — when the label has no leading
 * emoji or the emoji has no icon equivalent, so nothing is ever silently lost.
 *
 * `style` applies to the text, matching what the original <Text> had. `size` and
 * `color` control the glyph; `color` defaults to the text colour so the icon
 * inherits the label's intent (danger red stays red, muted stays muted).
 */
export function IconText({ label, style, size = 15, color, gap = 6, iconStyle, numberOfLines }) {
  const { icon, text } = splitLeadingIcon(label);

  if (!icon) {
    return <Text style={style} numberOfLines={numberOfLines}>{label}</Text>;
  }

  // Inherit the label's colour unless the caller overrides it.
  const flat = Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style || {};
  const glyphColor = color || flat.color || "#5cff89";

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap }}>
      <Ionicons name={icon} size={size} color={glyphColor} style={iconStyle} />
      <Text style={style} numberOfLines={numberOfLines}>{text}</Text>
    </View>
  );
}

export default IconText;
