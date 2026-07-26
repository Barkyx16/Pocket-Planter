import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import { tapHaptic } from "../core";
import { useTranslation } from "../lib/i18n";

const STORAGE_KEY = "pp_sunlightByArea";

const sunLabel = (hours) => {
  if (hours == null) return null;
  if (hours >= 6) return { label: "Full sun", color: "#ffd86b", note: "Great for tomatoes, peppers, squash, most veggies." };
  if (hours >= 4) return { label: "Partial sun", color: "#8effab", note: "Good for greens, herbs, root crops, brassicas." };
  return { label: "Shade", color: "#6bc7ff", note: "Best for leafy greens, mint, and shade-tolerant herbs." };
};

export const SunlightTrackerCard = memo(function SunlightTrackerCard({ theme, gardenAreas }) {
  const { t } = useTranslation();
  const [byArea, setByArea] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) { try { setByArea(JSON.parse(val) || {}); } catch (e) { /* ignore */ } }
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const setHours = (areaId, hours) => {
    tapHaptic("light");
    const next = { ...byArea, [areaId]: hours };
    setByArea(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const areas = (gardenAreas || []).filter((a) => a && a.name);
  if (!loaded) return null;

  if (!areas.length) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("sunlightTracker.addAGardenBedFirst")}
      </Text>
    );
  }

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("sunlightTracker.watchEachBedOverA")}
      </Text>

      <View style={{ gap: 10, marginTop: 14 }}>
        {areas.map((area) => {
          const hours = byArea[area.id];
          const info = sunLabel(hours);
          return (
            <View key={area.id} style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{area.emoji || "🌿"} {area.name}</Text>
                {info ? <Text style={{ color: info.color, fontSize: 12, fontWeight: "900" }}>☀️ {info.label}</Text> : null}
              </View>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}>
                {[2, 4, 6, 8].map((h) => {
                  const active = hours === h;
                  return (
                    <Pressable key={h} onPress={() => setHours(area.id, h)} style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 8, backgroundColor: active ? "#ffd86b" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: active ? "#ffd86b" : "rgba(255, 255, 255, 0.1)" }}>
                      <Text style={{ color: active ? "#3d2c00" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{h === 8 ? "8+" : h}h</Text>
                    </Pressable>
                  );
                })}
              </View>
              {info ? <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 16, marginTop: 8 }}>{info.note}</Text> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
})
