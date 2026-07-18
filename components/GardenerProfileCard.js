import { useState } from "react";
import { Alert, Animated, Image, Pressable, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../styles";

export function GardenerProfileCard({ theme, setAppearanceMode, avatarGlow, gardenXP, savedPlants, journalEntries, gardenMap, streakData, profileBanners, profileName, setProfileName, profilePhoto, setProfilePhoto, selectedProfileTheme, setSelectedProfileTheme }) {
  const unlockedBanners = profileBanners.filter((banner) => banner.unlocked);
  const activeBanner = unlockedBanners[unlockedBanners.length - 1] || profileBanners[0];
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
 const [updatingPhoto, setUpdatingPhoto] = useState(false);
  async function pickProfilePhoto() {
    if (updatingPhoto) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Photos Permission Needed", "Allow photo access to choose a profile picture."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1, allowsEditing: true, aspect: [1, 1] });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    setUpdatingPhoto(true);
    setProfilePhoto(asset.uri);
    setTimeout(() => setUpdatingPhoto(false), 600);
  }
return (
    <View>
      <View style={styles.profileBanner}>
        <Text style={styles.profileBannerEmoji}>{activeBanner?.emoji || "🌱"}</Text>
        <Text style={styles.profileBannerTitle}>{activeBanner?.title || "Seedling Starter"}</Text>
      </View>
      <Animated.View style={[styles.profileAvatarGlow, { shadowColor: "#5cff89", shadowRadius: avatarGlow.interpolate({ inputRange: [0,1], outputRange: [12,28] }), shadowOpacity: avatarGlow.interpolate({ inputRange: [0,1], outputRange: [0.5,1] }), transform: [{ scale: avatarGlow.interpolate({ inputRange: [0,1], outputRange: [1,1.05] }) }] }]}>
        <Pressable disabled={updatingPhoto} style={[styles.profileAvatarCircle, { borderColor: "#5cff89", opacity: updatingPhoto ? 0.6 : 1 }]} onPress={pickProfilePhoto}>
          {updatingPhoto ? (
  <Text style={[styles.profileAvatarEmoji, { fontSize: 13, fontWeight: "900" }]}>Updating…</Text>
) : profilePhoto ? (
  <Image
    source={{ uri: profilePhoto }}
    style={styles.profilePhoto}
    defaultSource={require("../assets/welcome-buddy.png")}
    onError={() => setProfilePhoto(null)}
  />
) : (
  <Text style={styles.profileAvatarEmoji}>🧑‍🌾</Text>
)}
        </Pressable>
      </Animated.View>
      <TextInput value={profileName} onChangeText={setProfileName} placeholder="Enter profile name" placeholderTextColor="#8fbf9d" style={styles.profileNameInput} />
      <View style={{ marginTop: 14 }}>
        <Text style={{ color: theme.text, fontWeight: "700" }}>XP Progress</Text>
        <View style={{ height: 10, backgroundColor: "#2a2a2a", borderRadius: 20, marginTop: 6, overflow: "hidden" }}>
          <View style={{ height: 10, width: `${gardenXP.progress * 100}%`, backgroundColor: "#5cff89" }} />
        </View>
        <Text style={{ color: theme.text, marginTop: 6, fontSize: 12 }}>{gardenXP.currentLevelXP} / {gardenXP.nextLevelXP} XP</Text>
      </View>
      {/* FIX #1: Styled theme chip selector — replaces plain text buttons */}
      <Text style={styles.profileRank}>Level {gardenXP.level} • {gardenXP.title}</Text>
      <Text style={styles.profileXP}>{gardenXP.xp} total XP</Text>
      <View style={styles.profileStatsGrid}>
        <View style={styles.profileStatBox}><Text style={styles.profileStatValue}>{savedPlants.length}</Text><Text style={styles.profileStatLabel}>Saved</Text></View>
        <View style={styles.profileStatBox}><Text style={styles.profileStatValue}>{journalEntries.length}</Text><Text style={styles.profileStatLabel}>Photos</Text></View>
        <View style={styles.profileStatBox}><Text style={styles.profileStatValue}>{gardenPlotCount}</Text><Text style={styles.profileStatLabel}>Plots</Text></View>
        <View style={styles.profileStatBox}><Text style={styles.profileStatValue}>{streakData?.count || 0}</Text><Text style={styles.profileStatLabel}>Streak</Text></View>
      </View>
    </View>
  );
}
