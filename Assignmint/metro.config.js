const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Handle symlinks properly
    enableSymlinks: true,
    // Add node_modules to resolver
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../node_modules'),
    ],
    // Block problematic files
    blockList: [
      /.*\/node_modules\/.*\/node_modules\/.*/,
    ],
  },
  watchFolders: [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname, '../node_modules'),
  ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
