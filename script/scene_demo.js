
function scene_demo_register(){

    // シーンの登録
    let scene = createSceneObject("demo");

    /**
     * 
     * @param {*} sceneObject 
     */
    scene.onInitalize = (sceneObject)=>{

    }

    /**
     * 
     * @param {*} sceneObject 
     */
    scene.onFrameStart = (sceneObject)=>{
    }

    /**
     * 
     * @param {*} sceneObject 
     */
    scene.onFrameEnd = (sceneObject)=>{
    }

    // MV用オブジェクト
    let mvObject = createDGLObject("demo", "mv");
    
    /**
     * 
     * @param {*} dglObj 
     * @param {*} sceneObject 
     */
    mvObject.initalize = (dglObj, sceneObject)=>{
        dglAudio.playBGM("themesong", false, ()=>{
            // BGM再生完了後タイトルへ
            sceneChange("title");
        });
        mvObject.startTime = dglAudio.context.currentTime;

        // 定数
        mvObject.songPutTblNo = 80;
        mvObject.demoPutTblNo = 81;
        
        // パート：神が与えしその狂気
        mvObject.hummerPaletteCount = 0;
        mvObject.hummerMoveCount = 0;
        mvObject.leftHandMoveCount = 0.5;
        mvObject.rightHandMoveCount = 1.0;
        mvObject.leftThunderCount = 0;
        mvObject.rightThunderCount = 150;
        mvObject.eyeCount = 0;
        mvObject.titleAnimeCount = 0;
        mvObject.pikoPos = [];
        mvObject.pikoCnt = 0;
        mvObject.mogCount = 0;

        // パート：無慈悲に振り下ろされた
        mvObject.hx = [];
        mvObject.hy = [];
        mvObject.addCnt = [];
        mvObject.downCnt = [];
        let downWidth = Math.floor((backBuffer.width - 88)/ 5);
        for(var i = 0; i < 5; i++){
            mvObject.hx[i] = Math.floor(Math.random() * downWidth) + (downWidth * (i + 1)) + 88;
            mvObject.hy[i] = Math.floor(Math.random() * 64 + 32) * -1;
            mvObject.addCnt[i] = Math.floor(Math.random() * 5) + 1;
            mvObject.downCnt[i] = 0;
        }
    }

    /**
     * 
     * @param {*} dglObj 
     * @param {*} sceneObject 
     */
    mvObject.main = (dglObj, sceneObject)=>{

        const elapsed = dglAudio.context.currentTime - dglObj.startTime;
        const songy = 129;

        // 経過時間でアニメーションを制御する
        if(elapsed <= 4.762){
            // イントロ
            putSpritePNG(dglObj.demoPutTblNo, 0, backBuffer.width - 200, backBuffer.height - 152);

        }else if(elapsed <= 6.213){

            if(elapsed >= 4.681){
                putSpritePNG(dglObj.demoPutTblNo, 7,  32, 24);
            }
            if(elapsed >=  4.919){
                putSpritePNG(dglObj.demoPutTblNo, 8,  64, 48);
            }
            if(elapsed >= 5.175){
                putSpritePNG(dglObj.demoPutTblNo, 7, 128, 48);
            }
            if(elapsed >= 5.430){
                putSpritePNG(dglObj.demoPutTblNo, 8, 160, 72);
            }

            dglObj.titleAnimeCount++;
            let picopico_plt = scene_title_palette['title'];
            let titlePaletteIndex = Math.floor(dglObj.titleAnimeCount / 5);
            if(dglObj.titleAnimeCount >= 5 * (picopico_plt.length)){
                dglObj.titleAnimeCount = 0;
                titlePaletteIndex = 0;
            }
            pngBackBuffer.palette.set(picopico_plt[titlePaletteIndex], 16 * 3 * COLOR_SIZE);

        }else if(elapsed <= 12.76){
            // 神が与えしこの狂気

            // -- 背景 ------
            mvObject.bg_thunder(dglObj);

            // -- ピ神 ------
            putSpritePNG(dglObj.demoPutTblNo, 1,   0,  0);

            // 左手(回転)
            mvObject.leftHandMoveCount += 0.025;
            let leftHand_x = 16;
            let leftHand_y = 72;
            leftHand_x += Math.floor(Math.sin(mvObject.leftHandMoveCount) * 6);
            leftHand_y += Math.floor(Math.cos(mvObject.leftHandMoveCount) * 6);
            putSpritePNG(dglObj.demoPutTblNo, 2,  leftHand_x, leftHand_y);

            // 右手(回転)
            mvObject.rightHandMoveCount += 0.025;
            let rightHand_x = 136;
            let rightHand_y = 24;
            rightHand_x += Math.floor(Math.cos(mvObject.leftHandMoveCount) * 6);
            rightHand_y += Math.floor(Math.sin(mvObject.leftHandMoveCount) * 6);
            putSpritePNG(dglObj.demoPutTblNo, 3, rightHand_x, rightHand_y);

            // -- ハンマー -------
            mvObject.hummer_anime01(dglObj);

            // -- 歌詞 ------
            let sonWidth = getCDS(dglObj.songPutTblNo, 0).width;
            let songx = (backBuffer.width - sonWidth) / 2;
            putSpritePNG(dglObj.songPutTblNo, 0, songx, songy);

        }else if(elapsed <= 18.79){
            // 子供の瞳光り出す

            // -- 背景 ------
            mvObject.bg_thunder(dglObj);

            // -- ハンマー -------
            mvObject.hummer_anime01(dglObj);

            // -- 子供１ -------
            mvObject.child_anime(dglObj);

            // -- 歌詞 ------
            let sonWidth = getCDS(dglObj.songPutTblNo, 1).width;
            let songx = (backBuffer.width - sonWidth) / 2;
            putSpritePNG(dglObj.songPutTblNo, 1, songx, songy);

        }else if(elapsed <= 25.07){
            // 無慈悲に振り降ろされた
            for(var i = 0; i < 5; i++){
                let z = Math.floor(mvObject.downCnt[i] / 3);
                putSpritePNG(85, 3, mvObject.hx[i], mvObject.hy[i] + z);
                mvObject.downCnt[i] += mvObject.addCnt[i];
            }

            // -- 歌詞 ------
            let sonWidth = getCDS(dglObj.songPutTblNo, 2).width;
            let songx = (backBuffer.width - sonWidth) / 2;
            putSpritePNG(dglObj.songPutTblNo, 2, songx, songy);

        }else if(elapsed <= 29.436){
            // 鳴り響くピコピコと
            mvObject.pikoCnt++;
            if(mvObject.pikoCnt % 5 == 0){
                let pikoX = Math.floor(Math.random() * (backBuffer.width / 2 - 24));
                let pikoY = Math.floor(Math.random() * (backBuffer.height / 2 - 16));
                mvObject.pikoPos.push({'x':pikoX, 'y':pikoY});

                pikoX = Math.floor(Math.random() * (backBuffer.width / 2 - 24)) + backBuffer.width / 2;
                pikoY = Math.floor(Math.random() * (backBuffer.height / 2 - 16));
                mvObject.pikoPos.push({'x':pikoX, 'y':pikoY});

                pikoX = Math.floor(Math.random() * (backBuffer.width / 2 - 24));
                pikoY = Math.floor(Math.random() * (backBuffer.height / 2 - 16)) + backBuffer.height / 2;
                mvObject.pikoPos.push({'x':pikoX, 'y':pikoY});

                pikoX = Math.floor(Math.random() * (backBuffer.width / 2 - 24)) + backBuffer.width / 2;
                pikoY = Math.floor(Math.random() * (backBuffer.height / 2 - 16)) + backBuffer.height / 2;
                mvObject.pikoPos.push({'x':pikoX, 'y':pikoY});
            }
            mvObject.pikoPos.forEach(pos => {
                putSpritePNG(dglObj.demoPutTblNo, 9, pos.x, pos.y);
            });

            // -- 歌詞 ------
            let sonWidth = getCDS(dglObj.songPutTblNo, 3).width;
            let songx = (backBuffer.width - sonWidth) / 2;
            putSpritePNG(dglObj.songPutTblNo, 3, songx, songy);

        }else if(elapsed <= 31.00){
            // サビ前のリフ
            if(elapsed >= 29.437){
                putSpritePNG(dglObj.demoPutTblNo, 7,  32, 24);
            }
            if(elapsed >= 29.681){
                putSpritePNG(dglObj.demoPutTblNo, 8,  64, 48);
            }
            if(elapsed >=29.954){
                putSpritePNG(dglObj.demoPutTblNo, 7, 128, 48);
            }
            if(elapsed >= 30.283){
                putSpritePNG(dglObj.demoPutTblNo, 8, 160, 72);
            }

            dglObj.titleAnimeCount++;
            let picopico_plt = scene_title_palette['title'];
            let titlePaletteIndex = Math.floor(dglObj.titleAnimeCount / 5);
            if(dglObj.titleAnimeCount >= 5 * picopico_plt.length){
                dglObj.titleAnimeCount = 0;
                titlePaletteIndex = 0;
            }
            pngBackBuffer.palette.set(picopico_plt[titlePaletteIndex], 16 * 3 * COLOR_SIZE);

        }else if(elapsed <= 32.745){
            // ピコピコ
            if(elapsed <= 31.349){
                putSpritePNG(85, 0, 128, 88);
            }else{
                putSpritePNG(85, 1, 128, 88);
            }
            if(elapsed <= 31.849){
                putSpritePNG(85, 0,  96, 88);
            }else{
                putSpritePNG(85, 1,  96, 88);
            }
            if(elapsed <= 32.427){
                putSpritePNG(85, 0,  64, 88);
            }else{
                putSpritePNG(85, 1,  64, 88);
            }

            // -- 歌詞 ------
            let sonWidth = getCDS(dglObj.songPutTblNo, 4).width;
            let songx = (backBuffer.width - sonWidth) / 2;
            putSpritePNG(dglObj.songPutTblNo, 4, songx, songy);

        }else if(elapsed <= 37.048){
            // 覚悟しろ出てきたとこ叩いてやる

            // 背景
            putSpritePNG(82, 9, 0, 0);

            // モグラ本体
            let mogx = Math.floor(backBuffer.width / 2);
            let mogy = 24;
            putSpritePNG(82, 0, mogx, mogy);

            // 瞳のアニメ
            let mogEyePutNo = Math.floor(dglObj.mogCount / 10 % 3 + 1);
            putSpritePNG(82, mogEyePutNo, mogx + 8, mogy + 16);

            // パレット操作
            let mog_plt = scene_demo_palette['mog'];
            if(elapsed <= 33.000){
                pngBackBuffer.palette.set(mog_plt[0], (16 * 6 + 7) * COLOR_SIZE);
            }else if(elapsed <= 33.300){
                pngBackBuffer.palette.set(mog_plt[1], (16 * 6 + 7) * COLOR_SIZE);
            }else if(elapsed <= 33.600){
                pngBackBuffer.palette.set(mog_plt[2], (16 * 6 + 7) * COLOR_SIZE);
            }else if(elapsed <= 33.900){
                pngBackBuffer.palette.set(mog_plt[3], (16 * 6 + 7) * COLOR_SIZE);
            }else if(elapsed <= 34.200){
                pngBackBuffer.palette.set(mog_plt[4], (16 * 6 + 7) * COLOR_SIZE);
            }else{
                pngBackBuffer.palette.set(mog_plt[5], (16 * 6 + 7) * COLOR_SIZE);
            }

            dglObj.mogCount++;

            // -- 歌詞 ------
            let sonWidth = getCDS(dglObj.songPutTblNo, 5).width;
            let songx = (backBuffer.width - sonWidth) / 2;
            putSpritePNG(dglObj.songPutTblNo, 5, songx, songy);

        }else if(elapsed <= 38.913){
            // ピコピコ
            if(elapsed <= 37.432){
                putSpritePNG(85, 2,  96, 88);
            }else{
                putSpritePNG(85, 3,  96, 88);
            }
            if(elapsed <= 37.971){
                putSpritePNG(85, 2, 128, 88);
            }else{
                putSpritePNG(85, 3, 128, 88);
            }
            if(elapsed <= 38.607){
                putSpritePNG(85, 2, 160, 88);
            }else{
                putSpritePNG(85, 3, 160, 88);
            }

            // -- 歌詞 ------
            let sonWidth = getCDS(dglObj.songPutTblNo, 6).width;
            let songx = (backBuffer.width - sonWidth) / 2;
            putSpritePNG(dglObj.songPutTblNo, 6, songx, songy);

        }else if(elapsed <= 43.378){
            // ヘルメット　かぶる前に仕留めてやる

            // -- 歌詞 ------
            let sonWidth = getCDS(dglObj.songPutTblNo, 7).width;
            let songx = (backBuffer.width - sonWidth) / 2;
            putSpritePNG(dglObj.songPutTblNo, 7, songx, songy);

        }else if(elapsed <= 50.604){
            // 俺のピコピコハンマー

            // -- 背景 ------
            mvObject.bg_thunder(dglObj);

            // -- ハンマー -------
            mvObject.hummer_anime01(dglObj);

            // -- 歌詞 ------
            let sonWidth = getCDS(dglObj.songPutTblNo, 8).width;
            let songx = (backBuffer.width - sonWidth) / 2;
            putSpritePNG(dglObj.songPutTblNo, 8, songx, songy);

        }else if(elapsed > 50.604){
            // 最後のリフ

            // -- 背景 ------
            mvObject.bg_thunder(dglObj);

            // -- ピ神 ------
            if(elapsed > 51.714){
                putSpritePNG(dglObj.demoPutTblNo, 1,   0,  0);

                // 左手(回転)
                mvObject.leftHandMoveCount += 0.025;
                let leftHand_x = 16;
                let leftHand_y = 72;
                leftHand_x += Math.floor(Math.sin(mvObject.leftHandMoveCount) * 6);
                leftHand_y += Math.floor(Math.cos(mvObject.leftHandMoveCount) * 6);
                putSpritePNG(dglObj.demoPutTblNo, 2,  leftHand_x, leftHand_y);

                // 右手(回転)
                mvObject.rightHandMoveCount += 0.025;
                let rightHand_x = 136;
                let rightHand_y = 24;
                rightHand_x += Math.floor(Math.cos(mvObject.leftHandMoveCount) * 6);
                rightHand_y += Math.floor(Math.sin(mvObject.leftHandMoveCount) * 6);
                putSpritePNG(dglObj.demoPutTblNo, 3, rightHand_x, rightHand_y);
            }

            let isViewChild1 = false;
            let isViewChild2 = false;
            // 子供2
            if(elapsed > 51.436){
                isViewChild2 = true;
            }

            // 子供1
            if(elapsed > 51.169){
                isViewChild1 = true;
            }
            mvObject.child_anime(dglObj, isViewChild1, isViewChild2);

            // -- ハンマー -------
            mvObject.hummer_anime01(dglObj);
        }

        if(dglDevice.pointer.event){
            for(let key in dglDevice.pointer.event){
                if("pointerdown" == dglDevice.pointer.event[key].stateName){
                    // なにかアクションが発生したらタイトルへ
                    dglAudio.stopBGM();
                    sceneChange("title");
                }
            }
        }
    }

    /**
     * ハンマーのアニメーション
     * @param {} dglObj 
     */
    mvObject.hummer_anime01 = function(dglObj){
            // -- ハンマー -------
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
        mvObject.hummerMoveCount += 0.05;
        hummer_y += Math.floor(Math.sin(mvObject.hummerMoveCount) * 12);
        putSpritePNG(dglObj.demoPutTblNo, 4, hummer_x, hummer_y);
    }

    /**
     * 
     * @param {*} dglObj 
     */
    mvObject.bg_thunder = function(dglObj){
        putSpritePNG(100, 0,   0,  0);

        let thunder_plt = scene_demo_palette['thunder'];
        let leftPltIdx = dglObj.leftThunderCount % 200 <= 30 ? 0 : 1;
        let rightPltIdx = dglObj.rightThunderCount % 200 <= 30 ? 0 : 1;
        pngBackBuffer.palette.set(thunder_plt[leftPltIdx], (16 * 6 + 1) * COLOR_SIZE);
        pngBackBuffer.palette.set(thunder_plt[rightPltIdx], (16 * 7 + 1) * COLOR_SIZE);
        dglObj.leftThunderCount++;
        if(dglObj.leftThunderCount > 2000){
            dglObj.leftThunderCount = 0;
        }
        dglObj.rightThunderCount++;
        if(dglObj.rightThunderCount > 2000){
            dglObj.rightThunderCount = 0;
        }
    }

    /**
     * 
     * @param {*} dglObj 
     * @param {boolean} isViewChild1 
     * @param {boolean} isViewChild2 
     */
    mvObject.child_anime = function(dglObj, isViewChild1 = true, isViewChild2 = true){
            // -- 子供１ -------
            if(isViewChild1){
                putSpritePNG(dglObj.demoPutTblNo, 5, 36, 160);
            }

            // -- 子供２ -------
            if(isViewChild2){
                putSpritePNG(dglObj.demoPutTblNo, 6, 240 - 28, 160);
            }

            let child_eyes_plt = scene_demo_palette['child_eyes'];
            let eyePltIdx = Math.floor(dglObj.eyeCount / 10) % 3;
            pngBackBuffer.palette.set(child_eyes_plt[eyePltIdx], (16 * 3 + 2) * COLOR_SIZE);
            dglObj.eyeCount++;
    }
}