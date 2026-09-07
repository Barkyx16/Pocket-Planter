import { memo } from "react";
import { View } from "react-native";
import { styles } from "../styles";
import { FloatingParticle } from "./FloatingParticle";
import { FROST_THRESHOLD_F, HEAT_THRESHOLD_F } from "../core";

export const WeatherParticles = memo(function WeatherParticles({ weather }) {
  let mode = "firefly";
  let symbols = ["✨","🟢","✨","🟢","✨","🟢","✨","🟢"];
  if (weather?.precipChance >= 65) { mode = "rain"; symbols = ["💧","💧","💧","💧","💧","💧","💧","💧","💧","💧"]; }
  else if (weather?.minTempF <= FROST_THRESHOLD_F) { mode = "snow"; symbols = ["❄️","❄️","❄️","❄️","❄️","❄️","❄️","❄️"]; }
  else if (weather?.maxTempF >= HEAT_THRESHOLD_F) { mode = "firefly"; symbols = ["✨","🌿","✨","🌿","✨","🌿","✨","🌿"]; }
  return (
    <View pointerEvents="none" style={styles.weatherParticleLayer}>
      {symbols.map((symbol, index) => <FloatingParticle key={`floating-particle-${symbol}-${index}`} symbol={symbol} index={index} mode={mode} />)}
    </View>
  );
})
