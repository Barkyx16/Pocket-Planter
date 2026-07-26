import { memo } from "react";
import { ScrollView, Text, View } from "react-native";
import { styles } from "../styles";
import { getDateKey } from "../core";
import { useTranslation } from "../lib/i18n";

export const WateringHeatmapCard = memo(function WateringHeatmapCard({ theme, wateringHistory }) {
  const { t } = useTranslation();
  const WEEKS = 15; // ~15 weeks of history

  // Flatten all watering dates into a count per day-key
  const counts = {};
  Object.values(wateringHistory || {}).forEach((dates) => {
    if (!Array.isArray(dates)) return;
    dates.forEach((d) => {
      const key = String(d).slice(0, 10);
      counts[key] = (counts[key] || 0) + 1;
    });
  });

  const totalWaterings = Object.values(counts).reduce((a, b) => a + b, 0);
  if (totalWaterings === 0) return null;

  // Build a grid: columns = weeks, rows = days of week (Sun..Sat)
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  // Find the most recent Saturday (end of current week column)
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const columns = [];
  let maxCount = 1;
  for (let w = WEEKS - 1; w >= 0; w -= 1) {
    const col = [];
    for (let dow = 0; dow < 7; dow += 1) {
      const cell = new Date(end);
      cell.setDate(end.getDate() - w * 7 - (6 - dow));
      const key = getDateKey(cell);
      const count = cell > today ? -1 : (counts[key] || 0); // -1 = future, hide
      if (count > maxCount) maxCount = count;
      col.push({ key, count, isToday: key === getDateKey(today) });
    }
    columns.push(col);
  }

  const cellColor = (count) => {
    if (count < 0) return "transparent";
    if (count === 0) return "rgba(255, 255, 255, 0.06)";
    const ratio = count / maxCount;
    if (ratio > 0.66) return "#2fbf5f";
    if (ratio > 0.33) return "#5cff89";
    return "rgba(92, 255, 137, 0.4)";
  };

  const activeDays = Object.keys(counts).length;

  // ── Useful stats derived from the same data ──
  const DOW_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dowCounts = [0, 0, 0, 0, 0, 0, 0];
  Object.entries(counts).forEach(([key, n]) => {
    const d = new Date(`${key}T12:00:00`);
    if (!Number.isNaN(d.getTime())) dowCounts[d.getDay()] += n;
  });
  const topDow = Math.max(...dowCounts);
  const busiestDay = topDow > 0 ? DOW_NAMES[dowCounts.indexOf(topDow)] : "—";

  // Waterings in the last 7 days.
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 6);
  let thisWeek = 0;
  Object.entries(counts).forEach(([key, n]) => {
    const d = new Date(`${key}T12:00:00`);
    if (d >= weekAgo && d <= today) thisWeek += n;
  });

  // Longest run of consecutive days with at least one watering.
  const sortedKeys = Object.keys(counts).sort();
  let longestStreak = 0, run = 0, prev = null;
  sortedKeys.forEach((key) => {
    const d = new Date(`${key}T12:00:00`);
    run = prev && (d - prev) === 86400000 ? run + 1 : 1;
    if (run > longestStreak) longestStreak = run;
    prev = d;
  });

  const stats = [
    { value: String(thisWeek), label: "This week", color: "#5cff89" },
    { value: busiestDay, label: "Top day", color: "#6bc7ff" },
    { value: `${longestStreak}d`, label: "Best streak", color: "#ffd86b" },
  ];

return (
    <View>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {totalWaterings} watering{totalWaterings === 1 ? "" : "s"} across {activeDays} day{activeDays === 1 ? "" : "s"}{t("wateringHeatmap.eachSquareIsADay")}
      </Text>

      {/* STATS ROW */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
        {stats.map((s) => (
          <View key={s.label} style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
            <Text style={{ color: s.color, fontSize: 18, fontWeight: "900" }}>{s.value}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 4 }}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* GRID with weekday labels */}
      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <View style={{ gap: 4, marginRight: 6 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <Text key={i} style={{ width: 12, height: 15, lineHeight: 15, fontSize: 8, fontWeight: "800", color: theme.secondaryText, opacity: i % 2 === 1 ? 1 : 0 }}>{d}</Text>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 4 }}>
            {columns.map((col, ci) => (
              <View key={`col-${ci}`} style={{ gap: 4 }}>
                {col.map((cell) => (
                  <View
                    key={cell.key}
                    style={{
                      width: 15, height: 15, borderRadius: 4,
                      backgroundColor: cellColor(cell.count),
                      borderWidth: cell.isToday ? 1.5 : 0,
                      borderColor: "#ffffff",
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Legend */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, justifyContent: "flex-end" }}>
        <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700" }}>Less</Text>
        {["rgba(255, 255, 255, 0.06)", "rgba(92, 255, 137, 0.4)", "#5cff89", "#2fbf5f"].map((c) => (
          <View key={c} style={{ width: 13, height: 13, borderRadius: 4, backgroundColor: c }} />
        ))}
        <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700" }}>More</Text>
      </View>
    </View>
  );
})
