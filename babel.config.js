module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Removed react-native-worklets/plugin as it requires New Architecture
    'react-native-reanimated/plugin',
  ],
};
