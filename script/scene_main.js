const MAIN_READY = 0;
const MAIN_PLAY = 1;
const MAIN_FINISH = 2;

let anicnt = 0;

// パレットアニメーション用のパレット情報
let animePlt = [
    new Uint8Array([
        0, 203, 0,
        0, 190, 0,
        0, 176, 0,
    ]),
    new Uint8Array([
        0, 190, 0,
        0, 176, 0,
        0, 203, 0,
    ]),
    new Uint8Array([
        0, 176, 0,
        0, 203, 0,
        0, 190, 0,
    ]),
];


// [音階(C-B,#)][高さ]
// フラット(b)はサポートしない 
// 
let songs = {
    // ちょうちょう
    0:{
        'data':[
            "G4","E4","E4","C0",        // ちょうちょう
            "F4","D4","D4","C0",        // ちょうちょう
            "C4","D4","E4","F4",        // さくらに
            "G4","G4","G4","C0",        // とまれ
            "G4","E4","E4","E4",        // さくらに
            "F4","D4","D4","D4",        // あいやら
            "C4","E4","G4","G4",        // なのはに
            "E4","E4","E4","C0",        // とまれ
            "D4","D4","D4","D4",        // さくらの
            "D4","E4","F4","C0",        // はなの
            "E4","E4","E4","E4",        // はなから
            "E4","F4","G4","C0",        // はなへ
            "G4","E4","E4","E4",        // とまれや
            "F4","D4","D4","C0",        // あそべ
            "C4","E4","G4","G4",        // あそべや
            "E4","E4","E4","C0","C0",   // とまれ
            "C0","C0",
        ],
    },
    // さくら
    1:{
        'data':[
            "F#4","F#4","G#4","C0",     // さくら
            "F#4","F#4","G#4","C0",     // さくら
            "F#4","G#4","A4", "G#4",    // のやまも
            "F#4","G#4","D4", "C0",     // さとも
            "C#4","A3", "C#4","D4",     // みわたす
            "C#4","A3", "G#3","C0",     // かぎり
            "F#4","G#4","A4","G#4",     // かすみか
            "F#4","G#4","D4", "C0",     // くもか
            "C#4","A3", "C#4","D4",     // あさひに
            "C#4","A3", "G#3","C0",     // におう
            "F#4","F#4","G#4","C0",     // さくら
            "F#4","F#4","G#4","C0",     // さくら
            "C#4","D4", "G#4","D4",     // はなざか
            "C#4","C0", "C0", "C0",     // り
        ]
    },
    // 荒城の月
    2:{
        'data':[
            "F#4","F#4","B4","C#5","D5", "C#5","B4", "C0", 
            "G4", "G4", "F#4","E4","F#4","C0", "C0", "C0",
            "F#4","F#4","B4","C#5","D5", "C#5","B4", "C0",  // ねむるさかづき
            "G4" ,"E4", "F#4","F#4","B3","C0", "C0", "C0",
            "C#4","D4", "C#4","B3", "G4", "G4","F#4","C0",
            "E4", "F#4","G4", "G4", "F#4","C0", "C0","C0", 
            "F#4","F#4","B4","C#5","D5", "C#5","B4", "C0", 
            "G4", "E4", "F#4","F#4","B3", "C0", "C0","C0", 

        ]
    },
};


function scene_main_register(){
    let scene = createSceneObject("main");

    // シーンの初期化
    scene.onInitalize = (sceneObject)=>{
        score = 0;
        sceneObject.timer = 30;
        sceneObject.prevTime = new Date();
        sceneObject.isEnd = false;
        sceneObject.state = MAIN_READY;
        sceneObject.counter = 0;
        sceneObject.isEnd = false;
        sceneObject.prevMusicTime = new Date();
        sceneObject.musicCount = 0;
    }

    let mapObj = createDGLObject("main", "map");

    let cellXcount = Math.floor(backBuffer.width / 16) - 2;
    let cellYcount = Math.floor(backBuffer.height / 16) - 2;
    let baseX = (Math.floor(Math.random() * cellXcount) + 1) * 16;
    let baseY = (Math.floor(Math.random() * cellYcount) + 1) * 16;
    mapObj.initalize = (dglObj, sceneObject)=>{
        dglObj.partical = [];

        switch(playMode){
            case PlayMode.normal:
                dglObj.target = [
                    {
                        x:baseX,
                        y:baseY,
                        count:0,
                        puttblno:3,
                        isDisplay:true,
                    },
                ];
                dglAudio.playBGM("bgm01");
            break;
            case PlayMode.choucho:
            case PlayMode.sakura:
            case PlayMode.koujou:
                dglObj.target = [];
            break;
        }
    }
    mapObj.main = (dglObj, sceneObject)=>{
        // 背景
        switch(playMode){
            case PlayMode.normal:
                if("images01" in dglMain.imageMap){
                    for(let y = 0; y < pngBackBuffer.height; y+=8){
                        for(let x = 0; x < pngBackBuffer.width; x+=8){
                            if(x == 0 || y == 0 || x == pngBackBuffer.width - 8 || y == pngBackBuffer.height - 8 ){
                                putSpritePNG(1, 1, x, y);
                            }else{
                                putSpritePNG(1, 0, x, y);
                            }
                        }
                    }
                }
                break;
            case PlayMode.choucho:
            case PlayMode.sakura:
            case PlayMode.koujou:
                if("music_mode_bg" in dglMain.imageMap){
                    putSpritePNG(50, 1, 0, 0);
                }
                break;
        }

        switch(sceneObject.state){
            case MAIN_READY:
                if(sceneObject.counter < 33){
                    sceneObject.counter++;
                }else if(sceneObject.counter == 33){
                    sceneObject.counter = 100;
                    dglAudio.playSound("ready");

                }else if(dglAudio.state["ready"] == false && sceneObject.counter == 100){
                    sceneObject.counter = 200;
                    dglAudio.playSound("go");

                }else if(dglAudio.state["go"] == false && sceneObject.counter == 200){
                    sceneObject.prevTime = new Date();
                    sceneObject.prevMusicTime = new Date();
                    sceneObject.state = MAIN_PLAY;
                    sceneObject.counter = 0;
                }

                if(sceneObject.counter == 100){
                    putSpritePNG(0, 1, Math.floor((backBuffer.width - 76) / 2), Math.floor((backBuffer.height - 24) / 2));
                }else if(sceneObject.counter == 200){
                    putSpritePNG(0, 2, Math.floor((backBuffer.width - 72) / 2), Math.floor((backBuffer.height - 24) / 2));
                }

                break;
            case MAIN_PLAY:
                switch(playMode){
                    case PlayMode.choucho:
                    case PlayMode.sakura:
                    case PlayMode.koujou:
                        const currentDate = new Date()
                        const span = currentDate - sceneObject.prevMusicTime;
                        if(span >= 700){
                            sceneObject.prevMusicTime = currentDate;
                            let music = playMode & 0x00ff;
                            let songData = songs[music];
                            let idx = dglObj.target.length - 1;
                                sceneObject.prevMusicTime = new Date();
                            if(songData.data.length > sceneObject.musicCount ){
                                const tone = songData.data[sceneObject.musicCount];
                                if(tone != "C0"){
                                    const toneArray = ['C','D','E','F','G','A','B'];
                                    // 表示位置を決める
                                    // C,D,E,F,G,A,B
                                    // C4が基準 y = 56
                                    // C3が基準 y = 80
                                    // C2が y =  108
                                    // 音階と高さを分ける
                                    const toneBase = tone.slice(0,1);
                                    const toneLv = tone.slice(-1);
                                    let toneY = ((toneArray.length - 1) - toneArray.indexOf(toneBase)) * 4 - 4;
                                    switch(toneLv){
                                        case '5':
                                            toneY += 52;
                                            break;
                                        case '4':
                                            toneY += 80;
                                            break;
                                        case '3':
                                            toneY += 108;
                                            break;
                                        case '2':
                                            toneY += 136;
                                            break;
                                    }

                                    // 場所をランダムで指定
                                    let cellXcount = Math.floor(backBuffer.width / 16 - 5 - 2);
                                    let baseX = (Math.floor(Math.random() * cellXcount) + 1) * 16 + 40;
                                    dglObj.target.push({
                                        x:baseX,
                                        y:toneY,
                                        count:0,
                                        puttblno:3,
                                        isDisplay:true,
                                        musicData:tone,
                                    });
                                }
                                sceneObject.musicCount++;
                                if(sceneObject.musicCount >= songData.data.length){
                                    // 終了
                                    sceneObject.state = MAIN_FINISH;
                                    sceneObject.isEnd = true;
                                    sceneObject.timer = 0;
                                    if(score > hiscore[playMode]){
                                        hiscore[playMode] = score;
                                    }
                                }
                            }
                        }
                    break;
                }

                // ピコっとやる
                if(dglDevice.pointer.event && !sceneObject.isEnd){
                    for(let key in dglDevice.pointer.event){
                        if("pointerdown" == dglDevice.pointer.event[key].stateName){
                            let isHit = false;
                            let pikoSe = '';

                            for(let k = 0; k < dglObj.target.length; k++){
                                let ptn = Math.floor(dglObj.target[k].count / 8);
                                if(dglObj.target[k].puttblno == 3 && (ptn >= 2 && ptn <= 5)){
                                    let sx = dglObj.target[k].x;
                                    let ex = sx + 16;
                                    let sy = dglObj.target[k].y;
                                    let ey = sy + 16;
                                    let px = dglDevice.pointer.event[key].x;
                                    let py = dglDevice.pointer.event[key].y;
                                    if(sx <= px && px <= ex && sy <= py && py <= ey){
                                        dglObj.target[k].puttblno = 4;
                                        isHit = true;
                                        score++;

                                        switch(playMode){
                                            case PlayMode.normal:
                                                if(score % 10 == 0){
                                                    // ターゲットの追加
                                                    let cellXcount = Math.floor(backBuffer.width / 16) - 2;
                                                    let cellYcount = Math.floor(backBuffer.height / 16) - 2;
                                                    let baseX = (Math.floor(Math.random() * cellXcount) + 1) * 16;
                                                    let baseY = (Math.floor(Math.random() * cellYcount) + 1) * 16;
                                                    dglObj.target.push({
                                                        x:baseX,
                                                        y:baseY,
                                                        count:0,
                                                        puttblno:3,
                                                        isDisplay:true,
                                                    });
                                                }
                                            break;
                                            case PlayMode.choucho:
                                            case PlayMode.sakura:
                                            case PlayMode.koujou:
                                                pikoSe = dglObj.target[k].musicData;
                                            break;
                                        }
                                    }
                                }
                            }
                            if(isHit){
                                // ヒット
                                switch(playMode){
                                    case PlayMode.normal:
                                        dglAudio.playSound("piko01");
                                    break;
                                    case PlayMode.choucho:
                                    case PlayMode.sakura:
                                    case PlayMode.koujou:
                                        dglAudio.playSound(pikoSe);
                                    break;
                                }
                                dglObj.partical[dglObj.partical.length] = {
                                    x:dglDevice.pointer.event[key].x,
                                    y:dglDevice.pointer.event[key].y,
                                    count:0,
                                    ptntblno:20,
                                };

                            }else{
                                // ミス
                                dglAudio.playSound("piko02");
                                dglObj.partical[dglObj.partical.length] = {
                                    x:dglDevice.pointer.event[key].x,
                                    y:dglDevice.pointer.event[key].y,
                                    count:0,
                                    ptntblno:21,
                                };

                            }
                        }
                    }
                }

                break;
            case MAIN_FINISH:
                putSpritePNG(0, 3, Math.floor((backBuffer.width - 91) / 2), Math.floor((backBuffer.height - 24) / 2));
                if(sceneObject.counter == 0){
                    sceneObject.counter = 1;
                    dglAudio.playSound("finish");
                    dglAudio.stopBGM("bgm01");
                }else if(sceneObject.counter >= 33 && dglAudio.state["ready"] == false){
                    if(dglDevice.pointer.event){
                        for(let key in dglDevice.pointer.event){
                            if("pointerdown" == dglDevice.pointer.event[key].stateName){
                                sceneChange("title");
                            }
                        }
                    }
                }
                sceneObject.counter++;
                break;
            
        }

        // ターゲット
        if(sceneObject.state != MAIN_READY){
            for(let j = 0; j < dglObj.target.length; j++){
                if(!dglObj.target[j].isDisplay){
                    continue;
                }

                let ptn = Math.floor(dglObj.target[j].count / 8);
                putSpritePNG(dglObj.target[j].puttblno, ptn, dglObj.target[j].x, dglObj.target[j].y);

                dglObj.target[j].count++;
                if(dglObj.target[j].count >= 8 * 8){
                    switch(playMode){
                        case PlayMode.normal:
                            if(sceneObject.isEnd){
                                dglObj.target[j].isDisplay = false;
                            }else{
                                // 場所をランダムで指定
                                let cellXcount = Math.floor(backBuffer.width / 16) - 2;
                                let cellYcount = Math.floor(backBuffer.height / 16) - 2;
                                let baseX = (Math.floor(Math.random() * cellXcount) + 1) * 16;
                                let baseY = (Math.floor(Math.random() * cellYcount) + 1) * 16;
                                dglObj.target[j].x = baseX;
                                dglObj.target[j].y = baseY;
                                dglObj.target[j].count = 0;
                                dglObj.target[j].puttblno = 3;
                            }
                        break;
                        case PlayMode.choucho:
                        case PlayMode.sakura:
                        case PlayMode.koujou:
                            dglObj.target[j].isDisplay = false;
                        break;
                    }
                }else{
                    
                }
            }
        }

        // ピコピコハンマーのエフェクト
        for(let i = dglObj.partical.length -1 ; i >= 0; i-- ){
            let element = dglObj.partical[i];
            let ptn = Math.floor(element.count / 3);
            try{
                putSpritePNG(element.ptntblno, ptn, element.x - 8, element.y - 8);
                element.count++;
                if(element.count >= 3 * 3){
                    element.count = 0;
                    dglObj.partical.splice(i);
                }
            }catch(e){
                LOG.error("ptnno " + ptn);
                LOG.error(e);
            }
        }

        switch(playMode){
            case PlayMode.choucho:
            case PlayMode.sakura:
            case PlayMode.koujou:
                break;
            case PlayMode.normal:
                // タイマー表示
                if(sceneObject.state == MAIN_PLAY ){
                    let span = new Date() - sceneObject.prevTime;
                    if(span >= 1000){
                        sceneObject.prevTime = new Date();
                        sceneObject.timer--;
                        if(sceneObject.timer <= 0){
                            // 終了
                            sceneObject.state = MAIN_FINISH;
                            sceneObject.isEnd = true;
                            sceneObject.timer = 0;
                            if(score > hiscore[playMode]){
                                hiscore[playMode] = score;
                            }
                        }
                    }
                }
                break;
        }

        let idx =  Math.floor(anicnt / 20);
        pngBackBuffer.palette.set(animePlt[idx], 16 * COLOR_SIZE);
        anicnt++;
        if(anicnt >= 20 * 3){
            anicnt = 0;
        }
    
        // スコア表示
        // SCORE 26 + 6 + 6 * 4
        putSpritePNG(90, 0, 0, 0);

        let scoreText = ("0000" + score).slice(-4);
        let scoreLength = scoreText.length;
        for(let scIdx = 0; scIdx < scoreLength; scIdx++){
            let scoreUnit = scoreText.substring(scIdx,scIdx+1);
            putSpritePNG(91, scoreUnit, 32 + scIdx * 6, 0);
        }

        // ハイスコア表示
        // HISCORE 36 + 6 + 6 * 4
        let hiscrx = (backBuffer.width - (36 + 6 + 6 * 4)) / 2;
        putSpritePNG(90, 1, hiscrx, 0);
        let hiscoreText = ("0000" + hiscore[playMode]).slice(-4);
        let hiscoreLength = hiscoreText.length;
        for(let scIdx = 0; scIdx < hiscoreLength; scIdx++){
            let hiscoreUnit = hiscoreText.substring(scIdx,scIdx+1);
            putSpritePNG(91, hiscoreUnit, hiscrx + 36 + 6 + scIdx * 6, 0);
        }

        switch(playMode){
            case PlayMode.normal:
                // 時間
                // TIME 21 + 6 + 6 * 2
                let timex = backBuffer.width - (21 + 6 + 6 * 2);
                putSpritePNG(90, 2, timex, 0);

                let timerText = ("00" + sceneObject.timer).slice(-2);
                let timerLength = timerText.length;
                for(let tmIdx = 0; tmIdx < timerLength; tmIdx++){
                    let timerUnit = timerText.substring(tmIdx,tmIdx+1);
                    putSpritePNG(91, timerUnit, timex + 21 + 6 + tmIdx * 6, 0);
                }
                break;
            case PlayMode.choucho:
            case PlayMode.sakura:
            case PlayMode.koujou:
                break;
        }
   }
}