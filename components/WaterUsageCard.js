import { memo } from "react";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { getTodayKey, parseDecimal, tapHaptic, toGallons, WATER_UNITS } from "../core";
import { useTranslation, formatDate, formatNumber } from "../lib/i18n";
import { IconText } from "./IconText";

export const WaterUsageCard = memo(function WaterUsageCard({ theme, savedPlants, wateringAmounts, setWateringAmounts, onUndoToast, unitSystem }) {
  const { t } = useTranslation();
  // Totals were always gallons, so a metric gardener logging litres read their
  // own water back in a unit they never use. Entries keep the unit they were
  // logged in; totals show in the gardener's units.
  const metric = unitSystem === "metric";
  const [plant, setPlant] = useState("Garden");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState(metric ? "L" : "gal");
  const [showPanel, setShowPanel] = useState(false);

  const plantOptions = ["Garden", ...(savedPlants || [])];
  const log = wateringAmounts || [];

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const totalGal = log.reduce((sum, e) => sum + toGallons(e.amount, e.unit), 0);
  const weekGal = log
    .filter((e) => new Date(e.createdAt).getTime() >= weekAgo)
    .reduce((sum, e) => sum + toGallons(e.amount, e.unit), 0);

  // Thirstiest plant by total gallons.
  const byPlant = {};
  log.forEach((e) => {
    byPlant[e.plantName] = (byPlant[e.plantName] || 0) + toGallons(e.amount, e.unit);
  });
  const thirstiest = Object.entries(byPlant).sort((a, b) => b[1] - a[1])[0];

  const addEntry = () => {
    const n = parseDecimal(amount);
    if (Number.isNaN(n) || n <= 0) {
      Alert.alert(t("alerts.enterAmountTitle"), t("alerts.enterAmountWaterBody"));
      return;
    }
    tapHaptic("light");
    const entry = {
      id: Date.now().toString(),
      plantName: plant,
      amount: n,
      unit,
      date: getTodayKey(),
      createdAt: new Date().toISOString(),
    };
    setWateringAmounts((current) => [entry, ...current]);
    setAmount("");
    setShowPanel(false);
  };

  const deleteEntry = (id) => {
    const removed = log.find((e) => e.id === id);
    if (!removed) return;
    tapHaptic("light");
    setWateringAmounts((current) => current.filter((e) => e.id !== id));
    if (onUndoToast) {
      onUndoToast(t("a11y.wateringDeleted"), () => {
        setWateringAmounts((current) => [removed, ...current].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ));
      });
    }
  };

  const UNIT_KEYS = { cups: "waterUsage.unitCups", gal: "waterUsage.unitGal", L: "waterUsage.unitL" };
  const unitLabel = (id) => t(UNIT_KEYS[id] || UNIT_KEYS.gal);
  const totalUnit = unitLabel(metric ? "L" : "gal");
  const fmtTotal = (gal) => {
    const v = metric ? gal * 3.78541 : gal;
    return formatNumber(v >= 10 ? Math.round(v) : Math.round(v * 10) / 10);
  };
  const plantLabel = (name) => (name === "Garden" ? t("waterUsage.wholeGarden") : name);

return (
    <View>

      {/* STATS */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
        <View style={{ flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(107, 199, 255, 0.1)", borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.24)" }}>
          <Text style={{ fontSize: 20 }}>📅</Text>
          <Text style={{ color: "#6bc7ff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{fmtTotal(weekGal)}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>{t("waterUsage.weekTotal", { unit: totalUnit })}</Text>
        </View>
        <View style={{ flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
          <Text style={{ fontSize: 20 }}>💧</Text>
          <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "900", marginTop: 6 }}>{fmtTotal(totalGal)}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 2 }}>{t("waterUsage.allTimeTotal", { unit: totalUnit })}</Text>
        </View>
      </View>

      {thirstiest && thirstiest[1] > 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 14, textAlign: "center" }}>
          {t("waterUsage.thirstiestLine", { plant: plantLabel(thirstiest[0]), amount: fmtTotal(thirstiest[1]), unit: totalUnit })}
        </Text>
      ) : null}

      {/* ADD BUTTON / PANEL */}
      {showPanel ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.2)" }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>{t("waterUsage.whichPlant")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {plantOptions.map((p) => {
              const active = plant === p;
              return (
                <Pressable accessibilityState={{ selected: !!active }} accessibilityRole="button" key={p} onPress={() => setPlant(p)}
                  style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: active ? "#6bc7ff" : "rgba(255, 255, 255, 0.08)", borderWidth: 1, borderColor: active ? "#6bc7ff" : "rgba(255, 255, 255, 0.1)" }}>
                  <Text style={{ color: active ? "#07120b" : "#ffffff", fontSize: 12, fontWeight: "800" }}>
                    {p === "Garden" ? t("waterUsage.wholeGarden") : p}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginTop: 14, marginBottom: 8 }}>{t("waterUsage.howMuch")}</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder={t("waterUsage.eg2")}
              placeholderTextColor="#8fbf9d"
              keyboardType="decimal-pad"
              style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.2)", color: "#ffffff", fontSize: 16, fontWeight: "800", paddingHorizontal: 16, paddingVertical: 12 }}
            />
            <View style={{ flexDirection: "row", gap: 6 }}>
              {WATER_UNITS.map((u) => {
                const active = unit === u.id;
                return (
                  <Pressable accessibilityState={{ selected: !!active }} accessibilityRole="button" key={u.id} onPress={() => setUnit(u.id)}
                    style={{ borderRadius: 12, paddingHorizontal: 12, justifyContent: "center", backgroundColor: active ? "#6bc7ff" : "rgba(255, 255, 255, 0.08)", borderWidth: 1, borderColor: active ? "#6bc7ff" : "rgba(255, 255, 255, 0.1)" }}>
                    <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{unitLabel(u.id)}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable accessibilityRole="button" onPress={addEntry} style={{ marginTop: 12, backgroundColor: "#6bc7ff", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}>
            <IconText label={t("waterUsage.logWatering")} style={{
  color: "#07120b",
  fontSize: 14,
  fontWeight: "900"
}} />
          </Pressable>
        </View>
      ) : (
        <Pressable accessibilityRole="button" onPress={() => setShowPanel(true)}
          style={{ marginTop: 16, backgroundColor: "#6bc7ff", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>{t("waterUsage.logAWateringAmount")}</Text>
        </Pressable>
      )}

      {/* RECENT ENTRIES */}
      {log.length > 0 ? (
        <View style={{ gap: 8, marginTop: 16 }}>
          {log.slice(0, 6).map((e) => (
            <View key={e.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255, 255, 255, 0.06)" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>
                  {plantLabel(e.plantName)}
                </Text>
                <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                  {t("waterUsage.entryAmount", { amount: formatNumber(e.amount), unit: unitLabel(e.unit) })} · {formatDate(new Date(e.createdAt), {
  month: "short",
  day: "numeric"
})}
                </Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.deleteEntry")} onPress={() => deleteEntry(e.id)} style={{ padding: 6 }}>
                <Text style={{ color: "#ff7b7b", fontSize: 14, fontWeight: "900" }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
})
