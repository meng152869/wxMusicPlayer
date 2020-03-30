const host = "https://www.sunhuayu.com:3001";


// const host = "http://127.0.0.1:3000";


function myRequest(obj){
    wx.showLoading({
        title: '正在请求',
    });
    let o = {
        ...obj
    };

    o.success = function(){
        wx.hideLoading();
        obj.success(...arguments);
    }

    o.fail = function (){
        wx.hideLoading();
        obj.fail(...arguments);
    }

    wx.request(o);
}



// 登录请求
function login(phone, password) {
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/login/cellphone',
            data: {
                phone,
                password
            },
            success(res) {
                console.log(res);
                // 微信小程序不支持cookie，所以必须手动保存和发送cookie
                wx.setStorageSync("loginCookie", res.header["Set-Cookie"]);
                wx.setStorageSync("uid", res.data.account.id);
                let csrf = null;
                for(let i = 0;i<res.cookies.length;i++){
                    let c = res.cookies[i];
                    if(c.indexOf("__csrf")>=0){
                        let ca = c.split(";")[0];
                        csrf = ca.split("=")[1];
                        break;
                    }
                }
                wx.setStorageSync("csrf", csrf);
                
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}
// 获取用户信息请求
function queryUserInfo(uid) {
    let cookie = wx.getStorageSync("loginCookie");
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/user/detail',
            data: {
                uid
            },
            // 凡是需要登录之后才能调用的接口，都必须发送cookie
            header: {
                Cookie: cookie
            },
            success(res) {
                // console.log(res);
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

// 搜索请求
function searchRequest(keywords, offset) {
    return new Promise(function (resolve, reject) {
        myRequest({
            data: { keywords, offset },
            url: host + '/search',
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

// 请求热搜词
function queryHotSearch() {
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/search/hot',
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

// 推荐歌单请求
function queryRecommendMusicList() {
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/personalized',
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

// 每日推荐歌曲
function queryRecMusicList() {
    let cookie = wx.getStorageSync("loginCookie");
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/recommend/songs',
            header: {
                Cookie: cookie
            },
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

// 根据歌曲id请求歌曲url
function querySongUrlById(id){
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/song/url',
            data:{id},
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

// 根据歌曲id请求歌词
function querySongLyricById(id){
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/lyric',
            data: { id },
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}


// 根据歌曲id获取歌曲详情
function querySongInfoById(ids){
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/song/detail',
            data: { ids },
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

// 根据歌单id请求歌单详情
function queryMusicListDetailById(id){
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/playlist/detail',
            data: { id },
            success(res) {
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}


// 获取用户歌单
function queryUserMusicList(uid){
    let cookie = wx.getStorageSync("loginCookie");
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/user/playlist',
            data: {
                uid
            },
            header: {
                Cookie: cookie
            },
            success(res) {
                // console.log(res);
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

// 喜欢的音乐
function queryLikeList(uid){
    let cookie = wx.getStorageSync("loginCookie");
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/likelist',
            data: {
                uid
            },
            header: {
                Cookie: cookie
            },
            success(res) {
                // console.log(res);
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}


//将歌曲加入喜欢的音乐
function addLikeListByID(id,like="true") {
    let cookie = wx.getStorageSync("loginCookie");
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/like',
            data: {
                id,
                like
            },
            header: {
                Cookie: cookie
            },
            success(res) {
                // console.log(res);
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}


// 收藏 和 取消收藏歌单
function subscribeRequest(t,id){
    let cookie = wx.getStorageSync("loginCookie");
    return new Promise(function (resolve, reject) {
        myRequest({
            url: host + '/playlist/subscribe',
            data: {
                t,
                id,
                csrf_token:wx.getStorageSync("csrf")
            },
            header: {
                Cookie: cookie
            },
            success(res) {
                console.log(res.data);
                resolve(res.data);
            },
            fail(err) {
                reject(err);
            }
        });
    });
}

//指定url下载音乐
// function downloadFileWithURL(url){
//     return new Promise(function(resolve,reject){
//         wx.downloadFile({
//             url,
//             filePath:"",
//             success(res){
//                 resolve(res);
//             },
//             fail(err){
//                 reject(err);
//             }
//         })
//     });
// }


export {
    login,                          //登录
    queryUserInfo,                  //请求用户信息
    searchRequest,                  //歌曲搜索请求
    queryHotSearch,                 //热搜词请求
    queryRecommendMusicList,        //推荐歌单
    queryRecMusicList,              //每日推荐歌曲
    querySongUrlById,               //根据id请求歌曲url
    querySongLyricById,             //根据id请求歌词
    querySongInfoById,              //根据id请求歌曲详情
    queryMusicListDetailById,       //根据id请求歌单详情
    queryUserMusicList,             //请求用户歌单
    // downloadFileWithURL
    queryLikeList,                  //请求喜欢的音乐
    addLikeListByID,                //指定id将音乐加入 喜欢的音乐
    subscribeRequest                //收藏 和 取消收藏 歌单
}