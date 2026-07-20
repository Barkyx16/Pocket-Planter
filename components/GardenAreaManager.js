import { memo } from "react";
import { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { getAreaTag } from "../core";

export const GardenAreaManager = memo(function GardenAreaManager({ theme, gardenAreas, onAddArea, onRenameArea, onDeleteArea, onSetAreaStyle }) {
  const [newAreaSize, setNewAreaSize] = useState(6);
  const [showCreator, setShowCreator] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [stylingId, setStylingId] = useState(null);

  const EMOJI_CHOICES = ["🌿", "🌻", "🪴", "🍅", "🌸", "🏡", "🌵", "🍓", "🥬", "🌽", "🌶️", "🫐"];
  const COLOR_CHOICES = ["#5cff89", "#ffd86b", "#8effab", "#ff7b7b", "#ffb6c1", "#6bc7ff", "#a3d5ff", "#ff9f43"];

  const PRESETS = ["Front Yard", "Backyard", "Balcony", "Indoors", "Raised Bed", "Herb Garden"];
  const usedNames = gardenAreas.map((a) => a.name.toLowerCase());

 return (
    <View>
      <Pressable
        onPress={() => setShowCreator((v) => !v)}
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)", marginTop: 4, marginBottom: showCreator ? 14 : 0 }}
      >
        <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>{showCreator ? "Hide Garden Maps" : "🗂️ View Garden Maps"}</Text>
        <Text style={{ color: "#5cff89", fontSize: 18, fontWeight: "900" }}>{showCreator ? "▾" : "▸"}</Text>
      </Pressable>

      {showCreator ? (
      <>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {PRESETS.filter((p) => !usedNames.includes(p.toLowerCase())).map((preset) => (
          <Pressable
            key={preset}
            onPress={() => onAddArea(preset)}
            style={{ backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
          >
            <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800" }}>+ {preset}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => onAddArea("Hanging Planter", 1)}
        style={{ alignSelf: "flex-start", marginTop: 12, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
      >
        <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800" }}>+ Hanging Planter (1 plant)</Text>
      </Pressable>

      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 18, marginBottom: 8 }}>HOW MANY PLANTS? ({newAreaSize})</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => {
          const selected = newAreaSize === n;
          return (
            <Pressable
              key={n}
              onPress={() => setNewAreaSize(n)}
              style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: selected ? "#5cff89" : "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: selected ? "#5cff89" : "rgba(255,255,255,0.12)" }}
            >
              <Text style={{ color: selected ? "#07120b" : theme.secondaryText, fontSize: 15, fontWeight: "900" }}>{n}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => { onAddArea(`Garden Bed ${gardenAreas.length + 1}`, newAreaSize); setNewAreaSize(6); Keyboard.dismiss(); }}
        style={{ marginTop: 16, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 13, alignItems: "center" }}
      >
        <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>+ Add a {newAreaSize}-plant bed</Text>
      </Pressable>
      </>
      ) : null}

      {false ? (
        <View style={{ marginTop: 16, gap: 10 }}>
          {gardenAreas.map((area) => {
            const plotCount = Object.values(area.plots || {}).filter(Boolean).length;
            const isRenaming = renamingId === area.id;
            return (
              <View key={area.id} style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 12 }}>
               {isRenaming ? (
                  <TextInput
                    value={renameDraft}
                    onChangeText={setRenameDraft}
                    placeholder="New name"
                    placeholderTextColor="#8fbf9d"
                    autoFocus
                    style={{ flex: 1, color: "#ffffff", fontSize: 15, fontWeight: "800", paddingVertical: 4 }}
                  />
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                    <View style={{ width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: `${getAreaTag(area).color}22`, borderWidth: 1, borderColor: `${getAreaTag(area).color}55` }}>
                      <Text style={{ fontSize: 20 }}>{getAreaTag(area).emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "900" }}>{area.name}</Text>
                      <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>{plotCount} plant{plotCount === 1 ? "" : "s"}</Text>
                    </View>
                  </View>
                )}

                {isRenaming ? (
                  <Pressable onPress={() => { onRenameArea(area.id, renameDraft); setRenamingId(null); }} style={{ backgroundColor: "#5cff89", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
                    <Text style={{ color: "#07120b", fontSize: 12, fontWeight: "900" }}>Save</Text>
                  </Pressable>
                ) : (
                  <>
                    <Pressable onPress={() => { setStylingId(stylingId === area.id ? null : area.id); setRenamingId(null); }} style={{ padding: 6 }}>
                      <Text style={{ color: "#ffd86b", fontSize: 13, fontWeight: "900" }}>Tag</Text>
                    </Pressable>
                    <Pressable onPress={() => { setRenamingId(area.id); setRenameDraft(area.name); setStylingId(null); }} style={{ padding: 6 }}>
                      <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900" }}>Rename</Text>
                    </Pressable>
                  </>
                )}
                <Pressable onPress={() => onDeleteArea(area.id)} style={{ padding: 6 }}>
                  <Text style={{ color: "#ff7b7b", fontSize: 16, fontWeight: "900" }}>✕</Text>
                </Pressable>
                </View>

                {stylingId === area.id ? (
                  <View style={{ paddingHorizontal: 12, paddingBottom: 14, paddingTop: 2, gap: 12 }}>
                    <View>
                      <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>EMOJI</Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {EMOJI_CHOICES.map((em) => {
                          const active = getAreaTag(area).emoji === em;
                          return (
                            <Pressable
                              key={`${area.id}-em-${em}`}
                              onPress={() => onSetAreaStyle && onSetAreaStyle(area.id, { emoji: em })}
                              style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: active ? "rgba(92,255,137,0.18)" : "rgba(255,255,255,0.05)", borderWidth: active ? 2 : 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.08)" }}
                            >
                              <Text style={{ fontSize: 20 }}>{em}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                    <View>
                      <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>COLOR</Text>
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                        {COLOR_CHOICES.map((col) => {
                          const active = getAreaTag(area).color === col;
                          return (
                            <Pressable
                              key={`${area.id}-col-${col}`}
                              onPress={() => onSetAreaStyle && onSetAreaStyle(area.id, { color: col })}
                              style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: col, borderWidth: active ? 3 : 0, borderColor: "#ffffff" }}
                            />
                          );
                        })}
                      </View>
                    </View>

<View>
                      <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>SUNLIGHT</Text>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        {[
                          { id: "full", label: "☀️ Full sun" },
                          { id: "partial", label: "⛅ Partial" },
                          { id: "shade", label: "🌥️ Shade" },
                        ].map((opt) => {
                          const active = (area.sunExposure || "full") === opt.id;
                          return (
                            <Pressable
                              key={`${area.id}-sun-${opt.id}`}
                              onPress={() => onSetAreaStyle && onSetAreaStyle(area.id, { sunExposure: opt.id })}
                              style={{ flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center", backgroundColor: active ? "rgba(92,255,137,0.18)" : "rgba(255,255,255,0.05)", borderWidth: active ? 2 : 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.08)" }}
                            >
                              <Text style={{ color: active ? "#8effab" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{opt.label}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    <Pressable onPress={() => setStylingId(null)} style={{ alignSelf: "flex-start", marginTop: 2, backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}>
                      <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900" }}>Done</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
})
