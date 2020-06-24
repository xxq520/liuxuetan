// 1、引入依赖脚本
import * as echarts from '../ec-canvas/echarts';
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();

let chart = null;
var option = {
  legend: {
    top:0,
    right:0,
    data: ['本月收入', '本年累计']
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  toolbox: {
    feature: {
      saveAsImage: {
        show: false,
      }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: '#8c8c8c'
        }
      },
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: {
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed'
      }
    },
    axisLabel: {
      formatter: '{value}',
      textStyle: {
        color: '#8c8c8c'
      }
    }
  },
  series: [
    {
      name: '2019年',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      data: []
    },
    {
      name: '2020年',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      data: []
    },
    {
      name: '搜索引擎',
      type: 'line',
      stack: '总量',
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      },
      areaStyle: {},
      // data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
};
// 2、进行初始化数据
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}

Page({
  data: {
    status:30,
    ec: {
      onInit: initChart, // 3、将数据放入到里面
    },
    priceList: [], // 收入列表数据
    total : 0 , // 本年收入金额
    store: {}, // 当前顾问数据
    messageAdmin:[], // 管理员通知数据
    message: [], // 信息列表
  },
  onLoad(){
    // 获取近一年销售情况
    this.getGetAgentMonthlyTransaction();
    // 获取当前顾问的店铺数据
    this.GetAgentOverviewDetails();
    // 获取管理员的通知
    this.GetAdminToAgentNotification();
    // 获取当前管理员的提示事项
    this.GetAgentNotification();
  },
  // 获取当前管理员的提示事项
  GetAgentNotification(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key :userInfo.usr_key, 
        ntc_key:"",
        pageSize:1,
        pageNumber:1
      },
      type:"get",
      url:url.GetAdminToAgentNotification,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,8889)
      if(!res.data[0].code){
        this.setData({
          message:res.data
        })
      }
    })
  },
  // 获取管理员通知
  GetAdminToAgentNotification(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        usr_key :userInfo.usr_key, 
        ntc_key:"",
        pageSize:1,
        pageNumber:1
      },
      type:"get",
      url:url.GetAdminToAgentNotification,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,7778)
      if(!res.data[0].code){
        this.setData({
          messageAdmin:res.data
        })
      }
    })
  },
  // 获取当前顾问的店铺数据
  GetAgentOverviewDetails(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :userInfo.store, 
      },
      type:"get",
      url:url.GetAgentOverviewDetails,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,666666)
      if(!res.data[0].code){
        this.setData({
          store:res.data[0]
        })
      }
    })
  },
  // 获取本月收益和本年收益
  getGetAgentMonthlyTransaction(){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      toast: true,// 是否显示加载动画
      data:{
        // 用户的登录id
        agt_key :userInfo.usr_key, 
      },
      type:"get",
      url:url.GetAgentMonthlyTransaction,
      header:{"Content-Type":"application/json; charset=utf-8"}
    }
    var that = this;
    request.getReq(data).then(res=>{
      console.log(res,666)
      if(res.data.length){
        var num = 0;
        for(var i=0; i<res.data.length; i++){
          res.data[i].CumulativeTransaction = 2;
          res.data[i].MonthlyTransaction = 5;
          num += res.data[i].MonthlyTransaction 
          option.xAxis[0].data.push(res.data[i].StrMonth.split("年")[1])
          option.series[0].name = "本年累计"
          option.series[1].name = "本月收入"
          option.series[0].data.push(Number(Math.random()*10+res.data[i].MonthlyTransaction).toFixed(1))
          option.series[1].data.push(Number(Math.random()*10+res.data[i].CumulativeTransaction).toFixed(1))
        }
        this.setData({
          priceList: res.data,
          total: num,
          ec: {
            onInit: initChart, // 3、将数据放入到里面
          }
        }) 
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },

  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      console.log(chart)
    }, 2000);
  },
  // tab选项卡切换
  goTab(e) {
    console.log(e)
    wx.reLaunch({
      url: e.currentTarget.dataset.url,
    })
  }
});

