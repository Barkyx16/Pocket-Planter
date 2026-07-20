import { memo, useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export const GrowthTimelapseCard = memo(function GrowthTimelapseCard({ theme, journalEntries }) {
  // Group photos by plant, keep only plants with 2+ dated photos, oldest → newest.
  const groups = {};
  (journalEntries || []).forEach((e) => {
    if (!e.imageUri || !e.plantName || e.plantName === "Garden") return;
    (groups[e.plantName] = groups[e.plantName] || []).push(e);
  });
  const playable = Object.entries(groups)
    .map(([name, entries]) => [name, entries.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))])
    .filter(([, entries]) => entries.length >= 2);

  const [selected, setSelected] = useState(playable[0]?.[0] || "");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  const frames = (playable.find(([n]) => n === selected) || [])[1] || [];

  useEffect(() => { setIndex(0); setPlaying(false); }, [selected]);

  useEffect(() => {
    if (!playing || frames.length < 2) return;
    timer.current = setInterval(() => {
      setIndex((i) => {
        if (i >= frames.length - 1) { setPlaying(false); return i; }
        return i + 1;
      });
    }, 800);
    return () => clearInterval(timer.current);
  }, [playing, frames.length]);

  if (!playable.length) {
    return (
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Add 2 or more dated photos of the same plant (from its plant page) and you'll be able to play back its growth here.
      </Text>
    );
  }

  const frame = frames[Math.min(index, frames.length - 1)];

  return (
    <View>
      {/* PLANT PICKER */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
        {playable.map(([name, entries]) => {
          const active = selected === name;
          return (
            <Pressable key={name} onPress={() => setSelected(name)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: active ? "#5cff89" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12.5, fontWeight: "900" }}>{name} · {entries.length}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* FRAME */}
      {frame ? (
        <View style={{ marginTop: 12, borderRadius: 18, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
          <Image source={{ uri: frame.imageUri }} style={{ width: "100%", height: 240 }} resizeMode="cover" />
          <View style={{ padding: 12 }}>
            <Text style={{ color: theme.text, fontSize: 13.5, fontWeight: "800" }}>
              {frame.growthStage || "Growing"} · {new Date(frame.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </Text>
            {/* progress dots */}
            <View style={{ flexDirection: "row", gap: 4, marginTop: 10 }}>
              {frames.map((_, i) => (
                <Pressable key={i} onPress={() => { setPlaying(false); setIndex(i); }} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i <= index ? "#5cff89" : "rgba(255,255,255,0.12)" }} />
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {/* CONTROLS */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <Pressable onPress={() => { setPlaying(false); setIndex((i) => Math.max(0, i - 1)); }} style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>‹</Text>
        </Pressable>
        <Pressable
          onPress={() => { if (index >= frames.length - 1) setIndex(0); setPlaying((p) => !p); }}
          style={{ flex: 1, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
        >
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>{playing ? "⏸ Pause" : "▶ Play growth"}</Text>
        </Pressable>
        <Pressable onPress={() => { setPlaying(false); setIndex((i) => Math.min(frames.length - 1, i + 1)); }} style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>›</Text>
        </Pressable>
      </View>
    </View>
  );
})
