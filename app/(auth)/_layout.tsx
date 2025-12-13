import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, router } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

/**
 * Layout for authentication routes (login, register)
 * These routes are publicly accessible and don't require authentication
 * 
 * If user is already authenticated, redirect them to the app
 */
export default function AuthLayout() {
  const { session, authInitializing } = useAuth();

  useEffect(() => {
    // Wait for auth to finish initializing
    if (authInitializing) {
      return;
    }

    // If user is already authenticated, redirect to app
    if (session) {
      router.replace("/(app)");
    }
  }, [session, authInitializing]);

  // Show loading screen while auth is initializing
  if (authInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgba(250, 240, 67, 1)" />
      </View>
    );
  }

  // If user is authenticated, show loading (redirect will happen)
  if (session) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgba(250, 240, 67, 1)" />
      </View>
    );
  }

  // Render auth routes for unauthenticated users
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1C1D18" },
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1D18",
  },
});

