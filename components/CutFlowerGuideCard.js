import { memo, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { t, tn, useLanguage } from "../lib/i18n";
import produceData from "../data/produceData";
import { normalizeType, resolvePlantImageSource, tapHaptic } from "../core";
import { DRIES_WELL } from "../data/flowerHomeData";

// Vase life (days) + a conditioning tip for common cut flowers. Anything not
// listed falls back to a sensible default so every saved flower still shows.
const VASE = {
  Rose: [7, "Recut stems under water at an angle; strip leaves below the waterline."],
  Sunflower: [7, "Heavy drinkers — top the vase up daily and keep out of direct sun."],
  Zinnia: [7, "Do the 'wiggle test' — only cut stems that feel stiff, not floppy."],
  Dahlia: [5, "Sear stem ends in hot water for 7 seconds to keep them from wilting."],
  Snapdragon: [7, "Keep upright — the tips bend toward light and set that way."],
  "Sweet Pea": [4, "Short but sweet; pick often and they'll keep flowering."],
  Cosmos: [5, "Cut when buds are just cracking open for the longest life."],
  Ranunculus: [7, "One of the longest-lasting cut flowers — change water often."],
  Tulip: [7, "Tulips keep growing in the vase; wrap them to keep stems straight."],
  Peony: [5, "Harvest at the soft 'marshmallow' bud stage; they open in the vase."],
  Lily: [10, "Snip the pollen anthers to avoid stains and extend the blooms."],
  Gladiolus: [8, "Remove the top bud so the lower florets open evenly."],
  Freesia: [7, "Wonderfully fragrant; cut when the first floret shows color."],
  Delphinium: [5, "Tall spires — support them and keep the water topped up."],
  Larkspur: [5, "Cut when a third of the spike is open."],
  Hydrangea: [5, "If it wilts, submerge the whole head in cool water to revive it."],
  Aster: [7, "Reliable and long-lasting; strip lower foliage to keep water clean."],
  Yarrow: [8, "Dries beautifully too — hang upside down for everlasting bouquets."],
  "Black-Eyed Susan": [7, "Cheerful and tough; change the water every couple of days."],
  Calendula: [6, "Cut in the cool of the morning for the best vase life."],
  Stock: [7, "Very fragrant; recut and refresh water to fight the strong stem smell."],
  Anemone: [6, "Keep cool — they last far longer out of warm rooms."],
  Coreopsis: [6, "Pinch spent blooms and the plant keeps producing stems."],
};
const DEFAULT_VASE = [6, "Cut in the cool morning, strip lower leaves, and recut stems under water."];

export const CutFlowerGuideCard = memo(function CutFlowerGuideCard({ theme, savedPlants, onOpenPlant }) {
  useLanguage(); // memo() skips a language switch without this (see lib/i18n)
  const flowers = useMemo(() => {
    return (savedPlants || [])
      .map((name) => produceData.find((p) => p.name === name))
      .filter((p) => p && normalizeType(p.type, p.name) === "Flowers");
  }, [savedPlants]);

  const [bouquet, setBouquet] = useState([]);
  const toggle = (name) => {
    tapHaptic("light");
    setBouquet((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : cur.length >= 5 ? cur : [...cur, name]));
  };

  const info = (name) => VASE[name] || DEFAULT_VASE;
  const bouquetLife = bouquet.length ? Math.min(...bouquet.map((n) => info(n)[0])) : 0;

  if (!flowers.length) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("care.cutEmpty")}
      </Text>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("care.cutIntro")}
      </Text>

      {/* Vase-life list */}
      <View style={{ gap: 8, marginTop: 14 }}>
        {flowers.map((item) => {
          const [days, tip] = info(item.name);
          const img = resolvePlantImageSource(item);
          return (
            <Pressable
              key={item.name}
              onPress={() => onOpenPlant && onOpenPlant(item)}
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌸</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{item.name}</Text>
                  <Text style={{ color: "#ffb6c1", fontSize: 12, fontWeight: "900" }}>{tn("care.cutDays", days)}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 16, marginTop: 2 }}>{tip}</Text>
                {DRIES_WELL[item.name] ? (
                  <Text style={{ color: "#bf7a12", fontSize: 11, fontWeight: "800", lineHeight: 15, marginTop: 3 }}>{t("care.cutDries", { how: DRIES_WELL[item.name] })}</Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Bouquet builder */}
      <Text style={{ color: "#ffb6c1", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginTop: 18, marginBottom: 8 }}>{t("care.cutBouquet")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 2 }}>
        {flowers.map((item) => {
          const active = bouquet.includes(item.name);
          return (
            <Pressable key={item.name} onPress={() => toggle(item.name)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: active ? "#ffb6c1" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#ffb6c1" : "rgba(255,255,255,0.12)" }}>
              <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{active ? "✓ " : ""}{item.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={{ marginTop: 10, backgroundColor: "rgba(255,182,193,0.1)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255,182,193,0.28)" }}>
        {bouquet.length ? (
          <>
            <Text style={{ color: theme.text, fontSize: 13, fontWeight: "900" }}>{bouquet.join(" · ")}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4 }}>
              {t("care.cutBouquetSummary", { types: tn("care.cutStemTypes", bouquet.length), days: tn("care.cutDaysPlain", bouquetLife) })}
            </Text>
          </>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>{t("care.cutTapFew")}</Text>
        )}
      </View>
    </View>
  );
});
