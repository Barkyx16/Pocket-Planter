import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../styles";
import { localizeTemperatures } from "../core";
import { getDiseaseImage } from "../data/diseaseImageMap";
import { IconText } from "./IconText";
import { t, useLanguage } from "../lib/i18n";

// Disease counterpart of PestDetailScreen. Same layout and section rhythm, but
// amber-themed (matching the "Common Diseases" section) and with disease-shaped
// fields — Type and Favorable conditions replace the pest's active-months
// calendar, since diseases are condition-driven, not calendar-driven.
const AMBER = "#ffcf8b";

export const DiseaseDetailScreen = memo(function DiseaseDetailScreen({ theme, disease, onBack, onOpenPlant, unitSystem }) {
  useLanguage(); // memo() skips a language switch without this (see lib/i18n)
  if (!disease) return null;

  // Affected = the user's own plants this disease hits (passed in from the plant
  // detail); targets = the general list from the library.
  const affected = Array.isArray(disease.affected) ? disease.affected : [];
  const targets = Array.isArray(disease.targets) ? disease.targets : [];
  const img = getDiseaseImage(disease.name);

  const Section = ({ icon, title, text, color }) =>
    text ? (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardEyebrow, color ? { color } : null]}>{icon} {title}</Text>
        <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 6 }]}>{text}</Text>
      </View>
    ) : null;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
      {/* BACK */}
      <View style={styles.detailHeader}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#ffffff" />
          <Text style={styles.backButtonText}>{t("common.back")}</Text>
        </Pressable>
      </View>

      {/* HERO */}
      <View style={{ alignItems: "center", paddingHorizontal: 24, paddingTop: 4, paddingBottom: 8 }}>
        <View style={{ width: 110, height: 110, borderRadius: 24, backgroundColor: "rgba(255, 207, 139, 0.16)", borderWidth: 1, borderColor: "rgba(255, 207, 139, 0.3)", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {img ? (
            <Image source={img} style={{ width: 110, height: 110 }} resizeMode="cover" />
          ) : (
            <Text style={{ fontSize: 48 }}>{disease.emoji || "🦠"}</Text>
          )}
        </View>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900", marginTop: 14, textAlign: "center" }}>{disease.name}</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4, textAlign: "center" }}>
          {disease.type ? t("extra.diseaseType", { type: disease.type }) : t("extra.plantDisease")}
        </Text>
      </View>

      {/* INFO SECTIONS */}
      <Section icon="🔍" title={t("pestDetailScreen.whatItIs")} text={disease.description} />
      <Section icon="👀" title={t("extra.diseaseSigns")} text={disease.sign} color={AMBER} />
      <Section icon="💥" title={t("pestDetailScreen.damageItCauses")} text={disease.damage} color="#ff9f9f" />
      <Section icon="🛡️" title={t("pestDetailScreen.howToPreventIt")} text={disease.prevent} color="#8effab" />
      <Section icon="✅" title={t("pestDetailScreen.howToTreatIt")} text={disease.treat} color="#5cff89" />
      <Section icon="🌡️" title={t("extra.diseaseConditions")} text={localizeTemperatures(disease.spreads, unitSystem)} color={AMBER} />

      {/* PLANTS AT RISK */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <IconText label={t("stats.plantsAtRisk")} style={styles.cardEyebrow} />
        {affected.length ? (
          <>
            <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 6 }]}>
              {t("stats.plantsAtRiskBody")}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {affected.slice(0, 6).map((name) => (
                <Pressable accessibilityRole="button"
                  key={name}
                  onPress={() => onOpenPlant && onOpenPlant(name)}
                  style={{ backgroundColor: "rgba(255, 207, 139, 0.1)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255, 207, 139, 0.3)" }}
                >
                  <Text style={{ color: AMBER, fontSize: 12, fontWeight: "800" }}>{name} ›</Text>
                </Pressable>
              ))}
              {affected.length > 6 ? (
                <View style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, justifyContent: "center" }}>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800" }}>+{affected.length - 6} more</Text>
                </View>
              ) : null}
            </View>
          </>
        ) : (
          <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 6 }]}>
            Commonly affects {targets.join(", ")}.
          </Text>
        )}
      </View>

      {/* BOTTOM BACK */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.bottomBackButton}>
          <Ionicons name="chevron-back" size={22} color="#07120b" />
          <Text style={styles.bottomBackButtonText}>{t("stats.backToPlant")}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
});
