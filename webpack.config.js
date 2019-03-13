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
    contentBase: path.join(__dirname, 'test'),
    port: 8080
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('test', 'index.html')
    })
  ]
};