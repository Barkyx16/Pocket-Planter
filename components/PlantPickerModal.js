import { useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { normalizeType, resolvePlantImageSource } from "../core";

// A searchable, category-filtered plant picker for a garden-bed slot. Replaces the
// old native Alert list: it scrolls (no hidden cap), shows thumbnails, and lets the
// user filter by category — e.g. tap "Herbs" to find just the herbs for a herb bed —
// while still allowing any valid saved plant so cross-category companions keep working.
export function PlantPickerModal({ theme, visible, bedName, plants = [], currentPlant, onPick, onClear, onClose }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const items = useMemo(
    () => plants.map((n) => produceData.find((p) => p.name === n)).filter(Boolean),
    [plants]
  );
  // Category chips: "All" plus every category actually present in this bed's options.
  const categories = useMemo(() => {
    const set = new Set(items.map((p) => normalizeType(p.type, p.name)));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      if (category !== "All" && normalizeType(p.type, p.name) !== category) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, search, category]);

  function reset() { setSearch(""); setCategory("All"); }
  function close() { reset(); onClose && onClose(); }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <Pressable onPress={close} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
        <Pressable onPress={(e) => e.stopPropagation?.()} style={{ backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 16, paddingBottom: 30, maxHeight: "82%" }}>
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 18, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900" }}>Add a plant</Text>
              {bedName ? <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>to {bedName}</Text> : null}
            </View>
            <Pressable onPress={close} hitSlop={12} style={{ padding: 4 }}>
              <Text style={{ color: theme.secondaryText, fontSize: 20, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>

          {/* Search */}
          <View style={{ marginHorizontal: 18, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: theme.border }}>
            <Text style={{ fontSize: 14 }}>🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search your saved plants"
              placeholderTextColor={theme.secondaryText}
              style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: "700", paddingVertical: 11 }}
            />
            {search ? (
              <Pressable onPress={() => setSearch("")} hitSlop={8}><Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>✕</Text></Pressable>
            ) : null}
          </View>

          {/* Category chips */}
          {categories.length > 2 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 18, paddingBottom: 12 }}>
              {categories.map((c) => {
                const active = category === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: active ? "#5cff89" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.12)" }}
                  >
                    <Text style={{ color: active ? "#07120b" : theme.text, fontSize: 12, fontWeight: "900" }}>{c}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}

          {/* Plant list */}
          <ScrollView style={{ paddingHorizontal: 18 }} keyboardShouldPersistTaps="handled">
            {filtered.length === 0 ? (
              <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", textAlign: "center", paddingVertical: 30 }}>
                No matching saved plants. Save more plants, then place them here.
              </Text>
            ) : filtered.map((p) => {
              const img = resolvePlantImageSource(p);
              const isCurrent = currentPlant && p.name === currentPlant;
              return (
                <Pressable
                  key={p.name}
                  onPress={() => { reset(); onPick && onPick(p.name); }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 15, fontWeight: "800" }}>{p.name}</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 1 }}>{normalizeType(p.type, p.name)}</Text>
                  </View>
                  {isCurrent ? <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>In this plot</Text> : <Text style={{ color: "#5cff89", fontSize: 20, fontWeight: "900" }}>＋</Text>}
                </Pressable>
              );
            })}
          </ScrollView>

          {currentPlant ? (
            <Pressable onPress={() => { reset(); onClear && onClear(); }} style={{ marginHorizontal: 18, marginTop: 12, backgroundColor: "rgba(255,123,123,0.12)", borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,123,123,0.3)" }}>
              <Text style={{ color: "#ff9f9f", fontSize: 13, fontWeight: "900" }}>Clear this plot</Text>
            </Pressable>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
