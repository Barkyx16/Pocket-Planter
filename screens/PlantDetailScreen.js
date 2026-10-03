import { BackgroundDecoration } from "../components/BackgroundDecoration";
import { ConfettiBurst } from "../components/ConfettiBurst";
import { GardenPlacementModal } from "../components/GardenPlacementModal";
import { IconText } from "../components/IconText";
import { PlantGrowthTimeline } from "../components/PlantGrowthTimeline";
import { PremiumLockedCard } from "../components/PremiumLockedCard";
import { PremiumLockedSection } from "../components/PremiumLockedSection";
import { WeatherParticles } from "../components/WeatherParticles";
import { getCompanionLists, getDiseaseForName, getHarvestCountdown, getHarvestDays, getHarvestDaysLeft, getLastWateredText, getPestForName, getPlantHealth, getPlantingSteps, getPlantingWindowText, getPlantQuickFacts, getPlantSeasonLabel, getPlantSpecificTip, getShouldGrowText, getTodayKey, getWateringTip, getWhereToPlantText, isOrnamental, localizeUnits, normalizeType, resolvePlantImageSource, translateSeasonLabel, typeLabel } from "../core";
import { getDiseaseImage } from "../data/diseaseImageMap";
import { getPestImage } from "../data/pestImageMap";
import { formatDate, t, tn } from "../lib/i18n";
import { styles } from "../styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Animated, Image, Linking, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from "react-native";

// The plant detail screen. Extracted from App.js, where it lived as a ~590-line
// early return inside AppInner — a big part of why that file passed 6,000 lines.
// Behaviour is unchanged; the closure variables it relied on are now explicit props.
export function PlantDetailScreen({
  createBedFromPlacementPrompt, fadeAnimation, fertilizerTrackers, followedPlants, gardenPlacementPrompt, gardenXP, getCompanionDisplayName, getCompanionImage, glowOpacity, handleBackFromPlant, harvestTrackers, isDark, journalEntries, jumpToTab, markPlantWatered, openDisease, openPest, openPlantByName, pickJournalPhoto, placeFromPlacementPrompt, plantNotes, premiumUnlocked, quickAddPlantToGarden, rarityStyle, replaceFromPlacementPrompt, resolveCompanionPlant, savedPlants, schedulePlantReminder, selectedPlant, setGardenPlacementPrompt, setHarvestLogPlant, setHarvestLogText, setHarvestTrackers, setPlantNotes, showLevelUp, theme, toggleFertilizerTracker, toggleSavedPlant, unitSystem, wateredPlants, wateringHistory, weather, xpPopups, zip, zone,
}) {
    const plantImage = resolvePlantImageSource(selectedPlant);
    const inCatalog = (item) => resolveCompanionPlant(item) !== null;
    // Sorted by the pair check, so the page agrees with the garden map and the
    // pair checker; see getCompanionLists.
    const companionLists = getCompanionLists(selectedPlant.name);
    const excellentCompanions = companionLists.excellent.filter(inCatalog);
    const neutralCompanions = companionLists.neutral.filter(inCatalog);
    const avoidCompanions = companionLists.avoid.filter(inCatalog);
    const seasonLabel = getPlantSeasonLabel(selectedPlant, zone);
    const quickFacts = getPlantQuickFacts(selectedPlant);
    const plantHealth = getPlantHealth(selectedPlant);
    const plantingWindow = getPlantingWindowText(selectedPlant);
    // Tips are written in Fahrenheit, inches and feet; show them in the
    // gardener's own units.
    const temps = (text) => localizeUnits(text, unitSystem);
    const plantingSteps = getPlantingSteps(selectedPlant).map((step) => (typeof step === "string" ? temps(step) : step));
    const isSaved = savedPlants.includes(selectedPlant.name);
    const isFollowed = followedPlants.includes(selectedPlant.name);
    const wateringCompletedToday = wateredPlants[selectedPlant.name] === getTodayKey();
    const harvestTracker = harvestTrackers[selectedPlant.name];
    const harvestDaysLeft = getHarvestDaysLeft(harvestTracker);
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
        {t("plantPage.levelUp")}
      </Text>

      <Text style={styles.levelUpText}>
        {t("plantPage.levelReached", { level: gardenXP.level })}
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
        {t("plantPage.back")}
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
          {translateSeasonLabel(seasonLabel)}
        </Text>
      </View>
    </View>
            <Text style={styles.detailTitle}>{selectedPlant.name}</Text>
            <Text style={styles.detailSubtitle}>{typeLabel(normalizeType(selectedPlant.type, selectedPlant.name))} • {t("plantPage.zonesRange", { min: selectedPlant.minZone, max: selectedPlant.maxZone })}</Text>
          </Animated.View>
          <View style={styles.detailQuickActions}>
            <Pressable onPress={() => toggleSavedPlant(selectedPlant.name)} style={[styles.quickActionButton, isSaved && styles.quickActionButtonActive]}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={21} color={isSaved ? "#07120b" : "#ffffff"} />
              <Text style={[styles.quickActionText, isSaved && styles.quickActionTextActive]}>{isSaved ? "Saved" : "Save"}</Text>
            </Pressable>
          </View>
<View style={styles.card}>
  <Text style={styles.cardEyebrow}>{t("plantPage.dailyControls")}</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="💧"
      title={t("plantPage.gardenActions")}
      description={t("plantPage.gardenActionsBody")}
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      {!isOrnamental(selectedPlant) ? (
      <>
      <View style={styles.harvestTrackerCard}>
        <Text style={styles.harvestTrackerEmoji}>🚜</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.harvestTrackerTitle}>{t("plantPage.harvestTracker")}</Text>
          <Text style={styles.harvestTrackerText}>
            {harvestTracker
              ? harvestDaysLeft === 0
                ? t("plantPage.readyToHarvest")
                : tn("plantPage.readyInDays", harvestDaysLeft)
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
            Alert.alert(t("alerts.harvestTrackerTitle"), t("alerts.harvestTrackerBody", { plant: selectedPlant.name }));
          }}
        >
          <Text style={styles.harvestTrackerButtonText}>
            {harvestTracker ? t("plantPage.restart") : t("plantPage.start")}
          </Text>
        </Pressable>
      </View>
      <Pressable
        onPress={() => { setHarvestLogText(""); setHarvestLogPlant(selectedPlant.name); }}
        style={{ marginTop: 10, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
      >
        <IconText label={t("plantPage.logHarvest")} style={{
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
          <Text style={styles.harvestTrackerTitle}>{t("plantPage.fertilizerTracker")}</Text>
          <Text style={styles.harvestTrackerText}>
            {fertilizerTrackers[selectedPlant.name]
              ? t("plantPage.lastFed", { date: formatDate(new Date(fertilizerTrackers[selectedPlant.name].lastFertilized)) })
              : t("plantPage.trackFertilizer")}
          </Text>
        </View>
        <Pressable
          style={styles.harvestTrackerButton}
          onPress={() => toggleFertilizerTracker(selectedPlant.name)}
        >
          <Text style={styles.harvestTrackerButtonText}>
            {fertilizerTrackers[selectedPlant.name] ? t("plantPage.tracking") : t("plantPage.start")}
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
            {wateringCompletedToday ? t("plantPage.watered") : t("plantPage.markWatered")}
          </Text>
          <Text style={styles.controlTileSubtext}>
            {getLastWateredText(selectedPlant.name, wateredPlants, wateringHistory)}
          </Text>
        </Pressable>
        <Pressable onPress={() => quickAddPlantToGarden(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>🗺️</Text>
          <Text style={styles.controlTileTitle}>{t("plantPage.addToGarden")}</Text>
        </Pressable>
        <Pressable onPress={() => schedulePlantReminder(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>🔔</Text>
          <Text style={styles.controlTileTitle}>{t("plantPage.reminder")}</Text>
        </Pressable>
        <Pressable onPress={() => pickJournalPhoto(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>📸</Text>
          <Text style={styles.controlTileTitle}>{t("plantPage.addPhoto")}</Text>
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
  <Text style={styles.cardEyebrow}>{t("plantPage.smartCare")}</Text>
  <Text style={styles.cardText}>{temps(getShouldGrowText(selectedPlant, zone, weather))}</Text>
  <View style={styles.detailMiniGrid}>
    {[
      { icon: "☀️", label: t("plantPage.factSun"), value: quickFacts.sun },
      { icon: "💧", label: t("plantPage.factWater"), value: quickFacts.water },
      { icon: "📏", label: t("plantPage.factSpacing"), value: temps(quickFacts.spacing) },
      { icon: "🌱", label: t("plantPage.factSoil"), value: quickFacts.soil },
      { icon: "🏆", label: t("plantPage.factDifficulty"), value: quickFacts.difficulty },
      { icon: "📅", label: t("plantPage.factWindow"), value: plantingWindow },
      // Premium users already get a rich Watering Forecast in Daily controls above,
      // so only show the generic weather-based watering tip to free users (no duplicate).
      ...(!premiumUnlocked ? [{ icon: "🚿", label: t("plantPage.factWateringToday"), value: temps(getWateringTip(weather)) }] : []),
      { icon: "📍", label: t("plantPage.factBestSpot"), value: temps(getWhereToPlantText(selectedPlant)) },
      { icon: "🌤️", label: t("plantPage.factWeather"), value: temps(getPlantSpecificTip(selectedPlant, zone, weather)) },
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
  <IconText label={t("plantPage.problems")} style={styles.cardEyebrow} />
  <Text style={[styles.cardText, { marginTop: 2 }]}>
    {t("plantPage.problemsBody", { plant: selectedPlant.name })}
  </Text>
  {plantHealth.pests?.length ? (
    <>
      <View style={styles.companionSectionHeader}>
        <Text style={styles.companionSectionEmoji}>🐛</Text>
        <Text style={styles.companionSectionTitle}>{t("plantPage.commonPests")}</Text>
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
            <Pressable key={`pest-${pestName}`} onPress={() => openPest(pestObj)} accessibilityRole="button" accessibilityLabel={t("extra.pestGuide", { label })} style={chipStyle}>{inner}</Pressable>
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
        <Text style={styles.companionSectionTitle}>{t("plantPage.commonDiseases")}</Text>
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
            <Pressable key={`dis-${diseaseName}`} onPress={() => openDisease(diseaseObj)} accessibilityRole="button" accessibilityLabel={t("extra.diseaseGuide", { label })} style={chipStyle}>{inner}</Pressable>
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
        <Text style={{ color: "#ff9f9f", fontWeight: "900" }}>{t("plantPage.watchFor")}</Text>{plantHealth.symptoms}
      </Text>
    </View>
  ) : null}
  {plantHealth.prevent ? (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
      <Text style={{ fontSize: 13 }}>✅</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "600", lineHeight: 19, flex: 1 }}>
        <Text style={{ color: "#8effab", fontWeight: "900" }}>{t("plantPage.preventTreat")}</Text>{plantHealth.prevent}
      </Text>
    </View>
  ) : null}
</View>
) : null}
<View style={styles.card}>
  <Text style={styles.cardEyebrow}>{t("plantPage.stepByStep")}</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="🌱"
      title={t("plantPage.howToPlant")}
      description={t("plantPage.howToPlantBody")}
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={[styles.cardText, { marginTop: 2 }]}>
        {tn("plantPage.stepsIntro", plantingSteps.length, { plant: selectedPlant.name })}
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
  <IconText label={t("plantPage.companionIntel")} style={styles.cardEyebrow} />
  {!premiumUnlocked ? (
   <PremiumLockedCard
      theme={theme}
      title={t("plantPage.companionLocked")}
      body={t("plantPage.companionLockedBody")}
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={[styles.cardText, { marginTop: 2 }]}>
        {t("plantPage.whoToPlantNear", { plant: selectedPlant.name })}
      </Text>

      {/* EXCELLENT PAIRS */}
      {excellentCompanions.length > 0 ? (
        <>
          <View style={styles.companionSectionHeader}>
            <Text style={styles.companionSectionEmoji}>🟢</Text>
            <Text style={styles.companionSectionTitle}>{t("plantPage.plantTogether")}</Text>
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
            <Text style={styles.companionSectionTitle}>{t("plantPage.okNearby")}</Text>
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
            <Text style={styles.companionSectionTitle}>{t("plantPage.keepApart")}</Text>
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
          {t("plantPage.noCompanionData", { plant: selectedPlant.name })}
        </Text>
      ) : null}
    </>
  )}
</View>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>{t("plantPage.shopSupply")}</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="🛒"
      title={t("plantPage.whereToBuy")}
      description={t("plantPage.whereToBuyBody")}
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={styles.cardText}>
        {zip ? t("plantPage.findSuppliesZip", { plant: selectedPlant.name, zip }) : t("plantPage.findSuppliesArea", { plant: selectedPlant.name })}
      </Text>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(selectedPlant.name + " seeds")}`)}
      >
        <Text style={styles.shopLinkIcon}>📦</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{t("plantPage.buySeedsAmazon", { plant: selectedPlant.name })}</Text>
          <Text style={styles.shopLinkSub}>{t("plantPage.shipsToDoor")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(selectedPlant.name + " fertilizer")}`)}
      >
        <Text style={styles.shopLinkIcon}>🧪</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{t("plantPage.buyFertAmazon", { plant: selectedPlant.name })}</Text>
          <Text style={styles.shopLinkSub}>{t("plantPage.specificNutrients")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.parkseed.com/search?q=${encodeURIComponent(selectedPlant.name)}`)}
      >
        <Text style={styles.shopLinkIcon}>🪴</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{t("plantPage.shopParkSeed", { plant: selectedPlant.name })}</Text>
          <Text style={styles.shopLinkSub}>{t("plantPage.trustedSince")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.google.com/maps/search/garden+center+near+${zip || "me"}`)}
      >
        <Text style={styles.shopLinkIcon}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{zip ? t("plantPage.findCentersNear", { zip }) : t("plantPage.findCentersNearYou")}</Text>
          <Text style={styles.shopLinkSub}>{t("plantPage.localStores")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.homedepot.com/s/${encodeURIComponent(selectedPlant.name + " plant")}`)}
      >
        <Text style={styles.shopLinkIcon}>🏠</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{t("plantPage.shopHomeDepot")}</Text>
          <Text style={styles.shopLinkSub}>{t("plantPage.checkLocal")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
    </>
  )}
</View>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>{t("plantPage.personalNotes")}</Text>
  <TextInput
    multiline
    placeholder={t("plantPage.notesPlaceholder", { plant: selectedPlant.name })}
    placeholderTextColor="#8fbf9d"
    value={plantNotes[selectedPlant.name] || ""}
    onChangeText={(text) => setPlantNotes((current) => ({ ...current, [selectedPlant.name]: text }))}
    style={styles.plantNotesInput}
  />
</View>

<View style={styles.card}>
  <Pressable onPress={handleBackFromPlant} style={styles.bottomBackButton}>
    <Ionicons name="chevron-back" size={22} color="#07120b" />
    <Text style={styles.bottomBackButtonText}>{t("plantPage.backToPlants")}</Text>
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
