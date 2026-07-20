import { memo, useRef } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { estimateHarvestValue, tapHaptic } from "../core";

export const GardenStoryCard = memo(function GardenStoryCard({ theme, savedPlants, harvestLog, journalEntries, wateringHistory, streakData, gardenXP, gardenAreas }) {
  const shareRef = useRef(null);
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

  const shareImage = async () => {
    tapHaptic("light");
    try {
      // Native modules — resolved by Metro, but the native side needs the dev client
      // rebuilt. Until then this throws and we fall back to the text share below.
      const { captureRef } = require("react-native-view-shot");
      const Sharing = require("expo-sharing");
      const uri = await captureRef(shareRef, { format: "png", quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Share your garden" });
      } else {
        await Share.share({ url: uri });
      }
    } catch (e) {
      console.log("Image share unavailable, using text:", e?.message);
      shareStory();
    }
  };

  return (
    <View>
      {/* Captured as the share image — fixed dark palette so it always looks good. */}
      <View ref={shareRef} collapsable={false} style={{ backgroundColor: "#0d1f14", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "rgba(142,255,171,0.18)" }}>
        <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900", letterSpacing: 0.6, textAlign: "center" }}>
          🌱 MY POCKET PLANTER GARDEN
        </Text>

        {mvpPlant ? (
          <View style={{ marginTop: 14, backgroundColor: "rgba(255,216,107,0.10)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(255,216,107,0.28)", flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={{ fontSize: 32 }}>🏆</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>YOUR MVP PLANT</Text>
              <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", marginTop: 2 }}>{mvpPlant}</Text>
              <Text style={{ color: "#a9c7b3", fontSize: 12, fontWeight: "700", marginTop: 2 }}>Your most-harvested plant</Text>
            </View>
          </View>
        ) : null}

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
          {stats.map((s) => (
            <View key={s.label} style={{ width: "47%", borderRadius: 20, padding: 16, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(142,255,171,0.16)", alignItems: "center" }}>
              <Text style={{ fontSize: 26 }}>{s.icon}</Text>
              <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{s.value}</Text>
              <Text style={{ color: "#a9c7b3", fontSize: 12, fontWeight: "800", marginTop: 3, textAlign: "center" }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {areaCount > 0 ? (
          <Text style={{ color: "#a9c7b3", fontSize: 13, fontWeight: "700", marginTop: 14, textAlign: "center" }}>
            🗂️ Growing across {areaCount} garden area{areaCount === 1 ? "" : "s"}
          </Text>
        ) : null}

        <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "800", marginTop: 14, textAlign: "center" }}>
          Growing smarter with Pocket Planter 🌿
        </Text>
      </View>

      <Pressable onPress={shareImage} style={{ marginTop: 16, backgroundColor: "#5cff89", borderRadius: 18, paddingVertical: 15, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 15 }}>📸 Share as Image</Text>
      </Pressable>
      <Pressable onPress={shareStory} style={{ marginTop: 10, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, paddingVertical: 13, alignItems: "center", borderWidth: 1, borderColor: "rgba(142,255,171,0.20)" }}>
        <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>📤 Share as Text</Text>
      </Pressable>
    </View>
  );
})
