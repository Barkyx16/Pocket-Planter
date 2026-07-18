import { Image, Pressable, Text, View } from "react-native";
import { getSeedStartInfo, resolvePlantImageSource } from "../core";

export function SeedStartingCard({ theme, plants, zone, onOpenPlant }) {
  const scored = (plants || [])
    .map((item) => ({ item, info: getSeedStartInfo(item, zone) }))
    .filter((e) => e.info && (e.info.status === "start-now" || e.info.status === "upcoming"))
    .sort((a, b) => a.info.daysUntilStart - b.info.daysUntilStart);

  const startNow = scored.filter((e) => e.info.status === "start-now");
  const upcoming = scored.filter((e) => e.info.status === "upcoming").slice(0, 4);
  if (!startNow.length && !upcoming.length) return null;
  const accent = startNow.length ? "#8effab" : "#6bc7ff";

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: `${accent}12`, borderColor: accent }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>🌱</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: accent, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>SEED STARTING</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {startNow.length ? `Start ${startNow.length} plant${startNow.length === 1 ? "" : "s"} indoors now` : "Coming up to start indoors"}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        Starting seeds indoors ahead of your last frost gives transplants a head start when it warms up.
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {startNow.map(({ item, info }) => {
          const img = resolvePlantImageSource(item);
          return (
            <Pressable key={`start-${item.name}`} onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(142,255,171,0.22)" }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{item.name}</Text>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  Start indoors by {info.startByLabel} · {info.weeks} wks before frost
                </Text>
                <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 2 }}>
                  Transplant around {info.transplantLabel}
                </Text>
              </View>
              <Text style={{ color: accent, fontSize: 22, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
        {upcoming.map(({ item, info }) => (
          <View key={`soon-${item.name}`} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{item.name}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800" }}>in {info.daysUntilStart}d</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
