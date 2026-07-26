import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import { tapHaptic } from "../core";
import { SkeletonSection } from "./Skeleton";

export const RAIN_BARREL_STORAGE_KEY = "pp_rainBarrel";

// Everything is stored canonically in litres so switching unit systems never
// corrupts the saved level. We only convert for display and for the quick-add
// buttons.
const L_PER_GAL = 3.785;
const TYPICAL_DAILY_L = 19; // ~5 gal/day covers a modest bed + a few pots

const DEFAULT = { capacityL: 208, levelL: 0 }; // 208 L ≈ a standard 55-gal barrel

export const RainBarrelSection = memo(function RainBarrelSection({ theme, unitSystem }) {
  const metric = unitSystem === "metric";
  const [data, setData] = useState(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(RAIN_BARREL_STORAGE_KEY)
      .then((val) => {
        if (alive && val) {
          try {
            const parsed = JSON.parse(val);
            if (parsed && typeof parsed.capacityL === "number") setData({ ...DEFAULT, ...parsed });
          } catch (e) { /* ignore bad data */ }
        }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => {
    setData(next);
    AsyncStorage.setItem(RAIN_BARREL_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const clamp = (l) => Math.max(0, Math.min(data.capacityL, Math.round(l)));
  const changeLevel = (deltaL) => { tapHaptic("light"); persist({ ...data, levelL: clamp(data.levelL + deltaL) }); };
  const setCapacity = (capL) => { tapHaptic("light"); persist({ capacityL: capL, levelL: Math.min(data.levelL, capL) }); };
  const topUp = () => { tapHaptic("light"); persist({ ...data, levelL: data.capacityL }); };
  const empty = () => { tapHaptic("light"); persist({ ...data, levelL: 0 }); };

  if (!loaded) {
    return (
      <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 14 }}>
        <SkeletonSection lines={2} />
      </View>
    );
  }

  const fmt = (l) => (metric ? `${Math.round(l)} L` : `${Math.round(l / L_PER_GAL)} gal`);
  const pct = data.capacityL ? Math.round((data.levelL / data.capacityL) * 100) : 0;
  const daysLeft = Math.floor(data.levelL / TYPICAL_DAILY_L);
  const fillColor = pct >= 60 ? "#6bc7ff" : pct >= 25 ? "#8effab" : "#ffd86b";

  // Unit-aware quick amounts.
  const fillOpts = metric ? [20, 40, 80] : [5, 10, 20];
  const drawOpts = metric ? [10, 20, 40] : [2, 5, 10];
  const toL = (displayAmt) => (metric ? displayAmt : displayAmt * L_PER_GAL);
  const capacityOpts = metric
    ? [{ l: 150, label: "150 L" }, { l: 208, label: "208 L" }, { l: 300, label: "300 L" }, { l: 400, label: "400 L" }]
    : [{ l: 50 * L_PER_GAL, label: "50 gal" }, { l: 55 * L_PER_GAL, label: "55 gal" }, { l: 65 * L_PER_GAL, label: "65 gal" }, { l: 100 * L_PER_GAL, label: "100 gal" }];

  return (
    <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 14 }}>
      <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        🛢️ RAIN BARREL
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Track your collected rainwater and how long it'll keep the garden going.
      </Text>

      {/* LEVEL DISPLAY */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginTop: 12, backgroundColor: `${fillColor}12`, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: `${fillColor}30` }}>
        {/* barrel */}
        <View style={{ width: 46, height: 68, borderRadius: 10, borderWidth: 2, borderColor: `${fillColor}66`, overflow: "hidden", justifyContent: "flex-end", backgroundColor: "rgba(255,255,255,0.04)" }}>
          <View style={{ height: `${pct}%`, backgroundColor: fillColor, opacity: 0.85 }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: fillColor, fontSize: 24, fontWeight: "900" }}>{fmt(data.levelL)}</Text>
          <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800" }}>
            of {fmt(data.capacityL)} · {pct}% full
          </Text>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 4 }}>
            {data.levelL <= 0
              ? "Empty — waiting on rain."
              : `≈ ${daysLeft} day${daysLeft === 1 ? "" : "s"} of watering left`}
          </Text>
        </View>
      </View>

      {/* FILL (rain collected) */}
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>IT RAINED — ADD WATER</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {fillOpts.map((amt) => (
          <Pressable key={amt} onPress={() => changeLevel(toL(amt))} style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, backgroundColor: "rgba(107,199,255,0.12)", borderWidth: 1, borderColor: "rgba(107,199,255,0.26)" }}>
            <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900" }}>+{amt}{metric ? "L" : "gal"}</Text>
          </Pressable>
        ))}
        <Pressable onPress={topUp} style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: 12, borderRadius: 12, backgroundColor: "rgba(107,199,255,0.12)", borderWidth: 1, borderColor: "rgba(107,199,255,0.26)" }}>
          <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900" }}>Full</Text>
        </Pressable>
      </View>

      {/* DRAW (watering used) */}
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 10, marginBottom: 6 }}>WATERED — USED WATER</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {drawOpts.map((amt) => (
          <Pressable key={amt} onPress={() => changeLevel(-toL(amt))} style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, backgroundColor: "rgba(255,159,67,0.1)", borderWidth: 1, borderColor: "rgba(255,159,67,0.24)" }}>
            <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900" }}>−{amt}{metric ? "L" : "gal"}</Text>
          </Pressable>
        ))}
        <Pressable onPress={empty} style={{ alignItems: "center", justifyContent: "center", paddingHorizontal: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "900" }}>Empty</Text>
        </Pressable>
      </View>

      {/* CAPACITY */}
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>BARREL SIZE</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {capacityOpts.map((opt) => {
          const active = Math.round(data.capacityL) === Math.round(opt.l);
          return (
            <Pressable key={opt.label} onPress={() => setCapacity(Math.round(opt.l))} style={{ flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 10, backgroundColor: active ? "#6bc7ff" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#6bc7ff" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
