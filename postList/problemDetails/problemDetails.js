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
    formats: {},
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
    // 回答
    huida: false,
    // 滚动条的高度
    scollHeight:0,
    // 是否点赞文章
    isActive : false,
    // 文章作者的信息
    author : {},
    index:0,
    // 需要评论人的内容
    commentItem: {},
    displayName: {}
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        request.uploadFile(res.tempFilePaths[0]).then(img=>{
          that.upLoadImg(img)
        }).catch(err=>{})
      }
    })
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      // 是否是修改内容
    }).exec()

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  upLoadImg(res){
    console.log(res,456)
    var that = this;
      that.editorCtx.insertImage({
        src: res,
        data: {
          id: 'abcd',
          role: 'god'
        },
        width: '80%',
        success: function () {
          console.log('insert image success')
        }
      })
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
  showPopup(e) {
    console.log(e,4546)
    if(e.detail.currentTarget.dataset.type==3){
      this.setData({ type: 3});  
    } else {
      this.setData({ type: 1});  
    }
    let item = e.detail.currentTarget.dataset.subitem;
    this.setData({ show: true, commentItem:e.detail.currentTarget.dataset.item,displayName:item||e.detail.currentTarget.dataset.item});
  },
  showhuidaPopup() {
    this.setData({ huida: true });
  },
  onClose(type) {
    this.setData({ show: false });
  },
  onHuidaClose(type) {
    this.setData({ huida: false });
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
      
      for(let i=0; i<res.data.length; i++){
       var content = res.data[i].ncm_comment;
       var newContent = content
        .replace(/&lt;/g, '<')
        .replace(/\/Uploads/g,"http://www.liuxuetalk.com/Uploads")
        .replace(/&gt;/g, '>')
        .replace(/&amp;nbsp;/g, ' ')
        // <img src="/Uploads/Posts/uk flag.jpg" style="width: 300px;"><p>test picture<br></p>
        newContent = replaceDetail(newContent);
        res.data[i].ncm_comment = newContent;
        if(res.data[i].ncm_comment_count) {
          let childData =  {
            toast: false,// 是否显示加载动画
            data:{
              // 用户的登录id
              usr_key : userInfo.usr_key || "", 
              // 如果不搜索特定的新闻/帖子记录，则为0
              new_key: this.data.newsId, 
              parent_ncm_key: res.data[i].ncm_key,
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
          request.getReq(childData).then(res2=>{
            const replaceDetail1 = function(details){
              var texts='';//待拼接的内容
              while(details.indexOf('<a')!=-1){//寻找img 循环
                texts+=details.substring('0',details.indexOf('<a')+2);//截取到<img前面的内容
                details = details.substring(details.indexOf('<a')+2);//<img 后面的内容
                if(details.indexOf('style=')!=-1 && details.indexOf('style=')<details.indexOf('>')){
                  texts+=details.substring(0,details.indexOf('style="')+7)+"color: #337ab7;";//从 <img 后面的内容 截取到style= 加上自己要加的内容
                  details=details.substring(details.indexOf('style="')+7); //style后面的内容拼接
                }else{
                  texts+=' style="color: #337ab7;" ';
                }
              }
              texts+=details;//最后拼接的内容
              return texts
            }
            for(let m=0; m<res2.data.length; m++){
             let content1 = res2.data[m].ncm_comment;
             var newContent1 = content1
              .replace(/&lt;/g, '<')
              .replace(/\/Uploads/g,"http://www.liuxuetalk.com/Uploads")
              .replace(/&gt;/g, '>')
              .replace(/&amp;nbsp;/g, ' ')
              // <img src="/Uploads/Posts/uk flag.jpg" style="width: 300px;"><p>test picture<br></p>
              newContent1 = replaceDetail(newContent1);
              newContent1 = replaceDetail1(newContent1);
              res2.data[m].ncm_comment = newContent1
              let str = `comment[${i}].childrenList`
              if(!res2.data[0].Code) {
                that.setData({
                  [str] : res2.data || [],
                })
              }
            }
          })
        }
      }
      that.setData({
        comment : res.data,
      })
     if(!res.data[0].Code){
        // 获取文章作者
      that.getAuthor()
     }
    })
  },
  // 查看全部评论
  watchOlder(){
    this.setData({
      watch: !this.data.watch
    })
  },
  closewatchOlder() {
    this.setData({
      watch: false
    })
  },
  // 查看全部回答 
  golookPrpblem(){
    wx.navigateTo({
      url: '/postList/answer/answer?id='+this.data.id,
    })
  },
  // 保存回答
  saveHuida(){ 
    this.editorCtx.getContents({success:content=>{
      var userInfo = wx.getStorageSync('userInfo');
      if(!content.html || content.html=="<p><br></p>"){
        wx.showToast({
          title: '请输入回答内容',
          icon:"none"
        })
        return
      }
      content.html = content.html.replace(/http:\/\/www.liuxuetalk.com/g,"")
      var data = {
        toast: false,// 是否显示加载动画
        data:{
          // 用户的登录id
          usr_key : userInfo.usr_key || "", 
          // 如果不搜索特定的新闻/帖子记录，则为0
          new_key: this.data.newsId, 
          ncm_key:"",
          // 新评论的内容
          new_comment: content.html,
        },
        type:"POST",
        url:url.SaveNewsCommentRecord,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      var that = this;
      request.getReq(data).then(res=>{
        if(res.data[0].response=="储存成功"){
          wx.showToast({
            title: '回答成功',
            icon:"none"
          })
           this.getComment()
        } else {
          wx.showToast({
            title: '回答失败',
            icon:"none"
          })
        }
        that.onHuidaClose()
      })
    }})
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
    let str =  `回复 <a style=\"color: #337ab7;\"  class=\"lnkUserProfile\" >@${this.data.displayName.usr_display_name}</a>&nbsp;: `
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : userInfo.usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_key: this.data.newsId, 
        ncm_key: "",
        parent_ncm_key: this.data.commentItem.ncm_key,
        // 新评论的内容
        ncm_comment: this.data.type==3?str+this.data.commentContent:this.data.commentContent,
      },
      type:"POST",
      url:url.SaveNewsChildCommentRecord,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      if(res.data[0].response=="储存成功"){
        wx.showToast({
          title: '评论成功',
          icon:"none"
        })
        this.getComment()
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
   // 点击详细资料
   goUser() {
    wx.setStorageSync('nowStore', this.data.author)
    wx.navigateTo({
      url: `/other/personalData/personalData?userId=${this.data.author.usr_key}`,
    })
  },
  // 获取发布文章的用户信息
  getAuthor() {
    var that = this;
    request.getReq({
      toast: false,// 是否显示加载动画
      data:{
        author_usr_key: this.data.comment[0] ? this.data.comment[0].usr_key : "",
        // 用户的登录id
        usr_key : this.data.userInfo.usr_key, 
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
    this.setData({
      commentContent:e.detail.value
    })
  },
   // 点赞评论事件
   LikeComment(e){
    // 当前点赞评论的列表下标
    var index = e.detail.currentTarget.dataset.index;
    // 当前点赞评论的元素
    var item = e.detail.currentTarget.dataset.item;
    var that = this; 
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        ncm_key : item.ncm_key, 
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
            // var indexData = `indexData[${this.data.index}]`
            // lastpage.setData({
              // [indexData]:that.data.newContent
      //       });
            break;
          case "pages/discover/discover":
      //       var indexData = `newList[${this.data.index}]`
      //       lastpage.setData({
      //         [indexData]:that.data.newContent
      //       });
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
    },300)
  },
})