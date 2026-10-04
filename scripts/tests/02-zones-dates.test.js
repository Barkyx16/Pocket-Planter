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
    const src = require("fs").readFileSync(path.join(ROOT, "screens/SettingsTab.js"), "utf8");
    ok(/for \(let month = 1; month <= 12; month \+= 1\) \{\s*\n\s*await cancelReminder\(`frost-daily-\$\{month\}`\)/.test(src),
      "the off path must cancel all twelve months");
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

describe("getWeekKey", () => {
  const at = (y, m, d, h = 9, min = 0) => new Date(y, m - 1, d, h, min);
  it("starts the week on Sunday", () => {
    // 2026-10-03 is a Saturday, 10-04 the Sunday after it.
    eq(core.getWeekKey(at(2026, 10, 3)), "2026-09-27");
    eq(core.getWeekKey(at(2026, 10, 4)), "2026-10-04");
    eq(core.getWeekKey(at(2026, 10, 10, 23, 59)), "2026-10-04");
  });
  it("does not roll over on a Saturday", () => {
    // The old week-of-year count refreshed the streak freeze every Saturday.
    eq(core.getWeekKey(at(2026, 10, 2)), core.getWeekKey(at(2026, 10, 3)));
  });
  it("does not move with the clocks", () => {
    // Just after midnight on the Saturday after spring forward (US and EU).
    eq(core.getWeekKey(at(2026, 3, 14, 0, 30)), core.getWeekKey(at(2026, 3, 14, 2, 0)));
    eq(core.getWeekKey(at(2026, 4, 4, 0, 30)), core.getWeekKey(at(2026, 4, 4, 2, 0)));
  });
  it("carries one week across New Year", () => {
    // Thursday 31 Dec and Friday 1 Jan are the same week; a year-prefixed count
    // handed out a second freeze between them.
    eq(core.getWeekKey(at(2026, 12, 31)), core.getWeekKey(at(2027, 1, 1)));
    eq(core.getWeekKey(at(2027, 1, 1)), "2026-12-27");
  });
});

describe("the streak freeze refresh", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("uses getWeekKey", () => {
    const at = app.indexOf('hydrate("pp_streakFreeze"');
    const fn = app.slice(at, app.indexOf("});", at));
    ok(/getWeekKey\(\)/.test(fn), "the refresh must use the shared week key");
    ok(!/oneJan/.test(fn), "no week-of-year arithmetic");
  });
});

describe("the first frost of the season", () => {
  const at = (iso) => new Date(`${iso}T12:00:00`);
  const md = (d) => (d ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` : null);

  it("is this year's in the north, and nothing once it has passed", () => {
    // Zone 7 (moderate): last frost mid March, first frost mid November.
    eq(md(core.getNextFirstFrost("7a", at("2026-02-10"))), "2026-11-15");
    eq(md(core.getNextFirstFrost("7a", at("2026-07-01"))), "2026-11-15");
    eq(core.getNextFirstFrost("7a", at("2026-12-01")), null);
  });
  it("runs into next year in the south", () => {
    // Sydney-ish, zone 7: last frost mid September, first frost mid May.
    core.setHemisphereFromLatitude(-33.87);
    try {
      // Spring: the season that just started ends next May, not this one.
      eq(md(core.getNextFirstFrost("7a", at("2026-10-15"))), "2027-5-15");
      // Late summer: last year's season is still running.
      eq(md(core.getNextFirstFrost("7a", at("2026-02-10"))), "2026-5-15");
      eq(md(core.getFirstFrostAfter("7a", at("2026-09-15"))), "2027-5-15");
    } finally {
      core.setHemisphereFromLatitude(40.7);
    }
  });
  it("lets a southern spring crop be measured at all", () => {
    core.setHemisphereFromLatitude(-33.87);
    try {
      const info = core.getFrostMaturityInfo({ name: "Tomato", type: "Vegetables" }, "7a");
      const now = new Date();
      // Between mid May and mid September it is frost season; October to April
      // must give a real count of days to a frost in the future.
      const m = now.getMonth() + 1;
      if (m >= 10 || m <= 4) {
        ok(info && info.daysUntilFrost > 0, "a southern spring/summer crop must get a frost count");
      }
    } finally {
      core.setHemisphereFromLatitude(40.7);
    }
  });
});

describe("parseStoredDate", () => {
  it("reads a bare day key as that local day", () => {
    // new Date("2026-10-04") is UTC midnight: the 3rd anywhere west of Greenwich.
    eq(core.getDateKey(core.parseStoredDate("2026-10-04")), "2026-10-04");
    eq(core.getDateKey(core.parseStoredDate("2026-03-08")), "2026-03-08"); // US spring forward
  });
  it("reads a timestamp as the instant it is", () => {
    const iso = "2026-10-04T03:30:00.000Z";
    eq(core.parseStoredDate(iso).getTime(), new Date(iso).getTime());
  });
  it("passes invalid input through as invalid", () => {
    ok(Number.isNaN(core.parseStoredDate("nope").getTime()));
    ok(Number.isNaN(core.parseStoredDate(undefined).getTime()));
  });
});

describe("the garden timeline", () => {
  const today = core.getTodayKey();
  const events = core.buildGardenTimeline({
    plantSaveDates: { Tomato: today },
    wateringHistory: { Tomato: [today], Basil: [today] },
    harvestLog: [{ plantName: "Tomato", date: today }],
  });
  it("files today's events under today", () => {
    // Read as UTC, all three were "Yesterday" across the Americas.
    for (const kind of ["plant", "water", "harvest"]) {
      const e = events.find((x) => x.kind === kind);
      ok(e, `${kind} event should exist`);
      eq(e.dateKey, today, `${kind} dateKey`);
      eq(core.getDateKey(new Date(e.ts)), today, `${kind} ts`);
    }
  });
  it("groups a day's waterings into one event on that day", () => {
    const water = events.filter((x) => x.kind === "water");
    eq(water.length, 1);
    eq(water[0].title, "Watered 2 plants");
  });
});

describe("countHarvestsOn", () => {
  const today = core.getTodayKey();
  const y = core.getDateKey(new Date(Date.now() - 86400000 * 1.5));
  it("does not count yesterday evening's harvest today", () => {
    // Its createdAt already reads as today in UTC; its own day is yesterday.
    eq(core.countHarvestsOn([{ date: y, createdAt: `${today}T03:00:00.000Z` }], today), 0);
  });
  it("counts today's, and falls back to the local day of createdAt", () => {
    eq(core.countHarvestsOn([{ date: today }], today), 1);
    eq(core.countHarvestsOn([{ createdAt: new Date().toISOString() }], today), 1);
    eq(core.countHarvestsOn([null, {}], today), 0);
  });
  it("is what the quests use", () => {
    const src = require("fs").readFileSync(path.join(ROOT, "core.js"), "utf8");
    ok(/harvestLogToday = countHarvestsOn\(harvestLog, today\)/.test(src));
  });
});

describe("localizeTemps", () => {
  it("converts every Fahrenheit temperature in advice text for metric", () => {
    eq(core.localizeTemps("Wait until soil reaches 60°F before planting.", "metric"), "Wait until soil reaches 16°C before planting.");
    eq(core.localizeTemps("Warm (60–80°F) days", "metric"), "Warm (16–27°C) days");
    eq(core.localizeTemps("below 32°F and above 95°F", "metric"), "below 0°C and above 35°C");
  });
  it("leaves imperial, and anything that is not text, alone", () => {
    eq(core.localizeTemps("above 95°F", "imperial"), "above 95°F");
    eq(core.localizeTemps(undefined, "metric"), undefined);
    eq(core.localizeTemps("no temperatures here", "metric"), "no temperatures here");
  });
  it("covers every °F the plant and fertilizer advice can produce", () => {
    // Anything left over after conversion is a shape the regex does not know.
    const src = require("fs").readFileSync(path.join(ROOT, "core.js"), "utf8") +
      require("fs").readFileSync(path.join(ROOT, "components/FertilizerIntelligenceCard.js"), "utf8") +
      require("fs").readFileSync(path.join(ROOT, "data/diseaseData.js"), "utf8");
    const strings = src.split("\n").filter((l) => !/^\s*\/\//.test(l) && /°F/.test(l) && /["`]/.test(l));
    const left = strings.map((l) => core.localizeTemps(l, "metric")).filter((l) => /\d\s?°F/.test(l));
    eq(left, []);
  });
});

describe("localizeLengths", () => {
  const m = (s) => core.localizeAdvice(s, "metric");
  it("converts spacing, depth and height in advice text", () => {
    eq(m("Space plants 24–36 inches apart to allow airflow."), "Space plants 61–91 cm apart to allow airflow.");
    eq(m("Space plants 3–4 feet apart"), "Space plants 0.9–1.2 m apart");
    eq(m("10–20 ft apart"), "3–6.1 m apart");
    eq(m("8–18 in apart"), "20–46 cm apart");
    eq(m('Plant 18" apart'), "Plant 46 cm apart");
    eq(m("3 ft apart"), "91 cm apart");
    eq(m("Dig trenches 4 inches deep"), "Dig trenches 10 cm deep");
    eq(m("Add a 2–3 inch layer of mulch"), "Add a 5–7.5 cm layer of mulch");
    eq(m("a 6-inch pot"), "a 15 cm pot");
  });
  it("turns small and fractional depths into millimetres", () => {
    eq(m("Sow seeds 1/8 inch deep"), "Sow seeds 3 mm deep");
    eq(m("sow a quarter inch deep"), "sow 6 mm deep");
    eq(m("cover with half an inch of soil"), "cover with 13 mm of soil");
    eq(m("corn needs 1 inch of water weekly"), "corn needs 2.5 cm of water weekly");
    eq(m("Water when the top inch of soil is dry"), "Water when the top 2–3 cm of soil is dry");
  });
  it("leaves imperial alone, and does temperatures too", () => {
    eq(core.localizeAdvice("Space 18 inches apart above 60°F", "imperial"), "Space 18 inches apart above 60°F");
    eq(m("Space 18 inches apart above 60°F"), "Space 46 cm apart above 16°C");
  });
  it("leaves no inch or foot behind in any advice string", () => {
    const fs = require("fs");
    const src = ["core.js", "data/diseaseData.js", "data/plantHealth.js", "data/flowerHomeData.js"]
      .map((f) => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n");
    const lines = src.split("\n").filter((l) => !/^\s*\/\//.test(l) && !/\.replace\(/.test(l) && /["`]/.test(l)
      && /\d\s?(inch|inches|feet|foot|ft\b)|\d-inch|\d"\s?apart|(eighth|quarter|half) (of )?an? inch|top inch/.test(l));
    ok(lines.length >= 40, `only ${lines.length} advice lines with lengths found`);
    const left = lines.map(m).filter((l) => /\d\s?(inch|inches|feet|foot|ft\b)|\d-inch|\d"\s?apart|(eighth|quarter|half) (of )?an? inch|top inch/.test(l));
    eq(left, []);
  });
});
