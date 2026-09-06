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
