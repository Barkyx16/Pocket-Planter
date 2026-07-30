import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { getCompanionInfo, getCompatibilityScore, getPairReason, resolvePlantImageSource } from "../core";
import { styles } from "../styles";
import { QuizGame } from "../components/QuizGame";

// ── Small helpers ────────────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function sample(arr, n) { return shuffle(arr).slice(0, n); }
const findPlant = (name) => produceData.find((p) => p.name.toLowerCase() === String(name || "").toLowerCase());

// ── Game 1: Plant ID Challenge (guess the plant from its photo) ───────────────
const IMAGE_POOL = produceData.filter((p) => p?.name && resolvePlantImageSource(p));
function makePlantIdQuestion() {
  const target = pick(IMAGE_POOL);
  const distractors = sample(IMAGE_POOL.filter((p) => p.name !== target.name), 3);
  const options = shuffle([target, ...distractors]).map((p) => ({ label: p.name, correct: p.name === target.name }));
  return { prompt: "What plant is this?", image: resolvePlantImageSource(target), options };
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
  return { prompt: `Which is the best companion for ${target.name}?`, options, reveal: getPairReason(target.name, correct.name) };
}

const GAMES = [
  { id: "plantid", emoji: "🔍", accent: "#8effab", title: "Plant ID Challenge", desc: "Guess the plant from its photo before you run out of guesses.", storageKey: "pp_game_plantid_best", timePerQuestion: 15, xpPerCorrect: 5, makeQuestion: makePlantIdQuestion },
  { id: "companion", emoji: "🤝", accent: "#ffd86b", title: "Companion Match", desc: "Pick the plant that grows best alongside each one.", storageKey: "pp_game_companion_best", timePerQuestion: 0, xpPerCorrect: 8, makeQuestion: makeCompanionQuestion },
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
          title={game.title}
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
        <Text style={[styles.cardTitle, { color: theme.text }]}>🎮 Garden Games</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginBottom: 6 }}>
          Sharpen your gardening know-how. Beat your best score on each game.
        </Text>
        <View style={{ gap: 12, marginTop: 8 }}>
          {GAMES.map((g) => (
            <Pressable
              key={g.id}
              onPress={() => setActiveGame(g.id)}
              accessibilityRole="button"
              accessibilityLabel={`Play ${g.title}`}
              style={{ flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: theme.border }}
            >
              <View style={{ width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: `${g.accent}22`, borderWidth: 1, borderColor: `${g.accent}55` }}>
                <Text style={{ fontSize: 26 }}>{g.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>{g.title}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 2 }}>{g.desc}</Text>
                <Text style={{ color: g.accent, fontSize: 11, fontWeight: "900", marginTop: 6 }}>Best: {bests[g.id] || 0}/{TOTAL_ROUNDS}</Text>
              </View>
              <View style={{ backgroundColor: g.accent, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 }}>
                <Text style={{ color: "#07120b", fontSize: 13, fontWeight: "900" }}>Play</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
