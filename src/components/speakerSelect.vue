<template>
  <div class="mspeakerSelect speakerSelect">
    <el-dialog
      title="声纹"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="cancel"
      width="calc(30% + 300px)">
      <div class="head">
        <!-- <div class="left">
          <el-button-group>
            <el-button type="primary" @click="getSpeaker">确定</el-button>
            <el-button type="primary">取消</el-button>
          </el-button-group>
        </div> -->
        <div class="right">
          <ul>
            <li>
              <el-checkbox :disabled="invalidFlag" @change="hitSpeakerChanged" v-model="hitSpeaker" label="任意中标声纹"></el-checkbox>
            </li>
            <li>
              <span>阈值:</span>
              <el-input :disabled="invalidFlag" v-model="threshold"></el-input>
            </li>
          </ul>
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
                
                @selection-changed="rowSelected"
                @gridReady="onGridReady"
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
          <el-button type="primary" @click="getSpeaker">确定</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-button-group>
      </div>
    </el-dialog>    
  </div>
</template>

<script>

import {AgGridVue} from 'ag-grid-vue'
import {getSpeakers} from '@/api/speakers.js'//我的
// import {getSpeakers} from '@/api/speaker.js'//叶飞的
import localeText from '../static/localeText.json'
import {mapActions,mapGetters} from 'vuex'
export default {
  name: 'speakerSelect',
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
        {headerName: '声纹名', editable: false, field: 'name',menuTabs: ['columnsMenuTab']},
        {headerName: '声纹阈值', editable: false, field: 'threshold',menuTabs: ['columnsMenuTab']},
        {
          headerName: '上线状态', 
          editable: false, 
          field: 'onlineState',
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
      category: 0,
      categoryOptions: [{
        value: 0,
        label: '正常'
      },{
        value: 1,
        label: '排除'
      },{
        value: 2,
        label: '诈骗'
      }],
      platformOptions: [],
      invalidFlag: false,
      hitSpeaker: false,
      threshold: 60,
      cache:{
        hitSpeaker: null,
        threshold: null
      },
      count: 0
    }
  },
  props: {

  },
  components: {
    'ag-grid-vue': AgGridVue,
  },
  methods: {
    ...mapGetters(['getPlatform','getMonitorCondition']),
    showDialog() {
      // this.setMonitorData()
      if(this.count<1){
        this.setMonitorData()
        this.count++
      }
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
      return v.value?'上线':'下线'
    },
    datasourceFormatter(v) {
      for(let k in this.platformOptions){
        if(this.platformOptions[k].value === v.data.datasource[0]){
          return this.platformOptions[k].label
        }
      }
    },
    dataInit() {
      // this.platformOptions = this.getPlatform().platformOptions
      // console.log('child mounted')
      let params = new URLSearchParams()
      params.append('start',(this.currentPage-1)*this.pageSize)
      params.append('limit',this.pageSize)
      // params.append('category',this.category)

      getSpeakers(params).then(res => {
        // console.log('child getSpeakers')
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
      // this.localeText = localeText
      // this.localeText = localeText
      if(window.innerWidth < 1600){
        this.Utils.autosize(this.gridOptions)
      }else{
        this.gridOptions.api.sizeColumnsToFit()
      }
    },
    rowSelected(v) {
      if(this.hitSpeaker){
        this.gridOptions.api.deselectAll()
        return
      }
    },
    hitSpeakerChanged(v){
      console.log('hitSpeakerChanged')
      console.log(v)
      if(v){
        this.gridOptions.api.deselectAll()
      }
    },
    getSpeaker() {
      let arr = this.gridOptions.api.getSelectedRows()
      let nameArr = []
      let idArr = []
      for(let k in arr){
        nameArr.push(arr[k].name)
        idArr.push(arr[k].id)
      }
      let name = nameArr.join(',')
      this.$emit('setSpeaker',{
        name: name,
        id: idArr,
        threshold: this.threshold,
        hitSpeaker: this.hitSpeaker 
      })

      this.dialogVisible = false
    },
    cancel() {
      if(this.$route.path === '/monitor'){
        this.hitSpeaker = this.cache.hitSpeaker
        this.threshold = this.cache.threshold
      }else{
        this.hitSpeaker = false
        this.threshold = 60
      }
      
      this.gridOptions.api.deselectAll()
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
    },
    setMonitorData(){
      if(this.$route.path === '/monitor'){
        let data = this.getMonitorCondition()
        this.hitSpeaker = data.hitSpeaker
        this.threshold = data.speakerThreshold
        this.cache.hitSpeaker = this.hitSpeaker
        this.cache.threshold = this.threshold
      }
    }
  },
  beforeCreate() {

  },
  created() {
    this.localeText = localeText;
  },
  beforeMount() {

  },
  mounted () {
    this.dataInit()
    // this.setMonitorData()
  },
  beforeUpdate () {

  },
  updated() {

  },
  activated() {
    this.dataInit()
  },
  deactivated() {

  },
  beforeDestroy() {

  },
  destroyed() {

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.speakerSelect{
  line-height: normal;
  width: 100%;
  // height: 500px;
  display: flex;
  flex-direction: column;
  .head{
    display: flex;
    .right{
      // margin-left: auto;
      width: 100%;
      display: flex;
      span{
        flex-shrink: 0;
        margin: 0 5px;
      }
      ul{
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
        justify-content: space-between;
        width: 100%;
        li{
          &:nth-child(1){

          }
          &:nth-child(2){
            width: 120px;
            display: flex;
          }
        }
      }
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
<style lang="scss">
.mspeakerSelect{
  .el-radio-group{
      flex-shrink: 0;
  }
  .el-dialog .el-dialog__body {
    padding: 0px 30px 20px !important;
  }
  // .el-dialog__header{
  //   padding-bottom: 0 !important;
  // }
  .el-radio-button--mini{
    .el-radio-button__inner{
      padding: 5px 8px;
    }
    
  }
}
  
</style>