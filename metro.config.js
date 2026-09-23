const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permite que o Expo/Metro trate o catálogo CSV como um asset do aplicativo.
if (!config.resolver.assetExts.includes('csv')) {
  config.resolver.assetExts.push('csv');
}

module.exports = config;
