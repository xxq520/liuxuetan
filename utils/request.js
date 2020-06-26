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
    // 返回的是一个promise对像
    return new Promise((resolve, reject) => {
        // 获取Access Key
        var getKey = new Promise((getKeySuccess, getKeyError) => {
            wx.request({
                url: apisUrl.getAccessKey,
                method: 'post',
                header: { "Content-Type": `application/x-www-form-urlencoded` },
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
                complete: function(){
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
function add0(m){return m<10?'0'+m:m }
function format(shijianchuo,type) {
    var time = new Date(Number(shijianchuo));
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    if(type=='YYYY-MM-dd'){
        return y+'-'+add0(m)+'-'+add0(d)
    } else {
        return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }
}
module.exports = {
    getReq: getRequest,
    format
    // postReq: postReq,
    // header: header,
    // rootDocment: rootDocment,
    // url: url,
};