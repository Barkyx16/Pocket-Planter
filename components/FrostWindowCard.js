import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { getFirstFrostDate, getFrostMaturityInfo, getPlantSeasonLabel, resolvePlantImageSource } from "../core";

export const FrostWindowCard = memo(function FrostWindowCard({ theme, plants, zone, onOpenPlant }) {
  if (!zone) return null;
  const atRisk = (plants || [])
    .filter((item) => getPlantSeasonLabel(item, zone) === "Plant now")
    .map((item) => ({ item, info: getFrostMaturityInfo(item, zone) }))
    .filter((e) => e.info && e.info.atRisk)
    .sort((a, b) => b.info.short - a.info.short)
    .slice(0, 5);

  if (!atRisk.length) return null;

  const firstFrost = getFirstFrostDate(zone);
  const frostLabel = firstFrost.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(107,199,255,0.10)", borderCrolor: "#6bc7ff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>⏳</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>FROST WINDOW</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            May not finish before frost
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        First frost is estimated around {frostLabel}. These crops need longer than that to mature if planted now — start them indoors, pick a faster variety, or wait for spring.
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {atRisk.map(({ item, info }) => {
          const img = resolvePlantImageSource(item);
          return (
            <Pressable
              key={`frostwin-${item.name}`}
              onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(107,199,255,0.22)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{item.name}</Text>
                <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  Needs ~{info.days}d · only ~{info.daysUntilFrost}d left · short ~{info.short}d
                </Text>
              </View>
              <Text style={{ color: "#6bc7ff", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Estimated from your zone — a fast-maturing variety may still finish in time.
      </Text>
    </View>
  );
})
