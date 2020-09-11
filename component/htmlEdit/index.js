// pages/problemDetails/problemDetails.js
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Component({
    externalClasses: ['i-class'],

    properties: {
    },
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
      },
      methods:{
        saveHuida() {
          let that = this;
          this.editorCtx.getContents({success:content=>{
            console.log("回答")
            that.triggerEvent('saveHuida',content)//通过triggerEvent将参数传给父组件
          }
        })
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
          wx.createSelectorQuery().in(this).select('#editor').context(function (res) {
            console.log(res,666)
            that.editorCtx =res.context
            // 是否是修改内容
          }).exec()
        },
        onStatusChange(e) {
          const formats = e.detail
          this.setData({ formats })
        },
      }
});
