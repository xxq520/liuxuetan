// pages/release/release.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    // 文章的标题
    title:"",
    // 发布的类型
    type:0,
    // 需要修改文章的id
    id:0,
    // 话题的标签
    tag:"美国"
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(options) {
    if(options.id){
      this.setData({
        id:options.id
      })
      // 获取文章内容
      this.getNews()
    }
    this.setData({
      type:options.type
    })
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })
    
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      // 是否是修改内容
    }).exec()

  },
  // 设置默认内容
  editNews(text){
    var that = this;
    that.editorCtx.setContents({ html:text})
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  changeHeaderTit(e){
    this.setData({
      title:e.detail.value
    })
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res.tempFilePaths[0],64);
        wx.uploadFile({
          url: url.uploadImg, //此处换上你的接口地址
          filePath: res.tempFilePaths[0],
          name: 'FileUpload',
          header: {
          "Content-Type": "multipart/form-data",
          },
          formData: { FileUpload: 1},     //需要传的关于这个图片的信息，比如这个图片属于哪个用户的
          success: function (res) {
            console.log(ok)  
            if (ok) {  
              that.upLoadImg()
            }  
          }  
        }) 
      }
    })
  },
  upLoadImg(){
    var that = this;
      that.editorCtx.insertImage({
        src: res.tempFilePaths[0],
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
  // 保存文章
  saveNews(){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    this.editorCtx.getContents({success:content=>{
      var data = {
        toast: false,// 是否显示加载动画
        data:{
          // 用户的登录id
          usr_id : userInfo.usr_id || 0, 
          // 如果不搜索特定的新闻/帖子记录，则为0
          new_content: content.html, 
          // 文章的类型
          new_type:that.data.type==1?"文章":'问题',
          // 文章是否有效
          new_valid:true,
          // 新闻id
          en_new_id:that.data.newContent.en_new_id||"",
          new_header_image:userInfo.usr_profile_image_tn,
          new_header:that.data.title,
          new_tags:that.data.tag
        },
        type:"POST",
        url:url.SaveNewsRecord,
        header:{"Content-Type":"application/json; charset=utf-8"}
      }
      request.getReq(data).then(res=>{
        if(res.data[0].response=='储存成功'){
          wx.showToast({
            title: '发布成功',
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
          },1000)
        }
      })
    }})
  },
  // 获取需要修改的文章
  getNews(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_id : userInfo.usr_id, 
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
        showHtml: true
      },
      type:"get",
      url:url.indexNews,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res)
      res.data[0].new_tags =res.data[0].new_tags?res.data[0].new_tags.split(","):[];
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
      })
      that.editNews(res.data[0].new_content)
      that.setData({
        title:res.data[0].new_header,
        type:res.data[0].ntp_type
      })
    })
  },
})
