import React from "react";
import { Text, View } from "react-native";

export default function GardenScreen({
  styles,
  theme,
  gardenHealth,
  gardenMap,
  savedPlants,
  GardenHealthCard,
  GardenPlannerMap,
  assignPlantToGardenSlot,
  clearGardenSlot,
}) {
  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Garden Planner Map!
        </Text>

        <Text
          style={[
            styles.cardText,
            {
              color: theme.secondaryText,
            },
          ]}
        >
          Tap a plot to assign a saved plant. Pocket Planter will warn you when
          nearby plants should not grow together.
        </Text>

        <GardenHealthCard
          theme={theme}
          gardenHealth={gardenHealth}
          gardenMap={gardenMap}
        />

        <GardenPlannerMap
          theme={theme}
          gardenMap={gardenMap}
          savedPlants={savedPlants}
          onAssign={assignPlantToGardenSlot}
          onClear={clearGardenSlot}
        />
      </View>
    </>
  );
}