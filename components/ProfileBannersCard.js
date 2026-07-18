import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, Vibration, View } from "react-native";
import { styles } from "../styles";
import { successHaptic } from "../core";

export function ProfileBannersCard({ theme, profileBanners, gardenXP, savedPlants, journalEntries, gardenMap, wateredPlants, streakData, harvestTrackers, careLog, premiumUnlocked, activeBannerId, setActiveBannerId }) {
  const [newlyUnlocked, setNewlyUnlocked] = useState(null);
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  const getBannerProgress = (banner) => {
  if (banner.unlocked) return 1;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const totalWatered = Object.values(wateredPlants || {}).filter(Boolean).length;
  const streakCount = streakData?.count || 0;
  switch (banner.id) {
    case "seedling_banner": return Math.min(gardenXP.level / 1, 1);
    case "green_thumb_banner": return Math.min(gardenXP.level / 5, 1);
    case "harvest_banner": return Math.min(gardenXP.level / 8, 1);
    case "master_banner": return Math.min(gardenXP.level / 20, 1);
    case "collector_banner": return Math.min(savedPlants.length / 10, 1);
    case "journal_banner": return Math.min(journalEntries.length / 10, 1);
    case "planner_banner": return Math.min(gardenPlotCount / 12, 1);
    case "streak_banner": return Math.min(streakCount / 7, 1);
    case "obsessed_banner": return Math.min(streakCount / 30, 1);
    case "water_wizard_banner": return Math.min(totalWatered / 50, 1);
    case "master_waterer_banner": return Math.min(totalWatered / 100, 1);
    case "soil_scientist_banner": return Math.min((careLog || []).length / 10, 1);
    case "care_expert_banner": return Math.min((careLog || []).length / 25, 1);
    case "snapshot_banner": return Math.min(journalEntries.length / 5, 1);
    case "garden_historian_banner": return Math.min(journalEntries.length / 25, 1);
    case "zone_master_banner": return Math.min(savedPlants.length / 15, 1);
    case "legendary_grower_banner": return Math.min(gardenXP.level / 15, 1);
    case "full_garden_banner": return Math.min(gardenPlotCount / 12, 1);
    case "harvest_king_banner": return Math.min(Object.keys(harvestTrackers || {}).length / 5, 1);
    case "companion_pro_banner": return premiumUnlocked ? 1 : 0;
    case "quest_crusher_banner": return Math.min(gardenXP.xp / 500, 1);
    default: return 0;
  }
};
  const getBannerProgressLabel = (banner) => {
  if (banner.unlocked) return "Unlocked ✓";
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const totalWatered = Object.values(wateredPlants || {}).filter(Boolean).length;
  const streakCount = streakData?.count || 0;
  switch (banner.id) {
    case "seedling_banner": return `Level ${gardenXP.level}/1`;
    case "green_thumb_banner": return `Level ${gardenXP.level}/5`;
    case "harvest_banner": return `Level ${gardenXP.level}/8`;
    case "master_banner": return `Level ${gardenXP.level}/20`;
    case "collector_banner": return `${savedPlants.length}/10 plants saved`;
    case "journal_banner": return `${journalEntries.length}/10 photos`;
    case "planner_banner": return `${gardenPlotCount}/12 plots filled`;
    case "streak_banner": return `${streakCount}/7 day streak`;
    case "obsessed_banner": return `${streakCount}/30 day streak`;
    case "water_wizard_banner": return `${totalWatered}/50 plants watered`;
    case "master_waterer_banner": return `${totalWatered}/100 plants watered`;
    case "soil_scientist_banner": return `${(careLog || []).length}/10 care actions`;
    case "care_expert_banner": return `${(careLog || []).length}/25 care actions`;
    case "snapshot_banner": return `${journalEntries.length}/5 photos`;
    case "garden_historian_banner": return `${journalEntries.length}/25 photos`;
    case "zone_master_banner": return `${savedPlants.length}/15 plants saved`;
    case "legendary_grower_banner": return `Level ${gardenXP.level}/15`;
    case "full_garden_banner": return `${gardenPlotCount}/12 plots filled`;
    case "harvest_king_banner": return `${Object.keys(harvestTrackers || {}).length}/5 harvests tracked`;
    case "companion_pro_banner": return premiumUnlocked ? "Unlocked ✓" : "Unlock Premium first";
    case "quest_crusher_banner": return `${gardenXP.xp}/500 XP earned`;
    default: return banner.subtitle;
  }
};

  const handleBannerTap = (banner) => {
    if (!banner.unlocked) return;
    if (activeBannerId === banner.id) {
      setActiveBannerId(null);
    } else {
      setActiveBannerId(banner.id);
      Vibration.vibrate(60);
      successHaptic();
    }
  };

  const activeBanner = profileBanners.find(b => b.id === activeBannerId) || profileBanners.find(b => b.unlocked);
  const unlockedCount = profileBanners.filter(b => b.unlocked).length;

return (
    <View>

      {/* PROGRESS SUMMARY */}
      <View style={styles.bannerProgressSummary}>
        <View style={styles.bannerProgressSummaryLeft}>
          <Text style={styles.bannerProgressSummaryValue}>{unlockedCount}/{profileBanners.length}</Text>
          <Text style={[styles.bannerProgressSummaryLabel, { color: theme.secondaryText }]}>Banners Unlocked</Text>
        </View>
        <View style={styles.bannerProgressSummaryTrack}>
          <View style={[styles.bannerProgressSummaryFill, { width: `${(unlockedCount / profileBanners.length) * 100}%` }]} />
        </View>
      </View>

      {/* ACTIVE BANNER PREVIEW */}
      {activeBanner ? (
        <View style={[styles.bannerActivePreview, { backgroundColor: activeBanner.gradient[0] + "22", borderColor: activeBanner.gradient[0] + "55" }]}>
          <Animated.View style={{ opacity: glowOpacity }}>
            <Text style={styles.bannerActiveEmoji}>{activeBanner.emoji}</Text>
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerActiveLabel}>Active Banner</Text>
            <Text style={[styles.bannerActiveName, { color: activeBanner.gradient[0] }]}>{activeBanner.title}</Text>
            <Text style={[styles.bannerActiveSubtitle, { color: theme.secondaryText }]}>{activeBanner.subtitle}</Text>
          </View>
          {activeBannerId ? (
            <View style={[styles.bannerActiveCheckBadge, { backgroundColor: activeBanner.gradient[0] }]}>
              <Text style={styles.bannerActiveCheckText}>✓ Active</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* HORIZONTAL SCROLL CARDS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bannerScrollContent}
      >
        {profileBanners.map((banner) => {
          const progress = getBannerProgress(banner);
          const progressLabel = getBannerProgressLabel(banner);
          const isActive = activeBannerId === banner.id;
          const isLocked = !banner.unlocked;

          return (
            <Pressable
              key={banner.id}
              onPress={() => handleBannerTap(banner)}
              style={[
                styles.bannerScrollCard,
                {
                  borderColor: isActive
                    ? banner.gradient[0]
                    : banner.unlocked
                    ? banner.gradient[0] + "55"
                    : "rgba(255,255,255,0.08)",
                  borderWidth: isActive ? 2.5 : 1,
                  opacity: isLocked ? 0.75 : 1,
                },
              ]}
            >
              {/* GRADIENT HEADER */}
              <View style={[styles.bannerScrollCardHeader, { backgroundColor: banner.gradient[0] + (isLocked ? "30" : "22") }]}>
                {isLocked ? (
                  <View style={styles.bannerScrollLockWrap}>
                    <Text style={styles.bannerScrollLockIcon}>🔒</Text>
                  </View>
                ) : (
                  <Animated.View style={{ opacity: isActive ? glowOpacity : 1 }}>
                    <Text style={styles.bannerScrollEmoji}>{banner.emoji}</Text>
                  </Animated.View>
                )}
                {isActive ? (
                  <View style={[styles.bannerScrollActiveBadge, { backgroundColor: banner.gradient[0] }]}>
                    <Text style={styles.bannerScrollActiveBadgeText}>✓ Active</Text>
                  </View>
                ) : null}
                {banner.unlocked && !isActive ? (
                  <View style={styles.bannerScrollUnlockedBadge}>
                    <Text style={styles.bannerScrollUnlockedBadgeText}>Unlocked</Text>
                  </View>
                ) : null}
              </View>

              {/* CARD CONTENT */}
              <View style={styles.bannerScrollCardBody}>
                <Text style={[styles.bannerScrollCardTitle, { color: banner.unlocked ? "#ffffff" : "#8fbf9d" }]}>
                  {banner.title}
                </Text>
                <Text style={[styles.bannerScrollCardSubtitle, { color: theme.secondaryText }]}>
                  {banner.subtitle}
                </Text>

                {/* PROGRESS BAR */}
                <View style={styles.bannerScrollProgressTrack}>
                  <View style={[styles.bannerScrollProgressFill, {
                    width: `${progress * 100}%`,
                    backgroundColor: banner.unlocked ? banner.gradient[0] : "rgba(255,255,255,0.25)",
                  }]} />
                </View>
                <Text style={[styles.bannerScrollProgressLabel, { color: banner.unlocked ? banner.gradient[0] : theme.secondaryText }]}>
                  {progressLabel}
                </Text>

                {/* TAP TO EQUIP */}
                {banner.unlocked && !isActive ? (
                  <Text style={[styles.bannerScrollEquipHint, { color: banner.gradient[0] }]}>
                    Tap to set active →
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* NEXT TO UNLOCK */}
      {(() => {
        const nextBanner = profileBanners.find(b => !b.unlocked);
        if (!nextBanner) return (
          <View style={styles.bannerAllUnlockedBox}>
            <Text style={styles.bannerAllUnlockedText}>🏆 All banners unlocked — you're a Garden Master!</Text>
          </View>
        );
        const progress = getBannerProgress(nextBanner);
        const progressLabel = getBannerProgressLabel(nextBanner);
        return (
          <View style={[styles.bannerNextUnlockBox, { borderColor: nextBanner.gradient[0] + "40" }]}>
            <Text style={styles.bannerNextUnlockEyebrow}>🎯 NEXT TO UNLOCK</Text>
            <View style={styles.bannerNextUnlockRow}>
              <Text style={styles.bannerNextUnlockEmoji}>{nextBanner.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerNextUnlockTitle}>{nextBanner.title}</Text>
                <Text style={[styles.bannerNextUnlockSub, { color: theme.secondaryText }]}>{nextBanner.subtitle}</Text>
                <View style={styles.bannerNextUnlockTrack}>
                  <View style={[styles.bannerNextUnlockFill, {
                    width: `${progress * 100}%`,
                    backgroundColor: nextBanner.gradient[0],
                  }]} />
                </View>
                <Text style={[styles.bannerNextUnlockProgress, { color: nextBanner.gradient[0] }]}>{progressLabel}</Text>
              </View>
            </View>
          </View>
        );
      })()}
    </View>
  );
}
