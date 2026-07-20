import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking, Pressable, Text, TextInput, View } from "react-native";
import { tapHaptic } from "../core";

const STORAGE_KEY = "pp_seedInventory";

const CATEGORIES = [
  { id: "seeds", label: "🌱 Seeds", color: "#8effab" },
  { id: "soil", label: "🪴 Soil", color: "#bf7a12" },
  { id: "fertilizer", label: "🌾 Fertilizer", color: "#ffd86b" },
  { id: "tools", label: "🧰 Tools", color: "#6bc7ff" },
  { id: "other", label: "📦 Other", color: "#d8c8ff" },
];
const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[4];

export const SeedInventoryCard = memo(function SeedInventoryCard({ theme }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftCat, setDraftCat] = useState("seeds");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) { try { setItems(JSON.parse(val) || []); } catch (e) { /* ignore */ } }
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => {
    setItems(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const addItem = () => {
    const name = draft.trim();
    if (!name) return;
    tapHaptic("light");
    persist([{ id: Date.now().toString(), name, category: draftCat }, ...items]);
    setDraft("");
  };

  const removeItem = (id) => {
    tapHaptic("light");
    persist(items.filter((i) => i.id !== id));
  };

  const toggleLow = (id) => {
    tapHaptic("light");
    persist(items.map((i) => (i.id === id ? { ...i, low: !i.low } : i)));
  };

  const shopFor = (name) => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent((name || "garden seeds") + " garden")}`);

  if (!loaded) return null;

  const lowItems = items.filter((i) => i.low);

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Track the seeds and supplies you already own so you never double-buy. Tap the flag to mark anything running low. {items.length} item{items.length === 1 ? "" : "s"} on hand.
      </Text>

      {lowItems.length ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, backgroundColor: "rgba(255,159,67,0.10)", borderRadius: 12, padding: 11, borderWidth: 1, borderColor: "rgba(255,159,67,0.30)" }}>
          <Text style={{ fontSize: 15 }}>⚠️</Text>
          <Text style={{ flex: 1, color: "#ffb37b", fontSize: 12.5, fontWeight: "800" }}>
            {lowItems.length} item{lowItems.length === 1 ? "" : "s"} running low — reorder before planting season.
          </Text>
        </View>
      ) : null}

      {/* ADD ROW */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={addItem}
          placeholder="Add an item you own…"
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "700" }}
        />
        <Pressable onPress={addItem} style={{ backgroundColor: "#5cff89", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>

      {/* CATEGORY PICKER */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {CATEGORIES.map((c) => {
          const active = draftCat === c.id;
          return (
            <Pressable key={c.id} onPress={() => setDraftCat(c.id)} style={{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: active ? c.color + "22" : "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: active ? c.color : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? c.color : theme.secondaryText, fontSize: 11.5, fontWeight: "800" }}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* LIST */}
      {items.length === 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 12.5, fontWeight: "600", fontStyle: "italic", textAlign: "center", paddingVertical: 18 }}>
          Nothing added yet — add seed packets, compost, fertilizer, or tools you have.
        </Text>
      ) : (
        <View style={{ gap: 6, marginTop: 12 }}>
          {items.map((item) => {
            const c = catOf(item.category);
            return (
              <View key={item.id} style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: item.low ? "rgba(255,159,67,0.08)" : "rgba(255,255,255,0.04)", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: item.low ? "rgba(255,159,67,0.28)" : "rgba(255,255,255,0.08)" }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.color }} />
                <Text numberOfLines={1} style={{ flex: 1, color: theme.text, fontSize: 13.5, fontWeight: "800" }}>{item.name}</Text>
                {item.low ? (
                  <Pressable onPress={() => shopFor(item.name)} hitSlop={6} style={{ backgroundColor: "rgba(255,159,67,0.16)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(255,159,67,0.35)" }}>
                    <Text style={{ color: "#ffb37b", fontSize: 10.5, fontWeight: "900" }}>🛒 Reorder</Text>
                  </Pressable>
                ) : (
                  <Text style={{ color: c.color, fontSize: 10.5, fontWeight: "900" }}>{c.label}</Text>
                )}
                <Pressable onPress={() => toggleLow(item.id)} hitSlop={8} accessibilityRole="button" accessibilityLabel={item.low ? "Mark as stocked" : "Mark as running low"} style={{ paddingHorizontal: 4 }}>
                  <Text style={{ fontSize: 14, opacity: item.low ? 1 : 0.4 }}>🚩</Text>
                </Pressable>
                <Pressable onPress={() => removeItem(item.id)} hitSlop={8} style={{ paddingHorizontal: 2 }}>
                  <Text style={{ color: theme.secondaryText, fontSize: 15, fontWeight: "900" }}>✕</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      <Pressable
        onPress={() => Linking.openURL("https://www.amazon.com/s?k=vegetable+garden+seeds")}
        style={{ marginTop: 12, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 12, paddingVertical: 11, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}
      >
        <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900" }}>🛒 Shop for more seeds & supplies</Text>
      </Pressable>
    </View>
  );
})
