import { memo, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { normalizeType, resolvePlantImageSource } from "../core";
import { DEADHEAD_TIPS, DEADHEAD_DEFAULT } from "../data/flowerHomeData";

export const DeadheadScheduleSection = memo(function DeadheadScheduleSection({ theme, savedPlants, onOpenPlant }) {
  const flowers = useMemo(
    () => (savedPlants || [])
      .map((n) => produceData.find((p) => p.name === n))
      .filter((p) => p && normalizeType(p.type, p.name) === "Flowers"),
    [savedPlants]
  );

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Deadheading — removing spent blooms — is the single easiest way to keep flowers producing all season.
      </Text>
      {flowers.length ? (
        <View style={{ gap: 8, marginTop: 12 }}>
          {flowers.map((item) => {
            const img = resolvePlantImageSource(item);
            return (
              <Pressable key={item.name} onPress={() => onOpenPlant && onOpenPlant(item)} style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 28, height: 28 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>✂️</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 13, fontWeight: "900" }}>{item.name}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 16, marginTop: 2 }}>{DEADHEAD_TIPS[item.name] || DEADHEAD_DEFAULT}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", fontStyle: "italic", marginTop: 12 }}>
          Save some flowers and their deadheading tips will show up here.
        </Text>
      )}
    </View>
  );
});
