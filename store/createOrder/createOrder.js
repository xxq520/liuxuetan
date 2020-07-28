// other/withdrawal/withdrawal.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],
    arrayFs:[],
    fileList: [
      {
        url: 'http://iph.href.lu/60x60?text=default',
        name: '图片2',
        isImage: true
      }
    ],
    // 商品的价格
    price: "",
    // 商品的描述
    miaoshu: "",
    // 服务分类选择
    fuwu: "",
    // 是否修改产品
    edit : "",
    // 修改的产品信息
    product: {},
    // 聊天好友列表数据
    messageList:[],
    // 聊天的chat数据
    chat: {}
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
   // 获取当前聊天组列表数据
  getMessageList() {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : userInfo.usr_key || "", 
      },
      type:"get",
      url:url.getMessageList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      // 格式化最后聊天的时间
      console.log(res,666)
      for(var i=0; i<res.data.length; i++){
        if(res.data[i].last_chat_date){
          res.data[i].last_chat_date = res.data[i].last_chat_date .replace("/Date(","");
          res.data[i].last_chat_date = res.data[i].last_chat_date .replace(")/","");
        }
      }
      if(!res.data[0].Exception){
        that.setData({
          messageList: res.data
        })
      }else{
        that.setData({
          messageList: []
        })
      }
    })
  },
  // 点击确认并发送事件
  async submit() {
    var {goodName,price,miaoshu,fuwu} = this.data;
    if(!this.data.array[this.data.fuwu]){
      wx.showToast({
        title: '请选择商品',
        icon:"none"
      })
      return
    }
    if(!this.data.array[this.data.fuwu].apd_key){
      wx.showToast({
        title: '商品有误',
        icon:"none"
      })
      return
    }
    if(isNaN(price)||price<=0){
      wx.showToast({
        title: '价格有误',
        icon:"none"
      })
      return
    }
    var userInfo = wx.getStorageSync('userInfo');
    if(this.data.chat.usr_key) {
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          // 用户的登录id
          agt_key :userInfo.store,  // 加密代理UID密钥
          aod_key :"" , // 加密代理产品记录UID密钥仅用于更新钱包
          apd_key: this.data.array[this.data.fuwu].apd_key, // 加密代理订单产品记录UID键
          client_usr_key: this.data.chat.chat_user ,//  客户端用户UID加密密钥
          aod_order_ref: "", //  代理订单参考
          new_aos_status: "未付款", // 新代理订单状态（见3.1.1.12）
          aod_price: price ,//  代理订单价格
          aod_remark: miaoshu, // 代理订单备注
          str_task_list:"", //  代理订单任务列表的分隔字符串（*用“|”分隔符分隔）
          str_attachment_list:"", //  代理订单附件列表的分隔字符串（*用“|”分隔符分隔）
          str_attachment_type_list:"", //  代理订单附件类型列表的分隔字符串
          usr_key: userInfo.usr_key, //密用户记录UID密钥用于保存用户
        },
        type:"post",
        url:url.SaveNewAgentOrderRecord,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      var that = this;
      request.getReq(data).then(res=>{
        console.log(res,8889899)
        if(res.data[0].response == "储存成功"){
          // 是否聊天过来创建数据的
          if(this.data.chat.usr_key){
            this.sendMessage(res.data[0].return)
          } else {
            wx.showToast({
              title: '创建成功',
              icon: "none"
            })
            setTimeout(()=>{
              wx.navigateBack();
            },1000);
          }
        }
      })
    } else {
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          // 用户的登录id
          agt_key :userInfo.store,  // 加密代理UID密钥
          aod_key :"" , // 加密代理产品记录UID密钥仅用于更新钱包
          apd_key: this.data.array[this.data.fuwu].apd_key, // 加密代理订单产品记录UID键
          client_usr_key: userInfo.usr_key ,//  客户端用户UID加密密钥
          aod_order_ref: "", //  代理订单参考
          new_aos_status: "拟定订单中", // 新代理订单状态（见3.1.1.12）
          aod_price: price ,//  代理订单价格
          aod_remark: miaoshu, // 代理订单备注
          act_type: "", // 代理订单佣金类型（百分比/金额）
          aod_commission: 0, // 代理订单佣金价值
          usr_key: userInfo.usr_key, //密用户记录UID密钥用于保存用户
        },
        type:"post",
        url:url.SaveAgentOrderRecord,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      var that = this;
      request.getReq(data).then(res=>{
        console.log(res,8889899)
        if(res.data[0].response == "储存成功"){
          // 是否聊天过来创建数据的
            wx.showToast({
              title: '创建成功',
              icon: "none"
            })
            setTimeout(()=>{
              wx.navigateBack();
            },1000);
        }
      })
    }
  },
  // 发送订单信息给聊天
  sendMessage(aod_key) {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true, // 是否显示加载动画
      data: {
        // 用户的登录id
        usr_key: this.data.chat.usr_key || "",
        // 如果不搜索特定的新闻/帖子记录，则为0
        grp_key: this.data.chat.chat_user,
        // 聊天的类型
        grp_type: this.data.chat.grp_type,
        // 发送的消息
        message: `http://liuxuetalk.com/confirmorder/${aod_key}`
      },
      type: "POST",
      url: url.SaveChatGroupMessage,
      header: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
    var that = this;
    request.getReq(data).then(res => {
      console.log(res, 110)
      wx.showToast({
        title: '创建发送成功',
        icon: "none"
      })
      setTimeout(()=>{
        wx.navigateBack();
      },1000);
    })
  },
  // 获取产品列表数据
  getOrder(){
    if(!this.data.edit){
      return false;
    }
      var userInfo = wx.getStorageSync('userInfo');
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          // 用户的登录id
          agt_key :userInfo.store,
          apd_key: this.data.edit,
          agt_name:"",
          apd_name:"",
          cou_name:"",
          apt_type:"",
          apd_ref:"",
          pds_status:"",
          str_created_date:"",
          pageSize:1,
          pageNumber:1
        },
        type:"get",
        url:url.GetAgentProductItems,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      var that = this;
      request.getReq(data).then(res=>{
        for(var i=0; i<res.data.length; i++){
          res.data[i].apd_created_date = res.data[i].apd_created_date.split("(")[1];
          res.data[i].apd_created_date = res.data[i].apd_created_date.split(")")[0];
          res.data[i].apd_created_date = request.format(res.data[i].apd_created_date,"YYYY-MM-dd");
          res.data[i].apd_created_date = res.data[i].apd_created_date.replace(/\-/g,".");
          console.log(res.data[i],88,res.data[i].apd_created_date)
        }
        if(!res.data[0].code){
          this.setData({
            product:res.data[0],
            miaoshu: res.data[0].apd_description,
            price: res.data[0].apd_price,
            goodName: res.data[0].apd_name
          })
        }
      })
    },
      // 获取产品列表数据
  getProduct() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true, // 是否显示加载动画
      data: {
        // 用户的登录id
        agt_key: userInfo.store,
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
      var arr = [];
      for (var i = 0; i < res.data.length; i++) {
        arr.push(res.data[i].apd_name)
      }
      if (!res.data[0].code) {
        this.setData({
          array:res.data,
          arrayFs:arr
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProduct();
    this.getMessageList();
    // 是否聊天过来创建订单的
    if(options.chat){
      this.setData({
        chat:wx.getStorageSync('chatP')
      })
    }
    if(options.id){
      this.setData({
        edit: options.id
      })
      this.getProduct();
    }
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