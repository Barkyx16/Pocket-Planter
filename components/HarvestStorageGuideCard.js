import { memo } from "react";
import { Image, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

const imgFor = (name) => {
  const item = produceData.find((p) => p.name === name);
  return item ? resolvePlantImageSource(item) : null;
};

// Copy for each row lives under storageGuideText.<id>_store / _keeps / _tip.
// `match` keywords are matched against plant names and never shown.
const STORAGE = [
  { match: ["tomato"], icon: "🍅", id: "tomato" },
  { match: ["pepper"], icon: "🫑", id: "pepper" },
  { match: ["lettuce", "spinach", "arugula", "green", "chard"], icon: "🥬", id: "greens" },
  { match: ["kale", "cabbage", "broccoli", "cauliflower"], icon: "🥦", id: "brassicas" },
  { match: ["carrot", "beet", "radish", "turnip"], icon: "🥕", id: "roots" },
  { match: ["potato", "onion", "garlic"], icon: "🧅", id: "alliums" },
  { match: ["cucumber", "zucchini", "squash"], icon: "🥒", id: "cucurbits" },
  { match: ["bean", "pea"], icon: "🫘", id: "beans" },
  { match: ["strawberry", "raspberry", "blackberry", "blueberry", "berry"], icon: "🍓", id: "berries" },
  { match: ["corn"], icon: "🌽", id: "corn" },
  { match: ["basil", "cilantro", "parsley", "mint", "herb"], icon: "🌿", id: "herbs" },
];

const guideFor = (name) => {
  const n = String(name || "").toLowerCase();
  return STORAGE.find((s) => s.match.some((m) => n.includes(m)));
};

export const HarvestStorageGuideCard = memo(function HarvestStorageGuideCard({ theme, savedPlants, harvestLog }) {
  const { t } = useTranslation();
  const harvested = Array.from(new Set((harvestLog || []).map((e) => e.plantName).filter(Boolean)));
  const source = harvested.length ? harvested : (savedPlants || []);
  const matched = [];
  const seen = new Set();
  source.forEach((name) => {
    const g = guideFor(name);
    if (g && !seen.has(g.icon)) { seen.add(g.icon); matched.push({ name, g }); }
  });

  if (!matched.length) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("harvestStorageGuide.saveOrHarvestAFew")}
      </Text>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t(harvested.length ? "storageGuideText.introPicking" : "storageGuideText.introGrowing")}
      </Text>
      <View style={{ gap: 8, marginTop: 14 }}>
        {matched.slice(0, 10).map(({ name, g }) => {
          const img = imgFor(name);
          return (
          <View key={name} style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {img ? (
                <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <Image source={img} style={{ width: 30, height: 30 }} resizeMode="contain" />
                </View>
              ) : (
                <Text style={{ fontSize: 20 }}>{g.icon}</Text>
              )}
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", flex: 1 }}>{name}</Text>
              <View style={{ backgroundColor: "rgba(92, 255, 137, 0.12)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: "#8effab", fontSize: 10, fontWeight: "900" }}>{t(`storageGuideText.${g.id}_keeps`)}</Text>
              </View>
            </View>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 8 }}>🧊 {t(`storageGuideText.${g.id}_store`)}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 16, marginTop: 4 }}>💡 {t(`storageGuideText.${g.id}_tip`)}</Text>
          </View>
          );
        })}
      </View>
    </View>
  );
})
