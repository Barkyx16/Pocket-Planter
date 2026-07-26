import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { flipMonth, resolvePlantImageSource } from "../core";

const findItem = (name) => produceData.find((p) => p.name.toLowerCase() === String(name).toLowerCase());

// Curated northern-hemisphere bloom windows (month numbers 1–12) for the plants
// most relevant to pollinators. Used to map out whether something is flowering
// across the season so gardeners can spot and fill nectar gaps. Localized for
// the southern hemisphere via flipMonth at render time.
const BLOOM_WINDOWS = {
  marigold: [6, 7, 8, 9, 10],
  lavender: [6, 7, 8],
  borage: [5, 6, 7, 8, 9],
  sunflower: [7, 8, 9],
  zinnia: [6, 7, 8, 9, 10],
  "bee balm": [6, 7, 8],
  cosmos: [7, 8, 9, 10],
  calendula: [4, 5, 6, 9, 10],
  dill: [6, 7, 8],
  yarrow: [6, 7, 8, 9],
  crocus: [2, 3],
  "crocus (spring)": [2, 3],
  strawberry: [4, 5, 6],
  apple: [4, 5],
  pear: [4, 5],
  cherry: [3, 4],
  peach: [3, 4],
  plum: [3, 4],
  blueberry: [4, 5],
  raspberry: [5, 6],
  thyme: [6, 7],
  rosemary: [4, 5, 6],
  sage: [6, 7],
  chamomile: [6, 7, 8],
  chives: [5, 6],
  tomato: [6, 7, 8],
  cucumber: [6, 7, 8],
  zucchini: [6, 7, 8, 9],
  squash: [6, 7, 8, 9],
  pumpkin: [7, 8],
  bean: [6, 7, 8],
  pea: [4, 5, 6],
  nasturtium: [6, 7, 8, 9],
};

const MONTH_LETTERS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const lc = (s) => String(s || "").toLowerCase();
function bloomFor(name) {
  const key = Object.keys(BLOOM_WINDOWS).find((k) => lc(name).includes(k));
  return key ? BLOOM_WINDOWS[key] : null;
}

export const BloomSuccessionSection = memo(function BloomSuccessionSection({ theme, savedPlants, onOpenPlant }) {
  // Localised bloom coverage: for each of the 12 local months, which owned
  // plants are flowering.
  const bloomers = [];
  (savedPlants || []).forEach((name) => {
    const win = bloomFor(name);
    if (win) bloomers.push({ name, months: win.map(flipMonth) });
  });

  const covered = new Set();
  bloomers.forEach((b) => b.months.forEach((m) => covered.add(m)));

  // Only worry about gaps in the active growing season (localised Mar–Oct).
  const seasonMonths = [3, 4, 5, 6, 7, 8, 9, 10].map(flipMonth);
  const gaps = seasonMonths.filter((m) => !covered.has(m)).sort((a, b) => a - b);

  // Suggest a known pollinator plant to fill the first gap.
  let suggestion = null;
  if (gaps.length) {
    const firstGap = gaps[0];
    const candidate = Object.entries(BLOOM_WINDOWS).find(([k, months]) =>
      ["marigold", "calendula", "cosmos", "zinnia", "borage", "yarrow", "lavender", "sunflower"].includes(k) &&
      months.map(flipMonth).includes(firstGap)
    );
    if (candidate) suggestion = { plant: candidate[0], month: firstGap };
  }

  return (
    <View style={{ marginTop: 18, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }}>
      <Text style={{ color: "#ffd86b", fontSize: 12, fontWeight: "900", letterSpacing: 0.8, marginBottom: 4 }}>
        🌸 BLOOM SUCCESSION
      </Text>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 18 }}>
        Keep something in flower all season so pollinators always have a reason to visit.
      </Text>

      {/* 12-month coverage strip */}
      <View style={{ flexDirection: "row", gap: 3, marginTop: 12 }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
          const on = covered.has(m);
          const inSeason = seasonMonths.includes(m);
          return (
            <View key={m} style={{ flex: 1, alignItems: "center" }}>
              <View style={{ width: "100%", height: 26, borderRadius: 6, backgroundColor: on ? "#8effab" : inSeason ? "rgba(255,123,123,0.18)" : "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: on ? "#8effab" : "rgba(255,255,255,0.08)" }} />
              <Text style={{ color: theme.secondaryText, fontSize: 9, fontWeight: "800", marginTop: 3 }}>{MONTH_LETTERS[m - 1]}</Text>
            </View>
          );
        })}
      </View>

      {bloomers.length ? (
        <View style={{ marginTop: 12, gap: 6 }}>
          {bloomers.map((b) => {
            const item = findItem(b.name);
            const img = item ? resolvePlantImageSource(item) : null;
            return (
              <Pressable
                key={b.name}
                onPress={() => { if (item && onOpenPlant) onOpenPlant(item); }}
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 22, height: 22 }} resizeMode="contain" /> : <Text style={{ fontSize: 14 }}>🌼</Text>}
                  </View>
                  <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800" }} numberOfLines={1}>{b.name}</Text>
                </View>
                <Text style={{ color: theme.secondaryText, fontSize: 11, fontWeight: "700" }}>
                  {[...b.months].sort((a, c) => a - c).map((m) => MONTH_SHORT[m - 1]).join(", ")}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", fontStyle: "italic", marginTop: 12 }}>
          Save some flowering plants and they'll map out here across the year.
        </Text>
      )}

      {/* Gap advice */}
      <View style={{ marginTop: 12, backgroundColor: gaps.length ? "rgba(255,159,67,0.1)" : "rgba(92,255,137,0.1)", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: gaps.length ? "rgba(255,159,67,0.28)" : "rgba(92,255,137,0.28)" }}>
        {gaps.length ? (
          <Text style={{ color: "#ff9f43", fontSize: 12, fontWeight: "800", lineHeight: 17 }}>
            Bloom gap in {gaps.map((m) => MONTH_SHORT[m - 1]).join(", ")}.
            {suggestion ? ` Add ${suggestion.plant} to cover ${MONTH_SHORT[suggestion.month - 1]}.` : " Add an early or late bloomer to fill it."}
          </Text>
        ) : bloomers.length ? (
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800", lineHeight: 17 }}>
            Nice — you've got continuous bloom across the growing season. 🐝
          </Text>
        ) : (
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800", lineHeight: 17 }}>
            Aim for at least one plant flowering in every month from spring to fall.
          </Text>
        )}
      </View>
    </View>
  );
});
