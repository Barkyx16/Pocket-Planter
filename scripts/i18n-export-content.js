#!/usr/bin/env node
/**
 * Exports the app's horticultural content as a translator-ready catalogue.
 *
 * This content — plant care notes, pest identification and treatment, companion
 * planting guidance — is deliberately NOT machine-translated. Wrong growing
 * advice costs someone their crop, so it goes out to a professional translator
 * or a gardener who speaks the language, and comes back for review.
 *
 * Each row carries a stable id, the English source, and a context note telling
 * the translator what the string is and where it appears — the single biggest
 * driver of translation quality.
 *
 *   node scripts/i18n-export-content.js            # writes both formats
 *   node scripts/i18n-export-content.js --stdout   # preview as JSON
 *
 * Output (in i18n-content/):
 *   content-en.json  — { id: { text, context, chars } }, for re-import tooling
 *   content-en.csv   — id,context,chars,source_text,translation
 *                      the empty last column is what the translator fills in
 */

const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "i18n-content");

const rows = [];
function add(id, text, context) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (!clean) return;
  rows.push({ id, text: clean, context, chars: clean.length });
}

// ── produceData: plant names + care notes ────────────────────────────────────
function exportProduce() {
  const src = fs.readFileSync(path.join(ROOT, "data/produceData.js"), "utf8");
  const ast = parser.parse(src, { sourceType: "module" });
  const decl = ast.program.body.find(
    (n) => n.type === "VariableDeclaration" && n.declarations[0]?.id?.name === "produceData"
  );
  const items = decl?.declarations[0]?.init?.elements || [];
  let count = 0;
  for (const item of items) {
    if (item?.type !== "ObjectExpression") continue;
    const get = (key) => {
      const prop = item.properties.find((p) => p.key?.name === key);
      return prop?.value?.type === "StringLiteral" ? prop.value.value : null;
    };
    const name = get("name");
    if (!name) continue;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    add(`plant.${slug}.name`, name, `Plant name — shown as a card title and in search. Keep the common name gardeners in the target locale would actually use; add the botanical name only if there is no common one.`);
    const notes = get("notes");
    if (notes) {
      add(`plant.${slug}.notes`, notes, `Growing advice for ${name}. Horticultural accuracy matters more than literal fidelity — adapt to local practice if the technique differs, and flag anything that would not apply in the target region.`);
    }
    count += 1;
  }
  return count;
}

// ── core.js: pest data and companion planting ────────────────────────────────
function exportCore() {
  const src = fs.readFileSync(path.join(ROOT, "core.js"), "utf8");
  const ast = parser.parse(src, { sourceType: "module" });
  let pests = 0;
  let pairs = 0;

  for (const node of ast.program.body) {
    const decl = node.type === "ExportNamedDeclaration" ? node.declaration : node;
    if (decl?.type !== "VariableDeclaration") continue;
    const d = decl.declarations[0];
    const varName = d?.id?.name;

    // PEST_WATCH_DATA: array of { name, sign, fix, prevent }
    if (varName === "PEST_WATCH_DATA" && d.init?.type === "ArrayExpression") {
      for (const el of d.init.elements) {
        if (el?.type !== "ObjectExpression") continue;
        const get = (k) => {
          const p = el.properties.find((x) => x.key?.name === k);
          return p?.value?.type === "StringLiteral" ? p.value.value : null;
        };
        const name = get("name");
        if (!name) continue;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        add(`pest.${slug}.name`, name, `Pest name. Use the name gardeners in the target locale know; regional pest names vary a lot.`);
        for (const [field, note] of [
          ["sign", "How to recognise this pest — symptom description. Must stay diagnostically precise."],
          ["fix", "Treatment instructions. SAFETY-CRITICAL: product names and availability differ by country; flag anything not sold in the target market."],
          ["prevent", "Prevention advice for this pest."],
        ]) {
          const value = get(field);
          if (value) add(`pest.${slug}.${field}`, value, `${name} — ${note}`);
        }
        pests += 1;
      }
    }

    // Companion-planting maps, keyed "planta|plantb".
    if (d?.init?.type === "ObjectExpression") {
      for (const prop of d.init.properties) {
        const key = prop.key?.value ?? prop.key?.name;
        if (typeof key !== "string" || !key.includes("|")) continue;
        if (prop.value?.type !== "StringLiteral") continue;
        const [a, b] = key.split("|");
        add(
          `companion.${key.replace("|", "-")}`,
          prop.value.value,
          `Why ${a} and ${b} are planted together (or kept apart). Horticultural claim — verify it holds in the target region before rewording.`
        );
        pairs += 1;
      }
    }
  }
  return { pests, pairs };
}


// ── Content-bearing components ───────────────────────────────────────────────
// Some horticultural content lives in component files rather than the data
// modules: fertiliser schedules, companion-planting guild templates, harvest
// recipes and storage guides. These read like UI at a glance but are growing
// advice, so they belong with the translator, not in a machine pass.
const CONTENT_COMPONENTS = [
  "components/FertilizerIntelligenceCard.js",
  "components/GuildTemplatesCard.js",
  "components/HarvestRecipesCard.js",
  "components/HarvestStorageGuideCard.js",
  "components/GardenToolkitCard.js",
];

function exportComponents() {
  let count = 0;
  for (const rel of CONTENT_COMPONENTS) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    let ast;
    try { ast = parser.parse(src, { sourceType: "module", plugins: ["jsx"] }); }
    catch (e) { continue; }
    const slug = rel.split("/").pop().replace(/Card\.js$/, "").replace(/\.js$/, "")
      .replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const seen = new Set();
    traverse(ast, {
      StringLiteral(p2) {
        const v = p2.node.value.trim();
        if (v.length < 4 || seen.has(v)) return;
        if (!/[A-Za-z]/.test(v)) return;
        if (/^(rgba?|#[0-9a-f]|https?:|\.\/)/i.test(v)) return;
        if (/^[a-z0-9_-]+$/.test(v) && !v.includes(" ")) return;   // identifiers
        // Skip style/layout keywords and translation keys.
        if (/^(row|column|center|bold|cover|contain|none|small|large|handled|slide|fade)$/.test(v)) return;
        if (p2.parent.type === "CallExpression" && p2.parent.callee.name === "t") return;
        if (p2.parent.type === "ObjectProperty" && p2.parent.key === p2.node) return;
        if (p2.parent.type === "ImportDeclaration") return;
        seen.add(v);
        const key = `${slug}.${[...seen].length}`;
        add(key, v, `From ${rel} — horticultural content shown in the app. Keep advice accurate for the target region; flag anything that would not apply there.`);
        count += 1;
      },
    });
  }
  return count;
}


// ── Untranslated UI strings ──────────────────────────────────────────────────
// The UI chrome extracted into lib/locales/en.js but not yet present in the
// other locales. Including it here means the translator gets ONE file covering
// both the horticultural content and the interface, rather than two engagements.
//
// Rows are marked ui.* and carry a lighter context note: interface copy needs to
// be short and idiomatic, not horticulturally precise, and length matters
// because buttons and tab labels have finite room.
function exportUntranslatedUi() {
  const enPath = path.join(ROOT, "lib/locales/en.js");
  const esPath = path.join(ROOT, "lib/locales/es.js");
  if (!fs.existsSync(enPath) || !fs.existsSync(esPath)) return 0;

  const readDict = (file) => {
    const src = fs.readFileSync(file, "utf8");
    const ast = parser.parse(src, { sourceType: "module" });
    const out = {};
    let root = null;
    for (const n of ast.program.body) {
      if (n.type === "ExportDefaultDeclaration" && n.declaration.type === "ObjectExpression") root = n.declaration;
    }
    if (!root) return out;
    for (const nsProp of root.properties) {
      const ns = nsProp.key?.name || nsProp.key?.value;
      if (!ns || nsProp.value?.type !== "ObjectExpression") continue;
      for (const kProp of nsProp.value.properties) {
        const k = kProp.key?.name || kProp.key?.value;
        if (kProp.value?.type === "StringLiteral") out[`${ns}.${k}`] = kProp.value.value;
      }
    }
    return out;
  };

  const en = readDict(enPath);
  const translated = new Set(Object.keys(readDict(esPath)));
  let count = 0;
  for (const [key, text] of Object.entries(en)) {
    if (translated.has(key)) continue;
    add(
      `ui.${key}`,
      text,
      `Interface copy (${key.split(".")[0]} screen). Keep it short and idiomatic — this appears on a button, label or heading with limited room, so match the English length where you can.`
    );
    count += 1;
  }
  return count;
}

const plantCount = exportProduce();
const { pests, pairs } = exportCore();
const componentRows = exportComponents();
const uiRows = exportUntranslatedUi();

if (process.argv.includes("--stdout")) {
  console.log(JSON.stringify(rows.slice(0, 20), null, 2));
  console.log(`\n… ${rows.length} rows total`);
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const asObject = {};
rows.forEach((r) => { asObject[r.id] = { text: r.text, context: r.context, chars: r.chars }; });
fs.writeFileSync(path.join(OUT_DIR, "content-en.json"), JSON.stringify(asObject, null, 2) + "\n");

const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
const csv = [
  ["id", "context", "chars", "source_text", "translation"].join(","),
  ...rows.map((r) => [esc(r.id), esc(r.context), r.chars, esc(r.text), '""'].join(",")),
].join("\n");
fs.writeFileSync(path.join(OUT_DIR, "content-en.csv"), csv + "\n");

const words = rows.reduce((s, r) => s + r.text.split(/\s+/).length, 0);
console.log(`
  Content catalogue exported to i18n-content/

    plants          ${String(plantCount).padStart(5)}  (name + growing notes)
    pests           ${String(pests).padStart(5)}  (name, sign, fix, prevent)
    companion pairs ${String(pairs).padStart(5)}
    component copy  ${String(componentRows).padStart(5)}  (fertiliser, guilds, recipes, storage)
    UI chrome       ${String(uiRows).padStart(5)}  (buttons, labels, headings — keep short)
    ─────────────────────
    rows            ${String(rows.length).padStart(5)}
    words           ${String(words).padStart(5)}  per language

  Send content-en.csv to a translator; the 'translation' column is theirs to
  fill. Every row carries a context note — do not strip it, it is what keeps
  the horticultural meaning intact.
`);
