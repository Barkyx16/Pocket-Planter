import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import produceData from "../data/produceData";
import { styles } from "../styles";
import { MONTH_NAMES, PLANT_TYPES, SCREEN_WIDTH, getHarvestCountdown, getMonthEmoji, getPlantDifficulty, getPlantSeasonLabel, getSearchSuggestions, normalizeType, plantsBuddyImage, resolvePlantImageSource, tapHaptic } from "../core";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { GlowPlantCard } from "../components/GlowPlantCard";
import { PersonalPlantingCalendar } from "../components/PersonalPlantingCalendar";

export function PlantsTab({ comparePlants, filteredPlants, followedPlants, markPlantWatered, monthScrollDone, monthScrollRef, monthlyPicksY, monthlySuggestions, openPlantFromList, openPlantFromMonthly, plantSearch, plantsListY, plantsVisibleCount, recentPlants, savedPlants, scrollRef, selectedMonth, selectedType, setComparePlants, setPlantSearch, setPlantsVisibleCount, setSelectedMonth, setSelectedType, snoozePlantWatering, snoozedPlants, theme, toggleComparePlant, toggleFollowPlant, toggleSavedPlant, wateredPlants, wateringHistory, weather, zone }) {
  return (
<>
    <Image
      source={plantsBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
<View onLayout={(event) => { monthlyPicksY.current = event.nativeEvent.layout.y; }}>
      <CollapsibleCard theme={theme} storageKey="monthlypicks" title="📅 This Month's Picks!">
      <View style={styles.primaryFeatureAccentBar} />
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.smallJumpButton} onPress={() => { scrollRef.current?.scrollTo({ y: plantsListY.current, animated: true }); }}>
          <Text style={styles.smallJumpButtonText}>All plants</Text>
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
              <Text style={styles.calendarMonthEmoji}>{getMonthEmoji(monthNumber)}</Text>
              <Text style={[styles.calendarMonthText, { color: active ? "#ffd86b" : "#d7ebdc" }]}>{month.slice(0, 3)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {monthlySuggestions.length ? (
        <View style={styles.cleanPlantList}>
          {monthlySuggestions.map((item) => {
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
        </View>
      ) : (
        <View style={styles.emptyStateCard}>
          <Text style={styles.emptyStateIcon}>📅</Text>
          <Text style={styles.emptyStateTitle}>Nothing ideal for {MONTH_NAMES[selectedMonth - 1]}</Text>
          <Text style={styles.emptyStateText}>
            {zone
              ? `${MONTH_NAMES[selectedMonth - 1]} isn't a prime planting window for Zone ${zone}. Try another month above, or browse all plants to plan ahead.`
              : "Set your zip code on the Weather tab to unlock plant recommendations matched to your growing zone."}
          </Text>
</View>
      )}
      </CollapsibleCard>
    </View>
{savedPlants.length ? (
    <CollapsibleCard theme={theme} storageKey="plantingcalendar" title="📅 Your Planting Calendar">
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
          <Text style={{ color: "#8effab", fontSize: 12, fontWeight: "900", letterSpacing: 0.5, marginBottom: 8 }}>🕐 RECENTLY VIEWED</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {recentPlants.map((name) => {
              const item = produceData.find((p) => p.name === name);
              if (!item) return null;
              const img = resolvePlantImageSource(item);
              return (
                <Pressable
                  key={`recent-${name}`}
                  onPress={() => openPlantFromList(item)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999, paddingLeft: 6, paddingRight: 14, paddingVertical: 6, borderWidth: 1, borderColor: "rgba(142,255,171,0.16)" }}
                >
                  <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {img ? <Image source={img} style={{ width: 24, height: 24 }} resizeMode="contain" /> : <Text style={{ fontSize: 16 }}>🌱</Text>}
                  </View>
                  <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "800" }}>{name}</Text>
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
          placeholder="Search plants..."
          placeholderTextColor="#8fbf9d"
          style={styles.plantSearchInput}
        />
        {plantSearch ? (
          <Pressable onPress={() => setPlantSearch("")}>
            <Text style={styles.plantSearchClear}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      {comparePlants.length === 2 ? (
        <View style={styles.compareCard}>
          <Text style={styles.compareTitle}>⚔️ Plant Comparison</Text>
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
                  <Text style={styles.compareClearText}>Clear Comparison</Text>
                </Pressable>
              </>
            );
          })()}
        </View>
      ) : comparePlants.length === 1 ? (
        <View style={styles.compareHintCard}>
          <Text style={styles.compareHintText}>
            {"⚔️ Select one more plant to compare with "}
            {comparePlants[0]}
            {"."}
          </Text>
        </View>
      ) : null}

      <View style={styles.plantList}>
       {filteredPlants.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No plants found</Text>
            <Text style={styles.emptyStateText}>
              {plantSearch
                ? `Nothing matches "${plantSearch}". Try a different name or clear your search.`
                : selectedType !== "All"
                ? `No ${selectedType.toLowerCase()} match right now. Try viewing all plants instead.`
                : "No plants match the current filter."}
            </Text>
            {plantSearch && getSearchSuggestions(plantSearch).length > 0 ? (
              <View style={{ marginTop: 16, width: "100%" }}>
                <Text style={{ color: "#8effab", fontSize: 13, fontWeight: "900", marginBottom: 10, textAlign: "center" }}>Did you mean?</Text>
                <View style={{ gap: 8 }}>
                  {getSearchSuggestions(plantSearch).map((item) => {
                    const img = resolvePlantImageSource(item);
                    return (
                      <Pressable
                        key={`suggest-${item.name}`}
                        onPress={() => { setPlantSearch(""); setSelectedType("All"); openPlantFromList(item); }}
                        style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 16, padding: 12, borderWidth: 1, borderColor: "rgba(92,255,137,0.20)" }}
                      >
                        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#0e2414", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {img ? <Image source={img} style={{ width: 32, height: 32 }} resizeMode="contain" /> : <Text style={{ fontSize: 20 }}>🌱</Text>}
                        </View>
                        <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "900", flex: 1 }}>{item.name}</Text>
                        <Text style={{ color: "#8effab", fontSize: 22, fontWeight: "900" }}>›</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
            {(plantSearch || selectedType !== "All") ? (
              <Pressable
                onPress={() => { setPlantSearch(""); setSelectedType("All"); }}
                style={{ marginTop: 14, backgroundColor: "#5cff89", borderRadius: 16, paddingHorizontal: 18, paddingVertical: 11 }}
              >
                <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 13 }}>Show all plants</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
               {filteredPlants.slice(0, plantsVisibleCount).map((item) => (
          <GlowPlantCard key={item.name} plant={item} weather={weather} zone={zone} theme={theme} isSaved={savedPlants.includes(item.name)} isCompared={comparePlants.includes(item.name)} isFollowed={followedPlants.includes(item.name)} isSnoozed={snoozedPlants[item.name] === new Date(Date.now() + 86400000).toISOString().slice(0, 10)} wateredDate={wateredPlants[item.name]} wateredPlants={wateredPlants} wateringHistory={wateringHistory} onOpen={() => openPlantFromList(item)} onSave={() => toggleSavedPlant(item.name)} onCompare={() => toggleComparePlant(item.name)} onFollow={() => toggleFollowPlant(item.name)} onWater={() => markPlantWatered(item.name)} onSnooze={() => snoozePlantWatering(item.name)} />
        ))}
        {filteredPlants.length > plantsVisibleCount ? (
          <Pressable
            onPress={() => setPlantsVisibleCount((c) => c + 20)}
            style={{ marginTop: 14, backgroundColor: "rgba(92,255,137,0.10)", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(92,255,137,0.24)" }}
          >
            <Text style={{ color: "#8effab", fontWeight: "900", fontSize: 14 }}>
              Show more plants ({filteredPlants.length - plantsVisibleCount} more)
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  </>
  );
}
