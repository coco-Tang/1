<!--
 * @Author: coco-Tang
 * @Date: 2019-09-04 17:54:47
 * @LastEditors  : coco-Tang
 * @LastEditTime : 2020-01-19 16:14:43
 * @Description: 
 -->
<template>
  <div class="train-model-dialog">
    <el-dialog
      :before-close="closeDialog"
      :title="updateMsg.isEdit ? '编辑模型': '模型上传'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="620px"
    >
      <el-form :model="ruleForm" label-position="left">
        <el-form-item class="file_item" label="模型" prop="model">
          <div class="file_input">
            <input style="display:none" type="file" id="file" @change="triggerFiles($event)" />

            <label class="fileBtn" for="file">添加</label>
            <el-input :title="uploadFileName" v-model="uploadFileName" readonly placeholder="请添加模型"></el-input>
          </div>
        </el-form-item>
        <!-- <el-form-item label="模型名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>-->

        <el-form-item label="描述" prop="remark">
          <el-input v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked" @click="uploadFile" :disabled="disabled">确 定</el-button>
        <el-button @click="resetForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ajax, { up2Serv } from "@/api/upToServer";
import axios from "axios";
import { addModels } from "@/api/train";
import { IMPORT_MEDIA_BASEURL } from "@/config";
export default {
  name: "train-model-dialog",
  data() {
    return {
      disabled: false,
      rowData: [],
      fileList: [],
      uploadFileName: "",
      ruleForm: {
        name: "",
        remark: ""
      },
      dialogVisible: false
    };
  },
  props: {
    updateMsg: Object
  },
  methods: {
    triggerFiles(e) {
      // console.log("triggerFiles -- e:", e);
      // console.log('e.target.files.length:', e.target.files.length)
      let file_wrong_tips = [];
      let exclusion1 = /video|text|application|image/,
        exclusion2 = /rar|7z/,
        filesArr = Array.prototype.slice.call(e.target.files);
      this.uploadFileName = filesArr[0]["name"];
      filesArr.forEach(e => {
        // if (!exclusion1.test(e.type) && !exclusion2.test(e.name)) {
        let t, j;
        if (e.type) {
          t = e.type;
        } else {
          j = e.name.lastIndexOf(".");
          if (j !== -1) {
            t = e.name.slice(j + 1);
          } else {
            t = "";
          }
        }
        this.rowData.push({
          // number: ++i,
          number: ++this.i,
          name: e.name,
          type: t,
          size:
            e.size > 1024 * 1024
              ? (e.size / 1024 / 1024).toFixed(1) + " MB"
              : (e.size / 1024).toFixed(1) + " KB",
          mydelete: false,
          // progress: i,
          progress: this.i, // useless
          percent: 0
        });
        this.fileList.push(e);
        // } else {
        //   file_wrong_tips.push("文件 " + e.name + " 的类型不符合");
        // }
      });
      // console.log('triggerFiles -- this.rowData:', this.rowData)
      // console.log('triggerFiles ~~~~ this.i:', this.i)

      if (file_wrong_tips.length > 0) {
        this.$notify.warning({
          title: "错误",
          dangerouslyUseHTMLString: true,
          message: file_wrong_tips
            .map(
              (item, index) =>
                `<span style="font-size: 12px; color: grey; word-break: break-all;">${index +
                  1}. ${item}</span>`
            )
            .join("<br>")
        });
      }
      e.target.value = "";
    },
    showDialog() {
      this.dialogVisible = true;
      // console.log('showDialog',this.updateMsg);
      const { data, isEdit } = this.updateMsg;
      if (isEdit) {
        this.form.role = data.name;
        this.form.auth = data.permissions.map(item => {
          return item.id;
        });
      }
    },
    uploadFile() {
      this.disabled = true;
      const { name, remark } = this.ruleForm;
      const { data, isEdit } = this.updateMsg;

      if (!isEdit) {
        // 新建
        let params = {
          name,
          remark,
          type: data.value
        };

        let fd1,
          fd2,
          calcFlag,
          flagArr,
          language,
          fileUrls = [];

        if (this.rowData.length) {
          let tasks = [];

          for (let f of this.fileList) {
            let p = new FormData();
            p.append("file", f);

            if (process.env.NODE_ENV === "production") {
              tasks.push(
                axios({
                  method: "post",
                  url: `${IMPORT_MEDIA_BASEURL}/files`,
                  data: p,
                  onUploadProgress: progressEvent => {
                    for (let i in this.rowData) {
                      this.rowData[i].name === f.name
                        ? (this.rowData[i].percent = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                          ))
                        : "";
                    }
                  }
                }).then(res => {
                  console.log("导入语音 -- axios -- res:", res);
                  // fileUrls.push(res.data.url)
                  let obj = {};
                  obj.url = res.data.url;
                  obj.fileName = f.name;
                  obj.fmt = this.ruleForm.format;
                  fileUrls.push(obj);
                })
              );
            } else {
              tasks.push(
                // <1> 实体信息, 上传真实文件至服务器
                ajax({
                  method: "post",
                  url: "/files",
                  data: p,
                  onUploadProgress: progressEvent => {
                    for (let i in this.rowData) {
                      // console.warn('f.name:', f.name)
                      // console.log('this.rowData['+i+'].percent:', this.rowData[i].percent)
                      this.rowData[i].name === f.name
                        ? (this.rowData[i].percent = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                          ))
                        : "";
                      // if(this.rowData[key].percent === 100){
                      //     console.log(this.rowData[key].percent)
                      //     console.log('上传成功')
                      //     this.rowData[key].status = '上传成功'
                      // }
                    }
                  }
                }).then(res => {
                  console.log("导入语音 -- axios -- res:", res);
                  // fileUrls.push(res.data.url)
                  let obj = {};
                  obj.url = res.data.url;
                  obj.fileName = f.name;
                  obj.fmt = this.ruleForm.format;
                  fileUrls.push(res.data.url);
                })
              );
            }
          }

          axios
            .all(tasks)
            .then(
              axios.spread(oneOfReses => {
                console.log("oneOfReses:", oneOfReses);
                params.modelUrl = fileUrls;
              })
            )
            .then(res => {
              this.ruleForm.model = params.modelUrl.join("、");
              addModels(params)
                .then(res => {
                  this.disabled = false;
                  this.closeDialog();
                  this.$parent.dataInit();
                })
                .catch(err => {
                  console.error("addModels.err:", err.response.data.msg);
                });
            });
        } else {
          //未选中文件
          this.$message.error("请添加模型！");
        }

        // fd2 = new FormData()
        // this.fileList.forEach(e => fd2.append('file', e))

        // for (var k = 0; k < this.ruleForm.file.length; k++) {
        //     fd1.append('files', this.ruleForm.file[k])
        // }

        // this.$emit('setImport', fd1, fd2)
        // this.$emit('setImport', fd1, this.fileList)
        // this.closeDialog()

        // this.event ? this.event.target.value = '' : ''
      } else {
        let fd, calcFlag, flagArr, language;

        fd = new URLSearchParams();

        flagArr = Object.assign([], this.ruleForm.checkList);
        if (this.ruleForm.setValue == "测试集") {
          flagArr.push("2");
        }
        flagArr = Array.from(new Set(flagArr)); // 剔除编辑'测试集'时,多push一次'2'的情况
        calcFlag = flagArr.reduce((accu, curr) => Number(accu) + Number(curr));

        this.ruleForm.setValue == "测试集"
          ? (language = "")
          : (language = this.ruleForm.setValue);

        fd.append("taskId", this.updateMsg.data.taskId);
        fd.append("processingContent", calcFlag);
        fd.append("remark", this.ruleForm.remark);
        fd.append("language", language);
        fd.append("type", 1);

        modTask(fd).then(res => {
          this.$parent.dataInit();
        });
      }
    },
    resetForm() {
      this.uploadFileName = "";
      this.rowData = [];
      this.ruleForm.name = "";
      this.ruleForm.remark = "";
      this.dialogVisible = false;
    },
    closeDialog() {
      this.updateMsg.isEdit = false;
      // this.dialogVisible = false;
      this.resetForm();
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.file_item {
  .file_input {
    flex-grow: 1;
    display: flex;
    div.el-input {
      // width: calc(100% - 95px);
    }
    label {
      font-size: 12px;
    }
    .fileBtn {
      //   width: 100px;
      width: 45px;
      height: 28px;
      line-height: 28px;
      background-color: #409eff;
      color: #fff;
      display: block;
      border-radius: 4px;
      text-align: center;
      margin: 6px 15px 0 0;
    }
  }
}
.authDialog {
}
.el-button {
  padding: 10px;
}
.el-select {
  margin-top: 10px;
}
</style>
<style lang="scss">
.train-model-dialog {
  .el-form-item {
    display: flex;
    .el-form-item__label {
      flex-shrink: 0;
    }
    .el-form-item__content {
      flex-shrink: 1;
      width: 100%;
      .el-input {
        width: 100%;
      }
    }
  }
}
</style>