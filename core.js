import { Dimensions, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as StoreReview from "expo-store-review";
import produceData from "./data/produceData";
import zipZoneData from "./data/zipZoneData";
import { PLANT_DETAILS } from "./data/plantDetails";
import { PLANT_HEALTH } from "./data/plantHealth";
import { DISEASE_LIBRARY } from "./data/diseaseData";
import { formatDate } from "./lib/i18n";

export const loadingScreenImage = require("./assets/loading-screen.png");

export const welcomeBuddyImage = require("./assets/welcome-buddy.png");

export const gardenBuddyImage = require("./assets/garden-buddy.png");

export const journalBuddyImage = require("./assets/journal-buddy.png");

export const plantsBuddyImage = require("./assets/plants-buddy.png");

export const profileBuddyImage = require("./assets/profile-buddy.png");

export const premiumBuddyImage = require("./assets/premium-buddy.png");

export const homeBuddyImage = require("./assets/home-buddy.png");

export const weatherBuddyImage = require("./assets/weather-buddy.png");

export const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const plantImages = {
  apple: require("./assets/plants/apple.png"),
  apricot: require("./assets/plants/apricot.png"),
  avocado: require("./assets/plants/avocado.png"),
  banana: require("./assets/plants/banana.png"),
  basil: require("./assets/plants/basil.png"),
  beet: require("./assets/plants/beet.png"),
  blackberry: require("./assets/plants/blackberry.png"),
  blueberry: require("./assets/plants/blueberry.png"),
  boysenberry: require("./assets/plants/boysenberry.png"),
  broccoli: require("./assets/plants/broccoli.png"),
  cabbage: require("./assets/plants/cabbage.png"),
  carrot: require("./assets/plants/carrot.png"),
  cauliflower: require("./assets/plants/cauliflower.png"),
  cherry: require("./assets/plants/cherry.png"),
  corn: require("./assets/plants/corn.png"),
  cranberry: require("./assets/plants/cranberry.png"),
  cucumber: require("./assets/plants/cucumber.png"),
  currant: require("./assets/plants/currant.png"),
  eggplant: require("./assets/plants/eggplant.png"),
  elderberry: require("./assets/plants/elderberry.png"),
  fennel: require("./assets/plants/fennel.png"),
  fig: require("./assets/plants/fig.png"),
  garlic: require("./assets/plants/garlic.png"),
  gooseberry: require("./assets/plants/gooseberry.png"),
  grapefruit: require("./assets/plants/grapefruit.png"),
  grapes: require("./assets/plants/grapes.png"),
  greenbean: require("./assets/plants/greenbean.png"),
  honeydew: require("./assets/plants/honeydew.png"),
  kale: require("./assets/plants/kale.png"),
  lemon_tree_variant: require("./assets/plants/lemon_tree_variant.png"),
  lemons: require("./assets/plants/lemons.png"),
  lettuce: require("./assets/plants/lettuce.png"),
  lime: require("./assets/plants/lime.png"),
  mandarin: require("./assets/plants/mandarin.png"),
  marigold: require("./assets/plants/marigold.png"),
  marionberry: require("./assets/plants/marionberry.png"),
  mulberry: require("./assets/plants/mulberry.png"),
  okra: require("./assets/plants/okra.png"),
  onion: require("./assets/plants/onion.png"),
  orange: require("./assets/plants/orange.png"),
  orange_tree_variant: require("./assets/plants/orange_tree_variant.png"),
  parsley: require("./assets/plants/parsley.png"),
  pea: require("./assets/plants/pea.png"),
  peach: require("./assets/plants/peach.png"),
  pear: require("./assets/plants/pear.png"),
  pepper: require("./assets/plants/pepper.png"),
  plum: require("./assets/plants/plum.png"),
  pomegranate: require("./assets/plants/pomegranate.png"),
  potato: require("./assets/plants/potato.png"),
  pumpkin: require("./assets/plants/pumpkin.png"),
  radish: require("./assets/plants/radish.png"),
  raspberry: require("./assets/plants/raspberry.png"),
  rosemary: require("./assets/plants/rosemary.png"),
  serviceberry: require("./assets/plants/serviceberry.png"),
  spinach: require("./assets/plants/spinach.png"),
  strawberry: require("./assets/plants/strawberry.png"),
  sweetpotato: require("./assets/plants/sweetpotato.png"),
  swiss_chard: require("./assets/plants/swiss_chard.png"),
  thyme: require("./assets/plants/thyme.png"),
  tomato: require("./assets/plants/tomato.png"),
  watermelon: require("./assets/plants/watermelon.png"),
  zucchini: require("./assets/plants/zucchini.png"),
  cilantro: require("./assets/plants/cilantro.png"),
  mint: require("./assets/plants/mint.png"),
  celery: require("./assets/plants/celery.png"),
  leek: require("./assets/plants/leek.png"),
  bok_choy: require("./assets/plants/bok_choy.png"),
  mango: require("./assets/plants/mango.png"),
  oregano: require("./assets/plants/oregano.png"),
  sage: require("./assets/plants/sage.png"),
  dill: require("./assets/plants/dill.png"),
  chives: require("./assets/plants/chives.png"),
  tarragon: require("./assets/plants/tarragon.png"),
  lavender: require("./assets/plants/lavender.png"),
  lemongrass: require("./assets/plants/lemongrass.png"),
  marjoram: require("./assets/plants/marjoram.png"),
  baylaurel: require("./assets/plants/baylaurel.png"),
  chamomile: require("./assets/plants/chamomile.png"),
  catnip: require("./assets/plants/catnip.png"),
  stevia: require("./assets/plants/stevia.png"),
  sorrel: require("./assets/plants/sorrel.png"),
  summersavory: require("./assets/plants/summersavory.png"),
  lovage: require("./assets/plants/lovage.png"),
  turmeric: require("./assets/plants/turmeric.png"),
  ginger: require("./assets/plants/ginger.png"),
  anise: require("./assets/plants/anise.png"),
  borage: require("./assets/plants/borage.png"),
  chervil: require("./assets/plants/chervil.png"),
  brusselssprouts: require("./assets/plants/brusselssprouts.png"),
  collardgreens: require("./assets/plants/collardgreens.png"),
  mustardgreens: require("./assets/plants/mustardgreens.png"),
  arugula: require("./assets/plants/arugula.png"),
  kohlrabi: require("./assets/plants/kohlrabi.png"),
  endive: require("./assets/plants/endive.png"),
  radicchio: require("./assets/plants/radicchio.png"),
  watercress: require("./assets/plants/watercress.png"),
  romaine: require("./assets/plants/romaine.png"),
  napacabbage: require("./assets/plants/napacabbage.png"),
  turnip: require("./assets/plants/turnip.png"),
  rutabaga: require("./assets/plants/rutabaga.png"),
  parsnip: require("./assets/plants/parsnip.png"),
  horseradish: require("./assets/plants/horseradish.png"),
  escarole: require("./assets/plants/escarole.png"),
  shallot: require("./assets/plants/shallot.png"),
  scallion: require("./assets/plants/scallion.png"),
  rhubarb: require("./assets/plants/rhubarb.png"),
  asparagus: require("./assets/plants/asparagus.png"),
  artichoke: require("./assets/plants/artichoke.png"),
  jerusalemartichoke: require("./assets/plants/jerusalemartichoke.png"),
  jicama: require("./assets/plants/jicama.png"),
  celeriac: require("./assets/plants/celeriac.png"),
  salsify: require("./assets/plants/salsify.png"),
  daikon: require("./assets/plants/daikon.png"),
  edamame: require("./assets/plants/edamame.png"),
  limabean: require("./assets/plants/limabean.png"),
  favabean: require("./assets/plants/favabean.png"),
  chickpea: require("./assets/plants/chickpea.png"),
  lentil: require("./assets/plants/lentil.png"),
  blackbean: require("./assets/plants/blackbean.png"),
  pintobean: require("./assets/plants/pintobean.png"),
  snappea: require("./assets/plants/snappea.png"),
  jalapeno: require("./assets/plants/jalapeno.png"),
  habanero: require("./assets/plants/habanero.png"),
  serrano: require("./assets/plants/serrano.png"),
  poblano: require("./assets/plants/poblano.png"),
  bellpepper: require("./assets/plants/bellpepper.png"),
  cayenne: require("./assets/plants/cayenne.png"),
  ghostpepper: require("./assets/plants/ghostpepper.png"),
  bananapepper: require("./assets/plants/bananapepper.png"),
  butternutsquash: require("./assets/plants/butternutsquash.png"),
  acornsquash: require("./assets/plants/acornsquash.png"),
  spaghettisquash: require("./assets/plants/spaghettisquash.png"),
  yellowsquash: require("./assets/plants/yellowsquash.png"),
  pattypansquash: require("./assets/plants/pattypansquash.png"),
  delicatasquash: require("./assets/plants/delicatasquash.png"),
  kabochasquash: require("./assets/plants/kabochasquash.png"),
  gourd: require("./assets/plants/gourd.png"),
  luffa: require("./assets/plants/luffa.png"),
  tomatillo: require("./assets/plants/tomatillo.png"),
  nectarine: require("./assets/plants/nectarine.png"),
  persimmon: require("./assets/plants/persimmon.png"),
  guava: require("./assets/plants/guava.png"),
  papaya: require("./assets/plants/papaya.png"),
  quince: require("./assets/plants/quince.png"),
  date: require("./assets/plants/date.png"),
  olive: require("./assets/plants/olive.png"),
  jackfruit: require("./assets/plants/jackfruit.png"),
  lychee: require("./assets/plants/lychee.png"),
  loquat: require("./assets/plants/loquat.png"),
  mulberrytree: require("./assets/plants/mulberrytree.png"),
  pluot: require("./assets/plants/pluot.png"),
  kumquattree: require("./assets/plants/kumquattree.png"),
  feijoa: require("./assets/plants/feijoa.png"),
  tangerine: require("./assets/plants/tangerine.png"),
  clementine: require("./assets/plants/clementine.png"),
  kumquat: require("./assets/plants/kumquat.png"),
  bloodorange: require("./assets/plants/bloodorange.png"),
  yuzu: require("./assets/plants/yuzu.png"),
  bergamot: require("./assets/plants/bergamot.png"),
  calamansi: require("./assets/plants/calamansi.png"),
  pineapple: require("./assets/plants/pineapple.png"),
  kiwi: require("./assets/plants/kiwi.png"),
  passionfruit: require("./assets/plants/passionfruit.png"),
  dragonfruit: require("./assets/plants/dragonfruit.png"),
  starfruit: require("./assets/plants/starfruit.png"),
  coconut: require("./assets/plants/coconut.png"),
  capegooseberry: require("./assets/plants/capegooseberry.png"),
  rambutan: require("./assets/plants/rambutan.png"),
  longan: require("./assets/plants/longan.png"),
  tamarind: require("./assets/plants/tamarind.png"),
  cantaloupe: require("./assets/plants/cantaloupe.png"),
  casabamelon: require("./assets/plants/casabamelon.png"),
  crenshawmelon: require("./assets/plants/crenshawmelon.png"),
  bittermelon: require("./assets/plants/bittermelon.png"),
  wintermelon: require("./assets/plants/wintermelon.png"),
  galiamelon: require("./assets/plants/galiamelon.png"),
  huckleberry: require("./assets/plants/huckleberry.png"),
  lingonberry: require("./assets/plants/lingonberry.png"),
  salmonberry: require("./assets/plants/salmonberry.png"),
  aronia: require("./assets/plants/aronia.png"),
  gojiberry: require("./assets/plants/gojiberry.png"),
  barberry: require("./assets/plants/barberry.png"),
  ackee: require("./assets/plants/ackee.png"),
  adzukibean: require("./assets/plants/adzukibean.png"),
  agapanthus: require("./assets/plants/agapanthus.png"),
  agave: require("./assets/plants/agave.png"),
  almond: require("./assets/plants/almond.png"),
  alocasia: require("./assets/plants/alocasia.png"),
  aloevera: require("./assets/plants/aloevera.png"),
  amaranth: require("./assets/plants/amaranth.png"),
  amaryllis: require("./assets/plants/amaryllis.png"),
  anaheimpepper: require("./assets/plants/anaheimpepper.png"),
  anemone: require("./assets/plants/anemone.png"),
  arecapalm: require("./assets/plants/arecapalm.png"),
  arrowroot: require("./assets/plants/arrowroot.png"),
  ashgourd: require("./assets/plants/ashgourd.png"),
  aster: require("./assets/plants/aster.png"),
  atemoya: require("./assets/plants/atemoya.png"),
  barley: require("./assets/plants/barley.png"),
  baytree: require("./assets/plants/baytree.png"),
  beebalm: require("./assets/plants/beebalm.png"),
  beefsteaktomato: require("./assets/plants/beefsteaktomato.png"),
  bilberry: require("./assets/plants/bilberry.png"),
  birdofparadise: require("./assets/plants/birdofparadise.png"),
  birdsnestfern: require("./assets/plants/birdsnestfern.png"),
  blackcurrant: require("./assets/plants/blackcurrant.png"),
  blackeyedpea: require("./assets/plants/blackeyedpea.png"),
  blackeyedsusan: require("./assets/plants/blackeyedsusan.png"),
  blacksapote: require("./assets/plants/blacksapote.png"),
  bostonfern: require("./assets/plants/bostonfern.png"),
  bottlegourd: require("./assets/plants/bottlegourd.png"),
  boysenthorn: require("./assets/plants/boysenthorn.png"),
  breadfruit: require("./assets/plants/breadfruit.png"),
  buckwheat: require("./assets/plants/buckwheat.png"),
  buddhashand: require("./assets/plants/buddhashand.png"),
  burrostail: require("./assets/plants/burrostail.png"),
  calamondin: require("./assets/plants/calamondin.png"),
  calathea: require("./assets/plants/calathea.png"),
  calendula: require("./assets/plants/calendula.png"),
  camellia: require("./assets/plants/camellia.png"),
  canistel: require("./assets/plants/canistel.png"),
  cannellinibean: require("./assets/plants/cannellinibean.png"),
  cardoon: require("./assets/plants/cardoon.png"),
  cashew: require("./assets/plants/cashew.png"),
  cassava: require("./assets/plants/cassava.png"),
  celtuce: require("./assets/plants/celtuce.png"),
  chayote: require("./assets/plants/chayote.png"),
  cherrytomato: require("./assets/plants/cherrytomato.png"),
  chestnut: require("./assets/plants/chestnut.png"),
  chineseevergreen: require("./assets/plants/chineseevergreen.png"),
  chineseyam: require("./assets/plants/chineseyam.png"),
  christmascactus: require("./assets/plants/christmascactus.png"),
  cloudberry: require("./assets/plants/cloudberry.png"),
  coleus: require("./assets/plants/coleus.png"),
  coneflower: require("./assets/plants/coneflower.png"),
  coreopsis: require("./assets/plants/coreopsis.png"),
  cosmos: require("./assets/plants/cosmos.png"),
  cowpea: require("./assets/plants/cowpea.png"),
  crocus: require("./assets/plants/crocus.png"),
  cubanellepepper: require("./assets/plants/cubanellepepper.png"),
  culantro: require("./assets/plants/culantro.png"),
  curryleaf: require("./assets/plants/curryleaf.png"),
  custardapple: require("./assets/plants/custardapple.png"),
  cyclamen: require("./assets/plants/cyclamen.png"),
  daffodil: require("./assets/plants/daffodil.png"),
  dahlia: require("./assets/plants/dahlia.png"),
  delphinium: require("./assets/plants/delphinium.png"),
  dewberry: require("./assets/plants/dewberry.png"),
  dieffenbachia: require("./assets/plants/dieffenbachia.png"),
  durian: require("./assets/plants/durian.png"),
  echeveria: require("./assets/plants/echeveria.png"),
  elderberryblack: require("./assets/plants/elderberryblack.png"),
  elephantear: require("./assets/plants/elephantear.png"),
  epazote: require("./assets/plants/epazote.png"),
  fern: require("./assets/plants/fern.png"),
  fiddleleaffig: require("./assets/plants/fiddleleaffig.png"),
  fingerlime: require("./assets/plants/fingerlime.png"),
  foxglove: require("./assets/plants/foxglove.png"),
  freesia: require("./assets/plants/freesia.png"),
  fuchsia: require("./assets/plants/fuchsia.png"),
  gailan: require("./assets/plants/gailan.png"),
  gaillardia: require("./assets/plants/gaillardia.png"),
  gardenia: require("./assets/plants/gardenia.png"),
  geranium: require("./assets/plants/geranium.png"),
  gladiolus: require("./assets/plants/gladiolus.png"),
  haskap: require("./assets/plants/haskap.png"),
  hazelnut: require("./assets/plants/hazelnut.png"),
  heirloomtomato: require("./assets/plants/heirloomtomato.png"),
  hellebore: require("./assets/plants/hellebore.png"),
  hensandchicks: require("./assets/plants/hensandchicks.png"),
  hibiscus: require("./assets/plants/hibiscus.png"),
  hollyhock: require("./assets/plants/hollyhock.png"),
  hosta: require("./assets/plants/hosta.png"),
  hyacinth: require("./assets/plants/hyacinth.png"),
  hydrangea: require("./assets/plants/hydrangea.png"),
  impatiens: require("./assets/plants/impatiens.png"),
  iris: require("./assets/plants/iris.png"),
  jabuticaba: require("./assets/plants/jabuticaba.png"),
  jadeplant: require("./assets/plants/jadeplant.png"),
  jasmine: require("./assets/plants/jasmine.png"),
  juneplum: require("./assets/plants/juneplum.png"),
  kangkong: require("./assets/plants/kangkong.png"),
  kentiapalm: require("./assets/plants/kentiapalm.png"),
  keylime: require("./assets/plants/keylime.png"),
  kidneybean: require("./assets/plants/kidneybean.png"),
  komatsuna: require("./assets/plants/komatsuna.png"),
  larkspur: require("./assets/plants/larkspur.png"),
  lavatera: require("./assets/plants/lavatera.png"),
  lemonbalm: require("./assets/plants/lemonbalm.png"),
  lilac: require("./assets/plants/lilac.png"),
  lily: require("./assets/plants/lily.png"),
  lobella: require("./assets/plants/lobella.png"),
  longkong: require("./assets/plants/longkong.png"),
  lotusroot: require("./assets/plants/lotusroot.png"),
  lupin: require("./assets/plants/lupin.png"),
  lupineflower: require("./assets/plants/lupineflower.png"),
  macadamia: require("./assets/plants/macadamia.png"),
  maidenhairfern: require("./assets/plants/maidenhairfern.png"),
  malabarspinach: require("./assets/plants/malabarspinach.png"),
  mangosteen: require("./assets/plants/mangosteen.png"),
  meyerlemon: require("./assets/plants/meyerlemon.png"),
  millet: require("./assets/plants/millet.png"),
  miraclefruit: require("./assets/plants/miraclefruit.png"),
  mizuna: require("./assets/plants/mizuna.png"),
  monstera: require("./assets/plants/monstera.png"),
  moringa: require("./assets/plants/moringa.png"),
  mulberryred: require("./assets/plants/mulberryred.png"),
  mulberrywhite: require("./assets/plants/mulberrywhite.png"),
  mungbean: require("./assets/plants/mungbean.png"),
  mustardspinach: require("./assets/plants/mustardspinach.png"),
  nasturtium: require("./assets/plants/nasturtium.png"),
  navybean: require("./assets/plants/navybean.png"),
  newzealandspinach: require("./assets/plants/newzealandspinach.png"),
  oats: require("./assets/plants/oats.png"),
  okrared: require("./assets/plants/okrared.png"),
  orchid: require("./assets/plants/orchid.png"),
  pansy: require("./assets/plants/pansy.png"),
  parlorpalm: require("./assets/plants/parlorpalm.png"),
  pecan: require("./assets/plants/pecan.png"),
  peony: require("./assets/plants/peonyy.png"),
  peppermint: require("./assets/plants/peppermint.png"),
  petunia: require("./assets/plants/petunia.png"),
  philodendron: require("./assets/plants/philodendron.png"),
  phlox: require("./assets/plants/phlox.png"),
  pigeonpea: require("./assets/plants/pigeonpea.png"),
  pimentopepper: require("./assets/plants/pimentopepper.png"),
  pistachio: require("./assets/plants/pistachio.png"),
  pomelo: require("./assets/plants/pomelo.png"),
  pothos: require("./assets/plants/pothos.png"),
  prayerplant: require("./assets/plants/prayerplant.png"),
  purslane: require("./assets/plants/purslane.png"),
  quinoa: require("./assets/plants/quinoa.png"),
  ranunculus: require("./assets/plants/ranunculus.png"),
  redcurrant: require("./assets/plants/redcurrant.png"),
  rice: require("./assets/plants/rice.png"),
  ridgegourd: require("./assets/plants/ridgegourd.png"),
  romanesco: require("./assets/plants/romanesco.png"),
  romatomato: require("./assets/plants/romatomato.png"),
  rose: require("./assets/plants/rosee.png"),
  roseapple: require("./assets/plants/roseapple.png"),
  rye: require("./assets/plants/rye.png"),
  sanmarzanotomato: require("./assets/plants/sanmarzanotomato.png"),
  santol: require("./assets/plants/santol.png"),
  scabiosa: require("./assets/plants/scabiosa.png"),
  scotchbonnetpepper: require("./assets/plants/scotchbonnetpepper.png"),
  seabuckthorn: require("./assets/plants/seabuckthorn.png"),
  sedum: require("./assets/plants/sedum.png"),
  shishitopepper: require("./assets/plants/shishitopepper.png"),
  shiso: require("./assets/plants/shiso.png"),
  snakefruit: require("./assets/plants/snakefruit.png"),
  snakegourd: require("./assets/plants/snakegourd.png"),
  snakeplant: require("./assets/plants/snakeplant.png"),
  snapdragon: require("./assets/plants/snapdragon.png"),
  sorghum: require("./assets/plants/sorghum.png"),
  soursop: require("./assets/plants/soursop.png"),
  spearmint: require("./assets/plants/spearmint.png"),
  spiderplant: require("./assets/plants/spiderplant.png"),
  starapple: require("./assets/plants/starapple.png"),
  stock: require("./assets/plants/stock.png"),
  stringofpearls: require("./assets/plants/stringofpearls.png"),
  sudachi: require("./assets/plants/sudachi.png"),
  sugarapple: require("./assets/plants/sugarapple.png"),
  sunflower: require("./assets/plants/sunflower.png"),
  sweetalyssum: require("./assets/plants/sweetalyssum.png"),
  sweetpea: require("./assets/plants/sweetpea.png"),
  taro: require("./assets/plants/taro.png"),
  tatsoi: require("./assets/plants/tatsoi.png"),
  thaichilipepper: require("./assets/plants/thaichilipepper.png"),
  tulip: require("./assets/plants/tulip.png"),
  tulsi: require("./assets/plants/tulsi.png"),
  verbena: require("./assets/plants/verbena.png"),
  vietnamesecoriander: require("./assets/plants/vietnamesecoriander.png"),
  viola: require("./assets/plants/viola.png"),
  walnut: require("./assets/plants/walnut.png"),
  wasabi: require("./assets/plants/wasabi.png"),
  waterchestnut: require("./assets/plants/waterchestnut.png"),
  waxapple: require("./assets/plants/waxapple.png"),
  wheat: require("./assets/plants/wheat.png"),
  whitecurrant: require("./assets/plants/whitecurrant.png"),
  whitesapote: require("./assets/plants/whitesapote.png"),
  wineberry: require("./assets/plants/wineberry.png"),
  wintersavory: require("./assets/plants/wintersavory.png"),
  yam: require("./assets/plants/yam.png"),
  yarrow: require("./assets/plants/yarrow.png"),
  yucca: require("./assets/plants/yucca.png"),
  zinnia: require("./assets/plants/zinnia.png"),
  zzplant: require("./assets/plants/zzplant.png"),
  snowpea: require("./assets/plants/snowpea.png"),
  yardlongbean: require("./assets/plants/yardlongbean.png"),
  wingedbean: require("./assets/plants/wingedbean.png"),
  clusterbean: require("./assets/plants/clusterbean.png"),
  ivygourd: require("./assets/plants/ivygourd.png"),
  pointedgourd: require("./assets/plants/pointedgourd.png"),
  broccolirabe: require("./assets/plants/broccolirabe.png"),
  broccolini: require("./assets/plants/broccolini.png"),
  choysum: require("./assets/plants/choysum.png"),
  yuchoy: require("./assets/plants/yuchoy.png"),
  molokhia: require("./assets/plants/molokhia.png"),
  roselle: require("./assets/plants/roselle.png"),
  chinesecelery: require("./assets/plants/chinesecelery.png"),
  garlicchives: require("./assets/plants/garlicchives.png"),
  bambooshoot: require("./assets/plants/bambooshoot.png"),
  nopal: require("./assets/plants/nopal.png"),
  samphire: require("./assets/plants/samphire.png"),
  dandeliongreens: require("./assets/plants/dandeliongreens.png"),
  plantain: require("./assets/plants/plantain.png"),
  sugarbeet: require("./assets/plants/sugarbeet.png"),
  carolinareaper: require("./assets/plants/carolinareaper.png"),
  birdseyechili: require("./assets/plants/birdseyechili.png"),
  padronpepper: require("./assets/plants/padronpepper.png"),
  fresnopepper: require("./assets/plants/fresnopepper.png"),
  hungarianwax: require("./assets/plants/hungarianwax.png"),
  ajiamarillo: require("./assets/plants/ajiamarillo.png"),
  cherimoya: require("./assets/plants/cherimoya.png"),
  sapodilla: require("./assets/plants/sapodilla.png"),
  mameysapote: require("./assets/plants/mameysapote.png"),
  jujube: require("./assets/plants/jujube.png"),
  tamarillo: require("./assets/plants/tamarillo.png"),
  naranjilla: require("./assets/plants/naranjilla.png"),
  acerola: require("./assets/plants/acerola.png"),
  surinamcherry: require("./assets/plants/surinamcherry.png"),
  bilimbi: require("./assets/plants/bilimbi.png"),
  bael: require("./assets/plants/bael.png"),
  jamun: require("./assets/plants/jamun.png"),
  mamoncillo: require("./assets/plants/mamoncillo.png"),
  pawpaw: require("./assets/plants/pawpaw.png"),
  jostaberry: require("./assets/plants/jostaberry.png"),
  loganberry: require("./assets/plants/loganberry.png"),
  hardykiwi: require("./assets/plants/hardykiwi.png"),
  concordgrape: require("./assets/plants/concordgrape.png"),
  corneliancherry: require("./assets/plants/corneliancherry.png"),
  medlar: require("./assets/plants/medlar.png"),
  sweetlime: require("./assets/plants/sweetlime.png"),
  uglifruit: require("./assets/plants/uglifruit.png"),
  seagrape: require("./assets/plants/seagrape.png"),
  gacfruit: require("./assets/plants/gacfruit.png"),
  noni: require("./assets/plants/noni.png"),
  cupuacu: require("./assets/plants/cupuacu.png"),
  abiu: require("./assets/plants/abiu.png"),
  rollinia: require("./assets/plants/rollinia.png"),
  chempedak: require("./assets/plants/chempedak.png"),
  marang: require("./assets/plants/marang.png"),
  pulasan: require("./assets/plants/pulasan.png"),
  che: require("./assets/plants/che.png"),
  cardamom: require("./assets/plants/cardamom.png"),
  vanilla: require("./assets/plants/vanilla.png"),
  saffron: require("./assets/plants/saffron.png"),
  galangal: require("./assets/plants/galangal.png"),
  kaffirlime: require("./assets/plants/kaffirlime.png"),
  lemonverbena: require("./assets/plants/lemonverbena.png"),
  pandan: require("./assets/plants/pandan.png"),
  sichuanpepper: require("./assets/plants/sichuanpepper.png"),
  cinnamon: require("./assets/plants/cinnamon.png"),
  clove: require("./assets/plants/clove.png"),
  nutmeg: require("./assets/plants/nutmeg.png"),
  allspice: require("./assets/plants/allspice.png"),
  fenugreek: require("./assets/plants/fenugreek.png"),
  comfrey: require("./assets/plants/comfrey.png"),
  valerian: require("./assets/plants/valerian.png"),
  ashwagandha: require("./assets/plants/ashwagandha.png"),
  gotukola: require("./assets/plants/gotukola.png"),
  rue: require("./assets/plants/rue.png"),
  hyssop: require("./assets/plants/hyssop.png"),
  angelica: require("./assets/plants/angelica.png"),
  feverfew: require("./assets/plants/feverfew.png"),
  wormwood: require("./assets/plants/wormwood.png"),
  curryplant: require("./assets/plants/curryplant.png"),
  spelt: require("./assets/plants/spelt.png"),
  teff: require("./assets/plants/teff.png"),
  farro: require("./assets/plants/farro.png"),
  wildrice: require("./assets/plants/wildrice.png"),
  triticale: require("./assets/plants/triticale.png"),
  jobstears: require("./assets/plants/jobstears.png"),
  popcorn: require("./assets/plants/popcorn.png"),
  peanut: require("./assets/plants/peanut.png"),
  soybean: require("./assets/plants/soybean.png"),
  brazilnut: require("./assets/plants/brazilnut.png"),
  pinenut: require("./assets/plants/pinenut.png"),
  ginkgo: require("./assets/plants/ginkgo.png"),
  carob: require("./assets/plants/carob.png"),
  kolanut: require("./assets/plants/kolanut.png"),
  blackwalnut: require("./assets/plants/blackwalnut.png"),
  chrysanthemum: require("./assets/plants/chrysanthemum.png"),
  carnation: require("./assets/plants/carnation.png"),
  gerberadaisy: require("./assets/plants/gerberadaisy.png"),
  shastadaisy: require("./assets/plants/shastadaisy.png"),
  poppy: require("./assets/plants/poppy.png"),
  begonia: require("./assets/plants/begonia.png"),
  primrose: require("./assets/plants/primrose.png"),
  poinsettia: require("./assets/plants/poinsettia.png"),
  bougainvillea: require("./assets/plants/bougainvillea.png"),
  wisteria: require("./assets/plants/wisteria.png"),
  clematis: require("./assets/plants/clematis.png"),
  morningglory: require("./assets/plants/morningglory.png"),
  moonflower: require("./assets/plants/moonflower.png"),
  nigella: require("./assets/plants/nigella.png"),
  statice: require("./assets/plants/statice.png"),
  strawflower: require("./assets/plants/strawflower.png"),
  gomphrena: require("./assets/plants/gomphrena.png"),
  celosia: require("./assets/plants/celosia.png"),
  sweetwilliam: require("./assets/plants/sweetwilliam.png"),
  cornflower: require("./assets/plants/cornflower.png"),
  babysbreath: require("./assets/plants/babysbreath.png"),
  callalily: require("./assets/plants/callalily.png"),
  cannalily: require("./assets/plants/cannalily.png"),
  lilyofthevalley: require("./assets/plants/lilyofthevalley.png"),
  forgetmenot: require("./assets/plants/forgetmenot.png"),
  columbine: require("./assets/plants/columbine.png"),
  bleedingheart: require("./assets/plants/bleedingheart.png"),
  astilbe: require("./assets/plants/astilbe.png"),
  snowdrop: require("./assets/plants/snowdrop.png"),
  bluebell: require("./assets/plants/bluebell.png"),
  portulaca: require("./assets/plants/portulaca.png"),
  vinca: require("./assets/plants/vinca.png"),
  osteospermum: require("./assets/plants/osteospermum.png"),
  protea: require("./assets/plants/protea.png"),
  passionflower: require("./assets/plants/passionflower.png"),
  buddleia: require("./assets/plants/buddleia.png"),
  azalea: require("./assets/plants/azalea.png"),
  rhododendron: require("./assets/plants/rhododendron.png"),
  magnolia: require("./assets/plants/magnolia.png"),
  plumeria: require("./assets/plants/plumeria.png"),
  cherryblossom: require("./assets/plants/cherryblossom.png"),
  rubberplant: require("./assets/plants/rubberplant.png"),
  peacelily: require("./assets/plants/peacelily.png"),
  croton: require("./assets/plants/croton.png"),
  englishivy: require("./assets/plants/englishivy.png"),
  dracaena: require("./assets/plants/dracaena.png"),
  cordyline: require("./assets/plants/cordyline.png"),
  pilea: require("./assets/plants/pilea.png"),
  stringofhearts: require("./assets/plants/stringofhearts.png"),
  hoya: require("./assets/plants/hoya.png"),
  airplant: require("./assets/plants/airplant.png"),
  nerveplant: require("./assets/plants/nerveplant.png"),
  polkadotplant: require("./assets/plants/polkadotplant.png"),
  inchplant: require("./assets/plants/inchplant.png"),
  rexbegonia: require("./assets/plants/rexbegonia.png"),
  begoniamaculata: require("./assets/plants/begoniamaculata.png"),
  kalanchoe: require("./assets/plants/kalanchoe.png"),
  haworthia: require("./assets/plants/haworthia.png"),
  ponytailpalm: require("./assets/plants/ponytailpalm.png"),
  moneytree: require("./assets/plants/moneytree.png"),
  norfolkpine: require("./assets/plants/norfolkpine.png"),
  castironplant: require("./assets/plants/castironplant.png"),
  staghornfern: require("./assets/plants/staghornfern.png"),
  asparagusfern: require("./assets/plants/asparagusfern.png"),
  luckybamboo: require("./assets/plants/luckybamboo.png"),
  venusflytrap: require("./assets/plants/venusflytrap.png"),
  pitcherplant: require("./assets/plants/pitcherplant.png"),
  africanviolet: require("./assets/plants/africanviolet.png"),
  bromeliad: require("./assets/plants/bromeliad.png"),
  guzmania: require("./assets/plants/guzmania.png"),
  anthurium: require("./assets/plants/anthurium.png"),
  umbrellaplant: require("./assets/plants/umbrellaplant.png"),
  lithops: require("./assets/plants/lithops.png"),
  aeonium: require("./assets/plants/aeonium.png"),
  ghostplant: require("./assets/plants/ghostplant.png"),
  pandaplant: require("./assets/plants/pandaplant.png"),
  stringofbananas: require("./assets/plants/stringofbananas.png"),
  bunnyearcactus: require("./assets/plants/bunnyearcactus.png"),
  barrelcactus: require("./assets/plants/barrelcactus.png"),
  pricklypearcactus: require("./assets/plants/pricklypearcactus.png"),
  phalaenopsis: require("./assets/plants/phalaenopsis.png"),
  dendrobium: require("./assets/plants/dendrobium.png"),
  iceberglettuce: require("./assets/plants/iceberglettuce.png"),
  butterheadlettuce: require("./assets/plants/butterheadlettuce.png"),
  oakleaflettuce: require("./assets/plants/oakleaflettuce.png"),
  redcabbage: require("./assets/plants/redcabbage.png"),
  savoycabbage: require("./assets/plants/savoycabbage.png"),
  lacinatokale: require("./assets/plants/lacinatokale.png"),
  elephantgarlic: require("./assets/plants/elephantgarlic.png"),
  pearlonion: require("./assets/plants/pearlonion.png"),
  scarletrunnerbean: require("./assets/plants/scarletrunnerbean.png"),
  cranberrybean: require("./assets/plants/cranberrybean.png"),
  crooknecksquash: require("./assets/plants/crooknecksquash.png"),
  hubbardsquash: require("./assets/plants/hubbardsquash.png"),
  chicory: require("./assets/plants/chicory.png"),
  marrow: require("./assets/plants/marrow.png"),
  tabascopepper: require("./assets/plants/tabascopepper.png"),
  peperoncini: require("./assets/plants/peperoncini.png"),
  aleppopepper: require("./assets/plants/aleppopepper.png"),
  cornsalad: require("./assets/plants/cornsalad.png"),
  frisee: require("./assets/plants/frisee.png"),
  gardencress: require("./assets/plants/gardencress.png"),
  orach: require("./assets/plants/orach.png"),
  seakale: require("./assets/plants/seakale.png"),
  fiddleheadfern: require("./assets/plants/fiddleheadfern.png"),
  ramps: require("./assets/plants/ramps.png"),
  stingingnettle: require("./assets/plants/stingingnettle.png"),
  welshonion: require("./assets/plants/welshonion.png"),
  burdock: require("./assets/plants/burdock.png"),
  scorzonera: require("./assets/plants/scorzonera.png"),
  pricklypear: require("./assets/plants/pricklypear.png"),
  muscadinegrape: require("./assets/plants/muscadinegrape.png"),
  kiwano: require("./assets/plants/kiwano.png"),
  koreanmelon: require("./assets/plants/koreanmelon.png"),
  canarymelon: require("./assets/plants/canarymelon.png"),
  tangelo: require("./assets/plants/tangelo.png"),
  satsuma: require("./assets/plants/satsuma.png"),
  caracaraorange: require("./assets/plants/caracaraorange.png"),
  sevilleorange: require("./assets/plants/sevilleorange.png"),
  citron: require("./assets/plants/citron.png"),
  crabapple: require("./assets/plants/crabapple.png"),
  sourcherry: require("./assets/plants/sourcherry.png"),
  damsonplum: require("./assets/plants/damsonplum.png"),
  mirabelleplum: require("./assets/plants/mirabelleplum.png"),
  tayberry: require("./assets/plants/tayberry.png"),
  saskatoonberry: require("./assets/plants/saskatoonberry.png"),
  thimbleberry: require("./assets/plants/thimbleberry.png"),
  alpinestrawberry: require("./assets/plants/alpinestrawberry.png"),
  pineberry: require("./assets/plants/pineberry.png"),
  chrysanthemumgreens: require("./assets/plants/chrysanthemumgreens.png"),
  grapehyacinth: require("./assets/plants/grapehyacinth.png"),
  jocote: require("./assets/plants/jocote.png"),
};

export const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const PLANT_TYPES = ["All","Vegetables","Tree Fruits","Tropical Fruits","Berries","Herbs","Flowers","Houseplants","Grains","Nuts"];

export const MONTH_LABELS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const STORAGE_KEYS = {
  zip: "pp_zip",
  latitude: "pp_latitude",
  country: "pp_country",
  language: "pp_language",
  savedPlants: "pp_savedPlants",
  dailyBonusDate: "pp_dailyBonusDate",
  dailyBonusXP: "pp_dailyBonusXP",
  plantNotes: "pp_plantNotes",
  followedPlants: "pp_followedPlants",
  journalEntries: "pp_journalEntries",
  selectedMonth: "pp_selectedMonth",
  selectedType: "pp_selectedType",
  remindersOn: "pp_remindersOn",
  frostAlertsOn: "pp_frostAlertsOn",
  appearanceMode: "pp_appearanceMode",
  subscriptionPlan: "pp_subscriptionPlan",
  premiumUnlocked: "pp_premiumUnlocked",
  gardenMap: "pp_gardenMap",
  wateredPlants: "pp_wateredPlants",
  wateringHistory: "pp_wateringHistory",
  harvestTrackers: "pp_harvestTrackers",
  wateringReminders: "pp_wateringReminders",
  fertilizerTrackers: "pp_fertilizerTrackers",
  streakData: "pp_streakData",
  seenPremiumIntro: "pp_seenPremiumIntro",
  seenOnboarding: "pp_seenOnboarding",
  profileName: "pp_profileName",
  profilePhoto: "pp_profilePhoto",
  profileTheme: "pp_profileTheme",  // ADD THIS LINE
};

export const GARDEN_SLOTS = Array.from({ length: 12 }, (_, index) => ({
  id: `slot-${index + 1}`,
  label: `Plot ${index + 1}`,
}));

// ── Self-persisting feature modules ──────────────────────────────────────────
// Several cards (seed inventory, custom tasks, rainfall, toolkit, and the newer
// compost / rain-barrel / germination / chore trackers) keep their own
// AsyncStorage keys instead of threading state through App.js. Listing those
// keys here lets the full backup round-trip their data too, so a restore brings
// everything back instead of silently dropping module data.
export const MODULE_STORAGE_KEYS = [
  "pp_compostLog",
  "pp_rainBarrel",
  "pp_germTests",
  "pp_choreRotation",
  "pp_seedInventory",
  "pp_customTasks",
  "pp_rainfallLog",
  "pp_toolkit_owned",
  // second batch of self-persisting modules
  "pp_soilTempLog",
  "pp_soilTests",
  "pp_toolMaint",
  "pp_growLights",
  "pp_gardenSites",
  "pp_pruningDone",
  "pp_propagation",
  "pp_plantRooms",
  "pp_houseplantCare",
  "pp_vases",
];

// Reads every module key and returns a { key: rawJsonString } map for the
// backup payload. Values stay as their stored JSON strings so restore can write
// them straight back without re-serializing.
export async function collectModuleBackup() {
  const out = {};
  try {
    const pairs = await AsyncStorage.multiGet(MODULE_STORAGE_KEYS);
    pairs.forEach(([key, val]) => {
      if (val != null) out[key] = val;
    });
  } catch (e) {
    /* ignore — a partial backup is better than a failed one */
  }
  return out;
}

// Writes a module map (from collectModuleBackup) back into AsyncStorage. The
// self-persisting cards re-read their key when their tab next mounts, so the
// restored data shows up without a full app relaunch.
export async function applyModuleBackup(modules) {
  if (!modules || typeof modules !== "object") return;
  const entries = MODULE_STORAGE_KEYS
    .filter((k) => typeof modules[k] === "string")
    .map((k) => [k, modules[k]]);
  if (!entries.length) return;
  try {
    await AsyncStorage.multiSet(entries);
  } catch (e) {
    /* ignore */
  }
}

export const RARITY_STYLES = {
  Common: { label: "Common", emoji: "🌱", color: "#2f7d46", bg: "#eaf8ee", border: "#bfe8ca" },
  Rare: { label: "Rare", emoji: "💎", color: "#315fd6", bg: "#edf3ff", border: "#bfd0ff" },
  Epic: { label: "Epic", emoji: "✨", color: "#7b3ff2", bg: "#f3edff", border: "#d8c8ff" },
  Legendary: { label: "Legendary", emoji: "🏆", color: "#bf7a12", bg: "#fff5dc", border: "#f6d28a" },
};

export function normalizeZip(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 5);
}

export function zoneNumber(zone) {
  const parsed = parseFloat(String(zone || "").replace(/[^\d.]/g, ""));
  return Number.isNaN(parsed) ? null : parsed;
}

export function getClimateBucket(zone) {
  const value = zoneNumber(zone);
  if (value === null) return "moderate";
  if (value <= 5) return "cold";
  if (value <= 8) return "moderate";
  return "hot";
}

// USDA zones 10 and warmer effectively never freeze, so frost-date tools
// (frost-window warnings, last/first frost overrides) are just noise there.
export function zoneIsFrostFree(zone) {
  const value = zoneNumber(zone);
  return value !== null && value >= 10;
}

// ── Hemisphere ───────────────────────────────────────────────────────────────
// All seasonal data in the app (plantMonths, pest months, frost dates) is
// authored in northern-hemisphere calendar terms. Below the equator the growing
// year is offset by six months, so a single ref lets the pure helpers below
// translate without every caller having to thread a latitude through.
export const hemisphereRef = { current: "N" };

export function setHemisphereFromLatitude(latitude) {
  const value = parseFloat(latitude);
  if (Number.isNaN(value)) return;
  hemisphereRef.current = value < 0 ? "S" : "N";
}

export function isSouthernHemisphere() {
  return hemisphereRef.current === "S";
}

// Shifts a 1-12 month by six months in the southern hemisphere, and is a no-op
// in the northern. It is its own inverse, so the same call converts northern
// reference data into local months and local months back into reference data.
export function flipMonth(month) {
  const value = Number(month);
  if (!value || !isSouthernHemisphere()) return value;
  return ((value + 5) % 12) + 1;
}

// Shifts a Date by six months in the southern hemisphere, keeping the day of
// the month so "late May" stays "late November". The result stays inside the
// same calendar year, matching the northern helpers — callers such as
// getFrostMaturityInfo already handle a date that has passed.
export function flipDate(date) {
  if (!(date instanceof Date) || !isSouthernHemisphere()) return date;
  return new Date(date.getFullYear(), (date.getMonth() + 6) % 12, date.getDate());
}

// The planting window for an item, expressed in the user's local calendar.
export function localPlantMonths(item) {
  if (!Array.isArray(item?.plantMonths)) return [];
  if (!isSouthernHemisphere()) return item.plantMonths;
  return item.plantMonths.map(flipMonth).sort((a, b) => a - b);
}

export function normalizeType(type, name = "") {
  const value = String(type || "").trim();
  if (value === "Vegetable") return "Vegetables";
  if (value === "Fruit Tree") return "Tree Fruits";
  if (value === "Berry") return "Berries";
  if (value === "Herb") return "Herbs";
  if (value === "Fruit") return "Tropical Fruits";
  if (value === "Flower") return "Flowers";
  if (value === "Houseplant") return "Houseplants";
  if (value === "Grain") return "Grains";
  if (value === "Nut") return "Nuts";
  if (PLANT_TYPES.includes(value)) return value;
  const lower = String(name).toLowerCase();
  if (["apple","pear","peach","plum","cherry","fig","orange","lemon","lime","mandarin","grapefruit","pomegranate"].some((w) => lower.includes(w))) return "Tree Fruits";
  if (["banana","avocado","honeydew","watermelon"].some((w) => lower.includes(w))) return "Tropical Fruits";
  if (["berry","strawberry","blueberry","currant","grape"].some((w) => lower.includes(w))) return "Berries";
  if (["basil","mint","cilantro","parsley","oregano","thyme","rosemary"].some((w) => lower.includes(w))) return "Herbs";
  return "Vegetables";
}

export function matchesType(item, selectedType) {
  if (selectedType === "All") return true;
  return normalizeType(item.type, item.name) === selectedType;
}

// Flowers & houseplants are grown for looks, not food — used to suppress the
// harvest/crop-timeline UI that only makes sense for edibles.
export function isOrnamental(item) {
  const t = normalizeType(item?.type, item?.name);
  return t === "Flowers" || t === "Houseplants";
}

// Classic companion flowers stay welcome in any bed — they're grown for pest
// control and pollinators, not just looks, and they're members of the veggie
// combos. Everything else in the Flowers category is decorative.
export const COMPANION_FLOWERS = new Set(["Marigold", "Nasturtium", "Calendula", "Sunflower", "Borage"]);

// A "flower-bed plant" is anything that belongs in the Flowers & Home garden
// rather than an edible garden bed: ornamental flowers AND houseplants. Grouping
// them lets the Flowers tab own everything decorative/indoor while the Garden tab
// stays strictly edible.
export function isFlowerBedPlant(plantName) {
  const name = typeof plantName === "string" ? plantName : plantName?.name;
  if (!name) return false;
  const item = produceData.find((p) => p.name === name);
  const type = normalizeType(item?.type, name);
  return type === "Flowers" || type === "Houseplants";
}

// Enforces the two-garden rule when placing a plant into a bed:
//   • a flower bed (kind "flower", on the Flowers & Home tab) holds only
//     flowers and houseplants
//   • every garden bed (on the Garden tab) holds only edibles
// The two are kept fully separate — a flower/houseplant can't go in a garden bed
// and an edible can't go in the flower garden.
export function canPlantInArea(plantName, area) {
  const name = typeof plantName === "string" ? plantName : plantName?.name;
  if (!name) return false;
  const flowerBedPlant = isFlowerBedPlant(name);
  if (area?.kind === "flower") return flowerBedPlant;
  return !flowerBedPlant;
}

export function zoneMatch(zone, minZone, maxZone) {
  const current = zoneNumber(zone);
  const min = zoneNumber(minZone);
  const max = zoneNumber(maxZone);
  if (current === null || min === null || max === null) return false;
  return current >= min && current <= max;
}

export function getZipRecord(zip) {
  return zipZoneData.find((item) => normalizeZip(item.zipcode) === normalizeZip(zip));
}

export function getCompatiblePlants(zone) {
  return produceData.filter((item) => zoneMatch(zone, item.minZone, item.maxZone));
}

export const COMPANION_PLANTING_DATA = {
  Tomato: {
    excellent: ["Basil", "Onion", "Lettuce", "Carrot", "Marigold"],
    neutral: ["Pepper", "Spinach"],
    avoid: ["Potato", "Corn", "Cabbage", "Fennel", "Beet"],
    pests: "Basil repels tomato hornworms and aphids. Marigolds deter nematodes and whiteflies near tomato roots.",
  },
  Potato: {
    excellent: ["Bean", "Pea", "Horseradish"],
    neutral: ["Corn", "Cabbage"],
    avoid: ["Tomato", "Pumpkin", "Cucumber", "Sunflower", "Raspberry"],
    pests: "Horseradish planted at corners may help repel Colorado potato beetles.",
  },
  Carrot: {
    excellent: ["Tomato", "Onion", "Lettuce", "Rosemary", "Sage"],
    neutral: ["Pepper", "Radish"],
    avoid: ["Dill", "Parsnip", "Beet"],
    pests: "Onions and rosemary may help deter carrot flies when planted nearby.",
  },
  Pepper: {
    excellent: ["Tomato", "Basil", "Onion", "Carrot"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Fennel", "Kohlrabi", "Apricot"],
    pests: "Basil may reduce aphids and spider mites near pepper plants.",
  },
  Onion: {
    excellent: ["Carrot", "Tomato", "Lettuce", "Strawberry", "Beet"],
    neutral: ["Pepper", "Spinach"],
    avoid: ["Bean", "Pea", "Sage", "Asparagus"],
    pests: "Onions naturally deter aphids, carrot flies, and rabbits when planted as a border.",
  },
  Lettuce: {
    excellent: ["Carrot", "Onion", "Strawberry", "Radish", "Cucumber"],
    neutral: ["Spinach", "Beet"],
    avoid: ["Parsley", "Celery", "Broccoli"],
    pests: "Lettuce benefits from shade provided by taller companions in hot climates.",
  },
  Corn: {
    excellent: ["Bean", "Pumpkin", "Squash", "Cucumber"],
    neutral: ["Pea", "Sunflower"],
    avoid: ["Tomato", "Celery", "Beet"],
    pests: "The Three Sisters method — corn, beans, and squash — is one of the most effective companion combinations.",
  },
  Basil: {
    excellent: ["Tomato", "Pepper", "Oregano"],
    neutral: ["Lettuce", "Carrot"],
    avoid: ["Sage", "Thyme", "Fennel", "Cucumber"],
    pests: "Basil repels aphids, whiteflies, and tomato hornworms. Avoid planting near sage as they inhibit each other.",
  },
  Cucumber: {
    excellent: ["Bean", "Pea", "Radish", "Sunflower", "Lettuce"],
    neutral: ["Corn", "Onion"],
    avoid: ["Potato", "Sage", "Basil", "Rosemary"],
    pests: "Radishes planted nearby may deter cucumber beetles effectively.",
  },
  Spinach: {
    excellent: ["Strawberry", "Pea", "Bean", "Celery"],
    neutral: ["Onion", "Lettuce"],
    avoid: ["Potato", "Fennel"],
    pests: "Spinach grows well under taller plants and benefits from light shade in warmer months.",
  },
  Pea: {
    excellent: ["Carrot", "Radish", "Spinach", "Lettuce", "Corn"],
    neutral: ["Bean", "Cucumber"],
    avoid: ["Onion", "Garlic", "Leek", "Potato"],
    pests: "Peas fix nitrogen in the soil which benefits nearby plants after harvest.",
  },
  Bean: {
    excellent: ["Corn", "Pea", "Carrot", "Cucumber", "Strawberry"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Onion", "Garlic", "Fennel", "Beet"],
    pests: "Beans fix nitrogen naturally and improve soil for surrounding plants.",
  },
  Strawberry: {
    excellent: ["Onion", "Lettuce", "Spinach", "Bean", "Borage"],
    neutral: ["Carrot", "Radish"],
    avoid: ["Cabbage", "Broccoli", "Cauliflower", "Fennel"],
    pests: "Borage attracts pollinators and may improve strawberry flavor and yield.",
  },
  Cabbage: {
    excellent: ["Onion", "Celery", "Potato", "Dill"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Strawberry", "Tomato", "Pepper", "Grape"],
    pests: "Dill and celery attract beneficial wasps that prey on cabbage caterpillars.",
  },
  Broccoli: {
    excellent: ["Onion", "Celery", "Potato", "Rosemary"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Tomato", "Strawberry", "Pepper"],
    pests: "Rosemary deters cabbage moths and bean beetles near broccoli plants.",
  },
  Cauliflower: {
    excellent: ["Onion", "Celery", "Bean"],
    neutral: ["Spinach", "Carrot"],
    avoid: ["Tomato", "Strawberry", "Pepper"],
    pests: "Celery may repel white cabbage moths when planted near cauliflower.",
  },
  Garlic: {
    excellent: ["Tomato", "Pepper", "Carrot", "Strawberry", "Rose"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Pea", "Bean", "Asparagus", "Parsley"],
    pests: "Garlic is a natural pest deterrent and may repel aphids, spider mites, and Japanese beetles.",
  },
  Radish: {
    excellent: ["Carrot", "Lettuce", "Cucumber", "Pea", "Spinach"],
    neutral: ["Bean", "Corn"],
    avoid: ["Hyssop", "Grape"],
    pests: "Radishes act as trap crops for flea beetles, drawing them away from other vegetables.",
  },
  Kale: {
    excellent: ["Onion", "Celery", "Potato", "Beet"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Tomato", "Strawberry", "Bean"],
    pests: "Onions and celery planted near kale help deter aphids and cabbage worms.",
  },
  Beet: {
    excellent: ["Onion", "Lettuce", "Cabbage", "Kale"],
    neutral: ["Carrot", "Radish"],
    avoid: ["Bean", "Corn", "Tomato"],
    pests: "Beets and onions are classic companions — they improve each other's growth and flavor.",
  },
  Pumpkin: {
    excellent: ["Corn", "Bean", "Nasturtium"],
    neutral: ["Radish", "Sunflower"],
    avoid: ["Potato", "Beet", "Onion"],
    pests: "Nasturtiums act as trap crops for aphids and attract beneficial predatory insects.",
  },
  Watermelon: {
    excellent: ["Corn", "Sunflower", "Nasturtium"],
    neutral: ["Radish", "Lettuce"],
    avoid: ["Potato", "Cucumber", "Zucchini"],
    pests: "Nasturtiums planted nearby attract aphids away from watermelon vines.",
  },
  Zucchini: {
    excellent: ["Corn", "Bean", "Nasturtium", "Oregano"],
    neutral: ["Radish", "Spinach"],
    avoid: ["Potato", "Watermelon", "Pumpkin"],
    pests: "Oregano planted nearby may deter squash bugs and aphids from zucchini.",
  },
  Eggplant: {
    excellent: ["Basil", "Pepper", "Spinach", "Tarragon"],
    neutral: ["Lettuce", "Onion"],
    avoid: ["Fennel", "Corn"],
    pests: "Basil and tarragon planted near eggplant may repel aphids and flea beetles.",
  },
  Celery: {
    excellent: ["Tomato", "Cabbage", "Onion", "Bean"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Corn", "Potato", "Aster"],
    pests: "Celery attracts beneficial wasps and repels white cabbage moths near brassicas.",
  },
  Rosemary: {
    excellent: ["Carrot", "Bean", "Cabbage", "Sage"],
    neutral: ["Tomato", "Pepper"],
    avoid: ["Basil", "Cucumber", "Pumpkin"],
    pests: "Rosemary deters bean beetles, cabbage moths, and carrot flies naturally.",
  },
  Thyme: {
    excellent: ["Cabbage", "Tomato", "Eggplant", "Strawberry"],
    neutral: ["Pepper", "Carrot"],
    avoid: ["Basil", "Cucumber"],
    pests: "Thyme repels cabbage worms and whiteflies and attracts beneficial pollinators.",
  },
  Mint: {
    excellent: ["Cabbage", "Tomato", "Pea", "Carrot"],
    neutral: ["Lettuce", "Spinach"],
    avoid: ["Parsley", "Chamomile"],
    pests: "Mint deters aphids, ants, and flea beetles but spreads aggressively — grow in containers.",
  },
  Cilantro: {
    excellent: ["Spinach", "Lettuce", "Tomato", "Bean"],
    neutral: ["Carrot", "Pepper"],
    avoid: ["Fennel", "Dill"],
    pests: "Cilantro attracts beneficial insects including lacewings and parasitic wasps.",
  },
  Parsley: {
    excellent: ["Tomato", "Asparagus", "Corn", "Pepper"],
    neutral: ["Carrot", "Onion"],
    avoid: ["Lettuce", "Mint"],
    pests: "Parsley attracts predatory wasps and hoverflies that feed on garden pests.",
  },
  Fennel: {
    excellent: ["Dill"],
    neutral: [],
    avoid: ["Tomato", "Pepper", "Basil", "Carrot", "Bean", "Cucumber", "Pumpkin"],
    pests: "Fennel is allelopathic — it inhibits the growth of most nearby vegetables. Grow it in isolation.",
  },
  Leek: {
    excellent: ["Carrot", "Onion", "Celery"],
    neutral: ["Spinach", "Lettuce"],
    avoid: ["Bean", "Pea", "Broccoli"],
    pests: "Leeks and carrots are classic companions — they deter each other's primary pests.",
  },
  Okra: {
    excellent: ["Pepper", "Eggplant", "Melon", "Sunflower"],
    neutral: ["Cucumber", "Corn"],
    avoid: ["Squash", "Tomato"],
    pests: "Okra and peppers share similar growing conditions and complement each other well.",
  },
  Blueberry: {
    excellent: ["Strawberry", "Thyme", "Basil"],
    neutral: ["Pepper", "Tomato"],
    avoid: ["Fennel", "Garlic", "Pepper"],
    pests: "Thyme planted near blueberries attracts pollinators and may improve berry yield.",
  },
  Raspberry: {
    excellent: ["Marigold", "Garlic", "Tansy"],
    neutral: ["Strawberry", "Bean"],
    avoid: ["Potato", "Tomato", "Blackberry"],
    pests: "Garlic planted nearby deters Japanese beetles and aphids from raspberry canes.",
  },
  Apple: {
    excellent: ["Chive", "Nasturtium", "Marigold"],
    neutral: ["Garlic", "Onion"],
    avoid: ["Potato", "Grass", "Walnut"],
    pests: "Chives planted under apple trees may reduce apple scab and repel aphids.",
  },
  Peach: {
    excellent: ["Garlic", "Tansy", "Basil"],
    neutral: ["Onion", "Marigold"],
    avoid: ["Raspberry", "Tomato", "Potato"],
    pests: "Tansy deters borers and flying insects that commonly damage peach trees.",
  },
  Lemon: {
    excellent: ["Basil", "Lavender", "Marigold"],
    neutral: ["Thyme", "Rosemary"],
    avoid: ["Fennel", "Mint"],
    pests: "Lavender and basil near citrus trees attract beneficial insects and repel aphids.",
  },
  Orange: {
    excellent: ["Basil", "Lavender", "Marigold"],
    neutral: ["Thyme", "Rosemary"],
    avoid: ["Fennel", "Mint"],
    pests: "Marigolds planted around citrus deter nematodes and whiteflies in the root zone.",
  },
};

// ── Flower companion logic ───────────────────────────────────────────────────
// Flowers aren't in COMPANION_PLANTING_DATA (that chart is for edibles). Instead
// we derive "plant together / keep apart" from each flower's real growing needs:
// two blooms that want the SAME light and water are easy neighbors, while opposite
// extremes (full sun next to deep shade, or a drought-lover next to a thirsty one)
// fight over the same bed. This makes the Flower Garden's combos, slot badges, and
// "companions to add" work exactly like the veggie Garden — no per-flower charts.
let _flowerAttrCache = null;
function getFlowerAttrs() {
  if (_flowerAttrCache) return _flowerAttrCache;
  const map = {};
  produceData.forEach((p) => {
    if (!p?.name || normalizeType(p.type, p.name) !== "Flowers") return;
    const det = PLANT_DETAILS[p.name] || {};
    map[p.name] = { sun: det.sunlight || null, water: det.waterNeeds || null };
  });
  _flowerAttrCache = map;
  return map;
}

export function isFlowerName(name) {
  return !!getFlowerAttrs()[name];
}

// full <-> shade is the light extreme that can't share a bed; "partial" bridges both.
function flowerLightConflict(a, b) {
  return (a === "full" && b === "shade") || (a === "shade" && b === "full");
}
// low <-> high is the water extreme that can't share a bed; "medium" bridges both.
function flowerWaterConflict(a, b) {
  return (a === "low" && b === "high") || (a === "high" && b === "low");
}

// Curated flower pairings layered ON TOP of the light/water rules above. These are
// classic, real-world combinations (and genuine cautions) that gardeners rely on —
// a curated pair always wins over the computed default. Each entry is symmetric:
// [flowerA, flowerB, "excellent" | "avoid", reason]. Names must match produceData.
export const FLOWER_COMPANION_PAIRS = [
  // ── Excellent — combinations gardeners actually plant together ──
  ["Rose", "Peony", "excellent", "Roses and peonies are the classic cottage-border duo — same sun and soil, blooming in glorious succession."],
  ["Rose", "Foxglove", "excellent", "Foxglove spires are the traditional underplanting for roses, drawing pollinators up through the canes."],
  ["Rose", "Delphinium", "excellent", "Tall delphinium behind roses is a timeless English border, and their light and water needs match."],
  ["Delphinium", "Foxglove", "excellent", "Two cottage spires that rise together for a layered vertical backdrop."],
  ["Hollyhock", "Delphinium", "excellent", "Back-of-border giants that share full sun and add height without crowding each other."],
  ["Coneflower", "Black-Eyed Susan", "excellent", "The signature prairie pair — tough full-sun natives that bloom for weeks and feed pollinators."],
  ["Coneflower", "Bee Balm", "excellent", "A pollinator magnet combo; both sun-loving natives that draw bees, butterflies, and hummingbirds."],
  ["Black-Eyed Susan", "Coreopsis", "excellent", "Golden meadow natives with identical needs — an easy, long-blooming drift."],
  ["Yarrow", "Coneflower", "excellent", "Drought-tough natives that thrive on neglect and keep pollinators busy all summer."],
  ["Zinnia", "Cosmos", "excellent", "The cutting-garden staple — heat-loving annuals that bloom nonstop for bouquets."],
  ["Zinnia", "Marigold", "excellent", "Bright, easy annuals with the same needs; marigolds add pest resistance to the bed."],
  ["Cosmos", "Sunflower", "excellent", "Airy cosmos softens tall sunflowers, and both are pollinator-friendly full-sun annuals."],
  ["Sunflower", "Zinnia", "excellent", "A cheerful cutting-garden pair — sunflowers tower while zinnias fill in below."],
  ["Marigold", "Nasturtium", "excellent", "Two workhorse companion flowers — together they lure aphids away and deter pests."],
  ["Snapdragon", "Sweet Alyssum", "excellent", "Upright snapdragons with a frothy alyssum skirt — a bedding classic with matching needs."],
  ["Petunia", "Sweet Alyssum", "excellent", "Alyssum spills around petunias and shares their sun and water — a container favorite."],
  ["Pansy", "Viola", "excellent", "Cool-season cousins that thrive in the same conditions for spring and fall color."],
  ["Hosta", "Astilbe", "excellent", "The shade-garden classic — both love moist, shady soil, pairing bold leaves with feathery plumes."],
  ["Hosta", "Impatiens", "excellent", "Impatiens add color at the feet of hostas in the same shady, moist bed."],
  ["Astilbe", "Bleeding Heart", "excellent", "Woodland shade lovers that enjoy the same cool, damp soil."],
  ["Begonia", "Impatiens", "excellent", "Reliable shade bedding partners with identical light and water needs."],
  ["Tulip", "Daffodil", "excellent", "Spring bulbs that naturalize side by side and bloom in the same window."],
  ["Tulip", "Grape Hyacinth", "excellent", "Grape hyacinth is the traditional carpet beneath tulips for a layered spring display."],
  ["Daffodil", "Hyacinth", "excellent", "Fragrant spring bulbs with the same planting depth and timing."],
  ["Crocus", "Snowdrop", "excellent", "The earliest bulbs of the year — perfect naturalized together for late-winter color."],
  ["Lily", "Phlox", "excellent", "Summer-border partners — phlox fills in around lily stems with matching sun and water."],
  ["Dahlia", "Cosmos", "excellent", "Late-summer cutting-garden partners that bloom right up to frost."],
  ["Sweet Pea", "Cornflower", "excellent", "A cottage cutting-garden pair — both cool-season annuals loved for bouquets."],
  // ── Avoid — genuine cautions beyond a simple light/water mismatch ──
  ["Bee Balm", "Phlox", "avoid", "Both are highly prone to powdery mildew; planting them together in still air lets it spread fast. Give each space and airflow instead."],
  ["Hollyhock", "Lavatera", "avoid", "Both are mallows that share hollyhock rust — keep them apart so the fungus doesn't jump between them."],
  ["Hollyhock", "Hibiscus", "avoid", "All mallows trade hollyhock rust readily, so separate beds keep the disease in check."],
  ["Rose", "Morning Glory", "avoid", "Morning glory is a vigorous self-seeding vine that climbs and smothers rose canes while competing for water."],
];

let _flowerOverrideMaps = null;
function getFlowerOverrideMaps() {
  if (_flowerOverrideMaps) return _flowerOverrideMaps;
  const excellent = {}, avoid = {};
  const add = (map, x, y) => { (map[x] = map[x] || new Set()).add(y); };
  FLOWER_COMPANION_PAIRS.forEach(([a, b, type]) => {
    const map = type === "avoid" ? avoid : excellent;
    add(map, a, b); add(map, b, a);
  });
  _flowerOverrideMaps = { excellent, avoid };
  return _flowerOverrideMaps;
}

let _flowerReasonMap = null;
function getFlowerPairReason(a, b) {
  if (!_flowerReasonMap) {
    _flowerReasonMap = {};
    FLOWER_COMPANION_PAIRS.forEach(([x, y, , reason]) => {
      if (reason) _flowerReasonMap[[x, y].map((s) => s.toLowerCase()).sort().join("|")] = reason;
    });
  }
  return _flowerReasonMap[[String(a), String(b)].map((s) => s.toLowerCase()).sort().join("|")] || null;
}

let _flowerCompanionCache = null;
function getFlowerCompanionInfo(name) {
  if (!_flowerCompanionCache) _flowerCompanionCache = {};
  if (_flowerCompanionCache[name]) return _flowerCompanionCache[name];
  const attrs = getFlowerAttrs();
  const self = attrs[name] || {};
  const ov = getFlowerOverrideMaps();
  const exOv = ov.excellent[name];
  const avOv = ov.avoid[name];
  const excellent = [], neutral = [], avoid = [];
  Object.keys(attrs).forEach((other) => {
    if (other === name) return;
    const o = attrs[other];
    // Curated pairings win over the computed light/water default.
    if (avOv && avOv.has(other)) { avoid.push(other); return; }
    if (exOv && exOv.has(other)) { excellent.push(other); return; }
    if (flowerLightConflict(self.sun, o.sun) || flowerWaterConflict(self.water, o.water)) {
      avoid.push(other);
    } else if (self.sun && o.sun && self.sun === o.sun && self.water && o.water && self.water === o.water) {
      excellent.push(other);
    } else {
      neutral.push(other);
    }
  });
  // Surface curated companions first so "companions to add" leads with the classics.
  if (exOv) excellent.sort((x, y) => (exOv.has(x) ? 0 : 1) - (exOv.has(y) ? 0 : 1));
  const info = {
    excellent, neutral, avoid,
    pests: "Group blooms that share the same light and water needs; keep full-sun flowers away from shade-lovers and drought-tolerant flowers away from thirsty ones.",
  };
  _flowerCompanionCache[name] = info;
  return info;
}

export function getCompanionInfo(plantName) {
  // Flowers get their combos computed from light/water needs (see above).
  if (isFlowerName(plantName)) return getFlowerCompanionInfo(plantName);
  const match = Object.keys(COMPANION_PLANTING_DATA).find((name) =>
    String(plantName || "").toLowerCase().includes(name.toLowerCase())
  );
  return COMPANION_PLANTING_DATA[match] || {
    excellent: ["Basil", "Marigold", "Nasturtium"],
    neutral: ["Lettuce", "Spinach"],
    avoid: ["Fennel"],
    pests: "Companion planting can improve pollination, reduce pests, and increase garden health.",
  };
}

export const PAIR_REASONS = {
  "basil|tomato": "Basil repels aphids and hornworms, and many gardeners say it improves tomato flavor.",
  "basil|pepper": "Basil masks the scent peppers give off, helping hide them from aphids and thrips.",
  "basil|oregano": "Both are aromatic herbs with the same water and sun needs — easy neighbors.",
  "carrot|onion": "Onions deter carrot flies, and carrots return the favor against onion flies.",
  "carrot|lettuce": "Lettuce shades the soil and keeps carrot roots cool and moist.",
  "carrot|tomato": "Tomatoes give carrots afternoon shade; carrots loosen the soil around the roots.",
  "onion|lettuce": "Onions keep aphids and rabbits away from tender lettuce leaves.",
  "onion|strawberry": "Onions deter slugs and rabbits that would otherwise go after ripe berries.",
  "onion|beet": "Classic pairing — they improve each other's growth and flavor.",
  "onion|tomato": "Onions repel aphids and spider mites that target tomato foliage.",
  "bean|corn": "Beans climb the corn stalks and fix nitrogen back into the soil — half of the Three Sisters.",
  "corn|squash": "Squash leaves shade the ground, block weeds, and hold soil moisture for the corn.",
  "corn|pumpkin": "Pumpkin vines cover the soil and deter raccoons from getting at the corn.",
  "corn|cucumber": "Corn gives cucumber vines something to climb and provides light shade.",
  "cucumber|radish": "Radishes deter cucumber beetles when planted alongside.",
  "cucumber|lettuce": "Cucumbers grow tall and shade lettuce, keeping it from bolting in the heat.",
  "lettuce|radish": "Radishes break up the soil and are harvested before lettuce needs the room.",
  "lettuce|strawberry": "Both are shallow-rooted, low growers that cover soil without competing.",
  "marigold|tomato": "Marigolds deter nematodes and whiteflies in the tomato root zone.",
  "marigold|pepper": "Marigolds pull aphids away from peppers and attract beneficial insects.",
  "nasturtium|pea": "Nasturtiums attract beneficial insects and pull aphids off the pea vines.",
  "nasturtium|cucumber": "Nasturtiums act as a trap crop for cucumber beetles and squash bugs.",
  "beet|lettuce": "Beets grow down, lettuce grows out — they use different layers of the bed.",
  "pepper|tomato": "Same soil, sun, and water needs, so they're easy to care for side by side.",
  "spinach|strawberry": "Spinach covers the soil between berry plants and keeps weeds down.",
  // Conflicts — worth explaining, not just flagging
  "basil|sage": "Basil and sage inhibit each other's growth — give them separate beds.",
  "basil|cucumber": "Cucumbers can stunt basil, and both compete hard for water.",
  "bean|onion": "Onions release compounds that stunt bean growth.",
  "onion|pea": "Onions suppress pea growth — keep them well apart.",
  "corn|tomato": "They attract the same worm pests and compete heavily for nitrogen.",
  "fennel|tomato": "Fennel inhibits nearly everything around it. Give it its own corner.",
  "broccoli|lettuce": "Broccoli is a heavy feeder that will outcompete lettuce for nutrients.",
"apple|chive": "Chives under apple trees deter aphids and may reduce apple scab.",
  "apple|marigold": "Marigolds near apples repel aphids and draw in beneficial insects.",
  "apple|nasturtium": "Nasturtiums lure aphids and codling moths away from apple trees.",
  "asparagus|parsley": "Parsley attracts predators that protect asparagus from beetles.",
  "basil|blueberry": "Basil's aroma repels thrips and flies that bother blueberries.",
  "basil|eggplant": "Basil masks eggplant's scent from flea beetles and aphids.",
  "basil|lemon": "Basil repels aphids and mites that trouble potted lemon trees.",
  "basil|orange": "Basil's scent deters aphids and mites around citrus.",
  "basil|peach": "Basil repels aphids and helps protect peach foliage from pests.",
  "bean|carrot": "Beans fix nitrogen for the carrots while their roots work different depths.",
  "bean|cauliflower": "Beans enrich the soil with nitrogen that heavy-feeding cauliflower needs.",
  "bean|celery": "Beans feed nitrogen to the soil while celery shades their roots.",
  "bean|cilantro": "Cilantro's flowers attract predators of the aphids that target beans.",
  "bean|cucumber": "Beans fix nitrogen in the soil that hungry cucumbers draw from.",
  "bean|pea": "Both fix their own nitrogen, so they share a bed without competing for it.",
  "bean|potato": "Beans add nitrogen and help deter the Colorado potato beetle.",
  "bean|pumpkin": "A three-sisters pairing — beans feed the soil pumpkins sprawl across.",
  "bean|rosemary": "Rosemary's scent repels the bean beetle from the row.",
  "bean|spinach": "Beans give spinach nitrogen; spinach shades the soil to hold moisture.",
  "bean|strawberry": "Beans enrich the bed while strawberries cover and cool the soil.",
  "bean|zucchini": "Beans fix nitrogen that feeds zucchini's heavy appetite.",
  "beet|cabbage": "Beets and cabbage feed at different depths, so they don't compete.",
  "beet|kale": "Beets loosen the soil below while kale shades it above.",
  "beet|onion": "Onions deter pests while beets and onions root at different depths.",
  "blueberry|strawberry": "Both love acidic soil and cover the ground without competing.",
  "blueberry|thyme": "Thyme covers soil around blueberries and draws in pollinators.",
  "borage|strawberry": "Borage attracts pollinators and is said to boost strawberry flavor.",
  "broccoli|celery": "Celery's scent helps deter the cabbage moths that target broccoli.",
  "broccoli|onion": "Onions mask broccoli's scent from cabbage worms and aphids.",
  "broccoli|potato": "Both are cool-season crops that share similar timing and care.",
  "broccoli|rosemary": "Rosemary repels the cabbage moths and beetles that attack broccoli.",
  "cabbage|celery": "Celery deters the cabbage white moth from the bed.",
  "cabbage|dill": "Dill attracts wasps that prey on cabbage worms.",
  "cabbage|mint": "Mint's strong scent repels cabbage moths and flea beetles.",
  "cabbage|onion": "Onions mask cabbage's scent from moths and aphids.",
  "cabbage|potato": "Both are cool-season crops with compatible care needs.",
  "cabbage|rosemary": "Rosemary repels cabbage moths and beetles nearby.",
  "cabbage|thyme": "Thyme deters cabbage worms and draws beneficial insects.",
  "carrot|garlic": "Garlic's scent drives off the carrot fly.",
  "carrot|leek": "Leeks repel carrot flies while carrots repel leek moths.",
  "carrot|mint": "Mint masks the carrot scent that attracts carrot flies.",
  "carrot|pea": "Peas enrich the soil with nitrogen while carrots break it up below.",
  "carrot|pepper": "Carrots loosen soil around pepper roots and use different space.",
  "carrot|radish": "Radishes mark the row and loosen soil for slow carrots.",
  "carrot|rosemary": "Rosemary's scent confuses and repels the carrot fly.",
  "carrot|sage": "Sage repels the carrot fly with its strong aroma.",
  "cauliflower|celery": "Celery helps deter the cabbage moths that target cauliflower.",
  "cauliflower|onion": "Onions mask cauliflower's scent from pests.",
  "celery|kale": "Celery's aroma deters the cabbage worms that feed on kale.",
  "celery|leek": "Leeks and celery deter each other's pests and root differently.",
  "celery|onion": "Onions deter aphids while celery uses different bed space.",
  "celery|spinach": "Spinach shades the soil to keep celery's roots cool and moist.",
  "celery|tomato": "Celery grows low beneath tomatoes, using space they don't.",
  "cilantro|lettuce": "Cilantro's flowers attract predators of lettuce aphids.",
  "cilantro|spinach": "Both are cool-season greens that share the same care.",
  "cilantro|tomato": "Cilantro draws in beneficial insects that protect tomatoes.",
  "corn|parsley": "Parsley attracts wasps that prey on corn earworms.",
  "corn|pea": "Peas climb the stalks and leave nitrogen behind for the corn.",
  "corn|watermelon": "Corn gives sprawling watermelon vines light afternoon shade.",
  "corn|zucchini": "A three-sisters pairing — zucchini shades roots while corn stands tall.",
  "cucumber|pea": "Peas fix nitrogen that feeds hungry cucumber vines.",
  "cucumber|sunflower": "Sunflowers give cucumbers a natural trellis and light shade.",
  "dill|fennel": "Both umbel herbs draw the same pollinators and predatory wasps.",
  "eggplant|okra": "Okra shelters eggplant from wind and shares warm-season care.",
  "eggplant|pepper": "Same soil, sun, and water needs make them easy neighbors.",
  "eggplant|spinach": "Spinach shades the soil beneath taller eggplant.",
  "eggplant|tarragon": "Tarragon's scent helps repel pests from eggplant.",
  "eggplant|thyme": "Thyme deters the flea beetles that chew eggplant leaves.",
  "garlic|peach": "Garlic deters borers and aphids around peach trees.",
  "garlic|pepper": "Garlic repels aphids and spider mites from peppers.",
  "garlic|raspberry": "Garlic deters the Japanese beetles and aphids that hit raspberries.",
  "garlic|rose": "Garlic repels aphids and helps fend off black spot on roses.",
  "garlic|strawberry": "Garlic's scent protects strawberries from aphids and mites.",
  "garlic|tomato": "Garlic repels red spider mites and aphids from tomatoes.",
  "horseradish|potato": "Horseradish at the corners deters Colorado potato beetles.",
  "kale|onion": "Onions mask kale's scent from cabbage worms and aphids.",
  "kale|potato": "Both are cool-season crops that tolerate each other well.",
  "lavender|lemon": "Lavender draws pollinators and repels aphids around citrus.",
  "lavender|orange": "Lavender attracts pollinators and deters pests near orange trees.",
  "leek|onion": "Both alliums deter the same pests and share care needs.",
  "lemon|marigold": "Marigolds deter nematodes and whiteflies in the citrus root zone.",
  "lettuce|onion": "Onions deter aphids while lettuce fills the space between.",
  "lettuce|pea": "Peas give nitrogen and light shade to tender lettuce.",
  "lettuce|tomato": "Lettuce covers the soil beneath tomatoes and keeps it cool.",
  "marigold|orange": "Marigolds deter nematodes and whiteflies around citrus roots.",
  "marigold|raspberry": "Marigolds repel nematodes and beetles from raspberry canes.",
  "melon|okra": "Okra gives sprawling melon light shade and wind shelter.",
  "mint|pea": "Mint repels the aphids that would otherwise cluster on pea vines.",
  "mint|tomato": "Mint's scent deters aphids and whiteflies around tomatoes.",
  "nasturtium|pumpkin": "Nasturtiums act as a trap crop for squash bugs and beetles.",
  "nasturtium|watermelon": "Nasturtiums lure aphids and beetles away from melon vines.",
  "nasturtium|zucchini": "Nasturtiums draw squash bugs away from zucchini as a trap crop.",
  "okra|pepper": "Both love heat and shelter each other from wind.",
  "okra|sunflower": "Okra and sunflowers stand tall together and draw in pollinators.",
  "onion|pepper": "Onions deter aphids and share peppers' steady watering rhythm.",
  "oregano|zucchini": "Oregano repels squash bugs and aphids from zucchini.",
  "parsley|pepper": "Parsley attracts the predatory insects that protect peppers.",
  "parsley|tomato": "Parsley draws in hoverflies and wasps that guard tomatoes.",
  "peach|tansy": "Tansy repels borers and flying insects from peach trees.",
  "pea|potato": "Peas fix nitrogen that feeds the developing potato tubers.",
  "pea|radish": "Radishes loosen soil and mark rows for climbing peas.",
  "pea|spinach": "Peas give nitrogen and light shade to leafy spinach.",
  "radish|spinach": "Radishes break up the soil while spinach shades it above.",
  "raspberry|tansy": "Tansy repels beetles and ants from raspberry canes.",
  "rosemary|sage": "Both Mediterranean herbs share dry soil and repel pests.",
  "strawberry|thyme": "Thyme covers soil around strawberries and deters worms.",
  "sunflower|watermelon": "Sunflowers give melon vines a trellis and light shade.",
  "thyme|tomato": "Thyme's scent deters worms and draws pollinators to tomatoes.",
};

const SUN_WORDS = { full: "full sun", partial: "part shade", shade: "shade" };
export function getPairReason(a, b) {
  const key = [String(a || ""), String(b || "")]
    .map((s) => s.trim().toLowerCase())
    .sort()
    .join("|");
  if (PAIR_REASONS[key]) return PAIR_REASONS[key];
  // Flower-to-flower pairs explain themselves through light and water needs.
  if (isFlowerName(a) && isFlowerName(b)) {
    // A curated pairing's own wording wins.
    const curated = getFlowerPairReason(a, b);
    if (curated) return curated;
    const attrs = getFlowerAttrs();
    const A = attrs[a], B = attrs[b];
    if (flowerLightConflict(A.sun, B.sun)) return `${a} wants ${SUN_WORDS[A.sun] || A.sun} and ${b} wants ${SUN_WORDS[B.sun] || B.sun} — one will struggle in the same spot. Give them separate beds.`;
    if (flowerWaterConflict(A.water, B.water)) return `${a} likes ${A.water} water while ${b} likes ${B.water} — hard to keep both happy in one bed.`;
    if (A.sun && A.sun === B.sun && A.water && A.water === B.water) return `${a} and ${b} share the same light and water needs — easy neighbors in the same bed.`;
    return `${a} and ${b} coexist fine in a mixed flower bed.`;
  }
  const score = getCompatibilityScore(a, b);
  if (score.label === "Excellent Pair") return `${a} and ${b} grow well together and support each other in the same bed.`;
  if (score.label === "Avoid") return `${a} and ${b} compete for nutrients or attract the same pests — try separate beds.`;
  return `${a} and ${b} coexist fine — no known conflict.`;
}

export function findGardenConflicts(gardenAreas) {
  const areas = (gardenAreas || []).filter((a) => a.plots && Object.keys(a.plots).length);

  // Helper: does adding `plantName` to `area` create any "Avoid" pair?
  const wouldConflict = (area, plantName, ignoreSlot) => {
    const neighbors = Object.entries(area.plots || {})
      .filter(([sid, name]) => sid !== ignoreSlot && name && name !== plantName)
      .map(([, name]) => name);
    return Array.from(new Set(neighbors)).some(
      (n) => getCompatibilityScore(plantName, n).label === "Avoid"
    );
  };

  // Helper: an area has a free slot if its plot count is below its capacity.
  // Capacity: use area.size if present, else fall back to current filled count + 1
  // (i.e. we only treat an area as "has room" if it declares a size with space left).
  const freeSlotId = (area) => {
    const filled = Object.entries(area.plots || {}).filter(([, n]) => n);
    const capacity = typeof area.size === "number" ? area.size : filled.length; // no declared size => treat as full
    if (filled.length >= capacity) return null;
    // Find the first slot index (0..capacity-1) not already used.
    const used = new Set(filled.map(([sid]) => sid));
    for (let i = 0; i < capacity; i++) {
      const key = String(i);
      if (!used.has(key)) return key;
    }
    return null;
  };

  const conflicts = [];
  const seenPairs = new Set();

  areas.forEach((area) => {
    const entries = Object.entries(area.plots || {}).filter(([, n]) => n);
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const [slotA, plantA] = entries[i];
        const [slotB, plantB] = entries[j];
        if (getCompatibilityScore(plantA, plantB).label !== "Avoid") continue;

        // De-dupe symmetric pairs within the same area.
        const pairKey = `${area.id}|${[plantA, plantB].sort().join("|")}`;
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        // Try to relocate one of the two plants to another bed with room and no new conflict.
        let suggestion = null;
        for (const mover of [
          { slot: slotA, plant: plantA, stays: plantB },
          { slot: slotB, plant: plantB, stays: plantA },
        ]) {
          const target = areas.find(
            (dest) =>
              dest.id !== area.id &&
              freeSlotId(dest) !== null &&
              !wouldConflict(dest, mover.plant, null)
          );
          if (target) {
            suggestion = {
              move: mover.plant,
              fromAreaId: area.id,
              fromAreaName: area.name,
              fromSlot: mover.slot,
              toAreaId: target.id,
              toAreaName: target.name,
              toSlot: freeSlotId(target),
              stays: mover.stays,
            };
            break;
          }
        }

        conflicts.push({
          areaId: area.id,
          areaName: area.name,
          plantA,
          plantB,
          suggestion, // may be null if no clean destination exists
        });
      }
    }
  });

  return conflicts;
}

export function getCompatibilityScore(plantName, comparePlant) {
  const info = getCompanionInfo(plantName);
  if (info.excellent.some((item) => item.toLowerCase() === comparePlant.toLowerCase())) return { label: "Excellent Pair", color: "#5cff89", icon: "🟢" };
  if (info.avoid.some((item) => item.toLowerCase() === comparePlant.toLowerCase())) return { label: "Avoid", color: "#ff7b7b", icon: "🔴" };
  return { label: "Neutral", color: "#ffd86b", icon: "🟡" };
}

export function calculateGardenHealth(gardenMap) {
  const plants = Object.values(gardenMap || {}).filter(Boolean);
  if (!plants.length) return { score: 0, label: "No plants yet" };
  let score = 100;
  plants.forEach((plant) => {
    plants.forEach((compare) => {
      if (plant === compare) return;
      const compatibility = getCompatibilityScore(plant, compare);
      if (compatibility.label === "Avoid") score -= 8;
      if (compatibility.label === "Excellent Pair") score += 3;
    });
  });
  score = Math.max(35, Math.min(100, score));
  let label = "Healthy";
  if (score < 60) label = "Needs improvement";
  else if (score < 80) label = "Moderate";
  return { score, label };
}

export function getSuggestionsForMonth(zone, month) {
  const zonePlants = produceData.filter((item) => {
    if (!item?.name) return false;
    const months = localPlantMonths(item);
    return zoneMatch(zone, item.minZone, item.maxZone) && months.includes(month);
  });
  return zonePlants.sort((a, b) => a.name.localeCompare(b.name));
}

export function getFirstPlantingMonth(item) {
  const months = localPlantMonths(item);
  if (!months.length) return null;
  return [...months].sort((a, b) => a - b)[0] || null;
}

export function getPlantingWindowText(item) {
  const months = localPlantMonths(item);
  if (!months.length) {
    return "Best months vary by zone. Use the Planting Calendar above for seasonal timing.";
  }
  return months.map((month) => MONTH_LABELS[month - 1]?.slice(0, 3)).filter(Boolean).join(" • ");
}

export function getPlantSeasonLabel(item, zone, monthOverride = null) {
  if (!zoneMatch(zone, item.minZone, item.maxZone)) return "Outside your zone";
  const currentMonth = monthOverride || new Date().getMonth() + 1;
  const plantMonths = localPlantMonths(item);
  if (!plantMonths.length) return "Zone fit";
  if (plantMonths.includes(currentMonth)) return "Plant now";
  const firstMonth = getFirstPlantingMonth(item);
  if (firstMonth && firstMonth > currentMonth) return `Starts in ${MONTH_NAMES[firstMonth - 1]}`;
  return "Out of season";
}

export const PERENNIALS = new Set([
  "Ivy Gourd (Tindora)",
  "Garlic Chives",
  "Bamboo Shoot",
  "Nopal (Cactus Pad)",
  "Plantain",
  "Cherimoya",
  "Sapodilla (Chikoo)",
  "Mamey Sapote",
  "Jujube",
  "Tamarillo (Tree Tomato)",
  "Naranjilla (Lulo)",
  "Acerola",
  "Surinam Cherry",
  "Bilimbi",
  "Bael (Wood Apple)",
  "Jamun (Java Plum)",
  "Mamoncillo (Genip)",
  "Pawpaw (American)",
  "Serviceberry",
  "Jostaberry",
  "Loganberry",
  "Hardy Kiwi (Kiwiberry)",
  "Concord Grape",
  "Cornelian Cherry",
  "Medlar",
  "Sweet Lime (Mosambi)",
  "Ugli Fruit",
  "Sea Grape",
  "Gac Fruit",
  "Noni",
  "Cupuaçu",
  "Abiu",
  "Rollinia",
  "Chempedak",
  "Marang",
  "Pulasan",
  "Che (Melonberry)",
  "Cardamom",
  "Vanilla",
  "Saffron",
  "Galangal",
  "Kaffir Lime",
  "Lemon Verbena",
  "Pandan",
  "Sichuan Pepper",
  "Cinnamon",
  "Clove",
  "Nutmeg",
  "Allspice",
  "Comfrey",
  "Valerian",
  "Gotu Kola",
  "Rue",
  "Hyssop",
  "Angelica",
  "Feverfew",
  "Wormwood",
  "Curry Plant",
  "Brazil Nut",
  "Pine Nut",
  "Ginkgo",
  "Carob",
  "Kola Nut",
  "Black Walnut",
  "Ackee",
  "Almond",
  "Atemoya",
  "Bay Tree",
  "Bilberry",
  "Black Currant",
  "Black Sapote",
  "Thornless Boysenberry",
  "Breadfruit",
  "Buddha's Hand",
  "Calamondin",
  "Canistel",
  "Cashew",
  "Chestnut",
  "Cloudberry",
  "Curry Leaf",
  "Custard Apple",
  "Dewberry",
  "Durian",
  "Black Elderberry",
  "Finger Lime",
  "Honeyberry (Haskap)",
  "Hazelnut",
  "Jabuticaba",
  "June Plum",
  "Key Lime",
  "Lemon Balm",
  "Longkong (Langsat)",
  "Macadamia",
  "Mangosteen",
  "Meyer Lemon",
  "Miracle Fruit",
  "Drumstick Tree (Moringa)",
  "Red Mulberry",
  "White Mulberry",
  "Pecan",
  "Peppermint",
  "Pistachio",
  "Pomelo",
  "Red Currant",
  "Rose Apple",
  "Santol",
  "Sea Buckthorn",
  "Salak (Snake Fruit)",
  "Soursop",
  "Spearmint",
  "Star Apple",
  "Sudachi",
  "Sugar Apple",
  "Vietnamese Coriander",
  "Walnut",
  "Wax Apple",
  "White Currant",
  "White Sapote",
  "Wineberry",
  "Winter Savory",
  "apple","apricot","avocado","banana","cherry","fig","mango","peach","pear",
  "plum","pluot","nectarine","pomegranate","persimmon","quince","olive","date",
  "coconut","jackfruit","guava","papaya","dragonfruit","starfruit","passionfruit",
  "feijoa","loquat","longan","lychee","rambutan","tamarind","kiwi","pineapple",
  "grapes","lemon","lemons","lime","orange","mandarin","tangerine","clementine",
  "grapefruit","kumquat","bloodorange","yuzu","bergamot","calamansi",
  "blueberry","blackberry","raspberry","boysenberry","marionberry","mulberry",
  "cranberry","currant","gooseberry","elderberry","serviceberry","gojiberry",
  "aronia","barberry","huckleberry","lingonberry","salmonberry","capegooseberry",
  "rhubarb",
  "lemon_tree_variant","orange_tree_variant","kumquattree","mulberrytree",
]);

export function isPerennial(item) {
  const raw = String(item?.name || "").toLowerCase().replace(/\s+/g, "");
  return PERENNIALS.has(raw);
}

export const harvestDays = {
  "Snow Pea": 60,
  "Yardlong Bean": 75,
  "Winged Bean": 100,
  "Cluster Bean (Guar)": 90,
  "Pointed Gourd (Parwal)": 120,
  "Broccoli Rabe (Rapini)": 45,
  "Broccolini": 60,
  "Choy Sum": 45,
  "Yu Choy": 45,
  "Molokhia (Jute Mallow)": 60,
  "Roselle": 120,
  "Chinese Celery": 70,
  "Samphire (Sea Bean)": 60,
  "Dandelion Greens": 55,
  "Sugar Beet": 90,
  "Carolina Reaper": 100,
  "Bird's Eye Chili": 90,
  "Padrón Pepper": 75,
  "Fresno Pepper": 80,
  "Hungarian Wax": 70,
  "Ají Amarillo": 100,
  "Fenugreek (Methi)": 40,
  "Ashwagandha": 180,
  "Spelt": 120,
  "Teff": 100,
  "Farro (Emmer)": 120,
  "Wild Rice": 110,
  "Triticale": 240,
  "Job's Tears": 120,
  "Popcorn": 100,
  "Peanut": 130,
  "Soybean": 100,
  "Adzuki Bean": 100,
  "Amaranth": 50,
  "Anaheim Pepper": 80,
  "Arrowroot": 300,
  "Ash Gourd": 120,
  "Barley": 90,
  "Beefsteak Tomato": 85,
  "Black-Eyed Pea": 90,
  "Bottle Gourd": 120,
  "Buckwheat": 75,
  "Cannellini Bean": 90,
  "Cardoon": 120,
  "Cassava": 300,
  "Celtuce": 80,
  "Chayote": 120,
  "Cherry Tomato": 65,
  "Chinese Yam": 180,
  "Cowpea": 80,
  "Cubanelle Pepper": 70,
  "Culantro": 70,
  "Epazote": 60,
  "Chinese Broccoli (Gai Lan)": 60,
  "Heirloom Tomato": 80,
  "Water Spinach (Kangkong)": 50,
  "Kidney Bean": 100,
  "Komatsuna": 40,
  "Lotus Root": 120,
  "Lupini Bean": 100,
  "Malabar Spinach": 55,
  "Millet": 75,
  "Mizuna": 40,
  "Mung Bean": 90,
  "Mustard Spinach": 40,
  "Navy Bean": 100,
  "New Zealand Spinach": 55,
  "Oats": 100,
  "Red Okra": 55,
  "Pigeon Pea": 120,
  "Pimento Pepper": 75,
  "Purslane": 40,
  "Quinoa": 100,
  "Rice": 120,
  "Ridge Gourd": 90,
  "Romanesco": 90,
  "Roma Tomato": 75,
  "Rye": 240,
  "San Marzano Tomato": 80,
  "Scotch Bonnet Pepper": 100,
  "Shishito Pepper": 60,
  "Shiso": 60,
  "Snake Gourd": 90,
  "Sorghum": 110,
  "Taro": 200,
  "Tatsoi": 45,
  "Thai Chili Pepper": 90,
  "Holy Basil (Tulsi)": 60,
  "Wasabi": 540,
  "Water Chestnut": 220,
  "Wheat": 120,
  "Yam": 180,
    Basil: 60,
    Beet: 55,
    Bok_Choy: 45,
    Broccoli: 80,
    Cabbage: 90,
    Carrot: 70,
    Cauliflower: 85,
    Corn: 90,
    Cucumber: 60,
    Eggplant: 80,
    Fennel: 90,
    Garlic: 240,
    Green_Bean: 55,
    Kale: 60,
    Leek: 120,
    Lettuce: 45,
    Parsley: 75,
    Pea: 65,
    Pepper: 80,
    Potato: 100,
    Pumpkin: 110,
    Radish: 30,
    Rosemary: 90,
    Spinach: 45,
    Strawberry: 90,
    Tomato: 75,
    Arugula: 40,
    Asparagus: 730,
    Bell_Pepper: 75,
    Black_Bean: 95,
    Bok_Choy: 50,
    Brussels_Sprouts: 100,
    Butternut_Squash: 110,
    Acorn_Squash: 95,
    Yellow_Squash: 55,
    Zucchini: 55,
    Spaghetti_Squash: 100,
    Cilantro: 50,
    Collard_Greens: 65,
    Mustard_Greens: 45,
    Celery: 120,
    Chard: 55,
    Swiss_Chard: 55,
    Chickpea: 100,
    Dill: 60,
    Edamame: 90,
    Endive: 90,
    Fava_Bean: 85,
    Habanero: 100,
    Jalapeno: 75,
    Serrano: 80,
    Poblano: 75,
    Cayenne: 80,
    Banana_Pepper: 70,
    Kohlrabi: 55,
    Leek: 120,
    Lentil: 100,
    Lima_Bean: 75,
    Napa_Cabbage: 70,
    Okra: 55,
    Onion: 100,
    Oregano: 80,
    Parsnip: 120,
    Pinto_Bean: 95,
    Radicchio: 65,
    Romaine: 70,
    Rutabaga: 90,
    Sage: 75,
    Scallion: 60,
    Shallot: 100,
    Snap_Pea: 60,
    Sorrel: 60,
    Sweet_Potato: 100,
    Thyme: 80,
    Tomatillo: 75,
    Turnip: 50,
    Watermelon: 85,
    Cantaloupe: 80,
    Honeydew: 85,
    Mint: 70,
    Chives: 80,
    Cilantro: 50,
    Marigold: 50,
    Nasturtium: 50,
    Sunflower: 90,
    Pumpkin: 110,
    Green_Bean: 55,
    Snap_Pea: 60,
    Black_Bean: 95,
    Pinto_Bean: 95,
    Lima_Bean: 75,
    Fava_Bean: 85,
    Brussels_Sprouts: 100,
    Collard_Greens: 60,
    Mustard_Greens: 45,
    Napa_Cabbage: 70,
    Watercress: 55,
    Escarole: 85,
    Sweet_Potato: 100,
    Horseradish: 140,
    Rhubarb: 120,
    Daikon: 60,
    Salsify: 120,
    Jicama: 150,
    Celeriac: 110,
    Jerusalem_Artichoke: 130,
    Artichoke: 100,
    Ginger: 240,
    Turmeric: 240,
    Yellow_Squash: 55,
    Acorn_Squash: 95,
    Butternut_Squash: 110,
    Spaghetti_Squash: 100,
    Delicata_Squash: 100,
    Pattypan_Squash: 55,
    Kabocha_Squash: 95,
    Gourd: 120,
    Luffa: 150,
    Bitter_Melon: 80,
    Winter_Melon: 100,
    Casaba_Melon: 110,
    Crenshaw_Melon: 110,
    Galia_Melon: 90,
    Bell_Pepper: 75,
    Banana_Pepper: 70,
    Ghost_Pepper: 120,
    Cape_Gooseberry: 100,
    Bay_Laurel: 90,
    Lavender: 90,
    Lemongrass: 100,
    Marjoram: 80,
    Tarragon: 80,
    Anise: 120,
    Borage: 55,
    Chervil: 60,
    Chamomile: 65,
    Catnip: 85,
    Stevia: 90,
    Summer_Savory: 60,
    Lovage: 90,
  };

// Authored structured growing data (data/plantDetails.js), rolled out in batches
// of 100 plants. Returns the record for a plant by exact name, or null if this
// plant hasn't been authored yet — callers fall back to their derived defaults.
export function getPlantDetails(item) {
  const name = typeof item === "string" ? item : item?.name;
  if (!name) return null;
  return PLANT_DETAILS[name] || null;
}

// Authored pest & disease profile (data/plantHealth.js), rolled out in batches.
// Returns null for plants not yet authored — the UI hides the section for those.
export function getPlantHealth(item) {
  const name = typeof item === "string" ? item : item?.name;
  if (!name) return null;
  return PLANT_HEALTH[name] || null;
}

export function getHarvestCountdown(item) {
  const ornType = normalizeType(item?.type, item?.name);
  if (ornType === "Flowers") return "Blooms seasonally";
  if (ornType === "Houseplants") return "Grown for foliage";
  const authored = getPlantDetails(item);
  if (authored) {
    // Authored plants with a real maturity window (incl. perennial herbs that
    // still crop the first season) show a day count; trees/berries carry
    // daysToMaturity: null and fall through to the seasonal label.
    if (authored.daysToMaturity) return `~${authored.daysToMaturity} day harvest`;
    if (authored.perennial) return "Perennial — harvests seasonally";
  }
  if (isPerennial(item)) return "Perennial — harvests seasonally";
  const key = String(item?.name || "").replace(/\s+/g, "_");
  const days = harvestDays[key] || harvestDays[item?.name] || 75;
  return `~${days} day harvest`;
}

export function getHarvestDays(item) {
  const authored = getPlantDetails(item);
  if (authored && authored.daysToMaturity) return authored.daysToMaturity;
  const key = String(item?.name || "").replace(/\s+/g, "_");
  return harvestDays[key] || harvestDays[item?.name] || 75;
}

export const FERTILIZER_DAYS = {
  Tomato: 14, Pepper: 14, Bell_Pepper: 14, Corn: 14, Cabbage: 14,
  Broccoli: 14, Cauliflower: 14, Eggplant: 14, Pumpkin: 14,
  Zucchini: 14, Yellow_Squash: 14, Butternut_Squash: 14, Acorn_Squash: 14,
  Cucumber: 14, Watermelon: 14, Cantaloupe: 14, Honeydew: 14, Okra: 14,
  Brussels_Sprouts: 14, Kale: 21, Collard_Greens: 21, Celery: 14,
  Lettuce: 21, Spinach: 21, Chard: 21, Swiss_Chard: 21, Arugula: 21,
  Bok_Choy: 21, Romaine: 21, Beet: 21, Carrot: 30, Radish: 30,
  Turnip: 30, Parsnip: 30, Potato: 21, Sweet_Potato: 30, Onion: 21,
  Leek: 21, Garlic: 30, Strawberry: 21,
  Basil: 30, Parsley: 30, Cilantro: 30, Dill: 30, Oregano: 45,
  Thyme: 45, Sage: 45, Rosemary: 45, Mint: 30, Chives: 30, Marigold: 30,
  Green_Bean: 45, Pea: 45, Snap_Pea: 45, Edamame: 45, Lima_Bean: 45,
  Fava_Bean: 45, Chickpea: 45, Lentil: 45, Black_Bean: 45, Pinto_Bean: 45,
};

export function getFertilizerDays(plantName) {
  const key = String(plantName || "").replace(/\s+/g, "_");
  return FERTILIZER_DAYS[key] || FERTILIZER_DAYS[plantName] || 21;
}

export function getPlantDifficulty(item) {
  const type = normalizeType(item.type, item.name);
  const name = String(item.name || "").toLowerCase();
  if (type === "Herbs" || ["lettuce","radish","spinach","kale","green bean"].some((w) => name.includes(w))) return { label: "Easy", icon: "🟢", text: "Beginner friendly" };
  if (type === "Tree Fruits" || type === "Tropical Fruits" || ["garlic","pumpkin","watermelon","pomegranate","avocado"].some((w) => name.includes(w))) return { label: "Hard", icon: "🔴", text: "Needs more care" };
  return { label: "Medium", icon: "🟡", text: "Moderate care" };
}

export function getPlantSunNeed(item) {
  const type = normalizeType(item?.type, item?.name);
  const name = String(item?.name || "").toLowerCase();

  // Prefer authored sunlight when this plant has structured data.
  const authored = getPlantDetails(item);
  if (authored && authored.sunlight) {
    if (authored.sunlight === "shade") return { need: "shade", label: "Shade tolerant", toleratesShade: true };
    if (authored.sunlight === "partial") return { need: "partial", label: "Partial shade OK", toleratesShade: true };
    return { need: "full", label: "Full sun", toleratesShade: false };
  }

  // Leafy greens and some herbs tolerate — and in summer heat prefer — some shade.
  if (["lettuce", "spinach", "kale", "arugula", "chard", "cilantro", "parsley", "mint"].some((w) => name.includes(w))) {
    return { need: "partial", label: "Partial shade OK", toleratesShade: true };
  }
  if (type === "Herbs") {
    return { need: "partial", label: "Full sun to partial", toleratesShade: true };
  }
  // Fruiting crops and trees want full sun to produce.
  return { need: "full", label: "Full sun", toleratesShade: false };
}

export function getSunMismatch(item, areaSun) {
  const sun = areaSun || "full";
  const { need, toleratesShade } = getPlantSunNeed(item);
  const name = item?.name || "This plant";

  if (sun === "shade" && need === "full") {
    return { level: "high", text: `${name} needs full sun to fruit — a shade bed will give weak, leggy growth and little harvest.` };
  }
  if (sun === "partial" && need === "full") {
    return { level: "medium", text: `${name} prefers full sun. In partial shade expect slower growth and a lighter harvest.` };
  }
  if (sun === "full" && need === "partial" && !toleratesShade) {
    return { level: "low", text: `${name} can take full sun, but watch for stress on the hottest afternoons.` };
  }
  // Leafy greens in full sun during summer heat bolt fast — worth a gentle flag.
  if (sun === "full" && toleratesShade) {
    return { level: "low", text: `${name} does fine in full sun, but in peak summer heat it may bolt — some afternoon shade helps.` };
  }
  return null; // good match, no warning
}

// Inches → a friendly spacing string; feet once the gap gets big (trees/shrubs).
function formatSpacingInches(inches) {
  if (typeof inches !== "number") return null;
  if (inches >= 48) {
    const ft = inches / 12;
    return `${Number.isInteger(ft) ? ft : ft.toFixed(1)} ft apart`;
  }
  return `${inches}" apart`;
}

export function getPlantQuickFacts(item) {
  const type = normalizeType(item.type, item.name);
  const difficulty = getPlantDifficulty(item);
  // Prefer the authored plantDetails record; fall back to type-based defaults
  // for any plant that hasn't been authored yet.
  const d = getPlantDetails(item);

  const sun = d && d.sunlight
    ? (d.sunlight === "full" ? "Full sun" : d.sunlight === "partial" ? "Full sun to partial shade" : "Shade / low light")
    : (type === "Herbs" ? "Full sun to partial shade" : "Full sun");

  const water = d && d.waterNeeds
    ? (d.waterNeeds === "low" ? "Low — let the soil dry out" : d.waterNeeds === "high" ? "High — keep evenly moist" : "Moderate — water when the top inch is dry")
    : "Water when the top inch of soil is dry";

  const spacing = (d && formatSpacingInches(d.spacingInches))
    || (type === "Tree Fruits" ? "10–20 ft apart" : type === "Berries" ? "2–4 ft apart" : type === "Herbs" ? "8–18 in apart" : "12–24 in apart");

  return {
    sun,
    water,
    soil: type === "Tree Fruits" || type === "Tropical Fruits" ? "Deep, well-draining soil" : "Loose, compost-rich soil",
    spacing,
    harvest: getHarvestCountdown(item),
    difficulty: `${difficulty.icon} ${difficulty.label}`,
    containerFriendly: d ? d.containerFriendly : null,
    perennial: d ? d.perennial : null,
  };
}

export function getSeasonalIntelligenceLabel(item, zone, weather) {
  const currentMonth = new Date().getMonth() + 1;
  const months = localPlantMonths(item);
  if (!zoneMatch(zone, item.minZone, item.maxZone)) return { icon: "📍", label: "Outside your zone", text: "This plant may need containers, shade, or protection in your area." };
  if (!months.length) return { icon: "🌿", label: "Zone fit", text: "Season timing varies, but this plant matches your growing zone." };
  if (months.includes(currentMonth)) {
    if (weather?.maxTempF >= 98) return { icon: "🔥", label: "Plant early morning", text: "It is in season, but heat is high. Plant early and water deeply." };
    return { icon: "✅", label: "Perfect planting week", text: "This is a strong time to plant it in your zone." };
  }
  const nextMonth = months.find((month) => month > currentMonth);
  if (nextMonth) return { icon: "🌱", label: "Start indoors soon", text: `Outdoor planting begins around ${MONTH_NAMES[nextMonth - 1]}.` };
  return { icon: "⏳", label: "Too late to plant", text: "Its main planting window has passed. Save it for next season." };
}

export const RAIN_SKIP_THRESHOLD = 65;

export function getRainSkipToday(weather) {
  // Rain-skip disabled — the daily watering reminder always fires at the set time.
  return null;
}

export const FROST_THRESHOLD_F = 35;
export const HEAT_THRESHOLD_F = 95;

export function getUpcomingFrost(weather) {
  const forecast = Array.isArray(weather?.forecast) ? weather.forecast : [];
  for (let i = 0; i < forecast.length; i += 1) {
    const day = forecast[i];
    if (typeof day?.minTempF === "number" && day.minTempF <= FROST_THRESHOLD_F) {
      return { date: day.date, minTempF: day.minTempF, daysOut: i };
    }
  }
  return null;
}

// ── Home-screen widgets / Live Activities / Watch ────────────────────────────
// A tiny, JSON-serialisable snapshot of "what needs my attention today", derived
// entirely from existing garden state. The native widget extension reads this
// from the shared app group; nothing here is AI or network. Keep it small — a
// widget shows a glance, not a screen.
export function buildWidgetSnapshot({
  savedPlantObjs = [], wateredPlants = {}, wateringHistory = {},
  weather = null, harvestTrackers = {}, streakData = null, plantPick = null, zone = null,
} = {}) {
  const today = getTodayKey();

  // Plants due for water today (not yet watered).
  const dueNames = [];
  (savedPlantObjs || []).forEach((p) => {
    if (!p || !p.name || wateredPlants[p.name] === today) return;
    const nw = getNextWaterInfo(p.name, p, wateringHistory, wateredPlants, weather);
    if (nw && nw.urgency === "due") dueNames.push(p.name);
  });

  // Plants whose harvest tracker has reached (or passed) its window.
  const harvestNames = [];
  Object.entries(harvestTrackers || {}).forEach(([name, tracker]) => {
    if (!tracker || typeof tracker.days !== "number" || !tracker.startedAt) return;
    const elapsed = Math.floor((Date.now() - new Date(tracker.startedAt).getTime()) / 86400000);
    if (tracker.days - elapsed <= 0) harvestNames.push(name);
  });

  const frost = getUpcomingFrost(weather);
  const todayHigh = typeof weather?.maxTempF === "number" ? weather.maxTempF : null;

  return {
    updatedAt: Date.now(),
    zone: zone || null,
    waterDue: { count: dueNames.length, names: dueNames.slice(0, 3) },
    harvestReady: { count: harvestNames.length, names: harvestNames.slice(0, 3) },
    frost: frost ? { daysOut: frost.daysOut, minTempF: Math.round(frost.minTempF), date: frost.date } : null,
    heat: todayHigh != null && todayHigh >= HEAT_THRESHOLD_F ? { maxTempF: Math.round(todayHigh) } : null,
    streak: streakData && typeof streakData.count === "number" ? streakData.count : 0,
    plantPick: plantPick && plantPick.name ? { name: plantPick.name, image: plantPick.image || null } : null,
  };
}

export function getFrostSeasonMonths(zone) {
  const bucket = getClimateBucket(zone);
  let months;
  if (bucket === "cold") months = [1, 2, 3, 4, 5, 9, 10, 11, 12];
  else if (bucket === "moderate") months = [1, 2, 3, 11, 12];
  else months = [12, 1, 2];
  return months.map(flipMonth).sort((a, b) => a - b);
}

export function getEstimatedLastFrost(zone) {
  const bucket = getClimateBucket(zone);
  if (!isSouthernHemisphere()) {
    if (bucket === "cold") return "late May";
    if (bucket === "moderate") return "mid March";
    return "late January";
  }
  if (bucket === "cold") return "late November";
  if (bucket === "moderate") return "mid September";
  return "late July";
}

export const frostOverrideRef = { current: {} };

export function setFrostOverrideRef(obj) {
  frostOverrideRef.current = obj && typeof obj === "object" ? obj : {};
}

export function parseFrostOverride(mmdd) {
  if (!mmdd || typeof mmdd !== "string") return null;
  const m = mmdd.match(/^(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;
  const month = parseInt(m[1], 10) - 1;
  const day = parseInt(m[2], 10);
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  return new Date(new Date().getFullYear(), month, day);
}

export function getLastFrostDate(zone) {
  const override = parseFrostOverride(frostOverrideRef.current?.lastFrost);
  if (override) return override;
  const bucket = getClimateBucket(zone);
  const year = new Date().getFullYear();
  if (bucket === "cold") return flipDate(new Date(year, 4, 25));      // ~late May
  if (bucket === "moderate") return flipDate(new Date(year, 2, 15));  // ~mid March
  return flipDate(new Date(year, 0, 25));                             // ~late January (hot)
}

export function getFirstFrostDate(zone) {
  const override = parseFrostOverride(frostOverrideRef.current?.firstFrost);
  if (override) return override;
  // Estimated FALL first-frost date by climate bucket.
  const bucket = getClimateBucket(zone);
  const year = new Date().getFullYear();
  if (bucket === "cold") return flipDate(new Date(year, 8, 25));      // ~late September
  if (bucket === "moderate") return flipDate(new Date(year, 10, 15)); // ~mid November
  return flipDate(new Date(year, 11, 5));                             // ~early December (hot)
}

export function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getDaylightHours(lat, date = new Date()) {
  // Sunrise equation — returns daylight length in hours for a given latitude.
  const n = dayOfYear(date);
  const latRad = (lat * Math.PI) / 180;
  // Solar declination (radians)
  const decl = 0.4093 * Math.sin((2 * Math.PI / 365) * (n - 81));
  const cosH = -Math.tan(latRad) * Math.tan(decl);
  // Polar day / polar night guards
  if (cosH <= -1) return 24;
  if (cosH >= 1) return 0;
  const H = Math.acos(cosH); // half-day angle (radians)
  return (2 * H * 24) / (2 * Math.PI);
}

export function getDaylightInfo(coords) {
  const lat = parseFloat(coords?.lat);
  if (Number.isNaN(lat)) return null;
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const hoursToday = getDaylightHours(lat, today);
  const hoursYesterday = getDaylightHours(lat, yesterday);
  const deltaMin = Math.round((hoursToday - hoursYesterday) * 60);
  const h = Math.floor(hoursToday);
  const m = Math.round((hoursToday - h) * 60);
  return {
    label: `${h}h ${String(m).padStart(2, "0")}m`,
    gaining: deltaMin >= 0,
    deltaMin: Math.abs(deltaMin),
    hours: hoursToday,
    // Long days (>14h) push cool-season greens to bolt; short days (<10h) stall growth.
    shortDay: hoursToday < 10,
    longDay: hoursToday > 14,
  };
}

export function getFrostMaturityInfo(item, zone) {
  if (!zone) return null;
  const days = getHarvestDays(item);
  const firstFrost = getFirstFrostDate(zone);
  const now = new Date(); now.setHours(12, 0, 0, 0);
  const daysUntilFrost = Math.round((firstFrost - now) / (1000 * 60 * 60 * 24));
  if (daysUntilFrost <= 0) return null; // already in/after frost season
  const short = days - daysUntilFrost;
  return { days, daysUntilFrost, short, atRisk: short > 0 };
}

export function getSeedStartWeeks(item) {
  const name = String(item?.name || "").toLowerCase();
  const type = normalizeType(item.type, item.name);
  if (["tomato", "pepper", "eggplant"].some((w) => name.includes(w))) return 8;
  if (["celery"].some((w) => name.includes(w))) return 10;
  if (["broccoli", "cabbage", "cauliflower", "kale"].some((w) => name.includes(w))) return 6;
  if (["basil", "parsley", "thyme", "rosemary", "cilantro"].some((w) => name.includes(w))) return 6;
  if (type === "Tree Fruits" || type === "Tropical Fruits") return null; // buy transplants
  return null; // most veg/berries direct-sow
}

export function getSeedStartInfo(item, zone) {
  const weeks = getSeedStartWeeks(item);
  if (!weeks || !zone) return null;
  const lastFrost = getLastFrostDate(zone);
  const startBy = new Date(lastFrost);
  startBy.setDate(startBy.getDate() - weeks * 7);
  const now = new Date(); now.setHours(12, 0, 0, 0);
  const startClone = new Date(startBy); startClone.setHours(12, 0, 0, 0);
  const daysUntilStart = Math.round((startClone - now) / (1000 * 60 * 60 * 24));
  const fmt = (d) => formatDate(d, {
  month: "short",
  day: "numeric"
});
  let status;
  if (daysUntilStart > 21) status = "upcoming";
  else if (daysUntilStart >= -14) status = "start-now";
  else status = "passed";
  return {
    weeks, startBy, lastFrost, daysUntilStart, status,
    startByLabel: fmt(startBy), transplantLabel: fmt(lastFrost),
  };
}

export function getSmartWeatherRecommendation(zone, weather, plants = []) {
  if (!weather) return { title: "Weather scan loading", body: "Once your forecast loads, Pocket Planter will suggest what to water, protect, or plant next.", level: "Common" };
  const plantNowCount = plants.filter((item) => getPlantSeasonLabel(item, zone) === "Plant now").length;
  if (weather.minTempF <= 35) return { title: "Frost protection night", body: "Cover tender plants, move containers near shelter, and wait on transplanting until lows warm back up.", level: "Epic" };
  if (weather.maxTempF >= 98) return { title: "Heat stress warning", body: "Water deeply before the afternoon, shade young starts, and skip transplanting today.", level: "Rare" };
  if (weather.precipChance >= 70) return { title: "Rain-friendly garden day", body: "Let rain handle watering. Check drainage and avoid soaking containers twice.", level: "Rare" };
  return { title: "Prime Garden Window!", body: `${plantNowCount || "Several"} zone-matched plants look reasonable right now. Focus on soil moisture and steady starts.`, level: "Common" };
}

export function getWateringTip(weather) {
  if (!weather) return "Water deeply and consistently while monitoring soil moisture.";
  if (weather.maxTempF >= 95) return "Hot weather is coming. Deep morning watering will help reduce stress and evaporation.";
  if (weather.precipChance >= 65) return "Rain is likely this week. Check the soil before watering again.";
  return "Keep the soil lightly moist and avoid shallow watering.";
}

export function getShouldGrowText(item, zone, weather) {
  const seasonLabel = getPlantSeasonLabel(item, zone);
  const difficulty = getPlantDifficulty(item);
  const type = normalizeType(item.type, item.name);
  const name = String(item.name || "").toLowerCase();
  const climate = getClimateBucket(zone);

  if (seasonLabel === "Outside your zone") {
    if (type === "Tropical Fruits") return `${item.name} thrives in warm tropical climates and struggles in zones below 9. In cooler zones consider growing in a large container that can be moved indoors during cold months.`;
    if (type === "Tree Fruits") return `${item.name} grows best outside your current zone. Check with a local nursery about cold-hardy varieties that may work in your area.`;
    return `${item.name} is typically grown outside your current zone. You may still have success with containers, raised beds, or a greenhouse setup depending on your microclimate.`;
  }

  if (weather?.minTempF <= 35) {
    return `${item.name} is a good fit for your zone but frost is in the forecast. Hold off on transplanting outdoors until overnight lows stay consistently above 40°F. Starting seeds indoors now is a great option.`;
  }

  if (weather?.maxTempF >= 98) {
    if (name.includes("lettuce") || name.includes("spinach") || name.includes("pea") || name.includes("radish")) {
      return `${item.name} prefers cooler temperatures and will struggle in the current heat. Wait for temperatures to drop below 80°F or plant in a shaded spot with morning sun only.`;
    }
    if (name.includes("tomato") || name.includes("pepper") || name.includes("eggplant") || name.includes("watermelon")) {
      return `${item.name} loves heat and is a strong performer in your zone. Plant early morning, water deeply, and mulch heavily to protect roots during peak afternoon heat.`;
    }
    return `${item.name} can handle warm conditions but the current heat is high. Water deeply in the morning, add mulch, and avoid transplanting during the hottest part of the day.`;
  }

  // Zone and season specific
  if (climate === "hot") {
    if (name.includes("tomato")) return "Tomatoes thrive in hot zones but need consistent deep watering and mulching to survive summer heat. Choose heat-tolerant varieties like Solar Fire or Heatmaster for best results in warm climates.";
    if (name.includes("pepper")) return "Peppers are one of the best vegetables for hot zones — they love the heat and produce abundantly in warm climates. Water consistently and expect a long productive season.";
    if (name.includes("basil")) return "Basil thrives in hot sunny conditions making it perfect for your zone. Plant after last frost in full sun and pinch flowers regularly to keep leaves flavorful all season.";
    if (name.includes("watermelon")) return "Watermelon is an excellent choice for hot zones — the heat accelerates growth and sweetness. Give plants plenty of space, deep water weekly, and expect a rewarding harvest.";
    if (name.includes("okra")) return "Okra is one of the best vegetables for hot climates and practically thrives on neglect in warm zones. Plant in full sun and harvest every 2 days during peak season.";
    if (name.includes("eggplant")) return "Eggplant loves heat and performs exceptionally well in warm zones. Keep soil consistently moist and expect a long productive growing season.";
    if (name.includes("sweet potato") || name.includes("sweetpotato")) return "Sweet potatoes are perfectly suited for hot zones — they love the heat and produce abundantly in long warm seasons. Plant slips after last frost and give vines room to spread.";
  }

  if (climate === "cold") {
    if (name.includes("kale")) return "Kale is one of the best cold zone vegetables — it actually improves in flavor after frost. Plant in late summer for a fall and early winter harvest that gets sweeter with every cold snap.";
    if (name.includes("spinach")) return "Spinach thrives in cold zones and is one of the first crops you can plant in spring. It tolerates light frost and produces tender leaves in cool weather.";
    if (name.includes("pea")) return "Peas are perfect for cold zones — they prefer cool weather and can be planted as soon as soil can be worked in spring. Expect a productive harvest before summer heat arrives.";
    if (name.includes("potato")) return "Potatoes are well suited for cold zones with long cool growing seasons. Plant certified seed potatoes in early spring and expect a generous harvest by late summer.";
    if (name.includes("carrot")) return "Carrots thrive in cool climates and develop excellent sweetness after light frost exposure. Plant in deep, loose, rock-free soil for straight, full-sized roots.";
    if (name.includes("broccoli")) return "Broccoli is ideal for cold zones — it prefers cool temperatures and produces best in spring or fall. Start indoors early and transplant when weather cools for a premium harvest.";
  }

  // Difficulty based responses
  if (difficulty.label === "Easy") {
    return `${item.name} is beginner friendly and a great choice for your zone. It's forgiving, grows quickly, and rewards consistent watering and good soil with a reliable harvest. A great starting point for any gardener.`;
  }
  if (difficulty.label === "Hard") {
    return `${item.name} requires more attention but is absolutely worth growing in Zone ${zone || "your area"}. Focus on proper soil preparation, consistent watering, and monitoring for pests. The effort pays off with an impressive and rewarding harvest.`;
  }
  return `${item.name} is a solid choice for Zone ${zone || "your area"} when planted during the proper season. Prepare your soil with compost, water consistently, and give plants enough space for airflow and healthy growth throughout the season.`;
}

export function getWhereToPlantText(item) {
  const type = normalizeType(item.type, item.name);
  if (type === "Herbs") return "Herbs usually grow best in containers, raised beds, or sunny windows with strong drainage.";
  if (type === "Tree Fruits") return "Tree fruits need full sun, room to spread, and long-term outdoor space.";
  if (type === "Tropical Fruits") return "Tropical fruits prefer warmer climates, high sun exposure, and protection from frost.";
  if (type === "Berries") return "Berries usually like sun, good airflow, mulch, and consistent moisture.";
  return "Plant in a sunny outdoor location with loose soil and consistent airflow.";
}

export function getPlantSpecificTip(item, zone, weather) {
  const seasonLabel = getPlantSeasonLabel(item, zone);
  if (seasonLabel === "Plant now" && weather?.maxTempF >= 95) return "This plant is in season, but the heat is high. Plant early in the morning, mulch well, and keep watering consistent.";
  if (seasonLabel === "Plant now" && weather?.minTempF <= 38) return "This plant is in season, but nights are still chilly. Protect young starts until temperatures stay warmer.";
  if (seasonLabel === "Plant now") return "This is a good time to grow it in your area. Focus on soil moisture, spacing, and steady care during the first few weeks.";
  return "Save or follow this plant so you can come back when its planting window gets closer.";
}

export function getPlantingSteps(item) {
  if (Array.isArray(item.plantingSteps) && item.plantingSteps.length) return item.plantingSteps;

  const name = String(item?.name || "").toLowerCase();

  // VEGETABLES
  if (name.includes("tomato")) return [
    "Choose a sunny spot with at least 8 hours of direct sunlight daily.",
    "Dig a deep hole and bury the stem up to the lowest set of leaves — tomatoes root along buried stems.",
    "Space plants 24–36 inches apart to allow airflow and prevent disease.",
    "Water deeply at the base right after planting — avoid wetting the leaves.",
    "Add a 2–3 inch layer of mulch around the base to retain moisture and reduce weeds.",
    "Install a cage or stake at planting time before roots establish.",
    "Feed with a balanced fertilizer every 2 weeks once flowers appear.",
  ];
  if (name.includes("pepper")) return [
    "Start seeds indoors 8–10 weeks before last frost or buy transplants.",
    "Choose a warm, sunny location with well-draining soil.",
    "Plant 18–24 inches apart after all frost risk has passed.",
    "Water consistently — peppers drop flowers if soil dries out too much.",
    "Mulch around plants to keep roots cool and retain moisture.",
    "Feed with a low-nitrogen fertilizer once flowering begins.",
    "Harvest regularly to encourage more fruit production throughout the season.",
  ];
  if (name.includes("cucumber")) return [
    "Wait until soil temperature reaches at least 60°F before planting.",
    "Sow seeds 1 inch deep directly in the garden or start indoors 3 weeks early.",
    "Plant in hills of 2–3 seeds or space transplants 12 inches apart.",
    "Install a trellis at planting time — vertical growing saves space and improves airflow.",
    "Water deeply and consistently — cucumbers are 95% water and need steady moisture.",
    "Mulch heavily to keep soil cool and moist during hot weather.",
    "Harvest when cucumbers reach full size but before they yellow — pick often to keep plants producing.",
  ];
  if (name.includes("zucchini") || name.includes("squash")) return [
    "Direct sow seeds 1 inch deep after last frost when soil is warm.",
    "Plant in groups of 2–3 seeds and thin to the strongest plant.",
    "Space plants 3–4 feet apart — zucchini gets large quickly.",
    "Water at the base deeply 2–3 times per week.",
    "Hand pollinate early flowers if bees are scarce by transferring pollen with a small brush.",
    "Harvest zucchini when 6–8 inches long for best flavor and texture.",
    "Check plants daily during peak season — zucchini grows extremely fast.",
  ];
  if (name.includes("carrot")) return [
    "Loosen soil at least 12 inches deep and remove all rocks and debris.",
    "Sow seeds directly — carrots do not transplant well.",
    "Sprinkle seeds thinly in rows 12 inches apart and cover with just 1/4 inch of soil.",
    "Keep the soil surface consistently moist until germination — this takes 10–14 days.",
    "Thin seedlings to 3 inches apart once they reach 2 inches tall.",
    "Avoid heavy nitrogen fertilizer — it causes forked roots.",
    "Harvest when tops reach full color — gently loosen soil with a fork before pulling.",
  ];
  if (name.includes("lettuce")) return [
    "Choose a spot with morning sun and afternoon shade in warm climates.",
    "Sow seeds 1/8 inch deep directly in loose, fertile soil.",
    "Keep rows 12 inches apart and thin seedlings to 6 inches once established.",
    "Water lightly and frequently — lettuce has shallow roots that dry out quickly.",
    "Harvest outer leaves as needed or cut the whole head at soil level.",
    "Replant every 2–3 weeks for a continuous harvest throughout the season.",
    "Bolt prevention: harvest before temperatures consistently exceed 80°F.",
  ];
  if (name.includes("spinach")) return [
    "Plant in early spring or fall — spinach struggles in summer heat.",
    "Sow seeds 1/2 inch deep in rows 12 inches apart.",
    "Thin seedlings to 6 inches apart when they reach 2 inches tall.",
    "Keep soil consistently moist — spinach wilts quickly without water.",
    "Fertilize with nitrogen-rich fertilizer for lush leafy growth.",
    "Harvest outer leaves when they reach 3–4 inches or cut the whole plant.",
    "Plant a new batch every 2 weeks for continuous harvest before summer.",
  ];
  if (name.includes("kale")) return [
    "Start seeds indoors 6 weeks before last frost or direct sow in late summer for fall harvest.",
    "Plant in full sun to partial shade in rich, well-draining soil.",
    "Space transplants 18–24 inches apart for large healthy plants.",
    "Water deeply once or twice per week — kale is drought tolerant but prefers consistent moisture.",
    "Fertilize monthly with a balanced fertilizer.",
    "Harvest outer leaves first, leaving the center to keep growing.",
    "Flavor improves after a light frost — fall kale is often sweeter than spring kale.",
  ];
  if (name.includes("broccoli")) return [
    "Start seeds indoors 6–8 weeks before last frost.",
    "Transplant outdoors 2–3 weeks before last frost — broccoli tolerates light frost.",
    "Space plants 18 inches apart in rows 24 inches wide.",
    "Keep soil consistently moist — uneven watering causes hollow stems.",
    "Feed with nitrogen-rich fertilizer every 3 weeks.",
    "Harvest the main head before flowers open — cut at an angle to allow side shoots to form.",
    "Continue harvesting side shoots for weeks after the main head is cut.",
  ];
  if (name.includes("cabbage")) return [
    "Start seeds indoors 6–8 weeks before last frost.",
    "Harden off transplants for one week before moving outside.",
    "Space plants 12–24 inches apart depending on desired head size.",
    "Water regularly — cabbage is 90% water and needs consistent moisture.",
    "Mulch around plants to retain moisture and suppress weeds.",
    "Watch for cabbage worms and treat with Bt spray if needed.",
    "Harvest when heads feel solid and firm when squeezed.",
  ];
  if (name.includes("potato")) return [
    "Cut seed potatoes into chunks with at least 2 eyes each and let them cure for 24 hours.",
    "Dig trenches 4 inches deep and 12 inches apart.",
    "Place seed potato chunks cut side down, 12 inches apart in the trench.",
    "Cover with 4 inches of soil and water well.",
    "Hill soil around stems as plants grow — keeping tubers covered prevents greening.",
    "Stop watering when foliage begins to yellow and die back.",
    "Harvest 2–3 weeks after foliage dies — dig carefully to avoid damaging tubers.",
  ];
  if (name.includes("onion")) return [
    "Plant sets or transplants in early spring as soon as soil can be worked.",
    "Choose a sunny spot with loose, well-draining soil.",
    "Plant sets 1 inch deep and 4–6 inches apart in rows 12 inches apart.",
    "Keep soil consistently moist during bulb formation.",
    "Stop watering when tops begin to fall over naturally.",
    "Push over any remaining tops to redirect energy to the bulb.",
    "Harvest when tops are fully brown and dry — cure in a warm dry place for 2–4 weeks before storing.",
  ];
  if (name.includes("garlic")) return [
    "Plant individual cloves in fall, 4–6 weeks before ground freezes.",
    "Choose the largest cloves from the bulb for the best yield.",
    "Plant cloves pointed end up, 2 inches deep and 6 inches apart.",
    "Mulch heavily with straw after planting to protect from winter cold.",
    "Remove mulch in spring when green shoots emerge.",
    "Snap off scapes (curly shoots) in early summer to redirect energy to the bulb.",
    "Harvest when lower leaves turn brown but upper leaves are still green — usually June or July.",
  ];
  if (name.includes("corn")) return [
    "Wait until soil reaches 60°F before planting — corn needs warm soil to germinate.",
    "Plant in blocks of at least 4 rows rather than single rows for good pollination.",
    "Sow seeds 1 inch deep, 9–12 inches apart in rows 30–36 inches apart.",
    "Water deeply once per week — corn needs 1 inch of water weekly.",
    "Side dress with nitrogen fertilizer when plants reach knee height.",
    "Silk turns brown and dries out when ears are ready — check by peeling back husk.",
    "Harvest immediately when ready — sugar converts to starch quickly after picking.",
  ];
  if (name.includes("bean") || name.includes("greenbean")) return [
    "Direct sow after last frost when soil reaches 60°F.",
    "Plant seeds 1–2 inches deep, 3 inches apart in rows 18 inches apart.",
    "For pole beans install support before planting — plants grow 6–8 feet tall.",
    "Water consistently — beans drop flowers in drought conditions.",
    "Avoid overhead watering to prevent fungal disease on leaves.",
    "Begin harvesting when pods are firm and snap cleanly — don't let pods mature on plant.",
    "Pick every 2–3 days to keep plants producing throughout the season.",
  ];
  if (name.includes("pea")) return [
    "Plant in early spring as soon as soil can be worked — peas prefer cool weather.",
    "Sow seeds 1 inch deep, 2 inches apart in rows 18 inches apart.",
    "Install a trellis or netting before planting for climbing varieties.",
    "Water at the base — avoid wetting foliage to prevent powdery mildew.",
    "Do not fertilize with nitrogen — peas fix their own nitrogen from the air.",
    "Harvest when pods are plump and bright green — taste one to check sweetness.",
    "Pick regularly to keep plants producing — leaving pods on the vine stops new growth.",
  ];
  if (name.includes("radish")) return [
    "Sow seeds directly in spring or fall — radishes bolt quickly in summer heat.",
    "Plant 1/2 inch deep, 1 inch apart in rows 6 inches apart.",
    "Thin to 2 inches apart once seedlings emerge.",
    "Water consistently — irregular watering causes cracked or woody roots.",
    "Radishes are ready in just 25–30 days — check size by gently exposing the top of the root.",
    "Harvest promptly when mature — leaving them in ground makes them woody and hot.",
    "Succession plant every 2 weeks for continuous harvest throughout cool season.",
  ];
  if (name.includes("beet")) return [
    "Sow seeds directly in early spring or late summer for fall harvest.",
    "Plant 1/2 inch deep, 3 inches apart in rows 12 inches apart.",
    "Soak seeds in water for 24 hours before planting to improve germination.",
    "Thin seedlings to 4 inches apart — each beet seed is actually a cluster of seeds.",
    "Keep soil consistently moist for smooth, uniform root development.",
    "Harvest when roots reach 1.5–3 inches in diameter for best flavor.",
    "Don't forget the greens — beet tops are edible and highly nutritious.",
  ];
  if (name.includes("eggplant")) return [
    "Start seeds indoors 8–10 weeks before last frost — eggplant needs a long warm season.",
    "Transplant outdoors only when night temperatures stay above 55°F consistently.",
    "Space plants 18–24 inches apart in full sun.",
    "Water deeply and consistently — eggplant is sensitive to drought stress.",
    "Mulch heavily to keep soil warm and retain moisture.",
    "Feed with a balanced fertilizer every 3 weeks once flowering begins.",
    "Harvest when skin is glossy and bright — dull skin means the fruit is overripe.",
  ];
  if (name.includes("celery")) return [
    "Start seeds indoors 10–12 weeks before last frost — celery has a very long growing season.",
    "Transplant when seedlings are 3–4 inches tall and frost risk has passed.",
    "Space plants 12 inches apart in rich, moisture-retentive soil.",
    "Water heavily and consistently — celery needs more water than almost any vegetable.",
    "Side dress with compost or fertilizer every 3 weeks.",
    "Blanch stalks by wrapping with newspaper 2 weeks before harvest for milder flavor.",
    "Harvest by cutting the whole plant at soil level when stalks reach full size.",
  ];
  if (name.includes("pumpkin")) return [
    "Sow seeds directly after last frost when soil is warm.",
    "Plant 3–5 seeds per hill, 1 inch deep, in hills spaced 6 feet apart.",
    "Thin to 2–3 plants per hill once seedlings emerge.",
    "Water deeply at the base — avoid wetting leaves to prevent mildew.",
    "Feed with a high-potassium fertilizer once flowers form.",
    "Pinch off excess small pumpkins to direct energy into 1–2 large fruits.",
    "Harvest when skin is hard, color is fully developed, and stem begins to dry.",
  ];
  if (name.includes("watermelon")) return [
    "Start seeds indoors 2–3 weeks before last frost or direct sow when soil reaches 70°F.",
    "Plant in hills 6 feet apart — watermelons need a lot of space to spread.",
    "Water deeply but infrequently — deep roots prefer long dry periods between waterings.",
    "Feed with nitrogen fertilizer until vines run, then switch to phosphorus.",
    "Place a board or straw under developing melons to prevent rot.",
    "Tap the melon — a hollow thump means it's ripe.",
    "Check the tendril closest to the fruit — when it dries and browns the melon is ready.",
  ];
  if (name.includes("okra")) return [
    "Soak seeds overnight in water to improve germination.",
    "Direct sow after last frost when soil reaches 65°F.",
    "Plant 1 inch deep, 12 inches apart in rows 3 feet apart.",
    "Water deeply once per week — okra is drought tolerant once established.",
    "Fertilize with a balanced fertilizer at planting and again at first flowering.",
    "Harvest pods when 3–4 inches long — larger pods become tough and fibrous.",
    "Harvest every 2 days during peak season — okra grows extremely fast in heat.",
  ];

  // HERBS
  if (name.includes("basil")) return [
    "Start seeds indoors 6 weeks before last frost or direct sow after frost.",
    "Plant in a warm, sunny location with at least 6 hours of direct sun.",
    "Space plants 12–18 inches apart in well-draining fertile soil.",
    "Water at the base consistently — basil hates wet leaves.",
    "Pinch off flower buds as soon as they appear to keep leaves flavorful.",
    "Harvest by pinching stems just above a leaf node to encourage bushy growth.",
    "Bring containers indoors before first frost to extend the season.",
  ];
  if (name.includes("mint")) return [
    "Plant in a container — mint spreads aggressively and will take over a garden bed.",
    "Choose a spot with partial shade to full sun.",
    "Plant in moist, rich soil and water regularly.",
    "Divide and repot container mint every spring to keep it healthy.",
    "Pinch off flowers to keep leaves at peak flavor.",
    "Harvest stems regularly — the more you pick the bushier it grows.",
    "Bring containers indoors before frost for year-round fresh mint.",
  ];
  if (name.includes("rosemary")) return [
    "Plant in full sun with excellent drainage — rosemary hates wet feet.",
    "Space plants 2–3 feet apart in sandy or loamy soil.",
    "Water deeply but infrequently — rosemary is drought tolerant once established.",
    "Avoid over-fertilizing — lean soil actually improves flavor.",
    "Prune after flowering to keep plants compact and bushy.",
    "Harvest by snipping young stem tips — never cut back more than one third at a time.",
    "In cold zones grow in containers and bring indoors for winter.",
  ];
  if (name.includes("thyme")) return [
    "Plant in full sun with very well-draining soil — thyme tolerates drought well.",
    "Space plants 12 inches apart.",
    "Water sparingly once established — overwatering is the most common mistake.",
    "Prune lightly after flowering to prevent woodiness.",
    "Harvest stems before flowers open for the strongest flavor.",
    "Divide plants every 2–3 years to keep them vigorous.",
    "Thyme is cold hardy in most zones and can overwinter outdoors.",
  ];
  if (name.includes("cilantro")) return [
    "Direct sow seeds in cool weather — cilantro bolts quickly in heat.",
    "Plant 1/4 inch deep in rows 12 inches apart.",
    "Succession sow every 3 weeks for continuous harvest.",
    "Water regularly but do not overwater — well-draining soil is essential.",
    "Harvest outer leaves when plants reach 6 inches tall.",
    "Let some plants bolt and go to seed — coriander seeds are also edible.",
    "Plant in fall in warm climates for the best cool-season harvest.",
  ];
  if (name.includes("parsley")) return [
    "Soak seeds in water for 24 hours before planting to speed germination.",
    "Sow 1/4 inch deep in rich, moist soil in full sun to partial shade.",
    "Thin seedlings to 8 inches apart — parsley needs room to develop.",
    "Water consistently — parsley prefers evenly moist soil.",
    "Fertilize monthly with a balanced fertilizer.",
    "Harvest outer stems first, cutting at the base of the stem.",
    "Parsley is biennial — it will overwinter and flower in its second year.",
  ];
  if (name.includes("fennel")) return [
    "Direct sow in a dedicated spot away from other vegetables.",
    "Plant in full sun in well-draining soil.",
    "Sow seeds 1/4 inch deep, 12 inches apart.",
    "Water regularly until established — fennel is drought tolerant once mature.",
    "Avoid planting near tomatoes, peppers, or most vegetables — fennel inhibits their growth.",
    "Harvest leaves anytime and bulb when it reaches tennis ball size.",
    "Let some plants go to seed for harvesting fennel seeds in late summer.",
  ];

  // BERRIES
  if (name.includes("strawberry")) return [
    "Plant in early spring in full sun with well-draining, slightly acidic soil.",
    "Set crowns at soil level — planting too deep causes rot, too shallow causes drying.",
    "Space plants 12–18 inches apart in rows 24 inches apart.",
    "Mulch with straw to keep berries clean and soil moist.",
    "Remove flowers in the first year to establish strong roots before fruiting.",
    "Feed with a high-potassium fertilizer in spring and after harvest.",
    "Replace plants every 3 years as productivity declines with age.",
  ];
  if (name.includes("blueberry")) return [
    "Choose a spot with full sun and very acidic soil (pH 4.5–5.5).",
    "Amend soil with sulfur or peat moss to lower pH if needed.",
    "Plant at least 2 different varieties for cross-pollination and higher yield.",
    "Space bushes 4–5 feet apart.",
    "Mulch deeply with wood chips or pine bark to maintain soil acidity.",
    "Water consistently — blueberries have shallow roots that dry out quickly.",
    "Do not expect a full harvest for 3 years — patience pays off with long-lived productive bushes.",
  ];
  if (name.includes("raspberry")) return [
    "Plant bare root canes in early spring in full sun.",
    "Space canes 2 feet apart in rows 8 feet apart.",
    "Install a trellis or post-and-wire support system before planting.",
    "Cut all canes back to 6 inches at planting to encourage strong new growth.",
    "Water deeply once per week — raspberries need consistent moisture.",
    "Mulch heavily to suppress weeds and retain moisture.",
    "Prune out old fruited canes after harvest to make room for new growth.",
  ];

  // TREE FRUITS
  if (name.includes("apple")) return [
    "Choose a sunny location with good air circulation to prevent disease.",
    "Plant bare root trees in early spring before buds break.",
    "Dig a hole twice as wide as the root ball and just as deep.",
    "Make sure the graft union stays 2 inches above soil level.",
    "Plant at least 2 compatible varieties for cross-pollination.",
    "Stake young trees for the first 2 years for stability.",
    "Prune annually in late winter to maintain an open canopy and good airflow.",
  ];
  if (name.includes("peach")) return [
    "Plant in full sun with well-draining soil in spring.",
    "Dig a hole wide enough to spread roots without bending.",
    "Keep the bud union 2 inches above soil level.",
    "Water deeply every week during the first growing season.",
    "Thin fruit to 6 inches apart when they reach marble size for larger peaches.",
    "Prune to an open vase shape annually in late winter.",
    "Apply dormant oil spray in late winter to control overwintering pests.",
  ];
  if (name.includes("lemon") || name.includes("lime") || name.includes("orange") || name.includes("grapefruit") || name.includes("mandarin")) return [
    "Plant in the warmest, sunniest spot in your garden or in a large container.",
    "Use well-draining citrus mix soil and ensure excellent drainage.",
    "Plant with the bud union above soil line.",
    "Water deeply but allow soil to dry slightly between waterings.",
    "Feed with citrus-specific fertilizer every 6–8 weeks during the growing season.",
    "Protect from frost — cover or bring containers indoors when temps drop below 32°F.",
    "Prune only to remove dead wood and crossing branches — citrus needs minimal pruning.",
  ];
  if (name.includes("avocado")) return [
    "Plant in full sun in a warm frost-free location.",
    "Use fast-draining soil — avocados are extremely sensitive to root rot.",
    "Dig a hole as deep as the root ball and 3 times as wide.",
    "Do not amend the soil in the planting hole — native soil encourages roots to spread.",
    "Water deeply but allow soil to dry out between waterings.",
    "Fertilize with a nitrogen-rich fertilizer 4 times per year.",
    "Mulch around the base but keep mulch away from the trunk to prevent rot.",
  ];
  if (name.includes("fig")) return [
    "Plant in full sun against a south-facing wall in cooler climates for extra warmth.",
    "Dig a hole twice the width of the root ball.",
    "Figs tolerate poor soil but need excellent drainage.",
    "Water regularly during the first season — established figs are drought tolerant.",
    "Prune in late winter to remove dead wood and maintain shape.",
    "In cold zones wrap trunk with burlap in winter or grow in containers.",
    "Harvest when fruit softens and hangs downward — figs do not ripen off the tree.",
  ];
  if (name.includes("pomegranate")) return [
    "Plant in full sun in well-draining soil — pomegranates tolerate drought and heat.",
    "Space plants 15–20 feet apart or prune as a shrub.",
    "Water regularly for the first 2 years while roots establish.",
    "Once established water deeply but infrequently.",
    "Fertilize in spring with a balanced fertilizer.",
    "Prune suckers from the base regularly to maintain tree form.",
    "Harvest when skin turns deep red and makes a metallic sound when tapped.",
  ];

  // DEFAULT
  const type = normalizeType(item.type, item.name);
  if (type === "Herbs") return [
    "Choose a sunny container, raised bed, or garden spot with excellent drainage.",
    "Use loose potting mix or compost-rich soil.",
    "Plant at the same depth as the nursery pot or slightly shallower.",
    "Water at the base and keep soil evenly moist while establishing.",
    "Pinch growing tips regularly to encourage bushy compact growth.",
    "Harvest frequently once established — regular picking improves plant health.",
  ];
  if (type === "Tree Fruits") return [
    "Choose a full-sun location with enough long-term space for a mature tree.",
    "Dig a wide shallow hole and avoid planting the trunk too deep.",
    "Keep the graft union above soil level.",
    "Water deeply after planting and mulch around the base.",
    "Stake young trees for the first 2 years.",
    "Prune annually in late winter to maintain shape and airflow.",
  ];
  if (type === "Berries") return [
    "Pick a sunny spot with rich, well-draining, slightly acidic soil.",
    "Plant with correct spacing so leaves can dry after rain.",
    "Mulch around the base to hold moisture and suppress weeds.",
    "Water consistently — berries need steady moisture during fruiting.",
    "Feed with a high-potassium fertilizer in spring.",
    "Watch for birds and pests once fruit begins forming.",
  ];
  return [
    "Prepare loose soil with compost or organic matter before planting.",
    "Plant during the recommended window for your zone.",
    "Water gently after planting and keep soil evenly moist.",
    "Mulch around plants to retain moisture and reduce weeds.",
    "Fertilize regularly once plants are established.",
    "Monitor for pests and disease and treat early if needed.",
  ];
}

export function getRarity(item) {
  const type = normalizeType(item.type, item.name);
  const spread = Math.abs(zoneNumber(item.maxZone) - zoneNumber(item.minZone));
  if (item.name.includes("Pomegranate") || item.name.includes("Avocado") || item.name.includes("Fig") || item.name.includes("Orange") || item.name.includes("Lemon")) return "Legendary";
  if (type === "Tree Fruits" || type === "Tropical Fruits") return "Epic";
  if (type === "Berries" || spread <= 4) return "Rare";
  return "Common";
}

export function resolvePlantImageSource(item) {
  if (!item || !item.image) return null;
  return plantImages[item.image] || null;
}

// Global haptics switch — flipped by the Settings toggle via setHapticsEnabled.
let hapticsEnabled = true;
export function setHapticsEnabled(on) {
  hapticsEnabled = on !== false;
}

export function tapHaptic(style = "light") {
  if (!hapticsEnabled) return;
  const map = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  };
  Haptics.impactAsync(map[style] || map.light).catch(() => {});
}

export function successHaptic() {
  if (!hapticsEnabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function getDateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export function getTodayKey() {
  return getDateKey(new Date());
}

// ── Premium feature manifest ────────────────────────────────────────────────
// Single source of truth for everything unlocked by Premium. Both the Premium
// tab (SettingsCard) and the onboarding finale render from this list, so the two
// surfaces can never drift and every gated feature is always represented. Each
// entry's title/body are i18n keys under `premiumCard`.
export const PREMIUM_FEATURES = [
  { icon: "❄️", titleKey: "premiumCard.frostTitle", bodyKey: "premiumCard.frostBody" },
  { icon: "🌤️", titleKey: "premiumCard.weatherTitle", bodyKey: "premiumCard.weatherBody" },
  { icon: "💧", titleKey: "premiumCard.wateringTitle", bodyKey: "premiumCard.wateringBody" },
  { icon: "🌿", titleKey: "premiumCard.companionTitle", bodyKey: "premiumCard.companionBody" },
  { icon: "🗺️", titleKey: "premiumCard.plannerTitle", bodyKey: "premiumCard.plannerBody" },
  { icon: "📖", titleKey: "premiumCard.guidesTitle", bodyKey: "premiumCard.guidesBody" },
  { icon: "📸", titleKey: "premiumCard.journalTitle", bodyKey: "premiumCard.journalBody" },
  { icon: "🐛", titleKey: "premiumCard.pestsTitle", bodyKey: "premiumCard.pestsBody" },
  { icon: "🛒", titleKey: "premiumCard.shoppingTitle", bodyKey: "premiumCard.shoppingBody" },
  { icon: "🧑‍🌾", titleKey: "premiumCard.profileTitle", bodyKey: "premiumCard.profileBody" },
  { icon: "🏆", titleKey: "premiumCard.xpTitle", bodyKey: "premiumCard.xpBody" },
  { icon: "⚡", titleKey: "premiumCard.questsTitle", bodyKey: "premiumCard.questsBody" },
  { icon: "🌱", titleKey: "premiumCard.unlimitedTitle", bodyKey: "premiumCard.unlimitedBody" },
  { icon: "☁️", titleKey: "premiumCard.cloudTitle", bodyKey: "premiumCard.cloudBody" },
];

// ── New-user activation checklist ───────────────────────────────────────────
// The first-week milestones that turn an install into an active gardener. Each
// step's completion is derived purely from existing saved state, so there is
// nothing separate to track or keep in sync. Labels live in the view layer
// (i18n); this returns stable ids + an emoji + the tab `route` the card jumps
// to when the user taps an unfinished step.
export function getActivationSteps({
  zone,
  zip,
  savedPlants = [],
  gardenAreas = [],
  wateringHistory = {},
  wateredPlants = {},
  journalEntries = [],
} = {}) {
  const hasZone = !!zone || (typeof zip === "string" && zip.length === 5);
  const hasPlant = Array.isArray(savedPlants) && savedPlants.length > 0;
  const hasBed =
    Array.isArray(gardenAreas) &&
    gardenAreas.some(
      (a) => a && a.plots && Object.values(a.plots).some((p) => p != null && p !== "")
    );
  const hasWatered =
    (wateringHistory && Object.keys(wateringHistory).length > 0) ||
    (wateredPlants && Object.keys(wateredPlants).length > 0);
  const hasPhoto = Array.isArray(journalEntries) && journalEntries.length > 0;

  return [
    { id: "zone", emoji: "📍", done: hasZone, route: "home" },
    { id: "plant", emoji: "🌱", done: hasPlant, route: "plants" },
    { id: "bed", emoji: "🪴", done: hasBed, route: "garden" },
    { id: "water", emoji: "💧", done: hasWatered, route: "plants" },
    { id: "photo", emoji: "📷", done: hasPhoto, route: "journal" },
  ];
}

export function getAreaTag(area) {
  return {
    emoji: area?.emoji || "🌿",
    color: area?.color || "#5cff89",
  };
}

export function formatReminderTime({ hour, minute }) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  const mm = minute === 0 ? "00" : String(minute).padStart(2, "0");
return `${h12}:${mm} ${ampm}`;
}

export function formatRelativeDate(ts) {
  if (!ts) return "";
  const then = new Date(ts).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(new Date(ts));
}

export const HARVEST_UNIT_VALUE = {
  Tomato: 3, Pepper: 2, Cucumber: 1.5, Zucchini: 1.5, Squash: 1.5, Lettuce: 2,
  Spinach: 3, Kale: 3, Broccoli: 2.5, Cabbage: 2.5, Cauliflower: 3, Carrot: 1.5,
  Potato: 1, Onion: 1, Garlic: 1.5, Corn: 0.75, Bean: 2, Pea: 3, Radish: 1,
  Beet: 2, Eggplant: 2.5, Pumpkin: 5, Watermelon: 5, Strawberry: 4, Blueberry: 5,
  Raspberry: 6, Basil: 2.5, Mint: 2, Parsley: 2, Cilantro: 2, Okra: 3,
};

export function parseHarvestQuantity(amount) {
  const match = String(amount || "").match(/(\d+(\.\d+)?)/);
  const n = match ? parseFloat(match[1]) : 0;
  return n > 0 ? n : 1;
}

export function estimateHarvestValue(harvestLog) {
  let total = 0;
  const byPlant = {};
  (harvestLog || []).forEach((h) => {
    const key = Object.keys(HARVEST_UNIT_VALUE).find((k) =>
      String(h.plantName || "").toLowerCase().includes(k.toLowerCase())
    );
    const unitVal = key ? HARVEST_UNIT_VALUE[key] : 2;
    const value = unitVal * parseHarvestQuantity(h.amount);
    total += value;
    byPlant[h.plantName] = (byPlant[h.plantName] || 0) + value;
  });
  const top = Object.entries(byPlant).sort((a, b) => b[1] - a[1])[0];
  return { total: Math.round(total), byPlant, topPlant: top ? { name: top[0], value: Math.round(top[1]) } : null };
}

// The bed grid only renders canonical "slot-1".."slot-N" keys. Older builds (and a
// quick-add slot bug) stored plants under bare numeric keys ("0","1"...), which
// counted as planted but never showed in the bed — and sometimes stored the SAME
// plant twice (once under a numeric key, once under a real slot), so a single plant
// counted as 2. This heals both: it drops any orphan that just duplicates a plant
// already in the bed (the double-count bug), and remaps the rest onto the first free
// canonical slot so genuinely-hidden plants finally appear. Runs once on load.
// (Legit double-planting is done through the grid picker, which writes canonical
// slot keys, so those are left untouched.)
export function normalizeAreaPlots(area) {
  const size = Math.max(1, Math.min(12, Number(area?.size) || 12));
  const plots = area?.plots || {};
  const isCanonical = (k) => /^slot-([1-9]\d*)$/.test(k);
  const canonical = {};
  const orphans = [];
  Object.entries(plots).forEach(([k, v]) => {
    if (!v) return;
    if (isCanonical(k)) canonical[k] = v;
    else orphans.push(v);
  });
  if (!orphans.length) return plots; // already clean — leave it untouched
  const out = { ...canonical };
  const used = new Set(Object.keys(canonical));
  const present = new Set(Object.values(canonical).map((n) => String(n).toLowerCase()));
  orphans.forEach((name) => {
    if (present.has(String(name).toLowerCase())) return; // duplicate of an existing plant → drop it
    for (let i = 1; i <= size; i++) {
      const id = `slot-${i}`;
      if (!used.has(id)) { out[id] = name; used.add(id); present.add(String(name).toLowerCase()); break; }
    }
  });
  return out;
}

export function migrateGardenToAreas(existingAreas, legacyGardenMap) {
  // If areas already exist, use them as-is (with slot keys normalized for display).
  if (Array.isArray(existingAreas) && existingAreas.length > 0) {
    return existingAreas.map((area) => {
      const size = typeof area.size === "number" ? area.size : Object.keys(area.plots || {}).length || 12;
      return { ...area, size, plots: normalizeAreaPlots({ ...area, size }) };
    });
  }
  // Otherwise wrap any legacy flat gardenMap into one default area
  // so existing users don't lose their layout.
 const legacyPlots = legacyGardenMap && typeof legacyGardenMap === "object" ? legacyGardenMap : {};
  if (Object.keys(legacyPlots).length === 0) {
    return [];
  }
  return [
    {
      id: "area-default",
      name: "My Garden",
      plots: normalizeAreaPlots({ plots: legacyPlots, size: 12 }),
      size: 12,
      kind: "home",
    },
  ];
}

// ── Units ──────────────────────────────────────────────────────────────────
// Weather data is always stored in °F / inches internally. These format for
// display based on the user's chosen unit system ("imperial" | "metric").
export function fToC(f) {
  return (Number(f) - 32) * (5 / 9);
}

// Rounded temperature with degree symbol, e.g. "72°" or "22°". Pass withUnit
// to append F/C, e.g. "72°F" / "22°C".
export function formatTemp(fahrenheit, units, withUnit = false) {
  if (fahrenheit == null || Number.isNaN(Number(fahrenheit))) return "—";
  const metric = units === "metric";
  const val = Math.round(metric ? fToC(fahrenheit) : Number(fahrenheit));
  return `${val}°${withUnit ? (metric ? "C" : "F") : ""}`;
}

// Rainfall/length: inches → mm for metric.
export function formatLength(inches, units) {
  if (inches == null || Number.isNaN(Number(inches))) return "—";
  if (units === "metric") return `${Math.round(Number(inches) * 25.4)} mm`;
  const n = Number(inches);
  return `${Number.isInteger(n) ? n : n.toFixed(1)}"`;
}

export async function maybeAskForReview() {
  try {
    const alreadyAsked = await AsyncStorage.getItem("pp_reviewRequested");
    if (alreadyAsked) return;
    const available = await StoreReview.isAvailableAsync();
    if (!available) return;
    await AsyncStorage.setItem("pp_reviewRequested", "true");
    await StoreReview.requestReview();
  } catch (error) {
    console.log("Review request skipped:", error);
  }
}

export function getDaysSince(dateString) {
  if (!dateString) return null;
  const slice = String(dateString).slice(0, 10);
  const then = new Date(`${slice}T12:00:00`);
  if (Number.isNaN(then.getTime())) return null;
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const diff = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  return Number.isNaN(diff) ? null : diff;
}

export function getLastWateredText(plantName, wateredPlants, wateringHistory) {
  const history = wateringHistory?.[plantName];
  const lastDate = Array.isArray(history) && history.length
    ? history[history.length - 1]
    : wateredPlants?.[plantName];
  const days = getDaysSince(lastDate);
  if (days === null) return "Never watered";
  if (days <= 0) return "Watered today";
  if (days === 1) return "Watered yesterday";
  if (days < 14) return `Watered ${days} days ago`;
  const weeks = Math.floor(days / 7);
  return `Watered ${weeks} week${weeks === 1 ? "" : "s"} ago`;
}

export function getWateringCount(plantName, wateringHistory) {
  const history = wateringHistory?.[plantName];
  return Array.isArray(history) ? history.length : 0;
}

export function getBaseWaterInterval(item) {
  const type = normalizeType(item?.type, item?.name);
  const name = String(item?.name || "").toLowerCase();
  if (["lettuce", "spinach", "celery", "cucumber"].some((w) => name.includes(w))) return 2;
  if (type === "Herbs") return 2;
  if (type === "Tree Fruits" || type === "Tropical Fruits") return 5;
  if (type === "Berries") return 3;
  return 3; // vegetables default
}

export function getWateringRhythm(plantName, item, wateringHistory) {
  const raw = wateringHistory?.[plantName];
  if (!Array.isArray(raw)) return null;
  // Unique day-keys, sorted oldest → newest.
  const dates = Array.from(new Set(raw.map((d) => String(d).slice(0, 10)))).sort();
  if (dates.length < 3) return null; // need a few data points for a meaningful average
  let totalGap = 0;
  for (let i = 1; i < dates.length; i += 1) {
    const a = new Date(`${dates[i - 1]}T12:00:00`);
    const b = new Date(`${dates[i]}T12:00:00`);
    totalGap += Math.round((b - a) / (1000 * 60 * 60 * 24));
  }
  const avgGap = totalGap / (dates.length - 1);
  const target = getBaseWaterInterval(item);
  const diff = avgGap - target; // + = watering less often than ideal, - = more often
  let status;
  if (Math.abs(diff) <= 0.75) status = "on-track";
  else if (diff > 0.75) status = "under"; // gaps too long
  else status = "over"; // gaps too short
  return { avgGap: Math.round(avgGap * 10) / 10, target, diff, status, count: dates.length };
}

export function getNextWaterInfo(plantName, item, wateringHistory, wateredPlants, weather) {
  const history = wateringHistory?.[plantName];
  const lastDate = Array.isArray(history) && history.length
    ? history[history.length - 1]
    : wateredPlants?.[plantName];
  if (!lastDate) return null;

  let interval = getBaseWaterInterval(item);
  if (weather?.maxTempF >= 95) interval = Math.max(1, interval - 1);

  const base = new Date(`${String(lastDate).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(base.getTime())) return null;
  const next = new Date(base);
  next.setDate(next.getDate() + interval);

  const rainSoon = weather?.precipChance >= 65;
  const now = new Date(); now.setHours(12, 0, 0, 0);
  let daysUntil = Math.round((next - now) / (1000 * 60 * 60 * 24));
  if (rainSoon && daysUntil <= 0) daysUntil = 1;

  let label, urgency;
  if (daysUntil <= 0) { label = "Water due today"; urgency = "due"; }
  else if (daysUntil === 1) { label = "Water tomorrow"; urgency = "soon"; }
  else { label = `Water in ${daysUntil} days`; urgency = "ok"; }
  if (rainSoon) { label = "Rain expected — check soil first"; urgency = "soon"; }

  return { daysUntil, label, urgency, interval, rainSoon };
}

export function getSearchSuggestions(query, limit = 3) {
  const q = String(query || "").toLowerCase().trim();
  if (!q || q.length < 2) return [];
  const scored = produceData
    .map((item) => {
      const name = String(item.name || "").toLowerCase();
      let score = 0;
      if (name.startsWith(q)) score = 100;
      else if (name.includes(q)) score = 80;
      else {
        let matched = 0;
        for (const char of q) { if (name.includes(char)) matched += 1; }
        score = (matched / q.length) * 40;
      }
      return { item, score };
    })
    .filter((entry) => entry.score >= 30)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.item);
}

export const WATERING_STREAK_GAP_DAYS = 4;

export const WHATS_NEW_VERSION = "update-1";

export const WHATS_NEW_ITEMS = [
  "🔥 Streak celebrations when you hit milestones",
  "💧 Smarter watering reminders and weekly stats",
  "📅 New 'Today' filter in your care log",
  "✨ Smoother animations and polish throughout",
];

export function getWateringStreak(plantName, wateringHistory) {
  const history = wateringHistory?.[plantName];
  if (!Array.isArray(history) || !history.length) return 0;
  const dates = Array.from(new Set(history.map((d) => String(d).slice(0, 10))))
    .sort();
  const newest = dates[dates.length - 1];
  if (getDaysSince(newest) > WATERING_STREAK_GAP_DAYS) return 0;
  let streak = 1;
  for (let i = dates.length - 1; i > 0; i -= 1) {
    const current = new Date(`${dates[i]}T12:00:00`);
    const previous = new Date(`${dates[i - 1]}T12:00:00`);
    const gap = Math.round((current - previous) / (1000 * 60 * 60 * 24));
    if (gap <= WATERING_STREAK_GAP_DAYS) streak += 1;
    else break;
  }
  return streak;
}

export function getStreakDaysLeft(plantName, wateringHistory) {
  const streak = getWateringStreak(plantName, wateringHistory);
  if (streak < 2) return null;
  const history = wateringHistory?.[plantName];
  if (!Array.isArray(history) || !history.length) return null;
  const newest = Array.from(new Set(history.map((d) => String(d).slice(0, 10)))).sort().pop();
  const sinceWater = getDaysSince(newest);
  if (sinceWater === null || sinceWater <= 0) return null;
  const daysLeft = WATERING_STREAK_GAP_DAYS - sinceWater;
  if (daysLeft <= 0 || daysLeft > 2) return null;
  return daysLeft;
}

export function getAchievementBadges({
  savedPlants,
  followedPlants,
  journalEntries,
  gardenMap,
  wateredPlants,
  streakData,
  gardenXP,
  careLog,
  harvestTrackers,
  fertilizerTrackers,
  harvestLog,
}) {
  const today = getTodayKey();
  const wateredTodayCount = Object.values(wateredPlants || {}).filter((value) => value === today).length;
  const totalWateredCount = Object.values(wateredPlants || {}).filter(Boolean).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const streakCount = streakData?.count || 0;
  const careLogCount = (careLog || []).length;
  const harvestCount = Array.isArray(harvestLog) ? harvestLog.length : 0;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).length;

const allUnlocked =
  savedPlants.length >= 50 &&
  (gardenXP?.level || 0) >= 100 &&
  journalEntries.length >= 50 &&
  Object.values(gardenMap || {}).filter(Boolean).length >= 12 &&
  (careLog || []).length >= 25 &&
  Object.keys(harvestTrackers || {}).length >= 5;

  return [
    // ── PLANT SAVING ─────────────────────────────────────────────
    {
      id: "first_plant_saved",
      category: "🌱 Plant Saving",
      icon: "🌱",
      title: "First Plant Saved",
      unlocked: savedPlants.length >= 1,
      progress: Math.min(savedPlants.length, 1),
      goal: 1,
      text: `Save your first plant. ${Math.min(savedPlants.length, 1)}/1 saved.`,
    },
    {
      id: "save_5_plants",
      category: "🌱 Plant Saving",
      icon: "🪴",
      title: "Green Thumb",
      unlocked: savedPlants.length >= 5,
      progress: Math.min(savedPlants.length, 5),
      goal: 5,
      text: `Save 5 plants. ${savedPlants.length}/5 saved.`,
    },
    {
      id: "save_10_plants",
      category: "🌱 Plant Saving",
      icon: "🌿",
      title: "Garden Collector",
      unlocked: savedPlants.length >= 10,
      progress: Math.min(savedPlants.length, 10),
      goal: 10,
      text: `Save 10 plants. ${savedPlants.length}/10 saved.`,
    },
    {
      id: "save_15_plants",
      category: "🌱 Plant Saving",
      icon: "🏅",
      title: "Zone Master",
      unlocked: savedPlants.length >= 15,
      progress: Math.min(savedPlants.length, 15),
      goal: 15,
      text: `Save 15 plants. ${savedPlants.length}/15 saved.`,
    },
    {
      id: "save_25_plants",
      category: "🌱 Plant Saving",
      icon: "🌳",
      title: "Plant Library Master",
      unlocked: savedPlants.length >= 25,
      progress: Math.min(savedPlants.length, 25),
      goal: 25,
      text: `Save 25 plants. ${savedPlants.length}/25 saved.`,
    },
    {
      id: "save_50_plants",
      category: "🌱 Plant Saving",
      icon: "🏆",
      title: "Plant Encyclopedia",
      unlocked: savedPlants.length >= 50,
      progress: Math.min(savedPlants.length, 50),
      goal: 50,
      text: `Save 50 plants. ${savedPlants.length}/50 saved.`,
    },

    // ── WATERING ─────────────────────────────────────────────────
    {
      id: "water_one_today",
      category: "💧 Watering",
      icon: "💧",
      title: "Daily Water Check",
      unlocked: wateredTodayCount >= 1,
      progress: Math.min(wateredTodayCount, 1),
      goal: 1,
      text: `Water 1 plant today. ${wateredTodayCount}/1 watered.`,
    },
    {
      id: "water_three_today",
      category: "💧 Watering",
      icon: "🚿",
      title: "Water Watcher",
      unlocked: wateredTodayCount >= 3,
      progress: Math.min(wateredTodayCount, 3),
      goal: 3,
      text: `Water 3 plants today. ${wateredTodayCount}/3 watered.`,
    },
    {
      id: "water_25_total",
      category: "💧 Watering",
      icon: "🌦️",
      title: "Consistent Gardener",
      unlocked: totalWateredCount >= 25,
      progress: Math.min(totalWateredCount, 25),
      goal: 25,
      text: `Water plants 25 times total. ${totalWateredCount}/25 completed.`,
    },
    {
      id: "water_50_total",
      category: "💧 Watering",
      icon: "🌊",
      title: "Watering Legend",
      unlocked: totalWateredCount >= 50,
      progress: Math.min(totalWateredCount, 50),
      goal: 50,
      text: `Water plants 50 times. ${totalWateredCount}/50 completed.`,
    },
    {
      id: "water_100_total",
      category: "💧 Watering",
      icon: "🏄",
      title: "Water Master",
      unlocked: totalWateredCount >= 100,
      progress: Math.min(totalWateredCount, 100),
      goal: 100,
      text: `Water plants 100 times. ${totalWateredCount}/100 completed.`,
    },

    // ── STREAKS ──────────────────────────────────────────────────
    {
      id: "streak_3",
      category: "🔥 Streaks",
      icon: "✨",
      title: "Getting Started",
      unlocked: streakCount >= 3,
      progress: Math.min(streakCount, 3),
      goal: 3,
      text: `Use Pocket Planter 3 days in a row. ${streakCount}/3 days.`,
    },
    {
      id: "streak_7",
      category: "🔥 Streaks",
      icon: "🔥",
      title: "7-Day Streak",
      unlocked: streakCount >= 7,
      progress: Math.min(streakCount, 7),
      goal: 7,
      text: `Use Pocket Planter 7 days in a row. ${streakCount}/7 days.`,
    },
    {
      id: "streak_14",
      category: "🔥 Streaks",
      icon: "🔥",
      title: "Dedicated Grower",
      unlocked: streakCount >= 14,
      progress: Math.min(streakCount, 14),
      goal: 14,
      text: `Use Pocket Planter 14 days in a row. ${streakCount}/14 days.`,
    },
    {
      id: "streak_30",
      category: "🔥 Streaks",
      icon: "⚡",
      title: "Garden Obsessed",
      unlocked: streakCount >= 30,
      progress: Math.min(streakCount, 30),
      goal: 30,
      text: `Use Pocket Planter 30 days in a row. ${streakCount}/30 days.`,
    },
    {
      id: "streak_60",
      category: "🔥 Streaks",
      icon: "🏆",
      title: "Garden Master",
      unlocked: streakCount >= 60,
      progress: Math.min(streakCount, 60),
      goal: 60,
      text: `Use Pocket Planter 60 days in a row. ${streakCount}/60 days.`,
    },

    // ── JOURNAL ──────────────────────────────────────────────────
    {
      id: "first_journal_photo",
      category: "📸 Journal",
      icon: "📸",
      title: "First Garden Photo",
      unlocked: journalEntries.length >= 1,
      progress: Math.min(journalEntries.length, 1),
      goal: 1,
      text: `Add your first journal photo. ${journalEntries.length}/1 added.`,
    },
    {
      id: "photo_5",
      category: "📸 Journal",
      icon: "📷",
      title: "Snapshot Garden",
      unlocked: journalEntries.length >= 5,
      progress: Math.min(journalEntries.length, 5),
      goal: 5,
      text: `Add 5 garden photos. ${journalEntries.length}/5 added.`,
    },
    {
      id: "photo_logger",
      category: "📸 Journal",
      icon: "🖼️",
      title: "Photo Logger",
      unlocked: journalEntries.length >= 10,
      progress: Math.min(journalEntries.length, 10),
      goal: 10,
      text: `Add 10 garden photos. ${journalEntries.length}/10 added.`,
    },
    {
      id: "garden_album",
      category: "📸 Journal",
      icon: "🎨",
      title: "Garden Historian",
      unlocked: journalEntries.length >= 25,
      progress: Math.min(journalEntries.length, 25),
      goal: 25,
      text: `Add 25 garden photos. ${journalEntries.length}/25 added.`,
    },
    {
      id: "photo_50",
      category: "📸 Journal",
      icon: "🏅",
      title: "Garden Documentarian",
      unlocked: journalEntries.length >= 50,
      progress: Math.min(journalEntries.length, 50),
      goal: 50,
      text: `Add 50 garden photos. ${journalEntries.length}/50 added.`,
    },

    // ── GARDEN MAP ───────────────────────────────────────────────
    {
      id: "first_plot",
      category: "🗺️ Garden Map",
      icon: "🗺️",
      title: "First Plot Filled",
      unlocked: gardenPlotCount >= 1,
      progress: Math.min(gardenPlotCount, 1),
      goal: 1,
      text: `Fill your first garden plot. ${gardenPlotCount}/1 filled.`,
    },
    {
      id: "plot_builder",
      category: "🗺️ Garden Map",
      icon: "🏡",
      title: "Plot Builder",
      unlocked: gardenPlotCount >= 6,
      progress: Math.min(gardenPlotCount, 6),
      goal: 6,
      text: `Fill 6 garden plots. ${gardenPlotCount}/6 filled.`,
    },
    {
      id: "full_garden",
      category: "🗺️ Garden Map",
      icon: "🌍",
      title: "Full Garden",
      unlocked: gardenPlotCount >= 12,
      progress: Math.min(gardenPlotCount, 12),
      goal: 12,
      text: `Fill all 12 garden plots. ${gardenPlotCount}/12 filled.`,
    },

    // ── CARE LOG ─────────────────────────────────────────────────
    {
      id: "first_care_log",
      category: "🧪 Care Log",
      icon: "🧪",
      title: "First Care Entry",
      unlocked: careLogCount >= 1,
      progress: Math.min(careLogCount, 1),
      goal: 1,
      text: `Log your first care action. ${careLogCount}/1 logged.`,
    },
    {
      id: "care_log_5",
      category: "🧪 Care Log",
      icon: "🌿",
      title: "Soil Scientist",
      unlocked: careLogCount >= 5,
      progress: Math.min(careLogCount, 5),
      goal: 5,
      text: `Log 5 care actions. ${careLogCount}/5 logged.`,
    },
    {
      id: "care_log_10",
      category: "🧪 Care Log",
      icon: "🧬",
      title: "Care Expert",
      unlocked: careLogCount >= 10,
      progress: Math.min(careLogCount, 10),
      goal: 10,
      text: `Log 10 care actions. ${careLogCount}/10 logged.`,
    },
    {
      id: "care_log_25",
      category: "🧪 Care Log",
      icon: "🏆",
      title: "Garden Scientist",
      unlocked: careLogCount >= 25,
      progress: Math.min(careLogCount, 25),
      goal: 25,
      text: `Log 25 care actions. ${careLogCount}/25 logged.`,
    },

    // ── HARVEST ──────────────────────────────────────────────────
    {
      id: "first_harvest",
      category: "🚜 Harvest",
      icon: "🚜",
      title: "First Harvest Tracked",
      unlocked: harvestCount >= 1,
      progress: Math.min(harvestCount, 1),
      goal: 1,
      text: `Track your first harvest. ${harvestCount}/1 tracked.`,
    },
    {
      id: "harvest_3",
      category: "🚜 Harvest",
      icon: "🍅",
      title: "Harvest King",
      unlocked: harvestCount >= 3,
      progress: Math.min(harvestCount, 3),
      goal: 3,
      text: `Track 3 harvests. ${harvestCount}/3 tracked.`,
    },
    {
      id: "harvest_5",
      category: "🚜 Harvest",
      icon: "🌽",
      title: "Harvest Legend",
      unlocked: harvestCount >= 5,
      progress: Math.min(harvestCount, 5),
      goal: 5,
      text: `Track 5 harvests. ${harvestCount}/5 tracked.`,
    },
    {
      id: "harvest_ready",
      category: "🚜 Harvest",
      icon: "🎉",
      title: "Harvest Day!",
      unlocked: harvestsReady >= 1,
      progress: Math.min(harvestsReady, 1),
      goal: 1,
      text: `Have a plant ready to harvest. ${harvestsReady}/1 ready.`,
    },

    // ── LEVEL MILESTONES ─────────────────────────────────────────
    { id: "level_5", category: "⭐ Levels", icon: "🌱", title: "Backyard Grower", unlocked: (gardenXP?.level || 0) >= 5, progress: Math.min(gardenXP?.level || 0, 5), goal: 5, text: `Reach Level 5. Level ${gardenXP?.level || 0}/5.` },
{ id: "level_10", category: "⭐ Levels", icon: "🪴", title: "Green Thumb", unlocked: (gardenXP?.level || 0) >= 10, progress: Math.min(gardenXP?.level || 0, 10), goal: 10, text: `Reach Level 10. Level ${gardenXP?.level || 0}/10.` },
{ id: "level_15", category: "⭐ Levels", icon: "🌿", title: "Harvest Keeper", unlocked: (gardenXP?.level || 0) >= 15, progress: Math.min(gardenXP?.level || 0, 15), goal: 15, text: `Reach Level 15. Level ${gardenXP?.level || 0}/15.` },
{ id: "level_20", category: "⭐ Levels", icon: "🌾", title: "Garden Sage", unlocked: (gardenXP?.level || 0) >= 20, progress: Math.min(gardenXP?.level || 0, 20), goal: 20, text: `Reach Level 20. Level ${gardenXP?.level || 0}/20.` },
{ id: "level_25", category: "⭐ Levels", icon: "🧪", title: "Plant Whisperer", unlocked: (gardenXP?.level || 0) >= 25, progress: Math.min(gardenXP?.level || 0, 25), goal: 25, text: `Reach Level 25. Level ${gardenXP?.level || 0}/25.` },
{ id: "level_30", category: "⭐ Levels", icon: "🔬", title: "Soil Scientist", unlocked: (gardenXP?.level || 0) >= 30, progress: Math.min(gardenXP?.level || 0, 30), goal: 30, text: `Reach Level 30. Level ${gardenXP?.level || 0}/30.` },
{ id: "level_35", category: "⭐ Levels", icon: "🗺️", title: "Garden Architect", unlocked: (gardenXP?.level || 0) >= 35, progress: Math.min(gardenXP?.level || 0, 35), goal: 35, text: `Reach Level 35. Level ${gardenXP?.level || 0}/35.` },
{ id: "level_40", category: "⭐ Levels", icon: "🏅", title: "Zone Master", unlocked: (gardenXP?.level || 0) >= 40, progress: Math.min(gardenXP?.level || 0, 40), goal: 40, text: `Reach Level 40. Level ${gardenXP?.level || 0}/40.` },
{ id: "level_45", category: "⭐ Levels", icon: "🚜", title: "Harvest Legend", unlocked: (gardenXP?.level || 0) >= 45, progress: Math.min(gardenXP?.level || 0, 45), goal: 45, text: `Reach Level 45. Level ${gardenXP?.level || 0}/45.` },
{ id: "level_50", category: "⭐ Levels", icon: "🏆", title: "Master Botanist", unlocked: (gardenXP?.level || 0) >= 50, progress: Math.min(gardenXP?.level || 0, 50), goal: 50, text: `Reach Level 50. Level ${gardenXP?.level || 0}/50.` },
{ id: "level_55", category: "⭐ Levels", icon: "🔮", title: "Garden Oracle", unlocked: (gardenXP?.level || 0) >= 55, progress: Math.min(gardenXP?.level || 0, 55), goal: 55, text: `Reach Level 55. Level ${gardenXP?.level || 0}/55.` },
{ id: "level_60", category: "⭐ Levels", icon: "👑", title: "Legendary Grower", unlocked: (gardenXP?.level || 0) >= 60, progress: Math.min(gardenXP?.level || 0, 60), goal: 60, text: `Reach Level 60. Level ${gardenXP?.level || 0}/60.` },
{ id: "level_65", category: "⭐ Levels", icon: "⚡", title: "Elite Cultivator", unlocked: (gardenXP?.level || 0) >= 65, progress: Math.min(gardenXP?.level || 0, 65), goal: 65, text: `Reach Level 65. Level ${gardenXP?.level || 0}/65.` },
{ id: "level_70", category: "⭐ Levels", icon: "🌍", title: "Grand Gardener", unlocked: (gardenXP?.level || 0) >= 70, progress: Math.min(gardenXP?.level || 0, 70), goal: 70, text: `Reach Level 70. Level ${gardenXP?.level || 0}/70.` },
{ id: "level_75", category: "⭐ Levels", icon: "📖", title: "Garden Mythkeeper", unlocked: (gardenXP?.level || 0) >= 75, progress: Math.min(gardenXP?.level || 0, 75), goal: 75, text: `Reach Level 75. Level ${gardenXP?.level || 0}/75.` },
{ id: "level_80", category: "⭐ Levels", icon: "🌀", title: "Ancient Cultivator", unlocked: (gardenXP?.level || 0) >= 80, progress: Math.min(gardenXP?.level || 0, 80), goal: 80, text: `Reach Level 80. Level ${gardenXP?.level || 0}/80.` },
{ id: "level_85", category: "⭐ Levels", icon: "💫", title: "Garden Immortal", unlocked: (gardenXP?.level || 0) >= 85, progress: Math.min(gardenXP?.level || 0, 85), goal: 85, text: `Reach Level 85. Level ${gardenXP?.level || 0}/85.` },
{ id: "level_90", category: "⭐ Levels", icon: "✨", title: "Celestial Grower", unlocked: (gardenXP?.level || 0) >= 90, progress: Math.min(gardenXP?.level || 0, 90), goal: 90, text: `Reach Level 90. Level ${gardenXP?.level || 0}/90.` },
{ id: "level_95", category: "⭐ Levels", icon: "🌙", title: "Garden Transcendent", unlocked: (gardenXP?.level || 0) >= 95, progress: Math.min(gardenXP?.level || 0, 95), goal: 95, text: `Reach Level 95. Level ${gardenXP?.level || 0}/95.` },
{ id: "level_100", category: "⭐ Levels", icon: "🌟", title: "Garden Gnome", unlocked: (gardenXP?.level || 0) >= 100, progress: Math.min(gardenXP?.level || 0, 100), goal: 100, text: `Reach Level 100. Level ${gardenXP?.level || 0}/100.` },
{
  id: "garden_gnome_ultimate",
  category: "🌟 Legend",
  icon: allUnlocked ? "🌟" : "❓",
  title: allUnlocked ? "The Garden Gnome" : "???",
  unlocked: allUnlocked,
  progress: allUnlocked ? 1 : 0,
  goal: 1,
  text: allUnlocked
    ? "You've mastered every corner of Pocket Planter. You are a true Garden Gnome. 🌟"
    : "Complete every achievement and reach Level 100 to reveal this secret.",
  hidden: !allUnlocked,
},
  ];
}

export const PROFILE_THEMES = [
  { id: "forest", name: "Forest", emoji: "🌲", color: "#5cff89", bg: "rgba(92,255,137,0.18)", border: "#5cff89", accent: "#5cff89" },
  { id: "sunset", name: "Sunset Garden", emoji: "🌅", color: "#ffd86b", bg: "rgba(255,216,107,0.18)", border: "#ffd86b", accent: "#ffd86b" },
  { id: "midnight", name: "Midnight Greenhouse", emoji: "🌙", color: "#6bc7ff", bg: "rgba(107,199,255,0.18)", border: "#6bc7ff", accent: "#6bc7ff" },
  { id: "tropical", name: "Tropical Jungle", emoji: "🌴", color: "#8effab", bg: "rgba(142,255,171,0.18)", border: "#8effab", accent: "#8effab" },
];

export function getProfileBanners({ gardenXP, savedPlants, journalEntries, gardenMap, wateredPlants, streakData, harvestTrackers, careLog, comparePlants, premiumUnlocked }) {
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const totalWatered = Object.values(wateredPlants || {}).filter(Boolean).length;
  const streakCount = streakData?.count || 0;
  const harvestCount = Object.keys(harvestTrackers || {}).length;
  const careLogCount = (careLog || []).length;
  const comparePlantCount = (comparePlants || []).length;

  return [
    // ORIGINAL 7
    { id: "seedling_banner", emoji: "🌱", title: "Seedling Starter", subtitle: "Unlocked at Level 1", unlocked: gardenXP.level >= 1, gradient: ["#5cff89","#1f7a3a"] },
    { id: "green_thumb_banner", emoji: "🪴", title: "Green Thumb", subtitle: "Reach Level 5", unlocked: gardenXP.level >= 5, gradient: ["#8effab","#2fbf5f"] },
    { id: "harvest_banner", emoji: "🌾", title: "Harvest Keeper", subtitle: "Reach Level 8", unlocked: gardenXP.level >= 8, gradient: ["#ffd86b","#bf7a12"] },
    { id: "master_banner", emoji: "🏆", title: "Master Botanist", subtitle: "Reach Level 20", unlocked: gardenXP.level >= 20, gradient: ["#d8c8ff","#7b3ff2"] },
    { id: "collector_banner", emoji: "🧺", title: "Plant Collector", subtitle: "Save 10 plants", unlocked: savedPlants.length >= 10, gradient: ["#6bc7ff","#315fd6"] },
    { id: "journal_banner", emoji: "📸", title: "Garden Historian", subtitle: "Add 10 journal photos", unlocked: journalEntries.length >= 10, gradient: ["#ffb3d9","#bf3f7f"] },
    { id: "planner_banner", emoji: "🗺️", title: "Garden Architect", subtitle: "Fill all 12 garden plots", unlocked: gardenPlotCount >= 12, gradient: ["#f6d28a","#8a5a12"] },

    // NEW 14
    { id: "streak_banner", emoji: "🔥", title: "Streak Keeper", subtitle: "7 day streak", unlocked: streakCount >= 7, gradient: ["#ff9f43","#cc5500"] },
    { id: "obsessed_banner", emoji: "⚡", title: "Garden Obsessed", subtitle: "30 day streak", unlocked: streakCount >= 30, gradient: ["#ffd86b","#ff6b00"] },
    { id: "water_wizard_banner", emoji: "💧", title: "Water Wizard", subtitle: "Water 50 plants total", unlocked: totalWatered >= 50, gradient: ["#6bc7ff","#0066cc"] },
    { id: "master_waterer_banner", emoji: "🌊", title: "Master Waterer", subtitle: "Water 100 plants total", unlocked: totalWatered >= 100, gradient: ["#00c6ff","#0072ff"] },
    { id: "soil_scientist_banner", emoji: "🧪", title: "Soil Scientist", subtitle: "Log 10 care actions", unlocked: careLogCount >= 10, gradient: ["#8effab","#00b894"] },
    { id: "care_expert_banner", emoji: "🌿", title: "Care Expert", subtitle: "Log 25 care actions", unlocked: careLogCount >= 25, gradient: ["#00b894","#006644"] },
    { id: "snapshot_banner", emoji: "📸", title: "Snapshot Garden", subtitle: "Add 5 journal photos", unlocked: journalEntries.length >= 5, gradient: ["#fd79a8","#e84393"] },
    { id: "garden_historian_banner", emoji: "🎨", title: "Garden Historian", subtitle: "Add 25 journal photos", unlocked: journalEntries.length >= 25, gradient: ["#a29bfe","#6c5ce7"] },
    { id: "zone_master_banner", emoji: "🏅", title: "Zone Master", subtitle: "Save 15 plants", unlocked: savedPlants.length >= 15, gradient: ["#ffeaa7","#fdcb6e"] },
    { id: "legendary_grower_banner", emoji: "👑", title: "Legendary Grower", subtitle: "Reach Level 15", unlocked: gardenXP.level >= 15, gradient: ["#ffd700","#ff8c00"] },
    { id: "full_garden_banner", emoji: "🌍", title: "Full Garden", subtitle: "Fill all 12 plots", unlocked: gardenPlotCount >= 12, gradient: ["#55efc4","#00b894"] },
    { id: "harvest_king_banner", emoji: "🍅", title: "Harvest King", subtitle: "Track 5 harvests", unlocked: harvestCount >= 5, gradient: ["#ff7675","#d63031"] },
    { id: "companion_pro_banner", emoji: "🌸", title: "Companion Pro", subtitle: "Unlock companion planting", unlocked: premiumUnlocked, gradient: ["#fd79a8","#e17055"] },
    { id: "quest_crusher_banner", emoji: "🎯", title: "Quest Crusher", subtitle: "Complete 10 daily quests", unlocked: gardenXP.xp >= 500, gradient: ["#74b9ff","#0984e3"] },
  ];
}

export function getDailyQuests({ savedPlants, journalEntries, gardenMap, wateredPlants, careLog, harvestTrackers, streakData, harvestLog, fertilizerTrackers, comparePlants }) {
  const today = getTodayKey();
  const dayOfWeek = new Date().getDay();
  const wateredTodayCount = Object.values(wateredPlants || {}).filter((value) => value === today).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const todayPhotos = journalEntries.filter(e => e.createdAt?.startsWith(today)).length;
  const todayCareLog = (careLog || []).filter(e => e.date === today).length;
  const streakCount = streakData?.count || 0;
  const harvestsReady = Object.entries(harvestTrackers || {}).filter(([, t]) => {
    return Math.max(0, t.days - Math.floor((new Date() - new Date(t.startedAt)) / (1000 * 60 * 60 * 24))) === 0;
  }).length;
  const fertilizerCount = Object.keys(fertilizerTrackers || {}).length;
  const harvestLogToday = (harvestLog || []).filter((h) => h.date === today || (h.createdAt || "").startsWith(today)).length;
  const compareCount = (comparePlants || []).length;

  const allQuests = [
    // EASY — 15 XP
    { id: "water_one", icon: "💧", title: "Water 1 plant", description: "Mark any saved plant as watered today.", difficulty: "Easy", progress: Math.min(wateredTodayCount, 1), goal: 1, completed: wateredTodayCount >= 1, reward: 15 },
    { id: "save_one", icon: "🌱", title: "Save a plant", description: "Browse the Plants tab and save a new plant.", difficulty: "Easy", progress: Math.min(savedPlants.length, 1), goal: 1, completed: savedPlants.length >= 1, reward: 15 },
    { id: "open_app", icon: "📱", title: "Daily check-in", description: "Open Pocket Planter and check your garden.", difficulty: "Easy", progress: 1, goal: 1, completed: true, reward: 15 },
    { id: "check_weather", icon: "🌤️", title: "Check today's weather", description: "Visit the Weather tab to see today's forecast.", difficulty: "Easy", progress: 1, goal: 1, completed: true, reward: 15 },
    { id: "streak_keep", icon: "🔥", title: "Keep your streak", description: "Open the app today to maintain your streak.", difficulty: "Easy", progress: streakCount >= 1 ? 1 : 0, goal: 1, completed: streakCount >= 1, reward: 15 },

    // MEDIUM — 25 XP
    { id: "water_three", icon: "🚿", title: "Water 3 plants", description: "Mark 3 saved plants as watered today.", difficulty: "Medium", progress: Math.min(wateredTodayCount, 3), goal: 3, completed: wateredTodayCount >= 3, reward: 25 },
    { id: "journal_one", icon: "📸", title: "Add a journal photo", description: "Document your garden with a photo today.", difficulty: "Medium", progress: Math.min(todayPhotos, 1), goal: 1, completed: todayPhotos >= 1, reward: 25 },
    { id: "plan_one", icon: "🗺️", title: "Place a plant in garden map", description: "Add or rearrange a plant in your garden planner.", difficulty: "Medium", progress: Math.min(gardenPlotCount, 1), goal: 1, completed: gardenPlotCount >= 1, reward: 25 },
    { id: "care_log_one", icon: "🧪", title: "Log a care action", description: "Record a care action in your Soil & Care Log.", difficulty: "Medium", progress: Math.min(todayCareLog, 1), goal: 1, completed: todayCareLog >= 1, reward: 25 },
    { id: "save_three", icon: "🪴", title: "Save 3 plants", description: "Have at least 3 plants saved in your collection.", difficulty: "Medium", progress: Math.min(savedPlants.length, 3), goal: 3, completed: savedPlants.length >= 3, reward: 25 },
    { id: "water_five", icon: "💦", title: "Water 5 plants", description: "Mark 5 saved plants as watered today.", difficulty: "Medium", progress: Math.min(wateredTodayCount, 5), goal: 5, completed: wateredTodayCount >= 5, reward: 25 },
    { id: "fill_plots", icon: "🏡", title: "Fill 3 garden plots", description: "Have at least 3 plants placed in your garden map.", difficulty: "Medium", progress: Math.min(gardenPlotCount, 3), goal: 3, completed: gardenPlotCount >= 3, reward: 25 },

    // HARD — 50 XP
    { id: "water_all", icon: "🌊", title: "Water all your plants", description: "Mark every saved plant as watered today.", difficulty: "Hard", progress: Math.min(wateredTodayCount, Math.max(savedPlants.length, 1)), goal: Math.max(savedPlants.length, 1), completed: savedPlants.length > 0 && wateredTodayCount >= savedPlants.length, reward: 50 },
    { id: "journal_three", icon: "🖼️", title: "Add 3 journal photos", description: "Log 3 garden photos today.", difficulty: "Hard", progress: Math.min(todayPhotos, 3), goal: 3, completed: todayPhotos >= 3, reward: 50 },
    { id: "save_five", icon: "🌿", title: "Save 5 plants", description: "Have at least 5 plants saved in your collection.", difficulty: "Hard", progress: Math.min(savedPlants.length, 5), goal: 5, completed: savedPlants.length >= 5, reward: 50 },
    { id: "care_log_three", icon: "🔬", title: "Log 3 care actions", description: "Record 3 care actions in your Soil & Care Log today.", difficulty: "Hard", progress: Math.min(todayCareLog, 3), goal: 3, completed: todayCareLog >= 3, reward: 50 },
    { id: "harvest_check", icon: "🎉", title: "Check your harvests", description: "Have a plant ready to harvest.", difficulty: "Hard", progress: Math.min(harvestsReady, 1), goal: 1, completed: harvestsReady >= 1, reward: 50 },
    { id: "full_garden_plot", icon: "🌍", title: "Fill 6 garden plots", description: "Have at least 6 plants placed in your garden map.", difficulty: "Hard", progress: Math.min(gardenPlotCount, 6), goal: 6, completed: gardenPlotCount >= 6, reward: 50 },

    // BONUS SURPRISE — 50 XP
    { id: "photo_and_water", icon: "🌟", title: "Water & document", description: "Water a plant and snap a progress photo — a good daily garden habit.", difficulty: "Bonus", progress: Math.min(todayPhotos >= 1 && wateredTodayCount >= 1 ? 1 : 0, 1), goal: 1, completed: todayPhotos >= 1 && wateredTodayCount >= 1, reward: 50 },
    { id: "care_and_water", icon: "💪", title: "Full care day", description: "Water 3 plants and log a care action, like feeding or pruning.", difficulty: "Bonus", progress: todayCareLog >= 1 && wateredTodayCount >= 3 ? 1 : 0, goal: 1, completed: todayCareLog >= 1 && wateredTodayCount >= 3, reward: 50 },

    // ── MORE EASY ──
    { id: "fertilize_one", icon: "🌾", title: "Feed a plant", description: "Start a fertilizer tracker for any plant.", difficulty: "Easy", progress: Math.min(fertilizerCount, 1), goal: 1, completed: fertilizerCount >= 1, reward: 15 },
    { id: "harvest_one", icon: "🧺", title: "Log a harvest", description: "Record something you picked from your garden.", difficulty: "Easy", progress: Math.min(harvestLogToday, 1), goal: 1, completed: harvestLogToday >= 1, reward: 15 },
    { id: "check_month", icon: "🗓️", title: "Check this month's picks", description: "Open the Plants tab to see what to plant now.", difficulty: "Easy", progress: 1, goal: 1, completed: true, reward: 15 },

    // ── MORE MEDIUM ──
    { id: "compare_two", icon: "⚖️", title: "Compare two plants", description: "Use Compare on the Plants tab to weigh two options.", difficulty: "Medium", progress: Math.min(compareCount, 2), goal: 2, completed: compareCount >= 2, reward: 25 },
    { id: "care_two", icon: "🧫", title: "Log 2 care actions", description: "Record two care actions today.", difficulty: "Medium", progress: Math.min(todayCareLog, 2), goal: 2, completed: todayCareLog >= 2, reward: 25 },
    { id: "photo_two", icon: "📷", title: "Add 2 journal photos", description: "Document your garden twice today.", difficulty: "Medium", progress: Math.min(todayPhotos, 2), goal: 2, completed: todayPhotos >= 2, reward: 25 },
    { id: "save_seven", icon: "🌻", title: "Grow to 7 plants", description: "Have at least 7 plants saved.", difficulty: "Medium", progress: Math.min(savedPlants.length, 7), goal: 7, completed: savedPlants.length >= 7, reward: 25 },

    // ── MORE HARD ──
    { id: "harvest_two", icon: "🚜", title: "Log 2 harvests", description: "Record two harvests today.", difficulty: "Hard", progress: Math.min(harvestLogToday, 2), goal: 2, completed: harvestLogToday >= 2, reward: 50 },
    { id: "fill_nine", icon: "🏞️", title: "Fill 9 garden plots", description: "Have at least 9 plants placed in your garden.", difficulty: "Hard", progress: Math.min(gardenPlotCount, 9), goal: 9, completed: gardenPlotCount >= 9, reward: 50 },
    { id: "save_ten", icon: "📚", title: "Save 10 plants", description: "Reach 10 saved plants in your collection.", difficulty: "Hard", progress: Math.min(savedPlants.length, 10), goal: 10, completed: savedPlants.length >= 10, reward: 50 },
    { id: "fertilize_three", icon: "🌱", title: "Feed 3 plants", description: "Have fertilizer trackers on 3 plants.", difficulty: "Hard", progress: Math.min(fertilizerCount, 3), goal: 3, completed: fertilizerCount >= 3, reward: 50 },

    // ── MORE BONUS ──
    { id: "triple_threat", icon: "🏆", title: "Complete garden routine", description: "Water, photograph, and log a care action — a full round of garden care today.", difficulty: "Bonus", progress: (wateredTodayCount >= 1 && todayPhotos >= 1 && todayCareLog >= 1) ? 1 : 0, goal: 1, completed: wateredTodayCount >= 1 && todayPhotos >= 1 && todayCareLog >= 1, reward: 75 },
    { id: "streak_14", icon: "💫", title: "14-Day Streak!", description: "Use Pocket Planter 14 days in a row.", difficulty: "Bonus", progress: Math.min(streakCount, 14), goal: 14, completed: streakCount >= 14, reward: 75 },
    { id: "harvest_and_care", icon: "🌾", title: "Harvest day care", description: "Pick something and log a care action the same day to keep the bed productive.", difficulty: "Bonus", progress: (harvestLogToday >= 1 && todayCareLog >= 1) ? 1 : 0, goal: 1, completed: harvestLogToday >= 1 && todayCareLog >= 1, reward: 75 },
  ];

  // Pick 5 quests — always show 1 easy, 2 medium, 1 hard, 1 bonus
  const easy = allQuests.filter(q => q.difficulty === "Easy");
  const medium = allQuests.filter(q => q.difficulty === "Medium");
  const hard = allQuests.filter(q => q.difficulty === "Hard");
  const bonus = allQuests.filter(q => q.difficulty === "Bonus");

  const pick = (arr, index) => arr[index % arr.length];

  return [
    pick(easy, dayOfWeek),
    pick(medium, dayOfWeek),
    pick(medium, dayOfWeek + 2),
    pick(hard, dayOfWeek),
    pick(hard, dayOfWeek + 3),
    pick(bonus, dayOfWeek),
  ];
}

export function getConsistencyBonus(streakCount) {
  const c = streakCount || 0;
  // Rewards sustained streaks with escalating one-time bonus XP tiers.
  if (c >= 60) return 600;
  if (c >= 30) return 300;
  if (c >= 14) return 120;
  if (c >= 7) return 50;
  if (c >= 3) return 15;
  return 0;
}

export function getFrameColor(level) {
  if (level >= 100) return "#ffffff";
  if (level >= 75) return "#ffd86b";
  if (level >= 50) return "#d8c8ff";
  if (level >= 25) return "#6bc7ff";
  if (level >= 10) return "#ff9f43";
  return "#5cff89";
}

export const PEST_WATCH_DATA = [
  { name: "Aphids", emoji: "🐛", climates: ["hot","moderate","cold"], months: [3,4,5,6,9,10], targets: ["Vegetables","Herbs","lettuce","kale","pepper","tomato","cabbage","broccoli"], sign: "Clusters of tiny green/black bugs on new growth and leaf undersides; sticky residue.", fix: "Blast off with water, then treat with insecticidal soap. Ladybugs help long-term.",
    description: "Tiny pear-shaped sap-sucking insects — green, black, or yellow — that cluster on tender new growth and multiply astonishingly fast.",
    damage: "They drain sap so leaves curl and yellow, and their sticky honeydew invites sooty mold. Heavy infestations stunt plants and spread viruses.",
    prevent: "Invite ladybugs and lacewings, avoid over-feeding nitrogen (it fuels soft growth they love), and check new shoots weekly." },
  { name: "Tomato Hornworms", emoji: "🐍", climates: ["hot","moderate","cold"], months: [6,7,8], targets: ["tomato","pepper","eggplant"], sign: "Large green caterpillars and stripped upper leaves; dark droppings on foliage.", fix: "Hand-pick at dusk (they glow under UV light). Bt spray for heavy infestations.",
    description: "Fat green caterpillars up to 4 inches long with a horn-like tail — the larvae of the five-spotted hawkmoth.",
    damage: "They devour leaves and stems overnight and chew holes in fruit, defoliating a tomato plant in days.",
    prevent: "Till soil in fall to destroy pupae, plant dill or marigolds to draw parasitic wasps, and scout at dusk." },
  { name: "Squash Bugs", emoji: "🐞", climates: ["hot","moderate"], months: [6,7,8], targets: ["squash","zucchini","pumpkin","cucumber","melon"], sign: "Bronze egg clusters on leaf undersides; wilting despite moist soil.", fix: "Crush eggs early, remove adults by hand, and keep beds clear of debris.",
    description: "Flat, brownish-grey shield-shaped bugs that gather at the base of squash-family plants.",
    damage: "They pierce stems and leaves to suck sap, causing wilting, yellow spots, and eventual collapse of the vine.",
    prevent: "Rotate cucurbit crops yearly, clear debris they overwinter in, use row covers until flowering, and destroy egg clusters early." },
  { name: "Cabbage Worms", emoji: "🦋", climates: ["hot","moderate","cold"], months: [4,5,6,9,10], targets: ["cabbage","broccoli","kale","cauliflower","brussels"], sign: "White butterflies hovering; ragged holes and green worms on brassicas.", fix: "Row covers early in the season; Bt spray; hand-pick the caterpillars.",
    description: "Velvety green caterpillars — the larvae of the white cabbage butterfly — that blend perfectly into brassica leaves.",
    damage: "They chew ragged holes through leaves and bore into heads, leaving dark frass (droppings) behind.",
    prevent: "Cover brassicas with fine netting so butterflies can't lay eggs, interplant aromatic herbs, and rub off eggs on leaf undersides." },
  { name: "Slugs & Snails", emoji: "🐌", climates: ["moderate","cold"], months: [3,4,5,9,10,11], targets: ["lettuce","spinach","strawberry","Herbs","basil"], sign: "Slime trails and irregular holes in tender leaves, worst after rain.", fix: "Hand-pick at night, use beer traps, or ring beds with copper tape.",
    description: "Soft-bodied mollusks that feed at night and in wet weather, leaving telltale shiny slime trails.",
    damage: "They rasp large, irregular holes in leaves and can strip young seedlings to nothing overnight.",
    prevent: "Water in the morning so soil dries by nightfall, remove hiding spots like boards and thick mulch, and set copper barriers or beer traps." },
  { name: "Spider Mites", emoji: "🕸️", climates: ["hot","moderate"], months: [6,7,8,9], targets: ["tomato","pepper","eggplant","cucumber","beans","melon"], sign: "Fine webbing and stippled, yellow-speckled leaves in hot, dry spells.", fix: "Raise humidity, hose down undersides, and treat with insecticidal soap or neem.",
    description: "Nearly microscopic arachnids that explode in numbers during hot, dry weather and spin fine webbing.",
    damage: "They suck out cell contents, stippling leaves with yellow dots until foliage bronzes, dries, and drops.",
    prevent: "Keep plants well-watered, raise humidity, avoid dusty conditions, and rinse leaf undersides regularly." },
  { name: "Whiteflies", emoji: "🦟", climates: ["hot","moderate"], months: [6,7,8,9], targets: ["tomato","pepper","cucumber","cabbage","Herbs"], sign: "Clouds of tiny white insects fly up when leaves are disturbed; sticky residue.", fix: "Yellow sticky traps, insecticidal soap, and encourage lacewings.",
    description: "Tiny white moth-like insects that gather on leaf undersides and rise in a cloud when a plant is brushed.",
    damage: "They suck sap and weaken plants, coat leaves in sticky honeydew and sooty mold, and transmit viruses.",
    prevent: "Hang yellow sticky traps, inspect new transplants before buying, and encourage lacewings and parasitic wasps." },
  { name: "Flea Beetles", emoji: "🪲", climates: ["hot","moderate","cold"], months: [4,5,6], targets: ["eggplant","radish","arugula","cabbage","tomato"], sign: "Tiny 'shotgun' holes peppering young leaves; small jumping beetles.", fix: "Row covers on seedlings; kaolin clay; keep plants vigorous to outgrow damage.",
    description: "Tiny black or bronze beetles that spring away like fleas the moment you disturb them.",
    damage: "They riddle leaves with small 'shotgun' holes, stunting seedlings and spreading bacterial diseases.",
    prevent: "Float row covers over young plants, delay planting until seedlings toughen up, and keep beds weed-free." },
  { name: "Japanese Beetles", emoji: "🪲", climates: ["cold","moderate"], months: [6,7,8], targets: ["beans","grape","raspberry","rose","basil","corn"], sign: "Metallic green beetles feeding in groups, skeletonizing leaves to lace.", fix: "Hand-pick into soapy water early morning; skip lure traps (they attract more).",
    description: "Shiny metallic green-and-copper beetles that feed in groups on warm, sunny afternoons.",
    damage: "They skeletonize leaves — eating the tissue between veins — and chew flowers and fruit, while their grubs damage roots.",
    prevent: "Hand-pick in the cool morning, keep plants healthy, and treat lawns for grubs; skip pheromone traps that lure more beetles in." },
  { name: "Cucumber Beetles", emoji: "🐞", climates: ["hot","moderate","cold"], months: [5,6,7,8], targets: ["cucumber","squash","zucchini","pumpkin","melon"], sign: "Yellow-and-black striped or spotted beetles; they also spread bacterial wilt.", fix: "Row covers until flowering, then hand-pick; mulch to deter egg-laying.",
    description: "Small yellow beetles marked with black stripes or spots that attack cucurbits from the seedling stage on.",
    damage: "They chew leaves, flowers, and stems and — worst of all — transmit bacterial wilt and mosaic virus that can kill plants.",
    prevent: "Use row covers until flowering, choose resistant varieties, mulch to deter egg-laying, and rotate crops each year." },
  { name: "Cutworms", emoji: "🐛", climates: ["hot","moderate","cold"], months: [3,4,5], targets: ["tomato","pepper","cabbage","broccoli","bean","corn"], sign: "Seedlings cut clean off at the soil line overnight; fat grey curled larvae.", fix: "Ring stems with a cardboard collar, clear debris, and hand-pick after dark.",
    description: "Fat, greasy-grey moth caterpillars that curl into a C shape and hide just under the soil by day.",
    damage: "They sever young seedlings at the soil line overnight and can clear a freshly planted bed in a couple of nights.",
    prevent: "Ring stems with cardboard or foil collars, clear weeds and debris they hide in, and delay planting to thin their numbers." },
  { name: "Thrips", emoji: "🌾", climates: ["hot","moderate"], months: [5,6,7,8], targets: ["onion","tomato","pepper","bean","Herbs"], sign: "Silvery streaks and distorted new growth; tiny fast-moving slivers.", fix: "Blue sticky traps, insecticidal soap, and encourage lacewings and pirate bugs.",
    description: "Slender, fast-moving insects barely visible to the eye that rasp at leaves and flowers.",
    damage: "Their feeding leaves silvery streaks and twisted new growth, and they spread tospoviruses like spotted wilt.",
    prevent: "Set blue sticky traps, clear weeds that harbor them, and encourage minute pirate bugs and lacewings." },
  { name: "Colorado Potato Beetle", emoji: "🪲", climates: ["cold","moderate"], months: [5,6,7], targets: ["potato","eggplant","tomato"], sign: "Yellow-orange striped beetles and red humpbacked larvae stripping leaves.", fix: "Hand-pick adults, crush the orange egg clusters under leaves, and mulch heavily.",
    description: "Rounded yellow beetles with bold black stripes; their red, humpbacked larvae are the most voracious feeders.",
    damage: "Adults and larvae strip potato and eggplant foliage, and heavy feeding can destroy the whole crop.",
    prevent: "Rotate nightshade crops far from last year's bed, mulch deeply, and hand-pick adults while crushing orange egg clusters." },
  { name: "Squash Vine Borers", emoji: "🐛", climates: ["hot","moderate"], months: [6,7], targets: ["squash","zucchini","pumpkin","gourd"], sign: "A squash vine wilts suddenly, with sawdust-like frass near a hole at the stem base.", fix: "Slit the stem lengthwise to remove the grub, then mound moist soil over the wound to re-root.",
    description: "The fat white larvae of a clear-winged moth that bore straight into squash-family stems and hollow them out.",
    damage: "They tunnel through the main stem and cut off water flow, so an otherwise healthy vine collapses almost overnight.",
    prevent: "Cover plants with row cover until they flower, wrap stem bases in foil, and destroy spent vines after harvest." },
  { name: "Leaf Miners", emoji: "🍃", climates: ["hot","moderate","cold"], months: [4,5,6,7,8,9], targets: ["spinach","chard","beet","tomato","lettuce","pepper"], sign: "Winding white or tan squiggly tunnels traced just under the leaf surface.", fix: "Pick off and destroy mined leaves, use row covers, and encourage parasitic wasps.",
    description: "The tiny larvae of flies or moths that live and feed inside the leaf, between its upper and lower surfaces.",
    damage: "Their tunnels and blotches reduce photosynthesis and make leafy greens unappetizing, weakening the plant.",
    prevent: "Remove affected leaves early, float row covers over seedlings, and clear weeds where the flies overwinter." },
  { name: "Scale Insects", emoji: "🐚", climates: ["hot","moderate"], months: [5,6,7,8,9], targets: ["citrus","fig","tomato","Herbs","Tree Fruits"], sign: "Small brown or waxy bumps clustered on stems and leaf undersides that don't rub off easily.", fix: "Scrape off gently, dab with rubbing alcohol, or spray horticultural oil to smother them.",
    description: "Immobile sap-suckers that hide under a protective waxy shell, looking more like bumps than bugs.",
    damage: "They drain sap, causing yellowing, leaf drop, and sticky honeydew that turns into sooty mold.",
    prevent: "Inspect new plants before buying, prune heavily infested growth, and encourage ladybugs and lacewings." },
  { name: "Mealybugs", emoji: "🪰", climates: ["hot","moderate"], months: [6,7,8,9], targets: ["Herbs","tomato","pepper","citrus","Tropical Fruits"], sign: "Fluffy white cottony masses tucked into leaf joints and stem crevices.", fix: "Wipe off with an alcohol-dipped cotton swab, then treat with insecticidal soap or neem.",
    description: "Soft, oval sap-suckers coated in a white waxy fluff, often mistaken for mold at first glance.",
    damage: "They weaken plants by sucking sap and leave sticky honeydew that invites sooty mold and ants.",
    prevent: "Quarantine new plants, avoid over-fertilizing, and hose down or wipe leaves regularly to catch them early." },
  { name: "Earwigs", emoji: "🪳", climates: ["hot","moderate","cold"], months: [5,6,7,8], targets: ["lettuce","strawberry","seedling","Herbs","corn"], sign: "Ragged holes in tender leaves and petals overnight, plus pincer-tailed bugs hiding by day.", fix: "Set rolled-newspaper or oil traps at dusk, and clear damp mulch and debris where they shelter.",
    description: "Fast brown insects with distinctive rear pincers that feed at night and hide in dark, moist spots by day.",
    damage: "They chew irregular holes in soft leaves, flowers, and seedlings — though they also eat some other pests.",
    prevent: "Reduce damp hiding spots, water in the morning, and trap them with rolled damp newspaper left out overnight." },
  { name: "Grasshoppers", emoji: "🦗", climates: ["hot","moderate"], months: [7,8,9], targets: ["Vegetables","bean","corn","lettuce","Herbs"], sign: "Large ragged bites chewed from leaf edges inward, with bugs that leap away as you approach.", fix: "Hand-pick in the cool morning, use floating row covers, and keep weedy field edges mowed.",
    description: "Big leaf-chewing insects that arrive in waves during hot, dry summers and can strip plants fast.",
    damage: "Heavy swarms devour leaves, stems, and even fruit, and can defoliate a bed in a matter of days.",
    prevent: "Cover vulnerable crops, encourage birds, keep surrounding weeds down, and apply Nosema baits early in the season." },
  { name: "Cabbage Loopers", emoji: "🦋", climates: ["hot","moderate","cold"], months: [5,6,7,8,9,10], targets: ["cabbage","broccoli","kale","lettuce","cauliflower","spinach"], sign: "Pale green caterpillars that arch into a loop as they crawl, leaving large ragged holes.", fix: "Hand-pick, apply Bt spray, and use row covers to block the night-flying moths from laying eggs.",
    description: "Smooth green caterpillars — the larvae of a night-flying moth — that inch along by looping their bodies.",
    damage: "They chew big holes through leaves and bore into heads, contaminating crops with frass.",
    prevent: "Net brassicas early, remove eggs on leaf undersides, and rotate crops to break the cycle." },
  { name: "Corn Earworms", emoji: "🌽", climates: ["hot","moderate"], months: [7,8,9], targets: ["corn","tomato","bean","pepper"], sign: "Caterpillars burrowed into the tips of corn ears (or tomato fruit), with frass at the entry.", fix: "Apply a few drops of mineral oil to silk tips, use Bt, and hand-pick where practical.",
    description: "The larvae of a moth that bore into corn ears and fruit — one of the most widespread garden pests in North America.",
    damage: "They eat kernels at the ear tip and tunnel into tomatoes and peppers, ruining the harvestable part.",
    prevent: "Choose tight-husked corn varieties, treat silks early, and till in fall to expose overwintering pupae." },
  { name: "Apple Maggot", emoji: "🪰", climates: ["cold","moderate"], months: [6,7,8], targets: ["apple","pear","plum","cherry","hawthorn"], sign: "Dimpled, pitted fruit with winding brown tunnels inside.", fix: "Hang red sphere traps, pick up dropped fruit, and bag developing apples.",
    description: "A small fly whose maggots tunnel through ripening apples and other pome fruit.",
    damage: "Larvae burrow through the flesh, leaving brown trails and rot that ruin the fruit.",
    prevent: "Clean up fallen fruit weekly, hang sticky red sphere traps at petal fall, and bag fruit early." },
  { name: "Armyworms", emoji: "🐛", climates: ["hot","moderate","cold"], months: [6,7,8,9], targets: ["corn","lettuce","cabbage","bean","Vegetables"], sign: "Bare patches overnight and green-brown caterpillars feeding in groups.", fix: "Hand-pick, apply Bt, and encourage birds and parasitic wasps.",
    description: "Caterpillars of several moths that feed in large groups and can strip plants fast.",
    damage: "They chew leaves and stems and can defoliate rows of seedlings in a night or two.",
    prevent: "Till in fall, keep beds weed-free, and scout for egg masses on leaf undersides." },
  { name: "Banana Weevil", emoji: "🪲", climates: ["hot"], months: [4,5,6,7,8], targets: ["banana","plantain"], sign: "Tunneled corms, wilting leaves, and toppling stems.", fix: "Plant clean pups, trap adults under split stems, and clear old material.",
    description: "A black weevil whose grubs bore through banana corms and stem bases.",
    damage: "Larval tunneling weakens the plant, cuts yield, and can make stems collapse.",
    prevent: "Start with pest-free pups, keep the mat clear of old stems, and rotate planting sites." },
  { name: "Birds", emoji: "🐦", climates: ["hot","moderate","cold"], months: [5,6,7,8], targets: ["strawberry","blueberry","cherry","grape","fig","corn"], sign: "Pecked, half-eaten ripe fruit and stripped berry bushes.", fix: "Drape netting before fruit colors up; add scare tape or reflective deterrents.",
    description: "Songbirds and others that target ripening berries and soft fruit just before harvest.",
    damage: "They peck holes in ripening fruit and can clear a berry bush in a day.",
    prevent: "Net plants before fruit ripens, harvest promptly, and use reflective tape or decoys." },
  { name: "Cabbage Root Maggot", emoji: "🪰", climates: ["moderate","cold"], months: [4,5,6,9], targets: ["cabbage","broccoli","radish","turnip","cauliflower"], sign: "Wilting, bluish outer leaves and slimy tunnels in the roots.", fix: "Fit stem collars, use row cover, and rotate brassica beds.",
    description: "The larvae of a small fly that tunnel into brassica roots and stems.",
    damage: "Root tunneling stunts or kills plants and opens the door to rot.",
    prevent: "Lay a disc collar at the stem base, cover with fine netting, and rotate crops." },
  { name: "Carrot Rust Fly", emoji: "🪰", climates: ["moderate","cold"], months: [5,6,9], targets: ["carrot","parsnip","celery","parsley","fennel"], sign: "Rusty tunnels through roots and stunted, reddish tops.", fix: "Cover with row cover, sow later, and avoid thinning at dusk.",
    description: "A fly whose larvae mine rusty tunnels through carrots and other umbellifer roots.",
    damage: "Their tunnels scar and rot the roots, making them inedible.",
    prevent: "Use insect netting, sow after early summer, and remove thinnings that attract flies." },
  { name: "Codling Moth", emoji: "🦋", climates: ["cold","moderate"], months: [5,6,7,8], targets: ["apple","pear","quince","walnut"], sign: "Holes to the core packed with frass, and early fruit drop.", fix: "Hang pheromone traps, band trunks, and bag or thin fruit.",
    description: "The classic 'worm in the apple' — a moth whose larvae tunnel to the core.",
    damage: "Larvae bore into fruit and feed at the core, leaving frass-filled tunnels and rot.",
    prevent: "Hang pheromone traps at bloom, wrap trunks with cardboard bands, and pick up drops." },
  { name: "European Corn Borer", emoji: "🌽", climates: ["cold","moderate"], months: [6,7,8], targets: ["corn","pepper","bean","potato"], sign: "Sawdust frass at leaf joints and broken tassels or stalks.", fix: "Apply Bt to whorls, destroy stalks after harvest, and plant resistant hybrids.",
    description: "A moth whose caterpillars bore into corn stalks and ears and into pepper fruit.",
    damage: "Tunneling weakens stalks so they snap, and borers ruin ears and peppers.",
    prevent: "Shred and till stalks in fall, treat whorls with Bt, and rotate away from last year's corn." },
  { name: "Fig Beetle", emoji: "🪲", climates: ["hot","moderate"], months: [7,8,9], targets: ["fig","grape","peach","melon"], sign: "Large green beetles feeding inside split, overripe fruit.", fix: "Harvest promptly, remove damaged fruit, and set fruit-baited traps.",
    description: "A big metallic-green beetle drawn to ripe and fermenting soft fruit.",
    damage: "They feed on ripe figs and other soft fruit, enlarging wounds and inviting rot.",
    prevent: "Pick fruit as it ripens, clear windfalls, and trap adults with fermenting bait." },
  { name: "Fruit Fly", emoji: "🪰", climates: ["hot","moderate"], months: [6,7,8,9], targets: ["fig","mango","guava","citrus","tomato"], sign: "Tiny flies around ripe fruit and soft, weeping spots that rot from inside.", fix: "Bag fruit, hang protein-bait traps, and clear all fallen fruit.",
    description: "Small flies that lay eggs in ripening fruit, where maggots hatch and feed.",
    damage: "Egg-laying punctures and internal maggots turn fruit soft and rotten before harvest.",
    prevent: "Bag developing fruit, harvest early, and remove every dropped or overripe fruit." },
  { name: "Fungus Gnats", emoji: "🦟", climates: ["hot","moderate","cold"], months: [1,2,3,4,5,6,7,8,9,10,11,12], targets: ["Houseplants","seedling","Herbs"], sign: "Tiny black flies drifting up from the soil when you water.", fix: "Let soil dry, use sticky traps and BTi, and top-dress with sand.",
    description: "Small dark flies whose larvae feed on organic matter and tender roots in wet potting soil.",
    damage: "Larvae nibble seedling roots and root hairs, weakening young or potted plants.",
    prevent: "Let the top inch dry between waterings, add yellow sticky traps, and water with BTi." },
  { name: "Grape Phylloxera", emoji: "🐜", climates: ["moderate","cold"], months: [5,6,7], targets: ["grape"], sign: "Galls on leaf undersides and slowly declining, stunted vines.", fix: "Plant grafted vines on resistant rootstock; there is no cure once infested.",
    description: "A tiny root- and leaf-feeding insect that once devastated the world's vineyards.",
    damage: "Root feeding stunts and slowly kills own-rooted grapevines.",
    prevent: "Choose vines grafted onto phylloxera-resistant rootstock in affected regions." },
  { name: "Husk Fly", emoji: "🪰", climates: ["moderate","cold"], months: [7,8,9], targets: ["walnut","pecan"], sign: "Blackened, slimy husks that stain the shell inside.", fix: "Hang yellow sticky traps, clean up drops, and time sprays to first catch.",
    description: "A fly whose maggots feed inside the husks of walnuts and related nuts.",
    damage: "Husk feeding stains and shrivels the nut and can lower kernel quality.",
    prevent: "Hang baited yellow traps in midsummer and rake up fallen husks promptly." },
  { name: "Mango Hopper", emoji: "🦗", climates: ["hot"], months: [2,3,4], targets: ["mango"], sign: "Clouds of wedge-shaped hoppers on flower spikes and sticky, sooty leaves.", fix: "Prune for airflow, wash off honeydew, and treat heavy flushes at bloom.",
    description: "Small hopping insects that swarm mango flower panicles and suck sap.",
    damage: "They drain flowers so they drop, and their honeydew breeds sooty mold, cutting fruit set.",
    prevent: "Open the canopy with pruning, avoid crowding trees, and monitor panicles at bloom." },
  { name: "Mexican Bean Beetle", emoji: "🐞", climates: ["hot","moderate","cold"], months: [6,7,8], targets: ["bean","cowpea","soybean"], sign: "Lacy, skeletonized leaves and fuzzy yellow larvae underneath.", fix: "Hand-pick adults and larvae, crush yellow egg clusters, and use row cover.",
    description: "A coppery, spotted relative of the ladybug — but a leaf-eating pest of beans.",
    damage: "Adults and spiny larvae skeletonize bean leaves and can defoliate plants.",
    prevent: "Scout leaf undersides for yellow eggs, hand-pick, and plant early to dodge peak numbers." },
  { name: "Nut Weevil", emoji: "🥜", climates: ["moderate","cold"], months: [8,9], targets: ["chestnut","hazelnut","walnut"], sign: "Small round exit holes in nuts and grubs inside the kernel.", fix: "Collect and destroy dropped nuts, and float-test to cull infested ones.",
    description: "Weevils whose grubs develop inside ripening nuts.",
    damage: "Larvae hollow out the kernel, leaving an exit hole and a ruined nut.",
    prevent: "Gather nuts promptly, destroy infested drops, and cull floaters before storing." },
  { name: "Onion Maggot", emoji: "🪰", climates: ["moderate","cold"], months: [5,6,9], targets: ["onion","garlic","leek","shallot"], sign: "Wilting, yellow seedlings and soft, tunneled bulbs.", fix: "Use row cover, rotate alliums, and avoid planting into fresh manure.",
    description: "The larvae of a fly that tunnel into onion-family roots and bulbs.",
    damage: "Tunneling kills young plants and rots stored bulbs from the inside.",
    prevent: "Cover seedlings with netting, rotate on a long cycle, and remove culls that attract flies." },
  { name: "Parsleyworm", emoji: "🐛", climates: ["hot","moderate","cold"], months: [6,7,8], targets: ["parsley","dill","fennel","carrot","celery"], sign: "Fat green caterpillars banded with black and yellow on umbellifer leaves.", fix: "Hand-pick if needed — many gardeners leave them for the butterflies.",
    description: "The striking caterpillar of the black swallowtail butterfly.",
    damage: "It eats foliage of parsley, dill, and carrots, though rarely enough to kill a plant.",
    prevent: "Grow a few extra plants to share, and relocate caterpillars rather than spraying." },
  { name: "Peach Tree Borer", emoji: "🐛", climates: ["moderate","cold"], months: [6,7,8], targets: ["peach","plum","cherry","apricot","nectarine"], sign: "Gummy sap and sawdust frass oozing at the trunk base.", fix: "Dig out borers with a wire, hang pheromone traps, and keep the trunk healthy.",
    description: "A clear-winged moth whose larvae bore into the trunk base of stone-fruit trees.",
    damage: "Larvae girdle the lower trunk, weakening or killing young trees.",
    prevent: "Hang pheromone traps, keep the trunk base clear and unmulched, and avoid bark wounds." },
  { name: "Pear Psylla", emoji: "🪲", climates: ["cold","moderate"], months: [4,5,6,7], targets: ["pear"], sign: "Sticky honeydew, black sooty mold, and curled, yellowing leaves.", fix: "Spray dormant oil, wash off honeydew, and encourage predatory bugs.",
    description: "A tiny sap-sucking insect that is the main pest of pears.",
    damage: "Feeding and honeydew blacken leaves with sooty mold and can spread pear decline.",
    prevent: "Apply dormant oil before bud break, avoid excess nitrogen, and support natural predators." },
  { name: "Persea Mite", emoji: "🕷️", climates: ["hot","moderate"], months: [6,7,8,9], targets: ["avocado"], sign: "Yellow spots and brown patches along leaf veins, with fine webbing.", fix: "Rinse foliage, keep trees watered, and release predatory mites.",
    description: "A tiny mite that colonizes the undersides of avocado leaves.",
    damage: "Feeding kills leaf tissue in patches, causing leaf drop and sunburned fruit.",
    prevent: "Keep trees well-watered and unstressed, hose off dust, and conserve predatory mites." },
  { name: "Plum Curculio", emoji: "🪲", climates: ["cold","moderate"], months: [5,6], targets: ["plum","apple","peach","cherry","apricot"], sign: "Crescent-shaped scars on young fruit and early fruit drop.", fix: "Jar the beetles onto a sheet at dawn, and clean up dropped fruit.",
    description: "A small snouted weevil that scars stone and pome fruit as it lays eggs.",
    damage: "Egg-laying leaves crescent scars, and grubs cause fruit to drop early.",
    prevent: "Tap branches at dawn to collect beetles on a sheet, and destroy all dropped fruit." },
  { name: "Pomegranate Butterfly", emoji: "🦋", climates: ["hot"], months: [6,7,8], targets: ["pomegranate"], sign: "Bored holes in the rind and hollowed, rotting fruit.", fix: "Bag fruit early, remove infested fruit, and clear fallen debris.",
    description: "A butterfly whose larvae bore into developing pomegranate fruit.",
    damage: "Caterpillars tunnel inside the fruit, causing rot that stays hidden until harvest.",
    prevent: "Bag fruit soon after set, pick and destroy infested fruit, and keep the ground clean." },
  { name: "Root-Knot Nematode", emoji: "🪱", climates: ["hot","moderate"], months: [6,7,8], targets: ["tomato","carrot","cucumber","okra","Vegetables"], sign: "Stunted, wilting plants with knotty galls along the roots.", fix: "Rotate with resistant crops, solarize soil, and add compost.",
    description: "Microscopic soil worms that swell plant roots into galls.",
    damage: "Galled roots can't take up water and nutrients, so plants wilt and yield poorly.",
    prevent: "Rotate with resistant varieties, solarize beds in summer, and build soil with compost and marigolds." },
  { name: "Spittlebug", emoji: "🫧", climates: ["moderate","cold"], months: [4,5,6], targets: ["strawberry","Herbs","rosemary","lavender"], sign: "Frothy 'spit' blobs on stems, with a nymph hidden inside.", fix: "Hose off the foam; damage is usually minor and needs no spray.",
    description: "Sap-sucking nymphs that shelter inside a protective foam on stems.",
    damage: "Heavy feeding can stunt new growth, but most plants shrug it off.",
    prevent: "Blast foam off with water, keep beds tidy, and tolerate light infestations." },
  { name: "Spotted Wing Drosophila", emoji: "🪰", climates: ["hot","moderate","cold"], months: [6,7,8,9], targets: ["raspberry","blackberry","blueberry","cherry","strawberry"], sign: "Soft, sunken, quickly-collapsing ripe berries with tiny larvae inside.", fix: "Harvest often, chill fruit fast, and hang vinegar traps.",
    description: "A fruit fly that, unlike most, lays eggs in sound ripening fruit.",
    damage: "Larvae feed inside berries, turning them soft and mushy within days of ripening.",
    prevent: "Pick fruit as it ripens, refrigerate at once, remove culls, and monitor with vinegar traps." },
  { name: "Stink Bug", emoji: "🛡️", climates: ["hot","moderate"], months: [7,8,9], targets: ["tomato","pepper","bean","okra","peach"], sign: "Cloudy, dimpled spots on fruit and shield-shaped bugs on the plants.", fix: "Hand-pick into soapy water, clear weeds, and cover young plants.",
    description: "Shield-shaped bugs that pierce fruit and pods to suck sap.",
    damage: "Feeding leaves hard, corky spots and dimples that deform fruit and pods.",
    prevent: "Remove weedy borders, hand-pick adults, and cover vulnerable crops before fruiting." },
  { name: "Strawberry Bud Weevil", emoji: "🪲", climates: ["moderate","cold"], months: [4,5], targets: ["strawberry","raspberry","blackberry"], sign: "Flower buds clipped and left dangling on the stem.", fix: "Clear debris, and treat at first sign only if damage is heavy.",
    description: "The strawberry clipper — a weevil that girdles flower buds to lay its eggs.",
    damage: "It severs unopened buds, cutting the number of berries the plant can set.",
    prevent: "Clear leaf litter where adults overwinter, and grow day-neutral types to outrun the damage." },
  { name: "Sweet Potato Weevil", emoji: "🍠", climates: ["hot","moderate"], months: [6,7,8,9], targets: ["sweet potato"], sign: "Tunneled roots with a bitter taste and slender bluish beetles.", fix: "Plant clean slips, rotate far away, and harvest before cold.",
    description: "An ant-like weevil whose grubs tunnel through sweet potato roots and vines.",
    damage: "Tunneling makes roots bitter and inedible, and it continues in storage.",
    prevent: "Start with certified slips, rotate crops widely, hill the roots, and harvest on time." },
  { name: "Wireworm", emoji: "🪱", climates: ["moderate","cold"], months: [4,5,6], targets: ["potato","carrot","corn","beet","Vegetables"], sign: "Narrow holes bored through roots and tubers, with thin orange grubs in the soil.", fix: "Trap with buried potato chunks, rotate, and cultivate before planting.",
    description: "The tough, wiry larvae of click beetles that live for years in the soil.",
    damage: "They bore clean holes through tubers, roots, and seeds, opening the way to rot.",
    prevent: "Rotate out of sod, cultivate to expose grubs, and set potato-chunk bait traps before planting." },
];

// Map an authored plantHealth pest name (e.g. "Tomato hornworm", "Scale") to its
// full entry in PEST_WATCH_DATA, so the per-plant pest profiles can drive the same
// tappable, climate-aware Pest Watch. Contains-match on a normalized, singularized
// key; returns null when the pest isn't in the curated library (no detail to link).
let _pestLibKeys = null;
function matchLibraryPest(pestName) {
  const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z]/g, "").replace(/(ies|es|s)$/, "");
  const k = norm(pestName);
  if (k.length < 4) return null;
  if (!_pestLibKeys) _pestLibKeys = PEST_WATCH_DATA.map((p) => ({ key: norm(p.name), pest: p }));
  const hit = _pestLibKeys.find(({ key }) => key === k || key.includes(k) || k.includes(key));
  return hit ? hit.pest : null;
}

// Public accessor: the full PEST_WATCH_DATA entry for an authored pest name (so a
// plant's pest chip can open the pest detail), or null when it has no library page.
export function getPestForName(name) {
  return matchLibraryPest(name);
}

// Disease equivalent of matchLibraryPest: the full DISEASE_LIBRARY entry for an
// authored disease name (so a plant's disease chip can open the disease detail),
// or null when it has no library page. Uses a stricter match than pests — a plain
// contains-match would collapse "Rust"/"Bean rust"/"Fig rust" and "Blight"/"Early
// blight" together, so we match the whole normalized name, then fall back to a
// word-boundary containment only when it doesn't create a wrong short-name hit.
let _diseaseLibKeys = null;
export function getDiseaseForName(name) {
  const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z]/g, "");
  const k = norm(name);
  if (k.length < 3) return null;
  if (!_diseaseLibKeys) _diseaseLibKeys = DISEASE_LIBRARY.map((d) => ({ key: norm(d.name), disease: d }));
  // Exact normalized match first (the common case — plantHealth uses library names verbatim).
  const exact = _diseaseLibKeys.find(({ key }) => key === k);
  return exact ? exact.disease : null;
}

export function getActivePests(savedPlantObjs, month, zone) {
  const bucket = getClimateBucket(zone);
  // Warm zones have longer pest seasons; cold zones stay peak-only.
  const expand = (months) => {
    if (bucket !== "hot") return months;
    const set = new Set(months);
    months.forEach((m) => { set.add((m % 12) + 1); set.add(((m + 10) % 12) + 1); });
    return [...set];
  };
  const results = [];
  PEST_WATCH_DATA.forEach((pest) => {
    if (Array.isArray(pest.climates) && !pest.climates.includes(bucket)) return;
    if (!expand(pest.months.map(flipMonth)).includes(month)) return;
    const affected = (savedPlantObjs || []).filter((p) => {
      const nm = String(p?.name || "").toLowerCase();
      const type = normalizeType(p?.type, p?.name);
      const targetMatch = pest.targets.some((t) => {
        const tl = t.toLowerCase();
        return type === t || nm.includes(tl);
      });
      if (targetMatch) return true;
      // Authored per-plant pest profile also counts — extends the watch to every
      // plant with a plantHealth record, not just those in the curated target lists.
      const health = getPlantHealth(p);
      return !!(health && health.pests.some((hp) => matchLibraryPest(hp) === pest));
    });
    if (affected.length) results.push({ ...pest, affected: affected.map((p) => p.name) });
  });
  return results;
}
export function getSeasonForMonth(month) {
  // Resolve the season against the northern reference calendar, then hand the
  // months back in the caller's local calendar.
  const ref = flipMonth(month);
  const local = (months) => months.map(flipMonth).sort((a, b) => a - b);
  if (ref >= 3 && ref <= 5) return { key: "spring", label: "Spring", months: local([3, 4, 5]) };
  if (ref >= 6 && ref <= 8) return { key: "summer", label: "Summer", months: local([6, 7, 8]) };
  if (ref >= 9 && ref <= 11) return { key: "fall", label: "Fall", months: local([9, 10, 11]) };
  return { key: "winter", label: "Winter", months: local([12, 1, 2]) };
}

export function countInSeason(items, dateField, year, seasonMonths) {
  return (items || []).filter((it) => {
    const d = new Date(it?.[dateField]);
    if (Number.isNaN(d.getTime())) return false;
    return d.getFullYear() === year && seasonMonths.includes(d.getMonth() + 1);
  }).length;
}

// ── Garden Timeline ──────────────────────────────────────────────────────────
// Merges every dated garden signal the app already tracks into one newest-first
// feed for the Journal. Waterings are grouped per day so they don't flood it.
export function buildGardenTimeline({
  journalEntries = [], harvestLog = [], wateringHistory = {}, careLog = [],
  sowLog = {}, plantSaveDates = {}, badgeEarnedDates = {}, achievementBadges = [],
} = {}) {
  const events = [];
  const tsOf = (v) => { const t = new Date(v).getTime(); return Number.isNaN(t) ? 0 : t; };
  const keyOf = (v) => { const d = new Date(v); return Number.isNaN(d.getTime()) ? "" : getDateKey(d); };

  Object.entries(plantSaveDates || {}).forEach(([plant, dk]) => {
    if (!dk) return;
    events.push({ ts: tsOf(dk), dateKey: keyOf(dk), kind: "plant", icon: "🌱", color: "#5cff89", title: `Added ${plant}`, subtitle: "Saved to your garden", plantName: plant });
  });
  Object.entries(sowLog || {}).forEach(([plant, dk]) => {
    if (!dk) return;
    events.push({ ts: tsOf(dk), dateKey: keyOf(dk), kind: "sow", icon: "🌾", color: "#8effab", title: `Sowed ${plant}`, subtitle: "Succession sowing", plantName: plant });
  });
  (journalEntries || []).forEach((e) => {
    if (!e) return;
    const when = e.createdAt || e.date;
    events.push({ ts: tsOf(when), dateKey: keyOf(when), kind: "photo", icon: "📸", color: "#6bc7ff", title: e.plantName && e.plantName !== "Garden" ? `Photo of ${e.plantName}` : "Garden photo", subtitle: e.mood ? `Feeling ${e.mood}` : "Added a photo", plantName: e.plantName && e.plantName !== "Garden" ? e.plantName : null, imageUri: e.imageUri });
  });
  (harvestLog || []).forEach((h) => {
    if (!h) return;
    const when = h.createdAt || h.date;
    const amt = [h.amount, h.unit].filter(Boolean).join(" ").trim();
    events.push({ ts: tsOf(when), dateKey: keyOf(when), kind: "harvest", icon: "🎉", color: "#ffd86b", title: `Harvested ${h.plantName}`, subtitle: amt || "Logged a harvest", plantName: h.plantName });
  });
  (careLog || []).forEach((c) => {
    if (!c) return;
    const when = c.createdAt || c.date;
    const who = c.plant && c.plant !== "Garden" ? c.plant : "the whole garden";
    events.push({ ts: tsOf(when), dateKey: keyOf(when), kind: "care", icon: c.actionIcon || "🌿", color: c.actionColor || "#8effab", title: c.actionLabel || "Garden care", subtitle: c.note ? c.note : who, plantName: c.plant && c.plant !== "Garden" ? c.plant : null });
  });
  const waterByDay = {};
  Object.entries(wateringHistory || {}).forEach(([plant, dates]) => {
    (Array.isArray(dates) ? dates : []).forEach((d) => {
      const dk = keyOf(String(d).slice(0, 10));
      if (!dk) return;
      (waterByDay[dk] = waterByDay[dk] || new Set()).add(plant);
    });
  });
  Object.entries(waterByDay).forEach(([dk, set]) => {
    const n = set.size;
    events.push({ ts: new Date(dk).getTime(), dateKey: dk, kind: "water", icon: "💧", color: "#6bc7ff", title: `Watered ${n} plant${n === 1 ? "" : "s"}`, subtitle: Array.from(set).slice(0, 3).join(", ") + (n > 3 ? ` +${n - 3}` : "") });
  });
  const badgeById = {};
  (achievementBadges || []).forEach((b) => { if (b && b.id) badgeById[b.id] = b; });
  Object.entries(badgeEarnedDates || {}).forEach(([id, dk]) => {
    if (!dk) return;
    const b = badgeById[id];
    events.push({ ts: tsOf(dk), dateKey: keyOf(dk), kind: "badge", icon: (b && b.emoji) || "🏆", color: "#ffd86b", title: `Earned "${(b && b.title) || id}"`, subtitle: "Achievement unlocked" });
  });

  return events.filter((e) => e.ts > 0).sort((a, b) => b.ts - a.ts);
}

// A light recap of one calendar month's activity, keyed by event kind.
export function getTimelineMonthRecap(events, ref = new Date()) {
  const y = ref.getFullYear(), m = ref.getMonth();
  const counts = {};
  (events || []).forEach((e) => {
    const d = new Date(e.ts);
    if (d.getFullYear() === y && d.getMonth() === m) counts[e.kind] = (counts[e.kind] || 0) + 1;
  });
  return counts;
}

// "On This Day": events from the same month+day in a previous year.
export function getTimelineOnThisDay(events, ref = new Date()) {
  const md = `${ref.getMonth()}-${ref.getDate()}`;
  const thisYear = ref.getFullYear();
  return (events || []).filter((e) => {
    const d = new Date(e.ts);
    return `${d.getMonth()}-${d.getDate()}` === md && d.getFullYear() < thisYear;
  });
}

export function getGardenXP({ savedPlants, journalEntries, gardenMap, wateredPlants, streakData, bonusXP, questXP }) {
  const today = getTodayKey();
  const wateredTodayCount = Object.values(wateredPlants || {}).filter((value) => value === today).length;
  const gardenPlotCount = Object.values(gardenMap || {}).filter(Boolean).length;
  const consistencyBonus = getConsistencyBonus(streakData?.count || 0);
  const xp = savedPlants.length * 25 + journalEntries.length * 40 + gardenPlotCount * 35 + wateredTodayCount * 15 + (streakData?.count || 0) * 20 + consistencyBonus + (bonusXP || 0) + (questXP || 0);
  const level = Math.floor(Math.sqrt(xp / 250)) + 1;
const xpForCurrentLevel = level === 1 ? 0 : 250 * (level - 1) * (level - 1);
const xpForNextLevel = 250 * level * level;
const currentLevelXP = xp - xpForCurrentLevel;
const nextLevelXP = xpForNextLevel - xpForCurrentLevel;
  let title = "Seedling";
if (level >= 5) title = "Backyard Grower";
if (level >= 10) title = "Green Thumb";
if (level >= 15) title = "Harvest Keeper";
if (level >= 20) title = "Garden Sage";
if (level >= 25) title = "Plant Whisperer";
if (level >= 30) title = "Soil Scientist";
if (level >= 35) title = "Garden Architect";
if (level >= 40) title = "Zone Master";
if (level >= 45) title = "Harvest Legend";
if (level >= 50) title = "Master Botanist";
if (level >= 55) title = "Garden Oracle";
if (level >= 60) title = "Legendary Grower";
if (level >= 65) title = "Elite Cultivator";
if (level >= 70) title = "Grand Gardener";
if (level >= 75) title = "Garden Mythkeeper";
if (level >= 80) title = "Ancient Cultivator";
if (level >= 85) title = "Garden Immortal";
if (level >= 90) title = "Celestial Grower";
if (level >= 95) title = "Garden Transcendent";
if (level >= 100) title = "🌟 Garden Gnome";
  return { xp, level, title, currentLevelXP, nextLevelXP, progress: currentLevelXP / nextLevelXP };
}


export function getMonthEmoji(monthNumber) {
  const emojis = { 1:"❄️",2:"🌧️",3:"🌱",4:"🌷",5:"☀️",6:"🍅",7:"🌽",8:"🍉",9:"🍎",10:"🎃",11:"🍂",12:"🎄" };
  return emojis[monthNumber] || "🌱";
}

export function getWeatherIconFromDay(day) {
  if (!day) return "🌤️";
  if (day.precipChance >= 65) return "🌧️";
  if (day.minTempF <= 35) return "❄️";
  if (day.maxTempF >= 95) return "🔥";
  return "☀️";
}

export const FROST_TASKS = [
  { id: "cover", icon: "🛡️", text: "Cover tender plants with sheets, row cover, or cloches" },
  { id: "containers", icon: "🪴", text: "Move potted plants into a garage or against the house" },
  { id: "water", icon: "💧", text: "Water soil before the freeze — moist soil holds heat" },
  { id: "mulch", icon: "🍂", text: "Add mulch around roots for insulation" },
  { id: "harvest", icon: "🧺", text: "Harvest anything ripe that frost could damage" },
];

export const COLD_THRESHOLD_F = 40;

export const SEASONAL_TASKS = {
  hot: {
    0:  ["Plant cool-season crops: lettuce, spinach, peas", "Prune dormant fruit trees", "Start tomatoes & peppers indoors"],
    1:  ["Transplant tomatoes & peppers outdoors", "Plant carrots, beets, radishes", "Begin regular watering as it warms"],
    2:  ["Last chance for spring greens before heat", "Mulch beds to hold moisture", "Plant beans & squash"],
    3:  ["Harvest cool crops before they bolt", "Set up shade cloth for tender plants", "Deep-water in the mornings"],
    4:  ["Plant heat-lovers: okra, melons, sweet potato", "Water early to beat evaporation", "Watch for pests in the heat"],
    5:  ["Provide afternoon shade", "Harvest often to keep plants producing", "Refresh mulch"],
    6:  ["Water deeply & consistently", "Start seeds for fall tomatoes", "Keep harvesting summer crops"],
    7:  ["Plant fall tomatoes & peppers", "Start fall brassicas indoors", "Prune leggy summer growth"],
    8:  ["Transplant fall crops", "Plant cool greens again", "Ease back on watering as it cools"],
    9:  ["Plant garlic & onions", "Sow cool-season greens", "Cut back on watering"],
    10: ["Harvest fall crops", "Plant cover crops in empty beds", "Mulch for the mild winter"],
    11: ["Plant bare-root trees", "Protect tender plants on cold nights", "Plan next year's garden"],
  },
  moderate: {
    0:  ["Plan the garden & order seeds", "Start onions & leeks indoors", "Prune dormant fruit trees"],
    1:  ["Start tomatoes, peppers, eggplant indoors", "Prep beds as soil thaws", "Chit seed potatoes"],
    2:  ["Sow peas, spinach, radish outdoors", "Start brassicas indoors", "Add compost to beds"],
    3:  ["Transplant hardy seedlings", "Direct-sow carrots, beets, lettuce", "Watch for late frosts"],
    4:  ["Transplant tomatoes & peppers after last frost", "Plant beans, squash, cucumbers", "Harden off seedlings first"],
    5:  ["Succession-sow lettuce & beans", "Mulch to retain moisture", "Stake tomatoes"],
    6:  ["Water deeply in dry spells", "Harvest often", "Start fall brassicas indoors"],
    7:  ["Sow fall crops: kale, spinach, turnips", "Keep harvesting", "Watch for pests"],
    8:  ["Plant garlic later this month", "Harvest & preserve", "Sow cover crops"],
    9:  ["Plant garlic", "Clear spent plants", "Mulch beds for winter"],
    10: ["Protect remaining crops", "Clean & store tools", "Plan crop rotation"],
    11: ["Rest & plan", "Order seeds early", "Check stored produce"],
  },
  cold: {
    0:  ["Plan garden & order seeds", "Start onions & leeks indoors", "Inspect stored produce"],
    1:  ["Start tomatoes, peppers, eggplant indoors", "Test soil", "Prune dormant trees"],
    2:  ["Start brassicas & lettuce indoors", "Prep beds when workable", "Chit potatoes"],
    3:  ["Sow peas & spinach if soil workable", "Start warm crops indoors", "Harden off cold-hardy starts"],
    4:  ["Transplant hardy crops", "Direct-sow radish, carrot, beet", "Watch for hard frosts"],
    5:  ["Transplant tomatoes after last frost", "Plant beans, squash, corn", "Mulch beds"],
    6:  ["Succession-sow quick crops", "Water consistently", "Stake & support plants"],
    7:  ["Harvest heavily", "Sow fall greens", "Start fall brassicas"],
    8:  ["Plant garlic", "Harvest & preserve", "Sow cover crops"],
    9:  ["Harvest before first frost", "Clear & compost spent plants", "Mulch heavily"],
    10: ["Protect or harvest last crops", "Clean & store tools", "Insulate perennials"],
    11: ["Rest & plan next season", "Order seeds", "Maintain equipment"],
  },
};

export function getWaterTriage(savedPlants, wateringHistory, wateringAmounts) {
  const rows = (savedPlants || [])
    .map((name) => {
      const item = produceData.find((p) => p.name === name);
      if (!item) return null;
      const info = getNextWaterInfo(name, item, wateringHistory);
      if (!info) return null;
      const d = typeof info.daysUntil === "number" ? info.daysUntil : null;
      if (d === null) return null;
      let bucket;
      if (d < 0) bucket = "overdue";
      else if (d === 0) bucket = "today";
      else if (d === 1) bucket = "tomorrow";
      else return null;
      return { name, item, info, daysUntil: d, bucket };
    })
    .filter(Boolean);
  const order = { overdue: 0, today: 1, tomorrow: 2 };
  return rows.sort((a, b) => {
    if (order[a.bucket] !== order[b.bucket]) return order[a.bucket] - order[b.bucket];
    return a.daysUntil - b.daysUntil;
  });
}

export function getSuccessionInterval(plantName) {
  const SUCCESSION_INTERVALS = [
    { match: ["radish"], days: 10 },
    { match: ["arugula", "mesclun"], days: 10 },
    { match: ["lettuce"], days: 14 },
    { match: ["spinach"], days: 14 },
    { match: ["cilantro", "coriander"], days: 14 },
    { match: ["bean"], days: 14 },
    { match: ["pea"], days: 14 },
    { match: ["turnip"], days: 14 },
    { match: ["beet"], days: 21 },
    { match: ["carrot"], days: 21 },
    { match: ["green onion", "scallion"], days: 21 },
    { match: ["basil"], days: 21 },
    { match: ["kale"], days: 21 },
  ];
  const n = String(plantName || "").toLowerCase();
  const hit = SUCCESSION_INTERVALS.find((row) => row.match.some((w) => n.includes(w)));
  return hit ? hit.days : null;
}

export function getSuccessionInfo(name, item, zone, sowLog) {
  const interval = getSuccessionInterval(name);
  if (!interval) return null;
  if (getPlantSeasonLabel(item, zone) !== "Plant now") return null;
  const last = sowLog?.[name];
  if (!last) return { interval, status: "start", daysSince: null, daysUntil: null };
  const lastDate = new Date(`${String(last).slice(0, 10)}T12:00:00`);
  const now = new Date(); now.setHours(12, 0, 0, 0);
  const daysSince = Math.round((now - lastDate) / (1000 * 60 * 60 * 24));
  if (daysSince >= interval) return { interval, status: "due", daysSince, daysUntil: 0 };
  return { interval, status: "waiting", daysSince, daysUntil: interval - daysSince };
}

export function applyGardenTemplate({ template, savedPlants, onAssign }) {
  const plantNames = savedPlants.filter(Boolean).map((plant) => typeof plant === "string" ? plant : plant?.name).filter(Boolean);
  if (!plantNames.length) { Alert.alert("Save plants first", "Save a few plants before applying a garden template."); return; }
  const templateSlots = { backyard: ["slot-1","slot-2","slot-3","slot-4","slot-5","slot-6"], balcony: ["slot-1","slot-2","slot-3","slot-4"], raised: ["slot-1","slot-2","slot-4","slot-5","slot-7","slot-8"], herbs: ["slot-1","slot-2","slot-3","slot-4","slot-5","slot-6"] };
  const slots = templateSlots[template] || templateSlots.backyard;
  slots.forEach((slotId, index) => { onAssign(slotId, plantNames[index % plantNames.length]); });
  successHaptic();
  Alert.alert("Template Applied 🌱", "Your garden layout has been filled with saved plants.");
}

export function getPowerPairs(gardenAreas) {
  const pairs = [];
  const seen = new Set();
  (gardenAreas || []).forEach((area) => {
    const plants = Array.from(
      new Set(Object.values(area.plots || {}).filter(Boolean))
    );
    for (let i = 0; i < plants.length; i += 1) {
      for (let j = i + 1; j < plants.length; j += 1) {
        const a = plants[i];
        const b = plants[j];
        const result = getCompatibilityScore(a, b);
        if (result && result.label === "Excellent Pair") {
          const key = [a, b].sort().join("|");
          if (!seen.has(key)) {
            seen.add(key);
            pairs.push({ a, b, areaName: area.name });
          }
        }
      }
    }
  });
  return pairs.slice(0, 6);
}

export function getPlantHealthStatus({ plantName, wateredPlants, weather }) {
  const wateredToday = wateredPlants?.[plantName] === getTodayKey();
  if (weather?.minTempF <= 35) return { label: "Frost Risk", icon: "❄️", color: "#6bc7ff" };
  if (weather?.maxTempF >= 95 && !wateredToday) return { label: "Heat Stressed", icon: "🔥", color: "#ff7a7a" };
  if (!wateredToday) return { label: "Needs Water", icon: "💧", color: "#ffd86b" };
  return { label: "Healthy", icon: "🌿", color: "#5cff89" };
}

export const HARVEST_SOON_DAYS = 7;

export const RESCUE_THRESHOLD_DAYS = 7;

export function csvEscape(value) {
  const s = String(value == null ? "" : value);
  // Wrap in quotes and escape internal quotes if it contains a comma, quote, or newline.
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function buildCsv(headers, rows) {
  const head = headers.map(csvEscape).join(",");
  const body = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  return `${head}\n${body}`;
}

export const WATER_UNITS = [
  { id: "cups", label: "cups", toGal: 0.0625 },
  { id: "gal", label: "gallons", toGal: 1 },
  { id: "L", label: "liters", toGal: 0.264172 },
];

export function toGallons(amount, unit) {
  const u = WATER_UNITS.find((x) => x.id === unit) || WATER_UNITS[1];
  const n = parseFloat(amount);
  return Number.isNaN(n) ? 0 : n * u.toGal;
}

export function getPlantingGuide(item) {
  const type = normalizeType(item?.type, item?.name);
  const name = String(item?.name || "").toLowerCase();

  // Category-based defaults
  const GUIDES = {
    "Vegetables": { depth: '1/4"–1/2"', spacing: '6"–12"', sun: "Full sun", germ: "7–14 days" },
    "Herbs": { depth: '1/4"', spacing: '8"–12"', sun: "Full to partial sun", germ: "7–21 days" },
    "Berries": { depth: '1"–2"', spacing: '18"–36"', sun: "Full sun", germ: "N/A (transplant)" },
    "Tree Fruits": { depth: "Root ball depth", spacing: "10–20 ft", sun: "Full sun", germ: "N/A (transplant)" },
    "Tropical Fruits": { depth: "Root ball depth", spacing: "6–15 ft", sun: "Full sun", germ: "N/A (transplant)" },
  };

  // Name-based overrides for common specifics
  let guide = { ...(GUIDES[type] || GUIDES["Vegetables"]) };
  if (["carrot", "radish", "beet", "turnip"].some((w) => name.includes(w))) {
    guide = { depth: '1/4"–1/2"', spacing: '2"–4"', sun: "Full sun", germ: "5–10 days" };
  } else if (["tomato", "pepper", "eggplant"].some((w) => name.includes(w))) {
    guide = { depth: '1/4"', spacing: '18"–24"', sun: "Full sun (6–8 hrs)", germ: "6–14 days" };
  } else if (["lettuce", "spinach", "kale", "arugula"].some((w) => name.includes(w))) {
    guide = { depth: '1/4"', spacing: '6"–12"', sun: "Full to partial sun", germ: "5–10 days" };
  } else if (["squash", "zucchini", "cucumber", "pumpkin", "melon"].some((w) => name.includes(w))) {
    guide = { depth: '1"', spacing: '24"–36"', sun: "Full sun", germ: "7–10 days" };
  } else if (["bean", "pea"].some((w) => name.includes(w))) {
    guide = { depth: '1"–1.5"', spacing: '3"–6"', sun: "Full sun", germ: "7–14 days" };
  } else if (["corn"].some((w) => name.includes(w))) {
    guide = { depth: '1"–2"', spacing: '8"–12"', sun: "Full sun", germ: "7–10 days" };
  } else if (["onion", "garlic"].some((w) => name.includes(w))) {
    guide = { depth: '1"–2"', spacing: '4"–6"', sun: "Full sun", germ: "7–14 days" };
  }
  return guide;
}

export function getPlantFamily(plantName) {
  const n = String(plantName || "").toLowerCase();
  if (["tomato", "pepper", "eggplant", "potato"].some((w) => n.includes(w))) return "Nightshade";
  if (["cabbage", "broccoli", "cauliflower", "kale", "bok"].some((w) => n.includes(w))) return "Brassica";
  if (["bean", "pea"].some((w) => n.includes(w))) return "Legume";
  if (["onion", "garlic", "leek"].some((w) => n.includes(w))) return "Allium";
  if (["cucumber", "squash", "zucchini", "pumpkin", "melon", "watermelon"].some((w) => n.includes(w))) return "Cucurbit";
  if (["carrot", "beet", "radish", "turnip", "parsnip"].some((w) => n.includes(w))) return "Root";
  return null; // herbs, fruit, etc. — not rotation-sensitive
}

// Robust premium check: RevenueCat entitlement identifiers are easy to mismatch, so
// treat the user as premium if our named entitlement is active OR any entitlement is.
export function hasPremiumEntitlement(customerInfo) {
  const active = customerInfo?.entitlements?.active || {};
  return !!active["Pocket Planter Pro"] || Object.keys(active).length > 0;
}

// Universal monthly garden habits appended to every month's seasonal tasks, so the
// checklist always has a fuller set of things to do.
const UNIVERSAL_MONTHLY_TASKS = [
  "🌡️ Check soil moisture across your beds",
  "🐛 Scout plants for early signs of pests",
  "🌿 Clear weeds and spent growth",
  "📸 Add a progress photo to your journal",
  "📋 Plan what to plant next month",
];
export function getMonthlyChecklistTasks(zone) {
  const bucket = getClimateBucket(zone);
  const monthIndex = new Date().getMonth();
  const seasonal = (SEASONAL_TASKS[bucket] && SEASONAL_TASKS[bucket][monthIndex]) || [];
  return [...seasonal, ...UNIVERSAL_MONTHLY_TASKS];
}
export function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
export function isMonthlyChecklistComplete(zone, monthlyChecklist) {
  if (!zone) return false;
  const tasks = getMonthlyChecklistTasks(zone);
  if (!tasks.length) return false;
  const checked = (monthlyChecklist && monthlyChecklist[getMonthKey()]) || {};
  return tasks.every((_, i) => checked[i]);
}
