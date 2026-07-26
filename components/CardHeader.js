import { Text, View } from "react-native";
import { font } from "../theme";
import { Emoji } from "./Emoji";

// Standard section/card header: a colored eyebrow (with optional emoji), an
// optional title and subtitle, and an optional right-aligned action node. Cards
// were each hand-rolling this, so spacing and weights drifted; this makes them
// converge without changing what they say.
export function CardHeader({ emoji, eyebrow, title, subtitle, color = "#8effab", action, theme, style }) {
  return (
    <View style={[{ marginBottom: subtitle || title ? 8 : 6 }, style]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7, flex: 1 }}>
          {emoji ? <Emoji glyph={emoji} size={14} /> : null}
          {eyebrow ? <Text style={[font.eyebrow, { color }]} numberOfLines={1}>{eyebrow}</Text> : null}
        </View>
        {action || null}
      </View>
      {title ? (
        <Text style={[font.heading, { color: theme?.text || "#ffffff", marginTop: eyebrow ? 4 : 0 }]}>{title}</Text>
      ) : null}
      {subtitle ? (
        <Text style={[font.body, { color: theme?.secondaryText || "#8fbf9d", marginTop: 3 }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

export default CardHeader;
