import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  NavigationContainer,
  createStackNavigator,
} from "@react-navigation/native";

import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import { Text, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AuthNavigator() {
  return (
    <Stack initialRouteName="(auth)">
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="Friends" options={{ headerShown: false }} />
      <Stack.Screen name="Messages" options={{ headerShown: false }} />

      <Stack.Screen
        name="chatpage"
        options={({ route, navigation }) => ({
          headerShown: true,
          title: route.params?.roomName || "Chat Page",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/options",
                  params: {
                    roomId: route.params?.roomId,
                    roomName: route.params?.roomName,
                  },
                })
              }
            >
              <Text style={{ marginRight: 10 }}>☰</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const tokenCache = {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <AuthNavigator />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
