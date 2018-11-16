const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    boardgamegeekscrape: path.resolve(__dirname, 'boardgamegeekscrape/index.ts'),
    search: path.resolve(__dirname, 'search/index.ts'),
    servicedev: path.resolve(__dirname, 'servicedev.ts'),
  },
  mode: production ? 'production' : 'development',
  devtool: production ? 'source-map' : 'inline-source-map',
  target: 'node',
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.m?tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }, {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }, {
        test: /\.(gif|jpe?g|png)(\?.*)?$/,
        loader: 'sharp-loader',
        query: {
          name: '[name].[hash:8].[ext]',
          cacheDirectory: true,
          presets: {
            default: {
              format: (meta) => {
                // If the image is transparent, convert to webp and png,
                // otherwise just use jpg.
                if (meta.hasAlpha) {
                  return ['webp', 'png'];
                }
                return ['webp', {id: 'jpeg', quality: 70}];
              },
            },
            thumbnail: {
              format: ['webp', 'jpeg'],
              width: 200,
              quality: 60,
            },
            prefetch: {
              format: {id: 'jpeg', quality: 50},
              mode: 'cover',
              blur: 100,
              inline: false,
              size: 50,
              scale: ({width, height}) => {
                return Math.min(100 / width, 100 / height);
              },
            },
            prefetchLarge: {
              format: {id: 'jpeg', quality: 65},
              mode: 'cover',
              blur: 100,
              inline: false,
              size: 50,
              scale: ({width, height}) => {
                return Math.min(350 / width, 350 / height);
              },
            },
          },
        },
      },
    ]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../../src'),
    },
    extensions: ['.mjs', '.js', '.json', '.ts', '.tsx']
  },
  plugins: [
    new CleanWebpackPlugin(['public/services']),
    ...(production ? [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })] : []),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../../public/services')
  }
};