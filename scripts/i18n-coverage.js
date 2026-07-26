#!/usr/bin/env node
/**
 * i18n coverage report.
 *
 * Walks the source tree and counts user-facing strings that are still hardcoded
 * English versus routed through t(). Localisation of this app is a staged job —
 * this makes progress measurable instead of guesswork, and shows which file to
 * pick up next.
 *
 *   node scripts/i18n-coverage.js            # summary + worst offenders
 *   node scripts/i18n-coverage.js --all      # every file
 *   node scripts/i18n-coverage.js path/to.js # strings in one file
 */

const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const ROOT = path.resolve(__dirname, "..");
const SKIP_DIRS = /node_modules|\.git|assets|\.expo|scripts|supabase/;
const SKIP_FILES = /backup|prerefactor|zip_zone|\.test\./;
// Locale dictionaries are the translations themselves; asset maps are require()
// paths keyed by plant name, not display copy.
const NOT_TRANSLATABLE = /lib[/\\]locales|ImageMap\.js|plantImages\.js/;

function isProse(value) {
  if (typeof value !== "string") return false;
  const s = value.trim();
  if (s.length < 3) return false;
  if (/^(rgba?|#[0-9a-f]{3,8}|https?:|\.\/|\/|@)/i.test(s)) return false;
  if (/^[a-z0-9_-]+$/i.test(s) && !s.includes(" ")) return false;
  if (/^[\d\s.,:%°·-]+$/.test(s)) return false;
  if (/^(row|column|center|bold|absolute|relative|none|cover|contain|flex-start|flex-end|space-between|space-around|handled|slide|fade|small|large|button|text|default|characters|numeric|number-pad|destructive|cancel)$/.test(s)) return false;
  return /[A-Za-z]/.test(s) && (s.includes(" ") || s.length > 12);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.test(full)) walk(full, out);
    } else if (entry.name.endsWith(".js") && !SKIP_FILES.test(entry.name) && !NOT_TRANSLATABLE.test(full)) {
      out.push(full);
    }
  }
  return out;
}

function analyse(file) {
  let ast;
  const src = fs.readFileSync(file, "utf8");
  try {
    ast = parser.parse(src, { sourceType: "module", plugins: ["jsx"] });
  } catch (error) {
    return null;
  }
  const hardcoded = [];
  let translated = 0;

  traverse(ast, {
    CallExpression(p) {
      if (p.node.callee.name === "t") translated += 1;
    },
    StringLiteral(p) {
      // Skip the key argument of t("...") and import paths.
      const parent = p.parent;
      if (parent.type === "CallExpression" && parent.callee.name === "t") return;
      if (parent.type === "ImportDeclaration") return;
      if (parent.type === "ObjectProperty" && parent.key === p.node) return;
      // Developer-facing only: console output, AsyncStorage keys, accessibility
      // roles, and require() paths are never shown as copy.
      if (
        p.findParent(
          (a) =>
            a.isCallExpression() &&
            (/^console$/.test(a.node.callee?.object?.name) ||
              /^(AsyncStorage|Localization)$/.test(a.node.callee?.object?.name) ||
              a.node.callee?.name === "require")
        )
      ) {
        return;
      }
      if (parent.type === "JSXAttribute" && /^(accessibilityRole|testID|storageKey|nativeID|autoComplete|textContentType|keyboardType|autoCapitalize|resizeMode|animationType)$/.test(parent.name?.name)) return;
      if (isProse(p.node.value)) {
        hardcoded.push({ line: p.node.loc.start.line, text: p.node.value });
      }
    },
    JSXText(p) {
      if (isProse(p.node.value)) {
        hardcoded.push({ line: p.node.loc.start.line, text: p.node.value.trim() });
      }
    },
  });

  return { file: path.relative(ROOT, file), hardcoded, translated };
}

const args = process.argv.slice(2);
const showAll = args.includes("--all");
const target = args.find((a) => !a.startsWith("--"));

if (target) {
  const result = analyse(path.resolve(ROOT, target));
  if (!result) { console.error("Could not parse", target); process.exit(1); }
  console.log(`\n${result.file} — ${result.hardcoded.length} hardcoded, ${result.translated} via t()\n`);
  result.hardcoded.forEach((h) => {
    const text = h.text.length > 90 ? `${h.text.slice(0, 90)}…` : h.text;
    console.log(`  ${String(h.line).padStart(5)}  ${text.replace(/\s+/g, " ")}`);
  });
  process.exit(0);
}

const results = walk(ROOT).map(analyse).filter(Boolean);
const totalHard = results.reduce((s, r) => s + r.hardcoded.length, 0);
const totalDone = results.reduce((s, r) => s + r.translated, 0);
const pct = totalDone + totalHard === 0 ? 100 : (totalDone / (totalDone + totalHard)) * 100;

console.log("\n  i18n coverage\n  " + "─".repeat(52));
console.log(`  translated via t()     ${String(totalDone).padStart(6)}`);
console.log(`  still hardcoded        ${String(totalHard).padStart(6)}`);
console.log(`  coverage               ${pct.toFixed(1).padStart(6)}%`);
console.log("  " + "─".repeat(52) + "\n");

const ranked = results.filter((r) => r.hardcoded.length).sort((a, b) => b.hardcoded.length - a.hardcoded.length);
const shown = showAll ? ranked : ranked.slice(0, 15);
console.log(`  Remaining work${showAll ? "" : " (top 15)"}:\n`);
shown.forEach((r) => {
  console.log(`  ${String(r.hardcoded.length).padStart(5)}  ${r.file}${r.translated ? `   (${r.translated} done)` : ""}`);
});
if (!showAll && ranked.length > 15) {
  const rest = ranked.slice(15).reduce((s, r) => s + r.hardcoded.length, 0);
  console.log(`  ${String(rest).padStart(5)}  …${ranked.length - 15} more files (--all to list)`);
}
console.log();
