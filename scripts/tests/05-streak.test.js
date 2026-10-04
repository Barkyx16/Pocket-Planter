const path = require("path");
const { describe, it, eq, ok, ROOT } = require("../test.js");
const core = require(path.join(ROOT, "core.js"));

const day = (n) => {
  const d = new Date(Date.UTC(2026, 0, 1));
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
// Walk a sequence of days through the reducer, the way opening the app does.
const walk = (days, freeze = null) => {
  let state = null;
  const events = [];
  for (const d of days) {
    const out = core.nextStreakState(state, d, freeze);
    state = out.streak;
    if (out.milestone) events.push(`milestone:${out.milestone}`);
    if (out.offerRecovery) events.push(`recover:${out.offerRecovery}`);
  }
  return { state, events };
};

describe("nextStreakState", () => {
  it("counts consecutive days", () => {
    eq(walk([day(0), day(1), day(2), day(3)]).state.count, 4);
  });
  it("ignores a second open on the same day", () => {
    eq(walk([day(0), day(0), day(1), day(1), day(1)]).state.count, 2);
  });
  it("does not pay out twice when the clock moves backwards", () => {
    // A flight west, or a device correcting a drifted clock: the day goes back,
    // then forward again. It used to come out of that at 6.
    const days = [day(0), day(1), day(2), day(2), day(1), day(2), day(3)];
    eq(walk(days).state.count, 4);
  });
  it("keeps lastOpened at the later date across a backwards jump", () => {
    const { state } = walk([day(0), day(1), day(2), day(1)]);
    eq(state.lastOpened, day(2));
    eq(state.count, 3);
  });
  it("resets after a missed day", () => {
    eq(walk([day(0), day(1), day(2), day(5)]).state.count, 1);
  });
  it("celebrates only the milestone days", () => {
    const { events } = walk(Array.from({ length: 31 }, (_, i) => day(i)));
    eq(events, ["milestone:7", "milestone:14", "milestone:30"]);
  });
  it("offers to buy back a streak worth saving, but not a one-day one", () => {
    eq(walk([day(0), day(1), day(2), day(4)]).events, ["recover:3"]);
    eq(walk([day(0), day(2)]).events, []);
    // Too wide a gap to offer recovery at all.
    eq(walk([day(0), day(1), day(2), day(9)]).events, []);
  });
  it("protects the streak when a freeze covers the gap", () => {
    const out = core.nextStreakState({ count: 9, lastOpened: day(0) }, day(2), day(1));
    eq(out.streak.count, 9);
    ok(out.saved, "should report the streak was saved");
    eq(out.offerRecovery, null);
  });
  it("ignores a freeze used too long ago", () => {
    const out = core.nextStreakState({ count: 9, lastOpened: day(0) }, day(2), day(-5));
    eq(out.streak.count, 1);
    eq(out.offerRecovery, 9);
  });
  it("starts a fresh streak from nothing", () => {
    const out = core.nextStreakState(null, day(0));
    eq(out.streak, { count: 1, lastOpened: day(0) });
  });
});

describe("a new day while the app is open", () => {
  const app = require("fs").readFileSync(path.join(ROOT, "App.js"), "utf8");
  it("is noticed when the app comes back to the foreground", () => {
    // iOS resumes a suspended app without a launch; the streak only counted on
    // a cold start, so daily resumes were never counted and then reset it.
    ok(/AppState\.addEventListener\("change"/.test(app), "the app should listen for coming back");
    ok(/if \(state === "active"\) setTodayKey\(getTodayKey\(\)\);/.test(app));
    const at = app.indexOf("const seenDayRef = useRef(todayKey);");
    const effect = app.slice(at, app.indexOf("}, [todayKey]);", at));
    ok(at > 0 && /onNewDayRef\.current\?\.\(\)/.test(effect), "a new day should run the daily work");
    const work = app.slice(app.indexOf("onNewDayRef.current = () => {"), app.indexOf("\n};", app.indexOf("onNewDayRef.current = () => {")));
    for (const call of ["updateDailyStreak()", "checkHarvestNotifications()", "setStreakFreeze(", "setWeatherRefreshToken("]) {
      ok(work.includes(call), `a new day must run ${call}`);
    }
  });
  it("rebuilds today's quests, badges and XP", () => {
    for (const fn of ["getDailyQuests", "getAchievementBadges", "getGardenXP"]) {
      const at = app.indexOf(`${fn}({`);
      ok(/today: todayKey/.test(app.slice(at, app.indexOf("}),", at))), `${fn} must be given todayKey`);
    }
  });
  it("lets the builders be asked about a given day", () => {
    const quests = (today) => core.getDailyQuests({
      savedPlants: [], journalEntries: [], gardenMap: {}, wateredPlants: { A: "2026-10-05" }, careLog: [],
      harvestTrackers: {}, streakData: { count: 1 }, harvestLog: [], fertilizerTrackers: {}, comparePlants: [], today,
    });
    // The rotation follows the given day, and "watered today" counts against it.
    ok(JSON.stringify(quests("2026-10-04").map((q) => q.id)) !== JSON.stringify(quests("2026-10-05").map((q) => q.id)));
    const xp = (today) => core.getGardenXP({ savedPlants: [], journalEntries: [], gardenMap: {}, wateredPlants: { A: "2026-10-05" }, streakData: { count: 1 }, bonusXP: 0, questXP: 0, today });
    ok(xp("2026-10-05").xp > xp("2026-10-06").xp, "a watering counts only on its own day");
  });
});
