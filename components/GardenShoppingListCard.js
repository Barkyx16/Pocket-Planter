import { memo, useState } from "react";
import { Image, Linking, Pressable, Share, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource, tapHaptic } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

const imgFor = (name) => {
  const item = produceData.find((p) => p.name === name);
  return item ? resolvePlantImageSource(item) : null;
};

export const GardenShoppingListCard = memo(function GardenShoppingListCard({ theme, gardenAreas, zip }) {
  const { t } = useTranslation();
  const plantNames = Array.from(new Set(
    (gardenAreas || []).flatMap((a) => Object.values(a.plots || {}).filter(Boolean))
  ));
  const [visible, setVisible] = useState(6);
  if (!plantNames.length) return null;

  const shareList = async () => {
    try {
      tapHaptic("light");
      const lines = [
        "🛒 My Pocket Planter shopping list:",
        "",
        ...plantNames.map((n) => `• ${n} seeds`),
        "• Compost / potting mix",
        "• Balanced fertilizer",
        "• Mulch",
        "",
        "Planned in Pocket Planter 🌱",
      ];
      await Share.share({ message: lines.join("\n") });
    } catch (e) { console.log("Share list skipped:", e); }
  };

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 19, marginTop: 2 }}>
        {plantNames.length} plant{plantNames.length === 1 ? "" : "s"} {t("gardenShoppingList.plantedAcrossYourGardenRestock")}
      </Text>

      <View style={{ gap: 6, marginTop: 12 }}>
        {plantNames.slice(0, visible).map((name) => {
          const img = imgFor(name);
          return (
          <View key={name} style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
            {img ? (
              <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <Image source={img} style={{ width: 26, height: 26 }} resizeMode="contain" />
              </View>
            ) : (
              <View style={{ width: 6, height: 6, borderRadius: 4, backgroundColor: "#5cff89" }} />
            )}
            <Text numberOfLines={1} style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: "800" }}>{name}</Text>
            <Pressable
              onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(name + " seeds")}`)}
              accessibilityRole="button"
              accessibilityLabel={`Shop for ${name} seeds`}
              style={{ backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}
            >
              <IconText label={t("gardenShoppingList.seeds")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900"
}} />
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(name + " fertilizer")}`)}
              accessibilityRole="button"
              accessibilityLabel={`Shop for ${name} fertilizer`}
              style={{ backgroundColor: "rgba(255, 216, 107, 0.1)", borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255, 216, 107, 0.2)" }}
            >
              <IconText label={t("gardenShoppingList.feed")} style={{
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900"
}} />
            </Pressable>
          </View>
          );
        })}
      </View>

      {plantNames.length > visible ? (
        <Pressable
          onPress={() => setVisible((c) => c + 8)}
          style={{ marginTop: 10, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
        >
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>{t("gardenShoppingList.showMorePlants")}{plantNames.length - visible} {t("gardenShoppingList.more")}</Text>
        </Pressable>
      ) : null}

      <IconText label={t("gardenShoppingList.dontForgetTheBasicsCompost")} style={{
  color: theme.secondaryText,
  fontSize: 12,
  fontWeight: "600",
  lineHeight: 17,
  marginTop: 10
}} />

      <Pressable onPress={shareList} accessibilityRole="button" style={{ marginTop: 12, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}>
        <IconText label={t("gardenShoppingList.shareCopyList")} style={{
  color: "#07120b",
  fontWeight: "900",
  fontSize: 14
}} />
      </Pressable>
    </View>
  );
})
