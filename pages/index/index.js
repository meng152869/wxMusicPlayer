//index.js

// 首页



const app = getApp()

import { queryRecommendMusicList, queryRecMusicList} from "../../utils/network-tool.js";


Page({
    data: {

        recommendListGroup:[],

        recMusicList:[],

        uid:null
    },

    onLoad: function() {    
        // 请求推荐歌单
        
        this.getRecommendMusicList();
        
    },
    onShow(){

        if (this.data.recMusicList.length<=0){
            this.getRecMusicList();
        }

        this.setData({
            uid: app.uid
        });
    },

    getRecommendMusicList(){
        return queryRecommendMusicList()
        .then(data => {
            // console.log(data);
            this.setData({
                recommendListGroup: data.result.slice(0, 10)
            });
            return Promise.resolve();
        });
    },

    getRecMusicList(){
        return queryRecMusicList()
        .then(data => {
            // console.log(data);
            if (data.code == 200) {
                this.setData({
                    recMusicList: data.recommend.slice(0,10)
                })
            } else {
                wx.showToast({
                    title: data.msg,
                    icon: "none"
                })
            }

            return Promise.resolve();
        })
    },

    onPullDownRefresh(){
        Promise.all([
            this.getRecommendMusicList(),
            this.getRecMusicList(), 
            app.refreshLikeList(),
            app.refreshPlayList()
        ])
        .then(()=>{
            wx.stopPullDownRefresh();
        })
    }

})

