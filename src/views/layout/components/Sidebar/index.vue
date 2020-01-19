<!--
 * @Author: coco-Tang
 * @Date: 2019-08-12 17:20:31
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-12-06 15:52:17
 * @Description: 
 -->
<template>
  <div class="myApp">
    <div class="myApp_nav">
      <el-row class="tac">
        <!-- <el-col > -->
        <div class="logo">
          <div class="inner"></div>
        </div>
        <el-menu
          ref="menu"
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          background-color="#2a2c33"
          text-color="#72768c"
          active-text-color="#fff"
          :collapse="false"
          :unique-opened="true"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu index="8">
            <template slot="title">
              <i class="menu_application"></i>
              <span slot="title">应用</span>
            </template>
            <el-menu-item index="1-8-7">
              <router-link tag="div" to="/monitor">实时预警</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('26')" index="1-8-2">
              <router-link tag="div" to="/search">话单检索</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('3')" index="1-8-3">
              <router-link tag="div" to="/history">历史语音检索</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('4')" index="1-8-4">
              <router-link tag="div" to="/video">视频检索</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('11')" index="1-8-5">
              <router-link tag="div" to="/importVoice">导入语音</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('12')" index="1-8-6">
              <router-link tag="div" to="/importVideo">导入视频</router-link>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="9">
            <template slot="title">
              <i class="menu_source"></i>
              <span slot="title">预警资源</span>
            </template>
            <el-menu-item v-if="auth.includes('5')" index="1-9-2">
              <router-link tag="div" to="/keyword">关键词</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('6')" index="1-9-3">
              <router-link tag="div" to="/speaker">对象声纹</router-link>
            </el-menu-item>
            <!-- <el-menu-item v-if="auth.includes('4')" index="1-9-4">
              <router-link tag="div" to="/resources/speechseg">固定音频</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('26')" index="1-9-6">
              <router-link tag="div" to="/resources/phone">号码库</router-link>
            </el-menu-item>-->
          </el-submenu>
          <el-submenu index="18">
            <template slot="title">
              <i class="menu_train"></i>
              <span slot="title">优化训练</span>
            </template>
            <el-menu-item index="1-18-1">
              <router-link tag="div" to="/train/library" >语料库管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-18-2">
              <router-link tag="div" to="/train/task" >任务管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-18-3">
              <router-link tag="div" to="/train/model" >模型管理</router-link>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="16">
            <template slot="title">
              <i class="menu_management"></i>
              <span slot="title">系统管理</span>
            </template>
            <el-menu-item v-if="auth.includes('13')" index="1-16-1">
              <router-link tag="div" to="/log">日志管理</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('1')" index="1-16-5">
              <router-link tag="div" to="/user">用户管理</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('8')" index="1-16-2">
              <router-link tag="div" to="/role">权限管理</router-link>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="17">
            <template slot="title">
              <i class="menu_count"></i>
              <span slot="title">数据统计</span>
            </template>
            <el-menu-item v-if="auth.includes('26')" index="1-17-1">
              <router-link tag="div" to="/statistics/call">处理量统计</router-link>
            </el-menu-item>
            <el-menu-item v-if="auth.includes('26')" index="1-17-2">
              <router-link tag="div" to="/statistics/machine">机器统计</router-link>
            </el-menu-item>
            <!-- <el-menu-item index="1-17-2">
                <router-link tag='div' to="/statistics/Hit">中标</router-link>
              </el-menu-item>
              <el-menu-item index="1-17-3">
                <router-link tag='div' to="/statistics/Language">语种</router-link>
              </el-menu-item>
              <el-menu-item index="1-17-4">
                <router-link tag='div' to="/statistics/Gender">性别</router-link>
            </el-menu-item>-->
          </el-submenu>
          <!-- <el-submenu index="16">
              <template slot="title">
                <i class="menu_management"></i>
                <span slot="title">系统管理</span>

              </template>
              <el-menu-item  v-if="auth.log==='13'" index="1-16-1">
                <router-link tag='div' to="/system/log">日志管理</router-link>
              </el-menu-item>
              <el-menu-item index="1-16-2">
                <router-link tag='div' to="/system/workload">工作量统计</router-link>
              </el-menu-item>
              <el-menu-item index="1-16-3">
                <router-link tag='div' to="/system/tagCount">标注统计</router-link>
              </el-menu-item>
              <el-menu-item index="1-16-4">
                <router-link tag='div' to="/system/annotation">标注查询</router-link>
              </el-menu-item>
              <el-menu-item  v-if="auth.user==='1'" index="1-16-5">
                <router-link tag='div' to="/user">用户管理</router-link>
              </el-menu-item>
              <el-menu-item v-if="auth.count==='12'" index="1-16-8">
                <router-link tag='div' to="/statistics">数据统计</router-link>
              </el-menu-item>
             
          </el-submenu>-->
        </el-menu>
      </el-row>
      <ul class="copyright">
        <!-- <li>上海优浪信息科技有限公司</li>
        <li>@2019</li> -->
      </ul>
    </div>
    <!-- <div class="content">
      <keep-alive  include="voiceprint">
        <router-view v-if='platformReady' />
      </keep-alive>
    </div>-->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "sidebar",
  data() {
    return {
      defaultActive: "1-8-2"
    };
  },
  computed: {
    ...mapGetters(["getAuth"]),
    auth() {
      let authList = [];
      const len = this.getAuth.length;
      for (let i = 0; i < len; i++) {
        authList.push(this.getAuth[i]);
      }
      return authList;
    },
    getRoute() {
      return this.$route.path;
    }
  },
  watch: {
    // getRoute() {
    //   if(this.$route.path === '/monitor'){
    //     this.close()
    //   }
    // }
  },
  methods: {
    handleOpen() {},
    handleClose() {}
    // close() {
    //   this.$refs.menu.close('8')
    //   this.$refs.menu.close('9')
    //   this.$refs.menu.close('16')
    //   this.$refs.menu.close('17')
    //   this.$refs.menu.activeIndex = null
    //   // console.log('close')
    // },
  }
};
</script>
<style lang="scss">
$menu_header_common: #3990ff;
$menu_item_bg-active: #23252c;
.myApp_nav {
  height: 100%;
  position: relative;
  width: 180px;
  .copyright {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    li {
      color: #7f8196;
      font-size: 12px;
    }
  }
  .el-submenu__title {
    &:hover {
      color: #fff !important;
      background-color: $menu_header_common !important; // #577ce7 !important
      .el-submenu__icon-arrow,
      .el-icon-arrow-down {
        color: #fff !important;
      }
    }
    .menu_application {
      position: relative;
      display: inline-block;
      // width: 16px;
      // height: 16px;
      width: 22px;
      height: 22px;
      margin: 0 15px 0 10px;
      &:after {
        position: absolute;
        content: "";
        // width: 16px;
        // height: 16px;
        width: 22px;
        height: 22px;
        // background: url("../../../../static/images/应用01.png");
        background: url("../../../../static/images/应用03.jpg");
      }
    }
    &:hover .menu_application::after {
      // background: url("../../../../static/images/应用02.png");
      background: url("../../../../static/images/应用04.jpg");
    }

    .menu_source {
      position: relative;
      display: inline-block;
      width: 22px;
      height: 22px;
      margin: 0 15px 0 10px;
      &:after {
        position: absolute;
        content: "";
        width: 22px;
        height: 22px;
        top: 2px;
        background: url("../../../../static/images/预警资源03.jpg");
      }
    }
    &:hover .menu_source::after {
      background: url("../../../../static/images/预警资源04.jpg");
    }

    .menu_management {
      position: relative;
      display: inline-block;
      width: 22px;
      height: 22px;
      margin: 0 15px 0 10px;
      &:after {
        position: absolute;
        content: "";
        width: 22px;
        height: 22px;
        top: 2px;
        background: url("../../../../static/images/系统管理03.jpg");
      }
    }
    &:hover .menu_management::after {
      background: url("../../../../static/images/系统管理04.jpg");
    }

    .menu_count {
      position: relative;
      display: inline-block;
      width: 22px;
      height: 22px;
      margin: 0 15px 0 10px;
      &:after {
        position: absolute;
        content: "";
        width: 22px;
        height: 22px;
        top: 2px;
        background: url("../../../../static/images/数据统计03.jpg");
      }
    }
    &:hover .menu_count::after {
      background: url("../../../../static/images/数据统计04.jpg");
    }

    .menu_train {
      position: relative;
      display: inline-block;
      width: 22px;
      height: 22px;
      margin: 0 15px 0 10px;
      &:after {
        position: absolute;
        content: "";
        width: 22px;
        height: 22px;
        top: 2px;
        background: url("../../../../static/images/优化训练03.jpg");
      }
    }
    &:hover .menu_train::after {
      background: url("../../../../static/images/优化训练04.jpg");
    }
  }

  .el-menu-item {
    padding-left: 65px !important;
    &:hover {
      // background-color: #fff !important;
      border-left: 3px solid $menu_header_common; //#6e8de3;
    }
    &.is-active {
      border-left: 3px solid $menu_header_common; //#6e8de3;
      background-color: $menu_item_bg-active !important;
    }
  }
}
</style>

<style scoped lang="scss">
$menu_header_common: #3990ff;
.myApp {
  height: 100%;
  // height: 100%;
  display: flex;
  .tac {
    height: 100%;
    .logo {
      height: 60px;
      // padding: 8px;
      padding-top: 11px;
      .inner {
        width: 180px;
        height: 38px;
        background: url("../../../../static/images/logo.png") no-repeat 12px 0px;
        background-color: $menu_header_common; //#577ce7;
      }
      // background-color: #1b78db; //#476cd7;
      background-color: $menu_header_common; //#476cd7;
    }
    .el-menu-vertical-demo {
      height: calc(100% - 60px);
      // width: 220px;
    }
  }
  .content {
    width: calc(100% - 180px);
    height: 100%;

    // padding: 20px;
    background-color: #e5e5ef;
  }
}
</style>
<style>
.right i.el-input__icon.el-icon-search {
  cursor: pointer;
}
</style>