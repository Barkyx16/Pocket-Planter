import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import produceData from "../data/produceData";
import { resolvePlantImageSource, tapHaptic } from "../core";
import { styles } from "../styles";

// Shown when the user adds a plant to their garden. Lets them choose WHICH bed it
// goes in, or spin up a brand-new one if the existing beds are full. Only beds of
// the correct type are offered — flowers & houseplants go in the Flowers & Home
// garden, edibles in garden beds — so a plant can never land in the wrong garden.
//
// prompt shape:
//   { plantName, flowerKind: bool, beds: [{ areaId, areaName, areaEmoji, slot, clashes: [names] }] }
function Thumb({ name, size = 48 }) {
  const item = produceData.find((p) => p.name === name);
  const src = item ? resolvePlantImageSource(item) : null;
  return (
    <View style={{ width: size, height: size, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
      {src ? <Image source={src} style={{ width: size - 10, height: size - 10 }} resizeMode="contain" /> : <Text style={{ fontSize: size * 0.5 }}>🌱</Text>}
    </View>
  );
}

export function GardenPlacementModal({ prompt, theme, onPlaceIn, onCreateNew, onClose }) {
  const visible = !!prompt;
  const plantName = prompt?.plantName || "";
  const flowerKind = !!prompt?.flowerKind;
  const beds = prompt?.beds || [];

  const gardenLabel = flowerKind ? "Flowers & Home garden" : "garden";
  const typeNote = flowerKind
    ? "🌸 Flowers & houseplants live in your Flowers & Home garden."
    : "🌿 Edible plants live in your garden beds.";

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "82%", paddingTop: 18 }}>
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 8 }}>
            <Thumb name={plantName} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900" }}>Where should {plantName} go?</Text>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{typeNote}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => { tapHaptic(); onClose(); }} hitSlop={12}>
              <Ionicons name="close" size={24} color={theme.secondaryText} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }}>
            {beds.length ? (
              <>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, paddingHorizontal: 20, marginTop: 12, marginBottom: 8 }}>
                  🪴 PICK A BED
                </Text>
                {beds.map((b) => {
                  const clash = (b.clashes || []).length;
                  const clashList = (b.clashes || []).slice(0, 2).join(", ") + ((b.clashes || []).length > 2 ? "…" : "");
                  return (
                    <Pressable
                      key={`place-${b.areaId}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${plantName} to ${b.areaName}`}
                      onPress={() => { tapHaptic(); onPlaceIn(b); }}
                      style={{ flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 20, marginBottom: 8, padding: 14, borderRadius: 16, backgroundColor: clash ? "rgba(255, 216, 107, 0.08)" : "rgba(92, 255, 137, 0.08)", borderWidth: 1, borderColor: clash ? "rgba(255, 216, 107, 0.3)" : "rgba(92, 255, 137, 0.24)" }}
                    >
                      <Text style={{ fontSize: 24 }}>{b.areaEmoji || (flowerKind ? "🌸" : "🪴")}</Text>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }} numberOfLines={1}>{b.areaName}</Text>
                        <Text style={{ color: clash ? "#ffd86b" : theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }} numberOfLines={1}>
                          {clash ? `⚠ May clash with ${clashList}` : "Has room — no conflicts"}
                        </Text>
                      </View>
                      <Ionicons name="add-circle" size={24} color={clash ? "#ffd86b" : "#5cff89"} />
                    </Pressable>
                  );
                })}
              </>
            ) : (
              <View style={{ marginHorizontal: 20, marginTop: 14, marginBottom: 4, padding: 16, borderRadius: 16, backgroundColor: "rgba(255, 255, 255, 0.05)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }}>No {gardenLabel} beds with room yet</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 4, lineHeight: 18 }}>
                  Create a new bed below and {plantName} will be planted in it.
                </Text>
              </View>
            )}

            {/* Always available: make a new garden right here */}
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, paddingHorizontal: 20, marginTop: 14, marginBottom: 8 }}>
              {beds.length ? "OR START A NEW ONE" : "CREATE ONE"}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Create a new ${gardenLabel} bed for ${plantName}`}
              onPress={() => { tapHaptic(); onCreateNew(); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 20, marginBottom: 8, padding: 14, borderRadius: 16, backgroundColor: "#5cff89" }}
            >
              <Ionicons name="add" size={22} color="#07120b" />
              <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900", flex: 1 }}>
                Plant in a new {flowerKind ? "Flowers & Home" : "garden"} bed
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              onPress={() => { tapHaptic(); onClose(); }}
              style={{ marginHorizontal: 20, marginTop: 8, borderRadius: 16, paddingVertical: 13, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.12)" }}
            >
              <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "900" }}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
