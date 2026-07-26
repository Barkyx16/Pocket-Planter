import { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { tapHaptic } from "../core";
import { useTranslation } from "../lib/i18n";

const STORAGE_KEY = "pp_wishlist";

export const WishlistCard = memo(function WishlistCard({ theme, savedPlants, onOpenPlant }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (alive && val) { try { setItems(JSON.parse(val) || []); } catch (e) { /* ignore */ } }
      if (alive) setLoaded(true);
    }).catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const persist = (next) => { setItems(next); AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {}); };

  const suggestions = draft.trim().length >= 2
    ? produceData.filter((p) => p.name.toLowerCase().includes(draft.toLowerCase()) && !items.some((i) => i.name === p.name)).slice(0, 4)
    : [];

  const add = (name) => {
    const clean = (name || draft).trim();
    if (!clean || items.some((i) => i.name === clean)) { setDraft(""); return; }
    tapHaptic("light");
    persist([{ id: Date.now().toString(), name: clean }, ...items]);
    setDraft("");
  };
  const remove = (id) => { tapHaptic("light"); persist(items.filter((i) => i.id !== id)); };

  if (!loaded) return null;

  return (
    <View>
      <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", lineHeight: 19, marginTop: 2 }}>
        {t("wishlist.dreamingUpNextSeasonSave")}
      </Text>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => add()}
          placeholder={t("wishlist.addAPlantToTry")}
          placeholderTextColor="#8fbf9d"
          style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.16)", color: theme.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: "700" }}
        />
        <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.addItem")} onPress={() => add()} style={{ backgroundColor: "#5cff89", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>＋</Text>
        </Pressable>
      </View>

      {suggestions.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {suggestions.map((p) => (
            <Pressable key={p.name} onPress={() => add(p.name)} style={{ backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}>
              <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "800" }}>+ {p.name}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {items.length === 0 ? (
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "600", fontStyle: "italic", textAlign: "center", paddingVertical: 16 }}>
          {t("wishlist.yourWishlistIsEmptyAdd")}
        </Text>
      ) : (
        <View style={{ gap: 6, marginTop: 12 }}>
          {items.map((item) => {
            const known = produceData.find((p) => p.name === item.name);
            const alreadyGrowing = (savedPlants || []).includes(item.name);
            return (
              <View key={item.id} style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <Text style={{ fontSize: 14 }}>⭐</Text>
                <Pressable style={{ flex: 1 }} onPress={() => { if (known && onOpenPlant) onOpenPlant(known); }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }} numberOfLines={1}>{item.name}{known ? " ›" : ""}</Text>
                </Pressable>
                {alreadyGrowing ? <Text style={{ color: "#8effab", fontSize: 10, fontWeight: "900" }}>{t("wishlist.growing")}</Text> : null}
                <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.removeItem")} onPress={() => remove(item.id)} hitSlop={8}><Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "900" }}>✕</Text></Pressable>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
})
