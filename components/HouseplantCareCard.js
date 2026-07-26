import { memo, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { normalizeType, resolvePlantImageSource, tapHaptic } from "../core";
import { AIR_PURIFYING, HOUSEPLANT_PESTS } from "../data/flowerHomeData";

// light: 1 low-light tolerant · 2 bright indirect · 3 bright/direct
// [light, waterDays, humidity, repotYears, note]
const CARE = {
  "Snake Plant": [1, 21, "Low", 4, "Nearly indestructible — let the soil dry out completely."],
  "ZZ Plant": [1, 21, "Low", 3, "Thrives on neglect; its rhizomes store water."],
  Pothos: [1, 10, "Average", 2, "Trails happily; pinch it back to stay bushy."],
  "Chinese Evergreen": [1, 10, "Average", 2, "Tolerant of low light and easy to keep."],
  Monstera: [2, 9, "Average", 2, "Give it a moss pole and bright, indirect light."],
  "Spider Plant": [2, 8, "Average", 2, "Pot up the little pups as brand-new plants."],
  Philodendron: [2, 9, "Average", 2, "Fast, forgiving trailer for bright indirect light."],
  Dieffenbachia: [2, 8, "Average", 2, "Keep out of reach — the sap irritates."],
  Calathea: [2, 7, "High", 1, "Loves humidity; use filtered or rain water."],
  "Prayer Plant": [2, 7, "High", 1, "Leaves fold up at night — humidity keeps them happy."],
  "Areca Palm": [2, 8, "High", 2, "Bright indirect light and evenly moist soil."],
  "Parlor Palm": [1, 9, "Average", 3, "Handles low light better than most palms."],
  "Kentia Palm": [2, 10, "Average", 3, "Slow, elegant, and forgiving."],
  "Boston Fern": [2, 5, "High", 2, "Keep it moist and mist often — it hates drying out."],
  "Maidenhair Fern": [2, 4, "High", 1, "Never let it dry; a humid bathroom is ideal."],
  "Bird's Nest Fern": [1, 6, "High", 2, "Water the soil, not the crown, to avoid rot."],
  Fern: [2, 5, "High", 2, "Keep evenly moist and give it humidity."],
  "Fiddle Leaf Fig": [3, 9, "Average", 2, "Hates being moved — pick a bright spot and leave it."],
  Alocasia: [3, 8, "High", 1, "Bright indirect light and high humidity."],
  "Elephant Ear": [3, 8, "High", 1, "Big drinker in the growing season; rests in winter."],
  "Bird of Paradise": [3, 9, "Average", 2, "Wants the brightest spot you have to bloom."],
  Yucca: [3, 14, "Low", 3, "Bright light and infrequent water — very drought-tough."],
  Coleus: [3, 7, "Average", 1, "Pinch the tips to keep the colorful foliage full."],
  "Aloe Vera": [3, 21, "Low", 3, "A succulent — bright light, water only when bone dry."],
  "Jade Plant": [3, 21, "Low", 3, "Bright light and a deep-but-rare drink."],
  Echeveria: [3, 21, "Low", 3, "Full sun rosette; water at the base, never the leaves."],
  "Hens and Chicks": [3, 21, "Low", 3, "Tough succulent — bright light, minimal water."],
  "Burro's Tail": [3, 18, "Low", 3, "Handle gently; the beaded leaves drop easily."],
  "String of Pearls": [3, 14, "Low", 2, "Bright light; let it dry between sparse drinks."],
  "Christmas Cactus": [2, 12, "Average", 3, "Cool nights and short days trigger the winter blooms."],
  Agave: [3, 24, "Low", 4, "Full sun, sharp drainage, and very little water."],
};
const DEFAULT_CARE = [2, 9, "Average", 2, "Bright, indirect light; water when the top inch is dry."];

const LIGHT_LABEL = { 1: "Low light", 2: "Bright indirect", 3: "Bright / direct" };
const LEVELS = [{ v: 1, label: "Low" }, { v: 2, label: "Medium" }, { v: 3, label: "Bright" }];

export const HouseplantCareCard = memo(function HouseplantCareCard({ theme, savedPlants, onOpenPlant }) {
  const houseplants = useMemo(() => {
    return (savedPlants || [])
      .map((name) => produceData.find((p) => p.name === name))
      .filter((p) => p && normalizeType(p.type, p.name) === "Houseplants");
  }, [savedPlants]);

  const [room, setRoom] = useState(2);
  const [showPests, setShowPests] = useState(false);
  const care = (name) => CARE[name] || DEFAULT_CARE;

  // Catalog suggestions for the chosen room light (plants that thrive at ≤ room level).
  const suggestions = useMemo(() => {
    const owned = new Set(houseplants.map((h) => h.name));
    return Object.entries(CARE)
      .filter(([name, c]) => c[0] <= room && !owned.has(name))
      .slice(0, 6)
      .map(([name]) => name);
  }, [room, houseplants]);

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Light, water and repotting at a glance for your indoor plants.
      </Text>

      {/* Light matcher */}
      <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginTop: 14, marginBottom: 8 }}>💡 MATCH A ROOM'S LIGHT</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {LEVELS.map((l) => {
          const active = room === l.v;
          return (
            <Pressable key={l.v} onPress={() => { tapHaptic("light"); setRoom(l.v); }} style={{ flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 10, backgroundColor: active ? "#8effab" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#8effab" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{l.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 8 }}>
        Thrives in {LEVELS.find((l) => l.v === room).label.toLowerCase()} light: <Text style={{ color: "#8effab", fontWeight: "900" }}>{suggestions.join(", ") || "—"}</Text>
      </Text>

      {/* Owned houseplant care */}
      {houseplants.length ? (
        <View style={{ gap: 8, marginTop: 16 }}>
          {houseplants.map((item) => {
            const [light, waterDays, humidity, repot, note] = care(item.name);
            const img = resolvePlantImageSource(item);
            return (
              <Pressable key={item.name} onPress={() => onOpenPlant && onOpenPlant(item)} style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🪴</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{item.name}</Text>
                      {AIR_PURIFYING.has(item.name) ? <Text style={{ color: "#8effab", fontSize: 9, fontWeight: "900" }}>🌿 AIR</Text> : null}
                    </View>
                    <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 2 }}>
                      💡 {LIGHT_LABEL[light]} · 💧 every ~{waterDays}d · 💦 {humidity}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 16, marginTop: 8 }}>{note} Repot every ~{repot} yr{repot === 1 ? "" : "s"}.</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", fontStyle: "italic", marginTop: 16 }}>
          Save some houseplants from the Plants tab to see their care here.
        </Text>
      )}

      {/* Common houseplant pests — quick reference */}
      <Pressable onPress={() => setShowPests((v) => !v)} style={{ marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 8 }}>
        <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900" }}>{showPests ? "▾" : "▸"} 🫧 Common houseplant pests</Text>
      </Pressable>
      {showPests ? (
        <View style={{ gap: 6 }}>
          {HOUSEPLANT_PESTS.map((p) => (
            <View key={p.name} style={{ backgroundColor: "rgba(255,159,67,0.08)", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "rgba(255,159,67,0.24)" }}>
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: "900" }}>{p.icon} {p.name}</Text>
              <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", lineHeight: 15, marginTop: 2 }}>{p.sign}</Text>
              <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "800", lineHeight: 15, marginTop: 2 }}>Fix: {p.fix}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
});
