<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import { debounce } from '@/utils'
const animationDuration = 3000;
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      //type: Object,
      required: false
    },
    chartDatas: {
      required: false
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    },
    chartDatas: {
      deep: true,
      handler(val) {
        this.setOptions1(val)
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{

      this.initChart()
      if (this.autoResize) {
        this.__resizeHandler = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHandler)
      }

      // 监听侧边栏的变化
      this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)

    })
    
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions1({ title, min, max, data1, data2 } = {}) {
      this.chart.setOption({
        title: {
          text: title,
          top: 30,
          left: 30,
          textStyle:{
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: "time",
          min: min,
          max: max,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            align: 'left',
            margin: 60
          }
        },
        grid: {
          width: 'auto',
          height: '60%',
          top: '20%',
          left: 95
        },
        series: [{
          type: "line",
          areaStyle: {},
          data: data1
        },{
          type: "line",
          areaStyle: {},
          data: data2
        }]
      })
    },
    setOptions({ title, min, max, data } = {}) {
      this.chart.setOption({
        title: {
          text: title,
          top: 30,
          left: 30,
          textStyle:{
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: "time",
          min: min,
          max: max,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            align: 'left',
            margin: 60
          }
        },
        grid: {
          width: 'auto',
          height: '60%',
          top: '20%',
          left: 95
        },
        series: [{
          type: "line",
          areaStyle: {},
          data: data
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
};
</script>
