/**
 * ------------------------------------------------------------
 *  Owner    : K. Dileepa Thushan Peiris
 *  GitHub   : https://github.com/dileepapeiris
 *  Created  : 2025-11-29
 * ------------------------------------------------------------
 */

import { Asset } from "expo-asset";
import { File, Paths } from "expo-file-system";
import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev,
    ]);
    console.log(message);
  };

  /**
   * TEST 1: The Standard Way (expo-asset)
   * This should work in Expo Go and Development Builds immediately.
   */
  const testExpoAsset = async () => {
    try {
      log("🔵 Starting expo-asset test...");

      // 1. Resolve asset (using default icon.png present in new projects)
      // Note: You can replace this with any file in your JS structure
      const asset = Asset.fromModule(require("../../assets/images/icon.png"));
      log("Asset resolved from module.");

      // 2. Download/Ensure local existence
      await asset.downloadAsync();

      if (!asset.localUri) {
        throw new Error("Asset localUri is null");
      }
      log(`Asset ready at: ${asset.localUri}`);

      // 3. Use File System to read it
      const file = new File(asset.localUri);

      // Verify existence
      if (file.exists) {
        log(`File exists! Size: ${file.size} bytes`);

        // Read as bytes (ArrayBuffer equivalent)
        const bytes = file.bytes();
        log(`Read ${bytes} bytes successfully.`);

        // (Optional) Read as base64 or text if it was a text file
        // const content = file.text();
      } else {
        log("File does not exist at localUri.");
      }
    } catch (error: any) {
      log(`Error in expo-asset test: ${error.message}`);
    }
  };

