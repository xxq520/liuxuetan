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
    fileList: [
      {
        url: 'http://iph.href.lu/60x60?text=default',
        name: '图片2',
        isImage: true
      }
    ],
    // 商品的名称
    goodName: "",
    // 商品的价格
    price: "",
    // 商品的描述
    miaoshu: "",
    // 服务分类选择
    fuwu: ""
  },
  // 服务分类选择事件
  bindMultiPickerChange(e){
    this.setData({
      fuwu:e.detail.value
    })
    console.log(e,6)
  },
  // 点击取消
  cancel() {
    wx.navigateBack();
  },
  // 点击确认并发送事件
  submit() {
    var {goodName,price,miaoshu,fuwu} = this.data;
    console.log(goodName,price,miaoshu,fuwu)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetAgentProductTypeList()
  },
  // 获取当前用户可以申请的产品列表
  GetAgentProductTypeList(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        apt_id :0, 
      },
      type:"get",
      url:url.GetAgentProductTypeList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,666666)
      if(!res.data[0].code){
        this.setData({
          store:res.data[0]
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