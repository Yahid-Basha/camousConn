import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(tabs)/explore"} />;
  }

  return <Stack >
    <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    {/* <Stack.Screen name="not-found" options={{ headerShown: false }} /> */}
  </Stack>;
}
