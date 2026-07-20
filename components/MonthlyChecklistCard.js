import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { getMonthKey, getMonthlyChecklistTasks } from "../core";

export const MonthlyChecklistCard = memo(function MonthlyChecklistCard({ theme, zone, monthlyChecklist, setMonthlyChecklist }) {
  const monthName = new Date().toLocaleDateString("en-US", { month: "long" });
  const tasks = getMonthlyChecklistTasks(zone);

  // Key by year+month so each month starts fresh and old checks don't bleed over.
  const monthKey = getMonthKey();
  const checked = (monthlyChecklist && monthlyChecklist[monthKey]) || {};
  const toggle = (i) => {
    setMonthlyChecklist((current) => {
      const month = { ...((current && current[monthKey]) || {}) };
      month[i] = !month[i];
      return { ...(current || {}), [monthKey]: month };
    });
  };

  if (!zone || !tasks.length) return null;

  const doneCount = tasks.filter((_, i) => checked[i]).length;
  const remaining = tasks.length - doneCount;

  return (
    <View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{monthName} Garden Checklist</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "600", marginTop: 4 }}>
        {doneCount}/{tasks.length} done{remaining > 0 ? ` · ${remaining} to go this month` : " · all wrapped up! 🎉"}
      </Text>
      <View style={{ height: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 10 }}>
        <View style={{ height: 6, borderRadius: 999, backgroundColor: "#8effab", width: `${(doneCount / tasks.length) * 100}%` }} />
      </View>

      <View style={{ gap: 8, marginTop: 14 }}>
        {tasks.map((task, i) => {
          const isDone = !!checked[i];
          return (
            <Pressable
              key={`task-${i}`}
              onPress={() => toggle(i)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isDone }}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: isDone ? "rgba(142,239,171,0.10)" : "rgba(255,255,255,0.05)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: isDone ? "rgba(142,239,171,0.35)" : "rgba(255,255,255,0.10)" }}
            >
              <View style={{ width: 24, height: 24, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: isDone ? "#8effab" : "transparent", borderWidth: 2, borderColor: isDone ? "#8effab" : "rgba(255,255,255,0.3)" }}>
                {isDone && <Text style={{ color: "#0e2414", fontSize: 14, fontWeight: "900" }}>✓</Text>}
              </View>
              <Text style={{ flex: 1, color: isDone ? theme.secondaryText : theme.text, fontSize: 14, fontWeight: "600", textDecorationLine: isDone ? "line-through" : "none" }}>
                {task}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
})
