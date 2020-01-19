<template>
  <div class="markDialog">
		<el-dialog
      :before-close="closeDialog"
		  title="添加标注信息"
		  :visible.sync="dialogVisible"
		  width="420px">
		  <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="起止时间:">
          {{formatStart}}s&nbsp;~&nbsp;{{formatEnd}}s&nbsp;&nbsp;共{{formatTime}}s
        </el-form-item>
<!--         <el-form-item label="说话人:" prop="speaker">
          <el-select v-model="ruleForm.speaker" placeholder="请选择">
            <el-option
              v-for="item in ruleForm.speakerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="语种:" prop="lang">
          <el-select v-model="ruleForm.lang" placeholder="请选择">
            <el-option
              v-for="item in ruleForm.langOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="性别:" prop="gender">
          <el-select v-model="ruleForm.gender" placeholder="请选择">
            <el-option
              v-for="item in ruleForm.genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="标注内容:" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="ruleForm.remark">
          </el-input>
        </el-form-item>


      </el-form>
		  <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked" @click="confirmDialogMark('ruleForm')">确 定</el-button>
		    <el-button @click="resetForm">取 消</el-button>    
		  </span>
		</el-dialog>
  </div>
</template>

<script>
// import {getUser,getCase} from '@/api/index.js'
// import {getSpeaker,getLanguage} from '@/api/ql.js'
import {mapActions,mapGetters} from 'vuex'

export default {
  name: 'markDialog',
  data () {
    return {
      ruleForm:{
        account: '',
        speaker: '',
        speakerOptions: [],
        lang: '',
        langOptions: [],
        gender: '',
        genderOptions: [
          {
            value: 0,
            label: '不确定'
          },{
            value: 1,
            label: '男'
          },{
            value: 2,
            label: '女'
          }
        ],
        duration: {
          start: null,
          end: null
        },

        remark: ''

      },
      rules: {
        speaker: [
          { required: true, message: '请选择说话人', trigger: 'change' }
        ],
        lang: [
          { required: true, message: '请选择语种', trigger: 'change' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' },
        ]
      },
    	checkList: [],
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
      dialogVisible: false,
      file: {},
      threshold: 60,
      telrules: '*',
      code: '',
      name: '',
      remark: '',
      formatStart: 0,
      formatEnd: 0,
      formatTime: 0,

    }
  },
  // props: ['myMessage']
  props: {
  	updateMsg:Object
  },
  methods: {
    ...mapGetters(['getResData','getPlayerData','getNewqlData']),

    // setSpeaker() {
    //   this.ruleForm.speakerOptions = []
    //   getSpeaker().then(res => {
    //     console.log('getSpeaker')
    //     console.log(res)
    //     for(let k = 0; k < res.data.length; k++){
    //       this.ruleForm.speakerOptions.push({
    //         value: res.data[k].code,
    //         label: res.data[k].name
    //       })
    //     }
    //     // console.log(this.speakerOptions)
    //   })
    // },

    // setLanguage() {
    //   this.ruleForm.langOptions = []
    //   getLanguage().then(res => {
    //     // console.log('getLanguage')
    //     // console.log(res)
    //     for(let k = 0; k < res.data.length; k++){
    //       this.ruleForm.langOptions.push({
    //         value: res.data[k].name,
    //         label: res.data[k].name
    //       })
    //     }
    //     // console.log(this.ruleForm.langOptions)
    //   })
    // },
    showDialog(start,end) {
      this.ruleForm.duration.start = start
      this.ruleForm.duration.end = end

      this.formatStart = (start/1000).toFixed(2)
      this.formatEnd = (end/1000).toFixed(2)
      this.formatTime = (end/1000 - start/1000).toFixed(2)
      this.dialogVisible = true

      
    },

    confirmDialogMark(formName) {

      let _valid = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _valid = true
        } else {  
          _valid = false
        }
      })

      if(!_valid){
        return
      }

      if(this.getPlayerData().type==='ql'){
        let params = new URLSearchParams();
        params.append('callId',this.getResData().callid)
        params.append('start',this.ruleForm.duration.start)
        params.append('end',this.ruleForm.duration.end)
        // params.append('lengthtime',this.ruleForm.duration.end-this.ruleForm.duration.start)
        // params.append('speaker',this.ruleForm.speaker)
        // params.append('language',this.ruleForm.lang)
        // params.append('sex',this.ruleForm.gender)
        params.append('content',this.ruleForm.remark)
        params.append('startTime',this.getResData().starttime)
        this.$emit('setAnnotation',params)
      }
      // else{
      //   let params = {}
      //   params.fileName = this.getNewqlData().callid

      //   params.begintime = this.ruleForm.duration.start
      //   params.endtime = this.ruleForm.duration.end
      //   params.lengthtime = this.ruleForm.duration.end-this.ruleForm.duration.start
      //   params.language = this.ruleForm.lang
      //   params.sex = this.ruleForm.gender
      //   params.content = this.ruleForm.remark
      //   this.$emit('setLocalAnnotation',params)

      // }
      


      this.closeDialog()

    },
    handleChange() {

    },
    resetForm() {
    
      this.closeDialog()
    },
    closeDialog() {
      this.ruleForm.speaker = ''
      this.ruleForm.lang = ''
      this.ruleForm.gender = ''
      this.ruleForm.remark = ''
      

      // this.updateMsg.ifUpdate = false
      this.dialogVisible = false

    },
   
  },
  beforeCreate() {
    
  },
  created() {
    // this.ruleForm.account = this.getAccount()
    // this.account = this.getAccount()
    // this.setSpeaker()
    // this.setLanguage()
    // console.log('created')
    // console.log(this.langOptions)
    
  },
  beforeMount() {
    // console.log('beforeMount')
    // console.log(this.langOptions)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .markDialog{

  }
	.el-button{
		padding: 10px;
	}
	.el-select{
		// margin-top: 10px;
	}
 
</style>