import { Text, View } from "react-native";
import { styles } from "../styles";

export function WeeklyAndTasksCard({ theme, savedPlants, journalEntries, wateredPlants, gardenXP, streakData, weather }) {
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
          <Text style={styles.weeklyRecapEyebrow}>WEEKLY RECAP</Text>
          <Text style={[styles.weeklyRecapTitle, { color: theme.text }]}>Your Garden Progress 🌱</Text>
          <View style={styles.weeklyRecapGrid}>
            {wateredCount > 0 && <Text style={styles.weeklyRecapItem}>💧 Watered: {wateredCount}</Text>}
            {journalEntries.length > 0 && <Text style={styles.weeklyRecapItem}>📸 Photos: {journalEntries.length}</Text>}
            {savedPlants.length > 0 && <Text style={styles.weeklyRecapItem}>🪴 Saved: {savedPlants.length}</Text>}
            {gardenXP.xp > 0 && <Text style={styles.weeklyRecapItem}>⭐ XP: {gardenXP.xp}</Text>}
          </View>
          <Text style={styles.weeklyRecapFooter}>🔥 Current streak: {streakData?.count || 0} days</Text>
        </>
      ) : (
        <>
          <Text style={styles.weeklyRecapEyebrow}>GET STARTED</Text>
          <Text style={[styles.weeklyRecapTitle, { color: theme.text }]}>Start your garden story</Text>
          <Text style={[styles.weeklyFirstUseText, { color: theme.secondaryText }]}>Save your first plant, log a photo, or mark something as watered — your recap will appear here.</Text>
          <View style={styles.weeklyFirstUseRow}>
            <Text style={styles.weeklyFirstUsePill}>💧 Water a plant</Text>
            <Text style={styles.weeklyFirstUsePill}>📸 Add a photo</Text>
            <Text style={styles.weeklyFirstUsePill}>🌱 Save a plant</Text>
          </View>
        </>
      )}
      <View style={styles.weeklyTaskDivider} />
      <Text style={styles.weatherTaskEyebrow}>SMART TASKS</Text>
      {tasks.map((task) => (<Text key={task} style={styles.weatherTaskItem}>{task}</Text>))}
    </View>
  );
}
