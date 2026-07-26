import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { getPlantDifficulty, getPlantSeasonLabel, resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const EmptyGardenStarterCard = memo(function EmptyGardenStarterCard({ theme, savedPlants, compatiblePlants, zone, onOpenPlant, onBrowse }) {
  const { t } = useTranslation();
  if ((savedPlants || []).length > 0) return null;

  const starters = (compatiblePlants || [])
    .filter((item) => getPlantDifficulty(item).label === "Easy")
    .filter((item) => {
      const label = getPlantSeasonLabel(item, zone);
      return label === "Plant now" || label === "Zone fit";
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 3);

  const picks = starters.length
    ? starters
    : (compatiblePlants || []).filter((item) => getPlantDifficulty(item).label === "Easy").slice(0, 3);

  if (!picks.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
      <IconText label={t("emptyGardenStarter.getStarted")} style={styles.cardEyebrow} />
      <Text style={[styles.cardTitle, { color: theme.text }]}>{t("emptyGardenStarter.yourGardensLookingBare")}</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {t("emptyGardenStarter.hereAreAFewBeginnerfriendly")} {zone || t("emptyGardenStarter.yourArea")}{t("emptyGardenStarter.saveOneToStartYour")}
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {picks.map((item) => {
          const img = resolvePlantImageSource(item);
          const diff = getPlantDifficulty(item);
          return (
            <Pressable
              key={`starter-${item.name}`}
              onPress={() => onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{item.name}</Text>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                  {diff.icon} {diff.text} · {getPlantSeasonLabel(item, zone)}
                </Text>
              </View>
              <Text style={{ color: "#5cff89", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={onBrowse} style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>{t("emptyGardenStarter.browseAllPlants")}</Text>
      </Pressable>
    </View>
  );
})
