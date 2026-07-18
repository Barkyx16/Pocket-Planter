import { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../styles";
import { analyzePlantHealth } from "../core";

export function PlantHealthAnalyzerCard({ theme }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  async function pickAndAnalyze() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photos Permission Needed", "Allow photo access to analyze plant health.");
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });
    if (picked.canceled) return;
    const uri = picked.assets?.[0]?.uri;
    if (!uri) return;

    setImageUri(uri);
    setAnalyzing(true);
    setResult(null);
    const analysis = await analyzePlantHealth(uri);
    setAnalyzing(false);
    setResult(analysis);
  }

  const getScoreColor = (score) => {
    if (score >= 8) return "#5cff89";
    if (score >= 5) return "#ffd86b";
    return "#ff7b7b";
  };

  const getUrgencyColor = (urgency) => {
    if (urgency === "high") return "#ff7b7b";
    if (urgency === "medium") return "#ffd86b";
    return "#5cff89";
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: "#6bc7ff" }]}>
      <Text style={styles.cardEyebrow}>🤖 AI PLANT DOCTOR</Text>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Plant Health Analyzer</Text>
      <Text style={[styles.cardText, { color: theme.secondaryText }]}>
        Take a photo of any plant and get an instant AI health diagnosis with fixes.
      </Text>

      <Pressable onPress={pickAndAnalyze} disabled={analyzing}
        style={[styles.primaryButton, { marginTop: 16, opacity: analyzing ? 0.7 : 1 }]}>
        <Text style={styles.primaryButtonText}>
          {analyzing ? "🔍 Analyzing..." : "📸 Analyze a Plant"}
        </Text>
      </Pressable>

      {imageUri && (
        <Image source={{ uri: imageUri }}
          style={{ width: "100%", height: 200, borderRadius: 18, marginTop: 16 }}
          resizeMode="cover" />
      )}

      {analyzing && (
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={{ color: "#6bc7ff", fontSize: 15, fontWeight: "900" }}>
            🌿 Diagnosing your plant...
          </Text>
        </View>
      )}

      {result && !analyzing && (
        <View style={{ marginTop: 16, gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14,
            backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 20, padding: 16,
            borderWidth: 1, borderColor: `${getScoreColor(result.healthScore)}40` }}>
            <Text style={{ fontSize: 42, fontWeight: "900",
              color: getScoreColor(result.healthScore) }}>{result.healthScore}/10</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "900" }}>
                {result.plantName}
              </Text>
              <Text style={{ color: result.healthy ? "#5cff89" : "#ff7b7b",
                fontSize: 14, fontWeight: "900", marginTop: 3 }}>
                {result.healthy ? "✅ Healthy" : "⚠️ Needs Attention"}
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: "rgba(107,199,255,0.10)", borderRadius: 18,
            padding: 14, borderWidth: 1, borderColor: "rgba(107,199,255,0.25)" }}>
            <Text style={{ color: "#6bc7ff", fontSize: 12, fontWeight: "900",
              marginBottom: 6 }}>🔬 DIAGNOSIS</Text>
            <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "700",
              lineHeight: 21 }}>{result.diagnosis}</Text>
          </View>

          {result.issues?.length > 0 && (
            <View style={{ backgroundColor: "rgba(255,123,123,0.08)", borderRadius: 18,
              padding: 14, borderWidth: 1, borderColor: "rgba(255,123,123,0.22)" }}>
              <Text style={{ color: "#ff7b7b", fontSize: 12, fontWeight: "900",
                marginBottom: 8 }}>⚠️ ISSUES DETECTED</Text>
              {result.issues.map((issue, i) => (
                <Text key={i} style={{ color: "#ffd5d5", fontSize: 13, fontWeight: "700",
                  marginBottom: 4, lineHeight: 19 }}>• {issue}</Text>
              ))}
            </View>
          )}

          {result.fixes?.length > 0 && (
            <View style={{ backgroundColor: "rgba(92,255,137,0.08)", borderRadius: 18,
              padding: 14, borderWidth: 1, borderColor: "rgba(92,255,137,0.22)" }}>
              <Text style={{ color: "#5cff89", fontSize: 12, fontWeight: "900",
                marginBottom: 8 }}>💚 HOW TO FIX IT</Text>
              {result.fixes.map((fix, i) => (
                <Text key={i} style={{ color: "#d7ebdc", fontSize: 13, fontWeight: "700",
                  marginBottom: 4, lineHeight: 19 }}>✓ {fix}</Text>
              ))}
            </View>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10,
            backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 12,
            borderWidth: 1, borderColor: `${getUrgencyColor(result.urgency)}30` }}>
            <Text style={{ color: getUrgencyColor(result.urgency), fontSize: 13,
              fontWeight: "900" }}>
              ⚡ Urgency: {result.urgency?.toUpperCase()}
            </Text>
          </View>

          <Pressable onPress={() => { setResult(null); setImageUri(null); }}
            style={{ borderRadius: 16, paddingVertical: 12, alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)" }}>
            <Text style={{ color: "#d7ebdc", fontWeight: "900" }}>Analyze Another Plant</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
