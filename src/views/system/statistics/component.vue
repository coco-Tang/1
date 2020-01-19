<template>
  <div class="common">
    <div class="part">
      <div class="title">
          <h3>趋势图统计</h3>
          <InputNumber
            style="width:60px;"
            size="small"
            :max="16"
            :min="0"
            v-model="timeStep"
            :formatter="value => `${Object.entries(this.Utils.options)[timeStep][0]}`"
            @on-change="updateChart"
            ></InputNumber>
            <!-- :parser="value => `step:${value}`" -->
      </div>
      <div class="chart">
        <el-tabs v-model="ttype" type="card" @tab-click="handleClick">
          <el-tab-pane :lazy="true" :label="item.label" :name="item.name" v-for="(item,index) in Arr" :key="index">
            <div :id="item.name" style="width: 100%;height:360px;" v-if="ttype === item.name"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="part">
      <div class="title">
          <h3>总数统计</h3>
          <div class="block">
              <el-date-picker
                size="mini"
                :clearable="false"
                :editable="false"
                v-model="value2"
                type="datetimerange"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                format="yyyy-MM-dd HH:mm"
                @change="getTime"
              ></el-date-picker>
          </div>
      </div>
      <div class="chart">
        <div id="total" style="width: 100%;height:360px;"></div>
      </div>
    </div>
  </div>
</template>
<script>
const totalCountMap = {
  /* language */
  dispatcher_engl_total: "英语总数",
  dispatcher_hasc_total: "哈语总数",
  dispatcher_huyu_total: "沪语总数",
  dispatcher_japa_total: "日语总数",
  dispatcher_kore_total: "韩语总数",
  dispatcher_mand_total: "汉语总数",
  dispatcher_yueh_total: "粤语总数",
  dispatcher_wewr_total: "维语总数",
  dispatcher_other_lang_total: "其他语种总数",
  /* dispatch */
  dispatcher_commit_total: "调度提交结果总数",
  dispatcher_handle_length_total: "调度处理消息总时长",
  dispatcher_valid_length_total: "调度处理消息总有效音时长",
  dispatcher_discard_total: "丢弃消息总数",
  dispatcher_handle_total: "调度处理消息总数",
  dispatcher_recv_total: "调度接收消息总数",
  dispatcher_message_queue_len: "调度消息队列长度",
  /* hit */
  dispatcher_kwd_hit_total: "关键词中标总数",
  dispatcher_speechseg_hit_total: "固定音频中标总数",
  dispatcher_voiceprint_hit_total: "声纹中标总数",
  dispatcher_wewrkwd_hit_total: "维语关键词中标总数",
  dispatcher_hasckwd_hit_total: "哈语关键词中标总数",
  /* gender */
  dispatcher_valid_total: "有效音总数",
  dispatcher_invalid_total: "无效音总数",
  dispatcher_man_total: "男性总数",
  dispatcher_woman_total: "女性总数",
  dispatcher_man_woman_total: "男和女总数",
  dispatcher_unknown_gender_total: "未知性别总数"
};
import axios from "axios";
import moment from "moment";
import echarts from "echarts";
import { debounce, get_ele_idx } from "@/utils";
function key2value(obj = {}, key = "") {
  return obj[key];
}
export default {
  data() {
    return {
      ttype: this.Arr[0]["name"],
      timeStep: 9,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value2: "",
      dispatcher_commit_total_chart: null,
      dispatcher_handle_total_chart: null,
      dispatcher_message_queue_len_chart: null,
      dispatcher_recv_total_chart: null,
      dispatcher_valid_length_total_chart: null,
      dispatcher_discard_total_chart: null,
      dispatcher_handle_length_total_chart: null,
      total_chart: null,
      count: {
        dispatcher_commit_total: 0,
        dispatcher_handle_length_total: 0,
        dispatcher_valid_length_total: 0,
        dispatcher_discard_total: 0,
        dispatcher_handle_total: 0,
        dispatcher_recv_total: 0,
        dispatcher_message_queue_len: 0
      },
      timerId: null,
      step: 345 //prometheus查询条件中step为14时横轴对应的时间为1h
    };
  },
  props: {
    Arr: {
      type: Array,
      default() {
        [];
      }
    }
  },
  mounted() {
    // process.env.NODE_ENV === 'production' ?
    // this.config = {
    //   prometheus: this.PROMETHEUS_BASEURL,
    //   vpr: this.vpr,
    //   kwd: this.kwd
    // } :
    // this.config = {
    //   prometheus: "http://192.168.1.203:9090",
    //   vpr: ["192.168.1.238:18081"],
    //   kwd: ["192.168.1.238:18080"]
    // }
    // ;

    this.config = {
      prometheus: "http://172.17.0.143:9090",
      vpr: ["192.168.1.238:18081"],
      kwd: ["192.168.1.238:18080"]
    }

    this.init();
    // this.timerId = setInterval(() => this.init(), 15000);
    // return
    // console.log(this.Arr);
    // console.log(this.Arr.map(item => { return item.name }))
    this.totalCountType = this.Arr.map(item => {
      return item.name;
    });
    this.endTimestamp = +new Date() / 1000;
    this.startTimestamp = (+new Date() - 1000 * 60 * 60 * 24) / 1000;
    this.getChartData();

    this.__resizeHandler = debounce(() => {
      Object.keys(totalCountMap).forEach(item => {
        if ( this[`${item}_chart`] ) {
          this[`${item}_chart`].resize();
        }
      })
      
      if (this.total_chart) {
        this.total_chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.__resizeHandler);
  },
  methods: {
    handleClick(tab, event) {
      this.dataAjax({ className: tab.name });
    },
    time2step(index) {
      // console.log(Object.entries(this.options))
      return Object.entries(this.Utils.options)[index];
    },
    updateChart() {
      // console.log(this.timeStep);
      if (this.timeStep === null) return this.$message.info("请选择一个时间");
      this.step = this.time2step(this.timeStep)[1];
      this.dataAjax({ className: this.ttype });
    },
    dataAjax(params) {
      // debugger
      let endTimestamp = +new Date() / 1000;
      let time = this.time2step(this.timeStep)[0];
      // console.log('time',time)
      // console.log(time.indexOf('d') > -1)
      let startTimestamp = "";
      if (time.indexOf("y") > -1) {
        startTimestamp =
          (+new Date() - parseInt(time) * 1000 * 60 * 60 * 24 * 365) / 1000;
      } else if (time.indexOf("w") > -1) {
        startTimestamp =
          (+new Date() - parseInt(time) * 1000 * 60 * 60 * 24 * 7) / 1000;
      } else if (time.indexOf("d") > -1) {
        startTimestamp =
          (+new Date() - parseInt(time) * 1000 * 60 * 60 * 24) / 1000;
      } else if (time.indexOf("h") > -1) {
        startTimestamp = (+new Date() - parseInt(time) * 1000 * 60 * 60) / 1000;
      } else if (time.indexOf("min") > -1) {
        startTimestamp = (+new Date() - parseInt(time) * 1000 * 60) / 1000;
      } else if (time.indexOf("s") > -1) {
        startTimestamp = (+new Date() - parseInt(time) * 1000) / 1000;
      }
      // console.log('startTimestamp',startTimestamp)
      // let startTimestamp = (+new Date() - 1000 * 60 * 60 * 24) / 1000;
      // console.log(window.sessionStorage.getItem('api'))
      // let config = JSON.parse(window.sessionStorage.getItem("api"));
      let _this = this;
      axios({
        baseURL: process.env.NODE_ENV === 'production' ? '' : '/api/v1',
        url: `${_this.config.prometheus}/api/v1/query_range?query=${
          params.className
        }&start=${startTimestamp}&end=${endTimestamp}&step=${this.step}`,
        withCredentials: false
      }).then(res => {
        let metric = res.data.data.result.map(item => item.metric);

        let data = res.data.data.result
          .reduce((pre, cur) => {
            return [...pre, ...cur.values];
          }, [])
          .map(item => item[1])
          .map(item => parseFloat(item));
        let date = res.data.data.result[0]["values"].map(item => item[0]);

        this.initCharts(
          {
            date,
            data,
            metric: metric[0],
            series: res.data.data.result ? res.data.data.result : []
          },
          params["className"]
        );
      });
    },
    async getChartData() {
      let results = await Promise.all(
        this.totalCountType.map(item => {
          // console.log(item);
          return this.initTotal(item);
        })
      );

      let filtResult = results
        .reduce((a, b) => {
          return a.concat(b);
        }, [])
        // .filter(item => {
        //   return this.config.vpr.includes(item.metric.instance);
        // })
        .map(item => {
          return {
            ...item,
            values: Math.max.apply(
              null,
              item.values.map(el => {
                return el[1];
              })
            )
          };
        });

      console.log("filtResult", filtResult);

      if (this.total_chart) {
        this.total_chart.dispose();
      }

      if (!filtResult.length) return this.$message.warning("暂无筛选数据!");

      

      if (this.$route["name"] !== "Gender") {
        this.initBar(filtResult);
      } else {
        let chartData = filtResult.map((ele, idx) => {
          return Object.assign(
            {},
            { name: this.totalCountType[idx] },
            { value: ele.values },
            ele
          );
        });
        console.log("chartData", chartData);
        this.initPie(
          chartData.slice(0, 4),
          chartData.slice(4, chartData.length)
        );
      }
    },
    getTime(params) {
      if ( !params.length ) return this.$message.warning('')
      this.startTimestamp = +new Date(params[0]) / 1000;
      // console.log(this.startTimestamp)
      this.endTimestamp = +new Date(params[1]) / 1000;
      // console.log(this.endTimestamp)
      this.getChartData();
    },
    initTotal(params) {
      let endTimestamp = this.endTimestamp;
      let startTimestamp = this.startTimestamp;
      // let config = JSON.parse(window.sessionStorage.getItem("api"));
      let timeRange = endTimestamp - startTimestamp;
      let step = 345;
      if ( timeRange > 1 && timeRange < 15 * 60) {
        step = 1;//15min以下step为1
      } else if ( timeRange < 30 * 60 ) {
        step = 3;
      } else if ( timeRange < 60 * 60 ) {
        step = 7;
      } else if ( timeRange < 2 * 60 * 60 ) {
        step = 14;
      } else if ( timeRange < 6 * 60 * 60 ) {
        step = 28;
      } else if ( timeRange < 12 * 60 * 60 ) {
        step = 86;
      } else if ( timeRange < 24 * 60 * 60 ) {
        step = 172;
      } else if ( timeRange < 2 * 24 * 60 * 60 ) {
        step = 345;
      } else if ( timeRange < 7 * 24 * 60 * 60 ) {
        step = 691;
      } else if ( timeRange < 2 * 7 * 24 * 60 * 60 ) {
        step = 2419;
      } else if ( timeRange < 4 * 7 * 24 * 60 * 60 ) {
        step = 4838;
      } else if ( timeRange < 8 * 7 * 24 * 60 * 60 ) {
        step = 9676;
      } else if ( timeRange < 366 * 24 * 60 * 60 ) {
        step = 19353;
      } else if ( timeRange < 2 * 366 * 24 * 60 * 60 ) {
        step = 126144;
      } else {
        step = 252288;
      }
       console.log('timeRange',timeRange);
      let _this = this;
      return new Promise(resolve => {
        axios({
          baseURL: process.env.NODE_ENV === 'production' ? '' : '/api/v1',
          url: `${
            _this.config.prometheus
          }/api/v1/query_range?query=sum_over_time(${params}[${timeRange}s])&start=${startTimestamp}&end=${endTimestamp}&step=${
            step
          }`,
          withCredentials: false
        }).then(res => {
          // console.log('initTotal',res.data.data.result);
          resolve(res.data.data.result);
        });
      });
    },
    initBar(options) {
      // console.log("start",options);

      if (!options) return;

      // this.dispenseChart(nameOfClass, options);//实例化echarts
      const mychart = echarts.init(document.getElementById("total"));

      let option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.totalCountType
              // .map(item => {
              //   return item.metric.__name__;
              // })
              .map(item => {
                return key2value(totalCountMap, item);
              }),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "60%",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            data: options.map(item => {
              return item.values;
            })
          }
        ]
      };

      this.total_chart = mychart;
      mychart.setOption(option);
    },
    initPie(options1, options2) {
      // console.log('options',options)
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["20%", "50%"],
            selectedMode: "single",
            data: options1.map(item => {
              return {
                ...item,
                name: key2value(totalCountMap, item.name)
              };
            }),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          },
          {
            type: "pie",
            radius: "65%",
            center: ["70%", "50%"],
            selectedMode: "single",
            data: options2.map(item => {
              return {
                ...item,
                name: key2value(totalCountMap, item.name)
              };
            }),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };

      const mychart = echarts.init(document.getElementById("total"));
      // console.log('dispatcher_man_total',mychart);
      this.total_chart = mychart;
      mychart.setOption(option);
    },
    initCharts(options, nameOfClass) {
      let _this = this;
      // console.log("options", options.series);
      const data = options.series
        .map(item => {
          return item.values;
        })
        .reduce((pre, cur) => {
          pre.push(
            cur.map(ele => {
              return ele.map((e, idx) => {
                if (idx % 2 === 0) {
                  e = e * 1000;
                } else {
                  e = parseInt(e);
                }
                return e;
              });
            })
          );
          return pre;
        }, []);

      // console.log(data[0])

      const series = data.reduce((pre, cur) => {
        pre.push({
          name: "",
          type: "line",
          data: cur
        });
        return pre;
      }, []);

      let option = {
        title: {
          left: "center",
          text: nameOfClass
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false
          }
        },
        series
      };

      // this.dispenseChart(nameOfClass, options);//实例化echarts
      const mychart = echarts.init(document.getElementById(`${nameOfClass}`));
      // console.log('nameOfClass',nameOfClass)
      this[`${nameOfClass}_chart`] = mychart;
      mychart.setOption(option);
    },
    init() {
      this.dataAjax({ className: this.Arr[0]["name"] });
    }
  }
};
</script>
<style lang="scss" scoped>
.common {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #bfbfbf;
  }

  /* 滚动槽 */
  &::-webkit-scrollbar-track {
    box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 30px;
    height: 16px;
    /* background: rgba(0, 0, 0, 0.1); */
    background: #7d7d7d;
    box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }
  .part {
    width: 100%;
    height: 500px;
    background-color: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .title {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 10px 10px 0 0;
      background-color: #515a6e;
      padding: 20px;
      border-bottom: 1px solid #ccc;
      color: #eee;
    }
    .chart {
      width: 100%;
      height: 100%;
      flex: 1;
      border: 1px solid #ccc;
      border-radius: 0 0 10px 10px;
      border-top: none;

      .arrows-wrap {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: flex-end;
        .arrow {
          width: 100px;
          height: 100%;
          padding: 5px;
        }
      }
      .tab-pane {
        width: 100%;
        height: 350px;
        // flex: 1;
        background-color: #000;
      }
      .chart-line {
        width: 90%;
        // height: 100%;
        min-height: 380px;
        text-align: center;
        // background-color: #666;
      }
    }
  }
}
</style>