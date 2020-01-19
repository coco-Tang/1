
<template>
  <div class="numberSelect">
    
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="60%">
      <div class="head">
        <div class="left">
          <el-input v-model="phones" autofocus="true" placeholder="请输入号码,多个号码用逗号(,)分隔"></el-input>
        </div>
        <div class="right">
          <el-select disabled v-model="category" @change="categoryChange" placeholder="请选择">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </div>

        
      </div>
      <div class="body">
        <ag-grid-vue style="width: 100%; height:500px " class="ag-grid ag-theme-material"
                :gridOptions = "gridOptions" 
                :showToolPanel = "showToolPanel"
                :enableColResize = "enableColResize"
                :headerHeight = "headerHeight"
                :rowHeight = "rowHeight"
                :enableFilter = "enableFilter"
                :columnDefs = "columnDefs"
                :rowData = "rowData"
                :localeText = "localeText"
                :rowSelection="rowSelection"     
                :rowDeselection="rowDeselection"
                :suppressRowClickSelection="suppressRowClickSelection"
                :toolPanelSuppressRowGroups="true"
                :toolPanelSuppressValues="true"
                :toolPanelSuppressPivots="true"
                :toolPanelSuppressPivotMode="true"
                :suppressToolPanel="true"
                :toolPanelSuppressSideButtons="true"

                :gridReady="onGridReady"
                  >
        </ag-grid-vue>
      </div>
      
      <div class="foot">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 25, 50, 100,200,500,1000]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
      <div class="btnGroup">
        <el-button-group>
          <el-button type="primary" @click="getNumber">确定</el-button>
          <el-button type="primary">取消</el-button>
        </el-button-group>
      </div>
    </el-dialog>    
  </div>
</template>

<script>

import {AgGridVue} from 'ag-grid-vue'
import {getCasePhones,getPhoneno} from '@/api/index.js'
import localeText from '../static/localeText.json'
export default {
  name: 'numberSelect',
  data () {
    return {
      dialogVisible: false,
      radio2: 3,
      currentPage: 1,
      pageSize: 15,
      totalPage:'',
      localeText: {},
      gridOptions: {}, 
      showToolPanel: false,
      enableColResize: true,
      headerHeight: 40,
      rowHeight: 40,
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressRowClickSelection: true,
      columnDefs: [
        // {
        //   headerName: '序号', 
        //   editable: false, 
        //   field: 'number',
        //   headerCheckboxSelection: true,
        //   checkboxSelection: true
        // },
        {
          headerName: '电话号码', editable: false, field: 'phone', menuTabs: ['columnsMenuTab'],
          headerCheckboxSelection: true, checkboxSelection: true,
        },
        {headerName: '姓名', editable: false, field: 'relaPerson',menuTabs: ['columnsMenuTab']},
        {headerName: '备注', editable: false, field: '',menuTabs: ['columnsMenuTab']},
        {headerName: '相关案件', editable: false, field: 'caseName',menuTabs: ['columnsMenuTab']}
      ],
      rowData: [],
      category: 1,
      categoryOptions: [{
        value: 0,
        label: '案件'
      },{
        value: 1,
        label: '威胁号码库'
      }],
      phones: ''
    }
  },
  props: {

  },
  components: {
    'ag-grid-vue': AgGridVue,
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    handleSizeChange(v) {
      this.pageSize = v
      // console.log('handleSizeChange')
      this.dataInit()
    },
    handleCurrentChange(v) {
      this.currentPage = v
      // console.log('handleCurrentChange')
      this.dataInit()
    },
    categoryChange() {
      this.dataInit()
      // console.log('categoryChange')
    },
    onlinestateFormatter(v) {
      return v.value===1?'上线':'下线'
    },
    dataInit() {

      // console.log('child mounted')
      let params = new URLSearchParams()
      params.append('start',(this.currentPage-1)*this.pageSize)
      params.append('limit',this.pageSize)
      params.append('category',this.category)
      params.append('type',1)

      this.rowData = []
      this.totalPage = null
      if(this.category === 0){
        getCasePhones(params).then(res => {
          // console.log('child getSpeechseg')
          // console.log(res)
          var data = res.data.records
          for(var k in data){
            data[k].number = Number(k)+1
            this.rowData.push(data[k])
          }
          this.rowData = res.data.records
          this.totalPage = res.data.total
        })
      }else{
        getPhoneno(params).then(res => {
          // console.log('child getSpeechseg')
          // console.log(res)
          var data = res.data.records
          for(var k in data){
            data[k].number = Number(k)+1
            this.rowData.push(data[k])
          }
          this.rowData = res.data.records
          this.totalPage = res.data.total
        })
      }
      

    },
    onGridReady() {
      // console.log('endif')
      // this.gridOptions.api.sizeColumnsToFit()
      this.localeText = localeText
      if(window.innerWidth < 1600){
        this.Utils.autosize(this.gridOptions)
      }else{
        this.gridOptions.api.sizeColumnsToFit()
      }
    },
    getNumber() {
      let arr = this.gridOptions.api.getSelectedRows()
      let nameArr = []
      let idArr = []
      // console.log(arr)
      for(let k in arr){
        nameArr.push(arr[k].phone)
        // idArr.push(arr[k].id)
      }
      let phone = nameArr.join(',')
      this.$emit('setNumber',{
        phone: phone,
        // id: idArr 
      })

      // console.log('getNumber')
      // console.log(phone)

      this.dialogVisible = false
    }
  },
  beforeCreate() {

  },
  created() {

  },
  beforeMount() {

  },
  mounted () {
    this.dataInit()
  },
  beforeUpdate () {

  },
  updated() {

  },
  activated() {

  },
  deactivated() {

  },
  beforeDestroy() {

  },
  destroyed() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.numberSelect{
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  .head{
    display: flex;
    .left{
      width: calc(100% - 200px);
      padding-bottom: 10px;
    }
    .right{
      margin-left: auto;
    }
  }
  .body{

  }
  .foot{

  }
  .btnGroup{
    padding-left: calc(100% - 100px);
  }
}
   
  
</style>