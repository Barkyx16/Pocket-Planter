import { Text, View } from "react-native";
import { styles } from "../styles";
import { countInSeason, getSeasonForMonth } from "../core";

export function SeasonComparisonCard({ theme, harvestLog, journalEntries, wateringHistory }) {
  const now = new Date();
  const season = getSeasonForMonth(now.getMonth() + 1);
  const thisYear = now.getFullYear();
  const lastYear = thisYear - 1;

  const waterEvents = [];
  Object.values(wateringHistory || {}).forEach((dates) => {
    if (Array.isArray(dates)) dates.forEach((d) => waterEvents.push({ createdAt: `${String(d).slice(0, 10)}T12:00:00` }));
  });

  const build = (year) => ({
    harvests: countInSeason(harvestLog, "createdAt", year, season.months),
    photos: countInSeason(journalEntries, "createdAt", year, season.months),
    waterings: countInSeason(waterEvents, "createdAt", year, season.months),
  });

  const current = build(thisYear);
  const prior = build(lastYear);
  const hasPrior = prior.harvests + prior.photos + prior.waterings > 0;

  const hasThisSeason = current.harvests + current.photos + current.waterings > 0;

  const rows = [
    { icon: "🎉", label: "Harvests", value: current.harvests },
    { icon: "📸", label: "Photos", value: current.photos },
    { icon: "💧", label: "Waterings", value: current.waterings },
  ];

return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Your {season.label} {thisYear}</Text>
      {!hasThisSeason ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(107,199,255,0.08)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(107,199,255,0.20)" }}>
          <Text style={{ color: "#6bc7ff", fontSize: 14, fontWeight: "800", lineHeight: 21 }}>
            Nothing logged this {season.label.toLowerCase()} yet. Water a plant, add a photo, or log a harvest and it'll show up here. 🌱
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          {rows.map((r) => (
            <View key={r.label} style={{ flex: 1, borderRadius: 18, paddingVertical: 18, alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(107,199,255,0.16)" }}>
              <Text style={{ fontSize: 24 }}>{r.icon}</Text>
              <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{r.value}</Text>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 3 }}>{r.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
