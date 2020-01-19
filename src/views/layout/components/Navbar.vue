<!--
 * @Author: coco-Tang
 * @Date: 2019-09-17 17:47:58
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-08 19:03:38
 * @Description: 
 -->
<template>
  <div class="navBar">
    <span class="logo"></span>
    <!-- <head>nav-bar</head> -->
    <ul>
      <!-- <li><router-link to="/1"><el-button type="primary">home</el-button></router-link></li>
      <li><router-link to="/dashboard"><el-button type="primary">dashboard</el-button></router-link></li>
      <li><router-link to="/test"><el-button type="primary">Test</el-button></router-link></li>-->
      <!-- <li><router-link to="/test/testChild"><el-button type="primary">testChild</el-button></router-link></li>
      <li><el-button @click="openHanlde" type="primary">ql</el-button></li>
      <li><el-button @click="openHanlde1" type="primary">speaker</el-button></li>
      <li><el-button @click="openHanlde2" type="primary">local</el-button></li>
      <li><router-link to="/login"><el-button type="primary">登出</el-button></router-link></li>-->
    </ul>
    <div
      class="asd"
      v-show="showDrag1"
      style="height: 100%; width: 100%; 
             position: absolute; z-index: 7999"
      v-on:mousedown="maskHanlde1($event)"
    >
      <myvideo></myvideo>
    </div>
    <div
      class="asd"
      v-show="showDrag"
      style="height: 100%; width: 100%; 
             position: absolute; z-index: 7999"
      v-on:mousedown="maskHanlde($event)"
    >
      <player></player>
    </div>
    <password-dialog @setPassword="childCreate" ref="c1"></password-dialog>
    <div class="rightNav">
      <ul>
        <li :class="{hidden: showDrag1 || closeStatus1}" class="hideIcon" @click="hideHanlde1">
          <div class="whiteMask"></div>
        </li>
        <li :class="{hidden: showDrag || closeStatus}" class="hideIcon" @click="hideHanlde">
          <div class="whiteMask"></div>
        </li>
        <li style="display: none">
          <label class="fileBtn" for="file2">选择文件</label>
          <input
            type="file"
            id="file2"
            style="width: 100px;display: none"
            @change="tirggerFile($event)"
          />
        </li>
        <!-- <li title="实时预警" @click="toMonitor">
          <img :src='msgSrc' class='msg' >
          <sup :class='{hidden: newMsgCount==0}' class='el-badge__content badge'>{{ newMsgCount > 99 ? '99+' : newMsgCount }}
          </sup>
        </li>-->
        <!-- <li title="实时预警" @click="toMonitor">
          <img :src='msgSrc' class='msg' >
          <sup :class='{hidden: newMsgCount==0}' class='el-badge__content badge'>{{ newMsgCount > 99 ? '99+' : newMsgCount }}
          </sup>
        </li> -->
        <li>
          <el-dropdown @command="dispenseItem" @visible-change="changeCaret" trigger="click">
            <span class="el-dropdown-link">
              <img :src="avaSrc" class="ava" />
              {{getAccount}}
              <i
                :class="caretDir==='down'?'el-icon-caret-bottom':'el-icon-caret-top'"
              ></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="player" class="item-player">本地播放器</el-dropdown-item>
              <!-- <el-dropdown-item command='voice' class='item-voice'>导入语音</el-dropdown-item> -->
              <el-dropdown-item command="password" class="item-password">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" class="item-logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <!-- <router-link class='myApplication' tag='li' to="/login">退出</router-link> -->
      </ul>
    </div>
  </div>
</template>

<script>
import video from "@/components/videoPlayer/index.vue";
import player from "@/components/player/index.vue";
import passwordDialog from "@/components/dialog/passwordDialog.vue";
import { mapActions, mapGetters } from "vuex";
import { logout } from "@/api/index.js";
import { pwdUpdateUsers } from "@/api/user.js";

export default {
  name: "navBar",
  data() {
    return {
      showDrag: false,
      showDrag1: false,
      closeStatus: true,
      closeStatus1: true,
      newMsgCount: 0,
      caretDir: "down",
      cltSrc: require("@/static/images/client.png"),
      msgSrc: require("@/static/images/msg-push.png"),
      avaSrc: require("@/static/images/ava.png")
      // avaSrc: '../../../../static/images/ava.png',
      // account: ""
    };
  },
  components: {
    "password-dialog": passwordDialog,
    player: player,
    myvideo: video
  },
  computed: {
    ...mapGetters(["getAccount"]),
    aaa() {
      return this.getPlayerData().dateFlag;
    },
    bbb() {
      return this.getVideoData().dateFlag;
    }
  },
  watch: {
    aaa() {
      this.showDrag = true;
      this.closeStatus = false;
      if (this.getPlayerData().type === "des") {
        this.showDrag = false;
        // this.CONTENTFOLD(false)
        this.closeStatus = true;
        return;
      }
    },
    bbb() {
      this.showDrag1 = true;
      this.closeStatus1 = false;
      if (this.getVideoData().type === "des") {
        this.showDrag1 = false;
        this.closeStatus1 = true;
        return;
      }
    }
    // comAccount() {
    //   this.account = this.getAccount();

    //   console.log("watch account");
    //   console.log(this.account);
    // }
  },
  methods: {
    ...mapActions(["PLAYER_DATA"]),
    ...mapGetters(["getPlayerData", "getVideoData"]),
    tirggerFile(e) {
      this.file = e.target.files[0];
      if (this.file) {
        let d = new Date();
        this.PLAYER_DATA({
          dateFlag: d,
          type: "local",
          callid: this.file
        });
      }

      this.file = null;

      e.target.value = "";
    },
    childCreate(params) {
      pwdUpdateUsers(params)
        .then(res => {
          if (res.status === 200) {
            this.$message.success("更新密码成功");
          }
        })
        .catch(err => this.$message.error(err.response.data.msg));
    },
    dispenseItem(command) {
      switch (command) {
        case "player":
          document.getElementById("file2").click();
          break;
        case "voice":
          this.$router.push({ name: "importVoice" });
          break;
        case "password":
          this.$refs.c1.showDialog();
          break;
        case "logout":
          this.$router.push({ name: "login" });
          document.cookie = `authorization=`;
          //   logout().then(res => {
          // if (res.status === 200) {
          //   console.log('logout--res', res)
          // }

          //   })

          break;
      }
    },
    changeCaret(e) {
      if (e) {
        this.caretDir = "up";
      } else {
        this.caretDir = "down";
      }
    },
    hideHanlde() {
      this.showDrag = !this.showDrag;
    },
    maskHanlde(e) {
      // console.log('-------------------masktest')
      // console.log(e)
      // console.log(e.path.length)
      if (e.path.length === 9) {
        this.hideHanlde();
      }
    },
    hideHanlde1() {
      this.showDrag1 = !this.showDrag1;
    },
    maskHanlde1(e) {
      // console.log('-------------------masktest')
      // console.log(e)
      // console.log(e.path.length)
      if (e.path.length === 9) {
        this.hideHanlde1();
      }
    },
    toMonitor() {
      this.$router.push({path: '/monitor'});
    }
  },
  beforeCreate() {},
  created() {
    // this.account = this.getAccount();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>
  <!-- .el-dropdown-menu__item {
    background: url('../../../static/images/item-player.png') no-repeat 17px center !important;
  } -->
<style lang="scss" scoped>
.hidden {
  display: none;
}
.navBar {
  $menu_header_common: #3990ff;
  width: 100%;
  height: 60px;
  line-height: 60px;
  flex-shrink: 0;
  display: flex;
  background-color: $menu_header_common; //#577ce7;
 
  span.logo{
    display: block;
    height: 38px;
    width: 50px;
    margin-top: 11px;
    background: url("../../../static/images/logo1.png") no-repeat ;
    position: absolute;
    left: 180px;
  }
  // .pane{
  //   width: 100%;
  //   height: 100%;
  //   position: absolute;
  //   z-index: 7999;
  //   top: 0;
  //   left: 0;
  //   display: block;
  // }
  .closeBtn {
    font-size: 20px;
    font-weight: 700;
    position: absolute;
    right: 50px;
    top: 10px;
    color: #fff;
  }
  justify-content: flex-end;
  .rightNav {
    ul {
      display: flex;
      font-size: 12px;
      color: #fff;
      li {
        position: relative;
        margin: 0 20px;
        cursor: pointer;
        &:after {
          content: "";
          display: block;
          position: absolute;
          top: 20px;
          right: -20px;
          width: 1px;
          height: 20px;
          background-color: #2380e0; //#91abf2;
        }
        &:nth-child(1) {
          width: 42px;
          height: 60px;
          background: url("../../../static/images/sp.svg") 0 9px no-repeat;
          background-size: 40px 40px;
          .whiteMask {
            width: 42px;
            height: 42px;
            position: relative;
            top: 9px;
            background-color: #fff;
            border-radius: 4px;
            opacity: 0;
          }
          &:hover {
            .whiteMask {
              opacity: 0.2;
            }
          }
          &:before {
            content: "";
            display: block;
            position: absolute;
            top: 20px;
            right: -19px;
            width: 1px;
            height: 20px;
            background-color: #71b7ff;
          }
        }
        &:nth-last-child(1)::after {
          display: none;
        }
        &:nth-child(2) {
          width: 42px;
          height: 60px;
          background: url("../../../static/images/hideicon.png") 0 9px no-repeat;
          .whiteMask {
            width: 42px;
            height: 42px;
            position: relative;
            top: 9px;
            background-color: #fff;
            border-radius: 4px;
            opacity: 0;
          }
          &:hover {
            .whiteMask {
              opacity: 0.2;
            }
          }
          &:before {
            content: "";
            display: block;
            position: absolute;
            top: 20px;
            right: -19px;
            width: 1px;
            height: 20px;
            background-color: #71b7ff;
          }
        }
        &:nth-last-child(2)::after {
          display: none;
        }
        &:nth-child(3):after {
          width: 0;
        }
        // &:nth-child(4):before {
        //   content: "";
        //   display: block;
        //   position: absolute;
        //   top: 20px;
        //   right: -19px;
        //   width: 1px;
        //   height: 20px;
        //   background-color: #71b7ff;
        // }
      }
    }
  }
  .clientArea {
    position: absolute;
    left: 50%;
    color: #fff;
    transform: translateX(-50%);
    img {
      width: 44px;
      vertical-align: middle;
      margin-right: 10px;
    }
    span {
      font-weight: 700;
      text-shadow: 0px 2px 8px #084b93;
    }
  }
  img.msg {
    width: 18px;
    height: 17px;
    vertical-align: middle;
  }
  .badge {
    position: absolute;
    top: 10px;
    left: 18px;
    margin-left: -8px;
    background-color: #ff9c01;
    font-size: 10px;
    line-height: 16px;
  }
  img.ava {
    width: 28px;
    margin-right: 10px;
    vertical-align: middle;
  }
  img.ava + i {
    margin-left: 10px;
  }

  ul {
    display: flex;
    li {
      margin-right: 30px;
    }
  }
}
</style>
