import { memo } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "../lib/i18n";

const yearOf = (e) => {
  const d = new Date(e.date ? `${String(e.date).slice(0, 10)}T12:00:00` : e.createdAt);
  return Number.isNaN(d.getTime()) ? null : d.getFullYear();
};
const parseAmount = (a) => {
  const m = /(\d+(?:\.\d+)?)/.exec(String(a || ""));
  return m ? parseFloat(m[1]) : 0;
};

export const YieldTrackerCard = memo(function YieldTrackerCard({ theme, harvestLog }) {
  const { t } = useTranslation();
  const log = harvestLog || [];
  if (!log.length) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("yieldTracker.logHarvestsFromAPlants")}
      </Text>
    );
  }

  const thisYear = new Date().getFullYear();
  const lastYear = thisYear - 1;
  const thisYearCount = log.filter((e) => yearOf(e) === thisYear).length;
  const lastYearCount = log.filter((e) => yearOf(e) === lastYear).length;

  const delta = thisYearCount - lastYearCount;
  const pct = lastYearCount > 0 ? Math.round((delta / lastYearCount) * 100) : null;

  // Top producers this year, by number of harvests (with parsed quantity when available).
  const byPlant = {};
  log.filter((e) => yearOf(e) === thisYear).forEach((e) => {
    const key = e.plantName || "Unknown";
    if (!byPlant[key]) byPlant[key] = { count: 0, amount: 0, unit: e.unit || "" };
    byPlant[key].count += 1;
    byPlant[key].amount += parseAmount(e.amount);
  });
  const top = Object.entries(byPlant).sort((a, b) => b[1].count - a[1].count).slice(0, 5);
  const maxCount = Math.max(1, ...top.map(([, v]) => v.count));

  return (
    <View>
      {/* YEAR-OVER-YEAR HEADLINE */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 2 }}>
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}>
          <Text style={{ color: "#5cff89", fontSize: 20, fontWeight: "900" }}>{thisYearCount}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 2 }}>{t("yieldTracker.harvestsIn")} {thisYear}</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "900" }}>{lastYearCount}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 2 }}>In {lastYear}</Text>
        </View>
      </View>

      {pct !== null ? (
        <Text style={{ color: delta >= 0 ? "#5cff89" : "#ff9f9f", fontSize: 12, fontWeight: "800", marginTop: 10, textAlign: "center" }}>
          {delta >= 0 ? "📈" : "📉"} {delta >= 0 ? "Up" : "Down"} {Math.abs(pct)}{t("yieldTracker.vsLastYear")}{delta >= 0 ? "+" : ""}{delta})
        </Text>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 10, textAlign: "center", fontStyle: "italic" }}>
          {t("yieldTracker.keepLoggingNextYearYoull")}
        </Text>
      )}

      {/* TOP PRODUCERS */}
      {top.length ? (
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 10 }}>{t("yieldTracker.topProducers")}{thisYear})</Text>
          <View style={{ gap: 8 }}>
            {top.map(([name, v], i) => (
              <View key={name} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={{ width: 20, color: i === 0 ? "#ffd86b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800" }} numberOfLines={1}>{name}</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800" }}>
                      {v.count}× {v.amount > 0 ? `· ~${v.amount % 1 === 0 ? v.amount : v.amount.toFixed(1)}${v.unit ? " " + v.unit : ""}` : ""}
                    </Text>
                  </View>
                  <View style={{ height: 7, borderRadius: 4, backgroundColor: "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
                    <View style={{ height: 7, borderRadius: 4, width: `${(v.count / maxCount) * 100}%`, backgroundColor: "#5cff89" }} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
})
