<!--
 * @Author: coco-Tang
 * @Date: 2019-06-05 09:51:11
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-11-06 19:01:53
 * @Description: 
 -->
<template>
  <div class="userManagement">
    <!-- <department-dialog ref='c2' @add='treeInit'></department-dialog> -->
    <!-- <sectionoffice-dialog ref='c3' @add='treeInit'></sectionoffice-dialog> -->
    <user-dialog @createUser="childCreate" :update-msg="updateMsg" ref="compUser"></user-dialog>

    <div class="table">
      <div class="table_head">
        <div class="left">
          <span>用户管理</span>
        </div>
        <div class="right">
          <span class="title">账号</span>
          <!-- <el-select v-model="searchType" placeholder="请选择">
            <el-option
              v-for="item in searchTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
          <!-- <el-input v-model='userSearch' class='search' placeholder='请输入内容'><i slot='suffix' class='el-input__icon el-icon-search' @click='dataInit(userSearch)'></i></el-input>
          <el-button type='primary'  @click='dataInit('')'>显示全部</el-button>-->
          <el-input
            style="margin-left:10px"
            v-model="userSearch"
            clearable
            @clear="dataInit"
            class="search"
            placeholder="请输入内容"
          >
            <el-button
              @click="dataInit(userSearch)"
              class="search"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>

          <el-button type="primary" @click="newUser" class="create">新建</el-button>
          <!-- <el-button type='primary'  :disabled='edit' @click='editHandle' class='edit'>编辑</el-button> -->
          <el-button type="primary" :disabled="mydelete" @click="deleteConfirm" class="del">删除</el-button>
          <!-- <el-button type='primary'  :disabled='reset' @click='+resetConfirm' class='password'>重置密码</el-button> -->
          <!-- <el-button type='primary'  :disabled='auth' @click='authHandle' class='authority'>修改权限</el-button> -->
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
    <!-- <div class='tree'>
        <div class='title'>部门树</div>
        <el-button type='primary'  @click='createOffice' class='create'>新建处室</el-button>
        <el-button type='primary'  :disabled='update' @click='officeUpdate' class='edit'>编辑</el-button>

        <el-tree
            :data='sectionTree'
            node-key='id'
            default-expand-all
            :expand-on-click-node='false'
            @node-click='nodeHandle'>
            <span class='custom-tree-node' slot-scope='{ node, data }'>
            <span v-if='node.level===1' class='icon section'></span>
            <span v-else class='icon department'></span>
            <span>{{ node.label }}</span>
            <span class='btnGroup' v-if='data.children'>
                <el-button
                class='test'
                @click='append(data)'>
                <div class='icon append' title='新建'></div>
                </el-button>
                <el-button
                class='test'
                @click='removeSectionoffice(node, data)'>
                <div class='icon delete' title='删除'></div>
                </el-button>
            </span>
            <span class='btnGroup' v-if='!data.children'>
                <el-button
                class='test'
                @click='removeDepartment(node, data)'>
                <div class='icon delete' title='删除'></div>
                </el-button>
            </span>

            </span>
        </el-tree>  
    </div>-->
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { mapActions, mapGetters } from "vuex";
import {
  getUsers,
  createUsers,
  updateUsers,
  deleteUsers,
  resetUsers,
  resetPwd
} from "@/api/user.js";
import localeText from "../../static/localeText.json";
import axios from "axios";
import userDialog from "@/components/dialog/userDialog.vue";
import authDialog from "@/components/dialog/authDialog.vue";
import userCellOperation from "@/components/table/userCellOperation.vue";
// import departmentDialog from '@/components/dialog/departmentDialog.vue'
// import sectionofficeDialog from '@/components/dialog/sectionofficeDialog.vue'
// let id = 1000;
export default {
  name: "userManagement",
  components: {
    "ag-grid-vue": AgGridVue,
    "user-dialog": userDialog,
    "auth-dialog": authDialog
    // 'department-dialog': departmentDialog,
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
          headerName: "账号",
          editable: false,
          field: "account",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "角色",
          editable: false,
          field: "roles",
          valueFormatter: v => {
            return v.value.length
              ? v.value
                  .map(item => {
                    return item.name;
                  })
                  .join("、")
              : "无";
          },
          menuTabs: ["columnsMenuTab"]
        },
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
          headerName: "是否停用",
          editable: false,
          field: "forbidden",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.forbiddenFormatter
        },
        {
          headerName: "创建者",
          editable: false,
          field: "creator",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "创建时间",
          editable: false,
          field: "createTime",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "备注",
          editable: false,
          field: "remark",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "操作",
          editable: false,
          field: "",
          cellRendererFramework: userCellOperation,
          menuTabs: ["columnsMenuTab"],
          minWidth: 120
        }
      ],
      rowData: [],
      numbers: [],
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
      updateMsg: {
        isEdit: false,
        data: {}
      },
      updateAuth: {},
      update: true,
      selectArr: []
    };
  },
  // computed: {
  //   getComTaskId(){
  //     return this.$store.state.taskId
  //   }
  // },
  // watch: {
  //   getComTaskId(){
  //     this.taskId = this.getTaskId()

  //     let params = new URLSearchParams()
  //     params.append('taskid',this.taskId)
  //     params.append('start',0)
  //     params.append('page',1)
  //     params.append('limit',50)
  //     getTaskResult(params).then(res => {
  //       console.log('this.taskId')
  //       console.log(res)
  //     })
  //   }
  // },
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
    resetPassword(data) {
      console.log("resetPassword");
      console.log(data);
      resetPwd(data.id)
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
      this.dataInit();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
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
      this.updateMsg.isEdit = false;
      this.$refs.compUser.showDialog();
    },
    editHandle(row) {
      //   let arr = this.gridOptions.api.getSelectedRows();
      console.log("edit");
      console.log(row);
      this.updateMsg.isEdit = true;
      this.updateMsg.data = row;
      this.$refs.compUser.showDialog();
    },
    deleteConfirm() {
      this.Utils.confirmBox(this, "确定删除选中用户?", this.mydeleteHandle);
    },
    mydeleteHandle() {
      let deleteArr = [];
      // this.multipleSelection.forEach(item => {
      this.selectArr.forEach(item => {
        if (item.id) {
          deleteArr.push(item.id);
        }
      });

      let params = new URLSearchParams();
      params.append("userIds", deleteArr);

      this.loading = true;
      deleteUsers(params)
        .then(res => {
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
        })
        .then(() => {
          this.dataInit();
        })
        .catch(err => {
          console.error("deleteUsers--err:", err);
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

    // newSpeechseg() {
    //   this.centerDialogVisible = !this.centerDialogVisible
    // },

    dataInit(username = "", sectionoffice = "", department = "") {
      // this.taskId = this.getTaskId()
      // this.sectionTree = this.getSectionTree()
      // this.account = this.getAccount()
      console.log("dataInit");
      // console.log(this.sectionTree)
      // this.i = 0
      let params = new URLSearchParams();

      params.append("account", this.userSearch);
      params.append("start", (this.currentPage - 1) * this.pageSize);
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      // params.append(this.searchType,username)
      // params.append('sectionoffice',sectionoffice)
      // params.append('department',department)
      getUsers(params)
        .then(res => {
          if (res.data.records.length == 0 && this.currentPage != 1) {
            --this.currentPage;
            this.dataInit();
          }
          var data = res.data.records;
          for (var k in data) {
            data[k].number = Number(k) + 1;
            this.rowData.push(data[k]);
          }
          this.rowData = res.data.records;
          console.log("getUsers", this.rowData);
          console.log(res);
          this.totalPage = res.data.total;
          // console.log('typeof this.totalPage')
          // console.log(typeof this.totalPage)
          this.input = "";
          this.edit = true;
          this.mydelete = true;
          this.auth = true;
          this.reset = true;
          this.loading = false;

          // return getTree()
        })
        .then(() => {
          // console.log('this.gridOptions')
          // console.log(this.gridOptions)
          //   this.gridSize();
          this.selectStatus();
        })
        .catch(err => {
          console.error("getUsers--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    childUpdate(params) {
      this.loading = true;

      userChangeAuth(params)
        .then(res => {
          console.log(res);
          this.Utils.messageBox(res, this);
          this.dataInit();
        })
        .catch(err => {
          console.error("userChangeAuth--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    childCreate(params) {
      this.loading = true;

      if (this.updateMsg.isEdit) {
        updateUsers(params, this.updateMsg.data.id)
          .then(res => {
            if (res.status === 200) {
              this.$message.success("更新成功");
              this.updateMsg.isEdit = false;
              this.dataInit();
            }
          })
          .catch(err => {
            console.error("updateUsers--err:", err);
            this.$message.error(err.response.data.msg);
            this.dataInit();
          });
      } else {
        createUsers(params)
          .then(res => {
            if (res.status === 200) {
              this.$message.success("新建成功");
              this.dataInit();
            }
          })
          .catch(err => {
            console.error("createUsers--err:", err);
            this.$message.error(err.response.data.msg);
            this.dataInit();
          });
      }
    },
    treeInit() {
      getTree()
        .then(res => {
          let a = {},
            b,
            c = [];
          let data = res.data.data;
          for (let k in data) {
            a = {};
            b = [];
            for (let i in data[k].departmentDtos) {
              b.push({
                id: data[k].departmentDtos[i].id,
                label: data[k].departmentDtos[i].name,
                remark: data[k].departmentDtos[i].remark,
                leader: data[k].departmentDtos[i].leader
              });
            }
            a.label = data[k].sectionoffice.name;
            a.id = data[k].sectionoffice.id;
            a.remark = data[k].sectionoffice.remark;
            a.leader = data[k].sectionoffice.leader;
            a.children = b;
            c.push(a);
          }

          this.sectionTree = c;
          this.SECTION_TREE(this.sectionTree);
          this.sectionTree = this.getSectionTree();
        })
        .catch(err => {
          console.error("getTree--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    addDepartment(flag, name, data) {
      if (flag) {
        let params = new URLSearchParams();
        params.append("operator", this.account);
        params.append("name", name);
        params.append("sectionoffice", data.id);
        setDepartment(params)
          .then(res => {
            // console.log('setDepartment--res:', res)
            this.treeInit();
            this.dataInit();
          })
          .catch(err => {
            console.error("setDepartment--err:", err);
            this.$message.error(err.response.data.msg);
          });
      }
    },
    // addSectionoffice(flag,name){
    //   if(flag){
    //     let params = new URLSearchParams()
    //     params.append('operator','admin')
    //     params.append('name',name)
    //     setSectionoffice(params).then(res=>{
    //       console.log(res)
    //       this.treeInit()
    //       this.dataInit()
    //     })
    //   }
    // },
    createOffice() {
      this.$refs.c3.showDialog();
    },
    append(data) {
      // console.log('append')
      // console.log(data)
      this.$refs.c2.showDialog(null, data.id);
    },

    removeDepartment(node, data) {
      let params = new URLSearchParams();
      params.append("id", data.id);
      params.append("name", data.label);
      // params.append('sectionoffice',node.parent.data.id)
      deleteDepartment(params)
        .then(res => {
          this.Utils.messageBox(res, this);
          console.log(res);
          this.treeInit();
          this.dataInit();
        })
        .catch(err => {
          console.error("deleteDepartment--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    removeSectionoffice(node, data) {
      console.log(node);
      console.log(data);

      let params = new URLSearchParams();
      params.append("id", data.id);
      params.append("name", data.label);

      deleteSectionoffice(params)
        .then(res => {
          this.Utils.messageBox(res, this);
          console.log(res);
          this.treeInit();
          this.dataInit();
        })
        .catch(err => {
          console.error("deleteSectionoffice--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    nodeHandle(data, node, self) {
      console.log("nodeHandle");
      console.log(data);
      console.log(node);
      console.log(self);
      if (data.children) {
        this.dataInit("", data.id);
      } else {
        this.dataInit("", "", data.id);
      }
      this.treeData.data = data;
      this.treeData.node = node;
      this.update = false;
    },
    officeUpdate() {
      if (this.treeData.data.hasOwnProperty("children")) {
        console.log("Sectionoffice");
        console.log(this.treeData);
        this.$refs.c3.showDialog(this.treeData);
      } else {
        this.$refs.c2.showDialog(this.treeData);
      }

      // console.log(this.treeData)
      // let nodeId = this.treeData.node.parent.key
      // let params = new URLSearchParams()
      // params.append('node',nodeId)
      // params.append('loginuser',this.account)

      // sectionofficeDetail(params).then(res=>{
      //   console.log(res)
      // })
    },
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
.userManagement {
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
    .table_head {
      .right {
        display: flex;
        flex-wrap: nowrap;
        .title {
          text-align: right;
        }
        .el-select {
          &:nth-child(1) {
            .el-input {
              flex-shrink: 0;
              width: 80px;
            }
          }
        }
        .el-button {
          &:nth-child(3) {
            // border-radius: 0 4px 4px 0;
            margin-left: 10px;
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
