import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking, Pressable, Text, View } from "react-native";
import { tapHaptic } from "../core";

const STORAGE_KEY = "pp_toolkit_owned";

// A curated starter kit — the things you actually reach for to get a garden going.
const TOOLKIT = [
  {
    cat: "Digging & Planting",
    color: "#8effab",
    items: [
      { icon: "🧤", name: "Garden Gloves", why: "Hand protection", q: "garden gloves" },
      { icon: "🌱", name: "Hand Trowel", why: "Dig & transplant", q: "garden hand trowel" },
      { icon: "🪏", name: "Shovel / Spade", why: "Turn & move soil", q: "garden shovel spade" },
      { icon: "🍴", name: "Hand Cultivator", why: "Loosen soil, pull weeds", q: "hand cultivator garden tool" },
    ],
  },
  {
    cat: "Watering",
    color: "#6bc7ff",
    items: [
      { icon: "💧", name: "Garden Hose", why: "Reach every bed", q: "expandable garden hose" },
      { icon: "🔫", name: "Spray Nozzle", why: "Gentle shower setting", q: "garden hose spray nozzle wand" },
      { icon: "🚿", name: "Watering Can", why: "For pots & starts", q: "watering can" },
    ],
  },
  {
    cat: "Care & Harvest",
    color: "#ffd86b",
    items: [
      { icon: "✂️", name: "Pruning Shears", why: "Prune & harvest", q: "pruning shears bypass" },
      { icon: "🪵", name: "Garden Rake", why: "Level & clear debris", q: "garden bow rake" },
      { icon: "🧺", name: "Harvest Basket", why: "Carry your produce", q: "garden harvest basket trug" },
      { icon: "🏷️", name: "Plant Labels", why: "Track what's planted", q: "plant labels markers garden" },
    ],
  },
  {
    cat: "Comfort & Protection",
    color: "#ff9f43",
    items: [
      { icon: "🪨", name: "Kneeling Pad", why: "Save your knees", q: "garden kneeling pad" },
      { icon: "🌡️", name: "Moisture Meter", why: "Know when to water", q: "soil moisture meter" },
      { icon: "🕸️", name: "Row Cover", why: "Pest & frost shield", q: "garden row cover netting" },
    ],
  },
];

const ALL_ITEMS = TOOLKIT.flatMap((g) => g.items);
const TOTAL = ALL_ITEMS.length;

export const GardenToolkitCard = memo(function GardenToolkitCard({ theme, onCompletionChange }) {
  const [owned, setOwned] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [showOwned, setShowOwned] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) {
        try { setOwned(JSON.parse(val) || {}); } catch (e) { /* ignore bad data */ }
      }
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  function persist(next) {
    setOwned(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }

  function markOwned(name) {
    tapHaptic("light");
    persist({ ...owned, [name]: true });
  }

  function unmark(name) {
    tapHaptic("light");
    const next = { ...owned };
    delete next[name];
    persist(next);
  }

  const shop = (q) => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(q)}`);

  const ownedCount = ALL_ITEMS.filter((i) => owned[i.name]).length;
  const remaining = TOTAL - ownedCount;
  const pct = Math.round((ownedCount / TOTAL) * 100);
  const complete = remaining === 0;

  useEffect(() => {
    if (loaded && onCompletionChange) onCompletionChange(complete);
  }, [loaded, complete, onCompletionChange]);

  if (!loaded) return null;

  return (
    <View>
      {/* ── PROGRESS HEADER ── */}
      <View style={{ backgroundColor: "rgba(92,255,137,0.07)", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>
            {complete ? "🎉 Fully equipped!" : `🧰 ${remaining} tool${remaining === 1 ? "" : "s"} to grab`}
          </Text>
          <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900" }}>{ownedCount}/{TOTAL}</Text>
        </View>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <View style={{ height: 6, borderRadius: 3, width: `${pct}%`, backgroundColor: "#5cff89" }} />
        </View>
      </View>

      {/* ── TOOL LIST (unowned only) ── */}
      {TOOLKIT.map((group) => {
        const items = group.items.filter((i) => !owned[i.name]);
        if (!items.length) return null;
        return (
          <View key={group.cat} style={{ marginTop: 14 }}>
            <Text style={{ color: group.color, fontSize: 11, fontWeight: "900", letterSpacing: 0.8, marginBottom: 8, marginLeft: 2 }}>
              {group.cat.toUpperCase()}
            </Text>
            <View style={{ gap: 7 }}>
              {items.map((item) => (
                <View key={item.name} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                  <Pressable
                    onPress={() => markOwned(item.name)}
                    accessibilityRole="checkbox"
                    accessibilityLabel={`Mark ${item.name} as owned`}
                    hitSlop={8}
                    style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "rgba(92,255,137,0.5)" }}
                  />
                  <Text style={{ flex: 1, color: theme.text, fontSize: 13.5, fontWeight: "800" }} numberOfLines={1}>
                    {item.icon}  {item.name}
                  </Text>
                  <Pressable
                    onPress={() => shop(item.q)}
                    accessibilityRole="button"
                    accessibilityLabel={`Shop for ${item.name}`}
                    style={{ backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 10, paddingVertical: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}
                  >
                    <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>Shop ›</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {/* ── OWNED (collapsible) ── */}
      {ownedCount > 0 ? (
        <View style={{ marginTop: 14 }}>
          <Pressable onPress={() => setShowOwned((v) => !v)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 8 }}>
            <Text style={{ color: theme.secondaryText, fontSize: 12.5, fontWeight: "800" }}>
              {showOwned ? "▾" : "▸"} ✓ {ownedCount} item{ownedCount === 1 ? "" : "s"} you already have
            </Text>
          </Pressable>
          {showOwned ? (
            <View style={{ gap: 6, marginTop: 2 }}>
              {ALL_ITEMS.filter((i) => owned[i.name]).map((item) => (
                <View key={item.name} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 10, paddingVertical: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}>
                  <Pressable
                    onPress={() => unmark(item.name)}
                    accessibilityRole="checkbox"
                    accessibilityLabel={`Remove ${item.name} from owned`}
                    hitSlop={8}
                    style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#5cff89", alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>✓</Text>
                  </Pressable>
                  <Text style={{ flex: 1, color: theme.secondaryText, fontSize: 13, fontWeight: "700", textDecorationLine: "line-through" }}>
                    {item.icon}  {item.name}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
})
