import { memo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { MONTH_NAMES, getMonthEmoji, localPlantMonths, tapHaptic } from "../core";
import { getMonthImage } from "../data/monthImageMap";
import { useTranslation } from "../lib/i18n";

export const PersonalPlantingCalendar = memo(function PersonalPlantingCalendar({ theme, savedPlants, zone, onOpenPlant }) {
  const { t } = useTranslation();
  const saved = produceData.filter((item) => savedPlants.includes(item.name));
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  if (!saved.length) return null;

  // For each month, which saved plants can be planted
  const byMonth = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const plants = saved.filter((item) => localPlantMonths(item).includes(monthNum));
    return { monthNum, plants };
  });

  const selectedPlants = byMonth[selectedMonth - 1]?.plants || [];
  const thisMonthCount = byMonth[currentMonth - 1]?.plants.length || 0;
  const activeMonths = byMonth.filter((m) => m.plants.length).length;
  const peak = byMonth.reduce((best, m) => (m.plants.length > (best?.plants.length || 0) ? m : best), null);
  const peakLabel = peak && peak.plants.length ? MONTH_NAMES[peak.monthNum - 1].slice(0, 3) : "—";

  const stats = [
    { label: "To sow now", value: String(thisMonthCount), color: thisMonthCount ? "#8effab" : theme.secondaryText },
    { label: "Active months", value: String(activeMonths), color: "#6bc7ff" },
    { label: "Peak month", value: peakLabel, color: "#ffd86b" },
  ];

  return (
    <View>
      {/* AT-A-GLANCE SUMMARY */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 2 }}>
        {stats.map((s) => (
          <View key={s.label} style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 6, alignItems: "center", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
            <Text style={{ color: s.color, fontSize: 20, fontWeight: "900" }}>{s.value}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 2, textAlign: "center" }}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 12 }}>
        {t("personalPlantingCalendar.tapAMonthToSee")}{zone ? ` in Zone ${zone}` : ""}.
      </Text>

      {/* COMPACT MONTH GRID — 4 per row */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
        {byMonth.map(({ monthNum, plants }) => {
          const isSelected = monthNum === selectedMonth;
          const isNow = monthNum === currentMonth;
          const has = plants.length > 0;
          return (
            <Pressable
              key={monthNum}
              onPress={() => { tapHaptic("light"); setSelectedMonth(monthNum); }}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${MONTH_NAMES[monthNum - 1]}: ${has ? `${plants.length} plant${plants.length === 1 ? "" : "s"} to sow` : t("personalPlantingCalendar.nothingToSow")}`}
              style={{
                width: "22.7%",
                borderRadius: 12,
                paddingVertical: 10,
                alignItems: "center",
                backgroundColor: isSelected ? "rgba(92, 255, 137, 0.16)" : has ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.04)",
                borderWidth: isSelected ? 1.5 : 1,
                borderColor: isSelected ? "#5cff89" : isNow ? "rgba(92, 255, 137, 0.4)" : has ? "rgba(142, 255, 171, 0.16)" : "rgba(255, 255, 255, 0.06)",
              }}
            >
              <Text style={{ color: isSelected ? "#5cff89" : theme.text, fontSize: 12, fontWeight: "900" }}>
                {MONTH_NAMES[monthNum - 1].slice(0, 3)}
              </Text>
              <Text style={{ color: has ? "#8effab" : theme.secondaryText, fontSize: 12, fontWeight: "900", marginTop: 4 }}>
                {has ? plants.length : "—"}
              </Text>
              {isNow ? (
                <View style={{ position: "absolute", top: 5, right: 6, width: 5, height: 5, borderRadius: 4, backgroundColor: "#5cff89" }} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {/* SELECTED MONTH DETAIL */}
      <View style={{ marginTop: 14, backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}>
        {getMonthImage(selectedMonth) ? (
          <Image
            source={getMonthImage(selectedMonth)}
            style={{ width: "100%", height: 120, borderRadius: 12, marginBottom: 12 }}
            resizeMode="cover"
          />
        ) : null}
        <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 10 }}>
          {getMonthEmoji(selectedMonth)} {MONTH_NAMES[selectedMonth - 1].toUpperCase()}
          {selectedMonth === currentMonth ? t("personalPlantingCalendar.thisMonth") : ""}
          {selectedPlants.length ? `  ·  ${selectedPlants.length} PLANT${selectedPlants.length === 1 ? "" : "S"}` : ""}
        </Text>
        {selectedPlants.length ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {selectedPlants.map((item) => (
              <Pressable
                key={`cal-${item.name}`}
                onPress={() => onOpenPlant(item)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.name} care guide`}
                style={{ backgroundColor: "rgba(92, 255, 137, 0.12)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
              >
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800" }}>{item.name} ›</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 20 }}>
            {t("personalPlantingCalendar.noneOfYourSavedPlants")} {MONTH_NAMES[selectedMonth - 1]}{t("personalPlantingCalendar.tapAHighlightedMonthTo")}
          </Text>
        )}
      </View>
    </View>
  );
})
