import { Stack } from "expo-router";

/**
 * Layout for authentication routes (login, register)
 * These routes are publicly accessible and don't require authentication
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1C1D18" },
      }}
    />
  );
}

