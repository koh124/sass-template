const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    // エントリーポイントを指定 jsはCSS Modules用
    css: './src/style.scss',
    // js: './src/index.js'
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'), // outputはcontextがあっても絶対パスを指定
    // path: path.resolve('./dist'), // path.resolve()は絶対パスを生成してくれる（どちらも可）
  },
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        use: [
          {
            // ※どちらか一方
            // loader: 'style-loader', // index.htmlにスタイルを直書きするなら
            loader: MiniCssExtractPlugin.loader, // cssを別ファイルに出力する場合
          },
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(), // cssでentryした場合に空のjsを生成しない
    new MiniCssExtractPlugin({
      filename: 'style.css' // outputの出力先パスからの相対パス
    })
  ],
  resolve: {
    extensions: ['.css', '.scss', '.sass', '.js'] // .jsがないとwebpack-dev-serverが動かない
  },
  optimization: {
    minimize: false, // trueにすると出力先css/jsファイルをminify
    minimizer: [
      new TerserPlugin(), // minify js
      new CssMinimizerPlugin() // minify css
    ],
  },
  devServer: {
    static: {
      directory: 'dist' // webpack-dev-serverのプロジェクトルートを指定する
    }
  }
}
