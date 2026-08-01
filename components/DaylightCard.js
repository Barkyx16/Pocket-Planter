import { memo, useEffect } from "react";
import { Text, View } from "react-native";
import { getDaylightInfo } from "../core";
import { useTranslation } from "../lib/i18n";

export const DaylightCard = memo(function DaylightCard({ theme, zipCoords, onViewed }) {
  const { t } = useTranslation();
  const info = getDaylightInfo(zipCoords);

  // The card only renders (inside its collapsible) once it's actually shown, so
  // reaching here with real data means the user has seen today's daylight length.
  // Tell the parent so it can hide the card until tomorrow.
  const seen = !!info;
  useEffect(() => {
    if (seen && onViewed) onViewed();
  }, [seen, onViewed]);

  if (!info) return null;

  const accent = info.longDay ? "#ffd86b" : info.shortDay ? "#6bc7ff" : "#8effab";
  const note = info.longDay
    ? "Long days now — cool crops like lettuce, spinach, and cilantro may bolt. Harvest young and give afternoon shade."
    : info.shortDay
    ? "Short days slow most growth. Focus on cold-hardy greens and root crops, and don't expect fast results."
    : "Good daylight for steady growth across most vegetables.";

return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 24 }}>{info.gaining ? "🌅" : "🌇"}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: "900", marginTop: 2 }}>{info.label}</Text>
        </View>
        <View style={{ backgroundColor: `${accent}1a`, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: `${accent}33` }}>
          <Text style={{ color: accent, fontSize: 12, fontWeight: "900" }}>
            {info.gaining ? "▲" : "▼"} {info.deltaMin} {t("daylight.minday")}
          </Text>
        </View>
      </View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 20, marginTop: 12 }}>
        {info.gaining ? t("daylight.daysAreGettingLonger") : t("daylight.daysAreGettingShorter")} {t("daylight.byAbout")} {info.deltaMin} minute{info.deltaMin === 1 ? "" : "s"} {t("daylight.aDay")} {note}
      </Text>
    </View>
  );
})
