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