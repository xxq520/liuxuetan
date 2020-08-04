// pages/discover/discover.js
// 获取封装请求接口文件
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索的内容 
    searchText: "",
    // tab选项卡的内容
    searchTag:[],
    // 当前页面展示的文章
    newList: [],
    Country:"", // 选中的国家
    arrayFs: app.globalData.Country, //国家
     // 用户的信息
     userInfo:   wx.getStorageSync('userInfo'),
     // 是否显示暂无更多数据
     noinfo:false
  },
  // 服务分类选择事件
  bindMultiPickerChange(e){
    if(e.detail.value==0){
      this.setData({
        Country:""
      })
    } else {
      this.setData({
        Country:this.data.arrayFs[e.detail.value]
      })
    }
    this.getIndexData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexData();
    // 获取tab选项卡标题
    this.getGetHotTagsGroup()
  },
  // 获取tab选项卡标签
  getGetHotTagsGroup() {
    var that = this;
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        ntg_group : "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
      },
      type:"get",
      url:url.GetHotTagsGroup,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      that.setData({
        searchTag: res.data
      })
      console.log(res,666)
    })
  },
  // 去搜索
  goSearch(){
    wx.navigateTo({
      url:"/other/search/search"
    })
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
        new_key: "", 
        // 返回数据页码. 1=归还所有记录
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
        // 按标签名称搜索新闻/帖子
        search_tags: this.data.Country,
        // 通过任何文本搜索新闻/帖子
        search_term: "",
        // 新闻/帖子类型，“文章”或“问题”
        post_type: "",
        // 在HTML中显示返回的新闻/帖子内容
        showHtml: false,
        
      },
      type:"get",
      url:url.indexNews,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,888)
      if(res.data[0].Code!=404) {
        that.setData({
          newList : res.data.splice(0,10),
          noinfo:true
        })
      } else {
        that.setData({
          newList :[],
          noinfo:true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
      var changeData = "newList[" + e.currentTarget.dataset.index + "].isFavourite";
      // 判断当前的点击的是收藏还是点赞
        that.setData({
          [changeData] : !that.data.newList[e.currentTarget.dataset.index].isFavourite
        })
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