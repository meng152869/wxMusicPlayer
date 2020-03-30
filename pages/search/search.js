// pages/search/search.js
// 搜索页面



import { searchRequest, queryHotSearch} from "../../utils/network-tool.js";

let timer = null;


Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 搜索关键字
        keyword:"",
        // 搜索结果数组
        resultList:[],
        // 热搜列表
        hotWords:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 请求热搜词
        queryHotSearch()
        .then(data=>{
            // console.log(data);
            this.setData({
                hotWords:data.result.hots
            });
        });
    },

    // 用户输入搜索关键字
    keywordsChange(e){
        this.setData({
            keyword:e.detail.value
        });

        // 停止输入后够1秒再发请求
        clearTimeout(timer);
        timer = setTimeout(()=>{
            this.doSearch();
            timer = null;
        },1000)

    },

    // 发送搜索请求
    doSearch(){
        if (!this.data.keyword.trim()){
            this.setData({
                resultList:[]
            });
            return;
        }
        searchRequest(this.data.keyword,0)
        .then(data=>{
            console.log(data);
            this.setData({
                resultList:data.result.songs
            })
        })
    },

    // 上拉加载更多
    loadMore(){
        if (!this.data.keyword.trim()) return;
        wx.showLoading({
            title: '加载更多',
        });
        searchRequest(this.data.keyword, this.data.resultList.length)
        .then(data => {
            this.setData({
                resultList: this.data.resultList.concat(data.result.songs)
            });
            wx.hideLoading();
            wx.showToast({
                title: '成功',
            })
        })

    },

    
    onReachBottom: function () {
        this.loadMore();
    },

    // 点击热搜关键字
    hotItemClick(e){
        // console.log(e.target.dataset.word);
        this.setData({
            keyword: e.target.dataset.word
        });
        this.doSearch();
    }

})