//app.js

import "./utils/shuffle.js";


import { 
    queryUserInfo, 
    querySongUrlById,
    querySongLyricById,
    querySongInfoById,
    downloadFileWithURL,
    queryLikeList,
    queryUserMusicList
} from "/utils/network-tool.js";

import translateLyricToArray from "./utils/translateLyricToArr.js";

const bus = require("./utils/event-bus.js");


import "./utils/shuffle.js";

App({

    onLaunch: function () {
        this.initUserInfo();

        this.refreshLikeList();
        this.refreshPlayList();

        bus.on("ended", this.onNext.bind(this));

        this.player.onNext(this.onNext.bind(this));
        this.player.onPrev(this.onPrev.bind(this));

        this.playMode = wx.getStorageSync("playMode")||"loop";
    },

    // 用户id
    uid:"",
    
    // 喜欢的音乐列表
    likeList:[],

    // 我创建的歌单
    myPlayList:[],

    // 我收藏的歌单
    collectedPlayList:[],

    // 全局数据
    globalData: {
        userInfo: null
    },

    // 当前播放的音乐信息
    currentMusic:{
        name:"",
        pic:"",
        url:"",
        id:"",
        lyric:"",
        alname:"",
        artists:"",
    },

    //--------------------------------------------------------------

    // 当前播放的歌单信息
    currentPlayList:null,

    // 当前播放的歌单索引
    currentPlayListIndex:-1,


    // 随机歌曲列表
    randomPlayList:null,

    // 随机播放索引
    randomPlayIndex:-1,

    //--------------------------------------------------------------

    // 播放模式
    playMode:"loop",

    setPlayMode(mode){
        this.playMode = mode;
        wx.setStorageSync("playMode", mode);
        if(mode == "random"){
            this.resetRandomList();
        }
    },

    // 重置随机列表
    resetRandomList(){
        if(this.currentPlayList){
            this.randomPlayList = JSON.parse(JSON.stringify(this.currentPlayList));
            this.randomPlayList.tracks = this.currentPlayList.tracks.shuffle();

            this.randomPlayIndex = -1;
        }
    },



    // 背景音频管理器对象
    player:wx.getBackgroundAudioManager(),


    // 播放单曲
    playSingleMusic(mid){
        this.playMusicByID(mid);

        this.currentPlayList = null;
        this.currentPlayListIndex = -1;
    },


    // 指定id播放某个歌曲
    playMusicByID(mid){
        this.currentMusic.id = mid;

        Promise.all([
            querySongInfoById(mid), 
            querySongUrlById(mid), 
            querySongLyricById(mid)
        ])
        .then(resArr=>{


            // console.log(resArr[0]);
            this.currentMusic.name = resArr[0].songs[0].name;
            this.currentMusic.pic = resArr[0].songs[0].al.picUrl;
            this.currentMusic.alname = resArr[0].songs[0].al.name;
            this.currentMusic.artists = resArr[0].songs[0].ar.reduce((prev,el,i)=>{
                return prev + el.name + (i == resArr[0].songs[0].ar.length-1?"":"，");
            },"");

            this.currentMusic.url = resArr[1].data[0].url;
            // console.log(resArr[2]);
            // console.log(this.currentMusic);

            this.currentMusic.lyric = translateLyricToArray(resArr[2].lrc.lyric);

            this.playCurrentMusic();
        });
        
    },

    // 播放当前音乐
    playCurrentMusic(){
        this.player.src = this.currentMusic.url;
        this.player.title = this.currentMusic.name;
        this.player.epname = this.currentMusic.alname;
        this.player.singer = this.currentMusic.artists;
        this.player.coverImgUrl = this.currentMusic.pic;
    },

    // 更改播放列表
    setCurrentPlayList(pl){
        this.currentPlayList = pl;
        this.currentPlayListIndex = -1;
    },


    // 根据索引播放当前歌单中的某首歌
    playMusicInListWithIndex(index){
        if (!this.randomPlayList) {
            this.resetRandomList();
        }
        this.currentPlayListIndex = index;
        let m = this.currentPlayList.tracks[index];
        this.playMusicByID(m.id);
    },

    // 指定随机索引，播放随机列表中的某首歌
    playRandomListWithIndex(index){

        if(!this.randomPlayList){
            this.resetRandomList();
        }

        this.randomPlayIndex = index;
        let m = this.randomPlayList.tracks[index];

        this.currentPlayListIndex = this.currentPlayList.tracks.indexOf(m);

        this.playMusicByID(m.id);
    },

    // 向后切歌
    onNext(){

        switch (this.playMode) {
            case "loop":
                if(this.currentPlayList){
                    this.playNext();
                }
                break;
            case "random":
                if (this.randomPlayList){
                    this.playRandomNext();
                }
                break;
            case "single":
                this.player.stop();
                this.playCurrentMusic();
                break;
        }
    },

    // 向前切歌
    onPrev(){
        switch (this.playMode) {
            case "loop":
                if (this.currentPlayList){
                    this.playPrev();
                }   
                break;
            case "random":
                if (this.randomPlayList) {
                    this.playRandomPrev();
                }
                break;
            case "single":
                
                break;
        }
    },

    // 播放下一首
    playNext(){
        if (this.currentPlayListIndex >= this.currentPlayList.tracks.length-1){
            this.playMusicInListWithIndex(0);
        }else{
            this.playMusicInListWithIndex(this.currentPlayListIndex+1);
        }
    },

    // 播放上一首
    playPrev(){
        if (this.currentPlayListIndex<=0){
            this.playMusicInListWithIndex(this.currentPlayList.tracks.length - 1);
        }else{
            this.playMusicInListWithIndex(this.currentPlayListIndex - 1);
        }
    },



    // 随机播放下一首
    playRandomNext(){

        if (this.randomPlayIndex >= this.randomPlayList.tracks.length - 1) {
            this.resetRandomList();
            this.playRandomListWithIndex(0);
        } else {
            this.playRandomListWithIndex(this.randomPlayIndex + 1);
        }
        
    },

    // 播放随机列表的上一首
    playRandomPrev(){
        if (this.randomPlayIndex <= 0) {
            this.playRandomListWithIndex(this.randomPlayList.tracks.length - 1);
        } else {
            this.playRandomListWithIndex(this.randomPlayIndex - 1);
        }
    },


    // 初始化用户信息
    initUserInfo() {
        this.uid = wx.getStorageSync("uid");
        queryUserInfo(this.uid)
        .then(data => {
            // console.log(data);
            this.globalData.userInfo = data.profile;
        });
    },


    // 刷新 喜欢的音乐 数据
    refreshLikeList(){
        return queryLikeList(this.uid)
        .then(data=>{
            // console.log(data);
            this.likeList = data.ids;
            return Promise.resolve();
        });
    },


    // 刷新我的歌单和收藏的歌单
    refreshPlayList(){
        return queryUserMusicList(this.uid)
        .then(data=>{
            this.myPlayList = data.playlist.filter(el => {
                return el.creator.userId == this.uid;
            }).map(el=>el.id);


            this.collectedPlayList = data.playlist.filter(el => {
                return el.creator.userId != this.uid;
            }).map(el => el.id);

            // console.log(this.myPlayList);
            // console.log(this.collectedPlayList);

            return Promise.resolve();
        });

        
    }
});






// // 下载当前音乐
    // downloadCurrentMusic(){
    //     return downloadFileWithURL(this.currentMusic.url)
    //     .then(res=>{
    //         // console.log(res);

    //         wx.saveFile({
    //             tempFilePath: res.tempFilePath,
    //             success:fres=>{
    //                 console.log(fres.savedFilePath);
    //                 let localMusic = wx.getStorageSync("localMusic") || [];
    //                 localMusic.push({
    //                     path: fres.savedFilePath,
    //                     ...this.currentMusic
    //                 });
    //                 this.currentMusic.path = fres.savedFilePath;

    //                 wx.setStorageSync("localMusic", localMusic);

    //                 wx.showToast({
    //                     title: '下载完毕',
    //                 });
    //             },
    //             fail(err){
    //                 console.log(err);
    //             }
    //         });

    //         return Promise.resolve();
    //     })
    //     .catch(err=>{
    //         wx.showToast({
    //             title: '下载失败',
    //             icon:"none"
    //         });

    //         return Promise.reject(err);
    //     })

    // },





