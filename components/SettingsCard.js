import { memo } from "react";
import { useState } from "react";
import { Alert, Linking, Platform, Pressable, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import Purchases from "react-native-purchases";
import { useTranslation } from "../lib/i18n";
import { styles } from "../styles";
import { hasPremiumEntitlement, PREMIUM_FEATURES } from "../core";
import { IconText } from "./IconText";

export const SettingsCard = memo(function SettingsCard({ theme, premiumUnlocked, setPremiumUnlocked, subscriptionPlan, setSubscriptionPlan, onUnlockPremium }) {
  const { t } = useTranslation();
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
        Alert.alert(t("purchases.restoredTitle"), t("purchases.restoredBody"));
      } else {
        Alert.alert(t("purchases.noneTitle"), t("purchases.noneBody"));
      }
    } catch (err) {
      Alert.alert(t("purchases.restoreFailed"), t("purchases.restoreFailedBody"));
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
        Alert.alert(t("purchases.storeUnavailable"), t("purchases.storeUnavailableBody"));
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
        Alert.alert(t("purchases.purchaseFailed"), t("purchases.purchaseFailedBody"));
      }
    } finally {
      setPurchasing(false);
    }
  }

  // Rendered from the shared PREMIUM_FEATURES manifest so this list always
  // reflects every gated feature and stays in sync with the onboarding finale.
  const features = PREMIUM_FEATURES.map((f) => ({
    icon: f.icon,
    title: t(f.titleKey),
    text: t(f.bodyKey),
  }));

  return (
    <View style={{ marginBottom: 18 }}>

      {/* HERO SECTION */}
      <View style={styles.premiumHeroSection}>
        <View style={styles.premiumHeroGlowOrbOne} />
        <View style={styles.premiumHeroGlowOrbTwo} />

        <View style={styles.premiumCrownWrap}>
          <Text style={styles.premiumCrownEmoji}>👑</Text>
        </View>

        <Text style={styles.premiumHeroEyebrow}>{t("premiumCard.eyebrow")}</Text>
        <Text style={styles.premiumHeroHeadline}>{t("premiumCard.headline")}</Text>
        <Text style={styles.premiumHeroSubtext}>
          {t("settings.everythingYouNeedToPlan")}
        </Text>

        <View style={styles.premiumHeroStatRow}>
          <View style={styles.premiumHeroStat}>
            <Text style={styles.premiumHeroStatValue}>600+</Text>
            <Text style={styles.premiumHeroStatLabel}>Plants</Text>
          </View>
          <View style={styles.premiumHeroStatDivider} />
          <View style={styles.premiumHeroStat}>
            <Text style={styles.premiumHeroStatValue}>12</Text>
            <Text style={styles.premiumHeroStatLabel}>{t("premiumCard.gardenPlots")}</Text>
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
        <Text style={styles.premiumFeaturesEyebrow}>{t("premiumCard.everythingIncluded")}</Text>

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
        <Text style={styles.premiumPlanEyebrow}>{t("premiumCard.choosePlan")}</Text>
        <Text style={[styles.premiumPlanSubtext, { color: theme.secondaryText }]}>
          {t("premiumCard.choosePlanBody")}
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
              badge: t("premiumCard.bestValue"),
              badgeBg: "#ffd86b",
              badgeColor: "#3d2c00",
              price: "$24.99",
              per: "/ year",
              savings: t("premiumCard.savings"),
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
                      ? "rgba(92, 255, 137, 0.16)"
                      : "rgba(255, 255, 255, 0.06)",
                    borderColor: isSelected ? "#5cff89" : "rgba(255, 255, 255, 0.1)",
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
          accessibilityLabel={t("settings.subscribeToPocketPlanterPremium")}
          accessibilityState={{ disabled: purchasing }}
          style={[styles.premiumPlanCTA, purchasing && { opacity: 0.6 }]}
          onPress={() => choosePlan(selectedPlan)}
        >
          <Text style={styles.premiumPlanCTAText}>
           {purchasing ? t("settings.opening") : t("settings.unlockPremium")}
          </Text>
        </Pressable>

        <Text style={styles.premiumPlanFooter}>
          {t("settings.cancelAnytimeRestoresOnNew")}
        </Text>

        {/* LEGAL LINKS */}
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 10, marginBottom: 4 }}>
          <Pressable onPress={() => Linking.openURL("https://pocketplanter.green/privacy")}>
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "700", textDecorationLine: "underline" }}>
              {t("settings.privacyPolicy")}
            </Text>
          </Pressable>
          <Text style={{ color: "#8effab", fontSize: 12 }}>•</Text>
          <Pressable onPress={() => Linking.openURL("https://pocketplanter.green/terms")}>
            <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "700", textDecorationLine: "underline" }}>
              {t("settings.termsOfUse")}
            </Text>
          </Pressable>
        </View>

       <Pressable disabled={restoring} accessibilityRole="button" accessibilityLabel={t("settings.restorePreviousPurchases")} onPress={restorePurchases} style={{ marginTop: 14, borderRadius: 16, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)", opacity: restoring ? 0.6 : 1 }}>
          <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>
            {restoring ? t("settings.restoring") : t("settings.restorePurchases")}
          </Text>
        </Pressable>

        {premiumUnlocked ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("settings.manageOrCancelYourSubscription")}
            onPress={() => Linking.openURL(Platform.OS === "android" ? "https://play.google.com/store/account/subscriptions" : "https://apps.apple.com/account/subscriptions")}
            style={{ marginTop: 10, borderRadius: 16, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.16)" }}
          >
            <IconText label={t("settings.manageOrCancelSubscription")} style={{
  color: "#d7ebdc",
  fontSize: 14,
  fontWeight: "900"
}} />
          </Pressable>
        ) : null}
      </View>

      {/* TRUST BADGES */}
      <View style={[styles.premiumTrustRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {[
          { icon: "🔒", label: "Secure" },
          { icon: "↩️", label: t("settings.cancelAnytime") },
          { icon: "📱", label: "iOS" },
          { icon: "☁️", label: t("settings.cloudSync") },
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
      <IconText label={t("settings.developerTools")} style={styles.premiumDevSectionLabel} />
      <Text style={styles.premiumDevSectionSub}>{t("settings.removeBeforeAppStoreSubmission")}</Text>
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
        <Text style={styles.premiumDevButtonText}>{t("settings.dumpScheduledReminders")}</Text>
        <Text style={styles.premiumDevButtonSub}>
          {t("settings.logsEveryScheduledNotificationTrigger")}
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
        <Text style={styles.premiumDevButtonText}>{t("settings.fireTestNotification5s")}</Text>
        <Text style={styles.premiumDevButtonSub}>
          {t("settings.verifiesTheFullPipelineBackground")}
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
        <Text style={styles.premiumDevButtonText}>{t("settings.clearAllScheduled")}</Text>
        <Text style={styles.premiumDevButtonSub}>
          {t("settings.onetimeFlushToRemoveOrphaned")}
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
          {premiumUnlocked ? t("settings.premiumOnTapToDisable") : t("settings.unlockFullAppDev")}
        </Text>
        <Text style={styles.premiumDevButtonSub}>
          {t("settings.togglesAllPremiumLocksOn")}
        </Text>
      </View>
      <View style={[
        styles.premiumDevTogglePill,
        { backgroundColor: premiumUnlocked ? "#5cff89" : "rgba(255, 255, 255, 0.1)" }
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
