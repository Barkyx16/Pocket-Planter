import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, Vibration, View } from "react-native";
import { styles } from "../styles";
import { ConfettiBurst } from "./ConfettiBurst";

export function AchievementCard({ theme, badges, streakData, seenGardenGod, setSeenGardenGod }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newlyUnlockedId, setNewlyUnlockedId] = useState(null);
  const [showGardenGodCelebration, setShowGardenGodCelebration] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  const categories = ["All", ...Array.from(new Set(badges.map(b => b.category)))];
  const filteredBadges = selectedCategory === "All" ? badges : badges.filter(b => b.category === selectedCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const categoryStats = Array.from(new Set(badges.map(b => b.category))).map(cat => ({
    category: cat,
    unlocked: badges.filter(b => b.category === cat && b.unlocked).length,
    total: badges.filter(b => b.category === cat).length,
  }));

return (
    <View>

{/* GARDEN GNOME CELEBRATION */}
{showGardenGodCelebration ? (
  <Pressable
    onPress={() => setShowGardenGodCelebration(false)}
    style={styles.gardenGodOverlay}
  >
    <ConfettiBurst />
    <View style={styles.gardenGodCard}>
      <Text style={styles.gardenGodEmoji}>🌟</Text>
      <Text style={styles.gardenGodEyebrow}>SECRET ACHIEVEMENT UNLOCKED</Text>
      <Text style={styles.gardenGodTitle}>The Garden Gnome</Text>
      <Text style={styles.gardenGodText}>
        You've mastered every corner of Pocket Planter. Every plant saved, every photo logged, every quest completed, every level climbed.
      </Text>
      <Text style={styles.gardenGodText2}>
        You are a true Garden Gnome. 🌟
      </Text>
      <View style={styles.gardenGodBadge}>
        <Text style={styles.gardenGodBadgeText}>🏆 One of the greatest gardeners alive!!!</Text>
      </View>
      <Text style={styles.gardenGodDismiss}>Tap anywhere to close</Text>
    </View>
  </Pressable>
) : null}

{/* OVERALL PROGRESS */}
      <View style={styles.achievementOverallProgress}>
        <View style={styles.achievementOverallLeft}>
          <Text style={styles.achievementOverallValue}>{unlockedCount}/{totalCount}</Text>
          <Text style={[styles.achievementOverallLabel, { color: theme.secondaryText }]}>Achieved</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.achievementOverallTrack}>
            <View style={[styles.achievementOverallFill, { width: `${completionPercent}%` }]} />
          </View>
          <Text style={styles.achievementOverallPercent}>{completionPercent}% complete</Text>
        </View>
        <Text style={styles.achievementStreakBadge}>🔥 {streakData?.count || 0} day streak</Text>
      </View>

      {/* CATEGORY STATS ROW */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementCategoryStatsScroll}>
        {categoryStats.map((cat, i) => (
          <Pressable
            key={i}
            onPress={() => setSelectedCategory(selectedCategory === cat.category ? "All" : cat.category)}
            style={[styles.achievementCategoryStatTile, {
              borderColor: selectedCategory === cat.category ? "#5cff89" : "rgba(255,255,255,0.08)",
              backgroundColor: selectedCategory === cat.category ? "rgba(92,255,137,0.12)" : "rgba(255,255,255,0.05)",
            }]}
          >
            <Text style={styles.achievementCategoryStatIcon}>{cat.category.split(" ")[0]}</Text>
            <Text style={[styles.achievementCategoryStatValue, { color: cat.unlocked === cat.total ? "#5cff89" : "#ffffff" }]}>
              {cat.unlocked}/{cat.total}
            </Text>
            <Text style={[styles.achievementCategoryStatLabel, { color: theme.secondaryText }]}>
              {cat.category.split(" ").slice(1).join(" ")}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* FILTER TABS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementFilterScroll}>
        {categories.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.achievementFilterPill, selectedCategory === cat && styles.achievementFilterPillActive]}
          >
            <Text style={[styles.achievementFilterPillText, selectedCategory === cat && styles.achievementFilterPillTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ACHIEVEMENT GRID */}
      <View style={styles.achievementCompactGrid}>
        {filteredBadges.map((badge) => (
          <Pressable
            key={badge.id}
            onPress={() => {
  if (badge.unlocked) {
    if (badge.id === "garden_gnome_ultimate") {
      if (!seenGardenGod) {
        setShowGardenGodCelebration(true);
        setSeenGardenGod(true);
        Vibration.vibrate([0, 100, 80, 100, 80, 200]);
      } else {
        setNewlyUnlockedId(badge.id === newlyUnlockedId ? null : badge.id);
        Vibration.vibrate(40);
      }
    } else {
      setNewlyUnlockedId(badge.id === newlyUnlockedId ? null : badge.id);
      Vibration.vibrate(40);
    }
  }
}}
            style={[
              styles.achievementCompactCard,
              badge.unlocked && styles.achievementCompactCardUnlocked,
              badge.id === newlyUnlockedId && { borderColor: "#ffd86b", borderWidth: 2 },
            ]}
          >
            {/* GLOW FOR UNLOCKED */}
            {badge.unlocked ? (
              <Animated.View style={[styles.achievementGlowOrb, { opacity: glowOpacity, backgroundColor: "#5cff89" }]} />
            ) : null}

            {/* ICON */}
            <View style={[styles.achievementIconWrap, {
              backgroundColor: badge.unlocked ? "rgba(92,255,137,0.18)" : "rgba(255,255,255,0.06)",
            }]}>
              <Text style={styles.achievementCompactIcon}>{badge.icon}</Text>
              {!badge.unlocked ? (
                <View style={styles.achievementLockOverlay}>
                  <Text style={styles.achievementLockIcon}>🔒</Text>
                </View>
              ) : null}
            </View>

            {/* TITLE */}
            <Text style={[styles.achievementCompactTitle, { color: badge.unlocked ? "#ffffff" : "#8fbf9d" }]} numberOfLines={2}>
              {badge.title}
            </Text>

            {/* TEXT */}
            <Text style={styles.achievementCompactText} numberOfLines={2}>
              {badge.text}
            </Text>

            {/* PROGRESS BAR */}
            {badge.goal ? (
              <View style={styles.achievementProgressTrack}>
                <View style={[styles.achievementProgressFill, {
                  width: `${Math.min(((badge.progress || 0) / badge.goal) * 100, 100)}%`,
                  backgroundColor: badge.unlocked ? "#5cff89" : "rgba(255,255,255,0.25)",
                }]} />
              </View>
            ) : null}

            {/* PROGRESS FRACTION */}
            {badge.goal ? (
              <Text style={[styles.achievementProgressFraction, { color: badge.unlocked ? "#5cff89" : theme.secondaryText }]}>
                {badge.progress}/{badge.goal}
              </Text>
            ) : null}

            {/* UNLOCKED CHECK */}
            {badge.unlocked ? (
              <View style={styles.achievementCompactCheck}>
                <Text style={styles.achievementCompactCheckText}>✓</Text>
              </View>
            ) : null}

            {/* SELECTED GLOW RING */}
            {badge.id === newlyUnlockedId ? (
              <View style={styles.achievementSelectedRing} />
            ) : null}
          </Pressable>
        ))}
      </View>

      {/* COMPLETION MESSAGE */}
      {unlockedCount === totalCount ? (
        <View style={styles.achievementAllDoneBox}>
          <Text style={styles.achievementAllDoneEmoji}>🌟</Text>
          <Text style={styles.achievementAllDoneTitle}>All Achievements Unlocked!</Text>
          <Text style={[styles.achievementAllDoneText, { color: theme.secondaryText }]}>
            You're a true Garden Master. Incredible work! 🏆
          </Text>
        </View>
      ) : (
        <View style={styles.achievementFooter}>
          <Text style={[styles.achievementFooterText, { color: theme.secondaryText }]}>
            {totalCount - unlockedCount} achievement{totalCount - unlockedCount === 1 ? "" : "s"} remaining — keep growing! 🌱
          </Text>
        </View>
      )}
    </View>
  );
}
