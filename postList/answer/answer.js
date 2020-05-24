// pages/answer/answer.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
var timer = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前的文章id
    id:"0",
    // 滚动条的高度
    scollHeight : 0,
     // 用户的信息
     userInfo:   wx.getStorageSync('userInfo'),
    // 是否显示评论输入框弹窗
    show: false,
    // 评论的内容
    commentContent:""

  },
  // 跳转至分类专题页面 
  gotopic(){
    wx.navigateTo({
      url: '/postList/topicColumn/topicColumn?id='+this.data.newContent.new_tags[0],
    })
  },
   // 评论内容更改事件
   changeComment(e){
    console.log(e.detail.value)
    this.setData({
      commentContent:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getNews();
  },
  // 获取文章
  getNews(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_id : userInfo.usr_id || 0, 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_id: this.data.id, 
        // 返回数据页码. 1=归还所有记录
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
        // 按标签名称搜索新闻/帖子
        search_tags:"",
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
      console.log(res)
      res.data[0].new_tags =res.data[0].new_tags.split(",")
      that.setData({
        newContent : res.data[0],
        newsId : res.data[0].en_new_id
      })
      // 获取新闻评论列表
      that.getComment()
    })
  },
  // 获取新闻评论列表项目
  getComment(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_id : userInfo.usr_id || 0, 
        // 如果不搜索特定的新闻/帖子记录，则为0
        en_new_id: this.data.newsId, 
        en_parent_ncm_id:"",
        // 返回数据页码. 1=归还所有记录
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
        showHtml: false
      },
      type:"get",
      url:url.GetNewsItemCommentsItems,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res)
      for(var i=0; i<res.data.length; i++){
        var content = res.data[i].ncm_comment;
        var newContent = content.replace(/<img/gi, '<img style="max-width:50%;height:auto;display:block" ')
        .replace(/&lt;/g, '<')
        .replace(/\/Uploads/g,"http://www.liuxuetalk.com/Uploads")
        .replace(/&gt;/g, '>')
        .replace(/&amp;nbsp;/g, ' ')
        console.log( res.data[i].ncm_comment,898)
        // <img src="/Uploads/Posts/uk flag.jpg" style="width: 300px;"><p>test picture<br></p>
        res.data[i].ncm_comment = newContent
      }
      
      that.setData({
        comment : res.data,
      })
    })
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
    // 添加评论
    SaveNewsCommentRecord(){
      var userInfo = wx.getStorageSync('userInfo');
      if(!this.data.commentContent){
        wx.showToast({
          title: '请输入评论内容',
          icon:"none"
        })
        return
      }
      var data = {
        toast: false,// 是否显示加载动画
        data:{
          // 用户的登录id
          usr_id : userInfo.usr_id || 0, 
          // 如果不搜索特定的新闻/帖子记录，则为0
          en_new_id: this.data.newsId, 
          en_ncm_id:"",
          // 新评论的内容
          new_comment:this.data.commentContent,
        },
        type:"POST",
        url:url.SaveNewsCommentRecord,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      var that = this;
      request.getReq(data).then(res=>{
        console.log(res)
        if(res.data[0].response=="储存成功"){
          wx.showToast({
            title: '评论成功',
            icon:"none"
          })
        } else {
          wx.showToast({
            title: '评论失败',
            icon:"none"
          })
        }
        that.onClose();
        that.getComment()
      })
    },
  // 点赞或收藏文章
  likeNew(e){
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_id : this.data.userInfo.usr_id || 0, 
        // 如果不搜索特定的新闻/帖子记录，则为0
        en_new_id: this.data.newsId, 
        // 是收藏还是点赞
        option: e.currentTarget.dataset.type,
      },
      type:"POST",
      url:url.SaveUserNewOption,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      var changeData = that.data.newContent;
      // 判断当前的点击的是收藏还是点赞
      if(e.currentTarget.dataset.type=='like'){
        changeData.new_like = !that.data.isActive? changeData.new_like+1:changeData.new_like-1;
        that.setData({
          isActive:!that.data.isActive,
          newContent:changeData
        })
      } else {
        console.log(!that.data.isFavourite,789)
        changeData.isFavourite = !changeData.isFavourite
        that.setData({
          newContent:changeData
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

  },
  // 页面的滚动条事件
  onPageScroll:function(e){
    var that = this;
    clearTimeout(timer);
    timer = setTimeout(()=>{
      that.setData({
        scollHeight:e.scrollTop
      })
      console.log(123)
    },300)
  },
})