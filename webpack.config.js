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
  },
  devServer: {
    contentBase: path.join(__dirname, 'template'),
    port: 8080
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'template/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'control.html',
      template: 'template/control.html',
    })
  ]
};