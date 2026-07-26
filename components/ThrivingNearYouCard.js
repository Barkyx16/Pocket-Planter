import { memo } from "react";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { supabase } from "../lib/supabase";
import { resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

export const ThrivingNearYouCard = memo(function ThrivingNearYouCard({ theme, zone, onOpenPlant }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!zone) { setLoading(false); return; }
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("top_plants_for_zone", { p_zone: String(zone) });
        if (!cancelled) {
          if (error) { console.log("thriving load error:", error); setRows([]); }
          else setRows(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [zone]);

 return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{t("thrivingNearYou.popularInZone")} {zone || "—"}</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {t("thrivingNearYou.whatGardenersInYourGrowing")}
      </Text>

      {loading ? (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "800" }}>{t("thrivingNearYou.loadingYourZone")}</Text>
        </View>
      ) : rows.length === 0 ? (
        <View style={{ marginTop: 16, backgroundColor: "rgba(142, 255, 171, 0.08)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(142, 255, 171, 0.2)" }}>
          <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "800", lineHeight: 21 }}>
            {t("thrivingNearYou.notEnoughGardenersInZone")} {zone || t("thrivingNearYou.yourArea")} {t("thrivingNearYou.yetAsMorePeopleGrow")}
          </Text>
        </View>
      ) : (
        <View style={{ gap: 10, marginTop: 16 }}>
          {rows.map((r, i) => {
            const plant = produceData.find((p) => p.name === r.plant_name);
            const img = plant ? resolvePlantImageSource(plant) : null;
            return (
              <Pressable
                key={r.plant_name}
                onPress={() => plant && onOpenPlant(plant)}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(142, 255, 171, 0.16)" }}
              >
                <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900", width: 26 }}>#{i + 1}</Text>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{r.plant_name}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                    🌱 {r.saves} saved{r.harvests > 0 ? ` · 🎉 ${r.harvests} harvested` : ""} · {r.gardeners} gardener{r.gardeners === 1 ? "" : "s"}
                  </Text>
                </View>
                {plant ? <Text style={{ color: "#8effab", fontSize: 20, fontWeight: "900" }}>›</Text> : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
})
