import { memo } from "react";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { RARITY_STYLES, getPlantSeasonLabel, getRarity, normalizeType, resolvePlantImageSource } from "../core";

export const SwipeablePlantGallery = memo(function SwipeablePlantGallery({ plants, theme, zone, onOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
  setActiveIndex(0);
}, [plants.length]);
  if (!plants.length) return (
    <View style={styles.emptyStateCard}>
      <Text style={styles.emptyStateIcon}>🌱</Text>
      <Text style={styles.emptyStateTitle}>No plants for your zone yet</Text>
      <Text style={styles.emptyStateText}>
        {zone
          ? `We couldn't find plants matched to Zone ${zone} right now. Try browsing all plants on the Plants tab.`
          : "Set your ZIP code on the Home tab to see plants matched to your growing zone."}
      </Text>
    </View>
  );
  const plant = plants[activeIndex] || plants[0];
  const imageSource = resolvePlantImageSource(plant);
  const rarity = RARITY_STYLES[getRarity(plant)];
  return (
    <View style={styles.gallerySingleWrap}>
      <Pressable onPress={() => onOpen(plant)} style={[styles.galleryCard, { width: "100%", backgroundColor: "rgba(16,41,23,0.94)", borderColor: "#5cff89" }]}>
        <View style={styles.galleryGlow} />
       {imageSource ? (
  <View style={styles.galleryImageDarkWrap}>
    <Image source={imageSource} style={styles.galleryImage} resizeMode="contain" />
  </View>
) : (<Text style={styles.galleryFallbackSmall}>🌱</Text>)}
        <View style={styles.galleryTextBox}>
          <Text style={[styles.galleryName, { color: "#ffffff" }]}>{plant.name}</Text>
          <Text style={[styles.galleryMeta, { color: theme.secondaryText }]}>{normalizeType(plant.type, plant.name)} • {getPlantSeasonLabel(plant, zone)}</Text>
          <View style={[styles.rarityBadge, { backgroundColor: "rgba(92,255,137,0.12)" }]}><Text style={[styles.rarityBadgeText, { color: "#8effab" }]}>{rarity.emoji} {rarity.label}</Text></View>
        </View>
      </Pressable>
      <View style={styles.galleryButtonRow}>
        <Pressable onPress={() => setActiveIndex((c) => c === 0 ? plants.length - 1 : c - 1)} style={styles.galleryNavButton}><Text style={styles.galleryNavButtonText}>‹ Previous</Text></Pressable>
        <Text style={styles.galleryCounterText}>{activeIndex + 1} / {plants.length}</Text>
        <Pressable onPress={() => setActiveIndex((c) => c === plants.length - 1 ? 0 : c + 1)} style={styles.galleryNavButton}><Text style={styles.galleryNavButtonText}>Next ›</Text></Pressable>
      </View>
    </View>
  );
})
