import {
  AudioPro,
  AudioProState,
  AudioProEventType,
  AudioProContentType,
} from 'react-native-audio-pro';
import type { AudioProTrack, AudioProEvent } from 'react-native-audio-pro';

// Chapter interface
interface Chapter {
  id: string;
  title: string;
  audioUrl: string;
  coverImage?: string;
  author?: string;
  bookTitle?: string;
  duration?: number;
  position?: number;
}

// Global state
let isPlayerSetup = false;
let currentChapter: Chapter | null = null;
let currentChapterIndex = 0;
let chapters: Chapter[] = [];

// Setup the player
export const setupPlayer = async () => {
  try {
    AudioPro.configure({
      contentType: AudioProContentType.MUSIC,
      debug: false,
      progressIntervalMs: 1000,
      showNextPrevControls: true,
    });
    isPlayerSetup = true;
    console.log('AudioPro setup complete');
  } catch (error) {
    console.error('Error setting up AudioPro:', error);
  }
};

// Playback service
export const playbackService = async () => {
  AudioPro.addEventListener((event: AudioProEvent) => {
    console.log('AudioPro event:', event);

    if (event.type === AudioProEventType.REMOTE_NEXT) {
      skipToNext();
    } else if (event.type === AudioProEventType.REMOTE_PREV) {
      skipToPrevious();
    } else if (event.type === AudioProEventType.TRACK_ENDED) {
      skipToNext();
    }
  });
};

// Add chapter to queue (simplified for AudioPro)
export const addChapterToQueue = async (chapter: Chapter) => {
  try {
    chapters.push(chapter);
    console.log('Chapter added to queue:', chapter.title);
  } catch (error) {
    console.error('Error adding chapter to queue:', error);
  }
};

// Play a specific chapter
export const playChapter = async (chapter: Chapter) => {
  try {
    if (!isPlayerSetup) {
      await setupPlayer();
    }

    const track: AudioProTrack = {
      id: chapter.id || chapter.title,
      url: chapter.audioUrl,
      title: chapter.title,
      artwork: chapter.coverImage || '',
      artist: chapter.author || 'Unknown',
      album: chapter.bookTitle || 'Audiobook',
    };

    currentChapter = chapter;
    currentChapterIndex = chapters.findIndex(c => c.id === chapter.id);

    AudioPro.play(track, { autoPlay: true });
    console.log('Playing chapter:', chapter.title);
  } catch (error) {
    console.error('Error playing chapter:', error);
  }
};

// Toggle playback
export const togglePlayback = async () => {
  try {
    const state = AudioPro.getState();
    if (state === AudioProState.PLAYING) {
      AudioPro.pause();
    } else if (state === AudioProState.PAUSED) {
      AudioPro.resume();
    }
  } catch (error) {
    console.error('Error toggling playback:', error);
  }
};

// Pause playback
export const pausePlayback = async () => {
  try {
    AudioPro.pause();
  } catch (error) {
    console.error('Error pausing playback:', error);
  }
};

// Resume playback
export const resumePlayback = async () => {
  try {
    AudioPro.resume();
  } catch (error) {
    console.error('Error resuming playback:', error);
  }
};

// Skip to next chapter
export const skipToNext = async () => {
  try {
    if (currentChapterIndex < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      await playChapter(nextChapter);
    } else {
      console.log('No next chapter available');
    }
  } catch (error) {
    console.error('Error skipping to next:', error);
  }
};

// Skip to previous chapter
export const skipToPrevious = async () => {
  try {
    if (currentChapterIndex > 0) {
      const prevChapter = chapters[currentChapterIndex - 1];
      await playChapter(prevChapter);
    } else {
      console.log('No previous chapter available');
    }
  } catch (error) {
    console.error('Error skipping to previous:', error);
  }
};

// Stop playback
export const stopPlayback = async () => {
  try {
    AudioPro.stop();
    currentChapter = null;
  } catch (error) {
    console.error('Error stopping playback:', error);
  }
};

// Get playback state
export const getPlaybackState = async () => {
  try {
    const state = AudioPro.getState();
    return { state };
  } catch (error) {
    console.error('Error getting playback state:', error);
    return { state: AudioProState.IDLE };
  }
};

// Get current track
export const getCurrentTrack = async () => {
  try {
    if (currentChapter) {
      return currentChapter;
    }
    return null;
  } catch (error) {
    console.error('Error getting current track:', error);
    return null;
  }
};

// Seek to position
export const seekTo = async (positionMs: number) => {
  try {
    AudioPro.seekTo(positionMs);
  } catch (error) {
    console.error('Error seeking:', error);
  }
};

// Get current position and duration
export const getProgress = async () => {
  try {
    const timings = AudioPro.getTimings();
    return {
      position: timings.position,
      duration: timings.duration,
    };
  } catch (error) {
    console.error('Error getting progress:', error);
    return { position: 0, duration: 0 };
  }
};

// Clear all chapters and reset player
export const clearQueue = async () => {
  try {
    AudioPro.clear();
    chapters = [];
    currentChapter = null;
    currentChapterIndex = 0;
  } catch (error) {
    console.error('Error clearing queue:', error);
  }
};

// Initialize the track player service (alias for setupPlayer + playbackService)
export const initializeTrackPlayerService = async () => {
  try {
    await setupPlayer();
    await playbackService();
    console.log('Track player service initialized');
  } catch (error) {
    console.error('Error initializing track player service:', error);
  }
};
