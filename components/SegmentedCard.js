import { memo, useState } from "react";
import { LayoutAnimation, Pressable, ScrollView, Text, View } from "react-native";

// Generic "Watering Insights"-style card: a horizontal pill switcher that shows
// one section at a time. `tabs` = [{ id, label, node }].
export const SegmentedCard = memo(function SegmentedCard({ theme, tabs, accent = "#5cff89" }) {
  const list = (tabs || []).filter(Boolean);
  const [active, setActive] = useState(list[0]?.id);
  const current = list.find((t) => t.id === active) || list[0];
  if (!list.length) return null;

  const select = (id) => {
    if (id === active) return;
    LayoutAnimation.configureNext(LayoutAnimation.create(180, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity));
    setActive(id);
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingBottom: 2 }} style={{ marginBottom: 12 }}>
        {list.map((t) => {
          const on = current?.id === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => select(t.id)}
              style={({ pressed }) => [{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: on ? accent : "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: on ? accent : "rgba(255,255,255,0.1)" }, pressed && !on && { opacity: 0.6 }]}
            >
              <Text style={{ color: on ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{t.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {current?.node}
    </View>
  );
})
