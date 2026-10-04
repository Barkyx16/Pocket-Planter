import { memo } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { estimateHarvestValue, tapHaptic } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const YearInReviewCard = memo(function YearInReviewCard({ theme, savedPlants, harvestLog, journalEntries, wateringHistory, streakData, gardenXP }) {
  const { t, tn, levelTitle } = useTranslation();
  const now = new Date();
  const yearAgo = new Date(now); yearAgo.setFullYear(now.getFullYear() - 1);
  const inLastYear = (dateStr) => {
    const d = new Date(dateStr);
    return !Number.isNaN(d.getTime()) && d >= yearAgo && d <= now;
  };

  const harvestsYr = (harvestLog || []).filter((h) => inLastYear(h.createdAt)).length;
  const photosYr = (journalEntries || []).filter((e) => inLastYear(e.createdAt)).length;
  const wateringsYr = Object.values(wateringHistory || {}).reduce((sum, dates) => {
    if (!Array.isArray(dates)) return sum;
    return sum + dates.filter((d) => inLastYear(`${String(d).slice(0, 10)}T12:00:00`)).length;
  }, 0);

  const harvestValue = estimateHarvestValue(
    (harvestLog || []).filter((h) => inLastYear(h.createdAt))
  );

  const hasActivity = harvestsYr + photosYr + wateringsYr > 0 || savedPlants.length > 0;
  if (!hasActivity) return null;

  const stats = [
    { icon: "🌱", value: savedPlants.length, label: t("shareText.statPlantsGrown") },
    { icon: "💧", value: wateringsYr, label: t("shareText.statWaterings") },
    { icon: "📸", value: photosYr, label: t("shareText.statPhotos") },
    { icon: "🎉", value: harvestsYr, label: t("shareText.statHarvests") },
    { icon: "🔥", value: streakData?.count || 0, label: t("shareText.statDayStreak") },
    { icon: "⭐", value: t("levelText.lvl", { level: gardenXP.level }), label: levelTitle(gardenXP) },
  ];

  const shareReview = async () => {
    try {
      tapHaptic("light");
      const lines = [
        `🌿 ${t("shareText.yearHeader")}`,
        "",
        `🌱 ${tn("shareText.plantsGrown", savedPlants.length)}`,
        wateringsYr > 0 ? `💧 ${tn("shareText.waterings", wateringsYr)}` : null,
        photosYr > 0 ? `📸 ${tn("shareText.gardenPhotos", photosYr)}` : null,
        harvestsYr > 0 ? `🎉 ${tn("shareText.harvests", harvestsYr)}` : null,
        harvestValue.total > 0 ? `💰 ${t("shareText.produceValue", { amount: `~$${harvestValue.total}` })}` : null,
        (streakData?.count || 0) > 0 ? `🔥 ${tn("shareText.dayStreak", streakData.count)}` : null,
        t("levelText.shareLine", { level: gardenXP.level, title: levelTitle(gardenXP) }),
        "",
        `${t("shareText.yearFooter")} 🌻`,
      ].filter(Boolean);
      await Share.share({ message: lines.join("\n") });
    } catch (e) {
      console.log("Year review share skipped:", e);
    }
  };

return (
    <View>

      {harvestValue.total > 0 ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(255, 216, 107, 0.1)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255, 216, 107, 0.3)", flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 32 }}>💰</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>{t("yearInReview.grownThisYear")}</Text>
            <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 2 }}>~${harvestValue.total}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{t("yearInReview.estimatedValueOfYourHarvests")}</Text>
          </View>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
        {stats.map((s) => (
          <View key={s.label} style={{ width: "47%", borderRadius: 16, padding: 16, backgroundColor: "rgba(255, 255, 255, 0.08)", borderWidth: 1, borderColor: "rgba(255, 216, 107, 0.16)", alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>{s.icon}</Text>
            <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{s.value}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 4, textAlign: "center" }}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={shareReview} style={{ marginTop: 16, backgroundColor: "#ffd86b", borderRadius: 16, paddingVertical: 16, alignItems: "center" }}>
        <IconText label={t("yearInReview.shareMyYearInReview")} style={{
  color: "#3d2c00",
  fontWeight: "900",
  fontSize: 14
}} />
      </Pressable>
    </View>
  );
})
