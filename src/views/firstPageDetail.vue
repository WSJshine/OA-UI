<template>

  <!--<router-link target="_blank" :to="{path:'/login',query:{id:'1'}}">新页面打开home页</router-link>-->
  <!--<div class="firstPage">

    <el-row>
      <p>Hello Word!</p>
      <el-button type="primary"  @click="querySort">主要按钮</el-button>
    </el-row>
  </div>-->
  <!-- 头部 -->
  <div>
    <header class="header">
      <img src="@/assets/image/guohui.png" alt="" class="img1">
      <div class="w">
        <p style="font-family:'Microsoft YaHei';font-size: 40px;margin-top: -50px;">许昌魏都产业集聚区管理委员会</p>
      </div>
      <!--<el-button type="text"  @click="querySort" style="padding-left: 80%;margin-bottom: 80px">登录后台</el-button>-->
      <el-button type="primary" round @click="querySort" style="margin-left: 85%;margin-bottom: 80px">登录系统</el-button>
    </header>
    <div class="main">
      <el-page-header @back="goBack" content="详情页面" style="margin: 30px"/>
      <div class="w" style="margin-top: -40px;">
        <div class="box">
          <b id='myTitle' style="padding-left: 43%;"></b>
          <p id='myContent' style="white-space: pre-wrap;line-height:30px;padding-top: 30px"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getTask,getEnterprise,getPost,getPark,getWebsiteDetail,getNoticeDetail,getPackDetail
  } from '@/api/firstShow';
  export default {
    name: "FirstPageDetail",
    data(){
      return {
        centerDialogVisible: false,
        dialogTitle:'',
        taskList:[],
        enterpriseList:[],
        postList:[],
        parkList:[]
      }
    },
    created() {

      if(this.$route.query.ids){
        var  id = this.$route.query.ids;
        getPackDetail(id).then(response => {
          // this.dialogTitle = response.data.docTitle;
          let div1 = document.getElementById('myTitle');
          div1.innerHTML = response.data.title;
          let div = document.getElementById('myContent');
          div.innerHTML = response.data.content;
        })
      }


      if(this.$route.query.idd){
        var noticeId = this.$route.query.idd;
        getNoticeDetail(noticeId).then(response => {
          let div1 = document.getElementById('myTitle');
          div1.innerHTML = response.data.docTitle;
          let div = document.getElementById('myContent');
          div.innerHTML = response.data.docRemark;
        })
      }
    },
    methods: {
      querySort(){
        this.$router.push({ path: "/login" });
      },
      openParkNews(id){
        this.centerDialogVisible = true;
        getWebsiteDetail(id).then(response => {

          this.dialogTitle = response.data.title;
          let div = document.getElementById('mydialog');
          div.innerHTML = response.data.content;
        })
      },
      openNoticeNews(id){
        this.centerDialogVisible = true;
        getNoticeDetail(id).then(response => {

          // this.dialogTitle = response.data.docTitle;
          let div1 = document.getElementById('myTitle');
          div1.innerHTML = response.data.docTitle;
          let div = document.getElementById('myContent');
          div.innerHTML = response.data.docRemark;
        })
      },
      goBack() {
        this.$router.push({ path: "/firstPage" });
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "~@/assets/styles/cssReset.scss";
  .img1{
    padding-top: 70px;
    padding-left: 160px;
  }
  .w{
    width: 1380px;
    margin: 0 auto;
    /*border-left: 1px solid red;*/
    /*border-right: 1px solid red;*/
  }
  .header{
    background-image:url('~@/assets/image/firstPagebg.jpg');
    height: 200px;
    /*margin-top:;*/
  }
  .main{
    /*background-color: green;*/
    height: 650px;
  }
  .footer{
    /*background-color: yellow;*/
    height: 50px;
  }
  .box{
    padding-top: 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .box .card{
    width: 620px;/*(1180-20)/2*/
    margin-right: 20px;
    margin-left: 40px;
    margin-bottom: 20px;
  }
  .box .card:nth-of-type(2){
    margin-right: 0;
  }


</style>
