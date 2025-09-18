# Quickstart & Test Scenarios

This document outlines the key user flows and acceptance criteria for testing the Modern Fleet Android App.

## 1. First-Time Setup and Configuration

- **Scenario**: A new user launches the app for the first time.
- **Steps**:
  1.  Launch the app.
  2.  The user should be prompted for biometric authentication.
  3.  After successful authentication, the user lands on the landing page.
  4.  Navigate to the **Settings** page.
  5.  Enter a valid GitHub Token, Repository URL, Branch, and Content Folder path.
  6.  Save the settings.
- **Expected Result**: The settings are saved successfully. No errors are displayed.

## 2. Fetching and Viewing Chapters

- **Scenario**: The user has configured the app and wants to read a chapter.
- **Steps**:
  1.  Navigate to the **Index** page.
  2.  The app should display a list of chapters fetched from the configured GitHub repository.
  3.  Tap on a chapter from the list.
- **Expected Result**: The user is taken to the **Content** page, where the text of the selected chapter is displayed.

## 3. Text-to-Speech and Playback Control

- **Scenario**: The user wants to listen to a chapter and control it with a Bluetooth device.
- **Steps**:
  1.  On the **Content** page, tap the "Play" button to start TTS.
  2.  Connect a Bluetooth headset to the phone.
  3.  Use the Bluetooth device controls:
      - Press "Pause".
      - Press "Play".
      - Press "Next".
      - Press "Previous".
- **Expected Result**:
  - The audio should start playing.
  - The audio should pause and resume accordingly.
  - The app should navigate to the next or previous chapter and start playing it.

## 4. Handling Audio Focus

- **Scenario**: The app is playing audio, and another app requests audio focus.
- **Steps**:
  1.  Start playing a chapter in the app.
  2.  Open another app (e.g., a music player or YouTube) and start playing audio.
- **Expected Result**: The novel app should pause its playback automatically.

## 5. Customizing the Reading Experience

- **Scenario**: The user wants to change the font size and playback speed.
- **Steps**:
  1.  Navigate to the **Settings** page.
  2.  Adjust the "Font Size" and "Play Speed" sliders.
  3.  Return to the **Content** page.
- **Expected Result**: The font size of the chapter text should be updated, and the TTS playback speed should be noticeably different.

## 6. Error Handling: Invalid Configuration

- **Scenario**: The user provides an invalid GitHub configuration.
- **Steps**:
  1.  Go to the **Settings** page.
  2.  Enter an invalid GitHub token or a non-existent repository URL.
  3.  Navigate to the **Index** page.
- **Expected Result**: The app should display an error message indicating that it failed to fetch the chapters and provide guidance on how to fix the configuration.
