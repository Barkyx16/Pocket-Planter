// Emoji → icon translation.
//
// The app grew up using emoji as UI iconography (~81 sites). Emoji are a poor
// fit for chrome: they render differently on every OS version, cannot be tinted
// to match a state, sit on their own baseline so they never align to a grid,
// and read as consumer-casual rather than considered.
//
// Rather than rewrite every call site, components pass their existing title
// through `splitLeadingIcon()`. It pulls a leading emoji off the string and
// hands back the matching Ionicons name plus the cleaned text, so a title
// defined as "🌿 Companion Check" renders as a tinted leaf glyph followed by
// "Companion Check". Titles that come from the translation dictionary work the
// same way, in every language.
//
// Emoji that are genuinely *content* — a plant, an earned badge — should keep
// being emoji. This is only for chrome.

// Ionicons names, chosen to read at small sizes and to stay consistent across
// related concepts (every growth/plant idea uses `leaf`, every water idea uses
// `water`, and so on).
const EMOJI_TO_ICON = {
  "☀️": "sunny",
  "☀": "sunny",
  "🌤️": "partly-sunny",
  "🌤": "partly-sunny",
  "⛅": "partly-sunny",
  "🌧️": "rainy",
  "🌧": "rainy",
  "❄️": "snow",
  "❄": "snow",
  "🔥": "flame",
  "💧": "water",
  "⚡": "flash",
  "✨": "sparkles",
  "🌟": "star",
  "⭐": "star",
  "🌍": "earth",
  "🌎": "earth",
  "🌐": "globe-outline",
  "🌱": "leaf",
  "🌿": "leaf",
  "🌾": "leaf",
  "🪴": "leaf",
  "🌻": "flower",
  "🌸": "flower",
  "🍅": "nutrition",
  "🥕": "nutrition",
  "🍓": "nutrition",
  "🚜": "basket",
  "🛒": "cart",
  "💰": "cash",
  "🎯": "locate",
  "🏆": "trophy",
  "🐛": "bug",
  "🪲": "bug",
  "📅": "calendar",
  "🗓️": "calendar",
  "🗓": "calendar",
  "📆": "calendar",
  "📈": "trending-up",
  "📊": "stats-chart",
  "📸": "camera",
  "📷": "camera",
  "📓": "book",
  "📖": "book",
  "📝": "create",
  "📤": "share-outline",
  "💾": "download-outline",
  "☁️": "cloud-outline",
  "☁": "cloud-outline",
  "👑": "ribbon",
  "🧠": "bulb",
  "💡": "bulb",
  "🔔": "notifications",
  "🛠": "construct",
  "🛠️": "construct",
  "📏": "resize",
  "📳": "phone-portrait",
  "🧑‍🌾": "person",
  "👤": "person",
  "🗑️": "trash",
  "🗑": "trash",
  "🎉": "sparkles",
  "🌙": "moon",
  "🔍": "search",
  "🚪": "exit-outline",
  "🗂️": "folder-open",
  "🗂": "folder-open",
  "🗺️": "map",
  "🗺": "map",
  "🤝": "people",
  "♻️": "refresh",
  "♻": "refresh",
  "🔄": "sync",
  "🎁": "gift",
  "🔴": "ellipse",
  "🟢": "ellipse",
  "🟠": "ellipse",
  "🟡": "ellipse",
  "🌵": "sunny",
  "🧺": "basket",
  "📋": "clipboard",
  "📐": "grid",
  "🐝": "flower",
  "🛡️": "shield-checkmark",
  "🛡": "shield-checkmark",
  "🔒": "lock-closed",
  "🔓": "lock-open",
  "⏰": "alarm",
  "⏱️": "stopwatch",
  "⏱": "stopwatch",
  "⚠️": "warning",
  "⚠": "warning",
  "✅": "checkmark-circle",
  "❌": "close-circle",
  "📍": "location",
  "🧭": "compass",
  "🌡️": "thermometer",
  "🌡": "thermometer",
  "🏡": "home",
  "🏠": "home",
  "🔗": "link",
  "📦": "cube",
  "🧪": "flask",
  "🌊": "water",
  "🍽️": "restaurant",
  "🍽": "restaurant",
  "🥇": "medal",
  "🎪": "sparkles",
  "🧊": "snow",
  "⚙️": "settings",
  "⚙": "settings",
  "🚿": "water",
  "🧰": "construct",
  "🕐": "time",
  "⚔️": "git-compare",
  "⚔": "git-compare",
  "☑️": "checkbox",
  "☑": "checkbox",
  "💵": "cash",
  "📄": "document-text",
};

// Matches a leading emoji (including ZWJ sequences and variation selectors)
// followed by optional whitespace.
const LEADING_EMOJI = /^([\p{Extended_Pictographic}‍️]+)\s*/u;

/**
 * Splits "🌿 Companion Check" into { icon: "leaf", text: "Companion Check" }.
 *
 * Returns `icon: null` when the string has no leading emoji, or when the emoji
 * has no sensible icon equivalent — in that case the emoji is left in the text
 * untouched, so nothing is silently lost.
 */
export function splitLeadingIcon(title) {
  const source = String(title ?? "");
  const match = source.match(LEADING_EMOJI);
  if (!match) return { icon: null, text: source };

  const emoji = match[1].replace(/️/g, "");
  const icon = EMOJI_TO_ICON[match[1]] || EMOJI_TO_ICON[emoji] || null;
  if (!icon) return { icon: null, text: source };

  return { icon, text: source.slice(match[0].length) };
}

export default { splitLeadingIcon };
