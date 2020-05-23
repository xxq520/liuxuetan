// pages/release/release.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '在这里补充问题的详细信息...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    title:""
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
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
    }).exec()
    
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
          new_type:"文章",
          // 文章是否有效
          new_valid:true,
          // 新闻id
          en_new_id:"",
          new_header_image:userInfo.usr_profile_image_tn,
          new_header:that.data.title,
          new_tags:"美国"
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
  }
})
