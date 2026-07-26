#!/usr/bin/env node
/**
 * Extracts translatable UI strings from a file and rewrites them to t() calls.
 *
 * Two phases so the language work stays reviewable:
 *
 *   node scripts/i18n-extract.js <file> --plan
 *       Prints the strings it would extract, with the key it would assign.
 *       Nothing is written. Use this to sanity-check the selection first.
 *
 *   node scripts/i18n-extract.js <file> --apply
 *       Rewrites the source to t("ns.key") and appends the English entries to
 *       lib/locales/en.js. Other locales are filled in separately — a missing
 *       key falls back to English, so the app is never broken mid-migration.
 *
 * What it deliberately skips, because getting these wrong causes real bugs:
 *   - object KEYS (persisted data: folder names, growth stages, moods)
 *   - Alert / Notification bodies rendered by the OS
 *   - console output, AsyncStorage keys, URLs, style values, identifiers
 *   - strings inside a component that is memo()'d without useTranslation
 *     (reported instead, so the hook gets added first)
 */

const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const ROOT = path.resolve(__dirname, "..");

const STYLE_WORDS = /^(row|column|center|bold|absolute|relative|none|cover|contain|flex-start|flex-end|space-between|space-around|space-evenly|handled|slide|fade|small|large|button|text|default|characters|numeric|number-pad|destructive|cancel|light|dark|auto|always|never|transparent|hidden|visible|nowrap|wrap|solid|dashed|dotted|uppercase|lowercase|capitalize)$/;

function isUiString(v) {
  const s = String(v).trim();
  if (s.length < 2) return false;
  if (!/[A-Za-z]/.test(s)) return false;
  if (/^(rgba?\(|#[0-9a-f]{3,8}$|https?:|\.\/|\/|@|[a-z]+:\/\/)/i.test(s)) return false;
  if (/^[a-z0-9_.-]+$/i.test(s) && !s.includes(" ")) return false; // identifiers/keys
  if (STYLE_WORDS.test(s)) return false;
  if (/^\d+(\.\d+)?(px|%|deg)?$/.test(s)) return false;
  return s.includes(" ") || s.length > 3;
}

function slugify(text, used) {
  let base = String(text)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️]/gu, "")
    .trim().toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/).filter(Boolean).slice(0, 5)
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join("");
  if (!base) base = "label";
  if (/^\d/.test(base)) base = "n" + base;
  let key = base, n = 2;
  while (used.has(key)) key = base + n++;
  used.add(key);
  return key;
}

const file = process.argv[2];
const apply = process.argv.includes("--apply");
if (!file) { console.error("usage: i18n-extract.js <file> [--plan|--apply]"); process.exit(1); }

const abs = path.resolve(ROOT, file);
const src = fs.readFileSync(abs, "utf8");
const ast = parser.parse(src, { sourceType: "module", plugins: ["jsx"] });

const ns = path.basename(file).replace(/\.js$/, "").replace(/Card$|Tab$/, "")
  .replace(/^./, (c) => c.toLowerCase());

const used = new Set();
// Identical copy shares one key — otherwise "Tap to go to Garden tab" becomes
// two entries a translator has to translate twice, and they can drift apart.
const byText = new Map();
const hits = [];
const skipped = [];

function inSkippedContext(p) {
  // object key -> persisted data
  if (p.parent.type === "ObjectProperty" && p.parent.key === p.node) return "object key (persisted data)";
  if (p.parent.type === "ImportDeclaration") return "import";
  if (p.parent.type === "JSXAttribute" &&
      /^(accessibilityRole|testID|storageKey|nativeID|autoComplete|textContentType|keyboardType|autoCapitalize|resizeMode|animationType|name|source|key)$/.test(p.parent.name?.name)) {
    return "non-visual prop";
  }
  let cur = p;
  while (cur) {
    const n = cur.node;
    if (n.type === "CallExpression") {
      const c = n.callee || {};
      const obj = c.object && c.object.name;
      const prop = c.property && c.property.name;
      if (c.name === "t" || c.name === "tn") return "already translated";
      if (obj === "console") return "console output";
      if (obj === "AsyncStorage") return "storage key";
      if (obj === "Alert" || obj === "Notifications") return "OS-rendered";
      if (c.name === "require") return "require path";
      if (prop === "scheduleNotificationAsync") return "OS-rendered";
    }
    cur = cur.parentPath;
  }
  return null;
}

traverse(ast, {
  JSXText(p) {
    const v = p.node.value.trim();
    if (!isUiString(v)) return;
    if (!byText.has(v)) byText.set(v, slugify(v, used));
    hits.push({ node: p.node, text: v, kind: "jsx", key: byText.get(v) });
  },
  StringLiteral(p) {
    const v = p.node.value;
    if (!isUiString(v)) return;
    const why = inSkippedContext(p);
    if (why) { skipped.push({ text: v, why }); return; }
    // only strings that end up on screen
    let inJsx = false, cur = p;
    while (cur) {
      const tt = cur.node.type;
      if (tt === "JSXElement" || tt === "JSXAttribute" || tt === "JSXExpressionContainer") { inJsx = true; break; }
      cur = cur.parentPath;
    }
    if (!inJsx) { skipped.push({ text: v, why: "not rendered" }); return; }
    if (!byText.has(v)) byText.set(v, slugify(v, used));
    // A JSX attribute value needs braces: placeholder={t("x")}, not
    // placeholder=t("x"), which is a syntax error.
    const isAttrValue = p.parent.type === "JSXAttribute" && p.parent.value === p.node;
    hits.push({ node: p.node, text: v, kind: isAttrValue ? "attr" : "str", key: byText.get(v) });
  },
});

if (!apply) {
  console.log(`\n  ${file}  ->  namespace "${ns}"\n`);
  console.log(`  EXTRACT (${hits.length}):`);
  [...byText.entries()].forEach(([text, key]) => console.log(`    ${(ns + "." + key).padEnd(42)} ${JSON.stringify(text).slice(0, 78)}`));
  console.log(`    (${hits.length} call sites -> ${byText.size} unique keys)`);
  const bywhy = {};
  skipped.forEach((s) => { (bywhy[s.why] = bywhy[s.why] || []).push(s.text); });
  console.log(`\n  SKIP (${skipped.length}):`);
  Object.entries(bywhy).forEach(([w, list]) => console.log(`    ${String(list.length).padStart(4)}  ${w}`));
  console.log();
  process.exit(0);
}

// ── apply ────────────────────────────────────────────────────────────────────
let out = src;
for (const h of [...hits].sort((a, b) => b.node.start - a.node.start)) {
  const call = `t("${ns}.${h.key}")`;
  const replacement = (h.kind === "jsx" || h.kind === "attr") ? `{${call}}` : call;
  // JSXText nodes include surrounding whitespace; replace only the trimmed span.
  let start = h.node.start, end = h.node.end;
  if (h.kind === "jsx") {
    const raw = src.slice(start, end);
    const lead = raw.length - raw.trimStart().length;
    const trail = raw.length - raw.trimEnd().length;
    start += lead; end -= trail;
  }
  out = out.slice(0, start) + replacement + out.slice(end);
}
try {
  parser.parse(out, { sourceType: "module", plugins: ["jsx"] });
} catch (e) {
  console.error(`  ${file}: ABORTED — rewrite would not parse (${e.message})`);
  process.exit(1);
}
fs.writeFileSync(abs, out);

const enPath = path.join(ROOT, "lib/locales/en.js");
let en = fs.readFileSync(enPath, "utf8");
const block = [`  ${ns}: {`]
  .concat([...byText.entries()].map(([text, key]) => `    ${key}: ${JSON.stringify(text)},`))
  .concat(["  },", ""]).join("\n");
en = en.replace("  zone: {", block + "\n  zone: {");
fs.writeFileSync(enPath, en);

console.log(`  ${file}: extracted ${hits.length} -> en.${ns}.*  (skipped ${skipped.length})`);
