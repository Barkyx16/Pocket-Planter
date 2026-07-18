import { Image, View } from "react-native";
import { SCREEN_WIDTH, weatherBuddyImage } from "../core";
import { CollapsibleCard } from "../components/CollapsibleCard";
import { ForecastCard } from "../components/ForecastCard";
import { FrostBanner } from "../components/FrostBanner";
import { GardenIntelligenceCard } from "../components/GardenIntelligenceCard";
import { LiveWeatherCard } from "../components/LiveWeatherCard";
import { ThrivingNearYouCard } from "../components/ThrivingNearYouCard";
import { WateringForecastCard } from "../components/WateringForecastCard";
import { WeatherTeaserCard } from "../components/WeatherTeaserCard";

export function WeatherTab({ frostAlertsOn, gardenMap, harvestTrackers, jumpToTab, openPlantFromList, premiumUnlocked, savedPlants, smartRecommendation, theme, wateredPlants, wateringHistory, weather, zone }) {
  return (
<View>
    <Image
      source={weatherBuddyImage}
  style={{
    width: "100%",
    height: SCREEN_WIDTH * 1.35,
    borderRadius: 24,
    marginBottom: 18,
  }}
      resizeMode="cover"
    />
    <FrostBanner theme={theme} weather={weather} frostAlertsOn={frostAlertsOn} />
    {premiumUnlocked ? (
      <CollapsibleCard theme={theme} storageKey="liveweather" title="🌤️ Live Garden Weather">
      <LiveWeatherCard
        theme={theme}
        weather={weather}
        recommendation={smartRecommendation}
        zone={zone}
        savedPlants={savedPlants}
        wateredPlants={wateredPlants}
        harvestTrackers={harvestTrackers}
      />
      </CollapsibleCard>
    ) : (
      <WeatherTeaserCard
        theme={theme}
        weather={weather}
        zone={zone}
        onUnlock={() => jumpToTab("premium")}
      />
    )}
    <CollapsibleCard theme={theme} storageKey="gardenintel" title="🧠 Garden Intelligence">
    <GardenIntelligenceCard
      theme={theme}
      weather={weather}
      zone={zone}
      savedPlants={savedPlants}
      wateredPlants={wateredPlants}
      gardenMap={gardenMap}
      harvestTrackers={harvestTrackers}
    />
    </CollapsibleCard>
   <CollapsibleCard theme={theme} storageKey="wateringforecast" title="💧 7-Day Watering Forecast">
    <WateringForecastCard
      theme={theme}
      savedPlants={savedPlants}
      wateringHistory={wateringHistory}
      wateredPlants={wateredPlants}
      weather={weather}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
    <CollapsibleCard theme={theme} storageKey="forecast" title="🌤️ Garden Weather This Week">
    <ForecastCard
      theme={theme}
      weather={weather}
      zone={zone}
      savedPlants={savedPlants}
      wateredPlants={wateredPlants}
    />
    </CollapsibleCard>
    <CollapsibleCard theme={theme} storageKey="thriving" title="🌍 Thriving Near You">
    <ThrivingNearYouCard
      theme={theme}
      zone={zone}
      onOpenPlant={openPlantFromList}
    />
    </CollapsibleCard>
  </View>
  );
}
