const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
Page({
  data: {
    filterArr:["英国","中国"],
    fileList: [
      { url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1',isImage: true },
      {
        url: 'http://iph.href.lu/60x60?text=default',
        name: '图片2',
        isImage: true
      }
    ]
  },
    // tab选项卡切换
    goTab(e) {
        console.log(e)
        wx.reLaunch({
            url: e.currentTarget.dataset.url,
        })
    }
});