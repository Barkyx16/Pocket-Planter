import { ScrollView, Text, View } from "react-native";
import { styles } from "../styles";

export function WateringHeatmapCard({ theme, wateringHistory }) {
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
      const key = cell.toISOString().slice(0, 10);
      const count = cell > today ? -1 : (counts[key] || 0); // -1 = future, hide
      if (count > maxCount) maxCount = count;
      col.push({ key, count, isToday: key === today.toISOString().slice(0, 10) });
    }
    columns.push(col);
  }

  const cellColor = (count) => {
    if (count < 0) return "transparent";
    if (count === 0) return "rgba(255,255,255,0.06)";
    const ratio = count / maxCount;
    if (ratio > 0.66) return "#2fbf6b";
    if (ratio > 0.33) return "#5cff89";
    return "rgba(92,255,137,0.4)";
  };

  const activeDays = Object.keys(counts).length;

return (
    <View>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {totalWaterings} watering{totalWaterings === 1 ? "" : "s"} across {activeDays} day{activeDays === 1 ? "" : "s"}. Each square is a day — greener means more.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
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

      {/* Legend */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, justifyContent: "flex-end" }}>
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700" }}>Less</Text>
        {["rgba(255,255,255,0.06)", "rgba(92,255,137,0.4)", "#5cff89", "#2fbf6b"].map((c) => (
          <View key={c} style={{ width: 13, height: 13, borderRadius: 4, backgroundColor: c }} />
        ))}
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700" }}>More</Text>
      </View>
    </View>
  );
}
