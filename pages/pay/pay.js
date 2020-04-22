// 支付页面
// 功能模块
const apisUrl = require("../../utils/apisUrl.js");
const openid = 'o4MaV5Ph7kRjzZNmjCJoSOY_pIVE';
Page({
    data: {
        payNum: 0.01
    },
    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        // 获取登录code
        var getCode = new Promise((resolve, rej) => {
            wx.login({
                success: function (res) {
                    // 发送 res.code 到后台换取 openId
                    var that = this;
                    if (res.code) {
                        resolve(res.code)
                    } else {
                        rej('error:fail')
                    }
                }
            })
        });
    },
    // 支付金额输入框更改事件
    changeNum: function (e) {
        this.setData({
            payNum: e.detail.value
        })
    },
    // 验证是否是数字
    isRealNum(val) {
        // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
        if (val === "" || val == null) {
            return false;
        } else {
            return !isNaN(val);
        }
    },
    // 发起微信支付
    pay() {
        var that = this;
        // 验证文本框的支付数字是否符合规则
        var isTrue = this.isRealNum(this.data.payNum);
        // 支付不为数字 或 支付金额<0.01 Toast提示
        if (!isTrue || this.data.payNum < 0.01) {
            that.showToast('金额需大于一分');
            this.setData({
                payNum: 0.01
            });
            return
        }
        // 请求后端接口 返回微信支付所需参数 调起支付
        wx.request({
            url:apisUrl.getPayParamet,
            data: {
                openId: openid,
                phone: "13500005001",
                payNumber: Number(that.data.payNum)
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function (payParams) {
                payParams = payParams.data.data;
                // 调起微信支付弹窗 传入所需的参数
                wx.requestPayment({
                    'timeStamp': payParams.timeStamp,
                    'nonceStr': payParams.nonceStr,
                    'package': payParams.packageValue,
                    'signType': 'MD5',
                    'paySign': payParams.sign,
                    success: function (paySuccess) {
                        // 支付成功 Toast弹窗提示
                        if (paySuccess.errMsg === "requestPayment:ok") {
                            that.showToast('支付成功')
                        } else {
                            that.showToast('支付失败')
                        }
                    },
                    fail: () => { that.showToast('支付取消')}
                })
            },
            fail: () => { that.showToast('支付参数有误')}
        })
    },
    // 弹窗提示
    showToast(title) {
        wx.showToast({
            title
        })
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {
    },
    // 生命周期函数--监听页面显示
    onShow: function () {
    },
    // 生命周期函数--监听页面隐藏
    onHide: function () {
    },
    // 生命周期函数--监听页面卸载
    onUnload: function () {
    },
    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function () {
    },
    // 页面上拉触底事件的处理函数
    onReachBottom: function () {
    },
    // 用户点击右上角分享
    onShareAppMessage: function () {
    }
});