import { memo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getBaseWaterInterval, getNextWaterInfo, getWateringRhythm, resolvePlantImageSource } from "../core";

export const AdaptiveWateringCard = memo(function AdaptiveWateringCard({ theme, savedPlants, wateringHistory, wateredPlants, weather, onOpenPlant }) {
  const [visible, setVisible] = useState(6);
  const rows = (savedPlants || [])
    .map((name) => {
      const item = produceData.find((p) => p.name === name);
      if (!item) return null;
      const next = getNextWaterInfo(name, item, wateringHistory, wateredPlants, weather);
      if (!next) return null; // needs at least one logged watering
      const rhythm = getWateringRhythm(name, item, wateringHistory); // learned interval (3+ waterings)
      const learned = !!rhythm;
      const interval = learned ? rhythm.avgGap : getBaseWaterInterval(item);
      return { name, item, next, interval, learned };
    })
    .filter(Boolean)
    .sort((a, b) => a.next.daysUntil - b.next.daysUntil);

  if (!rows.length) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Water your plants a few times and Pocket Planter will learn each one's rhythm and build a personalized schedule here.
      </Text>
    );
  }

  const learnedCount = rows.filter((r) => r.learned).length;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        A schedule that adapts to you — {learnedCount > 0 ? `learned from your habits on ${learnedCount} plant${learnedCount === 1 ? "" : "s"}` : "starting from typical needs"}, then adjusted for the weather.
      </Text>

      <View style={{ gap: 8, marginTop: 14 }}>
        {rows.slice(0, visible).map(({ name, item, next, interval, learned }) => {
          const img = resolvePlantImageSource(item);
          const accent = next.urgency === "due" ? "#6bc7ff" : next.urgency === "soon" ? "#ffd86b" : "#8effab";
          return (
            <Pressable
              key={name}
              onPress={() => onOpenPlant && onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 11, borderWidth: 1, borderColor: `${accent}22` }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 28, height: 28 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{name}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 11.5, fontWeight: "700", marginTop: 1 }}>
                  Every ~{interval}d {learned ? "· 🧠 learned from you" : "· typical"}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: accent, fontSize: 12.5, fontWeight: "900" }}>{next.daysUntil <= 0 ? "Due now" : next.daysUntil === 1 ? "Tomorrow" : `${next.daysUntil}d`}</Text>
                {next.rainSoon ? <Text style={{ color: "#8effab", fontSize: 10, fontWeight: "800", marginTop: 1 }}>🌧️ check soil</Text> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {rows.length > visible ? (
        <Pressable
          onPress={() => setVisible((c) => c + 8)}
          style={{ marginTop: 12, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 16, paddingVertical: 13, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
        >
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>Show more plants ({rows.length - visible} more)</Text>
        </Pressable>
      ) : null}

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        🧠 = interval learned from your watering history · intervals tighten automatically in heat.
      </Text>
    </View>
  );
})
