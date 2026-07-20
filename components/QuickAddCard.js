import { memo, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";

export const QuickAddCard = memo(function QuickAddCard({ theme, savedPlants, onSavePlant, onOpenPlant }) {
  const [query, setQuery] = useState("");
  const owned = new Set((savedPlants || []).map((n) => n.toLowerCase()));

  const q = query.toLowerCase().trim();
  const matches = q.length >= 1
    ? produceData
        .filter((p) => p.name.toLowerCase().includes(q))
        .sort((a, b) => (a.name.toLowerCase().startsWith(q) ? -1 : 0) - (b.name.toLowerCase().startsWith(q) ? -1 : 0))
        .slice(0, 8)
    : [];

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Type a plant name to add it to your garden in a tap — no scrolling the full list.
      </Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search 179 plants…"
        placeholderTextColor="#8fbf9d"
        autoCorrect={false}
        style={{ marginTop: 14, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", color: theme.text, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, fontWeight: "700" }}
      />

      {matches.length ? (
        <View style={{ gap: 6, marginTop: 10 }}>
          {matches.map((p) => {
            const img = resolvePlantImageSource(p);
            const have = owned.has(p.name.toLowerCase());
            return (
              <View key={p.name} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 15 }}>🌱</Text>}
                </View>
                <Pressable style={{ flex: 1 }} onPress={() => onOpenPlant && onOpenPlant(p)}>
                  <Text style={{ color: theme.text, fontSize: 13.5, fontWeight: "800" }}>{p.name} ›</Text>
                </Pressable>
                {have ? (
                  <View style={{ backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
                    <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>✓ Saved</Text>
                  </View>
                ) : (
                  <Pressable onPress={() => onSavePlant && onSavePlant(p.name)} style={{ backgroundColor: "#5cff89", borderRadius: 999, paddingHorizontal: 13, paddingVertical: 6 }}>
                    <Text style={{ color: "#07120b", fontSize: 12.5, fontWeight: "900" }}>+ Add</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      ) : q.length >= 1 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 12.5, fontWeight: "600", fontStyle: "italic", textAlign: "center", paddingVertical: 14 }}>
          No plants match "{query}".
        </Text>
      ) : null}
    </View>
  );
})
