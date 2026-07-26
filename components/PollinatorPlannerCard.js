import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";
import { IconText } from "./IconText";
import { BloomSuccessionSection } from "./BloomSuccessionSection";
import { useTranslation } from "../lib/i18n";

const findItem = (name) => produceData.find((p) => p.name.toLowerCase() === String(name).toLowerCase());

const POLLINATOR_PLANTS = [
  { name: "Marigold", icon: "🌼", attracts: "Bees, hoverflies", note: "Also repels aphids & nematodes — great veggie companion." },
  { name: "Lavender", icon: "💜", attracts: "Bees, butterflies", note: "Drought-tough perennial that blooms for months." },
  { name: "Borage", icon: "💙", attracts: "Bees", note: "A bee magnet that also improves tomato & strawberry growth." },
  { name: "Sunflower", icon: "🌻", attracts: "Bees, birds", note: "Pollen powerhouse; seeds feed birds in fall." },
  { name: "Zinnia", icon: "🌸", attracts: "Butterflies, bees", note: "Easy, colorful, and blooms all summer." },
  { name: "Bee Balm", icon: "🌺", attracts: "Bees, hummingbirds", note: "Native perennial loved by pollinators of all kinds." },
  { name: "Cosmos", icon: "🌷", attracts: "Bees, lacewings", note: "Airy blooms that draw pest-eating beneficials too." },
  { name: "Calendula", icon: "🧡", attracts: "Hoverflies, bees", note: "Hoverfly larvae devour aphids — a natural pest control." },
  { name: "Dill", icon: "🌿", attracts: "Lacewings, wasps", note: "Lets it flower to draw aphid-hunting beneficial insects." },
  { name: "Yarrow", icon: "🤍", attracts: "Ladybugs, lacewings", note: "Insectary plant that hosts a small army of pest predators." },
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
                  <Text style={{ color: "#ffd86b", fontSize: 10, fontWeight: "800" }}>{p.attracts}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 16, marginTop: 2 }}>{p.note}</Text>
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
