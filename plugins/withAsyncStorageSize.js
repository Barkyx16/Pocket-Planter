const { withGradleProperties } = require("@expo/config-plugins");

// Android's AsyncStorage is one SQLite database with a hard size ceiling, and
// the library's default is 6 MB. Past it, every setItem rejects — and the app's
// writes are deliberately fire-and-forget, so a full store means the gardener
// keeps planting, watering and logging while nothing at all is saved, with no
// error anywhere they can see.
//
// It is not a hypothetical ceiling. A ten-year keeper with 150 plants carries
// roughly 3.3 MB before the self-persisting cards, the weather cache and the
// restore snapshots are counted, and `wateringHistory` alone is 2.3 MB of that
// and grows for as long as they keep gardening. Nothing in the app trims it,
// because a watering you logged in 2026 is exactly the history the streaks,
// rhythm and heatmap are built from.
//
// So raise the ceiling rather than start discarding the record. iOS has no
// equivalent limit, so this is Android-only by nature.
const SIZE_MB = 50;
const KEY = "AsyncStorage_db_size_in_MB";

module.exports = function withAsyncStorageSize(config) {
  return withGradleProperties(config, (cfg) => {
    // Replace rather than append: prebuild runs against an existing
    // gradle.properties, so both the property and its comment have to be
    // cleared first or every run stacks another copy.
    const COMMENT = `${KEY}: raised from the 6 MB default. A long-running garden log outgrows it, and a full store fails writes silently.`;
    cfg.modResults = cfg.modResults.filter(
      (item) =>
        !(item.type === "property" && item.key === KEY) &&
        !(item.type === "comment" && String(item.value).startsWith(KEY))
    );
    cfg.modResults.push({ type: "comment", value: COMMENT });
    cfg.modResults.push({ type: "property", key: KEY, value: String(SIZE_MB) });
    return cfg;
  });
};
