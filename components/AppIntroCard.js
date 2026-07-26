import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { useTranslation } from "../lib/i18n";

// Shown on the zone-entry screen, before the user is in the app. Answers "what
// is this and what will it do for me?" so setting a ZIP code feels worthwhile
// rather than like an arbitrary gate. Each row is one capability, one line.

const FEATURES = [
  { icon: "leaf", key: "zone" },
  { icon: "water", key: "water" },
  { icon: "grid", key: "plan" },
  { icon: "camera", key: "journal" },
  { icon: "trophy", key: "grow" },
];

export function AppIntroCard({ theme }) {
  const { t } = useTranslation();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 4 }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{t("intro.title")}</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 6, marginBottom: 4 }]}>
        {t("intro.subtitle")}
      </Text>

      <View style={{ marginTop: 8, gap: 14 }}>
        {FEATURES.map((f) => (
          <View key={f.key} style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
            <View
              style={{
                width: 36, height: 36, borderRadius: 10, marginTop: 1,
                alignItems: "center", justifyContent: "center",
                backgroundColor: "rgba(92, 255, 137, 0.12)",
              }}
            >
              <Ionicons name={f.icon} size={18} color="#5cff89" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: "800" }}>
                {t(`intro.${f.key}Title`)}
              </Text>
              <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "600", lineHeight: 18, marginTop: 2 }}>
                {t(`intro.${f.key}Body`)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", textAlign: "center", marginTop: 16, opacity: 0.8 }}>
        {t("intro.footer")}
      </Text>
    </View>
  );
}

export default AppIntroCard;
