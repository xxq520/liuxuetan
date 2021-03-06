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
    apt_type:"",
    // 商品的名称
    goodName: "",
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
    // 查看的顾问id
    store: "",
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
    //提交订单
    formSubmit: function(item) {
      wx.cloud.init({
        env: 'release-ivr8v',
        traceUser: true
      })
      let that = this;
      // let formData = e.detail.value
      // console.log('form发生了submit事件，携带数据为：', formData)
      var userInfo = wx.getStorageSync('userInfo');
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          // 用户的登录id
          agt_key :item.agt_key, 
          aod_key: item.aod_key, // 加密代理订单UID密钥
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
      request.getReq(data).then(order=>{
        if(order.data[0].Code!=404){
          wx.cloud.callFunction({
            name: "wxpay",
            data: {
              orderid: order.data[0].aod_order_ref,
              money: Number(order.data[0].aod_price)*100,
              attach: `agt_key=${item.agt_key}&usr_key=${item.usr_key}&aod_key=${item.aod_key}`
            },
            success(res) {
              console.log("提交成功", res.result)
              that.pay(res.result.payment)
            },
            fail(res) {
              console.log("提交失败", res)
            }
          })
        }else{
        }
      })
      
    },
  
    //实现小程序支付
    pay(payData) {
      //官方标准的支付方法
      wx.requestPayment({
        timeStamp: payData.timeStamp,
        nonceStr: payData.nonceStr,
        package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
        signType: 'MD5',
        paySign: payData.paySign, //签名
        success(res) {
          wx.navigateTo({
            url: '/other/myOrder/myOrder',
          })
        },
        fail(res) {
          console.log("支付失败", res)
        },
        complete(res) {
          console.log("支付完成", res)
        }
      })
    },
  // 保存用户的产品类型
  saveType() {
    var that = this;
    return new Promise((resolve,reject)=>{
      var userInfo = wx.getStorageSync('userInfo');
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          // 用户的登录id
          agt_key :userInfo.store,  // 加密代理UID密钥
          apt_id : this.data.array[this.data.fuwu||0].apt_id ,
          new_pts_status: '已开通', // 新代理产品中文状态（见3.1.1.7）
          ptt_remark : "保存产品新增产品类型", // 代理产品批准备注
          usr_key: userInfo.usr_key, //密用户记录UID密钥用于保存用户
        },
        type:"post",
        url:url.SaveAgentProductTypeApplication,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      request.getReq(data).then(res=>{
        console.log(res,5555)
        if(res.data[0].response == "储存成功"){
          resolve(res.data)
        }else{
          reject(rea.data)
        }
      })
    })
  },
  // 点击确认并发送事件
  async submit() {
    var product = this.data.product;
    var userInfo = wx.getStorageSync('userInfo');
    if(!Number(product.apd_price)){
      wx.showToast({
        title: '产品价格有误',
        icon: "none"
      })
      return
    }
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :product.agt_key,  // 加密代理UID密钥
        aod_key :"" , // 加密代理产品记录UID密钥仅用于更新钱包
        apd_key: product.apd_key, // 加密代理订单产品记录UID键
        client_usr_key: userInfo.usr_key ,//  客户端用户UID加密密钥
        aod_order_ref: "", //  代理订单参考
        new_aos_status: "未付款", // 新代理订单状态（见3.1.1.12）
        aod_price: product.apd_price ,//  代理订单价格
        aod_remark: this.data.miaoshu, // 代理订单备注
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
        wx.showToast({
          title: '创建成功',
          icon: "none"
        });
        data.data.aod_key = res.data[0].return
        that.formSubmit(data.data);
      }
    })
  },
  // 获取产品列表数据
  getProduct(){
    if(!this.data.edit){
      return false;
    }
      var userInfo = wx.getStorageSync('userInfo');
      var data = {
        toast: true,// 是否显示加载动画
        data:{
          // 用户的登录id
          agt_key :this.data.store,
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
          let fileList = this.data.fileList;
          fileList[0].url = 'http://www.liuxuetalk.com/'+res.data[0].apd_image_url;
          console.log(fileList[0].url,456)
          this.setData({
            fileList: fileList,
            product:res.data[0],
            miaoshu: res.data[0].apd_description,
            price: res.data[0].apd_price,
            goodName: res.data[0].apd_name
          })
        }
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.store){
      this.setData({
        store:options.store,
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