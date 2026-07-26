import { memo } from "react";
import { Text, View } from "react-native";

// Pure-astronomy moon phase — no data feed. Reference new moon: 2000-01-06
// 18:14 UTC. Synodic month = 29.530588853 days. Everything else is derived.
const SYNODIC = 29.530588853;
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

function moonAge(now = Date.now()) {
  const days = (now - REF_NEW_MOON) / 86400000;
  return ((days % SYNODIC) + SYNODIC) % SYNODIC;
}

const PHASES = [
  { max: 1.84, name: "New Moon", emoji: "🌑", quarter: 4 },
  { max: 5.53, name: "Waxing Crescent", emoji: "🌒", quarter: 1 },
  { max: 9.22, name: "First Quarter", emoji: "🌓", quarter: 1 },
  { max: 12.91, name: "Waxing Gibbous", emoji: "🌔", quarter: 2 },
  { max: 16.61, name: "Full Moon", emoji: "🌕", quarter: 2 },
  { max: 20.30, name: "Waning Gibbous", emoji: "🌖", quarter: 3 },
  { max: 23.99, name: "Last Quarter", emoji: "🌗", quarter: 3 },
  { max: 27.68, name: "Waning Crescent", emoji: "🌘", quarter: 4 },
  { max: SYNODIC + 1, name: "New Moon", emoji: "🌑", quarter: 4 },
];

// Traditional lunar-planting guidance by quarter of the cycle.
const QUARTER_ADVICE = {
  1: { color: "#8effab", label: "Sow leafy greens", text: "Waxing moon, first quarter — a classic time to sow leafy annuals: lettuce, spinach, kale, broccoli, herbs." },
  2: { color: "#8effab", label: "Sow fruiting crops", text: "Waxing toward full — favoured for fruiting above-ground crops: tomatoes, peppers, beans, squash, cucumbers." },
  3: { color: "#ffd86b", label: "Sow roots & transplant", text: "Waning after full — traditionally best for root crops (carrots, beets, onions, potatoes) and transplanting." },
  4: { color: "#6bc7ff", label: "Rest, weed & prune", text: "Waning to new — a rest phase: weed, prune, harvest for storage, and improve the soil rather than sow." },
};

export const MoonPhaseSection = memo(function MoonPhaseSection({ theme, embedded }) {
  const age = moonAge();
  const phase = PHASES.find((p) => age < p.max) || PHASES[0];
  const illum = Math.round(((1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2) * 100);
  const advice = QUARTER_ADVICE[phase.quarter];

  const daysToNew = Math.round(SYNODIC - age);
  const daysToFull = Math.round((((SYNODIC / 2) - age) % SYNODIC + SYNODIC) % SYNODIC);

  return (
    <View style={embedded ? undefined : { marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        🌙 MOON PLANTING
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginTop: 8, backgroundColor: "rgba(216,200,255,0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(216,200,255,0.22)" }}>
        <Text style={{ fontSize: 44 }}>{phase.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>{phase.name}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 1 }}>
            {illum}% illuminated · day {Math.floor(age) + 1} of 29
          </Text>
          <Text style={{ color: advice.color, fontSize: 12, fontWeight: "900", marginTop: 4 }}>{advice.label}</Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 8 }}>
        {advice.text}
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 6 }}>
        🌕 Full moon in {daysToFull} day{daysToFull === 1 ? "" : "s"} · 🌑 New moon in {daysToNew} day{daysToNew === 1 ? "" : "s"}
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 9, fontWeight: "700", marginTop: 6, fontStyle: "italic" }}>
        Lunar planting is folk tradition, not a substitute for your frost and soil-temperature timing.
      </Text>
    </View>
  );
});
