module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Если ошибка .resolver останется, можно добавить пустой плагин, 
    // но обычно базового пресета достаточно
    plugins: [],
  };
};