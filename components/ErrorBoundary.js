import React from "react";
import { View, Text, Pressable } from "react-native";

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
          <Text style={{ color: "#ffffff", fontSize: 22, fontWeight: "900", textAlign: "center", marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ color: "#d7ebdc", fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 24 }}>
            Pocket Planter hit an unexpected error. Your data is safe — tap below to try again.
          </Text>
          <Pressable
            onPress={() => this.setState({ hasError: false })}
            style={{ backgroundColor: "#5cff89", borderRadius: 16, paddingHorizontal: 24, paddingVertical: 14 }}
          >
            <Text style={{ color: "#07120b", fontWeight: "900", fontSize: 15 }}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
