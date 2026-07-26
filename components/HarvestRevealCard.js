import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const HarvestRevealCard = memo(function HarvestRevealCard({ theme, journalEntries, harvestLog, onOpenPlant }) {
  const { t } = useTranslation();
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
      <Text style={styles.cardEyebrow}>{t("harvestReveal.theGlowup")}</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{t("harvestReveal.howFarTheyveCome")}</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {t("harvestReveal.yourHarvestedPlantsFromFirst")}
      </Text>
      <View style={{ gap: 16, marginTop: 16 }}>
        {reveals.map((r) => {
          const plant = produceData.find((p) => p.name === r.name);
          return (
            <Pressable
              key={`reveal-${r.name}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255, 216, 107, 0.16)" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900" }}>{r.name}</Text>
                <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "800" }}>{r.daysBetween} {t("harvestReveal.daysApart")}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Image source={{ uri: r.first.imageUri }} style={{ width: "100%", height: 130, borderRadius: 12, backgroundColor: "#0e2414" }} resizeMode="cover" />
                  <IconText label={t("harvestReveal.firstPhoto")} style={{
  color: theme.secondaryText,
  fontSize: 10,
  fontWeight: "800",
  textAlign: "center",
  marginTop: 6
}} />
                </View>
                <Text style={{ color: "#ffd86b", fontSize: 20, fontWeight: "900" }}>→</Text>
                <View style={{ flex: 1 }}>
                  <Image source={{ uri: r.last.imageUri }} style={{ width: "100%", height: 130, borderRadius: 12, backgroundColor: "#0e2414" }} resizeMode="cover" />
                  <IconText label={t("harvestReveal.latest")} style={{
  color: theme.secondaryText,
  fontSize: 10,
  fontWeight: "800",
  textAlign: "center",
  marginTop: 6
}} />
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
})
