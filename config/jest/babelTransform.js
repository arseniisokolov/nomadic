'use strict';

const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
  presets: [
    [
      require.resolve('babel-preset-react-app'),
      {
        runtime: 'classic',
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-react-jsx'),
      {
        pragma: 'jsx',
        pragmaFrag: 'Fragment',
      },
    ],
  ],
  babelrc: false,
  configFile: false,
});
