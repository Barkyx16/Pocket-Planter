import { memo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getBaseWaterInterval, getNextWaterInfo, getWateringRhythm, resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const AdaptiveWateringCard = memo(function AdaptiveWateringCard({ theme, savedPlants, wateringHistory, wateredPlants, weather, onOpenPlant }) {
  const { t } = useTranslation();
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
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("adaptiveWatering.waterYourPlantsAFew")}
      </Text>
    );
  }

  const learnedCount = rows.filter((r) => r.learned).length;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("adaptiveWatering.aScheduleThatAdaptsTo")} {learnedCount > 0 ? `learned from your habits on ${learnedCount} plant${learnedCount === 1 ? "" : "s"}` : t("adaptiveWatering.startingFromTypicalNeeds")}{t("adaptiveWatering.thenAdjustedForTheWeather")}
      </Text>

      <View style={{ gap: 8, marginTop: 14 }}>
        {rows.slice(0, visible).map(({ name, item, next, interval, learned }) => {
          const img = resolvePlantImageSource(item);
          const accent = next.urgency === "due" ? "#6bc7ff" : next.urgency === "soon" ? "#ffd86b" : "#8effab";
          return (
            <Pressable
              key={name}
              onPress={() => onOpenPlant && onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: `${accent}22` }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 28, height: 28 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{name}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                  {t("adaptiveWatering.every")}{interval}d {learned ? t("adaptiveWatering.learnedFromYou") : t("adaptiveWatering.typical")}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: accent, fontSize: 12, fontWeight: "900" }}>{next.daysUntil <= 0 ? t("adaptiveWatering.dueNow") : next.daysUntil === 1 ? "Tomorrow" : `${next.daysUntil}d`}</Text>
                {next.rainSoon ? <IconText label={t("adaptiveWatering.checkSoil")} style={{
  color: "#8effab",
  fontSize: 10,
  fontWeight: "800",
  marginTop: 2
}} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {rows.length > visible ? (
        <Pressable
          onPress={() => setVisible((c) => c + 8)}
          style={{ marginTop: 12, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
        >
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>{t("adaptiveWatering.showMorePlants")}{rows.length - visible} {t("adaptiveWatering.more")}</Text>
        </Pressable>
      ) : null}

      <IconText label={t("adaptiveWatering.intervalLearnedFromYourWatering")} style={{
  color: theme.secondaryText,
  fontSize: 10,
  fontWeight: "700",
  marginTop: 12,
  fontStyle: "italic",
  textAlign: "center"
}} />
    </View>
  );
})
