/**
 * ------------------------------------------------------------
 *  Owner    : K. Dileepa Thushan Peiris
 *  GitHub   : https://github.com/dileepapeiris
 *  Created  : 2025-11-29s
 * ------------------------------------------------------------
 */

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { File, Paths } from "expo-file-system";
import { Asset } from "expo-asset";

export default function IOSTest() {
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
      log("🔵 Starting expo-asset test (iOS)...");

      // 1. Resolve asset
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
      } else {
        log("File does not exist at localUri.");
      }
    } catch (error: any) {
      log(`Error in expo-asset test: ${error.message}`);
    }
  };

  /**
   * TEST 2: The Native Way (Paths.bundle) - iOS Specific
   * UPDATED: Uses .copy() to fix iOS Permission Errors.
   */
  const testNativeBundle = async () => {
    try {
      log("🟣 Starting Paths.bundle test (iOS)...");

      const fileName = "example.txt";

      // 1. Reference the file in the read-only Bundle
      // iOS: .../FileSystemTest.app/example.txt
      const bundleFile = new File(Paths.bundle, fileName);

      if (bundleFile.exists) {
        log(`✅ Found '${fileName}' in iOS bundle!`);

        // 2. WORKAROUND: Copy to Cache
        // Direct reading from Bundle (bundleFile.text()) fails on iOS due to permissions.
        // We must copy it to a writable location (Paths.cache) first.
        const cacheFile = new File(Paths.cache, fileName);

        if (cacheFile.exists) {
          log("Deleting old file in cache...");
          cacheFile.delete();
        }

        log("Copying to cache to avoid permission errors...");
        bundleFile.copy(cacheFile);

        // 3. Read from the Cache file
        const content = await cacheFile.text();
        log(`File Content: "${content}"`);
      } else {
        log(` File '${fileName}' not found in iOS bundle.`);
        log(" To fix this test:");
        log('1. Create "example.txt" with some text inside.');
        log('2. iOS: Add to Xcode project root & check "Target Membership"');
        log("3. Rebuild the native app (npx expo run:ios)");
      }
    } catch (error: any) {
      log(`❌ Error in native bundle test: ${error.message}`);
    }
  };

