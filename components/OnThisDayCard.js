import { memo, useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getTodayKey, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

export const OnThisDayCard = memo(function OnThisDayCard({ theme, journalEntries, harvestLog, onOpenPlant, seen, onShown }) {
  const { t } = useTranslation();
  const now = new Date();
  now.setHours(12, 0, 0, 0);

  // A real "on this day" match: the SAME calendar day — the same month + day for
  // year anniversaries, or the same day-of-month for month milestones. The old
  // code used a 30-day approximation with a ±2-day window, so memories drifted off
  // their real date and the card fired on far too many days.
  const isThrowback = (dateStr) => {
    const then = new Date(dateStr);
    if (Number.isNaN(then.getTime())) return null;
    then.setHours(12, 0, 0, 0);
    if (then >= now) return null;
    // Year anniversary — exact month + day, a year or more back.
    if (then.getMonth() === now.getMonth() && then.getDate() === now.getDate()) {
      const years = now.getFullYear() - then.getFullYear();
      if (years >= 1) return { label: years === 1 ? "1 year ago" : `${years} years ago`, years };
    }
    // Month milestone — same day-of-month, at least a month back.
    if (then.getDate() === now.getDate()) {
      const months = (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
      if (months >= 1) return { label: months === 1 ? "1 month ago" : `${months} months ago`, months };
    }
    return null;
  };

  const photoMemories = (journalEntries || [])
    .map((e) => {
      const match = isThrowback(e.createdAt);
      return match && e.imageUri ? { type: "photo", entry: e, match } : null;
    })
    .filter(Boolean);

  const harvestMemories = (harvestLog || [])
    .map((h) => {
      const match = isThrowback(h.createdAt);
      return match ? { type: "harvest", entry: h, match } : null;
    })
    .filter(Boolean);

  const memories = [...photoMemories, ...harvestMemories].sort(
    (a, b) => new Date(b.entry.createdAt) - new Date(a.entry.createdAt)
  );

  // Appear less and less: after each time it's shown, wait a growing number of days
  // before it can show again (0 → 6 → 12 → 18 … capped at 30). Once shown on a given
  // day it stays visible for that day so it never vanishes mid-scroll.
  const todayKey = getTodayKey();
  const shownCount = seen?.count || 0;
  const lastShown = seen?.lastShownDate || null;
  const alreadyShownToday = lastShown === todayKey;
  let shouldShow = memories.length > 0;
  if (shouldShow && lastShown && !alreadyShownToday) {
    const cooldownDays = Math.min(30, shownCount * 6);
    const daysSince = Math.round((new Date(`${todayKey}T12:00:00`) - new Date(`${lastShown}T12:00:00`)) / (1000 * 60 * 60 * 24));
    if (daysSince < cooldownDays) shouldShow = false;
  }

  useEffect(() => {
    if (shouldShow && !alreadyShownToday && onShown) onShown(todayKey);
  }, [shouldShow, alreadyShownToday, onShown, todayKey]);

  if (!shouldShow) return null;

  return (
    <View style={{ borderRadius: 24, padding: 18, marginBottom: 18, borderWidth: 1.5, backgroundColor: "rgba(216, 200, 255, 0.1)", borderColor: "#d8c8ff" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>📅</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.5 }}>{t("onThisDay.onThisDay")}</Text>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            {memories.length === 1 ? t("onThisDay.aMemoryFromYourGarden") : t("onThisDay.memoriesFromYourGarden")}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {t("onThisDay.lookHowFarYouveCome")}
      </Text>

      <View style={{ gap: 12, marginTop: 14 }}>
        {memories.slice(0, 4).map((m, i) => {
          if (m.type === "photo") {
            const plant = produceData.find((p) => p.name === m.entry.plantName);
            return (
              <Pressable
                key={`otd-photo-${m.entry.id || m.entry.createdAt || i}`}
                onPress={() => plant && onOpenPlant(plant)}
                style={{ borderRadius: 16, overflow: "hidden", backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(216, 200, 255, 0.2)" }}
              >
                <Image source={{ uri: m.entry.imageUri }} style={{ width: "100%", height: 160 }} resizeMode="cover" />
                <View style={{ position: "absolute", top: 10, left: 10, backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "900" }}>🕐 {m.match.label}</Text>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{m.entry.plantName || "Garden"}</Text>
                  {m.entry.growthStage ? (
                    <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "800", marginTop: 2 }}>{m.entry.growthStage}</Text>
                  ) : null}
                </View>
              </Pressable>
            );
          }
          const plant = produceData.find((p) => p.name === m.entry.plantName);
          const img = plant ? resolvePlantImageSource(plant) : null;
          return (
            <Pressable
              key={`otd-harvest-${m.entry.id || m.entry.createdAt || i}`}
              onPress={() => plant && onOpenPlant(plant)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(216, 200, 255, 0.2)" }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {img ? <Image source={img} style={{ width: 36, height: 36 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🎉</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>Harvested {m.entry.plantName}</Text>
                <Text style={{ color: "#d8c8ff", fontSize: 12, fontWeight: "900", marginTop: 2 }}>
                  🕐 {m.match.label}{m.entry.amount ? ` · ${m.entry.amount} ${m.entry.unit || ""}`.trimEnd() : ""}
                </Text>
              </View>
              <Text style={{ color: "#d8c8ff", fontSize: 20, fontWeight: "900" }}>›</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
})
