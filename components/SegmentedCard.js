import { memo, useRef, useState } from "react";
import { LayoutAnimation, Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Generic "Watering Insights"-style card: a horizontal pill switcher that shows
// one section at a time. `tabs` = [{ id, label, node }].
//
// When there are more tabs than fit, a soft edge-fade appears on whichever side
// still has tabs off-screen, so the row reads as scrollable instead of "done".
export const SegmentedCard = memo(function SegmentedCard({ theme, tabs, accent = "#5cff89" }) {
  const list = (tabs || []).filter(Boolean);
  const [active, setActive] = useState(list[0]?.id);
  const current = list.find((t) => t.id === active) || list[0];
  const [showL, setShowL] = useState(false);
  const [showR, setShowR] = useState(false);
  const vw = useRef(0);
  const cw = useRef(0);
  const fadeColor = theme?.card || "#0e2414";

  if (!list.length) return null;

  const sync = (offset) => {
    setShowL(offset > 4);
    setShowR(vw.current > 0 && offset + vw.current < cw.current - 4);
  };

  const select = (id) => {
    if (id === active) return;
    LayoutAnimation.configureNext(LayoutAnimation.create(180, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity));
    setActive(id);
  };

  return (
    <View>
      <View style={{ position: "relative", marginBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingBottom: 2 }}
          scrollEventThrottle={16}
          onScroll={(e) => sync(e.nativeEvent.contentOffset.x)}
          onLayout={(e) => { vw.current = e.nativeEvent.layout.width; sync(0); }}
          onContentSizeChange={(w) => { cw.current = w; setShowR(vw.current > 0 && w > vw.current + 4); }}
        >
          {list.map((t) => {
            const on = current?.id === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => select(t.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={({ pressed }) => [{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: on ? accent : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: on ? accent : "rgba(255, 255, 255, 0.1)" }, pressed && !on && { opacity: 0.6 }]}
              >
                <Text style={{ color: on ? "#07120b" : theme.secondaryText, fontSize: 12, fontWeight: "900" }}>{t.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {showL ? (
          <LinearGradient
            pointerEvents="none"
            colors={[fadeColor, "rgba(0,0,0,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ position: "absolute", left: 0, top: 0, bottom: 2, width: 26 }}
          />
        ) : null}
        {showR ? (
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(0,0,0,0)", fadeColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ position: "absolute", right: 0, top: 0, bottom: 2, width: 26, alignItems: "flex-end", justifyContent: "center" }}
          >
            <Text style={{ color: accent, fontSize: 13, fontWeight: "900" }}>›</Text>
          </LinearGradient>
        ) : null}
      </View>
      {current?.node}
    </View>
  );
})
