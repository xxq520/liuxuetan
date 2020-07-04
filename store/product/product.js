const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();

Page({

  onShareAppMessage: function (res) {
    return {}
  },
  data: {
    // 排序弹出窗数据
    option1: [{
        text: '全部商品',
        value: 0
      },
      {
        text: '新款商品',
        value: 1
      },
      {
        text: '活动商品',
        value: 2
      }
    ],
    // 获取当前可以查询的产品类型
    typeList: [],
    // 当前销售的产品
    productList: [],
    // 筛选产品的
    type: "",
  },
  onLoad() {
    this.GetAgentProductType();
    this.GetAgentProductTypeList();
  },
  // 筛选产品列表数据
  changeP(e){
    this.setData({
      type:this.data.option1[e.detail-1].text
    })
    this.getProduct();
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
          arr.push({value:res.data[i].apt_id,text:res.data[i].apt_type})
        }
        this.setData({
          option1:arr,
        })
      }
    })
  },
  // 获取当前可以查询的规则
  GetAgentProductType() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true, // 是否显示加载动画
      data: {
        // 用户的登录id
        agt_key: userInfo.usr_key,
        apt_key: "",
        apt_type: "",
        agt_name: "",
        pts_status: "",
        pageSize: 1,
        pageNumber: 1
      },
      type: "get",
      url: url.GetAgentProductType,
      header: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
    var that = this;
    request.getReq(data).then(res => {
      console.log(res, 666666)
      if (!res.data[0].code) {
        this.setData({
          typeList: res.data
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
        apt_type: this.data.type,
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
      if(!res.data[0].Code){
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].apd_created_date = res.data[i].apd_created_date.split("(")[1];
          res.data[i].apd_created_date = res.data[i].apd_created_date.split(")")[0];
          res.data[i].apd_created_date = request.format(res.data[i].apd_created_date, "YYYY-MM-dd");
          res.data[i].apd_created_date = res.data[i].apd_created_date.replace(/\-/g, ".");
          console.log(res.data[i], 88, res.data[i].apd_created_date)
        }
        this.setData({
          productList: res.data
        })
      } else {
        this.setData({
          productList: []
        })
      }
    })
  },
  // 删除或者下架产品
  delete(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      cancelText: '取消',
      confirmText: '确定',
      content: that.data.productList[index].apd_name,
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          var userInfo = wx.getStorageSync('userInfo');
          var data = {
            toast: true, // 是否显示加载动画
            data: {
              // 用户的登录id
              agt_key: userInfo.store,
              apd_key: that.data.productList[index].apd_key,
              apd_valid: false,
              usr_key: userInfo.usr_key
            },
            type: "post",
            url: url.SetAgentProductValid,
            header: {
              "Content-Type": "application/json; charset=utf-8"
            }
          }
          request.getReq(data).then(res => {
            console.log(res, "是否成功删除")
            if (res.data[0].response == "储存成功") {
              that.getProduct();
            }
          })
        }
      },
      title: '确认删除此产品？',
    })

  },
  // tab选项卡切换
  goTab(e) {
    console.log(e)
    wx.reLaunch({
      url: e.currentTarget.dataset.url,
    })
  },
  // 点击修改按钮的跳转事件
  edit(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/store/createProduct/product?id=${this.data.productList[index].apd_key}`,
    })
  },
  onReady() {},
  onShow() {
    this.getProduct();
  },
});