import { memo, useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { successHaptic, tapHaptic } from "../core";

// ── Unit + mixing constants ──────────────────────────────────────────────────
const GAL_TO_L = 3.785;
const TBSP_TO_TSP = 3;
const TBSP_TO_ML = 14.79;
const IN3_PER_GAL = 231;
const INCH_SQFT_TO_GAL = 0.623; // 1" of water over 1 sq ft ≈ 0.623 gal
const CAN_GAL = 2; // a typical watering can
const HOSE_GAL_PER_MIN = 6; // an average garden hose on a gentle setting

const round = (n, d = 1) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

function Chip({ label, active, onPress, color = "#8effab" }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{ flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 10, backgroundColor: active ? color : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? color : "rgba(255,255,255,0.1)" }}
    >
      <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 11, fontWeight: "900" }}>{label}</Text>
    </Pressable>
  );
}

function numInput(theme, value, onChange, placeholder) {
  return (
    <TextInput
      value={value}
      onChangeText={(txt) => onChange(txt.replace(/[^0-9.]/g, ""))}
      keyboardType="decimal-pad"
      placeholder={placeholder}
      placeholderTextColor="#8fbf9d"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontWeight: "800" }}
    />
  );
}

// ── Fertilizer mixing ────────────────────────────────────────────────────────
function FertilizerCalc({ theme, metric }) {
  const [containerL, setContainerL] = useState(String(metric ? 8 : round(2 * GAL_TO_L, 2))); // stored in litres
  const [ratePerGal, setRatePerGal] = useState(1); // tbsp per gallon (label rate)
  const [strength, setStrength] = useState(1);

  const containerVol = parseFloat(containerL) || 0; // litres
  const gallons = containerVol / GAL_TO_L;
  const tbsp = ratePerGal * gallons * strength;
  const valid = containerVol > 0;

  const containerPresets = metric
    ? [{ l: 4, label: "4 L" }, { l: 8, label: "8 L" }, { l: 10, label: "10 L" }]
    : [{ l: 1 * GAL_TO_L, label: "1 gal" }, { l: 2 * GAL_TO_L, label: "2 gal" }, { l: 5 * GAL_TO_L, label: "5 gal" }];

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Mix water-soluble fertilizer to the right strength — no more guessing at the scoop.
      </Text>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>WATERING CONTAINER ({metric ? "litres" : "gallons"})</Text>
      {numInput(theme, containerL, setContainerL, metric ? "e.g. 8" : "e.g. 7.6")}
      <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
        {containerPresets.map((p) => (
          <Chip key={p.label} label={p.label} color="#6bc7ff" active={Math.abs(containerVol - p.l) < 0.05} onPress={() => setContainerL(String(round(p.l, 2)))} />
        ))}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>LABEL RATE (from your fertilizer)</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[0.5, 1, 1.5, 2].map((r) => (
          <Chip key={r} label={`${r} tbsp/gal`} active={ratePerGal === r} onPress={() => setRatePerGal(r)} />
        ))}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>STRENGTH</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        <Chip label="Seedling ¼" active={strength === 0.25} onPress={() => setStrength(0.25)} color="#ffd86b" />
        <Chip label="Half ½" active={strength === 0.5} onPress={() => setStrength(0.5)} color="#ffd86b" />
        <Chip label="Full" active={strength === 1} onPress={() => setStrength(1)} color="#ffd86b" />
      </View>

      {/* RESULT */}
      <View style={{ marginTop: 14, backgroundColor: "rgba(92,255,137,0.1)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)" }}>
        {valid ? (
          <>
            <Text style={{ color: "#8effab", fontSize: 22, fontWeight: "900" }}>
              {round(tbsp, 2)} tbsp
            </Text>
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800", marginTop: 2 }}>
              ≈ {round(tbsp * TBSP_TO_TSP, 1)} tsp · {round(tbsp * TBSP_TO_ML)} mL
            </Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 6 }}>
              Stir into your {metric ? `${round(containerVol)} L` : `${round(gallons, 1)} gal`} container, then water as usual.
            </Text>
          </>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>Enter a container size to see the mix.</Text>
        )}
      </View>
    </View>
  );
}

// ── Watering volume ──────────────────────────────────────────────────────────
function WateringCalc({ theme, metric }) {
  const [mode, setMode] = useState("bed"); // bed | pot
  const [area, setArea] = useState(metric ? "1" : "10"); // m² or sq ft
  const [inchesWeek, setInchesWeek] = useState(metric ? 25 : 1); // mm/week (metric) or in/week (imperial)
  const [timesWeek, setTimesWeek] = useState(2);
  const [diam, setDiam] = useState(metric ? "25" : "10"); // pot diameter

  // Weekly targets differ by unit: inches vs mm.
  const targetOpts = metric
    ? [{ v: 12, label: "12 mm" }, { v: 25, label: "25 mm" }, { v: 38, label: "38 mm" }]
    : [{ v: 0.5, label: '0.5"' }, { v: 1, label: '1"' }, { v: 1.5, label: '1.5"' }];

  let weeklyGal = 0;
  if (mode === "bed") {
    const a = parseFloat(area) || 0;
    if (metric) {
      // litres/week = area(m²) × mm  (1 mm over 1 m² = 1 L) → convert to gal for shared display math
      weeklyGal = (a * inchesWeek) / GAL_TO_L;
    } else {
      weeklyGal = a * inchesWeek * INCH_SQFT_TO_GAL;
    }
  }

  // Container: soil volume ≈ cylinder with height ≈ 0.9 × diameter, water per
  // soak ≈ 20% of that volume (enough to wet through and get a little run-off).
  let potGal = 0;
  if (mode === "pot") {
    const d = parseFloat(diam) || 0;
    if (metric) {
      const volCm3 = 0.707 * d * d * d; // 0.9 × π/4 ≈ 0.707
      potGal = (volCm3 / 1000) * 0.2 / GAL_TO_L;
    } else {
      const volIn3 = 0.707 * d * d * d;
      potGal = (volIn3 / IN3_PER_GAL) * 0.2;
    }
  }

  const perWaterGal = mode === "bed" ? (timesWeek ? weeklyGal / timesWeek : weeklyGal) : potGal;
  const fmtVol = (gal) => (metric ? `${round(gal * GAL_TO_L, 1)} L` : `${round(gal, 2)} gal`);
  const cans = perWaterGal / CAN_GAL;
  const hoseSec = Math.round((perWaterGal / HOSE_GAL_PER_MIN) * 60);
  const valid = perWaterGal > 0;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Work out how much water a bed or pot actually needs — and how long that is on the hose.
      </Text>

      <View style={{ flexDirection: "row", gap: 6, marginTop: 12 }}>
        <Chip label="🛏️ Garden bed" color="#6bc7ff" active={mode === "bed"} onPress={() => setMode("bed")} />
        <Chip label="🪴 Pot / container" color="#6bc7ff" active={mode === "pot"} onPress={() => setMode("pot")} />
      </View>

      {mode === "bed" ? (
        <>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>BED AREA ({metric ? "m²" : "sq ft"})</Text>
          {numInput(theme, area, setArea, metric ? "e.g. 1" : "e.g. 10")}
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>WATER PER WEEK</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {targetOpts.map((o) => (
              <Chip key={o.label} label={o.label} active={inchesWeek === o.v} onPress={() => setInchesWeek(o.v)} />
            ))}
          </View>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>WATERINGS PER WEEK</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {[1, 2, 3, 7].map((n) => (
              <Chip key={n} label={`${n}×`} active={timesWeek === n} onPress={() => setTimesWeek(n)} />
            ))}
          </View>
        </>
      ) : (
        <>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>POT DIAMETER ({metric ? "cm" : "inches"})</Text>
          {numInput(theme, diam, setDiam, metric ? "e.g. 25" : "e.g. 10")}
        </>
      )}

      {/* RESULT */}
      <View style={{ marginTop: 14, backgroundColor: "rgba(107,199,255,0.1)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.28)" }}>
        {valid ? (
          <>
            <Text style={{ color: "#6bc7ff", fontSize: 22, fontWeight: "900" }}>{fmtVol(perWaterGal)}</Text>
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800", marginTop: 2 }}>
              per watering{mode === "bed" ? ` (${fmtVol(weeklyGal)}/week)` : ""}
            </Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 6 }}>
              ≈ {round(cans, 1)} watering can{cans >= 1.05 || cans < 0.95 ? "s" : ""} · or {hoseSec}s of hose
            </Text>
          </>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>Enter a size to estimate.</Text>
        )}
      </View>
    </View>
  );
}

// ── Watering timer ───────────────────────────────────────────────────────────
const PRESETS_SEC = [30, 60, 120, 300, 600];
const fmtClock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function WateringTimer({ theme }) {
  const [total, setTotal] = useState(120);
  const [left, setLeft] = useState(120);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    ref.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(ref.current);
          setRunning(false);
          try { successHaptic(); } catch (e) { /* ignore */ }
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  const setPreset = (sec) => { tapHaptic("light"); setRunning(false); setTotal(sec); setLeft(sec); };
  const adjust = (delta) => {
    if (running) return;
    const next = Math.max(15, Math.min(3600, total + delta));
    setTotal(next); setLeft(next);
  };
  const toggle = () => {
    tapHaptic("light");
    if (left <= 0) { setLeft(total); setRunning(true); return; }
    setRunning((r) => !r);
  };
  const reset = () => { tapHaptic("light"); setRunning(false); setLeft(total); };

  const pct = total ? (left / total) * 100 : 0;
  const done = left <= 0;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        A hands-on timer for soaker hoses and hand-watering, so beds get an even, measured drink.
      </Text>

      <View style={{ alignItems: "center", marginTop: 14, backgroundColor: "rgba(107,199,255,0.1)", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: "rgba(107,199,255,0.28)" }}>
        <Text style={{ color: done ? "#8effab" : "#6bc7ff", fontSize: 46, fontWeight: "900", fontVariant: ["tabular-nums"] }}>{fmtClock(left)}</Text>
        <View style={{ width: "100%", height: 6, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 8 }}>
          <View style={{ height: 6, borderRadius: 4, width: `${pct}%`, backgroundColor: done ? "#8effab" : "#6bc7ff" }} />
        </View>
        {done ? <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", marginTop: 8 }}>✅ Done watering!</Text> : null}
      </View>

      {/* +/- adjust */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 12 }}>
        <Pressable onPress={() => adjust(-30)} disabled={running} style={{ width: 44, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", opacity: running ? 0.4 : 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>−30s</Text>
        </Pressable>
        <Pressable onPress={toggle} style={{ flex: 1, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: running ? "rgba(255,159,67,0.9)" : "#6bc7ff" }}>
          <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>{running ? "Pause" : left <= 0 ? "Restart" : "Start"}</Text>
        </Pressable>
        <Pressable onPress={reset} style={{ width: 44, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>↺</Text>
        </Pressable>
        <Pressable onPress={() => adjust(30)} disabled={running} style={{ width: 44, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", opacity: running ? 0.4 : 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>+30s</Text>
        </Pressable>
      </View>

      {/* presets */}
      <View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}>
        {PRESETS_SEC.map((s) => (
          <Chip key={s} label={fmtClock(s)} color="#6bc7ff" active={total === s && !running} onPress={() => setPreset(s)} />
        ))}
      </View>
    </View>
  );
}

// ── Potting-mix blender ──────────────────────────────────────────────────────
const MIX_RECIPES = [
  { id: "seed", label: "Seed-starting", parts: { "Coir / peat": 4, Perlite: 1, Vermiculite: 1, Compost: 1 } },
  { id: "general", label: "General potting", parts: { Compost: 2, "Coir / peat": 2, Perlite: 1 } },
  { id: "cactus", label: "Cactus / succulent", parts: { "Potting mix": 2, "Coarse sand": 2, Perlite: 1 } },
  { id: "raised", label: "Raised bed (Mel's mix)", parts: { Compost: 1, "Peat / coir": 1, Vermiculite: 1 } },
];

function PottingMixCalc({ theme, metric }) {
  const [vol, setVol] = useState(metric ? "10" : "5"); // display units (L or gal)
  const [recipeId, setRecipeId] = useState("seed");
  const recipe = MIX_RECIPES.find((r) => r.id === recipeId) || MIX_RECIPES[0];
  const container = parseFloat(vol) || 0;
  const totalParts = Object.values(recipe.parts).reduce((a, b) => a + b, 0);
  const unit = metric ? "L" : "gal";

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Blend your own mix — pick a recipe and container size for the exact amount of each ingredient.
      </Text>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>BATCH SIZE ({unit})</Text>
      {numInput(theme, vol, (t) => setVol(t), metric ? "e.g. 10" : "e.g. 5")}
      <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
        {(metric ? [5, 10, 20, 40] : [1, 2, 5, 10]).map((v) => (
          <Chip key={v} label={`${v} ${unit}`} color="#bf7a12" active={container === v} onPress={() => setVol(String(v))} />
        ))}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>RECIPE</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {MIX_RECIPES.map((r) => (
          <Pressable key={r.id} onPress={() => setRecipeId(r.id)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: recipeId === r.id ? "#8effab" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: recipeId === r.id ? "#8effab" : "rgba(255,255,255,0.1)" }}>
            <Text style={{ color: recipeId === r.id ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{r.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 14, backgroundColor: "rgba(191,122,18,0.12)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(191,122,18,0.3)" }}>
        {container > 0 ? (
          <View style={{ gap: 8 }}>
            {Object.entries(recipe.parts).map(([name, part]) => {
              const amt = (part / totalParts) * container;
              return (
                <View key={name} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ color: theme.text, fontSize: 13, fontWeight: "800" }}>{name}</Text>
                  <Text style={{ color: "#ffd86b", fontSize: 13, fontWeight: "900" }}>{round(amt, 1)} {unit}</Text>
                </View>
              );
            })}
            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 4, fontStyle: "italic" }}>
              Ratio {Object.values(recipe.parts).join(":")} · mix dry, then moisten.
            </Text>
          </View>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>Enter a batch size to see the recipe.</Text>
        )}
      </View>
    </View>
  );
}

export const GardenCalculatorsSection = memo(function GardenCalculatorsSection({ theme, unitSystem }) {
  const metric = unitSystem === "metric";
  const [tab, setTab] = useState("fert");

  const TABS = [
    { id: "fert", label: "🌾 Feed", color: "#8effab" },
    { id: "water", label: "💧 Water", color: "#6bc7ff" },
    { id: "timer", label: "⏱️ Timer", color: "#6bc7ff" },
    { id: "mix", label: "🪴 Mix", color: "#bf7a12" },
  ];

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 14 }}>
        {TABS.map((tb) => (
          <Chip key={tb.id} label={tb.label} color={tb.color} active={tab === tb.id} onPress={() => setTab(tb.id)} />
        ))}
      </View>
      {tab === "fert" ? <FertilizerCalc theme={theme} metric={metric} /> : null}
      {tab === "water" ? <WateringCalc theme={theme} metric={metric} /> : null}
      {tab === "timer" ? <WateringTimer theme={theme} /> : null}
      {tab === "mix" ? <PottingMixCalc theme={theme} metric={metric} /> : null}
    </View>
  );
});
