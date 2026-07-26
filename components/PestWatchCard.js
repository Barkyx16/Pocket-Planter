import { memo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { getActivePests, tapHaptic } from "../core";
import { getPestImage } from "../data/pestImageMap";
import { formatDate, useTranslation } from "../lib/i18n";

export const PestWatchCard = memo(function PestWatchCard({ theme, savedPlantObjs, zone, onOpenPlant, onOpenPest }) {
  const { t } = useTranslation();
  const month = new Date().getMonth() + 1;
  const pests = getActivePests(savedPlantObjs, month, zone);
  const [visible, setVisible] = useState(5);

  if (!pests.length) return null;

  const monthName = formatDate(new Date(), {
  month: "long"
});
  const zoneLabel = zone ? `Zone ${zone}` : "your zone";

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 19, marginTop: 2 }}>
        {pests.length} pest{pests.length === 1 ? "" : "s"} {t("pestWatch.commonIn")} {zoneLabel} around {monthName}{t("pestWatch.tapAnyPestForA")}
      </Text>

      <View style={{ gap: 8, marginTop: 14 }}>
        {pests.slice(0, visible).map((pest) => (
          <Pressable
            key={pest.name}
            onPress={() => { tapHaptic("light"); onOpenPest ? onOpenPest(pest) : null; }}
            accessibilityRole="button"
            accessibilityLabel={`${pest.name}, threatens ${pest.affected.join(", ")}. Tap for the full pest guide.`}
            style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255, 123, 123, 0.16)" }}
          >
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255, 123, 123, 0.12)", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {getPestImage(pest.name) ? (
                <Image source={getPestImage(pest.name)} style={{ width: 38, height: 38 }} resizeMode="cover" />
              ) : (
                <Text style={{ fontSize: 20 }}>{pest.emoji}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{pest.name}</Text>
              <Text numberOfLines={1} style={{ color: "#ff9f9f", fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                Hits {pest.affected.slice(0, 2).join(", ")}{pest.affected.length > 2 ? ` +${pest.affected.length - 2}` : ""}
              </Text>
            </View>
            <Text style={{ color: "#ff9f9f", fontSize: 18, fontWeight: "900" }}>›</Text>
          </Pressable>
        ))}
      </View>

      {pests.length > visible ? (
        <Pressable
          onPress={() => setVisible((c) => c + 6)}
          style={{ marginTop: 12, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
        >
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>{t("pestWatch.showMorePests")}{pests.length - visible} {t("pestWatch.more")}</Text>
        </Pressable>
      ) : null}

      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "600", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        {t("pestWatch.basedOnTypicalActivityIn")}
      </Text>
    </View>
  );
})
