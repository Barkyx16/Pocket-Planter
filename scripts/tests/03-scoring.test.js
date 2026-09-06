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
