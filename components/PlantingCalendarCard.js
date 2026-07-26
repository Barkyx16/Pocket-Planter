import { memo, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getFirstFrostDate, getHarvestDays, getLastFrostDate, getSeedStartWeeks, isOrnamental, resolvePlantImageSource, tapHaptic } from "../core";
import { IconText } from "./IconText";
import { DatePickerModal } from "./DatePickerModal";
import { formatDate, useTranslation } from "../lib/i18n";

const fmt = (d) => (d && !Number.isNaN(d.getTime()) ? formatDate(d, {
  month: "short",
  day: "numeric"
}) : "—");
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

export const PlantingCalendarCard = memo(function PlantingCalendarCard({ theme, savedPlants, zone, onOpenPlant }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(4);
  const [pickerOpen, setPickerOpen] = useState(false);
  if (!zone || !savedPlants || savedPlants.length === 0) return null;

  const lastFrost = getLastFrostDate(zone);
  const firstFrost = getFirstFrostDate(zone);

  const rows = savedPlants
    .map((name) => produceData.find((p) => p.name === name))
    .filter(Boolean)
    .filter((item) => !isOrnamental(item)) // flowers/houseplants aren't sow→harvest crops
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

  // The button used to dump every plant's sow/plant-out/harvest events straight
  // into the calendar on their auto-calculated dates, with no choice. Now the
  // user picks the day they actually plan to plant, and every reminder anchors
  // to that: start-indoors before it, harvest after it — per plant, so each
  // plant's own maturity still shapes its harvest date.
  const addToCalendarOn = async (chosenPlantOut) => {
    setPickerOpen(false);
    tapHaptic("light");
    const anchor = new Date(chosenPlantOut);
    if (Number.isNaN(anchor.getTime())) return;
    try {
      // Native module — needs the dev client rebuilt. Falls back gracefully.
      const Calendar = require("expo-calendar");
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("plantingCalendar.calendarAccessNeededTitle"), t("plantingCalendar.calendarAccessNeededBody"));
        return;
      }
      const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      // Only writable calendars can take new events — subscribed/holiday
      // calendars will throw. Prefer the OS default when we can get it.
      let writable = cals.find((c) => c.allowsModifications && c.source?.name);
      try {
        const def = await Calendar.getDefaultCalendarAsync?.();
        if (def?.allowsModifications) writable = def;
      } catch (e) { /* getDefaultCalendarAsync is iOS-only */ }
      if (!writable) writable = cals.find((c) => c.allowsModifications) || cals[0];
      if (!writable) {
        Alert.alert(t("plantingCalendar.noCalendarTitle"), t("plantingCalendar.noCalendarBody"));
        return;
      }
      const mkEvent = async (date, title) => {
        if (!date || Number.isNaN(new Date(date).getTime())) return 0;
        const start = new Date(date); start.setHours(9, 0, 0, 0);
        const end = new Date(start); end.setHours(10, 0, 0, 0);
        await Calendar.createEventAsync(writable.id, {
          title, startDate: start, endDate: end,
          timeZone: Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || undefined,
          notes: t("plantingCalendar.addedByPocketPlanter"),
          alarms: [{ relativeOffset: 0 }],
        });
        return 1;
      };
      let count = 0;
      for (const r of rows) {
        const startWeeks = getSeedStartWeeks(r.item);
        const harvestDays = getHarvestDays(r.item);
        const sow = startWeeks ? addDays(anchor, -startWeeks * 7) : null;
        const harvest = addDays(anchor, harvestDays || 0);
        count += await mkEvent(sow, t("plantingCalendar.startIndoorsEvent", { plant: r.item.name }));
        count += await mkEvent(anchor, t("plantingCalendar.plantOutEvent", { plant: r.item.name }));
        count += await mkEvent(harvest, t("plantingCalendar.harvestEvent", { plant: r.item.name }));
      }
      Alert.alert(
        t("plantingCalendar.addedTitle"),
        t("plantingCalendar.addedBody", { count, date: formatDate(anchor, { month: "long", day: "numeric" }) })
      );
    } catch (err) {
      console.log("Calendar add skipped:", err?.message);
      Alert.alert(t("plantingCalendar.unavailableTitle"), t("plantingCalendar.unavailableBody"));
    }
  };

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("plantingCalendar.sowTransplantAndHarvestWindows")} {zone}{t("plantingCalendar.estimatedFromYourFrostDates")}
      </Text>

      <Pressable
        onPress={() => { tapHaptic("light"); setPickerOpen(true); }}
        accessibilityRole="button"
        style={{ marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(107, 199, 255, 0.1)", borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.3)" }}
      >
        <IconText label={t("plantingCalendar.addTheseToMyCalendar")} style={{
  color: "#6bc7ff",
  fontSize: 14,
  fontWeight: "900"
}} />
      </Pressable>

      <DatePickerModal
        visible={pickerOpen}
        initialDate={lastFrost}
        title={t("plantingCalendar.pickPlantingDate")}
        confirmLabel={t("plantingCalendar.addRemindersButton")}
        onConfirm={addToCalendarOn}
        onClose={() => setPickerOpen(false)}
        theme={theme}
      />

      <View style={{ gap: 8, marginTop: 14 }}>
        {rows.slice(0, visible).map(({ item, sow, plantOut, harvest, beatsFrost }) => {
          const img = resolvePlantImageSource(item);
          return (
            <Pressable
              key={item.name}
              onPress={() => onOpenPlant && onOpenPlant(item)}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {img ? <Image source={img} style={{ width: 27, height: 27 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>🌱</Text>}
                </View>
                <Text style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: "900" }}>{item.name}</Text>
                {!beatsFrost ? (
                  <View style={{ backgroundColor: "rgba(255, 123, 123, 0.16)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(255, 123, 123, 0.3)" }}>
                    <IconText label={t("plantingCalendar.tight")} style={{
  color: "#ff9f9f",
  fontSize: 10,
  fontWeight: "900"
}} />
                  </View>
                ) : null}
              </View>
              <View style={{ flexDirection: "row", gap: 6 }}>
                {[
                  { icon: "🌱", label: t("plantingCalendar.startIndoors"), value: sow ? fmt(sow) : t("plantingCalendar.directSow"), color: "#8effab" },
                  { icon: "🪴", label: t("plantingCalendar.plantOut"), value: fmt(plantOut), color: "#6bc7ff" },
                  { icon: "🚜", label: "Harvest", value: `~${fmt(harvest)}`, color: "#ffd86b" },
                ].map((m) => (
                  <View key={m.label} style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 4 }}>
                    <Text style={{ fontSize: 14 }}>{m.icon}</Text>
                    <Text style={{ color: m.color, fontSize: 12, fontWeight: "900", marginTop: 4 }}>{m.value}</Text>
                    <Text style={{ color: theme.secondaryText, fontSize: 9, fontWeight: "800", marginTop: 2, textAlign: "center" }}>{m.label}</Text>
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
          style={{ marginTop: 12, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
        >
          <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>{t("plantingCalendar.showMorePlants")}{rows.length - visible} {t("plantingCalendar.more")}</Text>
        </Pressable>
      ) : null}
    </View>
  );
})
