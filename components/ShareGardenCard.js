import { memo, useRef } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { tapHaptic } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const ShareGardenCard = memo(function ShareGardenCard({ theme, gardenXP, savedPlants, harvestLog, journalEntries, streakData, gardenAreas }) {
  const { t, tn, levelTitle } = useTranslation();
  const shareRef = useRef(null);
  const plotCount = (gardenAreas || []).reduce((sum, a) => sum + Object.values(a.plots || {}).filter(Boolean).length, 0);
  const harvests = (harvestLog || []).length;
  const photos = (journalEntries || []).length;
  const streak = streakData?.count || 0;

  const shareText = async () => {
    try {
      const lines = [
        `🌱 ${t("shareText.reportHeader")}`,
        "",
        t("levelText.shareLine", { level: gardenXP.level, title: levelTitle(gardenXP) }),
        `🪴 ${tn("shareText.plantsGrowing", savedPlants.length)}`,
        plotCount > 0 ? `🗺️ ${tn("shareText.plotsPlanted", plotCount)}` : null,
        harvests > 0 ? `🚜 ${tn("shareText.harvestsLogged", harvests)}` : null,
        photos > 0 ? `📸 ${tn("shareText.gardenPhotos", photos)}` : null,
        streak > 0 ? `🔥 ${tn("shareText.careStreak", streak)}` : null,
        "",
        `${t("shareText.footer")} 🌿`,
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
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: t("shareText.dialogTitle") });
      } else {
        await Share.share({ url: uri });
      }
    } catch (e) {
      console.log("Image share unavailable, using text:", e?.message);
      shareText();
    }
  };

  const stats = [
    { value: t("levelText.lvShort", { level: gardenXP.level }), label: t("levelText.level"), color: "#5cff89" },
    { value: savedPlants.length, label: t("shareText.statPlants"), color: "#8effab" },
    { value: harvests, label: t("shareText.statHarvests"), color: "#ffd86b" },
    { value: t("shareText.daysShort", { count: streak }), label: t("shareText.statStreak"), color: "#ff9f43" },
  ];
  const extras = [
    plotCount > 0 ? `🗺️ ${tn("shareText.plotsPlanted", plotCount)}` : null,
    photos > 0 ? `📸 ${tn("shareText.gardenPhotos", photos)}` : null,
  ].filter(Boolean);

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("shareGarden.showOffYourGardenShare")}
      </Text>

      {/* Captured as the share image — fixed dark palette so it always looks good. */}
      <View ref={shareRef} collapsable={false} style={{ marginTop: 14, backgroundColor: "#0e2414", borderRadius: 24, padding: 18, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)", overflow: "hidden" }}>
        <IconText label={t("shareGarden.myPocketPlanterGarden")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  textAlign: "center"
}} />
        <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", textAlign: "center", marginTop: 6 }}>
          {t("levelText.rank", { level: gardenXP.level, title: levelTitle(gardenXP) })}
        </Text>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
          {stats.map((s) => (
            <View key={s.label} style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <Text style={{ color: s.color, fontSize: 18, fontWeight: "900" }}>{s.value}</Text>
              <Text style={{ color: "#8fbf9d", fontSize: 10, fontWeight: "800", marginTop: 4 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {extras.length ? (
          <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", textAlign: "center", marginTop: 12 }}>
            {extras.join("   ·   ")}
          </Text>
        ) : null}

        <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "800", textAlign: "center", marginTop: 12 }}>
          {t("shareGarden.growingSmarterWithPocketPlanter")}
        </Text>
      </View>

      <Pressable onPress={shareGarden} style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}>
        <IconText label={t("shareGarden.shareMyGarden")} style={{
  color: "#07120b",
  fontSize: 14,
  fontWeight: "900"
}} />
      </Pressable>
    </View>
  );
})
