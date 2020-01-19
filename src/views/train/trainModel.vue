<template>
  <div class="train_model">
    <train-model-dialog :update-msg="updateMsg" ref="c1"></train-model-dialog>

    <div class="table">
      <div class="table_head">
        <div class="top">
          <span style="font-weight: 700;">模型列表</span>
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
            <el-button type="primary" @click="newImport" class="create">上传</el-button>
            <el-button
              type="primary"
              @click="deleteConfirm"
              class="del"
              :disabled="multipleSelection.length < 1"
            >删除</el-button>
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
import { queryModels, delModels } from "@/api/train.js";
import localeText from "../../static/localeText.json";
import { LANGUAGE_LIBRARY_TYPE, getValue, removeLastLabel } from "@/constant";
import TrainModelDialog from "@/components/dialog/TrainModelDialog.vue";
import TrainModelCellOperation from "@/components/table/TrainModelCellOperation.vue";
import { formatParams } from "@/utils";

export default {
  name: "train_model",
  data() {
    return {
      multipleSelection: [],
      updateMsg: {
        data: {
          label: this.libraryType
        }
      },
      languageLibrary: LANGUAGE_LIBRARY_TYPE,
      loading: false,
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
      columnDefs: [
        {
          headerName: "序号",
          editable: false,
          field: "number",
          menuTabs: ["columnsMenuTab"],
          headerCheckboxSelection: true,
          checkboxSelection: true
        },
        {
          headerName: "添加人",
          editable: false,
          field: "creator",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "添加日期",
          editable: false,
          field: "createTime",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: v => {
            return v.value ? v.value : "无";
          }
        },
        {
          headerName: "描述",
          editable: false,
          field: "remark",
          // width: 400,
          suppressSizeToFit: true,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "操作",
          editable: false,
          field: "",
          cellRendererFramework: TrainModelCellOperation,
          menuTabs: ["columnsMenuTab"]
        }
      ],
      rowData: [],
      localeText: {},
      libraryType: "性别库"
    };
  },
  components: {
    "ag-grid-vue": AgGridVue,
    "train-model-dialog": TrainModelDialog
  },
  methods: {
    deleteConfirm(params) {
      this.Utils.confirmBox(
        this,
        "确定删除选中语音?",
        this.mydeleteHandle,
        params
      );
    },
    mydeleteHandle(params) {
      let deleteArr = [];
      this.multipleSelection.forEach(item => {
        if (item.id) {
          deleteArr.push(item.id);
        }
      });

      if (this.multipleSelection.length > 1) {
        this.$message.error("后台暂不支持批量删除，请逐个删除！");
        return;
      }

      this.loading = true;

      const id = deleteArr.length ? deleteArr : params;
      this.del(id);
    },
    del(deleteArr) {
      delModels(deleteArr)
        .then(res => {
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
        })
        .then(() => {
          this.dataInit();
        })
        .catch(err => {
          console.error("delModels--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    newImport() {
      this.updateMsg.data.label = this.libraryType;
      this.updateMsg.data.value = getValue(this.libraryType);
      this.$refs.c1.showDialog();
    },
    createTimeFormatter(v) {
      let d = new Date(v.value).format("yyyy-MM-dd hh:mm:ss");
      return d;
    },
    toogleLibrary(value) {
      this.dataInit();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.dataInit();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.dataInit();
    },

    onGridReady() {
      this.gridSize();
    },
    rowSelected(v) {
      console.log(`------------------------------`);
      console.log(this.gridOptions.api.getSelectedRows());
      console.log(`------------------------------`);

      this.multipleSelection = this.gridOptions.api.getSelectedRows();
    },
    dataInit() {
      let params = {
        start: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize,
        type: getValue(this.libraryType)
      };

      this.loading = true;
      queryModels(formatParams(params))
        .then(res => {
          console.log("queryModels");
          console.log(res);
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
          this.totalPage = res.data.total;
          this.loading = false;

          console.log("this.rowData");
          console.log(this.rowData);
        })
        .then(() => {
          this.gridSize();
        });
    },
    gridSize() {
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
    this.dataInit();
  }
};
</script>

<style scoped lang="scss">
.train_model {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .table {
    padding: 10px 20px 20px;
    .table_head {
      // .flex {
      //   display: flex;
      //   align-items: center;
      // }
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
}
</style>

<style lang="scss">
.train_model {
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
