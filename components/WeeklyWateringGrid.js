import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { getDateKey } from "../core";
import { formatDate, useTranslation } from "../lib/i18n";
import { EmptyState } from "./EmptyState";

export const WeeklyWateringGrid = memo(function WeeklyWateringGrid({ theme, savedPlants, wateringHistory }) {
  const { t } = useTranslation();
  if (!savedPlants || savedPlants.length === 0) return null;

  // Build the last 7 days (oldest → today)
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({
      key: getDateKey(d),
      label: formatDate(d, {
  weekday: "narrow"
}),
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
  const todayKey = days[6].key;
  const wateredTodayCount = savedPlants.filter((n) => wateredOn(n, todayKey)).length;

  // Days since a plant was last watered — surfaces who's overdue at a glance.
  const now = new Date(); now.setHours(12, 0, 0, 0);
  const plantStatus = (name) => {
    const history = wateringHistory?.[name];
    if (!Array.isArray(history) || !history.length) return { label: "—", color: theme.secondaryText };
    const last = history
      .map((d) => new Date(`${String(d).slice(0, 10)}T12:00:00`))
      .filter((d) => !Number.isNaN(d.getTime()))
      .sort((a, b) => b - a)[0];
    if (!last) return { label: "—", color: theme.secondaryText };
    const daysAgo = Math.round((now - last) / 86400000);
    if (daysAgo <= 0) return { label: "Today", color: "#5cff89" };
    if (daysAgo === 1) return { label: "1d", color: "#8effab" };
    if (daysAgo <= 3) return { label: `${daysAgo}d`, color: "#ffd86b" };
    return { label: `${daysAgo}d`, color: "#ff9f43" };
  };

  // Show up to 6 plants as rows to keep it compact
  const rows = savedPlants.slice(0, 6);

return (
    <View>
      {weekTotal > 0 ? (
        <Text style={[styles.cardText, { color: theme.secondaryText }]}>
          {`${wateredTodayCount} of ${savedPlants.length} plant${savedPlants.length === 1 ? "" : "s"} watered today · ${weekTotal} logged this week.`}
        </Text>
      ) : (
        <EmptyState compact icon="water" title={t("empty.noWateringTitle")} body={t("empty.noWateringBody")} />
      )}

      {/* Day header */}
      <View style={{ flexDirection: "row", marginTop: 16, marginBottom: 6 }}>
        <View style={{ width: 74 }} />
        {days.map((day) => (
          <View key={`hdr-${day.key}`} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: day.isToday ? "#6bc7ff" : theme.secondaryText, fontSize: 10, fontWeight: "900" }}>
              {day.label}
            </Text>
          </View>
        ))}
        <View style={{ width: 46, alignItems: "flex-end" }}>
          <Text style={{ color: theme.secondaryText, fontSize: 9.5, fontWeight: "900" }}>LAST</Text>
        </View>
      </View>

      {/* Plant rows */}
      <View style={{ gap: 6 }}>
        {rows.map((name) => {
          const status = plantStatus(name);
          return (
          <View key={`row-${name}`} style={{ flexDirection: "row", alignItems: "center" }}>
            <Text numberOfLines={1} style={{ width: 74, color: theme.text, fontSize: 12, fontWeight: "800", paddingRight: 6 }}>
              {name}
            </Text>
            {days.map((day) => {
              const on = wateredOn(name, day.key);
              return (
                <View key={`${name}-${day.key}`} style={{ flex: 1, alignItems: "center" }}>
                  <View style={{
                    width: 22, height: 22, borderRadius: 8,
                    backgroundColor: on ? "#6bc7ff" : "rgba(255, 255, 255, 0.06)",
                    borderWidth: 1,
                    borderColor: on ? "#6bc7ff" : day.isToday ? "rgba(107, 199, 255, 0.3)" : "rgba(255, 255, 255, 0.08)",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    {on ? <Text style={{ fontSize: 10 }}>💧</Text> : null}
                  </View>
                </View>
              );
            })}
            <View style={{ width: 46, alignItems: "flex-end" }}>
              <Text style={{ color: status.color, fontSize: 12, fontWeight: "900" }}>{status.label}</Text>
            </View>
          </View>
          );
        })}
      </View>

      {savedPlants.length > 6 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 10, textAlign: "center" }}>
          {t("weeklyWateringGrid.showing6Of")} {savedPlants.length} {t("weeklyWateringGrid.savedPlants")}
        </Text>
      ) : null}
    </View>
  );
})
