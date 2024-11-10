import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthRoutesLayout() {

  return <Stack >
    <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    <Stack.Screen name="not-found" options={{ headerShown: false }} />
  </Stack>;
}
