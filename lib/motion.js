// Motion system.
//
// The app had 17 animations, all of them 600–2500ms ambient loops (glows,
// floats). There were no short interaction durations at all, which is what makes
// a UI feel responsive rather than decorative — and tab switches were an instant
// swap with no transition.
//
// Two rules this module enforces:
//
//   1. Durations come from a scale. Interaction feedback is fast (150ms),
//      content transitions are calm (250ms), and anything ambient is its own
//      thing. Arbitrary durations are what make motion feel uncoordinated.
//
//   2. Reduced motion is respected. The app previously ignored the OS setting
//      entirely. Users enable it for vestibular disorders and motion sickness —
//      ignoring it is an accessibility failure, not a style choice. When it is
//      on, every duration here collapses to 0 so transitions become instant
//      cuts rather than being removed (state still changes, just without travel).

import { useEffect, useState } from "react";
import { AccessibilityInfo, Easing } from "react-native";

// ── Duration scale ───────────────────────────────────────────────────────────
export const DURATION = {
  instant: 0,
  fast: 150,     // press feedback, toggles — must feel immediate
  base: 250,     // content transitions, cross-fades
  slow: 400,     // entrances, sheets, anything travelling a distance
  ambient: 1800, // background glows and floats that loop forever
};

// Standard easing. `standard` for most things; `decelerate` for entering
// content, which should arrive quickly then settle.
export const EASING = {
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
  accelerate: Easing.bezier(0.4, 0.0, 1, 1),
};

// ── Reduced motion ───────────────────────────────────────────────────────────
// Mirrors the hemisphere/locale pattern used elsewhere: a module-level ref so
// non-React animation code can read it, plus a hook for components.
export const reduceMotionRef = { current: false };

/**
 * Starts listening for the OS reduced-motion setting. Call once at app start.
 * Returns an unsubscribe function.
 */
export function initReducedMotion() {
  let alive = true;
  try {
    AccessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
      if (alive) reduceMotionRef.current = !!enabled;
    }).catch(() => {});
  } catch (error) {
    // Older RN or an unsupported platform — leave motion enabled.
  }
  let sub;
  try {
    sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", (enabled) => {
      reduceMotionRef.current = !!enabled;
    });
  } catch (error) {}
  return () => {
    alive = false;
    try { sub?.remove?.(); } catch (e) {}
  };
}

export function isReducedMotion() {
  return reduceMotionRef.current === true;
}

/** Reactive version for components that need to re-render on the change. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(reduceMotionRef.current);
  useEffect(() => {
    let alive = true;
    try {
      AccessibilityInfo.isReduceMotionEnabled?.().then((v) => {
        if (alive) { reduceMotionRef.current = !!v; setReduced(!!v); }
      }).catch(() => {});
    } catch (error) {}
    let sub;
    try {
      sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", (v) => {
        reduceMotionRef.current = !!v;
        setReduced(!!v);
      });
    } catch (error) {}
    return () => { alive = false; try { sub?.remove?.(); } catch (e) {} };
  }, []);
  return reduced;
}

/**
 * The duration to actually use. Every animation in the app should pass through
 * this rather than reading DURATION directly, so reduced motion is honoured in
 * one place instead of at 17 call sites.
 */
export function duration(key = "base") {
  if (reduceMotionRef.current) return 0;
  return typeof key === "number" ? key : (DURATION[key] ?? DURATION.base);
}

/** Standard timing config. Spread into Animated.timing's second argument. */
export function timing(key = "base", overrides = {}) {
  return {
    duration: duration(key),
    easing: EASING.standard,
    useNativeDriver: true,
    ...overrides,
  };
}

export default { DURATION, EASING, duration, timing, isReducedMotion, useReducedMotion, initReducedMotion };
