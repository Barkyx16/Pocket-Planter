import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { FROST_THRESHOLD_F, HEAT_THRESHOLD_F, flipMonth, getClimateBucket, getTodayKey, isFertilizerDue, localizeAdvice } from "../core";
import { IconText } from "./IconText";
import { useTranslation } from "../lib/i18n";

export const FertilizerIntelligenceCard = memo(function FertilizerIntelligenceCard({ theme, weather, zone, savedPlants, fertilizerTrackers, onOpenPlant, unitSystem }) {
  const { t } = useTranslation();
  // The feeding tables below are authored against the northern calendar — like
  // every other month table in the app — so translate the local month back to the
  // reference one. Otherwise a southern gardener is told to skip feeding "for
  // winter" in the middle of their growing season.
  const currentMonth = flipMonth(new Date().getMonth() + 1);
  const today = getTodayKey();

  const getSeasonalFertilizerTip = () => {
  const climate = getClimateBucket(zone);

  if (climate === "hot") {
    if (currentMonth >= 2 && currentMonth <= 4) {
      return { emoji: "🌱", id: "hotEarlySpring" };
    }
    if (currentMonth >= 5 && currentMonth <= 9) {
      return { emoji: "🔥", id: "hotSummer" };
    }
    if (currentMonth >= 10 && currentMonth <= 12) {
      return { emoji: "🍂", id: "hotFallWinter" };
    }
    return { emoji: "🌿", id: "hotWinter" };
  }

  if (climate === "cold") {
    if (currentMonth >= 5 && currentMonth <= 6) {
      return { emoji: "🌱", id: "coldLateSpring" };
    }
    if (currentMonth >= 7 && currentMonth <= 8) {
      return { emoji: "☀️", id: "coldSummer" };
    }
    if (currentMonth >= 9 && currentMonth <= 10) {
      return { emoji: "🍂", id: "coldEarlyFall" };
    }
    return { emoji: "❄️", id: "coldWinter" };
  }

  // moderate zone (default)
  if (currentMonth >= 3 && currentMonth <= 5) {
    return { emoji: "🌱", id: "modSpring" };
  }
  if (currentMonth >= 6 && currentMonth <= 8) {
    return { emoji: "☀️", id: "modSummer" };
  }
  if (currentMonth >= 9 && currentMonth <= 11) {
    return { emoji: "🍂", id: "modFall" };
  }
  return { emoji: "❄️", id: "modWinter" };
};

const getWeatherWarning = () => {
  if (!weather) return null;
  if (weather.maxTempF >= HEAT_THRESHOLD_F) return { icon: "🔥", key: "fertilizerText.warnHot" };
  if (weather.precipChance >= 70) return { icon: "🌧️", key: "fertilizerText.warnRain" };
  if (weather.minTempF <= FROST_THRESHOLD_F) return { icon: "❄️", key: "fertilizerText.warnFrost" };
  return { icon: "✅", key: "fertilizerText.warnGood" };
};

const getPlantsDueForFertilizer = () => {
  return savedPlants.filter((plantName) => {
    const tracker = fertilizerTrackers?.[plantName];
    if (!tracker) return true;
    // The plant's own interval, as Home and the dashboard use: a flat 14 days
    // listed oregano (45) as due here a month before anything else agreed.
    return isFertilizerDue(plantName, tracker);
  }).slice(0, 3);
};

  // Each season's copy lives under fertilizerText.<id>_<field>; the English is
  // authored in °F and localizeAdvice converts it for metric gardeners.
  const tipRef = getSeasonalFertilizerTip();
  const tipField = (field) => t(`fertilizerText.${tipRef.id}_${field}`);
  const tip = {
    season: `${tipRef.emoji} ${tipField("season")}`,
    type: tipField("type"),
    product: tipField("product"),
    reason: tipField("reason"),
    frequency: tipField("frequency"),
    bestTime: tipField("bestTime"),
    tip: tipField("tip"),
  };
  const weatherWarning = getWeatherWarning();
  const plantsDue = getPlantsDueForFertilizer();

return (
    <View>
      <Text style={[styles.fertilizerTitle, { color: theme.text }]}>
        {tip.season} {t("fertilizerIntelligence.feedingGuide")}
      </Text>
      <Text style={[styles.fertilizerSubtext, { color: theme.secondaryText }]}>
        {localizeAdvice(tip.reason, unitSystem)}
      </Text>

      <View style={styles.fertilizerGrid}>
        {[
          { icon: "🧪", label: t("fertilizerIntelligence.fertilizerType"), value: tip.type, tint: "#8effab" },
          { icon: "⏰", label: t("fertilizerIntelligence.bestTime"), value: tip.bestTime, tint: "#6bc7ff" },
          { icon: "📅", label: t("fertilizerText.frequency"), value: tip.frequency, tint: "#ffd86b" },
          { icon: "🛒", label: t("fertilizerIntelligence.whatToBuy"), value: tip.product, tint: "#ff9f43" },
        ].map((tile) => (
          <View key={tile.label} style={styles.fertilizerTile}>
            <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: `${tile.tint}1f`, alignItems: "center", justifyContent: "center", marginBottom: 6, borderWidth: 1, borderColor: `${tile.tint}33` }}>
              <Text style={{ fontSize: 14 }}>{tile.icon}</Text>
            </View>
            <Text style={[styles.fertilizerTileLabel, { color: tile.tint }]}>{tile.label}</Text>
            <Text style={styles.fertilizerTileValue}>{localizeAdvice(tile.value, unitSystem)}</Text>
          </View>
        ))}
      </View>

      {weatherWarning ? (
        <View style={[styles.fertilizerWeatherBox, {
          backgroundColor: weatherWarning.icon === "✅" ? "rgba(92, 255, 137, 0.1)" : "rgba(255, 216, 107, 0.1)",
          borderColor: weatherWarning.icon === "✅" ? "rgba(92, 255, 137, 0.3)" : "rgba(255, 216, 107, 0.3)",
        }]}>
          <Text style={styles.fertilizerWeatherIcon}>{weatherWarning.icon}</Text>
          <Text style={[styles.fertilizerWeatherText, { color: theme.secondaryText }]}>{localizeAdvice(t(weatherWarning.key), unitSystem)}</Text>
        </View>
      ) : null}

      <View style={styles.fertilizerTipBox}>
        <IconText label={t("fertilizerIntelligence.proTip")} style={styles.fertilizerTipTitle} />
        <Text style={[styles.fertilizerTipText, { color: theme.secondaryText }]}>{localizeAdvice(tip.tip, unitSystem)}</Text>
      </View>

      {plantsDue.length > 0 ? (
        <View style={styles.fertilizerDueBox}>
          <IconText label={t("fertilizerIntelligence.plantsDueForFeeding")} style={styles.fertilizerDueTitle} />
          <View style={styles.fertilizerDueRow}>
            {plantsDue.map((plantName) => {
  const plant = produceData.find((item) => item.name === plantName);
  return (
    <Pressable
      key={plantName}
      onPress={() => plant && onOpenPlant(plant)}
      style={styles.fertilizerDuePill}
    >
      <Text style={styles.fertilizerDuePillText}>{plantName} →</Text>
    </Pressable>
  );
})}
          </View>
        </View>
      ) : null}
    </View>
  );
})
