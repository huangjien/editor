# Research for Modern Fleet Android App

## UI Library
- **Decision**: Use `react-native-paper` for a modern, Material Design-based UI.
- **Rationale**: It provides a rich set of customizable components that are easy to use and visually appealing, fitting the "standing out" requirement. It's well-maintained and popular in the React Native community.
- **Alternatives considered**: `react-native-elements`, `native-base`. `react-native-paper` was chosen for its strong Material Design implementation.

## Local Storage
- **Decision**: Use `AsyncStorage` for simplicity to store settings and chapter content.
- **Rationale**: For the scope of this app, a full database like WatermelonDB or Realm is likely overkill. AsyncStorage provides a simple key-value store that is sufficient for caching text files and user preferences. If performance becomes an issue with a large number of chapters, this can be revisited.
- **Alternatives considered**: `WatermelonDB`, `Realm`. These are more complex and better suited for applications with complex data relationships.

## Text-to-Speech
- **Decision**: Use `react-native-tts`.
- **Rationale**: It's a popular, well-supported library that provides a simple API for text-to-speech on both iOS and Android.
- **Alternatives considered**: Writing native modules, which would be more complex.

## GitHub API Integration
- **Decision**: Use `octokit/rest.js` or a simple `fetch` with a personal access token.
- **Rationale**: For simply fetching file content, a direct `fetch` call to the GitHub API is sufficient. If more complex interactions are needed in the future, `octokit/rest.js` can be used.
- **Alternatives considered**: None, as direct API access is the standard approach.

## Bluetooth Control
- **Decision**: Use `react-native-track-player`.
- **Rationale**: This library is designed for audio playback and includes built-in support for background playback and remote controls (like Bluetooth devices and notifications).
- **Alternatives considered**: `react-native-ble-plx` for more generic Bluetooth LE interaction, but it's too low-level for this use case.

## Local Authentication
- **Decision**: Use `react-native-keychain` for storing the GitHub token securely and `react-native-local-auth` for biometric/PIN authentication.
- **Rationale**: This combination provides a secure way to store sensitive data and protect access to the app.
- **Alternatives considered**: Storing the token in AsyncStorage (less secure).

## Internationalization (i18n)
- **Decision**: Use `i18next` with `react-i18next`.
- **Rationale**: These are the standard libraries for i18n in React and React Native, with strong community support and documentation.
- **Alternatives considered**: `react-native-localize`. `i18next` is more feature-rich.
