<template>
    <div class="statusComponent" ref="childComponent">
      <el-select v-model="value" @change="statusChange" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
</template>

<script>
  import Vue from "vue";
  import {changecallstatus} from '@/api/index.js'
  export default Vue.extend({
    data() {
      return {
        options: [
          {
            value: 0,
            label: '未处理'
          },{
            value: 1,
            label: '已调听'
          },{
            value: 2,
            label: '正确'
          },{
            value: 3,
            label: '错误'
          },{
            value: 4,
            label: '不确定'
          }
        ],
        value: 0
      }
    },
    methods: {
      collection() {
        console.log('collection')
        console.log(this.params.data)
        // console.log() 
        this.params.data.collection = !this.params.data.collection
        // return false
      },
      download() {
        console.log('download')
        console.log(this.params.data)
        console.log(this) 
        // console.log(this.$refs.childComponent.querySelector('.download').addClass('selected')) 
      },
      statusChange() {

        let params = new URLSearchParams()
        params.append('callid',this.params.data.callid)
        params.append('spyid',this.params.data.spyid)
        params.append('status',this.value)
        params.append('billLevel',this.params.data.billLevel)
        let rowIndex = this.params.rowIndex; // 亦即 params.data.sort(问@朱,答是)
        changecallstatus(params).then(res => {
          console.log(res)
          return [rowIndex, this.value]
        }).then((res) => {
            console.log('能否拿到上一个的 res:', res)
            // this.params.context.componentParent.dataInit() // method(1) 可用
            
            // let index = res[0]                             // method(2) 无用
            // let indexData = this.params.context.componentParent.rowData[index]
            // Vue.set(indexData, 'status', res[1])

            this.params.node.setDataValue('status', res[1])   // method(3) 可用
        })
      },
      refresh(v) {
        console.log('statusComponent refresh')
        console.log(v)
        this.value = v.value
        // return true
      }
    },
    mounted() {
      this.value = this.params.data.status
      // this.testval = this.params.test
    //   console.warn('statusComponent ---- this:', this)
    }
  });
</script>

<style scoped lang="scss">
.statusComponent{
  width: 84px;
}
  
</style>