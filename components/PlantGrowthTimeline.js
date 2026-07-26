import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { PremiumLockedSection } from "./PremiumLockedSection";
import { IconText } from "./IconText";
import { formatDate, useTranslation } from "../lib/i18n";

export const PlantGrowthTimeline = memo(function PlantGrowthTimeline({ theme, plant, journalEntries, premiumUnlocked, onAddPhoto, onUnlock }) {
  const { t } = useTranslation();
  const STAGE_COLORS = {
    "Seedling": "#8effab",
    "Leaf Growth": "#5cff89",
    "Flowering": "#ffd86b",
    "Fruit Forming": "#ff9f43",
    "Harvest Ready": "#ff7b7b",
  };
  const stageColor = (s) => STAGE_COLORS[s] || "#5cff89";

  const entries = (journalEntries || [])
    .filter((e) => e.plantName === plant.name && e.imageUri)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const dayNumber = (entry) => {
    if (!entries.length) return 1;
    const base = new Date(entries[0].createdAt);
    const then = new Date(entry.createdAt);
    const diff = Math.floor((then - base) / (1000 * 60 * 60 * 24));
    return Number.isNaN(diff) ? 1 : diff + 1;
  };

  const first = entries[0];
  const latest = entries[entries.length - 1];
  const hasBeforeAfter = entries.length >= 2;

  return (
    <View style={styles.card}>
      <IconText label={t("plantGrowthTimeline.growthTimeline")} style={styles.cardEyebrow} />
      <Text style={styles.cardTitle}>{plant.name}{t("plantGrowthTimeline.sProgress")}</Text>

      {!premiumUnlocked ? (
        <PremiumLockedSection
          icon="📸"
          title={t("plantGrowthTimeline.growthTimeline2")}
          description={t("plantGrowthTimeline.watchYourPlantGrowFrom")}
          onUnlock={onUnlock}
        />
      ) : entries.length === 0 ? (
        <>
          <Text style={styles.cardText}>
          </Text>
          <Pressable
            onPress={onAddPhoto}
            style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}
          >
            <IconText label={t("plantGrowthTimeline.addFirstPhoto")} style={{
  color: "#07120b",
  fontWeight: "900",
  fontSize: 14
}} />
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.cardText}>
            {entries.length} photo{entries.length === 1 ? "" : "s"} tracking {plant.name}{t("plantGrowthTimeline.sGrowth")}
          </Text>

          {/* BEFORE & AFTER */}
          {hasBeforeAfter ? (
            <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
              {[{ label: "First", e: first }, { label: "Latest", e: latest }].map(({ label, e }) => (
                <View key={label} style={{ flex: 1 }}>
                  <View style={{ borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: `${stageColor(e.growthStage)}55` }}>
                    <Image source={{ uri: e.imageUri }} style={{ width: "100%", height: 150 }} resizeMode="cover" />
                    <View style={{ position: "absolute", top: 8, left: 8, backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ color: "#ffffff", fontSize: 10, fontWeight: "900" }}>{label}</Text>
                    </View>
                  </View>
                  <Text style={{ color: stageColor(e.growthStage), fontSize: 12, fontWeight: "900", marginTop: 6 }}>
                    {e.growthStage || "Seedling"}
                  </Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 2 }}>
                    Day {dayNumber(e)} · {formatDate(new Date(e.createdAt), {
  month: "short",
  day: "numeric"
})}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* FULL VERTICAL PROGRESSION */}
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginTop: 20, marginBottom: 10, textTransform: "uppercase" }}>
            {t("plantGrowthTimeline.fullProgression")}
          </Text>
          <View style={{ gap: 14 }}>
            {entries.map((e, i) => (
              <View key={e.id} style={{ flexDirection: "row", gap: 12 }}>
                {/* timeline rail */}
                <View style={{ alignItems: "center", width: 16 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: stageColor(e.growthStage) }} />
                  {i < entries.length - 1 ? (
                    <View style={{ flex: 1, width: 2, backgroundColor: "rgba(92, 255, 137, 0.2)", marginTop: 2 }} />
                  ) : null}
                </View>
                {/* photo + meta */}
                <View style={{ flex: 1, borderRadius: 16, overflow: "hidden", backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
                  <Image source={{ uri: e.imageUri }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
                  <View style={{ padding: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ backgroundColor: `${stageColor(e.growthStage)}22`, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: `${stageColor(e.growthStage)}55` }}>
                        <Text style={{ color: stageColor(e.growthStage), fontSize: 10, fontWeight: "900" }}>{e.growthStage || "Seedling"}</Text>
                      </View>
                      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800" }}>
                        Day {dayNumber(e)} · {formatDate(new Date(e.createdAt), {
  month: "short",
  day: "numeric",
  year: "numeric"
})}
                      </Text>
                    </View>
                    {e.mood ? (
                      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 8 }}>{e.mood}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            onPress={onAddPhoto}
            style={{ marginTop: 16, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
          >
            <IconText label={t("plantGrowthTimeline.addAnotherPhotoToThe")} style={{
  color: "#8effab",
  fontWeight: "900",
  fontSize: 12
}} />
          </Pressable>
        </>
      )}
    </View>
  );
})
