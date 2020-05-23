// pages/regiest/regiest.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",// 用户名
    phone:"",// 用户手机号
    code:"", // 注册验证码
    password:"", // 密码
    okpassword:"", // 确认密码
    isCode:false,//是否显示验证码倒计时
  },
  // 文本框更改事件
  changeInput(e){
    // 是手机文本框事件
    var type = e.currentTarget.dataset.type;
    this.setData({
      [type]: e.detail.value
    })
  },
  // 点击获取验证码
  start() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.start();
    this.setData({
      isCode:true
    })
  },
  // 去登陆
  goLogin(){
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  // 隐藏倒计时
  finished() {
    this.setData({
      isCode:false
    });
    const countDown = this.selectComponent('.control-count-down');
    countDown.reset();
  },
  // 点击注册按钮事件
  submitBtn(){
    if(this.data.name.length<=3){
      wx.showToast({
        title: '请输入正确的用户名',
        icon:"none"
      })
      return false;
    }else if(this.data.phone.length<=3){
      wx.showToast({
        title: '请输入正确的手机号',
        icon:"none"
      })
      return false;
    }else if(this.data.code.length<=3){
      wx.showToast({
        title: '验证码有误',
        icon:"none"
      })
      return false;
    }else if(this.data.password.length<=3){
      wx.showToast({
        title: '密码格式有误',
        icon:"none"
      })
      return false;
    }else if(this.data.okpassword.length<=3){
      wx.showToast({
        title: '密码格式有误',
        icon:"none"
      })
      return false;
    }else if(this.data.password!=this.data.okpassword){
      wx.showToast({
        title: '两次密码不一致',
        icon:"none"
      })
      return false;
    } else {
        // 模拟的用户数据
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          usr_username: this.data.name, // 用户的登录名称
          usr_pw: this.data.password , // 用户的登录密码
          usr_pw_conf:this.data.okpassword, //用户确认密码
          usr_tel_no:  this.data.phone,// 用户注册手机号
          veriCode:this.data.code, // 验证码
        },
        type:"POST",
        url:url.SaveRegisterRecord,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      // 请求个人数据
      request.getReq(data).then(res=>{
        // 判断用户是否有数据
        if(!res.data[0].code) {
          // 将用户数据储存到缓存
          wx.showToast({
            title: '注册成功!',
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/login/login',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 发送验证码
  sendCode(){
    if(this.data.name.length<=3){
      wx.showToast({
        title: '请输入正确的用户名',
        icon:"none"
      })
      return false;
    }else if(this.data.phone.length<=3){
      wx.showToast({
        title: '请输入正确的手机号',
        icon:"none"
      })
      return false;
    } else {
      var that = this;
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          usr_username: this.data.name, // 用户的登录名称
          usr_tel_no:  this.data.phone,// 用户注册手机号
        },
        type:"POST",
        url:url.SendRegisterVerifyCode,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      // 请求个人数据
      request.getReq(data).then(res=>{
        // 判断用户是否有数据
        console.log(res)
        if(res.data[0].response=="储存成功"){
          wx.showToast({
            title: '验证码发送成功',
            icon:"none"
          })
          that.start();
        } else {
          wx.showToast({
            title: '账户已被注册',
            icon:"none"
          })
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