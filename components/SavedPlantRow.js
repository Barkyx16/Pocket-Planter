import React from "react";
import { Image, Pressable, Text } from "react-native";
import { styles } from "../styles";
import { getLastWateredText, getPlantHealthStatus, getWateringStreak, resolvePlantImageSource } from "../core";

export const SavedPlantRow = React.memo(function SavedPlantRow({ item, onOpenPlant, onTogglePin, pinnedPlants, wateredPlants, wateringHistory, weather }) {
  const imageSource = resolvePlantImageSource(item);
  const health = getPlantHealthStatus({ plantName: item.name, wateredPlants, weather });
  const streak = getWateringStreak(item.name, wateringHistory);
  const isPinned = pinnedPlants.includes(item.name);
  return (
    <Pressable onPress={() => onOpenPlant(item)} style={styles.compactSavedPlantPill}>
      {onTogglePin ? (
        <Pressable onPress={() => onTogglePin(item.name)} hitSlop={8} accessibilityRole="button" accessibilityLabel={isPinned ? `Unpin ${item.name}` : `Pin ${item.name}`} style={{ position: "absolute", top: 4, right: 4, zIndex: 5, padding: 4 }}>
          <Text style={{ fontSize: 14, opacity: isPinned ? 1 : 0.3 }}>📌</Text>
        </Pressable>
      ) : null}
      {imageSource ? (
        <Image source={imageSource} style={styles.compactSavedPlantImage} resizeMode="contain" />
      ) : (
        <Text style={styles.compactSavedPlantEmoji}>🌱</Text>
      )}
      <Text numberOfLines={1} style={styles.compactSavedPlantName}>{item.name}</Text>
      <Text numberOfLines={1} style={[styles.compactSavedPlantHealth, { color: health.color }]}>{health.icon} {health.label}</Text>
      <Text numberOfLines={1} style={styles.compactSavedPlantWatered}>{getLastWateredText(item.name, wateredPlants, wateringHistory)}</Text>
      {streak >= 2 ? (
        <Text numberOfLines={1} style={styles.compactSavedPlantStreak}>🔥 {streak}</Text>
      ) : null}
    </Pressable>
  );
});
