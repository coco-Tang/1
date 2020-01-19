<template>
    <div class="callerComponent" ref="childComponent">
      <div class="langname" v-if="this.params.data.callerDangrousMatchPhones">
        <span class="dangerousIcon"></span>
        {{this.params.data.caller}}
      </div>
      <div class="langname1" v-else>
        {{this.params.data.caller}}
      </div>
      
      
      <!-- {{this.params.data.results.keywords[0]}} -->
      <!-- <button @click="collection">aaa</button> -->
    </div>
</template>

<script>
  import Vue from "vue";

  export default Vue.extend({
    data() {
      return {
        
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
      }
    },
    mounted() {
      // console.log('mounted child')
      //   console.log(this.params.data)
      //   console.log(this) 
      // this.testval = this.params.test
    }
  });
</script>

<style scoped lang="scss">
.callerComponent{
  ul{
    color: #000;
    display: flex;
    li{
      margin: 0 5px;
    }
  }
  display: flex;
  .langname{
    // color: red;
    display: flex;
    margin-right: 10px;  
  }
  .keywords{
    color: red;
    display: flex;
    margin-right: 10px;  
  }
  .speakers{
    color: red;
    display: flex;
    margin-right: 10px;  
  }
  .speechsegs{
    color: red;
    display: flex; 
  }
  .dangerousIcon{
    // display: block;
    width: 16px;
    height: 16px;
    background: url('../../static/images/dangerous.png') no-repeat;
    position: absolute;
    left: 0;
    top: 12px;
  }

}
  
</style>