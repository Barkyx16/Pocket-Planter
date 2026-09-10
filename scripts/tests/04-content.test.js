const fs = require("fs");
const path = require("path");
const { describe, it, eq, ok, ROOT } = require("../test.js");
const core = require(path.join(ROOT, "core.js"));
const produce = require(path.join(ROOT, "data/produceData.js"));
const items = produce.default || produce;
const names = items.map((i) => i.name);
const nameSet = new Set(names);
const details = require(path.join(ROOT, "data/plantDetails.js")).PLANT_DETAILS;
const health = require(path.join(ROOT, "data/plantHealth.js")).PLANT_HEALTH;
const fh = require(path.join(ROOT, "data/flowerHomeData.js"));
const asList = (v) => (v instanceof Set ? [...v] : Object.keys(v || {}));

describe("catalog", () => {
  it("has no duplicate names", () => {
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    eq([...new Set(dupes)], []);
  });
  it("gives every plant all seven fields", () => {
    const missing = items.filter((i) =>
      !i.name || !i.type || !i.image || !i.minZone || !i.maxZone ||
      !Array.isArray(i.plantMonths) || !i.notes);
    eq(missing.map((i) => i.name), []);
  });
  it("has parseable, non-inverted zone ranges", () => {
    const zn = (z) => { const m = /^(\d{1,2})([ab])?$/.exec(String(z).trim()); return m ? Number(m[1]) + (m[2] === "b" ? 0.5 : 0) : null; };
    const bad = items.filter((i) => { const a = zn(i.minZone), b = zn(i.maxZone); return a === null || b === null || a > b; });
    eq(bad.map((i) => `${i.name} ${i.minZone}-${i.maxZone}`), []);
  });
  it("has valid, sorted, duplicate-free planting months", () => {
    const bad = items.filter((i) => {
      const m = i.plantMonths;
      return !m.length || m.some((v) => !Number.isInteger(v) || v < 1 || v > 12) ||
        new Set(m).size !== m.length || m.some((v, k) => k && v < m[k - 1]);
    });
    eq(bad.map((i) => `${i.name} ${JSON.stringify(i.plantMonths)}`), []);
  });
  it("uses only known types", () => {
    const known = new Set(["Vegetable", "Berry", "Fruit", "Fruit Tree", "Herb", "Flower", "Houseplant", "Nut", "Grain"]);
    eq(items.filter((i) => !known.has(i.type)).map((i) => i.name), []);
  });
  it("shows a real photo for every plant, never the fallback leaf", () => {
    const src = fs.readFileSync(path.join(ROOT, "core.js"), "utf8");
    const seg = src.slice(src.indexOf("plantImages"));
    const keys = new Set([...seg.matchAll(/^\s*([A-Za-z0-9_]+)\s*:\s*require\("\.\/assets\/plants\//gm)].map((m) => m[1]));
    eq(items.filter((i) => !keys.has(i.image)).map((i) => `${i.name} (${i.image})`), []);
  });
  it("carries growing detail and health data for every plant, and none for a plant that is gone", () => {
    eq(names.filter((n) => !details[n]), []);
    eq(names.filter((n) => !health[n]), []);
    eq(Object.keys(details).filter((n) => !nameSet.has(n)), []);
    eq(Object.keys(health).filter((n) => !nameSet.has(n)), []);
  });
});

describe("supporting tables", () => {
  it("reference plants that actually exist", () => {
    const tables = {
      FLOWER_COLORS: fh.FLOWER_COLORS, DEADHEAD_TIPS: fh.DEADHEAD_TIPS, DRIES_WELL: fh.DRIES_WELL,
      HOUSEPLANT_CARE: fh.HOUSEPLANT_CARE, PET_TOXIC: fh.PET_TOXIC, PET_SAFE: fh.PET_SAFE,
      FRAGRANT: fh.FRAGRANT, EVENING_SCENTED: fh.EVENING_SCENTED, AIR_PURIFYING: fh.AIR_PURIFYING,
    };
    for (const [label, table] of Object.entries(tables)) {
      eq(asList(table).filter((n) => !nameSet.has(n)), [], label);
    }
  });
});

describe("pet safety", () => {
  it("never calls a toxic plant safe", () => {
    const toxic = new Set(asList(fh.PET_TOXIC));
    eq(asList(fh.PET_SAFE).filter((n) => toxic.has(n)), []);
  });
  it("flags the plants that actually hurt cats and dogs", () => {
    // Alliums damage red blood cells; the rest are common, well-documented cases.
    for (const n of ["Onion", "Garlic", "Chives", "Leek", "Shallot", "Lily",
                     "Foxglove", "Azalea", "Rhubarb", "Macadamia", "Cyclamen"]) {
      if (!nameSet.has(n)) continue;
      ok(fh.PET_TOXIC[n], `${n} is not flagged as toxic`);
    }
  });
  it("describes every toxic plant with a known severity and a note", () => {
    const sev = new Set(["severe", "toxic", "mild"]);
    const bad = Object.entries(fh.PET_TOXIC).filter(([, v]) =>
      !Array.isArray(v) || !sev.has(v[0]) || !v[1] || String(v[1]).length < 10);
    eq(bad.map(([n]) => n), []);
  });
});

describe("pest and disease libraries", () => {
  it("resolve every pest and disease a plant names", () => {
    const badPests = new Set(), badDiseases = new Set();
    for (const [, h] of Object.entries(health)) {
      (h.pests || []).forEach((p) => { if (!core.getPestForName(p)) badPests.add(p); });
      (h.diseases || []).forEach((d) => { if (!core.getDiseaseForName(d)) badDiseases.add(d); });
    }
    eq([...badDiseases], []);
    // "Caterpillar" on Avocado is a deliberate generic: the library has no
    // avocado-appropriate caterpillar, and a plain chip is better than a wrong one.
    eq([...badPests], ["Caterpillar"]);
  });
});

describe("translations", () => {
  const langs = ["de", "es", "fr", "hi", "it", "ja", "ko", "pt", "zh"];
  const flat = (o, p = "", out = {}) => {
    for (const k of Object.keys(o || {})) {
      const v = o[k]; const key = p ? `${p}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, out); else out[key] = v;
    }
    return out;
  };
  const load = (l) => { const m = require(path.join(ROOT, `lib/locales/${l}.js`)); return flat(m.default || m); };
  const en = load("en");
  it("are complete in every launched locale", () => {
    for (const l of langs) eq(Object.keys(en).filter((k) => !(k in load(l))), [], l);
  });
  it("keep the same placeholders as English, so no value goes missing", () => {
    const ph = (s) => [...new Set(String(s).match(/\{[a-zA-Z]+\}/g) || [])].sort();
    for (const l of langs) {
      const other = load(l);
      const bad = Object.keys(en).filter((k) =>
        typeof en[k] === "string" && typeof other[k] === "string" &&
        JSON.stringify(ph(en[k])) !== JSON.stringify(ph(other[k])));
      eq(bad, [], l);
    }
  });
  it("give every alert a title and a body in every language", () => {
    for (const l of ["en", ...langs]) {
      const a = load(l);
      const alerts = Object.keys(a).filter((k) => k.startsWith("alerts."));
      ok(alerts.length > 100, `${l} has only ${alerts.length} alert strings`);
      eq(alerts.filter((k) => !String(a[k]).trim()), [], l);
    }
  });
});

describe("countKnownPlants", () => {
  it("counts only plants the catalog can still show", () => {
    // Six plants were dropped for having no artwork. Their names stay in the
    // saved lists of anyone who had them, invisible everywhere — but the free
    // tier caps on the length of that list, so they were eating the allowance.
    const gone = ["Rose Hip", "Greengage", "Goumi Berry", "Strawberry Guava", "Charentais Melon", "Chilean Guava (Ugni)"];
    eq(gone.filter((n) => nameSet.has(n)), [], "these should be gone from the catalog");
    eq(core.countKnownPlants(gone), 0, "phantoms must not count");
    eq(core.countKnownPlants([...gone.slice(0, 4), "Tomato", "Basil"]), 2, "only the two real ones");
    eq(core.countKnownPlants(["Tomato", "Basil", "Kale"]), 3);
  });
  it("is case-insensitive and survives junk", () => {
    eq(core.countKnownPlants(["tomato", "TOMATO"]), 2);
    eq(core.countKnownPlants([]), 0);
    eq(core.countKnownPlants(null), 0);
    eq(core.countKnownPlants([null, undefined, "", 0, {}]), 0);
  });
  it("is what the free-tier cap actually counts", () => {
    const fs5 = require("fs");
    const app = fs5.readFileSync(path.join(ROOT, "App.js"), "utf8");
    eq((app.match(/savedPlants\.length\s*>=\s*5/g) || []), [], "cap must not count raw names");
    eq((app.match(/5\s*-\s*savedPlants\.length/g) || []), [], "remaining room must not count raw names");
    ok(/countKnownPlants\(savedPlants\)\s*>=\s*5/.test(app), "cap should count known plants");
  });
});

describe("onlyKnownPlantKeys", () => {
  const gone = "Rose Hip"; // removed from the catalog for having no artwork
  it("drops entries for plants the catalog no longer has", () => {
    const trackers = { [gone]: { days: 30, startedAt: "2026-06-01T00:00:00.000Z" }, Tomato: { days: 60, startedAt: "2026-09-01T00:00:00.000Z" } };
    eq(Object.keys(core.onlyKnownPlantKeys(trackers)), ["Tomato"]);
  });
  it("keeps every real plant, whatever the case", () => {
    eq(Object.keys(core.onlyKnownPlantKeys({ Tomato: 1, Basil: 2 })).sort(), ["Basil", "Tomato"]);
    eq(Object.keys(core.onlyKnownPlantKeys({ tomato: 1 })), ["tomato"]);
  });
  it("survives nothing at all", () => {
    eq(core.onlyKnownPlantKeys(null), {});
    eq(core.onlyKnownPlantKeys({}), {});
  });
  it("stops a departed plant reading ready-to-harvest for ever", () => {
    // The tracker is ready, and stays ready, and cannot be cleared — ending one
    // means opening a plant that is not there any more.
    const stuck = { [gone]: { days: 1, startedAt: "2026-01-01T00:00:00.000Z" } };
    ok(core.isHarvestReady(stuck[gone]), "the tracker itself is ready");
    const snapshot = core.buildWidgetSnapshot({
      savedPlantObjs: [], wateredPlants: {}, wateringHistory: {}, weather: null,
      harvestTrackers: core.onlyKnownPlantKeys(stuck), streakData: { count: 1 },
      monthlySuggestions: [], zone: "7a",
    });
    eq(snapshot.harvestReady.count, 0, "the widget must not count it");
    eq(snapshot.harvestReady.names, []);
  });
  it("is what the notification and the widget actually ask", () => {
    // Checking the helper alone proves nothing about whether anything calls it.
    const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
    ok(/const ready = Object\.entries\(onlyKnownPlantKeys\(harvestTrackers\)\)/.test(app),
      "the harvest notification must filter before it counts");
    ok(/harvestTrackers: visibleHarvestTrackers, streakData/.test(app),
      "the widget snapshot must be given the filtered view");
    ok(!/harvestTrackers=\{harvestTrackers\}/.test(app),
      "no screen should be handed the unfiltered trackers");
  });
  it("filters what is shown without touching what is stored", () => {
    const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
    // The backup, the cloud push and the local write must all keep every key: a
    // plant that returns in a later update should find its countdown intact.
    ok(/harvest_trackers: harvestTrackers/.test(app), "cloud sync keeps the raw trackers");
    ok(/plantNotes, harvestTrackers, fertilizerTrackers/.test(app), "the backup keeps them");
  });
});

describe("reduced motion", () => {
  const fs7 = require("fs");
  const read = (rel) => fs7.readFileSync(path.join(ROOT, rel), "utf8");
  it("is honoured by every looping animation", () => {
    // A loop runs until the content arrives, so an unguarded one is exactly what
    // the OS setting exists to stop. Skeleton was the one that never asked, and
    // thirteen cards use it.
    const loopers = ["components/Skeleton.js", "components/FloatingParticle.js"];
    const unguarded = loopers.filter((rel) => {
      const src = read(rel);
      return /Animated\.loop\(/.test(src) && !/useReducedMotion|isReducedMotion|reduceMotionRef/.test(src);
    });
    eq(unguarded, []);
  });
  it("finds no animation quietly ignoring the motion module", () => {
    const files = [];
    for (const d of ["components", "screens"]) {
      for (const f of fs7.readdirSync(path.join(ROOT, d))) if (f.endsWith(".js")) files.push(path.join(d, f));
    }
    const offenders = files.filter((rel) => {
      const src = read(rel);
      if (!/Animated\.loop\(/.test(src)) return false;
      return !/useReducedMotion|isReducedMotion|reduceMotionRef/.test(src);
    });
    eq(offenders, [], "these loop forever without asking about reduced motion");
  });
});

describe("the haptics switch", () => {
  const fs8 = require("fs");
  it("is honoured by the vibration calls too, not just the haptics ones", () => {
    // The setting reads "Vibration feedback on taps and actions", and
    // Vibration.vibrate is a different API from Haptics that was never wired to
    // it. Eighteen calls used it directly, most on the line after a
    // successHaptic() that does check — so turning haptics off silenced the
    // subtle feedback and left the loud buzz.
    const files = ["App.js", "core.js"];
    for (const d of ["components", "screens"]) {
      for (const f of fs8.readdirSync(path.join(ROOT, d))) if (f.endsWith(".js")) files.push(path.join(d, f));
    }
    const offenders = files.filter((rel) =>
      rel !== "core.js" && /Vibration\.vibrate\(/.test(fs8.readFileSync(path.join(ROOT, rel), "utf8")));
    eq(offenders, [], "these vibrate without asking whether haptics are on");
  });
  it("routes every buzz through one place that checks", () => {
    const coreSrc = fs8.readFileSync(path.join(ROOT, "core.js"), "utf8");
    ok(/export function vibrate\(pattern\) \{\s*\n\s*if \(!hapticsEnabled\) return;/.test(coreSrc),
      "vibrate() must return early when the switch is off");
    ok(/export function tapHaptic[\s\S]{0,120}if \(!hapticsEnabled\) return;/.test(coreSrc));
    ok(/export function successHaptic[\s\S]{0,120}if \(!hapticsEnabled\) return;/.test(coreSrc));
  });
});

describe("the watering reminders switch", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  // Located by the effect's own guard rather than by matching a useEffect and a
  // dependency array — a lazy match between those two spans whatever sits in
  // between, and my first attempt happily matched the zip-persist effect.
  const marker = app.indexOf("persistHydrated.current.remindersToggle");
  const effect = marker < 0 ? "" : app.slice(marker, app.indexOf("}, [remindersOn", marker) + 40);

  it("cancels what is already scheduled, not just what comes next", () => {
    // A per-plant reminder is a DAILY repeat. Both schedulers check the switch on
    // the way in, but nothing cancelled — so turning it off left every reminder
    // firing every morning for ever, with no in-app way to stop them.
    ok(marker > 0, "there should be an effect that reacts to the switch going off");
    ok(/cancelReminder\(`plant-\$\{plantName\}`\)/.test(effect), "per-plant daily reminders must be cancelled");
    ok(/cancelPlantWaterReminder\(plantName\)/.test(effect), "per-plant water reminders must be cancelled");
    ok(/if \(remindersOn\) return;/.test(effect), "it must only act when the switch is off");
  });
  it("does not cancel everything on the first render", () => {
    // remindersOn starts false and only turns true when the stored value lands,
    // so acting on that initial false would wipe the reminders of everyone who
    // had them on, on every single launch.
    ok(/remindersToggle = true;\s*\n\s*return;/.test(effect),
      "the first run must be skipped, the way the other hydrate-sensitive effects do");
  });
});

describe("signing out", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const start = app.indexOf("const clearLocalAccountData");
  const reset = start < 0 ? "" : app.slice(start, app.indexOf("\n};", start));

  it("cancels everything the previous account had scheduled", () => {
    // Per-plant reminders are daily repeats and they name the plant — "Time to
    // water Tomato" — so leaving them scheduled tells whoever picks the device up
    // next about someone else's garden, and what was in it.
    ok(start > 0, "there should be a local reset on sign-out");
    ok(/cancelAllScheduledNotificationsAsync\(\)/.test(reset),
      "the reset must cancel scheduled notifications");
  });
  it("clears the once-a-day alert guards so the next account is not silenced", () => {
    for (const key of ["pp_harvestAlertSent", "pp_frostAlertDay", "pp_heatAlertDay"]) {
      ok(reset.includes(key), `${key} should be cleared on sign-out`);
    }
  });
  it("still runs on the sign-out event", () => {
    ok(/event === "SIGNED_OUT"\) clearLocalAccountData\(\)/.test(app));
  });
});

describe("a backup carries the whole garden", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const start = app.indexOf("async function exportFullBackup");
  const payload = app.slice(start, app.indexOf("backup._modules", start));
  // Field names in the exported object. Several sit on a line together, so this
  // strips comments and `key: value` entries and takes what is left — my first
  // attempt anchored on one field per line and found six of them.
  const exported = [...new Set(
    payload
      .replace(/\/\/[^\n]*/g, "")
      .replace(/[a-zA-Z_][a-zA-Z0-9_]*\s*:\s*[^,\n]+/g, "")
      .split(/[,\n{}]/)
      .map((t) => t.trim())
      .filter((t) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(t))
  )].filter((f) => !["const", "backup", "async", "function", "exportFullBackup", "await", "try", "return"].includes(f));

  it("exports something worth restoring", () => {
    ok(start > 0, "there should be a backup export");
    ok(exported.length >= 25, `only ${exported.length} fields exported`);
  });
  it("restores every field it exports", () => {
    // A field added to the export but not to the restore is progress that goes
    // out and never comes back, and nothing would report it.
    const restoreAt = app.indexOf("if (Array.isArray(data.savedPlants)) setSavedPlants");
    const restore = app.slice(restoreAt, app.indexOf("applyModuleBackup", restoreAt));
    const missing = exported.filter((f) => !restore.includes(`data.${f}`));
    eq(missing, [], "exported but never restored");
  });
  it("carries the progress that only ever lived on the device", () => {
    // These survive an app update, because AsyncStorage does — but a reinstall,
    // a new phone or a restore used to take them.
    for (const f of ["plantSaveDates", "harvestGoal", "monthlyChecklist", "frostChecklist",
                     "badgeEarnedDates", "bannerEarnedDates", "streakFreeze", "pinnedPlants"]) {
      ok(exported.includes(f), `${f} is missing from the backup`);
    }
  });
  it("keeps the self-persisting cards in the same file", () => {
    ok(/backup\._modules = await collectModuleBackup\(\)/.test(app));
    ok(/if \(data\._modules\) applyModuleBackup\(data\._modules\)/.test(app));
    ok(core.MODULE_STORAGE_KEYS.length >= 20, "every self-persisting card must be listed");
  });
});
