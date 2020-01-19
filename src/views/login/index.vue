<!--
 * @Author: coco-Tang
 * @Date: 2019-08-12 17:20:31
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-09 09:58:02
 * @Description: 
 -->
<template>
  <div class="login" @keyup.13="jumpTo()">
    <div class="bg"></div>
    <div class="login_form">
      <!-- <div class="title">ULang语音识别系统{{$store.state.count}}</div> -->
      <div class="title">智能语音处理系统</div>
      <div class="content">
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          class="demo-ruleForm"
        >
          <el-form-item prop="account">
            <el-input
              type
              v-model="ruleForm2.account"
              auto-complete="off"
              placeholder="请输入账号"
              prefix-icon="accountIcon"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              type="password"
              v-model="ruleForm2.pass"
              auto-complete="off"
              placeholder="请输入密码"
              prefix-icon="passwordIcon"
            ></el-input>
          </el-form-item>
          <el-checkbox class="rememberPassword" @change="checked" v-model="rememberPassword">记住密码</el-checkbox>
          <el-button class="loginBtn" @click="jumpTo()" type="primary">登&nbsp;&nbsp;&nbsp;录</el-button>

          <!-- <el-button @click="jumpTo()" type="primary">登&nbsp;&nbsp;&nbsp;录</el-button> -->
        </el-form>
      </div>
    </div>
    <div class="copyright">
      <!-- <ul>
        <li>关于优浪</li>
        <li>服务协议</li>
        <li>运维中心</li>
        <li>联系邮箱</li>
      </ul>-->
    </div>
  </div>
</template>

<script>
import { login, userInfo, getPermissions, getAccount } from "@/api/index.js";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "login",
  // components: { adminDashboard, editorDashboard },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        this.ruleForm2.pass = value;
        callback();
      }
    };
    var validateAccount = (rule, value, callback) => {
      console.log("validateAccount");
      console.log(value);
      if (!value) {
        callback(new Error("请输入账号"));
      } else {
        this.ruleForm2.account = value;
        callback();
      }
    };
    return {
      authList: [],
      ruleForm2: {
        pass: "",
        account: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        account: [{ validator: validateAccount, trigger: "blur" }]
      },
      rememberPassword: false,
      level: "",
      authorization: ""
    };
  },
  computed: {
    // ...mapGetters([
    //   'roles'
    // ])
  },
  methods: {
    ...mapActions([
      "LOGIN",
      "AUTH",
      "ACCOUNT",
      "PLATFORM",
      "AUTH_TOKEN",
      "REFRESH_TOKEN",
      "ROLE"
    ]),
    checked() {},
    getCookie(name) {
      let arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },
    setByCookie() {
      if (this.parseCookie()) {
        //username=admin; remember=true; password=123456

        let arr = this.parseCookie();
        console.log("parseCookie");
        console.log(arr);
        this.ruleForm2.account = arr["username"];
        arr["remember"] === "false"
          ? (this.rememberPassword = false)
          : (this.rememberPassword = true);

        if (arr["remember"] === "true") {
          this.ruleForm2.pass = arr["password"];
        } else {
          this.ruleForm2.pass = "";
        }
        if (arr["authorization"]) {
          console.log(`arr["authorization"]`);
          console.log(arr["authorization"]);
          return true;
        }
      }
    },
    parseCookie() {
      var cookie = document.cookie,
        pattern = /([^=]+)=([^;]+);?\s*/g,
        result,
        value = {};
      while ((result = pattern.exec(cookie)) != null) {
        value[result[1]] = result[2];
        // console.log(result)
      }
      return value;
    },
    async jumpTo() {
      const { account, pass } = this.ruleForm2;

      if (!account || !pass) {
        return this.$message.error("请输入用户名或密码");
      }

      document.cookie = `username=${account};Max-Age=2592000`;
      document.cookie = `remember=${this.rememberPassword};Max-Age=2592000`;
      document.cookie = `autologin=false;Max-Age=2592000`;

      try {
        const { status, data, headers } = await this.LOGIN({
          username: account,
          password: pass
        });
        if (status === 200) {
          this.$message({ type: "success", message: "登录成功" });
          document.cookie = `authorization=${headers.authorization};Max-Age=1800`;

          if (this.rememberPassword) {
            document.cookie = `password=${pass};Max-Age=2592000`;
          }

          this.$router.push({ path: "search" });
        } else {
          if (message) {
            this.$message.error(message);
            console.warn(message);
          }
        }
      } catch (err) {
        this.$message({ type: "error", message: "登录失败" });
        console.warn(err);
      }
    }
  },
  created() {
    // this.setByCookie();
    // console.log('login create')
    // console.log(this.BASEURL)
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
    if (this.setByCookie()) {
      this.jumpTo();
    }
  },
  mounted() {
    // window.onload = () =>{
    //   // localStorage.setItem("pageClosed", "true");
    // }
    // window.onbeforeunload = () =>{
    //   localStorage.setItem("pageClosed", "false");
    // }
    // window.onunload = () =>{
    //   if(localStorage.getItem("pageClosed")){
    //     document.cookie = `authorization=`;
    //     localStorage.setItem("pageClosed", "true");
    //   }
    // }
  }
};
</script>
<style lang='scss'>
.login {
  .el-form .el-form-item .el-form-item__content {
    height: 40px;
    border: none;
  }
  .el-input,
  .el-button {
    width: 254px;
    height: 40px;
  }
  .accountIcon::before {
    content: "";
    height: 16px;
    width: 16px;
    display: block;
    background: url("../../static/images/account.png");
    margin-top: 12px;
  }
  .passwordIcon::before {
    content: "";
    height: 16px;
    width: 16px;
    display: block;
    background: url("../../static/images/password.png");
    margin-top: 12px;
  }
  .loginBtn {
    background-color: #6e8de3;
    color: #fff;
  }
}
</style>
<style lang="scss" scoped>
@media (max-width: 1366px) {
  .bg {
    margin-left: 100px !important;
  }
  .login_form {
    margin-right: 100px !important;
  }
}
.login {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  // flex-wrap: wrap;
  // background-color: #3071b8;
  background: url("../../static/images/loginbg.jpg");
  -webkit-background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  .bg {
    width: 709px;
    height: 512px;
    // margin-left: 400px;
    margin-left: 300px;
    background: url("../../static/images/login.png") center/contain no-repeat;
    // -webkit-background-size: 100% 100%;
    // -moz-background-size: 100% 100%;
    // background-size: 100% 100%;
  }
  .login_form {
    width: 340px;
    // margin-left: 600px;
    margin-left: auto;
    margin-right: 300px;
    .rememberPassword {
      margin-bottom: 22px;
    }
    .title {
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #2e3233;
      color: #fff;
      // margin-bottom: 20px;
      border-radius: 5px 5px 0 0;
    }
    .content {
      // height: 315px;
      padding: 13px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 0 0 5px 5px;
      .el-form {
        background-color: #fff;
        border-radius: 3px;
        height: 315px;
        padding: 30px;
        padding-top: 50px;
        .el-form-item {
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
  .copyright {
    position: absolute;
    bottom: 60px;
    width: 100%;
    // text-align: center;
    margin: 0 auto;
    ul {
      display: flex;
      color: #4aa2da;
      justify-content: center;
      li {
        margin: 0 10px 0 10px;
        position: relative;
        &:after {
          content: "";
          width: 1px;
          height: 18px;
          background-color: #4aa2da;
          display: block;
          position: absolute;
          left: -10px;
          top: 2px;
        }
        &:nth-child(1)::after {
          display: none;
        }
      }
    }
  }
}
</style>