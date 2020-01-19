<!--
 * @Author: coco-Tang
 * @Date: 2019-06-05 09:51:11
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-28 18:51:32
 * @Description: 
 -->
<template>
  <div class="userDialog">
    <!-- 	<el-button type='text' @click='dialogVisible = myMessage'>点击打开 Dialog</el-button> -->
    <!-- :close-on-click-modal='false' -->
    <el-dialog
      :before-close="closeDialog"
      :title="dialogName"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="570px"
    >
      <el-form
        label-position="left"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="account">
          <el-input :disabled="updateMsg.isEdit" v-model="ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item v-if="!updateMsg.isEdit" label="密码" prop="password" class="form-item-add-reset">
          <el-input @focus="clearPas" type="password" v-model="ruleForm.password"></el-input>
          <el-button @click.native="resetPassword">重置</el-button>
        </el-form-item>
        <el-form-item v-if="!updateMsg.isEdit" label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>

        <!-- :filterable="!updateMsg.isEdit" -->
        <!-- :allow-create="!updateMsg.isEdit" -->
        <el-form-item label="角色" prop="level">
          <el-select v-model="ruleForm.level" multiple placeholder="请选择" @change="levelChanged">
            <el-option
              v-for="item in getRoles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :class='{ 'disabled' : isAdmin, 'non-sysadmin' : this.ruleForm.level != 1 }' label='处室' prop='sectionoffice'>
                    <el-select :disabled='isAdmin' v-model='ruleForm.sectionoffice' @change='getDepartment' placeholder='请选择'>
                        <el-option
                        v-for='item in ruleForm.sectionofficeOptions'
                        :key='item.value'
                        :label='item.label'
                        :value='item.value'>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :class='{ 'disabled' : isAdmin || isSection, 'non-sradmin': this.ruleForm.level != 1 && this.ruleForm.level != 2  }' label='科室' prop='department'>
                    <el-select :disabled='isAdmin || isSection' v-model='ruleForm.department' placeholder='请选择'>
                        <el-option
                        v-for='item in ruleForm.departmentOptions'
                        :key='item.value'
                        :label='item.label'
                        :value='item.value'>
                        </el-option>
                    </el-select>
        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            resize="none"
            v-model="ruleForm.remark"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top:26px" v-if="updateMsg.isEdit" label="账号停用" prop="forbidden">
          <el-checkbox v-model="ruleForm.forbidden"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked" @click="confirmDialog">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {speechsegCreate} from '@/api/index.js'
import { mapActions, mapGetters, mapMutations } from "vuex";
import { type } from "os";
export default {
  name: "userDialog",
  data() {
    return {
      dialogName: "新建用户",
      account: "",
      sectionTree: [],
      ruleForm: {
        account: "",
        name: "",
        password: "",
        checkPass: "",
        level: [],
        sectionoffice: "",
        sectionofficeOptions: [],
        department: "",
        departmentOptions: [],
        forbidden: false,
        remark: "",
        id: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, message: "账号的最小长度是4个字符", trigger: "blur" },
          { max: 20, message: "账号的最大长度是20个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, message: "姓名的最小长度是2个字符", trigger: "blur" },
          { max: 10, message: "姓名的最大长度是10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, message: "密码的最小长度是5个字符", trigger: "blur" },
          { max: 20, message: "密码的最大长度是20个字符", trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { min: 5, message: "确认密码的最小长度是5个字符", trigger: "blur" },
          { trigger: "blur", validator: this.validatePass }
        ],
        level: [{ required: true, message: "请选择角色", trigger: "blur" }],
        sectionoffice: [
          { message: "请选择处室", trigger: "blur" },
          { trigger: "blur", validator: this.validateSec }
        ],
        department: [
          { message: "请选择科室", trigger: "blur" },
          { trigger: "blur", validator: this.validateDep }
        ]
      },

      dialogVisible: false,
      isAdmin: false,
      isSection: false,
      secRequire: false,
      deRequire: false
    };
  },
  // props: ['myMessage']
  props: {
    updateMsg: Object
  },
  computed: {
    ...mapGetters(["getRoles"])
    // getLevel(){
    //   return this.ruleForm.level
    // }
  },
  watch: {
    // getLevel(){
    //   // this.ruleForm.level === 1 ? this.isAdmin = true : this.isAdmin = false
    //   if(this.ruleForm.level == 1){
    //     this.ruleForm.sectionoffice = ''
    //     this.ruleForm.department = ''
    //     this.isAdmin = true
    //     this.isSection = false
    //   }else if(this.ruleForm.level == 2){
    //     this.ruleForm.department = ''
    //     this.isAdmin = false
    //     this.isSection = true
    //   }else{
    //     this.isAdmin = false
    //     this.isSection = false
    //   }
    // }
  },
  created() {
    // this.account = this.getAccount()
    // this.updateTree()
  },
  beforeMount() {},
  mounted() {
    this.ROLE();
  },
  methods: {
    ...mapGetters(["getSectionTree", "getAccount"]),
    ...mapMutations(["UPDATELEVELOPTIONS"]),
    ...mapActions(["ROLE"]),
    clearPas() {
      this.ruleForm.password = ''
    },
    resetPassword() {
      // this.ruleForm.password = "123456";
      this.ruleForm.password = "";
    },
    authChanged(value, direction, movedKeys) {
      console.log(value);
      console.log(direction);
      console.log(movedKeys);
      console.log("this.value1");
      console.log(this.value1);
    },
    validatePass(rule, value, callback) {
      if (this.ruleForm.password != this.ruleForm.checkPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },
    validateSec(rule, value, callback) {
      if (this.secRequire && value === "") {
        callback(new Error("请选择处室!"));
      } else {
        callback();
      }
    },
    validateDep(rule, value, callback) {
      if (this.deRequire && value === "") {
        callback(new Error("请选择科室!"));
      } else {
        callback();
      }
    },
    levelChange() {
      console.log("levelChange");
      if (this.ruleForm.level === 1) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    },
    showDialog() {
      this.dialogVisible = true;

      // this.updateTree();
      this.dialogName = "新建用户";
      console.log("this.props");
      console.log(this.updateMsg);
      if (this.updateMsg.isEdit) {
        this.dialogName = "编辑用户";
        // this.getDepartment(this.updateMsg.data.sectionoffice)
        this.ruleForm.account = this.updateMsg.data.account;
        // this.ruleForm.name = this.updateMsg.data.username
        // this.ruleForm.password = this.updateMsg.data.password;
        // this.ruleForm.password = `******`;
        this.ruleForm.level = this.updateMsg.data.roles.map(item => {
          return item.id;
        });
        // this.ruleForm.sectionoffice = this.updateMsg.data.sectionoffice
        // this.ruleForm.department = this.updateMsg.data.department
        this.ruleForm.forbidden = this.updateMsg.data.forbidden;
        this.ruleForm.remark = this.updateMsg.data.remark;
      }
    },
    confirmDialog() {
      let _valid = false;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          _valid = true;
        } else {
          _valid = false;
        }
      });

      if (!_valid) {
        return;
      }

      const { data, isEdit } = this.updateMsg;
      const { account, password, remark, level, forbidden } = this.ruleForm;
      let params = {};
      if (isEdit) {
        //编辑用户
        params = this.Utils.formatParams({
          account,
          userId: data.id,
          // password,
          remark,
          forbidden,
          roleIds: level,
          modifier: this.getAccount()
        });
      } else {
        //新建用户
        params = this.Utils.formatParams({
          account,
          password,
          remark,
          roleIds: level,
          creator: this.getAccount()
        });
      }

      this.$emit("createUser", params);
      this.closeDialog();
    },
    resetForm() {
      this.closeDialog();
    },
    closeDialog() {
      this.$refs["ruleForm"].resetFields();
      this.ruleForm.account = "";
      // this.ruleForm.name = ''
      this.ruleForm.password = "";
      this.ruleForm.level = []
      // this.ruleForm.sectionoffice = ''
      // this.ruleForm.department = ''
      this.ruleForm.forbidden = false;
      this.ruleForm.remark = "";

      this.updateMsg.isEdit = false;
      this.dialogVisible = false;
      this.dialogName = "新建用户";
    },
    getDepartment(v) {
      this.ruleForm.departmentOptions = [];
      this.ruleForm.department = "";
      for (let k in this.sectionTree) {
        if (v === this.sectionTree[k].id) {
          for (let ck in this.sectionTree[k].children) {
            this.ruleForm.departmentOptions.push({
              label: this.sectionTree[k].children[ck].label,
              value: this.sectionTree[k].children[ck].id
            });
          }
        }
      }
    },
    updateTree() {
      this.sectionTree = this.getSectionTree();
      this.ruleForm.sectionofficeOptions = [];
      console.log("create");
      console.log(this.sectionTree);
      for (let k in this.sectionTree) {
        this.ruleForm.sectionofficeOptions.push({
          label: this.sectionTree[k].label,
          value: this.sectionTree[k].id
        });
      }
      console.log(this.sectionofficeOptions);
    },
    levelChanged(v) {
      if (typeof v === "string") {
        console.log("levelChanged", v);
        this.UPDATELEVELOPTIONS(v);
      }
      switch (v) {
        case 1:
          this.secRequire = false;
          this.deRequire = false;
          break;
        case 2:
          this.secRequire = true;
          this.deRequire = false;
          break;
        default:
          this.secRequire = true;
          this.deRequire = true;
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.userDialog {
  .el-select {
    margin-top: 10px;
  }
  .el-button {
    padding: 10px;
  }
}
</style>
<style lang='scss'>
.userDialog {
  .el-dialog__wrapper {
    .el-form-item.form-item-add-reset {
      .el-form-item__content {
        .el-input {
          // width: 80% !important;
          width: calc( 100% - 54px) !important;
          margin-right: 10px !important;
        }
      }
    }
  }
  .el-form {
    color: red;
  }
  .non-sysadmin label.el-form-item__label::before,
  .non-sradmin label.el-form-item__label::before {
    content: "*";
    color: #f56c6c;
    margin-right: 0;
  }
}
</style>
