import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { formatDate, useTranslation } from "../lib/i18n";

// A dependency-free month-grid date picker. The app has no native date-picker
// module (adding one needs a dev-client rebuild), so this is pure JS/RN and can
// ship in an OTA update. Modeled on the calendar grid already used in
// SoilCareLogCard so it looks native to the app.

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * @param visible        show/hide
 * @param initialDate    Date the grid opens on (defaults to today)
 * @param title          heading text
 * @param confirmLabel   confirm button text
 * @param onConfirm(date) called with the chosen Date
 * @param onClose()      dismissed without choosing
 * @param theme          app theme object
 */
export function DatePickerModal({ visible, initialDate, title, confirmLabel, onConfirm, onClose, theme }) {
  const { t } = useTranslation();
  const base = initialDate instanceof Date && !Number.isNaN(initialDate.getTime()) ? initialDate : new Date();
  const [viewYear, setViewYear] = useState(base.getFullYear());
  const [viewMonth, setViewMonth] = useState(base.getMonth());
  const [selected, setSelected] = useState(startOfDay(base));

  const today = startOfDay(new Date());
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const monthLabel = formatDate(new Date(viewYear, viewMonth, 1), { month: "long", year: "numeric" });

  const shiftMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  };

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "flex-end" }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ backgroundColor: theme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 18, paddingBottom: 34, paddingHorizontal: 20 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", flex: 1 }}>{title}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.close")} onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={theme.secondaryText} />
            </Pressable>
          </View>

          {/* Month navigation */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("a11y.previousMonth")}
              onPress={() => shiftMonth(-1)}
              hitSlop={10}
              style={{ width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <Ionicons name="chevron-back" size={18} color={theme.text} />
            </Pressable>
            <Text style={{ flex: 1, textAlign: "center", color: theme.text, fontSize: 15, fontWeight: "800" }}>{monthLabel}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("a11y.nextMonth")}
              onPress={() => shiftMonth(1)}
              hitSlop={10}
              style={{ width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <Ionicons name="chevron-forward" size={18} color={theme.text} />
            </Pressable>
          </View>

          {/* Day-of-week labels */}
          <View style={{ flexDirection: "row" }}>
            {DAY_LABELS.map((d, i) => (
              <Text key={i} style={{ flex: 1, textAlign: "center", color: theme.secondaryText, fontSize: 11, fontWeight: "800", marginBottom: 4 }}>{d}</Text>
            ))}
          </View>

          {/* Grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <View key={`pad-${i}`} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const cellDate = startOfDay(new Date(viewYear, viewMonth, day));
              const isSelected = sameDay(cellDate, selected);
              const isToday = sameDay(cellDate, today);
              const isPast = cellDate < today;
              return (
                <Pressable
                  key={day}
                  onPress={() => setSelected(cellDate)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={formatDate(cellDate, { weekday: "long", month: "long", day: "numeric" })}
                  style={{ width: `${100 / 7}%`, aspectRatio: 1, alignItems: "center", justifyContent: "center", padding: 2 }}
                >
                  <View
                    style={{
                      width: 36, height: 36, borderRadius: 999, alignItems: "center", justifyContent: "center",
                      backgroundColor: isSelected ? "#5cff89" : "transparent",
                      borderWidth: isToday && !isSelected ? 1 : 0,
                      borderColor: "rgba(92,255,137,0.5)",
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? "#07120b" : isPast ? theme.secondaryText : theme.text,
                        fontSize: 14, fontWeight: isSelected ? "900" : "600",
                        opacity: isPast ? 0.5 : 1,
                      }}
                    >
                      {day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", textAlign: "center", marginTop: 12 }}>
            {formatDate(selected, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </Text>

          <Pressable
            onPress={() => onConfirm(selected)}
            accessibilityRole="button"
            style={{ marginTop: 16, backgroundColor: "#5cff89", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
          >
            <Text style={{ color: "#07120b", fontSize: 15, fontWeight: "900" }}>{confirmLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default DatePickerModal;
