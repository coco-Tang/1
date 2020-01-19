<template>
  <div class="passwordDialog">
  <!-- 	<el-button type="text" @click="dialogVisible = myMessage">点击打开 Dialog</el-button> -->

		<el-dialog
      :before-close="closeDialog"
		  title="修改密码"
		  :visible.sync="dialogVisible"
      :close-on-click-modal="false"
		  width="460px">
		  <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原始密码" prop="oldPassword">
          <el-input type="password" v-model="ruleForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="ruleForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>

      </el-form>
		  <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked" @click="confirmDialog('ruleForm')">确 定</el-button>
		    <el-button @click="resetForm">取 消</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
// import {getUser,getCase} from '@/api/index.js'
export default {
  name: 'passwordDialog',
  data () {
    return {
      
      ruleForm:{
        account: '',
        oldPassword: '',
        newPassword: '',
        checkPass: '',
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
          // { min: 4, message: '账号的最小长度是4个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          // { min: 4, message: '姓名的最小长度是4个字符', trigger: 'blur'}
        ],
        checkPass: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          // { min: 5, message: '确认密码的最小长度是5个字符', trigger: 'blur' },
          { trigger: 'blur',validator: this.validatePass }
        ]

      },
      dialogVisible: false,


    }
  },
  // props: ['myMessage']
  props: {
  	// updateMsg:Object
  },
  methods: {
    ...mapGetters(['getAccount']),
    validatePass(rule, value, callback){
      if(this.ruleForm.newPassword != this.ruleForm.checkPass){
        callback(new Error('两次输入密码不一致!'))
      }else{
        callback()
      }     
    },
    showDialog() {
      this.dialogVisible = true
    },
    confirmDialog(formName) {
      // console.log('formName')
      // console.log(typeof formName)
      // console.log(formName)
      // console.log(this.$refs[formName])
      // console.log(this.$refs['ruleForm'] === this.$refs[formName])
      let _valid = false
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          _valid = true
        } else {          
          _valid = false
        }

      })

      if(!_valid){
        return
      }
      let params = new URLSearchParams()
     
      params.append('account',this.ruleForm.account)      
      params.append('oldPassword',this.ruleForm.oldPassword)
      params.append('newPassword',this.ruleForm.newPassword)
      

      this.$emit('setPassword',params)
      this.closeDialog()

    },
    handleChange() {

    },
    resetForm() {
    
      this.closeDialog()
    },
    closeDialog() {
      this.$refs['ruleForm'].resetFields()


      this.ruleForm.oldPassword = ''
      this.ruleForm.newPassword = ''
      this.ruleForm.checkPass = ''

      this.dialogVisible = false
    },

  },
  beforeCreate() {
    
  },
  created() {

    this.ruleForm.account = this.getAccount()
   
  },
  beforeMount() {

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
  .passwordDialog{

  }
	.el-button{
		padding: 10px;
	}
	.el-select{
		margin-top: 10px;
	}
 
</style>