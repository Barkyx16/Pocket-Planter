import { memo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { PEST_WATCH_DATA, resolvePlantImageSource, tapHaptic } from "../core";
import { getPestImage } from "../data/pestImageMap";
import { FEATURE_INDEX, searchFeatures } from "../data/featureIndex";
import { useTranslation, formatDate } from "../lib/i18n";
import { IconText } from "./IconText";

export const GlobalSearchModal = memo(function GlobalSearchModal({ visible, onClose, theme, savedPlants, journalEntries, onOpenPlant, onOpenPest, onGoToJournal, onJumpToTab }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const savedSet = new Set((savedPlants || []).map((n) => n.toLowerCase()));

  const plants = query.length >= 1
    ? produceData
        .filter((p) => p.name.toLowerCase().includes(query))
        .sort((a, b) => (b.name.toLowerCase().startsWith(query) ? 1 : 0) - (a.name.toLowerCase().startsWith(query) ? 1 : 0))
        .slice(0, 8)
    : [];
  const pests = query.length >= 1
    ? PEST_WATCH_DATA.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5)
    : [];
  const journals = query.length >= 1
    ? (journalEntries || []).filter((e) =>
        (e.plantName || "").toLowerCase().includes(query) ||
        (e.growthStage || "").toLowerCase().includes(query)
      ).slice(0, 6)
    : [];

  const features = query.length >= 1 ? searchFeatures(query, 8) : [];
  // A handful of jump suggestions before the user types anything.
  const suggestions = FEATURE_INDEX.slice(0, 6);

  const noResults = query.length >= 1 && !plants.length && !pests.length && !journals.length && !features.length;

  const jumpTo = (tab) => { close(); onJumpToTab && onJumpToTab(tab); };

  const close = () => { setQ(""); onClose(); };

  const Row = ({ img, emoji, title, subtitle, accent, onPress }) => (
    <Pressable
      onPress={() => { tapHaptic("light"); onPress(); }}
      style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>{emoji}</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text, fontSize: 14, fontWeight: "800" }} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={{ color: accent || theme.secondaryText, fontSize: 12, fontWeight: "700", marginTop: 2 }} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <Text style={{ color: "#8effab", fontSize: 18, fontWeight: "900" }}>›</Text>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={{ flex: 1, backgroundColor: "rgba(4, 20, 12, 0.96)", paddingTop: 64, paddingHorizontal: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 16, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}>
            <Text style={{ fontSize: 16 }}>🔍</Text>
            <TextInput
              value={q}
              onChangeText={setQ}
              autoFocus
              placeholder={t("globalSearchModal.searchPlantsPestsJournal")}
              placeholderTextColor="#8fbf9d"
              style={{ flex: 1, color: "#ffffff", fontSize: 14, fontWeight: "700", paddingVertical: 14 }}
            />
            {q ? <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.clearSearch")} onPress={() => setQ("")} hitSlop={8}><Text style={{ color: "#8fbf9d", fontSize: 14, fontWeight: "900" }}>✕</Text></Pressable> : null}
          </View>
          <Pressable onPress={close} accessibilityRole="button" hitSlop={8}>
            <Text style={{ color: "#8effab", fontSize: 14, fontWeight: "900" }}>Done</Text>
          </Pressable>
        </View>

        <ScrollView style={{ marginTop: 16 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {query.length < 1 ? (
            <>
              <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", textAlign: "center", marginTop: 28, marginBottom: 22 }}>
                {t("globalSearchModal.searchAcrossYourPlantsPest")}
              </Text>
              <IconText label={"JUMP TO A TOOL"} style={{ color: "#8effab", fontSize: 10, fontWeight: "900", letterSpacing: 0.8, marginBottom: 8 }} />
              <View style={{ gap: 8, marginBottom: 18 }}>
                {suggestions.map((f) => (
                  <Row key={`sg-${f.name}`} emoji={f.emoji} title={f.name} subtitle={f.where} accent="#8effab" onPress={() => jumpTo(f.tab)} />
                ))}
              </View>
            </>
          ) : null}

          {features.length ? (
            <>
              <IconText label={"TOOLS & FEATURES"} style={{ color: "#8effab", fontSize: 10, fontWeight: "900", letterSpacing: 0.8, marginBottom: 8 }} />
              <View style={{ gap: 8, marginBottom: 18 }}>
                {features.map((f) => (
                  <Row key={`ft-${f.name}`} emoji={f.emoji} title={f.name} subtitle={f.where} accent="#8effab" onPress={() => jumpTo(f.tab)} />
                ))}
              </View>
            </>
          ) : null}

          {noResults ? (
            <Text style={{ color: theme.secondaryText, fontSize: 12, fontWeight: "700", textAlign: "center", marginTop: 40 }}>
              {t("globalSearchModal.nothingMatches")}{q}{t("globalSearchModal.tryADifferentWord")}
            </Text>
          ) : null}

          {plants.length ? (
            <>
              <IconText label={t("globalSearchModal.plants")} style={{
  color: "#8effab",
  fontSize: 10,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
              <View style={{ gap: 8, marginBottom: 18 }}>
                {plants.map((item) => (
                  <Row
                    key={`pl-${item.name}`}
                    img={resolvePlantImageSource(item)}
                    emoji="🌱"
                    title={item.name}
                    subtitle={savedSet.has(item.name.toLowerCase()) ? t("globalSearchModal.inYourGarden") : t("globalSearchModal.tapToOpen")}
                    accent={savedSet.has(item.name.toLowerCase()) ? "#8effab" : theme.secondaryText}
                    onPress={() => { close(); onOpenPlant(item); }}
                  />
                ))}
              </View>
            </>
          ) : null}

          {pests.length ? (
            <>
              <IconText label={t("globalSearchModal.pests")} style={{
  color: "#ff9f9f",
  fontSize: 10,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
              <View style={{ gap: 8, marginBottom: 18 }}>
                {pests.map((pest) => (
                  <Row
                    key={`pe-${pest.name}`}
                    img={getPestImage(pest.name)}
                    emoji={pest.emoji}
                    title={pest.name}
                    subtitle={t("globalSearchModal.openPestGuide")}
                    accent="#ff9f9f"
                    onPress={() => { close(); onOpenPest(pest); }}
                  />
                ))}
              </View>
            </>
          ) : null}

          {journals.length ? (
            <>
              <IconText label={t("globalSearchModal.journal")} style={{
  color: "#ffd86b",
  fontSize: 10,
  fontWeight: "900",
  letterSpacing: 0.8,
  marginBottom: 8
}} />
              <View style={{ gap: 8, marginBottom: 18 }}>
                {journals.map((e) => (
                  <Row
                    key={`jo-${e.id}`}
                    img={e.imageUri ? { uri: e.imageUri } : null}
                    emoji="📸"
                    title={e.plantName || t("globalSearchModal.gardenUpdate")}
                    subtitle={`${e.growthStage || "Photo"} · ${formatDate(new Date(e.createdAt))}`}
                    accent={theme.secondaryText}
                    onPress={() => { close(); onGoToJournal(); }}
                  />
                ))}
              </View>
            </>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
})
