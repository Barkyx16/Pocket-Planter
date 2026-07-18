import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { RARITY_STYLES, getHarvestCountdown, getLastWateredText, getNextWaterInfo, getPlantDifficulty, getRarity, getStreakDaysLeft, getTodayKey, getWateringStreak, normalizeType, resolvePlantImageSource } from "../core";

export function GlowPlantCard({ plant, weather, zone, theme, isSaved, isCompared, isFollowed, isSnoozed, wateredDate, wateredPlants, wateringHistory, onOpen, onSave, onCompare, onFollow, onWater, onSnooze }) {
  const imageSource = resolvePlantImageSource(plant);
  const rarity = RARITY_STYLES[getRarity(plant)];
  const wateredToday = wateredDate === getTodayKey();
  const difficulty = getPlantDifficulty(plant);

  return (
    <Pressable onPress={onOpen} style={[styles.glowPlantCard, { backgroundColor: theme.card, borderColor: "rgba(92,255,137,0.18)" }]}>

      {/* TOP ROW */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <View style={{ width: 80, height: 80, borderRadius: 18, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          {imageSource
            ? <Image source={imageSource} style={{ width: 70, height: 70 }} resizeMode="contain" />
            : <Text style={{ fontSize: 36 }}>🌱</Text>
          }
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text numberOfLines={1} style={{ color: theme.text, fontSize: 20, fontWeight: "900", flex: 1 }}>{plant.name}</Text>
            <View style={{ backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 6 }}>
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>{rarity.emoji}</Text>
            </View>
          </View>
          <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 4 }}>
            {normalizeType(plant.type, plant.name)} • Zones {plant.minZone}–{plant.maxZone}
          </Text>
          <View style={{ flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <View style={{ backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}>
              <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900" }}>{difficulty.icon} {difficulty.label}</Text>
            </View>
            <View style={{ backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: "#d7ebdc", fontSize: 11, fontWeight: "800" }}>🚜 {getHarvestCountdown(plant)}</Text>
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
            isSaved ? { backgroundColor: "#5cff89", borderColor: "#5cff89" } : { backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.10)" }
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: isSaved ? "#07120b" : "#ffffff" }}>
            {isSaved ? "✓ Saved" : "Save"}
          </Text>
        </Pressable>

        <Pressable
          onPress={(e) => { e.stopPropagation?.(); onCompare(); }}
          style={[{ flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
            isCompared ? { backgroundColor: "#ffd86b", borderColor: "#ffd86b" } : { backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.10)" }
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: isCompared ? "#07120b" : "#ffffff" }}>
            {isCompared ? "⚔️ On" : "Compare"}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={wateredToday ? `Undo watering for ${plant.name}` : `Mark ${plant.name} as watered today`}
          onPress={(e) => { e.stopPropagation?.(); onWater(); }}
          style={[{ flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
            wateredToday ? { backgroundColor: "#6bc7ff", borderColor: "#6bc7ff" } : { backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.10)" }
          ]}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: wateredToday ? "#07120b" : "#ffffff" }}>
            {wateredToday ? "💧 Done" : "Water"}
          </Text>
        </Pressable>
      </View>

      {/* SNOOZE (saved, unwatered plants only) */}
      {isSaved && !wateredToday && onSnooze ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSnoozed ? `${plant.name} snoozed until tomorrow` : `Snooze watering for ${plant.name} until tomorrow`}
          onPress={(e) => { e.stopPropagation?.(); if (!isSnoozed) onSnooze(); }}
          disabled={isSnoozed}
          style={{ marginTop: 8, borderRadius: 14, paddingVertical: 10, alignItems: "center", borderWidth: 1, backgroundColor: isSnoozed ? "rgba(255,216,107,0.10)" : "rgba(255,255,255,0.04)", borderColor: isSnoozed ? "rgba(255,216,107,0.28)" : "rgba(255,255,255,0.08)" }}
        >
          <Text style={{ fontSize: 12, fontWeight: "900", color: isSnoozed ? "#ffd86b" : "#8fbf9d" }}>
            {isSnoozed ? "😴 Snoozed until tomorrow" : "😴 Snooze until tomorrow"}
          </Text>
        </Pressable>
      ) : null}

     {/* LAST WATERED + STREAK */}
      <View style={{ marginTop: 10, alignItems: "center" }}>
        <Text style={{ color: "#8fbf9d", fontSize: 11, fontWeight: "700" }}>
          💧 {getLastWateredText(plant.name, wateredPlants, wateringHistory)}
        </Text>
        {(() => {
          const nw = getNextWaterInfo(plant.name, plant, wateringHistory, wateredPlants, weather);
          if (!nw || nw.urgency === "ok") return null;
          return (
            <Text style={{ color: nw.urgency === "due" ? "#6bc7ff" : "#8effab", fontSize: 11, fontWeight: "900", marginTop: 2 }}>
              🔮 {nw.label}
            </Text>
          );
        })()}
        {getWateringStreak(plant.name, wateringHistory) >= 2 ? (
          <Text style={{ color: "#ff9f43", fontSize: 11, fontWeight: "900", marginTop: 2 }}>
            🔥 {getWateringStreak(plant.name, wateringHistory)} watering streak
          </Text>
        ) : null}
        {getStreakDaysLeft(plant.name, wateringHistory) ? (
          <Text style={{ color: "#ffd86b", fontSize: 11, fontWeight: "900", marginTop: 2 }}>
            ⏳ {getStreakDaysLeft(plant.name, wateringHistory)} day{getStreakDaysLeft(plant.name, wateringHistory) === 1 ? "" : "s"} left to keep your streak
          </Text>
        ) : null}
      </View>

      {/* VIEW DETAILS */}
      <View style={{ marginTop: 6, alignItems: "center" }}>
        <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900" }}>Tap for full care guide →</Text>
      </View>

    </Pressable>
  );
}
