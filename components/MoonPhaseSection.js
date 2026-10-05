import { memo } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "../lib/i18n";

// Pure-astronomy moon phase — no data feed. Reference new moon: 2000-01-06
// 18:14 UTC. Synodic month = 29.530588853 days. Everything else is derived.
const SYNODIC = 29.530588853;
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

function moonAge(now = Date.now()) {
  const days = (now - REF_NEW_MOON) / 86400000;
  return ((days % SYNODIC) + SYNODIC) % SYNODIC;
}

const PHASES = [
  { max: 1.84, name: "moonText.phaseNew", emoji: "🌑", quarter: 4 },
  { max: 5.53, name: "moonText.phaseWaxingCrescent", emoji: "🌒", quarter: 1 },
  { max: 9.22, name: "moonText.phaseFirstQuarter", emoji: "🌓", quarter: 1 },
  { max: 12.91, name: "moonText.phaseWaxingGibbous", emoji: "🌔", quarter: 2 },
  { max: 16.61, name: "moonText.phaseFull", emoji: "🌕", quarter: 2 },
  { max: 20.30, name: "moonText.phaseWaningGibbous", emoji: "🌖", quarter: 3 },
  { max: 23.99, name: "moonText.phaseLastQuarter", emoji: "🌗", quarter: 3 },
  { max: 27.68, name: "moonText.phaseWaningCrescent", emoji: "🌘", quarter: 4 },
  { max: SYNODIC + 1, name: "moonText.phaseNew", emoji: "🌑", quarter: 4 },
];

// Traditional lunar-planting guidance by quarter of the cycle. `name`, `label`
// and `text` are translation keys, resolved at render.
const QUARTER_ADVICE = {
  1: { color: "#8effab", label: "moonText.q1Label", text: "moonText.q1Text" },
  2: { color: "#8effab", label: "moonText.q2Label", text: "moonText.q2Text" },
  3: { color: "#ffd86b", label: "moonText.q3Label", text: "moonText.q3Text" },
  4: { color: "#6bc7ff", label: "moonText.q4Label", text: "moonText.q4Text" },
};

export const MoonPhaseSection = memo(function MoonPhaseSection({ theme, embedded }) {
  const { t, tn } = useTranslation();
  const age = moonAge();
  const phase = PHASES.find((p) => age < p.max) || PHASES[0];
  const illum = Math.round(((1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2) * 100);
  const advice = QUARTER_ADVICE[phase.quarter];

  const daysToNew = Math.round(SYNODIC - age);
  const daysToFull = Math.round((((SYNODIC / 2) - age) % SYNODIC + SYNODIC) % SYNODIC);

  return (
    <View style={embedded ? undefined : { marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        🌙 {t("moonText.title")}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginTop: 8, backgroundColor: "rgba(216,200,255,0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(216,200,255,0.22)" }}>
        <Text style={{ fontSize: 44 }}>{phase.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>{t(phase.name)}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 1 }}>
            {t("moonText.illumination", { percent: illum, day: Math.floor(age) + 1 })}
          </Text>
          <Text style={{ color: advice.color, fontSize: 12, fontWeight: "900", marginTop: 4 }}>{t(advice.label)}</Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 8 }}>
        {t(advice.text)}
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 6 }}>
        🌕 {tn("moonText.fullIn", daysToFull)} · 🌑 {tn("moonText.newIn", daysToNew)}
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 9, fontWeight: "700", marginTop: 6, fontStyle: "italic" }}>
        {t("moonText.disclaimer")}
      </Text>
    </View>
  );
});
