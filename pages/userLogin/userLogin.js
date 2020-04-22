// 首页
// 获取应用实例
const app = getApp();
const apisUrl = require("../../utils/apisUrl");
const request = require("../../utils/request");
Page({
    data: {
    },
    onLoad: function (options) {
        this.userLogin()
    },
    //用户登录身份
    userLogin() {
        var login = request.getReq({
                url: apisUrl.userLogin,
                type: "post",
                toast: "true",
                data:{
                    usr_display_name: "andyyung",
                    usr_tel_no: "",
                    usr_password: "testtest"
                },
                that: this
            })
        login.then(res => { 
            console.log(res.data,"数据回来")
        })
    },
});
