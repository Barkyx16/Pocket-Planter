import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const WeeklyAndTasksCard = memo(function WeeklyAndTasksCard({ theme, savedPlants, journalEntries, wateredPlants, gardenXP, streakData, weather }) {
  const { t } = useTranslation();
  const wateredCount = Object.values(wateredPlants || {}).filter(Boolean).length;
  const hasAnyData = savedPlants.length > 0 || journalEntries.length > 0 || wateredCount > 0;

  const tasks = [];
  if (weather?.maxTempF >= 95) tasks.push("🔥 Water early before peak heat.");
  if (weather?.precipChance >= 65) tasks.push("🌧️ Check soil before watering.");
  if (weather?.minTempF <= 35) tasks.push("❄️ Cover sensitive plants tonight.");
  if (!tasks.length) tasks.push("☀️ Great day for normal garden care.");

  return (
    <View style={[styles.weeklyRecapCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {hasAnyData ? (
        <>
          <Text style={styles.weeklyRecapEyebrow}>{t("weeklyAndTasks.weeklyRecap")}</Text>
          <Text style={[styles.weeklyRecapTitle, { color: theme.text }]}>{t("weeklyAndTasks.yourGardenProgress")}</Text>
          <View style={styles.weeklyRecapGrid}>
            {wateredCount > 0 && <Text style={styles.weeklyRecapItem}>{t("weeklyAndTasks.watered")} {wateredCount}</Text>}
            {journalEntries.length > 0 && <Text style={styles.weeklyRecapItem}>{t("weeklyAndTasks.photos")} {journalEntries.length}</Text>}
            {savedPlants.length > 0 && <Text style={styles.weeklyRecapItem}>{t("weeklyAndTasks.saved")} {savedPlants.length}</Text>}
            {gardenXP.xp > 0 && <Text style={styles.weeklyRecapItem}>{t("weeklyAndTasks.xp")} {gardenXP.xp}</Text>}
          </View>
          <Text style={styles.weeklyRecapFooter}>{t("weeklyAndTasks.currentStreak")} {streakData?.count || 0} days</Text>
        </>
      ) : (
        <>
          <Text style={styles.weeklyRecapEyebrow}>{t("weeklyAndTasks.getStarted")}</Text>
          <Text style={[styles.weeklyRecapTitle, { color: theme.text }]}>{t("weeklyAndTasks.startYourGardenStory")}</Text>
          <Text style={[styles.weeklyFirstUseText, { color: theme.secondaryText }]}>{t("weeklyAndTasks.saveYourFirstPlantLog")}</Text>
          <View style={styles.weeklyFirstUseRow}>
            <IconText label={t("weeklyAndTasks.waterAPlant")} style={styles.weeklyFirstUsePill} />
            <IconText label={t("weeklyAndTasks.addAPhoto")} style={styles.weeklyFirstUsePill} />
            <IconText label={t("weeklyAndTasks.saveAPlant")} style={styles.weeklyFirstUsePill} />
          </View>
        </>
      )}
      <View style={styles.weeklyTaskDivider} />
      <Text style={styles.weatherTaskEyebrow}>{t("weeklyAndTasks.smartTasks")}</Text>
      {tasks.map((task) => (<Text key={task} style={styles.weatherTaskItem}>{task}</Text>))}
    </View>
  );
})
