let localStream;//動画を相手にに返すためグロ変

// カメラ映像取得
navigator.mediaDevices.getUserMedia({video: true, audio: true})
	.then( stream => {
	// 成功時にvideo要素にカメラ映像をセットし、再生
	const videoElm = document.getElementById('my-video')
	videoElm.srcObject = stream;
	videoElm.play();
	// 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
	localStream = stream;
}).catch( error => {
	// 失敗時にはエラーログを出力
	console.error('mediaDevice.getUserMedia() error:', error);
	return;
});

//const Peer=require('skyway-js');


//Peer作成
const peer = new Peer({
	key: '448eaa53-daae-43bd-ac9a-1249d21d0106',
	debug: 3
});

//PeerIDはPeerオブジェクトのopenイベント(SkyWayのシグ鯖接続成功)で取得
//PeerID取得
peer.on('open', () => {
	document.getElementById('my-id').textContent = peer.id;
});

//callイベントは相手からの接続要求で発生する
peer.on('call',mediaConnection=>{
	mediaConnection.answer(localStream);//自分の映像を相手に返す
	setEventListener(mediaConnection);//相手動画動かすイベントリスナに追加
});


// 発信処理
document.getElementById('make-call').onclick = () => {
  const theirID = document.getElementById('their-id').value;//入力したid取得
  const mediaConnection = peer.call(theirID, localStream);
	//callメソッドは接続時MediaConnectionを取得
  setEventListener(mediaConnection);
};

// イベントリスナを設置する関数
const setEventListener = mediaConnection => {
  mediaConnection.on('stream', stream => {
    // video要素にカメラ映像をセットして再生
    const videoElm = document.getElementById('their-video')
    videoElm.srcObject = stream;
    videoElm.play();
  });
}