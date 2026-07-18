import { Alert, Pressable, Share, Text, View } from "react-native";
import { buildCsv, tapHaptic } from "../core";

export function DataExportCard({ theme, harvestLog, careLog, journalEntries }) {
  const shareCsv = async (label, csv, count) => {
    if (!count) {
      Alert.alert("Nothing to export", `You don't have any ${label} entries yet.`);
      return;
    }
    try {
      tapHaptic("light");
      await Share.share({
        title: `Pocket Planter — ${label}`,
        message: csv,
      });
    } catch (e) {
      console.log("Export share skipped:", e);
    }
  };

  const exportHarvests = () => {
    const rows = (harvestLog || []).map((h) => [
      h.date || "", h.plantName || "", h.amount || "", h.unit || "", h.note || "", h.createdAt || "",
    ]);
    const csv = buildCsv(["Date", "Plant", "Amount", "Unit", "Note", "Logged At"], rows);
    shareCsv("harvest log", csv, rows.length);
  };

  const exportCareLog = () => {
    const rows = (careLog || []).map((c) => [
      c.date || "", c.plant || "", c.actionLabel || "", c.note || "", c.createdAt || "",
    ]);
    const csv = buildCsv(["Date", "Plant", "Action", "Note", "Logged At"], rows);
    shareCsv("care log", csv, rows.length);
  };

  const exportJournal = () => {
    const rows = (journalEntries || []).map((e) => [
      e.plantName || "", e.growthStage || "", e.mood || "", e.imageUri || "", e.createdAt || "",
    ]);
    const csv = buildCsv(["Plant", "Growth Stage", "Mood", "Photo URL", "Created At"], rows);
    shareCsv("journal", csv, rows.length);
  };

  const buttons = [
    { icon: "🚜", label: "Harvest Log", count: (harvestLog || []).length, onPress: exportHarvests, color: "#ffd86b" },
    { icon: "🧪", label: "Care Log", count: (careLog || []).length, onPress: exportCareLog, color: "#6bc7ff" },
    { icon: "📸", label: "Journal", count: (journalEntries || []).length, onPress: exportJournal, color: "#8effab" },
  ];

return (
    <View>
      <View style={{ gap: 10, marginTop: 16 }}>
        {buttons.map((b) => (
          <Pressable
            key={b.label}
            onPress={b.onPress}
            accessibilityRole="button"
            accessibilityLabel={`Export ${b.label} as CSV`}
            style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${b.color}30` }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${b.color}1a`, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22 }}>{b.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{b.label}</Text>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                {b.count} {b.count === 1 ? "entry" : "entries"}
              </Text>
            </View>
            <Text style={{ color: b.color, fontSize: 15, fontWeight: "900" }}>Export ›</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
