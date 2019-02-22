const path = require('path')
const slsw = require('serverless-webpack')

const entries = {}

Object.keys(slsw.lib.entries).forEach(
  key => (entries[key] = ['./source-map-install.js', slsw.lib.entries[key]])
);

const config = {
  mode: 'production',
  optimization: {
    minimize: true
  },
  entry: entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: { node: '8.10' } }],
            '@babel/typescript'
          ],
          plugins: [
            '@babel/proposal-class-properties',
            '@babel/proposal-object-rest-spread',
            ["module-resolver", {
              "root": ["./src"],
              "alias": {
                "src": "./src"
              }
            }],
          ]
        }
      }
    ],
  },
  stats: {
    colors: true,
    reasons: true,
  }
}

module.exports = config
