import { AppRegistry } from 'react-native';
import App from './App.tsx'; // force TS entry
import { name as appName } from './app.json';
if (__DEV__) console.log('### index.js loaded. Registering:', appName);
AppRegistry.registerComponent(appName, () => App);
