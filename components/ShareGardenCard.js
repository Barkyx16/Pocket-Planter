import { memo, useRef } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { tapHaptic } from "../core";

export const ShareGardenCard = memo(function ShareGardenCard({ theme, gardenXP, savedPlants, harvestLog, journalEntries, streakData, gardenAreas }) {
  const shareRef = useRef(null);
  const plotCount = (gardenAreas || []).reduce((sum, a) => sum + Object.values(a.plots || {}).filter(Boolean).length, 0);
  const harvests = (harvestLog || []).length;
  const photos = (journalEntries || []).length;
  const streak = streakData?.count || 0;

  const shareText = async () => {
    try {
      const lines = [
        "🌱 My Pocket Planter garden report card:",
        "",
        `⭐ Level ${gardenXP.level} — ${gardenXP.title}`,
        `🪴 ${savedPlants.length} plants growing`,
        plotCount > 0 ? `🗺️ ${plotCount} plots planted` : null,
        harvests > 0 ? `🚜 ${harvests} harvest${harvests === 1 ? "" : "s"} logged` : null,
        photos > 0 ? `📸 ${photos} garden photo${photos === 1 ? "" : "s"}` : null,
        streak > 0 ? `🔥 ${streak}-day care streak` : null,
        "",
        "Growing smarter with Pocket Planter 🌿",
      ].filter(Boolean);
      await Share.share({ message: lines.join("\n") });
    } catch (e) { /* share cancelled */ }
  };

  const shareGarden = async () => {
    tapHaptic("light");
    try {
      // Native modules — resolved by Metro but need the dev client rebuilt.
      // Until then this throws and we fall back to the text share.
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
      shareText();
    }
  };

  const stats = [
    { value: `Lv${gardenXP.level}`, label: "Level", color: "#5cff89" },
    { value: savedPlants.length, label: "Plants", color: "#8effab" },
    { value: harvests, label: "Harvests", color: "#ffd86b" },
    { value: `${streak}d`, label: "Streak", color: "#ff9f43" },
  ];
  const extras = [
    plotCount > 0 ? `🗺️ ${plotCount} plots planted` : null,
    photos > 0 ? `📸 ${photos} garden photos` : null,
  ].filter(Boolean);

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Show off your garden! Share this snapshot of your progress with friends.
      </Text>

      {/* Captured as the share image — fixed dark palette so it always looks good. */}
      <View ref={shareRef} collapsable={false} style={{ marginTop: 14, backgroundColor: "#0d1f14", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)", overflow: "hidden" }}>
        <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, textAlign: "center" }}>
          🌱 MY POCKET PLANTER GARDEN
        </Text>
        <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", textAlign: "center", marginTop: 6 }}>
          Level {gardenXP.level} · {gardenXP.title}
        </Text>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
          {stats.map((s) => (
            <View key={s.label} style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
              <Text style={{ color: s.color, fontSize: 18, fontWeight: "900" }}>{s.value}</Text>
              <Text style={{ color: "#a9c7b3", fontSize: 10, fontWeight: "800", marginTop: 3 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {extras.length ? (
          <Text style={{ color: "#a9c7b3", fontSize: 12, fontWeight: "700", textAlign: "center", marginTop: 12 }}>
            {extras.join("   ·   ")}
          </Text>
        ) : null}

        <Text style={{ color: "#5cff89", fontSize: 11.5, fontWeight: "800", textAlign: "center", marginTop: 12 }}>
          Growing smarter with Pocket Planter 🌿
        </Text>
      </View>

      <Pressable onPress={shareGarden} style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 14, paddingVertical: 14, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontSize: 14.5, fontWeight: "900" }}>📤 Share My Garden</Text>
      </Pressable>
    </View>
  );
})
