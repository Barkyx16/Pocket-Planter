import { Text, View } from "react-native";
import { styles } from "../styles";
import { getActivePests } from "../core";
import { PestWatchCard } from "../components/PestWatchCard";
import { PremiumLockedCard } from "../components/PremiumLockedCard";
import { EmptyState } from "../components/EmptyState";
import { t } from "../lib/i18n";

// Pest Watch used to live on the Home tab; it's now its own destination behind
// the More menu so Home stays focused on the daily plan. The tab always exists;
// what it shows depends on premium status and whether any pests are active for
// the user's saved plants this month.
export function PestsTab({ theme, savedPlantObjs = [], zone, premiumUnlocked, onOpenPlant, onOpenPest, jumpToTab }) {
  const month = new Date().getMonth() + 1;
  const pests = getActivePests(savedPlantObjs, month, zone);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{t("home.pestWatch")}</Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 4, marginBottom: 14 }}>
        Early warnings for the pests most likely to hit your saved plants this month.
      </Text>

      {!premiumUnlocked ? (
        <PremiumLockedCard
          theme={theme}
          title="Pest watch locked"
          body="Unlock Premium to get early warnings for the pests most likely to hit your saved plants this month."
          onUnlock={() => jumpToTab && jumpToTab("premium")}
        />
      ) : pests.length ? (
        <PestWatchCard
          theme={theme}
          savedPlantObjs={savedPlantObjs}
          zone={zone}
          onOpenPlant={onOpenPlant}
          onOpenPest={onOpenPest}
        />
      ) : (
        <EmptyState
          icon="shield-checkmark"
          title="No pest threats right now"
          body={savedPlantObjs.length
            ? "None of your saved plants have common pests active this month. Check back as the season changes."
            : "Save a few plants and this tab will warn you about the pests most likely to target them."}
          actionLabel={savedPlantObjs.length ? undefined : "Browse plants"}
          onAction={savedPlantObjs.length ? undefined : () => jumpToTab && jumpToTab("plants")}
        />
      )}
    </View>
  );
}
