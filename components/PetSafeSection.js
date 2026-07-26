import { memo, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { resolvePlantImageSource } from "../core";
import { PET_TOXIC, PET_SAFE } from "../data/flowerHomeData";

const SEV = {
  severe: { color: "#ff7b7b", label: "SEVERE" },
  toxic: { color: "#ff9f43", label: "TOXIC" },
  mild: { color: "#ffd86b", label: "MILD" },
};

export const PetSafeSection = memo(function PetSafeSection({ theme, savedPlants, onOpenPlant }) {
  const { toxic, safe, unknown } = useMemo(() => {
    const t = [], s = [], u = [];
    (savedPlants || []).forEach((n) => {
      const item = produceData.find((p) => p.name === n);
      if (!item) return;
      if (PET_TOXIC[n]) t.push({ item, sev: PET_TOXIC[n][0], note: PET_TOXIC[n][1] });
      else if (PET_SAFE.has(n)) s.push({ item });
      else u.push({ item });
    });
    const rank = { severe: 0, toxic: 1, mild: 2 };
    t.sort((a, b) => rank[a.sev] - rank[b.sev]);
    return { toxic: t, safe: s, unknown: u };
  }, [savedPlants]);

  const Row = ({ item, sev, note, tint }) => {
    const img = resolvePlantImageSource(item);
    const meta = sev ? SEV[sev] : null;
    return (
      <Pressable onPress={() => onOpenPlant && onOpenPlant(item)} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: `${tint}12`, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: `${tint}30` }}>
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {img ? <Image source={img} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 15 }}>🌿</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: theme.text, fontSize: 13, fontWeight: "900" }}>{item.name}</Text>
            {meta ? <Text style={{ color: meta.color, fontSize: 10, fontWeight: "900" }}>{meta.label}</Text> : <Text style={{ color: tint, fontSize: 10, fontWeight: "900" }}>SAFE</Text>}
          </View>
          {note ? <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", lineHeight: 15, marginTop: 2 }}>{note}</Text> : null}
        </View>
      </Pressable>
    );
  };

  const hasAny = toxic.length || safe.length || unknown.length;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Which of your plants are risky around cats and dogs.
      </Text>

      {!hasAny ? (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", fontStyle: "italic", marginTop: 12 }}>Save some flowers or houseplants to check them here.</Text>
      ) : null}

      {toxic.length ? (
        <>
          <Text style={{ color: "#ff9f43", fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginTop: 12, marginBottom: 6 }}>⚠️ KEEP AWAY FROM PETS</Text>
          <View style={{ gap: 6 }}>{toxic.map((r) => <Row key={r.item.name} item={r.item} sev={r.sev} note={r.note} tint={SEV[r.sev].color} />)}</View>
        </>
      ) : null}

      {safe.length ? (
        <>
          <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginTop: 14, marginBottom: 6 }}>✅ PET-SAFE</Text>
          <View style={{ gap: 6 }}>{safe.map((r) => <Row key={r.item.name} item={r.item} tint="#5cff89" />)}</View>
        </>
      ) : null}

      {unknown.length ? (
        <>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginTop: 14, marginBottom: 6 }}>❔ NOT LISTED — CHECK FIRST</Text>
          <View style={{ gap: 6 }}>{unknown.map((r) => <Row key={r.item.name} item={r.item} tint="#8fbf9d" />)}</View>
        </>
      ) : null}

      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 12, fontStyle: "italic", lineHeight: 14 }}>
        Best-effort guidance, not veterinary advice. When unsure, keep plants out of reach and check the ASPCA list or your vet.
      </Text>
    </View>
  );
});
