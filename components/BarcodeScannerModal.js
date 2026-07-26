import { useRef } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { NativeModuleGuard } from "./NativeModuleGuard";

// Camera-based seed-packet scanner. expo-camera is a native module, so on an
// older build (before the dev client is rebuilt) mounting the camera can throw —
// NativeModuleGuard catches that and shows a friendly note instead of crashing.

function CloseBar({ onClose, label }) {
  return (
    <View style={{ position: "absolute", top: 50, left: 16, right: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "900" }}>{label}</Text>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close scanner" style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 999, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "900" }}>✕</Text>
      </Pressable>
    </View>
  );
}

function ScannerBody({ onScanned, onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const handled = useRef(false);

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: "#07120b" }}><CloseBar onClose={onClose} label="Scan packet" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: "#07120b", alignItems: "center", justifyContent: "center", padding: 28 }}>
        <Text style={{ fontSize: 44, marginBottom: 14 }}>📷</Text>
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900", textAlign: "center" }}>Camera access needed</Text>
        <Text style={{ color: "#8fbf9d", fontSize: 13, fontWeight: "700", textAlign: "center", lineHeight: 19, marginTop: 8 }}>
          Allow the camera to scan a seed packet's barcode or QR code.
        </Text>
        <Pressable onPress={requestPermission} style={{ marginTop: 20, backgroundColor: "#5cff89", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 13 }}>
          <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>Allow camera</Text>
        </Pressable>
        <Pressable onPress={onClose} style={{ marginTop: 12 }}>
          <Text style={{ color: "#8fbf9d", fontSize: 13, fontWeight: "800" }}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "datamatrix"] }}
        onBarcodeScanned={({ data }) => {
          if (handled.current || !data) return;
          handled.current = true;
          onScanned(String(data));
        }}
      />
      {/* aiming frame */}
      <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 220, height: 220, borderRadius: 20, borderWidth: 3, borderColor: "rgba(92,255,137,0.9)" }} />
        <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "800", marginTop: 16, backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}>
          Point at the packet's barcode or QR
        </Text>
      </View>
      <CloseBar onClose={onClose} label="Scan packet" />
    </View>
  );
}

export function BarcodeScannerModal({ visible, onScanned, onClose, theme }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <NativeModuleGuard
        fallback={
          <View style={{ flex: 1, backgroundColor: "#07120b", alignItems: "center", justifyContent: "center", padding: 28 }}>
            <Text style={{ fontSize: 44, marginBottom: 14 }}>📷</Text>
            <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "900", textAlign: "center" }}>Scanning needs the latest build</Text>
            <Text style={{ color: "#8fbf9d", fontSize: 13, fontWeight: "700", textAlign: "center", lineHeight: 19, marginTop: 8 }}>
              Update to the newest version of Pocket Planter to scan packets. You can still add items by typing them in.
            </Text>
            <Pressable onPress={onClose} style={{ marginTop: 20, backgroundColor: "#5cff89", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 13 }}>
              <Text style={{ color: "#07120b", fontSize: 14, fontWeight: "900" }}>Got it</Text>
            </Pressable>
          </View>
        }
      >
        {visible ? <ScannerBody onScanned={onScanned} onClose={onClose} /> : <View style={{ flex: 1, backgroundColor: "#07120b" }} />}
      </NativeModuleGuard>
    </Modal>
  );
}
