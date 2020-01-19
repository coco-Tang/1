<!--
 * @Author: coco-Tang
 * @Date: 2019-09-30 14:27:58
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-17 17:19:58
 * @Description: 
 -->
<template>
  <div class="speakers">
    <speaker-dialog
      @setSpeaker="dispenseSubmitCompSpeaker"
      :update-msg="updateMsg"
      ref="compSpeaker"
    ></speaker-dialog>
    <!-- <search-speaker @setSearch='childSearch' ref='compSearchSpeaker'></search-speaker> -->
    <exportDialog @setExport="dispenseSubmitCompExport" :export-msg="exportMsg" ref="compExport"></exportDialog>
    <div class="table">
      <slide-panel
        ref="compSlide"
        :myMessage="myMessage"
        :trainIsshow="trainIsshow"
        @slidePanel="slidePanel"
        @showSlidePanel="showSlidePanel"
      ></slide-panel>

      <div class="table_head">
        <div class="left">
          <span>对象声纹</span>
        </div>
        <div class="right" @keyup.enter="callLoad(queryInput)">
          <el-select class="firstitem" style="height:30px" v-model="searchType" placeholder="请选择">
            <el-option
              v-for="item in searchTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            style="margin-left:10px"
            v-model="queryInput"
            clearable
            @clear="callLoad"
            placeholder="请输入内容"
          >
            <el-button
              @click="callLoad(queryInput)"
              class="search"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
          <el-button style="margin-left:10px" type="primary" @click="callNew" class="create">新建</el-button>
          <!-- <el-button type="primary" :disabled="edit" @click="callEdit" class="edit">编辑</el-button> -->
          <el-button type="primary" :disabled="mydelete" @click="confirmDelete" class="del">删除</el-button>
          <el-button type="primary" :disabled="online" @click="confirmOnline" class="online">上线</el-button>
          <el-button type="primary" :disabled="offline" @click="confirmOffline" class="offline">下线</el-button>
          <!-- <el-button type='primary'>按模板批量添加</el-button> -->
          <el-button type="primary" :disabled="train" @click="callTrain" class="train">训练</el-button>
          <!-- <el-button type='primary' @click='callExpXls' class='export'>导出</el-button>
          <el-button type='primary' @click='callSearch' class='query'>检索对象</el-button>-->
        </div>
      </div>

      <div class="table_content">
        <ag-grid-vue
          style="width: 100%; height: "
          class="ag-grid ag-theme-material"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :enableColResize="enableColResize"
          :enableFilter="enableFilter"
          :headerHeight="headerHeight"
          :localeText="localeText"
          :rowData="rowData"
          :rowHeight="rowHeight"
          :rowSelection="rowSelection"
          :rowDeselection="rowDeselection"
          :rowMultiSelectWithClick="rowMultiSelectWithClick"
          :showToolPanel="showToolPanel"
          :suppressRowClickSelection="suppressRowClickSelection"
          :suppressToolPanel="suppressToolPanel"
          :toolPanelSuppressPivotMode="toolPanelSuppressPivotMode"
          :toolPanelSuppressPivots="toolPanelSuppressPivots"
          :toolPanelSuppressRowGroups="toolPanelSuppressRowGroups"
          :toolPanelSuppressSideButtons="toolPanelSuppressSideButtons"
          :toolPanelSuppressValues="toolPanelSuppressValues"
          @gridReady="onGridReady"
          @selectionChanged="rowSelected"
          @cellClicked="cellClicked"
          @rowDoubleClicked="showSlidePanel"
          :columnVisible="hideColum"
          :enableBrowserTooltips="true"
          :suppressColumnVirtualisation="suppressColumnVirtualisation"
          :suppressCopyRowsToClipboard="suppressCopyRowsToClipboard"
        ></ag-grid-vue>
      </div>

      <div class="table_pagination" :class="{ 'pager-hidden' : !totalPage || totalPage <= 15 }">
        <el-pagination
          @size-change="elChangeSize"
          @current-change="elChangeCurrPage"
          :current-page="currentPage"
          :page-sizes="[15, 25, 50, 100,200,500,1000]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
      <!-- <player></player>    -->
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { mapGetters, mapMutations } from "vuex";
import {
  getSpeakers,
  newSpeaker,
  fixSpeaker,
  getSingleSpeaker,
  delSpeakers,
  trainSpeakers,
  onlineSpeakers,
  offlineSpeakers
} from "@/api/speaker";
import localeText from "../../static/localeText.json";
import speakerDialog from "@/components/dialog/speakerDialog.vue";
import slidePanel from "@/components/slidePanel.vue";
import searchSpeaker from "@/components/dialog/searchSpeaker.vue";
import exportDialog from "@/components/dialog/exportDialog.vue";
import SpeakerCellOperation from "@/components/table/SpeakerCellOperation.vue";
// import SockJS from '../search/sockjs.js'
// import stomp from '../search/stomp.js'

export default {
  name: "speakers",
  components: {
    AgGridVue,
    speakerDialog,
    slidePanel,
    searchSpeaker,
    exportDialog
  },
  data() {
    return {
      totalPage: 0,
      currentPage: 1,
      pageSize: 15,

      gridOptions: {},
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
          headerCheckboxSelection: true,
          checkboxSelection: true,
          minWidth: 120
          // valueFormatter: this.numberFormatter,
        },
        {
          headerName: "声纹编号",
          editable: false,
          field: "code",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "声纹名称",
          editable: false,
          field: "name",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "性别",
          editable: false,
          field: "gender",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.genderFormatter
        },
        // {
        //     headerName: '声纹类别', editable: false, field: 'category', menuTabs: ['columnsMenuTab'],
        //     valueFormatter: this.categoryFormatter
        // },
        {
          headerName: "训练状态",
          editable: false,
          field: "trainState",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.trainstateFormatter,
          cellStyle: params => {
            return { color: params.value ? "" : "#F98406" };
          }
        },
        {
          headerName: "中标阈值",
          editable: false,
          field: "threshold",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "上线状态",
          editable: false,
          field: "onlineState",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.onlineStateFormatter,
          cellStyle: params => {
            if (params.value) {
              return { color: "green" };
            } else {
              return { color: "red" };
            }
          },
          tooltip: () => "单击修改上线状态"
        },
        {
          headerName: "权限",
          editable: false,
          field: "type",
          valueGetter: this.typeFormatter,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "匹配平台",
          editable: false,
          field: "matchPlatform",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.matchPlatformFormatter
        },
        {
          headerName: "备注",
          editable: false,
          field: "remark",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "创建者",
          editable: false,
          field: "creator",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "操作",
          editable: false,
          field: "",
          cellRendererFramework: SpeakerCellOperation,
          minWidth: 120,
          menuTabs: ["columnsMenuTab"]
        }
        // {
        //     headerName: '承办者', editable: false, field: 'undertaker', menuTabs: ['columnsMenuTab']
        // },
        // {
        //     headerName: '策略', editable: false, field: 'telrules', menuTabs: ['columnsMenuTab']
        // },
        // {   headerName: '创建时间', editable: false, field: 'createtime', menuTabs: ['columnsMenuTab'] },
        // {
        //     headerName: '案件', editable: false, field: 'cases', menuTabs: ['columnsMenuTab'],
        //     hide: true
        // },
        // {
        //     headerName: '得分', editable: false, field: 'score', menuTabs: ['columnsMenuTab'],
        //     hide: true
        // }
      ],
      rowData: [],
      localeText: {},

      queryInput: "",
      edit: true,
      mydelete: true,
      online: true,
      offline: true,
      train: true,
      trainIsshow: false,
      updateMsg: {
        isUpdate: false,
        data: {}
      },
      exportMsg: {
        currentPage: "",
        pageSize: "",
        totalPage: "",
        list: false
      },
      myMessage: [],
      gridEvent: {},
      stompClient: null,
      rowNode: {},
      searchType: "code",
      searchTypeOptions: [
        {
          label: "声纹编号",
          value: "code"
        },
        {
          label: "声纹名称",
          value: "name"
        }
      ],
      selectArr: [],
      matchPlatform: [],
      matchPlatformOptions: []
    };
  },
  created() {},
  beforeMount() {
    this.localeText = localeText;
    this.gridOptions = {
      context: {
        componentParent: this
      },
      enableBrowserTooltips: true
    };
    this.defaultColDef = {
      resizable: true,
      filter: true
    };
    console.log(this.gridOptions);
    // this.createRowData()
  },
  mounted() {
    this.gridOptions.api.sizeColumnsToFit();
    this.platformOptions = this.getPlatform();
    // utils.autosize(this.gridOptions)
    this.Utils.dateFormat();
    this.callLoad();
    // getSpeakers('','','','')
    //     .then(res=>{
    //         console.log('getSpeakers--res:', res)
    //     })
    //     .catch(err => console.error('getSpeakers--err:', err))
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {
    console.log("speakers destroyed");
    this.SPEAKERID(null);
  },
  methods: {
    ...mapGetters(["getPlatform", "getAccount"]),
    ...mapMutations(["SPEAKERID"]),
    matchPlatformFormatter(v) {
      let str = "";
      for (let k in v.data.matchPlatform) {
        for (let key in this.platformOptions) {
          if (this.platformOptions[key].value === v.data.matchPlatform[k]) {
            str += this.platformOptions[key].label + "、";
          }
        }
      }
      return str.substring(0, str.length - 1);
    },
    elChangeSize(v) {
      this.pageSize = v;
      this.callLoad();
    },
    elChangeCurrPage(v) {
      this.currentPage = v;
      this.callLoad();
    },
    callExpXls() {
      this.exportMsg.currentPage = this.currentPage;
      this.exportMsg.pageSize = this.pageSize;
      this.exportMsg.totalPage = this.totalPage;

      this.$refs.compExport.showDialog();
    },
    dispenseSubmitCompExport(params) {
      let url = speakerExportUrl + params + `&casename=`;

      console.log(url);
      window.location.href = url;
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
    typeFormatter(v) {
      if (v.data.type == 1) {
        return "公有";
      } else {
        return "私有";
      }
    },
    genderFormatter(v) {
      switch (v.value) {
        case 0:
          return "未知"; // 原为 '不限'
          break;
        case 1:
          return "男";
          break;
        case 2:
          return "女";
          break;
      }
    },
    categoryFormatter(v) {
      switch (v.value) {
        case 0:
          return "正常";
          break;
        case 1:
          return "排除";
          break;
        case 2:
          return "诈骗";
          break;
      }
    },
    trainstateFormatter(v) {
      switch (v.value) {
        case true:
          return "已训练";
          break;
        // case 1:
        //     return '正在训练';
        //     break;
        // case 2:
        //     return '训练成功';
        //     break;
        // case 3:
        //     return '训练失败';
        //     break;
        default:
          return "未训练";
      }
    },
    onlineStateFormatter(v) {
      return v.value === true ? "上线" : "下线";
    },
    telrulesFormatter(v) {
      // console.log(v)
      return v.data.telrules.join(",");
    },
    datasourceFormatter(v) {
      for (let k in this.platformOptions) {
        if (this.platformOptions[k].value === v.data.datasource[0]) {
          return this.platformOptions[k].label;
        }
      }
    },
    onGridReady() {
      // this.gridOptions.api.sizeColumnsToFit()
      // utils.autosize(this.gridOptions)
      // this.localeText = localeText
      if (window.innerWidth < 1280) {
        this.Utils.autosize(this.gridOptions);
      } else {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    rowSelected(v) {
      console.log(`------------------------------`);
      console.log(this.gridOptions.api.getSelectedRows());
      console.log(`------------------------------`);

      let arr = this.gridOptions.api.getSelectedRows();
      // console.log(this.gridOptions.api.getSelectedRows().length!=0)

      //edit
      arr.length === 1 ? (this.edit = false) : (this.edit = true);

      //train
      this.trainJudge(arr) ? (this.train = false) : (this.train = true);
      // arr.length === 1 ? this.train = false : this.train = true

      //offline
      this.offlineJudge(arr) ? (this.offline = false) : (this.offline = true);

      //online
      this.onlineJudge(arr) ? (this.online = false) : (this.online = true);

      //delete
      this.deleteJudge(arr) ? (this.mydelete = false) : (this.mydelete = true);

      this.selectArr = this.gridOptions.api.getSelectedRows();
    },
    trainJudge(arr) {
      if (arr.length != 1) {
        return false;
      }
      if (arr[0].onlineState === true) {
        return false;
      }
      return true;
    },
    offlineJudge(arr) {
      for (let k in arr) {
        if (arr[k].onlineState === true) {
          return true;
        }
      }
      return false;
    },
    onlineJudge(arr) {
      for (let k in arr) {
        if (arr[k].onlineState === false) {
          return true;
        }
      }
      return false;
    },
    deleteJudge(arr) {
      if (arr.length === 0) {
        return false;
      }

      for (let k in arr) {
        if (arr[k].onlineState === true) {
          return false;
        }
      }
      return true;
    },
    callEdit() {
      let arr = this.gridOptions.api.getSelectedRows();

      this.updateMsg.isUpdate = true;
      this.updateMsg.data = arr[0];
      this.$refs.compSpeaker.showDialog();
    },
    confirmDelete() {
      this.Utils.confirmBox(this, "确定删除选中声纹?", this.callDel);
    },
    callDel() {
      let arr = this.gridOptions.api.getSelectedRows(),
        idArr = [],
        ids;

      arr.map(el => idArr.push(el.id));
      ids = idArr.join(",");

      delSpeakers(ids)
        .then(res => {
          if (res.status === 200) {
            this.$message.success({ message: "删除成功", duration: 800 });
            this.callLoad();
          }
        })
        .catch(err => console.error("delSpeakers--err:", err));
    },
    confirmOnline() {
      this.Utils.confirmBox(this, "确定上线选中声纹?", this.callOnline);
    },
    callOnline() {
      let arr = this.gridOptions.api.getSelectedRows(),
        idArr = [],
        fd;

      if (arr.some(el => el.onlineState)) {
        this.$message.warning("请勿选择已上线的声纹");
        return;
      }

      arr.map(el => idArr.push(el.id));
      fd = new FormData();
      fd.append("speakerIds", idArr);

      onlineSpeakers(fd)
        .then(res => {
          if (res.status === 200) {
            this.$message.success({ message: "上线成功", duration: 800 });
            this.callLoad();
          }
        })
        .catch(err => {
          console.error("onlineSpeakers--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    confirmOffline() {
      this.Utils.confirmBox(this, "确定下线选中声纹?", this.callOffline);
    },
    callOffline() {
      let arr = this.gridOptions.api.getSelectedRows(),
        idArr = [],
        fd;

      if (arr.some(el => !el.onlineState)) {
        this.$message.warning("请勿选择已下线的声纹");
        return;
      }

      arr.map(el => idArr.push(el.id));
      fd = new FormData();
      fd.append("speakerIds", idArr);

      offlineSpeakers(fd)
        .then(res => {
          if (res.status === 200) {
            this.$message.success({ message: "下线成功", duration: 800 });
            this.callLoad();
          }
        })
        .catch(err => {
          console.error("offlineSpeakers--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    exportHandle() {
      let params = new URLSearchParams();
      params.append("start", 0);
      params.append("limit", 10);

      speakerExport(params)
        .then(res => {
          console.log(res);
        })
        .catch(err => console.error("speakerExport--err:", err));
    },
    callTrain() {
      let arr = this.gridOptions.api.getSelectedRows(),
        idArr = [],
        fd;
      arr.map(el => idArr.push(el.id));
      fd = new FormData();
      fd.append("speakerIds", idArr);

      trainSpeakers(fd)
        .then(res => {
          if (res.status === 200) {
            this.$message.success({ message: "训练成功", duration: 800 });
            this.callLoad();
          }
        })
        .catch(err => {
          console.error("trainSpeakers--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    callLoad(speaker = "") {
      console.log("callLoad");
      // this.platformOptions = this.getPlatform().platformOptions

      let params = {};
      params.start = (this.currentPage - 1) * this.pageSize;
      params.limit = this.pageSize;
      params.code = this.queryInput;
      params.name = this.queryInput;
      if (this.searchType === "code") {
        params.name = "";
      } else if (this.searchType === "name") {
        params.code = "";
      }

      getSpeakers(params)
        .then(res => {
          if (res.data.records.length == 0 && this.currentPage != 1) {
            --this.currentPage;
            this.callLoad();
          }
          var data = res.data.records;
          data.map((el, idx) => {
            el.number = idx + 1;
            this.rowData.push(el);
          });

          this.rowData = res.data.records;
          this.totalPage = res.data.total;
          this.input = "";
          this.edit = true;
          this.mydelete = true;
          this.online = true;
          this.offline = true;
        })
        .then(() => {
          this.selectStatus();
          // if(this.gridEvent.node){
          //   // console.log('this.gridEvent')
          //   // console.log(this.gridEvent)
          //   // this.gridOptions.api.deselectAll()
          //   // this.gridEvent.node.setSelected(true)

          //   this.gridOptions.api.getRowNode(this.gridEvent.node.childIndex).setSelected(true)
          // }
          // this.selectStatus()
        })
        .catch(err => {
          console.error("getSpeakers--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    callNew() {
      this.$refs.compSpeaker.showDialog();
    },
    callSearch() {
      this.$refs.compSearchSpeaker.showDialog();
    },
    dispenseSubmitCompSpeaker(params) {
      const fd = this.Utils.formatParams(params, "fd");
      if (this.updateMsg.isEdit) {
        fixSpeaker(this.updateMsg.data.id, fd)
          .then(res => {
            if (res.status === 200) {
              this.$message("修改成功");
              this.updateMsg.isEdit = false;
              this.callLoad();
            }
          })
          .catch(err => {
            console.error("fixSpeaker--err:", err);
            this.$message.error(err.response.data.msg);
          });
      } else {
        newSpeaker(fd)
          .then(res => {
            if (res.status === 200) {
              this.$message("新建成功");
              this.callLoad();
            }
          })
          .catch(err => {
            console.error("newSpeaker--err:", err);
            this.$message.error(err.response.data.msg);
          });
      }
    },
    childSearch(data) {
      for (var k in data.records) {
        data.records[k].number = Number(k) + 1;
        this.rowData.push(data[k]);
      }
      this.rowData = data.records;
      this.totalPage = data.total;
      console.log("childSearch");
      console.log(this.rowData);
      console.log(data);
    },
    slidePanel(flag) {
      let table = document.querySelector(".table");

      let transitionFlag = true;

      flag
        ? (table.style.width = "calc(100% - 300px)")
        : (table.style.width = "100%");
      // setTimeout(()=>{
      //   this.gridOptions.api.sizeColumnsToFit()
      //   // utils.autosize(this.gridOptions)
      // },1000)
    },
    showSlidePanel(e, uploadFlag) {
      // console.log('this.gridEvent:', this.gridEvent) // 神一样的存在
      console.log("e:", e);
      console.log("uploadFlag:", uploadFlag);

      if (uploadFlag) {
        e = this.gridEvent;
        // console.log('uploadFlag = true 时的 e/this.gridEvent:', e)
      }
      this.gridEvent = e;

      this.gridOptions.api.deselectAll();
      e.node.setSelected(true);

      this.SPEAKERID(e.data.id);
      this.$refs.compSlide.clickCloseBtn(true);

      let arr = ["root", "train", "raw"],
        tasks = [],
        speakerId = null;

      speakerId = e.data.id;
      getSingleSpeaker(speakerId)
        .then(res => {
          console.log("getSingleSpeaker", res);
          if (res.status === 200) {
            this.myMessage = []; // 先清空
            this.myMessage.push(
              { label: "raw", children: [] },
              { label: "train", children: [] }
            );
            this.trainIsshow = res.data.onlineState;
            let rawVoiceList = res.data.rawVoices,
              trainVoiceList = res.data.trainVoices;

            if (rawVoiceList) {
              rawVoiceList.map(el => {
                this.myMessage[0].children.push({
                  label: el.fileName,
                  value: el.id,
                  // sharepath: _train[k].sharepath,
                  localPath: el.url,
                  fileName: el.fileName,
                  format: el.format,
                  id: el.id,
                  fileType: 0
                });
              });
            }
            if (trainVoiceList) {
              trainVoiceList.map(el => {
                this.myMessage[1].children.push({
                  label: el.fileName,
                  value: el.id,
                  // sharepath: _train[k].sharepath,
                  localPath: el.url,
                  fileName: el.fileName,
                  format: el.format,
                  id: el.id,
                  fileType: 1
                });
              });
            }
          }
        })
        .catch(err => {
          console.error("getSingleSpeaker--err:", err);
          this.$message.error(err.response.data.msg);
        });
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
    },
    selectStatus() {
      if (this.selectArr.length != 0) {
        this.gridOptions.api.forEachNode((node, index) => {
          this.selectArr.forEach((item, i) => {
            if (item.id === node.data.id) {
              node.setSelected(true);
            }
          });
        });
      }
    },
    cellClicked(e) {
      if (e.colDef.field == "onlineState") {
        this.gridOptions.api.deselectAll();
        e.node.setSelected(true);
        if (e.value) {
          this.confirmOffline();
        } else {
          this.confirmOnline();
        }
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.speakers {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .head {
    ul {
      display: flex;
      li {
        margin-right: 10px;
      }
    }
  }
  .table {
    width: 100%;
    height: 100%;
    transition: width 0.8s;
    position: relative;
    overflow: visible;
    .table_head {
      .right {
        display: flex;
        .el-select {
          width: 100px;
          &:nth-child(1) {
            .el-input {
              flex-shrink: 0;
              width: 100px;
            }
          }
        }
      }
    }
  }
}
</style>
