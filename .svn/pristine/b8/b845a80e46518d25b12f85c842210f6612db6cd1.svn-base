<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="请假人" prop="applyUser">
        <el-select v-model="queryParams.applyUser"   clearable   placeholder="请选择请假人" style="margin-left: 10px">
          <el-option
            v-for="item in acceptTypeList"
            :key="item.userName"
            :label="item.nickName"
            :value="item.userName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请假时间">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="leaveList" stripe border :header-cell-style="{background:'#336699',color:'#eef1f6'}">

      <el-table-column
        prop="nickName"
        align="center"
        label="申请人">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDetail(scope.row)">{{scope.row.nickName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="请假时长" align="center" prop="duration"/>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" :disabled=readonly></el-input>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入内容" :disabled=readonly></el-input>
        </el-form-item>

        <el-form-item label="请假时间" prop="startAndEndTime">
          <el-date-picker
            style="width: 380px;height: 36px"
            v-model="startAndEndTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :disabled=readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请假时长" prop="totalTime">
          <el-input v-model="formatDateSub" :disabled="true"/>
        </el-form-item>


        <el-form-item label="实际开始时间" prop="realityStartTime" v-if="showVerify.ReportBack">
          <el-date-picker
            v-model="form.processParams.DT_realityStartTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">

          </el-date-picker>

        </el-form-item>
        <el-form-item label="实际结束时间" prop="realityEndTime" v-if="showVerify.ReportBack">
          <el-date-picker
            v-model="form.processParams.DT_realityEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">

          </el-date-picker>
        </el-form-item>

        <el-form-item label="从新申请" prop="reApply" v-if="showVerify.ModifyApply">
          <el-radio v-model="form.processParams.B_reApply" label="true" @change="handleSelectChange">重新申请</el-radio>
          <el-radio v-model="form.processParams.B_reApply" label="false" @change="handleSelectChange">放弃申请</el-radio>
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

        <el-form-item label="批注" prop="comment" v-if="showButton&& !(showVerify.ModifyApply||showVerify.ReportBack)">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.processParams.COM_comment">
          </el-input>
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
      title="请假详情"
      :visible.sync="detailDialog" size='65%'>
      <el-divider content-position="left">事假(共{{compNum}})</el-divider>
      <el-collapse v-model="activeComp" v-for="item in compList" @change="handleChange" style="margin-left: 30px">
        <el-collapse-item :title="item.title" name="1">
          <p>原因：{{item.reason}}</p>
          <p>请假时长：{{item.duration}}</p>
          <p>审批详情：{{item.approval}}</p>
          <p>实际开始时间：{{item.realityStartTime}}</p>
          <p>实际结束时间：{{item.realityEndTime}}</p>
        </el-collapse-item>
      </el-collapse>

      <el-divider content-position="left">病假(共{{sickNum}})</el-divider>
      <el-collapse v-model="activeSick" v-for="item in sickList" @change="handleChange" style="margin-left: 30px">
        <el-collapse-item :title="item.title" name="1">
          <p>原因：{{item.reason}}</p>
          <p>请假时长：{{item.duration}}</p>
          <p>审批详情：{{item.approval}}</p>
          <p>实际开始时间：{{item.realityStartTime}}</p>
          <p>实际结束时间：{{item.realityEndTime}}</p>
        </el-collapse-item>
      </el-collapse>

      <el-divider content-position="left">工休(共{{workNum}})</el-divider>
      <el-collapse v-model="activeWork" v-for="item in workList" @change="handleChange" style="margin-left: 30px">
        <el-collapse-item :title="item.title" name="1">
          <p>原因：{{item.reason}}</p>
          <p>请假时长：{{item.duration}}</p>
          <p>审批详情：{{item.approval}}</p>
          <p>实际开始时间：{{item.realityStartTime}}</p>
          <p>实际结束时间：{{item.realityEndTime}}</p>
        </el-collapse-item>
      </el-collapse>
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
    getTypeList
  } from '@/api/workflow/leaveMsg'
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil'
  import ApprovalHistory from '@/components/activiti/approvalHistory'
  import ProcessImg from '@/components/activiti/processImg'

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'LeaveMsg',
    data() {
      return {
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
        activeComp: ['1'],
        activeSick: ['1'],
        activeWork: ['1'],
        compList:[],
        compNum:'',
        sickList:[],
        sickNum:'',
        workList:[],
        workNum:'',
        //流程图窗口开关
        processImg: false,
        //请假详情
        detailDialog:false,

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
          processParams: {}
        },
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
      getTypeList().then(response => {
        if (response.code === 200) {
          this.acceptTypeList = response.rows
        }
      })
      const path = this.$route.path.split('/').pop()
      this.path = path
      if ('leaveMsg' == path) {
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
        if(this.timeRange){
          this.queryParams.startTime = this.timeRange[0];
          this.queryParams.endTime = this.timeRange[1];
        }
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
     /* handleAdd() {
        if(this.textForm.docType.length === 0){
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
        }
      },*/
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
      openDetail(row){
        this.detailDialog = true;
        this.compList = row.comp;
        this.compNum = row.compNum;
        this.sickList = row.sick;
        this.sickNum = row.sickNum;
        this.workList = row.work;
        this.workNum = row.workNum;
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateLeave(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            } else {
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
      }
    },
    watch: {
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
    }
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

 /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
   background: #F1FAFA;
   /*background: 	#F1FAFA;*/
   /*background: #A0EEE1;*/
 }

</style>
