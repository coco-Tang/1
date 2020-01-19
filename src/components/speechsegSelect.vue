<template>
  <div class="speechsegSelect">
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="calc(30% + 300px)">
      <div class="head">
        <div class="left">
          <!-- <el-button-group>
            <el-button type="primary" @click="getSpeechseg">确定</el-button>
            <el-button type="primary">取消</el-button>
          </el-button-group> -->
        </div>
        <div class="right">
        </div>

        
      </div>
      <div class="body">
        <ag-grid-vue style="width: 100%; height:500px " class="ag-grid ag-theme-material"
                :gridOptions = "gridOptions" 
                :showToolPanel = "showToolPanel"
                :enableColResize = "enableColResize"
                :headerHeight = "headerHeight"
                :rowHeight = "rowHeight"
                :enableFilter = "enableFilter"
                :columnDefs = "columnDefs"
                :rowData = "rowData"
                :localeText = "localeText"
                :rowSelection="rowSelection"     
                :rowDeselection="rowDeselection"
                :suppressRowClickSelection="suppressRowClickSelection"
                :toolPanelSuppressRowGroups = "toolPanelSuppressRowGroups"
                :toolPanelSuppressValues = "toolPanelSuppressValues"
                :toolPanelSuppressPivots = "toolPanelSuppressPivots"
                :toolPanelSuppressPivotMode = "toolPanelSuppressPivotMode"
                :suppressToolPanel = "suppressToolPanel"
                :toolPanelSuppressSideButtons = "toolPanelSuppressSideButtons"
                :rowMultiSelectWithClick = "rowMultiSelectWithClick"

                :gridReady="onGridReady"
                :columnVisible = 'hideColum'
                :suppressColumnVirtualisation='suppressColumnVirtualisation'
                  >
        </ag-grid-vue>
      </div>
      
      <div class="foot" :class="{ 'pager-hidden' : !totalPage || totalPage <= 15 }">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 25, 50, 100,200,500,1000]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
      <div class="btnGroup">
        <el-button-group>
          <el-button type="primary" @click="getSpeechseg">确定</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-button-group>
      </div>
    </el-dialog>    
  </div>
</template>

<script>

import {AgGridVue} from 'ag-grid-vue'
import {getSpeechseg} from '@/api/index.js'
import localeText from '../static/localeText.json'
import {mapActions,mapGetters} from 'vuex'
export default {
  name: 'speechsegSelect',
  data () {
    return {
      dialogVisible: false,
      radio2: 3,
      currentPage: 1,
      pageSize: 15,
      totalPage:'',
      localeText: {},
      gridOptions: {}, 
      showToolPanel: false,
      enableColResize: true,
      headerHeight: 40,
      rowHeight: 40,
      enableFilter: true,
      rowSelection: 'multiple',
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
          headerName: '序号', 
          editable: false, 
          field: 'number',
          headerCheckboxSelection: true,
          checkboxSelection: true,
          menuTabs: ['columnsMenuTab']
        },
        {headerName: '音频代号', editable: false, field: 'code',menuTabs: ['columnsMenuTab']},
        {headerName: '音频名称', editable: false, field: 'name',menuTabs: ['columnsMenuTab']},
        {headerName: '所属语种', editable: false, field: 'langname',menuTabs: ['columnsMenuTab']},
        {
          headerName: '上线状态', 
          editable: false, 
          field: 'onlinestate',
          valueFormatter: this.onlinestateFormatter,
          cellStyle: function(params) {
            if (params.value) {
              return {color: 'green'}
            } else {
              return {color: 'red'}
            }
          },
          menuTabs: ['columnsMenuTab']
        },
        {headerName: '音频阈值', editable: false, field: 'threshold',menuTabs: ['columnsMenuTab']},
        {
          headerName: '平台', 
          editable: false, 
          field: 'datasource',
          valueFormatter: this.datasourceFormatter,
          menuTabs: ['columnsMenuTab']
        },
        {headerName: '创建人', editable: false, field: 'creator',menuTabs: ['columnsMenuTab']},
        {headerName: '备注', editable: false, field: 'remark',menuTabs: ['columnsMenuTab']},
        
      ],
      rowData: [],
      platformOptions: []
    }
  },
  props: {

  },
  components: {
    'ag-grid-vue': AgGridVue,
  },
  methods: {
    ...mapGetters(['getPlatform']),
    showDialog() {
      this.dialogVisible = true
    },
    handleSizeChange(v) {
      this.pageSize = v
      // console.log('handleSizeChange')
      this.dataInit()
    },
    handleCurrentChange(v) {
      this.currentPage = v
      // console.log('handleCurrentChange')
      this.dataInit()
    },
    categoryChange() {
      this.dataInit()
      // console.log('categoryChange')
    },
    onlinestateFormatter(v) {
      return v.value===1?'上线':'下线'
    },
    datasourceFormatter(v) {
      for(let k in this.platformOptions){
        if(this.platformOptions[k].value === v.data.datasource[0]){
          return this.platformOptions[k].label
        }
      }
    },
    dataInit() {
      this.platformOptions = this.getPlatform().platformOptions
      // console.log('child mounted')
      let params = new URLSearchParams()
      params.append('start',(this.currentPage-1)*this.pageSize)
      params.append('limit',this.pageSize)

      getSpeechseg(params).then(res => {
        // console.log('child getSpeechseg')
        // console.log(res)
        var data = res.data.records
        for(var k in data){
          data[k].number = Number(k)+1
          this.rowData.push(data[k])
        }
        this.rowData = res.data.records
        this.totalPage = res.data.total
      })

    },
    onGridReady() {
      // console.log('endif')
      // this.gridOptions.api.sizeColumnsToFit()
      // utils.autosize(this.gridOptions)
      this.localeText = localeText
      if(window.innerWidth < 1600){
        this.Utils.autosize(this.gridOptions)
      }else{
        this.gridOptions.api.sizeColumnsToFit()
      }
    },
    getSpeechseg() {
      let arr = this.gridOptions.api.getSelectedRows()
      let nameArr = []
      let idArr = []
      for(let k in arr){
        nameArr.push(arr[k].name)
        idArr.push(arr[k].id)
      }
      let name = nameArr.join(',')
      this.$emit('setSpeechseg',{
        name: name,
        id: idArr 
      })

      this.dialogVisible = false
    },
    cancel() {
      this.dialogVisible = false
    },
    hideColum(e) {
      let status = e.columnApi.getColumnState()
      let allHide = true
      for(let k = 0;k < status.length; k++){
        if(!status[k].hide){
          allHide = false
          break;
        }    
      }
      if(allHide){ 
        this.gridOptions.columnApi.setColumnVisible('number',true)
      }
    }
  },
  beforeCreate() {

  },
  created() {

  },
  beforeMount() {

  },
  mounted () {
    this.dataInit()
  },
  beforeUpdate () {

  },
  updated() {

  },
  activated() {

  },
  deactivated() {

  },
  beforeDestroy() {

  },
  destroyed() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.speechsegSelect{
  width: 100%;
  // height: 500px;
  display: flex;
  flex-direction: column;
  .head{
    display: flex;
    .right{
      margin-left: auto;
    }
  }
  .body{

  }
  .foot{

  }
  .btnGroup{
    padding-left: calc(100% - 104px);
  }
}
   
  
</style>