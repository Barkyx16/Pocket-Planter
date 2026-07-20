// ── Design tokens ────────────────────────────────────────────────────────────
// One source of truth for color, spacing, radius, and typography. Components can
// adopt these gradually so the whole app converges on a single design system.

export const color = {
  // Brand accents (semantic)
  green: "#5cff89",      // primary / positive / go
  greenSoft: "#8effab",  // secondary green / labels
  blue: "#6bc7ff",       // water / info
  yellow: "#ffd86b",     // caution / harvest
  orange: "#ff9f43",     // heat / warning
  red: "#ff7b7b",        // danger / conflict
  redSoft: "#ff9f9f",
  ink: "#07120b",        // text on bright buttons

  // Surfaces & lines (on the dark theme; theme.text/secondaryText handle text)
  surface: "rgba(255,255,255,0.05)",
  surfaceStrong: "rgba(255,255,255,0.07)",
  surfaceBorder: "rgba(255,255,255,0.08)",
  hairline: "rgba(255,255,255,0.10)",
};

// Tinting helper: append an alpha (hex "00".."ff") to a 6-digit hex color.
export const tint = (hex, alpha) => `${hex}${alpha}`;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };

export const radius = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 };

// ── Type scale ───────────────────────────────────────────────────────────────
// Consistent sizes/weights. Pair with a color at the call site, e.g.
//   <Text style={[font.body, { color: theme.secondaryText }]}>…</Text>
export const font = {
  hero: { fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
  title: { fontSize: 18, fontWeight: "900" },
  heading: { fontSize: 15, fontWeight: "900" },
  body: { fontSize: 13, fontWeight: "700", lineHeight: 19 },
  label: { fontSize: 11, fontWeight: "800" },
  caption: { fontSize: 10, fontWeight: "700" },
  eyebrow: { fontSize: 12, fontWeight: "900", letterSpacing: 0.8, textTransform: "uppercase" },
  statValue: { fontSize: 22, fontWeight: "900" },
};

// Standard card spec — the canonical look for every content card.
export const cardBase = {
  borderRadius: radius.lg,
  padding: space.lg,
  borderWidth: 1,
};

// Reusable pressable feedback (spread into a Pressable style function result).
export const pressed = { opacity: 0.7, transform: [{ scale: 0.98 }] };

export default { color, tint, space, radius, font, cardBase, pressed };
