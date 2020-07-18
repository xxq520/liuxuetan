// pages/myOrder/myOrder.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否提醒
    checked:false,
    // 当前选中的时间
    date:'',
    // 当前订单详情的id
    orderId:"",
    // 当前订单的数据
    order: {},
    // 订单提醒记录
    tixing:[],
    // 提醒内容
    text:"",
    // 任务列表
    taskList: [],
    showrRenwu:false,
    renwuVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id) {
      this.setData({
        orderId: options.id
      })
      this.GetAgentOrderItems();
    }
    this.GetAgentOrderTaskStatus();
    this.GetAgentOrderTaskList();
  },
  // 发送任务
  sendRenwu(){
    if(!this.data.renwuVal){
      wx.showToast({
        title: '请输入任务内容',
        icon:"none"
      })
      return;
    }
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        agt_key :userInfo.store, 
        aod_key: this.data.orderId, // 加密代理订单UID密钥
        delimited_ata_task:this.data.renwuVal,
        new_ats_status:"未完成",
        delimiter:1,
        usr_key:userInfo.usr_key
      },
      type:"post",
      url:url.SaveAgentOrderTasksArrayList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,445566)
      if(res.data[0].Code!=404){
        wx.showToast({
          title: '成功',
          icon:"none"
        })
        this.GetAgentOrderTaskList()
      }
    })
  },
  // 更改任务输入框
  changeshowrRenwu(){
    this.setData({
      showrRenwu:!this.data.showrRenwu
    })
  },
  // 发表提醒事项
  send(){
    var userInfo = wx.getStorageSync('userInfo');
    var date = new Date();
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :userInfo.store, 
        nta_key:"", //加密通知观众UID密钥 如果创建新通知，则清空，否则提供特定用户UID密钥以更新通知记录
        audience_key: userInfo.usr_key, //加密通知观众UID密钥 i.e. 用户记录UID键
        ntp_type:"order",  // 通知类型(user/alladmin/order/indadmin).
        ntc_header :this.data.text, //通知标题内容
        ntc_content : this.data.text, //通知正文内容
        str_notify_date: this.data.date?this.data.date:date.getFullYear()+"-"+date.getMonth()+1+'-'+date.getDate(), // 以字符串格式通知日期，即。 2020-01-01
        ntc_valid : true , //  如果通知记录有效 
        ref_key: this.data.orderId, //  *这是专为保存订单通知，包括加密订单记录UID键，以供参考
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
      if(res.data[0].Code==404){
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
   // 获取当前订单列表数据
   GetAgentOrderItems(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :userInfo.store, 
        aod_key: this.data.orderId, // 加密代理订单UID密钥
        agt_name: "",  // 过滤代理名称
        apd_name: "", // 代理订购产品名称过滤
        cou_name: "", // 代理对应的Coutry名称进行过滤
        apt_type: "", // 代理订购产品类型过滤
        aod_order_ref: "", // 代理订单参考过滤
        aos_status: "", // 代理订单状态过滤
        cusr_fullname: "", // 代理订购客户端用户名进行过滤
        ausr_fullname: "", // 代理订单处理代理用户名进行筛选
        str_created_date: "", // 代理订单创建日期的字符串格式过滤
        pageSize:1,
        pageNumber:1
      },
      type:"get",
      url:url.GetAgentOrderItems,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,8889)
      if(res.data[0].Code!=404){
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].aod_created_date = res.data[i].aod_created_date.split("(")[1];
          res.data[i].aod_created_date = res.data[i].aod_created_date.split(")")[0];
          res.data[i].aod_created_date = request.format(res.data[i].aod_created_date, "YYYY-MM-dd");
          res.data[i].aod_created_date = res.data[i].aod_created_date.replace(/\-/g, ".");
          res.data[i].aod_mod_date = res.data[i].aod_mod_date.split("(")[1];
          res.data[i].aod_mod_date = res.data[i].aod_mod_date.split(")")[0];
          res.data[i].aod_mod_date = request.format(res.data[i].aod_mod_date, "YYYY-MM-dd");
          res.data[i].aod_mod_date = res.data[i].aod_mod_date.replace("-", "年");
          res.data[i].aod_mod_date = res.data[i].aod_mod_date.replace("-", "月");
          res.data[i].aod_mod_date += "日"
        }
        this.setData({
          order:res.data[0]
        })
        this.GetAgentOrderNotification();
      }
    })
  },
  // 获取订单提醒记录
  GetAgentOrderNotification() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        aod_key: this.data.orderId, // 加密代理订单UID密钥
        pageSize:1,
        pageNumber:1
      },
      type:"get",
      url:url.GetAgentOrderNotification,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,8889110)
      if(res.data[0].Code!=404){
        this.setData({
          tixing:res.data
        })
      }
    })
  },
  // 提醒按钮更改事件
  onChange(){
    this.setData({
      checked:!this.data.checked
    })
  },
  // 时间选择器更改值
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 获取订单任务状态
  GetAgentOrderTaskStatus:function() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        ata_id: 0, // 加密代理订单UID密钥
        ats_id:"0"
      },
      type:"get",
      url:url.GetAgentOrderTaskStatus,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,8889110110)
      if(res.data[0].Code!=404){
        this.setData({
          tixing:res.data
        })
      }
    })
  },
  // 获取订单任务列表
  GetAgentOrderTaskList:function() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        aod_key: this.data.orderId, // 加密代理订单UID密钥
        pageSize:1,
        pageNumber:1,
      },
      type:"get",
      url:url.GetAgentOrderTaskList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,445566)
      if(res.data[0].Code!=404){
        this.setData({
          taskList:res.data
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