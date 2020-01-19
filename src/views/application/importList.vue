<template>
  <div class="importList">
    <!-- <remarkComponent @setRemark="childCreate3" :update-msg="updateMsg" ref="c3"></remarkComponent>
    
    <importVoiceBacth-dialog @setImportBatch="childCreate2" :update-msg="updateMsg" ref="c2"></importVoiceBacth-dialog> -->
    <importVoice-dialog @setImport="childCreate" :update-msg="updateMsg"  ref="c1"></importVoice-dialog>

    <div class="table">
      <div class="table_head">
        <div class="left">
            <span class="title">语音列表</span>
            <el-button type="primary" @click="back" :style="{'margin-left':'20px'}">返回</el-button>
        </div>
        <div class="right">
          <el-button type="primary" @click="newImport" :disabled='isProcessed'>导入</el-button>
          <el-button type="primary"  :disabled="deleteBtn" @click="confirmDelete" class='del'>删除</el-button>
        </div>
      </div>
      <div class="table_content" v-loading="loading" element-loading-text="加载中">
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
      <div class="table_pagination">
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

import { AgGridVue } from 'ag-grid-vue'
import { mapActions, mapGetters } from 'vuex'

import cellFileName from '@/components/table/cellFileName.vue'
import cellCreator from '@/components/table/cellCreator.vue'
import cellCreateTime from '@/components/table/cellCreateTime.vue'
// import cellProcessFlag from '@/components/table/cellProcessFlag.vue'

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

import { //uploadVoicesInfo, getTaskMediaCount,
    getTaskVoices, deleteVoicesInfo } from '@/api/impMedia'
import * as utils from '@/utils/index'
import localeText from '../../static/localeText.json'
import { url1 } from '@/api/player.js'

import remarkComponent from '@/components/dialog/remarkDialog.vue'
import importVoiceDialog from '@/components/dialog/importVoiceDialog.vue'
// import importVoiceBacthDialog from '@/components/dialog/importVoiceBatchDialog.vue'

import headerComponent from '@/components/table/headerComponent.vue'
import statusCellComponent from '@/components/table/statusCellComponent.vue'
import downloadCellComponent from '@/components/table/downloadCellComponent.vue'

// import axios from "axios";

export default {
  name: 'importList',
  data () {
    return {
      isProcessed: false,
      callidList: [],
      loading: false,
      i: 0,
      totalPage: 0,
      currentPage: 1,
      pageSize: 15,
      taskId: '',
      value2: '',

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
      suppressCopyRowsToClipboard: true,

      columnDefs: [
        {
          headerName: '序号', 
          editable: false, 
          headerCheckboxSelection: true,
          checkboxSelection: true,
          field: 'number',
          // valueFormatter: this.numberFormatter,
          suppressSizeToFit: true,
          width: 140,
          menuTabs: ['columnsMenuTab']
        },
        {
          headerName: '任务名', 
          editable: false,
          menuTabs: ['columnsMenuTab'],
          minWidth: 80,
          valueGetter: (params) => params.data.appended.importinfo.id || ''
        },
                {
          headerName: '状态', 
          editable: false,
          field: 'status',
          minWidth: 190,
          menuTabs: ['columnsMenuTab'],
          cellRendererFramework: 'statusCellComponent',
        },
        {
          headerName: '文件名', 
          editable: false,
          cellRendererFramework: cellFileName,
          menuTabs: ['columnsMenuTab'],
          minWidth: 140
        },
        {
          headerName: '导入人',
          editable: false,
          cellRendererFramework: cellCreator,
          menuTabs: ['columnsMenuTab'],
          // valueFormatter: this.test,
        },
        {
          headerName: '导入时间', 
          editable: false,
          cellRendererFramework: cellCreateTime,
          menuTabs: ['columnsMenuTab'],
          width: 200
        },
        {
          headerName: '语种', 
          editable: false, 
          hide: false,
          field: 'languagename',
          menuTabs: ['columnsMenuTab'],
          valueFormatter: this.langFormatter
        },
        {
          headerName: '性别', 
          editable: false, 
          field: 'gender',
          menuTabs: ['columnsMenuTab'],
        },
        {
          headerName: '是否无效音', 
          editable: false, 
          field: 'valid',
          menuTabs: ['columnsMenuTab'],
          valueGetter: (params) => {
            if (params.data.valid) {
              return '有效音'
            } else {
              return '无效音'
            }
          },
        },
        {
          headerName: '处理内容',
          editable: false,
          hide: true,
          field: 'processflag',
        //   cellRendererFramework: cellProcessFlag,
          menuTabs: ['columnsMenuTab'],
          valueFormatter: this.processFlagFormatter,
          tooltip: (v) => {
            return this.processFlagFormatter(v);
          },
          minWidth: 200,
        },
        {
          headerName: '中标结果', 
          editable: false,
          cellRendererFramework: 'targetComponent',
          menuTabs: ['columnsMenuTab'],
          minWidth: 140
        },
        {
          headerName: '调听人', editable: false, menuTabs: ['columnsMenuTab'],
          hide: false, valueGetter: this.listenerFormatter,
        },
        {
          headerName: '主叫号码', 
          editable: false, 
          hide: true,
          field: 'caller',
          cellRendererFramework: 'callerComponent',
          menuTabs: ['columnsMenuTab']
        },
        {
          headerName: '被叫号码', 
          editable: false, 
          hide: true,
          field: 'callee',
          cellRendererFramework: 'calleeComponent',
          menuTabs: ['columnsMenuTab']
        },
        {
          headerName: '检索结果', 
          editable: false,
          hide: true,
          // field: 'sort',
          cellRendererFramework: 'targetHitComponent',
          menuTabs: ['columnsMenuTab']
          // width: 600
        },
        {
          headerName: '通话时间', 
          editable: false, 
          hide: true,
          field: 'starttime',
          valueFormatter: this.starttimeFormatter,
          menuTabs: ['columnsMenuTab']
        },
        {
          headerName: '通话时长', 
          editable: false,
          hide: true,
          valueFormatter: this.durationFormatter,
          comparator: this.durationComparator,
          menuTabs: ['columnsMenuTab']
        },
        {
          headerName: '结果返回时间', 
          editable: false,
          hide: true,
          field: 'recvtime',
          menuTabs: ['columnsMenuTab']
        },
        // {
        //   headerName: '来源平台', 
        //   editable: false,
        //   hide: true,
        //   field: 'spyid',
        //   valueGetter: this.platformFormatter,
        //   menuTabs: ['columnsMenuTab']
        // },
        {
          headerName: 'callid', 
          editable: false,
          hide: true,
          field: 'callid',
          menuTabs: ['columnsMenuTab']
        },
        // {
        //   headerName: '下载', 
        //   editable: false,
        //   hide: true,
        //   field: '',
        //   width: 80,
        //   menuTabs: ['columnsMenuTab'],
        //   headerComponentFramework: 'headerComponent',
        //   cellRendererFramework: 'downloadCellComponent',
        //   pinned: 'right'
        // }
      ],
      allData: [],
      rowData:[],  
      localeText:{},
      updateMsg:{
        ifUpdate: false,
        data:{}
      },
      deleteBtn: true,
      downloadBtn: true,
      updateMsg:{
        ifUpdate: false,
        data:{}
      },
    }
  },
  components: {
    'ag-grid-vue': AgGridVue,
    cellFileName: cellFileName,
    cellCreator: cellCreator,
    cellCreateTime: cellCreateTime,
    // cellProcessFlag: cellProcessFlag,
    statusComponent: statusComponent,
    levelComponent: levelComponent,
    targetComponent: targetComponent,
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
    'importVoice-dialog': importVoiceDialog,
    // 'importVoiceBacth-dialog': importVoiceBacthDialog,

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
  watch: {
    getComNext(){
      let data = this.getNextRecord()

      this.gridOptions.api.forEachNode((node,index)=>{
        if(node.data.callid === data.callid){
          this.gridOptions.api.deselectAll()
        //   console.error('getComNext')
        //   console.log(this.getNextRecord())
        //   console.log(this.gridOptions.api.getRowNode(index+1))
          let d = new Date()

          if(this.getNextRecord().next && this.gridOptions.api.getRowNode(index+1)){
            this.PLAYER_DATA({
              dateFlag: d,
              type: 'ql',
              callid: this.gridOptions.api.getRowNode(index+1).data.callid,
              starttime: this.gridOptions.api.getRowNode(index + 1).data.starttime
            })
            this.changeStatus(this.gridOptions.api.getRowNode(index+1))
            this.gridOptions.api.getRowNode(index+1).setSelected(true)
            this.gridOptions.api.ensureIndexVisible(index + 1,'middle')

          }else if(!this.getNextRecord().next && this.gridOptions.api.getRowNode(index-1)){
            this.PLAYER_DATA({
              dateFlag: d,
              type: 'ql',
              callid: this.gridOptions.api.getRowNode(index-1).data.callid,
              starttime: this.gridOptions.api.getRowNode(index - 1).data.starttime
            })
            this.changeStatus(this.gridOptions.api.getRowNode(index-1))
            this.gridOptions.api.getRowNode(index-1).setSelected(true)
            this.gridOptions.api.ensureIndexVisible(index - 1,'middle')
          }else{
            this.gridOptions.api.getRowNode(index).setSelected(true)
            this.gridOptions.api.ensureIndexVisible(index,'middle')
          }

          
        }
      })

    },
    getBill(){

      let node = this.gridOptions.api.getSelectedNodes()[0]
      let data = this.getBillStatus()

      let rowNode = this.gridOptions.api.getRowNode(node.id);
      let cache = 0

      if (data.status) {
        node.data.appended.veracityMark = data.status;
        rowNode.setData(node.data);
      }
      if (data.level || data.level == 0) {
        node.data.appended.calllevel = data.level;
        rowNode.setData(node.data);
        cache = rowNode.data.status;
        node.data.status = 100;
        rowNode.setData(node.data);
        node.data.status = cache;
        rowNode.setData(node.data);
      }
      if (data.gender) {
        node.data.gender = data.gender;
        rowNode.setData(node.data);
        cache = rowNode.data.status;
        node.data.status = 100;
        rowNode.setData(node.data);
        node.data.status = cache;
        rowNode.setData(node.data);
      }
      if (data.language) {
        node.data.languagename = data.language;
        rowNode.setData(node.data);
        cache = rowNode.data.status;
        node.data.status = 100;
        rowNode.setData(node.data);
        node.data.status = cache;
        rowNode.setData(node.data);
      }
    }
  },
  methods:{
    ...mapActions(['IMPORTTASK_ID','QL_DATA','NEWQL_DATA','BILL_STATUS',
                    'PLAYER_DATA']),
    ...mapGetters(['getImportTaskId','getPlatform','getNextRecord','getBillStatus',
                   'getTaskId','getImoprtState']),
    confirmDelete() {
        utils.confirmBox(this,'确定删除选中批次?', this.callDel)
    },
    callDel() {
        let selectRows = this.gridOptions.api.getSelectedRows(), idArr = []
        selectRows.forEach(e => idArr.push(e.appended.importinfo.id))

        let p = new URLSearchParams()
        p.append('ids', idArr)
        p.append('type', 1)
        this.loading = true

        deleteVoicesInfo(p, this.getTaskId())
            .then(res => {
                if (res.data.status === 200) {
                    this.loading = false
                    this.dataInit()
                }
            })
            .catch(err => {
                this.$message.error({
                    message: JSON.stringify(err.response.data)
                })
            })
    },
    formatTime(v) {
        console.log('%cformatTime -- v:', 'color:green', v)
        if (v.value === null) {
            return ''
        } else {
            return new Date(v.value).format('yyyy-MM-dd hh:mm:ss')
        }
    },
    listenerFormatter(v) {
      let s = new Set()
      for (let k in v.data.appended.listeners) {
        s.add(v.data.appended.listeners[k].user)
      }
      return [...s]
    },
    langFormatter(v) {
      // console.log(v)
      v = v.value
      if(v=='bqd'){
        return '不确定'
      }else if(v=='qtyz'){
        return '其他语种'
      }
      return v
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

          this.$refs.c3.showDialog()
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
    // childCreate3(params) {
    //   addremark(params).then(res => {
    //     console.log(res)
    //     this.dataInit()
    //   })
    // },
    // downloadVoice() {
    //   // console.log(this.gridOptions.api.getSelectedRows())
    //   let url = downloadurl, data = this.gridOptions.api.getSelectedRows()
    //   for(let k in data){
    //     url += `"${data[k].callid}",`
    //   }
    //   url = url.replace(/,$/,']')
    //   // window.open(url)
    //   window.location.href = url
    // },
    // deleteConfirm() {
    //   utils.confirmBox(this,'确定删除选中语音?',this.mydeleteHandle)
    // },
    // mydeleteHandle() {
    //   let params = new URLSearchParams()
    //   // params.append('data',`${this.gridOptions.api.getSelectedRows()}`)
    //   params.append('data',JSON.stringify(this.gridOptions.api.getSelectedRows()))
    //   params.append('taskid',this.taskId)
    //   deleteVoice(params).then(res => {
    //     console.log(res)
    //     this.dataInit()
    //   })
    //   console.log('deleteVoice')
    //   console.log(this.gridOptions.api.getSelectedRows())
    // },
    handleSizeChange(v) {
      this.pageSize = v
      this.dataInit()
    //   this.rowData = this.allData.slice((this.currentPage-1)*v, this.currentPage*v)
    },
    handleCurrentChange(v) {
      this.currentPage = v
      this.dataInit()
    //   this.rowData = this.allData.slice((v-1)*this.pageSize, v*this.pageSize)
    },
    // startHandle() {
    //   var timer = setInterval(() =>{

    //     this.schedule += 10
    //     if(this.schedule>=100){
    //       clearInterval(timer)
    //       this.schedule = 100
    //     }
        
    //   },500)
    // },
    genderFormatter(v) {
      switch(v.value){
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
      if (!v.value) {
          return ''
      } else {
          if (v.value < 11) {
              return new Date(Number(`${v.value}000`)).format("yyyy-MM-dd hh:mm:ss")
          } else {
              return new Date(Number(`${v.value}`)).format("yyyy-MM-dd hh:mm:ss")
          }
      }
    },
    durationFormatter(v) {
      // console.log('durationFormatter')
      // console.log(v)
      return utils.formatTime(v.data.endtime - v.data.starttime)
    },
    durationComparator(valueA, valueB, nodeA, nodeB, isInverted) {

      return ((nodeA.data.endtime - nodeA.data.starttime) - (nodeB.data.endtime - nodeB.data.starttime))
    },
    platformFormatter(v) {
      let val = v.data.spyid

      let res = this.platform.filter(i => {
        return i.value === val
      })
      return res[0] ? res[0].label : ''
    },
    segmentsFormatter(v) {
      if(v.value){
        return '已转写'
      }else{
        return '未转写'
      }
    },
    handledFormatter(v) {
      return v.data.handled ? '已处理' : '未处理'
    },
    test(v){
      console.log('test')
      console.log(v)
    },
    processFlagFormatter(v) {
      let flags = v.value
      let mapping = {
        'char' : ['有效音检测', '语种检测', '性别检测', '声纹检测', '固定音频检测', '端点检测', '拨号音检测', '关键词检测', '全文转写'],
        'code' : [1, 2, 4, 8, 16, 32, 64, 128, 256]
      }
      let restore = (flags) => {
        let arr = []
        mapping['code'].map((e,i) => {
          if (flags & e) {
            arr.push(mapping['char'][i])
          }
        })
        return arr.join(', ')
      }
      return restore(flags)
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
    // numberFormatter() {
    //   console.log(this.i)
    //   return ++this.i
    // },
    // window.location.href = '/#/login' 
    newImport() {
    //   this.updateMsg.ifUpdate = true
    //   this.updateMsg.data = this.name
      this.$refs.c1.showDialog()
    },
    // newImportBatch() {
    //   this.updateMsg.ifUpdate = true
    //   this.updateMsg.data = this.name
    //   this.$refs.c2.showDialog()
      
    // },
    childCreate(params) {
        this.loading = true
        uploadVoice(params)
            .then(res => {
                this.dataInit()
            }).catch(err => {
                console.error('uploadVoice.err:', err.response.data.msg)
            })
      // console.log(params)

      // if(this.updateMsg.ifUpdate){
      //   speechsegUpdate(params).then(res => {
      //     console.log(res)
      //     this.updateMsg.ifUpdate = false
      //     this.dataInit()
      //   })
      // }else{
      //   uploadVoice(params).then(res => {
      //     console.log(res)
      //     this.dataInit()
      //   })
      // }
    },
    // childCreate2(params,files) {
    //   this.dataInit()
    // },
    // turnToDetail1(v) {
    //   console.log(v)

    //   let list = []
    //   for(let k in this.rowData){
    //     list.push(this.rowData[k].callid)
    //   }
    //   if(v.data.status === 0){
    //     let params = new URLSearchParams()
    //     params.append('callid',v.data.callid)
    //     params.append('spyid',v.data.spyid)
    //     params.append('status',1)
    //     params.append('billLevel',v.data.billLevel)

    //     changecallstatusAndaddListen(params).then(res => {
    //       console.log('changecallstatus res')
    //       console.log(res)

    //       let rowNode = this.gridOptions.api.getRowNode(v.node.id);

    //       rowNode.setDataValue('status', 1);

    //     })
    //   }else{
    //     let params = new URLSearchParams()
    //     params.append('callid',v.data.callid)
    //     params.append('spyid',v.data.spyid)
    //     addlisten(params).then(res => {
    //       console.log(res)
    //     })
    //   }
    //   // this.QL_DATA({
    //   //   caller: v.data.caller,
    //   //   callee: v.data.callee,
    //   //   starttime: v.data.starttime,
    //   //   opname: 'admin',
    //   //   returnTo: '/search/importList'
    //   // })
    //   let duration = v.data.endtime - v.data.starttime
    //   let d = new Date()
    //   this.NEWQL_DATA({
    //     dateFlag: d,
    //     type: 'ql',
    //     callid: v.data.callid,
    //     callidList: list,
    //     duration: duration
    //   })

    //   // this.gridOptions.api.refreshCells('status')
    //   // console.log('this.gridOptions.refreshCells')
    //   // console.log(this.gridOptions.api.refreshCells)

    //   // this.$router.replace({path: '/search/quickListen'})
    // },
    turnToDetail(v){
      this.gridOptions.api.deselectAll()
      v.node.setSelected(true)
      let d = new Date(),
        callid = v.data.callid;
      this.PLAYER_DATA({
        dateFlag: d,
        type: 'ql',
        callid: v.data.callid,
        starttime: v.data.starttime
        // callid: `${url1}/records/${callid}/files?fileTag=combiner`,
      })
    //   this.BILL_STATUS({     
    //     reset: true
    //   })
      this.changeStatus(v.node)

    },
    changeStatus(node){
      let v = node
      if(!v.data.appended.listeners){
        let rowNode = this.gridOptions.api.getRowNode(node.id);
        v.data.appended.listeners = []
        rowNode.setData(v.data)
      }
    },
    // changeStatus(node){
    //   let v = node
    //   console.log('changeStatus')
    //   console.log(v)
    //   if(v.data.status === 0){
    //     let params = new URLSearchParams()
    //     params.append('callid',v.data.callid)
    //     params.append('spyid',v.data.spyid)
    //     params.append('status',1)
    //     params.append('billLevel',v.data.billLevel)

    //     changecallstatusAndaddListen(params).then(res => {
    //       let rowNode = this.gridOptions.api.getRowNode(node.id);
    //       // rowNode.setDataValue('status', 1);
    //       v.data.status = 1
    //       rowNode.setData(v.data)
    //     })
    //   }else{
    //     let params = new URLSearchParams()
    //     params.append('callid',v.data.callid)
    //     params.append('spyid',v.data.spyid)
    //     addlisten(params).then(res => {
    //       console.log(res)
    //     })
    //   }
    // },
    onGridReady() {
      // this.gridOptions.api.sizeColumnsToFit()
      // utils.autosize(this.gridOptions)
      // this.localeText = localeText
      if (window.innerWidth < 1280) {
        this.Utils.autosize(this.gridOptions)
      } else {
        this.gridOptions.api.sizeColumnsToFit()
      }
    },
    rowSelected(v) {
      console.log(`-----------------------------------`)
      console.log(this.gridOptions.api.getSelectedRows())
      console.log(`------------------------------`)

      let arr = this.gridOptions.api.getSelectedRows()
      // console.log(this.gridOptions.api.getSelectedRows().length!=0)
      // 
      // 
      //delete
      arr.length === 0 ? this.deleteBtn = true : this.deleteBtn = false

      //download
      arr.length === 0 ? this.downloadBtn = true : this.downloadBtn = false


    },
    // dataInit() {
    //   this.taskId = this.getImportTaskId().id
    //   this.name = this.getImportTaskId().name
    //   console.log('dataInit')
    //   console.log(this.taskId)
    //   console.log(this.name)
    //   // this.i = 0
    //   let params = new URLSearchParams()
    //   params.append('taskid',this.taskId)
    //   params.append('start',(this.currentPage-1)*this.pageSize)
    //   params.append('limit',this.pageSize)
    //   this.loading = true
    //   getImportvoice(params).then(res => {
    //     console.log('this.taskId')
    //     // console.log('mounted')
    //     console.log(res)
    //     if(res.data.records.length == 0 && this.currentPage!=1){
    //       --this.currentPage
    //       this.dataInit()
    //     }
    //     var data = res.data.records
    //     for(var k in data){
    //       data[k].number = Number(k)+1
    //       this.rowData.push(data[k])
    //     }
    //     this.rowData = res.data.records
    //     this.totalPage = res.data.total
    //     this.loading = false
    //     // console.log('typeof this.totalPage')
    //     // console.log(typeof this.totalPage)
    //   })
    // },
    dataInit() {
        this.rowData = []
        this.deleteBtn = true
        this.loading = true

        let query = new URLSearchParams()
        query.append('start', (this.currentPage-1)*this.pageSize)
        query.append('limit', this.pageSize)
        query.append('type', 1)
        // query.append('taskId', this.getTaskId())

        getTaskVoices(query, this.getTaskId())
            .then(res => {
                let data = res.data.records
                data.map((e,i) => {
                    e.number = i + 1
                    this.rowData.push(e)
                })
                // this.rowData = res.data.records.map((e,i) => {
                //     return {
                //         number: i+1,
                //     }
                // })
                // this.allData = data
                // this.rowData = this.allData.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize)
                // this.rowData = data
                this.totalPage = res.data.total
                this.loading = false
                if (this.rowData[0] && this.rowData[0].appended.importinfo.processStatus !== 0) {
                    this.isProcessed = true
                }
            })
            .catch(err => {
                this.loading = false
                console.error('getTaskVoices -- err:', err)
            })

    },
    back() {
      this.$router.replace({path: '/importVoice'})
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
  beforeCreate() {
    
  },
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
    }
  },
  mounted () {
    this.gridOptions.api.sizeColumnsToFit()
    utils.dateFormat()
    this.dataInit()
    this.platform = this.getPlatform().platformOptions
    if(this.getImoprtState() != 0){
      this.isProcessed = true
    }
  },
  beforeUpdate () {

  },
  updated() {

  },
  activated() {
    // console.log('activated')
    // if(this.taskId != this.getTaskId()){
    //   this.dataInit()
    // }
  },
  deactivated() {

  },
  beforeDestroy() {

  },
  destroyed() {

  }
}
</script>

<style scoped lang="scss">
	.importList {
		width: 100%;
		height: 100%;
        display: flex;
        flex-direction: column;
        .head {
            ul {
                display: flex;
                li {
                    margin-right: 10px;
                }
            }
        }
        .table {
            .title {
                font-size: 16px;
            }
        }
	}
</style>
<style lang="scss">
    .importList {
        .el-button {
            padding: 8px 20px !important;
        }
    }
</style>
