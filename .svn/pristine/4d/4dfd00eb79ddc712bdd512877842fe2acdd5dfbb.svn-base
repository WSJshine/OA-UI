<template>

  <!--<router-link target="_blank" :to="{path:'/login',query:{id:'1'}}">新页面打开home页</router-link>-->
<!--<div class="firstPage">

  <el-row>
    <p>Hello Word!</p>
    <el-button type="primary"  @click="querySort">主要按钮</el-button>
  </el-row>
</div>-->
  <!-- 头部 -->
  <div class="myAll">
  <header class="header">
    <img src="@/assets/image/guohui.png" alt="" class="img1">
    <div class="w">
      <p style="font-family:'Microsoft YaHei';font-size: 40px;margin-top: -50px;margin-left: 6%;">许昌魏都产业集聚区管理委员会</p>
    </div>
    <!--<el-button type="text"  @click="querySort" style="padding-left: 80%;margin-bottom: 80px">登录后台</el-button>-->
    <el-button type="primary" round @click="querySort" style="margin-left: 85%;margin-bottom: 80px">登录系统</el-button>
  </header>
  <div class="main">
    <div class="w">
      <div class="box">
        <div class="card">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>园区动态</span>
              <!--<el-button style="float: right; padding: 3px 0" type="text"></el-button>-->
              <el-button style="float: right; padding: 3px 0" type="text" >{{'更多 ('+parkList.length+')' }}</el-button>

            </div>
            <div v-for="(item,i) in parkList" :key="i" class="text item">
              <el-button type="text" v-if="i < 10" @click="openParkNews(item.id)">{{'•\xa0\xa0\xa0' + item.title }}</el-button>
              <el-button type="text" v-if="i < 10" @click="openParkNews(item.id)" style="float:right">{{item.createTime}}</el-button>
            </div>
          </el-card>
        </div>
        <div class="card">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>通知公告</span>
              <!--<el-button style="float: right; padding: 3px 0" type="text"></el-button>-->
              <el-button style="float: right; padding: 3px 0" type="text" >{{'更多 ('+postList.length+')' }}</el-button>
            </div>
            <div v-for="(item,i) in postList" :key="i" class="text item">
              <el-button type="text" v-if="i < 10" @click="openNoticeNews(item.id)">{{'•\xa0\xa0\xa0' + item.title }}</el-button>
              <el-button type="text" v-if="i < 10" @click="openNoticeNews(item.id)" style="float:right">{{item.sendTime}}</el-button>
            </div>
          </el-card>
        </div>
        <div class="card">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>企业信息</span>
              <!--<el-button style="float: right; padding: 3px 0" type="text"></el-button>-->
              <el-button style="float: right; padding: 3px 0" type="text" >{{'更多 ('+enterpriseList.length+')' }}</el-button>
            </div>
            <div v-for="(item,i) in enterpriseList" :key="i" class="text item">
              <el-button type="text" v-if="i < 10" @click="openParkNews(item.id)">{{'•\xa0\xa0\xa0' + item.title}}</el-button>
              <el-button type="text" v-if="i < 10" @click="openParkNews(item.id)" style="float:right">{{item.createTime}}</el-button>
            </div>
          </el-card>
        </div>
        <div class="card">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>项目招商</span>
              <!--<el-button style="float: right; padding: 3px 0" type="text"></el-button>-->
              <el-button style="float: right; padding: 3px 0" type="text" >{{'更多 ('+taskList.length+')' }}</el-button>
            </div>
            <div v-for="(item,i) in taskList" :key="i" class="text item">
              <el-button type="text" v-if="i < 10" @click="openParkNews(item.id)">{{'•\xa0\xa0\xa0' + item.title }}</el-button>
              <el-button type="text" v-if="i < 10" @click="openParkNews(item.id)" style="float:right">{{item.createTime}}</el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
  <footer class="footer">
    <div class="w">
      <div class="el-login-footer" style="text-align: center;padding-top: 30px">
        <span>联系我们：0374-8319668</span>
        <span>       yqgwh@126.com</span>
      </div>
    </div>
  </footer>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      width="60%"
      center>
      <p id="mydialog" style="line-height:30px;margin-left: 30px;margin-right: 30px"></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getTask,getEnterprise,getPost,getPark,getWebsiteDetail,getNoticeDetail
  } from '@/api/firstShow';
    export default {
      name: "FirstPage",
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
        getTask().then((response) => {
          if (response.code === 200) {
            this.taskList = response.rows;
          }
        });
        getEnterprise().then((response) => {
          if (response.code === 200) {
            this.enterpriseList = response.rows;
          }
        });
        getPost().then((response) => {
          if (response.code === 200) {
            this.postList = response.rows;
          }
        });
        getPark().then((response) => {
          if (response.code === 200) {
            this.parkList = response.rows;
          }
        });
      },
      methods: {
        querySort(){
          this.$router.push({ path: "/login" });
        },
        openParkNews(id){
          this.$router.push({ path: "/firstPageDetail", query: { ids: id}})
         /* let routeUrl = this.$router.resolve({ //打开新的浏览器窗口
            path: "/firstPageDetail",
            query: { ids: id}
          });
          window.open(routeUrl.href, '_blank');*/
          /*this.centerDialogVisible = true;
          let data={
            id:id
          }
          getWebsiteDetail(data).then(response => {

            this.dialogTitle = response.data.title;
            let div = document.getElementById('mydialog');
            div.innerHTML = response.data.content;
          })*/
        },
        openNoticeNews(id){
          this.$router.push({ path: "/firstPageDetail", query: { idd: id}})
         /* this.centerDialogVisible = true;
          getNoticeDetail(id).then(response => {

            this.dialogTitle = response.data.docTitle;
            let div = document.getElementById('mydialog');
            div.innerHTML = response.data.docRemark;
          })*/
        },
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
  .myAll{

    background-image:linear-gradient(to top,  RGB(255,255,255), transparent), url('~@/assets/image/firstPagebg.jpg') ;
    background-size: 100% 60%;/*按比例缩放*/
    background-repeat:no-repeat;
    background-attachment: fixed;
    /*background-image:linear-gradient(to bottom,  RGB(255,255,255), transparent),  url('../assets/image/foot.jpg') ;*/
  }
  .header{
    /*background-image:url('~@/assets/image/firstPagebg.jpg');*/
    height: 180px;
    /*margin-top:;*/
  }
  .main{
    border-top: 3px solid #015293;
    /*background-color: green;*/
    height: 600px;
  }
  .footer{
    /*background-color: yellow;*/
    height: 155px;
    background-image:linear-gradient(to bottom,  RGB(255,255,255), transparent),  url('../assets/image/foot.jpg') ;
    /*background-size: 90% 100%;!*按比例缩放*!*/
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
