import { memo } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { supabase } from "../lib/supabase";
import { IconText } from "./IconText";
import { formatDate, useTranslation } from "../lib/i18n";

export const AccountCloudCard = memo(function AccountCloudCard({
  theme,
  user,
  lastSyncedAt,
  newEmail,
  setNewEmail,
  premiumUnlocked,
  savedPlants,
  journalEntries,
  gardenMap,
}) {
  const { t } = useTranslation();
  const gardenPlotCount =
    Object.values(gardenMap || {}).filter(Boolean).length;

  const memberSince = user?.created_at
    ? formatDate(new Date(user.created_at))
    : t("accountCloud.unknown");

  // Honest last-sync time from the real timestamp of the last successful cloud
  // save, not a hardcoded label. Computed at render (accurate when the card
  // opens); a settings card doesn't need it to tick live.
  const lastSync = (() => {
    if (!lastSyncedAt) return t("accountCloud.syncPending");
    const mins = Math.floor((Date.now() - lastSyncedAt) / 60000);
    if (mins < 1) return t("accountCloud.syncJustNow");
    if (mins < 60) return t("accountCloud.syncMinutesAgo", { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("accountCloud.syncHoursAgo", { count: hrs });
    return formatDate(new Date(lastSyncedAt), { month: "short", day: "numeric" });
  })();

  const changeEmail = async () => {
  const cleanEmail = newEmail.trim();

  if (!cleanEmail) {
    Alert.alert(t("accountCloud.enterNewEmailFirst"));
    return;
  }

  try {
    const { error } = await supabase.auth.updateUser({
      email: cleanEmail,
    });

    if (error) {
      console.log("EMAIL CHANGE ERROR:", error.message);
      Alert.alert(t("accountCloud.couldNotChangeEmail") + " " + error.message);
      return;
    }

    Alert.alert(t("accountCloud.checkNewEmailInbox"));
    setNewEmail("");
  } catch (err) {
    console.log("EMAIL CHANGE CRASH:", err);
    Alert.alert(t("accountCloud.somethingWentWrong"));
  }
};

const resetPassword = async () => {
  if (!user?.email) {
    Alert.alert(t("accountCloud.noEmailFound"));
    return;
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      user.email,
      {
        redirectTo: "pocketplanter://reset-password",
      }
    );

    if (error) {
      console.log("RESET ERROR:", error.message);
      Alert.alert(t("accountCloud.couldNotSendReset") + " " + error.message);
      return;
    }

    Alert.alert(t("accountCloud.resetEmailSent"));
  } catch (err) {
    console.log("RESET CRASH:", err);
    Alert.alert("Something went wrong. Try again.");
  }
};

const handleLogout = () => {
  Alert.alert(
    t("accountCloud.logOutTitle"),
    t("accountCloud.logOutConfirm"),
    [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("accountCloud.logOutTitle"),
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
        },
      },
    ]
  );
};

return (
    <View>

      {/* Reassurance: your garden is safely in the cloud. */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.28)", marginBottom: 16 }}>
        <Text style={{ fontSize: 24 }}>{lastSyncedAt ? "☁️" : "🔄"}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "900" }}>
            {lastSyncedAt ? "Your garden is backed up" : "Backing up your garden…"}
          </Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 16, marginTop: 2 }}>
            {lastSyncedAt
              ? `Synced ${lastSync} — saved to your account and restored when you sign in on any device.`
              : "Your progress saves automatically to your account."}
          </Text>
        </View>
        {lastSyncedAt ? <Text style={{ color: "#5cff89", fontSize: 18, fontWeight: "900" }}>✓</Text> : null}
      </View>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          {t("accountCloud.emailLabel")}
        </Text>

        <Text style={styles.accountInfoValue}>
          {user?.email || t("accountCloud.notSignedIn")}
        </Text>
      </View>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          {t("accountCloud.premiumStatus")}
        </Text>

        <Text style={styles.accountInfoValue}>
          {premiumUnlocked
            ? t("accountCloud.active")
            : t("accountCloud.inactive")}
        </Text>
      </View>

      <View style={styles.accountStatsGrid}>
        <View style={styles.accountStatTile}>
          <Text style={styles.accountStatValue}>
            {savedPlants.length}
          </Text>

          <Text style={styles.accountStatLabel}>
            {t("accountCloud.savedPlants")}
          </Text>
        </View>

        <View style={styles.accountStatTile}>
          <Text style={styles.accountStatValue}>
            {journalEntries.length}
          </Text>

          <Text style={styles.accountStatLabel}>
            {t("accountCloud.journalPhotos")}
          </Text>
        </View>

        <View style={styles.accountStatTile}>
          <Text style={styles.accountStatValue}>
            {gardenPlotCount}
          </Text>

          <Text style={styles.accountStatLabel}>
            {t("accountCloud.gardenPlots")}
          </Text>
        </View>

        <View style={styles.accountStatTile}>
          <Text
            style={[
              styles.accountStatValue,
              { fontSize: 14 },
            ]}
          >
            {memberSince}
          </Text>

          <Text style={styles.accountStatLabel}>
            {t("accountCloud.memberSince")}
          </Text>
        </View>
      </View>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          {t("accountCloud.changeEmail")}
        </Text>

        <TextInput
          value={newEmail}
          onChangeText={setNewEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder={t("accountCloud.newEmailAddress")}
          placeholderTextColor="#8fbf9d"
          style={styles.accountInput}
        />

        <Pressable
          onPress={changeEmail}
          style={styles.accountActionButton}
        >
          <Text style={styles.accountActionButtonText}>
            {t("accountCloud.sendEmailChangeConfirmation")}
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={resetPassword}
        style={styles.accountSecondaryButton}
      >
        <Text style={styles.accountSecondaryButtonText}>
          {t("accountCloud.sendPasswordResetEmail")}
        </Text>
      </Pressable>

      <Pressable
        onPress={handleLogout}
        style={styles.accountLogoutButton}
      >
        <IconText label={t("accountCloud.logOut")} style={styles.accountLogoutButtonText} />
      </Pressable>

      <Pressable
        onPress={async () => {
          Alert.alert(
            t("accountCloud.deleteAccountTitle"),
            t("accountCloud.deleteAccountBody"),
            [
              { text: t("common.cancel"), style: "cancel" },
              {
                text: t("accountCloud.deleteAccountConfirm"),
                style: "destructive",
                onPress: async () => {
                  try {
                    const { data: sessionData } = await supabase.auth.getSession();
                    const token = sessionData?.session?.access_token;
                    if (!token) {
                      Alert.alert(t("accountCloud.errorTitle"), t("accountCloud.sessionError"));
                      return;
                    }
                    const { error } = await supabase.functions.invoke("delete-account", {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (error) {
                      Alert.alert(t("accountCloud.deletionFailed"), t("accountCloud.deletionFailedBody"));
                      return;
                    }
                    await supabase.auth.signOut();
                    Alert.alert(t("accountCloud.accountDeleted"), t("accountCloud.accountDeletedBody"));
                  } catch (err) {
                    Alert.alert(t("accountCloud.contactSupport"), t("accountCloud.contactSupportBody"));
                  }
                },
              },
            ]
          );
        }}
        style={[styles.accountLogoutButton, { borderColor: "rgba(255, 50, 50, 0.5)", marginTop: 10 }]}
      >
        <IconText label={t("accountCloud.deleteAccount")} style={[styles.accountLogoutButtonText, {
  color: "#ff7b7b"
}]} />
      </Pressable>
    </View>
  );
})
