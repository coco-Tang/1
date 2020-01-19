<template>
  <div class="mkeywordSelect keywordSelect">
    <el-dialog
      title="关键词"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="cancel"
      width="calc(30% + 300px)">
      <div class="head">
         
        <div class="left">
          <el-input v-model="keywords" :disabled="hitKeyword" @clear="clearBtn" clearable autofocus="true" placeholder="请输入或选择关键词,支持逻辑或 与(+)非(~)"></el-input>
        </div>
        <div class="right">
          <ul>
            <li>
              <el-checkbox :disabled="invalidFlag" v-model="hitKeyword" label="任意中标关键词"></el-checkbox>
            </li>
            <li>
              <span>逻辑关系:</span>
              <el-radio-group @change="radioChange" v-model="radio3" size="mini">
                <el-radio-button title="关键词加空格表示或逻辑" :label="1">或  </el-radio-button>
                <el-radio-button title='关键词加"+"表示与逻辑' :label="2">与(+)</el-radio-button>
                <el-radio-button title='关键词加"~"表示非逻辑' :label="3">非(~)</el-radio-button>
              </el-radio-group>
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

                @gridReady="onGridReady"
                @selection-changed="rowSelected"
                @rowSelected="singlerowSelected"
                @rowClicked="rowSelected1"
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
          <el-button type="primary" @click="getKeyWords">确定</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-button-group>
      </div>
    </el-dialog>    
  </div>
</template>

<script>

import {AgGridVue} from 'ag-grid-vue'
import {getKeywords} from '@/api/keywords.js'
import localeText from '../static/localeText.json'
import CheckBoxComponent from '@/components/CheckBoxComponent.vue'
import {mapActions,mapGetters} from 'vuex'
import * as utils from '@/utils/index'
export default {
  name: 'keywordSelect',
  data () {
    return {
      keywords:'',
      dialogVisible: false,
      radio: '|',
      radio3: 1,
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
          // headerCheckboxSelection: true,
          // checkboxSelection: true,
          suppressSizeToFit: true,
          width: 140,
          menuTabs: ['columnsMenuTab']
        },
        // {
        //   headerName: '非', 
        //   editable: false, 
        //   field: 'oppose',
        //   cellRendererFramework: CheckBoxComponent,
        //   suppressSizeToFit: true,
        //   width: 80,
        //   menuTabs: ['columnsMenuTab']
        // },
        {headerName: '关键词', editable: false, field: 'keyword',menuTabs: ['columnsMenuTab']},
        {headerName: '语种', editable: false, field: 'language',menuTabs: ['columnsMenuTab']},
        {headerName: '中标阈值', editable: false, field: 'threshold',menuTabs: ['columnsMenuTab']},
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
      platformOptions: [],
      onlineValue: -1,
      onlineOptions:[
        {
          value: -1,
          label: '不限'
        }, {
          value: 1,
          label: '上线'
        }, {
          value: 0,
          label: '下线'
        }
      ],
      langValue: '不限',
      langOptions:[
        {
          value: '不限',
          label: '不限'
        }, {
          value: '英语',
          label: '英语'
        }, {
          value: '汉语',
          label: '汉语'
        }, {
          value: '维语',
          label: '维语'
        }, {
          value: '沪语',
          label: '沪语'
        }, {
          value: '韩语',
          label: '韩语'
        }, {
          value: '日语',
          label: '日语'
        }, {
          value: '粤语',
          label: '粤语'
        }, {
          value: '法语',
          label: '法语'
        }, {
          value: '德语',
          label: '德语'
        }, {
          value: '哈萨克语',
          label: '哈萨克语'
        }, {
          value: '闽南语',
          label: '闽南语'
        }, {
          value: '俄语',
          label: '俄语'
        }, {
          value: '土耳其语',
          label: '土耳其语'
        }, {
          value: '安多藏语',
          label: '安多藏语'
        }, {
          value: '康巴藏语',
          label: '康巴藏语'
        }, {
          value: '拉萨藏语',
          label: '拉萨藏语'
        }, {
          value: '奉化语',
          label: '奉化语'
        }, {
          value: '宁波语',
          label: '宁波语'
        }, {
          value: '宁海语',
          label: '宁海语'
        }, {
          value: '象山语',
          label: '象山语'
        }, {
          value: '余慈语',
          label: '余慈语'
        }
      ],
      invalidFlag: false,
      hitKeyword: false,
      threshold: 60,
      cache:{
        hitKeyword: null,
        threshold: null,
        keywords: null
      },
      count: 0
    }
  },
  props: {

  },
  components: {
    'ag-grid-vue': AgGridVue,
    CheckBoxComponent: CheckBoxComponent
  },
  methods: {
    ...mapGetters(['getPlatform','getMonitorCondition']),
    clearBtn(v) {
      this.gridOptions.api.deselectAll()
      // if(v == ''){
      //   this.gridOptions.api.deselectAll()
      // }
    },
    radioChange(v) {
      this.gridOptions.api.deselectAll()
    },
    showDialog(keywords) {
      this.keywords = keywords
      if(this.count<1){
        this.setMonitorData()
        this.count++
      }
      
      
      
      // console.log('showDialog')
      // console.log(this.gridOptions)
      this.dialogVisible = true
      if(this.gridOptions.api){
        this.gridOptions.api.deselectAll()
      }
      // console.log(this.gridOptions)
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
    keywordsFormat(data) {
      let str = "";
      if (data.keywordsAnd) {
        for (let i = 0; i < data.keywordsAnd.length; i++) {
          str += `+${data.keywordsAnd[i]}`;
        }
      }
      if (data.keywords) {
        for (let i = 0; i < data.keywords.length; i++) {
          str += ` ${data.keywords[i]}`;
        }
      }
      if (data.keywordsNon) {
        for (let i = 0; i < data.keywordsNon.length; i++) {
          str += `~${data.keywordsNon[i]}`;
        }
      }

      // if (str[0] === "+" || str[0] === " ") {
      //   str = str.substr(1);
      // }
      if (str[0] === " ") {
        str = str.substr(1);
      }
      this.keywords = str;
    },
    dataInit() {
      console.error('datainit')
      // this.keywords = ''
      // console.log('child mounted')
      // this.platformOptions = this.getPlatform().platformOptions
      let params = new URLSearchParams()
      params.append('start',(this.currentPage-1)*this.pageSize)
      params.append('limit',this.pageSize)


      // params.append('language',this.langValue)
      // params.append('onlineStatus',this.onlineValue)


      getKeywords(params).then(res => {
        // console.log('child getKeywords')
        // console.log(res)
        let data = res.data.records
        for(let k in data){
          data[k].number = Number(k)+1
          data[k].oppose = false
          this.rowData.push(data[k])
        }
        this.rowData = res.data.records
        this.totalPage = res.data.total
        // console.log('this.rowData')
        // console.log(this.rowData)
      })
    },
    onGridReady() {
      // console.log('endif')  
      // this.gridOptions.api.sizeColumnsToFit()
      // utils.autosize(this.gridOptions)
      // this.localeText = localeText
      if(window.innerWidth < 1600){
        this.Utils.autosize(this.gridOptions)
      }else{
        this.gridOptions.api.sizeColumnsToFit()
      }
    },
    singlerowSelected(v) {
      return
      // console.log('singlerowSelected')
      // console.log(v)
      if(!v.node.selected){
        return
      }
      switch (this.radio3){
        case 1:
          this.keywords += ` ${v.data.keyword}`
          break;
        case 2:
          this.keywords += `+${v.data.keyword}`
          break;
        case 3:
          this.keywords += `~${v.data.keyword}`
          break;
      }
    },
    rowSelected1(v) {
      if(this.hitKeyword){
        return
      }
      switch (this.radio3){
        case 1:
          this.keywords += ` ${v.data.keyword}`
          break;
        case 2:
          this.keywords += `+${v.data.keyword}`
          break;
        case 3:
          this.keywords += `~${v.data.keyword}`
          break;
      }
    },
    rowSelected(v,a,b,c) {
      return
      let arr = this.gridOptions.api.getSelectedRows();
      return
      console.log('rowSelected')
      console.log('arr')
      console.log(arr)
      // console.log('v')
      // console.log(v)
      // console.log(a)
      // console.log(b)
      // console.log(c)
    },
    getKeyWords() {
      let arr = this.gridOptions.api.getSelectedRows()
      // let str = ''
      // let arrs = [[],[],[]]
      // console.log(arr)
      // for(let k in arr){
      //   if(!arr[k].oppose){
      //     str += this.radio + arr[k].keyword
      //     if(this.radio == '+'){
      //       arrs[0].push(arr[k].keyword)
      //     }else{
      //       arrs[1].push(arr[k].keyword)
      //     }
      //   }        
      // }
      // // console.log(this.rowData)
      // for(let k in this.rowData){
      //   if(this.rowData[k].oppose){
      //     str += "!" + this.rowData[k].keyword
      //     arrs[2].push(this.rowData[k].keyword)
      //   }      
      // }

      // str = this.keywords + str
      // if(str[0] === '+' || str[0] === '|'){
      //   str = str.substr(1)
      // }


      if(this.hitKeyword){
        this.keywords = ''
      }
      this.cache.hitKeyword = this.hitKeyword
      this.cache.threshold = this.threshold
      this.cache.keywords = this.keywords
      // return
      this.$emit('setKeyWords',this.keywords,this.hitKeyword,this.threshold)
      this.dialogVisible = false
    },
    cancel() {
      // for(let k in this.rowData){
      //   if(this.rowData[k].oppose){
      //     this.rowData[k].oppose = false
      //   }      
      // }

      // this.$emit('setKeyWords','')
      if(this.$route.path === '/monitor'){
        this.hitKeyword = this.cache.hitKeyword
        this.threshold = this.cache.threshold 
        this.keywords = this.cache.keywords 
      }else{
        this.hitKeyword = false
        this.threshold = 60
        this.keywords = ''
      }
      this.$emit('setKeyWords',this.keywords,this.hitKeyword,this.threshold)
      this.dialogVisible = false
    },
    langValueChange(v){
      // this.dataInit('language',v)
      this.dataInit()
    },
    onlineValueChange(v){
      // this.dataInit('onlineStatus',v)
      this.dataInit()
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
        this.hitKeyword = data.hitKeyword
        this.threshold = data.keywordThreshold
        this.keywordsFormat(data)
        this.cache.hitKeyword = this.hitKeyword
        this.cache.threshold = this.threshold
        this.cache.keywords = this.keywords
      }
    }
    // getOppose(obj) {
    //   console.log('@childHandle="getOppose(obj)"')
    //   console.log(obj)
    // }
  },
  beforeCreate() {

  },
  created() {
    this.localeText = localeText;
  },
  beforeMount() {
    this.gridOptions = {
        context: {
            componentParent: this
        }
    };

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

.keywordSelect{
  line-height: normal;
  width: 100%;
  // height: 500px;
  display: flex;
  flex-direction: column;
  .head{
    display: flex;
    flex-direction: column;
    height: 70px;
    margin-bottom: 10px;
    
    .left{
      // width: calc(100% - 220px);
      width: 100%;
      min-width: 150px;
      // padding-bottom: 10px;

    }
    .right{
      // width: 220px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      align-items: center;
      // margin-left: auto;

      display: flex;
      flex-wrap: nowrap;
      span{
        flex-shrink: 0;
        margin: 0 5px;
      }
      ul{
        display: flex;
        line-height: 30px;
        justify-content: space-between;
        width: 100%;
        li{
          &:nth-child(1){

          }
          &:nth-child(2){
            
          }
          &:nth-child(3){
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
.mkeywordSelect{
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