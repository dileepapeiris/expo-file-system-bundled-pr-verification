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

  /**
   * TEST 2: The Native Way (Paths.bundle)
   * This requires manual file placement in android/ios folders.
   * If you haven't moved a file there, this test will log that the file is missing.
   */
  const testNativeBundle = async () => {
    try {
      log("🟣 Starting Paths.bundle test...");
      log(`Bundle Path: ${Paths.bundle}`);

      const fileName = "example.txt";
      const file = new File(Paths.bundle, fileName);

      if (file.exists) {
        log(`✅ Found '${fileName}' in native bundle!`);

        const content = await file.text();
        log(`File Content: "${content}"`);
      } else {
        log(`⚠️ File '${fileName}' not found in native bundle.`);
        log("ℹ️ To fix this test:");
        log('1. Create "example.txt" with some text inside.');
        log('2. Android: Move to "android/app/src/main/assets/"');
        log('3. iOS: Add to Xcode project root & check "Target Membership"');
        log("4. Rebuild the native app (npx expo run:android)");
      }
    } catch (error: any) {
      log(`❌ Error in native bundle test: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FileSystem Asset Test</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Test 1: expo-asset (Standard)" onPress={testExpoAsset} />
        <View style={styles.spacer} />
        <Button
          title="Test 2: Paths.bundle (Native)"
          color="#841584"
          onPress={testNativeBundle}
        />
        <View style={styles.spacer} />
        <Button title="Clear Logs" color="gray" onPress={() => setLogs([])} />
      </View>

      <Text style={styles.logLabel}>Logs:</Text>
      <ScrollView
        style={styles.logsContainer}
        contentContainerStyle={styles.logsContent}
      >
        {logs.length === 0 ? (
          <Text style={styles.placeholder}>Press a button to test...</Text>
        ) : (
          logs.map((l, i) => (
            <Text key={i} style={styles.logText}>
              {l}
            </Text>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 20,
  },
  spacer: {
    height: 10,
  },
  logLabel: {
    marginLeft: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  logsContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  logsContent: {
    padding: 10,
  },
  logText: {
    color: "#0f0",
    fontFamily: "monospace",
    fontSize: 12,
    marginBottom: 4,
  },
  placeholder: {
    color: "#666",
    fontStyle: "italic",
  },
});
