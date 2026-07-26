// Lightweight internationalisation for Pocket Planter.
//
// Scope note: this covers UI chrome — navigation, buttons, settings, errors and
// the location/zone flow. Plant descriptions and growing advice remain English
// for now; the dictionaries are namespaced so that content can be added later
// without touching any call site.
//
// Two access paths, mirroring how `hemisphereRef` works in core.js:
//   - `t(key, params)` reads a module-level ref, so pure helpers outside React
//     can translate without threading a locale through every signature.
//   - `setLocale()` is driven by React state in App.js, so changing language
//     re-renders the tree.
//
// Keys are dot-paths ("zone.findTitle"). A missing key falls back to English and
// then to the key itself, so a partial translation degrades to English rather
// than rendering blank.

import { createContext, createElement, useCallback, useContext, useMemo } from "react";
import * as Localization from "expo-localization";

import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import de from "./locales/de";
import pt from "./locales/pt";
import zh from "./locales/zh";
import hi from "./locales/hi";
import ja from "./locales/ja";
import it from "./locales/it";
import ko from "./locales/ko";

const DICTIONARIES = { en, es, fr, de, pt, zh, hi, ja, it, ko };

export const DEFAULT_LOCALE = "en";

// `nativeName` is what the picker shows — people look for "Deutsch", not "German".
// `intlLocale` is the BCP-47 tag handed to Intl / toLocaleDateString. It is
// deliberately more specific than our short UI code: "pt" ships as Brazilian
// Portuguese, and Chinese needs the script subtag.
export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", intlLocale: "en-GB" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", intlLocale: "es-ES" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", intlLocale: "fr-FR" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", intlLocale: "de-DE" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", intlLocale: "pt-BR" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳", intlLocale: "zh-Hans-CN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", intlLocale: "hi-IN" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", intlLocale: "ja-JP" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", intlLocale: "it-IT" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", intlLocale: "ko-KR" },
];

export const localeRef = { current: DEFAULT_LOCALE };

export function isSupportedLocale(code) {
  return LANGUAGES.some((l) => l.code === code);
}

export function setLocale(code) {
  localeRef.current = isSupportedLocale(code) ? code : DEFAULT_LOCALE;
}

export function getLocale() {
  return localeRef.current;
}

export function getLanguage(code = localeRef.current) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

/**
 * Best-effort device language, e.g. "pt-BR" -> "pt". Returns the default when
 * the device language is one we do not ship yet.
 */
export function detectDeviceLocale() {
  try {
    const tags = Localization.getLocales?.() || [];
    for (const entry of tags) {
      const base = String(entry?.languageCode || entry?.languageTag || "")
        .split("-")[0]
        .toLowerCase();
      if (isSupportedLocale(base)) return base;
    }
  } catch (error) {
    // Localization can throw on some platforms; English is a safe answer.
  }
  return DEFAULT_LOCALE;
}

function lookup(dictionary, key) {
  if (!dictionary) return undefined;
  return key.split(".").reduce((node, part) => (node == null ? undefined : node[part]), dictionary);
}

/**
 * Translates `key`, interpolating `{placeholders}` from `params`.
 *
 * t("zone.zoneN", { zone: "9a" })  ->  "Zone 9a"
 *
 * Falls back to English, then to the key itself, so a missing translation is
 * always visible-but-usable rather than an empty string.
 */
export function t(key, params) {
  const active = DICTIONARIES[localeRef.current];
  let value = lookup(active, key);
  if (typeof value !== "string") value = lookup(DICTIONARIES[DEFAULT_LOCALE], key);
  if (typeof value !== "string") return key;
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match
  );
}

/**
 * Plural-aware translation. The dictionary entry is an object of CLDR plural
 * categories rather than a string:
 *
 *   photosThisWeek: { one: "{count} photo this week", other: "{count} photos this week" }
 *   tn("journal.photosThisWeek", 3)  ->  "3 photos this week"
 *
 * `count` is interpolated automatically. Category selection uses
 * Intl.PluralRules where available so adding a language with more than two
 * forms (Russian, Polish, Arabic) needs no code change — Hermes ships a partial
 * Intl, so there is a plain one/other fallback, which is correct for all seven
 * languages currently shipped.
 */
export function tn(key, count, params) {
  const active = DICTIONARIES[localeRef.current];
  let forms = lookup(active, key);
  if (!forms || typeof forms !== "object") forms = lookup(DICTIONARIES[DEFAULT_LOCALE], key);
  if (!forms || typeof forms !== "object") return key;

  let category = count === 1 ? "one" : "other";
  try {
    category = new Intl.PluralRules(localeRef.current).select(count);
  } catch (error) {
    // Keep the simple fallback.
  }
  const template = forms[category] ?? forms.other ?? forms.one;
  if (typeof template !== "string") return key;
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    if (name === "count") return String(count);
    return params && Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match;
  });
}

// ── Dates and numbers ────────────────────────────────────────────────────────
// The app formatted every date with a hardcoded "en-US", so 6/1/2026 rendered as
// June 1st. Most of the 242 supported countries write the day first, and would
// read that as 6 January — a silent, confident misstatement of the user's own
// data. These helpers format in the active UI language instead.
//
// Hermes ships a partial Intl, so every call is wrapped: on failure we fall back
// to the device default, and then to a plain ISO-ish string. A date is never
// allowed to render as "Invalid Date".

/** Formats a Date (or anything Date-parseable) in the active language. */
export function formatDate(value, options) {
  // Guard the falsy inputs explicitly: `new Date(null)` is epoch zero, a
  // perfectly valid Date, so a missing value would otherwise render as
  // "31/12/1969" rather than nothing.
  if (value === null || value === undefined || value === "") return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tag = getLanguage().intlLocale;
  try {
    return date.toLocaleDateString(tag, options);
  } catch (error) {
    try {
      return date.toLocaleDateString(undefined, options);
    } catch (innerError) {
      return date.toISOString().slice(0, 10);
    }
  }
}

/** Formats a number in the active language (digit grouping, decimal mark). */
export function formatNumber(value, options) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "";
  try {
    return new Intl.NumberFormat(getLanguage().intlLocale, options).format(n);
  } catch (error) {
    return String(n);
  }
}

/**
 * Localised country name for an ISO 3166-1 alpha-2 code.
 *
 * Uses Intl.DisplayNames, which is backed by the platform's CLDR data — 242
 * countries in every language, maintained by the OS rather than by us. Hand
 * translating that table would have been 1,452 strings and immediately stale.
 *
 * Hermes ships a partial Intl, so this falls back to the English name carried in
 * the COUNTRIES table. The caller passes that in to avoid an import cycle
 * (zoneResolver already imports this module).
 */
let regionNamesCache = { locale: null, formatter: null };

export function countryName(code, englishFallback) {
  const tag = getLanguage().intlLocale;
  try {
    if (regionNamesCache.locale !== tag) {
      regionNamesCache = { locale: tag, formatter: new Intl.DisplayNames([tag], { type: "region" }) };
    }
    const name = regionNamesCache.formatter?.of(code);
    // `of()` echoes the code back when it has no entry for it.
    if (name && name !== code) return name;
  } catch (error) {
    // No Intl.DisplayNames on this runtime — fall through.
  }
  return englishFallback || code;
}

// ── Stored-value labels ──────────────────────────────────────────────────────
// Some English strings are *data*, not copy: journal entries persist their
// growth stage and mood as strings, and those values are compared, filtered and
// synced to Supabase. Translating them at the point of storage would break
// filtering on existing entries and leave a user who switches language with a
// mix of two languages in their own data.
//
// So the stored value stays canonical English forever, and only the rendered
// label is translated. Anything unrecognised falls through unchanged, which
// keeps entries written by older app versions readable.

const GROWTH_STAGE_KEYS = {
  Seedling: "journal.stageSeedling",
  "Leaf Growth": "journal.stageLeaf",
  Flowering: "journal.stageFlowering",
  "Fruit Forming": "journal.stageFruit",
  "Harvest Ready": "journal.stageHarvest",
};

/** Canonical growth-stage values, in order. Never translate these for storage. */
export const GROWTH_STAGES = Object.keys(GROWTH_STAGE_KEYS);

/** Translates a stored growth stage for display only. */
export function growthStageLabel(stage) {
  const key = GROWTH_STAGE_KEYS[stage];
  return key ? t(key) : String(stage || "");
}

const MOOD_KEYS = {
  "🌱 Hopeful": "journal.moodHopeful",
  "😍 Thriving": "journal.moodThriving",
  "🍅 Harvest Day": "journal.moodHarvestDay",
  "❄️ Winter Growing": "journal.moodWinterGrowing",
};

export const MOODS = Object.keys(MOOD_KEYS);

/** Translates a stored mood for display only. */
export function moodLabel(mood) {
  const key = MOOD_KEYS[mood];
  return key ? t(key) : String(mood || "");
}

// ── React binding ────────────────────────────────────────────────────────────
// `t()` above reads a module-level ref, which is what lets non-React helpers
// translate. But a ref change is invisible to React: a component wrapped in
// memo() sees identical props on a language switch and skips re-rendering,
// leaving stale text on screen.
//
// Context solves exactly that — context updates propagate *through* memo
// boundaries. Any component that calls useT() re-renders when the language
// changes, memoised or not. Components in components/ should prefer useT()
// over importing t directly.

const LanguageContext = createContext(DEFAULT_LOCALE);

/**
 * Wrap the app once, passing the active language. Keeps the module-level ref in
 * sync during render so a t() called from a helper mid-render agrees with what
 * the tree is about to paint.
 */
export function LanguageProvider({ language, children }) {
  setLocale(language);
  return createElement(LanguageContext.Provider, { value: localeRef.current }, children);
}

/** The active language code, and a re-render subscription to changes. */
export function useLanguage() {
  return useContext(LanguageContext);
}

/**
 * Returns `t`, re-created whenever the language changes so that consuming
 * components — including memoised ones — re-render with fresh copy.
 */
export function useT() {
  const language = useContext(LanguageContext);
  return useCallback((key, params) => {
    void language; // the dependency is the point: it invalidates the callback
    return t(key, params);
  }, [language]);
}

/**
 * All translation helpers, bound to the active language.
 *
 * Prefer this inside anything wrapped in memo(). Importing `t` directly there is
 * a bug: memo sees unchanged props on a language switch and skips the re-render,
 * so the component keeps rendering the previous language. Consuming the context
 * is what forces the update, and bundling every helper behind one hook means the
 * subscription cannot be dropped by removing a call that looked unused.
 */
export function useTranslation() {
  const language = useContext(LanguageContext);
  return useMemo(
    () => ({
      language,
      t: (key, params) => t(key, params),
      tn: (key, count, params) => tn(key, count, params),
      growthStageLabel: (stage) => growthStageLabel(stage),
      moodLabel: (mood) => moodLabel(mood),
    }),
    [language]
  );
}

/** Every key defined in the English dictionary, as dot-paths. Used by tests. */
export function allKeys(dictionary = DICTIONARIES[DEFAULT_LOCALE], prefix = "") {
  const keys = [];
  Object.entries(dictionary || {}).forEach(([name, value]) => {
    const path = prefix ? `${prefix}.${name}` : name;
    if (value && typeof value === "object") keys.push(...allKeys(value, path));
    else keys.push(path);
  });
  return keys;
}

export const DICTIONARY_MAP = DICTIONARIES;
