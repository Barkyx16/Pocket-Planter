import { memo } from "react";
import { useState } from "react";
import { Alert, Linking, Platform, Pressable, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import Purchases from "react-native-purchases";
import { styles } from "../styles";
import { hasPremiumEntitlement } from "../core";

export const SettingsCard = memo(function SettingsCard({ theme, premiumUnlocked, setPremiumUnlocked, subscriptionPlan, setSubscriptionPlan, onUnlockPremium }) {
 const [selectedPlan, setSelectedPlan] = useState(subscriptionPlan || "Yearly");
  const [restoring, setRestoring] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

async function restorePurchases() {
    if (restoring) return;
    setRestoring(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (hasPremiumEntitlement(customerInfo)) {
        onUnlockPremium(selectedPlan);
        Alert.alert("Purchases Restored 👑", "Your premium subscription has been restored.");
      } else {
        Alert.alert("No Purchases Found", "We couldn't find an active subscription to restore for this account.");
      }
    } catch (err) {
      Alert.alert("Restore Failed", "Something went wrong restoring your purchases. Please try again.");
    } finally {
      setRestoring(false);
    }
  }

async function choosePlan(plan) {
    if (purchasing) return;
    setSelectedPlan(plan);
    setPurchasing(true);
    try {
      const offerings = await Purchases.getOfferings();
      const packages = offerings?.current?.availablePackages;
      if (!packages?.length) {
        Alert.alert("Store Unavailable", "In-app purchases are not available right now. Please try again later.");
        return;
      }
      const targetPackage = packages.find(pkg =>
        plan === "Monthly"
          ? pkg.product.identifier === "com.pocketplanter.monthly"
          : pkg.product.identifier === "com.pocketplanter.yearly"
      ) || packages[0];
      const { customerInfo } = await Purchases.purchasePackage(targetPackage);
      if (hasPremiumEntitlement(customerInfo)) {
        onUnlockPremium(plan);
      }
    } catch (err) {
      if (!err.userCancelled) {
        Alert.alert("Purchase Failed", "Something went wrong. Please try again.");
      }
    } finally {
      setPurchasing(false);
    }
  }

  const features = [
    { icon: "❄️", title: "Frost & Heat Alerts", text: "Get warned before dangerous temps hit your garden." },
    { icon: "💧", title: "Smart Watering Guidance", text: "Weather-aware daily watering recommendations." },
    { icon: "🌿", title: "Companion Intelligence", text: "Which plants thrive together — and which to keep apart." },
    { icon: "🗺️", title: "Garden Planner Map", text: "Plan all 12 plots with live compatibility scoring." },
    { icon: "📸", title: "Journal & Photo Timeline", text: "Document your garden's growth with dated photos." },
    { icon: "🐛", title: "Pest Watch & Guides", text: "Spot and stop pests before they spread." },
    { icon: "🏆", title: "XP, Levels & Achievements", text: "Earn rewards and badges for daily garden care." },
    { icon: "⚡", title: "Daily Quests & Streaks", text: "Complete challenges and keep your streak alive." },
    { icon: "🌱", title: "Unlimited Saved Plants", text: "Save as many plants as your garden needs." },
    { icon: "☁️", title: "Cloud Backup & Sync", text: "Your garden saved safely across all devices." },
  ];

  return (
    <View style={{ marginBottom: 18 }}>

      {/* HERO SECTION */}
      <View style={styles.premiumHeroSection}>
        <View style={styles.premiumHeroGlowOrbOne} />
        <View style={styles.premiumHeroGlowOrbTwo} />

        <View style={styles.premiumCrownWrap}>
          <Text style={styles.premiumCrownEmoji}>👑</Text>
        </View>

        <Text style={styles.premiumHeroEyebrow}>POCKET PLANTER PREMIUM</Text>
        <Text style={styles.premiumHeroHeadline}>Grow smarter.{"\n"}Garden better.</Text>
        <Text style={styles.premiumHeroSubtext}>
          Everything you need to plan, track, and grow a thriving garden — all in one place.
        </Text>

        <View style={styles.premiumHeroStatRow}>
          <View style={styles.premiumHeroStat}>
            <Text style={styles.premiumHeroStatValue}>200+</Text>
            <Text style={styles.premiumHeroStatLabel}>Plants</Text>
          </View>
          <View style={styles.premiumHeroStatDivider} />
          <View style={styles.premiumHeroStat}>
            <Text style={styles.premiumHeroStatValue}>12</Text>
            <Text style={styles.premiumHeroStatLabel}>Garden Plots</Text>
          </View>
          <View style={styles.premiumHeroStatDivider} />
          <View style={styles.premiumHeroStat}>
            <Text style={styles.premiumHeroStatValue}>Cancel</Text>
            <Text style={styles.premiumHeroStatLabel}>Anytime</Text>
          </View>
        </View>
      </View>

      {/* FEATURES GRID */}
      <View style={[styles.premiumFeaturesCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={styles.premiumFeaturesEyebrow}>EVERYTHING INCLUDED</Text>

        <View style={styles.premiumFeaturesGrid}>
          {features.map((f) => (
            <View key={f.title} style={styles.premiumFeatureTile}>
              <View style={styles.premiumFeatureTileIconWrap}>
                <Text style={styles.premiumFeatureTileIcon}>{f.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumFeatureTileTitle}>{f.title}</Text>
                <Text style={styles.premiumFeatureTileText}>{f.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* PLAN SELECTOR */}
      <View style={[styles.premiumPlanCard, { backgroundColor: theme.card, borderColor: "#5cff89" }]}>
        <Text style={styles.premiumPlanEyebrow}>CHOOSE YOUR PLAN</Text>
        <Text style={[styles.premiumPlanSubtext, { color: theme.secondaryText }]}>
          Choose monthly or yearly. Cancel anytime.
        </Text>

        <View style={styles.premiumPlanToggleRow}>
          {[
            {
              plan: "Monthly",
              badge: "POPULAR",
              badgeBg: "#5cff89",
              badgeColor: "#07120b",
              price: "$2.99",
              per: "/ month",
              savings: null,
            },
            {
              plan: "Yearly",
              badge: "BEST VALUE",
              badgeBg: "#ffd86b",
              badgeColor: "#3d2c00",
              price: "$24.99",
              per: "/ year",
              savings: "Save 30%",
            },
          ].map(({ plan, badge, badgeBg, badgeColor, price, per, savings }) => {
            const isSelected = selectedPlan === plan;
            return (
              <Pressable
                key={plan}
                onPress={() => choosePlan(plan)}
                style={[
                  styles.premiumPlanOption,
                  {
                    backgroundColor: isSelected
                      ? "rgba(92,255,137,0.14)"
                      : "rgba(255,255,255,0.05)",
                    borderColor: isSelected ? "#5cff89" : "rgba(255,255,255,0.10)",
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                {/* BADGE */}
                <View style={[styles.premiumPlanBadge, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.premiumPlanBadgeText, { color: badgeColor }]}>{badge}</Text>
                </View>

                {/* SELECTED CHECKMARK */}
                {isSelected ? (
                  <View style={styles.premiumPlanCheck}>
                    <Text style={styles.premiumPlanCheckText}>✓</Text>
                  </View>
                ) : null}

                <Text style={[styles.premiumPlanOptionName, { color: isSelected ? "#5cff89" : "#ffffff" }]}>
                  {plan}
                </Text>

                <Text style={[styles.premiumPlanOptionPrice, { color: "#ffffff" }]}>
                  {price}
                </Text>

                <Text style={[styles.premiumPlanOptionPer, { color: isSelected ? "#8effab" : "#d7ebdc" }]}>
                  {per}
                </Text>

                {savings ? (
                  <View style={styles.premiumPlanSavingsPill}>
                    <Text style={styles.premiumPlanSavingsText}>{savings}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

      {/* CTA BUTTON */}
        <Pressable
          disabled={purchasing}
          accessibilityRole="button"
          accessibilityLabel="Subscribe to Pocket Planter Premium"
          accessibilityState={{ disabled: purchasing }}
          style={[styles.premiumPlanCTA, purchasing && { opacity: 0.6 }]}
          onPress={() => choosePlan(selectedPlan)}
        >
          <Text style={styles.premiumPlanCTAText}>
           {purchasing ? "Opening…" : "Unlock Premium 🌱"}
          </Text>
        </Pressable>

        <Text style={styles.premiumPlanFooter}>
          Cancel anytime • Restores on new device
        </Text>

        {/* LEGAL LINKS */}
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 10, marginBottom: 4 }}>
          <Pressable onPress={() => Linking.openURL("https://pocketplanter.green/privacy")}>
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "700", textDecorationLine: "underline" }}>
              Privacy Policy
            </Text>
          </Pressable>
          <Text style={{ color: "#8effab", fontSize: 12 }}>•</Text>
          <Pressable onPress={() => Linking.openURL("https://pocketplanter.green/terms")}>
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "700", textDecorationLine: "underline" }}>
              Terms of Use
            </Text>
          </Pressable>
        </View>

       <Pressable disabled={restoring} accessibilityRole="button" accessibilityLabel="Restore previous purchases" onPress={restorePurchases} style={{ marginTop: 14, borderRadius: 16, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(92,255,137,0.22)", opacity: restoring ? 0.6 : 1 }}>
          <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>
            {restoring ? "Restoring…" : "↩️ Restore Purchases"}
          </Text>
        </Pressable>

        {premiumUnlocked ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Manage or cancel your subscription"
            onPress={() => Linking.openURL(Platform.OS === "android" ? "https://play.google.com/store/account/subscriptions" : "https://apps.apple.com/account/subscriptions")}
            style={{ marginTop: 10, borderRadius: 16, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" }}
          >
            <Text style={{ color: "#d7ebdc", fontSize: 14, fontWeight: "900" }}>⚙️ Manage or Cancel Subscription</Text>
          </Pressable>
        ) : null}
      </View>

      {/* TRUST BADGES */}
      <View style={[styles.premiumTrustRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {[
          { icon: "🔒", label: "Secure" },
          { icon: "↩️", label: "Cancel anytime" },
          { icon: "📱", label: "iOS" },
          { icon: "☁️", label: "Cloud sync" },
        ].map((t) => (
          <View key={t.label} style={styles.premiumTrustTile}>
            <Text style={styles.premiumTrustIcon}>{t.icon}</Text>
            <Text style={styles.premiumTrustLabel}>{t.label}</Text>
          </View>
        ))}
      </View>

      {/* DEV UNLOCK */}
     {__DEV__ ? (
  <View style={styles.premiumDevSection}>
    <View style={styles.premiumDevSectionHeader}>
      <Text style={styles.premiumDevSectionLabel}>🛠 DEVELOPER TOOLS</Text>
      <Text style={styles.premiumDevSectionSub}>Remove before App Store submission</Text>
    </View>

  <Pressable
      style={styles.premiumDevButton}
      onPress={async () => {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        console.log("=== SCHEDULED NOTIFICATIONS (" + scheduled.length + ") ===");
        scheduled.forEach((n) => {
          console.log(n.identifier, "|", JSON.stringify(n.trigger));
        });
        Alert.alert(
          "Scheduled Reminders",
          scheduled.length
            ? scheduled.map((n) => `• ${n.identifier}`).join("\n")
            : "Nothing scheduled. (In Expo Go, scheduling may be limited — confirm in a dev build.)"
        );
      }}
    >
      <Text style={styles.premiumDevButtonIcon}>🔔</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.premiumDevButtonText}>Dump Scheduled Reminders</Text>
        <Text style={styles.premiumDevButtonSub}>
          Logs every scheduled notification + trigger to console
        </Text>
      </View>
    </Pressable>

    <Pressable
      style={styles.premiumDevButton}
      onPress={async () => {
        const settings = await Notifications.getPermissionsAsync();
        let granted = settings.granted;
        if (!granted) granted = (await Notifications.requestPermissionsAsync()).granted;
        if (!granted) {
          Alert.alert("Notifications Off", "Enable notifications for Pocket Planter in your phone settings, then try again.");
          return;
        }
        await Notifications.scheduleNotificationAsync({
          content: { title: "🔔 Test Notification", body: "If you see this, notifications are firing correctly!", sound: true },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 },
        });
        Alert.alert("Test Scheduled ⏱️", "Background the app now — a test notification will fire in ~5 seconds.");
      }}
    >
      <Text style={styles.premiumDevButtonIcon}>⏱️</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.premiumDevButtonText}>Fire Test Notification (5s)</Text>
        <Text style={styles.premiumDevButtonSub}>
          Verifies the full pipeline — background the app to see it appear
        </Text>
      </View>
    </Pressable>

    <Pressable
      style={styles.premiumDevButton}
      onPress={async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        Alert.alert(
          "All Reminders Cleared",
          "Every scheduled notification was canceled. Re-toggle your reminders on the Garden tab to reschedule them cleanly."
        );
      }}
    >
      <Text style={styles.premiumDevButtonIcon}>🗑</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.premiumDevButtonText}>Clear All Scheduled</Text>
        <Text style={styles.premiumDevButtonSub}>
          One-time flush to remove orphaned legacy reminders
        </Text>
      </View>
    </Pressable>
    <Pressable
      style={[
        styles.premiumDevButton,
        premiumUnlocked && styles.premiumDevButtonActive,
      ]}
     onPress={() => {
        if (!__DEV__) return;
        setPremiumUnlocked(!premiumUnlocked);
        Alert.alert(
          premiumUnlocked ? "Premium Disabled" : "Premium Unlocked 👑",
          premiumUnlocked
            ? "App is now in free mode. All locks are active."
            : "Full app unlocked for testing. All premium features are now accessible."
        );
      }}
    >
      <Text style={styles.premiumDevButtonIcon}>
        {premiumUnlocked ? "🔓" : "🔒"}
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.premiumDevButtonText}>
          {premiumUnlocked ? "Premium ON — Tap to disable" : "Unlock Full App (Dev)"}
        </Text>
        <Text style={styles.premiumDevButtonSub}>
          Toggles all premium locks on and off
        </Text>
      </View>
      <View style={[
        styles.premiumDevTogglePill,
        { backgroundColor: premiumUnlocked ? "#5cff89" : "rgba(255,255,255,0.10)" }
      ]}>
        <Text style={[
          styles.premiumDevToggleText,
          { color: premiumUnlocked ? "#07120b" : "#d7ebdc" }
        ]}>
          {premiumUnlocked ? "ON" : "OFF"}
        </Text>
      </View>
    </Pressable>
  </View>
) : null}

    </View>
  );
})
