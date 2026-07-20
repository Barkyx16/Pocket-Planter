import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { getSunMismatch, resolvePlantImageSource } from "../core";

export const SunlightMismatchCard = memo(function SunlightMismatchCard({ theme, gardenAreas, onOpenPlant }) {
  // Only consider areas the user has actually tagged with a sun level.
  const tagged = (gardenAreas || []).filter((a) => a.sunExposure);
  if (!tagged.length) return null;

  const mismatches = [];
  const seen = new Set(); // de-dupe by plant+area so repeated plots don't stack
  tagged.forEach((area) => {
    const names = Array.from(new Set(Object.values(area.plots || {}).filter(Boolean)));
    names.forEach((name) => {
      const plant = produceData.find((p) => p.name === name);
      if (!plant) return;
      const warn = getSunMismatch(plant, area.sunExposure);
      if (!warn) return;
      const key = `${area.id}-${name}`;
      if (seen.has(key)) return;
      seen.add(key);
      mismatches.push({ plant, areaName: area.name, areaSun: area.sunExposure, ...warn });
    });
  });

  if (!mismatches.length) return null;

  // Sort worst-first: high > medium > low.
  const rank = { high: 0, medium: 1, low: 2 };
  mismatches.sort((a, b) => rank[a.level] - rank[b.level]);

  const sunLabel = { full: "☀️ Full sun", partial: "⛅ Partial", shade: "🌥️ Shade" };
  const levelColor = { high: "#ff7b7b", medium: "#ffd86b", low: "#8effab" };
  const hasHigh = mismatches.some((m) => m.level === "high");
  const accent = hasHigh ? "#ff7b7b" : "#ffd86b";

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: accent }]}>
      <Text style={styles.cardEyebrow}>☀️ SUNLIGHT CHECK</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Sun Placement Warnings</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {mismatches.length} plant{mismatches.length === 1 ? "" : "s"} may be in the wrong light for the bed {mismatches.length === 1 ? "it's" : "they're"} planted in.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {mismatches.map((m) => {
          const img = resolvePlantImageSource(m.plant);
          return (
            <Pressable
              key={`sun-${m.areaName}-${m.plant.name}`}
              onPress={() => onOpenPlant && onOpenPlant(m.plant)}
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: `${levelColor[m.level]}30` }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{m.plant.name}</Text>
                  <View style={{ backgroundColor: `${levelColor[m.level]}22`, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ color: levelColor[m.level], fontSize: 10, fontWeight: "900" }}>
                      {m.level === "high" ? "NEEDS FIXING" : m.level === "medium" ? "WATCH" : "MINOR"}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 3 }}>
                  {m.areaName} · {sunLabel[m.areaSun]}
                </Text>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 5 }}>
                  {m.text}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
})
