// pages/myOrder/myOrder.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetUserAgentOrderList();
  },
  // 获取当前订单列表数据
  GetUserAgentOrderList(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key :userInfo.usr_key, 
        search_term: "", // 加密代理订单UID密钥
        aos_status: "",
        pageSize:1,
        pageNumber:1
      },
      type:"get",
      url:url.GetUserAgentOrderList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      if(res.data[0].Code!=404){
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].aod_order_date = res.data[i].aod_order_date.split("(")[1];
          res.data[i].aod_order_date = res.data[i].aod_order_date.split(")")[0];
          res.data[i].aod_order_date = request.format(res.data[i].aod_order_date, "YYYY-MM-dd");
          res.data[i].aod_order_date = res.data[i].aod_order_date.replace(/\-/g, ".");

          res.data[i].aod_mod_date = res.data[i].aod_mod_date.split("(")[1];
          res.data[i].aod_mod_date = res.data[i].aod_mod_date.split(")")[0];
          res.data[i].aod_mod_date = request.format(res.data[i].aod_mod_date, "YYYY-MM-dd");
          res.data[i].aod_mod_date = res.data[i].aod_mod_date.replace(/\-/g, ".");
          res.data[i].aod_created_date = res.data[i].aod_created_date.split("(")[1];
          res.data[i].aod_created_date = res.data[i].aod_created_date.split(")")[0];
          res.data[i].aod_created_date = request.format(res.data[i].aod_created_date, "YYYY-MM-dd");
          res.data[i].aod_created_date = res.data[i].aod_created_date.replace(/\-/g, ".");
        }
        this.setData({
          order:res.data
        })
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