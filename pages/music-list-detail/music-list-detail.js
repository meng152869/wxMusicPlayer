// pages/music-list-detail/music-list-detail.js

import {
    queryMusicListDetailById,
    subscribeRequest
} from "../../utils/network-tool.js";


let app = getApp();


const bus = require("../../utils/event-bus.js");

Page({


    data: {
        musicList:null,
        currentIndex:-1,
        isPaused:true,
        isFavPlayList:false
    },


    onLoad: function (options) {
        // console.log(options);

        queryMusicListDetailById(options.id)
        .then(data=>{
            // console.log(data);
            this.setData({
                musicList:data.playlist
            });

            if (
                app.myPlayList.indexOf(data.playlist.id) >= 0 ||
                app.collectedPlayList.indexOf(data.playlist.id) >= 0
            ) {
                this.setData({
                    isFavPlayList: true
                });
            }


            wx.setNavigationBarTitle({
                title: data.playlist.name,
            });
            // console.log(app.currentPlayList.id);
            // console.log(this.data.musicList.id);

            if (app.currentPlayList && app.currentPlayList.id == this.data.musicList.id) {
                this.setData({
                    currentIndex: app.currentPlayListIndex
                });
            }
        });

        this.setData({
            isPaused: app.player.paused
        });



        bus.on("pause", this.onPause);
        bus.on("play", this.onPlay);
        bus.on("canplay",this.onCanplay);

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

    onCanplay(){
        this.setData({
            currentIndex: app.currentPlayListIndex
        });
    },

    playBtnClick(e){
        if (app.currentPlayList && app.currentPlayList.id == this.data.musicList.id){
            this.setData({
                currentIndex: app.currentPlayListIndex
            });
        }else{
            app.setCurrentPlayList(this.data.musicList);
        }

        app.playMusicInListWithIndex(e.target.dataset.index);

        // console.log(m);
        this.setData({
            currentIndex: e.target.dataset.index
        })
    },

    pauseBtnClick(){
        app.player.pause();
    },

    playAllTapped(){
        app.setCurrentPlayList(this.data.musicList);
        if(app.playMode=="loop"){
            app.playMusicInListWithIndex(0);
        }else{
            app.playRandomListWithIndex(0);
        }
    },

    collectBtnTapped(){
        subscribeRequest(1, this.data.musicList.id)
        .then(data=>{
            if(data.code==200){
                app.collectedPlayList.push(this.data.musicList.id);
                this.setData({
                    isFavPlayList:true
                });
            }
        })
    },
    cancelCollectBtnTapped(){
        subscribeRequest(2, this.data.musicList.id)
        .then(data => {
            if (data.code == 200) {
                // app.collectedPlayList.push(this.data.musicList.id);
                let index = app.collectedPlayList.indexOf(this.data.musicList.id);
                app.collectedPlayList.splice(index,1);
                this.setData({
                    isFavPlayList: false
                });
            }
        })
    },


    /**
     * 生命周期函数--监听页面卸载
     */

    onUnload(){
        bus.off("pause", this.onPause);
        bus.off("play", this.onPlay);
        bus.off("canplay", this.onCanplay);
    }

    
})