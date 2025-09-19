/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import TrackPlayer from 'react-native-track-player';

// const setupPlayer = async () => {
//   try {
//     await TrackPlayer.setupPlayer();
//   } catch (error) {
//     console.log('TrackPlayer setup error:', error);
//   }
// };

// setupPlayer();

AppRegistry.registerComponent(appName, () => App);

// TrackPlayer.registerPlaybackService(
//   () => require('./src/services/trackPlayerService').playbackService,
// );
