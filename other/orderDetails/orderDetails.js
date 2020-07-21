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
    fujian: []
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
          order:res.data[0]
        })
        this.GetAgentOrderAttachmentList()
      }
    })
  },
  // 获取附件信息
  GetAgentOrderAttachmentList() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :this.data.agtId, 
        aod_key: this.data.orderId, // 加密代理订单UID密钥
        aoa_key: "",  // 加密代理订单缓存记录UID密钥
        agt_name: "", // 过滤代理名称
        aat_type: "", // 代理订单附件类型过滤
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
      url:url.GetAgentOrderAttachmentList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,8889)
      if(res.data[0].Code!=404){
        this.setData({
          fujian:res.data
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