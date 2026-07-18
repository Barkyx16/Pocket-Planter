import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export function GardenHealthHomeCard({ theme, gardenHealth, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>🌱 Garden Health</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText, marginTop: 6 }]}>{gardenHealth.score}% • {gardenHealth.label}</Text>
      <View style={{ marginTop: 10, alignSelf: "flex-start", backgroundColor: "#5cff89", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 }}>
        <Text style={{ color: "#07120b", fontWeight: "800" }}>Open Garden →</Text>
      </View>
    </Pressable>
  );
}
