const path = require("path");
const { describe, it, eq, ok, ROOT } = require("../test.js");
const core = require(path.join(ROOT, "core.js"));
const produce = require(path.join(ROOT, "data/produceData.js"));
const items = produce.default || produce;
const plant = (n) => items.find((i) => i.name === n);
const ago = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return core.getDateKey(d); };

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
  it("is not thrown by one long break", () => {
    // Twenty waterings two days apart, a 90-day winter, then two more. The mean
    // of every gap said 6 days, and the reminder waited that long in summer.
    const days = [];
    let d = 0;
    days.push(d);
    for (let i = 0; i < 2; i += 1) { d += 2; days.push(d); }
    d += 90; days.push(d);
    for (let i = 0; i < 19; i += 1) { d += 2; days.push(d); }
    const history = days.map((n) => ago(d - n));
    eq(core.getWateringRhythm("Tomato", plant("Tomato"), { Tomato: history }).avgGap, 2);
  });
  it("follows how the plant is watered now, not two seasons ago", () => {
    // Ten weekly waterings, then eight every other day: the last eight gaps rule.
    const days = [];
    let d = 0;
    for (let i = 0; i < 10; i += 1) { days.push(d); d += 7; }
    for (let i = 0; i < 8; i += 1) { days.push(d); d += 2; }
    const last = days[days.length - 1];
    eq(core.getWateringRhythm("Tomato", plant("Tomato"), { Tomato: days.map((n) => ago(last - n)) }).avgGap, 2);
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

describe("getShouldGrowText", () => {
  const plantOf = (n) => items.find((i) => i.name === n);
  const tip = (n, zone) => core.getShouldGrowText(plantOf(n), zone);
  // The generic fallbacks are recognisable by their closing advice; anything else
  // is one of the hand-written tips.
  const GENERIC = /Prepare your soil with compost|It's forgiving, grows quickly|requires more attention but is absolutely worth/;
  const tailored = (n, zone) => !GENERIC.test(tip(n, zone));

  it("has advice for temperate gardeners, who are the largest group", () => {
    // Zones 6-8 had no hand-written tip at all: 454 plants got the generic line.
    for (const n of ["Tomato", "Bell Pepper", "Garlic", "Kale", "Potato", "Strawberry", "Apple"]) {
      ok(tailored(n, "7a"), `${n} has no tailored moderate-zone tip`);
    }
  });
  it("gives temperate advice that is actually about the temperate season", () => {
    ok(/last frost/i.test(tip("Tomato", "7a")));
    ok(/autumn/i.test(tip("Garlic", "7a")), "garlic is an autumn planting");
    ok(/winter chill|chill it needs/i.test(tip("Apple", "7a")), "pome fruit needs the winter");
  });
  it("still has advice for hot and cold zones", () => {
    ok(tailored("Tomato", "10a"));
    ok(tailored("Kale", "4a"));
  });
  it("never gives an ornamental a harvest to look forward to", () => {
    // Sweet Pea is a flower, and the pea tip promised it a productive harvest.
    ok(!tailored("Sweet Pea", "4a"), "Sweet Pea got an edible crop's tip");
    ok(!tailored("Sweet Pea", "7a"));
    ok(!/harvest/i.test(tip("Sweet Pea", "4a")), "ornamental told to expect a harvest");
  });
  it("does not mistake a plant for the crop it is named after", () => {
    // Each of these matches a crop key as a whole word but is a different plant.
    const wrong = [
      ["Sweet Potato", "7a", /seed potatoes/i],
      ["Malabar Spinach", "7a", /bolt/i],
      ["New Zealand Spinach", "4a", /first crops you can plant/i],
      ["Garlic Chives", "7a", /cloves/i],
      ["Black-Eyed Pea", "7a", /stop cropping once the summer heat/i],
      ["Black-Eyed Pea", "4a", /before summer heat arrives/i],
    ];
    for (const [n, zone, pattern] of wrong) {
      if (!plantOf(n)) continue;
      ok(!pattern.test(tip(n, zone)), `${n} in ${zone} got advice for another crop`);
    }
  });
  it("gives sweet potato its own warm-season advice", () => {
    ok(/slips/i.test(tip("Sweet Potato", "7a")), "sweet potato should be planted as slips");
  });
  it("always says something", () => {
    for (const it2 of items) {
      const t = core.getShouldGrowText(it2, "7a");
      ok(typeof t === "string" && t.length > 40, `${it2.name}: ${t}`);
    }
  });
});

describe("getWhereToPlantText", () => {
  const plantOf = (n) => items.find((i) => i.name === n);
  it("never contradicts the sun badge shown beside it", () => {
    // 109 partial/shade plants were told to find the sunniest spot they had.
    const wrong = items.filter((i) => {
      const need = core.getPlantSunNeed(i).need;
      return (need === "partial" || need === "shade") && /sunniest spot/.test(core.getWhereToPlantText(i));
    });
    eq(wrong.map((i) => i.name), []);
  });
  it("uses the authored spacing rather than a generic sentence", () => {
    ok(/8 inches/.test(core.getWhereToPlantText(plantOf("Lettuce"))), "lettuce spacing");
    ok(/24 inches/.test(core.getWhereToPlantText(plantOf("Tomato"))), "tomato spacing");
  });
  it("treats a tree as a long-term planting, in feet", () => {
    const apple = core.getWhereToPlantText(plantOf("Apple"));
    ok(/ft of clear ground/.test(apple), apple);
    ok(/years/.test(apple), "a tree should be described as a long commitment");
  });
  it("warns tropical fruit about frost", () => {
    ok(/frost/i.test(core.getWhereToPlantText(plantOf("Mango"))));
  });
  it("says whether a pot will do", () => {
    ok(/pot|container/i.test(core.getWhereToPlantText(plantOf("Basil"))), "basil takes a container");
    ok(/open ground rather than a pot/.test(core.getWhereToPlantText(plantOf("Corn"))), "corn does not");
  });
  it("produces a clean sentence for every plant", () => {
    const bad = items.filter((i) => {
      const t = core.getWhereToPlantText(i);
      return !t.endsWith(".") || /\.\.|\s\.|,\s*\.| {2,}|undefined|NaN|null/.test(t) || t.length < 40;
    });
    eq(bad.map((i) => i.name), []);
  });
});

describe("matchesCrop", () => {
  it("keeps the real crop", () => {
    for (const [n, k] of [["Potato", "potato"], ["Corn", "corn"], ["Tomato", "tomato"],
                          ["Spinach", "spinach"], ["Snap Pea", "pea"], ["Garlic", "garlic"]]) {
      ok(core.matchesCrop(n, k), `${n} should match ${k}`);
    }
  });
  it("sees a crop hidden inside a longer name", () => {
    // Popcorn is maize and wants the same block planting; Broccolini is broccoli.
    ok(core.matchesCrop("Popcorn", "corn"));
    ok(core.matchesCrop("Broccolini", "broccoli"));
  });
  it("keeps the look-alikes out even so", () => {
    for (const [n, k] of [["Acorn Squash", "corn"], ["Cornflower", "corn"],
                          ["Cornelian Cherry", "corn"], ["Corn Salad (Mache)", "corn"]]) {
      ok(!core.matchesCrop(n, k), `${n} must not be treated as ${k}`);
    }
  });
  it("drops the plants that only borrow the name", () => {
    for (const [n, k] of [["Sweet Potato", "potato"], ["Corn Salad (Mache)", "corn"],
                          ["Tamarillo (Tree Tomato)", "tomato"], ["Malabar Spinach", "spinach"],
                          ["New Zealand Spinach", "spinach"], ["Water Spinach (Kangkong)", "spinach"],
                          ["Black-Eyed Pea", "pea"], ["Garlic Chives", "garlic"]]) {
      ok(!core.matchesCrop(n, k), `${n} must not be treated as ${k}`);
    }
  });
});

describe("getPlantingSteps", () => {
  const plantOf = (n) => items.find((i) => i.name === n);
  const steps = (n) => core.getPlantingSteps(plantOf(n)).join(" ");
  it("keeps the hand-written guides for the crops that have one", () => {
    ok(/bury the stem/i.test(steps("Tomato")), "tomato guide");
    ok(/seed potatoes/i.test(steps("Potato")), "potato guide");
  });
  it("does not hand a guide to a plant that only shares the name", () => {
    ok(!/bury the stem/i.test(steps("Tamarillo (Tree Tomato)")), "tamarillo is a tree");
    ok(!/seed potatoes/i.test(steps("Sweet Potato")), "sweet potato grows from slips");
    if (plantOf("Corn Salad (Mache)")) ok(!/block|pollinat/i.test(steps("Corn Salad (Mache)")), "mache is not sweetcorn");
    ok(!/summer heat/i.test(steps("Malabar Spinach")), "malabar spinach likes the heat");
  });
  it("builds real steps from the authored data instead of one generic list", () => {
    const bok = steps("Bok Choy");
    ok(/half an inch deep/.test(bok), `sowing depth missing: ${bok}`);
    ok(/8 inches apart/.test(bok), "spacing missing");
    ok(/morning sun and afternoon shade/.test(bok), "partial-shade plant not told so");
    ok(/50 days/.test(bok), "days to maturity missing");
  });
  it("describes a tree's spacing as the room it will fill", () => {
    ok(/30 ft/.test(steps("Mango")), "tree spacing in feet");
    ok(!/leaves can dry/.test(steps("Mango")), "wrong reason for a tree's spacing");
  });
  it("tells a perennial it will come back", () => {
    ok(/comes back next year/.test(steps("Grapes")));
  });
  it("gives every plant at least four usable steps", () => {
    const bad = items.filter((i) => {
      const st = core.getPlantingSteps(i);
      return !Array.isArray(st) || st.length < 4 ||
        st.some((x) => typeof x !== "string" || !x.endsWith(".") || /undefined|NaN|null| {2,}/.test(x));
    });
    eq(bad.map((i) => i.name), []);
  });
});

describe("getPlantingGuide", () => {
  const details = require(path.join(ROOT, "data/plantDetails.js")).PLANT_DETAILS;
  const plantOf = (n) => items.find((i) => i.name === n);
  it("never says full sun for a plant that wants shade", () => {
    // 111 plants were shown "Full sun" while the badge beside them said otherwise.
    const wrong = items.filter((i) => {
      const need = core.getPlantSunNeed(i).need;
      return (need === "partial" || need === "shade") && /^Full sun/.test(core.getPlantingGuide(i).sun);
    });
    eq(wrong.map((i) => i.name), []);
  });
  it("shows the plant's own spacing, not its category's range", () => {
    // Nearly half the catalog was shown a range that excluded its own value.
    const wrong = items.filter((i) => {
      const authored = (details[i.name] || {}).spacingInches;
      if (typeof authored !== "number") return false;
      const shown = core.getPlantingGuide(i).spacing;
      const inches = /ft/.test(shown) ? parseFloat(shown) * 12 : parseFloat(shown);
      return Math.abs(inches - authored) > 0.6;
    });
    eq(wrong.map((i) => i.name), []);
  });
  it("keeps the curated answer where nothing is authored", () => {
    // Trees author no sowing depth, and Number(null) is 0 — which read "Surface".
    eq(core.getPlantingGuide(plantOf("Apple")).depth, "Root ball depth");
    eq(core.getPlantingGuide(plantOf("Mango")).depth, "Root ball depth");
  });
  it("measures beds in inches and orchards in feet", () => {
    eq(core.getPlantingGuide(plantOf("Tomato")).spacing, '24"');
    eq(core.getPlantingGuide(plantOf("Apple")).spacing, "20 ft");
  });
  it("does not hand a look-alike another crop's guide", () => {
    // Corn Salad had sweetcorn's depth and spacing; Popcorn had none of corn's.
    if (plantOf("Corn Salad (Mache)")) {
      const mache = core.getPlantingGuide(plantOf("Corn Salad (Mache)"));
      ok(/partial/.test(mache.sun), `mache should not be full sun: ${mache.sun}`);
    }
    eq(core.getPlantingGuide(plantOf("Popcorn")).germ, core.getPlantingGuide(plantOf("Corn")).germ);
  });
  it("fills every field for every plant", () => {
    const bad = items.filter((i) => {
      const g = core.getPlantingGuide(i);
      return ["depth", "spacing", "sun", "germ"].some((k) => !g[k] || /undefined|NaN|null/.test(String(g[k])));
    });
    eq(bad.map((i) => i.name), []);
  });
});

describe("getPlantHealthStatus", () => {
  const plantOf = (n) => items.find((i) => i.name === n);
  const ago = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return core.getDateKey(d); };
  const status = (name, daysAgo, weather) => {
    const item = plantOf(name);
    const when = daysAgo == null ? null : ago(daysAgo);
    return core.getPlantHealthStatus({
      plantName: name, item,
      wateredPlants: when ? { [name]: when } : {},
      wateringHistory: when ? { [name]: [when] } : {},
      weather,
    }).label;
  };
  it("agrees with the watering schedule instead of the calendar", () => {
    // Everything not watered since midnight used to read Needs Water, so an
    // apple on a five-day interval wore the badge four days out of five.
    for (const [name, days] of [["Tomato", 1], ["Apple", 1], ["Apple", 3], ["Basil", 1]]) {
      const item = plantOf(name);
      const when = ago(days);
      const next = core.getNextWaterInfo(name, item, { [name]: [when] }, { [name]: when }, null);
      const due = next.daysUntil <= 0;
      eq(status(name, days) === "Needs Water", due, `${name} watered ${days}d ago`);
    }
  });
  it("asks for water once the interval is actually up", () => {
    eq(status("Tomato", 3), "Needs Water");
    eq(status("Apple", 5), "Needs Water");
    eq(status("Tomato", 0), "Healthy");
  });
  it("treats a plant that has never been watered as thirsty", () => {
    eq(status("Tomato", null), "Needs Water");
  });
  it("puts frost and heat ahead of thirst", () => {
    eq(status("Tomato", 0, { minTempF: 30 }), "Frost Risk");
    eq(status("Tomato", 5, { maxTempF: 99 }), "Heat Stressed");
  });
  it("holds off when rain is coming, like the schedule does", () => {
    eq(status("Tomato", 5, { precipChance: 90 }), "Healthy");
  });
  it("still answers without a plant object", () => {
    // Older call shape: no interval to reason about, so fall back to the day.
    eq(core.getPlantHealthStatus({ plantName: "Tomato", wateredPlants: { Tomato: ago(1) }, weather: null }).label, "Needs Water");
    eq(core.getPlantHealthStatus({ plantName: "Tomato", wateredPlants: { Tomato: core.getTodayKey() }, weather: null }).label, "Healthy");
  });
});

describe("one rule for 'needs water today'", () => {
  const today = core.getTodayKey();
  it("a plant on a long rhythm is not due the day after watering", () => {
    // My Garden Today counted every plant not watered since midnight, so rosemary
    // and the fruit trees "needed water" every day of their interval.
    const rosemary = plant("Rosemary");
    const interval = core.getBaseWaterInterval(rosemary);
    ok(interval > 1, "rosemary should be on a multi-day rhythm");
    eq(core.isWaterDue("Rosemary", rosemary, {}, { Rosemary: [ago(1)] }, null), false);
    eq(core.isWaterDue("Rosemary", rosemary, {}, { Rosemary: [ago(interval)] }, null), true);
  });
  it("watered today is never due, and never-watered always is", () => {
    const tomato = plant("Tomato");
    eq(core.isWaterDue("Tomato", tomato, { Tomato: today }, { Tomato: [ago(30)] }, null), false);
    eq(core.isWaterDue("Tomato", tomato, {}, {}, null), true);
  });
  it("agrees with the health badge", () => {
    for (const [name, days] of [["Tomato", 0], ["Tomato", 3], ["Rosemary", 1], ["Rosemary", 20]]) {
      const item = plant(name);
      const history = { [name]: [ago(days)] };
      const badge = core.getPlantHealthStatus({ plantName: name, item, wateredPlants: {}, wateringHistory: history, weather: null });
      eq(badge.label === "Needs Water", core.isWaterDue(name, item, {}, history, null), `${name} ${days}d`);
    }
  });
  it("is what Home and the widget ask", () => {
    const card = require("fs").readFileSync(path.join(ROOT, "components/MyGardenTodayCard.js"), "utf8");
    ok(/isWaterDue\(p, produceData\.find/.test(card), "My Garden Today");
    const snap = core.buildWidgetSnapshot({
      savedPlantObjs: [plant("Rosemary"), plant("Tomato")],
      wateredPlants: {}, wateringHistory: { Rosemary: [ago(1)] },
    });
    eq(snap.waterDue.names, ["Tomato"], "the widget counts the never-watered tomato, not the rosemary");
  });
});

describe("the 'needs water' sort and map border use the same rule", () => {
  const fs14 = require("fs");
  it("Plants sorted by 'Needs water' agree with their own badges", () => {
    const src = fs14.readFileSync(path.join(ROOT, "components/SavedPlantsCard.js"), "utf8");
    ok(/const aNeeds = isWaterDue\(a\.name, a, wateredPlants, wateringHistory, weather\)/.test(src));
    ok(!/wateredPlants\?\.\[a\.name\] !== today/.test(src));
  });
  it("the garden map's blue border follows the schedule", () => {
    const src = fs14.readFileSync(path.join(ROOT, "components/AreaPlannerMap.js"), "utf8");
    ok(/const needsWater = plantName && isWaterDue\(plantName, plant, wateredPlants, wateringHistory, weather\)/.test(src));
    for (const tab of ["screens/GardenTab.js", "screens/FlowerTab.js"]) {
      ok(/wateringHistory=\{wateringHistory\}/.test(fs14.readFileSync(path.join(ROOT, tab), "utf8")), `${tab} passes the history`);
    }
  });
});

describe("getPlantSeasonLabel", () => {
  const zoneFor = (item) => `${item.minZone}a`;
  it("names next year's window once this year's has passed", () => {
    // It said "Out of season" from the last window to New Year.
    const produceList = items.filter((i) => i.minZone && i.maxZone);
    let checked = 0;
    for (const p of produceList.slice(0, 80)) {
      const zone = zoneFor(p);
      const label12 = core.getPlantSeasonLabel(p, zone, 12);
      if (label12 === "Outside your zone" || label12 === "Zone fit") continue;
      ok(label12 === "Plant now" || /^Starts in [A-Z][a-z]+$/.test(label12), `${p.name} in December: ${label12}`);
      checked += 1;
    }
    ok(checked > 10, `only ${checked} plants were checked`);
  });
  it("points a tomato in December at next spring", () => {
    const tomato = plant("Tomato");
    const label = core.getPlantSeasonLabel(tomato, zoneFor(tomato), 12);
    ok(/^Starts in (January|February|March|April|May)$/.test(label), `got ${label}`);
  });
});

describe("season labels in the gardener's language", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("translates for display and leaves the English the code compares with", () => {
    eq(core.translateSeasonLabel("Plant now"), "Plant now");
    eq(core.translateSeasonLabel("Starts in March"), "Starts in March");
    i18n.setLocale("es");
    eq(core.translateSeasonLabel("Plant now"), "Plantar ya");
    ok(/^Empieza en marzo$/i.test(core.translateSeasonLabel("Starts in March")), core.translateSeasonLabel("Starts in March"));
    i18n.setLocale("de");
    ok(/^Ab März$/.test(core.translateSeasonLabel("Starts in March")), core.translateSeasonLabel("Starts in March"));
    i18n.setLocale("en");
    eq(core.getPlantSeasonLabel(plant("Tomato"), "7a", 4), "Plant now", "the logic still speaks English");
  });
  it("is used wherever the label is shown", () => {
    const fs21 = require("fs");
    for (const f of ["components/EmptyGardenStarterCard.js", "screens/PlantsTab.js", "screens/PlantDetailScreen.js"]) {
      ok(/translateSeasonLabel\(/.test(fs21.readFileSync(path.join(ROOT, f), "utf8")), f);
    }
  });
});

describe("watering words in the gardener's language", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("reads the same in English, with real plurals", () => {
    eq(core.getLastWateredText("T", {}, { T: [ago(3)] }), "Watered 3 days ago");
    eq(core.getLastWateredText("T", {}, { T: [ago(21)] }), "Watered 3 weeks ago");
    eq(core.getLastWateredText("T", {}, { T: [ago(7)] }), "Watered 7 days ago");
  });
  it("speaks Spanish when the app does", () => {
    i18n.setLocale("es");
    try {
      eq(core.getLastWateredText("T", {}, { T: [ago(0)] }), "Regada hoy");
      eq(core.getLastWateredText("T", {}, { T: [ago(3)] }), "Regada hace 3 días");
      const tomato = plant("Tomato");
      const nw = core.getNextWaterInfo("Tomato", tomato, { Tomato: [ago(30)] }, {}, null);
      eq(nw.label, "Toca regar hoy");
      eq(nw.urgency, "due", "the logic is untouched");
      const badge = core.getPlantHealthStatus({ plantName: "Tomato", item: tomato, wateredPlants: {}, wateringHistory: { Tomato: [ago(30)] }, weather: null });
      eq([badge.label, badge.text], ["Needs Water", "Necesita agua"]);
    } finally {
      i18n.setLocale("en");
    }
  });
});

describe("plant types in the gardener's language", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("labels every type, and leaves the English the filters compare with", () => {
    for (const type of core.PLANT_TYPES) ok(core.typeLabel(type) && core.typeLabel(type) !== `plantTypes.${type}`, type);
    eq(core.typeLabel("Tree Fruits"), "Tree Fruits");
    i18n.setLocale("de");
    eq(core.typeLabel("Vegetables"), "Gemüse");
    eq(core.typeLabel("Herbs"), "Kräuter");
    i18n.setLocale("en");
    eq(core.normalizeType("Vegetable", "Carrot"), "Vegetables", "the data stays English");
  });
});

describe("difficulty in the gardener's language", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("translates for display and keeps the English the filter uses", () => {
    i18n.setLocale("es");
    try {
      const d = core.getPlantDifficulty(plant("Basil"));
      eq([d.label, d.labelText, d.text], ["Easy", "Fácil", "Ideal para principiantes"]);
      eq(core.difficultyLabel("Hard"), "Difícil");
      eq(core.difficultyLabel("All"), "Todas");
    } finally {
      i18n.setLocale("en");
    }
    eq(core.getPlantDifficulty(plant("Basil")).labelText, "Easy");
  });
});

describe("the Plants tab and harvest countdown in the gardener's language", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("reads the same in English", () => {
    ok(/^~\d+ day harvest$/.test(core.getHarvestCountdown(plant("Tomato"))), core.getHarvestCountdown(plant("Tomato")));
  });
  it("translates the countdown", () => {
    i18n.setLocale("fr");
    try { ok(/^Récolte en ~\d+ jours$/.test(core.getHarvestCountdown(plant("Tomato"))), core.getHarvestCountdown(plant("Tomato"))); }
    finally { i18n.setLocale("en"); }
  });
  it("has no English sentences left in the Plants tab", () => {
    const src = require("fs").readFileSync(path.join(ROOT, "screens/PlantsTab.js"), "utf8");
    for (const phrase of ["Container-friendly\"", "This month's picks locked", "isn't a prime planting window", "Nothing matches \"${", "match right now", "Unlock all {filteredPlants", "month.slice(0, 3)", "[\"Difficulty\","]) {
      ok(!src.includes(phrase), `PlantsTab still has "${phrase}"`);
    }
  });
});

describe("the stats dashboard's watering to-do", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("counts plants that are due, by the shared rule", () => {
    const src = require("fs").readFileSync(path.join(ROOT, "components/GardenStatsDashboard.js"), "utf8");
    ok(/const plantsNeedingWater = savedPlants\.filter\(\(name\) =>\s*isWaterDue\(/.test(src));
    ok(!/const plantsNeedingWater = savedPlants\.length - wateredTodayCount/.test(src));
    ok(/tn\("gardenStatsDashboard\.dashWaterAllNow", plantsUnwateredToday\)/.test(src), "the button counts what it waters");
  });
  it("says 'needs' for one plant", () => {
    eq(i18n.tn("gardenStatsDashboard.dashPlantsNeedWater", 1), "1 plant needs watering");
  });
});

describe("every 'need water' count uses the shared rule", () => {
  it("in the garden map's bed summary, Garden Intelligence and Live Weather", () => {
    const fs28 = require("fs");
    for (const f of ["components/AreaPlannerMap.js", "components/GardenIntelligenceCard.js", "components/LiveWeatherCard.js"]) {
      const src = fs28.readFileSync(path.join(ROOT, f), "utf8");
      ok(!/wateredPlants\?\.\[(n|p)\] !== today/.test(src), `${f} still counts "not watered today"`);
      ok(/isWaterDue\(/.test(src), `${f} should ask isWaterDue`);
    }
    const tab = fs28.readFileSync(path.join(ROOT, "screens/WeatherTab.js"), "utf8");
    eq((tab.match(/wateringHistory=\{wateringHistory\}/g) || []).length >= 3, true, "the Weather tab passes the history down");
  });
});

describe("the watering queue", () => {
  it("includes a plant that has never been watered, as due today", () => {
    // It needed a first watering before it could join the queue.
    const rows = core.getWaterTriage(["Tomato"], {}, {}, null);
    eq(rows.map((r) => [r.name, r.bucket]), [["Tomato", "today"]]);
    eq(core.getWaterTriage(["Tomato"], {}, { Tomato: core.getTodayKey() }, null), [], "watered today is not queued");
  });
  it("agrees with isWaterDue for every plant it lists as overdue or today", () => {
    const names = ["Tomato", "Basil", "Rosemary", "Lettuce"];
    const history = { Tomato: [ago(9)], Basil: [ago(1)], Rosemary: [ago(30)] };
    for (const r of core.getWaterTriage(names, history, {}, null)) {
      if (r.bucket !== "tomorrow") eq(core.isWaterDue(r.name, plant(r.name), {}, history, null), true, r.name);
    }
  });
});
