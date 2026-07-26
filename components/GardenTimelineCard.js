import { memo, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { buildGardenTimeline, getTimelineMonthRecap, getTimelineOnThisDay, resolvePlantImageSource } from "../core";
import { useTranslation } from "../lib/i18n";

// One unified, auto-generated feed of the garden's life — plantings, sowings,
// photos, harvests, care, waterings, and badges — plus a monthly recap and an
// "On this day" memory. All derived from data the app already tracks.
function relTime(ts) {
  const now = Date.now();
  const days = Math.floor((new Date(now).setHours(0, 0, 0, 0) - new Date(ts).setHours(0, 0, 0, 0)) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const plantThumb = (name) => {
  if (!name) return null;
  const item = produceData.find((p) => p.name === name);
  return item ? resolvePlantImageSource(item) : null;
};

const EventRow = memo(function EventRow({ ev, theme, onOpenPlant, isLast }) {
  const img = ev.imageUri ? { uri: ev.imageUri } : plantThumb(ev.plantName);
  const tappable = !!ev.plantName;
  const Wrap = tappable ? Pressable : View;
  return (
    <Wrap onPress={tappable ? () => onOpenPlant && onOpenPlant(ev.plantName) : undefined} style={{ flexDirection: "row", gap: 12 }}>
      {/* timeline rail */}
      <View style={{ width: 34, alignItems: "center" }}>
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: `${ev.color}22`, borderWidth: 1, borderColor: `${ev.color}55`, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 16 }}>{ev.icon}</Text>
        </View>
        {!isLast ? <View style={{ flex: 1, width: 2, backgroundColor: "rgba(255, 255, 255, 0.08)", marginTop: 2 }} /> : null}
      </View>
      {/* content */}
      <View style={{ flex: 1, paddingBottom: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }} numberOfLines={1}>{ev.title}</Text>
          {ev.subtitle ? <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", marginTop: 2 }} numberOfLines={1}>{ev.subtitle}</Text> : null}
          <Text style={{ color: `${ev.color}`, fontSize: 10, fontWeight: "900", marginTop: 3 }}>{relTime(ev.ts)}</Text>
        </View>
        {img ? (
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#0e2414", overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
            <Image source={img} style={{ width: 44, height: 44 }} resizeMode={ev.imageUri ? "cover" : "contain"} />
          </View>
        ) : null}
      </View>
    </Wrap>
  );
});

export const GardenTimelineCard = memo(function GardenTimelineCard({ theme, journalEntries, harvestLog, wateringHistory, careLog, sowLog, plantSaveDates, badgeEarnedDates, achievementBadges, onOpenPlant }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(8);

  const events = useMemo(
    () => buildGardenTimeline({ journalEntries, harvestLog, wateringHistory, careLog, sowLog, plantSaveDates, badgeEarnedDates, achievementBadges }),
    [journalEntries, harvestLog, wateringHistory, careLog, sowLog, plantSaveDates, badgeEarnedDates, achievementBadges]
  );
  const recap = useMemo(() => getTimelineMonthRecap(events), [events]);
  const onThisDay = useMemo(() => getTimelineOnThisDay(events), [events]);

  if (!events.length) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 22, paddingHorizontal: 12 }}>
        <Text style={{ fontSize: 34, marginBottom: 8 }}>📖</Text>
        <Text style={{ color: theme.text, fontSize: 15, fontWeight: "900", textAlign: "center" }}>Your garden's story starts here</Text>
        <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 6, lineHeight: 19 }}>
          Add a photo, log a harvest, water a plant, or save something new — it all shows up here as a living timeline.
        </Text>
      </View>
    );
  }

  const recapChips = [
    { kind: "plant", icon: "🌱", label: "planted" },
    { kind: "sow", icon: "🌾", label: "sown" },
    { kind: "water", icon: "💧", label: "waterings" },
    { kind: "harvest", icon: "🎉", label: "harvests" },
    { kind: "photo", icon: "📸", label: "photos" },
    { kind: "care", icon: "🌿", label: "care logs" },
    { kind: "badge", icon: "🏆", label: "badges" },
  ].filter((c) => recap[c.kind]);

  const monthName = new Date().toLocaleDateString(undefined, { month: "long" });

  return (
    <View>
      {/* Monthly recap */}
      {recapChips.length ? (
        <View style={{ backgroundColor: "rgba(92, 255, 137, 0.06)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.18)", padding: 14, marginBottom: 16 }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 10 }}>📅 YOUR {monthName.toUpperCase()}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {recapChips.map((c) => (
              <View key={c.kind} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ fontSize: 13 }}>{c.icon}</Text>
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: "900" }}>{recap[c.kind]}</Text>
                <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600" }}>{c.label}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* On this day */}
      {onThisDay.length ? (
        <View style={{ backgroundColor: "rgba(255, 216, 107, 0.08)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255, 216, 107, 0.24)", padding: 14, marginBottom: 16 }}>
          <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>⏳ ON THIS DAY</Text>
          {onThisDay.slice(0, 3).map((ev, i) => (
            <Text key={`otd-${i}`} style={{ color: theme.text, fontSize: 13, fontWeight: "700", marginTop: i ? 4 : 0 }}>
              {ev.icon} {ev.title} <Text style={{ color: theme.secondaryText, fontWeight: "600" }}>· {relTime(ev.ts)}</Text>
            </Text>
          ))}
        </View>
      ) : null}

      {/* Feed */}
      {events.slice(0, visible).map((ev, i) => (
        <EventRow key={`${ev.kind}-${ev.ts}-${i}`} ev={ev} theme={theme} onOpenPlant={onOpenPlant} isLast={i === Math.min(visible, events.length) - 1} />
      ))}

      {events.length > visible ? (
        <Pressable
          onPress={() => setVisible((c) => c + 12)}
          style={{ marginTop: 4, backgroundColor: "rgba(107, 199, 255, 0.1)", borderRadius: 16, paddingVertical: 13, alignItems: "center", borderWidth: 1, borderColor: "rgba(107, 199, 255, 0.24)" }}
        >
          <Text style={{ color: "#6bc7ff", fontWeight: "900", fontSize: 14 }}>Show more history ({events.length - visible})</Text>
        </Pressable>
      ) : null}
    </View>
  );
});
