const path = require('path')
const nodeExternals = require('webpack-node-externals')
const slsw = require('serverless-webpack')

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
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '../.webpack'),
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
            ['@babel/preset-env', { targets: { node: '10' } }],
            '@babel/typescript'
          ],
          plugins: [
            '@babel/proposal-class-properties',
            '@babel/proposal-object-rest-spread',
            ["module-resolver", {
              "root": ["./src"],
              "alias": {
                "@": "./src"
              }
            }],
          ]
        }
      }
    ],
  },
  stats: 'minimal'
}

module.exports = config
