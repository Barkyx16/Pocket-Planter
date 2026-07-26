import { memo, useState } from "react";
import { Image, Pressable, Text, Vibration, View } from "react-native";
import { successHaptic } from "../core";
import { getBannerImage } from "../data/bannerImageMap";
import { formatDate, useTranslation } from "../lib/i18n";

const fmtDate = (iso) => {
  if (!iso) return null;
  try { return formatDate(new Date(iso), {
  month: "short",
  day: "numeric",
  year: "numeric"
}); }
  catch (e) { return null; }
};

export const ProfileBannersCard = memo(function ProfileBannersCard({ theme, profileBanners, earnedDates, activeBannerId, setActiveBannerId }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(3);

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

  // Collection view: only show banners the gardener has actually earned.
  const unlockedBanners = profileBanners.filter((b) => b.unlocked);
  const unlockedCount = unlockedBanners.length;
  const activeBanner = profileBanners.find((b) => b.id === activeBannerId);

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {unlockedCount === 0
          ? t("profileBanners.noBannersYetKeepGrowing")
          : `${unlockedCount} of ${profileBanners.length} banners earned · tap one to display it above your profile.`}
      </Text>

      {unlockedBanners.length === 0 ? (
        <View style={{ alignItems: "center", paddingVertical: 22 }}>
          <Text style={{ fontSize: 34 }}>🎏</Text>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900", marginTop: 8 }}>{t("profileBanners.noBannersYet")}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 18, textAlign: "center", marginTop: 4 }}>
            {t("profileBanners.levelUpSavePlantsLog")}
          </Text>
        </View>
      ) : (
        <>
          <View style={{ gap: 8, marginTop: 14 }}>
            {unlockedBanners.slice(0, visible).map((banner) => {
              const date = fmtDate(earnedDates?.[banner.id]);
              const isActive = activeBannerId === banner.id;
              const accent = banner.gradient?.[0] || "#8effab";
              const img = getBannerImage(banner.id);
              return (
                <Pressable
                  key={banner.id}
                  onPress={() => handleBannerTap(banner)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={`${banner.title} banner${isActive ? t("profileBanners.active") : t("profileBanners.tapToSetActive")}`}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: isActive ? accent + "18" : "rgba(255, 255, 255, 0.04)", borderRadius: 16, borderWidth: isActive ? 2 : 1, borderColor: isActive ? accent : accent + "40" }}
                >
                  <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: accent + "22", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: accent + "55", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 46, height: 46 }} resizeMode="cover" /> : <Text style={{ fontSize: 24 }}>{banner.emoji}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>{banner.title}</Text>
                    <Text numberOfLines={2} style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", lineHeight: 16, marginTop: 2 }}>
                      {banner.subtitle}
                    </Text>
                    <Text style={{ color: accent, fontSize: 10, fontWeight: "800", marginTop: 4 }}>
                      {t("profileBanners.earned")}{date ? ` ${date}` : ""}
                    </Text>
                  </View>
                  {isActive ? (
                    <View style={{ backgroundColor: accent, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
                      <Text style={{ color: "#07120b", fontSize: 10, fontWeight: "900" }}>{t("profileBanners.active2")}</Text>
                    </View>
                  ) : (
                    <Text style={{ color: accent, fontSize: 12, fontWeight: "900" }}>{t("profileBanners.set")}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          {unlockedBanners.length > visible ? (
            <Pressable
              onPress={() => setVisible((c) => c + 3)}
              style={{ marginTop: 12, backgroundColor: "rgba(107, 199, 255, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.24)" }}
            >
              <Text style={{ color: "#6bc7ff", fontWeight: "900", fontSize: 14 }}>{t("profileBanners.showMoreBanners")}{unlockedBanners.length - visible} {t("profileBanners.more")}</Text>
            </Pressable>
          ) : null}

          {activeBanner ? (
            <Pressable onPress={() => setActiveBannerId(null)} style={{ marginTop: 10, alignItems: "center", paddingVertical: 8 }}>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800" }}>{t("profileBanners.removeActiveBanner")}</Text>
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
})
