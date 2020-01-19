<!--
 * @Author: coco-Tang
 * @Date: 2019-06-05 09:51:11
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-08-22 14:32:01
 * @Description: 
 -->
<template>
  <div class="searchSpeaker">
    <el-dialog title :visible.sync="dialogVisible" width="calc(30% + 200px)">
      <div class="head">
        <div class="left">
          <!-- <div>
            <span>语音文件</span>
            <input type="file" @change="tirggerFile($event)">
          </div>-->
          <span class="title">语音文件</span>
          <div class="file_input">
            <input style="display:none" type="file" id="file1" @change="tirggerFile($event)" />

            <el-input :title="uploadFileName" v-model="uploadFileName" readonly placeholder="请输入内容"></el-input>
            <label class="fileBtn" for="file1">选择文件</label>
          </div>
          <span class="title">性别</span>
          <el-select v-model="gender" @change="categoryChange" placeholder="请选择">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="right"></div>
      </div>
      <div class="body">
        <ag-grid-vue
          style="width: 100%; height:500px "
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
          :gridReady="onGridReady"
          :rowDoubleClicked="returnList"
          :columnVisible="hideColum"
          :suppressColumnVirtualisation="suppressColumnVirtualisation"
        ></ag-grid-vue>
      </div>

      <div class="foot">
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
      <!--       <div class="btnGroup">
        <el-button-group>
          <el-button type="primary" @click="getSpeaker">确定</el-button>
          <el-button type="primary" @click="cancel">关闭</el-button>
        </el-button-group>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { getSpeakers } from "@/api/index.js";
import { mapActions, mapGetters } from "vuex";
import {
  getspeakerfind,
  speakersearch,
  getspeakersearchresult
} from "@/api/index.js";
import { formatParams } from "@/utils";
// import localeText from '../../../static/localeText.json'
export default {
  name: "searchSpeaker",
  data() {
    return {
      dialogVisible: false,
      radio2: 3,
      currentPage: 1,
      pageSize: 50,
      totalPage: "",
      localeText: {},

      gridOptions: {},
      showToolPanel: false,
      enableColResize: true,
      headerHeight: 40,
      rowHeight: 40,
      enableFilter: true,
      rowSelection: "multiple",
      rowDeselection: true,
      suppressRowClickSelection: false,
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
          editable: false,
          field: "number",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          suppressSizeToFit: true,
          width: 140,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "语音文件",
          editable: false,
          field: "searchvoice",
          valueFormatter: this.searchvoiceFormatter,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "性别",
          editable: false,
          field: "gender",
          valueFormatter: this.genderFormatter,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "搜索时间",
          editable: false,
          field: "searchtime",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "状态",
          editable: false,
          field: "status",
          valueFormatter: this.statusFormatter,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "结果",
          editable: false,
          field: "resultnum",
          menuTabs: ["columnsMenuTab"]
        }
      ],
      rowData: [],
      localeText: {},

      gender: 0,
      genderOptions: [
        {
          label: "不限",
          value: 0
        },
        {
          label: "男",
          value: 1
        },
        {
          label: "女",
          value: 2
        },
        {
          label: "男和女",
          value: 3
        }
      ],
      platformOptions: [],
      startTime: "",
      endTime: "",
      file: null,
      uploadFileName: ""
    };
  },
  props: {},
  components: {
    "ag-grid-vue": AgGridVue
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    handleSizeChange(v) {
      this.pageSize = v;
      console.log("handleSizeChange");
      this.dataInit();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      console.log("handleCurrentChange");
      this.dataInit();
    },

    tirggerFile(e) {
      this.file = event.target.files[0];
      this.uploadFileName = this.file.name;
    },
    categoryChange() {
      this.dataInit();
      console.log("categoryChange");
    },
    searchvoiceFormatter(v) {
      // console.log(v)
      return v.value.filename;
    },
    genderFormatter(v) {
      switch (v.value) {
        case 0:
          return "不限";
        case 1:
          return "男";
        case 2:
          return "女";
        case 3:
          return "男和女";
      }
    },
    statusFormatter(v) {
      switch (v.value) {
        case 0:
          return "检索中";
        case 1:
          return "成功";
        case 2:
          return "失败";
      }
    },

    dateInit() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
      this.startTime = new Date(start).format("yyyy-MM-dd hh:mm:ss");
      this.endTime = new Date(end).format("yyyy-MM-dd hh:mm:ss");
    },
    dataInit() {
      this.dateInit();
      let params = new URLSearchParams();
      params.append("start", (this.currentPage - 1) * this.pageSize);
      params.append("limit", this.pageSize);
      params.append("startTime", this.startTime);
      params.append("endTime", this.endTime);

      getspeakerfind(params).then(res => {
        console.log("child getSpeakers");
        console.log(res);
        var data = res.data.records;
        for (var k in data) {
          data[k].number = Number(k) + 1;
          this.rowData.push(data[k]);
        }
        this.rowData = res.data.records;
        this.totalPage = res.data.total;
      });
    },
    onGridReady() {
      console.log("endif");
      // this.gridOptions.api.sizeColumnsToFit()
      // this.localeText = localeText
      if (window.innerWidth < 1600) {
        this.Utils.autosize(this.gridOptions);
      } else {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    search() {
      let params = new FormData();
      params.append("file", this.file);
      params.append("gender", this.gender);
      speakersearch(params).then(res => {
        console.log("speakersearch");
        console.log(res);
        this.dataInit();
      });
    },
    returnList(v) {
      console.log(v);
      console.log(v.data.taskid);
      let params = new URLSearchParams();
      params.append("taskid", v.data.taskid);

      getspeakersearchresult(params).then(res => {
        console.log(res);
        this.$emit("setSearch", res.data);
        this.dialogVisible = false;
      });
    },

    cancel() {
      this.dialogVisible = false;
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
    // this.localeText = localeText
  },
  beforeMount() {},
  mounted() {
    this.Utils.dateFormat();

    this.dataInit();
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
.searchSpeaker {
  width: 100%;
  // height: 500px;
  display: flex;
  flex-direction: column;
  .head {
    display: flex;
    margin-bottom: 20px;
    .left {
      display: flex;
      .title {
        line-height: 30px;
        margin-right: 10px;
        flex-shrink: 0;
      }
      .file_input {
        display: flex;
        label {
          font-size: 12px;
        }
        .fileBtn {
          width: 120px;
          height: 28px;
          line-height: 28px;
          background-color: #409eff;
          color: #fff;
          display: block;
          border-radius: 4px;
          text-align: center;
          margin-left: 15px;
          margin-right: 30px;
        }
      }
    }
    .right {
      margin-left: auto;
    }
  }
  .body {
  }
  .foot {
  }
  .btnGroup {
    padding-left: calc(100% - 100px);
  }
}
</style>
<style lang="scss">
.searchSpeaker {
  .left {
    .file_input {
      .el-input {
        margin-right: 0;
      }
      label {
        margin-right: 15px !important;
      }
    }
    .el-select {
      margin-right: 15px;
    }
  }
}
</style>