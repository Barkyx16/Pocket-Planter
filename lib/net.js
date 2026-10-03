// fetch() has no timeout of its own. On a captive portal or a dead cell
// connection a request can hang for minutes, and whatever waits on it (the
// weather card, a zone lookup) sits in its loading state the whole time.
export const DEFAULT_TIMEOUT_MS = 15000;

export async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  if (typeof AbortController === "undefined") return fetch(url, options);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
