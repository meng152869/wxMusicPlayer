// 事件总线对象。
// 微信小程序中的事件系统，每种事件只能绑定一个监听函数，要想实现同事件绑定多个监听函数，可以使用一个
// 事件总监进行监听，然后转发事件。

const eventPool = {
    
}

const bus = {
    on(event,cb){
        if (!eventPool[event]){
            eventPool[event] = [];
        }
        eventPool[event].push(cb);
    },

    off(event,cb){
        if (eventPool[event]){
            let index = eventPool[event].indexOf(cb);
            if(index != -1){
                eventPool[event].splice(index,1);
            }
        }
    }
}

const player = wx.getBackgroundAudioManager();

player.onPause(function(){
    // 当某个事件触发，找到这个事件对应的所有回调函数，挨个调用。
    if (eventPool.pause){
        eventPool.pause.forEach(cb => {
            cb();
        });
    }
});


player.onPlay(function(){
    if (eventPool.play) {
        eventPool.play.forEach(cb => {
            cb();
        });
    }
});

player.onCanplay(function () {
    if (eventPool.canplay) {
        eventPool.canplay.forEach(cb => {
            cb();
        });
    }
});

player.onTimeUpdate(function () {
    if (eventPool.timeUpdate) {
        eventPool.timeUpdate.forEach(cb => {
            cb();
        });
    }
});

player.onEnded(function () {
    if (eventPool.ended) {
        eventPool.ended.forEach(cb => {
            cb();
        });
    }
});




module.exports = bus;