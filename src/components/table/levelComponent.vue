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
        options: [{
          value: 9,
          label: '一般'
        }, {
          value: 6,
          label: '严重'
        }, {
          value: 7,
          label: '紧急'
        }, {
          value: 8,
          label: '排除'
        }],
        value: 9
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
        params.append('status',this.params.data.status)
        params.append('billLevel',this.value)

        changecallstatus(params).then(res => {
          console.log(res)
        })
      }
    },
    beforeCreate() {
      
    },
    created() {
      this.value = this.params.data.billLevel
    },
    beforeMount() {
     
    },
    mounted () {

      
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
  });
</script>

<style scoped lang="scss">
.statusComponent{

}
  
</style>