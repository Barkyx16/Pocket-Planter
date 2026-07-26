import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import { getTodayKey, tapHaptic } from "../core";
import { SkeletonSection } from "./Skeleton";

export const CHORE_STORAGE_KEY = "pp_choreRotation";

const CHORE_SUGGESTIONS = ["Water", "Weed", "Harvest", "Compost", "Feed plants"];
const DEFAULT = { members: [], chores: [], startDate: getTodayKey(), periodDays: 7 };

function daysBetween(aKey, bKey) {
  const a = new Date(aKey + "T12:00:00").getTime();
  const b = new Date(bKey + "T12:00:00").getTime();
  return Math.floor((b - a) / 86400000);
}

export const ChoreRotationSection = memo(function ChoreRotationSection({ theme }) {
  const [data, setData] = useState(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  const [memberDraft, setMemberDraft] = useState("");
  const [choreDraft, setChoreDraft] = useState("");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(CHORE_STORAGE_KEY)
      .then((val) => {
        if (alive && val) {
          try {
            const p = JSON.parse(val);
            if (p && Array.isArray(p.members)) setData({ ...DEFAULT, ...p });
          } catch (e) { /* ignore */ }
        }
        if (alive) setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => {
    setData(next);
    AsyncStorage.setItem(CHORE_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const addMember = () => {
    const n = memberDraft.trim();
    if (!n || data.members.includes(n)) { setMemberDraft(""); return; }
    tapHaptic("light");
    persist({ ...data, members: [...data.members, n] });
    setMemberDraft("");
  };
  const removeMember = (n) => { tapHaptic("light"); persist({ ...data, members: data.members.filter((m) => m !== n) }); };

  const addChore = (label) => {
    const c = (label || "").trim();
    if (!c || data.chores.includes(c)) { setChoreDraft(""); return; }
    tapHaptic("light");
    persist({ ...data, chores: [...data.chores, c] });
    setChoreDraft("");
  };
  const removeChore = (c) => { tapHaptic("light"); persist({ ...data, chores: data.chores.filter((x) => x !== c) }); };

  const advance = (dir) => {
    // Shift the rotation by one period by moving the start date a week.
    tapHaptic("light");
    const d = new Date(data.startDate + "T12:00:00");
    d.setDate(d.getDate() - dir * data.periodDays);
    persist({ ...data, startDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` });
  };

  if (!loaded) {
    return (
      <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
        <SkeletonSection lines={2} />
      </View>
    );
  }

  const period = Math.max(0, daysBetween(data.startDate, getTodayKey()) / data.periodDays | 0);
  const canAssign = data.members.length > 0 && data.chores.length > 0;
  const assignments = data.chores.map((chore, i) => ({
    chore,
    who: data.members[(i + period) % data.members.length],
  }));
  const remaining = data.periodDays - (daysBetween(data.startDate, getTodayKey()) % data.periodDays);

  return (
    <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        🔁 CHORE ROTATION
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Share the garden work — chores rotate through everyone each week.
      </Text>

      {/* Members */}
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>WHO HELPS</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={memberDraft}
          onChangeText={setMemberDraft}
          onSubmitEditing={addMember}
          placeholder="Add a name"
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, fontWeight: "700" }}
        />
        <Pressable onPress={addMember} accessibilityRole="button" accessibilityLabel="Add person" style={{ backgroundColor: "#ffd86b", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>
      {data.members.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {data.members.map((m) => (
            <Pressable key={m} onPress={() => removeMember(m)} style={{ flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "rgba(255,216,107,0.16)", borderWidth: 1, borderColor: "rgba(255,216,107,0.3)" }}>
              <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900" }}>{m}</Text>
              <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900" }}>✕</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Chores */}
      <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>CHORES</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={choreDraft}
          onChangeText={setChoreDraft}
          onSubmitEditing={() => addChore(choreDraft)}
          placeholder="Add a chore"
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, fontWeight: "700" }}
        />
        <Pressable onPress={() => addChore(choreDraft)} accessibilityRole="button" accessibilityLabel="Add chore" style={{ backgroundColor: "#8effab", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {CHORE_SUGGESTIONS.filter((c) => !data.chores.includes(c)).map((c) => (
          <Pressable key={c} onPress={() => addChore(c)} style={{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
            <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "800" }}>+ {c}</Text>
          </Pressable>
        ))}
      </View>
      {data.chores.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {data.chores.map((c) => (
            <Pressable key={c} onPress={() => removeChore(c)} style={{ flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "rgba(142,255,171,0.14)", borderWidth: 1, borderColor: "rgba(142,255,171,0.3)" }}>
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>{c}</Text>
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900" }}>✕</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* This week's assignments */}
      {canAssign ? (
        <View style={{ marginTop: 14, backgroundColor: "rgba(255,216,107,0.08)", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "rgba(255,216,107,0.22)" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900" }}>THIS WEEK</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800" }}>
              rotates in {remaining} day{remaining === 1 ? "" : "s"}
            </Text>
          </View>
          <View style={{ gap: 6 }}>
            {assignments.map((a) => (
              <View key={a.chore} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10 }}>
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: "800" }}>{a.chore}</Text>
                <Text style={{ color: "#ffd86b", fontSize: 13, fontWeight: "900" }}>{a.who}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
            <Pressable onPress={() => advance(-1)} style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "900" }}>‹ Previous</Text>
            </Pressable>
            <Pressable onPress={() => advance(1)} style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "900" }}>Next ›</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", fontStyle: "italic", marginTop: 12 }}>
          Add at least one person and one chore to start the rotation.
        </Text>
      )}
    </View>
  );
});
