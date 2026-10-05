import { memo, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { isFlowerBedPlant, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

// Plant names and ids are data (matched against produceData); display text
// lives in guildTemplatesText.<id>_name / <id>_blurb.
// i18n-ignore
const GUILDS = [
  { id: "threeSisters", icon: "🌽", plants: ["Corn", "Green Bean", "Butternut Squash", "Zucchini"] },
  { id: "salsaGarden", icon: "🌶️", plants: ["Tomato", "Pepper", "Onion", "Cilantro", "Jalapeño"] },
  { id: "pizzaGarden", icon: "🍕", plants: ["Tomato", "Basil", "Oregano", "Pepper", "Onion"] },
  { id: "pollinatorPatch", icon: "🐝", plants: ["Marigold", "Borage", "Lavender", "Chamomile", "Mint"] },
  { id: "saladBowl", icon: "🥗", plants: ["Lettuce", "Spinach", "Arugula", "Radish", "Cucumber"] },
  { id: "herbSpiral", icon: "🌿", plants: ["Basil", "Parsley", "Thyme", "Rosemary", "Mint", "Cilantro"] },

  // ── More combos ──
  { id: "stirFryGarden", icon: "🥢", plants: ["Bok Choy", "Napa Cabbage", "Snap Pea", "Ginger", "Scallion", "Garlic"] },
  { id: "rootCellarMix", icon: "🥕", plants: ["Carrot", "Beet", "Turnip", "Parsnip", "Rutabaga", "Radish"] },
  { id: "brassicaBed", icon: "🥦", plants: ["Broccoli", "Cauliflower", "Cabbage", "Kale", "Brussels Sprouts"] },
  { id: "berryPatch", icon: "🫐", plants: ["Strawberry", "Blueberry", "Blackberry", "Raspberry", "Gooseberry"] },
  { id: "mediterraneanHerbs", icon: "🫒", plants: ["Rosemary", "Thyme", "Oregano", "Sage", "Lavender", "Marjoram"] },
  { id: "tacoNight", icon: "🌮", plants: ["Tomato", "Onion", "Cilantro", "Jalapeño", "Bell Pepper", "Tomatillo"] },
  { id: "ratatouilleBed", icon: "🍆", plants: ["Eggplant", "Zucchini", "Tomato", "Bell Pepper", "Onion", "Garlic"] },
  { id: "curryGarden", icon: "🍛", plants: ["Turmeric", "Ginger", "Cilantro", "Onion", "Garlic", "Habanero"] },
  { id: "teaGarden", icon: "🍵", plants: ["Chamomile", "Mint", "Lavender", "Lemongrass", "Stevia", "Sage"] },
  { id: "coolSeasonGreens", icon: "🥬", plants: ["Lettuce", "Spinach", "Arugula", "Swiss Chard", "Kale", "Mustard Greens"] },
  { id: "picklePatch", icon: "🥒", plants: ["Cucumber", "Dill", "Garlic", "Onion", "Beet"] },
  { id: "soupStarter", icon: "🍲", plants: ["Celery", "Carrot", "Onion", "Leek", "Parsley", "Potato"] },
  { id: "squashTrio", icon: "🎃", plants: ["Butternut Squash", "Acorn Squash", "Spaghetti Squash", "Pumpkin"] },
  { id: "beanBounty", icon: "🫘", plants: ["Green Bean", "Edamame", "Lima Bean", "Fava Bean", "Snap Pea", "Black Bean"] },
  { id: "pepperRow", icon: "🌶️", plants: ["Bell Pepper", "Jalapeño", "Serrano", "Habanero", "Poblano", "Cayenne"] },
  { id: "slawBed", icon: "🥗", plants: ["Cabbage", "Carrot", "Kohlrabi", "Napa Cabbage", "Radish"] },
  { id: "smoothieGreens", icon: "🥤", plants: ["Kale", "Spinach", "Strawberry", "Blueberry", "Mint"] },
  { id: "companionClassics", icon: "🤝", plants: ["Tomato", "Basil", "Marigold", "Carrot", "Onion"] },
  { id: "carrotOnionDuo", icon: "🧅", plants: ["Carrot", "Onion", "Leek", "Chives", "Radish"] },
  { id: "winterHarvest", icon: "❄️", plants: ["Kale", "Collard Greens", "Brussels Sprouts", "Leek", "Garlic", "Parsnip"] },
  { id: "aromaticsBed", icon: "🧄", plants: ["Garlic", "Onion", "Shallot", "Leek", "Chives", "Scallion"] },
  { id: "asianGreens", icon: "🥬", plants: ["Bok Choy", "Napa Cabbage", "Mustard Greens", "Watercress", "Daikon"] },
  { id: "melonPatch", icon: "🍈", plants: ["Watermelon", "Cantaloupe", "Honeydew", "Corn", "Radish"] },
  { id: "nightshadeBed", icon: "🍅", plants: ["Tomato", "Pepper", "Eggplant", "Tomatillo", "Potato"] },
  { id: "strawberryCompanions", icon: "🍓", plants: ["Strawberry", "Borage", "Thyme", "Chives", "Spinach"] },

  // ── Flower-bed combos (for the Flower Bed & Home Garden) ──
  { id: "cottageGarden", icon: "🌸", plants: ["Rose", "Foxglove", "Delphinium", "Hollyhock", "Peony", "Larkspur"] },
  { id: "pollinatorBlooms", icon: "🐝", plants: ["Bee Balm", "Coneflower", "Black-Eyed Susan", "Yarrow", "Cosmos", "Zinnia"] },
  { id: "cuttingGarden", icon: "💐", plants: ["Dahlia", "Zinnia", "Snapdragon", "Sunflower", "Cosmos", "Sweet Pea"] },
  { id: "springBulbs", icon: "🌷", plants: ["Tulip", "Daffodil", "Crocus", "Hyacinth", "Anemone", "Ranunculus"] },
  { id: "shadeBlooms", icon: "🌿", plants: ["Hosta", "Impatiens", "Hellebore", "Foxglove", "Fuchsia"] },
  { id: "fragrantGarden", icon: "🌼", plants: ["Lavender", "Jasmine", "Gardenia", "Lilac", "Rose", "Sweet Alyssum"] },

  // ── Expanded-catalog combos (culinary, orchard, houseplant) ──
  { id: "guacamoleGarden", icon: "🥑", plants: ["Avocado","Tomato","Onion","Cilantro","Jalapeño","Lime"] },
  { id: "gumboBed", icon: "🥘", plants: ["Okra","Bell Pepper","Celery","Onion","Tomato","Garlic"] },
  { id: "kimchiGarden", icon: "🌶️", plants: ["Napa Cabbage","Daikon","Scallion","Garlic","Ginger","Mustard Greens"] },
  { id: "borschtBed", icon: "🥣", plants: ["Beet","Cabbage","Carrot","Onion","Potato","Dill"] },
  { id: "pokeBowl", icon: "🍚", plants: ["Edamame","Cucumber","Radish","Scallion","Avocado","Ginger"] },
  { id: "chiliPot", icon: "🌶️", plants: ["Kidney Bean","Pinto Bean","Tomato","Bell Pepper","Onion","Cayenne"] },
  { id: "falafelFixings", icon: "🧆", plants: ["Chickpea","Parsley","Cilantro","Garlic","Onion","Lemon"] },
  { id: "pestoPatch", icon: "🌿", plants: ["Basil","Garlic","Pine Nut","Arugula","Parsley"] },
  { id: "thaiKitchen", icon: "🍜", plants: ["Thai Chili Pepper","Lemongrass","Kaffir Lime","Holy Basil (Tulsi)","Cilantro","Galangal"] },
  { id: "antipastoBed", icon: "🫒", plants: ["Olive","Bell Pepper","Cherry Tomato","Basil","Garlic","Artichoke"] },
  { id: "backyardOrchard", icon: "🍎", plants: ["Apple","Pear","Peach","Plum","Cherry","Apricot"] },
  { id: "citrusGrove", icon: "🍊", plants: ["Orange","Lemon","Lime","Grapefruit","Mandarin","Kumquat"] },
  { id: "tropicalGrove", icon: "🥭", plants: ["Mango","Papaya","Banana","Pineapple","Guava","Passionfruit"] },
  { id: "nutGrove", icon: "🌰", plants: ["Almond","Walnut","Pecan","Hazelnut","Chestnut","Pistachio"] },
  { id: "vineyardRow", icon: "🍇", plants: ["Grapes","Concord Grape","Muscadine Grape","Kiwi"] },
  { id: "cocktailGarden", icon: "🍹", plants: ["Mint","Lime","Lemon","Basil","Cucumber","Lavender"] },
  { id: "medicinalCorner", icon: "💊", plants: ["Chamomile","Coneflower","Calendula","Lemon Balm","Valerian","Feverfew"] },
  { id: "bakingSpices", icon: "🥧", plants: ["Cinnamon","Ginger","Nutmeg","Vanilla","Cardamom","Anise"] },
  { id: "lowLightDesk", icon: "🪴", plants: ["Snake Plant","Pothos","ZZ Plant","Cast Iron Plant","Peace Lily"] },
  { id: "succulentShelf", icon: "🌵", plants: ["Aloe Vera","Jade Plant","Echeveria","Haworthia","Burro's Tail","Lithops (Living Stones)"] },
  { id: "airPurifyingSet", icon: "🌬️", plants: ["Snake Plant","Peace Lily","Spider Plant","Areca Palm","English Ivy"] },
  { id: "statementFoliage", icon: "🍃", plants: ["Monstera","Fiddle Leaf Fig","Bird of Paradise","Rubber Plant","Philodendron"] },
  { id: "butterflyBuffet", icon: "🦋", plants: ["Buddleia (Butterfly Bush)","Bee Balm","Zinnia","Cosmos","Verbena","Coneflower"] },
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
          const open = expanded === guild.id;
          const guildName = t(`guildTemplatesText.${guild.id}_name`);
          const plants = guild.plants;
          const haveCount = plants.filter((p) => owned.has(p.toLowerCase())).length;
          return (
            <View key={guild.id} style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, borderWidth: 1, borderColor: open ? "rgba(92, 255, 137, 0.3)" : "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
              <Pressable onPress={() => setExpanded(open ? null : guild.id)} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12 }}>
                <Text style={{ fontSize: 20 }}>{guild.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{guildName}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{t("guildTemplatesText.comboStats", { count: plants.length, have: haveCount })}</Text>
                </View>
                <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900" }}>{open ? "▾" : "▸"}</Text>
              </Pressable>
              {open ? (
                <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 10 }}>{t(`guildTemplatesText.${guild.id}_blurb`)}</Text>
                  {onAddSetup ? (
                    <Pressable
                      onPress={() => onAddSetup(guildName, plants)}
                      accessibilityRole="button"
                      accessibilityLabel={t("guildTemplatesText.plantSetupA11y", { name: guildName })}
                      style={{ marginBottom: 12, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 11, alignItems: "center" }}
                    >
                      <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>🌱 {t("guildTemplatesText.plantSetup")}</Text>
                    </Pressable>
                  ) : onSaveMany && plants.some((p) => !owned.has(p.toLowerCase())) ? (
                    <Pressable
                      onPress={() => onSaveMany(plants)}
                      accessibilityRole="button"
                      accessibilityLabel={t("guildTemplatesText.addAllA11y", { name: guildName })}
                      style={{ marginBottom: 12, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 11, alignItems: "center" }}
                    >
                      <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>＋ {t("guildTemplatesText.addAll")}</Text>
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
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>{t("guildTemplatesText.showMore", { count: guilds.length - visible })}</Text>
        </Pressable>
      ) : null}
    </View>
  );
})
