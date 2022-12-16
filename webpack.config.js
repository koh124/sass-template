const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const glob = require('glob');

function asset(entries, extension) {
  const paths = glob.sync(`./src/**/*.${extension}`);
  const names = paths.map((path) => {
    const headToLastSlash = new RegExp(`^(.+/)`);
    const firstPeriodToLast = new RegExp(/(\..+)/);
    return path.replace(headToLastSlash, '').replace(firstPeriodToLast, '')
  });
  for (let i in names) {
    entries[names[i]] = paths[i];
  }
  return entries;
}

module.exports = {
  context: __dirname,
  entry: {
    // 複数エントリーに対応 シングルエントリーする場合は適宜任意のnameでエントリーする
    // jsはCSS Modules用
    // ...asset({}, 'js'),
    ...asset({}, 'scss')
  },
  output: {
    filename: '[name].js',
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
      filename: '[name].css' // outputの出力先パスからの相対パス
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
  watch: true,
  watchOptions: {
    ignored: '**/node_modules'
  },
  devServer: {
    port: 8000,
    static: {
      directory: 'dist' // webpack-dev-serverのプロジェクトルートを指定する
    }
  }
}
