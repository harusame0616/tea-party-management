import Webpack from 'webpack';
import path from 'path';
import NodeExternals from 'webpack-node-externals';

const config: Webpack.Configuration = {
  mode: 'production',
  target: 'node',
  entry: path.resolve(__dirname, 'src', 'app.ts'),
  externals: [NodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dest'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};

export default config;
