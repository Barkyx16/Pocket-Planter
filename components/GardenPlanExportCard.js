import { memo } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { findGardenConflicts, tapHaptic } from "../core";

export const GardenPlanExportCard = memo(function GardenPlanExportCard({ theme, gardenAreas, savedPlants, zone }) {
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
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Build a garden map with a few beds and plants, then export the whole plan to share or save for reference.
      </Text>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Export your full garden layout — every bed and its plants — as a shareable plan you can send, save, or print.
      </Text>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
          <Text style={{ color: "#5cff89", fontSize: 20, fontWeight: "900" }}>{areas.length}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10.5, fontWeight: "800", marginTop: 2 }}>Beds</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
          <Text style={{ color: "#8effab", fontSize: 20, fontWeight: "900" }}>{totalPlanted}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10.5, fontWeight: "800", marginTop: 2 }}>Plants placed</Text>
        </View>
      </View>

      <Pressable onPress={exportPlan} style={{ marginTop: 12, backgroundColor: "#5cff89", borderRadius: 14, paddingVertical: 14, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontSize: 14.5, fontWeight: "900" }}>📤 Export / Share Garden Plan</Text>
      </Pressable>
    </View>
  );
})
