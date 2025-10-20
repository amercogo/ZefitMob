// components/BarcodeNavBar.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onPress?: () => void;     // šta se desi kad klikneš bar (npr. navigate)
  title?: string;           // naziv ispod barkoda (opcionalno)
};

export default function BarcodeNavBar({ onPress, title = "Barkod" }: Props) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 12); // malo prostora iznad home-indicatora

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View style={[styles.container, { paddingBottom: bottom }]}>
        <Pressable style={styles.card} onPress={onPress} android_ripple={{ color: "rgba(0,0,0,0.06)" }}>
          <Image
            source={require("../assets/images/barkodd.png")}
            style={styles.barcode}
            contentFit="contain"
            transition={120}
          />
          <Text style={styles.caption}>{title}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  card: {
    height: HEIGHT,
    backgroundColor: "rgba(250, 240, 67, 0.95)", // tvoja žuta
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    // blagi shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  barcode: { width: 180, height: 42, marginBottom: 6 },
  caption: { color: "#1C1D18", fontWeight: "700" },
});
