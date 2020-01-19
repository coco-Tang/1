<template>
  <div class="importVoiceDialog">
    <el-dialog
      title="添加语音文件"
      :before-close="closeDialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :width="dialogWidth">
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="批次名称" prop="langname">
          <el-select v-model="ruleForm.batch" 
            placeholder="请选择"
            filterable
            allow-create
            default-first-option
            @blur="batchBlur"
            :disabled="updateMsg.ifUpdate"
            >
            <el-option
              v-for="item in ruleForm.batchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item class="checkGroup batch" label="处理内容" prop="langname">
          <el-checkbox-group @change="checkboxChange" v-model="ruleForm.checkList">
            <el-checkbox label="2">声纹</el-checkbox>
            <el-checkbox label="4">关键词</el-checkbox>
            <el-checkbox label="64">DTMF</el-checkbox>
            <el-checkbox label="16">端点检测</el-checkbox>
            <!-- <el-checkbox label="1024">加窗关键词</el-checkbox> -->
            <el-checkbox label="8">全文转写</el-checkbox>
            <el-select allow-create style="width: 150px; margin: 0 20px" :disabled="disabled" v-model="ruleForm.recognize" placeholder="请选择">
              <el-option
                v-for="item in ruleForm.recognizeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>            
            <el-checkbox label="32">固定音频</el-checkbox>
          </el-checkbox-group>
          

        </el-form-item>
        <el-form-item label="语音文件" prop="file">
          <label class="fileBtn" for="batchfile">选择文件</label>
          <input multiple type="file" id="batchfile" @change="tirggerFile($event)">
          
        </el-form-item>
<!--         <el-form-item style="position: absolute;bottom:370px;right: 30px"><span>10/10条</span></el-form-item> -->
        <el-form-item class="count"><span>{{successNum}}/{{rowData.length}}条</span></el-form-item>
        

      </el-form>
      <div style="width: 100%; height: 300px">
        <ag-grid-vue style="width: 100%; height: 100%" class="ag-grid ag-theme-material"
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
            :gridReady="onGridReady"
            >
        </ag-grid-vue>  
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">移除全部</el-button>
        <el-button type="primary"  @click="uploadFile">上 传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {AgGridVue} from 'ag-grid-vue'
// import {speechsegCreate,getBatch,uploadBatchVoice} from '@/api/index.js'
// import { getBatchImportedData } from '@/api/impMedia'
import * as utils from '@/utils/index'
import localeText from '../../static/localeText.json'
import deleteComponent from '../deleteComponent.vue'
import progressComponent from '../progressComponent.vue'
import {mapActions,mapGetters} from 'vuex'
import axios from 'axios'

export default {
  name: 'importVoiceDialog',
  data () {
    return {
      successNum: 0,
      i: 1,
      index: 0,
      gridOptions: {}, 
      showToolPanel: false,
      enableColResize: true,
      headerHeight: 40,
      rowHeight: 40,
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressRowClickSelection: true,
      columnDefs: [
        {
          headerName: '序号', editable: false, field: 'number', menuTabs: ['columnsMenuTab'], width: 70, maxWidth: 70,
          // headerCheckboxSelection: true,
          // checkboxSelection: true,
          // valueFormatter: this.numberFormatter,
        },
        { headerName: '文件名', editable: false, field: 'name',menuTabs: ['columnsMenuTab'] },
        { headerName: '自定义文件名', editable: true, field: 'custName',menuTabs: ['columnsMenuTab'] },
        { headerName: '类型', editable: false, field: 'type',menuTabs: ['columnsMenuTab'], width: 70, maxWidth: 80 },
        { headerName: '大小', editable: false, field: 'size',menuTabs: ['columnsMenuTab'], width: 70, maxWidth: 80, },
        { headerName: '状态', editable: false, field: 'status',menuTabs: ['columnsMenuTab'], width: 70, maxWidth: 80 },
        {
          headerName: '', editable: false, field: 'progress', menuTabs: ['columnsMenuTab'], width: 120,
          cellRendererFramework: progressComponent, pinned: 'right'
        },
        {
          headerName: '', editable: false, field: 'mydelete', menuTabs: ['columnsMenuTab'], width: 30,
          cellRendererFramework: deleteComponent, pinned: 'right'
        }
        
      ],
      rowData:[
        // {
        //   number: 1,
        //   name: '333(aaa)_主叫话单_222_20180329095621_test.wav',
        //   custName: '333(aaa)_主叫话单_222_20180329095621_test.wav',
        //   type: 'audio/wav',
        //   size: '396.7KB',
        //   status: '等待上传'
        // },
      ],  
      localeText:{},


      ruleForm:{
        caller: '',
        callee: '',
        fileTable: [],
        file: [],
        threshold: 60,
        cases: '',
        casesOptions: [],
        sectionoffice: '',
        sectionofficeOptions: [],
        department: '',
        departmentOptions: [],
        assignee: '',
        assigneeOptions: [],
        telrules: '*',
        batch: '',
        batchLabel: '',
        batchOptions: [],
        datasource: ['000000'],
        datasourceOptions: [
          {
            value: '000000',
            label: '不限'
          },
          {
            value: '100',
            label: '优浪'
          },
          {
            value: '923',
            label: '十所'
          },
        ],
        recognize: '自动识别',
        recognizeOptions:[
          {
            value: '自动识别',
            label: '自动识别'
          },
          {
            value: '汉语',
            label: '汉语'
          },
          {
            value: '英语',
            label: '英语'
          },
          {
            value: '维语',
            label: '维语'
          },
        ],

        category: 0,
        categoryOptions:[
          {
            value: 0,
            label: '正常'
          },{
            value: 1,
            label: '排除'
          },{
            value: 2,
            label: '诈骗'
          }
        ],
        checkList: ['1','2','4','8','16','32','64','1024']

      },
      rules: {
        name: [
          { required: true, message: '请输入音频名称', trigger: 'blur' },
          { min: 2, message: '音频名称的最小长度是2个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入音频编号', trigger: 'blur' },
          { min: 2, message: '音频编号的最小长度是2个字符', trigger: 'blur' }
        ],

        telrules: [
          { required: true, message: '请输入固定音频的策略', trigger: 'blur' },
          // { min: 1, message: '请输入声纹的策略', trigger: 'blur' }
        ]

      },
      
      dialogVisible: false,

      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      disabled: false,
      // timrPicker: [],
      // startDate: '',
      // startTime: '',
      // endDate: '',
      // endTime: '',
      errorFile: [],
      dialogWidth: '900px'
    }
  },
  // props: ['myMessage']
  props: {
    updateMsg:Object
  },
  components: {
    'ag-grid-vue': AgGridVue,
    deleteComponent: deleteComponent,
    progressComponent: progressComponent
  },
  computed: {
    getComParams(){
      if(this.rowData[0]){
        return this.rowData[0].mydelete
      }
      
    },
    getTaskProgress1(){
      
      return this.$store.state.taskProgerss
    },  

    
  },
  watch: {
    // getComParams(){
    //   console.log('changed')
    // }
    getTaskProgress1(){
      this.percent = this.getTaskProgress()
      console.log('this.percent')
      console.log(this.percent)
    },
    rowData: {
  　　handler(newValue, oldValue) {
    // 　　for (let i = 0; i < newValue.length; i++) {
    //   　　if (newValue[i].mydelete) {
    //         this.rowData.splice(i,1)
    //         Array.prototype.splice.call(this.ruleForm.fileTable,i,1)
    //   　　}
    //   　}
        let index = newValue.findIndex( v => {
          return v.mydelete === true
        })
        // console.log('out')
        // console.log(index)
        let i 　
        if(index!=-1){
          console.log('in')
          console.log(index)
          console.log(this.rowData)
          this.rowData.splice(index,1)
          Array.prototype.splice.call(this.ruleForm.fileTable,index,1)
          for ( i = 0; i < this.rowData.length; i++) {
        　　this.rowData[i].number = i+1
        　}
          this.i = i+1
          this.index > 0 ? this.index-- : ''
        }
        
    　},
    　deep: true
  　}
  },
  methods: {
    ...mapGetters(['getTaskProgress','getAccount']),
    timeChange() {
      // console.log(this.timrPicker[0].format("yyyy-MM-dd hh:mm:ss"))
      // console.log(this.timrPicker[1].format("yyyy-MM-dd hh:mm:ss").split(' '))
      this.startDate = this.timrPicker[0].format("yyyy-MM-dd hh:mm:ss").split(' ')[0]
      this.startTime = this.timrPicker[0].format("yyyy-MM-dd hh:mm:ss").split(' ')[1]
      this.endDate = this.timrPicker[1].format("yyyy-MM-dd hh:mm:ss").split(' ')[0]
      this.endTime = this.timrPicker[1].format("yyyy-MM-dd hh:mm:ss").split(' ')[1]

      console.log(this.startDate)
      console.log(this.startTime)
      console.log(this.endDate)
      console.log(this.endTime)
    },
    onGridReady() {
      // this.gridOptions.api.sizeColumnsToFit()
      if(window.innerWidth < 1600){
        utils.autosize(this.gridOptions)
      }else{
        this.gridOptions.api.sizeColumnsToFit()
      }
      this.localeText = localeText
    },
    checkboxChange() {
      console.log(this.ruleForm.checkList)
      for(let k in this.ruleForm.checkList){
        if(this.ruleForm.checkList[k] === "8"){
          this.disabled = false
          return
        } 
      }
      this.disabled = true
    },
    batchBlur(e) {
      console.log(e)
      console.log('e.target.value')
      console.log(e.target.value)

      this.ruleForm.batch = e.target.value

    },
    showDialog() {
      this.dataInit()
      this.dialogVisible = true

      const end = new Date()
      end.setTime(end.getTime() + 60*1000)

      this.ruleForm.caller = new Date().format("yyyyMMddhhmm")
      this.ruleForm.callee = end.format("yyyyMMddhhmm")

      this.ruleForm.file = []

      if(this.updateMsg.ifUpdate){

        console.log('true')
        this.ruleForm.batch = this.updateMsg.data

        // this.ruleForm.id = this.updateMsg.data.id
        // this.ruleForm.code = this.updateMsg.data.code

        // this.ruleForm.name = this.updateMsg.data.name
        // this.ruleForm.langname = this.updateMsg.data.langname
        // this.ruleForm.threshold = this.updateMsg.data.threshold
        // this.ruleForm.cases = String(this.updateMsg.data.cases)
        // this.ruleForm.sectionoffice = this.updateMsg.data.sectionoffice
        // this.ruleForm.department = this.updateMsg.data.department
        // this.ruleForm.assignee = this.updateMsg.data.assignee
        // this.ruleForm.category = this.updateMsg.data.category
        // this.ruleForm.subcate = this.updateMsg.data.subcate
        // this.ruleForm.telrules = String(this.updateMsg.data.telrules)
        // this.ruleForm.datasource = this.updateMsg.data.datasource
        
        // this.ruleForm.remark = this.updateMsg.data.remark


      }
    },
    tirggerFile(event) {
      // {
      //     number: 1,
      //     name: '333(aaa)_主叫话单_222_20180329095621_test.wav',
      //     custName: '333(aaa)_主叫话单_222_20180329095621_test.wav',
      //     type: 'audio/wav',
      //     size: '396.7KB',
      //     status: '等待上传'
      //   },
      // console.log('event.target.files')  
      // console.log(event.target.files)  
      this.event = event
      this.ruleForm.file = event.target.files
      this.errorFile = []

      // Array.prototype.push.apply(this.ruleForm.file, event.target.files);
      // console.log('this.ruleForm.file')
      // console.log(this.ruleForm.file)
      // console.log(this.ruleForm.file.length)
      let files = this.ruleForm.file
      // console.log('files')
      // console.log(files)
      for(let k=0;k<files.length;k++){
        console.log(this.ruleForm.file[k])
        if(!this.ruleForm.file[k].name.match(/\d+\(?.*\)_{1}(主叫话单|被叫话单)_{1}\d+_{1}\d+_{1}.*/)){
          // console.log('文件格式错误')
          // console.log(this.ruleForm.file[k])
          // this.$message.error('文件格式错误');
          this.errorFile.push(this.ruleForm.file[k].name)

          // this.$alert(`<div id="messagebox-1001-displayfield-inputEl" role="textbox" class="x-form-display-field" data-errorqtip="">所选文件有3个文件名不符合规则：<br>cba302cf9e6543169732109564759826.wav<br>demo (2).wav<br>demo (3).wav<br><br><span style="color:red">备注：<br>文件名规则：号码1(备注)_话单类型_号码2_话单开始时间_其他信息.扩展名<br>话单类型分为主叫话单和被叫话单，主叫话单，号码1为主叫，号码2为被叫，被叫话单，号码1为被叫，号码2为主叫。</span></div>`,
          //   '提示',{
          //     dangerouslyUseHTMLString: true
          //   })
        }else{
          this.rowData.push({
            number: this.i++,
            name: files[k].name,
            custName: files[k].name,
            type: files[k].type,
            size: files[k].size > 1024*1024 ? (files[k].size/1024/1024).toFixed(1) + ' MB' : (files[k].size/1024).toFixed(1) + ' KB',
            status: '等待上传',
            mydelete: false,
            progress: this.i,
            percent: this.percent
          })
          this.ruleForm.fileTable.push(files[k])
        }
        
        if(this.errorFile.length != 0){
          let str = ''
          for(let k in this.errorFile){
            str += `${this.errorFile[k]}<br>`
          }
          this.$alert(`<div id="messagebox-1001-displayfield-inputEl" role="textbox" class="x-form-display-field" data-errorqtip="">所选文件有${this.errorFile.length}个文件名不符合规则：${str}<br><span style="color:red">备注：<br>文件名规则：号码1(备注)_话单类型_号码2_话单开始时间_其他信息.扩展名<br>话单类型分为主叫话单和被叫话单，主叫话单，号码1为主叫，号码2为被叫，被叫话单，号码1为被叫，号码2为主叫。</span></div>`,
            '提示',{
              dangerouslyUseHTMLString: true
            })
        }
      }
      console.log('this.rowData')
      console.log(this.rowData)
      this.event.target.value = ""
    },
    uploadFile() {
      if(this.ruleForm.batch===''){
        this.$message.error('请选择批次');
        return
      }

      // return
      let params
      // if(this.updateMsg.ifUpdate){
      //   params = new URLSearchParams()
      // }else{
      //   params = new FormData()
      // }
      // 
      let obj = this.ruleForm.batchOptions.find( (item) => {
        return item['value'] === this.ruleForm.batch
      })

      obj ? this.ruleForm.batchLabel = obj.label : this.ruleForm.batchLabel = this.ruleForm.batch

      params = new FormData()

      // params.append('caller',this.ruleForm.caller)
      
      // params.append('callee',this.ruleForm.callee)
      params.append('taskname',(this.ruleForm.batchLabel).trim())
      // params.append('third','')
      // params.append('startDate',this.startDate)
      // params.append('startTime',this.startTime)
      // params.append('endDate',this.endDate)
      // params.append('endTime',this.endTime)
      params.append('recogflag',this.ruleForm.checkList)

      // params.append('files',this.ruleForm.fileTable)


      // params.append('fileData',this.ruleForm.fileTable)
      // params.append('mandatoryLanguage','自动识别')
      params.append('mandatoryLanguage',this.ruleForm.recognize)
      params.append('importer',this.getAccount())


      // let callback = (progressEvent) => {
      //   console.log(progressEvent)
      //   console.log(progressEvent.loaded/progressEvent.total)
      //   // this.taskProgress.push((progressEvent) => progressEvent.loaded/progressEvent.total)
      // }
      let files = this.ruleForm.fileTable
      let tasks = []
      for (let k in files) {

        let newParams = new FormData()
        newParams.append('filename',files[k].name)
        newParams.append('filedata',files[k])
        newParams.append('taskname',params.get('taskname'))
        newParams.append('recogflag',params.get('recogflag'))
        newParams.append('mandatoryLanguage',params.get('mandatoryLanguage'))
        newParams.append('importer',params.get('importer'))
        tasks.push(uploadBatchVoice(newParams,(progressEvent) => {
          // console.log(files[k],progressEvent.loaded/progressEvent.total)
          for(let key in this.rowData){
            this.rowData[key].name === files[k].name ? this.rowData[key].percent = progressEvent.loaded/progressEvent.total*100 : ''

              // if(this.rowData[key].percent === 100){
              //   console.log(this.rowData[key].percent)
              //   console.log('上传成功')
              //   this.rowData[key].status = '上传成功'
                 
              // }
          }
        }))
        
      }
      let _this = this
      axios.all(tasks).then(axios.spread(function(res) {
        console.log(arguments)
        console.log(res)
        let k
        for(k in arguments){
          console.log(typeof k)
          console.log(k )
          console.log(_this.index)
          if(arguments[k].data.success){
            _this.rowData[Number(k)+_this.index].status = '上传成功'
            _this.successNum++
          }else{
            _this.rowData[Number(k)+_this.index].status = '上传失败'
            utils.messageBox(res,_this,5000)
          }          
          // if(!arguments[k].data.success){
          //   _this.rowData[Number(k)+_this.index].status = '上传失败'
          // }
        }
        _this.index += Number(k) + 1

        _this.gridOptions.api.refreshCells()
        _this.ruleForm.fileTable = []
        _this.$emit('setImportBatch')
      }))

      // this.$emit('setImportBatch',params,this.ruleForm.fileTable)
      // console.log(this.ruleForm.fileTable)
      // console.log('uploadFile')
      // this.closeDialog()
        

    },
    handleChange() {

    },
    resetForm() {
      this.index = 0
      this.i = 1
      this.ruleForm.fileTable = []
      this.rowData = []
      // this.closeDialog()
    },
    closeDialog() {

      this.successNum = 0
      this.i = 1
      this.index = 0
      this.ruleForm.fileTable = []
      this.rowData = []
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.caller = ''
      this.ruleForm.callee = ''
      this.ruleForm.batch = ''
      // this.ruleForm.startDate = ''
      // this.ruleForm.startTime = ''
      // this.ruleForm.endDate = ''
      // this.ruleForm.endTime = ''
      this.ruleForm.recogflag = [1024,2,4,8,16,32,64]
      // this.ruleForm.file = null
      // console.log(document)
      // let file = document.querySelector("#file")
      // console.log(file.outerHTML)
      // file.outerHTML = file.outerHTML
      // console.log(file.outerHTML)
      this.updateMsg.ifUpdate = false
      // var obj = document.querySelector('#file')
      // obj.select()
      // document.selection.clear()
      this.dialogVisible = false

      this.ruleForm.file = []

      this.event ? this.event.target.value = "" : ""
      console.log('closeDialog')

      
    },
    dateInit() {
      const end = new Date();
      const start = new Date();
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      start.setTime(start.getTime() - 60 * 1000);
      this.timrPicker[0] = new Date(start)
      this.timrPicker[1] = new Date(end)

      this.startDate = this.timrPicker[0].format("yyyy-MM-dd hh:mm:ss").split(' ')[0]
      this.startTime = this.timrPicker[0].format("yyyy-MM-dd hh:mm:ss").split(' ')[1]
      this.endDate = this.timrPicker[1].format("yyyy-MM-dd hh:mm:ss").split(' ')[0]
      this.endTime = this.timrPicker[1].format("yyyy-MM-dd hh:mm:ss").split(' ')[1]
    },
    dataInit() {
      console.log('created')
    //   getBatchImportedData({
    //     start: 0,
    //     limit: 0 // 不限(即, 所有)
    //   }).then(res => {
    //     console.log(res)
    //     this.ruleForm.batchOptions = []
    //     let data = res.data.records
    //     for(let k in data){
    //       this.ruleForm.batchOptions.push({
    //         label: data[k].name,
    //         value: data[k].id
    //       })
    //     }
    //   })
    }
  },
  beforeCreate() {
    
  },
  created() {
    // Object.defineProperty(FileList.prototype, 'length', {
    //   writable: true,
    //   // configurable: true
    // });
    this.localeText = localeText
    utils.dateFormat()
    // this.dateInit()
    // this.dataInit()
  },
  beforeMount() {
    if(window.innerWidth < 1600){
        // console.log('window.innerWidth < 1600')
        // console.log(window.innerWidth)
        this.dialogWidth = '600px'
        // utils.autosize(this.gridOptions)
      }else{
        this.dialogWidth = '900px'
        // console.log('window.innerWidth > 1600')
        // console.log(window.innerWidth)
      }
  },
  mounted () {
    
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

<style scoped lang="scss">
  .importVoiceDialog{
    .demo-ruleForm{
      position: relative;
      .count{
        position: absolute;
        bottom: 0;
        right: 0;
        margin-bottom: 0;
      }
    }
  }
  .el-button{
    padding: 10px;
  }

  #batchfile{
    display: none;
  }
  .fileBtn{
    display: table;
    width: 100px;
    height: 28px;
    margin-top: 6px;
    line-height: 28px;
    background-color: #409EFF;
    color: #fff;
    // display: block;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }

</style>
<style lang="scss">
@media (max-width: 1599px) {
  .importVoiceDialog {
    .checkGroup {
      .el-checkbox-group{
        .el-checkbox{
          &:nth-child(4){
            margin-right: 30px !important;
          }
          &:nth-child(5){
            margin-left: 0 !important;
          }
          // 
        } 
      }
    }
  }
}
</style>