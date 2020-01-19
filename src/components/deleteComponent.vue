<template>
  <div class="deleteComponent" ref="childComponent">
    <div class="mydelete" 
      @click="mydelete"
      :class="{//'selected': this.params.data.mydelete,
              'hide': this.params.data.percent === 100
          }"
    ></div>
    <!-- <div class="download" @click="download"></div> -->
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data() {
    return {};
  },
  methods: {
    mydelete() {
      console.log('mydelete ---> this.params.data:', this.params.data);
      console.log('         └--> this.params.data.number:', this.params.data.number);
      this.params.data.mydelete = !this.params.data.mydelete;
      // return false
    }
    // download() {
    //   console.log('download')
    //   console.log(this.params.data)
    //   console.log(this)
    //   // console.log(this.$refs.childComponent.querySelector('.download').addClass('selected'))
    // }
  },
  mounted() {
    // this.testval = this.params.test
  }
});
</script>

<style scoped lang="scss">
.deleteComponent {
  display: flex;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-top: 11px;

  .hide {
    display: none;
  }
  .mydelete {
    width: 18px;
    height: 18px;
    background: url("../static/images/删除默认.png");
    cursor: pointer;
    &:hover {
      background: url("../static/images/删除选中.png");
    }
    // &.selected{
    //   background: url('../../static/images/已收藏.png');

    // }
  }
  // .download{
  //   margin-left: 10px;
  //   width: 18px;
  //   height: 18px;
  //   background: url('../../static/images/下载默认.png');

  //   &:hover{
  //     background: url('../../static/images/下载选中.png');
  //   }

  // }
}
</style>