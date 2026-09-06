// ─────────────────────────────────────────────────────────────────────────────
// OS accessibility settings this UI should respect.
//
// Reduced motion already has a home in lib/motion.js — initReducedMotion() and
// duration() there collapse animations to zero when the user asks for it. What
// was missing is the other two:
//
//   Text size. React Native scales text with the OS setting by default, which
//   is correct. But this UI is dense — five tab labels across the bottom bar,
//   11pt metadata in card headers, numeric stat tiles. At the largest
//   accessibility sizes an unbounded multiplier turns those into clipped or
//   overlapping text: technically scaled, actually less readable. A ceiling
//   keeps big text big and still legible instead of letting layout shatter.
//
//   Touch targets. Icon-only controls here are drawn at 16–30pt. That reads
//   well and misses a lot, especially for anyone with a motor impairment.
//   hitSlop grows the tappable area without touching the visual size.
// ─────────────────────────────────────────────────────────────────────────────

// Text still grows substantially — these are ceilings, not a refusal to scale.
// Body copy is best left uncapped; apply these only where layout actually breaks.
export const MAX_FONT_SCALE = 1.6;
// Dense rows — tab labels, stat tiles, metadata — break earliest.
export const MAX_FONT_SCALE_COMPACT = 1.3;

// Apple's HIG and Android's Material both put the minimum comfortable target at
// 44pt / 48dp. 44 is the stricter of the two in practice.
export const MIN_TOUCH = 44;

// hitSlop that brings a control of `renderedSize` up to MIN_TOUCH. Returns zero
// padding for anything already large enough, so it is safe to apply blindly.
export const touchSlop = (renderedSize) => {
  const pad = Math.max(0, Math.round((MIN_TOUCH - renderedSize) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
};
