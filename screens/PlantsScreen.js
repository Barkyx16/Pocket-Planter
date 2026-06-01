import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function PlantsScreen({
  styles,
  theme,
  filteredPlants,
  openPlant,
}) {
  return (
    <View style={styles.sectionSpacing}>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.text },
        ]}
      >
        All Plants
      </Text>

      <Text
        style={[
          styles.sectionSubtitle,
          { color: theme.secondaryText },
        ]}
      >
        Browse your full plant collection.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          styles.horizontalScrollContent
        }
      >
        {filteredPlants.map((plant) => (
          <Pressable
            key={plant.name}
            style={[
              styles.plantCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => openPlant(plant)}
          >
            <Text style={styles.plantEmoji}>
              {plant.emoji}
            </Text>

            <Text
              style={[
                styles.plantName,
                { color: theme.text },
              ]}
            >
              {plant.name}
            </Text>

            <Text
              style={[
                styles.plantCategory,
                {
                  color: theme.secondaryText,
                },
              ]}
            >
              {plant.type}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}