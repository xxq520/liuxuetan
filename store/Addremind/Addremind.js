// store/Addremind/Addremind.js
// other/billManagement/billManagement.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: date.getFullYear(),
    month: date.getMonth()+1,
    day: date.getDate(),
    value: [9999, 1, 1],
    selectDate:"",
    text:"", // 提示的内容
  },
  bindChange: function (e) {
    const val = e.detail.value
    console.log(e,666)
    this.setData({
      selectDate:e.detail.value
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
  // 保存提醒事项
  submit() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :userInfo.store, 
        nta_key:"", //加密通知观众UID密钥 如果创建新通知，则清空，否则提供特定用户UID密钥以更新通知记录
        audience_key: userInfo.usr_key, //加密通知观众UID密钥 i.e. 用户记录UID键
        ntp_type:"user",  // 通知类型(user/alladmin/order/indadmin).
        ntc_header :this.data.text, //通知标题内容
        ntc_content : this.data.text, //通知正文内容
        str_notify_date: this.data.selectDate?this.data.selectDate:date.getFullYear()+"-"+date.getMonth()+1+'-'+date.getDate(), // 以字符串格式通知日期，即。 2020-01-01
        ntc_valid : true , //  如果通知记录有效 
        ref_key: "", //  *这是专为保存订单通知，包括加密订单记录UID键，以供参考
        usr_key :  userInfo.usr_key, // 
        pageSize:1,
        pageNumber:1
      },
      type:"post",
      url:url.SaveAgentNotify,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,8889)
      if(res.data[0].code==404){
        this.setData({
          message:res.data
        })
      }else{
        wx.showToast({
          title:"添加成功",
          icon:"none"
        })
        setTimeout(()=>{
          wx.navigateBack()
        },1000)
      }
    })
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