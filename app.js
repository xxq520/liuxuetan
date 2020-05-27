//app.js
// 获取封装请求接口文件
const request = require("/utils/request.js");
const url = require("/utils/apisUrl.js");
App({
  onLaunch: function () {
    this.getCount()
  },
  globalData: {
    userInfo: null,
    count:0
  },
  // 获取用户未读信息数量
  getCount(){
    if(!wx.getStorageSync('userInfo').usr_id){
      return false;
    }
    var that = this;
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_id : wx.getStorageSync('userInfo').usr_id, 
      },
      type:"get",
      url:url.GetUserUnreadMessageCount,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      console.log(res,787878)
      if(res.data[0].count_unread){
        that.globalData.count=res.data[0].count_unread
      }
      console.log(that.globalData)
    })
  }
})