import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, Text, View } from "react-native";
import { successHaptic, tapHaptic } from "../core";

// Reusable multiple-choice quiz engine shared by the garden mini-games. A game
// supplies makeQuestion() (returns { prompt, image?, options:[{label,correct}],
// reveal? }) plus config (rounds, optional per-question timer, storage key). The
// engine owns the round loop, scoring, timer, reveal feedback, and best-score
// persistence — so each game is just its question generator.
export function QuizGame({ theme, onExit, title, emoji, accent = "#5cff89", totalRounds = 10, timePerQuestion = 0, xpPerCorrect = 0, onAwardXp, storageKey, makeQuestion }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(() => makeQuestion());
  const [picked, setPicked] = useState(null); // index of the chosen option
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState(0);
  const [earned, setEarned] = useState(0); // XP earned this run
  const timerRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((v) => { if (v) setBest(Number(v) || 0); }).catch(() => {});
  }, [storageKey]);

  // Per-question countdown (only when a game opts into a timer).
  useEffect(() => {
    if (!timePerQuestion || picked !== null || finished) return undefined;
    if (timeLeft <= 0) { reveal(-1); return undefined; }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, picked, finished, timePerQuestion]);

  function reveal(index) {
    if (picked !== null) return;
    clearTimeout(timerRef.current);
    const correct = index >= 0 && question.options[index]?.correct;
    if (correct) {
      successHaptic();
      setScore((s) => s + 1);
      // Bonus XP for every right answer, with instant feedback via the global popup.
      if (xpPerCorrect > 0 && onAwardXp) { onAwardXp(xpPerCorrect); setEarned((e) => e + xpPerCorrect); }
    } else { tapHaptic("light"); }
    setPicked(index);
  }

  function next() {
    const nextRound = round + 1;
    if (nextRound >= totalRounds) {
      const finalScore = score; // score already reflects the last answer
      // Completion bonus, doubled for a perfect run.
      const completionBonus = 25 + (finalScore >= totalRounds ? 25 : 0);
      if (onAwardXp) onAwardXp(completionBonus);
      setEarned((e) => e + completionBonus);
      setFinished(true);
      if (finalScore > best) { setBest(finalScore); AsyncStorage.setItem(storageKey, String(finalScore)).catch(() => {}); }
      return;
    }
    setRound(nextRound);
    setQuestion(makeQuestion());
    setPicked(null);
    setTimeLeft(timePerQuestion);
  }

  function restart() {
    setRound(0); setScore(0); setPicked(null); setTimeLeft(timePerQuestion);
    setEarned(0); setQuestion(makeQuestion()); setFinished(false);
  }

  if (finished) {
    const isRecord = score >= best && score > 0;
    return (
      <View style={{ alignItems: "center", paddingVertical: 30 }}>
        <Text style={{ fontSize: 52 }}>{score >= totalRounds * 0.8 ? "🏆" : score >= totalRounds * 0.5 ? "🌱" : "🌧️"}</Text>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900", marginTop: 10 }}>You scored {score}/{totalRounds}</Text>
        <Text style={{ color: accent, fontSize: 16, fontWeight: "900", marginTop: 8 }}>✨ +{earned} XP earned</Text>
        {isRecord ? <Text style={{ color: accent, fontSize: 14, fontWeight: "900", marginTop: 6 }}>🎉 New best!</Text> : (
          <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", marginTop: 6 }}>Best: {best}/{totalRounds}</Text>
        )}
        <Pressable onPress={restart} style={{ marginTop: 24, backgroundColor: accent, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 40 }}>
          <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>Play again</Text>
        </Pressable>
        <Pressable onPress={onExit} style={{ marginTop: 12, paddingVertical: 12, paddingHorizontal: 40 }}>
          <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "800" }}>Back to games</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      {/* Header row: exit, progress, score */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <Pressable onPress={onExit} hitSlop={10} style={{ paddingVertical: 4, paddingRight: 10 }}>
          <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>‹ Exit</Text>
        </Pressable>
        <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{emoji} {title}</Text>
        <Text style={{ color: accent, fontSize: 14, fontWeight: "900" }}>⭐ {score}  ✨ {earned}</Text>
      </View>

      {/* Progress bar */}
      <View style={{ height: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 4 }}>
        <View style={{ width: `${(round / totalRounds) * 100}%`, height: 6, backgroundColor: accent, borderRadius: 999 }} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800" }}>Question {round + 1} of {totalRounds}</Text>
        {timePerQuestion ? (
          <Text style={{ color: picked !== null ? theme.secondaryText : timeLeft <= 3 ? "#ff7b7b" : theme.secondaryText, fontSize: 11, fontWeight: "900" }}>⏱ {picked !== null ? "—" : `${timeLeft}s`}</Text>
        ) : null}
      </View>

      {question.image ? (
        <View style={{ alignItems: "center", marginBottom: 16, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, paddingVertical: 18, borderWidth: 1, borderColor: theme.border }}>
          <Image source={question.image} style={{ width: 160, height: 160 }} resizeMode="contain" />
        </View>
      ) : null}

      <Text style={{ color: theme.text, fontSize: 18, fontWeight: "900", marginBottom: 16, textAlign: "center" }}>{question.prompt}</Text>

      <View style={{ gap: 10 }}>
        {question.options.map((opt, i) => {
          const isPicked = picked === i;
          const showAnswer = picked !== null;
          const bg = showAnswer
            ? opt.correct ? "rgba(92,255,137,0.16)" : isPicked ? "rgba(255,123,123,0.16)" : "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.06)";
          const border = showAnswer
            ? opt.correct ? "#5cff89" : isPicked ? "#ff7b7b" : theme.border
            : "rgba(255,255,255,0.12)";
          return (
            <Pressable
              key={`${opt.label}-${i}`}
              onPress={() => reveal(i)}
              disabled={showAnswer}
              accessibilityRole="button"
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: bg, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 16, borderWidth: 1.5, borderColor: border }}
            >
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: "800", flex: 1 }}>{opt.label}</Text>
              {showAnswer && opt.correct ? <Text style={{ fontSize: 16 }}>✅</Text> : showAnswer && isPicked ? <Text style={{ fontSize: 16 }}>❌</Text> : null}
            </Pressable>
          );
        })}
      </View>

      {picked !== null ? (
        <View style={{ marginTop: 16 }}>
          {question.reveal ? (
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18, marginBottom: 12, textAlign: "center" }}>{question.reveal}</Text>
          ) : null}
          <Pressable onPress={next} style={{ backgroundColor: accent, borderRadius: 16, paddingVertical: 15, alignItems: "center" }}>
            <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>{round + 1 >= totalRounds ? "See results" : "Next question →"}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
