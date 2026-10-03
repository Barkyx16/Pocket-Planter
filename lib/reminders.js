// Repeating reminders that the Settings switches turn on.
//
// A scheduled notification belongs to the device; the switch that asked for it
// belongs to the account and syncs. Schedule only from the switch and the two
// drift apart: a new phone, a reinstall, or signing out (which cancels every
// notification) and back in restores the switch as on with nothing behind it.
// So the switches and the re-arm on launch both go through these, and every one
// of them is a cancel-then-set by a fixed id — safe to run as often as needed.
import * as Notifications from "expo-notifications";
import { MONTH_NAMES, getFrostSeasonMonths } from "../core";

export const frostCheckId = (month) => `frost-daily-${month}`;
export const monthlyPlantingId = (month) => `monthly-planting-${month}`;

const cancel = (id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => {});

// An evening check on the 1st of each frost-season month for this zone. All
// twelve are cancelled first: the season moves with the zone and flips with
// the hemisphere, and a month that has left it must stop firing.
export async function armFrostSeasonChecks(zone) {
  for (let month = 1; month <= 12; month += 1) await cancel(frostCheckId(month));
  for (const month of getFrostSeasonMonths(zone)) {
    await Notifications.scheduleNotificationAsync({
      identifier: frostCheckId(month),
      content: {
        title: "❄️ Frost Check",
        body: "Cold season is here — open Pocket Planter to see if frost is coming and protect your tender plants.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        repeats: true,
        month,
        day: 1,
        hour: 18,
        minute: 0,
      },
    });
  }
}

export async function cancelFrostSeasonChecks() {
  for (let month = 1; month <= 12; month += 1) await cancel(frostCheckId(month));
}

// A planting guide on the morning of the 1st of every month.
export async function armMonthlyPlantingGuides() {
  for (let month = 1; month <= 12; month += 1) {
    const id = monthlyPlantingId(month);
    await cancel(id);
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: `🌱 ${MONTH_NAMES[month - 1]} Planting Guide`,
        body: `Open Pocket Planter to see what to plant this month in your zone.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        repeats: true,
        month,
        day: 1,
        hour: 9,
        minute: 0,
      },
    });
  }
}

export async function cancelMonthlyPlantingGuides() {
  for (let month = 1; month <= 12; month += 1) await cancel(monthlyPlantingId(month));
}
