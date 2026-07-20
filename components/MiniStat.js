import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";

export const MiniStat = memo(function MiniStat({ theme, label, value, icon }) {
  return (
    <View style={[styles.miniStat, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.miniStatIcon}>{icon}</Text>
      <Text style={[styles.miniStatValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.miniStatLabel, { color: theme.secondaryText }]}>{label}</Text>
    </View>
  );
})
