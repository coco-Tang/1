<template>
    <div class='importVideoDialog'>
        <el-dialog
            :before-close='closeDialog'
            :visible.sync='dialogVisible'
            :close-on-click-modal='false'
            :title='dialogTitle'
            width='630px'>
            <el-form label-position='left' :model='ruleForm' :rules='rules' ref='ruleForm' label-width='80px' class='demo-ruleForm'>

                <el-form-item label='语种' prop='language' :class="{'hide':this.$route.name==='importListVideo'}">
                    <el-select style='width: 190px; margin-right: 30px' :disabled='disabled' v-model='ruleForm.recognize' placeholder='请选择'>
                        <el-option
                            v-for='item in langOpts'
                            :key='item.value'
                            :label='item.label'
                            :value='item.value'>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class='checkGroup' label='处理内容' prop='langname' :class="{'hide':this.$route.name==='importListVideo'}">
                    <el-checkbox-group @change='checkboxChange' v-model='ruleForm.checkList'>
                        <el-checkbox v-for='item in processBitsOpts' :label='item.value' :key='item.value'>
                            {{ item.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label='备注' prop='remark' :class="{'hide':this.$route.name==='importListVideo'}">
                    <el-input v-model='ruleForm.remark'></el-input>
                </el-form-item>

                <el-form-item label='上传视频' v-if='!updateMsg.isEdit'>
                    <span class='upload-append' :class="{'hide':isUploaded}" @click='callInputChange'>
                        <i class='el-icon-plus avatar-uploader-icon upload-append-icon'></i><span>继续添加</span>
                    </span>
                    <span class='count-complete'>{{ successNum }} / {{ rowData.length }} 条</span>
                </el-form-item>
                <div class='upload-area' :class="rowData.length?'hide':''" v-if='!updateMsg.isEdit'>
                    <div class='el-upload'>
                        <i class='el-icon-plus avatar-uploader-icon'></i>
                        <input type='file' name='file' title='' multiple class='el-upload__input' ref='filElem' @change='triggerFiles'>
                    </div>
                    <span class='name-rule'>支持常用格式的视频文件上传。</span>
                </div>

                <div style='width: 100%; height: 300px' :class="rowData.length?'':'hide'" v-if='!updateMsg.isEdit'>
                    <ag-grid-vue style='width: 100%; height: 100%' class='ag-grid ag-theme-material'
                        :gridOptions = 'gridOptions' 
                        :showToolPanel = 'showToolPanel'
                        :headerHeight = 'headerHeight'
                        :rowHeight = 'rowHeight'
                        :defaultColDef='defaultColDef'
                        :columnDefs = 'columnDefs'
                        :rowData = 'rowData'
                        :localeText = 'localeText'
                        :rowSelection='rowSelection'
                        :rowDeselection='true'
                        :suppressRowClickSelection='true'
                        :toolPanelSuppressRowGroups='true'
                        :toolPanelSuppressValues='true'
                        :toolPanelSuppressPivots='true'
                        :toolPanelSuppressPivotMode='true'
                        :suppressToolPanel='true'
                        :toolPanelSuppressSideButtons='true'
                        @gridReady='onGridReady'
                        >
                    </ag-grid-vue>
                </div>
            </el-form>
            
            <span slot='footer' class='dialog-footer'>
                <el-button v-if='this.$route.name==="importListVideo"' type='primary' class='checked' @click='appendFile' :class="{'hide':isUploaded}" :disabled='disableState'>确&nbsp;定</el-button>
                <el-button v-else type='primary' class='checked' @click='uploadFile' :class="{'hide':isUploaded}" :disabled='disableState'>确&nbsp;定</el-button>
                <el-button @click='resetForm' :class="{'hide':isUploaded}">取&nbsp;消</el-button>
                <el-button type='primary' class='checked' @click='resetForm' :disabled='cmpltBtnState' :class="{'hide':!isUploaded}">完&nbsp;成</el-button>
                <!-- <span class='remove-files' @click='resetFiles' :class="rowData.length?'':'hide'">移除全部</span> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { AgGridVue } from 'ag-grid-vue'
import localeText from '../../static/localeText.json'
import deleteComponent from '../deleteComponent.vue'
import progressComponent from '../progressComponent.vue'
import { newTask, modTask, uploadVideos } from '@/api/impMedia'
import ajax, { up2Serv } from '@/api/upToServer'
import * as utils from '@/utils/index'
import { LANG, PROCESS_BITS } from '@/constant'
import axios from 'axios'
import { IMPORT_MEDIA_BASEURL } from "@/config";

export default {
    name: 'importVideoDialog',
    data () {
        return {
            dialogTitle: '新建任务',
            pageSize: 15,
            totalPage: 0,
            currentPage: 1,
            langOpts: LANG,
            processBitsOpts: PROCESS_BITS,
            ruleForm:{
                remark: '',
                recognize: '自动识别',
                checkList: ['1','4','8','32','64','128','256']

            },
            rules: {
                name: [
                    { required: true, message: '请输入音频名称', trigger: 'blur' },
                    { min: 2, message: '音频名称的最小长度是2个字符', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入音频编号', trigger: 'blur' },
                    { min: 2, message: '音频编号的最小长度是2个字符', trigger: 'blur' }
                ],
            },
                
            dialogVisible: false,
            event: '',
            disabled: false,

            gridOptions: null,
            rowData:[],  
            localeText: {},
            showToolPanel: false,
            enableColResize: true,
            headerHeight: 40,
            rowHeight: 40,
            rowSelection: 'multiple',
            defaultColDef: null,
            columnDefs: null,
            fileList: [],
            successNum: 0,
            cmpltBtnState: true,
            disableState: true,
            isEdit: false,
            i: 0,
            //   index: 0,
            isUploaded: false
        }
    },
    props: {
        updateMsg: Object
    },
    components: {
        'ag-grid-vue': AgGridVue,
        deleteComponent: deleteComponent,
        progressComponent: progressComponent
    },
    watch: {
        rowData: {
        　　handler(newValue, oldValue) {
                if (this.rowData.length) {
                    this.disableState = false
                } else {
                    this.disableState = true
                }
                this.successNum = this.rowData.filter(e => e.percent === 100).length
                if (this.successNum > 0 && this.successNum === this.rowData.length) {
                    this.cmpltBtnState = false
                }

                let index = newValue.findIndex(v => v.mydelete === true)
                // console.log('if <--> before & out')
                // console.log(index)
                if (index != -1) {
                    //   console.log('if <--> in ---- index: %o\nif <--> in ---- this.rowData:', index, this.rowData)
                    this.rowData.splice(index, 1)
                    Array.prototype.splice.call(this.fileList, index, 1)
                    this.i--
                    this.rowData.forEach((e,i) => {
                        e.number = i+1
                        e.progress = i+1
                    })
                    //     console.warn('watch -- this.index:', this.index)
                    //   this.index > 0 ? this.index-- : ''
                }
                
            },
            deep: true
        }
    },
    methods: {
        ...mapGetters(['getAccount', 'getTaskId']),
        onGridReady() {
            // if (window.innerWidth < 1280) {
            //     utils.autosize(this.gridOptions)
            // } else {
            //     this.gridOptions.api.sizeColumnsToFit()
            // }
        },
        calcProcessFlag(flags) {
            let mapping = {
                'char' : ['有效音检测', '语种检测', '性别检测', '声纹检测', '固定音频检测', '端点检测', '拨号音检测', '关键词检测', '全文转写'],
                'code' : [1, 2, 4, 8, 16, 32, 64, 128, 256]
            }
            let arr = []
            mapping['code'].map(e => {
                if (flags & e) {
                    arr.push(e.toString())
                }
            })
            return arr
        },
        checkboxChange() {
            console.log(this.ruleForm.checkList)
            // for (let k in this.ruleForm.checkList) {
            //     if(this.ruleForm.checkList[k] === '8') {
            //         this.disabled = false
            //         return
            //     } 
            // }
            // this.disabled = true
        },
        showDialog() {
            this.dialogVisible = true

            if (this.updateMsg.isEdit) {
                this.dialogTitle = '编辑任务'
                this.disableState = false
                this.cmpltBtnState = false

                this.ruleForm.remark = this.updateMsg.data.remark

                if (this.updateMsg.data.language != '英语' && this.updateMsg.data.language != '汉语' && this.updateMsg.data.language != '维语') {
                    this.ruleForm.recognize = '自动检测'
                }
                else {
                    this.ruleForm.recognize = this.updateMsg.data.language
                }

                this.ruleForm.checkList = this.calcProcessFlag(this.updateMsg.data.recogflag)

            }
        },
        callInputChange () {
            this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
        },
        triggerFiles (e) {
            // console.log('triggerFiles -- e:', e)
            // console.log('e.target.files.length:', e.target.files.length)
            let file_wrong_tips = [];
            let exclusion1 = /audio|text|application|image/
              , exclusion2 = /rar|7z/
              , filesArr = Array.prototype.slice.call(e.target.files)
            filesArr.forEach(e => {
                if (!exclusion1.test(e.type) && !exclusion2.test(e.name)) {
                    let t, j
                    if (e.type) {
                        t = e.type
                    } else {
                        j = e.name.lastIndexOf('.')
                        if (j !== -1) {
                            t = e.name.slice(j+1)
                        } else {
                            t = ''
                        }
                    }
                    this.rowData.push({
                        // number: ++i,
                        number: ++this.i,
                        name: e.name,
                        type: t,
                        size: e.size > 1024*1024 ? (e.size/1024/1024).toFixed(1) + ' MB' : (e.size/1024).toFixed(1) + ' KB',
                        mydelete: false,
                        // progress: i,
                        progress: this.i, // useless
                        percent: 0
                    })
                    this.fileList.push(e)
                }else {
          file_wrong_tips.push("文件 " + e.name + " 的类型不符合");
        }
            })
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
            e.target.value = ''
        },
        uploadFile() {
            this.isUploaded = true

            if (!this.updateMsg.isEdit) {

                let fd1, fd2, calcFlag, flagArr, language, fileUrls = []
    
                // fd1 = new URLSearchParams()
                fd1 = {}
                
                flagArr = Object.assign([], this.ruleForm.checkList)
                if (this.ruleForm.recognize == '自动识别') {
                    flagArr.push('2')
                }
                calcFlag = flagArr.reduce((accu, curr) => Number(accu) + Number(curr))
    
                this.ruleForm.recognize == '自动识别' ? language = '' : language = this.ruleForm.recognize
                
                // fd1.append('processingContent', calcFlag)
                // fd1.append('remark', this.ruleForm.remark)
                // fd1.append('language', language)
                // fd1.append('creator', this.getAccount())
                // fd1.append('type', 2) // type: 1 语音, 2 视频
                fd1.processingContent = calcFlag
                fd1.remark = this.ruleForm.remark
                fd1.language = language
                fd1.type = 2
    
                if (this.rowData.length) {
    
                    let tasks = []
                    
                    for (let f of this.fileList) {
                        let p = new FormData()
                        p.append('file', f)
    
                        if (process.env.NODE_ENV === 'production') {
                            tasks.push(
                                axios({
                                        method: 'post',
                                        url: `${IMPORT_MEDIA_BASEURL}/files`,
                                        data: p,
                                        onUploadProgress: (progressEvent) => {
                                            for (let i in this.rowData) {
                                                this.rowData[i].name === f.name ? this.rowData[i].percent = Math.round(progressEvent.loaded/progressEvent.total*100) : ''
                                            }
                                        }
                                    })
                                    .then(res => {
                                        console.log('导入视频 -- axios -- res:', res)
                                        // fileUrls.push(res.data.url)
                                        let obj = {}
                                        obj.url = res.data.url
                                        obj.fileName = f.name
                                        fileUrls.push(obj)
                                    })
                            )
                        } else {
                            tasks.push(
                                // <1> 实体信息
                                ajax({
                                        method: 'post',
                                        url: '/files',
                                        data: p,
                                        onUploadProgress: (progressEvent) => {
                                            for (let i in this.rowData) {
                                                // console.warn('f.name:', f.name)
                                                this.rowData[i].name === f.name ? this.rowData[i].percent = Math.round(progressEvent.loaded/progressEvent.total*100) : ''
                                                // console.log('this.rowData['+i+'].percent:', this.rowData[i].percent)
                                            }
                                        }
                                    })
                                    .then(res => {
                                        console.log('导入视频 -- axios -- res:', res)
                                        // fileUrls.push(res.data.url)
                                        let obj = {}
                                        obj.url = res.data.url
                                        obj.fileName = f.name
                                        fileUrls.push(obj)
                                    })
                            )
                        }
                    }
    
                    axios.all(tasks)
                        .then(axios.spread(oneOfReses => {
                            console.log('oneOfReses:', oneOfReses)
                            // fd1.append('files', fileUrls)
                            fd1.files =  fileUrls
                        }))
                        .then(res => {
                            // <2> 文字信息
                            newTask(fd1)
                                .then(res => {
                                    this.isUploaded = true
                                    this.$parent.dataInit()
                                })
                        })
                }
    
            } else {
                let fd, calcFlag, flagArr, language
    
                fd = new URLSearchParams()
                
                flagArr = Object.assign([], this.ruleForm.checkList)
                if (this.ruleForm.recognize == '自动识别') {
                    flagArr.push('2')
                }
                flagArr = Array.from(new Set(flagArr)) // 剔除编辑'自动识别'时,多push一次'2'的情况
                calcFlag = flagArr.reduce((accu, curr) => Number(accu) + Number(curr))
    
                this.ruleForm.recognize == '自动识别' ? language = '' : language = this.ruleForm.recognize
                
                fd.append('taskId', this.updateMsg.data.taskId)
                fd.append('processingContent', calcFlag)
                fd.append('remark', this.ruleForm.remark)
                fd.append('language', language)
                fd.append('type', 2)

                modTask(fd)
                    .then(res => {
                        this.$parent.dataInit()
                    })
            }

        },
        appendFile() {
            this.isUploaded = true
            let taskId = this.getTaskId(), fileUrls = [];
            
            if (this.rowData.length) {
    
                let tasks = []
                
                for (let f of this.fileList) {
                    let p = new FormData()
                    p.append('file', f)

                    if (process.env.NODE_ENV === 'production') {
                        tasks.push(
                            axios({
                                    method: 'post',
                                    url: `${IMPORT_MEDIA_BASEURL}/files`,
                                    data: p,
                                    onUploadProgress: (progressEvent) => {
                                        for (let i in this.rowData) {
                                            this.rowData[i].name === f.name ? this.rowData[i].percent = Math.round(progressEvent.loaded/progressEvent.total*100) : ''
                                        }
                                    }
                                })
                                .then(res => {
                                    console.log('导入视频 -- axios -- res:', res)
                                    let obj = {}
                                    obj.url = res.data.url
                                    obj.fileName = f.name
                                    // fileUrls.push(res.data.url)
                                    fileUrls.push(obj)
                                })
                        )
                    } else {
                        tasks.push(
                            ajax({
                                    method: 'post',
                                    url: '/files',
                                    data: p,
                                    onUploadProgress: (progressEvent) => {
                                        for (let i in this.rowData) {
                                            this.rowData[i].name === f.name ? this.rowData[i].percent = Math.round(progressEvent.loaded/progressEvent.total*100) : ''
                                        }
                                    }
                                })
                                .then(res => {
                                    console.log('导入视频 -- axios -- res:', res)
                                    let obj = {}
                                    obj.url = res.data.url
                                    obj.fileName = f.name
                                    fileUrls.push(obj)
                                })
                        )
                    }
                }

                axios.all(tasks)
                    .then(axios.spread(oneOfReses => {
                        console.log('oneOfReses:', oneOfReses)
                    }))
                    .then(res => {
                        uploadVideos(fileUrls, taskId)
                            .then(res => {
                                this.$parent.dataInit()
                            })
                    })
            }
        },
        resetFiles () {
            this.fileList = []
            this.rowData = []
        },
        handleChange () {

        },
        resetForm () {
            this.closeDialog()
        },
        closeDialog () {
            this.fileList = []
            this.rowData = []
            this.$refs['ruleForm'].resetFields()
            
            this.ruleForm.checkList = ['1','4','8','32','64','128','256']
            this.ruleForm.recognize = '自动识别'
            this.ruleForm.remark = ''
            this.ruleForm.format = ''

            this.i = 0
            this.updateMsg.isEdit = false
            this.isUploaded = false
            this.dialogVisible = false
            console.log('closeDialog')
        },
    },
    beforeCreate() {},
    created() {},
    beforeMount() {
        this.gridOptions = {}
        this.localeText = localeText
        this.defaultColDef = {
            width: 80,
            resizable: true,
            filter: true
        }
        this.columnDefs = [
            {   headerName: '序号', editable: false, field: 'number', menuTabs: ['columnsMenuTab'], width: 70 },
            {   headerName: '文件名', editable: false, field: 'name',menuTabs: ['columnsMenuTab'], tooltipField: 'name', width: 200 },
            {   headerName: '类型', editable: false, field: 'type',menuTabs: ['columnsMenuTab'] },
            {   headerName: '大小', editable: false, field: 'size',menuTabs: ['columnsMenuTab'] },
            {
                headerName: '进度', editable: false, field: 'progress', menuTabs: ['columnsMenuTab'], width: 110,
                cellRendererFramework: progressComponent, //pinned: 'right'
            },
            {
                headerName: '', editable: false, field: 'mydelete', menuTabs: ['columnsMenuTab'], width: 30, maxWidth: 30,
                cellRendererFramework: deleteComponent, pinned: 'right'
            }
        ]

    },
    mounted () {
        if (this.$route.name === 'importListVideo') { // 编辑任务不必做修改, 因为importListVideo页没有'编辑'功能
            this.dialogTitle = '导入视频'
        }
    },
    beforeUpdate () {},
    updated() {},
    activated() {},
    deactivated() {},
    beforeDestroy() {},
    destroyed() {}
}
</script>

<style scoped lang="scss">
    .importVideoDialog {
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
                    background-color: #409EFF;
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
            color: #409EFF;
            cursor: pointer;

            .upload-append-icon {
                &::after {
                    position: absolute;
                    top: 10px;
                    left: -2px;
                    width: 16px;
                    height: 16px;
                    content: '';
                    border: 1px solid #409EFF;
                    border-radius: 50%;
                }

                &+span {
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
                // left: 24px;
                left: 205px;
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
            background-image: linear-gradient(to top, currentColor, currentColor 1px, transparent 1px);
            cursor: pointer;
        }
        .el-button.checked.el-button--primary.is-disabled {
            background-color: #b3b3b3;
            border: none;
        }
    }
	.el-button{
		padding: 10px;
	}
</style>