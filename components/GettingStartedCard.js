import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "../lib/i18n";

// A guided "first wins" checklist for new gardeners. Pocket Planter is deep, and
// a brand-new user faces a big surface — this walks them to their first plant,
// bed, watering and photo. Every step is derived from real saved state, so it
// self-updates and auto-hides once the garden is up and running.
export const GettingStartedCard = memo(function GettingStartedCard({ theme, steps = [], onGoToStep, onDismiss }) {
  const { t } = useTranslation();
  const total = steps.length;
  const done = steps.filter((s) => s.done).length;
  // This is a scaffold, not a permanent card: once every milestone is met it
  // disappears for good (state-driven, so it never comes back).
  if (total > 0 && done >= total) return null;

  const accent = "#5cff89";
  const labelFor = (id) =>
    ({
      zone: t("gettingStarted.setZone"),
      plant: t("gettingStarted.savePlant"),
      bed: t("gettingStarted.addToBed"),
      water: t("gettingStarted.logWater"),
      photo: t("gettingStarted.addPhoto"),
    }[id] || id);

  return (
    <View
      style={{
        backgroundColor: "rgba(92,255,137,0.08)",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(92,255,137,0.22)",
        padding: 16,
        marginBottom: 14,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ color: theme?.text || "#eaffef", fontSize: 16, fontWeight: "900" }}>
          🚀 {t("gettingStarted.title")}
        </Text>
        {onDismiss ? (
          <Pressable onPress={onDismiss} hitSlop={10} accessibilityRole="button" accessibilityLabel={t("gettingStarted.dismiss")}>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: "800" }}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600", marginBottom: 12 }}>
        {t("gettingStarted.subtitle", { done, total })}
      </Text>

      <View style={{ height: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 14 }}>
        <View style={{ height: 6, borderRadius: 999, backgroundColor: accent, width: `${(done / (total || 1)) * 100}%` }} />
      </View>

      <View style={{ gap: 8 }}>
        {steps.map((step) => (
          <Pressable
            key={step.id}
            onPress={() => { if (!step.done && onGoToStep) onGoToStep(step); }}
            disabled={step.done}
            accessibilityRole="button"
            accessibilityLabel={`${labelFor(step.id)}${step.done ? `, ${t("gettingStarted.done")}` : ""}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              backgroundColor: step.done ? "rgba(92,255,137,0.10)" : "rgba(255,255,255,0.05)",
              borderColor: step.done ? "rgba(92,255,137,0.30)" : "rgba(255,255,255,0.09)",
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: step.done ? "rgba(92,255,137,0.18)" : "rgba(255,255,255,0.06)",
              }}
            >
              <Text style={{ fontSize: step.done ? 16 : 17, color: step.done ? accent : undefined, fontWeight: "900" }}>
                {step.done ? "✓" : step.emoji}
              </Text>
            </View>
            <Text
              style={{
                flex: 1,
                color: step.done ? "rgba(255,255,255,0.5)" : theme?.text || "#eaffef",
                fontSize: 14,
                fontWeight: "700",
                textDecorationLine: step.done ? "line-through" : "none",
              }}
            >
              {labelFor(step.id)}
            </Text>
            {!step.done ? <Text style={{ color: accent, fontSize: 18, fontWeight: "800" }}>›</Text> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
});
