import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getWateringCount, resolvePlantImageSource } from "../core";

export const MostLovedPlantsCard = memo(function MostLovedPlantsCard({ theme, savedPlants, wateringHistory, onOpenPlant }) {
  const ranked = (savedPlants || [])
    .map((name) => ({ name, count: getWateringCount(name, wateringHistory) }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (ranked.length < 2) return null;

  const medal = (i) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`);

return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {ranked.map((entry, i) => {
          const plant = produceData.find((p) => p.name === entry.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          return (
            <Pressable
              key={entry.name}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(107,199,255,0.16)" }}
            >
              <Text style={{ fontSize: 18, fontWeight: "900", width: 32, textAlign: "center" }}>{medal(i)}</Text>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{entry.name}</Text>
                <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                  💧 Watered {entry.count} time{entry.count === 1 ? "" : "s"}
                </Text>
              </View>
              {plant ? <Text style={{ color: "#6bc7ff", fontSize: 20, fontWeight: "900" }}>›</Text> : null}
            </Pressable>
          );
        })}
     </View>
    </View>
  );
})
