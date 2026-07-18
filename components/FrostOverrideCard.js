import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { getFirstFrostDate, getLastFrostDate } from "../core";

export function FrostOverrideCard({ theme, zone, frostOverrides, onSave, onHide }) {
  const [lastFrost, setLastFrost] = useState(frostOverrides?.lastFrost || "");
  const [firstFrost, setFirstFrost] = useState(frostOverrides?.firstFrost || "");

  // Show the current zone estimates as placeholder guidance.
  const estLast = getLastFrostDate(zone);
  const estFirst = getFirstFrostDate(zone);
  const fmt = (d) => (d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—");
  const valid = (v) => v === "" || /^\d{1,2}-\d{1,2}$/.test(v);

  const bothValid = valid(lastFrost) && valid(firstFrost);

  function handleSave() {
    if (!bothValid) return;
    const next = {};
    if (lastFrost.trim()) next.lastFrost = lastFrost.trim();
    if (firstFrost.trim()) next.firstFrost = firstFrost.trim();
    onSave(next);
  }
  function handleClear() {
    setLastFrost("");
    setFirstFrost("");
    onSave({});
  }

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    color: theme.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  };

return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Set Your Local Frost Dates</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Your zone estimates last frost around {fmt(estLast)} and first frost around {fmt(estFirst)}. If you know your real local dates, enter them as MM-DD to sharpen seed-starting and frost-window advice.
      </Text>

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 16, marginBottom: 6 }}>LAST SPRING FROST (MM-DD)</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TextInput
          value={lastFrost}
          onChangeText={setLastFrost}
          placeholder="e.g. 03-15"
          placeholderTextColor={theme.secondaryText}
          style={[inputStyle, !valid(lastFrost) && { borderColor: "#ff7a7a" }]}
          autoCapitalize="none"
        />
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 14, marginBottom: 6 }}>FIRST FALL FROST (MM-DD)</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TextInput
          value={firstFrost}
          onChangeText={setFirstFrost}
          placeholder="e.g. 11-15"
          placeholderTextColor={theme.secondaryText}
          style={[inputStyle, !valid(firstFrost) && { borderColor: "#ff7a7a" }]}
          autoCapitalize="none"
        />
      </View>

      {!bothValid && (
        <Text style={{ color: "#ff7a7a", fontSize: 12, fontWeight: "700", marginTop: 8 }}>
          Use MM-DD format, like 03-15.
        </Text>
      )}

      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
        <Pressable
          onPress={handleSave}
          disabled={!bothValid}
          style={{ flex: 1, backgroundColor: bothValid ? "rgba(107,199,255,0.2)" : "rgba(255,255,255,0.06)", borderRadius: 999, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: bothValid ? "rgba(107,199,255,0.44)" : "rgba(255,255,255,0.12)" }}
        >
          <Text style={{ color: bothValid ? "#6bc7ff" : theme.secondaryText, fontSize: 14, fontWeight: "900" }}>Save frost dates</Text>
        </Pressable>
        <Pressable
          onPress={handleClear}
          style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}
        >
          <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>Reset</Text>
        </Pressable>
      </View>

      <Pressable onPress={onHide} style={{ marginTop: 12, alignItems: "center", paddingVertical: 10 }}>
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800" }}>🌵 No frost in my area — hide this card</Text>
      </Pressable>
    </View>
  );
}
