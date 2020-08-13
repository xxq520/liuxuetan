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
    // 请求的数据的页数
    pageNumber: 1,
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
     noinfo:false,
     // 每页数据的条数
     pageSize: 5,
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
        pageSize: this.data.pageSize,
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: this.data.pageNumber,
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
      function unescapeHTML(a){
           a = "" + a;
           return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
      }
      if(res.data[0].Code != 404) {
        that.setData({
          pageNumber: that.data.pageNumber+1
        })
        for(let i =0; i<res.data.length; i++){
          res.data[i].ncm_comment = res.data[i].ncm_comment?res.data[i].ncm_comment.replace("/(↵)/g",""): res.data[i].new_content
          res.data[i].ncm_comment = res.data[i].ncm_comment?res.data[i].ncm_comment.replace("/(\n)/g",""): res.data[i].new_content;
          res.data[i].ncm_comment = unescapeHTML( res.data[i].ncm_comment)
        }
        that.setData({
          indexData : that.data.indexData.concat(res.data),
          noinfo:true
        })
      }
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
  searchIndexData(){
    this.setData({
      pageNumber: 1,
      indexData: []
    })
    //模拟加载
    // 初始化首页数据
    this.getIndexData();
  },
  onPullDownRefresh:function(){
    this.setData({
      pageNumber: 1,
      indexData: []
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    // 初始化首页数据
    this.getIndexData();
    // 获取用户关注的新闻项目
    this.getUserLick()
    setTimeout(function(){
    // complete
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
  },
  onShow(){
     // 初始化首页数据
     this.getIndexData()
     // 获取用户关注的新闻项目
    this.getUserLick()
  },
  onReachBottom: function () {
    this.getIndexData();
  },  
})
