import { memo, useState } from "react";
import { Image, Pressable, Text, Vibration, View } from "react-native";
import { styles } from "../styles";
import { ConfettiBurst } from "./ConfettiBurst";
import { getBadgeImage } from "../data/badgeImageMap";
import { IconText } from "./IconText";
import { formatDate, useTranslation } from "../lib/i18n";
import { EmptyState } from "./EmptyState";

const fmtDate = (iso) => {
  if (!iso) return null;
  try { return formatDate(new Date(iso), {
  month: "short",
  day: "numeric",
  year: "numeric"
}); }
  catch (e) { return null; }
};

export const AchievementCard = memo(function AchievementCard({ theme, badges, earnedDates, streakData, seenGardenGod, setSeenGardenGod }) {
  const { t } = useTranslation();
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
            <Text style={styles.gardenGodEyebrow}>{t("achievement.secretAchievementUnlocked")}</Text>
            <Text style={styles.gardenGodTitle}>{t("achievement.theGardenGnome")}</Text>
            <Text style={styles.gardenGodText}>
              {t("achievement.youveMasteredEveryCornerOf")}
            </Text>
            <Text style={styles.gardenGodText2}>{t("achievement.youAreATrueGarden")}</Text>
            <View style={styles.gardenGodBadge}>
              <IconText label={t("achievement.oneOfTheGreatestGardeners")} style={styles.gardenGodBadgeText} />
            </View>
            <Text style={styles.gardenGodDismiss}>{t("achievement.tapAnywhereToClose")}</Text>
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
            <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", textAlign: "center" }}>{selectedBadge.title}</Text>
            <Text style={{ color: "#d7ebdc", fontSize: 14, fontWeight: "700", textAlign: "center", lineHeight: 20, marginTop: 10 }}>{selectedBadge.text}</Text>
            {fmtDate(earnedDates?.[selectedBadge.id]) ? (
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", marginTop: 12 }}>{t("achievement.earned")} {fmtDate(earnedDates[selectedBadge.id])}</Text>
            ) : null}
            <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "800", marginTop: 14 }}>{t("achievement.tapAnywhereToClose")}</Text>
          </View>
        </Pressable>
      ) : null}

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {unlockedCount === 0
          ? t("achievement.noAchievementsYetKeepGrowing")
          : `${unlockedCount} of ${totalCount} achievements earned · 🔥 ${streakData?.count || 0} day streak`}
      </Text>

      {earnedBadges.length === 0 ? (
        <EmptyState
          icon="trophy"
          title={t("empty.noAchievementsTitle")}
          body={t("empty.noAchievementsBody")}
        />
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
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.16)" }}
                >
                  <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: "rgba(92, 255, 137, 0.16)", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 46, height: 46 }} resizeMode="cover" /> : <Text style={{ fontSize: 24 }}>{badge.icon}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{badge.title}</Text>
                    <Text numberOfLines={2} style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 16, marginTop: 2 }}>
                      {badge.text}
                    </Text>
                    <Text style={{ color: "#8effab", fontSize: 10, fontWeight: "800", marginTop: 4 }}>
                      {t("achievement.earned")}{date ? ` ${date}` : ""}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {earnedBadges.length > visible ? (
            <Pressable
              onPress={() => setVisible((c) => c + 3)}
              style={{ marginTop: 12, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
            >
              <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>{t("achievement.showMoreBadges")}{earnedBadges.length - visible} {t("achievement.more")}</Text>
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
})
