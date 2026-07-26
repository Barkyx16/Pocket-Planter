import { memo } from "react";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTranslation, formatDate } from "../lib/i18n";
import { styles } from "../styles";
import { IconText } from "./IconText";

export const JournalCard = memo(function JournalCard({ theme, journalEntries, onAddGeneralPhoto, onDeleteEntry, uploadingPhoto }) {
  const { t, tn, growthStageLabel } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlant, setFilterPlant] = useState("All");
  const [filterStage, setFilterStage] = useState("All");
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [editingCaption, setEditingCaption] = useState(null);
  const [captionDraft, setCaptionDraft] = useState("");
  const [localCaptions, setLocalCaptions] = useState({});
  const [showCaptionSuggestions, setShowCaptionSuggestions] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");

  const uniquePlants = ["All", ...Array.from(new Set(journalEntries.map(e => e.plantName || "Garden Update").filter(Boolean)))];
  const uniqueStages = ["All", "Seedling", "Leaf Growth", "Flowering", "Fruit Forming", "Harvest Ready"];

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = !searchQuery || (entry.plantName || "").toLowerCase().includes(searchQuery.toLowerCase()) || (entry.caption || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlant = filterPlant === "All" || (entry.plantName || "Garden Update") === filterPlant;
    const matchesStage = filterStage === "All" || entry.growthStage === filterStage;
    return matchesSearch && matchesPlant && matchesStage;
  });

  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = formatDate(date, {
  month: "long",
  year: "numeric"
});
    if (!groups[key]) groups[key] = { label, entries: [] };
    groups[key].entries.push(entry);
    return groups;
  }, {});

  const totalPhotos = journalEntries.length;
  const plantsDocumented = new Set(journalEntries.map(e => e.plantName).filter(Boolean)).size;
  const harvestEntries = journalEntries.filter(e => String(e.growthStage || "").includes("Harvest")).length;
  const thisMonthEntries = journalEntries.filter(e => {
    const d = new Date(e.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const thisWeekEntries = journalEntries.filter(e => {
    const d = new Date(e.createdAt);
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  // Growth chart data — entries per month
  const growthChartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const count = journalEntries.filter(e => {
      const ed = new Date(e.createdAt);
      return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    }).length;
    return { month: formatDate(d, {
  month: "short"
}), count };
  });
  const maxCount = Math.max(...growthChartData.map(d => d.count), 1);

  // Stage breakdown
  const stageBreakdown = ["Seedling", "Leaf Growth", "Flowering", "Fruit Forming", "Harvest Ready"].map(stage => ({
    stage,
    count: journalEntries.filter(e => e.growthStage === stage).length,
    color: { "Seedling": "#8effab", "Leaf Growth": "#5cff89", "Flowering": "#ffd86b", "Fruit Forming": "#ff9f43", "Harvest Ready": "#ff7b7b" }[stage],
  }));

  const journalAchievements = [
    { icon: "🌱", title: t("journal.badgeFirstSprout"), unlocked: journalEntries.length >= 1 },
    { icon: "📸", title: t("journal.badgePhotoKeeper"), unlocked: journalEntries.length >= 3 },
    { icon: "📖", title: t("journal.badgeGardenStory"), unlocked: journalEntries.length >= 5 },
    { icon: "🍅", title: t("journal.badgeHarvestHero"), unlocked: harvestEntries > 0 },
    { icon: "🌿", title: "Botanist", unlocked: plantsDocumented >= 5 },
    { icon: "📅", title: t("journal.badgeMonthlyGrower"), unlocked: thisMonthEntries >= 3 },
  ];

  const getGrowthProgress = (stage) => {
    const stages = ["Seedling", "Leaf Growth", "Flowering", "Fruit Forming", "Harvest Ready"];
    const index = stages.indexOf(stage);
    return index === -1 ? 0 : (index + 1) / stages.length;
  };

  const getStageColor = (stage) => {
    const colors = { "Seedling": "#8effab", "Leaf Growth": "#5cff89", "Flowering": "#ffd86b", "Fruit Forming": "#ff9f43", "Harvest Ready": "#ff7b7b" };
    return colors[stage] || "#5cff89";
  };

  const getSmartCaptions = (entry) => {
    const plant = entry.plantName || "plant";
    const stage = entry.growthStage || "Seedling";
    const mood = entry.mood || "";
    const suggestions = {
      "Seedling": [
        `${plant} is just getting started 🌱 Day ${entry.daysSincePlanting || 1} and already showing signs of life!`,
        `Tiny but mighty 💚 Watching ${plant} push through the soil is pure magic.`,
        `Day ${entry.daysSincePlanting || 1} — ${plant} seedling looking healthy and ready to grow!`,
      ],
      "Leaf Growth": [
        `${plant} is really taking off now 🌿 The leaf growth this week has been incredible.`,
        `Green and thriving! ${plant} is in full leaf growth mode 💪`,
        `Look at those leaves! ${plant} is loving the conditions right now.`,
      ],
      "Flowering": [
        `${plant} is flowering! 🌸 This is the moment I've been waiting for.`,
        `Bloom time! ${plant} is showing off its beautiful flowers today.`,
        `Flowers on the ${plant} — pollinators are going to love this 🐝`,
      ],
      "Fruit Forming": [
        `Fruit is forming on the ${plant}! 🍅 Almost there — can't wait for harvest!`,
        `${plant} is putting all its energy into this fruit. Looking plump and perfect!`,
        `Day ${entry.daysSincePlanting || 1} — the ${plant} fruit is coming along beautifully.`,
      ],
      "Harvest Ready": [
        `Harvest day! 🎉 ${plant} has been an incredible grower this season.`,
        `It's time! ${plant} is ready to harvest and it looks absolutely perfect.`,
        `From seed to harvest — ${plant} has been an amazing journey 🌱➡️🍽️`,
      ],
    };
    return suggestions[stage] || suggestions["Seedling"];
  };

  const sharePhoto = async (imageUri) => {
    try {
      const { Share } = require("react-native");
      await Share.share({
        message: t("journal.shareText"),
        url: imageUri,
      });
    } catch (error) {
      Alert.alert(t("journal.shareFailed"), t("journal.shareFailedBody"));
    }
  };

  const saveCaption = (entryId) => {
    setLocalCaptions(current => ({ ...current, [entryId]: captionDraft }));
    setEditingCaption(null);
    setCaptionDraft("");
  };

return (
    <View>

      {/* ── DASHBOARD STATS ── */}
      {totalPhotos > 0 ? (
        <View style={styles.journalDashGrid}>
          <View style={[styles.journalDashTile, { borderColor: "rgba(92, 255, 137, 0.24)" }]}>
            <Text style={styles.journalDashTileIcon}>📸</Text>
            <Text style={styles.journalDashTileValue}>{totalPhotos}</Text>
            <Text style={[styles.journalDashTileLabel, { color: theme.secondaryText }]}>{t("journal.totalPhotos")}</Text>
          </View>
          <View style={[styles.journalDashTile, { borderColor: "rgba(255, 216, 107, 0.24)" }]}>
            <Text style={styles.journalDashTileIcon}>🌿</Text>
            <Text style={styles.journalDashTileValue}>{plantsDocumented}</Text>
            <Text style={[styles.journalDashTileLabel, { color: theme.secondaryText }]}>{t("journal.plantsDocumented")}</Text>
          </View>
          <View style={[styles.journalDashTile, { borderColor: "rgba(107, 199, 255, 0.24)" }]}>
            <Text style={styles.journalDashTileIcon}>📅</Text>
            <Text style={styles.journalDashTileValue}>{thisMonthEntries}</Text>
            <Text style={[styles.journalDashTileLabel, { color: theme.secondaryText }]}>{t("journal.thisMonth")}</Text>
          </View>
          <View style={[styles.journalDashTile, { borderColor: "rgba(255, 107, 107, 0.24)" }]}>
            <Text style={styles.journalDashTileIcon}>🚜</Text>
            <Text style={styles.journalDashTileValue}>{harvestEntries}</Text>
            <Text style={[styles.journalDashTileLabel, { color: theme.secondaryText }]}>Harvests</Text>
          </View>
        </View>
      ) : null}

      {/* ── GROWTH CHART ── */}
      {totalPhotos > 0 ? (
        <View style={styles.journalGrowthChartCard}>
          <Text style={styles.journalGrowthChartTitle}>{t("journal.photoActivity")}</Text>
          <View style={styles.journalGrowthChartBars}>
            {growthChartData.map((item, i) => (
              <View key={i} style={styles.journalGrowthChartBar}>
                <Text style={[styles.journalGrowthChartCount, { color: item.count > 0 ? "#5cff89" : "#314c39" }]}>
                  {item.count > 0 ? item.count : ""}
                </Text>
                <View style={styles.journalGrowthChartBarTrack}>
                  <View style={[styles.journalGrowthChartBarFill, {
                    height: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: i === 5 ? "#5cff89" : "rgba(92, 255, 137, 0.3)",
                  }]} />
                </View>
                <Text style={styles.journalGrowthChartMonth}>{item.month}</Text>
              </View>
            ))}
          </View>
          {thisWeekEntries > 0 ? (
            <View style={styles.journalGrowthChartBadge}>
              <Text style={styles.journalGrowthChartBadgeText}>{tn("journal.photosThisWeek", thisWeekEntries)}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* ── STAGE BREAKDOWN ── */}
      {totalPhotos > 0 ? (
        <View style={styles.journalStageBreakdown}>
          <Text style={styles.journalStageBreakdownTitle}>{t("journal.growthBreakdown")}</Text>
          <View style={styles.journalStageBreakdownTrack}>
            {stageBreakdown.filter(s => s.count > 0).map((s, i) => (
              <View key={i} style={[styles.journalStageBreakdownSegment, {
                flex: s.count,
                backgroundColor: s.color,
                borderRadius: i === 0 ? 8 : i === stageBreakdown.filter(x => x.count > 0).length - 1 ? 8 : 0,
              }]} />
            ))}
          </View>
          <View style={styles.journalStageLegend}>
            {stageBreakdown.filter(s => s.count > 0).map((s, i) => (
              <View key={i} style={styles.journalStageLegendItem}>
                <View style={[styles.journalStageLegendDot, { backgroundColor: s.color }]} />
                <Text style={[styles.journalStageLegendText, { color: theme.secondaryText }]}>
                  {s.stage.split(" ")[0]} ({s.count})
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* ── ACHIEVEMENTS ── */}
      {totalPhotos > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.journalAchievementScroll}>
          {journalAchievements.map((a) => (
            <View key={a.title} style={[styles.journalAchievementBadgeV2, {
              opacity: a.unlocked ? 1 : 0.3,
              borderColor: a.unlocked ? "rgba(92, 255, 137, 0.3)" : "rgba(255, 255, 255, 0.08)",
              backgroundColor: a.unlocked ? "rgba(92, 255, 137, 0.1)" : "rgba(255, 255, 255, 0.04)",
            }]}>
              <Text style={styles.journalAchievementIconV2}>{a.icon}</Text>
              <Text numberOfLines={1} style={styles.journalAchievementTextV2}>{a.title}</Text>
              {a.unlocked ? <Text style={styles.journalAchievementCheck}>✓</Text> : null}
            </View>
          ))}
        </ScrollView>
      ) : null}

      {/* ── TAB SWITCHER ── */}
      {totalPhotos > 0 ? (
        <View style={styles.journalTabSwitcher}>
          {[{ id: "timeline", label: t("journal.timeline") }, { id: "plants", label: t("journal.byPlant") }].map(tab => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.journalTabButton, activeTab === tab.id && styles.journalTabButtonActive]}
            >
              <Text style={[styles.journalTabButtonText, activeTab === tab.id && styles.journalTabButtonTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* ── EMPTY STATE ── */}
      {journalEntries.length === 0 ? (
        <View style={styles.journalEmptyState}>
          <View style={styles.journalEmptyIconRing}>
            <Text style={styles.journalEmptyStateEmoji}>📸</Text>
          </View>
          <Text style={styles.journalEmptyStateTitle}>{t("journal.emptyTitle")}</Text>
          <Text style={[styles.journalEmptyStateText, { color: theme.secondaryText }]}>
            {t("journal.snapAPhotoWheneverSomething")}
          </Text>

          <Pressable disabled={uploadingPhoto} style={styles.journalHeroButton} onPress={onAddGeneralPhoto}>
            <Text style={styles.journalHeroButtonText}>{uploadingPhoto ? t("journal.uploading") : t("journal.addFirstPhoto")}</Text>
          </Pressable>
          <Text style={styles.journalEmptyHint}>{t("journal.takesSeconds")}</Text>

          {/* ── MOMENTS TO CAPTURE ── */}
          <Text style={styles.journalEmptySectionLabel}>{t("journal.greatMoments")}</Text>
          <View style={styles.journalIdeaGrid}>
            {[
              { icon: "🌱", label: t("journal.momentSprout") },
              { icon: "🌿", label: t("journal.momentLeaves") },
              { icon: "💧", label: t("journal.momentWatering") },
              { icon: "🌸", label: t("journal.momentFlower") },
              { icon: "🍅", label: t("journal.momentFruit") },
              { icon: "🎉", label: t("journal.momentHarvest") },
            ].map((idea) => (
              <Pressable key={idea.label} disabled={uploadingPhoto} onPress={onAddGeneralPhoto} style={styles.journalIdeaChip}>
                <Text style={styles.journalIdeaChipIcon}>{idea.icon}</Text>
                <Text style={styles.journalIdeaChipLabel}>{idea.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* ── BADGES TO UNLOCK ── */}
          <Text style={styles.journalEmptySectionLabel}>{t("journal.badgesToUnlock")}</Text>
          <View style={styles.journalUnlockGrid}>
            {journalAchievements.map((a) => (
              <View key={a.title} style={styles.journalUnlockChip}>
                <Text style={styles.journalUnlockIcon}>{a.icon}</Text>
                <Text numberOfLines={1} style={styles.journalUnlockLabel}>{a.title}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <>
          <Pressable disabled={uploadingPhoto} style={styles.journalAddPhotoButton} onPress={onAddGeneralPhoto}>
            <Text style={styles.journalAddPhotoButtonIcon}>📷</Text>
            <Text style={styles.journalAddPhotoButtonText}>{uploadingPhoto ? t("journal.uploading") : t("journal.addPhoto")}</Text>
          </Pressable>

          {/* ── SEARCH ── */}
          <View style={styles.journalSearchBar}>
            <Text style={styles.journalSearchIcon}>🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t("journal.searchPlaceholder")}
              placeholderTextColor="#8fbf9d"
              style={styles.journalSearchInput}
            />
            {searchQuery ? (
              <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.clearSearch")} onPress={() => setSearchQuery("")}>
                <Text style={styles.journalSearchClear}>✕</Text>
              </Pressable>
            ) : null}
          </View>

          {/* ── PLANT FILTER ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.journalFilterScroll}>
            {uniquePlants.map(plant => (
              <Pressable key={plant} onPress={() => setFilterPlant(plant)}
                style={[styles.journalFilterPill, filterPlant === plant && styles.journalFilterPillActive]}>
                <Text style={[styles.journalFilterPillText, filterPlant === plant && styles.journalFilterPillTextActive]}>
                  {plant === "All" ? t("journal.allPlants") : plant}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ── STAGE FILTER ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.journalFilterScroll, { marginTop: 0 }]}>
            {uniqueStages.map(stage => (
              <Pressable key={stage} onPress={() => setFilterStage(stage)}
                style={[styles.journalFilterPill, filterStage === stage && styles.journalFilterPillActive]}>
                <Text style={[styles.journalFilterPillText, filterStage === stage && styles.journalFilterPillTextActive]}>
                  {stage === "All" ? t("journal.allStages") : growthStageLabel(stage)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ── RESULTS COUNT ── */}
          {(searchQuery || filterPlant !== "All" || filterStage !== "All") ? (
            <View style={styles.journalResultsRow}>
              <Text style={styles.journalResultsText}>{filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"} found</Text>
              <Pressable onPress={() => { setSearchQuery(""); setFilterPlant("All"); setFilterStage("All"); }}>
                <Text style={styles.journalResultsClear}>{t("journal.clearFilters")}</Text>
              </Pressable>
            </View>
          ) : null}

          {/* ── BY PLANT VIEW ── */}
          {activeTab === "plants" ? (
            <View style={{ marginTop: 16, gap: 14 }}>
              {filteredEntries.length === 0 ? (
                <View style={styles.journalNoResults}>
                  <Text style={styles.journalNoResultsEmoji}>🔍</Text>
                  <Text style={styles.journalNoResultsTitle}>{t("journal.noEntriesFound")}</Text>
                  <Text style={[styles.journalNoResultsText, { color: theme.secondaryText }]}>{t("journal.tryAdjustingYourSearchOr")}</Text>
                  <Pressable onPress={() => { setSearchQuery(""); setFilterPlant("All"); setFilterStage("All"); }} style={styles.journalNoResultsBtn}>
                    <Text style={styles.journalNoResultsBtnText}>{t("journal.clearFilters")}</Text>
                  </Pressable>
                </View>
              ) : null}
              {Array.from(new Set(filteredEntries.map(e => e.plantName || t("journal.gardenUpdate")))).map(plantName => {
                const plantEntries = filteredEntries.filter(e => (e.plantName || t("journal.gardenUpdate")) === plantName);
                return (
                  <View key={plantName} style={[styles.journalPlantGroup, { borderColor: "rgba(92, 255, 137, 0.16)" }]}>
                    <View style={styles.journalPlantGroupHeader}>
                      <Text style={styles.journalPlantGroupName}>{plantName}</Text>
                      <View style={styles.journalPlantGroupBadge}>
                        <Text style={styles.journalPlantGroupBadgeText}>{plantEntries.length} photo{plantEntries.length === 1 ? "" : "s"}</Text>
                      </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 8 }}>
                      {plantEntries.map(entry => (
                        <Pressable key={entry.id} onPress={() => { setActiveTab("timeline"); setExpandedEntry(entry.id); }}
                          style={styles.journalPlantThumb}>
                          {entry.imageUri ? (
                            <Image source={{ uri: entry.imageUri }} style={styles.journalPlantThumbImage} resizeMode="cover" />
                          ) : (
                            <View style={[styles.journalPlantThumbImage, { backgroundColor: "rgba(92, 255, 137, 0.1)", alignItems: "center", justifyContent: "center" }]}>
                              <Text style={{ fontSize: 24 }}>🌱</Text>
                            </View>
                          )}
                          <View style={[styles.journalPlantThumbStage, { backgroundColor: getStageColor(entry.growthStage) + "33" }]}>
                            <Text style={[styles.journalPlantThumbStageText, { color: getStageColor(entry.growthStage) }]}>
                              {growthStageLabel(entry.growthStage || "Seedling").split(" ")[0]}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                );
              })}
            </View>
          ) : (
            // ── TIMELINE VIEW ──
            <>
              {Object.values(groupedEntries).map(({ label, entries }) => (
                <View key={label} style={styles.journalMonthGroup}>
                  <View style={styles.journalMonthHeader}>
                    <View style={styles.journalMonthLine} />
                    <View style={styles.journalMonthBadge}>
                      <Text style={styles.journalMonthText}>{label}</Text>
                    </View>
                    <View style={styles.journalMonthLine} />
                  </View>

                  {entries.map((entry) => {
                    const caption = localCaptions[entry.id] || entry.caption;
                    const growthProgress = getGrowthProgress(entry.growthStage);
                    const stageColor = getStageColor(entry.growthStage);
                    const isExpanded = expandedEntry === entry.id;
                    const isEditingThis = editingCaption === entry.id;
                    const showingSuggestions = showCaptionSuggestions === entry.id;
                    const suggestions = getSmartCaptions(entry);

                    return (
                      <View key={entry.id} style={styles.journalEntryWrapV2}>
                        <View style={styles.journalTimelineDotV2} />
                        <View style={styles.journalTimelineLineV2} />

                        <Pressable
                          onPress={() => setExpandedEntry(isExpanded ? null : entry.id)}
                          style={[styles.journalEntryCardV2, {
                            backgroundColor: theme.input,
                            borderColor: isExpanded ? stageColor + "60" : theme.border,
                            borderWidth: isExpanded ? 1.5 : 1,
                          }]}
                        >
                          {/* PHOTO */}
                          {entry.imageUri ? (
                            <Image source={{ uri: entry.imageUri }}
                              style={[styles.journalEntryImageV2, isExpanded && styles.journalEntryImageExpanded]}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={styles.journalEntryPlaceholderV2}>
                              <Text style={styles.journalEntryPlaceholderEmoji}>🌱</Text>
                            </View>
                          )}

                          {/* ACTION BUTTONS OVERLAY */}
                          <View style={styles.journalEntryActionRow}>
                            <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.deleteEntry")} onPress={() => onDeleteEntry(entry.id)} style={styles.journalEntryActionBtn}>
                              <Text style={styles.journalEntryActionBtnText}>✕</Text>
                            </Pressable>
                            {entry.imageUri ? (
                              <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.sharePhoto")} onPress={() => sharePhoto(entry.imageUri)} style={[styles.journalEntryActionBtn, { backgroundColor: "rgba(92, 255, 137, 0.85)" }]}>
                                <Text style={[styles.journalEntryActionBtnText, { color: "#07120b" }]}>⬆</Text>
                              </Pressable>
                            ) : null}
                          </View>

                          {/* MOOD + WEATHER OVERLAY */}
                          <View style={styles.journalEntryOverlayRow}>
                            <View style={styles.journalMoodOverlay}>
                              <Text style={styles.journalMoodOverlayText}>{entry.mood || t("journal.growing")}</Text>
                            </View>
                            {entry.weather ? (
                              <View style={[styles.journalMoodOverlay, { right: 10, left: "auto" }]}>
                                <Text style={styles.journalMoodOverlayText}>{entry.weather}</Text>
                              </View>
                            ) : null}
                          </View>

                          {/* CONTENT */}
                          <View style={styles.journalEntryContentV2}>

                            {/* HEADER */}
                            <View style={styles.journalEntryHeaderV2}>
                              <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={[styles.journalEntryTitleV2, { color: theme.text }]}>
                                  {entry.plantName || t("journal.gardenUpdate")}
                                </Text>
                                <Text style={[styles.journalEntryDateV2, { color: theme.secondaryText }]}>
                                  {formatDate(new Date(entry.createdAt), {
  weekday: "short",
  month: "short",
  day: "numeric"
})}
                                  {t("journal.day")}{entry.daysSincePlanting || 1}
                                </Text>
                              </View>
                              <View style={[styles.journalStageChip, { backgroundColor: stageColor + "22", borderColor: stageColor + "55" }]}>
                                <Text style={[styles.journalStageChipText, { color: stageColor }]}>
                                  {growthStageLabel(entry.growthStage || "Seedling")}
                                </Text>
                              </View>
                            </View>

                            {/* GROWTH PROGRESS BAR */}
                            <View style={styles.journalGrowthRow}>
                              <Text style={[styles.journalGrowthLabel, { color: stageColor }]}>{t("journal.growthProgress")}</Text>
                              <Text style={[styles.journalDayBadge, { color: theme.secondaryText }]}>{Math.round(growthProgress * 100)}%</Text>
                            </View>
                            <View style={styles.journalProgressTrack}>
                              <View style={[styles.journalProgressFill, { width: `${growthProgress * 100}%`, backgroundColor: stageColor }]} />
                            </View>
                            <View style={styles.journalProgressLabels}>
                              {["🌱", "🌿", "🌸", "🍅", "🎉"].map((emoji, i) => (
                                <Text key={i} style={[styles.journalProgressEmoji, { opacity: growthProgress >= (i + 1) / 5 ? 1 : 0.25 }]}>{emoji}</Text>
                              ))}
                            </View>

                            {/* CAPTION AREA */}
                            {isExpanded ? (
                              <>
                                {isEditingThis ? (
                                  <View style={styles.journalCaptionEditWrap}>
                                    <TextInput
                                      value={captionDraft}
                                      onChangeText={setCaptionDraft}
                                      placeholder={t("journal.writeACaption")}
                                      placeholderTextColor="#8fbf9d"
                                      multiline
                                      style={styles.journalCaptionInput}
                                      autoFocus
                                    />
                                    {/* AI CAPTION SUGGESTIONS */}
                                    <Pressable
                                      onPress={() => setShowCaptionSuggestions(showingSuggestions ? null : entry.id)}
                                      style={styles.journalSuggestButton}
                                    >
                                      <IconText label={t("journal.smartCaptionIdeas")} style={styles.journalSuggestButtonText} />
                                    </Pressable>
                                    {showingSuggestions ? (
                                      <View style={styles.journalSuggestionsBox}>
                                        <Text style={styles.journalSuggestionsTitle}>💡 {t("journal.suggestionsFor", { stage: growthStageLabel(entry.growthStage || "Seedling") })}</Text>
                                        {suggestions.map((s, i) => (
                                          <Pressable key={i} onPress={() => { setCaptionDraft(s); setShowCaptionSuggestions(null); }}
                                            style={styles.journalSuggestionPill}>
                                            <Text style={styles.journalSuggestionText}>{s}</Text>
                                          </Pressable>
                                        ))}
                                      </View>
                                    ) : null}
                                    <View style={styles.journalCaptionButtonRow}>
                                      <Pressable onPress={() => saveCaption(entry.id)} style={styles.journalCaptionSaveBtn}>
                                        <Text style={styles.journalCaptionSaveBtnText}>{t("journal.saveCaption")}</Text>
                                      </Pressable>
                                      <Pressable onPress={() => setEditingCaption(null)} style={styles.journalCaptionCancelBtn}>
                                        <Text style={styles.journalCaptionCancelBtnText}>Cancel</Text>
                                      </Pressable>
                                    </View>
                                  </View>
                                ) : (
                                  <Pressable onPress={() => { setEditingCaption(entry.id); setCaptionDraft(caption || ""); }}
                                    style={styles.journalCaptionWrap}>
                                    <Text style={[styles.journalCaptionText, { color: caption ? theme.text : theme.secondaryText }]}>
                                      {caption || t("journal.tapToAddACaption")}
                                    </Text>
                                    {!caption ? (
                                      <Pressable onPress={() => { setEditingCaption(entry.id); setShowCaptionSuggestions(entry.id); setCaptionDraft(""); }}
                                        style={styles.journalSuggestButton}>
                                        <IconText label={t("journal.getSmartCaptionIdeas")} style={styles.journalSuggestButtonText} />
                                      </Pressable>
                                    ) : null}
                                  </Pressable>
                                )}

                                {/* EXPANDED DETAILS */}
                                <View style={styles.journalExpandedDetails}>
                                  <View style={styles.journalDetailChip}>
                                    <Text style={styles.journalDetailChipText}>📅 {formatDate(new Date(entry.createdAt), {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
})}</Text>
                                  </View>
                                  <View style={styles.journalDetailChip}>
                                    <Text style={styles.journalDetailChipText}>{t("journal.day2")} {entry.daysSincePlanting || 1} {t("journal.sincePlanting")}</Text>
                                  </View>
                                  {entry.mood ? (
                                    <View style={styles.journalDetailChip}>
                                      <Text style={styles.journalDetailChipText}>{entry.mood}</Text>
                                    </View>
                                  ) : null}
                                  <View style={[styles.journalDetailChip, { backgroundColor: stageColor + "18", borderColor: stageColor + "40" }]}>
                                    <Text style={[styles.journalDetailChipText, { color: stageColor }]}>🌿 {t("journal.stageLabelText", { stage: growthStageLabel(entry.growthStage || "Seedling") })}</Text>
                                  </View>
                                </View>
                              </>
                            ) : (
                              <Text style={[styles.journalCaptionPreview, { color: theme.secondaryText }]} numberOfLines={2}>
                                {caption || t("journal.tapToExpandAddCaption")}
                              </Text>
                            )}

                            <Text style={[styles.journalExpandHint, { color: stageColor }]}>
                              {isExpanded ? t("journal.collapse") : t("journal.tapToExpand")}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              ))}

              {filteredEntries.length === 0 && journalEntries.length > 0 ? (
                <View style={styles.journalNoResults}>
                  <Text style={styles.journalNoResultsEmoji}>🔍</Text>
                  <Text style={styles.journalNoResultsTitle}>{t("journal.noEntriesFound")}</Text>
                  <Text style={[styles.journalNoResultsText, { color: theme.secondaryText }]}>{t("journal.tryAdjustingYourSearchOr2")}</Text>
                  <Pressable onPress={() => { setSearchQuery(""); setFilterPlant("All"); setFilterStage("All"); }} style={styles.journalNoResultsBtn}>
                    <Text style={styles.journalNoResultsBtnText}>{t("journal.clearFilters")}</Text>
                  </Pressable>
                </View>
              ) : null}
            </>
          )}
        </>
      )}
    </View>
  );
})
