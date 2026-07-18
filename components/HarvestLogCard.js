import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { formatRelativeDate, tapHaptic } from "../core";

export function HarvestLogCard({ theme, harvestLog, setHarvestLog, onUndoToast }) {
  const total = harvestLog.length;
  const plantsHarvested = new Set(harvestLog.map((h) => h.plantName)).size;
  const thisMonth = harvestLog.filter((h) => {
    const d = new Date(h.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const deleteEntry = (id) => {
    const removed = harvestLog.find((h) => h.id === id);
    if (!removed) return;
    tapHaptic("light");
    setHarvestLog((c) => c.filter((h) => h.id !== id));
    if (onUndoToast) {
      onUndoToast("Harvest deleted", () => {
        setHarvestLog((c) => [removed, ...c].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      });
    }
  };

return (
    <View>

      <View style={styles.careLogStatsRow}>
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{total}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Total Harvests</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{plantsHarvested}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>Plants</Text>
        </View>
        <View style={styles.careLogStatDivider} />
        <View style={styles.careLogStatTile}>
          <Text style={styles.careLogStatValue}>{thisMonth}</Text>
          <Text style={[styles.careLogStatLabel, { color: theme.secondaryText }]}>This Month</Text>
        </View>
      </View>

      {total === 0 ? (
        <View style={styles.careLogEmpty}>
          <Text style={styles.careLogEmptyIcon}>🚜</Text>
          <Text style={styles.careLogEmptyTitle}>No harvests logged yet</Text>
          <Text style={[styles.careLogEmptyText, { color: theme.secondaryText }]}>
            Open a plant and tap "Log a Harvest" when you pick something. It'll show up here.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 10, marginTop: 4 }}>
          {harvestLog.map((entry) => (
          <View key={entry.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "800" }}>{entry.plantName}</Text>
              <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "700", marginTop: 2 }}>{entry.amount} {entry.unit} · {formatRelativeDate(entry.createdAt)}</Text>
            </View>
            <Pressable onPress={() => deleteEntry(entry.id)} style={{ padding: 6 }}>
              <Text style={{ color: "#ff7b7b", fontSize: 15, fontWeight: "900" }}>✕</Text>
            </Pressable>
          </View>
        ))}
        </View>
      )}
    </View>
  );
}
