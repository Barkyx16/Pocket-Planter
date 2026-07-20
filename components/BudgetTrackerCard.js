import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import { tapHaptic } from "../core";

const STORAGE_KEY = "pp_gardenExpenses";
const CATS = [
  { id: "seeds", label: "🌱 Seeds", color: "#8effab" },
  { id: "soil", label: "🪴 Soil", color: "#bf7a12" },
  { id: "tools", label: "🧰 Tools", color: "#6bc7ff" },
  { id: "other", label: "📦 Other", color: "#d8c8ff" },
];
const catOf = (id) => CATS.find((c) => c.id === id) || CATS[3];

export const BudgetTrackerCard = memo(function BudgetTrackerCard({ theme }) {
  const [expenses, setExpenses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [cat, setCat] = useState("seeds");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) { try { setExpenses(JSON.parse(val) || []); } catch (e) { /* ignore */ } }
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setExpenses(next); AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };
  const add = () => {
    const amt = parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) return;
    tapHaptic("light");
    persist([{ id: Date.now().toString(), amount: Math.round(amt * 100) / 100, label: label.trim(), cat, date: new Date().toISOString() }, ...expenses]);
    setAmount(""); setLabel("");
  };
  const remove = (id) => { tapHaptic("light"); persist(expenses.filter((e) => e.id !== id)); };

  if (!loaded) return null;

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCat = CATS.map((c) => ({ ...c, sum: expenses.filter((e) => e.cat === c.id).reduce((s, e) => s + e.amount, 0) })).filter((c) => c.sum > 0);

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Track what you spend on the garden — it feeds your ROI and shows where the money goes.
      </Text>

      <View style={{ alignItems: "center", marginTop: 14, backgroundColor: "rgba(255,216,107,0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255,216,107,0.25)" }}>
        <Text style={{ color: "#ffd86b", fontSize: 30, fontWeight: "900" }}>${total.toFixed(2)}</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800" }}>total invested</Text>
        {byCat.length ? (
          <Text style={{ color: theme.secondaryText, fontSize: 11.5, fontWeight: "700", marginTop: 6, textAlign: "center" }}>
            {byCat.map((c) => `${c.label} $${c.sum.toFixed(0)}`).join("  ·  ")}
          </Text>
        ) : null}
      </View>

      {/* ADD */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="$" placeholderTextColor="#8fbf9d" style={{ width: 70, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "800" }} />
        <TextInput value={label} onChangeText={setLabel} placeholder="What for? (optional)" placeholderTextColor="#8fbf9d" style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "700" }} />
        <Pressable onPress={add} style={{ backgroundColor: "#5cff89", borderRadius: 12, paddingHorizontal: 15, justifyContent: "center" }}><Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>＋</Text></Pressable>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {CATS.map((c) => {
          const active = cat === c.id;
          return (
            <Pressable key={c.id} onPress={() => setCat(c.id)} style={{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: active ? c.color + "22" : "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: active ? c.color : "rgba(255,255,255,0.1)" }}>
              <Text style={{ color: active ? c.color : theme.secondaryText, fontSize: 11.5, fontWeight: "800" }}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {expenses.length ? (
        <View style={{ gap: 6, marginTop: 12 }}>
          {expenses.slice(0, 8).map((e) => {
            const c = catOf(e.cat);
            return (
              <View key={e.id} style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 10, paddingVertical: 7, paddingHorizontal: 10 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.color }} />
                <Text style={{ flex: 1, color: theme.text, fontSize: 13, fontWeight: "700" }} numberOfLines={1}>{e.label || c.label.replace(/^\S+\s/, "")}</Text>
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: "900" }}>${e.amount.toFixed(2)}</Text>
                <Pressable onPress={() => remove(e.id)} hitSlop={8}><Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>✕</Text></Pressable>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
})
