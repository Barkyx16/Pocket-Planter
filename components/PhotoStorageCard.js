import { memo } from "react";
import { Pressable, Text, View } from "react-native";

const DAY = 24 * 60 * 60 * 1000;
// Rough estimate — the app doesn't read real file sizes, so we approximate.
const EST_MB_PER_PHOTO = 0.4;

export const PhotoStorageCard = memo(function PhotoStorageCard({ theme, journalEntries, onDeleteOlderThan }) {
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
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {total === 0
          ? "No garden photos yet. As you add journal photos, you'll be able to manage them here."
          : `You've saved ${total} garden photo${total === 1 ? "" : "s"} (roughly ${estMB} MB). Clear out old ones to free up space.`}
      </Text>

      {total > 0 ? (
        <>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
            {stats.map((s) => (
              <View key={s.label} style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, paddingVertical: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
                <Text style={{ color: s.color, fontSize: 18, fontWeight: "900" }}>{s.value}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "800", marginTop: 3, textAlign: "center" }}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "800", marginTop: 16, marginBottom: 8 }}>
            CLEAR OLD PHOTOS
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
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: disabled ? "rgba(255,255,255,0.03)" : "rgba(255,123,123,0.08)", borderWidth: 1, borderColor: disabled ? "rgba(255,255,255,0.08)" : "rgba(255,123,123,0.25)", opacity: disabled ? 0.55 : 1 }}
                >
                  <Text style={{ color: disabled ? theme.secondaryText : "#ffb3b3", fontSize: 13.5, fontWeight: "800" }}>🗑 {opt.label}</Text>
                  <Text style={{ color: disabled ? theme.secondaryText : "#ffb3b3", fontSize: 12.5, fontWeight: "900" }}>
                    {opt.count} photo{opt.count === 1 ? "" : "s"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 10, fontStyle: "italic" }}>
            Deleting removes those journal entries permanently. Export a backup first if you want to keep them.
          </Text>
        </>
      ) : null}
    </View>
  );
})
