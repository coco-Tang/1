<template>
    <div class="CheckboxComponent" >
      <el-checkbox v-model="checked" @change="returnOppose"></el-checkbox>
    </div>
</template>

<script>
  import Vue from "vue";

  export default Vue.extend({
    data() {
      return {
        checked: false
      }
    },
    methods: {
      
      returnOppose() {
        console.log('download')
        console.log(this.params.data)
        let data = this.params.data
        data.oppose = !data.oppose

        // this.$emit('childHandle',{
        //   oppose: data.oppose,
        //   name: data.name
        // })

      }
    },
    mounted() {
      // this.testval = this.params.test
    }
  });
</script>

<style scoped lang="scss">


  
</style>