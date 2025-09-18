# Data Model

This document defines the data structures for the Modern Fleet Android App.

## 1. Settings

Represents all user-configurable settings, to be stored persistently on the device using AsyncStorage.

| Field                  | Type     | Description                                     | Validation                                        |
| ---------------------- | -------- | ----------------------------------------------- | ------------------------------------------------- |
| `githubToken`          | `String` | Personal Access Token for GitHub API access.    | Must not be empty.                                |
| `githubRepoUrl`        | `String` | Full URL of the GitHub repository.              | Must be a valid URL.                              |
| `githubRepoBranch`     | `String` | The branch to fetch content from.               | Must not be empty.                                |
| `contentFolderPath`    | `String` | Path to the folder containing markdown files.   | Must not be empty.                                |
| `displayFont`          | `String` | The font family for the content view.           | Must be a supported font.                         |
| `fontSize`             | `Number` | The font size for the content view.             | Must be a positive number.                        |
| `playSpeed`            | `Number` | The speech rate for the TTS engine.             | Must be a positive number (e.g., 1.0 for normal). |
| `currentChapterId`     | `String` | The identifier of the last opened chapter.      | -                                                 |
| `currentReadingOffset` | `Number` | The scroll position in the last opened chapter. | -                                                 |

## 2. Chapter

Represents a single novel chapter, fetched from the GitHub repository.

| Field     | Type     | Description                                                |
| --------- | -------- | ---------------------------------------------------------- |
| `id`      | `String` | A unique identifier for the chapter (e.g., the file path). |
| `title`   | `String` | The title of the chapter (e.g., the file name).            |
| `content` | `String` | The full markdown content of the chapter.                  |

## 3. User

Represents the application user, authenticated via the local device credentials.

| Field             | Type      | Description                                                 |
| ----------------- | --------- | ----------------------------------------------------------- |
| `isAuthenticated` | `Boolean` | Flag indicating if the user has successfully authenticated. |
