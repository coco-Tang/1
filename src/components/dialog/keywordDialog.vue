<!--
 * @Author: coco-Tang
 * @Date: 2019-07-23 10:28:33
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-28 15:30:24
 * @Description: 
 -->
<template>
  <div class="keywordDialog">
    <!-- 	<el-button type="text" @click="dialogVisible = myMessage">点击打开 Dialog</el-button> -->
    <!-- {{updateMsg}} -->
    <el-dialog
      :before-close="closeDialog"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
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
        <el-form-item v-if="!updateMsg.isEdit" label="关键词" prop="keyword">
          <el-input v-model="ruleForm.keyword"></el-input>
        </el-form-item>
        <el-form-item class="file_item" v-if="updateMsg.batch" label="导入文件" prop="file">
          <!-- <input type="file" @change="tirggerFile($event)"> -->
          <div class="file_input">
            <input style="display:none" type="file" id="file" @change="tirggerFile($event)" />

            <el-input :title="uploadFileName" v-model="uploadFileName" readonly placeholder="请输入内容"></el-input>
            <label class="fileBtn" for="file">选择文件</label>
          </div>
        </el-form-item>
        <el-form-item label="语种" prop="language">
          <el-select v-model="ruleForm.language" placeholder="请选择">
            <el-option
              v-for="item in ruleForm.languageOptions"
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
            @change="handleChange"
            :step="10"
            :min="0"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="案件" prop="cases">
          <el-select v-model="ruleForm.cases" 
            @visible-change="setCases" 
            multiple
            collapse-tags 
            placeholder="请选择">
            <el-option
              v-for="item in ruleForm.casesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item class="undertake" label="承办者" prop="undertake">
          <ul class="undertake">
            <li>
              <em>处室:</em>
              <el-select clearable v-model="ruleForm.sectionoffice" @change="getDepartment" placeholder="请选择">
                <el-option
                  v-for="item in ruleForm.sectionofficeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li>
              <em>科室:</em>
              <el-select clearable v-model="ruleForm.department" @change="getAssignee" placeholder="请选择">
                <el-option
                  v-for="item in ruleForm.departmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
            <li>
              <em class="person">人:</em>
              <el-select clearable v-model="ruleForm.assignee" placeholder="请选择">
                <el-option
                  v-for="item in ruleForm.assigneeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
          </ul>
        </el-form-item>-->

        <!-- <el-form-item label="策略" prop="strategy">
          <el-input v-model="ruleForm.strategy"></el-input>
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
            placeholder="请选择"
          >
            <el-option
              v-for="item in ruleForm.matchPlatformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            resize="none"
            v-model="ruleForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked" @click="uploadFile('ruleForm')">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { getUser, getCase } from "@/api/index.js";
import { keywordLanguage } from "@/api/keywords.js";

export default {
  name: "keywordDialog",
  data() {
    return {
      dialogTitle: "新建关键词",
      account: "",
      ruleForm: {
        file: null,
        keyword: "",
        name: "",
        gender: "",
        threshold: 60,
        cases: "",
        casesOptions: [],
        sectionoffice: "",
        sectionofficeOptions: [],
        department: "",
        departmentOptions: [],
        assignee: "",
        assigneeOptions: [],
        strategy: "*",
        language: "",
        languageOptions: [],
        matchPlatform: [],
        matchPlatformOptions: [],
        // datasource: [''],
        // datasourceOptions: [
        //   {
        //     value: '000000',
        //     label: '不限'
        //   },
        //   {
        //     value: '100',
        //     label: '优浪'
        //   },
        //   {
        //     value: '923',
        //     label: '十所'
        //   },
        // ],
        remark: "",
        type: "1"
      },
      rules: {
        file: [{ required: true, message: "请选择文件", trigger: "blur" }],
        keyword: [
          { required: true, message: "请输入关键词", trigger: "blur" },
          { min: 2, message: "关键词的最小长度是2个字符", trigger: "blur" }
        ],
        language: [{ required: true, message: "请选择语种", trigger: "blur" }],

        // strategy: [
        //   { required: true, message: "请输入关键词的策略", trigger: "blur" }
        //   // { min: 1, message: '请输入声纹的策略', trigger: 'blur' }
        // ],
        matchPlatform: [
          { required: true, message: "请选择平台", trigger: "blur" }
        ],
        threshold: [{ required: true, message: "请选择阈值", trigger: "blur" }]
      },
      dialogVisible: false,
      uploadFileName: ""
    };
  },
  // computed: {
  //   ...mapState({
  //     matchPlatformOptions: state => {
  //       // console.log('matchPlatformOptions',state.platform.platforms)
  //       return state.platform.platforms }
  //   })
  // },
  // props: ['myMessage']
  props: {
    updateMsg: Object
  },
  methods: {
    // ...mapGetters(['getSectionTree','getAccount','getPlatform']),
    ...mapGetters(["getPlatform"]),
    platformChanged(v) {
      if (v.indexOf("*") > -1) {
        this.ruleForm.matchPlatform = ["*"];
        return;
      }
    },
    showDialog() {
      this.dialogVisible = true;
      this.dialogTitle = "新建关键词";
      this.updateMsg.batch ? (this.dialogTitle = "按模板添加关键词") : "";
      if (this.updateMsg.isEdit) {
        this.dialogTitle = "编辑关键词";
        console.log("true");

        // this.getDepartment(this.updateMsg.data.sectionoffice)

        Object.keys(this.updateMsg.data).forEach(key => {
          this.ruleForm[key] = this.updateMsg.data[key];
          if (key === "type") {
            this.ruleForm[key] = this.updateMsg.data[key] + "";
          }
        });

        // this.getAssignee()
        // this.setCases(true)
      }
    },
    uploadFile(formName) {
      // console.log(this.ruleForm.datasource)
      let _valid = false;
      this.$refs[formName].validate(valid => {
        // console.log(valid)
        if (valid) {
          _valid = true;
        } else {
          _valid = false;
        }
      });

      if (!_valid) {
        return;
      }
      let {
        id,
        keyword,
        language,
        threshold,
        // strategy,
        remark,
        matchPlatform,
        type
      } = this.ruleForm;
      let params = {
        language,
        threshold,
        remark,
        matchPlatform: matchPlatform.join(","),
        type,
        keyword
      };

      if (this.updateMsg.isEdit) {
        console.log("dialog edit");
        this.$emit("setKeyword", { ...params, keywordId: id });
      } else {
        console.log("dialog create");
        this.$emit("setKeyword", { ...params, keyword });
      }
      this.closeDialog();
    },
    tirggerFile(e) {
      this.ruleForm.file = event.target.files[0];
      this.uploadFileName = this.ruleForm.file.name;
      // this.e.target.value = ""
    },
    handleChange() {},
    resetForm() {
      this.closeDialog();
    },
    closeDialog() {
      this.$refs["ruleForm"].resetFields();

      this.ruleForm.keyword = "";
      this.ruleForm.language = "";
      this.ruleForm.threshold = 60;
      this.ruleForm.cases = [];
      this.ruleForm.sectionoffice = "";
      this.ruleForm.department = "";
      this.ruleForm.assignee = "";
      this.ruleForm.matchPlatform = [];
      // this.ruleForm.strategy = "*";
      this.ruleForm.remark = "";
      this.ruleForm.type = "1";

      this.ruleForm.file = null;
      this.uploadFileName = "";

      this.updateMsg.isEdit = false;
      this.updateMsg.batch = false;
      this.dialogVisible = false;
    },
    getDepartment(v) {
      if (v === "") {
        this.ruleForm.departmentOptions = [];
        this.ruleForm.department = "";
        this.ruleForm.assigneeOptions = [];
        this.ruleForm.assignee = "";
        return;
      }

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
    getAssignee(v) {
      if (v === "") {
        this.ruleForm.assigneeOptions = [];
        this.ruleForm.assignee = "";
        return;
      }

      

      let params = new URLSearchParams();
      params.append("loginuser", this.account);
      params.append("sectionoffice", this.ruleForm.sectionoffice);
      params.append("department", this.ruleForm.department);
      params.append("page", 1);
      params.append("start", 0);
      params.append("limit", 25);

      this.ruleForm.assigneeOptions = [];
      getUser(params).then(res => {
        console.log("getUser");
        console.log(res);
        for (let k in res.data.records) {
          this.ruleForm.assigneeOptions.push({
            label: res.data.records[k].username,
            value: res.data.records[k].account
          });
        }
      });
    },
    setCases(flag) {
      if (!flag) {
        return;
      }
      let params = new URLSearchParams();
      params.append("page", 1);
      params.append("start", 0);
      params.append("limit", 25);
      this.ruleForm.casesOptions = [];
      getCase(params).then(res => {
        for (let k in res.data.records) {
          this.ruleForm.casesOptions.push({
            label: res.data.records[k].name,
            value: res.data.records[k].code
          });
        }
      });
    },
    setLanguage() {
      keywordLanguage().then(res => {
        console.log("keywordLanguage");
        console.log(res);
        this.languageOptions = [];
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          this.ruleForm.languageOptions.push({
            label: data[i],
            value: data[i]
          });
          // this.$set(this.languageOptions, i, {
          //   label:data[i],
          //   value:data[i]
          // });
        }
        console.log(this.ruleForm.languageOptions);
      });
    },
    dataInit() {
      // this.sectionTree = this.getSectionTree()
      // this.ruleForm.sectionofficeOptions = [];
      this.ruleForm.matchPlatformOptions = this.getPlatform();
      this.setLanguage();
      console.log("dataInit");
      console.log(this.getPlatform());
    }
  },
  beforeCreate() {},
  created() {
    this.dataInit();
  },
  beforeMount() {},
  mounted() {},
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
.keywordDialog {
  .file_item {
    .file_input {
      display: flex;
      label {
        font-size: 12px;
      }
      .fileBtn {
        width: 100px;
        height: 28px;
        line-height: 28px;
        background-color: #409eff;
        color: #fff;
        display: block;
        border-radius: 4px;
        text-align: center;
        margin-left: 15px;
      }
    }
  }
}
.el-button {
  padding: 10px;
}
.el-select {
  margin-top: 10px;
}
</style>