
import { queryUserMusicList} from "../../utils/network-tool.js"

let app = getApp();

Page({


    data: {
        myMusicList:null,
        favMusicList:null
    },


    onLoad: function (options) {
        this.fetchData();
    },


    fetchData(){
        queryUserMusicList(app.uid)
        .then(data => {
            console.log(data);

            data.playlist.forEach(el => {
                el.picUrl = el.coverImgUrl;
                el.copywriter = el.description;
                // console.log(el.copywriter);
                if (!el.copywriter) {
                    el.copywriter = "";
                }
                if (el.copywriter && el.copywriter.length > 38) {
                    el.copywriter = el.copywriter.substr(0, 38) + "...";
                }
            });

            this.setData({
                myMusicList: data.playlist.filter(el => {
                    return el.creator.userId == app.uid;
                }),
                favMusicList: data.playlist.filter(el => {
                    return el.creator.userId != app.uid;
                })
            });


            wx.stopPullDownRefresh();
        })
        .catch(err=>{
            wx.stopPullDownRefresh();
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.fetchData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})