//index.js
//获取应用实例
// 获取封装请求接口文件
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp()
Component({
    externalClasses: ['i-class'],

    properties: {
      comment: {
            type: Object
        }
    },
    data: {
      // 搜索框的内容
      value: "",
      // 搜索的文章或问答文章
      indexData: []
    },
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
      },
      methods:{
        onChange(e) {
          this.setData({
            value: e.detail,
          });
        },
        onSearch() {
          this.getIndexData();
        },
        onClick() {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 1];   //当前页面
          // 直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            isShow: false
          })
        },
        // 跳转至问题详情或者普通帖子详情页面
        goPostdetails(e){
          // 如果是普通帖子
          if (e.currentTarget.dataset.type==1){
            wx.navigateTo({
              url: '/postList/postDetails/postDetails?id='+e.currentTarget.dataset.id+"&index="+e.currentTarget.dataset.index,
            })
          } else {
            wx.navigateTo({
              url: '/postList/problemDetails/problemDetails?id='+e.currentTarget.dataset.id+"&index="+e.currentTarget.dataset.index,
            })
          }
        },
         //  初始化首页数据
        getIndexData() {
          var userInfo = wx.getStorageSync('userInfo');
          var data = {
            toast: true,// 是否显示加载动画
            data:{
              // 用户的登录id
              usr_key : userInfo.usr_key || "", 
              // 如果不搜索特定的新闻/帖子记录，则为0
              new_key: "" , 
              // 返回数据页码. 1=归还所有记录
              pageSize: 100,
              // 每个数据页的记录数量 1=归还所有记录
              pageNumber: 1,
              // 按标签名称搜索新闻/帖子
              search_tags: this.data.value,
              // 通过任何文本搜索新闻/帖子
              search_term: "",
              // 新闻/帖子类型，“文章”或“问题”
              post_type: "",
              // 在HTML中显示返回的新闻/帖子内容
              showHtml: false
            },
            type:"get",
            url:url.indexNews,
            header:{"Content-Type":"application/json; charset=utf-8"}
          }
          var that = this;
          request.getReq(data).then(res=>{
            if(res.data[0].Code != 404 && res.data[0].Code != 501) {
              that.setData({
                indexData : res.data,
              })
            }
          })
        },
      }
});
