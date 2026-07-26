#!/usr/bin/env node
/**
 * Makes sure every file that calls t()/tn() actually has it in scope.
 *
 * The rule established earlier in this codebase:
 *   - memo() components must use `const { t } = useTranslation()` so a language
 *     change re-renders them (memo sees unchanged props otherwise)
 *   - plain function components may import `t` directly
 *
 * Getting this wrong parses cleanly and crashes on mount, which is exactly the
 * bug that shipped twice before the smoke test existed. Run after i18n-extract.
 */

const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const ROOT = path.resolve(__dirname, "..");
const files = process.argv.slice(2);
if (!files.length) { console.error("usage: i18n-ensure-hook.js <files...>"); process.exit(1); }

let fixed = 0, already = 0, manual = [];

for (const rel of files) {
  const abs = path.resolve(ROOT, rel);
  let src = fs.readFileSync(abs, "utf8");
  let ast = parser.parse(src, { sourceType: "module", plugins: ["jsx"] });

  // does it call t()/tn() at all?
  let calls = 0;
  traverse(ast, { CallExpression(p) { if (["t", "tn"].includes(p.node.callee.name)) calls += 1; } });
  if (!calls) continue;

  // already in scope?
  let importedNames = new Set();
  traverse(ast, {
    ImportDeclaration(p) {
      if (/lib\/i18n$/.test(p.node.source.value)) p.node.specifiers.forEach((s) => importedNames.add(s.local.name));
    },
  });
  const hasHook = /const\s*\{[^}]*\bt\b[^}]*\}\s*=\s*useTranslation\(\)/.test(src);
  if (hasHook || importedNames.has("t")) { already += 1; continue; }

  const isMemo = /=\s*memo\(function|memo\(function/.test(src);
  const rel2 = rel.startsWith("components/") ? "../lib/i18n"
             : rel.startsWith("screens/") ? "../lib/i18n" : "./lib/i18n";

  if (isMemo) {
    // add useTranslation to the existing i18n import, or create one
    const m = src.match(/import \{([^}]*)\} from "(\.\.?\/lib\/i18n)";/);
    if (m) {
      const names = new Set(m[1].split(",").map((s) => s.trim()).filter(Boolean));
      names.add("useTranslation");
      src = src.replace(m[0], `import { ${[...names].sort().join(", ")} } from "${m[2]}";`);
    } else {
      src = addImport(src, `import { useTranslation } from "${rel2}";`);
    }
    // inject the hook as the first statement of the memoised component
    const sig = src.match(/(export const \w+ = memo\(function \w+\([^)]*\)\s*\{\n)/);
    if (!sig) { manual.push(`${rel}: memo component signature not recognised`); continue; }
    const need = [];
    if (/\bt\(/.test(src)) need.push("t");
    if (/\btn\(/.test(src)) need.push("tn");
    src = src.slice(0, sig.index + sig[0].length) +
          `  const { ${need.join(", ")} } = useTranslation();\n` +
          src.slice(sig.index + sig[0].length);
  } else {
    const m = src.match(/import \{([^}]*)\} from "(\.\.?\/lib\/i18n)";/);
    const need = [];
    if (/\bt\(/.test(src)) need.push("t");
    if (/\btn\(/.test(src)) need.push("tn");
    if (m) {
      const names = new Set(m[1].split(",").map((s) => s.trim()).filter(Boolean));
      need.forEach((n) => names.add(n));
      src = src.replace(m[0], `import { ${[...names].sort().join(", ")} } from "${m[2]}";`);
    } else {
      src = addImport(src, `import { ${need.join(", ")} } from "${rel2}";`);
    }
  }

  // verify it still parses before writing
  try { parser.parse(src, { sourceType: "module", plugins: ["jsx"] }); }
  catch (e) { manual.push(`${rel}: would not parse after fix (${e.message})`); continue; }

  fs.writeFileSync(abs, src);
  fixed += 1;
  console.log(`  ${rel}: ${isMemo ? "useTranslation() hook" : "direct import"}`);
}

function addImport(src, line) {
  const lines = src.split("\n");
  let idx = -1, depth = 0;
  for (let i = 0; i < Math.min(lines.length, 80); i += 1) {
    const l = lines[i];
    if (/^import /.test(l)) depth = (l.match(/\{/g) || []).length - (l.match(/\}/g) || []).length;
    if (depth === 0 && /^import .*;\s*$/.test(l)) idx = i;
    else if (depth > 0 && /\}\s*from\s*".*";\s*$/.test(l)) { depth = 0; idx = i; }
  }
  lines.splice(idx + 1, 0, line);
  return lines.join("\n");
}

console.log(`\n  fixed: ${fixed}   already ok: ${already}   needs manual work: ${manual.length}`);
manual.forEach((m) => console.log("    " + m));
process.exit(manual.length ? 1 : 0);
