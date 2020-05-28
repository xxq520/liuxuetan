// pages/regiest/regiest.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 登陆的手机号
    phone : "",
    // 登陆的密码
    password: ""
  },
  // 文本框更改事件
  changeInput(e){
    // 是手机文本框事件
    if(e.currentTarget.dataset.type=="phone"){
      this.setData({
        phone: e.detail.value
      })
    }else{
      this.setData({
        password: e.detail.value
      })
    }
  },
  // 点击登陆按钮事件
  submitBtn(){
    if(this.data.phone.length<=3){
      wx.showToast({
        title: '请输入正确的账号',
        icon:"none"
      })
      return false;
    }else if(this.data.password.length<=3){
      wx.showToast({
        title: '密码格式有误',
        icon:"none"
      })
      return false;
    } else {
        // 模拟的用户数据
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          usr_display_name: this.data.phone, // 用户的登录名称
          usr_password: this.data.password , // 用户的登录密码
          usr_tel_no: ""
        },
        type:"get",
        url:url.userLogin,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      // 请求个人数据
      request.getReq(data).then(res=>{
        // 判断用户是否有数据
        console.log(res,888)
        if(res.data && res.data[0] && res.data[0].usr_id) {
          // 将用户数据储存到缓存
          wx.setStorageSync("userInfo",  res.data[0])
          wx.showToast({
            title: '登陆成功!',
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/my/my',
            })
          },1500)
        }else {
          wx.showToast({
            title: res.data[0].Exception,
            icon:"none"
          })
        }
      })
    }
  },
  // 去注册
  goregister(){
    wx.redirectTo({
      url: '/pages/regiest/regiest',
    })
  },
  // 点击返回按钮
  back(){
    wx.navigateBack({
      delta: 2
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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