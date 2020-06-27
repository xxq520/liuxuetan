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
    product: {}
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
    var {goodName,price,miaoshu,fuwu} = this.data;
    if(!goodName){
      wx.showToast({
        title: '请输入商品名称',
        icon: "none"
      })
      return
    }
    if(!miaoshu){
      wx.showToast({
        title: '请输入描述内容',
        icon: "none"
      })
      return
    }
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :userInfo.store,  // 加密代理UID密钥
        apd_key : this.data.product?this.data.product.apd_key:"" , // 加密代理产品记录UID密钥仅用于更新钱包
        apd_name : goodName, // 代理产品名称
        new_pds_status: '新产品审批完成', // 新代理产品中文状态（见3.1.1.7）
        apd_ref : "", // 代理产品参考
        apd_image_url :'http://iph.href.lu/60x60?text=default', // 代理产品图像URL
        apd_description : miaoshu, // 代理产品说明
        apd_price : price, // 代理产品价格
        apd_commission: 0, // 代理产品粉碎价值 *创建新代理产品时为0
        act_type: "", // 代理产品粉碎类型（百分比/金额） *创建新代理产品时为空
        pdt_remark : "", // 代理产品批准备注
        usr_key: userInfo.usr_key, //密用户记录UID密钥用于保存用户
        apt_id : this.data.array[this.data.fuwu||0].apt_id ,
      },
      type:"post",
      url:url.SaveAgentProductRecord,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    var saveType = await this.saveType();
    console.log(saveType,888)
    if(this.data.product||saveType[0].response=="储存成功"){
      request.getReq(data).then(res=>{
        if(res.data[0].response == "储存成功"){
          wx.showToast({
            title: '创建成功',
            icon: "none"
          })
          setTimeout(()=>{
            wx.navigateBack();
          },1000);
        }else{
          wx.showToast({
            title: '创建失败，稍后再试',
            icon: "none"
          })
        }
      })
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetAgentProductTypeList();
    if(options.id){
      this.setData({
        edit: options.id
      })
      this.getProduct();
    }
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
        var arr = [];
        for(var i=0; i<res.data.length; i++){
          arr.push(res.data[i].apt_type)
        }
        this.setData({
          array:res.data,
          arrayFs:arr
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