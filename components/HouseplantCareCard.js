import { memo, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { normalizeType, resolvePlantImageSource, tapHaptic } from "../core";
import { AIR_PURIFYING, HOUSEPLANT_CARE, HOUSEPLANT_CARE_DEFAULT, HOUSEPLANT_PESTS } from "../data/flowerHomeData";
import { useTranslation } from "../lib/i18n";

// Care values come from HOUSEPLANT_CARE (data/flowerHomeData), the table the care
// log also reads; this card used to keep its own 31-plant copy, so Rubber Plant,
// Peace Lily and forty others fell back to the generic default here while the log
// had real numbers for them. Notes translate under houseplantCareText.note_<name>,
// with the English note as the fallback.
// light: 1 low-light tolerant · 2 bright indirect · 3 bright/direct
// [light, waterDays, humidity, repotYears, note]
// i18n-ignore — builds a key, not text.
const noteKey = (name) =>
  "houseplantCareText.note_" +
  String(name).replace(/\s*\([^)]*\)/g, "").replace(/['’]/g, "").trim().split(/[^A-Za-z0-9]+/)
    .map((w, i) => (i ? w.charAt(0).toUpperCase() + w.slice(1) : w.toLowerCase())).join("");
export { noteKey };
// Air plants, bromeliads, staghorn ferns and lucky bamboo are never repotted.
const NEVER_REPOT = 99;
const CATALOG_NAMES = new Set(produceData.map((p) => p.name));

const LIGHT_LABEL = { 1: "houseplantCareText.lightLow", 2: "houseplantCareText.lightBrightIndirect", 3: "houseplantCareText.lightBrightDirect" };
const LEVELS = [
  { v: 1, label: "houseplantCareText.levelLow", thrives: "houseplantCareText.thrivesLow" },
  { v: 2, label: "houseplantCareText.levelMedium", thrives: "houseplantCareText.thrivesMedium" },
  { v: 3, label: "houseplantCareText.levelBright", thrives: "houseplantCareText.thrivesBright" },
];
// Humidity values in HOUSEPLANT_CARE are data; these are their display labels.
const HUMIDITY_LABEL = { Low: "houseplantCareText.humLow", Average: "houseplantCareText.humAverage", High: "houseplantCareText.humHigh" };
// HOUSEPLANT_PESTS (data/flowerHomeData) is English; translate by pest name at render.
const PEST_KEYS = { "Spider mites": "spiderMites", Mealybugs: "mealybugs", "Fungus gnats": "fungusGnats", Scale: "scale", Aphids: "aphids" };

export const HouseplantCareCard = memo(function HouseplantCareCard({ theme, savedPlants, onOpenPlant }) {
  const { t, tn } = useTranslation();
  // Translate a key, falling back to the English data when no entry exists.
  const tOr = (key, fallback) => { const v = t(key); return v === key ? fallback : v; };
  const houseplants = useMemo(() => {
    return (savedPlants || [])
      .map((name) => produceData.find((p) => p.name === name))
      .filter((p) => p && normalizeType(p.type, p.name) === "Houseplants");
  }, [savedPlants]);

  const [room, setRoom] = useState(2);
  const [showPests, setShowPests] = useState(false);
  const care = (name) => HOUSEPLANT_CARE[name] || HOUSEPLANT_CARE_DEFAULT;

  // Catalog suggestions for the chosen room light (plants that thrive at ≤ room level).
  const suggestions = useMemo(() => {
    const owned = new Set(houseplants.map((h) => h.name));
    return Object.entries(HOUSEPLANT_CARE)
      .filter(([name, c]) => c[0] <= room && !owned.has(name) && CATALOG_NAMES.has(name))
      .slice(0, 6)
      .map(([name]) => name);
  }, [room, houseplants]);

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("houseplantCareText.intro")}
      </Text>

      {/* Light matcher */}
      <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginTop: 14, marginBottom: 8 }}>💡 {t("houseplantCareText.matchRoomLight")}</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {LEVELS.map((l) => {
          const active = room === l.v;
          return (
            <Pressable key={l.v} onPress={() => { tapHaptic("light"); setRoom(l.v); }} style={{ flex: 1, alignItems: "center", paddingVertical: 9, borderRadius: 10, backgroundColor: active ? "#8effab" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#8effab" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{t(l.label)}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 8 }}>
        {t(LEVELS.find((l) => l.v === room).thrives)} <Text style={{ color: "#8effab", fontWeight: "900" }}>{suggestions.join(", ") || "—"}</Text>
      </Text>

      {/* Owned houseplant care */}
      {houseplants.length ? (
        <View style={{ gap: 8, marginTop: 16 }}>
          {houseplants.map((item) => {
            const [light, waterDays, humidity, repot, note] = care(item.name);
            const img = resolvePlantImageSource(item);
            return (
              <Pressable key={item.name} onPress={() => onOpenPlant && onOpenPlant(item)} style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 18 }}>🪴</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{item.name}</Text>
                      {AIR_PURIFYING.has(item.name) ? <Text style={{ color: "#8effab", fontSize: 9, fontWeight: "900" }}>🌿 {t("houseplantCareText.air")}</Text> : null}
                    </View>
                    <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 2 }}>
                      💡 {t(LIGHT_LABEL[light])} · 💧 {t("houseplantCareText.waterEvery", { days: waterDays })} · 💦 {HUMIDITY_LABEL[humidity] ? t(HUMIDITY_LABEL[humidity]) : humidity}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 16, marginTop: 8 }}>{HOUSEPLANT_CARE[item.name] ? tOr(noteKey(item.name), note) : t("houseplantCareText.note_default")} {repot >= NEVER_REPOT ? t("houseplantCareText.noRepot") : tn("houseplantCareText.repotEvery", repot)}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", fontStyle: "italic", marginTop: 16 }}>
          {t("houseplantCareText.empty")}
        </Text>
      )}

      {/* Common houseplant pests — quick reference */}
      <Pressable onPress={() => setShowPests((v) => !v)} style={{ marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 8 }}>
        <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "900" }}>{showPests ? "▾" : "▸"} 🫧 {t("houseplantCareText.commonPests")}</Text>
      </Pressable>
      {showPests ? (
        <View style={{ gap: 6 }}>
          {HOUSEPLANT_PESTS.map((p) => (
            <View key={p.name} style={{ backgroundColor: "rgba(255,159,67,0.08)", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "rgba(255,159,67,0.24)" }}>
              <Text style={{ color: theme.text, fontSize: 12, fontWeight: "900" }}>{p.icon} {tOr(`houseplantCareText.pest_${PEST_KEYS[p.name]}_name`, p.name)}</Text>
              <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", lineHeight: 15, marginTop: 2 }}>{tOr(`houseplantCareText.pest_${PEST_KEYS[p.name]}_sign`, p.sign)}</Text>
              <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "800", lineHeight: 15, marginTop: 2 }}>{t("houseplantCareText.fix", { fix: tOr(`houseplantCareText.pest_${PEST_KEYS[p.name]}_fix`, p.fix) })}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
});
