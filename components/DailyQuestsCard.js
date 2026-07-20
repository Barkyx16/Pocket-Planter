import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { getTodayKey } from "../core";

export const DailyQuestsCard = memo(function DailyQuestsCard({ theme, dailyQuests, completedQuestIds, onQuestComplete }) {
  const total = dailyQuests.length || 1;
  const todayClaimed = completedQuestIds[getTodayKey()] || [];
  // Claimed quests disappear from the list — the card shrinks as you claim, and hides
  // entirely once everything's claimed.
  const visible = dailyQuests.filter((q) => !todayClaimed.includes(q.id));
  if (dailyQuests.length > 0 && visible.length === 0) return null;

  const claimedCount = dailyQuests.length - visible.length;
  const claimedXP = dailyQuests.reduce((sum, q) => sum + (todayClaimed.includes(q.id) ? q.reward : 0), 0);

  const getResetText = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msLeft = midnight - now;
    const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
    const minsLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    return hoursLeft >= 1 ? `Resets in ${hoursLeft}h` : `Resets in ${minsLeft}m`;
  };

  const diffColorOf = (d) =>
    d === "Easy" ? "#5cff89" : d === "Medium" ? "#ffd86b" : d === "Hard" ? "#ff7b7b" : d === "Bonus" ? "#d8c8ff" : "#5cff89";

  return (
    <View>
      {/* Compact header: reset chip + inline progress */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 10 }}>
        <View style={{ backgroundColor: "rgba(255,216,107,0.12)", borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5, borderWidth: 1, borderColor: "rgba(255,216,107,0.25)" }}>
          <Text style={{ color: "#ffd86b", fontSize: 11, fontWeight: "800" }}>⏳ {getResetText()}</Text>
        </View>
        <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800" }}>
          {claimedCount}/{total} claimed · +{claimedXP} XP
        </Text>
      </View>
      <View style={{ height: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 14 }}>
        <View style={{ height: 6, borderRadius: 999, backgroundColor: "#5cff89", width: `${(claimedCount / total) * 100}%` }} />
      </View>

      {/* Compact quest rows */}
      <View style={{ gap: 8 }}>
        {visible.map((quest) => {
          const c = diffColorOf(quest.difficulty);
          const alreadyClaimed = completedQuestIds[getTodayKey()]?.includes(quest.id);
          const pct = Math.min((quest.progress / quest.goal) * 100, 100);
          const claimable = quest.completed && !alreadyClaimed;
          return (
            <Pressable
              key={quest.id}
              onPress={() => { if (claimable) onQuestComplete(quest); }}
              accessibilityRole="button"
              accessibilityLabel={`${quest.title}, ${quest.progress} of ${quest.goal}${claimable ? ", tap to claim" : ""}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 11,
                padding: 10,
                borderRadius: 14,
                borderWidth: 1,
                backgroundColor: quest.completed ? `${c}14` : "rgba(255,255,255,0.05)",
                borderColor: quest.completed ? `${c}40` : "rgba(255,255,255,0.08)",
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${c}20`, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 19 }}>{quest.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text numberOfLines={1} style={{ color: quest.completed ? "#ffffff" : theme.text, fontSize: 14, fontWeight: "800", flexShrink: 1 }}>
                    {quest.title}
                  </Text>
                  <View style={{ backgroundColor: `${c}22`, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2 }}>
                    <Text style={{ color: c, fontSize: 9.5, fontWeight: "800" }}>{quest.difficulty}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 7 }}>
                  <View style={{ flex: 1, height: 5, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
                    <View style={{ height: 5, borderRadius: 999, backgroundColor: c, width: `${pct}%` }} />
                  </View>
                  <Text style={{ color: theme.secondaryText, fontSize: 10.5, fontWeight: "700" }}>
                    {quest.progress}/{quest.goal} · +{quest.reward}
                  </Text>
                </View>
              </View>

              {quest.completed ? (
                alreadyClaimed ? (
                  <View style={{ backgroundColor: `${c}22`, borderRadius: 999, width: 30, height: 30, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: c, fontSize: 13, fontWeight: "900" }}>✓</Text>
                  </View>
                ) : (
                  <View style={{ backgroundColor: c, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 9 }}>
                    <Text style={{ color: "#07120b", fontSize: 12, fontWeight: "800" }}>Claim</Text>
                  </View>
                )
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
})
