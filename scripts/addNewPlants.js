#!/usr/bin/env node
/*
 * addNewPlants.js — one-shot importer for the ~185 new worldwide plants.
 *
 * HOW TO USE (tonight, once the images are generated):
 *   1. Drop every PNG into  assets/plants/  using the exact filenames below.
 *   2. From the project root run:   node scripts/addNewPlants.js
 *
 * It is SAFE to run repeatedly:
 *   • only adds a plant whose image file actually exists,
 *   • skips any plant already in produceData (no duplicates),
 *   • prints which images are still missing so you know what's left to generate.
 *
 * It writes to  data/produceData.js  and  core.js  (plantImages, harvestDays,
 * PERENNIALS). Categories (Vegetable/Herb/Berry/Fruit Tree/Fruit/Flower/
 * Houseplant/Grain/Nut) are already wired in the app.
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

// ── month presets (northern-hemisphere reference, matches existing data) ──
const warmAnnual = [3, 4, 5, 6];
const beans = [4, 5, 6];
const coolGreens = [3, 4, 8, 9];
const spring = [3, 4, 5];
const dormant = [1, 2];
const lateWinter = [2, 3];
const tropical = [4, 5];
const bulbFall = [9, 10, 11];
const bulbSpring = [3, 4];
const flowerSow = [3, 4, 5];
const houseRepot = [3, 4, 5];

// image : [Display Name, type, minZone, maxZone, months, hd, succulent?]
//   hd: number => annual edible harvest days; "P" => perennial edible; 0 => ornamental
const META = {
  // ── Vegetables & greens ──
  snowpea: ["Snow Pea", "Vegetable", "2a", "9b", [3, 4, 8], 60],
  yardlongbean: ["Yardlong Bean", "Vegetable", "7a", "11b", beans, 75],
  wingedbean: ["Winged Bean", "Vegetable", "9a", "12b", [5, 6], 100],
  clusterbean: ["Cluster Bean (Guar)", "Vegetable", "8a", "11b", [5, 6], 90],
  ivygourd: ["Ivy Gourd (Tindora)", "Vegetable", "9a", "11b", [4, 5], "P"],
  pointedgourd: ["Pointed Gourd (Parwal)", "Vegetable", "9a", "11b", [4, 5], 120],
  broccolirabe: ["Broccoli Rabe (Rapini)", "Vegetable", "3a", "9b", coolGreens, 45],
  broccolini: ["Broccolini", "Vegetable", "3a", "9b", [3, 7], 60],
  choysum: ["Choy Sum", "Vegetable", "2a", "11b", coolGreens, 45],
  yuchoy: ["Yu Choy", "Vegetable", "2a", "11b", coolGreens, 45],
  molokhia: ["Molokhia (Jute Mallow)", "Vegetable", "8a", "11b", [5, 6], 60],
  roselle: ["Roselle", "Vegetable", "8a", "11b", [5, 6], 120],
  chinesecelery: ["Chinese Celery", "Vegetable", "5a", "10b", [3, 8], 70],
  garlicchives: ["Garlic Chives", "Herb", "3a", "9b", [3, 4], "P"],
  bambooshoot: ["Bamboo Shoot", "Vegetable", "7a", "11b", [4, 5], "P"],
  nopal: ["Nopal (Cactus Pad)", "Vegetable", "8a", "11b", [4, 5], "P"],
  samphire: ["Samphire (Sea Bean)", "Vegetable", "6a", "10b", [4, 5], 60],
  dandeliongreens: ["Dandelion Greens", "Vegetable", "3a", "9b", [3, 4, 9], 55],
  plantain: ["Plantain", "Fruit", "9a", "12b", tropical, "P"],
  sugarbeet: ["Sugar Beet", "Vegetable", "3a", "9b", [3, 4], 90],
  // ── Peppers & chilies ──
  carolinareaper: ["Carolina Reaper", "Vegetable", "5a", "11b", warmAnnual, 100],
  birdseyechili: ["Bird's Eye Chili", "Vegetable", "8a", "11b", warmAnnual, 90],
  padronpepper: ["Padrón Pepper", "Vegetable", "5a", "11b", warmAnnual, 75],
  fresnopepper: ["Fresno Pepper", "Vegetable", "5a", "11b", warmAnnual, 80],
  hungarianwax: ["Hungarian Wax", "Vegetable", "4a", "11b", warmAnnual, 70],
  ajiamarillo: ["Ají Amarillo", "Vegetable", "8a", "11b", warmAnnual, 100],
  // ── Fruits ──
  cherimoya: ["Cherimoya", "Fruit", "9a", "11b", tropical, "P"],
  sapodilla: ["Sapodilla (Chikoo)", "Fruit", "10a", "12b", tropical, "P"],
  mameysapote: ["Mamey Sapote", "Fruit", "10a", "12b", tropical, "P"],
  jujube: ["Jujube", "Fruit Tree", "6a", "11b", spring, "P"],
  tamarillo: ["Tamarillo (Tree Tomato)", "Fruit", "9a", "11b", tropical, "P"],
  naranjilla: ["Naranjilla (Lulo)", "Fruit", "9a", "11b", tropical, "P"],
  acerola: ["Acerola", "Fruit", "9a", "11b", tropical, "P"],
  surinamcherry: ["Surinam Cherry", "Fruit", "9a", "11b", tropical, "P"],
  bilimbi: ["Bilimbi", "Fruit", "10a", "12b", tropical, "P"],
  bael: ["Bael (Wood Apple)", "Fruit", "10a", "12b", tropical, "P"],
  jamun: ["Jamun (Java Plum)", "Fruit", "10a", "12b", tropical, "P"],
  mamoncillo: ["Mamoncillo (Genip)", "Fruit", "10a", "12b", tropical, "P"],
  pawpaw: ["Pawpaw (American)", "Fruit Tree", "5a", "9b", spring, "P"],
  serviceberry: ["Serviceberry", "Berry", "2a", "8b", spring, "P"],
  jostaberry: ["Jostaberry", "Berry", "3a", "8b", lateWinter, "P"],
  tayberry: ["Tayberry", "Berry", "5a", "9b", spring, "P"],
  loganberry: ["Loganberry", "Berry", "5a", "9b", spring, "P"],
  hardykiwi: ["Hardy Kiwi (Kiwiberry)", "Fruit", "4a", "8b", spring, "P"],
  muscadine: ["Muscadine Grape", "Fruit", "6a", "10b", spring, "P"],
  concordgrape: ["Concord Grape", "Fruit", "4a", "8b", spring, "P"],
  corneliancherry: ["Cornelian Cherry", "Fruit Tree", "4a", "8b", spring, "P"],
  medlar: ["Medlar", "Fruit Tree", "5a", "9b", spring, "P"],
  sweetlime: ["Sweet Lime (Mosambi)", "Fruit Tree", "9a", "11b", spring, "P"],
  uglifruit: ["Ugli Fruit", "Fruit Tree", "9a", "11b", spring, "P"],
  seagrape: ["Sea Grape", "Fruit", "10a", "12b", tropical, "P"],
  gacfruit: ["Gac Fruit", "Fruit", "10a", "12b", tropical, "P"],
  noni: ["Noni", "Fruit", "10a", "12b", tropical, "P"],
  cupuacu: ["Cupuaçu", "Fruit", "10a", "12b", tropical, "P"],
  abiu: ["Abiu", "Fruit", "10a", "12b", tropical, "P"],
  rollinia: ["Rollinia", "Fruit", "10a", "12b", tropical, "P"],
  chempedak: ["Chempedak", "Fruit", "10a", "12b", tropical, "P"],
  marang: ["Marang", "Fruit", "10a", "12b", tropical, "P"],
  pulasan: ["Pulasan", "Fruit", "10a", "12b", tropical, "P"],
  jocote: ["Jocote", "Fruit", "9a", "11b", tropical, "P"],
  che: ["Che (Melonberry)", "Fruit", "5a", "9b", spring, "P"],
  // ── Herbs & spices ──
  cardamom: ["Cardamom", "Herb", "10a", "11b", tropical, "P"],
  vanilla: ["Vanilla", "Herb", "10a", "12b", tropical, "P"],
  saffron: ["Saffron", "Herb", "6a", "9b", [8, 9], "P"],
  galangal: ["Galangal", "Herb", "9a", "11b", tropical, "P"],
  kaffirlime: ["Kaffir Lime", "Herb", "9a", "11b", spring, "P"],
  lemonverbena: ["Lemon Verbena", "Herb", "8a", "11b", spring, "P"],
  pandan: ["Pandan", "Herb", "10a", "12b", tropical, "P"],
  sichuanpepper: ["Sichuan Pepper", "Herb", "6a", "9b", spring, "P"],
  cinnamon: ["Cinnamon", "Herb", "10a", "12b", tropical, "P"],
  clove: ["Clove", "Herb", "10a", "12b", tropical, "P"],
  nutmeg: ["Nutmeg", "Herb", "10a", "12b", tropical, "P"],
  allspice: ["Allspice", "Herb", "10a", "12b", tropical, "P"],
  fenugreek: ["Fenugreek (Methi)", "Herb", "3a", "11b", [3, 4], 40],
  comfrey: ["Comfrey", "Herb", "3a", "9b", spring, "P"],
  valerian: ["Valerian", "Herb", "4a", "9b", spring, "P"],
  ashwagandha: ["Ashwagandha", "Herb", "8a", "11b", [4, 5], 180],
  gotukola: ["Gotu Kola", "Herb", "7a", "11b", spring, "P"],
  rue: ["Rue", "Herb", "4a", "9b", spring, "P"],
  hyssop: ["Hyssop", "Herb", "3a", "9b", spring, "P"],
  angelica: ["Angelica", "Herb", "4a", "9b", spring, "P"],
  feverfew: ["Feverfew", "Herb", "4a", "9b", spring, "P"],
  wormwood: ["Wormwood", "Herb", "4a", "9b", spring, "P"],
  curryplant: ["Curry Plant", "Herb", "8a", "11b", spring, "P"],
  // ── Grains ──
  spelt: ["Spelt", "Grain", "4a", "8b", [3, 4], 120],
  teff: ["Teff", "Grain", "5a", "10b", [5, 6], 100],
  farro: ["Farro (Emmer)", "Grain", "4a", "8b", [3, 4], 120],
  wildrice: ["Wild Rice", "Grain", "3a", "9b", [5], 110],
  triticale: ["Triticale", "Grain", "3a", "8b", [9, 10], 240],
  jobstears: ["Job's Tears", "Grain", "6a", "11b", [5, 6], 120],
  popcorn: ["Popcorn", "Grain", "3a", "10b", [4, 5], 100],
  // ── Nuts & legumes ──
  peanut: ["Peanut", "Vegetable", "6a", "11b", [4, 5], 130],
  soybean: ["Soybean", "Vegetable", "3a", "10b", [5, 6], 100],
  brazilnut: ["Brazil Nut", "Nut", "10a", "12b", tropical, "P"],
  pinenut: ["Pine Nut", "Nut", "4a", "9b", lateWinter, "P"],
  ginkgo: ["Ginkgo", "Nut", "4a", "9b", lateWinter, "P"],
  carob: ["Carob", "Nut", "9a", "11b", spring, "P"],
  kolanut: ["Kola Nut", "Nut", "10a", "12b", tropical, "P"],
  blackwalnut: ["Black Walnut", "Nut", "4a", "9b", lateWinter, "P"],
  // ── Flowers ──
  chrysanthemum: ["Chrysanthemum", "Flower", "5a", "9b", spring, 0],
  carnation: ["Carnation", "Flower", "3a", "9b", spring, 0],
  gerberadaisy: ["Gerbera Daisy", "Flower", "8a", "11b", spring, 0],
  shastadaisy: ["Shasta Daisy", "Flower", "4a", "9b", spring, 0],
  poppy: ["Poppy", "Flower", "3a", "9b", [3, 9], 0],
  begonia: ["Begonia", "Flower", "2a", "11b", flowerSow, 0],
  primrose: ["Primrose", "Flower", "3a", "8b", [8, 9], 0],
  poinsettia: ["Poinsettia", "Flower", "9a", "11b", tropical, 0],
  bougainvillea: ["Bougainvillea", "Flower", "9a", "11b", spring, 0],
  wisteria: ["Wisteria", "Flower", "5a", "9b", spring, 0],
  clematis: ["Clematis", "Flower", "4a", "9b", spring, 0],
  morningglory: ["Morning Glory", "Flower", "2a", "11b", [4, 5], 0],
  moonflower: ["Moonflower", "Flower", "9a", "11b", [4, 5], 0],
  nigella: ["Nigella", "Flower", "2a", "9b", [3, 9], 0],
  statice: ["Statice", "Flower", "3a", "10b", flowerSow, 0],
  strawflower: ["Strawflower", "Flower", "3a", "10b", flowerSow, 0],
  gomphrena: ["Gomphrena", "Flower", "2a", "11b", flowerSow, 0],
  celosia: ["Celosia (Cockscomb)", "Flower", "2a", "11b", flowerSow, 0],
  salvia: ["Salvia", "Flower", "4a", "10b", spring, 0],
  dianthus: ["Dianthus", "Flower", "3a", "9b", spring, 0],
  sweetwilliam: ["Sweet William", "Flower", "3a", "9b", [5, 6], 0],
  cornflower: ["Cornflower", "Flower", "2a", "9b", [3, 9], 0],
  babysbreath: ["Baby's Breath", "Flower", "3a", "9b", spring, 0],
  callalily: ["Calla Lily", "Flower", "8a", "11b", bulbSpring, 0],
  cannalily: ["Canna Lily", "Flower", "7a", "11b", bulbSpring, 0],
  lilyofthevalley: ["Lily of the Valley", "Flower", "2a", "7b", [9, 10], 0],
  forgetmenot: ["Forget-Me-Not", "Flower", "3a", "8b", [8, 9], 0],
  columbine: ["Columbine", "Flower", "3a", "8b", spring, 0],
  bleedingheart: ["Bleeding Heart", "Flower", "2a", "8b", [9, 10], 0],
  astilbe: ["Astilbe", "Flower", "3a", "8b", spring, 0],
  muscari: ["Grape Hyacinth (Muscari)", "Flower", "3a", "8b", bulbFall, 0],
  snowdrop: ["Snowdrop", "Flower", "3a", "7b", [9, 10], 0],
  bluebell: ["Bluebell", "Flower", "4a", "8b", [9, 10], 0],
  portulaca: ["Portulaca (Moss Rose)", "Flower", "5a", "11b", flowerSow, 0],
  vinca: ["Vinca (Periwinkle)", "Flower", "4a", "11b", flowerSow, 0],
  osteospermum: ["Osteospermum", "Flower", "8a", "11b", spring, 0],
  protea: ["Protea", "Flower", "9a", "11b", spring, 0],
  passionflower: ["Passion Flower", "Flower", "6a", "11b", spring, 0],
  buddleia: ["Buddleia (Butterfly Bush)", "Flower", "5a", "9b", spring, 0],
  azalea: ["Azalea", "Flower", "5a", "9b", [9, 10], 0],
  rhododendron: ["Rhododendron", "Flower", "4a", "8b", [9, 10], 0],
  magnolia: ["Magnolia", "Flower", "4a", "9b", [3, 4], 0],
  plumeria: ["Plumeria (Frangipani)", "Flower", "9a", "12b", spring, 0],
  cherryblossom: ["Cherry Blossom", "Flower", "5a", "8b", [3, 4], 0],
  // ── Houseplants, succulents & cacti (universal indoor zones) ──
  rubberplant: ["Rubber Plant", "Houseplant", "1", "13", houseRepot, 0],
  peacelily: ["Peace Lily", "Houseplant", "1", "13", houseRepot, 0],
  croton: ["Croton", "Houseplant", "1", "13", houseRepot, 0],
  englishivy: ["English Ivy", "Houseplant", "1", "13", houseRepot, 0],
  dracaena: ["Dracaena", "Houseplant", "1", "13", houseRepot, 0],
  cordyline: ["Cordyline", "Houseplant", "1", "13", houseRepot, 0],
  peperomia: ["Peperomia", "Houseplant", "1", "13", houseRepot, 0],
  pilea: ["Pilea (Chinese Money Plant)", "Houseplant", "1", "13", houseRepot, 0],
  stringofhearts: ["String of Hearts", "Houseplant", "1", "13", houseRepot, 0, "S"],
  hoya: ["Hoya (Wax Plant)", "Houseplant", "1", "13", houseRepot, 0],
  airplant: ["Air Plant (Tillandsia)", "Houseplant", "1", "13", houseRepot, 0],
  nerveplant: ["Nerve Plant (Fittonia)", "Houseplant", "1", "13", houseRepot, 0],
  polkadotplant: ["Polka Dot Plant", "Houseplant", "1", "13", houseRepot, 0],
  inchplant: ["Inch Plant (Tradescantia)", "Houseplant", "1", "13", houseRepot, 0],
  rexbegonia: ["Rex Begonia", "Houseplant", "1", "13", houseRepot, 0],
  begoniamaculata: ["Begonia Maculata", "Houseplant", "1", "13", houseRepot, 0],
  kalanchoe: ["Kalanchoe", "Houseplant", "1", "13", houseRepot, 0, "S"],
  haworthia: ["Haworthia", "Houseplant", "1", "13", houseRepot, 0, "S"],
  ponytailpalm: ["Ponytail Palm", "Houseplant", "1", "13", houseRepot, 0],
  moneytree: ["Money Tree (Pachira)", "Houseplant", "1", "13", houseRepot, 0],
  norfolkpine: ["Norfolk Island Pine", "Houseplant", "1", "13", houseRepot, 0],
  castironplant: ["Cast Iron Plant", "Houseplant", "1", "13", houseRepot, 0],
  staghornfern: ["Staghorn Fern", "Houseplant", "1", "13", houseRepot, 0],
  asparagusfern: ["Asparagus Fern", "Houseplant", "1", "13", houseRepot, 0],
  luckybamboo: ["Lucky Bamboo", "Houseplant", "1", "13", houseRepot, 0],
  venusflytrap: ["Venus Flytrap", "Houseplant", "1", "13", houseRepot, 0],
  pitcherplant: ["Pitcher Plant", "Houseplant", "1", "13", houseRepot, 0],
  africanviolet: ["African Violet", "Houseplant", "1", "13", houseRepot, 0],
  bromeliad: ["Bromeliad", "Houseplant", "1", "13", houseRepot, 0],
  guzmania: ["Guzmania", "Houseplant", "1", "13", houseRepot, 0],
  anthurium: ["Anthurium", "Houseplant", "1", "13", houseRepot, 0],
  umbrellaplant: ["Umbrella Plant (Schefflera)", "Houseplant", "1", "13", houseRepot, 0],
  lithops: ["Lithops (Living Stones)", "Houseplant", "1", "13", houseRepot, 0, "S"],
  aeonium: ["Aeonium", "Houseplant", "1", "13", houseRepot, 0, "S"],
  ghostplant: ["Ghost Plant", "Houseplant", "1", "13", houseRepot, 0, "S"],
  pandaplant: ["Panda Plant", "Houseplant", "1", "13", houseRepot, 0, "S"],
  stringofbananas: ["String of Bananas", "Houseplant", "1", "13", houseRepot, 0, "S"],
  bunnyearcactus: ["Bunny Ear Cactus", "Houseplant", "1", "13", houseRepot, 0, "S"],
  barrelcactus: ["Barrel Cactus", "Houseplant", "1", "13", houseRepot, 0, "S"],
  pricklypearcactus: ["Prickly Pear Cactus", "Houseplant", "1", "13", houseRepot, 0, "S"],
  phalaenopsis: ["Phalaenopsis Orchid", "Houseplant", "1", "13", houseRepot, 0],
  dendrobium: ["Dendrobium Orchid", "Houseplant", "1", "13", houseRepot, 0],
};

function notesFor(name, type, hd, perennial, succ) {
  if (type === "Flower") return `${name} is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.`;
  if (type === "Houseplant") return succ
    ? `${name} is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.`
    : `${name} is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.`;
  if (type === "Grain") return `${name} is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.`;
  if (type === "Nut") return `${name} is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.`;
  if (type === "Fruit Tree") return `${name} is a fruit tree that does best in full sun and well-drained soil. Plant it while dormant, water deeply, and harvest the fruit once it is fully colored and ripe.`;
  if (type === "Fruit") return `${name} is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.`;
  if (type === "Berry") return `${name} is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.`;
  if (type === "Herb") return perennial
    ? `${name} is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.`
    : `${name} thrives in full sun with well-drained soil. Pinch it back regularly and harvest the leaves as you need them.`;
  if (perennial) return `${name} is a productive perennial in frost-free climates, grown for its edible leaves, pods or roots. Give it full sun and harvest regularly once it establishes.`;
  return `${name} grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly ${hd} days.`;
}

// ── locate insertion points robustly (independent of prior inserts) ──
function insertBeforeObjectClose(src, startMarker, block) {
  const start = src.indexOf(startMarker);
  if (start === -1) throw new Error("marker not found: " + startMarker);
  const close = src.indexOf("\n};", start);
  if (close === -1) throw new Error("close not found for: " + startMarker);
  return src.slice(0, close) + "\n" + block + src.slice(close);
}
function insertAfter(src, marker, block) {
  const i = src.indexOf(marker);
  if (i === -1) throw new Error("marker not found: " + marker);
  const at = i + marker.length;
  return src.slice(0, at) + "\n" + block + src.slice(at);
}

// ── run ──
const produceData = require(path.join(ROOT, "data/produceData")).default;
const existingNames = new Set(produceData.map((p) => p.name));
let core = fs.readFileSync(path.join(ROOT, "core.js"), "utf8");
const mappedKeys = new Set([...core.matchAll(/(\w+): require\("\.\/assets\/plants\//g)].map((m) => m[1]));

const imageLines = [], produceEntries = [], harvestLines = [], perennialNames = [];
const missing = [], added = [], skipped = [];

for (const img of Object.keys(META)) {
  const [name, type, min, max, months, hd, succ] = META[img];
  const fileExists = fs.existsSync(path.join(ROOT, "assets/plants", img + ".png"));
  if (existingNames.has(name)) { skipped.push(name); continue; }
  if (!fileExists) { missing.push(`${name} — ${img}.png`); continue; }

  const perennial = hd === "P";
  const annualHd = typeof hd === "number" && hd > 0 ? hd : null;
  if (!mappedKeys.has(img)) imageLines.push(`  ${img}: require("./assets/plants/${img}.png"),`);
  produceEntries.push(
`  {
    name: ${JSON.stringify(name)},
    type: ${JSON.stringify(type)},
    image: ${JSON.stringify(img)},
    minZone: ${JSON.stringify(min)},
    maxZone: ${JSON.stringify(max)},
    plantMonths: [${months.join(", ")}],
    notes:
      ${JSON.stringify(notesFor(name, type, annualHd, perennial, succ === "S"))},
  },
`);
  if (annualHd) harvestLines.push(`  ${JSON.stringify(name)}: ${annualHd},`);
  if (perennial) perennialNames.push(`  ${JSON.stringify(name)},`);
  added.push(name);
}

if (added.length) {
  if (imageLines.length) core = insertBeforeObjectClose(core, "export const plantImages = {", imageLines.join("\n"));
  if (harvestLines.length) core = insertAfter(core, "export const harvestDays = {", harvestLines.join("\n"));
  if (perennialNames.length) core = insertAfter(core, "export const PERENNIALS = new Set([", perennialNames.join("\n"));
  fs.writeFileSync(path.join(ROOT, "core.js"), core);

  let pd = fs.readFileSync(path.join(ROOT, "data/produceData.js"), "utf8");
  const anchor = "];\nexport default produceData;";
  pd = pd.replace(anchor, produceEntries.join("") + anchor);
  fs.writeFileSync(path.join(ROOT, "data/produceData.js"), pd);
}

console.log(`\n✅ Added ${added.length} plant(s).`);
if (skipped.length) console.log(`↺  Skipped ${skipped.length} already in the app.`);
if (missing.length) {
  console.log(`\n🖼  Still need images for ${missing.length} (drop the PNG, then re-run):`);
  missing.forEach((m) => console.log("   " + m));
}
console.log("");
