import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { RESCUE_THRESHOLD_DAYS, getDaysSince, resolvePlantImageSource } from "../core";

export function RescueModeCard({ theme, savedPlants, wateredPlants, wateringHistory, onOpenPlant, onWater }) {
  const neglected = (savedPlants || [])
    .map((name) => {
      const history = wateringHistory?.[name];
      const lastDate = Array.isArray(history) && history.length
        ? history[history.length - 1]
        : wateredPlants?.[name];
      const days = getDaysSince(lastDate);
      return { name, days, everWatered: !!lastDate };
    })
    .filter((e) => e.everWatered && e.days !== null && e.days >= RESCUE_THRESHOLD_DAYS)
    .sort((a, b) => b.days - a.days);

  if (!neglected.length) return null;

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(255,159,67,0.10)", borderColor: "#ff9f43" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>🚨</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>RESCUE MODE</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {neglected.length} plant{neglected.length === 1 ? "" : "s"} need{neglected.length === 1 ? "s" : ""} attention
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        These haven't been watered in a while. A deep watering and a soil check can bring most plants back.
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {neglected.map((p) => {
          const plant = produceData.find((item) => item.name === p.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          return (
            <View
              key={`rescue-${p.name}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(255,159,67,0.25)" }}
            >
              <Pressable onPress={() => plant && onOpenPlant(plant)} style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{p.name}</Text>
                  <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                    ⏳ {p.days} days since watering
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => onWater(p.name)}
                accessibilityRole="button"
                accessibilityLabel={`Water ${p.name} now`}
                style={{ backgroundColor: "#6bc7ff", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11 }}
              >
                <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>💧 Rescue</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
