const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const commonConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

module.exports = [
  // Content Script
  {
    ...commonConfig,
    entry: './src/contentScript.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'contentScript.bundle.js',
    },
  },
  // Background Service Worker
  {
    ...commonConfig,
    entry: './src/background.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'background.bundle.js',
    },
    target: 'webworker',
  },
  // Popup
  {
    ...commonConfig,
    entry: './src/popup.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'popup.bundle.js',
    },
  },
  // Side Panel
  {
    ...commonConfig,
    entry: './src/sidePanel.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'sidePanel.bundle.js',
    },
  },
  // Options
  {
    ...commonConfig,
    entry: './src/options.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'options.bundle.js',
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'public', to: '.' },
          { from: 'manifest.json', to: '.' },
          { from: 'src/css', to: '.' },
          { from: '_locales', to: '_locales' },
          { from: 'icons', to: '.' },
        ],
      }),
    ],
  },
];
