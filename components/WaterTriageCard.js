import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { getWaterTriage, resolvePlantImageSource } from "../core";

export const WaterTriageCard = memo(function WaterTriageCard({ theme, savedPlants, wateringHistory, wateringAmounts, onWater, onOpenPlant }) {
  const rows = getWaterTriage(savedPlants, wateringHistory, wateringAmounts);
  if (!rows.length) return null;

  const BUCKET = {
    overdue: { color: "#ff7a7a", icon: "🔴", label: "Overdue" },
    today: { color: "#ffd86b", icon: "🟡", label: "Due today" },
    tomorrow: { color: "#6bc7ff", icon: "🔵", label: "Tomorrow" },
  };
  const overdueCount = rows.filter((r) => r.bucket === "overdue").length;
  const todayCount = rows.filter((r) => r.bucket === "today").length;

  const summary =
    overdueCount > 0
      ? `${overdueCount} overdue${todayCount ? `, ${todayCount} due today` : ""} — start at the top.`
      : todayCount > 0
      ? `${todayCount} due today, plus tomorrow's coming up.`
      : "Nothing overdue — just tomorrow's on deck.";

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: overdueCount ? "#ff7a7a" : "rgba(107,199,255,0.28)" }]}>
      <Text style={styles.cardEyebrow}>🚿 WATERING QUEUE</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Water These, In Order</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>{summary}</Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map(({ name, item, bucket, daysUntil }) => {
          const b = BUCKET[bucket];
          const img = resolvePlantImageSource(item);
          const detail =
            bucket === "overdue"
              ? `${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? "" : "s"} overdue`
              : bucket === "today"
              ? "Due today"
              : "Due tomorrow";
          return (
            <View
              key={`triage-${name}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: `${b.color}30` }}
            >
              <Pressable onPress={() => onOpenPlant(item)} style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{name}</Text>
                    <Text style={{ color: b.color, fontSize: 11, fontWeight: "900" }}>{b.icon} {b.label}</Text>
                  </View>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{detail}</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => onWater(name)}
                style={{ backgroundColor: `${b.color}22`, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1, borderColor: `${b.color}44` }}
              >
                <Text style={{ color: b.color, fontSize: 13, fontWeight: "900" }}>💧 Water</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
})
