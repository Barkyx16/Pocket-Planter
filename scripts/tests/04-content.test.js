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
  const start = app.indexOf("function toggleSavedPlant(");
  const body = start < 0 ? "" : app.slice(start, app.indexOf("// Counted by what the gardener can see", start));

  it("cancels every reminder that names the plant", () => {
    // `plant-<name>` is the daily check-in from "Set reminder". It repeats every
    // morning and only the master switch cancelled it, so a removed plant kept
    // its reminder for as long as reminders stayed on.
    ok(start > 0, "toggleSavedPlant should exist");
    for (const [label, re] of [
      ["the daily check-in", /cancelReminder\(`plant-\$\{name\}`\)/],
      ["the next-watering reminder", /cancelPlantWaterReminder\(name\)/],
      ["the fertilizer reminder", /cancelFertilizerReminder\(name\)/],
    ]) ok(re.test(body), `removing a plant must cancel ${label}`);
  });
  it("forgets the plant's reminder setting", () => {
    ok(/dropKey\(setWateringReminders\)/.test(body),
      "a removed plant should not stay listed as having a daily reminder");
  });
  it("uses the same id the reminder is scheduled under", () => {
    ok(/id: `plant-\$\{plantName\}`/.test(app), "scheduleReminder's id should still be plant-<name>");
  });
});

describe("the cloud row carries the whole garden too", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const PROGRESS = ["plantSaveDates", "harvestGoal", "monthlyChecklist", "frostChecklist",
                    "badgeEarnedDates", "bannerEarnedDates", "streakFreeze", "pinnedPlants"];
  const saveAt = app.indexOf("const saveProfileToSupabase");
  const save = app.slice(saveAt, app.indexOf("const profileRow", saveAt));
  const loadAt = app.indexOf("const progress = data.module_data[CLOUD_PROGRESS_KEY]");
  const load = app.slice(loadAt, app.indexOf("\n}\n", loadAt));

  it("saves the progress the backup file gained", () => {
    // The backup file carried these eight; the cloud row did not, and for a
    // gardener who never exports a file the cloud row is the only backup.
    ok(saveAt > 0 && /\[CLOUD_PROGRESS_KEY\]: \{/.test(save), "the save should fold progress into module_data");
    for (const f of PROGRESS) ok(new RegExp(`\\b${f}\\b`).test(save), `${f} is not synced`);
    ok(/module_data: moduleBlob/.test(app), "the blob with the progress is what gets sent");
  });
  it("restores every field it saves", () => {
    ok(loadAt > 0, "the cloud load should read the progress back");
    for (const f of PROGRESS) ok(load.includes(`progress.${f}`), `${f} is synced but never restored`);
  });
  it("re-syncs when any of it changes", () => {
    const depsAt = app.indexOf("saveTimerRef.current = setTimeout(() => { saveProfileToSupabase(); }");
    const deps = app.slice(depsAt, app.indexOf("]);", depsAt));
    for (const f of PROGRESS) ok(new RegExp(`\\n\\s*${f},`).test(deps), `changing ${f} never triggers a sync`);
  });
  it("keeps the key out of the module restore", () => {
    const core8 = require(path.join(ROOT, "core.js"));
    ok(!core8.MODULE_STORAGE_KEYS.includes("_progress"));
  });
});

describe("settings reach a new device without the optional columns", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const saveAt = app.indexOf("const saveProfileToSupabase");
  const save = app.slice(saveAt, app.indexOf("const profileRow", saveAt));
  it("copies country, latitude, units and the weekly recap into module_data", () => {
    // The optional-prefs update gives up for the session if any one of its six
    // columns is missing. Without country a new device reads a UK postcode as a
    // US ZIP and keeps the digits.
    for (const f of ["country", "latitude", "unitSystem", "weeklyRecapOn"]) {
      ok(new RegExp(`\\b${f}\\b`).test(save), `${f} has no fallback`);
    }
  });
  it("reads the column first and the copy second", () => {
    ok(/findCountry\(data\?\.country\) \|\| findCountry\(synced\.country\)/.test(app));
    ok(/typeof data\?\.latitude === "number" \? data\.latitude : synced\.latitude/.test(app));
    ok(/else if \(synced\.unitSystem === "metric" \|\| synced\.unitSystem === "imperial"\)/.test(app));
    ok(/else if \(typeof synced\.weeklyRecapOn === "boolean"\)/.test(app));
  });
  it("reads the postcode with the country it was restored with", () => {
    ok(/setZip\(normalizePostal\(data\.zip_code, cloudCountry\?\.code \|\| country\)\)/.test(app));
  });
  it("syncs when the units or the weekly recap change", () => {
    const depsAt = app.indexOf("saveTimerRef.current = setTimeout(() => { saveProfileToSupabase(); }");
    const deps = app.slice(depsAt, app.indexOf("]);", depsAt));
    for (const f of ["unitSystem", "weeklyRecapOn"]) ok(new RegExp(`\\n\\s*${f},`).test(deps), `${f} never triggers a sync`);
  });
});

describe("logging a feeding", () => {
  const fs12 = require("fs");
  const app = fs12.readFileSync(path.join(ROOT, "App.js"), "utf8");
  const card = fs12.readFileSync(path.join(ROOT, "components/SoilCareLogCard.js"), "utf8");
  const tab = fs12.readFileSync(path.join(ROOT, "screens/GardenTab.js"), "utf8");
  it("moves the plant's fertilizer tracker on", () => {
    // lastFertilized was only ever written when tracking started, so a plant
    // read "fertilizer due" for good once the first interval had passed.
    const at = app.indexOf("function recordFertilized(");
    ok(at > 0, "there should be a way to record a feeding");
    ok(/lastFertilized: new Date\(\)\.toISOString\(\)/.test(app.slice(at, at + 600)));
  });
  it("is wired from the Care Log, whatever the reminder choice", () => {
    ok(/recordFertilized=\{recordFertilized\}/.test(app), "App passes it to the Garden tab");
    ok(/onFertilized=\{recordFertilized\}/.test(tab), "the Garden tab passes it to the Care Log");
    const add = card.slice(card.indexOf("const addCareEntry"), card.indexOf("const deleteCareEntry"));
    const recordAt = add.search(/onFertilized\(selectedPlant\)/);
    const alertAt = add.indexOf("t(\"alerts.fertilizedTitle\")");
    ok(recordAt > 0 && recordAt < alertAt, "recorded before, and regardless of, the reminder prompt");
  });
  it("then reads as not due", () => {
    const core12 = require(path.join(ROOT, "core.js"));
    eq(core12.isFertilizerDue("Tomato", { enabled: true, lastFertilized: new Date().toISOString() }), false);
  });
});

describe("one rule for fertilizer due", () => {
  it("the feeding guide uses each plant's own interval", () => {
    // It used a flat 14 days, so thyme (45) was due in the guide and fine in the
    // Garden stats for a month.
    const src = require("fs").readFileSync(path.join(ROOT, "components/FertilizerIntelligenceCard.js"), "utf8");
    ok(/isFertilizerDue\(plantName, fertilizerTrackers\?\.\[plantName\]\)/.test(src));
    ok(!/daysSince >= 14/.test(src));
    const core13 = require(path.join(ROOT, "core.js"));
    const fed = new Date(); fed.setDate(fed.getDate() - 20);
    eq(core13.isFertilizerDue("Thyme", { lastFertilized: fed.toISOString() }), false, "thyme at 20 of 45 days");
    eq(core13.isFertilizerDue("Tomato", { lastFertilized: fed.toISOString() }), true, "tomato at 20 of 14 days");
  });
});

describe("deleting an account", () => {
  const src = require("fs").readFileSync(path.join(ROOT, "supabase/functions/delete-account/index.ts"), "utf8");
  it("deletes every per-user table the app writes, not only the profile", () => {
    // profile_snapshots is a daily copy of the whole profile row. A deleted
    // account left one behind for every day it had been used.
    const written = new Set();
    for (const f of ["App.js", "core.js"]) {
      const app = require("fs").readFileSync(path.join(ROOT, f), "utf8");
      for (const m of app.matchAll(/\.from\("([a-z_]+)"\)\s*\.insert\(\{\s*user_id:/g)) written.add(m[1]);
    }
    ok(written.has("profile_snapshots") && written.has("zone_activity"), "the scan should find both");
    for (const table of written) ok(src.includes(`"${table}"`), `${table} is never cleaned up`);
  });
  it("stops before deleting the login if the profile row survives", () => {
    const profileAt = src.indexOf('from("profiles").delete()');
    const checkAt = src.indexOf("if (profileError)", profileAt);
    const authAt = src.indexOf("auth.admin.deleteUser");
    ok(profileAt > 0 && checkAt > profileAt && checkAt < authAt,
      "a failed profile delete must return before the auth user is removed");
  });
});

describe("the RevenueCat webhook", () => {
  const src = require("fs").readFileSync(path.join(ROOT, "supabase/functions/revenuecat-webhook/index.ts"), "utf8");
  it("ignores an expiration for a period already renewed past", () => {
    // Delivery order is not guaranteed. A late EXPIRATION for the previous
    // period used to switch off a live subscription.
    const guardAt = src.indexOf('if (type === "EXPIRATION" && expiresMs)');
    const upsertAt = src.indexOf('from("premium_entitlements").upsert(');
    ok(guardAt > 0 && guardAt < upsertAt, "the stale-expiration check must come before the write");
    ok(/current\?\.is_active && currentMs > expiresMs/.test(src));
  });
  it("still refuses an unauthenticated caller", () => {
    ok(/status: 401/.test(src) && /REVENUECAT_WEBHOOK_SECRET/.test(src));
  });
});

describe("a snooze ends when the plant is watered or removed", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  // From the function's name to the next function declared at any indentation,
  // so one body never borrows a call from the function after it.
  const body = (name) => {
    const at = app.search(new RegExp(`function ${name}\\(`));
    if (at < 0) return "";
    const rest = app.slice(at + 10);
    const end = rest.search(/\n\s*(async )?function /);
    return app.slice(at, end < 0 ? at + 4000 : at + 10 + end);
  };
  it("rebuilds the morning summary when it does", () => {
    const helper = body("clearSnoozes");
    ok(/scheduleSnoozeSummary\(next\)/.test(helper), "the summary must be rebuilt from what is left");
  });
  it("on every way of watering", () => {
    // "Tomato is ready for water" went out the morning after the tomato was
    // watered, because watering never touched the snooze.
    for (const fn of ["markPlantWatered", "waterAllPlants", "waterPlant", "waterArea"]) {
      ok(/clearSnoozes\(/.test(body(fn)), `${fn} leaves the snooze in place`);
    }
  });
  it("and when the plant leaves the garden", () => {
    ok(/clearSnoozes\(\[name\]\)/.test(body("toggleSavedPlant")));
  });
});

describe("every way of watering schedules the next reminder", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  const body = (name) => {
    const at = app.search(new RegExp(`function ${name}\\(`));
    if (at < 0) return "";
    const rest = app.slice(at + 10);
    const end = rest.search(/\n\s*(async )?function /);
    return app.slice(at, end < 0 ? at + 4000 : at + 10 + end);
  };
  it("including a whole bed at once", () => {
    for (const fn of ["markPlantWatered", "waterAllPlants", "waterPlant", "waterArea"]) {
      ok(/schedulePlantWaterReminder\(/.test(body(fn)), `${fn} never schedules the next reminder`);
    }
  });
});

describe("the companion quiz", () => {
  const core16 = require(path.join(ROOT, "core.js"));
  const games = require(path.join(ROOT, "screens/GamesTab.js"));
  const produce16 = require(path.join(ROOT, "data/produceData.js"));
  const catalog = produce16.default || produce16;
  const excellent = (a, b) => core16.getCompatibilityScore(a, b).label === "Excellent Pair";
  it("only accepts answers the pair check calls excellent", () => {
    // Sage's general-advice chart names Basil, and the quiz marked Basil right
    // while the garden map calls the pair one to avoid.
    ok(!games.companionAnswers("Sage").some((p) => p.name === "Basil"), "Basil is not Sage's companion");
    const wrong = [];
    for (const p of catalog) {
      for (const a of games.companionAnswers(p.name)) if (!excellent(p.name, a.name)) wrong.push(`${p.name}/${a.name}`);
    }
    eq(wrong, []);
    ok(games.companionAnswers("Tomato").some((p) => p.name === "Basil"), "the classic pair is still asked");
  });
  it("never offers a second right answer as a distractor", () => {
    const wrong = [];
    for (const name of ["Tomato", "Corn", "Carrot", "Sage", "Potato", "Pea", "Cabbage", "Basil", "Cucumber", "Lettuce"]) {
      const answers = games.companionAnswers(name);
      if (!answers.length) continue;
      for (const d of games.companionDistractors(name, answers[0].name)) if (excellent(name, d.name)) wrong.push(`${name}/${d.name}`);
    }
    eq(wrong.slice(0, 3), []);
  });
  it("puts plants to avoid first", () => {
    const pool = games.companionDistractors("Tomato", "Basil");
    const firstNotAvoid = pool.findIndex((p) => core16.getCompatibilityScore("Tomato", p.name).label !== "Avoid");
    ok(firstNotAvoid > 0, "Tomato has plants to avoid, and they should lead");
    ok(pool.slice(firstNotAvoid).every((p) => core16.getCompatibilityScore("Tomato", p.name).label !== "Avoid"));
  });
});
