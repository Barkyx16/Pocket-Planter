import { useEffect, useState } from "react";
import { Alert, Image, InteractionManager, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { getDateKey, MONTH_NAMES, PLANT_TYPES, SCREEN_WIDTH, getHarvestCountdown, getMonthEmoji, getPlantDifficulty, getPlantSeasonLabel, getSearchSuggestions, normalizeType, plantsBuddyImage, resolvePlantImageSource, tapHaptic } from "../core";
import { getMonthImage } from "../data/monthImageMap";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { PremiumLockedCard } from "../components/PremiumLockedCard";
import { TabHero } from "../components/TabHero";
import { GlowPlantCard } from "../components/GlowPlantCard";
import { PersonalPlantingCalendar } from "../components/PersonalPlantingCalendar";
import { t } from "../lib/i18n";
import { IconText } from "../components/IconText";

export function PlantsTab({ comparePlants, premiumUnlocked, onViewPremium, filteredPlants, followedPlants, markPlantWatered, monthScrollDone, monthScrollRef, monthlyPicksY, monthlySuggestions, openPlantFromList, openPlantFromMonthly, plantSearch, plantDifficultyFilter, setPlantDifficultyFilter, plantNowOnly, setPlantNowOnly, plantSortMode, setPlantSortMode, plantAttrFilters, setPlantAttrFilters, addPlantToGarden, gardenPlantNames, plantsListY, plantsVisibleCount, recentPlants, savedPlants, scrollRef, selectedMonth, selectedType, setComparePlants, setPlantSearch, setPlantsVisibleCount, setSelectedMonth, setSelectedType, snoozePlantWatering, snoozedPlants, theme, toggleComparePlant, toggleFollowPlant, toggleSavedPlant, wateredPlants, wateringHistory, weather, zone }) {
  const [selectMode, setSelectMode] = useState(false);
  const [bulkSel, setBulkSel] = useState([]);
  const [showAllMonthly, setShowAllMonthly] = useState(false);

  // Progressive render. Each GlowPlantCard resolves an image and runs several
  // per-plant computations on mount; mounting all ~20 at once competes with the
  // tab cross-fade and makes this tab feel slower to open than the others. So we
  // paint a small first batch immediately, then render the rest once the switch
  // animation has settled. The tab remounts on every switch, so this runs each
  // time the tab is opened.
  const FIRST_PAINT = 6;
  // Monthly picks can be long — show a short preview, then a "show more" toggle.
  const MONTHLY_PREVIEW = 5;
  // Free tier sees only the first few plants in the full list; Premium sees them all.
  const FREE_PLANT_LIMIT = 6;
  const [renderCap, setRenderCap] = useState(FIRST_PAINT);
  useEffect(() => {
    if (renderCap >= plantsVisibleCount) return undefined;
    const task = InteractionManager.runAfterInteractions(() => setRenderCap(Infinity));
    return () => task.cancel();
  }, [renderCap, plantsVisibleCount]);
  const visibleCount = Math.min(plantsVisibleCount, renderCap);
  // The free version caps the plant list at FREE_PLANT_LIMIT — the upgrade CTA takes over from there.
  const listVisibleCount = premiumUnlocked ? visibleCount : Math.min(visibleCount, FREE_PLANT_LIMIT);
  const toggleBulk = (name) => setBulkSel((cur) => cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]);
  const toggleAttr = (key) => { tapHaptic("light"); setPlantAttrFilters((cur) => cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]); };
  const ATTR_FILTERS = [
    { key: "container", label: "🪴 Container-friendly" },
    { key: "fullsun", label: "☀️ Full sun" },
    { key: "perennial", label: "🔁 Perennial" },
  ];
  const exitSelect = () => { setSelectMode(false); setBulkSel([]); };
  const bulkSave = () => {
    const toSave = bulkSel.filter((n) => !savedPlants.includes(n));
    toSave.forEach((n) => toggleSavedPlant(n));
    Alert.alert("Saved", toSave.length ? `Added ${toSave.length} plant${toSave.length === 1 ? "" : "s"} to your garden.` : "Those were already saved.");
    exitSelect();
  };
  const bulkCompare = () => {
    if (bulkSel.length !== 2) { Alert.alert("Pick exactly 2", "Select two plants to compare them side by side."); return; }
    setComparePlants([...bulkSel]);
    exitSelect();
  };
  return (
<>
    <TabHero
      tabKey="plants"
      source={plantsBuddyImage}
      style={{
        width: "100%",
        height: SCREEN_WIDTH * 0.6,
        borderRadius: 24,
        marginBottom: 18,
      }}
    />
<View onLayout={(event) => { monthlyPicksY.current = event.nativeEvent.layout.y; }}>
      <CollapsibleCard theme={theme} storageKey="monthlypicks" title={t("plants.thisMonthsPicks")}>
      {!premiumUnlocked ? (
      <PremiumLockedCard
        theme={theme}
        title="This month's picks locked"
        body="Unlock Premium to see the best plants to start this month, matched to your zone and climate."
        onUnlock={onViewPremium}
      />
      ) : (
      <>
      <View style={styles.primaryFeatureAccentBar} />
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.smallJumpButton} onPress={() => { scrollRef.current?.scrollTo({ y: plantsListY.current, animated: true }); }}>
          <Text style={styles.smallJumpButtonText}>{t("plants.allPlants")}</Text>
        </Pressable>
      </View>
    <ScrollView ref={monthScrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {MONTH_NAMES.map((month, index) => {
          const monthNumber = index + 1;
          const active = selectedMonth === monthNumber;
          return (
            <Pressable
              key={month}
              onPress={() => { tapHaptic("light"); setSelectedMonth(monthNumber); }}
              onLayout={(e) => {
                if (active && !monthScrollDone.current && monthScrollRef.current) {
                  monthScrollDone.current = true;
                  const x = e.nativeEvent.layout.x;
                  monthScrollRef.current.scrollTo({ x: Math.max(0, x - 24), animated: false });
                }
              }}
              style={[styles.calendarMonthCard, active && styles.calendarMonthCardActive]}
            >
              {getMonthImage(monthNumber) ? (
                <Image source={getMonthImage(monthNumber)} style={{ width: 34, height: 34, borderRadius: 9, marginBottom: 2 }} resizeMode="cover" />
              ) : (
                <Text style={styles.calendarMonthEmoji}>{getMonthEmoji(monthNumber)}</Text>
              )}
              <Text style={[styles.calendarMonthText, { color: active ? "#ffd86b" : "#d7ebdc" }]}>{month.slice(0, 3)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {monthlySuggestions.length ? (
        <View style={styles.cleanPlantList}>
          {(showAllMonthly ? monthlySuggestions : monthlySuggestions.slice(0, MONTHLY_PREVIEW)).map((item) => {
            const imageSource = resolvePlantImageSource(item);
            return (
              <Pressable key={`monthly-${item.name}`} style={styles.cleanPlantRow} onPress={() => openPlantFromMonthly(item)}>
                <View style={styles.cleanPlantImageWrap}>
                  {imageSource ? (<Image source={imageSource} style={styles.cleanPlantImage} />) : (<Text style={styles.cleanPlantEmoji}>🌱</Text>)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cleanPlantName}>{item.name}</Text>
                  <Text style={styles.cleanPlantMeta}>{normalizeType(item.type, item.name)} • {getPlantSeasonLabel(item, zone, selectedMonth)}</Text>
                </View>
                <Text style={styles.cleanPlantArrow}>›</Text>
              </Pressable>
            );
          })}
          {monthlySuggestions.length > MONTHLY_PREVIEW ? (
            <Pressable
              onPress={() => { tapHaptic("light"); setShowAllMonthly((v) => !v); }}
              accessibilityRole="button"
              style={{ marginTop: 8, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, backgroundColor: "rgba(92, 255, 137, 0.1)", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.28)" }}
            >
              <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900" }}>
                {showAllMonthly
                  ? t("plants.showLess")
                  : `${t("plants.showMorePlants")}${monthlySuggestions.length - MONTHLY_PREVIEW} ${t("plants.more")}`}
              </Text>
              <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900" }}>{showAllMonthly ? "▲" : "▼"}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={styles.emptyStateCard}>
          <Text style={styles.emptyStateIcon}>📅</Text>
          <Text style={styles.emptyStateTitle}>{t("plants.nothingIdealFor")} {MONTH_NAMES[selectedMonth - 1]}</Text>
          <Text style={styles.emptyStateText}>
            {zone
              ? `${MONTH_NAMES[selectedMonth - 1]} isn't a prime planting window for Zone ${zone}. Try another month above, or browse all plants to plan ahead.`
              : t("plants.setYourZipCodeOn")}
          </Text>
</View>
      )}
      </>
      )}
      </CollapsibleCard>
    </View>
{premiumUnlocked && savedPlants.length ? (
    <CollapsibleCard theme={theme} storageKey="plantingcalendar" title={t("plants.yourPlantingCalendar")}>
    <PersonalPlantingCalendar
      theme={theme}
      savedPlants={savedPlants}
      zone={zone}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
    ) : null}

    <View onLayout={(event) => { plantsListY.current = event.nativeEvent.layout.y; }} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Plants</Text>
        </View>
        <Pressable
          style={styles.smallJumpButton}
          onPress={() => {
            setSelectedType("All");
            setComparePlants([]);
            setPlantSearch("");
            setPlantDifficultyFilter("All");
            setPlantSortMode("smart");
            setPlantAttrFilters([]);
          }}
        >
          <Text style={styles.smallJumpButtonText}>Reset</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabsNew}
      >
        {PLANT_TYPES.map((type) => {
          const active = selectedType === type;
          return (
            <Pressable
              key={type}
              onPress={() => setSelectedType(type)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Filter by ${type}`}
              style={[styles.filterTabNew, active && styles.filterTabNewActive]}
            >
              <Text style={[styles.filterTabNewText, active && styles.filterTabNewTextActive]}>
                {type}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {recentPlants.length > 0 ? (
        <View style={{ marginTop: 14 }}>
          <IconText label={t("plants.recentlyViewed")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.5,
  marginBottom: 8
}} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {recentPlants.map((name) => {
              const item = produceData.find((p) => p.name === name);
              if (!item) return null;
              const img = resolvePlantImageSource(item);
              return (
                <Pressable
                  key={`recent-${name}`}
                  onPress={() => openPlantFromList(item)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255, 255, 255, 0.06)", borderRadius: 999, paddingLeft: 6, paddingRight: 14, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(142, 255, 171, 0.16)" }}
                >
                  <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 24, height: 24 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>🌱</Text>}
                  </View>
                  <Text style={{ color: "#ffffff", fontSize: 12, fontWeight: "800" }}>{name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      <View style={styles.plantSearchBar}>
        <Text style={styles.plantSearchIcon}>🔍</Text>
        <TextInput
          value={plantSearch}
          onChangeText={setPlantSearch}
          placeholder={t("plants.searchPlants")}
          placeholderTextColor="#8fbf9d"
          style={styles.plantSearchInput}
        />
        {plantSearch ? (
          <Pressable accessibilityRole="button" accessibilityLabel={t("a11y.clearSearch")} onPress={() => setPlantSearch("")}>
            <Text style={styles.plantSearchClear}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      {/* Plant-now quick filter */}
      {zone ? (
        <Pressable
          onPress={() => { tapHaptic("light"); setPlantNowOnly((v) => !v); }}
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, borderRadius: 999, paddingVertical: 10, backgroundColor: plantNowOnly ? "#5cff89" : "rgba(92, 255, 137, 0.1)", borderWidth: 1, borderColor: plantNowOnly ? "#5cff89" : "rgba(92, 255, 137, 0.3)" }}
        >
          <Text style={{ color: plantNowOnly ? "#07120b" : "#8effab", fontSize: 14, fontWeight: "900" }}>
            {plantNowOnly ? t("plants.showingPlantableNow") : `🌱 What can I grow now in Zone ${zone}?`}
          </Text>
        </Pressable>
      ) : null}
      {/* Difficulty filter — horizontal scroll keeps it to one clean row (no ragged wrap) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }} contentContainerStyle={{ gap: 8, paddingRight: 4 }}>
        {["All", "Easy", "Medium", "Hard"].map((d) => {
          const active = plantDifficultyFilter === d;
          const icon = d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : d === "Hard" ? "🔴" : "";
          return (
            <Pressable
              key={d}
              onPress={() => { tapHaptic("light"); setPlantDifficultyFilter(d); }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={d === "All" ? t("plants.showAllDifficulties") : `Filter by ${d} difficulty`}
              style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.1)" }}
            >
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{icon ? icon + " " : ""}{d}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {/* Attribute filters (backed by authored plant details) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 8, paddingRight: 4 }}>
        {ATTR_FILTERS.map((a) => {
          const active = plantAttrFilters.includes(a.key);
          return (
            <Pressable
              key={a.key}
              onPress={() => toggleAttr(a.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={active ? `Remove ${a.label} filter` : `Filter by ${a.label}`}
              style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: active ? "#5cff89" : "rgba(255, 255, 255, 0.1)" }}
            >
              <Text style={{ color: active ? "#07120b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{a.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {/* Sort mode */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 10, paddingBottom: 2 }}>
        {[
          { id: "smart", label: t("plants.smart") },
          { id: "az", label: "A–Z" },
          { id: "harvest", label: t("plants.fastestHarvest") },
          { id: "difficulty", label: t("plants.difficulty") },
        ].map((s) => {
          const active = plantSortMode === s.id;
          return (
            <Pressable
              key={s.id}
              onPress={() => { tapHaptic("light"); setPlantSortMode(s.id); }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Sort by ${s.label.replace(/^[^ ]+ /, "")}`}
              style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: active ? "rgba(255, 216, 107, 0.16)" : "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: active ? "#ffd86b" : "rgba(255, 255, 255, 0.1)" }}
            >
              <Text style={{ color: active ? "#ffd86b" : "#d7ebdc", fontSize: 12, fontWeight: "900" }}>{s.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {comparePlants.length === 2 ? (
        <View style={styles.compareCard}>
          <IconText label={t("plants.plantComparison")} style={styles.compareTitle} />
          {(() => {
            const left = produceData.find((plant) => plant.name === comparePlants[0]);
            const right = produceData.find((plant) => plant.name === comparePlants[1]);
            if (!left || !right) return null;
            return (
              <>
                <View style={styles.compareRow}>
                  <Text style={styles.comparePlantName}>{left.name}</Text>
                  <Text style={styles.compareVs}>VS</Text>
                  <Text style={styles.comparePlantName}>{right.name}</Text>
                </View>
                {[
                  ["Difficulty", getPlantDifficulty(left).label, getPlantDifficulty(right).label],
                  ["Harvest", getHarvestCountdown(left), getHarvestCountdown(right)],
                  ["Zones", `${left.minZone}-${left.maxZone}`, `${right.minZone}-${right.maxZone}`],
                  ["Type", normalizeType(left.type, left.name), normalizeType(right.type, right.name)],
                ].map(([label, lv, rv]) => (
                  <View key={label} style={styles.compareStatRow}>
                    <Text style={styles.compareLabel}>{label}</Text>
                    <Text style={styles.compareValue}>{lv}</Text>
                    <Text style={styles.compareValue}>{rv}</Text>
                  </View>
                ))}
                <Pressable onPress={() => setComparePlants([])} style={styles.compareClearButton}>
                  <Text style={styles.compareClearText}>{t("plants.clearComparison")}</Text>
                </Pressable>
              </>
            );
          })()}
        </View>
      ) : comparePlants.length === 1 ? (
        <View style={styles.compareHintCard}>
          <Text style={styles.compareHintText}>
            {t("plants.selectOneMorePlantTo")}
            {comparePlants[0]}
            {"."}
          </Text>
        </View>
      ) : null}

      {selectMode ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, padding: 10, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.3)", marginBottom: 8 }}>
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", flex: 1, paddingLeft: 4 }}>{bulkSel.length} selected</Text>
          <Pressable onPress={bulkSave} disabled={!bulkSel.length} style={{ backgroundColor: bulkSel.length ? "#5cff89" : "rgba(255, 255, 255, 0.08)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 }}>
            <Text style={{ color: bulkSel.length ? "#07120b" : "#8fbf9d", fontSize: 12, fontWeight: "900" }}>Save {bulkSel.length || ""}</Text>
          </Pressable>
          <Pressable onPress={bulkCompare} disabled={bulkSel.length !== 2} style={{ backgroundColor: bulkSel.length === 2 ? "rgba(255, 216, 107, 0.16)" : "rgba(255, 255, 255, 0.08)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: bulkSel.length === 2 ? "#ffd86b" : "transparent" }}>
            <Text style={{ color: bulkSel.length === 2 ? "#ffd86b" : "#8fbf9d", fontSize: 12, fontWeight: "900" }}>Compare</Text>
          </Pressable>
          <Pressable onPress={exitSelect} style={{ paddingHorizontal: 6, paddingVertical: 10 }}>
            <Text style={{ color: "#8fbf9d", fontSize: 12, fontWeight: "900" }}>Cancel</Text>
          </Pressable>
        </View>
      ) : filteredPlants.length > 0 ? (
        <Pressable onPress={() => setSelectMode(true)} accessibilityRole="button" style={{ alignSelf: "flex-end", flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "rgba(255, 255, 255, 0.06)", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}>
          <IconText label={t("plants.selectMultiple")} style={{
  color: "#8effab",
  fontSize: 12,
  fontWeight: "900"
}} />
        </Pressable>
      ) : null}

      <View style={styles.plantList}>
       {filteredPlants.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>{t("plants.noPlantsFound")}</Text>
            <Text style={styles.emptyStateText}>
              {plantSearch
                ? `Nothing matches "${plantSearch}". Try a different name or clear your search.`
                : selectedType !== "All"
                ? `No ${selectedType.toLowerCase()} match right now. Try viewing all plants instead.`
                : t("plants.noPlantsMatchTheCurrent")}
            </Text>
            {plantSearch && getSearchSuggestions(plantSearch).length > 0 ? (
              <View style={{ marginTop: 16, width: "100%" }}>
                <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", marginBottom: 10, textAlign: "center" }}>{t("plants.didYouMean")}</Text>
                <View style={{ gap: 8 }}>
                  {getSearchSuggestions(plantSearch).map((item) => {
                    const img = resolvePlantImageSource(item);
                    return (
                      <Pressable
                        key={`suggest-${item.name}`}
                        onPress={() => { setPlantSearch(""); setSelectedType("All"); openPlantFromList(item); }}
                        style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(92, 255, 137, 0.08)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.2)" }}
                      >
                        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                        </View>
                        <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "900", flex: 1 }}>{item.name}</Text>
                        <Text style={{ color: "#8effab", fontSize: 20, fontWeight: "900" }}>›</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
            {(plantSearch || selectedType !== "All" || plantAttrFilters.length) ? (
              <Pressable
                onPress={() => { setPlantSearch(""); setSelectedType("All"); setPlantAttrFilters([]); }}
                style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingHorizontal: 18, paddingVertical: 12 }}
              >
                <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 12 }}>{t("plants.showAllPlants")}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
               {filteredPlants.slice(0, listVisibleCount).map((item) => {
          const sel = bulkSel.includes(item.name);
          return (
            <View key={item.name} style={{ position: "relative" }}>
              <GlowPlantCard plant={item} weather={weather} zone={zone} theme={theme} isSaved={savedPlants.includes(item.name)} isCompared={comparePlants.includes(item.name)} isFollowed={followedPlants.includes(item.name)} isInGarden={gardenPlantNames?.has(item.name)} isSnoozed={snoozedPlants[item.name] === getDateKey(new Date(Date.now() + 86400000))} wateredDate={wateredPlants[item.name]} wateredPlants={wateredPlants} wateringHistory={wateringHistory} onOpen={() => selectMode ? toggleBulk(item.name) : openPlantFromList(item)} onSave={() => toggleSavedPlant(item.name)} onCompare={() => toggleComparePlant(item.name)} onFollow={() => toggleFollowPlant(item.name)} onAddToGarden={() => addPlantToGarden(item.name)} onWater={() => markPlantWatered(item.name)} onSnooze={() => snoozePlantWatering(item.name)} />
              {selectMode ? (
                <Pressable
                  onPress={() => toggleBulk(item.name)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: sel }}
                  style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 24, borderWidth: sel ? 2.5 : 0, borderColor: "#5cff89", backgroundColor: sel ? "rgba(92, 255, 137, 0.12)" : "rgba(4, 20, 12, 0.16)", alignItems: "flex-end", padding: 12 }}
                >
                  <View style={{ width: 30, height: 30, borderRadius: 16, backgroundColor: sel ? "#5cff89" : "rgba(4, 20, 12, 0.6)", borderWidth: 2, borderColor: sel ? "#5cff89" : "rgba(255, 255, 255, 0.6)", alignItems: "center", justifyContent: "center" }}>
                    {sel ? <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>✓</Text> : null}
                  </View>
                </Pressable>
              ) : null}
            </View>
          );
        })}
        {!premiumUnlocked && filteredPlants.length > FREE_PLANT_LIMIT ? (
          <Pressable
            onPress={onViewPremium}
            accessibilityRole="button"
            accessibilityLabel="Unlock all plants with Premium"
            style={{ marginTop: 14, backgroundColor: "rgba(255, 216, 107, 0.16)", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, alignItems: "center", borderWidth: 1, borderColor: "#ffd86b" }}
          >
            <Text style={{ color: "#ffd86b", fontWeight: "900", fontSize: 14 }}>
              🔒 Unlock all {filteredPlants.length} plants with Premium
            </Text>
          </Pressable>
        ) : filteredPlants.length > plantsVisibleCount ? (
          <Pressable
            onPress={() => setPlantsVisibleCount((c) => c + 20)}
            style={{ marginTop: 14, backgroundColor: "rgba(92, 255, 137, 0.1)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92, 255, 137, 0.24)" }}
          >
            <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>
              {t("plants.showMorePlants")}{filteredPlants.length - plantsVisibleCount} {t("plants.more")}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  </>
  );
}
