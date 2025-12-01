# expo-file-system-bundled-pr-verification

This repository demonstrates and validates the documentation updates proposed in **[Expo PR #41272](https://github.com/expo/expo/pull/41272)**.

The guide below explains how to clone this example repo, run it on Android/iOS, and verify both methods of accessing files:

1.  **Using `expo-asset`** (Recommended)
2.  **Using `Paths.bundle`** (Advanced / Native-only)

---

## 1. Clone & Install

```bash
git clone https://github.com/dileepapeiris/expo-file-system-bundled-pr-verification.git
cd expo-file-system-bundled-pr-verification
npm install
```

---

## 2. Generate Native Projects

Before adding custom assets to the native bundles, we must generate the native folders (`android` and `ios`).

```bash
npx expo prebuild
```

> **Note:** We run this *before* the setup below. If you run `prebuild` again later, it may overwrite the manual changes made in the next steps (specifically the iOS Xcode configuration).

---

## 3. Prepare Native Projects (Required for `Paths.bundle`)

The `Paths.bundle` example will **NOT** work unless `example.txt` is manually added into the native bundle. Expo does not automatically copy JS project files into the native bundle structure.

### Android Setup
**Goal:** Place the file in `android/app/src/main/assets/`.

1.  If the assets folder does not exist, create it:
    ```bash
    mkdir -p android/app/src/main/assets
    ```

2.  Copy the example file:
    ```bash
    cp exampleFile/example.txt android/app/src/main/assets/
    ```

### iOS Setup
**Goal:** Add the file to the "Copy Bundle Resources" build phase in Xcode.

1.  Open the iOS project workspace:
    ```bash
    xed ios
    ```

2.  In Xcode:
    1.  Go to the **Project Navigator** (left sidebar).
    2.  Select **YourApp** (the root node).
    3.  Select the **Target** (YourApp).
    4.  Go to the **Build Phases** tab.
    5.  Expand **Copy Bundle Resources**.
    6.  Drag `example.txt` (from Finder) into this list.
    7.  *Ensure "Copy items if needed" is checked if prompted.*

This ensures the file becomes part of the raw iOS Main Bundle.

---

## 4. Running the Example App

Now that the native files are in place, run the app.

### Android
```bash
npx expo run:android
```

### iOS
```bash
npx expo run:ios
```

---

## 5. What You Can Test

The app contains two tabs (or buttons) corresponding to the two methods below.

### Method 1: `expo-asset` (Recommended)
This works automatically with files inside your JavaScript project structure. No native file placement is needed.

**Code Example:**
```ts
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';

const doSomethingWithAsset = async () => {
  // 1. Resolve asset from JS
  const asset = Asset.fromModule(require('./assets/images/icon.png'));
  
  // 2. Ensure downloaded
  await asset.downloadAsync();
  
  // 3. Read
  const file = new File(asset.localUri!);
  const content = await file.text();
  console.log(content);
};
```

**Expected Behavior:**
*   **Android:** Loads normally.
*   **iOS:** Loads normally.
*   **Source:** Uses the JS-included assets folder.

### Method 2: `Paths.bundle` (Advanced / Native Only)
This allows access to files explicitly added to the platform's native bundle (the steps you performed in Section 3).

**Code Example:**
```ts
import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

const readNativeBundle = async () => {
  const fileName = 'example.txt';
  
  // 1. Point to native bundle location
  const bundleFile = new File(Paths.bundleDirectory, fileName);

  if (!bundleFile.exists) {
    console.warn('File not found in native bundle');
    return;
  }

  let fileToRead = bundleFile;

  // 2. iOS Specific Handling (Bundle is Read-Only)
  if (Platform.OS === 'ios') {
    const documentFile = new File(Paths.document, fileName);
    // Must copy to document directory before reading
    await bundleFile.copy(documentFile);
    fileToRead = documentFile;
  }

  const content = await fileToRead.text();
  console.log(content);
};
```

**Expected Behavior:**
*   **Android:** Can read directly from `android/app/src/main/assets/`. `bundleDirectory` resolves correctly.
*   **iOS:** `Paths.bundleDirectory` points to the Main Bundle (read-only). The app logs a copy operation to `Paths.document`, then reads the file successfully.

---

## 6. Screen Recordings

The following table demonstrates the expected output for both methods on both platforms.

| Feature | Android | iOS |
| :--- | :--- | :--- |
| **Normal Assets**<br>*(expo-asset)* | <video src="https://github.com/user-attachments/assets/8bf10fc2-bd3a-4d22-a4bc-883746b80f32" controls width="380"></video> | <video src="https://github.com/user-attachments/assets/8d071381-a364-4627-a813-14041d2177ce" controls width="250"></video> |
| **Bundle Path**<br>*(Paths.bundle)* | <video src="https://github.com/user-attachments/assets/8153c0b7-ad7d-4951-afb1-1ab428ce37d0" controls width="380"></video> | <video src="https://github.com/user-attachments/assets/ff7976ab-5929-4c0a-b652-89db0d57c2d8" controls width="250"></video> |

---


## 7. Verification Checklist

If the documentation and implementation are correct, you should see:

- [ ] **`expo-asset` Tab:** Content loads correctly using `Asset.fromModule(require(...))`.
- [ ] **`Paths.bundle` Tab (Android):** Reads file directly from native assets.
- [ ] **`Paths.bundle` Tab (iOS):** Successfully copies the file from the bundle to documents, then reads it.

### Conclusion
This setup validates:
1.  The difference between JS-based assets (`expo-asset`) and native bundle assets.
2.  Why `bundleDirectory` does not point to standard JS assets.
3.  How to properly use `Paths.bundle` when working with files inside the native project structure.
