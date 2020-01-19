<!--
 * @Author: coco-Tang
 * @Date: 2019-09-04 17:54:47
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-11-22 17:55:33
 * @Description: 
 -->
<template>
  <div class="trainTaskDialog">
    <!-- 	<el-button type="text" @click="dialogVisible = myMessage">点击打开 Dialog</el-button> -->

    <el-dialog
      :before-close="closeDialog"
      :title="updateAuth.isEdit ? '编辑任务': '新建任务'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="620px"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="模型类型" prop="model">
          <el-select
            style="width: 190px; margin-right: 30px"
            v-model="ruleForm.model"
            placeholder="请选择"
          >
            <el-option
              v-for="item in setOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            maxlength='500'
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="ruleForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked" @click="uploadFile">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {speechsegCreate} from '@/api/index.js'
// import {createTrainTask} from '@/api/train.js'
import { mapActions, mapGetters } from "vuex";
import { LANGUAGE_LIBRARY_TYPE } from "@/constant";
export default {
  name: "authDialog",
  data() {
    return {
      data: [
        {
          key: 1,
          label: "用户管理"
        },
        // {
        //   key:2,
        //   label:'时间窗管理',
        // },
        {
          key: 3,
          label: "案件管理"
        },
        {
          key: 4,
          label: "固定音频"
        },
        {
          key: 5,
          label: "关键词"
        },
        {
          key: 6,
          label: "对象声纹"
        },
        // {
        //   key:7,
        //   label:'语种预警管理',
        // },
        {
          key: 8,
          label: "语音检索"
        },
        {
          key: 10,
          label: "优先级管理"
        },
        {
          key: 11,
          label: "导入语音"
        },
        {
          key: 12,
          label: "状态监测"
        },
        {
          key: 13,
          label: "日志管理"
        },
        // {
        //   key:14,
        //   label:'搜索队列',
        // },
        {
          key: 20,
          label: "实时预警"
        },
        // {
        //   key:21,
        //   label:'反诈骗',
        // },
        {
          key: 26,
          label: "号码库"
        }
        // {
        //   key:27,
        //   label:'威胁号码管理',
        // },
      ],
      ruleForm: {
        model: "",
        remark: ""
      },
      rules: {
        model: [
          { required: true, message: "请选择模型类型", trigger: "blur" }
        ]
      },
      setOptions: LANGUAGE_LIBRARY_TYPE,
      dialogVisible: false
    };
  },
  // props: ['myMessage']
  props: {
    updateAuth: Object
  },
  computed: {
    ...mapGetters(["getAuthList"])
    // getLevel(){
    //   return this.ruleForm.level
    // }
  },
  methods: {
    ...mapGetters(["getSectionTree", "getAccount", "getRoles"]),
    ...mapActions(["AUTHLIST"]),
    authChanged(value, direction, movedKeys) {
      console.log(value);
      console.log(direction);
      console.log(movedKeys);
      console.log("this.value1");
      console.log(this.value1);
    },
    showDialog() {
      this.dialogVisible = true;
      // console.log('showDialog',this.updateAuth);
      const { data, isEdit } = this.updateAuth;
      if (isEdit) {
        //TODO
      }
    },
    uploadFile() {
      const { data, isEdit } = this.updateAuth;
      console.log("uploadFile", this.ruleForm);

      // let params = {};
      // if (isEdit) {
      //   //编辑权限
      //   params = {
      //     roleId: data.id,
      //     modifier: this.getAccount(),
      //     pmIds: this.form.auth
      //   };
      // } else {
      //   //新建角色
      //   console.log("导入语料库");
      //   return
      //   const roleName = this.form.role;
      //   if (roleName === "") return this.$message.error("角色名不能为空");
      //   const authList = this.form.auth;
      //   params = {
      //     name: roleName,
      //     creator: this.getAccount(),
      //     pmIds: authList
      //   };
      // }

      // params.append('password',this.ruleForm.password)
      // params.append('level',this.ruleForm.level)
      // params.append('sectionoffice',this.ruleForm.sectionoffice)
      // params.append('department',this.ruleForm.department)
      // params.append('stopped',this.ruleForm.stopped)
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
      let params = new URLSearchParams();
      params.append('type',this.ruleForm.model)
      params.append('remark',this.ruleForm.remark)

      this.$emit("createTask", params);
      this.closeDialog();
    },
    resetForm() {
      this.closeDialog();
    },
    closeDialog() {
      this.updateAuth.isEdit = false;
      this.ruleForm.model = "";
      this.dialogVisible = false;
    },
    timeRangeChange() {},
    thresholdChange() {},
    getDepartment(v) {
      this.ruleForm.departmentOptions = [];
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
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    // this.AUTHLIST();
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
.trainTaskDialog {
}
// .el-button {
//   padding: 10px;
// }
// .el-select {
//   margin-top: 10px;
// }
</style>
<style lang="scss">
.trainTaskDialog {
  .el-form-item{
    // display: flex;
    // .el-form-item__label{
    //   width: 80px;
    // }
    // .el-form-item__content{
    //   width: 100%;
    // }
    // .el-form-item__content{
    //   margin-left: 0;
    // }
    // .el-textarea{
    //   width: 100%;
    // }
  }
}
</style>