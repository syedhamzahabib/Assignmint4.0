/**
 * @format
 */

import {AppRegistry} from 'react-native';
// App.tsx is canonical; legacy App.js moved to archive.
import App from './App.tsx';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
