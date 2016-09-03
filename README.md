# prism_scraping
ジェラード・ダーゼルさん開発・運営の定期更新型ネットゲーム，「百合鏡」において，週ごとの結果をApacheで公開しているフォルダに保存して共有できるようにしたオレオレコードです．
手動でevernoteに送られているのを見て，面倒そうだったので，nodejsの習作として作りました．

##### 機能
- 実行時に結果一覧ページにHTTPアクセスし，現在のターン数および，ENo.81-85のキャラクターの「結果一覧」先リンクを抽出，ファイル名の先頭にターン数(3桁)を付与しつつ，リンク先をUTF-8で保存します．
- .htaccess にターン数およびページのタイトルを概要として付与します．

#### 意図
- Eno.81-85は時折パーティを分割しているが，取得先ページファイル名はリーダーのEnoが使われるようなので，誰がリーダーでも取得できるようにする必要がありました．
- 週1更新のゲームですが，時折スキップされることがあるため，現在のターン数は保持せず毎回取得するようにしました．
- わざわざindex用のコードを書く理由がなかったので，ApacheのDirective Indexに丸投げして見易いように概要を付与する形にしました． 

#### 使い方
1. 2行目のbaseurlを指定する．
2. nodejs prism_log_get_node.js
3. 週に1度cronで．

#### ライセンス
WTFPL (Do What The Fuck You Want To Public License)．The Unlicenseより短い．