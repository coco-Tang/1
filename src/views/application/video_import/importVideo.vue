<template>
  <div class="importVoice">
    <importVideo-dialog @setImport="childCreate" :update-msg="updateMsg" ref="c1"></importVideo-dialog>

    <div class="table">
      <div class="table_head">
        <div class="left">
          <span>导入视频</span>
        </div>

        <div class="right" @keyup.enter="dataInit(importSearch)">
          <el-input
            v-model="importSearch"
            clearable
            @clear="dataInit()"
            placeholder="请输入内容"
            class="hidden"
          >
            <el-button
              @click="dataInit(importSearch)"
              class="search"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>

          <el-button type="primary" @click="newImport">新建任务</el-button>
          <el-button type="primary" :disabled="mydelete" @click="deleteConfirm" class="del">删除</el-button>
          <el-button type="primary" class="refresh" @click="callRefresh">刷新</el-button>
        </div>
      </div>

      <div class="table_content" v-loading="loading" element-loading-text="加载中">
        <ag-grid-vue
          style="width: 100%; height: "
          class="ag-grid ag-theme-material"
          :gridOptions="gridOptions"
          :showToolPanel="showToolPanel"
          :defaultColDef="defaultColDef"
          :headerHeight="headerHeight"
          :rowHeight="rowHeight"
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
          @rowDoubleClicked="toResult"
          @gridReady="onGridReady"
          @selectionChanged="rowSelected"
          :columnVisible="hideColum"
          :suppressColumnVirtualisation="suppressColumnVirtualisation"
          :suppressCopyRowsToClipboard="suppressCopyRowsToClipboard"
          :getContextMenuItems="getContextMenuItems"
        ></ag-grid-vue>
      </div>

      <div class="table_pagination" :class="{ 'pager-hidden' : !totalPage || totalPage <= 15 }">
        <el-pagination
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15,25,50,100,200,500,1000]"
          :page-size="pageSize"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { mapActions, mapGetters } from "vuex";
import { getAllTasks, delTasks } from "@/api/impMedia";
import * as utils from "@/utils/index";
import localeText from "@/static/localeText.json";
// import axios from 'axios'
import importVideoDialog from "@/components/dialog/importVideoDialog.vue";
import cellOperation from "@/components/table/cellOperation";

export default {
  name: "importVideo",
  data() {
    return {
      loading: false,
      file: {},

      centerDialogVisible: false,
      totalPage: 0,
      currentPage: 1,
      pageSize: 15,
      taskId: "",
      value2: "",

      gridOptions: null,
      showToolPanel: false,
      defaultColDef: null,
      headerHeight: 40,
      rowHeight: 40,
      //   enableFilter: true,
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
          minWidth: 120,
          // valueFormatter: this.numberFormatter,
        },
        {
          headerName: "任务名",
          editable: false,
          field: "id",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "创建人",
          editable: false,
          field: "creator",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "创建时间",
          editable: false,
          field: "createTime",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.formatTime,
          tooltipValueGetter: params => this.formatTime(params)
        },
        {
          headerName: "编辑时间",
          editable: false,
          field: "updateTime",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.formatTime,
          tooltipValueGetter: params => this.formatTime(params)
        },
        {
          headerName: "备注",
          editable: false,
          field: "remark",
          menuTabs: ["columnsMenuTab"],
          tooltipField: "remark"
        },
        {
          headerName: "语言",
          editable: false,
          field: "language",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "处理内容",
          editable: false,
          field: "recogflag",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.recogflagFormatter,
          tooltipValueGetter: params => this.recogflagFormatter(params)
        },
        {
          headerName: "视频",
          editable: false,
          field: "impMediaNum",
          menuTabs: ["columnsMenuTab"],
          cellStyle: params => {
            return { color: "#008000" };
          },
          onCellClicked: params => {
            this.toResult(params);
          }
        },
        {
          headerName: "处理状态",
          editable: false,
          field: "processState",
          menuTabs: ["columnsMenuTab"],
          valueGetter: params => {
            if (params.data.processState === 0) {
              return "未处理";
            } else if (params.data.processState === 2) {
              return "处理完成";
            } else if (params.data.processState === 1) {
              // 后台没存, 由前端来处理'处理中'状态.
              return (
                "处理中 (" +
                params.data.hasProcessed +
                "/" +
                params.data.impMediaNum +
                ")"
              );
            } else {
              return "";
            }
          },
          cellStyle: params => {
            if (params.data.processState === 0) {
              return { color: "#F98406" };
            }
          }
        },
        {
          headerName: "处理完成时间",
          editable: false,
          field: "processEndtime",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.formatTime,
          tooltipValueGetter: params => this.formatTime(params)
        },
        {
          headerName: "耗时",
          editable: false,
          field: "duration",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "操作",
          editable: false,
          field: "",
          menuTabs: ["columnsMenuTab"],
          minWidth: 180,
          cellRendererFramework: "cellOperation"
        },
        {
          headerName: "任务编号",
          editable: false,
          hide: true,
          field: "taskId",
          menuTabs: ["columnsMenuTab"]
        }
      ],
      rowData: [],
      localeText: {},

      importSearch: "",
      edit: true,
      mydelete: true,
      online: true,
      offline: true,
      updateMsg: {
        isEdit: false,
        data: {}
      },
      taskProgress: []
    };
  },
  components: {
    "ag-grid-vue": AgGridVue,
    "importVideo-dialog": importVideoDialog,
    cellOperation: cellOperation
  },
  methods: {
    callRefresh() {
      this.dataInit();
    },
    getContextMenuItems(params) {
      console.log("----getContextMenuItems----params:", params);
      // console.log(params.node.data)
      // console.log(!params.node)
      if (!params.node) {
        return;
      }

      let result = [],
        data = params.node.data;

      result.push({
        name: `编辑`,
        action: () => {
          this.updateMsg.data = data;
          this.$refs.c3.showDialog();
          window.alert("999");
        }
      });

      return result;
    },
    parentMethod() {
      console.log(this.gridOptions);
      this.$refs.compImpVid.quickRecgnizeHandle();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.dataInit();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.dataInit();
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
    formatTime(v) {
      if (v.value === null) {
        return "";
      } else {
        return new Date(v.value).format("yyyy-MM-dd hh:mm:ss");
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
    telrulesFormatter(v) {
      // console.log(v)
      // return v.data.telrules.join(",")
    },
    onlinestateFormatter(v) {
      return v.value === 1 ? "上线" : "下线";
    },
    recogflagFormatter(v) {
      let vv = v.value;
      var str = "";
      if (vv & 1) {
        str += "有效音检测,";
      }
      if (vv & 2) {
        str += "语种检测,";
      }
      if (vv & 4) {
        str += "性别检测,";
      }
      if (vv & 8) {
        str += "声纹检测,";
      }
      if (vv & 32) {
        str += "端点检测,";
      }
      if (vv & 64) {
        str += "拨号音检测,";
      }
      if (vv & 128) {
        str += "关键词检测,";
      }
      if (vv & 256) {
        str += "全文转写,";
      }
      return str.substring(0, str.length - 1);
    },
    toResult(v) {
      this.$store.commit("setTaskId", v.data.taskId);
      this.$store.commit('setImportState', v.data.processState)
      //   console.log('toResult --> v:', v)
      //   return
      this.$router.replace({ path: "/importListVideo" });
    },
    onGridReady() {
      // this.gridOptions.api.sizeColumnsToFit()
      // utils.autosize(this.gridOptions)
      // this.localeText = localeText
      if (window.innerWidth < 1280) {
        utils.autosize(this.gridOptions);
      } else {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    rowSelected(v) {
      console.log(`-----------------------------------`);
      console.log(this.gridOptions.api.getSelectedRows());
      console.log(`------------------------------`);

      let arr = this.gridOptions.api.getSelectedRows();
      // console.log(this.gridOptions.api.getSelectedRows().length!=0)

      //edit
      arr.length === 1 ? (this.edit = false) : (this.edit = true);

      //delete
      this.deleteJudge(arr) ? (this.mydelete = false) : (this.mydelete = true);
    },
    deleteJudge(arr) {
      if (arr.length === 0) {
        return false;
      }

      for (let k in arr) {
        if (arr[k].onlinestate === 1) {
          return false;
        }
      }
      return true;
    },
    // editHandle() {
    //   let arr = this.gridOptions.api.getSelectedRows()

    //   this.updateMsg.isEdit = true
    //   this.updateMsg.data = arr[0]
    //   this.$refs.compImpVid.showDialog()

    // },
    deleteConfirm() {
      //   utils.confirmBox(this,'确定删除选中批次?', this.mydeleteHandle)
      utils.confirmBox(this, "确定删除选中批次?", this.callDel);
    },
    callDel() {
      let selectRows = this.gridOptions.api.getSelectedRows(),
        idArr = [];
      selectRows.forEach(e => idArr.push(e.taskId));

      let p = new URLSearchParams();
      p.append("taskIds", idArr);
      p.append("type", 2);
      this.loading = true;

      delTasks(p)
        .then(res => {
          this.loading = false;
          this.dataInit();
        })
        .catch(err => {
          this.$message.error({
            message: JSON.stringify(err.response.data)
          });
        });
    },
    mydeleteHandle() {
      let arr = this.gridOptions.api.getSelectedRows();
      let deleteArr = [];

      for (let k in arr) {
        deleteArr.push(arr[k].id);
      }

      let params = new URLSearchParams();
      params.append("ids", deleteArr);

      this.loading = true;
      deleteBatch(params)
        .then(res => {
          console.log("delete");
          console.log(res);
        })
        .then(() => {
          this.dataInit();
        });
    },
    // newSpeechseg() {
    //   this.centerDialogVisible = !this.centerDialogVisible
    // },
    dataInit(code = "") {
      this.loading = true;
      // this.taskId = this.getTaskId()
      // this.i = 0
      let params = new URLSearchParams();
      // params.append('taskid',this.taskId)
      // params.append('name',code)
      params.append("start", (this.currentPage - 1) * this.pageSize);
      params.append("limit", this.pageSize);
      params.append("type", 2);

      getAllTasks(params)
        .then(res => {
          this.loading = false;
          // console.log('getAllTasks--res:', res)
          if (res.data.records.length == 0 && this.currentPage != 1) {
            --this.currentPage;
            this.dataInit();
          }

          this.rowData = res.data.records.map((e, i) => {
            return {
              number: i + 1,
              id: e.id,
              taskId: e.taskId,
              creator: e.creator,
              createTime: e.createTime,
              updateTime: e.updateTime,
              remark: e.remark,
              type: e.type,
              // tvlogo: e.tvlogo, // 姑且假设能拿到台标这个字段
              language: e.processingLanguage,
              recogflag: e.processingContent,
              impMediaNum: e.voiceResult,
              // processState: sessionStorage.getItem(e.taskId)
              //   ? JSON.parse(sessionStorage.getItem(e.taskId)).processState
              //   : e.processStatus,
              processState: e.processStatus,
              hasProcessed: e.processedResult,
              processEndtime: e.processedTime,
              duration: e.beginProcessedTime ? (e.processedTime
                ? utils.timeDuration(
                    new Date(e.beginProcessedTime),
                    new Date(e.processedTime)
                  )
                : "") : (e.processedTime
                ? utils.timeDuration(
                    new Date(e.createTime),
                    new Date(e.processedTime)
                  )
                : "")
              
            };
          });

          this.totalPage = res.data.total;
          this.input = "";
          this.edit = true;
          this.mydelete = true;
          this.online = true;
          this.offline = true;
          this.loading = false;
        })
        .catch(err => console.error("getAllTasks--err:", err));
    },
    newImport() {
      this.$refs.c1.showDialog();
    },
    childCreate(...params) {
      console.log("params:", params);
      console.log("params[0].get(`remark`):", params[0].get("remark"));
      console.log("params[1]:", params[1]);

      return;
      // this.loading = true
      // bulkImport(params[0])
      //     .then(res => {
      //         this.dataInit()
      //     })
      //     .catch(err => console.error('bulkImport--err:', err))

      // if(this.updateMsg.isEdit){
      //   speechsegUpdate(params[0]).then(res => {
      //     console.log(res)
      //     this.updateMsg.isEdit = false
      //     this.dataInit()
      //   })
      // }else{
      //   uploadVoice(params[0]).then(res => {
      //     console.log(res)
      //     this.dataInit()
      //   })
      // }
    },
    childCreate2(params, files) {
      this.dataInit();
    },
    childCreate3(params) {
      editBatch(params).then(res => {
        utils.messageBox(res, this);
        this.dataInit();
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
    }

    // childCreate2(params,files) {
    //   console.log('childCreate2')
    //   console.log(params)

    //   let tasks = []
    //   let callback = progressEvent => {
    //     this.taskProgress.push((progressEvent) => progressEvent.loaded/progressEvent.total)
    //   }

    //   for(let k in files){

    //     let newParams = new FormData()
    //     newParams.append('filename',files[k].name)
    //     newParams.append('filedata',files[k])
    //     newParams.append('taskname',params.get('taskname'))
    //     newParams.append('recogflag',params.get('recogflag'))
    //     newParams.append('mandatoryLanguage',params.get('mandatoryLanguage'))
    //     newParams.append('importer',params.get('importer'))
    //     tasks.push(uploadBatchVoice(newParams,callback))

    //   }
    //   console.log(this.taskProgress)
    //   // this.TASK_PROGRESS(this.taskProgress)
    //   this.TASK_PROGRESS(this.taskProgress)
    //   console.log('tasks')
    //   console.log(this.$store)
    //   console.log(tasks)
    //   axios.all(tasks).then(axios.spread((res) => {
    //     console.log('axios all')
    //     console.log(res)
    //     console.log(this.$store)
    //   })).then(()=>{
    //     this.dataInit()
    //   })
    // }
  },
  beforeCreate() {},
  created() {
    this.localeText = localeText;
  },
  beforeMount() {
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
    utils.dateFormat();
    this.dataInit();
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {
    console.log("beforeDestroy -- timerArr:", window.timerArr);
    let arr = Object.assign([], window.timerArr);
    console.log("beforeDestroy -- arr:", arr);
    arr.forEach(e => clearInterval(e));
  },
  destroyed() {}
};
</script>

<style scoped lang="scss">
.importVoice {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .head {
    ul {
      display: flex;
      li {
        margin-right: 10px;
      }
    }
  }
  .table {
    .table_head {
      .left {
        display: flex;
      }
    }
  }
}
</style>
<style lang="scss">
.importVoice {
  .table_head {
    .right {
      .el-select {
        &:nth-child(1) {
          width: 80px;
          margin-right: 10px;
        }
      }
      .el-input {
        width: 200px;
        margin-right: 10px;
      }
      .search.el-input {
        width: 200px;
        margin-right: 30px;
      }
    }
  }
}
</style>