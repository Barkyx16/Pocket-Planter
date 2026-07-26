import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles";
import { formatTemp, getUpcomingFrost } from "../core";
import { useTranslation } from "../lib/i18n";

export const FrostBanner = memo(function FrostBanner({ theme, weather, frostAlertsOn, unitSystem }) {
  const { t } = useTranslation();
  const frost = getUpcomingFrost(weather);
  if (!frost) return null;
  const whenText =
    frost.daysOut === 0 ? "tonight"
    : frost.daysOut === 1 ? "tomorrow night"
    : `in ${frost.daysOut} days`;
  return (
    <View style={[styles.frostBanner, { borderColor: "#6bc7ff" }]}>
      <Text style={styles.frostBannerIcon}>❄️</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.frostBannerTitle}>{t("frostBanner.frostExpected")} {whenText}</Text>
        <Text style={styles.frostBannerText}>
          {t("frostBanner.lowOf")} {formatTemp(frost.minTempF, unitSystem, true)} {t("frostBanner.comingCoverTenderPlantsMove")}
        </Text>
        {!frostAlertsOn ? (
          <Text style={styles.frostBannerHint}>
            {t("frostBanner.turnOnFrostAlertsIn")}
          </Text>
        ) : null}
      </View>
    </View>
  );
})
