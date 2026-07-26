import { memo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { getPlantingGuide } from "../core";
import { useTranslation } from "../lib/i18n";

// Pull a usable inches value from spacing strings like '18"–24"' or '10–20 ft'.
const spacingInches = (str) => {
  const s = String(str || "");
  const nums = (s.match(/\d+(\.\d+)?/g) || []).map(Number);
  if (!nums.length) return 12;
  const max = Math.max(...nums);
  return /ft/i.test(s) ? max * 12 : max;
};

export const BedPlannerCard = memo(function BedPlannerCard({ theme, savedPlants }) {
  const { t } = useTranslation();
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
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("bedPlanner.saveAFewPlantsFirst")}
      </Text>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("bedPlanner.enterYourBedSizeAnd")}
      </Text>

      {/* DIMENSIONS */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
        {[{ label: t("bedPlanner.widthFt"), v: widthFt, set: setWidthFt }, { label: t("bedPlanner.lengthFt"), v: lengthFt, set: setLengthFt }].map((f) => (
          <View key={f.label} style={{ flex: 1 }}>
            <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginBottom: 6 }}>{f.label}</Text>
            <TextInput
              value={f.v}
              onChangeText={f.set}
              keyboardType="decimal-pad"
              placeholderTextColor="#8fbf9d"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "800" }}
            />
          </View>
        ))}
      </View>

      {/* PLANT PICKER */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 12 }}>
        {options.map((p) => {
          const active = selected === p.name;
          return (
            <Pressable key={p.name} onPress={() => setSelected(p.name)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{p.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* RESULT */}
      {plant && total > 0 ? (
        <View style={{ backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)", alignItems: "center" }}>
          <Text style={{ color: "#5cff89", fontSize: 34, fontWeight: "900" }}>{total}</Text>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800", marginTop: 2 }}>{plant.name} {t("bedPlanner.plantsFit")}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4, textAlign: "center" }}>
            {rows} {t("bedPlanner.rows")} {perRow} {t("bedPlanner.perRow")}{spacing}{t("bedPlanner.spacingInA")} {widthFt}×{lengthFt} {t("bedPlanner.ftBed")}
          </Text>
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", textAlign: "center", paddingVertical: 12, fontStyle: "italic" }}>
          {t("bedPlanner.enterAValidBedSize")}
        </Text>
      )}
    </View>
  );
})
