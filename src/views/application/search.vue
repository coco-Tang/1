<!--
 * @Author: coco-Tang
 * @Date: 2019-08-12 17:20:31
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-12-06 11:02:32
 * @Description: 
 -->
<template>
  <div class="condition">
    <div class="topbox">
      <div class="complex">
        <ul id="container" :class="{ 'fold': fold }">
          <li class="items item-1">
            <div class="group">
              <div class="title">时间选择</div>
              <!-- format="yyyy-MM-dd" -->
              <el-date-picker
                :clearable="false"
                :editable="false"
                :title="titleTimeRange"
                v-model="timePicker"
                type="datetimerange"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                @change="timeChange"
              ></el-date-picker>
              <div class="timeBtn">
                <el-button
                  type="primary"
                  @click="timeChange1(1)"
                  :class="shortcut===1?'':'excluded'"
                >日</el-button>
                <el-button
                  type="primary"
                  @click="timeChange1(7)"
                  :class="shortcut===7?'':'excluded'"
                >周</el-button>
                <el-button
                  type="primary"
                  @click="timeChange1(30)"
                  :class="shortcut===30?'':'excluded'"
                >月</el-button>
              </div>
            </div>
          </li>
          <li class="items item-2">
            <div class="group">
              <div class="title">来源平台</div>
              <el-select v-model="platform" placeholder="请选择">
                <el-option
                  v-for="item in getPlatform"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li class="items item-3">
            <div class="group">
              <div class="title">语种</div>
              <el-select :disabled="invalidFlag" v-model="language" filterable placeholder="请选择">
                <el-option
                  v-for="item in languageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <!-- <li class="items item-4">
            <div class="group">
              <div class="title">性别</div>
              <el-select :disabled="invalidFlag" v-model="gender" placeholder="请选择">
                <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>-->

          <li class="items item-6">
            <div class="group">
              <div style="display:flex;">
                <div class="title" style="width:70px">中标关键词</div>
                <!-- <el-tooltip
                  style="height: 30px;line-height: 30px;margin-top: 5px;"
                  :disabled="!keywordDisable"
                  class="item"
                  effect="dark"
                  content="请清空文件"
                  placement="top"
                >-->
                <!-- <el-input
                    :disabled="keywordDisable"
                    v-model="keywords"
                    placeholder="请输入或选择关键词,多个关键词用','隔开"
                >-->
                <el-input
                  :disabled="invalidFlag"
                  v-model="keywords"
                  placeholder="请选择关键词"
                  readonly
                  @focus="keywordParentMethod"
                >
                  <!-- <i
                      slot="suffix"
                      @click="keywordParentMethod"
                      class="el-input__icon el-icon-arrow-down"
                  ></i>-->
                </el-input>
                <!-- </el-tooltip> -->
              </div>
              <!-- <div style="display:flex;height: 30px;line-height: 30px">
                <div class="group1">
                  <div class="title">阈值</div>
                  <el-input-number
                    :disabled="invalidFlag"
                    :precision="0"
                    class="long"
                    v-model="keywordThreshold"
                    controls-position="right"
                    @change="handleChange"
                    :step="10"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </div>
                <el-checkbox :disabled="invalidFlag" v-model="hitKeyword" label="任意中标"></el-checkbox>
              </div>-->
            </div>
            <keyword-select @setKeyWords="getKeyWords" ref="c2"></keyword-select>
          </li>
          <li class="items item-7">
            <div class="group">
              <div style="display:flex;">
                <div class="title" style="width:70px">中标声纹</div>
                <el-input
                  :disabled="invalidFlag"
                  style="height: 40px;line-height: 40px;margin-top: 0px;"
                  v-model="speaker"
                  readonly
                  @focus="speakerParentMethod"
                  placeholder="请选择声纹"
                ></el-input>
              </div>
              <!-- <div style="display:flex;height: 30px;line-height: 30px">
                <div class="group1">
                  <div class="title">阈值</div>
                  <el-input-number
                    :disabled="invalidFlag"
                    :precision="0"
                    class="long"
                    v-model="speakerThreshold"
                    controls-position="right"
                    @change="handleChange"
                    :step="10"
                    :min="0"
                    :max="100"
                  ></el-input-number>
                </div>
                <el-checkbox :disabled="invalidFlag" v-model="hitSpeaker" label="任意中标"></el-checkbox>
              </div>-->
            </div>
            <speaker-select @setSpeaker="getSpeaker" ref="c3"></speaker-select>
          </li>
          <li class="items item-8">
            <div class="group">
              <div class="title">号码特征</div>
              <el-input :disabled="invalidFlag" v-model="telrule" @keyup.native="checkTel(telrule)"></el-input>
            </div>
          </li>
          <li class="items item-4">
            <div class="group">
              <div class="title">性别</div>
              <el-select :disabled="invalidFlag" v-model="gender" placeholder="请选择">
                <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li class="items item-5">
            <div class="group">
              <el-checkbox v-model="invalidVoice" @change="invalidVoiceHandle" label="无效音"></el-checkbox>
              <el-checkbox :disabled="invalidFlag" v-model="hasAsr" label="已转写"></el-checkbox>
            </div>
          </li>
          <li class="items item-9" :class="{ 'hidden': fold }">
            <div class="group">
              <div class="title">文本检索</div>
              <el-input :disabled="invalidFlag" v-model="searchContent"></el-input>
            </div>
          </li>
          <li class="items item-13" :class="{ 'hidden': fold }">
            <div class="group">
              <div class="title">识别正确性</div>
              <el-select
                :disabled="invalidFlag"
                v-model="veracityMark"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in veracityMarkOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li class="items item-10" :class="{ 'hidden': fold }">
            <div class="group">
              <div class="title">通话时长</div>
              <div class="inputNumber">
                <el-time-select
                  :disabled="invalidFlag"
                  :picker-options="{
                    start: '00:00',
                    step: '00:10',
                    end: '60:00'
                  }"
                  @focus="defaultBeginTime"
                  v-model="beginTime"
                  editable
                  placeholder="选择时间"
                ></el-time-select>
                <span style="width: 10px">~</span>
                <el-time-select
                  :disabled="invalidFlag"
                  :picker-options="{
                    start: '00:00',
                    step: '00:10',
                    end: '60:00',
                    minTime: beginTime
                  }"
                  @focus="defaultEndTime"
                  v-model="endTime"
                  editable
                  placeholder="选择时间"
                ></el-time-select>
              </div>
            </div>
          </li>
          <li class="items item-11" :class="{ 'hidden': fold }">
            <div class="group">
              <div class="title">话单级别</div>
              <el-select
                :disabled="invalidFlag"
                multiple
                collapse-tags
                v-model="billLevel"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in billLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li class="items item-12" :class="{ 'hidden': fold }">
            <div class="group">
              <div class="title">call ID</div>
              <el-input :disabled="invalidFlag" v-model="searchCallid"></el-input>
            </div>
          </li>

          <!-- <li class="items item-14" :class="{ 'hidden': fold }">
            <div class="group">
              <div class="title">阈值</div>
              <el-input-number
                :disabled="invalidFlag"
                :precision="0"
                class="long"
                v-model="threshold"
                controls-position="right"
                @change="handleChange"
                :step="10"
                :min="0"
                :max="100"
              ></el-input-number>
            </div>
          </li>-->

          <li class="items item-15" :class="{ 'fold': fold }">
            <el-button type="primary" @click="seniorSearch" class="query1 myBtn">
              {{ searchName }}
              <span class="triangle" :class="{ 'fold' :fold }"></span>
            </el-button>
            <el-button type="primary" class="myBtn search" @click="search()">
              检索
              <!-- <span class="arrow"></span> -->
            </el-button>
          </li>
        </ul>
      </div>
    </div>

    <!-- <task-list ref="tkLstCmp" :listData="parentListData" :listDataTotal="parentListDataTotal" :platformOptions='platformOptions'></task-list> -->
    <result-list ref="rsltLst" @pageChanged="handleCurrentChange" :taskid="newTaskId"></result-list>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
// import {
//   getKeywords,
//   getTask,
//   getPlatform,
//   getTimeslice,
//   historySearch,
//   hitSearch,
//   deleteTask,
//   cancelTask
// } from "@/api/index.js";
import { createTasks } from "@/api/search.js";
// import keywordSelect from "@/components/keywordSelect1.vue";
import keywordSelect from "@/components/keywordSelect2.vue";
import speakerSelect from "@/components/speakerSelect.vue";
import speechsegSelect from "@/components/speechsegSelect.vue";
import numberSelect from "@/components/numberSelect.vue";
// import taskList from "./taskList";
import resultList from "./resultList";
import { mapActions, mapGetters } from "vuex";
import cityCode from "../../static/city.json";
import axios from "axios";
import { SEARCH_LANGUAGE_TYPE, GENDER_TYPE } from "@/constant";

// import SockJS from "./sockjs.js";
// import stomp from "./stomp.js";

export default {
  name: "condition",
  data() {
    return {
      searchName: "高级",
      newTaskId: null,
      fold: true,
      newTskStat: 1,
      timer: null,
      account: "",
      searchTab: true, //false:历史 true:中标
      lbtn: "",
      rbtn: "primary",
      telrule: "",
      platform: "",
      timeslice: "",
      timesliceOptions: [],
      dataSource: "",
      dataSourceOptions: "",
      parentMsg: true,
      taskData: [],
      parentListData: [],
      parentListDataTotal: 0,

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              console.log("picker");
              console.log(picker);
              // this._picker = picker;
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              console.log("picker");
              console.log(picker);
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              console.log("picker");
              console.log(picker);
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              console.log("picker");
              console.log(picker);
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      timePicker: [],
      gender: "",
      genderOptions: GENDER_TYPE,
      billLevel: [],
      billLevelOptions: [
        {
          value: 9,
          label: "一般"
        },
        {
          value: 6,
          label: "严重"
        },
        {
          value: 7,
          label: "紧急"
        },
        {
          value: 8,
          label: "排除"
        }
      ],
      veracityMark: "",
      veracityMarkOption: [
        {
          value: 2,
          label: "正确"
        },
        {
          value: 3,
          label: "错误"
        },
        {
          value: 4,
          label: "不确定"
        }
      ],
      language: "",
      languageOptions: SEARCH_LANGUAGE_TYPE,
      threshold: 60,
      capped: 200,
      beginTime: "",
      endTime: "",
      keywords: "",
      keywordsAnd: [],
      keywordsNon: [],
      keywordsOr: [],
      speaker: "",
      speakerId: [],
      speechseg: "",
      speechsegId: [],
      numberFilter: "",
      numberFilterId: [],
      callerCity: "",
      calleeCity: "",
      callerCityOption: [],
      calleeCityOption: [],
      file: {},
      uploadFileName: "",
      keywordDisable: false,
      fileDisable: false,

      // totalPage: 0,
      //   currentPage: 1,
      //   pageSize: 15,

      platform: "",
      shortcut: -1,
      invalidVoice: false,
      hasAsr: false,
      hitKeyword: false,
      hitSpeaker: false,
      searchCallid: "",
      searchContent: "",
      invalidFlag: false,
      keywordThreshold: 60,
      speakerThreshold: 60
    };
  },
  components: {
    "ag-grid-vue": AgGridVue,
    // 'add-button':addButton,
    "keyword-select": keywordSelect,
    "speaker-select": speakerSelect,
    "speechseg-select": speechsegSelect,
    "number-select": numberSelect,
    // "task-list": taskList,
    "result-list": resultList
  },
  computed: {
    ...mapGetters(["getPlatform"]),
    titleTimeRange() {
      let yesterdayNow = new Date(
        new Date().getTime() - 3600 * 1000 * 24 * 7
      ).format("yyyy-MM-dd hh:mm:ss");
      let now = new Date().format("yyyy-MM-dd hh:mm:ss");
      if (!this.timePicker) {
        return;
      }
      return this.timePicker[0]
        ? new Date(this.timePicker[0]).format("yyyy-MM-dd hh:mm:ss") +
            " ~ " +
            new Date(this.timePicker[1]).format("yyyy-MM-dd hh:mm:ss")
        : yesterdayNow + " ~ " + now;
    }
  },
  watch: {
    telrule(newVal, oldVal) {
      // this.telrule = newVal.replace(/[^\w\.\/]/ig,'') // 只能输入英文字母和数字,不能输入中文
      this.telrule = newVal.replace(/[^\d]/g, ""); // 仅数字
    },
    // newTskStat (newVal, oldVal) {
    //   if (!newVal) {
    //     this.timer = setInterval(this.dataInit, 3000);
    //   } else {
    //     clearInterval(this.timer);
    //     //   if (this.rowData[0].resultnum) {
    //     //     this.TASK_ID(this.rowData[0].taskid);
    //     //     this.$router.replace({path: '/search/resultList'});
    //     //   }
    //     this.newTaskId = this.parentListData[0].taskid;
    //   }
    // },
    keywords(newVal, oldVal) {
      if (newVal != "") {
        this.fileDisable = true;
      } else {
        this.fileDisable = false;
      }
    },
    file(newVal, oldVal) {
      // console.log(newVal)
      if (newVal) {
        this.keywordDisable = true;
      } else {
        this.keywordDisable = false;
      }
    }
  },
  methods: {
    ...mapActions(["RESULT_DATA"]),
    ...mapGetters(["getAccount"]),
    invalidVoiceHandle() {
      this.invalidFlag = this.invalidVoice;
    },
    seniorSearch() {
      this.fold = !this.fold;
      this.searchName = this.fold ? "高级" : "精简";
    },
    openTaskList() {
      if (this.$refs.tkLstCmp) {
        this.$refs.tkLstCmp.showMySelf();
      }
    },
    checkTel(v) {
      // alert(v)
      this.telrule = v.replace(/[^\w*]/gi, "");
    },
    searchTabHandle(str) {
      this.lbtn = "";
      this.rbtn = "";
      this[str] = "primary";
      this.rbtn == "" ? (this.searchTab = false) : (this.searchTab = true);
      if (this.searchTab) {
        // console.log(true)
        this.keywordDisable = false;
        this.fileDisable = false;
        this.file = null;
        this.uploadFileName = "";
      } else {
        // console.log(false)
        if (this.keywords) {
          this.fileDisable = true;
        }
      }
    },
    handleChange(value) {
      // console.log(value);
    },
    keywordDrop() {
      // console.log(1)
    },
    getKeyWords(str, hitKeyword, threshold) {
      // this.keywords = str;
      // this.keywords = str.join(",");
      this.keywords = str;
      this.keywordThreshold = threshold;
      this.hitKeyword = hitKeyword;
      // this.keywordsAnd = arrs[0]
      // this.keywordsOr = arrs[1]
      // this.keywordsNon = arrs[2]
    },
    getSpeaker(obj) {
      this.speaker = obj.name;
      this.speakerId = obj.id;
      this.speakerThreshold = obj.threshold;
      this.hitSpeaker = obj.hitSpeaker;
      // console.log('getSpeaker')
      // console.log(this.speaker)
      // console.log(this.speakerId)
    },
    getSpeechseg(obj) {
      this.speechseg = obj.name;
      this.speechsegId = obj.id;
    },
    getNumber(obj) {
      this.numberFilter = obj.phone;
      // console.log('obj')
      // console.log(obj)
      // this.numberFilterId = obj.id
    },
    tirggerFile(e) {
      // console.log(e)
      // console.log(e.target.files)
      if (e.target.files.length === 0) {
        this.file = null;
        this.uploadFileName = "";
        return;
      }
      this.file = e.target.files[0];
      // this.file = event.target.files[0]
      this.uploadFileName = this.file.name;

      // console.log(this.file)
    },
    handleCurrentChange(page, size) {
      console.log("handleCurrentChange");

      // console.log(obj)
      // console.log(obj.page)
      // console.log(obj.size)
      this.search((page - 1) * size, size);
    },
    getMySeconds(t) {
      // if(t){
      //   return t.getHours()*60*60 + t.getMinutes()*60 + t.getSeconds()
      // }
      if (t) {
        let arr = t.split(":");
        return Number(arr[0]) * 60 + Number(arr[1]);
      }
      return "";
    },
    search(page = 0, size = 15) {
      console.log("search");
      console.log("this.timePicker");
      console.log(this.timePicker);
      console.log(this.timePicker.length);
      // console.log(page)
      // console.log(size)
      this.$refs.rsltLst.loading2 = true;
      let noRowsModal = document.querySelector(
          ".resultList .ag-overlay-wrapper.ag-overlay-no-rows-wrapper"
        ),
        table = document.querySelector(".resultList .table");
      if (noRowsModal) {
        noRowsModal.style.cssText = "display: none;";
        table.classList.add("post");
      }

      if (this.timePicker.length == 0) {
        this.dateInit();
      }

      const params = this.Utils.formatParams({
        startTime: this.timeFormat(this.timePicker[0]),
        endTime: this.timeFormat(this.timePicker[1]),
        language: this.language,
        platforms: this.platform,
        // threshold: this.threshold,
        keywordThreshold: this.keywordThreshold,
        speakerThreshold: this.speakerThreshold,
        minVoiceLength: this.getMySeconds(this.beginTime) || "",
        maxVoiceLength: this.getMySeconds(this.endTime) || "",
        gender: this.gender,
        // keywords: this.keywords.split(","),
        speakerIds: this.speakerId,
        callLevels: this.billLevel,
        veracityMark: this.veracityMark || "",
        numberRules: this.telrule,
        // numberLocation: this.callerCity,
        limit: size,
        start: page,
        // callercity: this.callerCity,
        // calleecity: this.calleeCity,
        invalidVoice: this.invalidVoice,
        hasAsr: this.hasAsr,
        hitKeyword: this.hitKeyword,
        hitSpeaker: this.hitSpeaker,
        callId: this.searchCallid,
        content: this.searchContent,
        // keywordsAnd: this.keywordsAnd,
        // keywordsNon: this.keywordsNon,
        // keywords: this.keywordsOr,
        keywords: this.keywords
        // hitNum: this.capped,
      });

      createTasks(params).then(res => {
        console.log("createTasks");
        console.log(res);
        this.$refs.rsltLst.loading2 = false;
        this.RESULT_DATA(res.data);
        if (res.data.total === 0) {
          this.$message("无返回结果");
        }
      });
      // params.append("operator", this.account);
      // params.append("hitNum", this.capped);
      // params.append("callercity", this.callerCity);
      // params.append("calleecity", this.calleeCity);
      // params.append("min", this.beginTime || "");
      // params.append("max", this.endTime || "");

      // if (this.searchTab) { // searchTab --> false:历史 true:中标
      //   params.append("searchtype", 4);
      //   params.append("speechids", this.speechsegId);
      //   // params.append("phones", this.numberFilter);

      //   hitSearch(params).then(res => {
      //     // this.$refs.rsltLst.loading2 = false;
      //   //   console.log('hitSearch--res:', res)
      //     if (!res.data.success) {
      //       utils.messageBox(res, this);

      //       this.$refs.rsltLst.loading2 = false;
      //       table.classList.remove('post');
      //       noRowsModal.style.display = 'table-cell';

      //       return;
      //     }
      //     this.dataInit()
      //   });
      // } else {
      //   params.append("searchtype", 1);
      //   params.append("SpeakerVoice", this.file);

      //   historySearch(params).then(res => {
      //     // this.$refs.rsltLst.loading2 = false;
      //   //   console.log('historySearch--res:', res)
      //     if (!res.data.success) {
      //       utils.messageBox(res, this);

      //       this.$refs.rsltLst.loading2 = false;
      //       table.classList.remove('post');
      //       noRowsModal.style.display = 'table-cell';

      //       return;
      //     }
      //     this.dataInit();
      //   });
      // }

      // var obj = {
      //   LangType: this.language,
      //   operator: this.account,
      //   hitNum: this.capped,
      //   threshold: this.threshold,
      //   sex: this.gender,
      //   telrule: this.telrule,
      //   startTime: this.timePicker[0],
      //   endTime: this.timePicker[1],
      //   keywords: this.keywords,
      //   objectids: this.speakerId,
      //   callercity: this.callerCity,
      //   calleecity: this.calleeCity,
      //   platform: this.platform,
      //   status: this.billLevel,
      //   min: this.beginTime || "",
      //   max: this.endTime || "",
      //   speechids: this.speechsegId,
      //   speechName: this.speechseg,
      //   phones: this.numberFilter,
      //   speaker: this.speaker
      // };
      // obj = JSON.stringify(obj);

      // localStorage.setItem("condition", obj);
    },
    defaultBeginTime() {
      this.beginTime = "00:10";
    },
    defaultEndTime() {
      this.endTime = "03:00";
    },
    timeChange(t) {
      console.log("timeChange");
      console.log(t);
      console.log(this.timePicker);
      this.shortcut = -1;
      if (!t) {
        this.timePicker = [];
      }
      console.log(this.timePicker);

      // this.timePicker[0] = new Date(this.timePicker[0]).format("yyyy-MM-dd hh:mm:ss");
      // this.timePicker[1] = new Date(this.timePicker[1]).format("yyyy-MM-dd hh:mm:ss");

      // console.log(this.timePicker[0])
      // console.log(this.timePicker[1])
    },
    timeChange1(idx) {
      const end = new Date();
      switch (idx) {
        case 1:
          this.shortcut = 1;
          this.$set(
            this.timePicker,
            0,
            new Date(end.getTime() - 3600 * 1000 * 24 * 1)
          );
          this.$set(this.timePicker, 1, new Date(end));
          break;
        case 7:
          this.shortcut = 7;
          this.$set(
            this.timePicker,
            0,
            new Date(end.getTime() - 3600 * 1000 * 24 * 7)
          );
          this.$set(this.timePicker, 1, new Date(end));
          break;
        case 30:
          this.shortcut = 30;
          this.$set(
            this.timePicker,
            0,
            new Date(end.getTime() - 3600 * 1000 * 24 * 30)
          );
          this.$set(this.timePicker, 1, new Date(end));
          break;
      }
      // this.timePicker = []
    },
    dateInit() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7); // 从2周改为1周
      // this.timePicker[0] = new Date(start).format("yyyy-MM-dd hh:mm:ss")
      // this.timePicker[1] = new Date(end).format("yyyy-MM-dd hh:mm:ss")

      this.$set(
        this.timePicker,
        0,
        new Date(start).format("yyyy-MM-dd hh:mm:ss")
      );
      this.$set(
        this.timePicker,
        1,
        new Date(end).format("yyyy-MM-dd") + " 23:59:59"
      );

      //Unix时间戳
      // this.$set(this.timePicker, 0, Math.round(start.getTime()/1000));
      // this.$set(this.timePicker, 1, Math.round(end.getTime()/1000));
    },
    cityCodeInit() {
      for (let k in cityCode) {
        this.callerCityOption.push({
          label: cityCode[k],
          value: k
        });
      }
      this.calleeCityOption = this.callerCityOption;

      // console.log('this.calleeCityOption')
      // console.log(this.calleeCityOption)
    },
    aaa() {
      console.log("aaa");
    },
    keywordParentMethod() {
      console.log("keywordParentMethod");
      // if (this.keywordDisable) {
      //   return;
      // }
      this.$refs.c2.showDialog(this.keywords);
    },
    speakerParentMethod() {
      this.$refs.c3.showDialog();
    },
    speechsegParentMethod() {
      this.$refs.c4.showDialog();
    },
    numberParentMethod() {
      this.$refs.c5.showDialog();
    },
    // setlocalData(data) {
    //   // console.log( )
    //   // console.log( ​) //括号里特殊字符
    //   // console.log('setlocalData');
    //   //
    //   data = JSON.parse(data);
    //   this.language = data.LangType;
    //   this.account = data.operator;
    //   this.capped = data.hitNum;
    //   this.threshold = data.threshold;
    //   this.gender = data.sex;
    //   this.telrule = data.telrule;
    //   this.timePicker[0] = data.startTime;
    //   this.timePicker[1] = data.endTime;
    //   this.keywords = data.keywords;
    //   this.speakerId = data.objectids;
    //   this.callerCity = data.callercity;
    //   this.calleeCity = data.calleecity;
    //   this.platform = data.platform;
    //   this.billLevel = data.status;
    //   this.beginTime = Number(data.min);
    //   this.endTime = Number(data.max);
    //   this.speechsegId = data.speechids;
    //   this.speechseg = data.speechName;
    //   this.numberFilter = data.phones;
    //   this.speaker = data.speaker;
    //   console.log(data);
    // },
    timeFormat(data) {
      let d = new Date(data);
      console.log(Math.round(d.getTime() / 1000));
      return Math.round(d.getTime() / 1000);
    }
  },
  beforeCreate() {},
  created() {
    this.cityCodeInit();
    this.Utils.dateFormat();
    this.account = this.getAccount();

    // if(this.cacheSize) {
    //   this.pageSize = this.cacheSize
    // }

    if (!localStorage.getItem("condition")) {
      localStorage.setItem("condition", "");
    } else {
      let localData = localStorage.getItem("condition");
      // this.setlocalData(localData);
    }
  },
  beforeMount() {},
  mounted() {
    this.dateInit();

    // this.dataInit();

    // document.querySelector('.el-input__inner[aria-label="最小值"]').setAttribute('placeholder', '请输入');
    // document.querySelector('.el-input__inner[aria-label="最大值"]').setAttribute('placeholder', '请输入');
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.condition {
  .triangle {
    position: absolute;
    margin-left: 3px;
    width: 20px;
    height: 16px;
    &.fold {
      background: url("../../static/images/矩形2275.png") no-repeat 4px 2px;
    }
    background: url("../../static/images/矩形2275-1.png") no-repeat 4px 2px;
    // background-size: 20px 16px;
  }
  .arrow {
    position: absolute;
    margin-left: 3px;
    width: 20px;
    height: 16px;
    background: url("../../static/images/箭头(5).png") no-repeat 4px 2px;
  }
  .duration {
    position: absolute;
    top: 0;
    bottom: 18px;
    // right: 2%;
    right: 0;
    font-size: 12px;
    color: #a6a6a6;
  }
}
.keywordSpan {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.speakerSpan {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.hidden {
  display: none !important;
}
.file_item {
  .file_input {
    flex-grow: 1;
    display: flex;
    div.el-input {
      width: calc(100% - 95px);
    }
    label {
      font-size: 12px;
    }
    .fileBtn {
      //   width: 100px;
      width: 45px;
      height: 28px;
      line-height: 28px;
      background-color: #409eff;
      color: #fff;
      display: block;
      border-radius: 4px;
      text-align: center;
      margin-top: 10px;
      margin-left: 15px;
    }
  }
}

.condition {
  height: 100%;
  // height: calc(100% - 20px);
  width: 100%;
  display: flex;
  flex-direction: column;
  .complex {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      li {
        &:nth-child(1),
        &:nth-child(2) {
          .content {
            .select {
              margin-right: 10px;
            }
          }
        }
        &.add {
          width: 90px;
          padding: 30px;
          font-size: 30px;
          color: #bfbfda;
        }
        &.btn {
          // width: 90px;
          width: 150px;
          margin-left: auto;
          display: flex;
          flex-direction: row;
        }
      }
    }
  }
}
.topbox {
  max-height: 40%;
  // display: none;
  // height: 500px;
  .topbox_head {
    line-height: 30px;
    .title {
      font-weight: 700;
    }
    .left {
      //   width: 200px;
      cursor: pointer;
      .subColor {
        color: #a8b3c7;
        &:hover {
          color: #000;
        }
      }
      display: flex;
      align-items: center;
      .lbtn {
        width: 100px;
        border-radius: 20px 0 0 20px;
      }
      .seperator {
        width: 2px;
        height: 8px;
        margin: 0 10px;
        background: #409eff;
      }
      .rbtn {
        width: 100px;
        border-radius: 0 20px 20px 0;
      }
      .el-button:focus,
      .el-button:hover {
        z-index: 0;
      }
    }
    .right {
      // width: 200px;
      // .lbtn{
      //   width: 100px;
      //   border-radius: 20px 0 0 20px;
      // }
      // .rbtn{
      //   width: 100px;
      //   border-radius: 0  20px 20px 0;
      // }
      // .el-button:focus, .el-button:hover {
      //     z-index: 0
      // }
    }
  }
}
.taskList {
  // height: 100%;
  // width: 100%;
  // margin-top: 20px;
  // border-radius: 5px;
  // background-color: #fff;
  // // padding: 20px;
  // // padding: 10px;
  // overflow: hidden;
  .table {
    padding-top: 10px;
    .table_head {
      margin-bottom: 10px;
      .right {
        .el-button {
          padding: 8px 15px;
        }
      }
    }
  }

  .head {
    // margin-bottom: 10px;
    margin-left: 10px;
    font-weight: 700;
    // background-color: #ccc;
  }
}
</style>
<style lang="scss">
.item2 {
  width: 15.4%;
}
.item4 {
  width: 38%;
}
.myBtn.el-button {
  color: #fff;
  text-indent: -18px;
  font-size: 12px;
  width: 60px;
  &.search {
    text-indent: 0px;
    // text-align: center;
  }
}
.query.el-button {
  color: #fff;
  text-indent: -18px;
  font-size: 14px;
  width: 90px;
}
.el-input__icon {
  line-height: 0;
}
// .el-input-number.long {
//   width: 100% !important;
// }
.condition {
  .el-checkbox__label {
    font-size: 12px;
  }
  #container {
    // .el-select {
    //   height: 30px !important;
    //   .el-input__inner {
    //     height: 30px !important;
    //   }
    // }
    &.fold {
      // grid-template-rows: 40px 40px 40px;
    }
    .title {
      font-size: 12px;
      text-align: left;
    }
    display: grid;
    // grid-gap: 10px;
    // grid-template-columns: repeat(12, 8.33%);
    // grid-template-rows: 40px 40px 40px 40px;
    grid-template-columns: repeat(auto-fill, 50px);
    .items {
      line-height: 40px;
      padding: 0 5px;
      .group {
        display: flex;
      }
    }
    .item-1 {
      // grid-column-start: 1;
      // grid-column-end: 5;
      grid-column: span 10;
      .group {
        .el-date-editor .el-range-input {
          font-size: 12px;
        }
        .el-range-separator {
          line-height: 22px;
          padding: 0 2px;
        }
        .title {
          width: 70px;
        }
        .el-input__inner {
          // width: 60%;
        }
        .timeBtn {
          width: 90px;
          // width: 200px;
          display: flex;
          height: 30px;
          // line-height: 50px;
          margin-top: 5px;
          // margin-left: 10px;
          .el-button {
            height: 100%;
            padding: 4px 8px;
            margin-left: 0;
            // margin-left: 4px;
            // font-size: 12px;
          }
          .excluded {
            background-color: #818181;
            background-image: none;
            border: none;
            box-shadow: 0 9px 8px -7px rgba(179, 179, 179, 0.6);
          }
        }
      }
    }
    .item-2 {
      // grid-column-start: 5;
      // grid-column-end: 7;
      grid-column: span 4;
      .group {
        .title {
          width: 60px;
        }
        .el-select {
          width: calc(100% - 60px);
        }
      }
    }
    .item-3 {
      .title {
        width: 50px;
      }
      // grid-column-start: 7;
      // grid-column-end: 9;
      grid-column: span 4;
    }
    .item-4 {
      .title {
        width: 50px;
      }
      // grid-column-start: 9;
      // grid-column-end: 11;
      grid-column: span 4;
    }
    .item-5 {
      // grid-column-start: 11;
      // grid-column-end: 13;
      grid-column: span 3;
      grid-row-start: 1;
      grid-column-end: -1;
      .el-checkbox {
        margin-right: 15px;
      }
    }
    .item-6 {
      grid-column-start: 1;
      grid-column-end: 11;
      grid-row-start: 2;
      grid-row-end: 3;
      .group {
        display: flex;
        flex-direction: column;
        // border: 1px solid #ececec;
        // box-shadow: 1px 1px 1px #bfbfbf;
        // padding: 0 5px;
        border-radius: 4px;
        .el-input {
          width: calc(100% - 70px);
        }
      }
      .group1 {
        display: flex;
        margin-right: 5px;
        .el-input {
          width: 90px;
        }
        .el-input-number {
          width: 90px;
          line-height: 30px;
          .el-input-number__decrease {
            bottom: 0px !important;
          }
          .el-input-number__increase {
            top: 2px !important;
          }
        }
        .title {
          // margin-right: 46px;
          flex-shrink: 0;
          width: 70px;
        }
      }
    }
    .item-7 {
      grid-column-start: 1;
      grid-column-end: 11;
      grid-row-start: 3;
      grid-row-end: 4;
      .group {
        display: flex;
        flex-direction: column;
        // border: 1px solid #ececec;
        // box-shadow: 1px 1px 1px #bfbfbf;
        // padding: 0 5px;
        border-radius: 4px;
        .el-input {
          width: calc(100% - 60px);
        }
      }
      .group1 {
        display: flex;
        margin-right: 5px;
        .el-input {
          width: 90px;
        }
        .el-input-number {
          width: 90px;
          line-height: 30px;
          .el-input-number__decrease {
            bottom: 0px !important;
          }
          .el-input-number__increase {
            top: 2px !important;
          }
        }
        .title {
          // margin-right: 36px;
          flex-shrink: 0;
          width: 70px;
        }
      }
    }
    .item-8 {
      .group {
        display: flex;
      }
      .title {
        flex-shrink: 0;
        width: 60px;
      }
      // grid-column-start: 7;
      // grid-column-end: 10;
      // grid-row-start: 2;
      // grid-row-end: 3;
      grid-column: span 4;
      .el-input {
        width: calc(100% - 60px);
      }
    }
    .item-9 {
      .title {
        width: 60px;
      }
      // grid-column-start: 10;
      // grid-column-end: 13;
      // grid-row-start: 2;
      // grid-row-end: 3;
      grid-column: span 4;
      .el-input {
        width: calc(100% - 60px);
      }
    }
    .item-10 {
      // input::-webkit-input-placeholder { /* WebKit browsers */
      //   color: red !important;
      //   font-size: 12px !important;
      // }
      .group {
        display: flex;
      }

      .title {
        flex-shrink: 0;
        width: 60px;
      }
      // grid-column-start: 1;
      // grid-column-end: 4;
      // grid-row-start: 4;
      // grid-row-end: 5;
      grid-column: span 7;
      .inputNumber {
        width: 100%;
        height: 40px;
        .el-date-editor--time-select {
          // width: 45%;
          width: calc(50% - 6px);
        }
      }
    }
    .item-11 {
      .group {
        display: flex;
      }
      .title {
        flex-shrink: 0;
        width: 70px;
      }
      // grid-column-start: 4;
      // grid-column-end: 7;
      // grid-row-start: 4;
      // grid-row-end: 5;
      grid-column: span 5;
    }
    .item-12 {
      .group {
        display: flex;
      }
      .title {
        width: 70px;
        flex-shrink: 0;
      }
      .el-select {
        width: calc(100% - 60px);
        .el-tag {
          margin: 0 0 0 5px;
        }
      }
      .el-tag--mini {
        padding: 0;
      }
      // grid-column-start: 7;
      // grid-column-end: 9;
      // grid-row-start: 3;
      // grid-row-end: 4;
      grid-column: span 5;
      // .el-input{
      //   width: calc(100% - 60px);
      // }
    }
    .item-13 {
      .title {
        width: 70px;
      }
      .el-select {
        width: calc(100% - 70px);
      }

      // grid-column-start: 9;
      // grid-column-end: 11;
      // grid-row-start: 3;
      // grid-row-end: 4;
      grid-column: span 3;
      grid-row-start: 2;
      grid-column-end: -1;
      // .el-input{
      //   width: calc(100% - 60px);
      // }
    }
    .item-14 {
      .title {
        width: 70px;
      }
      .el-input-number {
        line-height: 40px;
        width: calc(100% - 40px);
      }
      // grid-column-start: 11;
      // grid-column-end: 13;
      // grid-row-start: 3;
      // grid-row-end: 4;
      grid-column: span 4;
      // .el-input{
      //   width: calc(100% - 60px);
      // }
    }
    .item-15 {
      // grid-column-start: 11;
      // grid-column-end: 13;
      // grid-row-start: 4;
      // grid-row-end: 5;
      grid-column: span 5;
      grid-column-end: -1;
      display: flex;
      justify-content: flex-end;
      padding-top: 5px;
      &.fold {
        // grid-row-start: 3;
        // grid-row-end: 4;
      }
      // .el-input{
      //   width: calc(100% - 60px);
      // }
    }
  }
}
</style>