const js = require("@eslint/js");
const reactHooks = require("eslint-plugin-react-hooks");
const react = require("eslint-plugin-react");
const globals = require("globals");

// ─────────────────────────────────────────────────────────────────────────────
// Nothing statically checked this codebase before this file existed. A whole
// class of bug never reaches a smoke test: a hook called inside a condition, a
// dependency array missing the value it closes over, a variable referenced
// after a rename, an unused import left behind by a refactor. All of those
// render fine and ship green.
//
// The rules below are deliberately narrow. A linter that reports six hundred
// style opinions on an existing codebase gets switched off in a week, so
// formatting is left alone entirely and only correctness rules are errors.
// ─────────────────────────────────────────────────────────────────────────────
module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "supabase/functions/**",
      "coverage/**",
      // Generated / bulk plant content, not hand-written logic.
      "data/produceData.js",
      "zip_zone_lookup_2023.json",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
        __DEV__: "readonly",
      },
    },
    settings: { react: { version: "detect" } },
    plugins: { "react-hooks": reactHooks, react },
    rules: {
      // The one that matters most here. AppInner is a 5,000-line component with
      // 115 hooks; rules-of-hooks is the only thing that can tell you an early
      // return has broken hook order.
      "react-hooks/rules-of-hooks": "error",
      // A missing dependency is a stale closure. Warn rather than error: several
      // persist/hydrate effects intentionally omit deps, and a rule that blocks
      // the build on a judgement call is a rule people disable.
      "react-hooks/exhaustive-deps": "warn",

      // Catches JSX referencing something that no longer exists.
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "off",
      "react/jsx-no-undef": "error",
      "react/jsx-key": "error",

      // Real mistakes, not style.
      "no-unused-vars": ["warn", { args: "none", varsIgnorePattern: "^_", ignoreRestSiblings: true }],
      "no-undef": "error",
      "no-const-assign": "error",
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "no-fallthrough": "error",
      "no-self-compare": "error",
      "no-unsafe-negation": "error",
      "require-atomic-updates": "off",

      // An empty catch is this codebase's deliberate idiom for "best-effort
      // write", so allow it rather than paper over it with a comment.
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-control-regex": "off",
    },
  },
];
