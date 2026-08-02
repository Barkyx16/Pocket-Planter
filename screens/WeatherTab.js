import { View } from "react-native";
import { SCREEN_WIDTH, weatherBuddyImage } from "../core";
import { AdaptiveWateringCard } from "../components/AdaptiveWateringCard";
import { TabHero } from "../components/TabHero";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { ForecastCard } from "../components/ForecastCard";
import { FrostBanner } from "../components/FrostBanner";
import { GardenIntelligenceCard } from "../components/GardenIntelligenceCard";
import { LiveWeatherCard } from "../components/LiveWeatherCard";
import { RainfallLogCard } from "../components/RainfallLogCard";
import { WateringForecastCard } from "../components/WateringForecastCard";
import { WateringInsightsCard } from "../components/WateringInsightsCard";
import { WaterUsageCard } from "../components/WaterUsageCard";
import { ToggleSection } from "../components/ToggleSection";
import { WeatherTeaserCard } from "../components/WeatherTeaserCard";
import { t } from "../lib/i18n";

export function WeatherTab({ frostAlertsOn, gardenMap, harvestTrackers, jumpToTab, openPlantFromList, premiumUnlocked, savedPlants, setWateringAmounts, showUndoToast, smartRecommendation, theme, unitSystem, wateredPlants, wateringAmounts, wateringHistory, weather, zone }) {
  return (
<View>
    <TabHero
      tabKey="weather"
      source={weatherBuddyImage}
      style={{
        width: "100%",
        height: SCREEN_WIDTH * 0.6,
        borderRadius: 24,
        marginBottom: 18,
      }}
    />
    <FrostBanner theme={theme} weather={weather} frostAlertsOn={frostAlertsOn} unitSystem={unitSystem} />
    {premiumUnlocked ? (
      <CollapsibleCard theme={theme} storageKey="liveweather" title={t("weather.liveGardenWeather")} defaultOpen={true}>
      <LiveWeatherCard
        theme={theme}
        weather={weather}
        recommendation={smartRecommendation}
        zone={zone}
        savedPlants={savedPlants}
        wateredPlants={wateredPlants}
        harvestTrackers={harvestTrackers}
        unitSystem={unitSystem}
      />
      <ToggleSection label={t("weather.gardenWeatherThisWeek")} closeLabel={t("weather.closeWeeklyForecast")} accent="blue" marginTop={16}>
        <ForecastCard theme={theme} weather={weather} zone={zone} savedPlants={savedPlants} wateredPlants={wateredPlants} unitSystem={unitSystem} />
      </ToggleSection>
      <ToggleSection label={t("weather.gardenIntelligence")} closeLabel={t("weather.closeGardenIntelligence")} accent="blue" marginTop={10}>
        <GardenIntelligenceCard theme={theme} weather={weather} zone={zone} savedPlants={savedPlants} wateredPlants={wateredPlants} gardenMap={gardenMap} harvestTrackers={harvestTrackers} onOpenPlant={openPlantFromList} unitSystem={unitSystem} />
      </ToggleSection>
      </CollapsibleCard>
    ) : (
      <>
      <WeatherTeaserCard
        theme={theme}
        weather={weather}
        zone={zone}
        onUnlock={() => jumpToTab("premium")}
        unitSystem={unitSystem}
      />
      <CollapsibleCard theme={theme} storageKey="forecast" title={t("weather.gardenWeatherThisWeek")}>
        <ForecastCard theme={theme} weather={weather} zone={zone} savedPlants={savedPlants} wateredPlants={wateredPlants} unitSystem={unitSystem} />
      </CollapsibleCard>
      <CollapsibleCard theme={theme} storageKey="gardenintel" title={t("weather.gardenIntelligence")}>
        <GardenIntelligenceCard theme={theme} weather={weather} zone={zone} savedPlants={savedPlants} wateredPlants={wateredPlants} gardenMap={gardenMap} harvestTrackers={harvestTrackers} onOpenPlant={openPlantFromList} unitSystem={unitSystem} />
      </CollapsibleCard>
      </>
    )}
    <CollapsibleCard theme={theme} storageKey="wateringinsights" title={t("weather.wateringInsights")}>
      <WateringInsightsCard
        theme={theme}
        savedPlants={savedPlants}
        wateringHistory={wateringHistory}
        onOpenPlant={openPlantFromList}
        extraTabs={[
          { id: "schedule", label: t("weather.schedule"), node: <AdaptiveWateringCard theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} wateredPlants={wateredPlants} weather={weather} onOpenPlant={openPlantFromList} /> },
          { id: "rainfall", label: t("weather.rainfall"), node: <RainfallLogCard theme={theme} weather={weather} unitSystem={unitSystem} /> },
          { id: "usage", label: t("weather.usage"), node: <WaterUsageCard theme={theme} savedPlants={savedPlants} wateringAmounts={wateringAmounts} setWateringAmounts={setWateringAmounts} onUndoToast={showUndoToast} /> },
          { id: "forecast", label: t("weather.n7day"), node: <WateringForecastCard theme={theme} savedPlants={savedPlants} wateringHistory={wateringHistory} wateredPlants={wateredPlants} weather={weather} onOpenPlant={openPlantFromList} /> },
        ]}
      />
    </CollapsibleCard>
  </View>
  );
}
