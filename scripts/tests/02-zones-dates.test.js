const path = require("path");
const { describe, it, eq, ok, ROOT } = require("../test.js");
const core = require(path.join(ROOT, "core.js"));
const zr = require(path.join(ROOT, "lib/zoneResolver.js"));

describe("zoneMatch", () => {
  it("respects the half-zone, which citrus depends on", () => {
    // A plant rated 8b does not survive 8a — five degrees colder.
    eq(core.zoneMatch("8a", "8b", "10b"), false);
    eq(core.zoneMatch("8b", "8b", "10b"), true);
    eq(core.zoneMatch("9a", "9b", "11b"), false);
    eq(core.zoneMatch("9b", "9b", "11b"), true);
    eq(core.zoneMatch("10a", "10b", "11b"), false);
  });
  it("reads a bare bound as the whole zone", () => {
    // minZone 4 starts at 4a; maxZone 11 runs through 11b.
    eq(core.zoneMatch("4a", "4", "11"), true);
    eq(core.zoneMatch("11b", "9b", "11"), true);
    eq(core.zoneMatch("3b", "4", "11"), false);
  });
  it("keeps ordinary ranges intact", () => {
    for (const z of ["5a", "5b", "7a", "9a", "9b"]) eq(core.zoneMatch(z, "5a", "9b"), true, z);
    for (const z of ["4b", "10a"]) eq(core.zoneMatch(z, "5a", "9b"), false, z);
  });
  it("rejects unparseable input rather than guessing", () => {
    eq(core.zoneMatch("", "5a", "9b"), false);
    eq(core.zoneMatch("7a", null, "9b"), false);
    eq(core.zoneMatch("7a", "5a", "abc"), false);
  });
});

describe("zoneFromTempF", () => {
  it("agrees with the USDA table", () => {
    eq(zr.zoneFromTempF(-60).zone, "1a");
    eq(zr.zoneFromTempF(-55).zone, "1b");
    eq(zr.zoneFromTempF(-50).zone, "2a");
    eq(zr.zoneFromTempF(0).zone, "7a");
    eq(zr.zoneFromTempF(5).zone, "7b");
    eq(zr.zoneFromTempF(35).zone, "10b");
    eq(zr.zoneFromTempF(40).zone, "11a");
  });
  it("puts every temperature inside the range it is labelled with", () => {
    for (let t = -70; t <= 70; t += 1) {
      const r = zr.zoneFromTempF(t);
      const [lo, hi] = r.trange.split(" to ").map(Number);
      ok(t >= lo - 10 && t <= hi + 10, `${t}F labelled ${r.zonetitle}`);
    }
  });
});

describe("getCountry", () => {
  it("falls back to the US, not to the first row of the table", () => {
    // COUNTRIES[0] is Afghanistan: no ZIP format, no bundled lookup table.
    for (const c of [undefined, null, "", "ZZ"]) {
      eq(zr.getCountry(c).code, "US", String(c));
      eq(zr.usesZipFormat(c), true, String(c));
      eq(zr.hasZipTable(c), true, String(c));
    }
  });
  it("ignores case and surrounding space", () => {
    eq(zr.getCountry("us").code, "US");
    eq(zr.getCountry("gb").code, "GB");
    eq(zr.getCountry(" gb ").code, "GB");
  });
});

describe("findCountry", () => {
  it("stays strict so the stored/cloud/detected guards still reject garbage", () => {
    eq(zr.findCountry("ZZ"), null);
    eq(zr.findCountry(""), null);
    eq(zr.findCountry(null), null);
    eq(zr.findCountry("gb").code, "GB");
  });
});

describe("parseFrostOverride", () => {
  const fmt = (d) => (d ? `${d.getMonth() + 1}-${d.getDate()}` : null);
  it("clamps a day that does not exist in that month", () => {
    // new Date(y, 1, 31) rolls into March; a typed "2-31" became a March frost.
    eq(fmt(core.parseFrostOverride("2-31")), "2-28");
    eq(fmt(core.parseFrostOverride("4-31")), "4-30");
    eq(fmt(core.parseFrostOverride("6-31")), "6-30");
    eq(fmt(core.parseFrostOverride("9-31")), "9-30");
  });
  it("keeps real dates and rejects impossible ones", () => {
    eq(fmt(core.parseFrostOverride("5-25")), "5-25");
    eq(fmt(core.parseFrostOverride("12-31")), "12-31");
    eq(core.parseFrostOverride("13-01"), null);
    eq(core.parseFrostOverride("0-5"), null);
    eq(core.parseFrostOverride("nonsense"), null);
    eq(core.parseFrostOverride(null), null);
  });
});

describe("flipDate", () => {
  it("never rolls into the next month", () => {
    core.setHemisphereFromLatitude(-33.87);
    const f = (iso) => {
      const d = core.flipDate(new Date(`${iso}T12:00:00`));
      return `${d.getMonth() + 1}-${d.getDate()}`;
    };
    eq(f("2026-01-31"), "7-31");
    eq(f("2026-03-31"), "9-30"); // September has 30 days, not 31
    eq(f("2026-08-31"), "2-28"); // used to come back as March 3
    eq(f("2026-12-31"), "6-30");
    eq(f("2026-05-25"), "11-25");
    core.setHemisphereFromLatitude(40.7);
  });
  it("is a no-op in the northern hemisphere", () => {
    const d = new Date("2026-03-31T12:00:00");
    eq(core.flipDate(d), d);
  });
});

describe("csvEscape", () => {
  const Q = '"';
  // Row breaks the way a real consumer sees them. Excel and the rest end a row on
  // CR, LF *or* CRLF, so an unquoted lone \r splits the row — which is the whole
  // reason csvEscape has to quote it. A parser that only breaks on \n would pass
  // the broken code too, and did.
  const parse = (text) => {
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i += 1) {
      const c = text[i];
      if (q) { if (c === Q) { if (text[i + 1] === Q) { cell += Q; i += 1; } else q = false; } else cell += c; }
      else if (c === Q) q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\r" || c === "\n") {
        if (c === "\r" && text[i + 1] === "\n") i += 1;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += c;
    }
    row.push(cell); rows.push(row); return rows;
  };
  it("round-trips every character that can break a row", () => {
    const data = [
      ["Tomato", 'he said "hi"', "a,b"],
      ["Basil", "line1\nline2", "x"],
      ["Kale", "carriage\rreturn", "y"],   // a lone CR ends a row for Excel
      ["Mint", "crlf\r\nhere", "z"],
      ["Sage", "", null],
    ];
    const back = parse(core.buildCsv(["Plant", "Note", "Misc"], data));
    eq(back.length, data.length + 1, "row count");
    data.forEach((r, i) => r.forEach((c, j) => {
      eq(back[i + 1][j], c == null ? "" : String(c), `row ${i} col ${j}`);
    }));
  });
});

describe("weather thresholds", () => {
  const core2 = require(path.join(ROOT, "core.js"));
  it("names three tiers that mean different things", () => {
    // HEAT changes what the app does; EXTREME_HEAT is when it says so loudly;
    // WARM is a display tier only. They must stay ordered and distinct.
    eq(core2.FROST_THRESHOLD_F, 35);
    eq(core2.WARM_DAY_THRESHOLD_F, 90);
    eq(core2.HEAT_THRESHOLD_F, 95);
    eq(core2.EXTREME_HEAT_THRESHOLD_F, 98);
    ok(core2.WARM_DAY_THRESHOLD_F < core2.HEAT_THRESHOLD_F, "warm must be below acting-hot");
    ok(core2.HEAT_THRESHOLD_F < core2.EXTREME_HEAT_THRESHOLD_F, "acting-hot must be below extreme");
  });
  it("is what the app actually compares against, everywhere", () => {
    // These were exported and imported by nothing, so 30-odd loose literals had
    // drifted around them. A bare number here means the constant is decorative.
    const fs2 = require("fs");
    const files = [];
    for (const d of ["components", "screens"]) {
      for (const f of fs2.readdirSync(path.join(ROOT, d))) if (f.endsWith(".js")) files.push(path.join(d, f));
    }
    files.push("App.js", "core.js");
    const offenders = [];
    for (const rel of files) {
      const src = fs2.readFileSync(path.join(ROOT, rel), "utf8");
      src.split("\n").forEach((line, i) => {
        if (/(maxTempF\s*>=\s*(90|95|98)\b)|(minTempF\s*<=\s*35\b)/.test(line)) offenders.push(`${rel}:${i + 1}`);
      });
    }
    eq(offenders, []);
  });
  it("drives the frost forecast from the named threshold", () => {
    const at = (t) => core2.getUpcomingFrost({ forecast: [{ date: "d", minTempF: t }] });
    ok(at(core2.FROST_THRESHOLD_F) !== null, "at the threshold it is frost");
    eq(at(core2.FROST_THRESHOLD_F + 1), null, "a degree above it is not");
  });
});

describe("daysBetweenKeys", () => {
  const core3 = require(path.join(ROOT, "core.js"));
  it("counts whole days", () => {
    eq(core3.daysBetweenKeys("2026-06-01", "2026-06-08"), 7);
    eq(core3.daysBetweenKeys("2026-06-01", "2026-06-01"), 0);
    eq(core3.daysBetweenKeys("2026-06-08", "2026-06-01"), -7, "backwards is negative");
  });
  it("survives the clock changing", () => {
    // US spring forward 2026 is 8 March; those local days are 23 hours long, and
    // flooring the gap reports a day that never happened. Only meaningful when
    // the suite runs in a zone that observes it — npm run test:tz covers others.
    eq(core3.daysBetweenKeys("2026-03-07", "2026-03-08"), 1);
    eq(core3.daysBetweenKeys("2026-03-07", "2026-03-09"), 2);
    eq(core3.daysBetweenKeys("2026-03-01", "2026-03-08"), 7);
    eq(core3.daysBetweenKeys("2026-10-26", "2026-11-02"), 7, "autumn back");
    eq(core3.daysBetweenKeys("2026-11-01", "2026-11-02"), 1);
  });
  it("declines an unreadable key rather than returning NaN", () => {
    eq(core3.daysBetweenKeys("nonsense", "2026-06-01"), null);
    eq(core3.daysBetweenKeys(null, undefined), null);
  });
  it("is what the components use, so the fix cannot be undone quietly", () => {
    const fs3 = require("fs");
    const offenders = [];
    for (const rel of ["components/ChoreRotationSection.js", "components/GardenTimelineCard.js"]) {
      const src = fs3.readFileSync(path.join(ROOT, rel), "utf8");
      if (/Math\.floor\([^)]*86400000|Math\.floor\([^)]*1000 \* 60 \* 60 \* 24/.test(src)) offenders.push(rel);
    }
    eq(offenders, []);
  });
});

describe("getTomorrowKey", () => {
  const core4 = require(path.join(ROOT, "core.js"));
  it("is the next calendar day", () => {
    eq(core4.getTomorrowKey(new Date("2026-06-14T09:00:00")), "2026-06-15");
    eq(core4.getTomorrowKey(new Date("2026-12-31T23:00:00")), "2027-01-01", "across the year");
    eq(core4.getTomorrowKey(new Date("2026-02-28T09:00:00")), "2026-03-01", "non-leap February");
  });
  it("agrees with itself at every hour of a clock-change day", () => {
    // Snooze stored the key one way and the badge compared it another, so a
    // plant snoozed late on the night before a spring forward was filed under a
    // day the badge never looked at. Both now come from here — this checks the
    // helper is stable across the awkward hours rather than only at midday.
    const wrong = [];
    for (const day of ["2026-03-07", "2026-03-08", "2026-10-31", "2026-11-01"]) {
      for (let h = 0; h < 24; h += 1) {
        const at = new Date(`${day}T${String(h).padStart(2, "0")}:30:00`);
        if (Number.isNaN(at.getTime())) continue; // a skipped hour in this zone
        const viaHelper = core4.getTomorrowKey(at);
        const byCalendar = (() => { const d = new Date(at); d.setDate(d.getDate() + 1); return core4.getDateKey(d); })();
        if (viaHelper !== byCalendar) wrong.push(`${day} ${h}:30 -> ${viaHelper} vs ${byCalendar}`);
      }
    }
    eq(wrong, []);
  });
  it("is always one day ahead of the key for the same moment", () => {
    for (const day of ["2026-03-07", "2026-03-08", "2026-11-01", "2026-06-14"]) {
      const at = new Date(`${day}T23:30:00`);
      eq(core4.daysBetweenKeys(core4.getDateKey(at), core4.getTomorrowKey(at)), 1, `${day} 23:30`);
    }
  });
  it("is what every caller uses, so store and compare cannot drift apart", () => {
    const fs4 = require("fs");
    const files = ["App.js"];
    for (const d of ["components", "screens"]) {
      for (const f of fs4.readdirSync(path.join(ROOT, d))) if (f.endsWith(".js")) files.push(path.join(d, f));
    }
    const offenders = files.filter((rel) =>
      /Date\.now\(\)\s*\+\s*86400000/.test(fs4.readFileSync(path.join(ROOT, rel), "utf8")));
    eq(offenders, []);
  });
});

describe("frost alert scheduling", () => {
  const core5 = require(path.join(ROOT, "core.js"));
  it("puts frost in the southern winter for southern gardeners", () => {
    core5.setHemisphereFromLatitude(-33.87);
    const south = core5.getFrostSeasonMonths("10a");
    core5.setHemisphereFromLatitude(40.7);
    const north = core5.getFrostSeasonMonths("10a");
    eq(south, [6, 7, 8], "southern frost is the middle of the year");
    eq(north, [1, 2, 12], "northern frost is either end of it");
  });
  it("cancels every month when the switch goes off, not a northern subset", () => {
    // The off path listed [1,2,3,4,5,9,10,11,12], which never names June, July
    // or August — the whole of a southern frost season. For southern zone 10a,
    // whose months are exactly [6,7,8], turning the switch off did nothing.
    // The switch now goes through lib/reminders; the behaviour is checked in
    // "repeating reminders" below. Here: Settings still calls it on the way off.
    const src = require("fs").readFileSync(path.join(ROOT, "screens/SettingsTab.js"), "utf8");
    ok(/await cancelFrostSeasonChecks\(\);/.test(src), "the off path must cancel through the shared helper");
    ok(!/const allMonths = \[1, 2, 3, 4, 5, 9, 10, 11, 12\]/.test(src),
      "the hardcoded northern month list must be gone");
  });
  it("never schedules a month the off path cannot cancel", () => {
    for (const lat of [40.7, -33.87]) {
      core5.setHemisphereFromLatitude(lat);
      for (const zone of ["3a", "4a", "7a", "9b", "10a", "11b"]) {
        for (const month of core5.getFrostSeasonMonths(zone)) {
          ok(month >= 1 && month <= 12, `zone ${zone} at lat ${lat} scheduled month ${month}`);
        }
      }
    }
    core5.setHemisphereFromLatitude(40.7);
  });
});

describe("calendar .ics export", () => {
  const cal = require(path.join(ROOT, "components/CalendarExportSection.js"));
  const field = (ics, name) => ics.split("\r\n").find((l) => l.startsWith(name + ":")).slice(name.length + 1);
  it("starts a recurring reminder at local 8:00 AM, not at a fixed UTC hour", () => {
    // DTSTART used to be written in UTC with a "Z". A recurring event keeps that
    // UTC hour all year, so an 8:00 AM reminder exported in July arrived at 7:00
    // AM from November — and in every zone but UTC this assertion caught it.
    const ics = cal.buildICS("Water", { freq: "DAILY", interval: 2 }, cal.nextEightAM());
    const start = field(ics, "DTSTART");
    ok(/^\d{8}T080000$/.test(start), `DTSTART should be floating 08:00 local, got ${start}`);
    ok(/^\d{8}T081500$/.test(field(ics, "DTEND")), "a quarter of an hour later");
    ok(/Z$/.test(field(ics, "DTSTAMP")), "DTSTAMP is a moment and stays UTC");
  });
  it("dates the start on the local day, even when that is not the UTC day", () => {
    const at = new Date(2026, 6, 1, 8, 0, 0);
    const ics = cal.buildICS("Water", { freq: "WEEKLY", interval: 1 }, at);
    eq(field(ics, "DTSTART"), "20260701T080000");
    eq(field(ics, "RRULE"), "FREQ=WEEKLY;INTERVAL=1");
  });
});

describe("day keys come from the local calendar", () => {
  it("no app code takes a day key from the UTC date", () => {
    // `new Date().toISOString().slice(0, 10)` is the UTC date: tomorrow from 5pm
    // in California, yesterday until 9am in Tokyo. The Plant of the Day was
    // seeded from it and changed in the middle of the afternoon.
    const fs6 = require("fs");
    const files = ["App.js", "core.js"];
    for (const d of ["components", "screens", "lib", "utils"]) {
      for (const f of fs6.readdirSync(path.join(ROOT, d))) if (f.endsWith(".js")) files.push(path.join(d, f));
    }
    const offenders = files.filter((rel) =>
      /new Date\(\)\.toISOString\(\)\.(slice\(0, 10\)|split\("T"\))/.test(fs6.readFileSync(path.join(ROOT, rel), "utf8")));
    eq(offenders, []);
  });
});

describe("the daily bonus card", () => {
  const src = require("fs").readFileSync(path.join(ROOT, "components/DailyBonusCard.js"), "utf8");
  it("hides by calendar day, not by 24 hours from a parsed day key", () => {
    // dailyBonusDate is a "YYYY-MM-DD" key, and new Date() of a bare date is UTC
    // midnight. The card came back at 5pm in California on the day it was
    // claimed, and kept the next day's bonus hidden until 9am in Tokyo.
    ok(!/new Date\(dailyBonusDate\)/.test(src), "the day key must not be parsed as a moment");
    ok(/isSameDayKey\(dailyBonusDate, getTodayKey\(\)\)/.test(src), "compare it with today's key");
  });
  it("a bare day key really is UTC midnight, which is why", () => {
    const parsed = new Date("2026-07-01");
    eq(parsed.toISOString(), "2026-07-01T00:00:00.000Z");
  });
});

describe("the garden timeline", () => {
  const core7 = require(path.join(ROOT, "core.js"));
  it("files a day key under its own day, in every zone", () => {
    // keyOf(new Date("2026-07-01")) is UTC midnight read back as a local day:
    // June 30th anywhere west of Greenwich. Every watering, save and sowing in
    // the Journal timeline sat one day early for gardeners in the Americas.
    const events = core7.buildGardenTimeline({
      wateringHistory: { Tomato: ["2026-07-01"], Basil: ["2026-07-01"] },
      plantSaveDates: { Basil: "2026-07-01" },
      sowLog: { Lettuce: "2026-07-01" },
    });
    eq(events.length, 3);
    for (const e of events) eq(e.dateKey, "2026-07-01", `${e.kind} event`);
    for (const e of events) eq(core7.getDateKey(new Date(e.ts)), "2026-07-01", `${e.kind} timestamp`);
  });
  it("still reads a full timestamp as the moment it was", () => {
    const at = new Date(2026, 6, 1, 21, 30);
    const [e] = core7.buildGardenTimeline({ journalEntries: [{ createdAt: at.toISOString(), plantName: "Tomato" }] });
    eq(e.dateKey, "2026-07-01");
    eq(e.ts, at.getTime());
  });
  it("parseStoredDate reads a day key as local midday", () => {
    const d = core7.parseStoredDate("2026-03-08");
    eq([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()], [2026, 2, 8, 12]);
    ok(Number.isNaN(core7.parseStoredDate("nonsense").getTime()));
  });
  it("seasonal challenges count day keys through it too", () => {
    const src = require("fs").readFileSync(path.join(ROOT, "components/SeasonalChallengesCard.js"), "utf8");
    ok(/const raw = parseStoredDate\(dateVal\)/.test(src));
  });
});

describe("repeating reminders", () => {
  // lib/reminders talks to expo-notifications; load it against a recorder.
  const Module = require("module");
  const calls = [];
  const recorder = {
    cancelScheduledNotificationAsync: async (id) => { calls.push(["cancel", id]); },
    scheduleNotificationAsync: async (req) => { calls.push(["set", req.identifier, req.trigger]); },
    SchedulableTriggerInputTypes: { CALENDAR: "calendar", DAILY: "daily" },
  };
  const prevLoad = Module._load;
  Module._load = function (request, ...rest) {
    return request === "expo-notifications" ? recorder : prevLoad.call(this, request, ...rest);
  };
  const reminders = require(path.join(ROOT, "lib/reminders.js"));
  Module._load = prevLoad;
  const core9 = require(path.join(ROOT, "core.js"));
  const set = () => calls.filter((c) => c[0] === "set").map((c) => c[1]);
  const cancelled = () => calls.filter((c) => c[0] === "cancel").map((c) => c[1]);

  it("arms only the frost months for the zone, and clears the rest first", async () => {
    core9.setHemisphereFromLatitude(-33.87);
    calls.length = 0;
    await reminders.armFrostSeasonChecks("10a");
    eq(set(), ["frost-daily-6", "frost-daily-7", "frost-daily-8"]);
    eq(cancelled().length, 12, "a month that left the season must stop firing");
    // Moving north flips the season; the southern months go.
    core9.setHemisphereFromLatitude(40.7);
    calls.length = 0;
    await reminders.armFrostSeasonChecks("10a");
    eq(set(), ["frost-daily-1", "frost-daily-2", "frost-daily-12"]);
    ok(cancelled().includes("frost-daily-7"));
  });
  it("cancels every frost month on the way off", async () => {
    calls.length = 0;
    await reminders.cancelFrostSeasonChecks();
    eq(cancelled(), Array.from({ length: 12 }, (_, i) => `frost-daily-${i + 1}`));
  });
  it("arms a planting guide on the 1st of every month", async () => {
    calls.length = 0;
    await reminders.armMonthlyPlantingGuides();
    eq(set().length, 12);
    for (const c of calls.filter((x) => x[0] === "set")) eq([c[2].day, c[2].hour, c[2].repeats], [1, 9, true]);
  });
  it("re-arms what a synced switch says is on, on any device", () => {
    // The switches sync; the notifications do not. A new phone, a reinstall, or
    // signing out (which cancels everything) and back in left each switch on
    // with nothing scheduled.
    const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
    const at = app.indexOf("const notificationsAllowed = async");
    const block = app.slice(at, app.indexOf("}, [remindersOn, wateringReminders, savedPlants]);", at));
    ok(at > 0, "there should be a re-arm on launch");
    ok(/armFrostSeasonChecks\(zone\)/.test(block), "frost checks");
    ok(/armMonthlyPlantingGuides\(\)/.test(block), "monthly guides");
    ok(/identifier: "plant-of-day"/.test(block), "the daily plant pick");
    ok(/const id = `plant-\$\{plantName\}`/.test(block), "per-plant check-ins");
    ok(!/ensureNotificationPermission/.test(block), "a re-arm must never prompt");
  });
});

describe("the streak freeze week", () => {
  const core10 = require(path.join(ROOT, "core.js"));
  const wk = (y, m, d, h = 12, min = 0) => core10.getWeekStartKey(new Date(y, m, d, h, min));
  it("runs Monday to Sunday", () => {
    // The hand-rolled week number rolled over going into Saturday in 2026.
    for (let d = 5; d <= 11; d += 1) eq(wk(2026, 0, d), "2026-01-05", `Jan ${d}`);
    eq(wk(2026, 0, 4, 23, 59), "2025-12-29", "Sunday night is still last week");
    eq(wk(2026, 0, 5, 0, 1), "2026-01-05", "Monday just after midnight is the new one");
    eq(wk(2026, 9, 3, 0, 5), wk(2026, 9, 2, 12), "Saturday 00:05 is not a new week");
  });
  it("keeps one key across New Year", () => {
    // Year-prefixed week numbers reset on January 1st, mid-week, and handed out
    // a second freeze for the same week.
    eq(wk(2026, 11, 31), wk(2027, 0, 1));
    eq(wk(2026, 11, 31), "2026-12-28");
  });
  it("is not moved by a clock change", () => {
    eq(wk(2026, 2, 8, 3), "2026-03-02");   // US spring forward, a Sunday
    eq(wk(2026, 2, 9, 0, 30), "2026-03-09");
    eq(wk(2026, 9, 25, 2, 30), "2026-10-19"); // Europe falls back, a Sunday
  });
  it("is what the freeze refresh compares", () => {
    const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
    ok(/const currentWeek = getWeekStartKey\(\);/.test(app));
    ok(!/oneJan\.getDay\(\)/.test(app), "the hand-rolled week number should be gone");
  });
});

describe("daily quests count today's harvests by the local day", () => {
  const core11 = require(path.join(ROOT, "core.js"));
  const today = new Date(2026, 6, 2, 9, 0);
  const lateLast = new Date(2026, 6, 1, 23, 50); // 11:50pm the night before, local
  const key = core11.getDateKey(today);
  it("does not count last night's harvest toward today", () => {
    // Its UTC timestamp falls on today's date anywhere west of Greenwich, and a
    // prefix match on it counted it — including for the "two harvests" quest.
    const log = [
      { date: core11.getDateKey(today), createdAt: today.toISOString() },
      { date: core11.getDateKey(lateLast), createdAt: lateLast.toISOString() },
    ];
    eq(core11.countHarvestsOnDay(log, key), 1);
  });
  it("reads an entry with no day key by its timestamp's local day", () => {
    eq(core11.countHarvestsOnDay([{ createdAt: lateLast.toISOString() }], key), 0);
    eq(core11.countHarvestsOnDay([{ createdAt: today.toISOString() }, null], key), 1);
  });
  it("is what the quests use", () => {
    const src = require("fs").readFileSync(path.join(ROOT, "core.js"), "utf8");
    ok(/const harvestLogToday = countHarvestsOnDay\(harvestLog, today\);/.test(src));
  });
});

describe("the growing season", () => {
  const core15 = require(path.join(ROOT, "core.js"));
  const Y = new Date().getFullYear();
  const at = (y, m, d) => new Date(y, m, d, 12);
  const keys = (s) => [core15.getDateKey(s.lastFrost), core15.getDateKey(s.firstFrost)];
  it("runs spring frost to autumn frost in the north, then rolls to next year", () => {
    core15.setHemisphereFromLatitude(40.7);
    eq(keys(core15.getGrowingSeason("7a", at(Y, 5, 1))), [`${Y}-03-15`, `${Y}-11-15`]);
    eq(keys(core15.getGrowingSeason("7a", at(Y, 11, 1))), [`${Y + 1}-03-15`, `${Y + 1}-11-15`]);
  });
  it("crosses the new year in the south, in the right order", () => {
    // "This year's" southern pair is September then May: backwards. Every
    // harvest landed after that May, so every southern plant read "Tight".
    core15.setHemisphereFromLatitude(-33.87);
    eq(keys(core15.getGrowingSeason("7a", at(Y, 9, 3))), [`${Y}-09-15`, `${Y + 1}-05-15`]);
    eq(keys(core15.getGrowingSeason("7a", at(Y, 1, 1))), [`${Y - 1}-09-15`, `${Y}-05-15`]);
    for (const zone of ["4a", "6b", "8a", "9b"]) {
      const s = core15.getGrowingSeason(zone, at(Y, 9, 3));
      ok(s.firstFrost > s.lastFrost, `${zone}: autumn frost after spring frost`);
    }
    core15.setHemisphereFromLatitude(40.7);
  });
  it("keeps the frost-window check working through a southern spring", () => {
    core15.setHemisphereFromLatitude(-33.87);
    const tomato = (require(path.join(ROOT, "data/produceData.js")).default || require(path.join(ROOT, "data/produceData.js"))).find((p) => p.name === "Tomato");
    const now = new Date();
    const season = core15.getGrowingSeason("7a");
    const info = core15.getFrostMaturityInfo(tomato, "7a");
    ok(info !== null || season.firstFrost <= now, "a season with an autumn frost ahead must be measured");
    if (info) ok(info.daysUntilFrost > 0);
    core15.setHemisphereFromLatitude(40.7);
  });
  it("is what the planting calendar and frost window read", () => {
    const fs15 = require("fs");
    ok(/getGrowingSeason\(zone\)/.test(fs15.readFileSync(path.join(ROOT, "components/PlantingCalendarCard.js"), "utf8")));
    ok(/getGrowingSeason\(zone\)/.test(fs15.readFileSync(path.join(ROOT, "components/FrostWindowCard.js"), "utf8")));
  });
});

describe("advice text in the gardener's units", () => {
  const core18 = require(path.join(ROOT, "core.js"));
  const L = core18.localizeTemperatures;
  it("rewrites Fahrenheit figures for metric, and leaves imperial alone", () => {
    eq(L("Direct sow when soil reaches 60°F.", "metric"), "Direct sow when soil reaches 16°C.");
    eq(L("Warm (60–80°F) days", "metric"), "Warm (16–27°C) days");
    eq(L("below 32°F", "metric"), "below 0°C");
    eq(L("below 32°F", "imperial"), "below 32°F");
    eq(L(undefined, "metric"), undefined);
  });
  it("is applied where the tips are shown", () => {
    const fs18 = require("fs");
    const page = fs18.readFileSync(path.join(ROOT, "screens/PlantDetailScreen.js"), "utf8");
    for (const fn of ["getShouldGrowText", "getWateringTip", "getWhereToPlantText", "getPlantSpecificTip"]) {
      ok(new RegExp(`temps\\(${fn}\\(`).test(page), `${fn} is shown raw`);
    }
    ok(/getPlantingSteps\(selectedPlant\)\.map\(\(step\) => \(typeof step === "string" \? temps\(step\)/.test(page));
    ok(/localizeTemperatures\(disease\.spreads, unitSystem\)/.test(fs18.readFileSync(path.join(ROOT, "components/DiseaseDetailScreen.js"), "utf8")));
  });
});

describe("lengths in the gardener's units", () => {
  const core19 = require(path.join(ROOT, "core.js"));
  const L = (x) => core19.localizeLengths(x, "metric");
  it("converts spacing in every form the tips use", () => {
    eq(L('18" apart'), "46 cm apart");
    eq(L('18"–24" apart'), "46–61 cm apart");
    eq(L("12–24 in apart"), "30–61 cm apart");
    eq(L("about 12 inches apart"), "about 30 cm apart");
    eq(L("4 ft apart"), "1.2 m apart");
    eq(L("2–4 ft apart"), "0.6–1.2 m apart");
    eq(L("1 inch of water"), "2.5 cm of water");
  });
  it("leaves ordinary words and imperial gardeners alone", () => {
    eq(L("plant 2 in a pot"), "plant 2 in a pot");
    eq(L("when the top inch is dry"), "when the top inch is dry");
    eq(core19.localizeLengths('18" apart', "imperial"), '18" apart');
  });
  it("is applied to the plant page's spacing and tips", () => {
    const page = require("fs").readFileSync(path.join(ROOT, "screens/PlantDetailScreen.js"), "utf8");
    ok(/const temps = \(text\) => localizeUnits\(text, unitSystem\)/.test(page));
    ok(/value: temps\(quickFacts\.spacing\)/.test(page));
  });
});

describe("day length", () => {
  const core23 = require(path.join(ROOT, "core.js"));
  const hm = (h) => Math.round(h * 60);
  it("matches the almanac to within a couple of minutes", () => {
    // The geometric formula ran 10-15 minutes short everywhere.
    for (const [lat, y, m, d, minutes, where] of [
      [51.5074, 2026, 5, 21, 16 * 60 + 38, "London, midsummer"],
      [51.5074, 2026, 11, 21, 7 * 60 + 49, "London, midwinter"],
      [40.71, 2026, 5, 21, 15 * 60 + 5, "New York, midsummer"],
      [-33.87, 2026, 11, 21, 14 * 60 + 25, "Sydney, midsummer"],
      [-0.18, 2026, 2, 20, 12 * 60 + 7, "Quito, equinox"],
    ]) {
      const got = hm(core23.getDaylightHours(lat, new Date(y, m, d, 12)));
      ok(Math.abs(got - minutes) <= 3, `${where}: ${got} min, expected ${minutes}`);
    }
  });
  it("still knows the midnight sun and the polar night", () => {
    eq(core23.getDaylightHours(69.65, new Date(2026, 5, 21, 12)), 24);
    eq(core23.getDaylightHours(78.2, new Date(2026, 11, 21, 12)), 0);
  });
});
