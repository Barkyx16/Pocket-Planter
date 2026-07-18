import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { getClimateBucket, getTodayKey } from "../core";

export function FertilizerIntelligenceCard({ theme, weather, zone, savedPlants, fertilizerTrackers, onOpenPlant }) {
  const currentMonth = new Date().getMonth() + 1;
  const today = getTodayKey();

  const getSeasonalFertilizerTip = () => {
  const climate = getClimateBucket(zone);

  if (climate === "hot") {
    if (currentMonth >= 2 && currentMonth <= 4) {
      return {
        season: "🌱 Early Spring (Hot Zone)",
        type: "Balanced (10-10-10)",
        product: "Use slow-release granular fertilizer for steady feeding",
        reason: "Warm zones start growing early. A balanced feed now kickstarts roots before summer heat arrives.",
        frequency: "Every 2 weeks",
        bestTime: "Early morning before 9am",
        tip: "In hot zones spring is short — get nutrients in early before temperatures spike above 95°F.",
      };
    }
    if (currentMonth >= 5 && currentMonth <= 9) {
      return {
        season: "🔥 Summer (Hot Zone)",
        type: "Low Nitrogen, High Potassium",
        product: "Look for 3-5-7 or 0-0-50 potassium fertilizer",
        reason: "Summer heat in warm zones stresses plants.",
        frequency: "Once every 3-4 weeks",
        bestTime: "Early morning only — never midday",
        tip: "Skip fertilizing on days above 98°F. Heat plus fertilizer salts can burn roots rapidly in warm climates.",
      };
    }
    if (currentMonth >= 10 && currentMonth <= 12) {
      return {
        season: "🍂 Fall/Winter (Hot Zone)",
        type: "Phosphorus-Rich (5-10-5)",
        product: "Bone meal or superphosphate works great",
        reason: "Fall and winter are prime growing season in hot zones. Phosphorus now supports strong root and fruit development.",
        frequency: "Every 2-3 weeks",
        bestTime: "Morning or afternoon",
        tip: "Hot zone gardeners get a second growing season in fall — treat it like spring and fertilize accordingly.",
      };
    }
    return {
      season: "🌿 Winter (Hot Zone)",
      type: "Light Balanced Feed",
      product: "Diluted liquid fertilizer at half strength",
      reason: "Mild winters in warm zones mean plants keep growing slowly. Light feeding keeps them healthy without overloading.",
      frequency: "Once a month",
      bestTime: "Midday when temps are warmest",
      tip: "Even in winter, hot zone plants benefit from occasional feeding — just reduce the dose significantly.",
    };
  }

  if (climate === "cold") {
    if (currentMonth >= 5 && currentMonth <= 6) {
      return {
        season: "🌱 Late Spring (Cold Zone)",
        type: "High Nitrogen (N)",
        product: "Look for 20-20-20 or blood meal for nitrogen boost",
        reason: "Cold zones have a short growing window. High nitrogen now accelerates leafy growth before summer.",
        frequency: "Every 2 weeks",
        bestTime: "Morning after last frost risk passes",
        tip: "Wait until soil temps reach at least 50°F before fertilizing — cold soil can't absorb nutrients properly.",
      };
    }
    if (currentMonth >= 7 && currentMonth <= 8) {
      return {
        season: "☀️ Summer (Cold Zone)",
        type: "Balanced (10-10-10)",
        product: "Granular slow-release balanced fertilizer",
        reason: "Peak growing season in cold zones is short. A balanced feed keeps plants productive through the warm months.",
        frequency: "Every 2-3 weeks",
        bestTime: "Early morning",
        tip: "Mid-summer is your most important feeding window in cold zones — don't skip it.",
      };
    }
    if (currentMonth >= 9 && currentMonth <= 10) {
      return {
        season: "🍂 Early Fall (Cold Zone)",
        type: "High Potassium (K)",
        product: "Look for 0-0-60 or wood ash for natural potassium",
        reason: "Potassium helps cold zone plants harden off and store energy before the long winter ahead.",
        frequency: "Once in early fall only",
        bestTime: "Morning",
        tip: "Stop all fertilizing by mid-October in cold zones — new growth triggered late in the season will be frost damaged.",
      };
    }
    return {
      season: "❄️ Winter/Early Spring (Cold Zone)",
      type: "No feeding needed",
      product: "Add compost to beds instead",
      reason: "Plants in cold zones are fully dormant. Fertilizing now is wasteful and can damage roots under frozen soil.",
      frequency: "Skip until late spring",
      bestTime: "Wait for soil to thaw",
      tip: "Use winter to improve your soil with compost. By the time plants wake up in spring the nutrients will be ready.",
    };
  }

  // moderate zone (default)
  if (currentMonth >= 3 && currentMonth <= 5) {
    return {
      season: "🌱 Spring (Moderate Zone)",
      type: "High Nitrogen (N)",
      product: "Look for 10-10-10 or 20-20-20 balanced fertilizer",
      reason: "Spring is peak leafy growth season. Nitrogen fuels green foliage and strong stem development.",
      frequency: "Every 2 weeks",
      bestTime: "Early morning before 10am",
      tip: "Water your plants the day before fertilizing so roots absorb nutrients without burning.",
    };
  }
  if (currentMonth >= 6 && currentMonth <= 8) {
    return {
      season: "☀️ Summer (Moderate Zone)",
      type: "High Phosphorus (P)",
      product: "Look for 5-10-5 or bloom booster fertilizer",
      reason: "Summer triggers flowering and fruiting. Phosphorus supports strong blooms and fruit set.",
      frequency: "Every 3 weeks",
      bestTime: "Early morning before heat peaks",
      tip: "Avoid fertilizing during heat waves above 95°F — wait for a cooler day to prevent root burn.",
    };
  }
  if (currentMonth >= 9 && currentMonth <= 11) {
    return {
      season: "🍂 Fall (Moderate Zone)",
      type: "High Potassium (K)",
      product: "Look for 0-0-60 or 3-5-7 root fertilizer",
      reason: "Fall feeding strengthens roots and helps plants store energy for winter dormancy.",
      frequency: "Once a month",
      bestTime: "Morning or early afternoon",
      tip: "Cut back on nitrogen in fall — too much green growth now will be damaged by first frost.",
    };
  }
  return {
    season: "❄️ Winter (Moderate Zone)",
    type: "Minimal feeding",
    product: "Compost or worm castings only",
    reason: "Most plants are dormant in winter. Heavy fertilizing now can burn roots and stress plants.",
    frequency: "Once every 6-8 weeks for indoor plants only",
    bestTime: "Midday when temps are warmest",
    tip: "Focus on soil health this season — add compost to garden beds to prep for spring planting.",
  };
};

const getWeatherWarning = () => {
  if (!weather) return null;
  if (weather.maxTempF >= 95) return { icon: "🔥", text: "Too hot to fertilize today. Wait for temps below 90°F to avoid root burn." };
  if (weather.precipChance >= 70) return { icon: "🌧️", text: "Rain expected today. Hold off — heavy rain will wash away fertilizer before roots absorb it." };
  if (weather.minTempF <= 35) return { icon: "❄️", text: "Frost risk tonight. Don't fertilize — cold temps slow nutrient absorption significantly." };
  return { icon: "✅", text: "Great conditions to fertilize today. Mild temps and low rain chance means nutrients will absorb well." };
};

const getPlantsDueForFertilizer = () => {
  return savedPlants.filter((plantName) => {
    const tracker = fertilizerTrackers?.[plantName];
    if (!tracker) return true;
    const daysSince = Math.floor(
      (new Date() - new Date(tracker.lastFertilized)) / (1000 * 60 * 60 * 24)
    );
    return daysSince >= 14;
  }).slice(0, 3);
};

  const tip = getSeasonalFertilizerTip();
  const weatherWarning = getWeatherWarning();
  const plantsDue = getPlantsDueForFertilizer();

return (
    <View>
      <Text style={[styles.fertilizerTitle, { color: theme.text }]}>
        {tip.season} Feeding Guide
      </Text>
      <Text style={[styles.fertilizerSubtext, { color: theme.secondaryText }]}>
        {tip.reason}
      </Text>

      <View style={styles.fertilizerGrid}>
        <View style={styles.fertilizerTile}>
          <Text style={styles.fertilizerTileIcon}>🧪</Text>
          <Text style={styles.fertilizerTileLabel}>Fertilizer Type</Text>
          <Text style={styles.fertilizerTileValue}>{tip.type}</Text>
        </View>
        <View style={styles.fertilizerTile}>
          <Text style={styles.fertilizerTileIcon}>⏰</Text>
          <Text style={styles.fertilizerTileLabel}>Best Time</Text>
          <Text style={styles.fertilizerTileValue}>{tip.bestTime}</Text>
        </View>
        <View style={styles.fertilizerTile}>
          <Text style={styles.fertilizerTileIcon}>📅</Text>
          <Text style={styles.fertilizerTileLabel}>Frequency</Text>
          <Text style={styles.fertilizerTileValue}>{tip.frequency}</Text>
        </View>
        <View style={styles.fertilizerTile}>
          <Text style={styles.fertilizerTileIcon}>🛒</Text>
          <Text style={styles.fertilizerTileLabel}>What to Buy</Text>
          <Text style={styles.fertilizerTileValue}>{tip.product}</Text>
        </View>
      </View>

      {weatherWarning ? (
        <View style={[styles.fertilizerWeatherBox, {
          backgroundColor: weatherWarning.icon === "✅" ? "rgba(92,255,137,0.10)" : "rgba(255,216,107,0.10)",
          borderColor: weatherWarning.icon === "✅" ? "rgba(92,255,137,0.30)" : "rgba(255,216,107,0.30)",
        }]}>
          <Text style={styles.fertilizerWeatherIcon}>{weatherWarning.icon}</Text>
          <Text style={[styles.fertilizerWeatherText, { color: theme.secondaryText }]}>{weatherWarning.text}</Text>
        </View>
      ) : null}

      <View style={styles.fertilizerTipBox}>
        <Text style={styles.fertilizerTipTitle}>💡 Pro Tip</Text>
        <Text style={[styles.fertilizerTipText, { color: theme.secondaryText }]}>{tip.tip}</Text>
      </View>

      {plantsDue.length > 0 ? (
        <View style={styles.fertilizerDueBox}>
          <Text style={styles.fertilizerDueTitle}>🪴 Plants due for feeding</Text>
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
}
