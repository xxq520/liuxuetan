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
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [9999, 1, 1],
    storeDetail:{}, // 顾问信息
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },
  // tab选项卡切换
  goTab(e) {
    console.log(e)
    wx.reLaunch({
        url: e.currentTarget.dataset.url,
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetAgentOrderProductTypeTransaction();
  },
  // 获取交易额和次数
  GetAgentOrderProductTypeTransaction() {
    // var userInfo = wx.getStorageSync('userInfo');
    // var data = {
    //   toast: true,// 是否显示加载动画
    //   data:{
    //     // 用户的登录id
    //     agt_key :userInfo.store, 
    //     agt_name: "",  // 过滤代理名称
    //     apt_type: "", // 代理订购产品类型过滤
    //     pageSize:1,
    //     pageNumber:1,
    //     aod_key:"",
    //   },
    //   type:"get",
    //   url:url.GetAgentOrderProductTypeTransaction,
      
    //   header:{"Content-Type":"application/json; charset=utf-8"}
    // }
    // var that = this;
    // request.getReq(data).then(res=>{
    //   console.log(res,9999)
    //   if(res.data[0].code!=404){
    //     that.setData({
    //       order:res.data
    //     })
    //   }
    // })
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
        storeDetail:wx.getStorageSync('storeDetail')
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