import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Linking,
} from 'react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.icon]}>🌱</Text>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Manage Pocket Planter, theme, and premium access.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Appearance</Text>
            <Text style={[styles.cardSub, { color: theme.subtext }]}>
              Switch between light and dark mode.
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.rowText, { color: theme.text }]}>
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        <View style={[styles.premiumCard, { backgroundColor: darkMode ? '#0F3D2E' : '#E8F5E9' }]}>
          <Text style={styles.badge}>PREMIUM</Text>

          <Text style={[styles.premiumTitle, { color: darkMode ? '#FFFFFF' : '#12351F' }]}>
            Pocket Planter Premium
          </Text>

          <Text style={[styles.premiumSub, { color: darkMode ? '#D8F5DD' : '#2D5D38' }]}>
            Unlock the full gardening experience with smarter planning,
            frost tracking, zone-based recommendations, and premium tools.
          </Text>

          <View style={styles.featureBox}>
            <Text style={styles.feature}>🌿 Personalized planting schedules</Text>
            <Text style={styles.feature}>📅 Smart seasonal calendar</Text>
            <Text style={styles.feature}>❄️ Frost date guidance</Text>
            <Text style={styles.feature}>🌦 Weather-based growing insights</Text>
            <Text style={styles.feature}>📍 Zone and ZIP code recommendations</Text>
            <Text style={styles.feature}>⭐ Premium future updates</Text>
          </View>

          <TouchableOpacity style={styles.planButton}>
            <View>
              <Text style={styles.planTitle}>Monthly Premium</Text>
              <Text style={styles.planSub}>$2.99 / month</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.planButton, styles.yearlyPlan]}>
            <View>
              <Text style={styles.planTitle}>Yearly Premium</Text>
              <Text style={styles.planSub}>$36.00 / year</Text>
              <Text style={styles.saveText}>Best value</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueText}>Continue with Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.restore}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Support</Text>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() =>
              Linking.openURL('https://www.termsfeed.com/live/709830e1-27c1-494e-b096-19da17cf4c30')
            }
          >
            <Text style={[styles.rowText, { color: theme.text }]}>Privacy Policy</Text>
            <Text style={[styles.chevron, { color: theme.subtext }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow}>
            <Text style={[styles.rowText, { color: theme.text }]}>Contact Support</Text>
            <Text style={[styles.chevron, { color: theme.subtext }]}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: theme.subtext }]}>
          Subscriptions automatically renew unless canceled at least 24 hours
          before the end of the billing period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const darkTheme = {
  bg: '#07130A',
  card: '#102017',
  text: '#FFFFFF',
  subtext: '#B8C9BA',
  border: '#24452D',
};

const lightTheme = {
  bg: '#F4FAF3',
  card: '#FFFFFF',
  text: '#12351F',
  subtext: '#5C755F',
  border: '#D6E8D5',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 35,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 52,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 8,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 22,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  row: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 17,
    fontWeight: '700',
  },
  premiumCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 30,
    padding: 24,
    borderWidth: 2,
    borderColor: '#7CFF8D',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#7CFF8D',
    color: '#0F3D2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 14,
  },
  premiumTitle: {
    fontSize: 30,
    fontWeight: '900',
  },
  premiumSub: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  featureBox: {
    marginTop: 20,
    gap: 10,
  },
  feature: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  planButton: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearlyPlan: {
    backgroundColor: '#DFFFE4',
    borderWidth: 2,
    borderColor: '#7CFF8D',
  },
  planTitle: {
    color: '#0F3D2E',
    fontSize: 19,
    fontWeight: '900',
  },
  planSub: {
    color: '#1B5E20',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  saveText: {
    color: '#2E7D32',
    marginTop: 5,
    fontWeight: '900',
  },
  arrow: {
    fontSize: 34,
    color: '#1B5E20',
    fontWeight: '300',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    marginTop: 22,
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  restore: {
    color: '#D8F5DD',
    textAlign: 'center',
    marginTop: 18,
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  linkRow: {
    marginTop: 18,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 28,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 28,
    marginTop: 24,
  },
});