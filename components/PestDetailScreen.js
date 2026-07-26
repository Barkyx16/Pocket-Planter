import { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../styles";
import { getPestImage } from "../data/pestImageMap";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

const MONTH_ABBR = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTH_FULL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const PestDetailScreen = memo(function PestDetailScreen({ theme, pest, onBack, onOpenPlant }) {
  const { t } = useTranslation();
  if (!pest) return null;

  const months = Array.isArray(pest.months) ? pest.months : [];
  const activeLabel = months.length
    ? months.map((m) => MONTH_FULL[m - 1]).join(" · ")
    : "Varies by region";

  // Affected = user's own plants this pest hits (passed from Pest Watch). Targets = general list.
  const affected = Array.isArray(pest.affected) ? pest.affected : [];
  const targets = Array.isArray(pest.targets) ? pest.targets : [];

  const Section = ({ icon, title, text, color }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardEyebrow, color ? { color } : null]}>{icon} {title}</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 6 }]}>{text}</Text>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
      {/* BACK */}
      <View style={styles.detailHeader}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#ffffff" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>

      {/* HERO */}
      <View style={{ alignItems: "center", paddingHorizontal: 24, paddingTop: 4, paddingBottom: 8 }}>
        <View style={{ width: 110, height: 110, borderRadius: 24, backgroundColor: "rgba(255, 123, 123, 0.16)", borderWidth: 1, borderColor: "rgba(255, 123, 123, 0.3)", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {getPestImage(pest.name) ? (
            <Image source={getPestImage(pest.name)} style={{ width: 110, height: 110 }} resizeMode="cover" />
          ) : (
            <Text style={{ fontSize: 48 }}>{pest.emoji}</Text>
          )}
        </View>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900", marginTop: 14, textAlign: "center" }}>{pest.name}</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4, textAlign: "center" }}>
          {t("pestDetailScreen.gardenPestMostActive")} {months.length ? `${MONTH_FULL[months[0] - 1]}–${MONTH_FULL[months[months.length - 1] - 1]}` : "seasonally"}
        </Text>
      </View>

      {/* INFO SECTIONS */}
      <Section icon="🔍" title={t("pestDetailScreen.whatItIs")} text={pest.description} />
      <Section icon="👀" title={t("pestDetailScreen.whatToLookFor")} text={pest.sign} color="#ffd86b" />
      <Section icon="💥" title={t("pestDetailScreen.damageItCauses")} text={pest.damage} color="#ff9f9f" />
      <Section icon="🛡️" title={t("pestDetailScreen.howToPreventIt")} text={pest.prevent} color="#8effab" />
      <Section icon="✅" title={t("pestDetailScreen.howToTreatIt")} text={pest.fix} color="#5cff89" />

      {/* PLANTS AT RISK */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <IconText label={t("pestDetailScreen.plantsAtRisk")} style={styles.cardEyebrow} />
        {affected.length ? (
          <>
            <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 6 }]}>
              {t("pestDetailScreen.inYourGardenTheseCould")}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {affected.slice(0, 6).map((name) => (
                <Pressable
                  key={name}
                  onPress={() => onOpenPlant && onOpenPlant(name)}
                  style={{ backgroundColor: "rgba(255, 123, 123, 0.1)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255, 123, 123, 0.3)" }}
                >
                  <Text style={{ color: "#ff9f9f", fontSize: 12, fontWeight: "800" }}>{name} ›</Text>
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
            {t("pestDetailScreen.commonlyTargets")} {targets.join(", ")}.
          </Text>
        )}
      </View>

      {/* ACTIVE MONTHS */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <IconText label={t("pestDetailScreen.whenItsActive")} style={styles.cardEyebrow} />
        <View style={{ flexDirection: "row", gap: 4, marginTop: 12 }}>
          {MONTH_ABBR.map((m, i) => {
            const on = months.includes(i + 1);
            return (
              <View key={i} style={{ flex: 1, alignItems: "center" }}>
                <View style={{ width: "100%", height: 30, borderRadius: 8, backgroundColor: on ? "rgba(255, 123, 123, 0.3)" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: on ? "rgba(255, 123, 123, 0.5)" : "rgba(255, 255, 255, 0.08)", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: on ? "#ff9f9f" : theme.secondaryText, fontSize: 10, fontWeight: "900" }}>{m}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", marginTop: 10 }}>
          {t("pestDetailScreen.peakActivity")} {activeLabel}{t("pestDetailScreen.warmerZonesOftenSeeA")}
        </Text>
      </View>

      {/* BOTTOM BACK */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Pressable onPress={onBack} style={styles.bottomBackButton}>
          <Ionicons name="chevron-back" size={22} color="#07120b" />
          <Text style={styles.bottomBackButtonText}>{t("pestDetailScreen.backToPestWatch")}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
})
