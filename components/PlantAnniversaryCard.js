import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

export const PlantAnniversaryCard = memo(function PlantAnniversaryCard({ theme, plantSaveDates, savedPlants, onOpenPlant }) {
  const { t } = useTranslation();
  const now = new Date();
  const milestones = (savedPlants || [])
    .map((name) => {
      const saved = plantSaveDates?.[name];
      if (!saved) return null;
      const savedDate = new Date(`${saved}T12:00:00`);
      if (Number.isNaN(savedDate.getTime())) return null;
      const days = Math.floor((now - savedDate) / (1000 * 60 * 60 * 24));
      if (days < 30) return null;
      // Determine the most recent monthly/yearly milestone reached
      let label = null;
      const years = Math.floor(days / 365);
      const months = Math.floor(days / 30);
      if (years >= 1 && days % 365 < 3) label = years === 1 ? "1 year" : `${years} years`;
      else if (months >= 1 && days % 30 < 3) label = months === 1 ? "1 month" : `${months} months`;
      if (!label) return null;
      return { name, label, days };
    })
    .filter(Boolean)
    .sort((a, b) => b.days - a.days);

  if (!milestones.length) return null;

  return (
    <View style={{ borderRadius: 24, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(255, 182, 193, 0.1)", borderColor: "#ffb6c1" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>🎂</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#ffb6c1", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>{t("plantAnniversary.plantAnniversary")}</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {milestones.length === 1 ? t("plantAnniversary.aPlantMilestone") : `${milestones.length} plant milestones!`}
          </Text>
        </View>
      </View>
      <View style={{ gap: 10, marginTop: 14 }}>
        {milestones.slice(0, 4).map((m) => {
          const plant = produceData.find((p) => p.name === m.name);
          const img = plant ? resolvePlantImageSource(plant) : null;
          return (
            <Pressable
              key={`anniv-${m.name}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(255, 182, 193, 0.2)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{m.name}</Text>
                <Text style={{ color: "#ffb6c1", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  🎉 {m.label} {t("plantAnniversary.together")}
                </Text>
              </View>
              <Text style={{ color: "#ffb6c1", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
})
