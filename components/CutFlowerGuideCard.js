import { memo, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import produceData from "../data/produceData";
import { normalizeType, resolvePlantImageSource, tapHaptic } from "../core";
import { DRIES_WELL } from "../data/flowerHomeData";
import { useTranslation } from "../lib/i18n";

// DRIES_WELL (data/flowerHomeData) is English; its text is translated by flower at render.
const DRY_KEYS = {
  Yarrow: "yarrow", Lavender: "lavender", Statice: "statice", Strawflower: "strawflower", Hydrangea: "hydrangea",
  Gomphrena: "gomphrena", "Bee Balm": "beeBalm", Cosmos: "cosmos", Rose: "rose", Zinnia: "zinnia", Larkspur: "larkspur",
  Delphinium: "delphinium", "Celosia (Cockscomb)": "celosia", "Baby's Breath": "babysBreath", Nigella: "nigella", Poppy: "poppy",
};

// Vase life (days) + a conditioning tip for common cut flowers. Anything not
// listed falls back to a sensible default so every saved flower still shows.
// The tip is an id: its text lives at cutFlowerText.tip_<id>.
const VASE = {
  Rose: [7, "rose"],
  Sunflower: [7, "sunflower"],
  Zinnia: [7, "zinnia"],
  Dahlia: [5, "dahlia"],
  Snapdragon: [7, "snapdragon"],
  "Sweet Pea": [4, "sweetPea"],
  Cosmos: [5, "cosmos"],
  Ranunculus: [7, "ranunculus"],
  Tulip: [7, "tulip"],
  Peony: [5, "peony"],
  Lily: [10, "lily"],
  Gladiolus: [8, "gladiolus"],
  Freesia: [7, "freesia"],
  Delphinium: [5, "delphinium"],
  Larkspur: [5, "larkspur"],
  Hydrangea: [5, "hydrangea"],
  Aster: [7, "aster"],
  Yarrow: [8, "yarrow"],
  "Black-Eyed Susan": [7, "blackEyedSusan"],
  Calendula: [6, "calendula"],
  Stock: [7, "stock"],
  Anemone: [6, "anemone"],
  Coreopsis: [6, "coreopsis"],
};
const DEFAULT_VASE = [6, "default"];

export const CutFlowerGuideCard = memo(function CutFlowerGuideCard({ theme, savedPlants, onOpenPlant }) {
  const { t, tn } = useTranslation();
  const dryTip = (name) => {
    const key = `cutFlowerText.dry_${DRY_KEYS[name]}`;
    const v = DRY_KEYS[name] ? t(key) : key;
    return v === key ? DRIES_WELL[name] : v;
  };
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
        {t("cutFlowerText.empty")}
      </Text>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("cutFlowerText.intro")}
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
                  <Text style={{ color: "#ffb6c1", fontSize: 12, fontWeight: "900" }}>🏺 {tn("cutFlowerText.vaseDays", days)}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 16, marginTop: 2 }}>{t(`cutFlowerText.tip_${tip}`)}</Text>
                {DRIES_WELL[item.name] ? (
                  <Text style={{ color: "#bf7a12", fontSize: 11, fontWeight: "800", lineHeight: 15, marginTop: 3 }}>🌾 {t("cutFlowerText.driesWell", { tip: dryTip(item.name) })}</Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Bouquet builder */}
      <Text style={{ color: "#ffb6c1", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginTop: 18, marginBottom: 8 }}>💐 {t("cutFlowerText.buildBouquet")}</Text>
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
              {tn("cutFlowerText.bouquetStemTypes", bouquet.length)} · {tn("cutFlowerText.bouquetFresh", bouquetLife)}
            </Text>
          </>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>{t("cutFlowerText.bouquetEmpty")}</Text>
        )}
      </View>
    </View>
  );
});
