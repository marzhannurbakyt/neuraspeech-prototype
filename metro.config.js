const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 1. Убираем использование eval в вебе для соответствия CSP
// 2. Отключаем inlineRequires для стабильности сборки в браузере
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

// Добавляем поддержку веба явно, если она вдруг слетела
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'web.tsx', 'web.ts', 'web.js', 'web.jsx'];

module.exports = config;