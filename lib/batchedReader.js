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
  // Runs one reader's apply and settles the promise its hydrate call returned.
  // Never rejects: callers may chain .then/.catch, as they did on getItem.
  const run = (entry, value) => Promise.resolve()
    .then(() => entry.apply(value))
    .catch(() => {})
    .then(() => entry.resolve());

  const flush = (batch) => {
    storage.multiGet([...batch.keys()])
      .then((pairs) => {
        const values = new Map(pairs);
        for (const [key, entries] of batch) for (const entry of entries) run(entry, values.get(key) ?? null);
      })
      .catch(() => {
        // One bad read shouldn't sink the batch: fall back to reading each key.
        for (const [key, entries] of batch) {
          storage.getItem(key)
            .then((value) => entries.forEach((entry) => run(entry, value)))
            .catch(() => entries.forEach((entry) => entry.resolve()));
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
    // A promise, like the getItem().then(apply) this replaced: App chains
    // .catch() onto some of these calls, and undefined.catch threw on launch.
    return new Promise((resolve) => pending.get(key).push({ apply, resolve }));
  };
}
