// pages/personalData/personalData.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: wx.getStorageSync('nowStore'), // 获取当前顾问信息
    productList : [], // 服务项目列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProduct();
    this.GetAgentOverviewDetails();
  },
   // 获取当前顾问的店铺数据
   GetAgentOverviewDetails(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :this.data.store.agt_key, 
      },
      type:"get",
      url:url.GetAgentOverviewDetails,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,666666)
      if(!res.data[0].code){
        wx.setStorageSync('storeDetail', res.data[0])
        this.setData({
          store:res.data[0]
        })
      }
    })
  },
    // 获取当前聊天组列表数据
  getMessageList(id) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_id : userInfo.usr_id || 0, 
      },
      type:"get",
      url:url.getMessageList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      // 格式化最后聊天的时间
      if(res.data[0].Code!=404){
        let chatGroup = res.data.data;
        for(let i=0; i<chatGroup.length; i++){
            console.log(chatGroup[i],12)
        }
      }
    })
  },
  // 在线联系
  CreateChatDirectGroup(){
    var userInfo = wx.getStorageSync('userInfo');
      var data = {
        toast: true, // 是否显示加载动画
        data: {
          // 用户的登录id
          chat_usr_id: userInfo.usr_id,
          usr_id: userInfo.usr_id
        },
        type: "post",
        url: url.CreateChatDirectGroup,
        header: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }
      var that = this;
      request.getReq(data).then(res => {
        if(res.data[0]&&res.data[0].response=="储存成功"){
          this.getMessageList(userInfo.usr_id);
        }else{
          wx.showToast({
            title: '发起失败，稍后再试。',
            icon: "none"
          })
        }
      })
  },
  // 获取产品列表数据
  getProduct() {
    var userInfo = wx.getStorageSync('nowStore');
    var data = {
      toast: true, // 是否显示加载动画
      data: {
        // 用户的登录id
        agt_key: userInfo.agt_key,
        apd_key: "",
        agt_name: "",
        apd_name: "",
        cou_name: "",
        apt_type: "",
        apd_ref: "",
        pds_status: "",
        str_created_date: "",
        pageSize: 1,
        pageNumber: 1
      },
      type: "get",
      url: url.GetAgentProductItems,
      header: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
    var that = this;
    request.getReq(data).then(res => {
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].apd_created_date = res.data[i].apd_created_date.split("(")[1];
        res.data[i].apd_created_date = res.data[i].apd_created_date.split(")")[0];
        res.data[i].apd_created_date = request.format(res.data[i].apd_created_date, "YYYY-MM-dd");
        res.data[i].apd_created_date = res.data[i].apd_created_date.replace(/\-/g, ".");
        console.log(res.data[i], 88, res.data[i].apd_created_date)
      }
      if (!res.data[0].code) {
        this.setData({
          productList: res.data
        })
      }
    })
  },
    // 跳转商品详情
    goGoodsDetail(e) {
      var index = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/other/createProduct/product?id=${this.data.productList[index].apd_key}&store=${this.data.productList[index].agt_key}`,
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
    this.setData({
      store: wx.getStorageSync('nowStore')
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