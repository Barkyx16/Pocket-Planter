const path = require("path");
const { describe, it, eq } = require("../test.js");
const { createBatchedReader } = require(path.join(__dirname, "../../lib/batchedReader.js"));

const tick = () => new Promise((r) => setTimeout(r, 0));
const fakeStorage = (data, { failMulti = false } = {}) => {
  const calls = { multiGet: [], getItem: [] };
  return {
    calls,
    multiGet: async (keys) => {
      calls.multiGet.push(keys);
      if (failMulti) throw new Error("multiGet failed");
      return keys.map((k) => [k, k in data ? data[k] : null]);
    },
    getItem: async (key) => {
      calls.getItem.push(key);
      return key in data ? data[key] : null;
    },
  };
};

describe("batched storage reads", () => {
  it("send reads from the same tick as one multiGet", async () => {
    const storage = fakeStorage({ a: "1", b: "2" });
    const hydrate = createBatchedReader(storage);
    const got = {};
    hydrate("a", (v) => { got.a = v; });
    hydrate("b", (v) => { got.b = v; });
    hydrate("missing", (v) => { got.missing = v; });
    await tick();
    eq(storage.calls.multiGet, [["a", "b", "missing"]]);
    eq(storage.calls.getItem, []);
    eq(got, { a: "1", b: "2", missing: null });
  });
  it("give every reader of a key its value", async () => {
    const storage = fakeStorage({ a: "1" });
    const hydrate = createBatchedReader(storage);
    const seen = [];
    hydrate("a", (v) => seen.push(`x${v}`));
    hydrate("a", (v) => seen.push(`y${v}`));
    await tick();
    eq(storage.calls.multiGet, [["a"]]);
    eq(seen, ["x1", "y1"]);
  });
  it("keep going when one apply throws", async () => {
    const storage = fakeStorage({ a: "1", b: "2" });
    const hydrate = createBatchedReader(storage);
    let b = null;
    hydrate("a", () => { throw new Error("bad value"); });
    hydrate("b", (v) => { b = v; });
    await tick();
    eq(b, "2");
  });
  it("fall back to single reads when multiGet fails", async () => {
    const storage = fakeStorage({ a: "1", b: "2" }, { failMulti: true });
    const hydrate = createBatchedReader(storage);
    const got = {};
    hydrate("a", (v) => { got.a = v; });
    hydrate("b", (v) => { got.b = v; });
    await tick();
    eq(storage.calls.getItem, ["a", "b"]);
    eq(got, { a: "1", b: "2" });
  });
  it("start a new batch for reads in a later tick", async () => {
    const storage = fakeStorage({ a: "1", b: "2" });
    const hydrate = createBatchedReader(storage);
    hydrate("a", () => {});
    await tick();
    hydrate("b", () => {});
    await tick();
    eq(storage.calls.multiGet, [["a"], ["b"]]);
  });
});

describe("fetchWithTimeout", () => {
  const { fetchWithTimeout } = require(path.join(__dirname, "../../lib/net.js"));
  it("aborts a request that never answers", async () => {
    const realFetch = global.fetch;
    global.fetch = (url, { signal }) => new Promise((_, reject) => {
      signal.addEventListener("abort", () => reject(new Error("aborted")));
    });
    try {
      let error = null;
      await fetchWithTimeout("https://example.invalid", {}, 20).catch((e) => { error = e; });
      eq(error && error.message, "aborted");
    } finally {
      global.fetch = realFetch;
    }
  });
  it("passes a prompt response straight through", async () => {
    const realFetch = global.fetch;
    global.fetch = async (url, options) => ({ ok: true, url, hasSignal: !!options.signal });
    try {
      const res = await fetchWithTimeout("https://example.invalid/x", { headers: { A: "1" } }, 1000);
      eq([res.ok, res.url, res.hasSignal], [true, "https://example.invalid/x", true]);
    } finally {
      global.fetch = realFetch;
    }
  });
});

describe("batched reads return a promise", () => {
  it("that settles after the apply has run, so callers can chain on it", async () => {
    // App chains .catch() onto some hydrate() calls; returning undefined made
    // the app throw on launch.
    const storage = fakeStorage({ a: "1" });
    const hydrate = createBatchedReader(storage);
    let applied = null;
    const p = hydrate("a", (v) => { applied = v; });
    eq(typeof (p && p.then), "function");
    eq(typeof (p && p.catch), "function");
    await p.catch(() => {});
    eq(applied, "1");
  });
  it("and that never rejects, even when the apply throws", async () => {
    const hydrate = createBatchedReader(fakeStorage({ a: "1" }));
    let rejected = false;
    await hydrate("a", () => { throw new Error("bad"); }).catch(() => { rejected = true; });
    eq(rejected, false);
  });
});
