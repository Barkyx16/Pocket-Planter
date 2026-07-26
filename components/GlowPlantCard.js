import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { RARITY_STYLES, getHarvestCountdown, getLastWateredText, getNextWaterInfo, getPlantDifficulty, getRarity, getStreakDaysLeft, getTodayKey, getWateringStreak, normalizeType, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

export const GlowPlantCard = memo(function GlowPlantCard({ plant, weather, zone, theme, isSaved, isCompared, isFollowed, isInGarden, isSnoozed, wateredDate, wateredPlants, wateringHistory, onOpen, onSave, onCompare, onFollow, onAddToGarden, onWater, onSnooze }) {
  const { t } = useTranslation();
  const imageSource = resolvePlantImageSource(plant);
  const rarity = RARITY_STYLES[getRarity(plant)];
  const wateredToday = wateredDate === getTodayKey();
  const difficulty = getPlantDifficulty(plant);

  return (
    <Pressable onPress={onOpen} style={[styles.glowPlantCard, { backgroundColor: theme.card, borderColor: "rgba(92, 255, 137, 0.16)" }]}>

      {/* TOP ROW */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          {imageSource
            ? <Image source={imageSource} style={{ width: 70, height: 70 }} resizeMode="contain" />
            : <Text style={{ fontSize: 36 }}>🌱</Text>
          }
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text numberOfLines={1} style={{ color: theme.text, fontSize: 20, fontWeight: "900", flex: 1 }}>{plant.name}</Text>
            <View style={{ backgroundColor: "rgba(92, 255, 137, 0.12)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 6 }}>
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>{rarity.emoji}</Text>
            </View>
          </View>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4 }}>
            {normalizeType(plant.type, plant.name)} {t("glowPlant.zones")} {plant.minZone}–{plant.maxZone}
          </Text>
          <View style={{ flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <View style={{ backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}>
              <Text style={{ color: "#8effab", fontSize: 10, fontWeight: "900" }}>{difficulty.icon} {difficulty.label}</Text>
            </View>
            <View style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: "#d7ebdc", fontSize: 10, fontWeight: "800" }}>🚜 {getHarvestCountdown(plant)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSaved ? `Remove ${plant.name} from saved plants` : `Save ${plant.name}`}
          onPress={(e) => { e.stopPropagation?.(); onSave(); }}
          style={[{ flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
            isSaved ? { backgroundColor: "#5cff89", borderColor: "#5cff89" } : { backgroundColor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.1)" }
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: isSaved ? "#07120b" : "#ffffff" }}>
            {isSaved ? t("glowPlant.saved") : "Save"}
          </Text>
        </Pressable>

        <Pressable
          onPress={(e) => { e.stopPropagation?.(); onCompare(); }}
          style={[{ flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
            isCompared ? { backgroundColor: "#ffd86b", borderColor: "#ffd86b" } : { backgroundColor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.1)" }
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: isCompared ? "#07120b" : "#ffffff" }}>
            {isCompared ? t("glowPlant.on") : "Compare"}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={wateredToday ? `Undo watering for ${plant.name}` : `Mark ${plant.name} as watered today`}
          onPress={(e) => { e.stopPropagation?.(); onWater(); }}
          style={[{ flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
            wateredToday ? { backgroundColor: "#6bc7ff", borderColor: "#6bc7ff" } : { backgroundColor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.1)" }
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: wateredToday ? "#07120b" : "#ffffff" }}>
            {wateredToday ? t("glowPlant.done") : "Water"}
          </Text>
        </Pressable>
      </View>

      {/* ADD TO GARDEN */}
      {onAddToGarden ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isInGarden ? `${plant.name} is in your garden` : `Add ${plant.name} to your garden`}
          onPress={(e) => { e.stopPropagation?.(); onAddToGarden(); }}
          style={{ marginTop: 8, borderRadius: 14, paddingVertical: 11, alignItems: "center", borderWidth: 1, backgroundColor: isInGarden ? "rgba(92, 255, 137, 0.14)" : "rgba(92, 255, 137, 0.06)", borderColor: "rgba(92, 255, 137, 0.28)" }}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: "#8effab" }}>
            {isInGarden ? "🌿 In your garden" : "🌱 Add to garden"}
          </Text>
        </Pressable>
      ) : null}

      {/* SNOOZE (saved, unwatered plants only) */}
      {isSaved && !wateredToday && onSnooze ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSnoozed ? `${plant.name} snoozed until tomorrow` : `Snooze watering for ${plant.name} until tomorrow`}
          onPress={(e) => { e.stopPropagation?.(); if (!isSnoozed) onSnooze(); }}
          disabled={isSnoozed}
          style={{ marginTop: 8, borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1, backgroundColor: isSnoozed ? "rgba(255, 216, 107, 0.1)" : "rgba(255, 255, 255, 0.04)", borderColor: isSnoozed ? "rgba(255, 216, 107, 0.3)" : "rgba(255, 255, 255, 0.08)" }}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: isSnoozed ? "#ffd86b" : "#8fbf9d" }}>
            {isSnoozed ? t("glowPlant.snoozedUntilTomorrow") : t("glowPlant.snoozeUntilTomorrow")}
          </Text>
        </Pressable>
      ) : null}

     {/* LAST WATERED + STREAK */}
      <View style={{ marginTop: 10, alignItems: "center" }}>
        <Text style={{ color: "#8fbf9d", fontSize: 10, fontWeight: "700" }}>
          💧 {getLastWateredText(plant.name, wateredPlants, wateringHistory)}
        </Text>
        {(() => {
          const nw = getNextWaterInfo(plant.name, plant, wateringHistory, wateredPlants, weather);
          if (!nw || nw.urgency === "ok") return null;
          return (
            <Text style={{ color: nw.urgency === "due" ? "#6bc7ff" : "#8effab", fontSize: 10, fontWeight: "900", marginTop: 2 }}>
              🔮 {nw.label}
            </Text>
          );
        })()}
        {getWateringStreak(plant.name, wateringHistory) >= 2 ? (
          <Text style={{ color: "#ff9f43", fontSize: 10, fontWeight: "900", marginTop: 2 }}>
            🔥 {getWateringStreak(plant.name, wateringHistory)} {t("glowPlant.wateringStreak")}
          </Text>
        ) : null}
        {getStreakDaysLeft(plant.name, wateringHistory) ? (
          <Text style={{ color: "#ffd86b", fontSize: 10, fontWeight: "900", marginTop: 2 }}>
            ⏳ {getStreakDaysLeft(plant.name, wateringHistory)} day{getStreakDaysLeft(plant.name, wateringHistory) === 1 ? "" : "s"} {t("glowPlant.leftToKeepYourStreak")}
          </Text>
        ) : null}
      </View>

      {/* VIEW DETAILS */}
      <View style={{ marginTop: 6, alignItems: "center" }}>
        <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900" }}>{t("glowPlant.tapForFullCareGuide")}</Text>
      </View>

    </Pressable>
  );
})
