import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getNextWaterInfo } from "../core";

export function WateringForecastCard({ theme, savedPlants, wateringHistory, wateredPlants, weather, onOpenPlant }) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Build 7 forward day-buckets. Each saved plant with watering history is
  // projected via getNextWaterInfo and dropped into the day it comes due.
  const savedItems = (savedPlants || [])
    .map((name) => produceData.find((p) => p.name === name))
    .filter(Boolean);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return { offset: i, date: d, plants: [] };
  });

  let untrackedCount = 0;
  savedItems.forEach((item) => {
    const info = getNextWaterInfo(item.name, item, wateringHistory, wateredPlants, weather);
    if (!info) { untrackedCount += 1; return; }
    // Overdue or due today collapse into column 0; cap projection at day 6.
    const bucket = Math.min(6, Math.max(0, info.daysUntil));
    days[bucket].plants.push({ name: item.name, rainSoon: info.rainSoon });
  });

  const maxCount = Math.max(1, ...days.map((d) => d.plants.length));
  const weekdayFmt = (date, offset) =>
    offset === 0 ? "Today" : offset === 1 ? "Tmrw" : date.toLocaleDateString(undefined, { weekday: "short" });

  const active = selectedDay != null ? days[selectedDay] : null;

return (
    <View>

      {savedItems.length === 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 8 }}>
          Save a few plants to see your watering week take shape.
        </Text>
      ) : (
        <>
          <View style={{ flexDirection: "row", gap: 6, marginTop: 14 }}>
            {days.map((d) => {
              const count = d.plants.length;
              const intensity = count === 0 ? 0.06 : 0.12 + 0.5 * (count / maxCount);
              const isSel = selectedDay === d.offset;
              return (
                <Pressable
                  key={d.offset}
                  onPress={() => setSelectedDay(isSel ? null : d.offset)}
                  accessibilityRole="button"
                  accessibilityLabel={`${weekdayFmt(d.date, d.offset)}: ${count} plant${count === 1 ? "" : "s"} due`}
                  style={{ flex: 1, alignItems: "center", borderRadius: 14, paddingVertical: 10, backgroundColor: `rgba(107,199,255,${intensity})`, borderWidth: isSel ? 2 : 1, borderColor: isSel ? "#6bc7ff" : "rgba(255,255,255,0.08)" }}
                >
                  <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800" }}>{weekdayFmt(d.date, d.offset)}</Text>
                  <Text style={{ color: count === 0 ? theme.secondaryText : "#ffffff", fontSize: 18, fontWeight: "900", marginTop: 4 }}>{count}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 8, fontWeight: "700" }}>{count === 1 ? "plant" : "plants"}</Text>
                </Pressable>
              );
            })}
          </View>

          {active ? (
            <View style={{ marginTop: 14, backgroundColor: "rgba(107,199,255,0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.2)" }}>
              <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: active.plants.length ? 10 : 0 }}>
                {weekdayFmt(active.date, active.offset).toUpperCase()} · {active.plants.length} DUE
              </Text>
              {active.plants.length === 0 ? (
                <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700" }}>Nothing due — a free day. 🌤️</Text>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {active.plants.map((p) => (
                    <Pressable
                      key={p.name}
                      onPress={() => {
                        const item = produceData.find((pd) => pd.name === p.name);
                        if (item && onOpenPlant) onOpenPlant(item);
                      }}
                      style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "800" }}>{p.rainSoon ? "🌧️ " : ""}{p.name} ›</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 12, textAlign: "center" }}>
              Tap a day to see which plants are due.
            </Text>
          )}

          {untrackedCount > 0 ? (
            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic" }}>
              {untrackedCount} plant{untrackedCount === 1 ? "" : "s"} not shown — water once to start forecasting.
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}
