import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { resolve } from 'path';

const mode = process.env.NODE_ENV || 'production';
const devMode = mode === 'development';
const plugins = [
  new HtmlWebpackPlugin({
    template: resolve(__dirname, 'src', 'index.html')
  }),
  new MiniCssExtractPlugin({
    filename: devMode ? '[id].css' : '[id].[contenthash].css'
  }),
  new ForkTsCheckerWebpackPlugin({
    async: false,
    eslint: {
      files: './src/**/*'
    }
  })
];

module.exports = {
  mode,
  entry: resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: devMode ? '[name].bundle.js' : '[name].[contenthash].js',
    publicPath: '/'
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.ts', '.jsx', '.tsx', '.json', '.css'],
    plugins: [new TsconfigPathsPlugin()]
  },
  devServer: {
    static: {
      publicPath: '/'
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      },
      progress: true
    },
    port: 9000,
    historyApiFallback: true,
    hot: true
  },
  plugins
};
