'use strict';

/**
 * オーディオ管理オブジェクト
 */
let dglAudio ;

/**
 * オーディオライブラリの初期化
 */
function dglAudioInitalize(){
    dglAudio = {
        /**
         * 初期化を行うトリガーとなるイベントの名称
         */
        audioInitEventName:typeof frontBuffer.ontouchend !== 'undefined' ? 'touchend' : 'mousedown',

        /**
         * AudioContext
         */
        context:undefined,

        /**
         * 指定したURLから読み込んだオーディオデータ
         */
        audioResponce:{},

        /**
         * デコードされたオーディオバッファ
         */
        audioBufferes:{},

        /**
         * 状態
         * true:再生中
         * false:停止中                                            
         */
        state:{},

        /**
         * playBGM()で生成された現在再生中のsourece
         */
        curBGMSource:null,

        /**
         * 初期化済みかどうか
         */
        initalized:false,

        /**
         * 初期化イベント
         * オーディオのデコードの完了を待ちたいので、async awaitを指定している。
         * 本来なら、非同期の処理が発生して待機が必要な場合は、フレームワークで対応できるようにすべき。
         * 例えば、ローディング画面出したりするなど。
         */
        onInitalize: async ()=>{
            LOG.debug("Web Audio Initalize strat");
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            dglAudio.context = new window.AudioContext();
            // 登録済みのデータをデコードする
            // デコードを待ちたいのでawaitで待つ
            for(let key in dglAudio.audioResponce){
                await dglAudio.context.decodeAudioData(dglAudio.audioResponce[key]).then(function(buffer) {
                    dglAudio.audioBufferes[key] = buffer;
                    dglAudio.state[key]=false;
                    LOG.debug("onInitalize : decode success " + key);
                }).catch(() => {
                    LOG.error("onInitalize : decode error " + key);
                });
                // 読み込んだバッファの解放
                dglAudio.audioResponce[key] = undefined;

            }
            dglAudio.playSound("silent", false);
            LOG.debug("Web Audio Initalize end");
            frontBuffer.removeEventListener(dglAudio.audioInitEventName, dglAudio.onInitalize);
        },

        /**
         * 音声ファイルを読み込み、フレームワークに登録する
         * @param name {string} 登録名称
         * @param url {string} 読み込み対象のファイルのURL
         */
        loadSound:async (name, url)=>{
            var request = new XMLHttpRequest();
            LOG.debug("loadSound : " + name);
            // Decode asynchronously
            request.onload = () => {
                if(request.response instanceof ArrayBuffer){
                    dglAudio.audioResponce[name] = request.response;
                }else{
                    LOG.warn(url + " is not ArrayBuffer.");
                }
            }
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.send();
        },

        /**
         * 音声を再生する
         * @param name {string} 登録名称
         * @param isLoop {boolean} ループ再生するか指定する
         */
        playSound:(name, isLoop) =>{
            if(!dglAudio.context){
                LOG.warn("playSound : audio context is undefined");
                return;
            }
            if(!dglAudio.audioBufferes[name]){
                if(!dglAudio.audioResponce[name]){
                    LOG.warn("playSound : unknow " + name);
                    return;
                }

                // 読み込み済みのバッファをオーディオバッファにデコードする
                dglAudio.context.decodeAudioData(dglAudio.audioResponce[name]).then(function(buffer) {
                    dglAudio.audioBufferes[name] = buffer;
                    dglAudio.state[name]=false;
                    LOG.debug("playSound : load success " + name);
                }).catch(function(){
                    LOG.error("playSound : load error " + name);
                });
                // 読み込んだバッファの解放
                dglAudio.audioResponce[name] = undefined;
            }

            LOG.debug("play " + name);
            dglAudio.state[name] = true;
            var source = dglAudio.context.createBufferSource();
            source.buffer = dglAudio.audioBufferes[name];
            source.connect(dglAudio.context.destination);
            source.loop = isLoop;
            source.start(0);
            source.addEventListener("ended", function(){
                dglAudio.state[name] = false;
                LOG.debug("playSound : " + name + "end");
            });
        },

        /**
         * BGMを再生する。
         * @param name {string} 登録名称
         */
        playBGM:(name, isLoop = true, onEndedCallbask = null)=>{
            if(!dglAudio.context){
                LOG.debug("playBGM : audio context is undefined");
                return;
            }
            if(!dglAudio.audioBufferes[name]){
                if(!dglAudio.audioResponce[name]){
                    LOG.error("playBGM : unknow " + name);
                    return;
                }
                dglAudio.context.decodeAudioData(dglAudio.audioResponce[name]).then(function(buffer) {
                    dglAudio.audioBufferes[name] = buffer;
                    dglAudio.state[name]=false;
                    LOG.debug("playBGM : load success " + name);
                }).catch(function(){
                    LOG.error("playBGM : load error " + name);
                });
            }
            if(dglAudio.curBGMSource){
                dglAudio.curBGMSource.stop();
            }
            dglAudio.curBGMSource = dglAudio.context.createBufferSource();
            dglAudio.curBGMSource.buffer = dglAudio.audioBufferes[name];
            dglAudio.curBGMSource.connect(dglAudio.context.destination);
            dglAudio.curBGMSource.loop = isLoop;
            dglAudio.state[name] = true;
            dglAudio.curBGMSource.addEventListener("ended", function(){
                dglAudio.state[name] = false;
                LOG.debug("playBGM : " + name + " end");
                if(onEndedCallbask){
                    onEndedCallbask(); 
                }
            });
            dglAudio.curBGMSource.start(0);
        },

        /**
         * BGMを停止する
         */
        stopBGM:()=>{
            if(!dglAudio.context){
                LOG.debug("playBGM : audio context is undefined");
                return;
            }
            if(dglAudio.curBGMSource){
                dglAudio.curBGMSource.stop();
            }
        }
                
    };

    // 初期化ようにタッチまたはマウスのボタン押下イベントに登録
    frontBuffer.addEventListener(dglAudio.audioInitEventName, dglAudio.onInitalize);
}
