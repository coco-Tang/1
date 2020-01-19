<template>
  <div class="exportDialog">
  <!-- 	<el-button type="text" @click="dialogVisible = myMessage">点击打开 Dialog</el-button> -->
  <!-- :close-on-click-modal="false" -->
		<el-dialog
      
      :before-close="closeDialog"
		  :title="dialogName"
		  :visible.sync="dialogVisible"
		  width="460px">
<!-- 		  <el-form label-position="left" :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="账号" prop="account">
          <el-input :disabled="updateMsg.ifUpdate" v-model="ruleForm.account"></el-input>
        </el-form-item>
        

      </el-form> -->
      <div>
        <div>导出范围</div>
        <el-radio-group @change="radioChange" v-model="radio2">
          <el-radio :label="1">当前页</el-radio>
          <el-radio :label="2">自定义(条数)</el-radio>
          <el-radio :label="3">全部</el-radio>
        </el-radio-group>
        <div>
          <el-input-number @change="beginChange" :disabled="radio2!=2" v-model="begin" controls-position="right" :precision="0" :step="1" :min="1" :max="end===1?exportMsg.totalPage:end"></el-input-number>&nbsp;~&nbsp;
          <el-input-number @change="endChange" :disabled="radio2!=2" v-model="end" controls-position="right" :precision="0" :step="1" :min="begin" :max="exportMsg.totalPage"></el-input-number>
        </div>
      </div>
      <div v-if="exportMsg.list">
        <div>导出列</div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="statusStr">状态</el-checkbox>
          <el-checkbox label="billLevelStr">话单级别</el-checkbox>
          <el-checkbox label="hasTransStr">转写</el-checkbox>
          <el-checkbox label="callerStr">主叫</el-checkbox>
          <el-checkbox label="dangerPhoneNoInCallerStr">威胁号码备注(主叫)</el-checkbox>
          <el-checkbox label="calleeStr">被叫</el-checkbox>
          <el-checkbox label="dangerPhoneNoInCalleeStr">威胁号码备注(被叫)</el-checkbox>
          <el-checkbox label="langname">语种</el-checkbox>
          <el-checkbox label="langScore">语种输出</el-checkbox>
          <el-checkbox label="starttimeStr">通话时间</el-checkbox>
          <el-checkbox label="calltimeStr">通话时长</el-checkbox>
          <el-checkbox label="earlywarningBid">预警中标</el-checkbox>
          <el-checkbox label="resourceHitResult">检索结果</el-checkbox>
          <el-checkbox label="remark">备注</el-checkbox>
          <el-checkbox label="listenStr">调听人</el-checkbox>
          <el-checkbox label="department">处理科室</el-checkbox>
          <el-checkbox label="handledStr">处理</el-checkbox>
          <el-checkbox label="category">类别</el-checkbox>
          <el-checkbox label="third">三方号码</el-checkbox>
          <el-checkbox label="genderStr">性别</el-checkbox>
          <el-checkbox label="importtime">语音上传时间</el-checkbox>
          <el-checkbox label="inserttime">结果返回时间</el-checkbox>
          <el-checkbox label="sourcePlatform">来源平台</el-checkbox>
          <el-checkbox label="srid">处理引擎</el-checkbox>
          <el-checkbox label="keywordsStr">预警中标-关键词</el-checkbox>
          <el-checkbox label="speechsegsStr">预警中标-音频</el-checkbox>
          <el-checkbox label="speakersStr">预警中标-声纹</el-checkbox>
          <el-checkbox label="keywordsHitStr">检索结果-关键词</el-checkbox>
          <el-checkbox label="speechsegsHitStr">检索结果-音频</el-checkbox>
          <el-checkbox label="speakersHitStr">检索结果-声纹</el-checkbox>
          <el-checkbox label="callid">callid</el-checkbox>
          <el-checkbox label="filename">文件名</el-checkbox>
          <el-checkbox label="filepaths">文件路径</el-checkbox>
        </el-checkbox-group> 
      </div>
      
		  <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked"  @click="uploadFile">确 定</el-button>
		    <el-button @click="resetForm">取 消</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>
// import {speechsegCreate} from '@/api/index.js'
import {mapActions,mapGetters} from 'vuex'
export default {
  name: 'exportDialog',
  data () {
    return {
      dialogName: '导出话单',
      account: '',
      sectionTree: [],
      ruleForm:{
        account: '',
        name: '',
        password: '',
        checkPass: '',
        remark: '',
        id: ''

      },

      dialogVisible: false,
      isAdmin: false,
      isSection: false,
      radio2: 1,
      begin: 1,
      end: 1,
      checkList: ['statusStr','billLevelStr','hasTransStr','callerStr','dangerPhoneNoInCallerStr','calleeStr','dangerPhoneNoInCalleeStr','langname','langScore','starttimeStr','calltimeStr','earlywarningBid','resourceHitResult'],
      limit: '',
      start: '',
      starttime: '',
      endtime: ''

    }
  },
  // props: ['myMessage']
  props: {
  	exportMsg:Object
  },
  computed: {

  },
  watch: {

  },
  methods: {
    ...mapGetters(['getSectionTree','getAccount']),

    showDialog() {
      this.dialogVisible = true


      console.log('this.props')
      console.log(this.exportMsg)
      

      this.limit = this.exportMsg.pageSize
      this.start = (this.exportMsg.currentPage-1)*this.exportMsg.pageSize

      // if(this.exportMsg.monitor){
      //   this.starttime = this.exportMsg.starttime
      //   this.endtime = this.exportMsg.endtime

      // }
      // if(this.exportMsg.dafraud){
      //   this.cityCode = this.exportMsg.cityCode
      //   this.hitType = this.exportMsg.hitType
      //   this.acktype = this.exportMsg.acktype

      // }

      // if(this.exportMsg.caseno){
      //   this.starttime = this.exportMsg.starttime
      //   this.endtime = this.exportMsg.endtime
      //   this.phoneNumber = this.exportMsg.number
      // }

      
      console.log('this.limit')
      console.log(this.limit)
      console.log('this.start')
      console.log(this.start)
    },
    uploadFile() {
      // let _valid = false
      // this.$refs['ruleForm'].validate((valid) => {
      //   if (valid) {
      //     _valid = true
      //   } else {
      //     _valid = false
      //   }
      // })

      // if(!_valid){
      //   return
      // }

      let params = ''

      if(this.exportMsg.search){
        params += `taskid=${this.exportMsg.taskid}`
      }else if(this.exportMsg.monitor){
        params += `starttime=${this.exportMsg.starttime}`
        params += `&endtime=${this.exportMsg.endtime}`
      }else if(this.exportMsg.defraud){
        params += `startTime=${this.exportMsg.starttime}`
        params += `&endTime=${this.exportMsg.endtime}`
        params += `&cityCode=${this.exportMsg.cityCode}`
        params += `&hitType=${this.exportMsg.hitType}`
        params += `&acktype=${this.exportMsg.acktype}`
      }else if(this.exportMsg.caseno){

        params += `starttime=${this.exportMsg.starttime}`
        params += `&endtime=${this.exportMsg.endtime}`
        params += `&phoneNumber=${this.exportMsg.phoneNumber}`
      }

      // if(this.exportMsg.list){
      //   params += `&columns=[${this.checkList}]`
      // }else{
      //   // params += `&columns=`
      // }
      if(this.exportMsg.list){
        for(let k = 0;k < this.checkList.length; k++ ){
          params += `&columns=${this.checkList[k]}`
        }
      }
      console.log('this.exportMsg.list')
      console.log(this.exportMsg.list)
      console.log(this.checkList)
      
      params += `&limit=${this.limit}`
      params += `&start=${this.start}`
      
      this.$emit('setExport',params)
      console.log(params)
      this.closeDialog()

    },
    resetForm() {
    
      this.closeDialog()
    },
    closeDialog() {
      // this.$refs['ruleForm'].resetFields()



      this.radio2 = 1
      this.begin = 1
      this.end = 1
      // 
      this.dialogVisible = false

    },
    radioChange(v){
      console.log('radioChange')
      console.log(v)

      switch(v){
        case 1:
          this.limit = this.exportMsg.pageSize
          this.start = (this.exportMsg.currentPage-1)*this.exportMsg.pageSize
          break;
        case 2:
          // this.limit = (this.end - this.begin) || 1
          // (this.end - this.begin) >= 0 ? this.limit = 1 : this.limit = (this.end - this.begin)
          // this.start = this.begin
          this.limit = 1
          if(this.exportMsg.currentPage != 1){
            this.start = (this.exportMsg.currentPage-1)*this.exportMsg.pageSize
          }else{
            this.start = 0
          }
          
          break;
        case 3:
          this.limit = this.exportMsg.totalPage
          this.start = 0
          break;
      }

      console.log('this.limit')
      console.log(this.limit)
      console.log('this.start')
      console.log(this.start)
    },
    beginChange(v) {
      console.log('beginChange')
      console.log(v)
      console.log(this.exportMsg.currentPage)
      this.start = (v - 1) + (this.exportMsg.currentPage-1)*this.exportMsg.pageSize
      console.log(this.start)
    },
    endChange(v) {

      // console.log(v)
      // this.limit = (v - this.begin) || 1
      // if(v - this.begin > 0){
      //   this.end = this.begin
      // }

      this.limit = v - this.begin + 1

      // console.log('this.limit')
      // console.log(this.limit)
    },
  },
  beforeCreate() {
    
  },
  created() {
    
    this.account = this.getAccount()
    
  },
  beforeMount() {

  },
  mounted () {
    if(this.exportMsg.list){
      this.dialogName = '导出Excel'
    }
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
  .el-select{
    margin-top: 10px;
  }

 
</style>

<style  lang="scss">
  .exportDialog{
    .el-radio-group{

    }
    .el-checkbox{
      width: 133px !important;
      margin-left: 0 !important;
    }
    .el-checkbox__label{
      font-size: 12px;
    }
    .el-input-number__decrease{
      height: 15px !important;
      line-height: 15px !important;
      bottom: 5px !important;
    }
    .el-input-number__increase{
      height: 15px !important;
      line-height: 15px !important;
      top: 5px !important;
    }
  }

 
</style>


