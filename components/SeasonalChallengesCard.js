import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, Vibration, View } from "react-native";
import { getSeasonForMonth, successHaptic } from "../core";
import { useTranslation } from "../lib/i18n";

const STORAGE_KEY = "pp_claimedChallenges";

// Is a YYYY-MM-DD-ish date string within the current season's months?
const inSeason = (dateVal, months) => {
  const d = new Date(`${String(dateVal).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return months.includes(d.getMonth() + 1) && d.getFullYear() === now.getFullYear();
};

export const SeasonalChallengesCard = memo(function SeasonalChallengesCard({ theme, wateringHistory, journalEntries, harvestLog, careLog, streakData, onReward }) {
  const { t } = useTranslation();
  const [claimed, setClaimed] = useState({});
  const [loaded, setLoaded] = useState(false);

  const month = new Date().getMonth() + 1;
  const season = getSeasonForMonth(month);
  const seasonKey = `${new Date().getFullYear()}-${season.key}`;

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) { try { setClaimed(JSON.parse(val) || {}); } catch (e) { /* ignore */ } }
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  // Progress counts for the current season, from existing activity.
  const waterings = Object.values(wateringHistory || {}).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.filter((d) => inSeason(d, season.months)).length : 0), 0);
  const photos = (journalEntries || []).filter((e) => inSeason(e.createdAt, season.months)).length;
  const harvests = (harvestLog || []).filter((e) => inSeason(e.date || e.createdAt, season.months)).length;
  const careActions = (careLog || []).filter((e) => inSeason(e.date || e.createdAt, season.months)).length;

  const challenges = [
    { id: "water", icon: "💧", title: `Water 15 times this ${season.label.toLowerCase()}`, progress: waterings, goal: 15, reward: 50, color: "#6bc7ff" },
    { id: "photos", icon: "📸", title: "Log 6 garden photos", progress: photos, goal: 6, reward: 40, color: "#ffd86b" },
    { id: "harvest", icon: "🚜", title: "Record 3 harvests", progress: harvests, goal: 3, reward: 60, color: "#ff9f43" },
    { id: "care", icon: "🧪", title: "Log 5 care actions", progress: careActions, goal: 5, reward: 40, color: "#8effab" },
  ];

  const persist = (next) => {
    setClaimed(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const claim = (ch) => {
    const key = `${seasonKey}-${ch.id}`;
    if (claimed[key]) return;
    successHaptic();
    Vibration.vibrate(60);
    persist({ ...claimed, [key]: true });
    if (onReward) onReward(ch.reward);
  };

  if (!loaded) return null;

  // Claimed challenges disappear (like completed daily quests).
  const visible = challenges.filter((ch) => !claimed[`${seasonKey}-${ch.id}`]);
  const claimedCount = challenges.length - visible.length;

  if (!visible.length) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 18 }}>
        <Text style={{ fontSize: 34 }}>🏆</Text>
        <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", marginTop: 8 }}>All {season.label.toLowerCase()} {t("seasonalChallenges.challengesDone")}</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4, textAlign: "center" }}>
          {t("seasonalChallenges.youveClaimedEveryRewardThis")}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {season.label} {t("seasonalChallenges.challenges")} {claimedCount}/{challenges.length} {t("seasonalChallenges.claimedFinishTheRestFor")}
      </Text>

      <View style={{ gap: 8, marginTop: 14 }}>
        {visible.map((ch) => {
          const isDone = ch.progress >= ch.goal;
          const pct = Math.min(100, Math.round((ch.progress / ch.goal) * 100));
          return (
            <View key={ch.id} style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: isDone ? ch.color + "66" : "rgba(255, 255, 255, 0.08)" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={{ fontSize: 20 }}>{ch.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{ch.title}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                    {Math.min(ch.progress, ch.goal)}/{ch.goal} · +{ch.reward} XP
                  </Text>
                </View>
                {isDone ? (
                  <Pressable onPress={() => claim(ch)} style={{ backgroundColor: ch.color, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 }}>
                    <Text style={{ color: "#07120b", fontSize: 12, fontWeight: "900" }}>Claim</Text>
                  </Pressable>
                ) : null}
              </View>
              {!isDone ? (
                <View style={{ height: 6, borderRadius: 4, backgroundColor: "rgba(255, 255, 255, 0.08)", overflow: "hidden", marginTop: 10 }}>
                  <View style={{ height: 6, borderRadius: 4, width: `${pct}%`, backgroundColor: ch.color }} />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
})
