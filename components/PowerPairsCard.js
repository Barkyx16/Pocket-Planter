import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { getPowerPairs, resolvePlantImageSource } from "../core";

export function PowerPairsCard({ theme, gardenAreas, onOpenPlant }) {
  const pairs = getPowerPairs(gardenAreas);
  if (!pairs.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "rgba(92,255,137,0.30)" }]}>
      <Text style={styles.cardEyebrow}>🟢 POWER PAIRS</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Great Companions You're Growing</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        These plants share a bed and genuinely help each other — better growth, pest deterrence, or smarter use of space. Nice work.
      </Text>
      <View style={{ gap: 10, marginTop: 16 }}>
        {pairs.map(({ a, b, areaName }, i) => {
          const itemA = produceData.find((p) => p.name === a);
          const itemB = produceData.find((p) => p.name === b);
          const imgA = itemA ? resolvePlantImageSource(itemA) : null;
          const imgB = itemB ? resolvePlantImageSource(itemB) : null;
          return (
            <View
              key={`pair-${a}-${b}-${i}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(92,255,137,0.07)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => itemA && onOpenPlant(itemA)} style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 2 }}>
                  {imgA ? <Image source={imgA} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                </Pressable>
                <Pressable onPress={() => itemB && onOpenPlant(itemB)} style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", marginLeft: -10, borderWidth: 2, borderColor: theme.card }}>
                  {imgB ? <Image source={imgB} style={{ width: 30, height: 30 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🌱</Text>}
                </Pressable>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{a} + {b}</Text>
                <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                  🟢 Great pairing in {areaName}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
