import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { AuthProvider } from "../providers/AuthProvider";

/**
 * Root layout that wraps the entire app with AuthProvider
 * This makes auth context available to all routes
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: "#1C1D18" }}>
        <StatusBar style="light" backgroundColor="#1C1D18" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#1C1D18" },
          }}
        />
      </View>
    </AuthProvider>
  );
}
