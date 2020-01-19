<!--
 * @Author: coco-Tang
 * @Date: 2019-09-30 14:27:58
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-28 18:05:23
 * @Description: 
 -->
<template>
  <div class="speakerDialog">
    <!-- 	<el-button type='text' @click='isDialogVisible = myMessage'>点击打开 Dialog</el-button> -->
    <el-dialog
      :before-close="closeDialog"
      :title="dialogTitle"
      :visible.sync="isDialogVisible"
      width="460px"
    >
      <el-form
        label-position="left"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="声纹编号" prop="code">
          <el-input :disabled="updateMsg.isEdit" v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="声纹名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="ruleForm.gender" placeholder="请选择">
            <el-option
              v-for="item in ruleForm.genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中标阈值" prop="threshold">
          <el-input-number
            :precision="0"
            v-model="ruleForm.threshold"
            controls-position="right"
            :step="10"
            :min="0"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <!-- <el-form-item label='类别' prop='category'>
                    <el-select v-model='ruleForm.category' placeholder='请选择'>
                        <el-option
                            v-for='item in ruleForm.categoryOptions'
                            :key='item.value'
                            :label='item.label'
                            :value='item.value'>
                        </el-option>
                    </el-select>
        </el-form-item>-->
        <!-- <el-form-item
                    v-for='(el, idx) in ruleForm.platforms'
                    :key='el.key'
                    :label="'匹配平台 #'+ (idx + 1)"
                    :rules="{ required: true, message: '匹配平台不能为空', trigger: 'blur' }"
                    >
                    <el-input v-model='el.matchValue' class='platforms' placeholder='请输入匹配平台'></el-input>
                    <el-button size='mini' icon='el-icon-plus' @click='addMatchPlatforms'></el-button>
                    <el-button size='mini' icon='el-icon-minus' @click='removeMatchPlatforms(el)'></el-button>
        </el-form-item>-->
        <el-form-item label="权限" prop="strategy">
          <el-radio v-model="ruleForm.type" label="1">公有</el-radio>
          <el-radio v-model="ruleForm.type" label="2">私有</el-radio>
        </el-form-item>
        <el-form-item label="匹配平台" prop="matchPlatform">
          <el-select
            @change="platformChanged"
            v-model="ruleForm.matchPlatform"
            multiple
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="item in ruleForm.matchPlatformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="ruleForm.remark"
            type="textarea"
            placeholder="请输入内容"
            resize="none"
            :rows="2"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked" @click="submitDialog('ruleForm')">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "speakerDialog",
  data() {
    return {
      dialogTitle: "新建声纹",
      ruleForm: {
        account: "",
        code: "",
        name: "",
        threshold: 60,
        cases: "",
        casesOptions: [],
        telrules: "*",
        gender: 1,
        genderOptions: [
          {
            value: 0,
            label: "未知" //不限
          },
          {
            value: 1,
            label: "男"
          },
          {
            value: 2,
            label: "女"
          }
        ],
        /**
         * 除了 0 (正常) 以外, 其余后台都暂时没定下来.
         */
        category: 0,
        categoryOptions: [
          {
            value: 0,
            label: "正常"
          }
          // ,{
          //     value: 1,
          //     label: '排除'
          // },{
          //     value: 2,
          //     label: '诈骗'
          // }
        ],
        platforms: [
          {
            matchValue: ""
          }
        ],
        matchPlatform: [],
        matchPlatformOptions: [],
        // matchPlatformOptions: [
        //     {
        //         value: '233',
        //         label: '233'
        //     }
        // // {
        // //   value: '000000',
        // //   label: '不限'
        // // },
        // // {
        // //   value: '100',
        // //   label: '优浪'
        // // },
        // // {
        // //   value: '923',
        // //   label: '十所'
        // // },
        // ],
        remark: "",
        type: "1"
      },
      rules: {
        code: [
          { required: true, message: "请输入声纹编号", trigger: "blur" },
          {
            min: 2,
            message: "声纹编号只能包含半角字母、数字和_,最小长度为2",
            trigger: "blur",
            pattern: /^(\w){2,99}$/
          }
        ],
        name: [
          { required: true, message: "请输入声纹名称", trigger: "blur" },
          { min: 2, message: "声纹名称的最小长度是2个字符", trigger: "blur" }
        ],
        // telrules: [
        //     { required: true, message: '请输入声纹的策略', trigger: 'blur' },
        //     // { min: 1, message: '请输入声纹的策略', trigger: 'blur' }
        // ],
        matchPlatform: [
          { required: true, message: "请选择匹配平台", trigger: "blur" }
        ],
        threshold: [{ required: true, message: "请选择阈值", trigger: "blur" }],
        // category: [{ required: true, message: "请选择类别", trigger: "blur" }],
        gender: [
          { required: true, message: "", trigger: "blur" },
        //   { trigger: "blur", validator: this.validateGender }
        ]
      },
      checkList: [],
      cases: "",
      casesOptions: [{}],
      isDialogVisible: false,
      file: {}
    };
  },
  // props: ['myMessage']
  props: {
    updateMsg: Object
  },
  created() {
    // this.ruleForm.account = this.getAccount()
    // this.sectionTree = this.getSectionTree()
    // this.ruleForm.sectionofficeOptions = []
    // this.account = this.getAccount()
    // for(let k in this.sectionTree){
    //     this.ruleForm.sectionofficeOptions.push({
    //         label: this.sectionTree[k].label,
    //         value: this.sectionTree[k].id
    //     })
    // }
  },
  beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    ...mapGetters(["getSectionTree", "getAccount", "getPlatform"]),
    // validateGender(rule, value, callback) {
    //   // console.log('validateGender')
    //   // console.log(value)
    //   // console.log(this.ruleForm.category)

    //   if (this.ruleForm.category == 0 && value == 0) {
    //     callback(new Error("请选择男或女"));
    //   } else {
    //     callback();
    //   }
    // },
    platformChanged(v) {
      // console.log('platformChanged')
      // console.log(v)
      // console.log(this.ruleForm.matchPlatformOptions)
      // let res = v.find((v)=>{
      //     if(v === "*"){
      //         return true
      //     }
      // })
      // console.log(v.indexOf("*"))

      if (v.indexOf("*") > -1) {
        this.ruleForm.matchPlatform = ["*"];
        return;
      }
    },
    showDialog() {
      this.ruleForm.matchPlatformOptions = this.getPlatform();
      this.isDialogVisible = true;
      this.dialogTitle = "新建声纹";

      // let res = this.getPlatform()
      // console.log('Vuex--Getters: this.getPlatform():', res)

      // this.ruleForm.matchPlatform.push(res.platform)
      // this.ruleForm.matchPlatformOptions = res.platformOptions

      console.log("this.ruleForm:", this.ruleForm);

      if (this.updateMsg.isEdit) {
        this.dialogTitle = "编辑声纹";
        // this.getDepartment(this.updateMsg.data.sectionoffice)
        Object.keys(this.updateMsg.data).forEach(key => {
          this.ruleForm[key] = this.updateMsg.data[key];
          if (key === "type") {
            this.ruleForm[key] = this.updateMsg.data[key] + "";
          }
        });
      }
    },
    submitDialog(formName) {
      this.$refs[formName].validate(valid => {
        // if (this.ruleForm.platforms.length === 1 && !this.ruleForm.platforms[0].matchValue) {
        //     console.warn('this.ruleForm.platforms:', this.ruleForm.platforms)
        //     this.$message.error({ message:'匹配平台不能为空', duration: 800 })
        //     return
        // }
        if (valid) {
          let fd = this.Utils.formatParams(this.ruleForm, "fd");
          let {
            id,
            code,
            name,
            gender,
            threshold,
            remark,
            matchPlatform,
            type
          } = this.ruleForm;
          matchPlatform = matchPlatform.join(",");

          this.$emit("setSpeaker", {
            speakerId: id,
            code,
            name,
            gender,
            threshold,
            remark,
            matchPlatform,
            type
          });
          this.closeDialog();
        }
      });
    },
    closeDialog() {
      this.$refs["ruleForm"].resetFields();
      this.ruleForm.id = "";
      this.ruleForm.code = "";
      this.ruleForm.name = "";
      this.ruleForm.gender = 1;
      this.ruleForm.threshold = 60;
      // this.ruleForm.category = 0
      this.ruleForm.matchPlatform = [];
      // this.ruleForm.platforms = []
      // this.ruleForm.platforms.push({matchValue: ''})
      this.ruleForm.remark = "";

      this.updateMsg.isEdit = false;
      this.isDialogVisible = false;
    }
    // addMatchPlatforms () {
    //     this.ruleForm.platforms.push({
    //         matchValue: '',
    //         key: Date.now()
    //     });
    // },
    // removeMatchPlatforms (platform) {
    //     if (this.ruleForm.platforms.length === 1) {
    //         return
    //     }
    //     let index = this.ruleForm.platforms.indexOf(platform)
    //     if (index !== -1) {
    //         this.ruleForm.platforms.splice(index, 1)
    //     }
    // },
  }
};
</script>

<style scoped lang='scss'>
.speakerDialog {
  .el-button {
    padding: 10px;
  }
  .el-select {
    margin-top: 10px;
  }
  .platforms {
    width: 230px;
    margin-right: 5px;
  }
}
</style>