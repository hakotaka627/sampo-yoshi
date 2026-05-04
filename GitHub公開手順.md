# GitHubで公開する手順

## 状況

リポジトリ：

`hakotaka627/sampo-yoshi`

CodexのGitHub連携から直接アップロードを試しましたが、GitHub側で `Resource not accessible by integration` が出ました。
これは、GitHub連携の書き込み権限が足りない時に起きます。

そのため、まずは手動アップロードで公開します。

## 手順1：GitHubへファイルをアップロード

1. GitHubで `hakotaka627/sampo-yoshi` を開く
2. `uploading an existing file` または `Add file` → `Upload files` を選ぶ
3. このフォルダ内の中身をアップロードする

アップロードする場所：

`E:\新PCデスクトップ\hakoi\経営数字関連\codex\Codex\mermaid-pwa`

アップロードするもの：

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `.nojekyll`
- `README.md`
- `assets` フォルダ

`server.js` と `アプリを開く.bat` はローカル確認用なので、GitHub公開には必須ではありません。
アップしても大きな問題はありませんが、公開に必要なのは上記です。

## 手順2：GitHub Pagesを有効化

1. リポジトリの `Settings` を開く
2. 左メニューの `Pages` を開く
3. `Build and deployment` の `Source` を `Deploy from a branch` にする
4. Branchを `main`、フォルダを `/root` にする
5. `Save` を押す

数分後に次のURLで開けるようになります。

`https://hakotaka627.github.io/sampo-yoshi/`

## 注意

今の版は、達成記録がそれぞれのスマホ・ブラウザ内に保存されます。
他の人が同じURLを使っても、記録はその人の端末ごとに分かれます。

外付けメモリーに残す場合は、アプリ内の `設定` → `バックアップ保存` を使ってJSONファイルを書き出してください。
