const path = require('path');
const slsw = require('serverless-webpack');
const { webpackDefaultsFactory } = require('@nestjs/cli/lib/compiler/defaults/webpack-defaults');

const nestWebpackConfig = webpackDefaultsFactory(
  path.resolve(__dirname, 'src'),
  '',
  'lambda',
  false,
  path.resolve(__dirname, 'tsconfig.build.json'),
  {
    beforeHooks: [],
    afterHooks: [],
    afterDeclarationsHooks: [],
  },
);

module.exports = {
  ...nestWebpackConfig,
  entry: slsw.lib.entries,
  mode: 'production',
  output: {
    ...nestWebpackConfig.output,
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
};
