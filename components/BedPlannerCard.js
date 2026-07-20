import { memo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { getPlantingGuide } from "../core";

// Pull a usable inches value from spacing strings like '18"–24"' or '10–20 ft'.
const spacingInches = (str) => {
  const s = String(str || "");
  const nums = (s.match(/\d+(\.\d+)?/g) || []).map(Number);
  if (!nums.length) return 12;
  const max = Math.max(...nums);
  return /ft/i.test(s) ? max * 12 : max;
};

export const BedPlannerCard = memo(function BedPlannerCard({ theme, savedPlants }) {
  const options = (savedPlants || []).map((n) => produceData.find((p) => p.name === n)).filter(Boolean);
  const [selected, setSelected] = useState(options[0]?.name || "");
  const [widthFt, setWidthFt] = useState("4");
  const [lengthFt, setLengthFt] = useState("8");

  const plant = options.find((p) => p.name === selected);
  const spacing = plant ? spacingInches(getPlantingGuide(plant).spacing) : null;
  const w = parseFloat(widthFt), l = parseFloat(lengthFt);
  const perRow = spacing && w > 0 ? Math.floor((w * 12) / spacing) : 0;
  const rows = spacing && l > 0 ? Math.floor((l * 12) / spacing) : 0;
  const total = perRow * rows;

  if (!options.length) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Save a few plants first, then this calculator will tell you how many of each fit in a bed of any size.
      </Text>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Enter your bed size and pick a plant to see how many fit at the recommended spacing.
      </Text>

      {/* DIMENSIONS */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
        {[{ label: "Width (ft)", v: widthFt, set: setWidthFt }, { label: "Length (ft)", v: lengthFt, set: setLengthFt }].map((f) => (
          <View key={f.label} style={{ flex: 1 }}>
            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginBottom: 5 }}>{f.label}</Text>
            <TextInput
              value={f.v}
              onChangeText={f.set}
              keyboardType="decimal-pad"
              placeholderTextColor="#8fbf9d"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontWeight: "800" }}
            />
          </View>
        ))}
      </View>

      {/* PLANT PICKER */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 12 }}>
        {options.map((p) => {
          const active = selected === p.name;
          return (
            <Pressable key={p.name} onPress={() => setSelected(p.name)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: active ? "#5cff89" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12.5, fontWeight: "900" }}>{p.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* RESULT */}
      {plant && total > 0 ? (
        <View style={{ backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(92,255,137,0.25)", alignItems: "center" }}>
          <Text style={{ color: "#5cff89", fontSize: 34, fontWeight: "900" }}>{total}</Text>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800", marginTop: 2 }}>{plant.name} plants fit</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4, textAlign: "center" }}>
            {rows} rows × {perRow} per row · ~{spacing}" spacing in a {widthFt}×{lengthFt} ft bed
          </Text>
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12.5, fontWeight: "700", textAlign: "center", paddingVertical: 12, fontStyle: "italic" }}>
          Enter a valid bed size to calculate.
        </Text>
      )}
    </View>
  );
})
