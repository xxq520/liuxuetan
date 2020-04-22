// 请求域名
const url = "http://uksefws.liuxuetalk.com";
// 请求后台的url不包括请求参数 若需查询请求参数 到相应的页面查找
module.exports = {
    url: url,
    // 获取AccessKey
    getAccessKey: url + `/wsKeyTestTool.asmx/GenKey`,
    // 留学谈用户登录
    userLogin: url + `/wsGenericDatabind.asmx/ValUserLogin`,
    // 普通商品详情webview地址
    goodsDetail: url + `/localQuickPurchase/distributionVA/goodsDetail/`,
    // 请求后台直播列表数据

    /*请求数据api地址*/

    // 获取直播列表数据
    getLiveLIst: url + `/localQuickPurchase/small/pay/getLiveRooms`,
    // 获取调取微信支付所需的参数
    getPayParamet: url + `/localQuickPurchase/small/pay/pay`,
    // 获取直播回放视频数据
    getLiveBack: url + `/localQuickPurchase/small/pay/getLiveReplay`
};