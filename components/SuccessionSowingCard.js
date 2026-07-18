import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getSuccessionInfo, resolvePlantImageSource } from "../core";

export function SuccessionSowingCard({ theme, savedPlants, zone, sowLog, onSow }) {
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
    waiting: { color: "#9aa5a0", icon: "⏳", label: "On schedule" },
  };

return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {rows.map(({ name, item, info }) => {
          const s = STATUS[info.status];
          const img = resolvePlantImageSource(item);
          const detail =
            info.status === "due"
              ? `Last sown ${info.daysSince}d ago · every ~${info.interval}d`
              : info.status === "waiting"
              ? `Next round in ~${info.daysUntil}d · every ~${info.interval}d`
              : `Recommended every ~${info.interval}d in season`;
          return (
            <View
              key={`succ-${name}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: `${s.color}30` }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{name}</Text>
                  <Text style={{ color: s.color, fontSize: 11, fontWeight: "900" }}>{s.icon} {s.label}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{detail}</Text>
              </View>
              <Pressable
                onPress={() => onSow(name)}
                style={{ backgroundColor: info.status === "waiting" ? "rgba(255,255,255,0.08)" : `${s.color}22`, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: `${s.color}44` }}
              >
                <Text style={{ color: info.status === "waiting" ? theme.secondaryText : s.color, fontSize: 12, fontWeight: "900" }}>Sow today</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
      </Text>
    </View>
  );
}
