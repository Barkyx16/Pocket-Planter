import { memo, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getFirstFrostDate, getHarvestDays, getLastFrostDate, getSeedStartWeeks, resolvePlantImageSource, tapHaptic } from "../core";

const fmt = (d) => (d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—");
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

export const PlantingCalendarCard = memo(function PlantingCalendarCard({ theme, savedPlants, zone, onOpenPlant }) {
  const [visible, setVisible] = useState(4);
  if (!zone || !savedPlants || savedPlants.length === 0) return null;

  const lastFrost = getLastFrostDate(zone);
  const firstFrost = getFirstFrostDate(zone);

  const rows = savedPlants
    .map((name) => produceData.find((p) => p.name === name))
    .filter(Boolean)
    .map((item) => {
      const startWeeks = getSeedStartWeeks(item);
      const harvestDays = getHarvestDays(item);
      // Start indoors before last frost, transplant out at last frost, harvest after maturity.
      const sow = startWeeks ? addDays(lastFrost, -startWeeks * 7) : null;
      const plantOut = new Date(lastFrost);
      const harvest = addDays(plantOut, harvestDays || 0);
      // Flag if the harvest lands after the first fall frost (risky in this zone).
      const beatsFrost = harvest <= firstFrost;
      return { item, sow, plantOut, harvest, beatsFrost };
    });

  if (!rows.length) return null;

  const addToCalendar = async () => {
    tapHaptic("light");
    try {
      // Native module — needs the dev client rebuilt. Falls back gracefully.
      const Calendar = require("expo-calendar");
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Calendar access needed", "Allow calendar access to add your planting and harvest reminders.");
        return;
      }
      const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const writable = cals.find((c) => c.allowsModifications) || cals[0];
      if (!writable) {
        Alert.alert("No calendar found", "Couldn't find a calendar on your device to add events to.");
        return;
      }
      const mkEvent = async (date, title) => {
        if (!date || Number.isNaN(new Date(date).getTime())) return 0;
        const start = new Date(date); start.setHours(9, 0, 0, 0);
        const end = new Date(start); end.setHours(10, 0, 0, 0);
        await Calendar.createEventAsync(writable.id, {
          title, startDate: start, endDate: end,
          notes: "Added by Pocket Planter 🌱",
          alarms: [{ relativeOffset: 0 }],
        });
        return 1;
      };
      let count = 0;
      for (const r of rows) {
        count += await mkEvent(r.sow, `🌱 Start ${r.item.name} indoors`);
        count += await mkEvent(r.plantOut, `🪴 Plant out ${r.item.name}`);
        count += await mkEvent(r.harvest, `🚜 Harvest ${r.item.name} (approx.)`);
      }
      Alert.alert("Added to your calendar 📅", `${count} planting & harvest reminder${count === 1 ? "" : "s"} added for your saved plants.`);
    } catch (err) {
      console.log("Calendar add skipped:", err?.message);
      Alert.alert("Calendar unavailable", "Adding to your calendar will work after the next app update.");
    }
  };

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Sow, transplant, and harvest windows for your saved plants in Zone {zone}. Estimated from your frost dates — check seed packets for specifics.
      </Text>

      <Pressable
        onPress={addToCalendar}
        accessibilityRole="button"
        style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: "rgba(107,199,255,0.10)", borderRadius: 14, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(107,199,255,0.28)" }}
      >
        <Text style={{ color: "#6bc7ff", fontSize: 14, fontWeight: "900" }}>📅 Add these to my calendar</Text>
      </Pressable>

      <View style={{ gap: 8, marginTop: 14 }}>
        {rows.slice(0, visible).map(({ item, sow, plantOut, harvest, beatsFrost }) => {
          const img = resolvePlantImageSource(item);
          return (
            <Pressable
              key={item.name}
              onPress={() => onOpenPlant && onOpenPlant(item)}
              style={{ backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 27, height: 27 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>🌱</Text>}
                </View>
                <Text style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: "900" }}>{item.name}</Text>
                {!beatsFrost ? (
                  <View style={{ backgroundColor: "rgba(255,123,123,0.15)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: "rgba(255,123,123,0.3)" }}>
                    <Text style={{ color: "#ff9f9f", fontSize: 10, fontWeight: "900" }}>❄️ Tight</Text>
                  </View>
                ) : null}
              </View>
              <View style={{ flexDirection: "row", gap: 6 }}>
                {[
                  { icon: "🌱", label: "Start indoors", value: sow ? fmt(sow) : "Direct sow", color: "#8effab" },
                  { icon: "🪴", label: "Plant out", value: fmt(plantOut), color: "#6bc7ff" },
                  { icon: "🚜", label: "Harvest", value: `~${fmt(harvest)}`, color: "#ffd86b" },
                ].map((m) => (
                  <View key={m.label} style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 4 }}>
                    <Text style={{ fontSize: 14 }}>{m.icon}</Text>
                    <Text style={{ color: m.color, fontSize: 12.5, fontWeight: "900", marginTop: 3 }}>{m.value}</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 9, fontWeight: "800", marginTop: 1, textAlign: "center" }}>{m.label}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      {rows.length > visible ? (
        <Pressable
          onPress={() => setVisible((c) => c + 6)}
          style={{ marginTop: 12, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 16, paddingVertical: 13, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
        >
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>Show more plants ({rows.length - visible} more)</Text>
        </Pressable>
      ) : null}
    </View>
  );
})
