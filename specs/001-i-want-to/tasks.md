# Tasks: Modern Fleet Android App

**Input**: Design documents from `/Users/huangjien/workspace/editor/specs/001-i-want-to/`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md

## Phase 3.1: Setup

- [x] T001: Initialize a new React Native project using the React Native CLI (`npx react-native init editor --template react-native-template-typescript`).
- [x] T002: [P] Install and configure NativeWind for Tailwind CSS support in the React Native project.
- [x] T003: [P] Install core dependencies: `react-native-track-player`, `react-native-tts`, `react-native-biometrics`, `react-native-keychain`, `axios`, and `@react-native-async-storage/async-storage`.
- [x] T004: [P] Set up ESLint, Prettier, and Husky for code quality and pre-commit hooks, following the project's constitution.
- [x] T005: Create the basic project structure with directories for `src/components`, `src/screens`, `src/services`, `src/navigation`, and `src/state`.
- [x] T005a: [P] Set up Detox for end-to-end testing.

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

- [x] T006: [P] Write a failing integration test (Detox) for the first-time setup and configuration flow described in `quickstart.md`.
- [x] T007: [P] Write a failing integration test (Detox) for fetching and viewing chapters.
- [x] T008: [P] Write a failing integration test (Detox) for the TTS and Bluetooth playback control flow.
- [x] T009: [P] Write a failing unit test (React Native Testing Library) for the Settings data model.

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T010: [P] Implement the data models for `Settings`, `Chapter`, and `User` in `src/state/models.ts` based on `data-model.md`.
- [x] T011: [P] Create a `SettingsService` in `src/services/SettingsService.ts` to handle saving and retrieving settings from AsyncStorage.
- [x] T012: [P] Implement the `GitHubService` in `src/services/GitHubService.ts` to fetch chapter lists and content from the specified repository.
- [x] T013: [P] Set up `react-native-track-player` service for background audio and media controls.
- [x] T014: Implement the biometric authentication flow using `react-native-biometrics` on app startup.
- [x] T015: [P] Create the basic UI for the `Landing`, `Index`, `About`, `Content`, and `Settings` screens in the `src/screens/` directory using NativeWind for styling.
- [x] T016: Implement the navigation between screens using React Navigation.

## Phase 3.4: Integration

- [x] T017: Integrate the `SettingsService` with the Settings screen to allow users to update their configuration.
- [x] T018: Integrate the `GitHubService` with the Index screen to display the list of chapters.
- [x] T019: Integrate the `GitHubService` with the Content screen to display the chapter content.
- [x] T020: Integrate `react-native-tts` and `react-native-track-player` in the Content screen to enable TTS playback.

## Phase 3.5: Polish

- [x] T021: [P] Write unit tests for all services and components.
- [x] T022: [P] Implement error handling for invalid GitHub configurations and network issues.
- [x] T023: [P] Ensure the app correctly handles audio focus changes.
- [x] T024: [P] Implement the functionality to remember the user's last reading position.
- [x] T025: Add internationalization support for the specified languages.

## Phase 3.6: CI/CD with GitHub Actions

- [x] T026: Create `.github/workflows/android_build.yml` for Android APK build.
- [x] T027: Configure the GitHub Actions workflow to build the Android APK.
- [x] T028: Add steps to rename the generated APK to `editor.apk` within the workflow.
- [x] T029: Implement a step to publish `editor.apk` to GitHub Releases upon successful build.
- [x] T030: Securely manage GitHub token for releases (e.g., using GitHub Secrets).

## Dependencies

- Setup tasks (T001-T005a) must be completed first.
- Test tasks (T006-T009) must be completed before Core Implementation (T010-T016).
- Core Implementation tasks should be completed before Integration tasks (T017-T020).
- Polish tasks (T021-T025) can be worked on after their respective features are implemented.
- CI/CD tasks (T026-T030) should be implemented after core development and initial testing are stable.

## Parallel Example

```
# The following setup tasks can be run in parallel:
Task: "[P] Install and configure NativeWind for Tailwind CSS support in the React Native project."
Task: "[P] Install core dependencies: `react-native-track-player`, `react-native-tts`, `react-native-biometrics`, `react-native-keychain`, `axios`, and `@react-native-async-storage/async-storage`."
Task: "[P] Set up ESLint, Prettier, and Husky for code quality and pre-commit hooks, following the project's constitution."

# The following test tasks can be run in parallel:
Task: "[P] Write a failing integration test (Detox) for the first-time setup and configuration flow described in quickstart.md."
Task: "[P] Write a failing integration test (Detox) for fetching and viewing chapters."
Task: "[P] Write a failing integration test (Detox) for the TTS and Bluetooth playback control flow."
Task: "[P] Write a failing unit test (React Native Testing Library) for the Settings data model."
```
