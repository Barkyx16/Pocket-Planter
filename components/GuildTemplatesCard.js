import { memo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";

const GUILDS = [
  { name: "Three Sisters", icon: "🌽", blurb: "The classic Native American trio — corn supports beans, beans feed the soil, squash shades out weeds.", plants: ["Corn", "Green Bean", "Butternut Squash", "Zucchini"] },
  { name: "Salsa Garden", icon: "🌶️", blurb: "Everything for fresh salsa in one bed.", plants: ["Tomato", "Pepper", "Onion", "Cilantro", "Jalapeño"] },
  { name: "Pizza Garden", icon: "🍕", blurb: "Toppings and herbs for homemade pizza night.", plants: ["Tomato", "Basil", "Oregano", "Pepper", "Onion"] },
  { name: "Pollinator Patch", icon: "🐝", blurb: "Draw bees and butterflies to boost your whole garden's yield.", plants: ["Marigold", "Borage", "Lavender", "Chamomile", "Mint"] },
  { name: "Salad Bowl", icon: "🥗", blurb: "Fast, cut-and-come-again greens for endless salads.", plants: ["Lettuce", "Spinach", "Arugula", "Radish", "Cucumber"] },
  { name: "Herb Spiral", icon: "🌿", blurb: "A compact mix of the most-used kitchen herbs.", plants: ["Basil", "Parsley", "Thyme", "Rosemary", "Mint", "Cilantro"] },

  // ── More combos ──
  { name: "Stir-Fry Garden", icon: "🥢", blurb: "Everything for a quick wok dinner, straight from the bed.", plants: ["Bok Choy", "Napa Cabbage", "Snap Pea", "Ginger", "Scallion", "Garlic"] },
  { name: "Root Cellar Mix", icon: "🥕", blurb: "Storage roots that keep for months in a cool, dark spot.", plants: ["Carrot", "Beet", "Turnip", "Parsnip", "Rutabaga", "Radish"] },
  { name: "Brassica Bed", icon: "🥦", blurb: "Cool-season cabbage cousins — rotate them together each year.", plants: ["Broccoli", "Cauliflower", "Cabbage", "Kale", "Brussels Sprouts"] },
  { name: "Berry Patch", icon: "🫐", blurb: "A perennial corner of sweet, pick-and-eat berries.", plants: ["Strawberry", "Blueberry", "Blackberry", "Raspberry", "Gooseberry"] },
  { name: "Mediterranean Herbs", icon: "🫒", blurb: "Sun-loving, drought-tough herbs that share the same dry bed.", plants: ["Rosemary", "Thyme", "Oregano", "Sage", "Lavender", "Marjoram"] },
  { name: "Taco Night", icon: "🌮", blurb: "Fresh fixings for tacos and pico de gallo.", plants: ["Tomato", "Onion", "Cilantro", "Jalapeño", "Bell Pepper", "Tomatillo"] },
  { name: "Ratatouille Bed", icon: "🍆", blurb: "The classic French summer-vegetable stew, homegrown.", plants: ["Eggplant", "Zucchini", "Tomato", "Bell Pepper", "Onion", "Garlic"] },
  { name: "Curry Garden", icon: "🍛", blurb: "Warm spices and aromatics for homemade curry.", plants: ["Turmeric", "Ginger", "Cilantro", "Onion", "Garlic", "Habanero"] },
  { name: "Tea Garden", icon: "🍵", blurb: "Leaves and flowers to dry for soothing herbal teas.", plants: ["Chamomile", "Mint", "Lavender", "Lemongrass", "Stevia", "Sage"] },
  { name: "Cool-Season Greens", icon: "🥬", blurb: "Leafy greens that thrive in spring and fall chill.", plants: ["Lettuce", "Spinach", "Arugula", "Swiss Chard", "Kale", "Mustard Greens"] },
  { name: "Pickle Patch", icon: "🥒", blurb: "Cukes plus the dill and alliums to pickle them.", plants: ["Cucumber", "Dill", "Garlic", "Onion", "Beet"] },
  { name: "Soup Starter", icon: "🍲", blurb: "The mirepoix base every good soup begins with.", plants: ["Celery", "Carrot", "Onion", "Leek", "Parsley", "Potato"] },
  { name: "Squash Trio", icon: "🎃", blurb: "Storage winter squash for roasting all season.", plants: ["Butternut Squash", "Acorn Squash", "Spaghetti Squash", "Pumpkin"] },
  { name: "Bean Bounty", icon: "🫘", blurb: "Nitrogen-fixing legumes that enrich the soil as they grow.", plants: ["Green Bean", "Edamame", "Lima Bean", "Fava Bean", "Snap Pea", "Black Bean"] },
  { name: "Pepper Row", icon: "🌶️", blurb: "Mild to fiery — a full heat spectrum in one bed.", plants: ["Bell Pepper", "Jalapeño", "Serrano", "Habanero", "Poblano", "Cayenne"] },
  { name: "Slaw Bed", icon: "🥗", blurb: "Crunchy roots and cabbages for coleslaw and crudités.", plants: ["Cabbage", "Carrot", "Kohlrabi", "Napa Cabbage", "Radish"] },
  { name: "Smoothie Greens", icon: "🥤", blurb: "Nutrient-dense greens and berries to blend up fresh.", plants: ["Kale", "Spinach", "Strawberry", "Blueberry", "Mint"] },
  { name: "Companion Classics", icon: "🤝", blurb: "Time-tested neighbors — basil and marigold protect tomatoes.", plants: ["Tomato", "Basil", "Marigold", "Carrot", "Onion"] },
  { name: "Carrot & Onion Duo", icon: "🧅", blurb: "Onions mask the scent that draws carrot flies — and vice versa.", plants: ["Carrot", "Onion", "Leek", "Chives", "Radish"] },
  { name: "Winter Harvest", icon: "❄️", blurb: "Frost-sweetened crops that hold in the ground through cold.", plants: ["Kale", "Collard Greens", "Brussels Sprouts", "Leek", "Garlic", "Parsnip"] },
  { name: "Aromatics Bed", icon: "🧄", blurb: "The alliums that flavor nearly every dish you cook.", plants: ["Garlic", "Onion", "Shallot", "Leek", "Chives", "Scallion"] },
  { name: "Asian Greens", icon: "🥬", blurb: "Fast, tender greens for stir-fries and soups.", plants: ["Bok Choy", "Napa Cabbage", "Mustard Greens", "Watercress", "Daikon"] },
  { name: "Melon Patch", icon: "🍈", blurb: "Sprawling, sun-hungry melons for peak-summer sweetness.", plants: ["Watermelon", "Cantaloupe", "Honeydew", "Corn", "Radish"] },
  { name: "Nightshade Bed", icon: "🍅", blurb: "Keep the whole nightshade family together for easy rotation.", plants: ["Tomato", "Pepper", "Eggplant", "Tomatillo", "Potato"] },
  { name: "Strawberry Companions", icon: "🍓", blurb: "Friends that boost berry yield and keep pests away.", plants: ["Strawberry", "Borage", "Thyme", "Chives", "Spinach"] },
];

const findItem = (name) => produceData.find((p) => p.name.toLowerCase() === name.toLowerCase());
const inCatalog = (name) => !!findItem(name);

export const GuildTemplatesCard = memo(function GuildTemplatesCard({ theme, savedPlants, onSavePlant, onOpenPlant }) {
  const [expanded, setExpanded] = useState(null);
  const [visible, setVisible] = useState(4);
  const owned = new Set((savedPlants || []).map((n) => n.toLowerCase()));

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Proven plant combos that grow better together. Tap a combo to see its plants and add the ones you want.
      </Text>

      <View style={{ gap: 8, marginTop: 14 }}>
        {GUILDS.slice(0, visible).map((guild) => {
          const open = expanded === guild.name;
          const plants = guild.plants.filter(inCatalog);
          const haveCount = plants.filter((p) => owned.has(p.toLowerCase())).length;
          return (
            <View key={guild.name} style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, borderWidth: 1, borderColor: open ? "rgba(92,255,137,0.3)" : "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <Pressable onPress={() => setExpanded(open ? null : guild.name)} style={{ flexDirection: "row", alignItems: "center", gap: 11, padding: 12 }}>
                <Text style={{ fontSize: 22 }}>{guild.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14.5, fontWeight: "900" }}>{guild.name}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 11.5, fontWeight: "700", marginTop: 1 }}>{plants.length} plants · {haveCount} in your garden</Text>
                </View>
                <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900" }}>{open ? "▾" : "▸"}</Text>
              </Pressable>
              {open ? (
                <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                  <Text style={{ color: theme.secondaryText, fontSize: 12.5, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>{guild.blurb}</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {plants.map((p) => {
                      const item = findItem(p);
                      const img = item ? resolvePlantImageSource(item) : null;
                      const have = owned.has(p.toLowerCase());
                      return (
                        <Pressable
                          key={p}
                          onPress={() => { if (have) { if (item && onOpenPlant) onOpenPlant(item); } else if (onSavePlant) { onSavePlant(item?.name || p); } }}
                          style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: have ? "rgba(92,255,137,0.15)" : "rgba(255,255,255,0.05)", borderRadius: 999, paddingLeft: img ? 5 : 11, paddingRight: 11, paddingVertical: 6, borderWidth: 1, borderColor: have ? "rgba(92,255,137,0.35)" : "rgba(255,255,255,0.12)" }}
                        >
                          {img ? (
                            <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                              <Image source={img} style={{ width: 20, height: 20 }} resizeMode="contain" />
                            </View>
                          ) : null}
                          <Text style={{ color: have ? "#8effab" : "#d7ebdc", fontSize: 12.5, fontWeight: "800" }}>{have ? "✓ " : "+ "}{p}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {GUILDS.length > visible ? (
        <Pressable
          onPress={() => setVisible((c) => c + 4)}
          style={{ marginTop: 12, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 16, paddingVertical: 13, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
        >
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>Show more combos ({GUILDS.length - visible} more)</Text>
        </Pressable>
      ) : null}
    </View>
  );
})
