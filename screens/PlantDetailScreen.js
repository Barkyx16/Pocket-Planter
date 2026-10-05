import { BackgroundDecoration } from "../components/BackgroundDecoration";
import { ConfettiBurst } from "../components/ConfettiBurst";
import { FlowerNotesCard } from "../components/FlowerNotesCard";
import { GardenPlacementModal } from "../components/GardenPlacementModal";
import { IconText } from "../components/IconText";
import { PlantGrowthTimeline } from "../components/PlantGrowthTimeline";
import { PremiumLockedCard } from "../components/PremiumLockedCard";
import { PremiumLockedSection } from "../components/PremiumLockedSection";
import { WeatherParticles } from "../components/WeatherParticles";
import { getCompanionInfo, getPlantDifficulty, getDiseaseForName, getHarvestCountdown, getHarvestDays, getHarvestDaysLeft, getLastWateredText, hasHarvestCountdown, diseaseText, getPestForName, getPlantHealth, pestText, getPlantQuickFacts, getPlantSeasonLabel, getPlantSpecificTip, getPlantingSteps, getPlantingWindowText, getShouldGrowText, getTodayKey, getWateringTip, getWhereToPlantText, isOrnamental, localizeAdvice, normalizeType, resolvePlantImageSource } from "../core";
import { getDiseaseImage } from "../data/diseaseImageMap";
import { getPestImage } from "../data/pestImageMap";
import { difficultyLabel, formatDate, plantTypeLabel, seasonLabel, t } from "../lib/i18n";
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
    const companionInfo = getCompanionInfo(selectedPlant.name) || {};
    const inCatalog = (item) => resolveCompanionPlant(item) !== null;
    const excellentCompanions = (Array.isArray(companionInfo.excellent) ? companionInfo.excellent : []).filter(inCatalog);
    const neutralCompanions = (Array.isArray(companionInfo.neutral) ? companionInfo.neutral : []).filter(inCatalog);
    const avoidCompanions = (Array.isArray(companionInfo.avoid) ? companionInfo.avoid : []).filter(inCatalog);
    const plantSeason = getPlantSeasonLabel(selectedPlant, zone);
    const quickFacts = getPlantQuickFacts(selectedPlant, unitSystem);
    const plantHealth = getPlantHealth(selectedPlant);
    const plantingWindow = getPlantingWindowText(selectedPlant);
    const plantingSteps = getPlantingSteps(selectedPlant, unitSystem);
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
        {xpPopups.map((popup) => (<View key={popup.id} style={styles.xpPopup}><Text style={styles.xpPopupText}>{typeof popup.amount === "number" ? t("plantsText.xpGain", { amount: popup.amount }) : popup.amount}</Text></View>))}
        {showLevelUp ? (
  <View style={styles.levelUpOverlay}>
    <ConfettiBurst />

    <View style={styles.levelUpCard}>
      <Text style={styles.levelUpEmoji}>🎉</Text>

      <Text style={styles.levelUpTitle}>
        {t("plantDetailScreen.levelUp")}
      </Text>

      <Text style={styles.levelUpText}>
        {t("plantDetailScreen.levelReached", { level: gardenXP.level })}
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
        {t("plantsText.back")}
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
          {seasonLabel(plantSeason)}
        </Text>
      </View>
    </View>
            <Text style={styles.detailTitle}>{selectedPlant.name}</Text>
            <Text style={styles.detailSubtitle}>{plantTypeLabel(normalizeType(selectedPlant.type, selectedPlant.name))} {t("plantDetailScreen.zones", { min: selectedPlant.minZone, max: selectedPlant.maxZone })}</Text>
          </Animated.View>
          <View style={styles.detailQuickActions}>
            <Pressable onPress={() => toggleSavedPlant(selectedPlant.name)} style={[styles.quickActionButton, isSaved && styles.quickActionButtonActive]}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={21} color={isSaved ? "#07120b" : "#ffffff"} />
              <Text style={[styles.quickActionText, isSaved && styles.quickActionTextActive]}>{isSaved ? t("shortLabels.saved") : t("shortLabels.save")}</Text>
            </Pressable>
          </View>
<View style={styles.card}>
  <Text style={styles.cardEyebrow}>{t("plantDetailScreen.dailyControls")}</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="💧"
      title={t("plantDetailScreen.gardenActions")}
      description={t("plantDetailScreen.markWateringSetRemindersAnd")}
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      {!isOrnamental(selectedPlant) ? (
      <>
      <View style={styles.harvestTrackerCard}>
        <Text style={styles.harvestTrackerEmoji}>🚜</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.harvestTrackerTitle}>{t("plantDetailScreen.harvestTracker")}</Text>
          <Text style={styles.harvestTrackerText}>
            {harvestTracker
              ? harvestDaysLeft === 0
                ? t("plantDetailScreen.readyToHarvest")
                : t("plantDetailScreen.readyInDays", { count: harvestDaysLeft })
              : getHarvestCountdown(selectedPlant)}
          </Text>
        </View>
        {hasHarvestCountdown(selectedPlant) ? (
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
            {harvestTracker ? t("plantDetailScreen.restart") : t("plantDetailScreen.start")}
          </Text>
        </Pressable>
        ) : harvestTracker ? (
          // No countdown for this plant: a tracker started before there was this
          // check can still be stopped, but a new one is not offered.
          <Pressable
            style={styles.harvestTrackerButton}
            onPress={() => setHarvestTrackers((current) => {
              const next = { ...current };
              delete next[selectedPlant.name];
              return next;
            })}
          >
            <Text style={styles.harvestTrackerButtonText}>{t("plantDetailScreen.stop")}</Text>
          </Pressable>
        ) : null}
      </View>
      <Pressable
        onPress={() => { setHarvestLogText(""); setHarvestLogPlant(selectedPlant.name); }}
        style={{ marginTop: 10, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
      >
        <IconText label={t("plantDetailScreen.logAHarvest")} style={{
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
          <Text style={styles.harvestTrackerTitle}>{t("plantDetailScreen.fertilizerTracker")}</Text>
          <Text style={styles.harvestTrackerText}>
            {fertilizerTrackers[selectedPlant.name]
              ? t("plantDetailScreen.lastFed", { date: formatDate(new Date(fertilizerTrackers[selectedPlant.name].lastFertilized)) })
              : t("plantDetailScreen.trackFertilizerApplications")}
          </Text>
        </View>
        <Pressable
          style={styles.harvestTrackerButton}
          onPress={() => toggleFertilizerTracker(selectedPlant.name)}
        >
          <Text style={styles.harvestTrackerButtonText}>
            {fertilizerTrackers[selectedPlant.name] ? t("plantDetailScreen.tracking") : t("plantDetailScreen.start")}
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
            {wateringCompletedToday ? t("plantDetailScreen.watered") : t("plantDetailScreen.markWatered")}
          </Text>
          <Text style={styles.controlTileSubtext}>
            {getLastWateredText(selectedPlant.name, wateredPlants, wateringHistory)}
          </Text>
        </Pressable>
        <Pressable onPress={() => quickAddPlantToGarden(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>🗺️</Text>
          <Text style={styles.controlTileTitle}>{t("plantDetailScreen.addToGarden")}</Text>
        </Pressable>
        <Pressable onPress={() => schedulePlantReminder(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>🔔</Text>
          <Text style={styles.controlTileTitle}>{t("plantDetailScreen.reminder")}</Text>
        </Pressable>
        <Pressable onPress={() => pickJournalPhoto(selectedPlant.name)} style={styles.controlTile}>
          <Text style={styles.controlTileIcon}>📸</Text>
          <Text style={styles.controlTileTitle}>{t("plantDetailScreen.addPhoto")}</Text>
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
  <Text style={styles.cardEyebrow}>{t("plantDetailScreen.smartCare")}</Text>
  <Text style={styles.cardText}>{localizeAdvice(getShouldGrowText(selectedPlant, zone, weather), unitSystem)}</Text>
  <View style={styles.detailMiniGrid}>
    {[
      { icon: "☀️", label: t("plantDetailScreen.sun"), value: quickFacts.sun },
      { icon: "💧", label: t("plantDetailScreen.waterNeeds"), value: quickFacts.water },
      { icon: "📏", label: t("plantDetailScreen.spacing"), value: quickFacts.spacing },
      { icon: "🌱", label: t("plantDetailScreen.soil"), value: quickFacts.soil },
      { icon: "🏆", label: t("plantDetailScreen.difficulty"), value: `${getPlantDifficulty(selectedPlant).icon} ${difficultyLabel(getPlantDifficulty(selectedPlant)).label}` },
      { icon: "📅", label: t("plantDetailScreen.plantingWindow"), value: plantingWindow },
      // Premium users already get a rich Watering Forecast in Daily controls above,
      // so only show the generic weather-based watering tip to free users (no duplicate).
      ...(!premiumUnlocked ? [{ icon: "🚿", label: t("plantDetailScreen.wateringToday"), value: getWateringTip(weather) }] : []),
      { icon: "📍", label: t("plantDetailScreen.bestSpot"), value: getWhereToPlantText(selectedPlant, unitSystem) },
      { icon: "🌤️", label: t("plantDetailScreen.weatherAdvice"), value: getPlantSpecificTip(selectedPlant, zone, weather) },
    ].map((fact) => (
      <View key={fact.label} style={styles.detailMiniCard}>
        <Text style={styles.detailMiniIcon}>{fact.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.detailMiniLabel}>{fact.label}</Text>
          <Text style={styles.detailMiniValue}>{localizeAdvice(fact.value, unitSystem)}</Text>
        </View>
      </View>
    ))}
  </View>
</View>
<FlowerNotesCard theme={theme} plant={selectedPlant} />
{plantHealth ? (
<View style={styles.card}>
  <IconText label={t("plantDetailScreen.problemsProtection")} style={styles.cardEyebrow} />
  <Text style={[styles.cardText, { marginTop: 2 }]}>
    {t("plantDetailScreen.pestsAndDiseasesToWatch", { plant: selectedPlant.name })}
  </Text>
  {plantHealth.pests?.length ? (
    <>
      <View style={styles.companionSectionHeader}>
        <Text style={styles.companionSectionEmoji}>🐛</Text>
        <Text style={styles.companionSectionTitle}>{t("plantDetailScreen.commonPests")}</Text>
        <View style={{ backgroundColor: "rgba(255, 123, 123, 0.18)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: "#ff9f9f", fontSize: 10, fontWeight: "900" }}>{plantHealth.pests.length}</Text>
        </View>
      </View>
      <View style={styles.companionExcellentGrid}>
        {plantHealth.pests.map((pestName) => {
          const pestObj = getPestForName(pestName);
          const img = pestObj ? getPestImage(pestObj.name) : null;
          const label = pestObj ? pestText(pestObj, "name") : pestName;
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
            <Pressable key={`pest-${pestName}`} onPress={() => openPest(pestObj)} accessibilityRole="button" accessibilityLabel={t("plantsText.pestGuideA11y", { name: label })} style={chipStyle}>{inner}</Pressable>
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
        <Text style={styles.companionSectionTitle}>{t("plantDetailScreen.commonDiseases")}</Text>
        <View style={{ backgroundColor: "rgba(255, 207, 139, 0.16)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: "#ffcf8b", fontSize: 10, fontWeight: "900" }}>{plantHealth.diseases.length}</Text>
        </View>
      </View>
      <View style={styles.companionExcellentGrid}>
        {plantHealth.diseases.map((diseaseName) => {
          const diseaseObj = getDiseaseForName(diseaseName);
          const img = diseaseObj ? getDiseaseImage(diseaseObj.name) : null;
          const label = diseaseObj ? diseaseText(diseaseObj, "name") : diseaseName;
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
            <Pressable key={`dis-${diseaseName}`} onPress={() => openDisease(diseaseObj)} accessibilityRole="button" accessibilityLabel={t("plantsText.diseaseGuideA11y", { name: label })} style={chipStyle}>{inner}</Pressable>
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
        <Text style={{ color: "#ff9f9f", fontWeight: "900" }}>{t("plantDetailScreen.watchFor")} </Text>{plantHealth.symptoms}
      </Text>
    </View>
  ) : null}
  {plantHealth.prevent ? (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
      <Text style={{ fontSize: 13 }}>✅</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "600", lineHeight: 19, flex: 1 }}>
        <Text style={{ color: "#8effab", fontWeight: "900" }}>{t("plantDetailScreen.preventTreat")} </Text>{plantHealth.prevent}
      </Text>
    </View>
  ) : null}
</View>
) : null}
<View style={styles.card}>
  <Text style={styles.cardEyebrow}>{t("plantDetailScreen.stepByStep")}</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="🌱"
      title={t("plantDetailScreen.howToPlant")}
      description={t("plantDetailScreen.getStepbystepPlantingGuidesTailored")}
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={[styles.cardText, { marginTop: 2 }]}>
        {t("plantDetailScreen.stepsToGet", { count: plantingSteps.length, plant: selectedPlant.name })}
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
            <Text style={styles.stepText}>{localizeAdvice(step, unitSystem)}</Text>
          </View>
        ))}
      </View>
    </>
  )}
</View>

<View style={styles.card}>
  <IconText label={t("plantDetailScreen.companionIntelligence")} style={styles.cardEyebrow} />
  {!premiumUnlocked ? (
   <PremiumLockedCard
      theme={theme}
      title={t("plantDetailScreen.companionPlantingLocked")}
      body={t("plantDetailScreen.unlockPremiumToSeeExcellent")}
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={[styles.cardText, { marginTop: 2 }]}>
        {t("plantDetailScreen.whoToPlantNear", { plant: selectedPlant.name })}
      </Text>

      {/* EXCELLENT PAIRS */}
      {excellentCompanions.length > 0 ? (
        <>
          <View style={styles.companionSectionHeader}>
            <Text style={styles.companionSectionEmoji}>🟢</Text>
            <Text style={styles.companionSectionTitle}>{t("plantDetailScreen.plantTogether")}</Text>
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
            <Text style={styles.companionSectionTitle}>{t("plantDetailScreen.okNearby")}</Text>
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
            <Text style={styles.companionSectionTitle}>{t("plantDetailScreen.keepApart")}</Text>
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
          {t("plantDetailScreen.noCompanionDataFor", { plant: selectedPlant.name })}
        </Text>
      ) : null}
    </>
  )}
</View>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>{t("plantDetailScreen.shopSupply")}</Text>
  {!premiumUnlocked ? (
    <PremiumLockedSection
      icon="🛒"
      title={t("plantDetailScreen.whereToBuy")}
      description={t("plantDetailScreen.findSeedsFertilizerAndSupplies")}
      onUnlock={() => jumpToTab("premium")}
    />
  ) : (
    <>
      <Text style={styles.cardText}>
        {zip ? t("plantDetailScreen.findSuppliesNearZip", { plant: selectedPlant.name, zip }) : t("plantDetailScreen.findSuppliesNearYou", { plant: selectedPlant.name })}
      </Text>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(selectedPlant.name + " seeds")}`)}
      >
        <Text style={styles.shopLinkIcon}>📦</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{t("plantDetailScreen.seedsOnAmazon", { plant: selectedPlant.name })}</Text>
          <Text style={styles.shopLinkSub}>{t("plantDetailScreen.shipsToYourDoor")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(selectedPlant.name + " fertilizer")}`)}
      >
        <Text style={styles.shopLinkIcon}>🧪</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{t("plantDetailScreen.fertilizerOnAmazon", { plant: selectedPlant.name })}</Text>
          <Text style={styles.shopLinkSub}>{t("plantDetailScreen.specificNutrientsForThisPlant")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.parkseed.com/search?q=${encodeURIComponent(selectedPlant.name)}`)}
      >
        <Text style={styles.shopLinkIcon}>🪴</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{t("plantDetailScreen.atParkSeed", { plant: selectedPlant.name })}</Text>
          <Text style={styles.shopLinkSub}>{t("plantDetailScreen.trustedSeedCatalogSince1868")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.google.com/maps/search/garden+center+near+${zip || "me"}`)}
      >
        <Text style={styles.shopLinkIcon}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{zip ? t("plantDetailScreen.findGardenCentersNear", { zip }) : t("plantDetailScreen.findGardenCentersNearYou")}</Text>
          <Text style={styles.shopLinkSub}>{t("plantDetailScreen.localStoresNearYourZip")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
      <Pressable
        style={styles.shopLinkButton}
        onPress={() => Linking.openURL(`https://www.homedepot.com/s/${encodeURIComponent(selectedPlant.name + " plant")}`)}
      >
        <Text style={styles.shopLinkIcon}>🏠</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.shopLinkTitle}>{t("plantDetailScreen.shopAtHomeDepotGarden")}</Text>
          <Text style={styles.shopLinkSub}>{t("plantDetailScreen.checkLocalAvailability")}</Text>
        </View>
        <Text style={styles.shopLinkArrow}>›</Text>
      </Pressable>
    </>
  )}
</View>

<View style={styles.card}>
  <Text style={styles.cardEyebrow}>{t("plantDetailScreen.personalGardenNotes")}</Text>
  <TextInput
    multiline
    placeholder={t("plantsText.notesPlaceholder", { plant: selectedPlant.name })}
    placeholderTextColor="#8fbf9d"
    value={plantNotes[selectedPlant.name] || ""}
    onChangeText={(text) => setPlantNotes((current) => ({ ...current, [selectedPlant.name]: text }))}
    style={styles.plantNotesInput}
  />
</View>

<View style={styles.card}>
  <Pressable onPress={handleBackFromPlant} style={styles.bottomBackButton}>
    <Ionicons name="chevron-back" size={22} color="#07120b" />
    <Text style={styles.bottomBackButtonText}>{t("plantDetailScreen.backToPlants")}</Text>
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
