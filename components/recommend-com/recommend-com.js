// components/recommend-com/recommend-com.js

// 推荐歌单组件




let app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 推荐歌单列表
        recommendListGroup:{
            type:Array,
            value:[]
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
        // 点击某个歌单
        listItemClick(e){
            wx.navigateTo({
                url: '/pages/music-list-detail/music-list-detail?id='+e.currentTarget.dataset.pid,
            });
        }
    },

    
})
