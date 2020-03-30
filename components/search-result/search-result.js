// components/search-result/search-result.js

// 搜索结果列表组件



import { querySongURL, queryMusicInfo } from "../../utils/network-tool.js";

let app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 搜索结果数据
        recMusicList: {
            type: Array,
            value: []
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
        // 点击搜索结果中某个歌曲
        mCellClick(e) {
            // app.playMusicByID(e.currentTarget.dataset.music.id);
            app.playSingleMusic(e.currentTarget.dataset.music.id);
        }
    }
})
