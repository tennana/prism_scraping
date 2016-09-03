//定数
var baseurl = 'http://csyuki.sakura.ne.jp/cgi-bin/prism/result/';
var saveFolder = "";

// モジュールロード
require.main.paths.push('/usr/local/lib/node_modules');
var jschardet = require('jschardet');
var Buffer = require("buffer").Buffer
var Iconv = require("iconv").Iconv;
var http = require('http');
var fs = require('fs');

// ダウンロードする
function mainHtmlDownload(){
	var html = ''; 
	var req = http.get(baseurl+"index.html", function (res) {
	    res.on('data', function (text) {
	        html += text;
	    });
	    res.on('end', function () {
		//文字コード判定
		var bHtml = new Buffer(html, 'binary');
		var detectResult = jschardet.detect(bHtml);

		//判定した文字コードからUTF-8に変換
		var iconv = new Iconv(detectResult.encoding,'UTF-8//TRANSLIT//IGNORE');
		var convertedString = iconv.convert(bHtml).toString();
		// 回数の取得
		var turn = convertedString.match("turn(\\d+)(\\n)?\.zip")[1];
		var getFiles = {};
		var match = convertedString.match(/(result[0-9]+.html).+?(status8[1-5]\.html)/g);
		for(var i = 0;i < match.length;i++){
			var tmp = match[i].match(/(result[0-9]+.html).+?(status8[1-5]\.html)/);
			getFiles[tmp[1]] = true;
		}
		var aFile = Object.keys(getFiles);
		for(var i = 0; i < aFile.length; i++){
			downloadResultHtml(turn,aFile[i]);
		}
		req.abort();
	    });
	});

	req.setTimeout(30000);
	req.on('timeout', function() {
	  console.log('request timed out');
	  req.abort();
	  setTimeout(mainHtmlDownload,600000);
	});
	req.on('error', function (err) {
	    req.abort();
	    console.log('Error: ', err); return;
	});
}

function downloadResultHtml(turn,htmlName){
	// ダウンロード先URLを指定する
	var url = baseurl+htmlName;
	var outFileName = ("00"+turn).slice(-3)+"_"+htmlName;

	var html = "";

	var req = http.get(url, function (res) {
		res.setEncoding("binary");
		res.on('data',function(text){html+=text;});
		res.on('end', function() {
			var bHtml = new Buffer(html, 'binary');
			//文字コード判定
			var detectResult = jschardet.detect(bHtml);

			//判定した文字コードからUTF-8に変換
			var iconv = new Iconv(detectResult.encoding,'UTF-8//TRANSLIT//IGNORE');
			var convertedString = iconv.convert(bHtml).toString();
			// タイトルの取得
			var title = convertedString.match("<title>(.+?)</title>")[1];
			fs.appendFileSync(saveFolder+".htaccess",
				"AddDescription \"第"+turn+"回 行動結果"+title.replace("百合鏡 行動結果","")+"\" "+outFileName+"\n"
			);
			req.abort();
			fs.writeFileSync(saveFolder+outFileName, bHtml );

		});
	});

	req.setTimeout(10000);
	req.on('timeout', function() {
	  console.log('request timed out');
	  req.abort();
	  setTimeout(function(){downloadResultHtml(turn,htmlName);},600000);
	});

	// 通信エラーなどはここで処理する
	req.on('error', function (err) {
	    console.log('Error: ', err); return;
	});
}

mainHtmlDownload();
