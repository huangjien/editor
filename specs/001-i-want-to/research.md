# Research & Decisions

This document outlines the technical decisions made to resolve ambiguities and define the technology stack for the Modern Fleet Android App, incorporating the request to use Tailwind CSS and CI/CD.

## 1. Local Identity and Security

- **Decision**: Use a third-party library like `react-native-keychain` for secure storage and `react-native-biometrics` for authentication.
- **Rationale**: The requirement `FR-009` needs clarification on the type of protection. These libraries provide access to the underlying native biometric and keychain/keystore functionalities, offering a secure and user-friendly authentication experience on Android.
- **Alternatives Considered**: Building a custom bridge to native modules was rejected due to complexity.

## 2. Technology Stack

- **Language**: **TypeScript**
  - **Rationale**: As mandated by the constitution, TypeScript will be used for type safety and improved developer experience.
- **Framework**: **React Native**
  - **Rationale**: The constitution specifies React Native. The user's request to use Tailwind CSS, a web technology, makes a web-based framework like React Native a suitable choice, as opposed to a fully native application.
- **Styling**: **NativeWind**
  - **Rationale**: To fulfill the user's request for Tailwind CSS, NativeWind will be used. It allows for Tailwind-like utility classes in a React Native environment, providing a familiar and efficient styling workflow.
- **GitHub Integration**: **Axios** or **fetch**
  - **Rationale**: Standard and reliable HTTP clients for making API calls to GitHub from a JavaScript environment.
- **Text-to-Speech**: **`react-native-tts`**
  - **Rationale**: This library provides a bridge to the native TTS engines on Android, allowing for control over speech rate and other parameters, meeting requirements `FR-004` and `FR-007`.
- **Bluetooth Controls & Audio Focus**: **`react-native-track-player`**
  - **Rationale**: This is a comprehensive audio library for React Native that handles background playback, media controls (including Bluetooth), and audio focus management out of the box. This addresses `FR-005` and the implicit requirement for audio focus management.
- **Storage**: **AsyncStorage**
  - **Rationale**: As specified in the constitution, AsyncStorage will be used for persisting settings (`FR-001`, `FR-006`, `FR-007`) and the current reading location (`FR-010`).
- **Testing**: **React Native Testing Library** and **Detox**
  - **Rationale**: This aligns with the constitution's mandate for a test-first development approach, covering both unit and end-to-end testing.

## 3. Constitutional Adherence

- **Decision**: The project will adhere to the constitution by using React Native.
- **Rationale**: The user's request to use Tailwind CSS makes React Native a more suitable choice than a fully native implementation. This aligns the project with the established constitutional guidelines.

## 4. CI/CD with GitHub Actions

- **Decision**: Implement CI/CD using GitHub Actions for automated builds, testing, and release management.
- **Rationale**: The user explicitly requested GitHub Actions for CI/CD. This will automate the process of generating the Android APK, renaming it to `editor.apk`, and publishing it to GitHub Releases.
- **Key Steps**:
    - Create a GitHub Actions workflow (`.github/workflows/android_build.yml`).
    - Configure the workflow to build the Android APK.
    - Add steps to rename the generated APK to `editor.apk`.
    - Implement a step to publish the `editor.apk` to GitHub Releases upon successful build of a specific branch or tag.
    - Securely manage GitHub token for releases.