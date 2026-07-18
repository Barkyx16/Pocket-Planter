import { View } from "react-native";
import { styles } from "../styles";
import { MiniStat } from "./MiniStat";

export function StatsRow({ theme, compatiblePlants, savedPlants, journalEntries, streakData }) {
  return (
    <View style={styles.statsRow}>
      <MiniStat theme={theme} label="Plants" value={compatiblePlants.length} icon="🌱" />
      <MiniStat theme={theme} label="Saved" value={savedPlants.length} icon="💚" />
      <MiniStat theme={theme} label="Journal" value={journalEntries.length} icon="📓" />
      <MiniStat theme={theme} label="Streak" value={`${streakData.count}d`} icon="🔥" />
    </View>
  );
}
