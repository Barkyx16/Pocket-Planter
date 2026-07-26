import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { getPlantDifficulty, getSeasonForMonth, getSuggestionsForMonth, normalizeType, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

export const SeasonTransitionCard = memo(function SeasonTransitionCard({ theme, zone, onOpenPlant, onBrowse }) {
  const { t } = useTranslation();
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const currentMonth = now.getMonth() + 1;
  const currentSeason = getSeasonForMonth(currentMonth);

  // Find the first day of the next season and how far out it is.
  const SEASON_STARTS = { spring: 3, summer: 6, fall: 9, winter: 12 };
  const nextSeasonName =
    currentSeason.key === "spring" ? "summer"
    : currentSeason.key === "summer" ? "fall"
    : currentSeason.key === "fall" ? "winter"
    : "spring";
  const nextStartMonth = SEASON_STARTS[nextSeasonName];

  // Build a date for the next season's start (roll to next year if needed).
  let nextStart = new Date(now.getFullYear(), nextStartMonth - 1, 1, 12, 0, 0, 0);
  if (nextStart <= now) nextStart = new Date(now.getFullYear() + 1, nextStartMonth - 1, 1, 12, 0, 0, 0);
  const daysUntilNext = Math.round((nextStart - now) / (1000 * 60 * 60 * 24));

  // Only show when we're inside the ~3-week run-up to the season change.
  if (daysUntilNext > 21 || daysUntilNext < 0) return null;
  if (!zone) return null;

  const seasonLabel = { spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter" }[nextSeasonName];
  const seasonEmoji = { spring: "🌱", summer: "☀️", fall: "🍂", winter: "❄️" }[nextSeasonName];

  // What to plant as the next season opens — pull zone-matched picks for that month.
  const picks = getSuggestionsForMonth(zone, nextStartMonth).slice(0, 4);

  return (
    <View style={{ borderRadius: 24, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(255, 159, 67, 0.1)", borderColor: "#ff9f43" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>{seasonEmoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>{t("seasonTransition.seasonChangeAhead")}</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {seasonLabel} {t("seasonTransition.startsIn")} {daysUntilNext} day{daysUntilNext === 1 ? "" : "s"}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {currentSeason.label} {t("seasonTransition.isWindingDownGetA")} {seasonLabel.toLowerCase()} {t("seasonTransition.heresWhatDoesWellIn")} {zone} {t("seasonTransition.asItOpens")}
      </Text>

      {picks.length ? (
        <View style={{ gap: 10, marginTop: 14 }}>
          {picks.map((item) => {
            const img = resolvePlantImageSource(item);
            const diff = getPlantDifficulty(item);
            return (
              <Pressable
                key={`season-${item.name}`}
                onPress={() => onOpenPlant(item)}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(255, 159, 67, 0.2)" }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{item.name}</Text>
                  <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                    {diff.icon} {diff.text} · {normalizeType(item.type, item.name)}
                  </Text>
                </View>
                <Text style={{ color: "#ff9f43", fontSize: 20, fontWeight: "900" }}>›</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 20, marginTop: 14 }}>
          {t("seasonTransition.noStandout")} {seasonLabel.toLowerCase()} {t("seasonTransition.picksMatchedToZone")} {zone} {t("seasonTransition.yetBrowseAllPlantsTo")}
        </Text>
      )}

      {onBrowse ? (
        <Pressable onPress={onBrowse} style={{ marginTop: 14, backgroundColor: "#ff9f43", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
          <Text style={{ color: "#3d2c00", fontWeight: "900", fontSize: 14 }}>{t("seasonTransition.planMy")} {seasonLabel.toLowerCase()} {t("seasonTransition.garden")}</Text>
        </Pressable>
      ) : null}
    </View>
  );
})
