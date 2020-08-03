//index.js
//获取应用实例
// 获取封装请求接口文件
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp()
// const request = require("/utils/request");
Page({
  data: {
    // 关注下拉选框数据
    option: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 }
    ],
    // 搜索旁边的发布加号
    sendMessage: false,
    // 是否显示关注遮罩层
    isShow: false,
    guanzhuNum: 0,
    // 显示的推荐数据
    indexData: [],
    // 当前点击搜索的关注内容
    searchContent: "",
    // 用户关注的类型
    follow: [],
    // 当前点击的关注的下标
    followIndex: 0,
     // 用户的信息
     userInfo:   wx.getStorageSync('userInfo'),
     // 搜索的内容
     search:"",
     // 是否显示暂无更多
     noinfo:false
  },
  //提交订单
  formSubmit: function(e) {
    wx.cloud.init({
      env: 'release-ivr8v',
      traceUser: true
    })
    let that = this;
    let formData = e.detail.value
    console.log('form发生了submit事件，携带数据为：', formData)
    wx.cloud.callFunction({
      name: "wxpay",
      data: {
        orderid: "pTCYB4i9z0TYGmH8pE9FkQ163",
        money: 1
      },
      success(res) {
        console.log("提交成功", res.result)
        that.pay(res.result.payment)
      },
      fail(res) {
        console.log("提交失败", res)
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
        console.log("支付成功", res)
      },
      fail(res) {
        console.log("支付失败", res)
      },
      complete(res) {
        console.log("支付完成", res)
      }
    })
  },
  // 点击加号发布按钮事件
  changeMessage(){
    this.setData({
      sendMessage: !this.data.sendMessage
    })
  },
  guanzhu(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  // 点击用户关注新闻标签的某一项的时候
  seacrchFollow(e){
    this.setData({
      // searchContent: e.currentTarget.dataset.text,
      isShow: !this.data.isShow,
      // followIndex: e.currentTarget.dataset.num
    })
    wx.navigateTo({
      url: '/postList/topicColumn/topicColumn?id='+e.currentTarget.dataset.text,
    })
    // 重新请求数据
    // this.getIndexData();
  },
  // 跳转至问题详情或者普通帖子详情页面
  goPostdetails(e){
    // 如果是普通帖子
    if (e.currentTarget.dataset.type==1){
      wx.navigateTo({
        url: '/postList/postDetails/postDetails?id='+e.currentTarget.dataset.id+"&index="+e.currentTarget.dataset.index,
      })
    } else {
      wx.navigateTo({
        url: '/postList/problemDetails/problemDetails?id='+e.currentTarget.dataset.id+"&index="+e.currentTarget.dataset.index,
      })
    }
  },
  onLoad: function () {
    // 请求首页的默认数据
    var data = {
      toast: true,// 是否显示加载动画
    }
    // 初始化首页数据
    this.getIndexData()
    // 获取用户关注的新闻项目
  },
  //  初始化首页数据
  getIndexData() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : userInfo.usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_key: "" , 
        // 返回数据页码. 1=归还所有记录
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
        // 按标签名称搜索新闻/帖子
        search_tags: this.data.searchContent,
        // 通过任何文本搜索新闻/帖子
        search_term: this.data.search,
        // 新闻/帖子类型，“文章”或“问题”
        post_type: "",
        // 在HTML中显示返回的新闻/帖子内容
        showHtml: false
      },
      type:"get",
      url:url.indexNews,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res)
      that.setData({
        indexData : res.data,
        noinfo:true
      })
    })
  },
  // 获取用户关注的新闻项目
  getUserLick() {
    var that = this;
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : wx.getStorageSync('userInfo').usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
      },
      type:"get",
      url:url.userLickType,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      if(!res.data[0].Exception){
        that.setData({
          follow: res.data
        })
      }
    })
  },
  // 点赞或收藏文章
  likeNew(e){
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : this.data.userInfo.usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_key: e.currentTarget.dataset.id, 
        // 是收藏还是点赞
        option: e.currentTarget.dataset.type,
      },
      type:"POST",
      url:url.SaveUserNewOption,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      var changeData = "indexData[" + e.currentTarget.dataset.index + "].isFavourite";
      // 判断当前的点击的是收藏还是点赞
        that.setData({
          [changeData] : !that.data.indexData[e.currentTarget.dataset.index].isFavourite
        })
    })
  },
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    // 初始化首页数据
    this.getIndexData()
    // 获取用户关注的新闻项目
    this.getUserLick()
    setTimeout(function(){
    // complete
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
  },
  onShow(){
    this.getUserLick()
  }
})
