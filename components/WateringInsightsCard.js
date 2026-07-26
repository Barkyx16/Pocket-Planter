import { memo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { WeeklyWateringGrid } from "./WeeklyWateringGrid";
import { WateringRhythmCard } from "./WateringRhythmCard";
import { WateringHeatmapCard } from "./WateringHeatmapCard";
import { useTranslation } from "../lib/i18n";

const TABS = [
  { id: "week", label: "📅 Week" },
  { id: "rhythm", label: "📊 Rhythm" },
  { id: "heatmap", label: "🔥 Heatmap" },
];

export const WateringInsightsCard = memo(function WateringInsightsCard({ theme, savedPlants, wateringHistory, onOpenPlant, extraTabs = [] }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState("week");
  const hasHistory = Object.values(wateringHistory || {}).some((d) => (d || []).length);
  const allTabs = [...TABS, ...extraTabs.map((t) => ({ id: t.id, label: t.label }))];
  const activeExtra = extraTabs.find((t) => t.id === tab);

  return (
    <View>
      {/* PILL SWITCHER — chips size to their label and wrap cleanly */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {allTabs.map((t) => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: active ? "#6bc7ff" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: active ? "#6bc7ff" : "rgba(255, 255, 255, 0.12)" }}
            >
              <Text numberOfLines={1} style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {tab === "week" ? (
        <WeeklyWateringGrid theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} />
      ) : null}

      {tab === "rhythm" ? (
        <WateringRhythmCard theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} onOpenPlant={onOpenPlant} />
      ) : null}

      {tab === "heatmap" ? (
        hasHistory ? (
          <WateringHeatmapCard theme={theme} wateringHistory={wateringHistory} />
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", textAlign: "center", paddingVertical: 20 }}>
            {t("wateringInsights.logAFewWateringsTo")}
          </Text>
        )
      ) : null}

      {activeExtra ? activeExtra.node : null}
    </View>
  );
})
