<template>
  <div class="resultList">
    <remarkComponent @setRemark="childCreate" :update-msg="updateMsg" ref="c1"></remarkComponent>
    <exportDialog @setExport="childCreate2" :export-msg="exportMsg" ref="c2"></exportDialog>
    <div class="table">
      <div class="table_head">
        <div class="left">
            <span class="title">结果列表</span>
          <!-- <el-button type="primary" @click="returnCondition">返回</el-button> -->
         <!--  <el-breadcrumb separator="/">
            <el-breadcrumb-item  :to="{ path: '/myApplication/search/condition' }">检索条件</el-breadcrumb-item>
            <el-breadcrumb-item>任务01</el-breadcrumb-item>
          </el-breadcrumb> -->
        </div>
        <div class="right">
          <!-- <el-switch
            v-model="value2"
            active-text="屏蔽安全号码"
            >
          </el-switch> -->
          <el-button-group>
            <el-button type="primary" :disabled="disExport" @click="exportExcel" class='export'>导出话单</el-button>
            <!-- <el-button :disabled="downloadBtn" @click="downloadVoice">下载</el-button> -->
          </el-button-group>
        </div>
      </div>
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
              :modelUpdated="onModelUpdated"

              :cellValueChanged = 'valueChange'
              :getRowStyle = 'changeBgColor'

              :rowDoubleClicked = "turnToDetail"
              :gridReady="onGridReady"
              :selectionChanged = "rowSelected"
              :getContextMenuItems = "getContextMenuItems"
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
          layout="total, sizes, prev, pager, next, jumper"
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

import remarkComponent from '@/components/dialog/remarkDialog.vue'

import exportDialog from '@/components/dialog/exportDialog.vue'
import {getTaskResult,changecallstatus,phonenoCreate,dangerousDelete,addremark,downloadurl,taskExportUrl,changecallstatusAndaddListen,addlisten} from '@/api/index.js'
import localeText from '../../static/localeText.json'

import headerComponent from '@/components/table/headerComponent.vue'
import statusCellComponent from '@/components/table/statusCellComponent.vue'
import downloadCellComponent from '@/components/table/downloadCellComponent.vue'

export default {
  name: 'resultList',
  data () {
    return {
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
          width: 140, headerCheckboxSelection: true, checkboxSelection: true, suppressSizeToFit: true
          // valueFormatter: this.numberFormatter,
        },
        {
          headerName: '状态', 
          editable: false, 
          field: 'status', 
          menuTabs: ['columnsMenuTab'],
          // width: 400, 
          cellRendererFramework: 'statusCellComponent',
          minWidth: 200
        },
        // {
        //   headerName: '状态', editable: false, field: 'status', menuTabs: ['columnsMenuTab']
        //   width: 140, cellRendererFramework: 'statusComponent', suppressSizeToFit: true,
        // },
        // {
        //   headerName: '话单级别', editable: false, field: 'billLevel', menuTabs: ['columnsMenuTab']
        //   width: 130, cellRendererFramework: 'levelComponent', suppressSizeToFit: true,
        // },
        // {
        //   headerName: '转写', editable: false, field: 'segments', menuTabs: ['columnsMenuTab']
        //   valueFormatter: this.segmentsFormatter,
        //   // valueGetter: this.segmentsFormatter,
        // },
        {
          headerName: '主叫号码', editable: false, field: 'caller', menuTabs: ['columnsMenuTab'],
          cellRendererFramework: 'callerComponent',
        },
        {
          headerName: '威胁号码备注(主叫)', editable: false, field: 'callerDangrousMatchPhones', menuTabs: ['columnsMenuTab'],
          hide: true, valueFormatter: this.callerDangrousFormatter
        },
        {
          headerName: '被叫号码', editable: false, field: 'callee', menuTabs: ['columnsMenuTab'],
          cellRendererFramework: 'calleeComponent',
        },
        {
          headerName: '威胁号码备注(被叫)', editable: false, field: 'calleeDangrousMatchPhones', menuTabs: ['columnsMenuTab'],
          hide: true, valueFormatter: this.calleeDangrousFormatter,
        },
        { headerName: '语种', editable: false, field: 'langname', menuTabs: ['columnsMenuTab'] },
        {
          headerName: '语种输出', editable: false, field: 'langScore', menuTabs: ['columnsMenuTab'],
          hide: true, valueFormatter: this.langScoreFormatter,
        },
        // {
        //   headerName: '性别', editable: false, field: 'gender', menuTabs: ['columnsMenuTab']
        //   hide: true, valueGetter: this.genderFormatter,
        //   // valueFormatter: this.genderFormatter,
        // },
        {
          headerName: '预警中标', editable: false, menuTabs: ['columnsMenuTab'],
          // field: 'speakers',
          // field: 'keywords',
          cellRendererFramework: 'targetComponent',
          // width: 600
        },
        {
          headerName: '检索结果', editable: false, menuTabs: ['columnsMenuTab'],
          hide: false, cellRendererFramework: 'targetHitComponent',
          // field: 'sort',
          // width: 600
        },
        {
          headerName: '通话时间', editable: false, field: 'starttime', menuTabs: ['columnsMenuTab'],
          // valueFormatter: this.starttimeFormatter,
          valueFormatter: this.starttimeFormatter
        },
        {
          headerName: '通话时长', editable: false, menuTabs: ['columnsMenuTab'],
          hide: false, valueGetter: this.durationFormatter, comparator: this.durationComparator,
          // valueFormatter: this.durationFormatter,
        },
        { headerName: '备注', editable: false, field: 'remark', menuTabs: ['columnsMenuTab'] },
        // {headerName: '', editable: false, field: ''},
        {
          headerName: '调听人', editable: false, field: 'listen', menuTabs: ['columnsMenuTab'],
          hide: true,
          // valueGetter: this.lastlistenFormatter,
        },
        {
          headerName: '处理科室', editable: false, field: 'department', menuTabs: ['columnsMenuTab'],
          hide: true
        },
        {
          headerName: '处理', editable: false, field: 'handled', menuTabs: ['columnsMenuTab'],
          hide: true, valueGetter: this.handledFormatter
        },
        {
          headerName: '类别', editable: false, field: 'category', menuTabs: ['columnsMenuTab'],
          hide: true
        },
        {
          headerName: '语音上传时间', editable: false, field: 'importtime', menuTabs: ['columnsMenuTab'],
          hide: true
        },
        {
          headerName: '结果返回时间', editable: false, field: 'inserttime', menuTabs: ['columnsMenuTab'],
          hide: true
        },
        {
          headerName: '来源平台', editable: false, field: 'spyid', menuTabs: ['columnsMenuTab'],
          hide: true, valueGetter: this.platformFormatter
        },
        {
          headerName: '处理引擎', editable: false, field: 'srid', menuTabs: ['columnsMenuTab'],
          hide: true
        },
        {
          headerName: '预警中标-关键词', editable: false, menuTabs: ['columnsMenuTab'],
          hide: true, cellRendererFramework: 'keywordComponent',
          // field: 'keywords',
        },
        {
          headerName: '预警中标-音频', editable: false, menuTabs: ['columnsMenuTab'],
          hide: true, cellRendererFramework: 'speechsegComponent'
          // field: 'speechsegs',
        },
        {
          headerName: '预警中标-声纹', editable: false, menuTabs: ['columnsMenuTab'],
          hide: true, cellRendererFramework: 'speakerComponent',
          // field: 'speakers',
        },
        {
          headerName: '检索结果-关键词', editable: false, menuTabs: ['columnsMenuTab'],
          hide: true, cellRendererFramework: 'keywordsHitComponent',
          // field: 'keywordsHit',
        },
        {
          headerName: '检索结果-音频', editable: false, menuTabs: ['columnsMenuTab'],
          hide: true, cellRendererFramework: 'speechsegsHitComponent',
          // field: 'speechsegsHit',
        },
        {
          headerName: '检索结果-声纹', editable: false, menuTabs: ['columnsMenuTab'],
          hide: true, cellRendererFramework: 'speakersHitComponent',
          // field: 'speakersHit',
        },
        {
          headerName: 'callid', editable: false, field: 'callid', menuTabs: ['columnsMenuTab'],
          hide: true
        },
        {
          headerName: '文件名', editable: false, field: 'filename', menuTabs: ['columnsMenuTab'],
          hide: true
        },
        {
          headerName: '文件路径', editable: false, field: 'filepaths', menuTabs: ['columnsMenuTab'],
          hide: true
        },
        {
          headerName: '下载', editable: false, field: '', menuTabs: ['columnsMenuTab'],
          headerComponentFramework: 'headerComponent', cellRendererFramework: 'downloadCellComponent'
        }
        // {
        //   headerName: '', 
        //   editable: false,
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

    remarkComponent: remarkComponent,
    exportDialog: exportDialog,

    headerComponent: headerComponent,
    statusCellComponent: statusCellComponent,
    downloadCellComponent: downloadCellComponent,
  },
  computed: {
    getComNext(){
      return this.getNextRecord().dateFlag
    },
    getBill(){
      return this.getBillStatus().dateFlag
    }
  },
  props: {
    taskid: String
  },
  watch: {
    taskid(newVal, oldVal) {
        console.warn('taskid--newVal: %o\ntaskid--oldVal: %o', newVal, oldVal)
      this.dataInit()
    },
    getComNext(){
      let data = this.getNextRecord()
      this.gridOptions.api.forEachNode((node,index)=>{
        if(node.data.callid === data.callid){
          this.gridOptions.api.deselectAll()
          console.error('getComNext')
          console.log(this.getNextRecord())
          console.log(this.gridOptions.api.getRowNode(index+1))
          let d = new Date()

          if(this.getNextRecord().next && this.gridOptions.api.getRowNode(index+1)){
            this.NEWQL_DATA({
              dateFlag: d,
              type: 'ql',
              callid: this.gridOptions.api.getRowNode(index+1).data.callid,
              starttime: this.gridOptions.api.getRowNode(index + 1).data.starttime
            })
            this.changeStatus(this.gridOptions.api.getRowNode(index+1))
            this.gridOptions.api.getRowNode(index+1).setSelected(true)

          }else if(!this.getNextRecord().next && this.gridOptions.api.getRowNode(index-1)){
            this.NEWQL_DATA({
              dateFlag: d,
              type: 'ql',
              callid: this.gridOptions.api.getRowNode(index-1).data.callid,
              starttime: this.gridOptions.api.getRowNode(index - 1).data.starttime
            })
            this.changeStatus(this.gridOptions.api.getRowNode(index-1))
            this.gridOptions.api.getRowNode(index-1).setSelected(true)
          }else{
            this.gridOptions.api.getRowNode(index).setSelected(true)
          }

          
        }
      })

    },
    getBill(){

      let node = this.gridOptions.api.getSelectedNodes()[0]
      let data = this.getBillStatus()


      let rowNode = this.gridOptions.api.getRowNode(node.id);
      let cache = 0
    
      if(data.status){
        node.data.status = data.status
        rowNode.setData(node.data)
      }
      if(data.level){
        node.data.billLevel = data.level
        rowNode.setData(node.data)
        cache = rowNode.data.status
        node.data.status = 100
        rowNode.setData(node.data)
        node.data.status = cache
        rowNode.setData(node.data)
      }
      if(data.gender){
        node.data.tagFlowSex = data.gender
        rowNode.setData(node.data)
        cache = rowNode.data.status
        node.data.status = 100
        rowNode.setData(node.data)
        node.data.status = cache
        rowNode.setData(node.data)
      }
      if(data.segments){
        node.data.segments = data.segments
        rowNode.setData(node.data)
        cache = rowNode.data.status
        node.data.status = 100
        rowNode.setData(node.data)
        node.data.status = cache
        rowNode.setData(node.data)
      }
      if(data.language){
        node.data.tagFlowLangType = data.language
        rowNode.setData(node.data)
        cache = rowNode.data.status
        node.data.status = 100
        rowNode.setData(node.data)
        node.data.status = cache
        rowNode.setData(node.data)
      }

    }
  },
  methods:{
    ...mapActions(['TASK_ID','QL_DATA','NEWQL_DATA','BILL_STATUS']),
    ...mapGetters(['getTaskId','getPlatform','getNextRecord','getBillStatus']),

    // parentMethod() {
    //   console.log(this.gridOptions)
    //   // this.$refs.c1.quickRecgnizeHandle()
    //   let params = {}
    //   params.processCellCallback = params =>{
    //     console.log(params)
    //     if(params.column.colDef.headerName === "状态"){
    //       switch(params.value){
    //         case 0:
    //           return '未处理';
    //           break;
    //         case 1:
    //           return '已调听';
    //           break;
    //         case 2:
    //           return '正确';
    //           break;
    //         case 3:
    //           return '错误';
    //           break;
    //         case 4:
    //           return '不确定';
    //           break;
    //       }
    //     }
    //     if(params.column.colDef.headerName === "话单级别"){
    //       switch(params.value){
    //         case 9:
    //           return '一般';
    //           break;
    //         case 8:
    //           return '排除';
    //           break;
    //         case 7:
    //           return '紧急';
    //           break;
    //         case 6:
    //           return '严重';
    //           break;
    //       }
    //     }
    //     if(params.column.colDef.headerName === "主叫号码"){
    //       return String('*'+params.value)
    //     }
    //     if(params.column.colDef.headerName === "被叫号码"){
    //       return String('*'+params.value)
    //     }
    //     return params.value
    //   }
    //   this.gridOptions.api.exportDataAsExcel(params)

    // },

    exportExcel() {
      this.exportMsg.taskid = this.getTaskId()
      this.exportMsg.currentPage = this.currentPage
      this.exportMsg.pageSize = this.pageSize
      this.exportMsg.totalPage = this.totalPage
      this.$refs.c2.showDialog()
    },
    childCreate2(params) {
      console.log(taskExportUrl)
      let url = taskExportUrl + params
      
      console.log(url)
      window.location.href = url
    },
    getContextMenuItems(params) {
      console.log('params')
      console.log(params)
      // console.log(params.node.data)
      // console.log(!params.node)
      if(!params.node){
        return
      }

      let result = [], data = params.node.data

      if(data.callerDangrousMatchPhones){
        result.push({
          name: `（主叫）${data.caller}从威胁号码库中移除`,
          action: ()=>{
            let params = new URLSearchParams()
            params.append('phone',data.caller)
            dangerousDelete(params).then(res => {
              this.dataInit()
            })
          }
        })
      }else{
        result.push({
          name: `（主叫）${data.caller}加入威胁号码库`,
          action: ()=>{
            let params = new URLSearchParams();
            params.append('phone',data.caller)
            params.append('remark','')
            params.append('type','1')
            phonenoCreate(params).then(res => {
              this.dataInit()
            })
          }
        },{
          name: `（主叫）${data.caller}加入安全号码库`,
          action: ()=>{
            let params = new URLSearchParams();
            params.append('phone',data.caller)
            params.append('remark','')
            params.append('type','0')
            phonenoCreate(params).then(res => {
              this.dataInit()
            })
          }
        })
      }
      if(data.calleeDangrousMatchPhones){
        result.push({
          name: `（被叫）${data.callee}从威胁号码库中移除`,
          action: ()=>{
            let params = new URLSearchParams()
            params.append('phone',data.callee)
            dangerousDelete(params).then(res => {
              this.dataInit()
            })
          }
        })
      }else{
        result.push({
          name: `（被叫）${data.callee}加入威胁号码库`,
          action: ()=>{
            let params = new URLSearchParams();
            params.append('phone',data.callee)
            params.append('remark','')
            params.append('type','1')
            phonenoCreate(params).then(res => {
              this.dataInit()
            })
          }
        },{
          name: `（被叫）${data.callee}加入安全号码库`,
          action: ()=>{
            let params = new URLSearchParams();
            params.append('phone',data.callee)
            params.append('remark','')
            params.append('type','0')
            phonenoCreate(params).then(res => {
              this.dataInit()
            })
          }
        })
      }

      result.push({
        name: `备注`,
        action: ()=>{
          this.updateMsg.data = data
          if(data.remark){
            this.updateMsg.ifUpdate = true
            
          }

          this.$refs.c1.showDialog()
          console.log(data)
          // let params = new URLSearchParams();
          // params.append('phone',data.callee)
          // params.append('remark','remark')
          // params.append('type','1')
          // phonenoCreate(params).then(res => {
          //   this.dataInit()
          // })
        }
      })

      return result

    },
    // getRowStyle(params) {      
    //   switch(params.data.status) {
    //     case 0: 
    //       return 
    //     case 1: 
    //       return { background: '#eee' }
    //     case 2: 
    //       return { background: '#d6f3d6' }
    //     case 3: 
    //       return { background: '#f2d6d6' }
    //     case 4: 
    //       return { background: '#ffffce' }
    //   }
    // },
    childCreate(params) {
      addremark(params).then(res => {
        console.log(res)
        this.dataInit()
      })
    },
    handleSizeChange(v) {
      this.pageSize = v
      this.dataInit()
    },
    handleCurrentChange(v) {
      this.currentPage = v
      this.dataInit()
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
    lastlistenFormatter(v) {
      console.log(v)
      let str = ''
      for(let k in v.data.listen){
        str += v.data.listen[k]
      }
      return str
    },
    handledFormatter(v) {
      return v.data.handled ? '已处理' : '未处理'
    },
    platformFormatter(v) {
      // console.log(v)
      // console.log(this.platform)
      let val = v.data.spyid

      let res = this.platform.filter(i => {
        return i.value === val
      })

      console.log(res)
      // return res[0].label || ''
      return res[0] ? res[0].label : ''
    },
    genderFormatter(v) {
      switch(v.data.gender){
        case 0:
          return '不限';
          break;
        case 1:
          return '男';
          break;
        case 2:
          return '女';
          break;
        case 3:
          return '男和女';
          break;
      }
    },
    starttimeFormatter(v) {
      // console.log(`${v.value}000`)
      // getter
      // return new Date(Number(`${v.data.starttime}000`)).format("yyyy-MM-dd hh:mm:ss")
      // formatter
      return new Date(Number(`${v.value}000`)).format("yyyy-MM-dd hh:mm:ss") 
    },
    durationFormatter(v) {
      // console.log('durationFormatter')
      // console.log(v)
      return this.Utils.formatTime(v.data.endtime - v.data.starttime)
    },
    durationComparator(valueA, valueB, nodeA, nodeB, isInverted) {

      return ((nodeA.data.endtime - nodeA.data.starttime) - (nodeB.data.endtime - nodeB.data.starttime))
    },
    segmentsFormatter(v) {
      // console.log(v)
      if(v.value){
        return '已转写'
      }else{
        return '未转写'
      }
    },
    callerDangrousFormatter(v) {
      return v.value ? `${v.value[0].rule} : ${v.value[0].remark}` : ''
    },
    calleeDangrousFormatter(v) {
      return v.value ? `${v.value[0].rule} : ${v.value[0].remark}` : ''
    },
    langScoreFormatter(v) {
      return v.value ? Number(v.value).toFixed(2) : ''
    },
    downloadVoice() {

      let url = downloadurl, data = this.gridOptions.api.getSelectedRows()

      console.log(data)

      if(data.length === 0){
        return
      }
      
      for(let k in data){
        url += `"${data[k].callid}",`
      }
      url = url.replace(/,$/,']')
      // window.open(url)
      window.location.href = url
    },
    turnToDetail1(v) {
      console.log(v)
      let list = []
      for(let k in this.rowData){
        list.push(this.rowData[k].callid)
      }
      if(v.data.status === 0){
        let params = new URLSearchParams()
        params.append('callid',v.data.callid)
        params.append('spyid',v.data.spyid)
        params.append('status',1)
        params.append('billLevel',v.data.billLevel)

        changecallstatusAndaddListen(params).then(res => {
          console.log(res)
          let rowNode = this.gridOptions.api.getRowNode(v.node.id);

          rowNode.setDataValue('status', 1);
        })
      }else{
        let params = new URLSearchParams()
        params.append('callid',v.data.callid)
        params.append('spyid',v.data.spyid)
        addlisten(params).then(res => {
          console.log(res)
        })
      }
      // this.QL_DATA({
      //   caller: v.data.caller,
      //   callee: v.data.callee,
      //   starttime: v.data.starttime,
      //   opname: 'admin',
      //   returnTo: '/search/resultList'
      // })
      
      // this.$router.replace({path: '/search/quickListen'})
      let d = new Date()
      this.NEWQL_DATA({
        dateFlag: d,
        type: 'ql',
        callid: v.data.callid,
        callidList: list
      })

    },
    turnToDetail(v){
      
      this.gridOptions.api.deselectAll()
      v.node.setSelected(true)
      let d = new Date()
      this.NEWQL_DATA({
        dateFlag: d,
        type: 'ql',
        callid: v.data.callid,
      })
      this.BILL_STATUS({     
        reset: true
      })
      this.changeStatus(v.node)

    },
    changeStatus(node){
      let v = node
      console.log('changeStatus')
      console.log(v)
      if(v.data.status === 0){
        let params = new URLSearchParams()
        params.append('callid',v.data.callid)
        params.append('spyid',v.data.spyid)
        params.append('status',1)
        params.append('billLevel',v.data.billLevel)

        changecallstatusAndaddListen(params).then(res => {
          let rowNode = this.gridOptions.api.getRowNode(node.id);
          // rowNode.setDataValue('status', 1);
          v.data.status = 1
          rowNode.setData(v.data)
        })
      }else{
        let params = new URLSearchParams()
        params.append('callid',v.data.callid)
        params.append('spyid',v.data.spyid)
        addlisten(params).then(res => {
          console.log(res)
        })
      }
    },
    onModelUpdated (param) {
    //   console.log('onModelUpdated--param', param); //会存在3次
    },
    onGridReady() {
    //   console.log('onGridReady');
      // this.gridOptions.api.sizeColumnsToFit()
      // utils.autosize(this.gridOptions)
      // this.localeText = localeText
      if(window.innerWidth < 1920){
        this.Utils.autosize(this.gridOptions)
      }else{
        this.gridOptions.api.sizeColumnsToFit()
      }
    },
    rowSelected(v) {

      let arr = this.gridOptions.api.getSelectedRows()

      //download
      arr.length === 0 ? this.downloadBtn = true : this.downloadBtn = false

    },
    dataInit() {
    //   this.taskId = this.getTaskId()
      console.log('dataInit')
      // this.i = 0
      let params = new URLSearchParams()
    //   params.append('taskid',this.taskId)
      params.append('taskid', this.taskid) // props
      params.append('start',(this.currentPage-1)*this.pageSize)
      params.append('limit',this.pageSize)
      this.loading = true
      getTaskResult(params).then(res => {
        // console.log('this.taskId')
        // console.log('mounted')
        console.log('getTaskResult')
        console.log(res)
        var data = res.data.records
        if(res.data.total!=0 && res.data.success){
          this.disExport = false
        }else{
          this.disExport = true
        }
        console.log('this.disExport')
        console.log(this.disExport)
        for(var k in data){
          data[k].number = Number(k)+1
          this.rowData.push(data[k])
        }
        this.rowData = res.data.records || []
        this.totalPage = res.data.total || 0
        this.loading = false
        this.loading2 = false
        // console.log('typeof this.totalPage')
        // console.log(typeof this.totalPage)
      })
    },
    // returnCondition() {
    //   this.$router.replace({path: '/search/condition'})
    // },
    valueChange(event) {
        // console.log('valueChange -- event:', event) // 本函数会被子组件node.setDataValue触发
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
  destroyed() {}
}
</script>

<style scoped lang="scss">
.resultList{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .table {
        .table_head {
            .left {
                .title {
                    font-size: 16px;
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
    // .head {
    //     ul {
    //         display: flex;
    //         li {
    //             margin-right: 10px;
    //         }
    //     }
    // }
    // border: 1px solid #000;
    // padding: 20px;
}
</style>
