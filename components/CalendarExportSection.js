import { memo, useState } from "react";
import { Alert, Platform, Pressable, Share, Text, View } from "react-native";
import * as Calendar from "expo-calendar";
import { tapHaptic } from "../core";
import { formatDate, formatTime, t, useLanguage } from "../lib/i18n";

// Turns the garden's recurring chores into real calendar events. Uses
// expo-calendar to write straight to the device calendar, and falls back to a
// shareable .ics file so it also works in environments where calendar write
// access isn't available (e.g. Expo Go).

const TASKS = [
  // title and label are keys in the misc namespace.
  { id: "water", title: "calWater", color: "#6bc7ff" },
  { id: "fertilize", title: "calFertilize", color: "#ffd86b" },
  { id: "pests", title: "calPests", color: "#ff9f43" },
];

const FREQS = [
  { id: "d1", label: "calDaily", freq: "DAILY", interval: 1 },
  { id: "d2", label: "calEvery2", freq: "DAILY", interval: 2 },
  { id: "d3", label: "calEvery3", freq: "DAILY", interval: 3 },
  { id: "w1", label: "calWeekly", freq: "WEEKLY", interval: 1 },
];

// Best-effort device timezone so recurring events land at the right local time
// (especially on Android). Falls back to undefined, which lets the calendar use
// its own default.
function deviceTimeZone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined; } catch (e) { return undefined; }
}

// Next 8:00 AM from now (tomorrow if 8am already passed today).
export function nextEightAM() {
  const d = new Date();
  d.setHours(8, 0, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d;
}

// iCalendar date-times. DTSTAMP records a moment, so it is UTC. The event's own
// start and end are written as floating local time — no "Z", no TZID — which RFC
// 5545 defines as "this wall-clock time wherever the calendar is". A recurring
// event pinned to UTC instead keeps the same UTC hour all year, so an 8:00 AM
// reminder exported in summer arrives at 7:00 AM once the clocks go back.
const pad2 = (n) => String(n).padStart(2, "0");
const icsUtc = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
const icsLocal = (d) =>
  `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` +
  `T${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;

export function buildICS(title, freqObj, start) {
  const end = new Date(start.getTime() + 15 * 60000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pocket Planter//Garden//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@pocketplanter`,
    `DTSTAMP:${icsUtc(new Date())}`,
    `DTSTART:${icsLocal(start)}`,
    `DTEND:${icsLocal(end)}`,
    `RRULE:FREQ=${freqObj.freq};INTERVAL=${freqObj.interval}`,
    `SUMMARY:${title}`,
    "BEGIN:VALARM",
    "TRIGGER:PT0M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${title}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

async function getWritableCalendarId() {
  if (Platform.OS === "ios") {
    try {
      const def = await Calendar.getDefaultCalendarAsync();
      if (def?.id) return def.id;
    } catch (e) { /* fall through to enumeration */ }
  }
  const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = cals.find((c) => c.allowsModifications) || cals[0];
  return writable?.id || null;
}

export const CalendarExportSection = memo(function CalendarExportSection({ theme }) {
  useLanguage(); // memo() skips a language switch without this (see lib/i18n)
  const [task, setTask] = useState(TASKS[0]);
  const [freq, setFreq] = useState(FREQS[1]);
  const [busy, setBusy] = useState(false);

  const addToCalendar = async () => {
    if (busy) return;
    setBusy(true);
    try {
      tapHaptic("light");
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("alerts.calendarAccessTitle"),
          t("alerts.calendarAccessBody"),
        );
        return;
      }
      const calId = await getWritableCalendarId();
      if (!calId) {
        Alert.alert(t("alerts.noCalendarTitle"), t("alerts.noCalendarBody"));
        return;
      }
      const start = nextEightAM();
      await Calendar.createEventAsync(calId, {
        title: t(`misc.${task.title}`),
        startDate: start,
        endDate: new Date(start.getTime() + 15 * 60000),
        timeZone: deviceTimeZone(),
        alarms: [{ relativeOffset: 0 }],
        recurrenceRule: {
          frequency: freq.freq === "WEEKLY" ? Calendar.Frequency.WEEKLY : Calendar.Frequency.DAILY,
          interval: freq.interval,
        },
        notes: t("misc.calNotes"),
      });
      Alert.alert(t("alerts.addedToCalendarTitle"), t("alerts.addedToCalendarBody", { task: t(`misc.${task.title}`), freq: t(`misc.${freq.label}`).toLowerCase(), date: formatDate(start) }));
    } catch (e) {
      Alert.alert(t("alerts.calendarFailedTitle"), t("alerts.calendarFailedBody"));
    } finally {
      setBusy(false);
    }
  };

  const shareIcs = async () => {
    try {
      tapHaptic("light");
      const ics = buildICS(t(`misc.${task.title}`), freq, nextEightAM());
      await Share.share({ title: `${t(`misc.${task.title}`)} (Pocket Planter)`, message: ics });
    } catch (e) { /* cancelled */ }
  };

  return (
    <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 18 }}>
      <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 8 }}>
        {t("misc.calTitle")}
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        {t("misc.calIntro")}
      </Text>

      {/* Task picker */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
        {TASKS.map((tk) => {
          const active = task.id === tk.id;
          return (
            <Pressable key={tk.id} onPress={() => setTask(tk)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: active ? tk.color + "26" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? tk.color : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? tk.color : theme.secondaryText, fontSize: 12, fontWeight: "800" }}>{t(`misc.${tk.title}`)}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Frequency */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {FREQS.map((f) => {
          const active = freq.id === f.id;
          return (
            <Pressable key={f.id} onPress={() => setFreq(f)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: active ? "#6bc7ff" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? "#6bc7ff" : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{t(`misc.${f.label}`)}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={addToCalendar} disabled={busy} style={{ marginTop: 12, backgroundColor: busy ? "rgba(92,255,137,0.4)" : "#5cff89", borderRadius: 12, paddingVertical: 13, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>{busy ? t("misc.calAdding") : t("misc.calAddDevice")}</Text>
      </Pressable>
      <Pressable onPress={shareIcs} style={{ marginTop: 8, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "900" }}>{t("misc.calShareIcs")}</Text>
      </Pressable>
      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 8, fontStyle: "italic" }}>
        {t("misc.calFootnote", { time: formatTime(new Date(2026, 0, 1, 8, 0)) || "8:00" })}
      </Text>
    </View>
  );
});
