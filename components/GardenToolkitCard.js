import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking, Pressable, Text, View } from "react-native";
import { tapHaptic } from "../core";
import { useTranslation } from "../lib/i18n";
import { touchSlop } from "../lib/a11y";

const STORAGE_KEY = "pp_toolkit_owned";

// A curated starter kit — the things you actually reach for to get a garden going.
// `name` is the English storage key in pp_toolkit_owned and `q` the shop search
// query; both are data. Display text comes from toolkitText.<id> / <cat>.
// i18n-ignore
const TOOLKIT = [
  {
    cat: "catDigging",
    color: "#8effab",
    items: [
      { icon: "🧤", id: "gloves", name: "Garden Gloves", why: "Hand protection", q: "garden gloves" },
      { icon: "🌱", id: "trowel", name: "Hand Trowel", why: "Dig & transplant", q: "garden hand trowel" },
      { icon: "🪏", id: "shovel", name: "Shovel / Spade", why: "Turn & move soil", q: "garden shovel spade" },
      { icon: "🍴", id: "cultivator", name: "Hand Cultivator", why: "Loosen soil, pull weeds", q: "hand cultivator garden tool" },
    ],
  },
  {
    cat: "catWatering",
    color: "#6bc7ff",
    items: [
      { icon: "💧", id: "hose", name: "Garden Hose", why: "Reach every bed", q: "expandable garden hose" },
      { icon: "🔫", id: "nozzle", name: "Spray Nozzle", why: "Gentle shower setting", q: "garden hose spray nozzle wand" },
      { icon: "🚿", id: "wateringCan", name: "Watering Can", why: "For pots & starts", q: "watering can" },
    ],
  },
  {
    cat: "catCare",
    color: "#ffd86b",
    items: [
      { icon: "✂️", id: "shears", name: "Pruning Shears", why: "Prune & harvest", q: "pruning shears bypass" },
      { icon: "🪵", id: "rake", name: "Garden Rake", why: "Level & clear debris", q: "garden bow rake" },
      { icon: "🧺", id: "basket", name: "Harvest Basket", why: "Carry your produce", q: "garden harvest basket trug" },
      { icon: "🏷️", id: "labels", name: "Plant Labels", why: "Track what's planted", q: "plant labels markers garden" },
    ],
  },
  {
    cat: "catComfort",
    color: "#ff9f43",
    items: [
      { icon: "🪨", id: "kneelingPad", name: "Kneeling Pad", why: "Save your knees", q: "garden kneeling pad" },
      { icon: "🌡️", id: "moistureMeter", name: "Moisture Meter", why: "Know when to water", q: "soil moisture meter" },
      { icon: "🕸️", id: "rowCover", name: "Row Cover", why: "Pest & frost shield", q: "garden row cover netting" },
    ],
  },
];

const ALL_ITEMS = TOOLKIT.flatMap((g) => g.items);
const TOTAL = ALL_ITEMS.length;

export const GardenToolkitCard = memo(function GardenToolkitCard({ theme, onCompletionChange }) {
  const { t, tn } = useTranslation();
  const [owned, setOwned] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [showOwned, setShowOwned] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) {
        try { setOwned(JSON.parse(val) || {}); } catch { /* ignore bad data */ }
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
      <View style={{ backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>
            {complete ? t("gardenToolkit.fullyEquipped") : tn("toolkitText.toolsToGrab", remaining)}
          </Text>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>{ownedCount}/{TOTAL}</Text>
        </View>
        <View style={{ height: 6, borderRadius: 4, backgroundColor: "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
          <View style={{ height: 6, borderRadius: 4, width: `${pct}%`, backgroundColor: "#5cff89" }} />
        </View>
      </View>

      {/* ── TOOL LIST (unowned only) ── */}
      {TOOLKIT.map((group) => {
        const items = group.items.filter((i) => !owned[i.name]);
        if (!items.length) return null;
        return (
          <View key={group.cat} style={{ marginTop: 14 }}>
            <Text style={{ color: group.color, fontSize: 10, fontWeight: "900", letterSpacing: 0.8, marginBottom: 8, marginLeft: 2 }}>
              {t(`toolkitText.${group.cat}`).toUpperCase()}
            </Text>
            <View style={{ gap: 8 }}>
              {items.map((item) => (
                <View key={item.name} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
                  <Pressable
                    onPress={() => markOwned(item.name)}
                    accessibilityRole="checkbox"
                    accessibilityLabel={t("toolkitText.markOwned", { name: t(`toolkitText.${item.id}`) })}
                    hitSlop={touchSlop(24)}
                    style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "rgba(92, 255, 137, 0.5)" }}
                  />
                  <Text style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: "800" }} numberOfLines={1}>
                    {item.icon}  {t(`toolkitText.${item.id}`)}
                  </Text>
                  <Pressable
                    onPress={() => shop(item.q)}
                    accessibilityRole="button"
                    accessibilityLabel={t("toolkitText.shopFor", { name: t(`toolkitText.${item.id}`) })}
                    style={{ backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}
                  >
                    <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>{t("gardenToolkit.shop")}</Text>
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
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800" }}>
              {showOwned ? "▾" : "▸"} ✓ {tn("toolkitText.itemsYouHave", ownedCount)}
            </Text>
          </Pressable>
          {showOwned ? (
            <View style={{ gap: 6, marginTop: 2 }}>
              {ALL_ITEMS.filter((i) => owned[i.name]).map((item) => (
                <View key={item.name} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.06)" }}>
                  <Pressable
                    onPress={() => unmark(item.name)}
                    accessibilityRole="checkbox"
                    accessibilityLabel={t("toolkitText.removeOwned", { name: t(`toolkitText.${item.id}`) })}
                    hitSlop={touchSlop(24)}
                    style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#5cff89", alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ color: "#07120b", fontSize: 12, fontWeight: "900" }}>✓</Text>
                  </Pressable>
                  <Text style={{ flex: 1, color: theme.secondaryText, fontSize: 12, fontWeight: "700", textDecorationLine: "line-through" }}>
                    {item.icon}  {t(`toolkitText.${item.id}`)}
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
