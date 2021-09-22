<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="docTitle">
        <el-input
          v-model="queryParams.docTitle"
          placeholder="请输入标题"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >收文登记
        </el-button>
        <span style="margin-left: 20px">流程模型</span>
        <el-select v-model="receivedForm.docType"   clearable   placeholder="请选择流程模型" style="margin-left: 10px">
          <el-option
            v-for="item in acceptTypeList"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList"  stripe border :header-cell-style="{background:'#336699',color:'#eef1f6'}">
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column label="公文标题" align="center" prop="docTitle"/>
      <el-table-column label="来文文号" align="center" prop="sendNum"/>
      <el-table-column label="登记日期" align="center" prop="sendTime"/>

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
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="historyList(scope.row)"
              v-hasPermi="['workflow:leave']"
            >审批历史
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="showProcessImgDialog(scope.row)"
              v-hasPermi="['workflow:leave']"
            >进度查看
            </el-button>
            <el-button
              v-if="scope.row.taskName.indexOf('已挂起') === -1 && path=='todo'"
              size="mini" showFormDialog
              type="text"
              icon="el-icon-edit"
              @click="showVerifyDialog(scope.row)"
              v-hasPermi="['workflow:leave']"
            >{{scope.row.taskName.indexOf('审批') !== -1?'审批':scope.row.taskName}}
            </el-button>
            <div v-if="scope.row.taskName.indexOf('已结束') === -1 && path=='advice'">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="cancelApply(scope.row)"
                v-hasPermi="['workflow:leave']"
              >撤销
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="suspendOrActiveApply(scope.row)"
                v-hasPermi="['workflow:leave']"
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
              v-hasPermi="['meeting:advice:delete']"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="addRules" label-width="80px">
        <el-form-item label="会议标题" prop="meetTitle">
          <el-input v-model="form.meetTitle" placeholder="请输入会议标题" :disabled=readonly></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="backups1">
          <!--<el-input v-model="form.reason" type="textarea" placeholder="请选择负责人" :disabled=readonly></el-input>-->
          <el-select v-model="form.backups1" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.userId"
              :label="item.userName"
              :value="item.userName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参会人" prop="meetParticipants" >
          <!--<el-input v-model="form.reason" type="textarea" placeholder="请选择参会人" :disabled=readonly></el-input>-->
          <el-input v-model="form.meetParticipants" placeholder="" :disabled=readonly v-if="showVerify.GetPeople"></el-input>
          <el-select v-model="form.peoples" multiple placeholder="请选择" v-else>
            <el-option
              v-for="item in peopOptions"
              :key="item.userId"
              :label="item.userName"
              :value="item.userName">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="会议时间" prop="startAndEndTime" v-if="showVerify.GetPeople === false">
          <el-date-picker
            style="width: 380px;height: 36px"
            v-model="startAndEndTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期" :disabled=readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议主要内容" prop="meetContent">
          <!--<el-input v-model="formatDateSub" :disabled="true"/>-->
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.meetContent">
          </el-input>
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

        <el-form-item label="审批意见" prop="sign" v-if="showVerify.GetPeople">
          <el-radio v-model="form.processParams.B_peopleSign" label="true" @change="handleSelectChange">签到</el-radio>
          <el-radio v-model="form.processParams.B_peopleSign" label="false" @change="handleSelectChange">拒绝签到</el-radio>
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

    <el-dialog title="查看进度" :visible.sync="processImg" style="width: 120%" width="1100px">
      <ProcessImg :instanceId="instanceId"></ProcessImg>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--收文登记-->
    <el-dialog :title="receivedTitle" :visible.sync="openReceived" width="1200px" append-to-body :before-close="handleClose">
      <el-form ref="form" :model="receivedForm" :rules="rules" label-width="120px">
        <el-row>
          <div class="sign-page">
            <h3 class="sign-title">许昌市示范区来文处理笺</h3>
            <h5 class="sign-num">编号: <el-input style="width: 80px" v-model="receivedForm.sendNum" placeholder=""></el-input></h5>
            <div class="sign-line"></div>
            <section class="sign-table-box">
              <table class="sign-table" border="0" cellspacing="0">
                <colgroup>
                  <col class="col-label">
                  <col class="col-value">
                  <col class="col-label">
                  <col class="col-value">
                </colgroup>
                <tbody>
                <tr>
                  <td>标题</td>
                  <td colspan="3">
                    <el-input class="sign-input" v-model="receivedForm.docTitle" placeholder=""></el-input>
                  </td>
                </tr>
                <tr>
                  <td>来文机关</td>
                  <td>
                    <el-input class="sign-input" v-model="receivedForm.sendCompany" placeholder=""></el-input>
                  </td>
                  <td class="border-left">时间</td>
                  <td>
                    <el-input  :disabled="true" class="sign-input" v-model="receivedForm.sendTime" placeholder="">{{nowTime}}</el-input>
                  </td>
                </tr>
                <tr>
                  <td>领导批示：</td>
                  <td colspan="3">
                    <el-input type="textarea" :disabled="true" class="sign-input" v-model="receivedForm.instructions" placeholder=""></el-input>
                  </td>
                </tr>
                <tr>
                  <td>拟办意见：</td>
                  <td colspan="3">
                    <el-input type="textarea" :disabled="true" class="sign-input" v-model="receivedForm.suggestions" placeholder=""></el-input>
                  </td>
                </tr>
                <tr>
                  <td>阅者意见：</td>
                  <td colspan="3">
                    <el-input type="textarea" :disabled="true" class="sign-input" v-model="receivedForm.readerOpinion" placeholder=""></el-input>
                  </td>
                </tr>

                <tr>
                  <td>附件：</td>
                  <td colspan="3">
                    <el-upload
                      class="upload-demo"
                      action="http://172.168.10.205:8082/ruoyi-admin/document/send/file"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-upload="handleBeforeUpload"
                      multiple
                      :limit="1"
                      accept=".pdf, .doc, .docx, .xls, .xlsx"
                      :on-exceed="handleExceed"
                      :on-success="fileSuccess"
                      :file-list="fileList">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传Excel、PDF、Word文件，且不超过10MB</div>
                    </el-upload>
                  </td>
                </tr>
                </tbody>
              </table>
            </section>
          </div>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nextTip">下一步</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="30%"
      custom-class="innerDlog"
      title="请选择拟办人"
      :visible.sync="innerVisible" :before-close="handleClose1">
      <el-form :model="innerForm" style="padding-left: 30px">
        <el-form-item label="拟办人" :label-width="formLabelWidth">
          <!--<el-cascader :options="deptUserList"   :props="{ value:'name',label:'type' }" v-model="innerForm.chargeLeader" :show-all-levels="false"  clearable></el-cascader>-->
          <el-cascader :options="deptUserList" collapse-tags
                       :props="{ checkStrictly: true,value:'name',label:'type' }"
                       v-model="innerForm.chargeLeader"
                       clearable >
          </el-cascader>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">

          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            style="width: 70%"
            v-model="innerForm.backups1">
          </el-input>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    meetList,addMeet,submitApply,taskList,getMeet,getTypeList,getDeptUser,updateSend
  } from '@/api/document/getregister';
  import {listUser} from '@/api/system/user';
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil'
  import ApprovalHistory from '@/components/activiti/approvalHistory'
  import ProcessImg from '@/components/activiti/processImg'

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'Getregister',
    data() {
      return {
        nowTime:'',
        fileList: [],
        formLabelWidth: '120px',
        innerVisible: false,
        // 审批确定按钮
        showButton: false,
        // 审批人控制表单
        showVerify: {
          ModifyApply: false,
          DeptLeaderVerify: false,
          HrVerify: false,
          ReportBack: false,
          GetPeople: false,
        },
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
        openReceived:false,
        receivedTitle:'',
        receivedForm: {
          docTitle:'',//标题
          sendNum:'',//编号
          sendCompany:'',//来文机关
          mainDept:'',//主送
          fromDept:'',//抄送
          sendTime:'',//时间
          docRemark:'',//备注
          docAttachment:'',//附件地址
          docType:'',//流程类型
          suggestions:'',//拟办意见
          instructions:'',//领导批示
          readerOpinion:'',//阅者意见
          backups1:'',//任务处理人

        },
        //流程模型
        acceptTypeList:[],
        //主管领导
        deptUserList:[],
        innerForm:{
          leader:'',//领导
          backups1:'',//备注
          chargeLeader:'',//主管领导
          generalDirector:'',//综合主任
        },
        //参会人
        options:[],
        peopOptions:[],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          type: null,
          docTitle: null,
          reason: null,
          leaveStartTime: null,
          leaveEndTime: null,
          totalTime: null,
          instanceId: null,
          applyUser: null,
          applyTime: null,
          realityStartTime: null,
          realityEndTime: null,
          processKey:null,
          processParams: {},
        },
        // 表单参数
        form: {
          meetTitle:'',
          backups1:'',
          processParams: {},
          // peoples: [],
          meetParticipants:'',
          meetContent:''
        },
        //详情
        detailQuery : {
          businessKey :'',
          processKey : '',
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
        },
        // 表单校验
        addRules: {
          meetTitle: [
            {required: true, message: '会议标题不能为空', trigger: 'blur'}
          ],
          /*startAndEndTime: [
            {required: true, message: '会议时间不能为空', trigger: 'change'}
          ],*/
          backups1: [
            { required: true, message: '负责人不能为空', trigger: 'change'}
          ],
          /*meetParticipants: [
            {required: true, message: '参会人不能为空',}
          ],*/
          meetContent: [
            {required: true, message: '会议主要内容不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.loading= false;
      getTypeList().then(response => {
        if (response.code === 200) {
          this.acceptTypeList = response.data
        }
      })
      /*let datetime = new Date();
      let year = datetime.getFullYear();
      let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      this.nowTime = year+'年'+month+'月'+date+'日';
      this.receivedForm.sendTime = this.nowTime;*/

      const path = this.$route.path.split('/').pop();
      this.path = path;
      console.log(this.path)
      // this.getLeaveList = meetList
      if ('getregister' == path) {
        this.getLeaveList = meetList
      } else if ('todo' == path) {
        this.getLeaveList = taskList
      } else if ('done' == path) {
        this.getLeaveList = taskDoneList
      }

      this.getList()
    },
    methods: {
      /*下一步*/
      nextTip(){
        if(this.receivedForm.docTitle === ''|| this.receivedForm.docTitle===null){
          this.$message({
            message: '请填写标题哦！',
            type: 'warning'
          });
          return;
        }
        if(this.receivedForm.sendCompany === ''|| this.receivedForm.sendCompany===null){
          this.$message({
            message: '请填写来文机关哦！',
            type: 'warning'
          });
          return;
        }
        if(this.receivedForm.docAttachment === ''|| this.receivedForm.docAttachment===null){
          this.$message({
            message: '请选择附件哦！',
            type: 'warning'
          });
          return;
        }
        this.innerVisible = true;
        this.readonly = false;
        getDeptUser().then(res=>{
          this.deptUserList = res;
        })
      },
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
        getMeet(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
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
              } else if ('Sign' === response.msg) {
                this.form.processParams.B_peopleSign = "true";
                this.showVerify.GetPeople = true;
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
        this.fileList = [];
        this.receivedForm= {
          docTitle:null,//标题
            sendNum:null,//编号
            sendCompany:null,//来文机关
            mainDept:null,//主送
            fromDept:null,//抄送
            sendTime:null,//时间
            docRemark:null,//备注
            docAttachment:null,//附件地址
            docType:'',//流程类型
            suggestions:null,//拟办意见
            instructions:null,//领导批示
            readerOpinion:null,//阅者意见
            backups1:null,//任务处理人

        };
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
          processParams: {},
        };
        this.innerForm = {
            leader:'',//领导
            backups1:'',//备注
            chargeLeader:'',//主管领导
            generalDirector:'',//综合主任
        },
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
      /** 收文登记按钮操作 */
      handleAdd() {
        if(this.receivedForm.docType.length === 0){
          this.open = false
          this.$message({
            message: '请选择流程模型哦！',
            type: 'warning'
          });
        }else{
          let datetime = new Date();
          let year = datetime.getFullYear();
          let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
          let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
          this.nowTime = year+'年'+month+'月'+date+'日';
          this.receivedForm.sendTime = this.nowTime;
            this.openReceived = true
            listUser().then(res =>{
              this.options = res.rows;
              this.peopOptions = res.rows;
            })
            this.readonly = false
            this.receivedTitle = ''
        }
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getMeet(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
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
        this.detailQuery.businessKey = row.id;
        this.detailQuery.processKey = row.processKey;
        getMeet(this.detailQuery).then(response => {
          this.receivedForm = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          if(response.data.docAttachment !== '' && response.data.docAttachment !== null){
            var name=response.data.docAttachment.substring(response.data.docAttachment.lastIndexOf("/")+1);
            this.fileList.push({name: name, url: response.data.docAttachment})
          }

          this.openReceived = true
          this.readonly = true
          this.title = '申请详情'
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      fileSuccess(response,file,fileList){
        this.receivedForm.docAttachment = response.fileUrl;
        if(response.code!==200){
          this.$message.error('上传失败!');
        }
      },
      handleBeforeUpload(file) {
        let extension = file.name.split(".")[1];
        let extensionList = ["pdf", "doc", "docx"];
        /* if (extensionList.indexOf(extension) < 0) {
           this.$message.warning("只能上传PDF、Word文件");
           return false;
         }*/
        const isLt50M = (file.size / 1024 / 1024) < 10;
        if (!isLt50M) {
          this.$message.error('上传文件大小不能超过 10MB!');
          return false;
        }
        console.log(file);
      },
      handleClose(done) {

        this.reset();
        this.openReceived = false;
      },
      handleClose1(done) {

        this.innerForm = {
          leader:'',//领导
          backups1:'',//备注
          chargeLeader:'',//主管领导
          generalDirector:'',//综合主任
        },
        this.innerVisible = false;
      },
      /** 提交按钮 */
      submitForm() {
        if(this.receivedForm.docTitle === ''|| this.receivedForm.docTitle===null){
          this.$message({
            message: '请填写标题哦！',
            type: 'warning'
          });
          return;
        }
        if(this.receivedForm.sendCompany === ''|| this.receivedForm.sendCompany===null){
          this.$message({
            message: '请填写来文机关哦！',
            type: 'warning'
          });
          return;
        }
        if(this.receivedForm.docAttachment === ''|| this.receivedForm.docAttachment===null){
          this.$message({
            message: '请选择附件哦！',
            type: 'warning'
          });
          return;
        }
        if(this.innerForm.chargeLeader){
          let i = this.innerForm.chargeLeader.length;
          this.receivedForm.suggestions = this.innerForm.chargeLeader[i-1];
          this.receivedForm.backups1 = this.innerForm.backups1;
        }
        if(this.readonly === true){
          updateSend(this.receivedForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('提交成功')
              this.innerVisible = false;
              // this.submitShowVerifyDialog();
              this.openReceived = false;
              this.reset();
              this.getList()
            }
          })
        }else{
          addMeet(this.receivedForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('提交成功')
              this.innerVisible = false;
              // this.submitShowVerifyDialog();
              this.openReceived = false;
              this.reset();
              this.getList()
            }
          })
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除会议编号为"' + ids + '"的数据项?', '警告', {
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
      }
    },
    watch: {
      startAndEndTime: {
        handler(newValue) {
          // this.form.leaveStartTime = newValue[0]
          // this.form.leaveEndTime = newValue[1]
          this.form.meetStartTime = newValue[0]
          this.form.meetEndTime = newValue[1]
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
  .myBorder {
    height: 60px;
    width: 70%;
    border-bottom: 1px solid red;
    border-radius: 0;
    margin-top: 20px;
  }
/** 收文登记log样式*/
  .sign-page {
    padding: 0 24px;
  }
  .sign-title {
    color: #ff0000;
    font-size: 24px;
    text-align: center;
    box-sizing: border-box;
    margin: 0;
    padding: 24px 0;
  }
  .sign-num {
    color: #ff0000;
    font-size: 14px;
    text-align: center;
    box-sizing: border-box;
    margin: 0;
    padding: 6px 0;
  }
  .sign-line {
    box-sizing: border-box;
    height: 3px;
    border-bottom: 3px solid #ff0000;
  }
  .border-left {
    border-left: 1px solid #666666;
  }
  .sign-input {
    font-size: 16px;
  }
  .sign-input .el-input__inner {
    color: #333333;
    border-radius: 0;
    border: 0 none;
    border-bottom: 1px solid transparent;
    padding: 0;
  }
  .sign-input .el-input__inner:hover {
    border-color: #C0C4CC;
  }
  .sign-input .el-input__inner:focus {
    border-color: #409EFF;
    outline: 0;
  }
  .sign-table-box {
    box-sizing: border-box;
    padding: 72px 48px 0 48px;
  }
  .sign-table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border-top: 2px solid #666666;
    border-bottom: 2px solid #666666;
    color: #333333;
  }
  .sign-table .col-label {
    width: 15%;
    box-sizing: border-box;
    border-right: 1px solid #666666;
  }
  .sign-table .col-value {
    width: 35%;
  }
  .sign-table .sign-cell {
    min-height: 72px;
  }
  .sign-table tbody tr {
    border-bottom: 1px solid #666666;
  }
  .sign-table tbody td {
    min-height: 500px;
    padding: 12px 10px;
    font-size: 16px;
  }
  /*# sourceMappingURL=./main.css.map */

 /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
   background: #F1FAFA;
   /*background: 	#F1FAFA;*/
   /*background: #A0EEE1;*/
 }

</style>
