import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { formatTemp, getDateKey, getSeedStartInfo, getTodayKey, getUpcomingFrost } from "../core";

export const TodaysGamePlanCard = memo(function TodaysGamePlanCard({ theme, savedPlants, wateredPlants, wateringHistory, harvestTrackers, weather, zone, compatiblePlants, snoozedPlants, onOpenPlant, onScrollToWatering, unitSystem }) {
  const today = getTodayKey();
  const tomorrowKey = getDateKey(new Date(Date.now() + 86400000));
  const tasks = [];

  // 1. Plants needing water today (snoozed plants are skipped until tomorrow)
  const needWater = (savedPlants || []).filter(
    (name) => wateredPlants?.[name] !== today && snoozedPlants?.[name] !== tomorrowKey
  );
  if (needWater.length > 0) {
    tasks.push({
      icon: "💧",
      accent: "#6bc7ff",
      title: `Water ${needWater.length} plant${needWater.length === 1 ? "" : "s"}`,
      detail: needWater.slice(0, 3).join(", ") + (needWater.length > 3 ? `, +${needWater.length - 3} more` : ""),
      onPress: onScrollToWatering,
    });
  }

  // 2. Harvest-ready (within tracker window)
  const harvestReady = Object.entries(harvestTrackers || {})
    .map(([name, tracker]) => {
      const daysPassed = Math.floor((new Date() - new Date(tracker.startedAt)) / (1000 * 60 * 60 * 24));
      return { name, daysLeft: Math.max(0, (tracker.days || 0) - daysPassed) };
    })
    .filter((e) => e.daysLeft === 0);
  if (harvestReady.length > 0) {
    const first = produceData.find((p) => p.name === harvestReady[0].name);
    tasks.push({
      icon: "🎉",
      accent: "#ffd86b",
      title: `Harvest ${harvestReady.length} plant${harvestReady.length === 1 ? "" : "s"}`,
      detail: harvestReady.map((e) => e.name).slice(0, 3).join(", "),
      onPress: () => first && onOpenPlant(first),
    });
  }

  // 3. Frost tonight/soon
  const frost = weather?.upcomingFrost || (typeof getUpcomingFrost === "function" ? getUpcomingFrost(weather) : null);
  if (frost && frost.daysOut <= 1) {
    tasks.push({
      icon: "❄️",
      accent: "#a3d5ff",
      title: frost.daysOut === 0 ? "Frost tonight — protect plants" : "Frost tomorrow — prep now",
      detail: `Low of ${formatTemp(frost.minTempF, unitSystem, true)}. Cover tender plants and move containers.`,
      onPress: null,
    });
  }

  // 4. Seeds to start indoors now
  const seedsToStart = (compatiblePlants || [])
    .map((item) => ({ item, info: getSeedStartInfo(item, zone) }))
    .filter((e) => e.info && e.info.status === "start-now");
  if (seedsToStart.length > 0) {
    tasks.push({
      icon: "🌱",
      accent: "#8effab",
      title: `Start ${seedsToStart.length} seed${seedsToStart.length === 1 ? "" : "s"} indoors`,
      detail: seedsToStart.map((e) => e.item.name).slice(0, 3).join(", "),
      onPress: () => onOpenPlant(seedsToStart[0].item),
    });
  }

  const allDone = tasks.length === 0;
  // Only surface the game plan when there's actually something to do — hide it when
  // the garden is all caught up rather than showing an empty "you're all set" card.
  if (allDone) return null;

  return (
    <View style={{ borderRadius: 26, padding: 20, marginBottom: 18, borderWidth: 1.5, backgroundColor: allDone ? "rgba(92,255,137,0.10)" : "rgba(255,255,255,0.05)", borderColor: allDone ? "#5cff89" : "rgba(255,255,255,0.12)" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: allDone ? 0 : 6 }}>
        <Text style={{ fontSize: 24 }}>{allDone ? "✅" : "📋"}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: allDone ? "#5cff89" : "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>TODAY'S GAME PLAN</Text>
          <Text style={{ color: theme.text, fontSize: 19, fontWeight: "900", marginTop: 2 }}>
            {allDone ? "You're all caught up! 🌿" : `${tasks.length} thing${tasks.length === 1 ? "" : "s"} to do today`}
          </Text>
        </View>
      </View>

      {allDone ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 20, marginTop: 8 }}>
          Nothing urgent in the garden right now. Check back tomorrow, or browse new plants to grow.
        </Text>
      ) : (
        <View style={{ gap: 10, marginTop: 12 }}>
          {tasks.map((task, i) => (
            <Pressable
              key={`task-${i}`}
              onPress={task.onPress || undefined}
              disabled={!task.onPress}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${task.accent}30` }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${task.accent}1a`, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 20 }}>{task.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{task.title}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }} numberOfLines={1}>{task.detail}</Text>
              </View>
              {task.onPress ? <Text style={{ color: task.accent, fontSize: 20, fontWeight: "900" }}>›</Text> : null}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
})
