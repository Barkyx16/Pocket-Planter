import { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// ── Wallpaper ────────────────────────────────────────────────────────────────
// Full-screen backdrop image behind the whole app. The art is a dark-soil
// flat-lay framed by greenery: the near-black center keeps content legible while
// the leafy border shows through the gutters between cards. Because the cards
// are ~92% opaque we can show it boldly in dark mode; light mode keeps it faint
// (the image is dark, so a light theme only wants a whisper of it).
//
// Swap the file at assets/wallpaper.png to change it. Tune with these knobs:
const wallpaperImage = require("../assets/wallpaper.png");
const WALLPAPER_OPACITY = { dark: 0.92, light: 0.12 };
// 1 = fills the whole screen edge-to-edge (cover). Values <1 shrink the image
// and leave a base-color margin, so keep it at 1 unless you want that matte look.
const WALLPAPER_SCALE = 1;
// A gentle flat wash so cards pop off the busy edges.
const CALM = { dark: "rgba(7,18,11,0.14)", light: "rgba(244,251,242,0.52)" };

export const BackgroundDecoration = memo(function BackgroundDecoration({ isDark }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base colour — also the fallback if the image ever fails to load. */}
      <LinearGradient
        colors={isDark ? ["#0e2414", "#07120b", "#07120b"] : ["#f4fbf2", "#f4fbf2", "#f4fbf2"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* The wallpaper. */}
      <Image
        source={wallpaperImage}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { opacity: isDark ? WALLPAPER_OPACITY.dark : WALLPAPER_OPACITY.light, transform: [{ scale: WALLPAPER_SCALE }] }]}
      />

      {/* Even wash to calm the greenery and let cards read as the focus. */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? CALM.dark : CALM.light }]} />

      {/* Top scrim: darkens the status-bar / hero strip so the white status text
          and top content stay legible over the leafy top edge. */}
      <LinearGradient
        colors={isDark ? ["rgba(7,18,11,0.72)", "rgba(7,18,11,0)"] : ["rgba(7,18,11,0.28)", "rgba(7,18,11,0)"]}
        locations={[0, 0.16]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Bottom scrim: settles the flower/foliage pops behind the tab bar. */}
      <LinearGradient
        colors={isDark ? ["rgba(7,18,11,0)", "rgba(7,18,11,0.45)"] : ["rgba(244,251,242,0)", "rgba(244,251,242,0.4)"]}
        locations={[0.82, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
})
