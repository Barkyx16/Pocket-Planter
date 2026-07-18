import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export function DailyBonusCard({
  theme,
  dailyBonusClaimed,
  dailyBonusDate,
  onClaim,
  streakData,
}) {
const claimedRecently =
    dailyBonusDate &&
    (Date.now() - new Date(dailyBonusDate).getTime()) < 24 * 60 * 60 * 1000;

  if (claimedRecently) return null;

  const claimedToday = claimedRecently;

  return (
    <View
      style={[
        styles.dailyBonusCard,
        {
          backgroundColor: theme.card,
          borderColor: claimedToday
            ? "rgba(92,255,137,0.18)"
            : "#5cff89",
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.dailyBonusEyebrow}>
          🎁 DAILY REWARD
        </Text>

        <Text
          style={[
            styles.dailyBonusTitle,
            { color: theme.text },
          ]}
        >
        </Text>

        <Text
          style={[
            styles.dailyBonusText,
            { color: theme.secondaryText },
          ]}
        >
          {claimedToday
  ? "Today's bonus has already been claimed. Come back tomorrow!"
  : streakData?.count > 0 && streakData.count % 7 === 0
  ? "🔥 7-Day Streak! Claim your 100 XP bonus today!"
  : "Open Pocket Planter daily and claim +25 XP."}
        </Text>
      </View>

      <Pressable
        disabled={claimedToday}
        onPress={onClaim}
        style={[
          styles.dailyBonusButton,
          claimedToday &&
            styles.dailyBonusButtonClaimed,
        ]}
      >
        <Text style={styles.dailyBonusButtonText}>
          {claimedToday
  ? "✅ Claimed Today"
  : streakData?.count > 0 && streakData.count % 7 === 0
  ? "🔥 +100 XP"
  : "+25 XP"}
        </Text>
      </Pressable>
    </View>
  );
}
