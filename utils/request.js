/**
 * url: 请求地址
 * toast作用： 请求接口时， 显示loadding， 默认"显示"
 */
// 获取应用实例
const app = getApp();
// request path
const apisUrl = require("./apisUrl");
// Api Key
const apiKey = `gCQvVZH+flID8vbXWOKBQvpLVrM/16GWAwAwKpleHpTsjdQ24s/vLmHtnot+7QRiUOCAcviGe9uMuwLz`;
// Security Key
const securityKey = `8l2tst06XWOgQi1G`;
// requret Header Parameter
var header = {
    "Content-Type": `application/x-www-form-urlencoded`
};
// 请求封装
function getRequest(requestParameter) {
    // 是否显示loading层
    if (requestParameter.toast) {
        wx.showLoading({
            title: '加载中',
        })
    }
    // 做需要登录的接口验证
    var urlArr = [
        apisUrl.SaveNewsCommentRecord,
        apisUrl.SaveUserNewOption,
        apisUrl.SaveUserFavForumAdmin,
        apisUrl.GetChatGroupHistory,
        apisUrl.SaveChatGroupMessage,
        apisUrl.SaveNewsRecord,
        apisUrl.LikeNewsCommentRecord,
        apisUrl.GetUserQuestionItems,
        apisUrl.UpdateUserDetailsRecord,
        apisUrl.DeleteNewsRecord,
        apisUrl.CreateChatDirectGroup,
        apisUrl.SaveAgentOrderRecord,
    ]
    var userInfo = wx.getStorageSync('userInfo');
    if (urlArr.indexOf(requestParameter.url) != -1 && !userInfo) {
        wx.showModal({
            title: '请先登录！',
            content: '该功能需要登录后即可正常使用',
            showCancel: false, //是否显示取消按钮
            confirmText: "确认", //默认是“确定”
            confirmColor: 'skyblue', //确定文字的颜色
            success: function (res) {
                if (res.cancel) {
                    //点击取消,默认隐藏弹框
                } else {
                    //点击确定
                    wx.navigateTo({
                        url: '/pages/login/login',
                    })
                }
            },
            fail: function (res) {}, //接口调用失败的回调函数
            complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
        })
        wx.hideLoading({})
        return false;
    }
    // 返回的是一个promise对像
    return new Promise((resolve, reject) => {
        // 获取Access Key
        var getKey = new Promise((getKeySuccess, getKeyError) => {
            wx.request({
                url: apisUrl.getAccessKey,
                method: 'post',
                header: {
                    "Content-Type": `application/x-www-form-urlencoded`
                },
                data: {
                    apiKey,
                    security: securityKey
                },
                // success 成功回调
                success: function (res) {
                    // 判断是否是成功的状态
                    if (res.statusCode === 200) {
                        getKeySuccess(res.data[0]);
                    }
                },
                fail: function (error) {
                    getKeyError(error);
                }
            })
        })
        // 获取Access Key 成功后 调用相应的api
        getKey.then(getKeyData => {
            requestParameter.data.accessKey = getKeyData.accessKey;
            requestParameter.data.accessSecurity = getKeyData.security;
            wx.request({
                url: requestParameter.url,
                method: requestParameter.type || "post",
                header: header,
                data: requestParameter.data,
                success: function (res) {
                    resolve(res);
                },
                fail: function (error) {
                    showModal('网络错误', '网络出错，请刷新重试', false)
                    reject(error);
                },
                complete: function () {
                    if (requestParameter.toast) {
                        wx.hideLoading();
                    }
                }
            })
        }).catch(error => {
            if (requestParameter.toast) {
                wx.hideLoading();
            }
            showModal('网络错误', '网络出错，请刷新重试', false)
        })
    })
}
// 弹窗显示错误提示信息
function showModal(title, content, showCancel) {
    wx.showModal({
        title,
        content,
        showCancel
    });
}
// 时间格式化
function add0(m) {
    return m < 10 ? '0' + m : m
}

function format(shijianchuo, type) {
    var time = new Date(Number(shijianchuo));
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    if (type == 'YYYY-MM-dd') {
        return y + '-' + add0(m) + '-' + add0(d)
    } else {
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }
}
// 上传文件
function uploadFile(tempFilePaths,type) {
    return new Promise((resolve, reject) => {
        wx.showLoading()
        wx.uploadFile({
            url: `${apisUrl.uploadFile}?type=${type?type:'ProfilePic'}`, // 仅为示例，非真实的接口地址
            filePath: tempFilePaths,
            name: 'Data',
            formData: {},
            success(res) {
                if (res.data && JSON.parse(res.data)) {
                    resolve("http://www.liuxuetalk.com"+JSON.parse(res.data)[0].return)
                } else {
                    wx.showToast({
                        title: '文件上传失败',
                    })
                    reject()
                }
            },
            fail(){reject()},
            complete(){
                wx.hideLoading({})
            }
        });
    })
}
module.exports = {
    getReq: getRequest,
    format,
    uploadFile
    // postReq: postReq,
    // header: header,
    // rootDocment: rootDocment,
    // url: url,
};