<!--
 * @Author: coco-Tang
 * @Date: 2019-07-05 17:59:44
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-18 16:25:32
 * @Description: 
 -->
<template>
  <div>
    <importSpeaker-dialog @setImportBatch="childCreate2" ref="compImportSpeaker"></importSpeaker-dialog>
    <div class="panel--slide open">
      <div class="btn--close" @click="clickCloseBtn" :class="closeBtnIcon"></div>
      <div class="panel__content">
        <div class="title">
          <span>相关文件</span>
        </div>
        <div class="btn__head">
          <el-button-group class="btn__group">
            <el-button
              :disabled="noSpeaker"
              class="lbtn tabBtn"
              :type="lbtn"
              @click="initData('',0)"
            >原始文件</el-button>
            <el-button
              :disabled="noSpeaker"
              class="rbtn tabBtn"
              :type="rbtn"
              @click="initData('',1)"
            >训练样本</el-button>
          </el-button-group>
          <el-button :disabled="noSpeaker" type="primary" @click="addFiles(idx)">添加</el-button>
        </div>

        <el-table
          ref="multipleTable"
          @row-dblclick="elDblClickRow"
          @selection-change="elChangeSelection"
          :data="elTableData"
          highlight-current-row
          style="width: 100%"
          tooltip-effect="dark"
        >
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column show-overflow-tooltip prop="label" label="文件名" width="170"></el-table-column>
          <el-table-column width="53" :render-header="elRenderHeader">
            <template slot-scope="scope">
              <div class="delete" @click="confirmDeleteAll(scope)"></div>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 10px;text-align:center;">
          <el-button
            v-show="rbtn && elTableData.length"
            :disabled="trainIsshow"
            type="primary"
            @click="trainHandler"
          >训练</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  speakerUpload,
  getlocalvoice,
  speakerSampleDelete,
  speakerBatchDelete
} from "@/api/index.js";
import { uploadSpeakersVoices, delSpeakersVoices } from "@/api/speaker";
import importSpeakerDialog from "@/components/dialog/importSpeakerDialog";
import { url1 } from "@/utils/axios.js";

export default {
  name: "slidePanel",
  components: {
    "importSpeaker-dialog": importSpeakerDialog
  },
  data() {
    return {
      display: false,
      ptahList: [],
      sampleFileData: [],
      clusterFileData: [],
      trainFileData: [],
      sample: "primary",
      cluster: "",
      train: "",
      selected: {},
      elTableData: [],
      multipleSelection: [],
      idx: 0,
      lbtn: "primary",
      rbtn: "",
      closeBtnIcon: "el-icon-caret-left",
      noSpeaker: true,
      clickRow: ""
    };
  },
  props: {
    myMessage: Array,
    trainIsshow: { type: Boolean, default: false },
    buttonList: {}
  },
  computed: {
    comRefresh() {
      return this.getrefreshSlide();
    },
    myMessageChanged() {
      return this.myMessage;
    }
  },
  watch: {
    // getAudioPath () {
    //     this.fileData = []
    //     this.ptahList = this.getaudioPathList()

    //     // console.log('this.ptahList')
    //     // console.log(this.ptahList)
    //     this.getPathsData(this.ptahList.samplePaths,'sampleFileData')
    //     this.getPathsData(this.ptahList.clusterPaths,'clusterFileData')
    //     this.getPathsData(this.ptahList.trainPaths,'trainFileData')

    // },
    comRefresh() {
      this.refresh();
    },
    myMessageChanged() {
      console.log("watch--myMessageChanged----this.myMessage:", this.myMessage);
      this.elTableData = this.myMessage[this.idx].children;

      for (let k in this.elTableData) {
        if (this.elTableData[k].label === this.clickRow.label) {
          this.$refs.multipleTable.setCurrentRow(this.elTableData[k]);
          return;
        }
      }
    }
  },
  created() {},
  beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    ...mapActions(["AUDIO_PATH", "SPEAKER_FILENAME", "PLAYER_DATA"]),
    ...mapGetters(["getSpeakerId", "getAccount", "getrefreshSlide"]),
    trainHandler() {
      // console.log(this);
      this.$parent.callTrain();
    },
    clickCloseBtn(flag) {
      if (!this.getSpeakerId()) {
        // this.$message.error('请选择声纹')
        this.$message.error("请双击声纹打开声纹列表");
        return;
        // this.noSpeaker = true
        // return
      } else {
        this.noSpeaker = false;
      }

      if (flag === true) {
        this.display = true;
      } else {
        this.display = !this.display;
      }
      this.display
        ? this.$emit("slidePanel", true)
        : this.$emit("slidePanel", false);
      this.display
        ? (this.closeBtnIcon = "el-icon-caret-right")
        : (this.closeBtnIcon = "el-icon-caret-left");

      // console.log('clickCloseBtn--this.myMessage:', this.myMessage)
    },
    // handleNodeClick(item,node,tree) {
    //   console.log('item')
    //   console.log(item)
    //   // console.log(node)
    //   // console.log(tree)

    //   let d = new Date()
    //   this.NEWQL_DATA({
    //     dateFlag: d,
    //     type: 'sw',
    //     callid: 'callid'
    //   })

    //   this.selected = item
    //   this.SPEAKER_FILENAME(item.fileName)
    //   this.AUDIO_PATH(item.sharepath.replace(/http:\/\/192.168.1.73/,'http://192.168.1.95'))

    //   console.log(this.$store)
    //   console.log(item.sharepath)
    // },
    childCreate2() {
      this.$emit("showSlidePanel", "", true);
    },
    addFiles(idx) {
      console.log("addFiles--idx:", idx);
      this.$refs.compImportSpeaker.showDialog(idx);
    },
    // callDel() {

    //   let params = new URLSearchParams()
    //   params.append('objectid',this.getSpeakerId())
    //   params.append('operator',this.getAccount())
    //   params.append('filename',this.selected.fileName)
    //   params.append('type',this.selected.type)
    //   params.append('removeall',false)

    //   speakerSampleDelete(params).then(res => {
    //     console.log(res)
    //     this.$emit('showSlidePanel','',true)
    //   })
    // },
    refresh() {
      this.$emit("showSlidePanel", "", true);
    },
    elDblClickRow(row, event) {
      console.log("elDblClickRow--row:", row);
      console.log("elDblClickRow--event:", event);
      console.log(row.sharepath);
      // this.$refs.multipleTable.setCurrentRow(row)
      // this.$refs.multipleTable.setCurrentRow()

      this.clickRow = row;

      let url = "";
      if (this.rbtn == "primary") {
        url = `${url1}/api/train-voices/${row.id}`;
      } else {
        url = `${url1}/api/raw-voices/${row.id}`;
      }
      let d = new Date();
      this.PLAYER_DATA({
        dateFlag: d,
        type: "speaker",
        callid: url
        // callid: `http://192.168.1.7:9999/api/raw-voices/60`
      });
      this.SPEAKER_FILENAME(row.fileName);
      // this.$refs.multipleTable.setCurrentRow(this.elTableData[0])

      // setTimeout(()=>{
      //   this.$refs.multipleTable.setCurrentRow(this.clickRow)
      // }, 3000);
    },
    elChangeSelection(val) {
      this.multipleSelection = val;
    },
    elRenderHeader(createElement, { column }) {
      return createElement("div", {
        class: "headDelete",
        on: {
          click: this.confirmDeleteAll
        }
      });
    },
    // confirmDelete (scope) {
    //     utils.confirmBox(this,'确定删除选中文件?', this.callDel, scope)
    // },
    // callDel (scope) {
    //     console.log('scope:', scope)

    //     let id,
    //         voiceIds = [],
    //         fd = new FormData();
    //     id = this.getSpeakerId();
    //     voiceIds.push(scope.row.id)
    //     fd.append('voiceIds', voiceIds)
    //     fd.append('fileType', scope.row.fileType)

    //     return

    // },

    confirmDeleteAll(scope) {
      // 点击Cell的删除图标时的scope是含row的表格组件的行信息; 点击Header的删除图标时的scope只是MouseEvent
      // console.log('confirmDeleteAll--scope:', scope)
      if (!scope.row && this.multipleSelection.length < 1) {
        this.$message.error({
          message: "请至少选择一个要删除的文件",
          duration: 800
        });
        return;
      }
      this.Utils.confirmBox(this, "确定删除选中文件?", this.callDelAll, scope);
    },
    callDelAll(scope) {
      // console.log('callDelAll--this.multipleSelection:', this.multipleSelection)
      let id,
        voiceIds = [],
        fileType,
        fd = new FormData();
      id = this.getSpeakerId();

      if (scope.row) {
        voiceIds.push(scope.row.id);
        fileType = scope.row.fileType;
      } else {
        this.multipleSelection.map(el => voiceIds.push(el.id));
        fileType = this.multipleSelection[0].fileType;
      }

      fd.append("voiceIds", voiceIds);
      fd.append("fileType", fileType);

      delSpeakersVoices(id, fd)
        .then(res => {
          if (res.status === 200) {
            this.$message.success({ message: "删除成功", duration: 800 });
            this.$emit("showSlidePanel", "", true);
          }
        })
        .catch(err => {
          console.error("delSpeakersVoices--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    initData(a, type) {
      if (!type) {
        this.lbtn = "primary";
        this.rbtn = "";
      } else {
        this.lbtn = "";
        this.rbtn = "primary";
      }
      this.idx = type;
      this.elTableData = this.myMessage[this.idx].children;
      // console.log('this.elTableData:', this.elTableData)
    }
  }
};
</script>

<style scoped lang='scss'>
.invisible {
  visibility: hidden;
}
.show {
  display: block !important;
}
.unfinished {
  color: #da5136;
}
.complete {
  color: #36c844;
}
.panel__content {
  height: 100%;
}
.panel--slide {
  font-size: 12px;
  width: 300px;
  height: 100%;
  background-color: #fff;
  box-shadow: 0px 0px 10px #888888;
  // border: 1px solid #000;
  position: absolute;
  z-index: 999;

  top: 0px;

  transition: right 0.8s;
  right: -300px;
  padding: 20px;
  // &.close{
  //   right: -300px !important;
  // }

  .btn--close {
    width: 12px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    background-color: #fff;
    box-shadow: -2px 0px 2px #888888;
    position: absolute;
    top: 50%;
    margin-top: -23px;
    left: -12px;
    border-radius: 8px 0 0 8px;
    // border: 1px solid #000;
  }
  .panel__content {
    .title {
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 700;
    }
    .btn__head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      line-height: 30px;
    }
    // .headDelete{
    //   width: 18px;
    //   height: 18px;
    //   background: url('../../static/images/删除默认.png');
    //   &:hover{
    //     background: url('../../static/images/删除选中.png');
    //   }
    // }
    .delete {
      display: none;
      width: 18px;
      height: 18px;
      background: url("../static/images/删除默认.png");
      &:hover {
        background: url("../static/images/删除选中.png");
      }
    }
  }
}
</style>
<style lang='scss'>
.panel--slide {
  .headDelete {
    width: 18px;
    height: 18px;
    background: url("../static/images/删除默认.png");
    &:hover {
      background: url("../static/images/删除选中.png");
    }
  }
  .el-table__row:hover {
    .delete {
      display: block !important;
    }
  }
  .el-table {
    // height: 85%;
    border: 1px solid #ebeef5;
  }
  // .el-table__header-wrapper,.el-table thead,.el-table__header{
  //   background-color: #e1e1ec;
  // }
  .el-table {
    -webkit-user-select: none;
    .has-gutter {
      tr,
      th {
        background-color: #e1e1ec;
      }
    }
  }
  .el-table__body-wrapper {
    height: calc(100% - 50px);
    overflow: auto !important;
    overflow-x: hidden !important;
  }

  .btn__group {
    .el-button {
      padding: 0 15px !important;
      &.lbtn {
        border-radius: 24px 0 0 24px;
      }
      &.rbtn {
        border-radius: 0 24px 24px 0;
      }
    }
  }
}
</style>
