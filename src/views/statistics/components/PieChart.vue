<!--
 * @Author: coco-Tang
 * @Date: 2019-09-17 09:58:51
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-21 12:16:00
 * @Description: 饼图
 -->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
// require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
const animationDuration = 3000;
export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "200px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
      if (this.autoResize) {
        this.__resizeHandler = debounce(() => {
          if (this.chart) {
            this.chart.resize();
          }
        }, 100);
        window.addEventListener("resize", this.__resizeHandler);
      }
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler);
    }

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    setOptions({ title, min, max, data } = {}) {
      this.chart.setOption({
        title: {
          text: title,
          x: "center",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        grid: {
          width: "auto",
          height: "60%",
          //   top: '50%',
          left: 95,
          right: 60,
          bottom: 60
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  //自定义颜色
                  var colorList = [
                    "#6798d6",
                    "#3fca68",
                    "#66d2d8",
                    "#8fdb67",
                    "#d9db67",
                    "#da7367"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el);
      this.setOptions(this.chartData);
    }
  }
};
</script>
