import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { BloomSuccessionSection } from "./BloomSuccessionSection";
import { useTranslation } from "../lib/i18n";

const findItem = (name) => produceData.find((p) => p.name.toLowerCase() === String(name).toLowerCase());

// `name` is a plant name (matched against produceData, never translated);
// `attracts` and `note` are translation keys, resolved at render.
// i18n-ignore
const POLLINATOR_PLANTS = [
  { name: "Marigold", icon: "🌼", attracts: "pollinatorText.marigoldAttracts", note: "pollinatorText.marigoldNote" },
  { name: "Lavender", icon: "💜", attracts: "pollinatorText.lavenderAttracts", note: "pollinatorText.lavenderNote" },
  { name: "Borage", icon: "💙", attracts: "pollinatorText.borageAttracts", note: "pollinatorText.borageNote" },
  { name: "Sunflower", icon: "🌻", attracts: "pollinatorText.sunflowerAttracts", note: "pollinatorText.sunflowerNote" },
  { name: "Zinnia", icon: "🌸", attracts: "pollinatorText.zinniaAttracts", note: "pollinatorText.zinniaNote" },
  { name: "Bee Balm", icon: "🌺", attracts: "pollinatorText.beeBalmAttracts", note: "pollinatorText.beeBalmNote" },
  { name: "Cosmos", icon: "🌷", attracts: "pollinatorText.cosmosAttracts", note: "pollinatorText.cosmosNote" },
  { name: "Calendula", icon: "🧡", attracts: "pollinatorText.calendulaAttracts", note: "pollinatorText.calendulaNote" },
  { name: "Dill", icon: "🌿", attracts: "pollinatorText.dillAttracts", note: "pollinatorText.dillNote" },
  { name: "Yarrow", icon: "🤍", attracts: "pollinatorText.yarrowAttracts", note: "pollinatorText.yarrowNote" },
];

export const PollinatorPlannerCard = memo(function PollinatorPlannerCard({ theme, savedPlants, onOpenPlant }) {
  const { t } = useTranslation();
  const owned = new Set((savedPlants || []).map((n) => String(n).toLowerCase()));
  const alreadyGrowing = POLLINATOR_PLANTS.filter((p) => owned.has(p.name.toLowerCase()));
  const toAdd = POLLINATOR_PLANTS.filter((p) => !owned.has(p.name.toLowerCase()));

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("pollinatorPlanner.pollinatorsMeanBetterFruitSet")}
      </Text>

      {alreadyGrowing.length ? (
        <View style={{ marginTop: 14, backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800" }}>
            {t("pollinatorPlanner.youreAlreadyGrowing")} {alreadyGrowing.map((p) => `${p.icon} ${p.name}`).join(", ")} {t("pollinatorPlanner.niceYourPollinatorsAreCovered")}
          </Text>
        </View>
      ) : null}

      <IconText label={t("pollinatorPlanner.greatAdditions")} style={{
  color: "#ffd86b",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginTop: 16,
  marginBottom: 10
}} />
      <View style={{ gap: 8 }}>
        {toAdd.map((p) => {
          const item = findItem(p.name);
          const img = item ? resolvePlantImageSource(item) : null;
          return (
            <Pressable
              key={p.name}
              onPress={() => { if (item && onOpenPlant) onOpenPlant(item); }}
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>{p.icon}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{p.name}</Text>
                  <Text style={{ color: "#ffd86b", fontSize: 10, fontWeight: "800" }}>{t(p.attracts)}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 16, marginTop: 2 }}>{t(p.note)}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Bloom succession timeline — spot & fill nectar gaps */}
      <BloomSuccessionSection theme={theme} savedPlants={savedPlants} onOpenPlant={onOpenPlant} />
    </View>
  );
})
