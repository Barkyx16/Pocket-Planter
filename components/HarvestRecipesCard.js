import { memo } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

const imgFor = (name) => {
  const item = produceData.find((p) => p.name === name);
  return item ? resolvePlantImageSource(item) : null;
};

// Keyword → quick recipe ideas for common crops.
const RECIPES = [
  { match: ["tomato"], icon: "🍅", ideas: ["Fresh caprese salad", "Slow-roasted tomato sauce", "Bruschetta"] },
  { match: ["pepper"], icon: "🫑", ideas: ["Stuffed peppers", "Fajita strips", "Roasted red pepper dip"] },
  { match: ["cucumber"], icon: "🥒", ideas: ["Quick refrigerator pickles", "Cucumber tzatziki", "Smashed cucumber salad"] },
  { match: ["lettuce", "arugula", "spinach", "kale", "chard", "green"], icon: "🥬", ideas: ["Garden salad", "Sautéed greens with garlic", "Green smoothie"] },
  { match: ["zucchini", "squash"], icon: "🥒", ideas: ["Zucchini bread", "Grilled squash", "Zoodles with pesto"] },
  { match: ["bean"], icon: "🫘", ideas: ["Garlic green beans", "Three-bean salad", "Blistered beans"] },
  { match: ["carrot"], icon: "🥕", ideas: ["Honey-roasted carrots", "Carrot ginger soup", "Carrot slaw"] },
  { match: ["potato"], icon: "🥔", ideas: ["Crispy roast potatoes", "Potato salad", "Mashed potatoes"] },
  { match: ["strawberry", "berry", "raspberry", "blackberry", "blueberry"], icon: "🍓", ideas: ["Berry crumble", "Fresh jam", "Smoothie bowl"] },
  { match: ["basil"], icon: "🌿", ideas: ["Classic pesto", "Caprese skewers", "Infused olive oil"] },
  { match: ["mint"], icon: "🌱", ideas: ["Mint tea", "Cucumber-mint water", "Tabbouleh"] },
  { match: ["onion", "garlic"], icon: "🧅", ideas: ["Caramelized onions", "Roasted garlic spread", "French onion soup"] },
  { match: ["cabbage", "broccoli", "cauliflower"], icon: "🥦", ideas: ["Roasted florets", "Slaw", "Stir-fry"] },
  { match: ["corn"], icon: "🌽", ideas: ["Grilled street corn", "Corn salsa", "Corn chowder"] },
  { match: ["herb", "parsley", "cilantro", "thyme", "oregano", "rosemary"], icon: "🌿", ideas: ["Fresh herb chimichurri", "Compound butter", "Garnish anything"] },
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
        {t("harvestRecipes.freshFromYourGardenQuick")} {harvestedNames.length ? "harvesting" : "growing"}{t("harvestRecipes.tapToFindRecipes")}
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
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>{idea}</Text>
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
