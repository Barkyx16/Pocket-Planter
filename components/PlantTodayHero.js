import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { getHarvestCountdown, getPlantDifficulty, getPlantSeasonLabel, normalizeType, resolvePlantImageSource } from "../core";

export function PlantTodayHero({ theme, monthlySuggestions, compatiblePlants, savedPlants = [], zone, weather, onOpen }) {
  const weekOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24 * 7));

  const basePool = monthlySuggestions.length > 0 ? monthlySuggestions : compatiblePlants;
  const unsavedPool = basePool.filter((p) => !savedPlants.includes(p.name));
  const plantPool = unsavedPool.length > 0 ? unsavedPool : basePool;

  if (!plantPool.length) return null;

  const plant = plantPool[weekOfYear % plantPool.length];

  if (!plant) return null;

  const imageSource = resolvePlantImageSource(plant);
  const difficulty = getPlantDifficulty(plant);
  const harvest = getHarvestCountdown(plant);
  const type = normalizeType(plant.type, plant.name);

  const getWhyNow = () => {
    const seasonLabel = getPlantSeasonLabel(plant, zone);
    if (weather?.minTempF <= 35) return "Start it indoors now — frost is in the forecast, so it'll be ready to transplant once nights warm up.";
    if (weather?.maxTempF >= 95 && difficulty.label !== "Hard") return `It can handle the current heat — plant early morning and water deeply to get it established.`;
    if (seasonLabel === "Plant now") return `This is a prime planting window for ${type.toLowerCase()} in Zone ${zone || "your area"} right now.`;
    if (difficulty.label === "Easy") return `An easy, forgiving grower — a great low-effort pick to add to your garden this week.`;
    return `A strong seasonal match for Zone ${zone || "your area"} worth planning into your garden this week.`;
  };

  const getDayLabel = () => {
    return "This Week";
  };

return (
    <Pressable onPress={() => onOpen(plant)} style={styles.plantTodayHero}>
      <View style={styles.plantTodayGlow} />
    <View style={{ flex: 1 }}>
        <Text style={[styles.plantTodayTitle, { color: theme.text }]}>{plant.name}</Text>
        <Text style={[styles.plantTodayText, { color: theme.secondaryText }]}>
          {getWhyNow()}
        </Text>
        <View style={styles.plantTodayTagRow}>
          <View style={styles.plantTodayTag}>
            <Text style={styles.plantTodayTagText}>{difficulty.icon} {difficulty.label}</Text>
          </View>
          <View style={styles.plantTodayTag}>
            <Text style={styles.plantTodayTagText}>🚜 {harvest}</Text>
          </View>
          <View style={styles.plantTodayTag}>
            <Text style={styles.plantTodayTagText}>🌿 {type}</Text>
          </View>
        </View>
        <Text style={styles.plantTodayButtonText}>View care guide →</Text>
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
}
