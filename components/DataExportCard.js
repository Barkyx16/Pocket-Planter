import { memo, useEffect, useState } from "react";
import { Alert, Pressable, Share, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildCsv, tapHaptic } from "../core";
import { useTranslation } from "../lib/i18n";
import { CalendarExportSection } from "./CalendarExportSection";

const KIND_LABEL = { green: "Greens", brown: "Browns", turn: "Turned pile" };

export const DataExportCard = memo(function DataExportCard({ theme, harvestLog, careLog, journalEntries }) {
  const { t } = useTranslation();
  // Compost + germination live in their own AsyncStorage keys (self-persisting
  // module cards), so read their counts here for the export buttons.
  const [moduleCounts, setModuleCounts] = useState({ compost: 0, germ: 0 });

  useEffect(() => {
    let alive = true;
    Promise.all([
      AsyncStorage.getItem("pp_compostLog"),
      AsyncStorage.getItem("pp_germTests"),
    ]).then(([c, g]) => {
      if (!alive) return;
      const parse = (v) => { try { return JSON.parse(v) || []; } catch (e) { return []; } };
      setModuleCounts({ compost: parse(c).length, germ: parse(g).length });
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

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

  const exportCompost = async () => {
    let entries = [];
    try { entries = JSON.parse(await AsyncStorage.getItem("pp_compostLog")) || []; } catch (e) { /* ignore */ }
    const rows = entries.map((e) => [e.date || "", KIND_LABEL[e.kind] || e.kind || ""]);
    const csv = buildCsv(["Date", "Type"], rows);
    shareCsv("compost log", csv, rows.length);
  };

  const exportGermination = async () => {
    let entries = [];
    try { entries = JSON.parse(await AsyncStorage.getItem("pp_germTests")) || []; } catch (e) { /* ignore */ }
    const rows = entries.map((e) => {
      const sown = Number(e.sown) || 0;
      const sprouted = Number(e.sprouted) || 0;
      const viability = sown ? Math.round((sprouted / sown) * 100) : 0;
      return [e.date || "", e.seedName || "", String(sown), String(sprouted), `${viability}%`];
    });
    const csv = buildCsv(["Date", "Seed", "Sown", "Sprouted", "Viability"], rows);
    shareCsv("germination test", csv, rows.length);
  };

  const buttons = [
    { icon: "🚜", label: "Harvest Log", count: (harvestLog || []).length, onPress: exportHarvests, color: "#ffd86b" },
    { icon: "🧪", label: "Care Log", count: (careLog || []).length, onPress: exportCareLog, color: "#6bc7ff" },
    { icon: "📸", label: "Journal", count: (journalEntries || []).length, onPress: exportJournal, color: "#8effab" },
    { icon: "♻️", label: "Compost Log", count: moduleCounts.compost, onPress: exportCompost, color: "#bf7a12" },
    { icon: "🌱", label: "Germination Tests", count: moduleCounts.germ, onPress: exportGermination, color: "#5cff89" },
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
            style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${b.color}30` }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${b.color}1a`, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 20 }}>{b.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{b.label}</Text>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                {b.count} {b.count === 1 ? "entry" : "entries"}
              </Text>
            </View>
            <Text style={{ color: b.color, fontSize: 14, fontWeight: "900" }}>{t("dataExport.export")}</Text>
          </Pressable>
        ))}
      </View>

      {/* Recurring garden reminders → device calendar / .ics */}
      <CalendarExportSection theme={theme} />
    </View>
  );
})
