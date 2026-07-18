import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { getTodayKey, tapHaptic } from "../core";

export function SoilCareLogCard({ theme, savedPlants, careLog, setCareLog, onFertilizerLogged, onUndoToast }) {
  const [selectedPlant, setSelectedPlant] = useState("Garden");
  const [customNote, setCustomNote] = useState("");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [filterPlant, setFilterPlant] = useState("All");
  const [todayOnly, setTodayOnly] = useState(false);

  const CARE_ACTIONS = [
    { id: "compost", label: "Added Compost", icon: "🌿", color: "#8effab" },
    { id: "repot", label: "Repotted", icon: "🪴", color: "#ffd86b" },
    { id: "pests", label: "Treated Pests", icon: "🐛", color: "#ff7b7b" },
    { id: "ph", label: "pH Tested", icon: "🧪", color: "#6bc7ff" },
    { id: "fertilize", label: "Fertilized", icon: "🌾", color: "#ff9f43" },
    { id: "pruned", label: "Pruned", icon: "✂️", color: "#d8c8ff" },
    { id: "mulch", label: "Mulched", icon: "🍂", color: "#bf7a12" },
    { id: "transplant", label: "Transplanted", icon: "🚚", color: "#5cff89" },
    { id: "watered", label: "Deep Watered", icon: "💧", color: "#6bc7ff" },
    { id: "staked", label: "Staked/Trellised", icon: "🪵", color: "#d7ebdc" },
    { id: "harvest", label: "Harvested", icon: "🎉", color: "#ffd86b" },
    { id: "custom", label: "Custom Note", icon: "📝", color: "#8effab" },
  ];

  const plantOptions = ["Garden", ...savedPlants];

  const addCareEntry = () => {
    if (!selectedAction) {
      Alert.alert("Select an action", "Please tap a care action before logging.");
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

    if (selectedAction === "fertilize" && selectedPlant !== "Garden" && onFertilizerLogged) {
      Alert.alert(
        "Fertilized! 🌾",
        `Want a reminder to fertilize ${selectedPlant} again?`,
        [
          { text: "No thanks", style: "cancel" },
          { text: "In 7 days", onPress: () => onFertilizerLogged(selectedPlant, 7) },
          { text: "In 14 days", onPress: () => onFertilizerLogged(selectedPlant, 14) },
          { text: "In 30 days", onPress: () => onFertilizerLogged(selectedPlant, 30) },
        ]
      );
    } else {
      Alert.alert("Care logged! 🌱", `${action.icon} ${action.label} logged for ${selectedPlant}.`);
    }
  };

  const deleteCareEntry = (id) => {
    const removed = careLog.find((e) => e.id === id);
    if (!removed) return;
    tapHaptic("light");
    setCareLog((current) => current.filter((e) => e.id !== id));
    if (onUndoToast) {
      onUndoToast("Care entry deleted", () => {
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
  const monthLabel = new Date(calendarYear, calendarMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const getEntriesForDate = (dateStr) => {
    return careLog.filter(e => e.date === dateStr && (filterPlant === "All" || e.plant === filterPlant));
  };

  const getDateKey = (day) => {
    const d = new Date(calendarYear, calendarMonth, day);
    return d.toISOString().slice(0, 10);
  };

  const hasEntries = (day) => getEntriesForDate(getDateKey(day)).length > 0;
  const getEntryColor = (day) => {
    const entries = getEntriesForDate(getDateKey(day));
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

return (
    <View>

      {/* HEADER */}
      <Text style={[styles.cardTitle, { color: theme.text }]}>Garden Care Tracker</Text>

      {/* STATS ROW */}
      <View style={styles.careLogStatsRow}>
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{totalEntries}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Total Logs</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{thisMonthEntries}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>This Month</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{plantsLogged}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Plants Tracked</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{mostCommonAction?.icon || "—"}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Top Action</Text>
        </View>
      </View>

      {/* MONTHLY SUMMARY */}
      {thisMonthEntries > 0 ? (
        <View style={{ marginBottom: 14, backgroundColor: "rgba(107,199,255,0.08)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(107,199,255,0.20)" }}>
          <Text style={{ color: "#6bc7ff", fontSize: 13, fontWeight: "900", lineHeight: 19 }}>
            📊 {thisMonthEntries} care action{thisMonthEntries === 1 ? "" : "s"} logged this month
            {mostCommonAction ? ` • most often ${mostCommonAction.icon} ${mostCommonAction.label}` : ""}
          </Text>
        </View>
      ) : null}

      {/* ADD ENTRY BUTTON */}
      <Pressable
        onPress={() => setShowAddPanel(!showAddPanel)}
        style={[styles.careLogAddButton, { backgroundColor: showAddPanel ? "rgba(107,199,255,0.18)" : "#6bc7ff" }]}
      >
        <Text style={[styles.careLogAddButtonText, { color: showAddPanel ? "#6bc7ff" : "#07120b" }]}>
          {showAddPanel ? "✕ Cancel" : "＋ Log Care Action"}
        </Text>
      </Pressable>

      {/* ADD PANEL */}
      {showAddPanel ? (
        <View style={styles.careLogAddPanel}>

          {/* PLANT SELECTOR */}
          <Text style={styles.careLogPanelLabel}>Which plant?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {plantOptions.map(plant => (
              <Pressable
                key={plant}
                onPress={() => setSelectedPlant(plant)}
                style={[styles.careLogPlantPill, {
                  backgroundColor: selectedPlant === plant ? "#6bc7ff" : "rgba(255,255,255,0.07)",
                  borderColor: selectedPlant === plant ? "#6bc7ff" : "rgba(255,255,255,0.10)",
                }]}
              >
                <Text style={[styles.careLogPlantPillText, { color: selectedPlant === plant ? "#07120b" : "#ffffff" }]}>
                  {plant === "Garden" ? "🌍 Whole Garden" : plant}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* ACTION GRID */}
          <Text style={[styles.careLogPanelLabel, { marginTop: 14 }]}>What did you do?</Text>
          <View style={styles.careLogActionGrid}>
            {CARE_ACTIONS.map(action => (
              <Pressable
                key={action.id}
                onPress={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
                style={[styles.careLogActionTile, {
                  backgroundColor: selectedAction === action.id ? action.color + "25" : "rgba(255,255,255,0.06)",
                  borderColor: selectedAction === action.id ? action.color : "rgba(255,255,255,0.08)",
                  borderWidth: selectedAction === action.id ? 2 : 1,
                }]}
              >
                <Text style={styles.careLogActionIcon}>{action.icon}</Text>
                <Text style={[styles.careLogActionLabel, { color: selectedAction === action.id ? action.color : "#d7ebdc" }]}>
                  {action.label}
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
          <Text style={[styles.careLogPanelLabel, { marginTop: 14 }]}>Add a note (optional)</Text>
          <TextInput
            value={customNote}
            onChangeText={setCustomNote}
            placeholder="e.g. Used organic neem oil, pH was 6.5, added 2 cups compost..."
            placeholderTextColor="#8fbf9d"
            multiline
            style={styles.careLogNoteInput}
          />

          {/* LOG BUTTON */}
          <Pressable onPress={addCareEntry} style={styles.careLogSubmitButton}>
            <Text style={styles.careLogSubmitButtonText}>✅ Log Care Entry</Text>
          </Pressable>
        </View>
      ) : null}

      {/* VIEW MODE TOGGLE */}
      {careLog.length > 0 ? (
        <>
          <View style={styles.careLogViewToggle}>
            {[{ id: "calendar", label: "📅 Calendar" }, { id: "timeline", label: "📋 Timeline" }].map(v => (
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
              <Text style={[styles.journalFilterPillText, todayOnly && styles.journalFilterPillTextActive]}>
                📅 Today
              </Text>
            </Pressable>
            {["All", "Garden", ...savedPlants].map(plant => (
              <Pressable
                key={plant}
                onPress={() => setFilterPlant(plant)}
                style={[styles.journalFilterPill, filterPlant === plant && styles.journalFilterPillActive]}
              >
                <Text style={[styles.journalFilterPillText, filterPlant === plant && styles.journalFilterPillTextActive]}>
                  {plant === "All" ? "🌿 All" : plant === "Garden" ? "🌍 Garden" : plant}
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
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                  <Text key={d} style={styles.careLogCalendarDayLabel}>{d}</Text>
                ))}
              </View>

              {/* GRID */}
              <View style={styles.careLogCalendarGrid}>
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.careLogCalendarCell} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dateKey = getDateKey(day);
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
                          ? "rgba(107,199,255,0.15)"
                          : hasLog
                          ? "rgba(92,255,137,0.10)"
                          : "transparent",
                        borderColor: isSelected ? "#6bc7ff" : isToday ? "rgba(107,199,255,0.40)" : "transparent",
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
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </Text>
                {selectedDateEntries.length === 0 ? (
                  <Text style={[styles.careLogEmptyDate, { color: theme.secondaryText }]}>
                    No care logged for this day. Tap ＋ to add an entry.
                  </Text>
                ) : (
                  <View style={{ gap: 8, marginTop: 10 }}>
                    {selectedDateEntries.map(entry => (
                      <View key={entry.id} style={[styles.careLogEntryRow, { borderColor: entry.actionColor + "40", backgroundColor: entry.actionColor + "0D" }]}>
                        <Text style={styles.careLogEntryIcon}>{entry.actionIcon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.careLogEntryLabel}>{entry.actionLabel}</Text>
                          {entry.plant !== "Garden" ? (
                            <Text style={[styles.careLogEntryPlant, { color: entry.actionColor }]}>🌱 {entry.plant}</Text>
                          ) : (
                            <Text style={[styles.careLogEntryPlant, { color: theme.secondaryText }]}>🌍 Whole Garden</Text>
                          )}
                          {entry.note ? (
                            <Text style={[styles.careLogEntryNote, { color: theme.secondaryText }]}>{entry.note}</Text>
                          ) : null}
                        </View>
                        <Pressable onPress={() => deleteCareEntry(entry.id)} style={styles.careLogDeleteBtn}>
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
                  No care entries yet. Tap ＋ to log your first action!
                </Text>
              ) : (
                filteredLog.map(entry => (
                  <View key={entry.id} style={[styles.careLogEntryRow, { borderColor: entry.actionColor + "40", backgroundColor: entry.actionColor + "0D" }]}>
                    <Text style={styles.careLogEntryIcon}>{entry.actionIcon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLogEntryLabel}>{entry.actionLabel}</Text>
                      <Text style={[styles.careLogEntryPlant, { color: entry.actionColor }]}>
                        {entry.plant === "Garden" ? "🌍 Whole Garden" : `🌱 ${entry.plant}`}
                      </Text>
                      {entry.note ? (
                        <Text style={[styles.careLogEntryNote, { color: theme.secondaryText }]}>{entry.note}</Text>
                      ) : null}
                      <Text style={[styles.careLogEntryDate, { color: theme.secondaryText }]}>
                        {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </Text>
                    </View>
                    <Pressable onPress={() => deleteCareEntry(entry.id)} style={styles.careLogDeleteBtn}>
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
          <Text style={styles.careLogEmptyTitle}>No care logged yet</Text>
          <Text style={[styles.careLogEmptyText, { color: theme.secondaryText }]}>
            Tap ＋ above to log your first care action. Track compost, repotting, pest treatment, pH tests, and more.
          </Text>
        </View>
      )}
    </View>
  );
}
