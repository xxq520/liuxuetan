// pages/problemDetails/problemDetails.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
var timer = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示全部
    watch:false,
    // 当前文章的id
    id:0,
    // 当前文章的内容
    newContent:{},
    // 加密的文章id
    newsId : "",
    // 评论列表
    comment:[],
    // 用户的信息
    userInfo:   wx.getStorageSync('userInfo'),
    // 评论的内容
    commentContent:"",
    // 是否显示评论输入框弹窗
    show: false,
    // 滚动条的高度
    scollHeight:0,
    // 是否点赞文章
    isActive : false,
    // 文章作者的信息
    author : {},
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      index:options.index
    })
    this.getNews();
  },
  // 去搜索
  goSearch(){
    wx.switchTab({
      url:"/pages/discover/discover"
    })
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  // 获取文章
  getNews(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : userInfo.usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_key: this.data.id, 
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
        showHtml: true
      },
      type:"get",
      url:url.indexNews,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res)
      res.data[0].new_tags =res.data[0].new_tags.split(",");
      const replaceDetail = function(details){
        var texts='';//待拼接的内容
        while(details.indexOf('<img')!=-1){//寻找img 循环
          texts+=details.substring('0',details.indexOf('<img')+4);//截取到<img前面的内容
          details = details.substring(details.indexOf('<img')+4);//<img 后面的内容
          if(details.indexOf('style=')!=-1 && details.indexOf('style=')<details.indexOf('>')){
            texts+=details.substring(0,details.indexOf('style="')+7)+"max-width:100%;height:auto !important;margin:0 auto;";//从 <img 后面的内容 截取到style= 加上自己要加的内容
            details=details.substring(details.indexOf('style="')+7); //style后面的内容拼接
          }else{
            texts+=' style="max-width:100%;height:auto;margin:0 auto;" ';
          }
        }
        texts+=details;//最后拼接的内容
        return texts
      }
      while(res.data[0].new_content.indexOf('src="/Uploads')!=-1){
        res.data[0].new_content= res.data[0].new_content.replace('src="/Uploads','src="http://www.liuxuetalk.com/Uploads')
        res.data[0].new_content= replaceDetail(res.data[0].new_content)
      }
      that.setData({
        newContent : res.data[0],
        isActive:res.data[0].isLiked,
        newsId : res.data[0].new_key
      })
      // 获取新闻评论列表
      that.getComment()
      // 获取文章作者
      that.getAuthor()
    })
  },
  // 获取新闻评论列表项目
  getComment(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : userInfo.usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_key: this.data.newsId, 
        parent_ncm_key:"",
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
       var newContent = content.replace(/<img/gi, '<img style="max-width:50% !important;height:auto;display:block" ')
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
  // 查看全部评论
  watchOlder(){
    this.setData({
      watch: !this.data.watch
    })
  },
  // 查看全部回答 
  golookPrpblem(){
    wx.navigateTo({
      url: '/postList/answer/answer?id='+this.data.id,
    })
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
        usr_key : userInfo.usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_key: this.data.newsId, 
        ncm_key:"",
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
      that.onClose()
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
        new_key: this.data.newsId, 
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
  // 关注某个用户
  SaveUserFavForumAdmin(e) {
    var that = this;
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : this.data.userInfo.usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        fav_usr_key:that.data.author.usr_key, 
      },
      type:"POST",
      url:url.SaveUserFavForumAdmin,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      that.getComment()
      that.getAuthor()
    })
  },
  // 获取发布文章的用户信息
  getAuthor() {
    var that = this;
    request.getReq({
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : this.data.userInfo.usr_key || "", 
        // 新闻的加密key
        new_key: this.data.newContent.new_key, 
      },
      type:"get",
      url:url.GetNewUserProfilePopupDetails,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }).then(res=>{
      that.setData({
        author:res.data[0]
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 评论内容更改事件
  changeComment(e){
    console.log(e.detail.value)
    this.setData({
      commentContent:e.detail.value
    })
  },
   // 点赞评论事件
   LikeComment(e){
    // 当前点赞评论的列表下标
    var index = e.currentTarget.dataset.index;
    // 当前点赞评论的元素
    var item = e.currentTarget.dataset.item;
    var that = this; 
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        en_ncm_id : item.ncm_key, 
        // 如果不搜索特定的新闻/帖子记录，则为0
        usr_key: item.usr_key, 
      },
      type:"POST",
      url:url.LikeNewsCommentRecord,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      if(res.data[0].response=="储存成功") {
        that.getComment();
      } else {
        wx.showToast({
          title: '点赞失败，稍后再试',
          icon:"none"
        })
      }
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
    var that =this
      //获取已经打开的页面的数组
        var pages = getCurrentPages();
        //获取上一个页面的所有的方法和data中的数据
        var lastpage = pages[pages.length - 2]
       //改变上一个页面中的data中的数据
        switch(lastpage.route){
          case "pages/index/index":
            var indexData = `indexData[${this.data.index}]`
            lastpage.setData({
              [indexData]:that.data.newContent
            });
            break;
          case "pages/discover/discover":
            var indexData = `newList[${this.data.index}]`
            lastpage.setData({
              [indexData]:that.data.newContent
            });
            break; 
          case "postList/topicColumn/topicColumn":
            var indexData = `indexData[${this.data.index}]`
            lastpage.setData({
              [indexData]:that.data.newContent
            });
            lastpage.getIndexData&&lastpage.getIndexData()
            break;  
        }
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
    return {
      title:this.data.newContent.new_header
    }
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