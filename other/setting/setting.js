// other/withdrawal/withdrawal.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:["英国留学申请","英国留学申请","英国留学申请","英国留学申请"],
     // 用户的信息
     userInfo:   wx.getStorageSync('userInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  exit:function(){
    if(this.data.userInfo){
      wx.showModal({
        title:"是否退出当前账号",
        success:function(res){
          if(res.confirm){
            wx.clearStorageSync("userInfo");
            wx.switchTab({
              url: "/pages/index/index",
            })
          }
        }
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