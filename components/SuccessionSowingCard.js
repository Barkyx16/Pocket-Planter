import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getSuccessionInfo, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

export const SuccessionSowingCard = memo(function SuccessionSowingCard({ theme, savedPlants, zone, sowLog, onSow }) {
  const { t } = useTranslation();
  if (!zone) return null;

  const rank = { due: 0, start: 1, waiting: 2 };
  const rows = (savedPlants || [])
    .map((name) => {
      const item = produceData.find((p) => p.name === name);
      if (!item) return null;
      const info = getSuccessionInfo(name, item, zone, sowLog);
      return info ? { name, item, info } : null;
    })
    .filter(Boolean)
    .sort((a, b) => rank[a.info.status] - rank[b.info.status])
    .slice(0, 6);

  if (!rows.length) return null;

  const STATUS = {
    due: { color: "#5cff89", icon: "🌱", label: "Sow again now" },
    start: { color: "#6bc7ff", icon: "✨", label: "Start a first sowing" },
    waiting: { color: "#8fbf9d", icon: "⏳", label: "On schedule" },
  };

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 19, marginTop: 2 }}>
        {t("successionSowing.resowTheseOnARhythm")}
      </Text>

      <View style={{ gap: 10, marginTop: 14 }}>
        {rows.map(({ name, item, info }) => {
          const s = STATUS[info.status];
          const img = resolvePlantImageSource(item);
          const actionable = info.status !== "waiting";
          const detail =
            info.status === "due"
              ? `Last sown ${info.daysSince}d ago · every ~${info.interval}d`
              : info.status === "waiting"
              ? `Next round in ~${info.daysUntil}d · every ~${info.interval}d`
              : `Recommended every ~${info.interval}d in season`;
          return (
            <View
              key={`succ-${name}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${s.color}22` }}
            >
              <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{name}</Text>
                <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", backgroundColor: `${s.color}1a`, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: `${s.color}33`, marginTop: 6 }}>
                  <Text style={{ color: s.color, fontSize: 10, fontWeight: "800" }}>{s.icon} {s.label}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", marginTop: 6 }}>{detail}</Text>
              </View>
              <Pressable
                onPress={() => onSow(name)}
                accessibilityRole="button"
                accessibilityLabel={`Log a sowing of ${name} today`}
                style={{ backgroundColor: actionable ? s.color : "transparent", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: actionable ? s.color : `${s.color}55` }}
              >
                <Text style={{ color: actionable ? "#07120b" : s.color, fontSize: 12, fontWeight: "800" }}>{actionable ? "Sow" : t("successionSowing.sowAnyway")}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
})
