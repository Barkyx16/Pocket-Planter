import { memo, useState } from "react";
import { Pressable, Text, View } from "react-native";

// Shared accent palettes so every collapsible "show/hide" button in the app
// looks identical. Add a new key here to introduce another accent everywhere.
const ACCENTS = {
  green: { solid: "#5cff89", soft: "rgba(92, 255, 137, 0.1)", text: "#8effab", border: "rgba(92, 255, 137, 0.24)" },
  blue: { solid: "#6bc7ff", soft: "rgba(107, 199, 255, 0.1)", text: "#6bc7ff", border: "rgba(107, 199, 255, 0.24)" },
  yellow: { solid: "#ffd86b", soft: "rgba(255, 216, 107, 0.12)", text: "#ffd86b", border: "rgba(255, 216, 107, 0.24)" },
};

// A self-contained expand/collapse button + revealed content.
// Keeps its own open state — parents just pass a label and children.
export const ToggleSection = memo(function ToggleSection({ label, closeLabel, accent = "green", marginTop = 14, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const c = ACCENTS[accent] || ACCENTS.green;
  const closedText = label;
  const openText = closeLabel || `✕ Close ${label}`;

  return (
    <>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={open ? openText : closedText}
        style={{ marginTop, backgroundColor: open ? c.soft : c.solid, borderRadius: 12, paddingVertical: 14, alignItems: "center", borderWidth: open ? 1 : 0, borderColor: c.border }}
      >
        <Text style={{ color: open ? c.text : "#07120b", fontSize: 14, fontWeight: "900" }}>
          {open ? openText : closedText}
        </Text>
      </Pressable>
      {open ? <View style={{ marginTop: 14 }}>{children}</View> : null}
    </>
  );
});
