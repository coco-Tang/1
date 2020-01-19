<template>
  <Dispatch :Arr="dispatchArr"></Dispatch>
</template>
<script>
// const totalCountType = {
//   /* dispatch */
//   dispatcher_commit_total: "",
//   dispatcher_handle_length_total: "",
//   dispatcher_valid_length_total: "",
//   dispatcher_discard_total: "",
//   dispatcher_handle_total: "",
//   dispatcher_recv_total: "",
//   dispatcher_message_queue_len: ""
// };
import Dispatch from "./component";
// import axios from "axios";
// import moment from "moment";
// import echarts from "echarts";
// import { debounce, get_ele_idx } from "@/utils";
export default {
  data() {
    return {
      dispatchArr: [
        {
          label: "调度提交结果总数",
          name: "dispatcher_commit_total"
        },
        {
          label: "调度处理消息总时长",
          name: "dispatcher_handle_length_total"
        },
        {
          label: "调度处理消息总有效音时长",
          name: "dispatcher_valid_length_total"
        },
        {
          label: "丢弃消息总数",
          name: "dispatcher_discard_total"
        },
        {
          label: "调度消息队列长度",
          name: "dispatcher_handle_total"
        },
        {
          label: "调度处理消息总数",
          name: "dispatcher_message_queue_len"
        },
        {
          label: "调度接收消息总数",
          name: "dispatcher_recv_total"
        }
      ],
      // timeStep: 9,
      // dispatcher_commit_total_chart: null,
      // dispatcher_handle_total_chart: null,
      // dispatcher_message_queue_len_chart: null,
      // dispatcher_recv_total_chart: null,
      // dispatcher_valid_length_total_chart: null,
      // dispatcher_discard_total_chart: null,
      // dispatcher_handle_length_total_chart: null,
      // total_chart: null,
      // count: {
      //   dispatcher_commit_total: 0,
      //   dispatcher_handle_length_total: 0,
      //   dispatcher_valid_length_total: 0,
      //   dispatcher_discard_total: 0,
      //   dispatcher_handle_total: 0,
      //   dispatcher_recv_total: 0,
      //   dispatcher_message_queue_len: 0
      // },
      // timerId: null,
      // step: 345 //prometheus查询条件中step为14时横轴对应的时间为1h
    };
  },
  components: { Dispatch },
  // mounted() {
  //   return
  //   // if (!window.sessionStorage.getItem('api')) return
  //   this.config = window.sessionStorage.getItem("api");

  //   this.init();
  //   // this.timerId = setInterval(() => this.init(), 15000);

  //   this.endTimestamp = +new Date() / 1000;
  //   this.startTimestamp = (+new Date() - 1000 * 60 * 60 * 24) / 1000;
  //   this.getChartData();

  //   this.__resizeHandler = debounce(() => {
  //     if (this.dispatcher_commit_total_chart) {
  //       this.dispatcher_commit_total_chart.resize();
  //     }
  //     if (this.dispatcher_handle_total_chart) {
  //       this.dispatcher_handle_total_chart.resize();
  //     }
  //     if (this.dispatcher_message_queue_len_chart) {
  //       this.dispatcher_message_queue_len_chart.resize();
  //     }
  //     if (this.dispatcher_discard_total_chart) {
  //       this.dispatcher_discard_total_chart.resize();
  //     }
  //     if (this.dispatcher_handle_total_chart) {
  //       this.dispatcher_handle_total_chart.resize();
  //     }
  //     if (this.dispatcher_valid_length_total_chart) {
  //       this.dispatcher_valid_length_total_chart.resize();
  //     }
  //     if (this.dispatcher_handle_length_total_chart) {
  //       this.dispatcher_handle_length_total_chart.resize();
  //     }
  //     if (this.total_chart) {
  //       this.total_chart.resize();
  //     }
  //   }, 100);
  //   window.addEventListener("resize", this.__resizeHandler);
  // },
  // destroyed() {
  //   window.removeEventListener("resize", this.__resizeHandler);
  // },
  // methods: {
  //   time2step(index) {
  //     // console.log(Object.entries(this.options))
  //     return Object.entries(this.Util.options)[index];
  //   },
  //   updateChart() {
  //     // console.log(this.timeStep);
  //     if (this.timeStep === null)
  //       return this.$Message.info({ content: "请选择一个时间" });
  //     this.step = this.time2step(this.timeStep)[1];
  //     this.init();
  //   },
  //   dataAjax(params) {
  //     // debugger
  //     let endTimestamp = +new Date() / 1000;
  //     let time = this.time2step(this.timeStep)[0];
  //     // console.log('time',time)
  //     // console.log(time.indexOf('d') > -1)
  //     let startTimestamp = "";
  //     if (time.indexOf("y") > -1) {
  //       startTimestamp =
  //         (+new Date() - parseInt(time) * 1000 * 60 * 60 * 24 * 365) / 1000;
  //     } else if (time.indexOf("w") > -1) {
  //       startTimestamp =
  //         (+new Date() - parseInt(time) * 1000 * 60 * 60 * 24 * 7) / 1000;
  //     } else if (time.indexOf("d") > -1) {
  //       startTimestamp =
  //         (+new Date() - parseInt(time) * 1000 * 60 * 60 * 24) / 1000;
  //     } else if (time.indexOf("h") > -1) {
  //       startTimestamp = (+new Date() - parseInt(time) * 1000 * 60 * 60) / 1000;
  //     } else if (time.indexOf("min") > -1) {
  //       startTimestamp = (+new Date() - parseInt(time) * 1000 * 60) / 1000;
  //     } else if (time.indexOf("s") > -1) {
  //       startTimestamp = (+new Date() - parseInt(time) * 1000) / 1000;
  //     }
  //     // console.log('startTimestamp',startTimestamp)
  //     // let startTimestamp = (+new Date() - 1000 * 60 * 60 * 24) / 1000;
  //     // console.log(window.sessionStorage.getItem('api'))
  //     let config = JSON.parse(window.sessionStorage.getItem("api"));
  //     axios({
  //       url: `${config.prometheus}/api/v1/query_range?query=${
  //         params.className
  //       }&start=${startTimestamp}&end=${endTimestamp}&step=${this.step}`,
  //       withCredentials: false
  //     }).then(res => {
  //       let metric = res.data.data.result.map(item => item.metric);

  //       let data = res.data.data.result
  //         .reduce((pre, cur) => {
  //           return [...pre, ...cur.values];
  //         }, [])
  //         .map(item => item[1])
  //         .map(item => parseFloat(item));
  //       let date = res.data.data.result[0]["values"].map(item => item[0]);

  //       this.initCharts(
  //         {
  //           date,
  //           data,
  //           metric: metric[0],
  //           series: res.data.data.result ? res.data.data.result : []
  //         },
  //         params["className"]
  //       );
  //     });
  //   },
  //   async getChartData() {
  //     let results = await Promise.all(
  //       Object.keys(totalCountType).map(item => {
  //         // console.log(item);
  //         return this.initTotal(item);
  //       })
  //     );
  //     console.log("results", results);
  //     let config = JSON.parse(window.sessionStorage.getItem("api"));
  //     let filtResult = results
  //       .reduce((a, b) => {
  //         return a.concat(b);
  //       }, [])
  //       .filter(item => {
  //         // console.log(config.vpr)
  //         return config.vpr.includes(item.metric.instance);
  //       })
  //       .map(item => {
  //         return {
  //           ...item,
  //           values: Math.max.apply(
  //             null,
  //             item.values.map(el => {
  //               return el[1];
  //             })
  //           )
  //         };
  //       });
  //     // let filtResult = results
  //     //   .reduce((a, b) => {
  //     //     return a.concat(b);
  //     //   }, [])
  //     //   .filter(item => {
  //     //     // console.log(config.vpr)
  //     //     return config.vpr.includes(item.metric.instance);
  //     //   })
  //     //   .map(item => {
  //     //     return {
  //     //       ...item,
  //     //       values: item.values.reduce((pre, cur) => {
  //     //         pre += parseInt(cur[1]);
  //     //         return pre;
  //     //       }, 0)
  //     //     };
  //     //   });
  //     console.log("filtResult", filtResult);
  //     if (filtResult.length) {
  //       this.initBar(filtResult);
  //     } else {
  //       this.$Message.warning({ content: "无筛选数据，请重新选择时间配置项!" });
  //       this.total_chart.dispose();
  //     }
  //   },
  //   getTime(params) {
  //     this.startTimestamp = +new Date(params[0]) / 1000;
  //     // console.log(this.startTimestamp)
  //     this.endTimestamp = +new Date(params[1]) / 1000;
  //     // console.log(this.endTimestamp)
  //   },
  //   initTotal(params) {
  //     let endTimestamp = this.endTimestamp;
  //     let startTimestamp = this.startTimestamp;
  //     let config = JSON.parse(window.sessionStorage.getItem("api"));
  //     let timeRange = endTimestamp - startTimestamp;
  //     return new Promise(resolve => {
  //       // console.log(this)
  //       axios({
  //         url: `${
  //           config.prometheus
  //         }/api/v1/query_range?query=sum_over_time(${params}[${timeRange}s])&start=${startTimestamp}&end=${endTimestamp}&step=${
  //           this.step
  //         }`,
  //         withCredentials: false
  //       }).then(res => {
  //         // console.log('initTotal',res.data.data.result);
  //         resolve(res.data.data.result);
  //       });
  //     });
  //   },
  //   getTotal() {
  //     this.getChartData();
  //   },
  //   initBar(options) {
  //     // console.log("start",options);

  //     if (!options) return;

  //     // this.dispenseChart(nameOfClass, options);//实例化echarts
  //     const mychart = echarts.init(document.getElementById("dispatch"));

  //     let option = {
  //       color: ["#3398DB"],
  //       tooltip: {
  //         trigger: "axis",
  //         axisPointer: {
  //           // 坐标轴指示器，坐标轴触发有效
  //           type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
  //         }
  //       },
  //       grid: {
  //         left: "3%",
  //         right: "4%",
  //         bottom: "3%",
  //         containLabel: true
  //       },
  //       xAxis: [
  //         {
  //           type: "category",
  //           data: Object.keys(totalCountType)
  //             // .map(item => {
  //             //   return item.metric.__name__;
  //             // })
  //             .map(item => {
  //               return this.Util.key2value(this.Util.totalCountMap, item);
  //             }),
  //           axisTick: {
  //             alignWithLabel: true
  //           }
  //         }
  //       ],
  //       yAxis: [
  //         {
  //           type: "value"
  //         }
  //       ],
  //       series: [
  //         {
  //           type: "bar",
  //           barWidth: "60%",
  //           label: {
  //             normal: {
  //               show: true,
  //               position: "top"
  //             }
  //           },
  //           data: options.map(item => {
  //             return item.values;
  //           })
  //         }
  //       ]
  //     };

      
  //     this.total_chart = mychart;
  //     mychart.setOption(option);
  //   },
  //   initCharts(options, nameOfClass) {
  //     let _this = this;
  //     // console.log("options", options.series);
  //     const series = options.series.reduce((pre, cur) => {
  //       pre.push({
  //         name: cur.metric["device"],
  //         type: "line",
  //         data: cur.values.map(item => parseFloat(item[1]))
  //       });
  //       return pre;
  //     }, []);

  //     let dataX = options.series[0]["values"]
  //       .map(item => {
  //         return moment.unix(item[0]).format("YY-MM-DD HH:mm:ss");
  //       })
  //       .map(item => {
  //         return item.split(" ");
  //       });
  //     // console.log('options.series',dataX);
  //     let yymmdd = [];
  //     let hhmmss = [];
  //     dataX.forEach(element => {
  //       yymmdd.push(element[0]);
  //       hhmmss.push(element[1]);
  //     });

  //     // console.log(get_ele_idx(yymmdd))

  //     if (!options) return;

  //     // this.dispenseChart(nameOfClass, options);//实例化echarts
  //     const mychart = echarts.init(document.getElementById(`${nameOfClass}`));

  //     let option = {
  //       tooltip: {
  //         trigger: "axis",
  //         show: true,
  //         textStyle: {
  //           fontSize: "18"
  //         },
  //         formatter: function(params) {
  //           //   console.log('parms',params[0]);
  //           //  <span>${options.series[index]['metric']['__name__']}</span>
  //           //  <span>${options.series[index]['metric']['job']}</span>
  //           if (params.length > 1) {
  //             return `
  //             <ul>
  //              ${params.map((item, index) => {
  //                return `
  //                  <li>
  //                    <span style='color:red;'>${
  //                      !/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/.test(item.data)
  //                        ? item.data
  //                        : item.data.toFixed(3)
  //                    }</span>
  //                    <span>${moment
  //                      .unix(item.name)
  //                      .format("YY-MM-DD HH:mm ")}</span>
  //                    <span>${
  //                      options.series[index]["metric"]["device"] ||
  //                      options.series[index]["metric"]["volume"]
  //                        ? options.series[index]["metric"]["device"] ||
  //                          options.series[index]["metric"]["volume"]
  //                        : ""
  //                    }</span>
  //                    <span>${options.series[index]["metric"]["instance"]}</span>
  //                  </li>
  //                  `;
  //              })}
  //             </ul>
                    
  //             `;
  //           } else {
  //             return `
  //               <ul>
  //                 <li>${moment
  //                   .unix(params[0].name)
  //                   .format("YYYY-MM-DD HH:mm:ss ")}</li>
  //                 <li>${options.series[0]["metric"]["job"]}</li>
  //                 <li>${options.series[0]["metric"]["instance"]}</li>
  //                 <li>${options.series[0]["metric"]["__name__"]}</li>
  //                 <li>${
  //                   !/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/.test(params[0].data)
  //                     ? params[0].data
  //                     : params[0].data.toFixed(3)
  //                 }</li>
  //               </ul>
  //               `;
  //           }
  //         },
  //         position: function(pt) {
  //           return [pt[0], "10%"];
  //         }
  //       },
  //       title: {
  //         left: "center",
  //         text: nameOfClass
  //       },
  //       legend: {
  //         orient: "vertical", // 'vertical'
  //         x: "right", // 'center' | 'left' | {number},
  //         y: "center", // 'center' | 'bottom' | {number}
  //         data: series.reduce((pre, cur) => {
  //           pre.push(cur.name);
  //           return pre;
  //         }, [])
  //       },
  //       xAxis: {
  //         type: "category",
  //         boundaryGap: true,
  //         axisLabel: {
  //           show: true,
  //           textStyle: {
  //             fontSize: "16"
  //           },
  //           interval: function(index) {
  //             let mmFlag = true;
  //             get_ele_idx(yymmdd).forEach(item => {
  //               // console.log(Object.values(item)[0])
  //               if (Object.values(item)[0] === index) {
  //                 mmFlag = false;
  //               }
  //             });

  //             let hhFlag = true;
  //             let hh = hhmmss.map(item => {
  //               return item.split(" ");
  //             });

  //             console.log(hh);
  //             return !mmFlag;
  //           },
  //           formatter: function(value) {
  //             // console.log(_this.time2step(_this.timeStep)[0])
  //             let time = _this.time2step(_this.timeStep)[0];
  //             if (time === "1s") {
  //               console.log("显示毫秒");
  //               return moment.unix(value.split(",")[0]).format("HH:mm");
  //             } else if (time === "10s" || time === "1min") {
  //               console.log("显示秒");
  //               return moment.unix(value.split(",")[0]).format("ss");
  //             } else if (time === "5min" || time === "15min") {
  //               console.log("显示分");
  //               return moment.unix(value.split(",")[0]).format("mm");
  //             } else if (time === "2d" || time === "1w") {
  //               console.log("显示号");
  //               return moment.unix(value.split(",")[0]).format("DD");
  //             } else if (time === "2w" || time === "4w" || time === "8w") {
  //               console.log("显示月号");
  //               return moment.unix(value.split(",")[0]).format("MM-DD");
  //             } else if (time === "1y") {
  //               console.log("显示月");
  //               return moment.unix(value.split(",")[0]).format("MM");
  //             } else {
  //               // console.log('显示时分')
  //               return moment.unix(value.split(",")[0]).format("HH:mm");
  //             }
  //           }
  //         },
  //         data: options.date
  //       },
  //       yAxis: {
  //         type: "value",
  //         boundaryGap: [0, "10%"],
  //         scale: true,
  //         axisLabel: {
  //           show: true,
  //           textStyle: {
  //             fontSize: "16"
  //           },
  //           formatter: function(value) {
  //             return value > 1000 ? `${value / 1000}k` : value;
  //           }
  //         }
  //       },
  //       series
  //     };

  //     this[`${nameOfClass}_chart`] = mychart;
  //     mychart.setOption(option);
  //   },
  //   initCharts(options, nameOfClass) {
  //     let _this = this;
  //     // console.log("options", options.series);
  //     const data = options.series
  //       .map(item => {
  //         return item.values;
  //       })
  //       .reduce((pre, cur) => {
  //         pre.push(
  //           cur.map(ele => {
  //             return ele.map((e, idx) => {
  //               if (idx % 2 === 0) {
  //                 e = e * 1000;
  //               } else {
  //                 e = parseInt(e);
  //               }
  //               return e;
  //             });
  //           })
  //         );
  //         return pre;
  //       }, []);

  //     // console.log(data[0])

  //     const series = data.reduce((pre, cur) => {
  //       pre.push({
  //         name: "",
  //         type: "line",
  //         data: cur
  //       });
  //       return pre;
  //     }, []);

  //     let option = {
  //       title: {
  //         left: "center",
  //         text: nameOfClass
  //       },
  //       tooltip: {
  //         trigger: "axis"
  //       },
  //       xAxis: {
  //         type: "time",
  //         splitLine: {
  //           show: false
  //         }
  //       },
  //       yAxis: {
  //         type: "value",
  //         boundaryGap: [0, "100%"],
  //         splitLine: {
  //           show: false
  //         }
  //       },
  //       series
  //     };

  //     // this.dispenseChart(nameOfClass, options);//实例化echarts
  //     const mychart = echarts.init(document.getElementById(`${nameOfClass}`));

  //     this[`${nameOfClass}_chart`] = mychart;
  //     mychart.setOption(option);
  //   },
  //   init() {
  //     for (let key in totalCountType) {
  //       this.dataAjax({ className: key });
  //     }
  //   }
  // }
};
</script>
<style lang="scss" scoped>
@import url("../../../assets/scss/index.scss");
</style>



