<!--
 * @Author: coco-Tang
 * @Date: 2019-08-12 17:20:31
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-28 20:53:24
 * @Description: 
 -->
<template>
  <div class="monitor">
    <div class="topbox">
      <div class="complex">
        <ul id="container" :class="{ 'fold': fold }">
          <li class="items item-1">
            <div class="group">
              <div style="display:flex;">
                <div class="title" style="width:60px">关键词</div>
                <el-input
                  :disabled="autoFlag"
                  v-model="keywords"
                  placeholder="请选择关键词"
                  readonly
                  @focus="keywordParentMethod"
                >
                </el-input>
              </div>
            </div>
            <keyword-select @setKeyWords="getKeyWords" ref="c2"></keyword-select>
          </li>
          <li class="items item-2">
            <div class="group">
              <div style="display:flex;">
                <div class="title" style="width:60px">声纹</div>
                <el-input
                  :disabled="autoFlag"
                  style="height: 40px;line-height: 40px;margin-top: 0px;"
                  v-model="speaker"
                  readonly
                  @focus="speakerParentMethod"
                  placeholder="请选择声纹"
                ></el-input>
              </div>
            </div>
            <speaker-select @setSpeaker="getSpeaker" ref="c3"></speaker-select>
          </li>
          <li class="items item-3">
            <div class="group">
              <div class="title">来源平台</div>
              <el-select :disabled="autoFlag" v-model="platform" placeholder="请选择">
                <el-option
                  v-for="item in platformOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li class="items item-4">
            <div class="group">
              <div class="title">语种</div>
              <el-select :disabled="autoFlag" v-model="language" filterable placeholder="请选择">
                <el-option
                  v-for="item in languageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li class="items item-5">
            <div class="group">
              <div class="title">性别</div>
              <el-select :disabled="autoFlag" v-model="gender" placeholder="请选择">
                <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li class="items item-6">
            <div class="group">
              <div class="title">刷新时间</div>
              <el-input-number
                :disabled="autoFlag"
                :precision="0"
                class="long"
                v-model="refreshTime"
                controls-position="right"
                :step="1"
                :min="1"
                :max="100"
              ></el-input-number>
            </div>
          </li>
          <!-- <li class="items item-7">
            <div class="group">
              <div class="title">号码特征</div>
              <el-input :disabled="autoFlag" v-model="telrule" @keyup.native="checkTel(telrule)"></el-input>
            </div>
          </li> -->
          <li class="items item-8">
            <!-- <el-button type="primary" @click="seniorSearch" class="query1 myBtn">
              {{ searchName }}
              <span class="triangle" :class="{ 'fold' :fold }"></span>
            </el-button>-->
            <!-- <el-button type="primary" class="myBtn search" @click="search()"> -->
            <el-button type="primary" class="myBtn search" :disabled="disableSearch" @click="condition()">
              {{switchBtn}}
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
import {
  createMonitors,
  getMonitors,
  getMonitorResults
} from "@/api/monitor.js";
import keywordSelect from "@/components/keywordSelect2.vue";
// import keywordSelect from "./keywordSelect.vue";
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
  name: "monitor",
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
      platformOptions: [],
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
      switchBtn: "确定",
      keywords: "",
      keywordsOr: [],
      keywordsAnd: [],
      keywordsNon: [],
      isRefresh: true,
      autoFlag: true,
      refreshTime: 5,
      count: 1,
      keywordThreshold: 60,
      speakerThreshold: 60,
      disableSearch: true
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
    // keywords(newVal, oldVal) {
    //   if (newVal != "") {
    //     this.fileDisable = true;
    //   } else {
    //     this.fileDisable = false;
    //   }
    // },
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
    ...mapActions(["MONITOR_DATA","MONITOR_CONDITION"]),
    ...mapGetters(["getAccount", "getPlatform","getMonitorCondition"]),
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
    getKeyWords(str,hitKeyword,threshold) {
      this.keywords = str;
      this.keywordThreshold = threshold
      this.hitKeyword = hitKeyword
      // this.keywords = str.join(",");
      // console.log('this.keywords')
      // console.log(this.keywords)
      // this.keywordsAnd = arrs[0]
      // this.keywordsOr = arrs[1]
      // this.keywordsNon = arrs[2]

      console.log("getKeyWords");
      console.log(str);
      // console.log(arrs)
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
    condition() {
      console.log("autoRefresh");
      console.log(this.switchBtn);
      if (this.switchBtn == "修改") {
        this.switchBtn = "确定";
        // this.bbb()
        window.isRefresh = false;
        this.autoFlag = false;
        clearInterval(window.timer);
      } else {
        this.switchBtn = "修改";
        this.autoRefresh();
        this.autoFlag = true;
        // this.setCondition(true)
      }
    },
    hitKeywordChanged(v) {
      if (v) {
        this.keywordsAnd = [];
        this.keywordsNon = [];
        this.keywordsOr = [];
        this.keywords = "";
      }
    },
    hitSpeakerChanged(v) {
      if (v) {
        this.speakerId = [];
        this.speaker = "";
      }
    },
    autoRefresh() {
      let params = new URLSearchParams();
      params.append("language", this.language);
      params.append("platforms", this.platform);
      params.append("gender", this.gender);
      params.append("numberRules", this.telrule);
      // params.append('keywordsAnd',this.keywordsAnd)
      // params.append('keywordsNon',this.keywordsNon)
      // params.append('keywords',this.keywordsOr)
      params.append("keywords", this.keywords);
      params.append("speakerIds", this.speakerId);
      // params.append("threshold", this.threshold);
      params.append("keywordThreshold", this.keywordThreshold);
      params.append("speakerThreshold", this.speakerThreshold);
      // if (
      //   // this.keywordsAnd.length == 0 &&
      //   // this.keywordsNon.length == 0 &&
      //   // this.keywordsOr.length == 0
      //   this.keywords == ""
      // ) {
      //   // this.hitKeyword = true
      // } else {
      //   this.hitKeyword = false;
      // }
      // if (this.speakerId.length == 0) {
      //   // this.hitSpeaker = true
      // } else {
      //   this.hitSpeaker = false;
      // }

      params.append("hitKeyword", this.hitKeyword);
      params.append("hitSpeaker", this.hitSpeaker);

      // if(this.keywordsNon.length == 0 && this.keywordsOr.length == 0 && this.keywordsAnd.length == 0){
      //   params.append('keywords',this.keywords)
      // }else{
      //   params.append('keywords',this.keywordsOr)
      // }

      // createMonitors(params).then(res => {
      //   console.log('createMonitors')
      //   console.log(res)
      //   return getMonitorResults()
      // }).then(res => {
      //   console.log('getMonitorResults')
      //   console.log(res)
      // })

      createMonitors(params).then(res => {
        console.log("createMonitors");
        console.log(res);
        window.isRefresh = true;
        this.isRefresh = window.isRefresh;

        window.timer = setInterval(() => {
          getMonitorResults().then(res => {
            this.MONITOR_DATA(res.data);
            this.disableSearch = false
          });
        }, this.refreshTime * 1000);
      }).then(()=>{
        this.setCondition(true)
      });
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
    keywordParentMethod() {
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
    },
    setCondition(flag=false) {
      console.log("setCondition");
      getMonitors()
        .then(res => {
          console.log(res);
          let data = res.data;

          if (data.language) {
            this.language = data.language;
          } else {
            this.language = "";
          }
          if (data.gender) {
            this.gender = data.gender;
          } else {
            this.gender = "";
          }
          if (data.gender) {
            this.gender = data.gender;
          } else {
            this.gender = "";
          }
          if (data.keywordsAnd) {
            this.keywordsAnd = data.keywordsAnd;
          } else {
            this.keywordsAnd = [];
          }
          if (data.keywords) {
            this.keywordsOr = data.keywords;
          } else {
            this.keywordsOr = [];
          }
          if (data.keywordsNon) {
            this.keywordsNon = data.keywordsNon;
          } else {
            this.keywordsNon = [];
          }

          this.threshold = data.threshold;
          this.hitKeyword = data.hitKeyword;
          this.hitSpeaker = data.hitSpeaker;
          this.keywordsFormat(data);
          this.platformsFormat(data);
          this.telruleFormat(data);
          this.speakerFormat(data);
          this.MONITOR_CONDITION(res.data)
          console.log(this.getMonitorCondition())
        })
        .then(() => {
          if(flag){
            return
          }
          this.condition();
        });
    },
    keywordsFormat(data) {
      let str = "";
      if (data.keywordsAnd) {
        for (let i = 0; i < data.keywordsAnd.length; i++) {
          str += `+${data.keywordsAnd[i]}`;
        }
      }
      if (data.keywords) {
        for (let i = 0; i < data.keywords.length; i++) {
          str += ` ${data.keywords[i]}`;
        }
      }
      if (data.keywordsNon) {
        for (let i = 0; i < data.keywordsNon.length; i++) {
          str += `~${data.keywordsNon[i]}`;
        }
      }

      // if (str[0] === "+" || str[0] === " ") {
      //   str = str.substr(1);
      // }
      if (str[0] === " ") {
        str = str.substr(1);
      }
      this.keywords = str;
    },
    platformsFormat(data) {
      if (!data.platforms) {
        this.platform = "";
      } else if (data.platforms.length == 0) {
        this.platform = "";
      } else {
        this.platform = data.platforms[0];
      }
    },
    telruleFormat(data) {
      if (data.numberRules) {
        this.telrule = data.numberRules.join(",");
      } else {
        this.telrule = "";
      }
    },
    speakerFormat(data) {
      if (data.speakerIds) {
        if (data.speakerIds.length == 0) {
          this.speakerId = [];
          this.speaker = "";
        } else {
          this.speakerId = data.speakerIds;
          this.speaker = data.speakers.join(",");
        }
      } else {
        this.speakerId = [];
        this.speaker = "";
      }
    }
  },
  beforeCreate() {},
  created() {
    console.error("created");
    window.isRefresh = false;
    this.cityCodeInit();
    this.Utils.dateFormat();

    this.platformOptions = this.getPlatform();
    this.account = this.getAccount();

    this.setCondition();
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
  activated() {
    // if(this.count == 1){
    //   this.condition()
    //   this.count++
    // }
    console.error("activated");
    if (window.isRefresh) {
      this.switchBtn = "修改";
      this.autoFlag = true;
    } else {
      this.switchBtn = "确定";
      this.autoFlag = false;
    }
  },
  deactivated() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.monitor {
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

.monitor {
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
.monitor {
  // .el-select {
  //   height: 30px !important;
  //   // .is-disabled{
  //   //   height: 30px !important;
  //   .el-input__inner {
  //     height: 30px !important;
  //   }
  //   // }
  // }

  .el-checkbox__label {
    font-size: 12px;
  }
  #container {
    &.fold {
      // grid-template-rows: 40px 40px 40px;
      grid-template-rows: 40px 40px;
    }
    .title {
      font-size: 12px;
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
      grid-column-start: 1;
      grid-column-end: 11;
      grid-row-start: 1;
      grid-row-end: 2;
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
          // margin-right: 46px;
          flex-shrink: 0;
          width: 70px;

        }
      }
    }
    .item-2 {
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

    .item-3 {
      grid-column: span 4;
      .group {
        display: flex;
        .title {
          flex-shrink: 0;
          width: 70px;
        }
        .el-select {
          width: calc(100% - 70px);
        }
      }
    }
    .item-4 {
      .group{
        display: flex;
      }
      .title {
        flex-shrink: 0;
        width: 70px;
      }
      grid-column: span 4;
    }
    .item-5 {
      grid-column: span 4;
      .group {
        display: flex;
        .title {
          flex-shrink: 0;
          width: 70px;
        }
        .el-select {
          width: calc(100% - 70px);
        }
      }
    }
    .item-6 {
      .group{
        display: flex;
      }
      .title {
        flex-shrink: 0;
        width: 70px;
      }
      grid-column: span 4;
    }
    .item-8 {
      grid-column: span 3;
      grid-column-end: -1;
      display: flex;
      justify-content: flex-end;
      padding-top: 5px;
    }

  }
}
</style>