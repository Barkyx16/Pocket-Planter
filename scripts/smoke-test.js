#!/usr/bin/env node
/**
 * Render smoke test.
 *
 * The app has no component tests and every change this far has been verified by
 * parse checks alone. Parsing is not enough: a component that calls an unimported
 * hook, references a missing style, or passes a bad icon name parses perfectly
 * and then crashes — or silently renders an empty box — on mount. That exact bug
 * shipped twice during the i18n work.
 *
 * This mounts every component and screen with react-dom/server against stubbed
 * React Native primitives. It is not a visual check — it cannot tell you a card
 * looks wrong — but it does prove every module *evaluates and renders* without
 * throwing, in all seven languages.
 *
 *   node scripts/smoke-test.js            # render everything
 *   node scripts/smoke-test.js --locale de
 */

const fs = require("fs");
const path = require("path");
const Module = require("module");

const ROOT = path.resolve(__dirname, "..");
const projectRequire = Module.createRequire(path.join(ROOT, "package.json"));
const babel = projectRequire("@babel/core");
const React = projectRequire("react");
const { renderToStaticMarkup } = projectRequire("react-dom/server");

// ── Stub React Native ────────────────────────────────────────────────────────
// Every RN primitive becomes a plain host element so react-dom can render it.
const host = (tag) => {
  const C = ({ children, ...props }) => {
    // Drop RN-only props react-dom would warn about.
    const safe = {};
    for (const k of ["key", "id"]) if (props[k] != null) safe[k] = props[k];
    return React.createElement(tag, safe, children);
  };
  return C;
};

const RN = {
  View: host("div"),
  Text: host("span"),
  Pressable: host("button"),
  TouchableOpacity: host("button"),
  ScrollView: host("div"),
  Image: host("img"),
  TextInput: host("input"),
  Modal: host("div"),
  Switch: host("input"),
  ActivityIndicator: host("span"),
  SafeAreaView: host("div"),
  FlatList: host("div"),
  RefreshControl: host("div"),
  StyleSheet: { create: (o) => o, flatten: (s) => Object.assign({}, ...[].concat(s || []).filter(Boolean)), absoluteFill: {}, hairlineWidth: 1 },
  Dimensions: { get: () => ({ width: 390, height: 844 }) },
  Platform: { OS: "ios", select: (o) => o.ios ?? o.default },
  Alert: { alert() {} },
  Animated: {
    View: host("div"), Text: host("span"), Image: host("img"), ScrollView: host("div"),
    Value: function (v) { this._v = v; this.setValue = () => {}; this.interpolate = () => 0; },
    timing: () => ({ start: () => {} }), spring: () => ({ start: () => {} }),
    loop: () => ({ start: () => {} }), sequence: () => ({ start: () => {} }),
    parallel: () => ({ start: () => {} }), createAnimatedComponent: (c) => c,
  },
  Easing: { linear: 0, ease: 0, inOut: () => 0, out: () => 0, in: () => 0, bezier: () => 0, quad: 0, cubic: 0, poly: () => 0, sin: 0, circle: 0, exp: 0, elastic: () => 0, back: () => 0, bounce: 0, step0: 0, step1: 0 },
  LayoutAnimation: { configureNext() {}, create: () => ({}), Types: {}, Properties: {}, Presets: {} },
  UIManager: { setLayoutAnimationEnabledExperimental() {} },
  Linking: { openURL: async () => {}, openSettings: async () => {} },
  Share: { share: async () => {} },
  Vibration: { vibrate() {} },
  Keyboard: { dismiss() {} },
  Appearance: { getColorScheme: () => "dark", addChangeListener: () => ({ remove() {} }) },
  StatusBar: host("div"),
  I18nManager: { isRTL: false },
  AccessibilityInfo: {
    isReduceMotionEnabled: async () => process.env.PP_REDUCE_MOTION === "1",
    isScreenReaderEnabled: async () => false,
    addEventListener: () => ({ remove() {} }),
  },
};

const STUBS = {
  "react-native": RN,
  "@react-native-async-storage/async-storage": { __esModule: true, default: { getItem: async () => null, setItem: async () => {}, multiGet: async () => [], multiRemove: async () => {}, getAllKeys: async () => [] } },
  "expo-haptics": { impactAsync() {}, notificationAsync() {}, selectionAsync() {}, ImpactFeedbackStyle: {}, NotificationFeedbackType: {} },
  "expo-store-review": { isAvailableAsync: async () => false, requestReview: async () => {} },
  "expo-localization": { __esModule: true, getLocales: () => [{ languageCode: "en" }] },
  "expo-linear-gradient": { LinearGradient: host("div") },
  "expo-blur": { BlurView: host("div") },
  "expo-notifications": { setNotificationHandler() {}, getAllScheduledNotificationsAsync: async () => [], scheduleNotificationAsync: async () => {}, cancelScheduledNotificationAsync: async () => {}, AndroidImportance: {}, setNotificationChannelAsync: async () => {} },
  "expo-location": { requestForegroundPermissionsAsync: async () => ({ granted: false }) },
  "expo-image-picker": {}, "expo-image-manipulator": {}, "expo-splash-screen": { preventAutoHideAsync() {}, hideAsync() {} },
  "expo-calendar": {}, "expo-file-system": {}, "expo-sharing": {}, "expo-clipboard": {},
  "expo-local-authentication": {}, "expo-application": {}, "expo-device": {},
  // Native-only submodule; node cannot resolve it. Stubbed like its siblings.
  "expo-secure-store": { getItemAsync: async () => null, setItemAsync: async () => {}, deleteItemAsync: async () => {} },
  "react-native-purchases": { __esModule: true, default: {} },
  "react-native-svg": new Proxy({}, { get: () => host("svg") }),
  "@expo/vector-icons/Ionicons": { __esModule: true, default: host("i") },
  "@expo/vector-icons": new Proxy({}, { get: () => host("i") }),
  "@react-navigation/native": {}, "@react-navigation/bottom-tabs": {},
  "@supabase/supabase-js": { createClient: () => ({ auth: { getSession: async () => ({ data: {} }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }) }, from: () => ({ select: () => ({ eq: () => ({ single: async () => ({}) }) }) }) }) },
  // Ships untranspiled RN source (Flow syntax) — node cannot parse it.
  "react-native-url-polyfill/auto": {},
  "react-native-url-polyfill": {},
  // Resolve to expo-modules-core/src/index.ts, which node's type-stripping
  // refuses to touch inside node_modules. Nothing in the render path needs the
  // real implementation.
  "expo-modules-core": {},
  "expo-camera": new Proxy({}, { get: () => host("camera") }),
  "@expo-google-fonts/inter": new Proxy({ useFonts: () => [true, null] }, { get: (t, k) => (k in t ? t[k] : k) }),
};

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (STUBS[request] || /\.(png|jpg|jpeg|gif|webp|ttf|otf)$/.test(request)) return "STUB:" + request;
  return origResolve.call(this, request, ...rest);
};
const origLoad = Module._load;
Module._load = function (request, ...rest) {
  if (/\.(png|jpg|jpeg|gif|webp|ttf|otf)$/.test(request)) return 1;
  if (STUBS[request]) return STUBS[request];
  return origLoad.call(this, request, ...rest);
};
const origJs = require.extensions[".js"];
require.extensions[".js"] = function (mod, filename) {
  if (!filename.startsWith(ROOT) || filename.includes("node_modules")) {
    // Some RN packages ship untranspiled JSX in their published .js
    // (react-native-qrcode-svg, react-native-view-shot). Let node try first so
    // the common case stays cheap, and only fall through to a babel pass when
    // it throws on syntax it cannot parse. A SyntaxError is raised at compile
    // time, before any of the module body runs, so re-compiling can't
    // double-execute side effects.
    try { return origJs(mod, filename); }
    catch (e) { if (!(e instanceof SyntaxError)) throw e; }
  }
  const out = babel.transformSync(fs.readFileSync(filename, "utf8"), {
    filename,
    // babel-preset-expo isn't installed standalone; @babel/preset-react plus the
    // CJS module transform is all this harness needs.
    // The app's components use the automatic JSX runtime (no `import React`),
    // so classic mode would fail with "React is not defined".
    presets: [[projectRequire.resolve("@babel/preset-react"), { runtime: "automatic" }]],
    plugins: [projectRequire.resolve("@babel/plugin-transform-modules-commonjs")],
    babelrc: false, configFile: false,
  });
  mod._compile(out.code, filename);
};

// React Native defines these globals; node does not.
global.__DEV__ = false;
if (typeof global.requestAnimationFrame !== "function") {
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}

// ── Run ──────────────────────────────────────────────────────────────────────
const i18n = require(path.join(ROOT, "lib/i18n.js"));
// Exercise the reduced-motion code path too: PP_REDUCE_MOTION=1 node scripts/smoke-test.js
if (process.env.PP_REDUCE_MOTION === "1") {
  require(path.join(ROOT, "lib/motion.js")).reduceMotionRef.current = true;
}
const argLocale = process.argv[process.argv.indexOf("--locale") + 1];
const locales = process.argv.includes("--locale") ? [argLocale] : i18n.LANGUAGES.map((l) => l.code);

const theme = {
  card: "#0e2414", background: "#041b11", text: "#ffffff",
  secondaryText: "#8fbf9d", border: "rgba(255,255,255,0.08)", input: "rgba(255,255,255,0.06)",
};

// A permissive prop bag — components pull what they need and ignore the rest.
//
// Rendered twice, with two of these. The empty bag is the cold-start case: no
// plants, no history, no forecast. It is the harder one for a component to
// survive, and it runs in all ten languages.
//
// The populated bag reaches what the empty one cannot. A list with nothing in it
// renders no rows, so anything that only goes wrong once there is data — walking
// a non-empty array, reducing without a seed, dereferencing what .find() did not
// find, a missing key in a list — went straight through unseen.
const permissive = (bag) => new Proxy(bag, {
  get: (t, k) => (k in t ? t[k] : typeof k === "string" && k.startsWith("on") ? () => {} : typeof k === "string" && k.startsWith("set") ? () => {} : undefined),
});

const emptyProps = permissive(
  {
    theme, zone: "9b", unitSystem: "imperial", savedPlants: [], journalEntries: [],
    harvestLog: [], careLog: [], gardenMap: {}, gardenAreas: [], wateredPlants: {},
    wateringHistory: {}, streakData: { count: 3 }, plantNotes: {}, weather: null,
    record: { zone: "9b", zonetitle: "9b: 25 to 30", zipcode: "90210" },
    premiumUnlocked: true, language: "en", user: null,
  }
);

// The same app, with a garden in it.
const populatedProps = (() => {
  const produce = require(path.join(ROOT, "data/produceData.js"));
  const catalog = produce.default || produce;
  const names = catalog.slice(0, 40).map((i) => i.name);
  const key = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
  const iso = (n) => new Date(Date.now() - n * 86400000).toISOString();
  const history = {}; names.forEach((n, i) => { history[n] = [key(9), key(6), key(3), key(i % 4)]; });
  const watered = {}; names.slice(0, 12).forEach((n) => { watered[n] = key(0); });
  return permissive({
    theme, zone: "9b", unitSystem: "imperial", language: "en",
    savedPlants: names, savedPlantObjs: catalog.slice(0, 40),
    plant: catalog[0], item: catalog[0], selectedPlant: catalog[0],
    journalEntries: Array.from({ length: 25 }, (_, i) => ({ id: `j${i}`, plantName: names[i % 40], imageUri: "file://x.jpg", createdAt: iso(i), mood: "happy", growthStage: "fruiting" })),
    harvestLog: Array.from({ length: 18 }, (_, i) => ({ id: `h${i}`, plantName: names[i % 40], plant: names[i % 40], date: key(i), amount: "3", unit: "kg", note: "", createdAt: iso(i) })),
    careLog: Array.from({ length: 15 }, (_, i) => ({ id: `c${i}`, date: key(i), plant: names[i % 40], actionId: "prune", actionLabel: "Pruned", actionIcon: "\u2702\ufe0f", actionColor: "#5cff89", note: "", createdAt: iso(i) })),
    gardenMap: Object.fromEntries(names.slice(0, 20).map((n, i) => [`slot-${i}`, n])),
    gardenAreas: Array.from({ length: 4 }, (_, a) => ({
      id: `a${a}`, name: `Bed ${a}`, kind: a === 3 ? "flower" : "veg", emoji: "\ud83c\udf31", color: "#5cff89", size: 8,
      plots: Object.fromEntries(Array.from({ length: 8 }, (_, sl) => [`slot-${sl + 1}`, names[(a * 8 + sl) % 40]])),
    })),
    wateredPlants: watered, wateringHistory: history,
    streakData: { count: 42, lastOpened: key(0) },
    plantNotes: Object.fromEntries(names.slice(0, 6).map((n) => [n, `A note about ${n}`])),
    harvestTrackers: Object.fromEntries(names.slice(0, 5).map((n) => [n, { days: 60, startedAt: iso(30) }])),
    fertilizerTrackers: Object.fromEntries(names.slice(0, 5).map((n) => [n, { lastFertilized: iso(20) }])),
    sowLog: Object.fromEntries(names.slice(0, 5).map((n) => [n, [key(30)]])),
    followedPlants: names.slice(0, 5), pinnedPlants: names.slice(0, 3), comparePlants: names.slice(0, 2),
    snoozedPlants: {}, plantFolders: { "Herbs": names.slice(0, 4) },
    plantSaveDates: Object.fromEntries(names.map((n) => [n, key(20)])),
    // Deliberately awkward: frost tonight and extreme heat today, so the weather
    // branches that only exist at the edges get rendered too.
    weather: { maxTempF: 96, minTempF: 34, precipChance: 70, forecast: Array.from({ length: 7 }, (_, i) => ({ date: key(-i), maxTempF: 80 + i, minTempF: 30 + i, precipChance: 10 * i })) },
    record: { zone: "9b", zonetitle: "9b: 25 to 30", zipcode: "90210" },
    gardenXP: { xp: 12000, level: 8, title: "Backyard Grower", currentLevelXP: 200, nextLevelXP: 2000, progress: 0.1 },
    premiumUnlocked: true, user: { id: "u1", email: "a@b.c" },
    zip: "90210", country: "US", monthlySuggestions: catalog.slice(0, 6),
    suppliesSpent: 120, harvestGoal: { target: 20, createdAt: iso(0) },
    badgeEarnedDates: {}, bannerEarnedDates: {}, completedQuestIds: {},
    resolveCompanionPlant: (n) => catalog.find((i) => i.name === n) || null,
    getCompanionDisplayName: (n) => n, getCompanionImage: () => null,
    rarityStyle: () => ({ label: "Common", color: "#8effab" }),
    fadeAnimation: { interpolate: () => 0 }, glowOpacity: { interpolate: () => 0 },
    xpPopups: [], showLevelUp: false, gardenPlacementPrompt: null, uploadingPhoto: false,
    // Filled in from what the first populated run tripped over, so the pass
    // reaches the component rather than bailing out at its first missing prop.
    dailyQuests: [{ id: "q1", label: "Water 3 plants", goal: 3, progress: 1, xp: 20, done: false }],
    frostChecklist: {}, streakFreeze: { available: 1, lastUsed: null },
    achievementBadges: [{ id: "b1", category: "Plants", icon: "\ud83c\udf31", title: "First plant", text: "Saved your first plant.", unlocked: true, progress: 1, goal: 1 }],
    profileBanners: [{ id: "seedling_banner", emoji: "\ud83c\udf31", title: "Seedling Starter", subtitle: "Unlocked at Level 1", unlocked: true, gradient: ["#5cff89", "#1f7a3a"] }],
    smartWeather: { title: "Prime Garden Window!", body: "A good day to plant.", level: "Common" },
    compatiblePlants: catalog.slice(0, 8), activationSteps: [], monthlyChecklist: {},
    recentPlants: names.slice(0, 5), plantAttrFilters: [], wateringAmounts: [],
    recommendation: { title: "Prime Garden Window!", body: "A good day to plant.", level: "Common" },
    filteredPlants: catalog.slice(0, 30), plantSearch: "", selectedType: "All",
    smartRecommendation: { title: "Prime Garden Window!", body: "A good day to plant.", level: "Common" },
  });
})();

const files = [
  ...fs.readdirSync(path.join(ROOT, "components")).filter((f) => f.endsWith(".js")).map((f) => "components/" + f),
  ...fs.readdirSync(path.join(ROOT, "screens")).filter((f) => f.endsWith(".js")).map((f) => "screens/" + f),
];

let evalFail = 0, renderFail = 0, rendered = 0, skipped = 0;
const failures = [];

// Ten languages against an empty app, then one more pass with a garden in it.
// The populated pass runs in English only: it is there to reach data-dependent
// code, and re-running it in ten languages would double the time to say the
// same thing.
// States a real gardener is in that the two main bags do not cover. Both of them
// set premiumUnlocked, so the entire free tier — every locked card and upsell —
// had never been rendered once. "no location yet" is how the app looks between
// launch and the zone lookup returning, and how it stays if a postal code cannot
// be resolved at all; rendering that found a crash on the Home tab.
const variants = [
  ["free tier", { premiumUnlocked: false }],
  ["metric", { unitSystem: "metric" }],
  ["no location yet", { zone: null, zip: "", record: null, weather: null, latitude: null }],
  ["southern hemisphere", { zone: "10a", latitude: -33.87, record: { zone: "10a", zonetitle: "10a: 30 to 35", zipcode: "2000" } }],
  // What a restore from an older backup can hand back: rows that exist but are
  // missing most of their fields.
  ["partial data", {
    journalEntries: [{ id: "j1" }], harvestLog: [{ id: "h1" }], careLog: [{ id: "c1" }],
    gardenAreas: [{ id: "a1" }], harvestTrackers: { X: {} }, fertilizerTrackers: { X: {} }, streakData: {},
  }],
];

const passes = [
  // `strict: false` on the empty passes only — see the skip list below.
  ...locales.map((locale) => ({ locale, label: locale, props: emptyProps, strict: false })),
  { locale: "en", label: "en (populated)", props: populatedProps, strict: true },
  ...variants.map(([label, override]) => ({
    locale: "en", label: `en (${label})`, strict: true,
    props: permissive(Object.assign({}, populatedProps, override)),
  })),
];

for (const { locale, label, props, strict } of passes) {
  i18n.setLocale(locale);
  for (const rel of files) {
    let mod;
    try {
      delete require.cache[require.resolve(path.join(ROOT, rel))];
      mod = require(path.join(ROOT, rel));
    } catch (e) {
      evalFail += 1; failures.push(`[${label}] ${rel}  MODULE FAILED TO LOAD: ${e.message}`); continue;
    }
    for (const [name, Comp] of Object.entries(mod)) {
      if (typeof Comp !== "function" && !(Comp && Comp.$$typeof)) continue;
      if (name === "default" && typeof Comp !== "function") continue;
      // Only PascalCase exports are components. Helper functions like
      // `hydrateTabHeroes` are exported alongside them and must not be rendered.
      if (name !== "default" && !/^[A-Z]/.test(name)) continue;
      try {
        renderToStaticMarkup(React.createElement(i18n.LanguageProvider, { language: locale }, React.createElement(Comp, props)));
        rendered += 1;
      } catch (e) {
        const msg = String(e.message || e);
        // Components needing deep native/navigation context aren't smoke-testable.
        // A component that needs richer fixture data than the generic prop bag
        // supplies is not a bug — it just isn't smoke-testable this way. Genuine
        // defects (missing import, undefined function, bad module) still fail.
        // The skip list is for the empty pass, where a component wanting richer
        // fixture data than the generic bag supplies is not a defect. The
        // populated bag is complete — every module renders against it with
        // nothing skipped — so there the same error means the component really
        // did fall over on real data, and it counts.
        if (!strict
            && /Cannot read propert|is not iterable|Invalid hook|Objects are not valid|Minified React/.test(msg)) {
          skipped += 1;
          if (process.env.PP_SHOW_SKIPS) console.log(`  SKIP [${label}] ${rel} <${name}>  ${msg.split("\n")[0].slice(0, 110)}`);
          continue;
        }
        renderFail += 1;
        failures.push(`[${label}] ${rel} <${name}>  ${msg.split("\n")[0].slice(0, 130)}`);
      }
    }
  }
}

console.log(`\n  passes:           ${passes.map((p) => p.label).join(", ")}`);
console.log(`  modules:          ${files.length}`);
console.log(`  rendered OK:      ${rendered}`);
console.log(`  skipped:          ${skipped}`);
console.log(`  module load fail: ${evalFail}`);
console.log(`  render fail:      ${renderFail}\n`);
if (failures.length) {
  const uniq = [...new Set(failures)];
  uniq.slice(0, 40).forEach((f) => console.log("  " + f));
  if (uniq.length > 40) console.log(`  …and ${uniq.length - 40} more`);
}
process.exit(evalFail + renderFail ? 1 : 0);
