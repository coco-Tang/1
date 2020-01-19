<template>
  <div class="importVoiceDialog">
    <el-dialog
      :before-close="closeDialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="语料上传"
      width="630px"
    >
      <el-form
        label-position="left"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="所属集" prop="setValue">
          <el-select
            style="width: 190px; margin-right: 30px"
            v-model="ruleForm.setValue"
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

        <el-form-item class="checkGroup" :label="updateMsg.data.label" prop="optionValue">
          <el-select
            style="width: 190px; margin-right: 30px"
            v-model="ruleForm.optionValue"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ops"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="语音格式" prop="format">
          <el-select v-model="ruleForm.format" placeholder="请选择待上传语音的格式" clearable>
            <el-option
              v-for="item in fmtOpts"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

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
          <!-- <span class='name-rule'>当上传分路语音时需规范命名规则如: A路 = 文件名+"-A" 后缀名, B路 = 文件名+"-B" 后缀名。</span> -->
        </div>

        <div style="width: 100%; height: 300px" :class="rowData.length?'':'hide'">
          <ag-grid-vue
            style="width: 100%; height: 100%"
            class="ag-grid ag-theme-material"
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
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { AgGridVue } from "ag-grid-vue";
import localeText from "../../static/localeText.json";
import deleteComponent from "../deleteComponent.vue";
import progressComponent from "../progressComponent.vue";
import { newTask, modTask, uploadVoices } from "@/api/impMedia";
import { addLibraryVoices } from "@/api/train";
import ajax, { up2Serv } from "@/api/upToServer";
import { formatParams, confirm_message } from "@/utils/index";
import {
  LANG,
  PROCESS_BITS,
  FMT,
  UNION_TYPE,
  getLabel,
  getValue,
  IMPORT_AUDIO_TYPE,
  MAX_FILE_SIZE,
  form
} from "@/constant";
import axios from "axios";
import { IMPORT_MEDIA_BASEURL } from "@/config";

const makeCancelable = promise => {
  let hasCanceled_ = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(val =>
      hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
    );
    promise.catch(error =>
      hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
    );
  });
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};

export default {
  name: "importVoiceDialog",
  data() {
    return {
      upload_api: "/files",
      setOptions: UNION_TYPE,
      pageSize: 15,
      totalPage: 0,
      currentPage: 1,
      langOpts: LANG,
      processBitsOpts: PROCESS_BITS,
      fmtOpts: FMT,
      ruleForm: {
        setValue: true,
        format: "",
        optionValue: ""
      },
      rules: {
        setValue: [
          { required: true, message: "请选择待上传的所属集", trigger: "blur" }
        ],
        optionValue: [
          { required: true, message: "请选择待上传的库类型", trigger: "blur" }
        ]
      },

      dialogVisible: false,

      event: "",
      disabled: false,

      gridOptions: null,
      rowData: [],
      localeText: {},
      showToolPanel: false,
      enableColResize: true,
      headerHeight: 40,
      rowHeight: 40,
      rowSelection: "multiple",
      defaultColDef: null,
      columnDefs: null,
      fileList: [],
      successNum: 0,
      cmpltBtnState: true,
      disableState: true,
      i: 0,
      index: 0,
      tasks: [], //RequestEntity
      isUploaded: false
    };
  },
  props: {
    updateMsg: Object
  },
  computed: {
    ops() {
      return getLabel(this.updateMsg.data.label);
    }
  },
  components: {
    "ag-grid-vue": AgGridVue,
    deleteComponent: deleteComponent,
    progressComponent: progressComponent
  },
  watch: {
    rowData: {
      async handler(newValue, oldValue) {
        if (this.rowData.length) {
          this.disableState = false;
        } else {
          this.disableState = true;
        }
        this.successNum = this.rowData.filter(e => e.percent === 100).length;
        if (this.successNum > 0 && this.successNum === this.rowData.length) {
          this.cmpltBtnState = false;
        }

        let index = newValue.findIndex(v => v.mydelete === true);

        if (index != -1) {
          // 表示正在上传中
          // if (this.fileList[index].percent > 0) {
          //   const status = await confirm_message("文件正在上传中，确定移除？");
          //   if (!status) {
          //     return;
          //   }
          //   // 取消上传
          //   console.log(this.tasks[index]);
          //   const cancelable = makeCancelable(this.tasks[index]); //为异步操作添加可取消的功能
          //   cancelable.promise
          //     .then(() => console.log("resolved"))
          //     .catch(({ isCanceled, ...error }) =>
          //       console.log("isCanceled", isCanceled)
          //     );
          //   // 取消异步操作
          //   cancelable.cancel();
          // }

          this.rowData.splice(index, 1);
          Array.prototype.splice.call(this.fileList, index, 1);
          this.i--;
          this.rowData.forEach((e, i) => {
            e.number = i + 1;
            e.progress = i + 1;
          });
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapGetters(["getAccount", "getTaskId"]),
    onGridReady() {
      // if (window.innerWidth < 1280) {
      //     utils.autosize(this.gridOptions)
      // } else {
      //     this.gridOptions.api.sizeColumnsToFit()
      // }
    },
    showDialog() {
      this.dialogVisible = true;
    },
    callInputChange() {
      this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
    },
    triggerFiles(ev) {
      console.log("triggerFiles -- e:", ev);
      if (!ev.target.value) {
        return;
      }

      let file_wrong_tips = [];
      const files = [].slice.call(ev.target.files);

      files.forEach((item, index) => {
        let t, j;
        if (item.type) {
          t = item.type;
        } else {
          j = item.name.lastIndexOf(".");
          if (j !== -1) {
            t = item.name.slice(j + 1);
          } else {
            t = "";
          }
        }
        const arr = item.name.split(".");
        const file_type = arr[arr.length - 1];
        if (!IMPORT_AUDIO_TYPE.includes(file_type.toLowerCase())) {
          file_wrong_tips.push("文件 " + item.name + " 的类型不符合");
          return;
        }
        if (item.size > MAX_FILE_SIZE) {
          file_wrong_tips.push(
            "文件 " + item.name + " 的大小超过 " + MAX_FILE_SIZE / 1048576 + "M"
          );
          return;
        }
        const only_id = Date.now() + index; // 唯一标示

        this.rowData.push({
          number: ++this.i,
          type: t,
          size:
            item.size > 1024 * 1024
              ? (item.size / 1024 / 1024).toFixed(1) + " MB"
              : (item.size / 1024).toFixed(1) + " KB",
          file: item,
          uid: only_id,
          name: item.name,
          percent: 0,
          progress: this.i, // useless
          mydelete: false
        });

        this.fileList.push(item);
      });

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

      ev.target.value = "";
    },
    uploadFile() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isUploaded = true;
          const { format, optionValue, setValue } = this.ruleForm;
          const { data } = this.updateMsg;
          let params = {
            type: data.value,
            typeValue: optionValue,
            isTest: setValue,
            sourceType: "local"
          };

          let fd1,
            fd2,
            calcFlag,
            flagArr,
            language,
            fileUrls = [];

          if (this.rowData.length) {
            let tasks = [];
            // if (process.env.NODE_ENV === "production") {
            //   this.upload_api = this.IMPORT_MEDIA_BASEURL+"/files";
            // }

            this.fileList.forEach((item,index) => {
            if (process.env.NODE_ENV === "production") {
              tasks.push(
                axios({
                  method: "post",
                  url: `${IMPORT_MEDIA_BASEURL}/files`,
                  data: formatParams({ file: item }, "fd"),
                  onUploadProgress: progressEvent => {
                    for (let i in this.rowData) {
                      this.rowData[i].name === item.name
                        ? (this.rowData[i].percent = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                          ))
                        : "";
                    }
                  }
                }).then(res => {
                  if (res.status === 200) {
                      this.$set(item, "percent", 100);
                      fileUrls.push(res.data.url);
                    } else {
                      this.$notify.error({
                        title: "错误",
                        message: "服务连接错误 " + item.name + " 未上传成功"
                      });
                    }
                })
              );
            } else {
              tasks.push(
                ajax({
                  method: "post",
                  url: "/files",
                  data: formatParams({ file: item }, "fd"),
                  onUploadProgress: progressEvent => {
                    for (let i in this.rowData) {
                      this.rowData[i].name === item.name
                        ? (this.rowData[i].percent = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                          ))
                        : "";
                    }
                  }
                }).then(res => {

                  if (res.status === 200) {
                      this.$set(item, "percent", 100);
                      fileUrls.push(res.data.url);
                    } else {
                      this.$notify.error({
                        title: "错误",
                        message: "服务连接错误 " + item.name + " 未上传成功"
                      });
                    }
                })
              );
            }
            })

            // this.rowData.forEach((item, index) => {
            //   this.tasks.push(
            //     ajax({
            //       method: "POST",
            //       url: this.upload_api,
            //       data: formatParams({ file: item.file }, "fd"),
            //       onUploadProgress: progressEvent => {
            //         const percent =
            //           (progressEvent.loaded / progressEvent.total) * 100;
            //         this.$set(
            //           item,
            //           "percent",
            //           Math.floor(percent) === 100
            //             ? 99
            //             : Math.floor(percent) || 1
            //         );
            //       }
            //     })
            //       .then(res => {
            //         if (res.status === 200) {
            //           this.$set(item, "percent", 100);
            //           fileUrls.push(res.data.url);
            //         } else {
            //           this.$notify.error({
            //             title: "错误",
            //             message: "服务连接错误 " + item.name + " 未上传成功"
            //           });
            //         }
            //       })
            //       .catch(err => {
            //         this.$notify.error({
            //           title: "错误",
            //           message: "服务连接错误 " + item.name + " 未上传成功"
            //         });
            //       })
            //   );
            // });

            axios
              .all(tasks)
              .then(() => {
                params.fileUrl = fileUrls;
              })
              .then(res => {
                console.log("axios.all then then", params);
                addLibraryVoices(params).then(res => {
                  this.$parent.$refs[data.value + "Table"].dataInit();
                });
              });
          }
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    handleChange() {},
    resetForm() {
      this.closeDialog();
    },
    closeDialog() {
      this.fileList = [];
      this.rowData = [];
      this.$refs["ruleForm"].resetFields();

      this.ruleForm.setValue = true;
      this.ruleForm.optionValue = "";
      this.ruleForm.format = "";

      this.i = 0;
      this.isUploaded = false;
      this.dialogVisible = false;
      console.log("closeDialog");
    }
  },
  beforeMount() {
    this.gridOptions = {};
    this.localeText = localeText;
    this.defaultColDef = {
      width: 80,
      resizable: true,
      filter: true
    };
    this.columnDefs = [
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
        width: 200
      },
      {
        headerName: "类型",
        editable: false,
        field: "type",
        menuTabs: ["columnsMenuTab"]
      },
      {
        headerName: "大小",
        editable: false,
        field: "size",
        menuTabs: ["columnsMenuTab"]
      },
      {
        headerName: "进度",
        editable: false,
        field: "progress",
        menuTabs: ["columnsMenuTab"],
        width: 110,
        cellRendererFramework: progressComponent //pinned: 'right'
      },
      {
        headerName: "",
        editable: false,
        field: "mydelete",
        menuTabs: ["columnsMenuTab"],
        width: 30,
        maxWidth: 30,
        cellRendererFramework: deleteComponent,
        pinned: "right"
      }
    ];
  }
};
</script>

<style scoped lang="scss">
.importVoiceDialog {
  .el-form-item {
    margin-bottom: 0;
    &.is-required {
      margin-bottom: 22px;
    }
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
        top: 10px;
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

    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transform: translate(205px, 70px);

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
      left: 38px;
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