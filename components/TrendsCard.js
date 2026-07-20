import { memo } from "react";
import { Text, View } from "react-native";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const TrendsCard = memo(function TrendsCard({ theme, harvestLog, wateringHistory, journalEntries }) {
  // Build the last 6 month buckets (oldest → current).
  const buckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    return { month: d.getMonth(), year: d.getFullYear(), label: MONTHS[d.getMonth()], harvests: 0, waterings: 0, photos: 0 };
  });
  const bucketFor = (dateVal) => {
    const d = new Date(String(dateVal).length <= 10 ? `${String(dateVal).slice(0, 10)}T12:00:00` : dateVal);
    if (Number.isNaN(d.getTime())) return null;
    return buckets.find((b) => b.month === d.getMonth() && b.year === d.getFullYear());
  };

  (harvestLog || []).forEach((e) => { const b = bucketFor(e.date || e.createdAt); if (b) b.harvests += 1; });
  Object.values(wateringHistory || {}).forEach((arr) => { if (Array.isArray(arr)) arr.forEach((d) => { const b = bucketFor(d); if (b) b.waterings += 1; }); });
  (journalEntries || []).forEach((e) => { const b = bucketFor(e.createdAt); if (b) b.photos += 1; });

  const hasAny = buckets.some((b) => b.harvests || b.waterings || b.photos);
  if (!hasAny) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Log waterings, photos, and harvests and your season trends will chart here month by month.
      </Text>
    );
  }

  const Chart = ({ title, color, keyName }) => {
    const max = Math.max(1, ...buckets.map((b) => b[keyName]));
    const total = buckets.reduce((s, b) => s + b[keyName], 0);
    return (
      <View style={{ marginTop: 14 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ color, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>{title}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 11.5, fontWeight: "800" }}>{total} total</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, height: 70 }}>
          {buckets.map((b, i) => (
            <View key={i} style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: b[keyName] > 0 ? color : "transparent", fontSize: 10, fontWeight: "900", marginBottom: 2 }}>{b[keyName] || ""}</Text>
              <View style={{ width: "100%", height: 44, justifyContent: "flex-end" }}>
                <View style={{ width: "100%", height: `${Math.max(4, (b[keyName] / max) * 100)}%`, backgroundColor: b[keyName] > 0 ? color : "rgba(255,255,255,0.06)", borderRadius: 5 }} />
              </View>
              <Text style={{ color: theme.secondaryText, fontSize: 9, fontWeight: "800", marginTop: 4 }}>{b.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Your last 6 months of garden activity at a glance.
      </Text>
      <Chart title="💧 WATERINGS" color="#6bc7ff" keyName="waterings" />
      <Chart title="📸 PHOTOS" color="#ffd86b" keyName="photos" />
      <Chart title="🚜 HARVESTS" color="#5cff89" keyName="harvests" />
    </View>
  );
})
