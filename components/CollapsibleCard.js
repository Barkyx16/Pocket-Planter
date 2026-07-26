import { memo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../styles";
import { splitLeadingIcon } from "../lib/icons";

// Enable smooth layout animations on Android.
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const CollapsibleCard = memo(function CollapsibleCard({ theme, storageKey, title, eyebrow, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  // Titles still carry a leading emoji ("🌿 Companion Check"); render it as a
  // tinted Ionicons glyph so every card header uses one icon language.
  const { icon, text: titleText } = splitLeadingIcon(title);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(`pp_collapse_${storageKey}`).then((val) => {
      if (alive && val !== null) setOpen(val === "1");
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, [storageKey]);

  function toggle() {
    // Smoothly animate the expand/collapse instead of an instant snap.
    LayoutAnimation.configureNext(LayoutAnimation.create(200, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity));
    const next = !open;
    setOpen(next);
    AsyncStorage.setItem(`pp_collapse_${storageKey}`, next ? "1" : "0").catch(() => {});
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Pressable
        onPress={toggle}
        style={({ pressed }) => [{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, pressed && { opacity: 0.6 }]}
      >
        {icon ? (
          <View
            style={{
              width: 30, height: 30, borderRadius: 8, marginRight: 10,
              alignItems: "center", justifyContent: "center",
              backgroundColor: "rgba(92, 255, 137, 0.12)",
            }}
          >
            <Ionicons name={icon} size={17} color="#5cff89" />
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          {eyebrow ? <Text style={styles.cardEyebrow}>{eyebrow}</Text> : null}
          <Text style={[styles.cardTitle, { color: theme.text }]}>{titleText}</Text>
        </View>
        <Ionicons
          name={open ? "chevron-down" : "chevron-forward"}
          size={18}
          color="#5cff89"
          style={{ marginLeft: 12 }}
        />
      </Pressable>
      {open ? <View style={{ marginTop: 14 }}>{children}</View> : null}
    </View>
  );
})
