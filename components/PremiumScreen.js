import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function PremiumScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.title}>Pocket Planter Premium</Text>
          <Text style={styles.subtitle}>
            Unlock advanced planting tools, frost tracking, premium insights,
            and smarter gardening.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What You Get</Text>

          <Text style={styles.feature}>🌱 Unlimited garden tracking</Text>
          <Text style={styles.feature}>📅 Smart planting calendar</Text>
          <Text style={styles.feature}>❄️ Frost date predictions</Text>
          <Text style={styles.feature}>🌦 Advanced weather insights</Text>
          <Text style={styles.feature}>📍 Zone-based recommendations</Text>
          <Text style={styles.feature}>⭐ Premium future updates</Text>
        </View>

        <View style={styles.pricingContainer}>
          <View style={styles.priceCard}>
            <Text style={styles.planName}>Monthly Premium</Text>

            <Text style={styles.price}>$2.99</Text>

            <Text style={styles.billing}>per month</Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start Monthly Plan</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.priceCard, styles.yearlyCard]}>
            <Text style={styles.bestValue}>BEST VALUE</Text>

            <Text style={styles.planName}>Yearly Premium</Text>

            <Text style={styles.price}>$36.00</Text>

            <Text style={styles.billing}>per year</Text>

            <Text style={styles.savings}>
              Save over 15% compared to monthly
            </Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start Yearly Plan</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Subscription automatically renews unless canceled at least 24 hours
          before the end of the current billing period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07130A',
  },

  hero: {
    paddingTop: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 14,
    fontSize: 16,
    color: '#B8C9BA',
    textAlign: 'center',
    lineHeight: 24,
  },

  card: {
    backgroundColor: '#102017',
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#24452D',
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 18,
  },

  feature: {
    fontSize: 16,
    color: '#D7E5D8',
    marginBottom: 14,
  },

  pricingContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 20,
  },

  priceCard: {
    backgroundColor: '#102017',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#24452D',
  },

  yearlyCard: {
    borderColor: '#7CFF8D',
    borderWidth: 2,
  },

  bestValue: {
    color: '#7CFF8D',
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 1,
  },

  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  price: {
    fontSize: 42,
    fontWeight: '900',
    color: '#7CFF8D',
    marginTop: 12,
  },

  billing: {
    fontSize: 16,
    color: '#B8C9BA',
    marginTop: 6,
  },

  savings: {
    marginTop: 10,
    color: '#7CFF8D',
    fontWeight: '600',
  },

  button: {
    marginTop: 24,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },

  footer: {
    color: '#7D8B7F',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
});