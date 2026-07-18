import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";

export function OnThisDayCard({ theme, journalEntries, harvestLog, onOpenPlant }) {
  const now = new Date();
  now.setHours(12, 0, 0, 0);

  // Match anything that happened ~1 month or ~1 year ago (within a 2-day window).
  const WINDOW_DAYS = 2;
  const isThrowback = (dateStr) => {
    const then = new Date(dateStr);
    if (Number.isNaN(then.getTime())) return null;
    then.setHours(12, 0, 0, 0);
    const daysAgo = Math.round((now - then) / (1000 * 60 * 60 * 24));
    if (daysAgo < 25) return null; // too recent to be a throwback
    // 1 year
    if (Math.abs(daysAgo - 365) <= WINDOW_DAYS) return { label: "1 year ago", years: 1 };
    // whole months (30-day approximation)
    const months = Math.round(daysAgo / 30);
    if (months >= 1 && Math.abs(daysAgo - months * 30) <= WINDOW_DAYS) {
      return { label: months === 1 ? "1 month ago" : `${months} months ago`, months };
    }
    return null;
  };

  const photoMemories = (journalEntries || [])
    .map((e) => {
      const match = isThrowback(e.createdAt);
      return match && e.imageUri ? { type: "photo", entry: e, match } : null;
    })
    .filter(Boolean);

  const harvestMemories = (harvestLog || [])
    .map((h) => {
      const match = isThrowback(h.createdAt);
      return match ? { type: "harvest", entry: h, match } : null;
    })
    .filter(Boolean);

  const memories = [...photoMemories, ...harvestMemories].sort(
    (a, b) => new Date(b.entry.createdAt) - new Date(a.entry.createdAt)
  );

  if (!memories.length) return null;

  return (
    <View style={{ borderRadius: 26, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(216,200,255,0.10)", borderColor: "#d8c8ff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>📅</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>ON THIS DAY</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {memories.length === 1 ? "A memory from your garden" : "Memories from your garden"}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        Look how far you've come. Here's what your garden was up to around this time.
      </Text>

      <View style={{ gap: 12, marginTop: 14 }}>
        {memories.slice(0, 4).map((m, i) => {
          if (m.type === "photo") {
            const plant = produceData.find((p) => p.name === m.entry.plantName);
            return (
              <Pressable
                key={`otd-photo-${m.entry.id}`}
                onPress={() => plant && onOpenPlant(plant)}
                style={{ borderRadius: 18, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(216,200,255,0.22)" }}
              >
                <Image source={{ uri: m.entry.imageUri }} style={{ width: "100%", height: 160 }} resizeMode="cover" />
                <View style={{ position: "absolute", top: 10, left: 10, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
                  <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "900" }}>🕐 {m.match.label}</Text>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{m.entry.plantName || "Garden"}</Text>
                  {m.entry.growthStage ? (
                    <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "800", marginTop: 2 }}>{m.entry.growthStage}</Text>
                  ) : null}
                </View>
              </Pressable>
            );
          }
          const plant = produceData.find((p) => p.name === m.entry.plantName);
          const img = plant ? resolvePlantImageSource(plant) : null;
          return (
            <Pressable
              key={`otd-harvest-${m.entry.id}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 12, borderWidth: 1, borderColor: "rgba(216,200,255,0.22)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 22 }}>🎉</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>Harvested {m.entry.plantName}</Text>
                <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  🕐 {m.match.label}{m.entry.amount ? ` · ${m.entry.amount} ${m.entry.unit || ""}`.trimEnd() : ""}
                </Text>
              </View>
              <Text style={{ color: "#d8c8ff", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
