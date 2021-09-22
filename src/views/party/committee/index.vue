<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="108px">
     <!-- <el-form-item label="请假类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择请假类型" clearable size="small">
          <el-option label="请选择字典生成" value=""/>
        </el-select>
      </el-form-item>-->
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="流程实例ID" prop="instanceId">
        <el-input
          v-model="queryParams.instanceId"
          placeholder="请输入流程实例ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" v-if="path=='committee'">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['party:member:committeelist']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList" stripe border :header-cell-style="{background:'#336699',color:'#eef1f6'}">
      <el-table-column label="活动标题" align="center" prop="title"/>
      <el-table-column label="开始时间" align="center" prop="startTime"/>
      <el-table-column label="参加支部" align="center" prop="acceptName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.instanceId">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="detail(scope.row)"
              v-hasPermi="['party:member:committeelist']"
            >申请详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="historyList(scope.row)"
              v-hasPermi="['party:member:committeelist']"
            >审批历史
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="showProcessImgDialog(scope.row)"
              v-hasPermi="['party:member:committeelist']"
            >查看进度
            </el-button>
            <el-button
              v-if="scope.row.taskName.indexOf('已挂起') === -1 && path=='todo'"
              size="mini" showFormDialog
              type="text"
              icon="el-icon-edit"
              @click="showVerifyDialog(scope.row)"
              v-hasPermi="['party:member:committeelist']"
            >{{scope.row.taskName.indexOf('审批') !== -1?'审批':scope.row.taskName}}
            </el-button>
            <div v-if="scope.row.taskName.indexOf('已结束') === -1 && path=='list'">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="cancelApply(scope.row)"
                v-hasPermi="['party:member:committeelist']"
              >撤销
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="suspendOrActiveApply(scope.row)"
                v-hasPermi="['party:member:committeelist']"
              >{{scope.row.suspendState=== '2' ? '激活' : '挂起'}}
              </el-button>
            </div>
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="submitApply(scope.row)"
              v-hasPermi="['party:member:committeelist']"
            >提交申请
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['party:member:committeelist']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['party:member:committeelist']"
            >删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改请假流程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" :disabled=readonly style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="简述" prop="display">
          <el-input v-model="form.display" type="textarea" placeholder="请输入内容" :disabled=readonly style="width: 50%"></el-input>
        </el-form-item>

        <el-form-item label="预计开始时间" prop="startAndEndTime" >
          <el-date-picker
            style="width: 380px;height: 36px"
            v-model="startAndEndTime"
            type="datetimerange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :disabled=readonly>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="接收党支部" prop="startAndEndTime">
          <el-select v-model="form.acceptName"  clearable multiple collapse-tags
                     placeholder="请选择接收党支部" style="width:50%"
                     @change="contentChange">
            <el-option
              v-for="item in firstSendList"
              :key="item.account"
              :label="item.name"
              :value="item.account">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审批意见" prop="deptLeaderApproved" v-if="showVerify.DeptLeaderVerify">
          <el-radio v-model="form.processParams.B_deptLeaderApproved" label="true" @change="handleSelectChange">同意
          </el-radio>
          <el-radio v-model="form.processParams.B_deptLeaderApproved" label="false" @change="handleSelectChange">拒绝
          </el-radio>
        </el-form-item>

        <el-form-item label="审批意见" prop="hrApproved" v-if="showVerify.HrVerify">
          <el-radio v-model="form.processParams.B_hrApproved" label="true" @change="handleSelectChange">同意</el-radio>
          <el-radio v-model="form.processParams.B_hrApproved" label="false" @change="handleSelectChange">拒绝</el-radio>
        </el-form-item>




      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShowVerifyDialog" v-show="showButton">确 定</el-button>
        <el-button type="primary" @click="submitForm" v-show=!readonly&&!showButton>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--审批历史-->
    <el-dialog title="审批历史" :visible.sync="dialogTableVisible" width="800px">
      <ApprovalHistory :instanceId="instanceId"></ApprovalHistory>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看进度" :visible.sync="processImg" width="1200px">
      <ProcessImg :instanceId="instanceId"></ProcessImg>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-drawer
      title="活动详情"
      :visible.sync="drawer"
      :direction="direction" size='55%'>
      <el-tabs :tab-position="tabPosition" style="height: 100%">
        <el-tab-pane  v-for="(item,i) in formTabList">
          <span slot="label">{{item.branchName}}</span>
          <el-form  :model='item' class="demo-form-inline" v-if="item.sonStatus === '已完成'">
            <el-form-item label='活动标题：'  prop="activityContent">
              <span>{{item.activityContent}}</span>
            </el-form-item>
            <el-form-item label='活动负责人：'  prop="activityCharger">
              <span>{{item.activityCharger}}</span>
            </el-form-item>
            <el-form-item label='党支部名称：'  prop="branchName">
              <span>{{item.branchName}}</span>
            </el-form-item>
            <el-form-item label='活动举办时间：'  prop="activityTime">
              <span>{{item.activityTime}}</span>
            </el-form-item>
            <el-form-item label='活动地点：'  prop="activityAdd">
              <span>{{item.activityAdd}}</span>
            </el-form-item>
            <el-form-item label='活动内容：'  prop="activityContent">
              <span>{{item.activityContent}}</span>
            </el-form-item>
            <el-form-item label="活动图片" prop="activityImg">
              <el-image :src="item.activityImg" style="width: 50%;height: 50%"></el-image>
            </el-form-item>
          </el-form>
          <p v-else>{{item.sonStatus}}</p>
        </el-tab-pane>
      </el-tabs>
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
    getlistDept
  } from '@/api/party/committee'
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil'
  import ApprovalHistory from '@/components/activiti/approvalHistory'
  import ProcessImg from '@/components/activiti/processImg'

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'Committee',
    data() {
      return {
        drawer: false,
        direction: 'ltr',
        tabPosition: 'left',
        formTabList:[],
        formInline:{},
        // 审批确定按钮
        showButton: false,
        // 审批人控制表单
        showVerify: {
          ModifyApply: false,
          DeptLeaderVerify: false,
          HrVerify: false,
          ReportBack: false,
        },
        firstSendList:[],
        firstSendAccounts:[],
        firstSendNames:[],
        // 路径
        path: '',
        // 查询方法
        getLeaveList: null,

        //流程图窗口开关
        processImg: false,
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
        queryParams: {
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

        textForm: {
          docType:'',//流程类型
        },
        // 表单参数
        form: {
          processParams: {}
        },
        // 表单校验
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
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
      if ('committee' == path) {
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
      contentChange (val) {
        this.firstSendAccounts=[];
        this.firstSendNames=[];
        for(let i=0;i<=val.length-1;i++){
          this.firstSendList.find((item)=>{ //这里的firstSendList就是数据源
            if(item.account == val[i]){
              this.firstSendAccounts.push(item.account) //这里的value我改成了account
              this.firstSendNames.push(item.name) //这里的label我改成了name
            }
          });
        }
        console.log('多选ID',this.firstSendAccounts)
        console.log('多选name：',this.firstSendNames)
      },
      // 审批菜单控制
      showVerifyDialog(row) {
        this.showButton = true
        this.reset()
        getLeave(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.startTime, this.form.endTime]
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
          this.leaveList = response.rows
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
        }
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

          this.reset()
          this.open = true
          this.readonly = false
          this.title = '添加党员活动';
        getlistDept().then(response => {
          if (response.code === 200) {
            this.firstSendList = response.rows;
          }
        });

      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getLeave(row.id).then(response => {
          this.form = response.data;
          getlistDept().then(response => {
            if (response.code === 200) {
              this.firstSendList = response.rows;
            }
          });
          //以逗号隔开转成数组回显下拉多选框
          var str = response.data.acceptUser;
          var arr = str.split(',');
          this.form.acceptName = arr;
          // this.startAndEndTime = [this.form.startTime, this.form.endTime]
          this.open = true
          this.readonly = false
          this.title = '修改党员活动'
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
          this.startAndEndTime = [this.form.startTime, this.form.endTime]
          this.open = true
          this.readonly = true
          this.title = '申请详情'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              let acceptName='';
              let acceptUser='';

              if(this.firstSendAccounts){
                for(let i = 0;i<this.firstSendAccounts.length;i++){
                  acceptUser +=this.firstSendAccounts[i]+',';
                  acceptName +=this.firstSendNames[i]+','
                }
              }
              acceptName = acceptName.substring(0, acceptName.lastIndexOf(','));//去掉最后一个逗号
              acceptUser = acceptUser.substring(0, acceptUser.lastIndexOf(','));
              this.form.acceptName = acceptName;
              this.form.acceptUser = acceptUser;
              updateLeave(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            } else {
              let acceptName='';
              let acceptUser='';

              if(this.firstSendAccounts){
                for(let i = 0;i<this.firstSendAccounts.length;i++){
                  acceptUser +=this.firstSendAccounts[i]+',';
                  acceptName +=this.firstSendNames[i]+','
                }
              }
              acceptName = acceptName.substring(0, acceptName.lastIndexOf(','));//去掉最后一个逗号
              acceptUser = acceptUser.substring(0, acceptUser.lastIndexOf(','));
              this.form.acceptName = acceptName;
              this.form.acceptUser = acceptUser;
              addLeave(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                }
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id
        this.$confirm('是否确认删除活动标题为"' + row.title + '"的数据项?', '警告', {
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
        // this.processImg = true
        // this.instanceId = row.instanceId
        this.drawer = true;
        getLeave(row.id).then(response => {
          if(response.code === 200){
            this.formTabList = response.data.activityContents
          }

        })
      },
      handleSelectChange(val) {
        console.log(this.form.processParams.B_deptLeaderApproved)
        this.$forceUpdate()
      }
    },
    watch: {

    }
  }

</script>
<style lang="scss" scoped>
  /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #F1FAFA;
    /*background: 	#F1FAFA;*/
    /*background: #A0EEE1;*/
  }
</style>
