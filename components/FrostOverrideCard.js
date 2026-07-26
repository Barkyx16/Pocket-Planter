import { memo } from "react";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { getFirstFrostDate, getLastFrostDate } from "../core";
import { IconText } from "./IconText";
import { formatDate, useTranslation } from "../lib/i18n";

export const FrostOverrideCard = memo(function FrostOverrideCard({ theme, zone, frostOverrides, onSave, onHide }) {
  const { t } = useTranslation();
  const [lastFrost, setLastFrost] = useState(frostOverrides?.lastFrost || "");
  const [firstFrost, setFirstFrost] = useState(frostOverrides?.firstFrost || "");
  const [editing, setEditing] = useState(false);

  const SPRING = "#6bc7ff"; // last spring frost
  const FALL = "#ff9f43";   // first fall frost
  const GROW = "#5cff89";   // frost-free growing season

  // Zone estimates, used as placeholders and the default timeline.
  const estLast = getLastFrostDate(zone);
  const estFirst = getFirstFrostDate(zone);
  const fmt = (d) => (d ? formatDate(d, {
  month: "short",
  day: "numeric"
}) : "—");
  const valid = (v) => v === "" || /^\d{1,2}-\d{1,2}$/.test(v);
  const bothValid = valid(lastFrost) && valid(firstFrost);

  // Turn a typed MM-DD into a Date this year, if it's a real date.
  const parseMMDD = (v) => {
    const m = /^(\d{1,2})-(\d{1,2})$/.exec((v || "").trim());
    if (!m) return null;
    const mo = parseInt(m[1], 10), day = parseInt(m[2], 10);
    if (mo < 1 || mo > 12 || day < 1 || day > 31) return null;
    return new Date(new Date().getFullYear(), mo - 1, day);
  };

  // Live-preview the timeline from whatever's typed, falling back to zone estimates.
  const effLast = parseMMDD(lastFrost) || estLast;
  const effFirst = parseMMDD(firstFrost) || estFirst;
  const msDay = 86400000;
  let frostFreeDays = Math.round((effFirst - effLast) / msDay);
  if (frostFreeDays < 0) frostFreeDays += 365;
  const months = Math.round((frostFreeDays / 30) * 10) / 10;

  const isCustom = !!(frostOverrides?.lastFrost || frostOverrides?.firstFrost);

  function handleSave() {
    if (!bothValid) return;
    const next = {};
    if (lastFrost.trim()) next.lastFrost = lastFrost.trim();
    if (firstFrost.trim()) next.firstFrost = firstFrost.trim();
    onSave(next);
    setEditing(false);
  }
  function handleClear() {
    setLastFrost("");
    setFirstFrost("");
    onSave({});
    setEditing(false);
  }

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    color: theme.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  };

  return (
    <View>
      {/* ── HERO: frost-free growing window ── */}
      <View style={{
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: "center",
        backgroundColor: "rgba(92, 255, 137, 0.08)",
        borderWidth: 1,
        borderColor: "rgba(92, 255, 137, 0.3)",
        marginTop: 4,
      }}>
        <IconText label={"❄️  🌱  ❄️"} style={{
  fontSize: 24,
  marginBottom: 2
}} />
        <Text style={{ color: GROW, fontSize: 40, fontWeight: "900", marginTop: 6, letterSpacing: -1 }}>{frostFreeDays}</Text>
        <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", marginTop: -2 }}>{t("frostOverride.frostfreeGrowingDays")}</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4, textAlign: "center" }}>
          {t("frostOverride.thatsAbout")}{months} month{months === 1 ? "" : "s"} {t("frostOverride.ofPrimePlantingInZone")} {zone || "—"}
        </Text>
        <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: isCustom ? "rgba(92, 255, 137, 0.16)" : "rgba(255, 255, 255, 0.06)", borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: isCustom ? "rgba(92, 255, 137, 0.4)" : "rgba(255, 255, 255, 0.12)" }}>
          <Text style={{ color: isCustom ? GROW : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>
            {isCustom ? t("frostOverride.usingYourCustomDates") : t("frostOverride.estimatedFromYourZone")}
          </Text>
        </View>
      </View>

      {/* ── SEASON TIMELINE ── */}
      <View style={{ flexDirection: "row", alignItems: "stretch", marginTop: 16, gap: 8 }}>
        <View style={{ flex: 1, backgroundColor: "rgba(107, 199, 255, 0.1)", borderRadius: 16, borderWidth: 1, borderColor: SPRING + "44", padding: 12 }}>
          <Text style={{ fontSize: 18 }}>🌸</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "900", letterSpacing: 0.5, marginTop: 6 }}>{t("frostOverride.lastSpringFrost")}</Text>
          <Text style={{ color: SPRING, fontSize: 18, fontWeight: "900", marginTop: 2 }}>{fmt(effLast)}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 2 }}>{t("frostOverride.safeToPlantOut")}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "rgba(255, 159, 67, 0.1)", borderRadius: 16, borderWidth: 1, borderColor: FALL + "44", padding: 12 }}>
          <Text style={{ fontSize: 18 }}>🍂</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "900", letterSpacing: 0.5, marginTop: 6 }}>{t("frostOverride.firstFallFrost")}</Text>
          <Text style={{ color: FALL, fontSize: 18, fontWeight: "900", marginTop: 2 }}>{fmt(effFirst)}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 2 }}>{t("frostOverride.harvestByThen")}</Text>
        </View>
      </View>

      {/* growing-season bar */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, gap: 8 }}>
        <View style={{ width: 10, height: 10, borderRadius: 4, backgroundColor: SPRING }} />
        <View style={{ flex: 1, height: 6, borderRadius: 4, backgroundColor: GROW, opacity: 0.85 }} />
        <View style={{ width: 10, height: 10, borderRadius: 4, backgroundColor: FALL }} />
      </View>
      <IconText label={t("frostOverride.yourGrowingSeason")} style={{
  color: GROW,
  fontSize: 12,
  fontWeight: "800",
  textAlign: "center",
  marginTop: 6
}} />

      {/* ── CUSTOMIZE ── */}
      {!editing ? (
        <Pressable
          onPress={() => setEditing(true)}
          style={{ marginTop: 18, backgroundColor: "rgba(107, 199, 255, 0.12)", borderRadius: 999, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.3)" }}
        >
          <Text style={{ color: SPRING, fontSize: 14, fontWeight: "900" }}>
            {isCustom ? t("frostOverride.editMyFrostDates") : t("frostOverride.dialInMyRealLocal")}
          </Text>
        </Pressable>
      ) : (
        <View style={{ marginTop: 18 }}>
          <Text style={[styles.cardText, { color: theme.secondaryText, marginBottom: 4 }]}>
            {t("frostOverride.knowYourRealLocalFrost")}
          </Text>

          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 14, marginBottom: 6 }}>{t("frostOverride.lastSpringFrostMmdd")}</Text>
          <TextInput
            value={lastFrost}
            onChangeText={setLastFrost}
            placeholder={t("frostOverride.eg0315")}
            placeholderTextColor={theme.secondaryText}
            style={[inputStyle, !valid(lastFrost) && { borderColor: "#ff7b7b" }]}
            autoCapitalize="none"
          />

          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 14, marginBottom: 6 }}>{t("frostOverride.firstFallFrostMmdd")}</Text>
          <TextInput
            value={firstFrost}
            onChangeText={setFirstFrost}
            placeholder={t("frostOverride.eg1115")}
            placeholderTextColor={theme.secondaryText}
            style={[inputStyle, !valid(firstFrost) && { borderColor: "#ff7b7b" }]}
            autoCapitalize="none"
          />

          {!bothValid && (
            <Text style={{ color: "#ff7b7b", fontSize: 12, fontWeight: "700", marginTop: 8 }}>
              {t("frostOverride.useMmddFormatLike0315")}
            </Text>
          )}

          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <Pressable
              onPress={handleSave}
              disabled={!bothValid}
              style={{ flex: 1, backgroundColor: bothValid ? "rgba(107, 199, 255, 0.2)" : "rgba(255, 255, 255, 0.06)", borderRadius: 999, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: bothValid ? "rgba(107, 199, 255, 0.4)" : "rgba(255, 255, 255, 0.12)" }}
            >
              <Text style={{ color: bothValid ? SPRING : theme.secondaryText, fontSize: 14, fontWeight: "900" }}>{t("frostOverride.saveFrostDates")}</Text>
            </Pressable>
            <Pressable
              onPress={handleClear}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 999, paddingVertical: 12, paddingHorizontal: 18, alignItems: "center", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.12)" }}
            >
              <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>Reset</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Pressable onPress={onHide} style={{ marginTop: 12, alignItems: "center", paddingVertical: 10 }}>
        <IconText label={t("frostOverride.noFrostInMyArea")} style={{
  color: theme.secondaryText,
  fontSize: 12,
  fontWeight: "800"
}} />
      </Pressable>
    </View>
  );
})
