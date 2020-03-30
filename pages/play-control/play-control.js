// pages/play-control/play-control.js

const app = getApp();

const bus = require("../../utils/event-bus.js");

import findTimeIndex from "../../utils/findTimeIndex.js";

let lyricDraggingTimer = null;

import { addLikeListByID} from "../../utils/network-tool.js";


Page({


    data: {
        musicInfo:{},
        showLyric:false,

        isPaused:true,

        duration:0,
        currentTime:0,

        isDragging:false,

        isDraggingLyric:false,

        lrcIndex:0,


        highLightedIndex:0,






        playMode:null,

        isInLikeList:false,


    },

    onLoad: function (options) {
        this.refreshMusicInfoFromApp();
        wx.setNavigationBarTitle({
            title: this.data.musicInfo.name,
        });

        this.setData({
            isPaused: app.player.paused
        });

        bus.on("pause",this.onPause);
        bus.on("play", this.onPlay);
        bus.on("timeUpdate", this.onTimeUpdate);
        bus.on("canplay", this.onCanplay);
        bus.on("ended",this.onEnded)
    },

    onPause(){
        this.setData({
            isPaused: true
        });
    },

    onPlay(){
        this.setData({
            isPaused: false
        });
    },

    onTimeUpdate(){
        if(!this.data.isDragging){
            this.setData({
                currentTime: app.player.currentTime
            });
        }

        let currentLyricIndex = findTimeIndex(this.data.musicInfo.lyric, app.player.currentTime);

        if (this.data.lrcIndex != currentLyricIndex){

            this.setData({
                highLightedIndex: currentLyricIndex
            });

            if (!this.data.isDraggingLyric){
                this.setData({
                    lrcIndex: currentLyricIndex
                });
            }
        }
    },

    lyricTouchStart(){
        if (lyricDraggingTimer){
            clearTimeout(lyricDraggingTimer);
            lyricDraggingTimer = null;
        }
        
        this.setData({
            isDraggingLyric:true
        })
    },

    lyricTouchEnd(){

        lyricDraggingTimer = setTimeout(()=>{
            this.setData({
                isDraggingLyric: false
            })
        },2000);

    },

    onCanplay(){
        this.refreshMusicInfoFromApp();
        
    },
    onEnded(){
        
        this.setData({
            isPaused: true
        });
    },


    progressChange(e){
        app.player.seek(e.detail.value);

        wx.nextTick(()=>{
            this.setData({
                currentTime: e.detail.value
            });
        });

        this.setData({
            isDragging: false
        });
    },

    progressChanging(){
        this.setData({
            isDragging:true
        });
    },


    toggleLyric(){
        this.setData({
            showLyric: !this.data.showLyric
        })
    },


   
    refreshMusicInfoFromApp(){
        this.setData({
            musicInfo: app.currentMusic,
            duration: app.player.duration,
            playMode: app.playMode,
            isInLikeList: app.likeList.indexOf(app.currentMusic.id)!=-1
        });
    },


    collectTapped(){
        addLikeListByID(this.data.musicInfo.id)
        .then(data=>{
            if(data.code==200){
                this.setData({
                    isInLikeList:true
                });
                app.likeList.push(this.data.musicInfo.id);
            }
        });
    },

    cancelCollectTapped(){
        addLikeListByID(this.data.musicInfo.id,"false")
        .then(data => {
            if (data.code == 200) {
                this.setData({
                    isInLikeList: false
                });

                let index = app.likeList.indexOf(this.data.musicInfo.id);
                if(index!=-1){
                    app.likeList.splice(index,1);
                }
                
            }
        });
    },



    pauseTapped(){
        app.player.pause();
    },

    playTapped(){
        if(app.player.src){
            app.player.play();
        }else{
            app.playMusicByID(this.data.musicInfo.id);
        }
    },

    nextBtnTapped(){
        app.onNext();
    },

    prevBtnTapped(){
        app.onPrev();
    },

    loopTapped(){
        // app.playMode = "loop";
        app.setPlayMode("loop");
        this.setData({
            playMode:"loop"
        });
        
    },

    randomTapped(){
        this.setData({
            playMode: "random"
        });
        app.setPlayMode("random");
    },

    singleTapped(){
        this.setData({
            playMode: "single"
        });
        app.setPlayMode("single");
    },

    // downloadTapped(){
    //     if (!this.data.musicInfo.path){
    //         this.setData({
    //             isDownloading:true
    //         });
    //         app.downloadCurrentMusic()
    //         .then(()=>{
    //             this.setData({
    //                 isDownloading: false
    //             });
    //         });
    //     }
    // },

    
    onUnload: function () {
        bus.off("pause", this.onPause);
        bus.off("play", this.onPlay);
        bus.off("timeUpdate", this.onTimeUpdate);
        bus.off("canplay", this.onCanplay);
        bus.off("ended", this.onEnded)
    },

    
})



