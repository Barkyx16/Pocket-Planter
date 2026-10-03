const path = require("path");
const { describe, it, eq, ok, ROOT } = require("../test.js");
const core = require(path.join(ROOT, "core.js"));
const produce = require(path.join(ROOT, "data/produceData.js"));
const items = produce.default || produce;
const names = items.map((i) => i.name);

describe("plantNameMatchesKey", () => {
  it("matches a whole word", () => {
    ok(core.plantNameMatchesKey("Pepper", "pepper"));
    ok(core.plantNameMatchesKey("Bell Pepper", "pepper"));
    ok(core.plantNameMatchesKey("Holy Basil (Tulsi)", "basil"));
  });
  it("does not match a word inside a compound", () => {
    // The whole point of the matcher: Peppermint is not a pepper.
    ok(!core.plantNameMatchesKey("Peppermint", "pepper"));
    ok(!core.plantNameMatchesKey("Horseradish", "radish"));
    ok(!core.plantNameMatchesKey("Pineapple", "apple"));
    ok(!core.plantNameMatchesKey("Peach", "pea"));
    ok(!core.plantNameMatchesKey("String of Pearls", "pea"));
  });
  it("tolerates a trailing plural, which is how Grapes lost its window", () => {
    ok(core.plantNameMatchesKey("Grapes", "grape"));
    ok(core.plantNameMatchesKey("Chives", "chive"));
  });
  it("never throws, and never matches a real plant against junk", () => {
    for (const v of [undefined, null, "", 0, NaN, [], {}, false, -1]) {
      // Both arguments junk: must not throw. Its answer is meaningless either way
      // (String({}) matches String({})), so only the crash matters here.
      core.plantNameMatchesKey(v, v);
      eq(core.plantNameMatchesKey("Tomato", v), false, `key ${String(v)}`);
      eq(core.plantNameMatchesKey(v, "tomato"), false, `name ${String(v)}`);
    }
  });
});

describe("careWindowKey", () => {
  const prune = ["apple", "crabapple", "pear", "grape", "mint", "peppermint", "spearmint", "rose", "rosemary", "plum", "cherry", "basil", "tomato", "bean"];
  it("ignores the parenthetical gloss, which names a different plant", () => {
    for (const n of ["Bael (Wood Apple)", "Jamun (Java Plum)", "Jocote (Spanish Plum)",
                     "Tamarillo (Tree Tomato)", "Portulaca (Moss Rose)", "Samphire (Sea Bean)"]) {
      eq(core.careWindowKey(n, prune), null, n);
    }
  });
  it("rejects look-alikes that borrow the word in their own name", () => {
    for (const n of ["Grape Hyacinth", "Sea Grape", "Prickly Pear Cactus", "Prickly Pear (Cactus Pear)"]) {
      eq(core.careWindowKey(n, prune), null, n);
    }
  });
  it("keeps the genuine relatives", () => {
    eq(core.careWindowKey("Grapes", prune), "grape");
    eq(core.careWindowKey("Concord Grape", prune), "grape");
    eq(core.careWindowKey("Crabapple", prune), "crabapple");
    eq(core.careWindowKey("Peppermint", prune), "peppermint");
    eq(core.careWindowKey("Spearmint", prune), "spearmint");
    eq(core.careWindowKey("Rosemary", prune), "rosemary");
    eq(core.careWindowKey("Sour Cherry (Morello)", prune), "cherry");
  });
  it("survives a non-array key list", () => {
    for (const v of [undefined, null, 0, {}, "x"]) eq(core.careWindowKey("Apple", v), null);
  });
});

describe("resolveCompanionName", () => {
  it("resolves the charts' generic names to real catalog plants", () => {
    eq(core.resolveCompanionName("Bean"), "Green Bean");
    eq(core.resolveCompanionName("Squash"), "Zucchini");
    eq(core.resolveCompanionName("Melon"), "Watermelon");
    eq(core.resolveCompanionName("Grape"), "Grapes");
    eq(core.resolveCompanionName("Chive"), "Chives");
  });
  it("is case-insensitive and returns null for advice that is not a plant", () => {
    eq(core.resolveCompanionName("tomato"), "Tomato");
    eq(core.resolveCompanionName("Tansy"), null);
    eq(core.resolveCompanionName("Grass"), null);
    eq(core.resolveCompanionName(""), null);
    eq(core.resolveCompanionName(null), null);
  });
});

describe("getCompatibilityScore", () => {
  const label = (a, b) => core.getCompatibilityScore(a, b).label;
  it("recognises the Three Sisters through the generic chart names", () => {
    eq(label("Corn", "Green Bean"), "Excellent Pair");
    eq(label("Corn", "Zucchini"), "Excellent Pair");
    eq(label("Corn", "Pumpkin"), "Excellent Pair");
  });
  it("keeps the classic pairings and warnings", () => {
    eq(label("Tomato", "Basil"), "Excellent Pair");
    eq(label("Carrot", "Onion"), "Excellent Pair");
    eq(label("Apple", "Chives"), "Excellent Pair");
    eq(label("Tomato", "Fennel"), "Avoid");
    eq(label("Potato", "Tomato"), "Avoid");
    eq(label("Cabbage", "Grapes"), "Avoid");
  });
  it("does not invent a relationship", () => {
    eq(label("Tomato", "Rose"), "Neutral");
  });
});

describe("getCompanionInfo", () => {
  it("gives compound relatives their base plant's chart", () => {
    const same = (a, b) => eq(core.getCompanionInfo(a), core.getCompanionInfo(b), `${a} vs ${b}`);
    same("Broccolini", "Broccoli");
    same("Peppermint", "Mint");
    same("Crabapple", "Apple");
    same("Soybean", "Bean");
  });
  it("falls back to generic advice rather than another plant's chart", () => {
    const generic = core.getCompanionInfo("Definitely Not A Real Plant");
    for (const n of ["Pear", "Peanut", "Peace Lily", "Acorn Squash", "Pineapple", "Horseradish", "Popcorn"]) {
      eq(core.getCompanionInfo(n), generic, n);
    }
  });
  it("is stable when asked twice (the cache returns equal values)", () => {
    const unstable = names.filter((n) => {
      const first = JSON.stringify(core.getCompanionInfo(n));
      const second = JSON.stringify(core.getCompanionInfo(n));
      return first !== second;
    });
    eq(unstable, []);
  });
});

describe("a pairing reads the same both ways", () => {
  const label = (a, b) => core.getCompatibilityScore(a, b).label;
  it("for every pair any chart mentions", () => {
    // Only the first plant's chart was read: Broccoli→Tomato was Avoid and
    // Tomato→Broccoli Neutral, so one plot on the map showed a conflict and its
    // neighbour did not.
    const bad = [];
    for (const [a, info] of Object.entries(core.COMPANION_PLANTING_DATA)) {
      for (const b of [...(info.excellent || []), ...(info.avoid || [])]) {
        if (label(a, b) !== label(b, a)) bad.push(`${a}/${b}: ${label(a, b)} vs ${label(b, a)}`);
      }
    }
    eq(bad, []);
  });
  it("lets a plant's own warning beat general advice", () => {
    // Sage has no chart, and the general fallback calls Basil excellent; Basil's
    // own chart says to keep Sage away.
    eq(label("Sage", "Basil"), "Avoid");
    eq(label("Basil", "Sage"), "Avoid");
    eq(label("Tomato", "Broccoli"), "Avoid");
  });
  it("no longer has peas and potatoes contradicting each other", () => {
    eq(label("Pea", "Potato"), "Excellent Pair");
    eq(label("Potato", "Pea"), "Excellent Pair");
  });
});

describe("a plant's page lists companions the way the pair check sees them", () => {
  const label = (a, b) => core.getCompatibilityScore(a, b).label;
  it("does not list a companion the check calls Avoid", () => {
    // Sage's general-advice chart lists Basil as great; Basil's own chart warns
    // against Sage, and the check says Avoid.
    const sage = core.getCompanionLists("Sage");
    ok(!sage.excellent.includes("Basil"), "Basil is not one of Sage's great companions");
    ok(sage.avoid.includes("Basil"), "and Sage's page should say so");
  });
  it("includes warnings that live on the other plant's chart", () => {
    // Broccoli's chart warns against Tomato; Tomato's page never said.
    ok(core.getCompanionLists("Tomato").avoid.includes("Broccoli"));
  });
  it("files every entry where the check puts it, for every chart", () => {
    const wrong = [];
    for (const name of Object.keys(core.COMPANION_PLANTING_DATA)) {
      const lists = core.getCompanionLists(name);
      lists.excellent.forEach((x) => { if (label(name, x) !== "Excellent Pair") wrong.push(`${name}+${x}`); });
      lists.avoid.forEach((x) => { if (label(name, x) !== "Avoid") wrong.push(`${name}-${x}`); });
      lists.neutral.forEach((x) => { if (label(name, x) !== "Neutral") wrong.push(`${name}~${x}`); });
    }
    eq(wrong, []);
  });
  it("is what the plant page shows", () => {
    const src = require("fs").readFileSync(require("path").join(ROOT, "screens/PlantDetailScreen.js"), "utf8");
    ok(/const companionLists = getCompanionLists\(selectedPlant\.name\)/.test(src));
  });
  it("keeps the classics", () => {
    ok(core.getCompanionLists("Tomato").excellent.includes("Basil"));
    ok(core.getCompanionLists("Potato").avoid.includes("Tomato"));
  });
});

describe("the garden map suggests what the pair check approves", () => {
  it("reads companions through getCompanionLists, not a raw chart", () => {
    // The raw chart suggested Basil for a bed of Sage, then flagged the pair.
    const src = require("fs").readFileSync(require("path").join(ROOT, "components/AreaPlannerMap.js"), "utf8");
    ok(/getCompanionLists\(plantName\)\.excellent/.test(src));
    ok(!/getCompanionInfo\(/.test(src), "no suggestion should read a chart directly");
  });
});

describe("pair labels in the garden map", () => {
  it("compare against the English label, never a translation", () => {
    // getCompatibilityScore's label is always English; comparing it with t(...)
    // only matches in English, so the green "excellent pair" border vanished in
    // every other language.
    const fs = require("fs");
    const offenders = [];
    for (const dir of ["components", "screens"]) {
      for (const f of fs.readdirSync(path.join(ROOT, dir)).filter((x) => x.endsWith(".js"))) {
        if (/\.label\s*[!=]==\s*t\(/.test(fs.readFileSync(path.join(ROOT, dir, f), "utf8"))) offenders.push(`${dir}/${f}`);
      }
    }
    eq(offenders, []);
  });
});
