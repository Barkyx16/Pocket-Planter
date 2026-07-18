import { Text, View } from "react-native";
import { styles } from "../styles";

export function WeeklyWateringGrid({ theme, savedPlants, wateringHistory }) {
  if (!savedPlants || savedPlants.length === 0) return null;

  // Build the last 7 days (oldest → today)
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      isToday: i === 0,
    });
  }

  const wateredOn = (plantName, dayKey) => {
    const history = wateringHistory?.[plantName];
    if (!Array.isArray(history)) return false;
    return history.some((d) => String(d).slice(0, 10) === dayKey);
  };

  // Per-day totals across all saved plants
  const dayTotals = days.map((day) =>
    savedPlants.reduce((sum, name) => sum + (wateredOn(name, day.key) ? 1 : 0), 0)
  );
  const weekTotal = dayTotals.reduce((a, b) => a + b, 0);
  const activeDays = dayTotals.filter((n) => n > 0).length;

  // Show up to 6 plants as rows to keep it compact
  const rows = savedPlants.slice(0, 6);

return (
    <View>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {weekTotal > 0
          ? `${weekTotal} watering${weekTotal === 1 ? "" : "s"} across ${activeDays} day${activeDays === 1 ? "" : "s"} this week.`
          : "No waterings logged this week yet — tap a plant to get started."}
      </Text>

      {/* Day header */}
      <View style={{ flexDirection: "row", marginTop: 16, marginBottom: 6 }}>
        <View style={{ width: 90 }} />
        {days.map((day) => (
          <View key={`hdr-${day.key}`} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: day.isToday ? "#6bc7ff" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>
              {day.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Plant rows */}
      <View style={{ gap: 6 }}>
        {rows.map((name) => (
          <View key={`row-${name}`} style={{ flexDirection: "row", alignItems: "center" }}>
            <Text numberOfLines={1} style={{ width: 90, color: theme.text, fontSize: 12, fontWeight: "800", paddingRight: 6 }}>
              {name}
            </Text>
            {days.map((day) => {
              const on = wateredOn(name, day.key);
              return (
                <View key={`${name}-${day.key}`} style={{ flex: 1, alignItems: "center" }}>
                  <View style={{
                    width: 22, height: 22, borderRadius: 7,
                    backgroundColor: on ? "#6bc7ff" : "rgba(255,255,255,0.06)",
                    borderWidth: 1,
                    borderColor: on ? "#6bc7ff" : day.isToday ? "rgba(107,199,255,0.35)" : "rgba(255,255,255,0.08)",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    {on ? <Text style={{ fontSize: 11 }}>💧</Text> : null}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {savedPlants.length > 6 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 10, textAlign: "center" }}>
          Showing 6 of {savedPlants.length} saved plants
        </Text>
      ) : null}
    </View>
  );
}
