import { useEffect, useState } from "react";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "pp_seenTabHeroes";

// In-memory record of which tab hero images have already been shown once. Seeded
// from AsyncStorage during the app's loading gate so each tab can decide
// synchronously at mount — no flash of an image that should stay hidden.
export const seenTabHeroes = new Set();
let hydrated = false;

export async function hydrateTabHeroes() {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) (JSON.parse(raw) || []).forEach((k) => seenTabHeroes.add(k));
  } catch (e) {
    /* ignore bad data */
  }
  hydrated = true;
}

// Renders a tab's hero image only the first time that tab is ever viewed.
// After the first view it's marked seen and never rendered again.
export function TabHero({ tabKey, source, style }) {
  // Decide once, at mount, from the seen set — stays stable for this view.
  const [show] = useState(() => !seenTabHeroes.has(tabKey));

  useEffect(() => {
    if (show && !seenTabHeroes.has(tabKey)) {
      seenTabHeroes.add(tabKey);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...seenTabHeroes])).catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show) return null;
  return <Image source={source} style={style} resizeMode="cover" />;
}
