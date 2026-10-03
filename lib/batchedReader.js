// Reads requested in the same tick go out as one multiGet.
//
// App's mount effects each hydrate a key. One getItem apiece was a native round
// trip each (a SQLite query each on Android), and every separate resolution
// re-rendered all of App. Batched, they resolve together and React folds the
// state updates into one render. Each apply still runs on its own, so one that
// throws cannot stop the rest, and a missing value arrives as null, the same as
// getItem gives.
export function createBatchedReader(storage) {
  let pending = null;
  const run = (apply, value) => Promise.resolve().then(() => apply(value)).catch(() => {});

  const flush = (batch) => {
    storage.multiGet([...batch.keys()])
      .then((pairs) => {
        const values = new Map(pairs);
        for (const [key, applies] of batch) for (const apply of applies) run(apply, values.get(key) ?? null);
      })
      .catch(() => {
        // One bad read shouldn't sink the batch: fall back to reading each key.
        for (const [key, applies] of batch) {
          storage.getItem(key)
            .then((value) => applies.forEach((apply) => run(apply, value)))
            .catch(() => {});
        }
      });
  };

  return (key, apply) => {
    if (!pending) {
      const batch = new Map();
      pending = batch;
      Promise.resolve().then(() => {
        pending = null;
        flush(batch);
      });
    }
    if (!pending.has(key)) pending.set(key, []);
    pending.get(key).push(apply);
  };
}
