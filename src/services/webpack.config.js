const path = require('path');
const { readdirSync, statSync } = require('fs')
const { join } = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production';

const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory())

const services = dirs(__dirname).filter((v) => !/entities/.test(v));
let serviceEntryPoints = {};
services.forEach((service) => {
  serviceEntryPoints[service] = ['source-map-support/register', '@babel/polyfill', path.resolve(__dirname, `${service}/index.ts`)];
})

const CFG = require(path.resolve(__dirname, '../../.devcfg.js'));

class PM2ConfigPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, cb) => {
      services.filter((service) => service !== 'solrdev').forEach((service) => {
        let src = {};
        src.apps = {
          name: service,
          script: `${service}.bundle.js`,
          exec_mode: 'cluster_mode',
          instances: 'max',
        };
        const config = JSON.stringify(src);
        compilation.assets[`${service}.ecosystem.config.json`] = {
          source: () => config,
          size: () => config.length,
        }
      });
      cb();
    });
  }
}

module.exports = {
  entry: Object.assign(
    {},
    {
      servicedev: ['source-map-support/register', '@babel/polyfill', path.resolve(__dirname, 'servicedev.ts')],
    },
    serviceEntryPoints,
  ),
  mode: 'development',
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
    new CleanWebpackPlugin(['../../public/services'], {
      allowExternal: true,
    }),
    new webpack.DefinePlugin({
      'CFG': JSON.stringify(CFG),
    }),
    new PM2ConfigPlugin(),
    ...(production ? [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      })] : []),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../../public/services')
  }
};