// pages/personalData/personalData.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: wx.getStorageSync('nowStore'), // 获取当前顾问信息
    nowStore: wx.getStorageSync('nowStore'), // 获取当前顾问信息
    productList : [], // 服务项目列表数据
    option1: [], // 分类数据
    type: "", // 分类的类型
    userId: "", //是否只是查看用户主页，并不是顾问主页
  },

  /**
   * 生命周期函数--监听页面加载
   */
   //  初始化首页数据
   getIndexData() {
    var userInfo = wx.getStorageSync('userInfo');
    let nowStore = wx.getStorageSync('nowStore');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : nowStore.usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        new_key: "" , 
        // 返回数据页码. 1=归还所有记录
        pageSize: 1,
        // 每个数据页的记录数量 1=归还所有记录
        pageNumber: 1,
        // 按标签名称搜索新闻/帖子
        search_tags: nowStore.usr_key,
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
      function unescapeHTML1(a){
           a = "" + a;
           return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
      }
      if(res.data[0].Code != 404) {
        that.setData({
          pageNumber: that.data.pageNumber+1
        })
        function getimgsrc(htmlstr) {
          var reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim
          var arr = []
          var tem = null
          while (tem = reg.exec(htmlstr)) {
            if(tem[2].startsWith('http') || tem[2].startsWith('https')){
              arr.push(tem[2])
            } else {
              arr.push(`http://www.liuxuetalk.com/${tem[2]}`)
            }
          }
          return arr
        }
        var entityMap2 = {
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#39;': "'",
          '&#x2F;': '/',
          '&#x60;': '`',
          '&#x3D;': '='
        };
        function unescapeHtml (string) {
          return String(string).replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/ig, function (s) {
            return entityMap2[s];
          });
        }
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
        const formStr = function(details){
          var texts='';//待拼接的内容
          while(details.indexOf('<p')!=-1){//寻找img 循环
            texts+=details.substring('0',details.indexOf('<p')+2);//截取到<img前面的内容
            details = details.substring(details.indexOf('<p')+2);//<img 后面的内容
            if(details.indexOf('style=')!=-1 && details.indexOf('style=')<details.indexOf('>')){
              texts+=details.substring(0,details.indexOf('style="')+7)+"font-size:12px !important;";//从 <img 后面的内容 截取到style= 加上自己要加的内容
              details=details.substring(details.indexOf('style="')+7); //style后面的内容拼接
            }else{
              texts+=' style="font-size:12px !important;" ';
            }
          }
          texts+=details;//最后拼接的内容
          return texts
        }
        const formSpan = function(details){
          var texts='';//待拼接的内容
          while(details.indexOf('<span')!=-1){//寻找img 循环
            console.log(4455)
            texts+=details.substring('0',details.indexOf('<span')+5);//截取到<img前面的内容
            details = details.substring(details.indexOf('<span')+5);//<img 后面的内容
            if(details.indexOf('style=')!=-1 && details.indexOf('style=')<details.indexOf('>')){
              texts+=details.substring(0,details.indexOf('style="')+7)+"font-size:12px !important;";//从 <img 后面的内容 截取到style= 加上自己要加的内容
              details=details.substring(details.indexOf('style="')+7); //style后面的内容拼接
            }else{
              texts+=' style="font-size:12px !important;" ';
            }
          }
          texts+=details;//最后拼接的内容
          return texts
        }
        for(let i =0; i<res.data.length; i++){
          res.data[i].ncm_comment = res.data[i].ncm_comment?res.data[i].ncm_comment.replace("/(↵)/g",""): res.data[i].new_content
          res.data[i].ncm_comment = res.data[i].ncm_comment?res.data[i].ncm_comment.replace("/(\n)/g",""): res.data[i].new_content;
          res.data[i].ncm_comment = unescapeHTML1(res.data[i].ncm_comment)
          res.data[i].ncm_comment = unescapeHtml( res.data[i].ncm_comment);
          res.data[i].ncm_comment = replaceDetail(res.data[i].ncm_comment);
          res.data[i].ncm_comment = formStr(res.data[i].ncm_comment)
          res.data[i].ncm_comment = formSpan(res.data[i].ncm_comment)
          let str  = unescapeHtml( res.data[i].ncm_comment)
          let commentImg = getimgsrc(str);
          res.data[i].ncm_commentImg = commentImg.slice(0,3)
        }
        console.log( res.data,45454545)
        that.setData({
          indexData : res.data,
          noinfo:true
        })
      }
    })
  },
  onLoad: function (options) {
    // 判断是否是个人主页，并不是顾问主页
    if(options.userId) {
      this.setData({
        userId: options.userId
      })
      this.GetAgentProductTypeList();
      this.getIndexData();
    } else {
      this.getProduct();
      this.GetAgentOverviewDetails();
      this.GetAgentProductTypeList();
    }
  },
  // 获取发布文章的用户信息
  // getAuthor() {
  //   var that = this;
  //   request.getReq({
  //     toast: false,// 是否显示加载动画
  //     data:{
  //       // 用户的登录id
  //       usr_key : this.data.userInfo.usr_key || "", 
  //       // 新闻的加密key
  //       new_key: this.data.newContent.new_key, 
  //     },
  //     type:"get",
  //     url:url.GetNewUserProfilePopupDetails,
  //     header:{"Content-Type":"application/json; charset=utf-8"}
  //   }).then(res=>{
  //     that.setData({
  //       author:res.data[0]
  //     })
  //   })
  // },
   // 关注某个用户
   SaveUserFavForumAdmin(e) {
    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: false,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key : userInfo.usr_key || "", 
        // 如果不搜索特定的新闻/帖子记录，则为0
        fav_usr_key:that.data.store.agt_key, 
      },
      type:"POST",
      url:url.SaveUserFavForumAdmin,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    request.getReq(data).then(res=>{
      // that.GetAgentOverviewDetails();
      // that.getAuthor()
    })
  },
   // 获取当前顾问的店铺数据
   GetAgentOverviewDetails(){
    var userInfo = wx.getStorageSync('userInfo');
    var store = wx.getStorageSync('nowStore');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key : store.agt_key,
      },
      type:"get",
      url:url.GetAgentOverviewDetails,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      if(!res.data[0].code){
        for(let i=0; i<res.data.length; i++) {
          res.data[i].agt_tags = store.agt_tags&&store.agt_tags.indexOf(",") !=-1? store.agt_tags.split(',') : store.agt_tags
          console.log(store.agt_tags,520)
        }
        wx.setStorageSync('storeDetail', res.data[0])
        this.setData({
          store:res.data[0]
        })
      }
    })
  },
   // 筛选产品列表数据
   changeP(e){
    this.setData({
      type: this.data.option1[e.detail].text=="全部"?"": this.data.option1[e.detail].text
    })
    this.getProduct();
  },
   // 获取当前用户可以申请的产品列表
   GetAgentProductTypeList(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        apt_id :0, 
      },
      type:"get",
      url:url.GetAgentProductTypeList,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      if(!res.data[0].code){
        var arr = [];
        arr.push({value:0,text:'全部'})
        for(var i=0; i<res.data.length; i++){
          arr.push({value:res.data[i].apt_id,text:res.data[i].apt_type})
        }
        this.setData({
          option1:arr,
        })
      }
    })
  },
  // 在线联系
  CreateChatDirectGroup(){
    var userInfo = wx.getStorageSync('userInfo');
      var data = {
        toast: true, // 是否显示加载动画
        data: {
          // 用户的登录id
          chat_usr_key: this.data.store.agt_key,
          usr_key: userInfo.usr_key
        },
        type: "post",
        url: url.CreateChatDirectGroup,
        header: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }
      var that = this;
      request.getReq(data).then(res => {
        if(res.data[0]&&res.data[0].response=="储存成功"){
          wx.navigateTo({
            url: '/other/CustomerService/CustomerService?grp_type=Direct&chat='+res.data[0].return,
          });
        }else{
          wx.showToast({
            title: '发起失败，稍后再试。',
            icon: "none"
          })
        }
      })
  },
  // 获取产品列表数据
  getProduct() {
    var userInfo = wx.getStorageSync('nowStore');
    var data = {
      toast: true, // 是否显示加载动画
      data: {
        // 用户的登录id
        agt_key: userInfo.agt_key,
        apd_key: "",
        agt_name: "",
        apd_name: "",
        cou_name: "",
        apt_type: this.data.type,
        apd_ref: "",
        pds_status: "",
        str_created_date: "",
        pageSize: 1,
        pageNumber: 1
      },
      type: "get",
      url: url.GetAgentProductItems,
      header: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
    var that = this;
    request.getReq(data).then(res => {
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].apd_created_date = res.data[i].apd_created_date.split("(")[1];
        res.data[i].apd_created_date = res.data[i].apd_created_date.split(")")[0];
        res.data[i].apd_created_date = request.format(res.data[i].apd_created_date, "YYYY-MM-dd");
        res.data[i].apd_created_date = res.data[i].apd_created_date.replace(/\-/g, ".");
      }
      if (!res.data[0].code) {
        this.setData({
          productList: res.data
        })
      }
    })
  },
    // 跳转商品详情
    goGoodsDetail(e) {
      var index = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: `/other/createProduct/product?id=${this.data.productList[index].apd_key}&store=${this.data.productList[index].agt_key}`,
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