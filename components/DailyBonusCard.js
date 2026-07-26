import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const DailyBonusCard = memo(function DailyBonusCard({
  theme,
  dailyBonusClaimed,
  dailyBonusDate,
  onClaim,
  streakData,
}) {
  const { t } = useTranslation();
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
            ? "rgba(92, 255, 137, 0.16)"
            : "#5cff89",
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <IconText label={t("dailyBonus.dailyReward")} style={styles.dailyBonusEyebrow} />

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
  ? t("dailyBonus.todaysBonusHasAlreadyBeen")
  : streakData?.count > 0 && streakData.count % 7 === 0
  ? t("dailyBonus.n7dayStreakClaimYour100")
  : t("dailyBonus.openPocketPlanterDailyAnd")}
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
  ? t("dailyBonus.claimedToday")
  : streakData?.count > 0 && streakData.count % 7 === 0
  ? t("dailyBonus.n100Xp")
  : t("dailyBonus.n25Xp")}
        </Text>
      </Pressable>
    </View>
  );
})
