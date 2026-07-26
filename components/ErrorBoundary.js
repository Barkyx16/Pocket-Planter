import React from "react";
import { View, Text, Pressable } from "react-native";
import { t } from "../lib/i18n";

// Catches render/lifecycle errors anywhere below it so a single failing component
// shows a friendly fallback + retry instead of a blank white screen.
export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log("ErrorBoundary caught:", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: "#07120b", alignItems: "center", justifyContent: "center", padding: 28 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🌱</Text>
          <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "900", textAlign: "center", marginBottom: 10 }}>
            {t("errorBoundary.somethingWentWrong")}
          </Text>
          <Text style={{ color: "#d7ebdc", fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 24 }}>
            {t("errorBoundary.pocketPlanterHitAnUnexpected")}
          </Text>
          <Pressable
            onPress={() => this.setState({ hasError: false })}
            style={{ backgroundColor: "#5cff89", borderRadius: 16, paddingHorizontal: 24, paddingVertical: 14 }}
          >
            <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 14 }}>{t("errorBoundary.tryAgain")}</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
