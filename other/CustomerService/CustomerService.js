// pages/CustomerService/CustomerService.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
var timer = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前聊天的加密id
    id: "",
    // 聊天历史信息
    chatList: [],
    // 用户信息
    userInfo: wx.getStorageSync("userInfo"),
    // 聊天内返回的
    chatContent: "",
    // 当前聊天拉取数据的定时器
    timer: "",
    // 是否加载默认聊天数据
    isLoad:true,
    // 对方的userID
    chat:""
  },
  // 历史记录
  getHistory() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: false, // 是否显示加载动画
      data: {
        // 用户的登录id
        usr_key: userInfo.usr_key || "",
        // 如果不搜索特定的新闻/帖子记录，则为0
        grp_key: this.data.chat,
        // 返回数据页码. 1=归还所有记录
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNo: "1",
        grp_type: this.data.grp_type
      },
      type: "get",
      url: url.GetChatGroupHistory,
      header: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
    var that = this;
    request.getReq(data).then(res => {
      if (res.data.length != that.data.chatList) {
        that.setData({
          chatList:that.data.chatList.concat(res.data.reverse().splice(that.data.chatList.length,res.data.length)),
        },()=>{
          if(that.data.isLoad){
            that.setData({
              isLoad:false
            })
            wx.createSelectorQuery().select('#j_page').boundingClientRect(function(rect){
              // 使页面滚动到底部
              wx.pageScrollTo({
                scrollTop: rect.bottom
              })
            }).exec()
          }
          // 获取容器高度，使页面滚动到容器底部
        })
      }
    })
  },
  getHistory2() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: false, // 是否显示加载动画
      data: {
        // 用户的登录id
        usr_key: userInfo.usr_key || "",
        // 如果不搜索特定的新闻/帖子记录，则为0
        grp_key: this.data.chat,
        // 返回数据页码. 1=归还所有记录
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNo: "1",
        grp_type: this.data.grp_type
      },
      type: "get",
      url: url.GetChatGroupHistory,
      header: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
    var that = this;
    request.getReq(data).then(res => {
      if (res.data.length != that.data.chatList) {
        that.setData({
          chatList:that.data.chatList.concat(res.data.reverse().splice(that.data.chatList.length,res.data.length)),
        },()=>{
          if(that.data.isLoad){
            that.setData({
              isLoad:false
            })
            wx.createSelectorQuery().select('#j_page').boundingClientRect(function(rect){
              // 使页面滚动到底部
              wx.pageScrollTo({
                scrollTop: rect.bottom
              })
            }).exec()
          }
          // 获取容器高度，使页面滚动到容器底部
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id + "==%^#%",
      grp_type: options.grp_type
    })
    if(options.chat){
      this.setData({
        chat:options.chat
      })
    }
    this.getHistory();
    // 每五秒请求数据判断是否有新消息
    var that = this;
    this.setData({
      timer: setInterval(() => {
        that.getHistory2()
      }, 5000)
    })
  },
  changeChatContent(e) {
    this.setData({
      chatContent: e.detail.value

    })
  },
  sendMessage(e) {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true, // 是否显示加载动画
      data: {
        // 用户的登录id
        usr_key: userInfo.usr_key || "",
        // 如果不搜索特定的新闻/帖子记录，则为0
        grp_key: this.data.chat,
        // 聊天的类型
        grp_type: this.data.grp_type,
        // 发送的消息
        message: this.data.chatContent
      },
      type: "POST",
      url: url.SaveChatGroupMessage,
      header: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
    var that = this;
    request.getReq(data).then(res => {
      console.log(res, 110)
      that.setData({
        chatContent:""
      })
      that.getHistory2()
    })
  },
  // 点击创建订单的时候
  addOrder() {
    var userInfo = wx.getStorageSync('userInfo');
    if(!userInfo.store){
      return false;
    }
    wx.setStorageSync('chatP', {
      // 用户的登录id
      usr_key: userInfo.usr_key || "",
      // 如果不搜索特定的新闻/帖子记录，则为0
      en_grp_id: this.data.grp_key,
      // 聊天的类型
      grp_type: this.data.grp_type,
      // 发送的消息
      message: this.data.chatContent,
      chat_user: this.data.chat
    })
    wx.navigateTo({
      url: '/store/createOrder/createOrder?chat=true',
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
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })
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
    clearInterval(this.data.timer)
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