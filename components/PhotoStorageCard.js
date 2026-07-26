import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "../lib/i18n";

const DAY = 24 * 60 * 60 * 1000;
// Rough estimate — the app doesn't read real file sizes, so we approximate.
const EST_MB_PER_PHOTO = 0.4;

export const PhotoStorageCard = memo(function PhotoStorageCard({ theme, journalEntries, onDeleteOlderThan }) {
  const { t } = useTranslation();
  const entries = journalEntries || [];
  const total = entries.length;
  const now = Date.now();
  const ageDays = (e) => (now - new Date(e.createdAt).getTime()) / DAY;

  const thisMonth = entries.filter((e) => ageDays(e) <= 30).length;
  const older6mo = entries.filter((e) => ageDays(e) > 182).length;
  const older1yr = entries.filter((e) => ageDays(e) > 365).length;
  const estMB = (total * EST_MB_PER_PHOTO).toFixed(1);

  const stats = [
    { value: String(total), label: "Photos", color: "#8effab" },
    { value: `~${estMB}`, label: "MB (est.)", color: "#6bc7ff" },
    { value: String(thisMonth), label: "This month", color: "#ffd86b" },
  ];

  const cleanupOptions = [
    { days: 365, count: older1yr, label: "Older than 1 year" },
    { days: 182, count: older6mo, label: "Older than 6 months" },
  ];

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {total === 0
          ? t("photoStorage.noGardenPhotosYetAs")
          : `You've saved ${total} garden photo${total === 1 ? "" : "s"} (roughly ${estMB} MB). Clear out old ones to free up space.`}
      </Text>

      {total > 0 ? (
        <>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
            {stats.map((s) => (
              <View key={s.label} style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <Text style={{ color: s.color, fontSize: 18, fontWeight: "900" }}>{s.value}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 4, textAlign: "center" }}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 16, marginBottom: 8 }}>
            {t("photoStorage.clearOldPhotos")}
          </Text>
          <View style={{ gap: 8 }}>
            {cleanupOptions.map((opt) => {
              const disabled = opt.count === 0;
              return (
                <Pressable
                  key={opt.days}
                  disabled={disabled}
                  onPress={() => onDeleteOlderThan(opt.days)}
                  accessibilityRole="button"
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: disabled ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 123, 123, 0.08)", borderWidth: 1, borderColor: disabled ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 123, 123, 0.24)", opacity: disabled ? 0.55 : 1 }}
                >
                  <Text style={{ color: disabled ? theme.secondaryText : "#ff9f9f", fontSize: 14, fontWeight: "800" }}>🗑 {opt.label}</Text>
                  <Text style={{ color: disabled ? theme.secondaryText : "#ff9f9f", fontSize: 12, fontWeight: "900" }}>
                    {opt.count} photo{opt.count === 1 ? "" : "s"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 10, fontStyle: "italic" }}>
            {t("photoStorage.deletingRemovesThoseJournalEntries")}
          </Text>
        </>
      ) : null}
    </View>
  );
})
