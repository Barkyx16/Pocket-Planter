import React from "react";
import {
  Image,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen({
  styles,
  theme,
  zip,
  setZip,
  normalizeZip,
  record,
  detectLocationAndZone,
  monthlySuggestions,
  MONTH_NAMES,
  selectedMonth,
  scrollRef,
  monthlyPicksY,
}) {
  return (
    <>
      <View style={styles.welcomeBuddyCard}>
        <Image
          source={require("../assets/welcome-buddy.png")}
          style={styles.welcomeBuddyImage}
          resizeMode="cover"
        />
      </View>

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
          Find your Garden Zone!
        </Text>

        <Text
          style={[
            styles.cardText,
            {
              color: theme.secondaryText,
            },
          ]}
        >
          Enter your ZIP code so Pocket Planter can match plants to your local
          growing zone.
        </Text>

        <TextInput
          value={zip}
          onChangeText={(value) => setZip(normalizeZip(value))}
          keyboardType="number-pad"
          maxLength={5}
          placeholder="Enter ZIP code"
          placeholderTextColor="#8fbf9d"
          style={[
            styles.input,
            {
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
        />

        <View style={styles.actionRow}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => Keyboard.dismiss()}
          >
            <Text style={styles.primaryButtonText}>Apply ZIP</Text>
          </Pressable>

          <Pressable
            style={[
              styles.secondaryButton,
              {
                borderColor: theme.border,
              },
            ]}
            onPress={detectLocationAndZone}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                {
                  color: theme.text,
                },
              ]}
            >
              Use location
            </Text>
          </Pressable>
        </View>

        {record ? (
          <View style={styles.zoneBanner}>
            <Text style={styles.zoneMini}>Your growing zone</Text>

            <Text style={styles.zoneBig}>Zone {record.zone}</Text>

            <Text style={styles.zoneDetails}>{record.zonetitle}</Text>

            <Pressable
              style={styles.zoneJumpButton}
              onPress={() => {
                scrollRef.current?.scrollTo({
                  y: monthlyPicksY.current,
                  animated: true,
                });
              }}
            >
              <Text style={styles.zoneJumpButtonText}>
                View {monthlySuggestions.length} plants for{" "}
                {MONTH_NAMES[selectedMonth - 1]} ↓
              </Text>
            </Pressable>
          </View>
        ) : zip.length === 5 ? (
          <Text style={styles.errorText}>
            Couldn’t find that ZIP in your zone file.
          </Text>
        ) : null}
      </View>
    </>
  );
}