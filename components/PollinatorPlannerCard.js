import { memo } from "react";
import { Text, View } from "react-native";

const POLLINATOR_PLANTS = [
  { name: "Marigold", icon: "🌼", attracts: "Bees, hoverflies", note: "Also repels aphids & nematodes — great veggie companion." },
  { name: "Lavender", icon: "💜", attracts: "Bees, butterflies", note: "Drought-tough perennial that blooms for months." },
  { name: "Borage", icon: "💙", attracts: "Bees", note: "A bee magnet that also improves tomato & strawberry growth." },
  { name: "Sunflower", icon: "🌻", attracts: "Bees, birds", note: "Pollen powerhouse; seeds feed birds in fall." },
  { name: "Zinnia", icon: "🌸", attracts: "Butterflies, bees", note: "Easy, colorful, and blooms all summer." },
  { name: "Bee Balm", icon: "🌺", attracts: "Bees, hummingbirds", note: "Native perennial loved by pollinators of all kinds." },
  { name: "Cosmos", icon: "🌷", attracts: "Bees, lacewings", note: "Airy blooms that draw pest-eating beneficials too." },
  { name: "Calendula", icon: "🧡", attracts: "Hoverflies, bees", note: "Hoverfly larvae devour aphids — a natural pest control." },
  { name: "Dill", icon: "🌿", attracts: "Lacewings, wasps", note: "Lets it flower to draw aphid-hunting beneficial insects." },
  { name: "Yarrow", icon: "🤍", attracts: "Ladybugs, lacewings", note: "Insectary plant that hosts a small army of pest predators." },
];

export const PollinatorPlannerCard = memo(function PollinatorPlannerCard({ theme, savedPlants }) {
  const owned = new Set((savedPlants || []).map((n) => String(n).toLowerCase()));
  const alreadyGrowing = POLLINATOR_PLANTS.filter((p) => owned.has(p.name.toLowerCase()));
  const toAdd = POLLINATOR_PLANTS.filter((p) => !owned.has(p.name.toLowerCase()));

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Pollinators mean better fruit set and fewer pests. Tuck a few of these near your veggies to bring in bees, butterflies, and beneficial insects.
      </Text>

      {alreadyGrowing.length ? (
        <View style={{ marginTop: 14, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 12, padding: 11, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}>
          <Text style={{ color: "#8effab", fontSize: 12.5, fontWeight: "800" }}>
            ✓ You're already growing {alreadyGrowing.map((p) => `${p.icon} ${p.name}`).join(", ")} — nice, your pollinators are covered!
          </Text>
        </View>
      ) : null}

      <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginTop: 16, marginBottom: 10 }}>🐝 GREAT ADDITIONS</Text>
      <View style={{ gap: 8 }}>
        {toAdd.map((p) => (
          <View key={p.name} style={{ flexDirection: "row", alignItems: "flex-start", gap: 11, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 11, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
            <Text style={{ fontSize: 22 }}>{p.icon}</Text>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{p.name}</Text>
                <Text style={{ color: "#ffd86b", fontSize: 10.5, fontWeight: "800" }}>{p.attracts}</Text>
              </View>
              <Text style={{ color: theme.secondaryText, fontSize: 11.5, fontWeight: "700", lineHeight: 16, marginTop: 2 }}>{p.note}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
})
