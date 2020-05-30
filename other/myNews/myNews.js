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
    // 当前页面展示的文章
    newList: [],
    noinfo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexData();
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
        usr_id : userInfo.usr_id || 0, 
        // 返回数据页码. 1=归还所有记录
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
         // 在HTML中显示返回的新闻/帖子内容
         showHtml: true
      },
      type:"get",
      url:url.GetUserQuestionItems,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      if(res.data[0].Code){
        that.setData({
          noinfo:true
        })
        return false
      }
      var resData = JSON.parse(res.data.replace(/\]\[/g,","));
      var newArray = [];
      var index = []
      for(var i=0; i<resData.length; i++){
        if(index.indexOf(resData[i].new_id)==-1){
          newArray.push(resData[i])
          index.push(resData[i].new_id)
        }
      }
      that.setData({
        newList :newArray,
        noinfo:true
      })
    })
  },
  // 跳转至问题详情或者普通帖子详情页面
  goPostdetails(e){
      // 如果是普通帖子
      if (e.currentTarget.dataset.type==1){
        wx.navigateTo({
          url: '/postList/postDetails/postDetails?id='+e.currentTarget.dataset.id,
        })
      } else {
        wx.navigateTo({
          url: '/postList/problemDetails/problemDetails?id='+e.currentTarget.dataset.id,
        })
      }
  },
  // 编辑文章
  edit(e) {
    // 获取当前的编辑文章的元素
    var item = this.data.newList[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: `/other/release/release?id=${item.new_id}&type=${item.ntp_type=='问题'?2:1}`,
    })
  },
  //  删除文章
  delete(e) { 
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    // 获取当前的编辑文章的元素
    var item = this.data.newList[e.currentTarget.dataset.index];
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_id : userInfo.usr_id || 0, 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_id: item.new_id, 
        // 返回数据页码. 1=归还所有记录
        pageSize: 1,
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: 1,
        // 按标签名称搜索新闻/帖子
        search_tags: "",
        // 通过任何文本搜索新闻/帖子
        search_term: "",
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
      if(res.data[0].en_new_id){
        var delData = {
          toast: false,// 是否显示加载动画
          data:{
            // 用户的登录id
            usr_id : userInfo.usr_id || 0, 
            // 新闻id
            en_new_id : res.data[0].en_new_id,
          },
          type:"POST",
          url:url.DeleteNewsRecord,
          header:{"Content-Type":"application/json; charset=utf-8"}
        }
        request.getReq(delData).then(delres=>{
          console.log(delres,745689)
          if(res.data[0].response=="储存成功"){
            wx.showToast({
              title: '删除成功'
            })
            that.getIndexData()
          }
        })
      } else {
        wx.showToast({
          title: '删除失败',
          icon:"none"
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