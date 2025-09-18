This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Android Development Environment Setup

This project has been configured for Android development with the following setup:

## Environment Configuration

### JDK Setup

- **JDK Version**: OpenJDK 17 (Temurin)
- **JAVA_HOME**: `/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home`
- **Verification**: Run `java -version` and `javac -version` to confirm JDK 17 is active

### Android SDK Configuration

- **ANDROID_HOME**: `/Users/huangjien/Library/Android/sdk`
- **SDK Tools**: Updated to latest versions including build-tools and platform-tools
- **Target SDK**: Android API level 34 (configurable in `android/app/build.gradle`)

### Environment Variables

Add these to your shell profile (`.zshrc`, `.bash_profile`, etc.):

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
export ANDROID_HOME=/Users/huangjien/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

## Build System Status

- ✅ Gradle build system configured and working
- ✅ Android app builds successfully (`./gradlew assembleDebug`)
- ✅ Basic React Native Android setup complete

## Known Issues and Solutions

### react-native-track-player Compatibility

**Issue**: The `react-native-track-player` library (v4.1.2) has Kotlin compilation issues with the current Android setup.

**Symptoms**:

- Build fails with `compileDebugKotlin` task errors
- Kotlin null safety compilation warnings

**Temporary Solutions**:

1. **For development without audio features**: Remove the dependency temporarily

   ```bash
   npm uninstall react-native-track-player
   ```

2. **For production**: Consider upgrading to a newer version when available or implementing custom audio handling

**Status**: The app builds and runs successfully without this dependency. Core functionality remains intact.

## Running the Android App

### Prerequisites

- Android emulator running, or
- Physical Android device connected via USB with USB debugging enabled

### Build Commands

```bash
# Clean and build
cd android && ./gradlew clean && ./gradlew assembleDebug

# Run on device/emulator
npx react-native run-android
```

### Verification Steps

1. Ensure emulator is running: `emulator -list-avds`
2. Check connected devices: `adb devices`
3. Build the app: `cd android && ./gradlew assembleDebug`
4. Run the app: `npx react-native run-android`

## Development Notes

- The project uses Kotlin for Android native code
- Auto-linking is configured for React Native dependencies
- Gradle wrapper is included for consistent builds across environments

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Additional Android Troubleshooting

### Common Issues

1. **JDK Version Mismatch**: Ensure JDK 17 is active using `java -version`
2. **Android SDK Path**: Verify `ANDROID_HOME` points to correct SDK location
3. **Emulator Not Found**: Start an Android emulator before running `npx react-native run-android`
4. **Build Tools**: Update Android SDK build-tools if encountering compilation errors

### Useful Commands

```bash
# Check Java version
java -version

# List available emulators
emulator -list-avds

# Check connected devices
adb devices

# Clean React Native cache
npx react-native start --reset-cache
```

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
