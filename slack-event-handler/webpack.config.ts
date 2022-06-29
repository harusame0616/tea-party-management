import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

export const config: webpack.Configuration = {
  mode: 'development',
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/index.ts',
  output: {
    path: __dirname + '/dest',
    filename: 'index.js',
    library: {
      // module.export = 形式で出力
      type: 'commonjs2',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: '/node_modules',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

const modeList = ['production', 'development', 'none'] as const;
type Mode = typeof modeList[number];
const isMode = (mode: any): mode is Mode => modeList.includes(mode);

if (isMode(process.env.NODE_ENV)) {
  config.mode = process.env.NODE_ENV;
}

export default config;
