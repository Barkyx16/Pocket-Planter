import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { getTodayKey } from "../core";

export function DailyQuestsCard({ theme, dailyQuests, completedQuestIds, onQuestComplete }) {
  const completedCount = dailyQuests.filter((quest) => quest.completed).length;
  const totalXP = dailyQuests.reduce((sum, q) => sum + (q.completed ? q.reward : 0), 0);

  if (dailyQuests.length > 0 && completedCount === dailyQuests.length) return null;

  const getResetText = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msLeft = midnight - now;
    const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
    const minsLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    if (hoursLeft >= 1) return `Resets in ${hoursLeft}h`;
    return `Resets in ${minsLeft}m`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "#5cff89";
      case "Medium": return "#ffd86b";
      case "Hard": return "#ff7b7b";
      case "Bonus": return "#d8c8ff";
      default: return "#5cff89";
    }
  };

return (
    <View>
     <Text style={[styles.cardText, { color: theme.secondaryText }]}>
      </Text>
      <View style={{ alignSelf: "flex-start", marginTop: 8, backgroundColor: "rgba(255,216,107,0.12)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(255,216,107,0.25)" }}>
        <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900" }}>⏳ {getResetText()}</Text>
      </View>

      {/* PROGRESS SUMMARY */}
      <View style={styles.questProgressSummary}>
        <View style={styles.questProgressLeft}>
          <Text style={styles.questProgressValue}>{completedCount}/{dailyQuests.length}</Text>
          <Text style={[styles.questProgressLabel, { color: theme.secondaryText }]}>Completed</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.questProgressTrack}>
            <View style={[styles.questProgressFill, { width: `${(completedCount / dailyQuests.length) * 100}%` }]} />
          </View>
          <Text style={styles.questProgressXP}>+{totalXP} XP earned today</Text>
        </View>
        {completedCount === dailyQuests.length ? (
          <Text style={styles.questAllDoneEmoji}>🌟</Text>
        ) : null}
      </View>

      {/* QUEST LIST */}
      <View style={styles.questList}>
        {dailyQuests.map((quest) => {
          const diffColor = getDifficultyColor(quest.difficulty);
          const alreadyClaimed = completedQuestIds[getTodayKey()]?.includes(quest.id);

          return (
            <Pressable
              key={quest.id}
              onPress={() => {
                if (quest.completed && !alreadyClaimed) {
                  onQuestComplete(quest);
                }
              }}
              style={[styles.questRowV2, {
                backgroundColor: quest.completed
                  ? diffColor + "14"
                  : "rgba(255,255,255,0.05)",
                borderColor: quest.completed
                  ? diffColor + "40"
                  : "rgba(255,255,255,0.08)",
              }]}
            >
              {/* ICON */}
              <View style={[styles.questIconWrap, { backgroundColor: diffColor + "20" }]}>
                <Text style={styles.questIcon}>{quest.icon}</Text>
              </View>

              {/* CONTENT */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[styles.questTitle, { color: quest.completed ? "#ffffff" : "#8fbf9d" }]}>
                    {quest.title}
                  </Text>
                  <View style={[styles.questDifficultyBadge, { backgroundColor: diffColor + "22" }]}>
                    <Text style={[styles.questDifficultyText, { color: diffColor }]}>{quest.difficulty}</Text>
                  </View>
                </View>
                <Text style={[styles.questDescription, { color: theme.secondaryText }]}>{quest.description}</Text>

                {/* PROGRESS BAR */}
                <View style={styles.questProgressBarTrack}>
                  <View style={[styles.questProgressBarFill, {
                    width: `${Math.min((quest.progress / quest.goal) * 100, 100)}%`,
                    backgroundColor: diffColor,
                  }]} />
                </View>
                <Text style={[styles.questProgressFraction, { color: diffColor }]}>
                  {quest.progress}/{quest.goal} • +{quest.reward} XP
                </Text>
              </View>

              {/* STATUS */}
              {quest.completed ? (
                alreadyClaimed ? (
                  <View style={[styles.questClaimedBadge, { backgroundColor: diffColor + "22" }]}>
                    <Text style={[styles.questClaimedText, { color: diffColor }]}>✓ Claimed</Text>
                  </View>
                ) : (
                  <View style={[styles.questClaimButton, { backgroundColor: diffColor }]}>
                    <Text style={styles.questClaimButtonText}>Claim!</Text>
                  </View>
                )
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {/* ALL DONE */}
      {completedCount === dailyQuests.length ? (
        <View style={styles.questAllDoneBox}>
          <Text style={styles.questAllDoneTitle}>🌟 All quests complete!</Text>
          <Text style={[styles.questAllDoneText, { color: theme.secondaryText }]}>
            Amazing work! Come back tomorrow for new quests.
          </Text>
        </View>
      ) : null}
    </View>
  );
}
