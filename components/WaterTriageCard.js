import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { getWaterTriage, resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const WaterTriageCard = memo(function WaterTriageCard({ theme, savedPlants, wateringHistory, wateringAmounts, onWater, onOpenPlant }) {
  const { t } = useTranslation();
  const rows = getWaterTriage(savedPlants, wateringHistory, wateringAmounts);
  if (!rows.length) return null;

  const BUCKET = {
    overdue: { color: "#ff7b7b", icon: "🔴", label: "Overdue" },
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
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: overdueCount ? "#ff7b7b" : "rgba(107, 199, 255, 0.3)" }]}>
      <IconText label={t("waterTriage.wateringQueue")} style={styles.cardEyebrow} />
      <Text style={[styles.cardTitle, { color: theme.text }]}>{t("waterTriage.waterTheseInOrder")}</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>{summary}</Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map(({ name, item, bucket, daysUntil }) => {
          const b = BUCKET[bucket];
          const img = resolvePlantImageSource(item);
          const detail =
            bucket === "overdue"
              ? `${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? "" : "s"} overdue`
              : bucket === "today"
              ? t("waterTriage.dueToday")
              : t("waterTriage.dueTomorrow");
          return (
            <View
              key={`triage-${name}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: `${b.color}30` }}
            >
              <Pressable onPress={() => onOpenPlant(item)} style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{name}</Text>
                    <Text style={{ color: b.color, fontSize: 10, fontWeight: "900" }}>{b.icon} {b.label}</Text>
                  </View>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{detail}</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => onWater(name)}
                style={{ backgroundColor: `${b.color}22`, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: `${b.color}44` }}
              >
                <IconText label={t("waterTriage.water")} style={{
  color: b.color,
  fontSize: 12,
  fontWeight: "900"
}} />
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
})
