'use strict';

/**
 * ログオブジェクト
 */
const LOG = {
    /**
     * デバッグモード 
     */
    isDebug:false,

    /**
     * 一般ログを出力
     */
    log : (logText)=>{
        let logBoody = getDateTimeString(new Date())  + " : [INFO ] : " + logText;
        LOG.addHistory(logBoody);
        console.log( logBoody );
    },

    /**
     * 一般ログを出力
     */
     info : (logText)=>{
        let logBoody = getDateTimeString(new Date())  + " : [INFO ] : " + logText;
        LOG.addHistory(logBoody);
        console.log( logBoody );
    },

    /**
     * デバッグログを出力
     */
    debug : (logText)=>{
        if(!LOG.isDebug){
            return;
        }
        let logBoody = getDateTimeString(new Date())   + " : [DEBUG] : " + logText;
        LOG.addHistory(logBoody);
        console.log( logBoody );
    },

    /**
     * 警告ログを出力
     */
    warn : (logText)=>{
        let logBoody = getDateTimeString(new Date())   + " :  [WARN ] : " + logText;
        LOG.addHistory(logBoody);
        console.warn( logBoody );
    },

    /**
     * エラーログを出力
     */
    error : (logText)=>{
        let logBoody = getDateTimeString(new Date()) + " : [ERROR] :" + logText;
        LOG.addHistory(logBoody);
        console.warn( logBoody );
        console.trace();
    },
    history:[],
    addHistory:(logtext)=>{
        LOG.history.push(logtext);
        while(LOG.history.length > 20){
            LOG.history.shift();
        }
    }
}

/**
 * エラーメッセージを生成
 * フレームワーク内で例外を発生させる場合はこのメソッドでメッセージを作成すること
 * @param { string } msg 
 * @returns 
 */
 function createErrorMessage(msg){
    return "[ERROR] : DGLError - " + msg;
}

/**
 * スマホかどうかの簡易チェック
 * @returns true:スマホ / false:スマホ以外
 */
function isPhone(){
	// 判定方法はここを参照した
	// https://www.site-convert.com/archives/2188
/*  
	if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
		// スマホ
		return true;
	} else {
		// PC
		return false;
	}
*/
    if(navigator.userAgent.match(/(iPhone|iPod|Android.*Mobile)/i)){
        // スマホ（iPhone・Androidスマホ）の場合の処理を記述
		return true;
    }else{
        // PC・タブレットの場合の処理を記述
		return false;
    }

}

/**
 * 日時を文字列(yyyy/mm/dd hh-mi-ss)に変換する
 * @param {Date} datetime 
 * @returns 
 */
function getDateTimeString(datetime){
    var yyyy = datetime.getFullYear();
    var mm = ('0' + (datetime.getMonth() + 1)).slice(-2);
    var dd = ('0' + datetime.getDate()).slice(-2);
    var hh = ('0' + datetime.getHours()).slice(-2);
    var mi = ('0' + datetime.getMinutes()).slice(-2);
    var ss = ('0' + datetime.getSeconds()).slice(-2);
    
    return yyyy+ "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
}
