<!--
 * @Author: coco-Tang
 * @Date: 2019-06-26 13:49:12
 * @LastEditors  : coco-Tang
 * @LastEditTime : 2020-01-19 16:13:09
 * @Description: 
 -->
<template>
  <div class="importSpeakerDialog">
    <el-dialog
      :title="this.ruleForm.fileType === 0 ? '添加到原始语音' : '添加到训练语音'"
      :before-close="closeDialog"
      :visible.sync="isDialogVisible"
      :width="dialogWidth"
    >
      <el-form
        label-position="left"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="上传语音">
          <span class="upload-append" :class="{'hide':isUploaded}" @click="callInputChange">
            <i class="el-icon-plus avatar-uploader-icon upload-append-icon"></i>
            <span>继续添加</span>
          </span>
          <span class="count-complete">{{ successNum }} / {{ rowData.length }} 条</span>
        </el-form-item>
        <div class="upload-area" :class="rowData.length?'hide':''">
          <div class="el-upload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <input
              type="file"
              name="file"
              title
              multiple
              class="el-upload__input"
              ref="filElem"
              @change="triggerFiles"
            />
          </div>
          <!-- <span
            class="name-rule"
          >支持所有格式的语音文件上传; 当上传分路语音时需规范命名规则如: A路 = 文件名+"-A" 后缀名, B路 = 文件名+"-B" 后缀名。</span>-->
        </div>

        <div style="width: 100%; height: 300px" :class="rowData.length?'':'hide'">
          <ag-grid-vue
            style="width: 100%; height: 100%"
            class="ag-grid ag-theme-material upload-speaker"
            :gridOptions="gridOptions"
            :showToolPanel="showToolPanel"
            :headerHeight="headerHeight"
            :rowHeight="rowHeight"
            :defaultColDef="defaultColDef"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :localeText="localeText"
            :rowSelection="rowSelection"
            :rowDeselection="true"
            :suppressRowClickSelection="true"
            :toolPanelSuppressRowGroups="true"
            :toolPanelSuppressValues="true"
            :toolPanelSuppressPivots="true"
            :toolPanelSuppressPivotMode="true"
            :suppressToolPanel="true"
            :toolPanelSuppressSideButtons="true"
            @gridReady="onGridReady"
          ></ag-grid-vue>
        </div>
      </el-form>

      <!-- <el-form label-position='left' :model='ruleForm' :inline='true' :rules='rules' ref='ruleForm' label-width='100px' class='demo-ruleForm'>
                <el-form-item label='语音文件' prop='file'>
                    <label class='btn--file' for='file'>选择文件</label>
                    <input multiple type='file' id='file' @change='tirggerFile($event)'>
                </el-form-item>
            </el-form>

            <div style='width: 100%; height: 300px'>
                <ag-grid-vue style='width: 100%; height: 100%' class='ag-grid ag-theme-material'
                    :columnDefs = 'columnDefs'
                    :enableColResize = 'enableColResize'
                    :enableFilter = 'enableFilter'
                    :gridOptions = 'gridOptions' 
                    :headerHeight = 'headerHeight'
                    :localeText = 'localeText'
                    :rowData = 'rowData'
                    :rowHeight = 'rowHeight'
                    :rowDeselection='rowDeselection'
                    :rowSelection='rowSelection'
                    :showToolPanel = 'showToolPanel'
                    :suppressRowClickSelection='suppressRowClickSelection'
                    :suppressToolPanel='true'
                    :toolPanelSuppressPivotMode='true'
                    :toolPanelSuppressPivots='true'
                    :toolPanelSuppressRowGroups='true'
                    :toolPanelSuppressValues='true'
                    :toolPanelSuppressSideButtons='true'

                    @gridReady='onGridReady'
                    >
                </ag-grid-vue>  
      </div>-->

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="checked"
          @click="uploadFile"
          :class="{'hide':isUploaded}"
          :disabled="disableState"
        >确&nbsp;定</el-button>
        <el-button @click="resetForm" :class="{'hide':isUploaded}">取&nbsp;消</el-button>
        <el-button
          type="primary"
          class="checked"
          @click="resetForm"
          :disabled="cmpltBtnState"
          :class="{'hide':!isUploaded}"
        >完&nbsp;成</el-button>
        <!-- <span class='remove-files' @click='resetFiles' :class="rowData.length?'':'hide'">移除全部</span> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import { mapActions, mapGetters } from "vuex";
import { uploadSpeakersVoices } from "@/api/speaker";
// import {speechsegCreate,getBatch,speakerUpload} from '@/api/index.js'
import localeText from "../../static/localeText.json";
import deleteComponent from "../deleteComponent.vue";
import progressComponent from "../progressComponent.vue";
import axios from "axios";
import ajax from "@/api/speaker.js";
import { IMPORT_MEDIA_BASEURL } from "@/config";

export default {
  name: "importSpeakerDialog",
  data() {
    return {
      i: 0,
      index: 0,
      gridOptions: {},
      showToolPanel: false,
      enableColResize: true,
      headerHeight: 40,
      rowHeight: 40,
      enableFilter: true,
      rowSelection: "multiple",
      rowDeselection: true,
      suppressRowClickSelection: true,
      columnDefs: [
        {
          headerName: "序号",
          editable: false,
          field: "number",
          menuTabs: ["columnsMenuTab"],
          width: 70
        },
        {
          headerName: "文件名",
          editable: false,
          field: "name",
          menuTabs: ["columnsMenuTab"],
          tooltipField: "name",
          headerClass: "file-name",
          cellClass: "file-name"
        },
        {
          headerName: "类型",
          editable: false,
          field: "type",
          menuTabs: ["columnsMenuTab"],
          headerClass: "file-type",
          cellClass: "file-type"
        },
        {
          headerName: "大小",
          editable: false,
          field: "size",
          menuTabs: ["columnsMenuTab"],
          headerClass: "file-size",
          cellClass: "file-size"
        },
        {
          headerName: "进度",
          editable: false,
          field: "progress",
          menuTabs: ["columnsMenuTab"],
          width: 100,
          headerClass: "file-progress",
          cellClass: "file-progress",
          cellRendererFramework: progressComponent //pinned: 'right'
        },
        {
          headerName: "操作",
          editable: false,
          field: "mydelete",
          menuTabs: ["columnsMenuTab"],
          width: 60,
          headerClass: "file-delete",
          cellClass: "file-delete",
          cellRendererFramework: deleteComponent
        }
      ],
      // defaultColDef: null,
      defaultColDef: {
        resizable: true,
        filter: true
      },
      successNum: 0,
      isUploaded: false,
      disableState: true,
      rowData: [
        // {
        //   number: 1,
        //   name: '333(aaa)_主叫话单_222_20180329095621_test.wav',
        //   custName: '333(aaa)_主叫话单_222_20180329095621_test.wav',
        //   type: 'audio/wav',
        //   size: '396.7KB',
        //   status: '等待上传'
        // },
      ],
      fileList: [],
      localeText: {},

      ruleForm: {
        fileTable: [],
        file: [],
        fileType: 0
      },
      rules: {},
      isDialogVisible: false,
      dialogWidth: "630px"
    };
  },
  components: {
    AgGridVue,
    deleteComponent,
    progressComponent
  },
  computed: {
    cmpltBtnState() {
      return !(this.successNum > 0 && this.successNum === this.rowData.length);
    },
    getComParams() {
      if (this.rowData[0]) {
        return this.rowData[0].mydelete;
      }
    },
    getTaskProgress1() {
      return this.$store.state.taskProgerss;
    }
  },
  watch: {
    // getComParams(){
    //   console.log('changed')
    // }
    getTaskProgress1() {
      this.percent = this.getTaskProgress();
      console.log("this.percent:", this.percent);
    },
    rowData: {
      handler(newValue, oldValue) {
        if (this.rowData.length) {
          this.disableState = false;
        } else {
          this.disableState = true;
          this.isUploaded = false; //为上传文件失败时，重新选择文件上传情况下 显示确定按钮
        }

        let index = newValue.findIndex(v => v.mydelete === true);
        const status = newValue.some(v => v.mydelete);
        // if (status) {
        //   // 有文件上传失败
        // }

        // console.log('if <--> before & out')
        // console.log(index)
        // let i
        if (index != -1) {
          console.log(
            "if <--> in ---- index: %o\nif <--> in ---- this.rowData:",
            index,
            this.rowData
          );
          this.rowData.splice(index, 1);
          Array.prototype.splice.call(this.fileList, index, 1);
          // this.i--;//修复上传文件都失败时，操作删除全部文件后，序号为负数
          this.rowData.forEach((e, i) => {
            e.number = i + 1;
            e.progress = i + 1;
          });
        }
      },
      deep: true
    }
  },
  created() {
    this.localeText = localeText;
    this.Utils.dateFormat();
  },
  beforeMount() {
    if (window.innerWidth > 1600) {
      this.dialogWidth = "890px";
    }
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    ...mapGetters(["getSpeakerId", "getAccount"]),
    callInputChange() {
      this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
    },
    triggerFiles(e) {
      // console.log('triggerFiles -- e:', e)
      // console.log('e.target.files.length:', e.target.files.length)
      let file_wrong_tips = [];
      let file_upload_success_tips = [];
      let exclusion1 = /video|text|application|image/,
        exclusion2 = /rar|7z/,
        filesArr = Array.prototype.slice.call(e.target.files);
      filesArr.forEach((e, idx) => {
        if (!exclusion1.test(e.type) && !exclusion2.test(e.name)) {
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
          // 过滤掉已经上传成功的文件
          if (
            this.fileList.some(item => item.name === e.name) &&
            this.rowData[idx].mydelete
          ) {
            file_upload_success_tips.push(
              "文件" + e.name + " 已上传，请选择其他文件"
            );
          } else {
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
            this.ruleForm.fileTable.push(e);
          }
        } else {
          file_wrong_tips.push("文件 " + e.name + " 的类型不符合");
        }
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
    uploadFile() {
      this.isUploaded = true;

      if (this.rowData.length) {
        let id,
          fd = new FormData();

        id = this.getSpeakerId();
        //0 原始语音;  1 训练语音
        // fd.append("fileType", this.ruleForm.fileType);
        // this.fileList.map(el => fd.append("files", el));

        let tasks = [];

        this.fileList.forEach((item, index) => {
          let p = new FormData();
          p.append("files", item);
          p.append("fileType", this.ruleForm.fileType);

          tasks.push(
            uploadSpeakersVoices(id, p, progressEvent => {
              const percent =
                (progressEvent.loaded / progressEvent.total) * 100;

              this.$set(
                this.rowData[index],
                "percent",
                Math.floor(percent) === 100 ? 99 : Math.floor(percent) || 1
              );
            })
              .then(res => {
                // console.log("导入原始语音 -- axios -- res:", res);
                if (res.status === 200) {
                  this.$set(this.rowData[index], "percent", 100);
                  this.$notify.success({
                    title: "成功",
                    message: item.name + "上传成功"
                  });
                  this.successNum++;
                }
              })
              .catch(() => {
                this.$notify.error({
                  title: "错误",
                  message: "服务连接错误 " + item.name + " 未上传成功"
                });
              })
          );
        });

        axios.all(tasks).then(
          axios.spread(res => {
            console.log(res);
            this.fileList = [];
            this.i = 0;
            this.index = 0;
          })
        );
      }
    },
    uploadFileAtImportList() {
      this.isUploaded = true;
      let taskId = this.getTaskId(),
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
                fileUrls.push(res.data.url);
              })
            );
          } else {
            tasks.push(
              ajax({
                method: "post",
                url: "/files",
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
                let obj = {};
                obj.url = res.data.url;
                obj.fileName = f.name;
                fileUrls.push(obj);
              })
            );
          }
        }

        axios
          .all(tasks)
          .then(
            axios.spread(oneOfReses => {
              console.log("oneOfReses:", oneOfReses);
            })
          )
          .then(res => {
            uploadVoices(fileUrls, taskId).then(res => {
              console.warn("this.$parent:", this.$parent);
              this.$parent.dataInit();
            });
          });
      }
    },
    onGridReady() {
      this.gridOptions.api.sizeColumnsToFit();
      // this.localeText = localeText
    },
    showDialog(idx) {
      this.isDialogVisible = true;
      this.ruleForm.fileType = idx;
      this.ruleForm.file = [];

      this.fileList = [];
      this.i = 0;
      this.index = 0;
    },
    tirggerFile(event) {
      console.log("event.target.files");
      // console.log(event.target.files);
      this.event = event;
      this.ruleForm.file = event.target.files;
      console.log(this.ruleForm.file);

      let files = this.ruleForm.file;
      // console.log('files')
      // console.log(files)
      for (let k = 0; k < files.length; k++) {
        console.log(this.ruleForm.file[k]);
        this.rowData.push({
          number: this.i++,
          name: files[k].name,
          custName: files[k].name,
          type: files[k].type,
          size:
            files[k].size > 1024 * 1024
              ? (files[k].size / 1024 / 1024).toFixed(1) + " MB"
              : (files[k].size / 1024).toFixed(1) + " KB",
          // status: '等待上传',
          mydelete: false
          // progress: this.i,
          // percent: this.percent
        });
        this.ruleForm.fileTable.push(files[k]);
      }
      this.event.target.value = "";
    },
    submitDialog() {
      let id,
        fd = new FormData();

      id = this.getSpeakerId();
      //0 原始语音;  1 训练语音
      fd.append("fileType", this.ruleForm.fileType);
      this.ruleForm.fileTable.map(el => fd.append("files", el));
      uploadSpeakersVoices(id, fd)
        .then(res => {
          if (res.status === 200) {
            this.$message.success("上传成功");
            this.gridOptions.api.refreshCells();
            this.closeDialog();
            this.$emit("setImportBatch");
          }
        })
        .catch(err => {
          console.error("uploadSpeakersVoices--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    resetForm() {
      this.index = 0;
      this.i = 0;
      this.ruleForm.fileType = 0;
      this.ruleForm.fileTable = [];
      this.rowData = [];
      this.$parent.$emit("showSlidePanel", "", true);
      this.successNum = 0;
      this.closeDialog();
    },
    closeDialog() {
      this.i = 0;
      this.index = 0;
      this.fileList = [];
      this.isUploaded = false;
      this.ruleForm.fileType = 0;
      this.ruleForm.fileTable = [];
      this.ruleForm.file = [];
      this.rowData = [];
      this.$refs["ruleForm"].resetFields();

      this.isDialogVisible = false;

      this.event ? (this.event.target.value = "") : "";
      console.log("closeDialog");
    }
  }
};
</script>

<style lang='scss'>
@media screen and (max-width: 1600px) {
  .upload-speaker {
    .ag-center-cols-container {
      width: 570px !important;
    }
    .file-name {
      width: 170px !important;
    }
    .file-type {
      width: 80px !important;
      left: 240px !important;
    }
    .file-size {
      width: 80px !important;
      left: 320px !important;
    }
    .file-progress {
      left: 400px !important;
    }
    .file-delete {
      left: 510px !important;
    }
  }
}
</style>
<style scoped lang='scss'>
.importSpeakerDialog {
  .el-form-item {
    margin-bottom: 0;
  }
  .file_item {
    .file_input {
      display: flex;
      label {
        font-size: 12px;
      }
      .fileBtn {
        width: 100px;
        height: 30px;
        line-height: 30px;
        background-color: #409eff;
        color: #fff;
        display: block;
        border-radius: 4px;
        text-align: center;
        margin-left: 15px;
        margin-top: 5px;
        cursor: pointer;
      }
    }
  }

  .upload-append {
    position: absolute;
    right: 52px;
    color: #409eff;
    cursor: pointer;

    .upload-append-icon {
      &::after {
        position: absolute;
        top: 5px;
        left: -2px;
        width: 16px;
        height: 16px;
        content: "";
        border: 1px solid #409eff;
        border-radius: 50%;
      }

      & + span {
        margin-left: 8px;
      }
    }
  }

  .count-complete {
    position: absolute;
    right: 0;
  }

  .hide {
    display: none;
  }

  .upload-area {
    position: relative;
    height: 300px;
    border: 1px solid #dddeea;
    text-align: center;

    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transform: translate(0, 70px);

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 158px;
        height: 158px;
        line-height: 158px;
        text-align: center;
        background-color: #f9f9f9;
      }

      .el-upload__input {
        display: initial;
        position: absolute;
        left: 0;
        width: 158px;
        height: 158px;
        outline: 1px solid red;
        opacity: 0;
        cursor: pointer;
      }
    }
    .name-rule {
      position: absolute;
      bottom: 20px;
      left: 90px;
      font-size: 12px;
      color: #8c939d;
    }
  }

  .remove-files {
    position: absolute;
    right: 30px;
    bottom: 40px;
    font-size: 12px;
    color: orangered;
    padding-bottom: 2px;
    background-image: linear-gradient(
      to top,
      currentColor,
      currentColor 1px,
      transparent 1px
    );
    cursor: pointer;
  }
  .el-button.checked.el-button--primary.is-disabled {
    background-color: #b3b3b3;
    border: none;
  }
}
.el-button {
  padding: 10px;
}
</style>