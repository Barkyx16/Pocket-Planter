import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { getFirstFrostDate, getFrostMaturityInfo, getPlantSeasonLabel, resolvePlantImageSource } from "../core";
import { formatDate, useTranslation } from "../lib/i18n";

export const FrostWindowCard = memo(function FrostWindowCard({ theme, plants, zone, onOpenPlant }) {
  const { t } = useTranslation();
  if (!zone) return null;
  const atRisk = (plants || [])
    .filter((item) => getPlantSeasonLabel(item, zone) === "Plant now")
    .map((item) => ({ item, info: getFrostMaturityInfo(item, zone) }))
    .filter((e) => e.info && e.info.atRisk)
    .sort((a, b) => b.info.short - a.info.short)
    .slice(0, 5);

  if (!atRisk.length) return null;

  const firstFrost = getFirstFrostDate(zone);
  const frostLabel = formatDate(firstFrost, {
  month: "short",
  day: "numeric"
});

  return (
    <View style={{ borderRadius: 24, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(107, 199, 255, 0.1)", borderCrolor: "#6bc7ff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>⏳</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>{t("frostWindow.frostWindow")}</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {t("frostWindow.mayNotFinishBeforeFrost")}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {t("frostWindow.firstFrostIsEstimatedAround")} {frostLabel}{t("frostWindow.theseCropsNeedLongerThan")}
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {atRisk.map(({ item, info }) => {
          const img = resolvePlantImageSource(item);
          return (
            <Pressable
              key={`frostwin-${item.name}`}
              onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.2)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{item.name}</Text>
                <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  {t("frostWindow.needs")}{info.days}{t("frostWindow.dOnly")}{info.daysUntilFrost}{t("frostWindow.dLeftShort")}{info.short}d
                </Text>
              </View>
              <Text style={{ color: "#6bc7ff", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        {t("frostWindow.estimatedFromYourZoneA")}
      </Text>
    </View>
  );
})
