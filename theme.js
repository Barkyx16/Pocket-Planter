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

// ── Semantic color roles ─────────────────────────────────────────────────────
// The same six accents, named by *meaning* rather than hue, so intent is
// consistent everywhere: water is always blue, harvest always yellow, danger
// always red. Reach for these in new code instead of the raw hues above.
export const semantic = {
  accent: color.green,     // primary action / brand
  success: color.green,    // positive / done / go
  info: color.blue,        // neutral information
  water: color.blue,       // anything watering-related
  warning: color.orange,   // heads-up / heat
  caution: color.yellow,   // mild caution
  harvest: color.yellow,   // harvest / yield
  danger: color.red,       // conflict / destructive
  soil: "#bf7a12",         // soil / compost / browns
  moon: "#d8c8ff",         // planting-by-moon / mystical
};

// Soft translucent tint of a role color, for card/section backgrounds & borders.
// e.g. roleBg(semantic.water) → a faint blue wash. `a` is a 2-digit hex alpha.
export const roleBg = (hex, a = "14") => `${hex}${a}`;
export const roleBorder = (hex, a = "33") => `${hex}${a}`;

// ── Elevation ────────────────────────────────────────────────────────────────
// Two consistent shadow levels for surfaces that float (modals, key cards).
// Spread into a style; on Android `elevation` carries it.
export const elevation = {
  card: { shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  modal: { shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 18 },
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };

// Radius scale. The app was using 40 distinct radii; these are the six that
// survive. Anything larger than `xl` is a circle or a decorative blob and should
// be written literally, not taken from this scale.
export const radius = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

// ── Type scale ───────────────────────────────────────────────────────────────
// Consistent sizes/weights. Pair with a color at the call site, e.g.
//   <Text style={[font.body, { color: theme.secondaryText }]}>…</Text>
//
// Sizes come from the 8-step scale (10 12 14 16 18 20 24 28). Sizes below 10
// are reserved for the dense tab bar and are not part of this scale.
//
// NOTE ON WEIGHTS: custom fonts ignore fontWeight, so App.js maps each numeric
// weight onto an Inter family (INTER_BY_WEIGHT). That map renders one step
// lighter than declared — "900" paints as Bold, "800" as SemiBold, "700" as
// Medium. Hierarchy here should come from size and colour; reach for a heavier
// declaration only when size alone genuinely cannot carry it.
export const font = {
  hero: { fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
  title: { fontSize: 18, fontWeight: "900" },
  heading: { fontSize: 16, fontWeight: "900" },
  body: { fontSize: 14, fontWeight: "700", lineHeight: 20 },
  label: { fontSize: 12, fontWeight: "800" },
  caption: { fontSize: 10, fontWeight: "700" },
  eyebrow: { fontSize: 12, fontWeight: "900", letterSpacing: 0.8, textTransform: "uppercase" },
  statValue: { fontSize: 24, fontWeight: "900" },
};

// Standard card spec — the canonical look for every content card.
export const cardBase = {
  borderRadius: radius.lg,
  padding: space.lg,
  borderWidth: 1,
};

// Reusable pressable feedback (spread into a Pressable style function result).
export const pressed = { opacity: 0.7, transform: [{ scale: 0.98 }] };

export default { color, semantic, roleBg, roleBorder, tint, space, radius, font, cardBase, pressed, elevation };
