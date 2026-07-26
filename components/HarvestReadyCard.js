import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { HARVEST_SOON_DAYS, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

export const HarvestReadyCard = memo(function HarvestReadyCard({ theme, harvestTrackers, onOpenPlant }) {
  const { t } = useTranslation();
  const entries = Object.entries(harvestTrackers || {})
    .map(([name, tracker]) => {
      const daysPassed = Math.floor((new Date() - new Date(tracker.startedAt)) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, (tracker.days || 0) - daysPassed);
      return { name, daysLeft };
    })
    .filter((e) => e.daysLeft <= HARVEST_SOON_DAYS)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (!entries.length) return null;

  const ready = entries.filter((e) => e.daysLeft === 0);
  const accent = ready.length ? "#ffd86b" : "#8effab";
  const headline = ready.length
    ? `${ready.length} plant${ready.length === 1 ? "" : "s"} ready to harvest!`
    : "Harvest coming up";

  return (
    <View style={{ borderRadius: 24, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: `${accent}12`, borderColor: accent }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>{ready.length ? "🎉" : "🌾"}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: accent, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>{t("harvestReady.harvestTracker")}</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>{headline}</Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {ready.length
          ? t("harvestReady.pickTheseSoonForPeak")
          : t("harvestReady.thesePlantsAreEnteringTheir")}
      </Text>
      <View style={{ gap: 10, marginTop: 14 }}>
        {entries.map((e) => {
          const plant = produceData.find((item) => item.name === e.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          const isReady = e.daysLeft === 0;
          return (
            <Pressable
              key={`harvest-${e.name}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: isReady ? "rgba(255, 216, 107, 0.3)" : "rgba(142, 255, 171, 0.2)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{e.name}</Text>
                <Text style={{ color: isReady ? "#ffd86b" : "#8effab", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  {isReady ? t("harvestReady.readyToHarvestNow") : `⏳ ~${e.daysLeft} day${e.daysLeft === 1 ? "" : "s"} to harvest`}
                </Text>
              </View>
              <Text style={{ color: accent, fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
})
