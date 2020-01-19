<!--
 * @Author: coco-Tang
 * @Date: 2019-08-27 09:08:01
 * @LastEditors  : coco-Tang
 * @LastEditTime : 2020-01-19 16:06:43
 * @Description: 
 -->
<template>
  <div class="call-handler-stat">
    <section class="data-item count-stat">
      <div class="top">
        <div class="tag">数据总量</div>
        <div class="time-filter">
          <div class="time-label">时间筛选：</div>
          <el-date-picker
            v-model="summaryQueryRanges"
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="updateSummaryQueryRange(-1)"
          ></el-date-picker>
          <ul style="margin-left:10px;">
            <li
              v-for="range in queryPresetRanges"
              :key="range.index"
              :class="{active: range.index === summaryQueryPreset}"
              @click="updateSummaryQueryRange(range.index)"
            >{{ range.label }}</li>
          </ul>
        </div>
      </div>
      <div class="item-stat">
        <div class="panel callin">
          <div class="pad"></div>
          <div class="img callin-imgbg">
            <img src="../../assets/images/callin-1.png" alt />
          </div>
          <div class="data">
            <div class="title callin">话单接入：</div>
            <div>
              <span class="big">{{ summaryData.recvTotalCount }}</span>
              <span class="unit">(条)</span>
            </div>
          </div>
        </div>
        <div class="panel pre-telephone">
          <div class="pad"></div>
          <div class="img pre-telephone-imgbg">
            <img src="../../assets/images/pre-telephone-1.png" alt />
          </div>
          <div class="data">
            <div class="title pre-telephone">预处理：</div>
            <div class="flex">
              <span>
                <span class="big">{{ summaryData.vprTotalCount }}</span>
                <span class="unit">(条)</span>
              </span>
              <span>
                <span class="big">{{ summaryData.vprTotalHours }}</span>
                <span class="unit">(小时)</span>
              </span>
            </div>
          </div>
        </div>
        <div class="panel transfer">
          <div class="pad"></div>
          <div class="img transfer-imgbg">
            <img src="../../assets/images/transfer-1.png" alt />
          </div>
          <div class="data">
            <div class="title transfer">关键词/转写：</div>
            <div class="flex">
              <span>
                <span class="big">{{ summaryData.kwdTotalCount }}</span>
                <span class="unit">(条)</span>
              </span>
              <span>
                <span class="big">{{ summaryData.kwdTotalHours }}</span>
                <span class="unit">(小时)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="item-stat pie">
        <PieChart :chart-data="platData"></PieChart>
        <PieChart :chart-data="langData"></PieChart>
        <PieChart :chart-data="genderData"></PieChart>
      </div>
    </section>
    <section class="data-item instant">
      <div class="top">
        <div class="tag">
          预处理实时数据
          <span>&nbsp;&nbsp;&nbsp;&nbsp;(条/小时)</span>
        </div>
        <div class="time-filter">
          <ul>
            <li
              v-for="range in queryPresetRanges"
              :key="range.index"
              :class="{active: range.index === vprInstantQueryPreset}"
              @click="updateVprInstantQueryRange(range.index)"
            >{{ range.label }}</li>
          </ul>
        </div>
      </div>
      <div class="line-chart">
        <line-chart :chart-data="vprInstantData" :height="height"></line-chart>
      </div>
    </section>
    <section class="data-item instant">
      <div class="top">
        <div class="tag">
          转写实时数据
          <span>&nbsp;&nbsp;&nbsp;&nbsp;关键词/转写(条/小时)</span>
        </div>
        <div class="time-filter">
          <ul>
            <li
              v-for="range in queryPresetRanges"
              :key="range.index"
              :class="{active: range.index === kwdInstantQueryPreset}"
              @click="updateKwdInstantQueryRange(range.index)"
            >{{ range.label }}</li>
          </ul>
        </div>
        <!-- <div class="carousel">{{msg}}</div> -->
      </div>
      <div class="line-chart">
        <line-chart :chart-data="kwdInstantData" :height="height"></line-chart>
      </div>
    </section>
  </div>
</template>

<script>
import { querySummary, queryDistrib, queryInstant } from "@/api/prometheus";
import lineChart from "./components/LineChart";
import PieChart from "./components/PieChart";

const QUERY_PRESET_RANGES = [
  {
    label: "近一天",
    index: 0,
    value: 1
  },
  {
    label: "近一周",
    index: 1,
    value: 7
  },
  {
    label: "近一月",
    index: 2,
    value: 30
  }
];
export default {
  data() {
    return {
      msg:
        "当查看近一周和近一月的数据后，需要恢复自动刷新数据时，请切换至近一天的状态",
      timerId: null,
      date_range: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      queryPresetRanges: [
        {
          label: "近一天",
          index: 0
        },
        {
          label: "近一周",
          index: 1
        },
        {
          label: "近一月",
          index: 2
        }
      ],

      summaryQueryPreset: 0,
      summaryQueryDate: null,
      summaryQueryRanges: null,
      summaryData: {
        recvTotalCount: "-",
        vprTotalCount: "-",
        vprTotalHours: "-",
        kwdTotalCount: "-",
        kwdTotalHours: "-"
      },
      vprInstantQueryPreset: 0,
      kwdInstantQueryPreset: 0,
      vprInstantData: {},
      kwdInstantData: {},
      genderData: {},
      langData: {},
      platData: {},
      height: ""
    };
  },
  components: {
    lineChart,
    PieChart
  },

  async mounted() {
    const sreenHeight = document.body.clientHeight;
    this.height = sreenHeight > 800 ? "250px" : "200px";
    this.updateSummaryQueryRange(this.summaryQueryPreset);
    this.updateInstantQueryRange();
    this.startFresh();
  },
  destroyed() {
    clearInterval(this.timerId);
  },
  methods: {
    startFresh() {
      this.timerId = setInterval(async () => {
        await this.updateInstantQueryRange();
      }, 15 * 1000);
    },
    endFresh() {
      clearInterval(this.timerId);
    },
    updateSummaryQueryRange(preset) {
      this.summaryQueryPreset = preset;
      let begin_date = new Date();
      let end_date = new Date();
      if (preset != -1) {
        switch (this.queryPresetRanges[preset].label) {
          case "近一天":
            begin_date.setTime(end_date.getTime() - 1 * 24 * 60 * 60 * 1000);
            break;
          case "近一周":
            begin_date.setTime(end_date.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "近一月":
            begin_date.setTime(end_date.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        }
        this.date_range = [begin_date, end_date];
      } else {
        this.date_range = [
          this.summaryQueryRanges[0],
          this.summaryQueryRanges[1]
        ];
      }

      this.getRecvSummaryData(this.date_range[0], this.date_range[1]);
      this.getVprSummaryData(this.date_range[0], this.date_range[1]);
      this.getKwdSummaryData(this.date_range[0], this.date_range[1]);

      this.getPlatformDistrib(this.date_range[0], this.date_range[1]);
      this.getLanguageDistrib(this.date_range[0], this.date_range[1]);
      this.getGenderDistrib(this.date_range[0], this.date_range[1]);
    },
    async getRecvSummaryData(start, end) {
      let t = (end - start) / 1000;
      this.summaryData.recvTotalCount = "-";
      let sumData = await querySummary({
        query: `sum(increase(adapter_recv_total{}[${t}s]))`,
        time: end.toISOString()
      });
      this.summaryData.recvTotalCount = sumData;
    },
    async getVprSummaryData(start, end) {
      // 总量与每小时处理量共用一个查询函数,默认type为0 查询总量, 1:查询每小时处理量
      let t = (end - start) / 1000;
      this.summaryData.vprTotalCount = "-";
      let sumData = await querySummary({
        query: `sum(increase(dispatcher_handle_total{job="vpr"}[${t}s]))`,
        time: end.toISOString()
      });
      this.summaryData.vprTotalCount = sumData;

      this.summaryData.vprTotalHours = "-";
      let timeData = await querySummary(
        {
          query: `sum(increase(dispatcher_handle_length_total{job="vpr"}[${t}s]))`,
          time: end.toISOString()
        },
        1
      );
      this.summaryData.vprTotalHours = timeData;
    },
    async getKwdSummaryData(start, end) {
      let t = (end - start) / 1000;
      this.summaryData.kwdTotalCount = "-";
      let sumData = await querySummary({
        query: `sum(increase(dispatcher_handle_total{job="kwd"}[${t}s]))`,
        time: end.toISOString()
      });
      this.summaryData.kwdTotalCount = sumData;

      this.summaryData.kwdTotalHours = "-";
      let timeData = await querySummary(
        {
          query: `sum(increase(dispatcher_handle_length_total{job="kwd"}[${t}s]))`,
          time: end.toISOString()
        },
        1
      );
      this.summaryData.kwdTotalHours = timeData;
    },
    async getPlatformDistrib(start, end) {
      let t = (end - start) / 1000;
      const instance = "plat";
      let distribData = await queryDistrib(
        {
          query: `sum(increase(dispatcher_handle_total{job="vpr"}[${t}s])) by (${instance})`,
          time: end.toISOString()
        },
        instance
      );

      this.platData = {
        title: "平台分布",
        data: distribData
      };
    },
    async getLanguageDistrib(start, end) {
      let t = (end - start) / 1000;
      const instance = "lang";
      let distribData = await queryDistrib(
        {
          query: `sum(increase(dispatcher_handle_total{job="vpr",valid="valid"}[${t}s])) by (${instance})`,
          time: end.toISOString()
        },
        instance
      );

      this.langData = {
        title: "语种分布",
        data: distribData
      };
    },
    async getGenderDistrib(start, end) {
      let t = (end - start) / 1000;
      const instance = "gender";
      let distribData = await queryDistrib(
        {
          query: `sum(increase(dispatcher_handle_total{job="vpr",valid="valid"}[${t}s])) by (${instance})`,
          time: end.toISOString()
        },
        instance
      );

      this.genderData = {
        title: "性别分布",
        data: distribData
      };
    },
    updateInstantQueryRange() {
      this.updateVprInstantQueryRange(this.vprInstantQueryPreset);
      this.updateKwdInstantQueryRange(this.kwdInstantQueryPreset);
    },
    async updateVprInstantQueryRange(preset) {
      const queryItem = QUERY_PRESET_RANGES.find(item => item.index === preset);
      const instantQueryLength = queryItem.value;
      this.vprInstantQueryPreset = preset;

      const resultData = await queryInstant(
        `sum(increase(dispatcher_handle_total{job="vpr"}[1h]))`,
        instantQueryLength
      );
      this.vprInstantData = resultData;
    },
    async updateKwdInstantQueryRange(preset) {
      const queryItem = QUERY_PRESET_RANGES.find(item => item.index === preset);
      const instantQueryLength = queryItem.value;
      this.kwdInstantQueryPreset = preset;

      const resultData = await queryInstant(
        `sum(increase(dispatcher_handle_total{job="kwd"}[1h]))`,
        instantQueryLength
      );
      this.kwdInstantData = resultData;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/common.scss";
$themeColor: #00aeff;
$callinColor: #ff8400;
$preTelephoneColor: #21c215;
$transferColor: #39adff;

.call-handler-stat {
  width: 100%;
  height: 100%;
  //max-height: 850px;
  overflow-y: auto;

  .data-item {
    width: 100%;
    background-color: #fff;
    &:first-of-type {
      height: 400px;
    }

    &:nth-child(n + 2) {
      margin-top: 10px;
    }

    .top {
      position: relative;
      width: 100%;
      //   height: 60px;
      background-color: #fff;
      border-radius: 3px;

      .tag {
        width: 400px;
        font-size: 16px;
        font-weight: 700;
        color: #000;
        padding-top: 30px;
        padding-left: 20px;
        border-radius: 0px 15px 0px 0px;
        span {
          color: #666;
          font-size: 13px;
        }
      }

      .time-filter {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        > ul {
          height: 100%;
          display: flex;
          align-items: center;

          > li {
            width: 50px;
            height: 30px;
            padding-top: 5px;
            border-radius: 3px;
            border: solid 1px $themeColor;
            color: $themeColor;
            text-align: center;

            &.active {
              background-color: $themeColor;
              color: #fff;
            }

            &:nth-child(2) {
              margin: 0 10px;
            }
          }
        }

        .time-label {
          color: #666;
          margin-left: 10px;
        }
      }

      .carousel {
        width: 170px;
        position: absolute;
        font-size: 12px;
        right: 20px;
        margin: 10px 0;
        color: red;
      }
    }

    .item-stat {
      width: 100%;
      height: 90px;
      margin-top: 31px;
      padding: 0 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      &.pie {
        height: 200px;
        > div {
          width: 33%;
          height: 100%;
        }
      }
      .panel {
        position: relative;
        width: calc((100% - 40px) / 3);
        height: 100%;
        display: flex;
        align-items: center;

        &.callin {
          background-color: #ffe4c7;
        }

        &.pre-telephone {
          background-color: #c8ffc4;
        }

        &.transfer {
          background-color: #dbf0ff;
        }
        .pad {
          width: 24px;
          height: 90px;
          background: #fff;
        }
        .img {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 3px;
          display: flex;
          justify-content: center;
          align-items: center;

          &.callin-imgbg {
            background-color: $callinColor;
          }

          &.pre-telephone-imgbg {
            background-color: $preTelephoneColor;
          }

          &.transfer-imgbg {
            background-color: $transferColor;
          }
        }

        .data {
          flex: 1;
          padding: 0 25px 0 50px;

          .title,
          .unit {
            color: #999;
            font-size: 12px;
          }

          .flex {
            display: flex;
            justify-content: space-between;
          }

          .big {
            font-size: 20px;
            color: #333;
          }
        }
      }
    }
  }
}
</style>