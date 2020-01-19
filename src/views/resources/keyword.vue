<!--
 * @Author: coco-Tang
 * @Date: 2019-09-30 14:27:58
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-28 15:55:40
 * @Description: 
 -->
<template>
  <div class="keywords">
    <keyword-dialog @setKeyword="submitKeyword" :update-msg="updateMsg" ref="c1"></keyword-dialog>
    <!-- <exportDialog @setExport="childCreate2" :export-msg="exportMsg" ref="c2"></exportDialog> -->
    <div class="table">
      <div class="table_head">
        <div class="left">
          <span>关键词管理</span>
        </div>
        <div class="right" @keyup.enter="searchList(keywordSearch)">
          <el-input
            class="firstitem"
            v-model="keywordSearch"
            clearable
            @clear="getList()"
            placeholder="请输入内容"
          >
            <el-button
              @click="getList(keywordSearch)"
              class="search"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>

          <el-button
            style="margin-left:10px"
            type="primary"
            @click="newKeywordHandler"
            class="create"
          >新建</el-button>
          <!-- <el-button type="primary" :disabled="!edit" @click="editHandler" class="edit">编辑</el-button> -->
          <el-button
            type="primary"
            :disabled="mydelete"
            @click="deleteConfirmHandler"
            class="del"
          >删除</el-button>
          <el-button
            type="primary"
            :disabled="isOnline"
            @click="onlineConfirmHandler"
            class="online"
          >上线</el-button>
          <!-- <el-button type="primary"  :disabled="online" @click="onlineHandle">上线</el-button> -->
          <el-button
            type="primary"
            :disabled="isOffline"
            @click="offlineConfirmHandler"
            class="offline"
          >下线</el-button>
          <!-- <el-button type="primary"  @click="batchImportHandler" class='batchNew'>批量新建</el-button> -->
          <!-- <el-button type="primary"  @click="exportExcelHandler" class='export'>导出</el-button> -->
        </div>
      </div>
      <div class="table_content">
        <ag-grid-vue
          style="width: 100%; height: "
          class="ag-grid ag-theme-material"
          :gridOptions="gridOptions"
          :showToolPanel="showToolPanel"
          :enableColResize="enableColResize"
          :headerHeight="headerHeight"
          :rowHeight="rowHeight"
          :enableFilter="enableFilter"
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
          :statusBar="statusBar"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :localeText="localeText"
          @gridReady="onGridReady"
          @selection-changed="rowSelected"
          :columnVisible="hideColum"
          :suppressColumnVirtualisation="suppressColumnVirtualisation"
          :suppressCopyRowsToClipboard="suppressCopyRowsToClipboard"
          @cell-clicked="cellClicked"
        ></ag-grid-vue>
      </div>
      <div class="table_pagination" :class="{ 'pager-hidden' : !totalPage || totalPage <= 15 }">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 25, 50, 100,200,500,1000]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { mapActions, mapGetters } from "vuex";
import {
  getKeywords,
  keywordOffline,
  keywordOnline,
  keywordDelete,
  keywordCreate,
  keywordUpdate,
  keywordExportUrl
} from "@/api/keywords.js";
import localeText from "../../static/localeText.json";
// import axios from 'axios'
import keywordDialog from "@/components/dialog/keywordDialog.vue";
import exportDialog from "@/components/dialog/exportDialog.vue";
import KeywordCellOperation from "@/components/table/KeywordCellOperation.vue";

export default {
  name: "keywords",
  data() {
    return {
      totalPage: 0,
      currentPage: 1,
      pageSize: 15,
      taskId: "",
      value2: "",

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
      statusBar: null,

      columnDefs: [
        {
          headerName: "序号",
          editable: false,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          field: "number",
          menuTabs: ["columnsMenuTab"],
          minWidth: 120
          // valueFormatter: this.numberFormatter,
        },
        {
          headerName: "关键词",
          editable: false,
          field: "keyword",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "语种",
          editable: false,
          field: "language",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "中标阈值",
          editable: false,
          field: "threshold",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "承办者",
          editable: false,
          field: "undertaker",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "上线状态",
          editable: false,
          field: "onlineState",
          valueFormatter: function(params) {
            return params.value ? "上线" : "下线";
          },
          cellStyle: function(params) {
            return { color: params.value ? "green" : "red" };
          },
          menuTabs: ["columnsMenuTab"],
          tooltip: () => {
            return "单击修改上线状态";
          }
        },
        // {
        //   headerName: "策略",
        //   editable: false,
        //   field: "telrules",
        //   valueFormatter: this.telrulesFormatter,
        //   menuTabs: ["columnsMenuTab"]
        // },
        {
          headerName: "匹配平台",
          editable: false,
          field: "matchPlatform",
          valueGetter: this.matchPlatformFormatter,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "备注",
          editable: false,
          field: "remark",
          tooltip: v => {
            return v.value;
          },
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "创建者",
          editable: false,
          field: "creator",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "权限",
          editable: false,
          field: "type",
          valueGetter: this.typeFormatter,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "创建时间",
          editable: false,
          field: "createTime",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "案件",
          editable: false,
          field: "cases",
          hide: true,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "操作",
          editable: false,
          field: "",
          cellRendererFramework: KeywordCellOperation,
          menuTabs: ["columnsMenuTab"]
        }
      ],
      rowData: [],
      localeText: {},

      keywordSearch: "",
      edit: true,
      mydelete: true,
      isOnline: true,
      isOffline: true,
      updateMsg: {
        isEdit: false,
        data: {},
        batch: false
      },
      exportMsg: {
        currentPage: "",
        pageSize: "",
        totalPage: "",
        list: false
      },
      selectArr: []
    };
  },
  components: {
    "ag-grid-vue": AgGridVue,
    "keyword-dialog": keywordDialog,
    exportDialog: exportDialog
  },
  methods: {
    ...mapGetters(["getPlatform"]),

    parentMethod() {
      this.$refs.c1.quickRecgnizeHandle();
    },

    exportExcelHandler() {
      this.exportMsg.currentPage = this.currentPage;
      this.exportMsg.pageSize = this.pageSize;
      this.exportMsg.totalPage = this.totalPage;

      this.$refs.c2.showDialog();
    },
    childCreate2(params) {
      console.log("setExport", params);
      return;
      let url = keywordExportUrl + params + `&keyword=`;

      console.log(url);
      window.location.href = url;
    },

    // startHandle() {

    //   var timer = setInterval(() =>{

    //     this.schedule += 10
    //     if(this.schedule>=100){
    //       clearInterval(timer)
    //       this.schedule = 100
    //     }

    //   },500)
    // },

    telrulesFormatter(v) {
      // console.log(v)
      // return v.value.join(",")
      return v.value;
    },
    typeFormatter(v) {
      if (v.data.type == 1) {
        return "公有";
      } else {
        return "私有";
      }
    },
    matchPlatformFormatter(v) {
      // for(let k in this.platformOptions){
      //   if(this.platformOptions[k].value === v.data.datasource[0]){
      //     return this.platformOptions[k].label
      //   }
      // }

      let str = "";
      // console.log('v.data.datasource')
      // console.log(typeof v.data.datasource)
      // console.log(v.data.datasource)
      // console.log(this.platformOptions)
      // console.log(v.data.matchPlatform)

      for (let k in v.data.matchPlatform) {
        for (let key in this.platformOptions) {
          if (this.platformOptions[key].value === v.data.matchPlatform[k]) {
            str += this.platformOptions[key].label + "、";
          }
        }
      }
      return str.substring(0, str.length - 1);
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
    /* ----------------分页start----------- */
    handleSizeChange(v) {
      this.pageSize = v;
      this.getList();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.getList();
    },
    /* ----------------分页end----------- */
    //获取关键词列表
    getList() {
      let params = new URLSearchParams();
      params.append("keyword", this.keywordSearch);
      // params.append("language", "");//后台预留字段，可不传参
      params.append("start", (this.currentPage - 1) * this.pageSize);
      params.append("limit", this.pageSize);
      // console.log('params',params);
      this.dataAjax(params);
      this.isOnline = true;
      this.edit = true;
      this.mydelete = true;
      this.isOffline = true;
    },
    //搜索列表
    searchList(params) {
      this.keywordSearch = params;
      this.getList();
    },
    dataAjax(params) {
      getKeywords(params).then(res => {
        if (res.data.records.length == 0 && this.currentPage != 1) {
          --this.currentPage;
          this.getList();
        }
        let { start, limit, total, records } = res.data;
        this.rowData = records.map((item, idx) => {
          return Object.assign({ ...item, number: idx + 1 });
        });
        this.totalPage = total;
      });
    },
    /* ----------------按钮操作start----------- */
    rowSelected(v) {
      let arr = this.gridOptions.api.getSelectedRows();
      //可编辑条件(只选中一条并且是上线状态)
      this.edit = !(arr.length === 1 && !arr[0]["onlineState"]);

      //可下线条件(选中行的状态中无下线状态)
      this.isOffline = !this.onAndOffHandler(arr, true);

      //可上线条件(选中行的状态中无上线状态)
      this.isOnline = !this.onAndOffHandler(arr, false);

      //可删除条件(有选中行并且选中行中无上线状态)
      this.mydelete = !(
        arr.length &&
        !Object.values(arr).some(item => {
          return item.onlineState;
        })
      );

      this.selectArr = arr
        .map(item => {
          return item.id;
        })
        .join(",");
    },
    /**
     * 判断上下线按钮状态
     * @method onAndOffHandler
     * @param {Array, Boolean}
     * @return {Boolean}
     */
    onAndOffHandler(arr, status) {
      return Object.values(arr).every(item => item.onlineState === status);
    },
    deleteConfirmHandler() {
      this.Utils.confirmBox(this, "确定删除选中关键词?", this.mydeleteHandle);
    },
    mydeleteHandle() {
      let keywords = this.selectArr;
      keywordDelete({ keywords }).then(res => {
        if (res.status === 200) {
          this.Utils.messageBox({
            statusText:'删除成功',
            status: 200
          }, this);
          this.getList();
        }
      });
    },
    onlineConfirmHandler() {
      this.Utils.confirmBox(this, "确定上线选中关键词?", this.onlineHandle);
    },
    onlineHandle() {
      let keywordIds = this.selectArr;
      keywordOnline({ keywordIds }).then(res => {
        // console.log(res.data)
        this.getList();
      });
    },
    offlineConfirmHandler() {
      this.Utils.confirmBox(this, "确定下线选中关键词?", this.offlineHandle);
    },
    offlineHandle() {
      let keywordIds = this.selectArr;
      keywordOffline({ keywordIds }).then(res => {
        // console.log(res)
        this.getList();
      });
    },
    editHandler() {
      let arr = this.gridOptions.api.getSelectedRows();
      console.log("editHandler", arr[0]);
      this.updateMsg.ifUpdate = true;
      this.updateMsg.data = arr[0];
      this.$refs.c1.showDialog();
    },
    newKeywordHandler() {
      this.$refs.c1.showDialog();
    },
    batchImportHandler() {
      this.updateMsg.batch = true;
      this.$refs.c1.showDialog();
    },
    submitKeyword(params) {
      this.loading = true;
      let keywordId = params.keywordId;
      delete params.keywordId;
      console.log("submitKeyword", params);
      if (this.updateMsg.isEdit) {
        console.log("edit");
        keywordUpdate(keywordId, new URLSearchParams(params))
          .then(res => {
            // console.log(res);
            // utils.messageBox(res, this);

            if (res.status === 200) {
              this.$message("修改成功");
              this.updateMsg.isEdit = false;
              this.getList();
            }
          })
          .catch(err => {
            console.error("fixSpeaker--err:", err);
            this.$message.error(err.response.data.msg);
          });
      } else {
        keywordCreate(params)
          .then(res => {
            // utils.messageBox(res, this);
            // console.log(res);
            // this.getList();
            if (res.status === 200) {
              this.$message("新建成功");
              this.getList();
            }
          })
          .catch(err => {
            console.error("fixSpeaker--err:", err);
            this.$message.error(err.response.data.msg);
          });
      }
    },
    /* ----------------按钮操作end----------- */
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
    //单元格内修改上下线状态
    cellClicked(e) {
      console.log("cellClicked");
      // console.log(e);
      if (e.colDef.field == "onlineState") {
        this.gridOptions.api.deselectAll();
        e.node.setSelected(true);
        if (e.value) {
          this.offlineConfirmHandler();
        } else {
          this.onlineConfirmHandler();
        }
      }
    }
  },
  beforeCreate() {},
  created() {
    this.getList();
  },
  beforeMount() {
    this.localeText = localeText;
    this.statusBar = { statusPanels: [] };
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
  },
  mounted() {
    this.platformOptions = this.getPlatform();
    // this.kInit()
    // utils.dateFormat()
    // this.getList()
    // console.log(this)
    // window.onresize = () => {
    //   // utils.autosize(this.gridOptions)
    //   this.gridOptions.api.sizeColumnsToFit()
    //   console.log(window.innerWidth)
    //   console.log(window.innerHeight)
    // }
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
.keywords {
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
      .right {
        display: flex;
      }
    }
  }
}
</style>
