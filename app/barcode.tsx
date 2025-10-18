// app/barcode.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Image } from "expo-image";

export default function BarcodeScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Barkod",
          headerTintColor: "#FEFEFD",
          headerStyle: { backgroundColor: "#1C1D18" },
        }}
      />
      <View style={styles.screen}>
        <Image
          source={require("../assets/images/barkoddd.jpg")}
          style={styles.bigBarcode}
          contentFit="contain"
          transition={120}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center", padding: 24 },
  bigBarcode: { width: "100%", height: "60%" },
});
