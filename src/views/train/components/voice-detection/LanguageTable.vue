<!--
 * @Author: coco-Tang
 * @Date: 2019-11-23 13:22:19
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-11-29 15:15:16
 * @Description: 
 -->
<template>
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
</template>
<script>
import { AgGridVue } from "ag-grid-vue";
import { queryLibraryVoices, delLibraryVoices } from "@/api/train.js";
import localeText from "@/static/localeText.json";
import { yymmddhhmmss } from "@/utils";
import Bus from "../Bus";
import {
  SEARCH_LANGUAGE_TYPE1,
  GENDER_TYPE1,
  VOICE_TYPE,
  UNION_TYPE,
  LANGUAGE_LIBRARY_TYPE,
  getValue
} from "@/constant";
export default {
  data() {
    return {
      typeValue: "engl",
      totalPage: 0,
      loading: false,
      localeText: {},
      rowData: [],
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
          headerName: "文件名",
          editable: false,
          field: "fileName",
          menuTabs: ["columnsMenuTab"],
          tooltipField: "name",
          width: 200
        },
        // {
        //   headerName: "语种",
        //   editable: false,
        //   hide: false,
        //   field: "languagename",
        //   menuTabs: ["columnsMenuTab"],
        //   valueFormatter: this.langFormatter
        // },
        // {
        //   headerName: "所属集",
        //   editable: false,
        //   field: "union",
        //   minWidth: 100,
        //   menuTabs: ["columnsMenuTab"]
        // },
        {
          headerName: "语音时长",
          editable: false,
          field: "duration",
          // width: 400,
          suppressSizeToFit: true,
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "来源平台",
          editable: false,
          field: "sourceType",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "导入人",
          editable: false,
          field: "creator",
          menuTabs: ["columnsMenuTab"]
        },
        {
          headerName: "导入时间",
          editable: false,
          field: "createTime",
          menuTabs: ["columnsMenuTab"],
          valueFormatter: this.createTimeFormatter
        }
      ]
    };
  },
  components: {
    "ag-grid-vue": AgGridVue
  },
  props: {
    currentPage: { type: Number, default: 1 },
    pageSize: { type: Number, default: 15 },
    setValue: { type: Boolean, default: true }
  },
  created() {
    this.localeText = localeText;
    Bus.$on("value", value => {
      if (value[0] === "语种") {
        this.typeValue = value[1];
        this.dataInit();
      }
    });
  },
  mounted() {
    this.dataInit();
  },
  watch: {
    setValue() {
      this.dataInit();
    },
    pageSize() {
      this.dataInit();
    },
    currentPage() {
      this.dataInit();
    }
  },
  methods: {
    createTimeFormatter(v) {
      return yymmddhhmmss(new Date(v.value));
    },
    rowSelected(v) {
      console.log(`------------------------------`);
      console.log(this.gridOptions.api.getSelectedRows());
      console.log(`------------------------------`);

      let arr = this.gridOptions.api.getSelectedRows();
      this.$emit("delete", ["voiceDetectionTable", arr]);
    },
    dataInit() {
      let params = new URLSearchParams();
      params.append("start", (this.currentPage - 1) * this.pageSize);
      params.append("limit", this.pageSize);
      params.append("type", "language");
      params.append("typeValue", this.typeValue);
      params.append("isTest", this.setValue);

      this.loading = true;
      queryLibraryVoices(params)
        .then(res => {
          console.log("queryLibraryVoices");
          console.log(res);
          var data = res.data.records;
          for (var k in data) {
            data[k].number = Number(k) + 1;
            this.rowData.push(data[k]);
          }
          this.rowData = res.data.records;
          this.$emit("page", res.data.total);
          this.totalPage = res.data.total;
          this.loading = false;

          console.log("this.rowData");
          console.log(this.rowData);
        })
        .then(() => {
          this.gridSize();
        });
    },
    onGridReady() {
      this.gridSize();
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
  }
};
</script>