// pages/topicColumn/topicColumn.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 点击tab选项卡下标
      tabNum:1,
      // 动态筛选数据
      option1: [
        { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      // 话题专栏的标题
      id: "",
      // 简介的内容
      text: "",
      // 关注数量
      tagNum:{},
      // 用户信息
      userInfo : wx.getStorageSync('userInfo'),
      // 是否关注此话题
      isFavourite:{},
      // 获取讨论的文章数据
      indexData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前的标题专栏的名称
    this.setData({
      id: options.id
    })
    // 获取简介信息
    this.getGetUniIntroRow()
    // 获取关注量或浏览量
    this.GetTagStatistics()
    // 是否关注此话题
    this.CheckUserFavTopic()
    // 获取讨论文章数据
    this.getIndexData()
  },
  // tab点击切换事件 
  changeTab(e){
    this.setData({
      tabNum: e.currentTarget.dataset.num
    })
  },
  // 获取当前专栏见简介
  getGetUniIntroRow(){
    var that = this;
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 专栏的名称
        uniName : this.data.id 
      },
      type:"get",
      url:url.GetUniIntroRow,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    const replaceDetail = function(details){
      var texts='';//待拼接的内容
      while(details.indexOf('<p')!=-1){//寻找img 循环
        texts+=details.substring('0',details.indexOf('<p')+2);//截取到<img前面的内容
        details = details.substring(details.indexOf('<p')+2);//<img 后面的内容
        if(details.indexOf('style=')!=-1 && details.indexOf('style=')<details.indexOf('>')){
          texts+=details.substring(0,details.indexOf('style="')+5)+"margin-bottom:10px;color:#333333;font-size:13px";//从 <img 后面的内容 截取到style= 加上自己要加的内容
          details=details.substring(details.indexOf('style="')+5); //style后面的内容拼接
        }else{
          texts+=' style="margin-bottom:10px;color:#333333;font-size:13px"';
        }
      }
      texts+=details;//最后拼接的内容
      return texts
    }
    request.getReq(data).then(res=>{
      res.data[0].uni_description = replaceDetail(res.data[0].uni_description)
      console.log(res,999)
      that.setData({
        text:res.data[0]
      })
    })
  },
  //  获取当前专栏关注数或浏览量
  GetTagStatistics() {
    var that = this;
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 专栏的名称
        tag_name : this.data.id 
      },
      type:"get",
      url:url.GetTagStatistics,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      that.setData({
        tagNum:res.data[0]
      })
    })
  },
  // 当前用户是否关注此标签
  CheckUserFavTopic() {
    var that = this;
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        usr_id:that.data.userInfo.usr_id,
        // 专栏的名称
        search_tags : this.data.id 
      },
      type:"get",
      url:url.CheckUserFavTopic,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      that.setData({
        isFavourite:res.data[0]
      })
    })
  },
  // 取消关注或关注
  changeFavourite() {
    var that = this;
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        usr_id:that.data.userInfo.usr_id,
        // 专栏的名称
        fav_tags : this.data.id,
        set_valid:true
      },
      type:"POST",
      url:url.SaveUserFavTags,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      console.log(res,"change")
      if(res.data[0].response=="储存成功"){
        var num = that.data.tagNum;
        num.count_favourite = !that.data.isFavourite.isFavourite?num.count_favourite=Number(num.count_favourite+1):num.count_favourite= Number(num.count_favourite-1)
        that.setData({
          isFavourite:{isFavourite:!that.data.isFavourite.isFavourite},
          tagNum:num
        })
      }
    })
  },
  //  初始化首页数据
  getIndexData() {
    var that = this;
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_id : that.data.userInfo.usr_id || 0, 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_id: 0 , 
        // 返回数据页码. 1=归还所有记录
        pageSize: "1",
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: "1",
        // 按标签名称搜索新闻/帖子
        search_tags: this.data.id,
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
      that.setData({
        indexData : res.data
      })
    })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 跳转提问发布页面
  goRelease(e){
    wx.navigateTo({
      url: `/other/release/release?type=${e.currentTarget.dataset.type}&tag=${this.data.id}`,
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
    return {
      title:'你的好友给你分享了话题：'+this.data.id
    }
  }
})