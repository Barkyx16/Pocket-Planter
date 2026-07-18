import { Dimensions, Image, View } from "react-native";
import { styles } from "../styles";
import { loadingScreenImage } from "../core";

export function LoadingScreen() {
  const { width, height } = Dimensions.get("window");
  const imageAspectRatio = 1290 / 1671; // your image's exact width/height ratio
  const imageHeight = width / imageAspectRatio;
  const scale = height / imageHeight;

  return (
    <View style={[styles.loadingWrapper, { backgroundColor: "#2d4a1e" }]}>
      <Image
        source={loadingScreenImage}
        style={{
          width: scale >= 1 ? width * scale : width,
          height: scale >= 1 ? height : imageHeight,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
