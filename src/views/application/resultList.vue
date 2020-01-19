<!--
 * @Author: coco-Tang
 * @Date: 2019-10-28 19:00:26
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-28 20:05:29
 * @Description: 
 -->
<template>
  <div class="resultList">
    <remarkComponent @setRemark="childCreate" :update-msg="updateMsg" ref="c1"></remarkComponent>
    <exportDialog @setExport="childCreate2" :export-msg="exportMsg" ref="c2"></exportDialog>
    <div class="table">
      <div class="table_head">
        <div class="left">
          <span class="title">结果列表</span>
        </div>
        <div class="right">
          <el-button-group>
            <!-- <el-button type="primary" :disabled="disExport" @click="exportExcel" class='export'>导出话单</el-button> -->
            <!-- <el-button :disabled="downloadBtn" @click="downloadVoice">下载</el-button> -->
            <el-button v-if="showTaskBtn" style="padding: 5px 10px" @click="returnTask">返回</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="table_content" v-loading="loading || loading2">
        <ag-grid-vue
          style="width: 100%; height: "
          class="ag-grid ag-theme-material"
          :gridOptions="gridOptions"
          :showToolPanel="showToolPanel"
          :enableColResize="enableColResize"
          :headerHeight="headerHeight"
          :rowHeight="rowHeight"
          :enableFilter="enableFilter"
          :enableSorting="true"
          :rowSelection="rowSelection"
          :rowDeselection="rowDeselection"
          :suppressRowClickSelection="suppressRowClickSelection"
          :toolPanelSuppressRowGroups="toolPanelSuppressRowGroups"
          :toolPanelSuppressValues="toolPanelSuppressValues"
          :toolPanelSuppressPivots="toolPanelSuppressPivots"
          :toolPanelSuppressPivotMode="toolPanelSuppressPivotMode"
          :suppressToolPanel="suppressToolPanel"
          :toolPanelSuppressSideButtons="toolPanelSuppressSideButtons"
          :rowMultiSelectWithClick="rowMultiSelectWithClick"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :localeText="localeText"
          :cellValueChanged="valueChange"
          :getRowStyle="changeBgColor"
          @rowDoubleClicked="turnToDetail"
          @gridReady="onGridReady"
          @selectionChanged="rowSelected"
          :columnVisible="hideColum"
          :suppressColumnVirtualisation="suppressColumnVirtualisation"
          :suppressCopyRowsToClipboard="suppressCopyRowsToClipboard"
        ></ag-grid-vue>
      </div>
      <div class="table_pagination" :class="{ 'pager-hidden' : !totalPage || totalPage <= 15 }">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 25, 50, 100,200,500,1000]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="totalPage"
        ></el-pagination>
        <span style="font-size:12px;line-height:32px">共{{myTotal}}条</span>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { mapActions, mapGetters } from "vuex";

import levelComponent from "@/components/table/levelComponent.vue";
import targetComponent from "@/components/table/targetComponent.vue";
import callerComponent from "@/components/table/callerComponent.vue";
import calleeComponent from "@/components/table/calleeComponent.vue";
import statusComponent from "@/components/table/statusComponent.vue";
import keywordComponent from "@/components/table/keywordComponent.vue";
import speechsegComponent from "@/components/table/speechsegComponent.vue";
import speakerComponent from "@/components/table/speakerComponent.vue";
import keywordsHitComponent from "@/components/table/keywordsHitComponent.vue";
import speechsegsHitComponent from "@/components/table/speechsegsHitComponent.vue";
import speakersHitComponent from "@/components/table/speakersHitComponent.vue";
import targetHitComponent from "@/components/table/targetHitComponent.vue";

import remarkComponent from "@/components/dialog/remarkDialog.vue";

import exportDialog from "@/components/dialog/exportDialog.vue";
import {
  getTaskResult,
  changecallstatus,
  phonenoCreate,
  dangerousDelete,
  addremark,
  downloadurl,
  taskExportUrl,
  changecallstatusAndaddListen,
  addlisten
} from "@/api/index.js";
import localeText from "../../static/localeText.json";

import headerComponent from "@/components/table/headerComponent.vue";
import statusCellComponent from "@/components/table/statusCellComponent.vue";
import downloadCellComponent from "@/components/table/downloadCellComponent.vue";

export default {
  name: "resultList",
  data() {
    return {
      loading2: false,
      loading: false,
      i: 0,
      totalPage: 0,
      currentPage: 1,
      pageSize: 15,
      //   taskId: '',
      value2: "",

      gridOptions: {
        // getRowStyle: this.getRowStyle
      },
      showToolPanel: false,
      enableColResize: true,
      headerHeight: 40,
      rowHeight: 40,
      enableFilter: true,
      rowSelection: "multiple",
      rowDeselection: true,
      suppressRowClickSelection: true,
      toolPanelSuppressRowGroups: true,
      toolPanelSuppressValues: true,
      toolPanelSuppressPivots: true,
      toolPanelSuppressPivotMode: true,
      suppressToolPanel: true,
      toolPanelSuppressSideButtons: true,
      rowMultiSelectWithClick: true,
      suppressColumnVirtualisation: true,
      suppressCopyRowsToClipboard: true,

      columnDefs: [
        {
          headerName: "序号",
          editable: false,
          field: "number",
          menuTabs: ["columnsMenuTab"],
          width: 100,
          headerCheckboxSelection: !true,
          checkboxSelection: !true,
          suppressSizeToFit: true
          // valueFormatter: this.numberFormatter,
        },
        {
          headerName: "状态",
          editable: false,
          field: "status",
          menuTabs: ["columnsMenuTab"],
          // width: 400,
          cellRendererFramework: "statusCellComponent",
          minWidth: 190
        },
        {
          headerName: "主叫号码",
          editable: false,
          field: "caller",
          menuTabs: ["columnsMenuTab"],
          cellRendererFramework: "callerComponent"
        },
        {
          headerName: "被叫号码",
          editable: false,
          field: "callee",
          menuTabs: ["columnsMenuTab"],
          cellRendererFramework: "calleeComponent"
        },
        {
          headerName: "语种",
          editable: false,
          field: "languagename",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.langFormatter
        },
        // {
        //   headerName: '语种输出', editable: false, field: 'langScore', menuTabs: ['columnsMenuTab'],
        //   hide: true, valueFormatter: this.langScoreFormatter,
        // },
        // {
        //   headerName: '预警中标', editable: false, menuTabs: ['columnsMenuTab'],
        //   // field: 'speakers',
        //   // field: 'keywords',
        //   cellRendererFramework: 'targetComponent',
        //   // width: 600
        // },
        // {
        //   headerName: '检索结果', editable: false, menuTabs: ['columnsMenuTab'],
        //   hide: false, cellRendererFramework: 'targetHitComponent',
        //   // field: 'sort',
        //   // width: 600
        // },
        {
          headerName: "通话时间",
          editable: false,
          field: "starttime",
          menuTabs: ["columnsMenuTab"],
          // valueFormatter: this.starttimeFormatter,
          valueFormatter: this.starttimeFormatter
        },
        {
          headerName: "通话时长",
          editable: false,
          menuTabs: ["columnsMenuTab"],
          hide: false,
          valueGetter: this.durationFormatter,
          comparator: this.durationComparator
          // valueFormatter: this.durationFormatter,
        },
        {
          headerName: "中标结果",
          editable: false,
          // field: 'keywords',
          cellRendererFramework: "targetComponent",
          menuTabs: ["columnsMenuTab"]
          // width: 600
        },
        {
          headerName: "调听人",
          editable: false,
          menuTabs: ["columnsMenuTab"],
          hide: false,
          valueGetter: this.listenerFormatter
          // valueFormatter: this.durationFormatter,
        },
        // {
        //   headerName: '来源平台', editable: false, menuTabs: ['columnsMenuTab'],
        //   hide: false, valueGetter: this.platFormatter,
        //   // valueFormatter: this.durationFormatter,
        // },
        // { headerName: '备注', editable: false, field: 'remark', menuTabs: ['columnsMenuTab'] },
        // {
        //   headerName: '调听人', editable: false, field: 'listen', menuTabs: ['columnsMenuTab'],
        //   hide: true,
        //   // valueGetter: this.lastlistenFormatter,
        // },
        // {
        //   headerName: '处理科室', editable: false, field: 'department', menuTabs: ['columnsMenuTab'],
        //   hide: true
        // },
        // {
        //   headerName: '处理', editable: false, field: 'handled', menuTabs: ['columnsMenuTab'],
        //   hide: true, valueGetter: this.handledFormatter
        // },
        // {
        //   headerName: '类别', editable: false, field: 'category', menuTabs: ['columnsMenuTab'],
        //   hide: true
        // },
        {
          headerName: "语音上传时间",
          editable: false,
          field: "importtime",
          menuTabs: ["columnsMenuTab"],
          hide: true
        },
        {
          headerName: "结果返回时间",
          editable: false,
          field: "recvtime",
          menuTabs: ["columnsMenuTab"],
          hide: true,
          valueFormatter: this.starttimeFormatter
        },
        {
          headerName: "来源平台",
          editable: false,
          field: "spyid",
          menuTabs: ["columnsMenuTab"],
          hide: false,
          valueGetter: this.platformFormatter
        },
        {
          headerName: "处理引擎",
          editable: false,
          field: "srid",
          menuTabs: ["columnsMenuTab"],
          hide: true
        },
        // {
        //   headerName: '预警中标-关键词', editable: false, menuTabs: ['columnsMenuTab'],
        //   hide: true, cellRendererFramework: 'keywordComponent',
        //   // field: 'keywords',
        // },
        // {
        //   headerName: '预警中标-音频', editable: false, menuTabs: ['columnsMenuTab'],
        //   hide: true, cellRendererFramework: 'speechsegComponent'
        //   // field: 'speechsegs',
        // },
        // {
        //   headerName: '预警中标-声纹', editable: false, menuTabs: ['columnsMenuTab'],
        //   hide: true, cellRendererFramework: 'speakerComponent',
        //   // field: 'speakers',
        // },
        // {
        //   headerName: '检索结果-关键词', editable: false, menuTabs: ['columnsMenuTab'],
        //   hide: true, cellRendererFramework: 'keywordsHitComponent',
        //   // field: 'keywordsHit',
        // },
        // {
        //   headerName: '检索结果-音频', editable: false, menuTabs: ['columnsMenuTab'],
        //   hide: true, cellRendererFramework: 'speechsegsHitComponent',
        //   // field: 'speechsegsHit',
        // },
        // {
        //   headerName: '检索结果-声纹', editable: false, menuTabs: ['columnsMenuTab'],
        //   hide: true, cellRendererFramework: 'speakersHitComponent',
        //   // field: 'speakersHit',
        // },
        {
          headerName: "callid",
          editable: false,
          field: "callid",
          menuTabs: ["columnsMenuTab"],
          hide: true
        }
        // {
        //   headerName: '文件名', editable: false, field: 'filename', menuTabs: ['columnsMenuTab'],
        //   hide: true
        // },
        // {
        //   headerName: '文件路径', editable: false, field: 'filepaths', menuTabs: ['columnsMenuTab'],
        //   hide: true
        // },
        // {
        //   headerName: '下载', editable: false, field: '', menuTabs: ['columnsMenuTab'],
        //   headerComponentFramework: 'headerComponent', cellRendererFramework: 'downloadCellComponent'
        // }
        // {
        //   headerName: '',
        //   editable: false,
        // },
      ],
      rowData: [],
      localeText: {},

      downloadBtn: true,
      updateMsg: {
        ifUpdate: false,
        data: {}
      },
      exportMsg: {
        taskid: "",
        currentPage: "",
        pageSize: "",
        totalPage: "",
        list: true,
        search: true,
        monitor: false,
        defraud: false
      },
      disExport: true,
      showTaskBtn: false,
      myTotal: 0
    };
  },
  components: {
    "ag-grid-vue": AgGridVue,
    statusComponent: statusComponent,
    levelComponent: levelComponent,
    targetComponent: targetComponent,
    callerComponent: callerComponent,
    calleeComponent: calleeComponent,
    keywordComponent: keywordComponent,
    speechsegComponent: speechsegComponent,
    speakerComponent: speakerComponent,
    keywordsHitComponent: keywordsHitComponent,
    speechsegsHitComponent: speechsegsHitComponent,
    speakersHitComponent: speakersHitComponent,
    targetHitComponent: targetHitComponent,

    remarkComponent: remarkComponent,
    exportDialog: exportDialog,

    headerComponent: headerComponent,
    statusCellComponent: statusCellComponent,
    downloadCellComponent: downloadCellComponent
  },
  computed: {
    getComNext() {
      console.log("computed getComNext");
      return this.getNextRecord().dateFlag;
      // return this.$store.player.nextRecord.dateFlag
    },
    getBill() {
      return this.getBillStatus().dateFlag;
    },
    getComResultData() {
      return this.getResultData().records;
    }
  },
  props: {
    taskid: String
  },
  watch: {
    getComNext() {
      let data = this.getNextRecord();

      console.log("watch getComNext");
      this.gridOptions.api.forEachNode((node, index) => {
        if (node.data.callid === data.callid) {
          this.gridOptions.api.deselectAll();
          // console.error('getComNext')
          // console.log(this.getNextRecord())
          // console.log(this.gridOptions.api.getRowNode(index+1))
          let d = new Date();

          if (
            this.getNextRecord().next &&
            this.gridOptions.api.getRowNode(index + 1)
          ) {
            this.PLAYER_DATA({
              dateFlag: d,
              type: "ql",
              callid: this.gridOptions.api.getRowNode(index + 1).data.callid,
              starttime: this.gridOptions.api.getRowNode(index + 1).data.starttime
            });
            this.changeStatus(this.gridOptions.api.getRowNode(index + 1));
            this.gridOptions.api.getRowNode(index + 1).setSelected(true);
            this.gridOptions.api.ensureIndexVisible(index + 1,'middle')
          } else if (
            !this.getNextRecord().next &&
            this.gridOptions.api.getRowNode(index - 1)
          ) {
            this.PLAYER_DATA({
              dateFlag: d,
              type: "ql",
              callid: this.gridOptions.api.getRowNode(index - 1).data.callid,
              starttime: this.gridOptions.api.getRowNode(index - 1).data.starttime
            });
            this.changeStatus(this.gridOptions.api.getRowNode(index - 1));
            this.gridOptions.api.getRowNode(index - 1).setSelected(true);
            this.gridOptions.api.ensureIndexVisible(index - 1,'middle')
          } else {
            this.gridOptions.api.getRowNode(index).setSelected(true);
            this.gridOptions.api.ensureIndexVisible(index,'middle')
          }
        }
      });
    },
    getBill() {
      let node = this.gridOptions.api.getSelectedNodes()[0];
      let data = this.getBillStatus();

      let rowNode = this.gridOptions.api.getRowNode(node.id);
      let cache = 0;

      console.log("getBill");
      console.log(data);
      console.log(node.data);

      if (data.status) {
        node.data.appended.veracityMark = data.status;
        rowNode.setData(node.data);
      }
      if (data.level || data.level == 0) {
        node.data.appended.calllevel = data.level;
        rowNode.setData(node.data);
        cache = rowNode.data.status;
        node.data.status = 100;
        rowNode.setData(node.data);
        node.data.status = cache;
        rowNode.setData(node.data);
      }
      if (data.gender) {
        node.data.gender = data.gender;
        rowNode.setData(node.data);
        cache = rowNode.data.status;
        node.data.status = 100;
        rowNode.setData(node.data);
        node.data.status = cache;
        rowNode.setData(node.data);
      }
      // if(data.segments){
      //   node.data.segments = data.segments
      //   rowNode.setData(node.data)
      //   cache = rowNode.data.status
      //   node.data.status = 100
      //   rowNode.setData(node.data)
      //   node.data.status = cache
      //   rowNode.setData(node.data)
      // }
      if (data.language) {
        node.data.languagename = data.language;
        rowNode.setData(node.data);
        cache = rowNode.data.status;
        node.data.status = 100;
        rowNode.setData(node.data);
        node.data.status = cache;
        rowNode.setData(node.data);
      }
    },
    getComResultData() {
      this.dataInit();
    }
  },
  methods: {
    // ...mapActions(['TASK_ID','QL_DATA','NEWQL_DATA','BILL_STATUS']),
    ...mapActions(["PLAYER_DATA", "HIS_SWITCH", "RESULT_DATA"]),
    ...mapGetters([
      "getResultData",
      "getNextRecord",
      "getBillStatus",
      "getPlatform",
      "getHistorySwitch",
      "getAccount"
    ]),
    exportExcel() {
      this.exportMsg.taskid = this.getTaskId();
      this.exportMsg.currentPage = this.currentPage;
      this.exportMsg.pageSize = this.pageSize;
      this.exportMsg.totalPage = this.totalPage;
      this.$refs.c2.showDialog();
    },
    childCreate2(params) {
      console.log(taskExportUrl);
      let url = taskExportUrl + params;

      console.log(url);
      window.location.href = url;
    },
    childCreate(params) {
      addremark(params).then(res => {
        console.log(res);
        this.dataInit();
      });
    },
    handleSizeChange(v) {
      this.pageSize = v;
      // this.dataInit()
      // this.$emit('pageChanged',{
      //   page:this.currentPage,
      //   size:this.pageSize
      // })
      this.currentPage = 1;
      this.$emit("pageChanged", this.currentPage, this.pageSize);
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      // this.dataInit()
      this.$emit("pageChanged", this.currentPage, this.pageSize);
    },
    startHandle() {
      var timer = setInterval(() => {
        this.schedule += 10;
        if (this.schedule >= 100) {
          clearInterval(timer);
          this.schedule = 100;
        }
      }, 500);
    },
    langFormatter(v) {
      // console.log(v)
      v = v.value;
      if (v == "bqd") {
        return "不确定";
      } else if (v == "qtyz") {
        return "其他语种";
      }
      return v;
    },
    lastlistenFormatter(v) {
      console.log(v);
      let str = "";
      for (let k in v.data.listen) {
        str += v.data.listen[k];
      }
      return str;
    },
    listenerFormatter(v) {
      // let str = ''
      // for(let k in v.data.appended.listeners){
      //   str += v.data.appended.listeners[k].user + '、'
      // }

      // return str.substring(0,str.length-1)
      let s = new Set();
      for (let k in v.data.appended.listeners) {
        s.add(v.data.appended.listeners[k].user);
      }
      return [...s];
    },
    handledFormatter(v) {
      return v.data.handled ? "已处理" : "未处理";
    },
    platformFormatter(v) {
      // console.log('platformFormatter')
      // console.log(v)
      // console.log(this.platform)
      let val = v.data.platformid;

      let res = this.platform.filter(i => {
        return i.value === val;
      });

      console.log(res);
      // return res[0].label || ''
      return res[0] ? res[0].label : "";
    },
    genderFormatter(v) {
      switch (v.data.gender) {
        case 0:
          return "不限";
          break;
        case 1:
          return "男";
          break;
        case 2:
          return "女";
          break;
        case 3:
          return "男和女";
          break;
      }
    },
    starttimeFormatter(v) {
      return new Date(Number(`${v.value}000`)).format("yyyy-MM-dd hh:mm:ss");
    },
    durationFormatter(v) {
      // console.log('durationFormatter')
      // console.log(v)
      // return this.Utils.formatTime(v.data.endtime - v.data.starttime)
      return this.Utils.formatTime(v.data.callsecs);
    },
    durationComparator(valueA, valueB, nodeA, nodeB, isInverted) {
      // return ((nodeA.data.endtime - nodeA.data.starttime) - (nodeB.data.endtime - nodeB.data.starttime))
      return nodeA.data.callsecs - nodeB.data.callsecs;
    },
    segmentsFormatter(v) {
      // console.log(v)
      if (v.value) {
        return "已转写";
      } else {
        return "未转写";
      }
    },
    callerDangrousFormatter(v) {
      return v.value ? `${v.value[0].rule} : ${v.value[0].remark}` : "";
    },
    calleeDangrousFormatter(v) {
      return v.value ? `${v.value[0].rule} : ${v.value[0].remark}` : "";
    },
    langScoreFormatter(v) {
      return v.value ? Number(v.value).toFixed(2) : "";
    },
    downloadVoice() {
      let url = downloadurl,
        data = this.gridOptions.api.getSelectedRows();

      console.log(data);

      if (data.length === 0) {
        return;
      }

      for (let k in data) {
        url += `"${data[k].callid}",`;
      }
      url = url.replace(/,$/, "]");
      // window.open(url)
      window.location.href = url;
    },
    returnTask() {
      this.HIS_SWITCH(false);
    },
    turnToDetail(v) {
      console.log("turnToDetail 222");
      this.gridOptions.api.deselectAll();
      v.node.setSelected(true);
      let d = new Date();
      this.PLAYER_DATA({
        dateFlag: d,
        type: "ql",
        callid: v.data.callid,
        starttime: v.data.starttime
      });
      // this.BILL_STATUS({
      //   reset: true
      // })
      this.changeStatus(v.node);
    },
    changeStatus(node) {
      let v = node;
      // console.log('changeStatus')
      // console.log(v)

      if (!v.data.appended.listeners) {
        let rowNode = this.gridOptions.api.getRowNode(node.id);
        v.data.appended.listeners = [];
        rowNode.setData(v.data);
        // console.error('v.data.appended.listeners.length')
        // console.log(rowNode)
      }
      // if(v.data.status === 0){
      //   let params = new URLSearchParams()
      //   params.append('callid',v.data.callid)
      //   params.append('spyid',v.data.spyid)
      //   params.append('status',1)
      //   params.append('billLevel',v.data.billLevel)

      //   changecallstatusAndaddListen(params).then(res => {
      //     let rowNode = this.gridOptions.api.getRowNode(node.id);
      //     // rowNode.setDataValue('status', 1);
      //     v.data.status = 1
      //     rowNode.setData(v.data)
      //   })
      // }else{
      //   let params = new URLSearchParams()
      //   params.append('callid',v.data.callid)
      //   params.append('spyid',v.data.spyid)
      //   addlisten(params).then(res => {
      //     console.log(res)
      //   })
      // }
    },
    onGridReady() {
      // console.log('onGridReady')
      // console.log(window.innerWidth)
      if (window.innerWidth < 1280) {
        this.Utils.autosize(this.gridOptions);
      } else {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    rowSelected(v) {
      let arr = this.gridOptions.api.getSelectedRows();

      //download
      arr.length === 0 ? (this.downloadBtn = true) : (this.downloadBtn = false);
    },
    dataInit() {
      console.log("resultList");
      console.log("dataInit");

      // this.loading = true
      this.rowData = [];

      var data = this.getResultData().records;
      console.log(data);
      for (var k in data) {
        data[k].number = Number(k) + 1;
        this.rowData.push(data[k]);
      }
      this.rowData = data || [];
      this.totalPage = this.getResultData().total || 0;

      this.myTotal = this.getResultData().total || 0;
      if (this.totalPage > 10000) {
        this.totalPage = 10000;
      }

      console.log("this.rowData");
      console.log(this.rowData);
      // this.loading = false
      // this.loading2 = false
    },
    // returnCondition() {
    //   this.$router.replace({path: '/search/condition'})
    // },
    valueChange(event) {
      // console.log('valueChange -- event:', event) // 本函数会被子组件node.setDataValue触发
    },
    changeBgColor(params) {
      switch (params.data.status) {
        case 0:
          return { background: "#fff" };
        case 1:
          return { background: "#eee" };
        case 2:
          return { background: "#d6f3d6" };
        case 3:
          return { background: "#f2d6d6" };
        case 4:
          return { background: "#ffffce" };
      }
    },
    hideColum(e) {
      let status = e.columnApi.getColumnState();
      let allHide = true;
      for (let k = 0; k < status.length; k++) {
        if (!status[k].hide) {
          allHide = false;
          break;
        }
      }
      if (allHide) {
        this.gridOptions.columnApi.setColumnVisible("number", true);
      }
    }
  },
  beforeCreate() {},
  created() {
    this.localeText = localeText;
  },
  beforeMount() {
    console.log(this.gridOptions);
    // this.createRowData()
    this.gridOptions = {
      context: {
        componentParent: this
      }
    };
  },
  mounted() {
    console.error("resultList");
    console.log(this.$route);
    console.log(this.$route.path);
    this.RESULT_DATA({
      limit: 0,
      records: [],
      start: 0,
      total: 0
    });
    if (this.$route.path == "/history") {
      this.showTaskBtn = true;
    } else {
      this.showTaskBtn = false;
    }
    this.gridOptions.api.sizeColumnsToFit();
    this.Utils.dateFormat();
    this.dataInit();
    // this.platform = this.getPlatform().platformOptions
    this.platform = this.getPlatform();

    // console.log('resultList')
    // console.log(this.getPlatform())
  },
  beforeUpdate() {},
  updated() {},
  activated() {
    // console.log('activated')
    // if(this.taskId != this.getTaskId()){
    //   this.dataInit()
    // }
  },
  deactivated() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style scoped lang="scss">
.resultList {
  width: 100%;
  height: 100%;
  min-height: 60%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  .table {
    .table_head {
      height: 30px;
      // line-height: 30px;
      .left {
        line-height: 30px;
        .title {
          font-size: 14px;
          font-weight: 700;
        }
      }
      .right {
        .export {
          width: 90px;
        }
      }
    }
  }
}
</style>
