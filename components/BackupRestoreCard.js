import { memo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useTranslation } from "../lib/i18n";

export const BackupRestoreCard = memo(function BackupRestoreCard({ theme, onExport, onRestore }) {
  const { t } = useTranslation();
  const [showRestore, setShowRestore] = useState(false);
  const [pasted, setPasted] = useState("");

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("backupRestore.saveAFullCopyOf")}
      </Text>

      <Pressable
        onPress={onExport}
        accessibilityRole="button"
        style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.3)" }}
      >
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(92, 255, 137, 0.16)", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 20 }}>📦</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{t("backupRestore.exportFullBackup")}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{t("backupRestore.shareOrSaveTheBackup")}</Text>
        </View>
        <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>›</Text>
      </Pressable>

      <Pressable
        onPress={() => setShowRestore((v) => !v)}
        accessibilityRole="button"
        style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(107, 199, 255, 0.16)", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 20 }}>♻️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>{t("backupRestore.restoreFromBackup")}</Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{t("backupRestore.pasteABackupToBring")}</Text>
        </View>
        <Text style={{ color: "#6bc7ff", fontSize: 14, fontWeight: "900" }}>{showRestore ? "▾" : "▸"}</Text>
      </Pressable>

      {showRestore ? (
        <View style={{ marginTop: 10 }}>
          <TextInput
            value={pasted}
            onChangeText={setPasted}
            placeholder={t("backupRestore.pasteYourBackupTextHere")}
            placeholderTextColor="#8fbf9d"
            multiline
            style={{ minHeight: 90, maxHeight: 160, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.2)", color: theme.text, fontSize: 12, fontWeight: "600", paddingHorizontal: 14, paddingVertical: 12, textAlignVertical: "top" }}
          />
          <Pressable
            onPress={() => { onRestore(pasted); }}
            disabled={!pasted.trim()}
            accessibilityRole="button"
            style={{ marginTop: 10, borderRadius: 12, paddingVertical: 14, alignItems: "center", backgroundColor: pasted.trim() ? "#6bc7ff" : "rgba(255, 255, 255, 0.08)" }}
          >
            <Text style={{ color: pasted.trim() ? "#07120b" : "#8fbf9d", fontSize: 14, fontWeight: "900" }}>{t("backupRestore.restoreThisBackup")}</Text>
          </Pressable>
          <Text style={{ color: theme.secondaryText, fontSize: 10, fontWeight: "700", marginTop: 8, fontStyle: "italic" }}>
            {t("backupRestore.restoringReplacesYourCurrentData")}
          </Text>
        </View>
      ) : null}
    </View>
  );
})
