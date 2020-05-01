//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      // 是否显示关注选框
      isShow:false
  },
  guanzhu(type,type1){
    if(type1){
      this.setData({
        isShow:true
      })
    }else{
      this.setData({
        isShow:true
      })
    }
  },
  onLoad: function () {

  },

})
