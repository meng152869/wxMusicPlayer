// pages/login/login.js

// 登录页面



import {login} from "../../utils/network-tool.js";

let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tel:"",
        psw:""
    },

    

    telInput(e){
        this.setData({
            tel:e.detail.value
        })
    },

    pswInput(e){
        this.setData({
            psw: e.detail.value
        })
    },



    loginBtnTapped(){
        login(this.data.tel,this.data.psw)
        .then(data=>{
            console.log(data);
            if(data.code==200){
                app.globalData.userInfo = data.profile;
                app.uid = data.account.id;
                wx.navigateBack();
            }else{
                wx.showToast({
                    title: data.message,
                    icon:"none"
                })
            }
        })
        .catch(err=>{
            wx.showToast({
                title: "网络异常",
                icon: "none"
            })
        });
    }
})