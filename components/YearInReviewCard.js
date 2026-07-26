import { memo } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { estimateHarvestValue, tapHaptic } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const YearInReviewCard = memo(function YearInReviewCard({ theme, savedPlants, harvestLog, journalEntries, wateringHistory, streakData, gardenXP }) {
  const { t } = useTranslation();
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
    { icon: "🌱", value: savedPlants.length, label: "Plants Grown" },
    { icon: "💧", value: wateringsYr, label: "Waterings" },
    { icon: "📸", value: photosYr, label: "Photos" },
    { icon: "🎉", value: harvestsYr, label: "Harvests" },
    { icon: "🔥", value: streakData?.count || 0, label: "Day Streak" },
    { icon: "⭐", value: `Lvl ${gardenXP.level}`, label: gardenXP.title },
  ];

  const shareReview = async () => {
    try {
      tapHaptic("light");
      const lines = [
        `🌿 My Pocket Planter year in review:`,
        "",
        `🌱 ${savedPlants.length} plants grown`,
        wateringsYr > 0 ? `💧 ${wateringsYr} waterings` : null,
        photosYr > 0 ? `📸 ${photosYr} garden photos` : null,
        harvestsYr > 0 ? `🎉 ${harvestsYr} harvests` : null,
        harvestValue.total > 0 ? `💰 ~$${harvestValue.total} of produce grown` : null,
        (streakData?.count || 0) > 0 ? `🔥 ${streakData.count}-day streak` : null,
        `⭐ Level ${gardenXP.level} — ${gardenXP.title}`,
        "",
        "What a year in the garden 🌻",
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
