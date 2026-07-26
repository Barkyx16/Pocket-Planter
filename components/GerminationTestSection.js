import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import { getTodayKey, tapHaptic } from "../core";
import { formatDate } from "../lib/i18n";
import { SkeletonSection } from "./Skeleton";

export const GERM_STORAGE_KEY = "pp_germTests";

// A germination (paper-towel) test: sow N seeds, count how many sprout, and the
// viability % tells you whether the packet is still good and how many extra to
// sow to hit your target.
function viabilityMeta(pct) {
  if (pct >= 85) return { color: "#8effab", label: "Great", tip: "Sow as normal — these seeds are strong." };
  if (pct >= 60) return { color: "#ffd86b", label: "OK", tip: "Still usable — sow a few extra to be safe." };
  if (pct >= 30) return { color: "#ff9f43", label: "Low", tip: "Sow well over your target, or buy fresh seed." };
  return { color: "#ff7b7b", label: "Poor", tip: "Time to replace this packet." };
}

export const GerminationTestSection = memo(function GerminationTestSection({ theme }) {
  const [tests, setTests] = useState([]); // { id, seedName, sown, sprouted, date }
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [sown, setSown] = useState(10);
  const [sprouted, setSprouted] = useState("");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(GERM_STORAGE_KEY)
      .then((val) => {
        if (alive && val) { try { setTests(JSON.parse(val) || []); } catch (e) { /* ignore */ } }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => {
    setTests(next);
    AsyncStorage.setItem(GERM_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const sproutedNum = Math.min(Number(sprouted) || 0, sown);
  const previewPct = sown ? Math.round((sproutedNum / sown) * 100) : 0;

  const save = () => {
    if (!name.trim() || !sprouted) return;
    tapHaptic("light");
    persist([
      { id: Date.now().toString(), seedName: name.trim(), sown, sprouted: sproutedNum, date: getTodayKey() },
      ...tests,
    ]);
    setName("");
    setSprouted("");
    setSown(10);
  };

  const remove = (id) => { tapHaptic("light"); persist(tests.filter((t) => t.id !== id)); };

  if (!loaded) {
    return (
      <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
        <SkeletonSection lines={2} />
      </View>
    );
  }

  const preview = viabilityMeta(previewPct);
  // Seeds to sow for ~10 plants at the previewed viability.
  const forTen = previewPct > 0 ? Math.ceil(10 / (previewPct / 100)) : null;

  return (
    <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        🌱 SEED VIABILITY TEST
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Sprout a few seeds on a damp paper towel, then log how many came up.
      </Text>

      {/* Seed name */}
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Seed (e.g. 2022 Tomato packet)"
        placeholderTextColor="#8fbf9d"
        style={{ marginTop: 12, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "700" }}
      />

      {/* Seeds sown */}
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>SEEDS SOWN</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[5, 10, 20].map((n) => {
          const active = sown === n;
          return (
            <Pressable key={n} onPress={() => setSown(n)} style={{ flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 10, backgroundColor: active ? "#5cff89" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{n}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Sprouted */}
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>HOW MANY SPROUTED?</Text>
      <TextInput
        value={sprouted}
        onChangeText={(txt) => setSprouted(txt.replace(/[^0-9]/g, ""))}
        keyboardType="number-pad"
        placeholder={`0–${sown}`}
        placeholderTextColor="#8fbf9d"
        style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontWeight: "800" }}
      />

      {/* Live preview */}
      {sprouted ? (
        <View style={{ marginTop: 12, backgroundColor: `${preview.color}18`, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: `${preview.color}40` }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: preview.color, fontSize: 22, fontWeight: "900" }}>{previewPct}%</Text>
            <Text style={{ color: preview.color, fontSize: 12, fontWeight: "900" }}>{preview.label} viability</Text>
          </View>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 4 }}>
            {preview.tip}{forTen ? ` For ~10 plants, sow about ${forTen} seeds.` : ""}
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={save}
        disabled={!name.trim() || !sprouted}
        style={{ marginTop: 10, backgroundColor: name.trim() && sprouted ? "#5cff89" : "rgba(255,255,255,0.08)", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
      >
        <Text style={{ color: name.trim() && sprouted ? "#07120b" : "#8fbf9d", fontSize: 14, fontWeight: "900" }}>Save test</Text>
      </Pressable>

      {/* History */}
      {tests.length ? (
        <View style={{ gap: 6, marginTop: 12 }}>
          {tests.map((tst) => {
            const pct = tst.sown ? Math.round((tst.sprouted / tst.sown) * 100) : 0;
            const m = viabilityMeta(pct);
            return (
              <View key={tst.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 10, paddingVertical: 9, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}>
                <View style={{ width: 42, alignItems: "center" }}>
                  <Text style={{ color: m.color, fontSize: 15, fontWeight: "900" }}>{pct}%</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ color: theme.text, fontSize: 13, fontWeight: "800" }}>{tst.seedName}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 1 }}>
                    {tst.sprouted}/{tst.sown} · {formatDate(new Date(tst.date + "T12:00:00"), { month: "short", day: "numeric", year: "numeric" })}
                  </Text>
                </View>
                <Pressable onPress={() => remove(tst.id)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Delete test">
                  <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "900" }}>✕</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
});
