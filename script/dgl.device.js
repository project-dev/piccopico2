'use strict';

/**
 * デバイス関連管理オブジェクト
 */
let dglDevice;

/**
 * デバイス関連管理オブジェクトの初期化
 * dglInitalizeから呼び出される
 * @param {*} parentElement 親エレメント
 */
function dglDeviceInitalize(parentElement){
    // デバイス関係の情報
    dglDevice = {

        /**
         * マウス情報
         */
        mouse:{
            /**
             * バックバッファ状のマウスのX座標
             */
            x:-1,
            
            /**
             * バックバッファ状のマウスのY座標
             */
            y:-1,
            
            /**
             * イベント情報
             */
            event:null,

            /**
             * MouseEventをdglDevice.mouse.eventに設定する
             */
            setEvent:(stateName, e)=>{
                // 本当はイベントをコピーしたい
                dglDevice.mouse.event = {
                    stateName:stateName,
                    altKey:e.altKey,
                    button:e.button,
                    buttons:e.buttons,
                    clientX:e.clientX,
                    clientY:e.clientY,
                    ctrlKey:e.ctrlKey,
                    metaKey:e.metaKey,
                    movementX:e.movementX,
                    movementY:e.movementY,
                    offsetX:e.offsetX,
                    offsetY:e.offsetY,
                    pageX:e.pageX,
                    pageY:e.pageY,
                    region:e.region,
                    relatedTarget:e.relatedTarget,
                    screenX:e.screenX,
                    screenY:e.screenY,
                    shiftKey:e.shiftKey,
                    rotation:e.rotation,
                    scale:e.scale
                };

                // マウスの座標をバックバッファ状の座標に変換する
                convertMousePosition(e);
            },
        },

        /**
         * タッチ情報
         */
        touch:{
            event:{},
            setEvent:(stateName, e)=>{
                dglDevice.touch.event = {
                    stateName:stateName,
                    altKey:e.altKey,
                    changedTouches:e.changedTouches,
                    ctrlKey:e.ctrlKey,
                    metaKey:e.metaKey,
                    shiftKey:e.shiftKey,
                    targetTouches:e.targetTouches,
                    touches:e.touches,

                };
            },
        },
        pointer:{
            event:{},
            setEvent:(stateName, e)=>{
                LOG.debug("POINTER : " + e.pointerId + " : " + stateName);
                let event  = {
                    stateName:stateName,

                    altKey:e.altKey,
                    button:e.button,
                    buttons:e.buttons,
                    clientX:e.clientX,
                    clientY:e.clientY,
                    ctrlKey:e.ctrlKey,
                    metaKey:e.metaKey,
                    movementX:e.movementX,
                    movementY:e.movementY,
                    offsetX:e.offsetX,
                    offsetY:e.offsetY,
                    pageX:e.pageX,
                    pageY:e.pageY,
                    region:e.region,
                    relatedTarget:e.relatedTarget,
                    screenX:e.screenX,
                    screenY:e.screenY,
                    shiftKey:e.shiftKey,
                    rotation:e.rotation,
                    scale:e.scale,
                    
                    // イベントの原因となっているポインタの一意の識別子。
                    pointerId: e.pointerId,
                    // ポインタの接触ジオメトリの幅（X 軸の大きさ、CSS ピクセル単位）
                    width: e.width,
                    // ポインタの接触ジオメトリの高さ（Y 軸上の大きさ、CSS ピクセル単位）。
                    height: e.height,
                    // 0 から 1 の範囲のポインタ入力の正規化された圧力。
                    pressure: e.pressure,
                    // ポインタ入力の正規化された接線圧力
                    tangentialPressure: e.tangentialPressure,
                    // イベントの原因となったデバイスタイプ（マウス、ペン、タッチなど）を示します。
                    pointerType: e.pointerType,
                    // Y-Z 平面と、ポインタ（ペン/スタイラスなど）軸と Y 軸の両方を含む平面との間の平面角度（度単位、-90 から 90 の範囲）。
                    tiltX: e.tiltX,
                    // X-Z 平面と、ポインタ（ペン/スタイラスなど）軸と X 軸の両方を含む平面との間の平面角度（度単位、-90 から 90 の範囲）。
                    tiltY: e.tiltY,
                    // ポインタ（ペン/スタイラスなど）の長軸を中心とした時計回りの回転の度数（0 から 359 の範囲の値）。
                    twist: e.twist,
                    // ポインタがこのポインタタイプのプライマリポインタを表すかどうかを示します。
                    isPrimary: e.isPrimary
                };
                convertPosition(event);
                dglDevice.pointer.event[e.pointerId] = event;
/*
                switch(stateName){
                    case "lostpointercapture":
                    case "pointerout":
                    case "pointerleave":
                        //delete dglDevice.pointer.event[e.pointerId];
                        dglDevice.pointer.event[e.pointerId] = event;
                        break;
                    default:
                        dglDevice.pointer.event[e.pointerId] = event;
                        break;
                };
*/
            },
        },

        /**
         * キー情報
         */
        key:{
            event:null,
            setEvent:(stateName, e)=>{
            }
        },

        /**
         * ゲームパッド情報
         */
        pad:{},
        reset:()=>{
            dglDevice.mouse.event = null;
            dglDevice.touch.event = {};
            dglDevice.pointer.event = {};
        }
    };

    if(!parentElement){
        parentElement = document.getElementsByTagName("body").item(0);
    }

    // -------------------------------------------------
 	// mouse event
    // -------------------------------------------------
    // クリック
    parentElement.addEventListener("click", function(e){
        if(isTouchEnable()){
            return;
        }
        dglDevice.mouse.setEvent("click", e);
	});

    // ダブルクリック
	parentElement.addEventListener("dblclick", function(e){
        if(isTouchEnable()){
            return;
        }
        dglDevice.mouse.setEvent("dbclick", e);
	});
   
    // マウス移動
    parentElement.addEventListener("mousemove", function(e){
        if(isTouchEnable()){
            return;
        }
        dglDevice.mouse.setEvent("move", e);
	});

    // -------------------------------------------------
	// key event
    // -------------------------------------------------
    
    // キーダウン
    parentElement.addEventListener("keydown", function(e){
		dglDevice.key.setEvent("keydown", e);
	});

    // キーアップ
	parentElement.addEventListener("keyup", function(e){
		dglDevice.key.setEvent("keyup", e);
	});

    // -------------------------------------------------
	// touch event
    // -------------------------------------------------

    // タッチ開始
    document.body.addEventListener("touchstart", function(e){
        dglDevice.touch.setEvent("touchstart", e);
	});

	// タッチ移動
	document.body.addEventListener("touchmove", function(e){
        dglDevice.touch.setEvent("touchmove", e);
	});

	// タッチ終了
	document.body.addEventListener("touchend", function(e){
        dglDevice.touch.setEvent("touchend", e);
	});

    // -------------------------------------------------
	// point event
    // -------------------------------------------------
    document.body.addEventListener("pointerover", function(e){
        dglDevice.pointer.setEvent("pointerover", e);
	});

    document.body.addEventListener("pointerenter", function(e){
        dglDevice.pointer.setEvent("pointerenter", e);
	});

    document.body.addEventListener("pointerdown", function(e){
        dglDevice.pointer.setEvent("pointerdown", e);
	});

    document.body.addEventListener("pointermove", function(e){
        dglDevice.pointer.setEvent("pointermove", e);
	});

    document.body.addEventListener("pointerup", function(e){
        dglDevice.pointer.setEvent("pointerup", e);
	});

    document.body.addEventListener("pointercancel", function(e){
        dglDevice.pointer.setEvent("pointercancel", e);
	});

    document.body.addEventListener("pointerout", function(e){
        dglDevice.pointer.setEvent("pointerout", e);
	});

    document.body.addEventListener("pointerleave", function(e){
        dglDevice.pointer.setEvent("pointerleave", e);
	});

    document.body.addEventListener("gotpointercapture", function(e){
        dglDevice.pointer.setEvent("gotpointercapture", e);
	});

    document.body.addEventListener("lostpointercapture", function(e){
        dglDevice.pointer.setEvent("lostpointercapture", e);
	});


    // -------------------------------------------------
	// game pad event
    // -------------------------------------------------

    // ゲームパッド接続
    window.addEventListener("gamepadconnected", function(e){
//		var pad = e.gamepad;
//		mainObj.GamePad[e.gamepad.index] = pad;
//		console.log("connected : index = " +pad.index + " / id = " + pad.id + " / mapping : " + pad.mapping);

	});

	// ゲームパッド切断
	window.addEventListener("gamepaddisconnected", function(e){
//		console.log("disconnect : index = " + e.gamepad.index + " / id = " + pad.id + " / mapping : " + pad.mapping);
//		delete mainObj.GamePad[e.gamepad.index];
	});

}

/**
 * タッチイベントが有効か無効かを判定する
 * 参考：https://shanabrian.com/web/javascript/is-touch-device.php
 * @returns 
 */
function isTouchEnable(){
    if ('ontouchstart' in window || navigator.msPointerEnabled) {
        return true;
    } else {
        return false;
    }    
}

/**
 * マウスの座標をバックバッファに変換する
 * @param {event} mouseEvent 
 */
 function convertMousePosition(mouseEvent){
	var mousex = mouseEvent.pageX;
	var mousey = mouseEvent.pageY;

	var bgw = backBuffer.width;
	var bgh = backBuffer.height;

	var w = frontBuffer.width;
	var h = frontBuffer.height;

	if(dglMain.displayInfo.target == "device"){
		mousex = mousex - frontBuffer.getBoundingClientRect().x;
		mousey = mousey - frontBuffer.getBoundingClientRect().y;
	}else{
		var x = Math.floor((w - bgw * dglMain.displayInfo.scale) / 2);
		var y = Math.floor((h - bgh * dglMain.displayInfo.scale) / 2);
		
		if(
			x <= mousex && mousex <= x + Math.floor(bgw * dglMain.displayInfo.scale)
		&&	y <= mousey && mousey <= y + Math.floor(bgh * dglMain.displayInfo.scale)
		){
			// 範囲内
			mousex = Math.floor((mousex - x) / dglMain.displayInfo.scale);
			mousey = Math.floor((mousey - y) / dglMain.displayInfo.scale);
        }else{
            // 範囲外の場合、前回の位置を再利用
            mousex = dglDevice.mouse.x;
            mousey = dglDevice.mouse.y;
        }
	}
    dglDevice.mouse.x = mousex;
    dglDevice.mouse.y = mousey;
}

function convertPosition(mouseEvent){
	var mousex = mouseEvent.pageX;
	var mousey = mouseEvent.pageY;

	var bgw = backBuffer.width;
	var bgh = backBuffer.height;

	var w = frontBuffer.width;
	var h = frontBuffer.height;

	if(dglMain.displayInfo.target == "device"){
		mousex = mousex - frontBuffer.getBoundingClientRect().x;
		mousey = mousey - frontBuffer.getBoundingClientRect().y;
	}else{
		var x = Math.floor((w - bgw * dglMain.displayInfo.scale) / 2);
		var y = Math.floor((h - bgh * dglMain.displayInfo.scale) / 2);
		
		if(
			x <= mousex && mousex <= x + Math.floor(bgw * dglMain.displayInfo.scale)
		&&	y <= mousey && mousey <= y + Math.floor(bgh * dglMain.displayInfo.scale)
		){
			// 範囲内
			mousex = Math.floor((mousex - x) / dglMain.displayInfo.scale);
			mousey = Math.floor((mousey - y) / dglMain.displayInfo.scale);
        }else{
            // 範囲外の場合、前回の位置を再利用
            mousex = dglDevice.mouse.x;
            mousey = dglDevice.mouse.y;
        }
	}
    mouseEvent.x = mousex;
    mouseEvent.y = mousey;
}

/**
 * タッチの座標をバックバッファに変換する
 * @param {event} touchEvent 
 */
 function convertTouchPosition(touchEvent){
	var mousex = mouseEvent.pageX;
	var mousey = mouseEvent.pageY;

	var bgw = backBuffer.width;
	var bgh = backBuffer.height;

	var w = frontBuffer.width;
	var h = frontBuffer.height;

    if(touchEvent.changedTouches){
        if(dglMain.displayInfo.target == "device"){
//            dglDevice.touch.changedTouches
        }

    }

    if(touchEvent.targetTouches){
        touchEvent.targetTouches.forEach(touch =>{
        });
    }

    if(touchEvent.touches){
        
    }

    if(dglMain.displayInfo.target == "device"){
		mousex = mousex - frontBuffer.getBoundingClientRect().x;
		mousey = mousey - frontBuffer.getBoundingClientRect().y;
	}else{
		var x = Math.floor((w - bgw * dglMain.displayInfo.scale) / 2);
		var y = Math.floor((h - bgh * dglMain.displayInfo.scale) / 2);
		
		if(
			x <= mousex && mousex <= x + Math.floor(bgw * dglMain.displayInfo.scale)
		&&	y <= mousey && mousey <= y + Math.floor(bgh * dglMain.displayInfo.scale)
		){
			// 範囲内
			mousex = Math.floor((mousex - x) / dglMain.displayInfo.scale);
			mousey = Math.floor((mousey - y) / dglMain.displayInfo.scale);
        }else{
            // 範囲外の場合、前回の位置を再利用
            mousex = dglDevice.mouse.x;
            mousey = dglDevice.mouse.y;
        }
	}
    dglDevice.mouse.x = mousex;
    dglDevice.mouse.y = mousey;


	//if(this.isDispDebugInfo){
	//	console.log("mx : " + mousex + "/my : " + mousey);
	//}
}
