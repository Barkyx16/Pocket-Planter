// Maps each month (1–12) to its bundled image in assets/months/. All 12 images
// are present on disk and wired below. Months without an image would fall back to
// the month emoji (getMonthImage returns null) — currently none.
const monthImageMap = {
  1: require("../assets/months/january.png"),
  2: require("../assets/months/february.png"),
  3: require("../assets/months/march.png"),
  4: require("../assets/months/april.png"),
  5: require("../assets/months/may.png"),
  6: require("../assets/months/june.png"),
  7: require("../assets/months/july.png"),
  8: require("../assets/months/august.png"),
  9: require("../assets/months/september.png"),
  10: require("../assets/months/october.png"),
  11: require("../assets/months/november.png"),
  12: require("../assets/months/december.png"),
};

// monthNumber is 1-based (1 = January … 12 = December).
export function getMonthImage(monthNumber) {
  return monthImageMap[monthNumber] || null;
}
