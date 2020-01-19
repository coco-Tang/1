<template>
  <div class="userSelect">
    <el-dialog
      title="用户选择"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="calc(30% + 300px)">
      <div class="head">
        <div class="left">
          <!-- <el-button-group>
            <el-button type="primary" @click="getUser">确定</el-button>
            <el-button type="primary">取消</el-button>
          </el-button-group> -->
        </div>
        <div class="right">

        </div>

        
      </div>
      <!-- 
            
        
       -->
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
                :toolPanelSuppressRowGroups="true"
                :toolPanelSuppressValues="true"
                :toolPanelSuppressPivots="true"
                :toolPanelSuppressPivotMode="true"
                :suppressToolPanel="true"
                :toolPanelSuppressSideButtons="true"

                :rowMultiSelectWithClick="true"

                @gridReady="onGridReady"
                :columnVisible = 'hideColum'
                :suppressColumnVirtualisation='suppressColumnVirtualisation'
                  >
        </ag-grid-vue>
      </div>
      <div class="bottom">
        <div class="foot">
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
          <el-button type="primary" @click="getUser">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
          <!-- <el-button-group>
            <el-button type="primary" @click="getUser">确定</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
          </el-button-group> -->
        </div>
      </div>
      
    </el-dialog>    
  </div>
</template>

<script>

import {AgGridVue} from 'ag-grid-vue'
import {mapActions,mapGetters} from 'vuex'
import * as utils from '@/utils/index'
import {getUsers} from '@/api/user.js'
import localeText from '../static/localeText.json'
export default {
  name: 'userSelect',
  data () {
    return {
      sectionTree: [],
      dialogVisible: false,

      currentPage: 1,
      pageSize: 15,
      totalPage:0,
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
        {headerName: '账号', editable: false, field: 'account',menuTabs: ['columnsMenuTab']},
        {headerName: '备注', editable: false, field: 'remark',menuTabs: ['columnsMenuTab']},
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
        
      ],
      rowData: [],
      gridReady: false
      
    }
  },
  props: {

  },
  components: {
    'ag-grid-vue': AgGridVue,
  },
  methods: {
    ...mapGetters(['getSectionTree']),
    showDialog() {
      this.dialogVisible = true
    },
    handleSizeChange(v) {
      this.pageSize = v
      console.log('handleSizeChange')
      this.dataInit()
    },
    handleCurrentChange(v) {
      this.currentPage = v
      console.log('handleCurrentChange')
      this.dataInit()
    },
    levelFormatter(v) {
      switch(v.value){
        case 1:
          return '系统管理员';
          break;
        case 2:
          return '高级管理员';
          break;
        case 3:
          return '业务管理员';
          break;
        case 4:
          return '操作员';
          break;
      }
    },
    sectionofficeFormatter(v) {

      for(let k in this.sectionTree){
        // console.log(this.sectionTree[k])
        if(v.value === this.sectionTree[k].id){
          return this.sectionTree[k].label
        }
      }

    },
    departmentFormatter(v) {
      // console.log(v)
      for(let k in this.sectionTree){
        if(v.data.sectionoffice === this.sectionTree[k].id){
          for(let ck in this.sectionTree[k].children){
            if(v.value === this.sectionTree[k].children[ck].id){
              return this.sectionTree[k].children[ck].label
            }
          }
        }
      }
    },
    dataInit() {

      console.log('userSelect init')
      // this.sectionTree = this.getSectionTree()
      let params = new URLSearchParams()
      // params.append('loginuser','admin')
      params.append('start',(this.currentPage-1)*this.pageSize)
      params.append('limit',this.pageSize)
      

      getUsers(params).then(res => {
        console.log('child getUser')
        console.log(res)
        var data = res.data.records
        for(var k in data){
          data[k].number = Number(k)+1
          this.rowData.push(data[k])
        }
        this.rowData = res.data.records
        this.totalPage = res.data.total
      }).then(() => {
        // console.log(this.gridOptions)
        // console.log('this.onGridReady()')
        // console.log(this.onGridReady())
        // this.gridReady ? this.gridSize() : ''
        this.gridReady ? this.onGridReady() : ''
      })

    },
    onGridReady(v) {
      console.log('endif')
      // console.log(v)
      // console.log(arguments)
      // this.gridOptions.api.sizeColumnsToFit()
      // this.gridSize()
      this.gridReady = true
      this.localeText = localeText
      // if(window.innerWidth < 1600){
      //   utils.autosize(this.gridOptions)
      // }else{
        this.gridOptions.api.sizeColumnsToFit()
      // }
    },
    getUser() {
      let arr = this.gridOptions.api.getSelectedRows()
      console.log('getUser')
     

      // this.$emit('setUser',arr[0].account)
      this.$emit('setUser',arr)
      this.dialogVisible = false
    },
    cancel() {
      this.dialogVisible = false
    },
    gridSize() {
      // let arr = []
      // this.gridOptions.columnApi.getAllColumns().forEach(col => {
      //   arr.push(col.colId)
      // })
      // arr.splice(arr.length-1,1)
      // this.gridOptions.columnApi.autoSizeColumns(arr)
      // this.gridOptions.api.sizeColumnsToFit()
      utils.autosize(this.gridOptions)
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
      // if(window.innerWidth < 1600){
      //   utils.autosize(this.gridOptions)
      // }else{
        this.gridOptions.api.sizeColumnsToFit()
      // }
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

.userSelect{
  // width: 100%;
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
  .bottom{
    // margin-top: 20px;
    margin: 30px 0 10px;
    display: flex;
    .foot{

    }
    .btnGroup{
      // padding-left: calc(100% - 140px);
      margin-left: auto;
    }
  }
  
}
   
  
</style>