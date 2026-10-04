import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getCompanionInfo, getCompatibilityScore, getPairReason, getPlantDifficulty, resolvePlantImageSource } from "../core";
import { PLANT_DETAILS } from "../data/plantDetails";
import { styles } from "../styles";
import { QuizGame } from "../components/QuizGame";
import { t } from "../lib/i18n";

// ── Small helpers ────────────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function sample(arr, n) { return shuffle(arr).slice(0, n); }
const findPlant = (name) => produceData.find((p) => p.name.toLowerCase() === String(name || "").toLowerCase());

// ── Game 1: Sun or Shade? (how much light does this plant want) ───────────────
// The plant photos have the plant's NAME printed on a sign in the image, so a
// "guess the plant" game just gives the answer away. This asks about light needs
// instead — the label on the sign doesn't help — while still showing the plant.
// Translation keys; questions are built (and so translated) as they are dealt.
const SUN_LABELS = { full: "games.sunFull", partial: "games.sunPartial", shade: "games.sunShade" };
const SUN_POOL = produceData.filter((p) => p?.name && resolvePlantImageSource(p) && SUN_LABELS[(PLANT_DETAILS[p.name] || {}).sunlight]);
// Group by light need. Most plants want full sun, so picking a plant at random would
// make "Full sun" the winning guess ~78% of the time. Instead we pick a light category
// evenly first, then a plant in it — so the answer is spread across all three.
const SUN_BY_CAT = { full: [], partial: [], shade: [] };
SUN_POOL.forEach((p) => { SUN_BY_CAT[PLANT_DETAILS[p.name].sunlight].push(p); });
const SUN_CATS = ["full", "partial", "shade"].filter((k) => SUN_BY_CAT[k].length);
function makeSunQuestion() {
  const answer = pick(SUN_CATS);
  const target = pick(SUN_BY_CAT[answer]);
  const options = ["full", "partial", "shade"].map((k) => ({ label: t(SUN_LABELS[k]), correct: k === answer }));
  return { prompt: t("games.sunPrompt", { plant: target.name }), image: resolvePlantImageSource(target), options, reveal: t("games.sunReveal", { plant: target.name, answer: t(SUN_LABELS[answer]) }) };
}

// ── Game 2: Companion Match (pick the best companion) ─────────────────────────
function makeCompanionQuestion() {
  let target = null, correct = null;
  for (let tries = 0; tries < 60; tries++) {
    const cand = pick(produceData);
    const info = getCompanionInfo(cand.name) || {};
    const goods = (info.excellent || []).map(findPlant).filter(Boolean).filter((p) => p.name !== cand.name);
    if (goods.length) { target = cand; correct = pick(goods); break; }
  }
  if (!target) { target = findPlant("Tomato") || produceData[0]; correct = findPlant("Basil") || produceData[1]; }
  const goodSet = new Set(((getCompanionInfo(target.name) || {}).excellent || []).map((s) => String(s).toLowerCase()));
  const badCandidates = produceData.filter((p) => p.name !== target.name && p.name !== correct.name && !goodSet.has(p.name.toLowerCase()));
  // Prefer "Avoid" plants as distractors so the right answer stands out clearly.
  const ranked = shuffle(badCandidates).sort((a, b) => {
    const av = getCompatibilityScore(target.name, a.name).label === "Avoid" ? 0 : 1;
    const bv = getCompatibilityScore(target.name, b.name).label === "Avoid" ? 0 : 1;
    return av - bv;
  });
  const options = shuffle([correct, ...ranked.slice(0, 3)]).map((p) => ({ label: p.name, correct: p.name === correct.name }));
  return { prompt: t("games.companionPrompt", { plant: target.name }), options, reveal: getPairReason(target.name, correct.name) };
}

// ── Game 3: Water Wise (how thirsty is this plant) ────────────────────────────
// Same balanced approach as Sun or Shade — pick the water level evenly first, then a
// plant, so no single answer is the safe guess. The name on the sign doesn't help.
const WATER_LABELS = { low: "games.waterLow", medium: "games.waterMedium", high: "games.waterHigh" };
const WATER_BY_CAT = { low: [], medium: [], high: [] };
produceData.forEach((p) => { if (!p?.name || !resolvePlantImageSource(p)) return; const w = (PLANT_DETAILS[p.name] || {}).waterNeeds; if (WATER_BY_CAT[w]) WATER_BY_CAT[w].push(p); });
const WATER_CATS = ["low", "medium", "high"].filter((k) => WATER_BY_CAT[k].length);
function makeWaterQuestion() {
  const answer = pick(WATER_CATS);
  const target = pick(WATER_BY_CAT[answer]);
  const options = ["low", "medium", "high"].map((k) => ({ label: t(WATER_LABELS[k]), correct: k === answer }));
  return { prompt: t("games.waterPrompt", { plant: target.name }), image: resolvePlantImageSource(target), options, reveal: t("games.waterReveal", { plant: target.name, answer: t(WATER_LABELS[answer]) }) };
}

// ── Game 4: Green Thumb Test (how hard is this plant to grow) ──────────────────
const DIFF_KEYS = ["Easy", "Medium", "Hard"];
const DIFF_BY_CAT = { Easy: [], Medium: [], Hard: [] };
produceData.forEach((p) => { if (!p?.name || !resolvePlantImageSource(p)) return; const label = getPlantDifficulty(p).label; if (DIFF_BY_CAT[label]) DIFF_BY_CAT[label].push(p); });
const DIFF_CATS = DIFF_KEYS.filter((k) => DIFF_BY_CAT[k].length);
function makeDifficultyQuestion() {
  const answer = pick(DIFF_CATS);
  const target = pick(DIFF_BY_CAT[answer]);
  const options = DIFF_KEYS.map((k) => ({ label: t(`games.diff${k}`), correct: k === answer }));
  return { prompt: t("games.difficultyPrompt", { plant: target.name }), image: resolvePlantImageSource(target), options, reveal: t("games.difficultyReveal", { plant: target.name, answer: t(`games.diff${answer}`) }) };
}

const GAMES = [
  { id: "sunshade", emoji: "☀️", accent: "#ffd86b", titleKey: "games.sunTitle", descKey: "games.sunDesc", storageKey: "pp_game_sunshade_best", timePerQuestion: 15, xpPerCorrect: 5, makeQuestion: makeSunQuestion },
  { id: "companion", emoji: "🤝", accent: "#8effab", titleKey: "games.companionTitle", descKey: "games.companionDesc", storageKey: "pp_game_companion_best", timePerQuestion: 0, xpPerCorrect: 8, makeQuestion: makeCompanionQuestion },
  { id: "water", emoji: "💧", accent: "#6bc7ff", titleKey: "games.waterTitle", descKey: "games.waterDesc", storageKey: "pp_game_water_best", timePerQuestion: 15, xpPerCorrect: 5, makeQuestion: makeWaterQuestion },
  { id: "difficulty", emoji: "🧑‍🌾", accent: "#c98bff", titleKey: "games.difficultyTitle", descKey: "games.difficultyDesc", storageKey: "pp_game_difficulty_best", timePerQuestion: 15, xpPerCorrect: 6, makeQuestion: makeDifficultyQuestion },
];
const TOTAL_ROUNDS = 10;

export function GamesTab({ theme, onAwardXp }) {
  const [activeGame, setActiveGame] = useState(null);
  const [bests, setBests] = useState({});

  function loadBests() {
    Promise.all(GAMES.map((g) => AsyncStorage.getItem(g.storageKey).then((v) => [g.id, Number(v) || 0]))).then((pairs) => {
      setBests(Object.fromEntries(pairs));
    }).catch(() => {});
  }
  useEffect(() => { loadBests(); }, []);

  const game = GAMES.find((g) => g.id === activeGame);
  if (game) {
    return (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <QuizGame
          theme={theme}
          onExit={() => { setActiveGame(null); loadBests(); }}
          title={t(game.titleKey)}
          emoji={game.emoji}
          accent={game.accent}
          totalRounds={TOTAL_ROUNDS}
          timePerQuestion={game.timePerQuestion}
          xpPerCorrect={game.xpPerCorrect}
          onAwardXp={onAwardXp}
          storageKey={game.storageKey}
          makeQuestion={game.makeQuestion}
        />
      </View>
    );
  }

  return (
    <View>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{t("games.tabTitle")}</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginBottom: 6 }}>
          {t("games.tabIntro")}
        </Text>
        <View style={{ gap: 12, marginTop: 8 }}>
          {GAMES.map((g) => (
            <Pressable
              key={g.id}
              onPress={() => setActiveGame(g.id)}
              accessibilityRole="button"
              accessibilityLabel={t("games.playGame", { game: t(g.titleKey) })}
              style={{ flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: theme.border }}
            >
              <View style={{ width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: `${g.accent}22`, borderWidth: 1, borderColor: `${g.accent}55` }}>
                <Text style={{ fontSize: 26 }}>{g.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>{t(g.titleKey)}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 2 }}>{t(g.descKey)}</Text>
                <Text style={{ color: g.accent, fontSize: 11, fontWeight: "900", marginTop: 6 }}>{t("games.best", { score: bests[g.id] || 0, total: TOTAL_ROUNDS })}</Text>
              </View>
              <View style={{ backgroundColor: g.accent, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 }}>
                <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>{t("games.play")}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
