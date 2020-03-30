// components/rec-music-list/rec-music-list.js

// 今日推荐歌曲组件。



let app = getApp();

Component({
    
    properties: {
        // 推荐歌曲列表
        recMusicList:{
            type:Array,
            value:[]
        },

        title:{
            type:String,
            value:""
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 点击列表中某个歌曲
        mCellClick(e){
            // app.playMusicByID(e.currentTarget.dataset.music.id);
            app.playSingleMusic(e.currentTarget.dataset.music.id);
        }
    }
})
