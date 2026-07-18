import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";

export function HarvestRevealCard({ theme, journalEntries, harvestLog, onOpenPlant }) {
  // Plants that have been harvested AND have 2+ journal photos
  const harvestedNames = Array.from(new Set((harvestLog || []).map((h) => h.plantName)));

  const reveals = harvestedNames
    .map((name) => {
    const photos = (journalEntries || [])
        .filter((e) => e.plantName === name && e.imageUri)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      if (photos.length < 2) return null;
      const first = photos[0];
      const last = photos[photos.length - 1];
      const daysBetween = Math.max(
        1,
        Math.round((new Date(last.createdAt) - new Date(first.createdAt)) / (1000 * 60 * 60 * 24))
      );
      return { name, first, last, daysBetween, photoCount: photos.length };
    })
    .filter(Boolean);

  if (!reveals.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#ffd86b" }]}>
      <Text style={styles.cardEyebrow}>🌱➡️🍅 THE GLOW-UP</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>How Far They've Come</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Your harvested plants, from first photo to latest. Look at that growth.
      </Text>
      <View style={{ gap: 16, marginTop: 16 }}>
        {reveals.map((r) => {
          const plant = produceData.find((p) => p.name === r.name);
          return (
            <Pressable
              key={`reveal-${r.name}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 14, borderWidth: 1, borderColor: "rgba(255,216,107,0.18)" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900" }}>{r.name}</Text>
                <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "800" }}>{r.daysBetween} days apart</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Image source={{ uri: r.first.imageUri }} style={{ width: "100%", height: 130, borderRadius: 14, backgroundColor: "#0e2414" }} resizeMode="cover" />
                  <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", textAlign: "center", marginTop: 6 }}>🌱 First photo</Text>
                </View>
                <Text style={{ color: "#ffd86b", fontSize: 22, fontWeight: "900" }}>→</Text>
                <View style={{ flex: 1 }}>
                  <Image source={{ uri: r.last.imageUri }} style={{ width: "100%", height: 130, borderRadius: 14, backgroundColor: "#0e2414" }} resizeMode="cover" />
                  <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", textAlign: "center", marginTop: 6 }}>🍅 Latest</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
