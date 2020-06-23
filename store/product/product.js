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
    typeList:[],
    // 当前销售的产品
    productList:[]
  },
  onLoad(){
    this.GetAgentProductType();
    this.getProduct()
  },
  // 获取当前可以查询的规则
  GetAgentProductType() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :userInfo.usr_key,
        apt_key:"",
        apt_type:"",
        agt_name:"",
        pts_status:"",
        pageSize:1,
        pageNumber:1
      },
      type:"get",
      url:url.GetAgentProductType,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,666666)
      if(!res.data[0].code){
        this.setData({
          typeList:res.data
        })
      }
    })
  },
  // 获取产品列表数据
  getProduct(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :userInfo.store,
        apd_key:"",
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
      console.log(res,666666)
      if(!res.data[0].code){
        this.setData({
          typeList:res.data
        })
      }
    })
  },
  // tab选项卡切换
  goTab(e) {
    console.log(e)
    wx.reLaunch({
      url: e.currentTarget.dataset.url,
    })
  },
  onReady() {}
});