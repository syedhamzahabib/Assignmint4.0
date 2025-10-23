const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native/blob/0.79-stable/packages/react-native/template/metro.config.js
 * @type {import('metro-config').MetroConfig}
 */
const config = {};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
