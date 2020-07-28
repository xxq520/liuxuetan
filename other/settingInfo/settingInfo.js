// other/settingInfo/settingInfo.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 性别
    checked: wx.getStorageSync('userInfo').usr_gender==2?true:false,
    userInfo: wx.getStorageSync('userInfo'),
    username: wx.getStorageSync('userInfo').usr_display_name,
    // password:,
    // password2:,
    email:wx.getStorageSync('userInfo').usr_email,
    author:wx.getStorageSync('userInfo').usd_intro,
  },
  // 性别更改事件
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  saveUserInfo(){
    var that = this;
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : this.data.userInfo.usr_key || "", 
        // 用户名
        usr_display_name:that.data.username, 
        // 用户全名
        usr_fullname:"",
        // 头像
        usr_profile_image : that.data.userInfo.usr_profile_image,
        // 性别
        usr_gender:that.data.checked?2:1,
        // 邮箱
        usr_email:that.data.email,
        // 介绍
        usr_intro: that.data.author,
        usr_pw:"testtest",
        usr_pw_conf:"testtest"
      },
      type:"POST",
      url:url.UpdateUserDetailsRecord,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      console.log(res,787878)
      if(res.data[0].response=="储存成功"){
        wx.showToast({
          title: '保存成功',
          icon:"none"
        })
        setTimeout(()=>{
          wx.clearStorageSync("userInfo")
          wx.navigateTo({
            url: '/pages/login/login',
          })
          // wx.switchTab({
          //   url: '/pages/login/login',
          // })
        },1500)
      }
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