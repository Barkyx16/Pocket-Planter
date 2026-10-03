import { memo, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getDaysSince, getTodayKey, normalizeType, resolvePlantImageSource, tapHaptic } from "../core";
import { HOUSEPLANT_CARE, HOUSEPLANT_CARE_DEFAULT } from "../data/flowerHomeData";
import { SkeletonSection } from "./Skeleton";
import { t, useLanguage } from "../lib/i18n";

export const HOUSEPLANT_CARELOG_STORAGE_KEY = "pp_houseplantCare";

// Midday-to-midday via core: measuring from the current clock time reported a
// day less than had actually passed, all morning.
const daysSince = (dateKey) => getDaysSince(dateKey);

export const HouseplantCareLogSection = memo(function HouseplantCareLogSection({ theme, savedPlants, onOpenPlant }) {
  useLanguage(); // memo() skips a language switch without this (see lib/i18n)
  const [log, setLog] = useState({}); // { name: { watered: dateKey, repot: dateKey } }
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(HOUSEPLANT_CARELOG_STORAGE_KEY)
      .then((val) => {
        if (alive && val) { try { setLog(JSON.parse(val) || {}); } catch (e) { /* ignore */ } }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setLog(next); AsyncStorage.setItem(HOUSEPLANT_CARELOG_STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };
  const mark = (name, key) => { tapHaptic("light"); persist({ ...log, [name]: { ...(log[name] || {}), [key]: getTodayKey() } }); };

  const houseplants = useMemo(
    () => (savedPlants || []).map((n) => produceData.find((p) => p.name === n)).filter((p) => p && normalizeType(p.type, p.name) === "Houseplants"),
    [savedPlants]
  );

  if (!loaded) return <View style={{ marginTop: 2 }}><SkeletonSection lines={2} /></View>;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        {t("tools.careIntro")}
      </Text>

      {houseplants.length ? (
        <View style={{ gap: 8, marginTop: 12 }}>
          {houseplants.map((item) => {
            const [, waterDays, , repotYears] = HOUSEPLANT_CARE[item.name] || HOUSEPLANT_CARE_DEFAULT;
            const rec = log[item.name] || {};
            const wSince = daysSince(rec.watered);
            const waterDue = wSince == null || wSince >= waterDays;
            const wLeft = wSince == null ? null : waterDays - wSince;
            const rSince = daysSince(rec.repot);
            const repotDue = rSince != null && rSince >= repotYears * 365;
            const img = resolvePlantImageSource(item);
            return (
              <View key={item.name} style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Pressable accessibilityRole="button" onPress={() => onOpenPlant && onOpenPlant(item)} style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 15 }}>🪴</Text>}
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 13, fontWeight: "900" }}>{item.name}</Text>
                    <Text style={{ color: waterDue ? "#6bc7ff" : theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 1 }}>
                      💧 {wSince == null ? t("tools.careNotLogged") : waterDue ? t("tools.careWaterDue") : t("tools.careInDays", { count: wLeft })}{repotDue ? ` · ${t("tools.careRepotDue")}` : ""}
                    </Text>
                  </View>
                  <Pressable accessibilityRole="button" onPress={() => mark(item.name, "watered")} accessibilityLabel={t("a11y.logWater", { name: item.name })} style={{ backgroundColor: waterDue ? "#6bc7ff" : "rgba(255,255,255,0.08)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 }}>
                    <Text style={{ color: waterDue ? "#07120b" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>💧</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" onPress={() => mark(item.name, "repot")} accessibilityLabel={t("a11y.logRepot", { name: item.name })} style={{ backgroundColor: repotDue ? "#ffd86b" : "rgba(255,255,255,0.08)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 }}>
                    <Text style={{ color: repotDue ? "#07120b" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>🪴</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", fontStyle: "italic", marginTop: 12 }}>{t("tools.careEmpty")}</Text>
      )}
    </View>
  );
});
