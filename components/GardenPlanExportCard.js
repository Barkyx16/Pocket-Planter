import { memo } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { findGardenConflicts, tapHaptic } from "../core";
import { IconText } from "./IconText";
import { PlantLabelsSection } from "./PlantLabelsSection";
import { useTranslation } from "../lib/i18n";

export const GardenPlanExportCard = memo(function GardenPlanExportCard({ theme, gardenAreas, savedPlants, zone }) {
  const { t } = useTranslation();
  const areas = (gardenAreas || []).filter((a) => a && a.name);
  const totalPlanted = areas.reduce((sum, a) => sum + Object.values(a.plots || {}).filter(Boolean).length, 0);

  const buildPlan = () => {
    const lines = [`🌱 My Pocket Planter Garden Plan${zone ? ` (Zone ${zone})` : ""}`, ""];
    areas.forEach((a) => {
      const plants = Object.values(a.plots || {}).filter(Boolean);
      lines.push(`${a.emoji || "🌿"} ${a.name} (${plants.length}/${a.size || plants.length})`);
      if (plants.length) lines.push(`   ${plants.join(", ")}`);
      else lines.push("   (empty)");
      lines.push("");
    });
    const conflicts = findGardenConflicts(gardenAreas);
    if (conflicts.length) {
      lines.push(`⚠️ ${conflicts.length} companion conflict${conflicts.length === 1 ? "" : "s"} to review.`);
      lines.push("");
    }
    lines.push(`Total: ${totalPlanted} plants across ${areas.length} bed${areas.length === 1 ? "" : "s"}.`);
    lines.push("Planned with Pocket Planter 🌿");
    return lines.join("\n");
  };

  const exportPlan = async () => {
    try { tapHaptic("light"); await Share.share({ message: buildPlan() }); } catch (e) { /* cancelled */ }
  };

  if (!areas.length) {
    return (
      <View>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
          {t("gardenPlanExport.buildAGardenMapWith")}
        </Text>
        {/* Labels don't need beds — only saved plants */}
        <PlantLabelsSection theme={theme} savedPlants={savedPlants} zone={zone} />
      </View>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("gardenPlanExport.exportYourFullGardenLayout")}
      </Text>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
          <Text style={{ color: "#5cff89", fontSize: 20, fontWeight: "900" }}>{areas.length}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 2 }}>Beds</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
          <Text style={{ color: "#8effab", fontSize: 20, fontWeight: "900" }}>{totalPlanted}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 2 }}>{t("gardenPlanExport.plantsPlaced")}</Text>
        </View>
      </View>

      <Pressable onPress={exportPlan} style={{ marginTop: 12, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}>
        <IconText label={t("gardenPlanExport.exportShareGardenPlan")} style={{
  color: "#07120b",
  fontSize: 14,
  fontWeight: "900"
}} />
      </Pressable>

      {/* Printable plant labels / stakes */}
      <PlantLabelsSection theme={theme} savedPlants={savedPlants} zone={zone} />
    </View>
  );
})
