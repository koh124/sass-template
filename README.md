## sassコンパイル環境 with webpack + CSS Modules

scssをコンパイルして使いたい場合に手軽にコンパイル・開発できるリポジトリです。

CSS Modules開発環境もビルトインしています。

## Getting Started

前提： node.js / npmを事前にインストール

(1) git cloneでプロジェクトをダウンロード
```
$ git clone https://github.com/koh124/sass-template.git
```
※githubの「Code（緑色のボタン） > Download ZIP」 からダウンロードしてもいいです。

(2) 必要なnpmパッケージをインストール
```
$ npm install -y
```

(3) 好きなscssコードを書いてcssにコンパイル

* webpackでコンパイルする

distにstyle.cssとして出力されます。

webpack.config.jsのentryで指定されているファイルが対象です。
```
$ npm run bundle
```

* 開発用サーバーを立ち上げる

localhost:8000で開発用サーバーを立ち上げ、ソースコードの変更を即座に反映します。

VScodeのLiveServerのwebpack版です。

```
$ npm start
```

## CSS Modules
cssのクラス名をjsでオブジェクトとして扱い、DOM Elementに直接記述できる記法です。

バンドル後のクラス名は重複しない一意のクラス名になり、cssでありがちなグローバルスコープ汚染問題（クラス名の衝突）を手軽に避けることができます。

CSS Modulesをオンにする（どちらか一方でOK）

* css(scss)ファイル名を`*.module.*`にする
* `webpack.config.js`を記述する

```
**webpack.config.js**
{
  loader: 'css-loader',
  options: {
    modules: true
  }
}
```

#### How it works
```
**src/index.js**
import Style from './style.module.scss';

// <div id="app"></div>に'src/style.module.scss'で定義されたcssのクラス名を付与
document.getElementById('app').classList.add(Style.red);

**style.module.scss**
.red {
  color: red;
}

webpackバンドル後のcssは下記のようになります

**style.css（コンパイル後）**
.xZhHcw5S6yhAW7J1X7QL {
  color: red;
}

**index.html**
<div id="app" class="xZhHcw5S6yhAW7J1X7QL"></div>
```
