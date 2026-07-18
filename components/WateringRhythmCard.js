import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getWateringRhythm, resolvePlantImageSource } from "../core";

export function WateringRhythmCard({ theme, savedPlants, wateringHistory, onOpenPlant }) {
  const rows = (savedPlants || [])
    .map((name) => {
      const item = produceData.find((p) => p.name === name);
      if (!item) return null;
      const rhythm = getWateringRhythm(name, item, wateringHistory);
      return rhythm ? { name, item, rhythm } : null;
    })
    .filter(Boolean)
    // Show the biggest mismatches first so the useful stuff is on top.
    .sort((a, b) => Math.abs(b.rhythm.diff) - Math.abs(a.rhythm.diff));

  if (!rows.length) return null;

  const STATUS = {
    "on-track": { color: "#5cff89", icon: "✅", label: "On track" },
    under: { color: "#ffd86b", icon: "🌵", label: "Watering less than ideal" },
    over: { color: "#6bc7ff", icon: "💧", label: "Watering more than ideal" },
  };

return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map(({ name, item, rhythm }) => {
          const s = STATUS[rhythm.status];
          const img = resolvePlantImageSource(item);
          const detail =
            rhythm.status === "on-track"
              ? `Every ~${rhythm.avgGap}d · right on its ${rhythm.target}-day target`
              : rhythm.status === "under"
              ? `Every ~${rhythm.avgGap}d · target is ~${rhythm.target}d — try watering a bit sooner`
              : `Every ~${rhythm.avgGap}d · target is ~${rhythm.target}d — you can space it out more`;
          return (
            <Pressable
              key={`rhythm-${name}`}
              onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: `${s.color}30` }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{name}</Text>
                  <Text style={{ color: s.color, fontSize: 11, fontWeight: "900" }}>{s.icon} {s.label}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{detail}</Text>
              </View>
              <Text style={{ color: s.color, fontSize: 18, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Needs at least 3 logged waterings per plant to show a pattern.
      </Text>
    </View>
  );
}
