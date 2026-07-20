import { memo } from "react";
import { View } from "react-native";
import { styles } from "../styles";
import { FloatingParticle } from "./FloatingParticle";

export const WeatherParticles = memo(function WeatherParticles({ weather }) {
  let mode = "firefly";
  let symbols = ["✨","🟢","✨","🟢","✨","🟢","✨","🟢"];
  if (weather?.precipChance >= 65) { mode = "rain"; symbols = ["💧","💧","💧","💧","💧","💧","💧","💧","💧","💧"]; }
  else if (weather?.minTempF <= 35) { mode = "snow"; symbols = ["❄️","❄️","❄️","❄️","❄️","❄️","❄️","❄️"]; }
  else if (weather?.maxTempF >= 95) { mode = "firefly"; symbols = ["✨","🌿","✨","🌿","✨","🌿","✨","🌿"]; }
  return (
    <View pointerEvents="none" style={styles.weatherParticleLayer}>
      {symbols.map((symbol, index) => <FloatingParticle key={`floating-particle-${symbol}-${index}`} symbol={symbol} index={index} mode={mode} />)}
    </View>
  );
})
