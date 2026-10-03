const path = require("path");
const { describe, it, eq, ok, ROOT } = require("../test.js");
const core = require(path.join(ROOT, "core.js"));
const produce = require(path.join(ROOT, "data/produceData.js"));
const items = produce.default || produce;
const names = items.map((i) => i.name);

describe("level curve", () => {
  it("round-trips: the XP for a level earns exactly that level", () => {
    for (let L = 1; L <= 120; L += 1) eq(core.levelForXP(core.xpForLevel(L)), L, `level ${L}`);
  });
  it("never goes backwards as XP rises", () => {
    let last = 0;
    for (let xp = 0; xp <= 400000; xp += 137) {
      const lvl = core.levelForXP(xp);
      ok(lvl >= last, `level dropped at ${xp} XP`);
      last = lvl;
    }
  });
  it("demotes nobody who levelled under the old quadratic curve", () => {
    // The curve changed; a gardener must never open the app and find themselves
    // a level lower than they were.
    const before = (xp) => Math.floor(Math.sqrt(xp / 250)) + 1;
    let demoted = 0;
    for (let xp = 0; xp <= 3000000; xp += 250) {
      if (core.levelForXP(xp) < before(xp)) demoted += 1;
    }
    eq(demoted, 0);
  });
  it("leaves the early game exactly as it was", () => {
    for (let L = 1; L <= 5; L += 1) eq(core.xpForLevel(L), 250 * (L - 1) * (L - 1), `level ${L}`);
  });
  it("puts level 100 within reach of a dedicated gardener", () => {
    const need = core.xpForLevel(100);
    ok(need < 250000, `level 100 needs ${need} XP, which is out of reach`);
    ok(need > 100000, `level 100 needs only ${need} XP, which is too cheap`);
  });
});

describe("getGardenXP", () => {
  const build = (n) => ({
    savedPlants: names.slice(0, n),
    journalEntries: Array.from({ length: n * 5 }, () => ({ id: 1 })),
    gardenMap: {}, wateredPlants: {}, streakData: { count: n }, bonusXP: 0, questXP: 0,
  });
  it("rises with the size of the garden", () => {
    const a = core.getGardenXP(build(5)), b = core.getGardenXP(build(50));
    ok(b.xp > a.xp && b.level >= a.level);
  });
  it("reports progress bounds that match the curve", () => {
    const g = core.getGardenXP(build(30));
    eq(g.currentLevelXP, g.xp - core.xpForLevel(g.level));
    eq(g.nextLevelXP, core.xpForLevel(g.level + 1) - core.xpForLevel(g.level));
    ok(g.progress >= 0 && g.progress <= 1, `progress ${g.progress} out of range`);
  });
});

describe("calculateGardenHealth", () => {
  // The original O(plots^2) implementation, kept as the definition of the score.
  const reference = (gardenMap) => {
    const plants = Object.values(gardenMap || {}).filter(Boolean);
    if (!plants.length) return { score: 0, label: "No plants yet" };
    let score = 100;
    plants.forEach((a) => plants.forEach((b) => {
      if (a === b) return;
      const l = core.getCompatibilityScore(a, b).label;
      if (l === "Avoid") score -= 8;
      if (l === "Excellent Pair") score += 3;
    }));
    score = Math.max(35, Math.min(100, score));
    let label = "Healthy";
    if (score < 60) label = "Needs improvement";
    else if (score < 80) label = "Moderate";
    return { score, label };
  };
  it("matches the reference across gardens of every shape", () => {
    let seed = 1;
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    let mismatch = 0;
    for (let trial = 0; trial < 400; trial += 1) {
      const n = 1 + Math.floor(rnd() * 100);
      // Sometimes a tiny pool (heavy duplication), sometimes the whole catalog.
      const pool = names.slice(0, Math.max(1, Math.floor(rnd() * rnd() * names.length)) || 1);
      const map = {};
      for (let i = 0; i < n; i += 1) map[`p${i}`] = pool[Math.floor(rnd() * pool.length)];
      if (JSON.stringify(reference(map)) !== JSON.stringify(core.calculateGardenHealth(map))) mismatch += 1;
    }
    eq(mismatch, 0);
  });
  it("handles the empty and single-plant cases", () => {
    eq(core.calculateGardenHealth({}), { score: 0, label: "No plants yet" });
    eq(core.calculateGardenHealth({ a: "Tomato" }), { score: 100, label: "Healthy" });
  });
  it("still lets duplicates amplify a conflict", () => {
    const one = core.calculateGardenHealth({ a: "Tomato", b: "Fennel" }).score;
    const many = core.calculateGardenHealth({ a: "Tomato", b: "Tomato", c: "Tomato", d: "Fennel" }).score;
    ok(many < one, "more conflicting plants should score worse");
  });
});

describe("harvest and fertilizer timing", () => {
  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); };
  it("counts whole calendar days left, clamped at zero", () => {
    eq(core.getHarvestDaysLeft({ days: 60, startedAt: daysAgo(10) }), 50);
    eq(core.getHarvestDaysLeft({ days: 60, startedAt: daysAgo(60) }), 0);
    eq(core.getHarvestDaysLeft({ days: 60, startedAt: daysAgo(90) }), 0, "overdue clamps, not negative");
    eq(core.getHarvestDaysLeft(null), null);
    eq(core.getHarvestDaysLeft({ days: "x", startedAt: daysAgo(1) }), null);
  });
  it("treats an overdue tracker as ready", () => {
    ok(core.isHarvestReady({ days: 10, startedAt: daysAgo(40) }));
    ok(!core.isHarvestReady({ days: 60, startedAt: daysAgo(1) }));
  });
  it("counts days since feeding from midnight, not from the clock time", () => {
    eq(core.getFertilizerDaysSince({ lastFertilized: daysAgo(14) }), 14);
    eq(core.getFertilizerDaysSince(null), null);
    ok(core.isFertilizerDue("Tomato", null), "never fed is due");
  });
});

describe("parseDecimal", () => {
  const P = (x) => core.parseDecimal(x);
  it("reads a decimal comma the way it reads a decimal point", () => {
    // The decimal pad types a comma in most of Europe; parseFloat("4,99") is 4.
    eq(P("4,99"), 4.99);
    eq(P("4.99"), 4.99);
    eq(P("6,5"), 6.5);
    eq(P("-2,5"), -2.5);
  });
  it("treats earlier separators as thousands", () => {
    eq(P("1.234,56"), 1234.56);
    eq(P("1,234.56"), 1234.56);
  });
  it("accepts what parseFloat accepted from a keypad", () => {
    eq(P("12"), 12);
    eq(P("5."), 5);
    eq(P(".5"), 0.5);
    eq(P(" 3 "), 3);
  });
  it("is NaN for anything that is not a number", () => {
    for (const bad of ["", "abc", "1,2,x", "--1", null, undefined]) ok(Number.isNaN(P(bad)), `${bad}`);
  });
  it("is what every decimal field uses", () => {
    const fs20 = require("fs");
    const offenders = [];
    for (const f of fs20.readdirSync(path.join(ROOT, "components")).filter((x) => x.endsWith(".js"))) {
      const src = fs20.readFileSync(path.join(ROOT, "components", f), "utf8");
      if (/keyboardType="(decimal-pad|numeric)"/.test(src) && /parseFloat\(/.test(src)) offenders.push(f);
      // Filtering keystrokes down to digits and "." turns a typed "1,5" into 15.
      if (/keyboardType="decimal-pad"/.test(src) && /\[\^0-9\.\]/.test(src)) offenders.push(`${f} (drops the decimal comma)`);
    }
    eq(offenders, []);
  });
});

describe("harvest value", () => {
  const Q = core.parseHarvestQuantity;
  const near = (a, b, msg) => ok(Math.abs(a - b) < 0.01, `${msg}: ${a} vs ${b}`);
  it("prices a counted harvest per item and a weighed one per pound", () => {
    eq(Q("6 tomatoes"), 6);
    eq(Q("2 lbs"), 2);
    near(Q("8 oz"), 0.5, "8 oz");
  });
  it("converts metric weights to pounds instead of counting grams", () => {
    near(Q("500 g"), 1.102, "500 g");
    near(Q("500g"), 1.102, "500g");
    near(Q("2", "kg"), 4.409, "2 + kg unit");
    near(Q("250 gramos"), 0.551, "gramos");
  });
  it("reads the keyboard's decimal comma", () => {
    near(Q("1,5 kg"), 3.307, "1,5 kg");
    eq(Q("2,5 lbs"), 2.5);
  });
  it("does not mistake produce names for units", () => {
    eq(Q("3 garlic heads"), 3);
    eq(Q("2 grapes"), 2);
    eq(Q("3 chili peppers"), 3);
    eq(Q("12 onions"), 12);
    eq(Q("a bunch"), 1);
  });
  it("values 500 g of tomatoes at a few dollars, not $1,500", () => {
    const { total } = core.estimateHarvestValue([{ plantName: "Tomato", amount: "500 g" }]);
    eq(total, 3);
  });
});

describe("level titles and badges in the app language", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  const xpAt = (level) => {
    // The smallest bonus XP that lands exactly on `level`.
    const xp = core.xpForLevel(level);
    return core.getGardenXP({ savedPlants: [], journalEntries: [], gardenMap: {}, wateredPlants: {}, streakData: { count: 0 }, bonusXP: xp, questXP: 0 });
  };
  const badges = () => core.getAchievementBadges({
    savedPlants: ["Tomato", "Basil", "Kale"], followedPlants: [], journalEntries: [], gardenMap: {}, wateredPlants: {},
    streakData: { count: 2 }, gardenXP: { level: 12 }, careLog: [], harvestTrackers: {}, visibleFertilizerTrackers: {},
    harvestLog: [], wateringHistory: {},
  });
  it("keeps the English titles", () => {
    eq(xpAt(1).title, "Seedling");
    eq(xpAt(5).title, "Backyard Grower");
    eq(xpAt(57).title, "Garden Oracle");
    eq(xpAt(100).title, "🌟 Garden Gnome");
    const byId = Object.fromEntries(badges().map((b) => [b.id, b]));
    eq(byId.save_5_plants.title, "Green Thumb");
    eq(byId.save_5_plants.text, "Save 5 plants. 3/5 saved.");
    eq(byId.first_plant_saved.text, "Save your first plant. 1/1 saved.");
    eq(byId.level_10.text, "Reach Level 10. Level 10/10.");
    eq(byId.streak_7.category, "🔥 Streaks");
    eq(byId.garden_gnome_ultimate.title, "???");
  });
  it("translates every badge, with no raw keys left", () => {
    try {
      i18n.setLocale("es");
      eq(xpAt(10).title, "Mano verde");
      const list = badges();
      for (const b of list) {
        ok(!/^(badges|levels)\./.test(b.title) && !/^(badges|levels)\./.test(b.text) && !/^badges\./.test(b.category), `${b.id}: ${b.title} / ${b.text}`);
      }
      const byId = Object.fromEntries(list.map((b) => [b.id, b]));
      eq(byId.save_5_plants.text, "Guarda 5 plantas. 3/5 guardadas.");
      eq(byId.streak_7.title, "Racha de 7 días");
    } finally {
      i18n.setLocale("en");
    }
  });
});

describe("daily quests in the app language", () => {
  const i18n = require(path.join(ROOT, "lib/i18n.js"));
  const quests = () => core.getDailyQuests({
    savedPlants: [], journalEntries: [], gardenMap: {}, wateredPlants: {}, careLog: [], harvestTrackers: {},
    streakData: { count: 0 }, harvestLog: [], visibleFertilizerTrackers: {}, comparePlants: [],
  });
  it("has a title and description for every quest in every language", () => {
    for (const code of ["en", "es", "de", "ja"]) {
      try {
        i18n.setLocale(code);
        for (const q of quests()) {
          ok(!q.title.startsWith("quests.") && !q.description.startsWith("quests.") && !q.difficultyText.startsWith("quests."), `${code} ${q.id}`);
        }
      } finally {
        i18n.setLocale("en");
      }
    }
  });
  it("keeps difficulty English for the colours", () => {
    for (const q of quests()) ok(["Easy", "Medium", "Hard", "Bonus"].includes(q.difficulty), q.id);
  });
});
