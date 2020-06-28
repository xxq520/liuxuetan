// pages/message/message.js
// 获取封装请求接口文件
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前聊天列表数据
    messageList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  // 点击@我的或者评论或点赞
  goDetail:function(e){
    switch(e.currentTarget.dataset.type){
      case "my":
        wx.navigateTo({
          url: '/message/message/my',
        })
        break;
      case "like" :
        wx.navigateTo({
          url: '/message/message/like',
        })
        break;  
      case "comment" :
        wx.navigateTo({
          url: '/message/message/comment',
        })
        break;  
    }
  },
  // 获取当前聊天组列表数据
  getMessageList() {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_id : userInfo.usr_id || 0, 
      },
      type:"get",
      url:url.getMessageList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      // 格式化最后聊天的时间
      console.log(res,666)
      for(var i=0; i<res.data.length; i++){
        if(res.data[i].last_chat_date){
          res.data[i].last_chat_date = res.data[i].last_chat_date .replace("/Date(","");
          res.data[i].last_chat_date = res.data[i].last_chat_date .replace(")/","");
          res.data[i].last_chat_date=that.formatDate(res.data[i].last_chat_date)
        }
      }
      if(!res.data[0].Exception){
        that.setData({
          messageList: res.data
        })
      }else{
        that.setData({
          messageList: []
        })
      }
    })
  },
  formatDate(now) { 
    console.log(now)
    var date = new Date(Number(now));
     var Y = date.getFullYear() ;
     var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
     var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) ;
     var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) ;
     var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) ;
     var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
     return Y+"."+M+"."+D+" "+h+" : "+m; 
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
    this.getMessageList()
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