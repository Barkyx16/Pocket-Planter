import { Pressable, Share, Text, View } from "react-native";
import { estimateHarvestValue, tapHaptic } from "../core";

export function GardenStoryCard({ theme, savedPlants, harvestLog, journalEntries, wateringHistory, streakData, gardenXP, gardenAreas }) {
  const totalWaterings = Object.values(wateringHistory || {}).reduce(
    (sum, dates) => sum + (Array.isArray(dates) ? dates.length : 0),
    0
  );
  const totalHarvests = (harvestLog || []).length;
  const areaCount = (gardenAreas || []).length;
  const mvpPlant = (() => {
    if (!harvestLog || !harvestLog.length) return null;
    const counts = {};
    harvestLog.forEach((h) => { counts[h.plantName] = (counts[h.plantName] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : null;
  })();
  const harvestValue = estimateHarvestValue(harvestLog);

  const stats = [
    { icon: "🌱", value: savedPlants.length, label: "Plants Grown" },
    { icon: "🎉", value: totalHarvests, label: "Harvests" },
    { icon: "💧", value: totalWaterings, label: "Waterings" },
    { icon: "📸", value: journalEntries.length, label: "Photos" },
    { icon: "🔥", value: streakData?.count || 0, label: "Day Streak" },
    { icon: "⭐", value: `Lvl ${gardenXP.level}`, label: gardenXP.title },
  ];

  const shareStory = async () => {
    try {
      tapHaptic("light");
      const lines = [
        "🌱 My Pocket Planter Garden Story:",
        "",
        `🪴 ${savedPlants.length} plants grown`,
        totalHarvests > 0 ? `🎉 ${totalHarvests} harvests logged` : null,
        harvestValue.total > 0 ? `💰 ~$${harvestValue.total} of produce grown` : null,
        `💧 ${totalWaterings} waterings`,
        journalEntries.length > 0 ? `📸 ${journalEntries.length} garden photos` : null,
        (streakData?.count || 0) > 0 ? `🔥 ${streakData.count}-day streak` : null,
        mvpPlant ? `🏆 MVP plant: ${mvpPlant}` : null,
        `⭐ Level ${gardenXP.level} — ${gardenXP.title}`,
        "",
        "Growing smarter with Pocket Planter 🌿",
      ].filter(Boolean);
      await Share.share({ message: lines.join("\n") });
    } catch (error) {
      console.log("Share story skipped:", error);
    }
  };

return (
    <View>

      {mvpPlant ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(255,216,107,0.10)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(255,216,107,0.28)", flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 32 }}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>YOUR MVP PLANT</Text>
            <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", marginTop: 2 }}>{mvpPlant}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>Your most-harvested plant</Text>
          </View>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
        {stats.map((s) => (
          <View key={s.label} style={{ width: "47%", borderRadius: 20, padding: 16, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(142,255,171,0.16)", alignItems: "center" }}>
            <Text style={{ fontSize: 26 }}>{s.icon}</Text>
            <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{s.value}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 3, textAlign: "center" }}>{s.label}</Text>
          </View>
        ))}
      </View>

      {areaCount > 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 14, textAlign: "center" }}>
          🗂️ Growing across {areaCount} garden area{areaCount === 1 ? "" : "s"}
        </Text>
      ) : null}

      <Pressable onPress={shareStory} style={{ marginTop: 16, backgroundColor: "#5cff89", borderRadius: 18, paddingVertical: 15, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 15 }}>📤 Share My Garden Story</Text>
      </Pressable>
    </View>
  );
}
