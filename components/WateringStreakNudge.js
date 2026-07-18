import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getStreakDaysLeft, getWateringStreak, resolvePlantImageSource } from "../core";

export function WateringStreakNudge({ theme, savedPlants, wateringHistory, snoozedPlants, onOpenPlant, onWater }) {
  const tomorrowKey = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const atRisk = (savedPlants || [])
    .filter((name) => snoozedPlants?.[name] !== tomorrowKey)
    .map((name) => {
      const daysLeft = getStreakDaysLeft(name, wateringHistory);
      if (!daysLeft) return null;
      return { name, daysLeft, streak: getWateringStreak(name, wateringHistory) };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysLeft - b.daysLeft || b.streak - a.streak);

  if (!atRisk.length) return null;

  const urgentToday = atRisk.filter((p) => p.daysLeft === 1);
  const accent = urgentToday.length ? "#ff9f43" : "#ffd86b";
  const headline = urgentToday.length
    ? `Water ${urgentToday.length === 1 ? urgentToday[0].name : `${urgentToday.length} plants`} today to keep your streak`
    : `${atRisk.length} watering streak${atRisk.length === 1 ? "" : "s"} winding down`;

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: `${accent}12`, borderColor: accent }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>🔥</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: accent, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>DON'T BREAK YOUR STREAK</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>{headline}</Text>
        </View>
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        These plants have a watering streak going. Water them before the window closes to keep it alive.
      </Text>

      <View style={{ gap: 10, marginTop: 14 }}>
        {atRisk.map((p) => {
          const plant = produceData.find((item) => item.name === p.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          const critical = p.daysLeft === 1;
          return (
            <View
              key={p.name}
              style={{
                flexDirection: "row", alignItems: "center", gap: 12,
                backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12,
                borderWidth: 1, borderColor: critical ? "rgba(255,159,67,0.35)" : "rgba(255,255,255,0.08)",
              }}
            >
              <Pressable onPress={() => plant && onOpenPlant(plant)} style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{p.name}</Text>
                  <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900", marginTop: 2 }}>🔥 {p.streak}-day streak</Text>
                  <Text style={{ color: critical ? accent : theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 2 }}>
                    {critical ? "⏳ Last day to keep it!" : `⏳ ${p.daysLeft} days left`}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => onWater(p.name)}
                accessibilityRole="button"
                accessibilityLabel={`Water ${p.name} to keep its streak`}
                style={{ backgroundColor: "#6bc7ff", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11 }}
              >
                <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>💧 Water</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
