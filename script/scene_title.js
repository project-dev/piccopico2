
function scene_title_register(){

    // シーンの登録
    let titleScene = createSceneObject("title");

    // 初期化
    titleScene.onInitalize = (sceneObject)=>{
    };

    // DGLオブジェクトの生成
    let hummer = createDGLObject("title", "hummer");
    let title = createDGLObject("title", "logo");
    let mode_button = createDGLObject("title", "mode_button");
    let hiscore_normal = createDGLObject("title", "hiscore_normal");
    let hiscore_music = createDGLObject("title", "hiscore_choucho");

    // タイトル初期化
    title.initalize = (dglObj, sceneObject)=>{
        dglObj.titleAnimeCount = 0;
        dglObj.titlePalette = scene_title_palette['title'];
        dglObj.startTime = Date.now();
    }

    // ハイスコアを初期化
    hiscore_normal.initalize = (dglObj, sceneObject)=>{
    }

    hiscore_music.initalize = (dglObj, sceneObject)=>{
    }

    hummer.initalize = (dglObj, sceneObject)=>{
        dglObj.hummerPaletteCount = 0;
        dglObj.hummerMoveCount = 0;
    }

    // モード初期化
    mode_button.initalize = (dglObj, sceneObject)=>{
        dglObj.modeAnimeCount = 0;
        dglObj.normalPaletteIndex = 0;
        dglObj.musicPaletteIndex = 0;

        dglObj.normalPlt = scene_title_palette['normal'];
        
        dglObj.musicPlt = scene_title_palette['music'];

        dglObj.noSelectPalette = new Uint8Array([
            107, 107, 107,
            107, 107, 107,
            107, 107, 107,
            107, 107, 107,
            107, 107, 107,
            107, 107, 107,
        ]);

        // 最後のプレイがMusicの場合の対応
        if((playMode & 0xf000) == 0xf000){
            playMode = PlayMode.music;
        }else{
            playMode = PlayMode.normal;
        }

    }
    
    // タイトルメイン処理
    title.main = (dglObj, sceneObject)=>{
        let titleX = (pngBackBuffer.width - 184) / 2;
        let titleY = (pngBackBuffer.height - 40) / 2 - 16;

        putSpritePNG(0, 0, titleX, titleY);

        // パレットアニメーション
        dglObj.titleAnimeCount++;

        titlePaletteIndex = Math.floor(dglObj.titleAnimeCount / 10);
        if(dglObj.titleAnimeCount >= 10 * (dglObj.titlePalette.length)){
            dglObj.titleAnimeCount = 0;
            titlePaletteIndex = 0;
        }
        if(pngBackBuffer.palette.set){
            pngBackBuffer.palette.set(dglObj.titlePalette[titlePaletteIndex], 16 * 3 * COLOR_SIZE);
        }

        // 30秒経ったら、デモへ遷移
        //if (Date.now() - dglObj.startTime >= 30_000) {
        if (Date.now() - dglObj.startTime >= 5_000) {
            sceneChange("demo");
        }
    }

    // ハイスコア
    hiscore_normal.main = (dglObj, sceneObject)=>{
        if(playMode != PlayMode.normal){
            return;
        }
        // ハイスコア表示
        let hiscrx = (pngBackBuffer.width  - 48 * 2) / 2;
        let hiscry = (pngBackBuffer.height - 40    ) / 2 + 40 + 9;
        //putSpritePNG(90, 1, hiscrx, hiscry);

        let hiscoreText = ("0000" + hiscore[PlayMode.normal]).slice(-4);
        let hiscoreLength = hiscoreText.length;
        for(let scIdx = 0; scIdx < hiscoreLength; scIdx++){
            let hiscoreUnit = hiscoreText.substring(scIdx,scIdx+1);
            putSpritePNG(91, hiscoreUnit, hiscrx + 6 + scIdx * 6, hiscry);
        }
    }    

    hiscore_music.main = (dglObj, sceneObject)=>{
        let modes = [
            PlayMode.choucho,
            PlayMode.sakura,
            PlayMode.koujou
        ];

        // ハイスコア表示
        if(playMode == PlayMode.normal){
            return;
        }

        modes.forEach(mode => {
            let idx = (mode & 0x00ff) + 1;
            let hiscrx = (pngBackBuffer.width  - 48 * 2) + 44;
            let hiscry = (pngBackBuffer.height - 40    ) / 2 + 40 + 9 * idx;

            let hiscoreText = ("0000" + hiscore[mode]).slice(-4);
            let hiscoreLength = hiscoreText.length;
            for(let scIdx = 0; scIdx < hiscoreLength; scIdx++){
                let hiscoreUnit = hiscoreText.substring(scIdx,scIdx+1);
                putSpritePNG(91, hiscoreUnit, hiscrx + 6 + scIdx * 6, hiscry);
            }
        });
    }    

    // モードボタン
    mode_button.main = (dglObj, sceneObject)=>{
        let normalX = (pngBackBuffer.width  - 48 * 2) / 2;
        let musicX  = (pngBackBuffer.width  - 48 * 2);
        let modeY   = (pngBackBuffer.height - 40    ) / 2 + 40;

        // Normal
        putSpritePNG(0, 4, normalX, modeY);

        // Music
        putSpritePNG(0, 5, musicX, modeY);

        if(playMode != PlayMode.normal){
            // プレイする曲を表示
            putSpritePNG(0, 6, musicX, modeY + (8 + 1)* 1);
            putSpritePNG(0, 7, musicX, modeY + (8 + 1) * 2);
            putSpritePNG(0, 8, musicX, modeY + (8 + 1) * 3);

        }
        // モードセレクト

        // パレットアニメーション
        dglObj.modeAnimeCount++;
        switch(playMode){
            case PlayMode.normal:
                dglObj.normalPaletteIndex = Math.floor(dglObj.modeAnimeCount / 10);
                dglObj.musicPaletteIndex = 0;
                if(dglObj.modeAnimeCount >= 10 * (dglObj.normalPlt.length - 1)){
                    dglObj.modeAnimeCount = 0;
                    dglObj.normalPaletteIndex = 0;
                }
                if(pngBackBuffer.palette.set){
                    pngBackBuffer.palette.set(dglObj.normalPlt[dglObj.normalPaletteIndex], 16 * 13 * COLOR_SIZE);
                    pngBackBuffer.palette.set(dglObj.noSelectPalette, 16 * 14 * COLOR_SIZE);
                }
                break;

        default:
            dglObj.normalPaletteIndex = 0;
            dglObj.musicPaletteIndex = Math.floor(dglObj.modeAnimeCount / 10);
            if(dglObj.modeAnimeCount >= 10 * (dglObj.musicPlt.length - 1)){
                dglObj.modeAnimeCount = 0;
                dglObj.musicPaletteIndex = 0;
            }
            if(pngBackBuffer.palette.set){
                pngBackBuffer.palette.set(dglObj.noSelectPalette, 16 * 13 * COLOR_SIZE);
                pngBackBuffer.palette.set(dglObj.musicPlt[dglObj.musicPaletteIndex], 16 * 14 * COLOR_SIZE);
            }
            break;
        }

        if(dglDevice.pointer.event){
            for(let key in dglDevice.pointer.event){
                if("pointerdown" == dglDevice.pointer.event[key].stateName){
                    let px = dglDevice.pointer.event[key].x;
                    let py = dglDevice.pointer.event[key].y;

                    // タップした位置で処理を湧ける
                    if(normalX <= px && px <= normalX + 48 &&
                        modeY <= py && py <= modeY + 40
                    ){
                        if(playMode != PlayMode.normal){
                            playMode = PlayMode.normal;
                            dglAudio.playSound("piko02");
                        }else{
                            dglAudio.playSound("piko01");
                            sceneChange("main");
                        }
                    }

                    if(musicX <= px && px <= musicX + 48 &&
                        modeY <= py && py <= modeY + 40
                    ){
                        switch(playMode){
                            case PlayMode.normal:
                                playMode = PlayMode.music;
                                break;
                            default:
                                break;
                        }
                        dglAudio.playSound("piko02");
                    }

                    if(playMode == PlayMode.music){
                        if(musicX <= px && px <= musicX + 48 &&
                            (modeY + (8 + 1) * 1) <= py && py <=  (modeY + (8 + 1) * 1) * 1 + 40
                        ){
                            playMode = PlayMode.choucho;
                            dglAudio.playSound("piko01");
                            sceneChange("main");
                        }

                        if(musicX <= px && px <= musicX + 48 &&
                            (modeY + (8 + 1) * 2 ) <= py && py <=  (modeY + (8 + 1) * 2 ) + 40
                        ){
                            playMode = PlayMode.sakura;
                            dglAudio.playSound("piko01");
                            sceneChange("main");
                        }
    
                        if(musicX <= px && px <= musicX + 48 &&
                            (modeY + (8 + 1) * 3 ) <= py && py <=  (modeY + (8 + 1) * 3 ) + 40
                        ){
                            playMode = PlayMode.koujou;
                            dglAudio.playSound("piko01");
                            sceneChange("main");
                        }

                    }
                    break;
                }
            }
        }
    }

    hummer.main = (dglObj, sceneObject)=>{
        let hummer_plt = scene_demo_palette['picopico_hummer'];
        let hummer_plt_idx = 0;
        dglObj.hummerPaletteCount++;
        if(Math.floor(dglObj.hummerPaletteCount / 8) <= 2){
            hummer_plt_idx = Math.floor(dglObj.hummerPaletteCount / 8);
        }else{
            dglObj.hummerPaletteCount = 0;
        }
        pngBackBuffer.palette.set(hummer_plt[hummer_plt_idx], (16 * 5 + 13) * COLOR_SIZE);

        let hummer_x = (backBuffer.width - 80) / 2 /*- 16*/;
        let hummer_y = (backBuffer.height - 104) / 2 /*+ 16*/;

        // 上下に揺らす
        dglObj.hummerMoveCount += 0.05;
        hummer_y += Math.floor(Math.sin(dglObj.hummerMoveCount) * 12);
        putSpritePNG(81, 4, hummer_x, hummer_y);
    }
}