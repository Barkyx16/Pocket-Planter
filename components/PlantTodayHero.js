import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { FROST_THRESHOLD_F, getHarvestCountdown, getPlantDifficulty, getPlantSeasonLabel, getTodayKey, HEAT_THRESHOLD_F, normalizeType, resolvePlantImageSource, typeLabel } from "../core";
import { useTranslation } from "../lib/i18n";

export const PlantTodayHero = memo(function PlantTodayHero({ theme, monthlySuggestions, compatiblePlants, savedPlants = [], zone, weather, onOpen }) {
  const { t } = useTranslation();
  const basePool = monthlySuggestions.length > 0 ? monthlySuggestions : compatiblePlants;
  const unsavedPool = basePool.filter((p) => !savedPlants.includes(p.name));
  const plantPool = unsavedPool.length > 0 ? unsavedPool : basePool;

  if (!plantPool.length) return null;

  // Random-feeling pick that's seeded by today's date, so it stays stable through
  // the day (no flicker on re-render) but lands on a fresh plant each new day —
  // the local day, so it turns over at midnight rather than at 5pm in California.
  const dateKey = getTodayKey();
  let seed = 0;
  for (let i = 0; i < dateKey.length; i += 1) seed = (seed * 31 + dateKey.charCodeAt(i)) >>> 0;
  const plant = plantPool[seed % plantPool.length];

  if (!plant) return null;

  const imageSource = resolvePlantImageSource(plant);
  const difficulty = getPlantDifficulty(plant);
  const harvest = getHarvestCountdown(plant);
  const type = normalizeType(plant.type, plant.name);

  const getWhyNow = () => {
    const seasonLabel = getPlantSeasonLabel(plant, zone);
    if (weather?.minTempF <= FROST_THRESHOLD_F) return t("myGardenToday.heroFrost");
    if (weather?.maxTempF >= HEAT_THRESHOLD_F && difficulty.label !== "Hard") return t("myGardenToday.heroHeat");
    if (seasonLabel === "Plant now") return zone ? t("myGardenToday.heroPrimeZone", { zone }) : t("myGardenToday.heroPrimeArea");
    if (difficulty.label === "Easy") return t("myGardenToday.heroEasy");
    return zone ? t("myGardenToday.heroSeasonalZone", { zone }) : t("myGardenToday.heroSeasonalArea");
  };


return (
    <Pressable accessibilityRole="button" onPress={() => onOpen(plant)} style={styles.plantTodayHero}>
      <View style={styles.plantTodayGlow} />
    <View style={{ flex: 1 }}>
        <Text style={[styles.plantTodayTitle, { color: theme.text }]}>{plant.name}</Text>
        <Text style={[styles.plantTodayText, { color: theme.secondaryText }]}>
          {getWhyNow()}
        </Text>
        <View style={styles.plantTodayTagRow}>
          <View style={styles.plantTodayTag}>
            <Text style={styles.plantTodayTagText}>{difficulty.icon} {difficulty.labelText}</Text>
          </View>
          <View style={styles.plantTodayTag}>
            <Text style={styles.plantTodayTagText}>🚜 {harvest}</Text>
          </View>
          <View style={styles.plantTodayTag}>
            <Text style={styles.plantTodayTagText}>🌿 {typeLabel(type)}</Text>
          </View>
        </View>
        <Text style={styles.plantTodayButtonText}>{t("plantTodayHero.viewCareGuide")}</Text>
      </View>
      {imageSource ? (
        <View style={styles.plantTodayImageWrap}>
          <Image source={imageSource} style={styles.plantTodayImage} resizeMode="contain" />
        </View>
      ) : (
        <Text style={styles.plantTodayFallback}>🌿</Text>
      )}
    </Pressable>
  );
})
