import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { getActivePests, tapHaptic } from "../core";

export function PestWatchCard({ theme, savedPlantObjs, onOpenPlant }) {
  const month = new Date().getMonth() + 1;
  const pests = getActivePests(savedPlantObjs, month);
  const [expanded, setExpanded] = useState(null);

  if (!pests.length) return null;

  const monthName = new Date().toLocaleDateString("en-US", { month: "long" });

return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 26 }}>🐛</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginTop: 2 }}>
            Active in {monthName}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 8 }}>
        {pests.length} pest{pests.length === 1 ? "" : "s"} tend to show up this time of year for plants like yours. A quick check now saves a lot of damage later.
      </Text>

      <View style={{ gap: 10, marginTop: 14 }}>
        {pests.map((pest) => {
          const open = expanded === pest.name;
          return (
            <View key={pest.name} style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,123,123,0.20)", overflow: "hidden" }}>
              <Pressable
                onPress={() => { tapHaptic("light"); setExpanded(open ? null : pest.name); }}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 13 }}
              >
                <Text style={{ fontSize: 24 }}>{pest.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>{pest.name}</Text>
                  <Text style={{ color: "#ffb3b3", fontSize: 12, fontWeight: "800", marginTop: 2 }}>
                    Threatens: {pest.affected.slice(0, 3).join(", ")}{pest.affected.length > 3 ? ` +${pest.affected.length - 3}` : ""}
                  </Text>
                </View>
                <Text style={{ color: "#ff9f9f", fontSize: 18, fontWeight: "900" }}>{open ? "−" : "+"}</Text>
              </Pressable>
              {open ? (
                <View style={{ paddingHorizontal: 13, paddingBottom: 14, gap: 10 }}>
                  <View>
                    <Text style={{ color: "#ffd86b", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 3 }}>👀 WHAT TO LOOK FOR</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19 }}>{pest.sign}</Text>
                  </View>
                  <View>
                    <Text style={{ color: "#8effab", fontSize: 11, fontWeight: "900", letterSpacing: 0.5, marginBottom: 3 }}>✅ WHAT TO DO</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19 }}>{pest.fix}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
        Based on typical seasonal activity — not a live infestation report.
      </Text>
    </View>
  );
}
