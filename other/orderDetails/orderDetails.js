// other/orderDetails/orderDetails.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单id 
    orderId: "",
    // 代理id
    agtId: "",
    // 订单数据
    order: {},
    // 附件信息
    fujian: [],
    // 附件类型列表
    fujianType: [],
    // 订单提醒
    tixing: [],
    // 附件地址
    aoa_url: "",
    // 留言
    aod_remark: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId: options.id,
      agtId: options.agt
    })
    this.getOrderTiem()
    this.GetAgentOrderTaskList()
    this.GetAgentOrderNotification()
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
        for(var i=0;i<res.data.length; i++){
          res.data[i].nta_created_date = res.data[i].nta_created_date.split("(")[1];
        res.data[i].nta_created_date = res.data[i].nta_created_date.split(")")[0];
        res.data[i].nta_created_date = request.format(res.data[i].nta_created_date, "YYYY-MM-dd HH-mm-ss");
        res.data[i].nta_notify_date = res.data[i].nta_notify_date.split("(")[1];
        res.data[i].nta_notify_date = res.data[i].nta_notify_date.split(")")[0];
        res.data[i].nta_notify_date = request.format(res.data[i].nta_notify_date, "YYYY-MM-dd");
        }
        this.setData({
          tixing:res.data
        })
      }
    })
  },
  // 获取订单数据
  getOrderTiem() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :this.data.agtId, 
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
          order:res.data[0],
          aod_remark:res.data[0].aod_remark
        })
        this.GetAgentOrderAttachmentList()
        this.GetAgentOrderAttachmentType()
      }
    })
  },
  // 获取可以存储的附件类型
  GetAgentOrderAttachmentType() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        aat_id: 0,  // 代理订单附件类型UID *0返回所有记录
      },
      type:"get",
      url:url.GetAgentOrderAttachmentType,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,787878787)
      if(res.data[0].Code!=404){
        this.setData({
          fujianType:res.data
        })
      }
    })
  },
  // 获取附件信息
  GetAgentOrderAttachmentList() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        aoa_key: "",  // 加密代理订单缓存记录UID密钥
        aod_key: this.data.orderId, // 加密代理订单UID密钥
        // 用户的登录id
        agt_key :this.data.agtId, 
        agt_name: "", // 过滤代理名称
        aat_type: "", // 代理订单附件类型过滤
        pageSize:1,
        pageNumber:1
      },
      type:"get",
      url:url.GetAgentOrderAttachmentList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,8889)
      if(res.data[0].Code!=404){
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].aoa_created_date = res.data[i].aoa_created_date.split("(")[1];
          res.data[i].aoa_created_date = res.data[i].aoa_created_date.split(")")[0];
          res.data[i].aoa_created_date = request.format(res.data[i].aoa_created_date, "YYYY-MM-dd HH-mm-ss");
        }
        
        this.setData({
          fujian: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 附件上传
  uploadFiles() {
    var that = this
    wx.chooseMessageFile({
      count: 1,     //能选择文件的数量
      type: 'file',   //能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
      success(res) { 
        var size = res.tempFiles[0].size;
        var filename = res.tempFiles[0].filename;
        var newfilename = filename + "";  
        console.log(res,456789)
    if (size > 4194304){ //我还限制了文件的大小和具体文件类型
          wx.showToast({
            title: '文件大小不能超过4MB,格式必须为pdf！',
            icon: "none",
            duration: 2000,
            mask: true
          })
        }else{
          request.uploadFile(res.tempFiles[0].path,"AgentApplyDoc").then(file=>{
            that.setData({
              aoa_url:file
            },()=>{
            });
          }).catch(err=>{})
        }
      }
    })
  },
  // 保存订单附件
  SaveAgentOrderAttachment() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :this.data.agtId, 
        aod_key: this.data.orderId, // 加密代理订单UID密钥
        aoa_key: "",  // 加密代理订单缓存记录UID密钥
        aoa_url: this.data.aoa_url, // 代理订单缓存URL
        aat_type: this.data.fujianType[this.data.fujianType.length-1].aat_type, // 代理订单附件类型过滤
        aoa_is_valid:true,  // 如果代理订单附件有效
        usr_key : userInfo.usr_key 
      },
      type:"post",
      url:url.SaveAgentOrderAttachment,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,88891111)
      if(res.data[0].Code!=404){
        wx.showToast({
          title: '发表成功!',
          icon:"none"
        })
        this.GetAgentOrderAttachmentList()
      }else{
        wx.showToast({
          title: '发表失败!稍后重试。',
          icon:"none"
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