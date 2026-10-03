import { memo, useState } from "react";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import produceData from "../data/produceData";
import { localPlantMonths, normalizeType, tapHaptic, typeLabel } from "../core";
import { formatDate, t, tn, useLanguage } from "../lib/i18n";
import { NativeModuleGuard } from "./NativeModuleGuard";

// Short month name in the app language, e.g. "Mar" or "mars".
const monthShort = (m) => formatDate(new Date(2026, m - 1, 1), { month: "short" });

// Compresses a sorted month list into ranges, e.g. [3,4,5,6] → "Mar–Jun".
function monthRanges(months) {
  if (!months || !months.length) return "";
  const sorted = [...new Set(months)].sort((a, b) => a - b);
  const parts = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const m = sorted[i];
    if (m === prev + 1) { prev = m; continue; }
    parts.push(start === prev ? monthShort(start) : `${monthShort(start)}–${monthShort(prev)}`);
    start = m; prev = m;
  }
  return parts.join(", ");
}

function firstSentence(text) {
  if (!text) return "";
  // Avoid regex lookbehind — it isn't supported by Hermes (RN's JS engine).
  const str = String(text);
  const m = str.match(/[.!?]/);
  const s = m ? str.slice(0, m.index + 1) : str;
  return s.length > 90 ? s.slice(0, 87) + "…" : s;
}

export const PlantLabelsSection = memo(function PlantLabelsSection({ theme, savedPlants, zone }) {
  useLanguage(); // memo() skips a language switch without this (see lib/i18n)
  const names = Array.from(new Set(savedPlants || []));
  const [qrPlant, setQrPlant] = useState(null);

  const buildLabels = () => {
    const blocks = names.map((name) => {
      const item = produceData.find((p) => p.name === name);
      const type = item ? typeLabel(normalizeType(item.type, item.name)) : "";
      const months = item ? monthRanges(localPlantMonths(item)) : "";
      const zones = item && item.minZone ? t("tools.labelsZones", { min: item.minZone, max: item.maxZone }) : "";
      const tip = item ? firstSentence(item.notes) : "";
      const line2 = [type, zones].filter(Boolean).join(" · ");
      return [
        "✂ - - - - - - - - - - - - - - - -",
        `🌱 ${name.toUpperCase()}`,
        line2,
        months ? t("tools.labelsPlant", { months }) : "",
        tip ? t("tools.labelsTip", { tip }) : "",
      ].filter(Boolean).join("\n");
    });
    return [
      zone ? t("tools.labelsShareHeaderZone", { zone }) : t("tools.labelsShareHeader"),
      t("tools.labelsShareHow"),
      "",
      ...blocks,
      "✂ - - - - - - - - - - - - - - - -",
    ].join("\n");
  };

  const share = async () => {
    if (!names.length) return;
    try { tapHaptic("light"); await Share.share({ message: buildLabels() }); } catch (e) { /* cancelled */ }
  };

  return (
    <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        {t("tools.labelsTitle")}
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        {t("tools.labelsIntro")}
      </Text>

      {names.length ? (
        <>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 10 }}>
            {tn("tools.labelsReady", names.length)}
          </Text>
          <Pressable onPress={share} style={{ marginTop: 10, backgroundColor: "#ffd86b", borderRadius: 12, paddingVertical: 13, alignItems: "center" }}>
            <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>{t("tools.labelsExport")}</Text>
          </Pressable>

          {/* QR stakes — scannable tag per plant */}
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 16, marginBottom: 6 }}>
            {t("tools.labelsQr")}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 2 }}>
            {names.map((n) => {
              const active = qrPlant === n;
              return (
                <Pressable key={n} onPress={() => { tapHaptic("light"); setQrPlant(active ? null : n); }} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: active ? "#ffd86b" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#ffd86b" : "rgba(255,255,255,0.12)" }}>
                  <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{n}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {qrPlant ? (
            <View style={{ alignItems: "center", marginTop: 12 }}>
              <NativeModuleGuard
                fallback={
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", textAlign: "center", lineHeight: 18, paddingVertical: 12 }}>
                    {t("tools.labelsQrNeedsBuild")}
                  </Text>
                }
              >
                <View style={{ backgroundColor: "#ffffff", borderRadius: 14, padding: 14, alignItems: "center" }}>
                  <QRCode value={`pocketplanter://plant/${encodeURIComponent(qrPlant)}`} size={150} backgroundColor="#ffffff" color="#07120b" />
                  <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900", marginTop: 10 }}>🌱 {qrPlant}</Text>
                </View>
              </NativeModuleGuard>
              <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 8, fontStyle: "italic", textAlign: "center" }}>
                {t("tools.labelsQrHint")}
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", fontStyle: "italic", marginTop: 10 }}>
          {t("tools.labelsEmpty")}
        </Text>
      )}
    </View>
  );
});
