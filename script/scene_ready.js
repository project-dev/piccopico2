
function scene_ready_register(){
    // シーンの登録
    let scene = createSceneObject("ready");
    scene.onInitalize = (sceneObject)=>{
    }

    scene.onFrameStart = (sceneObject)=>{

        if(dglDevice.pointer.event){
            for(let key in dglDevice.pointer.event){
                if("pointerdown" == dglDevice.pointer.event[key].stateName){
                    // なにかアクションが発生したらタイトルへ
                    dglAudio.playSound("piko01");
                    sceneChange("title");
                }
            }
        }
    }

    let inputObject = createDGLObject("ready", "input");
    inputObject.initalize = (dglObj, sceneObject)=>{
    }

    inputObject.main = (dglObj, sceneObject)=>{
        let x = (pngBackBuffer.width - 52) / 2;
        let y = (pngBackBuffer.height - 8) / 2;

        pngBackBuffer.fillRect(pngBackBuffer, 0, 0, pngBackBuffer.width, pngBackBuffer.height, 7);
        putSpritePNG(99, 0, x, y);
    }
}