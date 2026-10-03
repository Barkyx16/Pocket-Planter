import { memo, useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { parseDecimal, successHaptic, tapHaptic } from "../core";
import { formatNumber, t, tn, useLanguage } from "../lib/i18n";

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
// Rounded and written with the language's decimal mark ("1,5" in German).
const num = (n, d = 1) => formatNumber(round(n, d), { maximumFractionDigits: d });
const eg = (n) => t("calc.eg", { n: formatNumber(n) });

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
      onChangeText={(txt) => onChange(txt.replace(/[^0-9.,]/g, ""))}
      keyboardType="decimal-pad"
      placeholder={placeholder}
      placeholderTextColor="#8fbf9d"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontWeight: "800" }}
    />
  );
}

// ── Fertilizer mixing ────────────────────────────────────────────────────────
function FertilizerCalc({ theme, metric }) {
  // Held in whatever unit the field is labelled with — imperial users type
  // gallons. It used to be litres either way, so "2" from an imperial gardener
  // was read as 2 litres and mixed the feed nearly four times too strong.
  const [containerSize, setContainerSize] = useState(String(metric ? 8 : 2));
  const [ratePerGal, setRatePerGal] = useState(1); // tbsp per gallon (label rate)
  const [strength, setStrength] = useState(1);

  const containerVol = parseDecimal(containerSize) || 0; // litres (metric) or gallons
  const gallons = metric ? containerVol / GAL_TO_L : containerVol;
  const tbsp = ratePerGal * gallons * strength;
  const valid = containerVol > 0;

  const containerPresets = metric
    ? [{ v: 4, label: "4 L" }, { v: 8, label: "8 L" }, { v: 10, label: "10 L" }]
    : [{ v: 1, label: "1 gal" }, { v: 2, label: "2 gal" }, { v: 5, label: "5 gal" }];

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        {t("calc.fertIntro")}
      </Text>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{t("calc.containerLabel", { unit: t(metric ? "calc.litres" : "calc.gallons") })}</Text>
      {numInput(theme, containerSize, setContainerSize, eg(metric ? 8 : 2))}
      <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
        {containerPresets.map((p) => (
          <Chip key={p.label} label={p.label} color="#6bc7ff" active={Math.abs(containerVol - p.v) < 0.05} onPress={() => setContainerSize(String(p.v))} />
        ))}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{t("calc.labelRate")}</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[0.5, 1, 1.5, 2].map((r) => (
          <Chip key={r} label={t("calc.rateChip", { n: formatNumber(r) })} active={ratePerGal === r} onPress={() => setRatePerGal(r)} />
        ))}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{t("calc.strength")}</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        <Chip label={t("calc.seedling")} active={strength === 0.25} onPress={() => setStrength(0.25)} color="#ffd86b" />
        <Chip label={t("calc.half")} active={strength === 0.5} onPress={() => setStrength(0.5)} color="#ffd86b" />
        <Chip label={t("calc.full")} active={strength === 1} onPress={() => setStrength(1)} color="#ffd86b" />
      </View>

      {/* RESULT */}
      <View style={{ marginTop: 14, backgroundColor: "rgba(92,255,137,0.1)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)" }}>
        {valid ? (
          <>
            <Text style={{ color: "#8effab", fontSize: 22, fontWeight: "900" }}>
              {t("calc.tbspValue", { n: num(tbsp, 2) })}
            </Text>
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800", marginTop: 2 }}>
              {t("calc.tspMl", { tsp: num(tbsp * TBSP_TO_TSP, 1), ml: num(tbsp * TBSP_TO_ML) })}
            </Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 6 }}>
              {t("calc.stirInto", { volume: metric ? `${num(containerVol)} L` : `${num(gallons, 1)} gal` })}
            </Text>
          </>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>{t("calc.enterContainer")}</Text>
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
    const a = parseDecimal(area) || 0;
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
    const d = parseDecimal(diam) || 0;
    if (metric) {
      const volCm3 = 0.707 * d * d * d; // 0.9 × π/4 ≈ 0.707
      potGal = (volCm3 / 1000) * 0.2 / GAL_TO_L;
    } else {
      const volIn3 = 0.707 * d * d * d;
      potGal = (volIn3 / IN3_PER_GAL) * 0.2;
    }
  }

  const perWaterGal = mode === "bed" ? (timesWeek ? weeklyGal / timesWeek : weeklyGal) : potGal;
  const fmtVol = (gal) => (metric ? `${num(gal * GAL_TO_L, 1)} L` : `${num(gal, 2)} gal`);
  const cans = perWaterGal / CAN_GAL;
  const hoseSec = Math.round((perWaterGal / HOSE_GAL_PER_MIN) * 60);
  const valid = perWaterGal > 0;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        {t("calc.waterIntro")}
      </Text>

      <View style={{ flexDirection: "row", gap: 6, marginTop: 12 }}>
        <Chip label={t("calc.bed")} color="#6bc7ff" active={mode === "bed"} onPress={() => setMode("bed")} />
        <Chip label={t("calc.pot")} color="#6bc7ff" active={mode === "pot"} onPress={() => setMode("pot")} />
      </View>

      {mode === "bed" ? (
        <>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{t("calc.bedArea", { unit: metric ? "m²" : "sq ft" })}</Text>
          {numInput(theme, area, setArea, eg(metric ? 1 : 10))}
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{t("calc.waterPerWeek")}</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {targetOpts.map((o) => (
              <Chip key={o.label} label={o.label} active={inchesWeek === o.v} onPress={() => setInchesWeek(o.v)} />
            ))}
          </View>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{t("calc.wateringsPerWeek")}</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {[1, 2, 3, 7].map((n) => (
              <Chip key={n} label={`${n}×`} active={timesWeek === n} onPress={() => setTimesWeek(n)} />
            ))}
          </View>
        </>
      ) : (
        <>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{t("calc.potDiameter", { unit: metric ? "cm" : t("calc.inches") })}</Text>
          {numInput(theme, diam, setDiam, eg(metric ? 25 : 10))}
        </>
      )}

      {/* RESULT */}
      <View style={{ marginTop: 14, backgroundColor: "rgba(107,199,255,0.1)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.28)" }}>
        {valid ? (
          <>
            <Text style={{ color: "#6bc7ff", fontSize: 22, fontWeight: "900" }}>{fmtVol(perWaterGal)}</Text>
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800", marginTop: 2 }}>
              {t("calc.perWatering")}{mode === "bed" ? ` ${t("calc.perWeek", { volume: fmtVol(weeklyGal) })}` : ""}
            </Text>
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 6 }}>
              {tn("calc.cansHose", round(cans, 1), { count: num(cans, 1), seconds: hoseSec })}
            </Text>
          </>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>{t("calc.enterSize")}</Text>
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
          try { successHaptic(); } catch { /* ignore */ }
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
        {t("calc.timerIntro")}
      </Text>

      <View style={{ alignItems: "center", marginTop: 14, backgroundColor: "rgba(107,199,255,0.1)", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: "rgba(107,199,255,0.28)" }}>
        <Text style={{ color: done ? "#8effab" : "#6bc7ff", fontSize: 46, fontWeight: "900", fontVariant: ["tabular-nums"] }}>{fmtClock(left)}</Text>
        <View style={{ width: "100%", height: 6, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 8 }}>
          <View style={{ height: 6, borderRadius: 4, width: `${pct}%`, backgroundColor: done ? "#8effab" : "#6bc7ff" }} />
        </View>
        {done ? <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", marginTop: 8 }}>{t("calc.doneWatering")}</Text> : null}
      </View>

      {/* +/- adjust */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 12 }}>
        <Pressable accessibilityRole="button" onPress={() => adjust(-30)} accessibilityLabel={t("a11y.minus30")} disabled={running} style={{ width: 44, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", opacity: running ? 0.4 : 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>−30s</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={toggle} style={{ flex: 1, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: running ? "rgba(255,159,67,0.9)" : "#6bc7ff" }}>
          <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>{running ? t("calc.pause") : left <= 0 ? t("calc.restart") : t("calc.start")}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.resetTimer")} onPress={reset} style={{ width: 44, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>↺</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => adjust(30)} accessibilityLabel={t("a11y.plus30")} disabled={running} style={{ width: 44, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", opacity: running ? 0.4 : 1 }}>
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
  // label and the ingredient names are keys in the calc namespace.
  { id: "seed", label: "recipeSeed", parts: { coirPeat: 4, perlite: 1, vermiculite: 1, compost: 1 } },
  { id: "general", label: "recipeGeneral", parts: { compost: 2, coirPeat: 2, perlite: 1 } },
  { id: "cactus", label: "recipeCactus", parts: { pottingMix: 2, coarseSand: 2, perlite: 1 } },
  { id: "raised", label: "recipeRaised", parts: { compost: 1, coirPeat: 1, vermiculite: 1 } },
];

function PottingMixCalc({ theme, metric }) {
  const [vol, setVol] = useState(metric ? "10" : "5"); // display units (L or gal)
  const [recipeId, setRecipeId] = useState("seed");
  const recipe = MIX_RECIPES.find((r) => r.id === recipeId) || MIX_RECIPES[0];
  const container = parseDecimal(vol) || 0;
  const totalParts = Object.values(recipe.parts).reduce((a, b) => a + b, 0);
  const unit = metric ? "L" : "gal";

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        {t("calc.mixIntro")}
      </Text>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{t("calc.batchSize", { unit })}</Text>
      {numInput(theme, vol, setVol, eg(metric ? 10 : 5))}
      <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
        {(metric ? [5, 10, 20, 40] : [1, 2, 5, 10]).map((v) => (
          <Chip key={v} label={`${v} ${unit}`} color="#bf7a12" active={container === v} onPress={() => setVol(String(v))} />
        ))}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{t("calc.recipe")}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {MIX_RECIPES.map((r) => (
          <Pressable accessibilityRole="button" key={r.id} onPress={() => setRecipeId(r.id)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: recipeId === r.id ? "#8effab" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: recipeId === r.id ? "#8effab" : "rgba(255,255,255,0.1)" }}>
            <Text style={{ color: recipeId === r.id ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{t(`calc.${r.label}`)}</Text>
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
                  <Text style={{ color: theme.text, fontSize: 13, fontWeight: "800" }}>{t(`calc.${name}`)}</Text>
                  <Text style={{ color: "#ffd86b", fontSize: 13, fontWeight: "900" }}>{num(amt, 1)} {unit}</Text>
                </View>
              );
            })}
            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 4, fontStyle: "italic" }}>
              {t("calc.ratio", { ratio: Object.values(recipe.parts).join(":") })}
            </Text>
          </View>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700" }}>{t("calc.enterBatch")}</Text>
        )}
      </View>
    </View>
  );
}

export const GardenCalculatorsSection = memo(function GardenCalculatorsSection({ theme, unitSystem }) {
  useLanguage(); // memo() skips a language switch without this (see lib/i18n)
  const metric = unitSystem === "metric";
  const unitKey = metric ? "metric" : "imperial";
  const [tab, setTab] = useState("fert");

  const TABS = [
    { id: "fert", label: t("calc.tabFeed"), color: "#8effab" },
    { id: "water", label: t("calc.tabWater"), color: "#6bc7ff" },
    { id: "timer", label: t("calc.tabTimer"), color: "#6bc7ff" },
    { id: "mix", label: t("calc.tabMix"), color: "#bf7a12" },
  ];

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 14 }}>
        {TABS.map((tb) => (
          <Chip key={tb.id} label={tb.label} color={tb.color} active={tab === tb.id} onPress={() => setTab(tb.id)} />
        ))}
      </View>
      {/* Every input below is seeded from `metric` and held in that unit. Keying on
          it remounts the calculator when the user changes units in Settings —
          otherwise a bed area typed as 10 sq ft stayed "10" under an m² label, and
          the weekly target stayed 25 (mm) while being applied as inches. */}
      {tab === "fert" ? <FertilizerCalc key={unitKey} theme={theme} metric={metric} /> : null}
      {tab === "water" ? <WateringCalc key={unitKey} theme={theme} metric={metric} /> : null}
      {tab === "timer" ? <WateringTimer theme={theme} /> : null}
      {tab === "mix" ? <PottingMixCalc key={unitKey} theme={theme} metric={metric} /> : null}
    </View>
  );
});
