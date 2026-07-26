import { memo, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource, tapHaptic } from "../core";
import { FLOWER_COLORS, PALETTES } from "../data/flowerHomeData";

const findItem = (name) => produceData.find((p) => p.name === name);

export const BloomPaletteSection = memo(function BloomPaletteSection({ theme, savedPlants, onOpenPlant }) {
  const [pal, setPal] = useState("pastel");
  const owned = useMemo(() => new Set((savedPlants || []).map((n) => String(n).toLowerCase())), [savedPlants]);

  const palette = PALETTES.find((p) => p.id === pal) || PALETTES[0];
  const matches = useMemo(() => {
    const wanted = new Set(palette.colors);
    return Object.entries(FLOWER_COLORS)
      .filter(([, colors]) => colors.some((c) => wanted.has(c)))
      .map(([name]) => name)
      .sort((a, b) => (owned.has(b.toLowerCase()) ? 1 : 0) - (owned.has(a.toLowerCase()) ? 1 : 0) || a.localeCompare(b));
  }, [palette, owned]);

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Pick a color scheme and design a coordinated flower bed or bouquet.
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
        {PALETTES.map((p) => {
          const active = pal === p.id;
          return (
            <Pressable key={p.id} onPress={() => { tapHaptic("light"); setPal(p.id); }} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: active ? "#ffb6c1" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#ffb6c1" : "rgba(255,255,255,0.12)" }}>
              <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView style={{ maxHeight: 260, marginTop: 12 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {matches.map((name) => {
            const item = findItem(name);
            const img = item ? resolvePlantImageSource(item) : null;
            const have = owned.has(name.toLowerCase());
            return (
              <Pressable
                key={name}
                onPress={() => item && onOpenPlant && onOpenPlant(item)}
                style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: have ? "rgba(255,182,193,0.16)" : "rgba(255,255,255,0.05)", borderRadius: 999, paddingLeft: img ? 5 : 11, paddingRight: 12, paddingVertical: 5, borderWidth: 1, borderColor: have ? "rgba(255,182,193,0.4)" : "rgba(255,255,255,0.1)" }}
              >
                {img ? (
                  <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <Image source={img} style={{ width: 20, height: 20 }} resizeMode="contain" />
                  </View>
                ) : null}
                <Text style={{ color: have ? "#ffb6c1" : "#d7ebdc", fontSize: 12, fontWeight: "800" }}>{have ? "✓ " : ""}{name}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
});
