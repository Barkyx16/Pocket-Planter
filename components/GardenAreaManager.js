import { memo, useState } from "react";
import { Keyboard, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../styles";

// One button, one panel. Everything about creating a bed — the design and how
// many plants it holds — lives in a single sheet instead of several stacked
// rows of chips and buttons. `mode` keeps the Garden tab (edibles) and the
// Flowers tab (flowers) as two separate planners.
const GARDEN_DESIGNS = [
  "Vegetable Patch",
  "Front Yard",
  "Backyard",
  "Balcony",
  "Indoors",
  "Raised Bed",
  "Herb Garden",
  "Hanging Planter",
];
const FLOWER_DESIGNS = [
  "Flower Bed",
  "Cutting Garden",
  "Cottage Border",
  "Window Box",
  "Container Pot",
  "Hanging Basket",
];

export const GardenAreaManager = memo(function GardenAreaManager({ theme, gardenAreas, onAddArea, mode = "garden" }) {
  const flower = mode === "flower";
  const DESIGNS = flower ? FLOWER_DESIGNS : GARDEN_DESIGNS;
  const [open, setOpen] = useState(false);
  const [design, setDesign] = useState(null);
  const [size, setSize] = useState(6);

  const close = () => { setOpen(false); Keyboard.dismiss(); };
  const pickDesign = (d) => {
    setDesign((cur) => (cur === d ? null : d));
    if (d === "Hanging Planter" || d === "Window Box" || d === "Container Pot") setSize(d === "Window Box" ? 3 : 1);
  };
  const create = () => {
    const fallback = flower ? `Flower Bed ${(gardenAreas?.length || 0) + 1}` : `Garden Bed ${(gardenAreas?.length || 0) + 1}`;
    onAddArea(design || fallback, size, flower ? "flower" : undefined);
    setDesign(null);
    setSize(6);
    close();
  };

  const label = design ? `Add a ${size}-plant ${design}` : flower ? `Add a ${size}-plant flower bed` : `Add a ${size}-plant bed`;

  return (
    <View>
      {/* The single entry point */}
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={flower ? "Add a flower bed" : "Add a garden bed"}
        style={({ pressed }) => [{
          flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
          backgroundColor: flower ? "#ffb6c1" : "#5cff89", borderRadius: 16, paddingVertical: 16, marginTop: 4,
        }, pressed && { opacity: 0.85 }]}
      >
        <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>{flower ? "＋  Add a Flower Bed" : "＋  Add a Garden Bed"}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }} onPress={close}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{ backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 30, maxHeight: "85%" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
              <Text style={[styles.cardTitle, { color: theme.text, flex: 1 }]}>New garden bed</Text>
              <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close">
                <Text style={{ color: theme.secondaryText, fontSize: 20, fontWeight: "900" }}>✕</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Design */}
              <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginBottom: 8 }}>DESIGN</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {DESIGNS.map((d) => {
                  const active = design === d;
                  return (
                    <Pressable
                      key={d}
                      onPress={() => pickDesign(d)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: active ? "#5cff89" : "rgba(92,255,137,0.1)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(92,255,137,0.24)" }}
                    >
                      <Text style={{ color: active ? "#07120b" : "#8effab", fontSize: 12, fontWeight: "800" }}>{active ? "✓ " : ""}{d}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Size */}
              <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "900", letterSpacing: 0.6, marginTop: 20, marginBottom: 8 }}>
                HOW MANY PLANTS?  ({size})
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => {
                  const active = size === n;
                  return (
                    <Pressable
                      key={n}
                      onPress={() => setSize(n)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      style={{ width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: active ? "#5cff89" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255,255,255,0.12)" }}
                    >
                      <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 14, fontWeight: "900" }}>{n}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Confirm */}
              <Pressable
                onPress={create}
                accessibilityRole="button"
                accessibilityLabel={label}
                style={({ pressed }) => [{ marginTop: 22, backgroundColor: "#5cff89", borderRadius: 16, paddingVertical: 16, alignItems: "center" }, pressed && { opacity: 0.85 }]}
              >
                <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 15 }}>{label}</Text>
              </Pressable>
              <Pressable onPress={close} style={{ paddingVertical: 14, alignItems: "center" }}>
                <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "800" }}>Cancel</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
})
