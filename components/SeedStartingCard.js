import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { getSeedStartInfo, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

export const SeedStartingCard = memo(function SeedStartingCard({ theme, plants, zone, onOpenPlant }) {
  const { t } = useTranslation();
  const scored = (plants || [])
    .map((item) => ({ item, info: getSeedStartInfo(item, zone) }))
    .filter((e) => e.info && (e.info.status === "start-now" || e.info.status === "upcoming"))
    .sort((a, b) => a.info.daysUntilStart - b.info.daysUntilStart);

  const startNow = scored.filter((e) => e.info.status === "start-now");
  const upcoming = scored.filter((e) => e.info.status === "upcoming").slice(0, 4);
  if (!startNow.length && !upcoming.length) return null;
  const accent = startNow.length ? "#8effab" : "#6bc7ff";

  return (
    <View style={{ borderRadius: 24, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: `${accent}12`, borderColor: accent }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>🌱</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: accent, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>{t("seedStarting.seedStarting")}</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {startNow.length ? `Start ${startNow.length} plant${startNow.length === 1 ? "" : "s"} indoors now` : t("seedStarting.comingUpToStartIndoors")}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {t("seedStarting.startingSeedsIndoorsAheadOf")}
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {startNow.map(({ item, info }) => {
          const img = resolvePlantImageSource(item);
          return (
            <Pressable key={`start-${item.name}`} onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(142, 255, 171, 0.2)" }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{item.name}</Text>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  {t("seedStarting.startIndoorsBy")} {info.startByLabel} · {info.weeks} {t("seedStarting.wksBeforeFrost")}
                </Text>
                <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 2 }}>
                  {t("seedStarting.transplantAround")} {info.transplantLabel}
                </Text>
              </View>
              <Text style={{ color: accent, fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
        {upcoming.map(({ item, info }) => (
          <View key={`soon-${item.name}`} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{item.name}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800" }}>in {info.daysUntilStart}d</Text>
          </View>
        ))}
      </View>
    </View>
  );
})
