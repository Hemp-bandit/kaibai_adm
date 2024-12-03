const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')
const conf = {
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.(js|ts|cjs|mjs)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          "css-loader",
          'less-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          "css-loader",
          'less-loader'
        ]
      },
      {
        test: /\.vue$/,
        use: "vue-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./static/index.html" }),
    new VueLoaderPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.cjs'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[chunkhash].js',
  }
}
// const is_dev = process.env.NODE_ENV === "development"
// if (!is_dev) {
//   conf.output['publicPath'] = "https://kaibai-admin.obs.cn-east-3.myhuaweicloud.com/adm/"
// }
module.exports = conf
