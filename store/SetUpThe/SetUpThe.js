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
    ],
    store: wx.getStorageSync('store'), // 获取缓存的店铺
    storeName: "", // 店铺
    jianjie: "", // 简介
    content: "", // 内容
    ferfu: "" , // 国家
  },
  onLoad(){
    var store = wx.getStorageSync('store') || {};
    this.setData({
      storeName:store.agt_name, // 店铺
      jianjie: store.agt_description, // 简介
      content: store.agt_description, // 内容
      ferfu: store.cou_name
    })
  },
    // tab选项卡切换
    goTab(e) {
        console.log(e)
        wx.reLaunch({
            url: e.currentTarget.dataset.url,
        })
    }
});