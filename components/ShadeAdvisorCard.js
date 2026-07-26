import { memo } from "react";
import { Text, View } from "react-native";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

// Rough height class by plant name keyword.
const TALL = ["corn", "tomato", "sunflower", "pole bean", "bean, pole", "okra", "trellis", "pea", "amaranth", "sorghum"];
const SHORT_SUN = ["lettuce", "spinach", "arugula", "radish", "carrot", "beet", "basil", "cilantro", "strawberry", "bush bean", "pepper"];

const isTall = (n) => TALL.some((t) => n.includes(t));
const isShortSunLover = (n) => SHORT_SUN.some((s) => n.includes(s));

export const ShadeAdvisorCard = memo(function ShadeAdvisorCard({ theme, gardenAreas }) {
  const { t } = useTranslation();
  const warnings = [];
  (gardenAreas || []).forEach((area) => {
    const plants = Array.from(new Set(Object.values(area.plots || {}).filter(Boolean)));
    const talls = plants.filter((p) => isTall(p.toLowerCase()));
    const shorts = plants.filter((p) => isShortSunLover(p.toLowerCase()) && !isTall(p.toLowerCase()));
    if (talls.length && shorts.length) {
      warnings.push({ area: area.name, emoji: area.emoji || "🌿", talls, shorts });
    }
  });

  if (!warnings.length) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("shadeAdvisor.noShadingRisksSpottedYour")}
      </Text>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("shadeAdvisor.tallPlantsCanCastShade")}
      </Text>

      <View style={{ gap: 8, marginTop: 14 }}>
        {warnings.map((w) => (
          <View key={w.area} style={{ backgroundColor: "rgba(255, 216, 107, 0.08)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255, 216, 107, 0.24)" }}>
            <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900" }}>{w.emoji} {w.area}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 6 }}>
              <Text style={{ color: theme.text, fontWeight: "900" }}>{w.talls.join(", ")}</Text> {t("shadeAdvisor.mayShade")} <Text style={{ color: theme.text, fontWeight: "900" }}>{w.shorts.join(", ")}</Text>.
            </Text>
            <IconText label={t("shadeAdvisor.moveTheTallCropsTo")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "800",
  lineHeight: 17,
  marginTop: 6
}} />
          </View>
        ))}
      </View>
    </View>
  );
})
