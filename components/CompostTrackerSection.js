import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, View } from "react-native";
import { getTodayKey, tapHaptic } from "../core";
import { semantic } from "../theme";
import { formatDate } from "../lib/i18n";
import { CardHeader } from "./CardHeader";
import { SkeletonSection } from "./Skeleton";

export const COMPOST_STORAGE_KEY = "pp_compostLog";

// A compost pile wants a lot more carbon-rich "browns" than nitrogen-rich
// "greens" — roughly 2–3 parts brown to 1 part green by volume. We track each
// addition so we can show that ratio and nudge the pile back into balance.
const READY_BASE_DAYS = 90; // a cool, un-turned pile takes ~3 months
const READY_PER_TURN = 7; // every turn injects air and speeds things up
const READY_MIN_DAYS = 30; // even a hot, well-turned pile needs a few weeks

const KINDS = {
  green: { label: "Greens", icon: "🥬", color: "#8effab", hint: "veg scraps, grass, coffee" },
  brown: { label: "Browns", icon: "🍂", color: "#bf7a12", hint: "leaves, cardboard, straw" },
};

function daysBetween(aKey, bKey) {
  const a = new Date(aKey + "T12:00:00").getTime();
  const b = new Date(bKey + "T12:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

export const CompostTrackerSection = memo(function CompostTrackerSection({ theme }) {
  const [entries, setEntries] = useState([]); // { id, kind: green|brown|turn, date }
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(COMPOST_STORAGE_KEY)
      .then((val) => {
        if (alive && val) {
          try { setEntries(JSON.parse(val) || []); } catch (e) { /* ignore bad data */ }
        }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => {
    setEntries(next);
    AsyncStorage.setItem(COMPOST_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const add = (kind) => {
    tapHaptic("light");
    persist([{ id: Date.now().toString(), kind, date: getTodayKey() }, ...entries]);
  };

  const removeEntry = (id) => {
    tapHaptic("light");
    persist(entries.filter((e) => e.id !== id));
  };

  if (!loaded) {
    return (
      <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
        <SkeletonSection lines={2} />
      </View>
    );
  }

  const greens = entries.filter((e) => e.kind === "green").length;
  const browns = entries.filter((e) => e.kind === "brown").length;
  const turns = entries.filter((e) => e.kind === "turn");
  const additions = entries.filter((e) => e.kind !== "turn");

  // Oldest addition marks when the pile started cooking.
  const startedAt = additions.length ? additions[additions.length - 1].date : null;
  const lastTurn = turns.length ? turns[0].date : null;
  const today = getTodayKey();

  // Balance advice — browns-per-green, aiming for ~2.5:1.
  const ratio = greens ? browns / greens : browns ? Infinity : 0;
  let balance;
  if (!additions.length) balance = { color: theme.secondaryText, text: "Log what you add to keep the mix balanced." };
  else if (ratio < 1.5) balance = { color: "#ffd86b", text: "Too wet & green — add more browns (dry leaves, cardboard, straw)." };
  else if (ratio > 3.5) balance = { color: "#ffd86b", text: "Very dry & brown — add greens (scraps, grass) and a little water." };
  else balance = { color: "#8effab", text: "Nicely balanced. Turn it every week or two to speed things up." };

  // Ready estimate: base time, shortened by each turn.
  let readyText = "—";
  if (startedAt) {
    const cooking = daysBetween(startedAt, today);
    const target = Math.max(READY_MIN_DAYS, READY_BASE_DAYS - turns.length * READY_PER_TURN);
    const left = target - cooking;
    readyText = left <= 0 ? "Check it!" : `~${left}d`;
  }

  const turnedAgo = lastTurn ? (() => {
    const d = daysBetween(lastTurn, today);
    return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d}d ago`;
  })() : "never";

  return (
    <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <CardHeader
        emoji="♻️"
        eyebrow="Compost tracker"
        color={semantic.success}
        subtitle="Log greens & browns to keep your pile balanced and know when it's ready."
        theme={theme}
      />

      {/* BALANCE METER */}
      <View style={{ marginTop: 12, backgroundColor: `${balance.color}14`, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: `${balance.color}33` }}>
        <View style={{ flexDirection: "row", height: 8, borderRadius: 4, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.08)" }}>
          <View style={{ flex: greens || (additions.length ? 0 : 1), backgroundColor: KINDS.green.color }} />
          <View style={{ flex: browns || (additions.length ? 0 : 1), backgroundColor: KINDS.brown.color }} />
        </View>
        <Text style={{ color: balance.color, fontSize: 12, fontWeight: "800", lineHeight: 17, marginTop: 8 }}>
          {balance.text}
        </Text>
      </View>

      {/* STATS */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
        {[
          { v: greens, l: "Greens", c: KINDS.green.color },
          { v: browns, l: "Browns", c: KINDS.brown.color },
          { v: turns.length, l: "Turns", c: "#6bc7ff" },
          { v: readyText, l: "Ready", c: "#ffd86b" },
        ].map((s) => (
          <View key={s.l} style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
            <Text style={{ color: s.c, fontSize: 16, fontWeight: "900" }}>{s.v}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 2 }}>{s.l}</Text>
          </View>
        ))}
      </View>

      {/* ADD BUTTONS */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
        {["green", "brown"].map((k) => (
          <Pressable
            key={k}
            onPress={() => add(k)}
            accessibilityRole="button"
            accessibilityLabel={`Add ${KINDS[k].label}`}
            style={{ flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, backgroundColor: `${KINDS[k].color}1f`, borderWidth: 1, borderColor: `${KINDS[k].color}40` }}
          >
            <Text style={{ color: KINDS[k].color, fontSize: 13, fontWeight: "900" }}>{KINDS[k].icon} + {KINDS[k].label}</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 9, fontWeight: "700", marginTop: 2 }}>{KINDS[k].hint}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={() => add("turn")}
        accessibilityRole="button"
        accessibilityLabel="Log that you turned the pile"
        style={{ marginTop: 8, alignItems: "center", paddingVertical: 11, borderRadius: 12, backgroundColor: "rgba(107,199,255,0.12)", borderWidth: 1, borderColor: "rgba(107,199,255,0.28)" }}
      >
        <Text style={{ color: "#6bc7ff", fontSize: 13, fontWeight: "900" }}>🔄 Turned the pile · last: {turnedAgo}</Text>
      </Pressable>

      {/* RECENT ENTRIES */}
      {entries.length ? (
        <View style={{ gap: 6, marginTop: 12 }}>
          {entries.slice(0, 5).map((e) => {
            const meta = e.kind === "turn"
              ? { icon: "🔄", label: "Turned the pile", color: "#6bc7ff" }
              : { icon: KINDS[e.kind].icon, label: `Added ${KINDS[e.kind].label.toLowerCase()}`, color: KINDS[e.kind].color };
            return (
              <View key={e.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}>
                <Text style={{ fontSize: 14 }}>{meta.icon}</Text>
                <Text style={{ flex: 1, color: theme.text, fontSize: 12, fontWeight: "800" }}>{meta.label}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700" }}>
                  {formatDate(new Date(e.date + "T12:00:00"), { month: "short", day: "numeric" })}
                </Text>
                <Pressable onPress={() => removeEntry(e.id)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Delete compost entry">
                  <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "900" }}>✕</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
});
