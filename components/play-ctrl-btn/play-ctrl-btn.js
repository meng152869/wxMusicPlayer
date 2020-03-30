// components/play-ctrl-btn/play-ctrl-btn.js

let app = getApp();

const bus = require("../../utils/event-bus.js");

Component({

    properties: {

    },


    data: {
        musicInfo:{},
        isPaused: true
    },


    methods: {
        gotoPlayControl(){
            wx.navigateTo({
                url: '/pages/play-control/play-control',
            });
        },

        refreshMusicInfoFromApp() {
            this.setData({
                musicInfo: app.currentMusic
            });
        },

        onCanplay(){
            // console.log(this);
            this.refreshMusicInfoFromApp();
        },
        onPause() {
            this.setData({
                isPaused: true
            });
        },

        onPlay() {
            this.setData({
                isPaused: false
            });
        },
        onEnded(){
            this.setData({
                isPaused: true
            });
        }
    },
    
    ready(){
        this.refreshMusicInfoFromApp();
        this.onCanplay = this.onCanplay.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onEnded = this.onEnded.bind(this);

        bus.on("canplay",this.onCanplay);
        bus.on("pause", this.onPause);
        bus.on("play", this.onPlay);
        bus.on("ended", this.onEnded);


        this.setData({
            isPaused: app.player.paused
        });
    },

    detached(){
        bus.off("canplay", this.onCanplay);
        bus.off("pause", this.onPause);
        bus.off("play", this.onPlay);
        bus.off("ended", this.onEnded);
    }
})
