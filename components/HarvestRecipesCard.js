import { memo } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

const imgFor = (name) => {
  const item = produceData.find((p) => p.name === name);
  return item ? resolvePlantImageSource(item) : null;
};

// Keyword → quick recipe ideas for common crops. `ideas` are ids under recipesText.idea_*.
// `match` keywords are matched against plant names and never shown.
const RECIPES = [
  { match: ["tomato"], icon: "🍅", ideas: ["freshCapreseSalad", "slowRoastedTomatoSauce", "bruschetta"] },
  { match: ["pepper"], icon: "🫑", ideas: ["stuffedPeppers", "fajitaStrips", "roastedRedPepperDip"] },
  { match: ["cucumber"], icon: "🥒", ideas: ["quickRefrigeratorPickles", "cucumberTzatziki", "smashedCucumberSalad"] },
  { match: ["lettuce", "arugula", "spinach", "kale", "chard", "green"], icon: "🥬", ideas: ["gardenSalad", "sauteedGreensWithGarlic", "greenSmoothie"] },
  { match: ["zucchini", "squash"], icon: "🥒", ideas: ["zucchiniBread", "grilledSquash", "zoodlesWithPesto"] },
  { match: ["bean"], icon: "🫘", ideas: ["garlicGreenBeans", "threeBeanSalad", "blisteredBeans"] },
  { match: ["carrot"], icon: "🥕", ideas: ["honeyRoastedCarrots", "carrotGingerSoup", "carrotSlaw"] },
  { match: ["potato"], icon: "🥔", ideas: ["crispyRoastPotatoes", "potatoSalad", "mashedPotatoes"] },
  { match: ["strawberry", "berry", "raspberry", "blackberry", "blueberry"], icon: "🍓", ideas: ["berryCrumble", "freshJam", "smoothieBowl"] },
  { match: ["basil"], icon: "🌿", ideas: ["classicPesto", "capreseSkewers", "infusedOliveOil"] },
  { match: ["mint"], icon: "🌱", ideas: ["mintTea", "cucumberMintWater", "tabbouleh"] },
  { match: ["onion", "garlic"], icon: "🧅", ideas: ["caramelizedOnions", "roastedGarlicSpread", "frenchOnionSoup"] },
  { match: ["cabbage", "broccoli", "cauliflower"], icon: "🥦", ideas: ["roastedFlorets", "slaw", "stirFry"] },
  { match: ["corn"], icon: "🌽", ideas: ["grilledStreetCorn", "cornSalsa", "cornChowder"] },
  { match: ["herb", "parsley", "cilantro", "thyme", "oregano", "rosemary"], icon: "🌿", ideas: ["freshHerbChimichurri", "compoundButter", "garnishAnything"] },
];

const recipeFor = (name) => {
  const n = String(name || "").toLowerCase();
  return RECIPES.find((r) => r.match.some((m) => n.includes(m)));
};

export const HarvestRecipesCard = memo(function HarvestRecipesCard({ theme, savedPlants, harvestLog }) {
  const { t } = useTranslation();
  // Prefer what you've actually harvested; fall back to what you're growing.
  const harvestedNames = Array.from(new Set((harvestLog || []).map((e) => e.plantName).filter(Boolean)));
  const source = harvestedNames.length ? harvestedNames : (savedPlants || []);

  const matched = [];
  const seen = new Set();
  source.forEach((name) => {
    const r = recipeFor(name);
    if (r && !seen.has(r.icon + r.ideas[0])) { seen.add(r.icon + r.ideas[0]); matched.push({ name, r }); }
  });

  if (!matched.length) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("harvestRecipes.saveOrHarvestAFew")}
      </Text>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t(harvestedNames.length ? "recipesText.introHarvesting" : "recipesText.introGrowing")}
      </Text>

      <View style={{ gap: 8, marginTop: 14 }}>
        {matched.slice(0, 8).map(({ name, r }) => {
          const img = imgFor(name);
          return (
          <View key={name} style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
              {img ? (
                <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <Image source={img} style={{ width: 30, height: 30 }} resizeMode="contain" />
                </View>
              ) : (
                <Text style={{ fontSize: 20 }}>{r.icon}</Text>
              )}
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", flex: 1 }}>{name}</Text>
              <Pressable
                onPress={() => Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(name + t("harvestRecipes.recipesEasy"))}`)}
                style={{ backgroundColor: "rgba(255, 216, 107, 0.12)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(255, 216, 107, 0.24)" }}
              >
                <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900" }}>{t("harvestRecipes.recipes")}</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {r.ideas.map((idea) => (
                <View key={idea} style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>{t(`recipesText.idea_${idea}`)}</Text>
                </View>
              ))}
            </View>
          </View>
          );
        })}
      </View>
    </View>
  );
})
