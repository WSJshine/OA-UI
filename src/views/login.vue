<template>
  <div class="login">
    <!--<img src="@/assets/logo/logo.png" alt="" class="img1">-->
    <!--<img src="@/assets/image/img_bg.png" alt="" class="img2">-->
    <!--<el-card class="box-card1">
      <div slot="header" class="clearfix">
        <span>企业信息</span>
        &lt;!&ndash;<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>
    <el-card class="box-card2">
      <div slot="header" class="clearfix">
        <span>园区通知</span>
        &lt;!&ndash;<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>-->

    <div class="main1" >
      <!--<img src="@/assets/logo/logo.png" alt="" class="img1">-->
      <img src="@/assets/image/img_bg.png" alt="" class="img2">
      <h3>党政协同办公系统</h3>
      <h4>Party And Government Coordination Office System</h4>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <h2 class="title">欢迎登录</h2>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off"   @focus="isUsername=true"
                    @blur="isUsername=false" placeholder="用户名">
            <svg-icon slot="prefix" icon-class="user" v-bind:class="{'color-class':isUsername}" class=" input-icon " />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @focus="isPassword=true"
            @blur="isPassword=false"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="password" v-bind:class="{'color-class':isPassword}" class="el-input__icon input-icon " />
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            @focus="isValidCode=true"
            @blur="isValidCode=false"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" v-bind:class="{'color-class':isValidCode}" class="el-input__icon input-icon "  />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" />
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--  底部  -->
    <!--<div class="el-login-footer">
      <span>© 2020 All Rights Reserved. danny</span>
    </div>-->
  </div>
</template>

<script>
  import { getCodeImg, getPark } from "@/api/login";
  import Cookies from "js-cookie";
  import { encrypt, decrypt } from '@/utils/jsencrypt'

  export default {
    name: "Login",
    data() {
      return {
        isUsername:false,
        isPassword:false,
        isValidCode:false,
        codeUrl: "",
        cookiePassword: "",
        loginForm: {
          username: "",
          password: "",
          rememberMe: false,
          code: "",
          uuid: ""
        },
        loginRules: {
          username: [
            { required: true, trigger: "blur", message: "用户名不能为空" }
          ],
          password: [
            { required: true, trigger: "blur", message: "密码不能为空" }
          ],
          code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
        },
        loading: false,
        redirect: undefined
      };
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true
      }
    },
    created() {
      this.getCode();
      this.getPackMessage();
      this.getCookie();
    },
    methods: {
      getCode() {
        getCodeImg().then(res => {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        });
      },
      getPackMessage(){
        /*getPark().then(res => {
          console.log('获取园区通知')
          // this.codeUrl = "data:image/gif;base64," + res.img;
          // this.loginForm.uuid = res.uuid;
        });*/
      },
      getCookie() {
        const username = Cookies.get("username");
        const password = Cookies.get("password");
        const rememberMe = Cookies.get('rememberMe')
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        };
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            if (this.loginForm.rememberMe) {
              Cookies.set("username", this.loginForm.username, { expires: 30 });
              Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
              Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
            } else {
              Cookies.remove("username");
              Cookies.remove("password");
              Cookies.remove('rememberMe');
            }
            this.$store
              .dispatch("Login", this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || "/" });
              })
              .catch(() => {
                this.loading = false;
                this.getCode();
              });
          }
        });
      },
      handleClose(done) {
       /* this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});*/
        // done();
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #0D1D30;
    position: relative;
  }

  .main1{
    position: relative;
    width: 940px;
    height: 495px;
    /*left: 13%;*/
    background:rgba(25,41,59,1);
    border-radius:12px;
    box-shadow:0px 2px 12px 0px rgba(9,23,39,1);
    color:rgba(255,255,255,1);
    .img1{
      position:absolute;
      top: 46px;
      left: 53px;
      width: 110px;
    }
    .img2{
      position:absolute;
      top: 63px;
      left: 132px;
      width: 348px;
      height: 299px;
    }
    h3{
      margin-left: 52px;
      margin-top: 383px;
      margin-bottom: 0;
      font-size:32px;

    }
    h4{
      margin-left: 52px;
      font-size:24px;
      margin-top: 16px;
    }
    .login-form {
      position:absolute;
      right: 0;
      top: 0;
      border-radius: 6px;
      background: #ffffff;
      width: 299px;
      height: 495px;
      padding: 58px 33px 33px 33px;
      .title {
        width:85px;
        font-size:20px;
        margin: 0px auto 62px auto;
        border-bottom: 3px rgba(27,74,127,1) ridge;
        text-align: center;
        color: #333333;
        padding-bottom: 8px;
      }
      .el-input {
        height: 32px;
        input:focus  {
          color:rgba(6,104,185,1);
        }

        input {
          outline:none;
          height: 38px;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          border-radius:0;
        }

      }
      .color-class{
        color:rgba(6,104,185,1);
      }
      .input-icon {
        height: 39px;
        width: 19px;
        margin-left: 2px;
      }
    }
  }




  .login-code {
    position:absolute;
    width: 88px;
    height: 32px;
    right: 0;
    bottom: 8px;
    img {
      width: 88px;
      height: 32px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
/*  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: absolute;
    transform: translateY(273px);
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }*/
  .el-dialog__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0%;
    overflow: auto;
    margin: 0;
  }
  /*.el-card {
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    background-color: #0D1D30;
    overflow: hidden;
    color: aliceblue;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .box-card1{
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 20%;
    position: absolute;
    left: 4%;
    margin-top: 12%;
  }
  .box-card2{
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 20%;
    position: absolute;
    left: 4%;
    top: 26%;
  }*/
  .clockLogin{
    position: absolute;
    left: 92%;
    top: 30px;
  }
</style>
