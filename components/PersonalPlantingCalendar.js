import { Pressable, Text, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { MONTH_NAMES, getMonthEmoji } from "../core";

export function PersonalPlantingCalendar({ theme, savedPlants, zone, onOpenPlant }) {
  const saved = produceData.filter((item) => savedPlants.includes(item.name));
  if (!saved.length) return null;

  const currentMonth = new Date().getMonth() + 1;

  // For each month, which saved plants can be planted
  const byMonth = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const plants = saved.filter((item) =>
      Array.isArray(item.plantMonths) && item.plantMonths.includes(monthNum)
    );
    return { monthNum, plants };
  });

  const thisMonthPlants = byMonth[currentMonth - 1]?.plants || [];

return (
    <View>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
      </Text>

      {/* MONTH GRID */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {byMonth.map(({ monthNum, plants }) => {
          const isNow = monthNum === currentMonth;
          const has = plants.length > 0;
          return (
            <View
              key={monthNum}
              style={{
                width: "30%",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: "center",
                backgroundColor: isNow ? "rgba(92,255,137,0.16)" : has ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                borderWidth: 1,
                borderColor: isNow ? "#5cff89" : has ? "rgba(142,255,171,0.16)" : "rgba(255,255,255,0.06)",
              }}
            >
              <Text style={{ fontSize: 18 }}>{getMonthEmoji(monthNum)}</Text>
              <Text style={{ color: isNow ? "#5cff89" : theme.text, fontSize: 12, fontWeight: "900", marginTop: 4 }}>
                {MONTH_NAMES[monthNum - 1].slice(0, 3)}
              </Text>
              <Text style={{ color: has ? "#8effab" : theme.secondaryText, fontSize: 11, fontWeight: "800", marginTop: 2 }}>
                {has ? `${plants.length} plant${plants.length === 1 ? "" : "s"}` : "—"}
              </Text>
            </View>
          );
        })}
      </View>

      {/* THIS MONTH DETAIL */}
      <View style={{ marginTop: 16, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}>
        <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>
          {getMonthEmoji(currentMonth)} PLANT IN {MONTH_NAMES[currentMonth - 1].toUpperCase()}
        </Text>
        {thisMonthPlants.length ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {thisMonthPlants.map((item) => (
              <Pressable
                key={`cal-${item.name}`}
                onPress={() => onOpenPlant(item)}
                style={{ backgroundColor: "rgba(92,255,137,0.12)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
              >
                <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "800" }}>{item.name} ›</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={{ color: theme.secondaryText, fontSize: 13, fontWeight: "700", lineHeight: 20 }}>
            None of your saved plants have a planting window this month. Check the highlighted months above for what's coming up.
          </Text>
        )}
      </View>
    </View>
  );
}
