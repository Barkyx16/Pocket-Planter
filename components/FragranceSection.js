import { memo, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";
import { FRAGRANT, EVENING_SCENTED } from "../data/flowerHomeData";

const findItem = (name) => produceData.find((p) => p.name === name);

export const FragranceSection = memo(function FragranceSection({ theme, savedPlants, onOpenPlant }) {
  const owned = useMemo(() => new Set((savedPlants || []).map((n) => String(n).toLowerCase())), [savedPlants]);
  const yours = [...FRAGRANT].filter((n) => owned.has(n.toLowerCase()));
  const toAdd = [...FRAGRANT].filter((n) => !owned.has(n.toLowerCase()));

  const Row = ({ name }) => {
    const item = findItem(name);
    const img = item ? resolvePlantImageSource(item) : null;
    const evening = EVENING_SCENTED.has(name);
    return (
      <Pressable onPress={() => item && onOpenPlant && onOpenPlant(item)} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {img ? <Image source={img} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 15 }}>🌼</Text>}
        </View>
        <Text style={{ flex: 1, color: theme.text, fontSize: 13, fontWeight: "800" }}>{name}</Text>
        {evening ? <Text style={{ color: "#d8c8ff", fontSize: 10, fontWeight: "900" }}>🌙 evening</Text> : <Text style={{ color: "#ffd86b", fontSize: 10, fontWeight: "900" }}>scented</Text>}
      </Pressable>
    );
  };

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Plant fragrance near a path, door, or patio — and note the ones that release scent at night.
      </Text>

      {yours.length ? (
        <>
          <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginTop: 12, marginBottom: 6 }}>YOU'RE GROWING</Text>
          <View style={{ gap: 6 }}>{yours.map((n) => <Row key={n} name={n} />)}</View>
        </>
      ) : null}

      <Text style={{ color: "#ffd86b", fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginTop: 14, marginBottom: 6 }}>ADD FOR SCENT</Text>
      <View style={{ gap: 6 }}>{toAdd.map((n) => <Row key={n} name={n} />)}</View>
    </View>
  );
});
