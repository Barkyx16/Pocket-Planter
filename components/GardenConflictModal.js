import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import produceData from "../data/produceData";
import { resolvePlantImageSource, tapHaptic } from "../core";
import { styles } from "../styles";

// Shown when adding a plant to the garden would clash (an "Avoid" companion pair)
// with something already planted. Lets the user REPLACE a clashing plant with the
// new one, PLANT it in a different bed that has room, or add it anyway.
//
// prompt shape:
//   { plantName, conflicts: [{ areaId, areaName, areaEmoji, slotId, plant }],
//     cleanBeds: [{ areaId, areaName, areaEmoji, slot }], anyFreeBed: {...}|null }
function plantThumb(name) {
  const item = produceData.find((p) => p.name === name);
  return item ? resolvePlantImageSource(item) : null;
}

function Thumb({ name, size = 40 }) {
  const src = plantThumb(name);
  return (
    <View style={{ width: size, height: size, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
      {src ? <Image source={src} style={{ width: size - 8, height: size - 8 }} resizeMode="contain" /> : <Text style={{ fontSize: size * 0.5 }}>🌱</Text>}
    </View>
  );
}

export function GardenConflictModal({ prompt, theme, onReplace, onPlaceIn, onAddAnyway, onClose }) {
  const visible = !!prompt;
  const plantName = prompt?.plantName || "";
  const conflicts = prompt?.conflicts || [];
  const cleanBeds = prompt?.cleanBeds || [];
  const anyFreeBed = prompt?.anyFreeBed || null;
  const clashNames = Array.from(new Set(conflicts.map((c) => c.plant)));
  const clashList = clashNames.slice(0, 3).join(", ") + (clashNames.length > 3 ? "…" : "");

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "82%", paddingTop: 18 }}>
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 8 }}>
            <Thumb name={plantName} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900" }}>{plantName} — conflict</Text>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>Clashes with {clashList} already planted</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => { tapHaptic(); onClose(); }} hitSlop={12}>
              <Ionicons name="close" size={24} color={theme.secondaryText} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }}>
            {/* Replace a clashing plant */}
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, paddingHorizontal: 20, marginTop: 12, marginBottom: 8 }}>
              🔁 REPLACE A PLANT WITH {plantName.toUpperCase()}
            </Text>
            {conflicts.map((c) => (
              <Pressable
                key={`replace-${c.areaId}-${c.slotId}`}
                accessibilityRole="button"
                accessibilityLabel={`Replace ${c.plant} in ${c.areaName} with ${plantName}`}
                onPress={() => { tapHaptic(); onReplace(c); }}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 20, marginBottom: 8, padding: 12, borderRadius: 16, backgroundColor: "rgba(255, 123, 123, 0.08)", borderWidth: 1, borderColor: "rgba(255, 123, 123, 0.28)" }}
              >
                <Thumb name={c.plant} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }} numberOfLines={1}>Replace {c.plant}</Text>
                  <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }} numberOfLines={1}>in {c.areaEmoji ? `${c.areaEmoji} ` : ""}{c.areaName}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="swap-horizontal" size={16} color="#ff9f9f" />
                  <Thumb name={plantName} size={32} />
                </View>
              </Pressable>
            ))}

            {/* Plant it somewhere with room */}
            {cleanBeds.length ? (
              <>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, paddingHorizontal: 20, marginTop: 14, marginBottom: 8 }}>
                  🌿 OR PLANT IT WHERE IT FITS
                </Text>
                {cleanBeds.map((b) => (
                  <Pressable
                    key={`place-${b.areaId}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${plantName} to ${b.areaName}`}
                    onPress={() => { tapHaptic(); onPlaceIn(b); }}
                    style={{ flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 20, marginBottom: 8, padding: 12, borderRadius: 16, backgroundColor: "rgba(92, 255, 137, 0.08)", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
                  >
                    <Text style={{ fontSize: 22 }}>{b.areaEmoji || "🪴"}</Text>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }} numberOfLines={1}>Add to {b.areaName}</Text>
                      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>No conflicts here — has room</Text>
                    </View>
                    <Ionicons name="add-circle" size={22} color="#5cff89" />
                  </Pressable>
                ))}
              </>
            ) : null}

            {/* Footer actions */}
            <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, marginTop: 16 }}>
              {anyFreeBed ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${plantName} anyway`}
                  onPress={() => { tapHaptic(); onAddAnyway(); }}
                  style={{ flex: 1, borderRadius: 16, paddingVertical: 13, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.12)" }}
                >
                  <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "900" }}>Add anyway</Text>
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                onPress={() => { tapHaptic(); onClose(); }}
                style={{ flex: 1, borderRadius: 16, paddingVertical: 13, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.12)" }}
              >
                <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "900" }}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
