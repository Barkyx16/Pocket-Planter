import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { getPlantDifficulty, getSeasonForMonth, getSuggestionsForMonth, normalizeType, resolvePlantImageSource } from "../core";

export const SeasonTransitionCard = memo(function SeasonTransitionCard({ theme, zone, onOpenPlant, onBrowse }) {
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
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(255,159,67,0.10)", borderColor: "#ff9f43" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>{seasonEmoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>SEASON CHANGE AHEAD</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {seasonLabel} starts in {daysUntilNext} day{daysUntilNext === 1 ? "" : "s"}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {currentSeason.label} is winding down. Get a head start on {seasonLabel.toLowerCase()} — here's what does well in Zone {zone} as it opens.
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
                style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(255,159,67,0.22)" }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{item.name}</Text>
                  <Text style={{ color: "#ffd8a3", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                    {diff.icon} {diff.text} · {normalizeType(item.type, item.name)}
                  </Text>
                </View>
                <Text style={{ color: "#ff9f43", fontSize: 20, fontWeight: "900" }}>›</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 20, marginTop: 14 }}>
          No standout {seasonLabel.toLowerCase()} picks matched to Zone {zone} yet — browse all plants to plan ahead.
        </Text>
      )}

      {onBrowse ? (
        <Pressable onPress={onBrowse} style={{ marginTop: 14, backgroundColor: "#ff9f43", borderRadius: 16, paddingVertical: 13, alignItems: "center" }}>
          <Text style={{ color: "#3d2600", fontWeight: "900", fontSize: 14 }}>Plan my {seasonLabel.toLowerCase()} garden 🌿</Text>
        </Pressable>
      ) : null}
    </View>
  );
})
