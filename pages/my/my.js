// pages/my/my.js
// 获取封装请求接口文件
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo : wx.getStorageSync('userInfo') || {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(this.data.userInfo.usr_id){
      this.getIndexData()
    }
    this.getGetHotTagsGroup();
    
  },
  //  初始化首页数据
  getIndexData() {
      var userInfo = wx.getStorageSync('userInfo');
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          // 用户的登录id
          usr_id : userInfo.usr_id || 0, 
          // 返回数据页码. 1=归还所有记录
          pageSize: "1",
          // 每个数据页的记录数量 1=归还所有记录
          pageNumber: "1",
        },
        type:"get",
        url:url.GetUserFavNewsItems,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      var that = this;
      request.getReq(data).then(res=>{
        that.setData({
          newList : res.data.splice(0,10)
        })
      })
    },
  // 点击发表或关注跳转至相应的页面
  goDetail(e){
    console.log(e)
    var type = e.currentTarget.dataset.type;
    switch(type) {
      case "1":
        wx.navigateTo({
          url: '/other/myNews/myNews',
        })
        break;
      case "2":
        break;
      case "3":
        wx.navigateTo({
          url: '/other/favNews/favNews',
        })
    }
  },
  // 获取tab选项卡标签
  getGetHotTagsGroup() {
    var that = this;
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        ntg_group : "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
      },
      type:"get",
      url:url.GetHotTagsGroup,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      that.setData({
        searchTag: res.data
      })
    })
  },
  // 判断当前用户是否是顾问
  GetUserAgent(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key :userInfo.usr_key, 
      },
      type:"get",
      url:url.GetUserAgent,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      if(res.data[0]){
        userInfo.store = res.data[0].return;
        wx.setStorageSync('userInfo', userInfo)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goSearch(e){
    wx.navigateTo({
      url: `/other/search/search?tag=${e.currentTarget.dataset.tag}`,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo : wx.getStorageSync('userInfo') || {}
    })
    this.GetUserAgent()
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