// 1、引入依赖脚本
import * as echarts from '../ec-canvas/echarts';
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();

let chart = null;

// 2、进行初始化数据
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    legend: {
      top:0,
      right:0,
      data: ['2011年', '2012年']
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
        data: ['2月', '3月', '4月', '5月', '6月']
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
        name: '2011年',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [0, 200000, 101, 134, 90]
      },
      {
        name: '2012年',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [0, 100000, 10000, 134000]
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


  chart.setOption(option);
  return chart;
}

Page({

  onShareAppMessage: function (res) {
    return {
      title: 'ECharts',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    status:30,
    ec: {
      onInit: initChart // 3、将数据放入到里面
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

