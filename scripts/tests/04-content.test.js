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

describe("removing a plant", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const start = app.indexOf("function toggleSavedPlant(name)");
  const removal = start < 0 ? "" : app.slice(start, app.indexOf("return;\n    }", start));

  it("stops every reminder the plant had", () => {
    // The daily check-in repeats and has no per-plant off switch, so a plant
    // removed without cancelling it kept announcing itself every morning.
    ok(start > 0, "there should be a save/remove toggle");
    ok(/cancelPlantWaterReminder\(name\)/.test(removal), "the water reminder must be cancelled");
    ok(/cancelFertilizerReminder\(name\)/.test(removal), "the fertilizer reminder must be cancelled");
    ok(/cancelReminder\(`plant-\$\{name\}`\)/.test(removal), "the daily check-in must be cancelled");
    ok(/dropKey\(setWateringReminders\)/.test(removal), "the check-in must be forgotten too");
  });
});

describe("every way of watering", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const body = (sig) => {
    const at = app.indexOf(sig);
    if (at < 0) return "";
    const end = app.indexOf("\nfunction ", at + sig.length);
    const end2 = app.indexOf("\n  function ", at + sig.length);
    const stops = [end, end2].filter((n) => n > 0);
    return app.slice(at, stops.length ? Math.min(...stops) : undefined);
  };

  for (const sig of ["function markPlantWatered(", "function waterAllPlants(", "function waterPlant(", "function waterArea("]) {
    it(`${sig.slice(9, -1)} restarts the water reminder`, () => {
      // A reminder left on the previous watering's schedule tells the gardener
      // to water a plant they watered a moment ago.
      const fn = body(sig);
      ok(fn.length > 0, `${sig} should exist`);
      ok(/schedulePlantWaterReminder\(/.test(fn), `${sig} must reschedule the water reminder`);
    });
  }
});

describe("logging a feed", () => {
  const fs = require("fs");
  const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
  const card = fs.readFileSync(path.join(ROOT, "components/SoilCareLogCard.js"), "utf8");
  const tab = fs.readFileSync(path.join(ROOT, "screens/GardenTab.js"), "utf8");

  it("restarts the fertilizer tracker", () => {
    // Only the tracker's Start button ever set lastFertilized, so a plant fed on
    // schedule stayed "fertilizer due" however many feeds were logged.
    const at = app.indexOf("function recordFeeding(");
    ok(at > 0, "there should be a way to record a feed");
    const fn = app.slice(at, app.indexOf("\n}\n", at));
    ok(/lastFertilized: new Date\(\)\.toISOString\(\)/.test(fn), "the feed must reset the count");
    ok(/cancelFertilizerReminder\(plantName\)/.test(fn), "the reminder from the previous feed must go");
  });
  it("is wired from the care log through to the app", () => {
    ok(/onFertilized=\{recordFeeding\}/.test(app), "App must hand recordFeeding to the Garden tab");
    ok(/onFertilized=\{onFertilized\}/.test(tab), "the Garden tab must pass it to the care log");
    ok(/selectedAction === "fertilize"[^\n]*onFertilized\(selectedPlant\)/.test(card), "the care log must call it");
  });
});

describe("a fertilizer tracker after a feed", () => {
  const core = require(path.join(ROOT, "core.js"));
  it("is not due the day it was fed, and is due again after the plant's interval", () => {
    const fed = { lastFertilized: new Date().toISOString() };
    eq(core.isFertilizerDue("Tomato", fed), false);
    const old = new Date(); old.setDate(old.getDate() - core.getFertilizerDays("Tomato"));
    eq(core.isFertilizerDue("Tomato", { lastFertilized: old.toISOString() }), true);
  });
});

describe("the fertilizer card's due list", () => {
  const card = require("fs").readFileSync(path.join(ROOT, "components/FertilizerIntelligenceCard.js"), "utf8");
  it("uses each plant's own interval, as Home does", () => {
    const at = card.indexOf("getPlantsDueForFertilizer = ");
    const fn = card.slice(at, card.indexOf("};", at));
    ok(at > 0, "the due list should exist");
    ok(/isFertilizerDue\(plantName, tracker\)/.test(fn), "it must ask isFertilizerDue");
    ok(!/>= ?\d+/.test(fn), "no hardcoded day count");
  });
});

describe("clearing old journal photos", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const at = app.indexOf("function deleteJournalEntriesOlderThan(");
  const fn = app.slice(at, app.indexOf("\n}\n", at));
  it("deletes exactly what it counted and confirmed", () => {
    ok(at > 0, "the bulk delete should exist");
    const counted = fn.match(/toRemove = journalEntries\.filter\(\(e\) => (.+?)\);/);
    const kept = fn.match(/setJournalEntries\(\(current\) => current\.filter\(\(e\) => (.+?)\)\);/);
    ok(counted && kept, "both filters should be found");
    // Whatever is kept must be the negation of what was counted, or an entry
    // with no readable date is dropped without being in the count.
    eq(kept[1], `!(${counted[1]})`);
  });
});

describe("the translator is never shadowed", () => {
  const fs = require("fs");
  const files = ["App.js",
    ...fs.readdirSync(path.join(ROOT, "components")).map((f) => `components/${f}`),
    ...fs.readdirSync(path.join(ROOT, "screens")).map((f) => `screens/${f}`)]
    .filter((f) => f.endsWith(".js"));
  it("by a local named t, in any file that translates", () => {
    // CustomTasksCard declared `const t = title.trim()` and then called
    // t("alerts.taskSavedTitle") a few lines later — a string, not a function —
    // so the alert threw instead of showing.
    const offenders = [];
    for (const f of files) {
      const src = fs.readFileSync(path.join(ROOT, f), "utf8");
      if (!/useTranslation\(\)/.test(src)) continue;
      if (/\b(const|let|var) t\s*=/.test(src)) offenders.push(f);
    }
    eq(offenders, []);
  });
});

describe("the daily bonus card", () => {
  const card = require("fs").readFileSync(path.join(ROOT, "components/DailyBonusCard.js"), "utf8");
  it("hides by the same day key the claim checks", () => {
    // A 24-hour window measured from a day key parsed as UTC midnight showed the
    // card again on the evening of the claim west of Greenwich.
    ok(/isSameDayKey\(dailyBonusDate, getTodayKey\(\)\)/.test(card), "the card must use isSameDayKey");
    ok(!/24 \* 60 \* 60 \* 1000/.test(card), "no rolling 24-hour window");
  });
});

describe("the plant pick of the day", () => {
  const hero = require("fs").readFileSync(path.join(ROOT, "components/PlantTodayHero.js"), "utf8");
  it("turns over at local midnight", () => {
    // Seeded from the UTC date, it changed plant at 5pm in California.
    ok(/const dateKey = getTodayKey\(\);/.test(hero));
    ok(!/toISOString\(\)\.slice\(0, 10\)/.test(hero));
  });
});

describe("signing out leaves nothing of the account in memory", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const start = app.indexOf("const clearLocalAccountData");
  const reset = start < 0 ? "" : app.slice(start, app.indexOf("\n};", start));
  const rowAt = app.indexOf("const profileRow = {");
  const row = app.slice(rowAt, app.indexOf("\n  };", rowAt));
  // `snake_key: stateName,` — the state each cloud column is written from.
  const synced = [...row.matchAll(/^\s+[a-z_]+: ([a-zA-Z]+),/gm)].map((m) => m[1]);
  // Settings of the device rather than of the account, and values that are
  // not state.
  const DEVICE = new Set(["appearanceMode", "subscriptionPlan", "moduleData"]);

  it("finds the cloud row", () => {
    ok(synced.length >= 40, `only ${synced.length} synced fields found`);
  });
  it("resets every piece of state the cloud row is written from", () => {
    // Anything left in memory shows the next account the last one's garden, and
    // a new account with nothing to load over it saves it to the cloud as its own.
    const missing = synced.filter((name) => !DEVICE.has(name))
      .filter((name) => new RegExp(`const \\[${name}, set`).test(app))
      .filter((name) => !reset.includes(`set${name[0].toUpperCase()}${name.slice(1)}(`));
    eq(missing, [], "synced to the account but not reset on sign-out");
  });
});

describe("frost alerts follow the gardener", () => {
  const fs = require("fs");
  const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
  const settings = fs.readFileSync(path.join(ROOT, "screens/SettingsTab.js"), "utf8");
  it("are rescheduled when the zone or hemisphere changes", () => {
    // Scheduled once from the switch, they stayed on the old place's winter.
    const at = app.indexOf("const southernHemisphere =");
    ok(at > 0, "there should be an effect that follows the place");
    const effect = app.slice(at, app.indexOf("}, [", at) + 60);
    ok(/scheduleFrostSeasonReminders\(zone\)/.test(effect), "it must reschedule for the current zone");
    ok(/\[frostAlertsOn, zone, southernHemisphere\]/.test(effect), "it must rerun on zone and hemisphere");
    ok(/notificationsGranted\(\)/.test(effect) && !/ensureNotificationPermission/.test(effect), "it must never prompt");
    ok(app.indexOf("setHemisphereFromLatitude(latitude); // keep") < at, "it must run after the hemisphere is set");
  });
  it("are scheduled in one place", () => {
    const fn = app.slice(app.indexOf("async function scheduleFrostSeasonReminders("));
    ok(/cancelReminder\(`frost-daily-\$\{month\}`\)/.test(fn.slice(0, 400)), "all twelve are cleared first");
    ok(/scheduleFrostSeasonReminders\(zone\)/.test(settings), "the switch must use the shared scheduler");
    ok(!/SchedulableTriggerInputTypes\.CALENDAR[\s\S]{0,200}hour: 18/.test(settings), "no second copy in Settings");
  });
});

describe("the monthly planting guides switch", () => {
  const settings = require("fs").readFileSync(path.join(ROOT, "screens/SettingsTab.js"), "utf8");
  it("backs off when notifications are refused", () => {
    const at = settings.indexOf("onToggleMonthlyPlanting=");
    const fn = settings.slice(at, settings.indexOf("onToggleDailyWatering=", at));
    ok(/\} else \{[\s\S]*?setMonthlyPlantingOn\(false\)/.test(fn), "the switch must turn back off");
  });
});

describe("the daily watering switch", () => {
  const settings = require("fs").readFileSync(path.join(ROOT, "screens/SettingsTab.js"), "utf8");
  const at = settings.indexOf("onToggleDailyWatering=");
  const fn = settings.slice(at, settings.indexOf("/>", at));
  it("backs off when notifications are refused", () => {
    ok(/if \(ok\) \{[\s\S]*?\} else \{[\s\S]*?setDailyWateringOn\(false\)/.test(fn), "the switch must turn back off");
  });
  it("does not bake today's weather into a daily repeat", () => {
    ok(!/precipChance/.test(fn), "a repeating reminder cannot carry today's forecast");
  });
});

describe("a plant's daily check-in", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("does not bake today's weather into a daily repeat", () => {
    const at = app.indexOf("function schedulePlantCheckIn(");
    const fn = app.slice(at, app.indexOf("\n  }\n", at));
    ok(at > 0 && /scheduleDailyReminder\(/.test(fn), "the check-in should be a daily reminder");
    ok(!/precipChance|rainLikely/.test(fn), "a repeating reminder cannot carry today's forecast");
  });
});

describe("switches that come back on are re-armed", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const at = app.indexOf("// Re-arm what the switches say is on.");
  const block = at < 0 ? "" : app.slice(at, app.indexOf("}, [remindersOn, wateringReminders, savedPlants]);", at) + 60);
  it("for the monthly guides, the plant of the day and each plant's check-in", () => {
    // Restored from a backup or the cloud row onto a fresh device, these read
    // "on" and never fired, because nothing re-scheduled them.
    ok(at > 0, "there should be a re-arm pass");
    ok(/\[monthlyPlantingOn\]/.test(block) && /scheduleMonthlyPlantingReminders\(\)/.test(block));
    ok(/\[plantOfDayOn\]/.test(block) && /schedulePlantOfDayReminder\(\)/.test(block));
    ok(/schedulePlantCheckIn\(plantName, r\.hour, r\.minute\)/.test(block));
  });
  it("only for saved plants, and never by asking", () => {
    ok(/savedPlants\.includes\(plantName\)/.test(block), "a removed plant's check-in must stay gone");
    ok(!/ensureNotificationPermission/.test(block), "re-arming must not prompt");
  });
  it("using the same schedulers as the switches", () => {
    const settings = require("fs").readFileSync(path.join(ROOT, "screens/SettingsTab.js"), "utf8");
    ok(/await scheduleMonthlyPlantingReminders\(\)/.test(settings));
    ok(/const ok = await schedulePlantOfDayReminder\(\)/.test(app));
    ok(/const ok = await schedulePlantCheckIn\(plantName, hour, minute\)/.test(app));
  });
});

describe("re-arming the check-ins", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("stops a run that a newer one has overtaken", () => {
    const at = app.indexOf("}, [remindersOn, wateringReminders, savedPlants]);");
    const effect = app.slice(app.lastIndexOf("useEffect(() => {", at), at);
    ok(/if \(stale\) return;/.test(effect) && /return \(\) => \{ stale = true; \};/.test(effect));
  });
});

describe("the garden ROI card's money", () => {
  const { formatMoney } = require(path.join(ROOT, "components/GardenROICard.js"));
  it("never prints a float's tail", () => {
    eq(formatMoney(30 - 19.99), "10.01");
    eq(formatMoney(25 - 4.35), "20.65");
    eq(formatMoney(12.5), "12.50");
    eq(formatMoney(45), "45");
    eq(formatMoney(undefined), "0");
  });
});

describe("the water usage card", () => {
  const fs = require("fs");
  const card = fs.readFileSync(path.join(ROOT, "components/WaterUsageCard.js"), "utf8");
  const tab = fs.readFileSync(path.join(ROOT, "screens/WeatherTab.js"), "utf8");
  it("totals in liters for a metric gardener", () => {
    ok(/unitSystem=\{unitSystem\}/.test(tab), "the Weather tab must pass the units setting");
    ok(/const metric = unitSystem === "metric";/.test(card));
    ok(/metric \? g \/ 0\.264172 : g/.test(card), "gallons must be converted for display");
    for (const k of ["litersThisWeek", "litersAlltime", "liters"]) ok(card.includes(`waterUsage.${k}`), `${k} must be used`);
  });
});

describe("advice temperatures follow the units setting", () => {
  const fs = require("fs");
  const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
  it("on the plant page, the fertilizer card, the forecast and disease pages", () => {
    const detail = read("screens/PlantDetailScreen.js");
    ok(/localizeAdvice\(getShouldGrowText\(/.test(detail));
    ok(/localizeAdvice\(step, unitSystem\)/.test(detail));
    ok(/localizeAdvice\(fact\.value, unitSystem\)/.test(detail));
    const fert = read("components/FertilizerIntelligenceCard.js");
    ok(/localizeAdvice\(tip\.tip, unitSystem\)/.test(fert) && /localizeAdvice\(t\(weatherWarning\.key\), unitSystem\)/.test(fert));
    ok(/unitSystem=\{unitSystem\}\s*\n\s*weather=\{weather\}/.test(read("screens/GardenTab.js")), "the Garden tab must pass units to the fertilizer card");
    ok(!/above 95°F/.test(read("components/ForecastCard.js")), "the forecast must format its threshold");
    ok(/localizeAdvice\(disease\.spreads, unitSystem\)/.test(read("components/DiseaseDetailScreen.js")));
    const app = read("App.js");
    ok(/<PlantDetailScreen\s+unitSystem=\{unitSystem\}/.test(app) || /<PlantDetailScreen[\s\S]{0,200}unitSystem=\{unitSystem\}/.test(app));
    ok(/<DiseaseDetailScreen[\s\S]{0,120}unitSystem=\{unitSystem\}/.test(app));
    ok(/<PestDetailScreen[\s\S]{0,120}unitSystem=\{unitSystem\}/.test(app));
    ok(/localizeAdvice\(pest\.description, unitSystem\)/.test(read("components/PestDetailScreen.js")));
  });
});

describe("the bed planner", () => {
  const fs = require("fs");
  const card = fs.readFileSync(path.join(ROOT, "components/BedPlannerCard.js"), "utf8");
  it("measures in metres and centimetres for a metric gardener", () => {
    ok(/<BedPlannerCard[^>]*unitSystem=\{unitSystem\}/.test(fs.readFileSync(path.join(ROOT, "screens/GardenTab.js"), "utf8")));
    ok(/const inchesPer = metric \? 39\.3701 : 12;/.test(card), "metres must convert to inches for the sum");
    for (const k of ["widthM", "lengthM", "spacingInACm", "mBed"]) ok(card.includes(`bedPlanner.${k}`), `${k} must be used`);
  });
});

describe("what the profile cards are given", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  // The object handed to a core builder, from its call to the closing `}),`.
  const argsOf = (fn) => {
    const at = app.indexOf(`${fn}({`);
    return at < 0 ? "" : app.slice(at, app.indexOf("}),", at));
  };
  it("passes the fertilizer trackers under the name the quests read", () => {
    // A shorthand `visibleFertilizerTrackers,` arrives under that name, and the
    // two "Feed" quests read `fertilizerTrackers` — so they never completed.
    for (const fn of ["getDailyQuests", "getAchievementBadges"]) {
      const args = argsOf(fn);
      ok(args.length > 0, `${fn} should be called`);
      ok(/fertilizerTrackers: visibleFertilizerTrackers/.test(args), `${fn} must get fertilizerTrackers`);
      ok(!/^\s*visibleFertilizerTrackers,\s*$/m.test(args), `${fn} must not get a misnamed shorthand`);
    }
  });
  it("passes nothing a builder does not take", () => {
    // Every key handed over has to be one the builder destructures, or it is
    // silently dropped, as this one was.
    const core = require("fs").readFileSync(path.join(ROOT, "core.js"), "utf8");
    for (const fn of ["getDailyQuests", "getAchievementBadges", "getProfileBanners", "getGardenXP"]) {
      const sigAt = core.indexOf(`export function ${fn}(`);
      const sig = core.slice(sigAt, core.indexOf("{\n", core.indexOf("})", sigAt)));
      const params = new Set([...sig.matchAll(/\b([a-zA-Z]+)\b/g)].map((m) => m[1]));
      const keys = [...argsOf(fn).matchAll(/^\s*([a-zA-Z]+)(?::|,)/gm)].map((m) => m[1]);
      const unknown = keys.filter((k) => !params.has(k));
      eq(unknown, [], `${fn} is handed keys it does not read`);
    }
  });
});

describe("searching for a plant", () => {
  const core = require(path.join(ROOT, "core.js"));
  it("ignores accents either way round", () => {
    eq(core.foldForSearch("Jalapeño"), "jalapeno");
    eq(core.foldForSearch("Cupuaçu"), "cupuacu");
    eq(core.foldForSearch("Ají Amarillo"), "aji amarillo");
    eq(core.foldForSearch(undefined), "");
    eq(core.getSearchSuggestions("jalapeno", 1)[0]?.name, "Jalapeño");
    eq(core.getSearchSuggestions("padron", 1)[0]?.name, "Padrón Pepper");
  });
  it("folds every plant name to plain letters", () => {
    // A character the map misses leaves that plant unfindable without it.
    const produce = require(path.join(ROOT, "data/produceData.js"));
    const list = produce.default || produce;
    const unfolded = list.map((p) => core.foldForSearch(p.name)).filter((n) => /[^\x00-\x7f]/.test(n));
    eq(unfolded, []);
  });
  it("is how the Plants tab and global search compare", () => {
    const fs = require("fs");
    const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
    const modal = fs.readFileSync(path.join(ROOT, "components/GlobalSearchModal.js"), "utf8");
    ok(/const terms = foldForSearch\(plantSearch\)/.test(app) && /haystackFolded\.includes\(t\)/.test(app));
    ok(/const query = foldForSearch\(q\.trim\(\)\)/.test(modal) && /foldForSearch\(p\.name\)\.includes\(query\)/.test(modal));
  });
});

describe("every search box ignores accents", () => {
  const fs = require("fs");
  it("in the pickers, quick add, notes, wishlist and journal", () => {
    // A filter left on plain toLowerCase() cannot find Jalapeño from "jalapeno".
    const files = ["PlantPickerModal", "QuickAddCard", "AllNotesCard", "WishlistCard", "JournalCard", "GlobalSearchModal"]
      .map((f) => `components/${f}.js`);
    const plain = files.filter((f) => /toLowerCase\(\)\.includes\(/.test(fs.readFileSync(path.join(ROOT, f), "utf8")));
    eq(plain, []);
  });
});

describe("the heat alert", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("ignores days already past in a cached forecast", () => {
    const at = app.indexOf("Smart action: extreme-heat alert");
    const effect = app.slice(at, app.indexOf("}, [weather, frostAlertsOn, unitSystem]);", at));
    ok(at > 0 && /String\(d\.date\) >= todayKey/.test(effect));
  });
});

describe("the launch-time harvest check", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("never raises the OS permission prompt", () => {
    const at = app.indexOf("async function checkHarvestNotifications(");
    const fn = app.slice(at, app.indexOf("\n  }\n", at));
    ok(at > 0 && /getPermissionsAsync\(\)/.test(fn), "it should only check permission");
    ok(!/requestPermissionsAsync/.test(fn), "it must not ask on launch");
  });
});

describe("what the app does by itself never asks for permission", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const slice = (from, to) => { const a = app.indexOf(from); return a < 0 ? "" : app.slice(a, app.indexOf(to, a)); };
  it("the frost and heat alerts, the snooze summary and the daily watering re-schedules", () => {
    // ensureNotificationPermission shows an alert once permission is refused, so
    // from an effect it nagged on every launch and weather refresh.
    const frost = slice("if (alreadySent === frost.date)", "scheduleNotificationAsync");
    const heat = slice("if (alreadySent === day.date)", "scheduleNotificationAsync");
    const snooze = slice("async function scheduleSnoozeSummary(", "scheduleNotificationAsync");
    for (const [name, body] of [["frost", frost], ["heat", heat], ["snooze", snooze]]) {
      ok(body.length > 0, `${name} should be found`);
      ok(/notificationsGranted\(\)/.test(body) && !/ensureNotificationPermission/.test(body), `${name} must only check`);
    }
    const daily = [...app.matchAll(/id: "daily-watering",[\s\S]{0,260}?\}\);/g)].map((m) => m[0]);
    ok(daily.length >= 2, "both daily watering effects should be found");
    ok(daily.every((d) => /silent: true/.test(d)), "the daily watering effects must be silent");
  });
});

describe("Home's watering task", () => {
  const fs = require("fs");
  const card = fs.readFileSync(path.join(ROOT, "components/MyGardenTodayCard.js"), "utf8");
  it("lists only plants that are due, by their own rhythm", () => {
    // Every plant not watered today used to "need water", whatever its interval.
    ok(/getPlantsDueForWater\(\{ savedPlants, wateredPlants, wateringHistory, snoozedPlants, weather, today \}\)/.test(card));
    ok(/myGardenToday\.nothingDueToday/.test(card), "nothing due should not claim every plant was watered");
    ok(/<MyGardenTodayCard\s+theme=\{theme\}\s+wateringHistory=\{wateringHistory\}/.test(fs.readFileSync(path.join(ROOT, "screens/HomeTab.js"), "utf8")));
  });
});

describe("watering everything that is due", () => {
  const fs = require("fs");
  const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
  const dash = fs.readFileSync(path.join(ROOT, "components/GardenStatsDashboard.js"), "utf8");
  it("waters the due plants, as its label says, and the dashboard counts the same", () => {
    const at = app.indexOf("function waterAllPlants()");
    const fn = app.slice(at, app.indexOf("setWateredPlants", at));
    ok(/getPlantsDueForWater\(/.test(fn), "water-all must water only what is due");
    ok(/getPlantsDueForWater\(/.test(dash) && !/savedPlants\.length - wateredTodayCount/.test(dash), "the dashboard must count what is due");
  });
});

describe("the garden quiz", () => {
  const quiz = require("fs").readFileSync(path.join(ROOT, "components/QuizGame.js"), "utf8");
  it("pays out once per answer and once per finish, however fast the taps", () => {
    ok(/if \(picked !== null \|\| answeredRef\.current\) return;\s*\n\s*answeredRef\.current = true;/.test(quiz), "an answer must lock at once");
    ok(/if \(advancingRef\.current \|\| finished\) return;\s*\n\s*advancingRef\.current = true;/.test(quiz), "Next must lock at once");
    ok(/answeredRef\.current = false;\s*\n\s*setPicked\(null\);/.test(quiz), "the next question must unlock answering");
  });
});
describe("the garden quiz's Next button", () => {
  const quiz = require("fs").readFileSync(path.join(ROOT, "components/QuizGame.js"), "utf8");
  it("unlocks when the round has changed, not on a timer", () => {
    ok(/useEffect\(\(\) => \{ advancingRef\.current = false; \}, \[round\]\);/.test(quiz));
    ok(!/setTimeout\(\(\) => \{ advancingRef/.test(quiz));
  });
});

describe("claiming a reward", () => {
  const fs = require("fs");
  const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
  it("pays once however fast the taps: daily bonus, quests, seasonal challenges", () => {
    const app = read("App.js");
    ok(/if \(claimingBonusRef\.current\) return;\s*\n\s*claimingBonusRef\.current = true;/.test(app), "the daily bonus must lock at once");
    const profile = read("screens/ProfileTab.js");
    ok(/questClaimsRef\.current\.has\(claimKey\)\) return;\s*\n\s*questClaimsRef\.current\.add\(claimKey\);/.test(profile), "a quest must lock at once");
    const seasonal = read("components/SeasonalChallengesCard.js");
    ok(/claimingRef\.current\.has\(key\)\) return;\s*\n\s*claimingRef\.current\.add\(key\);/.test(seasonal), "a challenge must lock at once");
  });
});

describe("App's day state", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("is declared before anything reads it", () => {
    // A const read above its declaration is a ReferenceError on the first render,
    // and nothing else in the checks renders App.js to notice.
    // (A function further up keeps a local `const todayKey` of its own; only the
    // component-level reads count — builder arguments and dependency arrays.)
    const decl = app.indexOf("const [todayKey, setTodayKey]");
    ok(decl > 0, "todayKey should be declared");
    const reads = [...app.matchAll(/today: todayKey|\btodayKey\]|^\s*todayKey,\s*$|useRef\(todayKey\)/gm)].map((m) => m.index);
    ok(reads.length >= 4, `only ${reads.length} reads of todayKey found`);
    eq(reads.filter((i) => i < decl), [], "todayKey read above its declaration");
  });
});

describe("the widget's water count", () => {
  const core = require(path.join(ROOT, "core.js"));
  const item = (n) => ({ name: n, type: "Vegetables" });
  const ago = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return core.getDateKey(d); };
  it("is the same list Home shows", () => {
    const snap = (over) => core.buildWidgetSnapshot({
      savedPlantObjs: [item("Tomato"), item("Pepper"), item("Carrot")], wateredPlants: {},
      wateringHistory: { Tomato: [ago(5)], Pepper: [ago(5)], Carrot: [ago(1)] }, snoozedPlants: {}, weather: null, ...over,
    });
    eq(snap().waterDue.count, 2, "two are past their countdown, one is not");
    eq(snap({ snoozedPlants: { Pepper: core.getTomorrowKey() } }).waterDue.names, ["Tomato"], "a snoozed plant is not due");
    eq(snap({ weather: { precipChance: 90 } }).waterDue.count, 2, "rain does not hide a due plant");
    eq(snap({ wateringHistory: {} }).waterDue.count, 3, "a plant never watered is due");
  });
});

describe("icon-only buttons", () => {
  const fs = require("fs");
  it("say what they do to a screen reader", () => {
    // A Pressable whose only child is a symbol reads as that symbol, or nothing.
    const files = [...fs.readdirSync(path.join(ROOT, "components")).map((f) => `components/${f}`),
      ...fs.readdirSync(path.join(ROOT, "screens")).map((f) => `screens/${f}`), "App.js"].filter((f) => f.endsWith(".js"));
    const bare = [];
    for (const f of files) {
      const src = fs.readFileSync(path.join(ROOT, f), "utf8");
      const re = /<Pressable\b([^>]*)>\s*<Text\b[^>]*>\s*([^<{\w\s]{1,2})\s*<\/Text>\s*<\/Pressable>/g;
      let m;
      while ((m = re.exec(src))) if (!/accessibilityLabel/.test(m[1])) bare.push(`${f}: ${m[2]}`);
    }
    eq(bare, []);
  });
});

describe("the cloud save", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("runs when anything it writes changes", () => {
    // A field the save writes but its effect does not watch only reaches the
    // cloud when something else changes — or never, if nothing does.
    const fnAt = app.indexOf("const saveProfileToSupabase");
    const fn = app.slice(fnAt, app.indexOf("\n};", fnAt));
    const written = [...new Set([...fn.matchAll(/^\s+[a-z_]+: ([a-zA-Z]+),/gm)].map((m) => m[1]))]
      .filter((n) => n !== "moduleData"); // collected inside the save, not state
    ok(written.length >= 45, `only ${written.length} written fields found`);
    const at = app.indexOf("saveTimerRef.current = setTimeout(() => { saveProfileToSupabase(); }, 1200);");
    const deps = app.slice(app.indexOf("}, [", at), app.indexOf("]);", at));
    eq(written.filter((n) => !new RegExp(`\\b${n}\\b`).test(deps)), [], "written to the cloud but not watched");
  });
});

describe("what an offline launch falls back to", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("has the profile and every reminder switch on the device", () => {
    // Read at launch and never written, or never stored at all: offline, the
    // name and photo reverted and two switches read "off" over live reminders.
    ok(/persist\(STORAGE_KEYS\.profileName, profileName\)/.test(app));
    ok(/persist\(STORAGE_KEYS\.profilePhoto, profilePhoto\)/.test(app));
    for (const k of ["monthlyPlantingOn", "dailyWateringOn", "weeklyRecapOn", "plantOfDayOn"]) {
      ok(new RegExp(`persist\\("pp_${k}"`).test(app), `${k} must be saved on the device`);
      ok(new RegExp(`hydrate\\("pp_${k}"`).test(app), `${k} must be read back at launch`);
    }
  });
});

describe("sorting plants by harvest", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("puts seasonal perennials last, not at the 75-day fallback", () => {
    ok(/const harvestSortDays = \(item\) => \(hasHarvestCountdown\(item\) \? getHarvestDays\(item\) : Infinity\);/.test(app));
    ok(/harvestSortDays\(a\) - harvestSortDays\(b\)/.test(app));
  });
});

describe("translations keep their placeholders", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  const load = (code) => { const m = require(path.join(ROOT, `lib/locales/${code}.js`)); return m.default || m; };
  const flat = (obj, prefix = "", out = {}) => {
    for (const [k, v] of Object.entries(obj || {})) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object") flat(v, key, out); else if (typeof v === "string") out[key] = v;
    }
    return out;
  };
  const holes = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
  it("in every language, for every key", () => {
    // A placeholder spelt differently — or dropped — shows to the gardener as
    // "{plant}" or loses the plant's name from the sentence.
    const en = flat(load("en"));
    const bad = [];
    for (const { code } of i18n.LANGUAGES) {
      if (code === "en") continue;
      const tr = flat(load(code));
      for (const [k, v] of Object.entries(tr)) if (k in en && holes(v) !== holes(en[k])) bad.push(`${code}:${k} {${holes(v)}} vs {${holes(en[k])}}`);
    }
    eq(bad, []);
  });
});

describe("the plant page", () => {
  const page = require("fs").readFileSync(path.join(ROOT, "screens/PlantDetailScreen.js"), "utf8");
  it("has no English left in its labels", () => {
    // Its ~70 labels were hard-coded English in all ten languages.
    ok(!/label: "[A-Z]/.test(page), "a quick-fact label is hard-coded");
    ok(!/>(Start|Restart|Stop|Tracking|Reminder|Watered)</.test(page) && !/"(Start|Restart|Tracking|Watered)"/.test(page), "a button is hard-coded");
    ok(!/`Ready in \$\{/.test(page) && !/`Last fed /.test(page), "a countdown is hard-coded");
    ok((page.match(/t\("plantDetailScreen\./g) || []).length >= 65);
  });
});

describe("Home's daily plan", () => {
  const card = require("fs").readFileSync(path.join(ROOT, "components/MyGardenTodayCard.js"), "utf8");
  it("has no English left in it", () => {
    // Greetings, the weather line, seasonal tips and every count were English
    // in all ten languages, and "1 plant need water" in English too.
    ok(!/greeting: "|title: "[A-Z]|return "[^"]*[a-z]{3}/.test(card), "a greeting, weather title or tip is hard-coded");
    ok(!/plant\{[^}]*=== 1 \? "" : "s"\}/.test(card) && !/photo\$\{todayPhotos === 1/.test(card), "a count is pluralised in English");
    ok(!/\} done<|\} more</.test(card));
    for (const k of ["plantsNeedWater", "plantsReadyToHarvest", "plantsDueForFertilizer", "startSeedsIndoors", "photosLoggedToday"]) {
      ok(card.includes(`tn("myGardenToday.${k}"`), `${k} must be pluralised per language`);
    }
  });
});

describe("screens and components are fully translated", () => {
  // Measured by the repo's own coverage script, so a string added in English to
  // any screen or component fails here instead of shipping untranslated in nine
  // languages.
  const { analyse } = require(path.join(ROOT, "scripts/i18n-coverage.js"));
  const files = ["screens", "components"].flatMap((dir) =>
    fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith(".js")).map((f) => `${dir}/${f}`));
  for (const file of files) {
    it(`${file} has no hard-coded English`, () => {
      const { hardcoded } = analyse(path.join(ROOT, file));
      eq(hardcoded.map((h) => `${h.line}: ${h.text}`), []);
    });
  }
});

describe("the weather cards", () => {
  const fs = require("fs");
  const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
  it("have no English conditions, actions or tiles left", () => {
    const live = read("components/LiveWeatherCard.js");
    ok(!/label: "[A-Z]/.test(live) && !/text: "[A-Z]/.test(live) && !/plant\$\{[^}]*=== 1/.test(live), "LiveWeatherCard");
    const gi = read("components/GardenIntelligenceCard.js");
    ok(!/label: "[A-Z]/.test(gi) && !/text: `/.test(gi) && !/return "(Today|Tomorrow)"/.test(gi), "GardenIntelligenceCard");
  });
});

describe("the sign-in screen and the celebrations", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("are translated", () => {
    // The first screen anyone sees, and every celebration overlay, were English
    // whatever language the phone was in.
    for (const s of ["garden account", "Welcome back,", "Forgot password?", '"Sign Up"', '"Log In"', 'placeholder="Email"', 'placeholder="Password"',
      "ACHIEVEMENT UNLOCKED", "NEW BANNER UNLOCKED", "-DAY STREAK!", "FIRST PLANT!", "How much did you harvest?", "Changes aren't syncing"]) {
      ok(!app.includes(s), `still hard-coded: ${s}`);
    }
  });
});

describe("notifications", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("are written in the gardener's language", () => {
    // Every reminder, alert and milestone the app sends was English text.
    const scheduled = [...app.matchAll(/(title|body): (`[^`]*`|"[^"]*[a-z]{3}[^"]*")/g)].map((m) => m[0])
      .filter((x) => !/^(title|body): "(daily-watering|plant-of-day)/.test(x));
    eq(scheduled, [], "a notification or milestone title/body is hard-coded");
    ok(/notifyText\.monthlyGuideTitle", \{ month: formatDate\(/.test(app), "month names must be localised");
  });
});

describe("the Premium prompts and toasts", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("are translated", () => {
    ok(!/maybePromptPremium\("/.test(app), "an upsell message is hard-coded");
    ok(!/showUndoToast\("|showUndoToast\(`/.test(app), "an undo toast is hard-coded");
  });
});

describe("reminder times", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("keep 12-hour AM/PM in English", () => {
    i18n.setLocale("en");
    eq(core.formatReminderTime({ hour: 7, minute: 0 }), "7:00 AM");
    eq(core.formatReminderTime({ hour: 0, minute: 5 }), "12:05 AM");
    eq(core.formatReminderTime({ hour: 18, minute: 30 }), "6:30 PM");
  });
  it("follow the language's own clock everywhere else", () => {
    // An English "PM" in the middle of a German sentence reads as a bug.
    try {
      i18n.setLocale("de");
      const de = core.formatReminderTime({ hour: 18, minute: 30 });
      ok(/18:30/.test(de) && !/PM/.test(de), de);
      i18n.setLocale("fr");
      ok(/18:30/.test(core.formatReminderTime({ hour: 18, minute: 30 })));
      i18n.setLocale("ko");
      ok(!/AM|PM/.test(core.formatReminderTime({ hour: 7, minute: 0 })));
    } finally {
      i18n.setLocale("en");
    }
  });
});

describe("labels from core are compared in English", () => {
  it("never against a translated string", () => {
    // core returns fixed English labels ("Excellent Pair", "Plant now"…);
    // comparing one with t(...) is always false outside English, which hid
    // the bed map's good-pair highlight in nine languages.
    const bad = [];
    for (const dir of ["components", "screens"]) {
      for (const f of fs.readdirSync(path.join(ROOT, dir)).filter((n) => n.endsWith(".js"))) {
        const src = fs.readFileSync(path.join(ROOT, dir, f), "utf8");
        if (/[=!]==\s*t\(/.test(src)) bad.push(`${dir}/${f}`);
      }
    }
    if (/[=!]==\s*t\(/.test(fs.readFileSync(path.join(ROOT, "App.js"), "utf8"))) bad.push("App.js");
    eq(bad, []);
  });
});

describe("plant labels from core", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("translate every category, season status, difficulty and pair rating", () => {
    try {
      i18n.setLocale("de");
      for (const type of core.PLANT_TYPES) ok(i18n.plantTypeLabel(type) !== type || type === "", `type ${type}`);
      eq(i18n.seasonLabel("Plant now"), "Jetzt pflanzen");
      ok(/^Ab .*(März|Mär)/.test(i18n.seasonLabel("Starts in March")), i18n.seasonLabel("Starts in March"));
      for (const item of items.slice(0, 40)) {
        const season = core.getPlantSeasonLabel(item, "7");
        ok(i18n.seasonLabel(season) !== season, `season ${season}`);
        const d = core.getPlantDifficulty(item);
        ok(i18n.difficultyLabel(d).label !== d.label && i18n.difficultyLabel(d).text !== d.text, d.label);
      }
      for (const label of ["Excellent Pair", "Avoid"]) ok(i18n.pairLabel(label) !== label, label);
    } finally {
      i18n.setLocale("en");
    }
  });
  it("read back as the English labels in English", () => {
    eq(i18n.plantTypeLabel("Tree Fruits"), "Tree Fruits");
    eq(i18n.seasonLabel("Starts in March"), "Starts in March");
    eq(i18n.difficultyLabel({ label: "Easy", text: "Beginner friendly" }), { label: "Easy", text: "Beginner friendly" });
    eq(i18n.pairLabel("Excellent Pair"), "Excellent Pair");
  });
});

describe("the English dictionary", () => {
  it("has no keys that nothing uses", () => {
    // A rewrite that moves a string to a new key should delete the old one, or
    // translators keep paying for copy nobody sees. Keys built at runtime count
    // as used through any `ns.${…}` / "ns.prefix" + … reference in the code.
    const parser = require("@babel/parser");
    const traverse = require("@babel/traverse").default;
    const ast = parser.parse(fs.readFileSync(path.join(ROOT, "lib/locales/en.js"), "utf8"), { sourceType: "module" });
    const isPlural = (o) => o.properties.length && o.properties.every((x) => ["one", "other"].includes(x.key.name || x.key.value));
    const keys = [];
    const visit = (node, prefix) => {
      for (const prop of node.properties || []) {
        const key = prefix ? `${prefix}.${prop.key.name || prop.key.value}` : prop.key.name || prop.key.value;
        if (prop.value.type === "ObjectExpression" && !isPlural(prop.value)) visit(prop.value, key);
        else keys.push(key);
      }
    };
    let found = false;
    traverse(ast, { ObjectExpression(p) { if (!found && !p.parentPath.isObjectProperty()) { visit(p.node, ""); found = true; p.stop(); } } });
    const files = [];
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const f = path.join(dir, e.name);
        if (e.isDirectory()) { if (!/node_modules|\.git|locales|assets|scripts/.test(f)) walk(f); }
        else if (f.endsWith(".js")) files.push(f);
      }
    };
    walk(ROOT);
    const code = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");
    const literal = new Set([...code.matchAll(/["'`]([a-zA-Z0-9_]+\.[a-zA-Z0-9_.]+)["'`]/g)].map((m) => m[1]));
    const prefixes = [...code.matchAll(/[`"']([a-zA-Z0-9_]+\.[a-zA-Z0-9_]*)(?:\$\{|["']\s*\+)/g)].map((m) => m[1]);
    const dynamicNs = new Set([...code.matchAll(/`([a-zA-Z0-9_]+)\.\$\{/g), ...code.matchAll(/fromEnglish\(\s*"([a-zA-Z0-9_]+)"/g)].map((m) => m[1]));
    // difficultyLabel() reads `${key}Text` for each difficulty key.
    const built = new Set(["difficulty.easyText", "difficulty.mediumText", "difficulty.hardText"]);
    const unused = keys.filter((k) => !literal.has(k) && !built.has(k) && !dynamicNs.has(k.split(".")[0]) && !prefixes.some((p) => k.startsWith(p)));
    eq(unused, []);
  });
});

describe("the plant page's floating popups", () => {
  it("only wrap numbers as '+N XP'", () => {
    // Streak and watering popups carry a sentence, not a number; wrapping them
    // read "+🔥 7-day streak! XP".
    const src = fs.readFileSync(path.join(ROOT, "screens/PlantDetailScreen.js"), "utf8");
    ok(/typeof popup\.amount === "number" \? t\("plantsText\.xpGain"/.test(src));
  });
});

describe("core's display text", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("follows the app language", () => {
    // These strings reach translated cards straight from core; left English they
    // showed "Watered 3 days ago" inside a German card.
    try {
      i18n.setLocale("de");
      const today = core.getTodayKey();
      eq(core.getLastWateredText("T", {}, { T: [today] }), "Heute gegossen");
      eq(core.getLastWateredText("T", {}, {}), "Noch nie gegossen");
      ok(/Ernte/.test(core.getHarvestCountdown(items.find((i) => core.hasHarvestCountdown(i)))));
      eq(core.getPairReason("Quux", "Zork"), "Quux und Zork vertragen sich – kein bekannter Konflikt.");
      const tl = core.buildGardenTimeline({ plantSaveDates: { Tomato: today }, careLog: [{ actionId: "pruned", actionLabel: "Pruned", createdAt: new Date().toISOString() }] });
      const titles = tl.map((e) => e.title).join(" | ");
      ok(!/Added |Pruned/.test(titles), titles);
    } finally {
      i18n.setLocale("en");
    }
  });
});

describe("daily quests", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  const args = { savedPlants: [], journalEntries: [], gardenMap: {}, wateredPlants: {}, careLog: [], harvestTrackers: {}, streakData: { count: 1 }, harvestLog: [], fertilizerTrackers: {}, comparePlants: [] };
  it("have a translated title and description for every quest, in every language", () => {
    // Quests rotate by weekday, so walk a week to see all of them.
    try {
      for (const { code } of i18n.LANGUAGES) {
        i18n.setLocale(code);
        for (let d = 0; d < 7; d += 1) {
          const day = core.getDateKey(new Date(2026, 0, 4 + d));
          for (const q of core.getDailyQuests({ ...args, today: day })) {
            ok(!/^questText\./.test(q.title) && !/^questText\./.test(q.description), `${code} ${q.id}`);
          }
        }
      }
      i18n.setLocale("de");
      eq(core.getDailyQuests({ ...args, today: "2026-01-05" }).some((q) => /Pflanze|Ernte|Serie|Tagebuch|Gieß/.test(q.title)), true);
    } finally {
      i18n.setLocale("en");
    }
  });
});

describe("achievements and banners", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  const args = { savedPlants: ["Tomato"], followedPlants: [], journalEntries: [], gardenMap: {}, wateredPlants: {}, streakData: { count: 3 },
    gardenXP: { level: 4 }, careLog: [], harvestTrackers: {}, fertilizerTrackers: {}, harvestLog: [], wateringHistory: {}, completedQuestIds: [], comparePlants: [], premiumUnlocked: false };
  it("are worded in every language, with nothing left in English", () => {
    const enBadges = core.getAchievementBadges(args);
    const enBanners = core.getProfileBanners(args);
    try {
      for (const { code } of i18n.LANGUAGES) {
        if (code === "en") continue;
        i18n.setLocale(code);
        const badges = core.getAchievementBadges(args);
        const banners = core.getProfileBanners(args);
        badges.forEach((b, i) => {
          ok(!/^(ach|achText|achTitle|levelTitles)\./.test(b.title + b.text + b.category), `${code} ${b.id}`);
          if (b.id !== "garden_gnome_ultimate" || b.unlocked) ok(b.title !== enBadges[i].title, `${code} ${b.id} title`);
          ok(b.text !== enBadges[i].text, `${code} ${b.id} text`);
        });
        banners.forEach((b, i) => ok(b.subtitle !== enBanners[i].subtitle, `${code} ${b.id}`));
      }
    } finally {
      i18n.setLocale("en");
    }
  });
});

describe("plant-page advice from core", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("follows the app language and formats spacing in the gardener's units", () => {
    const tomato = items.find((i) => i.name === "Tomato");
    eq(core.getShouldGrowText({ ...tomato, name: "Quux" }, "", null).includes("Zone your area"), false);
    try {
      i18n.setLocale("de");
      for (const item of items.slice(0, 60)) {
        const where = core.getWhereToPlantText(item, "metric");
        ok(!/inches| ft\b|sunniest|open ground/.test(where), where);
        ok(!/^(adviceText|growText)\./.test(core.getShouldGrowText(item, "7", null)), item.name);
      }
      eq(core.getWateringTip(null), "Gieß gründlich und regelmäßig und behalte die Bodenfeuchte im Blick.");
      ok(/Zoll/.test(core.getWhereToPlantText(tomato, "imperial")) || !/\d/.test(core.getWhereToPlantText(tomato, "imperial")));
    } finally {
      i18n.setLocale("en");
    }
  });
});

describe("weather recommendation, sun warnings and the planting window", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("follow the app language", () => {
    try {
      i18n.setLocale("fr");
      ok(!/Frost protection/.test(core.getSmartWeatherRecommendation("7", { minTempF: 20, maxTempF: 40 }, []).title));
      ok(!/needs full sun/.test(core.getSunMismatch(items.find((i) => core.getPlantSunNeed(i).need === "full"), "shade").text));
      const tomato = items.find((i) => i.name === "Tomato");
      ok(!/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/.test(core.getPlantingWindowText(tomato)), core.getPlantingWindowText(tomato));
      for (const key of core.WHATS_NEW_ITEMS) ok(i18n.t(key) !== key, key);
    } finally {
      i18n.setLocale("en");
    }
  });
});

describe("plant quick facts", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("keep English spacing unchanged and convert it before translating", () => {
    const tomato = items.find((i) => i.name === "Tomato");
    eq(core.getPlantQuickFacts(tomato, "imperial").spacing, '24" apart');
    eq(core.getPlantQuickFacts(tomato, "metric").spacing, "61 cm apart");
    try {
      i18n.setLocale("de");
      const facts = core.getPlantQuickFacts(tomato, "metric");
      eq(facts.spacing, "61 cm Abstand");
      ok(!/sun|water|soil/i.test(`${facts.sun} ${facts.water} ${facts.soil}`), JSON.stringify(facts));
    } finally {
      i18n.setLocale("en");
    }
  });
});

describe("the monthly checklist", () => {
  it("counts as complete once every task the card shows is ticked", () => {
    // The card stores ticks by task; this read them by index, so the home
    // screen's checklist never hid however many tasks were done.
    const tasks = core.getMonthlyChecklistTasks("7");
    const month = Object.fromEntries(tasks.map((task) => [task, true]));
    eq(core.isMonthlyChecklistComplete("7", { [core.getMonthKey()]: month }), true);
    const { [tasks[0]]: _first, ...rest } = month;
    eq(core.isMonthlyChecklistComplete("7", { [core.getMonthKey()]: rest }), false);
    const card = fs.readFileSync(path.join(ROOT, "components/MonthlyChecklistCard.js"), "utf8");
    ok(/month\[task\] = !month\[task\]/.test(card), "the card still keys ticks by task");
  });
});

describe("monthly checklist labels", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  it("translate every task for display while ticks stay keyed by the English task", () => {
    const all = new Set();
    for (const bucket of Object.keys(core.SEASONAL_TASKS)) for (let m = 0; m < 12; m += 1) (core.SEASONAL_TASKS[bucket][m] || []).forEach((task) => all.add(task));
    core.getMonthlyChecklistTasks("7").forEach((task) => all.add(task));
    try {
      for (const { code } of i18n.LANGUAGES) {
        if (code === "en") continue;
        i18n.setLocale(code);
        const missed = [...all].filter((task) => i18n.fromEnglish("monthlyTask", task) === task);
        eq(missed, [], code);
      }
    } finally {
      i18n.setLocale("en");
    }
    for (const task of all) eq(i18n.fromEnglish("monthlyTask", task), task);
  });
});

describe("companion pairs are judged from both sides", () => {
  it("whichever slot each plant is in", () => {
    // Rosemary's chart says avoid Basil; Basil's says nothing about Rosemary.
    // Read one way, the conflict only showed with Rosemary in the earlier slot.
    eq(core.getCompatibilityScore("Basil", "Rosemary").label, core.getCompatibilityScore("Rosemary", "Basil").label);
    const bed = (a, b) => [{ id: "a", name: "Bed", plots: { "slot-1": a, "slot-2": b } }];
    eq(core.findGardenConflicts(bed("Basil", "Rosemary")).length, core.findGardenConflicts(bed("Rosemary", "Basil")).length);
    ok(core.findGardenConflicts(bed("Basil", "Rosemary")).length > 0);
    // Every pair in the catalog agrees with itself reversed.
    const sample = names.slice(0, 120);
    let asymmetric = 0;
    for (const a of sample) for (const b of sample) if (a < b && core.getCompatibilityScore(a, b).label !== core.getCompatibilityScore(b, a).label) asymmetric += 1;
    eq(asymmetric, 0);
  });
});

describe("what the app writes to storage, it reads back", () => {
  it("covers the theme, the daily bonus date and the harvest log", () => {
    const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
    const multiGet = app.slice(app.indexOf("const values = await AsyncStorage.multiGet(["), app.indexOf("]);", app.indexOf("const values = await AsyncStorage.multiGet([")));
    for (const key of ["STORAGE_KEYS.profileTheme", "STORAGE_KEYS.dailyBonusDate"]) ok(multiGet.includes(key), `${key} is fetched at launch`);
    ok(/hydrate\("pp_harvestLog"/.test(app), "the harvest log is read back");
  });
});

describe("signing out", () => {
  it("clears the recently viewed plants and fired milestones", () => {
    const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
    const start = app.indexOf("const clearLocalAccountData = async () => {");
    const body = app.slice(start, app.indexOf("\n};\n", start));
    ok(/setRecentPlants\(\[\]\)/.test(body) && /setFiredMilestones\(\[\]\)/.test(body));
  });
});

describe("turning weather alerts off", () => {
  it("also cancels a heat alert already scheduled", () => {
    const settings = fs.readFileSync(path.join(ROOT, "screens/SettingsTab.js"), "utf8");
    ok(/cancelReminder\("heat-detected"\)/.test(settings));
  });
});

describe("saving several plants at once from the Plants tab", () => {
  it("goes through saveManyPlants, which applies the free-plan cap", () => {
    const tab = fs.readFileSync(path.join(ROOT, "screens/PlantsTab.js"), "utf8");
    const bulk = tab.slice(tab.indexOf("const bulkSave = () => {"), tab.indexOf("const bulkCompare"));
    ok(/onSaveMany\(toSave\)/.test(bulk) && !/toggleSavedPlant/.test(bulk), bulk);
    ok(/<PlantsTab[\s\S]{0,80}onSaveMany=\{saveManyPlants\}/.test(fs.readFileSync(path.join(ROOT, "App.js"), "utf8")));
  });
});

describe("Fix My Garden's move suggestion", () => {
  it("can send a clashing plant to an empty bed", () => {
    const beds = [
      { id: "a", name: "Bed A", size: 12, plots: { "slot-1": "Rosemary", "slot-2": "Basil" } },
      { id: "b", name: "Bed B", size: 12, plots: {} },
    ];
    const [conflict] = core.findGardenConflicts(beds);
    ok(conflict, "the clash is found");
    eq(conflict.suggestion && conflict.suggestion.toAreaId, "b");
  });
});

describe("the saved plants card's Recent sort", () => {
  it("orders by the day each plant was saved, not by the A–Z list", () => {
    const card = fs.readFileSync(path.join(ROOT, "components/SavedPlantsCard.js"), "utf8");
    ok(!/savedPlants\.indexOf\(b\.name\) - savedPlants\.indexOf\(a\.name\)/.test(card));
    ok(/plantSaveDates\?\.\[a\.name\]/.test(card));
    ok(/<SavedPlantsCard[^>]*plantSaveDates=\{plantSaveDates\}/.test(fs.readFileSync(path.join(ROOT, "screens/HomeTab.js"), "utf8")));
  });
});

describe("Home's plant-this-month pick", () => {
  it("uses the real current month, not the Plants tab's saved browse month", () => {
    const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
    ok(/getSuggestionsForMonth\(zone, parseStoredDate\(todayKey\)\.getMonth\(\) \+ 1\)/.test(app));
    ok(/plantPick: thisMonthSuggestions\[0\]/.test(app), "the widget");
    ok(/monthlySuggestions=\{thisMonthSuggestions\}/.test(app), "Home");
    ok(app.indexOf("const [todayKey, setTodayKey]") < app.indexOf("const thisMonthSuggestions"), "declared after todayKey");
  });
});

describe("the premium entitlement check", () => {
  it("lets an active store receipt outrank a stale inactive server row", () => {
    const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
    const fn = app.slice(app.indexOf("async function refreshEntitlement"), app.indexOf("async function unlockPremium"));
    ok(/if \(data\.is_active === true && notExpired\) \{ setPremiumUnlocked\(true\); return; \}/.test(fn));
    ok(/const fromStore = await reconcileFromStore\(\);\s*if \(fromStore === null\) setPremiumUnlocked\(false\);/.test(fn));
    ok(/return active;/.test(fn) && /return null;/.test(fn));
  });
});

describe("a failed cloud save", () => {
  const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("is retried on a timer and on returning to the app", () => {
    ok(/if \(!user \|\| !cloudProfileLoaded \|\| !syncFailed\) return;/.test(app));
    ok(/setInterval\(retry, 30000\)/.test(app) && /state === "active"\) retry\(\)/.test(app));
  });
  it("isn't overwritten by pull-to-refresh", () => {
    ok(/if \(syncFailed\) await saveProfileToSupabase\(\);\s*else await loadProfileFromSupabase\(\);/.test(app));
  });
});

describe("weather coordinates", () => {
  const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
  const effect = app.slice(app.indexOf("async function loadWeather()"), app.indexOf("loadWeather();\n}, [zip, country, record, weatherRefreshToken]);"));
  it("come from the current place, never a previous ZIP's", () => {
    // zipCoords was reused after a ZIP or country change; the new place got
    // the old one's forecast and hemisphere.
    ok(!/let coords = zipCoords/.test(effect));
    ok(/let coords = typeof record\.lat === "number"/.test(effect));
  });
  it("are published from every source, so the Daylight card can show", () => {
    ok(/setZipCoords\(coords\);\nif \(coords\?\.lat != null\) setLatitude/.test(effect));
  });
});

describe("a failed forecast request", () => {
  const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
  const effect = app.slice(app.indexOf("async function loadWeather()"), app.indexOf("loadWeather();\n}, [zip, country, record, weatherRefreshToken]);"));
  it("leaves the cached forecast alone instead of raising a false frost alert", () => {
    ok(/if \(!weatherResponse\.ok\) \{ if \(!paintedFromCache\) setWeather\(null\); return; \}/.test(effect));
    ok(/if \(!forecast\.length\) \{ if \(!paintedFromCache\) setWeather\(null\); return; \}/.test(effect));
    const catchBlock = effect.slice(effect.lastIndexOf("} catch (error) {"));
    ok(/if \(!paintedFromCache\) setWeather\(null\);/.test(catchBlock), "an offline error keeps this place's cached paint");
  });
});

describe("the garden timeline", () => {
  it("opens a plant with its catalog item, not its name", () => {
    const card = fs.readFileSync(path.join(ROOT, "components/GardenTimelineCard.js"), "utf8");
    ok(/onOpenPlant\(plantItem\)/.test(card) && !/onOpenPlant\(ev\.plantName\)/.test(card));
  });
});

describe("journal captions", () => {
  it("are saved onto the entry, not into the card's own state", () => {
    const card = fs.readFileSync(path.join(ROOT, "components/JournalCard.js"), "utf8");
    ok(!/localCaptions/.test(card) && /onUpdateCaption\(entryId, captionDraft\)/.test(card));
    const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
    ok(/entry\.id === entryId \? \{ \.\.\.entry, caption: text \}/.test(app));
    ok(/onUpdateCaption=\{updateJournalCaption\}/.test(fs.readFileSync(path.join(ROOT, "screens/JournalTab.js"), "utf8")));
  });
});

describe("the journal's general garden photos", () => {
  it("aren't counted or shown as a plant called Garden", () => {
    const card = fs.readFileSync(path.join(ROOT, "components/JournalCard.js"), "utf8");
    ok(/e\.plantName !== "Garden"/.test(card));
    ok(/new Set\(journalEntries\.map\(plantOf\)\.filter\(Boolean\)\)\.size/.test(card));
  });
});

describe("the games' results screen", () => {
  it("says New best only when the score beat the old best", () => {
    const quiz = fs.readFileSync(path.join(ROOT, "components/QuizGame.js"), "utf8");
    ok(/setNewBest\(finalScore > best && finalScore > 0\)/.test(quiz) && /\{newBest \? <Text/.test(quiz) && !/const isRecord/.test(quiz));
  });
});

describe("XP popups and the level-up card", () => {
  it("show on every tab, not only on the plant page", () => {
    const app = fs.readFileSync(path.join(ROOT, "App.js"), "utf8");
    const shell = app.slice(app.lastIndexOf("{undoToast ? ("));
    ok(/xpPopups\.map\(/.test(shell) && /\{showLevelUp \? \(/.test(shell));
  });
});
