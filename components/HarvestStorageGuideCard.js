import { memo } from "react";
import { Image, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

const imgFor = (name) => {
  const item = produceData.find((p) => p.name === name);
  return item ? resolvePlantImageSource(item) : null;
};

const STORAGE = [
  { match: ["tomato"], icon: "🍅", store: "Counter, out of sun (never the fridge — it kills flavor)", keeps: "5–7 days", tip: "Freeze whole or make sauce to keep for months." },
  { match: ["pepper"], icon: "🫑", store: "Crisper drawer, unwashed", keeps: "1–2 weeks", tip: "Slice and freeze on a tray, then bag." },
  { match: ["lettuce", "spinach", "arugula", "green", "chard"], icon: "🥬", store: "Fridge in a bag with a paper towel", keeps: "5–10 days", tip: "Revive limp greens in ice water for 15 min." },
  { match: ["kale", "cabbage", "broccoli", "cauliflower"], icon: "🥦", store: "Crisper drawer, unwashed", keeps: "1–2 weeks", tip: "Blanch and freeze for long-term storage." },
  { match: ["carrot", "beet", "radish", "turnip"], icon: "🥕", store: "Fridge in water or a damp bag; cut off tops", keeps: "3–4 weeks", tip: "Store roots in damp sand in a cool cellar for months." },
  { match: ["potato", "onion", "garlic"], icon: "🧅", store: "Cool, dark, dry spot — not the fridge", keeps: "1–3 months", tip: "Keep potatoes and onions apart; they spoil each other." },
  { match: ["cucumber", "zucchini", "squash"], icon: "🥒", store: "Crisper drawer", keeps: "1 week", tip: "Winter squash cures and keeps for months in a cool room." },
  { match: ["bean", "pea"], icon: "🫘", store: "Fridge in a bag", keeps: "3–5 days", tip: "Blanch and freeze, or leave on the vine to dry for storage beans." },
  { match: ["strawberry", "raspberry", "blackberry", "blueberry", "berry"], icon: "🍓", store: "Fridge, unwashed, in a single layer", keeps: "3–5 days", tip: "Freeze on a tray for smoothies; makes great jam." },
  { match: ["corn"], icon: "🌽", store: "Fridge in the husk", keeps: "1–3 days", tip: "Sweetness fades fast — cook or freeze the day you pick." },
  { match: ["basil", "cilantro", "parsley", "mint", "herb"], icon: "🌿", store: "Stems in a jar of water on the counter", keeps: "1–2 weeks", tip: "Freeze in olive oil in ice-cube trays." },
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
        {t("harvestStorageGuide.keepYourHarvestFreshLonger")} {harvested.length ? "picking" : "growing"}.
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
                <Text style={{ color: "#8effab", fontSize: 10, fontWeight: "900" }}>Keeps {g.keeps}</Text>
              </View>
            </View>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 8 }}>🧊 {g.store}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 16, marginTop: 4 }}>💡 {g.tip}</Text>
          </View>
          );
        })}
      </View>
    </View>
  );
})
