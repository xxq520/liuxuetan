// pages/topicColumn/topicColumn.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 点击tab选项卡下标
      tabNum:2,
      // 动态筛选数据
      option1: [
        { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      // 话题专栏的标题
      id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前的标题专栏的名称
    this.setData({
      id: options.id
    })
    this.getGetUniIntroRow()
  },
  // tab点击切换事件 
  changeTab(e){
    this.setData({
      tabNum: e.currentTarget.dataset.num
    })
  },
  // 获取当前专栏见简介
  getGetUniIntroRow(){
    var that = this;
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 专栏的名称
        uniName : this.data.id 
      },
      type:"get",
      url:url.GetUniIntroRow,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      console.log(res,999)
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