import { Redirect, Tabs } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Stack } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  <Stack >
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="rooms" options={{ headerShown: false }} />
    <Stack.Screen name="campusInfo" options={{ headerShown: false }} />
    <Stack.Screen name="dashboard" options={{ headerShown: false }} />
    <Stack.Screen name="not-found" options={{ headerShown: false }} />
  </Stack>;

  return (
    <>
      <SignedIn>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
        <Tabs.Screen
                name="rooms"
                options={{
                  title: 'Rooms',
                  tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} />
                  ),
                }}
              />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'speedometer' : 'speedometer-outline'} color={color} />
          ),
        }}
      />


<Tabs.Screen
        name="campusInfo"
        options={{
          title: 'Campus Info',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'information-circle' : 'information-circle-outline'} color={color} />
          ),
        }}
      />
        </Tabs>
      </SignedIn>
      <SignedOut>
        <Redirect href={"/sign-in"} />
      </SignedOut>
    </>
  );
}
