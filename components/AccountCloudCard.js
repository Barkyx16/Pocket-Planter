import { memo } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { supabase } from "../lib/supabase";

export const AccountCloudCard = memo(function AccountCloudCard({
  theme,
  user,
  newEmail,
  setNewEmail,
  premiumUnlocked,
  savedPlants,
  journalEntries,
  gardenMap,
}) {
  const gardenPlotCount =
    Object.values(gardenMap || {}).filter(Boolean).length;

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "Unknown";

  const lastSync = "Just now";

  const changeEmail = async () => {
  const cleanEmail = newEmail.trim();

  if (!cleanEmail) {
    Alert.alert("Enter a new email first.");
    return;
  }

  try {
    const { error } = await supabase.auth.updateUser({
      email: cleanEmail,
    });

    if (error) {
      console.log("EMAIL CHANGE ERROR:", error.message);
      Alert.alert("Could not change email: " + error.message);
      return;
    }

    Alert.alert("Check your new email inbox for a confirmation link!");
    setNewEmail("");
  } catch (err) {
    console.log("EMAIL CHANGE CRASH:", err);
    Alert.alert("Something went wrong. Try again.");
  }
};

const resetPassword = async () => {
  if (!user?.email) {
    Alert.alert("No email found for this account.");
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
      Alert.alert("Could not send reset email: " + error.message);
      return;
    }

    Alert.alert("Password reset email sent! Check your inbox.");
  } catch (err) {
    console.log("RESET CRASH:", err);
    Alert.alert("Something went wrong. Try again.");
  }
};

const handleLogout = () => {
  Alert.alert(
    "Log Out",
    "Are you sure you want to log out?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
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

      <Text
        style={[
          styles.cardText,
          { color: theme.secondaryText },
        ]}
      >
      </Text>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          Email
        </Text>

        <Text style={styles.accountInfoValue}>
          {user?.email || "Not signed in"}
        </Text>
      </View>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          Premium Status
        </Text>

        <Text style={styles.accountInfoValue}>
          {premiumUnlocked
            ? "Active ✅"
            : "Inactive"}
        </Text>
      </View>

      <View style={styles.accountStatsGrid}>
        <View style={styles.accountStatTile}>
          <Text style={styles.accountStatValue}>
            {savedPlants.length}
          </Text>

          <Text style={styles.accountStatLabel}>
            Saved Plants
          </Text>
        </View>

        <View style={styles.accountStatTile}>
          <Text style={styles.accountStatValue}>
            {journalEntries.length}
          </Text>

          <Text style={styles.accountStatLabel}>
            Journal Photos
          </Text>
        </View>

        <View style={styles.accountStatTile}>
          <Text style={styles.accountStatValue}>
            {gardenPlotCount}
          </Text>

          <Text style={styles.accountStatLabel}>
            Garden Plots
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
            Member Since
          </Text>
        </View>
      </View>

      <View style={styles.accountSyncBox}>
        <Text style={styles.accountInfoLabel}>
          Last Cloud Sync
        </Text>

        <Text style={styles.accountInfoValue}>
          {lastSync}
        </Text>
      </View>

      <View style={styles.accountInfoBox}>
        <Text style={styles.accountInfoLabel}>
          Change Email
        </Text>

        <TextInput
          value={newEmail}
          onChangeText={setNewEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="New email address"
          placeholderTextColor="#8fbf9d"
          style={styles.accountInput}
        />

        <Pressable
          onPress={changeEmail}
          style={styles.accountActionButton}
        >
          <Text style={styles.accountActionButtonText}>
            Send Email Change Confirmation
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={resetPassword}
        style={styles.accountSecondaryButton}
      >
        <Text style={styles.accountSecondaryButtonText}>
          Send Password Reset Email
        </Text>
      </Pressable>

      <Pressable
        onPress={handleLogout}
        style={styles.accountLogoutButton}
      >
        <Text style={styles.accountLogoutButtonText}>
          🚪 Log Out
        </Text>
      </Pressable>

      <Pressable
        onPress={async () => {
          Alert.alert(
            "Delete Account",
            "This will permanently delete your account and all garden data. This cannot be undone.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete My Account",
                style: "destructive",
                onPress: async () => {
                  try {
                    const { data: sessionData } = await supabase.auth.getSession();
                    const token = sessionData?.session?.access_token;
                    if (!token) {
                      Alert.alert("Error", "Could not verify your session. Please log out and back in, then try again.");
                      return;
                    }
                    const { error } = await supabase.functions.invoke("delete-account", {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (error) {
                      Alert.alert("Deletion Failed", "Something went wrong. Please email support@pocketplanter.green for help.");
                      return;
                    }
                    await supabase.auth.signOut();
                    Alert.alert("Account Deleted", "Your account and all data have been permanently removed.");
                  } catch (err) {
                    Alert.alert("Contact Support", "Please email support@pocketplanter.green to complete account deletion.");
                  }
                },
              },
            ]
          );
        }}
        style={[styles.accountLogoutButton, { borderColor: "rgba(255,50,50,0.5)", marginTop: 10 }]}
      >
        <Text style={[styles.accountLogoutButtonText, { color: "#ff4444" }]}>
          🗑 Delete Account
        </Text>
      </Pressable>
    </View>
  );
})
