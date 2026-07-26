import { memo } from "react";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { getLastWateredText, getPlantHealthStatus, getTodayKey, getWateringStreak, resolvePlantImageSource } from "../core";

export const SavedPlantsCard = memo(function SavedPlantsCard({
  theme,
  savedPlants,
  plantFolders,
  premiumUnlocked,
  onOpenPlant,
  onUpgrade,
  harvestTrackers,
  wateredPlants,
  wateringHistory,
  weather,
  pinnedPlants = [],
  onTogglePin,
}) {
const [sortMode, setSortMode] = useState("recent");
  const today = getTodayKey();
  const savedItems = useMemo(() => {
    const baseItems = produceData.filter((item) => savedPlants.includes(item.name));
    return [...baseItems].sort((a, b) => {
      const aPin = pinnedPlants.includes(a.name) ? 0 : 1;
      const bPin = pinnedPlants.includes(b.name) ? 0 : 1;
      if (aPin !== bPin) return aPin - bPin; // pinned always first
      if (sortMode === "alpha") return a.name.localeCompare(b.name);
      if (sortMode === "water") {
        const aNeeds = wateredPlants?.[a.name] !== today ? 0 : 1;
        const bNeeds = wateredPlants?.[b.name] !== today ? 0 : 1;
        if (aNeeds !== bNeeds) return aNeeds - bNeeds;
        return a.name.localeCompare(b.name);
      }
      return savedPlants.indexOf(b.name) - savedPlants.indexOf(a.name);
    });
  }, [savedPlants, pinnedPlants, sortMode, wateredPlants, today]);

  if (!savedItems.length) {
    return null;
  }

  const SORT_OPTIONS = [
    { id: "recent", label: "Recent" },
    { id: "water", label: "Needs water" },
    { id: "alpha", label: "A–Z" },
  ];

  return (
    <View>
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }} />
       {!premiumUnlocked && savedPlants.length >= 5 ? (
          <Pressable
            onPress={onUpgrade}
            style={styles.compactUpgradeButton}
          >
            <Text style={styles.compactUpgradeButtonText}>
              Upgrade
            </Text>
          </Pressable>
        ) : null}
      </View>

      {savedItems.length > 2 ? (
        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          {SORT_OPTIONS.map((opt) => {
            const active = sortMode === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setSortMode(opt.id)}
                style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.08)" }}
              >
                <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.compactSavedPlantsScroll}
      >
        {savedItems.map((item) => {
          const imageSource = resolvePlantImageSource(item);
          const health = getPlantHealthStatus({
            plantName: item.name,
            wateredPlants,
            weather,
          });

          return (
           <Pressable
              key={`compact-saved-${item.name}`}
              onPress={() => onOpenPlant(item)}
              style={styles.compactSavedPlantPill}
            >
              {onTogglePin ? (
                <Pressable
                  onPress={() => onTogglePin(item.name)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={pinnedPlants.includes(item.name) ? `Unpin ${item.name}` : `Pin ${item.name}`}
                  style={{ position: "absolute", top: 4, right: 4, zIndex: 5, padding: 4 }}
                >
                  <Text style={{ fontSize: 14, opacity: pinnedPlants.includes(item.name) ? 1 : 0.3 }}>📌</Text>
                </Pressable>
              ) : null}

              {imageSource ? (
                <Image
                  source={imageSource}
                  style={styles.compactSavedPlantImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.compactSavedPlantEmoji}>
                  🌱
                </Text>
              )}

              <Text
                numberOfLines={1}
                style={styles.compactSavedPlantName}
              >
                {item.name}
              </Text>

             <Text
                numberOfLines={1}
                style={[
                  styles.compactSavedPlantHealth,
                  { color: health.color },
                ]}
              >
                {health.icon} {health.label}
              </Text>

<Text
                numberOfLines={1}
                style={styles.compactSavedPlantWatered}
              >
                {getLastWateredText(item.name, wateredPlants, wateringHistory)}
              </Text>

              {getWateringStreak(item.name, wateringHistory) >= 2 ? (
                <Text
                  numberOfLines={1}
                  style={styles.compactSavedPlantStreak}
                >
                  🔥 {getWateringStreak(item.name, wateringHistory)}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
})
