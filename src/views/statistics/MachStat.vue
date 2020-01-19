<!--
 * @Author: coco-Tang
 * @Date: 2019-08-27 09:08:01
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-12-07 11:42:53
 * @Description: 
 -->
<template>
  <div class="mach-stat">
    <div class="sec sec--num">
      <div>
        <p class="title grey">机器总量:</p>
        <div>
          <span class="f28px">{{totalMach}}</span>
          <span>台</span>
        </div>
      </div>
      <div>
        <p class="title grey">正常机器:</p>
        <div>
          <span class="f28px green">{{normalMach}}</span>
          <span>台</span>
        </div>
      </div>
      <div>
        <p class="title grey">离线机器:</p>
        <div>
          <span class="f28px grey">{{offlineMach}}</span>
          <span>台</span>
        </div>
      </div>
    </div>
    <div class="sec sec--engine">
      <p class="title">引擎&nbsp;&nbsp;({{ getCount(engineArr) }}台)</p>
      <div class="char-top" :class="engineArr.length > 52 ? 'width-tweak' : ''">
        <div :key="i" v-for="(j,i) in calcAlphabet(engineArr)">{{ j }}</div>
      </div>
      <div class="engine">
        <div
          class="foo"
          :class="{'bar':i<26, 'nor':k.flag=='up', 'abn':k.flag=='abnormal', 'off':k.flag=='offline'}"
          :data-char-left="calcCharLeft(i)"
          :key="i"
          v-for="(k,i) in engineArr"
          @click="callShowGraph(k)"
        >
          <!-- {{ k.num }} -->
        </div>
      </div>
    </div>
    <div class="sec sec--disp">
      <p class="title">调度机&nbsp;&nbsp;({{ getCount(dispArr) }}台)</p>
      <div class="char-top">
        <div :key="i" v-for="(j,i) in calcAlphabet(dispArr)">{{ j }}</div>
      </div>
      <div class="disp" :class="dispArr.length > 52 ? 'width-tweak' : ''">
        <div
          class="foo"
          :class="{'bar':i<26, 'nor':k.flag=='up', 'abn':k.flag=='abnormal', 'off':k.flag=='offline'}"
          :data-char-left="calcCharLeft(i)"
          :key="i"
          v-for="(k,i) in dispArr"
          @click="callShowGraph(k)"
        >
          <!-- {{ k }} -->
        </div>
      </div>
    </div>
    <div class="sec sec--vid">
      <p class="title">音视频&nbsp;&nbsp;({{ getCount(vidArr) }}台)</p>
      <div class="char-top">
        <div :key="i" v-for="(j,i) in calcAlphabet(vidArr)">{{ j }}</div>
      </div>
      <div class="vid" :class="vidArr.length > 52 ? 'width-tweak' : ''">
        <div
          class="foo"
          :class="{'bar':i<26, 'nor':k.flag=='up', 'abn':k.flag=='abnormal', 'off':k.flag=='offline'}"
          :data-char-left="calcCharLeft(i)"
          :key="i"
          v-for="(k,i) in vidArr"
          @click="callShowGraph(k)"
        >
          <!-- {{ k }} -->
        </div>
      </div>
    </div>
    <div class="sec sec--other">
      <p class="title">其他&nbsp;&nbsp;({{ getCount(otherArr) }}台)</p>
      <div class="char-top">
        <div :key="i" v-for="(j,i) in calcAlphabet(otherArr)">{{ j }}</div>
      </div>
      <div class="other" :class="otherArr.length > 52 ? 'width-tweak' : ''">
        <div
          class="foo"
          :class="{'bar':i<26, 'nor':k.flag=='up', 'abn':k.flag=='abnormal', 'off':k.flag=='offline'}"
          :data-char-left="calcCharLeft(i)"
          :key="i"
          v-for="(k,i) in otherArr"
          @click="callShowGraph(k)"
        >
          <!-- {{ k }} -->
        </div>
      </div>
    </div>

    <el-dialog width="60%" :visible.sync="dialogVisible" :before-close="callClose">
      <div class="graph-title">
        IP地址: {{machIp}}&nbsp;&nbsp;&nbsp;&nbsp;机器状态:
        <span class="green">{{machStatus}}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;机器类型: {{machType}}
      </div>

      <div class="line-chart">
        <p>CPU</p>
        <line-chart-mach :chart-data="dataCPU"></line-chart-mach>
        <table>
          <tr>
            <th>利用率</th>
            <!-- <th>速度</th> -->
          </tr>
          <tr>
            <td>{{cpuRate}}</td>
            <!-- <td>1.3GHz</td> -->
          </tr>
        </table>
      </div>

      <div class="line-chart">
        <p>内存</p>
        <line-chart-mach :chart-data="dataMem"></line-chart-mach>
        <table>
          <tr>
            <th>利用率</th>
            <!-- <th>用量</th> -->
          </tr>
          <tr>
            <td>{{memoryRate}}</td>
            <!-- <td>3/24G</td> -->
          </tr>
        </table>
      </div>

      <div class="line-chart">
        <p>磁盘</p>
        <line-chart-mach :chart-data="dataDisk"></line-chart-mach>
        <table>
          <tr>
            <th>用量</th>
          </tr>
          <tr>
            <td>{{diskRate}}</td>
          </tr>
        </table>
      </div>

      <!-- <div class="line-chart">
        <p>网络</p>
        <line-chart-mach :chart-datas="dataNet"></line-chart-mach>
        <table>
          <tr>
            <th>发送</th>
            <th>接收</th>
          </tr>
          <tr>
            <td>{{netRate1}}</td>
            <td>{{netRate}}</td>
          </tr>
        </table>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import lineChartMach from "./components/LineChartMach";

export default {
  data() {
    return {
      isShow: false,
      dialogVisible: false,
      PROMETHEUS_BASEURL: Vue.prototype.PROMETHEUS_BASEURL,
      // PROMETHEUS_BASEURL: 'http://172.17.0.151:9090',
      dataCPU: [],
      dataMem: [],
      dataDisk: [],
      dataNet: [],
      machIp: "",
      machType: "",
      machStatus: "",
      totalMach: 0,
      normalMach: 0,
      abnormalMach: 0,
      offlineMach: 0,
      cpuRate: 0,
      memoryRate: 0,
      diskRate: 0,
      netRate: 0,
      netRate1: 0,
      alphabet: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      engineArr: [],
      vprArr: [],
      dispArr: [],
      vidArr: [],
      otherArr: [],
      timerId: null
    };
  },
  components: {
    lineChartMach
  },
  created() {},
  mounted() {
    this.getData();
    this.timerId = setInterval(async () => {
      await this.getData();
    }, 15 * 1000);
  },
  destroyed() {
    clearInterval(this.timerId);
  },
  methods: {
    getCount(param) {
      if (param) {
        return param.length;
      } else {
        return 0;
      }
    },
    calcAlphabet(arr) {
      let num = this.getCount(arr);
      if (num < this.alphabet.length) {
        return this.alphabet.slice(0, num);
      } else {
        return this.alphabet;
      }
    },
    calcCharLeft(i) {
      if ((i + 1) % 26 == 1) {
        return Math.ceil((i + 1) / 26);
      }
    },
    calcCharTop(i) {
      var characters = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ];
      if (characters[i]) {
        return characters[i];
      }
    },
    callShowGraph(k) {
      this.cpuRate = 0;
      this.memoryRate = 0;
      this.diskRate = 0;
      this.netRate = 0;
      this.netRate1 = 0;

      let end = new Date();
      let start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

      //cpu
      axios
        .get(`${this.PROMETHEUS_BASEURL}/api/v1/query_range`, {
          params: {
            query: `100-(avg by (instance)(irate(node_cpu_seconds_total{job="ulang-cluster",mode="idle",instance="${k.instance}"}[5m]))*100)`,
            start: start,
            end: end,
            step: 3600
          }
        })
        .then(res => {
          let values = res.data.data.result[0].values;
          let data = [];
          for (let i = 0; i < values.length; i++) {
            let [t, v] = values[i];
            data[i] = [t * 1000, parseFloat(v, 10)];
          }
          this.dataCPU = {
            title: "",
            min: start.getTime(),
            max: end.getTime(),
            data: data
          };
          this.cpuRate = `${parseInt(data[values.length - 1][1])}%`;
        });

      //memory
      axios
        .get(`${this.PROMETHEUS_BASEURL}/api/v1/query_range`, {
          params: {
            query: `100-(avg_over_time(node_memory_MemAvailable_bytes{job="ulang-cluster",instance="${k.instance}"}[5m])/avg_over_time(node_memory_MemTotal_bytes{job="ulang-cluster",instance="${k.instance}"}[5m]))*100`,
            start: start,
            end: end,
            step: 3600
          }
        })
        .then(res => {
          let values = res.data.data.result[0].values;
          let data = [];
          for (let i = 0; i < values.length; i++) {
            let [t, v] = values[i];
            data[i] = [t * 1000, parseFloat(v, 10)];
          }
          this.dataMem = {
            title: "",
            min: start.getTime(),
            max: end.getTime(),
            data: data
          };
          this.memoryRate = `${parseInt(data[values.length - 1][1])}%`;
        });

      //filesystem
      axios
        .get(`${this.PROMETHEUS_BASEURL}/api/v1/query_range`, {
          params: {
            query: `100-(node_filesystem_avail_bytes{job="ulang-cluster",instance="${k.instance}",mountpoint="/data"}/node_filesystem_size_bytes{job="ulang-cluster",instance="${k.instance}",mountpoint="/data"}*100)`,
            start: start,
            end: end,
            step: 3600
          }
        })
        .then(res => {
          let values = res.data.data.result[0].values;
          let data = [];
          for (let i = 0; i < values.length; i++) {
            let [t, v] = values[i];
            data[i] = [t * 1000, parseFloat(v, 10)];
          }
          this.dataDisk = {
            title: "",
            min: start.getTime(),
            max: end.getTime(),
            data: data
          };
          this.diskRate = `${parseInt(data[values.length - 1][1])}%`;
        });

      //network 下载
      axios
        .get(`${this.PROMETHEUS_BASEURL}/api/v1/query_range`, {
          params: {
            query: `sum(rate(node_network_recive_bytes_total{job="ulang-cluster",instance="${k.instance}",device!='lo'}[5m]))`,
            start: start,
            end: end,
            step: 3600
          }
        })
        .then(res => {
          let values = res.data.data.result[0].values;
          let data = [];
          for (let i = 0; i < values.length; i++) {
            let [t, v] = values[i];
            data[i] = [t * 1000, parseFloat(v, 10)];
          }
          this.dataNet = {
            title: "",
            min: start.getTime(),
            max: end.getTime(),
            data1: data,
            data2: ""
          };
          let temp = parseInt(data[values.length - 1][1]);
          if (temp < 1000) {
            this.netRate = `${parseInt(temp)}B/s`;
          } else if (temp < 1000 * 1000) {
            this.netRate = `${parseInt(temp / 1000)}KB/s`;
          } else if (temp < 1000 * 1000 * 1000) {
            this.netRate = `${parseInt(temp / 1000 / 1000)}MB/s`;
          } else {
            this.netRate = `${parseInt(temp / 1000 / 1000 / 1000)}GB/s`;
          }
        });

      // 上传
      axios
        .get(`${this.PROMETHEUS_BASEURL}/api/v1/query_range`, {
          params: {
            query: `sum(rate(node_network_transmit_bytes_total{job="ulang-cluster",instance="${k.instance}",device!='lo'}[5m]))`,
            start: start,
            end: end,
            step: 3600
          }
        })
        .then(res => {
          let values = res.data.data.result[0].values;
          let data = [];
          for (let i = 0; i < values.length; i++) {
            let [t, v] = values[i];
            data[i] = [t * 1000, parseFloat(v, 10)];
          }
          this.dataNet.data2 = data;
          let temp = parseInt(data[values.length - 1][1]);
          if (temp < 1000) {
            this.netRate1 = `${parseInt(temp)}B/s`;
          } else if (temp < 1000 * 1000) {
            this.netRate1 = `${parseInt(temp / 1000)}KB/s`;
          } else if (temp < 1000 * 1000 * 1000) {
            this.netRate1 = `${parseInt(temp / 1000 / 1000)}MB/s`;
          } else {
            this.netRate1 = `${parseInt(temp / 1000 / 1000 / 1000)}GB/s`;
          }
        });

      this.setTitle(k);

      this.dialogVisible = true;
    },
    setTitle(k) {
      this.machIp = k.instance;
      this.machType = k.type;
      if (k.flag == "up") {
        this.machStatus = "正常";
      } else {
        this.machStatus = "离线";
      }
    },
    callClose() {
      this.dialogVisible = false;
    },
    getData() {
      let d = new Date();
      // for (let i = 0; i < 80; i++) {
      //   this.engineArr.push(i);
      // }
      // for (let i = 0; i < 15; i++) {
      //   this.vprArr.push(i);
      // }
      // for (let i = 0; i < 50; i++) {
      //   this.otherArr.push(i);
      // }
      // this.vidArr.push(1);
      // return;
      // axios.get('http://localhost:3000/test1')
      axios
        .get(`${this.PROMETHEUS_BASEURL}/api/v1/query`, {
          params: {
            query: "up",
            time: d
          }
        })
        .then(res => {
          this.engineArr = [];
          this.vprArr = [];
          this.dispArr = [];
          this.vidArr = [];
          this.otherArr = [];

          this.totalMach = 0;
          this.normalMach = 0;
          this.abnormalMach = 0;
          this.offlineMach = 0;

          let data = res.data.data.result;
          for (let k in data) {
            this.totalMach++;
            if (
              data[k].metric.group == "kwd-node" ||
              data[k].metric.group == "vpr-node"
            ) {
              this.engineArr.push({
                flag: data[k].metric["__name__"],
                instance: data[k].metric.instance,
                type: "引擎"
              });
            } else if (data[k].metric.group == "disp-node") {
              this.dispArr.push({
                flag: data[k].metric["__name__"],
                instance: data[k].metric.instance,
                type: "调度机"
              });
            } else if (data[k].metric.group == "vid-node") {
              this.vidArr.push({
                flag: data[k].metric["__name__"],
                instance: data[k].metric.instance,
                type: "音视频"
              });
            } else {
              this.otherArr.push({
                flag: data[k].metric["__name__"],
                instance: data[k].metric.instance,
                type: "其它"
              });
            }

            if (data[k].metric["__name__"] == "up") {
              this.normalMach++;
            } else {
              this.offlineMach++;
            }
          }
          console.log(this.engineArr.length);
          console.log(this.vprArr.length);
          console.log(this.dispArr.length);
          console.log(this.otherArr.length);
        });
    }
  }
};
</script>

<style lang='scss' scoped>
$orange: #ff8400;
$green: #21c215;
$grey: #999;

.grey {
  color: $grey;
}
.green {
  color: $green;
}
.orange {
  color: $orange;
}

.mach-stat {
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 100%;
  justify-content: flex-start;
  // align-items: ;

  .sec {
    position: relative;
    width: 100%;
    padding-bottom: 5px;
    margin-bottom: 10px;
    // height: calc(20% - 8px);
    // min-height: 200px;
    background: #fff;
  }
  .grey {
    color: $grey;
  }
  .green {
    color: $green;
  }
  .orange {
    color: $orange;
  }
  .sec--num {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .f28px {
      font-size: 28px;
    }

    p.title {
      font-size: 13px;
    }
    span {
      font-weight: bold;
      font-weight: 700;
    }
  }

  .sec--engine,
  .sec--vpr,
  .sec--disp,
  .sec--vid,
  .sec--other {
    p.title {
      margin: 20px 40px;
      font-size: 16px;
      font-weight: 700;
    }
  }

  .sec--disp,
  .sec--num {
    height: 100px;
  }

  .engine,
  .vpr,
  .disp,
  .vid,
  .other {
    display: flex;
    flex-flow: wrap;
    width: calc(100% - 100px);
    // max-height: calc(100% - 80px);
    // min-height: calc(100% - 80px);
    margin-left: 40px;
    padding: 20px 0 0 20px;
    // overflow-y: auto;
    &.width-tweak {
      width: calc(100% - 96px);
    }
  }
  .foo {
    display: flex;
    justify-content: center;
    position: relative;
    width: 3.84615%;
    // height: 3.84615%;
    height: 18px;
    cursor: pointer;

    background: no-repeat center url("../../static/images/mach-offline.png");
  }
  .foo:nth-of-type(26n + 1)::before {
    position: absolute;
    left: -1.1rem;
    top: 50%;
    margin-top: -0.8rem;
    content: attr(data-char-left);
    color: $grey;
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 1.6rem;
  }

  .nor {
    background: no-repeat center url("../../static/images/mach-normal.png");
  }
  .abn {
    background: no-repeat center url("../../static/images/mach-abnormal.png");
  }
  .off {
    background: no-repeat center url("../../static/images/mach-offline.png");
  }
  .nor,
  .abn,
  .off {
    margin-bottom: 6px;
  }

  ::-webkit-scrollbar {
    height: 4px;
    width: 4px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  ::-webkit-scrollbar-track {
    border-radius: 4px;
    box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.8);
    background: rgba(0, 0, 0, 0.2);
  }
  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  .graph-title {
    color: #000;
    font-weight: 700;
  }
  .line-chart {
    margin-bottom: 20px;
    &:last-of-type {
      margin-bottom: 0;
    }
    p {
      color: #000;
      font-weight: 700;
    }
    table {
      color: $grey;
      font-size: 12px;
      text-align: left;
      th,
      td {
        width: 70px;
      }
      th {
        font-weight: normal;
      }
      td {
        color: #000;
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
  .char-top {
    position: absolute;
    top: 50px;
    left: 40px;
    display: flex;
    height: 18px;
    width: calc(100% - 100px);
    padding-left: 20px;
    color: $grey;
    font-size: 13px;
    font-weight: 700;
    background-color: #fff;
    z-index: 1;
    div {
      display: flex;
      justify-content: center;
      width: 3.84615%;
    }
  }
}
</style>