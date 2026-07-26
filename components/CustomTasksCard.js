import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { tapHaptic } from "../core";
import { useTranslation } from "../lib/i18n";
import { ChoreRotationSection } from "./ChoreRotationSection";

const STORAGE_KEY = "pp_customTasks";
const INTERVALS = [
  { days: 3, label: "3 days" },
  { days: 7, label: "Weekly" },
  { days: 14, label: "2 weeks" },
  { days: 30, label: "Monthly" },
];

export const CustomTasksCard = memo(function CustomTasksCard({ theme }) {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [interval, setIntervalDays] = useState(7);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) { try { setTasks(JSON.parse(val) || []); } catch (e) { /* ignore */ } }
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setTasks(next); AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };

  const add = async () => {
    const t = title.trim();
    if (!t) return;
    tapHaptic("light");
    let notifId = null;
    try {
      const settings = await Notifications.getPermissionsAsync();
      let granted = settings.granted;
      if (!granted) granted = (await Notifications.requestPermissionsAsync()).granted;
      if (granted) {
        notifId = await Notifications.scheduleNotificationAsync({
          content: { title: "🌿 Garden Task", body: t, sound: true },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: interval * 86400, repeats: true },
        });
      }
    } catch (e) { /* scheduling may be limited in Expo Go */ }
    persist([{ id: Date.now().toString(), title: t, interval, notifId }, ...tasks]);
    setTitle("");
    if (!notifId) Alert.alert("Task saved", "Reminders need notification permission (and a dev build) to fire, but your task is saved here.");
  };

  const remove = async (task) => {
    tapHaptic("light");
    if (task.notifId) { try { await Notifications.cancelScheduledNotificationAsync(task.notifId); } catch (e) { /* ignore */ } }
    persist(tasks.filter((t) => t.id !== task.id));
  };

  if (!loaded) return null;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("customTasks.setYourOwnRecurringGarden")}
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder={t("customTasks.egPruneTomatoesTurnCompost")}
        placeholderTextColor="#8fbf9d"
        style={{ marginTop: 14, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "700" }}
      />
      <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
        {INTERVALS.map((iv) => {
          const active = interval === iv.days;
          return (
            <Pressable key={iv.days} onPress={() => setIntervalDays(iv.days)} style={{ flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 8, backgroundColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.1)" }}>
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{iv.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={add} style={{ marginTop: 10, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}>
        <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>{t("customTasks.addReminder")}</Text>
      </Pressable>

      {tasks.length ? (
        <View style={{ gap: 6, marginTop: 12 }}>
          {tasks.map((task) => (
            <View key={task.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <Text style={{ fontSize: 14 }}>{task.notifId ? "🔔" : "📝"}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }} numberOfLines={1}>{task.title}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 2 }}>Every {INTERVALS.find((i) => i.days === task.interval)?.label.toLowerCase() || `${task.interval} days`}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.deleteTask")} onPress={() => remove(task)} hitSlop={8}><Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>✕</Text></Pressable>
            </View>
          ))}
        </View>
      ) : null}

      {/* Household chore rotation */}
      <ChoreRotationSection theme={theme} />
    </View>
  );
})
