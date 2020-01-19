<!--
 * @Author: coco-Tang
 * @Date: 2019-06-05 09:51:11
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-12-04 17:07:08
 * @Description: 
 -->
<template>
  <div class="train-task">
    <!-- <department-dialog ref='c2' @add='treeInit'></department-dialog> -->
    <!-- <sectionoffice-dialog ref='c3' @add='treeInit'></sectionoffice-dialog> -->
    <train-task-dialog @createTask="childCreate" :update-auth="updateAuth" ref="c4"></train-task-dialog>

    <log-dialog ref="c1" :update-msg="updateMsg"></log-dialog>

    <div class="table">
      <div class="table_head">
        <div class="top">
          <span style="font-weight: 700;">任务列表</span>
        </div>
        <div class="bottom">
          <div class="items item-1">
            <div class="flex">
              <el-radio-group v-model="libraryType" @change="toogleLibrary">
                <el-radio-button
                  v-for="item in languageLibrary"
                  :key="item.value"
                  :label="item.label"
                ></el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="items item-4" style="margin-right:0px">
            <!-- <el-button type="primary" @click="newImport" class="create">上传</el-button>
            <el-button type="primary" :disabled="mydelete" @click="deleteConfirm" class="del">删除</el-button>-->
            <el-button type="primary" @click="newUser" class="create">新建任务</el-button>
            <!-- <el-button type="primary" :disabled="mydelete" @click="deleteConfirm" class="del">删除</el-button> -->
          </div>
        </div>
      </div>
      <div class="table_content" v-loading="loading" element-loading-text="加载中">
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
          :columnDefs="columnDefs"
          :rowData="rowData"
          :localeText="localeText"
          @gridReady="onGridReady"
          @selection-changed="rowSelected"
          :columnVisible="hideColum"
          :suppressColumnVirtualisation="suppressColumnVirtualisation"
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
// import { getRoles, createRoles, updateRoles, deleteRoles } from "@/api/user.js";
import { getTrainTask, createTrainTask } from "@/api/train.js";
import localeText from "../../static/localeText.json";
import TrainTaskDialog from "@/components/dialog/TrainTaskDialog.vue";
import LogDialog from "@/components/dialog/LogDialog.vue";
import trainTaskCellOperation from "@/components/table/trainTaskCellOperation.vue";
import {
  SEARCH_LANGUAGE_TYPE,
  GENDER_TYPE1,
  VOICE_TYPE,
  UNION_TYPE,
  LANGUAGE_LIBRARY_TYPE
} from "@/constant";
import { formatTime } from "@/utils";

export default {
  name: "role-manage",
  components: {
    "ag-grid-vue": AgGridVue,
    "train-task-dialog": TrainTaskDialog,
    "log-dialog": LogDialog
    // 'sectionoffice-dialog': sectionofficeDialog,
  },
  data() {
    return {
      multipleSelection: [],
      treeData: {
        data: null,
        node: null
      },
      account: "",
      sectionTree: [],
      loading: false,
      file: {},
      uploadData: {
        code: "ddd",
        name: "ddd",
        langname: "汉语",
        threshold: "60",
        sectionoffice: "",
        department: "",
        assignee: "",
        category: 0,
        subcate: "",
        telrules: ["*"],
        datasource: ["000000"],
        remark: ""
      },
      centerDialogVisible: false,
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

      columnDefs: [
        {
          headerName: "序号",
          editable: false,
          field: "number",
          menuTabs: ["columnsMenuTab"],
          headerCheckboxSelection: true,
          checkboxSelection: true
          // valueFormatter: this.numberFormatter,
        },
        {
          headerName: "模型类型",
          editable: false,
          field: "type",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.typeFormatter
        },
        // {
        //   headerName: "任务",
        //   editable: false,
        //   field: "permissions",
        //   valueFormatter: v => {
        //     return v.value.length
        //       ? v.value
        //           .map(item => {
        //             return item.name;
        //           })
        //           .join("、")
        //       : "无";
        //   },
        //   menuTabs: ["columnsMenuTab"]
        // },
        // {headerName: '姓名', editable: false, field: 'username',menuTabs: ['columnsMenuTab']},
        // {
        //   headerName: '级别',
        //   editable: false,
        //   field: 'level',
        //   valueFormatter: this.levelFormatter,
        //   menuTabs: ['columnsMenuTab']
        // },
        // {
        //   headerName: '处室',
        //   editable: false,
        //   field: 'sectionoffice',
        //   valueFormatter: this.sectionofficeFormatter,
        //   menuTabs: ['columnsMenuTab']
        // },
        // {
        //   headerName: '科室',
        //   editable: false,
        //   field: 'department',
        //   valueFormatter: this.departmentFormatter,
        //   menuTabs: ['columnsMenuTab']
        // },
        {
          headerName: "状态",
          editable: false,
          field: "state",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.stateFormatter
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
          valueFormatter: v => {
            return v.value ? v.value : "无";
          }
        },
        // {
        //   headerName: "结束时间",
        //   editable: false,
        //   field: "lastUpdateTime",
        //   menuTabs: ["columnsMenuTab"]
        //   // valueFormatter: v => {
        //   //   return dateFormat(v.value);
        //   // }
        // },
        {
          headerName: "训练用时",
          editable: false,
          field: "costTime",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: v => {
            return formatTime(v.value);
          }
        },
        {
          headerName: "操作",
          editable: false,
          field: "",
          minWidth: 200,
          cellRendererFramework: trainTaskCellOperation,
          menuTabs: ["columnsMenuTab"]
        }
      ],
      rowData: [],
      localeText: {},

      userSearch: "",
      edit: true,
      mydelete: true,
      reset: true,
      auth: true,
      searchType: "account",
      searchTypeOptions: [
        {
          label: "账号",
          value: "account"
        },
        {
          label: "姓名",
          value: "username"
        }
      ],
      updateAuth: {
        ifUpdate: false,
        data: {}
      },
      updateMsg: {
        isShow: false,
        data: {}
      },
      update: true,
      selectArr: [],
      libraryType: "性别库",
      languageLibrary: LANGUAGE_LIBRARY_TYPE,
      type: "gender"
    };
  },
  watch: {},
  created() {
    this.localeText = localeText;
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
    // this.gridOptions.api.sizeColumnsToFit()
    this.Utils.dateFormat();
    this.dataInit();
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    ...mapActions(["TASK_ID", "QL_DATA", "SECTION_TREE"]),
    ...mapGetters(["getTaskId", "getSectionTree", "getAccount"]),
    stateFormatter(v) {
      switch (v.value) {
        case "created":
          return "创建";
        case "waiting":
          return "排队中";
        case "submitted":
          return "提交";
        case "running":
          return "检索中";
        case "completed":
          return "完成";
        case "failed":
          return "失败";
      }
    },
    typeFormatter(v) {
      switch (v.value) {
        case "voiceDetection":
          return "语音";
        case "gender":
          return "性别";
        case "language":
          return "语种";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelection(val, row) {
      this.numbers = val;
      this.mydelete = !(val.length > 0);
    },
    // 选中背景色
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      if (this.multipleSelection.some(item => item.index === rowIndex)) {
        return "warning-row";
      }
      return "";
    },
    parentMethod() {
      console.log(this.gridOptions);
      this.$refs.compUser.quickRecgnizeHandle();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.numbers = [];
      this.dataInit();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.numbers = [];
      this.dataInit();
    },
    sectionofficeFormatter(v) {
      // console.log('sectionofficeFormatter v')
      // console.log(v)
      for (let k in this.sectionTree) {
        // console.log(this.sectionTree[k])
        if (v.value === this.sectionTree[k].id) {
          return this.sectionTree[k].label;
        }
      }
    },
    departmentFormatter(v) {
      // console.log('departmentFormatter v')
      // console.log(v)
      // console.log(this.sectionTree)
      for (let k in this.sectionTree) {
        if (v.data.sectionoffice === this.sectionTree[k].id) {
          for (let ck in this.sectionTree[k].children) {
            if (v.value === this.sectionTree[k].children[ck].id) {
              return this.sectionTree[k].children[ck].label;
            }
          }
        }
      }
    },
    levelFormatter(v) {
      // console.log('levelFormatter v')
      // console.log(v)
      switch (v.value) {
        case 1:
          return "系统管理员";
          break;
        case 2:
          return "高级管理员";
          break;
        case 3:
          return "业务管理员";
          break;
        case 4:
          return "操作员";
          break;
      }
    },
    forbiddenFormatter(v) {
      return v.value ? "是" : "否";
    },
    lengthFormatter(v) {
      // console.log('lengthFormatter')
      // console.log(v)
      if (v.value != 0) {
        return v.value;
      }
      return v.data.end - v.data.start;
    },
    onGridReady() {
      this.gridOptions.api.sizeColumnsToFit();
      // utils.autosize(this.gridOptions)
      // this.localeText = localeText
    },
    rowSelected(v) {
      console.log(`------------------------------`);
      console.log(this.gridOptions.api.getSelectedRows());
      console.log(`------------------------------`);

      let arr = this.gridOptions.api.getSelectedRows();
      // console.log(this.gridOptions.api.getSelectedRows().length!=0)

      //edit
      arr.length === 1 ? (this.edit = false) : (this.edit = true);
      arr.length === 1 ? (this.auth = false) : (this.auth = true);
      arr.length >= 1 ? (this.reset = false) : (this.reset = true);
      arr.length >= 1 ? (this.mydelete = false) : (this.mydelete = true);

      if (arr[0]) {
        this.updateAuth.auth = arr[0].auth;
        this.updateAuth.account = arr[0].account;
      }

      this.selectArr = this.gridOptions.api.getSelectedRows();
      //delete
      // this.deleteJudge(arr) ? this.mydelete = false : this.mydelete = true
    },

    newUser() {
      this.updateAuth.ifUpdate = false;
      this.$refs.c4.showDialog();
    },
    editHandle(row) {
      this.updateAuth.ifUpdate = true;
      this.updateAuth.data = row;
      this.$refs.c4.showDialog();
    },
    deleteConfirm() {
      this.Utils.confirmBox(this, "确定删除选中任务?", this.mydeleteHandle);
    },
    mydeleteHandle() {
      return
      let deleteArr = [];
      this.multipleSelection.forEach(item => {
        if (item.id) {
          deleteArr.push(item.id);
        }
      });

      let params = new URLSearchParams();
      params.append("roleIds", deleteArr);
      this.loading = true;
      deleteRoles(params)
        .then(res => {
          console.log("deleteRoles", res);
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
        })
        .then(() => {
          this.dataInit();
        })
        .catch(err => {
          console.error("deleteRoles--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    resetConfirm() {
      this.Utils.confirmBox(this, "确定重置密码?", this.resetHandle);
    },
    resetHandle() {
      let arr = this.gridOptions.api.getSelectedRows();
      let resetArr = [];

      for (let k in arr) {
        resetArr.push(arr[k].account);
      }
      console.log("resetHandle");
      // let params = new URLSearchParams()
      // params.append('accounts', resetArr)

      // this.loading = true
      resetUsers(resetArr)
        .then(res => {
          if (res.status === 200) {
            this.$message.success("重置成功");
          }
        })
        .then(() => {
          this.dataInit();
        })
        .catch(err => {
          console.error("resetUsers--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    authHandle() {
      this.$refs.c4.showDialog();
    },

    dataInit(username = "", sectionoffice = "", department = "") {
      this.rowData = [];
      // this.taskId = this.getTaskId()
      // this.sectionTree = this.getSectionTree()
      // this.account = this.getAccount()
      console.log("dataInit");
      // console.log(this.sectionTree)
      // this.i = 0
      let params = new URLSearchParams();

      // params.append('loginuser',this.account)
      params.append("start", (this.currentPage - 1) * this.pageSize);
      params.append("limit", this.pageSize);
      params.append("type", this.type);
      // params.append(this.searchType,username)
      // params.append('sectionoffice',sectionoffice)
      // params.append('department',department)
      getTrainTask(params)
        .then(res => {
          console.log("getTrainTask");
          console.log(res);
          if (res.data.length == 0 && this.currentPage != 1) {
            --this.currentPage;
            this.dataInit();
          }
          var data = res.data.records;
          this.totalPage = res.data.total;
          for (var k in data) {
            data[k].number = Number(k) + 1;
            this.rowData.push(data[k]);
          }
          // this.rowData = res.data;
          // console.log("getRoles", this.rowData);
          // this.input = "";
          // this.edit = true;
          // this.mydelete = true;
          // this.auth = true;
          // this.reset = true;
          // this.online = true;
          // this.offline = true;
          // this.loading = false;
        })
        .catch(err => {
          console.error("getRoles--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    toogleLibrary(v) {
      console.log("toogleLibrary");
      console.log(v);
      this.type = LANGUAGE_LIBRARY_TYPE.find(item => item.label === v);
      switch (v) {
        case "性别库":
          // this.choiceLable = "性别";
          // this.choiceOptions = GENDER_TYPE1;
          // this.choiceValue = "男";
          // this.typeValue = "";
          this.type = "gender";
          break;
        case "语种库":
          // this.choiceLable = "语种";
          // this.choiceOptions = SEARCH_LANGUAGE_TYPE1;
          // this.choiceValue = "";
          // this.typeValue = "engl";
          this.type = "language";
          break;
        default:
          // this.choiceLable = "语音";
          // this.choiceOptions = VOICE_TYPE;
          // this.choiceValue = "有效音";
          // this.typeValue = "valid";
          this.type = "voiceDetection";
      }
      this.dataInit();
    },
    childCreate(params) {
      createTrainTask(params).then(res => {
        console.log("createTrainTask");
        console.log(res);
      });
    },
    newImport() {},
    gridSize() {
      // let arr = []
      // this.gridOptions.columnApi.getAllColumns().forEach(col => {
      //   arr.push(col.colId)
      // })
      // arr.splice(arr.length-1,1)
      // this.gridOptions.columnApi.autoSizeColumns(arr)
      this.gridOptions.api.sizeColumnsToFit();
      // utils.autosize(this.gridOptions)
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
      console.log("selectStatus");
      // this.gridOptions.api.selectAll()
      // // console.log(this.gridOptions.api.getRowNode(1))
      if (this.selectArr.length != 0) {
        this.gridOptions.api.forEachNode((node, index) => {
          this.selectArr.forEach((item, i) => {
            if (item.id === node.data.id) {
              node.setSelected(true);
              // this.gridOptions.api.getRowNode(index).setSelected(true)
            }
          });
        });
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.train-task {
  width: 100%;
  height: 100%;
  display: flex;
  // flex-direction: column;
  .head {
    ul {
      display: flex;
      li {
        margin-right: 10px;
      }
    }
  }
  .table {
    // flex-shrink: 0;
    // .table_head {
    //   .right {
    //     display: flex;
    //     flex-wrap: nowrap;
    //     .el-select {
    //       &:nth-child(1) {
    //         .el-input {
    //           flex-shrink: 0;
    //           width: 80px;
    //         }
    //       }
    //     }
    //     .el-button {
    //       &:nth-child(3) {
    //         // border-radius: 0 4px 4px 0;
    //         margin-left: 10px;
    //       }
    //     }
    //   }
    // }
    .table_head {
      display: flex;
      flex-direction: column;
      .top {
      }
      .bottom {
        display: flex;
        flex-direction: row;
        height: 40px;
        line-height: 40px;
        justify-content: flex-end;
        .item-1 {
          margin-right: auto;
        }
        .items {
          .el-select {
            margin: 0 10px !important;
          }
        }
      }
    }
  }
  .tree {
    flex-shrink: 0;
    width: 250px;
    // margin-top: 20px;
    margin-left: 10px;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
    .title {
      font-weight: 700;
      // margin-bottom: 20px;
      margin: 20px 0 30px;
    }
  }
  .custom-tree-node {
    &:hover {
      .icon.append,
      .icon.delete {
        display: block;
      }
    }
    // .icon.append{
    //   display: none;
    //   width: 22px;
    //   height: 22px;
    //   background: url('../../static/images/添加科室.png');
    // }
    // .icon.append:hover{
    //   // display: block;
    //   background: url('../../static/images/添加科室鼠标移入.png');
    // }
    // .icon.delete{
    //   display: none;
    //   width: 22px;
    //   height: 22px;
    //   background: url('../../static/images/删除.png');
    // }
    // .icon.delete:hover{
    //   // display: block;
    //   background: url('../../static/images/删除鼠标移入.png');
    // }
    // .icon.section{
    //   display: inline-block;
    //   width: 22px;
    //   height: 22px;
    //   background: url('../../../../../static/images/处.png');
    // }
    // .icon.department{
    //   display: inline-block;
    //   width: 22px;
    //   height: 22px;
    //   background: url('../../../../../static/images/科.png');
    // }
    .icon.test {
      font-size: 18px;
      color: orange;
    }
  }
}
</style>

<style lang="scss">
.train-task {
  .table {
    .table_head {
      .top {
        margin: 10px 0;
      }
      .bottom {
        .radiogroup {
          height: 30px;
          line-height: 30px;
          .el-radio-button__inner {
            padding: 7px 10px;
          }
        }
        .el-select {
          width: 100px;
        }
      }
    }
  }
}
</style>