import { memo, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { isFlowerBedPlant, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

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

  // ── Flower-bed combos (for the Flower Bed & Home Garden) ──
  { name: "Cottage Garden", icon: "🌸", blurb: "A romantic, informal mix of tall classic blooms for a flower bed.", plants: ["Rose", "Foxglove", "Delphinium", "Hollyhock", "Peony", "Larkspur"] },
  { name: "Pollinator Blooms", icon: "🐝", blurb: "Nectar-rich flowers that keep bees and butterflies coming all season.", plants: ["Bee Balm", "Coneflower", "Black-Eyed Susan", "Yarrow", "Cosmos", "Zinnia"] },
  { name: "Cutting Garden", icon: "💐", blurb: "Long-stemmed favorites bred for the vase — cut them and they bloom more.", plants: ["Dahlia", "Zinnia", "Snapdragon", "Sunflower", "Cosmos", "Sweet Pea"] },
  { name: "Spring Bulbs", icon: "🌷", blurb: "Plant in fall for the first big splash of color after winter.", plants: ["Tulip", "Daffodil", "Crocus", "Hyacinth", "Anemone", "Ranunculus"] },
  { name: "Shade Blooms", icon: "🌿", blurb: "Color for the cooler, shadier corners where sun-lovers sulk.", plants: ["Hosta", "Impatiens", "Hellebore", "Foxglove", "Fuchsia"] },
  { name: "Fragrant Garden", icon: "🌼", blurb: "Scented shrubs and flowers to perfume a patio or path.", plants: ["Lavender", "Jasmine", "Gardenia", "Lilac", "Rose", "Sweet Alyssum"] },

  // ── Expanded-catalog combos (culinary, orchard, houseplant) ──
  { name: "Guacamole Garden", icon: "🥑", blurb: "Everything for a bowl of fresh guac.", plants: ["Avocado","Tomato","Onion","Cilantro","Jalapeño","Lime"] },
  { name: "Gumbo Bed", icon: "🥘", blurb: "The Louisiana 'holy trinity' plus okra to thicken the pot.", plants: ["Okra","Bell Pepper","Celery","Onion","Tomato","Garlic"] },
  { name: "Kimchi Garden", icon: "🌶️", blurb: "Ferment your own kimchi from the bed up.", plants: ["Napa Cabbage","Daikon","Scallion","Garlic","Ginger","Mustard Greens"] },
  { name: "Borscht Bed", icon: "🥣", blurb: "Beets and roots for a ruby-red Eastern European soup.", plants: ["Beet","Cabbage","Carrot","Onion","Potato","Dill"] },
  { name: "Poke Bowl", icon: "🍚", blurb: "Crisp, fresh toppings for a homemade poke bowl.", plants: ["Edamame","Cucumber","Radish","Scallion","Avocado","Ginger"] },
  { name: "Chili Pot", icon: "🌶️", blurb: "Beans, tomatoes, and heat for a big pot of chili.", plants: ["Kidney Bean","Pinto Bean","Tomato","Bell Pepper","Onion","Cayenne"] },
  { name: "Falafel Fixings", icon: "🧆", blurb: "Chickpeas and herbs for falafel and hummus.", plants: ["Chickpea","Parsley","Cilantro","Garlic","Onion","Lemon"] },
  { name: "Pesto Patch", icon: "🌿", blurb: "Blend up a jar of bright green basil pesto.", plants: ["Basil","Garlic","Pine Nut","Arugula","Parsley"] },
  { name: "Thai Kitchen", icon: "🍜", blurb: "Aromatic Thai staples for curry paste and stir-fries.", plants: ["Thai Chili Pepper","Lemongrass","Kaffir Lime","Holy Basil (Tulsi)","Cilantro","Galangal"] },
  { name: "Antipasto Bed", icon: "🫒", blurb: "A Mediterranean grazing board, homegrown.", plants: ["Olive","Bell Pepper","Cherry Tomato","Basil","Garlic","Artichoke"] },
  { name: "Backyard Orchard", icon: "🍎", blurb: "A mix of hardy fruit trees for months of harvest.", plants: ["Apple","Pear","Peach","Plum","Cherry","Apricot"] },
  { name: "Citrus Grove", icon: "🍊", blurb: "Sun-loving citrus for juice, zest, and marmalade.", plants: ["Orange","Lemon","Lime","Grapefruit","Mandarin","Kumquat"] },
  { name: "Tropical Grove", icon: "🥭", blurb: "Frost-free favorites for a taste of the tropics.", plants: ["Mango","Papaya","Banana","Pineapple","Guava","Passionfruit"] },
  { name: "Nut Grove", icon: "🌰", blurb: "Long-lived trees for homegrown nuts.", plants: ["Almond","Walnut","Pecan","Hazelnut","Chestnut","Pistachio"] },
  { name: "Vineyard Row", icon: "🍇", blurb: "Trellised vines for grapes and kiwi.", plants: ["Grapes","Concord Grape","Muscadine Grape","Kiwi"] },
  { name: "Cocktail Garden", icon: "🍹", blurb: "Muddle-worthy herbs and fruit for garden cocktails.", plants: ["Mint","Lime","Lemon","Basil","Cucumber","Lavender"] },
  { name: "Medicinal Corner", icon: "💊", blurb: "Time-honored healing herbs to dry and steep.", plants: ["Chamomile","Coneflower","Calendula","Lemon Balm","Valerian","Feverfew"] },
  { name: "Baking Spices", icon: "🥧", blurb: "Warm spices and aromatics for pies and cakes.", plants: ["Cinnamon","Ginger","Nutmeg","Vanilla","Cardamom","Anise"] },
  { name: "Low-Light Desk", icon: "🪴", blurb: "Tough houseplants that thrive in dim corners.", plants: ["Snake Plant","Pothos","ZZ Plant","Cast Iron Plant","Peace Lily"] },
  { name: "Succulent Shelf", icon: "🌵", blurb: "Low-water succulents for a sunny windowsill.", plants: ["Aloe Vera","Jade Plant","Echeveria","Haworthia","Burro's Tail","Lithops (Living Stones)"] },
  { name: "Air-Purifying Set", icon: "🌬️", blurb: "Easy houseplants that help clean indoor air.", plants: ["Snake Plant","Peace Lily","Spider Plant","Areca Palm","English Ivy"] },
  { name: "Statement Foliage", icon: "🍃", blurb: "Big, bold leaves to anchor a bright room.", plants: ["Monstera","Fiddle Leaf Fig","Bird of Paradise","Rubber Plant","Philodendron"] },
  { name: "Butterfly Buffet", icon: "🦋", blurb: "A nectar bar that keeps butterflies visiting all summer.", plants: ["Buddleia (Butterfly Bush)","Bee Balm","Zinnia","Cosmos","Verbena","Coneflower"] },
];

const findItem = (name) => produceData.find((p) => p.name.toLowerCase() === name.toLowerCase());
const inCatalog = (name) => !!findItem(name);

export const GuildTemplatesCard = memo(function GuildTemplatesCard({ theme, savedPlants, onSavePlant, onSaveMany, onAddSetup, onOpenPlant, mode = "garden" }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);
  const [visible, setVisible] = useState(4);
  const owned = new Set((savedPlants || []).map((n) => n.toLowerCase()));

  // Combos are strictly separated by garden: the Flowers & Home tab only ever shows
  // flower/houseplant combos, the Garden tab only edible ones. A mixed combo (say
  // tomatoes + marigold) is trimmed to just the members that belong in THIS garden,
  // and is dropped entirely if fewer than two survive — so you can never plant a
  // flower into a garden bed (or a vegetable into a flower bed) via a combo.
  const belongsHere = (name) => (mode === "flower" ? isFlowerBedPlant(name) : !isFlowerBedPlant(name));
  const guilds = useMemo(
    () => GUILDS
      .map((g) => ({ ...g, plants: g.plants.filter(inCatalog).filter(belongsHere) }))
      .filter((g) => g.plants.length >= 2),
    [mode]
  );

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("guildTemplates.provenPlantCombosThatGrow")}
      </Text>

      <View style={{ gap: 8, marginTop: 14 }}>
        {guilds.slice(0, visible).map((guild) => {
          const open = expanded === guild.name;
          const plants = guild.plants;
          const haveCount = plants.filter((p) => owned.has(p.toLowerCase())).length;
          return (
            <View key={guild.name} style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, borderWidth: 1, borderColor: open ? "rgba(92, 255, 137, 0.3)" : "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
              <Pressable onPress={() => setExpanded(open ? null : guild.name)} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12 }}>
                <Text style={{ fontSize: 20 }}>{guild.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{guild.name}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{plants.length} {t("guildTemplates.plants")} {haveCount} {t("guildTemplates.inYourGarden")}</Text>
                </View>
                <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900" }}>{open ? "▾" : "▸"}</Text>
              </Pressable>
              {open ? (
                <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>{guild.blurb}</Text>
                  {onAddSetup ? (
                    <Pressable
                      onPress={() => onAddSetup(guild.name, plants)}
                      accessibilityRole="button"
                      accessibilityLabel={`Plant the ${guild.name} setup as a new garden bed`}
                      style={{ marginBottom: 12, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 11, alignItems: "center" }}
                    >
                      <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>🌱 Plant this setup in my garden</Text>
                    </Pressable>
                  ) : onSaveMany && plants.some((p) => !owned.has(p.toLowerCase())) ? (
                    <Pressable
                      onPress={() => onSaveMany(plants)}
                      accessibilityRole="button"
                      accessibilityLabel={`Add all ${guild.name} plants to your plants`}
                      style={{ marginBottom: 12, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 11, alignItems: "center" }}
                    >
                      <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>＋ Add all to my plants</Text>
                    </Pressable>
                  ) : null}
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {plants.map((p) => {
                      const item = findItem(p);
                      const img = item ? resolvePlantImageSource(item) : null;
                      const have = owned.has(p.toLowerCase());
                      return (
                        <Pressable
                          key={p}
                          onPress={() => { if (have) { if (item && onOpenPlant) onOpenPlant(item); } else if (onSavePlant) { onSavePlant(item?.name || p); } }}
                          style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: have ? "rgba(92, 255, 137, 0.16)" : "rgba(255, 255, 255, 0.06)", borderRadius: 999, paddingLeft: img ? 5 : 11, paddingRight: 12, paddingVertical: 6, borderWidth: 1, borderColor: have ? "rgba(92, 255, 137, 0.3)" : "rgba(255, 255, 255, 0.12)" }}
                        >
                          {img ? (
                            <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                              <Image source={img} style={{ width: 20, height: 20 }} resizeMode="contain" />
                            </View>
                          ) : null}
                          <Text style={{ color: have ? "#8effab" : "#d7ebdc", fontSize: 12, fontWeight: "800" }}>{have ? "✓ " : "+ "}{p}</Text>
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

      {guilds.length > visible ? (
        <Pressable
          onPress={() => setVisible((c) => c + 4)}
          style={{ marginTop: 12, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
        >
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>{t("guildTemplates.showMoreCombos")}{guilds.length - visible} {t("guildTemplates.more")}</Text>
        </Pressable>
      ) : null}
    </View>
  );
})
