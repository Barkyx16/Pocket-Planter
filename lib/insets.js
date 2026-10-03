import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Bottom padding for a sheet that slides up from the bottom of a Modal.
//
// Expo SDK 54 draws Android edge to edge, and React Native then draws modal
// windows under the system bars too, so a sheet's last row sat beneath the
// navigation buttons. On Android the sheet adds the bottom inset to its own
// padding; iOS sheets already leave room for the home indicator.
export function useSheetBottomPadding(base) {
  const insets = useSafeAreaInsets();
  return base + (Platform.OS === "android" ? insets.bottom : 0);
}
