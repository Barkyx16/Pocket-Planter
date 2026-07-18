import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export function CollapsibleCard({ theme, storageKey, title, eyebrow, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
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
    const next = !open;
    setOpen(next);
    AsyncStorage.setItem(`pp_collapse_${storageKey}`, next ? "1" : "0").catch(() => {});
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Pressable onPress={toggle} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          {eyebrow ? <Text style={styles.cardEyebrow}>{eyebrow}</Text> : null}
          <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
        </View>
        <Text style={{ color: "#5cff89", fontSize: 22, fontWeight: "900", marginLeft: 12 }}>{open ? "▾" : "▸"}</Text>
      </Pressable>
      {open ? <View style={{ marginTop: 14 }}>{children}</View> : null}
    </View>
  );
}
