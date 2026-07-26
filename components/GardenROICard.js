import { memo } from "react";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { estimateHarvestValue, tapHaptic } from "../core";
import { useTranslation } from "../lib/i18n";

export const GardenROICard = memo(function GardenROICard({ theme, harvestLog, suppliesSpent, setSuppliesSpent }) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const grown = estimateHarvestValue(harvestLog);
  const grownTotal = grown.total || 0;
  const spent = Number(suppliesSpent) || 0;
  const net = grownTotal - spent;
  const roi = spent > 0 ? grownTotal / spent : null;
  const hasData = grownTotal > 0 || spent > 0;

  const saveSpent = () => {
    const n = parseFloat(draft);
    if (Number.isNaN(n) || n < 0) {
      Alert.alert("Enter an amount", "Type what you've spent on seeds and supplies (e.g. 45).");
      return;
    }
    tapHaptic("light");
    setSuppliesSpent(Math.round(n * 100) / 100);
    setEditing(false);
    setDraft("");
  };

  const netColor = net >= 0 ? "#5cff89" : "#ff7b7b";

return (
    <View>

      {/* HEADLINE NET */}
      {hasData ? (
        <View style={{ alignItems: "center", marginTop: 18, marginBottom: 6 }}>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>
            {net >= 0 ? t("gardenROI.netSavings") : t("gardenROI.netSoFar")}
          </Text>
          <Text style={{ color: netColor, fontSize: 42, fontWeight: "900", marginTop: 4 }}>
            {net >= 0 ? "" : "-"}${Math.abs(net)}
          </Text>
          {roi ? (
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 4 }}>
              {t("gardenROI.forEvery1SpentYou")}{roi.toFixed(2)} {t("gardenROI.ofProduce")}
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* GROWN vs SPENT ROW */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
        <View style={{ flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(92, 255, 137, 0.1)", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}>
          <Text style={{ fontSize: 20 }}>🌱</Text>
          <Text style={{ color: "#8effab", fontSize: 24, fontWeight: "900", marginTop: 6 }}>${grownTotal}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>Grown</Text>
        </View>
        <View style={{ flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(255, 159, 67, 0.1)", borderWidth: 1, borderColor: "rgba(255, 159, 67, 0.24)" }}>
          <Text style={{ fontSize: 20 }}>🧾</Text>
          <Text style={{ color: "#ff9f43", fontSize: 24, fontWeight: "900", marginTop: 6 }}>${spent}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>Spent</Text>
        </View>
      </View>

      {/* TOP EARNER */}
      {grown.topPlant ? (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 14, textAlign: "center" }}>
          {t("gardenROI.yourTopEarner")} <Text style={{ color: "#8effab", fontWeight: "900" }}>{grown.topPlant.name}</Text> (~${grown.topPlant.value})
        </Text>
      ) : null}

      {/* SET / EDIT SPENT */}
      {editing ? (
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t("gardenROI.eg45")}
            placeholderTextColor="#8fbf9d"
            keyboardType="decimal-pad"
            autoFocus
            style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)", color: "#ffffff", fontSize: 16, fontWeight: "800", paddingHorizontal: 16, paddingVertical: 14 }}
          />
          <Pressable onPress={saveSpent} style={{ backgroundColor: "#5cff89", borderRadius: 12, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>Save</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => { setDraft(spent > 0 ? String(spent) : ""); setEditing(true); }}
          style={{ marginTop: 16, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}
        >
          <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>
            {spent > 0 ? t("gardenROI.updateSuppliesSpent") : t("gardenROI.addWhatYouveSpent")}
          </Text>
        </Pressable>
      )}

      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
      </Text>
    </View>
  );
})
