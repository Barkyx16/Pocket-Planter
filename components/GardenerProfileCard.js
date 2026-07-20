import { memo } from "react";
import { Image, Text, TextInput, View } from "react-native";
import { BlurView } from "expo-blur";
import { styles } from "../styles";
import { getBannerImage } from "../data/bannerImageMap";

export const GardenerProfileCard = memo(function GardenerProfileCard({ theme, setAppearanceMode, avatarGlow, gardenXP, savedPlants, journalEntries, gardenMap, streakData, profileBanners, activeBannerId, profileName, setProfileName, profilePhoto, setProfilePhoto, selectedProfileTheme, setSelectedProfileTheme, harvestLog, wateringHistory }) {
  const unlockedBanners = profileBanners.filter((banner) => banner.unlocked);
  // Prefer the banner the gardener equipped; otherwise the most recent unlock.
  const activeBanner = profileBanners.find((b) => b.id === activeBannerId && b.unlocked) || unlockedBanners[unlockedBanners.length - 1] || profileBanners[0];
  const activeBannerImg = activeBanner ? getBannerImage(activeBanner.id) : null;
  const nextBanner = profileBanners.find((banner) => !banner.unlocked);
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const harvestCount = (harvestLog || []).length;
  const wateringTotal = Object.values(wateringHistory || {}).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const xpToNext = Math.max(0, (gardenXP.nextLevelXP || 0) - (gardenXP.currentLevelXP || 0));
  const stats = [
    { value: savedPlants.length, label: "Saved", color: "#5cff89" },
    { value: journalEntries.length, label: "Photos", color: "#6bc7ff" },
    { value: harvestCount, label: "Harvests", color: "#ffd86b" },
    { value: wateringTotal, label: "Waterings", color: "#6bc7ff" },
    { value: gardenPlotCount, label: "Plots", color: "#8effab" },
    { value: streakData?.count || 0, label: "Day Streak", color: "#ff9f43" },
  ];
return (
    <View>
      {activeBannerImg ? (
        <Image source={activeBannerImg} style={{ width: "100%", height: 120, borderRadius: 18, marginBottom: 8 }} resizeMode="contain" />
      ) : (
        <View style={styles.profileBanner}>
          <Text style={styles.profileBannerEmoji}>{activeBanner?.emoji || "🌱"}</Text>
          <Text style={styles.profileBannerTitle}>{activeBanner?.title || "Seedling Starter"}</Text>
        </View>
      )}
      <TextInput value={profileName} onChangeText={setProfileName} placeholder="Enter profile name" placeholderTextColor="#8fbf9d" style={[styles.profileNameInput, { marginTop: 4 }]} />

      <Text style={styles.profileRank}>Level {gardenXP.level} • {gardenXP.title}</Text>
      <Text style={styles.profileXP}>{gardenXP.xp} total XP earned</Text>

      {/* XP PROGRESS */}
      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ color: theme.text, fontWeight: "800", fontSize: 13 }}>Level {gardenXP.level} → {gardenXP.level + 1}</Text>
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 13 }}>{Math.round((gardenXP.progress || 0) * 100)}%</Text>
        </View>
        <View style={{ height: 10, backgroundColor: "rgba(255,255,255,0.10)", borderRadius: 20, marginTop: 6, overflow: "hidden" }}>
          <View style={{ height: 10, width: `${(gardenXP.progress || 0) * 100}%`, backgroundColor: "#5cff89" }} />
        </View>
        <Text style={{ color: theme.secondaryText, marginTop: 6, fontSize: 12, fontWeight: "700" }}>
          {gardenXP.currentLevelXP} / {gardenXP.nextLevelXP} XP · {xpToNext} to next level
        </Text>
      </View>

      {/* STATS GRID */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
        {stats.map((s) => (
          <View key={s.label} style={{ width: "31.5%", flexGrow: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(142,255,171,0.14)" }}>
            <Text style={{ color: s.color, fontSize: 20, fontWeight: "900" }}>{s.value}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 10.5, fontWeight: "800", marginTop: 3 }}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* NEXT BADGE TEASER */}
      {nextBanner ? (
        <View style={{ marginTop: 14, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "rgba(255,216,107,0.08)", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "rgba(255,216,107,0.22)" }}>
          <View style={{ width: 54, height: 54, borderRadius: 12, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,216,107,0.14)" }}>
            {getBannerImage(nextBanner.id) ? (
              <>
                <Image source={getBannerImage(nextBanner.id)} style={{ width: 54, height: 54 }} resizeMode="cover" />
                <BlurView intensity={32} tint="dark" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 16 }}>🔒</Text>
                </BlurView>
              </>
            ) : (
              <Text style={{ fontSize: 24 }}>{nextBanner.emoji}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#ffd86b", fontSize: 10.5, fontWeight: "900", letterSpacing: 0.5 }}>🎯 NEXT BADGE TO EARN</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800", marginTop: 2 }}>{nextBanner.title}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 11.5, fontWeight: "600", marginTop: 1 }}>{nextBanner.subtitle}</Text>
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 14, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)", alignItems: "center" }}>
          <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800" }}>🏆 Every badge unlocked — you're legendary!</Text>
        </View>
      )}
    </View>
  );
})
