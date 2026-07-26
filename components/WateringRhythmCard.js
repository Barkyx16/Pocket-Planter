import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getWateringRhythm, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

export const WateringRhythmCard = memo(function WateringRhythmCard({ theme, savedPlants, wateringHistory, onOpenPlant }) {
  const { t } = useTranslation();
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
    under: { color: "#ffd86b", icon: "🌵", label: "Water sooner" },
    over: { color: "#6bc7ff", icon: "💧", label: "Space it out" },
  };

return (
    <View>
      <View style={{ gap: 8, marginTop: 14 }}>
        {rows.map(({ name, item, rhythm }) => {
          const s = STATUS[rhythm.status];
          const img = resolvePlantImageSource(item);
          const detail = `Every ~${rhythm.avgGap}d · target ~${rhythm.target}d`;
          return (
            <Pressable
              key={`rhythm-${name}`}
              onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: `${s.color}30` }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 28, height: 28 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }} numberOfLines={1}>{name}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 2 }} numberOfLines={1}>{detail}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <Text style={{ color: s.color, fontSize: 10, fontWeight: "900" }} numberOfLines={1}>{s.icon} {s.label}</Text>
                <Text style={{ color: s.color, fontSize: 16, fontWeight: "900" }}>›</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 10, fontStyle: "italic", textAlign: "center" }}>
        {t("wateringRhythm.needsAtLeast3Logged")}
      </Text>
    </View>
  );
})
