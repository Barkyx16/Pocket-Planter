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
