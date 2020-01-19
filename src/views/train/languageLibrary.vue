<template>
  <div class="language_library">

    <language-library-dialog :update-msg="updateMsg"  ref="c1"></language-library-dialog>

    <div class="table">

      <div class="table_head">

        <div class="top">
          <span style="font-weight: 700;">语料库列表</span> 
        </div>
        
        <div class="bottom">

        	<div class="items item-1">
            <div class="flex">
              <el-radio-group v-model="libraryType" @change="toogleLibrary">
					      <el-radio-button v-for="item in languageLibrary" :key="item.value" :label="item.label"></el-radio-button>
					    </el-radio-group>
            </div>
          </div>

          <div class="items item-2">
            <div class="flex">
              <span class="title">所属集</span>
              <el-select v-model="setValue" placeholder="请选择">
						    <el-option
						      v-for="item in setOptions"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
            </div>
          </div>

          <div class="items item-3">
            <choice-item ref="choice" :options="choiceOptions" :label="choiceLable" @value="getChoiceValue"></choice-item>
          </div>

          <div class="items item-4" style="margin-right:0px">
            <el-button type="primary" @click="newImport" class="create">上传</el-button>
            <el-button type="primary" @click="deleteConfirm" class="del" :disabled="multipleSelection.length < 1">删除</el-button>
          </div>

        </div>
        
      </div>

      <component :is="tableType" :setValue="setValue" :pageSize="pageSize" :currentPage="currentPage" @page="page" :ref="tableType" @delete="deleteMsg"></component>
     
      <div class="table_pagination" :class="{ 'pager-hidden' : !totalPage || totalPage <= 15 }">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 25, 50, 100,200,500,1000]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>

    </div>
    
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import * as utils from "@/utils/index";
import { queryLibraryVoices, delLibraryVoices } from "@/api/train.js";
import localeText from "../../static/localeText.json";
import ChoiceItem from "./components/ChoiceItem";
import languageTable from "./components/voice-detection/LanguageTable";
import voiceDetectionTable from "./components/voice-detection/VoiceDetectionTable";
import genderTable from "./components/voice-detection/GenderTable";
import {GENDER_TYPE1,UNION_TYPE,LANGUAGE_LIBRARY_TYPE,getValue,removeLastLabel} from "@/constant";
import LanguageLibraryDialog from '@/components/dialog/LanguageLibraryDialog.vue'
export default {
  name: "language_library",
  data() {
    return {
      multipleSelection:[],
      updateMsg:{
        isEdit: false,
        data:{
          label: this.libraryType
        }
      },
      tableType: "genderTable",
      libraryType: '性别库',
      setValue: true,
      setOptions: UNION_TYPE,
      typeValue: "valid",
      choiceLable: "性别",
      choiceOptions:GENDER_TYPE1,
      languageLibrary:LANGUAGE_LIBRARY_TYPE,
      loading: false,
      totalPage: 0,
      currentPage: 1,
      pageSize: 15,

      gridOptions: {},
      showToolPanel: false,
      enableColResize: true,
      headerHeight: 40,
      rowHeight: 40,
      enableFilter: true,
      rowSelection: "multiple",
      rowDeselection: true,
      suppressRowClickSelection: true,
      toolPanelSuppressRowGroups: true,
      toolPanelSuppressValues: true,
      toolPanelSuppressPivots: true,
      toolPanelSuppressPivotMode: true,
      suppressToolPanel: true,
      toolPanelSuppressSideButtons: true,
      rowMultiSelectWithClick: true,
      suppressColumnVirtualisation: true,
      rowData: [],
      localeText: {}
    };
  },
  components: {
    genderTable,
    voiceDetectionTable,
    languageTable,
    "choice-item": ChoiceItem,
    'language-library-dialog': LanguageLibraryDialog,
  },
  methods: {
    page(v) {
      this.totalPage = v;
    },
    handleSizeChange(v) {
      this.pageSize = v;
    },
    handleCurrentChange(v) {
      this.currentPage = v;
    },
    newImport() {
      this.updateMsg.isEdit = false;
      this.updateMsg.data.label = this.libraryType;
      this.updateMsg.data.value = getValue(this.libraryType);
      this.$refs.c1.showDialog();
    },
    deleteMsg(value) {
      this.multipleSelection = value[1];
    },
    deleteConfirm() {
      this.Utils.confirmBox(this, "确定删除选中语音?", this.mydeleteHandle);
    },
    mydeleteHandle() {
      let deleteArr = [];
      this.multipleSelection.forEach(item => {
        if (item.id) {
          deleteArr.push(item.id);
        }
      });

      if ( this.multipleSelection.length > 1 ) {
        this.$message.error("后台暂不支持批量删除，请逐个删除！");
        return
      }

      this.loading = true;
      this.del(deleteArr);
      
    },
    del(deleteArr) {
      delLibraryVoices(deleteArr)
        .then(res => {
          if (res.status === 200) {
            this.$message.success("删除成功");
          }
        })
        .then(() => {
          this.$refs[this.tableType].dataInit()
        })
        .catch(err => {
          console.error("deleteUsers--err:", err);
          this.$message.error(err.response.data.msg);
        });
    },
    getChoiceValue(value) {
      this.typeValue = value;
    },
    toogleLibrary(value) {
      this.pageSize = 15;
      this.currentPage = 1;
      const obj = LANGUAGE_LIBRARY_TYPE.find(item => item.label === value);
      this.choiceLable = removeLastLabel(obj.label);
      this.$refs["choice"].value = obj.defaultOption;
      this.tableType = obj.value+"Table";
      this.choiceOptions = obj.options;
    },
  },
  created() {
    this.localeText = localeText;
  }
};
</script>

<style scoped lang="scss">
.language_library {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .table {
    padding: 10px 20px 20px;
    .table_head {
      // .flex {
      //   display: flex;
      //   align-items: center;
      // }
      display: flex;
      flex-direction: column;
      .top{

      }
      .bottom{
				display: flex;
				flex-direction: row;
				height: 40px;
				line-height: 40px;
				justify-content: flex-end;
				.item-1{
					margin-right: auto;
				}
				.items{
         .el-select {
           margin: 0 10px !important;
         }
				}
      }
    }
  }
}
</style>

<style lang="scss">
.language_library {

  .table {
    .table_head {
      .top{
        margin:10px 0;
      }
      .bottom{
				.radiogroup{
					height: 30px;
					line-height: 30px;
					.el-radio-button__inner{
						padding: 7px 10px;
					}
				}
				.el-select{
					width: 100px;
				}
      }
    }
  }
}
</style>
