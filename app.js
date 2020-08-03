//app.js
// 获取封装请求接口文件
const request = require("/utils/request.js");
const url = require("/utils/apisUrl.js");
App({
  onLaunch: function () {
    this.getCount();
    // 检测线上版本更新
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    wx.cloud.init({
      env: 'release-ivr8v',
    })
  },
  globalData: {
    userInfo: null,
    count: 0,
    Country: ['全部','英国','美国','法国','日本','德国','加拿大','瑞典国','澳洲','荷兰','新加坡','韩国','中国','丹麦','新西兰','冰岛','挪威','瑞士','芬兰','新加坡','爱尔兰']
  },
  // 获取用户未读信息数量
  getCount() {
    if (!wx.getStorageSync('userInfo').usr_id) {
      return false;
    }
    var that = this;
    var data = {
      toast: false, // 是否显示加载动画
      data: {
        // 用户的登录id
        usr_key: wx.getStorageSync('userInfo').usr_key,
      },
      type: "get",
      url: url.GetUserUnreadMessageCount,
      header: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
    request.getReq(data).then(res => {
      console.log(res, 787878)
      if (res.data[0].count_unread) {
        that.globalData.count = res.data[0].count_unread
      }
      console.log(that.globalData)
    })
  }
})