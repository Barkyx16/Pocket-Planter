#!/usr/bin/env node
/**
 * i18n key-completeness check (CI gate).
 *
 * Verifies every key in the English source dictionary exists in every other
 * locale. Complements i18n-coverage.js (which finds hardcoded strings in source)
 * — this one guards the translation dictionaries themselves.
 *
 *   node scripts/check-i18n.js         # report + exit 1 if any locale is short
 *   node scripts/check-i18n.js --list  # also list every missing key
 *
 * Exit code 0 = all locales complete, 1 = at least one key missing somewhere.
 */

const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.resolve(__dirname, "..", "lib", "locales");
const SOURCE = "en";
const listMode = process.argv.includes("--list");

// Locales still being translated. They're reported with progress but do NOT fail
// the build — only a fully-launched locale that regresses is a hard failure.
// Remove a code from here once it reaches 100% so it's gated going forward.
const IN_PROGRESS = new Set([]);

// CLDR plural categories — a dictionary entry whose keys are all plural forms is
// a single translatable string, not a nested namespace. Different languages use
// different forms (zh: other only; hi/en: one/other), so we compare the KEY, not
// each plural sub-form, to avoid false "missing" hits.
const PLURAL_KEYS = new Set(["zero", "one", "two", "few", "many", "other"]);
const isPluralLeaf = (o) =>
  o && typeof o === "object" && !Array.isArray(o) &&
  Object.keys(o).length > 0 &&
  Object.keys(o).every((k) => PLURAL_KEYS.has(k));

function load(locale) {
  const file = path.join(LOCALES_DIR, `${locale}.js`);
  const src = fs.readFileSync(file, "utf8").replace(/export\s+default\s*/, "module.exports = ");
  const mod = { exports: {} };
  new Function("module", "exports", src)(mod, mod.exports);
  return mod.exports;
}

function flatten(obj, prefix = "", out = {}) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v) && !isPluralLeaf(v)) {
      flatten(v, key, out);
    } else {
      out[key] = true;
    }
  }
  return out;
}

function discoverLocales() {
  return fs
    .readdirSync(LOCALES_DIR)
    .filter((f) => f.endsWith(".js"))
    .map((f) => f.replace(/\.js$/, ""));
}

const locales = discoverLocales();
if (!locales.includes(SOURCE)) {
  console.error(`✗ Source locale "${SOURCE}" not found in ${LOCALES_DIR}`);
  process.exit(1);
}

let sourceKeys;
try {
  sourceKeys = Object.keys(flatten(load(SOURCE)));
} catch (e) {
  console.error(`✗ Failed to load source locale "${SOURCE}": ${e.message}`);
  process.exit(1);
}

console.log(`\n  i18n key completeness  (source: ${SOURCE}, ${sourceKeys.length} keys)`);
console.log("  " + "─".repeat(52));

let failed = false;
const others = locales.filter((l) => l !== SOURCE).sort();
for (const locale of others) {
  let keys;
  try {
    keys = flatten(load(locale));
  } catch (e) {
    console.log(`  ${locale.padEnd(6)}  ✗ failed to load: ${e.message}`);
    failed = true;
    continue;
  }
  const missing = sourceKeys.filter((k) => !(k in keys));
  const extra = Object.keys(keys).filter((k) => !sourceKeys.includes(k));
  const pct = (((sourceKeys.length - missing.length) / sourceKeys.length) * 100).toFixed(1);

  if (missing.length && IN_PROGRESS.has(locale)) {
    console.log(`  ${locale.padEnd(6)}  … ${pct}%  (in progress · ${missing.length} to translate)`);
    if (listMode) missing.forEach((k) => console.log(`           · ${k}`));
  } else if (missing.length) {
    failed = true;
    console.log(`  ${locale.padEnd(6)}  ✗ ${pct}%  (${missing.length} missing${extra.length ? `, ${extra.length} stale` : ""})`);
    if (listMode) missing.forEach((k) => console.log(`           · ${k}`));
  } else {
    console.log(`  ${locale.padEnd(6)}  ✓ 100.0%${extra.length ? `  (${extra.length} stale key${extra.length === 1 ? "" : "s"} not in ${SOURCE})` : ""}`);
    if (listMode && extra.length) extra.forEach((k) => console.log(`           ~ stale: ${k}`));
  }
}

console.log("  " + "─".repeat(52));
if (failed) {
  console.log("\n  ✗ A launched locale is missing keys. Run with --list to see them.\n");
  process.exit(1);
}
const wip = others.filter((l) => IN_PROGRESS.has(l));
if (wip.length) {
  console.log(`\n  ✓ All launched locales complete. ${wip.length} in progress: ${wip.join(", ")}.\n`);
} else {
  console.log("\n  ✓ All locales complete.\n");
}
process.exit(0);
