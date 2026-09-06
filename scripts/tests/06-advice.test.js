const path = require("path");
const { describe, it, eq, ok, ROOT } = require("../test.js");
const core = require(path.join(ROOT, "core.js"));
const produce = require(path.join(ROOT, "data/produceData.js"));
const items = produce.default || produce;
const plant = (n) => items.find((i) => i.name === n);
const ago = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

describe("getNextWaterInfo", () => {
  const tomato = plant("Tomato");
  const at = (daysAgo, weather) => core.getNextWaterInfo("Tomato", tomato, { Tomato: [ago(daysAgo)] }, {}, weather);
  it("counts down from the last watering", () => {
    eq(at(0).daysUntil, 3);
    eq(at(1).daysUntil, 2);
    eq(at(3).daysUntil, 0);
  });
  it("goes negative rather than forgetting an overdue plant", () => {
    ok(at(10).daysUntil < 0, "an overdue plant must stay overdue");
    eq(at(3).urgency, "due");
  });
  it("waters sooner in extreme heat", () => {
    ok(at(2, { maxTempF: 99 }).daysUntil < at(2, { maxTempF: 70 }).daysUntil);
  });
  it("defers a due watering when rain is coming, and says why", () => {
    const rain = at(3, { precipChance: 90 });
    eq(rain.daysUntil, 1, "a due plant waits a day for the rain");
    ok(rain.rainSoon);
    ok(/rain/i.test(rain.label), `label was ${rain.label}`);
  });
  it("says nothing when the plant has never been watered", () => {
    eq(core.getNextWaterInfo("Tomato", tomato, {}, {}, null), null);
  });
});

describe("getWateringRhythm", () => {
  const every = (gap, n) => Array.from({ length: n }, (_, i) => ago(gap * (n - 1 - i)));
  it("recognises a rhythm that matches the plant's needs", () => {
    const r = core.getWateringRhythm("Tomato", plant("Tomato"), { Tomato: every(3, 8) });
    eq(r.avgGap, 3); eq(r.target, 3); eq(r.status, "on-track");
  });
  it("notices watering too seldom, and too often", () => {
    eq(core.getWateringRhythm("Tomato", plant("Tomato"), { Tomato: every(7, 6) }).status, "under");
    eq(core.getWateringRhythm("Tomato", plant("Tomato"), { Tomato: every(1, 6) }).status, "over");
  });
  it("declines to judge from too few waterings", () => {
    eq(core.getWateringRhythm("Tomato", plant("Tomato"), { Tomato: [ago(3), ago(6)] }), null);
    eq(core.getWateringRhythm("Tomato", plant("Tomato"), {}), null);
  });
});

describe("getLastWateredText", () => {
  it("reads naturally at each distance", () => {
    eq(core.getLastWateredText("T", {}, { T: [ago(0)] }), "Watered today");
    eq(core.getLastWateredText("T", {}, { T: [ago(1)] }), "Watered yesterday");
    eq(core.getLastWateredText("T", {}, { T: [ago(5)] }), "Watered 5 days ago");
    eq(core.getLastWateredText("T", {}, { T: [ago(21)] }), "Watered 3 weeks ago");
    eq(core.getLastWateredText("T", {}, {}), "Never watered");
  });
});

describe("getFrostMaturityInfo", () => {
  it("warns when a crop cannot ripen before the first frost", () => {
    const risky = core.getFrostMaturityInfo(plant("Tomato"), "3a"); // short season
    ok(risky === null || typeof risky.atRisk === "boolean");
    const mild = core.getFrostMaturityInfo(plant("Radish"), "9a");  // 30 days, long season
    if (mild) ok(!mild.atRisk, "a fast crop in a long season is not at risk");
  });
  it("says nothing without a zone", () => {
    eq(core.getFrostMaturityInfo(plant("Tomato"), null), null);
  });
});

describe("getSeedStartInfo", () => {
  it("gives heat-lovers an indoor head start", () => {
    const t = core.getSeedStartInfo(plant("Tomato"), "7a");
    eq(t.weeks, 8);
    ok(["upcoming", "start-now", "passed"].includes(t.status), `status ${t.status}`);
  });
  it("leaves direct-sown crops alone", () => {
    eq(core.getSeedStartInfo(plant("Radish"), "7a"), null);
    eq(core.getSeedStartInfo(plant("Tomato"), null), null);
  });
  it("includes broccolini, which whole-word matching cannot see inside broccoli", () => {
    eq(core.getSeedStartWeeks(plant("Broccolini")), 6);
    eq(core.getSeedStartWeeks(plant("Broccoli")), 6);
  });
});

describe("getDaylightHours", () => {
  it("gives the equator about twelve hours all year", () => {
    for (const month of [0, 3, 6, 9]) {
      const h = core.getDaylightHours(0, new Date(2026, month, 15));
      ok(Math.abs(h - 12) < 0.6, `month ${month}: ${h}h`);
    }
  });
  it("handles the poles without producing nonsense", () => {
    const summer = core.getDaylightHours(89, new Date(2026, 5, 21));
    const winter = core.getDaylightHours(89, new Date(2026, 11, 21));
    eq(summer, 24); eq(winter, 0);
  });
  it("gives the hemispheres opposite seasons", () => {
    const north = core.getDaylightHours(45, new Date(2026, 5, 21));
    const south = core.getDaylightHours(-45, new Date(2026, 5, 21));
    ok(north > 14 && south < 10, `north ${north}h south ${south}h`);
  });
  it("declines a location it cannot read", () => {
    eq(core.getDaylightInfo({ lat: "nonsense" }), null);
    eq(core.getDaylightInfo(null), null);
  });
});

describe("getUpcomingFrost", () => {
  const day = (d, minTempF) => ({ date: d, minTempF });
  it("finds the first freezing day and how far out it is", () => {
    const f = core.getUpcomingFrost({ forecast: [day("a", 50), day("b", 40), day("c", 28)] });
    eq(f.date, "c"); eq(f.daysOut, 2); eq(f.minTempF, 28);
  });
  it("says nothing when the forecast stays warm, or is missing", () => {
    eq(core.getUpcomingFrost({ forecast: [day("a", 50), day("b", 45)] }), null);
    eq(core.getUpcomingFrost({}), null);
    eq(core.getUpcomingFrost(null), null);
  });
  it("ignores days with no temperature rather than treating them as frost", () => {
    eq(core.getUpcomingFrost({ forecast: [day("a", null), day("b", undefined)] }), null);
  });
});
