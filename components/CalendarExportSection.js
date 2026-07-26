import { memo, useState } from "react";
import { Alert, Platform, Pressable, Share, Text, View } from "react-native";
import * as Calendar from "expo-calendar";
import { tapHaptic } from "../core";

// Turns the garden's recurring chores into real calendar events. Uses
// expo-calendar to write straight to the device calendar, and falls back to a
// shareable .ics file so it also works in environments where calendar write
// access isn't available (e.g. Expo Go).

const TASKS = [
  { id: "water", title: "🌿 Water the garden", color: "#6bc7ff" },
  { id: "fertilize", title: "🌾 Fertilize the garden", color: "#ffd86b" },
  { id: "pests", title: "🐛 Check for pests", color: "#ff9f43" },
];

const FREQS = [
  { id: "d1", label: "Daily", freq: "DAILY", interval: 1 },
  { id: "d2", label: "Every 2 days", freq: "DAILY", interval: 2 },
  { id: "d3", label: "Every 3 days", freq: "DAILY", interval: 3 },
  { id: "w1", label: "Weekly", freq: "WEEKLY", interval: 1 },
];

// Best-effort device timezone so recurring events land at the right local time
// (especially on Android). Falls back to undefined, which lets the calendar use
// its own default.
function deviceTimeZone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined; } catch (e) { return undefined; }
}

// Next 8:00 AM from now (tomorrow if 8am already passed today).
function nextEightAM() {
  const d = new Date();
  d.setHours(8, 0, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d;
}

function buildICS(title, freqObj, start) {
  const dt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(start.getTime() + 15 * 60000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pocket Planter//Garden//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@pocketplanter`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(start)}`,
    `DTEND:${dt(end)}`,
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
          "Calendar access needed",
          "Allow calendar access to add the reminder, or use “Share as .ics file” instead.",
        );
        return;
      }
      const calId = await getWritableCalendarId();
      if (!calId) {
        Alert.alert("No calendar found", "Couldn't find a calendar to write to. Try the .ics file export instead.");
        return;
      }
      const start = nextEightAM();
      await Calendar.createEventAsync(calId, {
        title: task.title,
        startDate: start,
        endDate: new Date(start.getTime() + 15 * 60000),
        timeZone: deviceTimeZone(),
        alarms: [{ relativeOffset: 0 }],
        recurrenceRule: {
          frequency: freq.freq === "WEEKLY" ? Calendar.Frequency.WEEKLY : Calendar.Frequency.DAILY,
          interval: freq.interval,
        },
        notes: "Added by Pocket Planter 🌿",
      });
      Alert.alert("Added to calendar ✅", `${task.title} — ${freq.label.toLowerCase()}, starting ${start.toLocaleDateString()}.`);
    } catch (e) {
      Alert.alert("Couldn't add event", "Something went wrong. Try the .ics file export instead.");
    } finally {
      setBusy(false);
    }
  };

  const shareIcs = async () => {
    try {
      tapHaptic("light");
      const ics = buildICS(task.title, freq, nextEightAM());
      await Share.share({ title: `${task.title} (Pocket Planter)`, message: ics });
    } catch (e) { /* cancelled */ }
  };

  return (
    <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 18 }}>
      <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 8 }}>
        📅 ADD TO CALENDAR
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Put a recurring garden reminder on your real calendar.
      </Text>

      {/* Task picker */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
        {TASKS.map((tk) => {
          const active = task.id === tk.id;
          return (
            <Pressable key={tk.id} onPress={() => setTask(tk)} style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: active ? tk.color + "26" : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: active ? tk.color : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? tk.color : theme.secondaryText, fontSize: 12, fontWeight: "800" }}>{tk.title}</Text>
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
              <Text style={{ color: active ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={addToCalendar} disabled={busy} style={{ marginTop: 12, backgroundColor: busy ? "rgba(92,255,137,0.4)" : "#5cff89", borderRadius: 12, paddingVertical: 13, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>{busy ? "Adding…" : "Add to device calendar"}</Text>
      </Pressable>
      <Pressable onPress={shareIcs} style={{ marginTop: 8, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "900" }}>Share as .ics file</Text>
      </Pressable>
      <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 8, fontStyle: "italic" }}>
        Reminders start at 8:00 AM. The .ics file works with any calendar app.
      </Text>
    </View>
  );
});
