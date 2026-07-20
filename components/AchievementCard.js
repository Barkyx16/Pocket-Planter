import { memo, useState } from "react";
import { Image, Pressable, Text, Vibration, View } from "react-native";
import { styles } from "../styles";
import { ConfettiBurst } from "./ConfettiBurst";
import { getBadgeImage } from "../data/badgeImageMap";

const fmtDate = (iso) => {
  if (!iso) return null;
  try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch (e) { return null; }
};

export const AchievementCard = memo(function AchievementCard({ theme, badges, earnedDates, streakData, seenGardenGod, setSeenGardenGod }) {
  const [visible, setVisible] = useState(3);
  const [showGardenGodCelebration, setShowGardenGodCelebration] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Trophy case: only show achievements the gardener has actually earned.
  const earnedBadges = (badges || []).filter((b) => b.unlocked);
  const unlockedCount = earnedBadges.length;
  const totalCount = (badges || []).length;

  const onRowPress = (badge) => {
    if (badge.id === "garden_gnome_ultimate" && !seenGardenGod) {
      setShowGardenGodCelebration(true);
      setSeenGardenGod(true);
      Vibration.vibrate([0, 100, 80, 100, 80, 200]);
      return;
    }
    Vibration.vibrate(25);
    setSelectedBadge(badge);
  };

  return (
    <View>
      {/* GARDEN GNOME CELEBRATION */}
      {showGardenGodCelebration ? (
        <Pressable onPress={() => setShowGardenGodCelebration(false)} style={styles.gardenGodOverlay}>
          <ConfettiBurst />
          <View style={styles.gardenGodCard}>
            <Text style={styles.gardenGodEmoji}>🌟</Text>
            <Text style={styles.gardenGodEyebrow}>SECRET ACHIEVEMENT UNLOCKED</Text>
            <Text style={styles.gardenGodTitle}>The Garden Gnome</Text>
            <Text style={styles.gardenGodText}>
              You've mastered every corner of Pocket Planter. Every plant saved, every photo logged, every quest completed, every level climbed.
            </Text>
            <Text style={styles.gardenGodText2}>You are a true Garden Gnome. 🌟</Text>
            <View style={styles.gardenGodBadge}>
              <Text style={styles.gardenGodBadgeText}>🏆 One of the greatest gardeners alive!!!</Text>
            </View>
            <Text style={styles.gardenGodDismiss}>Tap anywhere to close</Text>
          </View>
        </Pressable>
      ) : null}

      {/* BADGE DETAIL — how it was earned */}
      {selectedBadge ? (
        <Pressable onPress={() => setSelectedBadge(null)} style={styles.gardenGodOverlay}>
          <View style={[styles.gardenGodCard, { alignItems: "center" }]}>
            {getBadgeImage(selectedBadge.id) ? (
              <Image source={getBadgeImage(selectedBadge.id)} style={{ width: 132, height: 132, marginBottom: 10 }} resizeMode="contain" />
            ) : (
              <Text style={{ fontSize: 64, marginBottom: 6 }}>{selectedBadge.icon}</Text>
            )}
            <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900", letterSpacing: 1, marginBottom: 6 }}>ACHIEVEMENT</Text>
            <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "900", textAlign: "center" }}>{selectedBadge.title}</Text>
            <Text style={{ color: "#d7ebdc", fontSize: 14, fontWeight: "700", textAlign: "center", lineHeight: 20, marginTop: 10 }}>{selectedBadge.text}</Text>
            {fmtDate(earnedDates?.[selectedBadge.id]) ? (
              <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900", marginTop: 12 }}>🏆 Earned {fmtDate(earnedDates[selectedBadge.id])}</Text>
            ) : null}
            <Text style={{ color: "#8fbf9d", fontSize: 12.5, fontWeight: "800", marginTop: 14 }}>Tap anywhere to close</Text>
          </View>
        </Pressable>
      ) : null}

      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {unlockedCount === 0
          ? "No achievements yet — keep growing and you'll earn badges as you go."
          : `${unlockedCount} of ${totalCount} achievements earned · 🔥 ${streakData?.count || 0} day streak`}
      </Text>

      {earnedBadges.length === 0 ? (
        <View style={styles.achievementFooter}>
          <Text style={styles.achievementAllDoneEmoji}>🏆</Text>
          <Text style={[styles.achievementAllDoneTitle, { marginTop: 8 }]}>No achievements yet</Text>
          <Text style={[styles.achievementFooterText, { color: theme.secondaryText, marginTop: 4 }]}>
            Keep growing — you'll unlock badges as you save plants, log photos, and hit streaks. Each one pops up the moment you earn it! 🌱
          </Text>
        </View>
      ) : (
        <>
          <View style={{ gap: 8, marginTop: 14 }}>
            {earnedBadges.slice(0, visible).map((badge) => {
              const date = fmtDate(earnedDates?.[badge.id]);
              const img = getBadgeImage(badge.id);
              return (
                <Pressable
                  key={badge.id}
                  onPress={() => onRowPress(badge)}
                  accessibilityRole="button"
                  accessibilityLabel={`${badge.title} — earned${date ? ` ${date}` : ""}`}
                  style={{ flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(92,255,137,0.18)" }}
                >
                  <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: "rgba(92,255,137,0.14)", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 46, height: 46 }} resizeMode="cover" /> : <Text style={{ fontSize: 24 }}>{badge.icon}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 14.5, fontWeight: "800" }}>{badge.title}</Text>
                    <Text numberOfLines={2} style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 16, marginTop: 2 }}>
                      {badge.text}
                    </Text>
                    <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "800", marginTop: 4 }}>
                      🏆 Earned{date ? ` ${date}` : ""}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {earnedBadges.length > visible ? (
            <Pressable
              onPress={() => setVisible((c) => c + 3)}
              style={{ marginTop: 12, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 16, paddingVertical: 13, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
            >
              <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>Show more badges ({earnedBadges.length - visible} more)</Text>
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
})
