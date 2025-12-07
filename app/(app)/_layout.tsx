import { useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { Stack, router, useSegments, usePathname } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

/**
 * Protected layout for authenticated app routes
 * 
 * This layout:
 * 1. Checks if auth is initializing → shows loading screen
 * 2. Checks if user has session → redirects to login if not
 * 3. Renders app routes if authenticated
 */
export default function AppLayout() {
  const { session, authInitializing } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for auth to finish initializing
    if (authInitializing) {
      return;
    }

    // If no session, redirect to login
    if (!session) {
      router.replace("/(auth)/login");
    }
  }, [session, authInitializing]);

  // Show loading screen while auth is initializing
  if (authInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgba(250, 240, 67, 1)" />
        <Text style={styles.loadingText}>Učitavanje...</Text>
      </View>
    );
  }

  // If no session, show loading (redirect will happen)
  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgba(250, 240, 67, 1)" />
      </View>
    );
  }

  // Render protected app routes
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
  loadingText: {
    color: "#FEFEFD",
    marginTop: 16,
    fontSize: 16,
  },
});

