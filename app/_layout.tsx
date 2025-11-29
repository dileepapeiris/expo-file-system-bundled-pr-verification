/**
 * ------------------------------------------------------------
 *  Owner    : K. Dileepa Thushan Peiris
 *  GitHub   : https://github.com/dileepapeiris
 *  Created  : 2025-11-29
 * ------------------------------------------------------------
 */

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

