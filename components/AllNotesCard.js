import { memo } from "react";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";
import { IconText } from "./IconText";

export const AllNotesCard = memo(function AllNotesCard({ theme, plantNotes, onOpenPlant }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const notes = Object.entries(plantNotes || {})
    .filter(([, text]) => String(text || "").trim().length > 0)
    .map(([name, text]) => ({ name, text: text.trim() }));

  if (!notes.length) return null;

  const q = query.toLowerCase().trim();
  const filtered = q
    ? notes.filter((n) => n.name.toLowerCase().includes(q) || n.text.toLowerCase().includes(q))
    : notes;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "rgba(142, 255, 171, 0.3)" }]}>
      <IconText label={t("allNotes.myGardenNotes")} style={styles.cardEyebrow} />
      <Text style={[styles.cardTitle, { color: theme.text }]}>{t("allNotes.allYourPlantNotes")}</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        {t("allNotes.everythingYouveWrittenAcrossYour")}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(142, 255, 171, 0.16)", paddingHorizontal: 14, marginTop: 16, gap: 10 }}>
        <Text style={{ fontSize: 16 }}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("allNotes.searchYourNotes")}
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, color: "#ffffff", fontSize: 14, fontWeight: "700", paddingVertical: 12 }}
        />
        {query ? (
          <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.clearSearch")} onPress={() => setQuery("")}>
            <Text style={{ color: "#8effab", fontSize: 16, fontWeight: "900" }}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {filtered.length === 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 16, textAlign: "center", lineHeight: 20 }}>
          {t("allNotes.noNotesMatch")}{query}{t("allNotes.tryADifferentWord")}
        </Text>
      ) : (
        <View style={{ gap: 10, marginTop: 16 }}>
          {filtered.map((n) => {
            const plant = produceData.find((p) => p.name === n.name);
            const img = plant ? resolvePlantImageSource(plant) : null;
            return (
              <Pressable
                key={`note-${n.name}`}
                onPress={() => plant && onOpenPlant(plant)}
                style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(142, 255, 171, 0.16)" }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 26, height: 26 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>🌱</Text>}
                  </View>
                  <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "900", flex: 1 }}>{n.name}</Text>
                  {plant ? <Text style={{ color: "#8effab", fontSize: 18, fontWeight: "900" }}>›</Text> : null}
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19 }} numberOfLines={4}>
                  {n.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
})
