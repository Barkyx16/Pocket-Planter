import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { styles } from "../styles";

/**
 * The single empty state for the whole app.
 *
 * There were three competing implementations (`emptyStateCard`,
 * `journalEmptyState`, `gardenMapEmptyState`) plus a handful of places that just
 * printed a bare sentence with no icon, no heading and no way forward. A good
 * empty state is not decoration — it is the moment a user decides whether the
 * feature is broken or simply unused, so it needs to say what belongs here and
 * what to do about it.
 *
 *   <EmptyState
 *     icon="calendar"
 *     title="Nothing to sow in March"
 *     body="March isn't a prime window for Zone 9b. Try another month."
 *     actionLabel="Browse all plants"
 *     onAction={…}
 *   />
 *
 * `body` alone is valid for the quiet inline cases — it degrades to a centred
 * sentence in the same card, which is still consistent with everything else.
 */
export function EmptyState({ icon, title, body, actionLabel, onAction, compact, style }) {
  return (
    <View style={[styles.emptyStateCard, compact && { paddingVertical: 18 }, style]}>
      {icon ? (
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            marginBottom: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(92, 255, 137, 0.12)",
          }}
        >
          <Ionicons name={icon} size={26} color="#5cff89" />
        </View>
      ) : null}

      {title ? <Text style={styles.emptyStateTitle}>{title}</Text> : null}
      {body ? <Text style={styles.emptyStateText}>{body}</Text> : null}

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={{
            marginTop: 16,
            backgroundColor: "#5cff89",
            borderRadius: 12,
            paddingHorizontal: 18,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/**
 * The counterpart for async work. The app had exactly one ActivityIndicator in
 * it, so most waits showed nothing at all — indistinguishable from a hang.
 */
export function LoadingState({ label, compact, style }) {
  return (
    <View
      style={[
        styles.emptyStateCard,
        { flexDirection: "row", justifyContent: "center", gap: 10 },
        compact && { paddingVertical: 16 },
        style,
      ]}
    >
      <ActivityIndicator size="small" color="#5cff89" />
      {label ? <Text style={[styles.emptyStateText, { textAlign: "left" }]}>{label}</Text> : null}
    </View>
  );
}

export default EmptyState;
