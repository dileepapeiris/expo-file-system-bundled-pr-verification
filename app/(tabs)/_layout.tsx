/**
 * ------------------------------------------------------------
 *  Owner    : K. Dileepa Thushan Peiris
 *  GitHub   : https://github.com/dileepapeiris
 *  Created  : 2025-11-29
 * ------------------------------------------------------------
 */

import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="ios"
        options={{
          title: "iOS",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="apple.logo" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="android"
        options={{
          title: "Android",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="server.rack" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
