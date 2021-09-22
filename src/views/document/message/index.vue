<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.taskTitle"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList">
      <el-table-column
        prop="sendUser"
        align="center"
        label="沟通对象">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDetail(scope.row)">{{scope.row.nickName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="taskTitle"/>
      <!--<el-table-column label="申请时间" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.instanceId">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="detail(scope.row)"
              v-hasPermi="['workflow:leave']"
            >申请详情
            </el-button>

          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="submitApply(scope.row)"
              v-hasPermi="['workflow:leave']"
            >提交申请
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['workflow:leave']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['workflow:leave']"
            >删除
            </el-button>
          </div>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改请假流程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="messageForm" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="taskTitle">
          <el-input v-model="messageForm.taskTitle" placeholder="请输入标题" :disabled=readonly></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="postMessage">
          <el-input v-model="messageForm.postMessage" type="textarea" placeholder="请输入内容" :disabled=readonly></el-input>
        </el-form-item>
        <el-form-item label="沟通对象" prop="sendUser">
          <el-select v-model="messageForm.sendUser"   clearable   placeholder="请选择沟通对象" style="margin-left: 10px">
            <el-option
              v-for="item in acceptTypeList"
              :key="item.userName"
              :label="item.nickName"
              :value="item.userName">
            </el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShowVerifyDialog" v-show="showButton">确 定</el-button>
        <el-button type="primary" @click="submitForm" v-show=!readonly&&!showButton>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--审批历史-->
    <el-dialog title="审批历史" :visible.sync="dialogTableVisible">
      <ApprovalHistory :instanceId="instanceId"></ApprovalHistory>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看进度" :visible.sync="processImg">
      <ProcessImg :instanceId="instanceId"></ProcessImg>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <el-drawer
      title="沟通详情"
      :visible.sync="detailDialog" size='65%' :before-close="handleClose" style="height: 100%"
      @open="openDrawer" @close="closeDrawer" >
      <el-scrollbar :style="{height: scrollHeight}" ref="myScrollbar">
        <el-timeline v-for="item in messageList"  :key="item.id" v-infinite-scroll="messageList.length"
                     style="overflow:auto" class="myTimeLine">
          <el-timeline-item :timestamp="item.acceptTime" placement="top" >
            <el-card style="width: 95%">
              <h4>{{item.postMessage}}</h4>
              <p>{{item.nickName}} 发送于 {{item.sendTime}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
      <div>
        <el-divider content-position="left">回复消息</el-divider>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="postMessage" style="width: 80%;padding-left: 5%">
        </el-input>

          <el-button @click="addCommit" style="margin-left: 30px" type="primary">提交</el-button>
      </div>
    </el-drawer>

  </div>
</template>

<script>
  import {
    listLeave,
    getLeave,
    delLeave,
    addLeave,
    updateLeave,
    exportLeave,
    submitApply,
    taskDoneList,
    taskList,
    getTypeList,addMessage
  } from '@/api/document/message'
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil'
  import ApprovalHistory from '@/components/activiti/approvalHistory'
  import ProcessImg from '@/components/activiti/processImg'

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'Message',
    data() {
      return {
        timer:null,
        drawerQuery:'',//抽屉打开时需要传的参数
        // 审批确定按钮
        showButton: false,
        // 审批人控制表单
        showVerify: {
          ModifyApply: false,
          DeptLeaderVerify: false,
          HrVerify: false,
          ReportBack: false,
        },
        // 路径
        path: '',
        // 查询方法
        getLeaveList: null,
        //流程图窗口开关
        processImg: false,
        //请假详情
        detailDialog:false,
        scrollHeight:'',
        scrollWidth:'90%',
        scrollLeft:'3%',
        messageList:[],
        postMessage:'',
        messageData : {
          toUser:'',
          postMessage: "",
          taskId :''
        },
        //审批历史窗口开关
        dialogTableVisible: false,
        //历史审批窗口参数
        instanceId: '',

        // 请假时长
        formatDateSub: '',
        startAndEndTime: ['', ''],
        readonly: false,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 请假流程表格数据
        leaveList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        timeRange:'',
        queryParams: {
          startTime:null,
          endTime:null,
          pageNum: 1,
          pageSize: 10,
          type: null,
          title: null,
          reason: null,
          leaveStartTime: null,
          leaveEndTime: null,
          totalTime: null,
          instanceId: null,
          applyUser: null,
          applyTime: null,
          realityStartTime: null,
          realityEndTime: null
        },
        acceptTypeList:[],
        textForm: {
          docType:'',//流程类型
        },
        // 表单参数
        form: {
          // processParams: {}
        },
        messageForm:{},
        // 表单校验
        rules: {
          title: [
            {required: true, message: '用户名称不能为空', trigger: 'blur'}
          ], totalTime: [
            {required: true, message: '请假时间不能为空', trigger: 'blur'}
          ], reason: [
            {required: true, message: '原因不能为空', trigger: 'blur'}
          ], realityStartTime: [
            {required: true, message: '原因不能为空', trigger: 'blur'}
          ], realityEndTime: [
            {required: true, message: '原因不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      const path = this.$route.path.split('/').pop()
      this.path = path
      if ('message' == path) {
        this.getLeaveList = listLeave
      } else if ('todo' == path) {
        this.getLeaveList = taskList
      } else if ('done' == path) {
        this.getLeaveList = taskDoneList
      }
      this.getList()
    },
    methods: {

      submitShowVerifyDialog() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            complete(this.form).then(response => {
              if (response.code === 200) {
                if (this.showVerify.ModifyApply) {
                  updateLeave(this.form).then(response => {
                    if (response.code === 200) {
                      this.msgSuccess('修改成功')
                      this.open = false
                      this.getList()
                    }
                  })
                } else {
                  this.msgSuccess('操作成功')
                  this.open = false
                  this.getList()
                }
                this.reset()
              }
            })
          }
        })
      },
      // 审批菜单控制
      showVerifyDialog(row) {
        this.showButton = true
        this.reset()
        getLeave(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.realityStartTime, this.form.realityEndTime]
          showVerifyDialog(row.taskId).then(response => {
            console.log(response.msg)
            if ('ModifyApply' === response.msg) {
              this.readonly = false
              this.showVerify.ModifyApply = true;
              this.form.processParams.B_reApply = "true";
            } else {
              if ('HrVerify' === response.msg) {
                this.showVerify.HrVerify = true;
                this.form.processParams.B_hrApproved = "true";
              } else if ('DeptLeaderVerify' === response.msg) {
                this.showVerify.DeptLeaderVerify = true;
                this.form.processParams.B_deptLeaderApproved = "true";
              } else if ('ReportBack' === response.msg) {
                this.showVerify.ReportBack = true;
              }
              this.readonly = true
            }
            this.open = true
            this.title = row.taskName
          })
        })
      },
      /** 历史列表 */
      historyList(row) {
        this.dialogTableVisible = true
        this.instanceId = row.instanceId
      },
      /** 查询请假流程列表 */
      getList() {
        this.loading = true

        this.getLeaveList(this.queryParams).then(response => {
          this.leaveList = response.rows;
          /* this.leaveList = list.map(function (item) {
             let timeTol
             if (item.realityStartTime && item.realityEndTime) {
               timeTol = calcTotalSecond(item.realityStartTime, item.realityEndTime)
               item.totalTime = formatTotalDateSub(timeTol)
             }
             return item;
           });*/
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.dialogTableVisible = false
        this.processImg = false
        this.showButton = false
        this.reset()

      },
      handleClose(done) {
        this.reset();
        done();
      },
      addCommit(){
        if(this.postMessage === ''){
          this.$message({
            message: '不能发送空白消息',
            type: 'warning'
          });
          return;
        };
        if(localStorage.getItem('taskFromUser') === localStorage.getItem('userName')){
          this.messageData.toUser = localStorage.getItem('taskSendUser')
        }else{
          this.messageData.toUser = localStorage.getItem('taskFromUser')
        }

        this.messageData.postMessage = this.postMessage;
        this.messageData.taskId = localStorage.getItem('taskId');
        addMessage(this.messageData).then(res=>{
          if(res.code===200){
            getLeave(localStorage.getItem('taskId')).then(response => {
              if(response.code === 200){
                this.messageList = response.data;
                this.postMessage = '';
              }
            })
          }
        })
        setTimeout(() => {
          var div = this.$refs['myScrollbar'];
          this.$nextTick(() => {
            div.wrap.scrollTop = div.wrap.scrollHeight;//这里加不加
          })
        }, 800)
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          type: null,
          title: null,
          reason: null,
          leaveStartTime: null,
          leaveEndTime: null,
          totalTime: null,
          instanceId: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          applyUser: null,
          applyTime: null,
          realityStartTime: null,
          realityEndTime: null,
          processParams: {}
        };
        this.timeRange=null,
          this.queryParams= {
            startTime:null,
            endTime:null,
            pageNum: 1,
            pageSize: 10,
            type: null,
            title: null,
            reason: null,
            leaveStartTime: null,
            leaveEndTime: null,
            totalTime: null,
            instanceId: null,
            applyUser: null,
            applyTime: null,
            realityStartTime: null,
            realityEndTime: null
          };
        this.startAndEndTime = ['', '']
        this.formatDateSub = null
        this.resetForm('form')
        this.instanceId = ''
        this.showVerify = {
          ModifyApply: false,
          DeptLeaderVerify: false,
          HrVerify: false,
          ReportBack: false,
        }
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 新增按钮操作 */
       handleAdd() {
        this.reset();
        getTypeList().then(response => {
           if (response.code === 200) {
             this.acceptTypeList = response.rows
           }
         })
        this.open = true
        this.readonly = false
        this.title = '新增任务沟通'
         /*if(this.textForm.docType.length === 0){
           this.open = false
           this.$message({
             message: '请选择流程模型哦！',
             type: 'warning'
           });
         }else {
           this.reset()
           this.open = true
           this.readonly = false
           this.title = '添加请假流程'
         }*/
       },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getLeave(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.realityStartTime, this.form.realityEndTime]
          this.open = true
          this.readonly = false
          this.title = '修改请假流程'
        })
      },
      submitApply(row) {
        this.$confirm('确认要提交申请吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return submitApply(row.id)
        }).then(() => {
          this.getList()
          this.msgSuccess('提交成功')
        }).catch(function () {
        })
      },
      cancelApply(row) {
        this.$confirm('确认要撤销申请吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return cancelApply(row.instanceId)
        }).then(() => {
          this.getList()
          this.msgSuccess('撤销成功')
        }).catch(function () {
        })
      },
      suspendOrActiveApply(row) {
        var suspendOrActive = row.suspendState === '2' ? '激活' : '挂起'
        this.$confirm('确认要' + suspendOrActive + '申请吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          const data = {'instanceId': row.instanceId, 'suspendState': row.suspendState}
          return suspendOrActiveApply(data)
        }).then(() => {
          this.getList()
          this.msgSuccess('撤销成功')
        }).catch(function () {
        })
      },
      /** 表单数据展示 */
      detail(row) {
        this.reset()
        getLeave(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.realityStartTime, this.form.realityEndTime]
          this.open = true
          this.readonly = true
          this.title = '申请详情'
        })
      },
      openDrawer(){

        let id = this.drawerQuery.id;
        this.scrollHeight = window.innerHeight*0.7 + 'px';
        let that = this;
         that.timer= setInterval(function () {
            getLeave(id).then(response => {
              if(response.code === 200){
                that.$set(that, 'messageList', response.data)
              }
            })
           // console.log('高度',that.$refs['myScrollbar'].wrap.scrollHeight)
           that.$refs['myScrollbar'].wrap.scrollTop = that.$refs['myScrollbar'].wrap.scrollHeight;
          },6000);

        setTimeout(() => {
          let div = this.$refs['myScrollbar'];
          this.$nextTick(() => {
            div.wrap.scrollTop = div.wrap.scrollHeight
          })
        }, 800)
      },
      closeDrawer(){
        clearInterval(this.timer);//停止
        this.timer = null;
      },
      openDetail(row){
        this.drawerQuery = row;
        this.detailDialog = true;
        // this.scrollHeight = window.innerHeight*0.7 + 'px';
        localStorage.setItem('taskFromUser',row.fromUser);
        localStorage.setItem('taskSendUser',row.sendUser);
        localStorage.setItem('taskId',row.id);
        getLeave(row.id).then(response => {
          if(response.code === 200){
            this.messageList = response.data;
          }
        })
        // setTimeout(() => {
        //   var div = this.$refs['myScrollbar'];
        //   this.$nextTick(() => {
        //     div.wrap.scrollTop = div.wrap.scrollHeight
        //   })
        // }, 500);


      },
      /** 提交按钮 */
      submitForm() {
        // this.$refs['messageForm'].validate(valid => {
        //   if (valid) {
            if (this.messageForm.id != null) {
              updateLeave(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            } else {
              addLeave(this.messageForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                }
              })
            }
        //   }
        // })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除请假流程编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delLeave(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function () {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有请假流程数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return exportLeave(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function () {
        })
      },
      showProcessImgDialog(row) {
        this.processImg = true
        this.instanceId = row.instanceId
      },
      handleSelectChange(val) {
        console.log(this.form.processParams.B_deptLeaderApproved)
        this.$forceUpdate()
      },
      handleChange(val) {
        console.log(val);
      },
      load () {
        this.count += 2
      }
    },
   /* watch: {
      startAndEndTime: {
        handler(newValue) {
          this.form.realityStartTime = newValue[0]
          this.form.realityEndTime = newValue[1]
          if (newValue[0] && newValue[1]) {
            this.form.totalTime = calcTotalSecond(newValue[0], newValue[1])
            this.formatDateSub = formatTotalDateSub(this.form.totalTime)
          }

        },
        deep: true
      }
    }*/
  }

</script>

<style lang="scss" scoped>
  /*去掉打开抽屉时自动选中标题时的边框*/
  /deep/ :focus {
    outline: 0;
  }
  .el-divider__text {
    position: absolute;
    background-color: #FFFFFF;
    padding: 0 20px;
    font-weight: 500;
    color: #303133;
    font-size: 17px;
  }
 /* /deep/ .el-timeline-item__tail {
    position: absolute;
    left: auto;
    height: 100%;
    right: 4px;
    border-left: 2px solid #e4e7ed;
  }*/
  /deep/ .myTimeLine {
    overflow: scroll
  }
  /deep/.el-scrollbar__wrap {
    /*margin-left: 1%;*/
    /*margin-right: 1%;*/
    overflow-x: hidden;
  }
  /deep/.el-scrollbar__wrap .el-scrollbar__view ul{

    padding-inline-start: 40px!important;
  }
</style>
