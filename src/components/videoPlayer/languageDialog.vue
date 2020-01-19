<template>
  <div class="languageDialog">
    <el-dialog
    title="添加语种"
    :visible.sync="dialogVisible"
    width="200px"
    >
      <!-- <el-input v-model="newlanguage" :maxlength=10 placeholder="请输入内容"></el-input> -->
      <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="" prop="newlanguage">
          <el-input type="newlanguage" v-model="ruleForm.newlanguage"></el-input>
        </el-form-item>

      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="addlanguage(false)">取 消</el-button>
        <el-button type="primary" @click="addlanguage(true)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'languageDialog',
  data () {
    return {
      newlanguage: '',
      dialogVisible: false,
      ruleForm:{
        newlanguage: ''
      },
      rules: {
        newlanguage: [
          { required: true,  trigger: 'blur' ,validator: this.validatePass},
          // { min: 4, message: '账号的最小长度是4个字符', trigger: 'blur' }
        ]

      },

    }
  },
  props: {
  	myMessage: Boolean
  },
  methods: {
    validatePass(rule, value, callback){
      if(this.ruleForm.newlanguage === '' || this.ruleForm.newlanguage.trim() == ''){
        callback(new Error('请输入有效语种!'))
      }else{
        callback()
      }     
    },
    quickRecgnizeHandle () {
      this.dialogVisible = true
    },
    addlanguage (flag) {

      if(!flag){
        this.dialogVisible = false
        this.ruleForm.newlanguage = ''
        return
      }
      let _valid = false
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          _valid = true
        } else {
          _valid = false
        }
      })

      if(!_valid){
        return
      }

      this.$emit('add',flag,this.ruleForm.newlanguage)
      this.dialogVisible = false
      this.ruleForm.newlanguage = ''
    }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .languageDialog{
    .el-form-item__content{
      margin-left: 0 !important;
    }
  }
</style>