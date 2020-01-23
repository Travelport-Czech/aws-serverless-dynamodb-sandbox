const os = require('os')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const slsw = require('serverless-webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const config = {
  mode: 'production',
  optimization: {
    minimize: true
  },
  entry: slsw.lib.entries,
  externals: process.env.NODE_ENV === 'local' ? [
    nodeExternals()
  ] : [/aws-sdk/],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '../.webpack'),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'cache-loader',
          },
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
            },
          },
        ],
      }
    ],
  },
  stats: 'minimal'
}

module.exports = config
