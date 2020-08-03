// pages/discover/discover.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      // { text: '全部商品', value: 0 },
      // { text: '新款商品', value: 1 },
      // { text: '活动商品', value: 2 }
    ],
    storeList: [], // 顾问列表数据
    searchVal:"", // 搜索的内容
    Country:"", // 选中的国家
    arrayFs: app.globalData.Country, //国家
    key : "全部" , // 关键字
    keyArr: ['全部','留学申请','学术辅导','旅游签证','求职顾问','法律顾问'], // 关键字列表
  },
  // 更改关键字
  changeKey(e){
    this.setData({
      key: e.currentTarget.dataset.item=='全部'?'':e.currentTarget.dataset.item
    })
    this.GetAgentDetailsList();
  },
  // 服务分类选择事件
  bindMultiPickerChange(e){
    if(e.detail.value==0){
      this.setData({
        Country:""
      })
    } else {
      this.setData({
        Country:this.data.arrayFs[e.detail.value]
      })
    }
    this.GetAgentDetailsList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetAgentDetailsList()
  },
  // 跳转至商家顾问个人资料页面 
  gopreploData(e){
    var index = e.currentTarget.dataset.index;
    wx.setStorageSync('nowStore', this.data.storeList[index])
    wx.navigateTo({
      url: '/other/personalData/personalData',
    })
  },
  // 获取顾问列表数据
  GetAgentDetailsList() {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key : "",  // 加密代理UID密钥
        cou_name: this.data.Country, // 代理地点名称中文
        search_agt : that.data.searchVal || this.data.key=='全部'?'':this.data.key, //  通过代理名称或代理描述筛选代理返回列表
      },
      type:"get",
      url:url.GetAgentDetailsList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      // 格式化最后聊天的时间
      console.log(res,666)
      if(!res.data[0].Code){
        this.setData({
          storeList:res.data||[]
        })
      }else {
        this.setData({
          storeList:[]
        })
        wx.showToast({
          title: '暂无数据！',
          icon:"none"
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