#!/usr/bin/env node
/**
 * Unit tests for the pure logic in core.js and lib/.
 *
 * The smoke test proves every module renders; it cannot tell you that a plant is
 * hardy in the right zone, that a streak survives a clock change, or that a
 * garden score means the same thing after an optimisation. Those are questions
 * about values, and this is where they get pinned.
 *
 * Hand-rolled for the same reason the smoke test is: the project has no test
 * framework and adding one means a runner, a transform, and a config to keep in
 * step with Expo's babel. Everything here needs a require hook and an assert.
 *
 *   node scripts/test.js              # run everything
 *   node scripts/test.js companion    # only files matching "companion"
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");

const ROOT = path.resolve(__dirname, "..");
const projectRequire = Module.createRequire(path.join(ROOT, "package.json"));
const babel = projectRequire("@babel/core");

// ── Module loading ───────────────────────────────────────────────────────────
// core.js reaches react-native for Dimensions and expo-haptics for feedback, and
// pulls in image assets. None of that matters to the values under test.
const STUBS = {
  "react-native": {
    Dimensions: { get: () => ({ width: 390, height: 844 }) },
    Platform: { OS: "ios", select: (o) => o.ios ?? o.default },
    StyleSheet: { create: (o) => o },
    Appearance: { getColorScheme: () => "dark" },
    I18nManager: { isRTL: false },
    Alert: { alert() {} },
  },
  "@react-native-async-storage/async-storage": {
    default: {
      getItem: async () => null, setItem: async () => {}, removeItem: async () => {},
      multiGet: async () => [], multiSet: async () => {}, getAllKeys: async () => [],
    },
  },
};
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (STUBS[request] || /^(expo|@expo)/.test(request) || /\.(png|jpg|jpeg|gif|webp|ttf|otf)$/.test(request)) {
    return "STUB:" + request;
  }
  return origResolve.call(this, request, ...rest);
};
const origLoad = Module._load;
Module._load = function (request, ...rest) {
  if (/\.(png|jpg|jpeg|gif|webp|ttf|otf)$/.test(request)) return 1;
  if (STUBS[request]) return STUBS[request];
  if (/^(expo|@expo)/.test(request)) return new Proxy({}, { get: () => () => {} });
  return origLoad.call(this, request, ...rest);
};
const origJs = require.extensions[".js"];
require.extensions[".js"] = function (mod, filename) {
  if (!filename.startsWith(ROOT) || filename.includes("node_modules")) return origJs(mod, filename);
  const out = babel.transformSync(fs.readFileSync(filename, "utf8"), {
    filename,
    presets: [[projectRequire.resolve("@babel/preset-react"), { runtime: "automatic" }]],
    plugins: [projectRequire.resolve("@babel/plugin-transform-modules-commonjs")],
    babelrc: false, configFile: false,
  });
  mod._compile(out.code, filename);
};
global.__DEV__ = false;

// ── Tiny test API ────────────────────────────────────────────────────────────
const results = { pass: 0, fail: 0, failures: [] };
let currentSuite = "";

function describe(name, fn) {
  currentSuite = name;
  fn();
  currentSuite = "";
}
function it(name, fn) {
  const label = currentSuite ? `${currentSuite} › ${name}` : name;
  try {
    fn();
    results.pass += 1;
  } catch (error) {
    results.fail += 1;
    results.failures.push({ label, error });
  }
}
function fail(message) { throw new Error(message); }
function eq(actual, expected, note) {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a !== b) fail(`${note ? note + ": " : ""}expected ${b}, got ${a}`);
}
function ok(value, note) { if (!value) fail(note || "expected a truthy value"); }

module.exports = { describe, it, eq, ok, fail, ROOT };

// ── Run ──────────────────────────────────────────────────────────────────────
const filter = process.argv[2];
const dir = path.join(__dirname, "tests");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".test.js")).sort()
  .filter((f) => !filter || f.includes(filter));

console.log("");
for (const f of files) require(path.join(dir, f));

for (const { label, error } of results.failures) {
  console.log(`  ✗ ${label}`);
  console.log(`      ${error.message.split("\n")[0]}`);
}
const total = results.pass + results.fail;
console.log(`\n  ${results.fail ? "✗" : "✓"} ${results.pass}/${total} assertions passed` +
  `  (${files.length} file${files.length === 1 ? "" : "s"})\n`);
process.exit(results.fail ? 1 : 0);
