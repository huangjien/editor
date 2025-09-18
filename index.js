/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import {
  setupPlayer,
  playbackService,
} from './src/services/trackPlayerService';
import TrackPlayer from 'react-native-track-player';

setupPlayer();
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
