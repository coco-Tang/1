<!--
 * @Author: coco-Tang
 * @Date: 2019-10-17 09:34:14
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-25 11:10:57
 * @Description: 
 -->
<template>
  <div class="system_log">
    <div class="table">
      <div class="table_head">
        <div class="foo">
          <span style="font-weight: 700">日志管理</span>
          <div class="item-1">
            <div class="flex">
              <span class="title">操作</span>
              <el-input v-model="subtype" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="item-2">
            <div class="flex">
              <span class="title">用户</span>
              <el-input readonly v-model="username" @focus="userParentMethod" placeholder="请选择用户"></el-input>
              <user-select @setUser="getUser" ref="c3"></user-select>
            </div>
          </div>
          <div class="item-3">
            <div class="flex">
              <span class="title">时间选择</span>
              <el-date-picker
                :clearable="false"
                v-model="timrPicker"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="-"
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
          </div>
          <div class="item-4" style="margin-right:0px">
            <el-button type="primary" @click="dataInit" class="query">搜索</el-button>
          </div>
        </div>
        <!-- <div class="left">
          <span>日志管理</span>
        </div>
        <div class="right">
          <ul class='wrapper'>
            <li>
              <span class="title">检索词</span>
              <el-input v-model="subtype" placeholder="请输入内容"></el-input>
            </li>
            <li>
              <span class="title">用户</span>
              <el-input readonly v-model="username" @focus="userParentMethod" placeholder="请选择用户"></el-input>
              <user-select @setUser="getUser" ref="c3"></user-select>
            </li>
            <li>
              <span class="title">时间选择</span>
              <el-date-picker
                :clearable="false"
                v-model="timrPicker"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                @change="timeChange">
              </el-date-picker>
            </li>
            <li style="margin-right:0px">
              <el-button type="primary" @click="dataInit" class='query'>搜索</el-button>
            </li>
          </ul>
        </div>-->
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
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { mapActions, mapGetters } from "vuex";
import * as utils from "@/utils/index";
import { getLog } from "@/api/system.js";
import localeText from "../../static/localeText.json";
import userSelect from "@/components/userSelect.vue";

export default {
  name: "system_log",
  data() {
    return {
      loading: false,
      totalPage: 0,
      currentPage: 1,
      pageSize: 15,
      taskId: "",
      value2: "",
      subtype: "",

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

      columnDefs: [
        {
          headerName: "序号",
          width: 60,
          editable: false,
          // headerCheckboxSelection: true,
          // checkboxSelection: true,
          field: "number",
          menuTabs: ["columnsMenuTab"]
          // valueFormatter: this.numberFormatter,
        },
        {
          headerName: "操作用户",
          editable: false,
          field: "user",
          minWidth: 100,
          menuTabs: ["columnsMenuTab"]
        },

        {
          headerName: "操作描述",
          editable: false,
          field: "content",
          // width: 400,
          suppressSizeToFit: true,
          tooltip: this.cellTitle,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "参数",
          editable: false,
          field: "parameter",
          menuTabs: ["columnsMenuTab"],
          hide: true
        },
        {
          headerName: "ip",
          editable: false,
          field: "ip",
          menuTabs: ["columnsMenuTab"]
        },

        // {headerName: '模块名称', editable: false, field: 'type',menuTabs: ['columnsMenuTab']},
        // {headerName: '检索词', editable: false, field: 'subtype',menuTabs: ['columnsMenuTab']},

        {
          headerName: "方法名",
          editable: false,
          field: "classMethod",
          menuTabs: ["columnsMenuTab"],
          hide: true
        },
        {
          headerName: "操作时间",
          editable: false,
          field: "createTime",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.createTimeFormatter
        }
        // {
        //   headerName: '平台',
        //   editable: false,
        //   field: 'spyid',
        //   valueFormatter: this.datasourceFormatter,
        //   menuTabs: ['columnsMenuTab']
        // }
      ],
      rowData: [],
      localeText: {},

      type: "应用",
      typeOptions: [
        {
          label: "应用",
          value: "应用"
        },
        {
          label: "系统",
          value: "系统"
        },
        {
          label: "资源",
          value: "资源"
        }
      ],
      platform: "",
      platformOptions: [],
      shortcut: -1,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      timrPicker: [],
      username: "",
      username1: [],
      usernameArr: []
    };
  },
  components: {
    "ag-grid-vue": AgGridVue,
    "user-select": userSelect
    // statusComponent: statusComponent,
    // levelComponent: levelComponent,
    // targetComponent:targetComponent
  },
  computed: {
    getTimrPicker() {
      return this.timrPicker;
    }
  },
  watch: {
    getTimrPicker() {
      if (!this.timrPicker) {
        this.timrPicker = [];
        this.dateInit();
      }
    }
  },
  methods: {
    ...mapActions(["TASK_ID", "QL_DATA"]),
    ...mapGetters(["getTaskId", "getPlatform"]),

    createTimeFormatter(v) {
      // console.log('createTimeFormatter')
      // console.log(v)
      let d = new Date(v.value).format("yyyy-MM-dd hh:mm:ss");
      return d;
    },
    parentMethod() {
      console.log(this.gridOptions);
      this.$refs.c1.quickRecgnizeHandle();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.dataInit();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.dataInit();
    },
    timeChange() {
      console.log(this.timrPicker);
      this.shortcut = -1;
      if (this.timrPicker) {
        this.timrPicker[0] = new Date(this.timrPicker[0]).format(
          "yyyy-MM-dd hh:mm:ss"
        );
        this.timrPicker[1] = new Date(this.timrPicker[1]).format(
          "yyyy-MM-dd hh:mm:ss"
        );
      } else {
        this.timrPicker = [];
        this.dateInit();
      }
    },
    timeChange1(idx) {
      const end = new Date();
      switch (idx) {
        case 1:
          this.shortcut = 1;
          this.$set(
            this.timrPicker,
            0,
            new Date(end.getTime() - 3600 * 1000 * 24 * 1).format(
              "yyyy-MM-dd hh:mm:ss"
            )
          );
          this.$set(
            this.timrPicker,
            1,
            new Date(end).format("yyyy-MM-dd hh:mm:ss")
          );
          break;
        case 7:
          this.shortcut = 7;
          this.$set(
            this.timrPicker,
            0,
            new Date(end.getTime() - 3600 * 1000 * 24 * 7).format(
              "yyyy-MM-dd hh:mm:ss"
            )
          );
          this.$set(
            this.timrPicker,
            1,
            new Date(end).format("yyyy-MM-dd hh:mm:ss")
          );
          break;
        case 30:
          this.shortcut = 30;
          this.$set(
            this.timrPicker,
            0,
            new Date(end.getTime() - 3600 * 1000 * 24 * 30).format(
              "yyyy-MM-dd hh:mm:ss"
            )
          );
          this.$set(
            this.timrPicker,
            1,
            new Date(end).format("yyyy-MM-dd hh:mm:ss")
          );
          break;
      }
    },
    dateInit() {
      // if(!this.timrPicker){
      //   this.timrPicker = []
      // }
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
      // this.timrPicker[0] = new Date(start).format("yyyy-MM-dd hh:mm:ss")
      // this.timrPicker[1] = new Date(end).format("yyyy-MM-dd hh:mm:ss")
      this.$set(
        this.timrPicker,
        0,
        new Date(start).format("yyyy-MM-dd hh:mm:ss")
      );
      this.$set(
        this.timrPicker,
        1,
        new Date(end).format("yyyy-MM-dd hh:mm:ss")
      );
    },

    cellTitle(v) {
      // console.log(v)
      return v.value;
    },
    userParentMethod() {
      // console.log(111)
      this.$refs.c3.showDialog();
    },
    datasourceFormatter(v) {
      // console.log(v)
      for (let k in this.platformOptions) {
        if (this.platformOptions[k].value == v.value) {
          return this.platformOptions[k].label;
        }
      }
    },

    onGridReady() {
      // this.gridOptions.api.sizeColumnsToFit()
      // utils.autosize(this.gridOptions)
      // this.localeText = localeText
      this.gridSize();
      // this.gridReady = true
      // this.gridOptions.api.sizeColumnsToFit()

      // console.log('onGridReady')
      // console.log(this.gridOptions.columnApi.getAllColumns())
    },
    getUser(usernameArr) {
      this.usernameArr = usernameArr;
      this.username1 = [];

      for (let k in this.usernameArr) {
        this.username1.push(this.usernameArr[k].account);
      }

      this.username = this.username1.join(",");
    },
    dataInit() {
      let params = new URLSearchParams();
      params.append("start", (this.currentPage - 1) * this.pageSize);
      params.append("page", this.currentPage);
      params.append("startTime", this.timrPicker[0]);
      params.append("endTime", this.timrPicker[1]);
      params.append("content", this.subtype);
      params.append("limit", this.pageSize);
      for (let k in this.usernameArr) {
        params.append("users", this.usernameArr[k].account);
      }
      this.loading = true;
      getLog(params)
        .then(res => {
          console.log("getLog");
          console.log(res);
          var data = res.data.records;
          for (var k in data) {
            data[k].number = Number(k) + 1;
            this.rowData.push(data[k]);
          }
          this.rowData = res.data.records;
          this.totalPage = res.data.total;
          this.loading = false;

          console.log("this.rowData");
          console.log(this.rowData);
        })
        .then(() => {
          this.gridSize();
        });
    },
    dataInit1() {
      // if(!this.timrPicker){
      //   this.timrPicker = []
      //   this.dateInit()()
      // }
      //
      console.log("this.usernameArr:", this.usernameArr);

      if (this.usernameArr.length === 0) {
        utils.messageBox(
          {
            data: {
              success: false,
              message: "请选择用户"
            }
          },
          this
        );
        return;
      }
      console.log("dataInit");
      // this.i = 0
      let params = new URLSearchParams();
      params.append("start", (this.currentPage - 1) * this.pageSize);
      params.append("page", this.currentPage);
      params.append("limit", this.pageSize);
      params.append("type", this.type);
      params.append("subtype", this.subtype);
      params.append("platform", this.platform);

      for (let k in this.usernameArr) {
        params.append("username", this.usernameArr[k].account);
      }

      //
      params.append("startTime", this.timrPicker[0]);
      params.append("endTime", this.timrPicker[1]);
      this.loading = true;
      getSystemLog(params)
        .then(res => {
          console.log(res);
          var data = res.data.records;
          for (var k in data) {
            data[k].number = Number(k) + 1;
            this.rowData.push(data[k]);
          }
          this.rowData = res.data.records;
          this.totalPage = res.data.total;
          this.loading = false;
        })
        .then(() => {
          this.gridSize();
          // this.gridReady ? this.gridSize() : console.log('ungridSize')
          // this.gridOptions.api.sizeColumnsToFit()
        });
    },
    gridSize() {
      // let arr = []
      // this.gridOptions.columnApi.getAllColumns().forEach(col => {
      //   arr.push(col.colId)
      // })
      // arr.splice(4,1)
      // this.gridOptions.columnApi.autoSizeColumns(arr)
      // this.gridOptions.api.sizeColumnsToFit()
      if (window.innerWidth < 1000) {
        utils.autosize(this.gridOptions);
      } else {
        this.gridOptions.api.sizeColumnsToFit();
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
  },
  mounted() {
    this.taskId = this.getTaskId();
    this.platformOptions = this.getPlatform().platformOptions;
    this.platform = this.getPlatform().platform;
    // this.gridOptions.api.sizeColumnsToFit()
    utils.dateFormat();
    this.dateInit();
    // this.dataInit()
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style scoped lang="scss">
.system_log {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .table {
    padding: 10px 20px 20px;
    .table_head {
      .flex {
        display: flex;
        align-items: center;
      }
      .foo {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(12, 8.33%);
        height: 40px;
        line-height: 40px;
        // grid-template-rows: 40px;
        //   grid-column-gap: 4px;
        & > span {
          height: 40px;
          // font-weight: 700;
        }
        .item-1,
        .item-2,
        .item-3 {
          height: 40px;
          padding: 0 4px;
        }
        .item-1 {
          .title {
            min-width: 36px;
          }
        }
        .item-3 {
          .title {
            min-width: 50px;
          }
        }
        .item-1 {
          grid-column: 2 / 4;
        }
        .item-2 {
          grid-column: 4 / 6;
        }
        .item-3 {
          grid-column: 6 / 12;
        }
        .item-4 {
          height: 40px;
          line-height: 35px;
          grid-column: 12 / 13;
          justify-self: end;
        }
        .timeBtn {
          display: flex;
          height: 30px;
          .el-button {
            height: 100%;
            padding: 4px 8px;
            margin-left: 0;
          }
          .excluded {
            background-color: #818181;
            background-image: none;
            border: none;
            box-shadow: 0 9px 8px -7px rgba(179, 179, 179, 0.6);
          }
        }
        .query.el-button {
          width: 66px;
          font-size: 12px;
          text-indent: unset;
        }
      }
      // width: 100%;
      // .right{
      //   .wrapper {
      //     width: 100%;
      //     outline: 1px dashed rgb(57, 221, 131);
      //     display: grid;
      //     grid-template-columns: repeat(12, auto);
      //     grid-template-rows: 48px;
      //     justify-items: end;

      //   }
      //   ul{
      //     display: flex;
      //     li{
      //       display: flex;
      //       flex-shrink: 1;
      //       span{
      //         flex-shrink: 0;
      //       }
      //       margin-right: 20px;
      //       .title{
      //         margin-right: 10px;
      //         text-align: right;
      //       }
      //       &:nth-last-child(1){
      //         margin-right: 0;
      //       }
      //       &:nth-child(1){
      //         width: 240px;
      //       }
      //       &:nth-child(2){
      //         width: 240px;
      //       }
      //       @media (min-width: 1800px) {
      //         &:nth-child(1){
      //           width: 200px;
      //           .title{
      //             width: 40px;
      //           }
      //         }
      //         &:nth-child(2){
      //           width: 200px;
      //           .title{
      //             width: 30px;
      //           }
      //         }

      //       }
      //     }
      //   }

      // }
    }
  }
}
</style>