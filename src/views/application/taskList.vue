<template>
  <div class="taskList">
    <div class="table">
      <div class="table_head">
        <div class="left">
          <span class="title">任务列表</span>
        </div>
        <div class="right">
          <!-- <el-button-group> -->
            <!-- <el-button type="primary" :disabled="disExport" @click="exportExcel" class='export'>导出话单</el-button> -->
            <!-- <el-button :disabled="downloadBtn" @click="downloadVoice">下载</el-button> -->
          <!-- </el-button-group> -->
        </div>
      </div>
      <!-- :cellValueChanged = 'valueChange' -->
      <div class="table_content" v-loading="loading || loading2">
        <ag-grid-vue style="width: 100%; height: " class="ag-grid ag-theme-material"
              :gridOptions = "gridOptions" 
              
              :showToolPanel = "showToolPanel"
              :enableColResize = "enableColResize"
              :headerHeight = "headerHeight"
              :rowHeight = "rowHeight"
              :enableFilter = "enableFilter"
              :enableSorting = true
              :rowSelection = "rowSelection"
              :rowDeselection = "rowDeselection"
              :suppressRowClickSelection = "suppressRowClickSelection"
              :toolPanelSuppressRowGroups = "toolPanelSuppressRowGroups"
              :toolPanelSuppressValues = "toolPanelSuppressValues"
              :toolPanelSuppressPivots = "toolPanelSuppressPivots"
              :toolPanelSuppressPivotMode = "toolPanelSuppressPivotMode"
              :suppressToolPanel = "suppressToolPanel"
              :toolPanelSuppressSideButtons = "toolPanelSuppressSideButtons"
              :rowMultiSelectWithClick = "rowMultiSelectWithClick"

              :columnDefs = "columnDefs"
              :rowData = "rowData"
              :localeText = "localeText"

              
              :getRowStyle = 'changeBgColor'

              @rowDoubleClicked = "turnToDetail"
              @gridReady="onGridReady"
              @selectionChanged = "rowSelected"
              :columnVisible = 'hideColum'
              :suppressColumnVirtualisation='suppressColumnVirtualisation'
              :suppressCopyRowsToClipboard="suppressCopyRowsToClipboard"
                >
        </ag-grid-vue>  
      </div>
      <div class="table_pagination" :class="{ 'pager-hidden' : !totalPage || totalPage <= 15 }">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 25, 50, 100,200,500,1000]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="totalPage">
        </el-pagination>
      </div>   
    </div>
  	
  </div>
</template>

<script>
import {AgGridVue} from 'ag-grid-vue'
import {mapActions,mapGetters} from 'vuex'

import levelComponent from '@/components/table/levelComponent.vue'
import targetComponent from '@/components/table/targetComponent.vue'
import callerComponent from '@/components/table/callerComponent.vue'
import calleeComponent from '@/components/table/calleeComponent.vue'
import statusComponent from '@/components/table/statusComponent.vue'
import keywordComponent from '@/components/table/keywordComponent.vue'
import speechsegComponent from '@/components/table/speechsegComponent.vue'
import speakerComponent from '@/components/table/speakerComponent.vue'
import keywordsHitComponent from '@/components/table/keywordsHitComponent.vue'
import speechsegsHitComponent from '@/components/table/speechsegsHitComponent.vue'
import speakersHitComponent from '@/components/table/speakersHitComponent.vue'
import targetHitComponent from '@/components/table/targetHitComponent.vue'
import HisContentComponent from '@/components/table/HisContentComponent.vue'
import taskCellOperation from '@/components/table/taskCellOperation.vue'

import remarkComponent from '@/components/dialog/remarkDialog.vue'

import exportDialog from '@/components/dialog/exportDialog.vue'
import {getTaskResult,changecallstatus,phonenoCreate,dangerousDelete,addremark,downloadurl,taskExportUrl,changecallstatusAndaddListen,addlisten} from '@/api/index.js'
import {getHisResult,taskCancel,taskDelete} from '@/api/history.js'
import {getHisResult1} from '@/api/history.js'
import localeText from '../../static/localeText.json'

import headerComponent from '@/components/table/headerComponent.vue'
import statusCellComponent from '@/components/table/statusCellComponent.vue'
import downloadCellComponent from '@/components/table/downloadCellComponent.vue'
import axios from "axios";

export default {
  name: 'taskList',
  data () {
    return {
      timer1: null,
      loading2: false,
      loading: false,
      i: 0,
      totalPage: 0,
      currentPage: 1,
      pageSize: 15,
    //   taskId: '',
      value2: '',

      gridOptions: {
        // getRowStyle: this.getRowStyle
      }, 
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
      suppressCopyRowsToClipboard: true,

      columnDefs: [
        {
          headerName: '序号', editable: false, field: 'number', menuTabs: ['columnsMenuTab'],
          width: 100, headerCheckboxSelection: !true, checkboxSelection: !true, suppressSizeToFit: true
          // valueFormatter: this.numberFormatter,
        },
        {
          headerName: '搜索开始时间', editable: false, field: 'created', menuTabs: ['columnsMenuTab'],
          valueFormatter: this.timeFormatter
        },
        {
          headerName: '检索内容', editable: false, field: 'queryParams', menuTabs: ['columnsMenuTab'],
          cellRendererFramework: 'HisContentComponent',
        },
        {
          headerName: '状态', editable: false, field: 'state', menuTabs: ['columnsMenuTab'],
          valueFormatter: this.stateFormatter
        },
        {
          headerName: '时间范围', editable: false, menuTabs: ['columnsMenuTab'],
          valueFormatter: this.timeRangeFormatter
        },
        {
          headerName: '结果', editable: false, field: 'resultNum', menuTabs: ['columnsMenuTab'],
        },
        {
          headerName: "操作",
          editable: false,
          field: "",
          cellRendererFramework: taskCellOperation,
          minWidth: 120,
          menuTabs: ["columnsMenuTab"]
        }
        // {
        //   headerName: '结果', editable: false, field: 'created', menuTabs: ['columnsMenuTab'],
        //   // cellRendererFramework: 'callerComponent',
        // },

      ],
      rowData:[],  
      localeText:{},

      downloadBtn: true,
      updateMsg:{
        ifUpdate: false,
        data:{}
      },
      exportMsg:{
        taskid: '',
        currentPage: '',
        pageSize: '',
        totalPage: '',
        list: true,
        search: true,
        monitor: false,
        defraud: false
      },
      disExport: true
      
    }
  },
  components: {
    'ag-grid-vue': AgGridVue,
    statusComponent: statusComponent,
    levelComponent: levelComponent,
    targetComponent:targetComponent,
    callerComponent: callerComponent,
    calleeComponent: calleeComponent,
    keywordComponent: keywordComponent,
    speechsegComponent: speechsegComponent,
    speakerComponent: speakerComponent,
    keywordsHitComponent: keywordsHitComponent,
    speechsegsHitComponent: speechsegsHitComponent,
    speakersHitComponent: speakersHitComponent,
    targetHitComponent: targetHitComponent,
    HisContentComponent: HisContentComponent,

    remarkComponent: remarkComponent,
    exportDialog: exportDialog,

    headerComponent: headerComponent,
    statusCellComponent: statusCellComponent,
    downloadCellComponent: downloadCellComponent,
  },
  computed: {
    // getComNext(){
    //   console.log('computed getComNext')
    //   return this.getNextRecord().dateFlag
    //   // return this.$store.player.nextRecord.dateFlag
    // },
    // getBill(){
    //   return this.getBillStatus().dateFlag
    // },
    getComResultData(){
      return this.getHistoryData()
    },
    getComSwitch(){
      return this.getHistorySwitch()
    },
    getComClearTimer(){
      return this.getClearTimer()
    }
  },
  props: {
    taskid: String
  },
  watch: {
    getComResultData(){
      this.dataInit()
    },
    getComSwitch(){
      if(this.getHistorySwitch()){
        if(this.timer1){
          clearInterval(this.time1)
        }
      }else{
        this.dataInit()
      }
    },
    getComClearTimer(){
      console.log('getClearTimer')
      console.log(this.getClearTimer())
      if(this.getClearTimer()){
        clearInterval(this.timer1)
      }
    }
  },
  methods:{
    // ...mapActions(['TASK_ID','QL_DATA','NEWQL_DATA','BILL_STATUS']),
    ...mapActions(['RESULT_DATA','HIS_SWITCH','HIS_CONDITION','HISTORY_ID','HISTORY_DATA','HIS_DETAIL_DATA']),
    ...mapGetters(['getResultData','getNextRecord','getBillStatus','getPlatform','getResultData','getHistoryData','getHistorySwitch','getClearTimer']),
    cancelTask(id) {
      taskCancel(id).then(res=>{
        this.dataInit()
      })
    },
    deleteTask(id) {
      taskDelete(id).then(res=>{
        this.dataInit()
      })
    },
    timeFormatter(v) {
      return new Date(Number(`${v.value}000`)).format("yyyy-MM-dd hh:mm:ss") 
    },
    timeRangeFormatter(v) {
      // console.log('timeRangeFormatter')
      // console.log(v)
      // v.data.queryParams.startTime
      // v.data.queryParams.endTime
      let str = ''
      let start = new Date(Number(`${v.data.queryParams.startTime}000`)).format("yyyy-MM-dd hh:mm:ss"),
      end = new Date(Number(`${v.data.queryParams.endTime}000`)).format("yyyy-MM-dd hh:mm:ss")
      return `${start} - ${end}`
    },
    stateFormatter(v) {
      switch(v.value) {
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
    handleSizeChange(v) {
      this.pageSize = v
      // this.dataInit()
      // this.$emit('pageChanged',{
      //   page:this.currentPage,
      //   size:this.pageSize
      // })
      this.$emit('pageChanged',this.currentPage,this.pageSize)
    },
    handleCurrentChange(v) {
      this.currentPage = v
      // this.dataInit()
      this.$emit('pageChanged',this.currentPage,this.pageSize)
    },
    startHandle() {

      var timer = setInterval(() =>{

        this.schedule += 10
        if(this.schedule>=100){
          clearInterval(timer)
          this.schedule = 100
        }
        
      },500)
    },
    turnToDetail(v) {
      this.loading = true
    //   console.log('taskList -- turnToDetail:', v)
      if ((v.data.state === 'completed' || v.data.state === 'failed' ) && v.data.resultNum) {
        this.gridOptions.api.deselectAll()
        v.node.setSelected(true)

        clearInterval(this.timer1)
        let params = new URLSearchParams()
        params.append("limit", 15);
        params.append("start", 0);

        // getHisResult1(v.data.id,params)
        getHisResult(v.data.id,params)
          .then(res => {
            this.HIS_DETAIL_DATA(res.data)
            this.HIS_SWITCH(true)
            this.HIS_CONDITION(v.data.queryParams)
            this.HISTORY_ID(v.data.id)
            this.loading = false
            // clearInterval(this.timer1)
          })
          .catch(err => console.error('getHisResult--err:', err))

          
      //   axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTU2MzQxMjcxMCwiZXhwIjoxNTYzNDE2MzEwfQ.q4ey2dyKvwPQD-qQQoINi_xGTxT_CBtptNr43-9eGgKjFZygu7iv3ELxTDjQ3OxwLasxtzenid78V7iR8PjKmA';
      //   axios.get(`http://192.168.1.55:9999/api/query?startTime=1531037330&endTime=1563206399&language=&platforms=&threshold=60&minVoiceLength=&maxVoiceLength=&gender=&keywords=&speakerIds=&callLevels=&veracityMark=&numberRules=&limit=10&start=0&invalidVoice=false&hasAsr=false&hitKeyword=false&hitSpeaker=false&callId=&content=`).then(res => {
      //     this.RESULT_DATA(res.data)
      //     this.HIS_SWITCH(true)
      //     this.HIS_CONDITION(v.data.queryParams)
      //     this.HISTORY_ID(v.data.id)
      //     this.loading = false
      // })



      } else {
          this.loading = false
          this.$message.error('无结果')
      }
      // let d = new Date()
      // this.PLAYER_DATA({
      //   dateFlag: d,
      //   type: 'ql',
      //   callid: v.data.callid,
      // })
      // this.BILL_STATUS({     
      //   reset: true
      // })
      // this.changeStatus(v.node)

    },
    onGridReady() {
      // console.log('onGridReady')
      // console.log(window.innerWidth)
      // if(window.innerWidth < 1280){
      //   this.Utils.autosize(this.gridOptions)
      // }else{
        this.gridOptions.api.sizeColumnsToFit()
      // }
    },
    rowSelected(v) {

      let arr = this.gridOptions.api.getSelectedRows()

      //download
      arr.length === 0 ? this.downloadBtn = true : this.downloadBtn = false

    },
    dataInit() {
      console.log('dataInit............')
      if (this.timer1) {
        clearInterval(this.timer1)
      }

      
      this.rowData = []
      var data = this.getHistoryData().records
      console.log(data)
      for(var k in data){
        data[k].number = Number(k)+1
        this.rowData.push(data[k])
      }
      this.rowData = data || []
      this.totalPage = this.getHistoryData().total || 0
      
      if (this.rowData.length) {
        let arr = Object.assign([],this.rowData)
        let truthy = arr.some(e => e.state !== 'completed' && e.state !== 'failed')
        if (truthy) {
          this.timer1 = setInterval(this.$parent.dataInit, 2000) // 每次创建任务就开启轮询, dataInit会在watch中被触发
        }
      }
      console.log('this.rowData')
      console.log(this.rowData)
      // this.loading = false
      // this.loading2 = false
    },
    changeBgColor(params) {
      switch(params.data.status) {
        case 0: 
          return { background: '#fff' }
        case 1: 
          return { background: '#eee' }
        case 2: 
          return { background: '#d6f3d6' }
        case 3: 
          return { background: '#f2d6d6' }
        case 4: 
          return { background: '#ffffce' }
      }
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
  beforeCreate() {},
  created() {
    this.localeText = localeText
  },
  beforeMount() {
    console.log(this.gridOptions)
    // this.createRowData()
    this.gridOptions = {
        context: {
            componentParent: this
        }
    };
  },
  mounted () {
    // this.gridOptions.api.sizeColumnsToFit()
    // utils.dateFormat()
    // this.dataInit()
    // this.platform = this.getPlatform().platformOptions
    // console.log('taskList')
    // console.log(this.platform)
  },
  beforeUpdate () {},
  updated() {},
  activated() {
    // console.log('activated')
    // if(this.taskId != this.getTaskId()){
    //   this.dataInit()
    // }
  },
  deactivated() {},
  beforeDestroy() {},
  destroyed() {
    if (this.timer1) {
      clearInterval(this.timer1)
    }
  }
};
</script>

<style scoped lang="scss">
.taskList{
  width: 100%;
  height: 100%;
  min-height: 60%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  .table {
    .table_head {
      height: 30px;
      // line-height: 30px;
      .left {
        line-height: 30px;
        .title {
          font-size: 14px;
          font-weight: 700;
        }
      }
      .right {
        .export {
          width: 90px;
        }
      }
    }
  }

}
</style>
