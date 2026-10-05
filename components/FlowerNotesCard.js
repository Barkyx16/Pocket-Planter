import { memo } from "react";
import { Text, View } from "react-native";
import { normalizeType } from "../core";
import { DEADHEAD_DEFAULT, DEADHEAD_TIPS, EVENING_SCENTED, FLOWER_COLORS, FRAGRANT } from "../data/flowerHomeData";
import { useTranslation } from "../lib/i18n";
import { styles } from "../styles";
import { IconText } from "./IconText";

// Bloom colors, scent and a deadheading tip for a flower's own page. The data
// had been authored in data/flowerHomeData for a while with nothing reading it.
const SWATCHES = {
  red: "#e5484d", pink: "#f38fb6", white: "#f4f1ea", yellow: "#f5d547",
  purple: "#9b6bd6", orange: "#f2913d", blue: "#5b8def",
};

// i18n-ignore — builds a key, not text.
const tipKey = (name) =>
  "deadheadTip." +
  String(name).replace(/\s*\([^)]*\)/g, "").replace(/['’]/g, "").split(/[^A-Za-z0-9]+/).filter(Boolean)
    .map((w, i) => (i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join("");
export { tipKey as deadheadTipKey };

export function hasFlowerNotes(item) {
  return normalizeType(item?.type, item?.name) === "Flowers";
}

export const FlowerNotesCard = memo(function FlowerNotesCard({ theme, plant }) {
  const { t } = useTranslation();
  if (!hasFlowerNotes(plant)) return null;
  const name = plant.name;
  const colors = FLOWER_COLORS[name] || [];
  const fragrant = FRAGRANT.has(name);
  const evening = EVENING_SCENTED.has(name);
  const tip = DEADHEAD_TIPS[name] ? t(tipKey(name)) : t("deadheadTip.default");
  const englishTip = DEADHEAD_TIPS[name] || DEADHEAD_DEFAULT;

  return (
    <View style={styles.card}>
      <IconText label={t("flowerNotes.title")} style={styles.cardEyebrow} />
      {colors.length ? (
        <View style={{ marginTop: 8 }}>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "900", letterSpacing: 0.6 }}>{t("flowerNotes.colors")}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {colors.map((c) => (
              <View key={c} style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: SWATCHES[c] || "#888", borderWidth: 1, borderColor: "rgba(0,0,0,0.25)" }} />
                <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800" }}>{t(`flowerColor.${c}`)}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
      {fragrant ? (
        <Text style={{ color: "#ffb6c1", fontSize: 12, fontWeight: "800", lineHeight: 17, marginTop: 12 }}>
          {evening ? `🌙 ${t("flowerNotes.eveningScented")}` : `🌸 ${t("flowerNotes.fragrant")}`}
        </Text>
      ) : null}
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginTop: 12 }}>✂️ {t("flowerNotes.deadheading")}</Text>
      <Text style={[styles.cardText, { marginTop: 4 }]}>{tip.startsWith("deadheadTip.") ? englishTip : tip}</Text>
    </View>
  );
});
