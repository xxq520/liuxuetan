
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();

Page({

  onShareAppMessage: function (res) {
    return {}
  },
  data: {
    // 排序弹出窗数据
    filterArr: ["销量", "好评", "距离"]
  },
  // tab选项卡切换
  goTab(e) {
    console.log(e)
    wx.reLaunch({
      url: e.currentTarget.dataset.url,
    })
  },
  onReady() {}
});