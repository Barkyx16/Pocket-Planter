import { BackgroundDecoration } from "../components/BackgroundDecoration";
import { ConfettiBurst } from "../components/ConfettiBurst";
import { GardenPlacementModal } from "../components/GardenPlacementModal";
import { IconText } from "../components/IconText";
import { PlantGrowthTimeline } from "../components/PlantGrowthTimeline";
import { PremiumLockedCard } from "../components/PremiumLockedCard";
import { PremiumLockedSection } from "../components/PremiumLockedSection";
import { WeatherParticles } from "../components/WeatherParticles";
import { getCompanionInfo, getDiseaseForName, getHarvestCountdown, getHarvestDays, getLastWateredText, getPestForName, getPlantHealth, getPlantQuickFacts, getPlantSeasonLabel, getPlantSpecificTip, getPlantingSteps, getPlantingWindowText, getShouldGrowText, getTodayKey, getWateringTip, getWhereToPlantText, isOrnamental, normalizeType, resolvePlantImageSource } from "../core";
import { getDiseaseImage } from "../data/diseaseImageMap";
import { getPestImage } from "../data/pestImageMap";
import { formatDate } from "../lib/i18n";
import { styles } from "../styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Animated, Image, Linking, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from "react-native";

// The plant detail screen. Extracted from App.js, where it lived as a ~590-line
// early return inside AppInner — a big part of why that file passed 6,000 lines.
// Behaviour is unchanged; the closure variables it relied on are now explicit props.
export function PlantDetailScreen({
  createBedFromPlacementPrompt, fadeAnimation, fertilizerTrackers, followedPlants, gardenPlacementPrompt, gardenXP, getCompanionDisplayName, getCompanionImage, glowOpacity, handleBackFromPlant, harvestTrackers, isDark, journalEntries, jumpToTab, markPlantWatered, openDisease, openPest, openPlantByName, pickJournalPhoto, placeFromPlacementPrompt, plantNotes, premiumUnlocked, quickAddPlantToGarden, rarityStyle, replaceFromPlacementPrompt, resolveCompanionPlant, savedPlants, schedulePlantReminder, selectedPlant, setGardenPlacementPrompt, setHarvestLogPlant, setHarvestLogText, setHarvestTrackers, setPlantNotes, showLevelUp, theme, toggleFertilizerTracker, toggleSavedPlant, wateredPlants, wateringHistory, weather, xpPopups, zip, zone,
}) {
    const plantImage = resolvePlantImageSource(selectedPlant);
    const companionInfo = getCompanionInfo(selectedPlant.name) || {};
    const inCatalog = (item) => resolveCompanionPlant(item) !== null;
    const excellentCompanions = (Array.isArray(companionInfo.excellent) ? companionInfo.excellent : []).filter(inCatalog);
    const neutralCompanions = (Array.isArray(companionInfo.neutral) ? companionInfo.neutral : []).filter(inCatalog);
    const avoidCompanions = (Array.isArray(companionInfo.avoid) ? companionInfo.avoid : []).filter(inCatalog);
    const seasonLabel = getPlantSeasonLabel(selectedPlant, zone);
    const quickFacts = getPlantQuickFacts(selectedPlant);
    const plantHealth = getPlantHealth(selectedPlant);
    const plantingWindow = getPlantingWindowText(selectedPlant);
    const plantingSteps = getPlantingSteps(selectedPlant);
    const isSaved = savedPlants.includes(selectedPlant.name);
    const isFollowed = followedPlants.includes(selectedPlant.name);
    const wateringCompletedToday = wateredPlants[selectedPlant.name] === getTodayKey();
    const harvestTracker = harvestTrackers[selectedPlant.name];
    const harvestDaysLeft = harvestTracker ? Math.max(0, harvestTracker.days - Math.floor((new Date() - new Date(harvestTracker.startedAt)) / (1000 * 60 * 60 * 24))) : null;
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" />
        <BackgroundDecoration isDark={isDark} />
        <WeatherParticles weather={weather} />
        {xpPopups.map((popup) => (<View key={popup.id} style={styles.xpPopup}><Text style={styles.xpPopupText}>+{popup.amount} XP</Text></View>))}
        {showLevelUp ? (
  <View style={styles.levelUpOverlay}>
    <ConfettiBurst />

    <View style={styles.levelUpCard}>
      <Text style={styles.levelUpEmoji}>🎉</Text>

      <Text style={styles.levelUpTitle}>
        LEVEL UP!
      </Text>

      <Text style={styles.levelUpText}>
        🎉 Level {gardenXP.level} Reached!
      </Text>
    </View>
  </View>
) : null}

<ScrollView
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ paddingBottom: 140 }}
>
  <View style={styles.detailHeader}>
    <Pressable
      onPress={handleBackFromPlant}
      style={styles.backButton}
    >
      <Ionicons
        name="chevron-back"
        size={22}
        color="#ffffff"
      />

      <Text style={styles.backButtonText}>
        Back
      </Text>
    </Pressable>
  </View>

  <Animated.View
    style={[
      styles.detailHero,
      { opacity: fadeAnimation },
    ]}
  >
    <Animated.View
      style={[
        styles.detailGlow,
        { opacity: glowOpacity },
      ]}
    />

    {plantImage ? (
      <View style={styles.detailPlantImageWrap}>
        <Image
          source={plantImage}
          style={styles.detailPlantImage}
          resizeMode="contain"
        />
      </View>
    ) : (
      <Text style={styles.detailPlantEmoji}>
        🌱
      </Text>
    )}

    <View style={styles.detailBadgeRow}>
      <View style={styles.detailBadge}>
        <Text style={styles.detailBadgeText}>
          {rarityStyle?.emoji} {rarityStyle?.label}
        </Text>
      </View>

      <View style={styles.detailBadge}>
        <Text style={styles.detailBadgeText}>
          {seasonLabel}
        </Text>
      </View>
    </View>
            <Text style={styles.detailTitle}>{selectedPlant.name}</Text>
            <Text style={styles.detailSubtitle}>{normalizeType(selectedPlant.type, selectedPlant.name)} • Zones {selectedPlant.minZone}–{selectedPlant.maxZone}</Text>
          </Animated.View>
          <View style={styles.detailQuickActions}>
            <Pressable onPress={() => toggleSavedPlant(selectedPlant.name)} style={[styles.quickActionButton, isSaved && styles.quickActionButtonActive]}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={21} color={isSaved ? "#07120b" : "#ffffff"} />
              <Text style={[styles.quickActionText, isSaved && styles.quickActionTextActive]}>{isSaved ? "Saved" : "Save"}</Text>
            </Pressable>
          </View>
<View style={styles.card}>
  <Text style={styles.cardEyebrow}>Daily controls</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="💧"
      title="Garden Actions"
      description="Mark watering, set reminders, and log progress photos for every plant in your garden."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      {!isOrnamental(selectedPlant) ? (
      <>
      <View style={styles.harvestTrackerCard}>
        <Text style={styles.harvestTrackerEmoji}>🚜</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.harvestTrackerTitle}>Harvest Tracker</Text>
          <Text style={styles.harvestTrackerText}>
            {harvestTracker
              ? harvestDaysLeft === 0
                ? "Ready to harvest!"
                : `Ready in ${harvestDaysLeft} days`
              : getHarvestCountdown(selectedPlant)}
          </Text>
        </View>
        <Pressable
          style={styles.harvestTrackerButton}
          onPress={() => {
            setHarvestTrackers((current) => ({
              ...current,
              [selectedPlant.name]: {
                startedAt: new Date().toISOString(),
                days: getHarvestDays(selectedPlant),
              },
            }));
            Alert.alert("Harvest Tracker Started", `${selectedPlant.name} is now being tracked.`);
          }}
        >
          <Text style={styles.harvestTrackerButtonText}>
            {harvestTracker ? "Restart" : "Start"}
          </Text>
        </Pressable>
      </View>
      <Pressable
        onPress={() => { setHarvestLogText(""); setHarvestLogPlant(selectedPlant.name); }}
        style={{ marginTop: 10, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
      >
        <IconText label={"🎉 Log a Harvest"} style={{
  color: "#07120b",
  fontWeight: "900",
  fontSize: 14
}} />
      </Pressable>
      </>
      ) : null}
      <View style={styles.harvestTrackerCard}>
        <Text style={styles.harvestTrackerEmoji}>🌾</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.harvestTrackerTitle}>Fertilizer Tracker</Text>
          <Text style={styles.harvestTrackerText}>
            {fertilizerTrackers[selectedPlant.name]
              ? `Last fed ${formatDate(new Date(fertilizerTrackers[selectedPlant.name].lastFertilized))}`
              : "Track fertilizer applications"}
          </Text>
        </View>
        <Pressable
          style={styles.harvestTrackerButton}
          onPress={() => toggleFertilizerTracker(selectedPlant.name)}
        >
          <Text style={styles.harvestTrackerButtonText}>
            {fertilizerTrackers[selectedPlant.name] ? "Tracking" : "Start"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.detailControlGrid}>
        <Pressable
          onPress={() => markPlantWatered(selectedPlant.name)}
          style={[styles.controlTile, wateringCompletedToday && styles.controlTileActive]}
        >
          <Text style={styles.controlTileIcon}>💧</Text>
          <Text style={[styles.controlTileTitle, wateringCompletedToday && styles.controlTileTitleActive]}>
            {wateringCompletedToday ? "Watered" : "Mark watered"}
          </Text>
          <Text style={styles.controlTileSubtext}>
            {getLastWateredText(selectedPlant.name, wateredPlants, wateringHistory)}
          </Text>
        </Pressable>
        <Pressable onPress={() => quickAddPlantToGarden(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>🗺️</Text>
          <Text style={styles.controlTileTitle}>Add to garden</Text>
        </Pressable>
        <Pressable onPress={() => schedulePlantReminder(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>🔔</Text>
          <Text style={styles.controlTileTitle}>Reminder</Text>
        </Pressable>
        <Pressable onPress={() => pickJournalPhoto(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>📸</Text>
          <Text style={styles.controlTileTitle}>Add photo</Text>
        </Pressable>
      </View>
    </>
  )}
</View>

<PlantGrowthTimeline
  theme={theme}
  plant={selectedPlant}
  journalEntries={journalEntries}
  premiumUnlocked={premiumUnlocked}
  onAddPhoto={() => pickJournalPhoto(selectedPlant.name)}
  onUnlock={() => jumpToTab("premium")}
/>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>Smart Care</Text>
  <Text style={styles.cardText}>{getShouldGrowText(selectedPlant, zone, weather)}</Text>
  <View style={styles.detailMiniGrid}>
    {[
      { icon: "☀️", label: "Sun", value: quickFacts.sun },
      { icon: "💧", label: "Water needs", value: quickFacts.water },
      { icon: "📏", label: "Spacing", value: quickFacts.spacing },
      { icon: "🌱", label: "Soil", value: quickFacts.soil },
      { icon: "🏆", label: "Difficulty", value: quickFacts.difficulty },
      { icon: "📅", label: "Planting window", value: plantingWindow },
      // Premium users already get a rich Watering Forecast in Daily controls above,
      // so only show the generic weather-based watering tip to free users (no duplicate).
      ...(!premiumUnlocked ? [{ icon: "🚿", label: "Watering today", value: getWateringTip(weather) }] : []),
      { icon: "📍", label: "Best spot", value: getWhereToPlantText(selectedPlant) },
      { icon: "🌤️", label: "Weather advice", value: getPlantSpecificTip(selectedPlant, zone, weather) },
    ].map((fact) => (
      <View key={fact.label} style={styles.detailMiniCard}>
        <Text style={styles.detailMiniIcon}>{fact.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.detailMiniLabel}>{fact.label}</Text>
          <Text style={styles.detailMiniValue}>{fact.value}</Text>
        </View>
      </View>
    ))}
  </View>
</View>
{plantHealth ? (
<View style={styles.card}>
  <IconText label={"🐛 Problems & Protection"} style={styles.cardEyebrow} />
  <Text style={[styles.cardText, { marginTop: 2 }]}>
    Pests and diseases to watch for on {selectedPlant.name} — tap any one for its full guide.
  </Text>
  {plantHealth.pests?.length ? (
    <>
      <View style={styles.companionSectionHeader}>
        <Text style={styles.companionSectionEmoji}>🐛</Text>
        <Text style={styles.companionSectionTitle}>Common Pests</Text>
        <View style={{ backgroundColor: "rgba(255, 123, 123, 0.18)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: "#ff9f9f", fontSize: 10, fontWeight: "900" }}>{plantHealth.pests.length}</Text>
        </View>
      </View>
      <View style={styles.companionExcellentGrid}>
        {plantHealth.pests.map((pestName) => {
          const pestObj = getPestForName(pestName);
          const img = pestObj ? getPestImage(pestObj.name) : null;
          const label = pestObj ? pestObj.name : pestName;
          const chipStyle = [styles.companionChip, { backgroundColor: "rgba(255, 123, 123, 0.1)", borderColor: "rgba(255, 123, 123, 0.28)" }];
          const inner = (
            <>
              <View style={[styles.companionChipIconWrap, { backgroundColor: "rgba(255, 123, 123, 0.16)", overflow: "hidden" }]}>
                {img ? (
                  <Image source={img} style={{ width: 34, height: 34 }} resizeMode="cover" />
                ) : (
                  <Text style={{ fontSize: 18 }}>{pestObj?.emoji || "🐛"}</Text>
                )}
              </View>
              <Text style={styles.companionChipName} numberOfLines={1}>{label}</Text>
            </>
          );
          return pestObj ? (
            <Pressable key={`pest-${pestName}`} onPress={() => openPest(pestObj)} accessibilityRole="button" accessibilityLabel={`${label} — tap for the pest guide`} style={chipStyle}>{inner}</Pressable>
          ) : (
            <View key={`pest-${pestName}`} style={chipStyle}>{inner}</View>
          );
        })}
      </View>
    </>
  ) : null}
  {plantHealth.diseases?.length ? (
    <>
      <View style={styles.companionSectionHeader}>
        <Text style={styles.companionSectionEmoji}>🦠</Text>
        <Text style={styles.companionSectionTitle}>Common Diseases</Text>
        <View style={{ backgroundColor: "rgba(255, 207, 139, 0.16)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: "#ffcf8b", fontSize: 10, fontWeight: "900" }}>{plantHealth.diseases.length}</Text>
        </View>
      </View>
      <View style={styles.companionExcellentGrid}>
        {plantHealth.diseases.map((diseaseName) => {
          const diseaseObj = getDiseaseForName(diseaseName);
          const img = diseaseObj ? getDiseaseImage(diseaseObj.name) : null;
          const label = diseaseObj ? diseaseObj.name : diseaseName;
          const chipStyle = [styles.companionChip, { backgroundColor: "rgba(255, 207, 139, 0.1)", borderColor: "rgba(255, 207, 139, 0.28)" }];
          const inner = (
            <>
              <View style={[styles.companionChipIconWrap, { backgroundColor: "rgba(255, 207, 139, 0.16)", overflow: "hidden" }]}>
                {img ? (
                  <Image source={img} style={{ width: 34, height: 34 }} resizeMode="cover" />
                ) : (
                  <Text style={{ fontSize: 18 }}>{diseaseObj?.emoji || "🦠"}</Text>
                )}
              </View>
              <Text style={styles.companionChipName} numberOfLines={1}>{label}</Text>
            </>
          );
          return diseaseObj ? (
            <Pressable key={`dis-${diseaseName}`} onPress={() => openDisease(diseaseObj)} accessibilityRole="button" accessibilityLabel={`${label} — tap for the disease guide`} style={chipStyle}>{inner}</Pressable>
          ) : (
            <View key={`dis-${diseaseName}`} style={chipStyle}>{inner}</View>
          );
        })}
      </View>
    </>
  ) : null}
  {plantHealth.symptoms ? (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
      <Text style={{ fontSize: 13 }}>⚠️</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "600", lineHeight: 19, flex: 1 }}>
        <Text style={{ color: "#ff9f9f", fontWeight: "900" }}>Watch for: </Text>{plantHealth.symptoms}
      </Text>
    </View>
  ) : null}
  {plantHealth.prevent ? (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
      <Text style={{ fontSize: 13 }}>✅</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "600", lineHeight: 19, flex: 1 }}>
        <Text style={{ color: "#8effab", fontWeight: "900" }}>Prevent & treat: </Text>{plantHealth.prevent}
      </Text>
    </View>
  ) : null}
</View>
) : null}
<View style={styles.card}>
  <Text style={styles.cardEyebrow}>Step by step</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="🌱"
      title="How to Plant"
      description="Get step-by-step planting guides tailored to every plant in your zone."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={[styles.cardText, { marginTop: 2 }]}>
        {plantingSteps.length} steps to get {selectedPlant.name} in the ground. Check your seed packet for variety-specific timing.
      </Text>
      <View style={{ marginTop: 12 }}>
        {plantingSteps.map((step, index) => (
          <View
            key={`${selectedPlant.name}-step-${index}`}
            style={styles.stepRow}
          >
            <View style={{ alignItems: "center" }}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              {index < plantingSteps.length - 1 ? (
                <View style={{ width: 2, flex: 1, backgroundColor: "rgba(92, 255, 137, 0.24)", marginTop: 2, minHeight: 14 }} />
              ) : null}
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </>
  )}
</View>

<View style={styles.card}>
  <IconText label={"🌿 Companion Intelligence"} style={styles.cardEyebrow} />
  {!premiumUnlocked ? (
   <PremiumLockedCard
      theme={theme}
      title="Companion planting locked"
      body="Unlock premium to see excellent pairs, plants to avoid, pest prevention tips, and companion search."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={[styles.cardText, { marginTop: 2 }]}>
        Who to plant near {selectedPlant.name} — and who to keep apart. Tap any plant to open it.
      </Text>

      {/* EXCELLENT PAIRS */}
      {excellentCompanions.length > 0 ? (
        <>
          <View style={styles.companionSectionHeader}>
            <Text style={styles.companionSectionEmoji}>🟢</Text>
            <Text style={styles.companionSectionTitle}>Plant Together</Text>
            <View style={{ backgroundColor: "rgba(92, 255, 137, 0.2)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: "#5cff89", fontSize: 10, fontWeight: "900" }}>{excellentCompanions.length}</Text>
            </View>
          </View>
          <View style={styles.companionExcellentGrid}>
            {excellentCompanions.map((item) => (
              <Pressable key={`excellent-${item}`} onPress={() => openPlantByName(item)} style={styles.companionChip}>
                <View style={styles.companionChipIconWrap}>
                  {getCompanionImage(item) ? (
                    <Image source={getCompanionImage(item)} style={{ width: 26, height: 26 }} resizeMode="contain" />
                  ) : (
                    <Text style={{ fontSize: 18 }}>🌱</Text>
                  )}
                </View>
                <Text style={styles.companionChipName} numberOfLines={1}>{getCompanionDisplayName(item)}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {/* NEUTRAL */}
      {neutralCompanions.length > 0 ? (
        <>
          <View style={styles.companionSectionHeader}>
            <Text style={styles.companionSectionEmoji}>🟡</Text>
            <Text style={styles.companionSectionTitle}>OK Nearby</Text>
            <View style={{ backgroundColor: "rgba(255, 216, 107, 0.16)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: "#ffd86b", fontSize: 10, fontWeight: "900" }}>{neutralCompanions.length}</Text>
            </View>
          </View>
          <View style={styles.companionExcellentGrid}>
            {neutralCompanions.map((item) => (
              <Pressable key={`neutral-${item}`} onPress={() => openPlantByName(item)} style={[styles.companionChip, { backgroundColor: "rgba(255, 216, 107, 0.08)", borderColor: "rgba(255, 216, 107, 0.2)" }]}>
                <View style={[styles.companionChipIconWrap, { backgroundColor: "rgba(255, 216, 107, 0.16)" }]}>
                  {getCompanionImage(item) ? (
                    <Image source={getCompanionImage(item)} style={{ width: 26, height: 26 }} resizeMode="contain" />
                  ) : (
                    <Text style={{ fontSize: 18 }}>🌱</Text>
                  )}
                </View>
                <Text style={styles.companionChipName} numberOfLines={1}>{getCompanionDisplayName(item)}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {/* AVOID */}
      {avoidCompanions.length > 0 ? (
        <>
          <View style={styles.companionSectionHeader}>
            <Text style={styles.companionSectionEmoji}>🔴</Text>
            <Text style={styles.companionSectionTitle}>Keep Apart</Text>
            <View style={{ backgroundColor: "rgba(255, 123, 123, 0.16)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: "#ff7b7b", fontSize: 10, fontWeight: "900" }}>{avoidCompanions.length}</Text>
            </View>
          </View>
          <View style={styles.companionExcellentGrid}>
            {avoidCompanions.map((item) => (
              <Pressable key={`avoid-${item}`} onPress={() => openPlantByName(item)} style={[styles.companionChip, { backgroundColor: "rgba(255, 123, 123, 0.08)", borderColor: "rgba(255, 123, 123, 0.2)" }]}>
                <View style={[styles.companionChipIconWrap, { backgroundColor: "rgba(255, 123, 123, 0.16)" }]}>
                  {getCompanionImage(item) ? (
                    <Image source={getCompanionImage(item)} style={{ width: 26, height: 26 }} resizeMode="contain" />
                  ) : (
                    <Text style={{ fontSize: 18 }}>⚠️</Text>
                  )}
                </View>
                <Text style={styles.companionChipName} numberOfLines={1}>{getCompanionDisplayName(item)}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {excellentCompanions.length === 0 && neutralCompanions.length === 0 && avoidCompanions.length === 0 ? (
        <Text style={[styles.cardText, { marginTop: 10, fontStyle: "italic" }]}>
          No companion data for {selectedPlant.name} yet — it's an easygoing neighbor for most plants.
        </Text>
      ) : null}
    </>
  )}
</View>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>Shop & Supply</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="🛒"
      title="Where to Buy"
      description="Find seeds, fertilizer, and supplies for this plant — with links to Amazon, Park Seed, Home Depot, and local garden centers."
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={styles.cardText}>
        Find seeds, fertilizer, and supplies for {selectedPlant.name} near ZIP code {zip || "your area"}.
      </Text>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(selectedPlant.name + " seeds")}`)}
      >
        <Text style={styles.shopLinkIcon}>📦</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Buy {selectedPlant.name} Seeds on Amazon</Text>
          <Text style={styles.shopLinkSub}>Ships to your door</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(selectedPlant.name + " fertilizer")}`)}
      >
        <Text style={styles.shopLinkIcon}>🧪</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Buy {selectedPlant.name} Fertilizer on Amazon</Text>
          <Text style={styles.shopLinkSub}>Specific nutrients for this plant</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.parkseed.com/search?q=${encodeURIComponent(selectedPlant.name)}`)}
      >
        <Text style={styles.shopLinkIcon}>🪴</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Shop {selectedPlant.name} at Park Seed</Text>
          <Text style={styles.shopLinkSub}>Trusted seed catalog since 1868</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.google.com/maps/search/garden+center+near+${zip || "me"}`)}
      >
        <Text style={styles.shopLinkIcon}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Find Garden Centers Near {zip || "You"}</Text>
          <Text style={styles.shopLinkSub}>Local stores near your ZIP code</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.homedepot.com/s/${encodeURIComponent(selectedPlant.name + " plant")}`)}
      >
        <Text style={styles.shopLinkIcon}>🏠</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>Shop at Home Depot Garden Center</Text>
          <Text style={styles.shopLinkSub}>Check local availability</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
    </>
  )}
</View>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>Personal garden notes</Text>
  <TextInput
    multiline
    placeholder={`Write notes about ${selectedPlant.name}...`}
    placeholderTextColor="#8fbf9d"
    value={plantNotes[selectedPlant.name] || ""}
    onChangeText={(text) => setPlantNotes((current) => ({ ...current, [selectedPlant.name]: text }))}
    style={styles.plantNotesInput}
  />
</View>

<View style={styles.card}>
  <Pressable onPress={handleBackFromPlant} style={styles.bottomBackButton}>
    <Ionicons name="chevron-back" size={22} color="#07120b" />
    <Text style={styles.bottomBackButtonText}>Back to plants</Text>
  </Pressable>
</View>
</ScrollView>

{/* The placement popup must live in this view tree too — the plant detail is an
    early return, so the copy in the main tree isn't mounted while it's open. */}
<GardenPlacementModal
  prompt={gardenPlacementPrompt}
  theme={theme}
  onPlaceIn={(bed) => placeFromPlacementPrompt(bed)}
  onReplace={(bed, conflict) => replaceFromPlacementPrompt(bed, conflict)}
  onCreateNew={() => createBedFromPlacementPrompt()}
  onClose={() => setGardenPlacementPrompt(null)}
/>
</SafeAreaView>
);
}
