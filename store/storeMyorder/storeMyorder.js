
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();

Page({

  onShareAppMessage: function (res) {
    return {}
  },
  data: {
    // 排序弹出窗数据
    filterArr: ["销量", "好评", "距离"],
    order: [], // 订单数据
  },
  onLoad() {
    // 获取当前用户的订单列表数据
    this.GetAgentOrderItems();
  },
  // 获取当前订单列表数据
  GetAgentOrderItems(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :userInfo.store, 
        aod_key: "", // 加密代理订单UID密钥
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
      if(res.data[0].code!=404){
        this.setData({
          order:res.data
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