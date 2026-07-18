import { Text, View } from "react-native";
import { styles } from "../styles";

export function WeatherTaskCard({ theme, weather }) {
  const tasks = [];
  if (weather?.maxTempF >= 95) { tasks.push("🔥 Water early before peak heat."); tasks.push("🪴 Move containers into partial shade."); }
  if (weather?.precipChance >= 65) { tasks.push("🌧️ Check soil before watering."); tasks.push("🧺 Make sure pots can drain."); }
  if (weather?.minTempF <= 35) { tasks.push("❄️ Cover sensitive plants tonight."); tasks.push("🏠 Move small pots near shelter."); }
  if (!tasks.length) { tasks.push("☀️ Great day for normal garden care."); tasks.push("🌱 Check saved plants and add progress photos."); }
  return (
    <View style={[styles.weatherTaskCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.weatherTaskEyebrow}>SMART TASKS</Text>
      <Text style={[styles.weatherTaskTitle, { color: theme.text }]}>Weather-Based Tasks</Text>
      {tasks.map((task) => (<Text key={task} style={styles.weatherTaskItem}>{task}</Text>))}
    </View>
  );
}
