import { memo } from "react";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { getDateKey, getTodayKey, tapHaptic } from "../core";
import { useTranslation, formatDate } from "../lib/i18n";
import { IconText } from "./IconText";
import { CompostTrackerSection } from "./CompostTrackerSection";
import { PruningScheduleSection } from "./PruningScheduleSection";

const EN_WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// `label` is the English value persisted on each care entry (`actionLabel`) and
// read by the CSV export and the timeline, so it stays stable; what the user
// sees is `labelKey`, translated at render.
// i18n-ignore
const CARE_ACTIONS = [
  { id: "compost", label: "Added Compost", labelKey: "soilCareText.actionCompost", icon: "🌿", color: "#8effab" },
  { id: "repot", label: "Repotted", labelKey: "soilCareText.actionRepot", icon: "🪴", color: "#ffd86b" },
  { id: "pests", label: "Treated Pests", labelKey: "soilCareText.actionPests", icon: "🐛", color: "#ff7b7b" },
  { id: "ph", label: "pH Tested", labelKey: "soilCareText.actionPh", icon: "🧪", color: "#6bc7ff" },
  { id: "fertilize", label: "Fertilized", labelKey: "soilCareText.actionFertilize", icon: "🌾", color: "#ff9f43" },
  { id: "pruned", label: "Pruned", labelKey: "soilCareText.actionPruned", icon: "✂️", color: "#d8c8ff" },
  { id: "mulch", label: "Mulched", labelKey: "soilCareText.actionMulch", icon: "🍂", color: "#bf7a12" },
  { id: "transplant", label: "Transplanted", labelKey: "soilCareText.actionTransplant", icon: "🚚", color: "#5cff89" },
  { id: "watered", label: "Deep Watered", labelKey: "soilCareText.actionWatered", icon: "💧", color: "#6bc7ff" },
  { id: "staked", label: "Staked/Trellised", labelKey: "soilCareText.actionStaked", icon: "🪵", color: "#d7ebdc" },
  { id: "harvest", label: "Harvested", labelKey: "soilCareText.actionHarvest", icon: "🎉", color: "#ffd86b" },
  { id: "custom", label: "Custom Note", labelKey: "soilCareText.actionCustom", icon: "📝", color: "#8effab" },
];

/** Translation key for a stored care action id, or null for unknown ids. */
export function careActionLabelKey(actionId) {
  const action = CARE_ACTIONS.find((a) => a.id === actionId);
  return action ? action.labelKey : null;
}

export const SoilCareLogCard = memo(function SoilCareLogCard({ theme, savedPlants, careLog, setCareLog, onFertilizerLogged, onFertilized, onUndoToast }) {
  const { t, tn, language } = useTranslation();
  // Entries store the English label; show it in the current language when the
  // action id is one we know, and as written otherwise.
  const entryLabel = (entry) => {
    const key = careActionLabelKey(entry.actionId);
    return key ? t(key) : entry.actionLabel;
  };
  const [selectedPlant, setSelectedPlant] = useState("Garden");
  const [customNote, setCustomNote] = useState("");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [filterPlant, setFilterPlant] = useState("All");
  const [todayOnly, setTodayOnly] = useState(false);

  const plantOptions = ["Garden", ...savedPlants];

  const addCareEntry = () => {
    if (!selectedAction) {
      Alert.alert(t("alerts.selectActionTitle"), t("alerts.selectActionBody"));
      return;
    }
    const action = CARE_ACTIONS.find(a => a.id === selectedAction);
    const entry = {
      id: Date.now().toString(),
      date: getTodayKey(),
      plant: selectedPlant,
      actionId: selectedAction,
      actionLabel: action.label,
      actionIcon: action.icon,
      actionColor: action.color,
      note: customNote.trim(),
      createdAt: new Date().toISOString(),
    };
    setCareLog(current => [entry, ...current]);
    setSelectedAction(null);
    setCustomNote("");
    setShowAddPanel(false);

    if (selectedAction === "fertilize" && selectedPlant !== "Garden" && onFertilized) onFertilized(selectedPlant);
    if (selectedAction === "fertilize" && selectedPlant !== "Garden" && onFertilizerLogged) {
      Alert.alert(
        t("alerts.fertilizedTitle"),
        t("alerts.fertilizedBody", { plant: selectedPlant }),
        [
          { text: t("soilCareText.noThanks"), style: "cancel" },
          { text: tn("soilCareText.inDays", 7), onPress: () => onFertilizerLogged(selectedPlant, 7) },
          { text: tn("soilCareText.inDays", 14), onPress: () => onFertilizerLogged(selectedPlant, 14) },
          { text: tn("soilCareText.inDays", 30), onPress: () => onFertilizerLogged(selectedPlant, 30) },
        ]
      );
    } else {
      Alert.alert(t("alerts.careLoggedTitle"), t("alerts.careLoggedBody", { icon: action.icon, label: t(action.labelKey), plant: selectedPlant }));
    }
  };

  const deleteCareEntry = (id) => {
    const removed = careLog.find((e) => e.id === id);
    if (!removed) return;
    tapHaptic("light");
    setCareLog((current) => current.filter((e) => e.id !== id));
    if (onUndoToast) {
      onUndoToast(t("soilCareText.entryDeleted"), () => {
        setCareLog((current) => [removed, ...current].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      });
    }
  };

  // Calendar helpers
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
  const monthLabel = formatDate(new Date(calendarYear, calendarMonth), {
  month: "long",
  year: "numeric"
});

  // English keeps its two-letter day labels; other languages get Intl's short
  // weekday names (1 Jan 2023 was a Sunday).
  const weekdayLabels = language === "en"
    ? EN_WEEKDAYS
    : EN_WEEKDAYS.map((d, i) => formatDate(new Date(2023, 0, 1 + i), { weekday: "short" }) || d);

  const getEntriesForDate = (dateStr) => {
    return careLog.filter(e => e.date === dateStr && (filterPlant === "All" || e.plant === filterPlant));
  };

  const getDayKey = (day) => {
    const d = new Date(calendarYear, calendarMonth, day);
    return getDateKey(d);
  };

  const hasEntries = (day) => getEntriesForDate(getDayKey(day)).length > 0;
  const getEntryColor = (day) => {
    const entries = getEntriesForDate(getDayKey(day));
    if (!entries.length) return null;
    return entries[0].actionColor;
  };

  const selectedDateEntries = getEntriesForDate(selectedDate);

  const filteredLog = careLog.filter(e =>
    (filterPlant === "All" || e.plant === filterPlant) &&
    (!todayOnly || e.date === getTodayKey())
  );

  // Stats
  const totalEntries = careLog.length;
  const thisMonthEntries = careLog.filter(e => {
    const d = new Date(e.createdAt);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;
  const mostCommonAction = (() => {
    const counts = {};
    careLog.forEach(e => { counts[e.actionId] = (counts[e.actionId] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return null;
    return CARE_ACTIONS.find(a => a.id === top[0]);
  })();
  const plantsLogged = new Set(careLog.map(e => e.plant).filter(p => p !== "Garden")).size;
  const lastEntry = careLog.length ? careLog.reduce((a, b) => (new Date(b.createdAt) > new Date(a.createdAt) ? b : a)) : null;
  const lastAgo = (() => {
    if (!lastEntry) return "";
    const then = new Date(lastEntry.createdAt); then.setHours(0, 0, 0, 0);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const days = Math.round((now - then) / 86400000);
    return days <= 0 ? t("soilCareText.today") : days === 1 ? t("soilCareText.yesterday") : tn("soilCareText.daysAgo", days);
  })();

return (
    <View>

      {/* STATS ROW */}
      <View style={styles.careLogStatsRow}>
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{totalEntries}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>{t("soilCareLog.totalLogs")}</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{thisMonthEntries}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>{t("soilCareLog.thisMonth")}</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{plantsLogged}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>{t("soilCareLog.plantsTracked")}</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{mostCommonAction?.icon || "—"}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>{t("soilCareLog.topAction")}</Text>
        </View>
      </View>

      {/* LAST ACTIVITY */}
      {lastEntry ? (
        <View style={{ marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(107, 199, 255, 0.08)", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.2)" }}>
          <Text style={{ fontSize: 16 }}>🕒</Text>
          <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "800", flex: 1, lineHeight: 17 }}>
            {t("soilCareLog.last")} {lastEntry.actionIcon} {entryLabel(lastEntry)} · {lastEntry.plant === "Garden" ? t("soilCareLog.wholeGarden") : lastEntry.plant} · {lastAgo}
          </Text>
        </View>
      ) : null}

      {/* ADD ENTRY BUTTON */}
      <Pressable
        onPress={() => setShowAddPanel(!showAddPanel)}
        style={[styles.careLogAddButton, { backgroundColor: showAddPanel ? "rgba(107, 199, 255, 0.16)" : "#6bc7ff" }]}
      >
        <Text style={[styles.careLogAddButtonText, { color: showAddPanel ? "#6bc7ff" : "#07120b" }]}>
          {showAddPanel ? t("soilCareLog.cancel") : t("soilCareLog.logCareAction")}
        </Text>
      </Pressable>

      {/* ADD PANEL */}
      {showAddPanel ? (
        <View style={styles.careLogAddPanel}>

          {/* PLANT SELECTOR */}
          <Text style={styles.careLogPanelLabel}>{t("soilCareLog.whichPlant")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {plantOptions.map(plant => (
              <Pressable
                key={plant}
                onPress={() => setSelectedPlant(plant)}
                style={[styles.careLogPlantPill, {
                  backgroundColor: selectedPlant === plant ? "#6bc7ff" : "rgba(255, 255, 255, 0.08)",
                  borderColor: selectedPlant === plant ? "#6bc7ff" : "rgba(255, 255, 255, 0.1)",
                }]}
              >
                <Text style={[styles.careLogPlantPillText, { color: selectedPlant === plant ? "#07120b" : "#ffffff" }]}>
                  {plant === "Garden" ? t("soilCareLog.wholeGarden2") : plant}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ACTION GRID */}
          <Text style={[styles.careLogPanelLabel, { marginTop: 14 }]}>{t("soilCareLog.whatDidYouDo")}</Text>
          <View style={styles.careLogActionGrid}>
            {CARE_ACTIONS.map(action => (
              <Pressable
                key={action.id}
                onPress={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
                style={[styles.careLogActionTile, {
                  backgroundColor: selectedAction === action.id ? action.color + "25" : "rgba(255, 255, 255, 0.06)",
                  borderColor: selectedAction === action.id ? action.color : "rgba(255, 255, 255, 0.08)",
                  borderWidth: selectedAction === action.id ? 2 : 1,
                }]}
              >
                <Text style={styles.careLogActionIcon}>{action.icon}</Text>
                <Text style={[styles.careLogActionLabel, { color: selectedAction === action.id ? action.color : "#d7ebdc" }]}>
                  {t(action.labelKey)}
                </Text>
                {selectedAction === action.id ? (
                  <View style={[styles.careLogActionCheck, { backgroundColor: action.color }]}>
                    <Text style={styles.careLogActionCheckText}>✓</Text>
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>

          {/* CUSTOM NOTE */}
          <Text style={[styles.careLogPanelLabel, { marginTop: 14 }]}>{t("soilCareLog.addANoteOptional")}</Text>
          <TextInput
            value={customNote}
            onChangeText={setCustomNote}
            placeholder={t("soilCareLog.egUsedOrganicNeemOil")}
            placeholderTextColor="#8fbf9d"
            multiline
            style={styles.careLogNoteInput}
          />

          {/* LOG BUTTON */}
          <Pressable onPress={addCareEntry} style={styles.careLogSubmitButton}>
            <IconText label={t("soilCareLog.logCareEntry")} style={styles.careLogSubmitButtonText} />
          </Pressable>
        </View>
      ) : null}

      {/* VIEW MODE TOGGLE */}
      {careLog.length > 0 ? (
        <>
          <View style={styles.careLogViewToggle}>
            {[{ id: "calendar", label: t("soilCareLog.calendar") }, { id: "timeline", label: t("soilCareLog.timeline") }].map(v => (
              <Pressable
                key={v.id}
                onPress={() => setViewMode(v.id)}
                style={[styles.careLogViewBtn, viewMode === v.id && styles.careLogViewBtnActive]}
              >
                <Text style={[styles.careLogViewBtnText, viewMode === v.id && styles.careLogViewBtnTextActive]}>
                  {v.label}
                </Text>
              </Pressable>
            ))}
          </View>

         {/* PLANT FILTER */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10 }}>
            <Pressable
              onPress={() => setTodayOnly(v => !v)}
              style={[styles.journalFilterPill, todayOnly && styles.journalFilterPillActive]}
            >
              <IconText label={t("soilCareLog.today")} style={[styles.journalFilterPillText, todayOnly && styles.journalFilterPillTextActive]} />
            </Pressable>
            {["All", "Garden", ...savedPlants].map(plant => (
              <Pressable
                key={plant}
                onPress={() => setFilterPlant(plant)}
                style={[styles.journalFilterPill, filterPlant === plant && styles.journalFilterPillActive]}
              >
                <Text style={[styles.journalFilterPillText, filterPlant === plant && styles.journalFilterPillTextActive]}>
                  {plant === "All" ? t("soilCareLog.all") : plant === "Garden" ? t("soilCareLog.garden") : plant}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* CALENDAR VIEW */}
          {viewMode === "calendar" ? (
            <View style={styles.careLogCalendar}>
              {/* MONTH NAV */}
              <View style={styles.careLogCalendarNav}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t("a11y.previousMonth")}
                  onPress={() => {
                    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
                    else setCalendarMonth(m => m - 1);
                  }}
                  style={styles.careLogCalendarNavBtn}
                >
                  <Text style={styles.careLogCalendarNavText}>‹</Text>
                </Pressable>
                <Text style={styles.careLogCalendarMonthLabel}>{monthLabel}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t("a11y.nextMonth")}
                  onPress={() => {
                    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
                    else setCalendarMonth(m => m + 1);
                  }}
                  style={styles.careLogCalendarNavBtn}
                >
                  <Text style={styles.careLogCalendarNavText}>›</Text>
                </Pressable>
              </View>

              {/* DAY LABELS */}
              <View style={styles.careLogCalendarDayLabels}>
                {weekdayLabels.map((d, i) => (
                  <Text key={i} style={styles.careLogCalendarDayLabel}>{d}</Text>
                ))}
              </View>

              {/* GRID */}
              <View style={styles.careLogCalendarGrid}>
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.careLogCalendarCell} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dateKey = getDayKey(day);
                  const isToday = dateKey === getTodayKey();
                  const isSelected = dateKey === selectedDate;
                  const hasLog = hasEntries(day);
                  const dotColor = getEntryColor(day);
                  return (
                    <Pressable
                      key={day}
                      onPress={() => setSelectedDate(dateKey)}
                      style={[styles.careLogCalendarCell, {
                        backgroundColor: isSelected
                          ? "#6bc7ff"
                          : isToday
                          ? "rgba(107, 199, 255, 0.16)"
                          : hasLog
                          ? "rgba(92, 255, 137, 0.1)"
                          : "transparent",
                        borderColor: isSelected ? "#6bc7ff" : isToday ? "rgba(107, 199, 255, 0.4)" : "transparent",
                        borderWidth: isSelected || isToday ? 1.5 : 0,
                      }]}
                    >
                      <Text style={[styles.careLogCalendarDayNum, {
                        color: isSelected ? "#07120b" : isToday ? "#6bc7ff" : "#ffffff",
                        fontWeight: isToday || isSelected ? "900" : "700",
                      }]}>
                        {day}
                      </Text>
                      {hasLog ? (
                        <View style={[styles.careLogCalendarDot, { backgroundColor: isSelected ? "#07120b" : dotColor || "#5cff89" }]} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>

              {/* SELECTED DATE ENTRIES */}
              <View style={styles.careLogSelectedDatePanel}>
                <Text style={styles.careLogSelectedDateLabel}>
                  {formatDate(new Date(selectedDate + "T12:00:00"), {
  weekday: "long",
  month: "long",
  day: "numeric"
})}
                </Text>
                {selectedDateEntries.length === 0 ? (
                  <Text style={[styles.careLogEmptyDate, { color: theme.secondaryText }]}>
                    {t("soilCareLog.noCareLoggedForThis")}
                  </Text>
                ) : (
                  <View style={{ gap: 8, marginTop: 10 }}>
                    {selectedDateEntries.map(entry => (
                      <View key={entry.id} style={[styles.careLogEntryRow, { borderColor: entry.actionColor + "40", backgroundColor: entry.actionColor + "0D" }]}>
                        <Text style={styles.careLogEntryIcon}>{entry.actionIcon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.careLogEntryLabel}>{entryLabel(entry)}</Text>
                          {entry.plant !== "Garden" ? (
                            <Text style={[styles.careLogEntryPlant, { color: entry.actionColor }]}>🌱 {entry.plant}</Text>
                          ) : (
                            <IconText label={t("soilCareLog.wholeGarden2")} style={[styles.careLogEntryPlant, {
  color: theme.secondaryText
}]} />
                          )}
                          {entry.note ? (
                            <Text style={[styles.careLogEntryNote, { color: theme.secondaryText }]}>{entry.note}</Text>
                          ) : null}
                        </View>
                        <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.deleteEntry")} onPress={() => deleteCareEntry(entry.id)} style={styles.careLogDeleteBtn}>
                          <Text style={styles.careLogDeleteBtnText}>✕</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ) : (
            // TIMELINE VIEW
            <View style={{ gap: 10, marginTop: 4 }}>
              {filteredLog.length === 0 ? (
                <Text style={[styles.careLogEmptyDate, { color: theme.secondaryText, textAlign: "center", paddingVertical: 20 }]}>
                  {t("soilCareLog.noCareEntriesYetTap")}
                </Text>
              ) : (
                filteredLog.map(entry => (
                  <View key={entry.id} style={[styles.careLogEntryRow, { borderColor: entry.actionColor + "40", backgroundColor: entry.actionColor + "0D" }]}>
                    <Text style={styles.careLogEntryIcon}>{entry.actionIcon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLogEntryLabel}>{entryLabel(entry)}</Text>
                      <Text style={[styles.careLogEntryPlant, { color: entry.actionColor }]}>
                        {entry.plant === "Garden" ? t("soilCareLog.wholeGarden2") : `🌱 ${entry.plant}`}
                      </Text>
                      {entry.note ? (
                        <Text style={[styles.careLogEntryNote, { color: theme.secondaryText }]}>{entry.note}</Text>
                      ) : null}
                      <Text style={[styles.careLogEntryDate, { color: theme.secondaryText }]}>
                        {formatDate(new Date(entry.createdAt), {
  month: "short",
  day: "numeric",
  year: "numeric"
})}
                      </Text>
                    </View>
                    <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.deleteEntry")} onPress={() => deleteCareEntry(entry.id)} style={styles.careLogDeleteBtn}>
                      <Text style={styles.careLogDeleteBtnText}>✕</Text>
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          )}
        </>
      ) : (
        <View style={styles.careLogEmpty}>
          <Text style={styles.careLogEmptyIcon}>🧪</Text>
          <Text style={styles.careLogEmptyTitle}>{t("soilCareLog.noCareLoggedYet")}</Text>
          <Text style={[styles.careLogEmptyText, { color: theme.secondaryText }]}>
            {t("soilCareLog.tapAboveToLogYour")}
          </Text>
        </View>
      )}

      {/* Compost tracker — folded in here so it lives with the rest of soil care */}
      <CompostTrackerSection theme={theme} />

      {/* Pruning schedule for saved plants — a recurring care task */}
      <PruningScheduleSection theme={theme} savedPlants={savedPlants} />
    </View>
  );
})
