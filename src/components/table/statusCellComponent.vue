<template>
    <!-- <div class="ClickableComponent" ref="childComponent">
      <div class="delete" @click="myDelete"></div>
      <div class="collection" @click="collection" :class="{'selected' : this.params.data.collection}"></div>
      <div class="download" @click="download"></div>
    </div> -->
    <div class="ClickableComponent" ref="childComponent">
      <div class="process" :title="processTitle" :class="{'processed' : !(this.params.data.guid === null)}"></div>
      <!-- <div class="process processed" title="已处理"></div> -->
      <div class="listen" :title="listenTitle" :class="{'listened' : !this.params.data.appended.listeners}"></div>
      <div class="segments" :title="segmentsTitle" :class="{'segmented' : this.params.data.appended.trans}"></div>
      <div class="hits" :title="hitsTitle" :class="{'hits1' : this.params.data.appended.kwdhits||this.params.data.appended.speakerhits||this.params.data.appended.speechseghits}"></div>
      <!-- <div class="gender" :title="genderTitle" :class="{'gender1' : this.params.data.gender=='男','gender2' : this.params.data.gender=='女','gender3' : this.params.data.gender=='男和女','gender5' : this.params.data.gender==''}"></div> -->
      <div class="gender genderm"  :class="{'gender1' : this.params.data.gender=='男','gender2' : this.params.data.gender=='女','gender3' : this.params.data.gender=='男和女','gender5' : this.params.data.gender==''||this.params.data.gender=='不确定'||this.params.data.gender==null}"></div>
      <div class="gender genderf"  :class="{'gender1' : this.params.data.gender=='男','gender2' : this.params.data.gender=='女','gender3' : this.params.data.gender=='男和女','gender5' : this.params.data.gender==''||this.params.data.gender=='不确定'||this.params.data.gender==null}"></div>
      <div class="invalid" :title="invalidTitle" :class="{'invalid1' : this.params.data.valid}"></div>
      <!-- <div class="billLevel" :title="levelTitle" :class="{'level6' : this.params.data.appended.calllevel==1,'level7' : this.params.data.appended.calllevel==2,'level8' : this.params.data.appended.calllevel==9,'level9' : this.params.data.appended.calllevel==0}"></div> -->
    </div>
</template>

<script>
  import Vue from "vue";
  // import {mapActions,mapGetters} from 'vuex'

  export default Vue.extend({
    data() {
      return {
        processTitle: '',
        segmentsTitle: '',
        statusTitle: '',
        genderTitle: '',
        levelTitle: '',
        invalidTitle: '',
        hitsTitle: '',
        listenTitle: ''
      }
    },
    // computed: {
    //   getBill(){
    //     console.log('getcomputedBill')
    //     // return this.getBillStatus().dateFlag
    //   }
    // },
    // watch: {
    //   getBill(){
    //     console.log('statuscellcomponent')
    //     this.setTitle()
    //   }
    // },
    methods: {
      // ...mapGetters(['getBillStatus']),
      setTitle() {
        // console.log('ClickableComponent')
        // console.log(this.params)
        if(!this.params.data.guid){
          this.processTitle = '未处理'
        }else{
          this.processTitle = '已处理'
        }

        if(!this.params.data.appended.listeners){
          this.listenTitle = '未调听'
        }else{
          this.listenTitle = '已调听'
        }

        if(this.params.data.appended.trans){
          this.segmentsTitle = '已转写'
        }else{
          this.segmentsTitle = '未转写'
        }

        if(this.params.data.appended.kwdhits||this.params.data.appended.speakerhits||this.params.data.appended.speechseghits){
          this.hitsTitle = '已中标'
        }else{
          this.hitsTitle = '未中标'
        }

        // if(this.params.data.status == 2){
        //   this.statusTitle = '正确'
        // }else if(this.params.data.status == 3){
        //   this.statusTitle = '错误'
        // }else if(this.params.data.status == 4){
        //   this.statusTitle = '状态:不确定'
        // }else{
        //   this.statusTitle = '未处理'
        // }
        switch(this.params.data.appended.veracityMark){
          case '2':
            this.statusTitle = '正确'
            break;
          case '3':
            this.statusTitle = '错误'
            break;
          case '4':
            this.statusTitle = '状态: 不确定'
            break;
          default:
            this.statusTitle = '未处理'
        }

        switch(this.params.data.gender){
          case '不确定':
            this.genderTitle = '不确定'
            break;
          case '男':
            this.genderTitle = '男'
            break;
          case '女':
            this.genderTitle = '女'
            break;
          case '男和女':
            this.genderTitle = '男和女'
            break;
          default:
            this.genderTitle = '性别: 不确定'
        }
        // switch(this.params.data.valid){
        //   case 0:
        //     this.invalidTitle = '有效音'
        //     break;
        //   case 1:
        //     this.invalidTitle = '无效音'
        //     break;
        //   default:
        //     this.invalidTitle = '无效音'
        // }
        if(this.params.data.valid){
          this.invalidTitle = '有效音'
        }else{
          this.invalidTitle = '无效音'
        }
        // if(this.params.data.tagFlowSex){
        //   switch(Number(this.params.data.tagFlowSex)){
        //   case 2:
        //     this.genderTitle = '男'
        //     break;
        //   case 3:
        //     this.genderTitle = '女'
        //     break;
        //   case 4:
        //     this.genderTitle = '男和女'
        //     break;
        //   case 5:
        //     this.genderTitle = '性别:不确定'
        //     break;
        //   case 6:
        //     this.genderTitle = '机器变声'
        //     break;
          
        //   }
        // }
        // switch(this.params.data.appended.calllevel){
        //   case 1:
        //     this.levelTitle = '严重'
        //     break;
        //   case 2:
        //     this.levelTitle = '紧急'
        //     break;
        //   case 9:
        //     this.levelTitle = '排除'
        //     break;
        //   case 0:
        //     this.levelTitle = '一般'
        //     break;
        // }
      }
    },
    beforeCreate() {
    
    },
    created() {
      
    },
    beforeMount() {
      
    },
    mounted() {
      this.setTitle()
    },
    beforeUpdate () {

    },
    updated() {

    },
    activated() {
      // this.setTitle()
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
.ClickableComponent{
  
  display: flex;
  // &:hover{
  //   display: none;
  // }
  height: 40px;
  line-height: 40px;
  text-align: center;
  padding-top: 10px;
  // margin-top: 11px;
  .process{
    margin-right: 5px;
    // min-width: 20px;
    width: 20px;
    height: 20px;
    background: url('../../static/images/已处理3.png');
    background-size: 20px 20px;
    &.processed{
      background: url('../../static/images/已处理2.png');
      // background: none;
    }
  }
  .listen{
    margin-right: 5px;
    // min-width: 20px;
    width: 20px;
    height: 20px;
    background: url('../../static/images/调听2.png');
    background-size: 20px 20px;
    &.listened{
      // width: 0px;
      // margin-right: 0px;
      background: url('../../static/images/调听3.png');
      // background: none;
    }
  }
  .segments{
    margin-right: 0px;
    // min-width: 20px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background: url('../../static/images/转写3.png');
    background-size: 20px 20px;
    &.segmented{
      // width: 20px;
      // margin-right: 5px;
      background: url('../../static/images/转写2.png');
    }
  }
  .invalid{
    margin-right: 0px;
    min-width: 20px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    // background: url('../../static/images/不确定.png');  
    background: url('../../static/images/有效3.png') no-repeat;  
    background-size: 20px 20px;
    &.invalid1{
      // width: 40px;
      // margin-right: 5px;
      background: url('../../static/images/有效2.png') no-repeat;
    }
  }
  .hits{
    margin-right: 0px;
    min-width: 20px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    // background: url('../../static/images/不确定.png');  
    background: url('../../static/images/中标3.png') no-repeat;  
    background-size: 20px 20px;
    &.hits1{
      // width: 40px;
      // margin-right: 5px;
      background: url('../../static/images/中标2.png') no-repeat;
    }
  }
  // .status{
  //   margin-right: 5px;
  //   min-width: 20px;
  //   width: 20px;
  //   height: 20px;
  //   background: url('../../static/images/未处理.png');  
  //   background-size: 20px 20px;  
  //   &.status2{
  //     background: url('../../static/images/正确.png');
  //   }
  //   &.status3{
  //     background: url('../../static/images/错误.png');
  //   }
  //   &.status4{
  //     background: url('../../static/images/不确定1.png');
  //   }
  // }
  .gender{
    margin-right: 0px;
    // min-width: 20px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    // background: url('../../static/images/不确定.png');    
    background-size: 20px 20px;
    // &.gender0{
    //   width: 40px;
    //   margin-right: 5px;
    //   background: url('../../static/images/机器变声.png') no-repeat;
    // }
    // &.gender1{
    //   width: 40px;
    //   margin-right: 5px;
    //   background: url('../../static/images/男1.png') no-repeat;
    // }
    // &.gender2{
    //   width: 40px;
    //   margin-right: 5px;
    //   background: url('../../static/images/女1.png') no-repeat;
    // }
    // &.gender3{
    //   width: 40px;
    //   margin-right: 5px;
    //   background: url('../../static/images/男女1.png') no-repeat;
    // }
    // &.gender5{
    //   width: 40px;
    //   margin-right: 5px;
    //   // background: url('../../static/images/不确定1.png');
    // }
    // &.gender6{
    //   width: 40px;
    //   margin-right: 5px;
    //   background: url('../../static/images/机器变声.png') no-repeat;
    // }
  }
  .genderm{
    &.gender1{
      background: url('../../static/images/男2.png') no-repeat;
    }
    &.gender2{
      background: url('../../static/images/男3.png') no-repeat;
    }
    &.gender3{
      background: url('../../static/images/男2.png') no-repeat;
    }
    &.gender5{
      background: url('../../static/images/男3.png') no-repeat;
    }
  }
  .genderf{
    &.gender1{
      background: url('../../static/images/女3.png') no-repeat;
    }
    &.gender2{
      background: url('../../static/images/女2.png') no-repeat;
    }
    &.gender3{
      background: url('../../static/images/女2.png') no-repeat;
    }
    &.gender5{
      background: url('../../static/images/女3.png') no-repeat;
    }
  }
  // .billLevel{
  //   margin-left: 10px;
  //   min-width: 26px;
  //   width: 26px;
  //   height: 26px;
  //   background: url('../../static/images/一般.png'); 
  //   background-size: 26px 26px;   
  //   &.level6{
  //     background: url('../../static/images/严重.png');
  //   }  
  //   &.level7{
  //     background: url('../../static/images/紧急.png');
  //   }  
  //   &.level8{
  //     background: url('../../static/images/排除.png');
  //   }  
  //   &.level9{
  //     background: url('../../static/images/一般.png');
  //   }
  // }
}
  
</style>