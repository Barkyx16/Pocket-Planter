import { memo, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { COMPANION_PLANTING_DATA, getCompatibilityScore, getPairReason, tapHaptic } from "../core";

// Lets a gardener check any two plants against each other before they commit a
// bed — the companion-conflict logic already exists for planted beds, this just
// makes it available up front for anything, even with an empty garden.
export const PairCheckSection = memo(function PairCheckSection({ theme, savedPlants }) {
  const options = useMemo(() => {
    const set = new Set(Object.keys(COMPANION_PLANTING_DATA));
    (savedPlants || []).forEach((n) => set.add(n));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [savedPlants]);

  const [a, setA] = useState(null);
  const [b, setB] = useState(null);

  const pick = (which, name) => {
    tapHaptic("light");
    if (which === "a") setA((cur) => (cur === name ? null : name));
    else setB((cur) => (cur === name ? null : name));
  };

  const result = a && b && a !== b ? getCompatibilityScore(a, b) : null;
  const reason = result ? getPairReason(a, b) : null;

  const Row = ({ which, selected }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 2 }}>
      {options.map((name) => {
        const active = selected === name;
        const disabled = which === "b" && a === name;
        return (
          <Pressable
            key={name}
            onPress={() => !disabled && pick(which, name)}
            accessibilityRole="button"
            accessibilityState={{ selected: active, disabled }}
            style={{ opacity: disabled ? 0.3 : 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: active ? "#5cff89" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.1)" }}
          >
            <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Pick any two plants to see if they're good neighbours before you plant.
      </Text>

      <Text style={{ color: "#5cff89", fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginTop: 14, marginBottom: 6 }}>FIRST PLANT{a ? ` · ${a}` : ""}</Text>
      <Row which="a" selected={a} />

      <Text style={{ color: "#5cff89", fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginTop: 12, marginBottom: 6 }}>SECOND PLANT{b ? ` · ${b}` : ""}</Text>
      <Row which="b" selected={b} />

      {result ? (
        <View style={{ marginTop: 16, backgroundColor: `${result.color}18`, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${result.color}44` }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 18 }}>{result.icon}</Text>
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900", flex: 1 }}>{a} + {b}</Text>
            <Text style={{ color: result.color, fontSize: 12, fontWeight: "900" }}>{result.label}</Text>
          </View>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 8 }}>{reason}</Text>
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", fontStyle: "italic", textAlign: "center", paddingVertical: 18 }}>
          {a && b && a === b ? "Pick two different plants." : "Choose a plant in each row to compare them."}
        </Text>
      )}
    </View>
  );
});
