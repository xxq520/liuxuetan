// pages/discover/discover.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户的信息
    userInfo:   wx.getStorageSync('userInfo'),
    // 需要查询的内容
    search:"",
    // 需要搜索的标签
    tag:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否是标签搜索
    if(options.tag){
      this.setData({
        tag:options.tag
      })
    }
    this.getIndexData()
  },
  //  初始化首页数据
  getIndexData() {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true, // 是否显示加载动画
      data: {
        // 用户的登录id
        usr_key: userInfo.usr_key || "",
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_key: '',
        // 返回数据页码. 1=归还所有记录
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
        // 按标签名称搜索新闻/帖子
        search_tags: this.data.tag,
        // 通过任何文本搜索新闻/帖子
        search_term: this.data.search,
        // 新闻/帖子类型，“文章”或“问题”
        post_type: "",
        // 在HTML中显示返回的新闻/帖子内容
        showHtml: false,

      },
      type: "get",
      url: url.indexNews,
      header: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
    var that = this;
    request.getReq(data).then(res => {
     if(!res.data[0].Exception){
      that.setData({
        newList: res.data,
        noinfo: true
      })
     }
    })
  },
  // 跳转至问题详情或者普通帖子详情页面
  goPostdetails(e) {
    // 如果是普通帖子
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: '/postList/postDetails/postDetails?id=' + e.currentTarget.dataset.id + "&index=" + e.currentTarget.dataset.index,
      })
    } else {
      wx.navigateTo({
        url: '/postList/problemDetails/problemDetails?id=' + e.currentTarget.dataset.id + "&index=" + e.currentTarget.dataset.index,
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
        en_new_id: e.currentTarget.dataset.id, 
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