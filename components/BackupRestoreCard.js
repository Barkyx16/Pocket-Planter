import { memo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export const BackupRestoreCard = memo(function BackupRestoreCard({ theme, onExport, onRestore }) {
  const [showRestore, setShowRestore] = useState(false);
  const [pasted, setPasted] = useState("");

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        Save a full copy of your garden — plants, journal, beds, logs, and progress — then restore it on a new device or after reinstalling.
      </Text>

      <Pressable
        onPress={onExport}
        accessibilityRole="button"
        style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.28)" }}
      >
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(92,255,137,0.16)", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 22 }}>📦</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>Export full backup</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>Share or save the backup text somewhere safe.</Text>
        </View>
        <Text style={{ color: "#8effab", fontSize: 15, fontWeight: "900" }}>›</Text>
      </Pressable>

      <Pressable
        onPress={() => setShowRestore((v) => !v)}
        accessibilityRole="button"
        style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" }}
      >
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(107,199,255,0.14)", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 22 }}>♻️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900" }}>Restore from backup</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>Paste a backup to bring your garden back.</Text>
        </View>
        <Text style={{ color: "#6bc7ff", fontSize: 15, fontWeight: "900" }}>{showRestore ? "▾" : "▸"}</Text>
      </Pressable>

      {showRestore ? (
        <View style={{ marginTop: 10 }}>
          <TextInput
            value={pasted}
            onChangeText={setPasted}
            placeholder="Paste your backup text here…"
            placeholderTextColor="#8fbf9d"
            multiline
            style={{ minHeight: 90, maxHeight: 160, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.22)", color: theme.text, fontSize: 12.5, fontWeight: "600", paddingHorizontal: 14, paddingVertical: 12, textAlignVertical: "top" }}
          />
          <Pressable
            onPress={() => { onRestore(pasted); }}
            disabled={!pasted.trim()}
            accessibilityRole="button"
            style={{ marginTop: 10, borderRadius: 14, paddingVertical: 13, alignItems: "center", backgroundColor: pasted.trim() ? "#6bc7ff" : "rgba(255,255,255,0.08)" }}
          >
            <Text style={{ color: pasted.trim() ? "#07120b" : "#8fbf9d", fontSize: 14, fontWeight: "900" }}>Restore this backup</Text>
          </Pressable>
          <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700", marginTop: 8, fontStyle: "italic" }}>
            Restoring replaces your current data. Export a fresh backup first if you're unsure.
          </Text>
        </View>
      ) : null}
    </View>
  );
})
