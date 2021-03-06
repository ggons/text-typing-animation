const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'text-typing-animation.js',
    libraryTarget: 'umd',
    library: 'TextTypingAnimation',
    umdNamedDefine: true,
  }
};